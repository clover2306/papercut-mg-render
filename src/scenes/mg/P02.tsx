// Adegan P02: "Uang yang Pergi Sendiri" (scene 6-15, dapur malam & toples saldo).
// Menggambarkan gaji penuh yang menyusut ke seperempat saat koin hantu mengalir ke lima kebutuhan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab, bob} from '../../lib/paper/kit';
import {FeltFibre, FilmWeave} from '../../lib/paper/look';

export const P02_DUR = 567;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const easeInOut = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

function sampleTrack(f: number, frames: readonly number[], values: readonly number[]): number {
  if (f <= frames[0]) return values[0];
  const last = frames.length - 1;
  if (f >= frames[last]) return values[last];
  for (let i = 0; i < last; i++) {
    if (f >= frames[i] && f <= frames[i + 1]) {
      return interpolate(f, [frames[i], frames[i + 1]], [values[i], values[i + 1]], {
        ...clamp,
        easing: easeInOut,
      });
    }
  }
  return values[last];
}

function quadBezier(
  t: number,
  p0: readonly [number, number],
  p1: readonly [number, number],
  p2: readonly [number, number],
): [number, number] {
  const mt = 1 - t;
  const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0];
  const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1];
  return [x, y];
}

const CoinDisc: React.FC<{x: number; y: number; r?: number; opacity?: number}> = ({
  x,
  y,
  r = 14,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r * 0.52,
      width: r * 2,
      height: r * 1.04,
      borderRadius: '50%',
      backgroundColor: C.sparkYellow,
      border: `2px solid ${C.brassLo}`,
      boxShadow: `0 3px 0 ${C.brass}, 0 4px 6px rgba(0,0,0,0.22)`,
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 3,
        borderRadius: '50%',
        border: `1.5px solid ${C.brass}`,
        opacity: 0.75,
      }}
    />
  </div>
);

const GhostCoin: React.FC<{x: number; y: number; r?: number; opacity?: number; rot?: number}> = ({
  x,
  y,
  r = 15,
  opacity = 0.88,
  rot = 0,
}) => (
  <svg
    width={r * 2 + 8}
    height={r * 2 + 8}
    viewBox={`${-r - 4} ${-r - 4} ${r * 2 + 8} ${r * 2 + 8}`}
    style={{
      position: 'absolute',
      left: x - r - 4,
      top: y - r - 4,
      opacity,
      transform: `rotate(${rot}deg)`,
      overflow: 'visible',
      filter: 'drop-shadow(0 3px 6px rgba(245,197,66,0.28))',
    }}
  >
    <circle
      cx={0}
      cy={0}
      r={r}
      fill="rgba(255, 243, 204, 0.34)"
      stroke="#F5D376"
      strokeWidth={2.2}
      strokeDasharray="5 4"
    />
    <circle
      cx={0}
      cy={0}
      r={r * 0.64}
      fill="none"
      stroke="#F5D376"
      strokeWidth={1.4}
      strokeDasharray="3 3"
      opacity={0.85}
    />
  </svg>
);

const KitchenWindow: React.FC<{f: number}> = ({f}) => {
  // Siklus cahaya minggu berlalu (malam -> pagi -> malam) selama sapuan tirai beat 1-2
  const morningU = interpolate(f, [44, 53, 56, 65], [0, 1, 1, 0], clamp);
  const nightOpacity = 1 - morningU;
  const sunY = interpolate(f, [45, 55, 64], [190, 56, 190], clamp);
  const moonY = interpolate(f, [0, 44, 64, P02_DUR], [54, 62, 52, 68], clamp);

  return (
    <div style={{position: 'absolute', left: 112, top: 108, width: 256, height: 224}}>
      <Paper lift={4}>
        {/* Bingkai luar jendela */}
        <Slab x={0} y={0} w={256} h={224} color={C.creamLo} shade={C.woodLo} shadeH={0.08} r={6} />
        {/* Langit malam */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            width: 224,
            height: 192,
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #16223B 0%, #24375A 100%)',
          }}
        >
          {/* Langit pagi saat transisi seminggu */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: morningU,
              background: 'linear-gradient(180deg, #7BA8C4 0%, #F0C678 100%)',
            }}
          />
          {/* Bintang kertas kecil saat malam */}
          {[
            [32, 30],
            [178, 38],
            [68, 72],
            [154, 84],
            [42, 128],
          ].map(([sx, sy], idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: sx,
                top: sy,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: C.creamHi,
                opacity: nightOpacity * 0.85,
              }}
            />
          ))}
          {/* Bulan sabit kertas */}
          <svg
            width={34}
            height={34}
            viewBox="0 0 34 34"
            style={{position: 'absolute', left: 152, top: moonY, opacity: nightOpacity}}
          >
            <path
              d="M20 4 A13 13 0 1 0 30 23 A10 10 0 1 1 20 4 Z"
              fill={C.sparkYellow}
            />
          </svg>
          {/* Matahari pagi kertas */}
          <div
            style={{
              position: 'absolute',
              left: 84,
              top: sunY,
              width: 46,
              height: 46,
              borderRadius: '50%',
              backgroundColor: '#F7C95C',
              opacity: morningU,
              boxShadow: '0 0 18px rgba(247, 201, 92, 0.7)',
            }}
          />
          {/* Awan kertas rendah */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 136,
              width: 92,
              height: 24,
              borderRadius: 12,
              backgroundColor: morningU > 0.3 ? C.creamHi : '#2F446B',
              opacity: 0.75,
            }}
          />
          {/* Palang jendela kertas */}
          <div style={{position: 'absolute', left: 107, top: 0, bottom: 0, width: 10, backgroundColor: C.creamLo}} />
          <div style={{position: 'absolute', top: 91, left: 0, right: 0, height: 10, backgroundColor: C.creamLo}} />
        </div>
        {/* Tirai jendela kiri-kanan */}
        <Slab x={-18} y={-8} w={52} h={240} color="#C69C4B" shade="#9D7A36" shadeH={0.08} r="4px 4px 22px 22px" />
        <Slab x={222} y={-8} w={52} h={240} color="#C69C4B" shade="#9D7A36" shadeH={0.08} r="4px 4px 22px 22px" />
        {/* Ambang bawah jendela */}
        <Slab x={-12} y={216} w={280} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
      </Paper>
    </div>
  );
};

