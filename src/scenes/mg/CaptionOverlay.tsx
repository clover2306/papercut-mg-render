// Caption overlay untuk video penuh Pajak Bijak: lapisan TRANSPARAN
// (tanpa latar) yang di-render terpisah lalu di-overlay di ffmpeg.
// Gaya hybrid yang di-ACC Bos (demo2c): halaman 4-5 kata (pageWords
// repo, maks 5), spasi rapat, tag kertas sobek HANYA di kata yang
// sedang diucapkan, kata lain polos putih ber-outline.
// Band bawah (0.83) untuk semua scene — band MG yang terangkat (0.72)
// dihapus atas koreksi Bos 2026-11-15 ("caption di bagian MG kurang
// turun"): caption MG kini sejajar caption scene gambar.
import React from 'react';
import {AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C, FONT} from '../../lib/tokens';
import {GRAIN, PaperDefs} from '../../lib/paper/kit';
import {pageWords} from '../../lib/paper/overlays';
import wordsJson from './caption_words.json';
import bandsJson from './caption_bands.json';

const captions = wordsJson as Caption[];
const BANDS = bandsJson as [number, number][];

const BAND_DEFAULT = 0.83;
const BAND_MG = 0.83;

const OUTLINE =
  '2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, ' +
  '1.5px 1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px -1.5px 0 #000';

const inMg = (ms: number) => BANDS.some(([a, b]) => ms >= a && ms < b);

export const CAPTION_OVERLAY_DUR = 16795; // 559.8s @30fps

export const CaptionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const pages = React.useMemo(() => pageWords(captions, 5), []);
  const page = pages.find((p) => ms >= p.startMs - 40 && ms < p.endMs);
  if (!page) {
    return (
      <AbsoluteFill>
        <PaperDefs />
      </AbsoluteFill>
    );
  }
  let active = 0;
  page.words.forEach((w, i) => {
    if (ms >= w.startMs - 40) active = i;
  });
  const at = Math.round((page.words[active].startMs / 1000) * fps) - 1;
  const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 260, mass: 0.5}});
  const band = inMg(page.startMs) ? BAND_MG : BAND_DEFAULT;
  return (
    <AbsoluteFill>
      <PaperDefs />
      <div key={page.startMs} style={{position: 'absolute', top: 720 * band, left: 90, right: 90, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px 2px'}}>
        {page.words.map((w, i) => {
          const word = w.text.trim();
          const isActive = i === active;
          const key = `${w.startMs}-${w.text}`;
          return (
            <div key={key} style={{
              fontFamily: FONT.caption, fontWeight: 900, fontSize: 40, lineHeight: 1.15,
              padding: '4px 6px 6px',
              color: isActive ? C.tagText : '#FFFFFF',
              textShadow: isActive ? undefined : OUTLINE,
              backgroundColor: isActive ? C.tag : 'transparent',
              backgroundImage: isActive ? `url(${GRAIN})` : undefined,
              backgroundSize: '420px', backgroundBlendMode: 'multiply',
              rotate: isActive ? `${(random(key) - 0.5) * 10}deg` : undefined,
              scale: isActive ? String(0.6 + 0.4 * s) : undefined,
              filter: isActive ? 'url(#torn) drop-shadow(2px 5px 6px rgba(0,0,0,0.38))' : undefined,
            }}>{word}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
