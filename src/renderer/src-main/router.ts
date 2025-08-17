import { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import { module } from './module'
import { createRouter as createRouterInstance, createWebHashHistory } from 'vue-router'

export function createRouter() {
  const auth = module.resolve<VRChatAuthentication>('VRChatAuthentication')
  const router = createRouterInstance({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        redirect: {
          name: auth.state.value.type === 'authenticated' ? 'page-app' : 'page-auth'
        }
      },
      {
        path: '/auth',
        name: 'page-auth',
        component: () => import('./pages/auth.vue'),
        meta: {
          index: 0
        }
      },
      {
        path: '/app',
        name: 'page-app',
        component: () => import('./pages/app.vue'),
        redirect: { name: 'page-app-dashboard' },
        meta: {
          index: 1
        },
        children: [
          {
            path: 'dashboard',
            name: 'page-app-dashboard',
            component: () => import('./pages/dashboard.vue'),
            meta: {
              index: 0
            }
          },
          {
            path: 'favorites',
            name: 'page-app-favorites',
            component: () => import('./pages/favorites.vue'),
            meta: {
              index: 1
            }
          },
          {
            path: 'feed',
            name: 'page-app-feed',
            component: () => import('./pages/feed.vue'),
            meta: {
              index: 2
            }
          },
          {
            path: 'charts',
            name: 'page-app-charts',
            component: () => import('./pages/charts.vue'),
            meta: {
              index: 3
            }
          },
          {
            path: 'settings',
            name: 'page-app-settings',
            component: () => import('./pages/settings.vue'),
            meta: {
              index: 999
            }
          }
        ]
      }
    ]
  })

  router.afterEach((to, from) => {
    const fromIndex = from.meta.index || 0
    const toIndex = to.meta.index || 0
    to.meta.transition_type = toIndex > fromIndex ? 'top' : 'down'
  })

  auth.on('state:update', ({ type }) => {
    router.push({ name: type === 'authenticated' ? 'page-app' : 'page-auth' })
  })

  return router
}
