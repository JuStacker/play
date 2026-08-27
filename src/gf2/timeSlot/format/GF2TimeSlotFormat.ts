import { SlotFormat } from "../../../timeSlot/format/SlotFormat";

export interface GF2TimeSlotFormat {
	character1: { [key: string]: SlotFormat };
	character1Weapon1: { [key: string]: SlotFormat };
	character2Weapon1: { [key: string]: SlotFormat };
	character4Weapon1: { [key: string]: SlotFormat };
	character4: { [key: string]: SlotFormat };
	character6Weapon1: { [key: string]: SlotFormat };
}
