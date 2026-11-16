// Adegan P03: "Dari Luar Baik-Baik Saja" (scene 16-22), fasad rumah siang cerah membuka seperti rumah boneka ke interior ruang keluarga.
// Menampilkan tokoh utama berkemeja biru sabak dan syal terakota, keluarga, pita cicilan rumah, serta menara balok miring di ambang jatuh.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Lamp, Plant, Shelf} from '../../lib/paper/sets';

export const P03_DUR = 579;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const HeroKamu: React.FC<{
  x: number;
  y: number;
  s?: number;
  facing?: 1 | -1;
  headTilt?: number;
  handOnChest?: boolean;
  wave?: number;
  carryBag?: boolean;
}> = ({x, y, s = 1, facing = 1, headTilt = 0, handOnChest = false, wave = 0, carryBag = true}) => {
  const f = useCurrentFrame();
  const breath = bob(f, 54, 1.4, 0.4);
  const w = 96 * s;
  const h = 194 * s;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + breath,
        width: w,
        height: h,
        translate: '-50% -100%',
        transform: `scaleX(${facing})`,
      }}
    >
      {/* Kaki & sepatu */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 146 * s,
          width: 22 * s,
          height: 44 * s,
          translate: '-112% 0',
          background: C.inkSoft,
          borderRadius: 6 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 146 * s,
          width: 22 * s,
          height: 44 * s,
          translate: '12% 0',
          background: C.inkSoft,
          borderRadius: 6 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 184 * s,
          width: 27 * s,
          height: 10 * s,
          translate: '-104% 0',
          background: C.ink,
          borderRadius: 5 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 184 * s,
          width: 27 * s,
          height: 10 * s,
          translate: '8% 0',
          background: C.ink,
          borderRadius: 5 * s,
        }}
      />

      {/* Lengan belakang */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 66 * s,
          width: 16 * s,
          height: 66 * s,
          translate: '-255% 0',
          background: '#3F5266',
          borderRadius: 8 * s,
          transformOrigin: 'top center',
          transform: `rotate(${wave ? -125 * wave : 5}deg)`,
        }}
      />

      {/* Kemeja biru sabak */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 60 * s,
          width: 66 * s,
          height: 88 * s,
          translate: '-50% 0',
          background: ROOM.slate,
          borderRadius: `${14 * s}px ${14 * s}px ${8 * s}px ${8 * s}px`,
          boxShadow: `inset 0 -${8 * s}px 0 rgba(0,0,0,0.14)`,
        }}
      />
      {/* Plaket kemeja & kerah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 62 * s,
          width: 5 * s,
          height: 82 * s,
          translate: '-50% 0',
          background: '#3D4F61',
          opacity: 0.65,
        }}
      />

      {/* Tali lanyard & kartu pengenal kosong */}
      <svg
        width={w}
        height={h}
        viewBox="0 0 96 194"
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <polyline
          points="36,62 48,104 60,62"
          fill="none"
          stroke={C.inkSoft}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <rect
          x={41}
          y={103}
          width={14}
          height={20}
          rx={2}
          fill={C.creamHi}
          stroke={C.creamLo}
          strokeWidth={1.5}
        />
        <line x1={44} y1={109} x2={52} y2={109} stroke={C.creamLo} strokeWidth={1.8} />
      </svg>

      {/* Syal kertas hangat terakota */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 56 * s,
          width: 58 * s,
          height: 18 * s,
          translate: '-50% 0',
          background: C.hero,
          borderRadius: 9 * s,
          boxShadow: `0 ${3 * s}px 0 ${C.heroLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 68 * s,
          width: 14 * s,
          height: 36 * s,
          translate: '-125% 0',
          rotate: '5deg',
          background: C.heroLo,
          borderRadius: `2px 2px ${6 * s}px ${6 * s}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 67 * s,
          width: 15 * s,
          height: 44 * s,
          translate: '-30% 0',
          rotate: '-4deg',
          background: C.hero,
          borderRadius: `2px 2px ${7 * s}px ${7 * s}px`,
        }}
      />

      {/* Lengan depan (di dada saat interior, atau memegang tas saat eksterior) */}
      {handOnChest ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 68 * s,
            width: 44 * s,
            height: 16 * s,
            translate: '-18% 120%',
            rotate: '-24deg',
            background: '#5B728A',
            borderRadius: 8 * s,
            boxShadow: `0 ${2 * s}px 4px rgba(0,0,0,0.18)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -4 * s,
              top: 1 * s,
              width: 14 * s,
              height: 14 * s,
              borderRadius: '50%',
              background: C.creamLo,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 66 * s,
            width: 16 * s,
            height: 66 * s,
            translate: '155% 0',
            background: '#5B728A',
            borderRadius: 8 * s,
            transformOrigin: 'top center',
            transform: 'rotate(-4deg)',
          }}
        />
      )}

      {/* Tas kantor */}
      {carryBag ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 124 * s,
            width: 44 * s,
            height: 34 * s,
            translate: '58% 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 13 * s,
              top: -8 * s,
              width: 18 * s,
              height: 10 * s,
              border: `${3 * s}px solid ${C.woodLo}`,
              borderBottom: 'none',
              borderRadius: `${6 * s}px ${6 * s}px 0 0`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: C.wood,
              borderRadius: 6 * s,
              boxShadow: `0 ${4 * s}px 6px rgba(0,0,0,0.25)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: 14 * s,
              background: C.woodLo,
              borderRadius: `${6 * s}px ${6 * s}px ${3 * s}px ${3 * s}px`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 11 * s,
              top: 11 * s,
              width: 5 * s,
              height: 7 * s,
              background: C.brass,
              borderRadius: 2 * s,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 11 * s,
              top: 11 * s,
              width: 5 * s,
              height: 7 * s,
              background: C.brass,
              borderRadius: 2 * s,
            }}
          />
        </div>
      ) : null}

      {/* Kepala polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2 * s,
          width: 52 * s,
          height: 52 * s,
          translate: '-50% 0',
          transformOrigin: '50% 85%',
          transform: `rotate(${headTilt}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: C.creamLo,
            border: `${2.5 * s}px solid ${C.inkSoft}`,
          }}
        />
        {/* Potongan rambut kertas rapi di bagian atas */}
        <div
          style={{
            position: 'absolute',
            left: 2 * s,
            top: -1 * s,
            width: 48 * s,
            height: 22 * s,
            background: C.ink,
            borderRadius: `${26 * s}px ${26 * s}px ${6 * s}px ${14 * s}px`,
          }}
        />
      </div>
    </div>
  );
};

