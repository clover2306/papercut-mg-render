// Adegan MG-J "Tangga Produktivitas": upah minimum sebagai alat (papan lantai kraft) yang naik sejalan tangga produktivitas,
// lalu melompat lepas dari rel meninggalkan celah selisih yang diisi kartu lowongan jatuh dan label harga mungil.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, CameraPush, Disc, GRAIN, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {SnapZoom} from '../../lib/paper/camera';
import {FilmWeave} from '../../lib/paper/look';

export const MGJ_DUR = 665;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR_Y = 604;

// Palet kertas hangat sesuai aturan visual "Panggung Lantai" (tanpa biru dingin, hitam pekat, atau neon)
const P = {
  creamBg: C.creamHi,
  creamCard: C.cream,
  creamLo: C.creamLo,
  kraft: '#C69A6B',
  kraftHi: '#DAB388',
  kraftLo: '#996E43',
  kraftStitch: '#5E3B22',
  mustard: '#D8A23B',
  mustardHi: '#EBC162',
  mustardLo: '#9C7221',
  sage: '#7F9474',
  sageHi: '#A1B695',
  sageLo: '#5B6E52',
  terra: '#C9573C',
  terraHi: '#DE775D',
  terraLo: ROOM.terracotta,
  brick: '#9E4731',
  brickLo: '#73301F',
  helmet: '#E5B23A',
  helmetLo: '#AE811D',
  wood: C.wood,
  woodLo: C.woodLo,
  floor: C.floor,
  floorLo: C.floorLo,
  ink: C.inkSoft,
  tape: C.tape,
};

// Kuantisasi frame untuk memberi tekstur gerak stop-motion kertas
const qFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Label Kertas: satu-satunya cara teks muncul di layar (HANYA dari daftar "Teks boleh tampil")
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
  seed: string;
}> = ({x, y, text, at, outAt, bg = P.creamCard, color = P.floorLo, size = 25, rot = -1.4, seed}) => {
  const f = useCurrentFrame();
  const fadeOut = outAt !== undefined ? interpolate(f, [outAt, outAt + 10], [1, 0], CLAMP) : 1;
  if (f < at || fadeOut <= 0.01) return null;

  return (
    <PopIn at={at} seed={seed} style={{opacity: fadeOut}}>
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            rotate: `${rot}deg`,
            whiteSpace: 'nowrap',
            backgroundColor: bg,
            backgroundImage: `url(${GRAIN})`,
            backgroundSize: '420px',
            backgroundBlendMode: 'multiply',
            padding: '10px 22px 12px',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: size,
            color,
            lineHeight: 1.05,
            border: `2px solid ${P.kraftLo}`,
            filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(54,34,26,0.36))',
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              top: -9,
              left: '50%',
              translate: '-50% 0',
              width: 52,
              height: 15,
              backgroundColor: P.tape,
              opacity: 0.86,
              rotate: `${-rot * 1.3}deg`,
              filter: 'url(#torn)',
            }}
          />
        </div>
      </Boil>
    </PopIn>
  );
};

// Papan lantai kraft (simbol upah minimum: tebal, tepi atas berjahit garis putus-putus, plus gagang kertas perkakas)
const KraftToolBoard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  handleScale?: number;
  railClipOpacity?: number;
  brokenClips?: boolean;
}> = ({x, y, w, h, rot = 0, handleScale = 1, railClipOpacity = 0, brokenClips = false}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      translate: '-50% -50%',
      rotate: `${rot}deg`,
    }}
  >
    <Paper lift={6}>
      {/* Gagang perkakas kertas di atas papan (menegaskan "alat, bukan keajaiban") */}
      {handleScale > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -36 * handleScale,
            width: 124,
            height: 40,
            translate: '-50% 0',
            scale: `1 ${handleScale.toFixed(3)}`,
            transformOrigin: '50% 100%',
          }}
        >
          {/* Tiang kiri gagang */}
          <Slab x={14} y={10} w={18} h={32} color={P.kraftLo} shade={P.floor} shadeH={0.3} r={3} />
          {/* Tiang kanan gagang */}
          <Slab x={92} y={10} w={18} h={32} color={P.kraftLo} shade={P.floor} shadeH={0.3} r={3} />
          {/* Palang genggam gagang */}
          <Slab
            x={4}
            y={0}
            w={116}
            h={18}
            color={P.wood}
            shade={P.woodLo}
            shadeH={0.35}
            hi={P.kraftHi}
            hiH={0.2}
            r={6}
          />
          {/* Paku keling kertas */}
          <Disc x={23} y={24} d={7} color={P.creamCard} />
          <Disc x={101} y={24} d={7} color={P.creamCard} />
        </div>
      ) : null}

      {/* Penjepit rel di sisi kiri papan saat berjalan di rel */}
      {railClipOpacity > 0.01 ? (
        <div style={{position: 'absolute', left: -24, top: 6, opacity: railClipOpacity}}>
          <Slab
            x={0}
            y={0}
            w={28}
            h={h - 12}
            color={P.woodLo}
            shade={P.floorLo}
            shadeH={0.35}
            r={4}
            rot={brokenClips ? -22 : 0}
          />
          <Disc x={10} y={(h - 12) / 2} d={8} color={P.mustardHi} />
        </div>
      ) : null}

      {/* Batang utama papan lantai kraft */}
      <Slab
        x={0}
        y={0}
        w={w}
        h={h}
        color={P.kraft}
        shade={P.kraftLo}
        shadeH={0.34}
        hi={P.kraftHi}
        hiH={0.18}
        r={6}
      >
        {/* Jahitan garis putus-putus khas papan lantai kraft */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            right: 14,
            top: 7,
            borderTop: `3.5px dashed ${P.kraftStitch}`,
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 8,
            borderTop: `2px dashed ${P.kraftStitch}`,
            opacity: 0.5,
          }}
        />
      </Slab>
    </Paper>
  </div>
);

