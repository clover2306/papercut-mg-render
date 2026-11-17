// Adegan T02: Tagihan yang Pindah Kantong — menunjukkan bahwa transportasi gratis bagi penumpang
// tetap dibayar lewat kas negara dan menggeser anggaran dari sekolah, rumah sakit, serta jalan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FeltFibre, FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {PopUpOpen} from '../../lib/paper/transitions';
import {Lamp, Plant, Window} from '../../lib/paper/sets';
import {Boil, FLOOR_Y, Figure, Paper, Slab} from './mgkit';

export const T02_DUR = 843;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const cl = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.out(Easing.cubic)});

const sway = (f: number, start: number) => {
  if (f < start) return 0;
  const t = (f - start) / 30;
  return Math.sin(t * Math.PI * 2.1) * 4.2 * Math.exp(-t * 1.15);
};

const WavyLines: React.FC<{x: number; y: number; w: number; count?: number; color?: string}> = ({
  x,
  y,
  w,
  count = 3,
  color = C.inkSoft,
}) => (
  <svg
    width={w}
    height={count * 12}
    viewBox={`0 0 ${w} ${count * 12}`}
    style={{position: 'absolute', left: x, top: y, opacity: 0.45}}
  >
    {Array.from({length: count}).map((_, i) => {
      const yy = 6 + i * 11;
      const lw = i === count - 1 ? w * 0.65 : w * 0.92;
      return (
        <path
          key={i}
          d={`M 2 ${yy} Q ${lw * 0.25} ${yy - 3}, ${lw * 0.5} ${yy} T ${lw} ${yy}`}
          fill="none"
          stroke={color}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

const PlainCoin: React.FC<{x: number; y: number; r?: number; rot?: number}> = ({
  x,
  y,
  r = 18,
  rot = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: C.sparkYellow,
      border: `3px solid ${C.brassLo}`,
      boxShadow: '1px 3px 5px rgba(0,0,0,0.28)',
      rotate: `${rot}deg`,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 4,
        borderRadius: '50%',
        border: `1.5px dashed ${C.brassLo}`,
        opacity: 0.75,
      }}
    />
  </div>
);

const PaperTrain: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 320, height: 126}}>
    {/* Rel kertas kereta */}
    <Slab x={-20} y={118} w={370} h={8} color={C.inkSoft} r={2} />
    <Slab x={-20} y={126} w={370} h={6} color={C.woodLo} r={2} />
    <Paper lift={5}>
      {/* Badan gerbong kereta */}
      <Slab
        x={0}
        y={14}
        w={305}
        h={94}
        color={C.cream}
        shade={C.creamLo}
        shadeH={0.18}
        hi="#F6EFE6"
        hiH={0.12}
        r="16px 22px 8px 8px"
      />
      {/* Garis warna kereta tanpa tulisan/nomor */}
      <Slab x={0} y={64} w={305} h={16} color={ROOM.slate} r={0} />
      {/* Pantograf atas */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 0,
          width: 48,
          height: 15,
          borderTop: `3px solid ${C.inkSoft}`,
          borderLeft: `3px solid ${C.inkSoft}`,
          borderRight: `3px solid ${C.inkSoft}`,
        }}
      />
      {/* Jendela kereta */}
      {[26, 86, 146, 206].map((wx, i) => (
        <Slab key={i} x={wx} y={26} w={46} h={30} color="#34495E" r={5} />
      ))}
      {/* Roda kereta */}
      {[46, 92, 212, 258].map((cx, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx - 12,
            top: 98,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: C.ink,
            border: `3px solid ${C.metal}`,
          }}
        />
      ))}
    </Paper>
  </div>
);

