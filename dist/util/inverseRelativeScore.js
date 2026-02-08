"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inverseRelativeScore = inverseRelativeScore;
function inverseRelativeScore(value, min, max, maxScore) {
    if (min === max)
        return maxScore;
    return Math.round(maxScore * (max - value) / (max - min));
}
