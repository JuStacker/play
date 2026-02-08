import { SimulateResult } from "../../dto/SimulateResult"
import { toTimeSlot } from "../../util/toTimeSlot";

export class SimulateLogDto {
    date: Date;
    result: SimulateResult;
    

    constructor(date: Date, result: SimulateResult) {
        this.date = date;
        this.result = result;
    }

    get timeRange(): string {
        return toTimeSlot(this.date.toISOString());
    }
}