// Adegan MG T06: Timbangan Pengendara — membandingkan bobot tarif dengan kualitas layanan transportasi umum.
// Panggung teater kertas halte pagi menampilkan pengendara di jalur macet dan timbangan kertas 5 beat (1014 frame).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, Disc, GrainOverlay, Paper, PaperDefs, Slab, SparkleBurst} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {FLOOR_Y} from './mgkit';

export const T06_DUR = 1014;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const PlainClockIcon: React.FC<{size?: number; handDeg?: number; accent?: string}> = ({
  size = 34,
  handDeg = 0,
  accent = C.go,
}) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: C.creamHi,
      border: `3px solid ${C.ink}`,
      boxShadow: '1px 2px 3px rgba(0,0,0,0.25)',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 4,
        width: 2.5,
        height: size * 0.34,
        backgroundColor: accent,
        borderRadius: 2,
        transformOrigin: '50% 100%',
        translate: '-50% 0',
        rotate: `${handDeg}deg`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size * 0.28,
        height: 2.5,
        backgroundColor: C.ink,
        borderRadius: 2,
        translate: '0 -50%',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 5,
        height: 5,
        borderRadius: '50%',
        backgroundColor: C.ink,
        translate: '-50% -50%',
      }}
    />
  </div>
);

const PaperHouse: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 136, height: 145, translate: '-50% -100%'}}>
    <Paper lift={6}>
      <Slab x={16} y={54} w={104} h={91} color={C.cream} shade={C.creamLo} shadeH={0.14} r={3} />
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 8,
          width: 128,
          height: 52,
          backgroundColor: C.hero,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <Slab x={56} y={96} w={24} h={49} color={C.wood} shade={C.woodLo} shadeH={0.2} r="4px 4px 0 0" />
      <Slab x={26} y={72} w={22} h={22} color={C.amber} r={2} />
      <Slab x={88} y={72} w={22} h={22} color={C.amber} r={2} />
    </Paper>
  </div>
);

const PaperOffice: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 148, height: 224, translate: '-50% -100%'}}>
    <Paper lift={6}>
      <Slab x={24} y={0} w={100} h={18} color={ROOM.navy} r="3px 3px 0 0" />
      <Slab x={12} y={16} w={124} h={208} color={ROOM.slate} shade={ROOM.navy} shadeH={0.12} r={4} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <Slab
            key={`${row}-${col}`}
            x={26 + col * 36}
            y={32 + row * 38}
            w={24}
            h={24}
            color={(row + col) % 2 === 0 ? C.amber : C.creamHi}
            r={2}
          />
        )),
      )}
      <Slab x={54} y={184} w={40} h={40} color={C.woodLo} r="3px 3px 0 0" />
    </Paper>
  </div>
);

const PaperBus: React.FC<{x: number; y: number; scale?: number; color?: string}> = ({
  x,
  y,
  scale = 1,
  color = C.cap,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 132 * scale,
      height: 58 * scale,
      translate: '-50% -100%',
    }}
  >
    <Paper lift={5}>
      <Slab
        x={0}
        y={4 * scale}
        w={132 * scale}
        h={44 * scale}
        color={color}
        shade={C.capLo}
        shadeH={0.22}
        r={8 * scale}
      />
      <Slab x={6 * scale} y={10 * scale} w={120 * scale} h={5 * scale} color={C.creamHi} r={2} />
      {[12, 38, 64, 90].map((wx, i) => (
        <Slab key={i} x={wx * scale} y={18 * scale} w={20 * scale} h={14 * scale} color={C.creamHi} r={3} />
      ))}
      <Disc x={30 * scale} y={48 * scale} d={20 * scale} color={C.ink} />
      <Disc x={30 * scale} y={48 * scale} d={8 * scale} color={C.metal} />
      <Disc x={102 * scale} y={48 * scale} d={20 * scale} color={C.ink} />
      <Disc x={102 * scale} y={48 * scale} d={8 * scale} color={C.metal} />
    </Paper>
  </div>
);

