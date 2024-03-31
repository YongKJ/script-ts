import {UpgradeClientController} from "../../api/controller/UpgradeClientController";

export class SendSslCertificate {

    private upgradeClientController: UpgradeClientController;

    private constructor() {
        this.upgradeClientController = new UpgradeClientController();
    }

    private apply(): void {
        this.sendCertificate();
    }

    private sendCertificate(): void {
        this.upgradeClientController.sendMessage(
            "pwd\n" +
            "whoami\n"
        );
    }

    public static run(): void {
        new SendSslCertificate().apply();
    }
    
}