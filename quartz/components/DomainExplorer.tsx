import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, simplifySlug } from "../util/path"

type DomainGroup = {
  label: string
  map: string
  notes: string[]
  children?: DomainGroup[]
}

const domains: DomainGroup[] = [
  {
    label: "Off-grid",
    map: "Off-Grid Reality and Professional Obligation",
    notes: [
      "Why I Moved to the Desert to Save My Brain",
      "Remote Operations Without Losing Control",
      "Off the Grid",
    ],
  },
  {
    label: "ADHD",
    map: "Running a Business with ADHD",
    notes: [
      "Systems Over Willpower",
      "Think or Act, But Not Both",
      "Structural Decisions vs Motivational Ones",
    ],
  },
  {
    label: "Strategy",
    map: "Strategy",
    notes: [
      "Strategy Is Winning Before You Start",
      "Strategic Thinking",
      "Trade-offs and Strategic Choices",
      "Building Unfair Advantages",
    ],
    children: [
      {
        label: "Marketing",
        map: "Digital Marketing and Design Strategy",
        notes: [
          "Why Most Marketing Isn't Strategic",
          "WordReward Positioning - Stop Managing Brands, Start Marking Them",
        ],
      },
    ],
  },
  {
    label: "Dentistry",
    map: "Dentistry",
    notes: [
      "Why I Hate Dentistry (and Why I'm Still a Dentist)",
      "The 7 Self-Deceptions That Shape a Dentist's Career",
      "Administrative Friction Is Clinical Friction",
    ],
  },
]

export default (() => {
  const DomainExplorer: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
    const currentSlug = simplifySlug(fileData.slug!)
    const findNote = (title: string) => allFiles.find((file) => file.frontmatter?.title === title)
    const isCurrent = (title: string) => findNote(title)?.slug && simplifySlug(findNote(title)!.slug!) === currentSlug

    const renderLink = (title: string, className = "") => {
      const file = findNote(title)
      if (!file?.slug) return null
      return (
        <a
          href={resolveRelative(fileData.slug!, file.slug)}
          class={`domain-explorer__link internal ${className} ${isCurrent(title) ? "is-current" : ""}`}
          data-no-popover="true"
        >
          {title}
        </a>
      )
    }

    const renderGroup = (group: DomainGroup, nested = false) => {
      const active = isCurrent(group.map) || group.notes.some(isCurrent) || group.children?.some((child) => isCurrent(child.map) || child.notes.some(isCurrent))
      return (
        <details class={`domain-explorer__group ${nested ? "domain-explorer__group--nested" : ""}`} open={active}>
          <summary>
            <span class="domain-explorer__chevron" aria-hidden="true">›</span>
            {renderLink(group.map, "domain-explorer__map")}
          </summary>
          <div class="domain-explorer__notes">
            {group.notes.map((title) => renderLink(title))}
            {group.children?.map((child) => renderGroup(child, true))}
          </div>
        </details>
      )
    }

    return (
      <nav class={`${displayClass ?? ""} domain-explorer`} aria-label="Explore domains">
        <p class="domain-explorer__title">Explore</p>
        <div class="domain-explorer__groups">
          {domains.map((domain) => renderGroup(domain))}
        </div>
        <details class="domain-explorer__mobile">
          <summary>
            <span class="domain-explorer__mobile-icon" aria-hidden="true">☰</span>
            <span>Explore</span>
          </summary>
          <div class="domain-explorer__groups">
            {domains.map((domain) => renderGroup(domain))}
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
      margin: 0 0 0.55rem;
      color: var(--darkgray);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .domain-explorer__mobile {
      display: none;
    }

    .domain-explorer__group {
      margin: 0.15rem 0;
    }

    .domain-explorer__group summary {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      cursor: pointer;
      list-style: none;
    }

    .domain-explorer__group summary::-webkit-details-marker {
      display: none;
    }

    .domain-explorer__chevron {
      display: inline-block;
      width: 0.8rem;
      color: var(--tertiary);
      font-size: 1.1rem;
      line-height: 1;
      transition: transform 120ms ease;
    }

    .domain-explorer__group[open] > summary .domain-explorer__chevron {
      transform: rotate(90deg);
    }

    .domain-explorer__link {
      display: block;
      overflow: hidden;
      padding: 0.18rem 0;
      color: var(--darkgray);
      font-size: 0.82rem;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .domain-explorer__map {
      padding: 0.28rem 0;
      color: var(--dark);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .domain-explorer__link:hover,
    .domain-explorer__link.is-current {
      color: var(--secondary);
    }

    .domain-explorer__notes {
      margin: 0.15rem 0 0.35rem 1.05rem;
      padding-left: 0.65rem;
      border-left: 1px solid var(--lightgray);
    }

    .domain-explorer__group--nested {
      margin-top: 0.3rem;
    }

    .domain-explorer__group--nested > summary .domain-explorer__map {
      font-size: 0.8rem;
      font-weight: 500;
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
      .domain-explorer > .domain-explorer__groups {
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
        cursor: pointer;
        color: var(--darkgray);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        list-style: none;
        text-transform: uppercase;
      }

      .domain-explorer__mobile > summary::-webkit-details-marker {
        display: none;
      }

      .domain-explorer__mobile-icon {
        color: var(--secondary);
        font-size: 1rem;
        line-height: 1;
      }

      .domain-explorer__mobile[open] > .domain-explorer__groups {
        display: block;
        padding: 0.4rem 0.8rem 0.75rem;
        border-top: 1px solid var(--lightgray);
      }
    }
  `

  return DomainExplorer
}) satisfies QuartzComponentConstructor
