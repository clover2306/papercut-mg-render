// Adegan MG-C "Mesin Respons": tumpukan biaya dari MG-B jatuh ke corong mesin kertas bertingkat,
// memicu empat saluran respons pemberi kerja (jam kerja, lowongan, mesin, menutup usaha),
// hingga pekerja keluar tanpa helm di jalur miring dan bergeser ke sudut gelap pembuka MG-D.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {
  Boil,
  CameraPush,
  Disc,
  GRAIN,
  GrainOverlay,
  Paper,
  PaperDefs,
  PopIn,
  Slab,
} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const MGC_DUR = 539;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet hangat kertas (krem, kraft, mustard, sage/zaitun, terakota/bata, cokelat tua; tanpa biru dingin/hitam pekat/neon)
const P = {
  wall: C.creamHi,
  cream: C.cream,
  creamLo: C.creamLo,
  creamCard: '#F4ECE0',
  kraft: '#C79B68',
  kraftHi: '#DAB58A',
  kraftLo: '#9B7143',
  kraftEdge: '#6E4B26',
  mustard: '#DDA334',
  mustardHi: '#F0C35A',
  mustardLo: '#A3721C',
  sage: '#7E9472',
  sageHi: '#9FB592',
  sageLo: '#5A6D50',
  terra: '#B8533A',
  terraHi: '#D46E53',
  terraLo: '#7D3422',
  brick: ROOM.terracotta,
  wood: C.wood,
  woodLo: C.woodLo,
  floor: C.floor,
  floorLo: C.floorLo,
  ink: C.ink,
  inkSoft: C.inkSoft,
  tape: C.tape,
};

const STAGE_FLOOR_Y = 610;
const PLANK_TOP_Y = 574;
const THREAD_Y = 252;

// Kuantisasi frame ringan (2 frame) untuk gerak stop-motion kertas
const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Label Kertas (satu-satunya cara teks muncul di layar, hanya dari daftar "Teks boleh tampil")
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
  seed?: string;
  tape?: boolean;
}> = ({
  x,
  y,
  text,
  at,
  outAt,
  bg = P.creamCard,
  color = P.ink,
  size = 24,
  rot = -1.2,
  seed = 'lbl',
  tape = true,
}) => {
  const rawF = useCurrentFrame();
  const f = stepFrame(rawF, 2);
  if (f < at) return null;

  const fadeOut =
    outAt !== undefined
      ? interpolate(f, [outAt, outAt + 16], [1, 0.22], CLAMP)
      : 1;

  // PopIn/Boil HARUS di luar div berposisi: bila di dalam, inset:0 membuat
  // lebar div luar menciut sehingga kotak label sempit dan teks meluber.
  return (
    <PopIn at={at} seed={seed}>
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            translate: '-50% -50%',
            opacity: fadeOut,
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              rotate: `${rot}deg`,
              backgroundColor: bg,
              backgroundImage: `url(${GRAIN})`,
              backgroundSize: '420px',
              backgroundBlendMode: 'multiply',
              padding: '9px 18px 11px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: size,
              color,
              lineHeight: 1.08,
              whiteSpace: 'nowrap',
              border: `2px solid ${P.inkSoft}`,
              filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(54,34,26,0.36))',
            }}
          >
            {text}
            {tape ? (
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: '50%',
                  width: 52,
                  height: 15,
                  translate: '-50% 0',
                  rotate: `${-rot * 1.3}deg`,
                  backgroundColor: P.tape,
                  opacity: 0.85,
                  filter: 'url(#torn)',
                }}
              />
            ) : null}
          </div>
        </div>
      </Boil>
    </PopIn>
  );
};

// Roda gigi kertas tanpa angka
const PaperGear: React.FC<{
  x: number;
  y: number;
  r: number;
  teeth?: number;
  deg: number;
  color: string;
  shade: string;
  hubColor?: string;
}> = ({x, y, r, teeth = 8, deg, color, shade, hubColor = P.woodLo}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 0,
      height: 0,
      transform: `rotate(${deg}deg)`,
    }}
  >
    {Array.from({length: teeth}).map((_, i) => {
      const a = (i * 360) / teeth;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            transform: `rotate(${a}deg)`,
          }}
        >
          <Slab
            x={-r * 0.22}
            y={-r * 1.24}
            w={r * 0.44}
            h={r * 0.36}
            color={shade}
            r={3}
          />
        </div>
      );
    })}
    <Disc x={0} y={0} d={r * 2} color={color} shade={shade} />
    <Disc x={0} y={0} d={r * 0.88} color={shade} />
    <Disc x={0} y={0} d={r * 0.42} color={hubColor} />
  </div>
);

