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
      title: "Thoughts",
      // Option 1: Only show files with specific tag
      // filterFn: (node) => {
      //   return node.data?.tags?.includes("published") === true
      // },

      // Option 2: Only show files from specific folders
      // filterFn: (node) => {
      //   const allowedFolders = ["notes", "essays"]
      //   return allowedFolders.some(folder => node.fullPath?.includes(folder))
      // },

      // Option 3: Exclude specific files/folders (current default + custom)
      filterFn: (node) => {
        // Default: exclude "tags" folder
        if (node.slugSegment === "tags") return false

        // Add your exclusions here:
        // Exclude specific files by name
        const excludedFiles = ["private", "draft", "temp"]
        if (excludedFiles.some(name => node.displayName?.toLowerCase().includes(name))) {
          return false
        }

        // Exclude specific folders
        const excludedFolders = ["Archive", "Private"]
        if (excludedFolders.includes(node.displayName)) {
          return false
        }

        return true // Show everything else
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
      title: "Thoughts",
    }),
  ],
  right: [],
}
