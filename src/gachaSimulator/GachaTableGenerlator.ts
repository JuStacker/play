import { table } from "console";
import * as fs from "fs";
import { GachaState } from "./GachaState";
import { GachaTable } from "./GachaTable";
import { GachaResult } from "./GachaResult";

export class GachaTableGenerlator {
    // sofPityStart = 74;
    // hardPity = 90;
    // baseSRate = 0.006; // 0.6%
    // baseARate = 0.072; // 7.2%
    // stepIncereaseRate = 0.06; // 6%

    sofPityStart: number;
    hardPity: number;
    baseSRate: number; 
    baseARate: number;
    stepIncereaseRate: number;
    winRate: number;

    private constructor(sofPityStart: number, hardPity: number, baseSRate: number, baseARate: number, stepIncereaseRate: number, winRate: number) {
        this.sofPityStart = sofPityStart;
        this.hardPity = hardPity; 
        this.baseSRate = baseSRate;
        this.baseARate = baseARate;
        this.stepIncereaseRate = stepIncereaseRate;
        this.winRate = winRate;
    }

    static ofZZZCharacter() {
        return new GachaTableGenerlator(74, 90, 0.006, 0.072, 0.06, 0.5);
    }
    static ofZZZWeapon() {
        return new GachaTableGenerlator(65, 80, 0.007, 0.094, 0.06, 0.75);
    }


    createTable(state: GachaState): GachaTable {
         const sRate = this.getSRate(state.pullsSinceLastS);

        // A 보장 상태 → B 제거
        if (state.isAGuaranteed()) {
            const result = new GachaTable(sRate, 1 - sRate, 0, this.winRate)
            result.check();
            return result;
        }

        // 일반 테이블
        let aRate = this.baseARate;
        let bRate = 1 - sRate - aRate;

        // S 확률이 커져서 넘치면 A부터 감소
        if (bRate < 0) {
            aRate += bRate; // bRate는 음수 → A 감소
            bRate = 0;
        }

        const result = new GachaTable(sRate, aRate, bRate, this.winRate);
        result.check();
        return result;
    }

    // ---- S 확률 계산 (소프트 천장) ----
    private getSRate(pullsSinceLastS: number): number {
        const pullSince = pullsSinceLastS + 1;

        if (pullSince < this.sofPityStart) {
            return this.baseSRate;
        }

        if (pullSince >= this.hardPity) {
            return 1.0;
        }

        // 75 ~ 90 구간
        const progress = pullSince - this.sofPityStart + 1;
        // 0 → 1 사이 값

        return this.baseSRate + (progress * this.stepIncereaseRate);
    }

}

