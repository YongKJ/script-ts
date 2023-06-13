import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";
import {HexoBlogBuild} from "./applet/hexo-blog-build/HexoBlogBuild";

export class ApplicationTest {

    public constructor() {
    }

    public test(): void {
        // BuildScriptService.run();
        // HexoBlogBuild.run();
        // WhalesWebBuild.run();
        Demo.run();
    }

}