// Adegan P07: Dinding yang Mendekat — gang sempit menjepit cepat di atas teras rumah sederhana.
// Menampilkan kontras kecepatan jepitan kelas menengah dan kedalaman kerentanan bawah tanpa teks.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {FilmWeave} from '../../lib/paper/look';
import {Boil, Paper, Slab} from './mgkit';

export const P07_DUR = 408;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ALLEY_Y = 465;
const TERRACE_Y = 658;
const BASE_LEFT_EDGE = 240;
const BASE_RIGHT_EDGE = 1040;

const gentleSway = (f: number, period: number, amp: number, phase = 0): number =>
  Math.sin(((f + phase) / period) * Math.PI * 2) * amp;

// Pembungkus paralaks kamera per lapisan kedalaman
const CamLayer: React.FC<{
  z: number;
  camX: number;
  camY: number;
  camZoom: number;
  children: React.ReactNode;
}> = ({z, camX, camY, camZoom, children}) => {
  const moveFactor = 0.68 + z * 0.52;
  const zoomFactor = 0.65 + z * 0.55;
  const tx = camX * moveFactor;
  const ty = camY * moveFactor;
  const sc = 1 + (camZoom - 1) * zoomFactor;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: '640px 360px',
        transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Tokoh utama "kamu": kemeja biru sabak, syal kertas hangat terakota, tas kantor, tanpa wajah
const HeroFigure: React.FC<{x: number; y: number; breathe: number}> = ({x, y, breathe}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 84,
      height: 176,
      translate: '-50% -100%',
      transformOrigin: '50% 100%',
      transform: `rotate(${breathe.toFixed(2)}deg)`,
    }}
  >
    <Paper lift={4}>
      {/* Kaki */}
      <Slab x={22} y={128} w={16} h={48} color={C.inkSoft} r={5} />
      <Slab x={45} y={128} w={16} h={48} color={C.inkSoft} r={5} />
      {/* Kemeja biru sabak */}
      <Slab
        x={16}
        y={54}
        w={52}
        h={78}
        color={ROOM.slate}
        shade="#3A4B5C"
        shadeH={0.22}
        hi="#647B92"
        hiH={0.12}
        r={9}
      />
      {/* Lengan kiri */}
      <Slab x={8} y={58} w={13} h={58} color={ROOM.slate} shade="#3A4B5C" shadeH={0.25} r={6} rot={4} />
      {/* Lengan kanan memegang tas */}
      <Slab x={63} y={58} w={13} h={56} color={ROOM.slate} shade="#3A4B5C" shadeH={0.25} r={6} rot={-3} />
      {/* Syal kertas hangat terakota */}
      <Slab x={22} y={50} w={40} h={14} color={C.hero} shade={C.heroLo} shadeH={0.3} r={6} />
      <Slab x={42} y={60} w={13} h={34} color={C.hero} shade={C.heroLo} shadeH={0.2} r={4} rot={-6} />
      {/* Tas kantor */}
      <Slab x={56} y={108} w={30} h={24} color={C.wood} shade={C.woodLo} shadeH={0.28} r={4} />
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 102,
          width: 12,
          height: 7,
          border: `2.5px solid ${C.woodLo}`,
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 69,
          top: 117,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: C.brass,
        }}
      />
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 4,
          width: 44,
          height: 44,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2.5px solid ${C.inkSoft}`,
          boxShadow: '1px 3px 5px rgba(0,0,0,0.22)',
        }}
      />
    </Paper>
  </div>
);

// Pasangan: berhijab rapi, pakaian hangat, tanpa wajah
const PartnerFigure: React.FC<{x: number; y: number; breathe: number}> = ({x, y, breathe}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 78,
      height: 168,
      translate: '-50% -100%',
      transformOrigin: '50% 100%',
      transform: `rotate(${breathe.toFixed(2)}deg)`,
    }}
  >
    <Paper lift={4}>
      {/* Rok / bawahan */}
      <Slab x={20} y={118} w={38} h={50} color={C.inkSoft} r="4px 4px 8px 8px" />
      {/* Tunik zaitun hangat */}
      <Slab
        x={16}
        y={52}
        w={46}
        h={72}
        color={C.sage}
        shade={C.sageLo}
        shadeH={0.22}
        r="10px 10px 6px 6px"
      />
      {/* Hijab kertas melingkupi kepala dan bahu */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          width: 50,
          height: 58,
          translate: '-50% 0',
          borderRadius: '26px 26px 18px 18px',
          backgroundColor: C.cream,
          border: `2px solid ${C.inkSoft}`,
          boxShadow: '1px 3px 5px rgba(0,0,0,0.2)',
        }}
      />
      {/* Wajah bulat polos tanpa fitur */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10,
          width: 34,
          height: 36,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
        }}
      />
    </Paper>
  </div>
);

// Anak: berseragam sekolah + ransel, tanpa wajah
const ChildFigure: React.FC<{x: number; y: number; breathe: number}> = ({x, y, breathe}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 60,
      height: 126,
      translate: '-50% -100%',
      transformOrigin: '50% 100%',
      transform: `rotate(${breathe.toFixed(2)}deg)`,
    }}
  >
    <Paper lift={4}>
      {/* Kaki */}
      <Slab x={17} y={92} w={11} h={34} color={C.inkSoft} r={4} />
      <Slab x={32} y={92} w={11} h={34} color={C.inkSoft} r={4} />
      {/* Tas sekolah */}
      <Slab x={38} y={44} w={15} h={30} color={ROOM.mustard} shade={C.woodLo} shadeH={0.25} r={5} rot={5} />
      {/* Bawahan seragam */}
      <Slab x={15} y={74} w={30} h={22} color={ROOM.navy} r={4} />
      {/* Atasan seragam */}
      <Slab x={14} y={40} w={32} h={36} color={C.creamHi} shade={C.creamLo} shadeH={0.2} r={7} />
      {/* Kepala bulat polos tanpa wajah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 4,
          width: 32,
          height: 32,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2px solid ${C.inkSoft}`,
          boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </Paper>
  </div>
);

