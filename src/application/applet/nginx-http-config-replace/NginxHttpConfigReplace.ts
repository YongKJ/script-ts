import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {FileUtil} from "../../util/FileUtil";
import * as PathUtil from "path";

export class NginxHttpConfigReplace {

    private readonly path: string;
    private readonly domainName: string;

    private constructor() {
        this.path = <string>GenUtil.getValue("path");
        this.domainName = <string>GenUtil.getValue("domain-name");
    }

    private apply(): void {
        LogUtil.loggerLine(Log.of("NginxHttpConfigReplace", "apply", "this.path", this.path));
        LogUtil.loggerLine(Log.of("NginxHttpConfigReplace", "apply", "this.domainName", this.domainName));

        let regexStr = "\\s+listen\\s+(\\S+)\\s+ssl;";
        let lstFile = FileUtil.list(this.path);
        for (let file of lstFile) {
            let filePath = PathUtil.join(this.path, file);
            LogUtil.loggerLine(Log.of("NginxHttpConfigReplace", "apply", "filePath", filePath));
            if (FileUtil.isFolder(filePath)) {
                continue;
            }
            FileUtil.modContent(filePath, regexStr, this.domainName);
        }
    }

    public static run(): void {
        new NginxHttpConfigReplace().apply();
    }

}