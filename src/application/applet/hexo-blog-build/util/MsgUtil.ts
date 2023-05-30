import {io} from "socket.io-client";
import {Socket} from "socket.io-client/build/esm/socket";

export class MsgUtil {

    private readonly client: Socket;
    private static _accessToken = "";

    public constructor(url: string, api: string) {
        this.client = MsgUtil.getMsgClient(url, api);
    }

    private static getMsgClient(url: string, api: string): Socket {
        return io(url, {
            path: api,
            transports: ["websocket"],
            auth: {
                Authorization: 'Bearer ' + MsgUtil._accessToken
            },
        });
    }

    public initClient(): void {
        if (this.client.disconnected) {
            this.client.connect();
        }
    }

    public sendMessage(event: string, msg: string | Record<string, any>): void {
        this.client.emit(event, msg);
    }

    public subscribeMessage(event: string, msgFunc: (data: any) => void): void {
        this.client.on(event, msgFunc);
    }

    public finishSubscribe(event: string): void {
        this.client.off(event);
    }

    public closeMsgClient(): void {
        this.client.disconnect();
    }

    public updateToken(): void {
        (<Record<string, any>>this.client.auth).Authorization = 'Bearer ' + MsgUtil._accessToken;
    }

    static set accessToken(value: string) {
        this._accessToken = value;
    }
}