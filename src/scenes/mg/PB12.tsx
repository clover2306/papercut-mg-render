// Adegan MG-12 "Lima Penopang" (Dunia Sampai):
// Sebuah peron kertas dengan satu koin di atasnya, ditopang lima tiang yang muncul
// berurutan mengikuti narasi: anggaran terlihat, proyek bisa difoto, audit yang
// benar-benar memeriksa, hukuman yang membuat curang menjadi mahal, dan warga yang
// bertanya. Di akhir kelima tiang menyala bersama menahan peron dan koin.
// Ditulis langsung mengikuti pola PB08/PB09/PB10 setelah panggilan agy untuk adegan
// ini macet 23 menit tanpa menghasilkan file.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB12_DUR = 671;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet Dunia Sampai sesuai brief bagian 1.3
const PAL = {
  skyTop: '#F8D8B8',
  skyMid: '#F6E8CC',
  skyBot: '#CBE7E2',
  cream: '#F6E8CC',
  creamHi: '#FFF8EB',
  creamLo: '#DFCCA8',
  marigold: '#F2A93B',
  marigoldHi: '#FFD470',
  terracotta: '#D9683B',
  terracottaLo: '#B04E27',
  leaf: '#5E9C6B',
  leafLo: '#457A50',
  teal: '#2F8F8B',
  tealLo: '#216966',
  ink: '#3B2A20',
  floor: '#6D4932',
  windowGlow: '#FFE699',
  coinGold: '#F2A93B',
  coinHi: '#FFD470',
  coinLo: '#C77F1F',
};

// Koin kertas: bulat polos dengan cincin timbul, tanpa gambar, angka, atau lambang.
const Coin: React.FC<{x: number; y: number; d?: number; glow?: number; opacity?: number}> = ({x, y, d = 84, glow = 0.8, opacity = 1}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: d, height: d, translate: '-50% -50%',
      borderRadius: '50%', backgroundColor: PAL.coinGold, opacity,
      border: `4px solid ${PAL.coinLo}`,
      boxShadow: `0 0 ${Math.round(34 * glow)}px ${Math.round(16 * glow)}px rgba(242,169,59,${0.55 * glow}), inset 0 -6px 0 rgba(0,0,0,0.18), inset 0 6px 0 rgba(255,255,255,0.35)`,
    }}
  >
    <div
      style={{
        position: 'absolute', left: '50%', top: '50%', width: d * 0.62, height: d * 0.62,
        translate: '-50% -50%', borderRadius: '50%', border: `3px solid ${PAL.coinHi}`,
      }}
    />
  </div>
);

// Strip kertas bertuliskan teks yang diizinkan brief. `struck` = dicoret strip kertas.
const Strip: React.FC<{x: number; y: number; text: string; at: number; size?: number; rot?: number; seed: string; struck?: boolean}> = ({x, y, text, at, size = 40, rot = -2, seed, struck = false}) => (
  <PopIn at={at} seed={seed}>
    <Boil seed={seed} amp={0.35} rot={0.05}>
      <div
        style={{
          position: 'absolute', left: x, top: y, translate: '-50% -50%', rotate: `${rot}deg`,
          backgroundColor: PAL.creamHi, padding: '14px 26px 16px', whiteSpace: 'nowrap',
          fontFamily: FONT.banner, fontSize: size, lineHeight: 1.06, color: PAL.ink,
          border: `3px solid ${PAL.ink}`,
          textDecoration: struck ? 'line-through' : 'none',
          textDecorationThickness: 5,
          textDecorationColor: PAL.terracotta,
          filter: 'url(#rough) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
        }}
      >
        {text}
        <div style={{position: 'absolute', top: -10, left: -14, width: 46, height: 16, rotate: '-28deg', backgroundColor: C.tape, opacity: 0.85}} />
        <div style={{position: 'absolute', top: -10, right: -14, width: 46, height: 16, rotate: '28deg', backgroundColor: C.tape, opacity: 0.85}} />
      </div>
    </Boil>
  </PopIn>
);