const PaperBus: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 375, height: 225}}>
    <Paper lift={7}>
      {/* Badan utama bus kertas */}
      <Slab
        x={0}
        y={12}
        w={365}
        h={182}
        color="#C9573C"
        shade="#9E3F29"
        shadeH={0.16}
        hi="#DF7358"
        hiH={0.1}
        r="18px 26px 10px 10px"
      />
      {/* Sabuk krem khas bus */}
      <Slab x={0} y={108} w={365} h={24} color={C.creamHi} r={0} />
      {/* Jendela penumpang */}
      {[22, 92, 162].map((wx, i) => (
        <Slab key={i} x={wx} y={32} w={58} h={58} color="#283747" r={7} />
      ))}
      {/* Kabin pengemudi + siluet pengemudi bertopi tanpa wajah */}
      <Slab x={294} y={32} w={58} h={64} color="#283747" r="7px 16px 7px 7px" />
      {/* Kepala polos pengemudi */}
      <div
        style={{
          position: 'absolute',
          left: 314,
          top: 52,
          width: 22,
          height: 24,
          borderRadius: '50%',
          background: C.creamLo,
        }}
      />
      {/* Topi pengemudi */}
      <Slab x={311} y={45} w={28} h={8} color={ROOM.navy} r={3} />
      <Slab x={324} y={50} w={20} h={4} color={C.ink} r={2} />
      {/* Setir */}
      <div
        style={{
          position: 'absolute',
          left: 336,
          top: 72,
          width: 12,
          height: 20,
          borderRight: `3px solid ${C.cream}`,
          rotate: '-18deg',
        }}
      />
      {/* Pintu masuk penumpang */}
      <Slab
        x={232}
        y={42}
        w={50}
        h={144}
        color={C.cream}
        shade={C.creamLo}
        shadeH={0.12}
        r={6}
      />
      <Slab x={238} y={50} w={17} h={62} color="#34495E" r={3} />
      <Slab x={259} y={50} w={17} h={62} color="#34495E" r={3} />
      {/* Roda bus */}
      {[74, 292].map((cx, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx - 28,
            top: 168,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: C.ink,
            border: `5px solid ${C.creamLo}`,
            boxShadow: '2px 4px 6px rgba(0,0,0,0.35)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 13,
              borderRadius: '50%',
              background: C.metal,
            }}
          />
        </div>
      ))}
    </Paper>
  </div>
);

const BusStopPole: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 64, height: 310}}>
    <Paper lift={4}>
      <Slab x={27} y={58} w={10} h={246} color={C.metalLo} r={3} />
      <Slab x={12} y={296} w={40} h={14} color={C.inkSoft} r={4} />
      {/* Papan halte polos tanpa tulisan/angka */}
      <Slab x={4} y={0} w={56} h={66} color={C.creamHi} shade={C.creamLo} shadeH={0.15} r={8} />
      <Slab x={12} y={12} w={40} h={12} color="#C9573C" r={3} />
      <Slab x={12} y={30} w={40} h={8} color={ROOM.slate} r={2} />
      <Slab x={12} y={44} w={28} h={8} color={C.sage} r={2} />
    </Paper>
  </div>
);

