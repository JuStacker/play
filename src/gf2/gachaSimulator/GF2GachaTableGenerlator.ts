import { GF2GachaState } from "./GF2GachaState";
import { GF2GachaTable } from "./GF2GachaTable";

export class GF2GachaTableGenerlator {
	softPityStart: number;
	hardPity: number;
	baseSRate: number;
	baseARate: number;
	stepIncreaseRate: number;
	pickupWinRate: number;

	private constructor(
		softPityStart: number,
		hardPity: number,
		baseSRate: number,
		baseARate: number,
		stepIncreaseRate: number,
		pickupWinRate: number,
	) {
		this.softPityStart = softPityStart;
		this.hardPity = hardPity;
		this.baseSRate = baseSRate;
		this.baseARate = baseARate;
		this.stepIncreaseRate = stepIncreaseRate;
		this.pickupWinRate = pickupWinRate;
	}

	// 지정 발주 (캐릭터): S 0.6%, A 6%(표준인형3+표준무기3), 58회부터 소프트천장, 80회 하드천장, 픽업 50%
	static ofCharacter(): GF2GachaTableGenerlator {
		return new GF2GachaTableGenerlator(58, 80, 0.006, 0.06, 0.045, 0.5);
	}

	// 군비 강화 (무기): S 0.7%, A 7%, 50회부터 소프트천장, 70회 하드천장, 픽업 75%
	static ofWeapon(): GF2GachaTableGenerlator {
		return new GF2GachaTableGenerlator(50, 70, 0.007, 0.07, 0.05, 0.75);
	}

	createTable(state: GF2GachaState): GF2GachaTable {
		const sRate = this.getSRate(state.pullsSinceLastS);

		let aRate = this.baseARate;
		let bRate = 1 - sRate - aRate;

		// S 확률이 커져서 넘치면 A부터 감소
		if (bRate < 0) {
			aRate += bRate;
			bRate = 0;
		}

		const result = new GF2GachaTable(sRate, aRate, bRate, this.pickupWinRate);
		result.check();
		return result;
	}

	// ---- S 확률 계산 (소프트 천장) ----
	private getSRate(pullsSinceLastS: number): number {
		const pullSince = pullsSinceLastS + 1;

		if (pullSince < this.softPityStart) {
			return this.baseSRate;
		}

		if (pullSince >= this.hardPity) {
			return 1.0;
		}

		const progress = pullSince - this.softPityStart + 1;

		return this.baseSRate + progress * this.stepIncreaseRate;
	}
}
