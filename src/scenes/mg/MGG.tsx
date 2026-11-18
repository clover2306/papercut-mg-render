// Adegan MG-G (Titik Tepat): lanjutan panggung monopsoni MG-F di mana papan lantai kraft
// melampaui benang mustard hingga lowongan hilang, lalu kembali berhenti tepat di bawah benang.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Boil, CameraPush, Disc, GRAIN, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const MGG_DUR = 664;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palet hangat khusus Panggung Lantai (tanpa biru dingin, hitam pekat, atau neon)
const P = {
  creamBg: C.creamHi,
  creamCard: C.cream,
  creamShadow: C.creamLo,
  kraft: '#C69C6D',
  kraftHi: '#DAB58A',
  kraftLo: '#9C7347',
  kraftStitch: '#5E3B22',
  mustard: '#D8A23B',
  mustardHi: '#ECC05E',
  mustardLo: '#9E7222',
  sage: '#7E9672',
  sageHi: '#A3BC96',
  sageLo: '#596E4F',
  terra: '#C9573C',
  terraHi: '#E07A5F',
  terraLo: '#8F3824',
  brick: ROOM.terracotta,
  wood: C.wood,
  woodLo: C.woodLo,
  floor: C.floor,
  floorLo: C.floorLo,
  ink: C.ink,
  inkSoft: C.inkSoft,
  tape: C.tape,
};

// Stop-motion paper quantization (tersendat 2 frame)
const stepFrame = (f: number, step = 2) => Math.floor(f / step) * step;

// Koordinat kunci panggung
const STAGE_FLOOR_Y = 610;
const THREAD_Y = 300; // Posisi normal benang mustard bertitik
const SWEET_TOP_Y = THREAD_Y; // 300: batas atas jalur hijau sage (tepat di bawah benang)
const SWEET_H = 30; // Jalur sempit hijau sage (300..330)
const BOARD_FINAL_TOP_Y = THREAD_Y + 4; // 304: tepat di bawah benang mustard, tidak melewati benang

// Komponen Label Kertas (satu-satunya cara teks muncul di layar)
const PaperLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed?: string;
  tape?: boolean;
  opacity?: number;
  scale?: number;
}> = ({
  x,
  y,
  text,
  bg = P.creamCard,
  color = P.ink,
  size = 30,
  rot = -1.5,
  seed = 'lbl',
  tape = true,
  opacity = 1,
  scale = 1,
}) => {
  if (opacity <= 0.01) return null;
  return (
    <Boil seed={seed} amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
          opacity,
        }}
      >
        <div
          style={{
            backgroundColor: bg,
            backgroundImage: `url(${GRAIN})`,
            backgroundSize: '420px',
            backgroundBlendMode: 'multiply',
            padding: '12px 26px 14px',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: size,
            color,
            lineHeight: 1.08,
            whiteSpace: 'nowrap',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(54,34,26,0.38))',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.28)',
          }}
        >
          {text}
        </div>
        {tape ? (
          <>
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -18,
                width: 64,
                height: 22,
                rotate: '-28deg',
                background: P.tape,
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -18,
                width: 64,
                height: 22,
                rotate: '28deg',
                background: P.tape,
                filter: 'url(#torn)',
                opacity: 0.85,
              }}
            />
          </>
        ) : null}
      </div>
    </Boil>
  );
};

// Figur kertas faceless (tanpa mata, hidung, mulut, alis, telinga)
const FacelessWorker: React.FC<{
  x: number;
  y: number;
  s?: number;
  slump?: number; // 0 = tegak, 1 = bahu turun/mundur
}> = ({x, y, s = 0.78, slump = 0}) => {
  const headDrop = slump * 8 * s;
  const torsoTilt = -slump * 9;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 84 * s,
        height: 176 * s,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Paper lift={3}>
        {/* Kaki */}
        <Slab x={20 * s} y={132 * s} w={18 * s} h={44 * s} color={P.inkSoft} r={5 * s} />
        <Slab x={46 * s} y={132 * s} w={18 * s} h={44 * s} color={P.inkSoft} r={5 * s} />
        {/* Badan + bahu */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: headDrop,
            width: '100%',
            height: 136 * s,
            transformOrigin: `${42 * s}px ${130 * s}px`,
            transform: `rotate(${torsoTilt}deg)`,
          }}
        >
          <Slab
            x={14 * s}
            y={56 * s}
            w={56 * s}
            h={78 * s}
            color={P.kraftLo}
            shade={P.woodLo}
            shadeH={0.2}
            r={10 * s}
          />
          {/* Selempang kerja kertas */}
          <Slab x={24 * s} y={56 * s} w={10 * s} h={76 * s} color={P.woodLo} r={2} />
          {/* Kepala bulat polos tanpa wajah */}
          <Disc x={42 * s} y={30 * s} d={44 * s} color={P.creamCard} shade={P.creamShadow} />
          {/* Helm kuning pabrik */}
          <Slab
            x={16 * s}
            y={4 * s}
            w={52 * s}
            h={22 * s}
            color={P.mustardHi}
            shade={P.mustard}
            shadeH={0.3}
            r={`${26 * s}px ${26 * s}px ${4 * s}px ${4 * s}px`}
          />
          <Slab x={10 * s} y={22 * s} w={64 * s} h={7 * s} color={P.mustard} r={3 * s} />
        </div>
      </Paper>
    </div>
  );
};

