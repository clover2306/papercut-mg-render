// Adegan T07: Kalender Sebulan, Minggu Pertama dan Kedua — teater kertas halte pagi merekonstruksi percobaan sebulan.
// Menampilkan kalender empat lembar minggu, keramaian minggu pertama, bus penuh di minggu kedua, dan karcis lusuh dua cap.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {CutSeries, PopUpOpen} from '../../lib/paper/transitions';
import {Boil, Figure, FLOOR_Y, Paper, Pill, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const T07_DUR = 1010;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Mobil kertas kecil di jalur jalan kaki panggung (pengukur macet tanpa angka)
const PaperCar: React.FC<{
  x: number;
  y: number;
  color: string;
  shade: string;
  lifted?: number;
}> = ({x, y, color, shade, lifted = 0}) => {
  const liftY = interpolate(lifted, [0, 1], [0, -108], CLAMP);
  const tilt = interpolate(lifted, [0, 1], [0, -8], CLAMP);
  const stringOp = interpolate(lifted, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0.35], CLAMP);
  const carOp = interpolate(lifted, [0, 0.85, 1], [1, 0.85, 0.45], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + liftY,
        width: 86,
        height: 44,
        opacity: carOp,
        rotate: `${tilt}deg`,
      }}
    >
      {stringOp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 41,
            top: -120,
            width: 2,
            height: 124,
            backgroundColor: C.tape,
            opacity: stringOp,
          }}
        />
      ) : null}
      <Paper lift={3}>
        {/* Badan bawah mobil kertas */}
        <Slab x={4} y={16} w={78} h={20} color={color} shade={shade} shadeH={0.3} r={6} />
        {/* Atap mobil kertas */}
        <Slab x={18} y={4} w={46} h={16} color={color} hi={C.creamHi} hiH={0.2} r="8px 10px 2px 2px" />
        {/* Jendela polos + siluet pengemudi tanpa wajah */}
        <Slab x={23} y={7} w={18} h={10} color={C.creamHi} r={2} />
        <Slab x={44} y={7} w={16} h={10} color={C.creamHi} r={2} />
        <div
          style={{
            position: 'absolute',
            left: 47,
            top: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: C.inkSoft,
          }}
        />
        {/* Roda kertas */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 28,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: C.ink,
            border: `3px solid ${C.creamLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 28,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: C.ink,
            border: `3px solid ${C.creamLo}`,
          }}
        />
      </Paper>
    </div>
  );
};

// Jalur jalan di kaki panggung: barisan mobil kertas (rapat = macet, sebagian terangkat = agak lengang)
const RoadTrack: React.FC<{liftProgress: number; frame: number}> = ({liftProgress, frame}) => {
  const cars = [
    {baseX: 88, color: C.hero, shade: C.heroLo, lifts: false},
    {baseX: 192, color: ROOM.slate, shade: C.boardLo, lifts: true},
    {baseX: 296, color: C.brass, shade: C.brassLo, lifts: false},
    {baseX: 400, color: ROOM.teal, shade: C.boardLo, lifts: true},
    {baseX: 504, color: C.cap, shade: C.capLo, lifts: false},
    {baseX: 608, color: ROOM.terracotta, shade: C.heroLo, lifts: true},
    {baseX: 712, color: ROOM.sage, shade: C.sageLo, lifts: false},
    {baseX: 816, color: C.amber, shade: C.amberDim, lifts: true},
    {baseX: 920, color: ROOM.purple, shade: C.boardLo, lifts: false},
    {baseX: 1024, color: C.woodHi, shade: C.woodLo, lifts: false},
    {baseX: 1128, color: ROOM.dusk, shade: C.boardLo, lifts: false},
  ];

  const glide = interpolate(liftProgress, [0, 1], [0, 18], CLAMP);

  return (
    <div style={{position: 'absolute', left: 0, top: FLOOR_Y + 26, width: 1280, height: 84}}>
      {/* Rel tipis tempat barisan mobil kertas bergeser */}
      <Slab x={40} y={36} w={1200} h={14} color={C.board} shade={C.boardLo} shadeH={0.4} r={4} />
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 42,
          height: 2,
          borderTop: `2px dashed ${C.creamLo}`,
          opacity: 0.55,
        }}
      />
      {cars.map((car, idx) => {
        const stepShift = bob(frame, 48, 1.2, idx * 0.7);
        const carLift = car.lifts ? liftProgress : 0;
        const spreadOffset = !car.lifts ? (idx - 5) * glide * 0.35 : 0;
        return (
          <PaperCar
            key={idx}
            x={car.baseX + spreadOffset + stepShift}
            y={0}
            color={car.color}
            shade={car.shade}
            lifted={carLift}
          />
        );
      })}
    </div>
  );
};

// Halte bus kertas di sisi kiri panggung (polos tanpa tulisan)
const BusShelter: React.FC = () => (
  <div style={{position: 'absolute', left: 68, top: 268, width: 290, height: 332}}>
    <Paper lift={5}>
      {/* Tiang penyangga halte */}
      <Slab x={28} y={64} w={14} h={268} color={C.metalLo} r={3} />
      <Slab x={228} y={64} w={14} h={268} color={C.metalLo} r={3} />
      {/* Panel belakang halte */}
      <Slab x={38} y={84} w={194} h={176} color={C.cream} shade={C.creamLo} shadeH={0.15} r={4} />
      <Slab x={52} y={98} w={76} h={124} color="#BFD0D9" hi="#D9E6EC" hiH={0.25} r={3} />
      <Slab x={140} y={98} w={76} h={124} color="#BFD0D9" hi="#D9E6EC" hiH={0.25} r={3} />
      {/* Bangku tunggu halte */}
      <Slab x={48} y={268} w={174} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
      <Slab x={68} y={284} w={12} h={48} color={C.woodLo} r={2} />
      <Slab x={190} y={284} w={12} h={48} color={C.woodLo} r={2} />
      {/* Kanopi atap halte kertas */}
      <Slab x={8} y={36} w={258} h={34} color={C.hero} shade={C.heroLo} shadeH={0.35} hi={C.amber} hiH={0.18} r="12px 12px 4px 4px" />
      {/* Tiang tanda halte polos tanpa teks/angka */}
      <Slab x={268} y={92} w={8} h={240} color={C.inkSoft} r={2} />
      <Slab x={250} y={54} w={44} h={44} color={C.cap} shade={C.capLo} shadeH={0.3} r="50%" />
      {/* Ikon siluet bus polos pada rambu halte */}
      <Slab x={260} y={66} w={24} h={16} color={C.creamHi} r={3} />
    </Paper>
  </div>
);

// Kantor kertas di sisi kanan panggung dengan pintu geser yang bisa menutup
const PaperOffice: React.FC<{doorClose: number}> = ({doorClose}) => {
  const closePx = Math.round(interpolate(doorClose, [0, 1], [0, 32], CLAMP));
  return (
    <div style={{position: 'absolute', left: 952, top: 214, width: 244, height: 386}}>
      <Paper lift={5}>
        {/* Gedung kantor kertas */}
        <Slab x={16} y={24} w={212} h={362} color={C.cream} shade={C.creamLo} shadeH={0.12} r="6px 6px 0 0" />
        <Slab x={8} y={10} w={228} h={22} color={C.board} shade={C.boardLo} shadeH={0.4} r={4} />
        {/* Jendela-jendela polos */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <Slab
              key={`${row}-${col}`}
              x={38 + col * 60}
              y={54 + row * 64}
              w={44}
              h={44}
              color={doorClose > 0.6 ? ROOM.slate : '#C7D8E2'}
              hi={C.creamHi}
              hiH={0.2}
              r={3}
            />
          )),
        )}
        {/* Bingkai pintu kantor di lantai dasar */}
        <Slab x={56} y={256} w={132} h={130} color={C.boardLo} r="4px 4px 0 0" />
        {/* Daun pintu kiri dan kanan yang menutup pada Beat 3 */}
        <Slab
          x={60}
          y={260}
          w={30 + closePx}
          h={126}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.25}
          r={2}
        />
        <Slab
          x={154 - closePx}
          y={260}
          w={30 + closePx}
          h={126}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.25}
          r={2}
        />
        {/* Palang pintu tertutup */}
        {doorClose > 0.75 ? (
          <Slab x={96} y={316} w={52} h={12} color={C.nogo} shade={C.nogoDim} shadeH={0.3} r={4} />
        ) : null}
      </Paper>
    </div>
  );
};

// Bus kertas yang menggembung penuh di Minggu Kedua (tanpa nomor/tulisan)
const BulgingPaperBus: React.FC<{enterProgress: number; bulge: number; frame: number}> = ({
  enterProgress,
  bulge,
  frame,
}) => {
  if (enterProgress <= 0.01) return null;
  const x = interpolate(enterProgress, [0, 1], [-420, 88], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const breath = bob(frame, 28, 2.5, 0.3) * bulge;
  const roofLift = Math.round(bulge * 16 + Math.max(0, breath));
  const sideSwell = Math.round(bulge * 10);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 368 - roofLift,
        width: 356 + sideSwell * 2,
        height: 228 + roofLift,
      }}
    >
      <Paper lift={6}>
        {/* Atap melengkung menggembung karena penuh */}
        <Slab
          x={14}
          y={0}
          w={328 + sideSwell * 2}
          h={42 + roofLift}
          color={C.amber}
          hi={C.sparkYellow}
          hiH={0.35}
          r="50% 50% 8px 8px / 85% 85% 12px 12px"
        />
        {/* Badan utama bus kertas */}
        <Slab
          x={0}
          y={24 + Math.round(roofLift * 0.45)}
          w={356 + sideSwell * 2}
          h={168}
          color={C.amber}
          shade={C.amberDim}
          shadeH={0.22}
          r="18px 22px 10px 10px"
        />
        {/* Pita dekorasi samping polos */}
        <Slab
          x={6}
          y={132 + Math.round(roofLift * 0.45)}
          w={344 + sideSwell * 2}
          h={18}
          color={C.creamHi}
          r={4}
        />
        {/* Deretan jendela penuh sesak oleh siluet kepala tanpa wajah */}
        {[0, 1, 2, 3].map((wIdx) => (
          <div
            key={wIdx}
            style={{
              position: 'absolute',
              left: 24 + wIdx * 78,
              top: 44 + Math.round(roofLift * 0.45),
              width: 66,
              height: 74,
              borderRadius: 8,
              backgroundColor: C.creamHi,
              border: `3px solid ${C.woodLo}`,
              overflow: 'hidden',
            }}
          >
            {/* Siluet penumpang berdesakan di balik jendela (tanpa wajah) */}
            {[-2, 18, 38].map((hx, hIdx) => (
              <div key={hIdx}>
                <div
                  style={{
                    position: 'absolute',
                    left: hx,
                    top: 10 + (hIdx % 2) * 6,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: hIdx === 1 ? C.inkSoft : C.creamLo,
                    border: `2px solid ${C.ink}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: hx - 3,
                    top: 36 + (hIdx % 2) * 5,
                    width: 32,
                    height: 36,
                    borderRadius: 6,
                    backgroundColor: [ROOM.navy, ROOM.terracotta, ROOM.teal][(wIdx + hIdx) % 3],
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        {/* Roda bus */}
        <div
          style={{
            position: 'absolute',
            left: 52,
            top: 170 + Math.round(roofLift * 0.45),
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: C.ink,
            border: `8px solid ${C.creamLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 254 + sideSwell,
            top: 170 + Math.round(roofLift * 0.45),
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: C.ink,
            border: `8px solid ${C.creamLo}`,
          }}
        />
      </Paper>
    </div>
  );
};

// Kalender sobek besar dengan 4 lembar minggu berjajar seperti tab
const TearCalendar: React.FC<{
  dropProgress: number;
  week1Open: number;
  showWeek1Label: boolean;
  week1Tear: number;
  showWeek2Label: boolean;
  week2HalfTear: number;
}> = ({
  dropProgress,
  week1Open,
  showWeek1Label,
  week1Tear,
  showWeek2Label,
  week2HalfTear,
}) => {
  const calY = interpolate(dropProgress, [0, 1], [-360, 74], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const tabSpread = interpolate(week1Open, [0, 1], [0, 1], CLAMP);

  // Posisi lembar pertama saat disobek ke samping kiri agar tetap terbaca utuh dan tidak menghalangi Minggu kedua maupun bilah Sebulan
  const w1X = interpolate(week1Tear, [0, 1], [0, -324], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const w1Y = interpolate(week1Tear, [0, 1], [0, 20], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const w1Rot = interpolate(week1Tear, [0, 1], [0, -4], CLAMP);
  const w1Scale = interpolate(week1Tear, [0, 1], [1, 0.72], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Lembar kedua setengah tersobek dan ditahan pada Beat 4
  const w2Rot = interpolate(week2HalfTear, [0, 1], [0, 6.5], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const w2Drop = interpolate(week2HalfTear, [0, 1], [0, 16], CLAMP);

  return (
    <div style={{position: 'absolute', left: 392, top: calY, width: 456, height: 312}}>
      {/* Dua tali penggantung dari langit-langit panggung */}
      <div style={{position: 'absolute', left: 108, top: -380, width: 4, height: 396, backgroundColor: C.tape}} />
      <div style={{position: 'absolute', left: 344, top: -380, width: 4, height: 396, backgroundColor: C.tape}} />

      {/* Bingkai putus-putus penanda ilustrasi andai-andai */}
      <div
        style={{
          position: 'absolute',
          left: -18,
          top: -14,
          width: 492,
          height: 318,
          borderRadius: 18,
          border: `3px dashed ${C.tape}`,
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />

      {/* Empat lembar minggu berjajar seperti tab di sisi kanan & bawah kalender (tanpa digit) */}
      {[3, 2, 1, 0].map((tabIdx) => {
        const offsetX = (tabIdx + 1) * 14 * tabSpread;
        const offsetY = (tabIdx + 1) * 8 * tabSpread;
        const tabColors = [C.creamHi, C.cream, C.creamLo, '#B0A18F'];
        return (
          <Paper key={tabIdx} lift={3}>
            <Slab
              x={28 + offsetX}
              y={58 + offsetY}
              w={372}
              h={206}
              color={tabColors[tabIdx]}
              shade={C.creamLo}
              shadeH={0.12}
              r={8}
            >
              {/* Tab penanda lembar minggu di sisi kanan (polos tanpa angka) */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 18 + tabIdx * 42,
                  width: 26,
                  height: 34,
                  backgroundColor: [C.amber, C.tag, ROOM.teal, ROOM.slate][tabIdx],
                  borderRadius: '4px 0 0 4px',
                }}
              />
            </Slab>
          </Paper>
        );
      })}

      {/* Lembar Minggu Kedua (terbuka saat lembar pertama disobek, lalu setengah tersobek & ditahan di Beat 4) */}
      {showWeek2Label ? (
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 56 + w2Drop,
            width: 376,
            height: 208,
            transformOrigin: '16px 0px',
            rotate: `${w2Rot}deg`,
          }}
        >
          <Paper lift={5} torn>
            <Slab x={0} y={0} w={376} h={208} color={C.creamHi} shade={C.creamLo} shadeH={0.14} r={6}>
              {/* Garis perforasi sobekan atas */}
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  top: 10,
                  borderTop: `3px dashed ${C.inkSoft}`,
                  opacity: 0.45,
                }}
              />
              {/* Kotak-kotak hari kalender polos tanpa angka */}
              <div style={{position: 'absolute', left: 26, top: 124, display: 'flex', gap: 12}}>
                {Array.from({length: 7}).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 36,
                      height: 28,
                      borderRadius: 4,
                      backgroundColor: C.cream,
                      border: `2px solid ${C.creamLo}`,
                    }}
                  />
                ))}
              </div>
            </Slab>
          </Paper>
          {/* Celah sobekan setengah di sisi kanan atas saat Beat 4 */}
          {week2HalfTear > 0.05 ? (
            <div
              style={{
                position: 'absolute',
                right: -6,
                top: -8,
                width: 68,
                height: 28,
                backgroundColor: C.tape,
                rotate: '-14deg',
                filter: 'url(#torn)',
              }}
            />
          ) : null}
          <Tag
            x={188}
            y={46}
            text="Minggu kedua"
            at={0}
            bg={ROOM.slate}
            color={C.creamHi}
            size={34}
            rot={-1}
            seed="minggu-kedua"
          />
        </div>
      ) : null}

      {/* Lembar Minggu Pertama (terbuka di Beat 1, ditempel label di Beat 2, disobek di Beat 3) */}
      <div
        style={{
          position: 'absolute',
          left: 24 + w1X,
          top: 56 + w1Y,
          width: 376,
          height: 208,
          transformOrigin: '0% 0%',
          rotate: `${w1Rot}deg`,
          scale: String(w1Scale),
        }}
      >
        <Paper lift={6} torn={week1Tear > 0.1}>
          <Slab x={0} y={0} w={376} h={208} color={C.creamHi} shade={C.creamLo} shadeH={0.12} r={6}>
            <div
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: 10,
                borderTop: `3px dashed ${C.inkSoft}`,
                opacity: 0.45,
              }}
            />
            {/* Kotak-kotak hari kalender polos tanpa angka */}
            <div style={{position: 'absolute', left: 26, top: 124, display: 'flex', gap: 12}}>
              {Array.from({length: 7}).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 28,
                    borderRadius: 4,
                    backgroundColor: C.sparkYellow,
                    opacity: 0.45,
                    border: `2px solid ${C.brass}`,
                  }}
                />
              ))}
            </div>
          </Slab>
        </Paper>
        {showWeek1Label ? (
          <Tag
            x={188}
            y={46}
            text="Minggu pertama"
            at={0}
            bg={C.go}
            color={C.creamHi}
            size={34}
            rot={-1.5}
            seed="minggu-pertama"
          />
        ) : null}
      </div>

      {/* Punggung jilid atas kalender berlabel "Sebulan" */}
      <Paper lift={7}>
        <Slab x={10} y={0} w={404} h={64} color={C.wood} shade={C.woodLo} shadeH={0.35} hi={C.woodHi} hiH={0.18} r={8} />
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 14,
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `3px solid ${C.woodLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 314,
            top: 14,
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: C.brass,
            border: `3px solid ${C.woodLo}`,
          }}
        />
      </Paper>
      <Pill x={212} y={32} text="Sebulan" bg={C.creamHi} color={C.ink} size={32} />
    </div>
  );
};

