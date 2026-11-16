// Adegan P08: "Dua Kabar di Satu Ruangan" (scene 41-47, 774 frame pada 1280x720 30 fps).
// Balai keluarga dengan jendela dua daun (kabar baik kiri, kabar buruk kanan) yang bermuara ke pose pembuka P09.
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {Plant, Shelf} from '../../lib/paper/sets';
import {FilmWeave} from '../../lib/paper/look';

export const P08_DUR = 774;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const smooth = (
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): number =>
  interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const ramp = (frame: number, start: number, end: number, from = 0, to = 1): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

interface PersonProps {
  x: number;
  y: number;
  scale?: number;
  shirtColor: string;
  pantsColor?: string;
  skinColor?: string;
  hasScarf?: boolean;
  scarfColor?: string;
  hasBriefcase?: boolean;
  hasHijab?: boolean;
  hijabColor?: string;
  hasBackpack?: boolean;
  headTurn?: number;
  armReach?: number;
  phase?: number;
  frame: number;
  swayScale?: number;
}

// Tokoh kertas tanpa wajah dari tumpukan Slab & Paper (konsisten dengan seluruh episode).
const PaperPerson: React.FC<PersonProps> = ({
  x,
  y,
  scale = 1,
  shirtColor,
  pantsColor = '#2E3A48',
  skinColor = '#DFC3A6',
  hasScarf = false,
  scarfColor = C.hero,
  hasBriefcase = false,
  hasHijab = false,
  hijabColor = C.creamHi,
  hasBackpack = false,
  headTurn = 0,
  armReach = 0,
  phase = 0,
  frame,
  swayScale = 1,
}) => {
  const breathe = Math.sin(frame * 0.045 + phase) * 1.1 * swayScale;
  const tilt = Math.sin(frame * 0.032 + phase * 1.4) * 0.7 * swayScale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: '0px 0px',
      }}
    >
      <Paper lift={4}>
        {/* Sepatu */}
        <Slab x={-13} y={-5} w={12} h={5} color={C.ink} r={3} />
        <Slab x={1} y={-5} w={12} h={5} color={C.ink} r={3} />

        {/* Celana / Kaki */}
        <Slab x={-10} y={-46} w={9} h={43} color={pantsColor} r={3} />
        <Slab x={1} y={-46} w={9} h={43} color={pantsColor} r={3} />

        {/* Tas Sekolah (untuk tokoh anak) */}
        {hasBackpack ? (
          <Slab
            x={-18}
            y={-78}
            w={10}
            h={24}
            color={C.hero}
            shade={C.heroLo}
            shadeH={0.25}
            r={4}
          />
        ) : null}

        {/* Badan & Lengan */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: breathe * 0.45,
          }}
        >
          {/* Kemeja / Baju */}
          <Slab
            x={-15}
            y={-85}
            w={30}
            h={41}
            color={shirtColor}
            shade="rgba(0,0,0,0.14)"
            shadeH={0.18}
            r="10px 10px 4px 4px"
          />

          {/* Kerah kemeja */}
          {!hasHijab ? (
            <Slab x={-5} y={-85} w={10} h={6} color={C.creamHi} r="0 0 5px 5px" />
          ) : null}

          {/* Lengan belakang */}
          <Slab
            x={-19}
            y={-80}
            w={7}
            h={30}
            color={shirtColor}
            shade="rgba(0,0,0,0.18)"
            shadeH={0.25}
            r={4}
            rot={5}
          />

          {/* Lengan depan & tas kantor */}
          {hasBriefcase ? (
            <>
              <Slab
                x={12}
                y={-80}
                w={7}
                h={30}
                color={shirtColor}
                r={4}
                rot={-5}
              />
              <Slab x={12} y={-52} w={6} h={6} color={skinColor} r="50%" />
              {/* Gagang tas kantor */}
              <Slab x={10} y={-51} w={10} h={5} color={C.woodLo} r={2} />
              {/* Badan tas kantor */}
              <Slab
                x={1}
                y={-47}
                w={28}
                h={19}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.28}
                r={3}
              />
              <Slab x={12.5} y={-42} w={5} h={4} color={C.brass} r={1} />
            </>
          ) : (
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: -78,
                transform: `rotate(${-armReach * 42}deg)`,
                transformOrigin: '3px 2px',
              }}
            >
              <Slab x={-2} y={0} w={7} h={30} color={shirtColor} r={4} />
              <Slab x={-1.5} y={27} w={6} h={6} color={skinColor} r="50%" />
            </div>
          )}

          {/* Syal kertas hangat terakota ("Kamu") */}
          {hasScarf ? (
            <>
              <Slab
                x={-11}
                y={-85}
                w={22}
                h={8}
                color={scarfColor}
                shade={C.heroLo}
                shadeH={0.25}
                r={4}
              />
              <Slab
                x={-8}
                y={-78}
                w={6}
                h={23}
                color={scarfColor}
                r={2}
                rot={4}
              />
              <Slab
                x={1}
                y={-78}
                w={6}
                h={18}
                color={C.heroLo}
                r={2}
                rot={-5}
              />
            </>
          ) : null}

          {/* Leher & Kepala Bulat Polos TANPA WAJAH */}
          <div
            style={{
              position: 'absolute',
              left: headTurn * 2.2,
              top: breathe * 0.35,
            }}
          >
            <Slab x={-3.5} y={-91} w={7} h={7} color={skinColor} r={2} />
            {hasHijab ? (
              <>
                <Slab
                  x={-12.5}
                  y={-111}
                  w={25}
                  h={36}
                  color={hijabColor}
                  shade="rgba(0,0,0,0.08)"
                  shadeH={0.2}
                  r="13px 13px 7px 7px"
                />
                <Slab
                  x={-7.5 + headTurn * 1.5}
                  y={-107}
                  w={15}
                  h={18}
                  color={skinColor}
                  r="50%"
                />
              </>
            ) : (
              <>
                <Slab
                  x={-10}
                  y={-109}
                  w={20}
                  h={21}
                  color={skinColor}
                  r="50%"
                />
                <Slab
                  x={-10.5}
                  y={-110}
                  w={21}
                  h={9}
                  color={C.inkSoft}
                  r="11px 11px 3px 3px"
                />
              </>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export const P08: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // Faktor peredam gerakan pada tahanan pose akhir Beat 7 (frame 742-774)
  const holdSettle = 1 - ramp(frame, 738, 760, 0, 0.85);

  // Beat 1: Tirai pintu kertas membuka lembut (frame 0-34)
  const curtainOpen = ramp(frame, 0, 34, 0, 1);

  // Koreografi kamera 7 beat (identik dengan brief & P09)
  let focusX = 640;
  let focusY = 360;
  let camZoom = 1.0;

  if (frame < 75) {
    const t = ramp(frame, 6, 75);
    focusX = interpolate(t, [0, 1], [640, 415]);
    focusY = interpolate(t, [0, 1], [360, 332]);
    camZoom = interpolate(t, [0, 1], [1.0, 1.32]);
  } else if (frame < 130) {
    const t = ramp(frame, 75, 130);
    focusX = interpolate(t, [0, 1], [415, 235]);
    focusY = interpolate(t, [0, 1], [332, 318]);
    camZoom = interpolate(t, [0, 1], [1.32, 1.48]);
  } else if (frame < 180) {
    const t = ramp(frame, 130, 180);
    focusX = interpolate(t, [0, 1], [235, 435]);
    focusY = interpolate(t, [0, 1], [318, 318]);
    camZoom = interpolate(t, [0, 1], [1.48, 1.48]);
  } else if (frame < 225) {
    const t = ramp(frame, 180, 225);
    focusX = interpolate(t, [0, 1], [435, 335]);
    focusY = interpolate(t, [0, 1], [318, 355]);
    camZoom = interpolate(t, [0, 1], [1.48, 1.36]);
  } else if (frame < 258) {
    const t = ramp(frame, 225, 258);
    focusX = interpolate(t, [0, 1], [335, 226]);
    focusY = interpolate(t, [0, 1], [355, 415]);
    camZoom = interpolate(t, [0, 1], [1.36, 2.05]);
  } else if (frame < 306) {
    const t = ramp(frame, 258, 306);
    focusX = interpolate(t, [0, 1], [226, 232]);
    focusY = interpolate(t, [0, 1], [415, 412]);
    camZoom = interpolate(t, [0, 1], [2.05, 2.18]);
  } else if (frame < 342) {
    const t = ramp(frame, 306, 342);
    focusX = interpolate(t, [0, 1], [232, 220]);
    focusY = interpolate(t, [0, 1], [412, 310]);
    camZoom = interpolate(t, [0, 1], [2.18, 2.26]);
  } else if (frame < 658) {
    const t = ramp(frame, 342, 658);
    focusX = interpolate(t, [0, 1], [220, 222]);
    focusY = interpolate(t, [0, 1], [310, 316]);
    camZoom = interpolate(t, [0, 1], [2.26, 2.22]);
  } else {
    const t = ramp(frame, 662, 744);
    focusX = interpolate(t, [0, 1], [222, 640]);
    focusY = interpolate(t, [0, 1], [316, 360]);
    camZoom = interpolate(t, [0, 1], [2.22, 1.0]);
  }

  const camTx = width / 2 - focusX * camZoom;
  const camTy = height / 2 - focusY * camZoom;

  // Paralaks lembut antar-lapisan kedalaman
  const dx = focusX - 640;
  const dy = focusY - 360;
  const bgParallaxX = dx * 0.22;
  const bgParallaxY = dy * 0.14;
  const fgParallaxX = -dx * 0.08;

  // Keseimbangan cahaya dua daun jendela (pagi emas kiri vs senja indigo kanan)
  // QA Clover: sorot direndahkan (0.34->0.22, boost 0.35->0.22) karena sorot pagi
  // menumpuk DI ATAS papan gantung dan memucatkan teks "8,07%" / "MARET 2026".
  const leftWarmBoost = smooth(frame, 478, 495, 655, 685) * 0.22;
  const rightDuskSweep = smooth(frame, 672, 696, 720, 748);
  const leftBeamOpacity = 0.22 + leftWarmBoost - rightDuskSweep * 0.1;
  const rightBeamOpacity = 0.22 + rightDuskSweep * 0.18 - leftWarmBoost * 0.1;

  // Beat 3: Pertumbuhan tanaman di ambang jendela kiri (frame 234-300)
  const plantGrowth = ramp(frame, 234, 300, 0, 1);
  // Beat 5: Bunga mekar di tanaman ambang (frame 483-505)
  const flowerBloom = ramp(frame, 483, 505, 0, 1);

  // Teks 1: "LEBIH DARI 5%" pada patok pot (masuk 253-261, keluar bersih 304-317)
  const stakeVis = smooth(frame, 253, 261, 304, 317);
  const stakeScale = interpolate(stakeVis, [0, 1], [0.9, 1]);
  const stakeYOffset = interpolate(stakeVis, [0, 1], [14, 0]);

  // Teks 2 & 3: Papan gantung "8,07%" (masuk 321-334) + label terselip "MARET 2026" (masuk 411-422)
  // Keduanya keluar rapi sebelum Beat 7 (frame 642-661)
  const boardVis = smooth(frame, 321, 334, 642, 661);
  const boardDropY = interpolate(boardVis, [0, 1], [-85, 0]);
  const boardSway = Math.sin(frame * 0.035) * 0.55 * boardVis;

  const labelVis = smooth(frame, 411, 422, 642, 661);
  const labelSlideX = interpolate(labelVis, [0, 1], [18, 0]);

  // Beat 4: Bayangan teduh di dataran rendah menyusut perlahan
  const shadowRecede = ramp(frame, 326, 463, 0, 1);

  // Beat 5: Burung kertas melintas pelan di langit kiri atas (frame 482-538)
  const birdProgress = ramp(frame, 482, 538, 0, 1);
  const birdVis = smooth(frame, 482, 490, 528, 538);
  const birdWing = Math.sin(frame * 0.28) * 16;

  // Beat 6: Figur-figur menapaki lereng keluar dari bayangan menuju area terang (frame 522-634)
  const climbProgress = ramp(frame, 522, 634, 0, 1);

  // Beat 7: Tokoh-tokoh di tingkat atas panggung menoleh pelan ke jendela kanan (frame 675-725)
  const headTurnRight = ramp(frame, 675, 725, 0, -1);

  // Ayunan tenang lampu gantung kertas
  const lanternSwing1 = Math.sin(frame * 0.035) * 2.0 * holdSettle;
  const lanternSwing2 = Math.sin(frame * 0.035 + 1.4) * 1.8 * holdSettle;

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* RIG KAMERA UTAMA */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width,
            height,
            transform: `translate(${camTx}px, ${camTy}px) scale(${camZoom})`,
            transformOrigin: '0px 0px',
          }}
        >
          {/* LAPISAN 1: DINDING BALAI KELUARGA (KREM HANGAT BERMOTIF PANEL KERTAS) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${bgParallaxX}px, ${bgParallaxY}px)`,
            }}
          >
            <Slab x={-120} y={-80} w={1520} h={680} color={C.creamHi} r={0} grain={0.55} />

            {/* Panel vertikal dinding kertas berlapis */}
            {Array.from({length: 14}).map((_, i) => (
              <Slab
                key={i}
                x={-60 + i * 105}
                y={0}
                w={98}
                h={525}
                color={i % 2 === 0 ? C.cream : C.creamHi}
                r={0}
                grain={0.45}
              />
            ))}

            {/* Lis kertas dekoratif atas & bawah */}
            <Slab
              x={-120}
              y={54}
              w={1520}
              h={16}
              color={C.creamLo}
              shade="rgba(0,0,0,0.08)"
              shadeH={0.3}
              r={0}
            />
            <Slab
              x={-120}
              y={505}
              w={1520}
              h={22}
              color={C.woodHi}
              shade={C.woodLo}
              shadeH={0.35}
              r={0}
            />

            {/* Rak Buku Kertas dari Pustaka Kit Sets (bebas teks) */}
            <Shelf x={1095} y={240} w={160} books={3} />
            <Shelf x={1095} y={365} w={160} books={2} />
          </div>

          {/* LAPISAN 2: JENDELA BESAR BERDAUN DUA (KABAR BAIK KIRI / KABAR BURUK KANAN) */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            {/* DAUN JENDELA KIRI: PAGI CERAH, MATAHARI TERBIT, LEMBAH & PAPAN GANTUNG */}
            <div
              style={{
                position: 'absolute',
                left: 118,
                top: 148,
                width: 206,
                height: 324,
                overflow: 'hidden',
                borderRadius: 3,
              }}
            >
              {/* Langit pagi hangat */}
              <Slab x={0} y={0} w={206} h={324} color="#FBE5A8" r={0} grain={0.35} />
              <Slab x={0} y={115} w={206} h={209} color="#F7CE78" r={0} grain={0.3} />

              {/* Matahari kertas terbit */}
              <Paper lift={3}>
                <Slab
                  x={14}
                  y={30}
                  w={92}
                  h={92}
                  color="#FFF2BE"
                  r="50%"
                />
                <Slab
                  x={30}
                  y={46}
                  w={60}
                  h={60}
                  color={C.sparkYellow}
                  r="50%"
                />
                <Slab
                  x={39}
                  y={55}
                  w={42}
                  h={42}
                  color="#FFF8DC"
                  r="50%"
                />
              </Paper>

              {/* Awan pagi kertas */}
              <Paper lift={2}>
                <Slab x={108} y={34} w={56} h={14} color="#FFF9EC" r={8} />
                <Slab x={120} y={27} w={34} h={14} color="#FFF9EC" r={8} />
              </Paper>

              {/* Beat 5: Burung kertas melintas pelan di langit kiri atas */}
              {birdVis > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 18 + birdProgress * 64,
                    top: 58 - Math.sin(birdProgress * Math.PI) * 14,
                    opacity: birdVis,
                  }}
                >
                  <Slab
                    x={-11}
                    y={-2}
                    w={12}
                    h={4}
                    color="#FFFDF7"
                    r={3}
                    rot={-16 + birdWing}
                  />
                  <Slab
                    x={0}
                    y={-2}
                    w={12}
                    h={4}
                    color="#FFFDF7"
                    r={3}
                    rot={16 - birdWing}
                  />
                </div>
              ) : null}

              {/* Bukit keemasan di kejauhan */}
              <Paper lift={2}>
                <Slab
                  x={-16}
                  y={178}
                  w={140}
                  h={150}
                  color={ROOM.mustard}
                  r="70px 70px 0 0"
                  grain={0.5}
                />
                <Slab
                  x={92}
                  y={172}
                  w={136}
                  h={156}
                  color={C.brass}
                  r="68px 68px 0 0"
                  grain={0.5}
                />
              </Paper>

              {/* Lereng dataran tengah menuju dataran tinggi cerah */}
              <Paper lift={3}>
                <Slab
                  x={-18}
                  y={224}
                  w={145}
                  h={110}
                  color={C.sage}
                  r="50px 50px 0 0"
                  grain={0.55}
                />
                <Slab
                  x={88}
                  y={194}
                  w={140}
                  h={140}
                  color={C.sage}
                  shade={C.sageLo}
                  shadeH={0.2}
                  r="56px 56px 0 0"
                  grain={0.55}
                />
              </Paper>

              {/* Teras dataran rendah depan */}
              <Paper lift={4}>
                <Slab
                  x={-14}
                  y={254}
                  w={150}
                  h={80}
                  color={C.sageLo}
                  r="42px 42px 0 0"
                  grain={0.6}
                />
                <Slab
                  x={104}
                  y={226}
                  w={124}
                  h={108}
                  color={C.sageLo}
                  r="48px 48px 0 0"
                  grain={0.6}
                />
              </Paper>

              {/* Rumah-rumah sederhana bermartabat di dataran rendah & dataran tinggi */}
              <Paper lift={3}>
                {/* Rumah kiri bawah 1 */}
                <div style={{position: 'absolute', left: 14, top: 244}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -3,
                      top: -10,
                      width: 28,
                      height: 11,
                      backgroundColor: C.hero,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  <Slab x={0} y={0} w={22} h={16} color={C.creamHi} r={1} />
                  <Slab x={8} y={6} w={5} h={10} color={C.woodLo} r={1} />
                </div>
                {/* Rumah kiri bawah 2 */}
                <div style={{position: 'absolute', left: 44, top: 250}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -2,
                      top: -9,
                      width: 24,
                      height: 10,
                      backgroundColor: C.heroLo,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  <Slab x={0} y={0} w={20} h={15} color={C.cream} r={1} />
                  <Slab x={7} y={6} w={5} h={9} color={C.woodLo} r={1} />
                </div>
                {/* Rumah kanan atas (area terang) */}
                <div style={{position: 'absolute', left: 156, top: 196}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -3,
                      top: -11,
                      width: 30,
                      height: 12,
                      backgroundColor: C.hero,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  <Slab x={0} y={0} w={24} h={17} color="#FFF6E5" r={1} />
                  <Slab x={9} y={7} w={5} h={10} color={C.wood} r={1} />
                </div>
                <div style={{position: 'absolute', left: 184, top: 204}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -2,
                      top: -9,
                      width: 23,
                      height: 10,
                      backgroundColor: C.brass,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                  />
                  <Slab x={0} y={0} w={19} h={14} color={C.creamHi} r={1} />
                </div>
              </Paper>

              {/* Beat 4: Bayangan teduh di dataran rendah menyusut perlahan ke kiri */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 187,
                  width: Math.max(0, 162 - shadowRecede * 128),
                  height: 140,
                  backgroundColor: ROOM.navy,
                  opacity: 0.42 - shadowRecede * 0.16,
                  borderTopRightRadius: 24,
                }}
              />

              {/* Beat 6: Figur-figur menapaki lereng keluar dari bayangan menuju area terang */}
              {/* Figur terdepan menoleh & mengulurkan tangan membantu */}
              <PaperPerson
                x={130 + climbProgress * 12}
                y={228 - climbProgress * 6}
                scale={0.34}
                shirtColor={C.creamHi}
                pantsColor={ROOM.slate}
                headTurn={-1.1}
                armReach={-0.65}
                phase={0.4}
                frame={frame}
              />

              {/* Orang tua menggandeng anak menapaki lereng */}
              <div
                style={{
                  position: 'absolute',
                  left: 78 + climbProgress * 30,
                  top: 257 - climbProgress * 18,
                }}
              >
                <PaperPerson
                  x={0}
                  y={0}
                  scale={0.33}
                  shirtColor={C.sage}
                  pantsColor="#2E3A48"
                  armReach={0.45}
                  phase={1.1}
                  frame={frame}
                />
                <PaperPerson
                  x={11}
                  y={2}
                  scale={0.24}
                  shirtColor={C.amber}
                  pantsColor={ROOM.slate}
                  hasBackpack
                  phase={1.8}
                  frame={frame}
                />
              </div>

              {/* Figur ketiga melangkah keluar dari bayangan bawah */}
              <PaperPerson
                x={38 + climbProgress * 34}
                y={274 - climbProgress * 16}
                scale={0.32}
                shirtColor={C.hero}
                pantsColor="#2E3A48"
                phase={2.3}
                frame={frame}
              />

              {/* TEKS 2 & 3: PAPAN GANTUNG "8,07%" + LABEL TERSELIP "MARET 2026" */}
              {boardVis > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 103,
                    top: boardDropY,
                    transform: `rotate(${boardSway}deg)`,
                    transformOrigin: '0px 0px',
                    opacity: boardVis,
                  }}
                >
                  <Boil seed="board807" amp={0.4} rot={0.05}>
                    <Paper lift={6}>
                      {/* Dua tali penggantung dari bingkai atas jendela */}
                      <Slab x={-57} y={-10} w={2.5} h={46} color={C.woodLo} r={1} />
                      <Slab x={54.5} y={-10} w={2.5} h={46} color={C.woodLo} r={1} />

                      {/* Papan gantung utama */}
                      <Slab
                        x={-84}
                        y={34}
                        w={168}
                        h={84}
                        color={C.hero}
                        shade={C.heroLo}
                        shadeH={0.14}
                        r={6}
                      />
                      <Slab
                        x={-78}
                        y={40}
                        w={156}
                        h={72}
                        color="#FFFDF8"
                        r={4}
                        grain={0.3}
                      />

                      {/* Lubang tali */}
                      <Slab x={-58} y={43} w={5} h={5} color={C.wood} r="50%" />
                      <Slab x={53} y={43} w={5} h={5} color={C.wood} r="50%" />

                      {/* TEKS DIIZINKAN 2: "8,07%" (tampil utuh sekaligus, kontras tinggi) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -78,
                          top: 40,
                          width: 156,
                          height: 72,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: FONT.caption,
                          fontWeight: 900,
                          fontSize: 36,
                          color: C.ink,
                          letterSpacing: '0.02em',
                          lineHeight: 1,
                        }}
                      >
                        8,07%
                      </div>

                      {/* TEKS DIIZINKAN 3: Label terselip "MARET 2026" di sudut bawah papan */}
                      {labelVis > 0.01 ? (
                        <div
                          style={{
                            position: 'absolute',
                            left: 38 + labelSlideX,
                            top: 111,
                            transform: 'rotate(-2.5deg)',
                            opacity: labelVis,
                          }}
                        >
                          <Paper lift={5}>
                            <Slab
                              x={-54}
                              y={-13}
                              w={108}
                              h={26}
                              color={C.tape}
                              shade="rgba(0,0,0,0.12)"
                              shadeH={0.2}
                              r={4}
                              grain={0.45}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                left: -54,
                                top: -13,
                                width: 108,
                                height: 26,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: FONT.label,
                                fontWeight: 800,
                                fontSize: 11.5,
                                color: C.ink,
                                letterSpacing: '0.08em',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              MARET 2026
                            </div>
                          </Paper>
                        </div>
                      ) : null}
                    </Paper>
                  </Boil>
                </div>
              ) : null}
            </div>

            {/* DAUN JENDELA KANAN: SENJA GELAP, AWAN TIPIS, BULAN SABIT */}
            <div
              style={{
                position: 'absolute',
                left: 336,
                top: 148,
                width: 206,
                height: 324,
                overflow: 'hidden',
                borderRadius: 3,
              }}
            >
              {/* Langit senja biru malam */}
              <Slab x={0} y={0} w={206} h={324} color={ROOM.navy} r={0} grain={0.4} />
              <Slab x={0} y={145} w={206} h={179} color={ROOM.dusk} r={0} grain={0.35} />

              {/* Bulan sabit kertas berlapis */}
              <Paper lift={3}>
                <Slab
                  x={114}
                  y={46}
                  w={36}
                  h={36}
                  color="#F7E8BD"
                  r="50%"
                />
                <Slab
                  x={124}
                  y={41}
                  w={32}
                  h={32}
                  color={ROOM.navy}
                  r="50%"
                />
              </Paper>

              {/* Awan gelap tipis senja */}
              <Paper lift={2}>
                <Slab x={12} y={92} w={96} h={11} color="#1B2438" r={6} />
                <Slab x={78} y={122} w={116} h={12} color="#1F2A42" r={6} />
              </Paper>

              {/* Siluet bukit senja */}
              <Paper lift={3}>
                <Slab
                  x={-16}
                  y={204}
                  w={140}
                  h={125}
                  color="#26334D"
                  r="64px 64px 0 0"
                  grain={0.5}
                />
                <Slab
                  x={88}
                  y={198}
                  w={136}
                  h={130}
                  color="#1E2940"
                  r="60px 60px 0 0"
                  grain={0.5}
                />
              </Paper>
            </div>

            {/* BINGKAI KAYU-KERTAS JENDELA DUA DAUN & AMBANG JENDELA */}
            <Paper lift={5}>
              {/* Bingkai atas & bawah */}
              <Slab x={104} y={134} w={452} h={14} color={C.woodHi} r={2} />
              <Slab x={104} y={472} w={452} h={14} color={C.woodHi} r={2} />
              {/* Tiang pinggir kiri, kanan, dan tiang tengah pemisah dua daun */}
              <Slab x={104} y={134} w={14} h={350} color={C.woodHi} r={2} />
              <Slab x={542} y={134} w={14} h={350} color={C.woodHi} r={2} />
              <Slab
                x={324}
                y={144}
                w={12}
                h={332}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.25}
                r={1}
              />
              {/* Lis mahkota atas jendela */}
              <Slab
                x={96}
                y={124}
                w={468}
                h={14}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.35}
                r={2}
              />
              {/* Papan ambang jendela */}
              <Slab
                x={94}
                y={472}
                w={472}
                h={16}
                color={C.woodHi}
                shade={C.wood}
                shadeH={0.3}
                r={2}
              />
            </Paper>

            {/* TIRAI JENDELA KIRI & KANAN (di tepi luar, tidak pernah menutup kaca/teks) */}
            <Paper lift={6}>
              <Slab
                x={92}
                y={132}
                w={30}
                h={348}
                color={C.tape}
                shade="rgba(0,0,0,0.12)"
                shadeH={0.08}
                r="4px 4px 16px 16px"
                grain={0.5}
              />
              <Slab
                x={538}
                y={132}
                w={30}
                h={348}
                color={C.tape}
                shade="rgba(0,0,0,0.12)"
                shadeH={0.08}
                r="4px 4px 16px 16px"
                grain={0.5}
              />
            </Paper>

            {/* POT TANAMAN DI AMBANG DAUN KIRI + TANAMAN TUMBUH + PATOK "LEBIH DARI 5%" */}
            <div style={{position: 'absolute', left: 174, top: 472}}>
              {/* Tanaman kertas yang tumbuh nyata (Beat 3) dan berbunga (Beat 5) */}
              {plantGrowth > 0.01 ? (
                <div style={{position: 'absolute', left: -14, top: -34}}>
                  <Paper lift={4}>
                    {/* Batang utama tumbuh ke atas */}
                    <Slab
                      x={-2}
                      y={-48 * plantGrowth}
                      w={4}
                      h={48 * plantGrowth}
                      color={C.sageLo}
                      r={2}
                    />
                    {/* Daun kiri 1 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -2,
                        top: -16 * plantGrowth,
                        transform: `scale(${clamp(plantGrowth * 1.4)})`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <Slab
                        x={-20}
                        y={-12}
                        w={20}
                        h={11}
                        color={C.sage}
                        r="50% 50% 50% 50% / 70% 70% 30% 30%"
                        rot={24}
                      />
                    </div>
                    {/* Daun kanan 2 (mengarah ke atas-tengah, tidak menutup patok) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 1,
                        top: -28 * plantGrowth,
                        transform: `scale(${clamp((plantGrowth - 0.25) * 1.4)})`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <Slab
                        x={0}
                        y={-14}
                        w={18}
                        h={10}
                        color={C.sage}
                        r="50% 50% 50% 50% / 70% 70% 30% 30%"
                        rot={-36}
                      />
                    </div>
                    {/* Daun kiri atas 3 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -2,
                        top: -39 * plantGrowth,
                        transform: `scale(${clamp((plantGrowth - 0.45) * 1.6)})`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <Slab
                        x={-18}
                        y={-12}
                        w={18}
                        h={10}
                        color={C.sageLo}
                        r="50% 50% 50% 50% / 70% 70% 30% 30%"
                        rot={28}
                      />
                    </div>
                    {/* Beat 5: Bunga kertas mekar di pucuk tanaman */}
                    {flowerBloom > 0.01 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: -49 * plantGrowth,
                          transform: `scale(${flowerBloom})`,
                          transformOrigin: '0px 0px',
                        }}
                      >
                        {[0, 72, 144, 216, 288].map((deg) => (
                          <Slab
                            key={deg}
                            x={-3.5}
                            y={-11}
                            w={7}
                            h={11}
                            color={C.amber}
                            r="50%"
                            rot={deg}
                          />
                        ))}
                        <Slab x={-3.5} y={-3.5} w={7} h={7} color={C.hero} r="50%" />
                      </div>
                    ) : null}
                  </Paper>
                </div>
              ) : null}

              {/* TEKS DIIZINKAN 1: Patok pot "LEBIH DARI 5%" di sisi kanan pot yang bersih */}
              {stakeVis > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 62,
                    top: -46 + stakeYOffset,
                    transform: `scale(${stakeScale})`,
                    transformOrigin: '0px 16px',
                    opacity: stakeVis,
                  }}
                >
                  <Boil seed="stake5pct" amp={0.4} rot={0.05}>
                    <Paper lift={5}>
                      {/* Tiang patok kayu-kertas */}
                      <Slab x={-3} y={8} w={6} h={24} color={C.wood} r={1} />
                      {/* Plakat patok kontras tinggi */}
                      <Slab
                        x={-52}
                        y={-18}
                        w={104}
                        h={28}
                        color={C.heroLo}
                        r={4}
                      />
                      <Slab
                        x={-49}
                        y={-15}
                        w={98}
                        h={22}
                        color="#FFFDF7"
                        r={2.5}
                        grain={0.3}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: -49,
                          top: -15,
                          width: 98,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: FONT.label,
                          fontWeight: 900,
                          fontSize: 10.5,
                          color: C.ink,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        LEBIH DARI 5%
                      </div>
                    </Paper>
                  </Boil>
                </div>
              ) : null}

              {/* Pot Terakota Kertas */}
              <Paper lift={5}>
                <Slab
                  x={-24}
                  y={-30}
                  w={48}
                  h={30}
                  color={C.hero}
                  shade={C.heroLo}
                  shadeH={0.22}
                  r="3px 3px 8px 8px"
                  grain={0.5}
                />
                <Slab
                  x={-29}
                  y={-36}
                  w={58}
                  h={7}
                  color={C.heroLo}
                  r={2}
                />
              </Paper>
            </div>
          </div>

          {/* LAPISAN 3: LANTAI PAPAN KERTAS + DUA SOROT CAHAYA BERTEMU DI TENGAH */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <Slab x={-120} y={525} w={1520} h={240} color={C.floor} r={0} grain={0.6} />
            {[545, 572, 604, 642, 686].map((fy, i) => (
              <Slab
                key={i}
                x={-120}
                y={fy}
                w={1520}
                h={2}
                color={C.floorLo}
                r={0}
              />
            ))}

            {/* Sorot cahaya pagi dari daun jendela kiri */}
            <div
              style={{
                position: 'absolute',
                left: 118,
                top: 148,
                width: 522,
                height: 507,
                backgroundColor: '#FFE396',
                opacity: leftBeamOpacity,
                clipPath: 'polygon(0% 0%, 39.5% 0%, 100% 100%, 11.8% 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Sorot cahaya senja dari daun jendela kanan (seimbang & sama besar) */}
            <div
              style={{
                position: 'absolute',
                left: 336,
                top: 148,
                width: 524,
                height: 507,
                backgroundColor: ROOM.dusk,
                opacity: rightBeamOpacity,
                clipPath: 'polygon(0% 0%, 39.3% 0%, 100% 100%, 14.1% 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* LAPISAN 4: PANGGUNG DUA TINGKAT, TOKOH KELUARGA & GULUNGAN KAIN POLOS (COCOK P09) */}
          <div style={{position: 'absolute', left: 0, top: 0}}>
            {/* Lampu Gantung Kertas Kiri */}
            <div
              style={{
                position: 'absolute',
                left: 625,
                top: 0,
                transform: `rotate(${lanternSwing1}deg)`,
                transformOrigin: '0px 0px',
              }}
            >
              <Paper lift={5}>
                <Slab x={-1} y={0} w={2} h={88} color={C.woodLo} r={0} />
                <Slab x={-10} y={82} w={20} h={5} color={C.wood} r={1.5} />
                <Slab
                  x={-18}
                  y={86}
                  w={36}
                  h={42}
                  color={C.amber}
                  shade={C.amberDim}
                  shadeH={0.2}
                  r="50%"
                />
                <Slab x={-10} y={126} w={20} h={5} color={C.wood} r={1.5} />
              </Paper>
            </div>

            {/* Lampu Gantung Kertas Kanan */}
            <div
              style={{
                position: 'absolute',
                left: 1045,
                top: 0,
                transform: `rotate(${lanternSwing2}deg)`,
                transformOrigin: '0px 0px',
              }}
            >
              <Paper lift={5}>
                <Slab x={-1} y={0} w={2} h={82} color={C.woodLo} r={0} />
                <Slab x={-9} y={77} w={18} h={5} color={C.wood} r={1.5} />
                <Slab
                  x={-16}
                  y={81}
                  w={32}
                  h={38}
                  color={C.amber}
                  shade={C.amberDim}
                  shadeH={0.2}
                  r="50%"
                />
                <Slab x={-9} y={117} w={18} h={5} color={C.wood} r={1.5} />
              </Paper>
            </div>

            {/* GULUNGAN KAIN POLOS MENGGANTUNG DI ATAS PANGGUNG (TIDAK DIBUKA & TANPA TULISAN) */}
            <div style={{position: 'absolute', left: 845, top: 134}}>
              <Boil seed="scrollP08" amp={0.4} rot={0.05}>
                <Paper lift={6}>
                  {/* Tali penggantung */}
                  <Slab x={-126} y={-134} w={2} h={134} color={C.woodLo} r={0} />
                  <Slab x={124} y={-134} w={2} h={134} color={C.woodLo} r={0} />
                  {/* Batang kayu penyangga */}
                  <Slab x={-152} y={-3} w={304} h={6} color={C.wood} r={3} />
                  {/* Gulungan kain polos (tetap tergulung rapat untuk pembuka P09) */}
                  <Slab
                    x={-138}
                    y={-9}
                    w={276}
                    h={18}
                    color={C.creamHi}
                    shade={C.creamLo}
                    shadeH={0.28}
                    r={9}
                    grain={0.4}
                  />
                  {/* Ujung gulungan spiral */}
                  <Slab x={-144} y={-8.5} w={17} h={17} color={C.cream} r="50%" />
                  <Slab x={-139} y={-3.5} w={7} h={7} color={C.creamLo} r="50%" />
                  <Slab x={127} y={-8.5} w={17} h={17} color={C.cream} r="50%" />
                  <Slab x={132} y={-3.5} w={7} h={7} color={C.creamLo} r="50%" />
                  {/* Pita pengikat gulungan */}
                  <Slab x={-72} y={-9.5} w={6} h={19} color={C.hero} r={1} />
                  <Slab x={66} y={-9.5} w={6} h={19} color={C.hero} r={1} />
                </Paper>
              </Boil>
            </div>

            {/* PANGGUNG DUA TINGKAT DI TENGAH (TINGKAT ATAS PENUH, ANAK TANGGA BAWAH KOSONG) */}
            <Paper lift={6}>
              {/* Tingkat atas (y = 476..538) */}
              <Slab
                x={635}
                y={482}
                w={420}
                h={56}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.25}
                r={3}
                grain={0.5}
              />
              <Slab x={630} y={476} w={430} h={10} color={C.woodHi} r={2} />

              {/* Anak tangga bawah (y = 532..580, sengaja KOSONG pada pose akhir) */}
              <Slab
                x={615}
                y={538}
                w={460}
                h={42}
                color={C.woodLo}
                shade={C.floorLo}
                shadeH={0.3}
                r={3}
                grain={0.5}
              />
              <Slab x={610} y={532} w={470} h={10} color={C.wood} r={2} />
            </Paper>

            {/* BARISAN RAPAT TOKOH-TOKOH DI TINGKAT ATAS PANGGUNG (y = 476) */}
            <Boil seed="stageCast" amp={0.4} rot={0.05}>
              {/* Tetangga 1 */}
              <PaperPerson
                x={668}
                y={476}
                scale={1.06}
                shirtColor={C.sage}
                pantsColor="#2E3A48"
                headTurn={headTurnRight}
                phase={0.2}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tetangga 2 */}
              <PaperPerson
                x={708}
                y={476}
                scale={1.08}
                shirtColor={C.amber}
                pantsColor="#394654"
                headTurn={headTurnRight}
                phase={0.9}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tokoh utama "KAMU": kemeja biru sabak, syal kertas hangat terakota, tas kantor */}
              <PaperPerson
                x={754}
                y={476}
                scale={1.12}
                shirtColor={ROOM.slate}
                pantsColor="#26313D"
                hasScarf
                scarfColor={C.hero}
                hasBriefcase
                headTurn={headTurnRight * 1.15}
                phase={1.5}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Pasangan (berhijab) */}
              <PaperPerson
                x={804}
                y={476}
                scale={1.06}
                shirtColor="#D98B6C"
                pantsColor="#34404E"
                hasHijab
                hijabColor={C.creamHi}
                headTurn={headTurnRight}
                phase={2.1}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Anak berseragam dengan tas sekolah */}
              <PaperPerson
                x={844}
                y={476}
                scale={0.86}
                shirtColor="#F4ECE0"
                pantsColor={ROOM.slate}
                hasBackpack
                headTurn={headTurnRight}
                phase={2.7}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tetangga 3 */}
              <PaperPerson
                x={884}
                y={476}
                scale={1.1}
                shirtColor={C.sageLo}
                pantsColor="#2B3642"
                headTurn={headTurnRight}
                phase={3.2}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tetangga 4 */}
              <PaperPerson
                x={928}
                y={476}
                scale={1.07}
                shirtColor={C.hero}
                pantsColor="#2E3A48"
                headTurn={headTurnRight}
                phase={3.8}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tetangga 5 */}
              <PaperPerson
                x={972}
                y={476}
                scale={1.09}
                shirtColor={ROOM.slate}
                pantsColor="#26313D"
                headTurn={headTurnRight}
                phase={4.3}
                frame={frame}
                swayScale={holdSettle}
              />
              {/* Tetangga 6 */}
              <PaperPerson
                x={1016}
                y={476}
                scale={1.05}
                shirtColor={C.brass}
                pantsColor="#2E3A48"
                headTurn={headTurnRight}
                phase={4.9}
                frame={frame}
                swayScale={holdSettle}
              />
            </Boil>

            {/* Pot Tanaman Kertas dari Pustaka Kit Sets di Sudut Kanan Lantai */}
            <div style={{transform: `translateX(${fgParallaxX}px)`}}>
              <Plant x={1105} y={392} s={0.72} />
            </div>
          </div>

          {/* TIRAI PINTU KERTAS PEMBUKA BEAT 1 (tersibak lembut frame 0-34) */}
          {curtainOpen < 0.999 ? (
            <Paper lift={7}>
              <Slab
                x={-660 * curtainOpen}
                y={-20}
                w={650}
                h={760}
                color={C.creamLo}
                shade="rgba(0,0,0,0.14)"
                shadeH={0.05}
                r={0}
                grain={0.55}
              />
              <Slab
                x={630 + 660 * curtainOpen}
                y={-20}
                w={660}
                h={760}
                color={C.tape}
                shade="rgba(0,0,0,0.14)"
                shadeH={0.05}
                r={0}
                grain={0.55}
              />
            </Paper>
          ) : null}
        </div>

        {/* PARTIKEL DEBU KERTAS MELAYANG PELAN */}
        {[
          {bx: 240, by: 260, r: 4, sp: 0.018, ph: 0.3},
          {bx: 380, by: 340, r: 3.5, sp: 0.015, ph: 1.4},
          {bx: 520, by: 220, r: 4.5, sp: 0.02, ph: 2.6},
          {bx: 710, by: 290, r: 3.5, sp: 0.016, ph: 3.7},
          {bx: 890, by: 240, r: 4, sp: 0.019, ph: 4.8},
          {bx: 1020, by: 330, r: 3, sp: 0.014, ph: 5.5},
        ].map((m, idx) => {
          const mx = m.bx + Math.sin(frame * m.sp + m.ph) * 18;
          const my = m.by + Math.cos(frame * (m.sp * 0.85) + m.ph) * 14;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: mx,
                top: my,
                width: m.r,
                height: m.r,
                borderRadius: '50%',
                backgroundColor: '#FFF8E2',
                opacity: 0.34,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Vinyet lembut standar balai */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)',
            pointerEvents: 'none',
          }}
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default P08;