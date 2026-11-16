// Adegan M16 (Scene 141-144, 515,89-533,10 dtk): Kata "gratis" dengan titik kertas memanjang menjadi
// jalan berliku penuh tanda tanya yang bercabang dua: jembatan patah vs jembatan ditopang deretan tangan menuju piring akhir.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, PopIn, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Plant, Window} from '../../lib/paper/sets';

export const M16_DUR = 516;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const DOT_X = 286;
const DOT_Y = 398;
const FORK_X = 604;
const FORK_Y = 398;

const UPPER_Y = 256;
const LOWER_Y = 496;
const BRIDGE_LEFT_X = 735;
const BRIDGE_RIGHT_X = 955;
const BRIDGE_MID_X = (BRIDGE_LEFT_X + BRIDGE_RIGHT_X) / 2;
const PLATE_CX = 1134;
const PLATE_CY = 496;

type QuestionPin = {
  x: number;
  y: number;
  at: number;
  rot: number;
  color: string;
  seed: string;
};

const QUESTION_PINS: readonly QuestionPin[] = [
  {x: 344, y: 368, at: 128, rot: -8, color: ROOM.navy, seed: 'm16-q1'},
  {x: 412, y: 424, at: 142, rot: 7, color: C.tag, seed: 'm16-q2'},
  {x: 482, y: 362, at: 156, rot: -5, color: ROOM.teal, seed: 'm16-q3'},
  {x: 548, y: 422, at: 170, rot: 8, color: C.amber, seed: 'm16-q4'},
];

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.36}}>
      <Window x={34} y={206} w={122} h={184} night={false} />
    </div>
    <div style={{opacity: 0.4}}>
      <Plant x={1152} y={376} s={0.64} />
    </div>
  </AbsoluteFill>
);