// Figur pekerja pabrik faceless (tanpa mata, hidung, mulut, alis, telinga)
const FacelessWorker: React.FC<{
  x: number;
  y: number;
  s?: number;
  hasHelmet?: boolean;
  tilt?: number;
  slump?: number;
  shirt?: string;
}> = ({
  x,
  y,
  s = 0.72,
  hasHelmet = true,
  tilt = 0,
  slump = 0,
  shirt = P.sage,
}) => {
  const headDrop = slump * 6 * s;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 84 * s,
        height: 174 * s,
        transform: `translate(-50%, -100%) rotate(${tilt}deg)`,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
      }}
    >
      <Paper lift={3}>
        {/* Kaki */}
        <Slab x={20 * s} y={130 * s} w={18 * s} h={44 * s} color={P.inkSoft} r={5 * s} />
        <Slab x={46 * s} y={130 * s} w={18 * s} h={44 * s} color={P.inkSoft} r={5 * s} />
        {/* Badan */}
        <Slab
          x={14 * s}
          y={(56 + headDrop) * s}
          w={56 * s}
          h={78 * s}
          color={shirt}
          shade={P.sageLo}
          shadeH={0.22}
          r={10 * s}
        />
        {/* Selempang kerja */}
        <Slab
          x={24 * s}
          y={(56 + headDrop) * s}
          w={9 * s}
          h={76 * s}
          color={P.woodLo}
          r={2}
        />
        {/* Kepala bulat polos tanpa wajah */}
        <Disc
          x={42 * s}
          y={(30 + headDrop) * s}
          d={44 * s}
          color={P.creamCard}
          shade={P.creamLo}
        />
        {/* Helm kuning pabrik (jika masih dipakai) */}
        {hasHelmet ? (
          <>
            <Slab
              x={16 * s}
              y={(4 + headDrop) * s}
              w={52 * s}
              h={22 * s}
              color={P.mustardHi}
              shade={P.mustard}
              shadeH={0.3}
              r={`${26 * s}px ${26 * s}px ${4 * s}px ${4 * s}px`}
            />
            <Slab
              x={10 * s}
              y={(22 + headDrop) * s}
              w={64 * s}
              h={7 * s}
              color={P.mustard}
              r={3 * s}
            />
          </>
        ) : null}
      </Paper>
    </div>
  );
};

// Helm kuning kertas yang tertinggal di mesin pada Beat f
const DetachedHelmet: React.FC<{
  x: number;
  y: number;
  rot: number;
  s?: number;
  opacity?: number;
}> = ({x, y, rot, s = 0.76, opacity = 1}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 68 * s,
        height: 32 * s,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Paper lift={4}>
        <Slab
          x={6 * s}
          y={0}
          w={52 * s}
          h={22 * s}
          color={P.mustardHi}
          shade={P.mustard}
          shadeH={0.3}
          r={`${26 * s}px ${26 * s}px ${4 * s}px ${4 * s}px`}
        />
        <Slab x={0} y={18 * s} w={64 * s} h={7 * s} color={P.mustard} r={3 * s} />
      </Paper>
    </div>
  );
};

// Figur pemberi kerja faceless berjas bata di samping mesin
const FacelessEmployer: React.FC<{
  x: number;
  y: number;
  s?: number;
  lean?: number;
}> = ({x, y, s = 0.76, lean = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 92 * s,
      height: 184 * s,
      transform: `translate(-50%, -100%) rotate(${lean}deg)`,
      transformOrigin: '50% 100%',
      pointerEvents: 'none',
    }}
  >
    <Paper lift={4}>
      <Slab x={22 * s} y={136 * s} w={19 * s} h={48 * s} color={P.floorLo} r={5 * s} />
      <Slab x={50 * s} y={136 * s} w={19 * s} h={48 * s} color={P.floorLo} r={5 * s} />
      <Slab
        x={14 * s}
        y={56 * s}
        w={64 * s}
        h={84 * s}
        color={P.brick}
        shade={P.terraLo}
        shadeH={0.22}
        r={10 * s}
      />
      {/* Kerah jas bata tanpa wajah */}
      <Slab x={38 * s} y={56 * s} w={16 * s} h={32 * s} color={P.creamCard} r={3 * s} />
      <Slab x={43 * s} y={62 * s} w={6 * s} h={26 * s} color={P.terraLo} r={2 * s} />
      {/* Kepala bulat polos */}
      <Disc x={46 * s} y={28 * s} d={44 * s} color={P.creamCard} shade={P.creamLo} />
    </Paper>
  </div>
);

