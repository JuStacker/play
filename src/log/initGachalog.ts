import { getHourMinuteKey } from "../util/getHourMinuteKey";
import { GachaV2Log, readGachaV2Log } from "../util/readGachaV2Log";
import { GachaLog } from "./dto/GachaLog";
import { GachaResultLog } from "./dto/GachaResultLog";
import { Log } from "./log";

const GACHA_V2_LOG_PATH = "zzzGachaV2.txt";

/**
 * 시간별 요약 정보를 업데이트 시키기
 */
export function initGachalog(): void {
    const gachaLogs = readGachaV2Log(GACHA_V2_LOG_PATH);

    const summaryResultManager = summarizeByHourMinute(gachaLogs);


    // 캐릭터 하나 
    Log.log("===== 한개 캐릭터 픽업시 추천 시간대 =====");
    Log.table(getRecomamendation(1, 0, 10, summaryResultManager));
    
}

function getRecomamendation(characterCount: number, weaponCount: number, recomandCount: number, summaryResultManager: SummaryResultManager): { [date:string]: MoniterProtocol } {
    const result = {};

    

    return result;
}


interface MoniterProtocol {
    "종합 시뮬레이션 횟수": number;
    "픽업까지 사용한 평균 횟수": number;
    "반천에 먹은 확률": number;
    "A등급 총 횟수": number;
    "반천 횟수": number;
    "점수": number,
}

/**
 * 시:분(10분 단위) 기준으로 SignalStat들을 그룹화하고 요약 통계 생성
 */
function summarizeByHourMinute(gachaLogs: GachaV2Log[]): SummaryResultManager {
  const grouped = new Map<string, GachaLog[]>();

  for (const stat of gachaLogs) {
    const key = getHourMinuteKey(stat.date);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(stat.gachaLog);
  }

  return SummaryResultManager.of(grouped);
} 


class SummaryResultManager {
    sumaryResults: SummaryResult[];

    private constructor() {
        this.sumaryResults = [];
    }


    static of(grouped: Map<string, GachaLog[]>): SummaryResultManager {
        const result = new SummaryResultManager();

        for (const [time, group] of grouped.entries()) {
            result.sumaryResults.push(new SummaryResult(time, group));
        }

        result.sorting();

        return result;
    }

    private sorting(): void {
        this.sumaryResults.sort((a, b) => a.time.localeCompare(b.time));
    }

}

class SummaryResult {
    time: string;
    aCharacterTotal: GachaSummary;
    bCharacterTotal: GachaSummary;
    aWeaponTotal: GachaSummary;
    bWeaponTotal: GachaSummary;


    constructor(time: string, Logs: GachaLog[]) {
        this.time = time;
        this.aCharacterTotal = GachaSummary.of(Logs.map(log => log.aCharacter));
        this.bCharacterTotal = GachaSummary.of(Logs.map(log => log.bCharacter));
        this.aWeaponTotal = GachaSummary.of(Logs.map(log => log.aWeapon));
        this.bWeaponTotal = GachaSummary.of(Logs.map(log => log.bWeapon));
    }
}

class GachaSummary {
    totalSimulate: number;
    pickupPityAvg: number;
    winAvg: number;
    aTotal: number;
    winCount: number;

    private constructor() {
        this.totalSimulate = 0;
        this.pickupPityAvg = 0;
        this.winAvg = 0;
        this.aTotal = 0;
        this.winCount = 0;
    }


    static of(gachaResultLogs: GachaResultLog[]): GachaSummary {
        const summary = new GachaSummary();
        summary.init(gachaResultLogs);
        return summary;
    }

    private init(gachaResultLogs: GachaResultLog[]): void {
        this.totalSimulate = gachaResultLogs.length;
        this.pickupPityAvg = gachaResultLogs.reduce((sum, log) => sum + log.pickupPityCount, 0) / this.totalSimulate;
        this.winCount = gachaResultLogs.filter(log => log.isWin).length;
        this.winAvg = (this.winCount / this.totalSimulate) * 100;
        this.aTotal = gachaResultLogs.reduce((sum, log) => sum + log.aCount, 0);
    }
}

