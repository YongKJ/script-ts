import {AuthClientService} from "../service/AuthClientService";
import {ResponseData} from "../pojo/dto/ResponseData";
import {GenUtil} from "../../util/GenUtil";

export class AuthClientController {

    private _BASE_URL: string;
    private readonly authClientService: AuthClientService;

    public constructor(baseUrl: string) {
        this._BASE_URL = baseUrl;
        this.authClientService = new AuthClientService(baseUrl);
    }

    public refresh(refreshToken: string, acquireName?: boolean): Promise<ResponseData | Error> {
        return this.authClientService.refresh(<string>GenUtil.getEnCode(refreshToken), acquireName);
    }

    public login(userName: string, password: string): Promise<ResponseData | Error> {
        return this.authClientService.login(
            <string>GenUtil.getEnCode(userName),
            <string>GenUtil.getEnCode(GenUtil.getMd5Str(password))
        );
    }

    get BASE_URL(): string {
        return this._BASE_URL;
    }

    set BASE_URL(value: string) {
        this._BASE_URL = value;
        this.authClientService.BASE_URL = value;
    }
}