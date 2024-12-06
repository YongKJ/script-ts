import { GenUtil } from "../../util/GenUtil";
import { LogUtil } from "../../util/LogUtil";
import { Log } from "../../pojo/dto/Log";
import { FileUtil } from "../../util/FileUtil";
import { createConnection, createLongLivedTokenAuth, subscribeEntities } from "home-assistant-js-websocket";
import { MsgUtil } from "../../util/MsgUtil";
import { v2 as webdav } from "webdav-server";
import { ExcelUtil } from "../../util/ExcelUtil";
import { Statistics } from "./pojo/dto/Statistics";
import { EnumUtil } from "./util/EnumUtil";
import { SnowflakeIdv1 } from "simple-flakeid";
import PathUtil from "path";
import fs from "fs";
import { ApiUtil } from "../../util/ApiUtil";
import pako from "pako";
import { AesUtil } from "../../util/AesUtil";
import { RsaUtil } from "../../util/RsaUtil";
import { RsaWebUtil } from "../../util/RsaWebUtil";

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
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceOne", GenUtil.recToStr({ url: replaceOne })));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceTwo", GenUtil.recToStr({ url: replaceTwo })));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceThree", GenUtil.recToStr({ url: replaceThree })));
        LogUtil.loggerLine(Log.of("Demo", "test9", "replaceFour", GenUtil.recToStr({ url: replaceFour })));
        LogUtil.loggerLine(Log.of("Demo", "test9", "str", GenUtil.recToStr({ str: "http:\\/\\/alpine.yongkj.cn\/dataGenerate\/subscribe?type=" })));
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

    private async test15(): Promise<void> {
        let responseData = FileUtil.read("C:\\Users\\Admin\\Desktop\\responseData.txt");
        let lstUrl = Buffer.from(responseData, "base64").toString().split("\n");
        LogUtil.loggerLine(Log.of("Demo", "test15", "lstUrl", lstUrl));
        for (let url of lstUrl) {
            LogUtil.loggerLine(Log.of("Demo", "test15", "url", url));
            let srcConfigData = url.split("\/\/")[1];
            if (srcConfigData.includes("#")) {
                srcConfigData = srcConfigData.split("#")[0];
            }
            LogUtil.loggerLine(Log.of("Demo", "test15", "srcConfigData", srcConfigData));
            let desConfigData = Demo.getDesConfigData(srcConfigData, url);
            LogUtil.loggerLine(Log.of("Demo", "test15", "desConfigData", desConfigData));
            let newUrl = url.replace(srcConfigData, desConfigData);
            LogUtil.loggerLine(Log.of("Demo", "test15", "newUrl", newUrl));
            console.log("----------------------------------------------------------------------------------------------")
        }
        let urlStr = lstUrl.join("\n");
        let data = Buffer.from(urlStr).toString("base64");
        LogUtil.loggerLine(Log.of("Demo", "test15", "urlStr", urlStr));
        LogUtil.loggerLine(Log.of("Demo", "test15", "data", data));
    }

    private static getDesConfigData(srcConfigData: string, url: string): string {
        let oldConfigData = Buffer.from(srcConfigData, "base64").toString();
        let hostData = Demo.getHostData(oldConfigData, url);

        LogUtil.loggerLine(Log.of("Demo", "getDesConfigData", "oldConfigData", oldConfigData));
        LogUtil.loggerLine(Log.of("Demo", "getDesConfigData", "hostData", hostData));

        let newConfigData = "";
        if (oldConfigData.startsWith("{") && oldConfigData.endsWith("}")) {
            let configObj = GenUtil.strToRecord(oldConfigData);
            configObj["add"] = hostData.split(":")[0];
            newConfigData = GenUtil.recToStr(configObj);
        } else {
            let tempConfigData = oldConfigData.split("@")[0];
            newConfigData = tempConfigData + "@" + hostData;
        }
        LogUtil.loggerLine(Log.of("Demo", "getDesConfigData", "newConfigData", newConfigData));
        return Buffer.from(newConfigData).toString("base64");
    }

    private static getHostData(configData: string, url: string): string {
        if (configData.startsWith("{") && configData.endsWith("}")) {
            let configObj = GenUtil.strToRecord(configData);
            return configObj.ps.split("@")[1];
        } else {
            let desc = url.split("#")[1];
            return desc.split("@")[1];
        }
    }

    private test16(): void {
        let msgUtil = new MsgUtil("http://localhost:7799", "/chat")
        msgUtil.subscribeMessage("msg", data => {
            LogUtil.logger(Log.of("Demo", "test14", "data", data));
        })
        msgUtil.sendMessage("msg", "Hello world!")
    }

    private test17(): void {
        const userManager = new webdav.SimpleUserManager();
        const user = userManager.addUser('yongkj', '*Dxj1003746818', false);

        const privilegeManager = new webdav.SimplePathPrivilegeManager();
        privilegeManager.setRights(user, '/', ['all']);

        const server = new webdav.WebDAVServer({
            httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
            privilegeManager: privilegeManager,
            port: 6699
        });

        server.start(() => console.log('READY'));
    }

    private test18(): void {
        let refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoU3RyIjoiQ3JCQ0RVRk1GVUZZRFlCS1lCeUJEQTFyQVlzQU5vZ0ZZQ3kyMkFqZ0ZvQmUyQThzUUtMUUFNK2lBNG91TnVPTUNqcG84ZUFNekErYUFJb3NBak5tUXNBdkVBIiwiaWF0IjoxNzE2NzA1MjQ1LCJleHAiOjE3MTY3OTE2NDV9.U-Sh4qpj6VuclH_d3GHfHczXdivrGXgX-9lhNWkGaQ4";
        LogUtil.loggerLine(Log.of("Demo", "test17", "GenUtil.getEnCode(refreshToken)", GenUtil.getEnCode(refreshToken)));
    }

    private async test19(): Promise<void> {
        let lstData = await ExcelUtil.toMap(
            "C:\\Users\\admin\\Desktop\\角度整合.xlsx",
            "paixu_da12xiao54_heng", 2
        );
        let mapData = new Map<string, Array<Record<string, any>>>();
        for (let data of lstData) {
            let index = 0;
            let indexStr = "0";
            for (let [key, value] of data) {
                if (key === "数据组") {
                    index = GenUtil.strToNumber(value);
                    indexStr = value;
                    continue;
                }
                let fields = key.split("-");
                if (!mapData.has(fields[0])) {
                    mapData.set(fields[0], new Array<Record<string, any>>());
                }
                if (mapData.get(fields[0])?.length === index) {
                    mapData.get(fields[0])?.push({ index: index });
                }

                let objKey = "value";
                switch (fields[1]) {
                    case "平均值":
                        objKey = "avgValue";
                        break
                    case "最大值":
                        objKey = "maxValue";
                        break
                    case "最小值":
                        objKey = "minValue";
                        break
                    case "实际值":
                        objKey = "realValue";
                        break
                    default:
                        break;
                }

                (<Array<Record<string, any>>>mapData.get(fields[0]))[index][objKey] = value;
            }
        }
        // LogUtil.loggerLine(Log.of("Demo", "test19", "lstData", lstData));
        LogUtil.loggerLine(Log.of("Demo", "test19", "mapData.keys()", mapData.keys()));
        FileUtil.write(
            "C:\\Users\\admin\\Desktop\\角度整合.json",
            GenUtil.recToStr(GenUtil.mapToRecord(mapData))
        );
    }

    private async test20(): Promise<void> {
        let fileName = "C:\\Users\\admin\\Desktop\\角度整合pro.xlsx";
        let workerId = 568736985534533;
        let videoTimestamp = 1679756865086;
        let sheetData = await ExcelUtil.toMap(fileName, 0);
        let mapData = await this.getMapSheetData(workerId, videoTimestamp, sheetData);

        let lstData = new Array<Record<string, any>>();
        for (let [key, statisticsData] of mapData) {
            for (let data of statisticsData) {
                lstData.push(GenUtil.objToRecord(data));
            }
        }
        FileUtil.write(
            "C:\\Users\\admin\\Desktop\\角度整合pro.json",
            GenUtil.arrayToStr(lstData)
        );
    }

    private async getMapSheetData(workerId: number, videoTimestamp: number, sheetData: Array<Map<string, any>>): Promise<Map<string, Array<Statistics>>> {
        let mapData = new Map<string, Array<Statistics>>;
        let mapLabel = new Map<string, Record<string, any>>();
        for (let data of sheetData) {
            let index = 0;
            let indexStr = "0";
            for (let [key, value] of data) {
                if (key === "编号") {
                    index = GenUtil.strToNumber(value);
                    indexStr = value;
                    continue;
                }
                let fields = key.split("-");
                let perspectiveType = fields[1];
                let positionType = fields[0];
                let valueType = fields[2];

                let positionId = EnumUtil.getStatisticsPositionId(positionType);
                let perspectiveId = EnumUtil.getStatisticsPerspectiveId(perspectiveType);
                if (!mapLabel.has(positionType)) {
                    let labelData = <Record<string, any>>{};
                    labelData.perspectives = new Array<Record<string, any>>();
                    labelData.name = positionType;
                    labelData.id = positionId;

                    mapLabel.set(positionType, labelData);
                }

                let perspective = (<Record<string, any>>mapLabel.get(positionType))
                    .perspectives.find((po: Record<string, any>) => po.name === perspectiveType);
                if (typeof perspective === "undefined") {
                    (<Record<string, any>>mapLabel.get(positionType)).perspectives.push({
                        id: perspectiveId,
                        name: perspectiveType
                    });
                }


                let mapKey = positionType + perspectiveType;
                if (!mapData.has(mapKey)) {
                    mapData.set(mapKey, new Array<Statistics>());
                }
                if (mapData.get(mapKey)?.length === index) {
                    let statistics = new Statistics();
                    let genId = new SnowflakeIdv1({ workerId: 1 });

                    statistics.xData = index;
                    statistics.workerId = workerId;
                    statistics.position = positionId;
                    statistics.id = genId.NextNumber();
                    statistics.perspective = perspectiveId;
                    statistics.videoTimestamp = videoTimestamp;
                    mapData.get(mapKey)?.push(statistics);
                }

                let valueField = EnumUtil.getValueTypeField(valueType);
                (<Array<Statistics>>mapData.get(mapKey))[index].yData[valueField] = value;
            }
        }

        LogUtil.loggerLine(Log.of("Demo", "test20", "mapLabel", mapLabel));

        return mapData;
    }

    private static getStatus(): void {
        let res = {
            activityStatus: 0,
            operationStatus: 0,
            businessStatus: 0,
            expirationTime: 0
        }

        if (res.operationStatus === 2 && res.expirationTime === 0 && res.businessStatus === 1) {
            console.log("已交保证金");
        } else if ((res.operationStatus == 2 && res.expirationTime > 0) || res.businessStatus == 2) {
            console.log("待缴费状态");
        } else {
            if (res.operationStatus == 1) {
                console.log("试运营中");
            } else if (res.activityStatus == 1) {
                console.log("活动开始");
            }
        }
    }

    private test21(): void {
        // let fileName = "D:\\Document\\MyCodes\\Gitea\\api-ts\\src\\application\\module\\CentralModule.ts";
        // let regStr = "\\s+(\/\/\\s)TreadModule,";
        // FileUtil.modContent(fileName, regStr, "");

        // let fileName = "D:\\Document\\MyCodes\\Gitea\\api-ts\\src\\application\\module\\CentralModule.ts";
        // let regStr = "(\\s+)TreadModule,";
        // FileUtil.modify(fileName, regStr, matchStr => matchStr + "// ");

        let fileName = "D:\\Document\\MyCodes\\Gitea\\api-ts\\src\\application\\config\\Global.ts";
        let regStr = "\\s+private static readonly _mysqlHost = \"(.*)\"";
        FileUtil.modContent(fileName, regStr, "pi.yongkj.cn");
    }

    public test22(): void {
        let str = "./node_modules/.pnpm/@nestjs+terminus@10.2.0_@nestjs+common@9.4.3_@nestjs+core@9.4.3_@nestjs+typeorm@9.0.1_reflect_24qmn2wp5k4xizwmv5xu76e4re/node_modules/@nestjs/terminus/dist/utils/types.js.map";
        let regStr = ".*@nestjs\/terminus\/dist\/utils\/.*\.map";
        let regex = new RegExp(regStr);
        let flag = regex.test(str);
        LogUtil.loggerLine(Log.of("Demo", "test22", "flag", flag));
    }

    private test23(): void {
        let fileName = "D:\\Document\\MyCodes\\Gitea\\api-web-vue3\\src\\router\\index.ts";
        let regStr = "redirect:\\s{[\\s\\S]*?name:\\s\"(\\w+)\"[\\s\\S]*?}";
        FileUtil.modifyFile(fileName, regStr, (allStr, matchStr) => {
            LogUtil.loggerLine(Log.of("Demo", "test23", "allStr", allStr));
            LogUtil.loggerLine(Log.of("Demo", "test23", "matchStr", matchStr));
            return <string>allStr?.replace(<any>matchStr, "visual");
        });
    }

    private async test24(): Promise<void> {
        let num = 57;
        for (let i = 57; ; i++) {
            let version = "1." + i + ".0";
            // let folder = "C:\\Users\\Admin\\Desktop";
            let folder = "E:\\Download\\yuque\\" + version;
            if (!FileUtil.exist(folder)) {
                FileUtil.mkdir(folder);
            }

            let cssUrl = `https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/${version}/umd/doc.css`;
            let jsUrl = `https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/${version}/umd/doc.umd.js`;

            try {
                let cssFileName = await this.offline(cssUrl, folder);
                let jsFileName = await this.offline(jsUrl, folder);

                LogUtil.loggerLine(Log.of("Demo", "test24", "cssFileName", cssFileName));
                LogUtil.loggerLine(Log.of("Demo", "test24", "jsFileName", jsFileName));
            } catch (e: any) {
                break;
            }
        }
    }

    private async offline(url: string, path: string): Promise<string> {
        let index = url.lastIndexOf("/");
        let fileName = url.substring(index + 1);
        await new Promise<void>(resolve => {
            ApiUtil.requestWithUrlByGetAndDownload(url, async res => {
                let content: string = res.headers["content-disposition"];
                if (typeof content !== "undefined") {
                    index = content.lastIndexOf("filename=");
                    fileName = content.substring(index + 9);
                    let regex = new RegExp("\"(.+)\"");
                    if (regex.test(fileName)) {
                        let lstMatch = fileName.match(regex);
                        if (lstMatch != null) {
                            fileName = lstMatch[1];
                        }
                    }
                }
                fileName = path + PathUtil.sep + decodeURIComponent(fileName);
                await fs.promises.writeFile(fileName, res.data, "binary");
                resolve();
            }, err => {
                LogUtil.loggerLine(Log.of("Demo", "offline", "err", err))
            });
        });
        return fileName;
    }

    private test25(): void {
        let str = "Hello world";
        // LogUtil.loggerLine(Log.of("Demo", "test25", "outputUnit", pako.deflate(str, {level: 9})))
        let outputStr = pako.gzip(str);
        let urlOutPutStr = encodeURIComponent(GenUtil.uint8ArrayToString(outputStr));

        let inputStr = decodeURIComponent(urlOutPutStr)
        let inputUnit = GenUtil.stringToUint8Array(inputStr)
        let inputResult = GenUtil.uint8ArrayToString(pako.inflate(inputUnit))

        LogUtil.loggerLine(Log.of("Demo", "test25", "outputStr", outputStr))
        LogUtil.loggerLine(Log.of("Demo", "test25", "urlOutPutStr", urlOutPutStr))
        LogUtil.loggerLine(Log.of("Demo", "test25", "inputStr", inputStr))
        LogUtil.loggerLine(Log.of("Demo", "test25", "inputResult", inputResult))

        let tempInput = "x%9C%F2H%CD%C9%C9W%28%CF%2F%CAI%01%00%00%00%FF%FF%01%00%00%FF%FF%18%AB%04%3D";
        let tempInputStr = decodeURIComponent(tempInput);
        let tempInputUnit = GenUtil.stringToUint8Array(tempInputStr);
        let tempInputResult = pako.inflateRaw(tempInputUnit);

        LogUtil.loggerLine(Log.of("Demo", "test25", "tempInputStr", tempInputStr))
        LogUtil.loggerLine(Log.of("Demo", "test25", "tempInputResult", tempInputResult))
    }

    private test26(): void {
        let str = "Hello world";
        let iv = AesUtil.generateIV();
        let key = AesUtil.generateKey();

        let encryptStr = AesUtil.aesEncrypt(key, iv, str);
        let decryptStr = AesUtil.aesDecrypt(key, iv, encryptStr);

        LogUtil.loggerLine(Log.of("Demo", "test25", "encryptStr", encryptStr));
        LogUtil.loggerLine(Log.of("Demo", "test25", "decryptStr", decryptStr));
    }

    private async test27(): Promise<void> {
        let str = "Hello world";
        let keyPair = RsaUtil.generateKey();
        LogUtil.loggerLine(Log.of("Demo", "test27", "keyPair", keyPair));

        let encryptStr = RsaUtil.rsaEncrypt(keyPair.privateKey, str, "private");
        let decryptStr = RsaUtil.rsaDecrypt(keyPair.publicKey, encryptStr, "public");

        LogUtil.loggerLine(Log.of("Demo", "test27", "encryptStr", encryptStr));
        LogUtil.loggerLine(Log.of("Demo", "test27", "decryptStr", decryptStr));

        encryptStr = RsaUtil.rsaEncrypt(keyPair.publicKey, str, "public");
        decryptStr = RsaUtil.rsaDecrypt(keyPair.privateKey, encryptStr, "private");

        LogUtil.loggerLine(Log.of("Demo", "test27", "encryptStr", encryptStr));
        LogUtil.loggerLine(Log.of("Demo", "test27", "decryptStr", decryptStr));
    }

    private async test28(): Promise<void> {
        let str = "Hello world";
        // let keyPair = RsaUtil.generateKey();
        // let keyPair = await RsaWebUtil.generateKey("OAEP");
        let keyPair = await RsaWebUtil.generateKey("PSS");
        // let keyPair = {
        //     privateKey: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCLVVzGq2MEmlyOe9x3k80bZEWMuZVU9VWJGO39p4sEKp1D56ThNBr/tFX6ruOBoymE3VVuGV7fDU+WMK7F4+/hIiAnBwral1UQm/T1vlHyQP+vEFbxvkjoPDNUv6pxEXO9G8JF53n+6HeF7E/A/kDwlCP678krVMidz/jrotar0vHp1LSevpl7J6aFHaMb6ttXlo/y9kC5+oEp1TrivnBdfgjxfUME/ZViATsm51HD+EWi3KCMJRICyInfCPrp7wPoaZeaFHmPic1sEXZFvPGp+rTygvWbJmFC6NoPWbT8RMcG4Dwx8y2xzoMNOrINgrxy6aRVPq4nCsSjC6EZjAiNAgMBAAECggEAFgGqgJprLjvvKHX5sU0/1Pa2YW6iXmPNWbT9SdXfiA3u/t2kVglzxjVGayyaNEx/70NCDfyl1lb03gTcZdcFeSp5p5BeL349aj0nqHSh3sBTYeQTx2TFgSCY/uay1d7qx9CNk5rm0tMGpblYM2Q0/4p2UFj1Dgn7EanaZ+U1QLf3Qhhm35SbS9b27gghANgoPG0lRKkXYqTems5WDOoVz9t4G+gfYVp9Vvk1FlhNgV54s7KgUDDc31acIX4no9P9+5g5tOWA0tSXJyrdautoAMAFAc3tcW9SgRJAcgXFr1sixIqqoWa9tzf1iJdesC+qa2kdNqH7FyiBFuOnOCbVhQKBgQD91zcRX2olhhmv9DJCmIJ3M99O59CM1LXWeNerraenX0gg/G1ZeqY40RwwTkFw2lsx34PZybPXifmxF1oV6ZU4OAMtFw3K7N8Ag3Zl6oOO+WqWjowTp+Gh0U98E9BtHYdJ8seI79pJgU8ghkfYTI95GbF3yD1lLNiCxcNd4oSNhwKBgQCMhMljoykmgrZkpd2stoZQlj1oUpbASvWkZIusKYktTptoG9YIUeGrhgYbgH5o/uIzfWvrK2Acw4+FgVBXVmCgWCBxKWR49XvvEcJZMnhngjCo2BUS/BQzWjvEz6G5HURS6yeI/VuqJQewRUmta53MoipVXV3WtmQ1qW0C8QleSwKBgQD8jwMVX+/GwfQQ41CWfhNg8tV+NpuDY6hAah97it5CY0TqvP03iBaWdUgsr8/grwEJUDBpoowzKe6rSmaxYqS7OM/ALy3j92WxpxtIL9sRiAuLHO02KVUPoagJ9dTsm/Kdmtb44lw3wlauL6yQAyzE+tFeMncTkVkiVA4b/WKRRQKBgCZGSQCtwZiuw/WYRFA2C1HKCoHu9Qb9o/kaNf039xhzL9tksaDkhL6Oq/0zu7rnqj9yK0IMN4q+LcqklXikm38xYezQ5IAaBZ7xzGk1WRyAlrZ23Q6lwO7X5i3OjHN6qFCZotQqhpxKp9R4mv/0ry+9ACDuZJAGcDc5perGMtIPAoGAf4Z0XFvNwexPj8DIRdcu+CeeQZRIW5eBt7x8uFw89XSQpoFahj4hjrcxHuBIQwdG78pWDI97s0HSORltB0ivr5OQUhm3c8pEChFdDJNOMa7aCfdqkt4Vp5sb4tHH8QsxVUuTqVonQujIb86iKA1qlzvz862WfB3i6vgRp+h1OfE=",
        //     publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAi1VcxqtjBJpcjnvcd5PNG2RFjLmVVPVViRjt/aeLBCqdQ+ek4TQa/7RV+q7jgaMphN1Vbhle3w1PljCuxePv4SIgJwcK2pdVEJv09b5R8kD/rxBW8b5I6DwzVL+qcRFzvRvCRed5/uh3hexPwP5A8JQj+u/JK1TInc/466LWq9Lx6dS0nr6ZeyemhR2jG+rbV5aP8vZAufqBKdU64r5wXX4I8X1DBP2VYgE7JudRw/hFotygjCUSAsiJ3wj66e8D6GmXmhR5j4nNbBF2Rbzxqfq08oL1myZhQujaD1m0/ETHBuA8MfMtsc6DDTqyDYK8cumkVT6uJwrEowuhGYwIjQIDAQAB",
        // };

        LogUtil.loggerLine(Log.of("Demo", "test27", "keyPair", keyPair));

        // let encryptStr = "fYjKWRmWGR3q/raRJ+u0tCC3Z0UPpk9Qpr9di/+coK5Wfdrdjs5aoSMw7E5yHF3AxNIC8ku8QUEl8ImKY+4GM/R78j/zZBWW/yvNtvtBZr/MOcDdm9MHGl1HTVda2HKqgSXQBb5IJqCPGTe9tPXKk6TGGRVhDlvd6SBiOSSTWyNOpJTyjkRp2aVFqXwRDCdDmxOEHgaGgnzdV1qeTolkp5cwgjULzQfKsyQYbZ7rvhRky/+mHmA9oKgZxYrh7G5Qs+c7ZewcDVGyXCktXtaBWMaPAbuUjmtBy80JUk5p0HUS0hnF5gW9PrH+izbbnSJuliVbP2Eh1eveLsroEDTxRg==";
        let encryptStr = await RsaWebUtil.rsaEncrypt(keyPair.privateKey, str, "private", "PSS");
        let decryptStr = await RsaWebUtil.rsaDecrypt(keyPair.publicKey, encryptStr, "public", "PSS", str);

        LogUtil.loggerLine(Log.of("Demo", "test27", "encryptStr", encryptStr));
        LogUtil.loggerLine(Log.of("Demo", "test27", "decryptStr", decryptStr));

        // let encryptStr = await RsaWebUtil.rsaEncrypt(keyPair.publicKey, str, "public", "OAEP");
        // let decryptStr = await RsaWebUtil.rsaDecrypt(keyPair.privateKey, encryptStr, "private", "OAEP");

        // let encryptStr = await RsaWebUtil.rsaEncrypt(keyPair.publicKey, str, "public", "PSS");
        // let decryptStr = await RsaWebUtil.rsaDecrypt(keyPair.privateKey, encryptStr, "private", "PSS");

        // LogUtil.loggerLine(Log.of("Demo", "test27", "encryptStr", encryptStr));
        // LogUtil.loggerLine(Log.of("Demo", "test27", "decryptStr", decryptStr));
    }

    private test29(): void {
        let content = "Hello world";
        let compressedStr = <string>GenUtil.getEnCode(content);
        let decompressedStr = GenUtil.getDeCode(compressedStr);
        let contentBase64 = Buffer.from(content).toString("base64");

        LogUtil.loggerLine(Log.of("Demo", "test28", "contentBase64", contentBase64));
        LogUtil.loggerLine(Log.of("Demo", "test28", "compressedStr", compressedStr));
        LogUtil.loggerLine(Log.of("Demo", "test28", "decompressedStr", decompressedStr));

        // let str = "JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBVCAlGkPfNFMAEzUPlgAOKRmgBSAZwBaGYVwC2ARQCejAHaEINNJNzBiJeWAEB5OgCEI%20cgBZKdGAEYA9jRiiAGlywAGALxA";
        let str = "JoKwcghgRg4mAuBTGALANgVQF5oE4HUA1FAZQgFEB3SgWQBVCAlGkPfNFMAEzUPlgAOKRmgBSAZwBaGYVwC2ARQCejAHaEINNJNzBiJeWAEB5OgCEI+cgBZKdGAEYA9jRiiAGlywAGALxA";
        let deStr = GenUtil.getDeCode(str);
        LogUtil.loggerLine(Log.of("Demo", "test29", "deStr", deStr));

        let path = "overlay/data/MyCodes/RichText/wangeditor/test.html";
        let enStr = GenUtil.getEnCode(path);
        LogUtil.loggerLine(Log.of("Demo", "test29", "enStr", enStr));


    }

    private test30(): void {
        let regStr = "(<select\\s+class=\"ql-ui\".*>[\\s\\S]*?</select>)";
        let path = "C:\\Users\\admin\\Downloads\\test (4).html";
        FileUtil.modFile(path, regStr, "");
    }

    public static run(): void {
        let demo = new Demo();
        // demo.test30();
        demo.test29();
        // demo.test28().then();
        // demo.test27().then();
        // demo.test26();
        // demo.test25();
        // demo.test24().then();
        // demo.test23();
        // demo.test22();
        // demo.test21();
        // demo.test20().then();
        // demo.test19().then();
        // demo.test18();
        // demo.test17();
        // demo.test16();
        // demo.test15();
        // demo.test14();
        // demo.test13();
        // demo.test12();
        // demo.test11();
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