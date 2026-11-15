// Render CaptionOverlay frames as PNG (with alpha) for a frame range.
// Usage: node tools/render-overlay-frames.mjs <start> <end> <outdir> [concurrency]
// PNG sequence -> QTRLE .mov is the alpha path: this sandbox's ffmpeg
// (and Remotion's VP9 stitch) silently drops the alpha plane for VP8/VP9,
// while QTRLE preserves it (verified 2026-11-15). The same script runs
// on GitHub Actions (render-overlay.yml) and locally.
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';

const [startArg, endArg, outDirArg, concArg] = process.argv.slice(2);
const start = Number(startArg);
const end = Number(endArg);
const outDir = path.resolve(outDirArg);
if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || !outDirArg) {
  console.error('usage: node tools/render-overlay-frames.mjs <start> <end> <outdir> [concurrency]');
  process.exit(2);
}

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'CaptionOverlay', inputProps: {}});
console.log(`composition: ${composition.id} ${composition.width}x${composition.height} ${composition.fps}fps dur=${composition.durationInFrames} frames ${start}-${end}`);

const t0 = Date.now();
await renderFrames({
  composition,
  serveUrl,
  onStart: () => {},
  onFrameUpdate: (rendered) => {
    if (rendered % 200 === 0) console.log(`  ${rendered} frames...`);
  },
  outputDir: outDir,
  inputProps: {},
  imageFormat: 'png',
  frameRange: [start, end],
  concurrency: concArg ? Number(concArg) : null,
  logLevel: 'error',
});
console.log(`done: frames ${start}-${end} -> ${outDir} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
