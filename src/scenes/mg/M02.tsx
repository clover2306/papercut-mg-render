// M02 (Scene 011-012, 35,56-51,21 dtk, 469 frame): skala nasional keracunan MBG di peta lipat Indonesia.
// Titik Cangkringan menyebar ke 460 kejadian dan lebih dari 50 ribu korban, lalu kamera mundur memperlihatkan barisan kotak makan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, SlideIn} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerCircle, MarkerUnderline} from '../../lib/paper/proof';

export const M02_DUR = 469;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type IslandPoly = {
  id: string;
  points: string;
  color: string;
  shade: string;
};

const ARCHIPELAGO: IslandPoly[] = [
  {
    id: 'sumatra',
    points: '348,242 374,238 418,296 456,356 446,382 422,374 378,314 344,264',
    color: '#7E8C78',
    shade: '#5F6D5A',
  },
  {
    id: 'jawa',
    points: '466,422 534,428 602,436 600,454 536,452 464,442',
    color: '#8A9A86',
    shade: '#667563',
  },
  {
    id: 'kalimantan',
    points: '532,272 588,256 634,278 638,334 598,364 544,358 524,316',
    color: '#7E8C78',
    shade: '#5F6D5A',
  },
  {
    id: 'sulawesi',
    points: '668,284 718,278 724,296 694,308 716,334 704,368 682,366 680,334 662,348 656,312',
    color: '#8A9A86',
    shade: '#667563',
  },
  {
    id: 'nusa-tenggara',
    points: '614,446 654,448 696,452 738,448 736,462 692,466 648,462 612,458',
    color: '#7E8C78',
    shade: '#5F6D5A',
  },
  {
    id: 'maluku',
    points: '766,308 786,304 792,332 772,338',
    color: '#8A9A86',
    shade: '#667563',
  },
  {
    id: 'maluku-selatan',
    points: '768,366 802,362 806,380 770,382',
    color: '#7E8C78',
    shade: '#5F6D5A',
  },
  {
    id: 'papua',
    points: '818,324 856,318 874,338 934,344 938,414 892,412 862,382 828,362',
    color: '#8A9A86',
    shade: '#667563',
  },
];

// Titik asal Cangkringan, Sleman di DIY
const CANGKRINGAN = {x: 528, y: 444};

// Sebaran titik kejadian keracunan di puluhan provinsi (x, y, warna aksen)
const PROVINCE_DOTS: Array<[number, number, string]> = [
  [514, 441, '#D63A2B'],
  [544, 443, '#C9573C'],
  [496, 436, '#D63A2B'],
  [564, 444, '#F3A53B'],
  [478, 431, '#C9573C'],
  [586, 445, '#D63A2B'],
  [444, 368, '#D63A2B'],
  [432, 350, '#F3A53B'],
  [418, 330, '#C9573C'],
  [402, 308, '#D63A2B'],
  [386, 286, '#F3A53B'],
  [368, 264, '#C9573C'],
  [356, 248, '#D63A2B'],
  [424, 362, '#F3A53B'],
  [396, 322, '#D63A2B'],
  [622, 452, '#C9573C'],
  [646, 454, '#D63A2B'],
  [674, 456, '#F3A53B'],
  [706, 455, '#D63A2B'],
  [728, 453, '#C9573C'],
  [554, 344, '#D63A2B'],
  [578, 348, '#F3A53B'],
  [604, 342, '#C9573C'],
  [544, 314, '#F3A53B'],
  [572, 306, '#D63A2B'],
  [616, 316, '#D63A2B'],
  [560, 280, '#C9573C'],
  [596, 274, '#F3A53B'],
  [622, 286, '#D63A2B'],
  [668, 336, '#D63A2B'],
  [694, 354, '#C9573C'],
  [688, 324, '#F3A53B'],
  [674, 294, '#D63A2B'],
  [706, 286, '#C9573C'],
  [778, 320, '#F3A53B'],
  [786, 372, '#D63A2B'],
  [836, 344, '#C9573C'],
  [862, 358, '#D63A2B'],
  [894, 366, '#F3A53B'],
  [920, 374, '#D63A2B'],
  [908, 398, '#C9573C'],
  [926, 396, '#F3A53B'],
  [486, 438, '#F3A53B'],
  [552, 437, '#D63A2B'],
];

