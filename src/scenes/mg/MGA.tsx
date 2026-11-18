// Adegan MG-A "Lantai dan Harga Pasar": papan lantai kraft (upah minimum) bergerak terhadap benang mustard harga pasar.
// Menampilkan batas bawah negara, tawar-menawar dua figur faceless, efek patokan di bawah vs di atas harga pasar, hingga terbelah dua arah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';

export const MGA_DUR = 963;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet kertas hangat sesuai aturan visual bersama (krem, kraft, mustard, sage, terakota, cokelat tua)
const PAL = {
  wall: C.creamHi,
  kraft: '#C79B68',
  kraftHi: '#D8B182',
  kraftLo: '#9B7143',
  kraftEdge: '#7A552E',
  mustard: '#DDA334',
  mustardGlow: '#F2C65A',
  mustardLo: '#A8761D',
  sageTag: '#677B5D',
  sageTint: 'rgba(126, 140, 120, 0.18)',
  terra: '#9A5A42',
  terraLo: '#76412E',
  terraTint: 'rgba(154, 90, 66, 0.18)',
  helmet: '#E1A838',
  helmetLo: '#B4801E',
  creamTag: '#F4ECE0',
};

// Label kertas sobek yang hanya menampilkan frasa dari daftar "Teks boleh tampil" MG-A
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  outAt?: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed?: string;
  tape?: boolean;
}> = ({
  x,
  y,
  text,
  at,
  outAt,
  bg = PAL.creamTag,
  color = C.ink,
  size = 27,
  rot = -1.2,
  seed = 'lbl',
  tape = true,
}) => {
  const f = useCurrentFrame();
  const exitOpacity =
    outAt !== undefined
      ? interpolate(f, [outAt, outAt + 12], [1, 0], CLAMP)
      : 1;
  const exitY =
    outAt !== undefined
      ? interpolate(f, [outAt, outAt + 12], [0, -12], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  if (f < at || exitOpacity <= 0.01) return null;

  // PopIn/Boil HARUS di luar div berposisi: bila di dalam, inset:0 membuat
  // lebar div luar menciut sehingga kotak label sempit dan teks meluber.
  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y + exitY,
            translate: '-50% -50%',
            opacity: exitOpacity,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              padding: '10px 20px 12px',
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
            {tape ? (
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: '50%',
                  width: 54,
                  height: 16,
                  translate: '-50% 0',
                  rotate: `${-rot * 1.4}deg`,
                  backgroundColor: C.tape,
                  opacity: 0.85,
                  filter: 'url(#torn)',
                }}
              />
            ) : null}
          </div>
        </div>
      </Boil>
    </PopIn>
  );
};

// Label upah kertas polos menggantung di benang (hanya garis-garis tulisan abstrak, tanpa angka/nominal)
const WageTag: React.FC<{
  x: number;
  anchorY: number;
  tagY: number;
  tilt: number;
  tint: string;
}> = ({x, anchorY, tagY, tilt, tint}) => {
  const cordTop = Math.min(anchorY, tagY - 24);
  const cordBottom = Math.max(anchorY, tagY - 24);
  const cordH = Math.max(8, cordBottom - cordTop);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -1.5,
          top: cordTop,
          width: 3,
          height: cordH,
          backgroundColor: C.inkSoft,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: tagY,
          width: 64,
          height: 44,
          translate: '-50% -50%',
          rotate: `${tilt}deg`,
          backgroundColor: tint,
          borderRadius: 5,
          border: `2px solid ${C.inkSoft}`,
          boxShadow: '2px 5px 8px rgba(28,27,23,0.28)',
          filter: 'url(#torn)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 5,
            width: 7,
            height: 7,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 17,
            width: 38,
            height: 4,
            borderRadius: 2,
            backgroundColor: C.inkSoft,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 25,
            width: 30,
            height: 4,
            borderRadius: 2,
            backgroundColor: PAL.mustardLo,
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 17,
            top: 33,
            width: 22,
            height: 3,
            borderRadius: 2,
            backgroundColor: C.inkSoft,
            opacity: 0.45,
          }}
        />
      </div>
    </div>
  );
};

