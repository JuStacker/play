import * as fs from 'fs'

const GACHA_LOG_PATH = "zzzGachaV2.txt";

/* analyze.ts */

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

/* ================= 시나리오 ================= */

const SCENARIOS: Record<ScenarioKey, (s: Simulation) => GachaResult[]> = {
  A_CHARACTER: s => [s.aCharacter],
  AB_CHARACTER: s => [s.aCharacter, s.bCharacter],
  AB_CHARACTER_A_WEAPON: s => [s.aCharacter, s.bCharacter, s.aWeapon],
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

function calcStats(results: GachaResult[], simCount: number) {
  const avgPity =
    results.reduce((a, b) => a + b.pickupPityCount, 0) / results.length

  const winRate =
    results.filter(r => r.isWin).length / results.length

  return { avgPity, winRate, simCount }
}

function relativeScore(
  value: number,
  min: number,
  max: number,
  maxScore: number
) {
  if (min === max) return maxScore
  return Math.round(maxScore * (value - min) / (max - min))
}

function inverseRelativeScore(
  value: number,
  min: number,
  max: number,
  maxScore: number
) {
  if (min === max) return maxScore
  return Math.round(maxScore * (max - value) / (max - min))
}

/* ================= 텍스트 포맷 ================= */
function formatTable(title: string, rows: any[]): string {
  const header = `\n=== ${title} 추천 시간대 ===\n`
  const body = rows
    .map(r =>
      [
        r.시간대,
        `점수:${r.점수}`,
        `평균뽑기:${r.평균_픽업뽑기}`,
        `승률:${r.반천_승률}`,
        `시뮬:${r.시뮬레이션_수}`,
      ].join(' | ')
    )
    .join('\n')

  return header + body + '\n'
}


/* ================= 메인 ================= */
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

  const stats = [...slotMap.entries()].map(([slot, v]) => {
    const base = calcStats(v.results, v.count)
    return { 시간대: slot, ...base }
  })

  const minPity = Math.min(...stats.map(s => s.avgPity))
  const maxPity = Math.max(...stats.map(s => s.avgPity))
  const minWin = Math.min(...stats.map(s => s.winRate))
  const maxWin = Math.max(...stats.map(s => s.winRate))
  const minVol = Math.min(...stats.map(s => s.simCount))
  const maxVol = Math.max(...stats.map(s => s.simCount))

  const ranked = stats
    .map(s => {
      const pityScore = inverseRelativeScore(
        s.avgPity,
        minPity,
        maxPity,
        50
      )

      const winScore = relativeScore(
        s.winRate,
        minWin,
        maxWin,
        40
      )

      const volumeScore = relativeScore(
        s.simCount,
        minVol,
        maxVol,
        10
      )

      return {
        시간대: s.시간대,
        점수: pityScore + winScore + volumeScore,
        평균_픽업뽑기: Math.round(s.avgPity),
        반천_승률: `${(s.winRate * 100).toFixed(1)}%`,
        시뮬레이션_수: s.simCount,
      }
    })
    .sort((a, b) => b.점수 - a.점수)
    .slice(0, 10)

  console.log(`\n=== ${scenario} 추천 시간대 ===`)
  console.table(ranked)

  return formatTable(scenario, ranked);
}

/* ================= 실행 ================= */
main();
function main() {
    const rawData = readGachaLog(GACHA_LOG_PATH);
    const outputLines: string[] = [];

    

    outputLines.push(analyze(rawData, 'A_CHARACTER'));
    outputLines.push(analyze(rawData, 'AB_CHARACTER'));
    outputLines.push(analyze(rawData, 'AB_CHARACTER_A_WEAPON'));
    outputLines.push(analyze(rawData, 'AB_CHARACTER_AB_WEAPON'));

    fs.writeFileSync(
        'zzzGachaV2-info.txt',
        outputLines.join('\n'),
        'utf-8'
    );
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