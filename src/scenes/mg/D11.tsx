// Adegan MG D11: Dua Indonesia berdampingan selama sepuluh tahun di panggung teater kertas warung kopi.
// Kiri diam dengan kurs andaian Rp1.000 per dolar, kanan bertumbuh efisien hingga lencana koin berkilau mengikuti di belakang.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {FLOOR_Y, Figure} from './mgkit';

export const D11_DUR = 841;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const STAGE_FLOOR = FLOOR_Y - 6;

const DashedCard: React.FC<{
  x: number;
  y: number;
  text: string;
  enterAt: number;
  exitAt?: number;
  bg?: string;
  color?: string;
  borderColor?: string;
  size?: number;
  rot?: number;
  seed?: string;
  hangHeight?: number;
}> = ({
  x,
  y,
  text,
  enterAt,
  exitAt,
  bg = '#F6EFE2',
  color = C.ink,
  borderColor = '#9A5A42',
  size = 28,
  rot = 0,
  seed = 'card',
  hangHeight = 120,
}) => {
  const f = useCurrentFrame();
  const enterP = interpolate(f, [enterAt, enterAt + 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exitP =
    exitAt !== undefined
      ? interpolate(f, [exitAt, exitAt + 14], [0, 1], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  const visible = enterP > 0.01 && exitP < 0.99;
  if (!visible) return null;

  const dy = (1 - enterP) * -42 + exitP * -54;
  const opacity = Math.min(enterP * 1.4, 1 - exitP);
  const cardW = Math.ceil(text.length * size * 0.72) + 60;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + dy,
        width: cardW,
        translate: '-50% 0',
        opacity,
        zIndex: 28,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: -hangHeight,
          width: 2,
          height: hangHeight + 4,
          background: 'rgba(58, 56, 50, 0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '70%',
          top: -hangHeight,
          width: 2,
          height: hangHeight + 4,
          background: 'rgba(58, 56, 50, 0.45)',
        }}
      />
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            rotate: `${rot}deg`,
            backgroundColor: bg,
            border: `3.5px dashed ${borderColor}`,
            borderRadius: 10,
            padding: '12px 24px 13px',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.05,
            color,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(28, 27, 23, 0.22)',
          }}
        >
          {text}
        </div>
      </Boil>
    </div>
  );
};

