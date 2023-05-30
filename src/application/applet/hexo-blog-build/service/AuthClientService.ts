import {Global} from "../config/Global";
import {ResponseData} from "../pojo/dto/ResponseData";
import {ApiUtil} from "../../../util/ApiUtil";
import FormData from "form-data";

export class AuthClientService {

    private readonly BASE_URL = Global.API_BASE_URL;
    private readonly LOGIN = this.BASE_URL + "/auth/login";
    private readonly REFRESH = this.BASE_URL + "/auth/refresh";

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


}