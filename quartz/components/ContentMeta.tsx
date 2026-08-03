import { Date } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { resolveRelative, simplifySlug } from "../util/path"
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

const confidenceLabels: Record<number, string> = {
  20: "I'm Winging This",
  40: "I Think This Is True",
  60: "I've Tested This",
  80: "I've Paid for This Opinion",
  100: "Matter of Fact",
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, allFiles, displayClass }: QuartzComponentProps) {
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

      const rawConfidence = fileData.frontmatter?.confidence
      const confidence =
        typeof rawConfidence === "number" && confidenceLabels[rawConfidence] ? rawConfidence : undefined

      const confidenceExplainer = allFiles.find(
        (file) => file.slug?.split("/").pop()?.toLowerCase().replace(/-/g, " ") === "what is this",
      )
      const confidenceHref =
        confidenceExplainer?.slug && fileData.slug
          ? resolveRelative(fileData.slug, confidenceExplainer.slug)
          : undefined
      const isExplainerPage =
        confidenceExplainer?.slug && fileData.slug
          ? simplifySlug(confidenceExplainer.slug) === simplifySlug(fileData.slug)
          : false

      const isClickableConfidence = confidence !== undefined && !!confidenceHref && !isExplainerPage

      const confidenceBlock = confidence !== undefined && (
        <>
          <span class="content-meta__confidence-blocks" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                class={classNames(undefined, "content-meta__confidence-block", i < confidence / 20 ? "is-filled" : "")}
              />
            ))}
          </span>
          <span class="content-meta__confidence-label">{confidenceLabels[confidence]}</span>
          <span class="content-meta__confidence-pct">{confidence}%</span>
          {isClickableConfidence && (
            <svg
              aria-hidden="true"
              class="content-meta__confidence-icon"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3" />
              <circle cx="8" cy="4.6" r="0.9" fill="currentColor" />
              <rect x="7.2" y="7" width="1.6" height="5" rx="0.6" fill="currentColor" />
            </svg>
          )}
        </>
      )

      return (
        <>
          <p show-comma={false} class={classNames(displayClass, "content-meta", isRTL ? "rtl" : "")}>
            {segments}
            <span class="text-size-controls" aria-label="Text size">
              <button type="button" data-reading-size="default" aria-label="Default text size" title="Default text size">A</button>
              <button type="button" data-reading-size="large" aria-label="Larger text" title="Larger text">A+</button>
            </span>
          </p>
          {confidence !== undefined && (
            isClickableConfidence ? (
              <a
                href={confidenceHref}
                class={classNames(displayClass, "content-meta__confidence", "internal")}
                data-tier={confidence}
                data-no-popover="true"
                title="What does this confidence rating mean?"
              >
                {confidenceBlock}
              </a>
            ) : (
              <p class={classNames(displayClass, "content-meta__confidence")} data-tier={confidence}>
                {confidenceBlock}
              </p>
            )
          )}
        </>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  ContentMetadata.beforeDOMLoaded = `
    (() => {
      try {
        const saved = localStorage.getItem("200-meters-reading-size-v2")
        if (saved === "default" || saved === "large") {
          document.documentElement.dataset.readingSize = saved
        } else if (window.matchMedia("(max-width: 1200px)").matches) {
          document.documentElement.dataset.readingSize = "large"
        }
      } catch (_) {}
    })()
  `

  ContentMetadata.afterDOMLoaded = `
    (() => {
      if (window.__readingSizeControlsReady) return
      window.__readingSizeControlsReady = true
      const valid = new Set(["default", "large"])
      const apply = (size) => {
        const value = valid.has(size) ? size : "default"
        document.documentElement.dataset.readingSize = value
        const isMobile = window.matchMedia("(max-width: 1200px)").matches
        const pixels = isMobile
          ? value === "large" ? "19px" : "15px"
          : value === "large" ? "19px" : "15px"
        document.documentElement.style.setProperty("--reading-font-size", pixels)
        document.querySelectorAll("[data-reading-size]").forEach((button) => {
          button.setAttribute("aria-pressed", button.dataset.readingSize === value ? "true" : "false")
        })
        try { localStorage.setItem("200-meters-reading-size-v2", value) } catch (_) {}
      }
      document.addEventListener("click", (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        const button = target.closest("[data-reading-size]")
        if (!(button instanceof HTMLElement)) return
        apply(button.dataset.readingSize)
      })
      const initialSize = document.documentElement.dataset.readingSize ||
        (window.matchMedia("(max-width: 1200px)").matches ? "large" : "default")
      apply(initialSize)
    })()
  `

  return ContentMetadata
}) satisfies QuartzComponentConstructor
