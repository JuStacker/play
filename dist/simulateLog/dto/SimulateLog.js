"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateLogDto = void 0;
const toTimeSlot_1 = require("../../util/toTimeSlot");
class SimulateLogDto {
    constructor(date, result) {
        this.date = date;
        this.result = result;
    }
    get timeRange() {
        return (0, toTimeSlot_1.toTimeSlot)(this.date.toISOString());
    }
}
exports.SimulateLogDto = SimulateLogDto;
