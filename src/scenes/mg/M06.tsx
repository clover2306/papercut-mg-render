// M06 (Scene 043-045, 155,47-176,17 dtk, 621 frame): grafik lingkaran dari piring penilaian internal BGN.
// Irisan besar piring bergetar di rentang 80-90 persen, kotak makan bersih diangkat, dan tali pengawasan putus sebelum dapur.
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
import {MarkerUnderline} from '../../lib/paper/proof';

export const M06_DUR = 621;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const polarPt = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

// Membuat path irisan piring (sektor lingkaran) dari sudut startDeg ke endDeg (searah jarum jam)
const slicePath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const span = ((endDeg - startDeg) % 360 + 360) % 360;
  const p0 = polarPt(cx, cy, r, startDeg);
  const p1 = polarPt(cx, cy, r, endDeg);
  const largeArc = span > 180 ? 1 : 0;
  return `M ${cx.toFixed(1)} ${cy.toFixed(1)} L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`;
};

const CanteenBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-80} w={1520} h={880} color="#D4D7D2" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 34% 34%, rgba(255,252,242,0.28) 0%, rgba(255,255,255,0) 56%, rgba(0,0,0,0.25) 100%)',
      }}
    />
    <Slab x={-120} y={316} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={332} w={1520} h={240} color="#BFC5BE" r={0} grain={0.55} />
    <Window x={36} y={48} w={188} h={232} night={false} />
    <Corkboard x={568} y={54} w={196} h={132} />
    <Sticky x={592} y={80} s={32} color="#E6D7A8" rot={-3} />
    <Sticky x={642} y={86} s={30} color="#D8DFD5" rot={2} />
    <Sticky x={690} y={78} s={32} color="#E6D7A8" rot={-1} />
    <Shelf x={566} y={266} w={200} books={3} />
    <Plant x={1156} y={266} s={0.52} />
  </AbsoluteFill>
);

