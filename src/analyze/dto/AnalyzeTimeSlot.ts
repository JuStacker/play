import { SlotDto } from "../../timeSlot/dto/SlotDto";
import { round } from "../../util/rount";
import { AnalyzeTimeFormat } from "../format/AnalyzeTimeFormat";

export class AnalyzeTimeSlotDto {
  timeRange: string;
  score: number;
  avgPity: number;
  winRate: number;
  simCount: number;
  totalPityCount: number;
  totalWinCount: number;
  totalACount: number;

  static of(
    timeRange: string,
    score: number,
    slotDto: SlotDto,
  ): AnalyzeTimeSlotDto {
    const result = new AnalyzeTimeSlotDto();

    result.timeRange = timeRange;
    result.score = score;
    result.avgPity = slotDto.avgPity;
    result.winRate = slotDto.winRate;
    result.simCount = slotDto.simCount;
    result.totalPityCount = slotDto.totalPityCount;
    result.totalWinCount = slotDto.totalWinCount;
    result.totalACount = slotDto.totalACount;

    return result;
  }

  get analyzeTimeFormat(): AnalyzeTimeFormat {
    return {
      시간대: this.timeRange,
      점수: this.score,
      "픽업 평균 뽑기": round(this.avgPity),
      "반천장 승률": round(this.winRate),
      "시뮬레이션 횟수": this.simCount,
      "평균 A 갯수": round(this.totalACount / this.simCount),
    };
  }
}
