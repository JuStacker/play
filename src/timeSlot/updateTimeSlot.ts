import { SimulateResult } from "../dto/SimulateResult";
import { readTimeSlot } from "./readTimeSlot";
import { writeTimeSlot } from "./writeTimeSlot";

export function updateTimeSlot(date: Date, simulateResult: SimulateResult) {
    const timeSlotDto = readTimeSlot();

    timeSlotDto.addSimulate(date, simulateResult);

    writeTimeSlot(timeSlotDto.timeSlotFormate);
}
