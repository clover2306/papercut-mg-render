// Adegan MG-D "Peta Kota: Dalam dan Luar": kamera naik ke tampak atas peta kota kertas berlapis.
// Dataran kraft tengah (pekerjaan formal dengan papan lantai upah minimum & pagar kertas) vs
// lapisan luar yang lebih rendah dan kusut (pekerjaan informal, pekerja harian, usaha kecil tidak tercatat),
// hingga dataran tengah naik tinggi dan jurang menganga di antara yang di dalam dan yang di luar, lalu peta melipat seperti buku.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Boil, Disc, GRAIN, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const MGD_DUR = 881;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet hangat kertas (krem, kraft, mustard, sage/zaitun, terakota/bata, cokelat tua; tanpa biru dingin/hitam pekat/neon)
const P = {
  creamBg: C.creamHi,
  creamCard: C.cream,
  creamTag: '#F4ECE0',
  creamLo: C.creamLo,
  kraft: '#C79B68',
  kraftHi: '#DAB58A',
  kraftLo: '#9B7143',
  kraftEdge: '#7A552E',
  kraftStitch: '#5E3B22',
  mustard: '#DDA334',
  mustardHi: '#F2C65A',
  mustardLo: '#A8761D',
  sage: '#7E9672',
  sageHi: '#A3BC96',
  sageLo: '#596E4F',
  terra: '#C9573C',
  terraHi: '#E07A5F',
  terraLo: '#76412E',
  brick: ROOM.terracotta,
  wood: C.wood,
  woodLo: C.woodLo,
  floor: C.floor,
  floorLo: C.floorLo,
  ink: C.ink,
  inkSoft: C.inkSoft,
  tape: C.tape,
};

// Kuantisasi frame ringan (2 frame) untuk gerak stop-motion kertas
const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Daftar lengkap "Teks boleh tampil" pada MG-D (satu-satunya teks yang boleh muncul di layar)
export const ALLOWED_TEXTS = [
  'pekerjaan informal',
  'tanpa kontrak',
  'tanpa jaminan',
  'tanpa upah minimum',
  'pekerjaan formal',
  'pekerja harian',
  'usaha kecil',
  'tidak tercatat',
  'jurang',
  'yang di dalam',
  'yang di luar',
  'lebih sejahtera',
  'lebih jauh dari perlindungan',
] as const;

type AllowedText = (typeof ALLOWED_TEXTS)[number];

// Label kertas sobek (satu-satunya cara teks muncul di layar)
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: AllowedText;
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
  bg = P.creamTag,
  color = P.ink,
  size = 24,
  rot = -1.2,
  seed = 'lbl',
  tape = true,
}) => {
  const f = useCurrentFrame();
  const inOp = interpolate(f, [at, at + 8], [0, 1], CLAMP);
  const outOp =
    outAt !== undefined ? interpolate(f, [outAt, outAt + 12], [1, 0], CLAMP) : 1;
  const opacity = inOp * outOp;
  const exitY =
    outAt !== undefined
      ? interpolate(f, [outAt, outAt + 12], [0, -10], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  if (f < at || opacity <= 0.01) return null;

  return (
    <PopIn at={at} seed={seed} origin={`${x}px ${y}px`}>
      <Boil seed={seed} amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y + exitY,
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            opacity,
            zIndex: 35,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
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
              filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(54,34,26,0.36))',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.28)',
            }}
          >
            {text}
          </div>
          {tape ? (
            <div
              style={{
                position: 'absolute',
                top: -9,
                left: '50%',
                width: 56,
                height: 16,
                transform: `translate(-50%, 0) rotate(${-rot * 1.3}deg)`,
                backgroundColor: P.tape,
                opacity: 0.86,
                filter: 'url(#torn)',
              }}
            />
          ) : null}
        </div>
      </Boil>
    </PopIn>
  );
};

// Lembar kontrak mungil (kertas krem kecil dengan garis goresan abstrak tanpa huruf/angka)
const TinyContractSheet: React.FC<{
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, rot = -6, scale = 1, opacity = 1}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 24,
        height: 30,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Slab x={0} y={0} w={24} h={30} color={P.creamTag} shade={P.creamLo} shadeH={0.18} r={2}>
        <div style={{position: 'absolute', left: 4, top: 6, width: 15, height: 2.5, borderRadius: 1, backgroundColor: P.woodLo}} />
        <div style={{position: 'absolute', left: 4, top: 11, width: 12, height: 2.5, borderRadius: 1, backgroundColor: P.kraftLo}} />
        <div style={{position: 'absolute', left: 4, top: 16, width: 14, height: 2.5, borderRadius: 1, backgroundColor: P.kraftLo}} />
        <Disc x={17} y={23} d={6} color={P.terra} />
      </Slab>
    </div>
  );
};

