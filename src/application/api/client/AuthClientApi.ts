import {AuthClientController} from "../controller/AuthClientController";
import {Global} from "../config/Global";
import {AxiosError} from "axios";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {MsgUtil} from "../../util/MsgUtil";
import {ApiUtil} from "../../util/ApiUtil";

export class AuthClientApi {

    private timer: NodeJS.Timer;
    private taskFunc: () => void;
    private _accessToken: string;
    private refreshToken: string;
    private readonly userName: string;
    private readonly password: string;
    private readonly authClientController: AuthClientController;

    public constructor(baseUrl: string, taskFunc: () => void) {
        this._accessToken = "";
        this.refreshToken = "";
        this.taskFunc = taskFunc;
        this.password = Global.API_PASSWORD;
        this.userName = Global.API_USER_NAME;
        this.timer = setInterval(() => {}, 60 * 1000);
        this.authClientController = new AuthClientController(baseUrl);

        if (baseUrl.length > 0) {
            this.login().then();
        }
    }

    public closeClient(): void {
        clearInterval(this.timer);
    }

    private async login(): Promise<void> {
        let responseData = await this.authClientController.login(this.userName, this.password);
        if (responseData instanceof Error) {
            let message = responseData instanceof AxiosError ? responseData.response?.data.msg : responseData.message;
            LogUtil.loggerLine(Log.of("AuthClientApi", "login", "message", "登录失败！请检查网络！" + message));
            return;
        }
        if (!responseData.success) {
            LogUtil.loggerLine(Log.of("AuthClientApi", "login", "message", "登录失败！" + responseData.msg));
            return;
        }
        this.saveTokenAndTimer(responseData.data);
    }

    private saveTokenAndTimer(data: Record<string, any>): void {
        clearInterval(this.timer);
        this._accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        ApiUtil.accessToken = this._accessToken;
        MsgUtil.accessToken = this._accessToken;
        this.taskFunc();
        this.timer = setInterval(
            this.getAccessToken(this),
            (data.expires_in - 10) * 1000
        );
        LogUtil.loggerLine(Log.of("AuthClientApi", "saveTokenAndTimer", "message", "用户登录成功！"));
    }

    private getAccessToken(authClientApi: AuthClientApi): () => void {
        return async () => {
            let refreshToken = authClientApi.refreshToken;
            let responseData = await authClientApi.authClientController.refresh(refreshToken);
            if (responseData instanceof Error || !responseData.success) {
                let message = responseData instanceof Error ? responseData.message : responseData.msg;
                if (responseData instanceof AxiosError) {
                    message = responseData.response?.data.msg;
                }
                authClientApi.login().then();
                LogUtil.loggerLine(Log.of("AuthClientApi", "getAccessToken", "message", "token 刷新失败！请重新登录！" + message));
                return;
            }
            let data: Record<string, any> = responseData.data;
            authClientApi._accessToken = data.access_token;
            ApiUtil.accessToken = authClientApi._accessToken;
            MsgUtil.accessToken = authClientApi._accessToken;
            LogUtil.loggerLine(Log.of("AuthClientApi", "getAccessToken", "message", "验证 token 刷新成功！"));
        }
    }

    public async setBaseUrl(value: string, taskFunc: () => void): Promise<void> {
        let flag = value === this.authClientController.BASE_URL;
        this.authClientController.BASE_URL = value;
        this.taskFunc = taskFunc;
        if (flag) return;
        await this.login();
    }
}