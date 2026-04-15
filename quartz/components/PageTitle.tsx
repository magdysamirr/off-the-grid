import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const iconLightPath = pathToRoot(fileData.slug!) + "/static/icon-light.png"
  const iconDarkPath = pathToRoot(fileData.slug!) + "/static/icon-dark.png"
  return (
    <div class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <picture class="page-title-mark" aria-hidden="true">
          <source srcSet={iconDarkPath} media="(prefers-color-scheme: dark)" />
          <img src={iconLightPath} alt="" width={44} height={44} />
        </picture>
        <span class="page-title-copy">
          <span class="page-title-main">{title}</span>
          <span class="page-title-sub">from the sea</span>
        </span>
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
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none !important;
  border-bottom: none !important;
}

.page-title-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title-mark {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.page-title-mark img {
  display: block;
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
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