const PlatePieChart: React.FC = () => {
  const f = useCurrentFrame();

  const cx = 408;
  const cy = 374;
  const outerR = 184;
  const innerR = 152;

  // Pemotongan piring menjadi 2 irisan pada awal adegan (f=24..58)
  const splitU = interpolate(f, [24, 58], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Saat narator menyebut "delapan puluh sampai sembilan puluh persen" (f=150..365),
  // irisan besar menyapu & bergetar di antara batas 80% (288 deg) dan 90% (324 deg)
  const sweepEngage = interpolate(f, [150, 174], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const steppedF = Math.floor(f / 2) * 2;
  const oscWave =
    Math.sin(Math.max(0, steppedF - 165) * 0.21) * 0.65 +
    Math.sin(Math.max(0, steppedF - 165) * 0.47) * 0.35;
  const rangePos = 0.5 + 0.5 * oscWave * sweepEngage; // 0 = 80%, 1 = 90%
  const largeSpanDeg = interpolate(rangePos, [0, 1], [288, 324], CLAMP);

  // Irisan kecil ditempatkan di sisi kanan-atas (-36 deg .. +36 deg saat 80%, menyempit saat 90%)
  const smallHalfSpan = (360 - largeSpanDeg) / 2;
  const smallStart = -smallHalfSpan;
  const smallEnd = smallHalfSpan;
  const largeStart = smallEnd;
  const largeEnd = 360 + smallStart;

  // Irisan kecil sedikit terpisah ke kanan agar potongan terlihat jelas seperti kertas digunting
  const smallOffsetX = splitU * 18;
  const smallOffsetY = splitU * -4;

  // Garis batas rentang 80% dan 90% pada tepi piring (tanpa angka tambahan)
  const bound80Start = polarPt(cx, cy, innerR - 6, 36);
  const bound80End = polarPt(cx, cy, outerR + 6, 36);
  const bound90Start = polarPt(cx, cy, innerR - 6, 18);
  const bound90End = polarPt(cx, cy, outerR + 6, 18);
  const bound80LowStart = polarPt(cx, cy, innerR - 6, -36);
  const bound80LowEnd = polarPt(cx, cy, outerR + 6, -36);
  const bound90LowStart = polarPt(cx, cy, innerR - 6, -18);
  const bound90LowEnd = polarPt(cx, cy, outerR + 6, -18);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Alas serbet kertas di bawah piring */}
      <PopIn at={4} origin="50% 50%">
        <Paper lift={4}>
          <Slab
            x={cx - 216}
            y={cy - 196}
            w={432}
            h={392}
            color={C.cream}
            shade={C.creamLo}
            shadeH={0.08}
            r={18}
            rot={-1.5}
            grain={0.5}
          />
        </Paper>
      </PopIn>

      {/* Piring kertas bundar yang terpotong menjadi dua irisan */}
      <PopIn at={8} origin="50% 50%">
        <svg
          width={520}
          height={460}
          viewBox={`${cx - 240} ${cy - 230} 520 460`}
          style={{
            position: 'absolute',
            left: cx - 240,
            top: cy - 230,
            overflow: 'visible',
            filter: 'drop-shadow(3px 8px 12px rgba(0,0,0,0.3))',
          }}
        >
          {/* IRISAN BESAR (80-90 persen: pengelola tidak mematuhi standar operasional) */}
          <g>
            {/* Bayangan tepi kertas irisan besar */}
            <path
              d={slicePath(cx, cy, outerR, largeStart, largeEnd)}
              fill="#9E3F29"
              transform="translate(3 5)"
            />
            {/* Rim luar piring pada irisan besar */}
            <path
              d={slicePath(cx, cy, outerR, largeStart, largeEnd)}
              fill="#D4664B"
              stroke="#F3EEE6"
              strokeWidth={2}
            />
            {/* Cekungan dalam piring pada irisan besar */}
            <path
              d={slicePath(cx, cy, innerR, largeStart, largeEnd)}
              fill={C.tag}
              stroke="#B2482F"
              strokeWidth={2}
            />
          </g>

          {/* IRISAN KECIL SISANYA (tergeser tipis ke kanan setelah dipotong) */}
          <g transform={`translate(${smallOffsetX} ${smallOffsetY})`}>
            <path
              d={slicePath(cx, cy, outerR, smallStart, smallEnd)}
              fill="#B9AC99"
              transform="translate(3 5)"
            />
            <path
              d={slicePath(cx, cy, outerR, smallStart, smallEnd)}
              fill={C.creamHi}
              stroke="#8C8274"
              strokeWidth={2}
            />
            <path
              d={slicePath(cx, cy, innerR, smallStart, smallEnd)}
              fill="#F3EDE2"
              stroke={C.creamLo}
              strokeWidth={2}
            />
          </g>

          {/* Penanda batas rentang (dua garis batas getaran di tepi piring, tanpa angka) */}
          {sweepEngage > 0.05 ? (
            <g opacity={sweepEngage * 0.85}>
              <line
                x1={bound80Start.x}
                y1={bound80Start.y}
                x2={bound80End.x}
                y2={bound80End.y}
                stroke={C.ink}
                strokeWidth={3}
                strokeDasharray="5 4"
              />
              <line
                x1={bound90Start.x}
                y1={bound90Start.y}
                x2={bound90End.x}
                y2={bound90End.y}
                stroke={C.ink}
                strokeWidth={3}
                strokeDasharray="5 4"
              />
              <line
                x1={bound80LowStart.x}
                y1={bound80LowStart.y}
                x2={bound80LowEnd.x}
                y2={bound80LowEnd.y}
                stroke={C.ink}
                strokeWidth={3}
                strokeDasharray="5 4"
              />
              <line
                x1={bound90LowStart.x}
                y1={bound90LowStart.y}
                x2={bound90LowEnd.x}
                y2={bound90LowEnd.y}
                stroke={C.ink}
                strokeWidth={3}
                strokeDasharray="5 4"
              />
            </g>
          ) : null}
        </svg>
      </PopIn>

      {/* Label kecil di tepi piring: "Badan Gizi Nasional, penilaian internal" */}
      <PopIn at={36}>
        <Boil seed="m06-bgn-label" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 332,
              top: 74,
              translate: '-50% 0',
              rotate: '-2deg',
            }}
          >
            <div
              style={{
                backgroundColor: C.creamHi,
                borderLeft: `6px solid ${C.cap}`,
                padding: '10px 20px 12px',
                fontFamily: FONT.label,
                fontWeight: 800,
                fontSize: 21,
                lineHeight: 1.2,
                color: C.ink,
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
              }}
            >
              <div>Badan Gizi Nasional</div>
              <div style={{fontSize: 18, color: C.inkSoft, marginTop: 2}}>
                penilaian internal
              </div>
            </div>
            {/* Potongan lakban kertas yang menempelkan label ke tepi piring */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -18,
                translate: '-50% 0',
                rotate: '4deg',
                width: 26,
                height: 30,
                backgroundColor: C.tape,
                opacity: 0.88,
                filter: 'url(#torn)',
              }}
            />
          </div>
        </Boil>
      </PopIn>

      {/* Potongan kertas angka rentang "80-90 persen" menempel di atas irisan besar */}
      <PopIn at={162}>
        <Boil seed="m06-pct-badge" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 382,
              top: 294,
              translate: '-50% 0',
              rotate: '-1.5deg',
              backgroundColor: C.creamHi,
              padding: '10px 22px 12px',
              fontFamily: FONT.banner,
              fontSize: 38,
              lineHeight: 1,
              color: C.tag,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.36))',
            }}
          >
            80-90 persen
          </div>
        </Boil>
        <MarkerUnderline
          x={276}
          y={360}
          w={212}
          at={180}
          dur={12}
          color={C.creamHi}
          width={5}
          seed="m06-pct-line"
        />
      </PopIn>

      {/* Label pada irisan besar: "pengelola tidak mematuhi standar operasional" */}
      <PopIn at={66}>
        <Boil seed="m06-sop-label" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 384,
              top: 384,
              translate: '-50% 0',
              rotate: '1deg',
              backgroundColor: '#F5EFE4',
              borderTop: `4px solid ${C.inkSoft}`,
              padding: '10px 18px 12px',
              textAlign: 'center',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 20,
              lineHeight: 1.2,
              color: C.ink,
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
            }}
          >
            <div>pengelola tidak mematuhi</div>
            <div>standar operasional</div>
          </div>
        </Boil>
      </PopIn>
    </div>
  );
};

