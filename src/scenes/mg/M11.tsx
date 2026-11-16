// Adegan M11 (Scene 093-098, 347,69-363,65 dtk): Diorama penampang kantin pertama yang diawasi
// lengkap dengan papan periksa bercentang, pengawas yang mendengar anak, dan pita hadiah mulus di atap.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, Slab, Stage} from './mgkit';
import {C, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Plant, Window} from '../../lib/paper/sets';

export const M11_DUR = 479;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ROOM_FLOOR = FLOOR_Y - 8;
const HOUSE_X = 210;
const HOUSE_W = 860;
const HOUSE_CX = HOUSE_X + HOUSE_W / 2;
const EAVES_Y = 284;
const PEAK_Y = 198;

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.42}}>
      <Window x={34} y={248} w={145} h={210} night={false} />
    </div>
    <div style={{opacity: 0.48}}>
      <Plant x={1095} y={395} s={0.72} />
    </div>
  </AbsoluteFill>
);

/* Papan periksa menggantung di dapur dengan dua centang kertas yang muncul berurutan */
const HangingInspectionBoard: React.FC<{
  x: number;
  y: number;
  checkOneAt: number;
  checkTwoAt: number;
}> = ({x, y, checkOneAt, checkTwoAt}) => {
  const f = useCurrentFrame();

  const swayDeg = Math.sin(f * 0.08) * 1.1;
  const c1 = interpolate(f, [checkOneAt, checkOneAt + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });
  const c2 = interpolate(f, [checkTwoAt, checkTwoAt + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });

  const activeGlow = interpolate(f, [127, 148], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 138,
        height: 162,
        transformOrigin: '50% 0%',
        transform: `rotate(${swayDeg}deg)`,
        filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
      }}
    >
      {/* Paku & tali gantungan papan */}
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: C.inkSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 4,
          width: 50,
          height: 16,
          borderTop: `2px solid ${C.inkSoft}`,
          borderLeft: `2px solid ${C.inkSoft}`,
          borderRight: `2px solid ${C.inkSoft}`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Papan kayu */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 16,
          width: 126,
          height: 144,
          borderRadius: 8,
          backgroundColor: C.woodHi,
          borderBottom: `6px solid ${C.woodLo}`,
          boxSizing: 'border-box',
        }}
      />
      {/* Penjepit logam di atas papan */}
      <div
        style={{
          position: 'absolute',
          left: 43,
          top: 10,
          width: 52,
          height: 16,
          borderRadius: 4,
          backgroundColor: C.metal,
          borderBottom: `3px solid ${C.metalLo}`,
        }}
      />
      {/* Lembar kertas periksa putih krem */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 26,
          width: 106,
          height: 122,
          borderRadius: 4,
          backgroundColor: activeGlow > 0.5 ? '#FFFDF8' : C.creamHi,
        }}
      />

      {/* Baris 1: Porsi pas (kotak centang + ikon baki rapi + garis abstrak) */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 42,
          width: 24,
          height: 24,
          borderRadius: 4,
          border: `2.5px solid ${C.inkSoft}`,
          backgroundColor: c1 > 0.2 ? '#E7F6EC' : 'transparent',
          boxSizing: 'border-box',
        }}
      />
      {c1 > 0.01 ? (
        <svg
          width={30}
          height={28}
          viewBox="0 0 30 28"
          style={{
            position: 'absolute',
            left: 22,
            top: 38,
            transform: `scale(${c1})`,
            transformOrigin: '40% 60%',
          }}
        >
          <path
            d="M4 15 L11 22 L26 6"
            fill="none"
            stroke={C.go}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {/* Ikon kotak makan porsi seimbang & garis abstrak (tanpa tulisan) */}
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 44,
          width: 26,
          height: 16,
          borderRadius: 3,
          backgroundColor: C.amber,
          borderBottom: `3px solid ${C.brassLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 47,
          width: 28,
          height: 5,
          borderRadius: 2,
          backgroundColor: C.inkSoft,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 56,
          width: 20,
          height: 4,
          borderRadius: 2,
          backgroundColor: C.creamLo,
        }}
      />

      {/* Baris 2: Dapur bersih (kotak centang + ikon panci mengilap + garis abstrak) */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 84,
          width: 24,
          height: 24,
          borderRadius: 4,
          border: `2.5px solid ${C.inkSoft}`,
          backgroundColor: c2 > 0.2 ? '#E7F6EC' : 'transparent',
          boxSizing: 'border-box',
        }}
      />
      {c2 > 0.01 ? (
        <svg
          width={30}
          height={28}
          viewBox="0 0 30 28"
          style={{
            position: 'absolute',
            left: 22,
            top: 80,
            transform: `scale(${c2})`,
            transformOrigin: '40% 60%',
          }}
        >
          <path
            d="M4 15 L11 22 L26 6"
            fill="none"
            stroke={C.go}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 88,
          width: 26,
          height: 14,
          borderRadius: '2px 2px 7px 7px',
          backgroundColor: C.metalLo,
          borderTop: `3px solid ${C.brass}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 89,
          width: 28,
          height: 5,
          borderRadius: 2,
          backgroundColor: C.inkSoft,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 98,
          width: 22,
          height: 4,
          borderRadius: 2,
          backgroundColor: C.creamLo,
        }}
      />

      {/* Baris 3: Coretan abstrak bawah papan */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 124,
          width: 82,
          height: 4,
          borderRadius: 2,
          backgroundColor: C.creamLo,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 133,
          width: 58,
          height: 4,
          borderRadius: 2,
          backgroundColor: C.creamLo,
        }}
      />

      <SparkleBurst at={checkOneAt} x={36} y={52} seed="m11-chk1" spread={36} />
      <SparkleBurst at={checkTwoAt} x={36} y={94} seed="m11-chk2" spread={36} />
    </div>
  );
};

