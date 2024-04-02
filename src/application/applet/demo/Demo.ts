import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {FileUtil} from "../../util/FileUtil";
import {createConnection, createLongLivedTokenAuth, subscribeEntities} from "home-assistant-js-websocket";

export class Demo {

    private readonly msg: string;

    public constructor() {
        let value = GenUtil.getValue("msg");
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

    private test7(): void {
        let path = FileUtil.getAbsPath(false, "src", "application", "ApplicationTest.ts");
        let regex = new RegExp("^((?!\\s\\/).)*\\s+(\\S+).run\\(\\);");
        let contentArray = FileUtil.readByLine(path);
        for (let line of contentArray) {
            if (!regex.test(line)) continue;
            let lstMatch = line.match(regex);
            if (lstMatch == null) continue;
            LogUtil.loggerLine(Log.of("Demo", "test7", "match", lstMatch[2]));
            break;
        }
    }

    private test8(): void {
        let url = "http://alpine.yongkj.cn/dataGenerate/subscribe?type=";
        LogUtil.loggerLine(Log.of("Demo", "test8", "shadowSocksUrl", url + GenUtil.getEnCode("shadowSocks")));
        LogUtil.loggerLine(Log.of("Demo", "test8", "flyBirdCloudUrl", url + GenUtil.getEnCode("flyBirdCloud")));
    }

    private test9(): void {
        let url = "http://alpine.yongkj.cn/dataGenerate/subscribe?type=";
        let replaceOne = url.replace(new RegExp("/", "g"), "\\\/");
        // replaceOne = replaceOne.replace(/\//g, "\\");
        let replaceTwo = url.replace(/\//g, "\\");
        let replaceThree = url.replace(/\//g, "\/");
        let replaceFour = url.replace(/\//g, "\\");
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceOne", GenUtil.recToStr({url: replaceOne})));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceTwo", GenUtil.recToStr({url: replaceTwo})));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceThree", GenUtil.recToStr({url: replaceThree})));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceFour", GenUtil.recToStr({url: replaceFour})));
        LogUtil.loggerLine(Log.of("Demo", "test9", "str", GenUtil.recToStr({str: "http:\\/\\/alpine.yongkj.cn\/dataGenerate\/subscribe?type="})));
    }

    private test10(): void {
        let audios = Demo.getAudios();
        let mapKey = Demo.getAudioKeyMap();
        let lstAudiosStr = new Array<string>();
        let lstAudio = new Array<Record<string, any>>();
        for (let audio of audios) {
            let tempAudio: Record<string, any> = {};
            for (let [key, value] of mapKey) {
                tempAudio[key] = audio[value];
            }
            lstAudio.push(tempAudio);
            console.log(GenUtil.recToStr(tempAudio));
            lstAudiosStr.push(GenUtil.recToStr(tempAudio))
        }
        FileUtil.write("C:\\Users\\admin\\Desktop\\test.json", lstAudiosStr.join("\n"));
        LogUtil.loggerLine(Log.of("Demo", "test10", "lstAudio", lstAudio));
        LogUtil.loggerLine(Log.of("Demo", "test10", "lstAudioStr", lstAudiosStr.join("\n")));
    }

    private static getAudioKeyMap(): Map<string, any> {
        return new Map<string, any>([
            ["title", "name"],
            ["author", "artist"],
            ["url", "url"],
            ["pic", "cover"],
        ]);
    }

