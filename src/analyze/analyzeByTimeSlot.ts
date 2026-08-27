import * as fs from "fs";
import { Eniviroment } from "../Enviroment";
import { SlotDto } from "../timeSlot/dto/SlotDto";
import { TimeSlotDto } from "../timeSlot/dto/TimeSlotDto";
import { inverseRelativeScore } from "../util/inverseRelativeScore";
import { writeHtmlReport } from "../util/htmlReport";
import { Log } from "../util/log";
import { relativeScore } from "../util/relativeScore";
import { AnalyzeTimeSlotDto } from "./dto/AnalyzeTimeSlot";
import { TotalAnalyze } from "./dto/TotalAnalyze";

const REPORT_TITLE = "가챠 시간대 분석";
const TOP_SLOT_COUNT = 10;

class TimeSlotCategory {
	readonly title: string;
	private readonly slots: Map<string, SlotDto>;

	constructor(title: string, slots: Map<string, SlotDto>) {
		this.title = title;
		this.slots = slots;
	}

	analyze(): AnalyzeTimeSlotDto[] {
		const totalAnalyze = new TotalAnalyze();
		for (const slotDto of this.slots.values()) {
			totalAnalyze.updateBySlotDto(slotDto);
		}

		return [...this.slots.entries()]
			.map(([timeRange, slotDto]) =>
				AnalyzeTimeSlotDto.of(
					timeRange,
					calcScore(slotDto, totalAnalyze),
					slotDto,
				),
			)
			.sort((a, b) => b.score - a.score);
	}
}

export function analyzeByTimeSlot(timeSlotDto: TimeSlotDto): void {
	const categories = [
		new TimeSlotCategory("A캐릭터 추천 시간대", timeSlotDto.aCharacter),
		new TimeSlotCategory("AB캐릭터 추천 시간대", timeSlotDto.abCharacter),
		new TimeSlotCategory(
			"AB캐릭터 + A무기 추천 시간대",
			timeSlotDto.abCharacterAWeapon,
		),
		new TimeSlotCategory(
			"AB캐릭터 + AB무기 추천 시간대",
			timeSlotDto.abCharacterAbWeapon,
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
		Eniviroment.ANALYZE_PATH,
		analyzed.map(({ title, list }) => formatTable(title, list)).join("\n"),
		"utf-8",
	);

	writeHtmlReport(
		REPORT_TITLE,
		analyzed.map(({ title, list }) => ({
			title,
			data: list.slice(0, TOP_SLOT_COUNT).map((d) => d.analyzeTimeFormat),
		})),
	);
}

function showLog(title: string, analyzeTimeSlots: AnalyzeTimeSlotDto[]): void {
	Log.log("\n" + title);
	Log.table(
		analyzeTimeSlots
			.slice(0, TOP_SLOT_COUNT)
			.map((slotDto) => slotDto.analyzeTimeFormat),
	);
}

function calcScore(slotDto: SlotDto, totalAnalyze: TotalAnalyze): number {
	const pityScore = inverseRelativeScore(
		slotDto.avgPity,
		totalAnalyze.minAvgPity,
		totalAnalyze.maxAvgPity,
		50,
	);
	const winScore = relativeScore(
		slotDto.winRate,
		totalAnalyze.minWinRate,
		totalAnalyze.maxWinRate,
		40,
	);
	const simCountScore = relativeScore(
		slotDto.simCount,
		totalAnalyze.minSimCount,
		totalAnalyze.maxSimCount,
		10,
	);
	return pityScore + winScore + simCountScore;
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