// Figur pemberi kerja (jas bata, faceless)
const FacelessEmployer: React.FC<{
  x: number;
  y: number;
  s?: number;
  strain?: number; // 0 = tenang, 1 = terbebani membungkuk
}> = ({x, y, s = 0.86, strain = 0}) => {
  const bend = strain * 14;
  const armDrop = strain * 12 * s;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * s,
        height: 188 * s,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Paper lift={4}>
        <Slab x={24 * s} y={140 * s} w={20 * s} h={48 * s} color={P.floorLo} r={5 * s} />
        <Slab x={52 * s} y={140 * s} w={20 * s} h={48 * s} color={P.floorLo} r={5 * s} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: `${48 * s}px ${140 * s}px`,
            transform: `rotate(${bend}deg)`,
          }}
        >
          {/* Jas bata */}
          <Slab
            x={14 * s}
            y={58 * s}
            w={68 * s}
            h={86 * s}
            color={P.brick}
            shade={P.terraLo}
            shadeH={0.22}
            r={10 * s}
          />
          {/* Kerah kertas V tanpa wajah */}
          <Slab x={40 * s} y={58 * s} w={16 * s} h={34 * s} color={P.creamCard} r={3 * s} />
          <Slab x={45 * s} y={64 * s} w={6 * s} h={28 * s} color={P.terraLo} r={2 * s} />
          {/* Lengan yang turun saat terbebani */}
          <Slab
            x={4 * s}
            y={64 * s + armDrop}
            w={16 * s}
            h={56 * s}
            color={P.terraLo}
            r={6 * s}
            rot={8 + strain * 12}
          />
          <Slab
            x={76 * s}
            y={64 * s + armDrop}
            w={16 * s}
            h={56 * s}
            color={P.terraLo}
            r={6 * s}
            rot={-8 - strain * 12}
          />
          {/* Kepala polos tanpa wajah */}
          <Disc
            x={48 * s}
            y={30 * s + strain * 6 * s}
            d={46 * s}
            color={P.creamCard}
            shade={P.creamShadow}
          />
        </div>
      </Paper>
    </div>
  );
};

// Tangan kertas anonim + mekanisme tuas di sisi kanan panggung
const LeverAndAnonHand: React.FC<{
  leverAngle: number; // derajat: negatif = tarik naik, positif = turun ke titik tepat
  handReach: number; // 0..1
}> = ({leverAngle, handReach}) => {
  const pivotX = 1110;
  const pivotY = 470;
  const rad = (leverAngle * Math.PI) / 180;
  const handleX = pivotX + Math.sin(rad) * 128;
  const handleY = pivotY - Math.cos(rad) * 128;
  const handOffsetX = (1 - handReach) * 140;
  const handOffsetY = (1 - handReach) * -30;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Rumah roda gigi / dudukan tuas di lantai panggung */}
      <Paper lift={5}>
        <Slab x={pivotX - 58} y={pivotY - 10} w={116} h={150} color={P.woodLo} shade={P.floorLo} shadeH={0.3} r={10} />
        <Slab x={pivotX - 44} y={pivotY + 6} w={88} h={118} color={P.wood} shade={P.woodLo} shadeH={0.25} r={6} />
        {/* Takik indikator titik tepat (hijau sage) & batas bahaya (terakota) tanpa angka */}
        <Slab x={pivotX - 36} y={pivotY - 38} w={24} h={10} color={P.sageHi} r={3} rot={-18} />
        <Slab x={pivotX + 12} y={pivotY - 38} w={24} h={10} color={P.terra} r={3} rot={18} />
      </Paper>

      {/* Batang tuas kertas */}
      <Paper lift={6}>
        <div
          style={{
            position: 'absolute',
            left: pivotX,
            top: pivotY,
            width: 0,
            height: 0,
            transform: `rotate(${leverAngle}deg)`,
          }}
        >
          <Slab x={-10} y={-136} w={20} h={140} color={P.kraftHi} shade={P.kraftLo} shadeH={0.2} r={8} />
          <Disc x={0} y={-136} d={38} color={P.terra} shade={P.terraLo} />
        </div>
        <Disc x={pivotX} y={pivotY} d={34} color={P.kraft} shade={P.woodLo} />
      </Paper>

      {/* Tangan kertas anonim (lengan baju kraft + telapak bulat polos tanpa wajah/tubuh) */}
      <Paper lift={8}>
        <div
          style={{
            position: 'absolute',
            left: handleX + handOffsetX,
            top: handleY + handOffsetY,
            transform: `rotate(${leverAngle * 0.35 - 12}deg)`,
          }}
        >
          {/* Telapak tangan kertas menggenggam kepala tuas */}
          <Disc x={0} y={0} d={46} color={P.creamCard} shade={P.creamShadow} />
          <Slab x={-18} y={-22} w={26} h={16} color={P.creamCard} r={8} rot={-18} />
          {/* Manset & lengan kertas memanjang ke luar sayap kanan */}
          <Slab x={18} y={-20} w={30} h={40} color={P.creamCard} shade={P.creamShadow} r={4} />
          <Slab x={40} y={-28} w={220} h={56} color={P.wood} shade={P.woodLo} shadeH={0.28} r={8} />
        </div>
      </Paper>
    </div>
  );
};

