// Adegan M13 (Scene 112-118, 406,10-423,96 dtk): Jalan kertas menuju piring melewati tiga gerbang
// pertanyaan yang terbuka satu per satu, pita hadiah rapi, lalu dompet dan masalah bertukar tempat.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Plant, Window} from '../../lib/paper/sets';

export const M13_DUR = 536;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ROAD_TOP = 514;
const ROAD_H = 54;
const PLATE_CX = 1138;
const PLATE_CY = 534;

type GateSpec = {
  cx: number;
  line1: string;
  line2: string;
  openAt: number;
  accent: string;
  seed: string;
};

const GATES: readonly GateSpec[] = [
  {
    cx: 340,
    line1: 'siapa yang',
    line2: 'membayar',
    openAt: 157,
    accent: ROOM.navy,
    seed: 'm13-g1',
  },
  {
    cx: 610,
    line1: 'berapa',
    line2: 'biayanya',
    openAt: 199,
    accent: ROOM.teal,
    seed: 'm13-g2',
  },
  {
    cx: 880,
    line1: 'apakah mutunya',
    line2: 'terjaga',
    openAt: 245,
    accent: C.go,
    seed: 'm13-g3',
  },
];

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.4}}>
      <Window x={34} y={228} w={138} h={205} night={false} />
    </div>
    <div style={{opacity: 0.44}}>
      <Plant x={1115} y={372} s={0.68} />
    </div>
  </AbsoluteFill>
);

/* Jalan kertas berlapis membentang dari sisi kiri menuju piring makan di ujung kanan */
const PaperRoad: React.FC = () => {
  const f = useCurrentFrame();
  const enterP = interpolate(f, [0, 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const roadX = 68;
  const roadW = 1095 * enterP;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Lapisan alas kertas coklat hangat */}
      <Paper lift={5}>
        <Slab
          x={roadX}
          y={ROAD_TOP}
          w={roadW}
          h={ROAD_H}
          color={C.cream}
          shade={C.creamLo}
          shadeH={0.28}
          r={10}
        />
      </Paper>

      {/* Garis putus-putus penunjuk jalur di tengah jalan kertas */}
      {enterP > 0.2
        ? Array.from({length: 15}).map((_, i) => {
            const dashX = roadX + 34 + i * 70;
            if (dashX + 36 > roadX + roadW - 24) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: dashX,
                  top: ROAD_TOP + 21,
                  width: 36,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: C.tape,
                  opacity: 0.85,
                }}
              />
            );
          })
        : null}
    </div>
  );
};