// Saluran 1 (Beat b [58–103]): Wajah jam kertas polos (tanpa angka), irisan terpotong hilang, jarum memendek
const ChannelOneClock: React.FC<{f: number}> = ({f}) => {
  const cx = 190;
  const cy = 365;
  const openProg = interpolate(f, [58, 70], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const clockDrop = interpolate(f, [60, 76], [-52, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const clockOp = interpolate(f, [58, 64], [0, 1], CLAMP);

  // Irisan wajah jam terpotong hilang (72..94) & jarum memendek (76..98)
  const sliceCut = interpolate(f, [72, 94], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const handShorten = interpolate(f, [76, 98], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const mainHandLen = interpolate(handShorten, [0, 1], [34, 17], CLAMP);
  const secondHandLen = interpolate(handShorten, [0, 1], [26, 13], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Rumah saluran 1 */}
      <Paper lift={5}>
        <Slab
          x={cx - 88}
          y={278}
          w={176}
          h={174}
          color={P.cream}
          shade={P.creamLo}
          shadeH={0.16}
          r={8}
        />
        {/* Bingkai dalam saluran */}
        <Slab
          x={cx - 74}
          y={296}
          w={148}
          h={142}
          color={P.woodLo}
          shade={P.floorLo}
          shadeH={0.25}
          r={6}
        />
        {/* Corong keluar atas saluran 1 */}
        <Slab
          x={cx - 42}
          y={264 - openProg * 8}
          w={84}
          h={24}
          color={P.kraft}
          shade={P.kraftLo}
          r={4}
        />
      </Paper>

      {/* Wajah jam kertas polos (TANPA ANGKA, hanya titik poros + jarum) */}
      {clockOp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cy + 6 + clockDrop,
            opacity: clockOp,
          }}
        >
          <Paper lift={6}>
            <svg
              width={136}
              height={136}
              viewBox="-68 -68 136 136"
              style={{
                position: 'absolute',
                left: -68,
                top: -68,
                overflow: 'visible',
              }}
            >
              {/* Lingkaran dasar jam dengan irisan kanan-atas yang terpotong hilang */}
              <path
                d={
                  sliceCut > 0.02
                    ? 'M 0 0 L 0 -50 A 50 50 0 1 0 50 0 Z'
                    : 'M 0 -50 A 50 50 0 1 1 -0.01 -50 Z'
                }
                fill={P.creamCard}
                stroke={P.kraftEdge}
                strokeWidth={5}
              />
              {/* Rongga gelap tempat irisan terpotong */}
              {sliceCut > 0.02 ? (
                <path
                  d="M 0 0 L 0 -46 A 46 46 0 0 1 46 0 Z"
                  fill={P.floorLo}
                  opacity={0.65}
                />
              ) : null}

              {/* Irisan wajah jam yang terlepas dan jatuh ke kanan-bawah */}
              {sliceCut > 0.01 && sliceCut < 0.98 ? (
                <g
                  transform={`translate(${sliceCut * 36}, ${sliceCut * 42}) rotate(${sliceCut * 34})`}
                  opacity={1 - sliceCut * 0.85}
                >
                  <path
                    d="M 0 0 L 0 -50 A 50 50 0 0 1 50 0 Z"
                    fill={P.mustardHi}
                    stroke={P.kraftEdge}
                    strokeWidth={4}
                  />
                </g>
              ) : null}

              {/* Jarum jam kertas yang memendek (tanpa angka) */}
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-mainHandLen}
                stroke={P.terra}
                strokeWidth={6}
                strokeLinecap="round"
              />
              <line
                x1={0}
                y1={0}
                x2={-secondHandLen * 0.82}
                y2={secondHandLen * 0.52}
                stroke={P.ink}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <circle cx={0} cy={0} r={6.5} fill={P.woodLo} />
            </svg>
          </Paper>
        </div>
      ) : null}
    </div>
  );
};

// Saluran 2 (Beat c [116–163]): Kartu lowongan lepas dari papan pengumuman lalu masuk ke laci yang menutup
const ChannelTwoVacancy: React.FC<{f: number}> = ({f}) => {
  const cx = 455;
  const openProg = interpolate(f, [116, 126], [0, 1], CLAMP);

  // Kartu lowongan terangkat lepas (120..136) lalu meluncur turun ke laci (134..152)
  const liftOut = interpolate(f, [120, 134], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const slipIn = interpolate(f, [132, 152], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  // Laci terbuka saat menyambut kartu (122..136) lalu menutup rapat (146..162)
  const drawerOpen =
    interpolate(f, [120, 134], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) -
    interpolate(f, [146, 161], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const cardY = 312 - liftOut * 10 + slipIn * 78;
  const cardScale = interpolate(slipIn, [0.6, 1], [1, 0.85], CLAMP);
  const cardOp = interpolate(slipIn, [0.72, 0.98], [1, 0], CLAMP);
  const cardRot = -3 + liftOut * 7 - slipIn * 4;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <Paper lift={5}>
        {/* Rumah saluran 2 */}
        <Slab
          x={cx - 88}
          y={278}
          w={176}
          h={174}
          color={P.cream}
          shade={P.creamLo}
          shadeH={0.16}
          r={8}
        />
        {/* Papan pengumuman gabus/kayu di bagian atas saluran */}
        <Slab
          x={cx - 70}
          y={294}
          w={140}
          h={86}
          color={P.kraftLo}
          shade={P.woodLo}
          shadeH={0.2}
          r={5}
        />
        {/* Corong atas saluran 2 */}
        <Slab
          x={cx - 42}
          y={264 - openProg * 8}
          w={84}
          h={24}
          color={P.kraft}
          shade={P.kraftLo}
          r={4}
        />
      </Paper>

      {/* Kartu lowongan kertas (hanya garis abstrak, tanpa teks/angka) */}
      {cardOp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cardY,
            width: 72,
            height: 54,
            transform: `translate(-50%, 0) rotate(${cardRot}deg) scale(${cardScale})`,
            opacity: cardOp,
            zIndex: 12,
          }}
        >
          <Paper lift={4}>
            <Slab
              x={0}
              y={0}
              w={72}
              h={54}
              color={P.creamCard}
              shade={P.creamLo}
              shadeH={0.15}
              r={4}
            >
              {/* Pin kertas terakota */}
              <Disc
                x={36}
                y={8}
                d={8}
                color={P.terra}
                style={{opacity: 1 - liftOut}}
              />
              {/* Garis-garis abstrak pengganti tulisan */}
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 18,
                  width: 48,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: P.wood,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 28,
                  width: 36,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: P.kraftLo,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 38,
                  width: 42,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: P.kraftLo,
                }}
              />
            </Slab>
          </Paper>
        </div>
      ) : null}

      {/* Laci kertas di bagian bawah saluran 2 yang menutup menyimpan kartu */}
      <Paper lift={7}>
        {/* Celah mulut laci saat terbuka */}
        {drawerOpen > 0.02 ? (
          <Slab
            x={cx - 66}
            y={384}
            w={132}
            h={16 * drawerOpen}
            color={P.floorLo}
            r={2}
          />
        ) : null}
        <Slab
          x={cx - 72}
          y={390 + drawerOpen * 14}
          w={144}
          h={52}
          color={P.wood}
          hi={P.kraft}
          hiH={0.18}
          shade={P.woodLo}
          shadeH={0.28}
          r={5}
        >
          {/* Pegangan laci kertas */}
          <Slab
            x={48}
            y={18}
            w={48}
            h={14}
            color={P.mustard}
            shade={P.mustardLo}
            r={6}
          />
        </Slab>
      </Paper>
    </div>
  );
};

