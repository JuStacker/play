import { GachaResult } from "./gachaSimulator/GachaResult";
import { GachaResultType } from "./gachaSimulator/GachaResultType";
import { rollCharacter } from "./gachaSimulator/rollCharacter";
import { GachaState } from "./gachaSimulator/GachaState";
import { Log } from "./util/log";
import { writeSimulateLog } from "./simulateLog/writeSimulateLog";
import { rollWeapon } from "./gachaSimulator/rollWeapon";
import { Eniviroment } from "./Enviroment";
/**
 * 어떤 시간대에 최적의 값이 나오는지 가챠 시뮬레이터를 만들어서 저장하기
 * 요구사항
 * - 픽업, 복각 두개를 고려하여 캐릭터/무기 뽑기 시뮬레이션을 2개 돌린다.
 * - 결과는 픽업이 나오기까지 횟수, 픽뚫 여부, A/B 나온 횟수를 기존으로 한다.
 * - 가챠는 73회까지는 0.6% 고정확률 74회부터 확률보정, 90회 천장 74-90회 구간에 확률 보정이 선형적
 */


main(Eniviroment.GACHA_LOG_V2_PATH);

export function main(logPath: string):void {
    simlateForGacha(logPath);
}


function simlateForGacha(logPath: string): void {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();

    const aWeapon = weaponGacha(); 
    const bWeapon = weaponGacha();


    writeSimulateLog(logPath, aCharacter, aWeapon, bCharacter, bWeapon);
}


function chararcterGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    for(let i = 0; i < 160; i++) {
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
