import { GachaResult } from "../gachaSimulator/GachaResult";
import { SimulateGachaResult } from "../simulateLog/dto/SimulateGachaResult";

export class SimulateResult {
  aCharacter: SimulateGachaResult;
  aWeapon: SimulateGachaResult;
  bCharacter: SimulateGachaResult;
  bWeapon: SimulateGachaResult;

  constructor(
    aCharacter: SimulateGachaResult,
    aWeapon: SimulateGachaResult,
    bCharacter: SimulateGachaResult,
    bWeapon: SimulateGachaResult,
  ) {
    this.aCharacter = aCharacter;
    this.aWeapon = aWeapon;
    this.bCharacter = bCharacter;
    this.bWeapon = bWeapon;
  }

  static of({ aCharacter, aWeapon, bCharacter, bWeapon }) {
    return new SimulateResult(aCharacter, aWeapon, bCharacter, bWeapon);
  }
}