// Papan Lowongan di gerbang pabrik + kartu lowongan yang berkibar jatuh di Beat d
const FactoryGateAndVacancyBoard: React.FC<{
  f: number;
  strain: number;
  recover: number;
}> = ({f, strain, recover}) => {
  const gateX = 88;
  const gateY = 308;
  // 5 kartu lowongan jatuh satu demi satu selama Beat d (frame 410..495)
  const dropFrames = [412, 430, 448, 466, 484];
  const cardLayout = [
    {ox: 18, oy: 22, rot: -3},
    {ox: 64, oy: 20, rot: 2},
    {ox: 110, oy: 24, rot: -2},
    {ox: 38, oy: 68, rot: 3},
    {ox: 88, oy: 66, rot: -4},
  ];

  return (
    <div style={{position: 'absolute', left: gateX, top: gateY}}>
      {/* Tiang dan gerbang pabrik kertas */}
      <Paper lift={4}>
        <Slab x={0} y={-24} w={28} h={326} color={P.brick} shade={P.terraLo} shadeH={0.2} r={3} />
        <Slab x={184} y={-24} w={28} h={326} color={P.brick} shade={P.terraLo} shadeH={0.2} r={3} />
        {/* Lengkung gerbang atas */}
        <Slab x={-8} y={-44} w={228} h={28} color={P.terraLo} shade={P.floorLo} shadeH={0.3} r={4} />
        {/* Papan pengumuman lowongan di gerbang (echo pembuka naskah) */}
        <Slab
          x={22}
          y={12}
          w={166}
          h={118}
          color={P.wood}
          shade={P.woodLo}
          shadeH={0.2}
          r={6}
          rot={strain * -2.5}
        />
        <Slab
          x={30}
          y={20}
          w={150}
          h={102}
          color={P.kraftLo}
          shade={P.woodLo}
          shadeH={0.15}
          r={4}
          rot={strain * -2.5}
        />
      </Paper>

      {/* Kartu-kartu lowongan tanpa teks/angka (hanya garis goresan abstrak) */}
      {cardLayout.map((c, i) => {
        const df = dropFrames[i];
        const dt = Math.max(0, stepFrame(f - df, 2));
        // Saat Beat d: kartu berkibar jatuh dan menghilang
        const fallProgress = interpolate(dt, [0, 42], [0, 1], {
          ...clamp,
          easing: Easing.in(Easing.quad),
        });
        const fallY = fallProgress * 210;
        const swayX = Math.sin(dt * 0.32 + i * 1.7) * 34 * fallProgress;
        const fallRot = c.rot + Math.sin(dt * 0.25 + i) * 38 * fallProgress + fallProgress * 45;
        const fallOpacity = interpolate(dt, [0, 28, 42], [1, 0.85, 0], clamp);

        // Saat Beat e (recover > 0): kartu lowongan baru muncul kembali di titik tepat
        const recOpacity = interpolate(recover, [0.3 + i * 0.08, 0.6 + i * 0.08], [0, 1], clamp);
        const recScale = interpolate(recover, [0.3 + i * 0.08, 0.6 + i * 0.08], [0.5, 1], {
          ...clamp,
          easing: Easing.out(Easing.back(1.6)),
        });

        const showFalling = f < 552;
        const x = 30 + c.ox + (showFalling ? swayX : 0);
        const y = 20 + c.oy + (showFalling ? fallY : 0);
        const rot = showFalling ? fallRot : c.rot;
        const op = showFalling ? fallOpacity : recOpacity;
        const sc = showFalling ? 1 : recScale;

        if (op <= 0.01) return null;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 38,
              height: 44,
              opacity: op,
              transform: `rotate(${rot}deg) scale(${sc})`,
              transformOrigin: '50% 15%',
            }}
          >
            <Paper lift={3}>
              <Slab x={0} y={0} w={38} h={44} color={P.creamCard} shade={P.creamShadow} shadeH={0.14} r={3}>
                {/* Pin kertas merah bata di atas kartu */}
                <Disc x={19} y={7} d={7} color={P.terra} />
                {/* Goresan abstrak pengganti tulisan (tanpa huruf/angka) */}
                <div style={{position: 'absolute', left: 6, top: 16, width: 26, height: 4, borderRadius: 2, background: P.kraftLo}} />
                <div style={{position: 'absolute', left: 6, top: 24, width: 20, height: 4, borderRadius: 2, background: P.kraftLo}} />
                <div style={{position: 'absolute', left: 6, top: 32, width: 24, height: 4, borderRadius: 2, background: P.kraftLo}} />
              </Slab>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

// Bangunan pabrik & atap penekan di latar panggung
const FactoryWithPressRoof: React.FC<{
  boardTopY: number;
  roofTilt: number; // kemiringan atap penekan saat terbebani (Beat d)
  strain: number;
}> = ({boardTopY, roofTilt, strain}) => {
  // Atap penekan terdorong naik mengikuti papan lantai kraft
  const roofBaseY = Math.min(248, boardTopY - 62);
  const shakeX = strain > 0 ? Math.sin(stepFrame(boardTopY, 2) * 1.7) * 2 * strain : 0;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Siluet cerobong & dinding pabrik di latar panggung */}
      <Paper lift={3}>
        {/* Cerobong kertas kiri & kanan */}
        <Slab x={365} y={88} w={46} h={210} color={P.kraftLo} shade={P.woodLo} shadeH={0.22} r={3} />
        <Slab x={359} y={82} w={58} h={14} color={P.woodLo} r={2} />
        <Slab x={835} y={104} w={42} h={190} color={P.kraftLo} shade={P.woodLo} shadeH={0.22} r={3} />
        <Slab x={829} y={98} w={54} h={14} color={P.woodLo} r={2} />

        {/* Kepulan asap kertas bulat polos */}
        <Disc x={388} y={62} d={28} color={P.creamShadow} />
        <Disc x={372} y={42} d={20} color={P.creamShadow} />
        <Disc x={856} y={76} d={24} color={P.creamShadow} />

        {/* Badan utama pabrik di latar */}
        <Slab
          x={330}
          y={230}
          w={580}
          h={380}
          color={P.creamShadow}
          shade={P.kraftLo}
          shadeH={0.18}
          r={6}
        >
          {/* Jendela-jendela pabrik kertas (polos hangat, tanpa kaca biru) */}
          {[0, 1, 2, 3, 4].map((col) => (
            <Slab
              key={col}
              x={44 + col * 104}
              y={110}
              w={64}
              h={86}
              color={P.creamBg}
              shade={P.tape}
              shadeH={0.25}
              r={4}
            />
          ))}
        </Slab>
      </Paper>

      {/* Atap penekan pabrik (elemen dari MG-F yang miring karena terbebani di Beat d) */}
      <Paper lift={6}>
        <div
          style={{
            position: 'absolute',
            left: 310 + shakeX,
            top: roofBaseY,
            width: 620,
            height: 92,
            transformOrigin: '50% 80%',
            transform: `rotate(${roofTilt}deg)`,
          }}
        >
          {/* Balok penekan bawah */}
          <Slab x={0} y={54} w={620} h={34} color={P.brick} shade={P.terraLo} shadeH={0.35} r={5} />
          {/* Gigi atap gergaji pabrik (sawtooth factory roof) */}
          <svg width={620} height={60} viewBox="0 0 620 60" style={{position: 'absolute', left: 0, top: 0}}>
            <polygon
              points="0,58 0,14 155,58 155,14 310,58 310,14 465,58 465,14 620,58"
              fill={P.terra}
            />
            <polygon
              points="0,58 155,58 155,46 0,46"
              fill={P.terraLo}
              opacity={0.35}
            />
          </svg>
          {/* Pegas/pilar penekan yang tertekan miring */}
          <Slab x={90} y={-36} w={26} h={48} color={P.woodLo} r={3} rot={roofTilt * 0.6} />
          <Slab x={504} y={-36} w={26} h={48} color={P.woodLo} r={3} rot={roofTilt * 0.6} />
        </div>
      </Paper>
    </div>
  );
};

// Jalur Hijau Sage (Beat b & e) dan Arsir Terakota (Beat c & d)
const ZoneBands: React.FC<{
  sageOpacity: number;
  terraOpacity: number;
  boardTopY: number;
}> = ({sageOpacity, terraOpacity, boardTopY}) => {
  // Arsir terakota membentang dari puncak papan (saat melampaui benang) sampai batas bawah jalur
  const terraTop = Math.min(THREAD_Y, boardTopY);
  const terraH = Math.max(28, THREAD_Y + SWEET_H - terraTop);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Jalur sempit tepat di bawah benang menyala lembut hijau sage */}
      {sageOpacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: SWEET_TOP_Y,
            width: 860,
            height: SWEET_H,
            opacity: sageOpacity,
          }}
        >
          {/* Pendar hangat hijau sage */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px -16px',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(163,188,150,0.55) 0%, rgba(126,150,114,0) 75%)',
            }}
          />
          <Paper lift={2}>
            <Slab
              x={0}
              y={0}
              w={860}
              h={SWEET_H}
              color={P.sageHi}
              shade={P.sage}
              shadeH={0.28}
              r={4}
              style={{
                borderTop: `2px dashed ${P.sageLo}`,
                borderBottom: `2px dashed ${P.sageLo}`,
              }}
            />
          </Paper>
        </div>
      ) : null}

      {/* Arsir terakota saat batas bawah melampaui nilai yang dihasilkan pekerja */}
      {terraOpacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: terraTop,
            width: 860,
            height: terraH,
            opacity: terraOpacity,
            filter: 'url(#rough)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(201, 87, 60, 0.22)',
              backgroundImage:
                'repeating-linear-gradient(-45deg, rgba(201,87,60,0.68) 0px, rgba(201,87,60,0.68) 10px, rgba(143,56,36,0.16) 10px, rgba(143,56,36,0.16) 22px)',
              borderTop: `3px solid ${P.terra}`,
              borderBottom: `3px dashed ${P.terraLo}`,
              borderRadius: 4,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

// Benang Mustard Bertitik (harga pasar / nilai yang dihasilkan pekerja)
const MustardThread: React.FC<{
  boardTopY: number;
}> = ({boardTopY}) => {
  // Bila papan lantai kraft naik melewati THREAD_Y (boardTopY < THREAD_Y),
  // benang terjepit dan melengkung ke atas mengikuti papan!
  // Bila boardTopY >= THREAD_Y (seperti akhir Beat e: 304 >= 300),
  // pinch = 0 sehingga benang lurus di THREAD_Y = 300 dan papan tepat di bawahnya.
  const pinch = Math.max(0, THREAD_Y - boardTopY + 6);
  const archY = THREAD_Y - pinch * 1.08;

  const d =
    pinch > 0.5
      ? `M 140 ${THREAD_Y} L 250 ${THREAD_Y} Q 300 ${THREAD_Y} 330 ${archY} L 910 ${archY} Q 940 ${THREAD_Y} 990 ${THREAD_Y} L 1100 ${THREAD_Y}`
      : `M 140 ${THREAD_Y} L 1100 ${THREAD_Y}`;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Pasak gulungan benang di kiri & kanan panggung */}
      <Paper lift={5}>
        <Disc x={140} y={THREAD_Y} d={28} color={P.mustard} shade={P.mustardLo} />
        <Disc x={140} y={THREAD_Y} d={12} color={P.woodLo} />
        <Disc x={1100} y={THREAD_Y} d={28} color={P.mustard} shade={P.mustardLo} />
        <Disc x={1100} y={THREAD_Y} d={12} color={P.woodLo} />
      </Paper>

      {/* Benang mustard bertitik dengan bayangan jatuh */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#rough) drop-shadow(0px 4px 5px rgba(54,34,26,0.35))',
        }}
      >
        {/* Lapis dasar benang */}
        <path
          d={d}
          fill="none"
          stroke={P.mustardLo}
          strokeWidth={9}
          strokeLinecap="round"
        />
        {/* Garis bertitik mustard hangat */}
        <path
          d={d}
          fill="none"
          stroke={P.mustardHi}
          strokeWidth={6}
          strokeDasharray="14 10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// Papan Lantai Kraft (upah minimum: tebal, tepi atas berjahit garis putus-putus)
