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
    const maps = allFiles.filter((file) => file.frontmatter?.type === "map" && file.slug !== "index")

    const entries: MapEntry[] = topicOrder
      .map((topic) => {
        const file = maps.find((candidate) => getTopics(candidate).includes(topic) &&
          !(topic === "strategy" && getTopics(candidate).includes("marketing") && candidate.frontmatter?.title !== "Strategy"))
        if (!file) return null
        const count = allFiles.filter((candidate) =>
          candidate.slug !== "index" &&
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
          candidate.slug !== "index" &&
          candidate.frontmatter?.type !== "map" &&
          getTopics(candidate).includes("marketing"),
        ).length,
        nested: true,
      })
    }

    const fullIndex = allFiles.find((file) => file.frontmatter?.threads === true)
    const allEntry: MapEntry | null = fullIndex
      ? {
          topic: "all",
          label: "Every note",
          file: fullIndex,
          count: allFiles.filter((candidate) =>
            candidate.slug !== "index" &&
            candidate.slug !== fullIndex.slug &&
            candidate.frontmatter?.type !== "map",
          ).length,
        }
      : null

    const renderMap = (entry: MapEntry) => {
      const slug = simplifySlug(entry.file.slug!)
      const active = slug === currentSlug
      return (
        <a
          href={resolveRelative(fileData.slug!, entry.file.slug!)}
          class={`domain-explorer__map ${entry.nested ? "domain-explorer__map--nested" : ""} ${entry.topic === "all" ? "domain-explorer__map--all" : ""} ${active ? "is-current" : ""}`}
          aria-current={active ? "page" : undefined}
          data-no-popover="true"
        >
          <span class="domain-explorer__label">{entry.label}</span>
          <span class="domain-explorer__count" aria-label={`${entry.count} notes`}>{entry.count}</span>
        </a>
      )
    }

    return (
      <nav class={`${displayClass ?? ""} domain-explorer`} aria-label="Explore domains">
        <p class="domain-explorer__title">Explore</p>
        <div class="domain-explorer__maps">
          {allEntry && renderMap(allEntry)}
          <div class="domain-explorer__tree">{entries.map(renderMap)}</div>
        </div>
        <details class="domain-explorer__mobile">
          <summary>
            <span class="domain-explorer__mobile-icon" aria-hidden="true">☰</span>
            <span>Explore</span>
          </summary>
          <div class="domain-explorer__maps">
            {allEntry && renderMap(allEntry)}
            <div class="domain-explorer__tree">{entries.map(renderMap)}</div>
          </div>
        </details>
      </nav>
    )
  }

  DomainExplorer.css = `
    .domain-explorer {
      width: 100%;
      max-width: 12rem;
      margin-top: 1rem;
    }

    .domain-explorer__title {
      margin: 0 0 0.45rem;
      padding-left: 0.5rem;
      color: var(--darkgray);
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      opacity: 0.45;
      text-transform: uppercase;
      transition: opacity 200ms ease;
    }

    .domain-explorer:hover .domain-explorer__title {
      opacity: 0.75;
    }

    .domain-explorer__mobile {
      display: none;
    }

    .domain-explorer__maps {
      display: flex;
      flex-direction: column;
    }

    .domain-explorer__map {
      position: relative;
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0.28rem 0.4rem 0.28rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.84rem;
      line-height: 1.3;
      opacity: 0.6;
      text-decoration: none;
      transition: opacity 200ms ease, background 120ms ease;
    }

    .domain-explorer:hover .domain-explorer__map,
    .domain-explorer__map.is-current {
      opacity: 1;
    }

    /* The spine turns five loose links into one tree, and gives the current
       page something to sit against. */
    .domain-explorer__tree {
      display: flex;
      flex-direction: column;
      margin-top: 0.3rem;
      padding-left: 0.55rem;
      border-left: 1px solid var(--lightgray);
    }

    .domain-explorer__tree .domain-explorer__map::before {
      content: "";
      position: absolute;
      top: 0.3rem;
      bottom: 0.3rem;
      left: calc(-0.55rem - 1px);
      width: 2px;
      background: transparent;
      transition: background 120ms ease;
    }

    .domain-explorer__map--all {
      font-weight: 500;
    }

    .domain-explorer__map--all .domain-explorer__label {
      color: var(--dark);
    }

    .domain-explorer__map--nested {
      margin-left: 0.7rem;
      font-size: 0.79rem;
    }

    .domain-explorer__map--nested .domain-explorer__label::before {
      content: "";
      display: inline-block;
      width: 0.5rem;
      height: 1px;
      margin-right: 0.4rem;
      vertical-align: 0.25em;
      background: var(--lightgray);
    }

    /* The global stylesheet sets "a { color: var(--tertiary) !important }", so
       the state colours live on this span rather than on the anchor. */
    .domain-explorer__label {
      min-width: 0;
      overflow: hidden;
      color: var(--darkgray);
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 120ms ease;
    }

    .domain-explorer__count {
      flex: 0 0 auto;
      margin-left: auto;
      color: var(--darkgray);
      font-family: var(--codeFont);
      font-size: 0.66rem;
      font-variant-numeric: tabular-nums;
      opacity: 0.5;
    }

    .domain-explorer__map:hover {
      background: var(--highlight);
    }

    .domain-explorer__map.is-current {
      font-weight: 600;
    }

    .domain-explorer__map.is-current::before {
      background: var(--secondary);
    }

    .domain-explorer__map:hover .domain-explorer__label,
    .domain-explorer__map.is-current .domain-explorer__label {
      color: var(--secondary);
    }

    .domain-explorer__map:hover .domain-explorer__count,
    .domain-explorer__map.is-current .domain-explorer__count {
      color: var(--secondary);
      opacity: 0.85;
    }

    @media all and (max-width: 1200px) {
      /* No hover to reach for on touch, so the rail rests at full strength. */
      .domain-explorer__map,
      .domain-explorer__title {
        opacity: 1;
      }
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
