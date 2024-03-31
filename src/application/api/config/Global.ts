
export class Global {

    private static readonly _API_BASE_URL = "https://server.yongkj.cn";
    private static readonly _API_USER_NAME = "admin";
    private static readonly _API_PASSWORD = "*Abc123456";

    static get API_USER_NAME(): string {
        return this._API_USER_NAME;
    }

    static get API_PASSWORD(): string {
        return this._API_PASSWORD;
    }

    static get API_BASE_URL(): string {
        return this._API_BASE_URL;
    }

}