// Adegan T04: Peta lipat pop-up kota Dunkirk terbuka menunjukkan perbaikan layanan yang memindahkan pengemudi ke bus.
// Durasi 434 frame (14,48 detik @30fps), sinkron dengan narasi scene 058–062 pada panggung Teater Kertas Halte Pagi.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, H, ROOM, W} from '../../lib/tokens';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Tag} from './mgkit';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {FilmWeave} from '../../lib/paper/look';
import {Plant, Shelf, Window} from '../../lib/paper/sets';
import {TapeCorners} from '../../lib/paper/tape';
import {PopUpOpen} from '../../lib/paper/transitions';

export const T04_DUR = 434;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Cue frame lokal (relatif terhadap frame 5487 = 182,90 dtk)
const B1_CARD_IN = 18;
const B1_RIBBON_IN = 46;
const B2_MAP_OPEN = 98;
const B2_ROUTE_IN = 114;
const B3_BUSES_IN = 169;
const B4_WINGS_OPEN = 220;
const B5_TICKET_DIM = 274;
const B5_BUS_ARRIVE = 284;
const B5_DRIVER_EXIT = 298;
const B5_DRIVER_WALK = 324;
const B5_DRIVER_BOARD = 364;

const PaperCar: React.FC<{
  x: number;
  y: number;
  color: string;
  shade: string;
  hasDriver?: boolean;
  doorOpen?: boolean;
}> = ({x, y, color, shade, hasDriver = true, doorOpen = false}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 118, height: 48, translate: '-50% 0'}}>
    <Paper lift={4}>
      {/* Kabin atas */}
      <Slab x={24} y={0} w={66} h={22} color={color} shade={shade} shadeH={0.2} r="12px 14px 2px 2px" />
      {/* Jendela kabin */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 5,
          width: 24,
          height: 14,
          borderRadius: '6px 2px 2px 2px',
          background: hasDriver ? C.creamHi : C.boardLo,
          border: hasDriver ? 'none' : `2px dashed ${C.creamLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 5,
          width: 22,
          height: 14,
          borderRadius: '2px 6px 2px 2px',
          background: hasDriver ? C.creamHi : C.boardLo,
        }}
      />
      {/* Siluet pengemudi tanpa wajah di balik setir */}
      {hasDriver ? (
        <div
          style={{
            position: 'absolute',
            left: 65,
            top: 7,
            width: 11,
            height: 11,
            borderRadius: '50%',
            background: C.inkSoft,
          }}
        />
      ) : null}
      {/* Badan mobil */}
      <Slab x={4} y={19} w={110} h={21} color={color} shade={shade} shadeH={0.28} r={7} />
      {/* Pintu terbuka saat pengemudi turun */}
      {doorOpen ? (
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 20,
            width: 26,
            height: 20,
            background: shade,
            borderRadius: 4,
            transformOrigin: 'right center',
            transform: 'skewY(-14deg) translateX(6px)',
            boxShadow: '2px 4px 6px rgba(0,0,0,0.3)',
          }}
        />
      ) : null}
      {/* Roda kertas */}
      {[28, 90].map((wx) => (
        <div
          key={wx}
          style={{
            position: 'absolute',
            left: wx - 11,
            top: 31,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: C.ink,
            border: `3px solid ${C.creamLo}`,
          }}
        />
      ))}
    </Paper>
  </div>
);

const MiniRouteBus: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 66 * scale,
      height: 34 * scale,
      translate: '-50% -100%',
    }}
  >
    <Paper lift={4}>
      <Slab
        x={0}
        y={0}
        w={66 * scale}
        h={28 * scale}
        color={C.hero}
        shade={C.heroLo}
        shadeH={0.22}
        r={6 * scale}
      />
      <Slab
        x={4 * scale}
        y={4 * scale}
        w={58 * scale}
        h={5 * scale}
        color={C.creamHi}
        r={2 * scale}
      />
      {[10, 26, 42].map((wx) => (
        <div
          key={wx}
          style={{
            position: 'absolute',
            left: wx * scale,
            top: 11 * scale,
            width: 12 * scale,
            height: 9 * scale,
            borderRadius: 2 * scale,
            background: C.creamHi,
          }}
        />
      ))}
      {[15, 51].map((rx) => (
        <div
          key={rx}
          style={{
            position: 'absolute',
            left: (rx - 6) * scale,
            top: 23 * scale,
            width: 12 * scale,
            height: 12 * scale,
            borderRadius: '50%',
            background: C.ink,
            border: `${2 * scale}px solid ${C.creamLo}`,
          }}
        />
      ))}
    </Paper>
  </div>
);

const LargeHalteBus: React.FC<{x: number; y: number; hasPassenger: boolean}> = ({x, y, hasPassenger}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 224, height: 84, translate: '-50% 0'}}>
    <Paper lift={7}>
      {/* Badan bus */}
      <Slab x={0} y={0} w={224} h={72} color={C.go} shade={C.goDim} shadeH={0.18} r="12px 16px 8px 8px" />
      {/* Atap krem */}
      <Slab x={6} y={4} w={212} h={10} color={C.creamHi} r={5} />
      {/* Garis aksen */}
      <Slab x={4} y={44} w={216} h={6} color={C.amber} r={2} />
      {/* Kabin pengemudi bus bertopi (kiri/depan menghadap kiri) */}
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: 18,
          width: 34,
          height: 24,
          borderRadius: '8px 3px 3px 3px',
          background: C.creamHi,
        }}
      >
        {/* Kepala pengemudi bus tanpa wajah + topi */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 7,
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: C.creamLo,
            border: `2px solid ${C.inkSoft}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 7,
            top: 4,
            width: 18,
            height: 5,
            borderRadius: 2,
            background: C.cap,
          }}
        />
      </div>
      {/* Tiga jendela penumpang */}
      {[56, 102, 148].map((wx, idx) => (
        <div
          key={wx}
          style={{
            position: 'absolute',
            left: wx,
            top: 18,
            width: 38,
            height: 22,
            borderRadius: 4,
            background: C.creamHi,
            overflow: 'hidden',
          }}
        >
          {/* Penumpang baru duduk di jendela tengah setelah naik bus */}
          {idx === 1 && hasPassenger ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 3,
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: C.creamLo,
                  border: `2px solid ${C.inkSoft}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 16,
                  width: 17,
                  height: 10,
                  borderRadius: 4,
                  background: ROOM.dusk,
                }}
              />
            </>
          ) : null}
        </div>
      ))}
      {/* Pintu lipat bus di sisi kanan */}
      <div
        style={{
          position: 'absolute',
          left: 192,
          top: 18,
          width: 22,
          height: 48,
          borderRadius: 4,
          background: C.goDim,
          border: `2px solid ${C.creamHi}`,
        }}
      />
      {/* Roda */}
      {[46, 174].map((rx) => (
        <div
          key={rx}
          style={{
            position: 'absolute',
            left: rx - 16,
            top: 58,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: C.ink,
            border: `4px solid ${C.creamLo}`,
          }}
        />
      ))}
    </Paper>
  </div>
);

const WalkingDriver: React.FC<{x: number; y: number; stepPhase: number; opacity: number}> = ({
  x,
  y,
  stepPhase,
  opacity,
}) => {
  if (opacity <= 0.01) return null;
  const stride = Math.sin(stepPhase) * 6;
  const bobY = Math.abs(Math.cos(stepPhase)) * -3;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bobY,
        width: 44,
        height: 92,
        translate: '-50% -100%',
        opacity,
      }}
    >
      <Paper lift={5}>
        {/* Kepala polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 24,
            height: 24,
            translate: '-50% 0',
            borderRadius: '50%',
            background: C.creamLo,
            border: `2.5px solid ${C.inkSoft}`,
          }}
        />
        {/* Badan */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 27,
            width: 28,
            height: 38,
            translate: '-50% 0',
            borderRadius: 6,
            background: ROOM.dusk,
          }}
        />
        {/* Kaki melangkah tenang */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 64,
            width: 10,
            height: 26,
            translate: `${-11 + stride}px 0`,
            borderRadius: 4,
            background: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 64,
            width: 10,
            height: 26,
            translate: `${1 - stride}px 0`,
            borderRadius: 4,
            background: C.inkSoft,
          }}
        />
      </Paper>
    </div>
  );
};

export const T04: React.FC = () => {
  const f = useCurrentFrame();

  // Beat 1 -> Beat 2: karcis + kartu layanan bergeser rapi ke pita atas agar peta terbuka lapang
  const topDockU = interpolate(f, [B2_MAP_OPEN - 4, B2_MAP_OPEN + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 5: karcis "Gratis" redup & bergeser ke pinggir kiri (bukan penggerak utama)
  const ticketAsideU = interpolate(f, [B5_TICKET_DIM, B5_TICKET_DIM + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Posisi dan skala karcis "Gratis"
  const ticketX =
    interpolate(topDockU, [0, 1], [505, 390], CLAMP) +
    interpolate(ticketAsideU, [0, 1], [0, -225], CLAMP);
  const ticketY = interpolate(topDockU, [0, 1], [116, 40], CLAMP);
  const ticketScale =
    interpolate(topDockU, [0, 1], [1, 0.72], CLAMP) *
    interpolate(ticketAsideU, [0, 1], [1, 0.92], CLAMP);
  const ticketOpacity = interpolate(ticketAsideU, [0, 1], [1, 0.42], CLAMP);

  // Posisi dan skala kartu "Perbaikan layanan"
  const serviceCardInU = interpolate(f, [B1_CARD_IN, B1_CARD_IN + 18], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const serviceX =
    interpolate(serviceCardInU, [0, 1], [545, 760], CLAMP) +
    interpolate(topDockU, [0, 1], [0, -145], CLAMP);
  const serviceY = interpolate(topDockU, [0, 1], [108, 36], CLAMP);
  const serviceScale = interpolate(topDockU, [0, 1], [1, 0.72], CLAMP);

  // Pita pengikat di Beat 1 (memudar saat kedua kartu berpisah di Beat 5)
  const ribbonInU = interpolate(f, [B1_RIBBON_IN, B1_RIBBON_IN + 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const ribbonW = interpolate(ribbonInU, [0, 1], [40, 490], CLAMP);
  const ribbonOpacity = ribbonInU * interpolate(ticketAsideU, [0, 0.5], [1, 0], CLAMP);

  // Beat 2: Peta Dunkirk terbuka seperti buku pop-up
  const mapOpenU = interpolate(f, [B2_MAP_OPEN, B2_MAP_OPEN + 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const mapTop = interpolate(mapOpenU, [0, 1], [335, 198], CLAMP);
  const mapHeight = interpolate(mapOpenU, [0, 1], [150, 292], CLAMP);

  // Beat 2: Jalur rute baru terbentang
  const routeDrawU = interpolate(f, [B2_ROUTE_IN, B2_ROUTE_IN + 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 4: Sayap kiri & kanan peta melipat terbuka melebar
  const wingsOpenU = interpolate(f, [B4_WINGS_OPEN, B4_WINGS_OPEN + 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 5: Bus besar datang tepat waktu ke halte
  const busX = interpolate(f, [B5_BUS_ARRIVE, B5_BUS_ARRIVE + 28], [1340, 915], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 5: Pengemudi turun dari mobil (f 298), berjalan ke halte (f 324..364), naik bus (f 364..376)
  const driverOut = f >= B5_DRIVER_EXIT;
  const driverBoarded = f >= B5_DRIVER_BOARD + 10;
  const walkU = interpolate(f, [B5_DRIVER_WALK, B5_DRIVER_BOARD], [0, 1], CLAMP);
  const walkX = interpolate(walkU, [0, 1], [545, 975], CLAMP);
  const boardFade = interpolate(f, [B5_DRIVER_BOARD, B5_DRIVER_BOARD + 10], [1, 0], CLAMP);
  const exitFade = interpolate(f, [B5_DRIVER_EXIT, B5_DRIVER_EXIT + 8], [0, 1], CLAMP);
  const driverOpacity = driverOut && !driverBoarded ? exitFade * boardFade : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <PopUpOpen dur={14} from={0.25} table={C.woodLo}>
        <FilmWeave amp={0.25} flicker={0.25}>
          <OrbitCamera
            dur={T04_DUR}
            yaw={15}
            drift={[-26, -8]}
            push={1.08}
            focus={0.45}
            depth={720}
            origin={[640, 380]}
          >
            {/* LAPISAN LATAR BELAKANG (z = 0.05) */}
            <Depth z={0.05} cover>
              <Slab x={0} y={0} w={W} h={H} color={C.creamHi} r={0} grain={0.55} />
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.28) 100%)',
                }}
              />
              {/* Jendela pagi & rak dinding tanpa teks */}
              <Window x={64} y={64} w={150} h={195} night={false} />
              <Shelf x={1055} y={192} w={165} books={3} />

              {/* Siluet atap & tiang halte pagi (polos tanpa tulisan) */}
              <Paper lift={3}>
                <Slab x={860} y={248} w={270} h={16} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={4} />
                <Slab x={885} y={264} w={14} h={312} color={C.metalLo} r={2} />
                <Slab x={1095} y={264} w={14} h={312} color={C.metalLo} r={2} />
                {/* Tiang rambu halte polos */}
                <Slab x={818} y={272} w={8} h={304} color={C.inkSoft} r={2} />
                <div
                  style={{
                    position: 'absolute',
                    left: 801,
                    top: 256,
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: C.amber,
                    border: `4px solid ${C.creamHi}`,
                  }}
                />
              </Paper>

              {/* Lantai panggung & jalur jalan di kaki panggung */}
              <Slab x={0} y={FLOOR_Y} w={W} h={H - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
              <Slab x={0} y={FLOOR_Y - 24} w={W} h={24} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
              {/* Jalur jalan aspal kertas */}
              <Slab x={0} y={FLOOR_Y + 4} w={W} h={94} color={C.board} shade={C.boardLo} shadeH={0.18} r={0} />
              {/* Marka jalur putus-putus */}
              {Array.from({length: 14}).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 24 + i * 92,
                    top: FLOOR_Y + 49,
                    width: 48,
                    height: 4,
                    background: C.creamLo,
                    opacity: 0.55,
                  }}
                />
              ))}
            </Depth>

            {/* LAPISAN UTAMA PANGGUNG (z = 0.45) */}
            <Depth z={0.45}>
              {/* 1. KARTU "Perbaikan layanan" (Beat 1 ditarik dari belakang karcis) */}
              <div
                style={{
                  position: 'absolute',
                  left: serviceX,
                  top: serviceY,
                  width: 310,
                  height: 112,
                  translate: '-50% 0',
                  scale: `${serviceScale}`,
                  opacity: interpolate(f, [B1_CARD_IN - 2, B1_CARD_IN + 6], [0, 1], CLAMP),
                }}
              >
                <Boil seed="service-card" amp={0.4} rot={0.05}>
                  <Paper lift={6}>
                    <Slab
                      x={0}
                      y={0}
                      w={310}
                      h={112}
                      color={C.cream}
                      shade={C.creamLo}
                      shadeH={0.14}
                      r={10}
                    />
                    <Slab x={10} y={10} w={290} h={92} color={C.creamHi} r={6} />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 18px',
                        textAlign: 'center',
                        fontFamily: FONT.caption,
                        fontWeight: 900,
                        fontSize: 30,
                        lineHeight: 1.08,
                        color: C.ink,
                      }}
                    >
                      Perbaikan layanan
                    </div>
                  </Paper>
                  <TapeCorners x={0} y={0} w={310} h={112} len={22} />
                </Boil>
              </div>

              {/* 2. KARCIS "Gratis" (Beat 1 pusat panggung -> Beat 5 redup & bergeser ke pinggir kiri) */}
              <div
                style={{
                  position: 'absolute',
                  left: ticketX,
                  top: ticketY,
                  width: 224,
                  height: 102,
                  translate: '-50% 0',
                  scale: `${ticketScale}`,
                  opacity: ticketOpacity,
                }}
              >
                <Boil seed="gratis-ticket" amp={0.4} rot={0.05}>
                  <Paper lift={7}>
                    <Slab
                      x={0}
                      y={0}
                      w={224}
                      h={102}
                      color={C.amber}
                      shade={C.amberDim}
                      shadeH={0.14}
                      r={10}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 10,
                        border: `3px dashed ${C.inkSoft}`,
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: FONT.banner,
                        fontSize: 34,
                        letterSpacing: '0.03em',
                        color: C.ink,
                        textTransform: 'uppercase',
                      }}
                    >
                      Gratis
                    </div>
                  </Paper>
                </Boil>
              </div>

              {/* 3. PITA PENGIKAT "gratis yang dibarengi" (Beat 1) */}
              {ribbonOpacity > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 632,
                    top: interpolate(topDockU, [0, 1], [156, 82], CLAMP),
                    width: ribbonW,
                    height: 18,
                    translate: '-50% 0',
                    scale: `${interpolate(topDockU, [0, 1], [1, 0.72], CLAMP)}`,
                    opacity: ribbonOpacity,
                    pointerEvents: 'none',
                  }}
                >
                  <Paper lift={8}>
                    <Slab x={0} y={0} w={ribbonW} h={18} color={C.tag} shade="#9E3F29" shadeH={0.25} r={4} />
                    {/* Simpul pita di tengah */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: -8,
                        width: 34,
                        height: 34,
                        translate: '-50% 0',
                        borderRadius: 8,
                        rotate: '45deg',
                        background: C.tag,
                        border: `2px solid ${C.tagText}`,
                      }}
                    />
                  </Paper>
                </div>
              ) : null}

              {/* 4. LABEL JUDUL PETA "Dunkirk" */}
              <PopIn at={10}>
                <div
                  style={{
                    position: 'absolute',
                    left: 640,
                    top: interpolate(mapOpenU, [0, 1], [292, 144], CLAMP),
                    translate: '-50% 0',
                    backgroundColor: C.ink,
                    color: C.creamHi,
                    padding: '8px 26px 10px',
                    borderRadius: 6,
                    fontFamily: FONT.banner,
                    fontSize: 28,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: '2px 5px 8px rgba(0,0,0,0.28)',
                  }}
                >
                  Dunkirk
                </div>
              </PopIn>

              {/* 5. PETA LIPAT POP-UP KOTA DUNKIRK (Beat 1 terlipat -> Beat 2 terbuka -> Beat 4 melebar) */}
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: mapTop,
                  width: 920,
                  height: mapHeight,
                  translate: '-50% 0',
                }}
              >
                {/* SAYAP KIRI PETA (Melipat terbuka di Beat 4: rumah-rumah tersambung ke jalur) */}
                {wingsOpenU > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: 0,
                      width: 210,
                      height: mapHeight,
                      transformOrigin: 'right center',
                      transform: `perspective(900px) rotateY(${(1 - wingsOpenU) * 88}deg)`,
                      opacity: interpolate(wingsOpenU, [0, 0.15], [0, 1], CLAMP),
                    }}
                  >
                    <Paper lift={6}>
                      <Slab
                        x={0}
                        y={0}
                        w={210}
                        h={mapHeight}
                        color={C.cream}
                        shade={C.creamLo}
                        shadeH={0.08}
                        r="10px 0 0 10px"
                      />
                      {/* Garis lipatan kertas */}
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 6,
                          background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.18))',
                        }}
                      />
                      {/* Dua rumah kertas pop-up di tepi kiri */}
                      {[
                        {hx: 38, hy: 58, wall: ROOM.terracotta},
                        {hx: 118, hy: 70, wall: ROOM.mustard},
                      ].map((h, idx) => (
                        <div key={idx} style={{position: 'absolute', left: h.hx, top: h.hy}}>
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '28px solid transparent',
                              borderRight: '28px solid transparent',
                              borderBottom: `22px solid ${C.woodLo}`,
                            }}
                          />
                          <Slab x={6} y={22} w={44} h={34} color={h.wall} r={2} />
                          <Slab x={22} y={36} w={12} h={20} color={C.creamHi} r={2} />
                        </div>
                      ))}
                      {/* Sambungan jalur rute ke perumahan */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 48,
                          right: 0,
                          top: 152,
                          height: 12,
                          borderRadius: '6px 0 0 6px',
                          background: C.cap,
                          transform: `scaleX(${wingsOpenU})`,
                          transformOrigin: 'right center',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 44,
                          top: 147,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: C.creamHi,
                          border: `4px solid ${C.cap}`,
                        }}
                      />
                    </Paper>
                  </div>
                ) : null}

                {/* SAYAP KANAN PETA (Melipat terbuka di Beat 4: kantor-kantor tersambung ke jalur) */}
                {wingsOpenU > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 0,
                      width: 210,
                      height: mapHeight,
                      transformOrigin: 'left center',
                      transform: `perspective(900px) rotateY(${-(1 - wingsOpenU) * 88}deg)`,
                      opacity: interpolate(wingsOpenU, [0, 0.15], [0, 1], CLAMP),
                    }}
                  >
                    <Paper lift={6}>
                      <Slab
                        x={0}
                        y={0}
                        w={210}
                        h={mapHeight}
                        color={C.cream}
                        shade={C.creamLo}
                        shadeH={0.08}
                        r="0 10px 10px 0"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 6,
                          background: 'linear-gradient(270deg, rgba(0,0,0,0), rgba(0,0,0,0.18))',
                        }}
                      />
                      {/* Dua gedung kantor kertas pop-up di tepi kanan */}
                      {[
                        {ox: 34, oy: 42, h: 72, col: ROOM.slate},
                        {ox: 106, oy: 54, h: 60, col: ROOM.teal},
                      ].map((o, idx) => (
                        <div key={idx} style={{position: 'absolute', left: o.ox, top: o.oy}}>
                          <Slab x={0} y={0} w={54} h={o.h} color={o.col} r="4px 4px 0 0" />
                          {[10, 28].map((wx) =>
                            [10, 26, 42].map((wy) =>
                              wy + 10 < o.h ? (
                                <div
                                  key={`${wx}-${wy}`}
                                  style={{
                                    position: 'absolute',
                                    left: wx,
                                    top: wy,
                                    width: 14,
                                    height: 10,
                                    background: C.creamHi,
                                    borderRadius: 2,
                                  }}
                                />
                              ) : null,
                            ),
                          )}
                        </div>
                      ))}
                      {/* Sambungan jalur rute ke perkantoran */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 48,
                          top: 152,
                          height: 12,
                          borderRadius: '0 6px 6px 0',
                          background: C.cap,
                          transform: `scaleX(${wingsOpenU})`,
                          transformOrigin: 'left center',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: 44,
                          top: 147,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: C.creamHi,
                          border: `4px solid ${C.cap}`,
                        }}
                      />
                    </Paper>
                  </div>
                ) : null}

                {/* PANEL UTAMA TENGAH PETA DUNKIRK */}
                <div
                  style={{
                    position: 'absolute',
                    left: 220,
                    top: 0,
                    width: 480,
                    height: mapHeight,
                  }}
                >
                  <Paper lift={8}>
                    <Slab
                      x={0}
                      y={0}
                      w={480}
                      h={mapHeight}
                      color={C.creamHi}
                      shade={C.creamLo}
                      shadeH={0.08}
                      r={10}
                    />
                    {/* Garis lipatan peta saat terlipat di Beat 1 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 160,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: C.creamLo,
                        opacity: 0.7,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 320,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: C.creamLo,
                        opacity: 0.7,
                      }}
                    />

                    {/* Blok kota latar dekoratif (polos tanpa tulisan/angka) */}
                    {mapOpenU > 0.25 ? (
                      <div style={{opacity: interpolate(mapOpenU, [0.25, 0.7], [0, 1], CLAMP)}}>
                        <Slab x={28} y={24} w={110} h={64} color={ROOM.sage} r={6} />
                        <Slab x={342} y={24} w={110} h={64} color={ROOM.sage} r={6} />
                        <Slab x={28} y={202} w={118} h={66} color={C.cream} r={6} />
                        <Slab x={334} y={202} w={118} h={66} color={C.cream} r={6} />
                      </div>
                    ) : null}

                    {/* BEAT 2: Jalur rute baru terbentang menyambung halte demi halte */}
                    {routeDrawU > 0.01 ? (
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            left: 36,
                            top: 152,
                            width: 408 * routeDrawU,
                            height: 12,
                            borderRadius: 6,
                            background: C.cap,
                          }}
                        />
                        {/* Empat titik halte di sepanjang rute */}
                        {[44, 174, 306, 436].map((sx, idx) => {
                          const stopVisible = routeDrawU >= idx * 0.24;
                          return stopVisible ? (
                            <div
                              key={sx}
                              style={{
                                position: 'absolute',
                                left: sx - 11,
                                top: 147,
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: C.creamHi,
                                border: `4px solid ${C.cap}`,
                              }}
                            />
                          ) : null;
                        })}
                      </>
                    ) : null}

                    {/* BEAT 3: Bus-bus kertas berulang dengan jarak rapat dan teratur */}
                    {[0, 1, 2, 3].map((idx) => {
                      const busCue = B3_BUSES_IN + idx * 5;
                      if (f < busCue) return null;
                      const popU = interpolate(f, [busCue, busCue + 8], [0, 1], {
                        ...CLAMP,
                        easing: Easing.out(Easing.back(1.4)),
                      });
                      const glideX = interpolate(f, [B3_BUSES_IN, T04_DUR], [0, 18], CLAMP);
                      return (
                        <div
                          key={idx}
                          style={{
                            opacity: popU,
                            transform: `scale(${0.7 + 0.3 * popU})`,
                          }}
                        >
                          <MiniRouteBus x={74 + idx * 106 + glideX} y={145} scale={0.95} />
                        </div>
                      );
                    })}
                  </Paper>
                </div>

                {/* LABEL-LABEL PETA (Rute baru, Lebih sering, Jangkauan meluas) */}
                <Tag
                  x={460}
                  y={24}
                  text="Rute baru"
                  at={B2_ROUTE_IN + 4}
                  bg={C.cap}
                  color={C.creamHi}
                  size={23}
                  rot={-1.5}
                  seed="tag-rute"
                />
                <Tag
                  x={460}
                  y={222}
                  text="Lebih sering"
                  at={B3_BUSES_IN + 8}
                  bg={C.hero}
                  color={C.creamHi}
                  size={22}
                  rot={1}
                  seed="tag-sering"
                />
                <Tag
                  x={115}
                  y={222}
                  text="Jangkauan meluas"
                  at={B4_WINGS_OPEN + 10}
                  bg={ROOM.teal}
                  color={C.creamHi}
                  size={20}
                  rot={-1}
                  seed="tag-jangkauan"
                />
              </div>

              {/* 6. JALUR JALAN DI KAKI PANGGUNG: Barisan mobil kertas + pengemudi pindah ke bus */}
              {/* Mobil-mobil lain di jalur jalan */}
              <PaperCar x={145} y={FLOOR_Y + 34} color={ROOM.slate} shade="#394B5C" />
              <PaperCar x={320} y={FLOOR_Y + 34} color={ROOM.khaki} shade="#6D5F49" />
              {/* Mobil milik pengemudi yang ditinggal kosong di Beat 5 */}
              <PaperCar
                x={515}
                y={FLOOR_Y + 34}
                color={C.amber}
                shade={C.amberDim}
                hasDriver={!driverOut}
                doorOpen={f >= B5_DRIVER_EXIT - 4 && f <= B5_DRIVER_WALK + 10}
              />

              {/* Pengemudi tanpa wajah berjalan tenang menuju bus di halte */}
              <WalkingDriver
                x={walkX}
                y={FLOOR_Y + 2}
                stepPhase={(f - B5_DRIVER_WALK) * 0.35}
                opacity={driverOpacity}
              />

              {/* Bus kertas yang datang tepat waktu di Beat 5 */}
              {f >= B5_BUS_ARRIVE - 2 ? (
                <LargeHalteBus x={busX} y={FLOOR_Y + 6} hasPassenger={driverBoarded} />
              ) : null}

              {/* Label "Bisa diandalkan" menempel di bus saat pengemudi naik */}
              <Tag
                x={915}
                y={FLOOR_Y - 46}
                text="Bisa diandalkan"
                at={B5_DRIVER_BOARD}
                bg={C.go}
                color={C.creamHi}
                size={24}
                rot={-1.5}
                seed="tag-andal"
              />
            </Depth>

            {/* LAPISAN LATAR DEPAN (z = 0.85) */}
            <Depth z={0.85}>
              <Plant x={-22} y={405} s={0.56} />
              <Plant x={1195} y={415} s={0.54} />
            </Depth>
          </OrbitCamera>
        </FilmWeave>
      </PopUpOpen>
      <GrainOverlay />
    </AbsoluteFill>
  );
};