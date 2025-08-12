import 'reflect-metadata'
import '@renderer/shared/styles/main.css'

import entry from './app.vue'
import { module } from './module'
import { i18n } from '@renderer/shared/i18n'
import { createRouter } from './router'
import { createApp } from 'vue'
import type { AppLoader } from '@renderer/shared/modules/loader'

await module.setup()

const app = createApp(entry)
const router = createRouter()

app.use(module)
app.use(router)
app.use(i18n)
app.mount('#app').$nextTick(onLoad)

function onLoad(): void {
  const loader = module.resolve<AppLoader>('AppLoader')
  const timeout = 300 // ms
  setTimeout(() => loader.loaded(), timeout)
}
