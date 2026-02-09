import { Eniviroment } from "../Enviroment";
import { SimulateLogDto } from "../simulateLog/dto/SimulateLog";
import { readSimulateLog } from "../simulateLog/readSimulateLogDto";
import { TimeSlotDto } from "./dto/TimeSlotDto";
import { writeTimeSlot } from "./writeTimeSlot";

export function initTimeSlot() {
    const simuldateLogs: SimulateLogDto[] = readSimulateLog(Eniviroment.GACHA_LOG_V2_PATH).concat(readSimulateLog(Eniviroment.LOCAL_GACHA_LOG_V2_PATH));
    const timeSlotDto: TimeSlotDto = TimeSlotDto.ofSimulateLogDtos(simuldateLogs);
    
    writeTimeSlot(timeSlotDto.timeSlotFormate);
}