// Serpihan kertas perayaan di halte pada Minggu Pertama
const ConfettiPieces: React.FC<{opacity: number; frame: number}> = ({opacity, frame}) => {
  if (opacity <= 0.01) return null;
  const pieces = [
    {x: 110, y: 210, c: C.sparkYellow, r: 18},
    {x: 165, y: 185, c: C.sparkPink, r: -24},
    {x: 225, y: 220, c: C.go, r: 15},
    {x: 285, y: 195, c: C.amber, r: -18},
    {x: 340, y: 235, c: C.cap, r: 28},
    {x: 140, y: 260, c: C.tag, r: -12},
    {x: 260, y: 250, c: C.sparkYellow, r: 22},
    {x: 318, y: 275, c: C.sparkPink, r: -26},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
      {pieces.map((p, i) => {
        const driftY = ((frame * 1.4 + i * 23) % 90) - 30;
        const swayX = Math.sin((frame + i * 17) * 0.08) * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + swayX,
              top: p.y + driftY,
              width: 16,
              height: 10,
              borderRadius: 2,
              backgroundColor: p.c,
              rotate: `${p.r + frame * 1.5}deg`,
              boxShadow: '1px 2px 3px rgba(0,0,0,0.2)',
            }}
          />
        );
      })}
    </div>
  );
};

