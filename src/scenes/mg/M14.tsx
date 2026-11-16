// Adegan M14 (Scene 121-126, 433,14-451,65 dtk): Penonton tanpa wajah duduk tenang di depan layar kertas
// sambil memasang tiga perisai pertanyaan di dada hingga umpan tag "gratis" gagal menempel dan talinya meluncur turun.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Plant, Shelf} from '../../lib/paper/sets';

export const M14_DUR = 556;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type ShieldSpec = {
  text: string;
  at: number;
  y: number;
  w: number;
  accent: string;
  seed: string;
};

const SHIELDS: readonly ShieldSpec[] = [
  {
    text: 'siapa yang membayar',
    at: 169,
    y: 278,
    w: 280,
    accent: ROOM.navy,
    seed: 'm14-s1',
  },
  {
    text: 'apa yang dikorbankan',
    at: 219,
    y: 336,
    w: 288,
    accent: ROOM.teal,
    seed: 'm14-s2',
  },
  {
    text: 'siapa yang memastikan mutu',
    at: 285,
    y: 394,
    w: 336,
    accent: C.go,
    seed: 'm14-s3',
  },
];

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.42}}>
      <Plant x={36} y={392} s={0.72} />
    </div>
    <div style={{opacity: 0.44}}>
      <Shelf x={1020} y={258} w={215} books={4} />
    </div>
  </AbsoluteFill>
);

/* Layar kertas berlapis di sisi kiri panggung yang ditonton oleh figur penonton */
const PaperScreenProp: React.FC = () => {
  const f = useCurrentFrame();
  const enterP = interpolate(f, [0, 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerak halus gelombang bentuk kertas abstrak di dalam layar (tanpa kata/angka)
  const waveShift = Math.sin(f * 0.06) * 8;
  const pulseR = 34 + Math.sin(f * 0.08) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        left: 142,
        top: 212,
        width: 348,
        height: FLOOR_Y - 212,
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 36}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Kaki penyangga layar kayu */}
      <Paper lift={5}>
        <Slab x={156} y={242} w={24} h={134} color={C.woodLo} r={4} />
        <Slab
          x={96}
          y={372}
          w={144}
          h={16}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.35}
          r={5}
        />
      </Paper>

      {/* Bingkai luar layar kertas */}
      <Paper lift={7}>
        <Slab
          x={14}
          y={10}
          w={308}
          h={236}
          color={C.board}
          shade={C.boardLo}
          shadeH={0.2}
          r={14}
        />
        {/* Bidang layar kertas hangat */}
        <Slab
          x={28}
          y={24}
          w={280}
          h={208}
          color={C.screenHi}
          shade={C.screen}
          shadeH={0.25}
          r={8}
        />
      </Paper>

      {/* Ilustrasi siluet lapisan kertas abstrak di dalam layar */}
      <div
        style={{
          position: 'absolute',
          left: 36,
          top: 32,
          width: 264,
          height: 192,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {/* Pendar cahaya lembut dari layar */}
        <div
          style={{
            position: 'absolute',
            left: 52 + waveShift,
            top: 36,
            width: pulseR * 2,
            height: pulseR * 2,
            borderRadius: '50%',
            backgroundColor: C.amber,
            opacity: 0.78,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -14 - waveShift * 0.6,
            bottom: -18,
            width: 190,
            height: 92,
            borderRadius: '60px 80px 0 0',
            backgroundColor: ROOM.slate,
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -18 + waveShift * 0.6,
            bottom: -22,
            width: 185,
            height: 78,
            borderRadius: '80px 50px 0 0',
            backgroundColor: ROOM.teal,
            opacity: 0.9,
          }}
        />
      </div>

      {/* Cahaya pantul lembut dari layar ke arah penonton */}
      <div
        style={{
          position: 'absolute',
          left: 320,
          top: 24,
          width: 240,
          height: 220,
          background:
            'linear-gradient(90deg, rgba(243,165,59,0.16) 0%, rgba(243,165,59,0) 100%)',
          clipPath: 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 90%)',
        }}
      />
    </div>
  );
};

