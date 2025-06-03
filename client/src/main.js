import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import vuetify from './plugins/vuetify'
import router from './router'
import { createPinia } from 'pinia'
import './assets/base.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(vuetify)
// app.use(createPinia())
app.mount('#app')