// Teras bawah dengan rumah sederhana dari P06 dan figur bermartabat dalam cahaya hangat
const LowerTerraceHouse: React.FC<{warmth: number; f: number}> = ({warmth, f}) => {
  const elderSway = gentleSway(f, 110, 0.5, 10);
  const childSway = gentleSway(f, 95, 0.6, 35);
  return (
    <div style={{position: 'absolute', left: 500, top: TERRACE_Y - 168, width: 380, height: 172}}>
      {/* Pendaran cahaya hangat rumah sederhana di lantai teras */}
      <div
        style={{
          position: 'absolute',
          left: -40,
          top: 120,
          width: 450,
          height: 62,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, rgba(243,165,59,${(0.32 * warmth).toFixed(2)}) 0%, rgba(243,165,59,0) 72%)`,
        }}
      />
      <Paper lift={5}>
        {/* Badan rumah papan kayu sederhana yang rapi */}
        <Slab
          x={38}
          y={46}
          w={290}
          h={122}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.22}
          hi={C.woodHi}
          hiH={0.1}
          r={4}
          grain={0.75}
        />
        {/* Garis sambungan papan horizontal */}
        {[74, 104, 134].map((py, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 42,
              top: py,
              width: 282,
              height: 2,
              backgroundColor: C.woodLo,
              opacity: 0.65,
            }}
          />
        ))}
        {/* Pintu terbuka dengan cahaya kuning madu hangat */}
        <Slab x={74} y={76} w={54} h={92} color={C.woodLo} r="4px 4px 0 0" />
        <Slab
          x={79}
          y={81}
          w={44}
          h={87}
          color={C.amber}
          hi="#FFE29A"
          hiH={0.35}
          r="3px 3px 0 0"
        />
        {/* Jendela rumah sederhana */}
        <Slab x={156} y={84} w={62} h={46} color={C.woodLo} r={3} />
        <Slab x={161} y={89} w={52} h={36} color={C.amber} hi="#FFE29A" hiH={0.3} r={2} />
        <div style={{position: 'absolute', left: 186, top: 89, width: 3, height: 36, backgroundColor: C.woodLo}} />
        {/* Atap pelana kertas */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 8,
            width: 334,
            height: 46,
            backgroundColor: ROOM.terracotta,
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        />
        <Slab x={12} y={48} w={342} h={8} color={C.woodLo} r={2} />
        {/* Tiang teras & tikar bersih */}
        <Slab x={306} y={54} w={10} h={114} color={C.woodHi} r={2} />
        <Slab x={225} y={160} w={122} h={8} color={C.tape} r={3} />
      </Paper>

      {/* Figur orang tua & anak di teras hangat (bermartabat, tanpa wajah) */}
      <div
        style={{
          position: 'absolute',
          left: 256,
          top: 162,
          width: 48,
          height: 102,
          translate: '-50% -100%',
          transformOrigin: '50% 100%',
          transform: `rotate(${elderSway.toFixed(2)}deg)`,
        }}
      >
        <Paper lift={3}>
          <Slab x={12} y={72} w={24} h={30} color={C.inkSoft} r={4} />
          <Slab x={10} y={32} w={28} h={44} color={ROOM.khaki} shade={C.woodLo} shadeH={0.22} r={7} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 2,
              width: 26,
              height: 26,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </Paper>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 294,
          top: 162,
          width: 38,
          height: 82,
          translate: '-50% -100%',
          transformOrigin: '50% 100%',
          transform: `rotate(${childSway.toFixed(2)}deg)`,
        }}
      >
        <Paper lift={3}>
          <Slab x={10} y={58} w={18} h={24} color={C.inkSoft} r={3} />
          <Slab x={8} y={26} w={22} h={36} color={C.sage} shade={C.sageLo} shadeH={0.2} r={6} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 2,
              width: 22,
              height: 22,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2px solid ${C.inkSoft}`,
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

// Dinding bangunan gang kertas (kiri atau kanan) dengan deretan jendela polos tanpa tulisan
const AlleyBuildingWall: React.FC<{
  side: 'left' | 'right';
  innerX: number;
  baseColor: string;
  trimColor: string;
}> = ({side, innerX, baseColor, trimColor}) => {
  const width = 760;
  const x = side === 'left' ? innerX - width : innerX;
  const winCols = side === 'left' ? [430, 585] : [65, 220];
  const winRows = [64, 174, 284];

  return (
    <div style={{position: 'absolute', left: x, top: -40, width, height: ALLEY_Y + 42}}>
      <Paper lift={8}>
        <Slab
          x={0}
          y={0}
          w={width}
          h={ALLEY_Y + 40}
          color={baseColor}
          shade="rgba(0,0,0,0.16)"
          shadeH={0.08}
          hi="rgba(255,255,255,0.12)"
          hiH={0.06}
          r={2}
          grain={0.7}
        />
        {/* Lis atap dan plint bawah bangunan */}
        <Slab x={0} y={24} w={width} h={16} color={trimColor} r={2} />
        <Slab x={0} y={ALLEY_Y + 12} w={width} h={28} color={C.woodLo} r={0} />
        {/* Pilar tepi dalam */}
        <Slab
          x={side === 'left' ? width - 22 : 0}
          y={0}
          w={22}
          h={ALLEY_Y + 40}
          color={trimColor}
          shade="rgba(0,0,0,0.2)"
          shadeH={0.12}
          r={0}
        />
        {/* Jendela kertas polos tanpa nomor atau teks */}
        {winRows.map((wy, rIdx) =>
          winCols.map((wx, cIdx) => {
            const lit = (rIdx + cIdx) % 2 === 0;
            return (
              <div key={`${rIdx}-${cIdx}`}>
                <Slab x={wx - 6} y={wy - 6} w={92} h={82} color={trimColor} r={4} />
                <Slab
                  x={wx}
                  y={wy}
                  w={80}
                  h={70}
                  color={lit ? '#D8A24A' : '#323D4E'}
                  hi={lit ? '#F5C97B' : undefined}
                  hiH={0.25}
                  r={2}
                />
                {/* Kusen palang polos */}
                <div
                  style={{
                    position: 'absolute',
                    left: wx + 38,
                    top: wy,
                    width: 4,
                    height: 70,
                    backgroundColor: trimColor,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: wx,
                    top: wy + 33,
                    width: 80,
                    height: 4,
                    backgroundColor: trimColor,
                  }}
                />
                <Slab x={wx - 10} y={wy + 72} w={100} h={8} color={C.woodLo} r={2} />
              </div>
            );
          }),
        )}
      </Paper>
    </div>
  );
};

// Panah kertas polos horizontal (menjepit ke dalam pada gang)
const HorizontalPaperArrow: React.FC<{
  dir: 'right' | 'left';
  tipX: number;
  y: number;
  length: number;
  progress: number;
}> = ({dir, tipX, y, length, progress}) => {
  if (progress <= 0.01) return null;
  const curLen = Math.max(24, length * progress);
  const headW = 34;
  const headH = 52;
  const shaftH = 22;
  const shaftW = Math.max(0, curLen - headW);
  const left = dir === 'right' ? tipX - curLen : tipX;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y - headH / 2,
        width: curLen,
        height: headH,
        opacity: interpolate(progress, [0, 0.2], [0, 1], CLAMP),
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.36))',
      }}
    >
      {dir === 'right' ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: (headH - shaftH) / 2,
              width: shaftW + 2,
              height: shaftH,
              backgroundColor: C.tag,
              border: `2px solid ${C.creamHi}`,
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: headW,
              height: headH,
              backgroundColor: C.tag,
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: headW,
              height: headH,
              backgroundColor: C.tag,
              clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: (headH - shaftH) / 2,
              width: shaftW + 2,
              height: shaftH,
              backgroundColor: C.tag,
              border: `2px solid ${C.creamHi}`,
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
            }}
          />
        </>
      )}
    </div>
  );
};