// Tangan kertas besar tanpa wajah & tanpa tubuh (simbol negara menurunkan papan lantai di beat b)
const StatePaperHand: React.FC<{yOffset: number; pressDepth: number}> = ({
  yOffset,
  pressDepth,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 640,
      top: yOffset + pressDepth,
      width: 320,
      height: 340,
      translate: '-50% 0',
      pointerEvents: 'none',
      zIndex: 20,
    }}
  >
    <Paper lift={10}>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: -90,
          width: 100,
          height: 220,
          backgroundColor: PAL.kraftHi,
          borderLeft: `3px solid ${C.inkSoft}`,
          borderRight: `3px solid ${C.inkSoft}`,
          filter: 'url(#torn)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 98,
          top: 118,
          width: 124,
          height: 32,
          borderRadius: 6,
          backgroundColor: C.inkSoft,
          boxShadow: '0 4px 8px rgba(28,27,23,0.34)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 148,
          width: 144,
          height: 114,
          borderRadius: '18px 18px 26px 26px',
          backgroundColor: C.cream,
          border: `3px solid ${C.inkSoft}`,
          filter: 'url(#torn)',
          boxShadow: '3px 8px 14px rgba(28,27,23,0.32)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 186,
          width: 46,
          height: 72,
          rotate: '26deg',
          borderRadius: 16,
          backgroundColor: C.creamLo,
          border: `3px solid ${C.inkSoft}`,
        }}
      />
      {[96, 127, 158, 189].map((fx: number, i: number) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: fx,
            top: 244,
            width: 26,
            height: i === 1 || i === 2 ? 64 : 54,
            borderRadius: '8px 8px 14px 14px',
            backgroundColor: i % 2 === 0 ? C.cream : C.creamLo,
            border: `2.5px solid ${C.inkSoft}`,
            boxShadow: '2px 4px 6px rgba(28,27,23,0.26)',
          }}
        />
      ))}
    </Paper>
  </div>
);

