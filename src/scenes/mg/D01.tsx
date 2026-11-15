// Adegan D01 — Kalkulator di Warung (scene 11-18, 636 frame, 30 fps, kanvas 1280x720).
// Teater kertas warung kopi: dari layar kalkulator bergaji Rp5.000.000 dibagi 1.000 menjadi US$5.000 hingga gumaman meja warung.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, H, ROOM, W} from '../../lib/tokens';
import {
  Disc,
  DrawOnEllipse,
  GrainOverlay,
  PaperDefs,
  SparkleBurst,
  bob,
} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const D01_DUR = 636;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Koin dolar hijau zaitun bercincin tanpa teks/simbol
const DollarCoin: React.FC<{x: number; y: number; d?: number}> = ({x, y, d = 44}) => (
  <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d}}>
    <Disc x={d / 2} y={d / 2} d={d} color={C.sage} shade={C.sageLo}>
      <div
        style={{
          position: 'absolute',
          left: d * 0.18,
          top: d * 0.18,
          width: d * 0.64,
          height: d * 0.64,
          borderRadius: '50%',
          border: `${Math.max(2, Math.round(d * 0.08))}px solid ${C.creamHi}`,
          opacity: 0.75,
          boxSizing: 'border-box',
        }}
      />
    </Disc>
  </div>
);

// Koin rupiah kuning madu polos tanpa teks/simbol
const RupiahCoin: React.FC<{x: number; y: number; d?: number}> = ({x, y, d = 36}) => (
  <Disc x={x} y={y} d={d} color={C.amber} shade={C.brassLo} />
);

// Gelas kopi kertas dengan uap tipis bergerak tenang (alas gelas berada di y + 52)
const CoffeeCup: React.FC<{x: number; y: number; f: number; seed?: number}> = ({x, y, f, seed = 0}) => {
  const w1 = bob(f, 48, 3, seed);
  const w2 = bob(f, 54, 4, seed + 15);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 48, height: 54}}>
      <svg
        width={48}
        height={42}
        viewBox="0 0 48 42"
        style={{position: 'absolute', left: 0, top: -34, overflow: 'visible', opacity: 0.58}}
      >
        <path
          d={`M ${16 + w1} 36 C ${10 - w1} 24, ${22 + w1} 14, ${15 + w2 * 0.5} 2`}
          stroke={C.creamHi}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${30 + w2} 38 C ${36 - w2} 26, ${24 + w2} 16, ${31 - w1 * 0.5} 4`}
          stroke={C.creamHi}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <Paper lift={3}>
        <Slab x={6} y={44} w={36} h={8} color={C.creamLo} shade={C.woodLo} shadeH={0.3} r={4} />
        <Slab x={10} y={12} w={28} h={34} color={C.creamHi} shade={C.creamLo} shadeH={0.22} r="3px 3px 8px 8px" />
        <Slab x={10} y={22} w={28} h={12} color={C.wood} shade={C.woodLo} shadeH={0.25} r={0} />
      </Paper>
    </div>
  );
};

// Televisi kertas berlayar polos bercahaya (jangkar warung, menempel pada rak di y + 122)
const PaperTV: React.FC<{x: number; y: number; glow?: number}> = ({x, y, glow = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 150, height: 124}}>
    <div
      style={{
        position: 'absolute',
        left: -28,
        top: -20,
        width: 206,
        height: 170,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(245,197,66,${0.22 * glow}) 0%, rgba(245,197,66,0) 72%)`,
      }}
    />
    <Paper lift={5}>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: -24,
          width: 4,
          height: 28,
          background: C.inkSoft,
          transformOrigin: 'bottom center',
          rotate: '-28deg',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: -24,
          width: 4,
          height: 28,
          background: C.inkSoft,
          transformOrigin: 'bottom center',
          rotate: '26deg',
        }}
      />
      <Slab x={0} y={0} w={150} h={108} color={C.wood} shade={C.woodLo} shadeH={0.2} r={10} />
      <Slab x={14} y={14} w={98} h={80} color={C.creamHi} hi="#FFF8E7" hiH={0.35} shade={C.tape} shadeH={0.15} r={8} />
      <Disc x={130} y={36} d={16} color={C.brass} shade={C.brassLo} />
      <Disc x={130} y={62} d={16} color={C.brass} shade={C.brassLo} />
      <Slab x={22} y={106} w={16} h={18} color={C.woodLo} r={3} />
      <Slab x={112} y={106} w={16} h={18} color={C.woodLo} r={3} />
    </Paper>
  </div>
);

