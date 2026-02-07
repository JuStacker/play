import * as path from 'path';
import { SignalStat } from './log/signalStat';
import { readFile } from './log/readFile';
import { SummaryResult } from './log/SummaryResult';
import { getHourKey } from './util/getHourKey';
import { getHourMinuteKey } from './util/getHourMinuteKey';


// 파일 경로 설정 (현재 파일 기준으로 같은 디렉토리의 example.txt)
const filePath = path.join('results.txt');

showLog();

function showLog() {
  const signalStats = readFile(filePath);
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
function summarizeByHourMinute(stats: SignalStat[]): SummaryResult[] {
  const grouped = new Map<string, SignalStat[]>();

  for (const stat of stats) {
    const key = getHourMinuteKey(stat.date);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(stat);
  }

  const result: SummaryResult[] = [];

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

function summarizeByHour(stats: SignalStat[]): SummaryResult[] {
  const grouped = new Map<string, SignalStat[]>();

  for (const stat of stats) {
    const key = getHourKey(stat.date);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(stat);
  }

  const result: SummaryResult[] = [];

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
function scoreTime(d: SummaryResult, {maxAvg, maxWinRate, maxSignals}): number {
  const avg = d.sCountAvg;
  const sWinRate = d.sWinAvg;
  const signals = d.sSignalCount;

  const normAvg = avg / maxAvg;             // 0~1 정규화
  const normWinRate = sWinRate / maxWinRate;
  const normSignals = signals / maxSignals;

  // 가중합 (비율은 필요에 따라 조절 가능)
  const score = normAvg * 0.01 + normWinRate * 0.5 + normSignals * 0.4;
  return (score * 100);
}


function getRecommendation(data: SummaryResult[], maxCount: number = 10) {
  const maxWinRate = Math.max(...data.map((d) => d.sWinAvg || 0));
  const maxAvg = Math.max(...data.map((d) => d.sCountAvg || 0));
  const maxSignals = Math.max(...data.map((d) => d.sSignalCount || 0));

  return data
    .map((d) => ({ ...d, score: scoreTime(d, {maxAvg, maxWinRate, maxSignals}) }))
    .sort((a, b) => b.score - a.score)
    .map(d => { return { 시간대: d.time, 시뮬레이션수: d.sSignalCount, "평균S갯수": fl(d.sCountAvg), '반천장 승률': fl(d.sWinAvg), '총S갯수': d.sCountTotal, '반천장 승리 수': d.sWinCount, '점수': Math.floor(d.score) } })
    .slice(0, maxCount);
}

function fl(num: number): number {
  return Math.floor(num * 100) / 100;
}