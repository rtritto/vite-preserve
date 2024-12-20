import fs from 'node:fs'
import path from 'node:path'
import { build, type Plugin } from 'vite'

interface BundleFilesOptions {
  entry: string // File path to bundle
  outputDir: string // Base output directory (e.g., 'dist')
}

export default function bundleFilesPlugin(options: BundleFilesOptions): Plugin {
  return {
    name: 'vite-plugin-bundle-files',
    enforce: 'post',
    async buildStart() {
      const { entry, outputDir } = options

      const cwd = process.cwd()
      const entryFull = path.resolve(cwd, entry)
      const outFull = path.resolve(cwd, outputDir)

      const filepaths = fs.globSync('**/*.ts', { cwd: entryFull })

      // Generate output directories
      // for (const filepath of filepaths) {
      //   const targetFilepath = path.resolve(outFull, filepath)
      //   const targetDir = path.dirname(targetFilepath)
      //   fs.mkdirSync(targetDir, { recursive: true })
      // }
      // const entryFilepathFull = filepaths.map((filepath) => path.resolve(entryFull, filepath))

      // Create an input map for Rollup
      const entryFilepathFull = {} as Record<string, string>
      for (const filepath of filepaths) {
        // Use relative paths as keys to preserve directory structure
        const resolvedFilepath = path.resolve(entryFull, filepath).replaceAll('\\', '/').replaceAll('[', '\[').replaceAll(']', '\]')
        // const relativePath = path.relative(entryFull, resolvedFilepath)
        const relativePath = filepath.replace(/\.ts$/, '').replaceAll('\\', '/')
        entryFilepathFull[relativePath] = resolvedFilepath
      }

      console.log('entryFilepathFull: ', entryFilepathFull);

      // Run a build for each file
      await build({
        configFile: false, // Avoid conflicts with the main Vite config
        build: {
          ssr: true,
          target: 'esnext',
          rollupOptions: {
            input: entryFilepathFull,
            output: {
              dir: outFull, // Directory for this specific file
              format: 'esm',
              entryFileNames: '[name].mjs' // File name pattern
            }
          }
        }
      })
    }
  }
}
