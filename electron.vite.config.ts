import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'

const minify = process.env.NODE_ENV === 'production'

export default defineConfig({
  main: {
    plugins: [swcPlugin(), externalizeDepsPlugin()],
    build: {
      // minify
    },
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@main': resolve('src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      minify
    },
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [
      vue(),
      svgLoader({
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'prefixIds',
              params: {
                delim: '',
                prefix: () => `svg-`
              }
            }
          ]
        }
      }),
      tailwindcss(),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    build: {
      minify,
      rollupOptions: {
        input: {
          'main-window': resolve(__dirname, 'src/renderer/main.html')
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('reka-ui')) return 'vendor-reka-ui'
              if (id.includes('motion-v')) return 'vendor-motion-v'
              if (id.includes('vue-sonner')) return 'vendor-vue-sonner'
              if (id.includes('vue-i18n')) return 'vendor-vue-i18n'
              if (id.includes('vee-validate')) return 'vendor-vee-validate'
              if (id.includes('lodash')) return 'vendor-lodash'
              if (id.includes('zod')) return 'vendor-zod'
            }

            return
          }
        }
      }
    }
  }
})
