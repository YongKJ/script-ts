import autobind from "autobind-decorator";
import {MsgUtil} from "../../util/MsgUtil";
import {GenUtil} from "../../util/GenUtil";
import {TerminalMessage} from "../pojo/dto/TerminalMessage";
import {Terminal} from "../pojo/dto/Terminal";

export class ServerUtil {

    private static msgUtil: MsgUtil;
    private static _BASE_URL: string;
    private static timer: NodeJS.Timer;
    private static taskFunc?: () => void;
    private static terminal = new Terminal();
    private static lstTerminal = new Array<Terminal>();
    private static messages = new Array<TerminalMessage>();

    private constructor() {
    }

    private static consumer(): void {
        if (typeof ServerUtil.msgUtil === "undefined" ||
            ServerUtil.terminal.id.length === 0 ||
            ServerUtil.messages.length === 0) {
            return;
        }
        for (let msg of ServerUtil.messages) {
            msg.terminalId = ServerUtil.terminal.id;
            ServerUtil.msgUtil.sendMessage("execute", GenUtil.objToRecord(msg));
        }
        ServerUtil.messages = new Array<TerminalMessage>();
    }

    public static sendMessage(msg: TerminalMessage, taskFunc?: () => void): void {
        ServerUtil.taskFunc = taskFunc;
        if (typeof ServerUtil.msgUtil === "undefined") {
            ServerUtil.messages.push(msg);
            return;
        }
        msg.terminalId = ServerUtil.terminal.id;
        ServerUtil.msgUtil.sendMessage("execute", GenUtil.objToRecord(msg));
    }

    @autobind
    public static async setMsgUtil(): Promise<void> {
        if (typeof ServerUtil.msgUtil !== "undefined") {
            ServerUtil.msgUtil.closeMsgClient();
        }
        clearInterval(ServerUtil.timer);
        ServerUtil.timer = setInterval(ServerUtil.consumer, 1000);
        ServerUtil.msgUtil = new MsgUtil(ServerUtil._BASE_URL, "/terminal");
        await GenUtil.sleep(333);
        ServerUtil.msgUtil.initClient();
        ServerUtil.msgUtil.subscribeMessage("execute", ServerUtil.handleMessage);
        ServerUtil.msgUtil.subscribeMessage("exception", ServerUtil.handleException);
        await GenUtil.sleep(333);
        ServerUtil.sendMessage(TerminalMessage.of(
            "", {}, [], "create"
        ));
    }

    @autobind
    private static handleMessage(msg: TerminalMessage): void {
        switch (msg.type) {
            case "check":
                ServerUtil.lstTerminal = msg.terminalList;
                break;
            case "create":
                ServerUtil.lstTerminal = msg.terminalList;
                ServerUtil.terminal = ServerUtil.lstTerminal[ServerUtil.lstTerminal.length - 1];
                break;
            case "init":
                if (msg.terminalId === ServerUtil.terminal.id && typeof msg.param.data !== "undefined") {
                    console.log(msg.param.data);
                }
                break;
            case "exec":
                if (msg.terminalId === ServerUtil.terminal.id && typeof msg.param.data !== "undefined") {
                    console.log(msg.param.data);
                }
                break;
            case "exit":
                ServerUtil.lstTerminal = msg.terminalList;
                ServerUtil.closeConnection();
        }
    }

    private static handleException(data: Record<string, any>): void {
        if (data.message === "Forbidden resource") {
            ServerUtil.msgUtil.finishSubscribe("execute");
            ServerUtil.msgUtil.finishSubscribe("exception");
            ServerUtil.msgUtil.closeMsgClient();
            ServerUtil.msgUtil.updateToken();
            ServerUtil.msgUtil.initClient();
            ServerUtil.msgUtil.subscribeMessage("execute", ServerUtil.handleMessage);
            ServerUtil.msgUtil.subscribeMessage("exception", ServerUtil.handleException);
        }
    }

    private static closeConnection(): void {
        clearInterval(ServerUtil.timer);
        ServerUtil.msgUtil.finishSubscribe("execute");
        ServerUtil.msgUtil.finishSubscribe("exception");
        ServerUtil.msgUtil.closeMsgClient();
        if (typeof ServerUtil.taskFunc != "undefined") {
            ServerUtil.taskFunc();
        }
    }

    static set BASE_URL(value: string) {
        ServerUtil._BASE_URL = value;
    }
}