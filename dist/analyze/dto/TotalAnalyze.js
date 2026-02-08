"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalAnalyze = void 0;
class TotalAnalyze {
    constructor() {
        this.minAvgPity = 0;
        this.maxAvgPity = 0;
        this.minWinRate = 0;
        this.maxWinRate = 0;
        this.minSimCount = 0;
        this.maxSimCount = 0;
    }
    updateBySlotDto(slotDto) {
        if (slotDto.avgPity < this.minAvgPity)
            this.minAvgPity = slotDto.avgPity;
        if (slotDto.avgPity > this.maxAvgPity)
            this.maxAvgPity = slotDto.avgPity;
        if (slotDto.winRate < this.minWinRate)
            this.minWinRate = slotDto.winRate;
        if (slotDto.winRate > this.maxWinRate)
            this.maxWinRate = slotDto.winRate;
        if (slotDto.simCount < this.minSimCount)
            this.minSimCount = slotDto.simCount;
        if (slotDto.simCount > this.maxSimCount)
            this.maxSimCount = slotDto.simCount;
    }
}
exports.TotalAnalyze = TotalAnalyze;
