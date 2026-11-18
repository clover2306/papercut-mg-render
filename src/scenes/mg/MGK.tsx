// Adegan MG-K: Panel Tiga Kenop di atas Panggung Lantai (tinggi lantai, kecepatan naik, dan beban akibat).
// Visual potongan kertas tanpa wajah dan tanpa angka: tiga kenop zona sage/terakota, pelindung kraft, dan rel slip gaji.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, Disc, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {FLOOR_Y} from './mgkit';

export const MGK_DUR = 728;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PAL = {
  kraft: '#C8A474',
  kraftHi: '#DFBE92',
  kraftLo: '#9E7B4F',
  mustard: '#D9A441',
  mustardHi: '#F0C362',
  sage: '#7E9476',
  sageHi: '#9BB092',
  sageLo: '#5D7057',
  terra: '#C9573C',
  terraHi: '#E07256',
  terraLo: '#943B25',
   cocoa: '#3B281D',
  cocoaLo: '#261911',
  creamPaper: '#EFE6D5',
};

// Stepped stop-motion helper (tahan 2 frame agar terasa animasi kertas)
const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Label kertas dengan tepi sobekan (#torn) dan lakban kecil
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  size?: number;
  bg?: string;
  color?: string;
  rot?: number;
  seed?: string;
  tape?: boolean;
  opacity?: number;
}> = ({
  x,
  y,
  text,
  size = 32,
  bg = PAL.creamPaper,
  color = C.ink,
  rot = -1.2,
  seed = 'lbl',
  tape = true,
  opacity = 1,
}) => {
  if (opacity <= 0.01) return null;
  return (
    <Boil seed={seed} amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          translate: '-50% -50%',
          rotate: `${rot}deg`,
          opacity,
        }}
      >
        <div
          style={{
            backgroundColor: bg,
            padding: `${Math.round(size * 0.34)}px ${Math.round(size * 0.68)}px`,
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.08,
            color,
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(28,20,12,0.38))',
          }}
        >
          {text}
        </div>
        {tape ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: -18,
                top: -10,
                width: 56,
                height: 22,
                background: C.tape,
                rotate: '-28deg',
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -18,
                top: -10,
                width: 56,
                height: 22,
                background: C.tape,
                rotate: '28deg',
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
          </>
        ) : null}
      </div>
    </Boil>
  );
};

// Papan Lantai Kraft: upah minimum (tebal, tepi atas berjahit garis putus-putus)
const KraftPlank: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  rot?: number;
}> = ({x, y, w, h = 28, rot = 0}) => (
  <Paper lift={5}>
    <Slab
      x={x}
      y={y}
      w={w}
      h={h}
      color={PAL.kraft}
      hi={PAL.kraftHi}
      hiH={0.22}
      shade={PAL.kraftLo}
      shadeH={0.32}
      r={4}
      rot={rot}
    >
      <div
        style={{
          position: 'absolute',
          left: 10,
          right: 10,
          top: 5,
          height: 0,
          borderTop: `3px dashed ${PAL.cocoa}`,
          opacity: 0.72,
        }}
      />
    </Slab>
  </Paper>
);

// Benang Mustard Bertitik: nilai yang dihasilkan pekerja / harga pasar
const MustardThread: React.FC<{
  x1: number;
  x2: number;
  y: number;
  sag?: number;
}> = ({x1, x2, y, sag = 8}) => {
  const w = Math.max(10, x2 - x1);
  return (
    <svg
      width={w}
      height={60}
      viewBox={`0 0 ${w} 60`}
      style={{
        position: 'absolute',
        left: x1,
        top: y - 30,
        overflow: 'visible',
        filter: 'drop-shadow(1px 3px 3px rgba(0,0,0,0.3))',
      }}
    >
      <path
        d={`M 0 30 Q ${w / 2} ${30 + sag} ${w} 30`}
        fill="none"
        stroke={PAL.mustard}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
      <path
        d={`M 0 30 Q ${w / 2} ${30 + sag} ${w} 30`}
        fill="none"
        stroke={PAL.mustardHi}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.75}
      />
      <circle cx={0} cy={30} r={6} fill={PAL.kraftLo} />
      <circle cx={w} cy={30} r={6} fill={PAL.kraftLo} />
    </svg>
  );
};

// Figur Kertas Tanpa Wajah (Faceless): peran dibedakan lewat atribut & postur bungkuk/tegak
type RoleKind = 'worker' | 'employer' | 'vendor' | 'daily';

const RoleFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  role: RoleKind;
  crouch?: number; // 0 = tegak, 1 = membungkuk menahan beban
  lean?: number;
}> = ({x, y, s = 1, role, crouch = 0, lean = 0}) => {
  const bodyColor =
    role === 'worker'
      ? PAL.sageLo
      : role === 'employer'
        ? PAL.terra
        : role === 'vendor'
          ? PAL.kraft
          : ROOM.khaki;

  const headY = crouch * 18 * s;
  const torsoY = (58 + crouch * 14) * s;
  const torsoH = (82 - crouch * 12) * s;
  const bodyRot = lean + crouch * -12;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 92 * s,
        height: 190 * s,
        translate: '-50% -100%',
      }}
    >
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: (140 + crouch * 4) * s,
          width: 22 * s,
          height: (48 - crouch * 4) * s,
          translate: '-115% 0',
          background: PAL.cocoa,
          borderRadius: 5 * s,
          rotate: `${crouch * 8}deg`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: (140 + crouch * 4) * s,
          width: 22 * s,
          height: (48 - crouch * 4) * s,
          translate: '15% 0',
          background: PAL.cocoa,
          borderRadius: 5 * s,
          rotate: `${-crouch * 8}deg`,
        }}
      />

      {/* Badan + Kepala yang bisa membungkuk */}
      <div
        style={{
          position: 'absolute',
           inset: 0,
          transformOrigin: `50% ${144 * s}px`,
          rotate: `${bodyRot}deg`,
        }}
      >
        {/* Badan */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: torsoY,
            width: 64 * s,
            height: torsoH,
            translate: '-50% 0',
            background: bodyColor,
            borderRadius: 10 * s,
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.18)',
          }}
        >
          {/* Atribut peran: jas bata pemberi kerja */}
          {role === 'employer' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 18 * s,
                  height: torsoH * 0.55,
                  translate: '-50% 0',
                  background: PAL.creamPaper,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 6 * s,
                  width: 8 * s,
                  height: torsoH * 0.42,
                  translate: '-50% 0',
                  background: PAL.cocoa,
                }}
              />
            </>
          ) : null}

          {/* Atribut peran: celemek pedagang warung */}
          {role === 'vendor' ? (
            <div
              style={{
                position: 'absolute',
                left: '14%',
                right: '14%',
                top: 12 * s,
                bottom: 4 * s,
                background: PAL.creamPaper,
                borderRadius: `2px 2px ${8 * s}px ${8 * s}px`,
                borderTop: `${3 * s}px solid ${PAL.kraftLo}`,
              }}
            />
          ) : null}

          {/* Atribut peran: tas kain selempang pekerja harian */}
          {role === 'daily' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: -4 * s,
                  top: 2 * s,
                  width: 72 * s,
                  height: 10 * s,
                  background: PAL.kraftHi,
                  rotate: '32deg',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -12 * s,
                  top: 34 * s,
                  width: 30 * s,
                  height: 36 * s,
                  background: PAL.kraftHi,
                  border: `${2.5 * s}px solid ${PAL.cocoa}`,
                  borderRadius: 6 * s,
                }}
              />
            </>
          ) : null}
        </div>

        {/* Kepala polos TANPA WAJAH (tanpa mata, hidung, mulut, alis, telinga) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: headY,
            width: 50 * s,
            height: 50 * s,
            translate: '-50% 0',
            borderRadius: '50%',
            background: C.creamLo,
            border: `${3 * s}px solid ${PAL.cocoa}`,
          }}
        />

        {/* Atribut peran: helm kuning pekerja pabrik */}
        {role === 'worker' ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: headY - 10 * s,
              width: 60 * s,
              height: 28 * s,
              translate: '-50% 0',
              background: PAL.mustardHi,
              border: `${3 * s}px solid ${PAL.cocoa}`,
              borderRadius: `${30 * s}px ${30 * s}px ${6 * s}px ${6 * s}px`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

// Beat A [frame 0–124]: Dua label "upah tinggi" dan "upah rendah" muncul lalu disobek & dibuang keluar bingkai
const BeatATornLabels: React.FC<{f: number}> = ({f}) => {
  if (f > 132) return null;
  const sf = stepFrame(f, 2);

  // Fase muncul (0..22), tahan (22..56), sobek & terlempar keluar bingkai (56..118)
  const pop = interpolate(sf, [0, 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const tear = interpolate(sf, [56, 72], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const toss = interpolate(sf, [68, 118], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });

  const renderTornCard = (
    cx: number,
    cy: number,
    text: string,
    dir: -1 | 1,
    bg: string,
    baseRot: number,
    seed: string,
  ) => {
    const gap = tear * 26;
    const outX = dir * toss * 820;
    const outY = -toss * 110 + toss * toss * 460;
    const rotL = baseRot - tear * 14 - toss * 48 * dir;
    const rotR = baseRot + tear * 16 + toss * 54 * dir;

    const cardW = 390;
    const cardH = 118;

    const halfStyle = (isLeft: boolean): React.CSSProperties => ({
      position: 'absolute',
      left: cx + outX + (isLeft ? -gap : gap),
      top: cy + outY + (isLeft ? -tear * 8 : tear * 10),
      width: cardW,
      height: cardH,
      translate: '-50% -50%',
      scale: String(pop),
      rotate: `${isLeft ? rotL : rotR}deg`,
      clipPath: isLeft
        ? 'polygon(0% 0%, 53% 0%, 48% 24%, 54% 51%, 47% 77%, 52% 100%, 0% 100%)'
        : 'polygon(53% 0%, 100% 0%, 100% 100%, 52% 100%, 47% 77%, 54% 51%, 48% 24%)',
      filter: 'url(#torn) drop-shadow(3px 8px 10px rgba(28,20,12,0.4))',
    });

    return (
      <Boil seed={seed} amp={0.4} rot={0.05}>
        {/* Serat putih tepi sobekan saat mulai disobek */}
        {tear > 0.02 ? (
          <div
            style={{
              ...halfStyle(true),
              translate: `calc(-50% + 5px) -50%`,
              background: '#FAF5EB',
            }}
          />
        ) : null}
        {tear > 0.02 ? (
          <div
            style={{
              ...halfStyle(false),
              translate: `calc(-50% - 5px) -50%`,
              background: '#FAF5EB',
            }}
          />
        ) : null}

        {[true, false].map((isLeft) => (
          <div key={String(isLeft)} style={halfStyle(isLeft)}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 48,
                color: PAL.creamPaper,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                border: `4px solid ${PAL.cocoa}`,
                boxSizing: 'border-box',
              }}
            >
              {text}
            </div>
          </div>
        ))}
      </Boil>
    );
  };

  return (
    <>
      {renderTornCard(410, 295, 'upah tinggi', -1, PAL.terra, -3, 'ut')}
      {renderTornCard(870, 295, 'upah rendah', 1, PAL.kraftLo, 2.5, 'ur')}
    </>
  );
};

// Kenop Bundar Tanpa Skala Bernomor: hanya zona warna (sage = aman, terakota = bahaya)
const PaperKnob: React.FC<{
  cx: number;
  cy: number;
  angleDeg: number; // -65 (sage/aman) s/d +65 (terakota/bahaya)
  highlight?: number;
}> = ({cx, cy, angleDeg, highlight = 0}) => {
  const R = 74;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, width: 0, height: 0}}>
      {/* Busur Zona Warna Tanpa Angka: Kiri = Sage (Aman), Kanan = Terakota (Bahaya) */}
      <svg
        width={220}
        height={220}
        viewBox="-110 -110 220 220"
        style={{
          position: 'absolute',
          left: -110,
          top: -110,
          overflow: 'visible',
          filter: 'url(#rough)',
        }}
      >
        {/* Pelat dasar busur */}
        <path
          d="M -82 32 A 88 88 0 1 1 82 32"
          fill="none"
          stroke={PAL.cocoa}
          strokeWidth={28}
          strokeLinecap="round"
        />
        {/* Zona Hijau Sage (Aman): sudut kiri-atas (-155 deg s/d -10 deg dari atas) */}
        <path
          d="M -78 26 A 82 82 0 0 1 -6 -82"
          fill="none"
          stroke={PAL.sage}
          strokeWidth={20}
          strokeLinecap="butt"
        />
        <path
          d="M -72 16 A 82 82 0 0 1 -14 -80"
          fill="none"
          stroke={PAL.sageHi}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Zona Terakota (Bahaya): sudut kanan-atas (+10 deg s/d +155 deg dari atas) */}
        <path
          d="M 6 -82 A 82 82 0 0 1 78 26"
          fill="none"
          stroke={PAL.terra}
          strokeWidth={20}
          strokeLinecap="butt"
        />
        <path
          d="M 14 -80 A 82 82 0 0 1 72 16"
          fill="none"
          stroke={PAL.terraHi}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.7}
        />
      </svg>

      {/* Cincin sorot bila kenop sedang aktif */}
      {highlight > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: -R - 14,
            top: -R - 14,
            width: (R + 14) * 2,
            height: (R + 14) * 2,
            borderRadius: '50%',
            border: `4px dashed ${PAL.mustardHi}`,
            opacity: highlight * 0.85,
          }}
        />
      ) : null}

      {/* Badan Kenop Kertas */}
      <Paper lift={6}>
        <Disc x={0} y={0} d={R * 2} color={PAL.creamPaper} shade={C.creamLo} />
        <Disc x={0} y={0} d={R * 1.48} color={PAL.kraft} shade={PAL.kraftLo} />
        {/* Jarum penunjuk kenop */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            rotate: `${angleDeg}deg`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -7,
              top: -R + 6,
              width: 14,
              height: R - 12,
              borderRadius: 7,
              background: PAL.cocoa,
              boxShadow: 'inset 2px 0 0 rgba(255,255,255,0.25)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -5,
              top: -R + 10,
              width: 10,
              height: 18,
              borderRadius: 5,
              background: PAL.mustardHi,
            }}
          />
        </div>
        <Disc x={0} y={0} d={22} color={PAL.cocoa} />
      </Paper>
    </div>
  );
};

