import 'reflect-metadata'

import App from './App.vue'
import { createApp } from 'vue'
import { module } from './module'
import type { AppLoader } from '@renderer/shared/modules/loader'

const app = createApp(App)

app.use(module)

await module.setup()

app.mount('#app').$nextTick(onLoad)

function onLoad(): void {
  const loader = module.resolve<AppLoader>('AppLoader')
  const timeout = 300 // ms
  setTimeout(() => loader.loaded(), timeout)
}