// Lampu gantung warung dengan sorot cahaya kuning madu
const HangingLamp: React.FC<{x: number; wireH: number; warmth?: number}> = ({x, wireH, warmth = 1}) => (
  <div style={{position: 'absolute', left: x, top: 0, width: 0, height: 0}}>
    <div
      style={{
        position: 'absolute',
        left: -210,
        top: wireH + 28,
        width: 420,
        height: 520,
        background: `linear-gradient(180deg, rgba(245,197,66,${0.22 * warmth}) 0%, rgba(243,165,59,${0.09 * warmth}) 55%, rgba(243,165,59,0) 100%)`,
        clipPath: 'polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)',
        pointerEvents: 'none',
      }}
    />
    <Paper lift={4}>
      <Slab x={-3} y={-40} w={6} h={wireH + 42} color={C.inkSoft} r={0} />
      <Slab x={-48} y={wireH} w={96} h={34} color={C.amber} shade={C.amberDim} shadeH={0.28} r="48px 48px 6px 6px" />
      <Disc x={0} y={wireH + 34} d={22} color={C.sparkYellow} />
    </Paper>
  </div>
);

// Tirai teater terakota di tepi kiri dan kanan panggung (dipasang di bingkai proscenium)
const StageCurtains: React.FC = () => (
  <Paper lift={6}>
    {/* Pelmet / valance atas */}
    <Slab x={-10} y={-8} w={W + 20} h={36} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.35} r={6} />
    {/* Tirai kiri */}
    <Slab x={-24} y={0} w={76} h={H + 10} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.18} r="0 0 26px 0" />
    <Slab x={34} y={0} w={26} h={H - 40} color={C.heroLo} r="0 0 20px 10px" />
    <Slab x={-16} y={328} w={74} h={16} color={C.brass} shade={C.brassLo} shadeH={0.35} r={8} rot={-6} />
    {/* Tirai kanan */}
    <Slab x={W - 52} y={0} w={76} h={H + 10} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.18} r="0 0 0 26px" />
    <Slab x={W - 60} y={0} w={26} h={H - 40} color={C.heroLo} r="0 0 10px 20px" />
    <Slab x={W - 58} y={328} w={74} h={16} color={C.brass} shade={C.brassLo} shadeH={0.35} r={8} rot={6} />
  </Paper>
);

// Kartu hasil berbingkai PUTUS-PUTUS (andaian)
const DashedResultCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  rot?: number;
}> = ({x, y, w, h, fontSize, rot = -2}) => (
  <Paper lift={6}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        backgroundColor: C.creamHi,
        borderRadius: 12,
        border: `5px dashed ${C.goDim}`,
        boxShadow: 'inset 0 0 0 4px rgba(45,163,77,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: FONT.banner,
          fontSize,
          color: C.ink,
          letterSpacing: '0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        US$5.000
      </div>
    </div>
  </Paper>
);