type MoundPerson = {
  dx: number;
  dy: number;
  s: number;
  shirt: string;
  order: number;
};

// Gundukan figur kecil tanpa wajah di sisi kanan peta (5 tingkat bertumpuk)
const VICTIM_MOUND: MoundPerson[] = [
  // Tingkat 1 (bawah, 8 figur)
  {dx: -68, dy: 0, s: 0.34, shirt: '#5D7896', order: 0},
  {dx: -48, dy: 2, s: 0.35, shirt: '#7E8C78', order: 1},
  {dx: -28, dy: 0, s: 0.34, shirt: '#8A7A60', order: 2},
  {dx: -9, dy: 2, s: 0.36, shirt: '#4E6378', order: 3},
  {dx: 10, dy: 0, s: 0.34, shirt: '#9A5A42', order: 4},
  {dx: 29, dy: 2, s: 0.35, shirt: '#5D7896', order: 5},
  {dx: 48, dy: 0, s: 0.34, shirt: '#6E6A64', order: 6},
  {dx: 68, dy: 2, s: 0.35, shirt: '#7E8C78', order: 7},
  // Tingkat 2 (7 figur)
  {dx: -56, dy: -34, s: 0.34, shirt: '#9A5A42', order: 8},
  {dx: -37, dy: -32, s: 0.35, shirt: '#5D7896', order: 9},
  {dx: -18, dy: -35, s: 0.34, shirt: '#6E6A64', order: 10},
  {dx: 1, dy: -33, s: 0.36, shirt: '#7E8C78', order: 11},
  {dx: 20, dy: -35, s: 0.34, shirt: '#4E6378', order: 12},
  {dx: 39, dy: -32, s: 0.35, shirt: '#8A7A60', order: 13},
  {dx: 57, dy: -34, s: 0.34, shirt: '#5B4A6E', order: 14},
  // Tingkat 3 (5 figur)
  {dx: -40, dy: -68, s: 0.34, shirt: '#4E6378', order: 15},
  {dx: -20, dy: -66, s: 0.35, shirt: '#8A7A60', order: 16},
  {dx: 0, dy: -69, s: 0.36, shirt: '#C9573C', order: 17},
  {dx: 20, dy: -66, s: 0.35, shirt: '#5D7896', order: 18},
  {dx: 40, dy: -68, s: 0.34, shirt: '#7E8C78', order: 19},
  // Tingkat 4 (4 figur)
  {dx: -28, dy: -101, s: 0.34, shirt: '#7E8C78', order: 20},
  {dx: -9, dy: -103, s: 0.35, shirt: '#5D7896', order: 21},
  {dx: 10, dy: -101, s: 0.35, shirt: '#9A5A42', order: 22},
  {dx: 28, dy: -103, s: 0.34, shirt: '#6E6A64', order: 23},
  // Tingkat 5 (puncak, 3 figur)
  {dx: -16, dy: -134, s: 0.34, shirt: '#5B4A6E', order: 24},
  {dx: 2, dy: -137, s: 0.36, shirt: '#C9573C', order: 25},
  {dx: 18, dy: -134, s: 0.34, shirt: '#4E6378', order: 26},
];

const CanteenRoomBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-90} w={1520} h={900} color="#C7D0CD" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.26) 100%)',
      }}
    />
    <Slab x={-120} y={290} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={306} w={1520} h={240} color="#B2BEBA" r={0} grain={0.55} />
    <Window x={36} y={44} w={196} h={230} night={false} />
    <Corkboard x={1004} y={54} w={224} h={144} />
    <Sticky x={1030} y={82} s={34} color="#E6D7A8" rot={-3} />
    <Sticky x={1082} y={88} s={32} color="#D8DFD5" rot={2} />
    <Sticky x={1134} y={80} s={34} color="#E6D7A8" rot={-1} />
    <Shelf x={1002} y={276} w={228} books={3} />
    <Plant x={1156} y={258} s={0.5} />
  </AbsoluteFill>
);

