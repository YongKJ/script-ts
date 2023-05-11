import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {RemoteUtil} from "../../util/RemoteUtil";
import {FileUtil} from "../../util/FileUtil";
import simpleGit, {SimpleGit} from "simple-git";
import {WebBuild} from "./pojo/dto/WebBuild";
import {BuildCmd} from "./pojo/dto/BuildCmd";
import PathUtil from "path";
import * as ssh2 from "ssh2";
import {Repository} from "gitea-js";
import fetch from "cross-fetch"
import {Global} from "./config/Global";
import * as DateTimeUtil from "date-fns";
import {GiteaController} from "./controller/GiteaController";

export class WhalesWebBuild {

    private git: SimpleGit;
    private repo!: Repository;
    private readonly beginTime: number;
    private readonly webBuild: WebBuild;
    private readonly names: Array<string>;
    private giteaController: GiteaController;

    private constructor() {
        this.names = Array.of("css", "fonts", "img", "js", "model", "index.html", "favicon.ico");
        let path = GenUtil.getValue("whales-web-build.yaml", "project-path");
        this.webBuild = WebBuild.get(GenUtil.anyToStr(path));
        this.giteaController = new GiteaController();
        this.beginTime = +new Date();
        this.git = simpleGit();
    }

    private async apply(): Promise<void> {
        RemoteUtil.changeWorkFolder(this.webBuild.whalesWebProjectPath);
        this.repo = await this.giteaController.getRepo();
        let buildCmd = BuildCmd.build_whales_web();
        RemoteUtil.execLocalCmd(buildCmd);
        await this.checkWhalesWebDist();
        await this.updateWhalesWebDist();
        await this.remoteServerPull();
    }

    private async checkWhalesWebDist(): Promise<void> {
        if (!FileUtil.exist(this.webBuild.whalesWebDistProjectPath)) {
            LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "clone"));
            await this.git.clone(<string>this.repo.clone_url, this.webBuild.whalesWebDistProjectPath);
        }
        this.git = simpleGit(this.webBuild.whalesWebDistProjectPath);

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "branch upstream"));
        await this.git.branch(["--set-upstream-to=origin/master", "master"]);

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "fetch"));
        await this.git.fetch(["--all"]);

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "reset"));
        await this.git.reset(["--hard", "origin/master"]);

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "pull"));
        await this.git.pull();

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "checkout"));
        await this.git.checkout(["--orphan", "new_branch"])

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "add"));
        await this.git.add(".");

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "commit"));
        await this.git.commit("initial commit");

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "branch delete"));
        await this.git.deleteLocalBranch("master");

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "branch modify"));
        await this.git.branch(["-m", "master"]);
    }

    private async updateWhalesWebDist(): Promise<void> {
        let files = FileUtil.list(this.webBuild.whalesWebDistProjectPath);
        for (let file of files) {
            let path = this.webBuild.whalesWebDistProjectPath + PathUtil.sep + file;
            if (!this.names.includes(file)) continue;
            await FileUtil.delete(path);
        }

        files = FileUtil.list(this.webBuild.whalesWebProjectDistPath);
        for (let file of files) {
            let srcPath = this.webBuild.whalesWebProjectDistPath + PathUtil.sep + file;
            let desPath = this.webBuild.whalesWebDistProjectPath + PathUtil.sep + file;
            FileUtil.copy(srcPath, desPath);
        }

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "add"));
        await this.git.add("-A");

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "commit"));
        this.git.commit("[build]" + GenUtil.dateToStr(Date.now()));

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "push"));
        await this.git.push(["-f", "origin", "master"]);
    }

    private async updateGiteaRepo(): Promise<void> {
        let createDate = <Date>GenUtil.strToDate(<string>this.repo.created_at, undefined, true);
        if (DateTimeUtil.isAfter(DateTimeUtil.addDays(createDate, 1), Date.now())) return;
        LogUtil.loggerLine(Log.of("WhalesWebBuild", "updateGiteaRepo", "createDate", GenUtil.dateToStr(createDate)));
        LogUtil.loggerLine(Log.of("WhalesWebBuild", "updateGiteaRepo", "nowDate", GenUtil.dateToStr(Date.now())));

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "updateGiteaRepo", "msg", "repo delete"));
        await this.giteaController.deleteRepo();

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "updateGiteaRepo", "msg", "repo create"));
        await this.giteaController.createRepo();
    }

    private async countTime(): Promise<void> {
        await this.updateGiteaRepo();
        let endTime = +new Date();
        let totalSeconds = (endTime - this.beginTime) / 1000;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds - minutes * 60);
        LogUtil.loggerLine(Log.of("WhalesWebBuild", "apply", "time", minutes + " min " + seconds + " sec"));
        LogUtil.loggerLine(Log.of("WhalesWebBuild", "remoteServerPull", "msg", "done"));
    }

    private async remoteServerPull(): Promise<void> {
        let client = new ssh2.Client();
        await client.on("ready", () => {
            client.shell((err, stream) => {
                if (err) throw err;
                LogUtil.loggerLine(Log.of("WhalesWebBuild", "remoteServerPull", "msg", "server pull"));
                console.log("--------------------------------------------------------------------------------------------------------------");
                stream.on('close', async () => {
                    console.log("--------------------------------------------------------------------------------------------------------------");
                    await this.countTime();
                    client.end();
                }).on('data', (data: Buffer) => {
                    console.log(data.toString("utf-8"));
                }).stderr.on('data', err => {
                    this.countTime();
                    LogUtil.loggerLine(Log.of("WhalesWebBuild", "remoteServerPull", "err", err));
                    client.end();
                });
                stream.end(
                    "cd /mydata\n" +
                    "rm -rf whaleshub\n" +
                    "git clone " + this.repo.clone_url + "\n" +
                    "mv whales-web-dist whaleshub\n" +
                    "exit\n"
                );
            });
        }).connect({
            host: Global.SERVER_HOST,
            port: Global.SERVER_PORT,
            username: Global.SERVER_USERNAME,
            password: Global.SERVER_PASSWORD
        });
    }

    public static run(): void {
        new WhalesWebBuild().apply().then();
    }

}