const PaperGear: React.FC<{
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  angle: number;
  color?: string;
  hubColor?: string;
}> = ({cx, cy, r, teeth, angle, color = C.brass, hubColor = C.creamHi}) => {
  const toothW = Math.max(6, Math.round((2 * Math.PI * r) / (teeth * 2.3)));
  const toothH = Math.max(6, Math.round(r * 0.28));
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        translate: '-50% -50%',
        rotate: `${angle}deg`,
      }}
    >
      {Array.from({length: teeth}).map((_, i) => {
        const deg = (i * 360) / teeth;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: toothW,
              height: r + toothH,
              translate: '-50% -100%',
              transformOrigin: '50% 100%',
              rotate: `${deg}deg`,
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: color,
          border: `2px solid ${C.brassLo}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: r * 0.72,
          height: r * 0.72,
          translate: '-50% -50%',
          borderRadius: '50%',
          backgroundColor: hubColor,
          border: `2px solid ${C.brassLo}`,
        }}
      />
    </div>
  );
};

const CoinStack: React.FC<{
  x: number;
  yBase: number;
  count: number;
  progress: number;
}> = ({x, yBase, count, progress}) => {
  if (progress <= 0.01) return null;
  const shown = Math.max(1, Math.round(count * progress));
  return (
    <div style={{position: 'absolute', left: x, top: yBase, translate: '-50% 0'}}>
      {Array.from({length: shown}).map((_, i) => {
        const coinY = -(i + 1) * 11;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: coinY,
              width: 44,
              height: 14,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.sparkYellow,
              border: `2px solid ${C.brassLo}`,
              boxShadow: '0 2px 3px rgba(0,0,0,0.22)',
            }}
          />
        );
      })}
    </div>
  );
};

const WarungAnchors: React.FC<{frame: number}> = ({frame}) => {
  const scarfSway = Math.sin(frame / 28) * 1.4;
  return (
    <>
      {/* Jangkar kiri: bangku warung, gelas kopi kertas bertuap tipis, dan syal terakota */}
      <div style={{position: 'absolute', left: 96, top: STAGE_FLOOR, zIndex: 24}}>
        <Paper lift={5}>
          {/* Syal kertas terakota menggantung di tepi panggung */}
          <div
            style={{
              position: 'absolute',
              left: -18,
              top: -66,
              transformOrigin: '50% 0%',
              rotate: `${scarfSway}deg`,
            }}
          >
            <Slab x={0} y={0} w={22} h={64} color="#C9573C" shade="#9A3F2A" shadeH={0.18} r={4} />
            <Slab x={10} y={6} w={18} h={56} color="#D67354" shade="#A9553B" shadeH={0.15} r={4} rot={4} />
            {[2, 8, 14].map((fx) => (
              <div
                key={fx}
                style={{
                  position: 'absolute',
                  left: fx,
                  top: 62,
                  width: 3,
                  height: 9,
                  backgroundColor: '#9A3F2A',
                  borderRadius: 1,
                }}
              />
            ))}
          </div>

          {/* Meja kecil warung */}
          <Slab x={-8} y={-64} w={74} h={12} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
          <Slab x={2} y={-52} w={10} h={52} color={C.wood} r={2} />
          <Slab x={46} y={-52} w={10} h={52} color={C.wood} r={2} />

          {/* Gelas kopi kertas polos */}
          <Slab x={18} y={-94} w={24} h={30} color={C.creamHi} shade={C.creamLo} shadeH={0.25} r="2px 2px 5px 5px" />
          <Slab x={15} y={-98} w={30} h={6} color="#C9573C" r={3} />
        </Paper>

        {/* Uap kopi kertas tipis */}
        {[0, 1, 2].map((idx) => {
          const cycle = ((frame + idx * 32) % 96) / 96;
          const steamY = -106 - cycle * 36;
          const steamX = 27 + Math.sin(cycle * Math.PI * 2 + idx) * 5;
          const steamOp = Math.sin(cycle * Math.PI) * 0.45;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: steamX,
                top: steamY,
                width: 6,
                height: 14,
                borderRadius: '50%',
                borderLeft: '2.5px solid rgba(255, 250, 240, 0.85)',
                opacity: steamOp,
              }}
            />
          );
        })}
      </div>

      {/* Jangkar kanan: televisi kertas berlayar polos bercahaya */}
      <div style={{position: 'absolute', left: 1122, top: STAGE_FLOOR, zIndex: 24}}>
        <Paper lift={5}>
          <Slab x={0} y={-46} w={68} h={10} color={C.woodHi} shade={C.woodLo} shadeH={0.3} r={3} />
          <Slab x={8} y={-36} w={9} h={36} color={C.wood} r={2} />
          <Slab x={51} y={-36} w={9} h={36} color={C.wood} r={2} />
          {/* Antena kertas polos */}
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: -112,
              width: 3,
              height: 24,
              backgroundColor: C.inkSoft,
              rotate: '-24deg',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 38,
              top: -112,
              width: 3,
              height: 24,
              backgroundColor: C.inkSoft,
              rotate: '24deg',
            }}
          />
          {/* Bodi TV kertas */}
          <Slab x={4} y={-92} w={60} h={46} color={C.wood} shade={C.woodLo} shadeH={0.2} r={7} />
          {/* Layar TV polos bercahaya tanpa teks/angka */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: -86,
              width: 38,
              height: 34,
              borderRadius: 5,
              background: 'radial-gradient(circle at 45% 40%, #FFF7DC 0%, #F3D999 100%)',
              boxShadow: '0 0 18px rgba(255, 232, 165, 0.55)',
            }}
          />
          {/* Dua kenop bulat polos */}
          <div
            style={{
              position: 'absolute',
              left: 53,
              top: -81,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: C.brass,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 53,
              top: -69,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: C.brass,
            }}
          />
        </Paper>
      </div>
    </>
  );
};

const TheatreCurtains: React.FC = () => (
  <>
    {/* Tirai kiri berlapis */}
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 92, zIndex: 22, pointerEvents: 'none'}}>
      <Slab x={-12} y={0} w={96} h={720} color="#7D4130" r={0} grain={0.5} />
      <Slab x={-8} y={0} w={68} h={720} color="#9A523D" shade="#733A2A" shadeH={0.14} r="0 0 28px 0" />
      <Slab x={-6} y={0} w={38} h={720} color="#B4624A" r="0 0 22px 0" />
    </div>
    {/* Tirai kanan berlapis */}
    <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 92, zIndex: 22, pointerEvents: 'none'}}>
      <Slab x={8} y={0} w={96} h={720} color="#7D4130" r={0} grain={0.5} />
      <Slab x={32} y={0} w={68} h={720} color="#9A523D" shade="#733A2A" shadeH={0.14} r="0 0 0 28px" />
      <Slab x={60} y={0} w={38} h={720} color="#B4624A" r="0 0 0 22px" />
    </div>
    {/* Pelmet atas panggung */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 34, zIndex: 23, pointerEvents: 'none'}}>
      <Slab x={0} y={0} w={1280} h={28} color="#8B4835" shade="#663223" shadeH={0.35} r={0} />
    </div>
  </>
);

const LeftDiorama: React.FC<{
  frame: number;
  slideIn: number;
  dimLeft: number;
  coinProgress: number;
}> = ({frame, slideIn, dimLeft, coinProgress}) => {
  // Sorotan bergiliran di Scene 132 (rel 195-335) saat pabrik, sekolah, dan keterampilan disebut
  const spotFactory =
    interpolate(frame, [192, 202], [0, 1], CLAMP) *
    interpolate(frame, [232, 242], [1, 0], CLAMP);
  const spotSchool =
    interpolate(frame, [238, 248], [0, 1], CLAMP) *
    interpolate(frame, [280, 290], [1, 0], CLAMP);
  const spotTools =
    interpolate(frame, [286, 296], [0, 1], CLAMP) *
    interpolate(frame, [328, 338], [1, 0], CLAMP);

  const offsetX = (1 - slideIn) * -140;
  const opacity = interpolate(slideIn, [0, 0.4], [0, 1], CLAMP) * (1 - dimLeft * 0.16);

  return (
    <div
      style={{
        position: 'absolute',
        left: 162 + offsetX,
        top: 196,
        width: 446,
        height: 378,
        opacity,
        zIndex: 12,
      }}
    >
      {/* Bingkai putus-putus tanda andaian */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          border: '3.5px dashed rgba(154, 90, 66, 0.72)',
          backgroundColor: 'rgba(255, 250, 240, 0.24)',
        }}
      />

      {/* Lingkaran sorot gaya guntingan tangan saat tiap ikon disebut */}
      {[
        {cx: 86, op: spotFactory},
        {cx: 214, op: spotSchool},
        {cx: 334, op: spotTools},
      ].map((s, idx) =>
        s.op > 0.01 ? (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: s.cx,
              top: 235,
              width: 126,
              height: 126,
              translate: '-50% -50%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 224, 130, 0.55) 0%, rgba(255, 224, 130, 0.12) 70%, transparent 100%)',
              border: '2.5px dashed rgba(200, 155, 74, 0.75)',
              opacity: s.op,
            }}
          />
        ) : null,
      )}

      <Paper lift={5}>
        {/* Rel sejajar bawah diorama */}
        <Slab x={16} y={348} w={414} h={10} color={C.woodLo} r={3} />
        {Array.from({length: 11}).map((_, i) => (
          <Slab key={i} x={28 + i * 37} y={356} w={18} h={7} color={C.inkSoft} r={2} />
        ))}

        {/* Pulau kertas berlapis (tetap rendah & tenang) */}
        <Slab x={24} y={306} w={398} h={42} color={C.sageLo} r="28px 34px 8px 8px" />
        <Slab x={38} y={316} w={370} h={32} color={C.sage} shade={C.sageLo} shadeH={0.22} r="22px 26px 6px 6px" />

        {/* 1. Pabrik kecil bercerobong (DIAM / SAMA) */}
        <div style={{position: 'absolute', left: 42, top: 218}}>
          <Slab x={12} y={0} w={14} h={42} color={C.inkSoft} r={2} />
          <Slab x={10} y={-4} w={18} h={6} color={C.woodLo} r={2} />
          {/* Atap gergaji pabrik */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 26,
              width: 86,
              height: 20,
              backgroundColor: '#A8644B',
              clipPath: 'polygon(0% 100%, 0% 25%, 33% 100%, 33% 25%, 66% 100%, 66% 25%, 100% 100%)',
            }}
          />
          <Slab x={0} y={44} w={86} h={46} color={C.cream} shade={C.creamLo} shadeH={0.2} r={4} />
          {[12, 36, 60].map((wx) => (
            <Slab key={wx} x={wx} y={54} w={14} h={16} color={ROOM.slate} r={2} />
          ))}
        </div>

        {/* 2. Gedung sekolah dengan tiang bendera polos & lonceng (DIAM / SAMA) */}
        <div style={{position: 'absolute', left: 164, top: 202}}>
          {/* Tiang bendera polos */}
          <Slab x={48} y={-8} w={4} h={44} color={C.inkSoft} r={2} />
          <Slab x={52} y={-4} w={22} h={14} color="#C9573C" r={2} />
          {/* Lonceng kertas kecil di puncak atap */}
          <Slab x={43} y={24} w={14} h={12} color={C.brass} r="7px 7px 2px 2px" />
          {/* Atap segitiga sekolah */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 34,
              width: 92,
              height: 26,
              backgroundColor: '#9A5A42',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <Slab x={10} y={58} w={80} h={48} color="#EFE5D4" shade={C.creamLo} shadeH={0.2} r={4} />
          <Slab x={40} y={76} w={20} h={30} color={C.wood} r="8px 8px 0 0" />
          <Slab x={20} y={68} w={13} h={16} color={ROOM.slate} r={2} />
          <Slab x={67} y={68} w={13} h={16} color={ROOM.slate} r={2} />
        </div>

        {/* 3. Perkakas dan gerigi kecil (DIAM, TIDAK BERPUTAR = SAMA) */}
        <div style={{position: 'absolute', left: 294, top: 236}}>
          {/* Kotak meja kerja polos */}
          <Slab x={8} y={44} w={68} h={28} color={C.woodHi} shade={C.woodLo} shadeH={0.3} r={4} />
          {/* Kunci pas kertas miring diam */}
          <div style={{position: 'absolute', left: 16, top: 14, rotate: '-28deg'}}>
            <Slab x={0} y={6} w={36} h={8} color={C.metal} shade={C.metalLo} shadeH={0.3} r={3} />
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: 1,
                width: 16,
                height: 18,
                borderRadius: '50%',
                backgroundColor: C.metal,
                border: `2px solid ${C.metalLo}`,
              }}
            />
          </div>
          {/* Gerigi kecil diam (angle = 0 selalu) */}
          <PaperGear cx={56} cy={26} r={16} teeth={8} angle={0} color={C.metal} hubColor={C.creamHi} />
        </div>
      </Paper>

      {/* Tumpukan koin kuning madu rendah di sisi kanan pulau kiri (Scene 135) */}
      <CoinStack x={400} yBase={312} count={3} progress={coinProgress} />
    </div>
  );
};

const RightDiorama: React.FC<{
  frame: number;
  slideIn: number;
  coinProgress: number;
}> = ({frame, slideIn, coinProgress}) => {
  // Pertumbuhan pabrik di Scene 133 (rel 415-485)
  const factoryGrow = interpolate(frame, [415, 485], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerigi berputar halus mulai Scene 133 (rel 415 -> akhir)
  const gearSpinActive = interpolate(frame, [412, 435], [0, 1], CLAMP);
  const gearAngle = Math.max(0, frame - 412) * 1.15 * gearSpinActive;

  // Tumpukan buku polos & sosok pekerja naik tingkat demi tingkat (rel 475-548)
  const skillClimb = interpolate(frame, [475, 548], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Sorotan keterampilan di Scene 133 akhir
  const spotSkill =
    interpolate(frame, [476, 488], [0, 1], CLAMP) *
    interpolate(frame, [542, 554], [1, 0], CLAMP);

  // Beat 5 (Scene 136, rel 723-815): gerigi menarik gerbong kecil berisikan lencana koin berkilau
  const towProgress = interpolate(frame, [723, 814], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const offsetX = (1 - slideIn) * 140;
  const opacity = interpolate(slideIn, [0, 0.4], [0, 1], CLAMP);
  const extraFactoryH = Math.round(factoryGrow * 34);
  const islandRise = Math.round(factoryGrow * 8);

  // Posisi gerbong yang ditarik oleh gerigi pabrik (mengikuti dari belakang)
  const cartX = 334 - towProgress * 18;
  const badgePop = interpolate(towProgress, [0.15, 0.85], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 672 + offsetX,
        top: 196,
        width: 446,
        height: 378,
        opacity,
        zIndex: 12,
      }}
    >
      {/* Bingkai putus-putus tanda andaian */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 18,
          border: '3.5px dashed rgba(154, 90, 66, 0.72)',
          backgroundColor: 'rgba(255, 250, 240, 0.28)',
        }}
      />

      {/* Lingkaran sorot saat keterampilan meningkat (Scene 133) */}
      {spotSkill > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 226,
            top: 215,
            width: 136,
            height: 156,
            translate: '-50% -50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 224, 130, 0.52) 0%, rgba(255, 224, 130, 0.1) 70%, transparent 100%)',
            border: '2.5px dashed rgba(200, 155, 74, 0.75)',
            opacity: spotSkill,
          }}
        />
      ) : null}

      <Paper lift={5}>
        {/* Rel sejajar bawah diorama */}
        <Slab x={16} y={348} w={414} h={10} color={C.woodLo} r={3} />
        {Array.from({length: 11}).map((_, i) => (
          <Slab key={i} x={28 + i * 37} y={356} w={18} h={7} color={C.inkSoft} r={2} />
        ))}

        {/* Pulau kertas berlapis (bertambah sedikit lapisan hijaunya saat tumbuh) */}
        <Slab x={24} y={306 - islandRise} w={398} h={42 + islandRise} color={C.sageLo} r="28px 34px 8px 8px" />
        <Slab
          x={38}
          y={316 - Math.round(islandRise * 0.6)}
          w={370}
          h={32 + Math.round(islandRise * 0.6)}
          color="#7D9676"
          shade={C.sageLo}
          shadeH={0.22}
          r="22px 26px 6px 6px"
        />

        {/* 1. Pabrik kanan yang makin tinggi & efisien dengan gerigi berputar */}
        <div style={{position: 'absolute', left: 32, top: 218 - extraFactoryH - islandRise}}>
          {/* Cerobong ganda lebih tinggi */}
          <Slab x={12} y={-8} w={14} h={48} color={C.inkSoft} r={2} />
          <Slab x={34} y={-2} w={12} h={42} color={C.inkSoft} r={2} />
          {/* Atap gergaji pabrik */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 26,
              width: 96,
              height: 22,
              backgroundColor: '#C9573C',
              clipPath: 'polygon(0% 100%, 0% 25%, 33% 100%, 33% 25%, 66% 100%, 66% 25%, 100% 100%)',
            }}
          />
          <Slab x={0} y={46} w={96} h={46 + extraFactoryH} color="#F7EFE1" shade={C.creamLo} shadeH={0.18} r={4} />
          {/* Jendela pabrik menyala hangat */}
          {[14, 41, 68].map((wx) => (
            <React.Fragment key={wx}>
              <Slab x={wx} y={56} w={14} h={16} color={factoryGrow > 0.2 ? '#F6C65B' : ROOM.slate} r={2} />
              {extraFactoryH > 14 ? (
                <Slab x={wx} y={80} w={14} h={16} color="#F6C65B" r={2} />
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {/* Dua gerigi pabrik berputar halus (efisien) */}
        <PaperGear
          cx={146}
          cy={262 - islandRise}
          r={22}
          teeth={10}
          angle={gearAngle}
          color={C.brass}
          hubColor={C.creamHi}
        />
        <PaperGear
          cx={176}
          cy={284 - islandRise}
          r={15}
          teeth={8}
          angle={-gearAngle * 1.25 + 14}
          color="#C9573C"
          hubColor={C.creamHi}
        />

        {/* 2. Tumpukan buku polos (tanpa teks) + pekerja kertas menaiki tingkat demi tingkat */}
        <div style={{position: 'absolute', left: 196, top: 308 - islandRise}}>
          {[
            {w: 62, h: 12, color: '#9A5A42', at: 0.05},
            {w: 56, h: 12, color: '#5D7896', at: 0.25},
            {w: 50, h: 12, color: '#C89B4A', at: 0.48},
            {w: 44, h: 12, color: '#7E8C78', at: 0.72},
          ].map((bk, idx) => {
            const p = interpolate(skillClimb, [bk.at, Math.min(1, bk.at + 0.22)], [0, 1], CLAMP);
            if (p <= 0.01) return null;
            const by = -(idx + 1) * 13;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: (62 - bk.w) / 2,
                  top: by + (1 - p) * 10,
                  opacity: p,
                }}
              >
                <Slab x={0} y={0} w={bk.w} h={bk.h} color={bk.color} shade="rgba(0,0,0,0.18)" shadeH={0.25} r={3} />
                <Slab x={4} y={2} w={bk.w - 8} h={3} color={C.creamHi} r={1} />
              </div>
            );
          })}

          {/* Sosok pekerja tanpa wajah menaiki tumpukan buku */}
          <div
            style={{
              position: 'absolute',
              left: 31,
              top: -Math.round(skillClimb * 50),
            }}
          >
            <Figure x={0} y={0} s={0.44} shirt={C.cream} />
            {/* Celemek pekerja */}
            <div
              style={{
                position: 'absolute',
                left: -9,
                top: -54,
                width: 18,
                height: 28,
                backgroundColor: '#5D7896',
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* 3. Tumpukan koin kuning madu tinggi di kanan (Scene 135: "Yang kedua") */}
        <CoinStack x={292} yBase={312 - islandRise} count={8} progress={coinProgress} />

        {/* 4. Tali/batang penarik dari gerigi pabrik ke gerbong paling belakang (Scene 136) */}
        <div
          style={{
            position: 'absolute',
            left: 184,
            top: 292 - islandRise,
            width: Math.max(120, cartX - 184),
            height: 4,
            backgroundColor: C.woodLo,
            borderRadius: 2,
          }}
        />
        {/* Panah kertas polos kecil dari arah gerigi menuju gerbong */}
        {towProgress > 0.05 ? (
          <div
            style={{
              position: 'absolute',
              left: 255,
              top: 286 - islandRise,
              width: 16,
              height: 16,
              backgroundColor: C.tag,
              clipPath: 'polygon(0% 25%, 55% 25%, 55% 0%, 100% 50%, 55% 100%, 55% 75%, 0% 75%)',
              opacity: interpolate(towProgress, [0.05, 0.25], [0, 1], CLAMP),
            }}
          />
        ) : null}

        {/* Gerbong kecil paling belakang membawa lencana koin berkilau (tanpa tulisan) */}
        <div style={{position: 'absolute', left: cartX, top: 274 - islandRise}}>
          {/* Lencana koin berkilau berdiri di atas gerbong */}
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: -32 + (1 - badgePop) * 14,
              translate: '-50% 0',
              scale: `${0.75 + badgePop * 0.25}`,
            }}
          >
            {/* Sinar kilau lembut di belakang lencana */}
            {towProgress > 0.2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 58,
                  height: 58,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 197, 66, 0.72) 0%, transparent 72%)',
                  opacity: interpolate(towProgress, [0.2, 0.6], [0, 1], CLAMP),
                }}
              />
            ) : null}
            {/* Pita lencana terakota */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 26,
                width: 8,
                height: 14,
                backgroundColor: '#C9573C',
                rotate: '12deg',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 20,
                top: 26,
                width: 8,
                height: 14,
                backgroundColor: '#C9573C',
                rotate: '-12deg',
              }}
            />
            {/* Cakram lencana koin kuning madu polos */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: C.sparkYellow,
                border: `3px solid ${C.brassLo}`,
                boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px dashed ${C.brassLo}`,
                }}
              />
            </div>
          </div>

          {/* Bak gerbong kertas */}
          <Slab x={4} y={6} w={60} h={22} color="#9A5A42" shade="#733A2A" shadeH={0.25} r={4} />
          <Slab x={0} y={2} w={68} h={6} color={C.woodHi} r={3} />
          {/* Roda gerbong berputar halus */}
          <PaperGear cx={18} cy={31} r={7} teeth={6} angle={gearAngle * 0.8} color={C.inkSoft} hubColor={C.cream} />
          <PaperGear cx={50} cy={31} r={7} teeth={6} angle={gearAngle * 0.8} color={C.inkSoft} hubColor={C.cream} />
        </div>
      </Paper>
    </div>
  );
};

