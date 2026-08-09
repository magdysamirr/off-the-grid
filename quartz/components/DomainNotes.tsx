import { resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const getTopics = (file: QuartzComponentProps["allFiles"][number]) => {
  const topics = file.frontmatter?.topics
  return (Array.isArray(topics) ? topics : topics ? [topics] : [])
    .filter((topic): topic is string => typeof topic === "string")
    .map((topic) => topic.toLowerCase().trim())
}

const topicLabels: Record<string, string> = {
  "off-grid": "Off-grid",
  adhd: "ADHD",
  strategy: "Strategy",
  marketing: "Marketing",
  dentistry: "Dentistry",
}

export default (() => {
  const DomainNotes: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (fileData.frontmatter?.type !== "map") return null

    const mapTopics = getTopics(fileData)
    const mapTitle = fileData.frontmatter?.title
    const topic = mapTopics.includes("marketing") && mapTitle !== "Strategy"
      ? "marketing"
      : mapTopics.find((candidate) => topicLabels[candidate])

    if (!topic) return null

    const notes = allFiles
      .filter((file) =>
        file.frontmatter?.type !== "map" &&
        file.frontmatter?.title !== "200 Meters" &&
        getTopics(file).includes(topic),
      )
      .sort((a, b) => {
        const aTitle = a.frontmatter?.title ?? ""
        const bTitle = b.frontmatter?.title ?? ""
        return aTitle.localeCompare(bTitle)
      })

    return (
      <section class="domain-notes" aria-labelledby="domain-notes-title">
        <h2 id="domain-notes-title">All {topicLabels[topic]} notes</h2>
        <p class="domain-notes__intro">{notes.length} notes in this path.</p>
        <ul class="domain-notes__list">
          {notes.map((note) => (
            <li>
              <a href={resolveRelative(fileData.slug!, note.slug!)} class="internal">
                {note.frontmatter?.title ?? "Untitled note"}
              </a>
              <span class="domain-notes__status">
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
      margin: 4rem 0 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--lightgray);
    }

    .domain-notes h2 {
      margin: 0 0 0.35rem;
      color: var(--secondary);
      font-size: 1.25rem;
      font-weight: 400;
    }

    .domain-notes__intro {
      margin: 0 0 1rem;
      color: var(--darkgray);
      font-size: 0.85rem;
    }

    .domain-notes__list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.55rem 2rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .domain-notes__list li {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
      min-width: 0;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid color-mix(in srgb, var(--lightgray) 55%, transparent);
    }

    .domain-notes__list a {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .domain-notes__status {
      flex: 0 0 auto;
      color: var(--darkgray);
      font-size: 0.68rem;
      text-transform: lowercase;
      opacity: 0.7;
    }

    @media (max-width: 700px) {
      .domain-notes {
        margin-top: 2.5rem;
      }

      .domain-notes__list {
        grid-template-columns: 1fr;
      }
    }
  `

  return DomainNotes
}) satisfies QuartzComponentConstructor
