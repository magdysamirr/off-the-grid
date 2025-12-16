import { GlobalConfiguration } from "../cfg"
import { ValidLocale } from "../i18n"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
}

export type ValidDateType = keyof Required<QuartzPluginData>["dates"]

export function getDate(cfg: GlobalConfiguration, data: QuartzPluginData): Date | undefined {
  if (!cfg.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`,
    )
  }
  return data.dates?.[cfg.defaultDateType]
}

// Convert Western digits to Arabic-Indic digits
function toArabicNumerals(str: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return str.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)])
}

export function formatDate(d: Date, locale: ValidLocale = "en-US"): string {
  const formatted = d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })

  // Force Arabic-Indic numerals for Arabic locale
  if (locale === "ar-SA" || locale.startsWith("ar")) {
    return toArabicNumerals(formatted)
  }

  return formatted
}

export function Date({ date, locale }: Props) {
  return <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>
}
