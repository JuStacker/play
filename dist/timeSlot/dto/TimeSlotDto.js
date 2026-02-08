"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotDto = void 0;
const SlotDto_1 = require("./SlotDto");
const toTimeSlot_1 = require("../../util/toTimeSlot");
class TimeSlotDto {
    constructor() {
        this.aCharacter = new Map();
        this.abCharacter = new Map();
        this.abCharacterAWeapon = new Map();
        this.abCharacterAbWeapon = new Map();
    }
    static of(timeSlotFormat) {
        const result = new TimeSlotDto();
        for (const [range, slotFormat] of Object.entries(timeSlotFormat.aCharacter)) {
            result.aCharacter.set(range, SlotDto_1.SlotDto.of(slotFormat));
        }
        for (const [range, slotFormat] of Object.entries(timeSlotFormat.abCharacter)) {
            result.abCharacter.set(range, SlotDto_1.SlotDto.of(slotFormat));
        }
        for (const [range, slotFormat] of Object.entries(timeSlotFormat.abCharacterAWeapon)) {
            result.abCharacterAWeapon.set(range, SlotDto_1.SlotDto.of(slotFormat));
        }
        for (const [range, slotFormat] of Object.entries(timeSlotFormat.abCharacterAbWeapon)) {
            result.abCharacterAbWeapon.set(range, SlotDto_1.SlotDto.of(slotFormat));
        }
        return result;
    }
    static ofSimulateLogDtos(simulateLogDtos) {
        const result = new TimeSlotDto();
        for (const simulateLogDto of simulateLogDtos) {
            const timeRange = simulateLogDto.timeRange;
            this.addSimulateGacha(result.aCharacter, timeRange, simulateLogDto.result.aCharacter);
            this.addSimulateGacha(result.abCharacter, timeRange, simulateLogDto.result.aCharacter);
            this.addSimulateGacha(result.abCharacter, timeRange, simulateLogDto.result.bCharacter);
            this.addSimulateGacha(result.abCharacterAWeapon, timeRange, simulateLogDto.result.aCharacter);
            this.addSimulateGacha(result.abCharacterAWeapon, timeRange, simulateLogDto.result.bCharacter);
            this.addSimulateGacha(result.abCharacterAWeapon, timeRange, simulateLogDto.result.aWeapon);
            this.addSimulateGacha(result.abCharacterAbWeapon, timeRange, simulateLogDto.result.aCharacter);
            this.addSimulateGacha(result.abCharacterAbWeapon, timeRange, simulateLogDto.result.bCharacter);
            this.addSimulateGacha(result.abCharacterAbWeapon, timeRange, simulateLogDto.result.aWeapon);
            this.addSimulateGacha(result.abCharacterAbWeapon, timeRange, simulateLogDto.result.bWeapon);
        }
        return result;
    }
    get timeSlotFormate() {
        const result = {
            aCharacter: {},
            abCharacter: {},
            abCharacterAWeapon: {},
            abCharacterAbWeapon: {},
        };
        for (const [timeRange, slotDto] of this.aCharacter.entries()) {
            result.aCharacter[timeRange] = slotDto.toSlotFormat();
        }
        for (const [timeRange, slotDto] of this.abCharacter.entries()) {
            result.abCharacter[timeRange] = slotDto.toSlotFormat();
        }
        for (const [timeRange, slotDto] of this.abCharacterAWeapon.entries()) {
            result.abCharacterAWeapon[timeRange] = slotDto.toSlotFormat();
        }
        for (const [timeRange, slotDto] of this.abCharacterAbWeapon.entries()) {
            result.abCharacterAbWeapon[timeRange] = slotDto.toSlotFormat();
        }
        return result;
    }
    addSimulate(date, simulateResult) {
        const timeRange = (0, toTimeSlot_1.toTimeSlot)(date.toISOString());
        TimeSlotDto.addSimulateGacha(this.aCharacter, timeRange, simulateResult.aCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacter, timeRange, simulateResult.aCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacter, timeRange, simulateResult.bCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacterAWeapon, timeRange, simulateResult.aCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacterAWeapon, timeRange, simulateResult.bCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacterAWeapon, timeRange, simulateResult.aWeapon);
        TimeSlotDto.addSimulateGacha(this.abCharacterAbWeapon, timeRange, simulateResult.aCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacterAbWeapon, timeRange, simulateResult.bCharacter);
        TimeSlotDto.addSimulateGacha(this.abCharacterAbWeapon, timeRange, simulateResult.aWeapon);
        TimeSlotDto.addSimulateGacha(this.abCharacterAbWeapon, timeRange, simulateResult.bWeapon);
    }
    static addSimulateGacha(target, timeRange, simulateGachaResult) {
        if (!target.has(timeRange)) {
            target.set(timeRange, SlotDto_1.SlotDto.empty());
        }
        target.get(timeRange).addBySimulateReuslt(simulateGachaResult);
    }
}
exports.TimeSlotDto = TimeSlotDto;
