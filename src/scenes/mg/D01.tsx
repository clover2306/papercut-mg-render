// Adegan D01 "Kalkulator di Warung" (scene 11-18, 636 frame @ 30fps): kalkulator kertas di warung malam mengubah gaji menjadi andaian lima ribu dolar.
// Dunia teater kertas warung kopi: tokoh tanpa wajah bersyal terakota, menara koin hijau bercincin, kartu berbingkai putus-putus, dan gumam meja sebelah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {
  Boil,
  DrawOnEllipse,
  GrainOverlay,
  Paper,
  PaperDefs,
  Slab,
  SparkleBurst,
} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D01_DUR = 636;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR_Y = 612;

const GreenDollarCoin: React.FC<{x: number; y: number; r?: number; rot?: number}> = ({
  x,
  y,
  r = 22,
  rot = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      backgroundColor: '#6F8F63',
      border: `2.5px solid ${C.sageLo}`,
      boxShadow: '0 3px 5px rgba(0,0,0,0.34), inset 0 2px 2px rgba(255,255,255,0.28)',
      transform: `rotate(${rot}deg)`,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: Math.max(4, Math.round(r * 0.24)),
        borderRadius: '50%',
        border: '2px solid #B7CFA9',
        boxSizing: 'border-box',
      }}
    />
  </div>
);

const CoffeeCupWithSteam: React.FC<{x: number; y: number; frame: number; scale?: number}> = ({
  x,
  y,
  frame,
  scale = 1,
}) => {
  const wisps = [0, 1, 2].map((i) => {
    const cycle = ((frame + i * 28) % 84) / 84;
    const dy = interpolate(cycle, [0, 1], [0, -54], CLAMP);
    const dx = Math.sin(cycle * Math.PI * 2 + i * 1.4) * 6;
    const op = interpolate(cycle, [0, 0.2, 0.75, 1], [0, 0.52, 0.36, 0], CLAMP);
    return {dy, dx, op, i};
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
    >
      {wisps.map(({dy, dx, op, i}) => (
        <svg
          key={i}
          width={24}
          height={44}
          viewBox="0 0 24 44"
          style={{
            position: 'absolute',
            left: -12 + (i - 1) * 8 + dx,
            top: -86 + dy,
            opacity: op,
            overflow: 'visible',
          }}
        >
          <path
            d="M12 42 C6 32, 18 22, 11 12 C7 6, 14 2, 12 0"
            fill="none"
            stroke={C.creamHi}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
        </svg>
      ))}
      <Paper lift={4}>
        <Slab x={-26} y={-8} w={52} h={8} color={C.creamLo} r={4} />
        <Slab x={15} y={-34} w={13} h={20} color={C.creamLo} r={7} />
        <Slab x={-19} y={-44} w={38} h={38} color={C.creamHi} shade={C.creamLo} shadeH={0.22} r="4px 4px 12px 12px" />
        <Slab x={-17} y={-44} w={34} h={6} color={C.woodLo} r={3} />
      </Paper>
    </div>
  );
};

const PaperTVCorner: React.FC<{x: number; y: number; warmth: number}> = ({x, y, warmth}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <Paper lift={5}>
      <Slab x={18} y={118} w={14} h={118} color={C.woodLo} r={3} />
      <Slab x={138} y={118} w={14} h={118} color={C.woodLo} r={3} />
      <Slab x={12} y={145} w={146} h={12} color={C.wood} r={3} />
      <Slab x={56} y={-34} w={4} h={42} color={C.metalLo} rot={-26} r={2} />
      <Slab x={106} y={-34} w={4} h={42} color={C.metalLo} rot={26} r={2} />
      <Slab x={0} y={0} w={170} h={122} color={C.wood} shade={C.woodLo} shadeH={0.14} r={10} />
      <Slab
        x={14}
        y={14}
        w={112}
        h={94}
        color={warmth > 0.5 ? '#EDE0C4' : '#C9DCE8'}
        r={8}
      />
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 18,
          width: 104,
          height: 86,
          borderRadius: 6,
          background:
            warmth > 0.5
              ? 'radial-gradient(circle at 40% 35%, rgba(255,244,210,0.85), rgba(226,198,142,0.25))'
              : 'radial-gradient(circle at 40% 35%, rgba(235,246,255,0.8), rgba(162,190,214,0.2))',
        }}
      />
      <Slab x={138} y={28} w={18} h={18} color={C.brass} r={9} />
      <Slab x={138} y={56} w={18} h={18} color={C.tape} r={9} />
      <Slab x={136} y={84} w={22} h={20} color={C.woodLo} r={3} />
    </Paper>
  </div>
);

