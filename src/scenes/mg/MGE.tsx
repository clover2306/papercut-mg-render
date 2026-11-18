// Adegan MGE: panggung dua sisi membandingkan papan lantai kraft identik antara perusahaan besar dan usaha kecil.
// Perusahaan besar menyerap beban atau menukar pekerja dengan mesin, sedangkan bahu usaha kecil melesak dan memangkas jam maupun pekerja.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab, SlideIn} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const MGE_DUR = 694;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PLANK_W = 290;
const PLANK_H = 38;

// Palet kertas hangat sesuai aturan visual bersama (krem, kraft, mustard, sage/zaitun, terakota/bata, cokelat tua)
const PAL = {
  wallLeft: C.creamHi,
  wallRight: '#E5DAC8',
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
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
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
  seed = 'lbl',
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;

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
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              padding: '9px 18px 11px',
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
                width: 50,
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

// Dua papan lantai kraft identik: ukuran, ketebalan, tekstur, dan bayangan sama persis
const KraftPlank: React.FC<{cx: number; topY: number; seed: string}> = ({cx, topY, seed}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - PLANK_W / 2,
      top: topY,
      width: PLANK_W,
      height: PLANK_H + 10,
      zIndex: 16,
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
        {/* Sisi ketebalan bawah papan */}
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
        {/* Permukaan utama papan kraft */}
        <Slab x={0} y={0} w={PLANK_W} h={PLANK_H} color={PAL.kraft} r={4} grain={0.75} />
        {/* Sorotan serat atas & jahitan garis putus-putus */}
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
            left: 12,
            right: 12,
            top: 12,
            height: 0,
            borderTop: `2.5px dashed ${C.inkSoft}`,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 18,
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

// Siluet pabrik besar berlapis kertas di sisi kiri panggung (Beat b)
const FactorySilhouette: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const smokeShift = interpolate(f, [at, MGE_DUR], [0, 32], CLAMP);

  return (
    <SlideIn at={at} dy={180} dur={16}>
      <Boil seed="factory-sil" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 224,
            width: 245,
            height: FLOOR_Y - 224,
            filter: 'drop-shadow(3px 7px 10px rgba(28,27,23,0.28))',
          }}
        >
          {/* Cerobong pabrik */}
          <Slab x={28} y={14} w={24} h={135} color={PAL.oliveDark} r={2} grain={0.6} />
          <Slab x={68} y={34} w={20} h={115} color={C.sageLo} r={2} grain={0.6} />
          {/* Kepulan asap kertas */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 34 + i * 15 + smokeShift * 0.25,
                top: -8 - i * 13 - (smokeShift % 12),
                width: 22 + i * 7,
                height: 14 + i * 4,
                borderRadius: '50%',
                backgroundColor: C.creamLo,
                opacity: 0.55 - i * 0.12,
                filter: 'url(#torn)',
              }}
            />
          ))}
          {/* Atap gergaji pabrik */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 12 + i * 72,
                top: 102,
                width: 78,
                height: 48,
                backgroundColor: i % 2 === 0 ? C.sage : PAL.olive,
                clipPath: 'polygon(0% 100%, 0% 18%, 100% 100%)',
              }}
            />
          ))}
          {/* Badan pabrik */}
          <Slab x={8} y={146} w={228} h={FLOOR_Y - 370} color={PAL.olive} r={4} grain={0.65} />
          {/* Jendela pabrik hangat */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <div
                key={`${row}-${col}`}
                style={{
                  position: 'absolute',
                  left: 28 + col * 50,
                  top: 170 + row * 58,
                  width: 30,
                  height: 36,
                  borderRadius: '14px 14px 2px 2px',
                  backgroundColor: (row + col) % 2 === 0 ? PAL.mustardHi : C.cream,
                  border: `2.5px solid ${PAL.oliveDark}`,
                  opacity: 0.85,
                }}
              />
            )),
          )}
        </div>
      </Boil>
    </SlideIn>
  );
};

