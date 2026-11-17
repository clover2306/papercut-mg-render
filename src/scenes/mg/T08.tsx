// Adegan T08: Kalender sebulan minggu ketiga dan keempat saat jalan kembali penuh sementara bus tetap ramai.
// Teater kertas halte pagi: pita rute yang memanjang, kalender sobek terakhir, dan karcis yang disimpan ke saku.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Disc, GrainOverlay, PaperDefs, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Lamp, Plant} from '../../lib/paper/sets';
import {CutSeries, PopUpOpen} from '../../lib/paper/transitions';
import {Boil, FLOOR_Y, Figure, Paper, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const T08_DUR = 884;

const B1_DUR = 320;
const B2_DUR = 280;
const B3_DUR = 284;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const CAR_SLOTS: readonly {x: number; body: string; shade: string; roof: string; liftedInB1?: boolean}[] = [
  {x: 92, body: C.nogo, shade: C.nogoDim, roof: C.cream, liftedInB1: false},
  {x: 256, body: C.cap, shade: C.capLo, roof: C.creamHi, liftedInB1: true},
  {x: 420, body: C.brass, shade: C.brassLo, roof: C.cream, liftedInB1: false},
  {x: 584, body: ROOM.teal, shade: C.boardLo, roof: C.creamHi, liftedInB1: true},
  {x: 748, body: C.hero, shade: C.heroLo, roof: C.cream, liftedInB1: false},
  {x: 912, body: ROOM.purple, shade: C.screen, roof: C.creamHi, liftedInB1: true},
  {x: 1076, body: C.sage, shade: C.sageLo, roof: C.cream, liftedInB1: false},
];

// Mobil kertas tanpa plat nomor dengan siluet pengemudi tanpa wajah di balik setir.
const PaperCar: React.FC<{x: number; y: number; body: string; shade: string; roof: string; rot?: number}> = ({
  x,
  y,
  body,
  shade,
  roof,
  rot = 0,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 132, height: 64, rotate: `${rot}deg`}}>
    <Paper lift={3}>
      <Slab x={18} y={4} w={84} h={28} color={roof} shade={C.creamLo} shadeH={0.2} r="12px 16px 2px 2px">
        <Slab x={10} y={5} w={28} h={18} color={C.board} r={3} />
        <Slab x={44} y={5} w={30} h={18} color={C.board} r={3} />
        <Disc x={58} y={13} d={11} color={C.creamLo} />
        <Slab x={51} y={18} w={14} h={8} color={C.inkSoft} r={3} />
        <Slab x={66} y={14} w={4} h={10} color={C.ink} rot={-22} r={2} />
      </Slab>
      <Slab x={0} y={24} w={132} h={26} color={body} shade={shade} shadeH={0.28} hi={C.creamHi} hiH={0.1} r="8px 12px 6px 6px" />
      <Slab x={124} y={29} w={6} h={9} color={C.sparkYellow} r={2} />
      <Slab x={2} y={29} w={5} h={9} color={C.tag} r={2} />
      <Disc x={30} y={50} d={24} color={C.ink} shade={C.boardLo}>
        <Disc x={12} y={12} d={10} color={C.metal} />
      </Disc>
      <Disc x={102} y={50} d={24} color={C.ink} shade={C.boardLo}>
        <Disc x={12} y={12} d={10} color={C.metal} />
      </Disc>
    </Paper>
  </div>
);

