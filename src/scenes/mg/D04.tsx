// Adegan D04 "Saldo yang Tidak Berubah" (scene 41-47, 403 frame @30fps): toples koin rupiah tetap sama,
// benda kebutuhan disalin kertas kalkir identik, dan hanya tag label di leher toples yang diganti.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, SlideIn} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D04_DUR = 403;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PERSP = 1600;
const COUNTER_Y = 532;

interface DepthLayerProps {
  z: number;
  panX: number;
  panY: number;
  yaw: number;
  zoom: number;
  cover?: boolean;
  children: React.ReactNode;
}

const DepthLayer: React.FC<DepthLayerProps> = ({z, panX, panY, yaw, zoom, cover = false, children}) => {
  const focus = 0.48;
  const span = 760;
  const tz = (z - focus) * span;
  const comp = (PERSP - tz) / PERSP;
  const parallax = 1 + (z - focus) * 0.55;
  const bleed = cover ? 1.16 : 1;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: '640px 390px',
        transform: `perspective(${PERSP}px) translate(${panX * parallax}px, ${panY * parallax}px) rotateY(${yaw}deg) translateZ(${tz}px) scale(${comp * bleed * zoom})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SpotlightRing: React.FC<{cx: number; cy: number; r: number; opacity: number; scale?: number}> = ({
  cx,
  cy,
  r,
  opacity,
  scale = 1,
}) => {
  if (opacity <= 0.005) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        opacity,
        transform: `scale(${scale})`,
        background: 'radial-gradient(circle, rgba(255,232,150,0.42) 0%, rgba(255,220,120,0.16) 62%, rgba(255,220,120,0) 76%)',
        border: '2.5px dashed rgba(248, 214, 118, 0.85)',
        boxShadow: '0 0 28px rgba(255, 216, 110, 0.32)',
        pointerEvents: 'none',
      }}
    />
  );
};

const RiceSackBody: React.FC<{kalkir?: boolean}> = ({kalkir = false}) => {
  const fillMain = kalkir ? 'rgba(255, 253, 247, 0.62)' : '#DFC8A2';
  const fillShade = kalkir ? 'rgba(244, 240, 230, 0.55)' : '#C4A97E';
  const tieColor = kalkir ? 'rgba(255, 255, 255, 0.88)' : C.woodLo;
  const edgeBorder = kalkir ? '2px solid rgba(255, 255, 255, 0.94)' : '1.5px solid rgba(94, 59, 34, 0.25)';

  return (
    <div style={{position: 'relative', width: 92, height: 112}}>
      {/* Ear folds */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 2,
          width: 22,
          height: 24,
          background: fillShade,
          borderRadius: '8px 14px 4px 4px',
          transform: 'rotate(-16deg)',
          border: edgeBorder,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 2,
          width: 22,
          height: 24,
          background: fillMain,
          borderRadius: '14px 8px 4px 4px',
          transform: 'rotate(16deg)',
          border: edgeBorder,
        }}
      />
      {/* Main sack body */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 20,
          width: 80,
          height: 92,
          background: `linear-gradient(180deg, ${fillMain} 0%, ${fillShade} 100%)`,
          borderRadius: '28px 28px 18px 18px',
          border: edgeBorder,
          boxShadow: kalkir ? '0 3px 10px rgba(255,255,255,0.35)' : '0 4px 8px rgba(0,0,0,0.22)',
        }}
      />
      {/* Neck tie */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 19,
          width: 48,
          height: 7,
          borderRadius: 4,
          background: tieColor,
        }}
      />
    </div>
  );
};

const JerrycanBody: React.FC<{kalkir?: boolean}> = ({kalkir = false}) => {
  const fillMain = kalkir ? 'rgba(255, 253, 247, 0.62)' : '#C8523B';
  const fillDark = kalkir ? 'rgba(242, 238, 228, 0.56)' : '#9D3C29';
  const edgeBorder = kalkir ? '2px solid rgba(255, 255, 255, 0.94)' : '1.5px solid rgba(58, 24, 18, 0.28)';

  return (
    <div style={{position: 'relative', width: 84, height: 108}}>
      {/* Handle bar */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 4,
          width: 36,
          height: 16,
          borderRadius: '7px 7px 0 0',
          border: `6px solid ${fillMain}`,
          borderBottom: 'none',
          boxSizing: 'border-box',
        }}
      />
      {/* Cap */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          top: 7,
          width: 16,
          height: 12,
          borderRadius: 3,
          background: kalkir ? 'rgba(255,255,255,0.88)' : C.inkSoft,
          transform: 'rotate(18deg)',
        }}
      />
      {/* Main tank */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 18,
          width: 68,
          height: 90,
          borderRadius: '14px 16px 10px 10px',
          background: `linear-gradient(135deg, ${fillMain} 0%, ${fillDark} 100%)`,
          border: edgeBorder,
          boxShadow: kalkir ? '0 3px 10px rgba(255,255,255,0.35)' : '0 4px 8px rgba(0,0,0,0.22)',
        }}
      >
        {/* Embossed X rib */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 38,
            width: 38,
            height: 5,
            borderRadius: 3,
            background: kalkir ? 'rgba(255,255,255,0.65)' : 'rgba(255,235,220,0.22)',
            transform: 'rotate(36deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 38,
            width: 38,
            height: 5,
            borderRadius: 3,
            background: kalkir ? 'rgba(255,255,255,0.65)' : 'rgba(255,235,220,0.22)',
            transform: 'rotate(-36deg)',
          }}
        />
      </div>
    </div>
  );
};

const KosHouseBody: React.FC<{kalkir?: boolean}> = ({kalkir = false}) => {
  const wallFill = kalkir ? 'rgba(255, 253, 247, 0.64)' : '#EFE6D6';
  const roofFill = kalkir ? 'rgba(246, 243, 236, 0.68)' : '#B8543A';
  const edgeBorder = kalkir ? '2px solid rgba(255, 255, 255, 0.94)' : '1.5px solid rgba(58, 42, 30, 0.25)';

  return (
    <div style={{position: 'relative', width: 104, height: 108}}>
      {/* Pitched roof */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 6,
          width: 96,
          height: 44,
          background: roofFill,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          filter: kalkir ? 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' : 'drop-shadow(0 3px 4px rgba(0,0,0,0.24))',
        }}
      />
      {/* House walls */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 48,
          width: 76,
          height: 60,
          background: wallFill,
          borderRadius: '2px 2px 4px 4px',
          border: edgeBorder,
          boxShadow: kalkir ? '0 3px 10px rgba(255,255,255,0.35)' : '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        {/* Wooden door */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 0,
            width: 20,
            height: 36,
            borderRadius: '3px 3px 0 0',
            background: kalkir ? 'rgba(255,255,255,0.55)' : C.wood,
            border: kalkir ? '1.5px solid rgba(255,255,255,0.85)' : 'none',
          }}
        />
        {/* Warm window */}
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: 14,
            width: 20,
            height: 20,
            borderRadius: 3,
            background: kalkir ? 'rgba(255,255,255,0.72)' : '#F5CF6B',
            border: `2px solid ${kalkir ? 'rgba(255,255,255,0.9)' : C.woodLo}`,
          }}
        />
      </div>
    </div>
  );
};

const CoinJar: React.FC = () => {
  // Deterministic stacked honey-yellow rupiah coins (plain discs, zero text)
  const coinRows = [
    [22, 62, 102, 142],
    [14, 52, 92, 132, 152],
    [24, 66, 106, 144],
    [16, 56, 96, 136],
    [26, 68, 108, 146],
    [18, 58, 98, 138],
    [28, 70, 110, 144],
    [20, 62, 102, 138],
    [30, 74, 114],
  ];

  return (
    <div style={{position: 'relative', width: 204, height: 266}}>
      {/* Wooden/cork lid */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 0,
          width: 136,
          height: 24,
          borderRadius: '8px 8px 4px 4px',
          background: `linear-gradient(180deg, ${C.woodHi} 0%, ${C.woodLo} 100%)`,
          boxShadow: '0 4px 6px rgba(0,0,0,0.28)',
        }}
      />
      {/* Glass neck */}
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 22,
          width: 120,
          height: 26,
          background: 'rgba(235, 245, 247, 0.56)',
          borderLeft: '2.5px solid rgba(255,255,255,0.85)',
          borderRight: '2.5px solid rgba(255,255,255,0.85)',
        }}
      />
      {/* Jar body back */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 44,
          width: 196,
          height: 222,
          borderRadius: '34px 34px 26px 26px',
          background: 'linear-gradient(180deg, rgba(242,248,250,0.52) 0%, rgba(212,226,232,0.62) 100%)',
          border: '3px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 10px 22px rgba(28, 27, 23, 0.26)',
          overflow: 'hidden',
        }}
      >
        {/* Honey-yellow rupiah coins filling the jar */}
        {coinRows.map((row, rIdx) =>
          row.map((cx, cIdx) => {
            const cy = 194 - rIdx * 17 - ((cIdx % 2) * 3);
            const isBright = (rIdx + cIdx) % 2 === 0;
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: 36,
                  height: 18,
                  borderRadius: '50%',
                  background: isBright ? '#F0C24B' : '#DFAA32',
                  border: '2px solid #B8831E',
                  boxShadow: '0 3px 0 #9E6E16',
                }}
              />
            );
          }),
        )}
        {/* Glass sheen highlight */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            width: 18,
            height: 182,
            borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.12) 100%)',
          }}
        />
        {/* Thick glass bottom */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            background: 'rgba(195, 215, 222, 0.65)',
          }}
        />
      </div>
    </div>
  );
};

export const D04: React.FC = () => {
  const f = useCurrentFrame();

  // Multi-beat calm camera movement:
  // Beat 1-2 (0..135): calm framing on coin jar & envelope
  // Beat 3 (135..325): smooth pan right toward the wall shelf items
  // Beat 4 (325..395): smooth dolly-in & pan left to the jar's hanging neck tag, held steady 395..403
  const panRight = interpolate(f, [132, 185], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const dollyToTag = interpolate(f, [324, 386], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const panX = 36 - 176 * panRight + 224 * dollyToTag;
  const panY = 22 * dollyToTag;
  const yaw = -2.5 + 7.5 * panRight - 8.5 * dollyToTag;
  const zoom = 1.03 - 0.01 * panRight + 0.14 * dollyToTag;

  // Beat 3 spotlight & tracing-paper twin ("kembaran kalkir") progressions
  // Item 1: Rice sack (scene 043: rel 149-204)
  const spot1 =
    interpolate(f, [146, 156], [0, 1], CLAMP) * interpolate(f, [202, 216], [1, 0.18], CLAMP);
  const kalkir1Y = interpolate(f, [152, 182], [-24, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const kalkir1Op = interpolate(f, [150, 162], [0, 1], CLAMP);

  // Item 2: Jerrycan (scene 044: rel 219-265)
  const spot2 =
    interpolate(f, [216, 226], [0, 1], CLAMP) * interpolate(f, [263, 277], [1, 0.18], CLAMP);
  const kalkir2Y = interpolate(f, [222, 248], [-24, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const kalkir2Op = interpolate(f, [220, 232], [0, 1], CLAMP);

  // Item 3: Miniature kos house (scene 045: rel 282-321)
  const spot3 =
    interpolate(f, [279, 289], [0, 1], CLAMP) * interpolate(f, [319, 333], [1, 0.18], CLAMP);
  const kalkir3Y = interpolate(f, [285, 308], [-24, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const kalkir3Op = interpolate(f, [283, 294], [0, 1], CLAMP);

  // Beat 4 tag swap on the jar neck (scene 046: rel 333-368, scene 047: rel 384-403)
  const oldTagDrop = interpolate(f, [333, 362], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const oldTagOp = interpolate(f, [346, 362], [1, 0], CLAMP);

  const newTagIn = interpolate(f, [360, 382], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const newTagSwing = interpolate(f, [360, 376, 392], [-14, 3, -2], CLAMP);
  const stampScale = interpolate(f, [382, 390], [1.14, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const stampOp = interpolate(f, [382, 387], [0, 1], CLAMP);
  const tagSpotOp = interpolate(f, [378, 390], [0, 1], CLAMP);

  // Calm steam drift on the warung coffee cup
  const steamOffset = (f * 0.45) % 44;

  // Floating paper dust motes
  const dustSpecs = [
    {x: 340, y: 210, r: 4, phase: 0},
    {x: 410, y: 265, r: 3, phase: 1.4},
    {x: 525, y: 195, r: 4.5, phase: 2.7},
    {x: 565, y: 270, r: 3, phase: 4.1},
    {x: 315, y: 315, r: 3.5, phase: 5.0},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* Layer 0: Back wall, warung TV, hanging pendant lamp, terracotta scarf on hook */}
        <DepthLayer z={0} panX={panX} panY={panY} yaw={yaw} zoom={zoom} cover>
          <Slab x={-60} y={-40} w={1400} h={800} color={C.creamHi} r={0} grain={0.55} />
          {/* Subtle wall wainscot paneling */}
          <Slab x={-60} y={415} w={1400} h={14} color={C.creamLo} r={0} />
          <Slab x={-60} y={429} w={1400} h={330} color={C.cream} r={0} grain={0.45} />

          {/* Warm stage radial glow */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 44% 42%, rgba(255,244,210,0.28) 0%, rgba(0,0,0,0) 52%, rgba(28,27,23,0.24) 100%)',
            }}
          />

          {/* Hanging pendant lamp above coin jar */}
          <Paper lift={5}>
            <Slab x={457} y={-30} w={6} h={118} color={C.inkSoft} r={2} />
            <div
              style={{
                position: 'absolute',
                left: 444,
                top: 128,
                width: 32,
                height: 22,
                borderRadius: '50%',
                background: '#FFF4CE',
                boxShadow: '0 0 32px rgba(255, 224, 125, 0.9)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 392,
                top: 84,
                width: 136,
                height: 54,
                background: `linear-gradient(180deg, ${C.amber} 0%, ${C.brass} 100%)`,
                clipPath: 'polygon(26% 0%, 74% 0%, 100% 100%, 0% 100%)',
                filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.26))',
              }}
            />
            {/* Warm lamp light cone */}
            <div
              style={{
                position: 'absolute',
                left: 255,
                top: 138,
                width: 410,
                height: 410,
                background: 'linear-gradient(180deg, rgba(255,228,142,0.22) 0%, rgba(255,228,142,0.03) 100%)',
                clipPath: 'polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
              }}
            />
          </Paper>

          {/* Warung anchor 1: Paper television with glowing blank screen (no text/numbers) */}
          <Paper lift={4}>
            {/* Wall shelf bracket for TV */}
            <Slab x={108} y={316} w={146} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
            {/* V-antenna */}
            <div
              style={{
                position: 'absolute',
                left: 168,
                top: 168,
                width: 3,
                height: 36,
                background: C.inkSoft,
                transform: 'rotate(-26deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 192,
                top: 168,
                width: 3,
                height: 36,
                background: C.inkSoft,
                transform: 'rotate(26deg)',
              }}
            />
            {/* TV wooden box */}
            <Slab x={118} y={198} w={126} h={118} color={C.woodHi} shade={C.woodLo} shadeH={0.14} r={10} />
            {/* Blank glowing screen */}
            <div
              style={{
                position: 'absolute',
                left: 130,
                top: 212,
                width: 82,
                height: 88,
                borderRadius: 10,
                background: 'radial-gradient(circle at 45% 42%, #F3F7F8 0%, #CBD8DE 100%)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25), 0 0 18px rgba(220,236,242,0.45)',
              }}
            />
            {/* Two plain round dials */}
            <div
              style={{
                position: 'absolute',
                left: 221,
                top: 226,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: C.creamLo,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 221,
                top: 252,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: C.creamLo,
              }}
            />
          </Paper>

          {/* Warung anchor 2: Terracotta paper scarf hanging on a wall hook at the right edge */}
          <Paper lift={4}>
            <div
              style={{
                position: 'absolute',
                left: 1152,
                top: 144,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: C.woodLo,
              }}
            />
            {/* Hanging scarf drape */}
            <div
              style={{
                position: 'absolute',
                left: 1138,
                top: 152,
                width: 24,
                height: 146,
                borderRadius: '10px 10px 3px 3px',
                background: '#A94932',
                transform: 'rotate(3deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 1148,
                top: 150,
                width: 26,
                height: 168,
                borderRadius: '12px 12px 3px 3px',
                background: '#C9573C',
                transform: 'rotate(-2deg)',
                boxShadow: '2px 5px 10px rgba(0,0,0,0.22)',
              }}
            />
          </Paper>
        </DepthLayer>

        {/* Layer 1: Wall shelf + 3 everyday items + translucent tracing-paper twins ("kembaran kalkir") */}
        <DepthLayer z={0.25} panX={panX} panY={panY} yaw={yaw} zoom={zoom}>
          <Paper lift={6}>
            {/* Wall shelf plank & brackets */}
            <Slab x={735} y={365} w={420} h={20} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
            <div
              style={{
                position: 'absolute',
                left: 775,
                top: 385,
                width: 26,
                height: 36,
                background: C.woodLo,
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 1085,
                top: 385,
                width: 26,
                height: 36,
                background: C.woodLo,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              }}
            />

            {/* Spotlight circles for the 3 shelf items */}
            <SpotlightRing cx={806} cy={306} r={68} opacity={spot1} scale={0.96 + 0.04 * spot1} />
            <SpotlightRing cx={946} cy={308} r={68} opacity={spot2} scale={0.96 + 0.04 * spot2} />
            <SpotlightRing cx={1086} cy={308} r={70} opacity={spot3} scale={0.96 + 0.04 * spot3} />

            {/* 1. Karung beras polos + kembaran kalkir */}
            <div style={{position: 'absolute', left: 760, top: 253}}>
              <RiceSackBody />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: kalkir1Y,
                  opacity: kalkir1Op,
                  pointerEvents: 'none',
                }}
              >
                <RiceSackBody kalkir />
              </div>
            </div>

            {/* 2. Jerigen bensin polos + kembaran kalkir */}
            <div style={{position: 'absolute', left: 904, top: 257}}>
              <JerrycanBody />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: kalkir2Y,
                  opacity: kalkir2Op,
                  pointerEvents: 'none',
                }}
              >
                <JerrycanBody kalkir />
              </div>
            </div>

            {/* 3. Rumah mungil (kos) + kembaran kalkir */}
            <div style={{position: 'absolute', left: 1034, top: 257}}>
              <KosHouseBody />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: kalkir3Y,
                  opacity: kalkir3Op,
                  pointerEvents: 'none',
                }}
              >
                <KosHouseBody kalkir />
              </div>
            </div>
          </Paper>
        </DepthLayer>

        {/* Layer 2: Main warung counter, honey-yellow coin jar, plain envelope ("Rp5.000.000"), neck tag ("LABELNYA") */}
        <DepthLayer z={0.5} panX={panX} panY={panY} yaw={yaw} zoom={zoom}>
          {/* Warung wooden counter */}
          <Paper lift={6}>
            <Slab x={-60} y={COUNTER_Y} w={1400} h={22} color={C.woodHi} shade={C.wood} shadeH={0.35} r={0} />
            <Slab x={-60} y={COUNTER_Y + 22} w={1400} h={200} color={C.wood} shade={C.floor} shadeH={0.25} r={0} grain={0.55} />
            <div style={{position: 'absolute', left: -60, right: -60, top: COUNTER_Y + 68, height: 3, background: C.woodLo, opacity: 0.7}} />
            <div style={{position: 'absolute', left: -60, right: -60, top: COUNTER_Y + 124, height: 3, background: C.woodLo, opacity: 0.7}} />
          </Paper>

          {/* Jar of honey-yellow rupiah coins (height never changes) */}
          <div style={{position: 'absolute', left: 364, top: COUNTER_Y - 264}}>
            <CoinJar />
          </div>

          {/* Plain envelope with tag "Rp5.000.000" sliding onto counter at scene 042 (rel 82) */}
          <SlideIn at={78} dx={-120} dy={0} dur={16}>
            <Boil seed="env-d04" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 162, top: COUNTER_Y - 102, width: 214, height: 104}}>
                {/* Plain paper envelope */}
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 0,
                    width: 182,
                    height: 98,
                    borderRadius: 6,
                    background: '#E5D3B3',
                    border: '2px solid #B89F78',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.24)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Envelope V-flap */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 182,
                      height: 54,
                      background: '#D5C09B',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }}
                  />
                </div>
                {/* Envelope tag displaying "Rp5.000.000" */}
                <div
                  style={{
                    position: 'absolute',
                    left: 2,
                    top: 40,
                    width: 210,
                    padding: '10px 14px 11px',
                    borderRadius: 6,
                    background: '#FBF7F0',
                    border: `2.5px solid ${C.inkSoft}`,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                    textAlign: 'center',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 28,
                    lineHeight: 1,
                    color: C.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Rp5.000.000
                </div>
              </div>
            </Boil>
          </SlideIn>

          {/* Twine around jar neck */}
          <div
            style={{
              position: 'absolute',
              left: 404,
              top: COUNTER_Y - 230,
              width: 126,
              height: 6,
              borderRadius: 3,
              background: C.woodLo,
              boxShadow: '0 2px 3px rgba(0,0,0,0.25)',
            }}
          />

          {/* Spotlight circle on the new jar neck tag in Beat 4 */}
          <SpotlightRing cx={626} cy={COUNTER_Y - 224} r={116} opacity={tagSpotOp} scale={0.94 + 0.06 * tagSpotOp} />

          {/* Old blank paper tag hanging on jar neck (detaches smoothly in scene 046: rel 333-362) */}
          {oldTagOp > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 530,
                top: COUNTER_Y - 256 + oldTagDrop * 78,
                opacity: oldTagOp,
                transformOrigin: '0px 30px',
                transform: `rotate(${-3 + oldTagDrop * 18}deg)`,
              }}
            >
              {/* Short connecting string */}
              <div style={{position: 'absolute', left: -4, top: 28, width: 16, height: 3, background: C.woodLo}} />
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 0,
                  width: 168,
                  height: 60,
                  borderRadius: '12px 8px 8px 12px',
                  background: '#F3EAD8',
                  border: '2px solid #B7A484',
                  boxShadow: '0 5px 12px rgba(0,0,0,0.24)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 23,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: C.creamHi,
                    border: `2px solid ${C.woodLo}`,
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* New terracotta tag attached on jar neck (scene 046-047) with stamped "LABELNYA" */}
          {newTagIn > 0.01 ? (
            <Boil seed="new-tag-d04" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 530,
                  top: COUNTER_Y - 258,
                  opacity: newTagIn,
                  transformOrigin: '0px 32px',
                  transform: `translateY(${(1 - newTagIn) * -28}px) rotate(${newTagSwing}deg)`,
                }}
              >
                {/* Connecting string */}
                <div style={{position: 'absolute', left: -4, top: 30, width: 16, height: 3.5, background: C.woodLo}} />
                {/* Contrasting terracotta tag body */}
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 0,
                    width: 214,
                    height: 66,
                    borderRadius: '14px 8px 8px 14px',
                    background: '#C9573C',
                    border: '2.5px solid #8E3622',
                    boxShadow: '0 7px 16px rgba(0,0,0,0.30)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 22,
                  }}
                >
                  {/* String hole eyelet */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: 26,
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: '#F7F1E6',
                      border: '2px solid #8E3622',
                    }}
                  />
                  {/* Stamped text "LABELNYA" (scene 047: rel 384-403) */}
                  <span
                    style={{
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 30,
                      letterSpacing: '0.03em',
                      color: '#F7F1E6',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      opacity: stampOp,
                      transform: `scale(${stampScale})`,
                      textShadow: '0 2px 0 rgba(95, 32, 18, 0.5)',
                    }}
                  >
                    LABELNYA
                  </span>
                </div>
              </div>
            </Boil>
          ) : null}
        </DepthLayer>

        {/* Layer 3: Gentle paper dust motes */}
        <DepthLayer z={0.65} panX={panX} panY={panY} yaw={yaw} zoom={zoom}>
          {dustSpecs.map((d, idx) => {
            const dy = Math.sin(f * 0.035 + d.phase) * 7;
            const dx = Math.cos(f * 0.025 + d.phase) * 5;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: d.x + dx,
                  top: d.y + dy,
                  width: d.r * 2,
                  height: d.r * 2,
                  borderRadius: '50%',
                  background: 'rgba(255, 244, 204, 0.65)',
                }}
              />
            );
          })}
        </DepthLayer>

        {/* Layer 4: Foreground warung paper coffee cup with gentle steam + terracotta theater curtains */}
        <DepthLayer z={0.85} panX={panX} panY={panY} yaw={yaw} zoom={zoom}>
          {/* Warung anchor 3: Paper coffee cup with rising steam on front-right counter edge */}
          <PopIn at={0}>
            <div style={{position: 'absolute', left: 1054, top: COUNTER_Y - 76, width: 74, height: 84}}>
              {/* Gentle rising paper steam wisps */}
              {[0, 1, 2].map((sIdx) => {
                const cycle = (steamOffset + sIdx * 14) % 44;
                const sOp = interpolate(cycle, [0, 10, 34, 44], [0, 0.58, 0.45, 0], CLAMP);
                const sway = Math.sin((f + sIdx * 18) * 0.08) * 4;
                return (
                  <div
                    key={sIdx}
                    style={{
                      position: 'absolute',
                      left: 20 + sIdx * 14 + sway,
                      top: -12 - cycle,
                      width: 6,
                      height: 18,
                      borderRadius: 6,
                      background: 'rgba(255, 252, 245, 0.72)',
                      opacity: sOp,
                    }}
                  />
                );
              })}
              {/* Cup lid */}
              <div
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 0,
                  width: 62,
                  height: 11,
                  borderRadius: '4px 4px 2px 2px',
                  background: C.inkSoft,
                }}
              />
              {/* Tapered paper cup body */}
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                  width: 54,
                  height: 72,
                  background: '#F2EADF',
                  clipPath: 'polygon(0% 0%, 100% 0%, 86% 100%, 14% 100%)',
                  filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.26))',
                }}
              />
              {/* Kraft sleeve (plain, no text) */}
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 28,
                  width: 50,
                  height: 28,
                  background: '#C8A579',
                  clipPath: 'polygon(2% 0%, 98% 0%, 93% 100%, 7% 100%)',
                }}
              />
            </div>
          </PopIn>

          {/* Left terracotta theater curtain */}
          <Paper lift={8}>
            <Slab x={-48} y={-30} w={118} h={780} color="#9A5A42" shade="#7B432F" shadeH={0.12} r={0} />
            <Slab x={34} y={-30} w={52} h={780} color="#B0684D" shade="#8A4D37" shadeH={0.1} r="0 28px 28px 0" />
          </Paper>

          {/* Right terracotta theater curtain */}
          <Paper lift={8}>
            <Slab x={1210} y={-30} w={118} h={780} color="#9A5A42" shade="#7B432F" shadeH={0.12} r={0} />
            <Slab x={1194} y={-30} w={52} h={780} color="#B0684D" shade="#8A4D37" shadeH={0.1} r="28px 0 0 28px" />
          </Paper>

          {/* Upper theater curtain pelmet */}
          <Paper lift={8}>
            <Slab x={-40} y={-24} w={1360} h={46} color="#8B4E38" shade="#6E3B29" shadeH={0.35} r={0} />
          </Paper>
        </DepthLayer>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};