/* Satu gerbang pertanyaan dari potongan kertas dengan daun pintu ganda yang terbuka saat dipanggil */
const QuestionGate: React.FC<{gate: GateSpec; index: number}> = ({gate, index}) => {
  const f = useCurrentFrame();

  const appearAt = 12 + index * 10;
  const openP = interpolate(f, [gate.openAt, gate.openAt + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const signW = index === 2 ? 236 : 220;
  const signH = 82;
  const signTop = 258;
  const archTop = signTop + signH;
  const archBottom = ROAD_TOP + 28;
  const archH = archBottom - archTop;
  const pillarW = 22;
  const innerW = 128;
  const leftPillarX = gate.cx - innerW / 2 - pillarW;
  const rightPillarX = gate.cx + innerW / 2;

  const doorLeafW = innerW / 2 - 2;
  const doorScaleX = interpolate(openP, [0, 1], [1, 0.14], CLAMP);
  const pulseScale = interpolate(
    f,
    [gate.openAt, gate.openAt + 6, gate.openAt + 16],
    [1, 1.06, 1],
    CLAMP,
  );

  return (
    <PopIn at={appearAt}>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        {/* Tiang kiri & kanan gerbang */}
        <Paper lift={7}>
          <Slab
            x={leftPillarX}
            y={archTop}
            w={pillarW}
            h={archH}
            color={C.woodHi}
            shade={C.woodLo}
            shadeH={0.22}
            r={4}
          />
          <Slab
            x={rightPillarX}
            y={archTop}
            w={pillarW}
            h={archH}
            color={C.woodHi}
            shade={C.woodLo}
            shadeH={0.22}
            r={4}
          />
          {/* Ambang atas gerbang */}
          <Slab
            x={leftPillarX - 8}
            y={archTop - 4}
            w={innerW + pillarW * 2 + 16}
            h={14}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.35}
            r={4}
          />
        </Paper>

        {/* Daun pintu gerbang kiri & kanan yang melipat terbuka */}
        <div
          style={{
            position: 'absolute',
            left: gate.cx - innerW / 2 + 1,
            top: archTop + 12,
            width: doorLeafW,
            height: archH - 18,
            backgroundColor: openP > 0.5 ? C.sageLo : gate.accent,
            borderRight: `3px solid ${C.creamHi}`,
            borderRadius: '4px 0 0 4px',
            transformOrigin: '0% 50%',
            transform: `scaleX(${doorScaleX})`,
            boxShadow: '2px 4px 6px rgba(0,0,0,0.28)',
          }}
        >
          {/* Panel lipatan kertas pada pintu kiri */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 14,
              right: 10,
              bottom: 14,
              border: `2px solid rgba(255,255,255,0.28)`,
              borderRadius: 3,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: gate.cx + 1,
            top: archTop + 12,
            width: doorLeafW,
            height: archH - 18,
            backgroundColor: openP > 0.5 ? C.sageLo : gate.accent,
            borderLeft: `3px solid ${C.creamHi}`,
            borderRadius: '0 4px 4px 0',
            transformOrigin: '100% 50%',
            transform: `scaleX(${doorScaleX})`,
            boxShadow: '-2px 4px 6px rgba(0,0,0,0.28)',
          }}
        >
          {/* Panel lipatan kertas pada pintu kanan */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 14,
              right: 10,
              bottom: 14,
              border: `2px solid rgba(255,255,255,0.28)`,
              borderRadius: 3,
            }}
          />
        </div>

        {/* Palang kunci kuningan di tengah saat pintu masih tertutup */}
        {openP < 0.35 ? (
          <div
            style={{
              position: 'absolute',
              left: gate.cx - 24,
              top: archTop + archH * 0.48,
              width: 48,
              height: 12,
              borderRadius: 6,
              backgroundColor: C.amber,
              border: `2px solid ${C.brassLo}`,
              opacity: 1 - openP * 2.8,
            }}
          />
        ) : null}

        {/* Papan pertanyaan di puncak gerbang */}
        <Boil seed={gate.seed} amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: gate.cx - signW / 2,
              top: signTop,
              width: signW,
              height: signH,
              transform: `scale(${pulseScale})`,
              borderRadius: 10,
              backgroundColor: openP > 0.4 ? C.go : C.woodLo,
              padding: 5,
              boxSizing: 'border-box',
              filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 6,
                backgroundColor: openP > 0.4 ? '#FFFDF8' : C.creamHi,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 10px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: index === 2 ? 21 : 23,
                  lineHeight: 1.12,
                  color: C.ink,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {gate.line1}
              </div>
              <div
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: index === 2 ? 21 : 23,
                  lineHeight: 1.12,
                  color: openP > 0.4 ? C.go : gate.accent,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {gate.line2}
              </div>
            </div>
          </div>
        </Boil>

        <SparkleBurst at={gate.openAt + 2} x={gate.cx} y={signTop + 40} seed={gate.seed} spread={48} />
      </div>
    </PopIn>
  );
};

/* Tiga kotak makan kertas yang meluncur melewati setiap gerbang secara berurutan */
const LunchboxesOnRoad: React.FC = () => {
  const f = useCurrentFrame();

  // Kotak 1: melewati gerbang 1 (f=157), gerbang 2 (f=199), gerbang 3 (f=245) -> ke piring
  const box1X = interpolate(
    f,
    [0, 26, 155, 163, 195, 205, 237, 250, 298],
    [72, 206, 206, 476, 476, 746, 746, 1110, 1110],
    CLAMP,
  );
  const box1Y = interpolate(f, [286, 298], [ROAD_TOP + 10, PLATE_CY - 12], CLAMP);

  // Kotak 2: maju ke gerbang 1 saat kotak 1 lewat, lalu menyusul satu per satu
  const box2X = interpolate(
    f,
    [0, 26, 165, 195, 205, 237, 252, 308],
    [42, 134, 134, 206, 476, 476, 1138, 1138],
    CLAMP,
  );
  const box2Y = interpolate(f, [296, 308], [ROAD_TOP + 10, PLATE_CY - 18], CLAMP);

  // Kotak 3: maju terakhir melewati ketiga gerbang saat semua terbuka
  const box3X = interpolate(
    f,
    [0, 26, 205, 245, 255, 320],
    [12, 76, 76, 206, 1166, 1166],
    CLAMP,
  );
  const box3Y = interpolate(f, [308, 320], [ROAD_TOP + 10, PLATE_CY - 12], CLAMP);

  const boxes = [
    {x: box1X, y: box1Y, band: C.tag, scale: 1},
    {x: box2X, y: box2Y, band: ROOM.teal, scale: 1},
    {x: box3X, y: box3Y, band: C.amber, scale: 1},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {boxes.map((b, idx) => {
        const hop = Math.abs(Math.sin(f * 0.35 + idx)) * 2.2;
        const moving =
          (idx === 0 && f > 163 && f < 298) ||
          (idx === 1 && f > 165 && f < 308) ||
          (idx === 2 && f > 205 && f < 320);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: b.x - 24,
              top: b.y - (moving ? hop : 0),
              width: 48,
              height: 30,
              filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.3))',
            }}
          >
            {/* Badan kotak makan kertas */}
            <div
              style={{
                position: 'absolute',
                left: 2,
                top: 8,
                width: 44,
                height: 22,
                borderRadius: 5,
                backgroundColor: C.creamHi,
                borderBottom: `4px solid ${C.creamLo}`,
                boxSizing: 'border-box',
              }}
            />
            {/* Tutup kotak makan */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 3,
                width: 48,
                height: 9,
                borderRadius: 4,
                backgroundColor: '#FFFDF8',
                borderBottom: `2px solid ${C.creamLo}`,
              }}
            />
            {/* Sabuk pengikat kotak makan */}
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 3,
                width: 10,
                height: 27,
                backgroundColor: b.band,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* Piring makan di ujung jalan + pita hadiah "Gratis" kembali rapi saat ketiganya terbuka */
