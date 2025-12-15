import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Backlinks(), // Moved from right sidebar to below content
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
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      filterFn: (node) => {
        // Exclude tags folder
        if (node.slugSegment === "tags") return false

        // Show the Published folder
        if (node.name === "Published" || node.displayName === "Published") {
          return true
        }

        // Show everything inside the Published folder (files and subfolders)
        if (node.fullPath?.includes("Published/")) {
          return true
        }

        // Hide everything else (root level files and other folders)
        return false
      },
      mapFn: (node) => {
        // Rename "Published" folder to "Thoughts"
        if (node.name === "Published" || node.displayName === "Published") {
          node.displayNameOverride = "Thoughts"
        }
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
        // Exclude tags folder
        if (node.slugSegment === "tags") return false

        // Show the Published folder
        if (node.name === "Published" || node.displayName === "Published") {
          return true
        }

        // Show everything inside the Published folder (files and subfolders)
        if (node.fullPath?.includes("Published/")) {
          return true
        }

        // Hide everything else (root level files and other folders)
        return false
      },
      mapFn: (node) => {
        // Rename "Published" folder to "Thoughts"
        if (node.name === "Published" || node.displayName === "Published") {
          node.displayNameOverride = "Thoughts"
        }
      },
    }),
  ],
  right: [],
}