// Tongkat sihir kertas berkilau yang menggumpal dan diremas jadi bola kertas pada beat a
const PaperMagicWand: React.FC<{
  x: number;
  y: number;
  crumple: number;
  sparklePhase: number;
}> = ({x, y, crumple, sparklePhase}) => {
  const wandOpacity = interpolate(crumple, [0, 0.55], [1, 0], CLAMP);
  const wandScaleX = interpolate(crumple, [0, 0.6], [1, 0.18], CLAMP);
  const wandScaleY = interpolate(crumple, [0, 0.6], [1, 0.45], CLAMP);
  const wandRot = interpolate(crumple, [0, 0.6], [-24, 35], CLAMP);

  const ballScale = interpolate(crumple, [0.22, 0.72, 0.88, 1], [0, 1.18, 0.92, 1], CLAMP);
  const ballDropY = interpolate(crumple, [0.55, 1], [-18, 22], {
    ...CLAMP,
    easing: Easing.bounce,
  });
  const ballRoll = interpolate(crumple, [0.4, 1], [-40, 28], CLAMP);

  const starPts = '28,0 35,18 55,20 40,33 45,52 28,41 11,52 16,33 1,20 21,18';

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 220, height: 160, translate: '-50% -50%'}}>
      {/* Tongkat sihir utuh sebelum diremas */}
      {wandOpacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: wandOpacity,
            transform: `rotate(${wandRot}deg) scale(${wandScaleX.toFixed(3)}, ${wandScaleY.toFixed(3)})`,
            transformOrigin: '55% 55%',
          }}
        >
          <Paper lift={5}>
            {/* Batang tongkat kertas cokelat tua + ujung krem */}
            <Slab x={36} y={74} w={132} h={16} color={P.floor} shade={P.floorLo} shadeH={0.35} r={4} />
            <Slab x={142} y={74} w={30} h={16} color={P.creamCard} shade={P.creamLo} shadeH={0.25} r={3} />
            <Slab x={34} y={74} w={20} h={16} color={P.creamCard} shade={P.creamLo} shadeH={0.25} r={3} />
            {/* Bintang kertas mustard di ujung tongkat */}
            <svg
              width={58}
              height={58}
              viewBox="0 0 56 56"
              style={{position: 'absolute', left: 146, top: 52, overflow: 'visible'}}
            >
              <polygon points={starPts} fill={P.mustardHi} stroke={P.mustardLo} strokeWidth={2.5} />
              <circle cx={28} cy={28} r={6} fill={P.creamBg} />
            </svg>
          </Paper>

          {/* Kilau kertas di sekitar ujung tongkat */}
          {[
            {dx: 175, dy: 24, s: 0.9},
            {dx: 214, dy: 64, s: 0.75},
            {dx: 196, dy: 112, s: 0.8},
            {dx: 132, dy: 34, s: 0.65},
          ].map((sp, idx) => {
            const pulse = 0.55 + 0.45 * Math.sin(sparklePhase * 0.45 + idx * 1.6);
            return (
              <svg
                key={idx}
                width={26}
                height={26}
                viewBox="-12 -12 24 24"
                style={{
                  position: 'absolute',
                  left: sp.dx,
                  top: sp.dy,
                  transform: `scale(${(sp.s * pulse * (1 - crumple)).toFixed(2)}) rotate(${idx * 22}deg)`,
                }}
              >
                <path
                  d="M0-11 L2.5-2.5 L11 0 L2.5 2.5 L0 11 L-2.5 2.5 L-11 0 L-2.5-2.5 Z"
                  fill={idx % 2 === 0 ? P.mustardHi : P.creamBg}
                  stroke={P.mustardLo}
                  strokeWidth={1}
                />
              </svg>
            );
          })}
        </div>
      ) : null}

      {/* Gumpalan bola kertas hasil remasan tongkat sihir */}
      {ballScale > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 112,
            top: 84 + ballDropY,
            width: 78,
            height: 74,
            translate: '-50% -50%',
            transform: `scale(${ballScale.toFixed(3)}) rotate(${ballRoll}deg)`,
          }}
        >
          <Paper lift={4} torn>
            <svg width={78} height={74} viewBox="0 0 78 74">
              {/* Poligon berlapis untuk tekstur gumpalan kertas kusut */}
              <polygon
                points="14,18 36,6 64,14 74,38 62,64 34,70 10,56 6,34"
                fill={P.creamCard}
                stroke={P.kraftLo}
                strokeWidth={2.5}
              />
              <polygon
                points="22,14 54,18 66,42 46,62 18,50"
                fill={P.creamLo}
                stroke={P.kraftLo}
                strokeWidth={1.8}
              />
              {/* Sudut bintang mustard yang ikut terlipat kusut di dalam bola kertas */}
              <polygon
                points="36,20 56,12 50,34 62,46 38,44"
                fill={P.mustard}
                stroke={P.mustardLo}
                strokeWidth={1.8}
              />
              <polyline
                points="16,32 38,38 52,26 42,56 24,46"
                fill="none"
                stroke={P.floorLo}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </Paper>
        </div>
      ) : null}
    </div>
  );
};

// Peti kertas yang ditumpuk pekerja di atas anak tangga pada beat c (tanpa angka/huruf)
const PaperCrateStack: React.FC<{
  x: number;
  yBottom: number;
  count: number;
  progress: number;
}> = ({x, yBottom, count, progress}) => {
  if (progress <= 0.01) return null;
  const crateW = 46;
  const crateH = 30;
  return (
    <div style={{position: 'absolute', left: x, top: yBottom, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const itemStart = i * 0.22;
        const u = interpolate(progress, [itemStart, Math.min(1, itemStart + 0.45)], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.6)),
        });
        if (u <= 0.01) return null;
        const dropOffset = (1 - u) * -28;
        const cy = -(i + 1) * (crateH - 1) + dropOffset;
        const tilt = (i % 2 === 0 ? -1.5 : 1.8) * (i * 0.4 + 0.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -crateW / 2 + (i % 2 === 0 ? -1 : 2),
              top: cy,
              width: crateW,
              height: crateH,
              rotate: `${tilt}deg`,
              scale: String(u),
              transformOrigin: '50% 100%',
            }}
          >
            <Paper lift={3}>
              <Slab
                x={0}
                y={0}
                w={crateW}
                h={crateH}
                color={i % 2 === 0 ? P.kraftHi : P.creamCard}
                shade={P.kraftLo}
                shadeH={0.22}
                r={3}
              >
                {/* Pita silang peti kayu/kertas */}
                <div
                  style={{
                    position: 'absolute',
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5,
                    border: `2px solid ${P.kraftLo}`,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    right: 6,
                    top: '46%',
                    height: 3,
                    backgroundColor: P.sageLo,
                    opacity: 0.65,
                  }}
                />
              </Slab>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

