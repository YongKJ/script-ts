import path from "path";
import {FileUtil} from "../../../../util/FileUtil";

export class WebBuild {

    private _whalesWebParentPath: string;
    private _whalesWebProjectPath: string;
    private _whalesWebProjectDistPath: string;
    private _whalesWebDistProjectPath: string;

    public constructor(whalesWebParentPath?: string, whalesWebProjectPath?: string, whalesWebProjectDistPath?: string, whalesWebDistProjectPath?: string) {
        this._whalesWebParentPath = whalesWebParentPath || "";
        this._whalesWebProjectPath = whalesWebProjectPath || "";
        this._whalesWebProjectDistPath = whalesWebProjectDistPath || "";
        this._whalesWebDistProjectPath = whalesWebDistProjectPath || "";
    }

    public static of(whalesWebParentPath: string, whalesWebProjectPath: string, whalesWebProjectDistPath: string, whalesWebDistProjectPath: string): WebBuild {
        return new WebBuild(whalesWebParentPath, whalesWebProjectPath, whalesWebProjectDistPath, whalesWebDistProjectPath);
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
}