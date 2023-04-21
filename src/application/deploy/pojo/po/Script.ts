import {FileUtil} from "../../../util/FileUtil";
import path from "path";
import {GenUtil} from "../../../util/GenUtil";
import * as DateTimeUtil from "date-fns";

export class Script {

    private _tsName: string;
    private _tsPath: string;
    private _tsSize: number;
    private _tsTime: Date;
    private _jsName: string;
    private _jsPath: string;
    private _jsRelPath: string;
    private _jsSize: number;
    private _jsTime: Date;
    private _scriptName: string;
    private _scriptPath: string;
    private _scriptConfig: string;
    private _yamlConfig: string;
    private _contentAppendValue: string;

    public constructor(tsName?: string, tsPath?: string, tsSize?: number, tsTime?: Date, jsName?: string, jsPath?: string, jsRelPath?: string, jsSize?: number, jsTime?: Date, scriptName?: string, scriptPath?: string, scriptConfig?: string, yamlConfig?: string, contentAppendValue?: string) {
        this._tsName = tsName || "";
        this._tsPath = tsPath || "";
        this._tsSize = tsSize || 0;
        this._tsTime = tsTime || new Date();
        this._jsName = jsName || "";
        this._jsPath = jsPath || "";
        this._jsRelPath = jsRelPath || "";
        this._jsSize = jsSize || 0;
        this._jsTime = jsTime || new Date();
        this._scriptName = scriptName || "";
        this._scriptPath = scriptPath || "";
        this._scriptConfig = scriptConfig || "";
        this._yamlConfig = yamlConfig || "";
        this._contentAppendValue = contentAppendValue || "";
    }

    public static of(tsName: string, tsPath: string, tsSize: number, tsTime: Date, jsName: string, jsPath: string, jsRelPath: string, jsSize: number, jsTime: Date, scriptName: string, scriptPath: string, scriptConfig: string, yamlConfig: string, contentAppendValue: string): Script {
        return new Script(tsName, tsPath, tsSize, tsTime, jsName, jsPath, jsRelPath, jsSize, jsTime, scriptName, scriptPath, scriptConfig, yamlConfig, contentAppendValue);
    }

    public static get(): Array<Script> {
        let appletDir = FileUtil.getAbsPath(false, "src", "application", "applet");
        let assetsDir = FileUtil.getAbsPath(false, "src", "assets");
        let scriptDir = FileUtil.getAbsPath(false, "script");
        let distDir = FileUtil.getAbsPath(false, "dist");
        let srcDir = FileUtil.getAbsPath(false, "src");
        let lstFile = FileUtil.list(appletDir);
        let lstScript = new Array<Script>();
        for (let file of lstFile) {
            let tsPath = appletDir + path.sep + file;
            if (FileUtil.isFolder(tsPath)) {
                tsPath = this.getScript(tsPath);
            }
            let index = tsPath.lastIndexOf(path.sep);
            let tsName = tsPath.substring(index + 1);
            let jsPath = tsPath.replace(srcDir, distDir);
            jsPath = jsPath.replace(".ts", ".js");
            let jsRelPath = jsPath.replace(distDir, "./dist");
            jsRelPath = jsRelPath.replace(/\\/g, "/");
            index = jsPath.lastIndexOf(path.sep);
            let jsName = jsPath.substring(index + 1);
            let className = this.getClassName(tsName);
            let contentAppendValue = "\r\n\r\n" + className + ".run();";
            let scriptName = GenUtil.toLine(tsName).replace(".ts", ".js");
            let scriptPath = scriptDir + path.sep + scriptName;
            let scriptConfig = scriptPath.replace(".js", ".yaml");
            let yamlName = scriptName.replace(".js", ".yaml");
            let yamlConfig = assetsDir + path.sep + yamlName;
            lstScript.push(Script.of(
                tsName, tsPath, FileUtil.size(tsPath), FileUtil.modDate(tsPath),
                jsName, jsPath, jsRelPath, FileUtil.size(jsPath), FileUtil.modDate(jsPath),
                scriptName, scriptPath, scriptConfig, yamlConfig, contentAppendValue
            ));
        }
        return this.sortByTimeDesc(lstScript);
    }

    private static sortByTimeDesc(scripts: Array<Script>): Array<Script> {
        if (scripts.length < 2) return scripts;
        return scripts.sort((p1, p2) => DateTimeUtil.compareDesc(p1.tsTime, p2.tsTime));
    }

    private static getClassName(tsName: string): string {
        return (<Array<any>>tsName.match(/(.*)\.ts$/))[1]
    }

    private static getScript(folder: string): string {
        let files = FileUtil.list(folder);
        let script = files.find(file => /.*\.ts$/.test(file));
        return typeof script === "undefined" ? "" : folder + path.sep + script;
    }

    get tsName(): string {
        return this._tsName;
    }

    set tsName(value: string) {
        this._tsName = value;
    }

    get tsPath(): string {
        return this._tsPath;
    }

    set tsPath(value: string) {
        this._tsPath = value;
    }

    get tsSize(): number {
        return this._tsSize;
    }

    set tsSize(value: number) {
        this._tsSize = value;
    }

    get tsTime(): Date {
        return this._tsTime;
    }

    set tsTime(value: Date) {
        this._tsTime = value;
    }

    get jsName(): string {
        return this._jsName;
    }

    set jsName(value: string) {
        this._jsName = value;
    }

    get jsPath(): string {
        return this._jsPath;
    }

    set jsPath(value: string) {
        this._jsPath = value;
    }

    get jsRelPath(): string {
        return this._jsRelPath;
    }

    set jsRelPath(value: string) {
        this._jsRelPath = value;
    }

    get scriptName(): string {
        return this._scriptName;
    }

    set scriptName(value: string) {
        this._scriptName = value;
    }

    get scriptConfig(): string {
        return this._scriptConfig;
    }

    set scriptConfig(value: string) {
        this._scriptConfig = value;
    }

    get jsSize(): number {
        return this._jsSize;
    }

    set jsSize(value: number) {
        this._jsSize = value;
    }

    get jsTime(): Date {
        return this._jsTime;
    }

    set jsTime(value: Date) {
        this._jsTime = value;
    }

    get scriptPath(): string {
        return this._scriptPath;
    }

    set scriptPath(value: string) {
        this._scriptPath = value;
    }

    get yamlConfig(): string {
        return this._yamlConfig;
    }

    set yamlConfig(value: string) {
        this._yamlConfig = value;
    }

    get contentAppendValue(): string {
        return this._contentAppendValue;
    }

    set contentAppendValue(value: string) {
        this._contentAppendValue = value;
    }
}