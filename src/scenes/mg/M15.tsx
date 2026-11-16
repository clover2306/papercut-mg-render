// Adegan M15 (Scene 132-134, 471,30-485,62 dtk): Dua rel kertas dari kolom "harga" ke "mutu":
// bola "risiko" jatuh tumpah di rel tanpa pengawasan, sementara tangan kertas menyangga rel kedua agar "kebaikan" sampai utuh di piring.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Plant, Window} from '../../lib/paper/sets';

export const M15_DUR = 430;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const COL_LEFT_X = 125;
const COL_RIGHT_X = 1015;
const COL_W = 140;
const RAIL_START_X = COL_LEFT_X + COL_W - 4;
const RAIL_END_X = COL_RIGHT_X + 4;
const RAIL_MID_X = 640;

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.36}}>
      <Window x={32} y={214} w={118} h={185} night={false} />
    </div>
    <div style={{opacity: 0.4}}>
      <Plant x={1135} y={388} s={0.66} />
    </div>
  </AbsoluteFill>
);

/* Dua pilar kolom kertas: kolom kiri "harga" dan kolom kanan "mutu" */
const PolicyColumns: React.FC = () => {
  const f = useCurrentFrame();
  const enterP = interpolate(f, [0, 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const leftTop = 228;
  const rightTop = 258;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 45}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Kolom Kiri: HARGA */}
      <Paper lift={7}>
        {/* Kepala pilar */}
        <Slab
          x={COL_LEFT_X - 10}
          y={leftTop}
          w={COL_W + 20}
          h={22}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.35}
          r={5}
        />
        {/* Badan pilar kertas */}
        <Slab
          x={COL_LEFT_X}
          y={leftTop + 20}
          w={COL_W}
          h={FLOOR_Y - (leftTop + 20)}
          color={ROOM.slate}
          hi="#627990"
          hiH={0.1}
          shade="#39495A"
          shadeH={0.14}
          r="0 0 6px 6px"
        />
        {/* Alas kaki pilar */}
        <Slab
          x={COL_LEFT_X - 12}
          y={FLOOR_Y - 16}
          w={COL_W + 24}
          h={16}
          color={C.woodLo}
          r={4}
        />
      </Paper>

      {/* Pelat bertuliskan "harga" */}
      <Boil seed="m15-harga" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: COL_LEFT_X + 12,
            top: 492,
            width: COL_W - 24,
            height: 46,
            borderRadius: 8,
            backgroundColor: C.creamHi,
            border: `3px solid ${C.woodLo}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 26,
            color: C.ink,
            lineHeight: 1,
            filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.32))',
          }}
        >
          harga
        </div>
      </Boil>

      {/* Kolom Kanan: MUTU */}
      <Paper lift={7}>
        {/* Kepala pilar */}
        <Slab
          x={COL_RIGHT_X - 10}
          y={rightTop}
          w={COL_W + 20}
          h={22}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.35}
          r={5}
        />
        {/* Badan pilar kertas */}
        <Slab
          x={COL_RIGHT_X}
          y={rightTop + 20}
          w={COL_W}
          h={FLOOR_Y - (rightTop + 20)}
          color={ROOM.teal}
          hi="#3D7070"
          hiH={0.1}
          shade="#214242"
          shadeH={0.14}
          r="0 0 6px 6px"
        />
        {/* Alas kaki pilar */}
        <Slab
          x={COL_RIGHT_X - 12}
          y={FLOOR_Y - 16}
          w={COL_W + 24}
          h={16}
          color={C.woodLo}
          r={4}
        />
      </Paper>

      {/* Pelat bertuliskan "mutu" */}
      <Boil seed="m15-mutu" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: COL_RIGHT_X + 12,
            top: 492,
            width: COL_W - 24,
            height: 46,
            borderRadius: 8,
            backgroundColor: C.creamHi,
            border: `3px solid ${C.woodLo}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 26,
            color: C.ink,
            lineHeight: 1,
            filter: 'drop-shadow(1px 4px 6px rgba(0,0,0,0.32))',
          }}
        >
          mutu
        </div>
      </Boil>
    </div>
  );
};

