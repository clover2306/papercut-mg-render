// Adegan MG-09 "Menara Menyala" (jawaban visual langsung atas MG-08, Dunia Sampai):
// Beberapa menara kertas yang terlipat datar di lantai panggung berdiri satu per satu seperti pop-up book
// dengan pegas lembut (Frame 0-71), lalu tiga cincin kertas memancar dari puncak menara dengan getar lembut
// dan menyalakan jendela rumah-rumah desa satu per satu dengan cahaya hangat seiring latar bergeser
// dari biru malam ke persik-aqua pagi (Frame 71-167). Tanpa ikon sinyal, tanpa batang sinyal, tanpa antena bergaris.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const PB09_DUR = 167;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet Dunia Sampai + transisi dari biru malam ke pagi persik-aqua sesuai brief bagian 1.3 & MG-09
const PAL = {
  night: {
    skyTop: '#1B283B',
    skyMid: '#263B54',
    skyBot: '#324E6B',
    hillFar: '#23384C',
    hillMid: '#284252',
    hillNear: '#2E4B52',
    windowOff: '#27313D',
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
};

// Menara kertas pop-up book (TANPA ikon sinyal, TANPA batang sinyal, TANPA antena bergaris)
// Terlipat datar di atas petak lantai panggung lalu berdiri tegak dengan pegas lembut.
const PopUpPaperTower: React.FC<{
  x: number;
  baseY: number;
  w: number;
  h: number;
  standProg: number;
  beaconGlow: number;
  accentColor: string;
  shadeColor: string;
  zIndex?: number;
}> = ({
  x,
  baseY,
  w,
  h,
  standProg,
  beaconGlow,
  accentColor,
  shadeColor,
  zIndex = 14,
}) => {
  // Lipatan pop-up: saat standProg = 0 masih terlipat datar di petak lantai, lalu berdiri dengan pegas
  const clampedScaleY = Math.max(0.06, standProg);
  const foldSkew = interpolate(Math.min(1, standProg), [0, 1], [-24, 0], CLAMP);
  const baseFlapOpen = interpolate(Math.min(1, standProg), [0, 0.7, 1], [1, 0.35, 0], CLAMP);

  const topW = Math.round(w * 0.34);
  const midW = Math.round(w * 0.64);
  const legW = Math.max(10, Math.round(w * 0.13));

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY,
        width: w + 60,
        height: h + 50,
        translate: '-50% -100%',
        zIndex,
        pointerEvents: 'none',
      }}
    >
      {/* Petak pondasi lipatan kertas di lantai (selalu menempel di lantai panggung) */}
      <Paper lift={4}>
        <Slab
          x={18}
          y={h + 32}
          w={w + 24}
          h={16}
          color={PAL.sampai.cream}
          shade={PAL.sampai.creamLo}
          r={4}
          style={{border: `2.5px solid ${PAL.sampai.ink}`}}
        />
        {/* Sayap kertas lipatan pop-up di kiri-kanan pondasi yang merata saat menara berdiri */}
        {baseFlapOpen > 0.02 ? (
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: h + 20,
              width: w,
              height: Math.round(22 * baseFlapOpen),
              backgroundColor: PAL.sampai.creamLo,
              border: `2px solid ${PAL.sampai.ink}`,
              borderRadius: 3,
              transformOrigin: '50% 100%',
            }}
          />
        ) : null}
      </Paper>

      {/* Badan menara pop-up yang berdiri dari lipatan datar */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 36,
          width: w,
          height: h,
          transformOrigin: '50% 100%',
          transform: `scaleY(${clampedScaleY}) skewX(${foldSkew}deg)`,
        }}
      >
        {/* Pendar hangat di puncak menara saat menyala */}
        {beaconGlow > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 8,
              width: w * 1.9,
              height: w * 1.9,
              translate: '-50% -50%',
              borderRadius: '50%',
              opacity: beaconGlow,
              background:
                'radial-gradient(circle, rgba(255,230,153,0.85) 0%, rgba(242,169,59,0.34) 48%, rgba(242,169,59,0) 74%)',
            }}
          />
        ) : null}

        <Paper lift={6}>
          {/* Siluet latar potongan kertas menara trapesium bersih */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 18,
              width: w,
              height: h - 18,
              backgroundColor: PAL.sampai.cream,
              clipPath: 'polygon(33% 0%, 67% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Bayangan lipatan tengah vertikal khas pop-up book (sisi kanan sedikit lebih teduh) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 18,
              width: w,
              height: h - 18,
              backgroundColor: PAL.sampai.creamLo,
              clipPath: 'polygon(50% 0%, 67% 0%, 100% 100%, 50% 100%)',
              opacity: 0.55,
            }}
          />

          {/* Kaki rangka menara kiri & kanan dari potongan kertas tebal */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 18,
              width: w,
              height: h - 18,
              backgroundColor: accentColor,
              clipPath: `polygon(33% 0%, ${33 + (legW / w) * 100}% 0%, ${
                (legW / w) * 100
              }% 100%, 0% 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 18,
              width: w,
              height: h - 18,
              backgroundColor: shadeColor,
              clipPath: `polygon(${67 - (legW / w) * 100}% 0%, 67% 0%, 100% 100%, ${
                100 - (legW / w) * 100
              }% 100%)`,
            }}
          />

          {/* Tiga sabuk palang horizontal menara kertas (bukan garis antena) */}
          <Slab
            x={Math.round((w - topW - 10) / 2)}
            y={Math.round(h * 0.24)}
            w={topW + 10}
            h={12}
            color={accentColor}
            shade={shadeColor}
            r={3}
            style={{border: `2px solid ${PAL.sampai.ink}`}}
          />
          <Slab
            x={Math.round((w - midW) / 2)}
            y={Math.round(h * 0.52)}
            w={midW}
            h={13}
            color={accentColor}
            shade={shadeColor}
            r={3}
            style={{border: `2px solid ${PAL.sampai.ink}`}}
          />
          <Slab
            x={Math.round(w * 0.08)}
            y={Math.round(h * 0.78)}
            w={Math.round(w * 0.84)}
            h={14}
            color={accentColor}
            shade={shadeColor}
            r={3}
            style={{border: `2px solid ${PAL.sampai.ink}`}}
          />

          {/* Lubang jendela geometris trapesium pada badan menara kertas */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: Math.round(h * 0.31),
              width: Math.round(w * 0.28),
              height: Math.round(h * 0.18),
              translate: '-50% 0',
              backgroundColor: PAL.sampai.ink,
              borderRadius: 4,
              opacity: 0.75,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: Math.round(h * 0.59),
              width: Math.round(w * 0.42),
              height: Math.round(h * 0.16),
              translate: '-50% 0',
              backgroundColor: PAL.sampai.ink,
              borderRadius: 4,
              opacity: 0.75,
            }}
          />

          {/* Garis lipatan tengah pop-up book */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 18,
              width: 2.5,
              height: h - 18,
              translate: '-50% 0',
              backgroundColor: PAL.sampai.ink,
              opacity: 0.65,
            }}
          />

          {/* Balkon anjungan puncak menara */}
          <Slab
            x={Math.round((w - topW - 18) / 2)}
            y={12}
            w={topW + 18}
            h={14}
            color={PAL.sampai.creamHi}
            shade={PAL.sampai.creamLo}
            r={4}
            style={{border: `2.5px solid ${PAL.sampai.ink}`}}
          />

          {/* Lentera/cakram kertas bulat polos di puncak menara yang menyala hangat */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 6,
              width: 30,
              height: 30,
              translate: '-50% -50%',
              borderRadius: '50%',
              backgroundColor: interpolateColors(
                beaconGlow,
                [0, 1],
                [PAL.sampai.marigold, PAL.sampai.windowGlow],
              ),
              border: `3px solid ${PAL.sampai.ink}`,
              boxShadow:
                beaconGlow > 0.05
                  ? `0 0 ${Math.round(24 * beaconGlow)}px rgba(255, 230, 153, 0.95)`
                  : 'none',
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

// Rumah desa kertas pop-up dengan jendela-jendela yang awalnya gelap lalu menyala hangat
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
  zIndex = 12,
}) => {
  const winBg = interpolateColors(
    litProg,
    [0, 1],
    [PAL.night.windowOff, PAL.sampai.windowGlow],
  );
  const wallBg = interpolateColors(
    litProg,
    [0, 1],
    ['#D5C7B2', PAL.sampai.cream],
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
      {/* Pendar cahaya hangat di sekitar rumah ketika jendelanya menyala */}
      {litProg > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '56%',
            width: 240,
            height: 210,
            translate: '-50% -50%',
            borderRadius: '50%',
            opacity: litProg,
            background:
              'radial-gradient(circle, rgba(255,230,130,0.68) 0%, rgba(242,169,59,0.28) 50%, rgba(0,0,0,0) 75%)',
          }}
        />
      ) : null}

      <Paper lift={5}>
        {/* Dinding rumah kertas */}
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

        {/* Atap pelana potongan kertas berlapis */}
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

        {/* Pintu rumah */}
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

        {/* Jendela utama yang menyala hangat saat cincin kertas lewat */}
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

        {/* Jendela kedua bila twoWindows aktif */}
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

// Cincin kertas utuh yang memancar dari puncak menara dengan getar lembut (bukan ikon sinyal/Wi-Fi)
const PaperPulseRing: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  opacity: number;
  seed: string;
}> = ({cx, cy, radius, opacity, seed}) => {
  if (opacity <= 0.01 || radius <= 4) return null;
  const d = Math.round(radius * 2);

  return (
    <Boil seed={seed} amp={1.1} rot={0.12}>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: d,
          height: d,
          translate: '-50% -50%',
          borderRadius: '50%',
          border: `8px solid ${PAL.sampai.creamHi}`,
          outline: `3px solid ${PAL.sampai.marigold}`,
          boxShadow:
            '0 0 18px rgba(255, 230, 153, 0.65), inset 0 0 12px rgba(242, 169, 59, 0.45), 2px 5px 8px rgba(59, 42, 32, 0.25)',
          opacity,
          filter: 'url(#rough)',
          pointerEvents: 'none',
          zIndex: 19,
        }}
      />
    </Boil>
  );
};

// Bingkai panggung teater kertas (lengkung atas + pilar samping + lantai panggung konsisten dengan MG-08)
const ProsceniumFrame: React.FC = () => (
  <>
    {/* Lantai panggung */}
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

    {/* Lengkung atas & pilar bingkai panggung kertas */}
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

// Strip kertas opsional yang diizinkan di brief: HANYA "Sinyal sampai"
const AllowedBannerStrip: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;

  return (
    <PopIn at={at} seed="sinyal-sampai">
      <Boil seed="sinyal-sampai" amp={0.35} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 86,
            translate: '-50% -50%',
            zIndex: 35,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: '-1deg',
              backgroundColor: PAL.sampai.cream,
              padding: '12px 30px 14px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 38,
              color: PAL.sampai.ink,
              lineHeight: 1.06,
              whiteSpace: 'nowrap',
              border: `3px solid ${PAL.sampai.ink}`,
              filter: 'url(#rough) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
            }}
          >
            Sinyal sampai
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

export const PB09: React.FC = () => {
  const rawF = useCurrentFrame();
  // Rasa gerak mulus 24 gambar per detik khas Dunia Sampai
  const f = Math.round((rawF * 24) / 30) * (30 / 24);

  // Kamera maju pelan dan naik sepanjang adegan (0..167)
  const camScale = interpolate(f, [0, PB09_DUR], [1, 1.055], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const camLiftY = interpolate(f, [0, PB09_DUR], [0, -14], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const parallaxX = interpolate(f, [0, PB09_DUR], [0, -16], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // =========================================================================
  // BEAT 1 (Frame 0-71): "Menara-menara itu berdiri."
  // Tiga menara kertas yang terlipat datar di lantai panggung berdiri satu per satu
  // seperti pop-up book dengan pegas lembut.
  // =========================================================================
  const tower1Stand = interpolate(f, [4, 34], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.45)),
  });
  const tower2Stand = interpolate(f, [22, 52], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.45)),
  });
  const tower3Stand = interpolate(f, [40, 69], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.45)),
  });

  const tower1Beacon = interpolate(f, [28, 44], [0.25, 1], CLAMP);
  const tower2Beacon = interpolate(f, [46, 62], [0.25, 1], CLAMP);
  const tower3Beacon = interpolate(f, [62, 74], [0.25, 1], CLAMP);

  // =========================================================================
  // BEAT 2 (Frame 71-167): "Sinyal sampai ke desa-desa yang selama ini gelap."
  // Tiga cincin kertas memancar dari puncak menara utama dengan getar lembut;
  // setiap cincin yang lewat menyalakan jendela rumah-rumah desa satu per satu.
  // Latar bergeser dari biru malam ke persik-aqua pagi dan ditahan sampai frame 167.
  // =========================================================================
  // Pergeseran langit dari biru malam ke persik-aqua pagi hangat
  const dawnShift = interpolate(f, [0, 71, 138], [0.18, 0.42, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  // Tirai malam biru di atas lembah desa kanan yang tersapu habis saat cincin cahaya melintas
  const villageNightVeil = interpolate(f, [71, 134], [0.58, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  const skyTopCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.skyTop, PAL.sampai.skyTop],
  );
  const skyMidCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.skyMid, PAL.sampai.skyMid],
  );
  const skyBotCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.skyBot, PAL.sampai.skyBot],
  );
  const hillFarCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.hillFar, PAL.sampai.teal],
  );
  const hillMidCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.hillMid, PAL.sampai.leaf],
  );
  const hillNearCol = interpolateColors(
    dawnShift,
    [0, 1],
    [PAL.night.hillNear, PAL.sampai.leafLo],
  );

  // Koordinat puncak menara utama tempat tiga cincin kertas memancar
  const mainTowerX = 250;
  const mainTowerBaseY = FLOOR_Y - 14;
  const mainTowerH = 330;
  const pulseOriginX = mainTowerX;
  const pulseOriginY = mainTowerBaseY - mainTowerH + 6;

  // Tiga cincin kertas memancar berurutan sejak frame 71, dan tetap berpendar lembut di akhir
  const ring1Prog = interpolate(f, [71, 128], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const ring2Prog = interpolate(f, [84, 142], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const ring3Prog = interpolate(f, [97, 156], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const ring1Radius = interpolate(ring1Prog, [0, 1], [18, 920], CLAMP);
  const ring2Radius = interpolate(ring2Prog, [0, 1], [18, 720], CLAMP);
  const ring3Radius = interpolate(ring3Prog, [0, 1], [18, 520], CLAMP);

  const ring1Opacity =
    interpolate(f, [71, 77], [0, 0.85], CLAMP) *
    interpolate(f, [112, 136], [1, 0.32], CLAMP);
  const ring2Opacity =
    interpolate(f, [84, 90], [0, 0.85], CLAMP) *
    interpolate(f, [126, 148], [1, 0.42], CLAMP);
  const ring3Opacity =
    interpolate(f, [97, 103], [0, 0.9], CLAMP) *
    interpolate(f, [140, 160], [1, 0.55], CLAMP);

  // Jendela 5 rumah desa menyala satu per satu dari dekat menara hingga ke ujung kanan
  // ketika gelombang cincin kertas melewatinya, lalu DITAHAN menyala sampai frame 167.
  const house1Lit = interpolate(f, [80, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const house2Lit = interpolate(f, [90, 102], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const house3Lit = interpolate(f, [100, 112], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const house4Lit = interpolate(f, [110, 122], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const house5Lit = interpolate(f, [120, 132], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Matahari pagi hangat yang terbit perlahan seiring langit berubah ke persik-aqua
  const sunY = interpolate(dawnShift, [0.18, 1], [310, 165], CLAMP);
  const sunOpacity = interpolate(dawnShift, [0.18, 1], [0.25, 0.95], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: skyTopCol}}>
      <PaperDefs />
      <FilmWeave amp={0.2} flicker={0.18}>
        <AbsoluteFill
          style={{
            transformOrigin: '50% 52%',
            scale: `${camScale}`,
            translate: `0px ${camLiftY}px`,
          }}
        >
          {/* =============================================================== */}
          {/* LAPISAN 1: LANGIT BERGESER DARI BIRU MALAM KE PERSIK-AQUA PAGI  */}
          {/* =============================================================== */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${skyTopCol} 0%, ${skyMidCol} 54%, ${skyBotCol} 100%)`,
            }}
          />

          {/* Matahari pagi kertas hangat */}
          <div
            style={{
              position: 'absolute',
              left: 340 + parallaxX * 0.25,
              top: sunY,
              width: 260,
              height: 260,
              translate: '-50% -50%',
              borderRadius: '50%',
              opacity: sunOpacity,
              background:
                'radial-gradient(circle, rgba(255,244,200,0.92) 0%, rgba(242,169,59,0.36) 46%, rgba(242,169,59,0) 74%)',
            }}
          />

          {/* =============================================================== */}
          {/* LAPISAN 2: LIMA LAPISAN BUKIT KERTAS PARALLAX & MENARA PUNGGUNG */}
          {/* =============================================================== */}
          <Paper lift={4}>
            {/* Lapisan 2a: Pegunungan kertas terjauh */}
            <div
              style={{
                position: 'absolute',
                left: -80 + parallaxX * 0.25,
                top: 300,
                width: 900,
                height: 310,
                borderRadius: '55% 45% 0 0',
                backgroundColor: hillFarCol,
                opacity: 0.72,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 520 + parallaxX * 0.3,
                top: 325,
                width: 860,
                height: 290,
                borderRadius: '48% 52% 0 0',
                backgroundColor: hillFarCol,
                opacity: 0.85,
              }}
            />

            {/* Lapisan 2b: Bukit tengah tempat Menara 3 & Rumah Bukit berdiri */}
            <div
              style={{
                position: 'absolute',
                left: 360 + parallaxX * 0.5,
                top: 382,
                width: 980,
                height: 240,
                borderRadius: '46% 54% 0 0',
                backgroundColor: hillMidCol,
              }}
            />

            {/* Lapisan 2c: Bukit dekat kiri-tengah */}
            <div
              style={{
                position: 'absolute',
                left: -60 + parallaxX * 0.75,
                top: 432,
                width: 780,
                height: 190,
                borderRadius: '52% 48% 0 0',
                backgroundColor: hillNearCol,
              }}
            />
            {/* Lapisan 2d: Lembah desa dekat kanan */}
            <div
              style={{
                position: 'absolute',
                left: 560 + parallaxX * 0.85,
                top: 448,
                width: 780,
                height: 175,
                borderRadius: '44% 56% 0 0',
                backgroundColor: hillNearCol,
              }}
            />
          </Paper>

          {/* Menara 3 (berdiri ketiga di punggung bukit tengah, Frame 40-69) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${parallaxX * 0.55}px 0px`,
            }}
          >
            <PopUpPaperTower
              x={545}
              baseY={454}
              w={74}
              h={168}
              standProg={tower3Stand}
              beaconGlow={tower3Beacon}
              accentColor={PAL.sampai.teal}
              shadeColor={PAL.sampai.tealLo}
              zIndex={9}
            />

            {/* Rumah Desa 2 di lereng bukit tengah (menyala kedua pada Frame 90-102) */}
            <VillagePaperHouse
              x={685}
              baseY={468}
              scale={0.66}
              roofColor={PAL.sampai.marigold}
              roofShade={PAL.sampai.terracotta}
              doorColor={PAL.sampai.teal}
              litProg={house2Lit}
              twoWindows={false}
              zIndex={9}
            />

            {/* Rumah Desa 4 di punggung bukit kanan (menyala keempat pada Frame 110-122) */}
            <VillagePaperHouse
              x={970}
              baseY={476}
              scale={0.68}
              roofColor={PAL.sampai.terracotta}
              roofShade={PAL.sampai.terracottaLo}
              doorColor={PAL.sampai.leaf}
              litProg={house4Lit}
              twoWindows
              zIndex={9}
            />
          </div>

          {/* =============================================================== */}
          {/* LAPISAN 3: PANGGUNG DEPAN — MENARA POP-UP & RUMAH-RUMAH DESA    */}
          {/* =============================================================== */}
          {/* Menara 2 (berdiri kedua di sisi kiri-belakang lantai panggung, Frame 22-52) */}
          <PopUpPaperTower
            x={122}
            baseY={FLOOR_Y - 20}
            w={92}
            h={226}
            standProg={tower2Stand}
            beaconGlow={tower2Beacon}
            accentColor={PAL.sampai.marigold}
            shadeColor={PAL.sampai.terracotta}
            zIndex={13}
          />

          {/* Menara 1 Utama (berdiri pertama di lantai panggung, Frame 4-34) */}
          <PopUpPaperTower
            x={mainTowerX}
            baseY={mainTowerBaseY}
            w={128}
            h={mainTowerH}
            standProg={tower1Stand}
            beaconGlow={tower1Beacon}
            accentColor={PAL.sampai.terracotta}
            shadeColor={PAL.sampai.terracottaLo}
            zIndex={16}
          />

          {/* Rumah Desa 1 (paling dekat dengan menara, menyala pertama pada Frame 80-92) */}
          <VillagePaperHouse
            x={475}
            baseY={FLOOR_Y - 14}
            scale={0.92}
            roofColor={PAL.sampai.terracotta}
            roofShade={PAL.sampai.terracottaLo}
            doorColor={PAL.sampai.teal}
            litProg={house1Lit}
            twoWindows
            zIndex={14}
          />

          {/* Rumah Desa 3 (di tengah desa, menyala ketiga pada Frame 100-112) */}
          <VillagePaperHouse
            x={795}
            baseY={FLOOR_Y - 14}
            scale={1}
            roofColor={PAL.sampai.teal}
            roofShade={PAL.sampai.tealLo}
            doorColor={PAL.sampai.marigold}
            litProg={house3Lit}
            twoWindows
            zIndex={15}
          />

          {/* Rumah Desa 5 (di ujung kanan panggung, menyala kelima pada Frame 120-132) */}
          <VillagePaperHouse
            x={1105}
            baseY={FLOOR_Y - 14}
            scale={0.96}
            roofColor={PAL.sampai.terracotta}
            roofShade={PAL.sampai.terracottaLo}
            doorColor={PAL.sampai.teal}
            litProg={house5Lit}
            twoWindows
            zIndex={14}
          />

          {/* Tokoh warga desa tanpa wajah (kepala oval polos satu warna, tanpa mata/mulut/hidung) */}
          <Figure
            x={618}
            y={FLOOR_Y - 14}
            s={0.72}
            shirt={PAL.sampai.marigold}
          />
          <Figure
            x={948}
            y={FLOOR_Y - 14}
            s={0.76}
            shirt={PAL.sampai.leaf}
          />

          {/* Tirai bayangan malam biru lembut di atas desa sebelum cincin cahaya menyapu */}
          {villageNightVeil > 0.01 ? (
            <AbsoluteFill
              style={{
                background:
                  'linear-gradient(90deg, rgba(27,40,59,0.12) 0%, rgba(27,40,59,0.65) 45%, rgba(27,40,59,0.82) 100%)',
                opacity: villageNightVeil,
                pointerEvents: 'none',
                zIndex: 17,
              }}
            />
          ) : null}

          {/* =============================================================== */}
          {/* LAPISAN 4: TIGA CINCIN KERTAS MEMANCAR DARI PUNCAK MENARA       */}
          {/* =============================================================== */}
          <PaperPulseRing
            cx={pulseOriginX}
            cy={pulseOriginY}
            radius={ring1Radius}
            opacity={ring1Opacity}
            seed="ring-1"
          />
          <PaperPulseRing
            cx={pulseOriginX}
            cy={pulseOriginY}
            radius={ring2Radius}
            opacity={ring2Opacity}
            seed="ring-2"
          />
          <PaperPulseRing
            cx={pulseOriginX}
            cy={pulseOriginY}
            radius={ring3Radius}
            opacity={ring3Opacity}
            seed="ring-3"
          />

          {/* =============================================================== */}
          {/* LAPISAN 5: BINGKAI PANGGUNG KERTAS & STRIP TEKS "Sinyal sampai" */}
          {/* =============================================================== */}
          <ProsceniumFrame />
          <AllowedBannerStrip at={74} />
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
