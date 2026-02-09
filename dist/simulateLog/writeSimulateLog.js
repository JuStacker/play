"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSimulateLog = writeSimulateLog;
const fs = __importStar(require("fs"));
const log_1 = require("../util/log");
function writeSimulateLog(filePath, date, result) {
    logToResult(result);
    fs.appendFileSync(filePath, `"${date.toISOString()}": ${JSON.stringify(result)}, \n`);
}
function logToResult(gachaLog) {
    log_1.Log.table({
        "A 캐릭터": toObj(gachaLog.aCharacter),
        "B 캐릭터": toObj(gachaLog.bCharacter),
        "A 무기": toObj(gachaLog.aWeapon),
        "B 무기": toObj(gachaLog.bWeapon),
    });
    function toObj(resultLog) {
        return {
            "픽업까지 뽑은 횟수": resultLog.pickupPityCount,
            "픽뚫 여부": resultLog.isWin ? "반천" : "픽뚫",
            "A등급 뽑은 횟수": resultLog.aCount,
        };
    }
}
