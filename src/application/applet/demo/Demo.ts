import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";

export class Demo {

    private readonly msg: string;

    private constructor() {
        let value = GenUtil.getValue("demo.yaml", "msg");
        this.msg = GenUtil.anyToStr(value);
    }

    private test(): void {
        LogUtil.loggerLine(Log.of("Demo", "test", "msg", this.msg));
    }

    public static run(): void {
        new Demo().test();
    }

}