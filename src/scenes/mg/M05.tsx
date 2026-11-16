// M05 (Scene 036-040, 128,22-144,70 dtk, 494 frame): diagram siklus harga sebagai umpan balik yang terputus saat harga nol.
// Label harga dibalik menjadi umpan balik dengan lingkaran panah pembeli, lalu padam dan putus menjadi satu panah searah saat 0.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {GrainOverlay, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerUnderline} from '../../lib/paper/proof';

export const M05_DUR = 494;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type CycleStep = {
  id: string;
  label: string;
  startAngle: number;
  sweepAngle: number;
  popAt: number;
  breakAt: number;
  labelX: number;
  labelY: number;
  dropX: number;
  dropRot: number;
  color: string;
};

const CYCLE_STEPS: CycleStep[] = [
  {
    id: 'membayar',
    label: 'membayar',
    startAngle: -132,
    sweepAngle: 68,
    popAt: 206,
    breakAt: 416,
    labelX: 438,
    labelY: 222,
    dropX: -28,
    dropRot: -24,
    color: '#2DA34D',
  },
  {
    id: 'protes',
    label: 'protes',
    startAngle: -42,
    sweepAngle: 68,
    popAt: 250,
    breakAt: 423,
    labelX: 604,
    labelY: 366,
    dropX: 34,
    dropRot: 28,
    color: '#C9573C',
  },
  {
    id: 'pindah',
    label: 'pindah',
    startAngle: 48,
    sweepAngle: 68,
    popAt: 292,
    breakAt: 430,
    labelX: 438,
    labelY: 504,
    dropX: 18,
    dropRot: -19,
    color: '#3968AD',
  },
  {
    id: 'memilih',
    label: 'memilih dengan dompet',
    startAngle: 138,
    sweepAngle: 68,
    popAt: 334,
    breakAt: 437,
    labelX: 254,
    labelY: 366,
    dropX: -36,
    dropRot: 22,
    color: '#C89B4A',
  },
];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeCurvedArrow = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const headSpan = 13;
  const shaftEnd = a1 - headSpan;
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, shaftEnd);
  const tip = polar(cx, cy, r, a1);
  const wingOuter = polar(cx, cy, r + 15, shaftEnd - 2);
  const wingInner = polar(cx, cy, r - 15, shaftEnd - 2);

  const shaft = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  const head = `${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${wingOuter.x.toFixed(1)},${wingOuter.y.toFixed(1)} ${wingInner.x.toFixed(1)},${wingInner.y.toFixed(1)}`;
  return {shaft, head};
};

const CanteenBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-80} w={1520} h={880} color="#DDD6CA" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 34% 34%, rgba(255,244,214,0.34) 0%, rgba(255,255,255,0) 56%, rgba(0,0,0,0.24) 100%)',
      }}
    />
    <Slab x={-120} y={316} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={332} w={1520} h={240} color="#C9C2B6" r={0} grain={0.55} />
    <Window x={38} y={50} w={194} h={236} night={false} />
    <Corkboard x={988} y={58} w={224} h={144} />
    <Sticky x={1014} y={86} s={34} color="#E6D7A8" rot={-3} />
    <Sticky x={1066} y={92} s={32} color="#D8DFD5" rot={2} />
    <Sticky x={1118} y={84} s={34} color="#E6D7A8" rot={-1} />
    <Shelf x={986} y={282} w={228} books={3} />
    <Plant x={1142} y={266} s={0.52} />
  </AbsoluteFill>
);

