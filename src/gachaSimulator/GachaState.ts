import { GachaResultType } from "./GachaResultType";
import { RollResult } from "./RollResult";

export class GachaState {
  pullsSince: number;
  pullsSinceLastS: number;
  pullsSinceLastA: number;
  pullsSinceLosePickup: boolean;

  constructor() {
    this.pullsSince = 0;
    this.pullsSinceLastS = 0;
    this.pullsSinceLastA = 0;
    this.pullsSinceLosePickup = false;
  }

    isAGuaranteed(): boolean {
        return this.pullsSinceLastA >= 9;
    }

    hasPickupGuard(): boolean {
        return this.pullsSinceLosePickup;
    }

    pullCount(result: RollResult): void {
        if(result.result === GachaResultType.A) {
            this.pullsSinceLastA = 0;
            this.pullsSinceLastS += 1;
        }
        if(result.result === GachaResultType.S_Win) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = false;
        }
        if(result.result === GachaResultType.S_Lose) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = true;
        }
        if(result.result === GachaResultType.B) {
            this.pullsSinceLastS += 1;
            this.pullsSinceLastA += 1;
        }
        this.pullsSince += 1;
    }
}