const SpouseHijab: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const sway = bob(f, 48, 1.2, 1.1);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + sway,
        width: 84 * s,
        height: 155 * s,
        translate: '-50% -100%',
      }}
    >
      {/* Badan & busana hangat */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 56 * s,
          width: 60 * s,
          height: 96 * s,
          translate: '-50% 0',
          background: '#C68553',
          borderRadius: `${16 * s}px ${16 * s}px ${6 * s}px ${6 * s}px`,
        }}
      />
      {/* Lengan menata piring */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 72 * s,
          width: 42 * s,
          height: 14 * s,
          translate: '-105% 40%',
          rotate: '-14deg',
          background: '#B37343',
          borderRadius: 7 * s,
        }}
      />
      {/* Kerudung / hijab kertas berlapis */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 62 * s,
          height: 76 * s,
          translate: '-50% 0',
          background: C.sage,
          borderRadius: `${31 * s}px ${31 * s}px ${22 * s}px ${22 * s}px`,
          boxShadow: `inset -${5 * s}px -${4 * s}px 0 ${C.sageLo}`,
        }}
      />
      {/* Wajah bulat polos tanpa fitur wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10 * s,
          width: 40 * s,
          height: 44 * s,
          translate: '-54% 0',
          borderRadius: '50%',
          background: C.creamLo,
          border: `${2 * s}px solid ${C.inkSoft}`,
        }}
      />
      {/* Lipatan ujung hijab di bahu */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 50 * s,
          width: 56 * s,
          height: 28 * s,
          translate: '-48% 0',
          background: C.sageLo,
          borderRadius: `${10 * s}px ${18 * s}px ${22 * s}px ${14 * s}px`,
        }}
      />
    </div>
  );
};

const ChildStudent: React.FC<{x: number; y: number; s?: number; wave?: number}> = ({
  x,
  y,
  s = 0.58,
  wave = 0,
}) => {
  const f = useCurrentFrame();
  const step = bob(f, 22, 1.5, 0.2);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + step,
        width: 84 * s,
        height: 165 * s,
        translate: '-50% -100%',
      }}
    >
      {/* Tas sekolah punggung */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * s,
          width: 30 * s,
          height: 48 * s,
          translate: '-128% 0',
          background: C.cap,
          borderRadius: 8 * s,
          boxShadow: `inset 0 ${14 * s}px 0 ${C.capLo}`,
        }}
      />
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 126 * s,
          width: 16 * s,
          height: 36 * s,
          translate: '-115% 0',
          background: C.creamLo,
          borderRadius: 5 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 126 * s,
          width: 16 * s,
          height: 36 * s,
          translate: '15% 0',
          background: C.creamLo,
          borderRadius: 5 * s,
        }}
      />
      {/* Seragam putih & bawahan merah marun */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 54 * s,
          width: 52 * s,
          height: 44 * s,
          translate: '-50% 0',
          background: C.creamHi,
          borderRadius: `${12 * s}px ${12 * s}px 2px 2px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 96 * s,
          width: 54 * s,
          height: 34 * s,
          translate: '-50% 0',
          background: C.tag,
          borderRadius: `2px 2px ${6 * s}px ${6 * s}px`,
        }}
      />
      {/* Lengan melambai */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * s,
          width: 13 * s,
          height: 46 * s,
          translate: '-230% 0',
          background: C.creamHi,
          borderRadius: 6 * s,
          transformOrigin: 'top center',
          transform: `rotate(${145 * wave}deg)`,
        }}
      />
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 4 * s,
          width: 46 * s,
          height: 46 * s,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.creamLo,
          border: `${2.5 * s}px solid ${C.inkSoft}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2 * s,
          width: 44 * s,
          height: 19 * s,
          translate: '-50% 0',
          background: C.ink,
          borderRadius: `${22 * s}px ${22 * s}px ${8 * s}px ${8 * s}px`,
        }}
      />
    </div>
  );
};