// Figur kertas faceless (tanpa mata, hidung, mulut, alis, telinga) dengan peran lewat atribut
const FacelessMiniFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  role: 'formal' | 'sliding-worker' | 'day-laborer' | 'vendor';
  slump?: number;
  holdingContract?: boolean;
}> = ({x, y, s = 0.56, role, slump = 0, holdingContract = false}) => {
  const tilt = slump * -10;
  const shirtColor =
    role === 'formal'
      ? P.sage
      : role === 'sliding-worker'
        ? P.kraftLo
        : role === 'day-laborer'
          ? P.wood
          : P.brick;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 80 * s,
        height: 168 * s,
        transform: `translate(-50%, -100%) rotate(${tilt}deg)`,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
      }}
    >
      <Paper lift={3}>
        {/* Kaki */}
        <Slab x={20 * s} y={124 * s} w={16 * s} h={42 * s} color={P.inkSoft} r={4 * s} />
        <Slab x={44 * s} y={124 * s} w={16 * s} h={42 * s} color={P.inkSoft} r={4 * s} />

        {/* Badan */}
        <Slab
          x={14 * s}
          y={52 * s}
          w={52 * s}
          h={76 * s}
          color={shirtColor}
          shade={P.floorLo}
          shadeH={0.22}
          r={9 * s}
        />

        {/* Atribut peran: celemek pedagang warung */}
        {role === 'vendor' ? (
          <Slab
            x={20 * s}
            y={64 * s}
            w={40 * s}
            h={56 * s}
            color={P.creamTag}
            shade={P.creamLo}
            shadeH={0.2}
            r={4 * s}
          />
        ) : null}

        {/* Atribut peran: tas kain selempang pekerja harian */}
        {role === 'day-laborer' ? (
          <>
            <Slab
              x={22 * s}
              y={54 * s}
              w={10 * s}
              h={68 * s}
              color={P.creamTag}
              r={2 * s}
              rot={18}
            />
            <Slab
              x={4 * s}
              y={88 * s}
              w={30 * s}
              h={34 * s}
              color={P.terra}
              shade={P.terraLo}
              shadeH={0.28}
              r={6 * s}
              rot={-6}
            />
          </>
        ) : null}

        {/* Kepala bulat polos TANPA wajah (faceless) */}
        <Disc
          x={40 * s}
          y={28 * s + slump * 5 * s}
          d={42 * s}
          color={P.creamTag}
          shade={P.creamLo}
        />

        {/* Helm kuning pekerja pabrik */}
        {role === 'sliding-worker' || role === 'formal' ? (
          <>
            <Slab
              x={15 * s}
              y={4 * s + slump * 4 * s}
              w={50 * s}
              h={20 * s}
              color={P.mustardHi}
              shade={P.mustard}
              shadeH={0.3}
              r={`${24 * s}px ${24 * s}px ${4 * s}px ${4 * s}px`}
            />
            <Slab
              x={10 * s}
              y={21 * s + slump * 4 * s}
              w={60 * s}
              h={6 * s}
              color={P.mustard}
              r={3 * s}
            />
          </>
        ) : null}

        {/* Lembar kontrak mungil di tangan figur pekerja formal */}
        {holdingContract ? (
          <TinyContractSheet x={68 * s} y={84 * s} rot={8} scale={s * 1.35} />
        ) : null}
      </Paper>
    </div>
  );
};

// Blok bangunan rapi dengan jendela menyala hangat di dataran tengah
const FormalCityBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  roofColor: string;
  wallColor: string;
  warmGlow: number;
}> = ({x, y, w, h, roofColor, wallColor, warmGlow}) => {
  const cols = Math.max(2, Math.floor((w - 20) / 28));
  const rows = Math.max(2, Math.floor((h - 28) / 28));

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <Paper lift={5}>
        {/* Bayangan jatuh blok bangunan */}
        <Slab x={6} y={8} w={w} h={h} color={P.floorLo} r={5} style={{opacity: 0.35}} />
        {/* Dinding blok rapi */}
        <Slab x={0} y={14} w={w} h={h - 14} color={wallColor} shade={P.kraftLo} shadeH={0.22} r={4}>
          {/* Jendela-jendela menyala hangat (mustard/krem hangat, tanpa biru) */}
          {Array.from({length: rows}).map((_, rIdx) =>
            Array.from({length: cols}).map((__, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  position: 'absolute',
                  left: 12 + cIdx * 26,
                  top: 12 + rIdx * 24,
                  width: 16,
                  height: 16,
                  borderRadius: 2,
                  backgroundColor: P.mustardHi,
                  border: `1.5px solid ${P.woodLo}`,
                  boxShadow: `0 0 ${8 + warmGlow * 10}px rgba(242, 198, 90, ${0.55 + warmGlow * 0.35})`,
                }}
              />
            )),
          )}
        </Slab>
        {/* Atap tampak atas miring */}
        <Slab x={-4} y={0} w={w + 8} h={22} color={roofColor} hi={P.terraHi} hiH={0.22} shade={P.terraLo} shadeH={0.28} r={4} />
      </Paper>
    </div>
  );
};

// Papan lantai kraft kecil di dataran tengah (bersinar) vs garis hantu putus-putus di luar dataran
const MiniKraftPlank: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  ghost?: boolean;
  glow?: number;
  opacity?: number;
}> = ({x, y, w, h, ghost = false, glow = 0, opacity = 1}) => {
  if (opacity <= 0.01) return null;

  if (ghost) {
    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          transform: 'translate(-50%, -50%)',
          opacity,
          pointerEvents: 'none',
        }}
      >
        <svg width={w + 24} height={h + 24} viewBox={`-12 -12 ${w + 24} ${h + 24}`}>
          <rect
            x={0}
            y={0}
            width={w}
            height={h}
            rx={6}
            fill="rgba(244, 236, 224, 0.14)"
            stroke={P.woodLo}
            strokeWidth={3}
            strokeDasharray="9 7"
          />
          <line
            x1={10}
            y1={8}
            x2={w - 10}
            y2={8}
            stroke={P.terraLo}
            strokeWidth={2}
            strokeDasharray="6 6"
          />
          <line
            x1={10}
            y1={h - 8}
            x2={w - 10}
            y2={h - 8}
            stroke={P.terraLo}
            strokeWidth={2}
            strokeDasharray="6 6"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: 'translate(-50%, -50%)',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* Pendar hangat papan lantai kraft di dataran tengah */}
      {glow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: '-18px -24px',
            borderRadius: 20,
            background: `radial-gradient(ellipse at 50% 50%, rgba(242,198,90,${0.65 * glow}) 0%, rgba(221,163,52,0) 72%)`,
          }}
        />
      ) : null}
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={w}
          h={h}
          color={P.kraft}
          hi={P.kraftHi}
          hiH={0.22}
          shade={P.kraftLo}
          shadeH={0.26}
          r={6}
        >
          {/* Tepi atas berjahit garis putus-putus (identitas tetap papan lantai kraft) */}
          <svg width={w} height={14} viewBox={`0 0 ${w} 14`} style={{position: 'absolute', left: 0, top: 2}}>
            <line
              x1={10}
              y1={6}
              x2={w - 10}
              y2={6}
              stroke={P.kraftStitch}
              strokeWidth={3}
              strokeDasharray="9 6"
              strokeLinecap="round"
            />
          </svg>
          {/* Benang mustard bertitik halus melintang di atas papan */}
          <svg width={w} height={14} viewBox={`0 0 ${w} 14`} style={{position: 'absolute', left: 0, bottom: 3}}>
            <line
              x1={10}
              y1={7}
              x2={w - 10}
              y2={7}
              stroke={P.mustardHi}
              strokeWidth={3}
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
          </svg>
        </Slab>
      </Paper>
    </div>
  );
};

