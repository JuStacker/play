"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const Enviroment_1 = require("./Enviroment");
const simlateForGacha_1 = require("./simulate/simlateForGacha");
/**
 * 어떤 시간대에 최적의 값이 나오는지 가챠 시뮬레이터를 만들어서 저장하기
 * 요구사항
 * - 픽업, 복각 두개를 고려하여 캐릭터/무기 뽑기 시뮬레이션을 2개 돌린다.
 * - 결과는 픽업이 나오기까지 횟수, 픽뚫 여부, A/B 나온 횟수를 기존으로 한다.
 * - 가챠는 73회까지는 0.6% 고정확률 74회부터 확률보정, 90회 천장 74-90회 구간에 확률 보정이 선형적
 */
main(Enviroment_1.Eniviroment.GACHA_LOG_V2_PATH);
function main(logPath, date = new Date()) {
    (0, simlateForGacha_1.simlateForGacha)(logPath, date);
}