const HangingPriceTag: React.FC = () => {
  const f = useCurrentFrame();

  // Ayunan halus tali gantungan kertas, mereda saat lampu padam
  const quietFactor = interpolate(f, [412, 434], [1, 0.12], CLAMP);
  const swing = Math.sin(f * 0.08) * 1.8 * quietFactor;

  // Pembalikan pertama: sisi depan label harga -> sisi belakang "umpan balik" (f=126..152)
  const flipToFeedback = interpolate(f, [126, 152], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Pembalikan kedua: saat "ketika harganya nol" (f=412..430), label harga berubah menjadi 0
  const flipToZero = interpolate(f, [412, 430], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const activeFlip = flipToZero > 0.01 ? flipToZero : flipToFeedback;
  const scaleX = Math.max(0.06, Math.abs(Math.cos(activeFlip * Math.PI)));
  const phase: 'front' | 'feedback' | 'zero' =
    flipToZero >= 0.5 ? 'zero' : flipToFeedback >= 0.5 ? 'feedback' : 'front';

  return (
    <PopIn at={6} origin="50% 0%">
      <div
        style={{
          position: 'absolute',
          left: 242,
          top: 32,
          width: 248,
          height: 184,
          translate: '-50% 0',
          transformOrigin: '50% 0%',
          transform: `rotate(${swing}deg)`,
        }}
      >
        {/* Tali kertas gantungan */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 4,
            height: 44,
            translate: '-50% 0',
            backgroundColor: C.inkSoft,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 36,
            width: 14,
            height: 14,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `2px solid ${C.inkSoft}`,
          }}
        />

        {/* Badan kartu label harga yang berputar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 46,
            width: 248,
            height: 122,
            transformOrigin: '50% 50%',
            transform: `scaleX(${scaleX})`,
          }}
        >
          {phase === 'front' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: C.creamHi,
                borderTop: `6px solid ${C.brass}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.34))',
              }}
            >
              {/* Lubang tali label harga */}
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#DDD6CA',
                  border: `2px solid ${C.inkSoft}`,
                }}
              />
              {/* Motif garis label harga tanpa angka */}
              <div style={{width: 138, height: 8, borderRadius: 4, backgroundColor: C.inkSoft, opacity: 0.72}} />
              <div style={{width: 96, height: 6, borderRadius: 3, backgroundColor: C.brassLo, opacity: 0.65}} />
            </div>
          ) : null}

          {phase === 'feedback' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#F4EFE4',
                borderTop: `6px solid ${C.go}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                fontFamily: FONT.banner,
                fontSize: 32,
                lineHeight: 1.05,
                color: C.ink,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.36))',
              }}
            >
              umpan balik
            </div>
          ) : null}

          {phase === 'zero' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#D6D0C5',
                borderTop: `6px solid ${C.inkSoft}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.banner,
                fontSize: 78,
                lineHeight: 1,
                color: C.inkSoft,
                filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
              }}
            >
              0
            </div>
          ) : null}
        </div>

        {/* Garis spidol di bawah "umpan balik" sebelum berubah menjadi 0 */}
        {flipToZero < 0.2 ? (
          <MarkerUnderline
            x={30}
            y={152}
            w={188}
            at={154}
            dur={12}
            color={C.go}
            width={5}
            seed="m05-feedback-line"
          />
        ) : null}
      </div>
    </PopIn>
  );
};

const BuyerWithWallet: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak hidup saat lingkaran umpan balik aktif, lalu berhenti senyap saat harganya nol
  const activeU = interpolate(f, [206, 224, 410, 424], [0, 1, 1, 0], CLAMP);
  const steppedF = Math.floor(f / 3) * 3;
  const bobY = Math.sin(steppedF * 0.22) * 3.5 * activeU;

  // Dompet menjadi pipih pada "ketika harganya nol" (f=412..428)
  const flatU = interpolate(f, [412, 428], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const walletH = interpolate(flatU, [0, 1], [34, 9], CLAMP);
  const walletW = interpolate(flatU, [0, 1], [44, 52], CLAMP);
  const walletTop = interpolate(flatU, [0, 1], [68, 84], CLAMP);

  return (
    <PopIn at={10} origin="50% 100%">
      <div
        style={{
          position: 'absolute',
          left: 438,
          top: 446 + bobY,
          width: 104,
          height: 176,
          translate: '-50% -100%',
          filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.3))',
        }}
      >
        {/* Kepala kertas polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 48,
            height: 48,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `3px solid ${C.inkSoft}`,
          }}
        />
        {/* Badan figur pembeli */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 54,
            width: 58,
            height: 78,
            translate: '-50% 0',
            backgroundColor: C.cap,
            borderRadius: '12px 12px 5px 5px',
          }}
        />
        {/* Kaki */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 132,
            width: 20,
            height: 44,
            backgroundColor: C.inkSoft,
            borderRadius: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 132,
            width: 20,
            height: 44,
            backgroundColor: C.inkSoft,
            borderRadius: 5,
          }}
        />
        {/* Lengan memegang dompet */}
        <div
          style={{
            position: 'absolute',
            left: 62,
            top: 72 + flatU * 8,
            width: 34,
            height: 14,
            backgroundColor: C.capLo,
            borderRadius: 7,
            rotate: `${-10 + flatU * 14}deg`,
          }}
        />
        {/* Dompet kertas yang awalnya tebal lalu menjadi pipih saat harga 0 */}
        <div
          style={{
            position: 'absolute',
            left: 82,
            top: walletTop,
            width: walletW,
            height: walletH,
            backgroundColor: flatU > 0.5 ? '#8C847A' : C.wood,
            border: `2px solid ${C.ink}`,
            borderRadius: 5,
            boxShadow: '1px 3px 5px rgba(0,0,0,0.3)',
          }}
        >
          {/* Lembar uang kertas menyembul saat dompet berisi, hilang saat pipih */}
          {flatU < 0.65 ? (
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: -6 * (1 - flatU),
                width: 30,
                height: 8 * (1 - flatU),
                backgroundColor: '#7EA878',
                borderRadius: '3px 3px 0 0',
              }}
            />
          ) : null}
          {/* Pengait kuningan dompet */}
          <div
            style={{
              position: 'absolute',
              right: -2,
              top: '50%',
              width: 12,
              height: Math.max(4, walletH * 0.36),
              translate: '0 -50%',
              backgroundColor: flatU > 0.5 ? C.metalLo : C.brass,
              borderRadius: '4px 0 0 4px',
            }}
          />
        </div>
      </div>
    </PopIn>
  );
};

