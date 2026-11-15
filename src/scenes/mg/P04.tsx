// QA Clover: Easing.sine -> Easing.sin (Remotion tidak punya Easing.sine; sin adalah easing sinus yang sama).
// Adegan P04 "JUTAAN JENDELA" (scene 23-26, 448 frame): fasad apartemen senja dengan riak cahaya jendela tanpa angka,
// diikuti tilt turun ke cincin jalan melingkar tempat tokoh utama berjalan satu putaran penuh dan kembali ke titik awal.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const P04_DUR = 448;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type WindowSpec = {
  id: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  tone: string;
  curtain: string;
  isHero?: boolean;
  isUpstairs?: boolean;
  hasBalcony?: boolean;
  hasPlant?: boolean;
  poseSeed: number;
};

const HERO_CX = 640;
const HERO_CY = 472;

const buildWindows = (): WindowSpec[] => {
  const list: WindowSpec[] = [];
  const tones = ['#F5C542', '#F3A53B', '#F7D266', '#EEB446'];
  const curtains = [C.cream, C.tape, C.sage, C.creamLo];

  // Gedung utama tengah (6 lantai x 4 kolom, x: 425..855, y: 145..740)
  const mainCols = [482, 588, 692, 798];
  const mainRows = [212, 342, 472, 602, 712];
  mainRows.forEach((cy, rIdx) => {
    mainCols.forEach((cx, cIdx) => {
      const isHero = rIdx === 2 && cIdx === 1;
      const isUpstairs = rIdx === 1 && cIdx === 1;
      list.push({
        id: `main-${rIdx}-${cIdx}`,
        cx: isHero ? HERO_CX : isUpstairs ? HERO_CX : cx,
        cy: isHero ? HERO_CY : isUpstairs ? 342 : cy,
        w: isHero || isUpstairs ? 76 : 68,
        h: isHero || isUpstairs ? 86 : 78,
        tone: isHero ? '#F8CE5C' : tones[(rIdx * 3 + cIdx) % tones.length],
        curtain: curtains[(rIdx + cIdx) % curtains.length],
        isHero,
        isUpstairs,
        hasBalcony: rIdx < 4 && (rIdx + cIdx) % 2 === 0 && !isHero,
        hasPlant: (rIdx + cIdx) % 3 === 1 && !isHero,
        poseSeed: rIdx * 7 + cIdx * 13,
      });
    });
  });

  // Gedung kiri (5 lantai x 3 kolom, x: 85..385)
  const leftCols = [142, 236, 330];
  const leftRows = [248, 372, 496, 620, 722];
  leftRows.forEach((cy, rIdx) => {
    leftCols.forEach((cx, cIdx) => {
      list.push({
        id: `left-${rIdx}-${cIdx}`,
        cx,
        cy,
        w: 62,
        h: 74,
        tone: tones[(rIdx + cIdx * 2) % tones.length],
        curtain: curtains[(rIdx * 2 + cIdx) % curtains.length],
        hasBalcony: rIdx < 4 && cIdx === 1,
        hasPlant: rIdx % 2 === 1 && cIdx === 1,
        poseSeed: 40 + rIdx * 5 + cIdx * 11,
      });
    });
  });

  // Gedung kanan (5 lantai x 3 kolom, x: 895..1195)
  const rightCols = [950, 1044, 1138];
  const rightRows = [228, 354, 480, 606, 718];
  rightRows.forEach((cy, rIdx) => {
    rightCols.forEach((cx, cIdx) => {
      list.push({
        id: `right-${rIdx}-${cIdx}`,
        cx,
        cy,
        w: 62,
        h: 74,
        tone: tones[(rIdx * 2 + cIdx + 1) % tones.length],
        curtain: curtains[(rIdx + cIdx + 2) % curtains.length],
        hasBalcony: rIdx < 4 && cIdx === 1,
        hasPlant: rIdx % 2 === 0 && cIdx === 1,
        poseSeed: 80 + rIdx * 9 + cIdx * 7,
      });
    });
  });

  // Gedung pinggir luar kiri & kanan (tampak saat pull-out lebar)
  const farCols = [-78, 8, 1272, 1358];
  const farRows = [295, 425, 555, 685];
  farRows.forEach((cy, rIdx) => {
    farCols.forEach((cx, cIdx) => {
      list.push({
        id: `far-${rIdx}-${cIdx}`,
        cx,
        cy,
        w: 54,
        h: 68,
        tone: tones[(rIdx + cIdx) % tones.length],
        curtain: curtains[(rIdx + cIdx + 1) % curtains.length],
        poseSeed: 120 + rIdx * 6 + cIdx * 17,
      });
    });
  });

  return list;
};