/* Juru masak tanpa wajah dengan topi koki kertas di dapur */
const FacelessCook: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const stirBob = Math.sin(f * 0.14) * 2.2;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 86,
        height: 188,
        translate: '-50% -100%',
      }}
    >
      {/* Topi koki kertas putih */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: -16 + stirBob * 0.4,
          width: 42,
          height: 24,
          borderRadius: '14px 14px 4px 4px',
          backgroundColor: '#F7F3EC',
          border: `2px solid ${C.creamLo}`,
        }}
      />
      {/* Kepala polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: 21,
          top: 6 + stirBob * 0.4,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2.5px solid ${C.inkSoft}`,
        }}
      />
      {/* Badan & celemek putih */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 56 + stirBob * 0.3,
          width: 54,
          height: 82,
          borderRadius: 10,
          backgroundColor: ROOM.sage,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 64 + stirBob * 0.3,
          width: 38,
          height: 70,
          borderRadius: 6,
          backgroundColor: '#F7F3EC',
        }}
      />
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 138,
          width: 18,
          height: 50,
          borderRadius: 5,
          backgroundColor: C.inkSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 138,
          width: 18,
          height: 50,
          borderRadius: 5,
          backgroundColor: C.inkSoft,
        }}
      />
    </div>
  );
};

