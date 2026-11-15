// Adegan D12 "Ukur yang Benar" (scene 140-143): teater kertas warung kopi tentang mengukur kekayaan nyata.
// Mengikuti jendela narasi 573 frame @30fps tanpa teks atau angka, tokoh tanpa wajah, dan gerakan tenang.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D12_DUR = 573;

const FLOOR_Y = 596;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const easeInOut = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

const SteamWisp: React.FC<{x: number; y: number; phase: number}> = ({x, y, phase}) => {
  const f = useCurrentFrame();
  const cycle = ((f + phase) % 120) / 120;
  const dy = -cycle * 44;
  const dx = Math.sin((f + phase) * 0.04) * 5;
  const opacity = Math.sin(cycle * Math.PI) * 0.42;

  return (
    <svg
      width={36}
      height={64}
      viewBox="0 0 36 64"
      style={{
        position: 'absolute',
        left: x - 18,
        top: y - 56,
        transform: `translate(${dx}px, ${dy}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M18 58 C10 44, 26 30, 16 16 C11 9, 17 4, 20 2"
        fill="none"
        stroke={C.creamHi}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </svg>
  );
};

const WarungCornerAnchor: React.FC = () => (
  <div style={{position: 'absolute', left: 112, top: 0, width: 170, height: FLOOR_Y}}>
    <Paper lift={4}>
      <Slab x={16} y={248} w={118} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
      <Slab x={28} y={264} w={12} h={22} color={C.woodLo} r={2} />
      <Slab x={110} y={264} w={12} h={22} color={C.woodLo} r={2} />

      <Slab x={30} y={176} w={90} h={68} color={C.board} shade={C.boardLo} shadeH={0.14} r={8} />
      <Slab x={38} y={184} w={74} h={50} color={C.screenHi} r={4} />
      <div
        style={{
          position: 'absolute',
          left: 38,
          top: 184,
          width: 74,
          height: 50,
          borderRadius: 4,
          background: 'radial-gradient(circle at 40% 35%, rgba(243,230,211,0.55), rgba(141,168,186,0.25))',
        }}
      />
      <Slab x={56} y={162} w={3} h={16} color={C.metalLo} rot={-22} r={2} />
      <Slab x={86} y={162} w={3} h={16} color={C.metalLo} rot={24} r={2} />
    </Paper>

    <Paper lift={5}>
      <Slab x={14} y={504} w={132} h={14} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
      <Slab x={28} y={518} w={14} h={FLOOR_Y - 518} color={C.woodLo} r={2} />
      <Slab x={118} y={518} w={14} h={FLOOR_Y - 518} color={C.woodLo} r={2} />

      <Slab x={54} y={497} w={52} h={7} color={C.creamLo} r={4} />
      <Slab x={62} y={464} w={36} h={34} color={C.creamHi} shade={C.creamLo} shadeH={0.18} r="3px 3px 8px 8px" />
      <Slab x={61} y={474} w={38} h={12} color={C.hero} r={2} />
      <div
        style={{
          position: 'absolute',
          left: 95,
          top: 470,
          width: 11,
          height: 18,
          borderRadius: '0 8px 8px 0',
          border: `3.5px solid ${C.creamLo}`,
          borderLeft: 'none',
        }}
      />
    </Paper>

    <SteamWisp x={76} y={462} phase={0} />
    <SteamWisp x={86} y={462} phase={58} />
  </div>
);

const SpotlightRing: React.FC<{cx: number; cy: number; rx: number; ry: number; progress: number; opacity: number}> = ({
  cx,
  cy,
  rx,
  ry,
  progress,
  opacity,
}) => {
  if (opacity <= 0.01) return null;
  const perim = Math.round(Math.PI * (rx + ry));
  const offset = perim * (1 - progress);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - rx - 24,
        top: cy - ry - 24,
        width: (rx + 24) * 2,
        height: (ry + 24) * 2,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 16,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(245,197,66,0.22) 0%, rgba(245,197,66,0.06) 62%, rgba(245,197,66,0) 76%)',
        }}
      />
      <svg width={(rx + 24) * 2} height={(ry + 24) * 2} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <ellipse
          cx={rx + 24}
          cy={ry + 24}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={C.amber}
          strokeWidth={4}
          strokeDasharray={`${perim}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          opacity={0.85}
        />
        <ellipse
          cx={rx + 24}
          cy={ry + 24}
          rx={rx + 8}
          ry={ry + 6}
          fill="none"
          stroke={C.creamHi}
          strokeWidth={2}
          strokeDasharray="12 10"
          opacity={progress * 0.65}
        />
      </svg>
    </div>
  );
};

interface KamuProps {
  x: number;
  y: number;
  seated?: boolean;
  facing?: 1 | -1;
  armRaise?: number;
  hugProgress?: number;
  envelopeThickness?: number;
  hasTool?: boolean;
  scarfSway?: number;
  scarfBright?: number;
  lean?: number;
}

const KamuFigure: React.FC<KamuProps> = ({
  x,
  y,
  seated = false,
  facing = 1,
  armRaise = 0,
  hugProgress = 0,
  envelopeThickness = 0,
  hasTool = false,
  scarfSway = 0,
  scarfBright = 0,
  lean = 0,
}) => {
  const f = useCurrentFrame();
  const breath = Math.sin(f * 0.045) * 1.4;
  const scarfColor = scarfBright > 0.5 ? '#D96443' : C.hero;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 110,
        height: 196,
        transform: `translate(-50%, -100%) scaleX(${facing}) rotate(${lean}deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={6}>
        {seated ? (
          <>
            <Slab x={34} y={136} w={48} h={18} color={C.inkSoft} r={7} />
            <Slab x={68} y={142} w={20} h={46} color={C.inkSoft} r={6} />
          </>
        ) : (
          <>
            <Slab x={33} y={144} w={20} h={52} color={C.inkSoft} r={6} />
            <Slab x={57} y={144} w={20} h={52} color={C.inkSoft} r={6} />
          </>
        )}

        <div style={{position: 'absolute', inset: 0, transform: `translateY(${breath}px)`}}>
          {/* Belakang syal terakota menjuntai */}
          <Slab
            x={22}
            y={64}
            w={16}
            h={74}
            color={C.heroLo}
            rot={8 + scarfSway}
            r="4px 4px 8px 8px"
          />

          {/* Badan kemeja krem */}
          <Slab
            x={27}
            y={62}
            w={56}
            h={86}
            color={C.creamHi}
            shade={C.cream}
            shadeH={0.2}
            r="14px 14px 10px 10px"
          />

          {/* Tali dan tas selempang kecil */}
          <Slab x={52} y={62} w={7} h={74} color={C.brassLo} rot={-34} r={3} />
          <Slab x={20} y={114} w={24} h={22} color={C.wood} shade={C.woodLo} shadeH={0.25} r={5} />

          {/* Lilitan syal terakota di leher */}
          <Slab x={26} y={55} w={58} h={18} color={scarfColor} shade={C.heroLo} shadeH={0.25} r={9} />
          <Slab
            x={64}
            y={66}
            w={15}
            h={68}
            color={scarfColor}
            shade={C.heroLo}
            shadeH={0.18}
            rot={-5 + scarfSway * 1.2}
            r="3px 3px 7px 7px"
          />

          {/* Kepala bulat kertas polos TANPA WAJAH */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 2,
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2.5px solid ${C.inkSoft}`,
              boxSizing: 'border-box',
            }}
          />

          {/* Tangan & properti di tangan */}
          {hugProgress > 0.01 ? (
            <Slab
              x={54}
              y={84}
              w={54 * hugProgress + 16 * (1 - hugProgress)}
              h={16}
              color={C.cream}
              shade={C.creamLo}
              shadeH={0.25}
              rot={-6}
              r={8}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                left: 62,
                top: 74,
                transformOrigin: '6px 8px',
                transform: `rotate(${-armRaise * 48}deg)`,
              }}
            >
              <Slab x={0} y={0} w={44} h={15} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} />

              {hasTool ? (
                <div style={{position: 'absolute', left: 36, top: -18, transform: 'rotate(24deg)'}}>
                  <Slab x={4} y={8} w={8} h={34} color={C.metalLo} r={3} />
                  <Slab x={-3} y={0} w={22} h={12} color={C.metal} shade={C.metalLo} shadeH={0.3} r={4} />
                </div>
              ) : null}

              {envelopeThickness > 0 ? (
                <div style={{position: 'absolute', left: 32, top: -14 - envelopeThickness * 2}}>
                  {Array.from({length: envelopeThickness}).map((_, idx) => (
                    <Slab
                      key={idx}
                      x={idx * 2}
                      y={-idx * 4}
                      w={34}
                      h={22}
                      color={idx % 2 === 0 ? C.creamHi : C.tape}
                      shade={C.creamLo}
                      shadeH={0.25}
                      r={3}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

const MeasuringTapeProp: React.FC<{dropProgress: number; retractProgress: number; sway: number}> = ({
  dropProgress,
  retractProgress,
  sway,
}) => {
  const height = interpolate(dropProgress, [0, 1], [0, 396], CLAMP) * (1 - retractProgress);
  if (height <= 2) return null;

  const tickCount = Math.floor(height / 18);

  return (
    <div
      style={{
        position: 'absolute',
        left: 396,
        top: 28,
        width: 34,
        height,
        transformOrigin: '50% 0%',
        transform: `rotate(${sway}deg)`,
      }}
    >
      <Paper lift={5}>
        <Slab x={0} y={0} w={34} h={height} color={C.amber} shade={C.brass} shadeH={0.14} r="0 0 6px 6px" />
        <Slab x={28} y={0} w={6} h={height} color={C.creamHi} r="0 0 6px 0" />
        {Array.from({length: tickCount}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 12 + i * 18,
              width: i % 2 === 0 ? 16 : 10,
              height: 2.5,
              backgroundColor: C.inkSoft,
              opacity: 0.75,
            }}
          />
        ))}
        {height > 30 ? (
          <Slab x={-4} y={height - 14} w={42} h={14} color={C.brassLo} r={4} />
        ) : null}
      </Paper>
    </div>
  );
};

const ConversionLeftGroup: React.FC<{x: number; opacity: number; sinkY: number}> = ({x, opacity, sinkY}) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: FLOOR_Y - 196 + sinkY,
        width: 240,
        height: 196,
        transform: 'translateX(-50%)',
        opacity,
      }}
    >
      <Paper lift={4}>
        {/* Pedestal kayu rendah */}
        <Slab x={20} y={142} w={200} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
        <Slab x={42} y={156} w={16} h={40} color={C.woodLo} r={2} />
        <Slab x={182} y={156} w={16} h={40} color={C.woodLo} r={2} />

        {/* Amplop gaji polos */}
        <Slab x={26} y={84} w={92} h={58} color={C.creamHi} shade={C.creamLo} shadeH={0.18} rot={-4} r={4} />
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 84,
            width: 0,
            height: 0,
            borderLeft: '44px solid transparent',
            borderRight: '44px solid transparent',
            borderTop: `28px solid ${C.creamLo}`,
            transform: 'rotate(-4deg)',
          }}
        />

        {/* Kalkulator konversi tanpa angka/teks */}
        <Slab x={122} y={48} w={76} h={94} color={C.board} shade={C.boardLo} shadeH={0.16} rot={3} r={8} />
        <Slab x={131} y={58} w={58} h={22} color={C.screenHi} rot={3} r={3} />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                left: 133 + col * 19,
                top: 88 + row * 16,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: row === 2 && col === 2 ? C.hero : C.creamLo,
              }}
            />
          )),
        )}

        {/* Koin dolar hijau zaitun bercincin tanpa tulisan */}
        {[
          {cx: 74, cy: 36, r: 17},
          {cx: 108, cy: 20, r: 15},
          {cx: 146, cy: 14, r: 16},
        ].map((coin, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: coin.cx - coin.r,
              top: coin.cy - coin.r,
              width: coin.r * 2,
              height: coin.r * 2,
              borderRadius: '50%',
              backgroundColor: C.sage,
              border: `3px solid ${C.sageLo}`,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 4,
                borderRadius: '50%',
                border: `2px solid ${C.creamHi}`,
                opacity: 0.7,
              }}
            />
          </div>
        ))}
      </Paper>
    </div>
  );
};

