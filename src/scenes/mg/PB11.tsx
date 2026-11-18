// Adegan MG-11 "Kepercayaan" (Dunia Sampai):
// Frame 0-22: Panggung sesaat kosong; strip kertas terlipat membuka menjadi kata "Kepercayaan"
// dengan huruf kertas besar, lalu strip itu menyusut ke atas dan menghilang.
// Frame 40-283: Tangan siluet menggenggam koin; koin terlipat berubah menjadi jalur jalan kertas
// di bawah kaki tokoh tanpa wajah, lalu cincin sinyal memancar lembut di atasnya (teks "pajak").
// Kilas setengah detik ke kiri: koin jatuh ke lubang dan lenyap — teks "uang yang hilang" tampil
// DICORET oleh strip kertas dengan garis coret (teks tetap terbaca di balik coretan).
// Frame 303-420: Barisan siluet warga tanpa wajah masing-masing menaruh koin ke sebuah toples kaca
// bening dengan tangan terbuka sendiri; di dalam toples tampak jalan dan menara kecil.
// Teks "melihat apa yang ia dapat" tampil, dan keadaan akhir ditahan sampai frame 420.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB11_DUR = 420;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet Dunia Sampai sesuai brief bagian 1.3 (+ aksen gelap untuk kilas lubang)
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
  road: '#8E7D69',
  roadLo: '#6E5E4B',
  windowGlow: '#FFE699',
  coinGold: '#F2A93B',
  coinHi: '#FFD470',
  coinLo: '#C77F1F',
  bocorWall: '#D9C7A3',
  bocorPit: '#2E221A',
};

// Koin kertas: bulat polos dengan cincin timbul, tanpa gambar, angka, atau lambang; berpendar emas.
const Coin: React.FC<{
  x: number;
  y: number;
  d?: number;
  glow?: number;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
}> = ({x, y, d = 80, glow = 0.85, opacity = 1, scaleX = 1, scaleY = 1}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: d,
        height: d,
        translate: '-50% -50%',
        transform: `scale(${scaleX}, ${scaleY})`,
        borderRadius: '50%',
        backgroundColor: PAL.coinGold,
        opacity,
        border: `4px solid ${PAL.coinLo}`,
        boxShadow: `0 0 ${Math.round(32 * glow)}px ${Math.round(14 * glow)}px rgba(242,169,59,${0.55 * glow}), inset 0 -5px 0 rgba(0,0,0,0.18), inset 0 5px 0 rgba(255,255,255,0.38)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: d * 0.62,
          height: d * 0.62,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `3px solid ${PAL.coinHi}`,
        }}
      />
    </div>
  );
};

// Strip kertas bertuliskan teks yang diizinkan brief (PopIn + Boil di luar div berposisi).
const Strip: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  outAt?: number;
  size?: number;
  rot?: number;
  seed: string;
}> = ({x, y, text, at, outAt, size = 40, rot = -1.6, seed}) => {
  const f = useCurrentFrame();
  const exitOp = outAt !== undefined ? interpolate(f, [outAt, outAt + 12], [1, 0], CLAMP) : 1;
  if (f < at || exitOp <= 0.01) return null;

  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.35} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            rotate: `${rot}deg`,
            opacity: exitOp,
            backgroundColor: PAL.creamHi,
            padding: '13px 26px 15px',
            whiteSpace: 'nowrap',
            fontFamily: FONT.banner,
            fontSize: size,
            lineHeight: 1.06,
            color: PAL.ink,
            border: `3px solid ${PAL.ink}`,
            filter: 'url(#rough) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
            zIndex: 32,
            pointerEvents: 'none',
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: -14,
              width: 46,
              height: 16,
              rotate: '-28deg',
              backgroundColor: C.tape,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -14,
              width: 46,
              height: 16,
              rotate: '28deg',
              backgroundColor: C.tape,
              opacity: 0.85,
            }}
          />
        </div>
      </Boil>
    </PopIn>
  );
};

// Bingkai panggung konsisten (lengkung atas, pilar samping, dan lantai panggung).
const ProsceniumFrame: React.FC = () => (
  <>
    <Slab
      x={0}
      y={FLOOR_Y}
      w={1280}
      h={720 - FLOOR_Y}
      color={PAL.floor}
      r={0}
      grain={0.6}
    />
    <Slab
      x={0}
      y={FLOOR_Y - 22}
      w={1280}
      h={26}
      color={PAL.floorHi}
      shade={PAL.floor}
      shadeH={0.35}
      r={0}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y + 38,
        height: 3,
        backgroundColor: C.floorLo,
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y + 78,
        height: 3,
        backgroundColor: C.floorLo,
        opacity: 0.7,
      }}
    />
    <Paper lift={6}>
      <Slab x={0} y={0} w={32} h={FLOOR_Y} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} />
      <Slab x={1248} y={0} w={32} h={FLOOR_Y} color={PAL.terracotta} shade={PAL.terracottaLo} r={0} />
      <Slab
        x={0}
        y={0}
        w={1280}
        h={34}
        color={PAL.terracotta}
        shade={PAL.terracottaLo}
        shadeH={0.28}
        r="0 0 16px 16px"
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 26,
          width: 68,
          height: 52,
          backgroundColor: PAL.terracotta,
          borderRadius: '0 0 48px 0',
          borderRight: `3px solid ${PAL.terracottaLo}`,
          borderBottom: `3px solid ${PAL.terracottaLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 26,
          width: 68,
          height: 52,
          backgroundColor: PAL.terracotta,
          borderRadius: '0 0 0 48px',
          borderLeft: `3px solid ${PAL.terracottaLo}`,
          borderBottom: `3px solid ${PAL.terracottaLo}`,
        }}
      />
    </Paper>
  </>
);

