// Adegan D10: Kurs Adalah Harga Uang (scene 116-122, 460 frame @ 30fps).
// Teater kertas warung kopi: televisi bergeser membuka tiang ukur tinggi badan dengan dua penggaris.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D10_DUR = 460;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR_Y = 610;
const HEAD_TOP_Y = 325;

// Jangkar warung: meja sudut, gelas kopi kertas bertuap, dan televisi kertas berlayar polos.
const WarungCorner: React.FC<{frame: number; tvGlow: number}> = ({frame, tvGlow}) => {
  const tickerOffset = (frame * 1.1) % 72;
  const steamShift = (frame * 0.45) % 36;

  return (
    <div style={{position: 'absolute', left: 124, top: 350, width: 176, height: 260}}>
      {/* Pendar cahaya biru lembut dari layar TV */}
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 12,
          width: 190,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,178,224,0.42) 0%, rgba(130,178,224,0) 72%)',
          opacity: tvGlow,
          pointerEvents: 'none',
        }}
      />

      {/* Meja kayu kecil sudut warung */}
      <Paper lift={5}>
        <Slab x={0} y={130} w={172} h={16} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
        <Slab x={16} y={146} w={16} h={114} color={C.woodLo} r={3} />
        <Slab x={140} y={146} w={16} h={114} color={C.woodLo} r={3} />
        <Slab x={24} y={176} w={124} h={10} color={C.wood} r={2} />
      </Paper>

      {/* Uap tipis gelas kopi kertas */}
      <svg
        width={64}
        height={64}
        viewBox="0 0 64 64"
        style={{position: 'absolute', left: 10, top: 28, overflow: 'visible'}}
      >
        {[0, 1, 2].map((i) => {
          const phase = (steamShift + i * 12) % 36;
          const op = interpolate(phase, [0, 10, 26, 36], [0, 0.55, 0.45, 0], CLAMP);
          const dy = -phase * 0.65;
          const dx = Math.sin((frame + i * 18) * 0.06) * 2.2;
          return (
            <path
              key={i}
              d={`M ${20 + i * 11} 54 Q ${16 + i * 11 + dx} ${40 + dy} ${22 + i * 11} ${26 + dy}`}
              fill="none"
              stroke={C.creamHi}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={op}
            />
          );
        })}
      </svg>

      {/* Gelas kopi kertas */}
      <Paper lift={4}>
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 86,
            width: 34,
            height: 44,
            background: C.creamHi,
            clipPath: 'polygon(6% 0%, 94% 0%, 84% 100%, 16% 100%)',
            borderTop: `4px solid ${C.creamLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 101,
            width: 30,
            height: 15,
            background: '#B68856',
            clipPath: 'polygon(3% 0%, 97% 0%, 93% 100%, 7% 100%)',
          }}
        />
      </Paper>

      {/* Televisi kertas berlayar polos bercahaya */}
      <Paper lift={6}>
        {/* Antena kertas V */}
        <div
          style={{
            position: 'absolute',
            left: 104,
            top: 24,
            width: 3,
            height: 28,
            background: C.inkSoft,
            transformOrigin: 'bottom center',
            rotate: '-28deg',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 112,
            top: 24,
            width: 3,
            height: 28,
            background: C.inkSoft,
            transformOrigin: 'bottom center',
            rotate: '28deg',
          }}
        />
        {/* Bodi TV */}
        <Slab x={64} y={48} w={98} h={74} color={C.wood} shade={C.woodLo} shadeH={0.18} r={8} />
        {/* Layar polos bercahaya */}
        <Slab x={72} y={56} w={68} h={56} color="#648DB8" hi="#94BCE3" hiH={0.35} r={5}>
          {/* Pita ticker kosong bergerak tenang di bawah layar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 6,
              height: 10,
              background: 'rgba(232, 223, 211, 0.34)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: -tickerOffset,
                width: 160,
                height: 4,
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0px, rgba(255,255,255,0.75) 22px, transparent 22px, transparent 36px)',
              }}
            />
          </div>
        </Slab>
        {/* Tombol putar polos tanpa angka */}
        <div
          style={{
            position: 'absolute',
            left: 146,
            top: 64,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: C.brass,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 146,
            top: 82,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: C.creamLo,
          }}
        />
        <Slab x={78} y={122} w={14} h={8} color={C.inkSoft} r={2} />
        <Slab x={134} y={122} w={14} h={8} color={C.inkSoft} r={2} />
      </Paper>
    </div>
  );
};

// Tiang pengukur tinggi badan berkayu dengan garis-garis tanpa angka.
const MeasuringPost: React.FC = () => {
  const tickCount = 28;
  return (
    <div style={{position: 'absolute', left: 640, top: 148, translate: '-50% 0', width: 128, height: FLOOR_Y - 148}}>
      <Paper lift={5}>
        {/* Tiang vertikal utama */}
        <Slab x={41} y={0} w={46} h={FLOOR_Y - 166} color={C.wood} shade={C.woodLo} shadeH={0.12} hi={C.woodHi} hiH={0.08} r={5} />
        {/* Kepala tiang */}
        <Slab x={33} y={-8} w={62} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
        {/* Garis-garis ukur tanpa angka */}
        {Array.from({length: tickCount}).map((_, i) => {
          const y = 20 + i * 15;
          const isMajor = i % 4 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 45,
                top: y,
                width: isMajor ? 22 : 12,
                height: isMajor ? 3 : 2,
                background: C.creamHi,
                opacity: isMajor ? 0.85 : 0.55,
                borderRadius: 1,
              }}
            />
          );
        })}
        {/* Alas tiang */}
        <Slab x={12} y={FLOOR_Y - 170} w={104} h={22} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={5} />
      </Paper>
    </div>
  );
};

// Koin kuning madu polos + dua pelat gantung konseptual (scene 118).
const CoinAndPlates: React.FC<{frame: number}> = ({frame}) => {
  // Masuk bertahap pada scene 118 (rel 109-198), keluar rapi sebelum scene 119 (rel 218).
  const coinIn = interpolate(frame, [109, 125], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const plate1In = interpolate(frame, [112, 128], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const plate2In = interpolate(frame, [148, 164], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const exitOut = interpolate(frame, [196, 213], [0, 1], {...CLAMP, easing: Easing.in(Easing.cubic)});

  if (frame < 108 || frame > 214) return null;

  const coinY = interpolate(coinIn, [0, 1], [-180, 218]) - exitOut * 340;
  const p1Y = interpolate(plate1In, [0, 1], [-180, 218]) - exitOut * 340;
  const p2Y = interpolate(plate2In, [0, 1], [-180, 218]) - exitOut * 340;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Tali penghubung halus antara pelat dan koin */}
      <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
        {plate1In > 0.05 && (
          <line
            x1={548}
            y1={p1Y}
            x2={588}
            y2={coinY}
            stroke={C.brassLo}
            strokeWidth={3}
            strokeDasharray="6 4"
            opacity={1 - exitOut}
          />
        )}
        {plate2In > 0.05 && (
          <line
            x1={692}
            y1={coinY}
            x2={724}
            y2={p2Y}
            stroke={C.brassLo}
            strokeWidth={3}
            strokeDasharray="6 4"
            opacity={1 - exitOut}
          />
        )}
      </svg>

      {/* Pelat 1 (kiri): KURS = HARGA UANG */}
      <div
        style={{
          position: 'absolute',
          left: 392,
          top: p1Y,
          width: 370,
          height: 64,
          translate: '-50% -50%',
          opacity: plate1In * (1 - exitOut),
        }}
      >
        <Boil seed="plate1" amp={0.4} rot={0.05}>
          {/* Tali gantung dari atas */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -280,
              width: 3,
              height: 280,
              translate: '-50% 0',
              background: C.inkSoft,
              opacity: 0.55,
            }}
          />
          <div
            style={{
              backgroundColor: C.creamHi,
              border: `4px solid ${C.wood}`,
              borderRadius: 10,
              padding: '14px 22px',
              fontFamily: FONT.banner,
              fontSize: 23,
              color: C.ink,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
            }}
          >
            KURS = HARGA UANG
          </div>
        </Boil>
      </div>

      {/* Koin kuning madu polos di tengah */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: coinY,
          width: 106,
          height: 106,
          translate: '-50% -50%',
          opacity: coinIn * (1 - exitOut),
        }}
      >
        <Boil seed="coin" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -280,
              width: 3,
              height: 280,
              translate: '-50% 0',
              background: C.inkSoft,
              opacity: 0.55,
            }}
          />
          <div
            style={{
              width: 106,
              height: 106,
              borderRadius: '50%',
              background: C.sparkYellow,
              border: `8px solid ${C.brass}`,
              boxShadow: `inset 0 4px 0 rgba(255,255,255,0.45), 0 8px 16px rgba(0,0,0,0.28)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                border: `3px solid ${C.brassLo}`,
                opacity: 0.65,
              }}
            />
          </div>
        </Boil>
      </div>

      {/* Pelat 2 (kanan): BUKAN UKURAN KEKAYAAN */}
      <div
        style={{
          position: 'absolute',
          left: 900,
          top: p2Y,
          width: 400,
          height: 62,
          translate: '-50% -50%',
          opacity: plate2In * (1 - exitOut),
        }}
      >
        <Boil seed="plate2" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -280,
              width: 3,
              height: 280,
              translate: '-50% 0',
              background: C.inkSoft,
              opacity: 0.55,
            }}
          />
          <div
            style={{
              backgroundColor: C.creamHi,
              border: `4px solid ${C.wood}`,
              borderRadius: 10,
              padding: '14px 18px',
              fontFamily: FONT.banner,
              fontSize: 22,
              color: C.ink,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
            }}
          >
            BUKAN UKURAN KEKAYAAN
          </div>
        </Boil>
      </div>
    </AbsoluteFill>
  );
};

