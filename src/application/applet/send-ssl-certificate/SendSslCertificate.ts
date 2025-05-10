import {UpgradeClientController} from "../../api/controller/UpgradeClientController";
import {GenUtil} from "../../util/GenUtil";
import {Global} from "../../api/config/Global";
import * as ssh2 from "ssh2";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {RemoteUtil} from "../../util/RemoteUtil";

export class SendSslCertificate {

    private readonly privateKey: string;
    private readonly certificate: string;
    private readonly server: Record<string, any>;
    private upgradeClientController: UpgradeClientController;

    private constructor() {
        this.upgradeClientController = new UpgradeClientController();
        this.privateKey = <string>GenUtil.getValue("private-key");
        this.certificate = <string>GenUtil.getValue("certificate");
        this.server = <Record<string, any>>GenUtil.getValue("server");
    }

    private async apply(): Promise<void> {
        RemoteUtil.execLocalCmd(
            "update-certificate.sh"
        );
        await this.sendCertificate();
        this.restart().then();
    }

    private async sendCertificate(): Promise<void> {
        await this.upgradeClientController.delete(
            Global.API_BASE_URL,
            Array.of(
                "/etc/nginx/ssl/yongkj.cn.key",
                "/etc/nginx/ssl/yongkj.cn.pem"
            ));

        await this.upgradeClientController.upload(
            Global.API_BASE_URL,
            this.privateKey,
            "/etc/nginx/ssl"
        );

        await this.upgradeClientController.upload(
            Global.API_BASE_URL,
            this.certificate,
            "/etc/nginx/ssl"
        );
    }

    private async restart(): Promise<void> {
        this.upgradeClientController.sendMessage(
            "kill -9 `ps|grep -v grep|grep aria2|awk '{print $1}'|tr -s '\\n' ' '`\n" +
            "aria2c --conf-path=/root/Software/aria2/aria2.conf -D\n" +
            "exit\n"
        );

        let client = new ssh2.Client();
        await client.on("ready", () => {
            client.shell((err, stream) => {
                if (err) throw err;
                LogUtil.loggerLine(Log.of("SendSslCertificate", "restart", "msg", "server pull"));
                console.log("--------------------------------------------------------------------------------------------------------------");
                stream.on('close', async () => {
                    console.log("--------------------------------------------------------------------------------------------------------------");
                    LogUtil.loggerLine(Log.of("SendSslCertificate", "restart", "msg", "done"));
                    await client.end();
                }).on('data', (data: Buffer) => {
                    console.log(data.toString("utf-8"));
                }).stderr.on('data', async err => {
                    LogUtil.loggerLine(Log.of("SendSslCertificate", "restart", "err", err));
                    await client.end();
                });
                stream.end(
                    "rc-service nginx restart\n" +
                    "exit\n"
                );
            });
        }).connect({
            host: this.server.host,
            port: GenUtil.strToNumber(this.server.port),
            username: this.server.username,
            password: this.server.password
        });
    }

    public static run(): void {
        new SendSslCertificate().apply().then();
    }

}