// Siluet pencoba tanpa wajah (postur tertegun menghitung ulang) + karcis lusuh dengan dua cap
const TesterAndTicket: React.FC<{
  enter: number;
  stamp1At: number;
  stamp2At: number;
  frame: number;
}> = ({enter, stamp1At, stamp2At, frame}) => {
  if (enter <= 0.01) return null;
  const slideY = interpolate(enter, [0, 1], [120, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const headTilt = interpolate(enter, [0, 1], [0, 10], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: slideY,
        width: 1280,
        height: 720,
        opacity: enter,
      }}
    >
      {/* Siluet pencoba di sisi kiri-tengah, menatap karcis dengan postur tertegun (tanpa wajah) */}
      <div style={{position: 'absolute', left: 378, top: FLOOR_Y - 6, width: 130, height: 220, translate: '-50% -100%'}}>
        <Paper lift={6}>
          {/* Kaki */}
          <Slab x={38} y={158} w={22} h={56} color={C.inkSoft} r={6} />
          <Slab x={68} y={158} w={22} h={56} color={C.inkSoft} r={6} />
          {/* Badan rapi bermartabat */}
          <Slab x={28} y={68} w={72} h={94} color={ROOM.navy} shade={C.boardLo} shadeH={0.22} r={12} />
          {/* Tas kerja di samping */}
          <Slab x={8} y={124} w={34} h={28} color={C.wood} shade={C.woodLo} shadeH={0.3} r={5} rot={-6} />
          {/* Lengan kiri memegang karcis, lengan kanan terangkat menghitung ulang */}
          <Slab x={84} y={88} w={48} h={16} color={ROOM.navy} r={8} rot={-14} />
          <Slab
            x={16}
            y={74 + bob(frame, 42, 2, 1)}
            w={42}
            h={15}
            color={ROOM.navy}
            r={8}
            rot={-42}
          />
          {/* Kepala bulat polos TANPA WAJAH, miring tertegun */}
          <div
            style={{
              position: 'absolute',
              left: 36,
              top: 6,
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `3px solid ${C.inkSoft}`,
              rotate: `${headTilt}deg`,
            }}
          />
        </Paper>
      </div>

      {/* Karcis kertas besar yang lusuh di tengah-bawah panggung (tidak menutupi kalender) */}
      <div style={{position: 'absolute', left: 454, top: 356, width: 452, height: 214}}>
        <Paper lift={8} torn>
          <Slab
            x={0}
            y={0}
            w={452}
            h={214}
            color={C.creamLo}
            shade="#A59683"
            shadeH={0.22}
            hi={C.cream}
            hiH={0.12}
            r={12}
            rot={-1.5}
          >
            {/* Takik karcis di kiri dan kanan */}
            <div
              style={{
                position: 'absolute',
                left: -18,
                top: 88,
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: C.floor,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -18,
                top: 88,
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: C.floor,
              }}
            />
            {/* Garis lipatan lusuh dan noda kertas tua tanpa kata tambahan */}
            <div
              style={{
                position: 'absolute',
                left: 36,
                right: 36,
                top: 24,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#9C8D7B',
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#8E7F6D',
                opacity: 0.45,
                rotate: '7deg',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 310,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#8E7F6D',
                opacity: 0.4,
                rotate: '-5deg',
              }}
            />
          </Slab>
        </Paper>

        {/* Cap pertama: "Gratis, tetapi lama" */}
        <Tag
          x={226}
          y={26}
          text="Gratis, tetapi lama"
          at={stamp1At}
          bg={C.tag}
          color={C.tagText}
          size={31}
          rot={-2.5}
          seed="cap-lama"
        />

        {/* Cap kedua: "Gratis, tetapi tidak pasti" */}
        <Tag
          x={226}
          y={112}
          text="Gratis, tetapi tidak pasti"
          at={stamp2At}
          bg={C.ink}
          color={C.creamHi}
          size={31}
          rot={1.5}
          seed="cap-tidak-pasti"
        />
      </div>
    </div>
  );
};

