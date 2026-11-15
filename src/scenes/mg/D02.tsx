// Adegan D02: "Bukan Ramalan, Andai-andaian" — panggung teater kertas warung kopi memperkenalkan bingkai putus-putus.
// Menutup bola kristal ramalan, menampilkan pengamat berteropong, lalu membingkai panggung dan gelembung percobaan pikiran.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D02_DUR = 448;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR_Y = 596;

const WarungCoffeeCorner: React.FC<{frame: number}> = ({frame}) => {
  return (
    <div style={{position: 'absolute', left: 96, top: FLOOR_Y, width: 110, height: 120}}>
      <Paper lift={4}>
        {/* Meja kecil tepi panggung */}
        <Slab x={18} y={-54} w={10} h={54} color={C.woodLo} r={3} />
        <Slab x={64} y={-54} w={10} h={54} color={C.woodLo} r={3} />
        <Slab x={6} y={-64} w={80} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={5} />
        {/* Gelas kopi kertas polos */}
        <Slab
          x={28}
          y={-106}
          w={36}
          h={42}
          color={C.creamHi}
          shade={C.creamLo}
          shadeH={0.22}
          r="3px 3px 8px 8px"
        />
        <Slab x={26} y={-94} w={40} h={14} color={C.tape} r={2} />
        <Slab x={24} y={-112} w={44} h={8} color={C.cream} r={4} />
      </Paper>
      {/* Uap kopi tipis */}
      {[0, 1, 2].map((i) => {
        const cycle = ((frame + i * 26) % 78) / 78;
        const dy = interpolate(cycle, [0, 1], [0, -54], CLAMP);
        const dx = Math.sin((frame + i * 19) * 0.06) * 5;
        const op = interpolate(cycle, [0, 0.22, 0.78, 1], [0, 0.55, 0.45, 0], CLAMP);
        return (
          <svg
            key={i}
            width={24}
            height={44}
            viewBox="0 0 24 44"
            style={{
              position: 'absolute',
              left: 34 + i * 7 + dx,
              top: -152 + dy,
              opacity: op,
              pointerEvents: 'none',
            }}
          >
            <path
              d="M12 40 C6 30, 18 20, 11 10 C8 5, 13 2, 13 2"
              fill="none"
              stroke={C.creamHi}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </div>
  );
};

const KamuCharacter: React.FC<{
  x: number;
  y: number;
  frame: number;
  lookUp: number;
}> = ({x, y, frame, lookUp}) => {
  const breathe = bob(frame, 88, 2.2, 0.4);
  const scarfWave = Math.sin(frame * 0.055) * 3.5;
  const headTilt = interpolate(lookUp, [0, 1], [0, -14], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 110,
        height: 215,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={6}>
        {/* Kaki */}
        <Slab x={34} y={156} w={18} h={59} color={C.inkSoft} r={6} />
        <Slab x={58} y={156} w={18} h={59} color={C.inkSoft} r={6} />

        {/* Badan: kemeja krem */}
        <div
          style={{
            position: 'absolute',
            left: 25,
            top: 66 + breathe * 0.5,
            width: 60,
            height: 94,
            borderRadius: 14,
            backgroundColor: C.creamHi,
            border: `2px solid ${C.creamLo}`,
            overflow: 'hidden',
          }}
        >
          {/* Tali tas selempang */}
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: 34,
              width: 86,
              height: 9,
              backgroundColor: C.wood,
              rotate: '34deg',
            }}
          />
        </div>

        {/* Tas selempang kecil */}
        <Slab
          x={68}
          y={114 + breathe * 0.5}
          w={28}
          h={32}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.28}
          r={7}
          rot={-4}
        />
        <Slab x={70} y={114 + breathe * 0.5} w={24} h={11} color={C.woodHi} r={4} rot={-4} />

        {/* Syal kertas terakota panjang */}
        <Slab
          x={26}
          y={62 + breathe * 0.6}
          w={58}
          h={20}
          color={C.hero}
          shade={C.heroLo}
          shadeH={0.3}
          r={10}
        />
        {/* Ujung menjuntai syal terakota */}
        <Slab
          x={26}
          y={76 + breathe * 0.6}
          w={18}
          h={76}
          color={C.hero}
          shade={C.heroLo}
          shadeH={0.22}
          r={6}
          rot={4 + scarfWave * 0.5}
        />
        <Slab
          x={40}
          y={78 + breathe * 0.6}
          w={16}
          h={62}
          color={C.tag}
          shade={C.heroLo}
          shadeH={0.25}
          r={5}
          rot={-3 - scarfWave * 0.4}
        />

        {/* Kepala bulat polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: 29,
            top: 4 + breathe,
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
            rotate: `${headTilt}deg`,
          }}
        />
      </Paper>
    </div>
  );
};

const ObserverFigure: React.FC<{
  x: number;
  y: number;
  tone: string;
  lowerProgress: number;
  frame: number;
  phase: number;
}> = ({x, y, tone, lowerProgress, frame, phase}) => {
  const idle = bob(frame, 95, 1.8, phase);
  const armAngle = interpolate(lowerProgress, [0, 1], [-48, 22], CLAMP);
  const headAngle = interpolate(lowerProgress, [0, 1], [-18, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96,
        height: 196,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={5}>
        {/* Kaki */}
        <Slab x={28} y={144} w={17} h={52} color={C.inkSoft} r={5} />
        <Slab x={51} y={144} w={17} h={52} color={C.inkSoft} r={5} />

        {/* Badan siluet netral */}
        <Slab x={21} y={62 + idle * 0.5} w={54} h={86} color={tone} r={12} />

        {/* Kepala bulat polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 4 + idle,
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `2.5px solid ${C.inkSoft}`,
            rotate: `${headAngle}deg`,
          }}
        />

        {/* Lengan & teropong kertas */}
        <div
          style={{
            position: 'absolute',
            left: 48,
            top: 74 + idle * 0.5,
            width: 54,
            height: 26,
            transformOrigin: '6px 10px',
            rotate: `${armAngle}deg`,
          }}
        >
          <Slab x={0} y={4} w={34} h={12} color={tone} r={6} />
          {/* Teropong kertas polos tanpa angka */}
          <Slab
            x={26}
            y={-2}
            w={28}
            h={11}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.35}
            r={3}
          />
          <Slab
            x={26}
            y={10}
            w={28}
            h={11}
            color={C.woodHi}
            shade={C.woodLo}
            shadeH={0.35}
            r={3}
          />
        </div>
      </Paper>
    </div>
  );
};