/* Figur pengawas tanpa wajah dengan papan periksa yang membungkuk mendekat mendengar anak */
const FacelessSupervisor: React.FC<{x: number; y: number; listenAt: number}> = ({
  x,
  y,
  listenAt,
}) => {
  const f = useCurrentFrame();
  // Membungkuk mendekat ke arah anak di kanan saat anak mengangkat gelembung ucapan
  const leanP = interpolate(f, [listenAt, listenAt + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const nodBob = f > listenAt + 24 ? Math.sin((f - listenAt) * 0.16) * 1.6 : 0;
  const upperTilt = leanP * 16 + nodBob;
  const stepForwardX = leanP * 22;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + stepForwardX,
        top: y,
        width: 96,
        height: 196,
        translate: '-50% -100%',
      }}
    >
      {/* Kaki tegak di lantai kantin */}
      <div
        style={{
          position: 'absolute',
          left: 25,
          top: 142,
          width: 20,
          height: 54,
          borderRadius: 6,
          backgroundColor: C.inkSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 51,
          top: 142,
          width: 20,
          height: 54,
          borderRadius: 6,
          backgroundColor: C.inkSoft,
        }}
      />

      {/* Tubuh bagian atas yang membungkuk ramah ke kanan untuk mendengar */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '48px 144px',
          transform: `rotate(${upperTilt}deg)`,
        }}
      >
        {/* Badan seragam pengawas */}
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 60,
            width: 60,
            height: 84,
            borderRadius: 11,
            backgroundColor: ROOM.navy,
          }}
        />
        {/* Tanda pengenal kecil polos di dada */}
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 74,
            width: 14,
            height: 10,
            borderRadius: 2,
            backgroundColor: C.amber,
          }}
        />
        {/* Kepala polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 4,
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
            border: `2.5px solid ${C.inkSoft}`,
          }}
        />
        {/* Lengan memegang papan periksa dan terulur menerima gelembung ucapan */}
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 84,
            width: 44,
            height: 16,
            borderRadius: 8,
            backgroundColor: ROOM.navy,
            transformOrigin: '0% 50%',
            transform: `rotate(${-12 - leanP * 18}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 62 - leanP * 12,
            width: 22,
            height: 30,
            borderRadius: 3,
            backgroundColor: C.woodHi,
            border: `2px solid ${C.creamHi}`,
            transform: 'rotate(-14deg)',
          }}
        />
      </div>
    </div>
  );
};

/* Figur anak tanpa wajah di meja makan yang mengangkat gelembung ucapan kosong */
const FacelessChildWithBubble: React.FC<{
  x: number;
  y: number;
  speakAt: number;
  heardAt: number;
}> = ({x, y, speakAt, heardAt}) => {
  const f = useCurrentFrame();

  const raiseP = interpolate(f, [speakAt, speakAt + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const receiveP = interpolate(f, [heardAt, heardAt + 26], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Gelembung ucapan kosong melayang dari tangan anak mendekat ke pengawas saat didengar
  const bubbleShiftX = receiveP * -36;
  const bubbleShiftY = receiveP * -12;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 84,
        height: 162,
        translate: '-50% -100%',
      }}
    >
      {/* Kaki */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 118,
          width: 17,
          height: 44,
          borderRadius: 5,
          backgroundColor: C.inkSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 45,
          top: 118,
          width: 17,
          height: 44,
          borderRadius: 5,
          backgroundColor: C.inkSoft,
        }}
      />
      {/* Badan anak */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 50,
          width: 52,
          height: 70,
          borderRadius: 10,
          backgroundColor: C.hero,
        }}
      />
      {/* Tas sekolah kertas di punggung */}
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 56,
          width: 18,
          height: 44,
          borderRadius: 6,
          backgroundColor: ROOM.mustard,
        }}
      />
      {/* Kepala polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 2,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2.5px solid ${C.inkSoft}`,
        }}
      />
      {/* Lengan anak terangkat saat menyampaikan pendapat */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 62,
          width: 42,
          height: 14,
          borderRadius: 7,
          backgroundColor: C.heroLo,
          transformOrigin: '100% 50%',
          transform: `rotate(${interpolate(raiseP, [0, 1], [-15, 42], CLAMP)}deg)`,
        }}
      />

      {/* Gelembung ucapan kosong dari kertas berlapis */}
      {raiseP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: -58 + bubbleShiftX,
            top: -54 + bubbleShiftY,
            width: 96,
            height: 58,
            opacity: raiseP,
            transformOrigin: '80% 100%',
            transform: `scale(${raiseP})`,
            filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '28px',
              backgroundColor: '#FFFDF9',
              border: `3px solid ${receiveP > 0.4 ? C.go : C.inkSoft}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Ekor gelembung ucapan mengarah ke anak */}
          <div
            style={{
              position: 'absolute',
              right: 16,
              bottom: -12,
              width: 18,
              height: 16,
              backgroundColor: '#FFFDF9',
              borderRight: `3px solid ${receiveP > 0.4 ? C.go : C.inkSoft}`,
              borderBottom: `3px solid ${receiveP > 0.4 ? C.go : C.inkSoft}`,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

/* Pita hadiah mulus dan rapi di puncak atap kantin pada akhir adegan */
const RoofGiftRibbon: React.FC<{appearAt: number}> = ({appearAt}) => {
  const f = useCurrentFrame();
  const popP = interpolate(f, [appearAt, appearAt + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  if (popP <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: HOUSE_CX - 130,
        top: PEAK_Y - 58,
        width: 260,
        height: 120,
        opacity: popP,
        transformOrigin: '50% 60%',
        transform: `scale(${popP})`,
        filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
        pointerEvents: 'none',
      }}
    >
      {/* Ujung pita kiri & kanan yang simetris dan rapi menyentuh lereng atap */}
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 44,
          width: 24,
          height: 62,
          backgroundColor: C.heroLo,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)',
          transformOrigin: '50% 0%',
          transform: 'rotate(28deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 62,
          top: 44,
          width: 24,
          height: 62,
          backgroundColor: C.heroLo,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)',
          transformOrigin: '50% 0%',
          transform: 'rotate(-28deg)',
        }}
      />

      {/* Kupu-kupu pita kiri & kanan yang penuh dan mulus */}
      <div
        style={{
          position: 'absolute',
          left: 38,
          top: 12,
          width: 84,
          height: 44,
          borderRadius: '44px 10px 44px 14px',
          backgroundColor: C.tag,
          border: `3px solid ${C.heroLo}`,
          boxSizing: 'border-box',
          transform: 'rotate(-14deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 38,
          top: 12,
          width: 84,
          height: 44,
          borderRadius: '10px 44px 14px 44px',
          backgroundColor: C.tag,
          border: `3px solid ${C.heroLo}`,
          boxSizing: 'border-box',
          transform: 'rotate(14deg)',
        }}
      />
      {/* Lipatan dalam pita */}
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 24,
          width: 48,
          height: 18,
          borderRadius: 20,
          backgroundColor: C.hero,
          transform: 'rotate(-14deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 58,
          top: 24,
          width: 48,
          height: 18,
          borderRadius: 20,
          backgroundColor: C.hero,
          transform: 'rotate(14deg)',
        }}
      />

      {/* Simpul tengah pita yang rapat */}
      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 20,
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: C.tag,
          border: `3px solid ${C.heroLo}`,
          boxSizing: 'border-box',
        }}
      />
      <SparkleBurst at={appearAt + 4} x={130} y={36} seed="m11-ribbon" spread={68} />
    </div>
  );
};

export const M11: React.FC = () => {
  const f = useCurrentFrame();

  // Rumah boneka penampang kantin membuka/terangkat mulus di awal adegan
  const houseEnter = interpolate(f, [0, 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Lampu hangat kantin menyala saat pengawasan dijelaskan (Scene 094)
  const warmLight = interpolate(f, [127, 152], [0.25, 1], CLAMP);

  // Kilau kebersihan dapur saat "Dapurnya bersih" (Scene 096)
  const kitchenCleanGlow = interpolate(f, [261, 275, 310], [0, 1, 0.45], CLAMP);

  // Alur baki kotak makan bergerak tertib dari dapur lewat jendela pass-through ke ruang makan
  const trayCycle = (f * 1.15) % 140;

  return (
    <Stage dur={M11_DUR} banner="KANTIN PERTAMA" bannerSize={44}>
      <OrbitCamera
        dur={M11_DUR}
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: houseEnter,
              transform: `translateY(${(1 - houseEnter) * 45}px)`,
            }}
          >
            {/* Atap segitiga potongan kertas di atas diorama kantin */}
            <svg
              width={HOUSE_W + 64}
              height={EAVES_Y - PEAK_Y + 18}
              viewBox={`0 0 ${HOUSE_W + 64} ${EAVES_Y - PEAK_Y + 18}`}
              style={{
                position: 'absolute',
                left: HOUSE_X - 32,
                top: PEAK_Y,
                filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.32))',
              }}
            >
              <polygon
                points={`${(HOUSE_W + 64) / 2},4 ${HOUSE_W + 58},${EAVES_Y - PEAK_Y + 4} 6,${EAVES_Y - PEAK_Y + 4}`}
                fill={C.tag}
              />
              <polygon
                points={`${(HOUSE_W + 64) / 2},16 ${HOUSE_W + 34},${EAVES_Y - PEAK_Y + 4} 30,${EAVES_Y - PEAK_Y + 4}`}
                fill={C.heroLo}
              />
            </svg>

            {/* Balok lis atap rumah boneka */}
            <Paper lift={7}>
              <Slab
                x={HOUSE_X - 16}
                y={EAVES_Y - 6}
                w={HOUSE_W + 32}
                h={18}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.35}
                r={4}
              />
            </Paper>

            {/* Ruang penampang kiri: DAPUR (x=224..558) */}
            <Paper lift={5}>
              <Slab
                x={HOUSE_X + 14}
                y={EAVES_Y + 12}
                w={334}
                h={ROOM_FLOOR - (EAVES_Y + 12)}
                color="#EFE8DC"
                shade={C.cream}
                shadeH={0.08}
                r={0}
              />
            </Paper>
            {/* Pola ubin dinding dapur bersih */}
            {[336, 384, 432].map((ty) => (
              <div
                key={ty}
                style={{
                  position: 'absolute',
                  left: HOUSE_X + 22,
                  top: ty,
                  width: 318,
                  height: 2,
                  backgroundColor: C.creamLo,
                  opacity: 0.45,
                }}
              />
            ))}

            {/* Ruang penampang kanan: RUANG MAKAN (x=698..1056) */}
            <Paper lift={5}>
              <Slab
                x={HOUSE_X + 488}
                y={EAVES_Y + 12}
                w={358}
                h={ROOM_FLOOR - (EAVES_Y + 12)}
                color="#F4EDE0"
                shade={C.cream}
                shadeH={0.08}
                r={0}
              />
            </Paper>

            {/* Sorotan lampu gantung hangat di dapur & ruang makan */}
            <div
              style={{
                position: 'absolute',
                left: 270,
                top: EAVES_Y + 12,
                width: 240,
                height: 290,
                background: 'rgba(255,228,150,0.28)',
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                opacity: warmLight,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 745,
                top: EAVES_Y + 12,
                width: 265,
                height: 290,
                background: 'rgba(255,228,150,0.24)',
                clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
                opacity: warmLight,
                pointerEvents: 'none',
              }}
            />
            {/* Kap lampu gantung dapur & ruang makan */}
            {[390, 878].map((lx, i) => (
              <div key={i} style={{position: 'absolute', left: lx - 24, top: EAVES_Y + 12}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 0,
                    width: 4,
                    height: 16,
                    backgroundColor: C.inkSoft,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 14,
                    width: 40,
                    height: 18,
                    borderRadius: '20px 20px 4px 4px',
                    backgroundColor: C.amber,
                    borderBottom: `3px solid ${C.brassLo}`,
                  }}
                />
              </div>
            ))}

            {/* Dinding sekat tengah dengan PINTU / JENDELA PASS-THROUGH DAPUR */}
            <Paper lift={6}>
              {/* Bagian atas sekat */}
              <Slab
                x={HOUSE_X + 348}
                y={EAVES_Y + 12}
                w={140}
                h={112}
                color={C.creamLo}
                shade="#AEA08F"
                shadeH={0.14}
                r={0}
              />
              {/* Bagian bawah sekat di bawah jendela pass-through */}
              <Slab
                x={HOUSE_X + 348}
                y={496}
                w={140}
                h={ROOM_FLOOR - 496}
                color={C.creamLo}
                shade="#AEA08F"
                shadeH={0.14}
                r={0}
              />
              {/* Bingkai kayu jendela pass-through */}
              <Slab
                x={HOUSE_X + 344}
                y={404}
                w={148}
                h={10}
                color={C.wood}
                r={2}
              />
            </Paper>

            {/* Juru masak tanpa wajah di dapur */}
            <FacelessCook x={305} y={ROOM_FLOOR} />

            {/* Kompor & panci sup bersih di dapur */}
            <Paper lift={6}>
              <Slab
                x={HOUSE_X + 26}
                y={494}
                w={175}
                h={ROOM_FLOOR - 494}
                color={C.metal}
                shade={C.metalLo}
                shadeH={0.2}
                r={4}
              />
              <Slab
                x={HOUSE_X + 46}
                y={452}
                w={88}
                h={42}
                color={C.metalLo}
                hi={C.metal}
                hiH={0.28}
                r="4px 4px 12px 12px"
              />
              <Slab
                x={HOUSE_X + 42}
                y={444}
                w={96}
                h={10}
                color={C.brass}
                r={3}
              />
            </Paper>

            {/* Kilau kebersihan pada meja & panci dapur */}
            {kitchenCleanGlow > 0.05 ? (
              <div
                style={{
                  position: 'absolute',
                  left: HOUSE_X + 32,
                  top: 440,
                  width: 165,
                  height: 60,
                  borderRadius: 10,
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)',
                  opacity: kitchenCleanGlow,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
            <SparkleBurst at={263} x={HOUSE_X + 110} y={456} seed="m11-clean" spread={46} />

            {/* Papan periksa menggantung di dapur */}
            <HangingInspectionBoard
              x={HOUSE_X + 196}
              y={EAVES_Y + 14}
              checkOneAt={221}
              checkTwoAt={261}
            />

            {/* Jalur antar (meja pass-through) yang menghubungkan dapur ke ruang makan */}
            <Paper lift={7}>
              <Slab
                x={HOUSE_X + 210}
                y={488}
                w={365}
                h={14}
                color={C.woodHi}
                shade={C.woodLo}
                shadeH={0.35}
                r={4}
              />
            </Paper>

            {/* Baki kotak makan berporsi rapi meluncur lewat jalur pass-through */}
            {[0, 1].map((idx) => {
              const pos = (trayCycle + idx * 70) % 140;
              const trayX = HOUSE_X + 245 + pos * 2.05;
              const trayOp = interpolate(pos, [0, 14, 122, 140], [0, 1, 1, 0], CLAMP);
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: trayX,
                    top: 466,
                    width: 46,
                    height: 22,
                    opacity: trayOp,
                    filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.25))',
                  }}
                >
                  {/* Baki & porsi seimbang */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: 46,
                      height: 8,
                      borderRadius: 3,
                      backgroundColor: C.metal,
                      borderBottom: `2px solid ${C.metalLo}`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 5,
                      bottom: 7,
                      width: 18,
                      height: 11,
                      borderRadius: 3,
                      backgroundColor: '#FFFDF8',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 26,
                      bottom: 7,
                      width: 14,
                      height: 11,
                      borderRadius: 3,
                      backgroundColor: ROOM.sage,
                    }}
                  />
                </div>
              );
            })}

            {/* Meja makan & bangku kantin di ruang makan */}
            <Paper lift={6}>
              {/* Meja makan */}
              <Slab
                x={820}
                y={506}
                w={195}
                h={14}
                color={C.woodHi}
                shade={C.woodLo}
                shadeH={0.35}
                r={4}
              />
              <Slab x={844} y={520} w={14} h={ROOM_FLOOR - 520} color={C.woodLo} r={2} />
              <Slab x={978} y={520} w={14} h={ROOM_FLOOR - 520} color={C.woodLo} r={2} />
              {/* Baki makanan rapi sudah tersaji di meja */}
              <Slab x={864} y={496} w={48} h={10} color={C.metal} r={3} />
              <Slab x={872} y={488} w={32} h={8} color={C.amber} r={2} />
            </Paper>

            {/* Pengawas tanpa wajah berdiri dekat jalur antar & membungkuk mendengar anak */}
            <FacelessSupervisor x={762} y={ROOM_FLOOR} listenAt={340} />

            {/* Anak tanpa wajah di meja makan mengangkat gelembung ucapan kosong */}
            <FacelessChildWithBubble
              x={948}
              y={ROOM_FLOOR}
              speakAt={305}
              heardAt={348}
            />

            {/* Dinding penampang luar kiri, kanan, dan lantai alas diorama */}
            <Paper lift={8}>
              <Slab
                x={HOUSE_X}
                y={EAVES_Y + 8}
                w={16}
                h={ROOM_FLOOR - EAVES_Y}
                color={C.woodLo}
                r={3}
              />
              <Slab
                x={HOUSE_X + HOUSE_W - 16}
                y={EAVES_Y + 8}
                w={16}
                h={ROOM_FLOOR - EAVES_Y}
                color={C.woodLo}
                r={3}
              />
              <Slab
                x={HOUSE_X - 10}
                y={ROOM_FLOOR}
                w={HOUSE_W + 20}
                h={14}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.35}
                r={4}
              />
            </Paper>

            {/* Pita hadiah mulus dan rapi muncul di atas atap kantin di akhir adegan */}
            <RoofGiftRibbon appearAt={421} />
          </div>
        </Depth>

        <Depth z={0.78}>
          <Boil seed="m11-fg" amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: 52,
                top: FLOOR_Y + 26,
                width: 84,
                height: 18,
                borderRadius: 4,
                backgroundColor: C.woodHi,
                rotate: '-3deg',
                opacity: 0.72,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 1144,
                top: FLOOR_Y + 28,
                width: 84,
                height: 18,
                borderRadius: 4,
                backgroundColor: C.woodHi,
                rotate: '3deg',
                opacity: 0.72,
              }}
            />
          </Boil>
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};