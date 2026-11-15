// Adegan P05: Pertanyaan di Atas Meja (scene 27-31) di ruang baca malam bergaya potongan kertas.
// Menampilkan tokoh utama dan timbangan dua piring tanpa skala yang membuka mekanisme roda gigi serta kaca pembesar.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Plant, Shelf, Window} from '../../lib/paper/sets';

export const P05_DUR = 510;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const DESK_Y = 536;
const SCALE_X = 730;
const BEAM_Y = 278;
const BEAM_HALF = 152;

const smooth = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

const calmWave = (f: number, period: number, amp: number, phase = 0) =>
  Math.sin(((f + phase) / period) * Math.PI * 2) * amp;

const GearSvg: React.FC<{
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  angle: number;
  fill: string;
  shade: string;
  hub: string;
}> = ({cx, cy, r, teeth, angle, fill, shade, hub}) => {
  const toothH = Math.max(5, r * 0.22);
  const innerR = r * 0.44;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
      <circle cx={2} cy={3} r={r + toothH * 0.55} fill="rgba(0,0,0,0.34)" />
      {Array.from({length: teeth}).map((_, i) => {
        const deg = (i * 360) / teeth;
        return (
          <rect
            key={i}
            x={-toothH * 0.46}
            y={-(r + toothH * 0.72)}
            width={toothH * 0.92}
            height={toothH * 0.95}
            rx={2}
            fill={shade}
            transform={`rotate(${deg})`}
          />
        );
      })}
      <circle cx={0} cy={0} r={r} fill={fill} stroke={shade} strokeWidth={2} />
      <circle cx={0} cy={0} r={innerR} fill={shade} />
      {[0, 60, 120].map((deg) => (
        <rect
          key={deg}
          x={-r * 0.78}
          y={-2.5}
          width={r * 1.56}
          height={5}
          rx={2}
          fill={fill}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle cx={0} cy={0} r={innerR * 0.52} fill={hub} />
    </g>
  );
};

const Figurine: React.FC<{
  kind: 'middle' | 'poor';
  breathe: number;
}> = ({kind, breathe}) => {
  const isMiddle = kind === 'middle';
  const shirt = isMiddle ? ROOM.slate : C.sage;
  const shirtShade = isMiddle ? '#3A4B5C' : C.sageLo;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 56,
        height: 112,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `rotate(${breathe}deg)`,
        filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.32))',
      }}
    >
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          width: 30,
          height: 30,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2px solid ${C.inkSoft}`,
        }}
      />
      {/* Badan kemeja / pakaian sederhana rapi */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 35,
          width: 36,
          height: 46,
          translate: '-50% 0',
          backgroundColor: shirt,
          borderRadius: '8px 8px 4px 4px',
          borderBottom: `4px solid ${shirtShade}`,
        }}
      />
      {/* Syal hangat terakota hanya untuk figurin kelas menengah */}
      {isMiddle ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 33,
              width: 34,
              height: 9,
              translate: '-50% 0',
              backgroundColor: C.hero,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 33,
              top: 40,
              width: 8,
              height: 22,
              backgroundColor: C.heroLo,
              borderRadius: 3,
              transform: 'rotate(-6deg)',
            }}
          />
        </>
      ) : null}
      {/* Lengan */}
      <div
        style={{
          position: 'absolute',
          left: 5,
          top: 38,
          width: 7,
          height: 34,
          backgroundColor: shirtShade,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 5,
          top: 38,
          width: 7,
          height: 34,
          backgroundColor: shirtShade,
          borderRadius: 4,
        }}
      />
      {/* Tas kantor kecil untuk figurin kelas menengah; tangan kosong untuk figurin miskin */}
      {isMiddle ? (
        <div
          style={{
            position: 'absolute',
            right: -3,
            top: 66,
            width: 16,
            height: 13,
            backgroundColor: C.wood,
            border: `1.5px solid ${C.woodLo}`,
            borderRadius: 3,
          }}
        />
      ) : null}
      {/* Kaki bermartabat, tinggi sama */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 81,
          width: 10,
          height: 31,
          backgroundColor: C.inkSoft,
          borderRadius: '2px 2px 4px 4px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 81,
          width: 10,
          height: 31,
          backgroundColor: C.inkSoft,
          borderRadius: '2px 2px 4px 4px',
        }}
      />
    </div>
  );
};

const MainCharacter: React.FC<{
  x: number;
  y: number;
  sitUp: number;
  nodDeg: number;
  reachLens: number;
  breathe: number;
}> = ({x, y, sitUp, nodDeg, reachLens, breathe}) => {
  const leanDeg = interpolate(sitUp, [0, 1], [11, 1], CLAMP);
  const headTilt = interpolate(sitUp, [0, 1], [12, 0], CLAMP) + nodDeg;
  const elbowLift = interpolate(sitUp, [0, 1], [0, 18], CLAMP);

  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {/* Kursi kayu kertas */}
      <Paper lift={4}>
        <Slab x={-64} y={-225} w={18} h={225} color={C.woodLo} r={4} />
        <Slab x={-68} y={-215} w={24} h={72} color={C.wood} shade={C.woodLo} shadeH={0.2} r={5} />
        <Slab x={-64} y={-104} w={106} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
        <Slab x={22} y={-88} w={16} h={88} color={C.woodLo} r={4} />
      </Paper>

      {/* Tas kantor di samping kursi, konsisten dengan P01-P03 */}
      <Paper lift={5}>
        <div style={{position: 'absolute', left: -112, top: -74, width: 66, height: 74}}>
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: -12,
              width: 26,
              height: 16,
              border: `4px solid ${C.woodLo}`,
              borderBottom: 'none',
              borderRadius: '10px 10px 0 0',
            }}
          />
          <Slab x={0} y={0} w={66} h={74} color={C.wood} shade={C.woodLo} shadeH={0.22} r={8} />
          <Slab x={0} y={0} w={66} h={30} color={C.woodHi} shade={C.wood} shadeH={0.25} r="8px 8px 12px 12px" />
          <Slab x={27} y={24} w={12} h={14} color={C.brass} shade={C.brassLo} shadeH={0.3} r={3} />
        </div>
      </Paper>

      {/* Kaki duduk di bawah meja */}
      <Paper lift={3}>
        <Slab x={-22} y={-102} w={92} h={24} color={C.inkSoft} r={8} />
        <Slab x={48} y={-96} w={24} h={96} color={C.inkSoft} r={7} />
        <Slab x={46} y={-14} w={38} h={14} color={C.ink} r={5} />
      </Paper>

      {/* Tubuh atas, kemeja biru sabak, syal terakota, kepala polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: -102,
          transformOrigin: '16px 0px',
          transform: `rotate(${leanDeg + breathe * 0.35}deg)`,
          filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.35))',
        }}
      >
        {/* Torso kemeja biru sabak */}
        <Slab x={-22} y={-126} w={74} h={128} color={ROOM.slate} shade="#394B5C" shadeH={0.18} r="22px 22px 8px 8px" />
        {/* Lipatan kerah kemeja */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: -124,
            width: 24,
            height: 24,
            backgroundColor: C.cream,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />
        {/* Syal kertas hangat terakota */}
        <Slab x={-16} y={-132} w={64} h={20} color={C.hero} shade={C.heroLo} shadeH={0.28} r={9} />
        <Slab x={24} y={-118} w={18} h={58} color={C.hero} shade={C.heroLo} shadeH={0.2} r={5} rot={-6} />
        <Slab x={10} y={-116} w={15} h={46} color={C.heroLo} r={5} rot={5} />

        {/* Kepala bulat polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: -12,
            top: -194,
            width: 62,
            height: 62,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
            transformOrigin: '31px 58px',
            transform: `rotate(${headTilt}deg)`,
            boxShadow: 'inset -6px -6px 0 rgba(0,0,0,0.08)',
          }}
        />

        {/* Lengan penopang dagu (Beat 1-3, 5) vs lengan mengulurkan kaca pembesar (Beat 4) */}
        <div style={{opacity: 1 - reachLens}}>
          {/* Lengan atas menuju siku di meja */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -102,
              width: 22,
              height: 76 - elbowLift * 0.4,
              backgroundColor: '#3E5163',
              borderRadius: 10,
              transformOrigin: '11px 8px',
              transform: `rotate(${interpolate(sitUp, [0, 1], [-34, -18], CLAMP)}deg)`,
            }}
          />
          {/* Lengan bawah naik ke dagu (saat sitUp=0) atau turun ke meja (saat sitUp=1) */}
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: -42 + elbowLift,
              width: 20,
              height: 76,
              backgroundColor: ROOM.slate,
              borderRadius: 9,
              transformOrigin: '10px 68px',
              transform: `rotate(${interpolate(sitUp, [0, 1], [-18, 62], CLAMP)}deg)`,
            }}
          />
          {/* Tangan kertas */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(sitUp, [0, 1], [32, 114], CLAMP),
              top: interpolate(sitUp, [0, 1], [-134, -18], CLAMP),
              width: 22,
              height: 18,
              borderRadius: 9,
              backgroundColor: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ThoughtBubble: React.FC<{opacity: number; floatY: number}> = ({opacity, floatY}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 410,
        top: 168 + floatY,
        opacity,
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.35))',
      }}
    >
      <svg width={180} height={140} viewBox="0 0 180 140" style={{overflow: 'visible'}}>
        {/* Jejak bulatan kecil putus-putus */}
        <circle
          cx={22}
          cy={118}
          r={6}
          fill="rgba(232,223,211,0.16)"
          stroke={C.creamHi}
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <circle
          cx={38}
          cy={98}
          r={10}
          fill="rgba(232,223,211,0.18)"
          stroke={C.creamHi}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        {/* Gelembung pikiran kosong putus-putus (tanpa tanda tanya atau simbol) */}
        <path
          d="M54 68 C44 68 38 58 43 48 C42 34 55 24 69 28 C78 16 98 16 108 28 C122 24 136 34 135 48 C144 54 142 70 130 74 C126 86 110 90 100 83 C90 91 72 89 66 79 C58 81 51 75 54 68 Z"
          fill="rgba(232,223,211,0.14)"
          stroke={C.creamHi}
          strokeWidth={2.5}
          strokeDasharray="8 6"
        />
      </svg>
    </div>
  );
};

const DeskLampProp: React.FC<{lower: number; sway: number}> = ({lower, sway}) => {
  const armAngle = interpolate(lower, [0, 1], [-22, -37], CLAMP) + sway;
  const headAngle = interpolate(lower, [0, 1], [34, 48], CLAMP) - sway * 0.6;
  const glowOpacity = interpolate(lower, [0, 1], [0.16, 0.27], CLAMP);

  return (
    <div style={{position: 'absolute', left: 1055, top: DESK_Y}}>
      <Paper lift={6}>
        {/* Alas lampu meja */}
        <Slab x={-48} y={-20} w={96} h={20} color={C.brassLo} shade={C.woodLo} shadeH={0.35} r="10px 10px 3px 3px" />
        <Slab x={-34} y={-32} w={68} h={14} color={C.brass} r="8px 8px 2px 2px" />
        {/* Tiang bawah */}
        <Slab x={-7} y={-148} w={14} h={120} color={C.inkSoft} r={5} />
        {/* Lengan artikulasi atas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -144,
            transformOrigin: '0px 0px',
            transform: `rotate(${armAngle}deg)`,
          }}
        >
          <Slab x={-168} y={-6} w={172} h={12} color={C.inkSoft} r={6} />
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: -10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: C.brass,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
          {/* Kap lampu kertas besar */}
          <div
            style={{
              position: 'absolute',
              left: -166,
              top: 0,
              transformOrigin: '0px 0px',
              transform: `rotate(${headAngle}deg)`,
            }}
          >
            {/* Kerucut cahaya hangat */}
            <div
              style={{
                position: 'absolute',
                left: -240,
                top: 56,
                width: 480,
                height: 360,
                background: `radial-gradient(ellipse at 50% 0%, rgba(255,228,148,${glowOpacity}) 0%, rgba(255,210,115,${glowOpacity * 0.45}) 52%, rgba(255,210,115,0) 82%)`,
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
              }}
            />
            <Slab
              x={-58}
              y={0}
              w={116}
              h={64}
              color={C.amber}
              shade={C.amberDim}
              shadeH={0.22}
              r="52px 52px 6px 6px"
            />
            <Slab x={-64} y={56} w={128} h={10} color={C.brass} r={4} />
          </div>
        </div>
      </Paper>
    </div>
  );
};

const BalanceScale: React.FC<{
  tiltDeg: number;
  openProgress: number;
  pinchProgress: number;
  pinchOpacity: number;
  gearAngle: number;
  breathe: number;
}> = ({tiltDeg, openProgress, pinchProgress, pinchOpacity, gearAngle, breathe}) => {
  const rad = (tiltDeg * Math.PI) / 180;
  const leftPanX = SCALE_X - Math.cos(rad) * BEAM_HALF;
  const leftPanY = BEAM_Y - Math.sin(rad) * BEAM_HALF + 84;
  const rightPanX = SCALE_X + Math.cos(rad) * BEAM_HALF;
  const rightPanY = BEAM_Y + Math.sin(rad) * BEAM_HALF + 84;

  const doorSlide = openProgress * 46;
  const doorAngle = openProgress * 16;
  const pinchGap = interpolate(pinchProgress, [0, 1], [92, 34], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Mekanisme berlapis di belakang & dalam tiang (muncul saat terbuka di Beat 3) */}
      <div
        style={{
          position: 'absolute',
          left: SCALE_X - 190,
          top: BEAM_Y - 10,
          width: 380,
          height: DESK_Y - BEAM_Y + 10,
          opacity: interpolate(openProgress, [0.05, 0.35], [0, 1], CLAMP),
        }}
      >
        <svg width={380} height={270} viewBox="0 0 380 270" style={{overflow: 'visible'}}>
          {/* Ruang mekanisme gelap di balik panel */}
          <rect
            x={136}
            y={42}
            width={108}
            height={196}
            rx={10}
            fill="#1D1712"
            stroke={C.brassLo}
            strokeWidth={3}
          />
          {/* Katrol kertas kiri & kanan di bawah palang */}
          <g transform="translate(88 44)">
            <circle cx={0} cy={0} r={16} fill={C.woodLo} stroke={C.brass} strokeWidth={3} />
            <circle cx={0} cy={0} r={5} fill={C.cream} />
          </g>
          <g transform="translate(292 44)">
            <circle cx={0} cy={0} r={16} fill={C.woodLo} stroke={C.brass} strokeWidth={3} />
            <circle cx={0} cy={0} r={5} fill={C.cream} />
          </g>
          {/* Katrol tengah bawah */}
          <g transform="translate(190 206)">
            <circle cx={0} cy={0} r={14} fill={C.brassLo} stroke={C.brass} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={4} fill={C.cream} />
          </g>
          {/* Tali/pita kertas penghubung piring ke katrol dan poros roda gigi */}
          <polyline
            points={`${leftPanX - (SCALE_X - 190)},${leftPanY - (BEAM_Y - 10) + 12} 88,58 156,128 190,206 224,128 292,58 ${rightPanX - (SCALE_X - 190)},${rightPanY - (BEAM_Y - 10) + 12}`}
            fill="none"
            stroke={C.tape}
            strokeWidth={2.5}
            strokeDasharray="6 3"
          />
          {/* Susunan roda gigi kertas saling bertautan */}
          <GearSvg
            cx={176}
            cy={102}
            r={26}
            teeth={12}
            angle={gearAngle}
            fill={C.brass}
            shade={C.brassLo}
            hub={C.cream}
          />
          <GearSvg
            cx={214}
            cy={132}
            r={21}
            teeth={10}
            angle={-gearAngle * 1.2 + 14}
            fill={C.hero}
            shade={C.heroLo}
            hub={C.cream}
          />
          <GearSvg
            cx={172}
            cy={162}
            r={22}
            teeth={10}
            angle={gearAngle * 1.2 + 6}
            fill={C.metal}
            shade={C.metalLo}
            hub={C.inkSoft}
          />
          <GearSvg
            cx={212}
            cy={186}
            r={15}
            teeth={8}
            angle={-gearAngle * 1.5}
            fill={C.amber}
            shade={C.amberDim}
            hub={C.cream}
          />
        </svg>
      </div>

      {/* Tiang utama & alas kayu timbangan (tanpa skala, tanpa angka) */}
      <Paper lift={5}>
        <Slab x={SCALE_X - 96} y={DESK_Y - 22} w={192} h={22} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r="8px 8px 2px 2px" />
        <Slab x={SCALE_X - 74} y={DESK_Y - 38} w={148} h={18} color={C.wood} shade={C.woodLo} shadeH={0.3} r="6px 6px 2px 2px" />
        <Slab x={SCALE_X - 16} y={BEAM_Y - 8} w={32} h={DESK_Y - BEAM_Y - 28} color={C.brassLo} shade={C.woodLo} shadeH={0.2} r={6} />
        {/* Puncak poros polos */}
        <div
          style={{
            position: 'absolute',
            left: SCALE_X - 16,
            top: BEAM_Y - 24,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `3px solid ${C.brassLo}`,
          }}
        />
      </Paper>

      {/* Pintu panel depan kotak timbangan yang membuka ke kiri-kanan di Beat 3 */}
      <div
        style={{
          position: 'absolute',
          left: SCALE_X - 54 - doorSlide,
          top: BEAM_Y + 32,
          transformOrigin: '0% 50%',
          transform: `rotate(${-doorAngle}deg)`,
          filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
        }}
      >
        <Slab x={0} y={0} w={54} h={196} color={C.wood} shade={C.woodLo} shadeH={0.14} r="8px 2px 2px 8px" />
        <Slab x={10} y={16} w={34} h={164} color={C.woodHi} r={4} />
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: 92,
            width: 7,
            height: 14,
            borderRadius: 4,
            backgroundColor: C.brass,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: SCALE_X + doorSlide,
          top: BEAM_Y + 32,
          transformOrigin: '100% 50%',
          transform: `rotate(${doorAngle}deg)`,
          filter: 'drop-shadow(-2px 4px 6px rgba(0,0,0,0.4))',
        }}
      >
        <Slab x={0} y={0} w={54} h={196} color={C.wood} shade={C.woodLo} shadeH={0.14} r="2px 8px 8px 2px" />
        <Slab x={10} y={16} w={34} h={164} color={C.woodHi} r={4} />
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 92,
            width: 7,
            height: 14,
            borderRadius: 4,
            backgroundColor: C.brass,
          }}
        />
      </div>

      {/* Palang timbangan berporos di puncak tiang */}
      <div
        style={{
          position: 'absolute',
          left: SCALE_X,
          top: BEAM_Y,
          transformOrigin: '0px 0px',
          transform: `rotate(${tiltDeg}deg)`,
          filter: 'drop-shadow(1px 3px 5px rgba(0,0,0,0.35))',
        }}
      >
        <Slab x={-BEAM_HALF - 12} y={-7} w={(BEAM_HALF + 12) * 2} h={14} color={C.brass} shade={C.brassLo} shadeH={0.35} r={7} />
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: C.cream,
            border: `3px solid ${C.brassLo}`,
          }}
        />
      </div>

      {/* Piring kiri + tali gantung vertikal + figurin kelas menengah */}
      <div style={{position: 'absolute', left: leftPanX, top: leftPanY}}>
        <div
          style={{
            position: 'absolute',
            left: -1.5,
            top: -84,
            width: 3,
            height: 84,
            backgroundColor: C.brassLo,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -46,
            top: -84,
            width: 92,
            height: 84,
            borderLeft: `2px solid ${C.brass}`,
            borderRight: `2px solid ${C.brass}`,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            opacity: 0.75,
          }}
        />
        <Figurine kind="middle" breathe={breathe * 0.45} />
        <Slab x={-56} y={0} w={112} h={13} color={C.brass} shade={C.brassLo} shadeH={0.4} r="3px 3px 14px 14px" />
      </div>

      {/* Piring kanan + tali gantung vertikal + figurin orang miskin (sama besar, bermartabat) */}
      <div style={{position: 'absolute', left: rightPanX, top: rightPanY}}>
        <div
          style={{
            position: 'absolute',
            left: -1.5,
            top: -84,
            width: 3,
            height: 84,
            backgroundColor: C.brassLo,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -46,
            top: -84,
            width: 92,
            height: 84,
            borderLeft: `2px solid ${C.brass}`,
            borderRight: `2px solid ${C.brass}`,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            opacity: 0.75,
          }}
        />
        <Figurine kind="poor" breathe={-breathe * 0.45} />
        <Slab x={-56} y={0} w={112} h={13} color={C.brass} shade={C.brassLo} shadeH={0.4} r="3px 3px 14px 14px" />
      </div>

      {/* Beat 2: Dua panel dinding kertas kecil menutup kiri-kanan figurin kelas menengah lalu memudar */}
      {pinchOpacity > 0.01 ? (
        <div style={{opacity: pinchOpacity}}>
          <div style={{position: 'absolute', left: leftPanX - pinchGap - 28, top: leftPanY - 126}}>
            <Paper lift={6}>
              <Slab x={0} y={0} w={28} h={124} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.2} r={4} />
              <Slab x={4} y={10} w={20} h={104} color={C.hero} r={2} />
            </Paper>
          </div>
          <div style={{position: 'absolute', left: leftPanX + pinchGap, top: leftPanY - 126}}>
            <Paper lift={6}>
              <Slab x={0} y={0} w={28} h={124} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.2} r={4} />
              <Slab x={4} y={10} w={20} h={104} color={C.hero} r={2} />
            </Paper>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MagnifyingHand: React.FC<{
  reach: number;
  gearAngle: number;
  hoverY: number;
}> = ({reach, gearAngle, hoverY}) => {
  if (reach <= 0.01) return null;
  const handX = interpolate(reach, [0, 1], [-220, 0], CLAMP);
  const lensX = SCALE_X + handX;
  const lensY = BEAM_Y + 128 + hoverY;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Lingkaran sorot hangat kaca pembesar di atas mekanisme timbangan */}
      <div
        style={{
          position: 'absolute',
          left: lensX - 115,
          top: lensY - 115,
          width: 230,
          height: 230,
          borderRadius: '50%',
          opacity: reach * 0.85,
          background:
            'radial-gradient(circle, rgba(255,232,162,0.34) 0%, rgba(255,216,120,0.14) 62%, rgba(255,216,120,0) 100%)',
        }}
      />

      {/* Lengan baju biru sabak + tangan kertas mengulurkan kaca pembesar */}
      <div
        style={{
          position: 'absolute',
          left: lensX - 270,
          top: lensY + 46,
          transform: 'rotate(-16deg)',
          filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.4))',
        }}
      >
        <Slab x={0} y={0} w={175} h={28} color={ROOM.slate} shade="#394B5C" shadeH={0.25} r={12} />
        <Slab x={156} y={-4} w={16} h={36} color={C.creamHi} r={4} />
        <Slab x={168} y={-2} w={36} h={32} color={C.creamLo} r={14} />
      </div>

      {/* Gagang & bingkai kaca pembesar kertas dengan pembesaran roda gigi di dalamnya */}
      <div
        style={{
          position: 'absolute',
          left: lensX,
          top: lensY,
          filter: 'drop-shadow(3px 8px 10px rgba(0,0,0,0.45))',
        }}
      >
        {/* Gagang kayu */}
        <div
          style={{
            position: 'absolute',
            left: -86,
            top: 42,
            width: 56,
            height: 16,
            backgroundColor: C.wood,
            border: `2px solid ${C.woodLo}`,
            borderRadius: 8,
            transform: 'rotate(-42deg)',
          }}
        />
        {/* Lensa bundar dengan tampilan roda gigi yang diperbesar */}
        <svg width={136} height={136} viewBox="-68 -68 136 136" style={{position: 'absolute', left: -68, top: -68}}>
          <defs>
            <clipPath id="p05-lens-clip">
              <circle cx={0} cy={0} r={54} />
            </clipPath>
          </defs>
          <circle cx={0} cy={0} r={56} fill="#261E16" />
          <g clipPath="url(#p05-lens-clip)">
            <rect x={-60} y={-60} width={120} height={120} fill="#2B2118" />
            <GearSvg
              cx={-14}
              cy={-16}
              r={34}
              teeth={12}
              angle={gearAngle}
              fill={C.brass}
              shade={C.brassLo}
              hub={C.cream}
            />
            <GearSvg
              cx={32}
              cy={20}
              r={27}
              teeth={10}
              angle={-gearAngle * 1.2 + 14}
              fill={C.hero}
              shade={C.heroLo}
              hub={C.cream}
            />
            <circle cx={0} cy={0} r={54} fill="rgba(255,236,178,0.16)" />
            {/* Kilau kaca diagonal */}
            <path d="M-36 -24 L-12 -44 L-2 -38 L-28 -16 Z" fill="rgba(255,255,255,0.28)" />
          </g>
          {/* Bingkai kuningan kertas */}
          <circle cx={0} cy={0} r={56} fill="none" stroke={C.brass} strokeWidth={8} />
          <circle cx={0} cy={0} r={60} fill="none" stroke={C.brassLo} strokeWidth={2.5} />
        </svg>
      </div>
    </div>
  );
};

export const P05: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak napas & ayunan kertas yang sangat tenang
  const breathe = calmWave(f, 150, 1.3);
  const lampSway = calmWave(f, 190, 0.7, 25);
  const bubbleFloat = calmWave(f, 110, 4.5);
  const lensHover = calmWave(f, 95, 2.5);

  // Beat 1 (0-125): Gelembung pikiran kosong putus-putus
  const bubbleIn = smooth(f, 14, 34, 0, 1);
  const bubbleOut = smooth(f, 130, 148, 1, 0);
  const bubbleOpacity = Math.min(bubbleIn, bubbleOut);

  // Beat 2 (154-217): Piring kiri bergoyang turun lalu kembali; panel jepit menutup lalu memudar
  const panDipDown = smooth(f, 155, 178, 0, -6.5);
  const panDipUp = smooth(f, 188, 210, 0, 6.5);
  const tiltDeg = panDipDown + panDipUp;
  const pinchProgress = smooth(f, 158, 182, 0, 1);
  const pinchOpacity =
    Math.min(smooth(f, 156, 168, 0, 1), smooth(f, 216, 230, 1, 0));

  // Beat 3 (231-353): Timbangan terbuka menyingkap roda gigi & katrol; tirai belakang menyibak lorong buku
  const openProgress = smooth(f, 233, 272, 0, 1);
  const curtainOpen = smooth(f, 238, 305, 0, 1);

  // Putaran roda gigi aktif di Beat 3-4, lalu melambat dan berhenti tenang di Beat 5 sebelum frame akhir
  const gearAngle = interpolate(
    f,
    [232, 355, 438, 492],
    [0, 118, 196, 224],
    {...CLAMP, easing: Easing.out(Easing.quad)},
  );

  // Beat 4 (366-423): Lampu meja menurun mendekat & tangan menurunkan kaca pembesar
  const lampLower =
    Math.min(smooth(f, 366, 392, 0, 1), smooth(f, 424, 444, 1, 0.25));
  const lensReach =
    Math.min(smooth(f, 368, 394, 0, 1), smooth(f, 423, 438, 1, 0));

  // Beat 5 (438-510): Tokoh mengangguk, menarik kursi lebih dekat, menegakkan badan; pose akhir ditahan
  const nodDown = smooth(f, 442, 455, 0, 7);
  const nodUp = smooth(f, 455, 470, 0, -7);
  const nodDeg = nodDown + nodUp;
  const chairSlideX = smooth(f, 448, 478, 0, 20);
  const sitUp = smooth(f, 452, 484, 0, 1);

  // Koreografi kamera 5 beat yang jelas terlihat & mendarat mulus sebelum frame 510
  let camScale = 1.04;
  let camPanX = -15;
  let camPanY = 0;

  if (f <= 130) {
    // Beat 1: Dolly-in dari bidikan lebar ruang baca ke meja
    camScale = smooth(f, 0, 125, 0.96, 1.24);
    camPanX = smooth(f, 0, 125, 28, -42);
    camPanY = smooth(f, 0, 125, 10, -24);
  } else if (f <= 220) {
    // Beat 2: Bidikan dekat pada timbangan dengan pan pendek kiri ke kanan
    const enterClose = smooth(f, 130, 156, 0, 1);
    const panLR = smooth(f, 156, 216, 0, 1);
    camScale = interpolate(enterClose, [0, 1], [1.24, 1.5], CLAMP);
    camPanX =
      interpolate(enterClose, [0, 1], [-42, 52], CLAMP) +
      interpolate(panLR, [0, 1], [0, -192], CLAMP);
    camPanY = interpolate(enterClose, [0, 1], [-24, -44], CLAMP);
  } else if (f <= 358) {
    // Beat 3: Pull-back dengan pan kecil menyingkap mekanisme & kedalaman ruang
    camScale = smooth(f, 224, 348, 1.5, 1.12);
    camPanX = smooth(f, 224, 348, -140, -52);
    camPanY = smooth(f, 224, 348, -44, -14);
  } else if (f <= 432) {
    // Beat 4: Dolly-in dekat ke kaca pembesar & mekanisme
    camScale = smooth(f, 362, 418, 1.12, 1.44);
    camPanX = smooth(f, 362, 418, -52, -78);
    camPanY = smooth(f, 362, 418, -14, -52);
  } else {
    // Beat 5: Pull-out pelan ke bidikan sedang ruang baca, mendarat di frame 498 dan ditahan
    camScale = smooth(f, 434, 498, 1.44, 1.04);
    camPanX = smooth(f, 434, 498, -78, -15);
    camPanY = smooth(f, 434, 498, -52, 0);
  }

  const layerTransform = (parallax: number) => ({
    transformOrigin: '640px 360px',
    transform: `translate(${camPanX * parallax}px, ${camPanY * parallax}px) scale(${1 + (camScale - 1) * parallax})`,
  });

  const curtainShift = curtainOpen * 135;

  return (
    <AbsoluteFill style={{backgroundColor: '#1B2234', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 1 (Latar jauh): Dinding malam, jendela berbulan, lorong buku dalam di balik tirai */}
        <AbsoluteFill style={layerTransform(0.35)}>
          <Slab x={-140} y={-90} w={1560} h={900} color={ROOM.navy} shade="#192133" shadeH={0.45} r={0} grain={0.55} />

          {/* Lorong buku yang lebih dalam (terungkap saat tirai terbuka di Beat 3) */}
          <div
            style={{
              position: 'absolute',
              left: 470,
              top: 72,
              width: 340,
              height: 468,
              backgroundColor: '#231C18',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 36px rgba(0,0,0,0.75)',
            }}
          >
            {/* Lengkungan lorong kertas berlapis */}
            <Slab x={24} y={24} w={292} h={440} color="#34271E" r="146px 146px 0 0" />
            <Slab x={64} y={56} w={212} h={408} color="#4A3628" r="106px 106px 0 0" />
            <Slab x={102} y={88} w={136} h={376} color="#6E4E34" r="68px 68px 0 0" />
            {/* Cahaya lentera hangat di ujung lorong */}
            <div
              style={{
                position: 'absolute',
                left: 118,
                top: 96,
                width: 104,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(243,165,59,0.42) 0%, rgba(243,165,59,0) 75%)',
              }}
            />
            {/* Rak buku kecil berlapis di lorong (punggung buku kosong polos) */}
            <Shelf x={34} y={210} w={110} books={2} />
            <Shelf x={196} y={210} w={110} books={2} />
            <Shelf x={74} y={325} w={192} books={3} />
          </div>

          {/* Jendela malam di kiri dengan bulan sabit kertas */}
          <Window x={84} y={76} w={236} h={310} night />
          <div
            style={{
              position: 'absolute',
              left: 132,
              top: 122,
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: C.amber,
              boxShadow: '0 0 18px rgba(243,165,59,0.45)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 142,
              top: 117,
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: '#1F2A44',
            }}
          />
        </AbsoluteFill>

        {/* LAPISAN 2 (Latar tengah): Rak buku tinggi polos, tirai tengah yang menyibak, tanaman kertas */}
        <AbsoluteFill style={layerTransform(0.65)}>
          {/* Rak buku tinggi kanan (punggung buku kosong tanpa teks/angka) */}
          <Paper lift={5}>
            <Slab x={910} y={64} w={290} h={476} color={C.woodLo} shade="#3D2616" shadeH={0.2} r={6} />
            <Slab x={926} y={80} w={258} h={452} color="#2B1C13" r={3} />
          </Paper>
          <Shelf x={922} y={214} w={266} books={4} />
          <Shelf x={922} y={356} w={266} books={5} />
          <Shelf x={922} y={496} w={266} books={4} />

          {/* Rak buku kiri atas di sebelah jendela */}
          <Shelf x={338} y={208} w={132} books={2} />

          {/* Tirai tengah yang menyibak di Beat 3 */}
          <div style={{position: 'absolute', left: 454 - curtainShift, top: 64}}>
            <Paper lift={6}>
              <Slab
                x={0}
                y={0}
                w={192}
                h={478}
                color={ROOM.terracotta}
                shade={C.heroLo}
                shadeH={0.12}
                r="4px 4px 26px 26px"
              />
              <Slab x={34} y={0} w={22} h={474} color={C.heroLo} r={4} />
              <Slab x={108} y={0} w={22} h={474} color={C.heroLo} r={4} />
            </Paper>
          </div>
          <div style={{position: 'absolute', left: 634 + curtainShift, top: 64}}>
            <Paper lift={6}>
              <Slab
                x={0}
                y={0}
                w={192}
                h={478}
                color={ROOM.terracotta}
                shade={C.heroLo}
                shadeH={0.12}
                r="4px 4px 26px 26px"
              />
              <Slab x={56} y={0} w={22} h={474} color={C.heroLo} r={4} />
              <Slab x={132} y={0} w={22} h={474} color={C.heroLo} r={4} />
            </Paper>
          </div>
          {/* Pelmet/balok tirai atas */}
          <Paper lift={6}>
            <Slab x={442} y={54} w={396} h={24} color={C.wood} shade={C.woodLo} shadeH={0.35} r={5} />
          </Paper>

          {/* Tanaman kertas di sudut kiri */}
          <Plant x={-16} y={320} s={0.76} />
        </AbsoluteFill>

        {/* LAPISAN 3 (Panggung utama): Lantai, meja kerja, tokoh "kamu", timbangan, lampu meja, kaca pembesar */}
        <AbsoluteFill style={layerTransform(1.0)}>
          {/* Lantai & lis dinding */}
          <Slab x={-140} y={580} w={1560} h={220} color={C.floor} shade={C.floorLo} shadeH={0.4} r={0} grain={0.6} />
          <Slab x={-140} y={558} w={1560} h={24} color={C.woodLo} r={0} />

          {/* Tumpukan buku polos di sisi kiri meja */}
          <Paper lift={4}>
            <Slab x={464} y={514} w={94} h={22} color={C.sage} shade={C.sageLo} shadeH={0.35} r={4} />
            <Slab x={472} y={494} w={82} h={20} color={C.cream} shade={C.creamLo} shadeH={0.35} r={4} />
          </Paper>

          {/* Timbangan dua piring tanpa skala + mekanisme terbuka + dua figurin */}
          <Boil seed="scale-body" amp={0.4} rot={0.05}>
            <BalanceScale
              tiltDeg={tiltDeg}
              openProgress={openProgress}
              pinchProgress={pinchProgress}
              pinchOpacity={pinchOpacity}
              gearAngle={gearAngle}
              breathe={breathe}
            />
          </Boil>

          {/* Meja kerja kayu kertas */}
          <Paper lift={6}>
            <Slab x={180} y={DESK_Y} w={980} h={26} color={C.woodHi} shade={C.wood} shadeH={0.35} r={6} />
            <Slab x={210} y={DESK_Y + 26} w={920} h={22} color={C.woodLo} r={2} />
            <Slab x={240} y={DESK_Y + 48} w={34} h={160} color={C.woodLo} r={3} />
            <Slab x={1066} y={DESK_Y + 48} w={34} h={160} color={C.woodLo} r={3} />
          </Paper>

          {/* Tokoh utama "kamu" duduk di sisi kiri meja */}
          <Boil seed="hero-kamu" amp={0.4} rot={0.05}>
            <MainCharacter
              x={344 + chairSlideX}
              y={668}
              sitUp={sitUp}
              nodDeg={nodDeg}
              reachLens={lensReach}
              breathe={breathe}
            />
          </Boil>

          {/* Gelembung pikiran kosong putus-putus di Beat 1 */}
          <ThoughtBubble opacity={bubbleOpacity} floatY={bubbleFloat} />

          {/* Lampu meja kertas besar di kanan meja */}
          <DeskLampProp lower={lampLower} sway={lampSway} />

          {/* Tangan & kaca pembesar kertas di Beat 4 */}
          <MagnifyingHand reach={lensReach} gearAngle={gearAngle} hoverY={lensHover} />
        </AbsoluteFill>

        {/* LAPISAN 4 (Latar depan): Siluet tepi meja/buku dekat kamera & debu kertas melayang pelan */}
        <AbsoluteFill style={{...layerTransform(1.35), pointerEvents: 'none'}}>
          <Paper lift={8}>
            <Slab x={-60} y={642} w={210} h={110} color="#241710" r={10} rot={-4} />
            <Slab x={1135} y={632} w={210} h={120} color="#241710" r={10} rot={5} />
          </Paper>
          {/* Debu kertas melayang sangat pelan dalam cahaya lampu */}
          {[
            [620, 220, 3.5, 0],
            [710, 185, 2.5, 40],
            [815, 250, 3, 85],
            [670, 310, 2.5, 130],
            [785, 340, 3.5, 175],
            [560, 290, 2.5, 210],
          ].map(([dx, dy, r, phase], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: dx + calmWave(f, 220, 8, phase),
                top: dy + calmWave(f, 180, 10, phase + 30),
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                backgroundColor: C.creamHi,
                opacity: 0.24,
              }}
            />
          ))}
        </AbsoluteFill>

        {/* Vinyet hangat lembut */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 56% 46%, rgba(255,220,140,0.05) 0%, rgba(12,15,24,0.22) 68%, rgba(8,10,18,0.52) 100%)',
            pointerEvents: 'none',
          }}
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};