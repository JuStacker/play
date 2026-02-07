import { Eniviroment } from "../Enviroment";
import { TimeSlotFormate } from "./dto/TimeSlotFormate";
import * as fs from "fs";

export function readTimeSlot(): TimeSlotFormate {
    return JSON.parse(fs.readFileSync(Eniviroment.TIME_SLOT_PATH, 'utf-8'));
}