// Adegan MG-08 "Engsel Cermin" (titik balik utama): Dunia Bocor menjadi Dunia Sampai.
// Dacin kertas berayun ke sisi benar, panggung terlipat menjadi dua separuh 50:50,
// menara koin emas identik berdiri sejajar diukur garis penggaris putus-putus,
// strip kertas "Uang yang sama." menyeberangi engsel, koin kiri jatuh ke lubang sementara
// koin kanan bergulir sampai ke jendela rumah yang menyala ("ia sampai"), lalu pintu kiri
// menggeser keluar dan Dunia Sampai memenuhi layar sampai akhir adegan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {CameraPush, GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB08_DUR = 397;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet Dunia Bocor (kiri) & Dunia Sampai (kanan) sesuai brief bagian 1.3
const PAL = {
  bocor: {
    sky: '#D9C7A3',
    skyLo: '#C5B18B',
    hillFar: '#B8A686',
    hillNear: '#8A7F72',
    earth: '#6B4A33',
    earthLo: '#4D3423',
    ocher: '#B8893A',
    ink: '#2E221A',
    arch: '#5C402C',
    archHi: '#74533B',
  },
  sampai: {
    skyTop: '#F8D8B8',
    skyBot: '#CBE7E2',
    cream: '#F6E8CC',
    marigold: '#F2A93B',
    terracotta: '#D9683B',
    terracottaLo: '#B04E27',
    leaf: '#5E9C6B',
    leafLo: '#457A50',
    teal: '#2F8F8B',
    tealLo: '#216966',
    ink: '#3B2A20',
    floor: '#6D4932',
    floorHi: '#8D6145',
    windowGlow: '#FFE699',
  },
  coin: {
    gold: '#F5C249',
    goldHi: '#FFE48F',
    goldRim: '#C78E20',
    goldShade: '#9B6B12',
    glow: 'rgba(245, 194, 73, 0.42)',
  },
};

// Koin kertas: bulat polos dengan cincin timbul, tanpa gambar, angka, atau lambang; selalu berpendar emas
const PaperCoinDisc: React.FC<{
  x: number;
  y: number;
  size: number;
  rot?: number;
  glow?: number;
}> = ({x, y, size, rot = 0, glow = 1}) => {
  const inner = Math.round(size * 0.68);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        borderRadius: '50%',
        backgroundColor: PAL.coin.gold,
        border: `3px solid ${PAL.coin.goldShade}`,
        boxShadow: `0 0 ${Math.round(18 * glow)}px ${PAL.coin.glow}, 2px 4px 6px rgba(0,0,0,0.32)`,
      }}
    >
      {/* Cincin timbul polos di dalam koin */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: inner,
          height: inner,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `2.5px solid ${PAL.coin.goldRim}`,
          backgroundColor: PAL.coin.goldHi,
          opacity: 0.65,
        }}
      />
    </div>
  );
};

// Menara koin kertas identik (selalu berpendar emas di kedua dunia)
const CoinTower: React.FC<{
  cx: number;
  baseY: number;
  progress: number;
  torn?: boolean;
}> = ({cx, baseY, progress, torn = false}) => {
  if (progress <= 0.01) return null;

  const layers = 11;
  const coinW = 116;
  const coinH = 22;
  const stepY = 18;
  const totalH = (layers - 1) * stepY + coinH;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: baseY,
        width: coinW + 40,
        height: totalH + 40,
        translate: '-50% -100%',
        pointerEvents: 'none',
      }}
    >
      {/* Pendar emas hangat di belakang tumpukan koin */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 10,
          width: 170,
          height: totalH * progress + 50,
          translate: '-50% 0',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(245,194,73,0.45) 0%, rgba(242,169,59,0.16) 55%, rgba(0,0,0,0) 78%)',
        }}
      />
      <Paper lift={5} torn={torn}>
        {Array.from({length: layers}).map((_, idx) => {
          const threshold = idx / layers;
          const localP = interpolate(
            progress,
            [threshold * 0.75, threshold * 0.75 + 0.25],
            [0, 1],
            CLAMP,
          );
          if (localP <= 0.01) return null;
          const yFromBottom = idx * stepY;
          const dropOffset = (1 - localP) * -28;
          const xJitter = ((idx % 3) - 1) * 2;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: 20 + xJitter,
                bottom: yFromBottom - dropOffset,
                width: coinW,
                height: coinH,
                opacity: localP,
                scale: `${0.85 + 0.15 * localP} 1`,
              }}
            >
              {/* Sisi tebal kepingan koin */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 5,
                  width: coinW,
                  height: coinH - 5,
                  borderRadius: 11,
                  backgroundColor: PAL.coin.goldRim,
                  border: `2px solid ${PAL.coin.goldShade}`,
                }}
              />
              {/* Permukaan atas koin dengan cincin timbul */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: coinW,
                  height: coinH - 6,
                  borderRadius: 11,
                  backgroundColor: PAL.coin.gold,
                  border: `2px solid ${PAL.coin.goldShade}`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    top: 3,
                    bottom: 3,
                    borderRadius: 8,
                    border: `1.5px solid ${PAL.coin.goldRim}`,
                    backgroundColor: PAL.coin.goldHi,
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
          );
        })}
      </Paper>
    </div>
  );
};

