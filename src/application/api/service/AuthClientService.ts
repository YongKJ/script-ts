import {ResponseData} from "../pojo/dto/ResponseData";
import FormData from "form-data";
import {ApiUtil} from "../../util/ApiUtil";

export class AuthClientService {

    private _BASE_URL: string;
    private REFRESH: string;
    private LOGIN: string;

    public constructor(baseUrl: string) {
        this._BASE_URL = baseUrl;
        this.LOGIN = this._BASE_URL + "/auth/login";
        this.REFRESH = this._BASE_URL + "/auth/refresh"
    }


    public refresh(refreshToken: string, acquireName?: boolean): Promise<ResponseData | Error> {
        let formData = new FormData();
        formData.append("refreshToken", refreshToken);
        if (typeof acquireName !== "undefined") {
            formData.append("acquireName", acquireName + "");
        }

        return ApiUtil.requestWithFormDataByPostToEntity(this.REFRESH, formData, ResponseData);
    }

    public login(userName: string, password: string): Promise<ResponseData | Error> {
        let formData = new FormData();
        formData.append("userName", userName);
        formData.append("password", password);

        return ApiUtil.requestWithFormDataByPostToEntity(this.LOGIN, formData, ResponseData);
    }

    set BASE_URL(value: string) {
        this._BASE_URL = value;
        this.LOGIN = this._BASE_URL + "/auth/login";
        this.REFRESH = this._BASE_URL + "/auth/refresh"
    }

}