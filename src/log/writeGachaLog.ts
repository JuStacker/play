import { GachaResult } from "../gachaSimulator/GachaResult";
import * as fs from "fs";
import { GachaResultLog } from "./dto/GachaResultLog";
import { Log } from "./log";


export function writeGachaLog(aCharacter: GachaResult, aWeapon: GachaResult, bCharacter: GachaResult, bWeapon: GachaResult): void {
    const result: GachaLog = {
        aCharacter: aCharacter.toLog(),
        aWeapon: aWeapon.toLog(),
        bCharacter: bCharacter.toLog(),
        bWeapon: bWeapon.toLog()
    };

    logToResult(result);

    fs.appendFileSync("zzzGachaV2.txt", `${new Date().toISOString()}": ${JSON.stringify(result)}, \n`)
}

interface GachaLog {
    aCharacter: GachaResultLog;
    aWeapon: GachaResultLog;
    bCharacter: GachaResultLog;
    bWeapon: GachaResultLog;
}


function logToResult(gachaLog: GachaLog): void {
    Log.table({
        "A 캐릭터": toObj(gachaLog.aCharacter),
        "B 캐릭터": toObj(gachaLog.bCharacter),
        "A 무기": toObj(gachaLog.aWeapon),
        "B 무기": toObj(gachaLog.bWeapon),
    });


    function toObj(resultLog: GachaResultLog): object {
        return {
            "픽업까지 뽑은 횟수": resultLog.pickupPityCount,
            "픽뚫 여부": resultLog.isWin ? "반천" : "픽뚫",
            "A등급 뽑은 횟수": resultLog.aCount,
        };
    }    
}
