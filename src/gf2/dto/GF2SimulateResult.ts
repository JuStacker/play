import { SimulateGachaResult } from "../../simulateLog/dto/SimulateGachaResult";

export class GF2SimulateResult {
	character1: SimulateGachaResult;
	weapon1: SimulateGachaResult;
	character2: SimulateGachaResult;
	weapon2: SimulateGachaResult;
	character4: SimulateGachaResult;
	weapon4: SimulateGachaResult;
	character6: SimulateGachaResult;
	weapon6: SimulateGachaResult;

	constructor(
		character1: SimulateGachaResult,
		weapon1: SimulateGachaResult,
		character2: SimulateGachaResult,
		weapon2: SimulateGachaResult,
		character4: SimulateGachaResult,
		weapon4: SimulateGachaResult,
		character6: SimulateGachaResult,
		weapon6: SimulateGachaResult,
	) {
		this.character1 = character1;
		this.weapon1 = weapon1;
		this.character2 = character2;
		this.weapon2 = weapon2;
		this.character4 = character4;
		this.weapon4 = weapon4;
		this.character6 = character6;
		this.weapon6 = weapon6;
	}

	static of({
		character1,
		weapon1,
		character2,
		weapon2,
		character4,
		weapon4,
		character6,
		weapon6,
	}: {
		character1: SimulateGachaResult;
		weapon1: SimulateGachaResult;
		character2: SimulateGachaResult;
		weapon2: SimulateGachaResult;
		character4: SimulateGachaResult;
		weapon4: SimulateGachaResult;
		character6: SimulateGachaResult;
		weapon6: SimulateGachaResult;
	}): GF2SimulateResult {
		return new GF2SimulateResult(
			character1,
			weapon1,
			character2,
			weapon2,
			character4,
			weapon4,
			character6,
			weapon6,
		);
	}
}