// Siluet kios usaha kecil di sisi kanan (Beat c, tanpa pintu pilihan di samping)
const KioskSilhouette: React.FC<{at: number}> = ({at}) => (
  <SlideIn at={at} dy={140} dur={15}>
    <Boil seed="kiosk-sil" amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: 735,
          top: 416,
          width: 160,
          height: FLOOR_Y - 416,
          filter: 'drop-shadow(3px 6px 8px rgba(28,27,23,0.24))',
        }}
      >
        {/* Atap miring sederhana */}
        <div
          style={{
            position: 'absolute',
            left: -8,
            top: 0,
            width: 176,
            height: 32,
            backgroundColor: PAL.terraLo,
            clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)',
          }}
        />
        {/* Dinding kios polos tanpa pintu tambahan */}
        <Slab x={8} y={30} w={144} h={FLOOR_Y - 446} color={C.creamLo} r={3} grain={0.65} />
        <Slab x={28} y={52} w={66} h={46} color={C.woodLo} r={3} />
        <Slab x={22} y={96} w={78} h={11} color={C.wood} r={2} />
      </div>
    </Boil>
  </SlideIn>
);

// Figur pemberi kerja faceless (jas bata): memakai <Figure> mgkit + jas bata & gestur bahu/lutut
const EmployerActor: React.FC<{
  x: number;
  variant: 'large' | 'small';
  absorbDipPx: number;
  sagDropPx: number;
  seed: string;
}> = ({x, variant, absorbDipPx, sagDropPx, seed}) => {
  const isLarge = variant === 'large';
  const totalDrop = absorbDipPx + sagDropPx;
  const kneeSquash = isLarge ? 1 - absorbDipPx * 0.004 : 1 - sagDropPx * 0.0055;
  const torsoLean = isLarge ? 0 : Math.min(11, sagDropPx * 0.24);
  const shoulderW = isLarge ? 124 : 74;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: FLOOR_Y,
        width: 140,
        height: 220,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        scale: `1 ${kneeSquash}`,
        rotate: `${torsoLean}deg`,
        zIndex: 14,
        pointerEvents: 'none',
      }}
    >
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div style={{position: 'relative', width: 140, height: 220}}>
          {/* Figur faceless bawaan mgkit */}
          <Figure x={70} y={220} s={isLarge ? 1.12 : 0.98} shirt={isLarge ? ROOM.terracotta : C.heroLo} />

          {/* Bahu jas bata lebar (perusahaan besar) atau ramping (usaha kecil) */}
          <div
            style={{
              position: 'absolute',
              left: 70 - shoulderW / 2,
              top: isLarge ? 64 : 84,
              width: shoulderW,
              height: isLarge ? 92 : 76,
              borderRadius: isLarge ? '22px 22px 10px 10px' : '14px 14px 8px 8px',
              backgroundColor: isLarge ? ROOM.terracotta : C.heroLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
          {/* Kerah krem & dasi mustard pemberi kerja */}
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: isLarge ? 66 : 86,
              width: 24,
              height: 30,
              translate: '-50% 0',
              backgroundColor: PAL.creamTag,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: isLarge ? 74 : 94,
              width: 9,
              height: 34,
              translate: '-50% 0',
              backgroundColor: PAL.mustard,
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 80%, 50% 100%, 0% 80%)',
            }}
          />

          {/* Lengan kertas terangkat menopang papan kraft */}
          {[-1, 1].map((side) => {
            const armX = 70 + side * (shoulderW * 0.44);
            const topY = isLarge ? 26 + totalDrop * 0.12 : 42 + totalDrop * 0.16;
            const armH = isLarge ? 48 : 44;
            return (
              <div key={side}>
                <div
                  style={{
                    position: 'absolute',
                    left: armX - (isLarge ? 11 : 8),
                    top: topY,
                    width: isLarge ? 22 : 16,
                    height: armH,
                    borderRadius: 9,
                    backgroundColor: isLarge ? PAL.terraLo : C.heroLo,
                    border: `2px solid ${C.inkSoft}`,
                    rotate: `${side * (isLarge ? -8 : -14)}deg`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: armX - (isLarge ? 12 : 9),
                    top: topY - 4,
                    width: isLarge ? 24 : 18,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: C.creamLo,
                    border: `2px solid ${C.inkSoft}`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </Boil>
    </div>
  );
};

// Pilihan kedua perusahaan besar: pintu kecil terbuka & mesin kertas mungil bertukar tempat dengan pekerja helm kuning
const FactoryOptionDoor: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const fs = stepFrame(f, 2);
  const doorOpen = prog(fs, at, at + 22);
  const swapT = prog(fs, at + 18, at + 52);

  if (f < at - 4) return null;

  const doorAngle = interpolate(doorOpen, [0, 1], [0, -76], CLAMP);
  const machineX = interpolate(swapT, [0, 1], [0, 32], CLAMP);
  const machineScale = interpolate(doorOpen, [0, 1], [0.72, 1], CLAMP);
  const workerX = interpolate(swapT, [0, 1], [78, 108], CLAMP);
  const workerLean = interpolate(swapT, [0, 1], [0, 7], CLAMP);

  return (
    <PopIn at={at - 2} seed="option-door">
      <div style={{position: 'absolute', left: 224, top: FLOOR_Y - 136, width: 150, height: 136, zIndex: 15}}>
        {/* Kusen & cahaya hangat pintu kecil */}
        <Slab x={0} y={0} w={66} h={136} color={C.woodLo} r="10px 10px 0 0" grain={0.6} />
        <Slab x={7} y={7} w={52} h={129} color={PAL.mustardHi} r="7px 7px 0 0" grain={0.4} />

        {/* Daun pintu kertas berayun terbuka */}
        <div
          style={{
            position: 'absolute',
            left: 7,
            top: 7,
            width: 52,
            height: 129,
            borderRadius: '7px 7px 0 0',
            backgroundColor: C.wood,
            border: `2px solid ${C.inkSoft}`,
            transformOrigin: '0% 50%',
            transform: `perspective(420px) rotateY(${doorAngle}deg)`,
            boxShadow: '2px 4px 8px rgba(28,27,23,0.3)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 7,
              top: 62,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: PAL.mustardHi,
            }}
          />
        </div>

        {/* Mesin kertas mungil keluar dari pintu siap menggantikan pekerja */}
        <div
          style={{
            position: 'absolute',
            left: 14 + machineX,
            top: 68,
            width: 54,
            height: 68,
            scale: `${machineScale}`,
            transformOrigin: '50% 100%',
            filter: 'drop-shadow(2px 5px 6px rgba(28,27,23,0.34))',
          }}
        >
          <Slab x={6} y={56} w={42} h={12} color={C.inkSoft} r={4} />
          <Slab x={4} y={18} w={46} h={40} color={C.brass} r={6} grain={0.6} />
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 26,
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: `4px dashed ${C.ink}`,
              backgroundColor: C.cream,
            }}
          />
          <Slab x={22} y={4} w={10} h={16} color={PAL.terra} r={3} />
          <Slab x={12} y={2} w={30} h={6} color={C.inkSoft} r={3} />
        </div>

        {/* Pekerja pabrik faceless (helm kuning) bergeser memberi jalan kepada mesin */}
        <div
          style={{
            position: 'absolute',
            left: workerX,
            top: 26,
            width: 52,
            height: 110,
            rotate: `${workerLean}deg`,
            transformOrigin: '50% 100%',
            filter: 'drop-shadow(2px 4px 6px rgba(28,27,23,0.3))',
          }}
        >
          <Figure x={26} y={110} s={0.58} shirt={ROOM.sage} />
          {/* Helm kuning pekerja pabrik */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: -2,
              width: 36,
              height: 16,
              borderRadius: '18px 18px 4px 4px',
              backgroundColor: PAL.mustard,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </div>
      </div>
    </PopIn>
  );
};

// Jam kertas wajah polos TANPA ANGKA yang papan jam bukanya dilipat pendek saat pemangkasan jam kerja
const BlankClockSign: React.FC<{x: number; y: number; shrinkT: number}> = ({x, y, shrinkT}) => {
  const handSpan = interpolate(shrinkT, [0, 1], [112, 26], CLAMP);
  const flapScaleY = interpolate(shrinkT, [0, 1], [1, 0.42], CLAMP);

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 42, height: 64}}>
      {/* Papan jam buka yang dilipat pendek */}
      <div
        style={{
          position: 'absolute',
          left: 3,
          top: 32,
          width: 36,
          height: 30,
          backgroundColor: PAL.kraft,
          border: `2px solid ${C.inkSoft}`,
          borderRadius: 3,
          transformOrigin: '50% 0%',
          scale: `1 ${flapScaleY}`,
          boxShadow: '1px 3px 4px rgba(28,27,23,0.25)',
        }}
      >
        <div style={{position: 'absolute', left: 6, right: 6, top: 8, height: 3, backgroundColor: C.woodLo}} />
        <div style={{position: 'absolute', left: 6, right: 10, top: 17, height: 3, backgroundColor: PAL.terra}} />
      </div>

      {/* Jam kertas bulat wajah polos tanpa angka */}
      <div
        style={{
          position: 'absolute',
          left: 3,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: C.cream,
          border: `2.5px solid ${C.inkSoft}`,
          boxShadow: '1px 3px 5px rgba(28,27,23,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 5,
            width: 3,
            height: 11,
            backgroundColor: C.ink,
            borderRadius: 2,
            transformOrigin: '50% 100%',
            rotate: '-15deg',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 4,
            width: 3,
            height: 12,
            backgroundColor: PAL.terra,
            borderRadius: 2,
            transformOrigin: '50% 100%',
            rotate: `${-15 + handSpan}deg`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 13,
            top: 13,
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: C.ink,
          }}
        />
      </div>
    </div>
  );
};