// Tokoh utama "kamu": siluet kertas TANPA WAJAH, kemeja krem, tas selempang kecil, syal terakota panjang.
const KamuFigure: React.FC<{x: number; posture: number; frame: number}> = ({x, posture, frame}) => {
  // Gerak napas/ayunan sangat halus; saat menegakkan badan (posture 0->1), puncak kepala tetap di HEAD_TOP_Y = 325.
  const breath = Math.sin(frame * 0.05) * 0.8;
  const shoulderLift = posture * 3;
  const torsoWidth = 84 + posture * 4;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: FLOOR_Y,
        width: 140,
        height: FLOOR_Y - HEAD_TOP_Y,
        translate: '-50% -100%',
      }}
    >
      {/* Kaki & sepatu */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: 26,
          height: 102,
          translate: '-115% 0',
          background: C.inkSoft,
          borderRadius: '6px 6px 8px 8px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: 26,
          height: 102,
          translate: '15% 0',
          background: C.inkSoft,
          borderRadius: '6px 6px 8px 8px',
        }}
      />

      {/* Lengan kiri & kanan (kemeja krem) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 84 - shoulderLift,
          width: 20,
          height: 92,
          translate: `${-torsoWidth / 2 - 14}px 0`,
          rotate: `${4 - posture * 3}deg`,
          background: C.cream,
          borderRadius: 10,
          boxShadow: '2px 4px 6px rgba(0,0,0,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 84 - shoulderLift,
          width: 20,
          height: 92,
          translate: `${torsoWidth / 2 - 6}px 0`,
          rotate: `${-4 + posture * 3}deg`,
          background: C.cream,
          borderRadius: 10,
          boxShadow: '-2px 4px 6px rgba(0,0,0,0.18)',
        }}
      />

      {/* Badan / kemeja krem */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 76 - shoulderLift,
          width: torsoWidth,
          height: 112 + shoulderLift,
          translate: '-50% 0',
          background: '#F2ECE1',
          borderRadius: '18px 18px 10px 10px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.22)',
        }}
      >
        {/* Lipatan tengah kemeja tanpa tombol/teks */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 12,
            bottom: 8,
            width: 2,
            background: C.creamLo,
            opacity: 0.7,
          }}
        />
      </div>

      {/* Tali dan tas selempang kecil */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 74 - shoulderLift,
          width: 9,
          height: 112,
          translate: '2px 0',
          rotate: '34deg',
          background: '#6E4E34',
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 156,
          width: 34,
          height: 28,
          translate: '-54px 0',
          background: '#7F5A3C',
          borderTop: '7px solid #5E3F27',
          borderRadius: 6,
          boxShadow: '1px 3px 6px rgba(0,0,0,0.25)',
        }}
      />

      {/* Syal kertas terakota panjang (penanda utama tokoh "kamu") */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 72 - shoulderLift + breath * 0.4,
          width: 22,
          height: 98,
          translate: '12px 0',
          rotate: `${-2 + Math.sin(frame * 0.04) * 0.8}deg`,
          background: C.heroLo,
          borderRadius: '4px 4px 8px 8px',
          boxShadow: '2px 4px 8px rgba(0,0,0,0.22)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 74 - shoulderLift + breath * 0.3,
          width: 24,
          height: 114,
          translate: '-28px 0',
          rotate: `${2.5 + Math.sin(frame * 0.04 + 1) * 0.8}deg`,
          background: C.tag,
          borderRadius: '4px 4px 8px 8px',
          boxShadow: '2px 5px 9px rgba(0,0,0,0.26)',
        }}
      />
      {/* Lilitan syal di leher */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 64 - shoulderLift * 0.5,
          width: 66,
          height: 22,
          translate: '-50% 0',
          background: C.tag,
          borderRadius: 11,
          boxShadow: '0 3px 6px rgba(0,0,0,0.22)',
        }}
      />

      {/* Kepala bulat polos TANPA WAJAH — puncak kepala terkunci tepat di top: 0 (HEAD_TOP_Y) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 66,
          height: 66,
          translate: '-50% 0',
          borderRadius: '50%',
          background: '#E2D6C6',
          border: `3px solid ${C.creamLo}`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

// Dua penggaris kertas tanpa angka pada garisnya: SENTIMETER (rapat) dan INCI (jarang).
const PaperRuler: React.FC<{
  cx: number;
  label: string;
  tickStep: number;
  tickSide: 'left' | 'right';
  riseProgress: number;
  labelProgress: number;
  seed: string;
}> = ({cx, label, tickStep, tickSide, riseProgress, labelProgress, seed}) => {
  if (riseProgress <= 0.01) return null;

  const rulerTop = 172;
  const rulerH = FLOOR_Y - rulerTop;
  const dy = (1 - riseProgress) * 460;
  const ticks = Math.floor((rulerH - 28) / tickStep);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: rulerTop + dy,
        translate: '-50% 0',
        width: 78,
        height: rulerH,
        opacity: interpolate(riseProgress, [0, 0.25], [0, 1], CLAMP),
      }}
    >
      <Paper lift={6}>
        {/* Badan penggaris kertas */}
        <Slab
          x={0}
          y={0}
          w={78}
          h={rulerH}
          color="#EFE5D4"
          shade="#D8C9B2"
          shadeH={0.06}
          r="6px 6px 2px 2px"
        />
        {/* Garis-garis ukur tanpa angka */}
        {Array.from({length: ticks}).map((_, i) => {
          const y = 16 + i * tickStep;
          const isMajor = i % 5 === 0;
          const lineW = isMajor ? 34 : 19;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: y,
                left: tickSide === 'right' ? undefined : 0,
                right: tickSide === 'right' ? 0 : undefined,
                width: lineW,
                height: isMajor ? 3.2 : 2,
                background: C.inkSoft,
                opacity: isMajor ? 0.9 : 0.65,
              }}
            />
          );
        })}
      </Paper>

      {/* Pelat label penggaris (SENTIMETER / INCI) */}
      {labelProgress > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -54,
            width: 180,
            height: 48,
            translate: '-50% 0',
            scale: `${interpolate(labelProgress, [0, 1], [0.86, 1], CLAMP)}`,
            opacity: labelProgress,
          }}
        >
          <Boil seed={seed} amp={0.4} rot={0.05}>
            <div
              style={{
                backgroundColor: C.ink,
                color: '#F3EEE6',
                padding: '10px 20px 11px',
                borderRadius: 8,
                fontFamily: FONT.banner,
                fontSize: 22,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                boxShadow: '0 6px 14px rgba(0,0,0,0.28)',
              }}
            >
              {label}
            </div>
          </Boil>
        </div>
      )}
    </div>
  );
};

