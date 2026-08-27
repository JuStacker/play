import { Eniviroment } from "../../Enviroment";
import { readGF2SimulateLog } from "../simulateLog/readGF2SimulateLogDto";
import { GF2TimeSlotDto } from "./dto/GF2TimeSlotDto";
import { writeGF2TimeSlot } from "./writeGF2TimeSlot";

export function initGF2TimeSlot() {
	const simulateLogs = readGF2SimulateLog(
		Eniviroment.GF2_GACHA_LOG_PATH,
	).concat(readGF2SimulateLog(Eniviroment.GF2_LOCAL_GACHA_LOG_PATH));
	const timeSlotDto = GF2TimeSlotDto.ofSimulateLogDtos(simulateLogs);

	writeGF2TimeSlot(timeSlotDto.timeSlotFormate);
}
