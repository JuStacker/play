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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeByTimeSlot = analyzeByTimeSlot;
const Enviroment_1 = require("../Enviroment");
const inverseRelativeScore_1 = require("../util/inverseRelativeScore");
const log_1 = require("../util/log");
const relativeScore_1 = require("../util/relativeScore");
const AnalyzeTimeSlot_1 = require("./dto/AnalyzeTimeSlot");
const TotalAnalyze_1 = require("./dto/TotalAnalyze");
const fs = __importStar(require("fs"));
const A_CH_TITLE = "A캐릭터 추천 시간대";
const AB_CH_TITLE = "AB캐릭터 추천 시간대";
const AB_CH_A_WP_TITLE = "AB캐릭터 + A무기 추천 시간대";
const AB_CH_AB_WP_TITLE = "AB캐릭터 + AB무기 추천 시간대";
function analyzeByTimeSlot(timeSlotDto) {
    const aAnalyzeList = analyzeByRangeSlot(timeSlotDto.aCharacter);
    const abAnalyzeList = analyzeByRangeSlot(timeSlotDto.abCharacter);
    const abChaWpAnlyzeList = analyzeByRangeSlot(timeSlotDto.abCharacterAWeapon);
    const abChabWpAnlyzeList = analyzeByRangeSlot(timeSlotDto.abCharacterAbWeapon);
    showLog(A_CH_TITLE, 10, aAnalyzeList);
    showLog(AB_CH_TITLE, 10, abAnalyzeList);
    showLog(AB_CH_A_WP_TITLE, 10, abChaWpAnlyzeList);
    showLog(AB_CH_AB_WP_TITLE, 10, abChabWpAnlyzeList);
    const outputLines = [
        formatTable(A_CH_TITLE, aAnalyzeList),
        formatTable(AB_CH_TITLE, abAnalyzeList),
        formatTable(AB_CH_A_WP_TITLE, abChaWpAnlyzeList),
        formatTable(AB_CH_AB_WP_TITLE, abChabWpAnlyzeList),
    ];
    fs.writeFileSync(Enviroment_1.Eniviroment.GACHA_LOG_V2_PATH, outputLines.join('\n'), 'utf-8');
}
function showLog(title, maxSlot, analyzeTimeSlots) {
    log_1.Log.log("\n" + title);
    log_1.Log.table(analyzeTimeSlots
        .slice(0, maxSlot)
        .map((slotDto) => slotDto.analyzeTimeFormat));
}
function analyzeByRangeSlot(rangeDtoMap) {
    const totalAnalyze = new TotalAnalyze_1.TotalAnalyze();
    for (const slotDto of rangeDtoMap.values()) {
        totalAnalyze.updateBySlotDto(slotDto);
    }
    const analyzeTimeSlots = [];
    for (const [timeRange, slotDto] of rangeDtoMap.entries()) {
        analyzeTimeSlots.push(AnalyzeTimeSlot_1.AnalyzeTimeSlotDto.of(timeRange, calcScore(slotDto, totalAnalyze), slotDto));
    }
    analyzeTimeSlots.sort((a, b) => b.score - a.score);
    return analyzeTimeSlots;
}
function calcScore(slotDto, totalAnalyze) {
    const pityScore = (0, inverseRelativeScore_1.inverseRelativeScore)(slotDto.avgPity, totalAnalyze.minAvgPity, totalAnalyze.maxAvgPity, 50);
    const winScore = (0, relativeScore_1.relativeScore)(slotDto.winRate, totalAnalyze.minWinRate, totalAnalyze.maxWinRate, 40);
    const simCountScore = (0, relativeScore_1.relativeScore)(slotDto.simCount, totalAnalyze.minSimCount, totalAnalyze.maxSimCount, 10);
    return pityScore + winScore + simCountScore;
}
function formatTable(title, slotDtos, maxSlot = 10) {
    const header = `\n=== ${title} ===\n`;
    const body = slotDtos
        .slice(0, maxSlot)
        .map(v => v.analyzeTimeFormat)
        .map((r) => [
        r.시간대,
        `점수:${r.점수}`,
        `평균 뽑기:${r["픽업 평균 뽑기"]}`,
        `승률:${r["반천장 승률"]}`,
        `시뮬 횟수:${r["시뮬레이션 횟수"]}`,
    ].join(" | "))
        .join("\n");
    return header + body + "\n";
}
