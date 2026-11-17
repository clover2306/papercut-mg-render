// Adegan T05: diorama penampang bus yang penuh sesak dan pita rute yang melar saat daya tampung tidak siap.
// Menampilkan kerumunan halte, tiga stempel identik, penumpang tertinggal, dan label jadwal molor.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Lamp, Window} from '../../lib/paper/sets';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const T05_DUR = 679;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepF = (f: number, step = 2) => Math.floor(f / step) * step;

// Tokoh kertas tanpa wajah dengan variasi postur, tas, dan warna pakaian bermartabat.
const Commuter: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt: string;
  bag?: 'backpack' | 'briefcase' | 'none';
  armReach?: number;
  facing?: 1 | -1;
}> = ({x, y, s = 1, shirt, bag = 'none', armReach = 0, facing = 1}) => {
  const armDeg = interpolate(armReach, [0, 1], [10, -68], CLAMP) * facing;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 82 * s,
        height: 176 * s,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={4}>
        {/* Tas punggung bila ada */}
        {bag === 'backpack' ? (
          <Slab
            x={(facing === 1 ? 8 : 48) * s}
            y={64 * s}
            w={24 * s}
            h={54 * s}
            color={C.woodLo}
            shade="rgba(0,0,0,0.22)"
            shadeH={0.2}
            r={8 * s}
          />
        ) : null}
        {/* Kepala polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 48 * s,
            height: 48 * s,
            translate: '-50% 0',
            borderRadius: '50%',
            background: C.creamLo,
            border: `${2.5 * s}px solid ${C.inkSoft}`,
            boxShadow: '1px 3px 5px rgba(0,0,0,0.22)',
          }}
        />
        {/* Badan */}
        <Slab
          x={14 * s}
          y={54 * s}
          w={54 * s}
          h={78 * s}
          color={shirt}
          shade="rgba(0,0,0,0.16)"
          shadeH={0.18}
          r={10 * s}
        />
        {/* Lengan terulur saat tertinggal di trotoar */}
        <div
          style={{
            position: 'absolute',
            left: (facing === 1 ? 54 : 18) * s,
            top: 64 * s,
            width: 14 * s,
            height: 54 * s,
            background: shirt,
            borderRadius: 7 * s,
            transformOrigin: '50% 10%',
            transform: `rotate(${armDeg}deg)`,
            boxShadow: '1px 2px 4px rgba(0,0,0,0.22)',
          }}
        />
        {/* Tas kerja bila ada */}
        {bag === 'briefcase' ? (
          <Slab
            x={(facing === 1 ? 46 : 6) * s}
            y={114 * s}
            w={30 * s}
            h={22 * s}
            color={C.brassLo}
            shade="rgba(0,0,0,0.22)"
            shadeH={0.25}
            r={4 * s}
          />
        ) : null}
        {/* Kaki */}
        <Slab x={20 * s} y={132 * s} w={18 * s} h={44 * s} color={C.inkSoft} r={5 * s} />
        <Slab x={44 * s} y={132 * s} w={18 * s} h={44 * s} color={C.inkSoft} r={5 * s} />
      </Paper>
    </div>
  );
};