// Miniatur 1 (di atas Kenop 1, Beat C): Papan kraft mungil & benang mustard, jaraknya berubah
const MiniFloorVsValue: React.FC<{appear: number; gapRatio: number}> = ({
  appear,
  gapRatio,
}) => {
  if (appear <= 0.01) return null;
  // gapRatio: 0 = dekat/aman (sage), 1 = lantai terlalu tinggi/jauh dari benang (terakota)
  const plankY = interpolate(gapRatio, [0, 1], [108, 36], CLAMP);
  const threadY = 92;

  return (
    <div
      style={{
        position: 'absolute',
        left: 340,
        top: 235,
        width: 230,
        height: 155,
        translate: '-50% -50%',
        scale: String(appear),
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={230}
          h={155}
          color={PAL.creamPaper}
          shade={C.creamLo}
          r={8}
        >
          {/* Bingkai panggung miniatur */}
          <div
            style={{
              position: 'absolute',
              inset: 8,
              border: `2.5px solid ${PAL.cocoa}`,
              borderRadius: 5,
            }}
          />
          {/* Sosok pekerja mungil tanpa wajah */}
          <RoleFigure x={52} y={138} s={0.42} role="worker" />
          {/* Benang mustard bertitik (nilai yang dihasilkan pekerja) */}
          <MustardThread x1={22} x2={208} y={threadY} sag={5} />
          {/* Indikator panah jarak dua arah tanpa angka */}
          <div
            style={{
              position: 'absolute',
              left: 156,
              top: Math.min(plankY + 8, threadY),
              width: 4,
              height: Math.max(8, Math.abs(threadY - plankY)),
              background: gapRatio > 0.55 ? PAL.terra : PAL.sageLo,
            }}
          />
          {/* Miniatur Papan Lantai Kraft */}
          <KraftPlank x={20} y={plankY} w={190} h={18} />
        </Slab>
      </Paper>
    </div>
  );
};

// Miniatur 2 (di atas Kenop 2, Beat D): Tangga kertas kecil & papan mungil yang menaiki tangga
const MiniStairsSpeed: React.FC<{appear: number; stepProgress: number}> = ({
  appear,
  stepProgress,
}) => {
  if (appear <= 0.01) return null;
  // 4 anak tangga
  const steps = [
    {x: 26, y: 118},
    {x: 68, y: 94},
    {x: 110, y: 70},
    {x: 152, y: 46},
  ];
  const idx = interpolate(stepProgress, [0, 1], [0, 3], CLAMP);
  const i0 = Math.min(2, Math.floor(idx));
  const frac = idx - i0;
  const px = steps[i0].x + (steps[i0 + 1].x - steps[i0].x) * frac;
  const py =
    steps[i0].y +
    (steps[i0 + 1].y - steps[i0].y) * frac -
    Math.sin(frac * Math.PI) * 14;

  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: 235,
        width: 230,
        height: 155,
        translate: '-50% -50%',
        scale: String(appear),
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={230}
          h={155}
          color={PAL.creamPaper}
          shade={C.creamLo}
          r={8}
        >
          <div
            style={{
              position: 'absolute',
              inset: 8,
              border: `2.5px solid ${PAL.cocoa}`,
              borderRadius: 5,
            }}
          />
          {/* Anak-anak tangga kertas */}
          {steps.map((st, i) => (
            <Slab
              key={i}
              x={st.x}
              y={st.y}
              w={46}
              h={138 - st.y}
              color={i % 2 === 0 ? PAL.kraftLo : PAL.kraft}
              shade={PAL.cocoa}
              shadeH={0.18}
              r={2}
            />
          ))}
          {/* Garis kecepatan abstrak saat melompat cepat */}
          {stepProgress > 0.45 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: px - 22,
                  top: py - 4,
                  width: 18,
                  height: 3,
                  background: PAL.terra,
                  rotate: '-28deg',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: px - 26,
                  top: py + 5,
                  width: 22,
                  height: 3,
                  background: PAL.terra,
                  rotate: '-28deg',
                }}
              />
            </>
          ) : null}
          {/* Papan Kraft Mungil yang menaiki tangga */}
          <KraftPlank
            x={px - 10}
            y={py - 16}
            w={62}
            h={14}
            rot={-Math.sin(frac * Math.PI) * 8}
          />
        </Slab>
      </Paper>
    </div>
  );
};

