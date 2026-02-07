"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollCharacter = rollCharacter;
const log_1 = require("../log/log");
const GachaTableGenerlator_1 = require("./GachaTableGenerlator");
const toPercent_1 = require("../util/toPercent");
const tableGenerlator = GachaTableGenerlator_1.GachaTableGenerlator.ofZZZCharacter();
function rollCharacter(state) {
    const table = tableGenerlator.createTable(state);
    log_1.Log.log(`${state.pullsSince + 1}번째 롤 테이블 확률: { S: ${(0, toPercent_1.toPercent)(table.sRate)}, A:${(0, toPercent_1.toPercent)(table.aRate)}, B: ${(0, toPercent_1.toPercent)(table.bRate)} }`);
    return table.roll(state);
}