const TicketAndHiddenBill: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => {
  const enter = cl(f, 10, 22, 0, 1);
  const stampProgress = cl(f, 22, 30, 0, 1);
  const stampScale = interpolate(stampProgress, [0, 1], [1.45, 1], CLAMP);
  const reveal = cl(f, 56, 84, 0, 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 146,
        height: 82,
        opacity: enter,
        transform: `scale(${0.86 + 0.14 * enter})`,
      }}
    >
      {/* Tagihan kertas tersembunyi di balik karcis — ujungnya mengintip saat karcis bergeser */}
      <div
        style={{
          position: 'absolute',
          left: 16 - reveal * 22,
          top: -8 - reveal * 14,
          width: 118,
          height: 68,
          rotate: `${-4 - reveal * 7}deg`,
          background: '#F7F1E5',
          border: `2px solid ${C.inkSoft}`,
          borderRadius: 4,
          boxShadow: '2px 4px 8px rgba(0,0,0,0.28)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            width: 34,
            height: 8,
            background: '#C9573C',
            borderRadius: 2,
          }}
        />
        <WavyLines x={8} y={22} w={96} count={3} />
      </div>

      {/* Karcis kertas "Gratis" di depan */}
      <div
        style={{
          position: 'absolute',
          left: reveal * 28,
          top: reveal * 8,
          width: 132,
          height: 68,
          rotate: `${-2 + reveal * 6}deg`,
          background: C.creamHi,
          border: `2.5px dashed ${C.inkSoft}`,
          borderRadius: 6,
          boxShadow: '3px 6px 10px rgba(0,0,0,0.34)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Cap merah "Gratis" */}
        <div
          style={{
            opacity: stampProgress,
            transform: `scale(${stampScale}) rotate(-5deg)`,
            border: '3px solid #C9573C',
            borderRadius: 5,
            padding: '4px 12px 6px',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 28,
            color: '#C9573C',
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          Gratis
        </div>
      </div>
    </div>
  );
};

const BillPropIcon: React.FC<{kind: 'fuel' | 'cap' | 'wrench'}> = ({kind}) => {
  if (kind === 'fuel') {
    return (
      <svg width={34} height={36} viewBox="0 0 34 36">
        <rect x={6} y={9} width={20} height={24} rx={4} fill="#C9573C" />
        <rect x={11} y={4} width={10} height={6} rx={2} fill={C.inkSoft} />
        <path d="M26 13 L31 8 L31 22" fill="none" stroke={C.inkSoft} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={10} y1={15} x2={22} y2={27} stroke={C.creamHi} strokeWidth={2} />
        <line x1={22} y1={15} x2={10} y2={27} stroke={C.creamHi} strokeWidth={2} />
      </svg>
    );
  }
  if (kind === 'cap') {
    return (
      <svg width={38} height={32} viewBox="0 0 38 32">
        <ellipse cx={19} cy={13} rx={16} ry={8} fill={ROOM.navy} />
        <rect x={7} y={13} width={24} height={7} rx={2} fill={ROOM.slate} />
        <path d="M9 20 Q23 26 35 20 L31 24 Q20 27 9 22 Z" fill={C.ink} />
        <rect x={16} y={14} width={6} height={4} rx={1} fill={C.sparkYellow} />
      </svg>
    );
  }
  return (
    <svg width={36} height={36} viewBox="0 0 36 36">
      <path
        d="M24 6 A7 7 0 0 0 17 15 L7 25 A3 3 0 0 0 11 29 L21 19 A7 7 0 0 0 30 12 L26 15 L22 11 Z"
        fill={C.metalLo}
        stroke={C.inkSoft}
        strokeWidth={1.5}
      />
    </svg>
  );
};

interface HangingBillProps {
  f: number;
  appearAt: number;
  anchorX: number;
  anchorY: number;
  label: string;
  kind: 'fuel' | 'cap' | 'wrench';
  targetX: number;
  targetY: number;
}

const HangingBill: React.FC<HangingBillProps> = ({
  f,
  appearAt,
  anchorX,
  anchorY,
  label,
  kind,
  targetX,
  targetY,
}) => {
  const pop = cl(f, appearAt, appearAt + 14, 0, 1);
  if (pop <= 0) return null;

  // Beat 3 (f = 374..465): pita menarik tagihan naik lalu masuk ke kantong "Kas negara"
  const liftUp = cl(f, 384, 412, 0, 1);
  const glideAcross = cl(f, 406, 456, 0, 1);
  const dropIn = cl(f, 446, 468, 0, 1);

  const curX = interpolate(glideAcross, [0, 1], [anchorX, targetX], CLAMP);
  const liftedY = anchorY - liftUp * (anchorY - 145);
  const curY = interpolate(glideAcross, [0, 1], [liftedY, 165], CLAMP) + dropIn * (targetY - 165);
  const scale = (0.78 + 0.22 * pop) * (1 - dropIn * 0.48);
  const opacity = pop * (1 - cl(f, 456, 468, 0, 1));
  const rot = sway(f, appearAt + 6) * (1 - liftUp) + glideAcross * 6;

  // Panjang pita penarik dari langit-langit panggung saat Beat 3 aktif
  const ribbonPull = cl(f, 372, 386, 0, 1);
  const ribbonTopY = -40;
  const ribbonBottomY = curY - 12;

  return (
    <>
      {ribbonPull > 0 && opacity > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: curX - 2,
            top: ribbonTopY,
            width: 4,
            height: Math.max(0, (ribbonBottomY - ribbonTopY) * ribbonPull),
            background: '#C9573C',
            opacity: opacity * 0.9,
          }}
        />
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: curX,
          top: curY,
          translate: '-50% 0',
          transformOrigin: '50% 0%',
          transform: `scale(${scale}) rotate(${rot}deg)`,
          opacity,
        }}
      >
        {/* Tali penggantung pendek */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -16,
            width: 2.5,
            height: 18,
            translate: '-50% 0',
            background: C.inkSoft,
          }}
        />
        {/* Kartu tagihan kertas */}
        <div
          style={{
            width: 158,
            background: '#F8F2E7',
            border: `2px solid ${C.inkSoft}`,
            borderRadius: 6,
            padding: '8px 10px 10px',
            boxShadow: '2px 5px 9px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <BillPropIcon kind={kind} />
          <div
            style={{
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 19,
              color: C.ink,
              lineHeight: 1.1,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </>
  );
};

const PassengerWithWallet: React.FC<{f: number}> = ({f}) => {
  // Beat 1: berjalan tenang menuju pintu bus tanpa membuka dompet
  const walk = cl(f, 18, 62, 0, 1);
  const px = interpolate(walk, [0, 1], [545, 452], CLAMP);

  // Beat 3 (f = 298..358): membuka dompet kosong
  const openWallet = cl(f, 298, 326, 0, 1);
  const flapAngle = interpolate(openWallet, [0, 1], [0, -115], CLAMP);

  return (
    <div style={{position: 'absolute', left: px, top: 576}}>
      <Figure x={0} y={0} s={0.96} shirt={ROOM.dusk} />
      {/* Tas selempang sederhana bermartabat */}
      <div
        style={{
          position: 'absolute',
          left: -24,
          top: -112,
          width: 24,
          height: 30,
          borderRadius: 4,
          background: C.wood,
          border: `2px solid ${C.inkSoft}`,
        }}
      />
      {/* Dompet kertas di tangan */}
      <div
        style={{
          position: 'absolute',
          left: -46 - openWallet * 14,
          top: -118 - openWallet * 18,
          transform: `scale(${1 + openWallet * 0.45})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Sisi belakang dompet (kosong) */}
        <div
          style={{
            width: 34,
            height: 24,
            borderRadius: 4,
            background: '#6E472B',
            border: `2px solid ${C.ink}`,
            boxShadow: '1px 3px 5px rgba(0,0,0,0.3)',
          }}
        />
        {/* Bagian dalam kosong yang terlihat saat terbuka */}
        {openWallet > 0.1 ? (
          <div
            style={{
              position: 'absolute',
              left: 3,
              top: 3,
              width: 28,
              height: 18,
              borderRadius: 2,
              background: C.creamLo,
              opacity: openWallet,
            }}
          />
        ) : null}
        {/* Tutup lipatan dompet yang membuka */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 34,
            height: 14,
            borderRadius: '4px 4px 2px 2px',
            background: '#8C5B38',
            border: `2px solid ${C.ink}`,
            transformOrigin: '50% 0%',
            transform: `perspective(240px) rotateX(${flapAngle}deg)`,
          }}
        />
      </div>
    </div>
  );
};

const KasNegaraPouch: React.FC<{f: number; cx: number; bottomY: number}> = ({f, cx, bottomY}) => {
  const enter = cl(f, 360, 385, 0, 1);
  // Beat 3 (f = 455..495): menggembung dan menampilkan cakram koin polos
  const swell = cl(f, 455, 488, 0, 1);
  const scaleX = 1 + swell * 0.11;
  const scaleY = 1 + swell * 0.05;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: bottomY,
        width: 236,
        height: 230,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scale(${(0.85 + 0.15 * enter) * scaleX}, ${(0.85 + 0.15 * enter) * scaleY})`,
        opacity: enter,
      }}
    >
      {/* Tumpukan koin cakram polos yang mengintip saat kantong menggembung */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 8 - swell * 20,
          width: 236,
          height: 56,
          opacity: swell,
        }}
      >
        <PlainCoin x={86} y={28} r={16} rot={-12} />
        <PlainCoin x={118} y={22} r={18} rot={6} />
        <PlainCoin x={150} y={29} r={16} rot={14} />
        <PlainCoin x={102} y={36} r={15} rot={-4} />
        <PlainCoin x={136} y={35} r={15} rot={9} />
      </div>

      <Paper lift={8}>
        {/* Kerah atas kantong kain kertas */}
        <Slab
          x={52}
          y={16}
          w={132}
          h={34}
          color="#9E8968"
          shade="#7C694D"
          shadeH={0.25}
          r="14px 14px 6px 6px"
        />
        {/* Badan kantong besar */}
        <Slab
          x={14}
          y={44}
          w={208}
          h={182}
          color="#8A7A60"
          shade="#695B46"
          shadeH={0.2}
          hi="#A69478"
          hiH={0.1}
          r="46px 46px 34px 34px"
          grain={0.75}
        />
        {/* Tali ikat leher kantong */}
        <Slab x={48} y={42} w={140} h={12} color="#C9573C" r={5} />
        {/* Tambalan label kertas "Kas negara" */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 94,
            width: 184,
            padding: '12px 10px 14px',
            background: C.creamHi,
            border: `2.5px dashed ${C.inkSoft}`,
            borderRadius: 8,
            boxShadow: '1px 3px 6px rgba(0,0,0,0.22)',
            textAlign: 'center',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 28,
            color: C.ink,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
          }}
        >
          Kas negara
        </div>
      </Paper>
    </div>
  );
};

