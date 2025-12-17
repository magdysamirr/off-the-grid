import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Magdy Samir: Off the Grid",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "magdysamir.online",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: {
          name: "JetBrains Mono",
          weights: [100, 200, 300, 400],
          includeItalic: false,
        },
        body: {
          name: "JetBrains Mono",
          weights: [100, 200, 300, 400],
          includeItalic: true,
        },
        code: {
          name: "JetBrains Mono",
          weights: [100, 200, 300, 400],
          includeItalic: false,
        },
      },
      colors: {
        lightMode: {
          light: "#FFFAE4",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#717689",
          dark: "#434459",
          secondary: "#3fa2a0",
          tertiary: "#717689",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#171819",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#EBE0C6",
          dark: "#EBE0C6",
          secondary: "#d8c193",
          tertiary: "#FAE2C8",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      // Plugin.AliasRedirects(), // Disabled - aliases removed
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages due to Noto Sans Arabic font incompatibility
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
