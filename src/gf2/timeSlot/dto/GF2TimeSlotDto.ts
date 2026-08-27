import { SlotDto } from "../../../timeSlot/dto/SlotDto";
import { SimulateGachaResult } from "../../../simulateLog/dto/SimulateGachaResult";
import { toTimeSlot } from "../../../util/toTimeSlot";
import { GF2SimulateResult } from "../../dto/GF2SimulateResult";
import { GF2SimulateLogDto } from "../../simulateLog/dto/GF2SimulateLogDto";
import { GF2TimeSlotFormat } from "../format/GF2TimeSlotFormat";

export class GF2TimeSlotDto {
	character1: Map<string, SlotDto> = new Map();
	character1Weapon1: Map<string, SlotDto> = new Map();
	character2Weapon1: Map<string, SlotDto> = new Map();
	character4Weapon1: Map<string, SlotDto> = new Map();
	character4: Map<string, SlotDto> = new Map();
	character7Weapon1: Map<string, SlotDto> = new Map();

	static of(format: GF2TimeSlotFormat): GF2TimeSlotDto {
		const result = new GF2TimeSlotDto();

		for (const [range, slotFormat] of Object.entries(format.character1)) {
			result.character1.set(range, SlotDto.of(slotFormat));
		}
		for (const [range, slotFormat] of Object.entries(
			format.character1Weapon1,
		)) {
			result.character1Weapon1.set(range, SlotDto.of(slotFormat));
		}
		for (const [range, slotFormat] of Object.entries(
			format.character2Weapon1,
		)) {
			result.character2Weapon1.set(range, SlotDto.of(slotFormat));
		}
		for (const [range, slotFormat] of Object.entries(
			format.character4Weapon1,
		)) {
			result.character4Weapon1.set(range, SlotDto.of(slotFormat));
		}
		for (const [range, slotFormat] of Object.entries(format.character4)) {
			result.character4.set(range, SlotDto.of(slotFormat));
		}
		for (const [range, slotFormat] of Object.entries(
			format.character7Weapon1,
		)) {
			result.character7Weapon1.set(range, SlotDto.of(slotFormat));
		}

		return result;
	}

	static ofSimulateLogDtos(logs: GF2SimulateLogDto[]): GF2TimeSlotDto {
		const result = new GF2TimeSlotDto();

		for (const log of logs) {
			result.addSimulate(log.date, log.result);
		}

		return result;
	}

	get timeSlotFormate(): GF2TimeSlotFormat {
		const result: GF2TimeSlotFormat = {
			character1: {},
			character1Weapon1: {},
			character2Weapon1: {},
			character4Weapon1: {},
			character4: {},
			character7Weapon1: {},
		};

		for (const [timeRange, slotDto] of this.character1.entries()) {
			result.character1[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.character1Weapon1.entries()) {
			result.character1Weapon1[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.character2Weapon1.entries()) {
			result.character2Weapon1[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.character4Weapon1.entries()) {
			result.character4Weapon1[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.character4.entries()) {
			result.character4[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.character7Weapon1.entries()) {
			result.character7Weapon1[timeRange] = slotDto.toSlotFormat();
		}

		return result;
	}

	addSimulate(date: Date, result: GF2SimulateResult): void {
		const timeRange = toTimeSlot(date.toISOString());

		GF2TimeSlotDto.add(this.character1, timeRange, result.character1);
		GF2TimeSlotDto.add(this.character1Weapon1, timeRange, result.character1);
		GF2TimeSlotDto.add(this.character1Weapon1, timeRange, result.weapon1);

		GF2TimeSlotDto.add(this.character2Weapon1, timeRange, result.character2);
		GF2TimeSlotDto.add(this.character2Weapon1, timeRange, result.weapon2);

		GF2TimeSlotDto.add(this.character4Weapon1, timeRange, result.character4);
		GF2TimeSlotDto.add(this.character4Weapon1, timeRange, result.weapon4);
		GF2TimeSlotDto.add(this.character4, timeRange, result.character4);

		GF2TimeSlotDto.add(this.character7Weapon1, timeRange, result.character7);
		GF2TimeSlotDto.add(this.character7Weapon1, timeRange, result.weapon7);
	}

	private static add(
		target: Map<string, SlotDto>,
		timeRange: string,
		gachaResult: SimulateGachaResult,
	): void {
		if (!target.has(timeRange)) {
			target.set(timeRange, SlotDto.empty());
		}
		target.get(timeRange)!.addBySimulateReuslt(gachaResult);
	}
}
