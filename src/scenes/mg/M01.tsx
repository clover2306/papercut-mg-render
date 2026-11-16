// M01 (Scene 007-008, 18,04-28,68 dtk, 319 frame): penghitung korban keracunan di Cangkringan, Sleman.
// Baki kantin terisi figur siswa dan guru hingga 162, lalu label "diduga" dan "belum dipastikan" menempel di mangkuk semur.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, SlideIn} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerUnderline} from '../../lib/paper/proof';

export const M01_DUR = 319;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type SlotSpec = {
  col: number;
  row: number;
  isTeacher: boolean;
  shirt: string;
  order: number;
};

const TRAY_SLOTS: SlotSpec[] = [
  {col: 0, row: 0, isTeacher: false, shirt: '#5D7896', order: 0},
  {col: 1, row: 0, isTeacher: false, shirt: '#7E8C78', order: 3},
  {col: 2, row: 0, isTeacher: true, shirt: '#3968AD', order: 6},
  {col: 3, row: 0, isTeacher: false, shirt: '#8A7A60', order: 9},
  {col: 4, row: 0, isTeacher: false, shirt: '#5D7896', order: 12},
  {col: 5, row: 0, isTeacher: false, shirt: '#6E6A64', order: 15},
  {col: 0, row: 1, isTeacher: false, shirt: '#7E8C78', order: 1},
  {col: 1, row: 1, isTeacher: false, shirt: '#4E6378', order: 4},
  {col: 2, row: 1, isTeacher: false, shirt: '#9A5A42', order: 7},
  {col: 3, row: 1, isTeacher: true, shirt: '#27324A', order: 10},
  {col: 4, row: 1, isTeacher: false, shirt: '#7E8C78', order: 13},
  {col: 5, row: 1, isTeacher: false, shirt: '#5D7896', order: 16},
  {col: 0, row: 2, isTeacher: false, shirt: '#8A7A60', order: 2},
  {col: 1, row: 2, isTeacher: false, shirt: '#5D7896', order: 5},
  {col: 2, row: 2, isTeacher: false, shirt: '#6E6A64', order: 8},
  {col: 3, row: 2, isTeacher: false, shirt: '#4E6378', order: 11},
  {col: 4, row: 2, isTeacher: true, shirt: '#5B4A6E', order: 14},
  {col: 5, row: 2, isTeacher: false, shirt: '#8A7A60', order: 17},
];

const CanteenBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-80} y={-60} w={1440} h={840} color="#CBD3D0" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.24) 100%)',
      }}
    />
    <Slab x={-80} y={325} w={1440} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-80} y={341} w={1440} h={200} color="#B4C0BC" r={0} grain={0.55} />
    <Window x={48} y={62} w={210} h={250} night={false} />
    <Corkboard x={968} y={72} w={236} h={154} />
    <Sticky x={998} y={102} s={38} color="#E6D7A8" rot={-3} />
    <Sticky x={1054} y={108} s={36} color="#D8DFD5" rot={2} />
    <Sticky x={1112} y={100} s={38} color="#E6D7A8" rot={-1} />
    <Shelf x={966} y={306} w={240} books={3} />
    <Plant x={1126} y={286} s={0.54} />
  </AbsoluteFill>
);