// Tokoh pekerja pabrik berhelm kuning (FACELESS — tanpa mata/hidung/mulut/alis/telinga)
const FacelessWorker: React.FC<{
  x: number;
  y: number;
  s?: number;
  proud?: number;
  carryCrate?: boolean;
}> = ({x, y, s = 1, proud = 0, carryCrate = false}) => {
  const chestLift = proud * -4 * s;
  const torsoTilt = proud * -3;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * s,
        height: 176 * s,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={4}>
        {/* Kaki tegak */}
        <Slab x={26 * s} y={132 * s} w={18 * s} h={44 * s} color={P.floor} shade={P.floorLo} shadeH={0.25} r={5 * s} />
        <Slab x={52 * s} y={132 * s} w={18 * s} h={44 * s} color={P.floor} shade={P.floorLo} shadeH={0.25} r={5 * s} />

        {/* Badan + lengan + kepala polos + helm kuning */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            translate: `0 ${chestLift}px`,
            rotate: `${torsoTilt}deg`,
            transformOrigin: '50% 75%',
          }}
        >
          {/* Badan wearpack hijau sage */}
          <Slab
            x={20 * s}
            y={58 * s}
            w={56 * s}
            h={78 * s}
            color={P.sage}
            shade={P.sageLo}
            shadeH={0.2}
            hi={P.sageHi}
            hiH={0.12}
            r={10 * s}
          >
            {/* Selempang overall kerja */}
            <div
              style={{
                position: 'absolute',
                left: 12 * s,
                top: 0,
                width: 8 * s,
                height: '100%',
                backgroundColor: P.sageLo,
                opacity: 0.65,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 12 * s,
                top: 0,
                width: 8 * s,
                height: '100%',
                backgroundColor: P.sageLo,
                opacity: 0.65,
              }}
            />
          </Slab>

          {/* Lengan (terangkat sigap memegang peti atau tegak lega) */}
          <Slab
            x={8 * s}
            y={62 * s}
            w={16 * s}
            h={48 * s}
            color={P.sageHi}
            shade={P.sageLo}
            shadeH={0.2}
            r={6 * s}
            rot={carryCrate ? -38 : -16 - proud * 14}
          />
          <Slab
            x={72 * s}
            y={62 * s}
            w={16 * s}
            h={48 * s}
            color={P.sageHi}
            shade={P.sageLo}
            shadeH={0.2}
            r={6 * s}
            rot={carryCrate ? 38 : 16 + proud * 14}
          />

          {/* Kepala bulat polos TANPA WAJAH */}
          <Disc x={48 * s} y={34 * s} d={42 * s} color={P.creamCard} shade={P.creamLo} />

          {/* Helm proyek kuning di atas kepala */}
          <Slab
            x={22 * s}
            y={6 * s}
            w={52 * s}
            h={22 * s}
            color={P.helmet}
            shade={P.helmetLo}
            shadeH={0.25}
            r={`${24 * s}px ${24 * s}px ${4 * s}px ${4 * s}px`}
          />
          <Slab x={16 * s} y={23 * s} w={64 * s} h={7 * s} color={P.helmetLo} r={3 * s} />

          {/* Peti kertas di tangan pekerja saat sedang menumpuk */}
          {carryCrate ? (
            <Slab
              x={22 * s}
              y={38 * s}
              w={52 * s}
              h={34 * s}
              color={P.kraftHi}
              shade={P.kraftLo}
              shadeH={0.25}
              r={4 * s}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 6 * s,
                  right: 6 * s,
                  top: '48%',
                  height: 3 * s,
                  backgroundColor: P.kraftLo,
                }}
              />
            </Slab>
          ) : null}
        </div>
      </Paper>
    </div>
  );
};

