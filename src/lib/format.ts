export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(undefined, options ?? { month: "short", day: "numeric" }).format(new Date(value));
}

export function formatDuration(start: string, end?: string | null) {
  const milliseconds = (end ? Date.parse(end) : Date.now()) - Date.parse(start);
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatSigned(value: number, suffix = "") {
  if (!value) return `0${suffix}`;
  return `${value > 0 ? "+" : ""}${Math.round(value)}${suffix}`;
}
