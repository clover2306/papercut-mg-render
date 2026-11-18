// Adegan MG-13 "Dituntut Setiap Hari" (PENUTUP video, TIDAK BOLEH DIPOTONG):
// Menara koin kertas berpendar emas berdiri di kiri panggung ("Uangnya sudah ada."),
// jalur koin terbentang menuju rumah-rumah desa di kanan namun ruas terakhir masih berupa
// garis putus-putus kosong dengan cap lingkaran putus-putus ("jaminan") yang diam menunggu,
// tangan-tangan siluet muncul dari tepi bawah menarik ruas jalur hingga tersambung utuh,
// cakram matahari & bulan kertas berputar pelan ("Setiap hari"), lalu kamera mundur memperlihatkan
// barisan siluet warga tanpa wajah berdiri memegang tiap ruas jalur di bawah langit Dunia Sampai penuh
// yang cerah ("Oleh kita semua.") dan ditahan sampai frame 402.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB13_DUR = 402;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet Dunia Sampai (dari suasana menahan yang kalem menuju Dunia Sampai penuh yang cerah)
const PAL = {
  wait: {
    skyTop: '#DECBB1',
    skyMid: '#D8C7AE',
    skyBot: '#C5C8BE',
    hillFar: '#B5AC9A',
    hillMid: '#9B9686',
    hillNear: '#7D7A6C',
    windowOff: '#685C52',
  },
  sampai: {
    skyTop: '#F8D8B8',
    skyMid: '#F6E8CC',
    skyBot: '#CBE7E2',
    cream: '#F6E8CC',
    creamHi: '#FFF8EB',
    creamLo: '#DFCCA8',
    marigold: '#F2A93B',
    marigoldHi: '#FFD470',
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
    glow: 'rgba(245, 194, 73, 0.45)',
  },
};

type AllowedText =
  | 'Uangnya sudah ada.'
  | 'jaminan'
  | 'Setiap hari'
  | 'Oleh kita semua.';

// Koin kertas: bulat polos dengan cincin timbul, tanpa gambar, angka, atau lambang
const PaperCoinDisc: React.FC<{
  x: number;
  y: number;
  size: number;
  rot?: number;
  glow?: number;
}> = ({x, y, size, rot = 0, glow = 1}) => {
  const inner = Math.round(size * 0.66);
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
        border: `2.5px solid ${PAL.coin.goldShade}`,
        boxShadow:
          glow > 0.05
            ? `0 0 ${Math.round(16 * glow)}px ${PAL.coin.glow}, 1px 3px 5px rgba(0,0,0,0.28)`
            : '1px 3px 5px rgba(0,0,0,0.28)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: inner,
          height: inner,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `2px solid ${PAL.coin.goldRim}`,
          backgroundColor: PAL.coin.goldHi,
          opacity: 0.72,
        }}
      />
    </div>
  );
};

// Menara koin kertas yang sama seperti di awal video (MG-02 & MG-08), berdiri di kiri panggung & berpendar emas
const CoinTower: React.FC<{
  cx: number;
  baseY: number;
  progress: number;
  pulse: number;
}> = ({cx, baseY, progress, pulse}) => {
  if (progress <= 0.01) return null;

  const layers = 12;
  const coinW = 122;
  const coinH = 22;
  const stepY = 18;
  const totalH = (layers - 1) * stepY + coinH;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: baseY,
        width: coinW + 48,
        height: totalH + 44,
        translate: '-50% -100%',
        zIndex: 18,
        pointerEvents: 'none',
      }}
    >
      {/* Pendar emas hangat di belakang menara koin */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 8,
          width: Math.round(196 * pulse),
          height: Math.round((totalH * progress + 64) * pulse),
          translate: '-50% 0',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at 50% 58%, rgba(245,194,73,0.58) 0%, rgba(242,169,59,0.22) 54%, rgba(0,0,0,0) 78%)',
        }}
      />
      <Paper lift={6}>
        {Array.from({length: layers}).map((_, idx) => {
          const threshold = idx / layers;
          const localP = interpolate(
            progress,
            [threshold * 0.65, threshold * 0.65 + 0.35],
            [0, 1],
            CLAMP,
          );
          if (localP <= 0.01) return null;
          const yFromBottom = idx * stepY;
          const dropOffset = (1 - localP) * -24;
          const xJitter = ((idx % 3) - 1) * 2;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: 24 + xJitter,
                bottom: yFromBottom - dropOffset,
                width: coinW,
                height: coinH,
                opacity: localP,
                scale: `${0.88 + 0.12 * localP} 1`,
              }}
            >
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
                    opacity: 0.78,
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

// Satu ruas jalur koin kertas (masing-masing punya kepingan koin bulat polos di atasnya)
const PathSegmentPlank: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  progress: number;
  glow: number;
  tiltDeg?: number;
  zIndex?: number;
}> = ({x, y, w, h = 34, progress, glow, tiltDeg = 0, zIndex = 16}) => {
  if (progress <= 0.01) return null;

  const plankColor = interpolateColors(
    glow,
    [0, 1],
    [PAL.sampai.cream, PAL.coin.goldHi],
  );
  const borderColor = PAL.sampai.ink;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h + 12,
        translate: '0 -50%',
        transformOrigin: '0% 50%',
        scale: `${progress} 1`,
        rotate: `${tiltDeg}deg`,
        opacity: interpolate(progress, [0, 0.25, 1], [0, 1, 1], CLAMP),
        zIndex,
        pointerEvents: 'none',
      }}
    >
      {glow > 0.05 ? (
        <div
          style={{
            position: 'absolute',
            left: -12,
            right: -12,
            top: -14,
            bottom: -14,
            borderRadius: 24,
            opacity: glow * 0.65,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255,228,143,0.75) 0%, rgba(242,169,59,0.2) 60%, rgba(0,0,0,0) 80%)',
          }}
        />
      ) : null}
      <Paper lift={5}>
        {/* Sisi tebal bawah ruas jalur kertas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 7,
            width: w,
            height: h,
            borderRadius: 8,
            backgroundColor: PAL.coin.goldRim,
            border: `2.5px solid ${borderColor}`,
          }}
        />
        {/* Permukaan atas ruas jalur kertas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: h,
            borderRadius: 8,
            backgroundColor: plankColor,
            border: `2.5px solid ${borderColor}`,
            boxShadow:
              glow > 0.05
                ? `inset 0 0 ${Math.round(14 * glow)}px rgba(245, 194, 73, 0.75)`
                : 'none',
          }}
        >
          {/* Garis rel emas di sepanjang ruas */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              top: '50%',
              height: 6,
              translate: '0 -50%',
              borderRadius: 3,
              backgroundColor: PAL.coin.gold,
              border: `1.5px solid ${PAL.coin.goldShade}`,
            }}
          />
          {/* Dua koin kertas bulat polos di atas tiap ruas */}
          <PaperCoinDisc
            x={Math.round(w * 0.28)}
            y={Math.round(h * 0.5)}
            size={24}
            glow={0.5 + 0.5 * glow}
          />
          <PaperCoinDisc
            x={Math.round(w * 0.72)}
            y={Math.round(h * 0.5)}
            size={24}
            glow={0.5 + 0.5 * glow}
          />
        </div>
      </Paper>
    </div>
  );
};