const ShoppingBasketGroup: React.FC<{x: number; itemProgress: [number, number, number, number]}> = ({
  x,
  itemProgress,
}) => {
  const [pRice, pFuel, pHouse, pBag] = itemProgress;

  const dropOffset = (p: number) => interpolate(p, [0, 1], [-85, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: FLOOR_Y - 250,
        width: 280,
        height: 250,
        transform: 'translateX(-50%)',
      }}
    >
      <Paper lift={5}>
        {/* 1. Karung beras polos */}
        {pRice > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 66 + dropOffset(pRice),
              opacity: pRice,
            }}
          >
            <Slab x={6} y={0} w={44} h={16} color={C.cream} r="8px 8px 2px 2px" />
            <Slab x={10} y={14} w={36} h={6} color={C.hero} r={2} />
            <Slab x={0} y={18} w={56} h={68} color={C.creamHi} shade={C.creamLo} shadeH={0.2} r="16px 16px 12px 12px" />
          </div>
        ) : null}

        {/* 2. Jerigen polos */}
        {pFuel > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 112,
              top: 62 + dropOffset(pFuel),
              opacity: pFuel,
            }}
          >
            <Slab x={14} y={0} w={16} h={10} color={C.inkSoft} r={3} />
            <Slab x={4} y={8} w={46} h={76} color={C.amber} shade={C.brass} shadeH={0.18} r={10} />
            <Slab x={26} y={16} w={16} h={10} color={C.creamHi} r={4} />
          </div>
        ) : null}

        {/* 3. Rumah mungil sewa polos */}
        {pHouse > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 164,
              top: 56 + dropOffset(pHouse),
              opacity: pHouse,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                borderLeft: '36px solid transparent',
                borderRight: '36px solid transparent',
                borderBottom: `30px solid ${C.hero}`,
              }}
            />
            <Slab x={8} y={28} w={56} h={54} color={C.creamHi} shade={C.cream} shadeH={0.16} r={3} />
            <Slab x={18} y={50} w={16} h={32} color={C.wood} r="3px 3px 0 0" />
            <Slab x={40} y={42} w={14} h={14} color={C.sparkYellow} r={2} />
          </div>
        ) : null}

        {/* 4. Tas sekolah polos */}
        {pBag > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 94,
              top: 44 + dropOffset(pBag),
              opacity: pBag,
            }}
          >
            <Slab x={16} y={0} w={22} h={12} color={C.capLo} r="8px 8px 0 0" />
            <Slab x={4} y={8} w={46} h={58} color={C.cap} shade={C.capLo} shadeH={0.2} r="14px 14px 8px 8px" />
            <Slab x={10} y={34} w={34} h={24} color={C.capLo} r={5} />
            <Slab x={14} y={14} w={6} h={38} color={C.brass} r={2} />
            <Slab x={34} y={14} w={6} h={38} color={C.brass} r={2} />
          </div>
        ) : null}

        {/* Badan keranjang belanja kertas anyam */}
        <Slab x={28} y={118} w={224} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={6} />
        <Slab
          x={38}
          y={132}
          w={204}
          h={92}
          color={C.woodHi}
          shade={C.wood}
          shadeH={0.22}
          r="4px 4px 20px 20px"
        />
        {[0, 1, 2, 3].map((col) => (
          <Slab
            key={col}
            x={58 + col * 44}
            y={138}
            w={26}
            h={76}
            color={C.tape}
            shade={C.wood}
            shadeH={0.18}
            r={4}
          />
        ))}
        {/* Pegangan keranjang */}
        <Slab x={64} y={88} w={10} h={36} color={C.woodLo} rot={-14} r={4} />
        <Slab x={206} y={88} w={10} h={36} color={C.woodLo} rot={14} r={4} />

        {/* Alas meja keranjang */}
        <Slab x={18} y={224} w={244} h={12} color={C.wood} shade={C.woodLo} shadeH={0.4} r={3} />
        <Slab x={46} y={236} w={16} h={14} color={C.woodLo} r={2} />
        <Slab x={218} y={236} w={16} h={14} color={C.woodLo} r={2} />
      </Paper>
    </div>
  );
};