const TrafficCar: React.FC<{
  x: number;
  y: number;
  color: string;
  shade: string;
  scale?: number;
  hasDriver?: boolean;
  headTilt?: number;
}> = ({x, y, color, shade, scale = 1, hasDriver = false, headTilt = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 146 * scale,
      height: 68 * scale,
      translate: '-50% -100%',
    }}
  >
    <Paper lift={7}>
      <Slab
        x={24 * scale}
        y={4 * scale}
        w={86 * scale}
        h={28 * scale}
        color={color}
        r={`${12 * scale}px ${14 * scale}px 0 0`}
      />
      <Slab
        x={32 * scale}
        y={9 * scale}
        w={32 * scale}
        h={18 * scale}
        color={C.creamHi}
        r={`${6 * scale}px 2px 0 0`}
      />
      <Slab
        x={70 * scale}
        y={9 * scale}
        w={32 * scale}
        h={18 * scale}
        color={C.creamHi}
        r={`2px ${8 * scale}px 0 0`}
      />
      {hasDriver ? (
        <div
          style={{
            position: 'absolute',
            left: 84 * scale,
            top: 11 * scale,
            width: 18 * scale,
            height: 20 * scale,
            translate: '-50% 0',
            rotate: `${headTilt}deg`,
          }}
        >
          <div
            style={{
              width: 14 * scale,
              height: 15 * scale,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `${2 * scale}px solid ${C.inkSoft}`,
              margin: '0 auto',
            }}
          />
          <div
            style={{
              width: 18 * scale,
              height: 7 * scale,
              borderRadius: `${4 * scale}px ${4 * scale}px 0 0`,
              backgroundColor: ROOM.dusk,
              marginTop: 1,
            }}
          />
        </div>
      ) : null}
      <Slab
        x={0}
        y={28 * scale}
        w={146 * scale}
        h={28 * scale}
        color={color}
        shade={shade}
        shadeH={0.28}
        r={10 * scale}
      />
      <Disc x={34 * scale} y={56 * scale} d={24 * scale} color={C.ink} />
      <Disc x={34 * scale} y={56 * scale} d={10 * scale} color={C.metal} />
      <Disc x={112 * scale} y={56 * scale} d={24 * scale} color={C.ink} />
      <Disc x={112 * scale} y={56 * scale} d={10 * scale} color={C.metal} />
    </Paper>
  </div>
);

