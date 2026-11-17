// Adegan MG T09: Tuas kecil Harga ke Nol, tiga tuas besar layanan, dan dua roda gigi syarat turunnya macet.
// Teater kertas halte pagi 1280x720 tanpa angka digit dan tokoh tanpa wajah sesuai brief T09.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Disc, GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Lamp, Plant} from '../../lib/paper/sets';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {CutSeries, PopUpOpen} from '../../lib/paper/transitions';
import {Boil, Figure, FLOOR_Y, Paper, Pill, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const T09_DUR = 875;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PaperTextCard: React.FC<{
  x: number;
  y: number;
  text: string;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  seed?: string;
  pad?: string;
}> = ({x, y, text, bg = C.cream, color = C.ink, size = 24, rot = -1, seed = 'card', pad = '10px 18px 12px'}) => (
  <Boil seed={seed} amp={0.4} rot={0.05}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: '-50% 0',
        rotate: `${rot}deg`,
        whiteSpace: 'nowrap',
        backgroundColor: bg,
        padding: pad,
        fontFamily: FONT.caption,
        fontWeight: 900,
        fontSize: size,
        color,
        lineHeight: 1.05,
        filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
      }}
    >
      {text}
    </div>
  </Boil>
);

const PaperCar: React.FC<{x: number; y: number; color: string; shade: string; empty?: boolean}> = ({
  x,
  y,
  color,
  shade,
  empty = false,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 108, height: 54}}>
    <Paper lift={4}>
      <Slab x={18} y={2} w={64} h={24} color={color} shade={shade} shadeH={0.15} r="10px 14px 2px 2px" />
      <Slab x={26} y={6} w={22} h={15} color={C.creamHi} r={3} />
      <Slab x={52} y={6} w={22} h={15} color={C.creamHi} r={3} />
      {!empty ? <Disc x={37} y={13} d={12} color={C.inkSoft} /> : null}
      <Slab x={0} y={22} w={104} h={22} color={color} shade={shade} shadeH={0.25} r="6px 10px 5px 5px" />
      <Disc x={24} y={44} d={20} color={C.ink} />
      <Disc x={24} y={44} d={8} color={C.creamLo} />
      <Disc x={80} y={44} d={20} color={C.ink} />
      <Disc x={80} y={44} d={8} color={C.creamLo} />
    </Paper>
  </div>
);

const MiniBusIcon: React.FC<{x: number; y: number; w?: number; h?: number; color?: string; crowded?: boolean}> = ({
  x,
  y,
  w = 88,
  h = 44,
  color = C.amber,
  crowded = false,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, translate: '-50% -50%'}}>
    <Paper lift={4}>
      <Slab x={0} y={0} w={w} h={h - 8} color={color} shade={C.amberDim} shadeH={0.2} r={8} />
      {[0.14, 0.38, 0.62].map((p, i) => (
        <Slab
          key={i}
          x={Math.round(w * p)}
          y={7}
          w={Math.round(w * 0.18)}
          h={Math.round((h - 8) * 0.42)}
          color={C.creamHi}
          r={3}
        />
      ))}
      {crowded
        ? [0.2, 0.3, 0.44, 0.54, 0.68, 0.78].map((p, i) => (
            <Disc key={i} x={Math.round(w * p)} y={15} d={10} color={C.inkSoft} />
          ))
        : [0.23, 0.47, 0.71].map((p, i) => <Disc key={i} x={Math.round(w * p)} y={16} d={10} color={C.inkSoft} />)}
      <Disc x={Math.round(w * 0.24)} y={h - 6} d={16} color={C.ink} />
      <Disc x={Math.round(w * 0.76)} y={h - 6} d={16} color={C.ink} />
    </Paper>
  </div>
);