const NeighborFigure: React.FC<{x: number; y: number; s?: number; wave?: number}> = ({
  x,
  y,
  s = 0.78,
  wave = 0,
}) => {
  const f = useCurrentFrame();
  const gait = bob(f, 26, 1.3, 0.8);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + gait,
        width: 84 * s,
        height: 184 * s,
        translate: '-50% -100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 138 * s,
          width: 20 * s,
          height: 44 * s,
          translate: '-112% 0',
          background: C.inkSoft,
          borderRadius: 5 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 138 * s,
          width: 20 * s,
          height: 44 * s,
          translate: '12% 0',
          background: C.inkSoft,
          borderRadius: 5 * s,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * s,
          width: 60 * s,
          height: 82 * s,
          translate: '-50% 0',
          background: ROOM.mustard,
          borderRadius: `${13 * s}px ${13 * s}px ${7 * s}px ${7 * s}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 62 * s,
          width: 14 * s,
          height: 60 * s,
          translate: '-240% 0',
          background: '#8E7338',
          borderRadius: 7 * s,
          transformOrigin: 'top center',
          transform: `rotate(${145 * wave}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2 * s,
          width: 48 * s,
          height: 48 * s,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.creamLo,
          border: `${2.5 * s}px solid ${C.inkSoft}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 46 * s,
          height: 19 * s,
          translate: '-50% 0',
          background: C.woodLo,
          borderRadius: `${22 * s}px ${22 * s}px ${8 * s}px ${8 * s}px`,
        }}
      />
    </div>
  );
};

const SmallSchool: React.FC<{x: number; y: number; bellSwing: number}> = ({x, y, bellSwing}) => {
  const f = useCurrentFrame();
  const flagWave = bob(f, 34, 3, 0.5);
  return (
    <div style={{position: 'absolute', left: x, top: y - 165, width: 210, height: 165}}>
      <Paper lift={4}>
        {/* Tiang bendera polos */}
        <Slab x={16} y={14} w={5} h={151} color={C.metalLo} r={2} />
        <div
          style={{
            position: 'absolute',
            left: 21,
            top: 20,
            width: 34,
            height: 22,
            transformOrigin: 'left center',
            transform: `skewY(${flagWave}deg)`,
            boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{width: '100%', height: '50%', background: C.tag}} />
          <div style={{width: '100%', height: '50%', background: C.creamHi}} />
        </div>

        {/* Gedung sekolah kecil */}
        <Slab x={48} y={64} w={152} h={101} color={C.cream} shade={C.creamLo} shadeH={0.14} r={4} />
        {/* Atap segitiga */}
        <svg width={174} height={54} style={{position: 'absolute', left: 37, top: 18}}>
          <polygon points="87,2 172,52 2,52" fill={C.hero} />
          <polygon points="87,2 172,52 152,52 87,13" fill={C.heroLo} />
        </svg>
        {/* Lonceng sekolah */}
        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 44,
            width: 12,
            height: 14,
            background: C.brass,
            borderRadius: '6px 6px 2px 2px',
            transformOrigin: 'top center',
            transform: `rotate(${bellSwing}deg)`,
          }}
        />
        {/* Papan nama sekolah KOSONG tanpa tulisan */}
        <Slab x={86} y={74} w={76} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.25} r={2} />
        {/* Pintu & jendela kelas */}
        <Slab x={110} y={108} w={28} h={57} color={C.wood} r="4px 4px 0 0" />
        <Slab x={64} y={106} w={30} h={32} color="#8FB0C4" r={3} />
        <Slab x={154} y={106} w={30} h={32} color="#8FB0C4" r={3} />
      </Paper>
    </div>
  );
};

const BoundSpeechBubble: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const floatY = bob(f, 52, 2.5, 0.3);
  return (
    <PopIn at={at} seed="bubble">
      <Boil seed="bubble-boil" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y + floatY,
            width: 82,
            height: 58,
            translate: '-50% -50%',
          }}
        >
          <svg width={82} height={58} viewBox="0 0 82 58" style={{overflow: 'visible'}}>
            {/* Bayangan lembut */}
            <path
              d="M12,10 L70,8 L74,40 L52,42 L58,53 L40,42 L10,41 Z"
              fill="rgba(0,0,0,0.22)"
              transform="translate(2 4)"
            />
            {/* Gelembung ucapan kertas terlipat rapat */}
            <path
              d="M12,10 L70,8 L74,40 L52,42 L58,53 L40,42 L10,41 Z"
              fill={C.creamHi}
              stroke={C.creamLo}
              strokeWidth={1.5}
            />
            {/* Garis lipatan kertas */}
            <polygon points="12,10 41,25 10,41" fill={C.cream} opacity={0.75} />
            <polygon points="70,8 41,25 74,40" fill={C.creamLo} opacity={0.55} />
            <line x1={12} y1={10} x2={74} y2={40} stroke={C.creamLo} strokeWidth={1.2} />
            <line x1={70} y1={8} x2={10} y2={41} stroke={C.creamLo} strokeWidth={1.2} />
            {/* Tali kertas mengikat rapat gelembung */}
            <line x1={29} y1={8} x2={27} y2={42} stroke={C.heroLo} strokeWidth={3.2} />
            <line x1={53} y1={8} x2={55} y2={42} stroke={C.heroLo} strokeWidth={3.2} />
            <line x1={10} y1={25} x2={73} y2={24} stroke={C.hero} strokeWidth={3} />
            {/* Simpul tali di tengah */}
            <circle cx={41} cy={24.5} r={4.5} fill={C.heroLo} />
            <path d="M41,24.5 Q33,17 31,21" fill="none" stroke={C.hero} strokeWidth={2.4} />
            <path d="M41,24.5 Q49,17 51,21" fill="none" stroke={C.hero} strokeWidth={2.4} />
          </svg>
        </div>
      </Boil>
    </PopIn>
  );
};

const BlockTower: React.FC<{x: number; floorY: number; f: number}> = ({x, floorY, f}) => {
  // Beat 7 (frame 483-579): balok dasar bergeser sedikit, menara miring ~13 derajat di ambang jatuh dan TIDAK jatuh
  const baseShift = interpolate(f, [490, 516], [0, 7.5], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const tiltDeg = interpolate(
    f,
    [496, 524, 540, 554],
    [0, 14.0, 11.8, 13.2],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Koordinat lokal dalam kotak 140x136 (dasar kotak menempel tepat di floorY)
  // Meja bundar: y = 102..136 (tinggi 34px), menara 5 balok: y = 12..102 (tinggi 90px, 18px per balok)
  return (
    <div style={{position: 'absolute', left: x, top: floorY, width: 140, height: 136, translate: '-50% -100%'}}>
      {/* Bayangan meja di lantai */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 132,
          width: 72,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.24)',
        }}
      />

      {/* Meja bundar kayu tengah ruangan */}
      <Paper lift={4}>
        <Slab x={64} y={108} w={12} h={24} color={C.woodLo} r={2} />
        <Slab x={45} y={130} w={50} h={6} color={C.wood} r={3} />
        <Slab x={22} y={102} w={96} h={8} color={C.woodHi} shade={C.woodLo} shadeH={0.38} r={4} />
      </Paper>

      {/* Bayangan tumpuan menara di atas permukaan meja */}
      <div
        style={{
          position: 'absolute',
          left: 41 + baseShift * 0.7,
          top: 100,
          width: 62,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.22)',
        }}
      />

      {/* Balok 1 (dasar): rumah - bergeser sedikit ke kanan */}
      <div
        style={{
          position: 'absolute',
          left: 42 + baseShift,
          top: 84,
          width: 56,
          height: 18,
        }}
      >
        <Paper lift={3}>
          <Slab x={0} y={0} w={56} h={18} color="#C96A4B" shade="#9C472D" shadeH={0.24} r={2.5} />
          <svg width={56} height={18} style={{position: 'absolute', inset: 0}}>
            <polygon points="28,2.5 39,9 17,9" fill={C.creamHi} opacity={0.92} />
            <rect x={20} y={9} width={16} height={6.5} fill={C.creamHi} opacity={0.92} />
            <rect x={26.5} y={11.5} width={3} height={4} fill="#9C472D" />
          </svg>
        </Paper>
      </div>

      {/* Susunan 4 balok atas miring ~13 derajat bertumpu di ambang tepi kanan balok dasar */}
      <div
        style={{
          position: 'absolute',
          left: 42 + baseShift,
          top: 12,
          width: 56,
          height: 72,
          transformOrigin: '84% 100%',
          transform: `rotate(${tiltDeg}deg)`,
        }}
      >
        {/* Balok 2: tas kantor */}
        <Paper lift={3}>
          <Slab x={1} y={54} w={54} h={18} color="#546E88" shade="#3B5066" shadeH={0.24} r={2.5} />
          <svg width={54} height={18} style={{position: 'absolute', left: 1, top: 54}}>
            <rect x={19} y={6} width={16} height={9.5} rx={1.5} fill={C.creamHi} opacity={0.92} />
            <path d="M23.5,6 L23.5,3.5 L30.5,3.5 L30.5,6" fill="none" stroke={C.creamHi} strokeWidth={1.6} opacity={0.92} />
            <line x1={19} y1={10} x2={35} y2={10} stroke="#3B5066" strokeWidth={1.1} />
          </svg>
        </Paper>

        {/* Balok 3: tas sekolah */}
        <Paper lift={3}>
          <Slab x={2} y={36} w={52} h={18} color="#D4A24C" shade="#A3772C" shadeH={0.24} r={2.5} />
          <svg width={52} height={18} style={{position: 'absolute', left: 2, top: 36}}>
            <rect x={19.5} y={5} width={13} height={11} rx={3} fill={C.creamHi} opacity={0.92} />
            <path d="M23,5 Q26,2 29,5" fill="none" stroke={C.creamHi} strokeWidth={1.5} opacity={0.92} />
            <line x1={20} y1={10} x2={32} y2={10} stroke="#A3772C" strokeWidth={1.1} />
          </svg>
        </Paper>

        {/* Balok 4: bohlam */}
        <Paper lift={3}>
          <Slab x={3} y={18} w={50} h={18} color="#7A9074" shade="#576B52" shadeH={0.24} r={2.5} />
          <svg width={50} height={18} style={{position: 'absolute', left: 3, top: 18}}>
            <circle cx={25} cy={7.2} r={4.3} fill={C.creamHi} opacity={0.92} />
            <rect x={22.8} y={11.5} width={4.4} height={3.5} rx={0.8} fill={C.creamHi} opacity={0.92} />
          </svg>
        </Paper>

        {/* Balok 5 (puncak): piring */}
        <Paper lift={3}>
          <Slab x={4} y={0} w={48} h={18} color="#DFD3C3" shade="#B5A694" shadeH={0.24} r={2.5} />
          <svg width={48} height={18} style={{position: 'absolute', left: 4, top: 0}}>
            <ellipse cx={24} cy={9.5} rx={12.5} ry={4.2} fill="none" stroke={C.woodLo} strokeWidth={1.8} opacity={0.85} />
            <ellipse cx={24} cy={9.5} rx={6.8} ry={2.1} fill="none" stroke={C.woodLo} strokeWidth={1.2} opacity={0.7} />
          </svg>
        </Paper>
      </div>
    </div>
  );
};

export const P03: React.FC = () => {
  const f = useCurrentFrame();

  // Kamera: Beat 1-5 track lateral kiri ke kanan; Beat 6 dolly-in menembus jendela; Beat 7 dolly-in & tilt turun jelas ke menara balok
  const camX = interpolate(
    f,
    [0, 95, 180, 265, 325, 435, 483, 556],
    [560, 622, 650, 725, 682, 636, 636, 706],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camY = interpolate(
    f,
    [0, 325, 435, 483, 556],
    [368, 368, 415, 418, 482],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camZoom = interpolate(
    f,
    [0, 95, 265, 342, 435, 483, 556],
    [1.02, 1.03, 1.04, 1.06, 1.68, 1.70, 4.35],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Paralaks eksterior saat track lateral (mengecil saat masuk interior)
  const trackDelta = camX - 640;
  const farParallax = -trackDelta * 0.78;
  const midFarParallax = -trackDelta * 0.42;
  const nearParallax = trackDelta * 0.28;
  const foreParallax = trackDelta * 0.58;

  // Beat 1 (0-76): tetangga lewat dan melambai ramah
  const neighborX = interpolate(f, [2, 76], [235, 515], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const neighborWave = interpolate(f, [20, 34, 48, 60], [0, 1, 0.85, 0], CLAMP);

  // Beat 2 (98-143): pintu membuka, "kamu" keluar berdiri di teras dengan sorot hangat
  const doorOpen = interpolate(f, [92, 112], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const heroPorchX = interpolate(f, [96, 118], [505, 476], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const spotOpacity = interpolate(f, [104, 120, 340, 360], [0, 0.88, 0.88, 0], CLAMP);

  // Beat 3 (156-206): rumah berkilau halus & tali/pita kertas melilit fondasi menjulur ke kanan
  const shimmerX = interpolate(f, [156, 198], [-120, 540], CLAMP);
  const shimmerOp = interpolate(f, [156, 174, 198], [0, 0.34, 0], CLAMP);
  const ribbonProgress = interpolate(f, [160, 202], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Beat 4 (236-271): anak berseragam tas sekolah berjalan geser ke sekolah kecil di ujung jalan, melambai
  const childX = interpolate(f, [232, 271], [635, 1025], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const childWave = interpolate(f, [246, 255, 265, 271], [0, 1, 0.9, 0], CLAMP);
  const heroWave = interpolate(f, [248, 257, 267, 273], [0, 0.85, 0.75, 0], CLAMP);
  const bellSwing = interpolate(f, [264, 272, 282, 294], [0, 16, -11, 0], CLAMP);

  // Beat 5 (289-319): jendela dapur terbuka, uap hangat & pasangan berhijab menata piring
  const kitchenShutter = interpolate(f, [284, 302], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const steamRise = bob(f, 44, 4, 0.2);

  // Beat 6 (351-459): panel fasad rumah membuka seperti pintu rumah boneka
  const facadeSwingDeg = interpolate(f, [348, 408], [0, -108], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const interiorShade = interpolate(f, [355, 425], [0, 1], CLAMP);

  // Beat 7 (483-579): angin halus menggerakkan tirai jendela interior
  const curtainBreeze = interpolate(f, [483, 508, 535, 560], [0, 14, 6, 9], CLAMP);

  const cloudDrift = bob(f, 180, 10, 0);

  return (
    <AbsoluteFill style={{backgroundColor: '#A9C8D9', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
            transformOrigin: '0 0',
            transform: `translate(${640 - camX * camZoom}px, ${360 - camY * camZoom}px) scale(${camZoom})`,
          }}
        >
          {/* LAPISAN 1: Langit siang cerah, matahari & awan kertas (paralaks jauh) */}
          <div style={{position: 'absolute', inset: -160, transform: `translateX(${farParallax}px)`}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #96BBD1 0%, #C6DCE8 68%, #DFD8C8 100%)',
              }}
            />
            {/* Matahari kertas hangat */}
            <div
              style={{
                position: 'absolute',
                left: 255,
                top: 175,
                width: 112,
                height: 112,
                borderRadius: '50%',
                background: 'rgba(247, 217, 130, 0.28)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 275,
                top: 195,
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#F6D472',
                boxShadow: '2px 4px 10px rgba(0,0,0,0.08)',
              }}
            />
            {/* Awan kertas berlapis */}
            <Boil seed="clouds" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 450 + cloudDrift, top: 195}}>
                <Paper lift={2}>
                  <Slab x={0} y={14} w={132} h={34} color={C.creamHi} r={18} />
                  <Slab x={24} y={0} w={62} h={38} color={C.creamHi} r={20} />
                  <Slab x={68} y={6} w={48} h={32} color={C.creamHi} r={16} />
                </Paper>
              </div>
              <div style={{position: 'absolute', left: 960 - cloudDrift * 0.8, top: 215}}>
                <Paper lift={2}>
                  <Slab x={0} y={12} w={118} h={30} color={C.creamHi} r={15} />
                  <Slab x={28} y={0} w={54} h={34} color={C.creamHi} r={18} />
                </Paper>
              </div>
            </Boil>

            {/* Bukit & pepohonan latar belakang */}
            <svg width={1640} height={240} style={{position: 'absolute', left: 0, top: 450}}>
              <path d="M0,150 Q260,65 540,130 T1120,115 T1640,140 L1640,240 L0,240 Z" fill="#95A58E" />
              <path d="M0,175 Q380,110 780,165 T1640,155 L1640,240 L0,240 Z" fill={C.sage} />
            </svg>
          </div>

          {/* LAPISAN 2: Jalan perumahan, pepohonan & gedung sekolah kecil di ujung kanan */}
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${midFarParallax}px)`}}>
            {/* Pepohonan lingkungan */}
            {[115, 225, 945].map((tx, idx) => (
              <div key={idx} style={{position: 'absolute', left: tx, top: 375 + (idx % 2) * 18}}>
                <Paper lift={3}>
                  <Slab x={34} y={88} w={14} h={82} color={C.woodLo} r={3} />
                  <Slab x={4} y={24} w={74} h={74} color={idx % 2 ? '#597C54' : '#6A8D63'} r="50%" />
                  <Slab x={16} y={4} w={54} h={54} color="#769A6E" r="50%" />
                </Paper>
              </div>
            ))}

            {/* Gedung sekolah kecil di ujung jalan kanan */}
            <SmallSchool x={1055} y={548} bellSwing={bellSwing} />
          </div>

          {/* Permukaan jalan & trotoar perumahan */}
          <Slab x={-260} y={545} w={1840} h={42} color="#CFC4B2" shade={C.creamLo} shadeH={0.25} r={0} />
          <Slab x={-260} y={587} w={1840} h={160} color="#6D6A64" shade="#53504B" shadeH={0.25} r={0} />
          {/* Marka jalan putus-putus */}
          {Array.from({length: 11}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -180 + i * 165,
                top: 632,
                width: 78,
                height: 6,
                borderRadius: 3,
                background: C.cream,
                opacity: 0.55,
              }}
            />
          ))}

          {/* LAPISAN 3: RUMAH DUA LANTAI UTAMA (INTERIOR + FASAD BUKAAN RUMAH BONEKA) */}
          <div style={{position: 'absolute', left: 395, top: 138, width: 490, height: 414}}>
            {/* Atap rumah bertingkat */}
            <Paper lift={6}>
              <svg width={520} height={134} style={{position: 'absolute', left: -15, top: 0}}>
                <polygon points="260,6 516,126 4,126" fill={C.heroLo} />
                <polygon points="260,14 494,122 26,122" fill={C.hero} />
                {/* Tekstur genteng kertas berlapis */}
                <line x1={165} y1={58} x2={355} y2={58} stroke={C.heroLo} strokeWidth={3} opacity={0.65} />
                <line x1={115} y1={84} x2={405} y2={84} stroke={C.heroLo} strokeWidth={3} opacity={0.65} />
                <line x1={65} y1={108} x2={455} y2={108} stroke={C.heroLo} strokeWidth={3} opacity={0.65} />
              </svg>
              {/* Jendela loteng kecil */}
              <Slab x={218} y={64} w={54} h={44} color={C.creamHi} r="27px 27px 2px 2px" />
              <Slab x={225} y={71} w={40} h={31} color="#8FB1C6" r="20px 20px 0 0" />
              <div style={{position: 'absolute', left: 244, top: 71, width: 3, height: 31, background: C.creamHi}} />
            </Paper>

            {/* Dinding lantai 2 */}
            <Paper lift={5}>
              <Slab x={14} y={124} w={462} h={134} color={C.creamHi} shade={C.cream} shadeH={0.14} r={3} />
              {/* Dua jendela lantai 2 dengan pot bunga */}
              {[68, 326].map((wx, idx) => (
                <div key={idx} style={{position: 'absolute', left: wx, top: 146, width: 96, height: 82}}>
                  <Slab x={0} y={0} w={96} h={82} color={C.woodHi} r={4} />
                  <Slab x={8} y={8} w={80} h={66} color="#8EB0C4" r={2} />
                  <div style={{position: 'absolute', left: 46, top: 8, width: 4, height: 66, background: C.creamHi}} />
                  <div style={{position: 'absolute', left: 8, top: 39, width: 80, height: 4, background: C.creamHi}} />
                  {/* Kotak bunga jendela */}
                  <Slab x={-4} y={74} w={104} h={14} color={C.heroLo} r={3} />
                  <Slab x={10} y={66} w={20} h={12} color="#5B8255" r="50%" />
                  <Slab x={38} y={64} w={24} h={14} color="#6E9666" r="50%" />
                  <Slab x={66} y={67} w={20} h={11} color="#5B8255" r="50%" />
                </div>
              ))}
              {/* Lis pemisah lantai 1 dan 2 */}
              <Slab x={6} y={252} w={478} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={2} />
            </Paper>

            {/* ============================================================ */}
            {/* INTERIOR RUANG KELUARGA (terungkap saat panel fasad membuka) */}
            {/* ============================================================ */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 264,
                width: 462,
                height: 150,
                overflow: 'hidden',
                backgroundColor: '#C5B9A5',
              }}
            >
              {/* Dinding interior teduh & panel kayu bawah */}
              <Slab x={0} y={0} w={462} h={150} color="#C7BBA7" grain={0.5} r={0} />
              <Slab x={0} y={108} w={462} h={32} color="#9E8E78" r={0} />
              {/* Lantai papan kayu interior */}
              <Slab x={0} y={138} w={462} h={12} color={C.floor} r={0} />

              {/* Bingkai hiasan dinding abstrak polos (tanpa teks) */}
              <Paper lift={2}>
                <Slab x={28} y={22} w={48} h={38} color={C.wood} r={3} />
                <Slab x={33} y={27} w={38} h={28} color={C.creamHi} r={2} />
                <svg width={38} height={28} style={{position: 'absolute', left: 33, top: 27}}>
                  <polygon points="4,26 16,12 28,26" fill={C.sage} />
                  <polygon points="15,26 25,15 35,26" fill={C.hero} opacity={0.8} />
                </svg>
              </Paper>

              {/* Jendela ruang keluarga di dinding belakang dengan tirai tertiup angin halus */}
              <div style={{position: 'absolute', left: 175, top: 16, width: 122, height: 84}}>
                <Slab x={0} y={0} w={122} h={84} color={C.woodHi} r={3} />
                <Slab x={7} y={7} w={108} h={70} color="#94AEC0" r={2} />
                <div style={{position: 'absolute', left: 59, top: 7, width: 4, height: 70, background: C.creamHi}} />
                <div style={{position: 'absolute', left: 7, top: 40, width: 108, height: 4, background: C.creamHi}} />
                {/* Tirai kiri & kanan bergoyang lembut tertiup angin */}
                <div
                  style={{
                    position: 'absolute',
                    left: 3,
                    top: 4,
                    width: 24,
                    height: 78,
                    background: C.creamHi,
                    borderRadius: '2px 2px 10px 4px',
                    transformOrigin: 'top left',
                    transform: `skewX(${curtainBreeze}deg)`,
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.14)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 3,
                    top: 4,
                    width: 24,
                    height: 78,
                    background: C.creamHi,
                    borderRadius: '2px 2px 4px 10px',
                    transformOrigin: 'top right',
                    transform: `skewX(${curtainBreeze * 0.85}deg)`,
                    boxShadow: '-2px 2px 4px rgba(0,0,0,0.14)',
                  }}
                />
              </div>

              {/* Rak buku polos & lampu ruangan di tepi kanan interior */}
              <Shelf x={364} y={64} w={86} books={2} />
              <Lamp x={388} y={56} s={0.28} on={true} />

              {/* Tokoh utama "kamu" di tengah-kiri interior (kepala tertunduk, satu tangan di dada) */}
              <HeroKamu
                x={132}
                y={139}
                s={0.54}
                facing={1}
                headTilt={11}
                handOnChest={true}
                carryBag={false}
              />
              {/* Tas kantor diletakkan di lantai samping tokoh */}
              <div
                style={{
                  position: 'absolute',
                  left: 88,
                  top: 120,
                  width: 24,
                  height: 19,
                  background: C.wood,
                  borderRadius: 3,
                  boxShadow: `inset 0 7px 0 ${C.woodLo}`,
                }}
              />

              {/* Gelembung ucapan kertas terlipat rapat & terikat tali (Beat 6) */}
              <BoundSpeechBubble x={92} y={46} at={364} />

              {/* Meja bundar & Menara 5 balok kertas tinggi miring ~13 derajat di ambang jatuh (Beat 7) */}
              <BlockTower x={306} floorY={139} f={f} />

              {/* Lapisan teduh interior saat kamera masuk */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 52% 48%, rgba(28,27,23,0) 42%, rgba(28,27,23,0.26) 100%)',
                  opacity: interiorShade,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ============================================================ */}
            {/* PANEL FASAD DEPAN LANTAI 1 (membuka seperti rumah boneka)    */}
            {/* ============================================================ */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 264,
                width: 462,
                height: 150,
                transformOrigin: '0% 50%',
                transform: `perspective(1400px) rotateY(${facadeSwingDeg}deg)`,
                opacity: facadeSwingDeg < -96 ? 0.25 : 1,
              }}
            >
              {/* Bidang dinding fasad depan */}
              <Slab x={0} y={0} w={462} h={150} color={C.creamHi} shade={C.cream} shadeH={0.12} r={2} />

              {/* Engsel rumah boneka di sisi kiri panel */}
              {[22, 114].map((hy, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: -4,
                    top: hy,
                    width: 10,
                    height: 16,
                    background: C.brass,
                    borderRadius: 2,
                    boxShadow: `inset 0 -3px 0 ${C.brassLo}`,
                  }}
                />
              ))}

              {/* Pintu depan kayu (membuka saat Beat 2) */}
              <div style={{position: 'absolute', left: 32, top: 32, width: 54, height: 118}}>
                <Slab x={0} y={0} w={54} h={118} color={C.woodLo} r="4px 4px 0 0" />
                <Slab x={4} y={4} w={46} h={114} color="#2B251F" r="3px 3px 0 0" />
                <div
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 4,
                    width: 46,
                    height: 114,
                    background: C.wood,
                    borderRadius: '3px 3px 0 0',
                    transformOrigin: 'left center',
                    transform: `perspective(600px) rotateY(${-68 * doorOpen}deg)`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: 7,
                      top: 56,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: C.brass,
                    }}
                  />
                </div>
              </div>

              {/* Jendela ruang keluarga di fasad */}
              <div style={{position: 'absolute', left: 114, top: 34, width: 136, height: 84}}>
                <Slab x={0} y={0} w={136} h={84} color={C.woodHi} r={4} />
                <Slab x={8} y={8} w={120} h={68} color="#8EB0C4" r={2} />
                <div style={{position: 'absolute', left: 66, top: 8, width: 4, height: 68, background: C.creamHi}} />
                <div style={{position: 'absolute', left: 8, top: 40, width: 120, height: 4, background: C.creamHi}} />
              </div>

              {/* Jendela dapur terbuka di sisi kanan fasad (Beat 5) */}
              <div style={{position: 'absolute', left: 288, top: 34, width: 142, height: 84}}>
                <Slab x={0} y={0} w={142} h={84} color={C.woodHi} r={4} />
                {/* Cahaya kuning hangat dapur */}
                <Slab x={8} y={8} w={126} h={68} color="#F7D574" r={2} />
                {/* Siluet pasangan berhijab menata piring */}
                <SpouseHijab x={94} y={76} s={0.44} />
                {/* Meja dapur, piring & pita uap hangat */}
                <Slab x={18} y={56} w={68} h={20} color={C.wood} r={2} />
                <Slab x={26} y={51} w={20} h={5} color={C.creamHi} r={3} />
                <Slab x={52} y={51} w={20} h={5} color={C.creamHi} r={3} />
                <svg width={80} height={44} style={{position: 'absolute', left: 16, top: 10}}>
                  <path
                    d={`M20,40 Q15,${26 + steamRise * 0.4} 22,14`}
                    fill="none"
                    stroke={C.creamHi}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                  <path
                    d={`M46,40 Q51,${24 - steamRise * 0.4} 44,12`}
                    fill="none"
                    stroke={C.creamHi}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                </svg>

                {/* Daun jendela dapur membuka keluar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    width: 63,
                    height: 68,
                    background: C.sage,
                    border: `2px solid ${C.creamHi}`,
                    transformOrigin: 'left center',
                    transform: `perspective(500px) rotateY(${-115 * kitchenShutter}deg)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 63,
                    height: 68,
                    background: C.sage,
                    border: `2px solid ${C.creamHi}`,
                    transformOrigin: 'right center',
                    transform: `perspective(500px) rotateY(${115 * kitchenShutter}deg)`,
                  }}
                />
              </div>

              {/* Kilau cahaya halus di rumah (Beat 3) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: shimmerX,
                    top: -20,
                    width: 68,
                    height: 190,
                    rotate: '18deg',
                    background: 'rgba(255, 252, 235, 0.7)',
                    opacity: shimmerOp,
                  }}
                />
              </div>
            </div>

            {/* Fondasi rumah & pita kertas tipis cicilan yang menjulur ke kanan (Beat 3) */}
            <Slab x={8} y={404} w={474} h={14} color="#8D867C" shade="#6E6860" shadeH={0.35} r={2} />
            {ribbonProgress > 0 ? (
              <svg
                width={980}
                height={52}
                style={{position: 'absolute', left: 6, top: 392, overflow: 'visible', pointerEvents: 'none'}}
              >
                {/* Pita melilit fondasi rumah */}
                <rect
                  x={0}
                  y={14}
                  width={478 * Math.min(1, ribbonProgress * 1.4)}
                  height={7}
                  rx={3}
                  fill={C.amber}
                  stroke={C.amberDim}
                  strokeWidth={1}
                />
                {/* Simpul pita rapi di sudut kanan fondasi */}
                {ribbonProgress > 0.65 ? (
                  <g opacity={interpolate(ribbonProgress, [0.65, 0.85], [0, 1], CLAMP)}>
                    <ellipse cx={478} cy={12} rx={9} ry={5} transform="rotate(-24 478 12)" fill={C.amber} stroke={C.amberDim} strokeWidth={1} />
                    <ellipse cx={486} cy={12} rx={9} ry={5} transform="rotate(24 486 12)" fill={C.amber} stroke={C.amberDim} strokeWidth={1} />
                    <circle cx={482} cy={16} r={4} fill={C.hero} />
                  </g>
                ) : null}
                {/* Ujung pita menjulur keluar bingkai ke kanan */}
                <path
                  d="M482,17 C595,28 710,4 970,22"
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={520}
                  strokeDashoffset={520 * (1 - interpolate(ribbonProgress, [0.45, 1], [0, 1], CLAMP))}
                />
              </svg>
            ) : null}
          </div>

          {/* Tokoh eksterior (hilang halus saat fasad rumah boneka membuka) */}
          <div style={{opacity: interpolate(f, [345, 368], [1, 0], CLAMP)}}>
            {/* Lingkaran sorot hangat lembut pada tokoh di teras (Beat 2) */}
            <div
              style={{
                position: 'absolute',
                left: heroPorchX,
                top: 472,
                width: 175,
                height: 175,
                translate: '-50% -50%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,232,158,0.45) 0%, rgba(255,232,158,0.12) 58%, rgba(255,232,158,0) 74%)',
                border: '2px dashed rgba(243, 165, 59, 0.45)',
                opacity: spotOpacity,
                pointerEvents: 'none',
              }}
            />

            {/* "Kamu" keluar dari pintu berdiri tegak di teras */}
            <div style={{opacity: interpolate(f, [92, 102], [0, 1], CLAMP)}}>
              <HeroKamu
                x={heroPorchX}
                y={554}
                s={0.78}
                facing={1}
                wave={heroWave}
                carryBag={true}
              />
            </div>

            {/* Anak berseragam dengan tas sekolah berjalan ke sekolah & melambai (Beat 4) */}
            <div style={{opacity: interpolate(f, [230, 238, 268, 276], [0, 1, 1, 0], CLAMP)}}>
              <ChildStudent x={childX} y={558} s={0.56} wave={childWave} />
            </div>

            {/* Tetangga lewat dan melambai ramah (Beat 1) */}
            <div style={{opacity: interpolate(f, [0, 8, 68, 78], [0, 1, 1, 0], CLAMP)}}>
              <NeighborFigure x={neighborX} y={564} s={0.78} wave={neighborWave} />
            </div>
          </div>

          {/* LAPISAN 4: Pagar halaman depan, tanaman pot & mobil kecil di halaman */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${nearParallax}px)`,
              opacity: interpolate(f, [355, 405], [1, 0.15], CLAMP),
              pointerEvents: 'none',
            }}
          >
            {/* Mobil kertas kecil rapi di halaman samping */}
            <div style={{position: 'absolute', left: 268, top: 486, width: 122, height: 64}}>
              <Paper lift={4}>
                <Slab x={20} y={4} w={74} h={28} color="#63829E" r="14px 16px 2px 2px" />
                <Slab x={28} y={9} w={26} h={16} color="#B8D2E3" r="8px 2px 2px 2px" />
                <Slab x={58} y={9} w={28} h={16} color="#B8D2E3" r="2px 8px 2px 2px" />
                <Slab x={4} y={26} w={114} h={24} color="#4F6E8A" shade="#3B546B" shadeH={0.25} r={8} />
                <div style={{position: 'absolute', left: 20, top: 40, width: 22, height: 22, borderRadius: '50%', background: C.ink, border: `4px solid ${C.metal}`}} />
                <div style={{position: 'absolute', right: 20, top: 40, width: 22, height: 22, borderRadius: '50%', background: C.ink, border: `4px solid ${C.metal}`}} />
              </Paper>
            </div>

            {/* Tanaman pot di teras */}
            <Plant x={402} y={474} s={0.26} />
            <Plant x={524} y={474} s={0.24} />

            {/* Pagar halaman rendah kiri & kanan */}
            <Paper lift={4}>
              <Slab x={245} y={528} w={355} h={10} color={C.creamHi} r={2} />
              <Slab x={245} y={546} w={355} h={8} color={C.cream} r={2} />
              {Array.from({length: 13}).map((_, i) => (
                <Slab
                  key={i}
                  x={252 + i * 27}
                  y={516}
                  w={12}
                  h={44}
                  color={C.creamHi}
                  shade={C.creamLo}
                  shadeH={0.18}
                  r="5px 5px 1px 1px"
                />
              ))}

              <Slab x={685} y={528} w={235} h={10} color={C.creamHi} r={2} />
              <Slab x={685} y={546} w={235} h={8} color={C.cream} r={2} />
              {Array.from({length: 9}).map((_, i) => (
                <Slab
                  key={i}
                  x={692 + i * 27}
                  y={516}
                  w={12}
                  h={44}
                  color={C.creamHi}
                  shade={C.creamLo}
                  shadeH={0.18}
                  r="5px 5px 1px 1px"
                />
              ))}
            </Paper>
          </div>

          {/* LAPISAN 5: Semak & bingkai tepi latar depan untuk paralaks track */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${foreParallax}px)`,
              opacity: interpolate(f, [355, 395], [1, 0], CLAMP),
              pointerEvents: 'none',
            }}
          >
            <Paper lift={7}>
              <Slab x={-60} y={592} w={160} h={145} color="#4A6B46" r="50%" />
              <Slab x={45} y={622} w={135} h={120} color="#5B7E56" r="50%" />
              <Slab x={1155} y={608} w={175} h={135} color="#4A6B46" r="50%" />
            </Paper>
          </div>
        </div>

        {/* Vinyet lembut yang sedikit menguat saat masuk ke interior ruang keluarga */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 46%, rgba(18,16,13,${0.24 + interiorShade * 0.18}) 100%)`,
            pointerEvents: 'none',
          }}
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};