"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTimeSlot = updateTimeSlot;
const readTimeSlot_1 = require("./readTimeSlot");
const writeTimeSlot_1 = require("./writeTimeSlot");
function updateTimeSlot(date, simulateResult) {
    const timeSlotDto = (0, readTimeSlot_1.readTimeSlot)();
    timeSlotDto.addSimulate(date, simulateResult);
    (0, writeTimeSlot_1.writeTimeSlot)(timeSlotDto.timeSlotFormate);
    return timeSlotDto;
}