const FoldedMapIcon: React.FC<{x: number; y: number; open?: number}> = ({x, y, open = 1}) => {
  const w = Math.round(64 + 34 * open);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 54, translate: '-50% -50%'}}>
      <Paper lift={4}>
        <Slab x={0} y={0} w={Math.round(w / 3)} h={52} color={C.creamHi} shade={C.creamLo} shadeH={0.15} r={3} />
        <Slab
          x={Math.round(w / 3) - 2}
          y={3}
          w={Math.round(w / 3)}
          h={52}
          color={C.cream}
          shade={C.creamLo}
          shadeH={0.18}
          r={3}
        />
        <Slab
          x={Math.round((2 * w) / 3) - 4}
          y={0}
          w={Math.round(w / 3)}
          h={52}
          color={C.creamHi}
          shade={C.creamLo}
          shadeH={0.15}
          r={3}
        />
        <div
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            top: 18,
            height: 5,
            background: C.go,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 14,
            top: 32,
            height: 5,
            background: C.cap,
            borderRadius: 3,
          }}
        />
        <Disc x={14} y={20} d={10} color={C.tag} />
        <Disc x={w - 14} y={34} d={10} color={C.go} />
      </Paper>
    </div>
  );
};

const RoadTrack: React.FC<{mode: 'jammed' | 'flowing' | 'jammed-again'; progress?: number}> = ({
  mode,
  progress = 0,
}) => {
  const f = useCurrentFrame();
  const palettes = [
    [C.tag, C.heroLo],
    [C.cap, C.capLo],
    [C.brass, C.brassLo],
    [ROOM.terracotta, C.woodLo],
    [ROOM.slate, C.boardLo],
    [C.sage, C.sageLo],
    [C.amber, C.amberDim],
    [C.purple, C.screen],
    [C.hero, C.heroLo],
  ] as const;

  const cars =
    mode === 'flowing'
      ? [0, 2, 5, 7].map((idx, slot) => {
          const base = 110 + slot * 285;
          const shift = interpolate(progress, [0, 1], [0, 120], CLAMP) + ((f * 1.4) % 45);
          return {
            key: idx,
            x: ((base + shift) % 1220) - 40,
            color: palettes[idx][0],
            shade: palettes[idx][1],
            empty: false,
          };
        })
      : palettes.map(([color, shade], i) => {
          const creep = Math.sin(f * 0.05 + i * 0.9) * 2;
          return {
            key: i,
            x: 24 + i * 136 + creep,
            color,
            shade,
            empty: false,
          };
        });

  return (
    <div style={{position: 'absolute', left: 0, top: FLOOR_Y + 18, width: 1280, height: 96}}>
      <Slab x={0} y={24} w={1280} h={64} color={C.board} shade={C.boardLo} shadeH={0.35} r={0} grain={0.65} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 28,
          height: 4,
          background: C.creamLo,
          opacity: 0.55,
        }}
      />
      {Array.from({length: 14}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 28 + i * 92,
            top: 56,
            width: 44,
            height: 4,
            background: C.tape,
            opacity: 0.45,
          }}
        />
      ))}
      {cars.map((c) => (
        <PaperCar key={c.key} x={c.x} y={2} color={c.color} shade={c.shade} empty={c.empty} />
      ))}
    </div>
  );
};

