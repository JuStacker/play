/* analyze.ts */

import * as fs from 'fs'

const GACHA_LOG_PATH = "zzzGachaV2.txt";

type GachaResult = {
  pickupPityCount: number
  isWin: boolean
}

type Simulation = {
  aCharacter: GachaResult
  bCharacter: GachaResult
  aWeapon: GachaResult
  bWeapon: GachaResult
}

type RawData = Record<string, Simulation>

type ScenarioKey =
  | 'A_CHARACTER'
  | 'AB_CHARACTER'
  | 'AB_CHARACTER_A_WEAPON'
  | 'AB_CHARACTER_AB_WEAPON'

/* ================= 시나리오 정의 ================= */

const SCENARIOS: Record<ScenarioKey, (s: Simulation) => GachaResult[]> = {
  A_CHARACTER: s => [s.aCharacter],

  AB_CHARACTER: s => [s.aCharacter, s.bCharacter],

  AB_CHARACTER_A_WEAPON: s => [
    s.aCharacter,
    s.bCharacter,
    s.aWeapon,
  ],

  AB_CHARACTER_AB_WEAPON: s => [
    s.aCharacter,
    s.bCharacter,
    s.aWeapon,
    s.bWeapon,
  ],
}

/* ================= 유틸 ================= */

function toTimeSlot(iso: string): string {
  const d = new Date(iso)
  const h = d.getUTCHours().toString().padStart(2, '0')
  const m = Math.floor(d.getUTCMinutes() / 10) * 10
  const mm = m.toString().padStart(2, '0')
  return `${h}:${mm}~${h}:${(m + 9).toString().padStart(2, '0')}`
}

function scoreSlot(results: GachaResult[], simCount: number) {
  const avgPity =
    results.reduce((a, b) => a + b.pickupPityCount, 0) / results.length

  const winRate =
    results.filter(r => r.isWin).length / results.length

  const pityScore = Math.max(0, 50 * (1 - avgPity / 160))
  const winScore = 40 * winRate
  const volumeScore = Math.min(10, simCount)

  return {
    점수: Math.round(pityScore + winScore + volumeScore),
    평균_픽업뽑기: Math.round(avgPity),
    반천_승률: `${(winRate * 100).toFixed(1)}%`,
    시뮬레이션_수: simCount,
  }
}

/* ================= 메인 분석 ================= */

function analyze(rawData: RawData, scenario: ScenarioKey) {
  const slotMap = new Map<
    string,
    { results: GachaResult[]; count: number }
  >()

  for (const [time, sim] of Object.entries(rawData)) {
    const slot = toTimeSlot(time)
    const targets = SCENARIOS[scenario](sim)

    if (!slotMap.has(slot)) {
      slotMap.set(slot, { results: [], count: 0 })
    }

    const bucket = slotMap.get(slot)!
    bucket.results.push(...targets)
    bucket.count++
  }

  const ranked = [...slotMap.entries()]
    .map(([slot, v]) => ({
      시간대: slot,
      ...scoreSlot(v.results, v.count),
    }))
    .sort((a, b) => b.점수 - a.점수)
    .slice(0, 10)

  console.log(`\n=== ${scenario} 추천 시간대 ===`)
  console.table(ranked)
}

/* ================= 실행 ================= */
main();
function main() {
    const rawData = readGachaLog(GACHA_LOG_PATH);
    analyze(rawData, 'A_CHARACTER')
    analyze(rawData, 'AB_CHARACTER')
    analyze(rawData, 'AB_CHARACTER_A_WEAPON')
    analyze(rawData, 'AB_CHARACTER_AB_WEAPON')
}



function readGachaLog(filePath: string): RawData {
    const result = {};
    const logString: string = fs.readFileSync(filePath, 'utf-8');
    
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
      if(log.length == 0) {
        return;
      }
      
      const jsonString = `{${log.substring(0, log.lastIndexOf(','))}}`;
      const [[dateString, gachaLog]] = Object.entries(JSON.parse(jsonString)) as any;
      result[dateString] = gachaLog;
    });
    return result;
  } 