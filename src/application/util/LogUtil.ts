import {Global} from "../config/Global";
import {Log} from "../pojo/dto/Log";

export class LogUtil {

    private constructor() {
    }

    public static loggerLine(log: Log): void {
        if (Global.LOG_ENABLE) {
            console.log("[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": ", log.value);
        }
    }

    public static logger(log: Log): void {
        if (Global.LOG_ENABLE) {
            process.stdout.write("[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": " + log.value);
        }
    }

}