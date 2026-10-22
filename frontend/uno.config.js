import { defineConfig, transformerDirectives } from 'unocss'
import { presetVuetify } from 'unocss-preset-vuetify'

export default defineConfig({
  presets: [
    presetVuetify({
      font: {
        heading: '"IBM Plex Sans", system-ui, sans-serif',
        body: '"IBM Plex Sans", system-ui, sans-serif',
        mono: '"IBM Plex Mono", ui-monospace, monospace',
      },
      typography: 'md3',
      elevation: 'md3',
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    ...Array.from({ length: 6 }, (_, i) => `elevation-${i}`),
    ...['', '-0', '-sm', '-lg', '-xl', '-pill', '-circle', '-shaped'].map(suffix => `rounded${suffix}`),
  ],
  outputToCssLayers: {
    cssLayerName: layer => layer === 'properties' ? null : `uno.${layer}`,
  },
})
