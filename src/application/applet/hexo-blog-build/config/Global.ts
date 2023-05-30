
export class Global {

    private static readonly _PROJECT_REPO_OWNER = "";
    private static readonly _PROJECT_REPO_NAME = "";
    private static readonly _GITEA_BASE_URL = "";
    private static readonly _GITEA_AUTH_TOKEN = "";
    private static readonly _API_BASE_URL = "";
    private static readonly _API_USER_NAME = "";
    private static readonly _API_PASSWORD = "";

    static get API_USER_NAME(): string {
        return this._API_USER_NAME;
    }

    static get API_PASSWORD(): string {
        return this._API_PASSWORD;
    }

    static get API_BASE_URL(): string {
        return this._API_BASE_URL;
    }

    static get PROJECT_REPO_OWNER(): string {
        return this._PROJECT_REPO_OWNER;
    }

    static get PROJECT_REPO_NAME(): string {
        return this._PROJECT_REPO_NAME;
    }

    static get GITEA_BASE_URL(): string {
        return this._GITEA_BASE_URL;
    }

    static get GITEA_AUTH_TOKEN(): string {
        return this._GITEA_AUTH_TOKEN;
    }
}