export const D10: React.FC = () => {
  const f = useCurrentFrame();

  // 1. Gerak kamera kontinu tanpa potongan (Beat 1 dolly-in ke TV -> Beat 2 mundur -> Beat 3-7 dolly-in halus).
  const camScale =
    f < 57
      ? interpolate(f, [0, 26], [2.25, 2.45], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : f < 109
        ? interpolate(f, [57, 94], [2.45, 1.0], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
        : f < 198
          ? interpolate(f, [109, 175], [1.0, 1.07], {...CLAMP, easing: Easing.out(Easing.cubic)})
          : f < 218
            ? interpolate(f, [198, 218], [1.07, 1.01], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
            : interpolate(f, [218, 448], [1.01, 1.08], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const camFocusX =
    f < 57
      ? 238
      : f < 109
        ? interpolate(f, [57, 94], [238, 640], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
        : 640;

  const camFocusY =
    f < 57
      ? 438
      : f < 109
        ? interpolate(f, [57, 94], [438, 360], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
        : f < 198
          ? interpolate(f, [109, 175], [360, 315], {...CLAMP, easing: Easing.out(Easing.cubic)})
          : f < 218
            ? interpolate(f, [198, 218], [315, 355], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
            : interpolate(f, [218, 448], [355, 345], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const tx = 640 - camFocusX * camScale;
  const ty = 360 - camFocusY * camScale;

  // 2. Pencahayaan: biru TV di Beat 1 -> lampu sorot kuning madu hangat sejak Beat 2.
  const tvGlow = interpolate(f, [57, 88], [1, 0.32], CLAMP);
  const warmSpotOpacity = interpolate(f, [58, 92], [0.22, 0.92], CLAMP);

  // 3. Panel dinding bergeser membuka set tiang ukur (Beat 2, scene 117: rel 57-92).
  const panelOpen = interpolate(f, [58, 92], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const panelSlide = panelOpen * 320;

  // 4. Tokoh "kamu" masuk (Beat 4, scene 119: rel 218-259) & menegakkan badan (Beat 7, scene 122: rel 433-448).
  const kamuEnter = interpolate(f, [218, 242], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const kamuX = interpolate(kamuEnter, [0, 1], [960, 640]);
  const posture = interpolate(f, [433, 448], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // 5. Pita terakota horizontal di tinggi kepala (Beat 4: rel 240-258) tetap sejajar hingga akhir.
  const ribbonProgress = interpolate(f, [240, 258], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // 6. Dua penggaris kertas (Beat 5, scene 120: rel 274-359).
  const leftRulerRise = interpolate(f, [276, 296], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const leftLabelPop = interpolate(f, [295, 307], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.3))});

  const rightRulerRise = interpolate(f, [316, 336], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const rightLabelPop = interpolate(f, [335, 347], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.3))});

  // 7. Lingkaran sorot kecil (Beat 6-7, scene 121-122: rel 375-460).
  const spotlightRingOpacity = interpolate(f, [375, 392], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${tx}px, ${ty}px) scale(${camScale})`,
          }}
        >
          {/* LAPISAN LATAR: Dinding kertas krem hangat & cahaya sorot atas */}
          <Slab x={0} y={0} w={1280} h={720} color={C.creamHi} r={0} grain={0.55} />
          <div
            style={{
              position: 'absolute',
              left: 340,
              top: 0,
              width: 600,
              height: 620,
              background:
                'radial-gradient(ellipse at 50% 18%, rgba(245, 197, 66, 0.34) 0%, rgba(245, 197, 66, 0.08) 55%, rgba(245, 197, 66, 0) 78%)',
              opacity: warmSpotOpacity,
              pointerEvents: 'none',
            }}
          />

          {/* Dekorasi dinding kanan panggung (rak buku polos tanpa teks) */}
          <div style={{position: 'absolute', left: 955, top: 215, width: 175, height: 120}}>
            <Paper lift={3}>
              {[
                {dx: 14, h: 78, c: ROOM.sage},
                {dx: 42, h: 88, c: C.brass},
                {dx: 70, h: 74, c: ROOM.dusk},
                {dx: 98, h: 84, c: C.tag},
              ].map((b, i) => (
                <Slab key={i} x={b.dx} y={96 - b.h} w={24} h={b.h} color={b.c} shade="rgba(0,0,0,0.16)" shadeH={0.12} r={3} />
              ))}
              <Slab x={0} y={96} w={175} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
            </Paper>
          </div>

          {/* SET TENGAH (di balik panel dinding geser): Tiang pengukur tinggi badan */}
          <MeasuringPost />

          {/* Panel dinding kertas bergeser ke kiri & kanan saat Beat 2 */}
          <div
            style={{
              position: 'absolute',
              left: 320 - panelSlide,
              top: 64,
              width: 322,
              height: FLOOR_Y - 64,
              opacity: interpolate(panelOpen, [0.85, 1], [1, 0], CLAMP),
            }}
          >
            <Paper lift={5}>
              <Slab x={0} y={0} w={322} h={FLOOR_Y - 64} color={C.cream} shade={C.creamLo} shadeH={0.04} r={2} />
              <div style={{position: 'absolute', right: 16, top: 24, bottom: 24, width: 4, background: C.woodLo, opacity: 0.35}} />
            </Paper>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 638 + panelSlide,
              top: 64,
              width: 322,
              height: FLOOR_Y - 64,
              opacity: interpolate(panelOpen, [0.85, 1], [1, 0], CLAMP),
            }}
          >
            <Paper lift={5}>
              <Slab x={0} y={0} w={322} h={FLOOR_Y - 64} color={C.cream} shade={C.creamLo} shadeH={0.04} r={2} />
              <div style={{position: 'absolute', left: 16, top: 24, bottom: 24, width: 4, background: C.woodLo, opacity: 0.35}} />
            </Paper>
          </div>

          {/* LANTAI PAPAN KERTAS PANGGUNG */}
          <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 36, height: 3, background: C.floorLo, opacity: 0.8}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 74, height: 3, background: C.floorLo, opacity: 0.8}} />
          <Slab x={0} y={FLOOR_Y - 22} w={1280} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

          {/* JANGKAR WARUNG DI TEPI KIRI PANGGUNG (TV & Gelas Kopi Bertuap) */}
          <WarungCorner frame={f} tvGlow={tvGlow} />

          {/* DUA PENGGARIS KERTAS (SENTIMETER & INCI) */}
          <PaperRuler
            cx={475}
            label="SENTIMETER"
            tickStep={12}
            tickSide="right"
            riseProgress={leftRulerRise}
            labelProgress={leftLabelPop}
            seed="ruler-cm"
          />
          <PaperRuler
            cx={805}
            label="INCI"
            tickStep={30}
            tickSide="left"
            riseProgress={rightRulerRise}
            labelProgress={rightLabelPop}
            seed="ruler-in"
          />

          {/* TOKOH "KAMU" TANPA WAJAH */}
          {kamuEnter > 0.01 && <KamuFigure x={kamuX} posture={posture} frame={f} />}

          {/* PITA TERAKOTA HORIZONTAL SEJAJAR DI TINGGI KEPALA */}
          {ribbonProgress > 0.01 && (
            <div
              style={{
                position: 'absolute',
                left: 640,
                top: HEAD_TOP_Y,
                width: 430 * ribbonProgress,
                height: 9,
                translate: '-50% -50%',
                backgroundColor: C.tag,
                borderRadius: 4,
                boxShadow: '0 3px 6px rgba(0,0,0,0.28)',
              }}
            >
              {/* Ujung lipatan pita kertas di kiri dan kanan */}
              <div
                style={{
                  position: 'absolute',
                  left: -6,
                  top: -4,
                  width: 12,
                  height: 17,
                  background: C.heroLo,
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: -4,
                  width: 12,
                  height: 17,
                  background: C.heroLo,
                  borderRadius: 3,
                }}
              />
            </div>
          )}

          {/* ANOTASI TANPA TEKS: Lingkaran sorot guntingan kertas pada garis ukur sejajar */}
          {spotlightRingOpacity > 0.01 && (
            <div
              style={{
                position: 'absolute',
                left: 640,
                top: HEAD_TOP_Y,
                width: 470,
                height: 132,
                translate: '-50% -50%',
                borderRadius: '50%',
                border: `3px dashed rgba(201, 87, 60, 0.55)`,
                background: 'radial-gradient(ellipse, rgba(255,244,214,0.24) 0%, rgba(255,244,214,0) 72%)',
                opacity: spotlightRingOpacity,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* BEAT 3: Koin kuning madu & pelat KURS = HARGA UANG / BUKAN UKURAN KEKAYAAN */}
          <CoinAndPlates frame={f} />

          {/* TIRAI TEATER TERAKOTA DI KEDUA SISI & PELMET ATAS */}
          <Paper lift={8}>
            {/* Tirai kiri berlapis */}
            <Slab x={0} y={0} w={106} h={720} color="#9E4833" shade="#7B3524" shadeH={0.08} r={0} />
            <Slab x={0} y={0} w={68} h={720} color="#B8553C" shade="#8E3E2B" shadeH={0.08} r="0 0 24px 0" />
            <Slab x={0} y={0} w={34} h={720} color={C.tag} r="0 0 18px 0" />

            {/* Tirai kanan berlapis */}
            <Slab x={1174} y={0} w={106} h={720} color="#9E4833" shade="#7B3524" shadeH={0.08} r={0} />
            <Slab x={1212} y={0} w={68} h={720} color="#B8553C" shade="#8E3E2B" shadeH={0.08} r="0 0 0 24px" />
            <Slab x={1246} y={0} w={34} h={720} color={C.tag} r="0 0 0 18px" />

            {/* Pelmet atas panggung */}
            <Slab x={0} y={0} w={1280} h={46} color="#8E3E2B" shade="#6B2D1E" shadeH={0.35} r={0} />
          </Paper>

          {/* Vinyet lembut panggung */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 48%, rgba(255,255,255,0) 52%, rgba(28,27,23,0.28) 100%)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};