// Halte bus kertas pagi hari: atap, bangku, dan tiang papan polos tanpa tulisan.
const BusShelter: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 280 * scale,
      height: 230 * scale,
      translate: '0 -100%',
    }}
  >
    <Paper lift={5}>
      {/* Dinding belakang halte */}
      <Slab
        x={18 * scale}
        y={28 * scale}
        w={210 * scale}
        h={198 * scale}
        color={C.creamLo}
        shade="rgba(0,0,0,0.14)"
        shadeH={0.1}
        r={4 * scale}
      />
      {/* Panel kaca kertas teduh */}
      <Slab
        x={32 * scale}
        y={42 * scale}
        w={84 * scale}
        h={110 * scale}
        color="#8CA2B2"
        hi="rgba(255,255,255,0.22)"
        hiH={0.18}
        r={3 * scale}
      />
      <Slab
        x={128 * scale}
        y={42 * scale}
        w={84 * scale}
        h={110 * scale}
        color="#8CA2B2"
        hi="rgba(255,255,255,0.22)"
        hiH={0.18}
        r={3 * scale}
      />
      {/* Bangku halte */}
      <Slab
        x={36 * scale}
        y={174 * scale}
        w={172 * scale}
        h={14 * scale}
        color={C.wood}
        shade={C.woodLo}
        shadeH={0.35}
        r={3 * scale}
      />
      <Slab x={52 * scale} y={188 * scale} w={12 * scale} h={38 * scale} color={C.inkSoft} r={2} />
      <Slab x={180 * scale} y={188 * scale} w={12 * scale} h={38 * scale} color={C.inkSoft} r={2} />
      {/* Atap kanopi */}
      <Slab
        x={4 * scale}
        y={10 * scale}
        w={242 * scale}
        h={24 * scale}
        color={C.woodLo}
        hi={C.woodHi}
        hiH={0.22}
        r={6 * scale}
      />
      {/* Tiang papan halte polos */}
      <Slab x={256 * scale} y={36 * scale} w={10 * scale} h={194 * scale} color={C.metalLo} r={3} />
      <div
        style={{
          position: 'absolute',
          left: 237 * scale,
          top: 16 * scale,
          width: 48 * scale,
          height: 48 * scale,
          borderRadius: '50%',
          background: C.cream,
          border: `${5 * scale}px solid ${C.cap}`,
          boxShadow: '2px 4px 6px rgba(0,0,0,0.28)',
        }}
      />
    </Paper>
  </div>
);

// Stempel identik tanpa huruf/angka untuk menandai bus, pengemudi, dan jalur yang sama.
const IdenticalStamp: React.FC<{x: number; y: number; at: number; opacity?: number}> = ({
  x,
  y,
  at,
  opacity = 1,
}) => (
  <PopIn at={at}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 68,
        height: 68,
        translate: '-50% -50%',
        rotate: '-8deg',
        opacity,
        borderRadius: '50%',
        border: `5px solid ${C.tag}`,
        background: 'rgba(232, 223, 211, 0.88)',
        boxShadow: '2px 4px 8px rgba(0,0,0,0.28)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
      }}
    >
      <div style={{width: 30, height: 6, borderRadius: 3, background: C.tag}} />
      <div style={{width: 30, height: 6, borderRadius: 3, background: C.tag}} />
    </div>
  </PopIn>
);

