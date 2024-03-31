import {UpgradeClientService} from "../service/UpgradeClientService";
import {ResponseData} from "../pojo/dto/ResponseData";

export class UpgradeClientController {

    private readonly upgradeClientService: UpgradeClientService;

    public constructor() {
        this.upgradeClientService = new UpgradeClientService();
    }

    public api(baseUrl: string, path: string): Promise<ResponseData | Error> {
        return this.upgradeClientService.api(baseUrl, path);
    }

    public upload(baseUrl: string, path: string, folder: string): Promise<ResponseData | Error> {
        return this.upgradeClientService.upload(baseUrl, path, folder);
    }

    public delete(baseUrl: string, folder: string): Promise<ResponseData | Error> {
        return this.upgradeClientService.delete(baseUrl, folder);
    }

    public create(baseUrl: string, folder: string): Promise<ResponseData | Error> {
        return this.upgradeClientService.create(baseUrl, folder);
    }

    public restart(baseUrl: string): Promise<ResponseData | Error> {
        return this.upgradeClientService.restart(baseUrl);
    }

    public sendMessage(cmd: string, taskFunc?: () => void): void {
        this.upgradeClientService.sendMessage(cmd, taskFunc);
    }

}