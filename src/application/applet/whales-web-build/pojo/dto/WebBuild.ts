import path from "path";
import {FileUtil} from "../../../../util/FileUtil";

export class WebBuild {

    private _whalesWebParentPath: string;
    private _whalesWebProjectPath: string;
    private _whalesWebProjectDistPath: string;
    private _whalesWebDistProjectPath: string;
    private _whalesWebGlobalFilePath: string;
    private _globalLogEnablePattern: string;
    private _globalLogEnableOriginal: string;
    private _globalLogEnableLatest: string;

    public constructor(whalesWebParentPath?: string, whalesWebProjectPath?: string, whalesWebProjectDistPath?: string, whalesWebDistProjectPath?: string, whalesWebGlobalFilePath?: string, globalLogEnablePattern?: string, globalLogEnableOriginal?: string, globalLogEnableLatest?: string) {
        this._whalesWebParentPath = whalesWebParentPath || "";
        this._whalesWebProjectPath = whalesWebProjectPath || "";
        this._whalesWebProjectDistPath = whalesWebProjectDistPath || "";
        this._whalesWebDistProjectPath = whalesWebDistProjectPath || "";
        this._whalesWebGlobalFilePath = whalesWebGlobalFilePath || "";
        this._globalLogEnablePattern = globalLogEnablePattern || "";
        this._globalLogEnableOriginal = globalLogEnableOriginal || "";
        this._globalLogEnableLatest = globalLogEnableLatest || "";
    }

    public static of(whalesWebParentPath: string, whalesWebProjectPath: string, whalesWebProjectDistPath: string, whalesWebDistProjectPath: string, whalesWebGlobalFilePath: string, globalLogEnablePattern: string, globalLogEnableOriginal: string, globalLogEnableLatest: string): WebBuild {
        return new WebBuild(whalesWebParentPath, whalesWebProjectPath, whalesWebProjectDistPath, whalesWebDistProjectPath, whalesWebGlobalFilePath, globalLogEnablePattern, globalLogEnableOriginal, globalLogEnableLatest);
    }

    public static get(projectPath: string): WebBuild {
        if (!FileUtil.exist(projectPath)) {
            projectPath = FileUtil.appDir(true);
        }
        let logEnableLatest = "false";
        let logEnableOriginal = "true";
        let parentPath = path.dirname(projectPath);
        let logEnablePatten = "\\s+.+LOG_ENABLE = (\\S+);";
        let projectDistPath = projectPath + path.sep + "dist";
        let distProjectPath = parentPath + path.sep + "whales-web-dist";
        let globalFilePath = path.resolve(projectPath, "src", "views", "home", "common", "space", "Global.ts");
        return WebBuild.of(
            parentPath, projectPath, projectDistPath, distProjectPath,
            globalFilePath, logEnablePatten, logEnableOriginal, logEnableLatest
        );
    }

    get whalesWebParentPath(): string {
        return this._whalesWebParentPath;
    }

    set whalesWebParentPath(value: string) {
        this._whalesWebParentPath = value;
    }

    get whalesWebProjectPath(): string {
        return this._whalesWebProjectPath;
    }

    set whalesWebProjectPath(value: string) {
        this._whalesWebProjectPath = value;
    }

    get whalesWebProjectDistPath(): string {
        return this._whalesWebProjectDistPath;
    }

    set whalesWebProjectDistPath(value: string) {
        this._whalesWebProjectDistPath = value;
    }

    get whalesWebDistProjectPath(): string {
        return this._whalesWebDistProjectPath;
    }

    set whalesWebDistProjectPath(value: string) {
        this._whalesWebDistProjectPath = value;
    }

    get whalesWebGlobalFilePath(): string {
        return this._whalesWebGlobalFilePath;
    }

    set whalesWebGlobalFilePath(value: string) {
        this._whalesWebGlobalFilePath = value;
    }

    get globalLogEnablePattern(): string {
        return this._globalLogEnablePattern;
    }

    set globalLogEnablePattern(value: string) {
        this._globalLogEnablePattern = value;
    }

    get globalLogEnableOriginal(): string {
        return this._globalLogEnableOriginal;
    }

    set globalLogEnableOriginal(value: string) {
        this._globalLogEnableOriginal = value;
    }

    get globalLogEnableLatest(): string {
        return this._globalLogEnableLatest;
    }

    set globalLogEnableLatest(value: string) {
        this._globalLogEnableLatest = value;
    }
}