// Figur faceless menggunakan <Figure> bawaan mgkit + atribut peran (jas bata / helm kuning) & postur emosi
const StageActor: React.FC<{
  x: number;
  y: number;
  role: 'employer' | 'worker';
  facing: 1 | -1;
  shoulderDrop: number;
  leanDeg: number;
}> = ({x, y, role, facing, shoulderDrop, leanDeg}) => {
  const isEmployer = role === 'employer';
  const scaleY = 1 - shoulderDrop * 0.045;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 98,
        height: 205,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        rotate: `${leanDeg}deg`,
        scale: `1 ${scaleY}`,
        pointerEvents: 'none',
      }}
    >
      {/* Figur faceless standar mgkit */}
      <Figure
        x={49}
        y={205}
        s={1.08}
        shirt={isEmployer ? ROOM.terracotta : ROOM.sage}
      />

      {/* Atribut kostum tanpa wajah: kerah jas bata (pemberi kerja) atau helm kuning (pencari kerja) */}
      {isEmployer ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 68,
            width: 22,
            height: 30,
            translate: '-50% 0',
            backgroundColor: PAL.creamTag,
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -4,
            width: 66,
            height: 28,
            translate: '-50% 0',
            borderRadius: '34px 34px 6px 6px',
            backgroundColor: PAL.helmet,
            border: `2.5px solid ${C.inkSoft}`,
            boxShadow: '0 3px 5px rgba(28,27,23,0.25)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: facing === 1 ? -4 : -8,
              bottom: -3,
              width: 74,
              height: 7,
              borderRadius: 4,
              backgroundColor: PAL.helmetLo,
              border: `1.5px solid ${C.inkSoft}`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Papan lantai kraft (= upah minimum): tebal, tepi atas berjahit garis putus-putus, terbelah dua panah pada beat g
const KraftPlank: React.FC<{
  y: number;
  opacity: number;
  splitGap: number;
  arrowProgress: number;
  showStamp: boolean;
  stampScale: number;
}> = ({y, opacity, splitGap, arrowProgress, showStamp, stampScale}) => {
  if (opacity <= 0.01) return null;

  const halfW = 310;
  const plankH = 44;
  const arrowTip = Math.round(42 * arrowProgress);

  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: y,
        translate: '-50% -50%',
        opacity,
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      <Boil seed="kraft-plank" amp={0.4} rot={0.05}>
        <div style={{position: 'relative', width: halfW * 2, height: plankH + 14}}>
          {/* Paruh kiri papan kraft (menjadi panah ke kiri di beat g) */}
          <div
            style={{
              position: 'absolute',
              right: halfW + splitGap / 2,
              top: 0,
              width: halfW + arrowTip,
              height: plankH + 10,
              filter: 'drop-shadow(2px 6px 9px rgba(28,27,23,0.34))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: arrowTip,
                top: 8,
                width: halfW,
                height: plankH,
                backgroundColor: PAL.kraftEdge,
                borderRadius: '4px 0 0 4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: arrowTip,
                top: 0,
                width: halfW,
                height: plankH,
                backgroundColor: PAL.kraft,
                borderTop: `3px dashed ${C.ink}`,
                borderBottom: `2px solid ${PAL.kraftEdge}`,
                borderLeft: arrowProgress > 0.1 ? 'none' : `3px solid ${PAL.kraftEdge}`,
                boxSizing: 'border-box',
              }}
            />
            {arrowProgress > 0.02 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -11,
                  width: arrowTip + 4,
                  height: plankH + 22,
                  backgroundColor: PAL.kraft,
                  clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
                }}
              />
            ) : null}

            {/* Label daftar: "Upah minimum" menempel di papan */}
            <div
              style={{
                position: 'absolute',
                left: arrowTip + 22,
                top: 6,
                backgroundColor: PAL.creamTag,
                padding: '4px 13px 5px',
                fontFamily: FONT.label,
                fontWeight: 800,
                fontSize: 20,
                color: C.ink,
                whiteSpace: 'nowrap',
                border: `1.5px solid ${C.inkSoft}`,
                rotate: '-0.8deg',
                filter: 'url(#torn)',
              }}
            >
              Upah minimum
            </div>
          </div>

          {/* Paruh kanan papan kraft (menjadi panah ke kanan di beat g) */}
          <div
            style={{
              position: 'absolute',
              left: halfW + splitGap / 2,
              top: 0,
              width: halfW + arrowTip,
              height: plankH + 10,
              filter: 'drop-shadow(2px 6px 9px rgba(28,27,23,0.34))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                width: halfW,
                height: plankH,
                backgroundColor: PAL.kraftEdge,
                borderRadius: '0 4px 4px 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: halfW,
                height: plankH,
                backgroundColor: PAL.kraft,
                borderTop: `3px dashed ${C.ink}`,
                borderBottom: `2px solid ${PAL.kraftEdge}`,
                borderRight: arrowProgress > 0.1 ? 'none' : `3px solid ${PAL.kraftEdge}`,
                boxSizing: 'border-box',
              }}
            />
            {arrowProgress > 0.02 ? (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -11,
                  width: arrowTip + 4,
                  height: plankH + 22,
                  backgroundColor: PAL.kraft,
                  clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                }}
              />
            ) : null}

            {/* Cap tinta kertas dari daftar: "Batas bawah" */}
            {showStamp ? (
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  top: 5,
                  scale: `${stampScale}`,
                  rotate: '1.4deg',
                  padding: '3px 12px 4px',
                  border: `2.5px solid ${PAL.terra}`,
                  borderRadius: 4,
                  backgroundColor: 'rgba(244, 236, 224, 0.84)',
                  fontFamily: FONT.banner,
                  fontSize: 19,
                  letterSpacing: '0.02em',
                  color: PAL.terra,
                  whiteSpace: 'nowrap',
                  filter: 'url(#torn)',
                }}
              >
                Batas bawah
              </div>
            ) : null}
          </div>
        </div>
      </Boil>
    </div>
  );
};