/* Kursi santai & figur penonton tanpa wajah yang duduk tegak, terbuka, dan tenang */
const CalmViewerSeated: React.FC = () => {
  const f = useCurrentFrame();

  const enterP = interpolate(f, [4, 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerak napas tenang dan stabil (postur tetap tegak, tidak curiga, tidak menutup diri)
  const calmBreathY = Math.sin(f * 0.08) * 1.4;
  const calmGlow = interpolate(f, [372, 405], [0, 1], CLAMP);

  const chairX = 682;
  const viewerCx = 774;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 32}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Aura hangat tenang di belakang penonton saat tiga pertanyaan terpasang */}
      {calmGlow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 165,
            top: 175,
            width: 330,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,232,168,0.42) 0%, rgba(255,232,168,0) 72%)',
            opacity: calmGlow,
          }}
        />
      ) : null}

      {/* Sandaran & badan kursi santai kertas */}
      <Paper lift={6}>
        {/* Kaki kursi kayu di lantai */}
        <Slab x={chairX + 26} y={536} w={16} h={FLOOR_Y - 536} color={C.woodLo} r={3} />
        <Slab x={chairX + 168} y={536} w={16} h={FLOOR_Y - 536} color={C.woodLo} r={3} />
        {/* Sandaran belakang kursi */}
        <Slab
          x={chairX + 126}
          y={282}
          w={68}
          h={218}
          color={ROOM.terracotta}
          shade="#744230"
          shadeH={0.16}
          r="16px 22px 10px 10px"
        />
        {/* Dudukan kursi */}
        <Slab
          x={chairX + 10}
          y={484}
          w={188}
          h={54}
          color={ROOM.terracotta}
          shade="#744230"
          shadeH={0.22}
          r={12}
        />
      </Paper>

      {/* Figur penonton tanpa wajah duduk santai menghadap layar di kiri */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${calmBreathY}px)`,
        }}
      >
        {/* Kaki penonton duduk rapi dengan telapak kaki menapak lantai */}
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 122,
            top: 454,
            width: 112,
            height: 32,
            borderRadius: 12,
            backgroundColor: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 124,
            top: 462,
            width: 30,
            height: FLOOR_Y - 462,
            borderRadius: '10px 10px 6px 6px',
            backgroundColor: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 142,
            top: FLOOR_Y - 14,
            width: 48,
            height: 14,
            borderRadius: '10px 10px 4px 4px',
            backgroundColor: C.board,
          }}
        />

        {/* Badan tegak & terbuka */}
        <Paper lift={7}>
          <Slab
            x={viewerCx - 66}
            y={264}
            w={132}
            h={206}
            color={ROOM.slate}
            hi="#647B92"
            hiH={0.12}
            shade="#394A5C"
            shadeH={0.14}
            r="26px 26px 14px 14px"
          />
        </Paper>

        {/* Kepala polos TANPA WAJAH (tegak dan tenang) */}
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 32,
            top: 192,
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
            boxSizing: 'border-box',
            filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.28))',
          }}
        />

        {/* Lengan luar terbuka santai di atas sandaran tangan kursi (tidak menyilang/menutup diri) */}
        <div
          style={{
            position: 'absolute',
            left: viewerCx + 24,
            top: 324,
            width: 28,
            height: 92,
            borderRadius: 14,
            backgroundColor: '#5B7289',
            border: `2px solid #394A5C`,
            transform: 'rotate(-8deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: viewerCx - 42,
            top: 404,
            width: 96,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#5B7289',
            border: `2px solid #394A5C`,
          }}
        />
      </div>

      {/* Sandaran tangan depan kursi */}
      <Paper lift={8}>
        <Slab
          x={chairX + 66}
          y={422}
          w={136}
          h={66}
          color="#AE694F"
          shade="#824B36"
          shadeH={0.22}
          r="12px 12px 6px 6px"
        />
      </Paper>
    </div>
  );
};

/* Tiga lambang perisai kertas yang menempel rapi di dada penonton */
const ChestShields: React.FC = () => {
  const f = useCurrentFrame();

  // Denyut mantap saat umpan "gratis" menyentuh perisai di Scene 126 (f=478)
  const deflectPulse = interpolate(f, [476, 482, 494], [1, 1.05, 1], CLAMP);

  // Bingkai perisai pemersatu muncul lembut setelah ketiga lambang terpasang (f=302)
  const crestAura = interpolate(f, [300, 322], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '774px 362px',
        transform: `scale(${deflectPulse})`,
        pointerEvents: 'none',
      }}
    >
      {/* Latar bentuk perisai besar berlapis di balik ketiga pelat pertanyaan */}
      {crestAura > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 774 - 184,
            top: 264,
            width: 368,
            height: 214,
            opacity: crestAura * 0.92,
            backgroundColor: C.brass,
            clipPath: 'polygon(4% 0%, 96% 0%, 100% 82%, 50% 100%, 0% 82%)',
            filter: 'drop-shadow(2px 6px 9px rgba(0,0,0,0.34))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 5,
              backgroundColor: C.woodLo,
              clipPath: 'polygon(4% 0%, 96% 0%, 100% 82%, 50% 100%, 0% 82%)',
            }}
          />
        </div>
      ) : null}

      {SHIELDS.map((s, idx) => (
        <PopIn key={idx} at={s.at}>
          <Boil seed={s.seed} amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: 774 - s.w / 2,
                top: s.y,
                width: s.w,
                height: 48,
                borderRadius: 10,
                backgroundColor: s.accent,
                padding: 4,
                boxSizing: 'border-box',
                filter: 'drop-shadow(2px 4px 7px rgba(0,0,0,0.36))',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 6,
                  backgroundColor: '#FFFDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0 14px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Ikon perisai mini di sisi kiri pelat */}
                <div
                  style={{
                    width: 14,
                    height: 16,
                    flexShrink: 0,
                    backgroundColor: s.accent,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%)',
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: idx === 2 ? 17 : 18,
                    color: C.ink,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.text}
                </span>
              </div>
            </div>
          </Boil>
          <SparkleBurst at={s.at + 2} x={774} y={s.y + 24} seed={s.seed} spread={44} />
        </PopIn>
      ))}
    </div>
  );
};