const CleanSafeLunchbox: React.FC = () => {
  const f = useCurrentFrame();

  // Pada kalimat "Bukan makanannya yang mustahil dibuat aman" (f=401..461),
  // satu kotak makan utuh dan bersih diangkat ke atas meja
  const liftU = interpolate(f, [402, 434], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.35)),
  });
  const hoverY = f >= 434 ? Math.sin((f - 434) * 0.1) * 3.5 : 0;
  const boxY = interpolate(liftU, [0, 1], [274, 214], CLAMP) + hoverY;
  const boxRot = interpolate(liftU, [0, 0.5, 1], [0, -2.5, -1.2], CLAMP);
  const shadowScale = interpolate(liftU, [0, 1], [1, 0.72], CLAMP);

  return (
    <PopIn at={392} origin="50% 100%">
      <div style={{position: 'absolute', left: 980, top: 0, width: 0, height: 0}}>
        {/* Bayangan di atas alas kertas saat kotak makan terangkat */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 280,
            width: 176,
            height: 22,
            translate: '-50% -50%',
            borderRadius: '50%',
            backgroundColor: 'rgba(28,27,23,0.22)',
            transform: `scaleX(${shadowScale})`,
          }}
        />

        {/* Kotak makan kertas utuh & bersih */}
        <Boil seed="m06-clean-box" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: boxY,
              width: 184,
              height: 112,
              translate: '-50% -50%',
              rotate: `${boxRot}deg`,
            }}
          >
            <Paper lift={12}>
              {/* Badan kotak makan */}
              <Slab
                x={10}
                y={34}
                w={164}
                h={70}
                color="#F5F0E6"
                shade={C.creamLo}
                shadeH={0.18}
                hi="#FFFFFF"
                hiH={0.08}
                r="6px 6px 14px 14px"
                grain={0.4}
              />
              {/* Tutup kotak makan rapat dan utuh */}
              <Slab
                x={2}
                y={18}
                w={180}
                h={24}
                color="#FAF7F0"
                shade={C.creamLo}
                shadeH={0.28}
                r={8}
                grain={0.35}
              />
              {/* Pita pengikat hijau bersih */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 18,
                  width: 30,
                  height: 86,
                  translate: '-50% 0',
                  backgroundColor: C.go,
                  borderLeft: '2px solid #1E7A37',
                  borderRight: '2px solid #1E7A37',
                }}
              />
              {/* Segel centang kertas polos tanpa teks/angka */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 56,
                  width: 44,
                  height: 44,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  backgroundColor: C.creamHi,
                  border: `3px solid ${C.go}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.22)',
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <polyline
                    points="5,13 10,18 19,7"
                    fill="none"
                    stroke={C.go}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Paper>
          </div>
        </Boil>

        {/* Kilau hangat bukti kotak makan bersih dan aman */}
        <SparkleBurst at={426} x={0} y={182} seed="m06-clean-spark" spread={66} />
      </div>
    </PopIn>
  );
};

const OfficeToKitchenBrokenRope: React.FC = () => {
  const f = useCurrentFrame();

  // Tali pengawasan menjulur dari kantor ke arah dapur (f=466..504),
  // lalu terputus di tengah jalan sebelum menyentuh dapur (f=506)
  const extendU = interpolate(f, [466, 504], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const isSnapped = f >= 506;
  const snapDropU = interpolate(f, [506, 530], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.bounce),
  });
  const sway = isSnapped ? Math.sin((f - 506) * 0.14) * 4 : 0;

  // Titik jangkar tangan penjaga di dinding kanan kantor: (858, 466)
  // Tepi kiri dapur berada di x = 1094 -> tali terputus di x = 976 (tidak pernah menyentuh dapur)
  const anchorX = 858;
  const anchorY = 466;
  const maxReachX = 996;
  const currentTipX = interpolate(extendU, [0, 1], [anchorX + 6, maxReachX], CLAMP);

  // Setelah putus di x=972, sisa ujung kiri menjuntai ke bawah, dan potongan ujung kanan jatuh ke meja
  const leftEndX = 954 + sway * 0.6;
  const leftEndY = anchorY + snapDropU * 54;
  const loosePieceX = 984 - sway * 0.4;
  const loosePieceY = anchorY + snapDropU * 82;

  return (
    <PopIn at={454} origin="50% 100%">
      <div style={{position: 'absolute', inset: 0}}>
        {/* 1. KANTOR KERTAS di sisi kiri jalur bawah */}
        <Boil seed="m06-office" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 792,
              top: 556,
              width: 124,
              height: 174,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={8}>
              {/* Atap kantor bertingkat */}
              <Slab
                x={6}
                y={12}
                w={112}
                h={16}
                color={C.capLo}
                shade={C.ink}
                shadeH={0.35}
                r={4}
              />
              {/* Badan gedung kantor */}
              <Slab
                x={14}
                y={28}
                w={96}
                h={146}
                color={C.cap}
                shade={C.capLo}
                shadeH={0.14}
                r="4px 4px 2px 2px"
                grain={0.5}
              />
              {/* Jendela-jendela kantor kertas */}
              {[44, 78, 112].map((wy, row) => (
                <React.Fragment key={row}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 28,
                      top: wy,
                      width: 24,
                      height: 20,
                      borderRadius: 3,
                      backgroundColor: '#F2DC9B',
                      border: `2px solid ${C.inkSoft}`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 72,
                      top: wy,
                      width: 24,
                      height: 20,
                      borderRadius: 3,
                      backgroundColor: '#F2DC9B',
                      border: `2px solid ${C.inkSoft}`,
                    }}
                  />
                </React.Fragment>
              ))}
              {/* Pintu kantor */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  width: 26,
                  height: 30,
                  translate: '-50% 0',
                  backgroundColor: C.woodLo,
                  borderRadius: '4px 4px 0 0',
                }}
              />
            </Paper>

            {/* Motif tangan penjaga kertas di dinding kanan kantor yang memegang pangkal tali */}
            <div
              style={{
                position: 'absolute',
                left: 106,
                top: 74,
                width: 28,
                height: 20,
                backgroundColor: C.creamHi,
                border: `2px solid ${C.inkSoft}`,
                borderRadius: '4px 10px 10px 4px',
                boxShadow: '1px 3px 5px rgba(0,0,0,0.28)',
              }}
            >
              {/* Jari-jari lipatan kertas */}
              <div
                style={{
                  position: 'absolute',
                  right: 3,
                  top: 4,
                  width: 9,
                  height: 3,
                  backgroundColor: C.inkSoft,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 3,
                  top: 10,
                  width: 9,
                  height: 3,
                  backgroundColor: C.inkSoft,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        </Boil>

        {/* 2. DAPUR KERTAS di sisi kanan (tali tidak pernah sampai ke sini) */}
        <Boil seed="m06-kitchen" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 1158,
              top: 556,
              width: 136,
              height: 170,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={8}>
              {/* Cerobong ventilasi dapur */}
              <Slab
                x={84}
                y={0}
                w={22}
                h={32}
                color={C.metalLo}
                shade="#6B7477"
                shadeH={0.3}
                r={3}
              />
              <Slab x={80} y={0} w={30} h={8} color={C.inkSoft} r={3} />
              {/* Atap miring dapur sekolah */}
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 22,
                  width: 128,
                  height: 32,
                  backgroundColor: C.wood,
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                }}
              />
              {/* Dinding dapur */}
              <Slab
                x={12}
                y={52}
                w={112}
                h={118}
                color={C.creamHi}
                shade={C.creamLo}
                shadeH={0.14}
                r="2px 2px 4px 4px"
                grain={0.5}
              />
              {/* Loket pass-through dapur */}
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 72,
                  width: 84,
                  height: 46,
                  borderRadius: 4,
                  backgroundColor: '#4E6378',
                  border: `3px solid ${C.woodLo}`,
                }}
              />
              <Slab
                x={20}
                y={116}
                w={96}
                h={10}
                color={C.woodHi}
                shade={C.woodLo}
                shadeH={0.4}
                r={3}
              />
            </Paper>
          </div>
        </Boil>

        {/* 3. SEUTAS TALI PENGAWASAN YANG TERPUTUS DI TENGAH JALAN */}
        {extendU > 0.01 ? (
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'visible',
              filter: 'drop-shadow(1px 4px 5px rgba(0,0,0,0.28))',
            }}
          >
            {!isSnapped ? (
              <>
                {/* Tali tegang menjulur dari tangan kantor ke arah dapur */}
                <path
                  d={`M ${anchorX} ${anchorY} Q ${(anchorX + currentTipX) / 2} ${anchorY + 12} ${currentTipX} ${anchorY + 2}`}
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${anchorX} ${anchorY} Q ${(anchorX + currentTipX) / 2} ${anchorY + 12} ${currentTipX} ${anchorY + 2}`}
                  fill="none"
                  stroke={C.woodLo}
                  strokeWidth={3}
                  strokeDasharray="7 6"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {/* Potongan tali kiri yang menjuntai lemas dari kantor */}
                <path
                  d={`M ${anchorX} ${anchorY} Q ${anchorX + 42} ${anchorY + 28} ${leftEndX} ${leftEndY}`}
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${anchorX} ${anchorY} Q ${anchorX + 42} ${anchorY + 28} ${leftEndX} ${leftEndY}`}
                  fill="none"
                  stroke={C.woodLo}
                  strokeWidth={3}
                  strokeDasharray="7 6"
                  strokeLinecap="round"
                />
                {/* Serabut kertas terputus di ujung tali kiri */}
                <line
                  x1={leftEndX}
                  y1={leftEndY}
                  x2={leftEndX + 10}
                  y2={leftEndY + 9}
                  stroke={C.creamHi}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <line
                  x1={leftEndX}
                  y1={leftEndY}
                  x2={leftEndX - 6}
                  y2={leftEndY + 12}
                  stroke={C.amber}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* Potongan ujung tali yang putus dan jatuh di tengah jalan, jauh sebelum dapur */}
                <g
                  transform={`translate(${loosePieceX} ${loosePieceY}) rotate(${18 + snapDropU * 42})`}
                >
                  <path
                    d="M -18 -4 Q 0 6 20 -2"
                    fill="none"
                    stroke={C.amber}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                  <path
                    d="M -18 -4 Q 0 6 20 -2"
                    fill="none"
                    stroke={C.woodLo}
                    strokeWidth={3}
                    strokeDasharray="6 5"
                  />
                  <line
                    x1={-18}
                    y1={-4}
                    x2={-26}
                    y2={-10}
                    stroke={C.creamHi}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </g>
              </>
            )}
          </svg>
        ) : null}
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
  const closeU = interpolate(f, [M06_DUR - 10, M06_DUR], [0, 1], {
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

export const M06: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#D4D7D2'}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25} seed="m06-weave">
      <OrbitCamera
        dur={M06_DUR}
        yaw={15}
        drift={[-28, -6]}
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
          <Slab x={-140} y={554} w={1560} h={220} color="#E9E3D7" r={0} grain={0.5} />
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

          {/* Grafik lingkaran dari piring kertas + label BGN & rentang 80-90 persen */}
          <PlatePieChart />

          {/* Kotak makan utuh dan bersih yang diangkat */}
          <CleanSafeLunchbox />

          {/* Tali pengawasan dari kantor kertas yang terputus sebelum menyentuh dapur */}
          <OfficeToKitchenBrokenRope />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>

    <PaperFoldEdge />
    <GrainOverlay />
  </AbsoluteFill>
);