// Bingkai panggung: lengkung atas dan tiang samping, konsisten dengan PB09/PB10.
const ProsceniumFrame: React.FC = () => (
  <>
    <Slab x={0} y={0} w={1280} h={26} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <Slab x={0} y={0} w={26} h={720} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <Slab x={1254} y={0} w={26} h={720} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <div style={{position: 'absolute', left: 0, top: 26, width: 120, height: 60, background: PAL.terracotta, borderRadius: '0 0 60px 0', opacity: 0.9}} />
    <div style={{position: 'absolute', right: 0, top: 26, width: 120, height: 60, background: PAL.terracotta, borderRadius: '0 0 0 60px', opacity: 0.9}} />
  </>
);

// Langit pagi + bukit + lantai panggung Dunia Sampai.
const SampaiBackdrop: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${PAL.skyTop} 0%, ${PAL.skyMid} 46%, ${PAL.skyBot} 78%, ${PAL.cream} 100%)`}} />
    <div style={{position: 'absolute', left: -80, top: 300, width: 760, height: 260, borderRadius: '50%', background: PAL.leaf, opacity: 0.55}} />
    <div style={{position: 'absolute', left: 560, top: 330, width: 820, height: 260, borderRadius: '50%', background: PAL.teal, opacity: 0.5}} />
    <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={PAL.floor} shade="#4E3220" shadeH={0.3} r={0} grain={0.6} />
    <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 40, height: 3, background: 'rgba(0,0,0,0.25)'}} />
  </>
);

// Posisi tiang (pusat x) dan jendela kemunculannya.
const PILLARS = [
  {x: 240, rise: [10, 60] as const},
  {x: 440, rise: [144, 194] as const},
  {x: 640, rise: [268, 318] as const},
  {x: 840, rise: [402, 452] as const},
  {x: 1040, rise: [539, 589] as const},
];

// =========================================================================
// VIGNETTE 1 (Frame 0-113): anggaran terlihat — buku besar transparan berisi
// baris koin; jejak koin mengalir dari atas ke bawah; koin terakhir berpendar.
// =========================================================================
const VLedger: React.FC<{f: number}> = ({f}) => {
  const trailY = interpolate(f, [20, 100], [180, 330], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const lastGlow = interpolate(f, [90, 113], [0.4, 1], CLAMP);
  return (
    <>
      <Paper>
        <Slab x={420} y={150} w={220} h={230} color={PAL.creamHi} shade={PAL.creamLo} r={8} grain={0.5} />
        <Slab x={640} y={150} w={220} h={230} color={PAL.creamHi} shade={PAL.creamLo} r={8} grain={0.5} />
      </Paper>
      <div style={{position: 'absolute', left: 638, top: 150, width: 4, height: 230, background: PAL.ink, opacity: 0.4}} />
      {/* Baris-baris koin di kedua halaman */}
      {[190, 230, 270, 310].map((y) => (
        <React.Fragment key={y}>
          <div style={{position: 'absolute', left: 450, top: y, width: 160, height: 10, background: PAL.creamLo, borderRadius: 5}} />
          <div style={{position: 'absolute', left: 670, top: y, width: 160, height: 10, background: PAL.creamLo, borderRadius: 5}} />
        </React.Fragment>
      ))}
      {[470, 540, 610, 680, 750, 810].map((x) => (
        <div key={x} style={{position: 'absolute', left: x, top: 205, width: 34, height: 34, borderRadius: '50%', background: PAL.coinGold, border: `3px solid ${PAL.coinLo}`}} />
      ))}
      {/* Jejak koin mengalir ke bawah; koin terakhir berpendar */}
      <Coin x={800} y={trailY} d={40} glow={0.5} />
      <Coin x={800} y={348} d={52} glow={lastGlow} />
      <Strip x={640} y={104} text="sampai ke rupiah terakhir" at={12} size={38} rot={-2} seed="rupiah-terakhir" />
    </>
  );
};

// =========================================================================
// VIGNETTE 2 (Frame 134-242): proyek bisa difoto — menara + rumah warga di
// sebelahnya; bingkai bidik kamera mengurung menara; kilatan cahaya sekali.
// =========================================================================
const VPhoto: React.FC<{f: number}> = ({f}) => {
  const flash = interpolate(f, [200, 206], [0, 1], CLAMP) * interpolate(f, [206, 226], [1, 0], CLAMP);
  const frameIn = interpolate(f, [150, 170], [0, 1], CLAMP);
  return (
    <>
      {/* Menara kertas */}
      <div style={{position: 'absolute', left: 560, top: 180, width: 120, height: 240}}>
        <div style={{position: 'absolute', left: 20, top: 0, width: 80, height: 240, background: PAL.creamHi, border: `3px solid ${PAL.ink}`, clipPath: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)'}} />
        <div style={{position: 'absolute', left: 0, top: 80, width: 120, height: 12, background: PAL.terracotta}} />
        <div style={{position: 'absolute', left: 0, top: 160, width: 120, height: 12, background: PAL.terracotta}} />
        <div style={{position: 'absolute', left: 52, top: -34, width: 18, height: 34, background: PAL.ink, borderRadius: '50%'}} />
      </div>
      {/* Rumah warga di sebelahnya */}
      <Slab x={760} y={300} w={150} h={120} color={PAL.cream} shade={PAL.creamLo} r={6} grain={0.5} />
      <div style={{position: 'absolute', left: 750, top: 272, width: 170, height: 40, background: PAL.terracotta, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}} />
      <div style={{position: 'absolute', left: 800, top: 330, width: 40, height: 46, background: PAL.windowGlow, border: `3px solid ${PAL.ink}`, borderRadius: 4}} />
      {/* Bingkai bidik kamera mengurung menara */}
      <div style={{position: 'absolute', left: 520, top: 140, width: 200, height: 300, opacity: frameIn}}>
        {[
          {left: 0, top: 0, borderRight: 'none', borderBottom: 'none'},
          {right: 0, top: 0, borderLeft: 'none', borderBottom: 'none'},
          {left: 0, bottom: 0, borderRight: 'none', borderTop: 'none'},
          {right: 0, bottom: 0, borderLeft: 'none', borderTop: 'none'},
        ].map((p, i) => (
          <div key={i} style={{position: 'absolute', width: 52, height: 52, border: `6px solid ${PAL.ink}`, ...p}} />
        ))}
      </div>
      {/* Kilatan cahaya bidikan */}
      <div style={{position: 'absolute', left: 620, top: 290, width: 130, height: 130, translate: '-50% -50%', borderRadius: '50%', background: '#FFFBEA', opacity: flash * 0.9, boxShadow: '0 0 60px 30px rgba(255,251,234,0.8)'}} />
      <Strip x={640} y={104} text="difoto" at={146} size={40} rot={2} seed="difoto" />
    </>
  );
};

// =========================================================================
// VIGNETTE 3 (Frame 258-392): audit yang benar-benar memeriksa — kaca pembesar
// membuka map dan memperlihatkan koin di dalamnya; stempel yang hanya mencap
// map tertutup terdorong keluar.
// =========================================================================
const VAudit: React.FC<{f: number}> = ({f}) => {
  // Map terbuka (halaman naik), kaca pembesar bergerak di atasnya.
  const lensX = interpolate(f, [280, 360], [520, 720], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const lensY = interpolate(f, [280, 360], [330, 250], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  // Stempel pada map tertutup terdorong keluar ke kanan dan memudar.
  const stampX = interpolate(f, [330, 390], [0, 260], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const stampO = interpolate(f, [360, 392], [1, 0], CLAMP);
  return (
    <>
      {/* Map terbuka */}
      <Paper>
        <Slab x={440} y={190} w={400} h={210} color={PAL.creamHi} shade={PAL.creamLo} r={8} grain={0.5} />
      </Paper>
      <div style={{position: 'absolute', left: 470, top: 220, width: 340, height: 12, background: PAL.creamLo, borderRadius: 6}} />
      <div style={{position: 'absolute', left: 470, top: 250, width: 260, height: 12, background: PAL.creamLo, borderRadius: 6}} />
      <div style={{position: 'absolute', left: 470, top: 280, width: 300, height: 12, background: PAL.creamLo, borderRadius: 6}} />
      <Coin x={760} y={340} d={64} glow={0.9} />
      {/* Kaca pembesar */}
      <div style={{position: 'absolute', left: lensX, top: lensY, width: 150, height: 150, translate: '-50% -50%', borderRadius: '50%', border: `10px solid ${PAL.ink}`, background: 'rgba(255,248,235,0.25)', boxShadow: '0 0 30px 8px rgba(255,230,153,0.35)'}} />
      <div style={{position: 'absolute', left: lensX + 62, top: lensY + 62, width: 90, height: 16, rotate: '45deg', background: PAL.ink, borderRadius: 8}} />
      {/* Map tertutup + stempel, terdorong keluar */}
      <div style={{position: 'absolute', left: 920 + stampX, top: 250, opacity: stampO}}>
        <Slab x={0} y={0} w={220} h={150} color={PAL.creamLo} shade="#A68F6E" r={8} grain={0.5} />
        <div style={{position: 'absolute', left: 60, top: 46, width: 100, height: 58, border: `5px solid ${PAL.terracotta}`, borderRadius: 8, rotate: '-8deg', opacity: 0.85}} />
      </div>
      <Strip x={400} y={104} text="benar-benar memeriksa" at={270} size={30} rot={-2} seed="memeriksa" />
      <Strip x={960} y={104} text="sekadar menandatangani" at={330} size={24} rot={2} seed="menandatangani" struck />
    </>
  );
};

// =========================================================================
// VIGNETTE 4 (Frame 392-509): hukuman membuat curang menjadi mahal — label harga
// pada kotak berayun dari rendah ke tinggi; "murah" dicoret, "mahal" tampil.
// =========================================================================
const VPrice: React.FC<{f: number}> = ({f}) => {
  // Label harga naik dari posisi rendah ke tinggi.
  const tagY = interpolate(f, [410, 490], [350, 210], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const tagTilt = interpolate(f, [410, 490], [-14, 6], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  return (
    <>
      {/* Kotak kertas polos (gema timbangan: kotak "curang" tanpa tulisan besar) */}
      <Paper>
        <Slab x={520} y={260} w={240} h={160} color={PAL.cream} shade={PAL.creamLo} r={8} grain={0.5} />
        <div style={{position: 'absolute', left: 520, top: 260, width: 240, height: 22, background: PAL.terracotta, borderRadius: '8px 8px 0 0'}} />
      </Paper>
      <div style={{position: 'absolute', left: 560, top: 330, width: 80, height: 60, borderRadius: '50%', background: PAL.coinGold, border: `3px solid ${PAL.coinLo}`}} />
      {/* Label harga berayun naik */}
      <div style={{position: 'absolute', left: 800, top: tagY, translate: '-50% 0', rotate: `${tagTilt}deg`, background: PAL.creamHi, border: `3px solid ${PAL.ink}`, padding: '10px 20px', fontFamily: FONT.banner, fontSize: 32, color: PAL.ink, filter: 'url(#rough) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'}}>
        mahal
      </div>
      <Strip x={420} y={330} text="murah" at={404} size={34} rot={-4} seed="murah" struck />
    </>
  );
};

// =========================================================================
// VIGNETTE 5 (Frame 529-671): warga bertanya — barisan siluet warga; gelembung
// ucapan bermunculan satu per satu tanpa berhenti (tanpa tanda tanya).
// =========================================================================
const VAsk: React.FC<{f: number}> = ({f}) => {
  const bubble = (at: number) => interpolate(f, [at, at + 18], [0, 1], CLAMP);
  return (
    <>
      <Figure x={330} y={470} s={0.95} shirt={PAL.leaf} />
      <Figure x={520} y={470} s={0.95} shirt={PAL.terracotta} />
      <Figure x={760} y={470} s={0.95} shirt={PAL.teal} />
      <Figure x={950} y={470} s={0.95} shirt={PAL.marigold} />
      {[
        {x: 330, y: 210, at: 545},
        {x: 640, y: 130, at: 585},
        {x: 950, y: 210, at: 625},
      ].map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x, top: b.y, translate: '-50% -50%', opacity: bubble(b.at), background: PAL.creamHi, border: `3px solid ${PAL.ink}`, borderRadius: 18, padding: '12px 20px', fontFamily: FONT.caption, fontWeight: 800, fontSize: 26, color: PAL.ink, whiteSpace: 'nowrap', filter: 'url(#rough) drop-shadow(2px 5px 7px rgba(0,0,0,0.3))'}}>
          ke mana perginya uang mereka
          <div style={{position: 'absolute', left: '50%', bottom: -14, width: 22, height: 22, background: PAL.creamHi, borderRight: `3px solid ${PAL.ink}`, borderBottom: `3px solid ${PAL.ink}`, rotate: '45deg', translate: '-50% 0'}} />
        </div>
      ))}
    </>
  );
};

export const PB12: React.FC = () => {
  const rawF = useCurrentFrame();
  // Rasa gerak mulus 24 gambar per detik khas Dunia Sampai
  const f = Math.round((rawF * 24) / 30) * (30 / 24);

  // Kamera maju pelan sepanjang adegan
  const camScale = interpolate(f, [0, PB12_DUR], [1, 1.04], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const camLiftY = interpolate(f, [0, PB12_DUR], [0, -10], {...CLAMP, easing: Easing.inOut(Easing.sin)});

  // Tiang naik satu per satu; di akhir semuanya menyala bersama.
  const pillarProg = (a: number, b: number) => interpolate(f, [a, b], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.2))});
  const finale = interpolate(f, [630, 671], [0, 1], CLAMP);
  const coinGlow = 0.7 + 0.3 * finale;

  // Vignette tampil bergantian di area atas panggung.
  const v1o = interpolate(f, [100, 122], [1, 0], CLAMP);
  const v2o = interpolate(f, [134, 152], [0, 1], CLAMP) * interpolate(f, [228, 250], [1, 0], CLAMP);
  const v3o = interpolate(f, [258, 276], [0, 1], CLAMP) * interpolate(f, [378, 398], [1, 0], CLAMP);
  const v4o = interpolate(f, [392, 410], [0, 1], CLAMP) * interpolate(f, [495, 515], [1, 0], CLAMP);
  const v5o = interpolate(f, [529, 547], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: PAL.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.2} flicker={0.18}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${camScale}) translateY(${camLiftY}px)`, transformOrigin: '50% 45%'}}>
          <SampaiBackdrop />
          <div style={{position: 'absolute', left: 180, top: 70, width: 90, height: 90, borderRadius: '50%', background: PAL.marigoldHi, boxShadow: '0 0 50px 20px rgba(242,169,59,0.4)'}} />
          {/* Area vignette bergantian */}
          <AbsoluteFill style={{opacity: v1o}}>
            <VLedger f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: v2o}}>
            <VPhoto f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: v3o}}>
            <VAudit f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: v4o}}>
            <VPrice f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: v5o}}>
            <VAsk f={f} />
          </AbsoluteFill>
          {/* Peron + koin di atasnya */}
          <Paper>
            <Slab x={140} y={440} w={1000} h={36} color={PAL.cream} shade={PAL.creamLo} r={8} grain={0.5} />
          </Paper>
          <Coin x={640} y={398} d={80} glow={coinGlow} />
          {/* Lima tiang penopang */}
          {PILLARS.map((p, i) => {
            const prog = pillarProg(p.rise[0], p.rise[1]);
            const h = Math.round(124 * prog);
            return (
              <div key={i} style={{position: 'absolute', left: p.x - 55, top: 600 - h, width: 110, height: h, opacity: prog > 0 ? 1 : 0}}>
                <Slab x={0} y={0} w={110} h={h} color={finale > 0 ? PAL.marigold : PAL.teal} shade={finale > 0 ? PAL.coinLo : PAL.tealLo} hi={finale > 0 ? PAL.marigoldHi : undefined} r={8} grain={0.5} />
                <div style={{position: 'absolute', inset: 0, background: `rgba(242,169,59,${0.45 * finale})`, borderRadius: 8}} />
              </div>
            );
          })}
          <ProsceniumFrame />
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
