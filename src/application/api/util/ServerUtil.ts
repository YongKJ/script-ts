import autobind from "autobind-decorator";
import {MsgUtil} from "../../util/MsgUtil";
import {GenUtil} from "../../util/GenUtil";
import {TerminalMessage} from "../pojo/dto/TerminalMessage";
import {Terminal} from "../pojo/dto/Terminal";

export class ServerUtil {

    private static _BASE_URL: string;
    private static msgUtil: MsgUtil;
    private static taskFunc?: () => void;
    private static terminal = new Terminal();
    private static lstTerminal = new Array<Terminal>();

    private constructor() {
    }

    public static sendMessage(msg: TerminalMessage, taskFunc?: () => void): void {
        this.taskFunc = taskFunc;
        msg.terminalId = this.terminal.id;
        this.msgUtil.sendMessage("execute", GenUtil.objToRecord(msg));
    }

    @autobind
    public static async setMsgUtil(): Promise<void> {
        if (typeof this.msgUtil !== "undefined") {
            this.msgUtil.closeMsgClient();
        }
        this.msgUtil = new MsgUtil(this._BASE_URL, "/terminal");
        await GenUtil.sleep(333);
        this.msgUtil.initClient();
        this.msgUtil.subscribeMessage("execute", this.handleMessage);
        this.msgUtil.subscribeMessage("exception", this.handleException);
        await GenUtil.sleep(333);
        this.sendMessage(TerminalMessage.of(
            "", {}, [], "create"
        ));
    }

    @autobind
    private static handleMessage(msg: TerminalMessage): void {
        switch (msg.type) {
            case "check":
                this.lstTerminal = msg.terminalList;
                break;
            case "create":
                this.lstTerminal = msg.terminalList;
                this.terminal = this.lstTerminal[this.lstTerminal.length - 1];
                break;
            case "init":
                if (msg.terminalId === this.terminal.id && typeof msg.param.data !== "undefined") {
                    console.log(msg.param.data);
                }
                break;
            case "exec":
                if (msg.terminalId === this.terminal.id && typeof msg.param.data !== "undefined") {
                    console.log(msg.param.data);
                }
                break;
            case "exit":
                this.lstTerminal = msg.terminalList;
                this.closeConnection();
        }
    }

    private static handleException(data: Record<string, any>): void {
        if (data.message === "Forbidden resource") {
            this.msgUtil.finishSubscribe("execute");
            this.msgUtil.finishSubscribe("exception");
            this.msgUtil.closeMsgClient();
            this.msgUtil.updateToken();
            this.msgUtil.initClient();
            this.msgUtil.subscribeMessage("execute", this.handleMessage);
            this.msgUtil.subscribeMessage("exception", this.handleException);
        }
    }

    private static closeConnection(): void {
        this.msgUtil.finishSubscribe("execute");
        this.msgUtil.finishSubscribe("exception");
        this.msgUtil.closeMsgClient();
        if (typeof this.taskFunc != "undefined") {
            this.taskFunc();
        }
    }

    static set BASE_URL(value: string) {
        this._BASE_URL = value;
    }
}