// Saluran 3 (Beat d [175–245]): Lengan mesin kertas kotak-kotak turun ke titik kerja, mendorong pekerja ke samping
const ChannelThreeMachineArm: React.FC<{f: number}> = ({f}) => {
  const cx = 745;
  const armDescend = interpolate(f, [175, 212], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });
  const pushWorker = interpolate(f, [192, 232], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const clawPinch = interpolate(f, [210, 236], [0, 1], CLAMP);

  const workerX = cx + pushWorker * 72;
  const workerTilt = pushWorker * 11;
  const workerOp = interpolate(pushWorker, [0, 0.85, 1], [1, 0.9, 0.55], CLAMP);

  const armY = 282 + armDescend * 66;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Rumah saluran 3 */}
      <Paper lift={5}>
        <Slab
          x={cx - 88}
          y={278}
          w={176}
          h={174}
          color={P.cream}
          shade={P.creamLo}
          shadeH={0.16}
          r={8}
        />
        <Slab
          x={cx - 74}
          y={294}
          w={148}
          h={144}
          color={P.creamLo}
          shade={P.kraftLo}
          shadeH={0.18}
          r={5}
        />
        {/* Meja/titik kerja di bawah saluran 3 */}
        <Slab
          x={cx - 64}
          y={422}
          w={128}
          h={20}
          color={P.wood}
          shade={P.woodLo}
          r={3}
        />
      </Paper>

      {/* Figur pekerja di titik kerja yang terdorong keluar ke samping */}
      <div style={{opacity: workerOp}}>
        <FacelessWorker
          x={workerX}
          y={426}
          s={0.56}
          hasHelmet
          tilt={workerTilt}
          slump={pushWorker * 0.7}
        />
      </div>

      {/* Lengan mesin kertas kotak-kotak yang turun mengambil tempat pekerja */}
      <Paper lift={7}>
        {/* Batang teleskopik kotak-kotak */}
        <Slab
          x={cx - 18}
          y={276}
          w={36}
          h={Math.max(18, armY - 270)}
          color={P.woodLo}
          shade={P.floorLo}
          r={3}
        />
        <Slab
          x={cx - 28}
          y={armY - 26}
          w={56}
          h={34}
          color={P.terra}
          hi={P.terraHi}
          shade={P.terraLo}
          r={4}
        />
        {/* Bahu kotak mesin */}
        <Slab
          x={cx - 38}
          y={armY + 4}
          w={76}
          h={42}
          color={P.kraft}
          hi={P.kraftHi}
          shade={P.kraftLo}
          r={5}
        >
          <Disc x={20} y={21} d={12} color={P.woodLo} />
          <Disc x={56} y={21} d={12} color={P.woodLo} />
        </Slab>
        {/* Capit kotak kiri & kanan */}
        <Slab
          x={cx - 34 + clawPinch * 6}
          y={armY + 44}
          w={18}
          h={28}
          color={P.woodLo}
          r={3}
        />
        <Slab
          x={cx + 16 - clawPinch * 6}
          y={armY + 44}
          w={18}
          h={28}
          color={P.woodLo}
          r={3}
        />
      </Paper>

      {/* Corong atas penutup saluran 3 */}
      <Paper lift={8}>
        <Slab
          x={cx - 42}
          y={260}
          w={84}
          h={24}
          color={P.kraft}
          shade={P.kraftLo}
          r={4}
        />
      </Paper>
    </div>
  );
};

