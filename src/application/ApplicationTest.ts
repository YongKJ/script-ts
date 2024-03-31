import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";
import {HexoBlogBuild} from "./applet/hexo-blog-build/HexoBlogBuild";
import {ExceljsTest} from "./applet/exceljs-test/ExceljsTest";
import {PuppeteerTest} from "./applet/puppeteer-test/PuppeteerTest";
import {SendSslCertificate} from "./applet/send-ssl-certificate/SendSslCertificate";

export class ApplicationTest {

    public constructor() {
    }

    public test(): void {
        // PuppeteerTest.run();
        // ExceljsTest.run();
        // BuildScriptService.run();
        // HexoBlogBuild.run();
        // WhalesWebBuild.run();
        // Demo.run();
        SendSslCertificate.run();
    }

}