"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const node_cron_1 = __importDefault(require("node-cron"));
const Enviroment_1 = require("../Enviroment");
const GachaResult_1 = require("../gachaSimulator/GachaResult");
const GachaState_1 = require("../gachaSimulator/GachaState");
const rollWeapon_1 = require("../gachaSimulator/rollWeapon");
const rollCharacter_1 = require("../gachaSimulator/rollCharacter");
const writeSimulateLog_1 = require("../simulateLog/writeSimulateLog");
const fs = __importStar(require("fs"));
console.log("cron app started");
// 10분마다 실행
node_cron_1.default.schedule("*/10 * * * *", () => {
    const now = new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
    });
    console.log("----스케줄 실행", now);
    main(Enviroment_1.Eniviroment.LOCAL_GACHA_LOG_V2_PATH);
});
// 프로세스 유지
process.stdin.resume();
fs.writeFileSync("pid.txt", process.pid.toString());
console.log("cron started, pid:", process.pid);
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
