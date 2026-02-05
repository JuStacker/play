"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GachaTable = void 0;
const log_1 = require("../log/log");
const RollResult_1 = require("./RollResult");
class GachaTable {
    constructor(sRate, aRate, bRate, winRate) {
        this.sRate = sRate;
        this.aRate = aRate;
        this.bRate = bRate;
        this.winRate = winRate;
    }
    check() {
        if (this.sRate + this.aRate + this.bRate !== 1) {
            throw new Error("확률 합이 100이 아님" + JSON.stringify({ cause: { sRate: this.sRate, aRate: this.aRate, bRate: this.bRate } }));
        }
    }
    roll(state) {
        const r = Math.random();
        const sRate = this.sRate;
        const aRate = sRate + this.aRate;
        let result = RollResult_1.RollResult.ofB();
        log_1.Log.log(`랜덤값: ${this.toPercent(r)}, 롤 확률: { S: ${this.toPercent(sRate)}, A: ${this.toPercent(this.aRate)}, B: ${this.toPercent(this.bRate)} }`);
        if (r < sRate) {
            if (state.hasPickupGuard())
                return RollResult_1.RollResult.ofSWin();
            const pickupRandom = Math.random();
            // 픽뚧
            if (pickupRandom > this.winRate) {
                result = RollResult_1.RollResult.ofLoseS();
            }
            else {
                result = RollResult_1.RollResult.ofSWin();
            }
        }
        else if (r < aRate) {
            result = RollResult_1.RollResult.OfA();
        }
        state.pullCount(result);
        return result;
    }
    toPercent(value) {
        return (value * 100).toFixed(2) + "%";
    }
}
exports.GachaTable = GachaTable;
