import * as fs from "fs";
import { Log } from "../../util/log";
import { GF2SimulateResult } from "../dto/GF2SimulateResult";
import { SimulateGachaResult } from "../../simulateLog/dto/SimulateGachaResult";

export function writeGF2SimulateLog(
	filePath: string,
	date: Date,
	result: GF2SimulateResult,
): void {
	logToResult(result);

	fs.appendFileSync(
		filePath,
		`"${date.toISOString()}": ${JSON.stringify(result)}, \n`,
	);
}

function logToResult(gachaLog: GF2SimulateResult): void {
	Log.table({
		캐릭터1: toObj(gachaLog.character1),
		무기1: toObj(gachaLog.weapon1),
		캐릭터2: toObj(gachaLog.character2),
		무기2: toObj(gachaLog.weapon2),
		캐릭터4: toObj(gachaLog.character4),
		무기4: toObj(gachaLog.weapon4),
		캐릭터7: toObj(gachaLog.character7),
		무기7: toObj(gachaLog.weapon7),
	});

	function toObj(resultLog: SimulateGachaResult): object {
		return {
			"픽업까지 뽑은 횟수": resultLog.pickupPityCount,
			"픽뚫 여부": resultLog.isWin ? "픽업" : "픽뚫",
			"A등급 뽑은 횟수": resultLog.aCount,
		};
	}
}
