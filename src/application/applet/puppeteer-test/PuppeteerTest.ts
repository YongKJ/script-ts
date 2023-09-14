import {GenUtil} from "../../util/GenUtil";

export class PuppeteerTest {

    private readonly chromePath: string;

    private constructor() {
        let value = GenUtil.getValue("chromePath");
        this.chromePath = GenUtil.anyToStr(value);
    }

    private apply(): void {

    }

    public static run(): void {
        new PuppeteerTest().apply();
    }

}