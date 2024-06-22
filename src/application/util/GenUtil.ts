import YAML from "yaml";
import {FileUtil} from "./FileUtil";
import {ChildProcess} from "child_process";
import * as DateTimeUtil from "date-fns";
import {OrbitEncoder} from "orbit-encoder/lib/OrbitEncoder"
import crypto from "crypto";
import {DataUtil} from "./DataUtil";

export class GenUtil {

    private constructor() {
    }

    public static arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    public static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    public static isBrowser(): boolean {
        return typeof globalThis.window !== "undefined";
    }

    public static getRandomCode(num?: number): string {
        num = num || 6;
        let randomCode = "";
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGJKLMNPRSTUVWXYZ0123456789";
        for (let i = 0; i < num; i++) {
            let index = GenUtil.getRandom(0, chars.length);
            randomCode += chars[index];
        }
        return randomCode;
    }

    public static getRandom(n: number, m: number): number {
        return Math.floor(Math.random() * (m - n) + n);
    }

    public static stringToUint8Array(str: string): Uint8Array {
        let arr = [];
        for (let i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        return new Uint8Array(arr);
    }

    public static uint8ArrayToString(fileData: Uint8Array): string {
        let dataString = "";
        for (let i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString;
    }

    public static getDeCode(lstStr: Array<string> | string): Array<string> | string {
        if (typeof lstStr === "string") return this.getDeCodeStr(lstStr);
        let strs = new Array<string>();
        lstStr.forEach(str => strs.push(this.getDeCodeStr(str)))
        return strs;
    }

    private static getDeCodeStr(str: string): string {
        return Buffer.from(OrbitEncoder.decodeURIsafe(str), "base64").toString();
    }

    public static getKeys(data: Map<string, any> | Record<string, any>): Array<string> {
        if (GenUtil.isJson(data)) {
            return Object.keys(data);
        }
        let lstKey = new Array<string>();
        for (let key of data.keys()) {
            lstKey.push(key);
        }
        return lstKey;
    }

    public static arrayToObjList<T>(lstData: Array<Record<string, any> | Map<string, any>>, clazz: (new () => T) | T): Array<T> {
        let lstObj = new Array<T>();
        for (let data of lstData) {
            lstObj.push(
                this.isJson(data) ?
                    this.recToObj(data, clazz) :
                    this.mapToObj(<Map<string, any>>data, clazz)
            );
        }
        return lstObj;
    }

    public static mapToObj<T>(mapData: Map<string, any>, clazz: (new () => T) | T): T {
        let entity = typeof clazz === "function" ?
            new (<new () => T>clazz)() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[<keyof T>methodName] = mapData.get(methodName);
        }
        return entity;
    }

    public static recToObj<T>(recData: Record<string, any>, clazz: (new () => T) | T): T {
        let entity = typeof clazz === "function" ?
            new (<new () => T>clazz)() : clazz;
        let methodNames = DataUtil.getPrototypes(clazz);
        for (let methodName of methodNames) {
            entity[<keyof T>methodName] = recData[methodName];
        }
        return entity;
    }

    public static arrayToMapList<T>(lstObj: Array<T>): Array<Map<string, any>> {
        let lstData = new Array<Map<string, any>>();
        for (let obj of lstObj) {
            lstData.push(
                !(this.isJson(obj)) ?
                    this.objToMap(obj) :
                    this.recToMap(<Map<string, any>>obj)
            );
        }
        return lstData;
    }

    public static isJson<T>(obj: T): boolean {
        return typeof obj !== "undefined" && obj !== null && (<Record<string, any>>obj).constructor === {}.constructor;
    }

    public static recToMap(recData: Record<string, any>): Map<string, any> {
        let mapData = new Map<string, any>();
        for (let key of Object.keys(recData)) {
            mapData.set(key, recData[key]);
        }
        return mapData;
    }

    public static objToMap<T>(obj: T): Map<string, any> {
        let mapData = new Map<string, any>();
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            mapData.set(methodName, obj[<keyof T>methodName]);
        }
        return mapData;
    }

    public static arrayToStr<T>(lstData: Array<T>): string {
        return JSON.stringify(lstData);
    }

    public static recToStr(record: Record<string, any> | Array<Record<string, any>>, pretty?: boolean): string {
        return typeof pretty === "undefined" ? JSON.stringify(record) : JSON.stringify(record, null, 2);
    }

    public static arrayToRecList<T>(lstObj: Array<T>): Array<Record<string, any>> {
        let lstData = new Array<Record<string, any>>();
        for (let obj of lstObj) {
            lstData.push(
                !(obj instanceof Map) ?
                    this.objToRecord(obj) :
                    this.mapToRecord(<Map<string, any>>obj)
            );
        }
        return lstData;
    }

