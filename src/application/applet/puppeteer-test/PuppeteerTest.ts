import {GenUtil} from "../../util/GenUtil";
import puppeteer from "puppeteer-core";

export class PuppeteerTest {

    private readonly chromePath: string;

    private constructor() {
        let value = GenUtil.getValue("chromePath");
        this.chromePath = GenUtil.anyToStr(value);
    }

    private async apply(): Promise<void> {
        const browser = await puppeteer.launch({
            executablePath: this.chromePath,
            headless: false,
            timeout: 15000,
            args: [
                '--no-sandbox',
                '--start-maximized'
            ],
        });


        // const page = await browser.newPage();
        const page = (await browser.pages())[0];
        await page.setViewport({
            width: 1920,
            height: 1280,
            deviceScaleFactor: 1,
        });
        await page.goto('https://baidu.com');

        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                deviceScaleFactor: window.devicePixelRatio
            };
        });
        await page.screenshot({
            path: 'C:\\Users\\Admin\\Desktop\\png\\baidu.png',
            clip: {
                x: 0,
                y: 0,
                width: dimensions.width,
                height: dimensions.height
            }
        });

        await GenUtil.sleep(10000);
        await browser.close();
    }

    public static run(): void {
        new PuppeteerTest().apply().then();
    }

}