// Tokoh pemberi kerja berjas bata (FACELESS — postur tegak lega di beat c, menunduk & bahu turun di beat e)
const FacelessEmployer: React.FC<{
  x: number;
  y: number;
  s?: number;
  envelopeThick: number;
  slump: number;
}> = ({x, y, s = 1, envelopeThick, slump}) => {
  // Postur: saat slump=0 tegak lega, saat slump=1 menunduk dan bahu turun
  const shoulderDrop = slump * 14 * s;
  const torsoBow = slump * 16;
  const headDropY = slump * 14 * s;
  const headDropX = slump * -10 * s;
  const headRot = slump * -22;

  const envScale = interpolate(envelopeThick, [0, 1], [0.75, 1.35], CLAMP);
  const envLayers = Math.max(1, Math.round(1 + envelopeThick * 4));

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 110 * s,
        height: 186 * s,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={4}>
        {/* Kaki celana cokelat tua */}
        <Slab x={32 * s} y={138 * s} w={19 * s} h={48 * s} color={P.floor} shade={P.floorLo} shadeH={0.25} r={5 * s} />
        <Slab x={58 * s} y={138 * s} w={19 * s} h={48 * s} color={P.floor} shade={P.floorLo} shadeH={0.25} r={5 * s} />

        {/* Badan jas bata yang membungkuk ketika slump > 0 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            translate: `0 ${shoulderDrop * 0.5}px`,
            rotate: `${-torsoBow}deg`,
            transformOrigin: '50% 78%',
          }}
        >
          {/* Jas bata */}
          <Slab
            x={22 * s}
            y={(58 + shoulderDrop * 0.4) * s}
            w={64 * s}
            h={82 * s}
            color={P.brick}
            shade={P.brickLo}
            shadeH={0.24}
            hi={P.terraHi}
            hiH={0.1}
            r={11 * s}
          >
            {/* Kerah kemeja krem & dasi mustard */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                translate: '-50% 0',
                width: 20 * s,
                height: 36 * s,
                backgroundColor: P.creamCard,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 8 * s,
                translate: '-50% 0',
                width: 7 * s,
                height: 30 * s,
                backgroundColor: P.mustard,
                clipPath: 'polygon(20% 0, 80% 0, 100% 80%, 50% 100%, 0 80%)',
              }}
            />
          </Slab>

          {/* Bahu & lengan kiri-kanan yang turun terkulai saat slump meningkat */}
          <Slab
            x={10 * s}
            y={(64 + shoulderDrop) * s}
            w={17 * s}
            h={52 * s}
            color={P.brick}
            shade={P.brickLo}
            shadeH={0.25}
            r={6 * s}
            rot={interpolate(slump, [0, 1], [22, -8], CLAMP)}
          />
          <Slab
            x={82 * s}
            y={(64 + shoulderDrop) * s}
            w={17 * s}
            h={52 * s}
            color={P.brick}
            shade={P.brickLo}
            shadeH={0.25}
            r={6 * s}
            rot={interpolate(slump, [0, 1], [-18, 12], CLAMP)}
          />

          {/* Kepala bulat polos TANPA WAJAH (menunduk saat slump > 0) */}
          <div
            style={{
              position: 'absolute',
              left: 54 * s + headDropX,
              top: 32 * s + headDropY,
              width: 44 * s,
              height: 44 * s,
              translate: '-50% -50%',
              rotate: `${headRot}deg`,
            }}
          >
            <Disc x={22 * s} y={22 * s} d={44 * s} color={P.creamCard} shade={P.creamLo} />
          </div>

          {/* Amplop upah di tangan pemberi kerja yang makin tebal di beat c */}
          {envelopeThick > 0.02 ? (
            <div
              style={{
                position: 'absolute',
                left: 6 * s,
                top: (76 + shoulderDrop * 1.1) * s,
                transform: `scale(${envScale.toFixed(3)}) rotate(${interpolate(slump, [0, 1], [-8, -28], CLAMP)}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* Lapisan tumpukan amplop untuk menunjukkan ketebalan fisik */}
              {Array.from({length: envLayers}).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: -idx * 3,
                    top: -idx * 3.5,
                    width: 48 * s,
                    height: 32 * s,
                    backgroundColor: idx === envLayers - 1 ? P.mustardHi : P.creamCard,
                    border: `2px solid ${P.mustardLo}`,
                    borderRadius: 4,
                    boxShadow: '1px 2px 4px rgba(54,34,26,0.25)',
                  }}
                >
                  {idx === envLayers - 1 ? (
                    <svg width={48 * s} height={32 * s} viewBox="0 0 48 32">
                      <polyline
                        points="2,2 24,18 46,2"
                        fill="none"
                        stroke={P.mustardLo}
                        strokeWidth={2.5}
                      />
                      <circle cx={24} cy={17} r={4} fill={P.terra} />
                    </svg>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Paper>
    </div>
  );
};

// Kartu lowongan kertas (tanpa teks/angka; ikon siluet faceless + tanda silang terakota) yang jatuh ke celah di beat e
const VacancyCard: React.FC<{
  x: number;
  y: number;
  rot: number;
  w?: number;
  h?: number;
  opacity?: number;
}> = ({x, y, rot, w = 68, h = 44, opacity = 1}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        opacity,
      }}
    >
      <Paper lift={3}>
        <Slab x={0} y={0} w={w} h={h} color={P.creamCard} shade={P.creamLo} shadeH={0.18} r={4}>
          {/* Kotak foto profil faceless di kiri kartu lowongan */}
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 7,
              width: 18,
              height: 22,
              backgroundColor: P.sageHi,
              borderRadius: 3,
              border: `1.5px solid ${P.sageLo}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 3,
                width: 7,
                height: 7,
                translate: '-50% 0',
                borderRadius: '50%',
                backgroundColor: P.creamBg,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 3,
                right: 3,
                bottom: 2,
                height: 7,
                borderRadius: '4px 4px 0 0',
                backgroundColor: P.creamBg,
              }}
            />
          </div>
          {/* Garis-garis abstrak pengganti tulisan */}
          <div
            style={{
              position: 'absolute',
              left: 29,
              right: 8,
              top: 10,
              height: 4,
              borderRadius: 2,
              backgroundColor: P.kraftLo,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 29,
              right: 14,
              top: 19,
              height: 4,
              borderRadius: 2,
              backgroundColor: P.kraftLo,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 29,
              right: 18,
              top: 28,
              height: 3,
              borderRadius: 2,
              backgroundColor: P.kraftLo,
              opacity: 0.4,
            }}
          />
          {/* Coretan silang terakota menandakan lowongan yang hilang */}
          <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
            <line x1={8} y1={6} x2={w - 8} y2={h - 6} stroke={P.terra} strokeWidth={3.2} strokeLinecap="round" />
            <line x1={w - 8} y1={6} x2={8} y2={h - 6} stroke={P.terra} strokeWidth={3.2} strokeLinecap="round" />
          </svg>
        </Slab>
      </Paper>
    </div>
  );
};

// Label harga mungil yang bermunculan tegak dari dasar celah pada beat e (tanpa angka)
const UprightMiniPriceTag: React.FC<{
  x: number;
  y: number;
  rot: number;
  scale?: number;
  color?: string;
  opacity?: number;
}> = ({x, y, rot, scale = 1, color = P.terra, opacity = 1}) => {
  if (opacity <= 0.01) return null;
  const w = 32 * scale;
  const h = 48 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -100%',
        rotate: `${rot}deg`,
        opacity,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          border: `2px solid ${P.floorLo}`,
          borderRadius: 4,
          clipPath: 'polygon(22% 0%, 78% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
          boxShadow: '2px 4px 6px rgba(54,34,26,0.3)',
        }}
      >
        {/* Lubang tali label harga di bagian atas */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 6 * scale,
            translate: '-50% 0',
            width: 6 * scale,
            height: 6 * scale,
            borderRadius: '50%',
            backgroundColor: P.creamBg,
          }}
        />
        {/* Garis-garis abstrak horisontal (tanpa digit/angka) */}
        <div
          style={{
            position: 'absolute',
            left: 6 * scale,
            right: 6 * scale,
            top: 19 * scale,
            height: 3.5 * scale,
            backgroundColor: P.creamBg,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 8 * scale,
            right: 8 * scale,
            top: 27 * scale,
            height: 3 * scale,
            backgroundColor: P.mustardHi,
            borderRadius: 2,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 7 * scale,
            right: 10 * scale,
            top: 35 * scale,
            height: 2.5 * scale,
            backgroundColor: P.creamBg,
            borderRadius: 2,
            opacity: 0.75,
          }}
        />
      </div>
    </div>
  );
};

// Data anak tangga produktivitas (4 anak tangga kertas mustard yang menanjak)
const STEPS = [
  {x: 370, w: 125, h: 52, riseAt: 122, crates: 1},
  {x: 495, w: 125, h: 104, riseAt: 148, crates: 2},
  {x: 620, w: 125, h: 162, riseAt: 174, crates: 3},
  {x: 745, w: 135, h: 224, riseAt: 200, crates: 4},
] as const;

// Data kartu lowongan yang berjatuhan ke dalam celah kosong pada beat e [538–665]
const FALLING_VACANCIES = [
  {dx: -150, targetY: 256, rot: -9, delay: 0},
  {dx: -82, targetY: 266, rot: 7, delay: 4},
  {dx: -12, targetY: 252, rot: -5, delay: 8},
  {dx: 62, targetY: 264, rot: 11, delay: 12},
  {dx: 134, targetY: 254, rot: -8, delay: 16},
  {dx: -124, targetY: 214, rot: 6, delay: 20},
  {dx: -48, targetY: 218, rot: -11, delay: 24},
  {dx: 28, targetY: 212, rot: 8, delay: 28},
  {dx: 104, targetY: 220, rot: -6, delay: 32},
  {dx: -88, targetY: 184, rot: -4, delay: 36},
  {dx: -4, targetY: 182, rot: 9, delay: 40},
  {dx: 78, targetY: 186, rot: -7, delay: 44},
] as const;

