// Adegan MG-B "Satu Lantai, Dua Arah": panggung terbelah lipatan vertikal di tengah.
// Sisi kiri (hijau sage): pekerja berhelm kuning memegang slip gaji yang membuka pop-up berlapis dua kali lipat.
// Sisi kanan (terakota): pemberi kerja berjas bata di samping tumpukan slip biaya yang juga membuka berlapis dua kali lipat, lalu tergelincir ke panggung bawah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Boil, Disc, GRAIN, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {FLOOR_Y} from './mgkit';

export const MGB_DUR = 350;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet kertas hangat (krem, kraft, mustard, hijau sage/zaitun, terakota/bata, cokelat tua) — tanpa biru dingin, hitam pekat, atau neon
const P = {
  wall: C.creamHi,
  cream: C.cream,
  creamHi: '#F4ECE0',
  creamLo: C.creamLo,
  kraft: '#C79B68',
  kraftHi: '#D8B182',
  kraftLo: '#9B7143',
  kraftEdge: '#7A552E',
  kraftStitch: '#5E3B22',
  mustard: '#DDA334',
  mustardHi: '#F0C35A',
  mustardLo: '#A8761D',
  sage: '#7E9672',
  sageHi: '#A3BC96',
  sageLo: '#596E4F',
  sageBeam: 'rgba(138, 166, 124, 0.28)',
  sageTint: 'rgba(126, 150, 114, 0.20)',
  terra: '#C2593F',
  terraHi: '#DE7B61',
  terraLo: '#7D3523',
  brick: ROOM.terracotta,
  terraBeam: 'rgba(194, 89, 63, 0.28)',
  terraTint: 'rgba(154, 90, 66, 0.22)',
  wood: C.wood,
  woodLo: C.woodLo,
  floor: C.floor,
  floorLo: C.floorLo,
  ink: C.ink,
  inkSoft: C.inkSoft,
  tape: C.tape,
};

// Kuantisasi frame ringan (2 frame) untuk gerak stop-motion kertas yang tenang
const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Komponen Label Kertas (satu-satunya cara teks muncul, HANYA dari daftar "Teks boleh tampil")
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed?: string;
  tape?: boolean;
  tapStyle?: boolean;
}> = ({
  x,
  y,
  text,
  at,
  bg = P.creamHi,
  color = P.ink,
  size = 26,
  rot = -1.2,
  seed = 'lbl',
  tape = true,
  tapStyle = false,
}) => {
  const rawF = useCurrentFrame();
  const f = stepFrame(rawF, 2);
  if (rawF < at) return null;

  const opacity = interpolate(rawF, [at, at + 5], [0, 1], CLAMP);
  const scale = tapStyle
    ? interpolate(
        rawF,
        [at, at + 4, at + 8, at + 13],
        [1.42, 0.91, 1.05, 1],
        {...CLAMP, easing: Easing.out(Easing.quad)},
      )
    : interpolate(
        f,
        [at, at + 7, at + 12],
        [0.72, 1.06, 1],
        {...CLAMP, easing: Easing.out(Easing.quad)},
      );

  const tapRingOp = tapStyle
    ? interpolate(rawF, [at + 1, at + 5, at + 16], [0, 0.7, 0], CLAMP)
    : 0;
  const tapRingExpand = tapStyle
    ? interpolate(rawF, [at + 1, at + 16], [0, 1], CLAMP)
    : 0;

  return (
    <Boil seed={seed} amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
          opacity,
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        {tapRingOp > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `calc(100% + ${24 + tapRingExpand * 46}px)`,
              height: `calc(100% + ${16 + tapRingExpand * 34}px)`,
              transform: 'translate(-50%, -50%)',
              borderRadius: 14,
              border: `3px dashed ${P.mustard}`,
              opacity: tapRingOp,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'relative',
            backgroundColor: bg,
            backgroundImage: `url(${GRAIN})`,
            backgroundSize: '420px',
            backgroundBlendMode: 'multiply',
            padding: '10px 22px 12px',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: size,
            color,
            lineHeight: 1.08,
            whiteSpace: 'nowrap',
            border: `2px solid ${P.inkSoft}`,
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(54,34,26,0.36))',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.28)',
          }}
        >
          {text}
        </div>
        {tape ? (
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              width: 58,
              height: 17,
              transform: `translate(-50%, 0) rotate(${-rot * 1.3}deg)`,
              backgroundColor: P.tape,
              opacity: 0.86,
              filter: 'url(#torn)',
            }}
          />
        ) : null}
      </div>
    </Boil>
  );
};

