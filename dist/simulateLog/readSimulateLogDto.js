"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSimulateLog = readSimulateLog;
const fs_1 = __importDefault(require("fs"));
const Enviroment_1 = require("../Enviroment");
const SimulateLog_1 = require("./dto/SimulateLog");
const SimulateResult_1 = require("../dto/SimulateResult");
function readSimulateLog(path = Enviroment_1.Eniviroment.GACHA_LOG_V2_PATH) {
    const results = [];
    const logString = fs_1.default.readFileSync(path, 'utf-8');
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
        if (log.length == 0) {
            return;
        }
        const jsonString = `{${log.substring(0, log.lastIndexOf(','))}}`;
        const [[dateString, simulateResultJson]] = Object.entries(JSON.parse(jsonString));
        results.push(new SimulateLog_1.SimulateLogDto(new Date(dateString), SimulateResult_1.SimulateResult.of(simulateResultJson)));
    });
    return results;
}
