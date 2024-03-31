import {FileUtil} from "../../../../util/FileUtil";
import path from "path";
import {Global} from "../../../../api/config/Global";

export class BlogBuild {

    private _hexoBlogParentPath: string;
    private _hexoBlogProjectPath: string;
    private _hexoBlogProjectDistPath: string;
    private _hexoBlogDistProjectPath: string;

    public constructor(hexoBlogParentPath?: string, hexoBlogProjectPath?: string, hexoBlogProjectDistPath?: string, hexoBlogDistProjectPath?: string) {
        this._hexoBlogParentPath = hexoBlogParentPath || "";
        this._hexoBlogProjectPath = hexoBlogProjectPath || "";
        this._hexoBlogProjectDistPath = hexoBlogProjectDistPath || "";
        this._hexoBlogDistProjectPath = hexoBlogDistProjectPath || "";
    }

    public static of(hexoBlogParentPath: string, hexoBlogProjectPath: string, hexoBlogProjectDistPath: string, hexoBlogDistProjectPath: string): BlogBuild {
        return new BlogBuild(hexoBlogParentPath, hexoBlogProjectPath, hexoBlogProjectDistPath, hexoBlogDistProjectPath);
    }

    public static get(projectPath: string): BlogBuild {
        if (!FileUtil.exist(projectPath)) {
            projectPath = FileUtil.appDir(true);
        }
        let parentPath = path.dirname(projectPath);
        let projectDistPath = projectPath + path.sep + "public";
        let distProjectPath = parentPath + path.sep + Global.PROJECT_REPO_NAME;
        return BlogBuild.of(
            parentPath, projectPath,
            projectDistPath, distProjectPath
        );
    }

    get hexoBlogParentPath(): string {
        return this._hexoBlogParentPath;
    }

    set hexoBlogParentPath(value: string) {
        this._hexoBlogParentPath = value;
    }

    get hexoBlogProjectPath(): string {
        return this._hexoBlogProjectPath;
    }

    set hexoBlogProjectPath(value: string) {
        this._hexoBlogProjectPath = value;
    }

    get hexoBlogProjectDistPath(): string {
        return this._hexoBlogProjectDistPath;
    }

    set hexoBlogProjectDistPath(value: string) {
        this._hexoBlogProjectDistPath = value;
    }

    get hexoBlogDistProjectPath(): string {
        return this._hexoBlogDistProjectPath;
    }

    set hexoBlogDistProjectPath(value: string) {
        this._hexoBlogDistProjectPath = value;
    }
}