const WINDOWS = buildWindows();

// Siluet tokoh utama "kamu": tanpa wajah, kemeja biru sabak, syal kertas terakota hangat, dan tas kantor
const HeroWalker: React.FC<{
  x: number;
  y: number;
  s?: number;
  facing: 1 | -1;
  walking: boolean;
}> = ({x, y, s = 1, facing, walking}) => {
  const f = useCurrentFrame();
  const glideBob = walking ? bob(f, 22, 1.8, 0) : bob(f, 54, 0.7, 0);
  const scarfSway = walking ? bob(f, 26, 4.5, 0.4) : bob(f, 60, 1.5, 0.4);
  const bagSway = walking ? bob(f, 24, 3, 1.2) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + glideBob,
        width: 76 * s,
        height: 158 * s,
        translate: '-50% -100%',
        transform: `scaleX(${facing})`,
        filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.45))',
      }}
    >
      {/* Kaki kertas bergeser halus seperti boneka di rel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 118 * s,
          width: 18 * s,
          height: 38 * s,
          translate: '-108% 0',
          background: C.inkSoft,
          borderRadius: 5 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 118 * s,
          width: 18 * s,
          height: 38 * s,
          translate: '8% 0',
          background: C.ink,
          borderRadius: 5 * s,
        }}
      />

      {/* Badan kemeja biru sabak */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 52 * s,
          width: 50 * s,
          height: 70 * s,
          translate: '-50% 0',
          background: ROOM.slate,
          borderRadius: 9 * s,
          border: `${1.5 * s}px solid #364758`,
        }}
      />

      {/* Syal kertas hangat terakota (penanda konsisten tokoh utama) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 48 * s,
          width: 44 * s,
          height: 14 * s,
          translate: '-50% 0',
          background: C.hero,
          borderRadius: 7 * s,
          border: `${1.5 * s}px solid ${C.heroLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 56 * s,
          width: 13 * s,
          height: 32 * s,
          translate: '-135% 0',
          background: C.tag,
          borderRadius: 4 * s,
          transformOrigin: 'top center',
          transform: `rotate(${scarfSway}deg)`,
        }}
      />

      {/* Tas kantor kertas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 92 * s,
          width: 34 * s,
          height: 26 * s,
          translate: '14% 0',
          background: C.wood,
          borderRadius: 4 * s,
          border: `${1.5 * s}px solid ${C.woodLo}`,
          transformOrigin: 'top center',
          transform: `rotate(${bagSway}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -6 * s,
            width: 14 * s,
            height: 7 * s,
            translate: '-50% 0',
            border: `${2 * s}px solid ${C.woodLo}`,
            borderBottom: 'none',
            borderRadius: `${4 * s}px ${4 * s}px 0 0`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 9 * s,
            width: 6 * s,
            height: 5 * s,
            translate: '-50% 0',
            background: C.brass,
            borderRadius: 1 * s,
          }}
        />
      </div>

      {/* Kepala bulat kertas TANPA WAJAH */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 4 * s,
          width: 42 * s,
          height: 42 * s,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.creamLo,
          border: `${2.5 * s}px solid ${C.inkSoft}`,
        }}
      />
    </div>
  );
};

