import axios, {AxiosBasicCredentials, AxiosInstance} from "axios";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";
import {GenUtil} from "./GenUtil";
import {DataUtil} from "./DataUtil";
import qs from 'qs';

export class ApiUtil {

    private constructor() {
    }

    private static readonly restTemplate = ApiUtil.getResTemplate();

    private static getResTemplate(): AxiosInstance {
        return axios.create({
            withCredentials: true,
            timeout: 5 * 60 * 1000 // 请求超时
        });
    }

    public static requestWithParamsByGetAndAuth(api: string, auth: AxiosBasicCredentials, params: Map<string, any>): Promise<string | Error> {
        let url = this.getUrl(api, params);
        return new Promise<string | Error>(resolve => {
            this.restTemplate.get(url, {
                auth: auth
            })
                .then(res => resolve(res.data))
                .catch(err => resolve(err));
        });
    }

    public static requestWithParamsByGetAndAuthToEntity<T>(api: string, params: Map<string, any>, clazz: new () => T): Promise<T | Error> {
        let url = this.getUrl(api, params);
        return new Promise<T | Error>(resolve => {
            this.restTemplate.get(url)
                .then(res => resolve(<T>DataUtil.convertData(res.data, clazz)))
                .catch(err => resolve(err));
        });
    }

    private static getMapConfig(recHeader: Record<string, any>, recAuth?: Record<string, any>): Record<string, any> {
        let mapConfig = new Map<string, any>([
            ["headers", recHeader]
        ]);
        if (typeof recAuth !== "undefined") {
            mapConfig.set("auth", recAuth);
        }
        return GenUtil.mapToRecord(mapConfig);
    }

    private static getUrl(api: string, params: Map<string, any>): string {
        let url = (api.includes("http") ? "" : "http://") + api;
        url += params.size === 0 ? "" : "?" + qs.stringify(GenUtil.mapToObj(params));
        LogUtil.loggerLine(Log.of("ApiUtil", "getUrl", "url", url));
        return url;
    }

}