// Figur Pekerja Berhelm Kuning (FACELESS: tanpa mata, hidung, mulut, alis, telinga)
// Postur berubah di Beat b: mengangkat dada, bahu melebar, memegang slip gaji kertas
const FacelessWorkerWithSlip: React.FC<{
  x: number;
  y: number;
  proudProgress: number; // 0 = tegak biasa (Beat a), 1 = angkat dada & bahu melebar (Beat b)
  slipFoldProgress: number; // 0 = selembar, 1 = membuka pop-up berlapis 2x lipat
}> = ({x, y, proudProgress, slipFoldProgress}) => {
  const chestLift = -proudProgress * 9;
  const shoulderScaleX = 1 + proudProgress * 0.18;
  const torsoTilt = -proudProgress * 2.5;
  const armRaise = -proudProgress * 12;

  // Ukuran dasar slip gaji dan ekspansi pop-up berlapis 2x lipat
  const extraLayers = 4;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 140,
        height: 250,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
      }}
    >
      {/* Bayangan jatuh di lantai panggung */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: -10,
          width: 112 + proudProgress * 14,
          height: 22,
          borderRadius: '50%',
          backgroundColor: P.floorLo,
          opacity: 0.38,
        }}
      />

      <Paper lift={5}>
        {/* Kaki pekerja */}
        <Slab x={42} y={182} w={22} h={68} color={P.inkSoft} shade={P.floorLo} shadeH={0.25} r={6} />
        <Slab x={76} y={182} w={22} h={68} color={P.inkSoft} shade={P.floorLo} shadeH={0.25} r={6} />

        {/* Badan + dada terangkat + bahu melebar di Beat b */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: chestLift,
            width: 140,
            height: 190,
            transformOrigin: '70px 180px',
            transform: `rotate(${torsoTilt}deg)`,
          }}
        >
          {/* Lengan kiri menahan dari belakang */}
          <Slab
            x={16 - proudProgress * 7}
            y={82}
            w={20}
            h={72}
            color={P.sageLo}
            r={8}
            rot={12 + proudProgress * 8}
          />

          {/* Bahu & baju kerja hijau sage/kraft (melebar di Beat b) */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 74,
              width: 80,
              height: 112,
              transformOrigin: '50% 35%',
              transform: `scaleX(${shoulderScaleX})`,
            }}
          >
            <Slab
              x={0}
              y={0}
              w={80}
              h={112}
              color={P.sage}
              hi={P.sageHi}
              hiH={0.18}
              shade={P.sageLo}
              shadeH={0.22}
              r={14}
            />
            {/* Selempang overall kerja kertas kraft */}
            <Slab x={16} y={2} w={12} h={108} color={P.kraftLo} r={3} />
            <Slab x={52} y={2} w={12} h={108} color={P.kraftLo} r={3} />
            <Slab x={14} y={48} w={52} h={42} color={P.kraft} shade={P.kraftLo} shadeH={0.2} r={6} />
          </div>

          {/* Kepala bulat polos FACELESS (tanpa mata/hidung/mulut/alis/telinga) */}
          <Disc x={70} y={42} d={54} color={P.creamHi} shade={P.creamLo} />

          {/* Helm kuning pekerja pabrik */}
          <Slab
            x={36}
            y={8}
            w={68}
            h={28}
            color={P.mustardHi}
            hi={P.creamHi}
            hiH={0.16}
            shade={P.mustard}
            shadeH={0.28}
            r="34px 34px 6px 6px"
          />
          <Slab x={28} y={31} w={84} h={9} color={P.mustard} shade={P.mustardLo} shadeH={0.35} r={4} />

          {/* Lengan kanan terulur ke depan memegang slip gaji */}
          <Slab
            x={94 + proudProgress * 6}
            y={84 + armRaise}
            w={52}
            h={20}
            color={P.sage}
            shade={P.sageLo}
            shadeH={0.25}
            r={8}
            rot={-14 - proudProgress * 8}
          />
          {/* Tangan kertas bulat polos */}
          <Disc x={140 + proudProgress * 8} y={76 + armRaise} d={22} color={P.creamHi} shade={P.creamLo} />
        </div>
      </Paper>

      {/* SLIP GAJI KERTAS (membuka pop-up berlapis 2x lipat di Beat b, garis abstrak tanpa nominal) */}
      <div
        style={{
          position: 'absolute',
          left: 128 + proudProgress * 10,
          top: 24 + chestLift + armRaise,
          width: 150,
          height: 130,
          pointerEvents: 'none',
        }}
      >
        {/* Bayangan jatuh ekstra saat slip gaji menebal 2x lipat */}
        <div
          style={{
            position: 'absolute',
            left: 10 + slipFoldProgress * 8,
            top: 26 + slipFoldProgress * 12,
            width: 112 + slipFoldProgress * 14,
            height: 78 + slipFoldProgress * 28,
            backgroundColor: P.floorLo,
            opacity: 0.22 + slipFoldProgress * 0.22,
            borderRadius: 6,
            transform: 'rotate(-4deg)',
            filter: 'blur(3px)',
          }}
        />

        {/* Lembar-lembar lipatan pop-up akordeon yang mekar ke atas/samping (tampak tebal 2x lipat) */}
        {Array.from({length: extraLayers}).map((_, idx) => {
          const layerT = Math.max(
            0,
            Math.min(1, (slipFoldProgress * 1.25) - idx * 0.14),
          );
          const offsetX = (idx + 1) * 7 * layerT;
          const offsetY = -(idx + 1) * 11 * layerT;
          const rotDeg = -4 + (idx + 1) * 2.8 * layerT;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: offsetX,
                top: 24 + offsetY,
                width: 112,
                height: 76,
                transform: `rotate(${rotDeg}deg) scaleY(${0.35 + 0.65 * layerT})`,
                transformOrigin: '0% 100%',
                opacity: layerT > 0.02 ? 1 : 0,
              }}
            >
              <Paper lift={3 + idx}>
                <Slab
                  x={0}
                  y={0}
                  w={112}
                  h={76}
                  color={idx % 2 === 0 ? P.cream : P.creamHi}
                  hi={P.creamHi}
                  hiH={0.16}
                  shade={P.kraft}
                  shadeH={0.22}
                  r={4}
                  style={{border: `2px solid ${P.inkSoft}`}}
                >
                  {/* Lipatan engsel pop-up kertas di sisi kiri & kanan */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 10,
                      backgroundColor: P.mustardHi,
                      opacity: 0.75,
                    }}
                  />
                  {/* Garis tulisan abstrak tanpa angka/nominal */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 18,
                      top: 14,
                      width: 68,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: P.sageLo,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 18,
                      top: 28,
                      width: 52,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: P.inkSoft,
                      opacity: 0.65,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 18,
                      top: 40,
                      width: 74,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: P.mustardLo,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 18,
                      top: 54,
                      width: 44,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: P.sage,
                      opacity: 0.75,
                    }}
                  />
                </Slab>
              </Paper>
            </div>
          );
        })}

        {/* Lembar dasar slip gaji utama yang dipegang sejak Beat a */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 24,
            width: 112,
            height: 76,
            transform: 'rotate(-4deg)',
          }}
        >
          <Paper lift={5}>
            <Slab
              x={0}
              y={0}
              w={112}
              h={76}
              color={P.creamHi}
              hi="#FFFFFF"
              hiH={0.14}
              shade={P.kraft}
              shadeH={0.2 + slipFoldProgress * 0.12}
              r={4}
              style={{border: `2.5px solid ${P.inkSoft}`}}
            >
              {/* Pita tepi mustard pada slip gaji */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 11,
                  backgroundColor: P.mustard,
                }}
              />
              {/* Garis-garis tulisan abstrak (tanpa angka/nominal) */}
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 15,
                  width: 66,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: P.inkSoft,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 29,
                  width: 48,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: P.inkSoft,
                  opacity: 0.55,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 42,
                  width: 72,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: P.sageLo,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 56,
                  width: 40,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: P.mustardLo,
                  opacity: 0.75,
                }}
              />
            </Slab>
          </Paper>
        </div>
      </div>
    </div>
  );
};

