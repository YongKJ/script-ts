import PathUtil from "path";
import fs from "fs";

export class FileUtil {

    private constructor() {
    }

    public static appDir(isPros?: boolean): string {
        let launchName = require.main?.filename;
        if (typeof launchName === "undefined") {
            launchName = __filename;
        }
        let appDir = PathUtil.dirname(launchName);
        if (isPros) return appDir;
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

    public static read(fileName: string): string {
        return fs.readFileSync(fileName, "utf-8");
    }

    public static write(fileName: string, content: string): void {
        fs.writeFileSync(fileName, content);
    }

}