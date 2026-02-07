import fs from "fs";
import { Log } from "../log/log";
import { GachaResultType } from "./GachaResultType";
import { GachaState } from "./GachaState";
import { RollResult } from "./RollResult";
import { GachaTableGenerlator } from "./GachaTableGenerlator";
import { GachaResultLog } from "../log/dto/GachaResultLog";
import { toPercent } from "../util/toPercent";


const tableGenerlator = GachaTableGenerlator.ofZZZCharacter();

export function rollCharacter(state: GachaState): RollResult {
    const table = tableGenerlator.createTable(state);
    Log.log(`${state.pullsSince + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
    return table.roll(state);
}
