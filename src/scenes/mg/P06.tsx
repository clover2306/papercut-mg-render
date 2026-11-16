// Adegan P06 ("DUA RUANG MAKAN", scene 32-35): buku pop-up terbuka membandingkan ruang makan sederhana yang bermartabat dan meja makan kelas menengah.
// Timbangan dari P05 muncul di lipatan tengah buku dan condong tegas ke sisi kiri sebagai pengakuan bahwa yang miskin paling menderita.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Plant, Shelf} from '../../lib/paper/sets';

export const P06_DUR = 457;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EASE_IO = Easing.inOut(Easing.cubic);
const EASE_OUT = Easing.out(Easing.cubic);

const DustMotes: React.FC<{frame: number}> = ({frame}) => {
  const specks = [
    {x: 240, y: 190, r: 3, dx: 14, dy: -10, p: 0.2},
    {x: 470, y: 260, r: 2.5, dx: -12, dy: -14, p: 1.4},
    {x: 640, y: 170, r: 3, dx: 10, dy: -8, p: 2.3},
    {x: 820, y: 230, r: 2.5, dx: -15, dy: -11, p: 3.1},
    {x: 1030, y: 200, r: 3, dx: 12, dy: -13, p: 4.0},
    {x: 350, y: 340, r: 2, dx: 9, dy: -9, p: 5.2},
    {x: 910, y: 310, r: 2, dx: -10, dy: -8, p: 0.9},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {specks.map((s, i) => {
        const t = frame / P06_DUR;
        const ox = Math.sin(t * Math.PI * 2 + s.p) * s.dx;
        const oy = t * s.dy * 2.2 + Math.cos(t * Math.PI * 2 + s.p) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x + ox,
              top: s.y + oy,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: '50%',
              background: '#FFF4DC',
              opacity: 0.32,
            }}
          />
        );
      })}
    </div>
  );
};

const EmptyBowl: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 52 * scale, height: 26 * scale, translate: '-50% -100%'}}>
    <div
      style={{
        position: 'absolute',
        left: 2 * scale,
        top: 0,
        width: 48 * scale,
        height: 11 * scale,
        borderRadius: '50%',
        background: '#7B6F60',
        border: `${2 * scale}px solid ${C.inkSoft}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 5 * scale,
        width: 52 * scale,
        height: 20 * scale,
        borderRadius: `4px 4px ${24 * scale}px ${24 * scale}px`,
        background: '#CFC2B0',
        borderBottom: `${3 * scale}px solid #A89A87`,
        boxShadow: '0 3px 5px rgba(0,0,0,0.22)',
      }}
    />
  </div>
);

