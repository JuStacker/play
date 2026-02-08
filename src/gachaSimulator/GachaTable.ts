import { stat } from "fs";
import { Log } from "../util/log";
import { GachaState } from "./GachaState";
import { RollResult } from "./RollResult";

export class GachaTable {
    sRate: number;
    aRate: number;
    bRate: number;
    winRate: number;

    constructor(sRate: number, aRate: number, bRate: number, winRate: number) {
        this.sRate = sRate;
        this.aRate = aRate;
        this.bRate = bRate;
        this.winRate = winRate;
    }

    check() {
        if(this.sRate + this.aRate + this.bRate !== 1) {
            throw new Error("확률 합이 100이 아님" + JSON.stringify({ cause: { sRate: this.sRate, aRate: this.aRate, bRate: this.bRate } }));
        }
    }

    roll(state: GachaState): RollResult {
        const r = Math.random();
        const sRate = this.sRate;
        const aRate = sRate + this.aRate;

        let result = RollResult.ofB();
        
        Log.log(`랜덤값: ${this.toPercent(r)}, 롤 확률: { S: ${this.toPercent(sRate)}, A: ${this.toPercent(this.aRate)}, B: ${this.toPercent(this.bRate)} }`);

        if (r < sRate) {
            const pickupRandom = Math.random();
            // 픽뚧
            if (pickupRandom > this.winRate && !state.hasPickupGuard()) {
                result = RollResult.ofLoseS();
            } else {
                result = RollResult.ofSWin();
            }
        } else if (r < aRate) {
            result = RollResult.ofA();
        }

        state.pullCount(result);
        return result;
    }

    private toPercent(value: number): string {
        return (value * 100).toFixed(2) + "%";
    }
}