const HeroKamu: React.FC<{
  x: number;
  y: number;
  frame: number;
  armReach: number;
  holdingCalc: boolean;
  scarfBright: number;
}> = ({x, y, frame, armReach, holdingCalc, scarfBright}) => {
  const breathe = Math.sin((frame / 54) * Math.PI * 2) * 1.6;
  const scarfSway = Math.sin((frame / 66) * Math.PI * 2) * 2.2;
  const armRot = interpolate(armReach, [0, 1], [-14, -64], CLAMP);
  const scarfMain = scarfBright > 0.5 ? '#E37E5E' : C.hero;

  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <Paper lift={6}>
        {/* Kaki duduk di bangku warung */}
        <Slab x={-24} y={-68} w={22} h={68} color={C.inkSoft} r={6} />
        <Slab x={4} y={-68} w={22} h={68} color={C.inkSoft} r={6} />
        <Slab x={-36} y={-76} w={74} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={5} />
        <Slab x={-28} y={-62} w={12} h={62} color={C.woodLo} r={3} />
        <Slab x={18} y={-62} w={12} h={62} color={C.woodLo} r={3} />

        {/* Badan kemeja krem */}
        <div style={{transform: `translateY(${breathe}px)`}}>
          <Slab
            x={-34}
            y={-158}
            w={68}
            h={88}
            color={C.creamHi}
            shade={C.creamLo}
            shadeH={0.14}
            r="14px 14px 8px 8px"
          />

          {/* Tali & tas selempang kecil */}
          <Slab x={-26} y={-154} w={10} h={82} color={C.wood} rot={-32} r={4} />
          <Slab x={-44} y={-106} w={30} h={28} color={C.brassLo} shade={C.woodLo} shadeH={0.25} r={6} />
          <Slab x={-44} y={-106} w={30} h={11} color={C.wood} r="6px 6px 3px 3px" />

          {/* Syal kertas terakota panjang */}
          <Slab
            x={10}
            y={-148}
            w={16}
            h={68}
            color={C.heroLo}
            rot={-6 + scarfSway * 0.7}
            r="4px 4px 8px 8px"
          />
          <Slab
            x={18}
            y={-146}
            w={18}
            h={78}
            color={scarfMain}
            rot={-12 + scarfSway}
            r="4px 4px 10px 10px"
          />
          <Slab x={-28} y={-162} w={56} h={20} color={scarfMain} shade={C.heroLo} shadeH={0.25} r={10} />

          {/* Kepala bulat polos TANPA WAJAH */}
          <div
            style={{
              position: 'absolute',
              left: -26,
              top: -218,
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `3px solid ${C.inkSoft}`,
              boxSizing: 'border-box',
              boxShadow: '0 3px 6px rgba(0,0,0,0.24)',
            }}
          />

          {/* Lengan kanan meraih ponsel / memegang kalkulator */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: -144,
              transformOrigin: '8px 8px',
              transform: `rotate(${holdingCalc ? -58 : armRot}deg)`,
            }}
          >
            <Slab x={0} y={0} w={56} h={16} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} />
            <Slab x={48} y={1} w={16} h={14} color={C.creamLo} r={7} />
          </div>
        </div>
      </Paper>
    </div>
  );
};

