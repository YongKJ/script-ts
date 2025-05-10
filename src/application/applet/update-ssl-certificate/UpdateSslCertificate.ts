import * as DateUtil from "date-fns";
import Client from "ssh2-sftp-client";
import * as ssh2 from "ssh2";
import {GenUtil} from "../../util/GenUtil";
import {RemoteUtil} from "../../util/RemoteUtil";

export class UpdateSslCertificate {

    private readonly format: string;
    private readonly applyTime: Date;
    private readonly configPath: string;
    private readonly lstCmd: Array<string>;
    private readonly server: Record<string, any>;

    private constructor() {
        this.configPath = "";
        this.format = "yyyy-MM-dd HH:mm:ss";
        let config = GenUtil.getConfig(this.configPath);
        let applyTimeStr = GenUtil.getValue("applyTime");
        this.applyTime = DateUtil.parse(
            GenUtil.anyToStr(applyTimeStr), this.format, new Date());
        this.lstCmd = Array.of(
            "acme.sh --renew -d yongkj.cn",
            "acme.sh --install-cert -d yongkj.cn --key-file /etc/nginx/ssl/yongkj.cn.key --fullchain-file /etc/nginx/ssl/yongkj.cn.pem",
            "acme.sh --install-cert -d yongkj.cn --cert-file /etc/apache2/ssl/yongkj.cn.cert.pem --key-file /etc/apache2/ssl/yongkj.cn.key.pem --fullchain-file /etc/apache2/ssl/yongkj.cn.chain.pem"
        );
        this.server = {
            host: "47.107.122.89",
            port: 31122,
            username: "root",
            password: "*Dxj1003746818",
        };
    }

    private apply(): void {
        let expiredTime = DateUtil.addDays(this.applyTime, 89);
        if (!DateUtil.isAfter(Date.now(), expiredTime)) return;
        for (let cmd of this.lstCmd) {
            RemoteUtil.execLocalCmd(cmd);
        }
        this.sendAndUpdate().then();
        let applyTimeNewValue = DateUtil.addDays(this.applyTime, 90);
        let applyTimeNewStrValue = DateUtil.format(applyTimeNewValue, this.format);
        GenUtil.writeConfig(this.configPath, {applyTime: applyTimeNewStrValue});
    }

    private async sendAndUpdate(): Promise<void> {
        let client = new Client();
        await client.connect({
            host: this.server.host,
            port: this.server.port,
            username: this.server.username,
            password: this.server.password
        });
        let sslFolder = "/etc/nginx/ssl";
        await client.rmdir(sslFolder, true);
        await client.mkdir(sslFolder);
        await client.uploadDir(sslFolder, sslFolder);
        await client.end();
        await this.restartNginx();
    }

    private async restartNginx(): Promise<void> {
        let client = new ssh2.Client();
        await client.on("ready", () => {
            client.shell((err, stream) => {
                if (err) throw err;
                stream.on('close', async () => {
                    await client.end();
                });
                stream.end("kill -9 `ps -aux|grep nginx|grep -v grep|grep -v yongkj|awk '{print $2}'`\nnginx\nexit\n");
            });
        }).connect({
            host: this.server.host,
            port: this.server.port,
            username: this.server.username,
            password: this.server.password
        });
    }

    public static run(): void {
        new UpdateSslCertificate().apply();
    }

}