const FacelessFigure: React.FC<{
  x: number;
  y: number;
  isTeacher: boolean;
  shirt: string;
  at: number;
}> = ({x, y, isTeacher, shirt, at}) => {
  const s = isTeacher ? 0.52 : 0.41;
  const w = Math.round(76 * s);
  const h = Math.round(168 * s);
  const head = Math.round(46 * s);
  const torsoW = Math.round(54 * s);
  const torsoH = Math.round(76 * s);

  return (
    <PopIn at={at} origin="50% 100%">
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          translate: '-50% -100%',
          filter: 'drop-shadow(1px 3px 3px rgba(0,0,0,0.28))',
        }}
      >
        {!isTeacher ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: Math.round(58 * s),
              width: Math.round(62 * s),
              height: Math.round(52 * s),
              translate: '-50% 0',
              background: C.wood,
              borderRadius: Math.round(8 * s),
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: head,
            height: head,
            translate: '-50% 0',
            borderRadius: '50%',
            background: C.creamHi,
            border: `${Math.max(2, Math.round(3 * s))}px solid ${C.inkSoft}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: Math.round(52 * s),
            width: torsoW,
            height: torsoH,
            translate: '-50% 0',
            background: shirt,
            borderRadius: `${Math.round(10 * s)}px ${Math.round(10 * s)}px ${Math.round(4 * s)}px ${Math.round(4 * s)}px`,
          }}
        />
      </div>
    </PopIn>
  );
};

const TrayAndFigures: React.FC = () => {
  const trayX = 148;
  const trayY = 342;
  const trayW = 588;
  const trayH = 296;
  const colPitch = 88;
  const rowPitch = 84;
  const startX = trayX + 74;
  const startY = trayY + 62;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper lift={8}>
        <Slab
          x={trayX}
          y={trayY}
          w={trayW}
          h={trayH}
          color={C.metalLo}
          shade="#6F787B"
          shadeH={0.14}
          hi="#CFD6D8"
          hiH={0.07}
          r={22}
          grain={0.45}
        />
        <Slab
          x={trayX + 18}
          y={trayY + 16}
          w={trayW - 36}
          h={trayH - 32}
          color={C.metal}
          shade="#9AA3A6"
          shadeH={0.1}
          r={14}
          grain={0.4}
        />
      </Paper>

      {TRAY_SLOTS.map((slot) => {
        const cx = startX + slot.col * colPitch;
        const cy = startY + slot.row * rowPitch;
        const boxW = 74;
        const boxH = 44;
        const popAt = 10 + slot.order * 5.6;

        return (
          <React.Fragment key={`${slot.row}-${slot.col}`}>
            <Paper lift={3}>
              <Slab
                x={cx - boxW / 2}
                y={cy - boxH / 2 + 12}
                w={boxW}
                h={boxH}
                color={C.cream}
                shade={C.creamLo}
                shadeH={0.28}
                hi={C.creamHi}
                hiH={0.18}
                r={6}
                grain={0.45}
              />
              <div
                style={{
                  position: 'absolute',
                  left: cx - boxW / 2 + 6,
                  top: cy + 6,
                  width: boxW - 12,
                  height: 2,
                  background: C.inkSoft,
                  opacity: 0.35,
                }}
              />
            </Paper>
            <FacelessFigure
              x={cx}
              y={cy + 14}
              isTeacher={slot.isTeacher}
              shirt={slot.shirt}
              at={popAt}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PaperCounter162: React.FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [8, 115], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const steppedFrame = Math.floor(f / 2) * 2;
  const steppedProgress = interpolate(steppedFrame, [8, 115], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rawVal = f >= 115 ? 162 : Math.round(162 * steppedProgress);
  const digits = String(rawVal).padStart(3, ' ').split('');
  const locked = f >= 115;
  const cardTilt = [-1.4, 0.8, -1.1];

  return (
    <PopIn at={4}>
      <Boil seed="m01-counter" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 306,
            top: 66,
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          {digits.map((ch, idx) => {
            const stepKick =
              !locked && progress > 0 ? Math.sin(steppedFrame * 1.7 + idx * 2.1) * 1.4 : 0;
            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: 88,
                  height: 118,
                  rotate: `${cardTilt[idx] + stepKick * 0.4}deg`,
                  translate: `0px ${stepKick}px`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: C.creamHi,
                    borderTop: `4px solid ${locked ? C.tag : C.inkSoft}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT.banner,
                    fontSize: 78,
                    lineHeight: 1,
                    color: locked ? C.tag : C.ink,
                    filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
                  }}
                >
                  {ch === ' ' ? '' : ch}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    right: 6,
                    top: '50%',
                    height: 2,
                    background: 'rgba(28,27,23,0.12)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </Boil>
      <MarkerUnderline
        x={314}
        y={196}
        w={276}
        at={115}
        dur={12}
        color={C.tag}
        width={6}
        seed="m01-162-line"
      />
    </PopIn>
  );
};

