import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, simplifySlug } from "../util/path"

const PrevNext: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const currentSlug = simplifySlug(fileData.slug!)
  const notes = allFiles
    .filter((file) => file.slug && file.frontmatter?.["dg-publish"] !== false)
    .sort((a, b) => {
      const aDate = a.dates?.published?.getTime() ?? 0
      const bDate = b.dates?.published?.getTime() ?? 0
      return aDate - bDate || (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
    })

  const currentIndex = notes.findIndex((file) => simplifySlug(file.slug!) === currentSlug)
  const previous = currentIndex > 0 ? notes[currentIndex - 1] : undefined
  const next = currentIndex >= 0 && currentIndex < notes.length - 1 ? notes[currentIndex + 1] : undefined

  if (!previous && !next) return null

  return (
    <nav class={displayClass} aria-label="Note navigation">
      <div class="prev-next">
        {previous ? (
          <a href={resolveRelative(fileData.slug!, previous.slug!)} class="prev-next__link internal">
            <span>Previous</span>
            <strong>{previous.frontmatter?.title}</strong>
          </a>
        ) : <span />}
        {next ? (
          <a href={resolveRelative(fileData.slug!, next.slug!)} class="prev-next__link prev-next__link--next internal">
            <span>Next</span>
            <strong>{next.frontmatter?.title}</strong>
          </a>
        ) : <span />}
      </div>
    </nav>
  )
}

PrevNext.css = `
.prev-next {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin: 1.5rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--lightgray);
}

.prev-next__link {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 48%;
  background: transparent !important;
}

.prev-next__link span {
  color: var(--tertiary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.prev-next__link strong {
  font-weight: 400;
}

.prev-next__link--next {
  margin-left: auto;
  text-align: right;
}

@media all and (max-width: 700px) {
  .prev-next {
    gap: 1rem;
  }

  .prev-next__link {
    max-width: 50%;
  }
}
`

export default (() => PrevNext) satisfies QuartzComponentConstructor
