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
          name: "Inter",
          weights: [200, 300, 400, 600, 700],
          includeItalic: false,
        },
        body: {
          name: "Inter",
          weights: [200, 300, 400, 600, 700],
          includeItalic: false,
        },
        code: {
          name: "JetBrains Mono",
          weights: [300, 400],
          includeItalic: false,
        },
      },
      colors: {
        lightMode: {
          light: "#fffcee",
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
          secondary: "#48A9A6",
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
      Plugin.CustomOgImages({
        colorScheme: "lightMode",
      }),
    ],
  },
}

export default config
