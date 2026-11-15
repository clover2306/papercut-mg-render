// Adegan D05 (scene 53-62): Ilustrasi potong nol dan redenominasi di teater kertas warung kopi.
// Menampilkan pemotongan tiga nol pada gaji dan harga bakso dalam bingkai putus-putus tanpa mengubah daya beli.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {OrbitCamera, Depth} from '../../lib/paper/camera';
import {FeltFibre, FilmWeave} from '../../lib/paper/look';
import {FLOOR_Y} from './mgkit';

export const D05_DUR = 862;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const easeIO = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

const easeOut = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.out(Easing.cubic)});

// Kartu/papan berbingkai garis PUTUS-PUTUS (penanda andaian & ilustrasi).
const DashedCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  fontSize?: number;
  bg?: string;
  color?: string;
  borderColor?: string;
  rot?: number;
  opacity?: number;
  seed?: string;
  fontFamily?: string;
  strings?: boolean;
}> = ({
  x,
  y,
  w,
  h,
  text,
  fontSize = 38,
  bg = C.cream,
  color = C.ink,
  borderColor = C.inkSoft,
  rot = 0,
  opacity = 1,
  seed = 'dcard',
  fontFamily = FONT.caption,
  strings = false,
}) => {
  if (opacity <= 0.005 || w <= 2) return null;
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
      {strings ? (
        <>
          <div style={{position: 'absolute', left: '22%', top: -180, width: 3, height: 184, background: C.inkSoft, opacity: 0.65}} />
          <div style={{position: 'absolute', right: '22%', top: -180, width: 3, height: 184, background: C.inkSoft, opacity: 0.65}} />
        </>
      ) : null}
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'relative',
            width: w,
            height: h,
            backgroundColor: bg,
            borderRadius: 8,
            boxSizing: 'border-box',
            border: `3.5px dashed ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 18px',
            filter: 'drop-shadow(2px 6px 9px rgba(0,0,0,0.28))',
          }}
        >
          {text ? (
            <span
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize,
                color,
                letterSpacing: fontFamily === FONT.banner ? '0.03em' : '-0.01em',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {text}
            </span>
          ) : null}
        </div>
      </Boil>
    </div>
  );
};

// Koin rupiah kertas kuning madu polos tanpa angka/tulisan.
const RupiahCoin: React.FC<{x: number; y: number; r?: number; opacity?: number}> = ({x, y, r = 24, opacity = 1}) => {
  if (opacity <= 0.005) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: C.sparkYellow,
        border: `3px solid ${C.brassLo}`,
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.45), 2px 4px 7px rgba(0,0,0,0.28)',
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: Math.max(4, Math.round(r * 0.24)),
          borderRadius: '50%',
          border: `2px solid ${C.brass}`,
        }}
      />
    </div>
  );
};

// Mangkuk bakso potongan kertas dengan uap (bisa berhenti saat "Tidak ada").
const BaksoBowl: React.FC<{
  x: number;
  y: number;
  s?: number;
  steamPhase: number;
  tracingOverlay?: boolean;
  opacity?: number;
}> = ({x, y, s = 1, steamPhase, tracingOverlay = false, opacity = 1}) => {
  if (opacity <= 0.005) return null;
  const w = 176 * s;
  const h = 118 * s;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -100%',
        opacity,
      }}
    >
      {/* Uap kertas tipis di atas mangkuk */}
      {!tracingOverlay &&
        [-28, 4, 34].map((dx, i) => {
          const drift = Math.sin(steamPhase * 0.055 + i * 1.9) * 5 * s;
          const rise = ((steamPhase * 0.45 + i * 18) % 36) * s;
          const op = interpolate(rise, [0, 12 * s, 36 * s], [0.15, 0.55, 0], CLAMP);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: w / 2 + dx * s + drift,
                top: -18 * s - rise,
                width: 8 * s,
                height: 26 * s,
                borderRadius: 99,
                background: 'rgba(255,252,244,0.75)',
                opacity: op,
              }}
            />
          );
        })}

      {tracingOverlay ? (
        // Kembaran kalkir: salinan tembus pandang menumpuk persis di atas mangkuk
        <div
          style={{
            position: 'relative',
            width: w,
            height: h,
            filter: 'drop-shadow(0 0 12px rgba(245,197,66,0.45))',
          }}
        >
          <svg width={w} height={h} viewBox="0 0 176 118" style={{overflow: 'visible'}}>
            <circle cx={60} cy={42} r={17} fill="rgba(255,252,245,0.68)" stroke={C.inkSoft} strokeWidth={2.5} strokeDasharray="5 4" />
            <circle cx={92} cy={38} r={18} fill="rgba(255,252,245,0.68)" stroke={C.inkSoft} strokeWidth={2.5} strokeDasharray="5 4" />
            <circle cx={120} cy={43} r={16} fill="rgba(255,252,245,0.68)" stroke={C.inkSoft} strokeWidth={2.5} strokeDasharray="5 4" />
            <path
              d="M14 48 H162 L144 98 C140 107 132 112 122 112 H54 C44 112 36 107 32 98 Z"
              fill="rgba(255,252,245,0.64)"
              stroke={C.inkSoft}
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <rect x={48} y={108} width={80} height={10} rx={4} fill="rgba(255,252,245,0.7)" stroke={C.inkSoft} strokeWidth={2.5} strokeDasharray="5 4" />
          </svg>
        </div>
      ) : (
        <Paper lift={5}>
          <svg width={w} height={h} viewBox="0 0 176 118" style={{overflow: 'visible'}}>
            {/* Mie dan kuah hangat */}
            <ellipse cx={88} cy={48} rx={70} ry={16} fill={C.amber} />
            <path d="M36 46 Q56 32 76 46 T116 46 T144 46" fill="none" stroke={C.sparkYellow} strokeWidth={5} strokeLinecap="round" />
            {/* Tiga butir bakso kertas */}
            <circle cx={60} cy={42} r={17} fill={C.woodHi} stroke={C.woodLo} strokeWidth={2} />
            <circle cx={92} cy={38} r={18} fill={C.wood} stroke={C.woodLo} strokeWidth={2} />
            <circle cx={120} cy={43} r={16} fill={C.woodHi} stroke={C.woodLo} strokeWidth={2} />
            {/* Taburan daun bawang kertas */}
            <rect x={72} y={32} width={9} height={5} rx={2} fill={C.go} transform="rotate(-18 72 32)" />
            <rect x={103} y={34} width={9} height={5} rx={2} fill={C.go} transform="rotate(24 103 34)" />
            {/* Badan mangkuk keramik kertas */}
            <path d="M14 48 H162 L144 98 C140 107 132 112 122 112 H54 C44 112 36 107 32 98 Z" fill={C.cream} />
            <path d="M22 66 H154 L150 77 H26 Z" fill={C.hero} />
            <path d="M28 83 H148 L145 90 H31 Z" fill={C.sage} />
            <rect x={10} y={44} width={156} height={9} rx={4} fill={C.creamLo} />
            <rect x={48} y={108} width={80} height={10} rx={4} fill={C.creamLo} />
          </svg>
        </Paper>
      )}
    </div>
  );
};

// Gunting kertas raksasa digantung tali dari atas.
const GiantScissors: React.FC<{
  x: number;
  y: number;
  openDeg: number;
  rot?: number;
  s?: number;
  opacity?: number;
}> = ({x, y, openDeg, rot = 0, s = 1, opacity = 1}) => {
  if (opacity <= 0.005) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 240 * s,
        height: 220 * s,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        opacity,
      }}
    >
      {/* Tali kertas penggantung */}
      <div style={{position: 'absolute', left: 118 * s, top: -260, width: 3, height: 345, background: C.inkSoft, opacity: 0.65}} />
      <Paper lift={8}>
        <svg width={240 * s} height={220 * s} viewBox="0 0 240 220" style={{overflow: 'visible'}}>
          {/* Bilah & gagang atas */}
          <g transform={`rotate(${-openDeg} 120 110)`}>
            <polygon points="105,103 226,92 232,107 105,115" fill={C.metal} stroke={C.metalLo} strokeWidth={2} />
            <path
              d="M110 106 L64 68 C46 53 20 62 20 84 C20 102 38 112 58 108 L108 112 Z"
              fill="none"
              stroke={C.hero}
              strokeWidth={14}
              strokeLinejoin="round"
            />
          </g>
          {/* Bilah & gagang bawah */}
          <g transform={`rotate(${openDeg} 120 110)`}>
            <polygon points="105,105 232,113 226,128 105,117" fill={C.metalLo} stroke={C.inkSoft} strokeWidth={1.5} />
            <path
              d="M110 114 L64 152 C46 167 20 158 20 136 C20 118 38 108 58 112 L108 108 Z"
              fill="none"
              stroke={C.heroLo}
              strokeWidth={14}
              strokeLinejoin="round"
            />
          </g>
          {/* Poros sekrup kuningan */}
          <circle cx={120} cy={110} r={9} fill={C.brass} stroke={C.brassLo} strokeWidth={2.5} />
        </svg>
      </Paper>
    </div>
  );
};

// Timbangan dua piring berbahan kayu dan kuningan (tanpa skala angka).
const BalanceScale: React.FC<{
  x: number;
  y: number;
  tiltDeg?: number;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  opacity?: number;
}> = ({x, y, tiltDeg = 0, leftContent, rightContent, opacity = 1}) => {
  if (opacity <= 0.005) return null;
  const rad = (tiltDeg * Math.PI) / 180;
  const arm = 165;
  const lx = -Math.cos(rad) * arm;
  const ly = -Math.sin(rad) * arm;
  const rx = Math.cos(rad) * arm;
  const ry = Math.sin(rad) * arm;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, opacity}}>
      {/* Alas & tiang timbangan */}
      <Paper lift={5}>
        <Slab x={-86} y={-22} w={172} h={22} color={C.wood} shade={C.woodLo} shadeH={0.35} r={5} />
        <Slab x={-58} y={-40} w={116} h={20} color={C.woodHi} shade={C.wood} shadeH={0.3} r={4} />
        <Slab x={-10} y={-246} w={20} h={210} color={C.brass} shade={C.brassLo} shadeH={0.18} r={4} />
        <div
          style={{
            position: 'absolute',
            left: -16,
            top: -260,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: C.sparkYellow,
            border: `3px solid ${C.brassLo}`,
          }}
        />
      </Paper>

      {/* Lengan timbangan */}
      <div
        style={{
          position: 'absolute',
          left: -185,
          top: -242,
          width: 370,
          height: 14,
          borderRadius: 7,
          background: C.brass,
          border: `2px solid ${C.brassLo}`,
          rotate: `${tiltDeg}deg`,
          boxShadow: '0 4px 8px rgba(0,0,0,0.22)',
        }}
      />

      {/* Piring kiri */}
      <div style={{position: 'absolute', left: lx, top: -235 + ly}}>
        <div style={{position: 'absolute', left: -46, top: 0, width: 2, height: 96, background: C.inkSoft, rotate: '24deg', transformOrigin: 'top'}} />
        <div style={{position: 'absolute', left: 46, top: 0, width: 2, height: 96, background: C.inkSoft, rotate: '-24deg', transformOrigin: 'top'}} />
        <Slab x={-68} y={84} w={136} h={14} color={C.brassLo} r="2px 2px 14px 14px" />
        <div style={{position: 'absolute', left: 0, top: 84}}>{leftContent}</div>
      </div>

      {/* Piring kanan */}
      <div style={{position: 'absolute', left: rx, top: -235 + ry}}>
        <div style={{position: 'absolute', left: -46, top: 0, width: 2, height: 96, background: C.inkSoft, rotate: '24deg', transformOrigin: 'top'}} />
        <div style={{position: 'absolute', left: 46, top: 0, width: 2, height: 96, background: C.inkSoft, rotate: '-24deg', transformOrigin: 'top'}} />
        <Slab x={-68} y={84} w={136} h={14} color={C.brassLo} r="2px 2px 14px 14px" />
        <div style={{position: 'absolute', left: 0, top: 84}}>{rightContent}</div>
      </div>
    </div>
  );
};

// Jangkar dunia bersama: panggung teater kertas warung kopi, tirai terakota, gelas kopi bertuap, dan syal terakota.
const SharedTheatreFrame: React.FC<{steamPhase: number}> = ({steamPhase}) => (
  <>
    {/* Sorotan lampu hangat kuning madu dari atas */}
    <div
      style={{
        position: 'absolute',
        left: 190,
        top: 0,
        width: 900,
        height: FLOOR_Y,
        background: 'linear-gradient(180deg, rgba(245,197,66,0.20) 0%, rgba(245,197,66,0.06) 65%, rgba(245,197,66,0) 100%)',
        clipPath: 'polygon(26% 0%, 74% 0%, 100% 100%, 0% 100%)',
        pointerEvents: 'none',
      }}
    />

    {/* Bingkai garis PUTUS-PUTUS yang melingkari area ilustrasi (penanda seluruh adegan adalah andaian) */}
    <div
      style={{
        position: 'absolute',
        left: 96,
        top: 38,
        width: 1088,
        height: 550,
        borderRadius: 16,
        border: '3px dashed rgba(58,56,50,0.42)',
        pointerEvents: 'none',
      }}
    />

    {/* Jangkar warung di tepi kiri: bangku syal terakota + meja kecil dengan gelas kopi kertas bertuap */}
    <Paper lift={5}>
      {/* Kait/tiang kayu tepi kiri dengan syal kertas terakota menggantung */}
      <Slab x={56} y={FLOOR_Y - 165} w={12} h={165} color={C.woodLo} r={4} />
      <Slab x={42} y={FLOOR_Y - 12} w={40} h={12} color={C.wood} r={4} />
      <Slab x={48} y={FLOOR_Y - 158} w={26} h={10} color={C.brassLo} r={4} />
      {/* Syal terakota penanda tokoh utama di dunia bersama */}
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: FLOOR_Y - 154,
          width: 22,
          height: 112,
          background: C.hero,
          borderRadius: '8px 8px 3px 3px',
          rotate: '3deg',
          boxShadow: '2px 4px 6px rgba(0,0,0,0.25)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: FLOOR_Y - 150,
          width: 18,
          height: 98,
          background: C.heroLo,
          borderRadius: '6px 6px 2px 2px',
          rotate: '-4deg',
        }}
      />

      {/* Meja warung mungil di kiri */}
      <Slab x={94} y={FLOOR_Y - 82} w={74} h={11} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={3} />
      <Slab x={106} y={FLOOR_Y - 71} w={9} h={71} color={C.wood} r={2} />
      <Slab x={147} y={FLOOR_Y - 71} w={9} h={71} color={C.wood} r={2} />

      {/* Gelas kopi kertas polos dengan selongsong kraft */}
      <div
        style={{
          position: 'absolute',
          left: 115,
          top: FLOOR_Y - 122,
          width: 30,
          height: 40,
          background: C.cream,
          clipPath: 'polygon(8% 0%, 92% 0%, 82% 100%, 18% 100%)',
          boxShadow: '1px 3px 5px rgba(0,0,0,0.22)',
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 12, height: 15, background: C.tape}} />
      </div>
      <Slab x={112} y={FLOOR_Y - 127} w={36} h={6} color={C.creamLo} r={3} />
    </Paper>

    {/* Uap kopi tipis */}
    {[0, 1].map((idx) => {
      const rise = (steamPhase * 0.42 + idx * 16) % 32;
      const sway = Math.sin(steamPhase * 0.05 + idx * 2.1) * 3.5;
      const op = interpolate(rise, [0, 10, 32], [0.15, 0.52, 0], CLAMP);
      return (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: 124 + idx * 9 + sway,
            top: FLOOR_Y - 146 - rise,
            width: 5,
            height: 18,
            borderRadius: 99,
            background: '#FFFDF8',
            opacity: op,
          }}
        />
      );
    })}

    {/* Tirai teater terakota berlapis di sisi kiri, kanan, dan pelmet atas */}
    <Paper lift={9}>
      {[0, 28, 54].map((xPos, i) => (
        <Slab
          key={`cl-${i}`}
          x={xPos - 8}
          y={0}
          w={38}
          h={720}
          color={i % 2 === 0 ? ROOM.terracotta : C.heroLo}
          shade="rgba(0,0,0,0.22)"
          shadeH={0.08}
          r="0 0 18px 18px"
        />
      ))}
      {[1248, 1220, 1194].map((xPos, i) => (
        <Slab
          key={`cr-${i}`}
          x={xPos}
          y={0}
          w={38}
          h={720}
          color={i % 2 === 0 ? ROOM.terracotta : C.heroLo}
          shade="rgba(0,0,0,0.22)"
          shadeH={0.08}
          r="0 0 18px 18px"
        />
      ))}
      {/* Pelmet tirai atas */}
      <Slab x={0} y={0} w={1280} h={30} color={C.heroLo} shade="rgba(0,0,0,0.25)" shadeH={0.35} r={0} />
    </Paper>
  </>
);

export const D05: React.FC = () => {
  const f = useCurrentFrame();

  // Uap berhenti sesaat pada scene 57 ("Tidak ada.", rel 423-435)
  const steamFrozen = f >= 423 && f <= 435;
  const steamPhase = f < 423 ? f : f <= 435 ? 423 : f - 12;

  // Gerak kamera halus antar-beat: dolly-in saat memotong nol, lalu pull-out di Beat 7
  const camZoom =
    1 +
    easeIO(f, 155, 210, 0, 0.06) -
    easeIO(f, 355, 390, 0, 0.03) +
    easeIO(f, 590, 665, 0, 0.04) -
    easeIO(f, 815, 854, 0, 0.07);
  const camPanX =
    easeIO(f, 245, 290, 0, -18) +
    easeIO(f, 358, 400, 0, 18) +
    easeIO(f, 460, 560, 0, -24) +
    easeIO(f, 560, 675, 0, 42) +
    easeIO(f, 705, 854, 0, -34);

  // ---------------- BEAT 1: Scene 53 (rel 0-126, keluar sebelum 162) ----------------
  const bayangkanY = easeOut(f, 0, 18, -80, 74) - easeIO(f, 130, 154, 0, 175);
  const bayangkanOp = interpolate(f, [0, 8, 134, 152], [0, 1, 1, 0], CLAMP);

  const beat1PropsOp = interpolate(f, [0, 14, 130, 154], [0, 1, 1, 0], CLAMP);
  const conveyorShift = interpolate(f, [0, 155], [0, 170], CLAMP);

  // ---------------- BEAT 2: Scene 54 (rel 162-246) ----------------
  const envIn = easeOut(f, 160, 178, 180, 0);
  const envOut = easeIO(f, 240, 249, 0, -520);
  const envOp = interpolate(f, [160, 168, 241, 248], [0, 1, 1, 0], CLAMP);
  const salaryCutFrame = 202;
  const oldSalaryOp = interpolate(f, [162, 168, salaryCutFrame - 2, salaryCutFrame], [0, 1, 1, 0], CLAMP);
  const newSalaryOp = interpolate(f, [salaryCutFrame + 1, salaryCutFrame + 7, 241, 248], [0, 1, 1, 0], CLAMP);
  const salaryScrapDrop = easeOut(f, salaryCutFrame, 236, 0, 135);
  const salaryScrapOp = interpolate(f, [salaryCutFrame, salaryCutFrame + 4, 236], [0, 0.9, 0], CLAMP);

  // ---------------- BEAT 3: Scene 55 (rel 249-358) ----------------
  const bowl3In = easeOut(f, 249, 267, 170, 0);
  const bowl3Out = easeIO(f, 354, 372, 0, 180);
  const bowl3Op = interpolate(f, [249, 257, 355, 370], [0, 1, 1, 0], CLAMP);
  const baksoCutFrame = 303;
  const oldBaksoOp = interpolate(f, [252, 258, baksoCutFrame - 2, baksoCutFrame], [0, 1, 1, 0], CLAMP);
  const newBaksoOp = interpolate(f, [baksoCutFrame + 1, baksoCutFrame + 7, 355, 368], [0, 1, 1, 0], CLAMP);
  const baksoScrapDrop = easeOut(f, baksoCutFrame, 340, 0, 135);
  const baksoScrapOp = interpolate(f, [baksoCutFrame, baksoCutFrame + 4, 340], [0, 0.9, 0], CLAMP);

  // Gerak gunting raksasa (Beat 1-3, Beat 6, lalu diam di Beat 7)
  const scissorsX =
    660 +
    easeIO(f, 160, 185, 0, 145) +
    easeIO(f, 248, 275, 0, -25) +
    easeIO(f, 358, 390, 0, -370) +
    easeIO(f, 705, 735, 0, 20) -
    easeIO(f, 815, 848, 0, 20);
  const scissorsY =
    205 +
    easeIO(f, 175, 194, 0, 82) -
    easeIO(f, 212, 235, 0, 82) +
    easeIO(f, 272, 294, 0, 74) -
    easeIO(f, 314, 340, 0, 74) -
    easeIO(f, 360, 385, 0, 58) +
    easeIO(f, 720, 738, 0, 48) -
    easeIO(f, 755, 780, 0, 48);

  const snip1 = interpolate(f, [65, 82, 96], [20, 3, 18], CLAMP);
  const snip2 = interpolate(f, [186, 198, 203, 216], [18, 24, 1, 16], CLAMP);
  const snip3 = interpolate(f, [286, 299, 304, 318], [16, 24, 1, 15], CLAMP);
  const snip6 = interpolate(f, [732, 742, 748, 762], [15, 22, 2, 12], CLAMP);
  const scissorsOpen = f < 140 ? snip1 : f < 245 ? snip2 : f < 360 ? snip3 : f < 790 ? snip6 : 12;

  // ---------------- BEAT 4: Scene 56-57 (rel 380-435) & muncul lagi di POSE AKHIR ----------------
  const scaleBeat4Op = interpolate(f, [374, 386, 440, 454], [0, 1, 1, 0], CLAMP);
  const scaleFinaleOp = interpolate(f, [816, 834], [0, 1], CLAMP);
  const scaleOp = Math.max(scaleBeat4Op, scaleFinaleOp);
  const scaleX = f < 500 ? 640 : 410;
  const scaleTilt =
    f < 404
      ? Math.sin(interpolate(f, [374, 404], [0, Math.PI * 2], CLAMP)) *
        interpolate(f, [374, 404], [2.4, 0], CLAMP)
      : 0;

  // ---------------- BEAT 5: Scene 58-60 (rel 456-687) ----------------
  const beat5Op = interpolate(f, [454, 466, 692, 712], [0, 1, 1, 0], CLAMP);
  const leftCoinX = easeOut(f, 462, 502, 285, 375);
  const rightCoinX = easeOut(f, 522, 562, 695, 785);
  // Pita/tag angka di sisi mangkuk kanan memendek pada scene 59 (rel 597-629)
  const rightStripW = easeIO(f, 597, 626, 168, 76);
  // Kembaran kalkir menumpuk persis di atas mangkuk kanan pada scene 60 (rel 645-687)
  const tracingProgress = easeIO(f, 645, 676, 0, 1);
  const tracingOp = interpolate(f, [645, 653, 692, 712], [0, 1, 1, 0], CLAMP);
  const tracingX = interpolate(tracingProgress, [0, 1], [475, 885], CLAMP);
  const tracingY = 472 - Math.sin(tracingProgress * Math.PI) * 58;
  const tracingHaloOp = interpolate(f, [674, 682, 692, 712], [0, 1, 1, 0], CLAMP);

  // ---------------- BEAT 6: Scene 61 (rel 716-801) ----------------
  const redenomY = easeOut(f, 716, 734, -80, 74);
  const redenomOp = interpolate(f, [716, 724], [0, 1], CLAMP);
  const beat6PedestalOp = interpolate(f, [718, 732, 808, 824], [0, 1, 1, 0], CLAMP);
  const chestPedestalX = easeIO(f, 814, 844, 775, 765);
  const chestPedestalOp = interpolate(f, [718, 732], [0, 1], CLAMP);

  // ---------------- BEAT 7: Scene 62 (rel 817-862) ----------------
  const doorOp = interpolate(f, [816, 832], [0, 1], CLAMP);
  const doorOpen = easeOut(f, 820, 848, 0.15, 1);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera dur={D05_DUR} yaw={11} push={1.06} focus={0.5} depth={640} origin={[640, 540]}>
          {/* Lapisan 0: Dinding kertas krem hangat & vinyet */}
          <Depth z={0} cover>
            <Slab x={0} y={0} w={1280} h={720} color={C.creamHi} r={0} grain={0.55} />
            <FeltFibre opacity={0.16} blend="screen" />
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.28) 100%)',
              }}
            />
          </Depth>

          {/* Lapisan 0.35: Lantai papan kayu krem & panggung utama */}
          <Depth z={0.35}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translate(${camPanX}px, 0px) scale(${camZoom})`,
                transformOrigin: '640px 440px',
              }}
            >
              {/* Lantai papan kertas krem */}
              <Slab x={-80} y={FLOOR_Y} w={1440} h={160} color={C.creamLo} r={0} grain={0.5} />
              <div style={{position: 'absolute', left: -80, right: -80, top: FLOOR_Y + 36, height: 2, background: 'rgba(58,56,50,0.22)'}} />
              <div style={{position: 'absolute', left: -80, right: -80, top: FLOOR_Y + 74, height: 2, background: 'rgba(58,56,50,0.22)'}} />
              <Slab x={-80} y={FLOOR_Y - 18} w={1440} h={20} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={0} />

              {/* BEAT 1 PROPS: Siluet gedung pemerintah kiri & rel amplop/tag polos */}
              {beat1PropsOp > 0.005 ? (
                <div style={{opacity: beat1PropsOp}}>
                  <Paper lift={4}>
                    <svg width={250} height={240} viewBox="0 0 250 240" style={{position: 'absolute', left: 195, top: FLOOR_Y - 240}}>
                      <polygon points="125,14 232,68 18,68" fill={C.sage} />
                      <rect x={26} y={68} width={198} height={14} fill={C.sageLo} />
                      <rect x={34} y={82} width={182} height={134} fill={C.cream} />
                      {[48, 86, 124, 162, 194].map((cx, i) => (
                        <rect key={i} x={cx} y={82} width={12} height={134} fill={C.creamLo} />
                      ))}
                      <rect x={16} y={216} width={218} height={12} fill={C.creamLo} />
                      <rect x={8} y={228} width={234} height={12} fill={C.tape} />
                    </svg>
                  </Paper>

                  {/* Rel horizontal dengan amplop uang & tag harga polos tanpa teks */}
                  <Slab x={450} y={448} w={680} h={8} color={C.wood} r={4} />
                  {[0, 1, 2, 3].map((idx) => {
                    const itemX = 480 + idx * 155 + (conveyorShift % 155);
                    if (itemX > 1090) return null;
                    const isEnvelope = idx % 2 === 0;
                    return isEnvelope ? (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          left: itemX,
                          top: 372,
                          width: 96,
                          height: 62,
                          background: C.cream,
                          border: `2.5px dashed ${C.inkSoft}`,
                          borderRadius: 6,
                          boxShadow: '2px 4px 7px rgba(0,0,0,0.2)',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 96,
                            height: 30,
                            background: C.creamLo,
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: 38,
                            top: 22,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: C.sparkYellow,
                            border: `2px solid ${C.brassLo}`,
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          left: itemX,
                          top: 378,
                          width: 108,
                          height: 52,
                          background: C.tape,
                          border: `2.5px dashed ${C.inkSoft}`,
                          borderRadius: 6,
                          boxShadow: '2px 4px 7px rgba(0,0,0,0.2)',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 10,
                            top: 20,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: C.creamHi,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* BEAT 2 PROPS: Amplop gaji berbingkai putus-putus & tag Rp5.000.000 -> Rp5.000 */}
              {envOp > 0.005 ? (
                <div style={{opacity: envOp}}>
                  <Paper lift={6}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 390 + envOut,
                        top: 345 + envIn,
                        width: 210,
                        height: 136,
                        background: C.cream,
                        border: `3.5px dashed ${C.inkSoft}`,
                        borderRadius: 10,
                        boxShadow: '3px 7px 12px rgba(0,0,0,0.26)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: 210,
                          height: 66,
                          background: C.creamLo,
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        }}
                      />
                      <RupiahCoin x={105} y={66} r={22} />
                    </div>
                  </Paper>

                  {/* Tali penghubung ke tag gaji */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 600 + envOut,
                      top: 412 + envIn,
                      width: 34,
                      height: 3,
                      background: C.inkSoft,
                    }}
                  />

                  {/* Tag lama utuh: Rp5.000.000 */}
                  <DashedCard
                    x={792 + envOut}
                    y={413 + envIn}
                    w={316}
                    h={78}
                    text="Rp5.000.000"
                    fontSize={40}
                    bg={C.creamHi}
                    opacity={oldSalaryOp}
                    seed="sal-old"
                  />

                  {/* Potongan kertas kosong yang tergunting jatuh dan memudar */}
                  {salaryScrapOp > 0.005 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 855 + envOut,
                        top: 374 + envIn + salaryScrapDrop,
                        width: 96,
                        height: 78,
                        background: C.creamHi,
                        borderTop: `3.5px dashed ${C.inkSoft}`,
                        borderRight: `3.5px dashed ${C.inkSoft}`,
                        borderBottom: `3.5px dashed ${C.inkSoft}`,
                        borderRadius: '0 8px 8px 0',
                        rotate: `${salaryScrapDrop * 0.14}deg`,
                        opacity: salaryScrapOp,
                      }}
                    />
                  ) : null}

                  {/* Tag baru memendek: Rp5.000 */}
                  <DashedCard
                    x={736 + envOut}
                    y={413 + envIn}
                    w={204}
                    h={78}
                    text="Rp5.000"
                    fontSize={42}
                    bg={C.creamHi}
                    opacity={newSalaryOp}
                    seed="sal-new"
                  />
                </div>
              ) : null}

              {/* BEAT 3 PROPS: Semangkuk bakso bertuap & tag Rp20.000 -> Rp20 */}
              {bowl3Op > 0.005 ? (
                <div style={{opacity: bowl3Op}}>
                  <Slab x={395} y={486 + bowl3In + bowl3Out} w={250} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={6} />
                  <BaksoBowl x={520} y={486 + bowl3In + bowl3Out} s={1.25} steamPhase={steamPhase} />

                  {/* Tali tag */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 626,
                      top: 416 + bowl3In + bowl3Out,
                      width: 34,
                      height: 3,
                      background: C.inkSoft,
                    }}
                  />

                  {/* Tag harga lama: Rp20.000 */}
                  <DashedCard
                    x={786}
                    y={416 + bowl3In + bowl3Out}
                    w={252}
                    h={76}
                    text="Rp20.000"
                    fontSize={40}
                    bg={C.creamHi}
                    opacity={oldBaksoOp}
                    seed="bak-old"
                  />

                  {/* Potongan kertas kosong jatuh memudar */}
                  {baksoScrapOp > 0.005 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 818,
                        top: 378 + bowl3In + bowl3Out + baksoScrapDrop,
                        width: 92,
                        height: 76,
                        background: C.creamHi,
                        borderTop: `3.5px dashed ${C.inkSoft}`,
                        borderRight: `3.5px dashed ${C.inkSoft}`,
                        borderBottom: `3.5px dashed ${C.inkSoft}`,
                        borderRadius: '0 8px 8px 0',
                        rotate: `${baksoScrapDrop * 0.15}deg`,
                        opacity: baksoScrapOp,
                      }}
                    />
                  ) : null}

                  {/* Tag harga baru memendek: Rp20 */}
                  <DashedCard
                    x={730}
                    y={416 + bowl3In + bowl3Out}
                    w={140}
                    h={76}
                    text="Rp20"
                    fontSize={42}
                    bg={C.creamHi}
                    opacity={newBaksoOp}
                    seed="bak-new"
                  />
                </div>
              ) : null}

              {/* BEAT 4 & POSE AKHIR: Timbangan dua piring datar dengan tag panjang vs tag pendek */}
              {scaleOp > 0.005 ? (
                <BalanceScale
                  x={scaleX}
                  y={FLOOR_Y}
                  tiltDeg={scaleTilt}
                  opacity={scaleOp}
                  leftContent={
                    <>
                      <BaksoBowl x={0} y={0} s={0.74} steamPhase={steamPhase} />
                      {/* Tag lama (diwakili pita tag panjang berbingkai putus-putus, tanpa teks) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -64,
                          top: 18,
                          width: 128,
                          height: 24,
                          borderRadius: 5,
                          background: C.creamHi,
                          border: `2.5px dashed ${C.inkSoft}`,
                        }}
                      />
                    </>
                  }
                  rightContent={
                    <>
                      <BaksoBowl x={0} y={0} s={0.74} steamPhase={steamPhase} />
                      {/* Tag baru (diwakili pita tag pendek berbingkai putus-putus, tanpa teks) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -34,
                          top: 18,
                          width: 68,
                          height: 24,
                          borderRadius: 5,
                          background: C.creamHi,
                          border: `2.5px dashed ${C.inkSoft}`,
                        }}
                      />
                    </>
                  }
                />
              ) : null}

              {/* BEAT 5: Koin kuning madu membeli semangkuk bakso kemarin vs hari ini + kembaran kalkir */}
              {beat5Op > 0.005 ? (
                <div style={{opacity: beat5Op}}>
                  {/* Garis pemisah tipis antara "kemarin" (kiri) dan "hari ini" (kanan) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 640,
                      top: 230,
                      width: 2,
                      height: 330,
                      borderLeft: '3px dashed rgba(58,56,50,0.28)',
                    }}
                  />

                  {/* Kiri: koin + mangkuk bakso + pita tag panjang */}
                  <RupiahCoin x={leftCoinX} y={432} r={26} />
                  <BaksoBowl x={475} y={472} s={0.96} steamPhase={steamPhase} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 391,
                      top: 492,
                      width: 168,
                      height: 26,
                      borderRadius: 6,
                      background: C.creamHi,
                      border: `2.5px dashed ${C.inkSoft}`,
                    }}
                  />

                  {/* Kanan: koin + mangkuk bakso + pita tag yang memendek pada scene 59 */}
                  <RupiahCoin x={rightCoinX} y={432} r={26} />
                  <BaksoBowl x={885} y={472} s={0.96} steamPhase={steamPhase} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 885 - rightStripW / 2,
                      top: 492,
                      width: rightStripW,
                      height: 26,
                      borderRadius: 6,
                      background: C.creamHi,
                      border: `2.5px dashed ${C.inkSoft}`,
                    }}
                  />

                  {/* Lingkaran sorot lembut ketika kembaran kalkir mendarat persis */}
                  {tracingHaloOp > 0.005 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 885,
                        top: 422,
                        width: 210,
                        height: 210,
                        translate: '-50% -50%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245,197,66,0.34) 0%, rgba(245,197,66,0) 70%)',
                        opacity: tracingHaloOp,
                      }}
                    />
                  ) : null}

                  {/* Kembaran kalkir mangkuk bakso yang menumpuk persis di atas mangkuk kanan */}
                  <BaksoBowl
                    x={tracingX}
                    y={tracingY}
                    s={0.96}
                    steamPhase={steamPhase}
                    tracingOverlay
                    opacity={tracingOp}
                  />
                </div>
              ) : null}

              {/* BEAT 6: Dua pedestal terpisah (kiri: tag angka yang terpotong; kanan: peti koin kekayaan) */}
              {beat6PedestalOp > 0.005 ? (
                <div style={{opacity: beat6PedestalOp}}>
                  {/* Pedestal kiri untuk tag angka */}
                  <Paper lift={5}>
                    <Slab x={410} y={FLOOR_Y - 126} w={136} h={126} color={C.cream} shade={C.creamLo} shadeH={0.14} r="6px 6px 0 0" />
                    <Slab x={398} y={FLOOR_Y - 140} w={160} h={16} color={C.woodHi} r={4} />
                  </Paper>
                  <DashedCard x={478} y={FLOOR_Y - 182} w={116} h={56} bg={C.creamHi} seed="ped-tag" />
                </div>
              ) : null}

              {/* Pedestal kanan: peti koin kekayaan yang tidak tersentuh gunting (bertahan sampai pose akhir) */}
              {chestPedestalOp > 0.005 ? (
                <div style={{opacity: chestPedestalOp}}>
                  <Paper lift={6}>
                    <Slab
                      x={chestPedestalX - 78}
                      y={FLOOR_Y - 134}
                      w={156}
                      h={134}
                      color={C.cream}
                      shade={C.creamLo}
                      shadeH={0.14}
                      r="6px 6px 0 0"
                    />
                    <Slab x={chestPedestalX - 90} y={FLOOR_Y - 148} w={180} h={16} color={C.woodHi} r={4} />
                    {/* Peti kayu berkancing kuningan penuh koin kuning madu */}
                    <Slab
                      x={chestPedestalX - 64}
                      y={FLOOR_Y - 216}
                      w={128}
                      h={68}
                      color={C.wood}
                      shade={C.woodLo}
                      shadeH={0.25}
                      r={6}
                    />
                    <Slab x={chestPedestalX - 68} y={FLOOR_Y - 236} w={136} h={22} color={C.woodHi} r="10px 10px 2px 2px" />
                    <Slab x={chestPedestalX - 12} y={FLOOR_Y - 224} w={24} h={28} color={C.brass} r={4} />
                  </Paper>
                  <RupiahCoin x={chestPedestalX - 30} y={FLOOR_Y - 238} r={14} />
                  <RupiahCoin x={chestPedestalX} y={FLOOR_Y - 244} r={16} />
                  <RupiahCoin x={chestPedestalX + 30} y={FLOOR_Y - 238} r={14} />
                </div>
              ) : null}

              {/* BEAT 7: Pintu kertas besar setengah terbuka bercahaya di sisi kanan */}
              {doorOp > 0.005 ? (
                <div style={{opacity: doorOp}}>
                  {/* Cahaya hangat tumpah dari celah pintu */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 910,
                      top: FLOOR_Y - 295,
                      width: 230,
                      height: 315,
                      background:
                        'linear-gradient(245deg, rgba(245,197,66,0.45) 0%, rgba(245,197,66,0.14) 55%, rgba(245,197,66,0) 100%)',
                      clipPath: 'polygon(42% 0%, 100% 0%, 100% 94%, 0% 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Paper lift={6}>
                    {/* Kusen pintu kertas */}
                    <Slab x={995} y={FLOOR_Y - 302} w={132} h={302} color={C.woodLo} r="8px 8px 0 0" />
                    {/* Cahaya dalam ambang pintu */}
                    <Slab x={1007} y={FLOOR_Y - 290} w={108} h={290} color={C.sparkYellow} r="4px 4px 0 0" />
                    {/* Daun pintu setengah terbuka */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 1007,
                        top: FLOOR_Y - 290,
                        width: 108 * (1 - 0.36 * doorOpen),
                        height: 290,
                        background: C.woodHi,
                        borderRight: `4px solid ${C.woodLo}`,
                        boxShadow: '6px 4px 12px rgba(0,0,0,0.32)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: 142,
                          width: 11,
                          height: 11,
                          borderRadius: '50%',
                          background: C.brass,
                        }}
                      />
                    </div>
                  </Paper>
                </div>
              ) : null}

              {/* Gunting kertas raksasa */}
              <GiantScissors
                x={scissorsX}
                y={scissorsY}
                openDeg={scissorsOpen}
                rot={f >= 815 ? 0 : -6}
                s={f >= 815 ? 0.86 : 1}
              />
            </div>
          </Depth>

          {/* Lapisan 0.65: Papan gantung berbingkai PUTUS-PUTUS ("BAYANGKAN" & "REDENOMINASI") */}
          <Depth z={0.65}>
            <PopIn at={0}>
              <DashedCard
                x={640}
                y={bayangkanY}
                w={380}
                h={68}
                text="BAYANGKAN"
                fontSize={38}
                fontFamily={FONT.banner}
                bg={C.cream}
                color={C.ink}
                rot={-1}
                opacity={bayangkanOp}
                seed="board-bayangkan"
                strings
              />
            </PopIn>

            {redenomOp > 0.005 ? (
              <DashedCard
                x={640}
                y={redenomY}
                w={460}
                h={70}
                text="REDENOMINASI"
                fontSize={38}
                fontFamily={FONT.banner}
                bg={C.cream}
                color={C.ink}
                rot={-0.8}
                opacity={redenomOp}
                seed="board-redenom"
                strings
              />
            ) : null}
          </Depth>

          {/* Lapisan 0.9: Tirai teater terakota & jangkar warung kopi di tepi panggung */}
          <Depth z={0.9}>
            <SharedTheatreFrame steamPhase={steamFrozen ? 423 : steamPhase} />
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};