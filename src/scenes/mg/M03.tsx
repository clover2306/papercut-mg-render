// M03 (Scene 016-021, 61,35-73,73 dtk, 372 frame): kotak hadiah "Gratis" membesar bersama meter kebaikan.
// Kotak tumbuh bertahap diiringi figur tanpa wajah yang mengangkat tangan, lalu berhenti dengan pita sedikit kendur.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {
  Boil,
  GrainOverlay,
  Paper,
  PaperDefs,
  PopIn,
  Slab,
  SparkleBurst,
} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';

export const M03_DUR = 372;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepCurve = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });

const WarmCanteenBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-100} y={-80} w={1480} h={880} color="#E4DBD0" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 42% 34%, rgba(255,244,214,0.42) 0%, rgba(255,255,255,0) 54%, rgba(0,0,0,0.22) 100%)',
      }}
    />
    <Slab x={-100} y={318} w={1480} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-100} y={334} w={1480} h={220} color="#D4C9B8" r={0} grain={0.55} />
    <Window x={46} y={54} w={214} h={246} night={false} />
    {/* Sorot cahaya hangat dari jendela */}
    <div
      style={{
        position: 'absolute',
        left: 38,
        top: 296,
        width: 310,
        height: 240,
        background: 'linear-gradient(180deg, rgba(255,232,168,0.22), rgba(255,232,168,0))',
        clipPath: 'polygon(10% 0%, 82% 0%, 100% 100%, 0% 100%)',
      }}
    />
    <Corkboard x={972} y={64} w={236} h={150} />
    <Sticky x={1002} y={94} s={36} color="#E8C95A" rot={-3} />
    <Sticky x={1056} y={100} s={34} color="#DFD5C3" rot={2} />
    <Sticky x={1112} y={92} s={36} color="#E8C95A" rot={-1} />
    <Shelf x={970} y={298} w={240} books={3} />
    <Plant x={1130} y={278} s={0.54} />
  </AbsoluteFill>
);

const FacelessSupporter: React.FC<{
  x: number;
  y: number;
  s: number;
  shirt: string;
  at: number;
  cheerPhase: number;
}> = ({x, y, s, shirt, at, cheerPhase}) => {
  const f = useCurrentFrame();

  // Gerakan angkat tangan bersemangat saat kelompok berkumpul dan pada "Semua orang senang"
  const raiseU = interpolate(f, [at + 4, at + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });
  const happyBoost = interpolate(f, [186, 200], [0, 1], CLAMP);
  const steppedF = Math.floor(f / 3) * 3;
  const wave =
    f >= at + 12
      ? Math.sin(steppedF * 0.24 + cheerPhase) * (5 + happyBoost * 6)
      : 0;
  const hopY =
    f >= 186
      ? -Math.abs(Math.sin(steppedF * 0.26 + cheerPhase)) * (7 * happyBoost)
      : 0;

  const w = Math.round(92 * s);
  const h = Math.round(186 * s);
  const head = Math.round(52 * s);
  const torsoW = Math.round(62 * s);
  const torsoH = Math.round(86 * s);
  const armW = Math.round(15 * s);
  const armH = Math.round(64 * s);

  const leftArmRot = interpolate(raiseU, [0, 1], [24, 146], CLAMP) + wave;
  const rightArmRot = interpolate(raiseU, [0, 1], [-24, -146], CLAMP) - wave;

  return (
    <PopIn at={at} origin="50% 100%">
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y + hopY,
          width: w,
          height: h,
          translate: '-50% -100%',
          filter: 'drop-shadow(2px 4px 5px rgba(0,0,0,0.28))',
        }}
      >
        {/* Lengan kiri */}
        <div
          style={{
            position: 'absolute',
            left: Math.round(12 * s),
            top: Math.round(66 * s),
            width: armW,
            height: armH,
            backgroundColor: shirt,
            borderRadius: Math.round(8 * s),
            transformOrigin: '50% 10%',
            transform: `rotate(${leftArmRot}deg)`,
          }}
        />
        {/* Lengan kanan */}
        <div
          style={{
            position: 'absolute',
            right: Math.round(12 * s),
            top: Math.round(66 * s),
            width: armW,
            height: armH,
            backgroundColor: shirt,
            borderRadius: Math.round(8 * s),
            transformOrigin: '50% 10%',
            transform: `rotate(${rightArmRot}deg)`,
          }}
        />
        {/* Kepala kertas polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: head,
            height: head,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `${Math.max(2, Math.round(3 * s))}px solid ${C.inkSoft}`,
          }}
        />
        {/* Badan kertas */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: Math.round(58 * s),
            width: torsoW,
            height: torsoH,
            translate: '-50% 0',
            backgroundColor: shirt,
            borderRadius: `${Math.round(12 * s)}px ${Math.round(12 * s)}px ${Math.round(5 * s)}px ${Math.round(5 * s)}px`,
          }}
        />
      </div>
    </PopIn>
  );
};

