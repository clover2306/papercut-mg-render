// Adegan D06: Kemeja yang Menjadi Mahal (scene 71-76, durasi 602 frame @30fps).
// Teater kertas warung kopi: pekerja, timbangan koin hijau, peti berkurang, dan penjahit dalam sorotan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D06_DUR = 602;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const STAGE_FLOOR_Y = 595;

const GreenCoinDisc: React.FC<{x: number; y: number; size?: number}> = ({x, y, size = 28}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: '#6E8654',
      border: '2px solid #485B35',
      boxShadow: '1px 2px 3px rgba(0,0,0,0.32)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: size * 0.62,
        height: size * 0.62,
        borderRadius: '50%',
        border: '2px solid #A3BC86',
      }}
    />
  </div>
);

const GreenCoinStackItem: React.FC<{x: number; y: number; w?: number; h?: number}> = ({
  x,
  y,
  w = 34,
  h = 9,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h,
      width: w,
      height: h,
      borderRadius: 4,
      background: 'linear-gradient(180deg, #98B27B 0%, #6E8654 45%, #4B5E37 100%)',
      boxShadow: '0 2px 3px rgba(0,0,0,0.35)',
    }}
  />
);

const ApronWorker: React.FC<{
  x: number;
  y: number;
  scale?: number;
  shirtColor?: string;
  phase?: number;
}> = ({x, y, scale = 1, shirtColor = ROOM.dusk, phase = 0}) => {
  const f = useCurrentFrame();
  const sway = Math.sin((f + phase) * 0.055) * 1.4;
  const breath = Math.sin((f + phase) * 0.07) * 0.8;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * scale,
        height: 196 * scale,
        translate: '-50% -100%',
        transform: `translateY(${breath}px) rotate(${sway * 0.35}deg)`,
        transformOrigin: '50% 100%',
        filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.28))',
      }}
    >
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2 * scale,
          width: 50 * scale,
          height: 50 * scale,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.creamLo,
          border: `${2.5 * scale}px solid ${C.inkSoft}`,
        }}
      />
      {/* Bahu dan baju kerja */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * scale,
          width: 68 * scale,
          height: 86 * scale,
          translate: '-50% 0',
          background: shirtColor,
          borderRadius: `${14 * scale}px ${14 * scale}px ${8 * scale}px ${8 * scale}px`,
        }}
      />
      {/* Celemek kertas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 74 * scale,
          width: 50 * scale,
          height: 82 * scale,
          translate: '-50% 0',
          background: '#E3D7C4',
          borderRadius: `${4 * scale}px ${4 * scale}px ${8 * scale}px ${8 * scale}px`,
          borderTop: `${3 * scale}px solid #C8B9A3`,
          boxShadow: '0 2px 3px rgba(0,0,0,0.16)',
        }}
      />
      {/* Tali celemek */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * scale,
          width: 6 * scale,
          height: 18 * scale,
          translate: '-220% 0',
          background: '#E3D7C4',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 58 * scale,
          width: 6 * scale,
          height: 18 * scale,
          translate: '120% 0',
          background: '#E3D7C4',
        }}
      />
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 144 * scale,
          width: 22 * scale,
          height: 50 * scale,
          translate: '-115% 0',
          background: C.inkSoft,
          borderRadius: 6 * scale,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 144 * scale,
          width: 22 * scale,
          height: 50 * scale,
          translate: '15% 0',
          background: C.inkSoft,
          borderRadius: 6 * scale,
        }}
      />
    </div>
  );
};

