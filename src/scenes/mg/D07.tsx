// Adegan D07 (scene 81-85): Ekspor Indonesia tumbuh 4,59% di dermaga senja yang hangat,
// lalu penguatan rupiah mengangkat label harga di luar jangkauan pembeli asing.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';

export const D07_DUR = 549;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PIER_Y = 540;
const STAGE_FLOOR_Y = 626;

// Koin Rupiah: cakram kuning madu polos tanpa tulisan
const RupiahCoin: React.FC<{size?: number}> = ({size = 54}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(145deg, #F5C84C 0%, #DCA12E 100%)',
      border: '3px solid #9E6E18',
      boxShadow: '2px 5px 8px rgba(0,0,0,0.34), inset 0 2px 3px rgba(255,248,214,0.65)',
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: Math.round(size * 0.16),
        borderRadius: '50%',
        border: '1.5px solid rgba(158, 110, 24, 0.35)',
      }}
    />
  </div>
);

// Koin Dolar: cakram hijau zaitun bercincin tanpa tulisan
const DollarCoin: React.FC<{size?: number}> = ({size = 46}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(145deg, #8DA384 0%, #63785B 100%)',
      border: '3px solid #3F5039',
      boxShadow: '2px 4px 7px rgba(0,0,0,0.34), inset 0 2px 3px rgba(226,240,220,0.45)',
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: Math.round(size * 0.2),
        borderRadius: '50%',
        border: '2.5px solid #D9E5D2',
      }}
    />
  </div>
);

// Peti kargo kertas polos tanpa label/angka
const PlainCrate: React.FC<{w?: number; h?: number; tone?: 'warm' | 'light'}> = ({
  w = 88,
  h = 72,
  tone = 'warm',
}) => {
  const base = tone === 'warm' ? '#C78E54' : '#D5A16A';
  const plank = tone === 'warm' ? '#A46E3A' : '#B37E49';
  const hi = tone === 'warm' ? '#DDA972' : '#E5B885';
  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: base,
        border: `2.5px solid ${C.woodLo}`,
        borderRadius: 4,
        boxShadow: '3px 6px 10px rgba(0,0,0,0.32)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 10, backgroundColor: hi}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: Math.round(h * 0.34), height: 2.5, backgroundColor: plank}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: Math.round(h * 0.68), height: 2.5, backgroundColor: plank}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: 10, width: 8, backgroundColor: plank, opacity: 0.72}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, right: 10, width: 8, backgroundColor: plank, opacity: 0.72}} />
    </div>
  );
};