const KitchenBackCounter: React.FC<{f: number}> = ({f}) => {
  const steam1 = bob(f, 52, 6, 0);
  const steam2 = bob(f, 64, 7, 1.8);

  return (
    <div style={{position: 'absolute', left: 680, top: 430, width: 540, height: 170}}>
      <Paper lift={4}>
        {/* Meja kabinet dapur latar */}
        <Slab x={20} y={55} w={500} h={115} color="#B8A996" shade="#9B8C79" shadeH={0.14} r={4} />
        <Slab x={10} y={45} w={520} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
        {/* Garis pintu laci tanpa gagang berangka */}
        <div style={{position: 'absolute', left: 46, top: 74, width: 132, height: 82, border: `2px solid ${C.creamLo}`, borderRadius: 3}} />
        <div style={{position: 'absolute', left: 204, top: 74, width: 132, height: 82, border: `2px solid ${C.creamLo}`, borderRadius: 3}} />
        <div style={{position: 'absolute', left: 362, top: 74, width: 132, height: 82, border: `2px solid ${C.creamLo}`, borderRadius: 3}} />
        {/* Kompor kertas */}
        <Slab x={88} y={32} w={138} h={14} color={C.board} shade={C.boardLo} shadeH={0.35} r={3} />
        <Slab x={104} y={26} w={42} h={6} color={C.inkSoft} r={2} />
        <Slab x={168} y={26} w={42} h={6} color={C.inkSoft} r={2} />
        {/* Panci kertas di atas kompor */}
        <Slab x={100} y={-8} w={54} h={34} color={C.metal} shade={C.metalLo} shadeH={0.22} r="3px 3px 8px 8px" />
        <Slab x={96} y={-13} w={62} h={7} color={C.metalLo} r={3} />
        <Slab x={121} y={-20} w={12} h={7} color={C.woodLo} r={3} />
        {/* Ketel kecil di tungku kanan */}
        <Slab x={168} y={2} w={42} h={24} color={C.tag} shade={C.heroLo} shadeH={0.25} r="14px 14px 4px 4px" />
      </Paper>
      {/* Uap kertas lembut naik dari panci */}
      <svg width={90} height={70} viewBox="0 0 90 70" style={{position: 'absolute', left: 86, top: -72, overflow: 'visible'}}>
        <path
          d={`M28 56 Q20 ${40 + steam1} 30 ${24 + steam1} Q38 ${12 + steam1} 28 2`}
          fill="none"
          stroke={C.creamHi}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M46 58 Q54 ${42 + steam2} 44 ${26 + steam2} Q36 ${14 + steam2} 46 4`}
          fill="none"
          stroke={C.creamHi}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.45}
        />
      </svg>
    </div>
  );
};

const HangingLamp: React.FC<{f: number}> = ({f}) => {
  const sway = Math.sin(f / 26) * 1.4;
  return (
    <div
      style={{
        position: 'absolute',
        left: 318,
        top: -10,
        width: 240,
        height: 480,
        transformOrigin: '120px 0px',
        transform: `rotate(${sway}deg)`,
        pointerEvents: 'none',
      }}
    >
      {/* Kerucut cahaya hangat lampu dapur */}
      <div
        style={{
          position: 'absolute',
          left: -10,
          top: 132,
          width: 260,
          height: 360,
          background: 'linear-gradient(180deg, rgba(255,222,130,0.22) 0%, rgba(255,222,130,0.03) 100%)',
          clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <Paper lift={5}>
        <Slab x={117} y={0} w={6} h={94} color={C.inkSoft} r={2} />
        <Slab x={68} y={90} w={104} h={46} color={C.amber} shade={C.amberDim} shadeH={0.22} r="48px 48px 6px 6px" />
        <div
          style={{
            position: 'absolute',
            left: 106,
            top: 130,
            width: 28,
            height: 16,
            borderRadius: '0 0 14px 14px',
            backgroundColor: '#FFF0B3',
          }}
        />
      </Paper>
    </div>
  );
};

const SimpleBasket: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 104, height: 76, translate: '-50% -100%'}}>
    <Paper lift={5}>
      {/* Sayuran kertas hijau di dalam keranjang */}
      <Slab x={18} y={6} w={24} h={42} color="#58824E" hi="#749E68" hiH={0.25} r="50% 50% 30% 30%" rot={-18} />
      <Slab x={34} y={2} w={26} h={46} color="#476F3E" hi="#658E5B" hiH={0.25} r="50% 50% 30% 30%" rot={6} />
      <Slab x={52} y={8} w={22} h={40} color="#6A945C" r="50% 50% 30% 30%" rot={22} />
      {/* Sabun / kemasan polos tanpa tulisan */}
      <Slab x={64} y={18} w={26} h={32} color={C.creamHi} shade={C.creamLo} shadeH={0.2} r={4} rot={10} />
      {/* Badan keranjang anyam kertas */}
      <Slab x={10} y={32} w={84} h={44} color="#B88752" shade="#8F6438" shadeH={0.22} r="4px 4px 16px 16px" />
      <Slab x={6} y={28} w={92} h={10} color="#C99862" shade="#9E7142" shadeH={0.3} r={4} />
      <div style={{position: 'absolute', left: 20, top: 46, right: 20, height: 2, backgroundColor: '#8F6438', opacity: 0.55}} />
      <div style={{position: 'absolute', left: 24, top: 58, right: 24, height: 2, backgroundColor: '#8F6438', opacity: 0.55}} />
    </Paper>
  </div>
);

const CoinJar: React.FC<{x: number; bottomY: number; f: number}> = ({x, bottomY, f}) => {
  // Beat 1 (0..40): koin mengisi toples dari 0,15 hingga penuh (1,0).
  // Setelah sapuan tirai minggu (frame 54): saldo tinggal seperempat (0,25).
  const initialFill = interpolate(f, [6, 40], [0.14, 0.96], {...clamp, easing: easeOut});
  const fillLevel = f < 54 ? initialFill : 0.25;

  const jarW = 104;
  const jarH = 164;
  const innerH = 136;
  const filledH = Math.round(innerH * fillLevel);
  const coinRows = Math.max(2, Math.round(fillLevel * 12));

  // Kilau hangat saat penuh di Beat 1
  const fullGlow = interpolate(f, [34, 42, 52, 55], [0, 1, 1, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: bottomY,
        width: jarW,
        height: jarH,
        translate: '-50% -100%',
      }}
    >
      {/* Kilau hangat lembut di sekitar toples saat penuh */}
      {fullGlow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: -18,
            borderRadius: 28,
            background: 'radial-gradient(circle, rgba(245,197,66,0.42) 0%, rgba(245,197,66,0) 72%)',
            opacity: fullGlow,
          }}
        />
      ) : null}

      <Paper lift={6}>
        {/* Dinding belakang toples kaca */}
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 20,
            width: jarW - 16,
            height: jarH - 24,
            borderRadius: '14px 14px 18px 18px',
            backgroundColor: 'rgba(224, 238, 244, 0.34)',
            border: '3px solid rgba(245, 250, 252, 0.78)',
            boxSizing: 'border-box',
          }}
        />

        {/* Tumpukan koin kertas polos di dalam toples */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 10,
            width: jarW - 28,
            height: filledH,
            overflow: 'hidden',
            borderRadius: '4px 4px 12px 12px',
          }}
        >
          {Array.from({length: coinRows}).map((_, rowIdx) => {
            const cy = filledH - 8 - rowIdx * 11;
            const offset = (rowIdx % 2) * 8 - 4;
            return (
              <React.Fragment key={rowIdx}>
                <CoinDisc x={22 + offset} y={cy} r={13} />
                <CoinDisc x={52 + offset} y={cy - 2} r={13} />
              </React.Fragment>
            );
          })}
        </div>

        {/* Garis ukur kaca tipis tanpa angka (menegaskan bagian 3/4 kosong) */}
        {[0.25, 0.5, 0.75].map((frac, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 16,
              bottom: 10 + innerH * frac,
              width: frac === 0.25 ? 20 : 12,
              height: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
            }}
          />
        ))}

        {/* Kilau kaca vertikal depan */}
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 32,
            width: 8,
            height: jarH - 48,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.36)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 18,
            top: 38,
            width: 4,
            height: jarH - 62,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
          }}
        />

        {/* Leher dan bibir mulut toples */}
        <Slab x={16} y={10} w={jarW - 32} h={12} color="rgba(218, 234, 242, 0.75)" r={4} />
        <Slab x={12} y={2} w={jarW - 24} h={10} color="#E9F2F6" shade="#B9CDD6" shadeH={0.35} r={5} />
      </Paper>
    </div>
  );
};

const SalaryEnvelopePour: React.FC<{jarX: number; mouthY: number; f: number}> = ({
  jarX,
  mouthY,
  f,
}) => {
  const vis = interpolate(f, [0, 4, 40, 48], [0, 1, 1, 0], clamp);
  if (vis <= 0.01) return null;

  const tilt = interpolate(f, [2, 12, 34, 44], [-14, -44, -44, -12], {...clamp, easing: easeInOut});
  const envX = interpolate(f, [0, 8, 40, 48], [jarX - 96, jarX - 66, jarX - 66, jarX - 110], clamp);
  const envY = interpolate(f, [0, 8, 40, 48], [mouthY - 92, mouthY - 68, mouthY - 68, mouthY - 96], clamp);

  return (
    <div style={{opacity: vis}}>
      {/* Koin kertas polos mengalir masuk ke mulut toples */}
      {[0, 1, 2, 3, 4].map((idx) => {
        const startF = 8 + idx * 5;
        const t = interpolate(f, [startF, startF + 11], [0, 1], {...clamp, easing: easeInOut});
        if (t <= 0 || t >= 1) return null;
        const [cx, cy] = quadBezier(
          t,
          [jarX - 34, mouthY - 46],
          [jarX - 8, mouthY - 34],
          [jarX + (idx % 2 === 0 ? -6 : 6), mouthY + 12],
        );
        return <CoinDisc key={idx} x={cx} y={cy} r={11} />;
      })}

      {/* Amplop polos miring tanpa tulisan/angka */}
      <div
        style={{
          position: 'absolute',
          left: envX,
          top: envY,
          width: 96,
          height: 62,
          transformOrigin: '88px 46px',
          transform: `rotate(${tilt}deg)`,
        }}
      >
        <Paper lift={8}>
          <Slab x={0} y={0} w={96} h={62} color={C.creamHi} shade={C.creamLo} shadeH={0.18} r={4} />
          {/* Lipatan segitiga amplop */}
          <svg width={96} height={62} viewBox="0 0 96 62" style={{position: 'absolute', inset: 0}}>
            <polygon points="2,2 48,34 94,2" fill={C.cream} stroke={C.creamLo} strokeWidth={1.5} />
            <polyline points="2,60 36,30" fill="none" stroke={C.creamLo} strokeWidth={1.5} />
            <polyline points="94,60 60,30" fill="none" stroke={C.creamLo} strokeWidth={1.5} />
          </svg>
        </Paper>
      </div>
    </div>
  );
};

const MainCharacterKamu: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  // Gerak bernapas halus
  const breath = bob(f, 70, 2.2, 0);

  // Beat 2 (62-115): menunduk pelan menatap toples
  const lookDown = interpolate(f, [62, 76, 125, 140], [0, 1, 1, 0], {...clamp, easing: easeInOut});
  // Beat 3 (143-184): membuka kedua telapak tangan dan menggeleng pelan
  const openPalms = interpolate(f, [143, 155, 178, 190], [0, 1, 1, 0], {...clamp, easing: easeInOut});
  const headShake =
    f >= 146 && f <= 184
      ? Math.sin(((f - 146) / 38) * Math.PI * 3) *
        interpolate(f, [146, 152, 176, 184], [0, 6, 6, 0], clamp)
      : 0;
  // Beat 4 (195-269): kepala miring bingung menatap gelembung pikiran kosong
  const headTilt = interpolate(f, [196, 210, 260, 274], [0, 10, 10, 0], {...clamp, easing: easeInOut});
  // Beat 5-10 (290-567): menoleh lembut ke kanan mengikuti jalur koin hantu ke rak
  const lookRight = interpolate(f, [292, 314], [0, 1], {...clamp, easing: easeInOut});

  const headRot = -7 * lookDown + headTilt + 5 * lookRight;
  const headOffsetX = headShake + 4 * lookRight;
  const headOffsetY = 3 * lookDown + breath * 0.6;

  // Sudut lengan kiri-kanan saat membuka telapak tangan di Beat 3
  const leftArmRot = 14 - 46 * openPalms + 4 * lookDown;
  const rightArmRot = -14 + 48 * openPalms - 8 * lookRight;
  const scarfWave = Math.sin(f / 32) * 2.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 136,
        height: 238,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={7}>
        {/* Kaki celana gelap rapi */}
        <Slab x={45} y={176} w={20} h={62} color={C.inkSoft} shade={C.ink} shadeH={0.25} r="4px 4px 7px 7px" />
        <Slab x={71} y={176} w={20} h={62} color={C.inkSoft} shade={C.ink} shadeH={0.25} r="4px 4px 7px 7px" />

        {/* Lengan kiri (berkemeja biru sabak + telapak tangan kertas) */}
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 86 + breath,
            width: 18,
            height: 74,
            transformOrigin: '9px 6px',
            transform: `rotate(${leftArmRot}deg)`,
          }}
        >
          <Slab x={0} y={0} w={18} h={62} color={ROOM.slate} shade="#394A5C" shadeH={0.22} r={8} />
          <div
            style={{
              position: 'absolute',
              left: 1,
              top: 58,
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </div>

        {/* Badan kemeja biru sabak */}
        <Slab
          x={36}
          y={76 + breath}
          w={64}
          h={104}
          color={ROOM.slate}
          shade="#394A5C"
          shadeH={0.16}
          hi="#627B94"
          hiH={0.1}
          r="16px 16px 8px 8px"
        />
        {/* Garis kancing kemeja polos */}
        <div
          style={{
            position: 'absolute',
            left: 67,
            top: 98 + breath,
            width: 2,
            height: 76,
            backgroundColor: '#394A5C',
            opacity: 0.7,
          }}
        />
        {[112, 132, 152].map((by, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 66,
              top: by + breath,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: C.cream,
              opacity: 0.85,
            }}
          />
        ))}

        {/* Syal kertas hangat terakota (konsisten dengan P01) */}
        <Slab
          x={44}
          y={72 + breath}
          w={48}
          h={18}
          color={C.tag}
          shade="#9E3F29"
          shadeH={0.3}
          r={8}
        />
        {/* Ujung syal terakota menjuntai di dada */}
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 84 + breath,
            width: 15,
            height: 44,
            transformOrigin: '7px 0px',
            transform: `rotate(${-6 + scarfWave}deg)`,
          }}
        >
          <Slab x={0} y={0} w={15} h={44} color={C.tag} shade="#9E3F29" shadeH={0.22} r="3px 3px 5px 5px" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 61,
            top: 86 + breath,
            width: 14,
            height: 36,
            transformOrigin: '7px 0px',
            transform: `rotate(${8 - scarfWave * 0.8}deg)`,
          }}
        >
          <Slab x={0} y={0} w={14} h={36} color={C.hero} shade={C.heroLo} shadeH={0.22} r="3px 3px 5px 5px" />
        </div>

        {/* Lengan kanan */}
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 86 + breath,
            width: 18,
            height: 74,
            transformOrigin: '9px 6px',
            transform: `rotate(${rightArmRot}deg)`,
          }}
        >
          <Slab x={0} y={0} w={18} h={62} color={ROOM.slate} shade="#394A5C" shadeH={0.22} r={8} />
          <div
            style={{
              position: 'absolute',
              left: 1,
              top: 58,
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </div>

        {/* Tas kantor di sisi kanan tokoh (konsisten dengan P01) */}
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 144 + breath * 0.7,
            width: 44,
            height: 34,
            transform: `rotate(${openPalms * -8}deg)`,
          }}
        >
          {/* Pegangan atas tas */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -8,
              width: 16,
              height: 10,
              borderRadius: '6px 6px 0 0',
              border: `3px solid ${C.woodLo}`,
              borderBottom: 'none',
            }}
          />
          <Slab x={0} y={0} w={44} h={34} color={C.wood} shade={C.woodLo} shadeH={0.28} r={5} />
          <Slab x={0} y={0} w={44} h={14} color={C.woodHi} shade={C.wood} shadeH={0.25} r="5px 5px 3px 3px" />
          {/* Gesper kuningan polos tanpa teks */}
          <Slab x={19} y={11} w={6} h={7} color={C.brass} r={2} />
        </div>

        {/* Kepala bulat polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: 41 + headOffsetX,
            top: 10 + headOffsetY,
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
            boxSizing: 'border-box',
            transformOrigin: '27px 48px',
            transform: `rotate(${headRot}deg)`,
          }}
        />
      </Paper>
    </div>
  );
};

const LuxuryThoughtBubble: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  // Beat 4 (195-269): muncul halus, menampilkan 3 siluet putus-putus kosong, lalu memudar pelan jadi kosong
  const bubbleOpacity = interpolate(f, [196, 208, 255, 270], [0, 1, 1, 0], clamp);
  if (bubbleOpacity <= 0.01) return null;

  const scale = interpolate(f, [196, 210], [0.86, 1], {...clamp, easing: easeOut});
  const itemsFade = interpolate(f, [246, 260], [1, 0], clamp);
  const crownOp = interpolate(f, [205, 214], [0, 1], clamp) * itemsFade;
  const bagOp = interpolate(f, [216, 225], [0, 1], clamp) * itemsFade;
  const carOp = interpolate(f, [227, 236], [0, 1], clamp) * itemsFade;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 248,
        height: 152,
        translate: '-50% -100%',
        opacity: bubbleOpacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={7}>
        {/* Bulatan-bulatan kecil penghubung gelembung pikiran */}
        <div
          style={{
            position: 'absolute',
            left: 106,
            top: 136,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `2px solid ${C.creamLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 114,
            top: 118,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `2px solid ${C.creamLo}`,
          }}
        />
        {/* Badan awan gelembung pikiran kertas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 248,
            height: 112,
            borderRadius: 56,
            backgroundColor: C.creamHi,
            border: `3px solid ${C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />

        {/* Tiga siluet garis putus-putus benda mewah kosong tak terisi (mahkota, tas jinjing, mobil sport) */}
        <svg width={248} height={112} viewBox="0 0 248 112" style={{position: 'absolute', inset: 0}}>
          {/* 1. Mahkota putus-putus */}
          <g opacity={crownOp} transform="translate(24, 34)">
            <polygon
              points="4,36 4,12 16,24 27,8 38,24 50,12 50,36"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={2.2}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
          </g>

          {/* 2. Tas jinjing mewah putus-putus */}
          <g opacity={bagOp} transform="translate(96, 30)">
            <path
              d="M16 16 C16 6, 34 6, 34 16"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={2.2}
              strokeDasharray="4 3"
            />
            <polygon
              points="10,16 40,16 44,44 6,44"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={2.2}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
          </g>

          {/* 3. Mobil sport putus-putus */}
          <g opacity={carOp} transform="translate(154, 36)">
            <path
              d="M4 28 L10 28 L20 14 L46 14 L58 24 L68 26 L68 32 L4 32 Z"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={2.2}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
            <circle cx={18} cy={33} r={6} fill={C.creamHi} stroke={C.inkSoft} strokeWidth={2} strokeDasharray="3 2" />
            <circle cx={54} cy={33} r={6} fill={C.creamHi} stroke={C.inkSoft} strokeWidth={2} strokeDasharray="3 2" />
          </g>
        </svg>
      </Paper>
    </div>
  );
};