const HalteStage: React.FC<{
  dur: number;
  yaw?: number;
  push?: number;
  drift?: [number, number];
  roadMode: 'jammed' | 'flowing' | 'jammed-again';
  roadProgress?: number;
  bgContent: React.ReactNode;
  midContent: React.ReactNode;
  fgContent?: React.ReactNode;
}> = ({
  dur,
  yaw = 14,
  push = 1.07,
  drift = [24, -8],
  roadMode,
  roadProgress = 0,
  bgContent,
  midContent,
  fgContent,
}) => (
  <AbsoluteFill style={{backgroundColor: C.creamHi}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25}>
      <OrbitCamera dur={dur} yaw={yaw} push={push} drift={drift} focus={0.48} depth={650} origin={[640, 540]}>
        <Depth z={0.05} cover>
          <Slab x={-80} y={-60} w={1440} h={840} color={C.creamHi} r={0} grain={0.55} />
          <Slab x={-60} y={340} w={1400} h={270} color={C.cream} r={0} grain={0.45} />
          {[
            [70, 220, 140, 380, C.creamLo],
            [225, 260, 110, 340, C.tape],
            [960, 230, 130, 370, C.creamLo],
            [1105, 270, 120, 330, C.tape],
          ].map(([bx, by, bw, bh, bc], i) => (
            <Slab
              key={i}
              x={bx as number}
              y={by as number}
              w={bw as number}
              h={bh as number}
              color={bc as string}
              r={4}
              grain={0.4}
            />
          ))}
          <Slab x={-40} y={0} w={1360} h={28} color={C.wood} shade={C.woodLo} shadeH={0.35} r={0} />
          {Array.from({length: 12}).map((_, i) => (
            <Slab
              key={i}
              x={-10 + i * 110}
              y={22}
              w={112}
              h={24}
              color={i % 2 === 0 ? C.tag : C.cream}
              shade="rgba(0,0,0,0.14)"
              shadeH={0.25}
              r="0 0 14px 14px"
            />
          ))}
          <Slab x={56} y={40} w={16} h={FLOOR_Y - 40} color={C.metalLo} r={2} />
          <Slab x={1208} y={40} w={16} h={FLOOR_Y - 40} color={C.metalLo} r={2} />
          <Plant x={-18} y={FLOOR_Y - 165} s={0.55} />
          <Lamp x={1156} y={FLOOR_Y - 210} s={0.7} on />
          <Slab x={-80} y={FLOOR_Y} w={1440} h={160} color={C.floor} r={0} grain={0.6} />
          <Slab x={-80} y={FLOOR_Y - 20} w={1440} h={22} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          {bgContent}
        </Depth>
        <Depth z={0.48}>{midContent}</Depth>
        <Depth z={0.78}>
          <RoadTrack mode={roadMode} progress={roadProgress} />
          {fgContent}
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

const SmallPriceLever: React.FC<{
  x: number;
  y: number;
  pulled: number;
  scale?: number;
  showNolAt?: number;
}> = ({x, y, pulled, scale = 1, showNolAt = 0}) => {
  const angle = interpolate(pulled, [0, 1], [-26, 28], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 220,
        height: 220,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: '50% 100%',
      }}
    >
      <Paper lift={5}>
        <Slab x={26} y={136} w={168} h={84} color={C.board} shade={C.boardLo} shadeH={0.28} r={10} />
        <Slab x={42} y={150} w={136} h={54} color={C.creamLo} shade={C.tape} shadeH={0.2} r={6} />
        <Slab x={86} y={118} w={48} h={26} color={C.metal} shade={C.metalLo} shadeH={0.3} r="12px 12px 2px 2px" />
      </Paper>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 128,
          width: 12,
          height: 68,
          background: C.metalLo,
          borderRadius: 6,
          transformOrigin: '50% 100%',
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          boxShadow: '2px 3px 5px rgba(0,0,0,0.3)',
        }}
      >
        <Disc x={6} y={0} d={30} color={C.tag} />
      </div>
      <Disc x={110} y={128} d={18} color={C.brass} />
      <PaperTextCard x={110} y={162} text="Harga" bg={C.creamHi} color={C.ink} size={26} rot={-1} seed="harga-lbl" />
      <PopIn at={showNolAt}>
        <PaperTextCard
          x={168}
          y={68}
          text="Nol"
          bg={C.go}
          color={C.creamHi}
          size={28}
          rot={3}
          seed="nol-lbl"
          pad="8px 16px 10px"
        />
      </PopIn>
    </div>
  );
};

