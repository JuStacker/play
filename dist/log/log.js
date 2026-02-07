"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    // static isDebug: boolean = false;
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
Log.isDebug = true;
