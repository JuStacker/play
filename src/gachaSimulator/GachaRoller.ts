import { Log } from "../util/log";
import { toPercent } from "../util/toPercent";
import { GachaState } from "./GachaState";
import { GachaTableGenerlator } from "./GachaTableGenerlator";
import { RollResult } from "./RollResult";

export class GachaRoller {
	private readonly tableGenerlator: GachaTableGenerlator;

	constructor(tableGenerlator: GachaTableGenerlator) {
		this.tableGenerlator = tableGenerlator;
	}

	static ofCharacter(): GachaRoller {
		return new GachaRoller(GachaTableGenerlator.ofZZZCharacter());
	}

	static ofWeapon(): GachaRoller {
		return new GachaRoller(GachaTableGenerlator.ofZZZWeapon());
	}

	roll(state: GachaState): RollResult {
		const table = this.tableGenerlator.createTable(state);
		Log.log(
			`${state.pullsSince + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`,
		);
		return table.roll(state);
	}
}
