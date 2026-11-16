// M07 (Scene 050-058, 189,76-220,38 dtk, 918 frame): laporan merayap di meja bertingkat dan dua jalur terpisah.
// Warung kosong tanpa pelanggan dan laporan merayap ke meja yang tepat, lalu jalur uang dan makanan terpisah tanpa tombol berhenti bagi anak.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab, SlideIn} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerArrow, MarkerCircle} from '../../lib/paper/proof';
import {CutScene, CutSeries, CutSpec} from '../../lib/paper/transitions';

export const M07_DUR = 918;

const BEAT1_DUR = 442;
const BEAT2_DUR = 476;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const SharedRoomBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-80} w={1520} h={880} color="#D4D1C9" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 34% 32%, rgba(255,250,238,0.26) 0%, rgba(255,255,255,0) 56%, rgba(0,0,0,0.25) 100%)',
      }}
    />
    <Slab x={-120} y={316} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={332} w={1520} h={240} color="#C0BDB4" r={0} grain={0.55} />
    <Window x={36} y={48} w={184} h={224} night={false} />
    <Corkboard x={1006} y={54} w={214} h={136} />
    <Sticky x={1030} y={80} s={32} color="#E6D7A8" rot={-3} />
    <Sticky x={1080} y={86} s={30} color="#D8DFD5" rot={2} />
    <Sticky x={1130} y={78} s={32} color="#E6D7A8" rot={-1} />
    <Shelf x={1004} y={272} w={218} books={3} />
    <Plant x={1156} y={258} s={0.5} />
  </AbsoluteFill>
);

const EmptyWarungCounter: React.FC = () => {
  const f = useCurrentFrame();

  // Laci kasir terbuka perlahan pada kalimat "Tidak ada kasir yang sepi" (f=98..134)
  const drawerOpenU = interpolate(f, [98, 134], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const drawerSlide = drawerOpenU * 44;

  return (
    <PopIn at={6} origin="50% 100%">
      <div style={{position: 'absolute', inset: 0}}>
        {/* Pintu warung kosong di sisi paling kiri (tidak ada pelanggan keluar-masuk) */}
        <Paper lift={5}>
          <Slab x={34} y={348} w={54} h={214} color={C.woodLo} shade={C.ink} shadeH={0.2} r="6px 6px 0 0" />
          <Slab x={42} y={358} w={38} h={196} color="#A6A39B" r="4px 4px 0 0" />
          {/* Daun pintu setengah terbuka diam tanpa gerak pelanggan */}
          <Slab x={44} y={418} w={28} h={94} color={C.wood} shade={C.woodLo} shadeH={0.3} r={3} />
          {/* Keset pintu kosong */}
          <Slab x={30} y={554} w={64} h={10} color={C.amberDim} r={3} />
        </Paper>

        {/* Meja kasir & etalase warung makan yang kini lengang */}
        <Boil seed="m07-warung-desk" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 224,
              top: 562,
              width: 244,
              height: 256,
              translate: '-50% -100%',
            }}
          >
            {/* Etalase kaca kosong di sisi kiri meja warung */}
            <Paper lift={7}>
              <Slab
                x={12}
                y={46}
                w={96}
                h={94}
                color="#DCE3E0"
                shade="#B4BFBC"
                shadeH={0.14}
                r="6px 6px 2px 2px"
              />
              {/* Rak dalam etalase yang kosong melompong */}
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 76,
                  width: 84,
                  height: 4,
                  backgroundColor: C.woodLo,
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 108,
                  width: 84,
                  height: 4,
                  backgroundColor: C.woodLo,
                  opacity: 0.6,
                }}
              />
              {/* Garis pantulan kaca */}
              <div
                style={{
                  position: 'absolute',
                  left: 28,
                  top: 56,
                  width: 6,
                  height: 70,
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  rotate: '14deg',
                }}
              />
            </Paper>

            {/* Mesin kasir kertas di atas meja warung */}
            <Paper lift={9}>
              {/* Layar kecil mesin kasir kosong tanpa angka */}
              <Slab x={156} y={32} w={46} h={24} color={C.board} shade={C.boardLo} shadeH={0.3} r={4} />
              <Slab x={162} y={37} w={34} h={14} color="#4A5256" r={2} />
              <Slab x={174} y={56} w={10} h={12} color={C.metalLo} r={2} />

              {/* Badan mesin kasir */}
              <Slab
                x={126}
                y={66}
                w={96}
                h={48}
                color={C.metal}
                shade={C.metalLo}
                shadeH={0.28}
                r="8px 8px 3px 3px"
              />
              {/* Deretan tombol kertas polos tanpa angka */}
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      position: 'absolute',
                      left: 138 + col * 16,
                      top: 74 + row * 10,
                      width: 11,
                      height: 6,
                      borderRadius: 2,
                      backgroundColor: C.creamHi,
                    }}
                  />
                )),
              )}

              {/* Dudukan bawah mesin kasir */}
              <Slab x={122} y={114} w={104} h={26} color={C.inkSoft} shade={C.ink} shadeH={0.3} r={3} />

              {/* Laci kasir terbuka kosong tanpa isi */}
              <div
                style={{
                  position: 'absolute',
                  left: 126 + drawerSlide,
                  top: 117,
                  width: 96,
                  height: 20,
                  backgroundColor: C.woodHi,
                  border: `2px solid ${C.ink}`,
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '3px 4px 7px rgba(0,0,0,0.32)',
                }}
              >
                {/* Sekat dalam laci kasir yang kosong */}
                <div
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 12,
                    top: 3,
                    bottom: 3,
                    backgroundColor: '#3B281C',
                    borderRadius: 2,
                  }}
                />
                {/* Pegangan laci */}
                <div
                  style={{
                    position: 'absolute',
                    right: 3,
                    top: 6,
                    width: 4,
                    height: 8,
                    backgroundColor: C.brass,
                    borderRadius: 2,
                  }}
                />
              </div>
            </Paper>

            {/* Badan meja kayu warung */}
            <Paper lift={8}>
              <Slab x={0} y={140} w={244} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={4} />
              <Slab
                x={10}
                y={156}
                w={224}
                h={100}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.18}
                r="0 0 6px 6px"
                grain={0.5}
              />
              {/* Panel kayu dekoratif depan meja */}
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 172,
                  width: 192,
                  height: 68,
                  border: `3px solid ${C.woodLo}`,
                  borderRadius: 4,
                  opacity: 0.65,
                }}
              />
            </Paper>
          </div>
        </Boil>
      </div>
    </PopIn>
  );
};

