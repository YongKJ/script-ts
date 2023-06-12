import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";
import {HexoBlogBuild} from "./applet/hexo-blog-build/HexoBlogBuild";

export class ApplicationTest {

    public constructor() {
    }

    public test1(): void {
        // BuildScriptService.run();
    }

    public test(): void {
    // HexoBlogBuild.run();
        // WhalesWebBuild.run();
        Demo.run();
    }

}