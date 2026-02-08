"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotDto = void 0;
class SlotDto {
    constructor(simCount, totalPityCount, totalWinCount, totalACount) {
        this.simCount = simCount;
        this.totalPityCount = totalPityCount;
        this.totalWinCount = totalWinCount;
        this.totalACount = totalACount;
        this.updateAverge();
    }
    static of(slotFormat) {
        return new SlotDto(slotFormat.simCount, slotFormat.totalPityCount, slotFormat.totalWinCount, slotFormat.totalACount);
    }
    updateAverge() {
        this.avgPity = this.totalPityCount / this.simCount;
        this.winRate = (this.totalWinCount / this.simCount) * 100;
    }
    static empty() {
        return new SlotDto(0, 0, 0, 0);
    }
    addBySimulateReuslt(simGachaReuslt) {
        ++this.simCount;
        this.totalPityCount += simGachaReuslt.pickupPityCount;
        this.totalWinCount += simGachaReuslt.isWin ? 1 : 0;
        this.totalACount += simGachaReuslt.aCount;
        this.updateAverge();
    }
    toSlotFormat() {
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
exports.SlotDto = SlotDto;
