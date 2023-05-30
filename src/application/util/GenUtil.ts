import YAML from "yaml";
import {FileUtil} from "./FileUtil";
import {ChildProcess} from "child_process";
import * as DateTimeUtil from "date-fns";
import {OrbitEncoder} from "orbit-encoder/lib/OrbitEncoder"
import crypto from "crypto";
import {DataUtil} from "./DataUtil";

export class GenUtil {

    private constructor() {
    }

    public static objToRecord<T>(obj: T): Record<string, any> {
        let recData: Record<string, any> = {};
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            recData[methodName] = obj[<keyof T>methodName];
        }
        return recData;
    }

    public static sleep(waitTimeInMs: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }

    public static timer(func: () => void, time: number): void {
        setTimeout(func, time);
    }

    public static getMd5Str(str: string): string {
        return crypto.createHash("md5").update(String(str)).digest("hex").toUpperCase();
    }

    private static getEnCodeStr(str: string): string {
        return OrbitEncoder.encodeWithURIsafe(Buffer.from(str).toString("base64"));
    }

    public static getEnCode(lstStr: Array<string> | string): Array<string> | string {
        if (typeof lstStr === "string") return this.getEnCodeStr(lstStr);
        let strs = new Array<string>();
        lstStr.forEach(str => strs.push(this.getEnCodeStr(str)))
        return strs;
    }

    public static mapToRecord(mapData: Map<string, any>): Record<string, any> {
        let recData: Record<string, any> = {};
        for (let [key, value] of mapData) {
            recData[key] = value;
        }
        return recData;
    }

    public static mapToObj(mapData: Map<string, any>): object {
        const objData: Record<string, any> = {};
        for (let [key, value] of mapData.entries()) {
            objData[key] = value;
        }
        return objData;
    }

    public static strToDate(timeStr: string, format?: string, isISO?: boolean): Date | null {
        format = format || "yyyy-MM-dd HH:mm:ss";
        let date = DateTimeUtil.parseISO(timeStr);
        if (DateTimeUtil.isValid(date)) {
            return isISO ? date : DateTimeUtil.parse(timeStr, format, new Date());
        }
        return null;
    }

    public static dateToStr(time: Date | number, format?: string): string {
        format = format || "yyyy-MM-dd HH:mm:ss";
        return DateTimeUtil.format(time, format);
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

    public static getConfig(config: string): Record<string, any> {
        let path = this.getConfigPath(config);
        let content = FileUtil.read(path);
        return YAML.parse(content);
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

    public static readCommand(): string {
        return process.argv.length > 2 ? process.argv[2] : "";
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