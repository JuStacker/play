import fs from "fs";
import { Eniviroment } from "../../Enviroment";
import { GF2SimulateResult } from "../dto/GF2SimulateResult";
import { GF2SimulateLogDto } from "./dto/GF2SimulateLogDto";

export function readGF2SimulateLog(
	path: string = Eniviroment.GF2_GACHA_LOG_PATH,
): GF2SimulateLogDto[] {
	const results: GF2SimulateLogDto[] = [];
	const logString: string = fs.readFileSync(path, "utf-8");

	logString
		.replaceAll("\r", "")
		.split("\n")
		.forEach((log) => {
			if (log.length == 0) {
				return;
			}

			const jsonString = `{${log.substring(0, log.lastIndexOf(","))}}`;
			const [[dateString, simulateResultJson]] = Object.entries(
				JSON.parse(jsonString),
			) as any;
			results.push(
				new GF2SimulateLogDto(
					new Date(dateString),
					GF2SimulateResult.of(simulateResultJson),
				),
			);
		});
	return results;
}
