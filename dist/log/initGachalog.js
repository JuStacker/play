"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGachalog = initGachalog;
const readGachaV2Log_1 = require("../util/readGachaV2Log");
const log_1 = require("./log");
const GACHA_V2_LOG_PATH = "zzzGachaV2.txt";
/**
 * 시간별 요약 정보를 업데이트 시키기
 */
function initGachalog() {
    const gachaLogs = (0, readGachaV2Log_1.readGachaV2Log)(GACHA_V2_LOG_PATH);
    log_1.Log.log(gachaLogs);
}