// Tokoh kertas bermartabat tanpa wajah (kepala polos tanpa mata/hidung/mulut/telinga) dengan atribut peran.
const DignifiedPerson: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt: string;
  role: 'worker' | 'student' | 'walker' | 'driver';
}> = ({x, y, s = 0.78, shirt, role}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <Figure x={0} y={0} s={s} shirt={shirt} />
    {role === 'student' ? (
      <Paper lift={2}>
        <Slab x={-42 * s} y={-124 * s} w={22 * s} h={48 * s} color={C.brass} shade={C.brassLo} shadeH={0.25} r={6 * s} />
        <Slab x={-24 * s} y={-120 * s} w={8 * s} h={40 * s} color={C.woodLo} r={3 * s} />
      </Paper>
    ) : null}
    {role === 'worker' ? (
      <Paper lift={2}>
        <Slab x={22 * s} y={-72 * s} w={34 * s} h={26 * s} color={C.wood} shade={C.woodLo} shadeH={0.28} r={4 * s} />
        <Slab x={33 * s} y={-78 * s} w={12 * s} h={7 * s} color={C.woodLo} r={2 * s} />
      </Paper>
    ) : null}
    {role === 'driver' ? (
      <Paper lift={2}>
        <Slab x={-30 * s} y={-194 * s} w={60 * s} h={16 * s} color={C.cap} shade={C.capLo} shadeH={0.3} r="10px 10px 3px 3px" />
        <Slab x={4 * s} y={-183 * s} w={34 * s} h={7 * s} color={C.capLo} r={3} />
      </Paper>
    ) : null}
    {role === 'walker' ? (
      <Paper lift={2}>
        <Slab x={-36 * s} y={-96 * s} w={24 * s} h={32 * s} color={C.cream} shade={C.creamLo} shadeH={0.22} r={4 * s} />
      </Paper>
    ) : null}
  </div>
);