const CrystalBallProp: React.FC<{
  x: number;
  y: number;
  coverProgress: number;
  frame: number;
}> = ({x, y, coverProgress, frame}) => {
  const glowOpacity = interpolate(coverProgress, [0, 0.75], [0.75, 0], CLAMP);
  const clothTop = interpolate(coverProgress, [0, 1], [-220, -142], CLAMP);
  const clothScaleY = interpolate(coverProgress, [0, 0.25, 1], [0.2, 0.85, 1], CLAMP);
  const clothOpacity = interpolate(coverProgress, [0, 0.12], [0, 1], CLAMP);
  const pulse = 0.92 + Math.sin(frame * 0.08) * 0.08;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 150, height: 170, translate: '-50% -100%'}}>
      {/* Pendar lembut bola kristal sebelum ditutup */}
      <div
        style={{
          position: 'absolute',
          left: 15,
          top: 4,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,197,66,0.45) 0%, rgba(245,197,66,0) 72%)',
          opacity: glowOpacity * pulse,
          pointerEvents: 'none',
        }}
      />
      <Paper lift={5}>
        {/* Meja bundar kecil */}
        <Slab x={67} y={102} w={16} h={62} color={C.woodLo} r={4} />
        <Slab x={42} y={158} w={66} h={12} color={C.wood} r={5} />
        <Slab x={22} y={92} w={106} h={14} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={6} />

        {/* Dudukan bola kristal */}
        <Slab x={47} y={76} w={56} h={18} color={C.brass} shade={C.brassLo} shadeH={0.35} r={6} />

        {/* Bola kristal kertas */}
        <div
          style={{
            position: 'absolute',
            left: 41,
            top: 14,
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 32%, #F6E9C8 0%, #9BB7C9 60%, #58728C 100%)',
            border: `2.5px solid ${C.creamHi}`,
          }}
        />

        {/* Sehelai kain kertas turun menutup bola kristal */}
        <div
          style={{
            position: 'absolute',
            left: 29,
            top: 162 + clothTop,
            width: 92,
            height: 82,
            opacity: clothOpacity,
            transformOrigin: '50% 0%',
            transform: `scaleY(${clothScaleY})`,
          }}
        >
          <svg width={92} height={82} viewBox="0 0 92 82" style={{overflow: 'visible'}}>
            <path
              d="M16 14 C16 2, 76 2, 76 14 L86 72 C76 78, 66 68, 56 75 C46 80, 36 69, 26 75 C16 80, 10 74, 6 72 Z"
              fill={C.cream}
              stroke={C.creamLo}
              strokeWidth={2}
            />
            <path
              d="M32 16 L28 68 M58 16 L62 68"
              stroke={C.creamLo}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </Paper>
    </div>
  );
};