interface ShelfItemSpec {
  id: string;
  x: number;
  arriveAt: number;
  coinStart: number;
  coinEnd: number;
  coinCount: number;
  warmGlow?: boolean;
}

const SHELF_Y = 382;

const SHELF_ITEMS: readonly ShelfItemSpec[] = [
  {id: 'cicilan', x: 685, arriveAt: 344, coinStart: 346, coinEnd: 363, coinCount: 2},
  {id: 'sekolah', x: 810, arriveAt: 380, coinStart: 382, coinEnd: 402, coinCount: 2},
  {id: 'listrik', x: 930, arriveAt: 426, coinStart: 427, coinEnd: 438, coinCount: 2},
  {id: 'bensin', x: 1045, arriveAt: 465, coinStart: 467, coinEnd: 482, coinCount: 2},
  {id: 'ortu', x: 1170, arriveAt: 495, coinStart: 498, coinEnd: 528, coinCount: 3, warmGlow: true},
];

const ShelfPropGraphic: React.FC<{id: string}> = ({id}) => {
  if (id === 'cicilan') {
    // 1. Rumah mungil (cicilan)
    return (
      <div style={{position: 'relative', width: 78, height: 76}}>
        <Paper lift={5}>
          {/* Cerobong */}
          <Slab x={52} y={8} w={10} h={20} color={C.woodLo} r={2} />
          {/* Badan rumah */}
          <Slab x={12} y={32} w={54} h={44} color={C.creamHi} shade={C.creamLo} shadeH={0.18} r={3} />
          {/* Atap terakota */}
          <svg width={78} height={40} viewBox="0 0 78 40" style={{position: 'absolute', left: 0, top: 4}}>
            <polygon points="4,32 39,4 74,32" fill={C.tag} />
            <polygon points="39,4 74,32 66,32 39,10" fill="#9E3F29" />
          </svg>
          {/* Pintu & jendela hangat tanpa angka */}
          <Slab x={22} y={48} w={14} h={28} color={C.wood} r="3px 3px 0 0" />
          <Slab x={43} y={44} w={14} h={14} color={C.sparkYellow} r={2} />
        </Paper>
      </div>
    );
  }

  if (id === 'sekolah') {
    // 2. Tas sekolah dan pensil
    return (
      <div style={{position: 'relative', width: 78, height: 76}}>
        <Paper lift={5}>
          {/* Pensil kertas miring di belakang kanan */}
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 6,
              width: 12,
              height: 64,
              transform: 'rotate(14deg)',
            }}
          >
            <Slab x={0} y={12} w={12} h={44} color={C.sparkYellow} shade={C.brass} shadeH={0.25} r={2} />
            <Slab x={0} y={56} w={12} h={8} color={C.hero} r="0 0 3px 3px" />
            <svg width={12} height={14} viewBox="0 0 12 14" style={{position: 'absolute', left: 0, top: 0}}>
              <polygon points="6,0 12,12 0,12" fill={C.cream} />
              <polygon points="6,0 8,4 4,4" fill={C.inkSoft} />
            </svg>
          </div>
          {/* Tas ransel sekolah */}
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 12,
              width: 18,
              height: 10,
              borderRadius: '8px 8px 0 0',
              border: `3px solid ${C.capLo}`,
              borderBottom: 'none',
            }}
          />
          <Slab x={10} y={20} w={42} h={56} color={C.cap} shade={C.capLo} shadeH={0.2} r="14px 14px 6px 6px" />
          <Slab x={10} y={20} w={42} h={22} color="#4A7BC2" shade={C.capLo} shadeH={0.22} r="14px 14px 8px 8px" />
          <Slab x={16} y={48} w={30} h={20} color="#4A7BC2" r={4} />
          <Slab x={28} y={37} w={6} h={8} color={C.brass} r={2} />
        </Paper>
      </div>
    );
  }

  if (id === 'listrik') {
    // 3. Bohlam yang menyala
    return (
      <div style={{position: 'relative', width: 74, height: 80}}>
        {/* Pendar cahaya kuning lembut */}
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: -2,
            width: 82,
            height: 82,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,197,66,0.45) 0%, rgba(245,197,66,0) 72%)',
          }}
        />
        <Paper lift={5}>
          {/* Dudukan kuningan */}
          <Slab x={25} y={54} w={24} h={16} color={C.brass} shade={C.brassLo} shadeH={0.3} r={3} />
          <Slab x={28} y={70} w={18} h={6} color={C.inkSoft} r={3} />
          {/* Kaca bohlam menyala */}
          <div
            style={{
              position: 'absolute',
              left: 15,
              top: 12,
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: C.sparkYellow,
              boxShadow: 'inset -6px -6px 0 rgba(243,165,59,0.55)',
            }}
          />
          {/* Sinar kertas kecil di sekeliling bohlam */}
          {[
            [37, 2, 0],
            [64, 16, 48],
            [10, 16, -48],
          ].map(([rx, ry, rot], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: rx - 2,
                top: ry,
                width: 4,
                height: 9,
                borderRadius: 2,
                backgroundColor: C.sparkYellow,
                transform: `rotate(${rot}deg)`,
              }}
            />
          ))}
        </Paper>
      </div>
    );
  }

  if (id === 'bensin') {
    // 4. Jerigen bensin kertas polos (tanpa teks/angka)
    return (
      <div style={{position: 'relative', width: 72, height: 76}}>
        <Paper lift={5}>
          {/* Corong tuang */}
          <Slab x={16} y={10} w={10} h={12} color={C.inkSoft} r={2} rot={-22} />
          {/* Gagang atas */}
          <Slab x={30} y={10} w={24} h={8} color="#A63224" r={3} />
          {/* Badan jerigen terakota-merah */}
          <Slab x={14} y={18} w={46} h={58} color={C.nogo} shade="#9E271C" shadeH={0.2} r={8} />
          {/* Relief silang kertas */}
          <svg width={46} height={58} viewBox="0 0 46 58" style={{position: 'absolute', left: 14, top: 18}}>
            <line x1={12} y1={16} x2={34} y2={42} stroke="#A62B1F" strokeWidth={3.5} strokeLinecap="round" />
            <line x1={34} y1={16} x2={12} y2={42} stroke="#A62B1F" strokeWidth={3.5} strokeLinecap="round" />
          </svg>
        </Paper>
      </div>
    );
  }

  // 5. Rumah kampung kecil dengan siluet orang tua melambai (paling besar & hangat)
  return (
    <div style={{position: 'relative', width: 112, height: 96}}>
      {/* Cahaya keemasan hangat di sekeliling rumah kampung */}
      <div
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: 28,
          background: 'radial-gradient(circle, rgba(245,197,66,0.34) 0%, rgba(245,197,66,0) 74%)',
        }}
      />
      <Paper lift={6}>
        {/* Badan rumah kampung kayu hangat */}
        <Slab x={12} y={38} w={88} h={52} color="#E6C697" shade="#C5A16F" shadeH={0.2} r={4} />
        {/* Teras papan bawah */}
        <Slab x={6} y={88} w={100} h={8} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
        {/* Atap limasan kampung */}
        <svg width={112} height={44} viewBox="0 0 112 44" style={{position: 'absolute', left: 0, top: 2}}>
          <polygon points="4,38 26,10 86,10 108,38" fill={C.woodHi} />
          <polygon points="26,10 86,10 108,38 76,38" fill={C.wood} />
        </svg>
        {/* Ambang cahaya hangat di teras */}
        <Slab x={22} y={48} w={30} h={40} color="#FFE599" r="4px 4px 0 0" />
        {/* Dua siluet orang tua di kampung (tanpa wajah, sedikit membungkuk, satu melambai) */}
        {/* Orang tua 1 */}
        <div style={{position: 'absolute', left: 60, top: 53, width: 14, height: 14, borderRadius: '50%', backgroundColor: C.creamLo, border: `1.5px solid ${C.inkSoft}`}} />
        <Slab x={59} y={67} w={16} h={21} color={ROOM.sage} r="6px 6px 2px 2px" rot={5} />
        {/* Orang tua 2 dengan tangan melambai */}
        <div style={{position: 'absolute', left: 78, top: 55, width: 13, height: 13, borderRadius: '50%', backgroundColor: C.creamLo, border: `1.5px solid ${C.inkSoft}`}} />
        <Slab x={77} y={68} w={15} h={20} color={C.heroLo} r="6px 6px 2px 2px" rot={-4} />
        <Slab x={90} y={56} w={5} h={16} color={C.heroLo} r={3} rot={28} />
      </Paper>
    </div>
  );
};