const BookStaircaseSet: React.FC<{offsetX: number}> = ({offsetX}) => {
  const BookStack: React.FC<{x: number; yTop: number; w: number; books: Array<{h: number; cover: string}>}> = ({
    x,
    yTop,
    w,
    books,
  }) => {
    let curY = yTop;
    return (
      <>
        {books.map((b, idx) => {
          const top = curY;
          curY += b.h;
          return (
            <div key={idx} style={{position: 'absolute', left: x, top, width: w, height: b.h}}>
              <Slab x={0} y={0} w={w} h={b.h} color={b.cover} shade="rgba(0,0,0,0.18)" shadeH={0.22} r={5} />
              <Slab x={10} y={5} w={w - 20} h={b.h - 10} color={C.creamHi} r={2} />
              <Slab x={0} y={0} w={16} h={b.h} color={b.cover} r="5px 0 0 5px" />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div style={{position: 'absolute', left: offsetX, top: 0, width: 1280, height: FLOOR_Y}}>
      <Paper lift={5}>
        {/* Tangga 1 (kiri, tinggi 58) */}
        <BookStack
          x={440}
          yTop={FLOOR_Y - 58}
          w={125}
          books={[
            {h: 28, cover: C.cap},
            {h: 30, cover: C.sage},
          ]}
        />
        {/* Tangga 2 (tengah, tinggi 116) */}
        <BookStack
          x={565}
          yTop={FLOOR_Y - 116}
          w={125}
          books={[
            {h: 28, cover: C.brass},
            {h: 30, cover: C.hero},
            {h: 28, cover: C.cap},
            {h: 30, cover: C.woodHi},
          ]}
        />
        {/* Tangga 3 (kanan puncak, tinggi 174) */}
        <BookStack
          x={690}
          yTop={FLOOR_Y - 174}
          w={135}
          books={[
            {h: 28, cover: C.hero},
            {h: 30, cover: C.sage},
            {h: 28, cover: C.cap},
            {h: 30, cover: C.brass},
            {h: 28, cover: C.woodHi},
            {h: 30, cover: C.heroLo},
          ]}
        />
      </Paper>
    </div>
  );
};

const SavingsAndBoxesSet: React.FC<{
  offsetX: number;
  coinCount: number;
  fallingCoinProgress: number;
  boxTiltProgress: number;
}> = ({offsetX, coinCount, fallingCoinProgress, boxTiltProgress}) => {
  const baseCoinsHeight = 20 + coinCount * 11;
  const tilt1 = interpolate(boxTiltProgress, [0, 1], [0, 4], CLAMP);
  const tilt2 = interpolate(boxTiltProgress, [0, 1], [0, 11], CLAMP);
  const tilt3 = interpolate(boxTiltProgress, [0, 1], [0, 19], CLAMP);
  const slideShift = interpolate(boxTiltProgress, [0, 1], [0, 18], CLAMP);

  return (
    <div style={{position: 'absolute', left: offsetX, top: 0, width: 1280, height: FLOOR_Y}}>
      {/* Meja toples tabungan di tengah */}
      <Paper lift={5}>
        <Slab x={476} y={488} w={184} h={16} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
        <Slab x={496} y={504} w={16} h={FLOOR_Y - 504} color={C.woodLo} r={2} />
        <Slab x={624} y={504} w={16} h={FLOOR_Y - 504} color={C.woodLo} r={2} />

        {/* Koin kecil jatuh ke dalam toples */}
        {fallingCoinProgress > 0 && fallingCoinProgress < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 560,
              top: interpolate(fallingCoinProgress, [0, 1], [336, 464 - baseCoinsHeight], CLAMP),
              width: 18,
              height: 10,
              borderRadius: '50%',
              backgroundColor: C.sparkYellow,
              border: `2px solid ${C.brassLo}`,
            }}
          />
        ) : null}

        {/* Toples tabungan polos tanpa label/angka */}
        <div style={{position: 'absolute', left: 530, top: 374, width: 76, height: 114}}>
          {/* Badan kaca kertas tembus pandang */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 16,
              width: 68,
              height: 98,
              borderRadius: '12px 12px 14px 14px',
              backgroundColor: 'rgba(255, 251, 242, 0.56)',
              border: `3px solid ${C.creamLo}`,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Tumpukan koin kuning madu di dalam toples */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                bottom: 4,
                height: baseCoinsHeight,
                borderRadius: 6,
                backgroundColor: C.amber,
                borderTop: `3px solid ${C.sparkYellow}`,
              }}
            />
            {/* Kilau kaca vertikal */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 10,
                width: 7,
                height: 72,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.55)',
              }}
            />
          </div>
          {/* Leher dan tutup kayu toples */}
          <Slab x={12} y={10} w={52} h={10} color={C.cream} r={4} />
          <Slab x={10} y={0} w={56} h={12} color={C.wood} shade={C.woodLo} shadeH={0.35} r={5} />
        </div>
      </Paper>

      {/* Sisi kanan: tumpukan kardus tanpa toples yang miring pelan saat angin berhembus */}
      <div
        style={{
          position: 'absolute',
          left: 840 + slideShift,
          top: FLOOR_Y - 192,
          width: 140,
          height: 192,
        }}
      >
        <Paper lift={5}>
          {/* Kardus bawah */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 124,
              width: 112,
              height: 68,
              transformOrigin: '100% 100%',
              transform: `rotate(${tilt1}deg)`,
            }}
          >
            <Slab x={0} y={0} w={112} h={68} color={C.tape} shade={C.woodHi} shadeH={0.22} r={4} />
            <Slab x={0} y={12} w={112} h={5} color={C.wood} r={1} />
          </div>

          {/* Kardus tengah */}
          <div
            style={{
              position: 'absolute',
              left: 18 + tilt2 * 0.5,
              top: 62,
              width: 96,
              height: 62,
              transformOrigin: '100% 100%',
              transform: `rotate(${tilt2}deg)`,
            }}
          >
            <Slab x={0} y={0} w={96} h={62} color={C.woodHi} shade={C.wood} shadeH={0.22} r={4} />
            <Slab x={0} y={11} w={96} h={5} color={C.woodLo} r={1} />
          </div>

          {/* Kardus atas */}
          <div
            style={{
              position: 'absolute',
              left: 26 + tilt3 * 0.9,
              top: 6,
              width: 82,
              height: 56,
              transformOrigin: '100% 100%',
              transform: `rotate(${tilt3}deg)`,
            }}
          >
            <Slab x={0} y={0} w={82} h={56} color={C.tape} shade={C.woodHi} shadeH={0.22} r={4} />
            <Slab x={0} y={10} w={82} h={4} color={C.wood} r={1} />
          </div>
        </Paper>
      </div>
    </div>
  );
};