const ForeignBuyer: React.FC<{
  x: number;
  y: number;
  reach: number;
  hasCoinInHand: boolean;
}> = ({x, y, reach, hasCoinInHand}) => {
  const f = useCurrentFrame();
  const breath = Math.sin(f * 0.05) * 1.1;
  const armAngle = interpolate(reach, [0, 1], [14, 58], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 112,
        height: 204,
        translate: '-50% -100%',
        transform: `translateY(${breath}px)`,
        filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.32))',
      }}
    >
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 16,
          width: 50,
          height: 50,
          translate: '-50% 0',
          borderRadius: '50%',
          background: '#D5C3AE',
          border: `2.5px solid ${C.inkSoft}`,
        }}
      />
      {/* Topi lebar kertas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          width: 48,
          height: 18,
          translate: '-50% 0',
          background: '#B98C43',
          borderRadius: '14px 14px 2px 2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 16,
          width: 98,
          height: 9,
          translate: '-50% 0',
          background: '#D2A657',
          borderRadius: 6,
          boxShadow: '0 2px 3px rgba(0,0,0,0.25)',
        }}
      />
      {/* Mantel pembeli */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 72,
          width: 68,
          height: 84,
          translate: '-50% 0',
          background: ROOM.teal,
          borderRadius: '14px 14px 8px 8px',
        }}
      />
      {/* Kerah mantel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 72,
          width: 24,
          height: 24,
          translate: '-50% 0',
          background: '#437373',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }}
      />
      {/* Lengan mengulur ke kiri */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 82,
          width: 18,
          height: 58,
          background: '#274C4C',
          borderRadius: 9,
          transformOrigin: '9px 8px',
          transform: `rotate(${armAngle}deg)`,
        }}
      >
        {hasCoinInHand ? <GreenCoinDisc x={9} y={56} size={24} /> : null}
      </div>
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 154,
          width: 22,
          height: 50,
          translate: '-115% 0',
          background: '#23282C',
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 154,
          width: 22,
          height: 50,
          translate: '15% 0',
          background: '#23282C',
          borderRadius: 6,
        }}
      />
    </div>
  );
};

