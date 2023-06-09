import {FileUtil} from "../../../util/FileUtil";

export class WebpackConfig {

    private _path: string;
    private _modeOriginal: string;
    private _modeLatest: string;
    private _modePattern: string;
    private _entryOriginal: string;
    private _entryPattern: string;
    private _outputPathOriginal: string;
    private _outputPathLatest: string;
    private _outputPathPattern: string;
    private _outputFilenameOriginal: string;
    private _outputFilenamePattern: string;
    private _outputPluginsPattern: string;
    private _outputPluginsOriginal: string;
    private _outputPluginsLatest: string;

    public constructor(path?: string, modeOriginal?: string, modeLatest?: string, modePattern?: string, entryOriginal?: string, entryPattern?: string, outputPathOriginal?: string, outputPathLatest?: string, outputPathPattern?: string, outputFilenameOriginal?: string, outputFilenamePattern?: string, outputPluginsPattern?: string, outputPluginsOriginal?: string, outputPluginsLatest?: string) {
        this._path = path || "";
        this._modeOriginal = modeOriginal || "";
        this._modeLatest = modeLatest || "";
        this._modePattern = modePattern || "";
        this._entryOriginal = entryOriginal || "";
        this._entryPattern = entryPattern || "";
        this._outputPathOriginal = outputPathOriginal || "";
        this._outputPathLatest = outputPathLatest || "";
        this._outputPathPattern = outputPathPattern || "";
        this._outputFilenameOriginal = outputFilenameOriginal || "";
        this._outputFilenamePattern = outputFilenamePattern || "";
        this._outputPluginsPattern = outputPluginsPattern || "";
        this._outputPluginsOriginal = outputPluginsOriginal || "";
        this._outputPluginsLatest = outputPluginsLatest || "";
    }

    public static of(path: string, modeOriginal: string, modeLatest: string, modePattern: string, entryOriginal: string, entryPattern: string, outputPathOriginal: string, outputPathLatest: string, outputPathPattern: string, outputFilenameOriginal: string, outputFilenamePattern: string, outputPluginsPattern: string, outputPluginsOriginal: string, outputPluginsLatest: string): WebpackConfig {
        return new WebpackConfig(path, modeOriginal, modeLatest, modePattern, entryOriginal, entryPattern, outputPathOriginal, outputPathLatest, outputPathPattern, outputFilenameOriginal, outputFilenamePattern, outputPluginsPattern, outputPluginsOriginal, outputPluginsLatest);
    }

    public static get(): WebpackConfig {
        let config = WebpackConfig.of(
            FileUtil.getAbsPath(false, "webpack.config.js"),
            "production", "development", "\\s+mode: \"(.*)\",",
            "./dist/script-ts.js", "\\s+entry: \"(.*)\",",
            "./out", "./script", "\\s+path: path\\.resolve\\(__dirname, \"(.*)\"\\),",
            "script-ts.js", "\\s+filename: \"(.*)\"",
            "(plugins: [[\\s\\S]*])", "", "plugins: []"
        );
        return this.setOutputPluginsOriginal(config);
    }

    private static setOutputPluginsOriginal(config: WebpackConfig): WebpackConfig {
        let regex = new RegExp(config.outputPluginsPattern);
        let content = FileUtil.read(config.path);
        if (!regex.test(content)) return config;
        let lstMatch = content.match(regex);
        if (lstMatch == null) return config;
        config.outputPluginsOriginal = lstMatch[1];
        return  config;
    }

    get outputPathLatest(): string {
        return this._outputPathLatest;
    }

    set outputPathLatest(value: string) {
        this._outputPathLatest = value;
    }

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }

    get modeOriginal(): string {
        return this._modeOriginal;
    }

    set modeOriginal(value: string) {
        this._modeOriginal = value;
    }

    get modeLatest(): string {
        return this._modeLatest;
    }

    set modeLatest(value: string) {
        this._modeLatest = value;
    }

    get modePattern(): string {
        return this._modePattern;
    }

    set modePattern(value: string) {
        this._modePattern = value;
    }

    get entryOriginal(): string {
        return this._entryOriginal;
    }

    set entryOriginal(value: string) {
        this._entryOriginal = value;
    }

    get entryPattern(): string {
        return this._entryPattern;
    }

    set entryPattern(value: string) {
        this._entryPattern = value;
    }

    get outputPathOriginal(): string {
        return this._outputPathOriginal;
    }

    set outputPathOriginal(value: string) {
        this._outputPathOriginal = value;
    }

    get outputPathPattern(): string {
        return this._outputPathPattern;
    }

    set outputPathPattern(value: string) {
        this._outputPathPattern = value;
    }

    get outputFilenameOriginal(): string {
        return this._outputFilenameOriginal;
    }

    set outputFilenameOriginal(value: string) {
        this._outputFilenameOriginal = value;
    }

    get outputFilenamePattern(): string {
        return this._outputFilenamePattern;
    }

    set outputFilenamePattern(value: string) {
        this._outputFilenamePattern = value;
    }

    get outputPluginsPattern(): string {
        return this._outputPluginsPattern;
    }

    set outputPluginsPattern(value: string) {
        this._outputPluginsPattern = value;
    }

    get outputPluginsOriginal(): string {
        return this._outputPluginsOriginal;
    }

    set outputPluginsOriginal(value: string) {
        this._outputPluginsOriginal = value;
    }

    get outputPluginsLatest(): string {
        return this._outputPluginsLatest;
    }

    set outputPluginsLatest(value: string) {
        this._outputPluginsLatest = value;
    }
}