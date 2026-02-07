/**
 * 시:분 단위로 10분 내림한 문자열 반환 (UTC 기준)
 * 예: 17:23 → "17:20"
 */
export function getHourMinuteKey(date: Date): string {
  const hours = date.getHours(); // ✅ 한국 시간 기준
  const minutes = date.getMinutes();
  const roundedMinutes = minutes - (minutes % 10);

  const hh = String(hours).padStart(2, '0');
  const mm = String(roundedMinutes).padStart(2, '0');

  return `${hh}:${mm}`;
}
