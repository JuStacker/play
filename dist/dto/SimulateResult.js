"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateResult = void 0;
class SimulateResult {
    constructor(aCharacter, aWeapon, bCharacter, bWeapon) {
        this.aCharacter = aCharacter;
        this.aWeapon = aWeapon;
        this.bCharacter = bCharacter;
        this.bWeapon = bWeapon;
    }
    static of({ aCharacter, aWeapon, bCharacter, bWeapon }) {
        return new SimulateResult(aCharacter, aWeapon, bCharacter, bWeapon);
    }
}
exports.SimulateResult = SimulateResult;