// Timbangan dacin kertas (Frame 0-53: berayun dari miring sisi curang ke sisi benar)
const PaperDacin: React.FC<{
  tiltDeg: number;
  opacity: number;
  scale: number;
}> = ({tiltDeg, opacity, scale}) => {
  if (opacity <= 0.01) return null;

  const beamHalf = 225;
  const rad = (tiltDeg * Math.PI) / 180;
  const leftPanX = -Math.cos(rad) * beamHalf;
  const leftPanY = -Math.sin(rad) * beamHalf;
  const rightPanX = Math.cos(rad) * beamHalf;
  const rightPanY = Math.sin(rad) * beamHalf;

  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: FLOOR_Y,
        width: 640,
        height: 460,
        translate: '-50% -100%',
        scale: `${scale}`,
        transformOrigin: '50% 100%',
        opacity,
        pointerEvents: 'none',
        zIndex: 18,
      }}
    >
      <Boil seed="dacin-boil" amp={0.45} rot={0.06}>
        <Paper lift={7} torn>
          {/* Alas tiang dacin */}
          <Slab
            x={220}
            y={420}
            w={200}
            h={40}
            color={PAL.bocor.earth}
            shade={PAL.bocor.earthLo}
            hi={PAL.bocor.hillNear}
            r={6}
          />
          <Slab
            x={260}
            y={396}
            w={120}
            h={28}
            color={PAL.bocor.archHi}
            shade={PAL.bocor.earthLo}
            r={4}
          />
          {/* Tiang utama dacin */}
          <Slab
            x={302}
            y={110}
            w={36}
            h={292}
            color={PAL.bocor.earth}
            shade={PAL.bocor.earthLo}
            hi={PAL.bocor.archHi}
            r={6}
          />

          {/* Lengan ayun dacin */}
          <div
            style={{
              position: 'absolute',
              left: 320,
              top: 126,
              width: 480,
              height: 24,
              translate: '-50% -50%',
              rotate: `${tiltDeg}deg`,
              backgroundColor: PAL.bocor.ocher,
              border: `3px solid ${PAL.bocor.ink}`,
              borderRadius: 10,
            }}
          />

          {/* Puncak engsel dacin */}
          <div
            style={{
              position: 'absolute',
              left: 320,
              top: 126,
              width: 44,
              height: 44,
              translate: '-50% -50%',
              borderRadius: '50%',
              backgroundColor: PAL.coin.gold,
              border: `3px solid ${PAL.bocor.ink}`,
            }}
          />

          {/* Piring kiri (sisi "curang": peti gelap berat yang terangkat naik) */}
          <div
            style={{
              position: 'absolute',
              left: 320 + leftPanX,
              top: 126 + leftPanY,
              width: 150,
              height: 170,
              translate: '-50% 0',
            }}
          >
            {/* Tali penggantung kiri */}
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 0,
                width: 3,
                height: 108,
                backgroundColor: PAL.bocor.ink,
                rotate: '14deg',
                transformOrigin: 'top center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 34,
                top: 0,
                width: 3,
                height: 108,
                backgroundColor: PAL.bocor.ink,
                rotate: '-14deg',
                transformOrigin: 'top center',
              }}
            />
            {/* Beban kotak gelap terbelah di piring kiri */}
            <Slab
              x={38}
              y={58}
              w={74}
              h={46}
              color={PAL.bocor.earthLo}
              shade={PAL.bocor.ink}
              r={4}
              rot={-4}
            />
            {/* Piring timbangan kiri */}
            <Slab
              x={10}
              y={102}
              w={130}
              h={22}
              color={PAL.bocor.hillNear}
              shade={PAL.bocor.earthLo}
              r="4px 4px 24px 24px"
            />
          </div>

          {/* Piring kanan (sisi "benar": koin emas & rumah mungil yang turun mantap) */}
          <div
            style={{
              position: 'absolute',
              left: 320 + rightPanX,
              top: 126 + rightPanY,
              width: 150,
              height: 170,
              translate: '-50% 0',
            }}
          >
            {/* Tali penggantung kanan */}
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 0,
                width: 3,
                height: 108,
                backgroundColor: PAL.bocor.ink,
                rotate: '14deg',
                transformOrigin: 'top center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 34,
                top: 0,
                width: 3,
                height: 108,
                backgroundColor: PAL.bocor.ink,
                rotate: '-14deg',
                transformOrigin: 'top center',
              }}
            />
            {/* Koin emas terang di piring kanan (sisi benar) */}
            <PaperCoinDisc x={75} y={76} size={52} glow={1.2} />
            {/* Piring timbangan kanan */}
            <Slab
              x={10}
              y={102}
              w={130}
              h={22}
              color={PAL.sampai.marigold}
              shade={PAL.sampai.terracotta}
              hi={PAL.sampai.cream}
              r="4px 4px 24px 24px"
            />
          </div>
        </Paper>
      </Boil>
    </div>
  );
};

