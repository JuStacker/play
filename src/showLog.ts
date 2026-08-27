import * as fs from "fs";
import * as path from "path";
import { SignalStat } from "./log/signalStat";
import { readFile } from "./log/readFile";
import { SummaryResult } from "./log/SummaryResult";
import { getHourKey } from "./util/getHourKey";
import { getHourMinuteKey } from "./util/getHourMinuteKey";

// 파일 경로 설정 (현재 파일 기준으로 같은 디렉토리의 example.txt)
const filePath = path.join("results.txt");

showLog();

function showLog() {
	const signalStats = readFile(filePath);
	const summary = summarizeByHourMinute(signalStats);
	const summaryByHour = summarizeByHour(signalStats);

	console.log("시간대 목록:");
	console.table(summaryByHour);

	// 출력
	console.log("🔥 추천 분대 목록:");
	console.table(getRecommendation(summary, 10));

	// 출력
	console.log("🔥 추천 시대 목록:");
	console.table(getRecommendation(summaryByHour, 10));

	writeHtmlReport([
		{ title: "시간대 목록", data: summaryByHour },
		{ title: "🔥 추천 분대 목록", data: getRecommendation(summary, 10) },
		{ title: "🔥 추천 시대 목록", data: getRecommendation(summaryByHour, 10) },
	]);
}

function formatKst(date: Date): string {
	const parts = new Intl.DateTimeFormat("ko-KR", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).formatToParts(date);
	const get = (type: string) => parts.find((p) => p.type === type)!.value;
	return `${get("year")}년 ${get("month")}월 ${get("day")}일(${get("weekday")}) ${get("hour")}:${get("minute")}`;
}

function toHtmlTable(data: object[]): string {
	if (data.length === 0) return "<p>데이터 없음</p>";
	const headers = Object.keys(data[0]);
	const thead = headers.map((h) => `<th>${h}</th>`).join("");
	const rows = data
		.map(
			(row) =>
				`<tr>${headers.map((h) => `<td>${(row as Record<string, unknown>)[h]}</td>`).join("")}</tr>`,
		)
		.join("\n");
	return `<table><thead><tr>${thead}</tr></thead><tbody>${rows}</tbody></table>`;
}

function writeHtmlReport(sections: { title: string; data: object[] }[]) {
	const now = new Date();
	const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>Show Log</title>
<style>
:root {
	--bg: #0d1117;
	--panel: #161b22;
	--border: #30363d;
	--text: #e6edf3;
	--muted: #8b949e;
	--accent: #58a6ff;
	--row-hover: #1f2733;
}
* { box-sizing: border-box; }
body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif;
	background: var(--bg);
	color: var(--text);
	margin: 0;
	padding: 2rem 1.5rem 4rem;
}
h1, h2 { margin: 0 0 1rem; }
h1 { font-size: 1.4rem; }
h2 {
	font-size: 1.1rem;
	color: var(--accent);
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.5rem;
	margin-top: 2.5rem;
}
.updated { color: var(--muted); font-size: 0.85rem; margin-bottom: 2rem; }
.container { max-width: 960px; margin: 0 auto; }
.table-wrap {
	background: var(--panel);
	border: 1px solid var(--border);
	border-radius: 8px;
	overflow-x: auto;
}
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; white-space: nowrap; }
th, td { padding: 8px 14px; text-align: right; }
th {
	background: #1c2128;
	color: var(--muted);
	font-weight: 600;
	position: sticky;
	top: 0;
}
tbody tr { border-top: 1px solid var(--border); }
tbody tr:hover { background: var(--row-hover); }
td:first-child, th:first-child { text-align: left; }
</style>
</head>
<body>
<div class="container">
<h1>ShowLog Report</h1>
<p class="updated">업데이트: ${formatKst(now)} <span id="relative" data-generated="${now.toISOString()}"></span></p>
<script>
(function () {
	const el = document.getElementById("relative");
	const generated = new Date(el.dataset.generated).getTime();
	function render() {
		const diffMin = Math.floor((Date.now() - generated) / 60000);
		let text;
		if (diffMin < 1) text = "방금 전";
		else if (diffMin < 60) text = diffMin + "분 전";
		else if (diffMin < 60 * 24) text = Math.floor(diffMin / 60) + "시간 전";
		else text = Math.floor(diffMin / (60 * 24)) + "일 전";
		el.textContent = "(" + text + ")";
	}
	render();
	setInterval(render, 30000);
})();
</script>
${sections
	.map(
		(s) =>
			`<h2>${s.title}</h2><div class="table-wrap">${toHtmlTable(s.data)}</div>`,
	)
	.join("\n")}
