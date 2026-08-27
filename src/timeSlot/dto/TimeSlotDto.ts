import { SimulateResult } from "../../dto/SimulateResult";
import { SimulateGachaResult } from "../../simulateLog/dto/SimulateGachaResult";
import { SimulateLogDto } from "../../simulateLog/dto/SimulateLog";
import { toTimeSlot } from "../../util/toTimeSlot";
import { TimeSlotFormat } from "../format/TimeSlotFormate";
import { SlotDto } from "./SlotDto";

export class TimeSlotDto {
	aCharacter: Map<string, SlotDto> = new Map();
	abCharacter: Map<string, SlotDto> = new Map();
	abCharacterAWeapon: Map<string, SlotDto> = new Map();
	abCharacterAbWeapon: Map<string, SlotDto> = new Map();

	static of(timeSlotFormat: TimeSlotFormat): TimeSlotDto {
		const result = new TimeSlotDto();

		for (const [range, slotFormat] of Object.entries(
			timeSlotFormat.aCharacter,
		)) {
			result.aCharacter.set(range, SlotDto.of(slotFormat));
		}

		for (const [range, slotFormat] of Object.entries(
			timeSlotFormat.abCharacter,
		)) {
			result.abCharacter.set(range, SlotDto.of(slotFormat));
		}

		for (const [range, slotFormat] of Object.entries(
			timeSlotFormat.abCharacterAWeapon,
		)) {
			result.abCharacterAWeapon.set(range, SlotDto.of(slotFormat));
		}

		for (const [range, slotFormat] of Object.entries(
			timeSlotFormat.abCharacterAbWeapon,
		)) {
			result.abCharacterAbWeapon.set(range, SlotDto.of(slotFormat));
		}

		return result;
	}

	static ofSimulateLogDtos(simulateLogDtos: SimulateLogDto[]): TimeSlotDto {
		const result = new TimeSlotDto();

		for (const simulateLogDto of simulateLogDtos) {
			result.addSimulate(simulateLogDto.date, simulateLogDto.result);
		}

		return result;
	}

	get timeSlotFormate(): TimeSlotFormat {
		const result = {
			aCharacter: {},
			abCharacter: {},
			abCharacterAWeapon: {},
			abCharacterAbWeapon: {},
		};

		for (const [timeRange, slotDto] of this.aCharacter.entries()) {
			result.aCharacter[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.abCharacter.entries()) {
			result.abCharacter[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.abCharacterAWeapon.entries()) {
			result.abCharacterAWeapon[timeRange] = slotDto.toSlotFormat();
		}
		for (const [timeRange, slotDto] of this.abCharacterAbWeapon.entries()) {
			result.abCharacterAbWeapon[timeRange] = slotDto.toSlotFormat();
		}

		return result;
	}

	addSimulate(date: Date, simulateResult: SimulateResult): void {
		const timeRange = toTimeSlot(date.toISOString());

		TimeSlotDto.addSimulateGacha(
			this.aCharacter,
			timeRange,
			simulateResult.aCharacter,
		);
		TimeSlotDto.markRun(this.aCharacter, timeRange);

		TimeSlotDto.addSimulateGacha(
			this.abCharacter,
			timeRange,
			simulateResult.aCharacter,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacter,
			timeRange,
			simulateResult.bCharacter,
		);
		TimeSlotDto.markRun(this.abCharacter, timeRange);

		TimeSlotDto.addSimulateGacha(
			this.abCharacterAWeapon,
			timeRange,
			simulateResult.aCharacter,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacterAWeapon,
			timeRange,
			simulateResult.bCharacter,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacterAWeapon,
			timeRange,
			simulateResult.aWeapon,
		);
		TimeSlotDto.markRun(this.abCharacterAWeapon, timeRange);

		TimeSlotDto.addSimulateGacha(
			this.abCharacterAbWeapon,
			timeRange,
			simulateResult.aCharacter,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacterAbWeapon,
			timeRange,
			simulateResult.bCharacter,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacterAbWeapon,
			timeRange,
			simulateResult.aWeapon,
		);
		TimeSlotDto.addSimulateGacha(
			this.abCharacterAbWeapon,
			timeRange,
			simulateResult.bWeapon,
		);
		TimeSlotDto.markRun(this.abCharacterAbWeapon, timeRange);
	}

	private static addSimulateGacha(
		target: Map<string, SlotDto>,
		timeRange: string,
		simulateGachaResult: SimulateGachaResult,
	): void {
		if (!target.has(timeRange)) {
			target.set(timeRange, SlotDto.empty());
		}
		target.get(timeRange).addBySimulateReuslt(simulateGachaResult);
	}

	private static markRun(target: Map<string, SlotDto>, timeRange: string): void {
		target.get(timeRange)!.addRun();
	}
}