export const D01: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak kamera antar-beat (halus, tenang, ter-clamp):
  // Beat 1-3: dari agak lebar ke fokus meja/kalkulator, lalu Beat 4 pan ke meja sebelah & meja kanan, Beat 5 kembali lebar dan tahan.
  const camScale = interpolate(
    f,
    [0, 55, 96, 302, 348, 395, 545, 592, D01_DUR],
    [1.04, 1.12, 1.15, 1.15, 1.2, 1.1, 1.1, 1.0, 1.0],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const camX = interpolate(
    f,
    [0, 55, 96, 348, 410, 470, 545, 592, D01_DUR],
    [70, 115, 0, 0, -80, -180, -180, 0, 0],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const camY = interpolate(
    f,
    [0, 55, 96, 348, 410, 545, 592, D01_DUR],
    [-12, -24, 0, 4, -16, -16, 0, 0],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );

  // Tangan "kamu" meraih ponsel di Beat 1 (scene 11: rel 0-45) dan memegang kalkulator di Beat 5
  const reachP = interpolate(f, [6, 34, 62, 92, 355, 385], [0, 1, 1, 0.4, 0.4, 0.85], clamp);
  const phoneLift = interpolate(f, [24, 58, 92, 350, 385], [0, -24, -60, -60, -10], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  // Panel kalkulator besar di tengah panggung (Beat 1 akhir s/d Beat 3: rel 60-380)
  const calcHeroIn = interpolate(f, [60, 94], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const calcHeroOut = interpolate(f, [350, 380], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const calcHeroVis = calcHeroIn * calcHeroOut;
  const smallPhoneOpacity = interpolate(calcHeroVis, [0, 0.12], [1, 0], clamp);

  // String 1: "Rp5.000.000" (scene 13: rel 117-173; keluar rapi sebelum string berikutnya di rel 188)
  const gajiOut = interpolate(f, [174, 185], [1, 0], clamp);
  const gajiShiftY = interpolate(f, [174, 185], [0, -24], clamp);

  // String 2: "÷ 1.000" pada tab kertas (scene 14: mulai rel 188, keluar bersama kalkulator besar di rel 352-374)
  const divTabOut = interpolate(f, [352, 374], [1, 0], clamp);

  // Menara koin hijau & String 3: "US$5.000" berbingkai putus-putus di Beat 3 (scene 14-15: rel 214-374, keluar sebelum scene 17)
  const towerGrow1 = interpolate(f, [214, 268], [0, 5], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const towerGrow2 = interpolate(f, [302, 336], [0, 3], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const totalCoins = Math.round(towerGrow1 + towerGrow2);
  const usCardHeroOut = interpolate(f, [352, 374], [1, 0], clamp);

  // Beat 4 (scene 16: rel 365-436): meja sebelah bersiul — pita kertas melengkung melayang pelan
  const whistleIn = interpolate(f, [365, 392], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 4 (scene 17: rel 473-545): meja kanan mengangkat tangan + gelembung ucapan "KITA KAYA"
  const cheerRaise = interpolate(f, [468, 496], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });

  // Beat 5 (scene 18: rel 561-636): lampu warung menghangat, koin hijau melayang pelan,
  // garis putus-putus samar mengelilingi warung, kartu putus-putus US$5.000 di sisi kalkulator "kamu"
  const beat5Warmth = interpolate(f, [556, 592], [1, 1.45], clamp);
  const beat5Progress = interpolate(f, [558, 595], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // Hentikan ayunan napas halus secara bertahap menjelang akhir agar pose akhir benar-benar tenang ditahan
  const idleAmp = interpolate(f, [560, 595], [2.2, 0], clamp);
  const breathYou = bob(f, 52, idleAmp, 0);
  const breathMid = bob(f, 48, idleAmp, 18);
  const breathRight = bob(f, 44, idleAmp, 34);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <AbsoluteFill
          style={{
            transformOrigin: '640px 380px',
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          }}
        >
          {/* Latar dinding teater warung kopi (krem hangat dengan suasana senja/malam) */}
          <Slab x={-160} y={-100} w={W + 320} h={FLOOR_Y + 120} color={C.cream} r={0} grain={0.55} />
          <Slab x={-160} y={-100} w={W + 320} h={210} color={C.creamLo} r={0} grain={0.45} style={{opacity: 0.45}} />

          {/* Panel kayu dado warung */}
          <Slab x={-160} y={FLOOR_Y - 150} w={W + 320} h={150} color={ROOM.khaki} shade={C.woodLo} shadeH={0.12} r={0} />
          <Slab x={-160} y={FLOOR_Y - 156} w={W + 320} h={10} color={C.wood} r={0} />

          {/* Jendela malam warung di latar tengah */}
          <Paper lift={4}>
            <Slab x={520} y={108} w={210} h={220} color={C.wood} shade={C.woodLo} shadeH={0.15} r={6} />
            <Slab x={534} y={122} w={182} h={192} color={ROOM.navy} r={4}>
              {[
                [28, 34],
                [134, 42],
                [76, 82],
                [146, 138],
                [42, 148],
              ].map(([sx, sy], i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: sx,
                    top: sy,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: C.creamHi,
                    opacity: 0.85,
                  }}
                />
              ))}
              {/* Bulan sabit kertas tanpa teks */}
              <Disc x={132} y={54} d={28} color={C.sparkYellow} />
              <Disc x={140} y={48} d={24} color={ROOM.navy} />
              <div style={{position: 'absolute', left: 88, top: 0, bottom: 0, width: 6, background: C.wood}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 93, height: 6, background: C.wood}} />
            </Slab>
          </Paper>

          {/* Rak warung + Televisi kertas berlayar polos bercahaya di sudut kiri (kaki TV menempel tepat di rak y=248) */}
          <Paper lift={4}>
            <Slab x={106} y={248} w={204} h={18} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
            <Slab x={126} y={266} w={14} h={28} color={C.woodLo} r={2} />
            <Slab x={276} y={266} w={14} h={28} color={C.woodLo} r={2} />
          </Paper>
          <PaperTV x={132} y={126} glow={beat5Warmth} />

          {/* Rak botol/toples polos di dinding kanan (semua botol menempel tepat di atas rak y=228) */}
          <Paper lift={4}>
            <Slab x={810} y={228} w={230} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
            <Slab x={830} y={244} w={14} h={24} color={C.woodLo} r={2} />
            <Slab x={1006} y={244} w={14} h={24} color={C.woodLo} r={2} />
            <Slab x={834} y={172} w={42} h={58} color={C.amber} shade={C.brassLo} shadeH={0.22} r="8px 8px 3px 3px" />
            <Slab x={842} y={162} w={26} h={12} color={C.woodLo} r={3} />
            <Slab x={894} y={180} w={38} h={50} color={C.sage} shade={C.sageLo} shadeH={0.22} r="8px 8px 3px 3px" />
            <Slab x={950} y={168} w={46} h={62} color={C.creamHi} shade={C.creamLo} shadeH={0.25} r="8px 8px 3px 3px" />
          </Paper>

          {/* Lampu gantung kuning madu di atas tiga meja warung */}
          <HangingLamp x={290} wireH={78} warmth={beat5Warmth} />
          <HangingLamp x={650} wireH={64} warmth={beat5Warmth} />
          <HangingLamp x={980} wireH={78} warmth={beat5Warmth} />

          {/* Lantai papan kertas panggung */}
          <Slab x={-160} y={FLOOR_Y} w={W + 320} h={H - FLOOR_Y + 100} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -160, right: -160, top: FLOOR_Y + 38, height: 3, background: C.floorLo, opacity: 0.8}} />
          <div style={{position: 'absolute', left: -160, right: -160, top: FLOOR_Y + 78, height: 3, background: C.floorLo, opacity: 0.8}} />
          <Slab x={-160} y={FLOOR_Y - 22} w={W + 320} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

          {/* ==================== BEAT 5: KOIN HIJAU MELAYANG PELAN DI LATAR (SCENE 18: rel 561+) ==================== */}
          {f >= 558 ? (
            <div style={{opacity: beat5Progress}}>
              {[
                {x: 310, y0: 292, d: 36, ph: 0},
                {x: 548, y0: 278, d: 34, ph: 12},
                {x: 762, y0: 256, d: 38, ph: 24},
                {x: 1126, y0: 392, d: 34, ph: 36},
              ].map((c, idx) => {
                const liftY = interpolate(f, [558, 595], [26, 0], {
                  ...clamp,
                  easing: Easing.out(Easing.quad),
                });
                return (
                  <DollarCoin
                    key={idx}
                    x={c.x}
                    y={c.y0 + liftY + bob(f, 46, idleAmp, c.ph)}
                    d={c.d}
                  />
                );
              })}
            </div>
          ) : null}

          {/* ==================== MEJA 1 (KIRI): TOKOH UTAMA "KAMU" (SYAL TERAKOTA) ==================== */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            {/* Kursi & tokoh "kamu" */}
            <Paper lift={4}>
              <Slab x={182} y={488} w={68} h={112} color={C.woodLo} r={6} />
            </Paper>
            <div style={{position: 'absolute', left: 0, top: breathYou}}>
              <Figure x={232} y={FLOOR_Y} s={1.08} shirt={C.cream} />
              {/* Tas selempang kecil */}
              <Paper lift={3}>
                <Slab x={204} y={462} w={56} h={10} color={C.woodLo} r={4} rot={32} />
                <Slab x={192} y={494} w={30} h={26} color={C.wood} shade={C.woodLo} shadeH={0.25} r={5} />
              </Paper>
              {/* SYAL KERTAS TERAKOTA panjang (penanda utama "kamu") */}
              <Paper lift={4}>
                <Slab x={198} y={448} w={68} h={22} color={C.tag} shade={C.heroLo} shadeH={0.25} r={8} />
                <Slab
                  x={240}
                  y={458}
                  w={24}
                  h={68}
                  color={C.tag}
                  shade={C.heroLo}
                  shadeH={0.22}
                  r="4px 4px 10px 10px"
                  rot={-8 + bob(f, 40, idleAmp * 0.8, 5)}
                />
                <Slab
                  x={214}
                  y={462}
                  w={18}
                  h={46}
                  color={ROOM.terracotta}
                  r="4px 4px 8px 8px"
                  rot={6}
                />
              </Paper>
              {/* Lengan meraih ponsel / memegang kalkulator bercahaya */}
              <Paper lift={3}>
                <Slab
                  x={248}
                  y={472 - reachP * 8}
                  w={68}
                  h={18}
                  color={C.cream}
                  shade={C.creamLo}
                  shadeH={0.25}
                  r={9}
                  rot={-10 - reachP * 12}
                />
              </Paper>
            </div>

            {/* Meja warung kiri (permukaan meja di y=486) */}
            <Paper lift={5}>
              <Slab x={268} y={486} w={210} h={20} color={C.woodHi} shade={C.wood} shadeH={0.35} r={5} />
              <Slab x={288} y={506} w={18} h={94} color={C.wood} shade={C.woodLo} shadeH={0.2} r={3} />
              <Slab x={442} y={506} w={18} h={94} color={C.wood} shade={C.woodLo} shadeH={0.2} r={3} />
            </Paper>

            {/* Gelas kopi bertuap menempel tepat di permukaan meja kiri (436 + 52 = 488) */}
            <CoffeeCup x={408} y={436} f={f} seed={3} />
            {/* Koin rupiah polos menempel di meja kiri */}
            <RupiahCoin x={378} y={476} d={22} />

            {/* Ponsel / kalkulator kecil bercahaya di tangan "kamu" di atas meja */}
            {smallPhoneOpacity > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 298,
                  top: 432 + phoneLift,
                  opacity: smallPhoneOpacity,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -24,
                    top: -24,
                    width: 94,
                    height: 104,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,197,66,0.5) 0%, rgba(245,197,66,0) 70%)',
                  }}
                />
                <Paper lift={4}>
                  <Slab x={0} y={0} w={44} h={56} color={C.board} shade={C.boardLo} shadeH={0.22} r={7} rot={-8}>
                    <Slab x={5} y={6} w={34} h={20} color={C.sparkYellow} hi={C.creamHi} hiH={0.3} r={4} />
                    {[0, 1, 2, 3, 4, 5].map((bi) => (
                      <Disc
                        key={bi}
                        x={11 + (bi % 3) * 11}
                        y={34 + Math.floor(bi / 3) * 11}
                        d={7}
                        color={C.creamHi}
                      />
                    ))}
                  </Slab>
                </Paper>
              </div>
            ) : null}

            {/* POSE AKHIR (Beat 5, scene 18): kartu hasil berbingkai putus-putus di sisi kalkulator "kamu" */}
            {f >= 558 ? (
              <div style={{opacity: beat5Progress}}>
                <Boil seed="final-us-card" amp={0.4} rot={0.05}>
                  <DashedResultCard x={428} y={366} w={236} h={84} fontSize={40} rot={-2} />
                </Boil>
              </div>
            ) : null}
          </div>

          {/* ==================== MEJA 2 (TENGAH): WARGA BERSIUL (SCENE 16) ==================== */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <div style={{position: 'absolute', left: 0, top: breathMid}}>
              <Figure x={650} y={FLOOR_Y} s={1.04} shirt={ROOM.dusk} />
              {/* Postur bahu/kerah warga tengah */}
              <Paper lift={3}>
                <Slab x={618} y={454} w={64} h={16} color={C.brass} shade={C.brassLo} shadeH={0.25} r={6} />
              </Paper>
            </div>

            {/* Meja warung tengah (permukaan meja di y=492) */}
            <Paper lift={5}>
              <Slab x={566} y={492} w={176} h={18} color={C.woodHi} shade={C.wood} shadeH={0.35} r={5} />
              <Slab x={584} y={510} w={16} h={90} color={C.wood} r={3} />
              <Slab x={710} y={510} w={16} h={90} color={C.wood} r={3} />
            </Paper>
            {/* Gelas kopi menempel tepat di permukaan meja tengah (442 + 52 = 494) */}
            <CoffeeCup x={588} y={442} f={f} seed={19} />

            {/* Pita kertas melengkung melayang pelan (siulan tanpa teks/simbol, scene 16: rel 365+) */}
            {f >= 365 ? (
              <div style={{position: 'absolute', left: 668, top: 344, opacity: whistleIn}}>
                <Boil seed="whistle-ribbons" amp={0.4} rot={0.05}>
                  <svg
                    width={170}
                    height={110}
                    viewBox="0 0 170 110"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: bob(f, 42, idleAmp * 1.2, 7),
                      overflow: 'visible',
                      filter: 'url(#rough) drop-shadow(2px 4px 5px rgba(0,0,0,0.28))',
                    }}
                  >
                    <path
                      d="M 8 78 C 36 52, 68 84, 104 48 C 126 26, 146 38, 162 18"
                      stroke={C.amber}
                      strokeWidth={10}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={220}
                      strokeDashoffset={220 * (1 - whistleIn)}
                    />
                    <path
                      d="M 18 96 C 48 76, 82 98, 118 68 C 136 52, 150 58, 164 44"
                      stroke={C.creamHi}
                      strokeWidth={7}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={200}
                      strokeDashoffset={200 * (1 - whistleIn)}
                    />
                    <path
                      d="M 4 54 C 28 32, 58 50, 88 24 C 106 10, 124 16, 138 4"
                      stroke={C.tag}
                      strokeWidth={7}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={180}
                      strokeDashoffset={180 * (1 - whistleIn)}
                    />
                  </svg>
                </Boil>
              </div>
            ) : null}
          </div>

          {/* ==================== MEJA 3 (KANAN): WARGA BERKATA "KITA KAYA" (SCENE 17) ==================== */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: breathRight - cheerRaise * 8,
              }}
            >
              {/* Kedua lengan di samping tubuh, lalu terangkat ke atas saat "kita kaya" (scene 17: rel 468+) */}
              <Paper lift={3}>
                <Slab
                  x={944 - cheerRaise * 6}
                  y={468 - cheerRaise * 50}
                  w={20}
                  h={58}
                  color={ROOM.sage}
                  shade={C.sageLo}
                  shadeH={0.22}
                  r={9}
                  rot={10 - cheerRaise * 46}
                />
                <Slab
                  x={1012 + cheerRaise * 6}
                  y={468 - cheerRaise * 50}
                  w={20}
                  h={58}
                  color={ROOM.sage}
                  shade={C.sageLo}
                  shadeH={0.22}
                  r={9}
                  rot={-10 + cheerRaise * 46}
                />
              </Paper>
              <Figure x={988} y={FLOOR_Y} s={1.06} shirt={ROOM.sage} />
            </div>

            {/* Meja warung kanan (permukaan meja di y=492) */}
            <Paper lift={5}>
              <Slab x={900} y={492} w={184} h={18} color={C.woodHi} shade={C.wood} shadeH={0.35} r={5} />
              <Slab x={918} y={510} w={16} h={90} color={C.wood} r={3} />
              <Slab x={1050} y={510} w={16} h={90} color={C.wood} r={3} />
            </Paper>
            {/* Gelas kopi menempel tepat di permukaan meja kanan (442 + 52 = 494) */}
            <CoffeeCup x={1014} y={442} f={f} seed={31} />

            {/* Gelembung ucapan kertas "KITA KAYA" (scene 17: rel 473 s/d akhir) */}
            {f >= 470 ? (
              <PopIn at={470} seed="kita-kaya" origin="988px 310px">
                <Boil seed="kita-kaya-boil" amp={0.4} rot={0.05}>
                  <Paper lift={6}>
                    {/* Ekor gelembung ucapan menempel langsung ke gelembung dan menunjuk ke tokoh kanan */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 970,
                        top: 342,
                        width: 34,
                        height: 36,
                        background: C.ink,
                        clipPath: 'polygon(10% 0%, 90% 0%, 50% 100%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 974,
                        top: 338,
                        width: 26,
                        height: 32,
                        background: C.creamHi,
                        clipPath: 'polygon(12% 0%, 88% 0%, 50% 100%)',
                      }}
                    />
                    <Slab
                      x={844}
                      y={252}
                      w={284}
                      h={94}
                      color={C.creamHi}
                      shade={C.creamLo}
                      shadeH={0.14}
                      r={22}
                      rot={1.5}
                      style={{
                        border: `4px solid ${C.ink}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONT.banner,
                          fontSize: 42,
                          color: C.ink,
                          letterSpacing: '0.02em',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        KITA KAYA
                      </div>
                    </Slab>
                  </Paper>
                </Boil>
              </PopIn>
            ) : null}
          </div>

          {/* ==================== BEAT 2 & 3: KALKULATOR KERTAS BESAR DI TENGAH (SCENE 12-15) ==================== */}
          {calcHeroVis > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: calcHeroVis,
                transformOrigin: '640px 410px',
                transform: `translateY(${(1 - calcHeroVis) * 70}px) scale(${0.74 + 0.26 * calcHeroVis})`,
              }}
            >
              {/* Redup lembut latar belakang supaya kalkulator dan angka sangat kontras & terbaca */}
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(circle at 640px 380px, rgba(28,27,23,0.12) 0%, rgba(28,27,23,0.44) 100%)',
                }}
              />

              <Boil seed="calc-hero" amp={0.4} rot={0.05}>
                {/* Bodi kalkulator kertas besar */}
                <Paper lift={10}>
                  <Slab
                    x={430}
                    y={218}
                    w={420}
                    h={418}
                    color={C.board}
                    shade={C.boardLo}
                    shadeH={0.14}
                    hi={C.boardHi}
                    hiH={0.08}
                    r={22}
                  />
                  {/* Bingkai dalam kertas krem */}
                  <Slab x={452} y={240} w={376} h={374} color={C.creamLo} shade={C.tape} shadeH={0.12} r={16} />

                  {/* Layar kalkulator menyala hangat */}
                  <Slab
                    x={472}
                    y={256}
                    w={336}
                    h={114}
                    color={C.amber}
                    hi={C.sparkYellow}
                    hiH={0.35}
                    shade={C.brass}
                    shadeH={0.18}
                    r={12}
                    style={{
                      boxShadow: 'inset 0 0 24px rgba(255,248,220,0.65), 0 0 28px rgba(245,197,66,0.45)',
                    }}
                  />

                  {/* Deretan tombol cakram polos TANPA ANGKA */}
                  {[0, 1, 2].map((row) =>
                    [0, 1, 2, 3].map((col) => (
                      <Disc
                        key={`${row}-${col}`}
                        x={516 + col * 82}
                        y={418 + row * 70}
                        d={50}
                        color={col === 3 ? C.tag : C.creamHi}
                        shade={col === 3 ? C.heroLo : C.creamLo}
                      />
                    )),
                  )}
                </Paper>

                {/* Lingkaran sorot lembut tanpa teks pada layar di Beat 3 */}
                {f >= 188 && f <= 368 ? (
                  <DrawOnEllipse
                    at={190}
                    x={640}
                    y={313}
                    w={386}
                    h={150}
                    color={C.sparkYellow}
                    stroke={6}
                    dur={14}
                  />
                ) : null}

                {/* String 1: "Rp5.000.000" utuh sekaligus di layar kalkulator (scene 13: rel 115-184) */}
                {f >= 115 && f < 186 ? (
                  <PopIn at={115} seed="gaji-rp" origin="640px 313px">
                    <div
                      style={{
                        position: 'absolute',
                        left: 640,
                        top: 313 + gajiShiftY,
                        translate: '-50% -50%',
                        opacity: gajiOut,
                      }}
                    >
                      <Paper lift={4}>
                        <Slab
                          x={-152}
                          y={-39}
                          w={304}
                          h={78}
                          color={C.creamHi}
                          shade={C.creamLo}
                          shadeH={0.18}
                          r={8}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: FONT.banner,
                              fontSize: 44,
                              color: C.ink,
                              letterSpacing: '0.01em',
                              lineHeight: 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Rp5.000.000
                          </div>
                        </Slab>
                      </Paper>
                    </div>
                  </PopIn>
                ) : null}

                {/* String 2: Tab kertas "÷ 1.000" dicap di sisi kanan layar (scene 14: rel 186-374) */}
                {f >= 186 && f < 375 ? (
                  <div style={{opacity: divTabOut}}>
                    <SlideIn at={186} dx={48} dy={0} dur={10}>
                      <Tag
                        x={888}
                        y={284}
                        text="÷ 1.000"
                        at={186}
                        bg={C.tag}
                        color={C.tagText}
                        size={40}
                        rot={4}
                        seed="div-1000"
                      />
                    </SlideIn>
                  </div>
                ) : null}

                {/* Menara koin hijau tumbuh dari dalam layar kalkulator (scene 14-15: rel 214-374) */}
                {f >= 214 && f < 375 ? (
                  <div style={{opacity: usCardHeroOut}}>
                    {Array.from({length: totalCoins}).map((_, ci) => (
                      <DollarCoin
                        key={ci}
                        x={640 + ((ci % 2) - 0.5) * 6}
                        y={334 - ci * 16}
                        d={62}
                      />
                    ))}

                    {/* Kilau lembut pada pengulangan "Lima ribu dolar" (scene 15: rel 302+) */}
                    <SparkleBurst at={304} x={494} y={146} seed="sp-left" spread={1.2} />
                    <SparkleBurst at={312} x={786} y={146} seed="sp-right" spread={1.2} />
                  </div>
                ) : null}

                {/* String 3: Kartu berbingkai PUTUS-PUTUS "US$5.000" di atas menara koin (scene 14-15: rel 218-374) */}
                {f >= 218 && f < 375 ? (
                  <div style={{opacity: usCardHeroOut}}>
                    <PopIn at={218} seed="us-5000-hero" origin="640px 148px">
                      <DashedResultCard x={640} y={148} w={316} h={100} fontSize={54} rot={-2} />
                    </PopIn>
                  </div>
                ) : null}
              </Boil>
            </div>
          ) : null}

          {/* Debu kertas melayang sangat pelan */}
          {[
            [210, 190, 0],
            [460, 150, 11],
            [760, 170, 23],
            [1040, 210, 37],
            [580, 390, 49],
          ].map(([dx, dy, ph], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: dx + bob(f, 90, 8, ph),
                top: dy + bob(f, 76, 6, ph + 10),
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: C.creamHi,
                opacity: 0.35,
                pointerEvents: 'none',
              }}
            />
          ))}
        </AbsoluteFill>

        {/* Tirai teater terakota di tepi kiri-kanan panggung (proscenium tetap) */}
        <StageCurtains />

        {/* Seutas garis putus-putus samar mengelilingi seluruh warung di Beat 5 (scene 18: rel 561+) */}
        {f >= 558 ? (
          <div
            style={{
              position: 'absolute',
              left: 66,
              top: 44,
              width: W - 132,
              height: H - 78,
              borderRadius: 20,
              border: `4px dashed ${C.creamHi}`,
              opacity: 0.55 * beat5Progress,
              boxShadow: 'inset 0 0 40px rgba(245,197,66,0.18)',
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {/* Vinyet lembut teater */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(255,248,230,0.08) 0%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.34) 100%)',
            pointerEvents: 'none',
          }}
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
