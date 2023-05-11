
export class Global {

    private static readonly _SERVER_HOST = "";
    private static readonly _SERVER_PORT = 0;
    private static readonly _SERVER_USERNAME = "";
    private static readonly _SERVER_PASSWORD = "";
    private static readonly _GITEA_BASE_URL = "";
    private static readonly _GITEA_AUTH_TOKEN = "";

    static get SERVER_HOST(): string {
        return this._SERVER_HOST;
    }

    static get SERVER_PORT(): number {
        return this._SERVER_PORT;
    }

    static get SERVER_USERNAME(): string {
        return this._SERVER_USERNAME;
    }

    static get SERVER_PASSWORD(): string {
        return this._SERVER_PASSWORD;
    }

    static get GITEA_BASE_URL(): string {
        return this._GITEA_BASE_URL;
    }

    static get GITEA_AUTH_TOKEN(): string {
        return this._GITEA_AUTH_TOKEN;
    }
}