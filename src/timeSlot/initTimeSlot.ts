import { SimulateLogDto } from "../simulateLog/dto/SimulateLog";
import { readSimulateLog } from "../simulateLog/readSimulateLogDto";
import { TimeSlotDto } from "./dto/TimeSlotDto";
import { writeTimeSlot } from "./writeTimeSlot";

export function initTimeSlot() {
    const simuldateLogs: SimulateLogDto[] = readSimulateLog();
    const timeSlotDto: TimeSlotDto = TimeSlotDto.ofSimulateLogDtos(simuldateLogs);


    writeTimeSlot(timeSlotDto.timeSlotFormate);
}