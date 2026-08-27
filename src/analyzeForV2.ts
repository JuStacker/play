import { analyzeByTimeSlot } from "./analyze/analyzeByTimeSlot";
import { analyzeGF2ByTimeSlot } from "./gf2/analyze/analyzeGF2ByTimeSlot";
import { readGF2TimeSlot } from "./gf2/timeSlot/readGF2TimeSlot";
import { readTimeSlot } from "./timeSlot/readTimeSlot";
import { writeHtmlReport } from "./util/htmlReport";

export function analyzeForV2() {
	const zzzSections = analyzeByTimeSlot(readTimeSlot());
	const gf2Sections = analyzeGF2ByTimeSlot(readGF2TimeSlot());

	writeHtmlReport("가챠 시간대 분석", [
		{ game: "ZZZ", sections: zzzSections },
		{ game: "GF2", sections: gf2Sections },
	]);
}

if (require.main === module) {
	analyzeForV2();
}
