import { analyzeByTimeSlot } from "../analyze/analyzeByTimeSlot";
import { SimulateResult } from "../dto/SimulateResult";
import { GachaResult } from "../gachaSimulator/GachaResult";
import { GachaRoller } from "../gachaSimulator/GachaRoller";
import { GachaState } from "../gachaSimulator/GachaState";
import { writeSimulateLog } from "../simulateLog/writeSimulateLog";
import { updateTimeSlot } from "../timeSlot/updateTimeSlot";

const MAX_CHARACTER_PULLS = 180;
const MAX_WEAPON_PULLS = 160;

const characterRoller = GachaRoller.ofCharacter();
const weaponRoller = GachaRoller.ofWeapon();

export function simlateForGacha(
	logPath: string,
	date: Date,
	isSkipAnalyze = false,
): void {
	const aCharacter = runGacha(characterRoller, MAX_CHARACTER_PULLS);
	const bCharacter = runGacha(characterRoller, MAX_CHARACTER_PULLS);

	const aWeapon = runGacha(weaponRoller, MAX_WEAPON_PULLS);
	const bWeapon = runGacha(weaponRoller, MAX_WEAPON_PULLS);

	const simulateResult = SimulateResult.of({
		aCharacter: aCharacter.toLog(),
		bCharacter: bCharacter.toLog(),
		aWeapon: aWeapon.toLog(),
		bWeapon: bWeapon.toLog(),
	});

	writeSimulateLog(logPath, date, simulateResult);

	if (isSkipAnalyze) return;

	const timeSlotDto = updateTimeSlot(date, simulateResult);

	analyzeByTimeSlot(timeSlotDto);
}

function runGacha(roller: GachaRoller, maxPulls: number): GachaResult {
	const state = new GachaState();
	const result = new GachaResult();

	for (let i = 0; i < maxPulls; i++) {
		result.addRollResult(roller.roll(state));
		if (result.hasWinS()) break;
	}

	return result;
}
