"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeTimeSlotDto = void 0;
const rount_1 = require("../../util/rount");
class AnalyzeTimeSlotDto {
    static of(timeRange, score, slotDto) {
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
    get analyzeTimeFormat() {
        return {
            시간대: this.timeRange,
            점수: this.score,
            "픽업 평균 뽑기": (0, rount_1.round)(this.avgPity),
            "반천장 승률": (0, rount_1.round)(this.winRate),
            "시뮬레이션 횟수": this.simCount,
            "평균 A 갯수": (0, rount_1.round)(this.totalACount / this.simCount),
        };
    }
}
exports.AnalyzeTimeSlotDto = AnalyzeTimeSlotDto;