const MiniFacelessPerson: React.FC<{
  x: number;
  y: number;
  s: number;
  shirt: string;
  at: number;
}> = ({x, y, s, shirt, at}) => {
  const w = Math.round(70 * s);
  const h = Math.round(146 * s);
  const head = Math.round(44 * s);
  const torsoW = Math.round(52 * s);
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
          filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.28))',
        }}
      >
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
            top: Math.round(48 * s),
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

const FoldedArchipelagoMap: React.FC = () => {
  const f = useCurrentFrame();
  const unfoldU = interpolate(f, [6, 28], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const mapScaleX = interpolate(unfoldU, [0, 1], [0.22, 1], CLAMP);
  const mapOpacity = interpolate(f, [4, 14], [0, 1], CLAMP);

  // Titik awal Cangkringan menyala lebih dulu
  const cangScale = interpolate(f, [20, 30], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.8)),
  });
  const pulse = 1 + Math.sin(Math.max(0, f - 30) * 0.16) * 0.12;

  return (
    <div
      style={{
        position: 'absolute',
        left: 320,
        top: 170,
        width: 640,
        height: 390,
        transformOrigin: '50% 50%',
        transform: `scaleX(${mapScaleX})`,
        opacity: mapOpacity,
      }}
    >
      {/* Lembar peta lipat 4 panel */}
      <Paper lift={10}>
        <Slab
          x={0}
          y={0}
          w={640}
          h={390}
          color="#EAE3D5"
          shade="#D6CCB9"
          shadeH={0.08}
          hi="#F5F0E6"
          hiH={0.05}
          r={10}
          grain={0.45}
        />
        {/* 4 panel lipatan kertas */}
        {[0, 1, 2, 3].map((panelIdx) => (
          <div
            key={panelIdx}
            style={{
              position: 'absolute',
              left: panelIdx * 160,
              top: 0,
              width: 160,
              height: 390,
              background:
                panelIdx % 2 === 0
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.16), rgba(0,0,0,0.03))'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.05), rgba(255,255,255,0.12))',
              borderRight: panelIdx < 3 ? '2px dashed rgba(58,56,50,0.22)' : 'none',
            }}
          />
        ))}
        {/* Garis lipatan horizontal tengah */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 195,
            height: 2,
            background: 'rgba(58,56,50,0.16)',
          }}
        />
        {/* Bingkai tepi peta */}
        <div
          style={{
            position: 'absolute',
            inset: 14,
            border: '2px solid rgba(58,56,50,0.24)',
            borderRadius: 6,
          }}
        />
      </Paper>

      {/* Gugus pulau papercut Indonesia */}
      <svg
        width={640}
        height={390}
        viewBox="320 170 640 390"
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        {ARCHIPELAGO.map((island) => (
          <g key={island.id}>
            <polygon
              points={island.points}
              fill={island.shade}
              transform="translate(3 5)"
              opacity={0.75}
            />
            <polygon
              points={island.points}
              fill={island.color}
              stroke="#F3EEE6"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* Titik-titik provinsi menyebar dari Cangkringan seperti biji pecah */}
        {PROVINCE_DOTS.map(([dx, dy, col], idx) => {
          const dist = Math.hypot(dx - CANGKRINGAN.x, dy - CANGKRINGAN.y);
          const popAt = 152 + Math.min(72, dist * 0.17) + (idx % 4) * 1.8;
          const u = interpolate(f, [popAt, popAt + 8], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.back(1.9)),
          });
          if (u <= 0.01) return null;
          return (
            <g
              key={idx}
              transform={`translate(${dx} ${dy}) scale(${u})`}
            >
              <circle cx={1} cy={2} r={5.4} fill="rgba(28,27,23,0.28)" />
              <circle cx={0} cy={0} r={5.2} fill={col} stroke="#F5F0E6" strokeWidth={1.4} />
            </g>
          );
        })}

        {/* Titik tunggal Cangkringan, Sleman */}
        {cangScale > 0.01 ? (
          <g transform={`translate(${CANGKRINGAN.x} ${CANGKRINGAN.y})`}>
            <circle
              cx={0}
              cy={0}
              r={13 * cangScale * pulse}
              fill="none"
              stroke={C.tag}
              strokeWidth={2.2}
              opacity={0.55}
            />
            <circle cx={1} cy={2} r={7.2 * cangScale} fill="rgba(28,27,23,0.34)" />
            <circle
              cx={0}
              cy={0}
              r={7 * cangScale}
              fill={C.nogo}
              stroke="#F5F0E6"
              strokeWidth={2}
            />
          </g>
        ) : null}
      </svg>

      {/* Lingkaran spidol menandai titik awal Cangkringan */}
      <MarkerCircle
        x={CANGKRINGAN.x - 320 - 18}
        y={CANGKRINGAN.y - 170 - 16}
        w={36}
        h={32}
        at={24}
        dur={12}
        color={C.tag}
        width={4}
        seed="m02-cangkringan-ring"
      />
    </div>
  );
};

