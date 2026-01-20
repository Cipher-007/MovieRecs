import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    nitro({
      preset: 'vercel',
      rollupConfig: {
        external: [
          '@libsql/linux-x64-gnu',
          '@libsql/linux-x64-musl',
          '@libsql/linux-arm64-gnu',
          '@libsql/linux-arm64-musl',
          '@libsql/darwin-x64',
          '@libsql/darwin-arm64',
          '@libsql/win32-x64-msvc',
          'libsql',
        ],
      },
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config

