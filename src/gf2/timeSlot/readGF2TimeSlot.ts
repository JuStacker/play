import * as fs from "fs";
import { Eniviroment } from "../../Enviroment";
import { GF2TimeSlotDto } from "./dto/GF2TimeSlotDto";

export function readGF2TimeSlot(): GF2TimeSlotDto {
	const format = JSON.parse(
		fs.readFileSync(Eniviroment.GF2_TIME_SLOT_PATH, "utf-8"),
	);
	return GF2TimeSlotDto.of(format);
}
