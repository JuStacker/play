import { GachaResult } from "../gachaSimulator/GachaResult";
import * as fs from "fs";
import { SimulateGachaResult } from "./dto/SimulateGachaResult";
import { Log } from "../util/log";
import { SimulateResult } from "./dto/SimulateResult";


export function writeSimulateLog(filePath: string, date: Date ,aCharacter: GachaResult, aWeapon: GachaResult, bCharacter: GachaResult, bWeapon: GachaResult): void {
    const result: SimulateResult = {
        aCharacter: aCharacter.toLog(),
        aWeapon: aWeapon.toLog(),
        bCharacter: bCharacter.toLog(),
        bWeapon: bWeapon.toLog()
    };

    logToResult(result);

    fs.appendFileSync(filePath, `"${date.toISOString()}": ${JSON.stringify(result)}, \n`)
}


function logToResult(gachaLog: SimulateResult): void {
    Log.table({
        "A 캐릭터": toObj(gachaLog.aCharacter),
        "B 캐릭터": toObj(gachaLog.bCharacter),
        "A 무기": toObj(gachaLog.aWeapon),
        "B 무기": toObj(gachaLog.bWeapon),
    });


    function toObj(resultLog: SimulateGachaResult): object {
        return {
            "픽업까지 뽑은 횟수": resultLog.pickupPityCount,
            "픽뚫 여부": resultLog.isWin ? "반천" : "픽뚫",
            "A등급 뽑은 횟수": resultLog.aCount,
        };
    }    
}