// Cap berbentuk lingkaran kosong (garis putus-putus) di ruas terakhir yang belum tersambung,
// lalu terisi hangat ketika ruas terakhir ditarik tersambung. Hanya menampilkan kata "jaminan".
const GuaranteeCircleStamp: React.FC<{
  x: number;
  y: number;
  appear: number;
  filled: number;
  showWord: boolean;
}> = ({x, y, appear, filled, showWord}) => {
  if (appear <= 0.01) return null;

  const ringBorderColor = interpolateColors(
    filled,
    [0, 1],
    [PAL.sampai.ink, PAL.coin.goldShade],
  );
  const bgCol = interpolateColors(
    filled,
    [0, 1],
    ['rgba(246, 232, 204, 0.22)', 'rgba(255, 230, 153, 0.92)'],
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 146,
        height: 146,
        translate: '-50% -50%',
        scale: `${0.75 + 0.25 * appear}`,
        opacity: appear,
        zIndex: 28,
        pointerEvents: 'none',
      }}
    >
      <Boil seed="guarantee-stamp" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'relative',
            width: 146,
            height: 146,
            borderRadius: '50%',
            backgroundColor: bgCol,
            border: `${filled > 0.85 ? '4px solid' : '3.5px dashed'} ${ringBorderColor}`,
            boxShadow:
              filled > 0.1
                ? `0 0 ${Math.round(26 * filled)}px rgba(245, 194, 73, 0.75), 2px 5px 10px rgba(59,42,32,0.24)`
                : '2px 5px 10px rgba(59,42,32,0.18)',
          }}
        >
          {/* Cincin dalam putus-putus pada cap lingkaran */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 118,
              height: 118,
              translate: '-50% -50%',
              borderRadius: '50%',
              border: `${filled > 0.9 ? '2.5px solid' : '2.5px dashed'} ${ringBorderColor}`,
              opacity: 0.78,
            }}
          />
          {/* Teks "jaminan" di tengah cap lingkaran */}
          {showWord ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                translate: '-50% -50%',
                rotate: '-3deg',
                backgroundColor: PAL.sampai.creamHi,
                padding: '5px 14px 7px',
                borderRadius: 4,
                border: `2px solid ${PAL.sampai.ink}`,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 23,
                color: PAL.sampai.ink,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                boxShadow: '1px 3px 6px rgba(0,0,0,0.22)',
              }}
            >
              jaminan
            </div>
          ) : null}
        </div>
      </Boil>
    </div>
  );
};

