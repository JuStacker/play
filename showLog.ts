import * as fs from 'fs';
import * as path from 'path';

interface SignalStatsData {
  sCount: number;
  sWinCount: number;
  sFalseCount: number;
  aCount: number;
  aWinCOunt: number;
  aFalseCount: number;
  sSignals: number[];
  aSignals: number[];
}

interface SummaryResult {
  time: string; // ISO string
  sCountTotal: number;
  sCountAvg: number;
  sSignalCount: number;
  sWinAvg: number;
  sWinCount: number;
}


class SignalStat {
  date: Date;
  sCount: number;
  sWinCount: number;
  sFalseCount: number;
  aCount: number;
  aWinCOunt: number;
  aFalseCount: number;
  sSignals: number[];
  aSignals: number[];

  constructor(date:Date, data: SignalStatsData) {
    this.date = date;
    this.sCount = data.sCount;
    this.sWinCount = data.sWinCount;
    this.sFalseCount = data.sFalseCount;
    this.aCount = data.aCount;
    this.aWinCOunt = data.aWinCOunt;
    this.aFalseCount = data.aFalseCount;
    this.sSignals = data.sSignals;
    this.aSignals = data.aSignals;
  }

  get sWinRate(): number {
    return this.sCount > 0 ? this.sWinCount / this.sCount : 0;
  }

  get aWinRate(): number {
    return this.aCount > 0 ? this.aWinCOunt / this.aCount : 0;
  }
}

// 파일 경로 설정 (현재 파일 기준으로 같은 디렉토리의 example.txt)
const filePath = path.join('results.txt');

showLog();

function showLog() {
  const signalStats = readFile(filePath);
  const summary = summarizeByHourMinute(signalStats);
  
  for (const s of summary) {
    console.log(`[${s.time}] 평균: ${s.sCountAvg.toFixed(2)}, sCount 합: ${s.sCountTotal},  Signals 개수: ${s.sSignalCount}, s승률: ${s.sWinAvg}, s승리수: ${s.sWinCount}`);
  }
}

function showStepLog(signalStats: SignalStat[], stepByMin: number = 10) {
  const sortedStats = signalStats.sort((a, b) => a.date.getHours() - b.date.getHours());

  for(let hour = 0; hour < 24; hour++) {
    for(let min = 0; min < 60; min += stepByMin) {
      
    }
  }
}

function readFile(filePath: string): SignalStat[] {
  const result: SignalStat[] = [];
  const logString: string = fs.readFileSync(filePath, 'utf-8');
  
  logString.replaceAll('\r', '').split('\n').forEach((log) => {
    if(log.length == 0) {
      return;
    }

    const lastDem = log.lastIndexOf(',');

    const jsonString = `{${log.slice(0, lastDem)}}`;
    const[[dateString, signalData]] = Object.entries(JSON.parse(jsonString)) as any;

    result.push(new SignalStat(new Date(dateString), signalData));
  });


  return result;
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

/**
 * 시:분 단위로 10분 내림한 문자열 반환 (UTC 기준)
 * 예: 17:23 → "17:20"
 */
function getHourMinuteKey(date: Date): string {
  const hours = date.getHours(); // ✅ 한국 시간 기준
  const minutes = date.getMinutes();
  const roundedMinutes = minutes - (minutes % 10);

  const hh = String(hours).padStart(2, '0');
  const mm = String(roundedMinutes).padStart(2, '0');

  return `${hh}:${mm}`;
}