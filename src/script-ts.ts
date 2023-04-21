import {Application} from "./application/Application";
import {ApplicationTest} from "./application/ApplicationTest";


class ScriptTs {

    public static run(): void {
        const appTest = new ApplicationTest();
        appTest.test();

        // const app = new Application();
        // app.run();
    }

}

ScriptTs.run();