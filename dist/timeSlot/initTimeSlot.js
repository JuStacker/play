"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTimeSlot = initTimeSlot;
const readSimulateLogDto_1 = require("../simulateLog/readSimulateLogDto");
const TimeSlotDto_1 = require("./dto/TimeSlotDto");
const writeTimeSlot_1 = require("./writeTimeSlot");
function initTimeSlot() {
    const simuldateLogs = (0, readSimulateLogDto_1.readSimulateLog)();
    const timeSlotDto = TimeSlotDto_1.TimeSlotDto.ofSimulateLogDtos(simuldateLogs);
    (0, writeTimeSlot_1.writeTimeSlot)(timeSlotDto.timeSlotFormate);
}
