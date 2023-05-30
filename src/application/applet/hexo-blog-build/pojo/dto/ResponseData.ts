
export class ResponseData {

    private _data: any;
    private _msg: string;
    private _code: number;
    private _success: boolean;

    public constructor(data?: any, msg?: string, code?: number, success?: boolean) {
        this._msg = msg || "";
        this._code = code || 0;
        this._data = data || null;
        this._success = success || false;
    }

    public static of(data: any, msg: string, code: number, success: boolean): ResponseData {
        return new ResponseData(data, msg, code, success);
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    get msg(): string {
        return this._msg;
    }

    set msg(value: string) {
        this._msg = value;
    }

    get code(): number {
        return this._code;
    }

    set code(value: number) {
        this._code = value;
    }

    get success(): boolean {
        return this._success;
    }

    set success(value: boolean) {
        this._success = value;
    }
}