// Adegan MG-I: Timbangan manfaat dan biaya kenaikan upah di atas panggung lantai kertas.
// Manfaat terkonsentrasi di piring kiri yang sempit, sedangkan biaya tersebar ke nampan kanan yang melebar hingga ke yang paling tidak punya.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, CameraPush, Disc, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {SnapZoom} from '../../lib/paper/camera';
import {FilmWeave} from '../../lib/paper/look';

export const MGI_DUR = 695;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR_Y = 592;

// Palet hangat kertas sesuai aturan "Panggung Lantai" (tanpa biru dingin, hitam pekat, atau neon)
const P = {
  cream: C.creamHi,
  creamMid: C.cream,
  creamLo: C.creamLo,
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

// Label kertas: satu-satunya cara teks muncul di layar
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  outAt?: number;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed: string;
}> = ({x, y, text, at, outAt, bg = P.creamMid, color = P.brownLo, size = 25, rot = -1.2, seed}) => {
  const f = useCurrentFrame();
  const fadeOut = outAt !== undefined ? interpolate(f, [outAt, outAt + 10], [1, 0], CLAMP) : 1;
  if (fadeOut <= 0.01) return null;
  return (
    <PopIn at={at} seed={seed} style={{opacity: fadeOut}}>
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
              top: -9,
              left: '50%',
              translate: '-50% 0',
              width: 48,
              height: 15,
              background: C.tape,
              opacity: 0.85,
              rotate: '1.5deg',
            }}
          />
        </div>
      </Boil>
    </PopIn>
  );
};

