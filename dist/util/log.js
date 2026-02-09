"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const Enviroment_1 = require("../Enviroment");
class Log {
    static log(...message) {
        if (!this.isDebug)
            return;
        console.log(...message);
    }
    static table(obj) {
        if (!this.isDebug)
            return;
        console.table(obj);
    }
}
exports.Log = Log;
// static isDebug: boolean = true;
Log.isDebug = Enviroment_1.Eniviroment.LOG_LEVEL === "DEBUG" ? true : false;
