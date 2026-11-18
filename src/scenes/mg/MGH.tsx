// Adegan MG-H: Perjalanan uang dari kenaikan biaya pabrik ke harga barang dan pos pengeluaran.
// Koin mustard berlapis terkikis di warung, ongkos, dan kebutuhan pokok hingga tipis di tangan pekerja.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, CameraPush, Disc, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {SnapZoom} from '../../lib/paper/camera';
import {FilmWeave} from '../../lib/paper/look';

export const MGH_DUR = 673;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const P = {
  cream: C.creamHi,
  creamMid: C.cream,
  creamDark: C.creamLo,
  kraft: '#B98B5B',
  kraftHi: '#CDA376',
  kraftLo: '#8F6539',
  mustard: '#D4A243',
  mustardHi: '#E8BD63',
  mustardLo: '#9C7433',
  sage: ROOM.sage,
  sageLo: C.sageLo,
  terra: C.tag,
  terraLo: ROOM.terracotta,
  brown: C.floor,
  brownLo: C.floorLo,
  ink: C.inkSoft,
};

// Label kertas satu-satunya cara teks muncul di panggung
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed: string;
}> = ({x, y, text, at, bg = P.creamMid, color = P.brownLo, size = 24, rot = -1.5, seed}) => (
  <PopIn at={at} seed={seed}>
    <Boil seed={seed} amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          translate: '-50% -50%',
          rotate: `${rot}deg`,
          whiteSpace: 'nowrap',
          backgroundColor: bg,
          padding: '10px 20px 12px',
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: size,
          color,
          lineHeight: 1.05,
          border: `2px solid ${P.kraftLo}`,
          filter: 'url(#torn) drop-shadow(2px 5px 6px rgba(54,34,26,0.34))',
        }}
      >
        {text}
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            translate: '-50% 0',
            width: 48,
            height: 16,
            background: C.tape,
            opacity: 0.85,
            rotate: '2deg',
          }}
        />
      </div>
    </Boil>
  </PopIn>
);

// Label harga fisik tanpa angka (hanya garis corak kertas) yang membalik naik
const FlipPriceTag: React.FC<{
  x: number;
  y: number;
  at: number;
  color?: string;
}> = ({x, y, at, color = P.terra}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [at, at + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.7)),
  });
  const liftY = interpolate(u, [0, 1], [18, -16], CLAMP);
  const flipDeg = interpolate(u, [0, 0.5, 1], [75, -12, 0], CLAMP);
  const tilt = interpolate(u, [0, 1], [14, -6], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + liftY,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `perspective(400px) rotateX(${flipDeg}deg) rotate(${tilt}deg)`,
      }}
    >
      <Paper lift={3}>
        <Slab
          x={-26}
          y={-64}
          w={52}
          h={64}
          color={u > 0.35 ? color : P.kraftHi}
          shade={P.kraftLo}
          shadeH={0.14}
          r="10px 10px 4px 4px"
        >
          {/* Lubang tali label */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 8,
              width: 8,
              height: 8,
              translate: '-50% 0',
              borderRadius: '50%',
              background: P.cream,
              border: `2px solid ${P.brown}`,
            }}
          />
          {/* Segitiga panah naik abstrak dari potongan kertas */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 20,
              width: 22,
              height: 14,
              translate: '-50% 0',
              background: P.mustardHi,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              opacity: interpolate(u, [0.2, 0.8], [0.25, 1], CLAMP),
            }}
          />
          {/* Corak garis abstrak pengganti nominal */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 40,
              width: 32,
              height: 5,
              borderRadius: 2,
              background: P.cream,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 49,
              width: 24,
              height: 5,
              borderRadius: 2,
              background: P.creamMid,
            }}
          />
        </Slab>
      </Paper>
    </div>
  );
};

