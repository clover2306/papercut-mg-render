// Adegan MGF: panggung lantai beralih ke tampak atas kota monopsoni satu pabrik lalu tampak samping upah ditekan di bawah benang nilai pekerja.
// Papan lantai kraft moderat mengangkat upah mendekati benang tanpa melewatinya sementara pintu pabrik melebar dan antrean pekerja memanjang.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab, SlideIn} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const MGF_DUR = 1028;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const THREAD_Y = 216;
const PLANK_W = 320;
const PLANK_H = 38;

// Palet kertas hangat sesuai aturan visual bersama (krem, kraft, mustard, sage/zaitun, terakota/bata, cokelat tua)
const PAL = {
  wallCream: C.creamHi,
  wallWarm: '#E5DAC8',
  kraft: '#C79B68',
  kraftHi: '#D8B182',
  kraftLo: '#9B7143',
  kraftEdge: '#7A552E',
  mustard: '#DDA334',
  mustardHi: '#EBC263',
  mustardLo: '#A8761D',
  olive: '#5E6E54',
  oliveDark: '#46533E',
  terra: ROOM.terracotta,
  terraLo: '#76412E',
  creamTag: '#F4ECE0',
};

const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

const prog = (f: number, start: number, end: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, end], [0, 1], {...CLAMP, easing: ease});

// Label kertas sobek dengan selotip kraft (satu-satunya cara teks muncul di layar)
const StageLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  opacity?: number;
  seed?: string;
}> = ({
  x,
  y,
  text,
  at,
  bg = PAL.creamTag,
  color = C.ink,
  size = 24,
  rot = -1.2,
  opacity = 1,
  seed = 'lbl',
}) => {
  const f = useCurrentFrame();
  if (f < at || opacity <= 0.01) return null;

  // PopIn/Boil HARUS di luar div berposisi: bila di dalam, inset:0 membuat
  // lebar div luar menciut sehingga kotak label sempit dan teks meluber.
  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            opacity,
            zIndex: 26,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              padding: '9px 19px 11px',
              fontFamily: FONT.label,
              fontWeight: 800,
              fontSize: size,
              color,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              border: `2px solid ${C.inkSoft}`,
              filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(28,27,23,0.34))',
            }}
          >
            {text}
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                width: 52,
                height: 15,
                translate: '-50% 0',
                rotate: `${-rot * 1.4}deg`,
                backgroundColor: C.tape,
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
          </div>
        </div>
      </Boil>
    </PopIn>
  );
};

// Benang mustard bertitik melintang sebagai penanda nilai yang sebenarnya dihasilkan pekerja
const MustardThreadLine: React.FC<{y: number}> = ({y}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: y - 12,
      height: 24,
      zIndex: 14,
      pointerEvents: 'none',
    }}
  >
    <Boil seed="mustard-thread" amp={0.4} rot={0.05}>
      <div style={{position: 'relative', width: 1280, height: 24}}>
        {/* Pasak kuningan kiri */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 12,
            width: 20,
            height: 20,
            translate: '-50% -50%',
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `2.5px solid ${C.ink}`,
            boxShadow: '2px 3px 5px rgba(28,27,23,0.34)',
          }}
        />
        {/* Garis benang mustard bertitik */}
        <div
          style={{
            position: 'absolute',
            left: 36,
            right: 36,
            top: 10,
            height: 0,
            borderTop: `4.5px dashed ${PAL.mustard}`,
            filter: 'drop-shadow(0px 2px 3px rgba(28,27,23,0.24))',
          }}
        />
        {/* Pasak kuningan kanan */}
        <div
          style={{
            position: 'absolute',
            left: 1254,
            top: 12,
            width: 20,
            height: 20,
            translate: '-50% -50%',
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `2.5px solid ${C.ink}`,
            boxShadow: '2px 3px 5px rgba(28,27,23,0.34)',
          }}
        />
      </div>
    </Boil>
  </div>
);