// Tiga etalase pop-up usaha kecil (bengkel, warung makan, toko kelontong) + pemangkasan jam & pekerja (Beat d & e)
const SmallBusinessStorefronts: React.FC = () => {
  const f = useCurrentFrame();
  const fs = stepFrame(f, 2);

  // Paruh akhir [432..521]: memangkas jam kerja & memangkas pekerjanya
  const trimHoursT = prog(fs, 434, 468);
  const trimWorkerT = prog(fs, 470, 506);
  const pulledWorkerX = interpolate(trimWorkerT, [0, 1], [0, 290], CLAMP);
  const pulledWorkerTilt = interpolate(trimWorkerT, [0, 1], [0, 14], CLAMP);

  return (
    <>
      {/* 1. BENGKEL KECIL (pop-up frame 346) */}
      <PopIn at={346} seed="shop-bengkel">
        <Boil seed="shop-bengkel" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 690,
              top: 164,
              width: 168,
              height: 122,
              filter: 'drop-shadow(3px 6px 8px rgba(28,27,23,0.3))',
            }}
          >
            <Slab x={10} y={22} w={116} h={100} color={C.cream} r={4} grain={0.6} />
            <Slab x={4} y={8} w={128} h={20} color={C.sage} r={4} grain={0.6} />
            {/* Garasi terbuka + ban & kunci pas kertas */}
            <Slab x={22} y={40} w={62} h={82} color={C.inkSoft} r="4px 4px 0 0" />
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 76,
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `7px solid ${C.creamLo}`,
                backgroundColor: C.woodLo,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 56,
                top: 50,
                width: 8,
                height: 28,
                borderRadius: 4,
                backgroundColor: PAL.mustardHi,
                rotate: '28deg',
              }}
            />
            <BlankClockSign x={90} y={38} shrinkT={trimHoursT} />

            {/* Pekerja harian faceless bertas kain di samping bengkel */}
            <div style={{position: 'absolute', left: 124, top: 38, width: 42, height: 84}}>
              <Figure x={20} y={84} s={0.44} shirt={PAL.olive} />
              <Slab x={24} y={44} w={12} h={15} color={PAL.kraft} r={3} />
            </div>
          </div>
        </Boil>
      </PopIn>
      <PaperLabel x={774} y={132} text="Bengkel kecil" at={350} size={21} rot={-1.4} seed="lbl-bengkel" />

      {/* 2. WARUNG MAKAN (pop-up frame 374) */}
      <PopIn at={374} seed="shop-warung">
        <Boil seed="shop-warung" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 880,
              top: 164,
              width: 168,
              height: 122,
              filter: 'drop-shadow(3px 6px 8px rgba(28,27,23,0.3))',
            }}
          >
            <Slab x={10} y={22} w={116} h={100} color={PAL.kraftHi} r={4} grain={0.6} />
            <Slab x={4} y={8} w={128} h={20} color={PAL.terra} r={4} grain={0.6} />
            {/* Meja saji & mangkuk kertas */}
            <Slab x={18} y={74} w={68} h={48} color={C.wood} r={2} grain={0.6} />
            <div
              style={{
                position: 'absolute',
                left: 28,
                top: 61,
                width: 24,
                height: 13,
                borderRadius: '0 0 12px 12px',
                backgroundColor: C.cream,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 56,
                top: 59,
                width: 22,
                height: 15,
                borderRadius: '3px 3px 8px 8px',
                backgroundColor: PAL.mustard,
              }}
            />
            <BlankClockSign x={90} y={38} shrinkT={trimHoursT} />

            {/* Pedagang warung faceless memakai celemek */}
            <div style={{position: 'absolute', left: 124, top: 38, width: 42, height: 84}}>
              <Figure x={20} y={84} s={0.44} shirt={C.creamLo} />
              <Slab x={12} y={36} w={16} h={26} color={PAL.terra} r={3} />
            </div>
          </div>
        </Boil>
      </PopIn>
      <PaperLabel
        x={964}
        y={132}
        text="warung makan"
        at={378}
        bg={PAL.mustardHi}
        size={21}
        rot={1.2}
        seed="lbl-warung"
      />

      {/* 3. TOKO KELONTONG (pop-up frame 402; satu pekerja di sampingnya ditarik keluar bingkai) */}
      <PopIn at={402} seed="shop-kelontong">
        <Boil seed="shop-kelontong" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 1070,
              top: 164,
              width: 184,
              height: 122,
              filter: 'drop-shadow(3px 6px 8px rgba(28,27,23,0.3))',
            }}
          >
            <Slab x={10} y={22} w={116} h={100} color={C.cream} r={4} grain={0.6} />
            <Slab x={4} y={8} w={128} h={20} color={PAL.mustard} r={4} grain={0.6} />
            {/* Rak kelontong tanpa tulisan/angka */}
            <Slab x={18} y={60} w={66} h={6} color={C.wood} r={2} />
            <Slab x={18} y={90} w={66} h={6} color={C.wood} r={2} />
            <Slab x={22} y={42} w={14} h={18} color={PAL.terra} r={4} />
            <Slab x={42} y={44} w={16} h={16} color={C.sage} r={4} />
            <Slab x={64} y={42} w={14} h={18} color={PAL.mustardHi} r={4} />
            <Slab x={24} y={70} w={22} h={20} color={PAL.kraft} r="8px 8px 3px 3px" />
            <Slab x={52} y={70} w={22} h={20} color={PAL.kraftLo} r="8px 8px 3px 3px" />

            <BlankClockSign x={90} y={38} shrinkT={trimHoursT} />

            {/* Pekerja harian faceless bertas kain/gerobak ditarik keluar bingkai */}
            <div
              style={{
                position: 'absolute',
                left: 124 + pulledWorkerX,
                top: 38,
                width: 48,
                height: 84,
                rotate: `${pulledWorkerTilt}deg`,
                transformOrigin: '50% 100%',
              }}
            >
              <Figure x={20} y={84} s={0.44} shirt={C.heroLo} />
              <Slab x={26} y={56} w={18} h={18} color={C.wood} r={2} />
              <div
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 74,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: C.ink,
                }}
              />
            </div>
          </div>
        </Boil>
      </PopIn>
      <PaperLabel
        x={1135}
        y={132}
        text="toko kelontong"
        at={406}
        bg={C.sageLo}
        color={C.tagText}
        size={21}
        rot={-1.1}
        seed="lbl-kelontong"
      />

      {/* Label aksi paruh akhir [434..521] */}
      <PaperLabel
        x={815}
        y={322}
        text="memangkas jam kerja"
        at={438}
        bg={C.wood}
        color={C.tagText}
        size={22}
        rot={-1.3}
        seed="lbl-jam-kerja"
      />
      <PaperLabel
        x={1060}
        y={322}
        text="memangkas pekerjanya"
        at={474}
        bg={PAL.terraLo}
        color={C.tagText}
        size={22}
        rot={1.2}
        seed="lbl-pekerjanya"
      />
    </>
  );
};