const SteppedDesksAndCrawlingReport: React.FC = () => {
  const f = useCurrentFrame();

  // Empat meja kertas disusun seperti tangga menuju "meja yang tepat" di ujung kanan atas
  const steps = [
    {x: 446, topY: 500, w: 128, label: false},
    {x: 614, topY: 446, w: 128, label: false},
    {x: 782, topY: 392, w: 128, label: false},
    {x: 1004, topY: 338, w: 226, label: true},
  ];

  // Gerak merayap selembar laporan kertas: berjalan sendirian, melambat setiap menyentuh satu meja,
  // sampai tiba di "meja yang tepat" di ujung (f=228..392)
  const reportX = interpolate(
    f,
    [228, 256, 272, 298, 314, 340, 356, 384, 398],
    [318, 446, 456, 614, 624, 782, 792, 944, 956],
    CLAMP,
  );
  const reportY = interpolate(
    f,
    [228, 242, 256, 272, 285, 298, 314, 327, 340, 356, 370, 384, 398],
    [422, 464, 500, 500, 466, 446, 446, 412, 392, 392, 358, 338, 338],
    CLAMP,
  );

  // Gerak ulat kertas (melengkung saat merayap, melandai saat melambat menyentuh meja)
  const isMoving =
    (f >= 228 && f <= 256) ||
    (f >= 272 && f <= 298) ||
    (f >= 314 && f <= 340) ||
    (f >= 356 && f <= 384);
  const crawlWave = isMoving ? Math.abs(Math.sin(f * 0.42)) : 0;
  const inchScaleX = 1 - crawlWave * 0.22;
  const inchLiftY = -crawlWave * 9;
  const reportOpacity = interpolate(f, [224, 234], [0, 1], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Figur pengambil tindakan di balik "meja yang tepat" — tetap duduk diam belum beranjak */}
      <PopIn at={196} origin="50% 100%">
        <div
          style={{
            position: 'absolute',
            left: 1054,
            top: 392,
            width: 98,
            height: 176,
            translate: '-50% -100%',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.28))',
          }}
        >
          {/* Sandaran kursi kantor */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 48,
              width: 24,
              height: 82,
              backgroundColor: C.inkSoft,
              borderRadius: 6,
            }}
          />
          {/* Kepala kertas polos tanpa wajah, tegak tidak bergerak */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 0,
              width: 46,
              height: 46,
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              border: `3px solid ${C.inkSoft}`,
            }}
          />
          {/* Badan berjas gelap duduk diam */}
          <div
            style={{
              position: 'absolute',
              left: 18,
              top: 52,
              width: 58,
              height: 78,
              backgroundColor: '#27324A',
              borderRadius: '12px 12px 4px 4px',
            }}
          />
          {/* Lengan terlipat diam di atas meja */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 84,
              width: 44,
              height: 13,
              backgroundColor: '#1D2638',
              borderRadius: 6,
            }}
          />
        </div>
      </PopIn>

      {/* Deretan meja kertas disusun seperti tangga */}
      {steps.map((st, idx) => {
        const legH = 562 - (st.topY + 14);
        return (
          <PopIn key={idx} at={178 + idx * 10} origin="50% 100%">
            <div style={{position: 'absolute', inset: 0}}>
              <Paper lift={7 + idx}>
                {/* Kaki meja kiri & kanan */}
                <Slab
                  x={st.x - st.w / 2 + 12}
                  y={st.topY + 14}
                  w={14}
                  h={legH}
                  color={C.woodLo}
                  shade={C.ink}
                  shadeH={0.2}
                  r={3}
                />
                <Slab
                  x={st.x + st.w / 2 - 26}
                  y={st.topY + 14}
                  w={14}
                  h={legH}
                  color={C.woodLo}
                  shade={C.ink}
                  shadeH={0.2}
                  r={3}
                />
                {/* Panel penopang meja */}
                <Slab
                  x={st.x - st.w / 2 + 10}
                  y={st.topY + 14}
                  w={st.w - 20}
                  h={24}
                  color={C.wood}
                  shade={C.woodLo}
                  shadeH={0.35}
                  r={2}
                />
                {/* Daun meja kertas */}
                <Slab
                  x={st.x - st.w / 2}
                  y={st.topY}
                  w={st.w}
                  h={16}
                  color={st.label ? C.creamHi : C.woodHi}
                  shade={st.label ? C.creamLo : C.woodLo}
                  shadeH={0.38}
                  r={4}
                />
              </Paper>
            </div>
          </PopIn>
        );
      })}

      {/* Papan nama meja kertas bertuliskan "meja yang tepat" di meja paling ujung */}
      <PopIn at={344}>
        <Boil seed="m07-right-desk-lbl" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 1038,
              top: 396,
              translate: '-50% 0',
              rotate: '-1deg',
              backgroundColor: C.creamHi,
              borderTop: `5px solid ${C.tag}`,
              padding: '9px 18px 11px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 21,
              lineHeight: 1,
              color: C.ink,
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
            }}
          >
            meja yang tepat
          </div>
        </Boil>
      </PopIn>

      {/* Selembar laporan kertas yang merayap sendirian menaiki tangga meja */}
      {reportOpacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: reportX,
            top: reportY + inchLiftY,
            width: 96,
            height: 54,
            translate: '-50% -100%',
            transformOrigin: '50% 100%',
            transform: `scaleX(${inchScaleX})`,
            opacity: reportOpacity,
            filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.32))',
          }}
        >
          {/* Lembar kertas laporan terlipat */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#F7F2E8',
              borderLeft: `6px solid ${C.amber}`,
              borderRadius: '4px 10px 4px 4px',
              padding: '8px 10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <div
              style={{
                fontFamily: FONT.label,
                fontWeight: 800,
                fontSize: 15,
                lineHeight: 1,
                color: C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              laporan
            </div>
            {/* Coretan garis abstrak tanpa angka */}
            <div style={{width: 64, height: 3, backgroundColor: C.inkSoft, opacity: 0.35, borderRadius: 2}} />
            <div style={{width: 48, height: 3, backgroundColor: C.inkSoft, opacity: 0.25, borderRadius: 2}} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const BeatOne: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#D4D1C9'}}>
    <FilmWeave amp={0.25} flicker={0.25} seed="m07-b1-weave">
      <OrbitCamera
        dur={BEAT1_DUR + 6}
        yaw={14}
        drift={[-26, -6]}
        push={1.08}
        focus={0.5}
        depth={760}
        origin={[640, 410]}
      >
        <Depth z={0} cover>
          <SharedRoomBackdrop />
        </Depth>

        <Depth z={0.5}>
          {/* Lantai meja kantin/warung kertas */}
          <Slab x={-140} y={562} w={1560} h={210} color="#E6E0D4" r={0} grain={0.5} />
          <Slab
            x={-140}
            y={556}
            w={1560}
            h={16}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.4}
            r={0}
          />
          <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

          {/* Meja warung kosong, laci kasir terbuka tanpa isi, tidak ada pelanggan */}
          <EmptyWarungCounter />

          {/* Deretan meja bertingkat & selembar laporan merayap ke meja yang tepat */}
          <SteppedDesksAndCrawlingReport />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

const MoneyTrackUpper: React.FC = () => {
  const f = useCurrentFrame();

  // Lembar uang kertas & koin mengalir dari bangunan negara (x=245) ke dapur (x=665)
  const flowU = interpolate(f, [75, BEAT2_DUR], [0, 3.2], CLAMP);
  const bills = [0, 1, 2];

  return (
    <PopIn at={14} origin="50% 50%">
      <div style={{position: 'absolute', inset: 0}}>
        {/* Pita jalur atas (jalur uang: negara -> dapur) */}
        <Paper lift={6}>
          <Slab
            x={210}
            y={192}
            w={470}
            h={24}
            color={C.sage}
            shade={C.sageLo}
            shadeH={0.3}
            r={12}
          />
        </Paper>

        {/* Panah spidol di atas jalur uang */}
        <MarkerArrow
          x={340}
          y={132}
          tx={536}
          ty={132}
          at={96}
          dur={14}
          color={C.go}
          bend={-10}
          width={5}
          seed="m07-money-arrow"
        />

        {/* Lembar uang kertas mengalir dari bangunan negara ke dapur */}
        {bills.map((idx) => {
          const cycle = (flowU + idx * 0.33) % 1;
          const bx = interpolate(cycle, [0, 1], [272, 628], CLAMP);
          const by = 188 + Math.sin(cycle * Math.PI * 2 + idx) * 3;
          const opacity = interpolate(f, [75 + idx * 8, 90 + idx * 8], [0, 1], CLAMP);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: bx,
                top: by,
                width: 48,
                height: 26,
                translate: '-50% -100%',
                rotate: `${(idx - 1) * 3}deg`,
                opacity,
                filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.28))',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#79A874',
                  border: '2px solid #487344',
                  borderRadius: 4,
                }}
              />
              {/* Lingkaran tengah kertas uang tanpa angka */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 12,
                  height: 12,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  backgroundColor: '#B8D9B4',
                }}
              />
            </div>
          );
        })}

        {/* Bangunan negara kertas di ujung kiri jalur atas */}
        <Boil seed="m07-state-bldg" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 196,
              top: 224,
              width: 158,
              height: 176,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={9}>
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 0,
                  width: 150,
                  height: 40,
                  backgroundColor: C.creamHi,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Slab x={10} y={38} w={138} h={14} color={C.cream} shade={C.creamLo} shadeH={0.35} r={2} />
              <Slab x={16} y={52} w={126} h={112} color={C.creamLo} shade="#A39584" shadeH={0.14} r={2} />
              {[24, 54, 92, 122].map((px, i) => (
                <Slab key={i} x={px} y={52} w={12} h={112} color={C.creamHi} r={2} />
              ))}
              <Slab x={8} y={164} w={142} h={12} color={C.creamHi} shade={C.creamLo} shadeH={0.4} r={2} />
            </Paper>
          </div>
        </Boil>

        {/* Bangunan dapur kertas di ujung kanan jalur atas */}
        <Boil seed="m07-kitchen-bldg" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 682,
              top: 224,
              width: 146,
              height: 168,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={9}>
              <Slab x={92} y={0} w={20} h={30} color={C.metalLo} r={3} />
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 20,
                  width: 138,
                  height: 30,
                  backgroundColor: C.wood,
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Slab x={12} y={48} w={122} h={120} color={C.creamHi} shade={C.creamLo} shadeH={0.14} r={3} />
              <div
                style={{
                  position: 'absolute',
                  left: 28,
                  top: 68,
                  width: 90,
                  height: 46,
                  borderRadius: 4,
                  backgroundColor: '#4E6378',
                  border: `3px solid ${C.woodLo}`,
                }}
              />
              <Slab x={22} y={112} w={102} h={10} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={3} />
            </Paper>
          </div>
        </Boil>
      </div>
    </PopIn>
  );
};