const NeighborFigure: React.FC<{
  x: number;
  y: number;
  shirt: string;
  frame: number;
  seedOffset?: number;
  standAmount?: number;
  raiseArm?: number;
}> = ({x, y, shirt, frame, seedOffset = 0, standAmount = 0, raiseArm = 0}) => {
  const sway = Math.sin(((frame + seedOffset) / 62) * Math.PI * 2) * 1.4;
  const liftY = -28 * standAmount;
  const armDeg = interpolate(raiseArm, [0, 1], [16, -126], CLAMP);

  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <Paper lift={4}>
        {/* Kursi warung */}
        <Slab x={-30} y={-68} w={60} h={12} color={C.woodLo} r={4} />
        <Slab x={-24} y={-56} w={10} h={56} color={C.woodLo} r={3} />
        <Slab x={14} y={-56} w={10} h={56} color={C.woodLo} r={3} />

        {/* Kaki */}
        <Slab x={-20} y={-64 + liftY * 0.4} w={18} h={64 - liftY * 0.4} color={C.inkSoft} r={5} />
        <Slab x={4} y={-64 + liftY * 0.4} w={18} h={64 - liftY * 0.4} color={C.inkSoft} r={5} />

        {/* Tubuh */}
        <div style={{transform: `translateY(${liftY + sway}px)`}}>
          <Slab x={-30} y={-148} w={60} h={82} color={shirt} r="12px 12px 8px 8px" />
          {/* Lengan yang bisa terangkat saat berseru */}
          <div
            style={{
              position: 'absolute',
              left: -18,
              top: -136,
              transformOrigin: '8px 8px',
              transform: `rotate(${armDeg}deg)`,
            }}
          >
            <Slab x={0} y={0} w={54} h={14} color={shirt} r={7} />
            <Slab x={46} y={0} w={14} h={14} color={C.creamLo} r={7} />
          </div>
          {/* Kepala bulat polos TANPA WAJAH */}
          <div
            style={{
              position: 'absolute',
              left: -24,
              top: -204,
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `3px solid ${C.inkSoft}`,
              boxSizing: 'border-box',
              boxShadow: '0 3px 6px rgba(0,0,0,0.22)',
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

const WarungTableProp: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 190}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <Paper lift={4}>
      <Slab x={18} y={14} w={14} h={112} color={C.woodLo} r={3} />
      <Slab x={w - 32} y={14} w={14} h={112} color={C.woodLo} r={3} />
      <Slab x={0} y={0} w={w} h={18} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={5} />
    </Paper>
  </div>
);

const WhistleRibbons: React.FC<{x: number; y: number; frame: number; startAt: number; endAt: number}> = ({
  x,
  y,
  frame,
  startAt,
  endAt,
}) => {
  const enter = interpolate(frame, [startAt, startAt + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [endAt - 14, endAt], [1, 0], CLAMP);
  const alpha = enter * exit;
  if (alpha <= 0.01) return null;

  const drift = interpolate(frame, [startAt, endAt], [0, -28], CLAMP);
  const wave = Math.sin(((frame - startAt) / 28) * Math.PI * 2) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + drift,
        opacity: alpha,
        transform: `translateY(${(1 - enter) * 18}px) scale(${0.86 + enter * 0.14})`,
      }}
    >
      <svg width={150} height={96} viewBox="0 0 150 96" style={{overflow: 'visible'}}>
        <defs>
          <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.32" />
          </filter>
        </defs>
        <path
          d={`M 8 68 C 34 ${52 + wave}, 54 ${76 - wave}, 86 ${54 + wave} C 106 ${40 - wave}, 124 ${48 + wave}, 142 32`}
          fill="none"
          stroke={C.creamHi}
          strokeWidth={7}
          strokeLinecap="round"
          filter="url(#ribbonShadow)"
        />
        <path
          d={`M 18 44 C 42 ${28 - wave}, 66 ${48 + wave}, 96 ${28 - wave} C 114 ${16 + wave}, 128 20, 144 10`}
          fill="none"
          stroke={C.amber}
          strokeWidth={5.5}
          strokeLinecap="round"
          filter="url(#ribbonShadow)"
        />
        <path
          d={`M 26 84 C 52 ${74 - wave}, 78 ${88 + wave}, 112 72`}
          fill="none"
          stroke={C.tape}
          strokeWidth={4.5}
          strokeLinecap="round"
          filter="url(#ribbonShadow)"
        />
      </svg>
    </div>
  );
};

const DashedResultCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
}> = ({x, y, scale = 1, rot = -1.5}) => (
  <Boil seed="usd5000card" amp={0.4} rot={0.05}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
        backgroundColor: '#F3EFE4',
        border: `3.5px dashed ${C.inkSoft}`,
        borderRadius: 12,
        padding: '16px 28px 18px',
        boxShadow: '0 8px 18px rgba(0,0,0,0.36)',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: 48,
          lineHeight: 1,
          color: C.ink,
          letterSpacing: '-0.02em',
        }}
      >
        US$5.000
      </div>
    </div>
  </Boil>
);