const EndPlateAndRibbon: React.FC = () => {
  const f = useCurrentFrame();

  // Scene 117 (f=301..412): piring menyala hangat & pita hadiah mulus kembali
  // Scene 118 (f=428+): cahaya hangat meredup saat beralih ke "Kalau tidak..."
  const warmGlow = interpolate(f, [301, 326, 424, 444], [0, 1, 1, 0.18], CLAMP);
  const ribbonPop = interpolate(f, [308, 326], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const ribbonDim = interpolate(f, [424, 444], [1, 0.35], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Aura cahaya hangat di sekitar piring ujung */}
      {warmGlow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: PLATE_CX - 135,
            top: PLATE_CY - 125,
            width: 270,
            height: 235,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,224,130,0.72) 0%, rgba(255,204,102,0.28) 52%, rgba(255,204,102,0) 75%)',
            opacity: warmGlow,
          }}
        />
      ) : null}

      {/* Piring makan kertas berlapis di ujung kanan jalan */}
      <div
        style={{
          position: 'absolute',
          left: PLATE_CX - 76,
          top: PLATE_CY - 22,
          width: 152,
          height: 54,
          filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
        }}
      >
        {/* Bibir piring luar */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: warmGlow > 0.4 ? '#FFFDF8' : C.creamHi,
            border: `4px solid ${warmGlow > 0.4 ? C.amber : C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />
        {/* Cekungan piring dalam */}
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 9,
            width: 116,
            height: 36,
            borderRadius: '50%',
            backgroundColor: C.cream,
            border: `2px solid ${C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Pita hadiah bertuliskan "Gratis" kembali mulus & simetris di atas piring */}
      {ribbonPop > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: PLATE_CX - 92,
            top: 342,
            width: 184,
            height: 112,
            opacity: ribbonPop * ribbonDim,
            transformOrigin: '50% 50%',
            transform: `scale(${ribbonPop})`,
            filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.36))',
          }}
        >
          {/* Ujung pita rapi kiri & kanan */}
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 42,
              width: 20,
              height: 52,
              backgroundColor: C.heroLo,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)',
              transformOrigin: '50% 0%',
              transform: 'rotate(22deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 48,
              top: 42,
              width: 20,
              height: 52,
              backgroundColor: C.heroLo,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)',
              transformOrigin: '50% 0%',
              transform: 'rotate(-22deg)',
            }}
          />
          {/* Kupu-kupu pita mulus kiri & kanan */}
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 8,
              width: 66,
              height: 36,
              borderRadius: '36px 8px 36px 12px',
              backgroundColor: C.tag,
              border: `2.5px solid ${C.heroLo}`,
              transform: 'rotate(-12deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 22,
              top: 8,
              width: 66,
              height: 36,
              borderRadius: '8px 36px 12px 36px',
              backgroundColor: C.tag,
              border: `2.5px solid ${C.heroLo}`,
              transform: 'rotate(12deg)',
            }}
          />
          {/* Simpul tengah rapi */}
          <div
            style={{
              position: 'absolute',
              left: 78,
              top: 14,
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: C.tag,
              border: `2.5px solid ${C.heroLo}`,
            }}
          />
          {/* Label bertuliskan "Gratis" */}
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 48,
              width: 100,
              padding: '5px 8px 6px',
              backgroundColor: C.tag,
              color: C.tagText,
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 22,
              textAlign: 'center',
              lineHeight: 1,
              filter: 'url(#torn)',
            }}
          >
            Gratis
          </div>
        </div>
      ) : null}

      <SparkleBurst at={306} x={PLATE_CX} y={PLATE_CY - 30} seed="m13-plate" spread={66} />
    </div>
  );
};