// Tokoh kertas faceless dengan atribut peran dan postur bahu
const FacelessRoleFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  role: 'employer' | 'vendor' | 'worker';
  slump?: number;
  reachAmt?: number;
}> = ({x, y, s = 1, role, slump = 0, reachAmt = 0}) => {
  const shirt =
    role === 'employer' ? P.terra : role === 'vendor' ? P.sage : P.kraftLo;
  const shoulderDrop = slump * 12 * s;
  const headDrop = slump * 9 * s;
  const headTilt = slump * -8;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * s,
        height: 196 * s,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={4}>
        {/* Kaki */}
        <Slab
          x={24 * s}
          y={146 * s}
          w={20 * s}
          h={48 * s}
          color={P.brown}
          r={5 * s}
        />
        <Slab
          x={52 * s}
          y={146 * s}
          w={20 * s}
          h={48 * s}
          color={P.brown}
          r={5 * s}
        />

        {/* Badan / Torso */}
        <Slab
          x={16 * s}
          y={64 * s + shoulderDrop}
          w={64 * s}
          h={86 * s - shoulderDrop * 0.6}
          color={shirt}
          shade={P.brownLo}
          shadeH={0.14}
          r={`${14 * s}px ${14 * s}px ${8 * s}px ${8 * s}px`}
          rot={slump * -3}
        >
          {/* Jas bata pemberi kerja: kerah V kertas */}
          {role === 'employer' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 24 * s,
                  height: 38 * s,
                  translate: '-50% 0',
                  background: P.creamMid,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 10 * s,
                  width: 8 * s,
                  height: 36 * s,
                  translate: '-50% 0',
                  background: P.brown,
                  borderRadius: 2 * s,
                }}
              />
            </>
          ) : null}

          {/* Celemek pedagang warung */}
          {role === 'vendor' ? (
            <div
              style={{
                position: 'absolute',
                left: 8 * s,
                top: 14 * s,
                width: 48 * s,
                height: 66 * s,
                background: P.cream,
                borderRadius: `${4 * s}px ${4 * s}px ${8 * s}px ${8 * s}px`,
                border: `${2 * s}px solid ${P.kraftLo}`,
              }}
            />
          ) : null}

          {/* Sabuk kerja pekerja pabrik */}
          {role === 'worker' ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 14 * s,
                height: 10 * s,
                background: P.brown,
              }}
            />
          ) : null}
        </Slab>

        {/* Lengan yang bereaksi terhadap postur */}
        <Slab
          x={(role === 'worker' ? 2 - reachAmt * 18 : 4) * s}
          y={(72 + reachAmt * 8) * s + shoulderDrop}
          w={18 * s}
          h={56 * s}
          color={shirt}
          r={8 * s}
          rot={role === 'worker' ? 28 * reachAmt - slump * 12 : 12 + reachAmt * 25}
        />
        <Slab
          x={74 * s}
          y={72 * s + shoulderDrop}
          w={18 * s}
          h={56 * s}
          color={shirt}
          r={8 * s}
          rot={-10 + slump * 8}
        />

        {/* Kepala polos TANPA WAJAH (tanpa mata/hidung/mulut/alis/telinga) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 6 * s + headDrop,
            width: 52 * s,
            height: 52 * s,
            translate: '-50% 0',
            rotate: `${headTilt}deg`,
          }}
        >
          <Disc
            x={26 * s}
            y={26 * s}
            d={52 * s}
            color={P.creamMid}
            shade={P.creamDark}
            style={{border: `${3 * s}px solid ${P.ink}`}}
          />
          {/* Helm kuning pekerja pabrik */}
          {role === 'worker' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: -4 * s,
                  top: -10 * s,
                  width: 60 * s,
                  height: 30 * s,
                  background: P.mustardHi,
                  borderRadius: `${30 * s}px ${30 * s}px ${4 * s}px ${4 * s}px`,
                  border: `${3 * s}px solid ${P.brown}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -10 * s,
                  top: 14 * s,
                  width: 72 * s,
                  height: 8 * s,
                  background: P.mustard,
                  borderRadius: 4 * s,
                  border: `${2 * s}px solid ${P.brown}`,
                }}
              />
            </>
          ) : null}
        </div>
      </Paper>
    </div>
  );
};

// Koin mustard berlapis-lapis yang kehilangan lapisan di tiap pos
const LayeredCoin: React.FC<{
  x: number;
  y: number;
  rot: number;
  layers: number; // 4 sampai 1
}> = ({x, y, rot, layers}) => {
  const thickness = 4 + layers * 5;
  const radius = 19 + layers * 6.5;
  const d = radius * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: d + thickness,
        height: d + 8,
        translate: '-50% -50%',
      }}
    >
      <Paper lift={5}>
        {/* Sisi tebal koin berlapis */}
        {Array.from({length: layers}).map((_, idx) => {
          const rLayer = 19 + (layers - idx) * 6.5;
          const dLayer = rLayer * 2;
          const offsetLeft = (d - dLayer) / 2 + (layers - idx) * 3.5;
          const offsetTop = (d - dLayer) / 2 + 4;
          return (
            <div
              key={`rim-${idx}`}
              style={{
                position: 'absolute',
                left: offsetLeft,
                top: offsetTop,
                width: dLayer,
                height: dLayer,
                borderRadius: '50%',
                background: idx % 2 === 0 ? P.mustardLo : P.kraftLo,
                border: `2px solid ${P.brown}`,
              }}
            />
          );
        })}

        {/* Permukaan koin berlapis konsentris */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            width: d,
            height: d,
            rotate: `${rot}deg`,
          }}
        >
          {[4, 3, 2, 1].map((lv) => {
            if (lv > layers) return null;
            const rLv = 19 + lv * 6.5;
            const dLv = rLv * 2;
            const off = (d - dLv) / 2;
            const bg =
              lv === 4
                ? P.mustardHi
                : lv === 3
                  ? P.mustard
                  : lv === 2
                    ? P.mustardHi
                    : P.mustard;
            return (
              <div
                key={`face-${lv}`}
                style={{
                  position: 'absolute',
                  left: off,
                  top: off,
                  width: dLv,
                  height: dLv,
                  borderRadius: '50%',
                  background: bg,
                  border: `2.5px dashed ${P.brown}`,
                  boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.35)',
                }}
              />
            );
          })}
          {/* Tanda pahatan garis koin tanpa angka */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 12,
              height: 18,
              translate: '-50% -50%',
              borderRadius: 3,
              border: `2px solid ${P.brown}`,
              background: P.mustardLo,
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

// Serpihan kulit koin yang terkelupas di pos lalu ditiup angin kembali ke rak harga
const CoinFlake: React.FC<{
  dropAt: number;
  startX: number;
  startY: number;
  restX: number;
  restY: number;
  gatherAt: number;
  targetX: number;
  targetY: number;
  size: number;
}> = ({dropAt, startX, startY, restX, restY, gatherAt, targetX, targetY, size}) => {
  const f = useCurrentFrame();
  if (f < dropAt) return null;

  const dropU = interpolate(f, [dropAt, dropAt + 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const gatherU = interpolate(f, [gatherAt, gatherAt + 64], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Posisi jatuh ke lantai pos
  const dropX = interpolate(dropU, [0, 1], [startX, restX], CLAMP);
  const dropY =
    interpolate(dropU, [0, 1], [startY, restY], CLAMP) -
    Math.sin(dropU * Math.PI) * 26;

  // Saat beat g, angin kertas mengangkat serpihan melengkung tinggi ke rak harga barang
  const arcLift = Math.sin(gatherU * Math.PI) * -175;
  const x = interpolate(gatherU, [0, 1], [dropX, targetX], CLAMP);
  const y = interpolate(gatherU, [0, 1], [dropY, targetY], CLAMP) + arcLift;
  const rot = dropU * 140 + gatherU * 320;
  const scale = interpolate(gatherU, [0, 0.85, 1], [1, 1.05, 0.55], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size * 0.62,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        scale: String(scale),
      }}
    >
      <Paper lift={3}>
        {/* Cincin sabit lapisan koin mustard yang terkelupas */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `7px solid ${P.mustardHi}`,
            borderBottomColor: P.mustardLo,
            boxShadow: `0 0 0 2px ${P.brown}`,
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
          }}
        />
      </Paper>
    </div>
  );
};

export const MGH: React.FC = () => {
  const f = useCurrentFrame();

  // Peralihan panggung: tirai terakota terangkat di awal (0-20) dan turun sedikit di akhir (654-673)
  const curtainOpen = interpolate(f, [0, 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const curtainClose = interpolate(f, [654, MGH_DUR], [0, 0.22], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const curtainTopY = interpolate(curtainOpen - curtainClose, [0, 1], [0, -95], CLAMP);

  // Perjalanan koin di sepanjang lintasan berliku
  // Beat a [0-118]: menggelinding dari pabrik (165, 310) -> mendekati warung (320, 425)
  // Beat b [141-199]: merayap pelan ke (348, 438) saat beban biaya naik ke rak
  // Beat c [223-259]: melewati pos warung (395, 452) -> (515, 405)
  // Beat d [272-298]: melewati pos ongkos (635, 368) -> (750, 412)
  // Beat e [313-355]: melewati pos kebutuhan (865, 456) -> (955, 442)
  // Beat f [373-526]: tiba di tangan pekerja berhelm kuning (1048, 422)
  const coinX = interpolate(
    f,
    [0, 18, 118, 199, 240, 259, 284, 298, 332, 355, 412],
    [155, 168, 320, 348, 398, 515, 635, 750, 865, 955, 1046],
    CLAMP
  );
  const coinY = interpolate(
    f,
    [0, 18, 118, 199, 240, 259, 284, 298, 332, 355, 412],
    [306, 312, 426, 438, 452, 404, 368, 412, 456, 442, 422],
    CLAMP
  );
  const coinRot = interpolate(
    f,
    [0, 118, 199, 259, 298, 355, 412],
    [0, 340, 390, 620, 860, 1120, 1340],
    CLAMP
  );

  // Jumlah lapisan koin berkurang 1 di setiap pos
  const coinLayers = f < 240 ? 4 : f < 284 ? 3 : f < 332 ? 2 : 1;

  // Beat a & b: Karung beban biaya bergeser ke samping di pabrik (35-115) lalu terdorong naik ke rak harga (141-192)
  const sackSlideSide = interpolate(f, [28, 108], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const sackToShelf = interpolate(f, [141, 192], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const sackX =
    interpolate(sackSlideSide, [0, 1], [118, 224], CLAMP) +
    interpolate(sackToShelf, [0, 1], [0, 212], CLAMP);
  const sackY =
    interpolate(sackSlideSide, [0, 1], [312, 276], CLAMP) +
    interpolate(sackToShelf, [0, 1], [0, -138], CLAMP) -
    Math.sin(sackToShelf * Math.PI) * 28;

  // Beat f [373-526]: Pekerja menerima koin tipis, keranjang bayangan vs asli, bahu turun
  const workerReach = interpolate(f, [373, 410], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const workerSlump = interpolate(f, [425, 478], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const ghostBasketOpacity = interpolate(f, [388, 420], [0, 0.88], CLAMP);

  // Beat g [545-673]: Angin kertas mengumpulkan serpihan kembali ke rak harga, benang lingkaran tertutup
  const loopProgress = interpolate(f, [545, 625], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{backgroundColor: P.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <CameraPush dur={MGH_DUR} to={1.05} origin="52% 48%">
          <SnapZoom at={376} x={1060} y={410} to={1.06} settle={1.02} shake={4} roll={0.4} blur={true}>
            {/* Latar Panggung Kertas Hangat */}
            <Slab x={0} y={0} w={1280} h={720} color={P.cream} r={0} grain={0.55} />
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 42%, rgba(255,248,235,0.18) 0%, rgba(0,0,0,0) 52%, rgba(74,48,32,0.26) 100%)',
              }}
            />

            {/* Layar latar kertas berlipat halus di kejauhan */}
            <Slab x={48} y={36} w={1184} h={560} color={P.creamMid} r={6} grain={0.45}>
              <div
                style={{
                  position: 'absolute',
                  inset: 14,
                  border: `2px dashed ${P.creamDark}`,
                  borderRadius: 4,
                  opacity: 0.55,
                }}
              />
            </Slab>

            {/* ELEMEN TETAP 1: PAPAN LANTAI KRAFT = upah minimum (tebal, tepi atas berjahit garis putus-putus) */}
            <Paper lift={5}>
              <Slab
                x={0}
                y={604}
                w={1280}
                h={116}
                color={P.kraft}
                shade={P.kraftLo}
                shadeH={0.28}
                hi={P.kraftHi}
                hiH={0.12}
                r={0}
                grain={0.65}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 10,
                    borderTop: `4px dashed ${P.brown}`,
                    opacity: 0.85,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 56,
                    height: 3,
                    background: P.brownLo,
                    opacity: 0.45,
                  }}
                />
              </Slab>
            </Paper>

            {/* LINTASAN KERTAS BERLIKU SEPERTI SUNGAI + CABANG KE RAK HARGA */}
            <Boil seed="tracks" amp={0.4} rot={0.05}>
              <svg
                width={1280}
                height={720}
                viewBox="0 0 1280 720"
                style={{
                  position: 'absolute',
                  inset: 0,
                  filter: 'url(#rough) drop-shadow(3px 6px 8px rgba(54,34,26,0.28))',
                }}
              >
                {/* Cabang lintasan melengkung ke atas menuju Rak Harga Barang */}
                <path
                  d="M 175 292 C 235 268, 285 158, 435 148"
                  stroke={P.kraftLo}
                  strokeWidth={34}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 175 292 C 235 268, 285 158, 435 148"
                  stroke={P.kraftHi}
                  strokeWidth={26}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Sungai lintasan utama dari pabrik melewati 3 pos ke pekerja */}
                <path
                  d="M 145 310 C 245 318, 305 452, 398 452 C 495 452, 540 368, 635 368 C 730 368, 775 456, 865 456 C 945 456, 990 426, 1055 426"
                  stroke={P.kraftLo}
                  strokeWidth={54}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 145 310 C 245 318, 305 452, 398 452 C 495 452, 540 368, 635 368 C 730 368, 775 456, 865 456 C 945 456, 990 426, 1055 426"
                  stroke={P.creamDark}
                  strokeWidth={44}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* ELEMEN TETAP 2: BENANG MUSTARD BERTITIK sepanjang lintasan & cabang harga */}
                <path
                  d="M 145 310 C 245 318, 305 452, 398 452 C 495 452, 540 368, 635 368 C 730 368, 775 456, 865 456 C 945 456, 990 426, 1055 426"
                  stroke={P.mustardLo}
                  strokeWidth={4}
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 175 292 C 235 268, 285 158, 435 148"
                  stroke={P.mustard}
                  strokeWidth={4}
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  fill="none"
                  opacity={interpolate(f, [141, 175], [0.25, 1], CLAMP)}
                />

                {/* Lingkaran tertutup benang mustard bertitik pada Beat g (545-673) */}
                {loopProgress > 0 ? (
                  <path
                    d="M 885 430 C 920 220, 680 96, 465 132"
                    stroke={P.terra}
                    strokeWidth={5}
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                    fill="none"
                    opacity={loopProgress}
                  />
                ) : null}
              </svg>
            </Boil>

            {/* ==================== HULU: PABRIK & PEMBERI KERJA (Beat a) ==================== */}
            <Boil seed="factory" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 56, top: 148}}>
                <Paper lift={6}>
                  {/* Cerobong pabrik */}
                  <Slab x={18} y={-44} w={26} h={56} color={P.brown} shade={P.brownLo} r={3} />
                  <Slab x={56} y={-32} w={24} h={44} color={P.terraLo} shade={P.brown} r={3} />
                  {/* Kepulan asap kertas kecil */}
                  <Disc x={31} y={-58} d={22} color={P.creamDark} />
                  <Disc x={44} y={-74} d={16} color={P.creamDark} />

                  {/* Atap gerigi pabrik (sawtooth roof) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: -18,
                      width: 156,
                      height: 24,
                      background: P.terra,
                      clipPath:
                        'polygon(0% 100%, 0% 0%, 33% 100%, 33% 0%, 66% 100%, 66% 0%, 100% 100%)',
                    }}
                  />
                  {/* Bangunan pabrik */}
                  <Slab
                    x={0}
                    y={4}
                    w={156}
                    h={168}
                    color={P.kraftHi}
                    shade={P.kraftLo}
                    shadeH={0.16}
                    r={6}
                  >
                    {/* Jendela kisi polos */}
                    {[20, 62, 104].map((wx) => (
                      <div
                        key={wx}
                        style={{
                          position: 'absolute',
                          left: wx,
                          top: 28,
                          width: 30,
                          height: 36,
                          background: P.cream,
                          border: `3px solid ${P.brown}`,
                          borderRadius: 3,
                        }}
                      />
                    ))}
                    {/* Pintu lengkung keluaran koin */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 88,
                        bottom: 0,
                        width: 48,
                        height: 64,
                        background: P.brownLo,
                        borderRadius: '24px 24px 0 0',
                        border: `3px solid ${P.brown}`,
                      }}
                    />
                  </Slab>
                </Paper>

                {/* Pemberi kerja berjas bata di dekat pabrik menggeser beban */}
                <FacelessRoleFigure
                  x={28}
                  y={218}
                  s={0.68}
                  role="employer"
                  reachAmt={sackSlideSide}
                />
              </div>
            </Boil>

            {/* ==================== RAK KERTAS HARGA BARANG (Beat b & g) ==================== */}
            <Boil seed="shelf-goods" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 392, top: 82}}>
                <Paper lift={5}>
                  {/* Bingkai rak kertas */}
                  <Slab
                    x={0}
                    y={0}
                    w={210}
                    h={118}
                    color={P.kraft}
                    shade={P.kraftLo}
                    shadeH={0.15}
                    r={6}
                  />
                  <Slab x={10} y={10} w={190} h={46} color={P.creamMid} r={3} />
                  <Slab x={10} y={62} w={190} h={46} color={P.creamMid} r={3} />

                  {/* Barang-barang kertas di dalam rak */}
                  <Slab x={22} y={20} w={28} h={34} color={P.sage} shade={P.sageLo} r={3} />
                  <Slab x={58} y={16} w={34} h={38} color={P.terra} shade={P.terraLo} r={4} />
                  <Slab x={100} y={22} w={30} h={32} color={P.mustard} shade={P.mustardLo} r={3} />
                  <Slab x={138} y={18} w={26} h={36} color={P.kraftLo} r={3} />

                  <Slab x={26} y={72} w={36} h={34} color={P.mustardHi} shade={P.mustardLo} r={4} />
                  <Slab x={70} y={68} w={30} h={38} color={P.sage} shade={P.sageLo} r={3} />
                  <Slab x={108} y={74} w={40} h={32} color={P.terraLo} r={4} />
                </Paper>
              </div>
            </Boil>

            {/* Karung beban biaya yang bergeser di pabrik (Beat a) lalu masuk ke rak (Beat b) */}
            <Boil seed="cost-sack" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: sackX,
                  top: sackY,
                  translate: '-50% -50%',
                  rotate: `${sackSlideSide * 10 - sackToShelf * 14}deg`,
                }}
              >
                <Paper lift={5}>
                  {/* Leher ikatan karung */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: -12,
                      width: 26,
                      height: 16,
                      translate: '-50% 0',
                      background: P.kraftHi,
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  {/* Badan karung beban */}
                  <Slab
                    x={-28}
                    y={0}
                    w={56}
                    h={62}
                    color={P.kraftHi}
                    shade={P.kraftLo}
                    shadeH={0.24}
                    r="18px 18px 22px 22px"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 6,
                        right: 6,
                        top: 6,
                        height: 6,
                        background: P.terra,
                        borderRadius: 3,
                      }}
                    />
                    {/* Jahitan silang abstrak pada karung */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 16,
                        top: 26,
                        width: 24,
                        height: 5,
                        background: P.brown,
                        borderRadius: 2,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 20,
                        top: 36,
                        width: 16,
                        height: 5,
                        background: P.brown,
                        borderRadius: 2,
                      }}
                    />
                  </Slab>
                </Paper>
              </div>
            </Boil>

            {/* Label Beat b: "harga barang" menempel di rak */}
            <PaperLabel
              x={500}
              y={222}
              text="harga barang"
              at={146}
              bg={P.mustardHi}
              color={P.brownLo}
              size={25}
              rot={-2}
              seed="lbl-harga-barang"
            />

            {/* ==================== POS 1: WARUNG NASI (Beat c [223-259]) ==================== */}
            <Boil seed="pos-warung" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 315, top: 448}}>
                {/* Pedagang warung bercelemek */}
                <FacelessRoleFigure
                  x={42}
                  y={138}
                  s={0.68}
                  role="vendor"
                  reachAmt={interpolate(f, [223, 245], [0, 1], CLAMP)}
                />

                <Paper lift={5}>
                  {/* Meja warung kertas */}
                  <Slab
                    x={64}
                    y={44}
                    w={124}
                    h={74}
                    color={P.kraft}
                    shade={P.kraftLo}
                    shadeH={0.22}
                    r={5}
                  />
                  <Slab x={58} y={36} w={136} h={14} color={P.brown} r={4} />
                  {/* Atap tenda terakota-krem warung */}
                  <Slab
                    x={56}
                    y={-42}
                    w={140}
                    h={24}
                    color={P.terra}
                    shade={P.terraLo}
                    shadeH={0.25}
                    r="6px 6px 2px 2px"
                  />
                  {/* Tiang sangga warung */}
                  <Slab x={66} y={-18} w={8} h={56} color={P.brown} r={2} />
                  <Slab x={176} y={-18} w={8} h={56} color={P.brown} r={2} />

                  {/* Mangkuk nasi kertas */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 102,
                      top: 4,
                      width: 52,
                      height: 34,
                    }}
                  >
                    {/* Gundukan nasi putih-krem */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 6,
                        top: 0,
                        width: 40,
                        height: 22,
                        background: P.cream,
                        borderRadius: '22px 22px 4px 4px',
                        border: `2px solid ${P.kraftLo}`,
                      }}
                    />
                    {/* Mangkuk terakota */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 14,
                        width: 52,
                        height: 20,
                        background: P.terra,
                        borderRadius: '4px 4px 24px 24px',
                        border: `2px solid ${P.brown}`,
                      }}
                    />
                  </div>
                </Paper>

                {/* Label harga fisik membalik naik di mangkuk warung */}
                <FlipPriceTag x={162} y={34} at={225} color={P.terra} />
              </div>
            </Boil>

            {/* Label teks Beat c: "Nasi di warung naik" */}
            <PaperLabel
              x={415}
              y={566}
              text="Nasi di warung naik"
              at={226}
              bg={P.creamMid}
              color={P.brownLo}
              size={22}
              rot={-1.5}
              seed="lbl-warung"
            />

            {/* ==================== POS 2: ONGKOS ANGKUTAN (Beat d [272-298]) ==================== */}
            <Boil seed="pos-ongkos" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 565, top: 236}}>
                <Paper lift={5}>
                  {/* Siluet angkutan umum kertas sederhana */}
                  <Slab
                    x={0}
                    y={24}
                    w={138}
                    h={74}
                    color={P.sage}
                    shade={P.sageLo}
                    shadeH={0.22}
                    r="16px 22px 8px 8px"
                  >
                    {/* Jendela angkutan */}
                    <Slab x={14} y={12} w={34} h={24} color={P.cream} r={4} />
                    <Slab x={56} y={12} w={34} h={24} color={P.cream} r={4} />
                    <Slab x={98} y={12} w={28} h={24} color={P.cream} r="4px 10px 4px 4px" />
                    {/* Pita sabuk bodi */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 44,
                        height: 8,
                        background: P.mustardHi,
                      }}
                    />
                  </Slab>
                  {/* Roda kertas */}
                  <Disc x={34} y={98} d={28} color={P.brown} shade={P.brownLo} />
                  <Disc x={104} y={98} d={28} color={P.brown} shade={P.brownLo} />

                  {/* Tiket kertas berlubang di samping angkutan */}
                  <Slab
                    x={118}
                    y={42}
                    w={54}
                    h={34}
                    color={P.mustardHi}
                    shade={P.mustardLo}
                    r={4}
                    rot={8}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: 10,
                        width: 32,
                        height: 4,
                        background: P.brown,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: 18,
                        width: 22,
                        height: 4,
                        background: P.brown,
                      }}
                    />
                  </Slab>
                </Paper>

                {/* Label harga tiket membalik naik */}
                <FlipPriceTag x={152} y={40} at={274} color={P.terra} />
              </div>
            </Boil>

            {/* Label teks Beat d: "Ongkos naik" */}
            <PaperLabel
              x={648}
              y={192}
              text="Ongkos naik"
              at={274}
              bg={P.creamMid}
              color={P.brownLo}
              size={22}
              rot={1.8}
              seed="lbl-ongkos"
            />

            {/* ==================== POS 3: KEBUTUHAN SEHARI-HARI (Beat e [313-355]) ==================== */}
            <Boil seed="pos-kebutuhan" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 795, top: 444}}>
                <Paper lift={5}>
                  {/* Karung kebutuhan pokok */}
                  <Slab
                    x={12}
                    y={24}
                    w={68}
                    h={84}
                    color={P.kraftHi}
                    shade={P.kraftLo}
                    shadeH={0.24}
                    r="20px 20px 14px 14px"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 14,
                        right: 14,
                        top: 24,
                        height: 6,
                        background: P.sageLo,
                        borderRadius: 3,
                      }}
                    />
                  </Slab>

                  {/* Keranjang kebutuhan sehari-hari + botol minyak/bahan pokok */}
                  <Slab x={92} y={14} w={24} h={42} color={P.mustard} shade={P.mustardLo} r={6} />
                  <Slab x={120} y={20} w={26} h={36} color={P.sage} shade={P.sageLo} r={4} />
                  <Slab
                    x={80}
                    y={46}
                    w={82}
                    h={62}
                    color={P.kraft}
                    shade={P.brown}
                    shadeH={0.22}
                    r="6px 6px 16px 16px"
                  >
                    {/* Anyaman keranjang */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        right: 10,
                        top: 16,
                        height: 4,
                        background: P.brownLo,
                        opacity: 0.55,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        right: 10,
                        top: 32,
                        height: 4,
                        background: P.brownLo,
                        opacity: 0.55,
                      }}
                    />
                  </Slab>
                </Paper>

                {/* Label harga kebutuhan membalik naik */}
                <FlipPriceTag x={136} y={38} at={315} color={P.terra} />
              </div>
            </Boil>

            {/* Label teks Beat e: "Kebutuhan sehari-hari naik" */}
            <PaperLabel
              x={840}
              y={576}
              text="Kebutuhan sehari-hari naik"
              at={316}
              bg={P.creamMid}
              color={P.brownLo}
              size={22}
              rot={1.2}
              seed="lbl-kebutuhan"
            />

            {/* ==================== SERPIHAN KULIT KOIN & ANGIN KERTAS (Beat c, d, e -> Beat g) ==================== */}
            <CoinFlake
              dropAt={238}
              startX={398}
              startY={448}
              restX={375}
              restY={492}
              gatherAt={548}
              targetX={455}
              targetY={140}
              size={64}
            />
            <CoinFlake
              dropAt={284}
              startX={635}
              startY={365}
              restX={658}
              restY={412}
              gatherAt={556}
              targetX={495}
              targetY={146}
              size={54}
            />
            <CoinFlake
              dropAt={332}
              startX={865}
              startY={452}
              restX={832}
              restY={496}
              gatherAt={564}
              targetX={535}
              targetY={138}
              size={44}
            />

            {/* Pusaran angin kertas kecil saat Beat g [545-673] */}
            {f >= 545 ? (
              <Boil seed="paper-wind" amp={0.4} rot={0.05}>
                <svg
                  width={1280}
                  height={720}
                  viewBox="0 0 1280 720"
                  style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                >
                  {[
                    'M 845 470 C 890 265, 675 135, 485 145',
                    'M 650 395 C 670 230, 580 155, 470 150',
                    'M 380 475 C 345 320, 395 215, 445 155',
                  ].map((dPath, i) => (
                    <path
                      key={i}
                      d={dPath}
                      stroke={P.creamMid}
                      strokeWidth={6}
                      strokeDasharray="18 14"
                      strokeLinecap="round"
                      fill="none"
                      opacity={interpolate(f, [545 + i * 6, 580, 645], [0, 0.85, 0.35], CLAMP)}
                    />
                  ))}
                </svg>
              </Boil>
            ) : null}

            {/* ==================== KOIN MUSTARD BERLAPIS YANG MENGGELINDING ==================== */}
            <Boil seed="rolling-coin" amp={0.4} rot={0.05}>
              <LayeredCoin x={coinX} y={coinY} rot={coinRot} layers={coinLayers} />
            </Boil>

            {/* ==================== HILIR: PEKERJA BERHELM KUNING & KERANJANG (Beat f [373-526]) ==================== */}
            <Boil seed="worker-station" amp={0.4} rot={0.05}>
              {/* Pekerja berhelm kuning menerima koin tipis, bahu turun */}
              <FacelessRoleFigure
                x={1098}
                y={496}
                s={0.92}
                role="worker"
                reachAmt={workerReach}
                slump={workerSlump}
              />

              {/* Garis hantu bertitik memperlihatkan keranjang penuh yang dibayangkan */}
              <div
                style={{
                  position: 'absolute',
                  left: 1152,
                  top: 344,
                  width: 106,
                  height: 146,
                  opacity: ghostBasketOpacity,
                }}
              >
                {/* Tumpukan barang bayangan (garis hantu bertitik) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: 0,
                    width: 36,
                    height: 58,
                    border: `3px dashed ${P.mustardLo}`,
                    borderRadius: 6,
                    background: 'rgba(232,189,99,0.16)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 42,
                    top: -12,
                    width: 34,
                    height: 70,
                    border: `3px dashed ${P.mustardLo}`,
                    borderRadius: 6,
                    background: 'rgba(232,189,99,0.16)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 70,
                    top: 8,
                    width: 28,
                    height: 50,
                    border: `3px dashed ${P.mustardLo}`,
                    borderRadius: 6,
                    background: 'rgba(232,189,99,0.16)',
                  }}
                />
                {/* Garis hantu keranjang penuh */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 52,
                    width: 106,
                    height: 78,
                    border: `3.5px dashed ${P.brown}`,
                    borderRadius: '6px 6px 18px 18px',
                  }}
                />
              </div>

              {/* Keranjang asli yang jauh lebih kosong di sisi bawah garis hantu */}
              <div style={{position: 'absolute', left: 1152, top: 396}}>
                <Paper lift={5}>
                  {/* Hanya satu bungkusan kecil di dasar keranjang */}
                  <Slab
                    x={22}
                    y={-6}
                    w={26}
                    h={22}
                    color={P.kraftHi}
                    shade={P.kraftLo}
                    r={4}
                    rot={-8}
                  />
                  <Slab
                    x={4}
                    y={8}
                    w={98}
                    h={68}
                    color={P.kraft}
                    shade={P.kraftLo}
                    shadeH={0.25}
                    r="4px 4px 16px 16px"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        right: 12,
                        top: 20,
                        height: 4,
                        background: P.brownLo,
                        opacity: 0.45,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        right: 12,
                        top: 40,
                        height: 4,
                        background: P.brownLo,
                        opacity: 0.45,
                      }}
                    />
                  </Slab>
                </Paper>
              </div>
            </Boil>

            {/* Label teks Beat f: "membeli lebih sedikit" */}
            <PaperLabel
              x={1084}
              y={264}
              text="membeli lebih sedikit"
              at={392}
              bg={P.terra}
              color={P.cream}
              size={25}
              rot={-2}
              seed="lbl-lebih-sedikit"
            />

            {/* Label teks Beat g: "menggerus" pada lingkaran tertutup */}
            <PaperLabel
              x={748}
              y={108}
              text="menggerus"
              at={554}
              bg={P.terra}
              color={P.cream}
              size={30}
              rot={-2.5}
              seed="lbl-menggerus"
            />

            {/* BINGKAI TIRAI TEATER KERTAS TERAKOTA ("PANGGUNG LANTAI") */}
            <Paper lift={7}>
              {/* Sayap tirai kiri & kanan */}
              <Slab
                x={-16}
                y={-10}
                w={52}
                h={740}
                color={P.terraLo}
                shade={P.brown}
                shadeH={0.12}
                r="0 12px 12px 0"
              />
              <Slab
                x={1244}
                y={-10}
                w={52}
                h={740}
                color={P.terraLo}
                shade={P.brown}
                shadeH={0.12}
                r="12px 0 0 12px"
              />
              {/* Tirai atas terakota yang terangkat saat panggung mulai */}
              <Slab
                x={0}
                y={curtainTopY}
                w={1280}
                h={118}
                color={P.terra}
                shade={P.terraLo}
                shadeH={0.28}
                r="0 0 18px 18px"
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 10,
                    borderBottom: `3px dashed ${P.mustardHi}`,
                    opacity: 0.75,
                  }}
                />
              </Slab>
            </Paper>
          </SnapZoom>
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
