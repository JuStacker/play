import { GachaResult } from "../../gachaSimulator/GachaResult";
import { analyzeGF2ByTimeSlot } from "../analyze/analyzeGF2ByTimeSlot";
import { GF2SimulateResult } from "../dto/GF2SimulateResult";
import { GF2GachaRoller } from "../gachaSimulator/GF2GachaRoller";
import { GF2GachaState } from "../gachaSimulator/GF2GachaState";
import { writeGF2SimulateLog } from "../simulateLog/writeGF2SimulateLog";
import { updateGF2TimeSlot } from "../timeSlot/updateGF2TimeSlot";

const MAX_CHARACTER_PULLS = 160;
const MAX_WEAPON_PULLS = 140;

const characterRoller = GF2GachaRoller.ofCharacter();
const weaponRoller = GF2GachaRoller.ofWeapon();

export function simulateForGF2(
	logPath: string,
	date: Date,
	isSkipAnalyze = false,
): void {
	const character1 = runGacha(characterRoller, MAX_CHARACTER_PULLS);
	const weapon1 = runGacha(weaponRoller, MAX_WEAPON_PULLS);
	const character2 = runGacha(characterRoller, MAX_CHARACTER_PULLS);
	const weapon2 = runGacha(weaponRoller, MAX_WEAPON_PULLS);
	const character4 = runGacha(characterRoller, MAX_CHARACTER_PULLS);
	const weapon4 = runGacha(weaponRoller, MAX_WEAPON_PULLS);
	const character6 = runGacha(characterRoller, MAX_CHARACTER_PULLS);
	const weapon6 = runGacha(weaponRoller, MAX_WEAPON_PULLS);

	const simulateResult = GF2SimulateResult.of({
		character1: character1.toLog(),
		weapon1: weapon1.toLog(),
		character2: character2.toLog(),
		weapon2: weapon2.toLog(),
		character4: character4.toLog(),
		weapon4: weapon4.toLog(),
		character6: character6.toLog(),
		weapon6: weapon6.toLog(),
	});

	writeGF2SimulateLog(logPath, date, simulateResult);

	if (isSkipAnalyze) return;

	const timeSlotDto = updateGF2TimeSlot(date, simulateResult);

	analyzeGF2ByTimeSlot(timeSlotDto);
}

function runGacha(roller: GF2GachaRoller, maxPulls: number): GachaResult {
	const state = new GF2GachaState();
	const result = new GachaResult();

	for (let i = 0; i < maxPulls; i++) {
		result.addRollResult(roller.roll(state));
		if (result.hasWinS()) break;
	}

	return result;
}