// Figur Pemberi Kerja Berjas Bata (FACELESS: tanpa mata, hidung, mulut, alis, telinga)
// Di Beat d: bergeser sedikit ke belakang, bahu turun
const FacelessEmployer: React.FC<{
  x: number;
  y: number;
  recoilProgress: number; // 0 = berdiri tegak di Beat c, 1 = bergeser ke belakang & bahu turun di Beat d
}> = ({x, y, recoilProgress}) => {
  const shiftBackX = recoilProgress * 26;
  const shoulderDropY = recoilProgress * 12;
  const bodyLean = recoilProgress * 6.5;
  const scaleY = 1 - recoilProgress * 0.045;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + shiftBackX,
        top: y,
        width: 130,
        height: 250,
        transform: `translate(-50%, -100%) scaleY(${scaleY})`,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
      }}
    >
      {/* Bayangan jatuh pemberi kerja */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: -10,
          width: 100,
          height: 22,
          borderRadius: '50%',
          backgroundColor: P.floorLo,
          opacity: 0.38,
        }}
      />

      <Paper lift={5}>
        {/* Kaki celana cokelat tua */}
        <Slab x={38} y={182} w={22} h={68} color={P.floorLo} shade={P.ink} shadeH={0.25} r={6} />
        <Slab x={70} y={182} w={22} h={68} color={P.floorLo} shade={P.ink} shadeH={0.25} r={6} />

        {/* Badan jas bata + bahu turun saat recoil */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: shoulderDropY,
            width: 130,
            height: 190,
            transformOrigin: '65px 180px',
            transform: `rotate(${bodyLean}deg)`,
          }}
        >
          {/* Lengan kiri turun terkulai di samping tumpukan biaya */}
          <Slab
            x={10}
            y={82 + shoulderDropY * 0.7}
            w={20}
            h={74}
            color={P.terraLo}
            r={8}
            rot={10 - recoilProgress * 14}
          />
          <Disc
            x={16 + recoilProgress * 6}
            y={156 + shoulderDropY * 0.7}
            d={20}
            color={P.creamHi}
            shade={P.creamLo}
          />

          {/* Jas bata (atribut pemberi kerja) */}
          <Slab
            x={24}
            y={74}
            w={82}
            h={114}
            color={P.brick}
            hi={P.terraHi}
            hiH={0.14}
            shade={P.terraLo}
            shadeH={0.25}
            r={12}
          />

          {/* Kerah kemeja krem V & dasi kertas terakota tua (tanpa wajah) */}
          <div
            style={{
              position: 'absolute',
              left: 65,
              top: 74,
              width: 28,
              height: 42,
              transform: 'translate(-50%, 0)',
              backgroundColor: P.creamHi,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            }}
          />
          <Slab x={61} y={78} w={8} h={34} color={P.terraLo} r={2} />
          {/* Kelepak kerah jas */}
          <Slab x={42} y={74} w={12} h={40} color={P.terraLo} r={2} rot={-14} />
          <Slab x={76} y={74} w={12} h={40} color={P.terraLo} r={2} rot={14} />

          {/* Lengan kanan turun berat saat biaya naik 2x lipat */}
          <Slab
            x={98}
            y={82 + shoulderDropY * 0.9}
            w={20}
            h={74}
            color={P.terraLo}
            r={8}
            rot={-8 - recoilProgress * 10}
          />
          <Disc
            x={110}
            y={156 + shoulderDropY * 0.9}
            d={20}
            color={P.creamHi}
            shade={P.creamLo}
          />

          {/* Kepala bulat polos FACELESS (tanpa mata/hidung/mulut/alis/telinga) */}
          <Disc
            x={65}
            y={42 + recoilProgress * 4}
            d={54}
            color={P.creamHi}
            shade={P.creamLo}
          />
        </div>
      </Paper>
    </div>
  );
};