const KraftFloorBoard: React.FC<{
  topY: number;
}> = ({topY}) => {
  const boardX = 280;
  const boardW = 680;
  const boardH = 66;
  const pillarH = Math.max(0, STAGE_FLOOR_Y - (topY + boardH));

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Tiang penyangga hidrolik/kertas di bawah papan lantai */}
      <Paper lift={4}>
        <Slab
          x={boardX + 90}
          y={topY + boardH - 4}
          w={44}
          h={pillarH + 8}
          color={P.wood}
          shade={P.woodLo}
          shadeH={0.25}
          r={4}
        />
        <Slab
          x={boardX + boardW - 134}
          y={topY + boardH - 4}
          w={44}
          h={pillarH + 8}
          color={P.wood}
          shade={P.woodLo}
          shadeH={0.25}
          r={4}
        />
      </Paper>

      {/* Papan Lantai Kraft utama */}
      <Paper lift={7}>
        <Slab
          x={boardX}
          y={topY}
          w={boardW}
          h={boardH}
          color={P.kraft}
          hi={P.kraftHi}
          hiH={0.18}
          shade={P.kraftLo}
          shadeH={0.24}
          r={8}
        >
          {/* Jahitan garis putus-putus di tepi atas papan lantai kraft */}
          <svg
            width={boardW}
            height={20}
            viewBox={`0 0 ${boardW} 20`}
            style={{position: 'absolute', left: 0, top: 2}}
          >
            <line
              x1={16}
              y1={8}
              x2={boardW - 16}
              y2={8}
              stroke={P.kraftStitch}
              strokeWidth={3.5}
              strokeDasharray="12 8"
              strokeLinecap="round"
            />
          </svg>
          {/* Jahitan bawah tipis */}
          <svg
            width={boardW}
            height={16}
            viewBox={`0 0 ${boardW} 16`}
            style={{position: 'absolute', left: 0, bottom: 2}}
          >
            <line
              x1={16}
              y1={8}
              x2={boardW - 16}
              y2={8}
              stroke={P.kraftStitch}
              strokeWidth={2}
              strokeDasharray="10 10"
              strokeLinecap="round"
              opacity={0.65}
            />
          </svg>
        </Slab>
      </Paper>
    </div>
  );
};

