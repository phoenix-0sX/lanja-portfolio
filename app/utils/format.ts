const MONTHS: Record<string, string[]> = {
  en: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  fr: ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
}

/** `2023-11` -> `Nov. 2023` (en) / `Nov. 2023` (fr) */
export function formatMonth(value: string, locale = 'en'): string {
  const [year, month] = value.split('-')
  const label = (MONTHS[locale] ?? MONTHS.en!)[Number(month) - 1]
  return label ? `${label} ${year}` : (year ?? value)
}

/** `2023-11`, `null` -> `Nov. 2023 – Now` (the "now" label comes from the locale files) */
export function formatRange(start: string, end: string | null, locale: string, nowLabel: string): string {
  return `${formatMonth(start, locale)} – ${end ? formatMonth(end, locale) : nowLabel}`
}
