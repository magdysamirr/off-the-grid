import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative, simplifySlug } from "../util/path"

type MapEntry = {
  topic: string
  label: string
  file: QuartzComponentProps["allFiles"][number]
  count: number
  nested?: boolean
}

const topicOrder = ["off-grid", "adhd", "strategy", "dentistry"]
const topicLabels: Record<string, string> = {
  "off-grid": "Off-grid",
  adhd: "ADHD",
  strategy: "Strategy",
  dentistry: "Dentistry",
  marketing: "Marketing",
}

const getTopics = (file: QuartzComponentProps["allFiles"][number]) => {
  const topics = file.frontmatter?.topics
  return (Array.isArray(topics) ? topics : topics ? [topics] : [])
    .filter((topic): topic is string => typeof topic === "string")
    .map((topic) => topic.toLowerCase().trim())
}

export default (() => {
  const DomainExplorer: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
    const currentSlug = simplifySlug(fileData.slug!)
    const maps = allFiles.filter((file) => file.frontmatter?.type === "map" && simplifySlug(file.slug!) !== "index")

    const entries: MapEntry[] = topicOrder
      .map((topic) => {
        const file = maps.find((candidate) => getTopics(candidate).includes(topic) &&
          !(topic === "strategy" && getTopics(candidate).includes("marketing") && candidate.frontmatter?.title !== "Strategy"))
        if (!file) return null
        const count = allFiles.filter((candidate) =>
          simplifySlug(candidate.slug!) !== "index" &&
          candidate.frontmatter?.type !== "map" &&
          getTopics(candidate).includes(topic),
        ).length
        return { topic, label: topicLabels[topic], file, count }
      })
      .filter((entry): entry is MapEntry => entry !== null)

    const marketingMap = maps.find((file) =>
      getTopics(file).includes("marketing") && getTopics(file).includes("strategy") &&
      file.frontmatter?.title !== "Strategy",
    )
    if (marketingMap) {
      entries.splice(3, 0, {
        topic: "marketing",
        label: topicLabels.marketing,
        file: marketingMap,
        count: allFiles.filter((candidate) =>
          simplifySlug(candidate.slug!) !== "index" &&
          candidate.frontmatter?.type !== "map" &&
          getTopics(candidate).includes("marketing"),
        ).length,
        nested: true,
      })
    }

    const renderMap = (entry: MapEntry) => {
      const slug = simplifySlug(entry.file.slug!)
      const active = slug === currentSlug
      return (
        <a
          href={resolveRelative(fileData.slug!, entry.file.slug!)}
          class={`domain-explorer__map ${entry.nested ? "domain-explorer__map--nested" : ""} ${active ? "is-current" : ""}`}
          aria-current={active ? "page" : undefined}
          data-no-popover="true"
        >
          <span>{entry.label}</span>
          <span class="domain-explorer__count" aria-label={`${entry.count} notes`}>{entry.count}</span>
        </a>
      )
    }

    return (
      <nav class={`${displayClass ?? ""} domain-explorer`} aria-label="Explore domains">
        <p class="domain-explorer__title">Explore</p>
        <div class="domain-explorer__maps">
          {entries.map(renderMap)}
        </div>
        <details class="domain-explorer__mobile">
          <summary>
            <span class="domain-explorer__mobile-icon" aria-hidden="true">☰</span>
            <span>Explore</span>
          </summary>
          <div class="domain-explorer__maps">
            {entries.map(renderMap)}
          </div>
        </details>
      </nav>
    )
  }

  DomainExplorer.css = `
    .domain-explorer {
      width: 100%;
      max-width: 13rem;
      margin-top: 1rem;
    }

    .domain-explorer__title {
      margin: 0 0 0.7rem;
      color: var(--darkgray);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .domain-explorer__mobile {
      display: none;
    }

    .domain-explorer__maps {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .domain-explorer__map {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.65rem;
      padding: 0.35rem 0;
      border-bottom: 1px solid transparent;
      color: var(--darkgray);
      font-size: 0.88rem;
      line-height: 1.25;
      text-decoration: none;
      transition: color 160ms ease, border-color 160ms ease;
    }

    .domain-explorer__map--nested {
      margin-left: 0.85rem;
      padding-left: 0.7rem;
      border-left: 1px solid var(--lightgray);
      font-size: 0.82rem;
    }

    .domain-explorer__count {
      flex: 0 0 auto;
      color: var(--darkgray);
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .domain-explorer__map:hover,
    .domain-explorer__map.is-current {
      border-color: var(--secondary);
      color: var(--secondary);
    }

    .domain-explorer__map:hover .domain-explorer__count,
    .domain-explorer__map.is-current .domain-explorer__count {
      color: var(--secondary);
      opacity: 1;
    }

    @media all and (max-width: 1100px) {
      .domain-explorer {
        max-width: 11rem;
      }
    }

    @media all and (max-width: 700px) {
      .domain-explorer.mobile-only {
        display: block !important;
        width: 100% !important;
      }

      .domain-explorer {
        max-width: none;
        margin: 0.5rem 0 1rem;
      }

      .domain-explorer > .domain-explorer__title,
      .domain-explorer > .domain-explorer__maps {
        display: none;
      }

      .domain-explorer__mobile {
        display: block;
        width: 100%;
        border: 1px solid var(--lightgray);
        border-radius: 0.45rem;
        background: var(--light);
      }

      .domain-explorer__mobile > summary {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.65rem 0.8rem;
        color: var(--dark);
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        list-style: none;
      }

      .domain-explorer__mobile > summary::-webkit-details-marker {
        display: none;
      }

      .domain-explorer__mobile-icon {
        color: var(--secondary);
        font-size: 1rem;
      }

      .domain-explorer__mobile > .domain-explorer__maps {
        display: flex;
        padding: 0 0.8rem 0.7rem;
      }
    }
  `

  return DomainExplorer
}) satisfies QuartzComponent
