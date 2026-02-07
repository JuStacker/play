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
const path = __importStar(require("path"));
const readFile_1 = require("./log/readFile");
const getHourKey_1 = require("./util/getHourKey");
const getHourMinuteKey_1 = require("./util/getHourMinuteKey");
// 파일 경로 설정 (현재 파일 기준으로 같은 디렉토리의 example.txt)
const filePath = path.join('results.txt');
showLog();
function showLog() {
    const signalStats = (0, readFile_1.readFile)(filePath);
    const summary = summarizeByHourMinute(signalStats);
    const summaryByHour = summarizeByHour(signalStats);
    console.log("시간대 목록:");
    console.table(summaryByHour);
    // 출력
    console.log("🔥 추천 분대 목록:");
    console.table(getRecommendation(summary, 10));
    // 출력
    console.log("🔥 추천 시대 목록:");
    console.table(getRecommendation(summaryByHour, 10));
}
/**
 * 시:분(10분 단위) 기준으로 SignalStat들을 그룹화하고 요약 통계 생성
 */
function summarizeByHourMinute(stats) {
    const grouped = new Map();
    for (const stat of stats) {
        const key = (0, getHourMinuteKey_1.getHourMinuteKey)(stat.date);
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(stat);
    }
    const result = [];
    for (const [time, group] of grouped.entries()) {
        const sCountTotal = group.reduce((sum, s) => sum + s.sCount, 0);
        const sCountAvg = sCountTotal / group.length;
        const sSignalCount = group.length;
        const sWinCount = group.reduce((sum, s) => sum + s.sWinCount, 0);
        result.push({
            time,
            sCountTotal,
            sCountAvg,
            sSignalCount,
            sWinCount,
            sWinAvg: (sWinCount / sCountTotal) * 100
        });
    }
    // 시:분 문자열 기준 정렬
    result.sort((a, b) => a.time.localeCompare(b.time));
    return result;
}
function summarizeByHour(stats) {
    const grouped = new Map();
    for (const stat of stats) {
        const key = (0, getHourKey_1.getHourKey)(stat.date);
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(stat);
    }
    const result = [];
    for (const [time, group] of grouped.entries()) {
        const sCountTotal = group.reduce((sum, s) => sum + s.sCount, 0);
        const sCountAvg = sCountTotal / group.length;
        const sSignalCount = group.length;
        const sWinCount = group.reduce((sum, s) => sum + s.sWinCount, 0);
        result.push({
            time,
            sCountTotal,
            sCountAvg,
            sSignalCount,
            sWinCount,
            sWinAvg: (sWinCount / sCountTotal) * 100
        });
    }
    // 시:분 문자열 기준 정렬
    result.sort((a, b) => a.time.localeCompare(b.time));
    return result;
}
// 점수 계산 함수
function scoreTime(d, { maxAvg, maxWinRate, maxSignals }) {
    const avg = d.sCountAvg;
    const sWinRate = d.sWinAvg;
    const signals = d.sSignalCount;
    const normAvg = avg / maxAvg; // 0~1 정규화
    const normWinRate = sWinRate / maxWinRate;
    const normSignals = signals / maxSignals;
    // 가중합 (비율은 필요에 따라 조절 가능)
    const score = normAvg * 0.01 + normWinRate * 0.5 + normSignals * 0.4;
    return (score * 100);
}
function getRecommendation(data, maxCount = 10) {
    const maxWinRate = Math.max(...data.map((d) => d.sWinAvg || 0));
    const maxAvg = Math.max(...data.map((d) => d.sCountAvg || 0));
    const maxSignals = Math.max(...data.map((d) => d.sSignalCount || 0));
    return data
        .map((d) => ({ ...d, score: scoreTime(d, { maxAvg, maxWinRate, maxSignals }) }))
        .sort((a, b) => b.score - a.score)
        .map(d => { return { 시간대: d.time, 시뮬레이션수: d.sSignalCount, "평균S갯수": fl(d.sCountAvg), '반천장 승률': fl(d.sWinAvg), '총S갯수': d.sCountTotal, '반천장 승리 수': d.sWinCount, '점수': Math.floor(d.score) }; })
        .slice(0, maxCount);
}
function fl(num) {
    return Math.floor(num * 100) / 100;
}
