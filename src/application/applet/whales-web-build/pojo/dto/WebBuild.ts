import path from "path";
import {FileUtil} from "../../../../util/FileUtil";

export class WebBuild {

    private _whalesWebParentPath: string;
    private _whalesWebProjectPath: string;
    private _whalesWebProjectDistPath: string;
    private _whalesWebDistProjectPath: string;
    private _whalesWebDistRepo: string;
    private _serverHost: string;
    private _serverPort: number;
    private _serverUserName: string;
    private _serverPassword: string;

    public constructor(whalesWebParentPath?: string, whalesWebProjectPath?: string, whalesWebProjectDistPath?: string, whalesWebDistProjectPath?: string, whalesWebDistRepo?: string, serverHost?: string, serverPort?: number, serverUserName?: string, serverPassword?: string) {
        this._whalesWebParentPath = whalesWebParentPath || "";
        this._whalesWebProjectPath = whalesWebProjectPath || "";
        this._whalesWebProjectDistPath = whalesWebProjectDistPath || "";
        this._whalesWebDistProjectPath = whalesWebDistProjectPath || "";
        this._whalesWebDistRepo = whalesWebDistRepo || "";
        this._serverHost = serverHost || "";
        this._serverPort = serverPort || 0;
        this._serverUserName = serverUserName || "";
        this._serverPassword = serverPassword || "";
    }

    public static of(whalesWebParentPath: string, whalesWebProjectPath: string, whalesWebProjectDistPath: string, whalesWebDistProjectPath: string, whalesWebDistRepo: string, serverHost: string, serverPort: number, serverUserName: string, serverPassword: string): WebBuild {
        return new WebBuild(whalesWebParentPath, whalesWebProjectPath, whalesWebProjectDistPath, whalesWebDistProjectPath, whalesWebDistRepo, serverHost, serverPort, serverUserName, serverPassword);
    }

    public static get(projectPath: string): WebBuild {
        if (!FileUtil.exist(projectPath)) {
            projectPath = FileUtil.appDir(true);
        }
        let parentPath = path.dirname(projectPath);
        let projectDistPath = projectPath + path.sep + "dist";
        let distProjectPath = parentPath + path.sep + "whales-web-dist";
        return WebBuild.of(
            parentPath, projectPath, projectDistPath, distProjectPath,
            "http://124.222.85.139:3000/DengXJ/whales-web-dist.git",
            "", 0, "", ""
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

    get whalesWebDistRepo(): string {
        return this._whalesWebDistRepo;
    }

    set whalesWebDistRepo(value: string) {
        this._whalesWebDistRepo = value;
    }

    get serverHost(): string {
        return this._serverHost;
    }

    set serverHost(value: string) {
        this._serverHost = value;
    }

    get serverPort(): number {
        return this._serverPort;
    }

    set serverPort(value: number) {
        this._serverPort = value;
    }

    get serverUserName(): string {
        return this._serverUserName;
    }

    set serverUserName(value: string) {
        this._serverUserName = value;
    }

    get serverPassword(): string {
        return this._serverPassword;
    }

    set serverPassword(value: string) {
        this._serverPassword = value;
    }
}