"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    static log(...message) {
        if (!this.isDebug)
            return;
        console.log(...message);
    }
}
exports.Log = Log;
Log.isDebug = false;
