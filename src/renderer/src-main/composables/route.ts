import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useRouteForward() {
  const router = useRouter()
  const canGoBack = ref(!!window.history.state.back)
  const canGoForward = ref(false)

  router.afterEach(() => {
    const historyState = window.history.state
    canGoBack.value = !!window.history.state.back
    canGoForward.value = !!historyState.forward
  })

  function backRoute() {
    router.back()
  }

  function forwardRoute() {
    router.forward()
  }

  return { canGoBack, canGoForward, backRoute, forwardRoute }
}
