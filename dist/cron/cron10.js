"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const log_1 = require("../util/log");
const main_1 = require("../main");
const Enviroment_1 = require("../Enviroment");
log_1.Log.log("cron app started");
// 10분마다 실행
node_cron_1.default.schedule("*/10 * * * *", () => {
    const now = new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
    });
    (0, main_1.main)(Enviroment_1.Eniviroment.LOCAL_GACHA_LOG_V2_PATH);
});
// 프로세스 유지
process.stdin.resume();