/* Rel Pertama (atas, tanpa pengawasan): melengkung di titik rawan saat bola "risiko" lewat lalu bola tumpah di ujung "mutu" */
const UnsupervisedTrackAndRisk: React.FC<{focusAlpha: number}> = ({focusAlpha}) => {
  const f = useCurrentFrame();

  const railGrow = interpolate(f, [20, 46], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Bola "risiko" muncul di pangkal rel (Scene 133 mulai f=142) lalu menggelinding
  const ballAppear = interpolate(f, [130, 144], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const rollP = interpolate(f, [146, 224], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });

  // Lendutan rel di titik rawan tengah saat bola "risiko" melintas tanpa penyangga
  const sagPx = interpolate(f, [172, 198, 222], [0, 26, 20], CLAMP);

  // Setelah tiba di ujung rel (f=224), bola jatuh ke dudukan kolom "mutu" dan tumpah di ujung
  const dropP = interpolate(f, [224, 240], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const spillP = interpolate(f, [238, 258], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const leftY = 276;
  const midY = 290 + sagPx;
  const rightY = 304 + sagPx * 0.45;

  const spanHalfW = (RAIL_MID_X - RAIL_START_X) * railGrow;
  const leftAngleDeg = (Math.atan2(midY - leftY, RAIL_MID_X - RAIL_START_X) * 180) / Math.PI;
  const rightAngleDeg = (Math.atan2(rightY - midY, RAIL_END_X - RAIL_MID_X) * 180) / Math.PI;

  // Posisi bola kertas "risiko"
  const ballX =
    rollP < 1
      ? interpolate(rollP, [0, 1], [RAIL_START_X + 26, RAIL_END_X - 10], CLAMP)
      : interpolate(dropP, [0, 1], [RAIL_END_X - 10, COL_RIGHT_X + 68], CLAMP);

  const railYAtBall =
    ballX <= RAIL_MID_X
      ? interpolate(ballX, [RAIL_START_X, RAIL_MID_X], [leftY, midY], CLAMP)
      : interpolate(ballX, [RAIL_MID_X, RAIL_END_X], [midY, rightY], CLAMP);

  const ballCenterY =
    rollP < 1
      ? railYAtBall - 33
      : interpolate(dropP, [0, 1], [rightY - 33, 334], CLAMP);

  const ballRotDeg = rollP * 420 + dropP * 68;
  const ballSquashY = interpolate(f, [236, 242, 254], [1, 0.72, 0.84], CLAMP);
  const ballSquashX = interpolate(f, [236, 242, 254], [1, 1.24, 1.12], CLAMP);

  // Serpihan kertas tumpah di ujung kolom "mutu"
  const spillBits = [
    {dx: -46, dy: -26, w: 18, h: 12, rot: -34, color: C.tag},
    {dx: -24, dy: -38, w: 14, h: 14, rot: 22, color: C.amber},
    {dx: 16, dy: -34, w: 20, h: 11, rot: 41, color: C.tag},
    {dx: 42, dy: -22, w: 16, h: 13, rot: -18, color: C.heroLo},
    {dx: 54, dy: 4, w: 15, h: 10, rot: 28, color: C.tag},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, opacity: focusAlpha, pointerEvents: 'none'}}>
      {/* Lengan kiri Rel Pertama */}
      {railGrow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_START_X,
            top: leftY,
            width: spanHalfW,
            height: 15,
            borderRadius: 4,
            backgroundColor: C.cream,
            borderBottom: `4px solid ${C.creamLo}`,
            transformOrigin: '0% 50%',
            transform: `rotate(${leftAngleDeg}deg)`,
            boxShadow: '1px 4px 6px rgba(0,0,0,0.26)',
          }}
        />
      ) : null}

      {/* Lengan kanan Rel Pertama */}
      {railGrow > 0.5 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_MID_X,
            top: midY,
            width: (RAIL_END_X - RAIL_MID_X) * interpolate(railGrow, [0.5, 1], [0, 1], CLAMP),
            height: 15,
            borderRadius: 4,
            backgroundColor: C.cream,
            borderBottom: `4px solid ${C.creamLo}`,
            transformOrigin: '0% 50%',
            transform: `rotate(${rightAngleDeg}deg)`,
            boxShadow: '1px 4px 6px rgba(0,0,0,0.26)',
          }}
        />
      ) : null}

      {/* Titik sambungan rawan di tengah Rel Pertama (tanpa penyangga) */}
      {railGrow > 0.52 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_MID_X - 9,
            top: midY - 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: sagPx > 6 ? C.tag : C.woodLo,
            border: `2.5px solid ${C.creamHi}`,
            boxSizing: 'border-box',
          }}
        />
      ) : null}

      {/* Baki/wadah ujung di kolom "mutu" yang menerima tumpahan risiko */}
      <div
        style={{
          position: 'absolute',
          left: COL_RIGHT_X + 16,
          top: 344,
          width: 108,
          height: 14,
          borderRadius: '3px 3px 10px 10px',
          backgroundColor: C.metalLo,
          borderTop: `3px solid ${C.metal}`,
          transform: `rotate(${spillP * 8}deg)`,
        }}
      />

      {/* Pecahan kertas yang tumpah keluar saat bola "risiko" jatuh di ujung */}
      {spillP > 0.01
        ? spillBits.map((bit, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: COL_RIGHT_X + 68 + bit.dx * spillP,
                top: 334 + bit.dy * Math.sin(spillP * Math.PI * 0.72),
                width: bit.w,
                height: bit.h,
                borderRadius: 3,
                backgroundColor: bit.color,
                opacity: spillP,
                transform: `rotate(${bit.rot * spillP}deg)`,
                boxShadow: '1px 2px 3px rgba(0,0,0,0.25)',
              }}
            />
          ))
        : null}

      {/* Bola kertas bertuliskan "risiko" */}
      {ballAppear > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ballX - 36,
            top: ballCenterY - 36,
            width: 72,
            height: 72,
            opacity: ballAppear,
            transform: `scale(${ballAppear * ballSquashX}, ${ballAppear * ballSquashY})`,
            filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.36))',
          }}
        >
          {/* Lingkaran bola kertas berlapis yang berputar */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: C.tag,
              border: `3.5px solid ${C.heroLo}`,
              boxSizing: 'border-box',
              transform: `rotate(${ballRotDeg}deg)`,
            }}
          >
            {/* Tekstur lipatan kertas di dalam bola */}
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 8,
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px dashed rgba(255,255,255,0.28)`,
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Label "risiko" tetap tegak agar selalu mudah dibaca saat menggelinding */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              translate: '-50% -50%',
              backgroundColor: C.creamHi,
              padding: '3px 9px 4px',
              borderRadius: 5,
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 18,
              color: C.tag,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
            }}
          >
            risiko
          </div>
        </div>
      ) : null}

      <SparkleBurst at={238} x={COL_RIGHT_X + 68} y={334} seed="m15-spill" spread={46} />
    </div>
  );
};

/* Rel Kedua (bawah, dengan pengawasan): tangan kertas besar menyangga titik rawan, kotak "kebaikan" meluncur utuh ke piring */
const SupervisedTrackAndGoodness: React.FC<{focusAlpha: number}> = ({focusAlpha}) => {
  const f = useCurrentFrame();

  const railGrow = interpolate(f, [28, 54], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 134 (mulai f=274): tangan kertas besar naik dari bawah menyangga titik rawan di tengah rel
  const handRiseP = interpolate(f, [274, 304], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const handSteadyBreath = f > 304 ? Math.sin((f - 304) * 0.12) * 1.4 : 0;

  // Kotak kebaikan muncul di pangkal Rel Kedua (kolom "harga") lalu meluncur utuh sampai ke piring di kolom "mutu"
  const boxAppear = interpolate(f, [286, 302], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });
  const glideP = interpolate(f, [306, 384], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const leftY = 424;
  const rightY = 442;
  const railW = (RAIL_END_X - RAIL_START_X) * railGrow;
  const railAngleDeg = (Math.atan2(rightY - leftY, RAIL_END_X - RAIL_START_X) * 180) / Math.PI;

  const boxX = interpolate(glideP, [0, 1], [RAIL_START_X + 46, COL_RIGHT_X + 70], CLAMP);
  const railYAtBox = interpolate(
    boxX,
    [RAIL_START_X, RAIL_END_X],
    [leftY, rightY],
    CLAMP,
  );
  const boxBottomY = railYAtBox - 1;

  // Piring di atas kolom "mutu" tempat kotak kebaikan mendarat utuh
  const arrivedP = interpolate(f, [378, 396], [0, 1], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: focusAlpha, pointerEvents: 'none'}}>
      {/* Rel Kedua yang membentang lurus & kokoh dari "harga" ke "mutu" */}
      {railGrow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_START_X,
            top: leftY,
            width: railW,
            height: 16,
            borderRadius: 4,
            backgroundColor: C.creamHi,
            borderBottom: `4px solid ${C.creamLo}`,
            transformOrigin: '0% 50%',
            transform: `rotate(${railAngleDeg}deg)`,
            boxShadow: '1px 4px 6px rgba(0,0,0,0.26)',
          }}
        />
      ) : null}

      {/* Titik sambungan rawan di tengah Rel Kedua (x = 640) */}
      {railGrow > 0.52 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_MID_X - 9,
            top: (leftY + rightY) / 2 - 1,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: handRiseP > 0.5 ? C.go : C.woodLo,
            border: `2.5px solid ${C.creamHi}`,
            boxSizing: 'border-box',
          }}
        />
      ) : null}

      {/* Tangan kertas besar dari bawah menyangga titik rawan di tengah Rel Kedua */}
      {handRiseP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: RAIL_MID_X - 78,
            top: 446 + (1 - handRiseP) * 165 + handSteadyBreath,
            width: 156,
            height: 165,
            opacity: handRiseP,
            filter: 'drop-shadow(2px 6px 9px rgba(0,0,0,0.36))',
          }}
        >
          {/* Pergelangan & lengan bawah kertas */}
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 64,
              width: 60,
              height: 105,
              borderRadius: '8px 8px 0 0',
              backgroundColor: ROOM.navy,
              borderRight: '8px solid #1C2436',
              boxSizing: 'border-box',
            }}
          />
          {/* Manset baju krem */}
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 52,
              width: 72,
              height: 18,
              borderRadius: 4,
              backgroundColor: C.creamHi,
              border: `2px solid ${C.creamLo}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Telapak tangan kertas besar terbuka menyangga bagian bawah rel */}
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: 14,
              width: 104,
              height: 44,
              borderRadius: '14px 14px 22px 22px',
              backgroundColor: C.creamHi,
              border: `2.5px solid ${C.inkSoft}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Jari-jari penyangga di bawah rel */}
          {[
            {left: 16, top: 4, w: 30, rot: -16},
            {left: 44, top: 0, w: 32, rot: -3},
            {left: 74, top: 0, w: 32, rot: 4},
            {left: 102, top: 5, w: 30, rot: 16},
          ].map((fg, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: fg.left,
                top: fg.top,
                width: fg.w,
                height: 18,
                borderRadius: 9,
                backgroundColor: C.creamHi,
                border: `2px solid ${C.inkSoft}`,
                transform: `rotate(${fg.rot}deg)`,
                boxSizing: 'border-box',
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Aura hangat di sekitar piring saat kotak kebaikan tiba utuh */}
      {arrivedP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_RIGHT_X + 70 - 82,
            top: 365,
            width: 164,
            height: 112,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,226,136,0.68) 0%, rgba(255,226,136,0) 72%)',
            opacity: arrivedP,
          }}
        />
      ) : null}

      {/* Piring makan kertas di atas ujung kolom "mutu" */}
      <div
        style={{
          position: 'absolute',
          left: COL_RIGHT_X + 12,
          top: 436,
          width: 116,
          height: 22,
          filter: 'drop-shadow(1px 3px 5px rgba(0,0,0,0.3))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: arrivedP > 0.4 ? '#FFFDF8' : C.creamHi,
            border: `3px solid ${arrivedP > 0.4 ? C.amber : C.creamLo}`,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Kotak kebaikan berlapis kertas dengan pita merah rapi yang meluncur utuh ke piring */}
      {boxAppear > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: boxX - 52,
            top: boxBottomY - 58,
            width: 104,
            height: 58,
            opacity: boxAppear,
            transformOrigin: '50% 100%',
            transform: `scale(${boxAppear})`,
            filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
          }}
        >
          {/* Badan kotak */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 14,
              width: 96,
              height: 44,
              borderRadius: 6,
              backgroundColor: C.amber,
              borderBottom: `5px solid ${C.brassLo}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Tutup kotak */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 8,
              width: 104,
              height: 11,
              borderRadius: 4,
              backgroundColor: '#F8BE5C',
              borderBottom: `2px solid ${C.brassLo}`,
            }}
          />
          {/* Pita hadiah merah rapi di tengah & simpul kecil di atas */}
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 8,
              width: 12,
              height: 50,
              backgroundColor: C.tag,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 0,
              width: 16,
              height: 10,
              borderRadius: '10px 3px 10px 4px',
              backgroundColor: C.tag,
              transform: 'rotate(-14deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 54,
              top: 0,
              width: 16,
              height: 10,
              borderRadius: '3px 10px 4px 10px',
              backgroundColor: C.tag,
              transform: 'rotate(14deg)',
            }}
          />
          {/* Label bertuliskan "kebaikan" di sisi depan kotak */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 23,
              translate: '-50% 0',
              backgroundColor: C.creamHi,
              padding: '3px 8px 4px',
              borderRadius: 4,
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 16,
              color: C.ink,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
            }}
          >
            kebaikan
          </div>
        </div>
      ) : null}

      <SparkleBurst at={384} x={COL_RIGHT_X + 70} y={406} seed="m15-good" spread={56} />
    </div>
  );
};