// Rumah kertas pop-up book di Dunia Sampai (kanan), dengan jendela yang menyala hangat
const PopUpHouse: React.FC<{
  x: number;
  baseY: number;
  popScale: number;
  windowLit: number;
}> = ({x, baseY, popScale, windowLit}) => {
  if (popScale <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY,
        width: 184,
        height: 188,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        scale: `1 ${popScale}`,
        pointerEvents: 'none',
      }}
    >
      {/* Pendar cahaya hangat saat koin sampai ke rumah */}
      {windowLit > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '55%',
            width: 250,
            height: 230,
            translate: '-50% -50%',
            borderRadius: '50%',
            opacity: windowLit,
            background:
              'radial-gradient(circle, rgba(255,230,130,0.65) 0%, rgba(242,169,59,0.28) 48%, rgba(0,0,0,0) 74%)',
          }}
        />
      ) : null}

      <Paper lift={6}>
        {/* Dinding rumah krem terang */}
        <Slab
          x={22}
          y={68}
          w={140}
          h={120}
          color={PAL.sampai.cream}
          shade="#DFCCA8"
          hi="#FFF8EB"
          r={4}
          style={{border: `3px solid ${PAL.sampai.ink}`}}
        />

        {/* Atap pelana terakota bergaya potongan kertas */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 8,
            width: 176,
            height: 70,
            backgroundColor: PAL.sampai.terracotta,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            filter: 'drop-shadow(0 4px 0 #3B2A20)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            width: 152,
            height: 56,
            backgroundColor: PAL.sampai.terracottaLo,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            opacity: 0.35,
          }}
        />

        {/* Pintu kayu teal */}
        <Slab
          x={40}
          y={114}
          w={38}
          h={74}
          color={PAL.sampai.teal}
          shade={PAL.sampai.tealLo}
          r="6px 6px 0 0"
          style={{border: `2.5px solid ${PAL.sampai.ink}`}}
        />

        {/* Jendela rumah kertas yang menyala hangat ketika koin sampai */}
        <div
          style={{
            position: 'absolute',
            left: 94,
            top: 102,
            width: 48,
            height: 48,
            borderRadius: 6,
            backgroundColor:
              windowLit > 0.05 ? PAL.sampai.windowGlow : '#7C6E63',
            border: `3px solid ${PAL.sampai.ink}`,
            boxShadow:
              windowLit > 0.05
                ? `0 0 ${Math.round(28 * windowLit)}px rgba(255, 224, 112, 0.95), inset 0 0 12px rgba(242, 169, 59, 0.85)`
                : 'none',
          }}
        >
          {/* Bingkai palang jendela */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 3,
              translate: '-50% 0',
              backgroundColor: PAL.sampai.ink,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 3,
              translate: '0 -50%',
              backgroundColor: PAL.sampai.ink,
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

// Bingkai panggung teater kertas (lengkung atas + tirai samping + lantai panggung)
const ProsceniumFrame: React.FC<{
  topColor: string;
  trimColor: string;
  floorColor: string;
  floorHi: string;
  torn?: boolean;
}> = ({topColor, trimColor, floorColor, floorHi, torn = false}) => (
  <>
    {/* Lantai panggung */}
    <Slab
      x={0}
      y={FLOOR_Y}
      w={1280}
      h={720 - FLOOR_Y}
      color={floorColor}
      r={0}
      grain={0.6}
    />
    <Slab
      x={0}
      y={FLOOR_Y - 22}
      w={1280}
      h={26}
      color={floorHi}
      shade={floorColor}
      shadeH={0.35}
      r={0}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y + 38,
        height: 3,
        backgroundColor: C.floorLo,
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y + 78,
        height: 3,
        backgroundColor: C.floorLo,
        opacity: 0.7,
      }}
    />

    {/* Lengkung atas & pilar bingkai panggung kertas */}
    <Paper lift={6} torn={torn}>
      {/* Pilar kiri & kanan */}
      <Slab x={0} y={0} w={36} h={FLOOR_Y} color={topColor} shade={trimColor} r={0} />
      <Slab x={1244} y={0} w={36} h={FLOOR_Y} color={topColor} shade={trimColor} r={0} />
      {/* Pelipit lengkung atas panggung */}
      <Slab
        x={0}
        y={0}
        w={1280}
        h={38}
        color={topColor}
        shade={trimColor}
        shadeH={0.28}
        r="0 0 18px 18px"
      />
      {/* Lekuk sudut kiri & kanan atas */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 28,
          width: 68,
          height: 54,
          backgroundColor: topColor,
          borderRadius: '0 0 48px 0',
          borderRight: `3px solid ${trimColor}`,
          borderBottom: `3px solid ${trimColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 26,
          top: 28,
          width: 68,
          height: 54,
          backgroundColor: topColor,
          borderRadius: '0 0 0 48px',
          borderLeft: `3px solid ${trimColor}`,
          borderBottom: `3px solid ${trimColor}`,
        }}
      />
    </Paper>
  </>
);

// Strip teks kertas (HANYA merender teks yang diizinkan: "Uang yang sama." dan "ia sampai")
const PaperTextStrip: React.FC<{
  x: number;
  y: number;
  text: 'Uang yang sama.' | 'ia sampai';
  at: number;
  opacity?: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed?: string;
  torn?: boolean;
}> = ({
  x,
  y,
  text,
  at,
  opacity = 1,
  bg = PAL.sampai.cream,
  color = PAL.sampai.ink,
  size = 38,
  rot = -1.2,
  seed = 'strip',
  torn = true,
}) => {
  const f = useCurrentFrame();
  if (f < at || opacity <= 0.01) return null;

  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.35} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            opacity,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              padding: '14px 32px 16px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: size,
              color,
              lineHeight: 1.08,
              whiteSpace: 'nowrap',
              border: `3px solid ${color}`,
              filter: `url(#${torn ? 'torn' : 'rough'}) drop-shadow(2px 6px 8px rgba(0,0,0,0.36))`,
            }}
          >
            {text}
            {/* Selotip kertas polos di sudut kiri & kanan */}
            <div
              style={{
                position: 'absolute',
                top: -11,
                left: -16,
                width: 48,
                height: 18,
                rotate: '-28deg',
                backgroundColor: C.tape,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -11,
                right: -16,
                width: 48,
                height: 18,
                rotate: '28deg',
                backgroundColor: C.tape,
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      </Boil>
    </PopIn>
  );
};

