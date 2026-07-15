import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.PageTransition(),
    Component.Signature(), // Signature above backlinks
    Component.Backlinks(), // Moved from right sidebar to below content
    Component.PrevNext(),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "200 Meters",
      spacerSymbol: "→",
    }),
    Component.Flex({
      components: [
        {
          Component: Component.PageTitle(),
          grow: true,
          align: "start",
        },
        { Component: Component.Search(), align: "start" },
        { Component: Component.Graph(), align: "start" },
        { Component: Component.Darkmode(), align: "start" },
      ],
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    // Component.TagList(), // Removed - tags appear at bottom of notes only
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      filterFn: (node) => {
        return node.slugSegment !== "tags"
      },
    }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      filterFn: (node) => {
        // Only show Published folder and its contents
        if (node.slugSegment === "tags") return false
        if (node.name === "Published") return true
        if (node.fullPath?.startsWith("Published/")) return true
        return false
      },
    }),
  ],
  right: [],
}
