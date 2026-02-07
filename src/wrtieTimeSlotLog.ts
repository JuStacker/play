import fs from 'fs';
import { ScenarioKey } from './analyze';
import { TimeSlotFormate } from './timeSlot/dto/TimeSlotFormate';

const GACHA_LOG_PATH = "zzzGachaV2.txt";

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


/* ================= 유틸 ================= */

function toTimeSlot(iso: string): string {
  const d = new Date(iso)
  const h = d.getHours().toString().padStart(2, '0')
  const m = Math.floor(d.getMinutes() / 10) * 10
  const mm = m.toString().padStart(2, '0')
  return `${h}:${mm}~${h}:${(m + 9).toString().padStart(2, '0')}`
}

function calcStats(results: GachaResult[], simCount: number) {
  const avgPity =
    fl(results.reduce((a, b) => a + b.pickupPityCount, 0) / results.length);

  const winRate =
    fl(results.filter(r => r.isWin).length / results.length);

  return { avgPity, winRate, simCount }
}
function fl(num: number): number {
  return Math.floor(num * 100) / 100;
}


writeTimeSlotLog();

export function writeTimeSlotLog() {
    const rawData = readGachaLog(GACHA_LOG_PATH);
    const result:TimeSlotFormate = {
        A_CHARACTER: {},
        AB_CHARACTER: {},
        AB_CHARACTER_A_WEAPON: {},
        AB_CHARACTER_AB_WEAPON: {}
    };

    const slotMap = new Map<
    string,
    { results: GachaResult[]; count: number }
  >()

  for(const scKey of Object.keys(result)) {
      for (const [time, sim] of Object.entries(rawData)) {
        const slot = toTimeSlot(time)
        const targets = SCENARIOS[scKey](sim)

        if (!slotMap.has(slot)) {
        slotMap.set(slot, { results: [], count: 0 })
        }

        const bucket = slotMap.get(slot)!
        bucket.results.push(...targets)
        bucket.count++
    }
    
    [...slotMap.entries()].forEach(([slot, v]) => {
        result[scKey][slot] = calcStats(v.results, v.count)
    });

  }

  const stats = [...slotMap.entries()].map(([slot, v]) => {
    const base = calcStats(v.results, v.count)
    return { 시간대: slot, ...base }
  })

    fs.writeFileSync(
        'zzzGachaV2-time-slot.json',
        JSON.stringify(result),
        'utf-8'
    );
}