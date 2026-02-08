import { SimulateGachaResult } from "../../simulateLog/dto/SimulateGachaResult";
import { SlotFormat } from "../format/SlotFormat";

export class SlotDto {
  avgPity: number;
  winRate: number;
  simCount: number;
  totalPityCount: number;
  totalWinCount: number;
  totalACount: number;

  constructor(
    simCount: number,
    totalPityCount: number,
    totalWinCount: number,
    totalACount: number,
  ) {
    this.simCount = simCount;
    this.totalPityCount = totalPityCount;
    this.totalWinCount = totalWinCount;
    this.totalACount = totalACount;
    this.updateAverge();
  }

  static of(slotFormat: SlotFormat) {
    return new SlotDto(
      slotFormat.simCount,
      slotFormat.totalPityCount,
      slotFormat.totalWinCount,
      slotFormat.totalACount,
    );
  }

  private updateAverge(): void {
    this.avgPity = this.totalPityCount / this.simCount;
    this.winRate = (this.totalWinCount / this.simCount) * 100;
  }

  static empty(): SlotDto {
    return new SlotDto(0, 0, 0, 0);
  }

  addBySimulateReuslt(simGachaReuslt: SimulateGachaResult) {
    ++this.simCount;
    this.totalPityCount += simGachaReuslt.pickupPityCount;
    this.totalWinCount += simGachaReuslt.isWin ? 1 : 0;
    this.totalACount += simGachaReuslt.aCount;
    this.updateAverge();
  }

  toSlotFormat(): SlotFormat {
    return {
      avgPity: this.avgPity,
      winRate: this.winRate,
      simCount: this.simCount,
      totalPityCount: this.totalPityCount,
      totalWinCount: this.totalWinCount,
      totalACount: this.totalACount,
    };
  }
}