export const D11: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1: diorama kiri dan kanan masuk berdampingan (Scene 131, rel 0-118)
  const islandSlideIn = interpolate(frame, [8, 42], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 4: lampu sorot mulai di kiri (rel 577), ragu, bergeser ke kanan pada "yang kedua" (rel 679)
  const verdictBeamOpacity = interpolate(frame, [575, 590], [0, 1], CLAMP);
  const beamRightFactor = interpolate(frame, [612, 679], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const beamCenterX = interpolate(beamRightFactor, [0, 1], [385, 895]);
  const dimLeft = interpolate(frame, [650, 682], [0, 1], CLAMP);

  // Beat 4 (Scene 135, rel 679-705): tumpukan koin kuning madu muncul di kedua sisi
  const coinProgress = interpolate(frame, [679, 708], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerak kamera tenang mengikuti alur beat dan berhenti penuh pada pose akhir (rel 815-841)
  const camZoom = interpolate(
    frame,
    [0, 118, 138, 335, 551, 585, 720, 815, 841],
    [1.0, 1.04, 1.04, 1.09, 1.1, 1.03, 1.05, 0.98, 0.98],
    CLAMP,
  );
  const camPanX = interpolate(
    frame,
    [0, 138, 335, 375, 551, 585, 720, 815, 841],
    [0, 0, 74, -74, -80, 0, -16, 0, 0],
    CLAMP,
  );
  const camPanY = interpolate(
    frame,
    [0, 118, 335, 551, 585, 720, 815, 841],
    [0, -6, -14, -16, -6, -8, 0, 0],
    CLAMP,
  );

  // Nuansa cahaya sedikit menghangat di akhir saat pose akhir ditahan
  const warmFinaleGlow = interpolate(frame, [679, 730], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* Lapisan latar belakang & panggung utama */}
        <AbsoluteFill
          style={{
            transformOrigin: '640px 360px',
            transform: `translate(${camPanX}px, ${camPanY}px) scale(${camZoom})`,
          }}
        >
          {/* Dinding kertas krem hangat */}
          <Slab x={-60} y={-40} w={1400} h={800} color={C.creamHi} r={0} grain={0.55} />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 38%, rgba(255, 245, 214, 0.36) 0%, rgba(0, 0, 0, 0) 52%, rgba(28, 27, 23, 0.24) 100%)',
            }}
          />

          {/* Lampu sorot panggung kuning madu dari atas */}
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 26,
              width: 980,
              height: 560,
              translate: '-50% 0',
              background: `linear-gradient(180deg, rgba(255, 224, 140, ${0.22 + warmFinaleGlow * 0.1}) 0%, rgba(255, 224, 140, 0) 100%)`,
              clipPath: 'polygon(26% 0%, 74% 0%, 100% 100%, 0% 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Sorotan pertanyaan & jawaban (Beat 4: kiri -> ragu -> kanan pada "Yang kedua") */}
          {verdictBeamOpacity > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: beamCenterX,
                top: 28,
                width: 480,
                height: 556,
                translate: '-50% 0',
                opacity: verdictBeamOpacity,
                background:
                  'linear-gradient(180deg, rgba(245, 197, 66, 0.34) 0%, rgba(245, 197, 66, 0.14) 75%, rgba(245, 197, 66, 0) 100%)',
                clipPath: 'polygon(36% 0%, 64% 0%, 96% 100%, 4% 100%)',
                pointerEvents: 'none',
                zIndex: 8,
              }}
            />
          ) : null}

          {/* Lantai papan kertas teater */}
          <Slab x={-60} y={STAGE_FLOOR} w={1400} h={760 - STAGE_FLOOR} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -60, right: -60, top: STAGE_FLOOR + 34, height: 3, background: C.floorLo, opacity: 0.8}} />
          <div style={{position: 'absolute', left: -60, right: -60, top: STAGE_FLOOR + 72, height: 3, background: C.floorLo, opacity: 0.8}} />
          <Slab x={-60} y={STAGE_FLOOR - 20} w={1400} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

          {/* Garis pembelah panggung tengah (halus, memisahkan dua rel diorama) */}
          <PopIn at={10}>
            <div
              style={{
                position: 'absolute',
                left: 639,
                top: 196,
                width: 2,
                height: 376,
                borderLeft: '2.5px dashed rgba(154, 90, 66, 0.38)',
              }}
            />
          </PopIn>

          {/* Dua diorama pulau kertas berdampingan */}
          <LeftDiorama
            frame={frame}
            slideIn={islandSlideIn}
            dimLeft={dimLeft}
            coinProgress={coinProgress}
          />
          <RightDiorama
            frame={frame}
            slideIn={islandSlideIn}
            coinProgress={coinProgress}
          />

          {/* Daftar teks yang diizinkan (semua berbingkai PUTUS-PUTUS) */}
          <DashedCard
            x={640}
            y={48}
            text="BAYANGKAN"
            enterAt={0}
            exitAt={120}
            size={34}
            rot={-0.6}
            seed="d11-bayangkan"
            hangHeight={60}
          />
          <DashedCard
            x={640}
            y={264}
            text="10 TAHUN"
            enterAt={80}
            exitAt={120}
            size={24}
            rot={0.8}
            seed="d11-10tahun"
            hangHeight={270}
          />
          <DashedCard
            x={385}
            y={122}
            text="Rp1.000 PER DOLAR"
            enterAt={140}
            size={26}
            rot={-0.5}
            seed="d11-kurs-kiri"
            hangHeight={130}
          />
          <DashedCard
            x={895}
            y={122}
            text="BELASAN RIBU"
            enterAt={368}
            size={26}
            rot={0.5}
            seed="d11-kurs-kanan"
            hangHeight={130}
          />

          {/* Penanda dunia teater warung kopi: tirai & jangkar warung */}
          <TheatreCurtains />
          <WarungAnchors frame={frame} />
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};