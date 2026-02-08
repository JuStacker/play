"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeScore = relativeScore;
function relativeScore(value, min, max, maxScore) {
    if (min === max)
        return maxScore;
    return Math.round((maxScore * (value - min)) / (max - min));
}
