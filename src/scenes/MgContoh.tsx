// Contoh MG papercut landscape (1280x720) untuk 1 potongan scene kelas menengah:
// Scene 48-50: kelas menengah 57,33 jt (2019) -> 47,85 jt (2024), -9,48 jt keluar.
// Dibangun dari primitif kit yang dimension-agnostic (Slab/Paper/Pill/PopIn/Boil);
// TIDAK memakai Room/TapeBanner karena keduanya hardcode koordinat vertikal 1080x1920.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../lib/tokens';
import {Boil, CameraPush, GrainOverlay, Paper, PaperDefs, Pill, PopIn, Slab} from '../lib/paper/kit';
import {FilmWeave} from '../lib/paper/look';

// --- timing (frame @30fps, relatif terhadap awal potongan narasi t=152.90s).
// Dari transkrip whisper words.json (terverifikasi lawan naskah resmi):
// kalimat 48: 153.30-158.38, kalimat 49: 159.20-165.42, kalimat 50: 166.24-169.60. ---
export const MG_DUR = 519;
const CUES = {
  bar1: [12, 164] as const, // tumbuh + hitung naik selama kalimat 48
  bar2: [189, 376] as const, // tumbuh + hitung naik selama kalimat 49
  tag: 418, // pop saat kalimat 50 menyebut "sembilan juta" (166.82s)
};

const FLOOR_Y = 600;
const BAR1 = {cx: 450, w: 240, h: 330, color: '#2F5A5A', shade: '#234343', hi: '#3E6E6E', value: 57.33, year: '2019'};
const BAR2 = {cx: 830, w: 240, h: 275, color: C.hero, shade: C.heroLo, hi: '#E08A6F', value: 47.85, year: '2024'};

const fmt = (v: number) => v.toFixed(2).replace('.', ',');

const Bar: React.FC<{spec: typeof BAR1; cue: readonly [number, number]}> = ({spec, cue}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [cue[0], cue[1]], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const h = Math.max(0, Math.round(spec.h * u));
  const val = spec.value * u;
  // Label angka disembunyikan sebelum cue mulai, supaya tidak tampil "0,00 JUTA" di lantai.
  const labelOpacity = interpolate(f, [cue[0], cue[0] + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Paper>
        <Slab x={spec.cx - spec.w / 2} y={FLOOR_Y - h} w={spec.w} h={h} color={spec.color} shade={spec.shade} shadeH={0.14} hi={spec.hi} hiH={0.08} r={6} />
      </Paper>
      <div
        style={{
          position: 'absolute', left: spec.cx, top: FLOOR_Y - h - 82, translate: '-50% 0', whiteSpace: 'nowrap',
          fontFamily: FONT.caption, fontWeight: 900, fontSize: 58, color: C.ink, lineHeight: 1, opacity: labelOpacity,
          textShadow: '2px 3px 0 rgba(0,0,0,0.12)',
        }}
      >
        {fmt(val)} JUTA
      </div>
      <PopIn at={cue[0]}>
        <Pill x={spec.cx} y={FLOOR_Y + 46} text={spec.year} bg={C.ink} color="#F3EEE6" size={34} />
      </PopIn>
    </>
  );
};

export const MgContoh: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave>
        <CameraPush dur={MG_DUR} to={1.05} origin="50% 45%">
          {/* Dinding kertas krem + lantai kayu, digambar untuk 1280x720 */}
          <Slab x={0} y={0} w={1280} h={720} color={C.creamHi} r={0} grain={0.55} />
          <AbsoluteFill
            style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.30) 100%)'}}
          />
          <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 38, height: 3, background: C.floorLo, opacity: 0.8}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 78, height: 3, background: C.floorLo, opacity: 0.8}} />
          <Slab x={0} y={FLOOR_Y - 24} w={1280} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          <AbsoluteFill style={{top: FLOOR_Y, height: 60, background: 'linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0) 60px)'}} />

          {/* Banner judul gaya TapeBanner, diposisikan untuk landscape */}
          <PopIn at={0}>
            <Boil seed="banner">
              <div style={{position: 'absolute', top: 44, left: '50%', translate: '-50% 0', rotate: '-1deg'}}>
                <div
                  style={{
                    backgroundColor: C.cream, padding: '22px 40px 24px', textAlign: 'center',
                    fontFamily: FONT.banner, fontSize: 50, lineHeight: 1.05, color: C.ink,
                    letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.38))',
                  }}
                >
                  Kelas Menengah Menyusut
                </div>
                {[{left: -30, rotate: '-35deg'}, {right: -30, rotate: '35deg'}].map((p, i) => (
                  <div key={i} style={{position: 'absolute', top: -14, width: 110, height: 40, background: C.tape, opacity: 0.8, filter: 'url(#torn)', ...p}} />
                ))}
              </div>
            </Boil>
          </PopIn>

          {/* Dua batang + angka + pil tahun */}
          <Boil seed="bars" amp={1.2}>
            <Bar spec={BAR1} cue={CUES.bar1} />
            <Bar spec={BAR2} cue={CUES.bar2} />
          </Boil>

          {/* Tag penutup: selisihnya */}
          <PopIn at={CUES.tag}>
            <Boil seed="tag">
              <div
                style={{
                  position: 'absolute', left: 900, top: 158, translate: '-50% 0', rotate: '-2deg', whiteSpace: 'nowrap',
                  backgroundColor: C.tag, padding: '12px 24px 14px',
                  fontFamily: FONT.caption, fontWeight: 900, fontSize: 38, color: C.tagText, lineHeight: 1,
                  filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.38))',
                }}
              >
                -9,48 JUTA KELUAR
              </div>
            </Boil>
          </PopIn>
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
