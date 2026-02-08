import { GachaResult } from "../gachaSimulator/GachaResult"

export class SimulateResult {
    aCharacter: GachaResult
    aWeapon: GachaResult
    bCharacter: GachaResult
    bWeapon: GachaResult

    constructor(
        aCharacter: GachaResult,
        aWeapon: GachaResult,
        bCharacter: GachaResult,
        bWeapon: GachaResult
    ) {
        this.aCharacter = aCharacter;
        this.aWeapon = aWeapon;
        this.bCharacter = bCharacter;
        this.bWeapon = bWeapon;
    }
}