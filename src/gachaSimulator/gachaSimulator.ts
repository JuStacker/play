import { stat } from "fs";
import { json } from "stream/consumers";

// ---- 타입 정의 ----
type Rank = "S" | "A" | "B";

enum GachaResultType {
    S_Win,
    S_Lose,
    A,
    B
}

class RollResult {
    result: GachaResultType;

    private constructor(result: GachaResultType) {
        this.result = result;
    }

    
    static ofSWin(): RollResult {
        return new RollResult(GachaResultType.S_Win);
    }

    static ofLoseS(): RollResult {
        return new RollResult(GachaResultType.S_Lose);
    }

    static OfA(): RollResult {
        return new RollResult(GachaResultType.A);
    }

    static ofB(): RollResult {
        return new RollResult(GachaResultType.B);
    }
}

class GachaState {
  pullsSince: number;
  pullsSinceLastS: number;
  pullsSinceLastA: number;
  pullsSinceLosePickup: boolean;

  constructor() {
    this.pullsSince = 0;
    this.pullsSinceLastS = 0;
    this.pullsSinceLastA = 0;
    this.pullsSinceLosePickup = false;
  }

    isAGuaranteed(): boolean {
        return this.pullsSinceLastA >= 9;
    }

    hasPickupGuard(): boolean {
        return this.pullsSinceLosePickup;
    }

    pullCount(result: RollResult): void {
        if(result.result === GachaResultType.A) {
            this.pullsSinceLastA = 0;
            this.pullsSinceLastS += 1;
        }
        if(result.result === GachaResultType.S_Win) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = false;
        }
        if(result.result === GachaResultType.S_Lose) {
            this.pullsSinceLastS = 0;
            this.pullsSinceLastA = 0;
            this.pullsSinceLosePickup = true;
        }
        if(result.result === GachaResultType.B) {
            this.pullsSinceLastS += 1;
            this.pullsSinceLastA += 1;
        }
        this.pullsSince += 1;
    }
}

class ZZZGachaTable {
    sRate: number;
    aRate: number;
    bRate: number;
    private static SOFT_PITY_START = 75;
    private static HARD_PITY = 90;
    private static BASE_S_RATE = 0.006; // 0.6%
    private static BASE_A_RATE = 0.072; // 7.2%

    private constructor(sRate: number, aRate: number, bRate: number) {
        this.sRate = sRate;
        this.aRate = aRate;
        this.bRate = bRate;
    }

    static create(state: GachaState): ZZZGachaTable {
         const sRate = this.getSRate(state.pullsSinceLastS);

        // A 보장 상태 → B 제거
        if (state.isAGuaranteed()) {
            const result = new ZZZGachaTable(sRate, 1 - sRate, 0)
            result.check();
            return result;
        }

        // 일반 테이블
        let aRate = this.BASE_A_RATE;
        let bRate = 1 - sRate - aRate;

        // S 확률이 커져서 넘치면 A부터 감소
        if (bRate < 0) {
            aRate += bRate; // bRate는 음수 → A 감소
            bRate = 0;
        }

        const result = new ZZZGachaTable(sRate, aRate, bRate);
        result.check();
        return result;
    }

    // ---- S 확률 계산 (소프트 천장) ----
    private static getSRate(pullsSinceLastS: number): number {
        const pullSince = pullsSinceLastS + 1;

        if (pullSince < 75) {
            return this.BASE_S_RATE;
        }

        if (pullSince >= 90) {
            return 1.0;
        }

        // 75 ~ 90 구간
        const progress = ((pullSince -this.SOFT_PITY_START) + 1) / (this.HARD_PITY - this.SOFT_PITY_START);
        // 0 → 1 사이 값

        return this.BASE_S_RATE + progress * (1 - this.BASE_S_RATE);
    }

    private check() {
        if(this.sRate + this.aRate + this.bRate !== 1) {
            throw new Error("확률 합이 100이 아님" + JSON.stringify({ cause: { sRate: this.sRate, aRate: this.aRate, bRate: this.bRate } }));
        }
    }

}

class GachaResult {
    logs: GachaResultType[];
    constructor() {
        this.logs = [];
    }

    addRollResult(result: RollResult): void {
        this.logs.push(result.result);
    }
}

// ---- 추첨 ----
function roll(state: GachaState): RollResult {
  const r = Math.random();
  const table = ZZZGachaTable.create(state);
  const sRate = table.sRate;
  const aRate = sRate + table.aRate;

  let result = RollResult.ofB();

//   console.log(`랜덤값: ${toPercent(r)}, 롤 확률: { S: ${toPercent(sRate)}, A: ${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);

  if (r < sRate) {
    if (state.hasPickupGuard()) return RollResult.ofSWin();
    const pickupRandom = Math.random();
    // 픽뚧
    if (pickupRandom > 0.5) {
        result = RollResult.ofLoseS();
    } else {
        result = RollResult.ofSWin();
    }
  } else if (r < aRate) {
    result = RollResult.OfA();
  }

  state.pullCount(result);
  return result;
}

// ---- 테스트 실행 ----
export function gachaSimulator(): void {
    console.log("캐릭터 가챠 시뮬레이터 시작");
    const result1 = chararcterGacha();
    const result2 = chararcterGacha();
}

function chararcterGacha(): GachaResult {
    const state = new GachaState();
    const result = new GachaResult();

    for(let i = 0; i < 160; i++) {
        const table = ZZZGachaTable.create(state);
        console.log(`${i + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
        const rollResult = roll(state);
        result.addRollResult(rollResult);
        // console.log(`  → 결과: ${GachaResultType[rollResult.result]}`);

        if(rollResult.result === GachaResultType.S_Win) break;
    }

    console.log("최종 결과 로그:", result.logs.map(r => GachaResultType[r]).join(", "));

    return result;
}


function toPercent(value: number): string {
    return (value * 100).toFixed(2) + "%";
}