import { Eniviroment } from "../Enviroment";
import { TimeSlotFormate } from "./dto/TimeSlotFormate";
import fs from "fs";

export function writeTimeSlot(timeSlotFormat: TimeSlotFormate): void {
    fs.writeFileSync(Eniviroment.TIME_SLOT_PATH, JSON.stringify(timeSlotFormat));
}