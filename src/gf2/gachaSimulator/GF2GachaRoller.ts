import { RollResult } from "../../gachaSimulator/RollResult";
import { GF2GachaState } from "./GF2GachaState";
import { GF2GachaTableGenerlator } from "./GF2GachaTableGenerlator";

export class GF2GachaRoller {
	private readonly tableGenerlator: GF2GachaTableGenerlator;

	constructor(tableGenerlator: GF2GachaTableGenerlator) {
		this.tableGenerlator = tableGenerlator;
	}

	static ofCharacter(): GF2GachaRoller {
		return new GF2GachaRoller(GF2GachaTableGenerlator.ofCharacter());
	}

	static ofWeapon(): GF2GachaRoller {
		return new GF2GachaRoller(GF2GachaTableGenerlator.ofWeapon());
	}

	roll(state: GF2GachaState): RollResult {
		const table = this.tableGenerlator.createTable(state);
		return table.roll(state);
	}
}