// Saluran 4 (Beat e [260–355]): Kios kertas mungil, tirai gulungnya turun menutup & kunci kertas tergantung
const ChannelFourKiosk: React.FC<{f: number}> = ({f}) => {
  const cx = 1045;
  // Tirai gulung turun cepat di awal Beat e (260..269) agar pada frame 270 sudah menutup jelas
  const shutterClose = interpolate(f, [260, 269], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Kunci/gembok kertas muncul & berayun di depan tirai (263..270)
  const lockAppear = interpolate(f, [262, 268], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.6)),
  });
  const lockSwing =
    f >= 262
      ? Math.sin((f - 262) * 0.28) * 10 * Math.exp(-Math.max(0, f - 262) / 36)
      : 0;

  const shutterH = Math.round(14 + shutterClose * 88);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Badan Kios Kertas Mungil di ujung saluran 4 */}
      <Paper lift={5}>
        <Slab
          x={cx - 90}
          y={284}
          w={180}
          h={168}
          color={P.creamCard}
          shade={P.creamLo}
          shadeH={0.18}
          r={6}
        />
        {/* Ruang dalam etalase kios (sebelum ditutup tirai) */}
        <Slab
          x={cx - 72}
          y={322}
          w={144}
          h={92}
          color={P.woodLo}
          shade={P.floorLo}
          r={4}
        >
          {/* Siluet barang warung/kios di dalam */}
          <Slab x={18} y={48} w={26} h={38} color={P.mustardLo} r={3} />
          <Slab x={54} y={38} w={32} h={48} color={P.sageLo} r={3} />
          <Slab x={96} y={52} w={24} h={34} color={P.terraLo} r={3} />
        </Slab>

        {/* Meja etalase bawah kios */}
        <Slab
          x={cx - 82}
          y={412}
          w={164}
          h={22}
          color={P.wood}
          shade={P.woodLo}
          r={4}
        />
      </Paper>

      {/* Tirai gulung kertas (rolling shutter) yang turun menutup kios */}
      <Paper lift={6}>
        <Slab
          x={cx - 74}
          y={320}
          w={148}
          h={shutterH}
          color={P.kraft}
          shade={P.kraftLo}
          shadeH={0.14}
          r={3}
        >
          {Array.from({length: 7}).map((_, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: 10 + idx * 13,
                height: 3,
                backgroundColor: P.kraftEdge,
                opacity: 0.65,
              }}
            />
          ))}
        </Slab>
      </Paper>

      {/* Kanopi belang terakota-krem di atap kios */}
      <Paper lift={7}>
        <Slab
          x={cx - 98}
          y={272}
          w={196}
          h={46}
          color={P.terra}
          shade={P.terraLo}
          shadeH={0.22}
          r="8px 8px 6px 6px"
        >
          {[0, 1, 2, 3].map((stripe) => (
            <Slab
              key={stripe}
              x={22 + stripe * 46}
              y={0}
              w={22}
              h={46}
              color={P.creamCard}
              shade={P.creamLo}
              r={0}
            />
          ))}
        </Slab>
        {/* Corong sambungan atas saluran 4 */}
        <Slab
          x={cx - 40}
          y={256}
          w={80}
          h={22}
          color={P.kraft}
          shade={P.kraftLo}
          r={4}
        />
      </Paper>

      {/* Gembok & Kunci Kertas tergantung di tirai kios */}
      {lockAppear > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: 320 + shutterH - 8,
            transform: `translate(-50%, 0) rotate(${lockSwing}deg) scale(${lockAppear})`,
            transformOrigin: '50% 0%',
            zIndex: 18,
          }}
        >
          <Paper lift={6}>
            {/* Gantungan gembok/kunci */}
            <div
              style={{
                position: 'absolute',
                left: -14,
                top: -4,
                width: 28,
                height: 24,
                borderRadius: '14px 14px 0 0',
                border: `6px solid ${P.woodLo}`,
                boxSizing: 'border-box',
              }}
            />
            {/* Badan gembok/kunci kertas mustard */}
            <Slab
              x={-22}
              y={14}
              w={44}
              h={38}
              color={P.mustardHi}
              shade={P.mustardLo}
              shadeH={0.26}
              r={6}
            >
              <Disc x={22} y={15} d={10} color={P.ink} />
              <Slab x={19} y={18} w={6} h={12} color={P.ink} r={2} />
            </Slab>
            {/* Anak kunci kertas menggantung di sebelahnya */}
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 12,
                transform: 'rotate(24deg)',
              }}
            >
              <Disc x={10} y={10} d={20} color={P.terra} shade={P.terraLo} />
              <Disc x={10} y={10} d={7} color={P.creamCard} />
              <Slab x={7} y={18} w={6} h={24} color={P.terra} r={2} />
              <Slab x={12} y={30} w={8} h={5} color={P.terra} r={1} />
              <Slab x={12} y={37} w={10} h={5} color={P.terra} r={1} />
            </div>
          </Paper>
        </div>
      ) : null}
    </div>
  );
};