const SemurBowlAndLabels: React.FC = () => {
  const f = useCurrentFrame();
  const steamRise = interpolate(f, [182, 319], [0, 1], CLAMP);

  return (
    <SlideIn at={176} dx={110} dy={0} dur={12}>
      <div style={{position: 'absolute', left: 825, top: 325, width: 340, height: 310}}>
        {/* Alas serbet kertas di meja */}
        <Paper lift={3}>
          <Slab
            x={34}
            y={172}
            w={264}
            h={64}
            color={C.cream}
            shade={C.creamLo}
            shadeH={0.35}
            r="50%"
          />
        </Paper>

        {/* Uap tipis potongan kertas */}
        {[96, 152, 206].map((sx, i) => {
          const driftY = Math.sin(steamRise * Math.PI * 3 + i * 1.4) * 5;
          const op = interpolate(f, [184 + i * 4, 198 + i * 4], [0, 0.55], CLAMP);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sx,
                top: 24 + driftY,
                width: 12,
                height: 46,
                borderRadius: 10,
                background: C.creamHi,
                opacity: op,
                rotate: `${i % 2 === 0 ? -8 : 8}deg`,
                filter: 'url(#torn)',
              }}
            />
          );
        })}

        {/* Mangkuk semur ayam berlapis */}
        <Paper lift={9}>
          <Slab
            x={58}
            y={104}
            w={216}
            h={106}
            color={C.creamHi}
            shade={C.creamLo}
            shadeH={0.34}
            r="24px 24px 96px 96px"
            grain={0.45}
          />
          <Slab x={52} y={92} w={228} h={34} color={C.creamHi} shade={C.creamLo} shadeH={0.3} r="50%" />
          <Slab x={64} y={97} w={204} h={24} color="#58321C" shade="#3E2111" shadeH={0.4} r="50%" />
          {/* Potongan ayam & kentang kertas di dalam semur */}
          <Slab x={94} y={95} w={54} h={20} color="#8D5331" shade="#6A3C21" shadeH={0.35} r={10} rot={-6} />
          <Slab x={156} y={96} w={48} h={19} color="#9E613B" shade="#734326" shadeH={0.35} r={9} rot={7} />
          <Slab x={132} y={102} w={30} h={14} color="#D4B068" shade="#B18E49" shadeH={0.35} r={5} rot={-3} />
        </Paper>

        {/* Label 1: "diduga" pada kalimat semur ayam */}
        <PopIn at={202}>
          <Boil seed="m01-lbl-1" amp={0.4} rot={0.05}>
            <div style={{position: 'absolute', left: 32, top: 214, translate: '-50% 0', rotate: '-3deg'}}>
              <div
                style={{
                  backgroundColor: C.creamHi,
                  borderLeft: `6px solid ${C.amber}`,
                  padding: '10px 20px 12px',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 28,
                  lineHeight: 1,
                  color: C.ink,
                  whiteSpace: 'nowrap',
                  filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
                }}
              >
                diduga
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: -9,
                  translate: '-50% 0',
                  width: 54,
                  height: 16,
                  background: C.tape,
                  opacity: 0.85,
                  filter: 'url(#torn)',
                }}
              />
            </div>
          </Boil>
        </PopIn>

        {/* Label 2: "belum dipastikan" menyusul di sisi lain */}
        <PopIn at={250}>
          <Boil seed="m01-lbl-2" amp={0.4} rot={0.05}>
            <div style={{position: 'absolute', left: 238, top: 224, translate: '-50% 0', rotate: '2deg'}}>
              <div
                style={{
                  backgroundColor: C.creamHi,
                  borderLeft: `6px solid ${C.tag}`,
                  padding: '10px 20px 12px',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 26,
                  lineHeight: 1,
                  color: C.ink,
                  whiteSpace: 'nowrap',
                  filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
                }}
              >
                belum dipastikan
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: -9,
                  translate: '-50% 0',
                  width: 64,
                  height: 16,
                  background: C.tape,
                  opacity: 0.85,
                  filter: 'url(#torn)',
                }}
              />
            </div>
          </Boil>
        </PopIn>
      </div>
    </SlideIn>
  );
};

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M01_DUR - 10, M01_DUR], [0, 1], {
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

export const M01: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#CBD3D0'}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25} seed="m01-weave">
      <OrbitCamera
        dur={M01_DUR}
        yaw={14}
        drift={[-32, -8]}
        push={1.09}
        focus={0.5}
        depth={760}
        origin={[640, 440]}
      >
        <Depth z={0} cover>
          <CanteenBackdrop />
        </Depth>

        <Depth z={0.5}>
          {/* Permukaan meja kantin kertas */}
          <Slab x={-120} y={448} w={1520} h={320} color="#E6DFD3" r={0} grain={0.5} />
          <Slab x={-120} y={442} w={1520} h={16} color={C.wood} shade={C.woodLo} shadeH={0.4} r={0} />
          <Slab x={-120} y={668} w={1520} h={90} color={C.woodLo} r={0} grain={0.55} />

          <PaperCounter162 />
          <TrayAndFigures />
          <SemurBowlAndLabels />
        </Depth>

        <Depth z={0.95}>
          {/* Tepian bangku kantin latar depan untuk paralaks diorama */}
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-90} y={676} w={250} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1120} y={678} w={250} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <PaperFoldEdge />
    <GrainOverlay />
  </AbsoluteFill>
);