    private static getAudios(): Array<Record<string, any>> {
        return Array.of({
            lrc: "",
            artist: "Jose Feliciano Vs Boney M",
            name: "Feliz Navidad",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQCFoYAKQASUbgC1BAJTqEA9uJgBGAM4QlaABoZNYaYQAOK4AGsAJirAm0DMPhQmo+NgUJmp4pePhRhYAJZSAAye+HSCaiyCAKxmAExmGFAYwACewG4kvgDGAMxSAHaSMgyU4hhguZ6CPjBszEqCcnTkYADCdCxSwHQFvOKIGIIAMqBgAPJQ5Db47IFxnBlmMGb4MQCKaGYgg4LcoACSSrCEdOsm0TRQjLl0mtkAnAAK6wC8r0A",
        }, {
            lrc: "",
            artist: "爵士轻音乐",
            name: "Feliz Navidad",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgYXjRIAaAJTSEATAAc2AaTEBrAKwATEvHgAtAHY1c2QrgCKABgaaMLAIz4AxmIbAoYpRigZgAT2CEVEBhIAiYMIgQuRGAJxAA",
        }, {
            lrc: "",
            artist: "Dido",
            name: "Thank You",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQCESAxgwAOACQDyMACY0MABgBShYBinT8DAKwBFNMICWNAIyEAdiTkZNUQsPixhKQnIBaWEhhcQhYsy4Ay2M7AcgBKYAAK2gC80UA",
        }, {
            lrc: "",
            artist: "Piano Cover",
            name: "Imagine",
            cover: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3ADwEUA7AIQC0BZARgElrgAmdwgBM0aYIQC28FIRzj8Aa0H4ohUYXph5tLIQDMwcexAAFWgF4zQA",
            url: "https://alpine.yongkj.cn/path/view?path=JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBUAxEGgWwA8BHOgEQCFKAJiwYAJMDAEYASgEYAWjOAsADAFZJabjQl1CWBgHt8IAFIBnAYQAOdAIr4AnISkAmNgaXKALAvIBPAHk6Ewh8cjRKOhhlNgFlGQBmAAU6ZQBeIA",
        });
    }

    private test11(): void {
        let trojanUrl = "https://s.trojanflare.com/subscription/shadowrocket/f66bedda-273d-4baa-a291-d93b422ab5ed";
        let surgeUrl = "https://s.trojanflare.com/surge/f66bedda-273d-4baa-a291-d93b422ab5ed";
        let flyBirdCloudUrl = "https://feiniaoyun01.life/api/v1/client/subscribe?token=3a6173b18d1158c27461e8ccf1fc4eca";
        let flyBirdCloudTwoUrl = "https://feiniaoyun01.life/api/v1/client/subscribe?token=bc5620242a7db1140284516f661851b5";
        LogUtil.loggerLine(Log.of("Demo", "test11", "trojanUrl", GenUtil.getEnCode(trojanUrl)));
        LogUtil.loggerLine(Log.of("Demo", "test11", "surgeUrl", GenUtil.getEnCode(surgeUrl)));
        LogUtil.loggerLine(Log.of("Demo", "test11", "flyBirdCloudUrl", GenUtil.getEnCode(flyBirdCloudUrl)));
        LogUtil.loggerLine(Log.of("Demo", "test11", "flyBirdCloudTwoUrl", GenUtil.getEnCode(flyBirdCloudTwoUrl)));
    }

    private test12(): void {
        let fileName = "C:\\Users\\Admin\\Desktop\\.env.dev";
        FileUtil.modContent(
            fileName,
            "^VITE_HTTP_BASE_URL\\s*=\\s*(http.+)",
            "https://bc.yongkj.cn/"
        )
    }

    private test13(): void {
        let fileName = "D:\\Document\\MyCodes\\BC-Space\\Worker\\Web\\desktop-platform\\package.json";
        FileUtil.modContent(
            fileName,
            ".*\"build:dev\".*\"(.*)\"",
            "vite build --mode dev"
        )
    }

    private async test14(): Promise<void> {
        const auth = createLongLivedTokenAuth(
            "http://localhost:8123",
            "YOUR ACCESS TOKEN",
        );

        const connection = await createConnection({ auth });
        subscribeEntities(connection, (entities) => console.log(entities));
    }

    public static run(): void {
        let demo = new Demo();
        // demo.test13();
        // demo.test12();
        demo.test11();
        // demo.test10();
        // demo.test9();
        // demo.test8();
        // demo.test6();
        // demo.test5();
        // demo.test4();
        // demo.test3();
        // demo.test1();
        // demo.test();
    }

}