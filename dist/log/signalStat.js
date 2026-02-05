"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalStat = void 0;
class SignalStat {
    constructor(date, data) {
        this.date = date;
        this.sCount = data.sCount;
        this.sWinCount = data.sWinCount;
        this.sFalseCount = data.sFalseCount;
        this.aCount = data.aCount;
        this.aWinCOunt = data.aWinCOunt;
        this.aFalseCount = data.aFalseCount;
        this.sSignals = data.sSignals;
        this.aSignals = data.aSignals;
    }
    get sWinRate() {
        return this.sCount > 0 ? this.sWinCount / this.sCount : 0;
    }
    get aWinRate() {
        return this.aCount > 0 ? this.aWinCOunt / this.aCount : 0;
    }
}
exports.SignalStat = SignalStat;
