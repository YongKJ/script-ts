import YAML from "yaml";
import {FileUtil} from "./FileUtil";
import {ChildProcess} from "child_process";

export class GenUtil {

    private constructor() {
    }

    public static toHump(name: string): string {
        return name[0].toUpperCase() + name.substring(1)
            .replace(/\-(\w)/g, (all, letter) => {
            return letter.toUpperCase();
        });
    }

    public static toLine(name: string): string {
        return name[0].toLowerCase() + name.substring(1)
            .replace(/([A-Z])/g, "-$1").toLowerCase();
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

    public static strToNumber(str?: string | null | number): number {
        return typeof str === "string" ? Number(str) : (typeof str === "undefined" || str == null ? 0 : str);
    }

    public static anyToStr(str?: any): string {
        return typeof str === "string" ? str : (typeof str === "undefined" || str == null ? "" : str + "");
    }

    public static strToList(str?: string, separator?: string): Array<string> {
        if (typeof str === "undefined" || str.length === 0) return new Array<string>();
        return str.trim().split(separator == null ? " " : separator);
    }

    public static listToStr(lstStr: Array<string>, separator?: string): string {
        let tempStr = "";
        lstStr.forEach(str => tempStr += str + (separator == null ? " " : separator));
        return tempStr.substring(0, tempStr.length - (separator == null ? 1 : separator.length));
    }

    public static readParams(child?: ChildProcess): Promise<Array<string>> {
        process.stdin.setEncoding('utf-8');
        return new Promise<Array<string>>(resolve => {
            let input = new Promise<Array<string>>(res => {
                process.stdin.resume();
                process.stdin.on('data', (data) => {
                    process.stdin.pause();
                    res(GenUtil.strToList(data.toString()));
                });
            });
            let exit = new Promise<Array<string>>(res => {
                if (typeof child !== "undefined") {
                    child.on("exit", () => {
                        res(Array.of("kill"));
                    });
                } else {
                    res(Array.of("kill"));
                }
            });
            Promise.race(typeof child === "undefined" ? [input] : [input, exit])
                .then(res => resolve(res));
        });
    }

    public static println(str?: string): void {
        console.log(str == null ? "" : str);
    }

    public static print(str: string): void {
        process.stdout.write(str);
    }

}