import {AuthClientService} from "../service/AuthClientService";
import {ResponseData} from "../pojo/dto/ResponseData";
import {GenUtil} from "../../util/GenUtil";

export class AuthClientController {

    private readonly authClientService: AuthClientService;

    public constructor() {
        this.authClientService = new AuthClientService();
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

}