// Adegan D09: Siang Hari di Dua Ujung Kota (scene 104-109, durasi 571 frame @30fps).
// Kamera menyusuri jalan dari toko ponsel hangat ke pabrik garmen yang teduh lalu pull-out.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D09_DUR = 571;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const WORLD_W = 2760;
const FLOOR_Y = 590;

const RupiahCoin: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 13}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      backgroundColor: C.sparkYellow,
      border: `2px solid ${C.brassLo}`,
      boxShadow: '1px 2px 3px rgba(0,0,0,0.28)',
    }}
  />
);

const DollarCoin: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 14}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      backgroundColor: '#6D824C',
      border: '2px solid #4A5B32',
      boxShadow: '1px 2px 3px rgba(0,0,0,0.3)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 3,
        borderRadius: '50%',
        border: '1.5px solid #A4B882',
      }}
    />
  </div>
);

const PaperPhone: React.FC<{x: number; y: number; w?: number; h?: number; tilt?: number}> = ({
  x,
  y,
  w = 24,
  h = 44,
  tilt = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      rotate: `${tilt}deg`,
      borderRadius: 5,
      backgroundColor: C.board,
      border: `2px solid ${C.inkSoft}`,
      boxShadow: '2px 3px 5px rgba(0,0,0,0.25)',
      padding: 3,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#DDE7EE',
      }}
    />
  </div>
);

const PaperShirt: React.FC<{
  x: number;
  y: number;
  scale?: number;
  tracing?: boolean;
  opacity?: number;
}> = ({x, y, scale = 1, tracing = false, opacity = 1}) => {
  const w = 96 * scale;
  const h = 86 * scale;
  const fill = tracing ? 'rgba(255, 251, 242, 0.62)' : C.hero;
  const shade = tracing ? 'rgba(218, 210, 196, 0.45)' : C.heroLo;
  const stitch = tracing ? 'rgba(58, 56, 50, 0.55)' : 'rgba(243, 230, 211, 0.6)';

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h,
        width: w,
        height: h,
        opacity,
        filter: tracing ? 'none' : 'drop-shadow(2px 4px 5px rgba(0,0,0,0.28))',
      }}
    >
      {/* Lengan kiri */}
      <div
        style={{
          position: 'absolute',
          left: 2 * scale,
          top: 12 * scale,
          width: 24 * scale,
          height: 34 * scale,
          backgroundColor: shade,
          borderRadius: `${6 * scale}px 0 ${4 * scale}px ${4 * scale}px`,
          rotate: '24deg',
          border: tracing ? `1.5px dashed ${stitch}` : 'none',
        }}
      />
      {/* Lengan kanan */}
      <div
        style={{
          position: 'absolute',
          right: 2 * scale,
          top: 12 * scale,
          width: 24 * scale,
          height: 34 * scale,
          backgroundColor: shade,
          borderRadius: `0 ${6 * scale}px ${4 * scale}px ${4 * scale}px`,
          rotate: '-24deg',
          border: tracing ? `1.5px dashed ${stitch}` : 'none',
        }}
      />
      {/* Badan kemeja */}
      <div
        style={{
          position: 'absolute',
          left: 18 * scale,
          top: 6 * scale,
          width: 60 * scale,
          height: 76 * scale,
          backgroundColor: fill,
          borderRadius: `${8 * scale}px ${8 * scale}px ${4 * scale}px ${4 * scale}px`,
          border: tracing ? `1.5px dashed ${stitch}` : 'none',
        }}
      >
        {/* Kerah kertas */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 22 * scale,
            height: 11 * scale,
            translate: '-50% 0',
            backgroundColor: tracing ? 'rgba(255,255,255,0.7)' : C.creamHi,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />
        {/* Garis jahitan tengah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 12 * scale,
            bottom: 6 * scale,
            width: 0,
            borderLeft: `1.5px dashed ${stitch}`,
          }}
        />
        {/* Jahitan kelim bawah */}
        <div
          style={{
            position: 'absolute',
            left: 5 * scale,
            right: 5 * scale,
            bottom: 7 * scale,
            height: 0,
            borderTop: `1.5px dashed ${stitch}`,
          }}
        />
      </div>
    </div>
  );
};

