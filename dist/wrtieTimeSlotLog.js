"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTimeSlotLog = writeTimeSlotLog;
const fs_1 = __importDefault(require("fs"));
const GACHA_LOG_PATH = "zzzGachaV2.txt";
const SCENARIOS = {
    A_CHARACTER: s => [s.aCharacter],
    AB_CHARACTER: s => [s.aCharacter, s.bCharacter],
    AB_CHARACTER_A_WEAPON: s => [s.aCharacter, s.bCharacter, s.aWeapon],
    AB_CHARACTER_AB_WEAPON: s => [
        s.aCharacter,
        s.bCharacter,
        s.aWeapon,
        s.bWeapon,
    ],
};
function readGachaLog(filePath) {
    const result = {};
    const logString = fs_1.default.readFileSync(filePath, 'utf-8');
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
        if (log.length == 0) {
            return;
        }
        const jsonString = `{${log.substring(0, log.lastIndexOf(','))}}`;
        const [[dateString, gachaLog]] = Object.entries(JSON.parse(jsonString));
        result[dateString] = gachaLog;
    });
    return result;
}
/* ================= 유틸 ================= */
function toTimeSlot(iso) {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, '0');
    const m = Math.floor(d.getMinutes() / 10) * 10;
    const mm = m.toString().padStart(2, '0');
    return `${h}:${mm}~${h}:${(m + 9).toString().padStart(2, '0')}`;
}
function calcStats(results, simCount) {
    const avgPity = results.reduce((a, b) => a + b.pickupPityCount, 0) / results.length;
    const winRate = results.filter(r => r.isWin).length / results.length;
    return { avgPity, winRate, simCount };
}
writeTimeSlotLog();
function writeTimeSlotLog() {
    const rawData = readGachaLog(GACHA_LOG_PATH);
    const result = {
        A_CHARACTER: {},
        AB_CHARACTER: {},
        AB_CHARACTER_A_WEAPON: {},
        AB_CHARACTER_AB_WEAPON: {}
    };
    const slotMap = new Map();
    for (const scKey of Object.keys(result)) {
        for (const [time, sim] of Object.entries(rawData)) {
            const slot = toTimeSlot(time);
            const targets = SCENARIOS[scKey](sim);
            if (!slotMap.has(slot)) {
                slotMap.set(slot, { results: [], count: 0 });
            }
            const bucket = slotMap.get(slot);
            bucket.results.push(...targets);
            bucket.count++;
        }
        [...slotMap.entries()].forEach(([slot, v]) => {
            result[scKey][slot] = calcStats(v.results, v.count);
        });
    }
    const stats = [...slotMap.entries()].map(([slot, v]) => {
        const base = calcStats(v.results, v.count);
        return { 시간대: slot, ...base };
    });
    fs_1.default.writeFileSync('zzzGachaV2-time-slot.json', JSON.stringify(result), 'utf-8');
}
