import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <span class="page-title-main">{title}</span>
        <span class="page-title-sub">from the sea</span>
      </a>
    </div>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
  line-height: 1;
}

.page-title a {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none !important;
  border-bottom: none !important;
}

.page-title-main {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.page-title-sub {
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: lowercase;
  opacity: 0.45;
  line-height: 1;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
