"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTimeSlot = initTimeSlot;
const Enviroment_1 = require("../Enviroment");
const readSimulateLogDto_1 = require("../simulateLog/readSimulateLogDto");
const TimeSlotDto_1 = require("./dto/TimeSlotDto");
const writeTimeSlot_1 = require("./writeTimeSlot");
function initTimeSlot() {
    const simuldateLogs = (0, readSimulateLogDto_1.readSimulateLog)(Enviroment_1.Eniviroment.GACHA_LOG_V2_PATH).concat((0, readSimulateLogDto_1.readSimulateLog)(Enviroment_1.Eniviroment.LOCAL_GACHA_LOG_V2_PATH));
    const timeSlotDto = TimeSlotDto_1.TimeSlotDto.ofSimulateLogDtos(simuldateLogs);
    (0, writeTimeSlot_1.writeTimeSlot)(timeSlotDto.timeSlotFormate);
}