/* Tag umpan bertuliskan "gratis" menjuntai pada tali dari atas, tertolak perisai, lalu jatuh & talinya meluncur turun */
const DanglingGratisBait: React.FC = () => {
  const f = useCurrentFrame();

  // 1. Turun dari atas di Scene 121 (f=58..92)
  const dropInY = interpolate(f, [58, 92], [110, 326], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // 2. Gerak ayunan menggoda ke arah dada penonton (f=92..168), mundur bertahap saat perisai terpasang,
  //    lalu mencoba menempel lagi di Scene 126 (f=454..478)
  const swayIdle = f >= 92 && f < 454 ? Math.sin((f - 92) * 0.09) * 14 : 0;
  const pushBackByShields =
    interpolate(f, [169, 184], [0, -18], CLAMP) +
    interpolate(f, [219, 234], [0, -16], CLAMP) +
    interpolate(f, [285, 300], [0, -14], CLAMP);

  const finalLungeX = interpolate(
    f,
    [454, 476, 488],
    [0, 62, 16],
    CLAMP,
  );
  const finalLungeY = interpolate(
    f,
    [454, 476],
    [0, 26],
    CLAMP,
  );

  // 3. Setelah f=478 (gagal menempel), tag terlepas dan jatuh ke bawah dekat lantai (f=480..514)
  //    dan tali kosong meluncur turun tanpa hasil (f=482..536)
  const detached = f >= 480;
  const tagFallY = interpolate(f, [480, 514], [352, 554], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const tagFallX = interpolate(f, [480, 514], [608, 548], CLAMP);
  const tagFallRot = interpolate(f, [480, 514], [8, -16], CLAMP);

  const stringSlideDown = interpolate(f, [482, 536], [0, 175], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const anchorX = 568;
  const hookX = detached
    ? anchorX + Math.sin((f - 480) * 0.14) * 5
    : anchorX + 18 + swayIdle + pushBackByShields + finalLungeX;
  const hookY = detached ? 352 + stringSlideDown : dropInY + finalLungeY;
  const stringTopY = 118 + stringSlideDown;

  const entryOpacity = interpolate(f, [56, 66], [0, 1], CLAMP);
  if (entryOpacity <= 0.01) return null;

  // Kurva tali kertas dari titik atas menuju pengait
  const ctrlX = (anchorX + hookX) / 2 - 12;
  const ctrlY = (stringTopY + hookY) / 2;

  return (
    <AbsoluteFill style={{opacity: entryOpacity, pointerEvents: 'none'}}>
      {/* Tali pengait dari kertas */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{position: 'absolute', inset: 0}}
      >
        <path
          d={`M ${anchorX} ${stringTopY} Q ${ctrlX} ${ctrlY} ${hookX} ${hookY}`}
          fill="none"
          stroke={C.inkSoft}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        {/* Pengait logam kertas di ujung tali */}
        <path
          d={`M ${hookX} ${hookY} C ${hookX + 10} ${hookY + 2}, ${hookX + 12} ${hookY + 14}, ${hookX + 2} ${hookY + 16}`}
          fill="none"
          stroke={C.metalLo}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </svg>

      {/* Tag kertas bertuliskan "gratis" */}
      <div
        style={{
          position: 'absolute',
          left: (detached ? tagFallX : hookX) - 58,
          top: (detached ? tagFallY : hookY + 12),
          width: 116,
          height: 52,
          transformOrigin: '50% 0%',
          transform: `rotate(${detached ? tagFallRot : (hookX - anchorX) * 0.25}deg)`,
          filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.36))',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: C.tag,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 26,
            color: C.tagText,
            lineHeight: 1,
          }}
        >
          gratis
        </div>
        {/* Lubang cincin tali pada tag */}
        <div
          style={{
            position: 'absolute',
            left: 52,
            top: 4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: C.creamHi,
          }}
        />
      </div>

      {/* Percikan kecil saat tag "gratis" memantul tanpa hasil dari perisai */}
      <SparkleBurst at={478} x={636} y={354} seed="m14-reject" spread={42} />
    </AbsoluteFill>
  );
};

export const M14: React.FC = () => {
  return (
    <Stage dur={M14_DUR} banner="TIGA PERTANYAAN PENONTON" bannerSize={42}>
      <OrbitCamera
        dur={M14_DUR}
        yaw={14}
        push={1.06}
        focus={0.5}
        depth={620}
        origin={[640, 440]}
      >
        <Depth z={0.18}>
          <BackDecor />
        </Depth>

        <Depth z={0.5}>
          <PaperScreenProp />
          <CalmViewerSeated />
        </Depth>

        <Depth z={0.62}>
          <ChestShields />
        </Depth>

        <Depth z={0.75}>
          <DanglingGratisBait />
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};