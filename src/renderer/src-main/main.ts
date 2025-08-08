import 'reflect-metadata'
import '@renderer/shared/styles/main.css'

import entry from './app.vue'
import { module } from './module'
import { createApp } from 'vue'
import type { AppLoader } from '@renderer/shared/modules/loader'

await module.setup()

const app = createApp(entry)
app.use(module)
app.mount('#app').$nextTick(onLoad)

function onLoad(): void {
  const loader = module.resolve<AppLoader>('AppLoader')
  const timeout = 300 // ms
  setTimeout(() => loader.loaded(), timeout)
}