export const PB08: React.FC = () => {
  const f = useCurrentFrame();
  // Gerak Dunia Bocor terpatah seperti stop-motion (~10 fps -> kuantisasi 3 frame)
  const fBocor = Math.floor(f / 3) * 3;

  // =========================================================================
  // BEAT 1 (Frame 0-53): "Sekarang, bayangkan sebaliknya."
  // Dacin kertas berayun dari miring sisi curang (-16 deg) ke sisi benar (+16 deg),
  // lalu seluruh panggung terlipat di garis tengah seperti buku (50:50).
  // =========================================================================
  const dacinTilt = interpolate(fBocor, [0, 27], [-16, 16], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const dacinScale = interpolate(f, [28, 48], [1, 0.86], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const dacinOpacity = interpolate(f, [32, 50], [1, 0], CLAMP);

  // Lipatan engsel buku membuka Dunia Sampai di separuh kanan (Frame 26-53)
  const bookOpen = interpolate(f, [26, 53], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const foldLeafAngle = interpolate(f, [26, 53], [-178, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const rightClipX = Math.round(
    interpolate(bookOpen, [0, 1], [1280, 640], CLAMP),
  );

  // =========================================================================
  // BEAT 2 (Frame 70-220): "Bayangkan uang yang sama, setiap rupiahnya, dipakai dengan bijak."
  // Menara koin kertas yang IDENTIK muncul di kedua separuh panggung, tingginya sama persis.
  // Garis penggaris putus-putus melintasi kedua menara (tanpa angka apa pun).
  // =========================================================================
  // BEAT 3 (Frame 236-276): "Bukan uang yang lebih banyak."
  // Kedua menara tetap berdiri sejajar, tidak ada yang bertambah tinggi (progress terkunci 1).
  // =========================================================================
  const leftTowerProg = interpolate(fBocor, [70, 145], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightTowerProg = interpolate(f, [70, 145], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.1)),
  });

  // Garis penggaris putus-putus melintasi puncak kedua menara (tanpa angka)
  const rulerDraw = interpolate(f, [146, 192], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  // Denyut halus garis penggaris saat "Bukan uang yang lebih banyak" (236-276) menegaskan tinggi tetap sama
  const rulerHoldGlow = interpolate(
    f,
    [236, 256, 276, 329, 345],
    [0.5, 1, 0.6, 0.6, 0],
    CLAMP,
  );
  const rulerOpacity =
    interpolate(f, [146, 158], [0, 1], CLAMP) *
    interpolate(f, [328, 344], [1, 0], CLAMP);

  // =========================================================================
  // BEAT 4 (Frame 290-314): "Uang yang sama."
  // Teks "Uang yang sama." muncul sebagai strip kertas menyeberangi garis engsel.
  // =========================================================================
  const sameMoneyOpacity = interpolate(f, [362, 376], [1, 0], CLAMP);

  // =========================================================================
  // BEAT 5 (Frame 329-397): "Hanya saja, kali ini, ia sampai."
  // Kiri: koin emas bergulir lalu jatuh ke lubang di tengah jalurnya dan lenyap.
  // Kanan: koin yang sama bergulir penuh sampai ke jendela rumah yang menyala hangat.
  // Teks "ia sampai" muncul di separuh kanan.
  // Lalu separuh kiri menggeser keluar seperti pintu ganda yang membuka, dan separuh kanan
  // memenuhi layar, ditahan sampai frame 397.
  // =========================================================================
  // Koin kiri (Dunia Bocor - gerak stop-motion fBocor): bergulir dari menara (x=220) ke lubang (x=435) lalu jatuh
  const leftCoinRoll = interpolate(fBocor, [329, 348], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const leftCoinFall = interpolate(fBocor, [348, 362], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const leftCoinX = interpolate(leftCoinRoll, [0, 1], [235, 435], CLAMP);
  const leftCoinY =
    FLOOR_Y - 46 + interpolate(leftCoinFall, [0, 1], [0, 110], CLAMP);
  const leftCoinOpacity =
    interpolate(f, [329, 333], [0, 1], CLAMP) *
    interpolate(fBocor, [354, 362], [1, 0], CLAMP);
  const leftCoinRot = leftCoinRoll * 320 + leftCoinFall * 90;

  // Koin kanan (Dunia Sampai - gerak mulus): bergulir dari menara (x=860) sampai ke rumah (x=1120)
  const rightCoinRoll = interpolate(f, [329, 360], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightCoinX = interpolate(rightCoinRoll, [0, 1], [860, 1110], CLAMP);
  const rightCoinY =
    FLOOR_Y - 46 - Math.sin(rightCoinRoll * Math.PI * 2) * 6;
  const rightCoinOpacity =
    interpolate(f, [329, 333], [0, 1], CLAMP) *
    interpolate(f, [356, 364], [1, 0], CLAMP);
  const rightCoinRot = rightCoinRoll * 540;

  // Rumah kertas pop-up di kanan berdiri sejak Dunia Sampai mekar, lalu jendelanya menyala saat koin tiba (f=354)
  const housePop = interpolate(f, [44, 72], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const windowLit = interpolate(f, [352, 366], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Pintu kiri (Dunia Bocor) menggeser keluar ke kiri (Frame 366-390), Dunia Sampai memenuhi layar penuh dan ditahan sampai 397
  const doorOpenProg = interpolate(f, [366, 390], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const leftDoorShiftX = Math.round(
    interpolate(doorOpenProg, [0, 1], [0, -680], CLAMP),
  );
  // Batas kiri Dunia Sampai melebar dari x=640 (50:50) menjadi x=0 (layar penuh) seiring pintu kiri bergeser keluar
  const effectiveRightClipX =
    f < 53
      ? rightClipX
      : Math.round(interpolate(doorOpenProg, [0, 1], [640, 0], CLAMP));

  // Koordinat menara koin identik:
  // Di kiri: x = 220; Di kanan: x = 860 (saat layar penuh di akhir, x sedikit bergeser mulus agar komposisi panggung seimbang)
  const rightStagePanX = Math.round(
    interpolate(doorOpenProg, [0, 1], [0, -110], CLAMP),
  );
  const towerTopY = FLOOR_Y - (10 * 18 + 22) - 18; // puncak menara koin yang identik di kedua sisi

  // Sinar matahari pagi hangat di Dunia Sampai
  const sunBreath = Math.sin(f * 0.06) * 6;

  return (
    <AbsoluteFill style={{backgroundColor: PAL.bocor.sky}}>
      <PaperDefs />
      <FilmWeave amp={0.22} flicker={0.2}>
        <CameraPush dur={PB08_DUR} to={1.04} origin="55% 48%">
          {/* =============================================================== */}
          {/* LAPISAN 1: DUNIA SAMPAI (Kanan -> melebar memenuhi layar penuh) */}
          {/* =============================================================== */}
          <AbsoluteFill
            style={{
              clipPath: `inset(0px 0px 0px ${effectiveRightClipX}px)`,
            }}
          >
            {/* Langit pagi persik-aqua hangat */}
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, ${PAL.sampai.skyTop} 0%, ${PAL.sampai.cream} 52%, ${PAL.sampai.skyBot} 100%)`,
              }}
            />
            {/* Pendar matahari pagi */}
            <div
              style={{
                position: 'absolute',
                left: 980 + rightStagePanX * 0.4,
                top: 130,
                width: 240 + sunBreath,
                height: 240 + sunBreath,
                translate: '-50% -50%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,244,200,0.88) 0%, rgba(242,169,59,0.32) 48%, rgba(242,169,59,0) 74%)',
              }}
            />

            {/* Lapisan bukit kertas bersih (5 lapisan parallax lembut) */}
            <Paper lift={4}>
              {/* Bukit jauh teal */}
              <div
                style={{
                  position: 'absolute',
                  left: 480 + rightStagePanX * 0.3,
                  top: 340,
                  width: 920,
                  height: 280,
                  borderRadius: '52% 48% 0 0',
                  backgroundColor: PAL.sampai.teal,
                  opacity: 0.78,
                }}
              />
              {/* Bukit tengah hijau daun */}
              <div
                style={{
                  position: 'absolute',
                  left: 690 + rightStagePanX * 0.5,
                  top: 390,
                  width: 740,
                  height: 230,
                  borderRadius: '48% 52% 0 0',
                  backgroundColor: PAL.sampai.leaf,
                }}
              />
              {/* Bukit dekat hijau hangat */}
              <div
                style={{
                  position: 'absolute',
                  left: 340 + rightStagePanX * 0.6,
                  top: 438,
                  width: 680,
                  height: 180,
                  borderRadius: '55% 45% 0 0',
                  backgroundColor: PAL.sampai.leafLo,
                }}
              />
            </Paper>

            {/* Bingkai panggung Dunia Sampai (tepi bersih, hangat) */}
            <ProsceniumFrame
              topColor={PAL.sampai.terracotta}
              trimColor={PAL.sampai.terracottaLo}
              floorColor={PAL.sampai.floor}
              floorHi={PAL.sampai.floorHi}
              torn={false}
            />

            {/* Isi panggung Dunia Sampai */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                translate: `${rightStagePanX}px 0px`,
              }}
            >
              {/* Jalur kertas mulus dari menara koin menuju rumah */}
              <Paper lift={3}>
                <Slab
                  x={840}
                  y={FLOOR_Y - 18}
                  w={310}
                  h={16}
                  color={PAL.sampai.marigold}
                  shade={PAL.sampai.terracotta}
                  hi={PAL.sampai.cream}
                  r={8}
                />
              </Paper>

              {/* Tokoh warga tanpa wajah (Figure mgkit) berdiri menyambut di dekat rumah */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: interpolate(f, [50, 74], [0, 1], CLAMP),
                }}
              >
                <Figure
                  x={1015}
                  y={FLOOR_Y - 16}
                  s={0.78}
                  shirt={PAL.sampai.teal}
                />
              </div>

              {/* Rumah kertas pop-up book dengan jendela menyala hangat */}
              <PopUpHouse
                x={1145}
                baseY={FLOOR_Y - 16}
                popScale={housePop}
                windowLit={windowLit}
              />

              {/* Menara koin emas kanan (IDENTIK dengan kiri) */}
              <CoinTower
                cx={860}
                baseY={FLOOR_Y - 18}
                progress={rightTowerProg}
                torn={false}
              />

              {/* Koin emas kanan yang bergulir penuh sampai ke rumah (Frame 329-364) */}
              {rightCoinOpacity > 0.01 ? (
                <div style={{position: 'absolute', inset: 0, opacity: rightCoinOpacity}}>
                  <PaperCoinDisc
                    x={rightCoinX}
                    y={rightCoinY}
                    size={54}
                    rot={rightCoinRot}
                    glow={1.3}
                  />
                </div>
              ) : null}

              {/* Teks "ia sampai" di separuh kanan saat koin menyalakan rumah (Frame 344-397) */}
              <PaperTextStrip
                x={985}
                y={220}
                text="ia sampai"
                at={344}
                bg={PAL.sampai.cream}
                color={PAL.sampai.ink}
                size={42}
                rot={-1.5}
                seed="ia-sampai"
                torn={false}
              />
            </div>
          </AbsoluteFill>

          {/* =============================================================== */}
          {/* LAPISAN 2: DUNIA BOCOR (Penuh di awal -> separuh kiri -> pintu keluar) */}
          {/* =============================================================== */}
          <AbsoluteFill
            style={{
              width: effectiveRightClipX,
              overflow: 'hidden',
              translate: `${leftDoorShiftX}px 0px`,
              boxShadow:
                doorOpenProg > 0.01 && doorOpenProg < 0.99
                  ? '14px 0 28px rgba(0,0,0,0.45)'
                  : 'none',
            }}
          >
            <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720}}>
              {/* Langit sore berdebu, kontras rendah */}
              <Slab
                x={0}
                y={0}
                w={1280}
                h={720}
                color={PAL.bocor.sky}
                shade={PAL.bocor.skyLo}
                shadeH={0.4}
                r={0}
                grain={0.7}
              />

              {/* Bukit kertas tepi sobek & kusam (hanya 3 lapisan datar) */}
              <Paper lift={3} torn>
                <div
                  style={{
                    position: 'absolute',
                    left: -40,
                    top: 390,
                    width: 620,
                    height: 220,
                    borderRadius: '44% 56% 0 0',
                    backgroundColor: PAL.bocor.hillFar,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 180,
                    top: 435,
                    width: 540,
                    height: 180,
                    borderRadius: '52% 48% 0 0',
                    backgroundColor: PAL.bocor.hillNear,
                  }}
                />
              </Paper>

              {/* Noda lembap & bayangan tepi menggelap khas Dunia Bocor */}
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 35% 45%, rgba(0,0,0,0) 35%, rgba(46,34,26,0.38) 100%)',
                }}
              />

              {/* Bingkai panggung Dunia Bocor (tepi sobek) */}
              <ProsceniumFrame
                topColor={PAL.bocor.arch}
                trimColor={PAL.bocor.earthLo}
                floorColor={PAL.bocor.earth}
                floorHi={PAL.bocor.archHi}
                torn
              />

              {/* Siluet rumah desa gelap/retak di kejauhan kiri */}
              {f >= 40 ? (
                <Paper lift={3} torn>
                  <Slab
                    x={470}
                    y={FLOOR_Y - 110}
                    w={96}
                    h={92}
                    color={PAL.bocor.hillNear}
                    shade={PAL.bocor.earthLo}
                    r={3}
                    rot={2.2}
                  >
                    {/* Jendela gelap tanpa cahaya */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 52,
                        top: 30,
                        width: 24,
                        height: 24,
                        backgroundColor: PAL.bocor.ink,
                        opacity: 0.75,
                      }}
                    />
                  </Slab>
                  <div
                    style={{
                      position: 'absolute',
                      left: 460,
                      top: FLOOR_Y - 148,
                      width: 116,
                      height: 44,
                      rotate: '2.2deg',
                      backgroundColor: PAL.bocor.earth,
                      clipPath: 'polygon(48% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                </Paper>
              ) : null}

              {/* Jalur kertas retak dengan LUBANG GELAP di tengahnya (tempat koin kiri jatuh) */}
              {f >= 50 ? (
                <>
                  <Paper lift={2} torn>
                    {/* Ruas jalur sebelum lubang */}
                    <Slab
                      x={210}
                      y={FLOOR_Y - 18}
                      w={175}
                      h={14}
                      color={PAL.bocor.ocher}
                      shade={PAL.bocor.earthLo}
                      r={4}
                    />
                    {/* Ruas jalur sesudah lubang (patah) */}
                    <Slab
                      x={480}
                      y={FLOOR_Y - 16}
                      w={85}
                      h={12}
                      color={PAL.bocor.hillNear}
                      shade={PAL.bocor.earthLo}
                      r={4}
                      rot={3}
                    />
                  </Paper>
                  {/* Lubang menganga di tengah jalur kiri (x=435) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 435,
                      top: FLOOR_Y - 12,
                      width: 92,
                      height: 30,
                      translate: '-50% -50%',
                      borderRadius: '50%',
                      backgroundColor: PAL.bocor.ink,
                      border: `3px solid ${PAL.bocor.earthLo}`,
                      boxShadow: 'inset 0 6px 10px rgba(0,0,0,0.85)',
                    }}
                  />
                </>
              ) : null}

              {/* Tokoh warga tanpa wajah (Figure mgkit) dengan bahu tertunduk di Dunia Bocor */}
              {f >= 50 ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: interpolate(f, [50, 74], [0, 0.85], CLAMP),
                  }}
                >
                  <Figure
                    x={105}
                    y={FLOOR_Y - 16}
                    s={0.76}
                    shirt={PAL.bocor.hillNear}
                  />
                </div>
              ) : null}

              {/* Menara koin emas kiri (IDENTIK tingginya dengan kanan) */}
              <CoinTower
                cx={220}
                baseY={FLOOR_Y - 18}
                progress={leftTowerProg}
                torn
              />

              {/* Koin emas kiri yang bergulir lalu jatuh ke lubang dan lenyap (Frame 329-362) */}
              {leftCoinOpacity > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 640,
                    height: FLOOR_Y - 6,
                    overflow: 'hidden',
                    opacity: leftCoinOpacity,
                  }}
                >
                  <PaperCoinDisc
                    x={leftCoinX}
                    y={leftCoinY}
                    size={54}
                    rot={leftCoinRot}
                    glow={0.9}
                  />
                </div>
              ) : null}

              {/* Timbangan Dacin Kertas pada awal adegan (Frame 0-50) */}
              <PaperDacin
                tiltDeg={dacinTilt}
                opacity={dacinOpacity}
                scale={dacinScale}
              />
            </div>
          </AbsoluteFill>

          {/* =============================================================== */}
          {/* LAPISAN 3: ENGSEL BUKU TENGAH & PENGUKUR TINGGI MENARA IDENTIK  */}
          {/* =============================================================== */}
          {/* Efek halaman kertas yang membalik saat panggung terlipat seperti buku (Frame 26-53) */}
          {f >= 26 && f <= 55 ? (
            <div
              style={{
                position: 'absolute',
                left: 640,
                top: 24,
                width: Math.max(
                  6,
                  Math.round(Math.sin(bookOpen * Math.PI) * 140),
                ),
                height: FLOOR_Y - 24,
                translate: '-50% 0',
                rotate: `${foldLeafAngle * 0.02}deg`,
                background:
                  'linear-gradient(90deg, rgba(46,34,26,0.45) 0%, #F6E8CC 48%, #D9C7A3 85%, rgba(46,34,26,0.35) 100%)',
                boxShadow: '0 0 28px rgba(0,0,0,0.45)',
                zIndex: 28,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* Garis lipatan engsel cermin di x=640 (selama layar terbelah 50:50) */}
          {f >= 36 && doorOpenProg < 0.98 ? (
            <div
              style={{
                position: 'absolute',
                left: 640 + leftDoorShiftX,
                top: 0,
                width: 10,
                height: 720,
                translate: '-50% 0',
                background:
                  'linear-gradient(90deg, rgba(46,34,26,0.65) 0%, rgba(255,248,230,0.75) 50%, rgba(59,42,32,0.55) 100%)',
                boxShadow: '0 0 18px rgba(0,0,0,0.42)',
                zIndex: 26,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* Garis penggaris putus-putus melintasi kedua menara koin (Frame 146-344, TANPA ANGKA) */}
          {rulerOpacity > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: rulerOpacity,
                zIndex: 30,
                pointerEvents: 'none',
              }}
            >
              <Boil seed="ruler-line" amp={0.3} rot={0.03}>
                {/* Strip penggaris kertas tipis dengan takik-takik tanpa angka */}
                <div
                  style={{
                    position: 'absolute',
                    left: 140,
                    top: towerTopY - 26,
                    width: Math.round(800 * rulerDraw),
                    height: 22,
                    backgroundColor: PAL.sampai.cream,
                    border: `2.5px solid ${PAL.sampai.ink}`,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: `0 4px 10px rgba(0,0,0,0.28), 0 0 ${Math.round(16 * rulerHoldGlow)}px rgba(245,194,73,0.55)`,
                  }}
                >
                  {/* Takik-takik penggaris kertas (murni garis, tanpa angka) */}
                  {Array.from({length: 32}).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: 14 + i * 24,
                        bottom: 0,
                        width: 2,
                        height: i % 4 === 0 ? 12 : 7,
                        backgroundColor: PAL.sampai.ink,
                        opacity: 0.75,
                      }}
                    />
                  ))}
                </div>

                {/* Garis putus-putus sejajar tepat di puncak kedua menara koin */}
                <svg
                  width={1280}
                  height={720}
                  style={{position: 'absolute', left: 0, top: 0}}
                >
                  <line
                    x1={145}
                    y1={towerTopY}
                    x2={145 + 790 * rulerDraw}
                    y2={towerTopY}
                    stroke={PAL.sampai.ink}
                    strokeWidth={4}
                    strokeDasharray="14 10"
                    strokeLinecap="round"
                  />
                  {/* Penanda siku di puncak menara kiri & kanan */}
                  {rulerDraw > 0.15 ? (
                    <circle
                      cx={220}
                      cy={towerTopY}
                      r={7}
                      fill={PAL.coin.gold}
                      stroke={PAL.sampai.ink}
                      strokeWidth={3}
                    />
                  ) : null}
                  {rulerDraw > 0.92 ? (
                    <circle
                      cx={860}
                      cy={towerTopY}
                      r={7}
                      fill={PAL.coin.gold}
                      stroke={PAL.sampai.ink}
                      strokeWidth={3}
                    />
                  ) : null}
                </svg>
              </Boil>
            </div>
          ) : null}

          {/* =============================================================== */}
          {/* LAPISAN 4: STRIP KERTAS "Uang yang sama." MENYEBERANGI ENGSEL   */}
          {/* =============================================================== */}
          <PaperTextStrip
            x={640}
            y={180}
            text="Uang yang sama."
            at={290}
            opacity={sameMoneyOpacity}
            bg={PAL.sampai.cream}
            color={PAL.sampai.ink}
            size={44}
            rot={-0.8}
            seed="uang-sama"
            torn
          />
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