export const M15: React.FC = () => {
  const f = useCurrentFrame();

  // Bergantian lalu berdampingan:
  // - Scene 132 akhir & Scene 133 (f=65..272): fokus utama pada Rel Pertama (Rel Kedua meredup lembut)
  // - Scene 134 awal (f=274..376): fokus utama pada Rel Kedua (Rel Pertama meredup lembut)
  // - Scene 134 akhir (f=378..430): keduanya tampil terang berdampingan penuh agar perbedaannya terbaca jelas
  const topTrackAlpha = interpolate(
    f,
    [0, 55, 70, 270, 286, 374, 390],
    [1, 1, 1, 1, 0.34, 0.34, 1],
    CLAMP,
  );
  const bottomTrackAlpha = interpolate(
    f,
    [0, 55, 70, 270, 286],
    [1, 1, 0.34, 0.34, 1],
    CLAMP,
  );

  return (
    <Stage dur={M15_DUR} banner="DUA JALUR KEBIJAKAN" bannerSize={44}>
      <OrbitCamera
        dur={M15_DUR}
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
          <PolicyColumns />
          <UnsupervisedTrackAndRisk focusAlpha={topTrackAlpha} />
          <SupervisedTrackAndGoodness focusAlpha={bottomTrackAlpha} />
        </Depth>

        <Depth z={0.78}>
          <PopIn at={10}>
            <Boil seed="m15-fg" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 44,
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
                  left: 1154,
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