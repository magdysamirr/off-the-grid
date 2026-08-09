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
        <div class="domain-notes__heading">
          <h2 id="domain-notes-title">All {topicLabels[topic]} notes</h2>
          <span class="domain-notes__intro">{notes.length} notes</span>
        </div>
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
      margin: 0.9rem 0 2.5rem;
      padding: 0.75rem 0 0.9rem;
      border-top: 1px solid var(--lightgray);
      border-bottom: 1px solid var(--lightgray);
    }

    .domain-notes__heading {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      margin-bottom: 0.65rem;
    }

    .domain-notes h2 {
      margin: 0;
      color: var(--secondary);
      font-size: 1rem;
      font-weight: 400;
    }

    .domain-notes__intro {
      color: var(--darkgray);
      font-size: 0.72rem;
      opacity: 0.75;
    }

    .domain-notes__list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.35rem 1.25rem;
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
      padding-bottom: 0.2rem;
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
        margin-bottom: 2rem;
      }

      .domain-notes__list {
        grid-template-columns: 1fr;
      }
    }
  `

  return DomainNotes
}) satisfies QuartzComponentConstructor