const FeedbackCycleRing: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 438;
  const cy = 366;
  const radius = 138;

  // Lingkaran panah berputar rapi dan hidup saat semua panah terbentuk, lalu berhenti mendadak di f=412
  const spinFrame = Math.min(f, 412);
  const spinStart = 220;
  const ringRot =
    spinFrame > spinStart
      ? interpolate(spinFrame, [spinStart, 412], [0, 88], {
          ...CLAMP,
          easing: Easing.inOut(Easing.sin),
        })
      : 0;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Lingkaran dasar garis putus-putus halus di belakang panah */}
      {f >= 204 && f < 442 ? (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cy,
            width: radius * 2,
            height: radius * 2,
            translate: '-50% -50%',
            borderRadius: '50%',
            border: '2px dashed rgba(58,56,50,0.22)',
            opacity: interpolate(f, [204, 218, 428, 442], [0, 1, 1, 0], CLAMP),
          }}
        />
      ) : null}

      {/* 4 segmen panah kertas yang berputar */}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          width: 0,
          height: 0,
          transform: `rotate(${ringRot}deg)`,
        }}
      >
        <svg
          width={420}
          height={420}
          viewBox={`${cx - 210} ${cy - 210} 420 420`}
          style={{position: 'absolute', left: -210, top: -210, overflow: 'visible'}}
        >
          {CYCLE_STEPS.map((step) => {
            const popU = interpolate(f, [step.popAt, step.popAt + 12], [0, 1], {
              ...CLAMP,
              easing: Easing.out(Easing.back(1.5)),
            });
            const breakU = interpolate(f, [step.breakAt, step.breakAt + 18], [0, 1], {
              ...CLAMP,
              easing: Easing.in(Easing.cubic),
            });

            if (popU <= 0.01 || breakU >= 0.99) return null;

            const arc = describeCurvedArrow(
              cx,
              cy,
              radius,
              step.startAngle,
              step.startAngle + step.sweepAngle * popU,
            );
            const fallY = breakU * 118;
            const fallX = breakU * step.dropX;
            const fallRot = breakU * step.dropRot;
            const opacity = 1 - breakU;

            return (
              <g
                key={step.id}
                transform={`translate(${fallX} ${fallY}) rotate(${fallRot} ${cx} ${cy})`}
                opacity={opacity}
              >
                {/* Bayangan lapisan kertas */}
                <path
                  d={arc.shaft}
                  fill="none"
                  stroke="rgba(28,27,23,0.24)"
                  strokeWidth={14}
                  strokeLinecap="round"
                  transform="translate(2 4)"
                />
                <polygon
                  points={arc.head}
                  fill="rgba(28,27,23,0.24)"
                  transform="translate(2 4)"
                />
                {/* Badan panah kertas */}
                <path
                  d={arc.shaft}
                  fill="none"
                  stroke={step.color}
                  strokeWidth={13}
                  strokeLinecap="round"
                />
                <polygon points={arc.head} fill={step.color} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Label potongan kertas untuk tiap langkah siklus: membayar, protes, pindah, memilih dengan dompet */}
      {CYCLE_STEPS.map((step) => {
        const popU = interpolate(f, [step.popAt, step.popAt + 10], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.4)),
        });
        const breakU = interpolate(f, [step.breakAt, step.breakAt + 14], [0, 1], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        });
        if (popU <= 0.01 || breakU >= 0.99) return null;

        return (
          <div
            key={`lbl-${step.id}`}
            style={{
              position: 'absolute',
              left: step.labelX + breakU * step.dropX,
              top: step.labelY + breakU * 64,
              translate: '-50% -50%',
              transform: `scale(${0.7 + popU * 0.3}) rotate(${breakU * step.dropRot}deg)`,
              opacity: popU * (1 - breakU),
              backgroundColor: C.creamHi,
              borderLeft: `5px solid ${step.color}`,
              padding: '7px 14px 8px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 20,
              lineHeight: 1,
              color: C.ink,
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
            }}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
};

const OneWayArrowToRecipient: React.FC = () => {
  const f = useCurrentFrame();

  // Muncul tenang setelah lingkaran putus (f=438..458), menunjuk satu arah ke figur penerima tanpa jalan balik
  const growU = interpolate(f, [438, 458], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  if (growU <= 0.001) return null;

  const totalW = Math.round(356 * growU);
  const headW = 36;
  const shaftW = Math.max(0, totalW - headW);

  return (
    <div
      style={{
        position: 'absolute',
        left: 598,
        top: 378,
        width: totalW,
        height: 44,
        translate: '0 -50%',
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.28))',
      }}
    >
      {/* Batang panah searah */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 14,
          width: shaftW,
          height: 16,
          backgroundColor: C.inkSoft,
          borderRadius: '4px 0 0 4px',
        }}
      />
      {/* Kepala panah menunjuk ke penerima */}
      {totalW > 14 ? (
        <div
          style={{
            position: 'absolute',
            left: shaftW,
            top: 0,
            width: Math.min(headW, totalW),
            height: 44,
            backgroundColor: C.inkSoft,
            clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
          }}
        />
      ) : null}
    </div>
  );
};