// Latar Dunia Sampai: langit pagi persik-aqua, cahaya pagi hangat, perbukitan daun & teal.
const SampaiBackdrop: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${PAL.skyTop} 0%, ${PAL.skyMid} 46%, ${PAL.skyBot} 78%, ${PAL.cream} 100%)`,
      }}
    />
    {/* Cahaya matahari pagi hangat */}
    <div
      style={{
        position: 'absolute',
        left: 190,
        top: 86,
        width: 108,
        height: 108,
        borderRadius: '50%',
        backgroundColor: PAL.marigoldHi,
        boxShadow: '0 0 64px 26px rgba(242,169,59,0.44)',
      }}
    />
    {/* Bukit kertas berlapis dengan bayangan lembut */}
    <div
      style={{
        position: 'absolute',
        left: -90,
        top: 320,
        width: 780,
        height: 250,
        borderRadius: '50%',
        backgroundColor: PAL.leaf,
        opacity: 0.52,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 540,
        top: 344,
        width: 840,
        height: 240,
        borderRadius: '50%',
        backgroundColor: PAL.teal,
        opacity: 0.48,
      }}
    />
  </>
);

// Cincin sinyal kertas utuh yang memancar lembut (tanpa ikon sinyal/batang sinyal).
const SignalRing: React.FC<{cx: number; cy: number; r: number; opacity: number; seed: string}> = ({
  cx,
  cy,
  r,
  opacity,
  seed,
}) => {
  if (opacity <= 0.01 || r <= 4) return null;
  const d = Math.round(r * 2);
  return (
    <Boil seed={seed} amp={0.7} rot={0.08}>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: d,
          height: d,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `6px solid ${PAL.creamHi}`,
          outline: `3px solid ${PAL.marigold}`,
          boxShadow: '0 0 16px rgba(255,230,153,0.65), inset 0 0 10px rgba(242,169,59,0.4)',
          opacity,
          pointerEvents: 'none',
        }}
      />
    </Boil>
  );
};

// =========================================================================
// BEAT 1 (Frame 0-38): "Kepercayaan."
// Frame 0-22: Panggung sesaat kosong; satu strip kertas terlipat membuka menjadi
// kata "Kepercayaan" dengan huruf kertas besar, lalu strip itu menyusut ke atas
// dan menghilang.
// =========================================================================
const BeatTitle: React.FC<{f: number}> = ({f}) => {
  // Frame 0..3 sesaat kosong, 3..13 lipatan kertas membuka dengan pegas lembut,
  // 13..20 tertahan jelas, 20..28 menyusut ke atas dan menghilang.
  const unfold = interpolate(f, [2, 12], [0.04, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const shrinkUp = interpolate(f, [18, 26], [1, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const liftY = interpolate(f, [18, 26], [0, -190], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const op = interpolate(f, [2, 6], [0, 1], CLAMP) * interpolate(f, [21, 26], [1, 0], CLAMP);

  if (op <= 0.01) return null;

  return (
    <Boil seed="kepercayaan-title" amp={0.35} rot={0.04}>
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 300 + liftY,
          translate: '-50% -50%',
          transform: `scaleX(${0.35 + 0.65 * unfold}) scaleY(${unfold * shrinkUp})`,
          transformOrigin: '50% 0%',
          opacity: op,
          zIndex: 35,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            rotate: '-1deg',
            backgroundColor: PAL.creamHi,
            padding: '24px 56px 28px',
            border: `4px solid ${PAL.ink}`,
            fontFamily: FONT.banner,
            fontSize: 74,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: PAL.ink,
            whiteSpace: 'nowrap',
            filter: 'url(#rough) drop-shadow(3px 10px 14px rgba(59,42,32,0.34))',
          }}
        >
          Kepercayaan
          {/* Garis lipatan vertikal halus khas kertas yang baru dibuka */}
          <div
            style={{
              position: 'absolute',
              left: '33%',
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: PAL.creamLo,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '67%',
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: PAL.creamLo,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -14,
              left: -20,
              width: 68,
              height: 22,
              rotate: '-26deg',
              backgroundColor: C.tape,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -14,
              right: -20,
              width: 68,
              height: 22,
              rotate: '26deg',
              backgroundColor: C.tape,
              opacity: 0.85,
            }}
          />
        </div>
      </div>
    </Boil>
  );
};

// =========================================================================
// BEAT 2 (Frame 40-283):
// "Ketika orang melihat pajaknya berubah menjadi jalan yang ia lewati dan sinyal
// yang ia pakai, pajak berhenti terasa seperti uang yang hilang."
// - Tangan siluet menggenggam koin; koin terlipat berubah menjadi jalur jalan kertas
//   di bawah kaki tokoh tanpa wajah, lalu cincin sinyal memancar lembut di atasnya.
//   Teks "pajak" tampil.
// - Lalu kilas setengah detik ke kiri: koin jatuh ke lubang dan lenyap — gambaran
//   uang yang hilang. Teks "uang yang hilang" tampil DICORET oleh sebuah strip kertas
//   yang menutupinya dengan garis coret (teks tetap terbaca di balik coretan).
// =========================================================================
const BeatTransformAndCancel: React.FC<{f: number}> = ({f}) => {
  // 1) Tangan siluet masuk dari kiri menggenggam koin (40..72), lalu membuka
  //    dan koin turun + terlipat membuka menjadi jalan kertas (72..118).
  const handIn = interpolate(f, [40, 62], [-220, 140], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const handRetreat = interpolate(f, [84, 114], [0, -280], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const handX = handIn + handRetreat;
  const handOpen = interpolate(f, [66, 84], [0, 1], CLAMP);

  // Koin turun dari genggaman tangan ke lantai panggung lalu terlipat membuka jadi jalan
  const coinDropY = interpolate(f, [66, 92], [320, 540], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const coinDropX = interpolate(f, [66, 92], [295, 420], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const coinFoldScaleX = interpolate(f, [86, 106], [1, 2.8], CLAMP);
  const coinFoldScaleY = interpolate(f, [86, 106], [1, 0.18], CLAMP);
  const coinOp =
    interpolate(f, [40, 50], [0, 1], CLAMP) * interpolate(f, [96, 108], [1, 0], CLAMP);

  // Jalur jalan kertas membentang seperti lipatan akordeon di bawah kaki tokoh (92..136)
  const roadUnfold = interpolate(f, [92, 134], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.15)),
  });
  const roadW = Math.round(760 * roadUnfold);

  // Tokoh tanpa wajah berdiri & melangkah ringan di atas jalan yang baru terbuka
  const figEnter = interpolate(f, [74, 108], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const figWalkX = interpolate(f, [104, 168], [520, 650], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const figBobY = f >= 104 && f <= 168 ? Math.abs(Math.sin((f - 104) * 0.25)) * -6 : 0;

  // Menara kertas kecil di sisi kanan jalan berdiri pop-up (124..152) & memancarkan cincin sinyal (142..220)
  const towerStand = interpolate(f, [124, 152], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  // Tiga cincin sinyal memancar lembut di atas tokoh & menara
  const ring1Prog = interpolate(f, [144, 210], [0, 1], CLAMP);
  const ring2Prog = interpolate(f, [160, 226], [0, 1], CLAMP);
  const ring3Prog = interpolate(f, [176, 242], [0, 1], CLAMP);

  const ringOp = (p: number) =>
    interpolate(p, [0, 0.15, 0.75, 1], [0, 0.9, 0.65, 0], CLAMP);

  // 2) Kilas setengah detik ke kiri (sekitar frame 182..283):
  //    Panel kilas di sisi kiri panggung menampilkan koin jatuh ke lubang gelap dan lenyap
  //    (kilas jatuh berlangsung sekitar setengah detik = 16 frame di 188..204),
  //    diikuti teks "uang yang hilang" yang DICORET oleh sebuah strip kertas dengan garis coret
  //    (teks tetap terbaca jelas di balik coretan sebagai sesuatu yang dibatalkan).
  const flashCardIn = interpolate(f, [180, 194], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.25)),
  });
  // Koin di dalam kilas jatuh setengah detik (16 frame: 188..204) ke dalam lubang gelap dan lenyap
  const lostCoinY = interpolate(f, [188, 204], [250, 438], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const lostCoinScale = interpolate(f, [198, 205], [1, 0.25], CLAMP);
  const lostCoinOp =
    interpolate(f, [184, 189], [0, 1], CLAMP) *
    interpolate(f, [200, 205], [1, 0], CLAMP);

  // Strip coretan di atas teks "uang yang hilang" ditarik dari kiri ke kanan (218..240)
  const strikeProg = interpolate(f, [218, 240], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      {/* Strip teks "pajak" yang diizinkan brief */}
      <Strip x={650} y={102} text="pajak" at={48} outAt={284} size={42} rot={-1.5} seed="pajak-strip" />

      {/* Tangan siluet kertas dari kiri yang menggenggam lalu membuka koin */}
      <div
        style={{
          position: 'absolute',
          left: handX,
          top: 250,
          width: 220,
          height: 120,
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <Paper lift={6}>
          {/* Lengan siluet */}
          <Slab x={-80} y={28} w={160} h={52} color={PAL.ink} shade="#241811" r={12} />
          {/* Telapak tangan siluet */}
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 20,
              width: 86,
              height: 64,
              borderRadius: '18px 28px 28px 18px',
              backgroundColor: PAL.ink,
            }}
          />
          {/* Ibu jari atas & jari bawah yang membuka lembut saat koin dilepas */}
          <div
            style={{
              position: 'absolute',
              left: 118,
              top: 10 - handOpen * 16,
              width: 58,
              height: 24,
              borderRadius: 12,
              rotate: `${-10 - handOpen * 22}deg`,
              backgroundColor: PAL.ink,
              transformOrigin: '0% 50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 122,
              top: 56 + handOpen * 14,
              width: 68,
              height: 24,
              borderRadius: 12,
              rotate: `${8 + handOpen * 20}deg`,
              backgroundColor: PAL.ink,
              transformOrigin: '0% 50%',
            }}
          />
        </Paper>
      </div>

      {/* Koin emas yang keluar dari genggaman tangan lalu terlipat menjadi jalan */}
      <Coin
        x={coinDropX}
        y={coinDropY}
        d={78}
        glow={0.95}
        opacity={coinOp}
        scaleX={coinFoldScaleX}
        scaleY={coinFoldScaleY}
      />

      {/* Jalur jalan kertas di bawah kaki tokoh (membuka dari lipatan koin) */}
      {roadW > 4 ? (
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 526,
            width: roadW,
            height: 74,
            overflow: 'hidden',
            zIndex: 14,
          }}
        >
          <Paper lift={5}>
            <Slab
              x={0}
              y={0}
              w={760}
              h={70}
              color={PAL.road}
              shade={PAL.roadLo}
              shadeH={0.26}
              r={10}
              style={{border: `3px solid ${PAL.ink}`}}
            />
            {/* Marka jalan putus-putus kertas krem */}
            {[40, 150, 260, 370, 480, 590, 690].map((mx, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: mx,
                  top: 30,
                  width: 56,
                  height: 9,
                  borderRadius: 4,
                  backgroundColor: PAL.creamHi,
                  opacity: 0.9,
                }}
              />
            ))}
            {/* Garis lipatan kertas vertikal halus agar terasa seperti koin yang membuka lipatan */}
            {[190, 380, 570].map((fx, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: fx,
                  top: 0,
                  bottom: 4,
                  width: 2,
                  backgroundColor: PAL.ink,
                  opacity: 0.25,
                }}
              />
            ))}
          </Paper>
        </div>
      ) : null}

      {/* Menara kertas pop-up di kanan jalan yang memancarkan cincin sinyal di atas tokoh */}
      {towerStand > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: 980,
            top: 530,
            width: 110,
            height: 230,
            translate: '-50% -100%',
            transformOrigin: '50% 100%',
            transform: `scaleY(${towerStand})`,
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <Paper lift={5}>
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 24,
                width: 90,
                height: 206,
                backgroundColor: PAL.terracotta,
                clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 26,
                top: 36,
                width: 58,
                height: 194,
                backgroundColor: PAL.cream,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <Slab x={24} y={76} w={62} h={12} color={PAL.terracotta} shade={PAL.terracottaLo} r={3} />
            <Slab x={16} y={134} w={78} h={12} color={PAL.terracotta} shade={PAL.terracottaLo} r={3} />
            {/* Cakram lentera bulat polos di puncak menara */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 18,
                width: 28,
                height: 28,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: PAL.windowGlow,
                border: `3px solid ${PAL.ink}`,
                boxShadow: '0 0 22px 8px rgba(255,230,153,0.85)',
              }}
            />
          </Paper>
        </div>
      ) : null}

      {/* Cincin sinyal kertas memancar lembut di atas tokoh & menara */}
      <SignalRing
        cx={780}
        cy={265}
        r={24 + ring1Prog * 155}
        opacity={ringOp(ring1Prog)}
        seed="sig-1"
      />
      <SignalRing
        cx={780}
        cy={265}
        r={24 + ring2Prog * 155}
        opacity={ringOp(ring2Prog)}
        seed="sig-2"
      />
      <SignalRing
        cx={780}
        cy={265}
        r={24 + ring3Prog * 155}
        opacity={ringOp(ring3Prog)}
        seed="sig-3"
      />

      {/* Tokoh tanpa wajah berdiri & melangkah di atas jalan kertas */}
      <div
        style={{
          position: 'absolute',
          left: figWalkX,
          top: 536 + figBobY,
          opacity: figEnter,
          zIndex: 18,
        }}
      >
        <Figure x={0} y={0} s={0.96} shirt={PAL.teal} />
      </div>

      {/* KILAS KE KIRI (Frame 180-283): koin jatuh ke lubang dan lenyap (setengah detik),
          lalu teks "uang yang hilang" tampil DICORET oleh strip kertas dengan garis coret */}
      {flashCardIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 235,
            top: 360,
            width: 330,
            height: 310,
            translate: '-50% -50%',
            transform: `scale(${flashCardIn}) rotate(-1.5deg)`,
            zIndex: 26,
            pointerEvents: 'none',
          }}
        >
          <Paper lift={8}>
            {/* Bingkai kartu kilas warna krem kusam Dunia Bocor di sisi kiri */}
            <Slab
              x={0}
              y={0}
              w={330}
              h={230}
              color={PAL.bocorWall}
              shade="#B6A27E"
              r={12}
              style={{border: `3.5px solid ${PAL.ink}`}}
            />
            {/* Permukaan tanah retak & lubang gelap di dasar kartu kilas */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 152,
                width: 302,
                height: 64,
                backgroundColor: '#8A7A63',
                borderRadius: '0 0 9px 9px',
                borderTop: `3px solid ${PAL.ink}`,
              }}
            />
            {/* Lubang gelap tempat koin jatuh dan lenyap */}
            <div
              style={{
                position: 'absolute',
                left: 165,
                top: 156,
                width: 128,
                height: 36,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: PAL.bocorPit,
                border: `3px solid ${PAL.ink}`,
                boxShadow: 'inset 0 8px 14px rgba(0,0,0,0.85)',
              }}
            />
          </Paper>

          {/* Koin jatuh ke dalam lubang (terklip di bibir lubang supaya benar-benar lenyap ke dalam) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 330,
              height: 162,
              overflow: 'hidden',
            }}
          >
            <Coin
              x={165}
              y={lostCoinY - 195}
              d={58}
              glow={0.4}
              opacity={lostCoinOp}
              scaleX={lostCoinScale}
              scaleY={lostCoinScale}
            />
          </div>

          {/* Teks "uang yang hilang" yang DICORET oleh strip kertas bergaris coret
              (teks tetap terbaca jelas di balik coretan sebagai sesuatu yang dibatalkan) */}
          {f >= 200 ? (
            <PopIn at={200} seed="uang-hilang">
              <Boil seed="uang-hilang" amp={0.35} rot={0.04}>
                <div
                  style={{
                    position: 'absolute',
                    left: 165,
                    top: 256,
                    translate: '-50% -50%',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: PAL.creamHi,
                      padding: '12px 24px 14px',
                      border: `3px solid ${PAL.ink}`,
                      fontFamily: FONT.banner,
                      fontSize: 32,
                      lineHeight: 1.08,
                      color: PAL.ink,
                      whiteSpace: 'nowrap',
                      filter: 'url(#rough) drop-shadow(2px 5px 7px rgba(0,0,0,0.32))',
                    }}
                  >
                    uang yang hilang
                    {/* Strip kertas transparan + garis coret terakota tegas yang mencoret teks namun teks tetap terbaca */}
                    {strikeProg > 0.01 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: -10,
                          top: '50%',
                          width: `${Math.round(strikeProg * 106)}%`,
                          height: 22,
                          translate: '0 -50%',
                          rotate: '-3deg',
                          backgroundColor: 'rgba(246, 232, 204, 0.42)',
                          borderTop: `2px solid ${PAL.terracottaLo}`,
                          borderBottom: `2px solid ${PAL.terracottaLo}`,
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: '1px 3px 5px rgba(59,42,32,0.22)',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 6,
                            backgroundColor: PAL.terracotta,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </Boil>
            </PopIn>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

// =========================================================================
// BEAT 3 (Frame 303-420):
// "Orang membayar dengan lebih rela, karena ia melihat apa yang ia dapat."
// - Barisan siluet warga tanpa wajah masing-masing menaruh koin ke sebuah toples
//   kaca bening dengan tangan terbuka sendiri; di dalam toples tampak jalan dan
//   menara kecil.
// - Teks "melihat apa yang ia dapat" tampil.
// - Keadaan akhir (toples berisi jalan dan menara kecil, warga dengan tangan terbuka)
//   ditahan sampai frame 420.
// =========================================================================
const BeatGlassJar: React.FC<{f: number}> = ({f}) => {
  // Toples kaca bening berdiri di atas alas kayu di tengah-kanan panggung
  const jarAppear = interpolate(f, [295, 316], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });

  // Tiga warga tanpa wajah berbaris di kiri toples, masing-masing mengulurkan tangan terbuka
  // dan koinnya meluncur masuk ke mulut toples satu per satu (314..368), lalu tertahan dengan tangan terbuka sampai 420.
  const citizens = [
    {x: 195, s: 0.88, shirt: PAL.leaf, dropStart: 342, dropEnd: 368, restX: 675, restY: 492},
    {x: 325, s: 0.92, shirt: PAL.terracotta, dropStart: 326, dropEnd: 352, restX: 725, restY: 496},
    {x: 455, s: 0.96, shirt: PAL.teal, dropStart: 310, dropEnd: 336, restX: 775, restY: 490},
  ];

  // Jalan dan menara kecil di dalam toples kaca menyala/berpendar hangat saat koin-koin masuk
  const innerWorldGlow = interpolate(f, [324, 372], [0.45, 1], CLAMP);
  const miniRingProg = interpolate(f, [346, 405], [0, 1], CLAMP);

  return (
    <>
      <Strip
        x={640}
        y={96}
        text="melihat apa yang ia dapat"
        at={332}
        size={40}
        rot={-1.2}
        seed="melihat-dapat"
      />

      {/* Barisan warga tanpa wajah dengan tangan terbuka sendiri (tanpa paksaan) */}
      {citizens.map((c, idx) => {
        const armExtend = interpolate(f, [c.dropStart - 10, c.dropStart + 10], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.cubic),
        });
        const coinT = interpolate(f, [c.dropStart, c.dropEnd], [0, 1], {
          ...CLAMP,
          easing: Easing.inOut(Easing.sin),
        });
        const handTipX = c.x + 48 + armExtend * 22;
        const handTipY = 468 - armExtend * 14;
        // Lintasan lengkung koin dari tangan terbuka warga menuju dalam toples kaca bening
        const cx = interpolate(coinT, [0, 0.55, 1], [handTipX, 725, c.restX], CLAMP);
        const cy =
          interpolate(coinT, [0, 0.55, 1], [handTipY, 210, c.restY], CLAMP) -
          Math.sin(coinT * Math.PI) * 55;

        return (
          <React.Fragment key={idx}>
            <div style={{position: 'absolute', left: 0, top: 0, zIndex: 18}}>
              <Figure x={c.x} y={600} s={c.s} shirt={c.shirt} />
              {/* Lengan & telapak tangan terbuka menghadap atas (simbol rela) */}
              <div
                style={{
                  position: 'absolute',
                  left: c.x + 14,
                  top: 472,
                  width: 56 + armExtend * 18,
                  height: 18,
                  borderRadius: 10,
                  backgroundColor: c.shirt,
                  border: `2.5px solid ${PAL.ink}`,
                  transformOrigin: '0% 50%',
                  rotate: `${-12 - armExtend * 14}deg`,
                }}
              />
              {/* Telapak tangan terbuka polos */}
              <div
                style={{
                  position: 'absolute',
                  left: handTipX - 10,
                  top: handTipY - 4,
                  width: 30,
                  height: 14,
                  borderRadius: '4px 12px 12px 8px',
                  backgroundColor: C.creamLo,
                  border: `2.5px solid ${PAL.ink}`,
                  rotate: '-8deg',
                }}
              />
            </div>
            {/* Koin emas yang ditaruh dari tangan terbuka ke dalam toples */}
            <Coin x={cx} y={cy} d={46} glow={0.9} opacity={1} />
          </React.Fragment>
        );
      })}

      {/* Toples kaca bening besar di kanan-tengah panggung berisi jalan dan menara kecil */}
      <div
        style={{
          position: 'absolute',
          left: 770,
          top: 600,
          width: 340,
          height: 380,
          translate: '-50% -100%',
          transformOrigin: '50% 100%',
          transform: `scale(${jarAppear})`,
          zIndex: 22,
          pointerEvents: 'none',
        }}
      >
        {/* Leher & mulut toples kaca terbuka (supaya koin bisa masuk) */}
        <div
          style={{
            position: 'absolute',
            left: 85,
            top: 12,
            width: 170,
            height: 28,
            borderRadius: '12px 12px 4px 4px',
            backgroundColor: 'rgba(255, 252, 245, 0.38)',
            border: `4px solid ${PAL.ink}`,
            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.65)',
          }}
        />

        {/* Badan toples kaca bening */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 38,
            width: 300,
            height: 326,
            borderRadius: '38px 38px 28px 28px',
            backgroundColor: 'rgba(255, 250, 240, 0.28)',
            border: `4px solid ${PAL.ink}`,
            boxShadow:
              '0 10px 24px rgba(59,42,32,0.25), inset 0 0 28px rgba(255,248,235,0.55)',
            overflow: 'hidden',
          }}
        >
          {/* Pendar hangat di dalam toples */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: innerWorldGlow,
              background:
                'radial-gradient(circle at 55% 48%, rgba(255,230,153,0.55) 0%, rgba(242,169,59,0.18) 55%, rgba(0,0,0,0) 80%)',
            }}
          />

          {/* Bukit daun lembut di dasar dalam toples */}
          <div
            style={{
              position: 'absolute',
              left: -30,
              top: 220,
              width: 360,
              height: 130,
              borderRadius: '50%',
              backgroundColor: PAL.leaf,
              opacity: 0.65,
            }}
          />

          {/* Menara kertas kecil berdiri di dalam toples */}
          <div
            style={{
              position: 'absolute',
              left: 190,
              top: 86,
              width: 74,
              height: 162,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 18,
                width: 62,
                height: 144,
                backgroundColor: PAL.terracotta,
                clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 26,
                width: 38,
                height: 136,
                backgroundColor: PAL.cream,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <Slab x={14} y={60} w={46} h={9} color={PAL.terracotta} shade={PAL.terracottaLo} r={2} />
            <Slab x={10} y={102} w={54} h={9} color={PAL.terracotta} shade={PAL.terracottaLo} r={2} />
            {/* Puncak menara kecil berpendar */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 14,
                width: 22,
                height: 22,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: PAL.windowGlow,
                border: `2.5px solid ${PAL.ink}`,
                boxShadow: `0 0 ${Math.round(20 * innerWorldGlow)}px rgba(255,230,153,0.95)`,
              }}
            />
            {/* Cincin sinyal kecil lembut di dalam toples */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 14,
                width: Math.round(36 + miniRingProg * 54),
                height: Math.round(36 + miniRingProg * 54),
                translate: '-50% -50%',
                borderRadius: '50%',
                border: `3px solid ${PAL.creamHi}`,
                opacity: 0.75 * innerWorldGlow,
              }}
            />
          </div>

          {/* Jalur jalan kertas kecil melintang di dalam toples */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 238,
              width: 268,
              height: 46,
              borderRadius: 10,
              backgroundColor: PAL.road,
              border: `3px solid ${PAL.ink}`,
              boxShadow: '0 4px 0 rgba(0,0,0,0.18)',
            }}
          >
            {[20, 78, 136, 194].map((mx, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: mx,
                  top: 18,
                  width: 34,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: PAL.creamHi,
                }}
              />
            ))}
          </div>

          {/* Kilau pantulan kaca vertikal di sisi kiri & kanan toples */}
          <div
            style={{
              position: 'absolute',
              left: 18,
              top: 24,
              width: 14,
              height: 260,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.52)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 22,
              top: 44,
              width: 8,
              height: 210,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.32)',
            }}
          />
        </div>

        {/* Alas peron kayu di bawah toples kaca */}
        <Slab
          x={6}
          y={360}
          w={328}
          h={20}
          color={PAL.cream}
          shade={PAL.creamLo}
          r={6}
          style={{border: `3px solid ${PAL.ink}`}}
        />
      </div>
    </>
  );
};

export const PB11: React.FC = () => {
  const rawF = useCurrentFrame();
  // Rasa gerak mulus 24 gambar per detik khas Dunia Sampai
  const f = Math.round((rawF * 24) / 30) * (30 / 24);

  // Kamera maju pelan dan naik sepanjang adegan (0..420)
  const camScale = interpolate(f, [0, PB11_DUR], [1, 1.045], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const camLiftY = interpolate(f, [0, PB11_DUR], [0, -12], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // Transisi mulus antar-beat dan keadaan akhir ditahan penuh sampai frame 420
  const b2Op =
    interpolate(f, [36, 48], [0, 1], CLAMP) *
    interpolate(f, [283, 303], [1, 0], CLAMP);
  const b3Op = interpolate(f, [295, 312], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: PAL.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.2} flicker={0.18}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${camScale}) translateY(${camLiftY}px)`,
            transformOrigin: '50% 45%',
          }}
        >
          <SampaiBackdrop />

          {/* Beat 1 (Frame 0-22): Strip kertas terlipat membuka "Kepercayaan" lalu menyusut ke atas */}
          <AbsoluteFill>
            <BeatTitle f={f} />
          </AbsoluteFill>

          {/* Beat 2 (Frame 40-283): Tangan menggenggam koin -> jalan & sinyal + kilas "uang yang hilang" dicoret */}
          <AbsoluteFill style={{opacity: b2Op}}>
            <BeatTransformAndCancel f={f} />
          </AbsoluteFill>

          {/* Beat 3 (Frame 303-420): Warga menaruh koin dengan tangan terbuka ke toples kaca berisi jalan & menara */}
          <AbsoluteFill style={{opacity: b3Op}}>
            <BeatGlassJar f={f} />
          </AbsoluteFill>

          <ProsceniumFrame />
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