/* Kartu kata "gratis" di sisi kiri dengan titik kertas yang ditarik memanjang menjadi jalan */
const GratisWordAndDot: React.FC = () => {
  const f = useCurrentFrame();

  const cardIn = interpolate(f, [0, 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const dotIn = interpolate(f, [22, 36], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });

  // Titik kertas berdenyut saat narator menyebut akhir kalimat lalu ditarik memanjang (f=98..126)
  const dotStretchP = interpolate(f, [98, 128], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const dotPulse = interpolate(f, [78, 92, 102], [1, 1.24, 1], CLAMP);
  const dotW = interpolate(dotStretchP, [0, 1], [24, 52], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: cardIn,
        transform: `translateX(${(1 - cardIn) * -36}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Kartu kertas bertuliskan "gratis" */}
      <Boil seed="m16-gratis" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 68,
            top: 356,
            width: 196,
            height: 76,
            borderRadius: 10,
            backgroundColor: C.woodLo,
            padding: 5,
            boxSizing: 'border-box',
            filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              backgroundColor: C.creamHi,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 40,
              color: C.ink,
              lineHeight: 1,
            }}
          >
            gratis
          </div>
        </div>
      </Boil>

      {/* Titik kertas di ujung kata "gratis" yang menjadi pangkal jalan */}
      {dotIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: DOT_X - 12,
            top: DOT_Y - 12,
            width: dotW,
            height: 24,
            borderRadius: 12,
            backgroundColor: C.tag,
            border: `3px solid ${C.creamHi}`,
            boxSizing: 'border-box',
            transform: `scale(${dotIn * dotPulse})`,
            boxShadow: '1px 3px 6px rgba(0,0,0,0.3)',
          }}
        />
      ) : null}
    </div>
  );
};

/* Jalan berliku dari titik "gratis" hingga percabangan tengah, beserta deretan tanda tanya kertas */
const WindingQuestionRoad: React.FC = () => {
  const f = useCurrentFrame();

  // Jalan memanjang dari titik (f=108..184)
  const windReveal = interpolate(f, [108, 184], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Dua cabang jalan terbuka dari titik tengah FORK_X (f=178..224)
  const branchReveal = interpolate(f, [178, 224], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const windClipW = 340 * windReveal;
  const branchClipW = 540 * branchReveal;

  const windingD = `M ${DOT_X} ${DOT_Y} C 350 342, 412 454, 476 396 C 524 352, 566 426, ${FORK_X} ${FORK_Y}`;
  const upperApproachD = `M ${FORK_X} ${FORK_Y} C 646 398, 678 ${UPPER_Y}, ${BRIDGE_LEFT_X + 6} ${UPPER_Y}`;
  const upperEndD = `M ${BRIDGE_RIGHT_X - 6} ${UPPER_Y} L 1068 ${UPPER_Y}`;
  const lowerApproachD = `M ${FORK_X} ${FORK_Y} C 646 398, 678 ${LOWER_Y}, ${BRIDGE_LEFT_X + 6} ${LOWER_Y}`;
  const lowerEndD = `M ${BRIDGE_RIGHT_X - 6} ${LOWER_Y} L ${PLATE_CX - 62} ${LOWER_Y}`;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Bagian 1: Jalan berliku utama */}
      {windReveal > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: DOT_X - 10,
            top: 310,
            width: windClipW,
            height: 180,
            overflow: 'hidden',
          }}
        >
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{
              position: 'absolute',
              left: -(DOT_X - 10),
              top: -310,
              filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
            }}
          >
            {/* Lapisan tepi bawah jalan */}
            <path
              d={windingD}
              fill="none"
              stroke={C.woodLo}
              strokeWidth={38}
              strokeLinecap="round"
            />
            {/* Permukaan jalan kertas krem */}
            <path
              d={windingD}
              fill="none"
              stroke={C.creamHi}
              strokeWidth={30}
              strokeLinecap="round"
            />
            {/* Garis tengah jalan putus-putus */}
            <path
              d={windingD}
              fill="none"
              stroke={C.tape}
              strokeWidth={4}
              strokeDasharray="10 9"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : null}

      {/* Bagian 2: Cabang atas (menuju jembatan pertama) & Cabang bawah (menuju jembatan kedua & piring akhir) */}
      {branchReveal > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: FORK_X - 14,
            top: 210,
            width: branchClipW,
            height: 340,
            overflow: 'hidden',
          }}
        >
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{
              position: 'absolute',
              left: -(FORK_X - 14),
              top: -210,
              filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.28))',
            }}
          >
            {/* Cabang 1 (atas): segmen sebelum dan sesudah bentang jembatan */}
            <path
              d={upperApproachD}
              fill="none"
              stroke={C.woodLo}
              strokeWidth={34}
              strokeLinecap="round"
            />
            <path
              d={upperApproachD}
              fill="none"
              stroke={C.cream}
              strokeWidth={26}
              strokeLinecap="round"
            />
            <path
              d={upperEndD}
              fill="none"
              stroke={C.woodLo}
              strokeWidth={34}
              strokeLinecap="round"
            />
            <path
              d={upperEndD}
              fill="none"
              stroke={C.cream}
              strokeWidth={26}
              strokeLinecap="round"
            />

            {/* Cabang 2 (bawah): segmen sebelum dan sesudah bentang jembatan menuju piring akhir */}
            <path
              d={lowerApproachD}
              fill="none"
              stroke={C.woodLo}
              strokeWidth={36}
              strokeLinecap="round"
            />
            <path
              d={lowerApproachD}
              fill="none"
              stroke={C.creamHi}
              strokeWidth={28}
              strokeLinecap="round"
            />
            <path
              d={lowerEndD}
              fill="none"
              stroke={C.woodLo}
              strokeWidth={36}
              strokeLinecap="round"
            />
            <path
              d={lowerEndD}
              fill="none"
              stroke={C.creamHi}
              strokeWidth={28}
              strokeLinecap="round"
            />

            {/* Simpul percabangan di tengah jalan */}
            <circle cx={FORK_X} cy={FORK_Y} r={19} fill={C.woodLo} />
            <circle cx={FORK_X} cy={FORK_Y} r={13} fill={C.amber} />
          </svg>
        </div>
      ) : null}

      {/* Deretan tanda tanya kertas berjajar di sepanjang jalan berliku */}
      {QUESTION_PINS.map((pin, idx) => (
        <PopIn key={idx} at={pin.at}>
          <Boil seed={pin.seed} amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: pin.x - 19,
                top: pin.y - 54,
                width: 38,
                height: 54,
                rotate: `${pin.rot}deg`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                filter: 'drop-shadow(1px 4px 5px rgba(0,0,0,0.32))',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 40,
                  borderRadius: 9,
                  backgroundColor: pin.color,
                  border: `2.5px solid ${C.creamHi}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 27,
                  color: '#FFFDF8',
                  lineHeight: 1,
                }}
              >
                ?
              </div>
              <div
                style={{
                  width: 5,
                  height: 14,
                  backgroundColor: C.woodLo,
                  borderRadius: '0 0 3px 3px',
                }}
              />
            </div>
          </Boil>
        </PopIn>
      ))}
    </div>
  );
};

