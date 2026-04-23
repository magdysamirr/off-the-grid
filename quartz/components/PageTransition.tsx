import { QuartzComponent, QuartzComponentConstructor } from "./types"

const PageTransition: QuartzComponent = () => null

PageTransition.afterDOMLoaded = `
if (!window.__pageTransitionReady) {
  window.__pageTransitionReady = true
  document.addEventListener("nav", () => {
    const article = document.querySelector(".center article")
    if (!article) return
    article.style.animation = "none"
    void article.offsetWidth
    article.style.animation = "page-enter 300ms ease-out both"
    article.addEventListener("animationend", () => {
      article.style.animation = ""
    }, { once: true })
  })
}
`

PageTransition.css = `
@keyframes page-enter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
}
`

export default (() => PageTransition) satisfies QuartzComponentConstructor