const FoodTrackAndOpenHandsChild: React.FC = () => {
  const f = useCurrentFrame();

  // Kotak makan mengalir dari dapur bawah (x=610) menuju figur anak (x=1010)
  const foodFlowU = interpolate(f, [180, BEAT2_DUR], [0, 2.8], CLAMP);
  const boxes = [0, 1];

  // Sorotan lingkaran spidol pada ruang kosong di depan anak (tidak ada tombol berhenti) di Scene 058 (f=402)
  const openArmReach = interpolate(f, [196, 224], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PopIn at={26} origin="50% 50%">
      <div style={{position: 'absolute', inset: 0}}>
        {/* Garis batas putus-putus memisahkan jalur uang & jalur makanan (tidak pernah bertemu) */}
        <div
          style={{
            position: 'absolute',
            left: 110,
            right: 110,
            top: 256,
            height: 3,
            borderTop: '3px dashed rgba(58,56,50,0.34)',
          }}
        />

        {/* Pita jalur makanan terpisah (dapur -> figur anak), TANPA tombol berhenti */}
        <Paper lift={6}>
          <Slab
            x={576}
            y={422}
            w={468}
            h={24}
            color={C.woodHi}
            shade={C.woodLo}
            shadeH={0.32}
            r={12}
          />
        </Paper>

        {/* Loket keluar makanan dari dapur di awal jalur bawah */}
        <Boil seed="m07-dispatch-kitchen" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 584,
              top: 432,
              width: 114,
              height: 126,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={8}>
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 0,
                  width: 106,
                  height: 24,
                  backgroundColor: C.wood,
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Slab x={10} y={22} w={94} h={104} color={C.creamHi} shade={C.creamLo} shadeH={0.16} r={3} />
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 40,
                  width: 70,
                  height: 38,
                  borderRadius: 4,
                  backgroundColor: '#4E6378',
                  border: `3px solid ${C.woodLo}`,
                }}
              />
            </Paper>
          </div>
        </Boil>

        {/* Kotak makan meluncur searah menuju figur anak */}
        {boxes.map((idx) => {
          const cycle = (foodFlowU + idx * 0.5) % 1;
          const lx = interpolate(cycle, [0, 1], [652, 996], CLAMP);
          const opacity = interpolate(f, [180 + idx * 12, 194 + idx * 12], [0, 1], CLAMP);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: lx,
                top: 420,
                width: 62,
                height: 34,
                translate: '-50% -100%',
                opacity,
                filter: 'drop-shadow(1px 3px 5px rgba(0,0,0,0.3))',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: C.creamHi,
                  borderRadius: 6,
                  borderBottom: `5px solid ${C.creamLo}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  top: 0,
                  width: 14,
                  height: 34,
                  backgroundColor: C.amber,
                }}
              />
            </div>
          );
        })}

        {/* Lingkaran spidol menyoroti jalur tanpa tombol berhenti di depan anak pada Scene 058 */}
        <MarkerCircle
          x={846}
          y={334}
          w={136}
          h={72}
          at={402}
          dur={14}
          color={C.tag}
          width={5}
          seed="m07-no-stop-circle"
        />

        {/* Figur anak tanpa wajah berdiri dengan tangan terbuka menerima apa pun yang datang */}
        <Boil seed="m07-open-child" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 1094,
              top: 454,
              width: 108,
              height: 184,
              translate: '-50% -100%',
              filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
            }}
          >
            {/* Tas sekolah anak di punggung */}
            <div
              style={{
                position: 'absolute',
                left: 64,
                top: 66,
                width: 28,
                height: 62,
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
                width: 48,
                height: 48,
                translate: '-50% 0',
                borderRadius: '50%',
                backgroundColor: C.creamHi,
                border: `3px solid ${C.inkSoft}`,
              }}
            />
            {/* Badan seragam siswa */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 54,
                width: 58,
                height: 82,
                translate: '-50% 0',
                backgroundColor: '#5D7896',
                borderRadius: '11px 11px 5px 5px',
              }}
            />
            {/* Kaki berdiri tegak */}
            <div
              style={{
                position: 'absolute',
                left: 28,
                top: 136,
                width: 20,
                height: 48,
                backgroundColor: C.inkSoft,
                borderRadius: 5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 58,
                top: 136,
                width: 20,
                height: 48,
                backgroundColor: C.inkSoft,
                borderRadius: 5,
              }}
            />
            {/* Kedua tangan terbuka ke depan menerima apa pun yang datang */}
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: 66,
                width: 46,
                height: 13,
                backgroundColor: '#4A627D',
                borderRadius: 7,
                transformOrigin: '100% 50%',
                transform: `rotate(${interpolate(openArmReach, [0, 1], [18, -8], CLAMP)}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -2,
                top: 84,
                width: 46,
                height: 13,
                backgroundColor: '#5D7896',
                borderRadius: 7,
                transformOrigin: '100% 50%',
                transform: `rotate(${interpolate(openArmReach, [0, 1], [10, -18], CLAMP)}deg)`,
              }}
            />
          </div>
        </Boil>
      </div>
    </PopIn>
  );
};

