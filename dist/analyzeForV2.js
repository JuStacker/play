"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzeByTimeSlot_1 = require("./analyze/analyzeByTimeSlot");
const readTimeSlot_1 = require("./timeSlot/readTimeSlot");
analyzeForV2();
function analyzeForV2() {
    const slotDto = (0, readTimeSlot_1.readTimeSlot)();
    (0, analyzeByTimeSlot_1.analyzeByTimeSlot)(slotDto);
}