// Tumpukan Slip Biaya Kertas di sisi kanan:
// Beat c: tumpukan awal di samping pemberi kerja.
// Beat d: tumbuh dengan cara yang sama persis seperti slip gaji (terlipat membuka pop-up, berlapis 2x lipat, bayangan jatuh lebih berat).
// Beat e (peralihan): tergelincir dari sisi kanan, jatuh ke atas panggung bagian bawah untuk pembuka MG-C.
const CostSlipStack: React.FC<{
  baseX: number;
  baseY: number;
  growProgress: number; // 0 = tumpukan awal (Beat c), 1 = membuka pop-up berlapis 2x lipat (Beat d)
  slideProgress: number; // 0 = di atas lantai sisi kanan, 1 = tergelincir jatuh ke panggung bawah (Beat e)
}> = ({baseX, baseY, growProgress, slideProgress}) => {
  // Gerak tergelincir di Beat e: meluncur miring dari sisi kanan lalu mendarat di panggung bagian bawah
  const slideX = interpolate(slideProgress, [0, 0.55, 1], [0, -54, -92], CLAMP);
  const slideY = interpolate(
    slideProgress,
    [0, 0.35, 0.78, 1],
    [0, 14, 108, 96],
    CLAMP,
  );
  const slideTilt = interpolate(
    slideProgress,
    [0, 0.4, 0.8, 1],
    [0, -14, 8, -3],
    CLAMP,
  );

  const baseSheets = 4;
  const extraPopSheets = 4;
  const sheetW = 132;
  const sheetH = 68;

  // Bayangan jatuh yang menjadi jauh lebih berat saat tumpukan tumbuh 2x lipat di Beat d
  const shadowWidth = 148 + growProgress * 34;
  const shadowHeight = 26 + growProgress * 18;
  const shadowOpacity = 0.34 + growProgress * 0.34;

  return (
    <div
      style={{
        position: 'absolute',
        left: baseX + slideX,
        top: baseY + slideY,
        width: 180,
        height: 240,
        transform: `translate(-50%, -100%) rotate(${slideTilt}deg)`,
        transformOrigin: '50% 90%',
        pointerEvents: 'none',
        zIndex: 22,
      }}
    >
      {/* Bayangan jatuh berat di bawah tumpukan biaya */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -12,
          width: shadowWidth,
          height: shadowHeight,
          transform: 'translate(-50%, 0)',
          borderRadius: '50%',
          backgroundColor: P.floorLo,
          opacity: shadowOpacity,
          filter: `blur(${2 + growProgress * 3}px)`,
        }}
      />

      {/* Lembar-lembar dasar tumpukan slip biaya (hadir sejak awal, disorot jelas di Beat c) */}
      {Array.from({length: baseSheets}).map((_, i) => {
        const yOff = 162 - i * 14;
        const xOff = 24 + (i % 2 === 0 ? -3 : 4);
        const rot = (i % 2 === 0 ? -1.8 : 1.6) * (1 + i * 0.15);
        return (
          <div
            key={`base-${i}`}
            style={{
              position: 'absolute',
              left: xOff,
              top: yOff,
              width: sheetW,
              height: sheetH,
              transform: `rotate(${rot}deg)`,
            }}
          >
            <Paper lift={3 + i}>
              <Slab
                x={0}
                y={0}
                w={sheetW}
                h={sheetH}
                color={i % 2 === 0 ? P.cream : P.creamHi}
                hi={P.creamHi}
                hiH={0.15}
                shade={P.kraft}
                shadeH={0.26}
                r={4}
                style={{border: `2px solid ${P.inkSoft}`}}
              >
                {/* Pita tepi terakota pada slip biaya */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    backgroundColor: P.terra,
                  }}
                />
                {/* Garis tulisan abstrak tanpa angka/nominal */}
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 14,
                    width: 78,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: P.terraLo,
                    opacity: 0.85,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 28,
                    width: 56,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: P.inkSoft,
                    opacity: 0.65,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 42,
                    width: 84,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: P.brick,
                    opacity: 0.8,
                  }}
                />
              </Slab>
            </Paper>
          </div>
        );
      })}

      {/* Lipatan akordeon kertas vertikal yang merentangkan tumpukan 2x lipat seperti kartu pop-up */}
      {growProgress > 0.02 ? (
        <svg
          width={160}
          height={180}
          style={{
            position: 'absolute',
            left: 10,
            top: 20,
            overflow: 'visible',
          }}
        >
          <polyline
            points={`18,118 8,${118 - growProgress * 22} 22,${118 - growProgress * 44} 8,${118 - growProgress * 66} 22,${118 - growProgress * 88}`}
            fill="none"
            stroke={P.kraftLo}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <polyline
            points={`134,118 144,${118 - growProgress * 22} 130,${118 - growProgress * 44} 144,${118 - growProgress * 66} 130,${118 - growProgress * 88}`}
            fill="none"
            stroke={P.kraftLo}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </svg>
      ) : null}

      {/* Lapisan pop-up kedua (tumbuh 2x lipat di Beat d dengan cara persis seperti slip gaji) */}
      {Array.from({length: extraPopSheets}).map((_, idx) => {
        const layerT = Math.max(
          0,
          Math.min(1, growProgress * 1.25 - idx * 0.14),
        );
        const yOff = 112 - idx * 14 - layerT * (22 + idx * 11);
        const xOff = 24 + (idx % 2 === 0 ? 5 : -4) * layerT;
        const rot = (-3 + idx * 2.4) * layerT;

        return (
          <div
            key={`pop-${idx}`}
            style={{
              position: 'absolute',
              left: xOff,
              top: yOff,
              width: sheetW,
              height: sheetH,
              transform: `rotate(${rot}deg) scaleY(${0.3 + 0.7 * layerT})`,
              transformOrigin: '50% 100%',
              opacity: layerT > 0.02 ? 1 : 0,
            }}
          >
            <Paper lift={6 + idx * 2}>
              <Slab
                x={0}
                y={0}
                w={sheetW}
                h={sheetH}
                color={idx % 2 === 0 ? P.creamHi : P.cream}
                hi="#FFFFFF"
                hiH={0.14}
                shade={P.terra}
                shadeH={0.24}
                r={4}
                style={{border: `2.5px solid ${P.inkSoft}`}}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    backgroundColor: P.terra,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 14,
                    width: 82,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: P.terra,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 28,
                    width: 64,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: P.inkSoft,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 42,
                    width: 88,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: P.terraLo,
                  }}
                />
              </Slab>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

// Tiga elemen tetap "Panggung Lantai":
// 1. PAPAN LANTAI KRAFT (upah minimum: tebal, tepi atas berjahit garis putus-putus) terbelah di lipatan tengah
// 2. BENANG MUSTARD BERTITIK (harga yang terbentuk di pasar / nilai yang dihasilkan pekerja)
const SplitStagePlankAndThread: React.FC<{
  plankY: number;
  threadY: number;
  creaseGap: number;
}> = ({plankY, threadY, creaseGap}) => {
  const leftPlankW = 540 - creaseGap / 2;
  const rightPlankX = 640 + creaseGap / 2;
  const rightPlankW = 540 - creaseGap / 2;
  const plankH = 44;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* BENANG MUSTARD BERTITIK melintasi panggung belakang sebagai acuan nilai pasar */}
      <Paper lift={4}>
        <Disc x={86} y={threadY} d={22} color={P.mustard} shade={P.mustardLo} />
        <Disc x={1194} y={threadY} d={22} color={P.mustard} shade={P.mustardLo} />
      </Paper>
      <svg
        width={1280}
        height={720}
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#rough) drop-shadow(0px 3px 4px rgba(54,34,26,0.28))',
        }}
      >
        <line
          x1={86}
          y1={threadY}
          x2={1194}
          y2={threadY}
          stroke={P.mustardLo}
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.55}
        />
        <line
          x1={86}
          y1={threadY}
          x2={1194}
          y2={threadY}
          stroke={P.mustardHi}
          strokeWidth={4.5}
          strokeDasharray="12 9"
          strokeLinecap="round"
        />
      </svg>

      {/* PAPAN LANTAI KRAFT KIRI (sisi pekerja) */}
      <Paper lift={6}>
        <Slab
          x={100}
          y={plankY}
          w={leftPlankW}
          h={plankH}
          color={P.kraft}
          hi={P.kraftHi}
          hiH={0.18}
          shade={P.kraftLo}
          shadeH={0.26}
          r="6px 2px 2px 6px"
        >
          <svg
            width={leftPlankW}
            height={16}
            style={{position: 'absolute', left: 0, top: 2}}
          >
            <line
              x1={12}
              y1={7}
              x2={leftPlankW - 10}
              y2={7}
              stroke={P.kraftStitch}
              strokeWidth={3}
              strokeDasharray="11 7"
              strokeLinecap="round"
            />
          </svg>
        </Slab>
      </Paper>

      {/* PAPAN LANTAI KRAFT KANAN (sisi pemberi kerja) */}
      <Paper lift={6}>
        <Slab
          x={rightPlankX}
          y={plankY}
          w={rightPlankW}
          h={plankH}
          color={P.kraft}
          hi={P.kraftHi}
          hiH={0.18}
          shade={P.kraftLo}
          shadeH={0.26}
          r="2px 6px 6px 2px"
        >
          <svg
            width={rightPlankW}
            height={16}
            style={{position: 'absolute', left: 0, top: 2}}
          >
            <line
              x1={10}
              y1={7}
              x2={rightPlankW - 12}
              y2={7}
              stroke={P.kraftStitch}
              strokeWidth={3}
              strokeDasharray="11 7"
              strokeLinecap="round"
            />
          </svg>
        </Slab>
      </Paper>
    </div>
  );
};