const EventCounter460: React.FC = () => {
  const f = useCurrentFrame();
  const steppedFrame = Math.floor(f / 2) * 2;
  const u = interpolate(steppedFrame, [152, 236], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const count = f >= 236 ? 460 : Math.round(460 * u);
  const locked = f >= 236;

  return (
    <SlideIn at={146} dx={-50} dy={0} dur={12}>
      <Boil seed="m02-counter-460" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 142,
            top: 214,
            width: 184,
            rotate: '-1.5deg',
          }}
        >
          <div
            style={{
              backgroundColor: C.creamHi,
              borderTop: `5px solid ${locked ? C.nogo : C.inkSoft}`,
              padding: '16px 16px 18px',
              textAlign: 'center',
              filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.34))',
            }}
          >
            <div
              style={{
                fontFamily: FONT.banner,
                fontSize: 58,
                lineHeight: 1,
                color: locked ? C.nogo : C.ink,
                letterSpacing: '-0.02em',
              }}
            >
              {count}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 20,
                lineHeight: 1.15,
                color: C.inkSoft,
              }}
            >
              kejadian keracunan
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -10,
              translate: '-50% 0',
              width: 68,
              height: 18,
              background: C.tape,
              opacity: 0.85,
              filter: 'url(#torn)',
            }}
          />
        </div>
      </Boil>
      <MarkerUnderline
        x={156}
        y={368}
        w={156}
        at={236}
        dur={12}
        color={C.nogo}
        width={5}
        seed="m02-460-line"
      />
    </SlideIn>
  );
};

const VictimCounterAndMound: React.FC = () => {
  const f = useCurrentFrame();
  const steppedFrame = Math.floor(f / 2) * 2;
  const u = interpolate(steppedFrame, [94, 166], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const countRibu = f >= 166 ? 50 : Math.round(50 * u);
  const locked = f >= 166;
  const readout = locked ? 'lebih dari 50 ribu' : `${countRibu} ribu`;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Penghitung kedua di sisi kanan peta */}
      <SlideIn at={88} dx={50} dy={0} dur={12}>
        <Boil seed="m02-counter-50k" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 946,
              top: 184,
              width: 202,
              rotate: '1.5deg',
            }}
          >
            <div
              style={{
                backgroundColor: C.creamHi,
                borderTop: `5px solid ${locked ? C.tag : C.inkSoft}`,
                padding: '15px 14px 16px',
                textAlign: 'center',
                filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.34))',
              }}
            >
              <div
                style={{
                  fontFamily: FONT.banner,
                  fontSize: locked ? 31 : 40,
                  lineHeight: 1.08,
                  color: locked ? C.tag : C.ink,
                  letterSpacing: '-0.01em',
                }}
              >
                {readout}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 22,
                  lineHeight: 1.1,
                  color: C.inkSoft,
                }}
              >
                korban
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -10,
                translate: '-50% 0',
                width: 68,
                height: 18,
                background: C.tape,
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
          </div>
        </Boil>
        <MarkerUnderline
          x={964}
          y={322}
          w={166}
          at={166}
          dur={12}
          color={C.tag}
          width={5}
          seed="m02-50k-line"
        />
      </SlideIn>

      {/* Gundukan figur kecil tanpa wajah menumpuk di bawah penghitung kedua */}
      <PopIn at={92} origin="50% 100%">
        <Paper lift={5}>
          <Slab
            x={960}
            y={534}
            w={174}
            h={24}
            color={C.creamLo}
            shade="#A39584"
            shadeH={0.45}
            r="50%"
          />
        </Paper>
      </PopIn>

      {VICTIM_MOUND.map((person) => {
        const popAt = 95 + person.order * 2.4;
        return (
          <MiniFacelessPerson
            key={person.order}
            x={1047 + person.dx}
            y={544 + person.dy}
            s={person.s}
            shirt={person.shirt}
            at={popAt}
          />
        );
      })}
    </div>
  );
};

