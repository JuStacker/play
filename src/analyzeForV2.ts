import { analyzeByTimeSlot } from "./analyze/analyzeByTimeSlot";
import { readTimeSlot } from "./timeSlot/readTimeSlot";

analyzeForV2();

function analyzeForV2() {
  const slotDto = readTimeSlot();
  analyzeByTimeSlot(slotDto);
}
