import { build } from 'esbuild'
import pkg from 'ncp'
const { ncp } = pkg
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.resolve(__dirname, 'src')
const distDir = path.resolve(__dirname, 'dist')

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true })
}

build({
  entryPoints: [path.join(srcDir, 'index.js')],
  bundle: true,
  outdir: distDir,
  minify: true,
  platform: 'node'
}).then(() => {
  ncp(path.join(srcDir, 'index.css'), path.join(distDir, 'index.css'))
  ncp(path.join(srcDir, 'index_mobile.css'), path.join(distDir, 'index_mobile.css'))
  ncp(path.join(srcDir, 'images'), path.join(distDir, 'images'))
  ncp(path.join(srcDir, 'font.woff2'), path.join(distDir, 'font.woff2'))
  ncp(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'))
  //ncp(path.join(srcDir, 'elements'), path.join(distDir, 'elements'))
  console.log("Build successful")
}).catch(() => process.exit(1))

