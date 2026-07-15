import { Date } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      // Check if the page has RTL class in frontmatter
      const isRTL = fileData.frontmatter?.cssclasses?.includes("rtl")
      const locale = isRTL ? "ar-SA" : cfg.locale

      // Function to convert Western digits to Arabic-Indic digits
      const toArabicNumerals = (str: string): string => {
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
        return str.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)])
      }

      if (fileData.dates) {
        const publishedDate = fileData.dates.published
        const updatedDate = fileData.dates.modified

        if (fileData.frontmatter?.published) {
          segments.push(
            <span class="content-meta__published">
              Published <Date date={publishedDate} locale={locale} />
            </span>,
          )
        }

        if (fileData.frontmatter?.modified) {
          segments.push(
            <span class="content-meta__updated">
              Updated <Date date={updatedDate} locale={locale} />
            </span>,
          )
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        let displayedTime = i18n(locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })

        // Convert to Arabic numerals if RTL
        if (isRTL) {
          displayedTime = toArabicNumerals(displayedTime)
        }

        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={false} class={classNames(displayClass, "content-meta", isRTL ? "rtl" : "")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
