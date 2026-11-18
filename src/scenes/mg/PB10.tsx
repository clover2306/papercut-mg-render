// Adegan MG-10 "Satu Rupiah, Berkali-kali" (Dunia Sampai):
// Satu koin emas yang sama bekerja berkali-kali — jalan yang baik menurunkan ongkos
// angkut dan harga di pasar, internet menyamakan belajar anak desa dan anak kota,
// puskesmas yang berfungsi, lalu koin yang sama melompat dari stasiun ke stasiun
// dan kembali ke tempat asalnya. JANGAN menggandakan koin.
// Ditulis langsung mengikuti pola PB08/PB09 setelah dua panggilan agy untuk adegan
// ini macet tanpa menghasilkan file (28 mnt + 17 mnt).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB10_DUR = 590;

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
  floorHi: '#8D6145',
  road: '#9A8A76',
  roadLo: '#7A6A56',
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

// Strip kertas bertuliskan teks yang diizinkan brief (PopIn + Boil, seperti PB09).
const Strip: React.FC<{x: number; y: number; text: string; at: number; size?: number; rot?: number; seed: string}> = ({x, y, text, at, size = 40, rot = -2, seed}) => (
  <PopIn at={at} seed={seed}>
    <Boil seed={seed} amp={0.35} rot={0.05}>
      <div
        style={{
          position: 'absolute', left: x, top: y, translate: '-50% -50%', rotate: `${rot}deg`,
          backgroundColor: PAL.creamHi, padding: '14px 26px 16px', whiteSpace: 'nowrap',
          fontFamily: FONT.banner, fontSize: size, lineHeight: 1.06, color: PAL.ink,
          border: `3px solid ${PAL.ink}`,
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

// Bingkai panggung: lengkung atas dan tiang samping, konsisten dengan PB09.
const ProsceniumFrame: React.FC = () => (
  <>
    <Slab x={0} y={0} w={1280} h={26} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <Slab x={0} y={0} w={26} h={720} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <Slab x={1254} y={0} w={26} h={720} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} grain={0.4} />
    <div style={{position: 'absolute', left: 0, top: 26, width: 120, height: 60, background: PAL.terracotta, borderRadius: '0 0 60px 0', opacity: 0.9}} />
    <div style={{position: 'absolute', right: 0, top: 26, width: 120, height: 60, background: PAL.terracotta, borderRadius: '0 0 0 60px', opacity: 0.9}} />
  </>
);

// Langit pagi + bukit + lantai panggung Dunia Sampai (dipakai semua beat).
const SampaiBackdrop: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${PAL.skyTop} 0%, ${PAL.skyMid} 46%, ${PAL.skyBot} 78%, ${PAL.cream} 100%)`}} />
    <div style={{position: 'absolute', left: -80, top: 300, width: 760, height: 260, borderRadius: '50%', background: PAL.leaf, opacity: 0.55}} />
    <div style={{position: 'absolute', left: 560, top: 330, width: 820, height: 260, borderRadius: '50%', background: PAL.teal, opacity: 0.5}} />
    <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={PAL.floor} shade="#4E3220" shadeH={0.3} r={0} grain={0.6} />
    <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 40, height: 3, background: 'rgba(0,0,0,0.25)'}} />
  </>
);

// =========================================================================
// BEAT 1 (Frame 0-154): jalan yang baik, ongkos angkut turun, harga di pasar turun.
// Satu koin emas jatuh ke ujung jalan mulus; truk melaju dengan label yang mengecil;
// label harga di lapak miring menurun dengan panah ke bawah (tanpa angka).
// =========================================================================
const BeatRoad: React.FC<{f: number}> = ({f}) => {
  // Koin jatuh ke ujung jalan lalu berpendar di sana.
  const coinY = interpolate(f, [2, 26], [110, 478], {...CLAMP, easing: Easing.out(Easing.bounce)});
  const coinGlow = interpolate(f, [26, 60], [0.5, 1], CLAMP);
  const coinFade = interpolate(f, [138, 154], [1, 0], CLAMP);
  // Truk melaju dari kiri ke tengah panggung.
  const truckX = interpolate(f, [20, 140], [-280, 560], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const labelShrink = interpolate(f, [40, 130], [1, 0.7], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  // Label harga di lapak miring menurun; panah ke bawah tumbuh.
  const priceTilt = interpolate(f, [60, 140], [0, 14], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const priceDrop = interpolate(f, [60, 140], [0, 26], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const arrowH = interpolate(f, [80, 140], [0, 64], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <>
      <SampaiBackdrop />
      {/* Matahari pagi */}
      <div style={{position: 'absolute', left: 180, top: 90, width: 110, height: 110, borderRadius: '50%', background: PAL.marigoldHi, boxShadow: '0 0 60px 24px rgba(242,169,59,0.45)'}} />
      {/* Jalan mulus melintang panggung */}
      <Paper>
        <Slab x={0} y={520} w={1280} h={80} color={PAL.road} shade={PAL.roadLo} shadeH={0.25} r={0} grain={0.5} />
      </Paper>
      {Array.from({length: 12}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 60 + i * 106, top: 556, width: 58, height: 8, background: PAL.creamHi, opacity: 0.85, borderRadius: 4}} />
      ))}
      <Coin x={170} y={coinY} d={84} glow={coinGlow} opacity={coinFade} />
      {/* Truk kertas */}
      <div style={{position: 'absolute', left: truckX, top: 470, width: 340, height: 130}}>
        <Slab x={0} y={18} w={220} h={72} color={PAL.teal} shade={PAL.tealLo} r={8} grain={0.5} />
        <Slab x={220} y={38} w={90} h={52} color={PAL.terracotta} shade={PAL.terracottaLo} r={8} grain={0.5} />
        <div style={{position: 'absolute', left: 236, top: 48, width: 58, height: 30, background: PAL.windowGlow, borderRadius: 4, border: `3px solid ${PAL.ink}`}} />
        <div style={{position: 'absolute', left: 48, top: 88, width: 44, height: 44, borderRadius: '50%', background: PAL.ink, border: '5px solid #5A4636'}} />
        <div style={{position: 'absolute', left: 250, top: 88, width: 44, height: 44, borderRadius: '50%', background: PAL.ink, border: '5px solid #5A4636'}} />
        <div style={{position: 'absolute', left: 110, top: -30, transform: `scale(${labelShrink})`, transformOrigin: '50% 100%'}}>
          <div style={{background: PAL.creamHi, border: `3px solid ${PAL.ink}`, padding: '8px 16px', fontFamily: FONT.banner, fontSize: 26, color: PAL.ink, whiteSpace: 'nowrap', rotate: '-2deg', filter: 'url(#rough) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'}}>
            ongkos angkut
          </div>
        </div>
      </div>
      {/* Lapak pasar di kanan */}
      <div style={{position: 'absolute', left: 950, top: 330, width: 280, height: 270}}>
        <Slab x={10} y={150} w={260} h={110} color={PAL.cream} shade={PAL.creamLo} r={8} grain={0.5} />
        <div style={{position: 'absolute', left: 0, top: 96, width: 280, height: 54, background: PAL.terracotta, borderRadius: '8px 8px 0 0', borderBottom: `4px solid ${PAL.terracottaLo}`}} />
        <div style={{position: 'absolute', left: 20, top: 40, width: 60, height: 56, borderRadius: '50%', background: PAL.marigold}} />
        <div style={{position: 'absolute', left: 100, top: 52, width: 60, height: 56, borderRadius: '50%', background: PAL.leaf}} />
        <div style={{position: 'absolute', left: 180, top: 40, width: 60, height: 56, borderRadius: '50%', background: PAL.teal}} />
        <div style={{position: 'absolute', left: 20, top: 150, width: 60, height: 44, background: PAL.marigold, borderRadius: 6}} />
        <div style={{position: 'absolute', left: 100, top: 150, width: 60, height: 44, background: PAL.leaf, borderRadius: 6}} />
        <div style={{position: 'absolute', left: 180, top: 150, width: 60, height: 44, background: PAL.teal, borderRadius: 6}} />
        {/* Label harga miring menurun + panah ke bawah (tanpa angka) */}
        <div style={{position: 'absolute', left: 140, top: 8 + priceDrop, translate: '-50% 0', rotate: `${priceTilt}deg`, background: PAL.creamHi, border: `3px solid ${PAL.ink}`, padding: '8px 18px', fontFamily: FONT.banner, fontSize: 30, color: PAL.ink, filter: 'url(#rough) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'}}>
          harga
        </div>
        <div style={{position: 'absolute', left: 246, top: 52, width: 30, height: arrowH, background: PAL.terracotta, opacity: arrowH > 0 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 232, top: 52 + arrowH, width: 58, height: 30, background: PAL.terracotta, clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', opacity: arrowH > 0 ? 1 : 0}} />
      </div>
      <Strip x={1090} y={300} text="pasar" at={96} size={34} rot={2} seed="pasar" />
    </>
  );
};

// =========================================================================
// BEAT 2 (Frame 154-295): anak desa dan anak kota membuka buku yang IDENTIK,
// dihubungkan satu garis cahaya. Layar terbagi dua.
// =========================================================================
const BeatLearn: React.FC<{f: number}> = ({f}) => {
  const lineGlow = interpolate(f, [210, 250], [0, 1], CLAMP) * (0.7 + 0.3 * Math.sin(f * 0.15));
  return (
    <>
      <SampaiBackdrop />
      {/* Separuh kiri: desa. Separuh kanan: kota. */}
      <div style={{position: 'absolute', left: 26, top: 26, width: 588, height: 574, background: 'rgba(94,156,107,0.16)'}} />
      <div style={{position: 'absolute', left: 640, top: 26, width: 614, height: 574, background: 'rgba(47,143,139,0.16)'}} />
      <div style={{position: 'absolute', left: 638, top: 60, width: 4, height: 500, background: PAL.ink, opacity: 0.35, borderRadius: 2}} />
      {/* Rumah desa kecil + gedung kota */}
      <Slab x={90} y={400} w={150} h={120} color={PAL.cream} shade={PAL.creamLo} r={6} grain={0.5} />
      <div style={{position: 'absolute', left: 80, top: 372, width: 170, height: 40, background: PAL.terracotta, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}} />
      <Slab x={1020} y={330} w={120} h={190} color="#8A9A86" shade="#667563" r={6} grain={0.5} />
      <Slab x={880} y={400} w={110} h={120} color="#7E8C78" shade="#667563" r={6} grain={0.5} />
      {/* Anak desa (kiri) dan anak kota (kanan), masing-masing dengan buku IDENTIK */}
      <Figure x={380} y={600} s={0.95} shirt={PAL.leaf} />
      <Figure x={900} y={600} s={0.95} shirt={PAL.teal} />
      <Slab x={352} y={478} w={58} h={44} color={PAL.creamHi} shade={PAL.creamLo} r={4} grain={0.4} />
      <Slab x={872} y={478} w={58} h={44} color={PAL.creamHi} shade={PAL.creamLo} r={4} grain={0.4} />
      <div style={{position: 'absolute', left: 381, top: 478, width: 3, height: 44, background: PAL.ink, opacity: 0.5}} />
      <div style={{position: 'absolute', left: 901, top: 478, width: 3, height: 44, background: PAL.ink, opacity: 0.5}} />
      {/* Garis cahaya penghubung kedua buku */}
      <div style={{position: 'absolute', left: 410, top: 496, width: 462, height: 6, background: PAL.marigoldHi, borderRadius: 3, opacity: lineGlow, boxShadow: '0 0 18px 6px rgba(255,212,112,0.7)'}} />
      <div style={{position: 'absolute', left: 410, top: 496, width: 462, height: 6, background: PAL.creamHi, borderRadius: 3, opacity: lineGlow * 0.7}} />
      <Strip x={640} y={120} text="belajar" at={170} size={40} rot={-2} seed="belajar" />
    </>
  );
};

// =========================================================================
// BEAT 3 (Frame 295-439): puskesmas berfungsi — gedung menyala, tokoh yang sakit
// melangkah masuk sejak dini; alat ukur kertas tetap di zona rendah, tanpa angka.
// =========================================================================
const BeatClinic: React.FC<{f: number}> = ({f}) => {
  // Jendela menyala satu per satu.
  const win = (a: number, b: number) => interpolate(f, [a, b], [0.15, 1], CLAMP);
  // Tokoh sakit berjalan dari kiri ke pintu lalu masuk (memudar di ambang pintu).
  const walkX = interpolate(f, [310, 395], [280, 585], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const walkFade = interpolate(f, [395, 420], [1, 0], CLAMP);
  const bobY = Math.sin(f * 0.35) * 2;
  // Isi alat ukur tetap rendah (zona bawah), tanpa angka dan tanpa label kata.
  const gaugeFill = interpolate(f, [320, 360], [0, 1], CLAMP);
  return (
    <>
      <SampaiBackdrop />
      <div style={{position: 'absolute', left: 180, top: 90, width: 110, height: 110, borderRadius: '50%', background: PAL.marigoldHi, boxShadow: '0 0 60px 24px rgba(242,169,59,0.45)'}} />
      {/* Gedung puskesmas */}
      <Paper>
        <Slab x={440} y={300} w={400} h={300} color={PAL.creamHi} shade={PAL.creamLo} r={10} grain={0.5} />
        <div style={{position: 'absolute', left: 420, top: 268, width: 440, height: 44, background: PAL.teal, borderRadius: '10px 10px 0 0', borderBottom: `4px solid ${PAL.tealLo}`}} />
      </Paper>
      {/* Jendela menyala berurutan */}
      {[
        {x: 480, y: 340, a: 318, b: 334},
        {x: 570, y: 340, a: 336, b: 352},
        {x: 660, y: 340, a: 354, b: 370},
        {x: 750, y: 340, a: 372, b: 388},
      ].map((w, i) => (
        <div key={i} style={{position: 'absolute', left: w.x, top: w.y, width: 54, height: 64, background: win(w.a, w.b) > 0.5 ? PAL.windowGlow : '#5A6A72', border: `3px solid ${PAL.ink}`, borderRadius: 4, opacity: 0.35 + 0.65 * win(w.a, w.b), boxShadow: win(w.a, w.b) > 0.5 ? '0 0 22px 6px rgba(255,230,153,0.55)' : 'none'}} />
      ))}
      {/* Pintu masuk */}
      <div style={{position: 'absolute', left: 608, top: 470, width: 64, height: 130, background: PAL.tealLo, border: `3px solid ${PAL.ink}`, borderRadius: '30px 30px 0 0'}} />
      {/* Tokoh sakit melangkah masuk sejak dini */}
      <div style={{position: 'absolute', left: walkX, top: 600 + bobY, opacity: walkFade, translate: '-50% -100%'}}>
        <Figure x={0} y={0} s={0.9} shirt={PAL.terracotta} />
      </div>
      {/* Alat ukur kertas di kanan: isi tetap di zona rendah */}
      <div style={{position: 'absolute', left: 1060, top: 330, width: 90, height: 220, background: PAL.creamHi, border: `3px solid ${PAL.ink}`, borderRadius: 10}}>
        <div style={{position: 'absolute', left: 8, top: 8, width: 74, height: 52, background: PAL.terracotta, opacity: 0.55, borderRadius: 6}} />
        <div style={{position: 'absolute', left: 8, bottom: 8, width: 74, height: Math.round(120 * gaugeFill), background: PAL.leaf, borderRadius: 6, opacity: 0.9}} />
        <div style={{position: 'absolute', left: 38, bottom: 8 + Math.round(120 * gaugeFill), width: 14, height: 14, borderRadius: '50%', background: PAL.ink, translate: '-50% -50%'}} />
      </div>
      <Strip x={640} y={210} text="Puskesmas" at={308} size={40} rot={-2} seed="puskesmas" />
    </>
  );
};

// =========================================================================
// BEAT 4 (Frame 462-590): kamera mundur — tiga stasiun mini; SATU koin yang sama
// melompat dari stasiun ke stasiun meninggalkan jejak cahaya, lalu kembali ke asal.
// =========================================================================
const BeatReturn: React.FC<{f: number}> = ({f}) => {
  // Rute koin: asal (jalan) -> buku -> puskesmas -> kembali ke asal.
  const hop = (a: number, b: number, fromX: number, toX: number, arc: number) => {
    const t = interpolate(f, [a, b], [0, 1], CLAMP);
    return {x: fromX + (toX - fromX) * t, y: 528 - Math.sin(t * Math.PI) * arc, t};
  };
  const seg = f < 500 ? hop(470, 500, 290, 640, 90) : f < 530 ? hop(500, 530, 640, 990, 90) : hop(530, 560, 990, 290, 110);
  const restGlow = interpolate(f, [560, 580], [0.6, 1], CLAMP);
  const trail = (a: number, b: number, fromX: number, toX: number) => {
    const t = interpolate(f, [a, b], [0, 1], CLAMP);
    return {x: fromX + (toX - fromX) * t, y: 528 - Math.sin(t * Math.PI) * 70, o: 0.35 * (1 - t)};
  };
  const tr1 = trail(472, 498, 290, 640);
  const tr2 = trail(502, 528, 640, 990);
  const tr3 = trail(532, 558, 990, 290);
  return (
    <>
      <SampaiBackdrop />
      <div style={{position: 'absolute', left: 180, top: 90, width: 110, height: 110, borderRadius: '50%', background: PAL.marigoldHi, boxShadow: '0 0 60px 24px rgba(242,169,59,0.45)'}} />
      {/* Tiga stasiun mini di atas peron */}
      <Slab x={120} y={540} w={1040} h={60} color={PAL.cream} shade={PAL.creamLo} r={10} grain={0.5} />
      {/* Stasiun 1: jalan mini + truk mini */}
      <Slab x={170} y={470} w={240} h={70} color={PAL.road} shade={PAL.roadLo} r={6} grain={0.5} />
      <Slab x={230} y={420} w={90} h={50} color={PAL.teal} shade={PAL.tealLo} r={6} grain={0.5} />
      <Slab x={320} y={432} w={40} h={38} color={PAL.terracotta} shade={PAL.terracottaLo} r={6} grain={0.5} />
      {/* Stasiun 2: dua buku mini */}
      <Slab x={560} y={450} w={70} h={90} color={PAL.creamHi} shade={PAL.creamLo} r={4} grain={0.4} />
      <Slab x={640} y={450} w={70} h={90} color={PAL.creamHi} shade={PAL.creamLo} r={4} grain={0.4} />
      <div style={{position: 'absolute', left: 636, top: 486, width: 90, height: 6, background: PAL.marigoldHi, borderRadius: 3, boxShadow: '0 0 14px 4px rgba(255,212,112,0.6)'}} />
      {/* Stasiun 3: puskesmas mini */}
      <Slab x={900} y={430} w={180} h={110} color={PAL.creamHi} shade={PAL.creamLo} r={8} grain={0.5} />
      <div style={{position: 'absolute', left: 890, top: 412, width: 200, height: 24, background: PAL.teal, borderRadius: '8px 8px 0 0', borderBottom: `3px solid ${PAL.tealLo}`}} />
      <div style={{position: 'absolute', left: 930, top: 460, width: 34, height: 40, background: PAL.windowGlow, border: `3px solid ${PAL.ink}`, borderRadius: 4}} />
      <div style={{position: 'absolute', left: 1010, top: 460, width: 34, height: 40, background: PAL.windowGlow, border: `3px solid ${PAL.ink}`, borderRadius: 4}} />
      {/* Jejak cahaya di belakang koin */}
      <div style={{position: 'absolute', left: tr1.x, top: tr1.y, width: 30, height: 30, translate: '-50% -50%', borderRadius: '50%', background: PAL.coinHi, opacity: tr1.o}} />
      <div style={{position: 'absolute', left: tr2.x, top: tr2.y, width: 30, height: 30, translate: '-50% -50%', borderRadius: '50%', background: PAL.coinHi, opacity: tr2.o}} />
      <div style={{position: 'absolute', left: tr3.x, top: tr3.y, width: 30, height: 30, translate: '-50% -50%', borderRadius: '50%', background: PAL.coinHi, opacity: tr3.o}} />
      <Coin x={seg.x} y={seg.y} d={76} glow={f >= 560 ? restGlow : 0.9} />
      <Strip x={640} y={130} text="satu rupiah" at={468} size={44} rot={-2} seed="satu-rupiah" />
      <Strip x={640} y={220} text="berkali-kali" at={522} size={44} rot={2} seed="berkali-kali" />
    </>
  );
};

export const PB10: React.FC = () => {
  const rawF = useCurrentFrame();
  // Rasa gerak mulus 24 gambar per detik khas Dunia Sampai
  const f = Math.round((rawF * 24) / 30) * (30 / 24);

  // Kamera maju pelan sepanjang adegan
  const camScale = interpolate(f, [0, PB10_DUR], [1, 1.04], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const camLiftY = interpolate(f, [0, PB10_DUR], [0, -10], {...CLAMP, easing: Easing.inOut(Easing.sin)});

  // Pergantian beat lewat opacity (cross-fade pendek di jeda antar-kalimat)
  const b1o = interpolate(f, [150, 172], [1, 0], CLAMP);
  const b2o = interpolate(f, [150, 172], [0, 1], CLAMP) * interpolate(f, [285, 306], [1, 0], CLAMP);
  const b3o = interpolate(f, [290, 312], [0, 1], CLAMP) * interpolate(f, [445, 466], [1, 0], CLAMP);
  const b4o = interpolate(f, [450, 470], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: PAL.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.2} flicker={0.18}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${camScale}) translateY(${camLiftY}px)`, transformOrigin: '50% 45%'}}>
          <AbsoluteFill style={{opacity: b1o}}>
            <BeatRoad f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: b2o}}>
            <BeatLearn f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: b3o}}>
            <BeatClinic f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: b4o}}>
            <BeatReturn f={f} />
          </AbsoluteFill>
          <ProsceniumFrame />
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