</div>
</body>
</html>`;

	fs.mkdirSync("docs", { recursive: true });
	fs.writeFileSync(path.join("docs", "index.html"), html);
}

/**
 * 시:분(10분 단위) 기준으로 SignalStat들을 그룹화하고 요약 통계 생성
 */
function summarizeByHourMinute(stats: SignalStat[]): SummaryResult[] {
	const grouped = new Map<string, SignalStat[]>();

	for (const stat of stats) {
		const key = getHourMinuteKey(stat.date);
		if (!grouped.has(key)) {
			grouped.set(key, []);
		}
		grouped.get(key)!.push(stat);
	}

	const result: SummaryResult[] = [];

	for (const [time, group] of grouped.entries()) {
		const sCountTotal = group.reduce((sum, s) => sum + s.sCount, 0);
		const sCountAvg = sCountTotal / group.length;
		const sSignalCount = group.length;
		const sWinCount = group.reduce((sum, s) => sum + s.sWinCount, 0);
		result.push({
			time,
			sCountTotal,
			sCountAvg,
			sSignalCount,
			sWinCount,
			sWinAvg: (sWinCount / sCountTotal) * 100,
		});
	}

	// 시:분 문자열 기준 정렬
	result.sort((a, b) => a.time.localeCompare(b.time));

	return result;
}

function summarizeByHour(stats: SignalStat[]): SummaryResult[] {
	const grouped = new Map<string, SignalStat[]>();

	for (const stat of stats) {
		const key = getHourKey(stat.date);
		if (!grouped.has(key)) {
			grouped.set(key, []);
		}
		grouped.get(key)!.push(stat);
	}

	const result: SummaryResult[] = [];

	for (const [time, group] of grouped.entries()) {
		const sCountTotal = group.reduce((sum, s) => sum + s.sCount, 0);
		const sCountAvg = sCountTotal / group.length;
		const sSignalCount = group.length;
		const sWinCount = group.reduce((sum, s) => sum + s.sWinCount, 0);
		result.push({
			time,
			sCountTotal,
			sCountAvg,
			sSignalCount,
			sWinCount,
			sWinAvg: (sWinCount / sCountTotal) * 100,
		});
	}

	// 시:분 문자열 기준 정렬
	result.sort((a, b) => a.time.localeCompare(b.time));

	return result;
}

// 점수 계산 함수
function scoreTime(
	d: SummaryResult,
	{ maxAvg, maxWinRate, maxSignals },
): number {
	const avg = d.sCountAvg;
	const sWinRate = d.sWinAvg;
	const signals = d.sSignalCount;

	const normAvg = avg / maxAvg; // 0~1 정규화
	const normWinRate = sWinRate / maxWinRate;
	const normSignals = signals / maxSignals;

	// 가중합 (비율은 필요에 따라 조절 가능)
	const score = normAvg * 0.01 + normWinRate * 0.5 + normSignals * 0.4;
	return score * 100;
}

function getRecommendation(data: SummaryResult[], maxCount: number = 10) {
	const maxWinRate = Math.max(...data.map((d) => d.sWinAvg || 0));
	const maxAvg = Math.max(...data.map((d) => d.sCountAvg || 0));
	const maxSignals = Math.max(...data.map((d) => d.sSignalCount || 0));

	return data
		.map((d) => ({
			...d,
			score: scoreTime(d, { maxAvg, maxWinRate, maxSignals }),
		}))
		.sort((a, b) => b.score - a.score)
		.map((d) => {
			return {
				시간대: d.time,
				시뮬레이션수: d.sSignalCount,
				평균S갯수: fl(d.sCountAvg),
				"반천장 승률": fl(d.sWinAvg),
				총S갯수: d.sCountTotal,
				"반천장 승리 수": d.sWinCount,
				점수: Math.floor(d.score),
			};
		})
		.slice(0, maxCount);
}

function fl(num: number): number {
	return Math.floor(num * 100) / 100;
}
