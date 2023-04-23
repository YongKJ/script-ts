import {WebpackConfig} from "../pojo/dto/WebpackConfig";
import {Script} from "../pojo/po/Script";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {GenUtil} from "../../util/GenUtil";
import {FileUtil} from "../../util/FileUtil";
import {RemoteUtil} from "../../util/RemoteUtil";
import {CmdUtil} from "../../util/CmdUtil";
import PathUtil from "path";

export class BuildScriptService {

    private readonly scripts: Array<Script>;
    private readonly webpackConfig: WebpackConfig;

    private constructor() {
        this.scripts = Script.get();
        this.webpackConfig = WebpackConfig.get();
    }

    private test(): void {
        LogUtil.loggerLine(Log.of("BuildScriptService", "test", "webpackConfig", this.webpackConfig));
        LogUtil.loggerLine(Log.of("BuildScriptService", "test", "scripts", this.scripts));
    }

    private async apply(): Promise<void> {
        GenUtil.println();
        for (let i = 0; i < this.scripts.length; i++) {
            GenUtil.println((i + 1) + ". " + this.scripts[i].tsName);
        }
        GenUtil.print("Please enter one or more numbers corresponding to the script: ");
        let nums = await GenUtil.readParams();
        if (nums.length === 0) return;
        GenUtil.println();

        for (let num of nums) {
            let index = GenUtil.strToNumber(num) - 1;
            if (0 <= index && index < this.scripts.length) {
                this.build(this.scripts[index]);
            }
        }
    }

    private build(script: Script): void {
        BuildScriptService.changeTsScript(script, "before");
        this.changeBuildConfig(script, "before");

        RemoteUtil.changeWorkFolder(FileUtil.appDir());
        let buildCmd = CmdUtil.build_ts_script();
        RemoteUtil.execLocalCmd(buildCmd);
        if (FileUtil.exist(script.yamlConfig)) {
            FileUtil.copy(script.yamlConfig, script.scriptConfig);
        }

        BuildScriptService.changeTsScript(script, "after");
        this.changeBuildConfig(script, "after");

        BuildScriptService.updateScript(script);
    }

    private static updateScript(script: Script): void {
        let content = FileUtil.read(script.scriptPath);
        content = "#!/usr/bin/node\n" + content;
        FileUtil.write(script.scriptPath, content);

        let scriptDir = FileUtil.getAbsPath(false, "script");
        let files = FileUtil.list(scriptDir);
        for (let file of files) {
            let path = scriptDir + PathUtil.sep + file;
            if (/.*\.txt$/.test(file)) {
                FileUtil.delete(path).then();
            }
        }
    }

    private static changeTsScript(script: Script, type: string): void {
        let content = FileUtil.read(script.tsPath);
        content = type === "before" ? content + script.contentAppendValue :
            content.replace(script.contentAppendValue, "");
        FileUtil.write(script.tsPath, content);
    }

    private changeBuildConfig(script: Script, type: string): void {
        FileUtil.modContent(
            this.webpackConfig.path, this.webpackConfig.entryPattern,
            type === "before" ? script.jsRelPath : this.webpackConfig.entryOriginal
        );
        FileUtil.modContent(
            this.webpackConfig.path, this.webpackConfig.outputPathPattern,
            type === "before" ? this.webpackConfig.outputPathLatest : this.webpackConfig.outputPathOriginal
        );
        FileUtil.modContent(
            this.webpackConfig.path, this.webpackConfig.outputFilenamePattern,
            type === "before" ? script.scriptName : this.webpackConfig.outputFilenameOriginal
        );
    }

    public static run(): void {
        new BuildScriptService().apply().then();
    }

}

BuildScriptService.run();