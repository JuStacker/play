import { analyzeByTimeSlot } from "../analyze/analyzeByTimeSlot";
import { SimulateResult } from "../dto/SimulateResult";
import { GachaResult } from "../gachaSimulator/GachaResult";
import { GachaState } from "../gachaSimulator/GachaState";
import { rollCharacter } from "../gachaSimulator/rollCharacter";
import { rollWeapon } from "../gachaSimulator/rollWeapon";
import { writeSimulateLog } from "../simulateLog/writeSimulateLog";
import { updateTimeSlot } from "../timeSlot/updateTimeSlot";

export function simlateForGacha(logPath: string, date: Date): void {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();

    const aWeapon = weaponGacha(); 
    const bWeapon = weaponGacha();

    const simulateResult = new SimulateResult(aCharacter.toLog(), bCharacter.toLog(), aWeapon.toLog(), bWeapon.toLog());

    writeSimulateLog(logPath, date, simulateResult);

    const timeSlotDto = updateTimeSlot(date, simulateResult);

    analyzeByTimeSlot(timeSlotDto);
}


function chararcterGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    for(let i = 0; i < 180; i++) {
        // Log.log(`${i + 1}번째 뽑기:`, state);
        result.addRollResult(rollCharacter(state));
        // Log.log(` 결과 -> `, GachaResultType[result.logs[result.logs.length -1]], state);
        if(result.hasWinS()) break;
    }

    // Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));

    return result;
}

function weaponGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    for(let i = 0; i < 160; i++) {
        result.addRollResult(rollWeapon(state));
        // Log.log(`${i + 1}번째 뽑기 결과:`, GachaResultType[result.logs[result.logs.length -1]]);
        if(result.hasWinS()) break;
    }

    // Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));

    return result;
}
