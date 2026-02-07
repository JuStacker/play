import { Log } from "../log/log";
import { toPercent } from "../util/toPercent";
import { GachaState } from "./GachaState";
import { GachaTableGenerlator } from "./GachaTableGenerlator";
import { RollResult } from "./RollResult";

const tableGenerlator = GachaTableGenerlator.ofZZZWeapon();
    
export function rollWeapon(state: GachaState): RollResult {
    const table = tableGenerlator.createTable(state);
    Log.log(`${state.pullsSince + 1}번째 롤 테이블 확률: { S: ${toPercent(table.sRate)}, A:${toPercent(table.aRate)}, B: ${toPercent(table.bRate)} }`);
    
    return table.roll(state); 
}