const RegularMarketStopTrack: React.FC = () => {
  const f = useCurrentFrame();

  // Muncul pada Scene 057: "Di pasar biasa, pembeli yang kecewa bisa berhenti membeli" (f=280)
  // Pembeli menekan tombol "berhenti" pada f=318, sehingga jalur terhalang dan kotak berhenti
  const pressU = interpolate(f, [316, 326], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const barrierDropU = interpolate(f, [322, 334], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const itemX = interpolate(f, [286, 324], [472, 358], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SlideIn at={278} dx={-70} dy={0} dur={14}>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 382,
          width: 454,
          height: 236,
        }}
      >
        {/* Alas kartu kertas jalur pasar biasa */}
        <Paper lift={8}>
          <Slab
            x={0}
            y={0}
            w={454}
            h={236}
            color="#F2ECE0"
            shade={C.creamLo}
            shadeH={0.08}
            r={14}
            grain={0.5}
          />
          {/* Pita jalur pembeli di pasar biasa */}
          <Slab
            x={116}
            y={170}
            w={314}
            h={18}
            color={C.cap}
            shade={C.capLo}
            shadeH={0.35}
            r={9}
          />
        </Paper>

        {/* Figur pembeli kecewa dengan dompet di kiri */}
        <div
          style={{
            position: 'absolute',
            left: 68,
            top: 204,
            width: 84,
            height: 152,
            translate: '-50% -100%',
            filter: 'drop-shadow(1px 4px 5px rgba(0,0,0,0.28))',
          }}
        >
          {/* Kepala polos tanpa wajah */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 40,
              height: 40,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              border: `3px solid ${C.inkSoft}`,
            }}
          />
          {/* Badan pembeli */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 46,
              width: 48,
              height: 66,
              translate: '-50% 0',
              backgroundColor: C.cap,
              borderRadius: '10px 10px 4px 4px',
            }}
          />
          {/* Kaki */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 112,
              width: 17,
              height: 40,
              backgroundColor: C.inkSoft,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 47,
              top: 112,
              width: 17,
              height: 40,
              backgroundColor: C.inkSoft,
              borderRadius: 4,
            }}
          />
          {/* Lengan menjulur menekan tombol "berhenti" */}
          <div
            style={{
              position: 'absolute',
              left: 54,
              top: 56 + pressU * 6,
              width: 74,
              height: 12,
              backgroundColor: C.capLo,
              borderRadius: 6,
              transformOrigin: '0% 50%',
              transform: `rotate(${-6 + pressU * 14}deg)`,
            }}
          />
        </div>

        {/* Tombol kertas bertuliskan "berhenti" yang ditekan pembeli kecewa */}
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 120,
            width: 126,
            height: 52,
            translate: '-50% 0',
          }}
        >
          {/* Dudukan tombol */}
          <div
            style={{
              position: 'absolute',
              left: 6,
              bottom: 0,
              width: 114,
              height: 14,
              backgroundColor: C.inkSoft,
              borderRadius: 4,
            }}
          />
          {/* Tutup tombol merah bertuliskan "berhenti" */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 4 + pressU * 10,
              width: 126,
              height: 36,
              backgroundColor: C.nogo,
              borderBottom: `4px solid ${C.nogoDim}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.banner,
              fontSize: 19,
              lineHeight: 1,
              color: '#FAF6EE',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            }}
          >
            berhenti
          </div>
        </div>

        {/* Palang penghalang yang turun setelah tombol "berhenti" ditekan */}
        {barrierDropU > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 312,
              top: 128 + barrierDropU * 12,
              width: 12,
              height: 44 * barrierDropU,
              backgroundColor: C.nogo,
              borderRadius: 3,
            }}
          />
        ) : null}

        {/* Kotak makanan yang tertahan berhenti di jalur pembeli */}
        <div
          style={{
            position: 'absolute',
            left: itemX,
            top: 168,
            width: 54,
            height: 30,
            translate: '-50% -100%',
            filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.28))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: C.creamHi,
              borderRadius: 5,
              borderBottom: `4px solid ${C.creamLo}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 0,
              width: 14,
              height: 30,
              backgroundColor: C.tag,
            }}
          />
        </div>
      </div>
    </SlideIn>
  );
};

