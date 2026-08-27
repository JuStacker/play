import { toTimeSlot } from "../../../util/toTimeSlot";
import { GF2SimulateResult } from "../../dto/GF2SimulateResult";

export class GF2SimulateLogDto {
	date: Date;
	result: GF2SimulateResult;

	constructor(date: Date, result: GF2SimulateResult) {
		this.date = date;
		this.result = result;
	}

	get timeRange(): string {
		return toTimeSlot(this.date.toISOString());
	}
}