// Badan Utama Mesin Kertas Bertingkat + Corong Atas + Tumpukan Biaya + Uap Kertas
const ResponseMachineCore: React.FC<{f: number}> = ({f}) => {
  // Tumpukan biaya dari MG-B jatuh ke corong pada Beat a [0–39]
  const costBlocks = [
    {start: 0, end: 18, dx: -16, rot: -4, color: P.terra, w: 86, h: 24},
    {start: 5, end: 23, dx: 14, rot: 3, color: P.kraft, w: 94, h: 24},
    {start: 10, end: 28, dx: -6, rot: -2, color: P.mustard, w: 78, h: 22},
  ];

  // Getaran mesin saat menggeram (terutama di Beat a dan tiap pembukaan saluran)
  const rumbleActive =
    (f >= 12 && f <= 42) ||
    (f >= 56 && f <= 72) ||
    (f >= 114 && f <= 130) ||
    (f >= 173 && f <= 190) ||
    (f >= 258 && f <= 276);
  const shakeX = rumbleActive ? ((f / 2) % 2 === 0 ? -2.5 : 2.5) : 0;
  const shakeY = rumbleActive ? ((f / 2) % 2 === 0 ? 1.5 : -1.5) : 0;

  // Putaran roda gigi kertas tersendat (stepped stop-motion)
  const gearStep = Math.floor(Math.max(0, f - 10) / 4);
  const gearDeg = gearStep * 14;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Tumpukan beban biaya jatuh dari atas ke dalam corong */}
      {costBlocks.map((b, i) => {
        const p = interpolate(f, [b.start, b.end], [0, 1], {
          ...CLAMP,
          easing: Easing.in(Easing.quad),
        });
        const y = interpolate(p, [0, 1], [-90, 96], CLAMP);
        const op = interpolate(f, [b.end - 4, b.end + 3], [1, 0], CLAMP);
        if (op <= 0.01) return null;
        return (
          <Paper key={i} lift={5} style={{opacity: op}}>
            <Slab
              x={620 + b.dx - b.w / 2}
              y={y}
              w={b.w}
              h={b.h}
              color={b.color}
              shade={P.terraLo}
              r={4}
              rot={b.rot}
            />
          </Paper>
        );
      })}

      {/* Kepulan uap kertas kecil keluar dari katup samping mesin */}
      {[0, 1, 2, 3].map((idx) => {
        const cycle = (f + idx * 14) % 44;
        const puffActive = f >= 14;
        if (!puffActive) return null;
        const u = interpolate(cycle, [0, 42], [0, 1], CLAMP);
        const isLeft = idx % 2 === 0;
        const baseX = isLeft ? 430 : 810;
        const baseY = 162 + (idx > 1 ? 26 : 0);
        const px = baseX + (isLeft ? -1 : 1) * (12 + u * 44);
        const py = baseY - u * 46;
        const d = 16 + u * 18;
        const op = interpolate(u, [0, 0.2, 0.8, 1], [0, 0.88, 0.65, 0], CLAMP);
        return (
          <div key={idx} style={{opacity: op}}>
            <Paper lift={3}>
              <Disc x={px} y={py} d={d} color={P.creamCard} shade={P.creamLo} />
            </Paper>
          </div>
        );
      })}

      {/* Corong Puncak Mesin (Funnel) */}
      <Paper lift={6}>
        <svg
          width={240}
          height={90}
          viewBox="0 0 240 90"
          style={{position: 'absolute', left: 500, top: 48}}
        >
          <polygon
            points="16,8 224,8 176,82 64,82"
            fill={P.terra}
            stroke={P.terraLo}
            strokeWidth={4}
          />
          <polygon points="24,14 216,14 206,28 34,28" fill={P.terraHi} opacity={0.5} />
        </svg>
        <Slab x={508} y={42} w={224} h={14} color={P.woodLo} r={5} />
      </Paper>

      {/* Kotak Besar Mesin Kertas Bertingkat (Upper Gearbox & Manifold) */}
      <Paper lift={7}>
        {/* Tingkat 1: Ruang Roda Gigi Utama */}
        <Slab
          x={448}
          y={122}
          w={344}
          h={116}
          color={P.wood}
          hi={P.kraft}
          hiH={0.14}
          shade={P.woodLo}
          shadeH={0.24}
          r={10}
        >
          {/* Jendela intip roda gigi di badan mesin */}
          <Slab x={24} y={18} w={296} h={80} color={P.floorLo} r={6} />
        </Slab>

        {/* Roda-roda gigi kertas berputar tersendat di dalam mesin */}
        <PaperGear
          x={534}
          y={180}
          r={32}
          teeth={8}
          deg={gearDeg}
          color={P.mustard}
          shade={P.mustardLo}
        />
        <PaperGear
          x={620}
          y={176}
          r={38}
          teeth={10}
          deg={-gearDeg * 0.8}
          color={P.kraftHi}
          shade={P.kraftLo}
        />
        <PaperGear
          x={706}
          y={182}
          r={30}
          teeth={8}
          deg={gearDeg * 1.1}
          color={P.terraHi}
          shade={P.terraLo}
        />

        {/* Pipa manifold tingkat kedua yang membagi ke 4 saluran */}
        <Slab
          x={145}
          y={236}
          w={945}
          h={30}
          color={P.woodLo}
          hi={P.wood}
          hiH={0.25}
          shade={P.floorLo}
          shadeH={0.35}
          r={6}
        />
        {/* Baut-baut kertas sepanjang pipa manifold */}
        {[190, 320, 455, 600, 745, 895, 1045].map((bx, i) => (
          <Disc key={i} x={bx} y={251} d={11} color={P.mustard} shade={P.mustardLo} />
        ))}
      </Paper>
    </div>
  );
};

