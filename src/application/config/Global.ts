
export class Global {

    private constructor() {
    }

    private static readonly _LOG_ENABLE = true;

    static get LOG_ENABLE(): boolean {
        return this._LOG_ENABLE;
    }
}