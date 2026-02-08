import { SlotDto } from "../../timeSlot/dto/SlotDto";

export class TotalAnalyze {
    minAvgPity: number = 0;
    maxAvgPity: number = 0;
    minWinRate: number = 0;
    maxWinRate: number = 0;
    minSimCount: number = 0;
    maxSimCount: number = 0;

    constructor() {}

    updateBySlotDto(slotDto: SlotDto) {
        if(slotDto.avgPity < this.minAvgPity) this.minAvgPity = slotDto.avgPity;
        if(slotDto.avgPity > this.maxAvgPity) this.maxAvgPity = slotDto.avgPity; 
        if(slotDto.winRate < this.minWinRate) this.minWinRate = slotDto.winRate;
        if(slotDto.winRate > this.maxWinRate) this.maxWinRate = slotDto.winRate;
        if(slotDto.simCount < this.minSimCount) this.minSimCount = slotDto.simCount;
        if(slotDto.simCount > this.maxSimCount) this.maxSimCount = slotDto.simCount;
    }

}