const LunchboxItem: React.FC<{x: number; y: number; rot: number; tone: number}> = ({
  x,
  y,
  rot,
  tone,
}) => {
  const bodyColor = tone % 3 === 0 ? C.creamHi : tone % 3 === 1 ? C.cream : '#E2D6C3';
  const bandColor = tone % 2 === 0 ? C.woodHi : C.sage;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 82,
        height: 46,
        rotate: `${rot}deg`,
        filter: 'drop-shadow(1px 4px 5px rgba(0,0,0,0.28))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: bodyColor,
          borderRadius: 7,
          borderBottom: `6px solid ${C.creamLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 6,
          right: 6,
          top: 14,
          height: 3,
          backgroundColor: C.inkSoft,
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 0,
          width: 18,
          height: 46,
          backgroundColor: bandColor,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

const EndlessLunchboxPerimeter: React.FC = () => {
  const f = useCurrentFrame();
  const revealU = interpolate(f, [328, 355], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  if (revealU <= 0.001) return null;

  const topCols = Array.from({length: 15}, (_, i) => -28 + i * 92);
  const bottomCols = Array.from({length: 15}, (_, i) => -28 + i * 92);
  const sideRows = Array.from({length: 11}, (_, i) => 42 + i * 58);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: revealU}}>
      {/* Barisan kotak makan di tepi atas dan melampaui bingkai */}
      {topCols.map((bx, i) => (
        <LunchboxItem
          key={`top-${i}`}
          x={bx}
          y={-18 + (i % 2) * 5}
          rot={(i % 3) - 1}
          tone={i}
        />
      ))}
      {/* Barisan kotak makan di tepi bawah */}
      {bottomCols.map((bx, i) => (
        <LunchboxItem
          key={`bot-${i}`}
          x={bx}
          y={672 + (i % 2) * 5}
          rot={1 - (i % 3)}
          tone={i + 1}
        />
      ))}
      {/* Barisan kotak makan berlapis di sisi kiri */}
      {sideRows.map((by, i) => (
        <React.Fragment key={`left-${i}`}>
          <LunchboxItem x={-46 + (i % 2) * 6} y={by} rot={-2 + (i % 3)} tone={i} />
          <LunchboxItem x={36 + (i % 2) * 5} y={by + 12} rot={1 - (i % 2) * 2} tone={i + 2} />
        </React.Fragment>
      ))}
      {/* Barisan kotak makan berlapis di sisi kanan */}
      {sideRows.map((by, i) => (
        <React.Fragment key={`right-${i}`}>
          <LunchboxItem x={1164 + (i % 2) * 5} y={by + 10} rot={-1 + (i % 3)} tone={i + 1} />
          <LunchboxItem x={1244 + (i % 2) * 6} y={by} rot={2 - (i % 3)} tone={i + 3} />
        </React.Fragment>
      ))}
    </div>
  );
};

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M02_DUR - 10, M02_DUR], [0, 1], {
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

export const M02: React.FC = () => {
  const f = useCurrentFrame();

  // Kamera mulai rapat ke peta dan penghitung, lalu menarik mundur saat "makanan gratis untuk jutaan anak"
  const pullBackScale = interpolate(f, [330, 412], [1.18, 0.88], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pullBackY = interpolate(f, [330, 412], [-8, 12], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Pergeseran nada tipis dari hangat ke sedikit lebih dingin di ujung kalimat masalah
  const coolToneOpacity = interpolate(f, [405, 455], [0, 0.14], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: '#C7D0CD'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25} seed="m02-weave">
        <OrbitCamera
          dur={M02_DUR}
          yaw={14}
          drift={[24, -6]}
          push={1.06}
          focus={0.5}
          depth={760}
          origin={[640, 380]}
        >
          <Depth z={0} cover>
            <CanteenRoomBackdrop />
          </Depth>

          <Depth z={0.5}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: '640px 365px',
                transform: `translateY(${pullBackY}px) scale(${pullBackScale})`,
              }}
            >
              {/* Permukaan meja kantin luas tempat peta dibentangkan */}
              <Slab x={-260} y={80} w={1800} h={760} color="#E6DFD3" r={0} grain={0.5} />
              <Slab
                x={-260}
                y={72}
                w={1800}
                h={16}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.4}
                r={0}
              />

              {/* Barisan kotak makan berulang tanpa ujung di sekeliling tepi peta */}
              <EndlessLunchboxPerimeter />

              {/* Peta kepulauan lipat + titik Cangkringan + sebaran titik provinsi */}
              <FoldedArchipelagoMap />

              {/* Stiker sumber data di sudut kiri atas peta */}
              <PopIn at={38}>
                <Boil seed="m02-dpr-sticker" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 422,
                      top: 150,
                      translate: '-50% 0',
                      rotate: '-2.5deg',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: C.creamHi,
                        borderLeft: `6px solid ${C.cap}`,
                        padding: '10px 18px 11px',
                        fontFamily: FONT.label,
                        fontWeight: 800,
                        fontSize: 20,
                        lineHeight: 1.1,
                        color: C.ink,
                        whiteSpace: 'nowrap',
                        filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
                      }}
                    >
                      Data DPR, September 2026
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: -8,
                        translate: '-50% 0',
                        width: 58,
                        height: 15,
                        background: C.tape,
                        opacity: 0.85,
                        filter: 'url(#torn)',
                      }}
                    />
                  </div>
                </Boil>
              </PopIn>

              {/* Penghitung 1: 460 kejadian keracunan */}
              <EventCounter460 />

              {/* Penghitung 2: lebih dari 50 ribu korban + gundukan figur tanpa wajah */}
              <VictimCounterAndMound />

              {/* Tag "puluhan provinsi" setelah titik menyebar di peta */}
              <PopIn at={238}>
                <Boil seed="m02-provinsi-tag" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 640,
                      top: 496,
                      translate: '-50% 0',
                      rotate: '-1.2deg',
                      backgroundColor: C.ink,
                      color: '#F3EEE6',
                      padding: '10px 22px 12px',
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 26,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.36))',
                    }}
                  >
                    puluhan provinsi
                  </div>
                </Boil>
              </PopIn>

              {/* Tag "jutaan anak" saat kamera menarik mundur ke barisan kotak makan */}
              <PopIn at={348}>
                <Boil seed="m02-jutaan-tag" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 640,
                      top: 66,
                      translate: '-50% 0',
                      rotate: '1.2deg',
                      backgroundColor: C.tag,
                      color: C.tagText,
                      padding: '13px 28px 15px',
                      fontFamily: FONT.banner,
                      fontSize: 34,
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.38))',
                    }}
                  >
                    jutaan anak
                  </div>
                </Boil>
              </PopIn>
            </div>
          </Depth>

          <Depth z={0.95}>
            <div style={{filter: 'blur(3px)'}}>
              <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
              <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            </div>
          </Depth>
        </OrbitCamera>
      </FilmWeave>

      {coolToneOpacity > 0.001 ? (
        <AbsoluteFill
          style={{
            backgroundColor: '#27324A',
            opacity: coolToneOpacity,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <PaperFoldEdge />
      <GrainOverlay />
    </AbsoluteFill>
  );
};