/* Cabang Pertama (atas): jembatan kertas memudar dan patah di tengah, kotak makan pertama jatuh */
const BranchOneCollapsingBridge: React.FC = () => {
  const f = useCurrentFrame();

  const appearP = interpolate(f, [202, 222], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 143 (f=234..354): jembatan memudar (f=258..294) lalu patah di tengah (f=280..312)
  const fadeBridge = interpolate(f, [258, 294], [1, 0.36], CLAMP);
  const snapP = interpolate(f, [280, 312], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });

  const halfW = (BRIDGE_RIGHT_X - BRIDGE_LEFT_X) / 2;
  const leftDropDeg = snapP * 32;
  const rightDropDeg = -snapP * 32;

  // Kotak makan pertama meluncur dari jalan berliku ke cabang atas lalu jatuh di tengah jembatan patah
  const boxEnter = interpolate(f, [224, 236], [0, 1], CLAMP);
  const travelP = interpolate(f, [234, 286], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const fallP = interpolate(f, [286, 336], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });

  // Jalur kotak makan 1: dari FORK_X (604, 398) naik ke UPPER_Y (256) lalu ke tengah jembatan (845, 256)
  const boxX =
    travelP < 0.42
      ? interpolate(travelP, [0, 0.42], [FORK_X - 24, BRIDGE_LEFT_X + 6], CLAMP)
      : interpolate(travelP, [0.42, 1], [BRIDGE_LEFT_X + 6, BRIDGE_MID_X - 4], CLAMP) +
        fallP * 14;

  const baseTrackY =
    travelP < 0.42
      ? interpolate(travelP, [0, 0.42], [FORK_Y, UPPER_Y], CLAMP)
      : UPPER_Y;

  const boxY = baseTrackY - 16 + fallP * 165;
  const boxRot = fallP * 44;
  // Memudar saat jatuh masuk ke celah jurang di antara dua cabang sehingga tidak menabrak cabang bawah
  const boxOpacity =
    boxEnter * interpolate(fallP, [0, 0.62, 1], [1, 0.85, 0], CLAMP);

  if (appearP <= 0.01) return null;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Tiang penyangga ujung kiri & kanan jembatan atas */}
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_LEFT_X - 6,
          top: UPPER_Y - 16,
          width: 14,
          height: 32,
          borderRadius: 4,
          backgroundColor: C.woodLo,
          opacity: appearP * fadeBridge,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_RIGHT_X - 8,
          top: UPPER_Y - 16,
          width: 14,
          height: 32,
          borderRadius: 4,
          backgroundColor: C.woodLo,
          opacity: appearP * fadeBridge,
        }}
      />

      {/* Paruh kiri jembatan kertas (patah di tengah dan terkulai turun) */}
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_LEFT_X,
          top: UPPER_Y - 13,
          width: halfW,
          height: 26,
          opacity: appearP * fadeBridge,
          transformOrigin: '0% 50%',
          transform: `rotate(${leftDropDeg}deg)`,
          filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.26))',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: snapP > 0.1 ? C.creamLo : C.cream,
            borderBottom: `5px solid ${C.woodLo}`,
            borderRadius: '4px 0 0 4px',
            clipPath:
              snapP > 0.05
                ? 'polygon(0% 0%, 100% 0%, 91% 36%, 99% 68%, 90% 100%, 0% 100%)'
                : undefined,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Paruh kanan jembatan kertas (patah di tengah dan terkulai turun) */}
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_MID_X,
          top: UPPER_Y - 13,
          width: halfW,
          height: 26,
          opacity: appearP * fadeBridge,
          transformOrigin: '100% 50%',
          transform: `rotate(${rightDropDeg}deg)`,
          filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.26))',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: snapP > 0.1 ? C.creamLo : C.cream,
            borderBottom: `5px solid ${C.woodLo}`,
            borderRadius: '0 4px 4px 0',
            clipPath:
              snapP > 0.05
                ? 'polygon(9% 0%, 100% 0%, 100% 100%, 8% 100%, 1% 66%, 10% 34%)'
                : undefined,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Kotak makan pertama yang jatuh ketika jembatan patah */}
      {boxOpacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: boxX - 24,
            top: boxY - 16,
            width: 48,
            height: 32,
            opacity: boxOpacity,
            transform: `rotate(${boxRot}deg)`,
            filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.32))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 2,
              top: 8,
              width: 44,
              height: 24,
              borderRadius: 5,
              backgroundColor: C.cream,
              borderBottom: `4px solid ${C.creamLo}`,
              boxSizing: 'border-box',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 3,
              width: 48,
              height: 9,
              borderRadius: 4,
              backgroundColor: C.creamHi,
              borderBottom: `2px solid ${C.creamLo}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 19,
              top: 3,
              width: 10,
              height: 29,
              backgroundColor: C.tag,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

/* Cabang Kedua (bawah): jembatan yang sama ditopang deretan tangan kertas tanpa wajah dari sisi ke sisi sampai kotak makan tiba di piring terakhir */
const BranchTwoSupportedBridge: React.FC = () => {
  const f = useCurrentFrame();

  const appearP = interpolate(f, [206, 226], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 144 (f=355..516): deretan 4 tangan kertas tanpa wajah naik dari sisi ke sisi menopang jembatan kedua
  const handXs = [756, 816, 876, 936];
  const handColors = [ROOM.navy, ROOM.teal, ROOM.slate, ROOM.navy];

  // Kotak makan kedua meluncur aman melewati jembatan yang ditopang tangan menuju piring terakhir
  const boxEnter = interpolate(f, [368, 380], [0, 1], CLAMP);
  const glideP = interpolate(f, [380, 474], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const boxX =
    glideP < 0.28
      ? interpolate(glideP, [0, 0.28], [FORK_X - 24, BRIDGE_LEFT_X + 6], CLAMP)
      : interpolate(glideP, [0.28, 1], [BRIDGE_LEFT_X + 6, PLATE_CX], CLAMP);

  const boxBaseY =
    glideP < 0.28
      ? interpolate(glideP, [0, 0.28], [FORK_Y, LOWER_Y], CLAMP)
      : LOWER_Y;

  // Piring terakhir menyala hangat saat kotak makan tiba di ujung (f=468..516)
  const plateLit = interpolate(f, [466, 488], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  if (appearP <= 0.01) return null;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Aura hangat lembut di sekitar piring terakhir */}
      {plateLit > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: PLATE_CX - 118,
            top: PLATE_CY - 102,
            width: 236,
            height: 192,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,224,132,0.74) 0%, rgba(255,204,102,0.28) 54%, rgba(255,204,102,0) 76%)',
            opacity: plateLit,
          }}
        />
      ) : null}

      {/* Piring terakhir dari kertas berlapis di ujung kanan cabang kedua */}
      <div
        style={{
          position: 'absolute',
          left: PLATE_CX - 66,
          top: PLATE_CY - 18,
          width: 132,
          height: 46,
          opacity: appearP,
          filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: plateLit > 0.4 ? '#FFFDF8' : C.creamHi,
            border: `4px solid ${plateLit > 0.4 ? C.amber : C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 8,
            width: 100,
            height: 30,
            borderRadius: '50%',
            backgroundColor: C.cream,
            border: `2px solid ${C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Deretan tangan kertas tanpa wajah menopang jembatan dari sisi ke sisi */}
      {handXs.map((hx, idx) => {
        const startAt = 354 + idx * 7;
        const riseP = interpolate(f, [startAt, startAt + 20], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.cubic),
        });
        if (riseP <= 0.01) return null;

        const breath = f > startAt + 20 ? Math.sin((f - startAt) * 0.12 + idx) * 1.1 : 0;
        const topY = LOWER_Y + 12 + (1 - riseP) * 115 + breath;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: hx - 26,
              top: topY,
              width: 52,
              height: FLOOR_Y - (LOWER_Y + 10),
              opacity: riseP,
              filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.32))',
            }}
          >
            {/* Telapak tangan kertas terbuka menopang bagian bawah jembatan */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 2,
                width: 44,
                height: 22,
                borderRadius: '10px 10px 14px 14px',
                backgroundColor: C.creamHi,
                border: `2px solid ${C.inkSoft}`,
                boxSizing: 'border-box',
              }}
            />
            {/* Jari-jari penyangga */}
            {[6, 17, 28, 38].map((fx, fi) => (
              <div
                key={fi}
                style={{
                  position: 'absolute',
                  left: fx,
                  top: -3,
                  width: 8,
                  height: 11,
                  borderRadius: 4,
                  backgroundColor: C.creamHi,
                  border: `1.5px solid ${C.inkSoft}`,
                  boxSizing: 'border-box',
                }}
              />
            ))}
            {/* Manset krem */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 22,
                width: 32,
                height: 10,
                borderRadius: 3,
                backgroundColor: C.cream,
                border: `1.5px solid ${C.creamLo}`,
                boxSizing: 'border-box',
              }}
            />
            {/* Lengan baju tanpa wajah berdiri tegak dari lantai */}
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: 30,
                width: 28,
                height: FLOOR_Y - (LOWER_Y + 38),
                borderRadius: '4px 4px 0 0',
                backgroundColor: handColors[idx],
                borderRight: '4px solid rgba(0,0,0,0.2)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        );
      })}

      {/* Bentang jembatan kedua (identik ukurannya, utuh & kokoh ditopang deretan tangan) */}
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_LEFT_X,
          top: LOWER_Y - 14,
          width: BRIDGE_RIGHT_X - BRIDGE_LEFT_X,
          height: 28,
          opacity: appearP,
          borderRadius: 5,
          backgroundColor: C.creamHi,
          borderBottom: `6px solid ${C.woodLo}`,
          boxSizing: 'border-box',
          boxShadow: '2px 5px 8px rgba(0,0,0,0.3)',
        }}
      />
      {/* Tiang ujung kiri & kanan jembatan kedua */}
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_LEFT_X - 6,
          top: LOWER_Y - 17,
          width: 14,
          height: 34,
          borderRadius: 4,
          backgroundColor: C.woodLo,
          opacity: appearP,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BRIDGE_RIGHT_X - 8,
          top: LOWER_Y - 17,
          width: 14,
          height: 34,
          borderRadius: 4,
          backgroundColor: C.woodLo,
          opacity: appearP,
        }}
      />

      {/* Kotak makan kedua dengan pita merah rapi meluncur utuh sampai ke piring terakhir */}
      {boxEnter > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: boxX - 26,
            top: boxBaseY - 34,
            width: 52,
            height: 36,
            opacity: boxEnter,
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.34))',
          }}
        >
          {/* Badan kotak makan */}
          <div
            style={{
              position: 'absolute',
              left: 2,
              top: 10,
              width: 48,
              height: 26,
              borderRadius: 5,
              backgroundColor: C.amber,
              borderBottom: `4px solid ${C.brassLo}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Tutup kotak makan */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 5,
              width: 52,
              height: 9,
              borderRadius: 4,
              backgroundColor: '#F8BE5C',
              borderBottom: `2px solid ${C.brassLo}`,
            }}
          />
          {/* Pita merah rapi & simpul kecil di atas */}
          <div
            style={{
              position: 'absolute',
              left: 21,
              top: 5,
              width: 10,
              height: 31,
              backgroundColor: C.tag,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 0,
              width: 11,
              height: 7,
              borderRadius: '7px 2px 7px 3px',
              backgroundColor: C.tag,
              transform: 'rotate(-14deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 27,
              top: 0,
              width: 11,
              height: 7,
              borderRadius: '2px 7px 3px 7px',
              backgroundColor: C.tag,
              transform: 'rotate(14deg)',
            }}
          />
        </div>
      ) : null}

      <SparkleBurst at={474} x={PLATE_CX} y={PLATE_CY - 22} seed="m16-final-plate" spread={64} />
    </div>
  );
};

export const M16: React.FC = () => {
  return (
    <Stage dur={M16_DUR} banner="GRATIS ADALAH AWAL" bannerSize={44}>
      <OrbitCamera
        dur={M16_DUR}
        yaw={14}
        push={1.06}
        focus={0.5}
        depth={620}
        origin={[640, 430]}
      >
        <Depth z={0.18}>
          <BackDecor />
        </Depth>

        <Depth z={0.5}>
          <WindingQuestionRoad />
          <GratisWordAndDot />
          <BranchOneCollapsingBridge />
          <BranchTwoSupportedBridge />
        </Depth>

        <Depth z={0.78}>
          <PopIn at={8}>
            <Boil seed="m16-fg" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 42,
                  top: FLOOR_Y + 26,
                  width: 82,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: C.woodHi,
                  rotate: '-3deg',
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 1156,
                  top: FLOOR_Y + 28,
                  width: 82,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: C.woodHi,
                  rotate: '3deg',
                  opacity: 0.7,
                }}
              />
            </Boil>
          </PopIn>
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};