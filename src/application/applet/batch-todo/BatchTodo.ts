import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";

export class BatchTodo {

    private readonly batchTodoEnable: boolean;
    private readonly entityFolders: string;

    private constructor() {
        let value = GenUtil.getValue("batch-todo-enable");
        this.batchTodoEnable = GenUtil.anyToStr(value) === "true";
        value = GenUtil.getValue("entity-folders");
        this.entityFolders = GenUtil.anyToStr(value);
    }

    private apply(): void {
        LogUtil.loggerLine(Log.of("BatchTodo", "apply", "entityFolders", this.entityFolders));
    }

    public static run(): void {
        new BatchTodo().apply();
    }

}