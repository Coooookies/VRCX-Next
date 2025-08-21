import { onMounted, onUnmounted, provide, ref } from 'vue'

export function useElapsedTimer() {
  const currentTime = ref(Date.now())
  const handleTimeUpdate = () => {
    currentTime.value = Date.now()
  }

  let timer: number | null = null

  provide('elapsedTimer', {
    currentTime
  })

  onMounted(() => {
    timer = window.setInterval(handleTimeUpdate, 1000)
  })

  onUnmounted(() => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  })
}
