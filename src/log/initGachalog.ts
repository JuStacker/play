import { readGachaV2Log } from "../util/readGachaV2Log";
import { Log } from "./log";

const GACHA_V2_LOG_PATH = "zzzGachaV2.txt";

/**
 * 시간별 요약 정보를 업데이트 시키기
 */
export function initGachalog(): void {
    const gachaLogs = readGachaV2Log(GACHA_V2_LOG_PATH);
    Log.log(gachaLogs);
}