import { en } from './en'
import { ru } from './ru'
import type { Content, Lang } from './types'

export type { Content, Lang } from './types'

export const content: Record<Lang, Content> = { ru, en }

/** First day of commercial work, used to keep the tenure line current. */
export const CAREER_START = new Date(2020, 7, 1)

const units: Record<Lang, { year: Record<string, string>; month: Record<string, string>; and: string }> = {
  ru: {
    year: { one: 'год', few: 'года', many: 'лет', other: 'года' },
    month: { one: 'месяц', few: 'месяца', many: 'месяцев', other: 'месяца' },
    and: 'и',
  },
  en: {
    year: { one: 'year', other: 'years' },
    month: { one: 'month', other: 'months' },
    and: 'and',
  },
}

export function formatTenure(lang: Lang, from: Date, to: Date = new Date()): string {
  const total = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const years = Math.floor(total / 12)
  const months = total % 12
  const rules = new Intl.PluralRules(lang)
  const u = units[lang]
  // non-breaking spaces keep a number on the same line as its unit
  const y = `${years}\u00a0${u.year[rules.select(years)] ?? u.year.other}`
  if (months === 0) return y
  return `${y} ${u.and} ${months}\u00a0${u.month[rules.select(months)] ?? u.month.other}`
}