const BigServiceLever: React.FC<{
  x: number;
  y: number;
  grow: number;
  label: 'Frekuensi' | 'Jangkauan' | 'Daya tampung';
  iconKind: 'freq' | 'reach' | 'cap';
  tilt?: number;
  scale?: number;
}> = ({x, y, grow, label, iconKind, tilt = -12, scale = 1}) => {
  const h = Math.round(250 * grow);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 230,
        height: 360,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: '50% 100%',
        opacity: grow > 0.02 ? 1 : 0,
      }}
    >
      <Paper lift={6}>
        <Slab x={35} y={306} w={160} h={54} color={C.board} shade={C.boardLo} shadeH={0.32} r={10} />
        <Slab x={55} y={286} w={120} h={26} color={C.brass} shade={C.brassLo} shadeH={0.3} r="14px 14px 4px 4px" />
      </Paper>
      <div
        style={{
          position: 'absolute',
          left: 115,
          top: 292,
          width: 22,
          height: h,
          background: C.wood,
          borderLeft: `5px solid ${C.woodHi}`,
          borderRight: `5px solid ${C.woodLo}`,
          borderRadius: 10,
          transformOrigin: '50% 100%',
          transform: `translate(-50%, -100%) rotate(${tilt}deg)`,
          boxShadow: '3px 5px 8px rgba(0,0,0,0.34)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -12,
            width: 56,
            height: 28,
            translate: '-50% -50%',
            background: C.tag,
            borderRadius: 14,
            border: `3px solid ${C.heroLo}`,
          }}
        />
        {grow > 0.65 ? (
          <div style={{position: 'absolute', left: '50%', top: -64, translate: '-50% -50%'}}>
            {iconKind === 'freq' ? (
              <div style={{position: 'relative', width: 150, height: 64}}>
                <MiniBusIcon x={44} y={36} w={68} h={36} color={C.amber} />
                <MiniBusIcon x={108} y={26} w={68} h={36} color={C.go} />
              </div>
            ) : iconKind === 'reach' ? (
              <FoldedMapIcon x={0} y={10} open={grow} />
            ) : (
              <MiniBusIcon x={0} y={14} w={124} h={52} color={C.cap} />
            )}
          </div>
        ) : null}
      </div>
      <Disc x={115} y={294} d={28} color={C.metal} />
      <PaperTextCard
        x={115}
        y={312}
        text={label}
        bg={C.creamHi}
        color={C.ink}
        size={25}
        rot={-1}
        seed={`lbl-${label}`}
      />
    </div>
  );
};

const DisconnectedRope: React.FC<{progress: number}> = ({progress}) => {
  const w = Math.round(165 * progress);
  return (
    <div style={{position: 'absolute', left: 265, top: 446, width: 220, height: 60}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 18,
          width: w,
          height: 8,
          background: C.tape,
          borderTop: `2px dashed ${C.woodLo}`,
          borderBottom: `2px dashed ${C.woodLo}`,
          borderRadius: 4,
          boxShadow: '1px 3px 4px rgba(0,0,0,0.25)',
        }}
      />
      {progress > 0.85 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: w - 4,
              top: 16,
              width: 18,
              height: 28,
              background: C.tape,
              rotate: '38deg',
              borderRadius: 3,
            }}
          />
          <Disc x={w + 4} y={42} d={14} color={C.tag} />
        </>
      ) : null}
    </div>
  );
};