// Bingkai Teater Kertas ("Panggung Lantai"): lantai kayu & tirai sayap terakota
const TheaterFrame: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {/* Lantai panggung kayu */}
    <Slab x={-40} y={STAGE_FLOOR_Y} w={1360} h={140} color={P.floor} r={0} grain={0.65} />
    <Slab x={-40} y={STAGE_FLOOR_Y - 22} w={1360} h={26} color={P.woodLo} shade={P.floorLo} shadeH={0.38} r={0} />
    <div style={{position: 'absolute', left: 0, right: 0, top: STAGE_FLOOR_Y + 36, height: 3, background: P.floorLo, opacity: 0.8}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: STAGE_FLOOR_Y + 76, height: 3, background: P.floorLo, opacity: 0.8}} />

    {/* Tirai kertas terakota di sayap kiri & kanan + valance atas */}
    <Paper lift={6}>
      <Slab x={-18} y={-16} w={76} h={650} color={P.terra} shade={P.terraLo} shadeH={0.12} r="0 0 18px 0" />
      <Slab x={42} y={-16} w={34} h={590} color={P.brick} shade={P.terraLo} shadeH={0.15} r="0 0 14px 14px" />
      <Slab x={1222} y={-16} w={76} h={650} color={P.terra} shade={P.terraLo} shadeH={0.12} r="0 0 0 18px" />
      <Slab x={1204} y={-16} w={34} h={590} color={P.brick} shade={P.terraLo} shadeH={0.15} r="0 0 14px 14px" />
      <Slab x={-20} y={-14} w={1320} h={34} color={P.terraLo} shade={P.floorLo} shadeH={0.3} r={4} />
    </Paper>
  </div>
);