// Miniatur 3 (di atas Kenop 3, Beat E): Sekelompok figur mungil menyangga beban yang bergeser
const MiniBurdenShift: React.FC<{appear: number; shiftPos: number}> = ({
  appear,
  shiftPos,
}) => {
  if (appear <= 0.01) return null;
  // shiftPos: -1 = kiri, 0 = tengah (merata), +1 = kanan (menimpa pekerja harian di tepi)
  const figs: {x: number; role: RoleKind; pos: number}[] = [
    {x: 56, role: 'worker', pos: -1},
    {x: 115, role: 'vendor', pos: 0},
    {x: 174, role: 'daily', pos: 1},
  ];
  const blockX = interpolate(shiftPos, [-1, 0, 1], [32, 68, 108], CLAMP);
  const blockTilt = shiftPos * 9;

  return (
    <div
      style={{
        position: 'absolute',
        left: 940,
        top: 235,
        width: 230,
        height: 155,
        translate: '-50% -50%',
        scale: String(appear),
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={230}
          h={155}
          color={PAL.creamPaper}
          shade={C.creamLo}
          r={8}
        >
          <div
            style={{
              position: 'absolute',
              inset: 8,
              border: `2.5px solid ${PAL.cocoa}`,
              borderRadius: 5,
            }}
          />
          {/* Tiga figur mungil tanpa wajah menyangga beban */}
          {figs.map((fg, i) => {
            const dist = Math.abs(shiftPos - fg.pos);
            const strain = interpolate(dist, [0, 1.1], [0.95, 0.1], CLAMP);
            return (
              <RoleFigure
                key={i}
                x={fg.x}
                y={140}
                s={0.4}
                role={fg.role}
                crouch={strain}
              />
            );
          })}
          {/* Balok beban berat yang bergeser mengikuti putaran kenop */}
          <Slab
            x={blockX}
            y={38 + Math.abs(shiftPos) * 8}
            w={94}
            h={32}
            color={PAL.terraLo}
            hi={PAL.terra}
            hiH={0.2}
            shade={PAL.cocoa}
            shadeH={0.3}
            r={4}
            rot={blockTilt}
          />
        </Slab>
      </Paper>
    </div>
  );
};

// Beat G [frame 609–728]: Rel di depan panggung, Slip Gaji meluncur, tab gelap "kesulitan" berpindah menimpa sosok kecil
const WageSlipRail: React.FC<{f: number}> = ({f}) => {
  if (f < 606) return null;
  const sf = stepFrame(f, 2);

  const railIn = interpolate(sf, [606, 620], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Slip gaji meluncur dari kiri (x=220) ke tengah-kiri (x=500)
  const slipX = interpolate(sf, [614, 658], [180, 470], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const slipY = 548;

  // Tab gelap "kesulitan" awalnya menempel di atas slip gaji (614..652),
  // lalu terlepas dan berpindah ke sisi kanan panggung (x=1035, y=496) menimpa sosok kecil di sana
  const transfer = interpolate(sf, [650, 692], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const arcLift = Math.sin(transfer * Math.PI) * -95;
  const tabX = interpolate(transfer, [0, 1], [slipX + 12, 1035], CLAMP);
  const tabY =
    interpolate(transfer, [0, 1], [slipY - 46, 488], CLAMP) + arcLift;
  const tabRot = interpolate(transfer, [0, 0.5, 1], [-2, 8, -6], CLAMP);

  // Sosok kecil di sisi kanan panggung membungkuk saat tertimpa tab gelap "kesulitan"
  const hitCrouch = interpolate(sf, [684, 700], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.6)),
  });

  return (
    <div style={{position: 'absolute', inset: 0, opacity: railIn}}>
      {/* Rel kertas tempat slip gaji meluncur */}
      <Paper lift={4}>
        <Slab
          x={110}
          y={576}
          w={780}
          h={14}
          color={PAL.cocoa}
          hi={PAL.kraftLo}
          hiH={0.3}
          r={4}
        />
        {[160, 310, 460, 610, 760].map((rx) => (
          <Slab
            key={rx}
            x={rx}
            y={588}
            w={18}
            h={16}
            color={PAL.kraftLo}
            r={2}
          />
        ))}
      </Paper>

      {/* Sosok kecil di sisi kanan panggung yang tertimpa tab "kesulitan" */}
      <Paper lift={5}>
        <RoleFigure
          x={1035}
          y={604}
          s={0.78}
          role="daily"
          crouch={hitCrouch}
          lean={hitCrouch * 10}
        />
      </Paper>

      {/* Selembar Slip Gaji kertas yang tetap bersih */}
      <Boil seed="slip" amp={0.4} rot={0.05}>
        <Paper lift={6}>
          <Slab
            x={slipX - 115}
            y={slipY - 48}
            w={230}
            h={88}
            color={PAL.creamPaper}
            hi="#FAF5EB"
            hiH={0.25}
            shade={C.creamLo}
            shadeH={0.18}
            r={6}
          >
            {/* Garis-garis abstrak tanpa angka */}
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 54,
                width: 120,
                height: 6,
                borderRadius: 3,
                background: C.creamLo,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 66,
                width: 84,
                height: 6,
                borderRadius: 3,
                background: C.creamLo,
              }}
            />
            {/* Label kertas "slip gaji" */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 26,
                translate: '-50% -50%',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 28,
                color: PAL.cocoa,
                whiteSpace: 'nowrap',
              }}
            >
              slip gaji
            </div>
          </Slab>
        </Paper>
      </Boil>

      {/* Tab gelap bertuliskan HANYA kata "kesulitan" */}
      <Boil seed="tab-kesulitan" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: tabX,
            top: tabY,
            translate: '-50% -50%',
            rotate: `${tabRot}deg`,
            filter: 'url(#torn) drop-shadow(3px 7px 8px rgba(20,12,8,0.5))',
          }}
        >
          <div
            style={{
              backgroundColor: PAL.cocoa,
              border: `3px solid ${PAL.terra}`,
              padding: '10px 24px 12px',
              borderRadius: 6,
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 30,
              color: PAL.creamPaper,
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            kesulitan
          </div>
        </div>
      </Boil>
    </div>
  );
};