const OpportunityCardIcon: React.FC<{kind: 'school' | 'hospital' | 'road'}> = ({kind}) => {
  if (kind === 'school') {
    return (
      <svg width={92} height={64} viewBox="0 0 92 64">
        <polygon points="46,6 10,28 82,28" fill="#C9573C" />
        <rect x={16} y={28} width={60} height={32} rx={2} fill={C.cream} stroke={C.inkSoft} strokeWidth={2} />
        <rect x={40} y={40} width={12} height={20} fill={C.wood} />
        <rect x={23} y={35} width={10} height={10} fill="#34495E" />
        <rect x={59} y={35} width={10} height={10} fill="#34495E" />
      </svg>
    );
  }
  if (kind === 'hospital') {
    return (
      <svg width={92} height={64} viewBox="0 0 92 64">
        <rect x={18} y={12} width={56} height={48} rx={3} fill="#F5EFE6" stroke={C.inkSoft} strokeWidth={2} />
        {/* Palang rumah sakit */}
        <rect x={42} y={18} width={8} height={22} rx={1.5} fill="#C9573C" />
        <rect x={35} y={25} width={22} height={8} rx={1.5} fill="#C9573C" />
        <rect x={40} y={44} width={12} height={16} fill={ROOM.slate} />
      </svg>
    );
  }
  return (
    <svg width={92} height={64} viewBox="0 0 92 64">
      <rect x={10} y={16} width={72} height={36} rx={5} fill={C.sage} />
      <polygon points="22,52 34,16 58,16 70,52" fill={C.boardHi} />
      <line x1={46} y1={20} x2={46} y2={27} stroke={C.creamHi} strokeWidth={3} strokeLinecap="round" />
      <line x1={46} y1={33} x2={46} y2={40} stroke={C.creamHi} strokeWidth={3} strokeLinecap="round" />
      <line x1={46} y1={45} x2={46} y2={50} stroke={C.creamHi} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};

interface OpportunityCardProps {
  f: number;
  appearAt: number;
  cx: number;
  y: number;
  label: string;
  kind: 'school' | 'hospital' | 'road';
  pouchX: number;
  pouchY: number;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  f,
  appearAt,
  cx,
  y,
  label,
  kind,
  pouchX,
  pouchY,
}) => {
  const pop = cl(f, appearAt, appearAt + 14, 0, 1);
  if (pop <= 0) return null;

  // Beat 5 (f = 695..740): meredup menjadi bayangan putus-putus saat koin meluncur ke bus
  const dim = cl(f, 695, 740, 0, 1);
  const cardOpacity = pop * (1 - dim * 0.56);

  return (
    <>
      {/* Garis penghubung kertas dari kantong Kas negara ke kartu */}
      <svg
        width={1280}
        height={720}
        style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: pop * (1 - dim * 0.45)}}
      >
        <line
          x1={pouchX}
          y1={pouchY}
          x2={cx}
          y2={y + 136}
          stroke={C.inkSoft}
          strokeWidth={2}
          strokeDasharray="6 6"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: cx,
          top: y + (1 - pop) * 26,
          width: 176,
          height: 138,
          translate: '-50% 0',
          transform: `scale(${0.86 + 0.14 * pop})`,
          opacity: cardOpacity,
          background: dim > 0.5 ? 'rgba(218, 206, 192, 0.42)' : '#F8F2E7',
          border: dim > 0.35 ? `2.5px dashed ${C.inkSoft}` : `2.5px solid ${C.inkSoft}`,
          borderRadius: 8,
          boxShadow: dim > 0.5 ? 'none' : '2px 6px 10px rgba(0,0,0,0.28)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 10px',
          gap: 6,
          filter: dim > 0 ? `grayscale(${Math.round(dim * 85)}%)` : undefined,
        }}
      >
        <OpportunityCardIcon kind={kind} />
        <div
          style={{
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 22,
            color: C.ink,
            lineHeight: 1.05,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};

const CoinToBusTransfer: React.FC<{f: number}> = ({f}) => {
  // Beat 5 (f = 665..740): satu koin meluncur dari kantong Kas negara (815, 345) ke bus (395, 395)
  const u = cl(f, 665, 740, 0, 1);
  if (u <= 0) return null;

  const x = interpolate(u, [0, 1], [815, 395], CLAMP);
  const arcLift = Math.sin(u * Math.PI) * 65;
  const y = interpolate(u, [0, 1], [345, 395], CLAMP) - arcLift;
  const opacity = cl(f, 665, 675, 0, 1) * (1 - cl(f, 730, 742, 0, 1));

  return (
    <div style={{opacity}}>
      <PlainCoin x={x} y={y} r={20} rot={u * 260} />
    </div>
  );
};

const InvisibleCostTag: React.FC<{f: number; cx: number; y: number}> = ({f, cx, y}) => {
  // Beat 5 (f = 795..818): ditarik keluar dari balik bayangan kartu
  const pull = cl(f, 795, 818, 0, 1);
  if (pull <= 0) return null;

  const slideY = interpolate(pull, [0, 1], [-58, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: y + slideY,
        translate: '-50% 0',
        opacity: pull,
      }}
    >
      {/* Tali penarik kertas di ujung tag */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -28,
          width: 3,
          height: 30,
          translate: '-50% 0',
          background: C.inkSoft,
        }}
      />
      <Boil seed="invisible-cost" amp={0.4} rot={0.05}>
        <div
          style={{
            backgroundColor: C.tag,
            padding: '13px 22px 15px',
            rotate: '-1.5deg',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 25,
            color: C.tagText,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.38))',
          }}
        >
          Biaya yang tidak terlihat
        </div>
      </Boil>
    </div>
  );
};

