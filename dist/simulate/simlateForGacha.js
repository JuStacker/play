"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simlateForGacha = simlateForGacha;
const analyzeByTimeSlot_1 = require("../analyze/analyzeByTimeSlot");
const SimulateResult_1 = require("../dto/SimulateResult");
const GachaResult_1 = require("../gachaSimulator/GachaResult");
const GachaState_1 = require("../gachaSimulator/GachaState");
const rollCharacter_1 = require("../gachaSimulator/rollCharacter");
const rollWeapon_1 = require("../gachaSimulator/rollWeapon");
const writeSimulateLog_1 = require("../simulateLog/writeSimulateLog");
const updateTimeSlot_1 = require("../timeSlot/updateTimeSlot");
function simlateForGacha(logPath, date) {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();
    const aWeapon = weaponGacha();
    const bWeapon = weaponGacha();
    const simulateResult = new SimulateResult_1.SimulateResult(aCharacter.toLog(), bCharacter.toLog(), aWeapon.toLog(), bWeapon.toLog());
    (0, writeSimulateLog_1.writeSimulateLog)(logPath, date, simulateResult);
    const timeSlotDto = (0, updateTimeSlot_1.updateTimeSlot)(date, simulateResult);
    (0, analyzeByTimeSlot_1.analyzeByTimeSlot)(timeSlotDto);
}
function chararcterGacha() {
    const state = new GachaState_1.GachaState();
    const result = new GachaResult_1.GachaResult();
    for (let i = 0; i < 180; i++) {
        // Log.log(`${i + 1}번째 뽑기:`, state);
        result.addRollResult((0, rollCharacter_1.rollCharacter)(state));
        // Log.log(` 결과 -> `, GachaResultType[result.logs[result.logs.length -1]], state);
        if (result.hasWinS())
            break;
    }
    // Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));
    return result;
}
function weaponGacha() {
    const state = new GachaState_1.GachaState();
    const result = new GachaResult_1.GachaResult();
    for (let i = 0; i < 160; i++) {
        result.addRollResult((0, rollWeapon_1.rollWeapon)(state));
        // Log.log(`${i + 1}번째 뽑기 결과:`, GachaResultType[result.logs[result.logs.length -1]]);
        if (result.hasWinS())
            break;
    }
    // Log.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));
    return result;
}
