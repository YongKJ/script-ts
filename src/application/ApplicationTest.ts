import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";

export class ApplicationTest {

    public constructor() {
    }

    public test1(): void {
        BuildScriptService.run();
    }

    public test(): void {
        Demo.run();
    }

}