// Tangan-tangan siluet kertas yang muncul dari tepi bawah panggung, terangkat, dan menarik ruas jalur
const SilhouettePullHands: React.FC<{
  anchorX: number;
  anchorY: number;
  riseProg: number;
  pullOffset: number;
  opacity: number;
}> = ({anchorX, anchorY, riseProg, pullOffset, opacity}) => {
  if (riseProg <= 0.01 || opacity <= 0.01) return null;

  const hands = [
    {dx: -48, tilt: -8, h: 176, shade: PAL.sampai.ink},
    {dx: 0, tilt: 2, h: 192, shade: '#4A3528'},
    {dx: 48, tilt: 10, h: 172, shade: PAL.sampai.ink},
  ];

  const baseBottomY = FLOOR_Y + 46;
  const liftY = interpolate(riseProg, [0, 1], [190, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: anchorX + pullOffset,
        top: anchorY + liftY,
        width: 200,
        height: baseBottomY - anchorY + 40,
        translate: '-50% 0',
        opacity,
        zIndex: 26,
        pointerEvents: 'none',
      }}
    >
      <Paper lift={5}>
        {hands.map((hand, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 100 + hand.dx,
              top: 4,
              width: 44,
              height: hand.h,
              translate: '-50% 0',
              rotate: `${hand.tilt}deg`,
              transformOrigin: '50% 100%',
            }}
          >
            {/* Telapak tangan siluet menggenggam ruas jalur */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 36,
                height: 38,
                translate: '-50% 0',
                borderRadius: '12px 12px 10px 10px',
                backgroundColor: hand.shade,
                border: `2px solid ${PAL.sampai.creamLo}`,
              }}
            />
            {/* Jari-jari siluet */}
            {[-11, -4, 4, 11].map((fx, fi) => (
              <div
                key={fi}
                style={{
                  position: 'absolute',
                  left: 22 + fx,
                  top: -12,
                  width: 7,
                  height: 18,
                  translate: '-50% 0',
                  borderRadius: 4,
                  backgroundColor: hand.shade,
                  border: `1.5px solid ${PAL.sampai.creamLo}`,
                }}
              />
            ))}
            {/* Ibu jari siluet */}
            <div
              style={{
                position: 'absolute',
                left: 2,
                top: 8,
                width: 12,
                height: 20,
                rotate: '-28deg',
                borderRadius: 6,
                backgroundColor: hand.shade,
                border: `1.5px solid ${PAL.sampai.creamLo}`,
              }}
            />
            {/* Lengan bawah siluet menjulur dari tepi bawah panggung */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 32,
                width: 24,
                height: hand.h - 32,
                translate: '-50% 0',
                borderRadius: 6,
                backgroundColor: hand.shade,
                borderLeft: `2px solid ${PAL.sampai.creamLo}`,
                borderRight: `2px solid ${PAL.sampai.creamLo}`,
              }}
            />
          </div>
        ))}
      </Paper>
    </div>
  );
};

