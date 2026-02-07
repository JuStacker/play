"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GachaResult = void 0;
const GachaResultType_1 = require("./GachaResultType");
class GachaResult {
    constructor() {
        this.logs = [];
    }
    addRollResult(result) {
        this.logs.push(result.result);
    }
    toLog() {
        let pickupPityCount = 0;
        let sPityCounts = [];
        let aPityCounts = [];
        let bCount = 0;
        for (let i = 0; i < this.logs.length; i++) {
            const resultType = this.logs[i];
            switch (resultType) {
                case GachaResultType_1.GachaResultType.S_Win:
                    sPityCounts.push(i);
                    pickupPityCount = i;
                    break;
                case GachaResultType_1.GachaResultType.S_Lose:
                    sPityCounts.push(i);
                    break;
                case GachaResultType_1.GachaResultType.A:
                    aPityCounts.push(i);
                    break;
                case GachaResultType_1.GachaResultType.B:
                    bCount++;
                    break;
            }
        }
        return {
            pickupPityCount,
            isWin: sPityCounts.length === 1,
            sPityCounts,
            aPityCounts,
            bCount,
            aCount: aPityCounts.length,
            totalSignal: this.logs.length
        };
    }
    hasWinS() {
        return this.logs.includes(GachaResultType_1.GachaResultType.S_Win);
    }
    getLattResult() {
        return this.logs[this.logs.length - 1];
    }
}
exports.GachaResult = GachaResult;