// Papan lantai kraft (batas bawah upah minimum moderat)
const KraftPlank: React.FC<{cx: number; topY: number; seed: string}> = ({cx, topY, seed}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - PLANK_W / 2,
      top: topY,
      width: PLANK_W,
      height: PLANK_H + 10,
      zIndex: 17,
      pointerEvents: 'none',
    }}
  >
    <Boil seed={seed} amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'relative',
          width: PLANK_W,
          height: PLANK_H + 10,
          filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(28,27,23,0.34))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 8,
            width: PLANK_W,
            height: PLANK_H,
            backgroundColor: PAL.kraftEdge,
            borderRadius: 4,
          }}
        />
        <Slab x={0} y={0} w={PLANK_W} h={PLANK_H} color={PAL.kraft} r={4} grain={0.75} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PLANK_W,
            height: 7,
            backgroundColor: PAL.kraftHi,
            borderRadius: '4px 4px 0 0',
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            right: 14,
            top: 12,
            height: 0,
            borderTop: `2.5px dashed ${C.inkSoft}`,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 20,
            top: 25,
            height: 2,
            backgroundColor: PAL.kraftLo,
            opacity: 0.65,
          }}
        />
      </div>
    </Boil>
  </div>
);

// Figur pekerja pabrik faceless memakai <Figure> dari ./mgkit + helm kuning & tas kain
const FactoryWorkerActor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  shirt: string;
  bobY?: number;
  tiltDeg?: number;
}> = ({x, y, scale = 0.6, shirt, bobY = 0, tiltDeg = 0}) => {
  const w = Math.round(90 * scale);
  const h = Math.round(190 * scale);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - bobY,
        width: w,
        height: h,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        rotate: `${tiltDeg}deg`,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 4px 5px rgba(28,27,23,0.28))',
      }}
    >
      {/* Figur faceless bawaan mgkit */}
      <Figure x={w / 2} y={h} s={scale} shirt={shirt} />

      {/* Tas kain pekerja di punggung */}
      <div
        style={{
          position: 'absolute',
          left: w * 0.14,
          top: h * 0.36,
          width: 16 * scale,
          height: 34 * scale,
          borderRadius: 5 * scale,
          backgroundColor: PAL.kraft,
          border: `${Math.max(1.5, 2 * scale)}px solid ${C.inkSoft}`,
        }}
      />

      {/* Helm kuning pekerja pabrik */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -3 * scale,
          width: 62 * scale,
          height: 25 * scale,
          translate: '-50% 0',
          borderRadius: `${30 * scale}px ${30 * scale}px ${5 * scale}px ${5 * scale}px`,
          backgroundColor: PAL.mustard,
          border: `${Math.max(1.5, 2.5 * scale)}px solid ${C.inkSoft}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -4 * scale,
            bottom: -3 * scale,
            width: 70 * scale,
            height: 6 * scale,
            borderRadius: 3 * scale,
            backgroundColor: PAL.mustardLo,
            border: `${Math.max(1, 1.5 * scale)}px solid ${C.inkSoft}`,
          }}
        />
      </div>
    </div>
  );
};

// Tampak atas kota kertas kecil: satu pabrik di tengah, semua jalan lurus ke satu pintu pabrik saja
const AerialTownLayer: React.FC<{opacity: number; slideY: number}> = ({opacity, slideY}) => {
  const f = useCurrentFrame();
  const fs = stepFrame(f, 2);

  if (opacity <= 0.01) return null;

  const walkCycle = interpolate(fs, [140, 360], [0, 1], CLAMP);

  const townBlocks = [
    {x: 170, y: 112, w: 68, h: 48, roof: PAL.terra},
    {x: 268, y: 98, w: 58, h: 44, roof: C.wood},
    {x: 146, y: 242, w: 62, h: 46, roof: C.heroLo},
    {x: 162, y: 468, w: 68, h: 48, roof: PAL.terraLo},
    {x: 284, y: 524, w: 60, h: 44, roof: C.wood},
    {x: 966, y: 108, w: 66, h: 48, roof: PAL.terra},
    {x: 1066, y: 150, w: 58, h: 44, roof: C.heroLo},
    {x: 1054, y: 274, w: 64, h: 46, roof: C.wood},
    {x: 1034, y: 472, w: 68, h: 48, roof: PAL.terraLo},
    {x: 924, y: 528, w: 60, h: 44, roof: C.heroLo},
  ];

  // Pekerja-pekerja faceless berjalan di jalan lurus menuju satu gerbang yang sama (640, 424)
  const paths = [
    {x0: 210, y0: 205, x1: 616, y1: 462, phase: 0},
    {x0: 255, y0: 515, x1: 624, y1: 468, phase: 1.5},
    {x0: 1045, y0: 210, x1: 664, y1: 462, phase: 2.4},
    {x0: 1015, y0: 515, x1: 656, y1: 468, phase: 0.9},
    {x0: 640, y0: 652, x1: 640, y1: 444, phase: 1.9},
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        translate: `0px ${slideY}px`,
        backgroundColor: PAL.wallWarm,
        zIndex: 22,
      }}
    >
      <Slab x={0} y={0} w={1280} h={720} color={PAL.wallWarm} r={0} grain={0.65} />

      {/* Bingkai peta kota kertas */}
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 44,
          width: 1164,
          height: 632,
          borderRadius: 26,
          backgroundColor: C.cream,
          border: `4px dashed ${PAL.kraftLo}`,
          boxShadow: '0 8px 20px rgba(28,27,23,0.22)',
        }}
      />

      {/* Lahan kertas hijau sage di sudut kota */}
      <Slab x={86} y={72} w={270} h={134} color={C.sage} r={22} grain={0.55} />
      <Slab x={916} y={74} w={276} h={142} color={C.sageLo} r={22} grain={0.55} />
      <Slab x={90} y={494} w={290} h={150} color={C.sageLo} r={22} grain={0.55} />
      <Slab x={896} y={494} w={294} h={150} color={C.sage} r={22} grain={0.55} />

      {/* Semua jalan lurus dari kertas mengarah ke SATU pintu pabrik di tengah */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{position: 'absolute', inset: 0, filter: 'drop-shadow(2px 4px 5px rgba(28,27,23,0.22))'}}
      >
        <line x1={180} y1={190} x2={640} y2={476} stroke={PAL.kraft} strokeWidth={34} strokeLinecap="round" />
        <line x1={180} y1={190} x2={640} y2={476} stroke={C.creamHi} strokeWidth={3} strokeDasharray="12 12" />

        <line x1={210} y1={545} x2={640} y2={476} stroke={PAL.kraft} strokeWidth={34} strokeLinecap="round" />
        <line x1={210} y1={545} x2={640} y2={476} stroke={C.creamHi} strokeWidth={3} strokeDasharray="12 12" />

        <line x1={1090} y1={190} x2={640} y2={476} stroke={PAL.kraft} strokeWidth={34} strokeLinecap="round" />
        <line x1={1090} y1={190} x2={640} y2={476} stroke={C.creamHi} strokeWidth={3} strokeDasharray="12 12" />

        <line x1={1065} y1={545} x2={640} y2={476} stroke={PAL.kraft} strokeWidth={34} strokeLinecap="round" />
        <line x1={1065} y1={545} x2={640} y2={476} stroke={C.creamHi} strokeWidth={3} strokeDasharray="12 12" />

        <line x1={640} y1={660} x2={640} y2={418} stroke={PAL.kraftHi} strokeWidth={46} strokeLinecap="round" />
        <line x1={640} y1={660} x2={640} y2={418} stroke={PAL.mustardLo} strokeWidth={3.5} strokeDasharray="12 10" />
      </svg>

      {/* Rumah-rumah kota tertutup rapat tanpa pintu lain */}
      {townBlocks.map((b, idx) => (
        <Boil key={idx} seed={`town-block-${idx}`} amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              filter: 'drop-shadow(2px 5px 6px rgba(28,27,23,0.28))',
            }}
          >
            <Slab x={4} y={14} w={b.w - 8} h={b.h - 14} color={C.creamHi} r={3} grain={0.6} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: b.w,
                height: 20,
                backgroundColor: b.roof,
                clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>
        </Boil>
      ))}

      {/* SATU PABRIK BESAR DI TENGAH KOTA (hanya ada satu pintu gerbang tunggal) */}
      <Boil seed="aerial-factory" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 485,
            top: 192,
            width: 310,
            height: 236,
            filter: 'drop-shadow(4px 10px 14px rgba(28,27,23,0.36))',
          }}
        >
          <Slab x={0} y={16} w={310} h={212} color={PAL.oliveDark} r={10} grain={0.65} />
          <Slab x={10} y={26} w={290} h={192} color={C.creamLo} r={6} grain={0.6} />

          {/* Cerobong pabrik */}
          <Slab x={42} y={0} w={28} h={64} color={C.inkSoft} r={4} />
          <Slab x={86} y={8} w={24} h={56} color={C.woodLo} r={4} />

          {/* Badan gedung utama */}
          <Slab x={26} y={46} w={258} h={146} color={PAL.olive} r={6} grain={0.65} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 34 + i * 82,
                top: 56,
                width: 78,
                height: 44,
                backgroundColor: i % 2 === 0 ? C.sage : C.sageLo,
                clipPath: 'polygon(0% 100%, 0% 18%, 100% 100%)',
              }}
            />
          ))}

          {/* SATU-SATUNYA PINTU GERBANG PABRIK */}
          <Slab x={118} y={178} w={74} h={50} color={C.woodLo} r="10px 10px 0 0" />
          <Slab x={126} y={186} w={58} h={42} color={PAL.mustardHi} r="7px 7px 0 0" />
          <Slab x={112} y={172} w={86} h={14} color={PAL.terra} r={4} />
        </div>
      </Boil>

      {/* Figur pekerja faceless berjalan menyusuri jalan lurus menuju satu gerbang yang sama */}
      {paths.map((p, idx) => {
        const t = (walkCycle * 1.15 + idx * 0.14) % 1;
        const wx = interpolate(t, [0, 1], [p.x0, p.x1], CLAMP);
        const wy = interpolate(t, [0, 1], [p.y0, p.y1], CLAMP);
        const coats = [ROOM.sage, ROOM.terracotta, PAL.olive, C.heroLo, C.sageLo];
        const bobY = Math.abs(Math.cos(fs * 0.35 + p.phase)) * 2.5;
        const tiltDeg = Math.sin(fs * 0.35 + p.phase) * 3;
        return (
          <FactoryWorkerActor
            key={idx}
            x={wx}
            y={wy}
            scale={0.34}
            shirt={coats[idx % coats.length]}
            bobY={bobY}
            tiltDeg={tiltDeg}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Penekan kertas besar berbentuk atap pabrik yang menekan label "upah ditekan" + stempel "monopsoni"
const FactoryRoofPresser: React.FC<{
  bottomY: number;
  stampVisible: boolean;
  stampScale: number;
  stampHandleY: number;
}> = ({bottomY, stampVisible, stampScale, stampHandleY}) => {
  const pressW = 350;
  const pressH = 166;
  const topY = bottomY - pressH;

  return (
    <div
      style={{
        position: 'absolute',
        left: 740 - pressW / 2,
        top: 0,
        width: pressW,
        height: 720,
        zIndex: 18,
        pointerEvents: 'none',
      }}
    >
      {/* Tiang penekan dari atas panggung */}
      <Slab
        x={pressW / 2 - 20}
        y={-420}
        w={40}
        h={Math.max(0, topY + 445)}
        color={C.woodLo}
        r={0}
        grain={0.6}
      />

      <Boil seed="factory-presser" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: topY,
            width: pressW,
            height: pressH,
            filter: 'drop-shadow(3px 8px 11px rgba(28,27,23,0.36))',
          }}
        >
          {/* Atap gergaji pabrik */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 16 + i * 106,
                top: 0,
                width: 108,
                height: 46,
                backgroundColor: i % 2 === 0 ? PAL.oliveDark : PAL.olive,
                clipPath: 'polygon(0% 100%, 0% 14%, 100% 100%)',
              }}
            />
          ))}

          {/* Badan penekan atap pabrik */}
          <Slab x={10} y={42} w={pressW - 20} h={104} color={PAL.olive} r={5} grain={0.7} />

          {/* Pelat tekan bawah */}
          <Slab x={0} y={pressH - 20} w={pressW} h={20} color={C.inkSoft} r={4} />

          {/* Jejak tinta kertas stempel "monopsoni" menempel di atap pabrik */}
          {stampVisible ? (
            <div
              style={{
                position: 'absolute',
                left: pressW / 2,
                top: 62,
                translate: '-50% 0',
                rotate: '-2.2deg',
                scale: `${stampScale}`,
                padding: '8px 24px 10px',
                backgroundColor: PAL.creamTag,
                border: `3.5px solid ${PAL.terra}`,
                borderRadius: 5,
                fontFamily: FONT.banner,
                fontSize: 30,
                color: PAL.terra,
                letterSpacing: '0.03em',
                lineHeight: 1,
                filter: 'url(#torn) drop-shadow(1px 3px 4px rgba(28,27,23,0.34))',
              }}
            >
              monopsoni
            </div>
          ) : null}
        </div>
      </Boil>

      {/* Gagang cap besar yang turun menekan stempel lalu terangkat kembali */}
      {stampHandleY > -260 ? (
        <div
          style={{
            position: 'absolute',
            left: pressW / 2 - 56,
            top: stampHandleY,
            width: 112,
            height: 146,
            filter: 'drop-shadow(4px 8px 10px rgba(28,27,23,0.4))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 32,
              top: 0,
              width: 48,
              height: 42,
              borderRadius: '24px 24px 10px 10px',
              backgroundColor: C.woodHi,
              border: `2.5px solid ${C.inkSoft}`,
            }}
          />
          <Slab x={44} y={38} w={24} h={62} color={C.wood} r={4} grain={0.6} />
          <Slab x={6} y={96} w={100} h={26} color={C.woodLo} r={5} grain={0.6} />
          <Slab x={12} y={120} w={88} h={12} color={PAL.terra} r={2} />
        </div>
      ) : null}
    </div>
  );
};

// Sisi kiri panggung samping: pabrik dengan pintu yang melebar & antrean pekerja faceless memanjang
const SideFactoryAndQueue: React.FC<{gateOpenT: number; queueGrowT: number}> = ({gateOpenT, queueGrowT}) => {
  const f = useCurrentFrame();
  const fs = stepFrame(f, 2);

  // Bukaan pintu pabrik melebar dari sempit (44px) menjadi lebar (120px)
  const gateWidth = interpolate(gateOpenT, [0, 1], [44, 120], CLAMP);

  // 2 pekerja awal di Beat c, lalu 5 pekerja baru masuk dari ujung kiri jalan saat Beat f–g
  const workerQueue = [
    {targetX: 342, startX: 342, appearT: 0, shirt: ROOM.sage},
    {targetX: 294, startX: 294, appearT: 0, shirt: PAL.olive},
    {targetX: 244, startX: -40, appearT: 0.04, shirt: ROOM.terracotta},
    {targetX: 196, startX: -80, appearT: 0.22, shirt: C.heroLo},
    {targetX: 148, startX: -120, appearT: 0.4, shirt: C.sageLo},
    {targetX: 100, startX: -160, appearT: 0.58, shirt: PAL.olive},
    {targetX: 52, startX: -200, appearT: 0.76, shirt: PAL.terraLo},
  ];

  return (
    <>
      {/* Gedung pabrik sisi kiri */}
      <Boil seed="side-factory-left" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 266,
            top: 256,
            width: 215,
            height: FLOOR_Y - 256,
            zIndex: 15,
            filter: 'drop-shadow(3px 7px 9px rgba(28,27,23,0.32))',
          }}
        >
          <Slab x={142} y={-40} w={24} h={60} color={PAL.oliveDark} r={3} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 215,
              height: 42,
              backgroundColor: PAL.oliveDark,
              clipPath: 'polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <Slab x={8} y={40} w={202} h={FLOOR_Y - 296} color={PAL.olive} r={4} grain={0.65} />

          {[0, 1, 2].map((col) => (
            <div
              key={col}
              style={{
                position: 'absolute',
                left: 34 + col * 54,
                top: 64,
                width: 34,
                height: 38,
                borderRadius: '14px 14px 2px 2px',
                backgroundColor: PAL.mustardHi,
                border: `2.5px solid ${PAL.oliveDark}`,
                opacity: 0.85,
              }}
            />
          ))}

          {/* PINTU PABRIK YANG MELEBAR PADA BEAT F–G */}
          <div
            style={{
              position: 'absolute',
              left: 112 - gateWidth / 2,
              bottom: 0,
              width: gateWidth,
              height: 142,
              borderRadius: '12px 12px 0 0',
              backgroundColor: PAL.mustardHi,
              border: `4px solid ${C.woodLo}`,
              boxShadow: 'inset 0 6px 12px rgba(28,27,23,0.25)',
            }}
          />
          <Slab
            x={104 - gateWidth / 2}
            y={FLOOR_Y - 256 - 154}
            w={gateWidth + 16}
            h={14}
            color={PAL.terra}
            r={3}
          />
        </div>
      </Boil>

      {/* Antrean pekerja faceless masuk ke pintu pabrik */}
      <div style={{position: 'absolute', inset: 0, zIndex: 16, pointerEvents: 'none'}}>
        {workerQueue.map((w, idx) => {
          const localT = prog(queueGrowT, w.appearT, Math.min(1, w.appearT + 0.28), Easing.out(Easing.cubic));
          if (w.appearT > 0 && localT <= 0.01) return null;

          const wx = w.appearT === 0 ? w.targetX : interpolate(localT, [0, 1], [w.startX, w.targetX], CLAMP);
          const isWalking = w.appearT > 0 && localT < 0.98;
          const bobY = isWalking ? Math.abs(Math.cos(fs * 0.42 + idx)) * 3 : 0;
          const tiltDeg = isWalking ? Math.sin(fs * 0.42 + idx) * 3.5 : 0;

          return (
            <FactoryWorkerActor
              key={idx}
              x={wx}
              y={FLOOR_Y}
              scale={0.58}
              shirt={w.shirt}
              bobY={bobY}
              tiltDeg={tiltDeg}
            />
          );
        })}
      </div>
    </>
  );
};

export const MGF: React.FC = () => {
  const f = useCurrentFrame();
  const fs = stepFrame(f, 2);

  // Beat a [0..88]: sorot hangat menyapu dari sayap, mustard naik sedikit, label "Tidak selalu begitu" miring
  const spotSweep = prog(f, 4, 48, Easing.out(Easing.cubic));
  const threadRiseBeatA = prog(f, 10, 56, Easing.out(Easing.cubic));
  const beatALabelOpacity = interpolate(f, [84, 100], [1, 0], CLAMP);

  // Transisi [89..223] -> Beat b [224..352] -> Transisi kembali ke tampak samping [353..373]
  const townEnter = prog(f, 89, 152, Easing.inOut(Easing.cubic));
  const townExit = prog(f, 353, 373, Easing.inOut(Easing.cubic));
  const townOpacity = interpolate(townEnter - townExit, [0, 1], [0, 1], CLAMP);
  const townSlideY =
    interpolate(townEnter, [0, 1], [-720, 0], CLAMP) + interpolate(townExit, [0, 1], [0, -720], CLAMP);
  const beatBLabelOpacity = interpolate(f, [348, 362], [1, 0], CLAMP);

  // Beat c [374..530]: penekan atap pabrik menekan label "upah ditekan" jauh di bawah benang mustard
  const pressDownT = prog(fs, 432, 506, Easing.inOut(Easing.cubic));

  // Beat d [548..614]: cap besar "monopsoni" ditekan ke atap pabrik
  const stampHitT = prog(f, 548, 572, Easing.in(Easing.quad));
  const stampLiftT = prog(f, 578, 606, Easing.out(Easing.cubic));
  const stampVisible = f >= 570;
  const stampScale = interpolate(f, [570, 580], [1.14, 1], CLAMP);

  // Beat e [636..766]: papan lantai kraft meluncur masuk dari bawah menyangga "upah ditekan"
  const plankEnterT = prog(fs, 636, 694, Easing.out(Easing.cubic));

  // Beat f [766..901]: papan naik pelan mengangkat "upah ditekan" & atap penekan, berhenti di top = 296 (persis di bawah benang y = 216)
  const wageRiseT = prog(fs, 766, 898, Easing.inOut(Easing.cubic));

  // Beat g [908..1028] (mulai serempak di akhir Beat f frame 850): pintu pabrik melebar & antrean pekerja memanjang
  const gateOpenT = prog(fs, 850, 948, Easing.inOut(Easing.cubic));
  const queueGrowT = prog(fs, 850, 1004, Easing.out(Easing.cubic));

  // Koordinat vertikal dinamis papan, label "upah ditekan", dan penekan atap pabrik
  const pressedBottomY = interpolate(pressDownT, [0, 1], [378, 514], CLAMP);
  const plankEntryTopY = interpolate(plankEnterT, [0, 1], [FLOOR_Y + 60, 514], CLAMP);
  // Posisi akhir papan top = 296 (di bawah benang THREAD_Y = 216, tidak melewatinya)
  const finalPlankTopY = interpolate(wageRiseT, [0, 1], [514, 296], CLAMP);
  const currentPlankTopY = f < 766 ? plankEntryTopY : finalPlankTopY;

  // Label "upah ditekan" (tinggi 46px) berada tepat di atas papan setelah papan menyangganya
  const upahDitekanTopY = f < 766 ? pressedBottomY - 46 : currentPlankTopY - 46;

  // Penekan atap pabrik terdorong ke atas mengikuti label "upah ditekan"
  const presserBottomY = upahDitekanTopY;

  // Gagang stempel "monopsoni" relatif terhadap atap pabrik penekan
  const stampTargetY = presserBottomY - 166 - 22;
  const stampHandleY =
    f < 548 || f > 612
      ? -320
      : interpolate(stampHitT, [0, 1], [-220, stampTargetY], CLAMP) -
        interpolate(stampLiftT, [0, 1], [0, 260], CLAMP);

  // Ketinggian benang mustard bertitik (naik sedikit di Beat a menuju THREAD_Y = 216)
  const currentThreadY =
    f < 90 ? interpolate(threadRiseBeatA, [0, 1], [238, THREAD_Y], CLAMP) : THREAD_Y;

  // Sorot hangat menyapu dari sayap panggung pada Beat a
  const spotSweepX = interpolate(spotSweep, [0, 1], [-360, 0], CLAMP);
  const mustardBandOpacity = interpolate(threadRiseBeatA, [0, 1], [0.12, 0.34], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: PAL.wallCream, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <AbsoluteFill>
          {/* LAPISAN LATAR PANGGUNG LANTAI */}
          <Slab x={0} y={0} w={1280} h={720} color={PAL.wallCream} r={0} grain={0.55} />

          {/* Sorot hangat menyapu dari sayap panggung (Beat a) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${spotSweepX}px 0px`,
              background:
                'radial-gradient(ellipse at 52% 42%, rgba(235, 194, 99, 0.34) 0%, rgba(221, 163, 52, 0.14) 44%, rgba(28, 27, 23, 0.24) 100%)',
              opacity: f < 140 ? 1 : 0.42,
            }}
          />

          {/* Sapuan hangat mustard naik sedikit pada Beat a */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: currentThreadY - 34,
              height: 68,
              background: `linear-gradient(180deg, rgba(235,194,99,0) 0%, rgba(235,194,99,${mustardBandOpacity}) 50%, rgba(235,194,99,0) 100%)`,
            }}
          />

          {/* Benang mustard bertitik melintang di ketinggian nilai pekerja (y = 216) */}
          <MustardThreadLine y={currentThreadY} />

          {/* LANTAI PANGGUNG KAYU COKELAT TUA (FLOOR_Y = 600) */}
          <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: FLOOR_Y + 38,
              height: 3,
              backgroundColor: C.floorLo,
              opacity: 0.85,
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
              opacity: 0.85,
            }}
          />
          <Slab x={0} y={FLOOR_Y - 22} w={1280} h={24} color={C.woodLo} r={0} grain={0.6} />

          {/* ELEMEN TAMPAK SAMPING (Beats c–g, aktif mulai frame 365 setelah kembali dari tampak atas) */}
          {f >= 365 ? (
            <>
              {/* Sisi kiri: pabrik & antrean pekerja faceless */}
              <SlideIn at={366} dy={140} dur={16}>
                <SideFactoryAndQueue gateOpenT={gateOpenT} queueGrowT={queueGrowT} />
              </SlideIn>

              {/* Garis penunjuk tipis dari benang mustard ke label nilai pekerja */}
              {f >= 384 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 340,
                    top: 170,
                    height: THREAD_Y - 170,
                    width: 0,
                    borderLeft: `3px dashed ${PAL.mustardLo}`,
                    opacity: 0.85,
                    zIndex: 20,
                  }}
                />
              ) : null}

              {/* Label "nilai yang sebenarnya dihasilkan pekerja" di dekat benang (Beat c) */}
              <StageLabel
                x={340}
                y={144}
                text="nilai yang sebenarnya dihasilkan pekerja"
                at={384}
                bg={PAL.mustardHi}
                color={C.ink}
                size={22}
                rot={-1.0}
                seed="lbl-nilai-pekerja"
              />

              {/* Label "upah ditekan" yang ditekan atap pabrik lalu diangkat papan kraft (Beats c–g) */}
              {f >= 412 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 740,
                    top: upahDitekanTopY,
                    translate: '-50% 0',
                    zIndex: 19,
                    pointerEvents: 'none',
                  }}
                >
                  <Boil seed="lbl-upah-ditekan" amp={0.4} rot={0.05}>
                    <div
                      style={{
                        rotate: '-1.1deg',
                        whiteSpace: 'nowrap',
                        backgroundColor: PAL.terra,
                        padding: '10px 22px 11px',
                        fontFamily: FONT.label,
                        fontWeight: 800,
                        fontSize: 24,
                        color: C.tagText,
                        lineHeight: 1,
                        border: `2px solid ${C.inkSoft}`,
                        filter: 'url(#torn) drop-shadow(2px 4px 6px rgba(28,27,23,0.34))',
                      }}
                    >
                      upah ditekan
                    </div>
                  </Boil>
                </div>
              ) : null}

              {/* Penekan kertas besar berbentuk atap pabrik + stempel "monopsoni" (Beats c–g) */}
              <FactoryRoofPresser
                bottomY={presserBottomY}
                stampVisible={stampVisible}
                stampScale={stampScale}
                stampHandleY={stampHandleY}
              />

              {/* Papan lantai kraft moderat meluncur masuk & naik sampai top = 296 (Beats e–g) */}
              {f >= 636 ? <KraftPlank cx={740} topY={currentPlankTopY} seed="plank-moderate" /> : null}

              {/* Label "batas bawah yang moderat" (Beat e) */}
              <StageLabel
                x={740}
                y={558}
                text="batas bawah yang moderat"
                at={664}
                bg={C.wood}
                color={C.tagText}
                size={22}
                rot={1.1}
                seed="lbl-batas-moderat"
              />

              {/* Label "Upah naik" (Beat f) */}
              <StageLabel
                x={1060}
                y={308}
                text="Upah naik"
                at={792}
                bg={C.sageLo}
                color={C.tagText}
                size={25}
                rot={-1.3}
                seed="lbl-upah-naik"
              />

              {/* Label "penyerapan naik" (Beat g) */}
              <StageLabel
                x={215}
                y={324}
                text="penyerapan naik"
                at={916}
                bg={PAL.oliveDark}
                color={C.tagText}
                size={24}
                rot={1.2}
                seed="lbl-penyerapan-naik"
              />
            </>
          ) : null}

          {/* BEAT A [0..88]: Label miring seperti ditempel buru-buru */}
          <StageLabel
            x={640}
            y={316}
            text="Tidak selalu begitu"
            at={34}
            bg={PAL.terra}
            color={C.tagText}
            size={30}
            rot={-5.2}
            opacity={beatALabelOpacity}
            seed="lbl-tidak-selalu"
          />

          {/* TRANSISI [89..223] & BEAT B [224..352]: TAMPAK ATAS KOTA KERTAS SATU PABRIK */}
          <AerialTownLayer opacity={townOpacity} slideY={townSlideY} />
          {f >= 224 && f <= 366 ? (
            <StageLabel
              x={640}
              y={64}
              text="Satu pabrik di satu kota kecil"
              at={230}
              bg={PAL.oliveDark}
              color={C.tagText}
              size={26}
              rot={-1.1}
              opacity={beatBLabelOpacity}
              seed="lbl-satu-pabrik"
            />
          ) : null}

          {/* Tirai sayap panggung teater kertas di tepi kiri & kanan */}
          <Paper lift={8} style={{zIndex: 30, pointerEvents: 'none'}}>
            <div
              style={{
                position: 'absolute',
                left: -24,
                top: -20,
                width: 68,
                height: 760,
                backgroundColor: C.sageLo,
                borderRight: `4px solid ${PAL.oliveDark}`,
                filter: 'url(#torn)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -24,
                top: -20,
                width: 68,
                height: 760,
                backgroundColor: PAL.terra,
                borderLeft: `4px solid ${PAL.terraLo}`,
                filter: 'url(#torn)',
              }}
            />
          </Paper>
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};