const PaperGear: React.FC<{
  x: number;
  y: number;
  r: number;
  deg: number;
  color: string;
  shade: string;
  centerColor?: string;
  teeth?: number;
  children?: React.ReactNode;
}> = ({x, y, r, deg, color, shade, centerColor = C.creamHi, teeth = 12, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, translate: '-50% -50%'}}>
    <Paper lift={7}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `rotate(${deg}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {Array.from({length: teeth}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: Math.round(r * 0.34),
              height: Math.round(r * 2.28),
              translate: '-50% -50%',
              rotate: `${(i * 360) / teeth}deg`,
              background: shade,
              borderRadius: 6,
            }}
          />
        ))}
        <Disc x={r} y={r} d={r * 2} color={color} />
        <Disc x={r} y={r} d={Math.round(r * 1.44)} color={shade} />
        <Disc x={r} y={r} d={Math.round(r * 1.12)} color={centerColor} />
        <Disc x={r} y={r} d={Math.round(r * 0.32)} color={C.inkSoft} />
      </div>
    </Paper>
    {children}
  </div>
);

const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const pullStep = Math.round(interpolate(f, [42, 76], [0, 4], CLAMP)) / 4;
  return (
    <PopUpOpen dur={20}>
      <HalteStage
        dur={170}
        yaw={16}
        push={1.08}
        drift={[28, -10]}
        roadMode="jammed"
        bgContent={
          <>
            <Slab x={420} y={360} w={520} h={240} color={C.creamLo} shade={C.tape} shadeH={0.12} r={8} />
            <Figure x={980} y={FLOOR_Y} s={0.88} shirt={ROOM.dusk} />
            <Figure x={1075} y={FLOOR_Y} s={0.84} shirt={ROOM.terracotta} />
          </>
        }
        midContent={
          <SnapZoom at={68} x={310} y={470} to={1.14} settle={1.08} shake={4} roll={0.6}>
            <SmallPriceLever x={310} y={FLOOR_Y} pulled={pullStep} scale={1.12} showNolAt={72} />
          </SnapZoom>
        }
      />
    </PopUpOpen>
  );
};

const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const g1 = Math.round(interpolate(f, [14, 52], [0, 6], CLAMP)) / 6;
  const g2 = Math.round(interpolate(f, [58, 96], [0, 6], CLAMP)) / 6;
  const g3 = Math.round(interpolate(f, [102, 140], [0, 6], CLAMP)) / 6;
  return (
    <HalteStage
      dur={175}
      yaw={-16}
      push={1.08}
      drift={[-26, -8]}
      roadMode="jammed"
      bgContent={<Figure x={1155} y={FLOOR_Y} s={0.82} shirt={ROOM.dusk} />}
      midContent={
        <>
          <SmallPriceLever x={200} y={FLOOR_Y} pulled={1} scale={0.95} showNolAt={0} />
          <BigServiceLever x={520} y={FLOOR_Y} grow={g1} label="Frekuensi" iconKind="freq" />
          <BigServiceLever x={785} y={FLOOR_Y} grow={g2} label="Jangkauan" iconKind="reach" />
          <BigServiceLever x={1050} y={FLOOR_Y} grow={g3} label="Daya tampung" iconKind="cap" />
        </>
      }
    />
  );
};

const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const ropeP = Math.round(interpolate(f, [16, 68], [0, 8], CLAMP)) / 8;
  return (
    <HalteStage
      dur={150}
      yaw={15}
      push={1.09}
      drift={[24, -12]}
      roadMode="jammed"
      bgContent={<Figure x={1165} y={FLOOR_Y} s={0.82} shirt={ROOM.dusk} />}
      midContent={
        <>
          <SmallPriceLever x={200} y={FLOOR_Y} pulled={1} scale={0.95} showNolAt={0} />
          <DisconnectedRope progress={ropeP} />
          <BigServiceLever x={520} y={FLOOR_Y} grow={1} label="Frekuensi" iconKind="freq" />
          <BigServiceLever x={785} y={FLOOR_Y} grow={1} label="Jangkauan" iconKind="reach" />
          <BigServiceLever x={1050} y={FLOOR_Y} grow={1} label="Daya tampung" iconKind="cap" />
        </>
      }
    />
  );
};

const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const slideIn = interpolate(f, [8, 54], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const locked = interpolate(f, [56, 195], [0, 1], CLAMP);
  const stepSpin = Math.round(locked * 28) * 4.5;
  const leftX = interpolate(slideIn, [0, 1], [230, 505], CLAMP);
  const rightX = interpolate(slideIn, [0, 1], [1050, 775], CLAMP);
  const leverTilt = interpolate(f, [56, 95], [-12, 16], CLAMP);

  return (
    <HalteStage
      dur={200}
      yaw={-16}
      push={1.08}
      drift={[-24, -8]}
      roadMode={f >= 58 ? 'flowing' : 'jammed'}
      roadProgress={locked}
      bgContent={
        <div style={{opacity: 0.88}}>
          <SmallPriceLever x={135} y={455} pulled={1} scale={0.62} showNolAt={0} />
          <BigServiceLever x={980} y={455} grow={1} label="Frekuensi" iconKind="freq" tilt={leverTilt} scale={0.52} />
          <BigServiceLever x={1095} y={455} grow={1} label="Jangkauan" iconKind="reach" tilt={leverTilt} scale={0.52} />
          <BigServiceLever x={1210} y={455} grow={1} label="Daya tampung" iconKind="cap" tilt={leverTilt} scale={0.52} />
        </div>
      }
      midContent={
        <>
          <Tag x={640} y={42} text="Dua syarat" at={0} bg={C.tag} color={C.tagText} size={38} rot={-1} seed="dua-syarat" />
          <PaperGear x={leftX} y={320} r={122} deg={stepSpin} color={C.brass} shade={C.brassLo}>
            <div style={{position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%'}}>
              <Figure x={-18} y={38} s={0.38} shirt={C.cap} />
              <Figure x={18} y={38} s={0.38} shirt={C.go} />
            </div>
          </PaperGear>
          <PaperGear x={rightX} y={320} r={122} deg={-stepSpin + 15} color={C.go} shade={C.goDim}>
            <MiniBusIcon x={122} y={122} w={96} h={46} color={C.amber} />
          </PaperGear>
          <SlideIn at={14} dx={-40} dy={0}>
            <Pill
              x={330}
              y={530}
              text="Cukup banyak pengendara mobil yang pindah"
              bg={C.creamHi}
              color={C.ink}
              size={22}
            />
          </SlideIn>
          <SlideIn at={22} dx={40} dy={0}>
            <Pill
              x={900}
              y={530}
              text="Layanan yang mampu menampung mereka semua"
              bg={C.creamHi}
              color={C.ink}
              size={20}
            />
          </SlideIn>
        </>
      }
    />
  );
};

const Beat5: React.FC = () => {
  const f = useCurrentFrame();
  const uncouple = interpolate(f, [8, 44], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const bloat = interpolate(f, [48, 92], [1, 1.14], CLAMP);
  const sag = interpolate(f, [48, 96], [0, 14], CLAMP);
  const walkBack = interpolate(f, [60, 130], [0, 1], CLAMP);
  const idleSpin = Math.round(interpolate(f, [0, 175], [0, 32], CLAMP)) * 6;
  const rightX = interpolate(uncouple, [0, 1], [775, 920], CLAMP);
  const rightY = interpolate(uncouple, [0, 1], [320, 290], CLAMP);
  const leverExit = interpolate(uncouple, [0, 1], [0, 380], CLAMP);
  const walkerX = interpolate(walkBack, [0, 1], [590, 415], CLAMP);

  return (
    <HalteStage
      dur={180}
      yaw={16}
      push={1.08}
      drift={[22, -6]}
      roadMode="jammed-again"
      bgContent={
        <div style={{opacity: 0.85}}>
          <SmallPriceLever x={135} y={455} pulled={1} scale={0.62} showNolAt={0} />
          <BigServiceLever x={980 + leverExit} y={455} grow={1} label="Frekuensi" iconKind="freq" tilt={-14} scale={0.5} />
          <BigServiceLever x={1095 + leverExit} y={455} grow={1} label="Jangkauan" iconKind="reach" tilt={-14} scale={0.5} />
          <BigServiceLever x={1210 + leverExit} y={455} grow={1} label="Daya tampung" iconKind="cap" tilt={-14} scale={0.5} />
        </div>
      }
      midContent={
        <>
          <Tag x={640} y={42} text="Dua syarat" at={0} bg={C.tag} color={C.tagText} size={38} rot={-1} seed="dua-syarat-5" />
          <PaperGear x={430} y={325} r={120} deg={idleSpin} color={C.brass} shade={C.brassLo} />
          <div
            style={{
              position: 'absolute',
              left: rightX,
              top: rightY,
              transform: `scale(${bloat}) rotate(${sag}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <PaperGear x={0} y={0} r={112} deg={0} color={C.nogo} shade={C.nogoDim}>
              <MiniBusIcon x={112} y={112} w={104} h={50} color={C.amber} crowded />
            </PaperGear>
          </div>
          <Figure x={walkerX} y={FLOOR_Y - 6} s={0.66} shirt={ROOM.dusk} />
          <Figure x={walkerX + 58} y={FLOOR_Y - 6} s={0.64} shirt={C.tag} />
          <Pill
            x={330}
            y={530}
            text="Cukup banyak pengendara mobil yang pindah"
            bg={C.creamHi}
            color={C.ink}
            size={22}
          />
          <Pill
            x={900}
            y={530}
            text="Layanan yang mampu menampung mereka semua"
            bg={C.creamHi}
            color={C.ink}
            size={20}
          />
        </>
      }
    />
  );
};

export const T09: React.FC = () => (
  <CutSeries
    scenes={[
      {id: 'B1', component: Beat1, durationInFrames: 170},
      {id: 'B2', component: Beat2, durationInFrames: 175},
      {id: 'B3', component: Beat3, durationInFrames: 150},
      {id: 'B4', component: Beat4, durationInFrames: 200},
      {id: 'B5', component: Beat5, durationInFrames: 180},
    ]}
    cuts={{
      B2: {kind: 'pageTurn', align: 'mid'},
      B3: {kind: 'tapePull', align: 'mid', y: 120},
      B4: {kind: 'popUpBook', align: 'mid'},
      B5: {kind: 'tearAway', align: 'mid', x: 640},
    }}
  />
);