// Satu unit jendela apartemen berlapis kertas dengan siluet duduk tanpa wajah
const ApartmentWindow: React.FC<{
  win: WindowSpec;
  lit: number;
  lookUp: number;
}> = ({win, lit, lookUp}) => {
  const f = useCurrentFrame();
  const {cx, cy, w, h, tone, curtain, isHero, isUpstairs, hasBalcony, hasPlant, poseSeed} = win;
  const breath = bob(f, 52 + (poseSeed % 17), 1.1, poseSeed * 0.3);
  const headTilt = lookUp * -13;
  const headLift = lookUp * -2.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
      }}
    >
      {/* Bingkai luar kertas */}
      <div
        style={{
          position: 'absolute',
          inset: -5,
          background: C.creamLo,
          borderRadius: 3,
          boxShadow: '0 3px 5px rgba(0,0,0,0.35)',
        }}
      />
      {/* Kaca gelap dasar */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#182032',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Cahaya lampu hangat di dalam ruangan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: lit,
            background: `radial-gradient(circle at 50% 58%, ${tone} 0%, #D98A36 78%, #8F5226 100%)`,
          }}
        />

        {/* Meja kecil & cahaya layar/lampu polos tanpa isi */}
        <div
          style={{
            position: 'absolute',
            left: w * 0.14,
            right: w * 0.14,
            bottom: 0,
            height: h * 0.24,
            background: lit > 0.2 ? '#4D3222' : '#121826',
          }}
        />
        {lit > 0.15 ? (
          <div
            style={{
              position: 'absolute',
              left: w * 0.56,
              bottom: h * 0.24,
              width: w * 0.18,
              height: h * 0.14,
              borderRadius: '50% 50% 2px 2px',
              background: isHero ? '#DCEBFF' : '#FFF4D2',
              opacity: lit * 0.9,
              boxShadow: isHero
                ? '0 -4px 12px rgba(210,232,255,0.85)'
                : '0 -3px 10px rgba(255,235,175,0.8)',
            }}
          />
        ) : null}

        {/* Siluet penghuni tanpa wajah duduk di balik jendela */}
        <div
          style={{
            position: 'absolute',
            left: w * 0.36,
            bottom: h * 0.22 - breath * 0.4,
            width: w * 0.34,
            height: h * 0.52,
            translate: '-50% 0',
            opacity: 0.35 + lit * 0.65,
          }}
        >
          {/* Bahu/badan siluet */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              width: w * 0.3,
              height: h * 0.28,
              translate: '-50% 0',
              borderRadius: '8px 8px 0 0',
              background: isHero ? '#2E3F52' : '#232028',
            }}
          />
          {/* Aksen syal terakota halus pada tokoh utama di jendela */}
          {isHero ? (
            <div
              style={{
                position: 'absolute',
                left: '52%',
                bottom: h * 0.22,
                width: w * 0.24,
                height: 5,
                translate: '-50% 0',
                borderRadius: 3,
                background: C.hero,
              }}
            />
          ) : null}
          {/* Kepala bulat polos tanpa wajah */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: h * 0.29 - headLift,
              width: w * 0.22,
              height: w * 0.22,
              translate: '-50% 0',
              borderRadius: '50%',
              background: isHero ? '#3B3438' : '#232028',
              transform: `rotate(${headTilt}deg)`,
            }}
          />
        </div>

        {/* Tirai kertas di tepi kiri dan kanan jendela */}
        <div
          style={{
            position: 'absolute',
            left: -2,
            top: -2,
            width: w * 0.24,
            height: h + 4,
            background: curtain,
            borderRadius: '0 0 12px 0',
            opacity: 0.92,
            boxShadow: '2px 0 4px rgba(0,0,0,0.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -2,
            top: -2,
            width: w * 0.24,
            height: h + 4,
            background: curtain,
            borderRadius: '0 0 0 12px',
            opacity: 0.92,
            boxShadow: '-2px 0 4px rgba(0,0,0,0.25)',
          }}
        />

        {/* Palang jendela tipis */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 3,
            translate: '-50% 0',
            background: C.creamLo,
            opacity: 0.75,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '54%',
            left: 0,
            right: 0,
            height: 3,
            background: C.creamLo,
            opacity: 0.75,
          }}
        />
      </div>

      {/* Ambang bawah jendela */}
      <div
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          bottom: -8,
          height: 7,
          background: C.cream,
          borderRadius: 2,
          boxShadow: '0 3px 4px rgba(0,0,0,0.35)',
        }}
      />

      {/* Balkon & pot tanaman kertas (menunjukkan hunian layak / tidak miskin) */}
      {hasBalcony ? (
        <div
          style={{
            position: 'absolute',
            left: -12,
            right: -12,
            bottom: -14,
            height: 22,
            borderTop: `3px solid ${C.creamLo}`,
            borderLeft: `3px solid ${C.creamLo}`,
            borderRight: `3px solid ${C.creamLo}`,
            background:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 9px, rgba(191,178,162,0.55) 9px, rgba(191,178,162,0.55) 11px)',
          }}
        >
          {hasPlant ? (
            <div style={{position: 'absolute', right: 6, bottom: 2, width: 18, height: 22}}>
              <div
                style={{
                  position: 'absolute',
                  left: 3,
                  bottom: 0,
                  width: 12,
                  height: 10,
                  background: C.heroLo,
                  borderRadius: '2px 2px 4px 4px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 1,
                  bottom: 8,
                  width: 16,
                  height: 13,
                  borderRadius: '50%',
                  background: C.sageLo,
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Lingkaran sorot guntingan kertas halus pada jendela awal (beat 1) */}
      {isHero || isUpstairs ? null : null}
    </div>
  );
};

export const P04: React.FC = () => {
  const f = useCurrentFrame();

  // --- KOREOGRAFI KAMERA SATU AMBILAN BERKESINAMBUNGAN (tanpa potongan) ---
  // Beat 1 (0..74): bidikan dekat jendela tokoh -> tilt naik ke jendela tetangga di atas
  // Beat 2 (93..193): pull-out besar menyingkap seluruh fasad & gedung kiri-kanan
  // Beat 3 (207..297): bentang kota tertahan hangat sambil waspada
  // Beat 4 (318..448): tilt turun ke cincin jalan, tokoh berputar 1 lingkaran penuh, kamera naik sedikit & tahan pose akhir
  const camY =
    f < 74
      ? interpolate(f, [0, 74], [472, 368], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : f < 93
      ? interpolate(f, [74, 93], [368, 372], {...CLAMP, easing: Easing.inOut(Easing.sin)})
      : f < 193
      ? interpolate(f, [93, 193], [372, 434], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : f < 297
      ? interpolate(f, [193, 297], [434, 444], {...CLAMP, easing: Easing.inOut(Easing.sin)})
      : f < 346
      ? interpolate(f, [297, 346], [444, 882], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : interpolate(f, [346, 404, 436], [882, 882, 856], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const camScale =
    f < 74
      ? interpolate(f, [0, 74], [2.42, 2.12], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : f < 93
      ? interpolate(f, [74, 93], [2.12, 2.06], {...CLAMP, easing: Easing.inOut(Easing.sin)})
      : f < 193
      ? interpolate(f, [93, 193], [2.06, 0.90], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : f < 297
      ? interpolate(f, [193, 297], [0.90, 0.92], {...CLAMP, easing: Easing.inOut(Easing.sin)})
      : f < 346
      ? interpolate(f, [297, 346], [0.92, 1.07], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : interpolate(f, [346, 404, 436], [1.07, 1.07, 1.00], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const camX = 640;

  // Helper paralaks kedalaman antar-lapisan teater kertas
  const layerTransform = (z: number) => {
    const effScale = 1 + (camScale - 1) * (0.42 + 0.58 * z);
    const effX = 640 + (camX - 640) * z;
    const effY = 472 + (camY - 472) * z;
    const tx = 640 - effX * effScale;
    const ty = 360 - effY * effScale;
    return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${effScale.toFixed(4)})`;
  };

  // --- PERGESERAN CAHAYA LANGIT (senja -> malam -> siklus malam-pagi-malam di beat 4) ---
  const duskToNight = interpolate(f, [0, 210], [0, 1], CLAMP);
  const walkU = interpolate(f, [320, 434], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const monthMorningGlow = Math.sin(walkU * Math.PI);

  // --- AWAN KERTAS & BAYANGAN MENYAPU FASAD (beat 3: 207..297) ---
  const cloudDrift = interpolate(f, [0, 448], [-90, 240], CLAMP);
  const shadowSweepX = interpolate(f, [205, 298], [-540, 1480], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const shadowOpacity = interpolate(f, [205, 224, 280, 298], [0, 0.36, 0.36, 0], CLAMP);
  const lookUp = interpolate(f, [216, 236, 280, 296], [0, 1, 1, 0], {...CLAMP, easing: Easing.inOut(Easing.sin)});

  // --- LINGKARAN SOROT KERTAS DI JENDELA AWAL (beat 1) ---
  const spotOpacity = interpolate(f, [4, 18, 93, 114], [0, 0.85, 0.85, 0], CLAMP);

  // --- POSISI TOKOH UTAMA DI CINCIN JALAN MELINGKAR (beat 4) ---
  const RING_CX = 640;
  const RING_CY = 925;
  const RING_RX = 320;
  const RING_RY = 112;
  const theta = Math.PI + walkU * Math.PI * 2;
  const heroX = RING_CX + RING_RX * Math.cos(theta);
  const heroY = RING_CY + RING_RY * Math.sin(theta);
  const isHeroBehindIsland = Math.sin(theta) < -0.02;
  const heroFacing: 1 | -1 = Math.sin(theta) <= 0.02 ? 1 : -1;
  const heroWalking = f >= 320 && f < 434;

  // Panah kertas melengkung di cincin jalan (muncul lembut saat kamera turun ke jalan)
  const ringArrowOpacity = interpolate(f, [332, 350], [0, 0.85], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: '#172034', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 0 (LATAR JAUH): Langit senja menuju malam, bulan sabit kertas, dan awan kertas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 1180,
            transformOrigin: '0 0',
            transform: layerTransform(0.32),
          }}
        >
          {/* Langit dasar */}
          <div
            style={{
              position: 'absolute',
              left: -320,
              top: -220,
              width: 1920,
              height: 1450,
              background:
                'linear-gradient(180deg, #161F33 0%, #243352 46%, #45516E 74%, #7A5448 100%)',
            }}
          />
          {/* Gelap malam yang masuk perlahan dari beat 1 ke beat 3 */}
          <div
            style={{
              position: 'absolute',
              left: -320,
              top: -220,
              width: 1920,
              height: 1450,
              opacity: duskToNight * 0.72,
              background: 'linear-gradient(180deg, #0E1422 0%, #172238 58%, #26314A 100%)',
            }}
          />
          {/* Cahaya pagi lembut di tengah siklus 1 putaran = 1 bulan (beat 4) */}
          <div
            style={{
              position: 'absolute',
              left: -320,
              top: -220,
              width: 1920,
              height: 1450,
              opacity: monthMorningGlow * 0.78,
              background:
                'linear-gradient(180deg, #3D5B82 0%, #7B9BB8 48%, #E4B272 86%, #D68A54 100%)',
            }}
          />

          {/* Bintang-bintang titik kertas */}
          {[
            [180, 95],
            [310, 62],
            [470, 108],
            [790, 74],
            [940, 112],
            [1110, 68],
            [1220, 124],
            [85, 145],
          ].map(([sx, sy], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sx,
                top: sy,
                width: i % 2 === 0 ? 5 : 4,
                height: i % 2 === 0 ? 5 : 4,
                borderRadius: '50%',
                background: C.creamHi,
                opacity: (0.35 + duskToNight * 0.55) * (1 - monthMorningGlow * 0.8),
              }}
            />
          ))}

          {/* Bulan sabit kertas */}
          <div
            style={{
              position: 'absolute',
              left: 1030,
              top: 72,
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#F5DF9E',
              opacity: 1 - monthMorningGlow * 0.75,
              boxShadow: '0 0 24px rgba(245,223,158,0.45)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: -6,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#192338',
              }}
            />
          </div>

          {/* Awan-awan kertas tipis berlapis yang melintas pelan di belakang gedung */}
          <div style={{position: 'absolute', left: cloudDrift, top: 0}}>
            {[
              {x: -60, y: 120, w: 320, h: 46, op: 0.42},
              {x: 340, y: 84, w: 380, h: 52, op: 0.36},
              {x: 780, y: 138, w: 340, h: 44, op: 0.4},
              {x: 1120, y: 92, w: 300, h: 48, op: 0.34},
            ].map((cl, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: cl.x,
                  top: cl.y,
                  width: cl.w,
                  height: cl.h,
                  borderRadius: 40,
                  background: '#485A7A',
                  opacity: cl.op,
                  filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.22))',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: cl.w * 0.18,
                    top: -16,
                    width: cl.w * 0.42,
                    height: 36,
                    borderRadius: 30,
                    background: '#54688A',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* LAPISAN 1 (TENGAH JAUH): Siluet cakrawala gedung kota berlapis kertas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 1180,
            transformOrigin: '0 0',
            transform: layerTransform(0.58),
          }}
        >
          {[
            {x: -180, y: 270, w: 220, h: 560, c: '#23304A'},
            {x: 20, y: 220, w: 240, h: 610, c: '#1D283E'},
            {x: 240, y: 290, w: 210, h: 540, c: '#283652'},
            {x: 430, y: 190, w: 200, h: 640, c: '#1B253A'},
            {x: 610, y: 245, w: 230, h: 585, c: '#24324C'},
            {x: 820, y: 205, w: 210, h: 625, c: '#1E2940'},
            {x: 1010, y: 265, w: 240, h: 565, c: '#273550'},
            {x: 1230, y: 230, w: 230, h: 600, c: '#1C263B'},
          ].map((b, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                background: b.c,
                borderTop: '3px solid #35476B',
                boxShadow: '0 -4px 12px rgba(0,0,0,0.35)',
              }}
            />
          ))}
        </div>

        {/* LAPISAN 2 (BIDANG FOKUS UTAMA): Fasad gedung apartemen & jalan cincin melingkar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 1180,
            transformOrigin: '0 0',
            transform: layerTransform(1.0),
          }}
        >
          {/* --- GEDUNG-GEDUNG APARTEMEN POTONGAN KERTAS --- */}
          <Paper lift={6}>
            {/* Gedung pinggir jauh kiri */}
            <Slab x={-140} y={230} w={210} h={555} color="#3D4E63" shade="#2C394A" shadeH={0.12} r={4} />
            {/* Gedung pinggir jauh kanan */}
            <Slab x={1210} y={230} w={210} h={555} color="#3D4E63" shade="#2C394A" shadeH={0.12} r={4} />

            {/* Gedung apartemen kiri */}
            <Slab
              x={82}
              y={182}
              w={308}
              h={602}
              color="#7D6E57"
              shade="#5E5240"
              shadeH={0.1}
              hi="#96856B"
              hiH={0.04}
              r={4}
            />
            <Slab x={74} y={172} w={324} h={16} color={C.creamLo} r={3} />

            {/* Gedung apartemen kanan */}
            <Slab
              x={890}
              y={162}
              w={308}
              h={622}
              color="#4D6176"
              shade="#384859"
              shadeH={0.1}
              hi="#627991"
              hiH={0.04}
              r={4}
            />
            <Slab x={882} y={152} w={324} h={16} color={C.creamLo} r={3} />

            {/* Gedung apartemen utama tengah (terakota hangat) */}
            <Slab
              x={412}
              y={132}
              w={456}
              h={652}
              color={ROOM.terracotta}
              shade="#6E3E2C"
              shadeH={0.1}
              hi="#B26D53"
              hiH={0.04}
              r={5}
            />
            {/* Lis atap & tangki air kertas polos */}
            <Slab x={402} y={120} w={476} h={18} color={C.cream} r={3} />
            <Slab x={560} y={84} w={68} h={38} color={C.metalLo} shade="#6D7679" shadeH={0.25} r={4} />
            <Slab x={554} y={78} w={80} h={9} color={C.metal} r={3} />
          </Paper>

          {/* Tali jemuran kertas polos di atap gedung utama */}
          <svg
            width={1280}
            height={200}
            viewBox="0 0 1280 200"
            style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
          >
            <line x1={690} y1={84} x2={690} y2={122} stroke={C.inkSoft} strokeWidth={3} />
            <line x1={810} y1={84} x2={810} y2={122} stroke={C.inkSoft} strokeWidth={3} />
            <path d="M 690 92 Q 750 106 810 92" fill="none" stroke={C.creamLo} strokeWidth={2} />
            <rect x={718} y={97} width={16} height={18} rx={2} fill={C.cream} />
            <rect x={752} y={99} width={18} height={15} rx={2} fill={C.sage} />
          </svg>

          {/* Semua jendela apartemen yang menyala dalam riak menyebar */}
          {WINDOWS.map((win) => {
            let lit = 0;
            if (win.isHero) {
              lit = 1;
            } else if (win.isUpstairs) {
              lit = interpolate(f, [28, 44], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
            } else {
              const dist = Math.hypot(win.cx - HERO_CX, win.cy - HERO_CY);
              const startF = 94 + (dist / 780) * 76;
              lit = interpolate(f, [startF, startF + 14], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.cubic),
              });
            }
            return <ApartmentWindow key={win.id} win={win} lit={lit} lookUp={lookUp} />;
          })}

          {/* Lingkaran sorot guntingan kertas pada jendela awal di beat 1 */}
          {spotOpacity > 0.01 ? (
            <Boil seed="hero-spot" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: HERO_CX - 66,
                  top: HERO_CY - 70,
                  width: 132,
                  height: 140,
                  borderRadius: '50%',
                  border: `3.5px dashed ${C.sparkYellow}`,
                  opacity: spotOpacity,
                  boxShadow: '0 0 18px rgba(245,197,66,0.45)',
                  pointerEvents: 'none',
                }}
              />
            </Boil>
          ) : null}

          {/* Bayangan awan kertas tipis yang menyapu fasad pada beat 3 */}
          {shadowOpacity > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: shadowSweepX,
                top: 90,
                width: 460,
                height: 710,
                transform: 'skewX(-16deg)',
                background:
                  'linear-gradient(90deg, rgba(13,18,32,0) 0%, rgba(13,18,32,0.88) 38%, rgba(13,18,32,0.88) 62%, rgba(13,18,32,0) 100%)',
                opacity: shadowOpacity,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* --- JALAN DI DASAR GEDUNG & CINCIN JALAN MELINGKAR (BEAT 4) --- */}
          {/* Trotoar dasar gedung */}
          <Slab x={-200} y={764} w={1680} h={34} color={C.creamLo} shade="#9C9080" shadeH={0.35} r={0} />
          {/* Hamparan aspal kertas kota */}
          <Slab x={-200} y={796} w={1680} h={420} color="#262B35" r={0} grain={0.45} />
          <div
            style={{
              position: 'absolute',
              left: -200,
              top: 796,
              width: 1680,
              height: 28,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0))',
            }}
          />

          {/* Cincin jalan melingkar (rel) berbahan potongan kertas berlapis */}
          <svg
            width={1280}
            height={420}
            viewBox="0 760 1280 420"
            style={{position: 'absolute', left: 0, top: 760, overflow: 'visible'}}
          >
            {/* Bayangan jatuh cincin jalan */}
            <ellipse cx={RING_CX} cy={RING_CY + 10} rx={RING_RX + 36} ry={RING_RY + 22} fill="rgba(0,0,0,0.42)" />
            {/* Pinggiran trotoar luar cincin */}
            <ellipse cx={RING_CX} cy={RING_CY} rx={RING_RX + 34} ry={RING_RY + 20} fill={C.creamLo} />
            {/* Badan jalur melingkar */}
            <ellipse cx={RING_CX} cy={RING_CY} rx={RING_RX + 27} ry={RING_RY + 15} fill="#3B4250" />
            {/* Garis rel putus-putus tengah cincin */}
            <ellipse
              cx={RING_CX}
              cy={RING_CY}
              rx={RING_RX}
              ry={RING_RY}
              fill="none"
              stroke={C.cream}
              strokeWidth={3}
              strokeDasharray="16 14"
              opacity={0.78}
            />
            {/* Pinggiran trotoar dalam cincin */}
            <ellipse cx={RING_CX} cy={RING_CY} rx={RING_RX - 27} ry={RING_RY - 15} fill={C.creamLo} />
            {/* Pulau taman kertas di tengah cincin */}
            <ellipse cx={RING_CX} cy={RING_CY} rx={RING_RX - 33} ry={RING_RY - 19} fill={C.sageLo} />
            <ellipse cx={RING_CX} cy={RING_CY - 2} rx={RING_RX - 44} ry={RING_RY - 26} fill={C.sage} />

            {/* Panah kertas melengkung mengikuti cincin jalan (tanpa teks) */}
            <g opacity={ringArrowOpacity}>
              <path
                d="M 465 786 A 355 136 0 0 1 815 786"
                fill="none"
                stroke={C.sparkYellow}
                strokeWidth={3.5}
                strokeDasharray="12 8"
              />
              <polygon points="824,788 807,778 809,795" fill={C.sparkYellow} />

              <path
                d="M 815 1064 A 355 136 0 0 1 465 1064"
                fill="none"
                stroke={C.sparkYellow}
                strokeWidth={3.5}
                strokeDasharray="12 8"
              />
              <polygon points="456,1062 473,1072 471,1055" fill={C.sparkYellow} />
            </g>
          </svg>

          {/* Tokoh utama saat berjalan di sisi belakang cincin (di belakang pulau tengah) */}
          {isHeroBehindIsland ? (
            <HeroWalker x={heroX} y={heroY} s={0.72} facing={heroFacing} walking={heroWalking} />
          ) : null}

          {/* Semak & bangku kertas kecil di pulau tengah cincin */}
          <div
            style={{
              position: 'absolute',
              left: RING_CX - 110,
              top: RING_CY - 22,
              width: 48,
              height: 28,
              borderRadius: '50%',
              background: '#4E7A4A',
              boxShadow: '0 3px 4px rgba(0,0,0,0.28)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: RING_CX + 68,
              top: RING_CY - 16,
              width: 42,
              height: 24,
              borderRadius: '50%',
              background: '#3F6A3E',
              boxShadow: '0 3px 4px rgba(0,0,0,0.28)',
            }}
          />
          <Slab x={RING_CX - 28} y={RING_CY - 6} w={56} h={12} color={C.wood} shade={C.woodLo} shadeH={0.4} r={3} />

          {/* Titik awal di kiri cincin: TIANG BENDERA POLOS (tanpa teks/angka/simbol) */}
          <div style={{position: 'absolute', left: RING_CX - RING_RX - 36, top: RING_CY - 134}}>
            {/* Alas batu kertas */}
            <Slab x={-12} y={122} w={32} h={14} color={C.creamLo} shade="#8E8373" shadeH={0.4} r={4} />
            {/* Batang tiang */}
            <Slab x={1} y={4} w={6} h={122} color={C.creamHi} shade={C.creamLo} shadeH={0.2} r={3} />
            {/* Puncak bola polos */}
            <div
              style={{
                position: 'absolute',
                left: -2,
                top: -4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: C.brass,
              }}
            />
            {/* Bendera kertas terakota POLOS */}
            <Boil seed="flag-start" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 7,
                  top: 10,
                  width: 46,
                  height: 28,
                  background: C.hero,
                  clipPath: 'polygon(0% 0%, 100% 22%, 86% 50%, 100% 78%, 0% 100%)',
                  filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.35))',
                }}
              />
            </Boil>
          </div>

          {/* Penanda di kanan cincin: TIANG LAMPU JALAN HANGAT */}
          <div style={{position: 'absolute', left: RING_CX + RING_RX + 28, top: RING_CY - 144}}>
            {/* Kerucut cahaya lampu hangat */}
            <div
              style={{
                position: 'absolute',
                left: -68,
                top: 22,
                width: 144,
                height: 136,
                background:
                  'linear-gradient(180deg, rgba(255,224,138,0.34) 0%, rgba(255,224,138,0.02) 100%)',
                clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
              }}
            />
            <Slab x={-10} y={132} w={28} h={14} color={C.boardHi} r={4} />
            <Slab x={1} y={18} w={6} h={118} color={C.inkSoft} r={3} />
            <div
              style={{
                position: 'absolute',
                left: -10,
                top: 4,
                width: 28,
                height: 18,
                borderRadius: '12px 12px 4px 4px',
                background: C.sparkYellow,
                boxShadow: '0 0 18px rgba(245,197,66,0.85)',
              }}
            />
          </div>

          {/* Tokoh utama saat berjalan di sisi depan cincin (di depan pulau tengah) */}
          {!isHeroBehindIsland ? (
            <HeroWalker x={heroX} y={heroY} s={0.76} facing={heroFacing} walking={heroWalking} />
          ) : null}
        </div>

        {/* LAPISAN 3 (DEPAN): Bingkai sayap panggung teater kertas untuk kedalaman paralaks */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 1180,
            transformOrigin: '0 0',
            transform: layerTransform(1.28),
            pointerEvents: 'none',
          }}
        >
          {/* Sayap kertas kiri bawah & kanan bawah */}
          <div
            style={{
              position: 'absolute',
              left: -190,
              top: 520,
              width: 180,
              height: 760,
              background: '#191815',
              transform: 'rotate(-2deg)',
              boxShadow: '8px 0 18px rgba(0,0,0,0.45)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 1290,
              top: 520,
              width: 180,
              height: 760,
              background: '#191815',
              transform: 'rotate(2deg)',
              boxShadow: '-8px 0 18px rgba(0,0,0,0.45)',
            }}
          />
        </div>
      </FilmWeave>

      {/* Vinyet lembut & grain film */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 56%, rgba(12,14,22,0.38) 100%)',
          pointerEvents: 'none',
        }}
      />
      <GrainOverlay />
    </AbsoluteFill>
  );
};