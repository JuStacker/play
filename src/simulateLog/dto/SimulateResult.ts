import { SimulateGachaResult as SimulateGachaResult } from "./SimulateGachaResult";

export interface SimulateResult {
    aCharacter: SimulateGachaResult;
    aWeapon: SimulateGachaResult;
    bCharacter: SimulateGachaResult;
    bWeapon: SimulateGachaResult;
}