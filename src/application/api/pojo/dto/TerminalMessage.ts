import {Terminal} from "./Terminal";
import {DataUtil} from "../../../util/DataUtil";

export class TerminalMessage {

    private _terminalId: string;
    private _param: Record<string, any>;
    private _terminalList: Array<Terminal>;
    private _type: "check" | "create" | "init" | "exec" | "exit";

    public constructor(terminalId?: string, param?: Record<string, any>, terminalList?: Array<Terminal>, type?: "check" | "create" | "init" | "exec" | "exit") {
        this._param = param || {};
        this._type = type || "check";
        this._terminalId = terminalId || "";
        this._terminalList = terminalList || new Array<Terminal>();
    }

    public static of(terminalId: string, param: Record<string, any>, terminalList: Array<Terminal>, type: "check" | "create" | "init" | "exec" | "exit"): TerminalMessage {
        return new TerminalMessage(terminalId, param, terminalList, type);
    }

    get terminalId(): string {
        return this._terminalId;
    }

    set terminalId(value: string) {
        this._terminalId = value;
    }

    get param(): Record<string, any> {
        return this._param;
    }

    set param(value: Record<string, any>) {
        this._param = value;
    }

    get terminalList(): Array<Terminal> {
        return this._terminalList;
    }

    set terminalList(value: Array<Terminal>) {
        this._terminalList = value;
        if (value.length === 0 || value.length > 0 && value[0] instanceof Terminal) {
            this._terminalList = value;
        } else {
            this._terminalList = <Array<Terminal>>DataUtil.convertData(value, Terminal);
        }
    }

    get type(): "check" | "create" | "init" | "exec" | "exit" {
        return this._type;
    }

    set type(value: "check" | "create" | "init" | "exec" | "exit") {
        this._type = value;
    }
}