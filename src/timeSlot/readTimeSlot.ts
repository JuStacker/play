import { Eniviroment } from "../Enviroment";
import { TimeSlotDto } from "./dto/TimeSlotDto";
import { TimeSlotFormat } from "./format/TimeSlotFormate";
import * as fs from "fs";

export function readTimeSlot(): TimeSlotDto {
    const timeSlotFormate = JSON.parse(fs.readFileSync(Eniviroment.TIME_SLOT_PATH, 'utf-8'));
    return TimeSlotDto.of(timeSlotFormate);
}