// Pita rute dari halte ke gedung kantor: pita panjang berliku dibanding bayangan pendek rute mobil langsung.
const RouteRibbonComparison: React.FC<{stretchProgress: number}> = ({stretchProgress}) => {
  const mainW = Math.round(interpolate(stretchProgress, [0, 1], [230, 520], clamp));
  return (
    <div style={{position: 'absolute', left: 530, top: 86, width: 690, height: 168}}>
      <Paper lift={4}>
        <Slab x={0} y={0} w={690} h={168} color={C.cream} shade={C.creamLo} shadeH={0.1} r={10} />
      </Paper>
      {/* Bayangan pita asli yang jauh lebih pendek (rute langsung mobil) */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 32,
          width: 210,
          height: 28,
          borderRadius: 8,
          border: `3px dashed ${C.inkSoft}`,
          background: 'rgba(58,56,50,0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 9,
            width: 182,
            height: 6,
            borderRadius: 3,
            background: C.inkSoft,
            opacity: 0.45,
          }}
        />
      </div>
      {/* Ikon mini kantor untuk bayangan rute pendek */}
      <Paper lift={2}>
        <Slab x={312} y={18} w={38} h={48} color={C.metal} shade={C.metalLo} shadeH={0.2} r={3}>
          <Slab x={7} y={8} w={8} h={8} color={C.creamHi} r={1} />
          <Slab x={21} y={8} w={8} h={8} color={C.creamHi} r={1} />
          <Slab x={7} y={22} w={8} h={8} color={C.creamHi} r={1} />
          <Slab x={21} y={22} w={8} h={8} color={C.creamHi} r={1} />
        </Slab>
      </Paper>

      {/* Pita rute transit yang melar panjang dengan lipatan pemberhentian */}
      <Paper lift={4}>
        {/* Miniatur tiang halte di pangkal kiri */}
        <Slab x={34} y={64} w={36} h={74} color={ROOM.teal} shade={C.boardLo} shadeH={0.25} r={5} />
        <Disc x={52} y={56} d={24} color={C.amber} shade={C.amberDim} />

        {/* Pita kertas yang memanjang */}
        <Slab x={76} y={88} w={mainW} h={34} color={C.tag} shade={C.heroLo} shadeH={0.24} hi={C.amber} hiH={0.14} r={6}>
          {[0.18, 0.36, 0.54, 0.72, 0.88].map((p, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: `${p * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: 'rgba(0,0,0,0.22)',
                }}
              />
              <Disc x={mainW * p} y={17} d={12} color={C.creamHi} />
            </React.Fragment>
          ))}
        </Slab>

        {/* Siluet kantor tujuan di ujung kanan yang ikut terdorong jauh */}
        <Slab x={84 + mainW} y={52} w={64} h={92} color={C.board} shade={C.boardLo} shadeH={0.25} r={5}>
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <Slab
                key={`${row}-${col}`}
                x={12 + col * 24}
                y={12 + row * 22}
                w={14}
                h={14}
                color={C.amber}
                r={2}
              />
            )),
          )}
          <Slab x={24} y={76} w={16} h={16} color={C.creamLo} r={2} />
        </Slab>
      </Paper>
    </div>
  );
};

// Kalender sobek di kiri atas panggung; hanya menampilkan teks yang diizinkan brief.
const TearCalendar: React.FC<{
  activeLabel: string | null;
  flipInProgress?: number;
  tearFallProgress?: number;
  fallingLabel?: string;
}> = ({activeLabel, flipInProgress = 1, tearFallProgress = 0, fallingLabel}) => {
  const foldScaleY = interpolate(flipInProgress, [0, 1], [0.15, 1], clamp);
  const fallY = interpolate(tearFallProgress, [0, 1], [0, 290], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const fallX = interpolate(tearFallProgress, [0, 0.5, 1], [0, 28, -18], clamp);
  const fallRot = interpolate(tearFallProgress, [0, 0.5, 1], [0, 14, -19], clamp);
  const fallOpacity = interpolate(tearFallProgress, [0, 0.82, 1], [1, 1, 0], clamp);

  return (
    <div style={{position: 'absolute', left: 74, top: 68, width: 396, height: 224}}>
      {/* Papan belakang kalender */}
      <Paper lift={6}>
        <Slab x={0} y={0} w={396} h={224} color={C.wood} shade={C.woodLo} shadeH={0.18} hi={C.woodHi} hiH={0.1} r={12} />
        <Slab x={16} y={48} w={364} h={158} color={C.creamLo} shade={C.tape} shadeH={0.16} r={8}>
          {/* Garis kisi abstrak tanpa angka saat kalender kosong */}
          {[0, 1, 2].map((r) => (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: 28,
                right: 28,
                top: 38 + r * 36,
                height: 3,
                background: 'rgba(28,27,23,0.14)',
                borderRadius: 2,
              }}
            />
          ))}
        </Slab>
        {/* Kepala penjepit kalender & cincin gantung */}
        <Slab x={10} y={10} w={376} h={42} color={C.board} shade={C.boardLo} shadeH={0.35} r={8} />
        <Disc x={108} y={26} d={20} color={C.brass} shade={C.brassLo} />
        <Disc x={288} y={26} d={20} color={C.brass} shade={C.brassLo} />
      </Paper>

      {/* Lembar kalender aktif yang terbuka */}
      {activeLabel ? (
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 50,
            width: 360,
            height: 154,
            transformOrigin: '50% 0%',
            transform: `scaleY(${foldScaleY})`,
          }}
        >
          <Boil seed={`cal-${activeLabel}`} amp={0.4} rot={0.05}>
            <Paper lift={5} torn>
              <Slab x={0} y={0} w={360} h={154} color={C.creamHi} shade={C.cream} shadeH={0.14} r={6}>
                {/* Garis perforasi sobekan atas */}
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    top: 10,
                    height: 3,
                    borderTop: `3px dashed ${C.inkSoft}`,
                    opacity: 0.45,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '18px 20px 10px',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 40,
                    color: C.ink,
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeLabel}
                </div>
              </Slab>
            </Paper>
          </Boil>
        </div>
      ) : null}

      {/* Lembar kalender terakhir yang disobek dan jatuh pelan pada Beat 3 */}
      {fallingLabel && tearFallProgress > 0 && tearFallProgress < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 50,
            width: 360,
            height: 154,
            transformOrigin: '50% 20%',
            transform: `translate(${fallX}px, ${fallY}px) rotate(${fallRot}deg)`,
            opacity: fallOpacity,
          }}
        >
          <Paper lift={8} torn>
            <Slab x={0} y={0} w={360} h={154} color={C.creamHi} shade={C.cream} shadeH={0.18} r={6}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 40,
                  color: C.ink,
                  whiteSpace: 'nowrap',
                }}
              >
                {fallingLabel}
              </div>
            </Slab>
          </Paper>
        </div>
      ) : null}
    </div>
  );
};

// Bus kertas di halte: memperlihatkan penampang jendela dengan pengemudi bertopi, pelajar, pekerja, dan pejalan kaki.
const HalteBus: React.FC<{crowded: boolean; extraWalkersBoarded?: number}> = ({
  crowded,
  extraWalkersBoarded = 0,
}) => {
  const f = useCurrentFrame();
  const busIdleY = bob(f, 48, 1.5, 4);
  return (
    <div style={{position: 'absolute', left: 530, top: 306 + busIdleY, width: 640, height: 248}}>
      <Paper lift={6}>
        {/* Badan utama bus kertas */}
        <Slab
          x={0}
          y={20}
          w={620}
          h={192}
          color={C.amber}
          shade={C.amberDim}
          shadeH={0.2}
          hi={C.sparkYellow}
          hiH={0.1}
          r="22px 28px 10px 10px"
        />
        {/* Pita dekoratif polos di lambung bus */}
        <Slab x={10} y={138} w={600} h={22} color={C.tag} shade={C.heroLo} shadeH={0.25} r={4} />

        {/* Empat jendela besar penampang bus */}
        {[24, 156, 288, 420].map((wx, idx) => (
          <Slab key={idx} x={wx} y={38} w={118} h={88} color={C.creamHi} shade={C.creamLo} shadeH={0.15} r={8}>
            {/* Pegangan tangan gantung di dalam bus */}
            {[28, 62, 94].map((hx, hi) => (
              <Slab key={hi} x={hx} y={0} w={3} h={18} color={C.inkSoft} r={1} />
            ))}
          </Slab>
        ))}

        {/* Jendela kemudi di sisi kanan depan */}
        <Slab x={550} y={38} w={56} h={88} color={C.creamHi} shade={C.creamLo} shadeH={0.15} r="6px 18px 6px 6px" />
      </Paper>

      {/* Siluet penumpang di balik jendela bus (tanpa wajah, bermartabat) */}
      <div style={{position: 'absolute', left: 18, top: 38, width: 588, height: 88, overflow: 'hidden', borderRadius: 8}}>
        {/* Pengemudi bus bertopi di depan kanan */}
        <DignifiedPerson x={556} y={136} s={0.58} shirt={C.cap} role="driver" />
        {/* Pelajar bertas dan pekerja bertas kerja yang memang selalu naik bus */}
        <DignifiedPerson x={58} y={138} s={0.58} shirt={ROOM.dusk} role="student" />
        <DignifiedPerson x={112} y={140} s={0.58} shirt={C.wood} role="worker" />
        <DignifiedPerson x={188} y={138} s={0.58} shirt={ROOM.sage} role="student" />
        <DignifiedPerson x={246} y={140} s={0.58} shirt={ROOM.navy} role="worker" />
        <DignifiedPerson x={324} y={138} s={0.58} shirt={ROOM.terracotta} role="student" />
        <DignifiedPerson x={380} y={140} s={0.58} shirt={C.board} role="worker" />
        {crowded ? (
          <>
            {/* Tambahan penumpang dan siluet pejalan kaki yang ikut naik bus sehingga bus tetap ramai */}
            <DignifiedPerson x={86} y={142} s={0.56} shirt={ROOM.purple} role="walker" />
            <DignifiedPerson x={216} y={142} s={0.56} shirt={C.sageLo} role="student" />
            <DignifiedPerson x={352} y={142} s={0.56} shirt={C.capLo} role="worker" />
            <DignifiedPerson
              x={448}
              y={140 + (1 - extraWalkersBoarded) * 30}
              s={0.58}
              shirt={ROOM.teal}
              role="walker"
            />
            <DignifiedPerson
              x={498}
              y={140 + (1 - extraWalkersBoarded) * 30}
              s={0.58}
              shirt={ROOM.mustard}
              role="walker"
            />
          </>
        ) : null}
      </div>

      {/* Roda bus */}
      <Paper lift={5}>
        <Disc x={134} y={210} d={64} color={C.ink} shade={C.boardLo}>
          <Disc x={32} y={32} d={28} color={C.metal} shade={C.metalLo} />
        </Disc>
        <Disc x={486} y={210} d={64} color={C.ink} shade={C.boardLo}>
          <Disc x={32} y={32} d={28} color={C.metal} shade={C.metalLo} />
        </Disc>
      </Paper>
    </div>
  );
};

// Panggung bersama "Teater Kertas Halte Pagi": atap halte, tiang polos, bangku tunggu, tanaman, lampu, dan jalur jalan di kaki panggung.
const HalteMorningStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: C.creamHi}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25}>
      <OrbitCamera dur={B1_DUR} yaw={16} push={1.08} drift={[18, -8]} origin={[640, 540]}>
        {/* Lapisan latar belakang dinding kertas pagi yang teduh */}
        <Depth z={0.08} cover>
          <Slab x={-80} y={-60} w={1440} h={700} color={C.creamHi} r={0} grain={0.55} />
          <Slab x={-80} y={-60} w={1440} h={210} color={C.cream} shade={C.creamLo} shadeH={0.2} r={0} />
          {/* Siluet bangunan kota pagi yang samar di kejauhan tanpa tulisan */}
          {[80, 220, 390, 860, 1010, 1140].map((bx, i) => (
            <Slab
              key={i}
              x={bx}
              y={330 - (i % 3) * 38}
              w={96}
              h={270 + (i % 3) * 38}
              color={C.creamLo}
              r="4px 4px 0 0"
              style={{opacity: 0.45}}
            />
          ))}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.26) 100%)',
            }}
          />
        </Depth>

        {/* Lapisan tengah: bangunan halte pagi, tanaman, lampu, dan trotoar */}
        <Depth z={0.45}>
          {/* Lantai panggung & jalur jalan di kaki panggung */}
          <Slab x={-60} y={FLOOR_Y} w={1400} h={720 - FLOOR_Y + 40} color={C.floor} r={0} grain={0.65} />
          <Slab x={-60} y={FLOOR_Y - 26} w={1400} h={30} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          {/* Rel tipis jalur mobil di kaki panggung */}
          <Slab x={-40} y={FLOOR_Y + 26} w={1360} h={66} color={C.board} shade={C.boardLo} shadeH={0.3} r={0} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: FLOOR_Y + 58,
              height: 4,
              borderTop: `4px dashed ${C.creamLo}`,
              opacity: 0.45,
            }}
          />

          {/* Kanopi dan tiang Halte Pagi (polos tanpa tulisan sesuai aturan brief) */}
          <Paper lift={5}>
            <Slab x={150} y={322} w={260} h={24} color={ROOM.teal} shade={C.boardLo} shadeH={0.32} r={6} />
            <Slab x={176} y={346} w={14} h={232} color={C.metalLo} r={3} />
            <Slab x={372} y={346} w={14} h={232} color={C.metalLo} r={3} />
            <Slab x={188} y={356} w={184} h={146} color={C.cream} shade={C.creamLo} shadeH={0.14} r={4} />
            {/* Bangku halte */}
            <Slab x={202} y={518} w={156} h={16} color={C.woodHi} shade={C.wood} shadeH={0.3} r={4} />
            <Slab x={218} y={534} w={12} h={44} color={C.woodLo} r={2} />
            <Slab x={332} y={534} w={12} h={44} color={C.woodLo} r={2} />
            {/* Tiang rambu halte polos */}
            <Slab x={448} y={340} w={10} h={238} color={C.inkSoft} r={3} />
            <Disc x={453} y={332} d={44} color={ROOM.teal} shade={C.boardLo}>
              <Slab x={10} y={16} w={24} h={12} color={C.creamHi} r={3} />
            </Disc>
          </Paper>

          {/* Dekorasi tepi panggung */}
          <Plant x={14} y={404} s={0.58} />
          <Lamp x={1148} y={392} s={0.62} on />

          {children}
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

// ============================================================================
// BEAT 1 (scene 117-119): "Minggu ketiga", pengendara berjalan tenang kembali ke mobil,
// mobil turun kembali ke jalur, dan pita rute halte-ke-kantor tampak jauh lebih panjang.
// ============================================================================
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const calFlip = interpolate(f, [6, 26], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const ribbonStretch = interpolate(f, [28, 120], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const walkBack = interpolate(f, [45, 220], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const carsLower = interpolate(f, [110, 245], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const stepBob1 = bob(f, 18, 3 * (1 - walkBack * 0.7), 0);
  const stepBob2 = bob(f, 18, 3 * (1 - walkBack * 0.7), 9);

  const walker1X = interpolate(walkBack, [0, 1], [356, 268], clamp);
  const walker1Y = interpolate(walkBack, [0, 1], [576, 616], clamp) + stepBob1;
  const walker2X = interpolate(walkBack, [0, 1], [420, 594], clamp);
  const walker2Y = interpolate(walkBack, [0, 1], [576, 616], clamp) + stepBob2;

  return (
    <PopUpOpen dur={18}>
      <HalteMorningStage>
        {/* Kalender sobek membuka "Minggu ketiga" */}
        <TearCalendar activeLabel="Minggu ketiga" flipInProgress={calFlip} />

        {/* Pita rute dari T05 membentang dari halte ke kantor vs bayangan pita asli yang pendek */}
        <SlideIn at={14} dy={-30} dur={16}>
          <RouteRibbonComparison stretchProgress={ribbonStretch} />
        </SlideIn>

        {/* Bus di halte dengan penumpang reguler (pelajar & pekerja) */}
        <HalteBus crowded={false} />

        {/* Siluet pengendara berjalan tenang kembali dari halte menuju mobil kertas */}
        <DignifiedPerson x={walker1X} y={walker1Y} s={0.72} shirt={C.cap} role="worker" />
        <DignifiedPerson x={walker2X} y={walker2Y} s={0.72} shirt={ROOM.terracotta} role="worker" />

        {/* Barisan mobil di jalur bawah: mobil yang tadi terangkat turun kembali dengan tenang */}
        <Depth z={0.7}>
          {CAR_SLOTS.map((c, idx) => {
            const liftOffset = c.liftedInB1 ? interpolate(carsLower, [0, 1], [-108, 0], clamp) : 0;
            const tilt = c.liftedInB1 ? interpolate(carsLower, [0, 1], [-4, 0], clamp) : 0;
            return (
              <React.Fragment key={idx}>
                {c.liftedInB1 && carsLower < 0.98 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: c.x + 64,
                      top: 500,
                      width: 2,
                      height: Math.max(0, 618 + liftOffset - 500),
                      background: C.creamLo,
                      opacity: 0.55 * (1 - carsLower),
                    }}
                  />
                ) : null}
                <PaperCar
                  x={c.x}
                  y={618 + liftOffset}
                  body={c.body}
                  shade={c.shade}
                  roof={c.roof}
                  rot={tilt}
                />
              </React.Fragment>
            );
          })}
        </Depth>
      </HalteMorningStage>
    </PopUpOpen>
  );
};

// ============================================================================
// BEAT 2 (scene 120-121): "Minggu keempat", jalur jalan kembali rapat seperti sebelum gratis,
// namun bus tetap ramai (pelajar, pekerja, ditambah pejalan kaki yang beralih naik bus).
// ============================================================================
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const calFlip = interpolate(f, [4, 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const walkersBoard = interpolate(f, [24, 140], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const ped1X = interpolate(walkersBoard, [0, 1], [380, 520], clamp);
  const ped2X = interpolate(walkersBoard, [0, 1], [430, 548], clamp);
  const pedOpacity = interpolate(walkersBoard, [0, 0.78, 1], [1, 1, 0], clamp);

  return (
    <HalteMorningStage>
      {/* Kalender membuka "Minggu keempat" */}
      <TearCalendar activeLabel="Minggu keempat" flipInProgress={calFlip} />

      {/* Pita rute tetap terbentang penuh (keadaan kumulatif dari Beat 1) */}
      <RouteRibbonComparison stretchProgress={1} />

      {/* Bus di halte tetap ramai oleh pelajar, pekerja, dan mantan pejalan kaki */}
      <HalteBus crowded extraWalkersBoarded={walkersBoard} />

      {/* Siluet pejalan kaki di trotoar yang ikut naik ke bus */}
      <div style={{opacity: pedOpacity}}>
        <DignifiedPerson x={ped1X} y={576 + bob(f, 16, 2.5, 2)} s={0.72} shirt={ROOM.teal} role="walker" />
        <DignifiedPerson x={ped2X} y={576 + bob(f, 16, 2.5, 8)} s={0.72} shirt={ROOM.mustard} role="walker" />
      </div>

      {/* Penumpang tetap di peron halte */}
      <DignifiedPerson x={246} y={576} s={0.74} shirt={ROOM.dusk} role="student" />
      <DignifiedPerson x={312} y={576} s={0.74} shirt={C.wood} role="worker" />

      {/* Jalur jalan di kaki panggung kembali rapat dan penuh seperti sebelum gratis */}
      <Depth z={0.7}>
        {CAR_SLOTS.map((c, idx) => (
          <PaperCar key={idx} x={c.x} y={618} body={c.body} shade={c.shade} roof={c.roof} />
        ))}
      </Depth>
    </HalteMorningStage>
  );
};

// ============================================================================
// BEAT 3 (scene 122-123): Lembar kalender terakhir disobek dan jatuh pelan;
// label "Bulan gratis itu berakhir"; karcis dilipat dan disimpan ke saku;
// pose akhir ditahan tenang: kalender kosong, jalur jalan penuh, bus tetap ramai.
// ============================================================================
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const tearFall = interpolate(f, [10, 95], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const ticketFold = interpolate(f, [55, 115], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const ticketPocket = interpolate(f, [115, 175], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const ticketScaleX = interpolate(ticketFold, [0, 1], [1, 0.52], clamp);
  const ticketX = interpolate(ticketPocket, [0, 1], [318, 286], clamp);
  const ticketY = interpolate(ticketPocket, [0, 1], [442, 488], clamp);
  const ticketOpacity = interpolate(ticketPocket, [0, 0.85, 1], [1, 1, 0], clamp);

  return (
    <HalteMorningStage>
      {/* Kalender terakhir disobek dan jatuh pelan hingga menyisakan kalender kosong */}
      <TearCalendar activeLabel={null} tearFallProgress={tearFall} fallingLabel="Minggu keempat" />

      {/* Pita rute tetap tampil tenang di latar kanan atas */}
      <RouteRibbonComparison stretchProgress={1} />

      {/* Label "Bulan gratis itu berakhir" di area atas yang bersih dan terbaca penuh */}
      <Tag
        x={272}
        y={122}
        text="Bulan gratis itu berakhir"
        at={58}
        bg={C.tag}
        color={C.tagText}
        size={34}
        rot={-1.5}
        seed="akhir-gratis"
      />

      {/* Bus di halte tetap ramai */}
      <HalteBus crowded extraWalkersBoarded={1} />

      {/* Siluet penumpang di halte yang melipat dan menyimpan kembali karcis ke saku */}
      <PopIn at={0} origin="280px 520px">
        <DignifiedPerson x={278} y={576} s={0.82} shirt={ROOM.navy} role="worker" />
        {/* Saku jaket tempat menyimpan karcis */}
        <Paper lift={3}>
          <Slab x={268} y={488} w={30} h={24} color={C.capLo} shade={C.boardLo} shadeH={0.3} r="2px 2px 6px 6px" />
        </Paper>
        {/* Karcis kertas yang dilipat dua lalu masuk ke saku */}
        {ticketOpacity > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: ticketX,
              top: ticketY,
              width: 64,
              height: 36,
              transformOrigin: '0% 50%',
              transform: `scaleX(${ticketScaleX}) rotate(${interpolate(ticketFold, [0, 1], [-8, 0], clamp)}deg)`,
              opacity: ticketOpacity,
            }}
          >
            <Paper lift={4} torn>
              <Slab x={0} y={0} w={64} h={36} color={C.creamHi} shade={C.tape} shadeH={0.22} r={4}>
                {/* Cap merah abstrak tanpa huruf tambahan agar patuh aturan teks */}
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 8,
                    width: 42,
                    height: 18,
                    border: `3px solid ${C.nogo}`,
                    borderRadius: 3,
                    rotate: '-6deg',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 31,
                    top: 2,
                    bottom: 2,
                    width: 2,
                    borderLeft: `2px dashed ${C.inkSoft}`,
                    opacity: 0.5,
                  }}
                />
              </Slab>
            </Paper>
          </div>
        ) : null}
      </PopIn>

      <DignifiedPerson x={358} y={576} s={0.76} shirt={ROOM.dusk} role="student" />

      {/* Jalur jalan di kaki panggung tetap penuh dan ditahan dengan tenang */}
      <Depth z={0.7}>
        {CAR_SLOTS.map((c, idx) => (
          <PaperCar key={idx} x={c.x} y={618} body={c.body} shade={c.shade} roof={c.roof} />
        ))}
      </Depth>
    </HalteMorningStage>
  );
};

export const T08: React.FC = () => (
  <CutSeries
    scenes={[
      {id: 'B1', component: Beat1, durationInFrames: B1_DUR},
      {id: 'B2', component: Beat2, durationInFrames: B2_DUR},
      {id: 'B3', component: Beat3, durationInFrames: B3_DUR},
    ]}
    cuts={{
      B2: {kind: 'pageTurn', style: 'curl', angle: 20, from: 'bottom', align: 'mid'},
      B3: {kind: 'tapePull', y: 160, align: 'mid'},
    }}
  />
);