// Beat f [385–500] & Beat g [500–539]: Jalur miring dari bawah mesin, pekerja keluar tanpa helm & bergeser ke kanan
const DisplacedWorkerSlideAndShift: React.FC<{f: number}> = ({f}) => {
  // Pintu bawah mesin & jalur miring muncul di awal Beat f (385..405)
  const rampReveal = interpolate(f, [385, 404], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Pekerja meluncur turun di jalur kertas miring (396..462)
  const slideProg = interpolate(f, [396, 462], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Helm tertinggal di mulut pintu bawah mesin saat pekerja meluncur keluar (f >= 404)
  const helmetDetached = f >= 406;
  const helmetWobble =
    f >= 406
      ? Math.sin((f - 406) * 0.35) * 14 * Math.exp(-Math.max(0, f - 406) / 28)
      : 0;

  // Beat g (500..539): Pekerja bergeser ke samping kanan melewati lantai menuju sudut gelap pembuka MG-D
  const shiftRight = interpolate(f, [500, 539], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Posisi pekerja selama Beat f (meluncur dari (590, 488) ke (830, 574)) lalu Beat g (bergeser ke (1095, 574))
  const startX = 590;
  const startY = 488;
  const landX = 830;
  const landY = PLANK_TOP_Y;
  const endX = 1095;

  const workerX =
    f < 500
      ? interpolate(slideProg, [0, 1], [startX, landX], CLAMP)
      : interpolate(shiftRight, [0, 1], [landX, endX], CLAMP);

  const workerY =
    f < 500 ? interpolate(slideProg, [0, 1], [startY, landY], CLAMP) : landY;

  const slideTilt =
    f < 462
      ? interpolate(slideProg, [0, 0.2, 0.85, 1], [0, -16, -14, 0], CLAMP)
      : interpolate(shiftRight, [0, 0.3, 0.85, 1], [0, 5, 4, 0], CLAMP);

  const workerVisible = interpolate(f, [390, 400], [0, 1], CLAMP);

  // Sudut gelap pembuka MG-D di sisi kanan panggung menguat pada Beat f akhir & Beat g
  const darkCornerOp = interpolate(f, [470, 512], [0, 0.88], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Sudut gelap hangat di sisi kanan panggung (pembuka MG-D) */}
      {darkCornerOp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 280,
            width: 310,
            height: STAGE_FLOOR_Y - 280,
            background: `linear-gradient(90deg, rgba(54,34,26,0) 0%, rgba(54,34,26,0.58) 55%, rgba(36,22,16,0.86) 100%)`,
            opacity: darkCornerOp,
            zIndex: 14,
          }}
        />
      ) : null}

      {/* Kotak Pintu Keluar Bawah Mesin & Jalur Kertas Miring */}
      {rampReveal > 0.01 ? (
        <div style={{opacity: rampReveal, zIndex: 15}}>
          <Paper lift={6}>
            {/* Rumah pintu keluar bawah mesin */}
            <Slab
              x={542}
              y={428}
              w={104}
              h={96}
              color={P.wood}
              shade={P.woodLo}
              shadeH={0.28}
              r={6}
            >
              <Slab x={16} y={16} w={72} h={72} color={P.floorLo} r={4} />
              {/* Palang pengait tempat helm kuning tersangkut tertinggal */}
              <Slab x={10} y={12} w={84} h={10} color={P.terra} r={3} />
            </Slab>

            {/* Jalur kertas miring (slide chute) dari pintu mesin ke lantai panggung */}
            <svg
              width={320}
              height={140}
              viewBox="0 0 320 140"
              style={{position: 'absolute', left: 575, top: 468}}
            >
              <polygon
                points="0,16 28,4 282,98 254,110"
                fill={P.kraftHi}
                stroke={P.kraftEdge}
                strokeWidth={3}
              />
              <polygon points="0,16 254,110 254,122 0,28" fill={P.kraftLo} />
            </svg>
          </Paper>

          {/* Helm kuning yang tertinggal di pintu keluar bawah mesin */}
          {helmetDetached ? (
            <DetachedHelmet
              x={598}
              y={442}
              rot={-14 + helmetWobble}
              s={0.74}
            />
          ) : null}
        </div>
      ) : null}

      {/* Pekerja yang meluncur keluar (kehilangan helmnya di mesin, tapi tetap utuh di atas panggung) */}
      {workerVisible > 0.01 ? (
        <div style={{opacity: workerVisible, zIndex: 20}}>
          <FacelessWorker
            x={workerX}
            y={workerY}
            s={0.68}
            hasHelmet={!helmetDetached}
            tilt={slideTilt}
            slump={helmetDetached ? 0.35 : 0}
            shirt={P.sage}
          />
        </div>
      ) : null}
    </div>
  );
};

// Elemen Pengikat Panggung Lantai: Benang Mustard Bertitik, Papan Lantai Kraft, Lantai Kayu & Tirai Terakota
const StageFloorAndThread: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {/* Benang Mustard Bertitik di latar panggung */}
    <Paper lift={3}>
      <Disc x={96} y={THREAD_Y} d={22} color={P.mustard} shade={P.mustardLo} />
      <Disc x={1184} y={THREAD_Y} d={22} color={P.mustard} shade={P.mustardLo} />
    </Paper>
    <svg
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
      style={{position: 'absolute', inset: 0, opacity: 0.75}}
    >
      <path
        d={`M 96 ${THREAD_Y} L 1184 ${THREAD_Y}`}
        fill="none"
        stroke={P.mustard}
        strokeWidth={5}
        strokeDasharray="12 9"
        strokeLinecap="round"
      />
    </svg>

    {/* Papan Lantai Kraft (= upah minimum: tebal, tepi atas berjahit garis putus-putus) */}
    <Paper lift={6}>
      <Slab
        x={64}
        y={PLANK_TOP_Y}
        w={1152}
        h={38}
        color={P.kraft}
        hi={P.kraftHi}
        hiH={0.18}
        shade={P.kraftLo}
        shadeH={0.26}
        r={6}
      >
        <svg
          width={1152}
          height={16}
          viewBox="0 0 1152 16"
          style={{position: 'absolute', left: 0, top: 2}}
        >
          <line
            x1={16}
            y1={7}
            x2={1136}
            y2={7}
            stroke={P.kraftEdge}
            strokeWidth={3}
            strokeDasharray="12 8"
            strokeLinecap="round"
          />
        </svg>
      </Slab>
    </Paper>

    {/* Lantai Panggung Kayu */}
    <Slab x={-40} y={STAGE_FLOOR_Y} w={1360} h={130} color={P.floor} r={0} grain={0.6} />
    <Slab
      x={-40}
      y={STAGE_FLOOR_Y - 16}
      w={1360}
      h={20}
      color={P.woodLo}
      shade={P.floorLo}
      shadeH={0.35}
      r={0}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: STAGE_FLOOR_Y + 36,
        height: 3,
        backgroundColor: P.floorLo,
        opacity: 0.8,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: STAGE_FLOOR_Y + 74,
        height: 3,
        backgroundColor: P.floorLo,
        opacity: 0.8,
      }}
    />
  </div>
);