// Data label harga mungil yang bermunculan tegak dari dasar celah pada beat e [538–665]
const RISING_PRICE_TAGS = [
  // Baris dasar celah (di atas puncak tangga y ≈ 376)
  {dx: -162, baseY: 376, rot: -6, col: P.terra, delay: 0, s: 1.02},
  {dx: -122, baseY: 376, rot: 4, col: P.mustard, delay: 2, s: 0.98},
  {dx: -82, baseY: 376, rot: -5, col: P.terraHi, delay: 4, s: 1.04},
  {dx: -42, baseY: 376, rot: 6, col: P.mustardHi, delay: 6, s: 0.96},
  {dx: -2, baseY: 376, rot: -3, col: P.terra, delay: 8, s: 1.05},
  {dx: 38, baseY: 376, rot: 5, col: P.mustard, delay: 10, s: 1.0},
  {dx: 78, baseY: 376, rot: -7, col: P.terraHi, delay: 12, s: 0.98},
  {dx: 118, baseY: 376, rot: 4, col: P.terra, delay: 14, s: 1.02},
  {dx: 158, baseY: 376, rot: -5, col: P.mustardHi, delay: 16, s: 0.96},
  // Baris lapis kedua yang menyembul tegak mengisi celah sampai bertemu kartu lowongan
  {dx: -142, baseY: 334, rot: 5, col: P.mustard, delay: 18, s: 0.98},
  {dx: -98, baseY: 332, rot: -6, col: P.terra, delay: 20, s: 1.02},
  {dx: -54, baseY: 336, rot: 4, col: P.terraHi, delay: 22, s: 0.96},
  {dx: -10, baseY: 330, rot: -4, col: P.mustardHi, delay: 24, s: 1.04},
  {dx: 34, baseY: 334, rot: 7, col: P.terra, delay: 26, s: 1.0},
  {dx: 78, baseY: 332, rot: -5, col: P.mustard, delay: 28, s: 0.98},
  {dx: 124, baseY: 336, rot: 6, col: P.terraHi, delay: 30, s: 1.02},
] as const;