// Garis putus-putus perbandingan tinggi bahu (tanpa angka, bukan sumbu/penggaris)
const ShoulderMeasureLine: React.FC<{at: number; leftShoulderY: number; rightShoulderY: number}> = ({
  at,
  leftShoulderY,
  rightShoulderY,
}) => {
  const f = useCurrentFrame();
  const draw = prog(f, at, at + 28, Easing.out(Easing.cubic));
  if (f < at) return null;

  const x1 = 515;
  const x2 = 775;
  const curX = interpolate(draw, [0, 1], [x1, x2], CLAMP);
  const curY = interpolate(draw, [0, 1], [leftShoulderY, rightShoulderY], CLAMP);

  return (
    <Boil seed="shoulder-measure" amp={0.4} rot={0.05}>
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20}}
      >
        {/* Garis acuan mendatar tipis sejajar bahu tegak */}
        <line
          x1={x1}
          y1={leftShoulderY}
          x2={curX}
          y2={leftShoulderY}
          stroke={PAL.mustardLo}
          strokeWidth={2.5}
          strokeDasharray="6 8"
          opacity={0.55}
        />
        {/* Garis putus-putus utama dari bahu tegak ke bahu bungkuk */}
        <line
          x1={x1}
          y1={leftShoulderY}
          x2={curX}
          y2={curY}
          stroke={PAL.terraLo}
          strokeWidth={4}
          strokeDasharray="11 8"
          strokeLinecap="round"
        />
        <circle cx={x1} cy={leftShoulderY} r={6} fill={PAL.terraLo} />
        {draw > 0.92 ? <circle cx={x2} cy={rightShoulderY} r={6} fill={PAL.terraLo} /> : null}
      </svg>
    </Boil>
  );
};

