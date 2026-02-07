"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGachalog = initGachalog;
const getHourMinuteKey_1 = require("../util/getHourMinuteKey");
const readGachaV2Log_1 = require("../util/readGachaV2Log");
const log_1 = require("./log");
const GACHA_V2_LOG_PATH = "zzzGachaV2.txt";
/**
 * 시간별 요약 정보를 업데이트 시키기
 */
function initGachalog() {
    const gachaLogs = (0, readGachaV2Log_1.readGachaV2Log)(GACHA_V2_LOG_PATH);
    const summaryResultManager = summarizeByHourMinute(gachaLogs);
    // 캐릭터 하나 
    log_1.Log.log("===== 한개 캐릭터 픽업시 추천 시간대 =====");
    log_1.Log.table(getRecomamendation(1, 0, 10, summaryResultManager));
}
function getRecomamendation(characterCount, weaponCount, recomandCount, summaryResultManager) {
    const result = {};
    return result;
}
/**
 * 시:분(10분 단위) 기준으로 SignalStat들을 그룹화하고 요약 통계 생성
 */
function summarizeByHourMinute(gachaLogs) {
    const grouped = new Map();
    for (const stat of gachaLogs) {
        const key = (0, getHourMinuteKey_1.getHourMinuteKey)(stat.date);
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(stat.gachaLog);
    }
    return SummaryResultManager.of(grouped);
}
class SummaryResultManager {
    constructor() {
        this.sumaryResults = [];
    }
    static of(grouped) {
        const result = new SummaryResultManager();
        for (const [time, group] of grouped.entries()) {
            result.sumaryResults.push(new SummaryResult(time, group));
        }
        result.sorting();
        return result;
    }
    sorting() {
        this.sumaryResults.sort((a, b) => a.time.localeCompare(b.time));
    }
}
class SummaryResult {
    constructor(time, Logs) {
        this.time = time;
        this.aCharacterTotal = GachaSummary.of(Logs.map(log => log.aCharacter));
        this.bCharacterTotal = GachaSummary.of(Logs.map(log => log.bCharacter));
        this.aWeaponTotal = GachaSummary.of(Logs.map(log => log.aWeapon));
        this.bWeaponTotal = GachaSummary.of(Logs.map(log => log.bWeapon));
    }
}
class GachaSummary {
    constructor() {
        this.totalSimulate = 0;
        this.pickupPityAvg = 0;
        this.winAvg = 0;
        this.aTotal = 0;
        this.winCount = 0;
    }
    static of(gachaResultLogs) {
        const summary = new GachaSummary();
        summary.init(gachaResultLogs);
        return summary;
    }
    init(gachaResultLogs) {
        this.totalSimulate = gachaResultLogs.length;
        this.pickupPityAvg = gachaResultLogs.reduce((sum, log) => sum + log.pickupPityCount, 0) / this.totalSimulate;
        this.winCount = gachaResultLogs.filter(log => log.isWin).length;
        this.winAvg = (this.winCount / this.totalSimulate) * 100;
        this.aTotal = gachaResultLogs.reduce((sum, log) => sum + log.aCount, 0);
    }
}
