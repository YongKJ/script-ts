import {Demo} from "./applet/demo/Demo";
import {BuildScriptService} from "./deploy/service/BuildScriptService";
import {WhalesWebBuild} from "./applet/whales-web-build/WhalesWebBuild";
import {HexoBlogBuild} from "./applet/hexo-blog-build/HexoBlogBuild";
import {ExceljsTest} from "./applet/exceljs-test/ExceljsTest";
import {PuppeteerTest} from "./applet/puppeteer-test/PuppeteerTest";
import {BatchTodo} from "./applet/batch-todo/BatchTodo";
// import {EncodeAndDecode} from "./applet/encode-and-decode/EncodeAndDecode";
import {SendSslCertificate} from "./applet/send-ssl-certificate/SendSslCertificate";
import {EncodeAndDecode} from "./applet/encode-and-decode/EncodeAndDecode";
import {NginxHttpConfigReplace} from "./applet/nginx-http-config-replace/NginxHttpConfigReplace";

export class ApplicationTest {

    public constructor() {
    }

    public test(): void {
        // BatchTodo.run();
        // PuppeteerTest.run();
        // ExceljsTest.run();
        // BuildScriptService.run();
        // HexoBlogBuild.run();
        // WhalesWebBuild.run();
        Demo.run();
        // EncodeAndDecode.run();
        // SendSslCertificate.run();
        // NginxHttpConfigReplace.run();
    }

}