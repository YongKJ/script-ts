import path from "path";
import {FileUtil} from "../../../../util/FileUtil";

export class WebBuild {

    private _whalesWebParentPath: string;
    private _whalesWebProjectPath: string;
    private _whalesWebProjectDistPath: string;
    private _whalesWebDistProjectPath: string;
    private _whalesWebGlobalFilePath: string;
    private _whalesWebRouterIndexPath: string;
    private _globalLogEnablePattern: string;
    private _globalLogEnableOriginal: string;
    private _globalLogEnableLatest: string;
    private _routerIndexPathPattern: string;
    private _routerIndexPathOriginal: string;
    private _routerIndexPathLatest: string;

    public constructor(whalesWebParentPath?: string, whalesWebProjectPath?: string, whalesWebProjectDistPath?: string, whalesWebDistProjectPath?: string, whalesWebGlobalFilePath?: string, globalLogEnablePattern?: string, globalLogEnableOriginal?: string, globalLogEnableLatest?: string, whalesWebRouterIndexPath?: string, routerIndexPathPattern?: string, routerIndexPathOriginal?: string, routerIndexPathLatest?: string) {
        this._whalesWebParentPath = whalesWebParentPath || "";
        this._whalesWebProjectPath = whalesWebProjectPath || "";
        this._whalesWebProjectDistPath = whalesWebProjectDistPath || "";
        this._whalesWebDistProjectPath = whalesWebDistProjectPath || "";
        this._whalesWebGlobalFilePath = whalesWebGlobalFilePath || "";
        this._whalesWebRouterIndexPath = whalesWebRouterIndexPath || "";
        this._globalLogEnablePattern = globalLogEnablePattern || "";
        this._globalLogEnableOriginal = globalLogEnableOriginal || "";
        this._globalLogEnableLatest = globalLogEnableLatest || "";
        this._routerIndexPathPattern = routerIndexPathPattern || "";
        this._routerIndexPathOriginal = routerIndexPathOriginal || "";
        this._routerIndexPathLatest = routerIndexPathLatest || "";
    }

    public static of(whalesWebParentPath: string, whalesWebProjectPath: string, whalesWebProjectDistPath: string, whalesWebDistProjectPath: string, whalesWebGlobalFilePath: string, globalLogEnablePattern: string, globalLogEnableOriginal: string, globalLogEnableLatest: string, whalesWebRouterIndexPath: string, routerIndexPathPattern: string, routerIndexPathOriginal: string, routerIndexPathLatest: string): WebBuild {
        return new WebBuild(whalesWebParentPath, whalesWebProjectPath, whalesWebProjectDistPath, whalesWebDistProjectPath, whalesWebGlobalFilePath, globalLogEnablePattern, globalLogEnableOriginal, globalLogEnableLatest, whalesWebRouterIndexPath, routerIndexPathPattern, routerIndexPathOriginal, routerIndexPathLatest);
    }

    public static get(projectPath: string): WebBuild {
        if (!FileUtil.exist(projectPath)) {
            projectPath = FileUtil.appDir(true);
        }
        let logEnableLatest = "false";
        let logEnableOriginal = "true";
        let indexPathLatest = "manage";
        let indexPathOriginal = "home";
        let parentPath = path.dirname(projectPath);
        let indexPathPattern = "\\s+name: '(\\S+)'";
        let logEnablePatten = "\\s+.+LOG_ENABLE = (\\S+);";
        let projectDistPath = projectPath + path.sep + "dist";
        let distProjectPath = parentPath + path.sep + "whales-web-dist";
        let routerIndexPath = path.resolve(projectPath, "src", "router", "index.ts");
        let globalFilePath = path.resolve(projectPath, "src", "views", "home", "common", "space", "Global.ts");
        return WebBuild.of(
            parentPath, projectPath, projectDistPath, distProjectPath,
            globalFilePath, logEnablePatten, logEnableOriginal, logEnableLatest,
            routerIndexPath, indexPathPattern, indexPathOriginal, indexPathLatest
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

    get whalesWebRouterIndexPath(): string {
        return this._whalesWebRouterIndexPath;
    }

    set whalesWebRouterIndexPath(value: string) {
        this._whalesWebRouterIndexPath = value;
    }

    get routerIndexPathPattern(): string {
        return this._routerIndexPathPattern;
    }

    set routerIndexPathPattern(value: string) {
        this._routerIndexPathPattern = value;
    }

    get routerIndexPathOriginal(): string {
        return this._routerIndexPathOriginal;
    }

    set routerIndexPathOriginal(value: string) {
        this._routerIndexPathOriginal = value;
    }

    get routerIndexPathLatest(): string {
        return this._routerIndexPathLatest;
    }

    set routerIndexPathLatest(value: string) {
        this._routerIndexPathLatest = value;
    }
}