export const MGJ: React.FC = () => {
  const f = useCurrentFrame();
  const qf = qFrame(f, 2);

  // =========================================================================
  // PERALIHAN TIRAI PANGGUNG LANTAI
  // =========================================================================
  const curtainLift = interpolate(f, [0, 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const curtainTopY = interpolate(curtainLift, [0, 1], [-10, -74], CLAMP);

  // =========================================================================
  // BEAT A [0–93]: Papan lantai kraft sebagai perkakas & tongkat sihir diremas
  // =========================================================================
  const wandCrumple = interpolate(qf, [54, 82], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const beatAFade = interpolate(f, [104, 124], [1, 0], CLAMP);

  // =========================================================================
  // BEAT B [119–380]: Tangga produktivitas menanjak & papan kraft naik di rel
  // =========================================================================
  const stageEnter = interpolate(f, [112, 132], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Tinggi anak tangga masing-masing
  const stepHeights = STEPS.map((st) => {
    const u = interpolate(qf, [st.riseAt, st.riseAt + 22], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.back(1.4)),
    });
    return st.h * u;
  });

  // Posisi papan kraft:
  // - Beat a [0–93]: tergeletak di tengah panggung (x=470, y=516)
  // - Transisi ke rel [105–125]: bergeser ke rel di samping kiri tangga (x=235, y=552)
  // - Beat b [122–224]: naik satu anak tangga di rel setiap kali anak tangga naik
  // - Beat d [401–665]: melesat lepas dari rel jauh di atas tangga (x=625, y=140), meninggalkan celah kosong besar!
  const toRailU = interpolate(qf, [102, 122], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const stepClimbY =
    interpolate(qf, [122, 142], [0, -52], CLAMP) +
    interpolate(qf, [148, 168], [0, -52], CLAMP) +
    interpolate(qf, [174, 194], [0, -58], CLAMP) +
    interpolate(qf, [200, 220], [0, -62], CLAMP);

  // Beat d [401–665]: pada "ketika melompat jauh melewati produktivitas" (sekitar f=445..480)
  // papan bergetar di rel (425..452) lalu melesat lepas ke atas tangga (452..482)
  const preJumpTremble =
    f >= 420 && f < 454 ? Math.sin(qf * 1.7) * interpolate(f, [420, 452], [0, 6], CLAMP) : 0;

  const jumpOffRailU = interpolate(qf, [450, 480], [0, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.22, 1.28, 0.32, 1),
  });

  const boardBaseX = interpolate(toRailU, [0, 1], [450, 232], CLAMP);
  const boardX = interpolate(jumpOffRailU, [0, 1], [boardBaseX, 625], CLAMP) + preJumpTremble;

  const boardBaseY = interpolate(toRailU, [0, 1], [522, FLOOR_Y - 36], CLAMP) + stepClimbY;
  // Di puncak tangga, permukaan anak tangga ke-4 ada di FLOOR_Y - 224 = 380.
  // Saat melompat jauh, papan kraft melesat ke y = 136 (jauh di atas tangga), menciptakan celah kosong besar (y=158..376)!
  const boardY = interpolate(jumpOffRailU, [0, 1], [boardBaseY, 136], CLAMP);

  const boardW = interpolate(toRailU, [0, 1], [340, 210], CLAMP) + interpolate(jumpOffRailU, [0, 1], [0, 175], CLAMP);
  const boardRot =
    interpolate(toRailU, [0, 1], [-1.5, 0], CLAMP) +
    interpolate(qf, [450, 466, 484], [0, -9, -2.5], CLAMP);

  const railClipOpacity = interpolate(toRailU, [0.5, 1], [0, 1], CLAMP);

  // =========================================================================
  // BEAT C [243–380]: Pekerja menumpuk peti kertas & pemberi kerja memegang amplop tebal
  // (Jendela dari tabel timing: 403.74–408.32 dtk -> frame 243–380)
  // =========================================================================
  const beatCEnter = interpolate(f, [243, 262], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const cratesProgress = interpolate(qf, [252, 318], [0, 1], CLAMP);
  const employerEnvelopeThick = interpolate(qf, [312, 374], [0.15, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const workerProud = interpolate(f, [285, 340, 450, 480], [0, 1, 1, 0.2], CLAMP);

  // Posisi pekerja menaiki anak tangga sambil menumpuk peti kertas
  const workerStepIdx = interpolate(qf, [246, 310], [0, 3], CLAMP);
  const workerX = interpolate(workerStepIdx, [0, 1, 2, 3], [415, 540, 665, 790], CLAMP);
  const workerFootY = interpolate(
    workerStepIdx,
    [0, 1, 2, 3],
    [FLOOR_Y - 52, FLOOR_Y - 104, FLOOR_Y - 162, FLOOR_Y - 224],
    CLAMP,
  );

  // =========================================================================
  // BEAT D [401–665] & BEAT E [538–665]: Celah kosong & selisihnya
  // (Kutipan beat e: 413.56–417.80 dtk -> frame 538–665)
  // =========================================================================
  const gapHighlightOpacity = interpolate(f, [468, 492], [0, 1], CLAMP);
  const employerSlump = interpolate(qf, [538, 590], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });

  // Koordinat celah kosong antara papan kraft yang melesat (y=136, bawah=158) dan puncak tangga (y=380)
  const GAP_CX = 625;
  const GAP_TOP_Y = 158;
  const GAP_BOT_Y = 378;
  const GAP_W = 365;

  return (
    <AbsoluteFill style={{backgroundColor: P.creamBg}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <CameraPush dur={MGJ_DUR} to={1.05} origin="52% 46%">
          {/* SnapZoom halus sekali saat papan kraft melesat lepas dari rel di beat d */}
          <SnapZoom at={456} x={625} y={240} to={1.1} settle={1.04} shake={5} roll={0.6} blur={false}>
            {/* Dinding latar panggung kertas hangat */}
            <Slab x={0} y={0} w={1280} h={720} color={P.creamBg} r={0} grain={0.55} />
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 48%, rgba(54,34,26,0.26) 100%)',
              }}
            />

            {/* Dekorasi dinding teater kertas halus (tanpa teks/angka) */}
            <div style={{position: 'absolute', left: 78, top: 132, opacity: 0.42}}>
              <Slab x={0} y={0} w={92} h={124} color={P.creamLo} r={4} />
              <Slab x={10} y={10} w={72} h={104} color={P.creamCard} r={2} />
            </div>
            <div style={{position: 'absolute', left: 1110, top: 148, opacity: 0.42}}>
              <Slab x={0} y={0} w={84} h={110} color={P.creamLo} r={4} />
              <Slab x={10} y={10} w={64} h={90} color={P.creamCard} r={2} />
            </div>

            {/* ============================================================= */}
            {/* BEAT A: Meja kerja rendah & Tongkat Sihir Kertas yang diremas */}
            {/* ============================================================= */}
            {beatAFade > 0.01 ? (
              <Boil seed="beat-a-props" amp={0.4} rot={0.05}>
                <div style={{position: 'absolute', inset: 0, opacity: beatAFade}}>
                  {/* Alas bantalan perkakas di bawah papan lantai kraft pada beat a */}
                  <Paper lift={3}>
                    <Slab
                      x={260}
                      y={FLOOR_Y - 52}
                      w={380}
                      h={52}
                      color={P.creamLo}
                      shade={P.kraftLo}
                      shadeH={0.25}
                      r={6}
                    />
                  </Paper>

                  {/* Tongkat sihir kertas berkilau di sebelah papan, lalu menggumpal jadi bola */}
                  <PaperMagicWand x={835} y={485} crumple={wandCrumple} sparklePhase={qf} />
                </div>
              </Boil>
            ) : null}

            {/* ============================================================= */}
            {/* BEAT B–E: Rel Samping, Tangga Produktivitas Mustard, Benang   */}
            {/* ============================================================= */}
            {stageEnter > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, opacity: stageEnter}}>
                {/* REL KERTAS DI SAMPING TANGGA (tempat papan kraft berjalan di beat b) */}
                <Paper lift={4}>
                  {/* Tiang rel vertikal */}
                  <Slab
                    x={116}
                    y={338}
                    w={22}
                    h={FLOOR_Y - 338}
                    color={P.wood}
                    shade={P.woodLo}
                    shadeH={0.3}
                    r={4}
                  />
                  {/* Alur dalam rel */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 124,
                      top: 348,
                      width: 6,
                      height: FLOOR_Y - 356,
                      backgroundColor: P.floorLo,
                      borderRadius: 3,
                    }}
                  />
                  {/* Takik penanda anak tangga pada rel (tanpa angka) */}
                  {[52, 104, 162, 224].map((sh, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: 112,
                        top: FLOOR_Y - sh - 3,
                        width: 30,
                        height: 6,
                        backgroundColor: P.mustardHi,
                        borderRadius: 2,
                        border: `1.5px solid ${P.floorLo}`,
                      }}
                    />
                  ))}
                  {/* Pegas/penahan atas rel yang patah terbuka ketika papan melesat lepas di beat d */}
                  <Slab
                    x={108}
                    y={326}
                    w={38}
                    h={14}
                    color={jumpOffRailU > 0.1 ? P.terra : P.woodLo}
                    r={3}
                    rot={interpolate(jumpOffRailU, [0, 0.4, 1], [0, -38, -28], CLAMP)}
                  />
                </Paper>

                {/* TANGGA KERTAS MUSTARD (tiap anak tangga sedikit lebih tinggi) */}
                <Boil seed="mustard-stairs" amp={0.4} rot={0.05}>
                  <Paper lift={5}>
                    {STEPS.map((st, idx) => {
                      const curH = stepHeights[idx];
                      if (curH <= 1) return null;
                      const topY = FLOOR_Y - curH;
                      return (
                        <React.Fragment key={idx}>
                          {/* Badan anak tangga mustard */}
                          <Slab
                            x={st.x}
                            y={topY}
                            w={st.w + 4}
                            h={curH}
                            color={P.mustard}
                            shade={P.mustardLo}
                            shadeH={0.18}
                            hi={P.mustardHi}
                            hiH={0.14}
                            r="6px 6px 0 0"
                          >
                            {/* Pita lipatan kertas vertikal untuk tekstur anak tangga */}
                            <div
                              style={{
                                position: 'absolute',
                                left: 10,
                                top: 14,
                                bottom: 8,
                                width: 4,
                                backgroundColor: P.mustardHi,
                                opacity: 0.45,
                                borderRadius: 2,
                              }}
                            />
                            {/* Garis jahitan tepi atas anak tangga */}
                            <div
                              style={{
                                position: 'absolute',
                                left: 8,
                                right: 8,
                                top: 6,
                                borderTop: `2.5px dashed ${P.mustardLo}`,
                                opacity: 0.75,
                              }}
                            />
                          </Slab>
                        </React.Fragment>
                      );
                    })}
                  </Paper>
                </Boil>

                {/* ELEMEN TETAP 2: BENANG MUSTARD BERTITIK (nilai yang dihasilkan pekerja / produktivitas) */}
                <svg
                  width={1280}
                  height={720}
                  style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                >
                  {(() => {
                    const pts = STEPS.map((st, idx) => {
                      const cx = st.x + st.w * 0.5;
                      const cy = FLOOR_Y - stepHeights[idx] - 10;
                      return `${cx},${cy}`;
                    }).join(' ');
                    return (
                      <>
                        <polyline
                          points={`330,${FLOOR_Y - 12} ${pts}`}
                          fill="none"
                          stroke={P.floorLo}
                          strokeWidth={5}
                          strokeDasharray="10 8"
                          strokeLinecap="round"
                          opacity={0.35}
                        />
                        <polyline
                          points={`330,${FLOOR_Y - 14} ${pts}`}
                          fill="none"
                          stroke={P.mustardHi}
                          strokeWidth={4}
                          strokeDasharray="10 8"
                          strokeLinecap="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>
            ) : null}

            {/* ============================================================= */}
            {/* BEAT D & E: CELAH KOSONG BESAR ("SELISIHNYA") & PENGISIANNYA  */}
            {/* ============================================================= */}
            {gapHighlightOpacity > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, opacity: gapHighlightOpacity}}>
                {/* Bingkai bayangan celah kosong di antara papan kraft yang melesat dan puncak tangga */}
                <div
                  style={{
                    position: 'absolute',
                    left: GAP_CX - GAP_W / 2,
                    top: GAP_TOP_Y,
                    width: GAP_W,
                    height: GAP_BOT_Y - GAP_TOP_Y,
                    backgroundColor: 'rgba(154, 90, 66, 0.13)',
                    borderLeft: `3.5px dashed ${P.terra}`,
                    borderRight: `3.5px dashed ${P.terra}`,
                    borderRadius: 8,
                  }}
                />

                {/* Panah ganda vertikal di tepi celah yang menegaskan rentang kekosongan besar */}
                <svg
                  width={1280}
                  height={720}
                  style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                >
                  <line
                    x1={GAP_CX - GAP_W / 2 - 22}
                    y1={GAP_TOP_Y + 8}
                    x2={GAP_CX - GAP_W / 2 - 22}
                    y2={GAP_BOT_Y - 8}
                    stroke={P.terra}
                    strokeWidth={3.5}
                    strokeDasharray="7 6"
                  />
                  <polygon
                    points={`${GAP_CX - GAP_W / 2 - 22},${GAP_TOP_Y + 2} ${GAP_CX - GAP_W / 2 - 30},${GAP_TOP_Y + 16} ${GAP_CX - GAP_W / 2 - 14},${GAP_TOP_Y + 16}`}
                    fill={P.terra}
                  />
                  <polygon
                    points={`${GAP_CX - GAP_W / 2 - 22},${GAP_BOT_Y - 2} ${GAP_CX - GAP_W / 2 - 30},${GAP_BOT_Y - 16} ${GAP_CX - GAP_W / 2 - 14},${GAP_BOT_Y - 16}`}
                    fill={P.terra}
                  />
                </svg>

                {/* BEAT E [538–665]: Kartu lowongan kertas berjatuhan masuk ke celah dari atas */}
                {f >= 546 ? (
                  <Boil seed="falling-vacancies" amp={0.4} rot={0.05}>
                    <div style={{position: 'absolute', inset: 0}}>
                      {FALLING_VACANCIES.map((vc, idx) => {
                        const startF = 552 + vc.delay;
                        const u = interpolate(qf, [startF, startF + 26], [0, 1], {
                          ...CLAMP,
                          easing: Easing.out(Easing.bounce),
                        });
                        if (u <= 0.01) return null;
                        const curY = interpolate(u, [0, 1], [GAP_TOP_Y - 16, vc.targetY], CLAMP);
                        const flutterX = Math.sin((1 - u) * Math.PI * 2 + idx) * 12 * (1 - u);
                        const curRot = interpolate(u, [0, 1], [vc.rot - 22, vc.rot], CLAMP);
                        return (
                          <VacancyCard
                            key={idx}
                            x={GAP_CX + vc.dx + flutterX}
                            y={curY}
                            rot={curRot}
                            opacity={interpolate(u, [0, 0.15, 1], [0, 1, 1], CLAMP)}
                          />
                        );
                      })}
                    </div>
                  </Boil>
                ) : null}

                {/* BEAT E [538–665]: Label harga mungil bermunculan tegak dari dasar celah sampai penuh */}
                {f >= 566 ? (
                  <Boil seed="rising-prices" amp={0.4} rot={0.05}>
                    <div style={{position: 'absolute', inset: 0}}>
                      {RISING_PRICE_TAGS.map((pt, idx) => {
                        const startF = 576 + pt.delay;
                        const u = interpolate(qf, [startF, startF + 18], [0, 1], {
                          ...CLAMP,
                          easing: Easing.out(Easing.back(1.8)),
                        });
                        if (u <= 0.01) return null;
                        const popY = interpolate(u, [0, 1], [pt.baseY + 28, pt.baseY], CLAMP);
                        return (
                          <UprightMiniPriceTag
                            key={idx}
                            x={GAP_CX + pt.dx}
                            y={popY}
                            rot={pt.rot * u}
                            scale={pt.s * interpolate(u, [0, 1], [0.4, 1], CLAMP)}
                            color={pt.col}
                            opacity={interpolate(u, [0, 0.2, 1], [0, 1, 1], CLAMP)}
                          />
                        );
                      })}
                    </div>
                  </Boil>
                ) : null}
              </div>
            ) : null}

            {/* ============================================================= */}
            {/* BEAT C [243–380]: Tumpukan Peti Kertas, Pekerja, Pemberi Kerja */}
            {/* ============================================================= */}
            {beatCEnter > 0.01 ? (
              <Boil seed="cast-and-crates" amp={0.4} rot={0.05}>
                <div style={{position: 'absolute', inset: 0, opacity: beatCEnter}}>
                  {/* Tumpukan peti kertas yang makin tinggi di tiap anak tangga */}
                  {STEPS.map((st, idx) => {
                    const stepLocalProg = interpolate(
                      cratesProgress,
                      [idx * 0.2, idx * 0.2 + 0.38],
                      [0, 1],
                      CLAMP,
                    );
                    // Di beat e saat celah terisi penuh oleh kartu lowongan & label harga, peti di tangga tetap terlihat di bagian depan-bawah
                    return (
                      <PaperCrateStack
                        key={idx}
                        x={st.x + st.w * 0.42}
                        yBottom={FLOOR_Y - stepHeights[idx]}
                        count={st.crates}
                        progress={stepLocalProg}
                      />
                    );
                  })}

                  {/* Pekerja pabrik berhelm kuning di atas tangga (postur tegak & lega) */}
                  <FacelessWorker
                    x={workerX + (f >= 450 ? 48 : 0)}
                    y={workerFootY}
                    s={0.86}
                    proud={workerProud}
                    carryCrate={f >= 248 && f < 322}
                  />

                  {/* Pemberi kerja berjas bata di sisi kanan tangga (memegang amplop makin tebal di beat c, menunduk & bahu turun di beat e) */}
                  <FacelessEmployer
                    x={1015}
                    y={FLOOR_Y}
                    s={1.04}
                    envelopeThick={employerEnvelopeThick}
                    slump={employerSlump}
                  />
                </div>
              </Boil>
            ) : null}

            {/* ============================================================= */}
            {/* ELEMEN TETAP 1: PAPAN LANTAI KRAFT (Alat / Rel / Melompat)    */}
            {/* ============================================================= */}
            <Boil seed="kraft-board-main" amp={0.4} rot={0.05}>
              <KraftToolBoard
                x={boardX}
                y={boardY}
                w={boardW}
                h={40}
                rot={boardRot}
                handleScale={interpolate(toRailU, [0, 1], [1, 0.72], CLAMP)}
                railClipOpacity={railClipOpacity}
                brokenClips={jumpOffRailU > 0.15}
              />
            </Boil>

            {/* Jejak garis putus-putus lompatan papan kraft dari rel ke atas tangga pada beat d */}
            {jumpOffRailU > 0.05 ? (
              <svg
                width={1280}
                height={720}
                style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
              >
                <path
                  d={`M 232 ${FLOOR_Y - 260} Q 340 120 ${boardX - boardW * 0.45} ${boardY}`}
                  fill="none"
                  stroke={P.terra}
                  strokeWidth={4}
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                  opacity={interpolate(jumpOffRailU, [0.05, 0.5, 1], [0, 0.85, 0.55], CLAMP)}
                />
              </svg>
            ) : null}

            {/* ============================================================= */}
            {/* LANTAI DASAR PANGGUNG TEATER KERTAS                           */}
            {/* ============================================================= */}
            <Paper lift={5}>
              <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={P.floor} r={0} grain={0.6} />
              <Slab
                x={0}
                y={FLOOR_Y - 20}
                w={1280}
                h={26}
                color={P.woodLo}
                shade={P.floorLo}
                shadeH={0.38}
                r={0}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    top: 6,
                    borderTop: `3px dashed ${P.kraftLo}`,
                    opacity: 0.65,
                  }}
                />
              </Slab>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: FLOOR_Y + 38,
                  height: 3,
                  backgroundColor: P.floorLo,
                  opacity: 0.75,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: FLOOR_Y + 78,
                  height: 3,
                  backgroundColor: P.floorLo,
                  opacity: 0.75,
                }}
              />
            </Paper>

            {/* ============================================================= */}
            {/* ELEMEN TETAP 3: LABEL KERTAS (HANYA DARI DAFTAR BRIEF-MGJ.md) */}
            {/* Daftar resmi:                                                 */}
            {/* "alat, bukan keajaiban", "sejalan dengan produktivitas",      */}
            {/* "pekerja menghasilkan lebih banyak", "melompat jauh",         */}
            {/* "selisihnya", "pekerjaan yang hilang", "harga yang naik"      */}
            {/* ============================================================= */}

            {/* Beat a [0–93]: "alat, bukan keajaiban" */}
            <PaperLabel
              x={640}
              y={112}
              text="alat, bukan keajaiban"
              at={34}
              outAt={106}
              bg={P.mustardHi}
              color={P.floorLo}
              size={30}
              rot={-1.4}
              seed="lbl-alat"
            />

            {/* Beat b [119–380]: "sejalan dengan produktivitas" */}
            <PaperLabel
              x={375}
              y={104}
              text="sejalan dengan produktivitas"
              at={176}
              outAt={392}
              bg={P.mustardHi}
              color={P.floorLo}
              size={27}
              rot={-1.6}
              seed="lbl-sejalan"
            />

            {/* Beat c [243–380]: "pekerja menghasilkan lebih banyak" */}
            <PaperLabel
              x={855}
              y={104}
              text="pekerja menghasilkan lebih banyak"
              at={254}
              outAt={392}
              bg={P.creamCard}
              color={P.floorLo}
              size={25}
              rot={1.3}
              seed="lbl-pekerja-banyak"
            />

            {/* Beat d [401–665]: "melompat jauh" */}
            <PaperLabel
              x={310}
              y={132}
              text="melompat jauh"
              at={460}
              bg={P.terra}
              color={P.creamBg}
              size={28}
              rot={-2.1}
              seed="lbl-melompat"
            />

            {/* Beat e [538–665]: "selisihnya", "pekerjaan yang hilang", "harga yang naik" */}
            <PaperLabel
              x={955}
              y={140}
              text="selisihnya"
              at={558}
              bg={P.mustardHi}
              color={P.floorLo}
              size={28}
              rot={1.6}
              seed="lbl-selisihnya"
            />

            <PaperLabel
              x={255}
              y={236}
              text="pekerjaan yang hilang"
              at={586}
              bg={P.terra}
              color={P.creamBg}
              size={25}
              rot={-1.5}
              seed="lbl-pekerjaan-hilang"
            />

            <PaperLabel
              x={255}
              y={324}
              text="harga yang naik"
              at={636}
              bg={P.creamCard}
              color={P.floorLo}
              size={26}
              rot={1.4}
              seed="lbl-harga-naik"
            />

            {/* ============================================================= */}
            {/* BINGKAI TIRAI PANGGUNG TEATER KERTAS TERAKOTA                 */}
            {/* ============================================================= */}
            <Paper lift={7}>
              <Slab
                x={-16}
                y={-10}
                w={52}
                h={740}
                color={P.terraLo}
                shade={P.floor}
                shadeH={0.14}
                r="0 12px 12px 0"
              />
              <Slab
                x={1244}
                y={-10}
                w={52}
                h={740}
                color={P.terraLo}
                shade={P.floor}
                shadeH={0.14}
                r="12px 0 0 12px"
              />
              <Slab
                x={0}
                y={curtainTopY}
                w={1280}
                h={108}
                color={P.terra}
                shade={P.terraLo}
                shadeH={0.28}
                r="0 0 18px 18px"
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 10,
                    borderBottom: `3px dashed ${P.mustardHi}`,
                    opacity: 0.75,
                  }}
                />
              </Slab>
            </Paper>
          </SnapZoom>
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
