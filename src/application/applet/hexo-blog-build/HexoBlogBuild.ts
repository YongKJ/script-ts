import simpleGit, {SimpleGit} from "simple-git";
import {Repository} from "gitea-js";
import {BlogBuild} from "./pojo/dto/BlogBuild";
import {GenUtil} from "../../util/GenUtil";
import {RemoteUtil} from "../../util/RemoteUtil";
import {GiteaController} from "./controller/GiteaController";
import {BuildCmd} from "./pojo/dto/BuildCmd";
import {FileUtil} from "../../util/FileUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import PathUtil from "path";
import * as DateTimeUtil from "date-fns";
import {TerminalMessage} from "../../api/pojo/dto/TerminalMessage";
import {UpgradeClientController} from "../../api/controller/UpgradeClientController";

export class HexoBlogBuild {

    private git: SimpleGit;
    private repo!: Repository;
    private readonly beginTime: number;
    private readonly blogBuild: BlogBuild;
    private giteaController: GiteaController;
    private readonly nameFilters: Array<string>;
    private readonly upgradeClientController: UpgradeClientController;

    private constructor() {
        let path = GenUtil.getValue("project-path");
        this.nameFilters = Array.of(".git", ".gitignore", "LICENSE", "README.md");
        this.upgradeClientController = new UpgradeClientController();
        this.blogBuild = BlogBuild.get(GenUtil.anyToStr(path));
        this.giteaController = new GiteaController();
        this.beginTime = +new Date();
        this.git = simpleGit();
    }

    private async apply(): Promise<void> {
        RemoteUtil.changeWorkFolder(this.blogBuild.hexoBlogProjectPath);
        this.repo = await this.giteaController.getRepo();
        let buildCmd = BuildCmd.clean_hexo_blog();
        RemoteUtil.execLocalCmd(buildCmd);
        buildCmd = BuildCmd.build_hexo_blog();
        RemoteUtil.execLocalCmd(buildCmd);
        await this.checkHexoBlogDist();
        await this.updateHexoBlogDist();
        await this.remoteServerPull();
    }

    private async checkHexoBlogDist(): Promise<void> {
        if (!FileUtil.exist(this.blogBuild.hexoBlogDistProjectPath)) {
            LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "clone"));
            await this.git.clone(<string>this.repo.clone_url, this.blogBuild.hexoBlogDistProjectPath);
        }
        this.git = simpleGit(this.blogBuild.hexoBlogDistProjectPath);

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "branch upstream"));
        await this.git.branch(["--set-upstream-to=origin/master", "master"]);

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "fetch"));
        await this.git.fetch(["--all"]);

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "reset"));
        await this.git.reset(["--hard", "origin/master"]);

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "pull"));
        await this.git.pull();

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "checkout"));
        await this.git.checkout(["--orphan", "new_branch"])

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "add"));
        await this.git.add(".");

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "commit"));
        await this.git.commit("initial commit");

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "branch delete"));
        await this.git.deleteLocalBranch("master");

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "branch modify"));
        await this.git.branch(["-m", "master"]);
    }

    public async updateHexoBlogDist(): Promise<void> {
        let files = FileUtil.list(this.blogBuild.hexoBlogDistProjectPath);
        for (let file of files) {
            let path = this.blogBuild.hexoBlogDistProjectPath + PathUtil.sep + file;
            if (this.nameFilters.includes(file)) continue;
            await FileUtil.delete(path);
        }

        files = FileUtil.list(this.blogBuild.hexoBlogProjectDistPath);
        for (let file of files) {
            let srcPath = this.blogBuild.hexoBlogProjectDistPath + PathUtil.sep + file;
            let desPath = this.blogBuild.hexoBlogDistProjectPath + PathUtil.sep + file;
            FileUtil.copy(srcPath, desPath);
        }

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "add"));
        await this.git.add("-A");

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "commit"));
        this.git.commit("[build]" + GenUtil.dateToStr(Date.now()));

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "checkHexoBlogDist", "msg", "push"));
        await this.git.push(["-f", "origin", "master"]);
    }

    private async updateGiteaRepo(): Promise<void> {
        let createDate = <Date>GenUtil.strToDate(<string>this.repo.created_at, undefined, true);
        if (DateTimeUtil.isAfter(DateTimeUtil.addDays(createDate, 1), Date.now())) return;
        LogUtil.loggerLine(Log.of("HexoBlogBuild", "updateGiteaRepo", "createDate", GenUtil.dateToStr(createDate)));
        LogUtil.loggerLine(Log.of("HexoBlogBuild", "updateGiteaRepo", "nowDate", GenUtil.dateToStr(Date.now())));

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "updateGiteaRepo", "msg", "repo delete"));
        await this.giteaController.deleteRepo();

        LogUtil.loggerLine(Log.of("HexoBlogBuild", "updateGiteaRepo", "msg", "repo create"));
        await this.giteaController.createRepo();
    }

    private async countTime(): Promise<void> {
        await this.updateGiteaRepo();
        let endTime = +new Date();
        let totalSeconds = (endTime - this.beginTime) / 1000;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds - minutes * 60);
        let timeStr = "";
        if (minutes > 0) {
            timeStr += minutes + " min ";
        }
        if (seconds > 0) {
            timeStr += seconds + " sec"
        }
        LogUtil.loggerLine(Log.of("HexoBlogBuild", "apply", "time", timeStr));
    }

    private async remoteServerPull(): Promise<void> {
        this.upgradeClientController.sendMessage(TerminalMessage.of(
            "", {
                cmd: GenUtil.getEnCode(
                    "cd /var/www/localhost/application/blog\n" +
                    "rm -rf public\n" +
                    "git clone " + this.repo.clone_url + "\n" +
                    "mv hexo-blog-dist public\n" +
                    "exit\n"
                )
            }, [], "exec"), this.countTime);
    }

    public static run(): void {
        new HexoBlogBuild().apply().then().catch(
            err => LogUtil.loggerLine(Log.of("HexoBlogBuild", "run", "err", err))
        );
    }
}