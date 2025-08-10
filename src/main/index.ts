import 'reflect-metadata'

import { app } from 'electron'
import { logger } from './logger'
import { ModuleManager } from '@shared/module-constructor'
import { ProtocolServer } from './modules/protocol-server'
import { APP_MODULES } from './modules'
import { APP_NAME, APP_ID, APP_VERSION, APP_RUN_DIR, APP_SAVED_DIR } from './constants'

const modules = new ModuleManager()

modules.on('module:inited', (identifier) => {
  logger.info(`Module ${identifier} initialized`)
})

modules.on('module:destroyed', (identifier) => {
  logger.info(`Module ${identifier} destroyed`)
})

modules.on('module:load-complete', (count) => {
  logger.info(`All modules loaded: ${count}`)
})

function init(): void {
  ProtocolServer.registerProtocol()

  for (const [identifier, module] of Object.entries(APP_MODULES)) {
    modules.register(identifier, module)
  }

  app
    .whenReady()
    .then(() => modules.setup())
    .then(() => {})
    .catch((error) => {
      logger.fatal(`Error during module setup: ${error.message}`)
      modules.destroy()
      app.quit()
    })
}

logger.info('APP', `${APP_NAME}(${APP_ID})`, APP_VERSION)
logger.info('APP_RUN_DIR', APP_RUN_DIR)
logger.info('APP_SAVED_DIR', APP_SAVED_DIR)

init()
