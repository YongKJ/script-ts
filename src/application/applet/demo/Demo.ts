import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";

export class Demo {

    private readonly msg: string;

    public constructor() {
        let value = GenUtil.getValue("demo.yaml", "msg");
        this.msg = GenUtil.anyToStr(value);
    }

    private test(): void {
        LogUtil.loggerLine(Log.of("Demo", "test", "msg", this.msg));
    }

    private test1(): void {
        this.test2(Demo);
        this.test2(new Demo())
    }

    private test2<T>(clazz: (new () => T) | T): void {
        LogUtil.loggerLine(Log.of("Demo", "test2", "clazz", clazz));
        console.log("--------------------------------------------------------------------------------")
        LogUtil.loggerLine(Log.of("Demo", "test2", "typeof clazz", (typeof clazz)));
        console.log("--------------------------------------------------------------------------------")
        LogUtil.loggerLine(Log.of("Demo", "test2", "+new Date()", (+new Date())));
        console.log("--------------------------------------------------------------------------------")
        LogUtil.loggerLine(Log.of("Demo", "test2", "new Date()", (new Date())));
        console.log("--------------------------------------------------------------------------------")
        LogUtil.loggerLine(Log.of("Demo", "test2", "typeof null", (typeof null)));
        console.log("--------------------------------------------------------------------------------")
    }

    public static run(): void {
        new Demo().test1();
    }

}