// Pagar kertas tipis yang melingkari dataran tengah (Beat c)
const PaperFenceRing: React.FC<{
  progress: number;
  w: number;
  h: number;
}> = ({progress, w, h}) => {
  if (progress <= 0.01) return null;
  const postsTop = 11;
  const postsSide = 6;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        pointerEvents: 'none',
        opacity: interpolate(progress, [0, 0.2], [0, 1], CLAMP),
      }}
    >
      {/* Rel pagar kertas mengelilingi tepi dataran tengah */}
      <svg
        width={w + 24}
        height={h + 24}
        viewBox={`-12 -12 ${w + 24} ${h + 24}`}
        style={{position: 'absolute', left: -12, top: -12, filter: 'drop-shadow(1px 3px 4px rgba(54,34,26,0.32))'}}
      >
        <rect
          x={4}
          y={4}
          width={w - 8}
          height={h - 8}
          rx={10}
          fill="none"
          stroke={P.creamTag}
          strokeWidth={5}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 * (1 - progress)}
        />
        <rect
          x={4}
          y={4}
          width={w - 8}
          height={h - 8}
          rx={10}
          fill="none"
          stroke={P.woodLo}
          strokeWidth={1.8}
           strokeDasharray="8 6"
          pathLength={100}
          strokeDashoffset={100 * (1 - progress)}
        />
      </svg>

      {/* Tiang-tiang pagar kertas pop-up di sekeliling tepi */}
      {Array.from({length: postsTop}).map((_, i) => {
        const threshold = (i / postsTop) * 0.85;
        const postScale = interpolate(progress, [threshold, threshold + 0.15], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.8)),
        });
        const px = 16 + (i * (w - 32)) / (postsTop - 1);
        return (
          <React.Fragment key={`tb-${i}`}>
            <div
              style={{
                position: 'absolute',
                left: px - 4,
                top: -10,
                width: 8,
                height: 22,
                backgroundColor: P.creamTag,
                border: `1.5px solid ${P.woodLo}`,
                borderRadius: '4px 4px 1px 1px',
                transform: `scaleY(${postScale})`,
                transformOrigin: '50% 100%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: px - 4,
                bottom: -6,
                width: 8,
                height: 22,
                backgroundColor: P.creamTag,
                border: `1.5px solid ${P.woodLo}`,
                borderRadius: '4px 4px 1px 1px',
                transform: `scaleY(${postScale})`,
                transformOrigin: '50% 100%',
              }}
            />
          </React.Fragment>
        );
      })}

      {Array.from({length: postsSide}).map((_, i) => {
        const threshold = 0.2 + (i / postsSide) * 0.65;
        const postScale = interpolate(progress, [threshold, threshold + 0.15], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.8)),
        });
        const py = 28 + (i * (h - 56)) / Math.max(1, postsSide - 1);
        return (
          <React.Fragment key={`lr-${i}`}>
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: py - 10,
                width: 8,
                height: 22,
                backgroundColor: P.creamTag,
                border: `1.5px solid ${P.woodLo}`,
                borderRadius: '4px 4px 1px 1px',
                transform: `scaleY(${postScale})`,
                transformOrigin: '50% 100%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -6,
                top: py - 10,
                width: 8,
                height: 22,
                backgroundColor: P.creamTag,
                border: `1.5px solid ${P.woodLo}`,
                borderRadius: '4px 4px 1px 1px',
                transform: `scaleY(${postScale})`,
                transformOrigin: '50% 100%',
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Gerobak kayu pedagang & lapak usaha kecil di luar pagar (Beat d)
const StreetCartPopup: React.FC<{
  x: number;
  y: number;
  at: number;
  seed: string;
}> = ({x, y, at, seed}) => {
  const f = useCurrentFrame();
  if (f < at) return null;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 118, height: 92, transform: 'translate(-50%, -50%)'}}>
      <PopIn at={at} seed={seed} origin="50% 90%">
        <Paper lift={4}>
          {/* Atap tenda terpal kertas */}
          <Slab x={6} y={0} w={106} h={24} color={P.terra} hi={P.terraHi} hiH={0.25} shade={P.terraLo} shadeH={0.3} r={4} />
          {/* Tiang penyangga gerobak */}
          <Slab x={14} y={22} w={6} h={30} color={P.woodLo} r={1} />
          <Slab x={98} y={22} w={6} h={30} color={P.woodLo} r={1} />
          {/* Badan gerobak kayu */}
          <Slab x={8} y={46} w={96} h={32} color={P.kraft} shade={P.wood} shadeH={0.32} r={4}>
            {/* Tumpukan barang dagangan kertas abstrak */}
            <Slab x={12} y={-10} w={20} h={12} color={P.mustardHi} r={2} />
            <Slab x={36} y={-12} w={22} h={14} color={P.sageHi} r={2} />
            <Slab x={62} y={-9} w={18} h={11} color={P.creamTag} r={2} />
          </Slab>
          {/* Gagang dorong gerobak */}
          <Slab x={100} y={50} w={18} h={6} color={P.woodLo} r={2} />
          {/* Roda kayu polos tanpa jari-jari berangka */}
          <Disc x={28} y={78} d={24} color={P.woodLo} shade={P.floorLo} />
          <Disc x={28} y={78} d={10} color={P.creamCard} />
          <Disc x={82} y={78} d={24} color={P.woodLo} shade={P.floorLo} />
          <Disc x={82} y={78} d={10} color={P.creamCard} />
        </Paper>
      </PopIn>
    </div>
  );
};

