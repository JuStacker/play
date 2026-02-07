"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHourKey = getHourKey;
function getHourKey(date) {
    const hours = date.getHours(); // ✅ 한국 시간 기준
    const hh = String(hours).padStart(2, '0');
    return `${hh}:00`;
}