// Pembeli asing: siluet kertas tanpa wajah dengan topi lebar
const ForeignBuyer: React.FC<{
  x: number;
  y: number;
  armAngle: number;
  shoulderDrop: number;
  hasCoin: boolean;
}> = ({x, y, armAngle, shoulderDrop, hasCoin}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 120,
      height: 224,
      translate: '-50% -100%',
      filter: 'drop-shadow(3px 7px 9px rgba(0,0,0,0.34))',
    }}
  >
    {/* Kaki */}
    <div
      style={{
        position: 'absolute',
        left: 42,
        top: 164,
        width: 18,
        height: 60,
        borderRadius: 6,
        backgroundColor: '#2B3542',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 164,
        width: 18,
        height: 60,
        borderRadius: 6,
        backgroundColor: '#374454',
      }}
    />

    {/* Mantel / Badan */}
    <div
      style={{
        position: 'absolute',
        left: 28,
        top: 74 + shoulderDrop,
        width: 66,
        height: 98,
        borderRadius: '18px 18px 10px 10px',
        backgroundColor: ROOM.slate,
        border: '2px solid #2C3B4B',
      }}
    />

    {/* Lengan yang mengulur / memegang koin */}
    <div
      style={{
        position: 'absolute',
        left: 44,
        top: 90 + shoulderDrop,
        width: 64,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#3E5266',
        transformOrigin: '10px 8px',
        transform: `rotate(${armAngle}deg)`,
      }}
    >
      {hasCoin ? (
        <div style={{position: 'absolute', left: -24, top: -15}}>
          <DollarCoin size={42} />
        </div>
      ) : null}
    </div>

    {/* Kepala bulat polos TANPA WAJAH */}
    <div
      style={{
        position: 'absolute',
        left: 36,
        top: 24 + shoulderDrop * 0.7,
        width: 48,
        height: 48,
        borderRadius: '50%',
        backgroundColor: C.creamLo,
        border: `2.5px solid ${C.inkSoft}`,
      }}
    />

    {/* Topi lebar khas pembeli asing */}
    <div
      style={{
        position: 'absolute',
        left: 34,
        top: 6 + shoulderDrop * 0.7,
        width: 52,
        height: 20,
        borderRadius: '14px 14px 4px 4px',
        backgroundColor: '#7B674D',
        border: `2px solid ${C.woodLo}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 12,
        top: 22 + shoulderDrop * 0.7,
        width: 96,
        height: 9,
        borderRadius: 6,
        backgroundColor: '#917A5C',
        border: `2px solid ${C.woodLo}`,
      }}
    />
  </div>
);

// Kapal kertas berlapis di sisi kanan dermaga
const PaperShip: React.FC<{x: number; y: number; bobY: number; extraCrates: number}> = ({
  x,
  y,
  bobY,
  extraCrates,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y + bobY,
      width: 280,
      height: 185,
      filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.32))',
    }}
  >
    {/* Cerobong & kabin kertas */}
    <Slab x={165} y={42} w={26} h={48} color={ROOM.terracotta} shade={C.heroLo} shadeH={0.22} r={4} />
    <Slab x={162} y={36} w={32} h={10} color={C.cream} r={3} />
    <Slab x={132} y={66} w={86} h={46} color={C.cream} shade={C.creamLo} shadeH={0.2} r={6} />

    {/* Peti kargo di geladak kapal */}
    <div style={{position: 'absolute', left: 32, top: 72}}>
      <PlainCrate w={56} h={44} tone="warm" />
    </div>
    <div style={{position: 'absolute', left: 84, top: 76}}>
      <PlainCrate w={52} h={40} tone="light" />
    </div>
    {extraCrates > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 34,
          opacity: extraCrates,
          transform: `translateY(${(1 - extraCrates) * -28}px)`,
        }}
      >
        <PlainCrate w={54} h={40} tone="light" />
      </div>
    ) : null}

    {/* Lambung kapal potongan kertas */}
    <svg width={280} height={82} viewBox="0 0 280 82" style={{position: 'absolute', left: 0, top: 104}}>
      <polygon points="8,12 272,12 246,72 34,72" fill="#3B4D61" stroke="#23303E" strokeWidth="3" />
      <polygon points="14,12 266,12 258,28 20,28" fill="#B55B40" />
    </svg>
  </div>
);

// Gelas kopi kertas + uap tipis + syal terakota tergantung di kait tepi panggung
const WarungStageEdgeProps: React.FC<{frame: number}> = ({frame}) => {
  const steamOffset = (frame * 0.45) % 40;
  const scarfSway = Math.sin(frame / 36) * 1.6;
  return (
    <>
      {/* Kait kayu & syal kertas terakota tergantung di pilar kiri panggung */}
      <div style={{position: 'absolute', left: 96, top: 372, zIndex: 20}}>
        <div
          style={{
            width: 18,
            height: 12,
            borderRadius: 6,
            backgroundColor: C.wood,
            border: `2px solid ${C.woodLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 3,
            top: 8,
            transformOrigin: '6px 0px',
            transform: `rotate(${scarfSway}deg)`,
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.34))',
          }}
        >
          <div
            style={{
              width: 18,
              height: 112,
              borderRadius: '6px 6px 10px 10px',
              backgroundColor: C.hero,
              border: `2px solid ${C.heroLo}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 12,
              width: 15,
              height: 92,
              borderRadius: '4px 4px 8px 8px',
              backgroundColor: '#DF8163',
              border: `2px solid ${C.heroLo}`,
              transform: 'rotate(5deg)',
            }}
          />
        </div>
      </div>

      {/* Meja sudut kecil & gelas kopi kertas dengan uap tipis */}
      <div style={{position: 'absolute', left: 108, top: 584, zIndex: 22}}>
        {/* Uap kopi kertas melayang pelan */}
        {[0, 1].map((idx) => {
          const phase = (steamOffset + idx * 20) % 40;
          const op = interpolate(phase, [0, 12, 32, 40], [0, 0.55, 0.45, 0], CLAMP);
          const dy = -phase * 0.9;
          const dx = Math.sin((frame + idx * 18) / 22) * 4;
          return (
            <svg
              key={idx}
              width={24}
              height={34}
              viewBox="0 0 24 34"
              style={{
                position: 'absolute',
                left: 16 + idx * 12 + dx,
                top: -32 + dy,
                opacity: op,
              }}
            >
              <path
                d="M12 32 C6 24, 18 16, 11 4"
                fill="none"
                stroke="#F7F1E5"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          );
        })}

        {/* Gelas kopi kertas */}
        <svg
          width={58}
          height={64}
          viewBox="0 0 58 64"
          style={{filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.38))'}}
        >
          <polygon points="10,14 48,14 43,60 15,60" fill={C.creamHi} stroke={C.inkSoft} strokeWidth="2.5" />
          <polygon points="12,28 46,28 44,44 14,44" fill={C.woodHi} />
          <rect x="7" y="8" width="44" height="7" rx="3" fill={C.cream} stroke={C.inkSoft} strokeWidth="2" />
        </svg>
      </div>
    </>
  );
};

// Tirai teater terakota kiri, kanan, dan pelengkung atas
const TheaterCurtains: React.FC = () => (
  <>
    {/* Tirai kiri berlapis */}
    <div style={{position: 'absolute', left: -30, top: -20, width: 132, height: 760, filter: 'drop-shadow(6px 0 12px rgba(0,0,0,0.42))'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 118, height: 760, backgroundColor: '#8D4933'}} />
      <div style={{position: 'absolute', left: 26, top: 0, width: 84, height: 760, backgroundColor: '#A8583E', borderRadius: '0 0 36px 0'}} />
      <div style={{position: 'absolute', left: 54, top: 0, width: 48, height: 760, backgroundColor: '#BE674B', borderRadius: '0 0 28px 0'}} />
    </div>

    {/* Tirai kanan berlapis */}
    <div style={{position: 'absolute', right: -30, top: -20, width: 132, height: 760, filter: 'drop-shadow(-6px 0 12px rgba(0,0,0,0.42))'}}>
      <div style={{position: 'absolute', right: 0, top: 0, width: 118, height: 760, backgroundColor: '#8D4933'}} />
      <div style={{position: 'absolute', right: 26, top: 0, width: 84, height: 760, backgroundColor: '#A8583E', borderRadius: '0 0 0 36px'}} />
      <div style={{position: 'absolute', right: 54, top: 0, width: 48, height: 760, backgroundColor: '#BE674B', borderRadius: '0 0 0 28px'}} />
    </div>

    {/* Pelengkung tirai atas */}
    <div
      style={{
        position: 'absolute',
        left: -40,
        right: -40,
        top: -24,
        height: 68,
        backgroundColor: '#7D3F2C',
        borderBottom: '4px solid #5B2B1D',
        boxShadow: '0 6px 14px rgba(0,0,0,0.38)',
      }}
    />
  </>
);

export const D07: React.FC = () => {
  const f = useCurrentFrame();

  // --- PROGRES BEAT & CAHAYA ---
  // Beat 1 (0..179): Dua batang pertumbuhan + bendera data tegas
  const barGrow = interpolate(f, [10, 74], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Bendera data tegas: muncul utuh saat disebut di scene 81, keluar rapi sebelum scene 84 (rel 332)
  const flagEnter = interpolate(f, [18, 30], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const flagExit = interpolate(f, [312, 328], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const flagVisible = f < 329;
  const flagOpacity = flagEnter * (1 - flagExit);
  const flagOffsetY = (1 - flagEnter) * 18 - flagExit * 42;

  // Beat 2 (199..315): Cahaya menghangat, peti naik ke kapal, pembeli asing menukar koin hijau dengan peti
  const warmGlow = interpolate(f, [196, 224, 326, 355], [0, 1, 1, 0], CLAMP);
  const shipExtraCrate = interpolate(f, [205, 242], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Pembeli asing masuk di Beat 2, bertukar koin & peti, lalu mundur di Beat 4
  const buyerEnterX = interpolate(f, [224, 260], [1050, 815], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const buyerStepBackX = interpolate(f, [486, 522], [0, 74], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const buyerX = buyerEnterX + buyerStepBackX;

  // Pertukaran dua arah di Beat 2 (rel 258..308)
  const exchangeProgress = interpolate(f, [258, 304], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const tradeCrateX = interpolate(exchangeProgress, [0, 1], [630, 725], CLAMP);

  // Beat 3 (332..379): Langit bergeser dari jingga hangat ke biru senja, peti ujung dermaga bergeser pelan
  const duskShift = interpolate(f, [332, 378], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cloudDriftX = interpolate(f, [328, 549], [-90, 65], CLAMP);
  const edgeCrateShift = interpolate(f, [342, 378], [0, 16], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 4 (379..524): Koin kuning madu naik sebagai bandul mengangkat tag harga polos di luar jangkauan
  const tagLift = interpolate(f, [384, 496], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pendulumSwing =
    interpolate(f, [384, 420, 465, 515], [0, 6, -4, 0], CLAMP) *
    (1 - interpolate(f, [500, 524], [0, 1], CLAMP));

  // Tag harga polos naik dari atas peti (y = 442) ke tinggi di luar jangkauan (y = 224)
  const tagY = interpolate(tagLift, [0, 1], [442, 224], CLAMP);
  // Bandul koin kuning madu di sisi kiri katrol bergerak naik sebagai pengimbang
  const coinPendulumY = interpolate(tagLift, [0, 1], [340, 210], CLAMP);

  // Lingkaran sorot gaya guntingan tangan menyorot tag yang naik di Beat 4
  const tagSpotlightOpacity = interpolate(f, [392, 418], [0, 0.92], CLAMP);

  // Gerak lengan pembeli asing:
  // Beat 2: mengulurkan koin hijau (-14 deg) -> Beat 4: mengulur ke atas (-54 deg) lalu menurunkan lengan (18 deg)
  const armReachUp = interpolate(f, [412, 452], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const armLowerDown = interpolate(f, [474, 512], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const buyerArmAngle =
    -14 +
    armReachUp * -42 +
    armLowerDown * 74;
  const buyerShoulderDrop = armLowerDown * 6;

  // Pembeli tetap memegang koin hijau di Beat 4 (setelah Beat 2 menampilkan koin baru siap ditawar)
  const buyerHasDollarCoin = f < 276 || f >= 340;

  // Ayunan kapal yang sangat tenang di air
  const shipBobY = Math.sin(f / 32) * 2.4;
  const waveShiftX = Math.sin(f / 44) * 14;

  // Tinggi kedua batang di dermaga (batang kanan sedikit lebih tinggi, modest)
  const leftBarH = Math.round(112 * barGrow);
  const rightBarH = Math.round(142 * barGrow);

  return (
    <AbsoluteFill style={{backgroundColor: '#2B221C'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera
          dur={D07_DUR}
          yaw={10}
          push={1.06}
          drift={[-28, -4]}
          origin={[640, 360]}
          focus={0.5}
          depth={620}
        >
          {/* LAPISAN 0 (LATAR): Langit senja jingga -> biru senja + matahari + awan kertas */}
          <Depth z={0} cover>
            {/* Langit jingga hangat awal */}
            <Slab x={-220} y={-140} w={1720} h={920} color="#E69A58" r={0} grain={0.45} />
            <div
              style={{
                position: 'absolute',
                left: -220,
                top: -140,
                width: 1720,
                height: 620,
                background: 'linear-gradient(180deg, #C96B43 0%, #E79B59 55%, #F4C982 100%)',
              }}
            />

            {/* Lapisan langit biru senja saat Beat 3-4 */}
            <div
              style={{
                position: 'absolute',
                left: -220,
                top: -140,
                width: 1720,
                height: 760,
                opacity: duskShift,
                background: 'linear-gradient(180deg, #1E2C42 0%, #324A69 58%, #58728F 100%)',
              }}
            />

            {/* Matahari kertas senja (meredup hangat saat senja biru tiba) */}
            <div
              style={{
                position: 'absolute',
                left: 820,
                top: 155 + duskShift * 78,
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: '#F8D486',
                opacity: 1 - duskShift * 0.62,
                boxShadow: '0 0 60px rgba(248, 212, 134, 0.55)',
              }}
            />

            {/* Awan kertas senja melintas pelan */}
            <div
              style={{
                position: 'absolute',
                left: 520 + cloudDriftX,
                top: 118,
                opacity: 0.35 + duskShift * 0.45,
                filter: 'url(#torn) drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            >
              <div
                style={{
                  width: 240,
                  height: 44,
                  borderRadius: 24,
                  backgroundColor: duskShift > 0.45 ? '#6E849E' : '#F3CFA0',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 44,
                  top: -18,
                  width: 130,
                  height: 36,
                  borderRadius: 20,
                  backgroundColor: duskShift > 0.45 ? '#7E94AE' : '#F6DAB3',
                }}
              />
            </div>

            {/* Pendaran hangat Beat 2 ("Itu kabar baik") */}
            <div
              style={{
                position: 'absolute',
                inset: -160,
                opacity: warmGlow * 0.32,
                background: 'radial-gradient(circle at 52% 48%, rgba(255, 224, 138, 0.9) 0%, rgba(255, 224, 138, 0) 64%)',
              }}
            />
          </Depth>

          {/* LAPISAN 1 (LATAR TENGAH): Laut kertas berlapis & kapal kargo kertas */}
          <Depth z={0.28}>
            {/* Gelombang laut belakang */}
            <div
              style={{
                position: 'absolute',
                left: -180 + waveShiftX * 0.6,
                top: 454,
                width: 1640,
                height: 180,
                backgroundColor: duskShift > 0.5 ? '#263B52' : '#35546E',
                borderTop: '3px solid rgba(255,255,255,0.18)',
              }}
            />
            {/* Gelombang laut depan */}
            <div
              style={{
                position: 'absolute',
                left: -180 - waveShiftX,
                top: 484,
                width: 1640,
                height: 160,
                backgroundColor: duskShift > 0.5 ? '#1D2F42' : '#294359',
                borderTop: '3px solid rgba(255,255,255,0.22)',
              }}
            />

            {/* Kapal kertas penuh peti polos bersandar di kanan dermaga */}
            <PaperShip x={928} y={336} bobY={shipBobY} extraCrates={shipExtraCrate} />
          </Depth>

          {/* LAPISAN 2 (PANGGUNG UTAMA): Dermaga, dua batang, bendera data tegas, peti, katrol & pembeli asing */}
          <Depth z={0.52}>
            {/* Tiang-tiang penyangga dermaga */}
            {[215, 375, 535, 695, 855].map((px) => (
              <Slab
                key={px}
                x={px}
                y={PIER_Y + 18}
                w={22}
                h={84}
                color={C.woodLo}
                shade="#3A2212"
                shadeH={0.3}
                r={3}
              />
            ))}

            {/* Lantai dermaga kertas kayu */}
            <Paper lift={4}>
              <Slab
                x={145}
                y={PIER_Y}
                w={785}
                h={24}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.35}
                hi={C.woodHi}
                hiH={0.2}
                r={4}
              />
            </Paper>

            {/* Lentera dermaga hangat (satu lampu hangat tersisa di pose akhir) */}
            <div style={{position: 'absolute', left: 532, top: 382}}>
              <div style={{width: 8, height: 158, backgroundColor: C.inkSoft, borderRadius: 3}} />
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  top: -12,
                  width: 28,
                  height: 30,
                  borderRadius: '8px 8px 4px 4px',
                  backgroundColor: '#F6C856',
                  border: `2px solid ${C.woodLo}`,
                  boxShadow: '0 0 36px rgba(246, 200, 86, 0.78)',
                }}
              />
            </div>

            {/* DUA BATANG PERTUMBUHAN DI TEPI DERMAGA (tanpa skala, tanpa angka di batang) */}
            <Boil seed="bars-d07" amp={0.4} rot={0.05}>
              {/* Batang kiri (lebih rendah) */}
              <Paper lift={4}>
                <Slab
                  x={224}
                  y={PIER_Y - leftBarH}
                  w={66}
                  h={leftBarH}
                  color={C.sage}
                  shade={C.sageLo}
                  shadeH={0.16}
                  hi="#A5B5A1"
                  hiH={0.1}
                  r="6px 6px 2px 2px"
                />
              </Paper>

              {/* Batang kanan (sedikit lebih tinggi — pertumbuhan modest) */}
              <Paper lift={5}>
                <Slab
                  x={318}
                  y={PIER_Y - rightBarH}
                  w={66}
                  h={rightBarH}
                  color="#5B865D"
                  shade="#3E6140"
                  shadeH={0.16}
                  hi="#7BA67D"
                  hiH={0.1}
                  r="6px 6px 2px 2px"
                />
              </Paper>
            </Boil>

            {/* BENDERA DATA BERBINGKAI TEGAS DI PUNCAK BATANG KANAN (scene 81, keluar sebelum scene 84) */}
            {flagVisible ? (
              <div
                style={{
                  position: 'absolute',
                  left: 348,
                  top: PIER_Y - rightBarH - 134 + flagOffsetY,
                  /* QA Clover: w/h eksplisit — tanpa ini Boil (absolute inset:0) menciutkan kotak kartu jadi selebar padding dan teks meluber keluar bingkai. */
                  width: 380,
                  height: 118,
                  opacity: flagOpacity,
                  zIndex: 18,
                }}
              >
                {/* Tiang bendera kertas */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 12,
                    width: 6,
                    height: 126,
                    backgroundColor: C.ink,
                    borderRadius: 3,
                  }}
                />
                {/* Kartu berbingkai garis TEGAS (data nyata bertanggal) */}
                <Boil seed="flag-d07" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      marginLeft: 6,
                      backgroundColor: C.creamHi,
                      border: `3.5px solid ${C.ink}`,
                      borderRadius: 6,
                      padding: '12px 20px 14px',
                      boxShadow: '3px 6px 12px rgba(0,0,0,0.34)',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                    }}
                  >
                    {/* Paku/keling sudut sebagai penanda kartu tegas */}
                    {[
                      {left: 6, top: 6},
                      {right: 6, top: 6},
                      {left: 6, bottom: 6},
                      {right: 6, bottom: 6},
                    ].map((pos, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: C.inkSoft,
                          ...pos,
                        }}
                      />
                    ))}

                    <div
                      style={{
                        fontFamily: FONT.label,
                        fontWeight: 800,
                        fontSize: 19,
                        letterSpacing: '0.06em',
                        color: C.inkSoft,
                        lineHeight: 1.15,
                      }}
                    >
                      TRIWULAN III 2026
                    </div>
                    <div
                      style={{
                        marginTop: 5,
                        fontFamily: FONT.caption,
                        fontWeight: 900,
                        fontSize: 27,
                        color: C.ink,
                        lineHeight: 1.1,
                      }}
                    >
                      EKSPOR TUMBUH 4,59%
                    </div>
                  </div>
                </Boil>
              </div>
            ) : null}

            {/* Tumpukan peti polos di dermaga */}
            <div style={{position: 'absolute', left: 420, top: PIER_Y - 64}}>
              <PlainCrate w={74} h={64} tone="warm" />
            </div>
            <div style={{position: 'absolute', left: 498, top: PIER_Y - 56}}>
              <PlainCrate w={66} h={56} tone="light" />
            </div>

            {/* Peti pertukaran Beat 2 (bergeser mulus ke arah pembeli asing) */}
            {f >= 210 && f < 342 ? (
              <div
                style={{
                  position: 'absolute',
                  left: tradeCrateX,
                  top: PIER_Y - 58,
                  opacity: interpolate(f, [210, 224, 324, 338], [0, 1, 1, 0], CLAMP),
                }}
              >
                <PlainCrate w={68} h={58} tone="light" />
              </div>
            ) : null}

            {/* Koin dolar hijau zaitun meluncur ke sisi dermaga saat pertukaran Beat 2 */}
            {exchangeProgress > 0.05 && f < 340 ? (
              <div
                style={{
                  position: 'absolute',
                  left: interpolate(exchangeProgress, [0, 1], [755, 592], CLAMP),
                  top: 432 - Math.sin(exchangeProgress * Math.PI) * 28,
                  opacity: interpolate(f, [258, 268, 322, 336], [0, 1, 1, 0], CLAMP),
                }}
              >
                <DollarCoin size={44} />
              </div>
            ) : null}

            {/* --- BEAT 3 & 4: PETI UJUNG DERMAGA, KATROL BANDUL KOIN RUPIAH & TAG HARGA POLOS --- */}
            {/* Lingkaran sorot gaya guntingan tangan pada tag harga yang naik */}
            {tagSpotlightOpacity > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 656 + edgeCrateShift,
                  top: tagY + 24,
                  width: 144,
                  height: 144,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,233,156,0.58) 0%, rgba(255,233,156,0.18) 68%, rgba(255,233,156,0) 72%)',
                  border: '2px dashed rgba(255, 236, 173, 0.55)',
                  opacity: tagSpotlightOpacity,
                  pointerEvents: 'none',
                }}
              />
            ) : null}

            {/* Penyangga katrol & tali pengangkat tag harga */}
            <div
              style={{
                position: 'absolute',
                left: 590 + edgeCrateShift,
                top: 158,
                opacity: interpolate(f, [334, 354], [0, 1], CLAMP),
              }}
            >
              {/* Balok gantungan katrol atas */}
              <div
                style={{
                  width: 96,
                  height: 12,
                  borderRadius: 5,
                  backgroundColor: C.woodLo,
                }}
              />
              {/* Roda katrol kiri & kanan */}
              {[16, 72].map((wx, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: wx - 9,
                    top: 8,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: C.metal,
                    border: `2px solid ${C.inkSoft}`,
                  }}
                />
              ))}

              {/* Tali kiri ke bandul koin kuning madu */}
              <div
                style={{
                  position: 'absolute',
                  left: 15,
                  top: 18,
                  width: 2.5,
                  height: Math.max(16, coinPendulumY - 176),
                  backgroundColor: C.cream,
                  transformOrigin: 'top center',
                  transform: `rotate(${pendulumSwing}deg)`,
                }}
              >
                <div style={{position: 'absolute', left: -24, bottom: -46}}>
                  <RupiahCoin size={50} />
                </div>
              </div>

              {/* Tali kanan dari katrol ke tag harga polos */}
              <div
                style={{
                  position: 'absolute',
                  left: 71,
                  top: 18,
                  width: 2.5,
                  height: Math.max(18, tagY - 176),
                  backgroundColor: C.cream,
                }}
              />
            </div>

            {/* Peti di ujung dermaga (bergeser pelan di Beat 3) */}
            <div style={{position: 'absolute', left: 616 + edgeCrateShift, top: PIER_Y - 68}}>
              <PlainCrate w={82} h={68} tone="warm" />
            </div>

            {/* Tag harga kertas POLOS (tanpa teks/angka) yang terangkat tinggi di luar jangkauan */}
            <div
              style={{
                position: 'absolute',
                left: 662 + edgeCrateShift,
                top: tagY,
                translate: '-50% 0',
                opacity: interpolate(f, [336, 356], [0, 1], CLAMP),
                filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
              }}
            >
              <svg width={44} height={62} viewBox="0 0 44 62">
                <polygon
                  points="14,4 30,4 40,18 40,58 4,58 4,18"
                  fill={C.creamHi}
                  stroke={C.inkSoft}
                  strokeWidth="2.5"
                />
                <circle cx="22" cy="14" r="4" fill="#3A2D24" />
                <line x1="12" y1="30" x2="32" y2="30" stroke={C.creamLo} strokeWidth="3" strokeLinecap="round" />
                <line x1="12" y1="40" x2="28" y2="40" stroke={C.creamLo} strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Pembeli asing tanpa wajah bertopi lebar */}
            <PopIn at={220}>
              <ForeignBuyer
                x={buyerX}
                y={PIER_Y + 2}
                armAngle={buyerArmAngle}
                shoulderDrop={buyerShoulderDrop}
                hasCoin={buyerHasDollarCoin}
              />
            </PopIn>
          </Depth>

          {/* LAPISAN 3 (DEPAN PANGGUNG WARUNG KOPI): Lantai panggung papan, gelas kopi, syal terakota & tirai */}
          <Depth z={0.85}>
            {/* Kerucut lampu sorot kuning madu dari atas panggung */}
            <div
              style={{
                position: 'absolute',
                left: 190,
                top: 20,
                width: 900,
                height: 640,
                background:
                  'linear-gradient(180deg, rgba(255, 224, 130, 0.20) 0%, rgba(255, 224, 130, 0.05) 75%, rgba(255, 224, 130, 0) 100%)',
                clipPath: 'polygon(26% 0%, 74% 0%, 98% 100%, 2% 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Lantai papan panggung teater kertas */}
            <Slab x={-160} y={STAGE_FLOOR_Y} w={1600} h={160} color={C.floor} r={0} grain={0.6} />
            <div style={{position: 'absolute', left: -160, right: -160, top: STAGE_FLOOR_Y + 34, height: 3, backgroundColor: C.floorLo, opacity: 0.8}} />
            <div style={{position: 'absolute', left: -160, right: -160, top: STAGE_FLOOR_Y + 72, height: 3, backgroundColor: C.floorLo, opacity: 0.8}} />
            <Slab x={-160} y={STAGE_FLOOR_Y - 18} w={1600} h={22} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />

            {/* Jangkar warung kopi: gelas kopi kertas bertuap & syal terakota di tepi panggung */}
            <WarungStageEdgeProps frame={f} />

            {/* Tirai teater terakota di kedua sisi */}
            <TheaterCurtains />
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};