export const MGG: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const f = stepFrame(rawFrame, 2); // gaya stop-motion kertas

  // =========================================================================
  // JENDELA FRAME BEAT (relatif terhadap awal adegan 265,66 dtk):
  // Beat a: [0–123]   "Kamu mungkin berpikir, kalau begitu, naikkan saja setinggi-tingginya."
  // Beat b: [137–290] "Di sinilah batasnya. Monopsoni hanya menolong sampai satu titik."
  // Beat c: [290–531] "Begitu batas bawah melampaui nilai yang dihasilkan pekerja,"
  // Beat d: [403–531] "pemberi kerja tidak lagi sanggup membayar, dan lowongan kembali hilang."
  //                   (279,10–283,36 dtk -> frame (279,10 - 265,66)*30 = 403 s/d (283,36 - 265,66)*30 = 531)
  // Beat e: [548–664] "Kuncinya bukan setinggi apa, melainkan setepat apa."
  // =========================================================================

  // 1. Posisi Y tepi atas Papan Lantai Kraft (semua di-clamp):
  // - Awal Beat a (posisi akhir MG-F, di bawah benang): y = 336, sedikit ancang-ancang ke 328
  // - Beat b (137..210): naik sedikit ke y = 304 (BOARD_FINAL_TOP_Y, tepat di bawah benang 300) lalu berhenti
  // - Beat c (290..355): didorong melewati benang (300) ke y = 216
  // - Beat d (403..531): tertahan tinggi di y = 216 menekan benang & atap pabrik
  // - Beat e (548..592): ditarik turun kembali ke y = 304 (BOARD_FINAL_TOP_Y, TEPAT di bawah benang 300)
  const prepLift = interpolate(f, [36, 68, 118], [0, 6, -8], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const toSweetSpot = interpolate(f, [137, 196], [0, -24], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const overshootUp = interpolate(f, [290, 352], [0, -88], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const returnToExact = interpolate(f, [548, 592], [0, 88], {
    ...clamp,
    easing: Easing.out(Easing.back(1.15)),
  });

  // Pada akhir Beat e (f >= 592): 336 - 8 - 24 - 88 + 88 = 304 (BOARD_FINAL_TOP_Y = THREAD_Y + 4)
  // Tepat di bawah benang mustard (THREAD_Y = 300), tidak melewati benang!
  const boardTopY =
    f >= 592
      ? BOARD_FINAL_TOP_Y
      : 336 + prepLift + toSweetSpot + overshootUp + returnToExact;

  // 2. Sudut tuas & jangkauan tangan kertas anonim
  const handReach = interpolate(f, [14, 48], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const leverA = interpolate(f, [44, 108], [18, -4], {...clamp, easing: Easing.inOut(Easing.quad)});
  const leverB = interpolate(f, [137, 196], [0, -14], {...clamp, easing: Easing.out(Easing.cubic)});
  const leverC = interpolate(f, [290, 352], [0, -28], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const leverE = interpolate(f, [548, 592], [0, 28], {...clamp, easing: Easing.out(Easing.cubic)});
  const leverAngle = leverA + leverB + leverC + leverE;

  // 3. Nyala jalur hijau sage (Beat b & kembali di Beat e) vs arsir terakota (Beat c & d)
  const sageInB = interpolate(f, [148, 184], [0, 1], clamp);
  const sageOutC = interpolate(f, [292, 318], [0, 1], clamp);
  const sageInE = interpolate(f, [566, 596], [0, 1], clamp);
  const sageOpacity = Math.max(0, Math.min(1, sageInB - sageOutC + sageInE));

  const terraInC = interpolate(f, [304, 344], [0, 1], clamp);
  const terraOutE = interpolate(f, [554, 588], [0, 1], clamp);
  const terraOpacity = Math.max(0, Math.min(1, terraInC - terraOutE));

  // 4. Beban pabrik & kemiringan atap penekan (Beat d: 403..531, pulih di Beat e: 548..595)
  const strainUp = interpolate(f, [320, 403, 445], [0, 0.35, 1], clamp);
  const strainDown = interpolate(f, [548, 592], [0, 1], clamp);
  const strain = Math.max(0, strainUp - strainDown);
  const roofTilt = strain * -7.5;
  const recover = interpolate(f, [560, 625], [0, 1], clamp);

  // 5. Kemunculan & animasi ke-5 Label Kertas (HANYA dari daftar "Teks boleh tampil"):
  // (1) "setinggi-tingginya" (Beat a, ditempel di sisi papan, hilang saat Beat e dimulai)
  const lblSetinggiOp = interpolate(f, [68, 78, 540, 552], [0, 1, 1, 0], clamp);
  const lblSetinggiSc = interpolate(f, [68, 78, 84], [0.6, 1.08, 1], clamp);

  // (2) "Monopsoni hanya menolong sampai satu titik" (Beat b: frame 137–290)
  const lblMonopsoniOp = interpolate(f, [178, 190, 292, 312], [0, 1, 1, 0], clamp);
  const lblMonopsoniSc = interpolate(f, [178, 190, 198], [0.7, 1.06, 1], clamp);

  // (3) "lowongan kembali hilang" (Beat d: frame 403–531, saat kartu lowongan gugur)
  const lblLowonganOp = interpolate(f, [458, 470, 538, 552], [0, 1, 1, 0], clamp);
  const lblLowonganSc = interpolate(f, [458, 470, 478], [0.7, 1.06, 1], clamp);

  // (4) "bukan setinggi apa" (Beat e awal: 548..612, ditarik sobek dan terlempar keluar bingkai)
  const lblBukanIn = interpolate(f, [550, 560], [0, 1], clamp);
  const tearThrow = interpolate(f, [584, 614], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const lblBukanX = 620 + tearThrow * 720;
  const lblBukanY = boardTopY + 33 - tearThrow * 260;
  const lblBukanRot = -2 + tearThrow * 48;
  const lblBukanOp = lblBukanIn * interpolate(tearThrow, [0, 0.85, 1], [1, 1, 0], clamp);

  // (5) "melainkan setepat apa" (Beat e: ditempel menggantikannya dengan satu ketukan lem)
  const glueTapFrame = 612;
  const lblTepatOp = interpolate(f, [glueTapFrame, glueTapFrame + 4], [0, 1], clamp);
  // Ketukan lem: turun dari besar -> penyet sedikit (ketukan) -> mantap di 1
  const lblTepatSc = interpolate(
    rawFrame,
    [glueTapFrame, glueTapFrame + 4, glueTapFrame + 8, glueTapFrame + 14],
    [1.45, 0.92, 1.04, 1],
    {...clamp, easing: Easing.out(Easing.quad)},
  );
  const glueRingProgress = interpolate(rawFrame, [glueTapFrame + 2, glueTapFrame + 18], [0, 1], clamp);
  const glueRingOp = interpolate(rawFrame, [glueTapFrame + 2, glueTapFrame + 6, glueTapFrame + 18], [0, 0.75, 0], clamp);

  // Tetesan/kuas lem kertas kecil yang mengetuk label pada frame 612
  const tapperOp = interpolate(rawFrame, [glueTapFrame - 6, glueTapFrame, glueTapFrame + 10, glueTapFrame + 18], [0, 1, 1, 0], clamp);
  const tapperY = interpolate(
    rawFrame,
    [glueTapFrame - 6, glueTapFrame + 3, glueTapFrame + 14],
    [boardTopY - 60, boardTopY + 12, boardTopY - 80],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );

  return (
    <AbsoluteFill style={{backgroundColor: P.creamBg}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <CameraPush dur={MGG_DUR} to={1.06} origin="50% 48%" accent={glueTapFrame}>
          <OrbitCamera
            dur={MGG_DUR}
            yaw={12}
            push={1.06}
            drift={[-18, -8]}
            focus={0.5}
            depth={650}
            origin={[640, 480]}
          >
            {/* LAPIS 1 (z = 0.15): Latar panggung kertas krem & bangunan pabrik */}
            <Depth z={0.15} cover>
              <Slab x={-80} y={-60} w={1440} h={840} color={P.creamBg} r={0} grain={0.55} />
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 42%, rgba(255,248,232,0.18) 0%, rgba(0,0,0,0) 50%, rgba(54,34,26,0.28) 100%)',
                }}
              />
              {/* Sorot lampu panggung hangat dari atas */}
              <div
                style={{
                  position: 'absolute',
                  left: 220,
                  top: 0,
                  width: 840,
                  height: STAGE_FLOOR_Y,
                  background:
                    'linear-gradient(180deg, rgba(236,192,94,0.16) 0%, rgba(236,192,94,0.03) 100%)',
                  clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Boil seed="factory-bg" amp={0.4} rot={0.05}>
                <FactoryWithPressRoof
                  boardTopY={boardTopY}
                  roofTilt={roofTilt}
                  strain={strain}
                />
              </Boil>
            </Depth>

            {/* LAPIS 2 (z = 0.48): Gerbang pabrik, figur faceless, jalur sage/terakota, papan lantai kraft, benang mustard */}
            <Depth z={0.48}>
              <Boil seed="stage-mid" amp={0.4} rot={0.05}>
                {/* Gerbang pabrik & papan lowongan di sisi kiri */}
                <FactoryGateAndVacancyBoard f={f} strain={strain} recover={recover} />

                {/* Antrean pekerja pabrik berhelm kuning (faceless) di dekat gerbang */}
                <FacelessWorker x={122} y={STAGE_FLOOR_Y} s={0.72} slump={strain * 0.8} />
                <FacelessWorker x={182} y={STAGE_FLOOR_Y} s={0.76} slump={strain * 0.9} />
                <FacelessWorker x={244} y={STAGE_FLOOR_Y} s={0.78} slump={strain} />

                {/* Pemberi kerja berjas bata (faceless) di sisi kanan dekat pabrik */}
                <FacelessEmployer x={1006} y={STAGE_FLOOR_Y} s={0.84} strain={strain} />

                {/* Jalur Hijau Sage (titik tepat) & Arsir Terakota (melampaui nilai) */}
                <ZoneBands
                  sageOpacity={sageOpacity}
                  terraOpacity={terraOpacity}
                  boardTopY={boardTopY}
                />

                {/* Papan Lantai Kraft (Upah Minimum) */}
                <KraftFloorBoard topY={boardTopY} />

                {/* Pekerja berdiri di atas papan lantai kraft */}
                <FacelessWorker x={410} y={boardTopY + 4} s={0.74} slump={strain * 0.7} />
                <FacelessWorker x={485} y={boardTopY + 4} s={0.76} slump={strain * 0.6} />

                {/* Benang Mustard Bertitik (Harga Pasar / Nilai Pekerja) */}
                <MustardThread boardTopY={boardTopY} />

                {/* Tuas & Tangan Kertas Anonim di sisi kanan */}
                <LeverAndAnonHand leverAngle={leverAngle} handReach={handReach} />
              </Boil>
            </Depth>

            {/* LAPIS 3 (z = 0.78): Tirai panggung & Label Kertas */}
            <Depth z={0.78}>
              <TheaterFrame />

              {/* Beat a: Label "setinggi-tingginya" ditempel di sisi papan */}
              <PaperLabel
                x={770}
                y={boardTopY + 33}
                text="setinggi-tingginya"
                bg={P.creamCard}
                color={P.ink}
                size={28}
                rot={-2}
                seed="lbl-a"
                opacity={lblSetinggiOp}
                scale={lblSetinggiSc}
              />

              {/* Beat b: Label "Monopsoni hanya menolong sampai satu titik" */}
              <PopIn at={178} seed="pop-b">
                <PaperLabel
                  x={640}
                  y={74}
                  text="Monopsoni hanya menolong sampai satu titik"
                  bg={P.sageHi}
                  color={P.ink}
                  size={30}
                  rot={-1}
                  seed="lbl-b"
                  opacity={lblMonopsoniOp}
                  scale={lblMonopsoniSc}
                />
              </PopIn>

              {/* Beat d: Label "lowongan kembali hilang" */}
              <PopIn at={458} seed="pop-d">
                <PaperLabel
                  x={310}
                  y={148}
                  text="lowongan kembali hilang"
                  bg={P.terra}
                  color={P.creamCard}
                  size={30}
                  rot={-2.5}
                  seed="lbl-d"
                  opacity={lblLowonganOp}
                  scale={lblLowonganSc}
                />
              </PopIn>

              {/* Beat e (bagian 1): Label "bukan setinggi apa" ditarik sobek & terlempar keluar bingkai */}
              <PaperLabel
                x={lblBukanX}
                y={lblBukanY}
                text="bukan setinggi apa"
                bg={P.creamCard}
                color={P.terraLo}
                size={30}
                rot={lblBukanRot}
                seed="lbl-e1"
                opacity={lblBukanOp}
              />
              {/* Serpihan kertas sobekan saat "bukan setinggi apa" ditarik */}
              {tearThrow > 0.02 && tearThrow < 0.95 ? (
                <>
                  {[0, 1, 2, 3].map((k) => {
                    const sx = 620 + tearThrow * (280 + k * 95);
                    const sy = boardTopY + 20 - tearThrow * (80 + k * 35) + Math.sin(tearThrow * 8 + k) * 18;
                    const sr = tearThrow * (90 + k * 45) * (k % 2 === 0 ? 1 : -1);
                    return (
                      <Slab
                        key={k}
                        x={sx}
                        y={sy}
                        w={18 + (k % 2) * 8}
                        h={14}
                        color={P.creamCard}
                        rot={sr}
                        r={2}
                        style={{opacity: 1 - tearThrow, filter: 'url(#torn)'}}
                      />
                    );
                  })}
                </>
              ) : null}

              {/* Beat e (bagian 2): Efek cincin lem & Label "melainkan setepat apa" ditempel dengan satu ketukan lem */}
              {glueRingOp > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 620,
                    top: BOARD_FINAL_TOP_Y + 33,
                    width: 340 + glueRingProgress * 120,
                    height: 64 + glueRingProgress * 44,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: 40,
                    border: `4px dashed ${P.sageHi}`,
                    opacity: glueRingOp,
                  }}
                />
              ) : null}

              <PaperLabel
                x={620}
                y={BOARD_FINAL_TOP_Y + 33}
                text="melainkan setepat apa"
                bg={P.sageHi}
                color={P.ink}
                size={32}
                rot={-0.8}
                seed="lbl-e2"
                opacity={lblTepatOp}
                scale={lblTepatSc}
              />

              {/* Alat ketuk lem kertas saat menempel "melainkan setepat apa" */}
              {tapperOp > 0.01 ? (
                <Paper lift={8} style={{opacity: tapperOp}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 620,
                      top: tapperY,
                      transform: 'translate(-50%, -100%) rotate(-8deg)',
                    }}
                  >
                    <Slab x={-28} y={-18} w={56} h={22} color={P.mustardHi} shade={P.mustard} r={6} />
                    <Slab x={-12} y={-92} w={24} h={76} color={P.wood} shade={P.woodLo} r={8} />
                  </div>
                </Paper>
              ) : null}
            </Depth>
          </OrbitCamera>
        </CameraPush>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
export default MGG;
