import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'KMEHR-Tests',
  tagline: 'Comprehensive Testing Suite for Belgian KMEHR Standards',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: process.env.GITHUB_ORIGIN || "http://localhost:3000",
  baseUrl: process.env.GITHUB_BASE || "/",

  organizationName: 'smals-jy',
  projectName: 'KMEHR-tests',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn', // Moved from markdown.hooks for standard practice

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    // Docusaurus 3+ uses MDX 3, which is more strict about CommonMark specs
    format: 'detect',
    hooks: {
          onBrokenMarkdownLinks: 'warn'
    }
  },

  // Mermaid is a theme, but it also requires the markdown setting above
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/smals-jy/KMEHR-tests/tree/main/documentation/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Algolia configuration remains the same
    algolia: {
      appId: '01EEAZMA4Z',
      apiKey: '9122cf65f23c2c1c43e2115c201c8302',
      indexName: 'smals-jyio',
      contextualSearch: true, // Recommended for better results
    },
    navbar: {
      title: 'KMEHR-tests',
      logo: {
        alt: 'KMEHR-tests',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/smals-jy/KMEHR-tests',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} KMEHR-tests. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      // 'markup' includes XML/HTML, which is essential for KMEHR files
      additionalLanguages: ["bash", "markup", "typescript", "properties", "json"],
    },
    // Added specific mermaid config for better visual control in 3.10
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
