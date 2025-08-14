import 'reflect-metadata'
import 'vue-sonner/style.css'
import '@renderer/shared/styles/main.css'

import entry from './app.vue'
import { module } from './module'
import { i18n } from '@renderer/shared/locale'
import { createRouter } from './router'
import { createApp } from 'vue'
import type { AppLoader } from '@renderer/shared/modules/loader'

await module.setup()

const loader = module.resolve<AppLoader>('AppLoader')
const timeout = 300 // ms

const app = createApp(entry)
const router = createRouter()

app.use(module)
app.use(router)
app.use(i18n)
app.mount('#app').$nextTick(onLoad)

function onLoad(): void {
  setTimeout(() => loader.loaded(), timeout)
}
