const { build } = require('esbuild');
const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

build({
  entryPoints: [path.join(srcDir, 'index.js')],
  bundle: true,
  outdir: distDir,
  minify: true,
  platform: 'node'
}).then(() => {
  ncp(path.join(srcDir, 'index.css'), path.join(distDir, 'index.css'))
  ncp(path.join(srcDir, 'images'), path.join(distDir, 'images'))
  ncp(path.join(srcDir, 'font.woff2'), path.join(distDir, 'font.woff2'))
  ncp(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'))
  //ncp(path.join(srcDir, 'elements'), path.join(distDir, 'elements'))
  console.log("Build successful")
}).catch(() => process.exit(1));

