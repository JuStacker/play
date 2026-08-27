import { GF2SimulateResult } from "../dto/GF2SimulateResult";
import { GF2TimeSlotDto } from "./dto/GF2TimeSlotDto";
import { readGF2TimeSlot } from "./readGF2TimeSlot";
import { writeGF2TimeSlot } from "./writeGF2TimeSlot";

export function updateGF2TimeSlot(
	date: Date,
	simulateResult: GF2SimulateResult,
): GF2TimeSlotDto {
	const timeSlotDto = readGF2TimeSlot();

	timeSlotDto.addSimulate(date, simulateResult);

	writeGF2TimeSlot(timeSlotDto.timeSlotFormate);

	return timeSlotDto;
}
