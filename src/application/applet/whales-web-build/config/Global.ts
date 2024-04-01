
export class Global {

    // private static readonly _SERVER_HOST = "45.157.131.82";
    // private static readonly _SERVER_PORT = 31579;
    // private static readonly _SERVER_USERNAME = "root";
    // private static readonly _SERVER_PASSWORD = "IASoda23iODe2KFA";
    private static readonly _SERVER_HOST = "124.222.85.139";
    private static readonly _SERVER_PORT = 31987;
    private static readonly _SERVER_USERNAME = "root";
    private static readonly _SERVER_PASSWORD = "SIO2.TOz9iyr@35A#XCq";
    private static readonly _GITEA_BASE_URL = "http://124.222.85.139:3000";
    private static readonly _GITEA_AUTH_TOKEN = "5b28d9c5943c98eef9d1eeb203168f21f3b37c8e";

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