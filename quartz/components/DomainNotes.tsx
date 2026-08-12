import { resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const getTopics = (file: QuartzComponentProps["allFiles"][number]) => {
  const topics = file.frontmatter?.topics
  return (Array.isArray(topics) ? topics : topics ? [topics] : [])
    .filter((topic): topic is string => typeof topic === "string")
    .map((topic) => topic.toLowerCase().trim())
}

const topicOrder = ["off-grid", "adhd", "strategy", "marketing", "dentistry"]

const topicLabels: Record<string, string> = {
  "off-grid": "Off-grid",
  adhd: "ADHD",
  strategy: "Strategy",
  marketing: "Marketing",
  dentistry: "Dentistry",
}

const topicBlurbs: Record<string, string> = {
  "off-grid": "Business from the desert",
  adhd: "Attention and execution",
  strategy: "Positioning and trade-offs",
  marketing: "Strategy made visible",
  dentistry: "Clinic, career, obligation",
}

const isMarketingMap = (file: QuartzComponentProps["allFiles"][number]) =>
  getTopics(file).includes("marketing") && file.frontmatter?.title !== "Strategy"

export default (() => {
  const DomainNotes: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    const notesOnly = allFiles.filter(
      (file) => file.frontmatter?.type !== "map" && file.slug !== "index",
    )
    const countFor = (topic: string) =>
      notesOnly.filter((file) => getTopics(file).includes(topic)).length

    if (fileData.frontmatter?.threads === true) {
      const maps = allFiles.filter(
        (file) => file.frontmatter?.type === "map" && file.slug !== "index",
      )

      const threads = topicOrder
        .map((topic) => {
          const map = maps.find((file) =>
            topic === "marketing"
              ? isMarketingMap(file)
              : getTopics(file).includes(topic) && !isMarketingMap(file),
          )
          return map ? { topic, map } : null
        })
        .filter((thread): thread is { topic: string; map: (typeof maps)[number] } => thread !== null)

      if (threads.length === 0) return null

      return (
        <nav class="domain-notes domain-notes--threads" aria-labelledby="domain-notes-title">
          <p class="domain-notes__eyebrow" id="domain-notes-title">
            Start with a thread
          </p>
          <div class="domain-notes__threads">
            {threads.map(({ topic, map }) => (
              <a
                href={resolveRelative(fileData.slug!, map.slug!)}
                class="domain-notes__thread"
                data-no-popover="true"
              >
                <span class="domain-notes__thread-head">
                  <span class="domain-notes__thread-label">{topicLabels[topic]}</span>
                  <span class="domain-notes__thread-count">{countFor(topic)}</span>
                </span>
                <span class="domain-notes__thread-blurb">{topicBlurbs[topic]}</span>
              </a>
            ))}
          </div>
        </nav>
      )
    }

    if (fileData.frontmatter?.type !== "map") return null

    const mapTopics = getTopics(fileData)
    const topic = isMarketingMap(fileData)
      ? "marketing"
      : mapTopics.find((candidate) => topicLabels[candidate])

    if (!topic) return null

    const notes = notesOnly
      .filter((file) => getTopics(file).includes(topic))
      .sort((a, b) => {
        const aTitle = a.frontmatter?.title ?? ""
        const bTitle = b.frontmatter?.title ?? ""
        return aTitle.localeCompare(bTitle)
      })

    if (notes.length === 0) return null

    return (
      <section class="domain-notes" aria-labelledby="domain-notes-title">
        <p class="domain-notes__eyebrow" id="domain-notes-title">
          Every {topicLabels[topic]} note
          <span class="domain-notes__count">{notes.length}</span>
        </p>
        <ul class="domain-notes__list">
          {notes.map((note) => (
            <li>
              <a href={resolveRelative(fileData.slug!, note.slug!)} class="internal">
                {note.frontmatter?.title ?? "Untitled note"}
              </a>
              <span class="domain-notes__status" data-status={note.frontmatter?.status ?? "note"}>
                {note.frontmatter?.status ?? note.frontmatter?.type ?? "note"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  DomainNotes.css = `
    .domain-notes {
      margin: 1.1rem 0 2.5rem;
    }

    .domain-notes__eyebrow {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.75rem;
      color: var(--darkgray);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .domain-notes__count {
      padding: 0.05rem 0.35rem;
      border-radius: 0.6rem;
      background: var(--lightgray);
      color: var(--darkgray);
      font-size: 0.65rem;
      font-weight: 500;
      letter-spacing: 0;
    }

    .domain-notes__threads {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
      gap: 0.4rem;
    }

    .domain-notes__thread {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      padding: 0.6rem 0.7rem;
      border: 1px solid var(--lightgray);
      border-radius: 0.4rem;
      background: transparent;
      text-decoration: none;
      transition: border-color 160ms ease, background 160ms ease;
    }

    .domain-notes__thread:hover {
      border-color: var(--secondary);
      background: var(--highlight);
    }

    .domain-notes__thread-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.4rem;
    }

    .domain-notes__thread-label {
      color: var(--dark);
      font-size: 0.88rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .domain-notes__thread:hover .domain-notes__thread-label {
      color: var(--secondary);
    }

    .domain-notes__thread-count {
      color: var(--darkgray);
      font-family: var(--codeFont);
      font-size: 0.68rem;
      opacity: 0.7;
    }

    .domain-notes__thread-blurb {
      color: var(--darkgray);
      font-size: 0.72rem;
      line-height: 1.35;
      opacity: 0.85;
    }

    .domain-notes__list {
      columns: 2;
      column-gap: 2.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .domain-notes__list li {
      padding: 0.24rem 0;
      line-height: 1.4;
      break-inside: avoid;
    }

    .domain-notes__list a {
      font-size: 0.92rem;
    }

    .domain-notes__status {
      margin-left: 0.45rem;
      color: var(--darkgray);
      white-space: nowrap;
      font-size: 0.62rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      opacity: 0.6;
    }

    .domain-notes__status[data-status="evergreen"] {
      color: var(--secondary);
      opacity: 0.75;
    }

    @media (max-width: 700px) {
      .domain-notes {
        margin-bottom: 2rem;
      }

      .domain-notes__threads {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .domain-notes__list {
        columns: 1;
      }
    }
  `

  return DomainNotes
}) satisfies QuartzComponentConstructor
