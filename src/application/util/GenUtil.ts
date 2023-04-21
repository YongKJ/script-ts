import YAML from "yaml";
import {FileUtil} from "./FileUtil";

export class GenUtil {

    private constructor() {
    }

    public static getValue(config: string, key: string): unknown {
        let path = this.getConfigPath(config);
        let content = FileUtil.read(path);
        return YAML.parse(content)[key];
    }

    public static writeConfig(config: string, recData: Record<string, any>): void {
        let path = this.getConfigPath(config);
        let content = YAML.stringify(recData);
        FileUtil.write(path, content);
    }

    private static getConfigPath(config: string): string {
        let path = FileUtil.getAbsPath(true, config);
        if (!FileUtil.exist(path)) {
            path = FileUtil.getAbsPath(false, "src", "assets", config);
        }
        return path;
    }

    public static anyToStr(str?: any): string {
        return typeof str === "string" ? str : (typeof str === "undefined" || str == null ? "" : str + "");
    }

}