import { SimulateResult } from "../dto/SimulateResult";
import { TimeSlotDto } from "./dto/TimeSlotDto";
import { readTimeSlot } from "./readTimeSlot";
import { writeTimeSlot } from "./writeTimeSlot";

export function updateTimeSlot(date: Date, simulateResult: SimulateResult): TimeSlotDto {
    const timeSlotDto = readTimeSlot();

    timeSlotDto.addSimulate(date, simulateResult);

    writeTimeSlot(timeSlotDto.timeSlotFormate);

    return timeSlotDto;
}