const HeroKamu: React.FC<{
  x: number;
  y: number;
  walkBob: number;
  smileProgress: number;
  holdingPhone: boolean;
}> = ({x, y, walkBob, smileProgress, holdingPhone}) => {
  const shoulderLift = interpolate(smileProgress, [0, 1], [0, -5], CLAMP);
  const torsoLean = interpolate(smileProgress, [0, 1], [0, 3.5], CLAMP);
  const scarfLift = interpolate(smileProgress, [0, 1], [0, -6], CLAMP);
  const scarfColor = smileProgress > 0.4 ? '#E46A4B' : C.hero;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + walkBob,
        width: 96,
        height: 196,
        translate: '-50% -100%',
        filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.28))',
      }}
    >
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 146,
          width: 22,
          height: 50,
          translate: '-115% 0',
          backgroundColor: C.inkSoft,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 146,
          width: 22,
          height: 50,
          translate: '15% 0',
          backgroundColor: C.inkSoft,
          borderRadius: 6,
        }}
      />
      {/* Badan kemeja krem + postur bahu */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 60 + shoulderLift,
          width: 64,
          height: 88,
          translate: '-50% 0',
          rotate: `${torsoLean}deg`,
          backgroundColor: C.creamHi,
          border: `2px solid ${C.creamLo}`,
          borderRadius: 12,
        }}
      >
        {/* Tali tas selempang */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 4,
            width: 52,
            height: 8,
            backgroundColor: C.wood,
            rotate: '42deg',
            transformOrigin: 'left center',
            borderRadius: 4,
          }}
        />
        {/* Kantong tas selempang kecil */}
        <div
          style={{
            position: 'absolute',
            right: -6,
            top: 44,
            width: 22,
            height: 26,
            backgroundColor: C.woodHi,
            border: `2px solid ${C.woodLo}`,
            borderRadius: 5,
          }}
        />
      </div>
      {/* Lengan kanan memegang ponsel saat dibeli */}
      {holdingPhone ? (
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 74 + shoulderLift,
            width: 34,
            height: 14,
            backgroundColor: C.cream,
            borderRadius: 7,
            rotate: '-22deg',
            transformOrigin: 'left center',
          }}
        >
          <PaperPhone x={26} y={-24} w={16} h={28} tilt={12} />
        </div>
      ) : null}
      {/* Syal kertas terakota panjang */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 54 + shoulderLift,
          width: 58,
          height: 18,
          translate: '-50% 0',
          backgroundColor: scarfColor,
          borderRadius: 9,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 66 + shoulderLift,
          width: 16,
          height: 62,
          backgroundColor: scarfColor,
          borderRadius: '4px 4px 8px 8px',
          rotate: `${6 + scarfLift}deg`,
          transformOrigin: 'top center',
        }}
      />
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: shoulderLift,
          width: 52,
          height: 52,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `3px solid ${C.inkSoft}`,
        }}
      />
    </div>
  );
};

const FactoryWorker: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt?: string;
  armUp?: number;
}> = ({x, y, s = 1, shirt = C.metalLo, armUp = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 88 * s,
      height: 186 * s,
      translate: '-50% -100%',
      filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.28))',
    }}
  >
    {/* Kaki */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 140 * s,
        width: 22 * s,
        height: 46 * s,
        translate: '-115% 0',
        backgroundColor: C.inkSoft,
        borderRadius: 6 * s,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 140 * s,
        width: 22 * s,
        height: 46 * s,
        translate: '15% 0',
        backgroundColor: C.inkSoft,
        borderRadius: 6 * s,
      }}
    />
    {/* Badan */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 58 * s,
        width: 62 * s,
        height: 84 * s,
        translate: '-50% 0',
        backgroundColor: shirt,
        borderRadius: 10 * s,
      }}
    >
      {/* Celemek pekerja pabrik */}
      <div
        style={{
          position: 'absolute',
          left: 10 * s,
          top: 18 * s,
          width: 42 * s,
          height: 64 * s,
          backgroundColor: C.sage,
          border: `${1.5 * s}px solid ${C.sageLo}`,
          borderRadius: `4px 4px ${8 * s}px ${8 * s}px`,
        }}
      />
    </div>
    {/* Lengan mengangkat gagang telepon */}
    {armUp > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: 50 * s,
          top: 72 * s,
          width: 34 * s,
          height: 13 * s,
          backgroundColor: shirt,
          borderRadius: 6 * s,
          rotate: `${interpolate(armUp, [0, 1], [15, -58], CLAMP)}deg`,
          transformOrigin: 'left center',
        }}
      />
    ) : null}
    {/* Kepala bulat polos tanpa wajah */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 50 * s,
        height: 50 * s,
        translate: '-50% 0',
        borderRadius: '50%',
        backgroundColor: C.creamLo,
        border: `${3 * s}px solid ${C.inkSoft}`,
      }}
    />
  </div>
);

