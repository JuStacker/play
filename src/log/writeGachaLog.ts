import { GachaResult } from "../gachaSimulator/GachaResult";
import * as fs from "fs";
import { GachaResultLog } from "./dto/GachaResultLog";


function writeGachaLog(aCharacter: GachaResult, aWeapon: GachaResult, bCharacter: GachaResult, bWeapon: GachaResult): void {
    const result: GachaLog = {
        aCharacter: aCharacter.toLog(),
        aWeapon: aWeapon.toLog(),
        bCharacter: bCharacter.toLog(),
        bWeapon: bWeapon.toLog()
    };
    fs.appendFileSync("zzzGachaV2.txt", `${new Date().toISOString()}": ${JSON.stringify(result)}, \n`)
}

interface GachaLog {
    aCharacter: GachaResultLog;
    aWeapon: GachaResultLog;
    bCharacter: GachaResultLog;
    bWeapon: GachaResultLog;
}
