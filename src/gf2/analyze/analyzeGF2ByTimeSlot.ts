import * as fs from "fs";
import { Eniviroment } from "../../Enviroment";
import { TimeSlotCategory } from "../../analyze/TimeSlotCategory";
import { AnalyzeTimeSlotDto } from "../../analyze/dto/AnalyzeTimeSlot";
import { ReportSection } from "../../analyze/analyzeByTimeSlot";
import { Log } from "../../util/log";
import { GF2TimeSlotDto } from "../timeSlot/dto/GF2TimeSlotDto";

const TOP_SLOT_COUNT = 10;

export function analyzeGF2ByTimeSlot(
	timeSlotDto: GF2TimeSlotDto,
): ReportSection[] {
	const categories = [
		new TimeSlotCategory("[GF2] 캐릭터1 추천 시간대", timeSlotDto.character1),
		new TimeSlotCategory(
			"[GF2] 캐릭터1 + 무기1 추천 시간대",
			timeSlotDto.character1Weapon1,
		),
		new TimeSlotCategory(
			"[GF2] 캐릭터2 + 무기1 추천 시간대",
			timeSlotDto.character2Weapon1,
		),
		new TimeSlotCategory(
			"[GF2] 캐릭터4 + 무기1 추천 시간대",
			timeSlotDto.character4Weapon1,
		),
		new TimeSlotCategory("[GF2] 캐릭터4 추천 시간대", timeSlotDto.character4),
		new TimeSlotCategory(
			"[GF2] 캐릭터6 + 무기1 추천 시간대",
			timeSlotDto.character6Weapon1,
		),
	];

	const analyzed = categories.map((category) => ({
		title: category.title,
		list: category.analyze(),
	}));

	for (const { title, list } of analyzed) {
		showLog(title, list);
	}

	fs.writeFileSync(
		Eniviroment.GF2_ANALYZE_PATH,
		analyzed.map(({ title, list }) => formatTable(title, list)).join("\n"),
		"utf-8",
	);

	return analyzed.map(({ title, list }) => ({
		title,
		data: list.slice(0, TOP_SLOT_COUNT).map((d) => d.analyzeTimeFormat),
	}));
}

function showLog(title: string, analyzeTimeSlots: AnalyzeTimeSlotDto[]): void {
	Log.log("\n" + title);
	Log.table(
		analyzeTimeSlots
			.slice(0, TOP_SLOT_COUNT)
			.map((slotDto) => slotDto.analyzeTimeFormat),
	);
}

function formatTable(title: string, slotDtos: AnalyzeTimeSlotDto[]): string {
	const header = `\n=== ${title} ===\n`;
	const body = slotDtos
		.slice(0, TOP_SLOT_COUNT)
		.map((v) => v.analyzeTimeFormat)
		.map((r) =>
			[
				r.시간대,
				`점수:${r.점수}`,
				`평균 뽑기:${r["픽업 평균 뽑기"]}`,
				`승률:${r["반천장 승률"]}`,
				`시뮬 횟수:${r["시뮬레이션 횟수"]}`,
			].join(" | "),
		)
		.join("\n");

	return header + body + "\n";
}