// Penampang bus kertas model rumah boneka: penumpang menumpuk sampai dinding menggembung & pintu tak menutup.
const BusCutaway: React.FC<{
  x: number;
  y: number;
  fillProgress: number;
  bulge: number;
  doorGap: number;
  wheelAngle: number;
}> = ({x, y, fillProgress, bulge, doorGap, wheelAngle}) => {
  const w = 430;
  const h = 206;
  const bulgePx = Math.round(bulge * 12);
  const doorSlide = Math.round(doorGap * 28);

  const riders = [
    {dx: 48, shirt: ROOM.sage, at: 0.05},
    {dx: 92, shirt: ROOM.purple, at: 0.12},
    {dx: 136, shirt: ROOM.terracotta, at: 0.25},
    {dx: 178, shirt: ROOM.mustard, at: 0.42},
    {dx: 220, shirt: ROOM.teal, at: 0.58},
    {dx: 262, shirt: ROOM.dusk, at: 0.74},
    {dx: 300, shirt: C.hero, at: 0.88},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h + 22,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={8}>
        {/* Bodi luar bus yang sedikit menggembung saat sesak */}
        <div
          style={{
            position: 'absolute',
            left: -bulgePx * 0.4,
            top: -bulgePx,
            width: w + bulgePx * 0.8,
            height: h + bulgePx,
            background: C.cap,
            borderRadius: `${26 + bulgePx}px ${32 + bulgePx}px 12px 12px`,
            boxShadow: '0 8px 16px rgba(0,0,0,0.34)',
            border: `4px solid ${C.capLo}`,
          }}
        />
        {/* Ruang penampang kabin penumpang */}
        <Slab
          x={20}
          y={24 - bulgePx * 0.6}
          w={304}
          h={148 + bulgePx * 0.6}
          color={C.creamHi}
          shade={C.creamLo}
          shadeH={0.14}
          r={14}
        />
        {/* Tiang pegangan vertikal di dalam kabin */}
        <Slab x={114} y={26} w={6} h={144} color={C.metalLo} r={2} />
        <Slab x={208} y={26} w={6} h={144} color={C.metalLo} r={2} />

        {/* Siluet penumpang berdesakan di dalam penampang */}
        {riders.map((r, idx) => {
          const p = interpolate(fillProgress, [r.at, r.at + 0.14], [0, 1], CLAMP);
          const liftY = (1 - p) * 26;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: r.dx,
                top: 168 + liftY,
                width: 44,
                height: 118,
                translate: '-50% -100%',
                opacity: p,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 34,
                  height: 34,
                  translate: '-50% 0',
                  borderRadius: '50%',
                  background: C.creamLo,
                  border: `2px solid ${C.inkSoft}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 38,
                  width: 40,
                  height: 78,
                  translate: '-50% 0',
                  background: r.shirt,
                  borderRadius: '8px 8px 3px 3px',
                }}
              />
            </div>
          );
        })}

        {/* Kabin pengemudi di bagian depan (kanan) */}
        <Slab x={334} y={30} w={76} h={112} color="#9DB7C9" r="10px 22px 6px 6px" />
        {/* Pengemudi bertopi tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: 368,
            top: 140,
            width: 46,
            height: 98,
            translate: '-50% -100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 6,
              width: 32,
              height: 32,
              translate: '-50% 0',
              borderRadius: '50%',
              background: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
          {/* Topi pengemudi */}
          <Slab x={8} y={0} w={34} h={10} color={C.ink} r={4} />
          <Slab x={24} y={6} w={22} h={5} color={C.ink} r={2} />
          <Slab x={6} y={42} w={36} h={54} color={C.inkSoft} r={8} />
        </div>
        {/* Setir */}
        <div
          style={{
            position: 'absolute',
            left: 392,
            top: 94,
            width: 6,
            height: 36,
            rotate: '-24deg',
            background: C.ink,
            borderRadius: 3,
          }}
        />

        {/* Pintu lipat penumpang yang tertahan tidak bisa menutup rapat */}
        <Slab
          x={286 - doorSlide}
          y={44}
          w={34}
          h={138}
          color={C.cream}
          shade={C.creamLo}
          shadeH={0.2}
          r={4}
        />
        <Slab x={293 - doorSlide} y={56} w={20} h={64} color="#8CA2B2" r={3} />

        {/* Roda bus depan dan belakang */}
        {[96, 336].map((wx, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: wx,
              top: h - 18,
              width: 58,
              height: 58,
              translate: '-50% 0',
              borderRadius: '50%',
              background: C.ink,
              border: `5px solid ${C.inkSoft}`,
              transform: `rotate(${wheelAngle}deg)`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 24,
                height: 24,
                translate: '-50% -50%',
                borderRadius: '50%',
                background: C.metal,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 6,
                width: 4,
                height: 46,
                translate: '-50% 0',
                background: C.metalLo,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 6,
                height: 4,
                width: 46,
                translate: '0 -50%',
                background: C.metalLo,
              }}
            />
          </div>
        ))}
      </Paper>
    </div>
  );
};

// Pita karet kertas rute dengan titik-titik halte yang meregang dan melar.
const ElasticRouteRibbon: React.FC<{stretch: number}> = ({stretch}) => {
  const startX = 275;
  const stop2BaseX = 875;
  const stop2X = Math.round(stop2BaseX + stretch * 235);
  const endX = Math.round(1150 + stretch * 150);
  const ribbonW = endX - startX;
  const ribbonH = Math.round(24 - stretch * 5);
  const pleatCount = 18;

  return (
    <div style={{position: 'absolute', left: 0, top: 530, width: 1280, height: 56}}>
      {/* Bayangan posisi halte kedua sebelum pita melar */}
      <div
        style={{
          position: 'absolute',
          left: stop2BaseX,
          top: 14,
          width: 22,
          height: 22,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `3px dashed ${C.inkSoft}`,
          opacity: interpolate(stretch, [0.1, 0.45], [0, 0.55], CLAMP),
        }}
      />
      <Paper lift={4}>
        {/* Badan pita karet kertas */}
        <Slab
          x={startX}
          y={14 - ribbonH / 2}
          w={ribbonW}
          h={ribbonH}
          color={C.amber}
          shade={C.amberDim}
          shadeH={0.28}
          r={10}
        />
        {/* Lipatan akordeon pita yang merenggang */}
        {Array.from({length: pleatCount}).map((_, i) => {
          const frac = (i + 0.5) / pleatCount;
          const px = startX + frac * ribbonW;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: 14 - ribbonH / 2 + 3,
                width: 3,
                height: Math.max(6, ribbonH - 6),
                background: C.amberDim,
                opacity: 0.45,
                borderRadius: 2,
              }}
            />
          );
        })}
        {/* Titik halte 1, halte tengah, dan halte 2 yang ikut tertarik melar */}
        {[startX + 18, Math.round((startX + stop2X) / 2), stop2X].map((sx, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: sx,
              top: 14,
              width: 26,
              height: 26,
              translate: '-50% -50%',
              borderRadius: '50%',
              background: C.creamHi,
              border: `5px solid ${C.ink}`,
              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </Paper>
    </div>
  );
};

// Jalur jalan di kaki panggung: pengukur macet tanpa angka (tetap rapat dan padat).
const BottomRoadTrack: React.FC<{f: number}> = ({f}) => {
  const sf = stepF(f, 3);
  const creep = (sf * 0.32) % 138;
  const carColors = [C.hero, C.brass, C.sage, C.cap, C.heroLo, C.hero, C.brass, C.sage, C.cap, C.heroLo];

  return (
    <>
      {/* Rel tipis di atas lantai panggung */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: FLOOR_Y + 64,
          height: 5,
          background: C.ink,
          opacity: 0.65,
        }}
      />
      {carColors.map((col, i) => {
        const cx = -60 + i * 138 + creep;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: FLOOR_Y + 64,
              width: 108,
              height: 44,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={3}>
              {/* Kabin mobil + kepala pengemudi tanpa wajah */}
              <Slab x={22} y={2} w={54} h={22} color={col} r="10px 12px 2px 2px" />
              <div
                style={{
                  position: 'absolute',
                  left: 58,
                  top: 7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: C.creamLo,
                }}
              />
              {/* Bodi mobil */}
              <Slab
                x={4}
                y={18}
                w={100}
                h={20}
                color={col}
                shade="rgba(0,0,0,0.22)"
                shadeH={0.28}
                r={7}
              />
              {/* Roda */}
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  top: 33,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: C.ink,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 82,
                  top: 33,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: C.ink,
                }}
              />
            </Paper>
          </div>
        );
      })}
    </>
  );
};

export const T05: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepF(f, 2);

  // Beat 1 (0..244): kerumunan halte & tiga stempel identik
  const stampOpacity = interpolate(f, [246, 262], [1, 0], CLAMP);

  // Beat 2 (263..371): bus terisi penuh sampai menggembung, lalu bergeser dari halte pertama
  const fillProgress = interpolate(sf, [264, 318], [0.22, 1], CLAMP);
  const bulge = interpolate(sf, [292, 336], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const doorGap = interpolate(sf, [264, 294, 326], [1, 0.9, 0.42], CLAMP);

  // Gerak bus dari Halte 1 (x=595) melaju lalu melambat berhenti sebelum Halte 2 (x=745)
  const busX = interpolate(
    sf,
    [0, 322, 435, 555, 642],
    [595, 595, 672, 726, 745],
    {...CLAMP, easing: Easing.out(Easing.quad)},
  );
  const wheelAngle = (busX - 595) * 3.4;

  // Beat 3 (387..435): penumpang tertinggal mengulurkan tangan
  const armReach = interpolate(sf, [387, 422], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 4 & 5 (450..679): pita rute melar dan papan jadwal miring
  const stretch = interpolate(
    sf,
    [450, 545, 645],
    [0, 0.56, 1],
    {...CLAMP, easing: Easing.out(Easing.cubic)},
  );
  const boardTilt = interpolate(sf, [462, 492], [-1, 8.5], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });

  // Tirai pembuka kertas di awal adegan
  const curtainOpen = interpolate(f, [0, 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Penumpang yang masuk ke bus (menghilang ke dalam penampang saat bus penuh)
  const boardingOpacity = interpolate(f, [268, 298], [1, 0], CLAMP);

  // Penumpang yang tertinggal di trotoar Halte 1 (bertahan sampai akhir adegan)
  const stranded = [
    {x: 132, s: 0.96, shirt: ROOM.dusk, bag: 'briefcase' as const, at: 12, delay: 0},
    {x: 192, s: 1.0, shirt: ROOM.terracotta, bag: 'backpack' as const, at: 24, delay: 5},
    {x: 248, s: 0.94, shirt: ROOM.sage, bag: 'none' as const, at: 36, delay: 9},
    {x: 302, s: 0.98, shirt: ROOM.mustard, bag: 'briefcase' as const, at: 48, delay: 13},
  ];

  // Penumpang yang berhasil naik ke bus di awal Beat 2
  const boarders = [
    {x: 332, s: 0.96, shirt: ROOM.purple, at: 58},
    {x: 362, s: 0.98, shirt: ROOM.teal, at: 70},
    {x: 390, s: 0.95, shirt: C.hero, at: 82},
  ];

  // Penumpang yang menunggu di halte berikutnya (kanan, ikut bergeser sedikit mengikuti pita)
  const nextStopX = Math.round(1090 + stretch * 80);

  return (
    <AbsoluteFill style={{backgroundColor: ROOM.slate}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={T05_DUR}
          yaw={14}
          drift={[-24, 0]}
          push={1.08}
          focus={0.5}
          depth={620}
          origin={[640, 480]}
        >
          {/* Lapisan 0: Latar dinding panggung pagi yang teduh */}
          <Depth z={0} cover>
            <Slab x={-180} y={-100} w={1640} h={920} color={ROOM.slate} r={0} grain={0.55} />
            <Slab
              x={-180}
              y={-100}
              w={1640}
              h={620}
              color={C.creamHi}
              r={0}
              grain={0.45}
            />
            <div
              style={{
                position: 'absolute',
                inset: -120,
                background:
                  'linear-gradient(180deg, rgba(78,99,120,0.34) 0%, rgba(78,99,120,0.16) 55%, rgba(54,34,26,0.22) 100%)',
              }}
            />
            {/* Dekorasi jendela pagi & lampu gantung tepi panggung */}
            <Window x={64} y={48} w={210} h={240} night={false} />
            <Lamp x={820} y={36} s={0.78} on={false} />
          </Depth>

          {/* Lapisan 0.35: Trotoar, halte, pita rute melar, dan lantai panggung */}
          <Depth z={0.35}>
            {/* Pita trotoar di atas pita rute */}
            <Slab
              x={-60}
              y={510}
              w={1400}
              h={22}
              color={C.creamLo}
              shade={C.inkSoft}
              shadeH={0.22}
              r={0}
            />
            {/* Halte pertama di sisi kiri */}
            <BusShelter x={46} y={512} scale={0.96} />
            {/* Halte berikutnya di sisi kanan yang menjauh saat pita melar */}
            <BusShelter x={nextStopX - 60} y={512} scale={0.86} />

            {/* Pita karet kertas rute yang melar */}
            <ElasticRouteRibbon stretch={stretch} />

            {/* Lantai kayu panggung & jalur jalan di kaki panggung */}
            <Slab x={-80} y={FLOOR_Y} w={1440} h={720 - FLOOR_Y + 60} color={C.floor} r={0} grain={0.6} />
            <div
              style={{
                position: 'absolute',
                left: -80,
                right: -80,
                top: FLOOR_Y + 38,
                height: 3,
                background: C.floorLo,
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -80,
                right: -80,
                top: FLOOR_Y + 86,
                height: 3,
                background: C.floorLo,
                opacity: 0.8,
              }}
            />
            <Slab x={-80} y={FLOOR_Y - 22} w={1440} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
            <BottomRoadTrack f={f} />
          </Depth>

          {/* Lapisan 0.55: Kerumunan komuter, penampang bus, dan tiga stempel identik */}
          <Depth z={0.55}>
            {/* Kerumunan di halte pertama yang tertinggal di trotoar */}
            {stranded.map((p, idx) => {
              const localArm = interpolate(armReach, [0, 1], [0, 1 - idx * 0.08], CLAMP);
              const sway = Math.sin((sf + p.delay) * 0.14) * 1.5 * (1 - bulge * 0.6);
              return (
                <SlideIn key={idx} at={p.at} dx={-140} dur={18}>
                  <Commuter
                    x={p.x + sway}
                    y={512}
                    s={p.s}
                    shirt={p.shirt}
                    bag={p.bag}
                    armReach={localArm}
                    facing={1}
                  />
                </SlideIn>
              );
            })}

            {/* Komuter terdepan yang berhasil masuk ke bus */}
            <div style={{opacity: boardingOpacity}}>
              {boarders.map((p, idx) => (
                <SlideIn key={idx} at={p.at} dx={-120} dur={16}>
                  <Commuter x={p.x} y={512} s={p.s} shirt={p.shirt} bag="backpack" facing={1} />
                </SlideIn>
              ))}
            </div>

            {/* Penumpang menunggu di halte berikutnya (kanan) */}
            <Commuter x={nextStopX} y={512} s={0.9} shirt={ROOM.navy} bag="briefcase" facing={-1} />
            <Commuter x={nextStopX + 46} y={512} s={0.88} shirt={ROOM.sage} bag="backpack" facing={-1} />

            {/* Penampang bus rumah boneka */}
            <Boil seed="bus-t05" amp={0.4} rot={0.05}>
              <BusCutaway
                x={busX}
                y={522}
                fillProgress={fillProgress}
                bulge={bulge}
                doorGap={doorGap}
                wheelAngle={wheelAngle}
              />
            </Boil>

            {/* Tiga stempel identik: bus, pengemudi, jalur (tanpa huruf/angka) */}
            <IdenticalStamp x={545} y={248} at={142} opacity={stampOpacity} />
            <IdenticalStamp x={755} y={248} at={176} opacity={stampOpacity} />
            <IdenticalStamp x={645} y={544} at={210} opacity={stampOpacity} />
          </Depth>

          {/* Lapisan 0.8: Papan jadwal kosong yang bergeser miring + label "Jadwal molor" */}
          <Depth z={0.8}>
            <div
              style={{
                position: 'absolute',
                left: 1030,
                top: 112,
                width: 280,
                height: 114,
                translate: '-50% -50%',
                rotate: `${boardTilt}deg`,
              }}
            >
              <Paper lift={7}>
                {/* Tali gantung papan */}
                <div
                  style={{
                    position: 'absolute',
                    left: 44,
                    top: -66,
                    width: 3,
                    height: 68,
                    background: C.inkSoft,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 44,
                    top: -66,
                    width: 3,
                    height: 68,
                    background: C.inkSoft,
                  }}
                />
                {/* Bingkai papan jadwal kosong tanpa angka/jam */}
                <Slab
                  x={0}
                  y={0}
                  w={280}
                  h={114}
                  color={C.wood}
                  shade={C.woodLo}
                  shadeH={0.14}
                  r={8}
                />
                <Slab
                  x={14}
                  y={14}
                  w={252}
                  h={86}
                  color={C.creamHi}
                  shade={C.creamLo}
                  shadeH={0.12}
                  r={4}
                />
                {/* Garis-garis jadwal kosong abstrak */}
                {[32, 54, 76].map((ly, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: 28,
                      right: 28,
                      top: ly,
                      height: 3,
                      background: C.creamLo,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </Paper>
            </div>

            {/* Satu-satunya teks yang diizinkan brief: "Jadwal molor" */}
            <Tag
              x={1028}
              y={148}
              text="Jadwal molor"
              at={492}
              bg={C.tag}
              color={C.tagText}
              size={30}
              rot={-2}
              seed="jadwal-molor"
            />
          </Depth>
        </OrbitCamera>
      </FilmWeave>

      {/* Bingkai teater kertas + gorden pembuka yang tersingkap tenang */}
      <Slab x={0} y={0} w={26} h={720} color={C.woodLo} r={0} />
      <Slab x={1254} y={0} w={26} h={720} color={C.woodLo} r={0} />
      <Slab x={0} y={0} w={1280} h={20} color={C.woodLo} r={0} />

      {curtainOpen < 1 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 644,
              height: 720,
              translate: `${-curtainOpen * 644}px 0`,
              background: C.heroLo,
              boxShadow: '6px 0 18px rgba(0,0,0,0.35)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 644,
              height: 720,
              translate: `${curtainOpen * 644}px 0`,
              background: C.heroLo,
              boxShadow: '-6px 0 18px rgba(0,0,0,0.35)',
            }}
          />
        </>
      ) : null}

      <GrainOverlay />
    </AbsoluteFill>
  );
};