const WallShelfAndItems: React.FC<{f: number}> = ({f}) => {
  // Garis lintasan melengkung koin hantu menggambar dirinya mulai Beat 5 (frame 294)
  const arcProgress = interpolate(f, [294, 344], [0, 1], {...clamp, easing: easeOut});
  const dashOffset = Math.round((1 - arcProgress) * 520);

  return (
    <>
      {/* Rak panjang di dinding kanan */}
      <div style={{position: 'absolute', left: 625, top: SHELF_Y, width: 615, height: 34}}>
        <Paper lift={5}>
          <Slab x={0} y={0} w={615} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
          {[55, 235, 415, 560].map((bx, i) => (
            <Slab key={i} x={bx} y={16} w={14} h={18} color={C.woodLo} r="0 0 4px 4px" />
          ))}
        </Paper>
      </div>

      {/* Jalur garis putus-putus melengkung dari mulut toples ke rak */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <path
          d="M 275 322 Q 465 150 675 268"
          fill="none"
          stroke="#F5D376"
          strokeWidth={2.6}
          strokeDasharray="8 7"
          strokeDashoffset={dashOffset}
          opacity={arcProgress > 0.01 ? 0.72 : 0}
        />
      </svg>

      {/* Koin hantu yang naik dari toples di Beat 5 dan melayang di jalur lengkung */}
      {[
        {t0: 290, uEnd: 0.24},
        {t0: 297, uEnd: 0.44},
        {t0: 304, uEnd: 0.64},
        {t0: 311, uEnd: 0.82},
        {t0: 318, uEnd: 0.98},
      ].map((c, idx) => {
        const rise = interpolate(f, [c.t0, c.t0 + 26], [0, c.uEnd], {...clamp, easing: easeOut});
        if (rise <= 0.01) return null;
        const [gx, gy] = quadBezier(rise, [275, 322], [465, 150], [675, 268]);
        const floatY = bob(f, 54, 4, idx * 1.1);
        return (
          <GhostCoin
            key={idx}
            x={gx}
            y={gy + floatY}
            r={14}
            opacity={0.86}
            rot={Math.sin((f + idx * 12) / 24) * 8}
          />
        );
      })}

      {/* Lima benda di rak + koin hantu yang terbang mendarat & menumpuk di tiap benda */}
      {SHELF_ITEMS.map((item, idx) => {
        const arrive = interpolate(f, [item.arriveAt, item.arriveAt + 12], [0, 1], {
          ...clamp,
          easing: easeOut,
        });
        const scale = interpolate(arrive, [0, 1], [0.72, 1], clamp);
        const dropY = interpolate(arrive, [0, 1], [-18, 0], clamp);
        const propH = item.id === 'ortu' ? 96 : item.id === 'listrik' ? 80 : 76;

        return (
          <React.Fragment key={item.id}>
            {/* Benda di atas rak */}
            {arrive > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: SHELF_Y + dropY,
                  translate: '-50% -100%',
                  opacity: arrive,
                  transform: `scale(${scale})`,
                  transformOrigin: '50% 100%',
                }}
              >
                <div style={{marginBottom: propH - propH}}>
                  <ShelfPropGraphic id={item.id} />
                </div>
              </div>
            ) : null}

            {/* Koin hantu terbang mendarat dan menumpuk kecil di samping tiap benda */}
            {Array.from({length: item.coinCount}).map((_, cIdx) => {
              const stagger = cIdx * 5;
              const fly = interpolate(
                f,
                [item.coinStart + stagger, item.coinEnd + stagger],
                [0, 1],
                {...clamp, easing: easeInOut},
              );
              if (fly <= 0.01) return null;

              const startPt: [number, number] = [665, 265];
              const ctrlPt: [number, number] = [(665 + item.x) / 2, 185 - idx * 8];
              const landPt: [number, number] = [item.x + 34, SHELF_Y - 8 - cIdx * 9];
              const [cx, cy] = quadBezier(fly, startPt, ctrlPt, landPt);

              return (
                <GhostCoin
                  key={cIdx}
                  x={cx}
                  y={cy}
                  r={11}
                  opacity={0.9}
                  rot={(1 - fly) * 18}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

const CurtainWipe: React.FC<{f: number}> = ({f}) => {
  // Sapuan tirai kertas lembut melintas pada jeda seminggu (frame 44-64)
  const wipeX = interpolate(f, [44, 54, 64], [-1340, 0, 1340], {...clamp, easing: easeInOut});
  if (f < 43 || f > 65) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: wipeX,
        top: 0,
        width: 1280,
        height: 720,
        pointerEvents: 'none',
        filter: 'drop-shadow(10px 0 18px rgba(0,0,0,0.36)) drop-shadow(-10px 0 18px rgba(0,0,0,0.36))',
      }}
    >
      {/* Lipatan-lipatan vertikal tirai kertas hangat */}
      {Array.from({length: 16}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i * 80,
            top: 0,
            width: 82,
            height: 720,
            background:
              i % 2 === 0
                ? 'linear-gradient(90deg, #B58742 0%, #CFA259 55%, #A67936 100%)'
                : 'linear-gradient(90deg, #C79A52 0%, #DDB268 50%, #B38540 100%)',
          }}
        />
      ))}
    </div>
  );
};

export const P02: React.FC = () => {
  const f = useCurrentFrame();

  // Koreografi kamera 10 beat:
  // 0-47: makro sangat dekat pada mulut toples lalu mulai mundur
  // 62-115: mendekat ke toples 1/4 isi
  // 143-269: bidikan sedang pada tokoh & gelembung pikiran
  // 290-505: pan ke kanan mengikuti jalur koin hantu & lima benda di rak
  // 505-555: mundur ke bidikan lebar utuh dan ditahan hingga 567
  const camFrames = [
    0, 28, 47, 62, 115, 143, 184, 198, 269, 290, 324, 352, 390, 432, 472, 505, 554, 567,
  ] as const;

  const focusX = sampleTrack(f, camFrames, [
    275, 275, 330, 365, 325, 415, 435, 460, 460, 430, 560, 685, 810, 930, 1045, 1105, 640, 640,
  ]);
  const focusY = sampleTrack(f, camFrames, [
    362, 384, 390, 395, 415, 415, 405, 355, 355, 360, 350, 345, 345, 345, 345, 345, 360, 360,
  ]);
  const zoom = sampleTrack(f, camFrames, [
    2.42, 2.34, 1.72, 1.24, 1.5, 1.4, 1.38, 1.34, 1.34, 1.28, 1.32, 1.44, 1.44, 1.44, 1.44, 1.36, 1.0, 1.0,
  ]);

  const layerTransform = (depth: number) => {
    const z = 1 + (zoom - 1) * depth;
    const fx = 640 + (focusX - 640) * depth;
    const fy = 360 + (focusY - 360) * depth;
    return {
      transformOrigin: '0 0',
      transform: `translate(${(640 - fx * z).toFixed(2)}px, ${(360 - fy * z).toFixed(2)}px) scale(${z.toFixed(4)})`,
    } as const;
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#2B241E', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <Boil seed="p02-stage" amp={0.4} rot={0.05}>
          {/* LAPISAN 1 (LATAR BELAKANG): Dinding dapur malam, jendela, dan kabinet kompor */}
          <AbsoluteFill style={layerTransform(0.76)}>
            <Slab x={-320} y={-200} w={1960} h={1120} color="#D8C8B4" r={0} grain={0.55} />
            {/* Panel wainscoting kertas di dinding bawah */}
            <Slab x={-320} y={395} w={1960} h={220} color="#C7B59F" r={0} grain={0.5} />
            <div
              style={{
                position: 'absolute',
                left: -320,
                top: 393,
                width: 1960,
                height: 6,
                backgroundColor: C.woodLo,
                opacity: 0.65,
              }}
            />
            {/* Suasana dapur malam hangat dengan vinyet lembut */}
            <div
              style={{
                position: 'absolute',
                left: -320,
                top: -200,
                width: 1960,
                height: 1120,
                background:
                  'radial-gradient(ellipse at 34% 40%, rgba(255,224,150,0.14) 0%, rgba(24,20,28,0.44) 100%)',
              }}
            />
            <KitchenWindow f={f} />
            <KitchenBackCounter f={f} />
          </AbsoluteFill>

          {/* LAPISAN 2 (LATAR MENENGAH): Lampu gantung kertas kuning */}
          <AbsoluteFill style={layerTransform(0.9)}>
            <HangingLamp f={f} />
          </AbsoluteFill>

          {/* LAPISAN 3 (PANGGUNG UTAMA): Lantai, meja makan, toples koin, keranjang, tokoh "kamu", dan rak 5 benda */}
          <AbsoluteFill style={layerTransform(1.0)}>
            {/* Lantai kayu teater kertas */}
            <Slab x={-320} y={600} w={1960} h={320} color={C.floor} r={0} grain={0.6} />
            <div style={{position: 'absolute', left: -320, top: 638, width: 1960, height: 3, background: C.floorLo, opacity: 0.8}} />
            <div style={{position: 'absolute', left: -320, top: 678, width: 1960, height: 3, background: C.floorLo, opacity: 0.8}} />
            <Slab x={-320} y={576} w={1960} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

            {/* Rak dinding panjang, jalur koin hantu, dan lima benda */}
            <WallShelfAndItems f={f} />

            {/* Meja makan panjang di sisi kiri */}
            <div style={{position: 'absolute', left: 88, top: 492, width: 324, height: 108}}>
              <Paper lift={5}>
                {/* Kaki meja */}
                <Slab x={26} y={14} w={18} h={94} color={C.woodLo} r={3} />
                <Slab x={280} y={14} w={18} h={94} color={C.woodLo} r={3} />
                {/* Daun meja kayu berlapis */}
                <Slab x={0} y={0} w={324} h={18} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={5} />
              </Paper>
            </div>

            {/* Keranjang barang biasa (sayur, sabun polos) di meja */}
            <SimpleBasket x={162} y={492} />

            {/* Toples kaca tinggi berisi koin polos ("saldo") */}
            <CoinJar x={275} bottomY={492} f={f} />

            {/* Amplop polos menuang koin di Beat 1 */}
            <SalaryEnvelopePour jarX={275} mouthY={328} f={f} />

            {/* Tokoh utama "kamu" tanpa wajah */}
            <MainCharacterKamu x={470} y={600} f={f} />

            {/* Gelembung pikiran kertas kosong berisi siluet mewah putus-putus di Beat 4 */}
            <LuxuryThoughtBubble x={470} y={322} f={f} />
          </AbsoluteFill>

          {/* LAPISAN 4 (LATAR DEPAN): Bingkai panggung kertas & sapuan tirai minggu */}
          <AbsoluteFill style={layerTransform(1.14)}>
            <Slab x={-320} y={-200} w={324} h={1120} color="#261B14" r={0} />
            <Slab x={1276} y={-200} w={364} h={1120} color="#261B14" r={0} />
          </AbsoluteFill>
        </Boil>

        {/* Sapuan tirai kertas transisi Beat 1 -> Beat 2 */}
        <CurtainWipe f={f} />

        {/* Vinyet hangat lembut seluruh layar */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 46%, rgba(255,244,214,0.04) 0%, rgba(0,0,0,0) 56%, rgba(18,12,8,0.34) 100%)',
            pointerEvents: 'none',
          }}
        />
        <FeltFibre opacity={0.16} />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};