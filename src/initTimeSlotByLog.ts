import { initGF2TimeSlot } from "./gf2/timeSlot/initGF2TimeSlot";
import { initTimeSlot } from "./timeSlot/initTimeSlot";

initTimeSlotByLog();

function initTimeSlotByLog() {
	initTimeSlot();
	initGF2TimeSlot();
}
