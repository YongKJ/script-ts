import {ResponseData} from "../pojo/dto/ResponseData";
import FormData from "form-data";
import * as fs from "fs";
import {TerminalMessage} from "../pojo/dto/TerminalMessage";
import {ApiUtil} from "../../util/ApiUtil";
import {AuthClientApi} from "../client/AuthClientApi";
import {GenUtil} from "../../util/GenUtil";
import {ServerUtil} from "../util/ServerUtil";
import {Global} from "../config/Global";

export class UpgradeClientService {

    private readonly authClientApi: AuthClientApi;

    private API: string;
    private DELETE: string;
    private UPLOAD: string;
    private CREATE: string;
    private RESTART: string;
    private _BASE_URL: string;

    public constructor() {
        this._BASE_URL = Global.API_BASE_URL;
        ServerUtil.BASE_URL = this._BASE_URL;
        this.API = this._BASE_URL + "/upgrade/api";
        this.UPLOAD = this._BASE_URL + "/path/upload";
        this.DELETE = this._BASE_URL + "/path/delete";
        this.CREATE = this._BASE_URL + "/path/create";
        this.RESTART = this._BASE_URL + "/upgrade/restart";

        this.authClientApi = new AuthClientApi(this._BASE_URL, ServerUtil.setMsgUtil);
    }

    public async api(baseUrl: string, path: string): Promise<ResponseData | Error> {
        await this.setBaseUrl(baseUrl);

        let formData = new FormData();
        formData.append("file", fs.createReadStream(path));

        return ApiUtil.requestWithFileAndTokenByPostToEntity(this.API, formData, ResponseData);
    }

    public async upload(baseUrl: string, path: string, folder: string): Promise<ResponseData | Error> {
        await this.setBaseUrl(baseUrl);

        let formData = new FormData();
        formData.append("files", fs.createReadStream(path));
        formData.append("path", GenUtil.getEnCode(folder));

        return ApiUtil.requestWithFileAndTokenByPostToEntity(this.UPLOAD, formData, ResponseData);
    }

    public async delete(baseUrl: string, folder: string): Promise<ResponseData | Error> {
        await this.setBaseUrl(baseUrl);

        let formData = new FormData();
        formData.append("paths", GenUtil.getEnCode(folder));

        return ApiUtil.requestWithFileAndTokenByPostToEntity(this.DELETE, formData, ResponseData);
    }

    public async create(baseUrl: string, folder: string): Promise<ResponseData | Error> {
        await this.setBaseUrl(baseUrl);

        let params = new Map<string, any>([
            ["path", GenUtil.getEnCode(folder)], ["isFolder", true]
        ]);

        return ApiUtil.requestWithParamsAndTokenByGetToEntity(this.CREATE, params, ResponseData);
    }

    public async restart(baseUrl: string): Promise<ResponseData | Error> {
        await this.setBaseUrl(baseUrl);

        return ApiUtil.requestWithParamsAndTokenByGetToEntity(this.RESTART, new Map<string, any>(), ResponseData);
    }

    public sendMessage(msg: TerminalMessage, taskFunc?: () => void): void {
        ServerUtil.sendMessage(msg, taskFunc);
    }

    private async setBaseUrl(value: string, uploadUrl?: string): Promise<void> {
        this._BASE_URL = value;
        ServerUtil.BASE_URL = this._BASE_URL;
        this.API = this._BASE_URL + "/upgrade/api";
        this.UPLOAD = uploadUrl || this._BASE_URL + "/path/upload";
        this.DELETE = uploadUrl || this._BASE_URL + "/path/delete";
        this.CREATE = uploadUrl || this._BASE_URL + "/path/create";
        this.RESTART = uploadUrl || this._BASE_URL + "/upgrade/restart";
        await this.authClientApi.setBaseUrl(value, ServerUtil.setMsgUtil);
    }
}