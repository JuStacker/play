"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollWeapon = rollWeapon;
const log_1 = require("../util/log");
const toPercent_1 = require("../util/toPercent");
const GachaTableGenerlator_1 = require("./GachaTableGenerlator");
const tableGenerlator = GachaTableGenerlator_1.GachaTableGenerlator.ofZZZWeapon();
function rollWeapon(state) {
    const table = tableGenerlator.createTable(state);
    log_1.Log.log(`${state.pullsSince + 1}번째 롤 테이블 확률: { S: ${(0, toPercent_1.toPercent)(table.sRate)}, A:${(0, toPercent_1.toPercent)(table.aRate)}, B: ${(0, toPercent_1.toPercent)(table.bRate)} }`);
    return table.roll(state);
}
