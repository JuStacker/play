import { SlotDto } from "../dto/SlotDto";
import { SlotFormat } from "./SlotFormat";

export interface TimeSlotFormat {
  aCharacter: { [key: string]: SlotFormat },
  abCharacter: { [key: string]: SlotFormat },
  abCharacterAWeapon: { [key: string]: SlotFormat },
  abCharacterAbWeapon: { [key: string]: SlotFormat },
}