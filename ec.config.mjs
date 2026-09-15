import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  useDarkModeMediaQuery: false,
  plugins: [pluginLineNumbers()],
  defaultProps: {
    wrap: false,
    showLineNumbers: true,
    overridesByLang: {
      'bash,sh,shell': {
        showLineNumbers: false,
      },
    },
  },
  styleOverrides: {
    codeFontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    uiFontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
    borderRadius: '0.25rem',
    borderWidth: '1px',
    frames: {
      editorTabBarBackground: 'transparent',
    },
  },
  shiki: {
    bundledLangs: ['cmake', 'cpp', 'c', 'diff', 'bash', 'shell', 'ini'],
  },
});