// Cakram matahari dan bulan kertas yang berputar pelan sebagai penanda hari berganti (TANPA angka, TANPA wajah)
const SunMoonPaperDisc: React.FC<{
  cx: number;
  cy: number;
  appear: number;
  rotDeg: number;
}> = ({cx, cy, appear, rotDeg}) => {
  if (appear <= 0.01) return null;

  const discSize = 210;
  const rayAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: discSize,
        height: discSize,
        translate: '-50% -50%',
        scale: `${0.7 + 0.3 * appear}`,
        opacity: appear,
        zIndex: 9,
        pointerEvents: 'none',
      }}
    >
      {/* Pendar cahaya lembut di belakang cakram hari */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: discSize + 70,
          height: discSize + 70,
          translate: '-50% -50%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,230,153,0.45) 0%, rgba(242,169,59,0.14) 55%, rgba(0,0,0,0) 76%)',
        }}
      />
      <Paper lift={5}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: discSize,
            height: discSize,
            borderRadius: '50%',
            rotate: `${rotDeg}deg`,
            backgroundColor: PAL.sampai.cream,
            border: `3.5px solid ${PAL.sampai.ink}`,
            overflow: 'hidden',
            boxShadow: '2px 6px 12px rgba(59,42,32,0.28)',
          }}
        >
          {/* Separuh atas: langit pagi hangat (matahari kertas) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: discSize,
              height: discSize / 2,
              backgroundColor: '#FCE4B8',
              borderBottom: `2.5px dashed ${PAL.sampai.ink}`,
            }}
          >
            {/* Matahari kertas polos dengan kelopak sinar segitiga */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 52,
                width: 56,
                height: 56,
                translate: '-50% -50%',
              }}
            >
              {rayAngles.map((ang) => (
                <div
                  key={ang}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 10,
                    height: 36,
                    translate: '-50% -100%',
                    transformOrigin: '50% 100%',
                    rotate: `${ang}deg`,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 12,
                      backgroundColor: PAL.sampai.terracotta,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 44,
                  height: 44,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  backgroundColor: PAL.sampai.marigold,
                  border: `2.5px solid ${PAL.sampai.ink}`,
                }}
              />
            </div>
          </div>

          {/* Separuh bawah: langit malam teal gelap (bulan sabit kertas polos tanpa wajah) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: discSize / 2,
              width: discSize,
              height: discSize / 2,
              backgroundColor: '#244A52',
            }}
          >
            {/* Bulan sabit kertas lewat tumpukan dua lingkaran polos */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 54,
                width: 44,
                height: 44,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: PAL.sampai.windowGlow,
                border: `2.5px solid ${PAL.sampai.ink}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '56%',
                top: 48,
                width: 34,
                height: 34,
                translate: '-50% -50%',
                borderRadius: '50%',
                backgroundColor: '#244A52',
              }}
            />
            {/* Titik-titik bintang kertas bulat kecil */}
            {[
              {x: 46, y: 34, s: 7},
              {x: 158, y: 40, s: 8},
              {x: 64, y: 74, s: 6},
              {x: 144, y: 72, s: 6},
            ].map((st, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: st.x,
                  top: st.y,
                  width: st.s,
                  height: st.s,
                  borderRadius: '50%',
                  backgroundColor: PAL.sampai.creamHi,
                }}
              />
            ))}
          </div>

          {/* Poros kancing kertas di pusat cakram */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 18,
              height: 18,
              translate: '-50% -50%',
              borderRadius: '50%',
              backgroundColor: PAL.coin.gold,
              border: `2.5px solid ${PAL.sampai.ink}`,
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

// Rumah desa kertas pop-up di kanan panggung dengan jendela yang berpendar hangat
const VillagePaperHouse: React.FC<{
  x: number;
  baseY: number;
  scale?: number;
  roofColor: string;
  roofShade: string;
  doorColor: string;
  litProg: number;
  twoWindows?: boolean;
  zIndex?: number;
}> = ({
  x,
  baseY,
  scale = 1,
  roofColor,
  roofShade,
  doorColor,
  litProg,
  twoWindows = true,
  zIndex = 14,
}) => {
  const winBg = interpolateColors(
    litProg,
    [0, 1],
    [PAL.wait.windowOff, PAL.sampai.windowGlow],
  );
  const wallBg = interpolateColors(
    litProg,
    [0, 1],
    ['#E3D5BD', PAL.sampai.cream],
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY,
        width: 170,
        height: 168,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        scale: `${scale}`,
        zIndex,
        pointerEvents: 'none',
      }}
    >
      {litProg > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '56%',
            width: 245,
            height: 215,
            translate: '-50% -50%',
            borderRadius: '50%',
            opacity: litProg,
            background:
              'radial-gradient(circle, rgba(255,230,130,0.72) 0%, rgba(242,169,59,0.28) 50%, rgba(0,0,0,0) 76%)',
          }}
        />
      ) : null}

      <Paper lift={5}>
        <Slab
          x={20}
          y={64}
          w={130}
          h={104}
          color={wallBg}
          shade={PAL.sampai.creamLo}
          hi={PAL.sampai.creamHi}
          r={4}
          style={{border: `3px solid ${PAL.sampai.ink}`}}
        />
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 10,
            width: 162,
            height: 62,
            backgroundColor: roofColor,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            filter: `drop-shadow(0 3px 0 ${PAL.sampai.ink})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 85,
            top: 10,
            width: 81,
            height: 62,
            backgroundColor: roofShade,
            clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
            opacity: 0.38,
          }}
        />
        <Slab
          x={34}
          y={104}
          w={32}
          h={64}
          color={doorColor}
          shade={PAL.sampai.ink}
          shadeH={0.15}
          r="5px 5px 0 0"
          style={{border: `2.5px solid ${PAL.sampai.ink}`}}
        />
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: 94,
            width: twoWindows ? 30 : 44,
            height: 38,
            borderRadius: 5,
            backgroundColor: winBg,
            border: `2.5px solid ${PAL.sampai.ink}`,
            boxShadow:
              litProg > 0.05
                ? `0 0 ${Math.round(24 * litProg)}px rgba(255, 224, 112, 0.95), inset 0 0 10px rgba(242, 169, 59, 0.85)`
                : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2.5,
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
              height: 2.5,
              translate: '0 -50%',
              backgroundColor: PAL.sampai.ink,
            }}
          />
        </div>
        {twoWindows ? (
          <div
            style={{
              position: 'absolute',
              left: 114,
              top: 94,
              width: 26,
              height: 38,
              borderRadius: 5,
              backgroundColor: winBg,
              border: `2.5px solid ${PAL.sampai.ink}`,
              boxShadow:
                litProg > 0.05
                  ? `0 0 ${Math.round(22 * litProg)}px rgba(255, 224, 112, 0.95), inset 0 0 8px rgba(242, 169, 59, 0.85)`
                  : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 2.5,
                translate: '0 -50%',
                backgroundColor: PAL.sampai.ink,
              }}
            />
          </div>
        ) : null}
      </Paper>
    </div>
  );
};