/* Scene 118 (f=428..536): Kantong kecil "dompet" dan kotak "masalah" bertukar tempat */
const WalletProblemSwap: React.FC = () => {
  const f = useCurrentFrame();

  const enterP = interpolate(f, [428, 444], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });

  if (enterP <= 0.01) return null;

  const swapP = interpolate(f, [448, 504], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const leftStart = 455;
  const rightStart = 825;
  const baseY = 632;

  // Kantong "dompet" melengkung lewat atas dari kiri ke kanan
  const walletX = interpolate(swapP, [0, 1], [leftStart, rightStart], CLAMP);
  const walletY = baseY - Math.sin(swapP * Math.PI) * 34;

  // Kotak "masalah" melengkung lewat bawah dari kanan ke kiri
  const problemX = interpolate(swapP, [0, 1], [rightStart, leftStart], CLAMP);
  const problemY = baseY + Math.sin(swapP * Math.PI) * 28;

  const arrowOp = interpolate(swapP, [0.1, 0.35, 0.85, 1], [0, 0.9, 0.9, 0.7], CLAMP);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Panah lengkung kertas penunjuk pertukaran posisi di tengah */}
      <svg
        width={420}
        height={110}
        viewBox="0 0 420 110"
        style={{
          position: 'absolute',
          left: 430,
          top: 578,
          opacity: arrowOp,
        }}
      >
        <path
          d="M 85 28 Q 210 2 335 28"
          fill="none"
          stroke={C.creamHi}
          strokeWidth={4}
          strokeDasharray="10 8"
          strokeLinecap="round"
        />
        <polygon points="335,28 320,19 322,35" fill={C.creamHi} />
        <path
          d="M 335 82 Q 210 108 85 82"
          fill="none"
          stroke={C.tag}
          strokeWidth={4}
          strokeDasharray="10 8"
          strokeLinecap="round"
        />
        <polygon points="85,82 100,75 98,91" fill={C.tag} />
      </svg>

      {/* Kantong kecil bertuliskan "dompet" */}
      <div
        style={{
          position: 'absolute',
          left: walletX - 92,
          top: walletY - 38,
          width: 184,
          height: 76,
          opacity: enterP,
          transform: `scale(${enterP})`,
          filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.4))',
        }}
      >
        {/* Jepit kuningan atas kantong */}
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 0,
            width: 72,
            height: 14,
            borderRadius: 8,
            backgroundColor: C.brass,
            border: `2px solid ${C.brassLo}`,
            boxSizing: 'border-box',
          }}
        />
        {/* Badan kantong kertas */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 10,
            width: 156,
            height: 62,
            borderRadius: '26px 26px 18px 18px',
            backgroundColor: C.woodHi,
            border: `3px solid ${C.woodLo}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: C.creamHi,
              padding: '5px 18px 6px',
              borderRadius: 5,
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 25,
              color: C.ink,
              lineHeight: 1,
            }}
          >
            dompet
          </div>
        </div>
      </div>

      {/* Kotak bertuliskan "masalah" */}
      <div
        style={{
          position: 'absolute',
          left: problemX - 94,
          top: problemY - 38,
          width: 188,
          height: 76,
          opacity: enterP,
          transform: `scale(${enterP})`,
          filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.4))',
        }}
      >
        {/* Tutup kotak kertas */}
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 4,
            width: 172,
            height: 15,
            borderRadius: 4,
            backgroundColor: C.heroLo,
          }}
        />
        {/* Badan kotak masalah */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 16,
            width: 160,
            height: 56,
            borderRadius: 6,
            backgroundColor: C.tag,
            borderBottom: `5px solid ${C.heroLo}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: C.creamHi,
              padding: '5px 16px 6px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 25,
              color: C.tag,
              lineHeight: 1,
              filter: 'url(#torn)',
            }}
          >
            masalah
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const M13: React.FC = () => {
  return (
    <Stage dur={M13_DUR} banner="TIGA PERTANYAAN" bannerSize={46}>
      <OrbitCamera
        dur={M13_DUR}
        yaw={14}
        push={1.06}
        focus={0.5}
        depth={620}
        origin={[640, 450]}
      >
        <Depth z={0.18}>
          <BackDecor />
        </Depth>

        <Depth z={0.5}>
          <PaperRoad />
          {GATES.map((gate, idx) => (
            <QuestionGate key={idx} gate={gate} index={idx} />
          ))}
          <LunchboxesOnRoad />
          <EndPlateAndRibbon />
        </Depth>

        <Depth z={0.78}>
          <WalletProblemSwap />
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};