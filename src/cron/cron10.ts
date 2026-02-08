import cron from "node-cron";
import { Log } from "../util/log";
import { Eniviroment } from "../Enviroment";
import { GachaResult } from "../gachaSimulator/GachaResult";
import { GachaState } from "../gachaSimulator/GachaState";
import { rollWeapon } from "../gachaSimulator/rollWeapon";
import { rollCharacter } from "../gachaSimulator/rollCharacter";
import { writeSimulateLog } from "../simulateLog/writeSimulateLog";

Log.log("cron app started");

// 10분마다 실행
cron.schedule("*/10 * * * *", () => {
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  
  main(Eniviroment.LOCAL_GACHA_LOG_V2_PATH);
});

// 프로세스 유지
process.stdin.resume();


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
