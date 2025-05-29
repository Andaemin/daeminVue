import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default createVuetify({
  defaults: {
    global: {
      style: {
        fontFamily: 'NanumSquareRound, NanumSquareNeo, sans-serif',
      },
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          basic: '#D32F2F',
          primary: '#3f51b5',
          cafnavy: '#3f51b5',
        },
      },
    },
  },
})