const ThoughtBubble: React.FC<{x: number; y: number; size: number; progress: number}> = ({
  x,
  y,
  size,
  progress,
}) => {
  if (progress <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${progress})`,
        opacity: progress,
      }}
    >
      <Paper lift={8}>
        <div
          style={{
            width: size,
            height: size * 0.74,
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `3px solid ${C.inkSoft}`,
            boxShadow: '2px 5px 8px rgba(0,0,0,0.22)',
          }}
        />
      </Paper>
    </div>
  );
};

export const T06: React.FC = () => {
  const f = useCurrentFrame();

  // Gorden kertas pembuka halus (frame 0..18)
  const curtainOpen = interpolate(f, [0, 18], [0, 1], {...CLAMP, easing: easeOut});
  const leftCurtainX = interpolate(curtainOpen, [0, 1], [0, -560], CLAMP);
  const rightCurtainX = interpolate(curtainOpen, [0, 1], [720, 1280], CLAMP);

  // Beat 1 (0..200): Piring kiri berisi karcis "Tarif" tampak ringan (~frame 128)
  const beat1Tilt = interpolate(f, [120, 155], [0, 3.5], {...CLAMP, easing: easeInOut});

  // Beat 2 (214..414): Tiga balok berat tiba bergantian di piring kanan
  const b1Drop = interpolate(f, [228, 254], [0, 1], {...CLAMP, easing: easeOut});
  const b2Drop = interpolate(f, [300, 326], [0, 1], {...CLAMP, easing: easeOut});
  const b3Drop = interpolate(f, [346, 372], [0, 1], {...CLAMP, easing: easeOut});

  const beat2Tilt =
    interpolate(f, [234, 262], [0, 5.5], {...CLAMP, easing: easeOut}) +
    interpolate(f, [306, 334], [0, 5.5], {...CLAMP, easing: easeOut}) +
    interpolate(f, [352, 380], [0, 5.0], {...CLAMP, easing: easeOut});

  // Beat 4 (732..873): Label "Tarif" melorot tipis & jatuh, karcis melayang naik, piring kiri makin ringan
  const tarifSquash = interpolate(f, [802, 822], [1, 0.16], {...CLAMP, easing: easeInOut});
  const tarifSlipY = interpolate(f, [816, 846], [0, 96], {...CLAMP, easing: easeInOut});
  const tarifFade = interpolate(f, [834, 848], [1, 0], CLAMP);
  const ghostTicketRise = interpolate(f, [818, 864], [0, 1], {...CLAMP, easing: easeOut});
  const beat4ExtraTilt = interpolate(f, [814, 844], [0, 3.0], {...CLAMP, easing: easeOut});

  // Beat 5 (896..1014): Timbangan kembali ke tengah, "Kualitas layanan" & "Harga tiket"
  const beat5Return = interpolate(f, [894, 922], [0, 1], {...CLAMP, easing: easeInOut});
  const beat5TiltAdjust = interpolate(f, [896, 924], [0, -2.0], {...CLAMP, easing: easeInOut});

  // Posisi dan skala timbangan lintas 5 beat
  const scaleShiftToSide = interpolate(f, [442, 470], [0, 1], {...CLAMP, easing: easeInOut});
  const scaleSideFactor = scaleShiftToSide * (1 - beat5Return);
  const scaleX = interpolate(scaleSideFactor, [0, 1], [640, 475], CLAMP);
  const scaleZoom = interpolate(scaleSideFactor, [0, 1], [1, 0.78], CLAMP);
  const scaleOpacity = interpolate(scaleSideFactor, [0, 1], [1, 0.92], CLAMP);

  const beamAngle = beat1Tilt + beat2Tilt + beat4ExtraTilt + beat5TiltAdjust;
  const rad = (beamAngle * Math.PI) / 180;
  const halfSpan = 255;
  const cordLen = 104;

  const leftTipX = -halfSpan * Math.cos(rad);
  const leftTipY = -halfSpan * Math.sin(rad);
  const rightTipX = halfSpan * Math.cos(rad);
  const rightTipY = halfSpan * Math.sin(rad);

  const leftPanX = leftTipX;
  const leftPanY = leftTipY + cordLen;
  const rightPanX = rightTipX;
  const rightPanY = rightTipY + cordLen;

  // Beat 3 (446..709): Bus datang beruntun & rapat, jalur menjangkau rumah-kantor, tepat waktu
  const beat3Show =
    interpolate(f, [444, 464], [0, 1], CLAMP) * interpolate(f, [714, 732], [1, 0], CLAMP);
  const routeReach = interpolate(f, [456, 510], [0, 1], {...CLAMP, easing: easeOut});
  const clockHandDeg = interpolate(f, [582, 598], [-45, 0], {...CLAMP, easing: easeOut});

  const bus1X = interpolate(f, [450, 610], [220, 1040], CLAMP);
  const bus2X = interpolate(f, [505, 665], [220, 1040], CLAMP);
  const bus3X = interpolate(f, [560, 720], [220, 1040], CLAMP);

  // Beat 4 (732..873): Bus jarang & berhenti jauh
  const beat4Show =
    interpolate(f, [730, 748], [0, 1], CLAMP) * interpolate(f, [878, 896], [1, 0], CLAMP);
  const sparseBusX = interpolate(f, [732, 885], [470, 620], CLAMP);

  // Gelembung pikiran kosong pengemudi ("berpikir dua kali") di Beat 3
  const bubble1 =
    interpolate(f, [634, 646], [0, 1], {...CLAMP, easing: easeOut}) *
    interpolate(f, [728, 738], [1, 0], CLAMP);
  const bubble2 =
    interpolate(f, [656, 668], [0, 1], {...CLAMP, easing: easeOut}) *
    interpolate(f, [728, 738], [1, 0], CLAMP);

  // Arah pandang pengemudi tanpa wajah
  const driverHeadTilt =
    interpolate(f, [18, 42], [0, -10], {...CLAMP, easing: easeOut}) +
    interpolate(f, [632, 650], [0, -8], {...CLAMP, easing: easeOut}) +
    interpolate(f, [732, 750], [0, 18], {...CLAMP, easing: easeInOut});

  // Gerak macet pelan pada jalur jalan di kaki panggung (hampir diam)
  const trafficCreep = interpolate(f, [0, T06_DUR], [0, 26], CLAMP);

  // Label Beat 5
  const qualityPlaqueIn = interpolate(f, [904, 922], [0, 1], {...CLAMP, easing: easeOut});
  const ticketPriceIn = interpolate(f, [964, 980], [0, 1], {...CLAMP, easing: easeOut});

  // Kemunculan rumah & kantor di tepi panggung
  const endpointsIn = interpolate(f, [12, 32], [0, 1], {...CLAMP, easing: easeOut});

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera dur={T06_DUR} yaw={14} drift={[-18, -6]} push={1.08} focus={0.5} depth={620} origin={[640, 480]}>
          {/* Lapisan 0: Dinding pagi, siluet kota jauh, dan halte polos */}
          <Depth z={0} cover>
            <Slab x={-180} y={-120} w={1640} h={960} color={C.creamHi} r={0} grain={0.55} />
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(ellipse at 50% 36%, rgba(255,248,232,0.45) 0%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.26) 100%)',
              }}
            />

            {/* Siluet bukit & bangunan kota kertas di kejauhan */}
            <Paper lift={2}>
              <Slab x={-140} y={440} w={520} h={180} color={C.creamLo} r="180px 180px 0 0" />
              <Slab x={880} y={425} w={560} h={195} color={C.creamLo} r="200px 200px 0 0" />
              {[
                {x: 240, y: 410, w: 68, h: 170, c: C.sage},
                {x: 318, y: 445, w: 54, h: 135, c: ROOM.khaki},
                {x: 890, y: 420, w: 62, h: 160, c: C.sage},
                {x: 964, y: 395, w: 74, h: 185, c: ROOM.slate},
              ].map((b, i) => (
                <Slab key={i} x={b.x} y={b.y} w={b.w} h={b.h} color={b.c} r="4px 4px 0 0" />
              ))}
            </Paper>

            {/* Halte bus kertas polos di sisi kiri latar belakang (tanpa tulisan/angka) */}
            <Paper lift={4}>
              <Slab x={38} y={376} w={132} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
              <Slab x={54} y={390} w={10} h={186} color={C.metalLo} r={2} />
              <Slab x={144} y={390} w={10} h={186} color={C.metalLo} r={2} />
              <Slab x={68} y={518} w={74} h={12} color={C.woodHi} r={3} />
              <Slab x={172} y={362} w={7} h={214} color={C.inkSoft} r={2} />
              <Disc x={175} y={356} d={36} color={C.cap} />
              <Disc x={175} y={356} d={22} color={C.creamHi} />
            </Paper>

            {/* Lantai kayu panggung & papan lis */}
            <Slab x={-180} y={FLOOR_Y} w={1640} h={260} color={C.floor} r={0} grain={0.6} />
            <div style={{position: 'absolute', left: -180, right: -180, top: FLOOR_Y + 34, height: 3, background: C.floorLo, opacity: 0.8}} />
            <div style={{position: 'absolute', left: -180, right: -180, top: FLOOR_Y + 94, height: 3, background: C.floorLo, opacity: 0.8}} />
            <Slab x={-180} y={FLOOR_Y - 24} w={1640} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          </Depth>

          {/* Lapisan 0.35: Rumah, kantor, dan lintasan bus (Beat 3 & Beat 4) */}
          <Depth z={0.35}>
            <div style={{opacity: endpointsIn, transform: `translateY(${(1 - endpointsIn) * 24}px)`}}>
              <PaperHouse x={126} y={FLOOR_Y - 24} />
              <PaperOffice x={1156} y={FLOOR_Y - 24} />
            </div>

            {/* Jalur bus rapat & menjangkau rumah-kantor (Beat 3) */}
            {beat3Show > 0.01 ? (
              <div style={{opacity: beat3Show}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 196,
                    top: 492,
                    width: 888 * routeReach,
                    height: 8,
                    backgroundColor: C.go,
                    borderRadius: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
                {[215, 640, 1065].map((sx, idx) => (
                  <Disc
                    key={idx}
                    x={sx}
                    y={496}
                    d={20}
                    color={routeReach > idx * 0.42 ? C.go : C.creamLo}
                  />
                ))}
                <PaperBus x={bus1X} y={490} scale={0.94} color={C.cap} />
                <PaperBus x={bus2X} y={490} scale={0.94} color={C.cap} />
                <PaperBus x={bus3X} y={490} scale={0.94} color={C.cap} />

                {/* Ikon jam polos tepat waktu di dekat kantor */}
                <div
                  style={{
                    position: 'absolute',
                    left: 1034,
                    top: 392,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlainClockIcon size={44} handDeg={clockHandDeg} accent={C.go} />
                </div>
                <SparkleBurst at={592} x={1034} y={392} seed="t06-punctual" spread={36} />
              </div>
            ) : null}

            {/* Jalur bus terputus & bus jarang (Beat 4) */}
            {beat4Show > 0.01 ? (
              <div style={{opacity: beat4Show}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 430,
                    top: 492,
                    width: 420,
                    height: 6,
                    borderTop: `5px dashed ${C.nogo}`,
                    opacity: 0.75,
                  }}
                />
                <Disc x={430} y={495} d={16} color={C.nogo} />
                <Disc x={850} y={495} d={16} color={C.nogo} />
                <PaperBus x={sparseBusX} y={490} scale={0.88} color={C.metalLo} />
              </div>
            ) : null}
          </Depth>

          {/* Lapisan 0.55: Timbangan kertas utama (hero) */}
          <Depth z={0.55}>
            <div
              style={{
                position: 'absolute',
                left: scaleX,
                top: FLOOR_Y - 24,
                transform: `scale(${scaleZoom})`,
                transformOrigin: '0 0',
                opacity: scaleOpacity,
              }}
            >
              <Boil seed="t06-scale" amp={0.4} rot={0.05}>
                {/* Dudukan & tiang tengah timbangan */}
                <Paper lift={9}>
                  <Slab x={-124} y={-24} w={248} h={24} color={C.wood} shade={C.woodLo} shadeH={0.35} r={6} />
                  <Slab x={-86} y={-42} w={172} h={20} color={C.woodHi} shade={C.wood} shadeH={0.3} r={5} />
                  <Slab x={-14} y={-292} w={28} h={254} color={C.wood} shade={C.woodLo} shadeH={0.2} r={5} />
                  <Disc x={0} y={-286} d={44} color={C.brass} />
                  <Disc x={0} y={-286} d={20} color={C.brassLo} />
                </Paper>

                {/* Lengan timbangan yang miring halus */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: -286,
                    rotate: `${beamAngle}deg`,
                  }}
                >
                  <Paper lift={10}>
                    <Slab x={-halfSpan - 14} y={-10} w={(halfSpan + 14) * 2} h={20} color={C.woodHi} shade={C.wood} shadeH={0.35} r={8} />
                    <Disc x={-halfSpan} y={0} d={24} color={C.brass} />
                    <Disc x={halfSpan} y={0} d={24} color={C.brass} />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -36,
                        width: 14,
                        height: 36,
                        translate: '-50% 0',
                        backgroundColor: C.brass,
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                      }}
                    />
                  </Paper>
                </div>

                {/* Tali & Piring Kiri (Tarif / Harga tiket) */}
                <div style={{position: 'absolute', left: leftPanX, top: -286 + leftPanY}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -56,
                      top: -cordLen,
                      width: 3,
                      height: cordLen,
                      backgroundColor: C.inkSoft,
                      transformOrigin: '50% 0',
                      rotate: '14deg',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 53,
                      top: -cordLen,
                      width: 3,
                      height: cordLen,
                      backgroundColor: C.inkSoft,
                      transformOrigin: '50% 0',
                      rotate: '-14deg',
                    }}
                  />
                  <Paper lift={9}>
                    <Slab x={-82} y={0} w={164} h={16} color={C.brass} shade={C.brassLo} shadeH={0.4} r="2px 2px 12px 12px" />
                  </Paper>

                  {/* Karcis "Tarif" (Beat 1..4) */}
                  {beat5Return < 0.5 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -4 + tarifSlipY,
                        transform: `translate(-50%, -100%) scaleY(${tarifSquash})`,
                        transformOrigin: '50% 100%',
                        opacity: tarifFade,
                      }}
                    >
                      <Paper lift={10}>
                        <div
                          style={{
                            backgroundColor: C.tape,
                            border: `3px dashed ${C.inkSoft}`,
                            borderRadius: 6,
                            padding: '10px 26px',
                            fontFamily: FONT.caption,
                            fontWeight: 900,
                            fontSize: 30,
                            color: C.ink,
                            whiteSpace: 'nowrap',
                            boxShadow: '2px 5px 8px rgba(0,0,0,0.28)',
                          }}
                        >
                          Tarif
                        </div>
                      </Paper>
                    </div>
                  ) : null}

                  {/* Bayangan karcis melayang naik tanpa bobot saat Beat 4 */}
                  {ghostTicketRise > 0.01 && beat5Return < 0.5 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -28 - ghostTicketRise * 76,
                        transform: 'translate(-50%, -100%) rotate(-6deg)',
                        opacity: (1 - ghostTicketRise * 0.45) * (1 - beat5Return),
                      }}
                    >
                      <div
                        style={{
                          width: 112,
                          height: 44,
                          borderRadius: 6,
                          border: `2.5px dashed ${C.inkSoft}`,
                          backgroundColor: 'rgba(243,238,230,0.65)',
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Label "Harga tiket" ringan di piring kiri pada Beat 5 */}
                  {ticketPriceIn > 0.01 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -4,
                        transform: `translate(-50%, -100%) scale(${ticketPriceIn})`,
                        transformOrigin: '50% 100%',
                      }}
                    >
                      <Paper lift={10}>
                        <div
                          style={{
                            backgroundColor: C.tape,
                            border: `3px dashed ${C.inkSoft}`,
                            borderRadius: 6,
                            padding: '10px 20px',
                            fontFamily: FONT.caption,
                            fontWeight: 900,
                            fontSize: 28,
                            color: C.ink,
                            whiteSpace: 'nowrap',
                            boxShadow: '2px 5px 8px rgba(0,0,0,0.28)',
                          }}
                        >
                          Harga tiket
                        </div>
                      </Paper>
                    </div>
                  ) : null}
                </div>

                {/* Tali & Piring Kanan (3 balok kualitas layanan) */}
                <div style={{position: 'absolute', left: rightPanX, top: -286 + rightPanY}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -76,
                      top: -cordLen,
                      width: 3,
                      height: cordLen,
                      backgroundColor: C.inkSoft,
                      transformOrigin: '50% 0',
                      rotate: '20deg',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 73,
                      top: -cordLen,
                      width: 3,
                      height: cordLen,
                      backgroundColor: C.inkSoft,
                      transformOrigin: '50% 0',
                      rotate: '-20deg',
                    }}
                  />
                  <Paper lift={9}>
                    <Slab x={-124} y={0} w={248} h={18} color={C.brass} shade={C.brassLo} shadeH={0.4} r="2px 2px 14px 14px" />
                  </Paper>

                  {/* Balok 1: Waktu dari pintu ke pintu */}
                  {b1Drop > 0.01 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -2 - (1 - b1Drop) * 140,
                        transform: 'translate(-50%, -100%)',
                        opacity: b1Drop,
                      }}
                    >
                      <Paper lift={10}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            backgroundColor: C.cream,
                            border: `3px solid ${C.ink}`,
                            borderBottom: `6px solid ${C.hero}`,
                            borderRadius: 8,
                            padding: '11px 16px',
                            boxShadow: '2px 5px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                            <div style={{width: 12, height: 12, backgroundColor: C.hero, borderRadius: 2}} />
                            <div style={{width: 14, height: 3, backgroundColor: C.ink}} />
                            <div style={{width: 10, height: 16, backgroundColor: ROOM.slate, borderRadius: 2}} />
                          </div>
                          <span
                            style={{
                              fontFamily: FONT.label,
                              fontWeight: 800,
                              fontSize: 20,
                              color: C.ink,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Waktu dari pintu ke pintu
                          </span>
                        </div>
                      </Paper>
                    </div>
                  ) : null}

                  {/* Balok 2: Kenyamanan (ikon bantal kursi) */}
                  {b2Drop > 0.01 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -54 - (1 - b2Drop) * 140,
                        transform: 'translate(-50%, -100%)',
                        opacity: b2Drop,
                      }}
                    >
                      <Paper lift={11}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            backgroundColor: C.creamHi,
                            border: `3px solid ${C.ink}`,
                            borderBottom: `6px solid ${ROOM.teal}`,
                            borderRadius: 12,
                            padding: '10px 22px',
                            boxShadow: '2px 5px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 18,
                              backgroundColor: C.amber,
                              borderRadius: 6,
                              border: `2px solid ${C.ink}`,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: FONT.label,
                              fontWeight: 800,
                              fontSize: 22,
                              color: C.ink,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Kenyamanan
                          </span>
                        </div>
                      </Paper>
                    </div>
                  ) : null}

                  {/* Balok 3: Kepastian tepat waktu (ikon jam polos) */}
                  {b3Drop > 0.01 ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -104 - (1 - b3Drop) * 140,
                        transform: 'translate(-50%, -100%)',
                        opacity: b3Drop,
                      }}
                    >
                      <Paper lift={12}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            backgroundColor: C.tape,
                            border: `3px solid ${C.ink}`,
                            borderBottom: `6px solid ${C.purple}`,
                            borderRadius: 8,
                            padding: '10px 18px',
                            boxShadow: '2px 5px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          <PlainClockIcon size={28} handDeg={0} accent={C.purple} />
                          <span
                            style={{
                              fontFamily: FONT.label,
                              fontWeight: 800,
                              fontSize: 21,
                              color: C.ink,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Kepastian tepat waktu
                          </span>
                        </div>
                      </Paper>
                    </div>
                  ) : null}
                </div>

                {/* Label "Kualitas layanan" di tiang timbangan pada Beat 5 */}
                {qualityPlaqueIn > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: -128,
                      transform: `translate(-50%, -50%) scale(${qualityPlaqueIn})`,
                    }}
                  >
                    <Paper lift={13}>
                      <div
                        style={{
                          backgroundColor: C.cap,
                          border: `3px solid ${C.creamHi}`,
                          borderBottom: `6px solid ${C.capLo}`,
                          borderRadius: 8,
                          padding: '10px 20px',
                          fontFamily: FONT.caption,
                          fontWeight: 900,
                          fontSize: 24,
                          color: C.tagText,
                          whiteSpace: 'nowrap',
                          boxShadow: '2px 6px 10px rgba(0,0,0,0.35)',
                        }}
                      >
                        Kualitas layanan
                      </div>
                    </Paper>
                  </div>
                ) : null}
              </Boil>
            </div>
          </Depth>

          {/* Lapisan 0.85: Jalur jalan di kaki panggung & pengemudi tanpa wajah di mobil */}
          <Depth z={0.85}>
            {/* Rel jalan tipis & marka putus-putus */}
            <Slab x={-160} y={656} w={1600} h={10} color={C.boardLo} r={2} />
            {Array.from({length: 18}).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: -120 + i * 88 + trafficCreep,
                  top: 660,
                  width: 42,
                  height: 3,
                  backgroundColor: C.creamLo,
                  opacity: 0.7,
                }}
              />
            ))}

            {/* Barisan mobil padat di jalur jalan (pengukur macet tanpa angka) */}
            <TrafficCar x={86 + trafficCreep} y={658} color={ROOM.slate} shade={ROOM.navy} scale={0.94} />
            <TrafficCar
              x={268 + trafficCreep}
              y={658}
              color={C.amber}
              shade={C.amberDim}
              scale={1.04}
              hasDriver
              headTilt={driverHeadTilt}
            />
            <TrafficCar x={452 + trafficCreep} y={658} color={ROOM.sage} shade={C.sageLo} scale={0.94} />
            <TrafficCar x={628 + trafficCreep} y={658} color={C.hero} shade={C.heroLo} scale={0.94} />
            <TrafficCar x={804 + trafficCreep} y={658} color={ROOM.khaki} shade={C.wood} scale={0.94} />
            <TrafficCar x={980 + trafficCreep} y={658} color={ROOM.purple} shade={C.screen} scale={0.94} />
            <TrafficCar x={1156 + trafficCreep} y={658} color={ROOM.teal} shade={C.sageLo} scale={0.94} />

            {/* Dua gelembung pikiran kosong saat pengemudi berpikir dua kali (Beat 3) */}
            <ThoughtBubble x={338 + trafficCreep} y={562} size={34} progress={bubble1} />
            <ThoughtBubble x={386 + trafficCreep} y={518} size={54} progress={bubble2} />
          </Depth>
        </OrbitCamera>
      </FilmWeave>

      {/* Gorden kertas teater pembuka di sisi kiri dan kanan */}
      <div
        style={{
          position: 'absolute',
          left: leftCurtainX,
          top: 0,
          width: 680,
          height: 720,
          backgroundColor: C.tag,
          borderRight: `8px solid ${C.heroLo}`,
          boxShadow: '6px 0 18px rgba(0,0,0,0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: rightCurtainX,
          top: 0,
          width: 680,
          height: 720,
          backgroundColor: C.tag,
          borderLeft: `8px solid ${C.heroLo}`,
          boxShadow: '-6px 0 18px rgba(0,0,0,0.35)',
        }}
      />

      <GrainOverlay />
    </AbsoluteFill>
  );
};