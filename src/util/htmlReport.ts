import * as fs from "fs";
import * as path from "path";

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

export function writeHtmlReport(
	title: string,
	sections: { title: string; data: object[] }[],
) {
	const now = new Date();
	const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${title}</title>
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
<h1>${title}</h1>
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