const GiftBoxWithRibbon: React.FC<{
  boxScale: number;
  loosenU: number;
}> = ({boxScale, loosenU}) => {
  const boxW = 310;
  const boxH = 236;
  const lidW = 334;
  const lidH = 48;

  // Parameter kendur pita di akhir adegan ("Begitulah rasanya")
  const leftLoopRot = -24 - loosenU * 18;
  const rightLoopRot = 24 + loosenU * 18;
  const bowDropY = loosenU * 9;
  const bowTilt = loosenU * 4.5;
  const bandSagY = loosenU * 6;
  const bandSagRot = loosenU * 2.4;
  const labelTilt = -1 - loosenU * 4.2;
  const tailLeftRot = 14 + loosenU * 11;
  const tailRightRot = -14 - loosenU * 13;

  return (
    <div
      style={{
        position: 'absolute',
        left: 530,
        top: 562,
        width: lidW,
        height: boxH + lidH + 74,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scale(${boxScale})`,
      }}
    >
      <Boil seed="m03-giftbox" amp={0.4} rot={0.05}>
        <div style={{position: 'relative', width: lidW, height: boxH + lidH + 74}}>
          {/* Simpul pita kupu-kupu di atas tutup kotak */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 12 + bowDropY,
              width: 170,
              height: 68,
              translate: '-50% 0',
              rotate: `${bowTilt}deg`,
            }}
          >
            {/* Lingkar pita kiri */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 12,
                width: 68,
                height: 44,
                backgroundColor: '#E6C353',
                border: '3px solid #B59232',
                borderRadius: '50% 50% 24% 50%',
                transformOrigin: '100% 70%',
                transform: `rotate(${leftLoopRot}deg)`,
                filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.25))',
              }}
            />
            {/* Lingkar pita kanan */}
            <div
              style={{
                position: 'absolute',
                right: 14,
                top: 12,
                width: 68,
                height: 44,
                backgroundColor: '#E6C353',
                border: '3px solid #B59232',
                borderRadius: '50% 50% 50% 24%',
                transformOrigin: '0% 70%',
                transform: `rotate(${rightLoopRot}deg)`,
                filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.25))',
              }}
            />
            {/* Simpul tengah */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 24 + loosenU * 3,
                width: 34,
                height: 30,
                translate: '-50% 0',
                backgroundColor: '#D4AE3E',
                border: '3px solid #9F7D24',
                borderRadius: 8,
                filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.28))',
              }}
            />
          </div>

          {/* Badan kotak hadiah */}
          <Paper lift={10}>
            <Slab
              x={(lidW - boxW) / 2}
              y={74 + lidH - 4}
              w={boxW}
              h={boxH}
              color="#C9573C"
              shade="#9D3F29"
              shadeH={0.14}
              hi="#DC7258"
              hiH={0.06}
              r="4px 4px 12px 12px"
              grain={0.5}
            />
          </Paper>

          {/* Pita vertikal di badan kotak */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 74 + lidH - 2,
              width: 38,
              height: boxH - 2,
              translate: '-50% 0',
              backgroundColor: '#E6C353',
              borderLeft: '2px solid #B99636',
              borderRight: '2px solid #B99636',
            }}
          />

          {/* Pita horizontal di sisi kotak yang sedikit kendur di akhir */}
          <div
            style={{
              position: 'absolute',
              left: (lidW - boxW) / 2,
              top: 74 + lidH + 92 + bandSagY,
              width: boxW,
              height: 40,
              backgroundColor: '#E6C353',
              borderTop: '2px solid #B99636',
              borderBottom: '2px solid #B99636',
              rotate: `${bandSagRot}deg`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.22)',
            }}
          />

          {/* Tutup kotak hadiah */}
          <Paper lift={12}>
            <Slab
              x={0}
              y={74}
              w={lidW}
              h={lidH}
              color="#D9674B"
              shade="#A8462E"
              shadeH={0.22}
              hi="#E88167"
              hiH={0.12}
              r={8}
              grain={0.45}
            />
            {/* Pita vertikal melintasi tutup kotak */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 74,
                width: 40,
                height: lidH,
                translate: '-50% 0',
                backgroundColor: '#ECCB60',
                borderLeft: '2px solid #B99636',
                borderRight: '2px solid #B99636',
              }}
            />
          </Paper>

          {/* Dua ujung pita menjuntai dari atas tutup */}
          <div
            style={{
              position: 'absolute',
              left: lidW / 2 - 26,
              top: 64 + bowDropY,
              width: 18,
              height: 54 + loosenU * 14,
              backgroundColor: '#DFBA49',
              border: '2px solid #B59232',
              transformOrigin: '50% 0%',
              transform: `rotate(${tailLeftRot}deg)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: lidW / 2 + 8,
              top: 64 + bowDropY,
              width: 18,
              height: 56 + loosenU * 16,
              backgroundColor: '#DFBA49',
              border: '2px solid #B59232',
              transformOrigin: '50% 0%',
              transform: `rotate(${tailRightRot}deg)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            }}
          />

          {/* Label potongan kertas bertuliskan "Gratis" di sisi kotak */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 74 + lidH + 74 + bandSagY * 1.1,
              translate: '-50% 0',
              rotate: `${labelTilt}deg`,
              backgroundColor: C.creamHi,
              padding: '12px 28px 14px',
              fontFamily: FONT.banner,
              fontSize: 40,
              lineHeight: 1,
              color: C.ink,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
            }}
          >
            Gratis
          </div>
        </div>
      </Boil>
    </div>
  );
};

const GoodnessThermometer: React.FC<{levelU: number}> = ({levelU}) => {
  const tubeMaxH = 264;
  const fillH = Math.round(28 + levelU * (tubeMaxH - 28));

  return (
    <PopIn at={14} origin="50% 100%">
      <Boil seed="m03-thermo" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 888,
            top: 562,
            width: 108,
            height: 396,
            translate: '-50% -100%',
          }}
        >
          {/* Papan penyangga termometer dari kertas tebal */}
          <Paper lift={9}>
            <Slab
              x={8}
              y={0}
              w={92}
              h={386}
              color={C.creamHi}
              shade={C.creamLo}
              shadeH={0.08}
              r={46}
              grain={0.5}
            />
            <Slab
              x={18}
              y={10}
              w={72}
              h={366}
              color="#F3ECE0"
              r={38}
              grain={0.4}
            />
          </Paper>

          {/* Alur tabung kaca kertas */}
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 34,
              width: 24,
              height: tubeMaxH,
              borderRadius: 12,
              backgroundColor: '#D6CEC0',
              boxShadow: 'inset 2px 3px 6px rgba(0,0,0,0.22)',
            }}
          />

          {/* Cairan hangat naik mengikuti pembesaran kotak */}
          <div
            style={{
              position: 'absolute',
              left: 44,
              bottom: 96,
              width: 20,
              height: fillH,
              borderRadius: 10,
              backgroundColor: C.nogo,
              boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.16)',
            }}
          />

          {/* Garis skala dekoratif tanpa angka */}
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <div
              key={tick}
              style={{
                position: 'absolute',
                left: 70,
                top: 48 + tick * 46,
                width: tick % 2 === 0 ? 14 : 9,
                height: 3,
                borderRadius: 2,
                backgroundColor: C.inkSoft,
                opacity: 0.45,
              }}
            />
          ))}

          {/* Bola bawah termometer */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 34,
              width: 68,
              height: 68,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.nogo,
              border: `4px solid ${C.creamHi}`,
              boxShadow: '0 4px 10px rgba(0,0,0,0.28)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 36,
              bottom: 72,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.42)',
            }}
          />

          {/* Alas dudukan kayu di meja */}
          <Paper lift={7}>
            <Slab
              x={0}
              y={378}
              w={108}
              h={18}
              color={C.wood}
              shade={C.woodLo}
              shadeH={0.4}
              r={6}
            />
          </Paper>
        </div>
      </Boil>
    </PopIn>
  );
};

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M03_DUR - 10, M03_DUR], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const fold = Math.max(openU, closeU);

  if (fold <= 0.001) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.cream,
          transformOrigin: '0% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.creamLo,
          transformOrigin: '100% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '-10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
    </AbsoluteFill>
  );
};

export const M03: React.FC = () => {
  const f = useCurrentFrame();

  // 4 tahap pertumbuhan kotak & kenaikan termometer mengikuti kalimat narasi:
  // 1) "Gratis terasa seperti kebaikan murni" (f=62)
  // 2) "Tidak ada yang dirugikan" (f=132)
  // 3) "Semua orang senang" (f=186)
  // 4) "Dan semakin besar yang gratis, semakin besar kebaikannya" (f=235)
  const g1 = stepCurve(f, 62, 76);
  const g2 = stepCurve(f, 132, 146);
  const g3 = stepCurve(f, 186, 200);
  const g4 = interpolate(f, [235, 272], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const boxScale = 0.56 + g1 * 0.14 + g2 * 0.14 + g3 * 0.13 + g4 * 0.19;
  const meterLevel = 0.14 + g1 * 0.18 + g2 * 0.18 + g3 * 0.18 + g4 * 0.32;

  // Pada "Begitulah rasanya" (f=345), kotak diam dan pitanya tampak sedikit kendur
  const loosenU = interpolate(f, [345, 362], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#E4DBD0'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25} seed="m03-weave">
        <OrbitCamera
          dur={M03_DUR}
          yaw={15}
          drift={[-26, -6]}
          push={1.08}
          focus={0.5}
          depth={760}
          origin={[640, 420]}
        >
          <Depth z={0} cover>
            <WarmCanteenBackdrop />
          </Depth>

          <Depth z={0.5}>
            {/* Meja kantin kertas */}
            <Slab x={-120} y={554} w={1520} h={220} color="#EFE8DC" r={0} grain={0.5} />
            <Slab
              x={-120}
              y={548}
              w={1520}
              h={16}
              color={C.wood}
              shade={C.woodLo}
              shadeH={0.4}
              r={0}
            />
            <Slab x={-120} y={668} w={1520} h={90} color={C.woodLo} r={0} grain={0.55} />

            {/* Kotak hadiah "Gratis" yang membesar bertahap */}
            <PopIn at={8} origin="50% 100%">
              <GiftBoxWithRibbon boxScale={boxScale} loosenU={loosenU} />
            </PopIn>

            {/* Termometer kebaikan di samping kotak */}
            <GoodnessThermometer levelU={meterLevel} />

            {/* Percikan hangat saat termometer mencapai puncak */}
            <SparkleBurst at={266} x={888} y={162} seed="m03-peak" spread={68} />

            {/* Figur-figur kertas tanpa wajah berkumpul dan mengangkat tangan */}
            <FacelessSupporter x={282} y={562} s={0.78} shirt="#5D7896" at={66} cheerPhase={0.3} />
            <FacelessSupporter x={1026} y={562} s={0.82} shirt="#7E8C78" at={76} cheerPhase={1.4} />
            <FacelessSupporter x={202} y={562} s={0.84} shirt="#9A5A42" at={136} cheerPhase={2.2} />
            <FacelessSupporter x={1118} y={562} s={0.76} shirt="#8A7A60" at={146} cheerPhase={3.1} />
            <FacelessSupporter x={122} y={562} s={0.74} shirt="#3968AD" at={190} cheerPhase={4.0} />
          </Depth>

          <Depth z={0.95}>
            <div style={{filter: 'blur(3px)'}}>
              <Slab x={-90} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
              <Slab x={1130} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            </div>
          </Depth>
        </OrbitCamera>
      </FilmWeave>

      <PaperFoldEdge />
      <GrainOverlay />
    </AbsoluteFill>
  );
};