// Panah kertas polos vertikal menunjuk turun ke teras rendah (kedalaman)
const VerticalDownPaperArrow: React.FC<{
  x: number;
  topY: number;
  height: number;
  progress: number;
}> = ({x, topY, height, progress}) => {
  if (progress <= 0.01) return null;
  const curH = Math.max(26, height * progress);
  const headH = 34;
  const headW = 52;
  const shaftW = 22;
  const shaftH = Math.max(0, curH - headH);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - headW / 2,
        top: topY,
        width: headW,
        height: curH,
        opacity: interpolate(progress, [0, 0.2], [0, 1], CLAMP),
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: (headW - shaftW) / 2,
          top: 0,
          width: shaftW,
          height: shaftH + 2,
          backgroundColor: C.amber,
          border: `2px solid ${C.inkSoft}`,
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: headW,
          height: headH,
          backgroundColor: C.amber,
          clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
        }}
      />
    </div>
  );
};

// Penutup transisi pembuka: panel buku pop-up P06 menutup lalu bergeser keluar panggung
const BookClosingCover: React.FC<{f: number}> = ({f}) => {
  if (f > 24) return null;
  const closeU = interpolate(f, [0, 11], [0.22, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const slideOutU = interpolate(f, [10, 24], [0, 1], {...CLAMP, easing: Easing.in(Easing.cubic)});
  const ySlide = slideOutU * 780;
  const spread = (1 - closeU) * 140;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', transform: `translateY(${ySlide.toFixed(1)}px)`}}>
      <Slab
        x={120 - spread}
        y={-20}
        w={520}
        h={760}
        color={C.cream}
        shade={C.creamLo}
        shadeH={0.08}
        r={6}
        grain={0.65}
      />
      <Slab
        x={640 + spread}
        y={-20}
        w={520}
        h={760}
        color={C.creamHi}
        shade={C.creamLo}
        shadeH={0.08}
        r={6}
        grain={0.65}
      />
      {/* Punggung lipatan buku di tengah */}
      <div
        style={{
          position: 'absolute',
          left: 634,
          top: -20,
          width: 12,
          height: 760,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0.06), rgba(0,0,0,0.28))',
          opacity: closeU,
        }}
      />
    </AbsoluteFill>
  );
};