    public static objToRecord<T>(obj: T): Record<string, any> {
        let recData: Record<string, any> = {};
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            recData[methodName] = obj[<keyof T>methodName];
        }
        return recData;
    }

    public static mapToRecord(mapData: Map<string, any>): Record<string, any> {
        let recData: Record<string, any> = {};
        let regStr = "^[+-]?\\d*(\\.\\d*)?(e[+-]?\\d+)?$";
        let regex = new RegExp(regStr);
        for (let [key, value] of mapData) {
            recData[key] = regex.test(value) ? this.strToNumber(value) : value;
        }
        return recData;
    }

    public static recAddAll(recOldData: Record<string, any>, recNewData: Record<string, any>): void {
        for (let key of Object.keys(recNewData)) {
            recOldData[key] = recNewData[key];
        }
    }

    public static sleep(waitTimeInMs: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }

    public static timer(func: () => void, time: number): void {
        setTimeout(func, time);
    }

    public static getMd5Str(str: string): string {
        return crypto.createHash("md5").update(String(str)).digest("hex").toUpperCase();
    }

    private static getEnCodeStr(str: string): string {
        return OrbitEncoder.encodeWithURIsafe(Buffer.from(str).toString("base64"));
    }

    public static getEnCode(lstStr: Array<string> | string): Array<string> | string {
        if (typeof lstStr === "string") return this.getEnCodeStr(lstStr);
        let strs = new Array<string>();
        lstStr.forEach(str => strs.push(this.getEnCodeStr(str)))
        return strs;
    }

    public static strToRecord(str: string): Record<string, any> {
        return JSON.parse(str);
    }

    public static strToDate(timeStr: string, format?: string, isISO?: boolean): Date | null {
        format = format || "yyyy-MM-dd HH:mm:ss";
        let date = DateTimeUtil.parseISO(timeStr);
        if (DateTimeUtil.isValid(date)) {
            return isISO ? date : DateTimeUtil.parse(timeStr, format, new Date());
        }
        return null;
    }

    public static dateToStr(time: Date | number, format?: string): string {
        format = format || "yyyy-MM-dd HH:mm:ss";
        return DateTimeUtil.format(time, format);
    }

    public static toHump(name: string): string {
        return name[0].toUpperCase() + name.substring(1)
            .replace(/\-(\w)/g, (all, letter) => {
                return letter.toUpperCase();
            });
    }

    public static toLine(name: string): string {
        return name[0].toLowerCase() + name.substring(1)
            .replace(/([A-Z])/g, "-$1").toLowerCase();
    }

    private static getYaml(): string {
        let launchName = FileUtil.getLaunchName();
        let sep = launchName.includes("\\") ? "\\" : "/";
        if (!launchName.endsWith("script-ts.js")) {
            let index = launchName.lastIndexOf(sep);
            let name = launchName.substring(index + 1);
            return this.toLine(name.replace(".js", ".yaml"));
        }
        return this.getYamlByContent();
    }

    private static getYamlByContent(): string {
        let path = FileUtil.getAbsPath(false, "src", "application", "ApplicationTest.ts");
        let regex = new RegExp("^((?!\\s\\/).)*\\s+(\\S+).run\\(\\);");
        let contentArray = FileUtil.readByLine(path);
        for (let line of contentArray) {
            if (!regex.test(line)) continue;
            let lstMatch = line.match(regex);
            if (lstMatch == null) continue;
            return this.toLine(lstMatch[2]) + ".yaml";
        }
        return "";
    }

    public static getValue(key: string): unknown {
        let path = this.getConfigPath(this.getYaml());
        let content = FileUtil.read(path);
        return YAML.parse(content)[key];
    }

    public static getConfig(config: string): Record<string, any> {
        let path = this.getConfigPath(config);
        let content = FileUtil.read(path);
        return YAML.parse(content);
    }

    public static writeConfig(config: string, recData: Record<string, any>): void {
        let path = this.getConfigPath(config);
        let content = YAML.stringify(recData);
        FileUtil.write(path, content);
    }

    private static getConfigPath(config: string): string {
        let path = FileUtil.getAbsPath(true, config);
        if (!FileUtil.exist(path)) {
            path = FileUtil.getAbsPath(false, "src", "assets", config);
        }
        return path;
    }

    public static strToNumber(str?: string | null | number): number {
        return typeof str === "string" ? Number(str) : (typeof str === "undefined" || str == null ? 0 : str);
    }

    public static anyToStr(str?: any): string {
        return typeof str === "string" ? str : (typeof str === "undefined" || str == null ? "" : str + "");
    }

    public static strToList(str?: string, separator?: string): Array<string> {
        if (typeof str === "undefined" || str.length === 0) return new Array<string>();
        return str.trim().split(separator == null ? " " : separator);
    }

    public static listToStr(lstStr: Array<string>, separator?: string): string {
        let tempStr = "";
        lstStr.forEach(str => tempStr += str + (separator == null ? " " : separator));
        return tempStr.substring(0, tempStr.length - (separator == null ? 1 : separator.length));
    }

    public static readCommand(): string {
        return process.argv.length > 2 ? process.argv[2] : "";
    }

    public static readParams(child?: ChildProcess): Promise<Array<string>> {
        process.stdin.setEncoding('utf-8');
        return new Promise<Array<string>>(resolve => {
            let input = new Promise<Array<string>>(res => {
                process.stdin.resume();
                process.stdin.on('data', (data) => {
                    process.stdin.pause();
                    res(GenUtil.strToList(data.toString()));
                });
            });
            let exit = new Promise<Array<string>>(res => {
                if (typeof child !== "undefined") {
                    child.on("exit", () => {
                        res(Array.of("kill"));
                    });
                } else {
                    res(Array.of("kill"));
                }
            });
            Promise.race(typeof child === "undefined" ? [input] : [input, exit])
                .then(res => resolve(res));
        });
    }

    public static println(str?: string): void {
        console.log(str == null ? "" : str);
    }

    public static print(str: string): void {
        process.stdout.write(str);
    }

}