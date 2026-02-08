export function toTimeSlot(iso: string): string {
  const d = new Date(iso)
  const h = d.getHours().toString().padStart(2, '0')
  const m = Math.floor(d.getMinutes() / 10) * 10
  const mm = m.toString().padStart(2, '0')
  return `${h}:${mm}~${h}:${(m + 9).toString().padStart(2, '0')}`
}