const TerracottaShirt: React.FC<{kalkirProgress: number}> = ({kalkirProgress}) => {
  const kalkirY = interpolate(kalkirProgress, [0, 1], [-22, 0], CLAMP);
  const kalkirOpacity = interpolate(kalkirProgress, [0, 0.35, 1], [0, 0.85, 0.92], CLAMP);

  return (
    <div style={{position: 'relative', width: 92, height: 104}}>
      {/* Gantungan baju kertas */}
      <svg width={92} height={104} viewBox="0 0 92 104" style={{overflow: 'visible'}}>
        <path
          d="M46 0 L46 8 M30 22 L46 10 L62 22"
          stroke={C.brassLo}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        {/* Badan kemeja terakota */}
        <path
          d="M28 20 L64 20 L84 38 L74 52 L64 44 L64 94 L28 94 L28 44 L18 52 L8 38 Z"
          fill="#C9573C"
          stroke="#9D3F29"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Lipatan kerah & plaket */}
        <polygon points="36,20 46,32 41,36 32,24" fill="#9D3F29" />
        <polygon points="56,20 46,32 51,36 60,24" fill="#9D3F29" />
        <line x1={46} y1={32} x2={46} y2={93} stroke="#A8432C" strokeWidth={2} />
        <circle cx={46} cy={46} r={2.2} fill="#E5C5A8" />
        <circle cx={46} cy={62} r={2.2} fill="#E5C5A8" />
        <circle cx={46} cy={78} r={2.2} fill="#E5C5A8" />
        <rect x={51} y={44} width={9} height={11} rx={1.5} fill="#B34A31" />
      </svg>

      {/* Kembaran kalkir tembus pandang menumpuk persis di atas kemeja */}
      {kalkirProgress > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(${kalkirY}px)`,
            opacity: kalkirOpacity,
            pointerEvents: 'none',
          }}
        >
          <svg width={92} height={104} viewBox="0 0 92 104" style={{overflow: 'visible'}}>
            <path
              d="M28 20 L64 20 L84 38 L74 52 L64 44 L64 94 L28 94 L28 44 L18 52 L8 38 Z"
              fill="rgba(252, 248, 240, 0.52)"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={2}
              strokeDasharray="5 3"
              strokeLinejoin="round"
            />
            <line
              x1={46}
              y1={32}
              x2={46}
              y2={93}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

const BalanceScale: React.FC<{
  x: number;
  y: number;
  beamAngle: number;
  coinCount: number;
  kalkirProgress: number;
}> = ({x, y, beamAngle, coinCount, kalkirProgress}) => {
  const f = useCurrentFrame();
  const microSway = Math.sin(f * 0.045) * 0.45;
  const angle = beamAngle + microSway;
  const halfSpan = 112;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 320,
        height: 310,
        translate: '-50% -100%',
        filter: 'drop-shadow(3px 7px 9px rgba(0,0,0,0.34))',
      }}
    >
      {/* Alas kayu timbangan */}
      <Slab x={95} y={292} w={130} h={18} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={5} />
      <Slab x={112} y={278} w={96} h={16} color={C.wood} shade={C.woodLo} shadeH={0.3} r={4} />
      {/* Tiang utama */}
      <Slab x={152} y={54} w={16} h={226} color={C.brass} shade={C.brassLo} shadeH={0.2} r={4} />
      {/* Puncak hias */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 38,
          width: 24,
          height: 24,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.brass,
          border: `3px solid ${C.brassLo}`,
        }}
      />

      {/* Lengan timbangan berputar */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 66,
          width: 0,
          height: 0,
          transform: `rotate(${angle}deg)`,
        }}
      >
        {/* Batang horizontal */}
        <div
          style={{
            position: 'absolute',
            left: -halfSpan - 10,
            top: -6,
            width: (halfSpan + 10) * 2,
            height: 12,
            background: C.brass,
            borderRadius: 6,
            border: `2px solid ${C.brassLo}`,
          }}
        />
        {/* Poros tengah */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: C.woodHi,
            border: `3px solid ${C.brassLo}`,
          }}
        />

        {/* Piring Kiri: Kemeja Terakota + Kembaran Kalkir */}
        <div
          style={{
            position: 'absolute',
            left: -halfSpan,
            top: 0,
            transform: `rotate(${-angle}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: 0,
              width: 2,
              height: 44,
              background: C.inkSoft,
            }}
          />
          <div style={{position: 'absolute', left: -46, top: 40}}>
            <TerracottaShirt kalkirProgress={kalkirProgress} />
          </div>
          {/* Piring bawah kemeja */}
          <div
            style={{
              position: 'absolute',
              left: -52,
              top: 142,
              width: 104,
              height: 10,
              background: C.brass,
              borderRadius: '2px 2px 10px 10px',
              borderBottom: `3px solid ${C.brassLo}`,
            }}
          />
        </div>

        {/* Piring Kanan: Tumpukan Koin Hijau Zaitun Bercincin */}
        <div
          style={{
            position: 'absolute',
            left: halfSpan,
            top: 0,
            transform: `rotate(${-angle}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -26,
              top: 0,
              width: 2,
              height: 142,
              background: C.inkSoft,
              transform: 'rotate(10deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 0,
              width: 2,
              height: 142,
              background: C.inkSoft,
              transform: 'rotate(-10deg)',
              transformOrigin: 'top center',
            }}
          />
          {/* Piring koin */}
          <div
            style={{
              position: 'absolute',
              left: -52,
              top: 142,
              width: 104,
              height: 10,
              background: C.brass,
              borderRadius: '2px 2px 10px 10px',
              borderBottom: `3px solid ${C.brassLo}`,
            }}
          />
          {/* Tumpukan koin hijau */}
          {Array.from({length: coinCount}).map((_, i) => {
            const col = i % 2 === 0 ? -16 : 16;
            const row = Math.floor(i / 2);
            return <GreenCoinStackItem key={i} x={col} y={142 - row * 10} w={32} h={9} />;
          })}
        </div>
      </div>
    </div>
  );
};

const PlainCrate: React.FC<{x: number; y: number; w?: number; h?: number}> = ({
  x,
  y,
  w = 56,
  h = 46,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h,
      width: w,
      height: h,
      background: '#C49563',
      border: '3px solid #8E6438',
      borderRadius: 3,
      boxShadow: '2px 4px 6px rgba(0,0,0,0.3)',
      overflow: 'hidden',
    }}
  >
    {/* Garis papan polos tanpa tulisan */}
    <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.33, height: 2, background: '#9C7041'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.67, height: 2, background: '#9C7041'}} />
    <div
      style={{
        position: 'absolute',
        left: 4,
        top: 4,
        right: 4,
        bottom: 4,
        border: '2px solid rgba(130, 90, 48, 0.45)',
      }}
    />
  </div>
);

const HoistedCrate: React.FC<{
  x: number;
  baseY: number;
  liftProgress: number;
}> = ({x, baseY, liftProgress}) => {
  const curY = interpolate(liftProgress, [0, 1], [baseY, -120], CLAMP);
  const ropeTop = -600;
  const ropeHeight = Math.max(0, curY - 46 - ropeTop);

  return (
    <>
      {liftProgress > 0.001 && liftProgress < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: x - 1.5,
            top: ropeTop,
            width: 3,
            height: ropeHeight,
            background: '#B9A37E',
          }}
        />
      ) : null}
      <PlainCrate x={x} y={curY} w={54} h={44} />
    </>
  );
};

const PaperShip: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const rock = Math.sin(f * 0.04) * 1.4;
  const bobY = Math.cos(f * 0.045) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bobY,
        width: 190,
        height: 110,
        translate: '-50% -100%',
        transform: `rotate(${rock}deg)`,
        transformOrigin: '50% 85%',
        filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.3))',
      }}
    >
      <svg width={190} height={110} viewBox="0 0 190 110">
        {/* Layar segitiga kapal kertas */}
        <polygon points="95,12 42,72 95,72" fill="#EFE7DA" stroke="#C8BCAA" strokeWidth={1.5} />
        <polygon points="95,18 144,72 95,72" fill="#DFD4C3" stroke="#BEB19E" strokeWidth={1.5} />
        {/* Lambung kapal lipat */}
        <polygon points="12,72 178,72 152,102 38,102" fill="#D5C8B5" stroke="#B2A490" strokeWidth={1.5} />
        <polygon points="95,72 178,72 152,102 95,102" fill="#C4B6A1" />
      </svg>
    </div>
  );
};

const TailorAtMachine: React.FC<{
  x: number;
  y: number;
  slump: number;
  wheelAngle: number;
}> = ({x, y, slump, wheelAngle}) => {
  const shoulderDrop = interpolate(slump, [0, 1], [0, 9], CLAMP);
  const headTilt = interpolate(slump, [0, 1], [0, 8], CLAMP);
  const torsoTilt = interpolate(slump, [0, 1], [2, 9], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 220,
        height: 210,
        translate: '-50% -100%',
        filter: 'drop-shadow(3px 7px 9px rgba(0,0,0,0.36))',
      }}
    >
      {/* Bangku penjahit */}
      <Slab x={24} y={154} w={46} h={10} color={C.woodHi} r={3} />
      <Slab x={30} y={164} w={8} h={46} color={C.woodLo} r={2} />
      <Slab x={56} y={164} w={8} h={46} color={C.woodLo} r={2} />

      {/* Penjahit (tanpa wajah, bahu turun pelan saat Beat 5) */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 32 + shoulderDrop,
          width: 76,
          height: 130,
          transform: `rotate(${torsoTilt}deg)`,
          transformOrigin: '30px 115px',
        }}
      >
        {/* Kepala polos */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: shoulderDrop * 0.35,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: C.creamLo,
            border: `2.5px solid ${C.inkSoft}`,
            transform: `rotate(${headTilt}deg)`,
          }}
        />
        {/* Badan & celemek */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 48,
            width: 52,
            height: 74,
            background: ROOM.sage,
            borderRadius: '14px 14px 6px 6px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 58,
            width: 36,
            height: 62,
            background: '#E3D7C4',
            borderRadius: 4,
          }}
        />
        {/* Lengan menjahit */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 64 + shoulderDrop * 0.4,
            width: 48,
            height: 14,
            background: '#6D7D69',
            borderRadius: 7,
            transform: `rotate(${interpolate(slump, [0, 1], [-8, 6], CLAMP)}deg)`,
          }}
        />
      </div>
      {/* Kaki penjahit duduk */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 144,
          width: 38,
          height: 16,
          background: C.inkSoft,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 66,
          top: 148,
          width: 16,
          height: 58,
          background: C.inkSoft,
          borderRadius: 5,
        }}
      />

      {/* Meja jahit kayu */}
      <Slab x={84} y={134} w={128} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
      <Slab x={96} y={148} w={12} h={62} color={C.woodLo} r={2} />
      <Slab x={188} y={148} w={12} h={62} color={C.woodLo} r={2} />

      {/* Kain terakota di meja jahit */}
      <div
        style={{
          position: 'absolute',
          left: 92,
          top: 129,
          width: 54,
          height: 8,
          background: '#C9573C',
          borderRadius: 4,
        }}
      />

      {/* Mesin jahit kertas polos */}
      <svg
        width={96}
        height={66}
        viewBox="0 0 96 66"
        style={{position: 'absolute', left: 108, top: 68}}
      >
        <rect x={8} y={54} width={80} height={12} rx={3} fill={C.board} />
        <path
          d="M16 54 L16 20 Q16 10 28 10 L76 10 Q84 10 84 20 L84 54 L66 54 L66 26 L30 26 L30 54 Z"
          fill={C.boardHi}
          stroke={C.boardLo}
          strokeWidth={2}
        />
        <line x1={22} y1={26} x2={22} y2={48} stroke={C.metal} strokeWidth={2.5} />
        {/* Roda tangan mesin jahit */}
        <g transform={`translate(84, 22) rotate(${wheelAngle})`}>
          <circle cx={0} cy={0} r={11} fill="none" stroke={C.brass} strokeWidth={3.5} />
          <line x1={-10} y1={0} x2={10} y2={0} stroke={C.brassLo} strokeWidth={2} />
          <line x1={0} y1={-10} x2={0} y2={10} stroke={C.brassLo} strokeWidth={2} />
        </g>
      </svg>
    </div>
  );
};

const WarungCoffeeAnchor: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const steam1 = Math.sin(f * 0.05) * 4;
  const steam2 = Math.cos(f * 0.045) * 4;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 90,
        height: 130,
        translate: '-50% -100%',
        filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.4))',
      }}
    >
      {/* Uap kopi tipis */}
      <svg width={90} height={70} viewBox="0 0 90 70" style={{position: 'absolute', left: 0, top: 0}}>
        <path
          d={`M36 62 Q${30 + steam1} 44 ${38 - steam1 * 0.6} 28 Q${44 + steam1} 14 36 4`}
          fill="none"
          stroke="rgba(255, 248, 236, 0.55)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={`M52 64 Q${58 + steam2} 46 ${50 - steam2 * 0.6} 30 Q${44 + steam2} 16 52 8`}
          fill="none"
          stroke="rgba(255, 248, 236, 0.42)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      {/* Gelas kopi kertas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 66,
          width: 34,
          height: 40,
          translate: '-50% 0',
          background: '#EFE7DA',
          clipPath: 'polygon(8% 0, 92% 0, 82% 100%, 18% 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 78,
          width: 32,
          height: 14,
          translate: '-50% 0',
          background: '#C8A878',
          clipPath: 'polygon(4% 0, 96% 0, 92% 100%, 8% 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 62,
          width: 38,
          height: 6,
          translate: '-50% 0',
          background: '#D5C8B5',
          borderRadius: 3,
        }}
      />
      {/* Meja kecil tepi panggung */}
      <Slab x={12} y={106} w={66} h={10} color={C.woodHi} r={3} />
      <Slab x={22} y={116} w={46} h={24} color={C.woodLo} r={2} />
    </div>
  );
};

const ScarfAnchor: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.038) * 1.6;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 86,
        height: 145,
        translate: '-50% -100%',
        filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.4))',
      }}
    >
      {/* Kursi kayu tepi panggung */}
      <Slab x={18} y={46} w={10} h={99} color={C.woodLo} r={3} />
      <Slab x={18} y={54} w={46} h={10} color={C.wood} r={2} />
      <Slab x={18} y={96} w={52} h={11} color={C.woodHi} r={3} />
      <Slab x={58} y={107} w={10} h={38} color={C.woodLo} r={2} />

      {/* Syal kertas terakota panjang tergantung */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 48,
          transformOrigin: 'top center',
          transform: `rotate(${sway}deg)`,
        }}
      >
        <div
          style={{
            width: 24,
            height: 16,
            background: '#C9573C',
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 2,
            top: 12,
            width: 11,
            height: 64,
            background: '#D6674C',
            borderRadius: '2px 2px 4px 4px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: 11,
            height: 54,
            background: '#B3482F',
            borderRadius: '2px 2px 4px 4px',
          }}
        />
      </div>
    </div>
  );
};

export const D06: React.FC = () => {
  const f = useCurrentFrame();

  // 1. Cahaya panggung: pagi hangat (Beat 2-3a) -> sore teduh menyapu (Beat 3b) -> meredup sorot penjahit (Beat 5)
  const afternoonSweep = interpolate(f, [342, 385], [0, 1], CLAMP);
  const beat1Dim = interpolate(f, [0, 35, 145, 175], [0.16, 0.24, 0.24, 0.04], CLAMP);
  const beat5Dim = interpolate(f, [517, 568], [0, 0.52], CLAMP);

  // 2. Gerak kamera berkelanjutan tanpa potongan (selesai mendarat di frame 582, lalu ditahan)
  const camScale =
    1.0 +
    interpolate(f, [0, 145], [0, 0.11], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [150, 265], [0, -0.05], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [275, 445], [0, 0.07], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [465, 510], [0, -0.06], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [515, 582], [0, 0.16], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const camPanX =
    -24 +
    interpolate(f, [0, 145], [0, -64], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [150, 265], [0, 136], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [275, 445], [0, -36], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [465, 510], [0, 48], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [515, 582], [0, 118], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const camPanY =
    interpolate(f, [275, 445], [0, -8], {...CLAMP, easing: Easing.inOut(Easing.quad)}) +
    interpolate(f, [515, 582], [0, 42], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // 3. Beat 1 (scene 71-72, rel 0-135): barisan pekerja bercelemek 3 lapisan paralaks di kanan
  const workersEnter = interpolate(f, [4, 92], [180, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const workersExit = interpolate(f, [142, 185], [0, 260], {...CLAMP, easing: Easing.in(Easing.quad)});
  const workersOpacity = interpolate(f, [0, 18, 145, 182], [0, 1, 1, 0], CLAMP);

  // 4. Beat 2-3 (scene 73-74, rel 162-452): pembeli asing, timbangan, kemeja + kembaran kalkir, koin hijau
  const dockAppear = interpolate(f, [148, 188], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const buyerStepIn = interpolate(f, [175, 225], [70, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const buyerStepBack = interpolate(f, [474, 504], [0, 46], {...CLAMP, easing: Easing.out(Easing.quad)});
  const buyerX = 965 + buyerStepIn + buyerStepBack;

  // Kembaran kalkir menumpuk persis di atas kemeja pada "hari ini terasa mahal" (rel 348-378)
  const kalkirProgress = interpolate(f, [348, 378], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Koin hijau: 2 koin saat "kemarin terasa murah" (rel 302-332), bertambah jadi 8 koin saat "hari ini terasa mahal" (rel 376-438)
  const coinSteps = [302, 318, 376, 388, 400, 412, 424, 436];
  const coinCount = coinSteps.filter((t) => f >= t).length;
  const isPlacingCoin = coinSteps.some((t) => f >= t - 8 && f <= t + 4);
  const buyerReach =
    f < 470
      ? interpolate(isPlacingCoin ? 1 : 0, [0, 1], [0.25, 0.95], CLAMP)
      : interpolate(f, [470, 495], [0.25, 0], CLAMP);

  // Kemiringan timbangan mengikuti nilai kemeja vs koin hijau
  const beamAngle =
    interpolate(f, [281, 300], [0, -6.5], CLAMP) +
    interpolate(f, [302, 332], [0, 6.5], CLAMP) +
    interpolate(f, [348, 374], [0, -11.5], CLAMP) +
    interpolate(f, [376, 442], [0, 9.5], CLAMP);

  // 5. Beat 4 (scene 75, rel 471-504): peti pesanan diangkat tali satu per satu
  const liftCrate1 = interpolate(f, [471, 486], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const liftCrate2 = interpolate(f, [479, 494], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const liftCrate3 = interpolate(f, [487, 503], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});

  // 6. Beat 5 (scene 76, rel 517-602): penjahit di mesin jahit, lingkaran sorot, bahu turun pelan
  const tailorSlump = interpolate(f, [534, 580], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const wheelSpin = interpolate(f, [0, 485], [0, 1800], CLAMP);

  // Posisi layar lingkaran sorot di atas penjahit saat pose akhir
  const spotScreenX = 640 + (485 - 640 + camPanX) * camScale;
  const spotScreenY = 360 + (478 - 360 + camPanY) * camScale;
  const spotRadius = interpolate(f, [518, 565], [340, 175], {...CLAMP, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN LATAR BELAKANG (paralaks 0.35x) */}
        <div
          style={{
            position: 'absolute',
            inset: -80,
            transform: `translate(${camPanX * 0.35}px, ${camPanY * 0.35}px) scale(${1 + (camScale - 1) * 0.45})`,
            transformOrigin: '640px 360px',
          }}
        >
          {/* Dinding kertas krem hangat */}
          <Slab x={0} y={0} w={1440} h={880} color="#EAE0D1" r={0} grain={0.55} />
          {/* Sapuan cahaya sore teduh */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(82, 104, 130, 0.38) 0%, rgba(162, 134, 102, 0.22) 100%)',
              opacity: afternoonSweep,
            }}
          />
          {/* Siluet gudang dan cakrawala dermaga kertas */}
          <Slab x={120} y={445} w={210} h={235} color="#D8CCB9" r="6px 6px 0 0" />
          <Slab x={300} y={475} w={175} h={205} color="#CFC2AE" r="4px 4px 0 0" />
          <Slab x={960} y={460} w={240} h={220} color="#D5C8B5" r="6px 6px 0 0" />

          {/* Beat 1 Lapisan Paralaks 3 (terjauh): barisan pekerja kecil */}
          <div
            style={{
              opacity: workersOpacity * 0.72,
              transform: `translateX(${workersEnter * 0.45 + workersExit * 0.45}px)`,
            }}
          >
            {[740, 815, 890, 965, 1040, 1115, 1190, 1265].map((wx, idx) => (
              <ApronWorker
                key={`bg-${idx}`}
                x={wx}
                y={652}
                scale={0.68}
                shirtColor={idx % 2 === 0 ? ROOM.slate : ROOM.khaki}
                phase={idx * 17}
              />
            ))}
          </div>
        </div>

        {/* LAPISAN PANGGUNG TENGAH (paralaks 1.0x) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camPanX}px, ${camPanY}px) scale(${camScale})`,
            transformOrigin: '640px 360px',
          }}
        >
          {/* Lantai papan kertas teater */}
          <Slab x={-160} y={STAGE_FLOOR_Y} w={1600} h={240} color={C.floor} r={0} grain={0.6} />
          <div
            style={{
              position: 'absolute',
              left: -160,
              right: -160,
              top: STAGE_FLOOR_Y + 34,
              height: 3,
              background: C.floorLo,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -160,
              right: -160,
              top: STAGE_FLOOR_Y + 72,
              height: 3,
              background: C.floorLo,
              opacity: 0.85,
            }}
          />
          <Slab
            x={-160}
            y={STAGE_FLOOR_Y - 22}
            w={1600}
            h={24}
            color={C.woodLo}
            shade={C.floorLo}
            shadeH={0.35}
            r={0}
          />

          {/* Beat 1 Lapisan Paralaks 2 (tengah): pekerja bercelemek */}
          <div
            style={{
              opacity: workersOpacity * 0.9,
              transform: `translateX(${workersEnter * 0.75 + workersExit * 0.75}px)`,
            }}
          >
            {[710, 815, 920, 1025, 1130, 1235].map((wx, idx) => (
              <ApronWorker
                key={`mid-${idx}`}
                x={wx}
                y={STAGE_FLOOR_Y - 12}
                scale={0.86}
                shirtColor={idx % 2 === 0 ? ROOM.dusk : ROOM.sage}
                phase={idx * 23 + 9}
              />
            ))}
          </div>

          {/* Kiri: Kapal kertas dan gelombang dermaga */}
          <div style={{opacity: dockAppear}}>
            <PaperShip x={205} y={556} />
            <Slab x={105} y={554} w={195} h={22} color="#53728A" r="10px 10px 0 0" />
            <Slab x={95} y={570} w={215} h={25} color="#3F5B70" r="8px 8px 0 0" />
          </div>

          {/* Kiri-Tengah: Tumpukan peti polos pesanan (berkurang di Beat 4) */}
          <div style={{opacity: dockAppear}}>
            {/* 2 peti bawah tetap tersisa */}
            <PlainCrate x={338} y={STAGE_FLOOR_Y} w={56} h={46} />
            <PlainCrate x={398} y={STAGE_FLOOR_Y} w={56} h={46} />
            {/* 3 peti atas diangkat tali satu per satu */}
            <HoistedCrate x={342} baseY={STAGE_FLOOR_Y - 46} liftProgress={liftCrate3} />
            <HoistedCrate x={400} baseY={STAGE_FLOOR_Y - 46} liftProgress={liftCrate2} />
            <HoistedCrate x={371} baseY={STAGE_FLOOR_Y - 92} liftProgress={liftCrate1} />
          </div>

          {/* Tengah-Kiri: Penjahit di mesin jahit kertas */}
          <div style={{opacity: interpolate(f, [130, 175], [0, 1], CLAMP)}}>
            <TailorAtMachine
              x={485}
              y={STAGE_FLOOR_Y}
              slump={tailorSlump}
              wheelAngle={wheelSpin}
            />
          </div>

          {/* Tengah-Kanan: Timbangan kertas dua piring */}
          <div style={{opacity: dockAppear}}>
            <BalanceScale
              x={748}
              y={STAGE_FLOOR_Y}
              beamAngle={beamAngle}
              coinCount={coinCount}
              kalkirProgress={kalkirProgress}
            />
          </div>

          {/* Kanan: Pembeli asing bertopi lebar */}
          <div style={{opacity: dockAppear}}>
            <ForeignBuyer
              x={buyerX}
              y={STAGE_FLOOR_Y}
              reach={buyerReach}
              hasCoinInHand={f >= 185 && f < 476}
            />
          </div>
        </div>

        {/* LAPISAN DEPAN (paralaks 1.25x): barisan pekerja terdekat di Beat 1 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            transform: `translate(${camPanX * 1.22}px, ${camPanY * 1.1}px) scale(${1 + (camScale - 1) * 1.15})`,
            transformOrigin: '640px 360px',
            opacity: workersOpacity,
          }}
        >
          <div style={{transform: `translateX(${workersEnter + workersExit}px)`}}>
            {[760, 895, 1030, 1165].map((wx, idx) => (
              <ApronWorker
                key={`fg-${idx}`}
                x={wx}
                y={STAGE_FLOOR_Y + 26}
                scale={1.06}
                shirtColor={idx % 2 === 0 ? ROOM.terracotta : ROOM.dusk}
                phase={idx * 31 + 4}
              />
            ))}
          </div>
        </div>

        {/* CAHAYA & LINGKARAN SOROT GUNTINGAN TANGAN */}
        {/* Cahaya hangat pagi */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 52% 28%, rgba(255, 224, 152, 0.24) 0%, rgba(255, 224, 152, 0) 64%)',
            opacity: 1 - afternoonSweep * 0.85 - beat5Dim,
          }}
        />

        {/* Redup Beat 1 & Beat 5 dengan lubang lingkaran sorot gaya guntingan tangan di Beat 5 */}
        {beat1Dim > 0.001 || beat5Dim > 0.001 ? (
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
          >
            <defs>
              <mask id="d06-spotlight-mask">
                <rect x={0} y={0} width={1280} height={720} fill="#FFFFFF" />
                {beat5Dim > 0.01 ? (
                  <circle
                    cx={spotScreenX}
                    cy={spotScreenY}
                    r={spotRadius}
                    fill={`rgba(0,0,0,${interpolate(beat5Dim, [0, 0.52], [0, 0.92], CLAMP)})`}
                  />
                ) : null}
              </mask>
            </defs>
            <rect
              x={0}
              y={0}
              width={1280}
              height={720}
              fill="#171310"
              opacity={Math.max(beat1Dim, beat5Dim)}
              mask="url(#d06-spotlight-mask)"
            />
            {beat5Dim > 0.05 ? (
              <circle
                cx={spotScreenX}
                cy={spotScreenY}
                r={spotRadius}
                fill="rgba(255, 226, 158, 0.14)"
                stroke="rgba(255, 232, 178, 0.32)"
                strokeWidth={3}
              />
            ) : null}
          </svg>
        ) : null}

        {/* BINGKAI TEATER KERTAS & JANGKAR WARUNG KOPI (selalu hadir di tepi panggung) */}
        <Boil seed="d06-proscenium" amp={0.4} rot={0.05}>
          {/* Tirai teater terakota kiri */}
          <Paper lift={8}>
            <Slab x={-16} y={-10} w={92} h={740} color="#8E3F2C" shade="#6D2E1F" shadeH={0.2} r={0} />
            <Slab x={56} y={-10} w={36} h={740} color="#A64E38" shade="#7B3524" shadeH={0.2} r="0 18px 18px 0" />
          </Paper>
          {/* Tirai teater terakota kanan */}
          <Paper lift={8}>
            <Slab x={1204} y={-10} w={92} h={740} color="#8E3F2C" shade="#6D2E1F" shadeH={0.2} r={0} />
            <Slab x={1188} y={-10} w={36} h={740} color="#A64E38" shade="#7B3524" shadeH={0.2} r="18px 0 0 18px" />
          </Paper>
          {/* Pelmet tirai atas */}
          <Paper lift={9}>
            <Slab x={-10} y={-12} w={1300} h={46} color="#7D3524" shade="#5B2417" shadeH={0.35} r={0} />
          </Paper>

          {/* Jangkar warung kopi di tepi kiri bawah: gelas kopi kertas bertuap */}
          <WarungCoffeeAnchor x={76} y={714} />

          {/* Penanda tokoh "kamu" di tepi kanan bawah: syal kertas terakota di kursi */}
          <ScarfAnchor x={1204} y={714} />
        </Boil>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};