export const MGE: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak kamera multi-beat yang di-clamp penuh (mundur pada Beat f menampilkan kedua papan berdampingan)
  const camScale = interpolate(
    f,
    [0, 90, 118, 240, 265, 330, 355, 520, 545, 588],
    [1.0, 1.03, 1.12, 1.12, 1.11, 1.11, 1.06, 1.06, 1.0, 1.0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camPanX = interpolate(
    f,
    [0, 92, 120, 240, 266, 330, 355, 520, 545, 588],
    [0, 0, 130, 130, -125, -125, -165, -165, 0, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camPanY = interpolate(
    f,
    [0, 92, 120, 240, 266, 330, 355, 520, 545, 588],
    [0, 0, -10, -10, -10, -10, 28, 28, 0, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Beat a [0..89]: dua papan lantai kraft identik muncul bersebelahan di tengah panggung terbagi dua
  const leftPlankIn = prog(stepFrame(f, 2), 10, 44);
  const rightPlankIn = prog(stepFrame(f, 2), 18, 52);

  // Beat b [107..238]: perusahaan besar sedikit turun lalu tegak lagi (menyerap)
  const absorbDown = prog(f, 120, 146, Easing.out(Easing.quad));
  const absorbUp = prog(f, 148, 182, Easing.inOut(Easing.cubic));
  const largeDipPx = interpolate(absorbDown - absorbUp, [0, 1], [0, 18], CLAMP);

  // Beat c [259..323]: usaha kecil bahunya melesak turun & lututnya menekuk
  const smallSagT = prog(f, 266, 312, Easing.out(Easing.cubic));
  const smallSagDropPx = interpolate(smallSagT, [0, 1], [0, 48], CLAMP);

  // Tinggi papan lantai kraft (ukuran & ketebalan papan TIDAK PERNAH BERUBAH)
  const basePlankTopY = 398;
  const leftPlankTopY = basePlankTopY + largeDipPx;
  const rightPlankTopY = basePlankTopY + smallSagDropPx;

  const leftDropOffset = interpolate(leftPlankIn, [0, 1], [-170, 0], CLAMP);
  const rightDropOffset = interpolate(rightPlankIn, [0, 1], [-170, 0], CLAMP);

  // Koordinat vertikal bahu untuk garis putus-putus Beat f [540..694]
  const leftShoulderY = 446;
  const rightShoulderY = 446 + smallSagDropPx;

  return (
    <AbsoluteFill style={{backgroundColor: PAL.wallLeft, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <AbsoluteFill
          style={{
            transformOrigin: '50% 52%',
            transform: `translate(${camPanX}px, ${camPanY}px) scale(${camScale})`,
          }}
        >
          {/* LAPISAN LATAR: Panggung terbagi dua sisi + benang mustard bertitik */}
          <AbsoluteFill style={{transform: `translateX(${-camPanX * 0.25}px)`}}>
            <Slab x={-120} y={0} w={760} h={720} color={PAL.wallLeft} r={0} grain={0.55} />
            <Slab x={640} y={0} w={760} h={720} color={PAL.wallRight} r={0} grain={0.55} />

            {/* Garis jahitan tengah membagi panggung dua sisi */}
            <div
              style={{
                position: 'absolute',
                left: 639,
                top: 24,
                height: FLOOR_Y - 24,
                width: 0,
                borderLeft: `3px dashed ${PAL.kraftLo}`,
                opacity: 0.55,
              }}
            />

            {/* Benang mustard bertitik melintang sebagai elemen pengikat panggung lantai */}
            <div
              style={{
                position: 'absolute',
                left: -120,
                right: -120,
                top: 356,
                height: 0,
                borderTop: `3px dashed ${PAL.mustard}`,
                opacity: 0.5,
              }}
            />

            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 44%, rgba(255,248,232,0.16) 0%, rgba(28,27,23,0) 52%, rgba(28,27,23,0.24) 100%)',
              }}
            />
          </AbsoluteFill>

          {/* Siluet pabrik besar (kiri, Beat b) & kios kecil (kanan, Beat c) */}
          <FactorySilhouette at={107} />
          <KioskSilhouette at={259} />

          {/* Tiga etalase pop-up usaha kecil + pemangkasan jam & pekerja (Beat d & e) */}
          <SmallBusinessStorefronts />

          {/* LANTAI PANGGUNG KAYU COKELAT TUA */}
          <Slab x={-140} y={FLOOR_Y} w={1560} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
          <div
            style={{
              position: 'absolute',
              left: -140,
              right: -140,
              top: FLOOR_Y + 38,
              height: 3,
              backgroundColor: C.floorLo,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -140,
              right: -140,
              top: FLOOR_Y + 78,
              height: 3,
              backgroundColor: C.floorLo,
              opacity: 0.85,
            }}
          />
          <Slab x={-140} y={FLOOR_Y - 20} w={1560} h={22} color={C.woodLo} r={0} grain={0.6} />

          {/* Figur pemberi kerja kiri (Beat b: berbahu lebar, menyerap beban) */}
          <SlideIn at={107} dy={140} dur={16}>
            <EmployerActor
              x={465}
              variant="large"
              absorbDipPx={largeDipPx}
              sagDropPx={0}
              seed="emp-large"
            />
          </SlideIn>

          {/* Pintu kecil & mesin kertas mungil di sisi perusahaan besar (Beat b) */}
          <FactoryOptionDoor at={165} />

          {/* Figur pemberi kerja kanan (Beat c: kecil & ramping, bahu melesak & lutut menekuk) */}
          <SlideIn at={259} dy={140} dur={16}>
            <EmployerActor
              x={815}
              variant="small"
              absorbDipPx={0}
              sagDropPx={smallSagDropPx}
              seed="emp-small"
            />
          </SlideIn>

          {/* DUA PAPAN LANTAI KRAFT IDENTIK (Beat a: muncul bersebelahan di tengah) */}
          {leftPlankIn > 0.01 ? (
            <KraftPlank cx={465} topY={leftPlankTopY + leftDropOffset} seed="plank-left" />
          ) : null}
          {rightPlankIn > 0.01 ? (
            <KraftPlank cx={815} topY={rightPlankTopY + rightDropOffset} seed="plank-right" />
          ) : null}

          {/* Label utama sisi kiri & sisi kanan */}
          <PaperLabel
            x={335}
            y={64}
            text="Perusahaan besar"
            at={112}
            bg={PAL.oliveDark}
            color={C.tagText}
            size={27}
            rot={-1.4}
            seed="lbl-perusahaan-besar"
          />
          <PaperLabel
            x={955}
            y={64}
            text="Usaha kecil"
            at={264}
            bg={PAL.terraLo}
            color={C.tagText}
            size={27}
            rot={1.3}
            seed="lbl-usaha-kecil"
          />

          {/* BEAT F [540..694]: Garis putus-putus mengukur bahu & label akhir */}
          <ShoulderMeasureLine at={572} leftShoulderY={leftShoulderY} rightShoulderY={rightShoulderY} />
          <PaperLabel
            x={640}
            y={384}
            text="Lantai yang sama"
            at={562}
            bg={C.wood}
            color={C.tagText}
            size={22}
            rot={-1.0}
            seed="lbl-lantai-sama"
          />
          <PaperLabel
            x={640}
            y={516}
            text="bahu"
            at={596}
            bg={C.tag}
            color={C.tagText}
            size={24}
            rot={1.1}
            seed="lbl-bahu"
          />

          {/* Tirai sayap panggung teater kertas di tepi kiri & kanan */}
          <Paper lift={8}>
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