// Warga siluet TANPA WAJAH (memakai Figure dari mgkit) yang berdiri sepanjang jalur memegang satu ruas jalur
const CitizenHoldingSegment: React.FC<{
  x: number;
  baseY: number;
  shirt: string;
  scale: number;
  enterProg: number;
  caping?: boolean;
  scarf?: boolean;
}> = ({x, baseY, shirt, scale, enterProg, caping = false, scarf = false}) => {
  if (enterProg <= 0.01) return null;

  const yOffset = (1 - enterProg) * 56;
  const w = 90 * scale;
  const h = 190 * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY + yOffset,
        width: w,
        height: h,
        translate: '-50% -100%',
        opacity: enterProg,
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      {/* Tokoh faceless dari mgkit (kepala oval polos satu warna, tanpa mata/mulut/hidung/alis) */}
      <Figure x={w / 2} y={h} s={scale} shirt={shirt} />

      {/* Properti siluet warga tanpa wajah: caping petani atau selendang bahu */}
      {caping ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -10 * scale,
            width: 78 * scale,
            height: 26 * scale,
            translate: '-50% 0',
            backgroundColor: PAL.sampai.marigold,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            filter: `drop-shadow(0 2px 0 ${PAL.sampai.ink})`,
          }}
        />
      ) : null}
      {scarf ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 58 * scale,
            width: 70 * scale,
            height: 22 * scale,
            translate: '-50% 0',
            borderRadius: 10 * scale,
            backgroundColor: PAL.sampai.terracotta,
            border: `${2 * scale}px solid ${PAL.sampai.ink}`,
          }}
        />
      ) : null}

      {/* Dua lengan siluet terangkat ke atas memegang ruas jalur di depannya */}
      <div
        style={{
          position: 'absolute',
          left: w * 0.16,
          top: 48 * scale,
          width: 14 * scale,
          height: 54 * scale,
          rotate: '-16deg',
          borderRadius: 7 * scale,
          backgroundColor: shirt,
          border: `${2 * scale}px solid ${C.inkSoft}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: w * 0.16,
          top: 48 * scale,
          width: 14 * scale,
          height: 54 * scale,
          rotate: '16deg',
          borderRadius: 7 * scale,
          backgroundColor: shirt,
          border: `${2 * scale}px solid ${C.inkSoft}`,
        }}
      />
    </div>
  );
};

// Bingkai panggung teater kertas (lengkung atas + pilar samping + lantai panggung konsisten)
const ProsceniumFrame: React.FC = () => (
  <>
    <Slab
      x={0}
      y={FLOOR_Y}
      w={1280}
      h={720 - FLOOR_Y}
      color={PAL.sampai.floor}
      r={0}
      grain={0.6}
    />
    <Slab
      x={0}
      y={FLOOR_Y - 22}
      w={1280}
      h={26}
      color={PAL.sampai.floorHi}
      shade={PAL.sampai.floor}
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
    <Paper lift={6}>
      <Slab
        x={0}
        y={0}
        w={36}
        h={FLOOR_Y}
        color={PAL.sampai.terracotta}
        shade={PAL.sampai.terracottaLo}
        r={0}
      />
      <Slab
        x={1244}
        y={0}
        w={36}
        h={FLOOR_Y}
        color={PAL.sampai.terracotta}
        shade={PAL.sampai.terracottaLo}
        r={0}
      />
      <Slab
        x={0}
        y={0}
        w={1280}
        h={38}
        color={PAL.sampai.terracotta}
        shade={PAL.sampai.terracottaLo}
        shadeH={0.28}
        r="0 0 18px 18px"
      />
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 28,
          width: 68,
          height: 54,
          backgroundColor: PAL.sampai.terracotta,
          borderRadius: '0 0 48px 0',
          borderRight: `3px solid ${PAL.sampai.terracottaLo}`,
          borderBottom: `3px solid ${PAL.sampai.terracottaLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 26,
          top: 28,
          width: 68,
          height: 54,
          backgroundColor: PAL.sampai.terracotta,
          borderRadius: '0 0 0 48px',
          borderLeft: `3px solid ${PAL.sampai.terracottaLo}`,
          borderBottom: `3px solid ${PAL.sampai.terracottaLo}`,
        }}
      />
    </Paper>
  </>
);

// Strip teks kertas (HANYA mengizinkan 4 frasa resmi MG-13)
const AllowedPaperStrip: React.FC<{
  x: number;
  y: number;
  text: AllowedText;
  at: number;
  outAt?: number;
  size?: number;
  bg?: string;
  color?: string;
  rot?: number;
  seed: string;
}> = ({
  x,
  y,
  text,
  at,
  outAt,
  size = 38,
  bg = PAL.sampai.cream,
  color = PAL.sampai.ink,
  rot = -1.1,
  seed,
}) => {
  const f = useCurrentFrame();
  const exitOpacity =
    outAt !== undefined
      ? interpolate(f, [outAt, outAt + 14], [1, 0], CLAMP)
      : 1;
  if (f < at || exitOpacity <= 0.01) return null;

  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.35} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            opacity: exitOpacity,
            zIndex: 42,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              padding: '13px 30px 15px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: size,
              color,
              lineHeight: 1.08,
              whiteSpace: 'nowrap',
              border: `3px solid ${color}`,
              filter: 'url(#rough) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
            }}
          >
            {text}
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -14,
                width: 46,
                height: 16,
                rotate: '-28deg',
                backgroundColor: C.tape,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -14,
                width: 46,
                height: 16,
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