// Serpihan label harga mungil (tanpa angka/huruf, hanya lubang tali dan garis kertas)
const MiniPriceTag: React.FC<{
  x: number;
  y: number;
  rot: number;
  color?: string;
  scale?: number;
  opacity?: number;
}> = ({x, y, rot, color = P.terra, scale = 1, opacity = 1}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 26 * scale,
        height: 16 * scale,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        opacity,
        backgroundColor: color,
        border: `1.5px solid ${P.brownLo}`,
        borderRadius: 3,
        clipPath: 'polygon(0% 25%, 22% 0%, 100% 0%, 100% 100%, 22% 100%, 0% 75%)',
        boxShadow: '1px 2px 3px rgba(54,34,26,0.28)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 4 * scale,
          top: '50%',
          translate: '0 -50%',
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: '50%',
          backgroundColor: P.cream,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 11 * scale,
          right: 4 * scale,
          top: '46%',
          height: 2 * scale,
          backgroundColor: P.cream,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

// Figur kertas faceless (tanpa mata/hidung/mulut/alis/telinga). (x, y) adalah titik kaki di lantai.
const CrowdFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt: string;
  role?: 'helmet' | 'apron' | 'bag' | 'suit' | 'plain';
  hasPayslip?: boolean;
  pocketsOut?: boolean;
  emptyHands?: boolean;
  slump?: number;
  dim?: number;
}> = ({
  x,
  y,
  s = 1,
  shirt,
  role = 'plain',
  hasPayslip = false,
  pocketsOut = false,
  emptyHands = false,
  slump = 0,
  dim = 0,
}) => {
  const headSize = 44 * s;
  const bodyW = 54 * s;
  const bodyH = 74 * s;
  const legW = 20 * s;
  const legH = 40 * s;
  const totalH = 162 * s;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * s,
        height: totalH,
        translate: '-50% -100%',
        filter: dim > 0 ? `brightness(${(1 - dim * 0.58).toFixed(2)})` : undefined,
      }}
    >
      <Paper lift={3}>
        {/* Kaki */}
        <Slab
          x={48 * s - legW - 3 * s}
          y={totalH - legH}
          w={legW}
          h={legH}
          color={P.brown}
          shade={P.brownLo}
          shadeH={0.22}
          r={5 * s}
        />
        <Slab
          x={48 * s + 3 * s}
          y={totalH - legH}
          w={legW}
          h={legH}
          color={P.brown}
          shade={P.brownLo}
          shadeH={0.22}
          r={5 * s}
        />

        {/* Badan */}
        <div
          style={{
            position: 'absolute',
            left: 48 * s - bodyW / 2,
            top: 48 * s + slump * 5 * s,
            width: bodyW,
            height: bodyH,
            rotate: `${slump * 3.5}deg`,
            transformOrigin: '50% 90%',
          }}
        >
          <Slab
            x={0}
            y={0}
            w={bodyW}
            h={bodyH}
            color={shirt}
            shade={P.brownLo}
            shadeH={0.16}
            r={9 * s}
          />

          {/* Atribut peran: celemek pedagang warung */}
          {role === 'apron' ? (
            <Slab
              x={8 * s}
              y={14 * s}
              w={bodyW - 16 * s}
              h={bodyH - 18 * s}
              color={P.creamMid}
              shade={P.creamLo}
              shadeH={0.18}
              r={4 * s}
            />
          ) : null}

          {/* Atribut peran: jas bata pemberi kerja */}
          {role === 'suit' ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                translate: '-50% 0',
                width: 10 * s,
                height: 36 * s,
                background: P.creamMid,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          ) : null}

          {/* Atribut peran: tas kain selempang pekerja harian */}
          {role === 'bag' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 6 * s,
                  top: 2 * s,
                  width: bodyW - 8 * s,
                  height: 7 * s,
                  background: P.kraftLo,
                  rotate: '38deg',
                  transformOrigin: '0 0',
                }}
              />
              <Slab
                x={bodyW - 10 * s}
                y={34 * s}
                w={22 * s}
                h={26 * s}
                color={P.kraftHi}
                shade={P.kraftLo}
                shadeH={0.25}
                r={5 * s}
                rot={6}
              />
            </>
          ) : null}

          {/* Tangan kosong terbuka (untuk pekerja yang kehilangan pekerjaan / paling tidak punya) */}
          {emptyHands ? (
            <>
              <Slab
                x={-18 * s}
                y={18 * s}
                w={20 * s}
                h={11 * s}
                color={P.creamLo}
                r={5 * s}
                rot={-24}
              />
              <Slab
                x={bodyW - 2 * s}
                y={18 * s}
                w={20 * s}
                h={11 * s}
                color={P.creamLo}
                r={5 * s}
                rot={24}
              />
            </>
          ) : null}

          {/* Saku dibalik (kantong kosong mencuat keluar di kiri & kanan pinggang) */}
          {pocketsOut ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: -14 * s,
                  top: bodyH - 26 * s,
                  width: 18 * s,
                  height: 22 * s,
                  backgroundColor: P.creamMid,
                  border: `${2 * s}px dashed ${P.brownLo}`,
                  borderRadius: `${3 * s}px ${3 * s}px ${8 * s}px ${8 * s}px`,
                  rotate: '28deg',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -14 * s,
                  top: bodyH - 26 * s,
                  width: 18 * s,
                  height: 22 * s,
                  backgroundColor: P.creamMid,
                  border: `${2 * s}px dashed ${P.brownLo}`,
                  borderRadius: `${3 * s}px ${3 * s}px ${8 * s}px ${8 * s}px`,
                  rotate: '-28deg',
                }}
              />
            </>
          ) : null}

          {/* Slip gaji kecil di tangan pekerja yang tetap bekerja (tanpa angka, hanya garis) */}
          {hasPayslip ? (
            <div
              style={{
                position: 'absolute',
                right: -16 * s,
                top: 12 * s,
                width: 24 * s,
                height: 32 * s,
                backgroundColor: P.cream,
                border: `${2 * s}px solid ${P.kraftLo}`,
                borderRadius: 3 * s,
                rotate: '-10deg',
                boxShadow: '1px 2px 4px rgba(54,34,26,0.28)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 4 * s,
                  right: 4 * s,
                  top: 6 * s,
                  height: 3 * s,
                  backgroundColor: P.mustard,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 4 * s,
                  right: 6 * s,
                  top: 13 * s,
                  height: 2.5 * s,
                  backgroundColor: P.kraftLo,
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 4 * s,
                  right: 8 * s,
                  top: 20 * s,
                  height: 2.5 * s,
                  backgroundColor: P.kraftLo,
                  opacity: 0.7,
                }}
              />
            </div>
          ) : null}
        </div>

        {/* Kepala faceless (polos tanpa wajah) */}
        <div
          style={{
            position: 'absolute',
            left: 48 * s - headSize / 2 + slump * 3 * s,
            top: slump * 7 * s,
            width: headSize,
            height: headSize,
            borderRadius: '50%',
            backgroundColor: P.creamLo,
            border: `${3 * s}px solid ${P.ink}`,
          }}
        />

        {/* Helm kuning pekerja pabrik */}
        {role === 'helmet' ? (
          <div
            style={{
              position: 'absolute',
              left: 48 * s - headSize * 0.58 + slump * 3 * s,
              top: -6 * s + slump * 7 * s,
              width: headSize * 1.16,
              height: headSize * 0.54,
              backgroundColor: P.mustardHi,
              border: `${2.5 * s}px solid ${P.mustardLo}`,
              borderRadius: `${headSize * 0.6}px ${headSize * 0.6}px ${4 * s}px ${4 * s}px`,
            }}
          />
        ) : null}
      </Paper>
    </div>
  );
};

