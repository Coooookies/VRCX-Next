<script setup lang="ts">
import { useModule } from '@renderer/shared/hook/use-module'
import { IPCRenderer } from '@renderer/shared/modules/ipc'

const ipc = useModule<IPCRenderer>('IPCRenderer')

ipc.listener.on('text', (_, argsA) => {
  console.log('hello', argsA)
})

function invoke(): void {
  ipc.emitter.invoke('test-invoke', 'helloworld').then((chars) => {
    console.log('hi', chars)
    ipc.emitter.send('ping', 123)
  })
}
</script>

<template>
  <button @click="invoke">Invoke</button>
</template>
