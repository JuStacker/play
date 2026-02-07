export interface TimeSlotFormate {
    A_CHARACTER : { [key: string]: Format },
    AB_CHARACTER : { [key: string]: Format },
    AB_CHARACTER_A_WEAPON : { [key: string]: Format },
    AB_CHARACTER_AB_WEAPON : { [key: string]: Format },
}

type Format = {avgPity: number, winRate: number, simCount: number };