export const MGI: React.FC = () => {
  const f = useCurrentFrame();

  // Tirai atas terangkat di awal adegan (0–26)
  const curtainTopY = interpolate(f, [0, 26], [0, -86], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // --- BEAT A [0–181]: Timbangan kertas besar naik ke tengah panggung, tumpukan koin mustard di piring kiri ---
  const scaleRise = interpolate(f, [0, 38], [180, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });
  const scaleOpacity = interpolate(f, [0, 16], [0, 1], CLAMP);

  const coinStackAppear = interpolate(f, [20, 62], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // --- BEAT B [122–181]: "meski tidak sebesar angka di slip gaji." ---
  // Waktu kutipan di transcript_words.json: 327.00s - 328.94s -> frame relatif (327.00 - 322.92)*30 = 122 s.d. (328.94 - 322.92)*30 = 181.
  const slipIn = interpolate(f, [122, 145], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const slipFloatY = Math.sin(Math.min(f, MGI_DUR) * 0.08) * 3;
  // Sedikit lapisan atas tumpukan koin mengelupas di jendela [134..176], tumpukan menjadi sedikit lebih rendah dari slip gaji tapi tetap tegak
  const peelProgress = interpolate(f, [134, 176], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // --- BEAT C [200–310]: Sorot kecil menyoroti satu figur di kerumunan (tangan kosong, saku dibalik) ---
  const spotCOpacity =
    interpolate(f, [200, 220], [0, 1], CLAMP) *
    interpolate(f, [462, 484], [1, 0], CLAMP);
  const unemployedSlump = interpolate(f, [200, 236], [0.4, 1], CLAMP);

  // --- BEAT D [310–386]: Serpihan label harga mungil jatuh ke bahu figur itu seperti hujan kertas ---
  const priceRainMaster = interpolate(f, [310, 322], [0, 1], CLAMP);

  // --- BEAT E [404–462]: Jeda. Timbangan berayun sebentar lalu tenang; balok timbangan SEIMBANG (0 derajat, horizontal) ---
  // PERINGATAN KHUSUS: Balok timbangan TIDAK BOLEH miring ke sisi mana pun (rotasi = 0 derajat mutlak).
  // Ayunan hanya berupa getaran redam vertikal simetris pada tali gantung, lalu tenang.
  const settleEnv =
    interpolate(f, [404, 410], [0, 1], CLAMP) *
    interpolate(f, [438, 458], [1, 0], CLAMP);
  const symCordPulse = settleEnv * Math.sin((f - 404) * 0.42) * 4.5;

  // --- BEAT F [482–559]: Sorot sempit hanya menyinari tumpukan di piring kiri dan sekelompok kecil figur berslip gaji ---
  const spotFOpacity =
    interpolate(f, [482, 502], [0, 1], CLAMP) *
    interpolate(f, [554, 574], [1, 0.22], CLAMP);
  const rightCrowdDim =
    interpolate(f, [482, 504], [0, 1], CLAMP) *
    interpolate(f, [558, 578], [1, 0], CLAMP);

  // --- BEAT G [564–695]: Piring kanan melebar menjadi nampan lebar dan dangkal; serpihan biaya jatuh tersebar ---
  const rightTrayExpand = interpolate(f, [564, 602], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightTrayW = interpolate(rightTrayExpand, [0, 1], [128, 410], CLAMP);
  const rightTrayH = interpolate(rightTrayExpand, [0, 1], [48, 22], CLAMP);

  // Koordinat utama timbangan di tengah panggung
  const SCALE_CX = 610;
  const BEAM_Y = 176 + scaleRise;
  const BEAM_HALF = 285;
  const LEFT_PAN_X = SCALE_CX - BEAM_HALF; // 325
  const RIGHT_PAN_X = SCALE_CX + BEAM_HALF; // 895
  const PAN_Y = BEAM_Y + 132 + symCordPulse;

  // 11 koin mustard di piring kiri: 8 koin bawah tetap tegak, 3 koin teratas mengelupas di beat b
  const COIN_COUNT = 11;
  const COIN_H = 11;
  const COIN_W = 82;

  // Daftar figur di kerumunan di bawah timbangan
  // Kelompok kiri (tetap bekerja, memegang slip gaji): sekitar x = 185..395 (di bawah piring kiri)
  // Figur tengah (kehilangan pekerjaan, tangan kosong, saku dibalik): x = 635
  // Kelompok kanan (pedagang, pekerja harian, dan figur paling kecil & sederhana di x = 1120)
  const crowd = [
    {x: 185, s: 0.92, shirt: P.sage, role: 'helmet' as const, hasPayslip: true, pocketsOut: false, emptyHands: false, group: 'left'},
    {x: 295, s: 0.96, shirt: P.mustard, role: 'helmet' as const, hasPayslip: true, pocketsOut: false, emptyHands: false, group: 'left'},
    {x: 405, s: 0.9, shirt: P.sageLo, role: 'suit' as const, hasPayslip: true, pocketsOut: false, emptyHands: false, group: 'left'},
    {x: 525, s: 0.88, shirt: P.kraft, role: 'apron' as const, hasPayslip: false, pocketsOut: false, emptyHands: false, group: 'mid'},
    {x: 645, s: 0.96, shirt: P.terraLo, role: 'plain' as const, hasPayslip: false, pocketsOut: true, emptyHands: true, group: 'unemployed'},
    {x: 780, s: 0.9, shirt: P.kraftLo, role: 'bag' as const, hasPayslip: false, pocketsOut: false, emptyHands: false, group: 'right'},
    {x: 905, s: 0.88, shirt: P.sage, role: 'apron' as const, hasPayslip: false, pocketsOut: false, emptyHands: false, group: 'right'},
    {x: 1020, s: 0.84, shirt: P.kraft, role: 'bag' as const, hasPayslip: false, pocketsOut: false, emptyHands: false, group: 'right'},
    // Figur paling kecil dan paling sederhana dengan saku dibalik
    {x: 1135, s: 0.68, shirt: P.creamLo, role: 'plain' as const, hasPayslip: false, pocketsOut: true, emptyHands: true, group: 'poorest'},
  ];

  // Serpihan label harga yang jatuh ke bahu figur yang kehilangan pekerjaan (x = 645) pada beat d [310–386]
  const shoulderTags = [
    {dx: -26, endY: FLOOR_Y - 122, startF: 312, dur: 28, rot: -18, col: P.terra},
    {dx: 22, endY: FLOOR_Y - 120, startF: 318, dur: 30, rot: 15, col: P.mustard},
    {dx: -14, endY: FLOOR_Y - 114, startF: 325, dur: 28, rot: 8, col: P.terraLo},
    {dx: 28, endY: FLOOR_Y - 112, startF: 332, dur: 30, rot: -12, col: P.terra},
    {dx: -32, endY: FLOOR_Y - 106, startF: 340, dur: 28, rot: 22, col: P.mustardLo},
    {dx: 16, endY: FLOOR_Y - 104, startF: 348, dur: 28, rot: -9, col: P.terra},
  ];

  // Serpihan biaya di beat g [564–695]: terlepas dari setiap figur di kerumunan dan jatuh menyebar ke nampan kanan yang lebar
  const costFlakes = crowd.flatMap((fig, idx) =>
    [0, 1, 2].map((k) => {
      const n = idx * 3 + k;
      // Menyebar merata dari tepi kiri hingga tepi kanan nampan kanan (RIGHT_PAN_X - 185 .. RIGHT_PAN_X + 185)
      const spreadRatio = (n / (crowd.length * 3 - 1)) * 2 - 1;
      const targetX = RIGHT_PAN_X + spreadRatio * 182;
      const targetY = PAN_Y + rightTrayH - 8 - (n % 3) * 4;
      const startF = 568 + idx * 5 + k * 14;
      const dur = 42;
      return {
        id: n,
        fromX: fig.x,
        fromY: FLOOR_Y - 110 * fig.s,
        targetX,
        targetY,
        startF,
        dur,
        rot: (n % 2 === 0 ? 1 : -1) * (10 + (n * 7) % 24),
        color: n % 3 === 0 ? P.terra : n % 3 === 1 ? P.mustard : P.terraLo,
      };
    }),
  );

  return (
    <AbsoluteFill style={{backgroundColor: P.cream}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <CameraPush dur={MGI_DUR} to={1.05} origin="50% 48%">
          <SnapZoom at={404} x={640} y={340} to={1.06} settle={1.03} shake={3} roll={0} blur={false}>
            {/* LATAR PANGGUNG KERTAS HANGAT */}
            <Slab x={0} y={0} w={1280} h={720} color={P.cream} r={0} grain={0.55} />
            <Slab x={36} y={24} w={1208} h={FLOOR_Y - 24} color={P.creamMid} r={8} grain={0.45} />

            {/* Vinyet hangat panggung */}
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 44%, rgba(255,248,232,0.14) 0%, rgba(54,34,26,0) 52%, rgba(54,34,26,0.26) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* ELEMEN TETAP 2: BENANG MUSTARD BERTITIK (harga yang terbentuk di pasar / nilai pekerja) */}
            <div
              style={{
                position: 'absolute',
                left: 64,
                right: 64,
                top: 426,
                height: 6,
                borderTop: `5px dotted ${P.mustardLo}`,
                opacity: 0.65,
              }}
            />
            <Disc x={68} y={428} d={14} color={P.mustard} shade={P.mustardLo} />
            <Disc x={1212} y={428} d={14} color={P.mustard} shade={P.mustardLo} />

            {/* SOROT SEMPIT BEAT F [482–559]: Hanya menyinari tumpukan di piring kiri & kelompok figur berslip gaji */}
            {spotFOpacity > 0.01 ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: 440,
                    top: 0,
                    width: 840,
                    height: FLOOR_Y,
                    background: 'rgba(54, 34, 26, 0.44)',
                    opacity: rightCrowdDim,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: LEFT_PAN_X - 180,
                    top: 0,
                    width: 360,
                    height: FLOOR_Y + 10,
                    background:
                      'linear-gradient(180deg, rgba(232,189,99,0.38) 0%, rgba(232,189,99,0.22) 60%, rgba(232,189,99,0.06) 100%)',
                    clipPath: 'polygon(32% 0%, 68% 0%, 100% 100%, 0% 100%)',
                    opacity: spotFOpacity,
                    pointerEvents: 'none',
                  }}
                />
              </>
            ) : null}

            {/* SOROT KECIL BEAT C & D [200–462]: Menyoroti satu figur yang kehilangan pekerjaan (x = 645) */}
            {spotCOpacity > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 645 - 115,
                  top: 120,
                  width: 230,
                  height: FLOOR_Y - 110,
                  background:
                    'linear-gradient(180deg, rgba(232,189,99,0.34) 0%, rgba(232,189,99,0.18) 75%, rgba(232,189,99,0.04) 100%)',
                  clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
                  opacity: spotCOpacity,
                  pointerEvents: 'none',
                }}
              />
            ) : null}

            {/* TIMBANGAN KERTAS BESAR DI TENGAH PANGGUNG (Balok selalu SEIMBANG / horizontal 0 derajat) */}
            <div style={{position: 'absolute', inset: 0, opacity: scaleOpacity}}>
              <Paper lift={6}>
                {/* Alas tiang timbangan di atas papan lantai */}
                <Slab
                  x={SCALE_CX - 76}
                  y={FLOOR_Y - 28 + scaleRise}
                  w={152}
                  h={28}
                  color={P.kraftLo}
                  shade={P.brown}
                  shadeH={0.28}
                  r="8px 8px 2px 2px"
                />
                <Slab
                  x={SCALE_CX - 52}
                  y={FLOOR_Y - 48 + scaleRise}
                  w={104}
                  h={22}
                  color={P.kraft}
                  shade={P.kraftLo}
                  shadeH={0.24}
                  r="6px 6px 2px 2px"
                />

                {/* Tiang tengah kraft vertikal */}
                <Slab
                  x={SCALE_CX - 15}
                  y={BEAM_Y - 18}
                  w={30}
                  h={FLOOR_Y - BEAM_Y - 24}
                  color={P.kraft}
                  shade={P.kraftLo}
                  shadeH={0.12}
                  hi={P.kraftHi}
                  hiH={0.08}
                  r={6}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 16,
                      bottom: 16,
                      translate: '-50% 0',
                      borderLeft: `3px dashed ${P.kraftLo}`,
                      opacity: 0.65,
                    }}
                  />
                </Slab>

                {/* Balok timbangan horizontal — MUTLAK SEIMBANG (rot = 0, tidak pernah miring) */}
                <Slab
                  x={LEFT_PAN_X - 18}
                  y={BEAM_Y - 11}
                  w={BEAM_HALF * 2 + 36}
                  h={22}
                  color={P.kraftHi}
                  shade={P.kraftLo}
                  shadeH={0.28}
                  r={8}
                  rot={0}
                >
                  {/* Garis jahit horisontal penegas keseimbangan balok */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 18,
                      right: 18,
                      top: '50%',
                      translate: '0 -50%',
                      borderTop: `2.5px dashed ${P.brownLo}`,
                      opacity: 0.55,
                    }}
                  />
                </Slab>

                {/* Poros tengah & jarum tegak lurus penanda seimbang */}
                <Slab
                  x={SCALE_CX - 8}
                  y={BEAM_Y - 44}
                  w={16}
                  h={36}
                  color={P.mustard}
                  shade={P.mustardLo}
                  shadeH={0.22}
                  r={5}
                  rot={0}
                />
                <Disc x={SCALE_CX} y={BEAM_Y} d={38} color={P.mustard} shade={P.mustardLo} />
                <Disc x={SCALE_CX} y={BEAM_Y} d={16} color={P.brownLo} />

                {/* Pin ujung kiri dan kanan balok */}
                <Disc x={LEFT_PAN_X} y={BEAM_Y} d={18} color={P.mustard} shade={P.mustardLo} />
                <Disc x={RIGHT_PAN_X} y={BEAM_Y} d={18} color={P.mustard} shade={P.mustardLo} />
              </Paper>

              {/* PIRING KIRI: Sempit dan dalam, menampung tumpukan padat koin mustard */}
              <div style={{position: 'absolute', inset: 0}}>
                {/* Tali penggantung piring kiri */}
                <svg
                  width={1280}
                  height={720}
                  style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                >
                  <line
                    x1={LEFT_PAN_X}
                    y1={BEAM_Y + 6}
                    x2={LEFT_PAN_X - 44}
                    y2={PAN_Y}
                    stroke={P.brownLo}
                    strokeWidth={3}
                  />
                  <line
                    x1={LEFT_PAN_X}
                    y1={BEAM_Y + 6}
                    x2={LEFT_PAN_X + 44}
                    y2={PAN_Y}
                    stroke={P.brownLo}
                    strokeWidth={3}
                  />
                </svg>

                {/* Tumpukan padat koin mustard di dalam piring kiri */}
                <Boil seed="left-coins" amp={0.4} rot={0.05}>
                  <div style={{position: 'absolute', inset: 0}}>
                    {Array.from({length: COIN_COUNT}).map((_, i) => {
                      const appearU = interpolate(
                        coinStackAppear,
                        [i / (COIN_COUNT + 2), (i + 2.5) / (COIN_COUNT + 2)],
                        [0, 1],
                        CLAMP,
                      );
                      // 3 lapisan teratas mengelupas di beat b [134..176]
                      const isTopPeel = i >= COIN_COUNT - 3;
                      const peelIdx = i - (COIN_COUNT - 3);
                      const localPeel = isTopPeel
                        ? interpolate(
                            peelProgress,
                            [peelIdx * 0.22, peelIdx * 0.22 + 0.56],
                            [0, 1],
                            CLAMP,
                          )
                        : 0;
                      const peelDx = localPeel * (48 + peelIdx * 18);
                      const peelDy = localPeel * (-12 + peelIdx * 22);
                      const peelRot = localPeel * (18 + peelIdx * 10);
                      const peelOp = interpolate(localPeel, [0, 0.75, 1], [1, 0.65, 0], CLAMP);

                      const cy = PAN_Y - (i + 1) * (COIN_H - 1) + (1 - appearU) * 18 + peelDy;
                      const cx = LEFT_PAN_X - COIN_W / 2 + ((i % 2) * 2 - 1) + peelDx;

                      if (appearU * peelOp <= 0.01) return null;

                      return (
                        <Paper key={i} lift={2} style={{opacity: appearU * peelOp}}>
                          <Slab
                            x={cx}
                            y={cy}
                            w={COIN_W}
                            h={COIN_H}
                            color={i % 2 === 0 ? P.mustardHi : P.mustard}
                            shade={P.mustardLo}
                            shadeH={0.32}
                            r={6}
                            rot={peelRot}
                          />
                        </Paper>
                      );
                    })}
                  </div>
                </Boil>

                {/* Wadah piring kiri yang sempit dan dalam */}
                <Paper lift={5}>
                  <Slab
                    x={LEFT_PAN_X - 56}
                    y={PAN_Y}
                    w={112}
                    h={54}
                    color={P.kraft}
                    shade={P.kraftLo}
                    shadeH={0.28}
                    hi={P.kraftHi}
                    hiH={0.12}
                    r="4px 4px 26px 26px"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        right: 12,
                        top: 10,
                        borderTop: `2.5px dashed ${P.brownLo}`,
                        opacity: 0.6,
                      }}
                    />
                  </Slab>
                </Paper>
              </div>

              {/* BEAT B [122–181]: Slip gaji kertas melayang di dekat tumpukan piring kiri */}
              {slipIn > 0.01 ? (
                <Boil seed="payslip-float" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: LEFT_PAN_X - 150,
                      top: PAN_Y - 122 + slipFloatY + (1 - slipIn) * 24,
                      width: 78,
                      height: 122,
                      opacity: slipIn,
                      rotate: '-4deg',
                    }}
                  >
                    <Paper lift={5}>
                      {/* Kertas slip gaji lebih tinggi sedikit dari tumpukan koin yang sudah mengelupas */}
                      <Slab
                        x={0}
                        y={0}
                        w={78}
                        h={122}
                        color={P.cream}
                        shade={P.creamLo}
                        shadeH={0.1}
                        r={5}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 10,
                            right: 10,
                            top: 14,
                            height: 8,
                            backgroundColor: P.mustard,
                            borderRadius: 2,
                          }}
                        />
                        {[32, 46, 60, 74, 88].map((ly, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: 10,
                              width: idx % 2 === 0 ? 54 : 42,
                              top: ly,
                              height: 5,
                              backgroundColor: P.kraftLo,
                              opacity: 0.55,
                              borderRadius: 2,
                            }}
                          />
                        ))}
                        <div
                          style={{
                            position: 'absolute',
                            left: 10,
                            right: 10,
                            bottom: 12,
                            height: 7,
                            backgroundColor: P.terra,
                            opacity: 0.75,
                            borderRadius: 2,
                          }}
                        />
                      </Slab>
                    </Paper>
                    {/* Garis banding halus yang menunjukkan puncak slip gaji sedikit di atas tumpukan koin */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 78,
                        top: 4,
                        width: 66,
                        borderTop: `2.5px dashed ${P.terra}`,
                        opacity: interpolate(f, [146, 168], [0, 0.85], CLAMP),
                      }}
                    />
                  </div>
                </Boil>
              ) : null}

              {/* PIRING KANAN: Di beat g [564–695] melebar menjadi nampan lebar dan dangkal */}
              <div style={{position: 'absolute', inset: 0}}>
                <svg
                  width={1280}
                  height={720}
                  style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
                >
                  <line
                    x1={RIGHT_PAN_X}
                    y1={BEAM_Y + 6}
                    x2={RIGHT_PAN_X - rightTrayW * 0.42}
                    y2={PAN_Y}
                    stroke={P.brownLo}
                    strokeWidth={3}
                  />
                  <line
                    x1={RIGHT_PAN_X}
                    y1={BEAM_Y + 6}
                    x2={RIGHT_PAN_X + rightTrayW * 0.42}
                    y2={PAN_Y}
                    stroke={P.brownLo}
                    strokeWidth={3}
                  />
                </svg>

                {/* Wadah piring kanan yang melebar menjadi nampan lebar dan dangkal di beat g */}
                <Paper lift={5}>
                  <Slab
                    x={RIGHT_PAN_X - rightTrayW / 2}
                    y={PAN_Y}
                    w={rightTrayW}
                    h={rightTrayH}
                    color={P.kraft}
                    shade={P.kraftLo}
                    shadeH={0.28}
                    hi={P.kraftHi}
                    hiH={0.14}
                    r="4px 4px 16px 16px"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 14,
                        right: 14,
                        top: 6,
                        borderTop: `2px dashed ${P.brownLo}`,
                        opacity: 0.55,
                      }}
                    />
                  </Slab>
                </Paper>
              </div>
            </div>

            {/* KERUMUNAN FIGUR FACELESS DI ATAS LANTAI PANGGUNG */}
            <Boil seed="crowd-boil" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', inset: 0}}>
                {crowd.map((fig, idx) => {
                  const isUnemployed = fig.group === 'unemployed';
                  const isLeftGroup = fig.group === 'left';
                  const dimAmt = isLeftGroup ? 0 : rightCrowdDim;
                  const localSlump = isUnemployed
                    ? unemployedSlump
                    : fig.group === 'poorest'
                      ? 0.75
                      : 0;

                  return (
                    <CrowdFigure
                      key={idx}
                      x={fig.x}
                      y={FLOOR_Y}
                      s={fig.s}
                      shirt={fig.shirt}
                      role={fig.role}
                      hasPayslip={fig.hasPayslip}
                      pocketsOut={fig.pocketsOut}
                      emptyHands={fig.emptyHands}
                      slump={localSlump}
                      dim={dimAmt}
                    />
                  );
                })}
              </div>
            </Boil>

            {/* BEAT D [310–386]: Hujan kertas serpihan label harga mungil jatuh ke bahu figur yang kehilangan pekerjaan */}
            {priceRainMaster > 0.01 ? (
              <Boil seed="price-rain" amp={0.4} rot={0.05}>
                <div style={{position: 'absolute', inset: 0, opacity: 1 - rightCrowdDim * 0.65}}>
                  {shoulderTags.map((tag, i) => {
                    const u = interpolate(f, [tag.startF, tag.startF + tag.dur], [0, 1], {
                      ...CLAMP,
                      easing: Easing.out(Easing.quad),
                    });
                    if (u <= 0.01) return null;
                    const curY = interpolate(u, [0, 1], [230, tag.endY], CLAMP);
                    const swayX = Math.sin((1 - u) * Math.PI * 2 + i) * 10 * (1 - u);
                    const curRot = interpolate(u, [0, 1], [tag.rot - 25, tag.rot], CLAMP);
                    return (
                      <MiniPriceTag
                        key={i}
                        x={645 + tag.dx + swayX}
                        y={curY}
                        rot={curRot}
                        color={tag.col}
                        scale={0.95}
                        opacity={interpolate(u, [0, 0.15, 1], [0, 1, 1], CLAMP)}
                      />
                    );
                  })}
                </div>
              </Boil>
            ) : null}

            {/* BEAT G [564–695]: Serpihan biaya terlepas dari setiap figur (termasuk yang paling kecil/sederhana) dan jatuh menyebar ke nampan kanan */}
            {f >= 564 ? (
              <Boil seed="cost-flakes" amp={0.4} rot={0.05}>
                <div style={{position: 'absolute', inset: 0}}>
                  {costFlakes.map((fl) => {
                    const u = interpolate(f, [fl.startF, fl.startF + fl.dur], [0, 1], {
                      ...CLAMP,
                      easing: Easing.inOut(Easing.quad),
                    });
                    if (u <= 0.01) return null;
                    // Melengkung naik dari figur lalu jatuh mendarat sebagai taburan halus di nampan kanan yang lebar
                    const midX = (fl.fromX + fl.targetX) / 2;
                    const peakY = Math.min(fl.fromY, fl.targetY) - 95 - (fl.id % 4) * 16;
                    const oneMinusU = 1 - u;
                    const curX =
                      oneMinusU * oneMinusU * fl.fromX +
                      2 * oneMinusU * u * midX +
                      u * u * fl.targetX;
                    const curY =
                      oneMinusU * oneMinusU * fl.fromY +
                      2 * oneMinusU * u * peakY +
                      u * u * fl.targetY;
                    const curRot = interpolate(u, [0, 1], [-fl.rot, fl.rot], CLAMP);

                    return (
                      <MiniPriceTag
                        key={fl.id}
                        x={curX}
                        y={curY}
                        rot={curRot}
                        color={fl.color}
                        scale={0.78}
                        opacity={interpolate(u, [0, 0.12, 1], [0, 1, 1], CLAMP)}
                      />
                    );
                  })}
                </div>
              </Boil>
            ) : null}

            {/* ELEMEN TETAP 1: PAPAN LANTAI KRAFT (upah minimum — tebal, tepi atas berjahit garis putus-putus) */}
            <Paper lift={5}>
              <Slab
                x={0}
                y={FLOOR_Y}
                w={1280}
                h={720 - FLOOR_Y}
                color={P.brown}
                r={0}
                grain={0.6}
              />
              <Slab
                x={0}
                y={FLOOR_Y - 24}
                w={1280}
                h={34}
                color={P.kraft}
                shade={P.kraftLo}
                shadeH={0.35}
                hi={P.kraftHi}
                hiH={0.15}
                r={0}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    top: 6,
                    borderTop: `4px dashed ${P.brownLo}`,
                    opacity: 0.78,
                  }}
                />
              </Slab>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: FLOOR_Y + 42,
                  height: 3,
                  background: P.brownLo,
                  opacity: 0.75,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: FLOOR_Y + 84,
                  height: 3,
                  background: P.brownLo,
                  opacity: 0.75,
                }}
              />
            </Paper>

            {/* ELEMEN TETAP 3: LABEL KERTAS (HANYA dari daftar "Teks boleh tampil" di BRIEF-MGI.md) */}
            {/* Beat a [0–181]: "daya belinya memang naik" */}
            <PaperLabel
              x={310}
              y={88}
              text="daya belinya memang naik"
              at={24}
              outAt={392}
              bg={P.mustardHi}
              color={P.brownLo}
              size={25}
              rot={-1.5}
              seed="lbl-daya-beli"
            />

            {/* Beat b [122–181]: "slip gaji" */}
            <PaperLabel
              x={168}
              y={374}
              text="slip gaji"
              at={122}
              outAt={470}
              bg={P.creamMid}
              color={P.brownLo}
              size={23}
              rot={-2.2}
              seed="lbl-slip-gaji"
            />

            {/* Beat c [200–310]: "kehilangan pekerjaan" */}
            <PaperLabel
              x={645}
              y={354}
              text="kehilangan pekerjaan"
              at={204}
              outAt={470}
              bg={P.terra}
              color={P.cream}
              size={24}
              rot={1.4}
              seed="lbl-kehilangan-kerja"
            />

            {/* Beat d [310–386]: "harga yang naik" */}
            <PaperLabel
              x={645}
              y={280}
              text="harga yang naik"
              at={314}
              outAt={470}
              bg={P.mustard}
              color={P.brownLo}
              size={24}
              rot={-1.6}
              seed="lbl-harga-naik"
            />

            {/* Beat e [404–462]: "ketidakadilannya" */}
            <PaperLabel
              x={SCALE_CX}
              y={86}
              text="ketidakadilannya"
              at={406}
              outAt={470}
              bg={P.terra}
              color={P.cream}
              size={28}
              rot={-0.8}
              seed="lbl-ketidakadilan"
            />

            {/* Beat f [482–559]: "Manfaatnya terkonsentrasi" */}
            <PaperLabel
              x={290}
              y={104}
              text="Manfaatnya terkonsentrasi"
              at={484}
              bg={P.mustardHi}
              color={P.brownLo}
              size={25}
              rot={-1.4}
              seed="lbl-manfaat-konsentrasi"
            />

            {/* Beat g [564–695]: "Biayanya tersebar" dan "yang paling tidak punya" */}
            <PaperLabel
              x={920}
              y={104}
              text="Biayanya tersebar"
              at={568}
              bg={P.terra}
              color={P.cream}
              size={26}
              rot={1.5}
              seed="lbl-biaya-tersebar"
            />

            <PaperLabel
              x={1060}
              y={390}
              text="yang paling tidak punya"
              at={604}
              bg={P.creamMid}
              color={P.brownLo}
              size={23}
              rot={-1.8}
              seed="lbl-paling-tidak-punya"
            />

            {/* BINGKAI TIRAI TEATER KERTAS TERAKOTA ("PANGGUNG LANTAI") */}
            <Paper lift={7}>
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
              <Slab
                x={0}
                y={curtainTopY}
                w={1280}
                h={112}
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
