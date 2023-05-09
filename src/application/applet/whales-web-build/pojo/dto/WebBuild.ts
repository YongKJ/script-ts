import path from "path";
import {FileUtil} from "../../../../util/FileUtil";

export class WebBuild {

    private _whalesWebParentPath: string;
    private _whalesWebProjectPath: string;
    private _whalesWebProjectDistPath: string;
    private _whalesWebDistProjectPath: string;
    private _whalesWebDistRepo: string;

    public constructor(whalesWebParentPath?: string, whalesWebProjectPath?: string, whalesWebProjectDistPath?: string, whalesWebDistProjectPath?: string, whalesWebDistRepo?: string) {
        this._whalesWebParentPath = whalesWebParentPath || "";
        this._whalesWebProjectPath = whalesWebProjectPath || "";
        this._whalesWebProjectDistPath = whalesWebProjectDistPath || "";
        this._whalesWebDistProjectPath = whalesWebDistProjectPath || "";
        this._whalesWebDistRepo = whalesWebDistRepo || "";
    }

    public static of(whalesWebParentPath: string, whalesWebProjectPath: string, whalesWebProjectDistPath: string, whalesWebDistProjectPath: string, whalesWebDistRepo: string): WebBuild {
        return new WebBuild(whalesWebParentPath, whalesWebProjectPath, whalesWebProjectDistPath, whalesWebDistProjectPath, whalesWebDistRepo);
    }

    public static get(projectPath: string): WebBuild {
        if (!FileUtil.exist(projectPath)) {
            projectPath = FileUtil.appDir();
        }
        let parentPath = path.dirname(projectPath);
        let projectDistPath = projectPath + path.sep + "dist";
        let distProjectPath = parentPath + path.sep + "whales-web-dist";
        return WebBuild.of(
            parentPath, projectPath, projectDistPath, distProjectPath,
            "http://124.222.85.139:3000/DengXJ/whales-web-dist.git"
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
}