import { createVuetify } from 'vuetify'
import 'vuetify/styles'
// MDI CSS import 제거 (에러 방지)

export default createVuetify({
  icons: {
    defaultSet: 'mdi', // Material Design Icons 사용
  },
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