const RecipientFigure: React.FC = () => {
  const f = useCurrentFrame();

  // Sedikit mencondongkan tangan menerima saat panah searah tiba (f=452..468)
  const receiveU = interpolate(f, [452, 468], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PopIn at={16} origin="50% 100%">
      <div
        style={{
          position: 'absolute',
          left: 1034,
          top: 554,
          width: 106,
          height: 192,
          translate: '-50% -100%',
          filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
        }}
      >
        {/* Tas sekolah di punggung */}
        <div
          style={{
            position: 'absolute',
            left: 62,
            top: 68,
            width: 28,
            height: 64,
            backgroundColor: C.wood,
            borderRadius: 8,
          }}
        />
        {/* Kepala kertas polos tanpa wajah */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 52,
            height: 52,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            border: `3px solid ${C.inkSoft}`,
          }}
        />
        {/* Badan figur penerima */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 58,
            width: 62,
            height: 84,
            translate: '-50% 0',
            backgroundColor: '#5D7896',
            borderRadius: '12px 12px 5px 5px',
          }}
        />
        {/* Kaki */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 142,
            width: 22,
            height: 50,
            backgroundColor: C.inkSoft,
            borderRadius: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 58,
            top: 142,
            width: 22,
            height: 50,
            backgroundColor: C.inkSoft,
            borderRadius: 5,
          }}
        />
        {/* Lengan penerima pasif tanpa jalan balik */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 76,
            width: 36,
            height: 14,
            backgroundColor: '#4B6480',
            borderRadius: 7,
            transformOrigin: '100% 50%',
            transform: `rotate(${interpolate(receiveU, [0, 1], [-12, 8], CLAMP)}deg)`,
          }}
        />
      </div>
    </PopIn>
  );
};

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M05_DUR - 10, M05_DUR], [0, 1], {
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

export const M05: React.FC = () => {
  const f = useCurrentFrame();

  // Efek "seperti sesuatu yang mati lampu" pada kalimat "Ketika harganya nol, umpan balik itu hilang"
  const lightsOutU = interpolate(f, [414, 436], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#DDD6CA'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25} seed="m05-weave">
        <OrbitCamera
          dur={M05_DUR}
          yaw={14}
          drift={[-24, -6]}
          push={1.08}
          focus={0.5}
          depth={760}
          origin={[640, 410]}
        >
          <Depth z={0} cover>
            <CanteenBackdrop />
          </Depth>

          <Depth z={0.5}>
            {/* Lantai meja kantin kertas */}
            <Slab x={-140} y={554} w={1560} h={220} color="#ECE5D9" r={0} grain={0.5} />
            <Slab
              x={-140}
              y={548}
              w={1560}
              h={16}
              color={C.wood}
              shade={C.woodLo}
              shadeH={0.4}
              r={0}
            />
            <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

            {/* Label harga kertas yang dibalik menjadi "umpan balik", lalu menjadi 0 */}
            <HangingPriceTag />

            {/* Lingkaran panah kertas: membayar, protes, pindah, memilih dengan dompet */}
            <FeedbackCycleRing />

            {/* Figur pembeli tanpa wajah memegang dompet */}
            <BuyerWithWallet />

            {/* Satu panah searah menuju figur penerima tanpa jalan balik */}
            <OneWayArrowToRecipient />

            {/* Figur penerima tanpa wajah di sisi kanan */}
            <RecipientFigure />
          </Depth>

          <Depth z={0.95}>
            <div style={{filter: 'blur(3px)'}}>
              <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
              <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            </div>
          </Depth>
        </OrbitCamera>
      </FilmWeave>

      {/* Lapisan redup senyap seperti lampu dimatikan saat umpan balik hilang */}
      {lightsOutU > 0.001 ? (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 52% 48%, rgba(27,23,38,0.16) 0%, rgba(20,24,36,0.44) 100%)',
            opacity: lightsOutU,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <PaperFoldEdge />
      <GrainOverlay />
    </AbsoluteFill>
  );
};