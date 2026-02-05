"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollResult = void 0;
const GachaResultType_1 = require("./GachaResultType");
class RollResult {
    constructor(result) {
        this.result = result;
    }
    static ofSWin() {
        return new RollResult(GachaResultType_1.GachaResultType.S_Win);
    }
    static ofLoseS() {
        return new RollResult(GachaResultType_1.GachaResultType.S_Lose);
    }
    static OfA() {
        return new RollResult(GachaResultType_1.GachaResultType.A);
    }
    static ofB() {
        return new RollResult(GachaResultType_1.GachaResultType.B);
    }
}
exports.RollResult = RollResult;
