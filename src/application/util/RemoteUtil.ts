import terminal from "child_process";
import {GenUtil} from "./GenUtil";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";

export class RemoteUtil {

    private constructor() {
    }

    public static execLocalCmd(cmd: string | Array<string>): void {
        try {
            if (cmd instanceof Array) {
                terminal.execSync(GenUtil.listToStr(cmd, " & "), {
                    stdio: 'inherit', encoding: "utf-8"
                });
            } else {
                terminal.execSync(cmd, {
                    stdio: 'inherit', encoding: "utf-8"
                });
            }
        } catch (e) {
            LogUtil.loggerLine(Log.of("RemoteUtil", "execLocalCmd", "e", e));
        }
    }

    public static changeWorkFolder(home: string): void {
        process.chdir(home);
    }

}