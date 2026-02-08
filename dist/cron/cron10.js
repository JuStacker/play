"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const node_cron_1 = __importDefault(require("node-cron"));
const log_1 = require("../util/log");
const Enviroment_1 = require("../Enviroment");
const GachaResult_1 = require("../gachaSimulator/GachaResult");
const GachaState_1 = require("../gachaSimulator/GachaState");
const rollWeapon_1 = require("../gachaSimulator/rollWeapon");
const rollCharacter_1 = require("../gachaSimulator/rollCharacter");
const writeSimulateLog_1 = require("../simulateLog/writeSimulateLog");
log_1.Log.log("cron app started");
// 10분마다 실행
node_cron_1.default.schedule("*/10 * * * *", () => {
    const now = new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
    });
    main(Enviroment_1.Eniviroment.LOCAL_GACHA_LOG_V2_PATH);
});
// 프로세스 유지
process.stdin.resume();
function main(logPath) {
    simlateForGacha(logPath);
}
function simlateForGacha(logPath) {
    const aCharacter = chararcterGacha();
    const bCharacter = chararcterGacha();
    const aWeapon = weaponGacha();
    const bWeapon = weaponGacha();
    (0, writeSimulateLog_1.writeSimulateLog)(logPath, aCharacter, aWeapon, bCharacter, bWeapon);
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
