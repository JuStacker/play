import { GachaResultType } from "../../gachaSimulator/GachaResultType";
import { RollResult } from "../../gachaSimulator/RollResult";

const PULLS_FOR_A_GUARANTEE = 9;

export class GF2GachaState {
	pullsSince: number;
	pullsSinceLastS: number;
	pullsSinceLastAOrBetter: number;
	pullsSinceLosePickup: boolean;

	constructor() {
		this.pullsSince = 0;
		this.pullsSinceLastS = 0;
		this.pullsSinceLastAOrBetter = 0;
		this.pullsSinceLosePickup = false;
	}

	mustForceAOrBetter(): boolean {
		return this.pullsSinceLastAOrBetter >= PULLS_FOR_A_GUARANTEE;
	}

	hasPickupGuard(): boolean {
		return this.pullsSinceLosePickup;
	}

	pullCount(result: RollResult): void {
		if (result.result === GachaResultType.A) {
			this.pullsSinceLastAOrBetter = 0;
			this.pullsSinceLastS += 1;
		}
		if (result.result === GachaResultType.S_Win) {
			this.pullsSinceLastS = 0;
			this.pullsSinceLastAOrBetter = 0;
			this.pullsSinceLosePickup = false;
		}
		if (result.result === GachaResultType.S_Lose) {
			this.pullsSinceLastS = 0;
			this.pullsSinceLastAOrBetter = 0;
			this.pullsSinceLosePickup = true;
		}
		if (result.result === GachaResultType.B) {
			this.pullsSinceLastS += 1;
			this.pullsSinceLastAOrBetter += 1;
		}
		this.pullsSince += 1;
	}
}
