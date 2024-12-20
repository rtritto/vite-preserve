import path from 'node:path'
import type { UserConfig } from 'vite'
import bundleFilesPlugin from './vitePluginApi'

export default {
  cacheDir: path.resolve(import.meta.dirname, '.vite'),
  plugins: [
    bundleFilesPlugin({
      entry: 'server/api',
      outputDir: 'dist/server/api'
    })
  ]
} satisfies UserConfig
