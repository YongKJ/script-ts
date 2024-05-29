export class Statistics {

    private _id: number | null;
    private _workerId: number;
    private _videoTimestamp: number;
    private _position: number;
    private _perspective: number;
    private _xData: number;
    private _yData: Record<string, any>;
    private _ext: Record<string, any>;

    public constructor(id?: number | null, workerId?: number, videoTimestamp?: number, position?: number, perspective?: number, xData?: number, yData?: Record<string, any>, ext?: Record<string, any>) {
        this._id = id || 0;
        this._workerId = workerId || 0;
        this._videoTimestamp = videoTimestamp || 0;
        this._position = position || 0;
        this._perspective = perspective || 0;
        this._xData = xData || 0;
        this._yData = yData || {};
        this._ext = ext || {};
    }

    public static of(id: number | null, workerId: number, videoTimestamp: number, position: number, perspective: number, xData: number, yData: Record<string, any>, ext: Record<string, any>): Statistics {
        return new Statistics(id, workerId, videoTimestamp, position, perspective, xData, yData, ext);
    }

    get id(): number | null {
        return this._id;
    }

    set id(value: number | null) {
        this._id = value;
    }

    get workerId(): number {
        return this._workerId;
    }

    set workerId(value: number) {
        this._workerId = value;
    }

    get videoTimestamp(): number {
        return this._videoTimestamp;
    }

    set videoTimestamp(value: number) {
        this._videoTimestamp = value;
    }

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get perspective(): number {
        return this._perspective;
    }

    set perspective(value: number) {
        this._perspective = value;
    }

    get xData(): number {
        return this._xData;
    }

    set xData(value: number) {
        this._xData = value;
    }

    get yData(): Record<string, any> {
        return this._yData;
    }

    set yData(value: Record<string, any>) {
        this._yData = value;
    }

    get ext(): Record<string, any> {
        return this._ext;
    }

    set ext(value: Record<string, any>) {
        this._ext = value;
    }
}