// Kios kecil yang digambar hanya sebagai garis putus-putus tak berisi ("tidak tercatat", Beat d)
const DashedUnrecordedKiosk: React.FC<{
  x: number;
  y: number;
  at: number;
  seed: string;
}> = ({x, y, at, seed}) => {
  const f = useCurrentFrame();
  if (f < at) return null;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 124, height: 102, transform: 'translate(-50%, -50%)'}}>
      <PopIn at={at} seed={seed} origin="50% 85%">
        <svg width={136} height={114} viewBox="-6 -6 136 114" style={{overflow: 'visible'}}>
          {/* Atap trapesium garis putus-putus tak berisi */}
          <polygon
            points="12,0 112,0 124,28 0,28"
            fill="rgba(244, 236, 224, 0.08)"
            stroke={P.woodLo}
            strokeWidth={3}
            strokeDasharray="8 6"
          />
          {/* Dinding kios garis putus-putus tak berisi */}
          <rect
            x={10}
            y={28}
            width={104}
            height={70}
            rx={4}
            fill="rgba(244, 236, 224, 0.06)"
            stroke={P.woodLo}
            strokeWidth={3}
            strokeDasharray="8 6"
          />
          {/* Jendela/meja layanan kios garis putus-putus */}
          <rect
            x={24}
            y={42}
            width={76}
            height={30}
            rx={3}
            fill="none"
            stroke={P.terraLo}
            strokeWidth={2.2}
            strokeDasharray="6 5"
          />
        </svg>
      </PopIn>
    </div>
  );
};