const HeroPaperCalculator: React.FC<{
  frame: number;
  openProgress: number;
  cx: number;
  cy: number;
  scale: number;
}> = ({frame, openProgress, cx, cy, scale}) => {
  if (openProgress <= 0.01) return null;

  // Scene 13 (rel 117-173): "Rp5.000.000" masuk utuh, lalu keluar rapi sebelum "÷ 1.000" & "US$5.000"
  const salaryIn = interpolate(frame, [117, 125], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });
  const salaryOut = interpolate(frame, [188, 206], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const showSalary = frame >= 117 && frame < 208;

  // Scene 14a (rel 188-232): tab "÷ 1.000" dicap di sisi layar lalu masuk rapi
  const divTabIn = interpolate(frame, [188, 196], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const divTabOut = interpolate(frame, [218, 232], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const showDivTab = frame >= 188 && frame < 234;

  // Scene 14b (rel 228-272) & Scene 15 (rel 302-322): menara koin hijau tumbuh dari dalam layar
  const coinGrow1 = interpolate(frame, [228, 270], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const coinGrow2 = interpolate(frame, [302, 320], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });
  const showCoins = frame >= 228 && frame < 385;
  const coinFadeOut = interpolate(frame, [355, 382], [1, 0], CLAMP);

  // Kartu hasil "US$5.000" berbingkai putus-putus (scene 14b - scene 15; keluar sebelum scene 17 di rel 473)
  const cardIn = interpolate(frame, [230, 240], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const cardOut = interpolate(frame, [438, 456], [1, 0], CLAMP);
  const showResultCard = frame >= 230 && frame < 458;

  const calcW = 390;
  const calcH = 468;
  const buttonColors = [
    C.cream, C.cream, C.cream, C.tape,
    C.cream, C.cream, C.cream, C.tape,
    C.cream, C.cream, C.cream, C.hero,
    C.creamLo, C.cream, C.tape, C.brass,
  ];

  const leftStackCount = Math.round(coinGrow1 * 7 + coinGrow2 * 2);
  const rightStackCount = Math.round(coinGrow1 * 9 + coinGrow2 * 2);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: calcW,
        height: calcH,
        transform: `translate(-50%, -50%) scale(${openProgress * scale})`,
        opacity: interpolate(openProgress, [0, 0.25], [0, 1], CLAMP),
      }}
    >
      {/* Menara koin hijau bercincin tumbuh dari atas layar kalkulator */}
      {showCoins ? (
        <div style={{opacity: coinFadeOut}}>
          {Array.from({length: leftStackCount}).map((_, idx) => (
            <GreenDollarCoin
              key={`lc-${idx}`}
              x={145 + (idx % 2 === 0 ? -3 : 3)}
              y={66 - idx * 16}
              r={24}
              rot={(idx % 3 - 1) * 3}
            />
          ))}
          {Array.from({length: rightStackCount}).map((_, idx) => (
            <GreenDollarCoin
              key={`rc-${idx}`}
              x={215 + (idx % 2 === 0 ? 4 : -2)}
              y={66 - idx * 16}
              r={25}
              rot={(idx % 3 - 1) * -3}
            />
          ))}
        </div>
      ) : null}

      {/* Bodi kalkulator kertas berlapis */}
      <Paper lift={8}>
        <Slab
          x={0}
          y={0}
          w={calcW}
          h={calcH}
          color={C.board}
          shade={C.boardLo}
          shadeH={0.08}
          r={24}
        />
        <Slab x={12} y={12} w={calcW - 24} h={calcH - 24} color={C.creamLo} r={18} />
        <Slab x={18} y={18} w={calcW - 36} h={calcH - 36} color={C.cream} r={14} />

        {/* Layar kalkulator menyala hangat */}
        <Slab
          x={32}
          y={34}
          w={calcW - 64}
          h={112}
          color="#F7E7C4"
          shade="#DFC896"
          shadeH={0.14}
          r={12}
        />
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 38,
            width: calcW - 72,
            height: 104,
            borderRadius: 10,
            background:
              'radial-gradient(circle at 50% 45%, rgba(255,250,235,0.9), rgba(243,195,95,0.28))',
            overflow: 'hidden',
          }}
        >
          {/* Tempelan gaji Rp5.000.000 (Scene 13) */}
          {showSalary ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translateX(${-salaryOut * 340}px) scale(${0.86 + salaryIn * 0.14})`,
                opacity: salaryIn * (1 - salaryOut),
              }}
            >
              <span
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 44,
                  color: C.ink,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                Rp5.000.000
              </span>
            </div>
          ) : null}
        </div>

        {/* Tombol kalkulator berupa cakram polos (TANPA angka/simbol) */}
        {buttonColors.map((col, idx) => {
          const row = Math.floor(idx / 4);
          const cIdx = idx % 4;
          const bx = 46 + cIdx * 79;
          const by = 172 + row * 66;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: bx,
                top: by,
                width: 58,
                height: 52,
                borderRadius: '50%',
                backgroundColor: col,
                boxShadow: '0 4px 0 rgba(58,56,50,0.34), inset 0 2px 2px rgba(255,255,255,0.45)',
              }}
            />
          );
        })}
      </Paper>

      {/* Tab kertas "÷ 1.000" dicap di sisi layar (Scene 14) */}
      {showDivTab ? (
        <div
          style={{
            position: 'absolute',
            left: calcW - 22 + (1 - divTabIn) * 65 - divTabOut * 85,
            top: 52,
            opacity: divTabIn * (1 - divTabOut),
            transform: `rotate(${-2 + (1 - divTabIn) * 8}deg)`,
          }}
        >
          <div
            style={{
              backgroundColor: C.hero,
              color: C.tagText,
              padding: '14px 24px 16px',
              borderRadius: '6px 14px 14px 6px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 38,
              lineHeight: 1,
              boxShadow: '0 6px 14px rgba(0,0,0,0.34)',
              whiteSpace: 'nowrap',
            }}
          >
            ÷ 1.000
          </div>
        </div>
      ) : null}

      {/* Kartu hasil berbingkai PUTUS-PUTUS "US$5.000" (Scene 14-15) */}
      {showResultCard ? (
        <div style={{opacity: cardIn * cardOut}}>
          <DashedResultCard
            x={calcW + 108}
            y={54}
            scale={0.85 + cardIn * 0.15}
            rot={-1.5}
          />
        </div>
      ) : null}
    </div>
  );
};

export const D01: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak kamera berkesinambungan tanpa potongan:
  // 1. Beat 1 (rel 45-92): dolly-in pelan dari sudut warung ke kalkulator
  // 2. Beat 3 (rel 302-335): dolly-in sedikit lebih dekat saat "Lima ribu dolar"
  // 3. Beat 4 (rel 352-415 & 455-485): pull-out dan pan kanan menyusur meja sebelah & meja lain
  // 4. Beat 5 (rel 554-598): pull-out kembali ke bidikan lebar warung hangat, berhenti tenang di 598
  const zoomIn1 = interpolate(f, [45, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const zoomIn2 = interpolate(f, [302, 335], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const pullOutToTables = interpolate(f, [352, 412], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const panToFarTable = interpolate(f, [455, 485], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pullBackWide = interpolate(f, [554, 598], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const camScale =
    1 +
    zoomIn1 * 0.42 +
    zoomIn2 * 0.08 -
    pullOutToTables * 0.44 -
    pullBackWide * 0.08;

  const camPanX =
    -zoomIn1 * 48 -
    pullOutToTables * 265 -
    panToFarTable * 135 +
    pullBackWide * 335;

  const camPanY =
    -zoomIn1 * 24 +
    pullOutToTables * 20 +
    pullBackWide * 4;

  // Beat 1: "kamu" meraih ponsel (rel 8-42) dan membuka kalkulator (rel 56-92)
  const phoneReach = interpolate(f, [8, 38], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const calcOpen = interpolate(f, [56, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const calcClose = interpolate(f, [352, 392], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const heroCalcProgress = calcOpen * (1 - calcClose);

  // Beat 4: tokoh meja lain berdiri mengangkat tangan (scene 17, rel 473-492)
  const neighborStand = interpolate(f, [473, 492], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const neighborArm = interpolate(f, [475, 494], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });

  // Beat 5 (scene 18, rel 561-636): warung menghangat, koin hijau melayang pelan, garis putus-putus mengelilingi warung
  const beat5Warmth = interpolate(f, [561, 595], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const dashedOutlineProgress = interpolate(f, [566, 608], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const endCardIn = interpolate(f, [574, 594], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.25)),
  });

  // Partikel debu kertas melayang sangat pelan
  const dustSpecs = [
    {bx: 260, by: 210, r: 3.5, sp: 0.25},
    {bx: 470, by: 165, r: 4, sp: 0.18},
    {bx: 690, by: 245, r: 3, sp: 0.22},
    {bx: 910, by: 190, r: 4, sp: 0.16},
    {bx: 1110, by: 260, r: 3.5, sp: 0.2},
    {bx: 380, by: 340, r: 3, sp: 0.19},
    {bx: 820, by: 320, r: 3.5, sp: 0.24},
  ];

  // Koin hijau melayang lembut di Beat 5
  const floatingEndCoins = [
    {x: 310, yStart: 390, yEnd: 245, r: 21, rot: -10},
    {x: 525, yStart: 370, yEnd: 215, r: 24, rot: 8},
    {x: 785, yStart: 405, yEnd: 255, r: 20, rot: -6},
    {x: 1035, yStart: 385, yEnd: 230, r: 22, rot: 12},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#1E2638', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 0: Dinding belakang warung malam & jendela (paralaks latar) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camPanX * 0.45}px, ${camPanY * 0.45}px) scale(${1 + (camScale - 1) * 0.45})`,
            transformOrigin: '50% 50%',
          }}
        >
          <Slab x={-160} y={-80} w={1960} h={860} color={ROOM.navy} r={0} grain={0.55} />
          {/* Lapisan cahaya malam hangat */}
          <div
            style={{
              position: 'absolute',
              inset: -160,
              background: `radial-gradient(ellipse at 45% 38%, rgba(255, 206, 118, ${0.14 + beat5Warmth * 0.18}) 0%, rgba(28, 36, 56, 0.35) 68%, rgba(12, 16, 26, 0.65) 100%)`,
            }}
          />

          {/* Jendela malam warung */}
          <Paper lift={4}>
            <Slab x={235} y={118} w={210} h={245} color={C.creamLo} r={6} />
            <Slab x={250} y={133} w={180} h={215} color="#17223B" r={3} />
            {/* Bulan sabit & bintang kertas polos */}
            <div
              style={{
                position: 'absolute',
                left: 368,
                top: 162,
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: '#F3E6C8',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 358,
                top: 156,
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#17223B',
              }}
            />
            {[
              [282, 168],
              [315, 212],
              [274, 275],
              [395, 286],
            ].map(([sx, sy], i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: sx,
                  top: sy,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: C.creamHi,
                  opacity: 0.85,
                }}
              />
            ))}
            <Slab x={336} y={133} w={8} h={215} color={C.creamLo} r={0} />
            <Slab x={250} y={236} w={180} h={8} color={C.creamLo} r={0} />
          </Paper>

          {/* Rak kayu & papan menu kosong (bebas teks/angka) */}
          <Paper lift={4}>
            <Slab x={690} y={136} w={175} h={124} color={C.wood} r={6} />
            <Slab x={702} y={148} w={151} h={100} color={C.boardLo} r={3} />
            <Slab x={950} y={215} w={230} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
            <Slab x={972} y={163} w={34} h={52} color={C.cream} r={6} />
            <Slab x={1018} y={173} w={28} h={42} color={C.sage} r={5} />
            <Slab x={1062} y={157} w={38} h={58} color={C.brass} r={7} />
          </Paper>

          {/* Panel dinding kayu bawah */}
          <Slab x={-160} y={445} w={1960} h={175} color={C.woodLo} r={0} grain={0.5} />
          <Slab x={-160} y={442} w={1960} h={12} color={C.wood} r={0} />

          {/* Dua lampu gantung kuning madu */}
          {[435, 1020].map((lx, idx) => (
            <div key={idx} style={{position: 'absolute', left: lx, top: 0}}>
              <div
                style={{
                  position: 'absolute',
                  left: -210,
                  top: 112,
                  width: 420,
                  height: 495,
                  background: `radial-gradient(ellipse at 50% 0%, rgba(255, 218, 128, ${0.26 + beat5Warmth * 0.2}) 0%, rgba(255, 200, 96, ${0.08 + beat5Warmth * 0.08}) 52%, rgba(255, 200, 96, 0) 78%)`,
                  clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Slab x={-2} y={0} w={4} h={74} color={C.inkSoft} r={0} />
              <Paper lift={5}>
                <Slab
                  x={-48}
                  y={72}
                  w={96}
                  h={44}
                  color={C.amber}
                  shade={C.amberDim}
                  shadeH={0.22}
                  r="44px 44px 6px 6px"
                />
                <div
                  style={{
                    position: 'absolute',
                    left: -14,
                    top: 110,
                    width: 28,
                    height: 14,
                    borderRadius: '0 0 14px 14px',
                    backgroundColor: '#FFF3C4',
                  }}
                />
              </Paper>
            </div>
          ))}
        </div>

        {/* LAPISAN 1 & 2: Panggung utama warung kopi (meja-meja, TV, kopi, "kamu", tetangga) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camPanX}px, ${camPanY}px) scale(${camScale})`,
            transformOrigin: '520px 410px',
          }}
        >
          {/* Lantai papan kertas panggung */}
          <Slab x={-180} y={FLOOR_Y} w={2040} h={220} color={C.floor} r={0} grain={0.6} />
          <div
            style={{
              position: 'absolute',
              left: -180,
              width: 2040,
              top: FLOOR_Y + 34,
              height: 3,
              backgroundColor: C.floorLo,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -180,
              width: 2040,
              top: FLOOR_Y + 72,
              height: 3,
              backgroundColor: C.floorLo,
              opacity: 0.85,
            }}
          />

          {/* Jangkar Warung 1: Televisi kertas berlayar polos di sudut kiri */}
          <PaperTVCorner x={125} y={376} warmth={beat5Warmth} />

          {/* MEJA SEBELAH (Beat 4 - Scene 16: seseorang bersiul) */}
          <NeighborFigure
            x={820}
            y={FLOOR_Y}
            shirt={ROOM.slate}
            frame={f}
            seedOffset={12}
          />
          <WarungTableProp x={845} y={486} w={175} />
          <CoffeeCupWithSteam x={905} y={486} frame={f + 16} scale={0.86} />
          <WhistleRibbons x={842} y={335} frame={f} startAt={368} endAt={455} />

          {/* MEJA LAIN (Beat 4 - Scene 17: seseorang berkata "KITA KAYA") */}
          <WarungTableProp x={1110} y={486} w={195} />
          <CoffeeCupWithSteam x={1168} y={486} frame={f + 34} scale={0.86} />
          <NeighborFigure
            x={1245}
            y={FLOOR_Y}
            shirt={ROOM.khaki}
            frame={f}
            seedOffset={29}
            standAmount={neighborStand}
            raiseArm={neighborArm}
          />
          <NeighborFigure
            x={1375}
            y={FLOOR_Y}
            shirt={ROOM.sage}
            frame={f}
            seedOffset={43}
          />

          {/* Gelembung ucapan "KITA KAYA" (Scene 17, rel 473-545; keluar sebelum scene 18) */}
          {/* QA Clover: pola Tag mgkit — div gelembung absolute langsung di dalam Boil (struktur lama: Boil inset:0 di dalam wrapper 0-lebar membuat latar menciut dan teks meluber, cacat yang sama seperti papan D02). */}
          {f >= 474 && f <= 558 ? (
            <Boil seed="kitakaya" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 1185,
                  top: 235,
                  translate: '-50% 0',
                  opacity:
                    interpolate(f, [474, 484], [0, 1], CLAMP) *
                    interpolate(f, [546, 557], [1, 0], CLAMP),
                  transform: `scale(${interpolate(f, [474, 486], [0.85, 1], {
                    ...CLAMP,
                    easing: Easing.out(Easing.back(1.3)),
                  })})`,
                  backgroundColor: C.creamHi,
                  padding: '16px 28px 18px',
                  borderRadius: 20,
                  boxShadow: '0 8px 18px rgba(0,0,0,0.38)',
                  whiteSpace: 'nowrap',
                }}
              >
                  <span
                    style={{
                      fontFamily: FONT.banner,
                      fontSize: 34,
                      color: C.ink,
                      letterSpacing: '0.01em',
                    }}
                  >
                    KITA KAYA
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      right: 38,
                      bottom: -14,
                      width: 22,
                      height: 22,
                      backgroundColor: C.creamHi,
                      clipPath: 'polygon(15% 0%, 100% 0%, 75% 100%)',
                    }}
                  />
              </div>
            </Boil>
          ) : null}

          {/* MEJA UTAMA & TOKOH "KAMU" (Syal Terakota) */}
          <HeroKamu
            x={425}
            y={FLOOR_Y}
            frame={f}
            armReach={phoneReach}
            holdingCalc={f >= 352}
            scarfBright={beat5Warmth}
          />
          <WarungTableProp x={445} y={486} w={215} />

          {/* Jangkar Warung 2: Gelas kopi kertas dengan uap tipis */}
          <CoffeeCupWithSteam x={605} y={486} frame={f} scale={1} />

          {/* Ponsel kertas di meja yang diraih "kamu" pada scene 11 (rel 0-45) */}
          {calcOpen < 0.35 ? (
            <div
              style={{
                position: 'absolute',
                left: 515 - phoneReach * 28,
                top: 476 - phoneReach * 42,
                transform: `rotate(${-6 - phoneReach * 16}deg) scale(${1 + calcOpen * 0.4})`,
                opacity: interpolate(calcOpen, [0.1, 0.35], [1, 0], CLAMP),
              }}
            >
              <Paper lift={4}>
                <Slab x={-16} y={-28} w={32} h={52} color={C.board} r={6} />
                <Slab x={-12} y={-22} w={24} h={38} color="#DCEAF2" r={3} />
              </Paper>
            </div>
          ) : null}

          {/* Kalkulator kecil bercahaya di tangan "kamu" saat kamera pull-out (Beat 4-5) */}
          {calcClose > 0.3 ? (
            <div
              style={{
                position: 'absolute',
                left: 486,
                top: 416,
                opacity: interpolate(calcClose, [0.3, 0.75], [0, 1], CLAMP),
                transform: 'rotate(-8deg)',
              }}
            >
              <Paper lift={5}>
                <Slab x={-22} y={-30} w={44} h={58} color={C.board} r={7} />
                <Slab x={-17} y={-24} w={34} h={16} color="#FFF1C2" r={4} />
                <div
                  style={{
                    position: 'absolute',
                    left: -26,
                    top: -34,
                    width: 52,
                    height: 66,
                    borderRadius: 12,
                    background: 'radial-gradient(circle, rgba(255,232,150,0.45), rgba(255,232,150,0))',
                  }}
                />
              </Paper>
            </div>
          ) : null}

          {/* POSE AKHIR (Scene 18, rel 574-636): kartu hasil berbingkai PUTUS-PUTUS di sisi "kamu" */}
          {endCardIn > 0.01 ? (
            <div style={{opacity: endCardIn}}>
              <DashedResultCard
                x={635}
                y={332}
                scale={0.78 + endCardIn * 0.14}
                rot={-2}
              />
            </div>
          ) : null}

          {/* Koin hijau bercincin melayang pelan ke atas di Beat 5 (Scene 18) */}
          {beat5Warmth > 0.01 ? (
            <div style={{opacity: beat5Warmth}}>
              {floatingEndCoins.map((c, idx) => {
                const floatProg = interpolate(f, [564 + idx * 5, 616], [0, 1], {
                  ...CLAMP,
                  easing: Easing.out(Easing.cubic),
                });
                const curY = interpolate(floatProg, [0, 1], [c.yStart, c.yEnd], CLAMP);
                return (
                  <GreenDollarCoin
                    key={idx}
                    x={c.x}
                    y={curY}
                    r={c.r}
                    rot={c.rot + floatProg * 8}
                  />
                );
              })}
            </div>
          ) : null}

          {/* Debu kertas melayang sangat pelan */}
          {dustSpecs.map((d, idx) => {
            const dy = Math.sin((f * d.sp) / 14 + idx) * 9;
            const dx = Math.cos((f * d.sp) / 18 + idx) * 7;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: d.bx + dx,
                  top: d.by + dy,
                  width: d.r * 2,
                  height: d.r * 2,
                  borderRadius: '50%',
                  backgroundColor: '#FFF3D1',
                  opacity: 0.28,
                }}
              />
            );
          })}
        </div>

        {/* LAPISAN 3: Kalkulator Kertas Besar & Lingkaran Sorot Beat 2-3 */}
        {heroCalcProgress > 0.01 ? (
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            {/* Redup latar halus agar layar kalkulator & data menjadi bintang */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: `rgba(18, 22, 34, ${heroCalcProgress * 0.42})`,
              }}
            />
            {/* Anotasi tanpa teks: lingkaran sorot lembut pada layar & hasil di Beat 3 */}
            {f >= 224 && f <= 375 ? (
              <div
                style={{
                  opacity:
                    interpolate(f, [224, 236], [0, 0.85], CLAMP) *
                    interpolate(f, [352, 375], [1, 0], CLAMP),
                }}
              >
                <DrawOnEllipse
                  at={224}
                  x={435}
                  y={104}
                  w={560}
                  h={218}
                  color={C.sparkYellow}
                  stroke={4}
                  dur={16}
                />
              </div>
            ) : null}

            <HeroPaperCalculator
              frame={f}
              openProgress={heroCalcProgress}
              cx={580}
              cy={412}
              scale={1 + zoomIn2 * 0.06}
            />

            {f >= 302 && f <= 355 ? (
              <SparkleBurst at={304} x={765} y={135} seed="coinshimmer" spread={72} />
            ) : null}
          </AbsoluteFill>
        ) : null}

        {/* Beat 5 (Scene 18): seutas garis putus-putus samar mengelilingi seluruh warung */}
        {dashedOutlineProgress > 0.01 ? (
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: dashedOutlineProgress * 0.62,
            }}
          >
            <rect
              x={106}
              y={66}
              width={1068}
              height={594}
              rx={26}
              fill="none"
              stroke={C.creamHi}
              strokeWidth={3.5}
              strokeDasharray="18 14"
              strokeDashoffset={Math.round((1 - dashedOutlineProgress) * 420)}
            />
          </svg>
        ) : null}

        {/* LAPISAN 4: Tirai Teater Kertas Terakota di Kedua Sisi Panggung */}
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          {/* Tirai Kiri */}
          <Paper lift={10}>
            <Slab x={-16} y={-10} w={92} h={740} color={ROOM.terracotta} r={0} grain={0.5} />
            <Slab x={56} y={-10} w={28} h={740} color={C.heroLo} r="0 16px 16px 0" />
            <Slab x={-10} y={405} w={96} h={16} color={C.tape} rot={-6} r={6} />
          </Paper>

          {/* Tirai Kanan */}
          <Paper lift={10}>
            <Slab x={1204} y={-10} w={92} h={740} color={ROOM.terracotta} r={0} grain={0.5} />
            <Slab x={1196} y={-10} w={28} h={740} color={C.heroLo} r="16px 0 0 16px" />
            <Slab x={1194} y={405} w={96} h={16} color={C.tape} rot={6} r={6} />
          </Paper>

          {/* Valance tirai atas panggung */}
          <Paper lift={12}>
            <Slab x={-20} y={-14} w={1320} h={48} color={C.heroLo} r={0} />
            <Slab x={-20} y={-14} w={1320} h={36} color={ROOM.terracotta} r={0} />
          </Paper>

          {/* Vinyet lembut teater */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 56%, rgba(12,14,20,0.34) 100%)',
            }}
          />
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};