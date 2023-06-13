import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {FileUtil} from "../../util/FileUtil";

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

    private test3() {
        // let regex = new RegExp("(<plugins>[\\s\\S]*?</plugins>)");
        let regex = new RegExp("\n(\\s+<dependency>[\\s\\S]*?</dependency>)", "g");
        let path = "D:\\Document\\MyCodes\\Github\\script-java\\pom.xml";
        let content = FileUtil.read(path);
        // let lstMatch = regex.exec(content);
        let lstMatch = content.matchAll(regex);
        for (let match of lstMatch) {
            // LogUtil.loggerLine(Log.of("Demo", "test3", "match", match));
            // console.log("--------------------------------------------------------------------------------");
            // LogUtil.loggerLine(Log.of("Demo", "test3", "match[1]", match[1]));
            // console.log("--------------------------------------------------------------------------------");
            LogUtil.loggerLine(Log.of("Demo", "test3", "match[0]", match[0]));
            console.log("--------------------------------------------------------------------------------");
        }
        // LogUtil.loggerLine(Log.of("Demo", "test3", "regex.test(content)", (regex.test(content))));
        // console.log("--------------------------------------------------------------------------------")
        // LogUtil.loggerLine(Log.of("Demo", "test3", "lstMatch[1]", lstMatch != null ? lstMatch[1] : ""));
        // console.log("--------------------------------------------------------------------------------")
        // LogUtil.loggerLine(Log.of("Demo", "test3", "lstMatch[2]", lstMatch != null ? lstMatch[2] : ""));
        // console.log("--------------------------------------------------------------------------------")
        // LogUtil.loggerLine(Log.of("Demo", "test3", "lstMatch", lstMatch));
        // console.log("--------------------------------------------------------------------------------")
    }

    private test4(): void {
        let regStr = "(\r\n\\s+<dependency>[\\s\\S]*?</dependency>)";
        let path = "C:\\Users\\admin\\Desktop\\script-java\\pom.xml";
        let value = "\r\n        <dependency>\r\n            <groupId>org.apache.httpcomponents</groupId>\r\n            <artifactId>httpclient</artifactId>\r\n            <version>4.5.49</version>\r\n        </dependency>";
        FileUtil.modFile(path, regStr, value);
    }

    private test5(): void {
        let regStr = "(plugins: [[\\s\\S]*])";
        let path = "D:\\Document\\MyCodes\\Github\\script-ts\\webpack.config.js";
        // FileUtil.modFile(path, regStr, "plugins: []");

        let regex = new RegExp(regStr);
        let content = FileUtil.read(path);
        let match = content.match(regex);

        LogUtil.loggerLine(Log.of("Demo", "test3", "test", (regex.test(content))));
        LogUtil.loggerLine(Log.of("Demo", "test3", "match[0]", match == null ? "" : match[0]));
        LogUtil.loggerLine(Log.of("Demo", "test3", "match[1]", match == null ? "" : match[1]));
    }

    private test6(): void {
        let result = Demo.count(1, 10);
        LogUtil.loggerLine(Log.of("Demo", "test6", "result", result));
    }

    private static count(a: number, b: number): number {
        if (a === b) return a;
        return Demo.count(a, b - 1) + Demo.count(a + 1, b);
    }

    public static run(): void {
        let demo = new Demo();
        demo.test6();
        // demo.test5();
        // demo.test4();
        // demo.test3();
        // demo.test1();
    }

}