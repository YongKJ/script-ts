import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";
import {HexoBlogBuild} from "./applet/hexo-blog-build/HexoBlogBuild";
import {ExceljsTest} from "./applet/exceljs-test/ExceljsTest";

export class ApplicationTest {

    public constructor() {
    }

    public test(): void {
        // ExceljsTest.run();
        // BuildScriptService.run();
        // HexoBlogBuild.run();
        // WhalesWebBuild.run();
        Demo.run();
    }

}