export const MGA: React.FC = () => {
  const rawF = useCurrentFrame();
  // Kuantisasi frame ringan (15fps) untuk kesan stop-motion potongan kertas yang tenang
  const f = Math.floor(rawF / 2) * 2;

  // Jendela beat (frame relatif terhadap awal adegan, 0..963):
  // a: 0–98   | b: 113–228 | c: 246–359
  // d: 449–574 | e: 592–769 | f: 788–887 | g: 902–963

  // Beat a (0–98): Tirai terakota terangkat, benang mustard melintang, label upah menggantung
  const curtainLift = interpolate(f, [0, 32], [0, -690], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const threadDraw = interpolate(f, [16, 54], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const tagsAppear = interpolate(f, [34, 70], [0, 1], CLAMP);

  // Beat b (113–228): Tangan kertas besar menurunkan papan lantai kraft + menekan cap "Batas bawah"
  const handEnter = interpolate(f, [113, 148], [-360, 118], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const handPress =
    interpolate(f, [156, 170], [0, 18], {...CLAMP, easing: Easing.out(Easing.quad)}) -
    interpolate(f, [170, 186], [0, 18], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const handExit = interpolate(f, [192, 224], [0, -520], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const handY = handEnter + handExit;

  const stampVisible = f >= 164;
  const stampPop = interpolate(f, [164, 174], [1.32, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.8)),
  });

  // Gerak vertikal papan lantai kraft:
  // b..c: y = 405 | d: turun keluar ke 760 | e: masuk tenang ke 455 | f..g: naik melewati garis hantu (330) ke 246
  const plankEnterB = interpolate(f, [113, 148], [-80, 405], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const plankDropD = interpolate(f, [449, 476], [0, 365], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const plankEnterE = interpolate(f, [592, 634], [760, 455], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const plankRiseF = interpolate(f, [788, 856], [455, 246], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  let plankY = plankEnterB + plankDropD;
  if (f >= 592 && f < 788) plankY = plankEnterE;
  if (f >= 788) plankY = plankRiseF;

  const plankOpacity =
    f < 113
      ? 0
      : f < 476
        ? interpolate(f, [113, 126], [0, 1], CLAMP) *
          interpolate(f, [462, 476], [1, 0], CLAMP)
        : f < 592
          ? 0
          : interpolate(f, [592, 608], [0, 1], CLAMP);

  // Beat c (246–359): Label bawah terpental balik di papan; label atas meluncur bebas di benang
  const bounceCycle = interpolate(f, [248, 276, 304, 334], [0, 1, 0.25, 0], CLAMP);
  const glideCycle = interpolate(f, [252, 355], [0, 1], CLAMP);

  // Beat d (449–574): Dua figur berhadapan, tawar-menawar makin pelan, harga pasar terbentuk + garis hantu tertinggal
  const actorsEnter = interpolate(f, [464, 496], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const bargainProg = interpolate(f, [486, 548], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const bargainDamp = Math.pow(1 - bargainProg, 1.8);
  const bargainWave = Math.sin(bargainProg * Math.PI * 5) * bargainDamp;

  const ghostLineOpacity = interpolate(f, [544, 566], [0, 0.85], CLAMP);
  const threadGlow =
    interpolate(f, [542, 562], [0, 1], CLAMP) *
    interpolate(f, [574, 594], [1, 0.25], CLAMP);

  // Beat e (592–769): Papan di bawah garis hantu -> tidak ada yang berubah, kedua figur mengendurkan bahu
  const relaxShoulders =
    interpolate(f, [620, 652], [0, 1], CLAMP) *
    interpolate(f, [788, 810], [1, 0.15], CLAMP);

  // Beat f (788–887): Papan naik melewati garis hantu -> benang melengkung, jalur arsir kertas terbentuk, figur mundur setengah langkah
  const stepBackProg = interpolate(f, [816, 856], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const leftActorX =
    interpolate(actorsEnter, [0, 1], [-80, 210], CLAMP) - stepBackProg * 44;
  const rightActorX =
    interpolate(actorsEnter, [0, 1], [1360, 1070], CLAMP) + stepBackProg * 44;

  // Beat g (902–963): Papan terbelah menjadi 2 panah ke kiri dan kanan, celah melebar untuk MG-B
  const splitProg = interpolate(f, [902, 954], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const splitGap = Math.round(splitProg * 160);
  const arrowProgress = interpolate(f, [902, 932], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const stageCreaseW = Math.round(splitProg * 24);

  // Koordinat benang mustard bertitik & 5 label upah tanpa nominal
  const pinLeftX = 290;
  const pinRightX = 990;
  const baseThreadY = 330;

  const pushAboveGhost = Math.max(0, baseThreadY - plankY);
  const threadPeakY = baseThreadY - pushAboveGhost * 1.15;

  const getThreadYAt = (xPos: number): number => {
    const t = Math.max(0, Math.min(1, (xPos - pinLeftX) / (pinRightX - pinLeftX)));
    const ctrlY = 2 * threadPeakY - baseThreadY;
    return (1 - t) * (1 - t) * baseThreadY + 2 * (1 - t) * t * ctrlY + t * t * baseThreadY;
  };

  const baseTagXs = [390, 515, 640, 765, 890];
  const initialOffsets = [95, -45, 16, 105, -50];

  const tags = baseTagXs.map((bx: number, idx: number) => {
    const isUpper = initialOffsets[idx] < 30;
    const glideDx =
      f >= 246 && f < 449 && isUpper
        ? Math.sin(glideCycle * Math.PI * 2 + idx * 1.3) * 24
        : 0;
    const bargainDx =
      f >= 475 && f < 560 ? bargainWave * (44 - Math.abs(idx - 2) * 8) : 0;
    const splitShift =
      splitProg > 0 ? (idx < 2 ? -splitProg * 40 : idx > 2 ? splitProg * 40 : 0) : 0;

    const x = bx + glideDx + bargainDx + splitShift;
    const threadY = getThreadYAt(x);

    const bounceOffset =
      !isUpper && f >= 246 && f < 449
        ? -bounceCycle * 52 + Math.sin(bounceCycle * Math.PI) * 14
        : 0;
    const yPhaseABC = baseThreadY + initialOffsets[idx] + bounceOffset;

    const bargainDy =
      f >= 475 && f < 560
        ? Math.cos(bargainProg * Math.PI * 4 + idx) * bargainDamp * (idx % 2 === 0 ? -32 : 32)
        : 0;
    const yPhaseDE = baseThreadY + bargainDy;

    const unifyT = interpolate(f, [475, 548], [0, 1], CLAMP);
    let tagY = interpolate(unifyT, [0, 1], [yPhaseABC, yPhaseDE], CLAMP);

    const staggerLift = idx * 4;
    const pushedY = plankY - 34 - staggerLift * 0.25;
    if (f >= 788 && pushedY < tagY) {
      tagY = pushedY;
    }

    const idleSway = Math.sin((f + idx * 17) * 0.09) * (f >= 548 && f < 788 ? 1.2 : 2.4);

    return {
      x,
      anchorY: threadY,
      tagY,
      tilt: idleSway + bargainDx * 0.14,
    };
  });

  // Jalur arsir kertas di antara garis hantu (y=330) dan papan kraft saat papan naik di atasnya
  const hatchTop = Math.min(baseThreadY, plankY + 22);
  const hatchBottom = baseThreadY;
  const hatchH = f >= 788 ? Math.max(0, hatchBottom - hatchTop) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: PAL.wall}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={MGA_DUR}
          yaw={14}
          push={1.08}
          focus={0.5}
          depth={680}
          origin={[640, 500]}
        >
          {/* LAPISAN 0: Dinding teater kertas krem hangat + garis hantu + jalur arsir + belahan panggung */}
          <Depth z={0} cover>
            <Slab x={0} y={0} w={1280} h={720} color={PAL.wall} r={0} grain={0.55} />

            {splitProg > 0.01 ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 640 - stageCreaseW / 2,
                    height: FLOOR_Y,
                    backgroundColor: PAL.sageTint,
                    opacity: splitProg,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: 640 - stageCreaseW / 2,
                    height: FLOOR_Y,
                    backgroundColor: PAL.terraTint,
                    opacity: splitProg,
                  }}
                />
              </>
            ) : null}

            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(255,248,232,0.22) 0%, rgba(28,27,23,0) 52%, rgba(28,27,23,0.26) 100%)',
              }}
            />

            {/* Garis hantu bertitik dari posisi harga pasar beat d */}
            {ghostLineOpacity > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: pinLeftX,
                  top: baseThreadY,
                  width: pinRightX - pinLeftX,
                  height: 0,
                  borderTop: `3px dashed ${C.inkSoft}`,
                  opacity: ghostLineOpacity * 0.55,
                }}
              />
            ) : null}

            {/* Jalur arsir kertas ketika papan kraft melampaui garis hantu di beat f */}
            {hatchH > 2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 330,
                  top: hatchTop,
                  width: 620,
                  height: hatchH,
                  backgroundColor: 'rgba(154, 90, 66, 0.14)',
                  borderLeft: `2px dashed ${PAL.terra}`,
                  borderRight: `2px dashed ${PAL.terra}`,
                  backgroundImage: `repeating-linear-gradient(-45deg, ${PAL.terra} 0px, ${PAL.terra} 3px, transparent 3px, transparent 14px)`,
                  opacity: 0.72,
                }}
              />
            ) : null}

            {/* Celah belahan panggung vertikal untuk MG-B di beat g */}
            {stageCreaseW > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: 0,
                  width: stageCreaseW,
                  height: 720,
                  translate: '-50% 0',
                  backgroundColor: C.ink,
                  boxShadow: '0 0 18px rgba(28,27,23,0.45)',
                }}
              />
            ) : null}
          </Depth>

          {/* LAPISAN 0.5: Lantai panggung kayu, benang mustard bertitik, label upah, papan kraft & tokoh */}
          <Depth z={0.5}>
            <Slab
              x={-40}
              y={FLOOR_Y}
              w={1360}
              h={720 - FLOOR_Y + 40}
              color={C.floor}
              r={0}
              grain={0.6}
            />
            <div
              style={{
                position: 'absolute',
                left: -40,
                right: -40,
                top: FLOOR_Y + 42,
                height: 3,
                backgroundColor: C.floorLo,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -40,
                right: -40,
                top: FLOOR_Y + 84,
                height: 3,
                backgroundColor: C.floorLo,
                opacity: 0.85,
              }}
            />
            <Slab
              x={-40}
              y={FLOOR_Y - 22}
              w={1360}
              h={26}
              color={C.woodLo}
              shade={C.floorLo}
              shadeH={0.35}
              r={0}
            />

            {/* Dua pasak kuningan penahan benang mustard */}
            {[pinLeftX, pinRightX].map((px: number, i: number) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: px,
                  top: baseThreadY,
                  width: 22,
                  height: 22,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  backgroundColor: C.brass,
                  border: `3px solid ${C.ink}`,
                  boxShadow: '2px 4px 6px rgba(28,27,23,0.35)',
                  opacity: threadDraw > 0.05 ? 1 : 0,
                  zIndex: 12,
                }}
              />
            ))}

            {/* Benang mustard bertitik */}
            <svg
              width={1280}
              height={720}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'visible',
                pointerEvents: 'none',
                zIndex: 11,
              }}
            >
              {threadGlow > 0.02 ? (
                <path
                  d={`M ${pinLeftX} ${baseThreadY} Q 640 ${2 * threadPeakY - baseThreadY} ${pinRightX} ${baseThreadY}`}
                  fill="none"
                  stroke={PAL.mustardGlow}
                  strokeWidth={16}
                  strokeLinecap="round"
                  opacity={threadGlow * 0.55}
                />
              ) : null}
              <path
                d={`M ${pinLeftX} ${baseThreadY} Q 640 ${2 * threadPeakY - baseThreadY} ${pinRightX} ${baseThreadY}`}
                fill="none"
                stroke={PAL.mustard}
                strokeWidth={5}
                strokeDasharray="11 8"
                strokeLinecap="round"
                pathLength={100}
                strokeDashoffset={100 * (1 - threadDraw)}
              />
            </svg>

            {/* 5 label upah kertas tanpa nominal */}
            <div style={{opacity: tagsAppear, zIndex: 13}}>
              {tags.map((tg, i: number) => (
                <WageTag
                  key={i}
                  x={tg.x}
                  anchorY={tg.anchorY}
                  tagY={tg.tagY}
                  tilt={tg.tilt}
                  tint={i % 2 === 0 ? PAL.creamTag : C.cream}
                />
              ))}
            </div>

            {/* Papan lantai kraft (= upah minimum) */}
            <KraftPlank
              y={plankY}
              opacity={plankOpacity}
              splitGap={splitGap}
              arrowProgress={arrowProgress}
              showStamp={stampVisible}
              stampScale={stampPop}
            />

            {/* Tangan kertas besar tanpa wajah/tubuh menyorongkan papan lantai pada beat b */}
            {f >= 113 && f <= 228 ? (
              <StatePaperHand yOffset={handY} pressDepth={handPress} />
            ) : null}

            {/* Dua figur faceless: pemberi kerja berjas bata & pencari kerja berhelm kuning */}
            {actorsEnter > 0.01 ? (
              <>
                <StageActor
                  x={leftActorX}
                  y={FLOOR_Y}
                  role="employer"
                  facing={1}
                  shoulderDrop={relaxShoulders}
                  leanDeg={bargainWave * 3.5 - stepBackProg * 4}
                />
                <StageActor
                  x={rightActorX}
                  y={FLOOR_Y}
                  role="worker"
                  facing={-1}
                  shoulderDrop={relaxShoulders}
                  leanDeg={bargainWave * 3.5 + stepBackProg * 4}
                />
              </>
            ) : null}

            {/* LABEL TEKS LAYAR — HANYA FRASA PERSIS DARI DAFTAR "TEKS BOLEH TAMPIL" MG-A */}
            <PaperLabel
              x={350}
              y={78}
              text="Upah minimum"
              at={46}
              outAt={444}
              bg={PAL.kraftHi}
              size={27}
              rot={-1.4}
              seed="lbl-um"
            />
            <PaperLabel
              x={930}
              y={78}
              text="tenaga kerja"
              at={62}
              outAt={444}
              bg={PAL.creamTag}
              size={27}
              rot={1.3}
              seed="lbl-tk"
            />

            <PaperLabel
              x={640}
              y={502}
              text="Di bawah batas itu, tidak boleh"
              at={254}
              outAt={444}
              bg={PAL.terra}
              color={C.tagText}
              size={26}
              rot={-1}
              seed="lbl-bawah"
            />
            <PaperLabel
              x={640}
              y={174}
              text="Di atasnya, silakan"
              at={296}
              outAt={444}
              bg={PAL.sageTag}
              color={C.tagText}
              size={26}
              rot={1.2}
              seed="lbl-atas"
            />

            <PaperLabel
              x={leftActorX}
              y={620}
              text="pemberi kerja"
              at={482}
              bg={PAL.creamTag}
              size={22}
              rot={-0.8}
              seed="lbl-pk1"
              tape={false}
            />
            <PaperLabel
              x={rightActorX}
              y={620}
              text="pencari kerja"
              at={490}
              bg={PAL.creamTag}
              size={22}
              rot={0.8}
              seed="lbl-pk2"
              tape={false}
            />

            <PaperLabel
              x={640}
              y={82}
              text="tawar-menawar"
              at={496}
              outAt={584}
              bg={PAL.mustardGlow}
              size={27}
              rot={-1}
              seed="lbl-tm"
            />

            <PaperLabel
              x={640}
              y={82}
              text="tidak ada yang berubah"
              at={612}
              outAt={780}
              bg={PAL.creamTag}
              size={27}
              rot={0.8}
              seed="lbl-tdk"
            />

            <PaperLabel
              x={640}
              y={82}
              text="barulah ia bekerja"
              at={810}
              outAt={896}
              bg={PAL.terra}
              color={C.tagText}
              size={28}
              rot={-1}
              seed="lbl-bekerja"
            />

            <PaperLabel
              x={640}
              y={262}
              text="dua arah"
              at={910}
              bg={PAL.mustardGlow}
              size={30}
              rot={0}
              seed="lbl-duaarah"
            />
          </Depth>

          {/* LAPISAN 1: Bingkai sayap panggung & tirai kertas terakota pembuka */}
          <Depth z={1}>
            <Paper lift={8}>
              <div
                style={{
                  position: 'absolute',
                  left: -18,
                  top: -20,
                  width: 90,
                  height: 760,
                  backgroundColor: PAL.terra,
                  borderRight: `4px solid ${PAL.terraLo}`,
                  boxShadow: '6px 0 16px rgba(28,27,23,0.36)',
                  filter: 'url(#torn)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -18,
                  top: -20,
                  width: 90,
                  height: 760,
                  backgroundColor: PAL.terra,
                  borderLeft: `4px solid ${PAL.terraLo}`,
                  boxShadow: '-6px 0 16px rgba(28,27,23,0.36)',
                  filter: 'url(#torn)',
                }}
              />
            </Paper>

            {curtainLift > -685 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: curtainLift,
                  width: 1280,
                  height: 680,
                  backgroundColor: PAL.terra,
                  borderBottom: `10px solid ${PAL.mustard}`,
                  boxShadow: '0 12px 24px rgba(28,27,23,0.44)',
                  zIndex: 40,
                }}
              >
                {Array.from({length: 12}).map((_, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: idx * 108,
                      top: 0,
                      width: 54,
                      height: '100%',
                      backgroundColor: PAL.terraLo,
                      opacity: 0.28,
                    }}
                  />
                ))}
              </div>
            ) : null}
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
