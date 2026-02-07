"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GachaResult_1 = require("./gachaSimulator/GachaResult");
const rollCharacter_1 = require("./gachaSimulator/rollCharacter");
const GachaState_1 = require("./gachaSimulator/GachaState");
const writeGachaLog_1 = require("./log/writeGachaLog");
const rollWeapon_1 = require("./gachaSimulator/rollWeapon");
/**
 * 어떤 시간대에 최적의 값이 나오는지 가챠 시뮬레이터를 만들어서 저장하기
 * 요구사항
 * - 픽업, 복각 두개를 고려하여 캐릭터/무기 뽑기 시뮬레이션을 2개 돌린다.
 * - 결과는 픽업이 나오기까지 횟수, 픽뚫 여부, A/B 나온 횟수를 기존으로 한다.
 * - 가챠는 73회까지는 0.6% 고정확률 74회부터 확률보정, 90회 천장 74-90회 구간에 확률 보정이 선형적
 */
main();
function main() {
    simlateForGacha();
}
function simlateForGacha() {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();
    const aWeapon = weaponGacha();
    const bWeapon = weaponGacha();
    (0, writeGachaLog_1.writeGachaLog)(aCharacter, aWeapon, bCharacter, bWeapon);
}
function chararcterGacha() {
    const state = new GachaState_1.GachaState();
    const result = new GachaResult_1.GachaResult();
    for (let i = 0; i < 160; i++) {
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
