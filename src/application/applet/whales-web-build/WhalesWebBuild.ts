import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {RemoteUtil} from "../../util/RemoteUtil";
import {FileUtil} from "../../util/FileUtil";
import simpleGit, {SimpleGit} from "simple-git";
import {WebBuild} from "./pojo/dto/WebBuild";
import PathUtil from "path";
import {BuildCmd} from "./pojo/dto/BuildCmd";

export class WhalesWebBuild {

    private git: SimpleGit;
    private readonly webBuild: WebBuild;
    private readonly names: Array<string>;

    private constructor() {
        this.names = Array.of("css", "fonts", "img", "js", "model", "index.html", "favicon.ico");
        let value = GenUtil.getValue("whales-web-build.yaml", "project-path");
        this.webBuild = WebBuild.get(GenUtil.anyToStr(value));
        this.git = simpleGit();
    }

    private async apply(): Promise<v> {
        RemoteUtil.changeWorkFolder(this.webBuild.whalesWebProjectPath);
        let buildCmd = BuildCmd.build_whales_web();
        RemoteUtil.execLocalCmd(buildCmd);
        await this.checkWhalesWebDist();
        await this.updateWhalesWebDist();
    }

    private async checkWhalesWebDist(): Promise<void> {
        if (!FileUtil.exist(this.webBuild.whalesWebDistProjectPath)) {
            LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "git clone"));
            await this.git.clone(this.webBuild.whalesWebDistRepo, this.webBuild.whalesWebDistProjectPath);
        }
        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "git pull"));
        this.git = simpleGit(this.webBuild.whalesWebDistProjectPath);
        await this.git.pull();
    }

    private async updateWhalesWebDist(): Promise<void> {
        let files = FileUtil.list(this.webBuild.whalesWebDistProjectPath);
        for (let file of files) {
            let path = this.webBuild.whalesWebDistProjectPath + PathUtil.sep + file;
            if (!this.names.includes(file)) continue;
            FileUtil.delete(path).then();
        }

        files = FileUtil.list(this.webBuild.whalesWebProjectDistPath);
        for (let file of files) {
            let srcPath = this.webBuild.whalesWebProjectDistPath + PathUtil.sep + file;
            let desPath = this.webBuild.whalesWebDistProjectPath + PathUtil.sep + file;
            FileUtil.copy(srcPath, desPath);
        }

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "git add"));
        await this.git.add("-A");

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "git commit"));
        this.git.commit("[build]" + GenUtil.dateToStr(Date.now()));

        LogUtil.loggerLine(Log.of("WhalesWebBuild", "checkWhalesWebDist", "msg", "git push"));
        await this.git.push();
    }

    public static run(): void {
        new WhalesWebBuild().apply().then();
    }

}