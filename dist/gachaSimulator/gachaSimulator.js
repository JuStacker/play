"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gachaSimulator = gachaSimulator;
const fs_1 = __importDefault(require("fs"));
const log_1 = require("../log/log");
const GachaResultType_1 = require("./GachaResultType");
const GachaState_1 = require("./GachaState");
const GachaTableGenerlator_1 = require("./GachaTableGenerlator");
class GachaResult {
    constructor() {
        this.logs = [];
    }
    addRollResult(result) {
        this.logs.push(result.result);
    }
    toLog() {
        let pickupPityCount = 0;
        let sPityCounts = [];
        let aPityCounts = [];
        let bCount = 0;
        for (let i = 0; i < this.logs.length; i++) {
            const resultType = this.logs[i];
            switch (resultType) {
                case GachaResultType_1.GachaResultType.S_Win:
                    sPityCounts.push(i);
                    pickupPityCount = i;
                    break;
                case GachaResultType_1.GachaResultType.S_Lose:
                    sPityCounts.push(i);
                    break;
                case GachaResultType_1.GachaResultType.A:
                    aPityCounts.push(i);
                    break;
                case GachaResultType_1.GachaResultType.B:
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
function gachaSimulator() {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();
    const aWeapon = weaponGacha();
    const bWeapon = weaponGacha();
    writeGachaLog(aCharacter, aWeapon, bCharacter, bWeapon);
}
function chararcterGacha() {
    const state = new GachaState_1.GachaState();
    const result = new GachaResult();
    const tableGenerlator = GachaTableGenerlator_1.GachaTableGenerlator.ofZZZCharacter();
    for (let i = 0; i < 160; i++) {
        const table = tableGenerlator.createTable(state);
        log_1.Log.log(`${i + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
        const rollResult = table.roll(state);
        result.addRollResult(rollResult);
        log_1.Log.log(`  → 결과: ${GachaResultType_1.GachaResultType[rollResult.result]}`);
        if (rollResult.result === GachaResultType_1.GachaResultType.S_Win)
            break;
    }
    log_1.Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType_1.GachaResultType[r]).join(", "));
    return result;
}
function weaponGacha() {
    const state = new GachaState_1.GachaState();
    const result = new GachaResult();
    const tableGenerlator = GachaTableGenerlator_1.GachaTableGenerlator.ofZZZWeapon();
    for (let i = 0; i < 160; i++) {
        const table = tableGenerlator.createTable(state);
        log_1.Log.log(`${i + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
        const rollResult = table.roll(state);
        result.addRollResult(rollResult);
        log_1.Log.log(`  → 결과: ${GachaResultType_1.GachaResultType[rollResult.result]}`);
        if (rollResult.result === GachaResultType_1.GachaResultType.S_Win)
            break;
    }
    log_1.Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType_1.GachaResultType[r]).join(", "));
    return result;
}
function toPercent(value) {
    return (value * 100).toFixed(2) + "%";
}
function writeGachaLog(aCharacter, aWeapon, bCharacter, bWeapon) {
    const result = {
        aCharacter: aCharacter.toLog(),
        bCharacter: bCharacter.toLog(),
        aWeapon: aWeapon.toLog(),
        bWeapon: bWeapon.toLog()
    };
    fs_1.default.appendFileSync("zzzGachaV2.txt", `${new Date().toISOString()}": ${JSON.stringify(result)}, \n`);
}
