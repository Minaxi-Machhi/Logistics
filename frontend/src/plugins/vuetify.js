/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import '../styles/layers.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#DC1F2E',
          'on-primary': '#FFFFFF',
          secondary: '#546270',
          accent: '#FCE4E6',
          background: '#F3F5F7',
          surface: '#FFFFFF',
          info: '#1D5FB4',
          success: '#12805C',
          warning: '#9A6200',
          error: '#B4261E',
          side: '#0F2233',
          'chart-a': '#2F6F9F',
          'chart-b': '#E08A00',
          'chart-c': '#12805C',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#F0646E',
          'on-primary': '#1A0508',
          secondary: '#A4B2BF',
          accent: '#3D1317',
          background: '#0C1721',
          surface: '#142331',
          info: '#7DB4F2',
          success: '#47C79B',
          warning: '#F0B75A',
          error: '#F08A82',
          side: '#08121A',
          'chart-a': '#5BA3D6',
          'chart-b': '#F0A22A',
          'chart-c': '#47C79B',
        },
      },
    },
  },
})
