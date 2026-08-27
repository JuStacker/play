import * as fs from "fs";
import * as path from "path";
import { ReportSection } from "../analyze/analyzeByTimeSlot";

export interface GameReportGroup {
	game: string;
	sections: ReportSection[];
}

interface GameTheme {
	icon: string;
	accent: string;
	accentSoft: string;
}

const GAME_THEME: Record<string, GameTheme> = {
	ZZZ: { icon: "⚡", accent: "#58a6ff", accentSoft: "#58a6ff26" },
	GF2: { icon: "🔫", accent: "#ff9f43", accentSoft: "#ff9f4326" },
};

const DEFAULT_THEME: GameTheme = {
	icon: "🎲",
	accent: "#8b949e",
	accentSoft: "#8b949e26",
};

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

function stripGameTag(title: string): string {
	return title.replace(/^\[[^\]]+\]\s*/, "");
}

function winRateClass(value: number): string {
	if (value >= 70) return "rate-high";
	if (value >= 50) return "rate-mid";
	return "rate-low";
}

function toHtmlTable(data: object[]): string {
	if (data.length === 0) return "<p class='empty'>데이터 없음</p>";
	const headers = Object.keys(data[0]);
	const thead = headers.map((h) => `<th>${h}</th>`).join("");
	const rows = data
		.map((row, i) => {
			const cells = headers
				.map((h) => {
					const value = (row as Record<string, unknown>)[h];
					if (h === "점수") return `<td class="score">${value}</td>`;
					if (h === "반천장 승률" && typeof value === "number")
						return `<td class="${winRateClass(value)}">${value}</td>`;
					return `<td>${value}</td>`;
				})
				.join("");
			return `<tr${i === 0 ? ' class="top"' : ""}>${cells}</tr>`;
		})
		.join("\n");
	return `<table><thead><tr>${thead}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function writeHtmlReport(pageTitle: string, games: GameReportGroup[]) {
	const now = new Date();
	const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pageTitle}</title>
<style>
:root {
	--bg: #0b0e14;
	--panel: #161b22;
	--border: #30363d;
	--text: #e6edf3;
	--muted: #8b949e;
	--row-hover: #1f2733;
}
* { box-sizing: border-box; }
body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif;
	background: radial-gradient(ellipse 1200px 800px at top, #1a2130 0%, var(--bg) 100%);
	background-repeat: no-repeat;
	color: var(--text);
	margin: 0;
	padding: 2.5rem 1.5rem 4rem;
}
.container { max-width: 1000px; margin: 0 auto; }
.meta-bar {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 0.5rem;
	color: var(--muted);
	font-size: 0.85rem;
	margin-bottom: 3rem;
	border-bottom: 1px solid var(--border);
	padding-bottom: 1rem;
}
.meta-bar .page-title { color: var(--text); font-weight: 700; font-size: 1.1rem; }
.game { margin-bottom: 4rem; }
.game-head {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	margin-bottom: 1.8rem;
}
.game-icon {
	font-size: 1.6rem;
	width: 2.6rem;
	height: 2.6rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	background: var(--accent-soft);
}
.game-head h1 {
	margin: 0;
	font-size: 2rem;
	letter-spacing: 0.02em;
	background: linear-gradient(90deg, var(--accent), var(--text) 140%);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
h2 {
	margin: 0 0 0.8rem;
	font-size: 1rem;
	color: var(--text);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
h2::before {
	content: "";
	width: 4px;
	height: 1rem;
	border-radius: 2px;
	background: var(--accent);
	display: inline-block;
}
.section { margin-bottom: 1.6rem; }
.table-wrap {
	background: var(--panel);
	border: 1px solid var(--border);
	border-radius: 10px;
	overflow-x: auto;
	box-shadow: 0 4px 20px -8px #00000080;
}
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
th, td { padding: 9px 14px; text-align: right; }
th {
	background: #1c2128;
	color: var(--muted);
	font-weight: 600;
	font-size: 0.8rem;
}
tbody tr { border-top: 1px solid var(--border); }
tbody tr:hover { background: var(--row-hover); }
tbody tr.top { background: linear-gradient(90deg, var(--accent-soft), transparent 70%); }
tbody tr.top td:first-child::before { content: "★ "; color: var(--accent); }
td:first-child, th:first-child { text-align: left; }
td.score { font-weight: 700; color: var(--accent); }
td.rate-high { color: #3fb950; }
td.rate-mid { color: #d29922; }
td.rate-low { color: #8b949e; }
.empty { color: var(--muted); padding: 1rem; }
</style>
</head>
<body>
<div class="container">
<div class="meta-bar">
	<span class="page-title">${pageTitle}</span>
	<span>업데이트: ${formatKst(now)} <span id="relative" data-generated="${now.toISOString()}"></span></span>
</div>
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
${games
	.map(({ game, sections }) => {
		const theme = GAME_THEME[game] ?? DEFAULT_THEME;
		return `<section class="game" style="--accent:${theme.accent};--accent-soft:${theme.accentSoft}">
<div class="game-head"><span class="game-icon">${theme.icon}</span><h1>${game}</h1></div>
${sections
	.map(
		(s) =>
			`<div class="section"><h2>${stripGameTag(s.title)}</h2><div class="table-wrap">${toHtmlTable(s.data)}</div></div>`,
	)
	.join("\n")}
</section>`;
	})
	.join("\n")}
</div>
</body>
</html>`;

	fs.mkdirSync("docs", { recursive: true });
	fs.writeFileSync(path.join("docs", "index.html"), html);
}
