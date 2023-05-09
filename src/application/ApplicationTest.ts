import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";

export class ApplicationTest {

    public constructor() {
    }

    public test1(): void {
        // BuildScriptService.run();
    }

    public test(): void {
        // Demo.run();
        WhalesWebBuild.run();
    }

}