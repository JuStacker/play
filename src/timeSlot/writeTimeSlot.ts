import { Eniviroment } from "../Enviroment";
import { TimeSlotFormat } from "./format/TimeSlotFormate";
import fs from "fs";

export function writeTimeSlot(timeSlotFormat: TimeSlotFormat): void {
    fs.writeFileSync(Eniviroment.TIME_SLOT_PATH, JSON.stringify(timeSlotFormat));
}