const BeatTwo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#D4D1C9'}}>
    <FilmWeave amp={0.25} flicker={0.25} seed="m07-b2-weave">
      <OrbitCamera
        dur={BEAT2_DUR + 6}
        yaw={-14}
        drift={[24, -6]}
        push={1.08}
        focus={0.5}
        depth={760}
        origin={[640, 390]}
      >
        <Depth z={0} cover>
          <SharedRoomBackdrop />
        </Depth>

        <Depth z={0.5}>
          {/* Lantai meja kantin kertas */}
          <Slab x={-140} y={562} w={1560} h={210} color="#E6E0D4" r={0} grain={0.5} />
          <Slab
            x={-140}
            y={556}
            w={1560}
            h={16}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.4}
            r={0}
          />
          <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

          {/* Jalur 1 (atas): uang mengalir dari bangunan negara ke dapur */}
          <MoneyTrackUpper />

          {/* Jalur 2 (tengah-kanan): makanan mengalir dari dapur ke figur anak dengan tangan terbuka */}
          <FoodTrackAndOpenHandsChild />

          {/* Pembanding pasar biasa (kiri bawah): pembeli kecewa menekan tombol "berhenti" */}
          <RegularMarketStopTrack />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M07_DUR - 10, M07_DUR], [0, 1], {
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

const M07_SCENES: CutScene[] = [
  {id: 'm07-b1', component: BeatOne, durationInFrames: BEAT1_DUR},
  {id: 'm07-b2', component: BeatTwo, durationInFrames: BEAT2_DUR},
];

const M07_CUTS: Record<string, CutSpec> = {
  'm07-b2': {kind: 'pageTurn', align: 'mid', frames: 12},
};

export const M07: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#D4D1C9'}}>
    <PaperDefs />
    <CutSeries scenes={M07_SCENES} cuts={M07_CUTS} />
    <PaperFoldEdge />
  </AbsoluteFill>
);