export const P07: React.FC = () => {
  const f = useCurrentFrame();

  // Pergeseran dinding kiri dan kanan mengikuti 5 beat brief P07
  // Beat 1 (0-121): dinding kanan bergeser pelan masuk; Beat 2 (155-230): kedua dinding mendekat jelas;
  // Beat 3 (230-300): dinding berhenti sejenak; Beat 4 (314-358): dinding mendekat cepat lagi;
  // Beat 5 (372-408): dinding berhenti pada celah sempit yang tetap memberi ruang bagi keluarga.
  const leftShift =
    interpolate(f, [155, 230], [0, 155], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [318, 358], [0, 120], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const rightShift =
    interpolate(f, [24, 121], [0, 55], {...CLAMP, easing: Easing.in(Easing.quad)}) +
    interpolate(f, [155, 230], [0, 100], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [318, 358], [0, 120], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const leftInnerX = BASE_LEFT_EDGE + leftShift; // 240 -> 395 -> 515
  const rightInnerX = BASE_RIGHT_EDGE - rightShift; // 1040 -> 985 -> 885 -> 765

  // Koreografi kamera: pan kiri-ke-kanan (B1), dolly-in ke gang (B2), tilt turun ke teras bawah (B3),
  // tilt naik kembali ke gang (B4), pull-out lebar memuat keduanya (B5).
  const camX =
    interpolate(f, [0, 121], [92, -62], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [121, 154], [0, 62], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const camY =
    22 +
    interpolate(f, [155, 230], [0, 46], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [230, 272], [0, -208], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [314, 332], [0, 198], {...CLAMP, easing: Easing.out(Easing.cubic)}) +
    interpolate(f, [370, 394], [0, -64], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const camZoom =
    0.98 +
    interpolate(f, [0, 121], [0, 0.04], CLAMP) +
    interpolate(f, [155, 230], [0, 0.24], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [230, 272], [0, -0.11], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [314, 332], [0, 0.08], {...CLAMP, easing: Easing.out(Easing.cubic)}) +
    interpolate(f, [370, 394], [0, -0.28], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Keluarga merapat lembut saat dinding menyempit, tetap bermartabat dan berpijak
  const squeezeU =
    interpolate(f, [155, 230], [0, 0.62], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) +
    interpolate(f, [318, 358], [0, 0.38], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const heroX = interpolate(squeezeU, [0, 1], [590, 610], CLAMP);
  const childX = interpolate(squeezeU, [0, 1], [642, 644], CLAMP);
  const partnerX = interpolate(squeezeU, [0, 1], [692, 676], CLAMP);

  // Anotasi Beat 5 (panah kertas polos & lingkaran sorot guntingan tangan)
  const arrowProgress = interpolate(f, [374, 394], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const spotOpacity = interpolate(f, [376, 395], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Cahaya hangat rumah sederhana di teras bawah menguat saat tilt turun di Beat 3
  const lowerWarmth =
    0.82 +
    interpolate(f, [230, 265], [0, 0.28], CLAMP) +
    interpolate(f, [314, 335], [0, -0.1], CLAMP);

  // Jejak bayangan dinding saat bergerak cepat di Beat 4 (318-358)
  const trailStrength = interpolate(f, [318, 356], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{backgroundColor: '#595552'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera dur={P07_DUR} yaw={8} push={1.02} origin={[640, 360]}>
          {/* LAPISAN 0: Langit sore menjelang senja keabuan hangat + awan kertas */}
          <Depth z={0} cover>
            <CamLayer z={0} camX={camX} camY={camY} camZoom={camZoom}>
              <div
                style={{
                  position: 'absolute',
                  left: -400,
                  top: -300,
                  width: 2080,
                  height: 1320,
                  background: 'linear-gradient(180deg, #4E5461 0%, #7B746E 44%, #B49F8A 75%, #8C7B6B 100%)',
                }}
              />
              {/* Awan kertas tipis bergerak sangat pelan */}
              <Boil seed="clouds-p07" amp={0.4} rot={0.05}>
                <Slab
                  x={440 + gentleSway(f, 360, 14, 0)}
                  y={84}
                  w={250}
                  h={34}
                  color={C.cream}
                  r={18}
                  grain={0.4}
                />
                <Slab
                  x={610 + gentleSway(f, 360, 12, 80)}
                  y={132}
                  w={210}
                  h={26}
                  color={C.creamLo}
                  r={14}
                  grain={0.4}
                />
              </Boil>
            </CamLayer>
          </Depth>

          {/* LAPISAN 0.28: Teras rendah di bawah & dinding penahan berundak (kedalaman) */}
          <Depth z={0.28}>
            <CamLayer z={0.28} camX={camX} camY={camY} camZoom={camZoom}>
              {/* Dinding tebing / penahan kertas antara tingkat gang (465) dan teras bawah (658) */}
              <Slab
                x={-400}
                y={ALLEY_Y}
                w={2080}
                h={TERRACE_Y - ALLEY_Y}
                color="#4E4842"
                shade="#37322E"
                shadeH={0.32}
                r={0}
                grain={0.75}
              />
              {/* Anak tangga kertas di sisi kiri menandakan penurunan elevasi ke teras rendah */}
              {[0, 1, 2, 3, 4].map((step) => (
                <Slab
                  key={step}
                  x={220 + step * 38}
                  y={ALLEY_Y + 18 + step * 35}
                  w={170 - step * 18}
                  h={26}
                  color="#6B6259"
                  shade="#48423C"
                  shadeH={0.35}
                  r={3}
                />
              ))}
              {/* Lantai teras bawah */}
              <Slab
                x={-400}
                y={TERRACE_Y}
                w={2080}
                h={360}
                color={C.floor}
                shade={C.floorLo}
                shadeH={0.25}
                r={0}
                grain={0.65}
              />
              <Slab x={-400} y={TERRACE_Y - 12} w={2080} h={14} color={C.woodLo} r={0} />
              {/* Rumah sederhana dari P06 di teras bawah dalam cahaya hangat */}
              <LowerTerraceHouse warmth={lowerWarmth} f={f} />
            </CamLayer>
          </Depth>

          {/* LAPISAN 0.52: Lantai gang, bayangan dinding, keluarga "kamu", dan dua bangunan menjepit */}
          <Depth z={0.52}>
            <CamLayer z={0.52} camX={camX} camY={camY} camZoom={camZoom}>
              {/* Lantai gang atas */}
              <Slab
                x={-400}
                y={ALLEY_Y - 16}
                w={2080}
                h={26}
                color="#8A7E72"
                shade="#5C534B"
                shadeH={0.35}
                r={0}
                grain={0.65}
              />

              {/* Bayangan dinding di atas lantai gang yang memanjang saat dinding mendekat */}
              <div
                style={{
                  position: 'absolute',
                  left: leftInnerX,
                  top: ALLEY_Y - 14,
                  width: Math.max(0, 38 + leftShift * 0.25),
                  height: 16,
                  background: 'linear-gradient(90deg, rgba(28,27,23,0.48), rgba(28,27,23,0))',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: rightInnerX - Math.max(0, 38 + rightShift * 0.25),
                  top: ALLEY_Y - 14,
                  width: Math.max(0, 38 + rightShift * 0.25),
                  height: 16,
                  background: 'linear-gradient(270deg, rgba(28,27,23,0.48), rgba(28,27,23,0))',
                }}
              />

              {/* Jejak bayangan dinding kiri & kanan (kejutan visual kecepatan di Beat 4) */}
              {trailStrength > 0.01
                ? [0, 1, 2, 3].map((idx) => {
                    const frac = (idx + 1) / 4;
                    const lGhostX = 395 + (leftInnerX - 395) * (1 - frac);
                    const rGhostX = 885 - (885 - rightInnerX) * (1 - frac);
                    const ghostOpacity = trailStrength * (0.1 + (3 - idx) * 0.055);
                    return (
                      <React.Fragment key={idx}>
                        <div
                          style={{
                            position: 'absolute',
                            left: lGhostX - 28,
                            top: -20,
                            width: 28,
                            height: ALLEY_Y + 12,
                            backgroundColor: C.ink,
                            opacity: ghostOpacity,
                            borderRight: `2px dashed rgba(232,223,211,${(ghostOpacity * 1.6).toFixed(2)})`,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: rGhostX,
                            top: -20,
                            width: 28,
                            height: ALLEY_Y + 12,
                            backgroundColor: C.ink,
                            opacity: ghostOpacity,
                            borderLeft: `2px dashed rgba(232,223,211,${(ghostOpacity * 1.6).toFixed(2)})`,
                          }}
                        />
                      </React.Fragment>
                    );
                  })
                : null}

              {/* Keluarga "kamu" berdiri tenang di tengah gang */}
              <HeroFigure x={heroX} y={ALLEY_Y - 12} breathe={gentleSway(f, 92, 0.55, 0)} />
              <ChildFigure x={childX} y={ALLEY_Y - 12} breathe={gentleSway(f, 80, 0.7, 24)} />
              <PartnerFigure x={partnerX} y={ALLEY_Y - 12} breathe={gentleSway(f, 96, 0.5, 48)} />

              {/* Dua dinding bangunan kertas tinggi di kiri (krem hangat) dan kanan (terakota) */}
              <AlleyBuildingWall
                side="left"
                innerX={leftInnerX}
                baseColor={C.cream}
                trimColor={C.creamLo}
              />
              <AlleyBuildingWall
                side="right"
                innerX={rightInnerX}
                baseColor={ROOM.terracotta}
                trimColor={C.heroLo}
              />
            </CamLayer>
          </Depth>

          {/* LAPISAN 0.82: Lingkaran sorot gaya guntingan tangan & dua panah kertas polos */}
          <Depth z={0.82}>
            <CamLayer z={0.82} camX={camX} camY={camY} camZoom={camZoom}>
              {/* Lingkaran sorot gaya guntingan tangan menyorot gang atas dan teras rendah sekaligus */}
              {spotOpacity > 0.01 ? (
                <Boil seed="spotlight-p07" amp={0.4} rot={0.05}>
                  <svg
                    width={720}
                    height={580}
                    viewBox="0 0 720 580"
                    style={{
                      position: 'absolute',
                      left: 280,
                      top: 112,
                      opacity: spotOpacity,
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.32))',
                    }}
                  >
                    <polygon
                      points="360,12 490,26 604,84 676,184 700,300 672,418 594,512 478,560 356,568 232,554 122,502 48,408 22,292 48,176 124,80 236,24"
                      fill="rgba(243, 224, 182, 0.07)"
                      stroke={C.creamHi}
                      strokeWidth="5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Boil>
              ) : null}

              {/* Sepasang panah kertas polos horizontal menjepit ke dalam pada gang (kecepatan) */}
              <Boil seed="arrows-h-p07" amp={0.4} rot={0.05}>
                <HorizontalPaperArrow
                  dir="right"
                  tipX={leftInnerX - 16}
                  y={252}
                  length={148}
                  progress={arrowProgress}
                />
                <HorizontalPaperArrow
                  dir="left"
                  tipX={rightInnerX + 16}
                  y={252}
                  length={148}
                  progress={arrowProgress}
                />
              </Boil>

              {/* Satu panah kertas polos vertikal menunjuk turun ke teras rendah (kedalaman) */}
              <Boil seed="arrow-v-p07" amp={0.4} rot={0.05}>
                <VerticalDownPaperArrow
                  x={436}
                  topY={ALLEY_Y - 6}
                  height={TERRACE_Y - ALLEY_Y - 14}
                  progress={arrowProgress}
                />
              </Boil>
            </CamLayer>
          </Depth>
        </OrbitCamera>

        {/* Vinyet lembut teater kertas */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 48%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.34) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Transisi pembuka: panel buku pop-up P06 menutup lalu bergeser */}
        <BookClosingCover f={f} />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};