export const MGK: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 2);

  // Beat B [139–169]: Panel kontrol kertas naik dari lantai
  const panelRise = interpolate(sf, [139, 166], [340, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.15)),
  });
  const panelOpacity = interpolate(sf, [139, 147], [0, 1], CLAMP);

  // Sudut putaran ketiga kenop (-52 = zona sage/aman, +52 = zona terakota/bahaya, 0 = tengah)
  // Kenop 1 bergerak di Beat C [190–287], ke sage di Beat F [463–590], ke terakota di Beat G [609–728]
  const knob1Angle = interpolate(
    sf,
    [0, 190, 218, 252, 284, 463, 492, 590, 609, 634],
    [0, 0, -48, 54, 18, 18, -52, -52, -52, 54],
    CLAMP,
  );
  // Kenop 2 bergerak di Beat D [306–347], ke sage di Beat F, ke terakota di Beat G
  const knob2Angle = interpolate(
    sf,
    [0, 306, 322, 344, 463, 496, 590, 609, 636],
    [0, 0, -36, 52, 52, -52, -52, -52, 56],
    CLAMP,
  );
  // Kenop 3 bergerak di Beat E [362–443], ke sage di Beat F, ke terakota di Beat G
  const knob3Angle = interpolate(
    sf,
    [0, 362, 388, 418, 440, 463, 500, 590, 609, 638],
    [0, 0, -44, 58, 36, 36, -52, -52, -52, 55],
    CLAMP,
  );

  // Kemunculan miniatur di atas masing-masing kenop
  const mini1Appear = interpolate(sf, [190, 206], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const mini1Gap = interpolate(knob1Angle, [-52, 54], [0.05, 0.95], CLAMP);

  const mini2Appear = interpolate(sf, [306, 320], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const mini2Step = interpolate(
    sf,
    [306, 324, 344, 463, 495, 609, 635],
    [0, 0.3, 1, 1, 0.35, 0.35, 1],
    CLAMP,
  );

  const mini3Appear = interpolate(sf, [362, 378], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const mini3Shift = interpolate(knob3Angle, [-52, 0, 58], [0, 0, 1], CLAMP);

  // Beat F [463–590] & Beat G [609–728]: Lampu puncak menyala hangat di Beat F, padam di Beat G
  const lampGlow = interpolate(
    sf,
    [478, 500, 590, 609, 626],
    [0, 1, 1, 1, 0],
    CLAMP,
  );

  // Pelindung kertas kraft melebar di Beat F [463–590], lalu mengerut di Beat G [609–638]
  const shelterSpread = interpolate(
    sf,
    [482, 518, 590, 609, 636],
    [0, 1, 1, 1, 0.14],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const shelterVisible = interpolate(sf, [478, 490], [0, 1], CLAMP);

  // Visibilitas label per beat agar tata letak selalu bersih dan tidak saling tumpang tindih
  const lblTigaHal = interpolate(
    sf,
    [139, 150, 452, 464],
    [0, 1, 1, 0],
    CLAMP,
  );
  const lblTinggi = interpolate(
    sf,
    [190, 202, 452, 464],
    [0, 1, 1, 0],
    CLAMP,
  );
  const lblCepat = interpolate(
    sf,
    [306, 318, 452, 464],
    [0, 1, 1, 0],
    CLAMP,
  );
  const lblSiapa = interpolate(
    sf,
    [362, 374, 452, 464],
    [0, 1, 1, 0],
    CLAMP,
  );
  const lblPelindung = interpolate(
    sf,
    [463, 478, 592, 608],
    [0, 1, 1, 0],
    CLAMP,
  );
  const lblMemindahkan = interpolate(sf, [609, 624], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={MGK_DUR}
          yaw={12}
          push={1.06}
          drift={[16, -8]}
          origin={[640, 520]}
        >
          {/* LAYER 1: Latar Panggung Teater Kertas */}
          <Depth z={0.1} cover>
            <Slab
              x={0}
              y={0}
              w={1280}
              h={720}
              color={C.creamHi}
              r={0}
              grain={0.55}
            />
            {/* Tirai sayap panggung terakota di tepi kiri & kanan atas */}
            <Paper lift={6}>
              <Slab
                x={-24}
                y={-18}
                w={118}
                h={640}
                color={PAL.terraLo}
                shade={PAL.cocoa}
                shadeH={0.15}
                r="0 0 28px 0"
              />
              <Slab
                x={1186}
                y={-18}
                w={118}
                h={640}
                color={PAL.terraLo}
                shade={PAL.cocoa}
                shadeH={0.15}
                r="0 0 0 28px"
              />
              <Slab
                x={0}
                y={-12}
                w={1280}
                h={42}
                color={PAL.terra}
                shade={PAL.terraLo}
                shadeH={0.4}
                r={0}
              />
            </Paper>
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 48%, rgba(38,25,17,0.28) 100%)',
              }}
            />
          </Depth>

          {/* LAYER 2: Lantai Panggung, Elemen Pengikat, dan Panel Tiga Kenop */}
          <Depth z={0.45}>
            {/* Lantai kayu panggung */}
            <Slab
              x={0}
              y={FLOOR_Y}
              w={1280}
              h={720 - FLOOR_Y}
              color={C.floor}
              r={0}
              grain={0.6}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: FLOOR_Y + 38,
                height: 3,
                background: C.floorLo,
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: FLOOR_Y + 78,
                height: 3,
                background: C.floorLo,
                opacity: 0.8,
              }}
            />

            {/* Benang Mustard Bertitik di latar panggung */}
            <MustardThread x1={96} x2={1184} y={FLOOR_Y - 74} sag={12} />

            {/* Papan Lantai Kraft: upah minimum (tebal, tepi atas berjahit garis putus-putus) */}
            <KraftPlank x={64} y={FLOOR_Y - 26} w={1152} h={30} />

            {/* Figur di tepi kiri & kanan pada awal adegan */}
            <Paper lift={5}>
              <RoleFigure x={138} y={FLOOR_Y - 22} s={0.76} role="worker" />
              <RoleFigure x={1142} y={FLOOR_Y - 22} s={0.76} role="employer" />
            </Paper>

            {/* Beat A: Dua label "upah tinggi" & "upah rendah" muncul lalu disobek & dibuang */}
            <BeatATornLabels f={f} />

            {/* Beat B–G: Panel Kontrol Tiga Kenop naik dari lantai */}
            {f >= 139 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  translate: `0px ${panelRise}px`,
                  opacity: panelOpacity,
                }}
              >
                {/* Cahaya hangat lampu puncak saat Beat F */}
                {lampGlow > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 640,
                      top: 138,
                      width: 520,
                      height: 360,
                      translate: '-50% -35%',
                      background:
                        'radial-gradient(circle, rgba(240,195,98,0.55) 0%, rgba(240,195,98,0.18) 45%, rgba(240,195,98,0) 72%)',
                      opacity: lampGlow,
                    }}
                  />
                ) : null}

                {/* Lampu Kertas di Puncak Panel */}
                <Paper lift={6}>
                  {/* Dudukan lampu */}
                  <Slab
                    x={596}
                    y={146}
                    w={88}
                    h={22}
                    color={PAL.cocoa}
                    r="6px 6px 0 0"
                  />
                  {/* Kubah lampu kertas */}
                  <Slab
                    x={608}
                    y={104}
                    w={64}
                    h={46}
                    color={lampGlow > 0.3 ? PAL.mustardHi : C.creamLo}
                    hi={lampGlow > 0.3 ? '#FFF6D6' : PAL.creamPaper}
                    hiH={0.28}
                    shade={lampGlow > 0.3 ? PAL.mustard : PAL.kraftLo}
                    shadeH={0.24}
                    r="32px 32px 6px 6px"
                  />
                  {/* Sinar kertas potongan saat lampu menyala */}
                  {lampGlow > 0.2
                    ? [-48, -24, 0, 24, 48].map((deg, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: 640,
                            top: 122,
                            width: 0,
                            height: 0,
                            rotate: `${deg}deg`,
                            opacity: lampGlow,
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              left: -4,
                              top: -68,
                              width: 8,
                              height: 22,
                              borderRadius: 4,
                              background: PAL.mustardHi,
                            }}
                          />
                        </div>
                      ))
                    : null}
                </Paper>

                {/* Badan Utama Panel Kontrol Kertas */}
                <Paper lift={8}>
                  <Slab
                    x={190}
                    y={164}
                    w={900}
                    h={412}
                    color={PAL.kraftLo}
                    hi={PAL.kraft}
                    hiH={0.06}
                    shade={PAL.cocoa}
                    shadeH={0.12}
                    r={14}
                  />
                  <Slab
                    x={208}
                    y={180}
                    w={864}
                    h={380}
                    color={C.cream}
                    hi={PAL.creamPaper}
                    hiH={0.08}
                    shade={C.creamLo}
                    shadeH={0.1}
                    r={10}
                  >
                    {/* Jahitan tepi panel */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 10,
                        border: `2px dashed ${PAL.kraftLo}`,
                        borderRadius: 7,
                        opacity: 0.55,
                      }}
                    />
                  </Slab>
                </Paper>

                {/* Tiga Miniatur di atas masing-masing kenop (Beat C, D, E) */}
                <MiniFloorVsValue appear={mini1Appear} gapRatio={mini1Gap} />
                <MiniStairsSpeed appear={mini2Appear} stepProgress={mini2Step} />
                <MiniBurdenShift appear={mini3Appear} shiftPos={mini3Shift} />

                {/* Tiga Kenop Bundar Berdampingan TANPA Skala Bernomor */}
                <PaperKnob
                  cx={340}
                  cy={432}
                  angleDeg={knob1Angle}
                  highlight={
                    interpolate(sf, [190, 205, 280, 295], [0, 1, 1, 0], CLAMP)
                  }
                />
                <PaperKnob
                  cx={640}
                  cy={432}
                  angleDeg={knob2Angle}
                  highlight={
                    interpolate(sf, [306, 316, 342, 355], [0, 1, 1, 0], CLAMP)
                  }
                />
                <PaperKnob
                  cx={940}
                  cy={432}
                  angleDeg={knob3Angle}
                  highlight={
                    interpolate(sf, [362, 375, 438, 452], [0, 1, 1, 0], CLAMP)
                  }
                />
              </div>
            ) : null}
          </Depth>

          {/* LAYER 3: Pelindung Kraft (Beat F), Rel Slip Gaji (Beat G), dan Label Kertas */}
          <Depth z={0.62}>
            {/* Beat F [463–590]: Sehelai pelindung kertas kraft melebar menaungi kerumunan figur di bawah */}
            {shelterVisible > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, opacity: shelterVisible}}>
                {/* Kanopi Pelindung Kertas Kraft */}
                <Paper lift={7}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 640,
                      top: 492,
                      width: 820,
                      height: 86,
                      translate: '-50% 0',
                      scale: `${shelterSpread} ${0.4 + 0.6 * shelterSpread}`,
                      transformOrigin: '50% 0%',
                    }}
                  >
                    <Slab
                      x={0}
                      y={0}
                      w={820}
                      h={54}
                      color={PAL.kraft}
                      hi={PAL.kraftHi}
                      hiH={0.28}
                      shade={PAL.kraftLo}
                      shadeH={0.28}
                      r="36px 36px 8px 8px"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 18,
                          right: 18,
                          top: 10,
                          borderTop: `3px dashed ${PAL.cocoa}`,
                          opacity: 0.7,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 18,
                          right: 18,
                          bottom: 8,
                          borderTop: `3px dashed ${PAL.sageLo}`,
                          opacity: 0.75,
                        }}
                      />
                    </Slab>
                  </div>
                </Paper>

                {/* Kerumunan figur tanpa wajah yang bernaung di bawah pelindung saat Beat F */}
                {f < 612 ? (
                  <PopIn at={472} origin="50% 100%">
                    <Paper lift={5}>
                      <RoleFigure x={390} y={626} s={0.58} role="worker" />
                      <RoleFigure x={515} y={628} s={0.56} role="vendor" />
                      <RoleFigure x={640} y={630} s={0.58} role="daily" />
                      <RoleFigure x={765} y={628} s={0.56} role="worker" />
                      <RoleFigure x={890} y={626} s={0.58} role="employer" />
                    </Paper>
                  </PopIn>
                ) : null}
              </div>
            ) : null}

            {/* Beat G [609–728]: Slip gaji meluncur di rel & tab gelap "kesulitan" berpindah */}
            <WageSlipRail f={f} />

            {/* LABEL-LABEL KERTAS (HANYA dari daftar "Teks boleh tampil") */}
            <PaperLabel
              x={640}
              y={58}
              text="tiga hal"
              size={38}
              bg={PAL.creamPaper}
              color={PAL.cocoa}
              rot={-1}
              seed="lbl-3hal"
              opacity={lblTigaHal}
            />

            <PaperLabel
              x={340}
              y={542}
              text="Seberapa tinggi lantainya"
              size={22}
              bg={PAL.creamPaper}
              color={PAL.cocoa}
              rot={-1.5}
              seed="lbl-tinggi"
               tape={false}
              opacity={lblTinggi}
            />

            <PaperLabel
              x={640}
              y={542}
              text="Seberapa cepat ia naik"
              size={22}
              bg={PAL.creamPaper}
              color={PAL.cocoa}
              rot={0.8}
              seed="lbl-cepat"
              tape={false}
              opacity={lblCepat}
            />

            <PaperLabel
              x={940}
              y={542}
              text="siapa yang menanggung akibatnya"
              size={21}
              bg={PAL.creamPaper}
              color={PAL.cocoa}
              rot={-1.2}
              seed="lbl-siapa"
              tape={false}
              opacity={lblSiapa}
            />

            <PaperLabel
              x={640}
              y={64}
              text="pelindung yang baik"
              size={38}
              bg={PAL.sage}
              color={PAL.creamPaper}
              rot={-1.2}
              seed="lbl-pelindung"
              opacity={lblPelindung}
            />

            <PaperLabel
              x={640}
              y={81}
              text="memindahkan kesulitan"
              size={25}
              bg={PAL.terra}
              color={PAL.creamPaper}
              rot={0.4}
              seed="lbl-pindah"
              tape={false}
              opacity={lblMemindahkan}
            />
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