export const MGD: React.FC = () => {
  const rawF = useCurrentFrame();
  const f = stepFrame(rawF, 2);

  // =========================================================================
  // DISTRIBUSI JENDELA BEAT (0..881 frame @30fps, urut sesuai narasi):
  // Beat a [0–160]:   "Ke pekerjaan informal, tanpa kontrak, tanpa jaminan,"
  // Beat b [160–295]: "tanpa upah minimum yang melindunginya."
  // Beat c [295–415]: "Upah minimum hanya mengikat pekerjaan formal."
  // Beat d [415–575]: "Ia tidak menjangkau pekerja informal, pekerja harian, dan usaha kecil yang tidak tercatat."
  // Beat e [575–735]: "Ketika lantainya naik terlalu tinggi, jurang antara yang di dalam dan yang di luar justru melebar."
  // Beat f [735–881]: "Yang di dalam, lebih sejahtera. Yang di luar, lebih jauh dari perlindungan." (+ lipatan buku)
  // =========================================================================

  // Beat a: Kamera naik ke tampak atas peta kota kertas berlapis + tirai terangkat di awal
  const curtainLift = interpolate(f, [0, 28], [0, -720], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const mapTiltIn = interpolate(f, [0, 56], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const camScale = interpolate(f, [0, 56, 735], [1.14, 1, 1.03], CLAMP);
  const camPitchDeg = interpolate(mapTiltIn, [0, 1], [18, 0], CLAMP);

  // Pekerja dari MG-C meluncur melewati tepi dataran tengah (x: 520, y: 350) ke lapisan luar kiri-bawah (x: 215, y: 495)
  const slideProg = interpolate(f, [32, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const workerBaseX = interpolate(slideProg, [0, 1], [500, 224], CLAMP);
  const workerBaseY = interpolate(slideProg, [0, 1], [348, 492], CLAMP);
  const workerSlump = interpolate(f, [64, 110, 620, 760], [0, 0.55, 0.65, 1], CLAMP);

  // Lembar kontrak mungil di tangannya terlepas dan terbang menjauh di Beat a
  const contractFly = interpolate(f, [52, 134], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const contractX = interpolate(contractFly, [0, 1], [430, 145], CLAMP);
  const contractY =
    interpolate(contractFly, [0, 1], [360, 195], CLAMP) -
    Math.sin(contractFly * Math.PI * 2) * 28;
  const contractRot = -8 + contractFly * 125;
  const contractOp =
    interpolate(f, [36, 48], [0, 1], CLAMP) *
    interpolate(f, [118, 142], [1, 0], CLAMP);

  // Beat b: Papan lantai kraft kecil bersinar di dataran tengah & garis hantu putus-putus di luar dataran
  const innerPlankGlow = interpolate(f, [160, 196, 735, 790], [0.25, 0.9, 0.9, 1], CLAMP);
  const ghostPlankOp = interpolate(f, [172, 206], [0, 0.95], CLAMP);

  // Beat c: Pagar kertas tipis melingkari dataran tengah
  const fenceProg = interpolate(f, [298, 366], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Beat e: Dataran tengah naik di atas penyangga kertas, bayangan memanjang, lapisan luar merosot & celah retak melebar
  const plateauRiseProg = interpolate(f, [580, 668], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const plateauLiftY = Math.round(plateauRiseProg * -58);
  const supportPillarH = Math.round(18 + plateauRiseProg * 68);
  const shadowReach = Math.round(18 + plateauRiseProg * 64);
  const outerSinkY = Math.round(plateauRiseProg * 22);
  const chasmWidth = Math.round(interpolate(f, [588, 684], [0, 38], CLAMP));

  // Beat f: Bagian dalam hangat & terang, bagian luar redup & menjauh ke tepi bingkai, lalu peta melipat tertutup seperti buku
  const finalContrast = interpolate(f, [735, 785], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const outerDriftOut = Math.round(finalContrast * 36);
  const outerDimOp = interpolate(finalContrast, [0, 1], [0, 0.42], CLAMP);
  const innerWarmBoost = interpolate(finalContrast, [0, 1], [0.35, 1], CLAMP);

  // Lipatan peta tertutup seperti buku di penghujung adegan (frame 832..881)
  const bookFoldProg = interpolate(f, [832, 876], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Ukuran & posisi dataran kraft tengah (lantai dilihat dari atas)
  const platW = 540;
  const platH = 330;
  const platLeft = 640 - platW / 2;
  const platTop = 195 + plateauLiftY;

  // Poligon tepi bergerigi dataran kraft tengah (efek sobekan/potongan kertas bergerigi)
  const jaggedClip =
    'polygon(0% 4%, 6% 0%, 14% 3%, 23% 0%, 33% 2%, 44% 0%, 55% 3%, 66% 0%, 77% 2%, 88% 0%, 95% 3%, 100% 2%, ' +
    '98% 15%, 100% 30%, 98% 46%, 100% 62%, 98% 78%, 100% 94%, ' +
    '93% 100%, 82% 97%, 71% 100%, 59% 98%, 48% 100%, 36% 97%, 24% 100%, 12% 98%, 3% 100%, ' +
    '0% 88%, 2% 72%, 0% 56%, 2% 40%, 0% 24%)';

  return (
    <AbsoluteFill style={{backgroundColor: P.creamBg}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={MGD_DUR}
          yaw={8}
          push={1.04}
          focus={0.5}
          depth={520}
          origin={[640, 360]}
        >
          {/* LAPISAN 0: Lapisan Luar Peta Kota (lebih rendah, kertas lebih tipis dan kusut) */}
          <Depth z={0.18} cover>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `perspective(1200px) rotateX(${camPitchDeg}deg) scale(${camScale})`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* Dasar kertas tipis luar */}
              <Slab x={-60} y={-50} w={1400} h={820} color={P.creamCard} r={0} grain={0.65} />

              {/* Lipatan-lipatan kusut kertas di lapisan luar (bergeser merosot & menjauh pada Beat e & f) */}
              <Boil seed="outer-crumple" amp={0.4} rot={0.05}>
                {/* Sayap luar kiri */}
                <div
                  style={{
                    position: 'absolute',
                    left: -outerDriftOut,
                    top: outerSinkY,
                    width: 640,
                    height: 720,
                  }}
                >
                  <Slab
                    x={34}
                    y={68}
                    w={330}
                    h={560}
                    color={P.creamLo}
                    shade={P.kraftLo}
                    shadeH={0.08}
                    rot={-2.2}
                    r={6}
                    style={{filter: 'url(#torn)', opacity: 0.72}}
                  />
                  {/* Garis-garis kusut kertas tipis */}
                  <svg width={520} height={680} style={{position: 'absolute', left: 10, top: 20, opacity: 0.42}}>
                    <polyline
                      points="40,90 150,130 95,240 210,310 130,430 250,520 120,610"
                      fill="none"
                      stroke={P.woodLo}
                      strokeWidth={2}
                      strokeDasharray="10 6"
                    />
                    <polyline
                      points="260,70 190,190 290,260 180,390 280,470"
                      fill="none"
                      stroke={P.kraftLo}
                      strokeWidth={1.8}
                    />
                  </svg>
                </div>

                {/* Sayap luar kanan */}
                <div
                  style={{
                    position: 'absolute',
                    left: 640 + outerDriftOut,
                    top: outerSinkY,
                    width: 640,
                    height: 720,
                  }}
                >
                  <Slab
                    x={270}
                    y={74}
                    w={336}
                    h={556}
                    color={P.creamLo}
                    shade={P.kraftLo}
                    shadeH={0.08}
                    rot={2.4}
                    r={6}
                    style={{filter: 'url(#torn)', opacity: 0.72}}
                  />
                  <svg width={520} height={680} style={{position: 'absolute', left: 110, top: 20, opacity: 0.42}}>
                    <polyline
                      points="420,85 310,145 385,250 275,330 365,450 260,545 390,615"
                      fill="none"
                      stroke={P.woodLo}
                      strokeWidth={2}
                      strokeDasharray="10 6"
                    />
                    <polyline
                      points="210,80 290,200 195,280 300,400 220,500"
                      fill="none"
                      stroke={P.kraftLo}
                      strokeWidth={1.8}
                    />
                  </svg>
                </div>
              </Boil>

              {/* Redup bagian luar pada Beat f ("Yang di luar, lebih jauh dari perlindungan") */}
              {outerDimOp > 0.01 ? (
                <AbsoluteFill
                  style={{
                    background:
                      'radial-gradient(ellipse 36% 32% at 50% 44%, rgba(54,34,26,0) 0%, rgba(54,34,26,0.15) 68%, rgba(54,34,26,0.68) 100%)',
                    opacity: outerDimOp,
                    pointerEvents: 'none',
                  }}
                />
              ) : null}
            </div>
          </Depth>

          {/* LAPISAN 0.5: Celah Jurang, Dataran Kraft Tengah, Penyangga Kertas, Elemen Luar & Dalam */}
          <Depth z={0.5}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `perspective(1200px) rotateX(${camPitchDeg}deg) scale(${camScale})`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* ============================================================= */}
              {/* 1. CELAH KERTAS RETAK ("JURANG") DI SEKELILING DATARAN TENGAH */}
              {/* ============================================================= */}
              {chasmWidth > 1 ? (
                <Boil seed="chasm-ring" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: platLeft - chasmWidth,
                      top: 195 - chasmWidth * 0.65 + outerSinkY * 0.4,
                      width: platW + chasmWidth * 2,
                      height: platH + chasmWidth * 1.65,
                      backgroundColor: P.floorLo,
                      clipPath: jaggedClip,
                      boxShadow: 'inset 0 12px 24px rgba(28,27,23,0.65)',
                      border: `3px dashed ${P.woodLo}`,
                    }}
                  >
                    {/* Lapisan kedalaman jurang kertas */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 10,
                        backgroundColor: P.ink,
                        clipPath: jaggedClip,
                        opacity: 0.78,
                      }}
                    />
                  </div>
                </Boil>
              ) : null}

              {/* ============================================================= */}
              {/* 2. BAYANGAN PANJANG & PENYANGGA KERTAS DI BAWAH DATARAN TENGAH */}
              {/* ============================================================= */}
              {/* Bayangan dataran tengah yang memanjang ke lapisan luar saat naik di Beat e */}
              <div
                style={{
                  position: 'absolute',
                  left: platLeft - shadowReach * 0.45,
                  top: 195 + shadowReach * 0.85,
                  width: platW + shadowReach * 0.9,
                  height: platH + shadowReach * 0.55,
                  backgroundColor: 'rgba(54, 34, 26, 0.34)',
                  clipPath: jaggedClip,
                  filter: `blur(${4 + Math.round(plateauRiseProg * 8)}px)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Tiang-tiang penyangga kertas lipat akordion di bawah dataran tengah */}
              <Paper lift={5}>
                {[platLeft + 56, platLeft + 190, platLeft + 324, platLeft + 448].map((px, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: px,
                      top: platTop + platH - 14,
                      width: 38,
                      height: supportPillarH,
                    }}
                  >
                    <Slab
                      x={0}
                      y={0}
                      w={38}
                      h={supportPillarH}
                      color={P.wood}
                      shade={P.floorLo}
                      shadeH={0.35}
                      r={3}
                    >
                      {/* Garis lipatan penyangga kertas */}
                      {[0.25, 0.5, 0.75].map((ratio, rIdx) => (
                        <div
                          key={rIdx}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: `${ratio * 100}%`,
                            width: '100%',
                            height: 2,
                            backgroundColor: P.floorLo,
                          }}
                        />
                      ))}
                    </Slab>
                  </div>
                ))}

                {/* Dinding tebing kertas di bawah tepi depan dataran tengah */}
                <Slab
                  x={platLeft + 14}
                  y={platTop + platH - 18}
                  w={platW - 28}
                  h={supportPillarH}
                  color={P.kraftLo}
                  shade={P.woodLo}
                  shadeH={0.42}
                  r={4}
                  style={{clipPath: jaggedClip}}
                />
              </Paper>

              {/* ============================================================= */}
              {/* 3. DATARAN KRAFT TENGAH (TINGGI, TEPI BERGERIGI, HANGAT)      */}
              {/* ============================================================= */}
              <Boil seed="central-plateau" amp={0.4} rot={0.05}>
                <div
                  style={{
                    position: 'absolute',
                    left: platLeft,
                    top: platTop,
                    width: platW,
                    height: platH,
                  }}
                >
                  {/* Pendar hangat bagian dalam (menguat di Beat f) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-36px -44px',
                      background: `radial-gradient(ellipse at 50% 50%, rgba(242,198,90,${0.32 + innerWarmBoost * 0.38}) 0%, rgba(221,163,52,0) 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Lapisan ketebalan dataran kraft */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 10,
                      width: platW,
                      height: platH,
                      backgroundColor: P.kraftEdge,
                      clipPath: jaggedClip,
                    }}
                  />

                  {/* Permukaan utama dataran kraft dengan tepi bergerigi */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: P.kraft,
                      backgroundImage: `url(${GRAIN})`,
                      backgroundSize: '480px',
                      backgroundBlendMode: 'multiply',
                      clipPath: jaggedClip,
                      boxShadow: 'inset 0 0 28px rgba(242, 198, 90, 0.35)',
                    }}
                  >
                    {/* Jahitan putus-putus khas papan lantai kraft di sekeliling tepi dalam dataran */}
                    <svg width={platW} height={platH} style={{position: 'absolute', inset: 0}}>
                      <rect
                        x={16}
                        y={16}
                        width={platW - 32}
                        height={platH - 32}
                        rx={8}
                        fill="none"
                        stroke={P.kraftStitch}
                        strokeWidth={2.5}
                        strokeDasharray="12 8"
                        opacity={0.75}
                      />
                    </svg>

                    {/* Jalan peta kota rapi di dataran tengah */}
                    <Slab x={30} y={154} w={platW - 60} h={22} color={P.creamCard} shade={P.creamLo} shadeH={0.25} r={3} />
                    <Slab x={256} y={26} w={26} h={platH - 52} color={P.creamCard} shade={P.creamLo} shadeH={0.25} r={3} />

                    {/* Blok-blok bangunan rapi dengan jendela menyala hangat */}
                    <FormalCityBlock
                      x={46}
                      y={34}
                      w={118}
                      h={106}
                      roofColor={P.terra}
                      wallColor={P.creamTag}
                      warmGlow={innerWarmBoost}
                    />
                    <FormalCityBlock
                      x={176}
                      y={42}
                      w={72}
                      h={98}
                      roofColor={P.sageLo}
                      wallColor={P.creamCard}
                      warmGlow={innerWarmBoost}
                    />
                    <FormalCityBlock
                      x={300}
                      y={32}
                      w={114}
                      h={108}
                      roofColor={P.brick}
                      wallColor={P.creamTag}
                      warmGlow={innerWarmBoost}
                    />
                    <FormalCityBlock
                      x={424}
                      y={46}
                      w={72}
                      h={94}
                      roofColor={P.terraLo}
                      wallColor={P.creamCard}
                      warmGlow={innerWarmBoost}
                    />

                    {/* Pepohonan kertas hijau sage di taman kota formal */}
                    <Disc x={76} y={214} d={28} color={P.sageHi} shade={P.sageLo} />
                    <Disc x={102} y={224} d={22} color={P.sage} shade={P.sageLo} />
                    <Disc x={456} y={218} d={28} color={P.sageHi} shade={P.sageLo} />
                    <Disc x={432} y={228} d={22} color={P.sage} shade={P.sageLo} />

                    {/* Figur-figur kecil pekerja formal (faceless) memegang lembar kontrak mungil */}
                    <FacelessMiniFigure
                      x={152}
                      y={246}
                      s={0.44}
                      role="formal"
                      holdingContract
                    />
                    <FacelessMiniFigure
                      x={218}
                      y={252}
                      s={0.44}
                      role="formal"
                      holdingContract
                    />
                    <FacelessMiniFigure
                      x={386}
                      y={248}
                      s={0.44}
                      role="formal"
                      holdingContract
                    />

                    {/* Beat b: Papan lantai kraft kecil yang bersinar di dataran tengah */}
                    <MiniKraftPlank
                      x={298}
                      y={242}
                      w={144}
                      h={40}
                      glow={innerPlankGlow}
                      opacity={1}
                    />
                  </div>

                  {/* Beat c: Pagar kertas tipis melingkari dataran tengah */}
                  <PaperFenceRing progress={fenceProg} w={platW} h={platH} />
                </div>
              </Boil>

              {/* ============================================================= */}
              {/* 4. ELEMEN DI LUAR DATARAN (KIRI & KANAN, LAPISAN RENDAH)      */}
              {/* ============================================================= */}
              {/* Sisi Kiri Luar: Pekerja dari MG-C meluncur keluar, garis hantu papan lantai, pekerja harian */}
              <div
                style={{
                  position: 'absolute',
                  left: -outerDriftOut,
                  top: outerSinkY,
                  width: 1280,
                  height: 720,
                  pointerEvents: 'none',
                }}
              >
                {/* Beat b: Papan lantai digambar hanya sebagai garis hantu putus-putus di luar dataran */}
                <MiniKraftPlank
                  x={224}
                  y={488}
                  w={156}
                  h={48}
                  ghost
                  opacity={ghostPlankOp}
                />

                {/* Pekerja dari MG-C yang meluncur melewati tepi dataran ke lapisan luar dan berdiri di dalam garis hantu */}
                <FacelessMiniFigure
                  x={workerBaseX}
                  y={workerBaseY}
                  s={0.56}
                  role="sliding-worker"
                  slump={workerSlump}
                />

                {/* Lembar kontrak mungil yang terlepas dari tangannya dan terbang */}
                <TinyContractSheet
                  x={contractX}
                  y={contractY}
                  rot={contractRot}
                  scale={1.15}
                  opacity={contractOp}
                />

                {/* Beat d: Pekerja harian dengan tas kain (pop-up di luar pagar, sisi kiri atas) */}
                {f >= 418 ? (
                  <PopIn at={418} seed="pop-day-laborer" origin="18% 38%">
                    <FacelessMiniFigure
                      x={198}
                      y={282}
                      s={0.54}
                      role="day-laborer"
                      slump={0.25 + finalContrast * 0.35}
                    />
                  </PopIn>
                ) : null}
              </div>

              {/* Sisi Kanan Luar: Pedagang gerobak ("usaha kecil") & kios garis putus-putus ("tidak tercatat") */}
              <div
                style={{
                  position: 'absolute',
                  left: outerDriftOut,
                  top: outerSinkY,
                  width: 1280,
                  height: 720,
                  pointerEvents: 'none',
                }}
              >
                {/* Beat d: Gerobak dan pedagang warung bercelemek ("usaha kecil") */}
                <StreetCartPopup x={1048} y={258} at={424} seed="pop-cart" />
                {f >= 426 ? (
                  <PopIn at={426} seed="pop-vendor" origin="86% 38%">
                    <FacelessMiniFigure
                      x={1132}
                      y={292}
                      s={0.52}
                      role="vendor"
                      slump={0.2 + finalContrast * 0.3}
                    />
                  </PopIn>
                ) : null}

                {/* Beat d: Kios kecil yang digambar hanya sebagai garis putus-putus tak berisi ("tidak tercatat") */}
                <DashedUnrecordedKiosk x={1056} y={472} at={432} seed="pop-kiosk" />
              </div>

              {/* ============================================================= */}
              {/* 5. LABEL KERTAS (HANYA DARI DAFTAR "TEKS BOLEH TAMPIL" MG-D)  */}
              {/* ============================================================= */}
              {/* Beat a [0–160]: "pekerjaan informal", "tanpa kontrak", "tanpa jaminan" */}
              <PaperLabel
                x={210 - outerDriftOut}
                y={368 + outerSinkY}
                text="pekerjaan informal"
                at={58}
                outAt={412}
                bg={P.kraftHi}
                size={23}
                rot={-1.8}
                seed="lbl-informal"
              />
              <PaperLabel
                x={168 - outerDriftOut}
                y={558 + outerSinkY}
                text="tanpa kontrak"
                at={88}
                outAt={412}
                bg={P.creamTag}
                size={22}
                rot={1.4}
                seed="lbl-kontrak"
              />
              <PaperLabel
                x={252 - outerDriftOut}
                y={622 + outerSinkY}
                text="tanpa jaminan"
                at={116}
                outAt={412}
                bg={P.creamTag}
                size={22}
                rot={-1.2}
                seed="lbl-jaminan"
              />

              {/* Beat b [160–295]: "tanpa upah minimum" */}
              <PaperLabel
                x={216 - outerDriftOut}
                y={564 + outerSinkY}
                text="tanpa upah minimum"
                at={182}
                outAt={572}
                bg={P.terra}
                color={P.creamTag}
                size={22}
                rot={-1.5}
                seed="lbl-tanpa-um"
              />

              {/* Beat c [295–415]: "pekerjaan formal" menempel di dalam pagar */}
              <PaperLabel
                x={640}
                y={platTop + 162}
                text="pekerjaan formal"
                at={322}
                outAt={732}
                bg={P.sageHi}
                color={P.ink}
                size={25}
                rot={-0.8}
                seed="lbl-formal"
              />

              {/* Beat d [415–575]: "pekerja harian", "usaha kecil", "tidak tercatat" */}
              <PaperLabel
                x={198 - outerDriftOut}
                y={326 + outerSinkY}
                text="pekerja harian"
                at={416}
                outAt={732}
                bg={P.creamTag}
                size={23}
                rot={-1.6}
                seed="lbl-harian"
              />
              <PaperLabel
                x={1060 + outerDriftOut}
                y={338 + outerSinkY}
                text="usaha kecil"
                at={420}
                outAt={732}
                bg={P.mustardHi}
                size={23}
                rot={1.4}
                seed="lbl-usaha-kecil"
              />
              <PaperLabel
                x={1056 + outerDriftOut}
                y={564 + outerSinkY}
                text="tidak tercatat"
                at={424}
                outAt={732}
                bg={P.terra}
                color={P.creamTag}
                size={23}
                rot={-1.3}
                seed="lbl-tidak-tercatat"
              />

              {/* Beat e [575–735]: "jurang", "yang di dalam", "yang di luar" */}
              <PaperLabel
                x={640}
                y={platTop + platH + 34}
                text="jurang"
                at={612}
                outAt={832}
                bg={P.terra}
                color={P.creamTag}
                size={28}
                rot={-1.2}
                seed="lbl-jurang"
              />
              <PaperLabel
                x={640}
                y={platTop - 28}
                text="yang di dalam"
                at={636}
                outAt={832}
                bg={P.creamTag}
                size={24}
                rot={0.9}
                seed="lbl-dalam"
              />
              <PaperLabel
                x={224 - outerDriftOut}
                y={568 + outerSinkY}
                text="yang di luar"
                at={654}
                outAt={832}
                bg={P.creamTag}
                size={24}
                rot={-1.4}
                seed="lbl-luar"
              />

              {/* Beat f [735–881]: "lebih sejahtera" (di dalam), "lebih jauh dari perlindungan" (di luar) */}
              <PaperLabel
                x={640}
                y={platTop + 162}
                text="lebih sejahtera"
                at={744}
                outAt={836}
                bg={P.mustardHi}
                color={P.ink}
                size={28}
                rot={-0.8}
                seed="lbl-sejahtera"
              />
              <PaperLabel
                x={236 - outerDriftOut * 0.5}
                y={642 + outerSinkY * 0.5}
                text="lebih jauh dari perlindungan"
                at={766}
                outAt={836}
                bg={P.terraLo}
                color={P.creamTag}
                size={24}
                rot={1.2}
                seed="lbl-jauh"
              />
            </div>
          </Depth>

          {/* LAPISAN 1: Bingkai Panggung Kertas, Lipatan Buku Penutup (Beat f), dan Tirai Pembuka */}
          <Depth z={0.85}>
            {/* Sayap panggung kertas terakota kiri & kanan */}
            <Paper lift={7}>
              <Slab x={-22} y={-20} w={68} h={760} color={P.terra} shade={P.terraLo} shadeH={0.15} r="0 0 14px 0" />
              <Slab x={1234} y={-20} w={68} h={760} color={P.terra} shade={P.terraLo} shadeH={0.15} r="0 0 0 14px" />
              <Slab x={-20} y={-16} w={1320} h={30} color={P.terraLo} shade={P.floorLo} shadeH={0.3} r={4} />
              <Slab x={-20} y={694} w={1320} h={36} color={P.floor} shade={P.floorLo} shadeH={0.4} r={0} />
            </Paper>

            {/* Peralihan akhir Beat f: Peta melipat tertutup seperti buku */}
            {bookFoldProg > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 45}}>
                {/* Halaman/sampul buku kiri melipat ke tengah */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 642,
                    height: 720,
                    transformOrigin: '100% 50%',
                    transform: `perspective(1400px) rotateY(${interpolate(bookFoldProg, [0, 1], [-88, 0], CLAMP)}deg)`,
                    opacity: interpolate(bookFoldProg, [0, 0.15], [0, 1], CLAMP),
                    boxShadow: '12px 0 28px rgba(28,27,23,0.45)',
                  }}
                >
                  <Slab x={0} y={0} w={642} h={720} color={P.kraft} shade={P.kraftLo} shadeH={0.22} r={0} grain={0.65}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 28,
                        border: `3px dashed ${P.kraftStitch}`,
                        borderRadius: 8,
                        opacity: 0.65,
                      }}
                    />
                  </Slab>
                </div>

                {/* Halaman/sampul buku kanan melipat ke tengah */}
                <div
                  style={{
                    position: 'absolute',
                    left: 638,
                    top: 0,
                    width: 642,
                    height: 720,
                    transformOrigin: '0% 50%',
                    transform: `perspective(1400px) rotateY(${interpolate(bookFoldProg, [0, 1], [88, 0], CLAMP)}deg)`,
                    opacity: interpolate(bookFoldProg, [0, 0.15], [0, 1], CLAMP),
                    boxShadow: '-12px 0 28px rgba(28,27,23,0.45)',
                  }}
                >
                  <Slab x={0} y={0} w={642} h={720} color={P.kraftLo} shade={P.woodLo} shadeH={0.28} r={0} grain={0.65}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 28,
                        border: `3px dashed ${P.kraftStitch}`,
                        borderRadius: 8,
                        opacity: 0.65,
                      }}
                    />
                  </Slab>
                </div>

                {/* Punggung lipatan buku di garis tengah */}
                <div
                  style={{
                    position: 'absolute',
                    left: 640,
                    top: 0,
                    width: Math.round(bookFoldProg * 28),
                    height: 720,
                    transform: 'translate(-50%, 0)',
                    backgroundColor: P.woodLo,
                    boxShadow: '0 0 18px rgba(28,27,23,0.5)',
                  }}
                />
              </div>
            ) : null}

            {/* Tirai kertas terakota pembuka di awal adegan */}
            {curtainLift > -710 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: curtainLift,
                  width: 1280,
                  height: 700,
                  backgroundColor: P.terra,
                  borderBottom: `10px solid ${P.mustard}`,
                  boxShadow: '0 12px 24px rgba(54,34,26,0.44)',
                  zIndex: 50,
                }}
              />
            ) : null}
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default MGD;