export const PB13: React.FC = () => {
  const f = useCurrentFrame();

  // =========================================================================
  // BEAT 1 (Frame 0-35): "Uangnya sudah ada."
  // Menara koin kertas yang sama seperti di awal video berdiri di kiri panggung, berpendar emas.
  // Teks "Uangnya sudah ada." tampil.
  // =========================================================================
  const towerProgress = interpolate(f, [0, 24], [0.35, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });
  const towerPulse = 1 + 0.03 * Math.sin(f * 0.14);

  // =========================================================================
  // BEAT 2 (Frame 56-155): "Yang belum ada, adalah jaminan bahwa setiap rupiahnya sampai."
  // Dari menara koin terbentang jalur koin (4 ruas awal) menuju rumah-rumah di kanan panggung;
  // ruas terakhir (ruas ke-5) hanya garis putus-putus yang belum tersambung.
  // Sebuah cap berbentuk lingkaran kosong (garis putus-putus) berada di ruas itu. Teks "jaminan".
  // =========================================================================
  const seg1Prog = interpolate(f, [56, 76], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const seg2Prog = interpolate(f, [72, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const seg3Prog = interpolate(f, [88, 108], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const seg4Prog = interpolate(f, [104, 124], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const dashedGapAppear = interpolate(f, [118, 138], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const stampAppear = interpolate(f, [126, 146], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  // =========================================================================
  // BEAT 3 (Frame 155-272): "Dan jaminan itu, tidak datang sendiri."
  // Ruas putus-putus tetap kosong; tidak ada yang mengisinya. Suasana menahan, panggung menunggu.
  // =========================================================================
  // (Keadaan ruas ke-5 dan cap lingkaran putus-putus tertahan kosong sepanjang frame 155-286)

  // =========================================================================
  // BEAT 4 (Frame 286-322): "Ia harus dituntut."
  // Tangan-tangan siluet muncul dari tepi bawah panggung, terangkat, dan menarik
  // ruas jalur sedikit demi sedikit ke arah tersambung.
  // =========================================================================
  const handsRise = interpolate(f, [286, 300], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Tarikan bertahap 3 langkah halus ("sedikit demi sedikit") dari frame 296 hingga 322
  const pullStep1 = interpolate(f, [296, 304], [0, 0.34], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const pullStep2 = interpolate(f, [305, 313], [0, 0.33], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const pullStep3 = interpolate(f, [314, 322], [0, 0.33], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });
  const seg5BridgeProg = Math.min(1, pullStep1 + pullStep2 + pullStep3);
  const handsFadeToCitizens = interpolate(f, [354, 370], [1, 0], CLAMP);

  // =========================================================================
  // BEAT 5 (Frame 322-360): "Setiap hari."
  // Cakram matahari dan bulan kertas berputar pelan sebagai penanda hari berganti (tanpa angka).
  // Teks "Setiap hari" tampil.
  // =========================================================================
  const sunMoonAppear = interpolate(f, [322, 336], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });
  const sunMoonRot = interpolate(f, [322, 360, 402], [-170, 0, 12], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // =========================================================================
  // BEAT 6 (Frame 360-402): "Oleh kita semua."
  // Kamera mundur pelan lalu menahan; barisan siluet warga tanpa wajah berdiri sepanjang jalur,
  // masing-masing memegang satu ruas; jalur lengkap menyambung menara koin ke rumah-rumah;
  // langit bergeser ke Dunia Sampai penuh yang cerah. Teks "Oleh kita semua." tampil dan
  // DITAHAN hingga frame 402.
  // =========================================================================
  const camPullBack = interpolate(f, [356, 384], [1.06, 0.94], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const camOriginY = interpolate(f, [356, 384], [485, 515], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // Pergeseran suasana langit dan bukit ke Dunia Sampai penuh yang cerah
  const worldBrightProg = interpolate(f, [286, 324, 374], [0, 0.38, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const fullPathGlow = interpolate(f, [318, 374], [0.25, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const housesLitProg = interpolate(f, [320, 376], [0.08, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  const skyTopCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.skyTop, PAL.sampai.skyTop],
  );
  const skyMidCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.skyMid, PAL.sampai.skyMid],
  );
  const skyBotCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.skyBot, PAL.sampai.skyBot],
  );
  const hillFarCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.hillFar, PAL.sampai.teal],
  );
  const hillMidCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.hillMid, PAL.sampai.leaf],
  );
  const hillNearCol = interpolateColors(
    worldBrightProg,
    [0, 1],
    [PAL.wait.hillNear, PAL.sampai.leafLo],
  );

  // Koordinat 5 ruas jalur koin dari menara koin (x=218) ke rumah-rumah desa (x=898)
  const pathY = 478;
  const segW = 132;
  const segStarts = [218, 354, 490, 626, 762];
  const segProgs = [seg1Prog, seg2Prog, seg3Prog, seg4Prog];

  // Barisan 5 siluet warga tanpa wajah (masing-masing memegang satu ruas jalur)
  const citizens = [
    {x: 284, shirt: PAL.sampai.teal, scale: 0.92, caping: false, scarf: false, delay: 356},
    {x: 420, shirt: PAL.sampai.terracotta, scale: 0.96, caping: false, scarf: true, delay: 360},
    {x: 556, shirt: PAL.sampai.leaf, scale: 0.94, caping: true, scarf: false, delay: 364},
    {x: 692, shirt: PAL.sampai.marigold, scale: 0.95, caping: false, scarf: false, delay: 368},
    {x: 828, shirt: PAL.sampai.tealLo, scale: 0.93, caping: false, scarf: true, delay: 372},
  ];

  // Koin-koin cahaya yang mengalir di sepanjang jalur lengkap setelah tersambung (Frame 322-402)
  const streamOpacity = interpolate(f, [322, 342], [0, 1], CLAMP);
  const streamPhase = interpolate(f, [322, 402], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: PAL.sampai.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.22} flicker={0.2}>
        {/* LAPISAN 0: Langit kertas berlapis (bergeser ke langit pagi persik-aqua Dunia Sampai penuh) */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${skyTopCol} 0%, ${skyMidCol} 52%, ${skyBotCol} 100%)`,
          }}
        />

        {/* Pendar cahaya pagi hangat di cakrawala saat Dunia Sampai penuh terbuka */}
        <AbsoluteFill
          style={{
            opacity: worldBrightProg,
            background:
              'radial-gradient(ellipse at 54% 38%, rgba(255,236,179,0.68) 0%, rgba(242,169,59,0.22) 48%, rgba(0,0,0,0) 76%)',
          }}
        />

        {/* Panggung utama dengan gerak kamera mundur pelan pada Beat 6 lalu menahan */}
        <AbsoluteFill
          style={{
            transformOrigin: `640px ${Math.round(camOriginY)}px`,
            transform: `scale(${camPullBack})`,
          }}
        >
          {/* Cakram matahari dan bulan kertas di langit tengah (Beat 5-6) */}
          <SunMoonPaperDisc
            cx={640}
            cy={196}
            appear={sunMoonAppear}
            rotDeg={sunMoonRot}
          />

          {/* LAPISAN 1: Perbukitan kertas berlapis (5 lapisan parallax Dunia Sampai) */}
          <Paper lift={4}>
            {/* Bukit jauh teal */}
            <div
              style={{
                position: 'absolute',
                left: -60,
                top: 334,
                width: 1400,
                height: 280,
                borderRadius: '48% 52% 0 0',
                backgroundColor: hillFarCol,
                opacity: 0.72,
              }}
            />
            {/* Bukit tengah hijau daun */}
            <div
              style={{
                position: 'absolute',
                left: 160,
                top: 374,
                width: 1180,
                height: 240,
                borderRadius: '54% 46% 0 0',
                backgroundColor: hillMidCol,
                opacity: 0.86,
              }}
            />
            {/* Bukit dekat */}
            <div
              style={{
                position: 'absolute',
                left: -80,
                top: 428,
                width: 1440,
                height: 190,
                borderRadius: '44% 56% 0 0',
                backgroundColor: hillNearCol,
              }}
            />
          </Paper>

          {/* LAPISAN 2: Barisan siluet warga tanpa wajah berdiri sepanjang jalur memegang tiap ruas (Beat 6) */}
          {citizens.map((cit, idx) => {
            const enterP = interpolate(f, [cit.delay, cit.delay + 16], [0, 1], {
              ...CLAMP,
              easing: Easing.out(Easing.back(1.35)),
            });
            return (
              <CitizenHoldingSegment
                key={idx}
                x={cit.x}
                baseY={FLOOR_Y - 12}
                shirt={cit.shirt}
                scale={cit.scale}
                enterProg={enterP}
                caping={cit.caping}
                scarf={cit.scarf}
              />
            );
          })}

          {/* LAPISAN 3: Jalur koin kertas dari menara koin (kiri) ke rumah-rumah (kanan) */}
          {/* Tiang-tiang penyangga kecil di bawah sambungan jalur */}
          {[218, 354, 490, 626, 762, 894].map((px, idx) => {
            const pillarAppear =
              idx < 4
                ? segProgs[Math.max(0, idx - 1)]
                : idx === 4
                  ? seg4Prog
                  : dashedGapAppear;
            if (pillarAppear <= 0.01) return null;
            return (
              <Slab
                key={idx}
                x={px - 8}
                y={pathY + 14}
                w={16}
                h={FLOOR_Y - pathY - 26}
                color={PAL.sampai.floorHi}
                shade={PAL.sampai.floor}
                r={3}
                style={{
                  opacity: pillarAppear,
                  border: `2px solid ${PAL.sampai.ink}`,
                }}
              />
            );
          })}

          {/* 4 ruas jalur koin pertama (terbentang di Beat 2) */}
          {segProgs.map((prog, idx) => (
            <PathSegmentPlank
              key={idx}
              x={segStarts[idx]}
              y={pathY}
              w={segW}
              progress={prog}
              glow={fullPathGlow}
            />
          ))}

          {/* Ruas ke-5 (ruas terakhir): Garis putus-putus kosong pada Beat 2 & Beat 3 */}
          {dashedGapAppear > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: segStarts[4],
                top: pathY,
                width: segW,
                height: 36,
                translate: '0 -50%',
                borderRadius: 8,
                border: `3.5px dashed ${PAL.sampai.ink}`,
                backgroundColor: 'rgba(246, 232, 204, 0.16)',
                opacity: dashedGapAppear * (1 - seg5BridgeProg * 0.85),
                zIndex: 15,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* Ruas ke-5 yang ditarik sedikit demi sedikit oleh tangan-tangan siluet pada Beat 4 */}
          <PathSegmentPlank
            x={segStarts[4] + (1 - seg5BridgeProg) * -28}
            y={pathY + (1 - seg5BridgeProg) * 34}
            w={segW}
            progress={seg5BridgeProg}
            glow={fullPathGlow}
            tiltDeg={(1 - seg5BridgeProg) * 9}
            zIndex={17}
          />

          {/* Koin-koin emas mengalir lembut di atas jalur yang sudah tersambung utuh (Frame 322-402) */}
          {streamOpacity > 0.01
            ? [0, 0.25, 0.5, 0.75].map((offset, idx) => {
                const t = (streamPhase * 1.15 + offset) % 1;
                const coinX = interpolate(t, [0, 1], [224, 892], CLAMP);
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      opacity: streamOpacity,
                      zIndex: 22,
                      pointerEvents: 'none',
                    }}
                  >
                    <PaperCoinDisc
                      x={coinX}
                      y={pathY - 22}
                      size={22}
                      rot={t * 360}
                      glow={1}
                    />
                  </div>
                );
              })
            : null}

          {/* Cap berbentuk lingkaran kosong (garis putus-putus) di ruas ke-5 ("jaminan") */}
          <GuaranteeCircleStamp
            x={segStarts[4] + segW / 2}
            y={pathY - 78}
            appear={stampAppear}
            filled={seg5BridgeProg}
            showWord={f >= 92 && f < 282}
          />

          {/* Tangan-tangan siluet dari tepi bawah panggung yang menarik ruas terakhir (Beat 4) */}
          <SilhouettePullHands
            anchorX={segStarts[4] + segW / 2}
            anchorY={pathY + 12 + (1 - seg5BridgeProg) * 28}
            riseProg={handsRise}
            pullOffset={(1 - seg5BridgeProg) * -20}
            opacity={handsFadeToCitizens}
          />

          {/* LAPISAN 4: Menara koin kertas berpendar emas di kiri panggung */}
          <CoinTower
            cx={152}
            baseY={FLOOR_Y - 12}
            progress={towerProgress}
            pulse={towerPulse}
          />

          {/* LAPISAN 5: Rumah-rumah desa kertas di kanan panggung dengan jendela yang berpendar hangat */}
          <VillagePaperHouse
            x={1118}
            baseY={FLOOR_Y - 18}
            scale={0.86}
            roofColor={PAL.sampai.teal}
            roofShade={PAL.sampai.tealLo}
            doorColor={PAL.sampai.marigold}
            litProg={housesLitProg}
            twoWindows={false}
            zIndex={13}
          />
          <VillagePaperHouse
            x={984}
            baseY={FLOOR_Y - 10}
            scale={1.04}
            roofColor={PAL.sampai.terracotta}
            roofShade={PAL.sampai.terracottaLo}
            doorColor={PAL.sampai.teal}
            litProg={housesLitProg}
            twoWindows
            zIndex={19}
          />
          <VillagePaperHouse
            x={1156}
            baseY={FLOOR_Y - 6}
            scale={0.94}
            roofColor={PAL.sampai.marigold}
            roofShade={PAL.sampai.terracotta}
            doorColor={PAL.sampai.leaf}
            litProg={housesLitProg}
            twoWindows
            zIndex={20}
          />
        </AbsoluteFill>

        {/* LAPISAN 6: Bingkai panggung teater kertas (lengkung atas & lantai panggung konsisten) */}
        <ProsceniumFrame />

        {/* LAPISAN 7: Teks yang diizinkan tampil sesuai beat (HANYA 4 teks resmi) */}
        {/* Beat 1 (Frame 0-35, ditahan sampai awal Beat 2 agar terbaca minimal >1,5 dtk): "Uangnya sudah ada." */}
        <AllowedPaperStrip
          x={290}
          y={112}
          text="Uangnya sudah ada."
          at={2}
          outAt={54}
          size={36}
          rot={-1.4}
          seed="uangnya-sudah-ada"
        />

        {/* Beat 5 (Frame 322-360): "Setiap hari" */}
        <AllowedPaperStrip
          x={640}
          y={94}
          text="Setiap hari"
          at={322}
          outAt={356}
          size={38}
          rot={0.9}
          seed="setiap-hari"
        />

        {/* Beat 6 (Frame 360-402): "Oleh kita semua." — ditahan hingga video selesai di frame 402 */}
        <AllowedPaperStrip
          x={640}
          y={96}
          text="Oleh kita semua."
          at={360}
          size={44}
          bg={PAL.sampai.creamHi}
          color={PAL.sampai.ink}
          rot={-0.8}
          seed="oleh-kita-semua"
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