// Lipatan kertas vertikal di tengah panggung yang membelah sisi kiri dan kanan
const CenterVerticalPaperFold: React.FC<{foldProgress: number}> = ({
  foldProgress,
}) => {
  const ridgeW = interpolate(foldProgress, [0, 1], [4, 28], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: -20,
        width: ridgeW,
        height: 760,
        transform: 'translate(-50%, 0)',
        pointerEvents: 'none',
        zIndex: 24,
      }}
    >
      {/* Bayangan dalam lipatan kertas kiri & kanan */}
      <div
        style={{
          position: 'absolute',
          left: -18,
          top: 0,
          width: 18,
          height: '100%',
          background:
            'linear-gradient(90deg, rgba(54,34,26,0) 0%, rgba(54,34,26,0.34) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -18,
          top: 0,
          width: 18,
          height: '100%',
          background:
            'linear-gradient(270deg, rgba(54,34,26,0) 0%, rgba(54,34,26,0.34) 100%)',
        }}
      />
      {/* Punggung lipatan kertas tengah (dua bidang miring bertemu di garis lipatan) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: P.creamHi,
          borderLeft: `2px solid ${P.kraftLo}`,
          filter: 'url(#rough)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: P.creamLo,
          borderRight: `2px solid ${P.kraftLo}`,
          filter: 'url(#rough)',
        }}
      />
      {/* Garis jahitan lipatan vertikal di tengah */}
      <svg
        width={12}
        height={760}
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          transform: 'translate(-50%, 0)',
        }}
      >
        <line
          x1={6}
          y1={0}
          x2={6}
          y2={760}
          stroke={P.woodLo}
          strokeWidth={2.5}
          strokeDasharray="10 8"
        />
      </svg>
    </div>
  );
};

