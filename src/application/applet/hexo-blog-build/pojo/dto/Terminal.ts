
export class Terminal {

    private _id: string;
    private _num: number;

    public constructor(id?: string, num?: number) {
        this._id = id || "";
        this._num = num || 0;
    }

    public static of(id: string, num: number): Terminal {
        return new Terminal(id, num);
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get num(): number {
        return this._num;
    }

    set num(value: number) {
        this._num = value;
    }
}