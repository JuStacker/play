import { SimulateGachaResult } from "../simulateLog/dto/SimulateGachaResult";
import { GachaResultType } from "./GachaResultType";
import { RollResult } from "./RollResult";

export class GachaResult {
    logs: GachaResultType[];

    constructor() {
        this.logs = [];
    }

    addRollResult(result: RollResult): void {
        this.logs.push(result.result);
    }

    toLog(): SimulateGachaResult {
        let pickupPityCount = 0;
        let sPityCounts = [];
        let aPityCounts = [];
        let bCount = 0;

        for(let i = 0; i < this.logs.length; i++) {
            const resultType = this.logs[i];
            switch(resultType) {
                case GachaResultType.S_Win:
                    sPityCounts.push(i);
                    pickupPityCount = i;
                    break;
                case GachaResultType.S_Lose:
                    sPityCounts.push(i);
                    break;
                case GachaResultType.A:
                    aPityCounts.push(i);
                    break;
                case GachaResultType.B:
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

    hasWinS(): boolean {
        return this.logs.includes(GachaResultType.S_Win);
    }

    getLattResult(): GachaResultType {
        return this.logs[this.logs.length - 1];
    }
}