const RoadTrack: React.FC<{f: number}> = ({f}) => {
  // Pengukur macet di kaki panggung: barisan mobil kertas rapat dengan pengemudi tanpa wajah
  const creep = interpolate(f, [0, T02_DUR], [0, 34], CLAMP);
  const cars = [
    {x: 95, color: ROOM.slate},
    {x: 265, color: '#B8643E'},
    {x: 435, color: ROOM.teal},
    {x: 615, color: '#8C7BA8'},
    {x: 790, color: ROOM.mustard},
    {x: 965, color: ROOM.dusk},
    {x: 1135, color: '#6E7F6B'},
  ];

  return (
    <div style={{position: 'absolute', left: 0, top: FLOOR_Y + 4, width: 1280, height: 116}}>
      {/* Permukaan aspal rel bawah */}
      <Slab x={0} y={8} w={1280} h={94} color={C.boardLo} r={0} grain={0.5} />
      {/* Garis putus-putus jalur */}
      <div
        style={{
          position: 'absolute',
          left: -40 + creep,
          right: -40,
          top: 52,
          height: 4,
          backgroundImage: `repeating-linear-gradient(to right, ${C.cream} 0px, ${C.cream} 34px, transparent 34px, transparent 68px)`,
          opacity: 0.55,
        }}
      />
      {/* Deretan mobil kertas */}
      {cars.map((car, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: car.x + creep,
            top: 22,
            width: 122,
            height: 54,
          }}
        >
          {/* Atap mobil */}
          <Slab x={22} y={0} w={68} h={24} color={car.color} r="10px 14px 2px 2px" />
          {/* Kaca + siluet pengemudi tanpa wajah di balik setir */}
          <Slab x={54} y={5} w={28} h={16} color="#243342" r={3} />
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 8,
              width: 10,
              height: 11,
              borderRadius: '50%',
              background: C.creamLo,
            }}
          />
          {/* Badan mobil */}
          <Slab
            x={4}
            y={20}
            w={114}
            h={24}
            color={car.color}
            shade="rgba(0,0,0,0.22)"
            shadeH={0.25}
            r="8px 12px 5px 5px"
          />
          {/* Roda mobil */}
          {[28, 92].map((wx, wi) => (
            <div
              key={wi}
              style={{
                position: 'absolute',
                left: wx - 11,
                top: 34,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: C.ink,
                border: `3px solid ${C.creamLo}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const T02: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <PopUpOpen dur={16} from={0.25}>
        <FilmWeave amp={0.25} flicker={0.25}>
          <OrbitCamera
            dur={T02_DUR}
            yaw={14}
            push={1.08}
            drift={[-16, 0]}
            depth={680}
            focus={0.5}
            origin={[640, 560]}
          >
            {/* Lapis latar belakang teater pagi (z = 0) */}
            <Depth z={0} cover>
              <Slab x={0} y={0} w={1280} h={720} color={C.creamHi} r={0} grain={0.55} />
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 28% 24%, rgba(255,244,214,0.42) 0%, rgba(255,255,255,0) 52%, rgba(0,0,0,0.24) 100%)',
                }}
              />
              <Window x={540} y={76} w={175} h={210} night={false} />
              <Lamp x={1115} y={40} s={0.78} on />
              {/* Lantai panggung */}
              <Slab x={0} y={FLOOR_Y - 22} w={1280} h={26} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
              <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
            </Depth>

            {/* Lapis panggung utama (z = 0.5) */}
            <Depth z={0.5}>
              {/* Sisi kiri: kereta kertas, bus kertas, tiang halte polos */}
              <PaperTrain x={58} y={84} />
              <PaperBus x={66} y={352} />
              <BusStopPole x={464} y={268} />

              {/* Beat 1: karcis bercap "Gratis" + ujung tagihan tersembunyi di pintu masuk bus */}
              <TicketAndHiddenBill f={f} x={312} y={248} />

              {/* Beat 1 & 3: siluet penumpang tanpa wajah + dompet terbuka kosong */}
              <PassengerWithWallet f={f} />

              {/* Beat 2 & 3: tiga tagihan kecil menggantung lalu ditarik pita ke Kas negara */}
              <HangingBill
                f={f}
                appearAt={110}
                anchorX={148}
                anchorY={396}
                label="Bahan bakar"
                kind="fuel"
                targetX={805}
                targetY={370}
              />
              <HangingBill
                f={f}
                appearAt={171}
                anchorX={316}
                anchorY={396}
                label="Gaji pengemudi"
                kind="cap"
                targetX={815}
                targetY={370}
              />
              <HangingBill
                f={f}
                appearAt={234}
                anchorX={224}
                anchorY={224}
                label="Perawatan"
                kind="wrench"
                targetX={825}
                targetY={370}
              />

              {/* Beat 3: kantong kain besar berlabel "Kas negara" + cakram koin polos */}
              <KasNegaraPouch f={f} cx={815} bottomY={574} />

              {/* Beat 4 & 5: tiga kartu kecil muncul dari kantong lalu meredup putus-putus */}
              <OpportunityCard
                f={f}
                appearAt={550}
                cx={710}
                y={136}
                label="Sekolah"
                kind="school"
                pouchX={780}
                pouchY={358}
              />
              <OpportunityCard
                f={f}
                appearAt={576}
                cx={915}
                y={136}
                label="Rumah sakit"
                kind="hospital"
                pouchX={815}
                pouchY={358}
              />
              <OpportunityCard
                f={f}
                appearAt={617}
                cx={1120}
                y={136}
                label="Jalan"
                kind="road"
                pouchX={850}
                pouchY={358}
              />

              {/* Beat 5: koin polos meluncur dari Kas negara ke bus */}
              <CoinToBusTransfer f={f} />

              {/* Beat 5: label "Biaya yang tidak terlihat" ditarik keluar dari balik bayangan kartu */}
              <InvisibleCostTag f={f} cx={1085} y={396} />
            </Depth>

            {/* Lapis depan: jalur jalan di kaki panggung + tanaman sudut (z = 0.85) */}
            <Depth z={0.85}>
              <Plant x={-34} y={365} s={0.78} />
              <RoadTrack f={f} />
            </Depth>
          </OrbitCamera>
        </FilmWeave>
      </PopUpOpen>
      <FeltFibre opacity={0.18} />
      <GrainOverlay />
    </AbsoluteFill>
  );
};