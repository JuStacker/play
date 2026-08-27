import { GachaResultType } from "../../gachaSimulator/GachaResultType";
import { RollResult } from "../../gachaSimulator/RollResult";
import { Log } from "../../util/log";
import { GF2GachaState } from "./GF2GachaState";

export class GF2GachaTable {
	sRate: number;
	aRate: number;
	bRate: number;
	pickupWinRate: number;

	constructor(
		sRate: number,
		aRate: number,
		bRate: number,
		pickupWinRate: number,
	) {
		this.sRate = sRate;
		this.aRate = aRate;
		this.bRate = bRate;
		this.pickupWinRate = pickupWinRate;
	}

	check() {
		if (Math.abs(this.sRate + this.aRate + this.bRate - 1) > 1e-9) {
			throw new Error(
				"확률 합이 100이 아님" +
					JSON.stringify({
						cause: { sRate: this.sRate, aRate: this.aRate, bRate: this.bRate },
					}),
			);
		}
	}

	roll(state: GF2GachaState): RollResult {
		const r = Math.random();
		const sRate = this.sRate;
		const aRate = sRate + this.aRate;

		let result = RollResult.ofB();

		if (r < sRate) {
			const pickupRandom = Math.random();
			// 픽뚫
			if (pickupRandom > this.pickupWinRate && !state.hasPickupGuard()) {
				result = RollResult.ofLoseS();
			} else {
				result = RollResult.ofSWin();
			}
		} else if (r < aRate) {
			result = RollResult.ofA();
		}

		// 10연 A 이상 확정 보장 (연속 B 9회 후 강제 승급)
		if (result.result === GachaResultType.B && state.mustForceAOrBetter()) {
			result = RollResult.ofA();
		}

		Log.log(
			`랜덤값: ${this.toPercent(r)}, 롤 확률: { S: ${this.toPercent(sRate)}, A: ${this.toPercent(this.aRate)}, B: ${this.toPercent(this.bRate)} }`,
		);

		state.pullCount(result);
		return result;
	}

	private toPercent(value: number): string {
		return (value * 100).toFixed(2) + "%";
	}
}
