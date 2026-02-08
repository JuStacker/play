"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = round;
function round(value, roundLine = 1) {
    const roundUp = 10 ** roundLine;
    return Math.round(value * roundUp) / roundUp;
}
