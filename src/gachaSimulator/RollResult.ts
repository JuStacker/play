import { GachaResultType } from "./GachaResultType";

export class RollResult {
    result: GachaResultType;

    private constructor(result: GachaResultType) {
        this.result = result;
    }

    
    static ofSWin(): RollResult {
        return new RollResult(GachaResultType.S_Win);
    }

    static ofLoseS(): RollResult {
        return new RollResult(GachaResultType.S_Lose);
    }

    static ofA(): RollResult {
        return new RollResult(GachaResultType.A);
    }

    static ofB(): RollResult {
        return new RollResult(GachaResultType.B);
    }
}