import PathUtil from "path";
import path from "path";
import fs from "fs";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";
import {rimraf} from "rimraf";

export class FileUtil {

    private constructor() {
    }

    public static getLaunchName(): string {
        let launchName = require.main?.filename;
        if (typeof launchName === "undefined") {
            return __filename;
        }
        return launchName;
    }

    public static appDir(isProd?: boolean): string {
        let launchName = this.getLaunchName();
        let appDir = PathUtil.dirname(launchName);
        if (isProd) return appDir;
        return PathUtil.dirname(appDir);
    }

    public static getAbsPath(isProd: boolean, ...names: string[]): string {
        let path = this.appDir(isProd);
        for (let name of names) {
            path += PathUtil.sep + name;
        }
        return path;
    }

    public static exist(fileName: string): boolean {
        return fs.existsSync(fileName);
    }

    public static readFile(fileName: string): string {
        let fileContent = fs.readFileSync(fileName, 'binary');
        return Buffer.from(fileContent, 'binary').toString("base64");
    }

    public static read(fileName: string): string {
        return fs.readFileSync(fileName, "utf-8");
    }

    public static readByLine(fileName: string): Array<string> {
        let content = fs.readFileSync(fileName, "utf-8");
        let sep = content.includes("\r\n") ? "\r\n" : "\n";
        return content.split(sep);
    }

    public static write(fileName: string, content: string): void {
        fs.writeFileSync(fileName, content);
    }

    public static list(fileName: string): Array<string> {
        try {
            fs.accessSync(fileName, fs.constants.R_OK);
            return fs.readdirSync(fileName);
        } catch (e) {
            LogUtil.loggerLine(Log.of("FileUtil", "list", "e", e));
            return new Array<string>();
        }
    }

    public static isFolder(fileName: string): boolean {
        return fs.statSync(fileName).isDirectory();
    }

    public static modDate(fileName: string): Date {
        return fs.statSync(fileName).mtime;
    }

    public static size(fileName: string): number {
        if (this.isFolder(fileName)) {
            return this.sizeFolder(fileName);
        }
        return fs.statSync(fileName).size;
    }

    public static mkdir(fileName: string): void {
        if (!this.exist(fileName)) {
            fs.mkdirSync(fileName, {recursive: true})
        }
    }

    public static copy(srcFileName: string, desFileName: string): void {
        if (this.isFolder(srcFileName)) {
            this.mkdir(desFileName);
            this.copyFolder(srcFileName, desFileName);
        } else {
            fs.copyFileSync(srcFileName, desFileName);
        }
    }

    private static copyFolder(srcFolderName: string, desFolderName: string): void {
        let files = this.list(srcFolderName);
        for (let file of files) {
            let srcNewFileName = srcFolderName + path.sep + file;
            let desNewFileName = desFolderName + path.sep + file;
            if (this.isFolder(srcNewFileName)) {
                this.mkdir(desNewFileName);
                this.copyFolder(srcNewFileName, desNewFileName);
            } else {
                this.copy(srcNewFileName, desNewFileName);
            }
        }
    }

    public static async delete(fileName: string): Promise<void> {
        if (!this.exist(fileName)) return;
        return new Promise<void>(resolve => {
            rimraf(fileName).then(() => resolve());
        });
    }

    private static sizeFolder(fileName: string): number {
        let folderSize = 0;
        let files = this.list(fileName);
        for (let file of files) {
            let tempFileName = fileName + path.sep + file;
            if (this.isFolder(tempFileName)) {
                folderSize += this.sizeFolder(tempFileName);
            } else {
                folderSize += this.size(tempFileName);
            }
        }
        return folderSize;
    }

    public static modFile(path: string, regStr: string, value: string, isAll?: boolean): void {
        this.modifyFile(path, regStr, () => value, isAll);
    }

    public static modifyFile(path: string, regStr: string, valueFunc: (allStr?: string, lstMatchStr?: Array<string>) => string, isAll?: boolean): void {
        let regex = isAll ? new RegExp(regStr, "g") : new RegExp(regStr);
        let content = this.read(path).replace(regex, (allStr,  lstMatchStr) => valueFunc(allStr, lstMatchStr));
        this.write(path, content);
    }

    public static modContent(path: string, regStr: string, value: string, isAll?: boolean): void {
        this.modify(path, regStr, () => value, isAll);
    }

    public static modify(path: string, regStr: string, valueFunc: (matchStr?: string) => string, isAll?: boolean): void {
        let content = this.read(path);
        let contentBreak = content.includes("\r\n") ? "\r\n" : "\n";
        let contentArray = content.split(contentBreak);
        let regex = new RegExp(regStr);
        for (let i = 0; i < contentArray.length; i++) {
            let line = contentArray[i];
            if (!regex.test(line)) continue;
            let lstMatch = line.match(regex);
            if (lstMatch == null) continue;
            contentArray[i] = line.replace(lstMatch[1], valueFunc(lstMatch[1]));
            if (typeof isAll === "undefined" || !isAll) {
                break;
            }
        }
        this.write(path, contentArray.join(contentBreak));
    }

}