const ThoughtEmptyPlate: React.FC<{x: number; y: number; opacity: number}> = ({x, y, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 118,
        height: 82,
        translate: '-50% -50%',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Boil seed="thought-empty" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'relative',
            width: 118,
            height: 74,
            borderRadius: '50%',
            background: 'rgba(243, 236, 224, 0.94)',
            border: `2.5px dashed ${C.inkSoft}`,
            boxShadow: '2px 5px 10px rgba(0,0,0,0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 26,
              width: 58,
              height: 10,
              translate: '-50% 0',
              borderRadius: '50%',
              border: `2px dashed ${C.inkSoft}`,
              background: 'rgba(180, 168, 152, 0.25)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 31,
              width: 62,
              height: 16,
              translate: '-50% 0',
              borderRadius: '4px 4px 26px 26px',
              border: `2px dashed ${C.inkSoft}`,
              borderTop: 'none',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 72,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'rgba(243, 236, 224, 0.92)',
            border: `2px dashed ${C.inkSoft}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 88,
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'rgba(243, 236, 224, 0.9)',
            border: `2px dashed ${C.inkSoft}`,
          }}
        />
      </Boil>
    </div>
  );
};

const SeatedDignifiedFigure: React.FC<{
  x: number;
  y: number;
  facing: 1 | -1;
  shirt: string;
  sarong: string;
  scale?: number;
  headTilt?: number;
}> = ({x, y, facing, shirt, sarong, scale = 1, headTilt = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 104 * scale,
      height: 146 * scale,
      translate: '-50% -100%',
      transform: `scaleX(${facing})`,
    }}
  >
    {/* Folded seated legs on mat */}
    <div
      style={{
        position: 'absolute',
        left: 24 * scale,
        bottom: 0,
        width: 68 * scale,
        height: 24 * scale,
        borderRadius: `${10 * scale}px ${14 * scale}px ${8 * scale}px ${8 * scale}px`,
        background: sarong,
        boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
      }}
    />
    {/* Upright dignified torso */}
    <div
      style={{
        position: 'absolute',
        left: 24 * scale,
        bottom: 20 * scale,
        width: 48 * scale,
        height: 68 * scale,
        borderRadius: `${12 * scale}px ${12 * scale}px ${6 * scale}px ${6 * scale}px`,
        background: shirt,
        boxShadow: '2px 4px 7px rgba(0,0,0,0.22)',
      }}
    />
    {/* Calm arm resting on knee */}
    <div
      style={{
        position: 'absolute',
        left: 42 * scale,
        bottom: 24 * scale,
        width: 34 * scale,
        height: 15 * scale,
        borderRadius: 8 * scale,
        background: shirt,
        filter: 'brightness(0.92)',
        transform: 'rotate(14deg)',
      }}
    />
    {/* Faceless paper head */}
    <div
      style={{
        position: 'absolute',
        left: 26 * scale,
        bottom: 94 * scale,
        width: 44 * scale,
        height: 44 * scale,
        borderRadius: '50%',
        background: C.creamLo,
        border: `${2.5 * scale}px solid ${C.inkSoft}`,
        transformOrigin: '50% 85%',
        transform: `rotate(${headTilt}deg)`,
        boxShadow: '1px 3px 6px rgba(0,0,0,0.2)',
      }}
    />
  </div>
);

const StandingKamuFigure: React.FC<{
  x: number;
  y: number;
  pointProgress: number;
  breathe: number;
}> = ({x, y, pointProgress, breathe}) => {
  const armAngle = interpolate(pointProgress, [0, 1], [12, 68], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 110,
        height: 196,
        translate: '-50% -100%',
      }}
    >
      {/* Trousers / legs */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          bottom: 0,
          width: 19,
          height: 54,
          borderRadius: 6,
          background: C.inkSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 57,
          bottom: 0,
          width: 19,
          height: 54,
          borderRadius: 6,
          background: C.inkSoft,
        }}
      />

      {/* Office bag slung at hip (consistent P01-P04) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 48,
          width: 28,
          height: 34,
          borderRadius: 5,
          background: C.wood,
          borderBottom: `4px solid ${C.woodLo}`,
          boxShadow: '2px 4px 6px rgba(0,0,0,0.28)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 28,
            height: 13,
            borderRadius: '5px 5px 3px 3px',
            background: C.woodHi,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 10,
            width: 6,
            height: 6,
            borderRadius: 1,
            background: C.brass,
          }}
        />
      </div>

      {/* Torso: slate-blue shirt (kemeja biru sabak) */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          bottom: 50,
          width: 54,
          height: 82,
          borderRadius: '12px 12px 6px 6px',
          background: ROOM.slate,
          transform: `translateY(${breathe}px)`,
          boxShadow: '2px 4px 8px rgba(0,0,0,0.24)',
        }}
      >
        {/* Bag strap across chest */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 2,
            width: 7,
            height: 78,
            background: C.woodLo,
            transform: 'rotate(-28deg)',
            transformOrigin: 'top left',
            opacity: 0.85,
          }}
        />
        {/* Warm terracotta paper scarf (syal kertas hangat terakota) */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: -3,
            width: 46,
            height: 15,
            borderRadius: 7,
            background: C.tag,
            boxShadow: '0 2px 4px rgba(0,0,0,0.22)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 9,
            width: 13,
            height: 36,
            borderRadius: '3px 3px 6px 6px',
            background: C.hero,
            transform: 'rotate(6deg)',
            boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 9,
            width: 12,
            height: 28,
            borderRadius: '3px 3px 6px 6px',
            background: C.tag,
            transform: 'rotate(-7deg)',
          }}
        />
      </div>

      {/* Pointing arm toward dining table on the left */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          bottom: 112 - breathe,
          width: 14,
          height: 52,
          borderRadius: 7,
          background: ROOM.slate,
          filter: 'brightness(1.06)',
          transformOrigin: '50% 8px',
          transform: `rotate(${armAngle}deg)`,
          boxShadow: '-1px 3px 5px rgba(0,0,0,0.2)',
        }}
      >
        {/* Hand */}
        <div
          style={{
            position: 'absolute',
            left: 1,
            bottom: -7,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: C.creamLo,
            border: `2px solid ${C.inkSoft}`,
          }}
        />
      </div>

      {/* Faceless round paper head */}
      <div
        style={{
          position: 'absolute',
          left: 31,
          bottom: 138 - breathe,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: C.creamLo,
          border: `2.5px solid ${C.inkSoft}`,
          boxShadow: '1px 3px 6px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

const ThreeLunchDishes: React.FC<{x: number; y: number; highlightIdx: number}> = ({x, y, highlightIdx}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    {/* Dish 1: Nasi (steamed rice dome in bowl) */}
    <div style={{position: 'absolute', left: 0, top: 0, translate: '-50% -100%'}}>
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: -14,
          width: 44,
          height: 24,
          borderRadius: '50% 50% 10% 10%',
          background: '#F6F1E7',
          border: `1.5px solid ${C.creamLo}`,
        }}
      />
      <div
        style={{
          width: 56,
          height: 22,
          borderRadius: '4px 4px 24px 24px',
          background: C.sageLo,
          borderBottom: `3px solid ${C.inkSoft}`,
          boxShadow: '0 3px 5px rgba(0,0,0,0.22)',
        }}
      />
    </div>

    {/* Dish 2: Lauk (golden-brown protein on warm plate, highlighted when pointed at) */}
    <div style={{position: 'absolute', left: 74, top: 0, translate: '-50% -100%'}}>
      {highlightIdx > 0.4 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -12,
            width: 72,
            height: 44,
            translate: '-50% -25%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,197,66,0.38) 0%, rgba(245,197,66,0) 72%)',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: -11,
          width: 42,
          height: 16,
          borderRadius: '45% 55% 40% 40%',
          background: '#B9682C',
          borderTop: '3px solid #D88744',
          transform: 'rotate(-6deg)',
        }}
      />
      <div
        style={{
          width: 58,
          height: 16,
          borderRadius: '4px 4px 20px 20px',
          background: C.creamHi,
          borderBottom: `3px solid ${C.creamLo}`,
          boxShadow: '0 3px 5px rgba(0,0,0,0.22)',
        }}
      />
    </div>

    {/* Dish 3: Sayur (leafy green vegetables in bowl) */}
    <div style={{position: 'absolute', left: 148, top: 0, translate: '-50% -100%'}}>
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: -12,
          width: 24,
          height: 16,
          borderRadius: '50%',
          background: '#4E7A4A',
          transform: 'rotate(-16deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: -14,
          width: 26,
          height: 18,
          borderRadius: '50%',
          background: '#6A9461',
          transform: 'rotate(14deg)',
        }}
      />
      <div
        style={{
          width: 56,
          height: 22,
          borderRadius: '4px 4px 24px 24px',
          background: C.hero,
          borderBottom: `3px solid ${C.heroLo}`,
          boxShadow: '0 3px 5px rgba(0,0,0,0.22)',
        }}
      />
    </div>
  </div>
);

const CreaseBalanceScale: React.FC<{
  x: number;
  y: number;
  emerge: number;
  tiltDeg: number;
}> = ({x, y, emerge, tiltDeg}) => {
  if (emerge <= 0.01) return null;
  const scaleY = interpolate(emerge, [0, 1], [0.15, 1], CLAMP);
  const opacity = interpolate(emerge, [0, 0.25], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 260,
        height: 230,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scaleY(${scaleY})`,
        opacity,
      }}
    >
      {/* Pop-up paper hinge tab anchored in the book fold */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: 84,
          height: 20,
          translate: '-50% 0',
          background: C.cream,
          borderTop: `2px solid ${C.creamLo}`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
        }}
      />
      {/* Wooden base */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 12,
          width: 108,
          height: 18,
          translate: '-50% 0',
          borderRadius: 6,
          background: C.woodLo,
          borderTop: `3px solid ${C.woodHi}`,
          boxShadow: '0 5px 12px rgba(0,0,0,0.35)',
        }}
      />
      {/* Central brass/wood pillar (no scale markings, no numbers) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 28,
          width: 14,
          height: 148,
          translate: '-50% 0',
          borderRadius: 4,
          background: C.brass,
          borderRight: `3px solid ${C.brassLo}`,
          boxShadow: '2px 4px 8px rgba(0,0,0,0.28)',
        }}
      />
      {/* Top finial */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 172,
          width: 24,
          height: 24,
          translate: '-50% 0',
          borderRadius: '50%',
          background: C.brass,
          border: `2px solid ${C.brassLo}`,
        }}
      />

      {/* Tilting balance beam */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 162,
          width: 210,
          height: 10,
          translate: '-50% 50%',
          borderRadius: 5,
          background: C.wood,
          borderTop: `2px solid ${C.woodHi}`,
          transform: `rotate(${tiltDeg}deg)`,
          boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
        }}
      >
        {/* Center pivot pin */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 14,
            height: 14,
            translate: '-50% -50%',
            borderRadius: '50%',
            background: C.inkSoft,
          }}
        />

        {/* Left Pan (Poor figurine — heavier absolute suffering, tilts firmly down) */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 5,
            transformOrigin: '0 0',
            transform: `rotate(${-tiltDeg}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: -1, top: 0, width: 2, height: 52, background: C.inkSoft}} />
          <div
            style={{
              position: 'absolute',
              left: -26,
              top: 50,
              width: 52,
              height: 10,
              borderRadius: '2px 2px 14px 14px',
              background: C.brass,
              borderBottom: `2px solid ${C.brassLo}`,
              boxShadow: '0 3px 6px rgba(0,0,0,0.28)',
            }}
          />
          {/* Tiny dignified figurine (poor, same size) */}
          <div style={{position: 'absolute', left: 0, top: 50, translate: '-50% -100%'}}>
            <div
              style={{
                width: 20,
                height: 26,
                borderRadius: '5px 5px 2px 2px',
                background: C.sageLo,
                margin: '0 auto',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -17,
                width: 15,
                height: 15,
                translate: '-50% 0',
                borderRadius: '50%',
                background: C.creamLo,
                border: `1.5px solid ${C.inkSoft}`,
              }}
            />
          </div>
        </div>

        {/* Right Pan (Middle-class figurine — same size, rises as left tilts down) */}
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 5,
            transformOrigin: '0 0',
            transform: `rotate(${-tiltDeg}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: -1, top: 0, width: 2, height: 52, background: C.inkSoft}} />
          <div
            style={{
              position: 'absolute',
              left: -26,
              top: 50,
              width: 52,
              height: 10,
              borderRadius: '2px 2px 14px 14px',
              background: C.brass,
              borderBottom: `2px solid ${C.brassLo}`,
              boxShadow: '0 3px 6px rgba(0,0,0,0.28)',
            }}
          />
          {/* Tiny middle-class figurine (slate shirt + terracotta scarf, same size) */}
          <div style={{position: 'absolute', left: 0, top: 50, translate: '-50% -100%'}}>
            <div
              style={{
                width: 20,
                height: 26,
                borderRadius: '5px 5px 2px 2px',
                background: ROOM.slate,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 2,
                  top: 0,
                  width: 16,
                  height: 5,
                  borderRadius: 2,
                  background: C.tag,
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -17,
                width: 15,
                height: 15,
                translate: '-50% 0',
                borderRadius: '50%',
                background: C.creamLo,
                border: `1.5px solid ${C.inkSoft}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const P06: React.FC = () => {
  const f = useCurrentFrame();

  // Gentle breathing & hanging bulb sway (calm, unhurried papercut motion)
  const breathe = Math.sin((f / 45) * Math.PI * 2) * 1.4;
  const bulbSway = Math.sin((f / 68) * Math.PI * 2) * 0.9;

  // Pop-up book initial fold-out (frames 0..18)
  const popOpen = interpolate(f, [0, 18], [0.42, 1], {...CLAMP, easing: EASE_OUT});

  // Camera choreography across the 4 beats:
  // Beat 1 (0..66): dolly-in firmly yet calmly to left page
  // Beat 2 (83..143): hold on elevated left page
  // Beat 3a (181..252): left page empty bowl + uncertain dawn + thought bubble
  // Beat 3b (252..328): pan across the central crease to right page
  // Beat 3c (328..379): pull back to full two-page spread
  // Beat 4 (406..457): small dolly-in on the scale in the crease, held at end
  const camX =
    f < 75
      ? interpolate(f, [0, 64], [605, 412], {...CLAMP, easing: EASE_IO})
      : f < 248
      ? interpolate(f, [75, 110], [412, 405], {...CLAMP, easing: EASE_IO})
      : f < 324
      ? interpolate(f, [248, 286], [405, 875], {...CLAMP, easing: EASE_IO})
      : f < 398
      ? interpolate(f, [324, 364], [875, 640], {...CLAMP, easing: EASE_IO})
      : interpolate(f, [398, 438], [640, 620], {...CLAMP, easing: EASE_IO});

  const camY =
    f < 75
      ? interpolate(f, [0, 64], [368, 384], {...CLAMP, easing: EASE_IO})
      : f < 324
      ? 384
      : f < 398
      ? interpolate(f, [324, 364], [384, 368], {...CLAMP, easing: EASE_IO})
      : interpolate(f, [398, 438], [368, 374], {...CLAMP, easing: EASE_IO});

  const camZoom =
    f < 75
      ? interpolate(f, [0, 64], [0.97, 1.48], {...CLAMP, easing: EASE_IO})
      : f < 248
      ? interpolate(f, [83, 110], [1.48, 1.52], {...CLAMP, easing: EASE_IO})
      : f < 324
      ? interpolate(f, [248, 286], [1.52, 1.48], {...CLAMP, easing: EASE_IO})
      : f < 398
      ? interpolate(f, [324, 364], [1.48, 1.02], {...CLAMP, easing: EASE_IO})
      : interpolate(f, [398, 438], [1.02, 1.22], {...CLAMP, easing: EASE_IO});

  // Beat 2 (83..143): Left page pops forward one step like a raised pop-up panel; right page recedes & dims
  const leftStepUp = interpolate(f, [83, 105], [0, 1], {...CLAMP, easing: EASE_IO});
  const leftStepDown = interpolate(f, [156, 176], [0, 1], {...CLAMP, easing: EASE_IO});
  const leftStep = Math.max(0, leftStepUp - leftStepDown);

  // Beat 3a (181..252): Parent looks down at empty bowl, uncertain half-sun rises in window, dashed thought bubble
  const headTilt =
    f < 252
      ? interpolate(f, [184, 206], [0, 9], {...CLAMP, easing: EASE_IO})
      : interpolate(f, [252, 274], [9, 0], {...CLAMP, easing: EASE_IO});

  const dawnSunLift = interpolate(f, [184, 232], [0, 1], {...CLAMP, easing: EASE_OUT});
  const cloudDrift = interpolate(f, [181, 260], [0, 14], CLAMP);

  const bubbleIn = interpolate(f, [190, 204], [0, 1], {...CLAMP, easing: EASE_OUT});
  const bubbleOut = interpolate(f, [246, 260], [0, 1], {...CLAMP, easing: EASE_IO});
  const bubbleOpacity = Math.max(0, bubbleIn - bubbleOut);

  // Beat 3b (252..328): Kamu points at one of the three lunch dishes on the right page
  const pointIn = interpolate(f, [278, 302], [0, 1], {...CLAMP, easing: EASE_OUT});
  const pointOut = interpolate(f, [342, 366], [0, 1], {...CLAMP, easing: EASE_IO});
  const pointProgress = Math.max(0, pointIn - pointOut);

  // Beat 4 (406..457): Scale emerges at central fold and tilts decisively to the LEFT (no vibration, settles at 432)
  const scaleEmerge = interpolate(f, [390, 408], [0, 1], {...CLAMP, easing: EASE_OUT});
  const scaleTilt = interpolate(f, [406, 432], [0, -16], {...CLAMP, easing: EASE_OUT});
  const beat4LeftGlow = interpolate(f, [406, 432], [0, 1], {...CLAMP, easing: EASE_IO});

  // Parallax shifts driven by camera pan
  const panOffset = camX - 640;
  const bgParallaxX = -panOffset * -0.14;
  const popBackParallaxX = -panOffset * 0.03;
  const popMidParallaxX = -panOffset * 0.07;

  const worldTx = 640 - camX * camZoom;
  const worldTy = 360 - camY * camZoom;

  const leftPageScale = 1 + 0.055 * leftStep;
  const leftPageX = -10 * leftStep;
  const leftPageY = -14 * leftStep;

  const rightPageScale = 1 - 0.035 * leftStep;
  const rightPageX = 8 * leftStep;
  const rightPageY = 8 * leftStep;
  const rightDimOpacity = 0.34 * leftStep + 0.16 * beat4LeftGlow;
  const leftBulbGlow = 0.22 + 0.14 * leftStep + 0.12 * beat4LeftGlow;

  return (
    <AbsoluteFill style={{backgroundColor: '#2B231D', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
            transformOrigin: '0 0',
            transform: `translate(${worldTx}px, ${worldTy}px) scale(${camZoom})`,
          }}
        >
          {/* DEPTH LAYER 0: Quiet paper theater stage backdrop */}
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${bgParallaxX}px)`}}>
            <Slab x={-360} y={-220} w={2000} h={1160} color="#CBBBA6" r={0} grain={0.55} />
            {/* Warm theater wall paneling */}
            <Slab x={-360} y={-220} w={2000} h={735} color="#D5C6B2" shade="#B9A790" shadeH={0.22} r={0} grain={0.5} />
            {/* Theater side wings */}
            <Slab x={-320} y={-220} w={340} h={960} color={C.woodLo} shade={C.floorLo} shadeH={0.2} r={0} />
            <Slab x={1260} y={-220} w={340} h={960} color={C.woodLo} shade={C.floorLo} shadeH={0.2} r={0} />
            {/* Wooden stage tabletop supporting the giant pop-up book */}
            <Slab x={-360} y={505} w={2000} h={440} color={C.floor} shade={C.floorLo} shadeH={0.35} r={0} grain={0.6} />
            <Slab x={-360} y={495} w={2000} h={16} color={C.woodLo} r={0} />
            <div
              style={{
                position: 'absolute',
                left: -360,
                top: -220,
                width: 2000,
                height: 1160,
                background: 'radial-gradient(ellipse at 50% 45%, rgba(255,246,230,0.16) 0%, rgba(0,0,0,0) 52%, rgba(24,18,14,0.42) 100%)',
              }}
            />
          </div>

          {/* DEPTH LAYER 1: Giant Open Pop-Up Book Base & Stacked Paper Pages */}
          <Paper lift={8}>
            {/* Hardcover boards */}
            <Slab x={116} y={142} w={524} h={492} color={C.floor} shade={C.floorLo} shadeH={0.12} r="10px 4px 4px 10px" />
            <Slab x={640} y={142} w={524} h={492} color={C.floor} shade={C.floorLo} shadeH={0.12} r="4px 10px 10px 4px" />
            {/* Stacked lower paper page edges */}
            <Slab x={126} y={148} w={514} h={478} color={C.creamLo} r="6px 2px 2px 6px" grain={0.45} />
            <Slab x={640} y={148} w={514} h={478} color={C.creamLo} r="2px 6px 6px 2px" grain={0.45} />
            <Slab x={131} y={150} w={509} h={470} color={C.cream} r="5px 2px 2px 5px" grain={0.45} />
            <Slab x={640} y={150} w={509} h={470} color={C.cream} r="2px 5px 5px 2px" grain={0.45} />
            {/* Top open cream pages */}
            <Slab x={136} y={152} w={500} h={460} color={C.creamHi} shade="#D7CBB9" shadeH={0.08} r="4px 0 0 4px" grain={0.5} />
            <Slab x={644} y={152} w={500} h={460} color={C.creamHi} shade="#D7CBB9" shadeH={0.08} r="0 4px 4px 0" grain={0.5} />
          </Paper>

          {/* DEPTH LAYER 2 & 3: RIGHT PAGE POP-UP (Middle-Class Dining Room with Lunch Choices) */}
          <div
            style={{
              position: 'absolute',
              left: 644,
              top: 152,
              width: 500,
              height: 460,
              transformOrigin: '0% 75%',
              transform: `translate(${rightPageX}px, ${rightPageY}px) scale(${rightPageScale})`,
            }}
          >
            {/* Right page floor plane (warm parquet & woven area rug) */}
            <Slab x={0} y={340} w={500} h={120} color={C.wood} shade={C.woodLo} shadeH={0.22} r="0 0 4px 0" grain={0.55} />
            {[80, 165, 250, 335, 420].map((px, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: px,
                  top: 340,
                  width: 2,
                  height: 120,
                  background: C.woodLo,
                  opacity: 0.55,
                }}
              />
            ))}
            {/* Neat area rug under dining table */}
            <Slab x={75} y={365} w={355} h={68} color="#C7B293" shade="#AE9878" shadeH={0.18} r={6} grain={0.65} />

            {/* Upright Pop-Up Back Wall & Right Wing (unfolds upward at frame 0..18) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 500,
                height: 342,
                transformOrigin: '50% 100%',
                transform: `translateX(${popBackParallaxX}px) scaleY(${popOpen})`,
              }}
            >
              {/* Back wall */}
              <Slab x={0} y={0} w={462} h={342} color="#E6DDD0" shade="#D3C7B6" shadeH={0.14} r={0} grain={0.45} />
              {/* Wainscoting trim */}
              <Slab x={0} y={248} w={462} h={94} color="#D8CBB8" r={0} />
              <Slab x={0} y={244} w={462} h={8} color={C.woodHi} r={0} />
              {/* Angled right pop-up side wall */}
              <div
                style={{
                  position: 'absolute',
                  left: 462,
                  top: 0,
                  width: 38,
                  height: 342,
                  background: '#CFC2B0',
                  borderLeft: `2px solid ${C.creamLo}`,
                }}
              />
              {/* Wall shelf with blank book spines (zero text/numbers) */}
              <Shelf x={46} y={136} w={175} books={3} />
              {/* Potted paper plant in corner */}
              <Plant x={352} y={218} s={0.42} />

              {/* Warm pendant lamp over dining table */}
              <div
                style={{
                  position: 'absolute',
                  left: 235,
                  top: 0,
                  transformOrigin: '50% 0%',
                  transform: `rotate(${-bulbSway * 0.7}deg)`,
                }}
              >
                <div style={{position: 'absolute', left: -1.5, top: 0, width: 3, height: 64, background: C.inkSoft}} />
                <div
                  style={{
                    position: 'absolute',
                    left: -130,
                    top: 95,
                    width: 260,
                    height: 220,
                    background: 'rgba(255, 224, 145, 0.16)',
                    clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                  }}
                />
                <Slab x={-36} y={62} w={72} h={36} color={C.amber} shade={C.amberDim} shadeH={0.22} r="36px 36px 4px 4px" />
              </div>
            </div>

            {/* Foreground Pop-Up Layer: Middle-class dining table, 3 food dishes, and "kamu" */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: '50% 80%',
                transform: `translateX(${popMidParallaxX}px) scaleY(${popOpen})`,
              }}
            >
              {/* Left dining chair */}
              <Slab x={92} y={272} w={12} h={112} color={C.woodLo} r={3} />
              <Slab x={92} y={326} w={48} h={10} color={C.wood} r={3} />
              <Slab x={130} y={326} w={10} h={58} color={C.woodLo} r={3} />

              {/* Right dining chair */}
              <Slab x={388} y={272} w={12} h={112} color={C.woodLo} r={3} />
              <Slab x={352} y={326} w={48} h={10} color={C.wood} r={3} />
              <Slab x={352} y={326} w={10} h={58} color={C.woodLo} r={3} />

              {/* Middle-class dining table */}
              <Paper lift={5}>
                <Slab x={136} y={292} w={14} h={96} color={C.woodLo} r={3} />
                <Slab x={332} y={292} w={14} h={96} color={C.woodLo} r={3} />
                <Slab x={116} y={280} w={250} h={16} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
              </Paper>

              {/* Three distinct lunch dishes (nasi, lauk, sayur — no labels) */}
              <ThreeLunchDishes x={166} y={280} highlightIdx={pointProgress} />

              {/* Main character "kamu" choosing lunch */}
              <StandingKamuFigure x={378} y={392} pointProgress={pointProgress} breathe={breathe} />
            </div>

            {/* Dimming veil when Beat 2 elevates the left page or Beat 4 weights the left */}
            {rightDimOpacity > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `rgba(38, 30, 24, ${rightDimOpacity})`,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
          </div>

          {/* DEPTH LAYER 2 & 3: LEFT PAGE POP-UP (Dignified Modest Dining Room with Empty Bowls) */}
          <div
            style={{
              position: 'absolute',
              left: 136,
              top: 152,
              width: 500,
              height: 460,
              transformOrigin: '100% 75%',
              transform: `translate(${leftPageX}px, ${leftPageY}px) scale(${leftPageScale})`,
              boxShadow: leftStep > 0.02 ? `${12 * leftStep}px ${14 * leftStep}px ${26 * leftStep}px rgba(0,0,0,0.34)` : undefined,
            }}
          >
            {/* Left page floor plane (neat wooden planks & woven pandan mat / tikar) */}
            <Slab x={0} y={340} w={500} h={120} color="#845838" shade={C.woodLo} shadeH={0.26} r="0 0 0 4px" grain={0.6} />
            {[95, 195, 295, 395].map((px, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: px,
                  top: 340,
                  width: 2,
                  height: 120,
                  background: C.woodLo,
                  opacity: 0.65,
                }}
              />
            ))}
            {/* Neatly woven mat (tikar) */}
            <Slab x={68} y={356} w={374} h={76} color="#C7A46B" shade="#AE8B52" shadeH={0.2} r={5} grain={0.7} />
            <div
              style={{
                position: 'absolute',
                left: 76,
                top: 363,
                width: 358,
                height: 62,
                border: '2px solid #9B7944',
                borderRadius: 3,
                opacity: 0.65,
              }}
            />

            {/* Upright Pop-Up Back Wall & Left Wing (unfolds upward at frame 0..18) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 500,
                height: 342,
                transformOrigin: '50% 100%',
                transform: `translateX(${popBackParallaxX}px) scaleY(${popOpen})`,
              }}
            >
              {/* Left side pop-up wing flap */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 38,
                  height: 342,
                  background: '#C4B6A2',
                  borderRight: `2px solid ${C.creamLo}`,
                }}
              />
              {/* Clean modest plaster/board back wall */}
              <Slab x={38} y={0} w={462} h={342} color="#D8CEBF" shade="#C3B6A3" shadeH={0.16} r={0} grain={0.5} />
              {/* Simple wooden framing beams */}
              <Slab x={38} y={0} w={462} h={12} color={C.woodLo} r={0} />
              <Slab x={38} y={332} w={462} h={10} color={C.woodLo} r={0} />
              <Slab x={242} y={12} w={10} h={320} color={C.wood} r={0} />

              {/* Window showing senja -> uncertain half-risen dawn sun in Beat 3a */}
              <div
                style={{
                  position: 'absolute',
                  left: 84,
                  top: 66,
                  width: 128,
                  height: 112,
                  background: C.woodLo,
                  padding: 8,
                  borderRadius: 4,
                  boxShadow: '2px 4px 8px rgba(0,0,0,0.22)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    background: dawnSunLift > 0.01 ? '#7B8CA3' : '#5E6D87',
                  }}
                >
                  {/* Warm horizon band */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 44,
                      background: '#CFA063',
                      opacity: 0.75,
                    }}
                  />
                  {/* Uncertain tomorrow: half-risen paper sun behind clouds */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 56,
                      top: interpolate(dawnSunLift, [0, 1], [86, 48], CLAMP),
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: C.amber,
                      boxShadow: '0 0 16px rgba(243, 165, 59, 0.55)',
                    }}
                  />
                  {/* Drifting paper clouds veiling the half-risen sun */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 16 + cloudDrift,
                      top: 64,
                      width: 72,
                      height: 22,
                      borderRadius: 12,
                      background: '#DDD4C7',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 48 - cloudDrift * 0.7,
                      top: 72,
                      width: 68,
                      height: 24,
                      borderRadius: 12,
                      background: '#CFC4B4',
                    }}
                  />
                  {/* Window mullions */}
                  <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 6, translate: '-50% 0', background: C.woodLo}} />
                  <div style={{position: 'absolute', top: '52%', left: 0, right: 0, height: 6, translate: '0 -50%', background: C.woodLo}} />
                </div>
              </div>

              {/* Single hanging bulb illuminating the modest dining room */}
              <div
                style={{
                  position: 'absolute',
                  left: 344,
                  top: 0,
                  transformOrigin: '50% 0%',
                  transform: `rotate(${bulbSway}deg)`,
                }}
              >
                <div style={{position: 'absolute', left: -1.5, top: 0, width: 3, height: 74, background: C.inkSoft}} />
                {/* Warm cone of light */}
                <div
                  style={{
                    position: 'absolute',
                    left: -175,
                    top: 90,
                    width: 350,
                    height: 270,
                    background: `rgba(255, 226, 148, ${leftBulbGlow})`,
                    clipPath: 'polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)',
                  }}
                />
                {/* Socket & glowing paper bulb */}
                <Slab x={-7} y={72} w={14} h={12} color={C.brassLo} r={2} />
                <div
                  style={{
                    position: 'absolute',
                    left: -12,
                    top: 82,
                    width: 24,
                    height: 28,
                    borderRadius: '45% 45% 50% 50%',
                    background: '#FFF2C6',
                    boxShadow: '0 0 22px rgba(255, 224, 130, 0.85)',
                  }}
                />
              </div>
            </div>

            {/* Foreground Pop-Up Layer: Low table (meja pendek), empty bowls, and dignified parent + child */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: '50% 80%',
                transform: `translateX(${popMidParallaxX}px) scaleY(${popOpen})`,
              }}
            >
              {/* Parent / elder seated neatly on the mat */}
              <SeatedDignifiedFigure
                x={146}
                y={398}
                facing={1}
                shirt={C.sageLo}
                sarong={C.inkSoft}
                scale={1}
                headTilt={headTilt}
              />

              {/* Child seated neatly on the mat */}
              <SeatedDignifiedFigure
                x={386}
                y={398}
                facing={-1}
                shirt={ROOM.khaki}
                sarong={C.inkSoft}
                scale={0.82}
                headTilt={headTilt * 0.6}
              />

              {/* Low wooden dining table (meja pendek) */}
              <Paper lift={5}>
                <Slab x={198} y={358} w={12} h={40} color={C.woodLo} r={2} />
                <Slab x={324} y={358} w={12} h={40} color={C.woodLo} r={2} />
                <Slab x={182} y={346} w={170} h={14} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
              </Paper>

              {/* Empty bowls (mangkuk kosong) */}
              <EmptyBowl x={226} y={346} scale={0.95} />
              <EmptyBowl x={306} y={346} scale={0.88} />

              {/* Beat 3a dashed thought bubble with empty plate */}
              <ThoughtEmptyPlate x={140} y={136} opacity={bubbleOpacity} />
            </div>
          </div>

          {/* CENTRAL BOOK CREASE / SPINE (Lipatan Tebal) */}
          <div style={{position: 'absolute', left: 626, top: 148, width: 28, height: 472, pointerEvents: 'none'}}>
            {/* Left fold shadow gradient */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 4,
                width: 14,
                height: 460,
                background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(28,22,18,0.34) 100%)',
              }}
            />
            {/* Right fold shadow gradient */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 4,
                width: 14,
                height: 460,
                background: 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(28,22,18,0.34) 100%)',
              }}
            />
            {/* Spine center crease line */}
            <div
              style={{
                position: 'absolute',
                left: 13,
                top: 0,
                width: 2,
                height: 472,
                background: C.inkSoft,
                opacity: 0.7,
              }}
            />
            {/* Stitched paper binding tabs */}
            {[205, 365, 525].map((sy, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: 6,
                  top: sy - 148,
                  width: 16,
                  height: 7,
                  borderRadius: 2,
                  background: C.tape,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>

          {/* DEPTH LAYER 4: Beat 4 Balance Scale from P05 emerging in the crease and tilting decisively LEFT */}
          <CreaseBalanceScale x={640} y={532} emerge={scaleEmerge} tiltDeg={scaleTilt} />

          {/* Subtle floating paper dust in theater lighting */}
          <DustMotes frame={f} />
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default P06;