const CurtainPanel: React.FC<{side: 'left' | 'right'; x: number; sway: number; opacity?: number}> = ({
  side,
  x,
  sway,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: -420,
      width: 130,
      height: 1580,
      transformOrigin: 'top center',
      rotate: `${side === 'left' ? sway : -sway}deg`,
      opacity,
      filter: 'drop-shadow(4px 0 12px rgba(0,0,0,0.42))',
    }}
  >
    {[0, 32, 64, 96].map((offset, idx) => (
      <div
        key={idx}
        style={{
          position: 'absolute',
          left: offset,
          top: 0,
          width: 36,
          height: '100%',
          backgroundColor: idx % 2 === 0 ? C.hero : C.heroLo,
          borderRight: '1px solid rgba(28,27,23,0.18)',
        }}
      />
    ))}
  </div>
);

export const D09: React.FC = () => {
  const f = useCurrentFrame();

  // --- SINKRONISASI GERAK PER BEAT ---
  // Scene 104 (rel 0-88): "Siang hari, kamu lewat toko ponsel."
  const kamuWalkX = interpolate(f, [0, 88], [230, 650], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const walkCycle = f < 88 ? bob(f, 14, 4, 0) : bob(f, 48, 1.2, 0);

  // Scene 105 (rel 100-157): "Ponsel impor memang lebih murah."
  const priceTagDrop = interpolate(f, [100, 134], [0, 46], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const coinSpend = interpolate(f, [118, 146], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const hasPhone = f >= 136;

  // Scene 106 (rel 172-195): "Kamu tersenyum."
  const smileProgress = interpolate(f, [170, 186], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 107 (rel 213-355): "Tapi di ujung kota yang sama, sebuah pabrik garmen menerima telepon..."
  const phoneRingProgress = interpolate(f, [224, 276], [0, 1], CLAMP);
  const phonePickup = interpolate(f, [268, 304], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 108 (rel 374-400): "Pesanan dikurangi."
  const boxLift1 = interpolate(f, [374, 386], [0, 1], CLAMP);
  const boxLift2 = interpolate(f, [379, 391], [0, 1], CLAMP);
  const boxLift3 = interpolate(f, [384, 396], [0, 1], CLAMP);
  const boxLift4 = interpolate(f, [389, 401], [0, 1], CLAMP);

  // Scene 109 (rel 418-571): "Bukan karena kualitasnya turun, tapi karena harganya, dalam dolar, menjadi terlalu mahal."
  const scaleAppear = interpolate(f, [414, 434], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const kalkirDrop = interpolate(f, [426, 456], [-48, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const kalkirOpacity = interpolate(f, [426, 444], [0, 1], CLAMP);
  const spotlightPulse = interpolate(f, [430, 462], [0, 1], CLAMP);
  const coinStackCount = Math.round(interpolate(f, [462, 512], [2, 9], CLAMP));
  const scaleTiltDeg = interpolate(f, [465, 518], [0, 11], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // --- KAMERA: SATU TRACK HORIZONTAL PANJANG LALU PULL-OUT ---
  const camX =
    f < 88
      ? interpolate(f, [0, 88], [460, 610], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : f < 205
        ? interpolate(f, [88, 205], [610, 635], CLAMP)
        : f < 355
          ? interpolate(f, [205, 355], [635, 1950], {
              ...CLAMP,
              easing: Easing.inOut(Easing.cubic),
            })
          : f < 415
            ? interpolate(f, [355, 415], [1950, 2170], {
                ...CLAMP,
                easing: Easing.inOut(Easing.cubic),
              })
            : f < 505
              ? interpolate(f, [415, 505], [2170, 2320], {
                  ...CLAMP,
                  easing: Easing.out(Easing.cubic),
                })
              : interpolate(f, [505, 558], [2320, WORLD_W / 2], {
                  ...CLAMP,
                  easing: Easing.inOut(Easing.cubic),
                });

  const camZoom =
    f < 505
      ? 1
      : interpolate(f, [505, 558], [1, 1280 / WORLD_W], {
          ...CLAMP,
          easing: Easing.inOut(Easing.cubic),
        });

  const camYOffset =
    f < 505
      ? 0
      : interpolate(f, [505, 558], [0, 165], {
          ...CLAMP,
          easing: Easing.inOut(Easing.cubic),
        });

  const tx = 640 - camX * camZoom;
  const ty = camYOffset;

  // Paralaks lapisan kedalaman
  const bgParallaxX = (camX - 460) * 0.28;
  const smokeBob = bob(f, 34, 4, 0);
  const steamBob = bob(f, 26, 3, 1.2);
  const curtainSway = bob(f, 72, 0.45, 0);

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: WORLD_W,
            height: 720,
            transformOrigin: '0 0',
            transform: `translate(${tx}px, ${ty}px) scale(${camZoom})`,
          }}
        >
          {/* LAPISAN 1: LANGIT SIANG TERIK -> SENJA TEDUH DI UJUNG PABRIK */}
          <div
            style={{
              position: 'absolute',
              left: -200,
              top: -460,
              width: WORLD_W + 400,
              height: FLOOR_Y + 460,
              background:
                'linear-gradient(90deg, #F5E6C4 0%, #EFE0BE 42%, #C9D4DC 72%, #9FB1C4 100%)',
            }}
          />

          {/* Matahari kertas siang hangat di langit kiri */}
          <div
            style={{
              position: 'absolute',
              left: 430 + bgParallaxX * 0.4,
              top: 72,
              width: 96,
              height: 96,
              borderRadius: '50%',
              backgroundColor: C.sparkYellow,
              boxShadow: '0 0 42px rgba(245, 197, 66, 0.55)',
            }}
          />

          {/* Siluet bukit & bangunan jauh (paralaks pelan) */}
          <div
            style={{
              position: 'absolute',
              left: bgParallaxX,
              top: 0,
              width: WORLD_W,
              height: FLOOR_Y,
            }}
          >
            {[
              {x: 160, w: 420, h: 150, color: '#DEC9A6'},
              {x: 520, w: 480, h: 185, color: '#D6C2A3'},
              {x: 960, w: 520, h: 165, color: '#C6C5B4'},
              {x: 1420, w: 560, h: 195, color: '#AEB9C2'},
              {x: 1920, w: 580, h: 175, color: '#9BA8B5'},
            ].map((hill, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: hill.x,
                  top: FLOOR_Y - hill.h,
                  width: hill.w,
                  height: hill.h,
                  backgroundColor: hill.color,
                  borderRadius: '55% 45% 0 0',
                }}
              />
            ))}
          </div>

          {/* Sorot lampu panggung hangat dari atas pada toko ponsel (kiri) */}
          <div
            style={{
              position: 'absolute',
              left: 220,
              top: -320,
              width: 640,
              height: FLOOR_Y + 320,
              background:
                'linear-gradient(180deg, rgba(255,224,138,0.34) 0%, rgba(255,224,138,0.08) 100%)',
              clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* LAPISAN 2: TENGAH — JANGKAR WARUNG (KIRI TEPI PANGGUNG) */}
          <Paper lift={4}>
            {/* Meja kayu kecil warung */}
            <Slab x={135} y={FLOOR_Y - 64} w={86} h={12} color={C.woodHi} r={3} />
            <Slab x={148} y={FLOOR_Y - 52} w={10} h={52} color={C.woodLo} r={2} />
            <Slab x={198} y={FLOOR_Y - 52} w={10} h={52} color={C.woodLo} r={2} />
            {/* Televisi kertas berlayar polos bercahaya */}
            <Slab x={142} y={FLOOR_Y - 102} w={36} h={38} color={C.wood} r={4} />
            <div
              style={{
                position: 'absolute',
                left: 147,
                top: FLOOR_Y - 96,
                width: 26,
                height: 22,
                backgroundColor: '#DCE8F2',
                borderRadius: 2,
                boxShadow: '0 0 10px rgba(220,232,242,0.75)',
              }}
            />
            {/* Gelas kopi kertas + uap tipis */}
            <Slab x={190} y={FLOOR_Y - 84} w={18} h={20} color={C.creamHi} r="2px 2px 4px 4px" />
            <Slab x={188} y={FLOOR_Y - 87} w={22} h={4} color={C.hero} r={2} />
            {[0, 1].map((sIdx) => (
              <div
                key={sIdx}
                style={{
                  position: 'absolute',
                  left: 194 + sIdx * 6,
                  top: FLOOR_Y - 108 - sIdx * 10 + steamBob,
                  width: 4,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.65)',
                }}
              />
            ))}
          </Paper>

          {/* TOKO PONSEL KERTAS (UJUNG KIRI KOTA) */}
          <Boil seed="phone-shop" amp={0.4} rot={0.05}>
            <Paper lift={6}>
              {/* Dinding toko */}
              <Slab
                x={290}
                y={215}
                w={470}
                h={FLOOR_Y - 215}
                color={C.cream}
                shade={C.creamLo}
                shadeH={0.08}
                r="8px 8px 0 0"
              />
              {/* Papan nama toko kosong tanpa teks */}
              <Slab x={340} y={176} w={370} h={44} color={C.wood} r={6} />
              <Slab x={352} y={184} w={346} h={28} color={C.creamHi} r={4} />

              {/* Kanopi bergaris terakota & krem */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: 282 + idx * 61,
                    top: 224,
                    width: 61,
                    height: 36,
                    backgroundColor: idx % 2 === 0 ? C.hero : C.creamHi,
                    borderRadius: '0 0 14px 14px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.18)',
                  }}
                />
              ))}

              {/* Etalase kaca hangat */}
              <div
                style={{
                  position: 'absolute',
                  left: 325,
                  top: 276,
                  width: 315,
                  height: 210,
                  backgroundColor: '#FFF5DC',
                  border: `8px solid ${C.woodHi}`,
                  borderRadius: 8,
                  boxShadow: 'inset 0 0 28px rgba(243,165,59,0.28)',
                }}
              >
                {/* Rak atas etalase: kotak polos & ponsel pipih berlayar polos */}
                <div
                  style={{
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    top: 90,
                    height: 8,
                    backgroundColor: C.wood,
                    borderRadius: 3,
                  }}
                />
                {/* Kotak-kotak polos */}
                <Slab x={24} y={48} w={46} h={42} color={C.tape} r={3} />
                <Slab x={30} y={24} w={38} h={24} color={C.amber} r={3} />
                {/* Ponsel pipih berlayar polos di etalase */}
                <PaperPhone x={96} y={40} w={24} h={46} tilt={-4} />
                <PaperPhone x={136} y={38} w={24} h={48} tilt={2} />
                {!hasPhone ? <PaperPhone x={176} y={40} w={24} h={46} tilt={-2} /> : null}

                {/* Rak bawah etalase */}
                <div
                  style={{
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    top: 174,
                    height: 8,
                    backgroundColor: C.wood,
                    borderRadius: 3,
                  }}
                />
                <Slab x={28} y={132} w={54} h={42} color={C.sage} r={3} />
                <Slab x={92} y={142} w={44} h={32} color={C.tape} r={3} />
                <PaperPhone x={156} y={126} w={24} h={46} tilt={3} />

                {/* Tag harga polos kecil yang turun lebih rendah di scene 105 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 238,
                    top: 0,
                    width: 2,
                    height: 36 + priceTagDrop,
                    backgroundColor: C.inkSoft,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 222,
                    top: 34 + priceTagDrop,
                    width: 34,
                    height: 46,
                    backgroundColor: C.tag,
                    borderRadius: '4px 4px 10px 10px',
                    boxShadow: '1px 3px 5px rgba(0,0,0,0.22)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 6,
                      width: 6,
                      height: 6,
                      translate: '-50% 0',
                      borderRadius: '50%',
                      backgroundColor: C.creamHi,
                    }}
                  />
                </div>
              </div>

              {/* Meja transaksi kecil & koin kuning madu di sisi kanan etalase */}
              <Slab x={662} y={432} w={84} h={158} color={C.woodHi} r="4px 4px 0 0" />
              <Slab x={656} y={424} w={96} h={12} color={C.brass} r={3} />
            </Paper>
          </Boil>

          {/* Dua koin kuning madu: satu membayar ponsel, satu tersisa */}
          <RupiahCoin
            x={interpolate(coinSpend, [0, 1], [676, 636], CLAMP)}
            y={interpolate(coinSpend, [0, 1], [410, 396], CLAMP)}
            r={12}
          />
          <RupiahCoin x={712} y={410} r={12} />

          {/* DERETAN RUMAH KERTAS DI TENGAH JALAN */}
          {[
            {x: 910, w: 165, h: 190, wall: '#E3D3BE', roof: C.heroLo},
            {x: 1115, w: 185, h: 220, wall: '#D7CBB9', roof: C.sageLo},
            {x: 1340, w: 160, h: 180, wall: '#DFD2C0', roof: C.woodHi},
          ].map((house, idx) => (
            <Paper key={idx} lift={5}>
              {/* Atap segitiga kertas */}
              <div
                style={{
                  position: 'absolute',
                  left: house.x - 14,
                  top: FLOOR_Y - house.h - 68,
                  width: house.w + 28,
                  height: 72,
                  backgroundColor: house.roof,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              />
              {/* Dinding rumah */}
              <Slab
                x={house.x}
                y={FLOOR_Y - house.h}
                w={house.w}
                h={house.h}
                color={house.wall}
                r={2}
              />
              {/* Jendela polos */}
              <Slab
                x={house.x + 26}
                y={FLOOR_Y - house.h + 36}
                w={42}
                h={48}
                color="#B8C8D4"
                r={3}
              />
              <Slab
                x={house.x + house.w - 68}
                y={FLOOR_Y - house.h + 36}
                w={42}
                h={48}
                color="#B8C8D4"
                r={3}
              />
              {/* Pintu polos */}
              <Slab
                x={house.x + house.w / 2 - 22}
                y={FLOOR_Y - 76}
                w={44}
                h={76}
                color={C.wood}
                r="4px 4px 0 0"
              />
            </Paper>
          ))}

          {/* Tiang & kabel telepon udara menuju pabrik */}
          <Slab x={1524} y={240} w={10} h={FLOOR_Y - 240} color={C.woodLo} r={2} />
          <Slab x={1506} y={256} w={46} h={6} color={C.woodLo} r={2} />
          <svg
            width={220}
            height={90}
            style={{position: 'absolute', left: 1524, top: 245, overflow: 'visible'}}
          >
            <path
              d="M 5 12 Q 95 48 180 26"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={2.5}
            />
          </svg>

          {/* PABRIK GARMEN DI UJUNG KANAN KOTA (LEBIH TEDUH) */}
          <Boil seed="garment-factory" amp={0.4} rot={0.05}>
            <Paper lift={6}>
              {/* Cerobong asap pabrik */}
              <Slab x={1650} y={135} w={42} h={145} color={C.boardHi} r="4px 4px 0 0" />
              <Slab x={1644} y={130} w={54} h={12} color={C.boardLo} r={3} />
              {/* Kepulan asap kertas lambat */}
              {[0, 1, 2].map((cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    position: 'absolute',
                    left: 1662 + cIdx * 18,
                    top: 96 - cIdx * 22 + smokeBob,
                    width: 24 + cIdx * 8,
                    height: 18 + cIdx * 5,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(218, 224, 230, 0.72)',
                  }}
                />
              ))}

              {/* Atap gigi gergaji pabrik */}
              {[0, 1, 2].map((rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    position: 'absolute',
                    left: 1610 + rIdx * 186,
                    top: 215,
                    width: 190,
                    height: 62,
                    backgroundColor: C.board,
                    clipPath: 'polygon(0% 100%, 28% 0%, 100% 100%)',
                  }}
                />
              ))}

              {/* Badan gedung pabrik garmen */}
              <Slab
                x={1605}
                y={274}
                w={585}
                h={FLOOR_Y - 274}
                color="#B8C0C6"
                shade="#97A1A9"
                shadeH={0.1}
                r="4px 4px 0 0"
              />

              {/* Jendela pabrik atas */}
              {[0, 1, 2, 3].map((wIdx) => (
                <div
                  key={wIdx}
                  style={{
                    position: 'absolute',
                    left: 1640 + wIdx * 135,
                    top: 300,
                    width: 92,
                    height: 46,
                    backgroundColor: '#697B8C',
                    border: `4px solid ${C.boardHi}`,
                    borderRadius: 3,
                  }}
                />
              ))}

              {/* Deretan mesin jahit & pekerja bercelemek di ruang kerja pabrik */}
              <div
                style={{
                  position: 'absolute',
                  left: 1632,
                  top: 374,
                  width: 390,
                  height: 196,
                  backgroundColor: '#8B97A1',
                  border: `5px solid ${C.boardHi}`,
                  borderRadius: 6,
                }}
              >
                {[0, 1].map((mIdx) => (
                  <React.Fragment key={mIdx}>
                    <FactoryWorker
                      x={95 + mIdx * 185}
                      y={192}
                      s={0.82}
                      shirt={mIdx === 0 ? C.cream : C.tape}
                    />
                    {/* Meja & kepala mesin jahit kertas */}
                    <Slab x={34 + mIdx * 185} y={136} w={118} h={10} color={C.woodHi} r={2} />
                    <Slab x={48 + mIdx * 185} y={146} w={10} h={46} color={C.boardLo} r={2} />
                    <Slab x={126 + mIdx * 185} y={146} w={10} h={46} color={C.boardLo} r={2} />
                    <Slab x={56 + mIdx * 185} y={110} w={56} h={16} color={C.creamHi} r={4} />
                    <Slab x={94 + mIdx * 185} y={116} w={18} h={20} color={C.creamHi} r={3} />
                  </React.Fragment>
                ))}
              </div>
            </Paper>
          </Boil>

          {/* MANDOR & TELEPON KERTAS (SCENE 107) */}
          <FactoryWorker
            x={2082}
            y={FLOOR_Y}
            s={0.96}
            shirt={C.creamLo}
            armUp={phonePickup}
          />
          {/* Meja telepon pabrik */}
          <Slab x={2105} y={FLOOR_Y - 88} w={74} h={88} color={C.wood} r="4px 4px 0 0" />
          {/* Badan pesawat telepon kertas */}
          <Slab x={2122} y={FLOOR_Y - 112} w={42} h={24} color={C.boardLo} r={6} />
          {/* Gagang telepon (terangkat ke mandor saat scene 107) */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(phonePickup, [0, 1], [2118, 2096], CLAMP),
              top: interpolate(phonePickup, [0, 1], [FLOOR_Y - 122, FLOOR_Y - 166], CLAMP),
              width: 50,
              height: 12,
              backgroundColor: C.ink,
              borderRadius: 8,
              rotate: `${interpolate(phonePickup, [0, 1], [0, -68], CLAMP)}deg`,
            }}
          />

          {/* Gelombang pita melingkar yang tenang saat telepon berdering */}
          {phoneRingProgress > 0 && phoneRingProgress < 1 ? (
            <svg
              width={160}
              height={160}
              style={{
                position: 'absolute',
                left: 2064,
                top: FLOOR_Y - 192,
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              {[0, 0.33, 0.66].map((offset, rIdx) => {
                const wave = (phoneRingProgress * 2.2 + offset) % 1;
                const radius = 16 + wave * 48;
                const op = interpolate(wave, [0, 0.25, 1], [0, 0.75, 0], CLAMP);
                return (
                  <circle
                    key={rIdx}
                    cx={80}
                    cy={80}
                    r={radius}
                    fill="none"
                    stroke={C.amber}
                    strokeWidth={3}
                    strokeDasharray="10 6"
                    opacity={op}
                  />
                );
              })}
            </svg>
          ) : null}

          {/* Kabel telepon melengkung menjulur keluar bingkai ke kanan (pembeli luar negeri) */}
          <svg
            width={700}
            height={180}
            style={{
              position: 'absolute',
              left: 2158,
              top: FLOOR_Y - 130,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <path
              d="M 0 26 C 95 78, 190 -10, 295 44 C 400 96, 510 12, 680 38"
              fill="none"
              stroke={C.inkSoft}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
          </svg>

          {/* RAK PESANAN PABRIK & PETI YANG DIANGKAT PERGI (SCENE 108) */}
          <Paper lift={5}>
            <Slab x={2228} y={366} w={10} h={FLOOR_Y - 366} color={C.woodLo} r={2} />
            <Slab x={2336} y={366} w={10} h={FLOOR_Y - 366} color={C.woodLo} r={2} />
            {[384, 452, 520].map((shelfY, sIdx) => (
              <Slab key={sIdx} x={2224} y={shelfY} w={126} h={8} color={C.woodHi} r={2} />
            ))}
            {/* Peti pesanan polos di rak: 4 diangkat pergi satu per satu, 1 tersisa */}
            {[
              {x: 2242, y: 344, lift: boxLift1},
              {x: 2292, y: 344, lift: boxLift2},
              {x: 2242, y: 412, lift: boxLift3},
              {x: 2292, y: 412, lift: boxLift4},
              {x: 2242, y: 480, lift: 0},
            ].map((box, bIdx) => {
              const liftY = interpolate(box.lift, [0, 1], [0, -440], CLAMP);
              const boxOp = interpolate(box.lift, [0.65, 1], [1, 0], CLAMP);
              return (
                <div
                  key={bIdx}
                  style={{
                    position: 'absolute',
                    left: box.x,
                    top: box.y + liftY,
                    opacity: boxOp,
                  }}
                >
                  {/* Tali pengangkat tipis saat peti ditarik naik */}
                  {box.lift > 0.01 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 19,
                        top: -220,
                        width: 2,
                        height: 220,
                        backgroundColor: C.inkSoft,
                      }}
                    />
                  ) : null}
                  <Slab x={0} y={0} w={40} h={38} color={C.tape} r={3} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 6,
                      top: 16,
                      width: 28,
                      height: 4,
                      backgroundColor: C.woodHi,
                    }}
                  />
                </div>
              );
            })}
          </Paper>

          {/* TIMBANGAN DUA PIRING & KEMBARAN KALKIR KEMEJA (SCENE 109) */}
          <div
            style={{
              position: 'absolute',
              left: 2350,
              top: 230,
              width: 310,
              height: FLOOR_Y - 230,
              opacity: scaleAppear,
              transform: `translateY(${interpolate(scaleAppear, [0, 1], [36, 0], CLAMP)}px)`,
            }}
          >
            {/* Lingkaran sorot gaya guntingan tangan pada kemeja */}
            <div
              style={{
                position: 'absolute',
                left: 138,
                top: 14,
                width: 158,
                height: 158,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,232,158,0.68) 0%, rgba(255,232,158,0.18) 65%, rgba(255,232,158,0) 100%)',
                border: `2px dashed rgba(200, 155, 74, ${0.45 * spotlightPulse})`,
                opacity: spotlightPulse,
              }}
            />

            {/* Alas & tiang timbangan kertas */}
            <Slab x={95} y={FLOOR_Y - 246} w={120} h={16} color={C.woodLo} r={4} />
            <Slab x={147} y={146} w={16} h={FLOOR_Y - 392} color={C.brassLo} r={4} />
            <div
              style={{
                position: 'absolute',
                left: 155,
                top: 148,
                width: 22,
                height: 22,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: C.brass,
                border: `3px solid ${C.inkSoft}`,
                zIndex: 4,
              }}
            />

            {/* Palang timbangan berputar miring saat koin hijau menumpuk tinggi */}
            <div
              style={{
                position: 'absolute',
                left: 35,
                top: 143,
                width: 240,
                height: 10,
                backgroundColor: C.brass,
                borderRadius: 5,
                transformOrigin: '50% 50%',
                rotate: `${scaleTiltDeg}deg`,
                boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
              }}
            >
              {/* Piring kiri (Kemarin: kemeja sama + sedikit koin hijau) */}
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 5,
                  rotate: `${-scaleTiltDeg}deg`,
                  transformOrigin: 'top center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -1,
                    top: 0,
                    width: 2,
                    height: 62,
                    backgroundColor: C.inkSoft,
                  }}
                />
                <Slab x={-52} y={62} w={104} h={10} color={C.brassLo} r={5} />
                <PaperShirt x={-16} y={62} scale={0.62} />
                {[0, 1].map((cIdx) => (
                  <DollarCoin key={cIdx} x={28} y={53 - cIdx * 10} r={11} />
                ))}
              </div>

              {/* Piring kanan (Hari ini: kembaran kalkir kemeja + tumpukan koin hijau jauh lebih tinggi) */}
              <div
                style={{
                  position: 'absolute',
                  right: 14,
                  top: 5,
                  rotate: `${-scaleTiltDeg}deg`,
                  transformOrigin: 'top center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -1,
                    top: 0,
                    width: 2,
                    height: 62,
                    backgroundColor: C.inkSoft,
                  }}
                />
                <Slab x={-52} y={62} w={104} h={10} color={C.brassLo} r={5} />
                {/* Kemeja asli */}
                <PaperShirt x={-16} y={62} scale={0.62} />
                {/* Kembaran kalkir menumpuk persis di atas kemeja (kualitas tetap sama) */}
                <PaperShirt
                  x={-16}
                  y={62 + kalkirDrop}
                  scale={0.62}
                  tracing
                  opacity={kalkirOpacity}
                />
                {/* Tumpukan koin hijau zaitun bercincin lebih tinggi */}
                {Array.from({length: coinStackCount}).map((_, cIdx) => (
                  <DollarCoin key={cIdx} x={28} y={53 - cIdx * 9} r={11} />
                ))}
              </div>
            </div>
          </div>

          {/* TOKOH UTAMA "KAMU" (SYAL TERAKOTA) */}
          <HeroKamu
            x={kamuWalkX}
            y={FLOOR_Y}
            walkBob={walkCycle}
            smileProgress={smileProgress}
            holdingPhone={hasPhone}
          />

          {/* LANTAI PAPAN KERTAS KREM & JALAN PENGHUBUNG DUA UJUNG KOTA */}
          <Slab x={-200} y={FLOOR_Y} w={WORLD_W + 400} h={620} color={C.floor} r={0} grain={0.6} />
          <Slab
            x={-200}
            y={FLOOR_Y - 18}
            w={WORLD_W + 400}
            h={22}
            color={C.creamLo}
            shade={C.tape}
            shadeH={0.35}
            r={0}
          />
          {/* Marka jalan kertas putus-putus polos penghubung dua ujung kota */}
          {Array.from({length: 26}).map((_, mIdx) => (
            <div
              key={mIdx}
              style={{
                position: 'absolute',
                left: 180 + mIdx * 96,
                top: FLOOR_Y + 34,
                width: 48,
                height: 6,
                borderRadius: 3,
                backgroundColor: C.cream,
                opacity: 0.55,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: -200,
              right: -200,
              top: FLOOR_Y + 76,
              height: 4,
              backgroundColor: C.floorLo,
              opacity: 0.85,
            }}
          />

          {/* TIRAI TEATER TERAKOTA DI KEDUA SISI PANGGUNG */}
          {/* QA Clover: tirai kanan memudar f470-500 — tanpanya ia menutupi separuh tumpukan koin hijau timbangan di Beat 5; muncul lagi saat pull-out. */}
          <CurtainPanel side="left" x={-10} sway={curtainSway} />
          <CurtainPanel
            side="right"
            x={WORLD_W - 120}
            sway={curtainSway}
            opacity={
              f < 505
                ? interpolate(f, [470, 500], [1, 0], CLAMP)
                : interpolate(f, [505, 535], [0, 1], CLAMP)
            }
          />
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};