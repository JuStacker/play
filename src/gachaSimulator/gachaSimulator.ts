import fs from "fs";
import { Log } from "../log/log";
import { GachaResultType } from "./GachaResultType";
import { GachaState } from "./GachaState";
import { RollResult } from "./RollResult";
import { GachaTableGenerlator } from "./GachaTableGenerlator";
import { GachaResultLog } from "../log/dto/GachaResultLog";

class GachaResult {
    logs: GachaResultType[];
    constructor() {
        this.logs = [];
    }

    addRollResult(result: RollResult): void {
        this.logs.push(result.result);
    }

    toLog(): GachaResultLog {
        let pickupPityCount = 0;
        let sPityCounts = [];
        let aPityCounts = [];
        let bCount = 0;

        for(let i = 0; i < this.logs.length; i++) {
            const resultType = this.logs[i];
            switch(resultType) {
                case GachaResultType.S_Win:
                    sPityCounts.push(i);
                    pickupPityCount = i;
                    break;
                case GachaResultType.S_Lose:
                    sPityCounts.push(i);
                    break;
                case GachaResultType.A:
                    aPityCounts.push(i);
                    break;
                case GachaResultType.B:
                    bCount++;
                    break;
            }
        }

        return {
            pickupPityCount,
            isWin: sPityCounts.length === 1,
            sPityCounts,
            aPityCounts,
            bCount,
            aCount: aPityCounts.length,
            totalSignal: this.logs.length
        };
    }
}

export function gachaSimulator(): void {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();

    const aWeapon = weaponGacha(); 
    const bWeapon = weaponGacha();


    writeGachaLog(aCharacter, aWeapon, bCharacter, bWeapon);
}

function chararcterGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    const tableGenerlator = GachaTableGenerlator.ofZZZCharacter();

    for(let i = 0; i < 160; i++) {
        const table = tableGenerlator.createTable(state);
        Log.log(`${i + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
        const rollResult = table.roll(state);
        result.addRollResult(rollResult);
        Log.log(`  → 결과: ${GachaResultType[rollResult.result]}`);

        if(rollResult.result === GachaResultType.S_Win) break;
    }

    Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));

    return result;
}

function weaponGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    const tableGenerlator = GachaTableGenerlator.ofZZZWeapon();

    for(let i = 0; i < 160; i++) {
        const table = tableGenerlator.createTable(state);
        Log.log(`${i + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
        const rollResult = table.roll(state);
        result.addRollResult(rollResult);
        Log.log(`  → 결과: ${GachaResultType[rollResult.result]}`);

        if(rollResult.result === GachaResultType.S_Win) break;
    }

    Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));

    return result;
}

function toPercent(value: number): string {
    return (value * 100).toFixed(2) + "%";
}

function writeGachaLog(aCharacter: GachaResult, aWeapon: GachaResult, bCharacter: GachaResult, bWeapon: GachaResult): void {
    const result: GachaLog = {
        aCharacter: aCharacter.toLog(),
        bCharacter: bCharacter.toLog(),
        aWeapon: aWeapon.toLog(),
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