const TheaterCurtainWings: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <Paper lift={7}>
      <Slab
        x={-18}
        y={-16}
        w={68}
        h={660}
        color={P.terra}
        shade={P.terraLo}
        shadeH={0.14}
        r="0 0 16px 0"
      />
      <Slab
        x={36}
        y={-16}
        w={28}
        h={600}
        color={P.brick}
        shade={P.terraLo}
        shadeH={0.16}
        r="0 0 12px 12px"
      />
      <Slab
        x={1230}
        y={-16}
        w={68}
        h={660}
        color={P.terra}
        shade={P.terraLo}
        shadeH={0.14}
        r="0 0 0 16px"
      />
      <Slab
        x={1216}
        y={-16}
        w={28}
        h={600}
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
  </div>
);

export const MGC: React.FC = () => {
  const rawF = useCurrentFrame();
  const f = stepFrame(rawF, 2);

  // Postur pemberi kerja yang menarik tuas mesin di Beat a
  const employerLean = interpolate(f, [8, 28, 60], [0, 6, 2], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: P.wall}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <CameraPush dur={MGC_DUR} to={1.05} origin="52% 48%">
          <OrbitCamera
            dur={MGC_DUR}
            yaw={11}
            push={1.05}
            drift={[14, 6]}
            focus={0.5}
            depth={620}
            origin={[640, 480]}
          >
            {/* LAPIS 0.15: Dinding belakang teater kertas krem hangat */}
            <Depth z={0.15} cover>
              <Slab x={-80} y={-60} w={1440} h={840} color={P.wall} r={0} grain={0.55} />
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 40%, rgba(255,248,232,0.22) 0%, rgba(54,34,26,0) 54%, rgba(54,34,26,0.28) 100%)',
                }}
              />
            </Depth>

            {/* LAPIS 0.5: Lantai panggung, Mesin Respons 4 saluran, tokoh faceless, dan jalur miring */}
            <Depth z={0.5}>
              <Boil seed="mgc-stage" amp={0.4} rot={0.05}>
                <StageFloorAndThread />

                {/* Figur pemberi kerja berjas bata di sisi kiri mesin */}
                <FacelessEmployer x={378} y={PLANK_TOP_Y} s={0.72} lean={employerLean} />

                {/* Badan utama Mesin Respons & corong biaya (Beat a: 0–39) */}
                <ResponseMachineCore f={f} />

                {/* Saluran 1: Jam kerja dipotong & jarum memendek (Beat b: 58–103) */}
                <ChannelOneClock f={f} />

                {/* Saluran 2: Kartu lowongan masuk ke laci yang menutup (Beat c: 116–163) */}
                <ChannelTwoVacancy f={f} />

                {/* Saluran 3: Lengan mesin menggantikan pekerja (Beat d: 175–245) */}
                <ChannelThreeMachineArm f={f} />

                {/* Saluran 4: Kios kertas tutup tirai & digembok kunci (Beat e: 260–355) */}
                <ChannelFourKiosk f={f} />

                {/* Jalur miring bawah mesin & pekerja bergeser ke sudut gelap (Beat f: 385–500, Beat g: 500–539) */}
                <DisplacedWorkerSlideAndShift f={f} />
              </Boil>
            </Depth>

            {/* LAPIS 0.8: Sayap tirai panggung & Label Kertas (HANYA dari daftar "Teks boleh tampil") */}
            <Depth z={0.8}>
              <TheaterCurtainWings />

              {/* Beat a [0–39]: "pemberi kerja merespons" menempel di badan mesin */}
              <PaperLabel
                x={620}
                y={108}
                text="pemberi kerja merespons"
                at={10}
                bg={P.mustardHi}
                color={P.ink}
                size={25}
                rot={-1.1}
                seed="lbl-merespons"
              />

              {/* Beat b [58–103]: "mengurangi jam kerja" pada saluran pertama */}
              <PaperLabel
                x={190}
                y={490}
                text="mengurangi jam kerja"
                at={62}
                outAt={392}
                bg={P.creamCard}
                color={P.ink}
                size={22}
                rot={-1.4}
                seed="lbl-jam"
              />

              {/* Beat c [116–163]: "menunda lowongan" pada saluran kedua */}
              <PaperLabel
                x={455}
                y={490}
                text="menunda lowongan"
                at={120}
                outAt={392}
                bg={P.creamCard}
                color={P.ink}
                size={22}
                rot={1.1}
                seed="lbl-lowongan"
              />

              {/* Beat d [175–245]: "mengganti tenaga manusia dengan mesin" pada saluran ketiga */}
              <PaperLabel
                x={745}
                y={538}
                text="mengganti tenaga manusia dengan mesin"
                at={180}
                outAt={392}
                bg={P.kraftHi}
                color={P.ink}
                size={21}
                rot={-0.8}
                seed="lbl-mesin"
              />

              {/* Beat e [260–355]: "menutup usaha" pada saluran keempat */}
              <PaperLabel
                x={1045}
                y={490}
                text="menutup usaha"
                at={261}
                outAt={392}
                bg={P.terra}
                color={P.creamCard}
                size={23}
                rot={1.3}
                seed="lbl-tutup"
              />

              {/* Beat g [500–539]: "Ia bergeser" saat pekerja meluncur ke sudut gelap kanan */}
              <PaperLabel
                x={965}
                y={392}
                text="Ia bergeser"
                at={500}
                bg={P.mustardHi}
                color={P.ink}
                size={28}
                rot={-1.2}
                seed="lbl-bergeser"
              />
            </Depth>
          </OrbitCamera>
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default MGC;
