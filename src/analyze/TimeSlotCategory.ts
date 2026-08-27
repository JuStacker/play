import { SlotDto } from "../timeSlot/dto/SlotDto";
import { inverseRelativeScore } from "../util/inverseRelativeScore";
import { relativeScore } from "../util/relativeScore";
import { AnalyzeTimeSlotDto } from "./dto/AnalyzeTimeSlot";
import { TotalAnalyze } from "./dto/TotalAnalyze";

export class TimeSlotCategory {
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