const PaperWindLayer: React.FC<{progress: number}> = ({progress}) => {
  if (progress <= 0.01 || progress >= 0.99) return null;
  const opacity = Math.sin(progress * Math.PI) * 0.55;
  const shiftX = interpolate(progress, [0, 1], [-220, 260], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateX(${shiftX}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <path
          d="M140 280 C340 245, 520 315, 760 275 C940 245, 1060 290, 1180 268"
          fill="none"
          stroke={C.creamHi}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M190 385 C390 355, 610 415, 840 375 C990 350, 1100 390, 1210 365"
          fill="none"
          stroke={C.creamHi}
          strokeWidth={3}
          strokeDasharray="34 18"
          strokeLinecap="round"
        />
        <path
          d="M240 470 C430 448, 640 492, 870 462"
          fill="none"
          stroke={C.amber}
          strokeWidth={2.5}
          opacity={0.7}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const TheaterFrame: React.FC<{curtainSway: number}> = ({curtainSway}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <Paper lift={8}>
      {/* Tirai terakota kiri */}
      <div
        style={{
          position: 'absolute',
          left: -12,
          top: 0,
          width: 102,
          height: 720,
          transformOrigin: '0% 0%',
          transform: `skewX(${curtainSway * 0.45}deg)`,
        }}
      >
        <Slab x={0} y={0} w={98} h={720} color={C.heroLo} r="0 0 36px 0" />
        <Slab x={0} y={0} w={74} h={720} color={C.hero} r="0 0 28px 0" />
        <Slab x={0} y={0} w={44} h={720} color={C.tag} r="0 0 22px 0" />
        <Slab x={8} y={390} w={78} h={14} color={C.brass} r={7} />
      </div>

      {/* Tirai terakota kanan */}
      <div
        style={{
          position: 'absolute',
          right: -12,
          top: 0,
          width: 102,
          height: 720,
          transformOrigin: '100% 0%',
          transform: `skewX(${curtainSway * 0.45}deg)`,
        }}
      >
        <Slab x={4} y={0} w={98} h={720} color={C.heroLo} r="0 0 0 36px" />
        <Slab x={28} y={0} w={74} h={720} color={C.hero} r="0 0 0 28px" />
        <Slab x={58} y={0} w={44} h={720} color={C.tag} r="0 0 0 22px" />
        <Slab x={16} y={390} w={78} h={14} color={C.brass} r={7} />
      </div>

      {/* Lengkung tirai atas */}
      <Slab x={0} y={-8} w={1280} h={46} color={C.heroLo} shade={C.inkSoft} shadeH={0.22} r="0 0 22px 22px" />
      <Slab x={0} y={-8} w={1280} h={34} color={C.hero} r="0 0 18px 18px" />
    </Paper>
  </div>
);

export const D12: React.FC = () => {
  const f = useCurrentFrame();

  // Pergerakan kamera halus dan tenang antar beat (tanpa potongan)
  const camZoom =
    f < 120
      ? interpolate(f, [10, 115], [1.0, 1.13], {...CLAMP, easing: easeInOut})
      : f < 205
        ? interpolate(f, [120, 150], [1.13, 1.07], {...CLAMP, easing: easeInOut})
        : f < 288
          ? interpolate(f, [205, 280], [1.07, 1.14], {...CLAMP, easing: easeInOut})
          : f < 378
            ? interpolate(f, [288, 374], [1.14, 1.12], {...CLAMP, easing: easeInOut})
            : f < 415
              ? interpolate(f, [378, 412], [1.12, 1.0], {...CLAMP, easing: easeInOut})
              : interpolate(f, [415, 545], [1.0, 1.04], {...CLAMP, easing: easeOut});

  const camX =
    f < 120
      ? interpolate(f, [10, 115], [0, 138], {...CLAMP, easing: easeInOut})
      : f < 205
        ? interpolate(f, [120, 150], [138, 35], {...CLAMP, easing: easeInOut})
        : f < 288
          ? interpolate(f, [205, 280], [35, -148], {...CLAMP, easing: easeInOut})
          : f < 310
            ? interpolate(f, [288, 310], [-148, 8], {...CLAMP, easing: easeInOut})
            : f < 378
              ? interpolate(f, [310, 374], [8, -72], {...CLAMP, easing: easeInOut})
              : interpolate(f, [378, 412], [-72, 0], {...CLAMP, easing: easeInOut});

  const camY =
    f < 120
      ? interpolate(f, [10, 115], [0, -16], {...CLAMP, easing: easeInOut})
      : f < 288
        ? interpolate(f, [120, 155], [-16, -8], {...CLAMP, easing: easeInOut})
        : f < 310
          ? interpolate(f, [288, 310], [-8, -36], {...CLAMP, easing: easeInOut})
          : f < 378
            ? interpolate(f, [310, 374], [-36, 62], {...CLAMP, easing: easeInOut})
            : f < 415
              ? interpolate(f, [378, 412], [62, 0], {...CLAMP, easing: easeInOut})
              : interpolate(f, [415, 545], [0, -6], {...CLAMP, easing: easeOut});

  // Angin kertas lembut di Beat 4 (rel 475-535)
  const windProgress = interpolate(f, [475, 535], [0, 1], CLAMP);
  const gentleWindPulse = Math.sin(windProgress * Math.PI);
  const scarfSway = Math.sin(f * 0.04) * 1.6 + gentleWindPulse * 7;
  const curtainSway = Math.sin(f * 0.03) * 0.8 + gentleWindPulse * 3.2;

  // Beat 1 (rel 0-120): bangku penonton & pita ukur
  const benchOffsetX = interpolate(f, [118, 142], [0, -520], {...CLAMP, easing: easeInOut});
  const tapeDrop = interpolate(f, [32, 72], [0, 1], {...CLAMP, easing: easeOut});
  const tapeRetract = interpolate(f, [112, 134], [0, 1], {...CLAMP, easing: easeInOut});

  // Beat 2 (rel 141-288): kiri konversi memudar, kanan keranjang terisi
  const set2OffsetX =
    f < 145
      ? interpolate(f, [120, 142], [620, 0], {...CLAMP, easing: easeOut})
      : interpolate(f, [288, 308], [0, -760], {...CLAMP, easing: easeInOut});

  const leftConvOpacity = interpolate(f, [182, 232], [1, 0.2], CLAMP);
  const leftConvSink = interpolate(f, [182, 232], [0, 14], CLAMP);

  const basketSpotProgress = interpolate(f, [202, 226], [0, 1], {...CLAMP, easing: easeOut});
  const basketSpotOpacity =
    f < 285
      ? interpolate(f, [200, 212], [0, 1], CLAMP)
      : interpolate(f, [285, 298], [1, 0], CLAMP);

  const pRice = interpolate(f, [208, 228], [0, 1], {...CLAMP, easing: easeOut});
  const pFuel = interpolate(f, [224, 244], [0, 1], {...CLAMP, easing: easeOut});
  const pHouse = interpolate(f, [240, 260], [0, 1], {...CLAMP, easing: easeOut});
  const pBag = interpolate(f, [256, 276], [0, 1], {...CLAMP, easing: easeOut});

  // Beat 3 (rel 307-378): tiga anak tangga buku polos
  const set3OffsetX =
    f < 312
      ? interpolate(f, [290, 310], [720, 0], {...CLAMP, easing: easeOut})
      : interpolate(f, [380, 404], [0, -760], {...CLAMP, easing: easeInOut});

  // Beat 4 (rel 415-573): toples tabungan & kardus miring
  const set4OffsetX = interpolate(f, [385, 412], [740, 0], {...CLAMP, easing: easeOut});

  const jarSpotProgress = interpolate(f, [415, 438], [0, 1], {...CLAMP, easing: easeOut});
  const jarSpotOpacity = interpolate(f, [415, 426], [0, 1], CLAMP);

  // Koin kecil jatuh satu per satu ke toples (4 koin)
  const coinCues = [420, 434, 448, 462];
  let settledCoins = 0;
  let activeCoinProg = 0;
  for (let i = 0; i < coinCues.length; i++) {
    const start = coinCues[i];
    const end = start + 12;
    if (f >= end) {
      settledCoins += 1;
    } else if (f > start) {
      activeCoinProg = (f - start) / 12;
    }
  }

  const boxTiltProgress = interpolate(f, [482, 532], [0, 1], {...CLAMP, easing: easeInOut});

  // Posisi & pose tokoh "kamu" di seluruh adegan
  let kamuX = 345;
  let kamuY = 570;
  let kamuSeated = true;
  let armRaise = 0;
  let hugProgress = 0;
  let envelopeThickness = 0;
  let hasTool = false;
  let scarfBright = 0;
  let lean = 0;

  if (f < 115) {
    kamuSeated = true;
    kamuX = 345;
    kamuY = 570;
    armRaise = interpolate(f, [58, 76], [0, 0.72], {...CLAMP, easing: easeOut});
    lean = interpolate(f, [58, 76], [0, 3], CLAMP);
  } else if (f < 142) {
    kamuSeated = false;
    kamuX = interpolate(f, [115, 142], [355, 615], {...CLAMP, easing: easeInOut});
    kamuY = FLOOR_Y;
    armRaise = interpolate(f, [115, 128], [0.72, 0.15], CLAMP);
  } else if (f < 292) {
    kamuSeated = false;
    kamuX = 615;
    kamuY = FLOOR_Y;
    armRaise = interpolate(f, [205, 225], [0.15, 0.45], {...CLAMP, easing: easeOut});
    scarfBright = interpolate(f, [215, 235], [0, 1], CLAMP);
    lean = interpolate(f, [205, 225], [0, 4], CLAMP);
  } else if (f < 382) {
    kamuSeated = false;
    hasTool = true;
    scarfBright = 1;
    if (f < 312) {
      kamuX = interpolate(f, [292, 312], [615, 498], {...CLAMP, easing: easeInOut});
      kamuY = FLOOR_Y;
      envelopeThickness = 1;
    } else if (f < 332) {
      kamuX = interpolate(f, [312, 332], [498, 502], {...CLAMP, easing: easeInOut});
      kamuY = interpolate(f, [312, 332], [FLOOR_Y, FLOOR_Y - 58], {...CLAMP, easing: easeOut});
      envelopeThickness = 1;
      armRaise = 0.35;
    } else if (f < 352) {
      kamuX = interpolate(f, [332, 352], [502, 625], {...CLAMP, easing: easeInOut});
      kamuY = interpolate(f, [332, 352], [FLOOR_Y - 58, FLOOR_Y - 116], {...CLAMP, easing: easeOut});
      envelopeThickness = 2;
      armRaise = 0.5;
    } else {
      kamuX = interpolate(f, [352, 372], [625, 745], {...CLAMP, easing: easeInOut});
      kamuY = interpolate(f, [352, 372], [FLOOR_Y - 116, FLOOR_Y - 174], {...CLAMP, easing: easeOut});
      envelopeThickness = 4;
      armRaise = 0.65;
      lean = 3;
    }
  } else if (f < 415) {
    kamuSeated = false;
    kamuX = interpolate(f, [382, 412], [745, 476], {...CLAMP, easing: easeInOut});
    kamuY = interpolate(f, [382, 412], [FLOOR_Y - 174, FLOOR_Y], {...CLAMP, easing: easeInOut});
    envelopeThickness = 0;
    hasTool = false;
    armRaise = 0.1;
  } else {
    kamuSeated = false;
    scarfBright = 1;
    if (f < 474) {
      kamuX = 476;
      kamuY = FLOOR_Y;
      armRaise = interpolate(f, [415, 424], [0.1, 0.62], {...CLAMP, easing: easeOut});
    } else if (f < 530) {
      kamuX = 476;
      kamuY = FLOOR_Y;
      armRaise = interpolate(f, [474, 488], [0.62, 0.18], CLAMP);
    } else {
      kamuX = interpolate(f, [530, 550], [476, 496], {...CLAMP, easing: easeInOut});
      kamuY = FLOOR_Y;
      armRaise = 0;
      hugProgress = interpolate(f, [530, 552], [0, 1], {...CLAMP, easing: easeOut});
      lean = interpolate(f, [530, 552], [0, 3], CLAMP);
    }
  }

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${camX}px, ${camY}px) scale(${camZoom})`,
            transformOrigin: '640px 380px',
          }}
        >
          {/* Lapisan 1: Dinding teater krem hangat, lampu sorot, dan lantai papan kertas */}
          <Slab x={-120} y={-80} w={1520} h={880} color={C.creamHi} r={0} grain={0.55} />
          <div
            style={{
              position: 'absolute',
              inset: -80,
              background:
                'radial-gradient(ellipse at 50% 42%, rgba(255,250,238,0.35) 0%, rgba(0,0,0,0) 52%, rgba(45,30,18,0.28) 100%)',
            }}
          />

          {/* Panel dinding kayu hangat bawah */}
          <Slab x={-120} y={450} w={1520} h={150} color={C.cream} shade={C.creamLo} shadeH={0.12} r={0} />
          <Slab x={-120} y={444} w={1520} h={10} color={C.woodHi} r={0} />

          {/* Lampu sorot kertas kuning madu dari atas */}
          {[360, 640, 920].map((lx, idx) => (
            <div key={idx} style={{position: 'absolute', left: lx - 90, top: 18, width: 180, height: 560}}>
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 56,
                  width: 160,
                  height: 490,
                  background:
                    idx === 1
                      ? 'linear-gradient(180deg, rgba(245,197,66,0.22) 0%, rgba(245,197,66,0.03) 100%)'
                      : 'linear-gradient(180deg, rgba(245,197,66,0.14) 0%, rgba(245,197,66,0.01) 100%)',
                  clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Paper lift={4}>
                <Slab x={87} y={0} w={6} h={28} color={C.inkSoft} r={2} />
                <Slab x={56} y={24} w={68} h={34} color={C.brass} shade={C.brassLo} shadeH={0.25} r="28px 28px 6px 6px" />
              </Paper>
            </div>
          ))}

          {/* Lantai papan panggung kertas dan rel panggung */}
          <Slab x={-120} y={FLOOR_Y} w={1520} h={220} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -120, right: -120, top: FLOOR_Y + 38, height: 3, background: C.floorLo, opacity: 0.8}} />
          <div style={{position: 'absolute', left: -120, right: -120, top: FLOOR_Y + 78, height: 3, background: C.floorLo, opacity: 0.8}} />
          <Slab x={-120} y={FLOOR_Y - 22} w={1520} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          {/* Rel geser panggung */}
          <Slab x={-120} y={FLOOR_Y - 12} w={1520} h={5} color={C.brassLo} r={0} />

          {/* Jangkar warung kopi: meja gelas kopi bertuap & TV kertas layar polos */}
          <WarungCornerAnchor />

          {/* Lapisan 2: Set Beat 1 - Bangku penonton warung & pita ukur kertas tanpa angka */}
          {f < 146 ? (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${benchOffsetX}px)`}}>
              <Paper lift={4}>
                <Slab x={274} y={528} w={142} h={16} color={C.woodHi} shade={C.wood} shadeH={0.3} r={4} />
                <Slab x={294} y={544} w={16} h={FLOOR_Y - 544} color={C.woodLo} r={2} />
                <Slab x={380} y={544} w={16} h={FLOOR_Y - 544} color={C.woodLo} r={2} />
              </Paper>
              <MeasuringTapeProp
                dropProgress={tapeDrop}
                retractProgress={tapeRetract}
                sway={Math.sin(f * 0.04) * 1.4}
              />
            </div>
          ) : null}

          {/* Lapisan 2: Set Beat 2 - Amplop + kalkulator konversi (kiri) vs keranjang belanja (kanan) */}
          {f >= 118 && f <= 310 ? (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${set2OffsetX}px)`}}>
              <SpotlightRing
                cx={835}
                cy={435}
                rx={155}
                ry={148}
                progress={basketSpotProgress}
                opacity={basketSpotOpacity}
              />
              <ConversionLeftGroup x={445} opacity={leftConvOpacity} sinkY={leftConvSink} />
              <ShoppingBasketGroup x={835} itemProgress={[pRice, pFuel, pHouse, pBag]} />
            </div>
          ) : null}

          {/* Lapisan 2: Set Beat 3 - Tiga anak tangga dari buku polos */}
          {f >= 288 && f <= 406 ? <BookStaircaseSet offsetX={set3OffsetX} /> : null}

          {/* Lapisan 2: Set Beat 4 - Toples tabungan & tumpukan kardus tanpa toples */}
          {f >= 384 ? (
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${set4OffsetX}px)`}}>
              <SpotlightRing
                cx={568}
                cy={430}
                rx={96}
                ry={96}
                progress={jarSpotProgress}
                opacity={jarSpotOpacity}
              />
              <SavingsAndBoxesSet
                offsetX={0}
                coinCount={settledCoins}
                fallingCoinProgress={activeCoinProg}
                boxTiltProgress={boxTiltProgress}
              />
            </div>
          ) : null}

          {/* Lapisan 3: Tokoh utama "kamu" tanpa wajah dengan syal terakota */}
          <Boil seed="kamu-d12" amp={0.4} rot={0.05}>
            <KamuFigure
              x={kamuX}
              y={kamuY}
              seated={kamuSeated}
              armRaise={armRaise}
              hugProgress={hugProgress}
              envelopeThickness={envelopeThickness}
              hasTool={hasTool}
              scarfSway={scarfSway}
              scarfBright={scarfBright}
              lean={lean}
            />
          </Boil>

          {/* Angin kertas lembut di Beat 4 */}
          <PaperWindLayer progress={windProgress} />
        </div>

        {/* Lapisan 4: Bingkai tirai teater terakota */}
        <TheaterFrame curtainSway={curtainSway} />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};