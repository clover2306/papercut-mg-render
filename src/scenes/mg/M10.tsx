// Adegan M10 (Scene 080-085, 300,69-321,51 dtk): Tiga kotak hadiah berpita "Gratis" kusut terbuka
// seperti buku pop-up ("aplikasi", "ongkir", "sampel"), lalu senter menyorot bayangan pembayar.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Shelf} from '../../lib/paper/sets';

export const M10_DUR = 625;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BackWallDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.42}}>
      <Shelf x={64} y={268} w={215} books={4} />
    </div>
    <div style={{opacity: 0.36}}>
      <Corkboard x={1010} y={185} w={205} h={165} />
    </div>
    {/* Kertas catatan kosong tanpa tulisan di papan */}
    <div
      style={{
        position: 'absolute',
        left: 1044,
        top: 215,
        width: 58,
        height: 52,
        backgroundColor: C.creamHi,
        rotate: '-4deg',
        opacity: 0.55,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 1118,
        top: 224,
        width: 62,
        height: 48,
        backgroundColor: C.tape,
        rotate: '3deg',
        opacity: 0.5,
      }}
    />
  </AbsoluteFill>
);

/* Pita hadiah bertuliskan "Gratis" dengan ikatan kusut dan kendur */
const MessyGratisRibbon: React.FC<{
  cx: number;
  topY: number;
  boxH: number;
  loosenAt: number;
  seed: number;
}> = ({cx, topY, boxH, loosenAt, seed}) => {
  const f = useCurrentFrame();
  const looseP = interpolate(f, [loosenAt, loosenAt + 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(f, [loosenAt + 10, loosenAt + 24], [1, 0], CLAMP);

  if (fadeOut <= 0.01) return null;

  const tiltSign = seed % 2 === 0 ? 1 : -1;
  const slipY = looseP * 44;
  const slipX = looseP * 26 * tiltSign;
  const slipRot = looseP * 18 * tiltSign;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 95,
        top: topY - 34,
        width: 190,
        height: boxH + 40,
        opacity: fadeOut,
        transform: `translate(${slipX}px, ${slipY}px) rotate(${slipRot}deg)`,
        pointerEvents: 'none',
      }}
    >
      {/* Tali pita vertikal miring dan agak kendor */}
      <div
        style={{
          position: 'absolute',
          left: 81 + tiltSign * 5,
          top: 28,
          width: 28,
          height: boxH + 4,
          backgroundColor: C.tag,
          transform: `rotate(${tiltSign * 2.4}deg)`,
          boxShadow: '1px 3px 5px rgba(0,0,0,0.28)',
        }}
      />
      {/* Simpul pita tidak simetris di atas tutup kotak */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          top: 10,
          width: 46,
          height: 24,
          borderRadius: '18px 4px 18px 8px',
          backgroundColor: C.tag,
          border: `2px solid ${C.heroLo}`,
          transform: `rotate(${-24 - looseP * 14}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 15,
          width: 42,
          height: 20,
          borderRadius: '4px 18px 8px 18px',
          backgroundColor: C.hero,
          border: `2px solid ${C.heroLo}`,
          transform: `rotate(${31 + looseP * 19}deg)`,
        }}
      />
      {/* Ujung pita menjuntai lepas */}
      <div
        style={{
          position: 'absolute',
          left: 66,
          top: 28,
          width: 14,
          height: 44 + looseP * 14,
          backgroundColor: C.heroLo,
          transformOrigin: '50% 0%',
          transform: `rotate(${22 + looseP * 15}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 108,
          top: 26,
          width: 14,
          height: 52 + looseP * 16,
          backgroundColor: C.tag,
          transformOrigin: '50% 0%',
          transform: `rotate(${-16 - looseP * 12}deg)`,
        }}
      />
      {/* Label pita bertuliskan "Gratis" */}
      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 52,
          width: 98,
          padding: '4px 6px 5px',
          backgroundColor: C.tag,
          color: C.tagText,
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: 21,
          textAlign: 'center',
          lineHeight: 1,
          rotate: `${-5 * tiltSign}deg`,
          filter: 'url(#torn) drop-shadow(1px 3px 4px rgba(0,0,0,0.34))',
        }}
      >
        Gratis
      </div>
    </div>
  );
};

