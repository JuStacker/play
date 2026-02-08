"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTimeSlot = writeTimeSlot;
const Enviroment_1 = require("../Enviroment");
const fs_1 = __importDefault(require("fs"));
function writeTimeSlot(timeSlotFormat) {
    fs_1.default.writeFileSync(Enviroment_1.Eniviroment.TIME_SLOT_PATH, JSON.stringify(timeSlotFormat));
}
