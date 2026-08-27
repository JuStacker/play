import fs from "fs";
import { Eniviroment } from "../../Enviroment";
import { GF2TimeSlotFormat } from "./format/GF2TimeSlotFormat";

export function writeGF2TimeSlot(format: GF2TimeSlotFormat): void {
	fs.writeFileSync(Eniviroment.GF2_TIME_SLOT_PATH, JSON.stringify(format));
}
