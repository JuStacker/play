"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GachaState = void 0;
const GachaResultType_1 = require("./GachaResultType");
class GachaState {
    constructor() {
        this.pullsSince = 0;
        this.pullsSinceLastS = 0;
        this.pullsSinceLastA = 0;
        this.pullsSinceLosePickup = false;
    }
    isAGuaranteed() {
        return this.pullsSinceLastA >= 9;
    }
    hasPickupGuard() {
        return this.pullsSinceLosePickup;
    }
    pullCount(result) {
        if (result.result === GachaResultType_1.GachaResultType.A) {
            this.pullsSinceLastA = 0;
            this.pullsSinceLastS += 1;
        }
        if (result.result === GachaResultType_1.GachaResultType.S_Win) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = false;
        }
        if (result.result === GachaResultType_1.GachaResultType.S_Lose) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = true;
        }
        if (result.result === GachaResultType_1.GachaResultType.B) {
            this.pullsSinceLastS += 1;
            this.pullsSinceLastA += 1;
        }
        this.pullsSince += 1;
    }
}
exports.GachaState = GachaState;