// Bingkai tirai teater kertas di tepi kiri, kanan, dan atas panggung
const TheaterFrame: React.FC = () => (
  <>
    <Paper lift={9}>
      <Slab x={-24} y={-16} w={78} h={752} color={ROOM.terracotta} shade="#6F321F" shadeH={0.2} r={0} />
      <Slab x={1226} y={-16} w={78} h={752} color={ROOM.terracotta} shade="#6F321F" shadeH={0.2} r={0} />
      <Slab x={-24} y={-18} w={1328} h={42} color="#853B25" shade="#5D2616" shadeH={0.35} r={0} />
      <Slab x={-24} y={20} w={1328} h={6} color={C.brass} r={0} />
    </Paper>
  </>
);

// Komponen panggung bersama untuk semua beat agar ruangan konsisten dan kumulatif
const HalteStageView: React.FC<{
  dur: number;
  yaw: number;
  push: number;
  drift: [number, number];
  skyWarmth: number;
  calDrop: number;
  week1Open: number;
  showWeek1Label: boolean;
  week1Tear: number;
  showWeek2Label: boolean;
  week2HalfTear: number;
  crowdHalte: number;
  confettiOp: number;
  roadLift: number;
  busEnter: number;
  busBulge: number;
  doorClose: number;
  strandedCrowd: number;
  testerEnter: number;
  stamp1At: number;
  stamp2At: number;
}> = ({
  dur,
  yaw,
  push,
  drift,
  skyWarmth,
  calDrop,
  week1Open,
  showWeek1Label,
  week1Tear,
  showWeek2Label,
  week2HalfTear,
  crowdHalte,
  confettiOp,
  roadLift,
  busEnter,
  busBulge,
  doorClose,
  strandedCrowd,
  testerEnter,
  stamp1At,
  stamp2At,
}) => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera dur={dur} yaw={yaw} push={push} drift={drift} origin={[640, 540]} focus={0.45} depth={680}>
          {/* Lapisan 0: Latar panggung halte pagi */}
          <Depth z={0.08} cover>
            <Slab
              x={-80}
              y={-60}
              w={1440}
              h={840}
              color={skyWarmth > 0.5 ? C.creamHi : C.cream}
              shade={C.creamLo}
              shadeH={0.28}
              r={0}
              grain={0.55}
            />
            {/* Cahaya pagi hangat di bagian atas panggung */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 50% 34%, rgba(245, 197, 66, ${(0.22 * skyWarmth).toFixed(2)}) 0%, rgba(255,255,255,0) 58%, rgba(0,0,0,0.22) 100%)`,
              }}
            />
            {/* Siluet kota kertas abstrak di kejauhan tanpa tulisan */}
            <Slab x={120} y={340} w={96} h={260} color={C.creamLo} r={4} />
            <Slab x={230} y={380} w={84} h={220} color="#C9BDAD" r={4} />
            <Slab x={790} y={356} w={110} h={244} color="#C9BDAD" r={4} />
          </Depth>

          {/* Lapisan 1: Lantai panggung, halte kiri, kantor kanan, kalender tengah, siluet tokoh */}
          <Depth z={0.45}>
            {/* Lantai panggung */}
            <Slab x={-80} y={FLOOR_Y} w={1440} h={160} color={C.floor} r={0} grain={0.6} />
            <Slab x={-80} y={FLOOR_Y - 22} w={1440} h={26} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

            {/* Halte bus di kiri dan kantor kertas di kanan */}
            <BusShelter />
            <PaperOffice doorClose={doorClose} />

            {/* Kerumunan siluet di halte saat Minggu Pertama (penuh sesak & meriah) */}
            {crowdHalte > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, opacity: crowdHalte}}>
                <SlideIn at={0} dx={-30} dur={18}>
                  <Figure x={112} y={FLOOR_Y - 4} s={0.82} shirt={ROOM.teal} />
                  <Figure x={164} y={FLOOR_Y - 2} s={0.86} shirt={C.hero} />
                  <Figure x={218} y={FLOOR_Y - 6} s={0.84} shirt={ROOM.navy} />
                  <Figure x={272} y={FLOOR_Y - 2} s={0.85} shirt={ROOM.mustard} />
                  <Figure x={324} y={FLOOR_Y - 4} s={0.8} shirt={ROOM.purple} />
                </SlideIn>
              </div>
            ) : (
              /* Satu siluet penonton di awal Beat 1 */
              <Figure x={216} y={FLOOR_Y - 4} s={0.86} shirt={ROOM.dusk} />
            )}

            {/* Serpihan kertas perayaan pada Minggu Pertama */}
            <ConfettiPieces opacity={confettiOp} frame={f} />

            {/* Bus kertas menggembung penuh pada Minggu Kedua */}
            <BulgingPaperBus enterProgress={busEnter} bulge={busBulge} frame={f} />

            {/* Siluet tertinggal di trotoar & pekerja tiba di depan pintu kantor yang sudah menutup */}
            {strandedCrowd > 0.01 ? (
              <div style={{position: 'absolute', inset: 0, opacity: strandedCrowd}}>
                {/* Siluet tertinggal di trotoar dekat bus */}
                <Figure x={42} y={FLOOR_Y - 2} s={0.82} shirt={ROOM.slate} />
                <Figure x={88} y={FLOOR_Y} s={0.84} shirt={ROOM.terracotta} />
                {/* Siluet pekerja bertas kerja dan pelajar di depan kantor yang pintunya menutup */}
                <Figure x={918} y={FLOOR_Y - 2} s={0.85} shirt={ROOM.khaki} />
                <Figure x={974} y={FLOOR_Y} s={0.84} shirt={ROOM.navy} />
                {/* Tas kerja kertas pada siluet di depan kantor */}
                <Paper lift={3}>
                  <Slab x={944} y={FLOOR_Y - 68} w={26} h={20} color={C.wood} shade={C.woodLo} shadeH={0.3} r={4} />
                </Paper>
              </div>
            ) : null}

            {/* Kalender kertas besar di tengah-atas panggung */}
            <Boil seed="kalender-sebulan" amp={0.4} rot={0.05}>
              <TearCalendar
                dropProgress={calDrop}
                week1Open={week1Open}
                showWeek1Label={showWeek1Label}
                week1Tear={week1Tear}
                showWeek2Label={showWeek2Label}
                week2HalfTear={week2HalfTear}
              />
            </Boil>
          </Depth>

          {/* Lapisan 2: Depan panggung — karcis lusuh dengan dua cap (Beat 4), jalur mobil, dan tirai */}
          <Depth z={0.78}>
            <TesterAndTicket
              enter={testerEnter}
              stamp1At={stamp1At}
              stamp2At={stamp2At}
              frame={f}
            />
            <RoadTrack liftProgress={roadLift} frame={f} />
            <TheaterFrame />
            {/* Label sudut dekorasi polos tanpa teks (hanya pita lakban sudut kertas) */}
            <PopIn at={0}>
              <div
                style={{
                  position: 'absolute',
                  top: 28,
                  right: 68,
                  width: 84,
                  height: 24,
                  rotate: '3deg',
                  backgroundColor: C.tape,
                  opacity: 0.75,
                  filter: 'url(#torn)',
                  fontFamily: FONT.label,
                }}
              />
            </PopIn>
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

// BEAT 1 (scene 101-102, 220f): Kalender kertas besar turun dari tali berlabel "Sebulan", empat lembar minggu berjajar, lembar pertama terbuka
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const calDrop = interpolate(f, [8, 72], [0, 1], CLAMP);
  const week1Open = interpolate(f, [76, 148], [0, 1], CLAMP);

  return (
    <PopUpOpen dur={20}>
      <HalteStageView
        dur={220}
        yaw={12}
        push={1.07}
        drift={[14, -8]}
        skyWarmth={1}
        calDrop={calDrop}
        week1Open={week1Open}
        showWeek1Label={false}
        week1Tear={0}
        showWeek2Label={false}
        week2HalfTear={0}
        crowdHalte={0}
        confettiOp={0}
        roadLift={0}
        busEnter={0}
        busBulge={0}
        doorClose={0}
        strandedCrowd={0}
        testerEnter={0}
        stamp1At={9999}
        stamp2At={9999}
      />
    </PopUpOpen>
  );
};

// BEAT 2 (scene 103-106, 280f): Label "Minggu pertama" ditempel, halte penuh sesak + serpihan perayaan, sebagian mobil terangkat
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const crowdHalte = interpolate(f, [14, 48], [0, 1], CLAMP);
  const confettiOp = interpolate(f, [24, 56], [0, 1], CLAMP);
  const roadLift = interpolate(f, [72, 168], [0, 1], CLAMP);

  return (
    <HalteStageView
      dur={280}
      yaw={-14}
      push={1.08}
      drift={[-18, 6]}
      skyWarmth={1}
      calDrop={1}
      week1Open={1}
      showWeek1Label={f >= 10}
      week1Tear={0}
      showWeek2Label={false}
      week2HalfTear={0}
      crowdHalte={crowdHalte}
      confettiOp={confettiOp}
      roadLift={roadLift}
      busEnter={0}
      busBulge={0}
      doorClose={0}
      strandedCrowd={0}
      testerEnter={0}
      stamp1At={9999}
      stamp2At={9999}
    />
  );
};

// BEAT 3 (scene 107-109, 260f): Lembar pertama disobek, "Minggu kedua" terbuka, bus menggembung penuh, siluet tertinggal & pintu kantor menutup
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const week1Tear = interpolate(f, [8, 52], [0, 1], CLAMP);
  const confettiOp = interpolate(f, [0, 32], [1, 0], CLAMP);
  const crowdHalte = interpolate(f, [20, 64], [1, 0.25], CLAMP);
  const busEnter = interpolate(f, [36, 96], [0, 1], CLAMP);
  const busBulge = interpolate(f, [84, 152], [0, 1], CLAMP);
  const strandedCrowd = interpolate(f, [92, 136], [0, 1], CLAMP);
  const doorClose = interpolate(f, [118, 176], [0, 1], CLAMP);

  return (
    <HalteStageView
      dur={260}
      yaw={14}
      push={1.08}
      drift={[16, 8]}
      skyWarmth={interpolate(f, [0, 90], [1, 0.35], CLAMP)}
      calDrop={1}
      week1Open={1}
      showWeek1Label
      week1Tear={week1Tear}
      showWeek2Label={f >= 18}
      week2HalfTear={0}
      crowdHalte={crowdHalte}
      confettiOp={confettiOp}
      roadLift={1}
      busEnter={busEnter}
      busBulge={busBulge}
      doorClose={doorClose}
      strandedCrowd={strandedCrowd}
      testerEnter={0}
      stamp1At={9999}
      stamp2At={9999}
    />
  );
};

// BEAT 4 (scene 110-112, 250f): Siluet pencoba memegang karcis lusuh, dua cap jatuh berurutan, lembar minggu kedua setengah tersobek ditahan
const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const testerEnter = interpolate(f, [8, 42], [0, 1], CLAMP);
  const week2HalfTear = interpolate(f, [110, 165], [0, 1], CLAMP);

  return (
    <HalteStageView
      dur={250}
      yaw={-12}
      push={1.08}
      drift={[-12, -10]}
      skyWarmth={0.25}
      calDrop={1}
      week1Open={1}
      showWeek1Label
      week1Tear={1}
      showWeek2Label
      week2HalfTear={week2HalfTear}
      crowdHalte={0.25}
      confettiOp={0}
      roadLift={1}
      busEnter={1}
      busBulge={1}
      doorClose={1}
      strandedCrowd={1}
      testerEnter={testerEnter}
      stamp1At={56}
      stamp2At={118}
    />
  );
};

const SCENES = [
  {id: 'T07B1', component: Beat1, durationInFrames: 220},
  {id: 'T07B2', component: Beat2, durationInFrames: 280},
  {id: 'T07B3', component: Beat3, durationInFrames: 260},
  {id: 'T07B4', component: Beat4, durationInFrames: 250},
];

export const T07: React.FC = () => (
  <CutSeries
    scenes={SCENES}
    cuts={{
      T07B2: {kind: 'pageTurn', style: 'curl', from: 'bottom', align: 'mid'},
      T07B3: {kind: 'tearAway', x: 640, align: 'mid'},
      T07B4: {kind: 'stampCut', x: 640, y: 360, align: 'mid'},
    }}
  />
);