export const D02: React.FC = () => {
  const f = useCurrentFrame();

  // Beat 1 (scene 022, rel 0-58): tirai terbuka lebih lebar, lampu sorot turun
  const curtainOpen = interpolate(f, [0, 44], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const spotDrop = interpolate(f, [4, 40], [-140, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const spotLightOp = interpolate(f, [10, 42], [0.25, 0.85], CLAMP);

  // Beat 2 (scene 023, rel 75-105): kain menutup bola kristal + papan "BUKAN RAMALAN"
  const clothCover = interpolate(f, [62, 84], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const board1Enter = interpolate(f, [66, 78], [-190, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const board1Exit = interpolate(f, [192, 210], [0, -210], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const board1Op =
    interpolate(f, [66, 73], [0, 1], CLAMP) * interpolate(f, [198, 210], [1, 0], CLAMP);

  // Beat 3 (scene 024, rel 123-205): barisan pengamat berteropong masuk, menurunkan teropong satu per satu
  const observersIn = interpolate(f, [114, 130], [-240, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const observersOut = interpolate(f, [205, 220], [0, -320], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const observersOp =
    interpolate(f, [114, 124], [0, 1], CLAMP) * interpolate(f, [206, 220], [1, 0], CLAMP);

  // Beat 4 (scene 025, rel 223-262): garis putus-putus menggambar bingkai panggung + papan "ANDAI-ANDAIAN"
  const frameDraw = interpolate(f, [215, 248], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const board2Enter = interpolate(f, [217, 227], [-150, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const board2Exit = interpolate(f, [263, 274], [0, -160], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const board2Op =
    interpolate(f, [217, 222], [0, 1], CLAMP) * interpolate(f, [264, 274], [1, 0], CLAMP);

  // Beat 5 (scene 026, rel 279-448): gelembung pikiran putus-putus + "PERCOBAAN PIKIRAN" + 3 benda
  const bubbleRise = interpolate(f, [275, 298], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const kamuLookUp = interpolate(f, [275, 296], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerak kamera tenang & terbaca: dolly-in awal, pan menyusur pengamat di beat 3, dolly-in ke gelembung di beat 5
  const camZoom1 = interpolate(f, [0, 58], [1.0, 1.035], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const camZoom2 = interpolate(f, [278, 422], [0, 0.045], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const camScale = camZoom1 + camZoom2;

  const camPanXBeat3 = interpolate(f, [122, 165, 206, 222], [0, -34, -34, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const camPanXBeat5 = interpolate(f, [278, 422], [0, -28], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const camPanYBeat5 = interpolate(f, [278, 422], [0, 14], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const camX = camPanXBeat3 + camPanXBeat5;
  const camY = camPanYBeat5;

  // Posisi "Kamu" dan meja bola kristal bergeser lembut agar komposisi tiap beat lapang
  const kamuX = interpolate(f, [114, 128, 206, 220], [990, 1065, 1065, 345], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const crystalX = interpolate(f, [114, 128, 206, 220], [500, 275, 275, 215], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Tirai kiri & kanan membuka lebih lebar
  const leftCurtainX = interpolate(curtainOpen, [0, 1], [-12, -62], CLAMP);
  const rightCurtainX = interpolate(curtainOpen, [0, 1], [12, 62], CLAMP);

  // Panjang keliling bingkai putus-putus panggung: 2 * (920 + 496) = 2832
  const stagePerimeter = 2832;
  const dashOffset = stagePerimeter * (1 - frameDraw);

  const observerSpecs = [
    {x: 455, tone: ROOM.sage, lowerAt: 138, phase: 0.2},
    {x: 605, tone: ROOM.khaki, lowerAt: 153, phase: 1.1},
    {x: 755, tone: ROOM.slate, lowerAt: 168, phase: 2.0},
    {x: 905, tone: ROOM.purple, lowerAt: 183, phase: 2.9},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#2B3B52'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* Lapisan 1: Latar biru senja + cahaya hangat */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 0.35}px, ${camY * 0.35}px) scale(${1 + (camScale - 1) * 0.45})`,
            transformOrigin: '54% 46%',
          }}
        >
          <Slab x={-40} y={-40} w={1360} h={780} color={ROOM.dusk} shade="#384B66" shadeH={0.55} r={0} grain={0.5} />
          {/* Pendar cahaya hangat di tengah panggung */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 52% 45%, rgba(255, 224, 150, 0.28) 0%, rgba(245, 197, 66, 0.08) 44%, rgba(20, 28, 44, 0.46) 100%)',
            }}
          />
          {/* Kerucut lampu sorot kuning madu dari atas */}
          <div
            style={{
              position: 'absolute',
              left: 240,
              top: 40,
              width: 800,
              height: 570,
              opacity: spotLightOp,
              background:
                'linear-gradient(180deg, rgba(255, 224, 138, 0.34) 0%, rgba(255, 224, 138, 0.14) 65%, rgba(255, 224, 138, 0.02) 100%)',
              clipPath: 'polygon(41% 0%, 59% 0%, 96% 100%, 4% 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Lingkaran sorot gaya guntingan tangan */}
          <div
            style={{
              position: 'absolute',
              left: 330,
              top: 155,
              width: 620,
              height: 410,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 232, 175, 0.12)',
              border: '2px dashed rgba(245, 197, 66, 0.24)',
              opacity: spotLightOp,
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>

        {/* Lapisan 2: Lantai papan kertas krem + properti panggung + tokoh */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
            transformOrigin: '54% 46%',
          }}
        >
          {/* Lantai papan kertas krem */}
          <Slab x={-60} y={FLOOR_Y} w={1400} h={160} color={C.cream} shade={C.creamLo} shadeH={0.45} r={0} grain={0.55} />
          <Slab x={-60} y={FLOOR_Y - 12} w={1400} h={14} color={C.tape} shade={C.creamLo} shadeH={0.35} r={0} />
          {[22, 54, 88].map((dy, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: -60,
                right: -60,
                top: FLOOR_Y + dy,
                height: 2,
                backgroundColor: C.creamLo,
                opacity: 0.75,
              }}
            />
          ))}

          {/* Kap lampu sorot kuning madu turun dari atas */}
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 52 + spotDrop,
              translate: '-50% 0',
              width: 120,
              height: 92,
            }}
          >
            <Paper lift={6}>
              <Slab x={56} y={-80} w={8} h={92} color={C.inkSoft} r={2} />
              <Slab
                x={24}
                y={10}
                w={72}
                h={46}
                color={C.amber}
                shade={C.amberDim}
                shadeH={0.28}
                r="34px 34px 6px 6px"
              />
              <Slab x={34} y={50} w={52} h={12} color={C.sparkYellow} r={6} />
            </Paper>
          </div>

          {/* Jangkar warung di tepi panggung: gelas kopi kertas dengan uap tipis */}
          <WarungCoffeeCorner frame={f} />

          {/* Bola kristal di atas meja kecil, ditutup kain kertas pada Beat 2 */}
          <CrystalBallProp x={crystalX} y={FLOOR_Y} coverProgress={clothCover} frame={f} />

          {/* Beat 3: Barisan siluet pengamat kecil dengan teropong kertas */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${observersIn + observersOut}px)`,
              opacity: observersOp,
              pointerEvents: 'none',
            }}
          >
            {observerSpecs.map((obs, idx) => {
              const lower = interpolate(f, [obs.lowerAt, obs.lowerAt + 14], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <ObserverFigure
                  key={idx}
                  x={obs.x}
                  y={FLOOR_Y}
                  tone={obs.tone}
                  lowerProgress={lower}
                  frame={f}
                  phase={obs.phase}
                />
              );
            })}
          </div>

          {/* Tokoh utama "kamu": kemeja krem, tas selempang kecil, syal terakota panjang */}
          <KamuCharacter x={kamuX} y={FLOOR_Y} frame={f} lookUp={kamuLookUp} />

          {/* Beat 4: Garis putus-putus menggambar dirinya mengelilingi seluruh panggung */}
          {frameDraw > 0 ? (
            <svg
              width={1280}
              height={720}
              viewBox="0 0 1280 720"
              style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
            >
              <rect
                x={180}
                y={114}
                width={920}
                height={496}
                rx={18}
                fill="none"
                stroke={C.ink}
                strokeOpacity={0.28}
                strokeWidth={8}
                strokeDasharray="22 14"
                strokeDashoffset={dashOffset}
                transform="translate(2 4)"
              />
              <rect
                x={180}
                y={114}
                width={920}
                height={496}
                rx={18}
                fill="none"
                stroke={C.sparkYellow}
                strokeWidth={5}
                strokeDasharray="22 14"
                strokeDashoffset={dashOffset}
              />
            </svg>
          ) : null}

          {/* Papan gantung Beat 2: "BUKAN RAMALAN" */}
          {/* QA Clover: pola Tag mgkit — div papan absolute langsung di dalam Boil TANPA Paper (Paper inset:0 membuat wrapper menciut 0-lebar dan teks meluber ke kanan). */}
          {board1Op > 0.01 ? (
            <Boil seed="bukan-ramalan" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: 124 + board1Enter + board1Exit,
                  translate: '-50% 0',
                  opacity: board1Op,
                  padding: '16px 34px',
                  backgroundColor: C.creamHi,
                  borderRadius: 10,
                  border: `3px solid ${C.wood}`,
                  filter: 'url(#rough) drop-shadow(4px 8px 16px rgba(0,0,0,0.38))',
                }}
              >
                <div style={{position: 'absolute', left: 26, top: -90, width: 4, height: 90, backgroundColor: C.tape}} />
                <div style={{position: 'absolute', right: 26, top: -90, width: 4, height: 90, backgroundColor: C.tape}} />
                <div
                  style={{
                    fontFamily: FONT.banner,
                    fontSize: 38,
                    color: C.ink,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.05,
                  }}
                >
                  BUKAN RAMALAN
                </div>
              </div>
            </Boil>
          ) : null}

          {/* Papan Beat 4 di atas bingkai putus-putus: "ANDAI-ANDAIAN" */}
          {/* QA Clover: sama seperti papan 1 — pola Tag mgkit, tanpa Paper. */}
          {board2Op > 0.01 ? (
            <Boil seed="andai-andaian" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: 86 + board2Enter + board2Exit,
                  translate: '-50% 0',
                  opacity: board2Op,
                  padding: '14px 34px',
                  backgroundColor: C.creamHi,
                  borderRadius: 12,
                  border: `4px dashed ${C.hero}`,
                  filter: 'url(#rough) drop-shadow(4px 8px 16px rgba(0,0,0,0.38))',
                }}
              >
                <div
                  style={{
                    fontFamily: FONT.banner,
                    fontSize: 38,
                    color: C.ink,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.05,
                  }}
                >
                  ANDAI-ANDAIAN
                </div>
              </div>
            </Boil>
          ) : null}

          {/* Beat 5: Gelembung pikiran putus-putus besar naik di atas kepala "kamu" */}
          {bubbleRise > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: interpolate(bubbleRise, [0, 0.25], [0, 1], CLAMP),
                pointerEvents: 'none',
              }}
            >
              {/* Lingkaran jejak pikiran putus-putus */}
              <div
                style={{
                  position: 'absolute',
                  left: 418,
                  top: 392,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(232, 223, 211, 0.92)',
                  border: `3px dashed ${C.hero}`,
                  transform: `scale(${interpolate(bubbleRise, [0, 0.45], [0.2, 1], CLAMP)})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 454,
                  top: 356,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(232, 223, 211, 0.94)',
                  border: `3px dashed ${C.hero}`,
                  transform: `scale(${interpolate(bubbleRise, [0.15, 0.65], [0.2, 1], CLAMP)})`,
                }}
              />

              {/* Badan utama gelembung pikiran putus-putus */}
              <div
                style={{
                  position: 'absolute',
                  left: 760,
                  top: 344,
                  width: 560,
                  height: 294,
                  translate: '-50% -50%',
                  transform: `scale(${interpolate(bubbleRise, [0.2, 1], [0.78, 1], CLAMP)}) translateY(${interpolate(bubbleRise, [0, 1], [28, 0], CLAMP)}px)`,
                }}
              >
                <Paper lift={9}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 48,
                      backgroundColor: C.creamHi,
                      border: `4px dashed ${C.hero}`,
                      position: 'relative',
                    }}
                  >
                    {/* Label tepi gelembung pikiran: "PERCOBAAN PIKIRAN" */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: -26,
                        translate: '-50% 0',
                        backgroundColor: C.cream,
                        border: `3px dashed ${C.hero}`,
                        borderRadius: 12,
                        padding: '10px 26px',
                        fontFamily: FONT.banner,
                        fontSize: 30,
                        color: C.ink,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.05,
                      }}
                    >
                      PERCOBAAN PIKIRAN
                    </div>

                    {/* 1. Koin kuning madu polos ("tentang uang", rel 318) */}
                    <PopIn at={316}>
                      <Boil seed="koin-uang" amp={0.4} rot={0.05}>
                        <div style={{position: 'absolute', left: 54, top: 82, width: 120, height: 120}}>
                          <div
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              backgroundColor: C.amber,
                              border: `5px solid ${C.brassLo}`,
                              boxShadow: '0 6px 10px rgba(0,0,0,0.22)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: 88,
                                height: 88,
                                borderRadius: '50%',
                                border: `3px solid ${C.sparkYellow}`,
                              }}
                            />
                          </div>
                        </div>
                      </Boil>
                    </PopIn>

                    {/* 2. Tag harga polos tanpa teks/angka ("tentang harga", rel 352) */}
                    <PopIn at={350}>
                      <Boil seed="tag-harga" amp={0.4} rot={0.05}>
                        <div style={{position: 'absolute', left: 222, top: 72, width: 116, height: 140}}>
                          <svg width={116} height={140} viewBox="0 0 116 140" style={{overflow: 'visible'}}>
                            {/* Tali gantung tag */}
                            <path
                              d="M58 2 C58 -14, 72 -18, 66 18"
                              fill="none"
                              stroke={C.wood}
                              strokeWidth={3.5}
                              strokeLinecap="round"
                            />
                            {/* Badan tag harga kertas polos */}
                            <path
                              d="M34 18 L82 18 L100 42 L100 128 C100 133, 96 136, 91 136 L25 136 C20 136, 16 133, 16 128 L16 42 Z"
                              fill={C.tag}
                              stroke={C.heroLo}
                              strokeWidth={3}
                            />
                            {/* Lubang cincin tag */}
                            <circle cx={58} cy={34} r={7} fill={C.creamHi} stroke={C.woodLo} strokeWidth={2.5} />
                            {/* Garis lipatan kertas polos tanpa tulisan */}
                            <rect x={30} y={64} width={56} height={8} rx={4} fill={C.cream} opacity={0.85} />
                            <rect x={30} y={84} width={40} height={8} rx={4} fill={C.cream} opacity={0.65} />
                          </svg>
                        </div>
                      </Boil>
                    </PopIn>

                    {/* 3. Mahkota kecil ("tentang apa artinya kaya", rel 388) */}
                    <PopIn at={386}>
                      <Boil seed="mahkota-kaya" amp={0.4} rot={0.05}>
                        <div style={{position: 'absolute', left: 382, top: 82, width: 132, height: 118}}>
                          <svg width={132} height={118} viewBox="0 0 132 118" style={{overflow: 'visible'}}>
                            {/* Mahkota kertas tiga puncak */}
                            <path
                              d="M14 96 L8 34 L42 62 L66 20 L90 62 L124 34 L118 96 Z"
                              fill={C.sparkYellow}
                              stroke={C.brassLo}
                              strokeWidth={3.5}
                              strokeLinejoin="round"
                            />
                            {/* Pita dasar mahkota */}
                            <rect
                              x={14}
                              y={84}
                              width={104}
                              height={18}
                              rx={6}
                              fill={C.amber}
                              stroke={C.brassLo}
                              strokeWidth={3}
                            />
                            {/* Tiga mutiara kertas polos */}
                            <circle cx={8} cy={30} r={6} fill={C.creamHi} stroke={C.brassLo} strokeWidth={2} />
                            <circle cx={66} cy={16} r={7} fill={C.creamHi} stroke={C.brassLo} strokeWidth={2} />
                            <circle cx={124} cy={30} r={6} fill={C.creamHi} stroke={C.brassLo} strokeWidth={2} />
                          </svg>
                        </div>
                      </Boil>
                    </PopIn>
                  </div>
                </Paper>
              </div>
            </div>
          ) : null}
        </AbsoluteFill>

        {/* Lapisan 3: Tirai teater terakota di kedua sisi & lengkung atas panggung */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 1.15}px, ${camY * 1.15}px) scale(${1 + (camScale - 1) * 1.15})`,
            transformOrigin: '54% 46%',
            pointerEvents: 'none',
          }}
        >
          {/* Tirai kiri */}
          <div
            style={{
              position: 'absolute',
              left: leftCurtainX,
              top: -20,
              width: 170,
              height: 760,
            }}
          >
            <Paper lift={10}>
              <Slab x={0} y={0} w={170} h={760} color={ROOM.terracotta} shade="#72311E" shadeH={0.2} r={0} />
              {[28, 72, 116].map((lx, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: lx,
                    top: 0,
                    bottom: 0,
                    width: 14,
                    backgroundColor: '#7A3520',
                    opacity: 0.45,
                  }}
                />
              ))}
              {/* Tali pengikat tirai */}
              <Slab x={112} y={340} w={54} h={16} color={C.amber} shade={C.amberDim} shadeH={0.35} r={8} rot={-12} />
            </Paper>
          </div>

          {/* Tirai kanan */}
          <div
            style={{
              position: 'absolute',
              right: -rightCurtainX,
              top: -20,
              width: 170,
              height: 760,
            }}
          >
            <Paper lift={10}>
              <Slab x={0} y={0} w={170} h={760} color={ROOM.terracotta} shade="#72311E" shadeH={0.2} r={0} />
              {[40, 84, 128].map((lx, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: lx,
                    top: 0,
                    bottom: 0,
                    width: 14,
                    backgroundColor: '#7A3520',
                    opacity: 0.45,
                  }}
                />
              ))}
              {/* Tali pengikat tirai */}
              <Slab x={4} y={340} w={54} h={16} color={C.amber} shade={C.amberDim} shadeH={0.35} r={8} rot={12} />
            </Paper>
          </div>

          {/* Lengkung tirai atas (valance) */}
          <Paper lift={12}>
            <Slab x={-40} y={-24} w={1360} h={74} color="#8B3D27" shade="#662918" shadeH={0.35} r={0} />
            <Slab x={-40} y={44} w={1360} h={10} color={C.brass} r={0} />
          </Paper>
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};