/* Kerangka dasar kotak hadiah kertas yang bisa membuka tutupnya seperti buku pop-up */
const PopGiftBox: React.FC<{
  cx: number;
  openAt: number;
  enterAt: number;
  boxColor: string;
  boxShade: string;
  lidColor: string;
  label: string;
  ribbonSeed: number;
  children: React.ReactNode;
}> = ({cx, openAt, enterAt, boxColor, boxShade, lidColor, label, ribbonSeed, children}) => {
  const f = useCurrentFrame();
  const boxW = 216;
  const boxH = 166;
  const boxTop = FLOOR_Y - boxH;

  const enterP = interpolate(f, [enterAt, enterAt + 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.25)),
  });
  const openP = interpolate(f, [openAt, openAt + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const lidLiftY = interpolate(openP, [0, 0.45, 1], [0, -34, -56], CLAMP);
  const lidShiftX = interpolate(openP, [0, 1], [0, -26], CLAMP);
  const lidTiltDeg = interpolate(openP, [0, 1], [0, -24], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 65}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Bagian dalam gelap mulut kotak saat tutup mulai terangkat */}
      {openP > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: cx - boxW / 2 + 8,
            top: boxTop - 10,
            width: boxW - 16,
            height: 24,
            borderRadius: '50%',
            backgroundColor: C.boardLo,
            opacity: openP,
          }}
        />
      ) : null}

      {/* Isi pop-up yang muncul dari dalam kotak */}
      {children}

      {/* Badan utama kotak hadiah */}
      <Paper lift={7}>
        <Slab
          x={cx - boxW / 2}
          y={boxTop}
          w={boxW}
          h={boxH}
          color={boxColor}
          shade={boxShade}
          shadeH={0.18}
          r={8}
        />
        {/* Lipatan tengah kartu pop-up di dinding kotak */}
        <div
          style={{
            position: 'absolute',
            left: cx - 1,
            top: boxTop + 6,
            width: 2,
            height: boxH - 12,
            backgroundColor: 'rgba(0,0,0,0.16)',
          }}
        />
      </Paper>

      {/* Pita "Gratis" kusut yang melonggar tepat sebelum tutup terbuka */}
      <MessyGratisRibbon
        cx={cx}
        topY={boxTop - 16}
        boxH={boxH}
        loosenAt={openAt - 8}
        seed={ribbonSeed}
      />

      {/* Tutup kotak yang terangkat dan melipat ke belakang seperti buku pop-up */}
      <div
        style={{
          position: 'absolute',
          left: cx - (boxW + 18) / 2,
          top: boxTop - 22,
          width: boxW + 18,
          height: 30,
          transformOrigin: '12% 85%',
          transform: `translate(${lidShiftX}px, ${lidLiftY}px) rotate(${lidTiltDeg}deg)`,
          filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.34))',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 6,
            backgroundColor: lidColor,
            borderBottom: `6px solid ${boxShade}`,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Label kategori di bagian depan kotak */}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: boxTop + 98,
          translate: '-50% 0',
          backgroundColor: C.creamHi,
          padding: '8px 20px 10px',
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: 28,
          lineHeight: 1,
          color: C.ink,
          whiteSpace: 'nowrap',
          rotate: ribbonSeed % 2 === 0 ? '1.5deg' : '-1.5deg',
          filter: 'url(#torn) drop-shadow(1px 4px 5px rgba(0,0,0,0.32))',
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* Kotak 1 ("aplikasi"): lembaran kecil bertuliskan "data" mengalir ke belakang panggung */
const BoxOneAplikasi: React.FC<{cx: number; openAt: number}> = ({cx, openAt}) => {
  const f = useCurrentFrame();
  const baseTop = FLOOR_Y - 166;

  const sheets = [0, 1, 2, 3, 4, 5];

  return (
    <PopGiftBox
      cx={cx}
      openAt={openAt}
      enterAt={6}
      boxColor={ROOM.slate}
      boxShade="#38495A"
      lidColor="#627990"
      label="aplikasi"
      ribbonSeed={1}
    >
      {sheets.map((idx) => {
        const start = openAt + 8 + idx * 14;
        const localT = f - start;
        if (localT < 0) return null;

        // Lembaran mengalir keluar ke atas lalu melayang menjauh ke belakang panggung
        const loopT = localT % 130;
        const prog = interpolate(loopT, [0, 115], [0, 1], CLAMP);
        const arcX = Math.sin(prog * Math.PI * 1.15 + idx * 0.7) * 44 - prog * 38;
        const arcY = interpolate(prog, [0, 0.35, 1], [16, -112, -182], CLAMP);
        const scale = interpolate(prog, [0, 0.3, 1], [0.55, 1.0, 0.56], CLAMP);
        const opacity = interpolate(prog, [0, 0.12, 0.78, 1], [0, 1, 0.85, 0], CLAMP);
        const rot = -10 + idx * 5 + Math.sin(prog * 5) * 8;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: cx - 42 + arcX,
              top: baseTop + arcY,
              width: 84,
              height: 44,
              backgroundColor: C.creamHi,
              border: `2px solid ${C.creamLo}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 20,
              color: C.ink,
              opacity,
              transform: `scale(${scale}) rotate(${rot}deg)`,
              boxShadow: '1px 4px 6px rgba(0,0,0,0.28)',
            }}
          >
            data
          </div>
        );
      })}
      <SparkleBurst at={openAt + 10} x={cx} y={baseTop - 40} seed="m10-b1" spread={44} />
    </PopGiftBox>
  );
};

/* Kotak 2 ("ongkir"): label harga barang tanpa angka yang membesar pelan */
const BoxTwoOngkir: React.FC<{cx: number; openAt: number}> = ({cx, openAt}) => {
  const f = useCurrentFrame();
  const baseTop = FLOOR_Y - 166;

  const popP = interpolate(f, [openAt + 8, openAt + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });
  // Membesar pelan sepanjang Scene 082
  const swellScale = interpolate(f, [openAt + 16, openAt + 94], [0.68, 1.32], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  if (popP <= 0.01) {
    return (
      <PopGiftBox
        cx={cx}
        openAt={openAt}
        enterAt={16}
        boxColor={ROOM.khaki}
        boxShade="#695C47"
        lidColor="#9F8E72"
        label="ongkir"
        ribbonSeed={2}
      >
        {null}
      </PopGiftBox>
    );
  }

  const riseY = interpolate(popP, [0, 1], [35, -96], CLAMP);

  return (
    <PopGiftBox
      cx={cx}
      openAt={openAt}
      enterAt={16}
      boxColor={ROOM.khaki}
      boxShade="#695C47"
      lidColor="#9F8E72"
      label="ongkir"
      ribbonSeed={2}
    >
      <div
        style={{
          position: 'absolute',
          left: cx - 54,
          top: baseTop + riseY,
          width: 108,
          height: 132,
          transformOrigin: '50% 100%',
          transform: `scale(${popP * swellScale}) rotate(4deg)`,
          filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.36))',
        }}
      >
        {/* Tali gantungan label harga */}
        <div
          style={{
            position: 'absolute',
            left: 51,
            top: 96,
            width: 5,
            height: 46,
            backgroundColor: C.woodLo,
          }}
        />
        {/* Badan tag harga barang (tanpa angka, hanya garis cetak abstrak) */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 4,
            width: 96,
            height: 106,
            backgroundColor: C.amber,
            clipPath: 'polygon(18% 0%, 82% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 12,
            width: 80,
            height: 90,
            backgroundColor: C.creamHi,
            clipPath: 'polygon(18% 0%, 82% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
          }}
        />
        {/* Lubang cincin tag harga */}
        <div
          style={{
            position: 'absolute',
            left: 46,
            top: 16,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: C.woodLo,
            border: `3px solid ${C.brass}`,
            boxSizing: 'border-box',
          }}
        />
        {/* Garis-garis nominal harga abstrak (tanpa angka) */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 46,
            width: 60,
            height: 11,
            borderRadius: 3,
            backgroundColor: C.tag,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 64,
            width: 46,
            height: 8,
            borderRadius: 3,
            backgroundColor: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 78,
            width: 54,
            height: 6,
            borderRadius: 3,
            backgroundColor: C.creamLo,
          }}
        />
      </div>
    </PopGiftBox>
  );
};

/* Kotak 3 ("sampel"): tangan kertas menunjuk keranjang belanja yang makin penuh */
const BoxThreeSampel: React.FC<{cx: number; openAt: number}> = ({cx, openAt}) => {
  const f = useCurrentFrame();
  const baseTop = FLOOR_Y - 166;

  const popP = interpolate(f, [openAt + 8, openAt + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.25)),
  });

  // 5 item belanjaan muncul berurutan mengisi keranjang sampai penuh
  const basketItems = [
    {at: openAt + 20, x: 14, y: 18, w: 30, h: 36, color: C.tag, rot: -8},
    {at: openAt + 34, x: 42, y: 14, w: 32, h: 40, color: ROOM.teal, rot: 5},
    {at: openAt + 48, x: 68, y: 20, w: 28, h: 34, color: C.amber, rot: 11},
    {at: openAt + 62, x: 24, y: 2, w: 34, h: 32, color: ROOM.sage, rot: -12},
    {at: openAt + 76, x: 54, y: -2, w: 34, h: 34, color: C.hero, rot: 9},
  ];

  const pointPulse = f > openAt + 22 ? Math.sin((f - openAt) * 0.28) * 6 : 0;

  return (
    <PopGiftBox
      cx={cx}
      openAt={openAt}
      enterAt={26}
      boxColor={ROOM.terracotta}
      boxShade="#73412F"
      lidColor="#B46E54"
      label="sampel"
      ribbonSeed={3}
    >
      {popP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: cx - 102,
            top: baseTop - 104 + (1 - popP) * 90,
            width: 204,
            height: 118,
            opacity: popP,
          }}
        >
          {/* Keranjang belanja kertas di sisi kanan bukaan kotak */}
          <div
            style={{
              position: 'absolute',
              left: 84,
              top: 22,
              width: 110,
              height: 86,
              filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
            }}
          >
            {/* Tumpukan barang belanjaan yang makin penuh */}
            {basketItems.map((item, idx) => {
              const itemP = interpolate(f, [item.at, item.at + 10], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.back(1.4)),
              });
              if (itemP <= 0.01) return null;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y + (1 - itemP) * 18,
                    width: item.w,
                    height: item.h,
                    borderRadius: 5,
                    backgroundColor: item.color,
                    border: `2px solid ${C.creamHi}`,
                    opacity: itemP,
                    transform: `scale(${itemP}) rotate(${item.rot}deg)`,
                  }}
                />
              );
            })}

            {/* Gagang keranjang */}
            <div
              style={{
                position: 'absolute',
                left: 22,
                top: 8,
                width: 66,
                height: 28,
                borderRadius: '18px 18px 0 0',
                border: `5px solid ${C.inkSoft}`,
                borderBottom: 'none',
                boxSizing: 'border-box',
              }}
            />
            {/* Badan keranjang anyaman kertas */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 34,
                width: 102,
                height: 48,
                backgroundColor: C.woodHi,
                borderTop: `7px solid ${C.wood}`,
                clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
              }}
            />
            {/* Garis kisi keranjang */}
            {[24, 48, 72].map((gx) => (
              <div
                key={gx}
                style={{
                  position: 'absolute',
                  left: gx,
                  top: 42,
                  width: 4,
                  height: 36,
                  backgroundColor: C.woodLo,
                  opacity: 0.65,
                }}
              />
            ))}
          </div>

          {/* Tangan kertas tanpa wajah yang menunjuk ke arah keranjang belanja */}
          <div
            style={{
              position: 'absolute',
              left: 4 + pointPulse,
              top: 46,
              width: 82,
              height: 42,
              transform: 'rotate(-8deg)',
              filter: 'drop-shadow(2px 4px 5px rgba(0,0,0,0.34))',
            }}
          >
            {/* Lengan baju */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                width: 28,
                height: 26,
                borderRadius: '6px 2px 2px 6px',
                backgroundColor: ROOM.navy,
              }}
            />
            {/* Telapak tangan kertas */}
            <div
              style={{
                position: 'absolute',
                left: 24,
                top: 6,
                width: 30,
                height: 28,
                borderRadius: 8,
                backgroundColor: C.creamHi,
                border: `2px solid ${C.inkSoft}`,
              }}
            />
            {/* Jari telunjuk menunjuk keranjang */}
            <div
              style={{
                position: 'absolute',
                left: 48,
                top: 8,
                width: 32,
                height: 11,
                borderRadius: 6,
                backgroundColor: C.creamHi,
                border: `2px solid ${C.inkSoft}`,
              }}
            />
          </div>
        </div>
      ) : null}
    </PopGiftBox>
  );
};

/* Bayangan figur pembayar tanpa wajah di belakang kotak + sorotan lampu senter kertas */
const PayerShadowAndFlashlight: React.FC = () => {
  const f = useCurrentFrame();

  // Scene 084 (f=433): bayangan pembayar muncul pelan di belakang kotak
  const shadowEnter = interpolate(f, [433, 478], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Scene 085 (f=515): lampu senter kertas masuk dan menyorotnya perlahan
  const torchEnter = interpolate(f, [515, 536], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const sweepP = interpolate(f, [526, 588], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  const payerX = 466;
  const payerFootY = FLOOR_Y - 12;

  // Sudut lampu senter menyapu perlahan hingga tepat mengenai bayangan pembayar
  const torchRotDeg = interpolate(sweepP, [0, 1], [6, 22], CLAMP);
  const beamLit = interpolate(sweepP, [0.35, 0.85], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Lapisan redup lembut saat narasi masuk ke "siapa yang membayar" */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#161412',
          opacity: shadowEnter * 0.24,
        }}
      />

      {/* Bayangan figur pembayar tanpa wajah (berdiri di belakang sela kotak 1 & 2) */}
      {shadowEnter > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: payerX - 95,
            top: payerFootY - 385,
            width: 190,
            height: 385,
            opacity: shadowEnter,
            transform: `translateY(${(1 - shadowEnter) * 42}px)`,
          }}
        >
          {/* Kepala polos tanpa wajah */}
          <div
            style={{
              position: 'absolute',
              left: 61,
              top: 0,
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: beamLit > 0.01 ? '#4B463F' : '#2C2A26',
              border: `3px solid ${beamLit > 0.4 ? C.tape : '#1C1B17'}`,
              boxSizing: 'border-box',
            }}
          />
          {/* Badan siluet pembayar */}
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 78,
              width: 106,
              height: 190,
              borderRadius: '26px 26px 10px 10px',
              backgroundColor: beamLit > 0.01 ? '#3F3B35' : '#252320',
            }}
          />
          {/* Lengan memegang dompet kertas */}
          <div
            style={{
              position: 'absolute',
              left: 118,
              top: 112,
              width: 52,
              height: 24,
              borderRadius: 10,
              backgroundColor: beamLit > 0.01 ? '#4B463F' : '#2C2A26',
              transform: 'rotate(-16deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 152,
              top: 98,
              width: 34,
              height: 26,
              borderRadius: 4,
              backgroundColor: beamLit > 0.3 ? C.woodHi : '#3A322A',
              border: `2px solid ${C.ink}`,
            }}
          />
        </div>
      ) : null}

      {/* Lampu senter kertas dan kerucut cahaya yang menyorot perlahan */}
      {torchEnter > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 108,
            top: 168,
            opacity: torchEnter,
            transform: `translateX(${(1 - torchEnter) * -90}px) rotate(${torchRotDeg}deg)`,
            transformOrigin: '42px 24px',
          }}
        >
          {/* Kerucut sorotan cahaya kertas */}
          <div
            style={{
              position: 'absolute',
              left: 88,
              top: -68,
              width: 370,
              height: 184,
              background:
                'linear-gradient(90deg, rgba(255,232,158,0.62) 0%, rgba(255,232,158,0.22) 72%, rgba(255,232,158,0) 100%)',
              clipPath: 'polygon(0% 38%, 100% 0%, 100% 100%, 0% 62%)',
            }}
          />
          {/* Badan senter potongan kertas */}
          <Paper lift={8}>
            <Slab
              x={0}
              y={10}
              w={68}
              h={28}
              color={C.board}
              hi={C.boardHi}
              hiH={0.25}
              r={6}
            />
            <Slab
              x={62}
              y={2}
              w={28}
              h={44}
              color={C.brass}
              shade={C.brassLo}
              shadeH={0.3}
              r="4px 10px 10px 4px"
            />
            <Slab
              x={22}
              y={6}
              w={14}
              h={6}
              color={C.tag}
              r={2}
            />
          </Paper>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const M10: React.FC = () => {
  return (
    <Stage dur={M10_DUR} banner="GRATIS DI LUAR PROGRAM" bannerSize={44}>
      <OrbitCamera
        dur={M10_DUR}
        yaw={15}
        push={1.07}
        focus={0.5}
        depth={680}
        origin={[640, 470]}
      >
        <Depth z={0.18}>
          <BackWallDecor />
          <PayerShadowAndFlashlight />
        </Depth>

        <Depth z={0.5}>
          {/* Tiga kotak hadiah pop-up berjajar rapi di atas meja kantin */}
          <BoxOneAplikasi cx={295} openAt={99} />
          <BoxTwoOngkir cx={640} openAt={191} />
          <BoxThreeSampel cx={985} openAt={306} />
        </Depth>

        <Depth z={0.78}>
          {/* Potongan pita kertas terlepas di tepi meja sebagai detail latar depan */}
          <Boil seed="m10-fg" amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: 62,
                top: FLOOR_Y + 24,
                width: 96,
                height: 16,
                backgroundColor: C.tag,
                rotate: '-6deg',
                opacity: 0.72,
                filter: 'url(#torn) drop-shadow(1px 3px 4px rgba(0,0,0,0.35))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 1126,
                top: FLOOR_Y + 32,
                width: 88,
                height: 15,
                backgroundColor: C.heroLo,
                rotate: '7deg',
                opacity: 0.68,
                filter: 'url(#torn) drop-shadow(1px 3px 4px rgba(0,0,0,0.35))',
              }}
            />
          </Boil>
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};