export const MGB: React.FC = () => {
  const rawF = useCurrentFrame();
  const f = stepFrame(rawF, 2);

  // ===========================================================================
  // JENDELA FRAME BEAT (0..350 @30fps):
  // Beat a [0–102]:   "Arah pertama, bagi yang tetap bekerja, kabar baik."
  //                   Panggung terbelah lipatan kertas vertikal di tengah.
  //                   Sisi kiri disorot hangat hijau sage. Pekerja berhelm kuning
  //                   berdiri tegak memegang selembar slip gaji. Label "Arah pertama"
  //                   & "yang tetap bekerja" menempel di lantai sisi itu.
  // Beat b [121–190]: "Gajinya naik. Dua kali lipat."
  //                   Slip gaji terlipat membuka seperti kartu pop-up berlapis 2x lipat.
  //                   Pekerja mengangkat dada, bahu melebar. Label "Gajinya naik"
  //                   & "Dua kali lipat" ditempel dengan satu ketukan.
  // Beat c [210–268]: "Tetapi arah kedua, bagi pemberi kerja,"
  //                   Sorot berpindah ke sisi kanan, nuansa terakota. Pemberi kerja
  //                   berjas bata berdiri di samping tumpukan slip biaya kertas.
  //                   Label "Arah kedua" & "pemberi kerja" menempel.
  // Beat d [268–318]: "biaya naik dua kali lipat juga."
  //                   Tumpukan biaya tumbuh persis seperti slip gaji: membuka pop-up
  //                   berlapis 2x lipat, bayangan jatuh lebih berat. Pemberi kerja
  //                   bergeser sedikit ke belakang, bahu turun. Label
  //                   "biaya naik dua kali lipat juga" menempel.
  // Beat e [318–350]: (peralihan) Dua sisi hening sejenak, simetris (318–330).
  //                   Lalu (330–350) tumpukan biaya tergelincir dari sisi kanan,
  //                   jatuh ke atas panggung bagian bawah untuk pembuka MG-C.
  // ===========================================================================

  // 1. Lipatan vertikal tengah membelah panggung sejak awal Beat a
  const foldProgress = interpolate(f, [0, 22], [0.25, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // 2. Sorot lampu hangat sisi kiri (hijau sage) vs sisi kanan (terakota),
  //    lalu simetris sejenak di Beat e (318..350)
  const leftSpotIn = interpolate(f, [4, 28], [0.2, 1], CLAMP);
  const leftSpotDimC = interpolate(f, [210, 232], [0, 0.38], CLAMP);
  const leftSpotSymE = interpolate(f, [316, 326], [0, 0.38], CLAMP);
  const leftSpot = Math.max(0.2, Math.min(1, leftSpotIn - leftSpotDimC + leftSpotSymE));

  const rightSpotBase = 0.34;
  const rightSpotUpC = interpolate(f, [210, 234], [0, 0.66], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightSpot = Math.max(0.25, Math.min(1, rightSpotBase + rightSpotUpC));

  // 3. Beat b (121–190): Slip gaji membuka pop-up berlapis 2x lipat & pekerja mengangkat dada/bahu melebar
  const slipFoldProgress = interpolate(f, [124, 156], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const proudProgress = interpolate(f, [128, 162], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // 4. Beat d (268–318): Tumpukan biaya membuka pop-up berlapis 2x lipat & pemberi kerja mundur/bahu turun
  const costGrowProgress = interpolate(f, [270, 300], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const employerRecoil = interpolate(f, [274, 304], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // 5. Beat e (318–350): Hening simetris sejenak (318–330), lalu tumpukan biaya tergelincir ke panggung bawah (330–350)
  const costSlideProgress = interpolate(f, [330, 349], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Posisi papan lantai kraft di atas lantai panggung
  const plankTopY = 532;
  const threadY = 398;

  // Alat ketuk kertas saat menempel "Dua kali lipat" (ketukan pada frame 152)
  const tapFrameB = 152;
  const tapperBOp = interpolate(
    rawF,
    [tapFrameB - 5, tapFrameB, tapFrameB + 8, tapFrameB + 15],
    [0, 1, 1, 0],
    CLAMP,
  );
  const tapperBY = interpolate(
    rawF,
    [tapFrameB - 5, tapFrameB + 2, tapFrameB + 15],
    [168, 224, 150],
    {...CLAMP, easing: Easing.inOut(Easing.quad)},
  );

  return (
    <AbsoluteFill style={{backgroundColor: P.wall}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={MGB_DUR}
          yaw={10}
          push={1.05}
          focus={0.5}
          depth={620}
          origin={[640, 480]}
        >
          {/* LAPIS 0: Dinding teater kertas terbelah dua (kiri hijau sage hangat, kanan terakota hangat) */}
          <Depth z={0.12} cover>
            <Slab x={-60} y={-50} w={1400} h={820} color={P.wall} r={0} grain={0.55} />

            {/* Latar Sisi Kiri (hijau sage hangat) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 640,
                height: FLOOR_Y,
                backgroundColor: P.sageTint,
                opacity: 0.45 + leftSpot * 0.55,
              }}
            />
            {/* Kerucut sorot lampu hangat hijau sage di sisi kiri */}
            <div
              style={{
                position: 'absolute',
                left: 50,
                top: -10,
                width: 540,
                height: FLOOR_Y + 20,
                background: `linear-gradient(180deg, ${P.sageBeam} 0%, rgba(163,188,150,0.08) 100%)`,
                clipPath: 'polygon(26% 0%, 74% 0%, 98% 100%, 2% 100%)',
                opacity: leftSpot,
              }}
            />

            {/* Latar Sisi Kanan (nuansa terakota hangat) */}
            <div
              style={{
                position: 'absolute',
                left: 640,
                top: 0,
                width: 640,
                height: FLOOR_Y,
                backgroundColor: P.terraTint,
                opacity: 0.35 + rightSpot * 0.65,
              }}
            />
            {/* Kerucut sorot lampu hangat terakota di sisi kanan */}
            <div
              style={{
                position: 'absolute',
                left: 690,
                top: -10,
                width: 540,
                height: FLOOR_Y + 20,
                background: `linear-gradient(180deg, ${P.terraBeam} 0%, rgba(224,122,95,0.08) 100%)`,
                clipPath: 'polygon(26% 0%, 74% 0%, 98% 100%, 2% 100%)',
                opacity: rightSpot,
              }}
            />

            {/* Vignette hangat teater kertas */}
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 44%, rgba(255,248,232,0.16) 0%, rgba(54,34,26,0) 54%, rgba(54,34,26,0.28) 100%)',
              }}
            />
          </Depth>

          {/* LAPIS 0.5: Lantai panggung, Papan Lantai Kraft, Benang Mustard, Figur Faceless, Slip & Tumpukan Biaya */}
          <Depth z={0.5}>
            <Boil seed="mgb-stage" amp={0.4} rot={0.05}>
              {/* Lantai panggung kayu */}
              <Slab
                x={-40}
                y={FLOOR_Y}
                w={1360}
                h={720 - FLOOR_Y + 40}
                color={P.floor}
                r={0}
                grain={0.62}
              />
              <Slab
                x={-40}
                y={FLOOR_Y - 22}
                w={1360}
                h={26}
                color={P.woodLo}
                shade={P.floorLo}
                shadeH={0.35}
                r={0}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -40,
                  right: -40,
                  top: FLOOR_Y + 40,
                  height: 3,
                  backgroundColor: P.floorLo,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -40,
                  right: -40,
                  top: FLOOR_Y + 82,
                  height: 3,
                  backgroundColor: P.floorLo,
                  opacity: 0.85,
                }}
              />

              {/* Pendar cahaya lantai sisi kiri & sisi kanan */}
              <div
                style={{
                  position: 'absolute',
                  left: 80,
                  top: FLOOR_Y - 12,
                  width: 480,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: P.sageHi,
                  opacity: leftSpot * 0.25,
                  filter: 'blur(6px)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 720,
                  top: FLOOR_Y - 12,
                  width: 480,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: P.terraHi,
                  opacity: rightSpot * 0.25,
                  filter: 'blur(6px)',
                }}
              />

              {/* Papan Lantai Kraft (terbelah dua arah) & Benang Mustard Bertitik */}
              <SplitStagePlankAndThread
                plankY={plankTopY}
                threadY={threadY}
                creaseGap={34}
              />

              {/* SISI KIRI: Pekerja berhelm kuning (faceless) memegang slip gaji yang membuka pop-up 2x lipat */}
              <FacelessWorkerWithSlip
                x={255}
                y={plankTopY + 4}
                proudProgress={proudProgress}
                slipFoldProgress={slipFoldProgress}
              />

              {/* SISI KANAN: Pemberi kerja berjas bata (faceless) & tumpukan slip biaya kertas */}
              <div style={{opacity: 0.55 + rightSpot * 0.45}}>
                <FacelessEmployer
                  x={1020}
                  y={plankTopY + 4}
                  recoilProgress={employerRecoil}
                />
                <CostSlipStack
                  baseX={825}
                  baseY={plankTopY + 6}
                  growProgress={costGrowProgress}
                  slideProgress={costSlideProgress}
                />
              </div>

              {/* Lipatan kertas vertikal di tengah panggung */}
              <CenterVerticalPaperFold foldProgress={foldProgress} />
            </Boil>

            {/* ================================================================= */}
            {/* LABEL KERTAS — HANYA DARI DAFTAR "TEKS BOLEH TAMPIL" MG-B         */}
            {/* Daftar resmi:                                                     */}
            {/* "Arah pertama", "yang tetap bekerja", "Gajinya naik",             */}
            {/* "Dua kali lipat", "Arah kedua", "pemberi kerja",                  */}
            {/* "biaya naik dua kali lipat juga"                                  */}
            {/* ================================================================= */}

            {/* Beat a [0–102]: "Arah pertama" & "yang tetap bekerja" (menempel di lantai sisi kiri) */}
            <PaperLabel
              x={320}
              y={74}
              text="Arah pertama"
              at={10}
              bg={P.sageHi}
              color={P.ink}
              size={28}
              rot={-1.4}
              seed="lbl-arah1"
            />
            <PaperLabel
              x={320}
              y={614}
              text="yang tetap bekerja"
              at={28}
              bg={P.creamHi}
              color={P.ink}
              size={27}
              rot={-0.8}
              seed="lbl-tetap"
            />

            {/* Beat b [121–190]: "Gajinya naik" & "Dua kali lipat" (ditempel dengan satu ketukan) */}
            <PaperLabel
              x={395}
              y={156}
              text="Gajinya naik"
              at={124}
              bg={P.creamHi}
              color={P.sageLo}
              size={26}
              rot={-1.6}
              seed="lbl-gaji"
            />
            <PaperLabel
              x={405}
              y={228}
              text="Dua kali lipat"
              at={tapFrameB}
              bg={P.mustardHi}
              color={P.ink}
              size={30}
              rot={1.5}
              seed="lbl-2x"
              tapStyle
            />

            {/* Alat ketuk kertas saat menempel "Dua kali lipat" dengan satu ketukan */}
            {tapperBOp > 0.01 ? (
              <Paper lift={8} style={{opacity: tapperBOp}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 405,
                    top: tapperBY,
                    transform: 'translate(-50%, -100%) rotate(-10deg)',
                    zIndex: 35,
                  }}
                >
                  <Slab x={-26} y={-16} w={52} h={20} color={P.mustard} shade={P.mustardLo} r={5} />
                  <Slab x={-10} y={-84} w={20} h={70} color={P.wood} shade={P.woodLo} r={6} />
                </div>
              </Paper>
            ) : null}

            {/* Beat c [210–268]: "Arah kedua" & "pemberi kerja" */}
            <PaperLabel
              x={960}
              y={74}
              text="Arah kedua"
              at={214}
              bg={P.terraHi}
              color={P.ink}
              size={28}
              rot={1.3}
              seed="lbl-arah2"
            />
            <PaperLabel
              x={960}
              y={614}
              text="pemberi kerja"
              at={228}
              bg={P.creamHi}
              color={P.ink}
              size={27}
              rot={0.9}
              seed="lbl-pk"
            />

            {/* Beat d [268–318]: "biaya naik dua kali lipat juga" */}
            <PaperLabel
              x={895}
              y={216}
              text="biaya naik dua kali lipat juga"
              at={278}
              bg={P.terra}
              color={P.creamHi}
              size={25}
              rot={-1.4}
              seed="lbl-biaya2x"
              tapStyle
            />
          </Depth>

          {/* LAPIS 1: Bingkai Tirai Sayap Teater Kertas Terakota */}
          <Depth z={0.85}>
            <Paper lift={7}>
              <Slab
                x={-18}
                y={-18}
                w={74}
                h={756}
                color={P.terra}
                shade={P.terraLo}
                shadeH={0.14}
                r="0 0 16px 0"
              />
              <Slab
                x={40}
                y={-18}
                w={30}
                h={620}
                color={P.brick}
                shade={P.terraLo}
                shadeH={0.16}
                r="0 0 12px 12px"
              />
              <Slab
                x={1224}
                y={-18}
                w={74}
                h={756}
                color={P.terra}
                shade={P.terraLo}
                shadeH={0.14}
                r="0 0 0 16px"
              />
              <Slab
                x={1210}
                y={-18}
                w={30}
                h={620}
                color={P.brick}
                shade={P.terraLo}
                shadeH={0.16}
                r="0 0 12px 12px"
              />
              <Slab
                x={-20}
                y={-14}
                w={1320}
                h={30}
                color={P.terraLo}
                shade={P.floorLo}
                shadeH={0.3}
                r={4}
              />
            </Paper>
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default MGB;
