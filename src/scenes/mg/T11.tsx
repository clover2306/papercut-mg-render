// Adegan MG T11: Pembalikan gagasan dari Harga (Dulu) menjadi Pilihan yang ditopang Pengalaman (Sekarang).
// Panggung teater kertas halte pagi dengan papan ubin huruf yang membalik, gerbang karcis, dan kartu Tarif yang jatuh ke lantai.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {CutScene, CutSeries, PopUpOpen} from '../../lib/paper/transitions';
import {Plant, Sticky} from '../../lib/paper/sets';
import {Boil, Figure, FLOOR_Y, Paper, PopIn, Slab, SlideIn, Stage} from './mgkit';

export const T11_DUR = 489;

const B1_DUR = 130;
const B2_DUR = 105;
const B3_DUR = 134;
const B4_DUR = 120;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const HARGA_LETTERS = ['H', 'A', 'R', 'G', 'A', '', ''] as const;
const PILIHAN_LETTERS = ['P', 'I', 'L', 'I', 'H', 'A', 'N'] as const;
const PENGALAMAN_LETTERS = ['P', 'E', 'N', 'G', 'A', 'L', 'A', 'M', 'A', 'N'] as const;

// Dekorasi latar panggung Teater Kertas Halte Pagi (tanpa angka/tulisan tambahan)
const HalteBackdrop: React.FC = () => (
  <>
    {/* Langit pagi hangat di balik dinding panggung */}
    <Paper lift={3}>
      <Slab x={56} y={136} w={1168} h={440} color="#DFD3C3" shade="#CFC1AE" shadeH={0.08} r={8} grain={0.5} />
    </Paper>

    {/* Awan kertas berlapis */}
    <Paper lift={3}>
      <Slab x={130} y={162} w={150} h={34} color={C.creamHi} r={18} />
      <Slab x={158} y={148} w={92} h={28} color={C.creamHi} r={14} />
      <Slab x={980} y={156} w={170} h={36} color={C.creamHi} r={18} />
      <Slab x={1016} y={142} w={104} h={28} color={C.creamHi} r={14} />
    </Paper>

    {/* Kanopi dan tiang halte pagi di sisi kanan belakang */}
    <Paper lift={4}>
      <Slab x={954} y={248} w={14} h={328} color={C.metalLo} r={3} />
      <Slab x={1156} y={248} w={14} h={328} color={C.metalLo} r={3} />
      <Slab x={928} y={224} w={264} h={32} color={ROOM.teal} shade="#204040" shadeH={0.35} hi="#467A7A" hiH={0.2} r={6} />
      {/* Bangku tunggu halte */}
      <Slab x={976} y={518} w={164} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
      <Slab x={994} y={534} w={12} h={42} color={C.woodLo} r={2} />
      <Slab x={1116} y={534} w={12} h={42} color={C.woodLo} r={2} />
      {/* Tiang rambu halte polos tanpa teks/angka */}
      <Slab x={904} y={304} w={8} h={272} color={C.inkSoft} r={2} />
      <Slab x={882} y={268} w={52} h={42} color={C.amber} shade={C.amberDim} shadeH={0.22} r={8} />
      <Slab x={892} y={280} w={32} h={16} color={C.creamHi} r={3} />
    </Paper>

    {/* Tanaman kertas di tepi kiri dan kanan panggung */}
    <Plant x={28} y={390} s={0.62} />
    <Plant x={1148} y={402} s={0.58} />

    {/* Catatan tempel kosong sebagai aksen tekstur kertas */}
    <Sticky x={88} y={210} s={44} color="#E8C95A" rot={-6} />
    <Sticky x={1142} y={196} s={40} color="#D99B78" rot={5} />
  </>
);

// Jalur jalan di kaki panggung: rel tipis dengan mobil kertas dan bus kertas tanpa angka
const FootRoadTrack: React.FC<{calmFlow?: number}> = ({calmFlow = 0}) => {
  const shift = calmFlow * 26;
  const cars = [
    {x: 110 + shift, color: C.hero, w: 68},
    {x: 220 + shift * 1.1, color: ROOM.dusk, w: 66},
    {x: 340 + shift * 1.2, color: C.brass, w: 70},
    {x: 780 + shift * 1.4, color: ROOM.slate, w: 68},
    {x: 910 + shift * 1.5, color: C.cap, w: 66},
  ];
  return (
    <Paper lift={4}>
      {/* Pita jalan dan rel pemandu di kaki panggung */}
      <Slab x={40} y={FLOOR_Y + 18} w={1200} h={54} color={C.board} shade={C.boardLo} shadeH={0.35} r={4} grain={0.65} />
      <Slab x={60} y={FLOOR_Y + 43} w={1160} h={4} color={C.creamLo} r={2} />
      {/* Bus kertas di tengah jalur */}
      <div style={{position: 'absolute', left: 520 + shift * 0.9, top: FLOOR_Y - 12}}>
        <Slab x={0} y={0} w={164} h={48} color={C.go} shade={C.goDim} shadeH={0.22} hi="#58C474" hiH={0.14} r={8} />
        {[16, 48, 80, 112].map((wx, idx) => (
          <Slab key={idx} x={wx} y={10} w={24} h={16} color={C.creamHi} r={3} />
        ))}
        <Slab x={24} y={42} w={20} h={20} color={C.ink} r="50%" />
        <Slab x={120} y={42} w={20} h={20} color={C.ink} r="50%" />
      </div>
      {/* Barisan mobil kertas */}
      {cars.map((c, i) => (
        <div key={i} style={{position: 'absolute', left: c.x, top: FLOOR_Y + 2}}>
          <Slab x={10} y={0} w={c.w - 20} h={16} color={c.color} r="6px 6px 0 0" />
          <Slab x={0} y={12} w={c.w} h={20} color={c.color} shade="rgba(0,0,0,0.22)" shadeH={0.3} r={5} />
          <Slab x={10} y={26} w={14} h={14} color={C.ink} r="50%" />
          <Slab x={c.w - 24} y={26} w={14} h={14} color={C.ink} r="50%" />
        </div>
      ))}
    </Paper>
  );
};

// Gerbang karcis halte di sisi kiri panggung beserta dua tokoh siluet tanpa wajah
const TicketGateGroup: React.FC<{mode: 'idle' | 'active' | 'settled'}> = ({mode}) => {
  const f = useCurrentFrame();

  // Tokoh 1 (pembayar): merogoh dompet kertas lalu bergeser tenang melewati gerbang
  const payerX =
    mode === 'idle'
      ? 188
      : mode === 'active'
      ? interpolate(f, [10, 78], [188, 308], {...CLAMP, easing: Easing.inOut(Easing.quad)})
      : 308;

  const walletLift =
    mode === 'active'
      ? interpolate(f, [8, 28, 54, 70], [0, 1, 1, 0], {...CLAMP})
      : 0;

  // Palang gerbang karcis membuka saat tokoh pertama lewat
  const armRot =
    mode === 'idle'
      ? -12
      : mode === 'active'
      ? interpolate(f, [26, 48, 76, 92], [-12, -68, -68, -18], {...CLAMP, easing: Easing.inOut(Easing.quad)})
      : -18;

  // Tokoh 2 (yang memilih mundur): maju sedikit melihat gerbang, lalu mundur tenang ke kiri
  const walkerX =
    mode === 'idle'
      ? 118
      : mode === 'active'
      ? interpolate(f, [18, 44, 92], [118, 142, 82], {...CLAMP, easing: Easing.inOut(Easing.quad)})
      : 82;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 420, height: FLOOR_Y}}>
      {/* Rel geser boneka kertas di lantai */}
      <Slab x={56} y={FLOOR_Y - 8} w={296} h={8} color={C.floorLo} r={3} />

      {/* Tokoh kedua (berpakaian rapi, mundur tenang tanpa dihakimi) */}
      <Figure x={walkerX} y={FLOOR_Y - 4} s={0.76} shirt={ROOM.khaki} />
      {/* Tas kerja kertas pada tokoh kedua */}
      <Paper lift={2}>
        <Slab x={walkerX - 34} y={FLOOR_Y - 78} w={26} h={20} color={C.wood} shade={C.woodLo} shadeH={0.25} r={3} />
      </Paper>

      {/* Tokoh pertama (merogoh dompet dan lewat gerbang) */}
      <Figure x={payerX} y={FLOOR_Y - 4} s={0.78} shirt={ROOM.dusk} />
      {/* Dompet/karcis kertas kecil tanpa angka yang dirogoh tenang */}
      {walletLift > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: payerX + 22,
            top: FLOOR_Y - 96 - walletLift * 18,
            opacity: walletLift,
            transform: `rotate(${-14 * walletLift}deg)`,
          }}
        >
          <Paper lift={3}>
            <Slab x={0} y={0} w={28} h={18} color={C.woodHi} shade={C.woodLo} shadeH={0.3} r={3} />
            <Slab x={6} y={-8} w={18} h={12} color={C.tape} r={2} />
          </Paper>
        </div>
      ) : null}

      {/* Unit mesin gerbang karcis kertas (turnstile) di depan tokoh */}
      <Paper lift={5}>
        <Slab x={232} y={FLOOR_Y - 122} w={54} h={118} color={C.metal} shade={C.metalLo} shadeH={0.22} hi={C.creamHi} hiH={0.12} r={8} />
        <Slab x={240} y={FLOOR_Y - 110} w={38} h={22} color={C.board} r={4} />
        {/* Palang putar kertas */}
        <div
          style={{
            position: 'absolute',
            left: 258,
            top: FLOOR_Y - 74,
            width: 68,
            height: 12,
            backgroundColor: C.brass,
            borderRadius: 6,
            transformOrigin: '6px 6px',
            transform: `rotate(${armRot}deg)`,
            boxShadow: '1px 3px 4px rgba(0,0,0,0.28)',
          }}
        />
      </Paper>
    </div>
  );
};

// Satu ubin huruf yang bisa membalik ala kartu kertas pada poros vertikal/horizontal
const FlipLetterTile: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  frontChar: string;
  backChar: string;
  flipProgress: number; // 0 = sisi depan (HARGA), 1 = sisi belakang (PILIHAN)
  frontBg?: string;
  backBg?: string;
}> = ({x, y, w, h, frontChar, backChar, flipProgress, frontBg = C.cream, backBg = C.amber}) => {
  const p = Math.min(1, Math.max(0, flipProgress));
  const isBack = p >= 0.5;
  const scaleX = Math.max(0.06, Math.abs(Math.cos(p * Math.PI)));
  const char = isBack ? backChar : frontChar;
  const bg = isBack ? backBg : frontBg;
  const textColor = isBack ? C.ink : C.ink;

  // Bila di keadaan awal slot ke-6 dan ke-7 belum terisi (HARGA hanya 5 huruf), tampilkan dudukan rel tipis
  const isEmptySlot = !isBack && frontChar === '';

  if (isEmptySlot) {
    return (
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
        <Slab x={8} y={h / 2 - 6} w={w - 16} h={12} color={C.woodLo} r={4} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transformOrigin: '50% 50%',
        transform: `scaleX(${scaleX})`,
      }}
    >
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={w}
          h={h}
          color={bg}
          shade="rgba(0,0,0,0.18)"
          shadeH={0.14}
          hi={C.creamHi}
          hiH={0.1}
          r={8}
          grain={0.55}
        />
        {/* Lubang engsel ubin mekanik kertas di tepi atas & bawah */}
        <Slab x={w / 2 - 14} y={6} w={28} h={5} color={C.woodLo} r={2} />
        <Slab x={10} y={h / 2 - 1} w={w - 20} h={2} color="rgba(0,0,0,0.12)" r={1} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.banner,
            fontSize: 44,
            color: textColor,
            lineHeight: 1,
            paddingTop: 4,
          }}
        >
          {char}
        </div>
      </Paper>
    </div>
  );
};

// Label sudut papan ("Dulu" -> membalik menjadi "Sekarang")
const CornerTimeBadge: React.FC<{x: number; y: number; flipProgress: number}> = ({x, y, flipProgress}) => {
  const p = Math.min(1, Math.max(0, flipProgress));
  const isNow = p >= 0.5;
  const scaleY = Math.max(0.08, Math.abs(Math.cos(p * Math.PI)));
  const label = isNow ? 'Sekarang' : 'Dulu';
  const bg = isNow ? C.go : C.tag;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transformOrigin: '50% 50%',
        transform: `rotate(-3deg) scaleY(${scaleY})`,
      }}
    >
      <Paper lift={5}>
        <div
          style={{
            backgroundColor: bg,
            padding: '10px 24px 12px',
            borderRadius: 6,
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 30,
            color: C.tagText,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            boxShadow: '2px 4px 0 rgba(0,0,0,0.22)',
          }}
        >
          {label}
        </div>
      </Paper>
    </div>
  );
};

// Kartu karcis "Tarif" di samping papan yang jatuh pelan ke lantai pada Beat 4
const TarifSideCard: React.FC<{fallProgress: number}> = ({fallProgress}) => {
  const p = Math.min(1, Math.max(0, fallProgress));

  // Dari terpasang di sisi kanan papan (x=968, y=286) -> melayang turun ke lantai panggung (x=1012, y=FLOOR_Y - 58)
  const x = interpolate(p, [0, 0.35, 0.7, 1], [964, 996, 982, 1008], {...CLAMP});
  const y = interpolate(p, [0, 1], [286, FLOOR_Y - 58], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const rot = interpolate(p, [0, 0.3, 0.65, 1], [8, 24, -12, 14], {...CLAMP});
  const tapeLift = interpolate(p, [0, 0.2], [1, 0], {...CLAMP});

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transformOrigin: '50% 50%',
        transform: `rotate(${rot}deg)`,
      }}
    >
      <Paper lift={4}>
        <div
          style={{
            backgroundColor: C.tape,
            border: `3px solid ${C.woodLo}`,
            borderRadius: 8,
            padding: '12px 24px 14px',
            fontFamily: FONT.banner,
            fontSize: 28,
            color: C.ink,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Tarif
        </div>
        {/* Potongan lakban penahan saat masih menempel di papan */}
        {tapeLift > 0.05 ? (
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: -12,
              width: 54,
              height: 18,
              backgroundColor: C.creamHi,
              opacity: 0.85 * tapeLift,
              transform: 'rotate(-8deg)',
            }}
          />
        ) : null}
      </Paper>
    </div>
  );
};

// Papan utama tempat ubin-ubin huruf berada di tengah panggung
const CenterTileBoard: React.FC<{
  mode: 'harga' | 'flipping' | 'pilihan_pengalaman';
}> = ({mode}) => {
  const f = useCurrentFrame();

  // Kemajuan balik label Dulu -> Sekarang di Beat 3
  const badgeFlip =
    mode === 'harga'
      ? 0
      : mode === 'flipping'
      ? interpolate(f, [8, 32], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
      : 1;

  // Kemajuan hadirnya baris penopang "PENGALAMAN" di Beat 4
  const supportSlide =
    mode === 'pilihan_pengalaman'
      ? interpolate(f, [6, 46], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : 0;

  // Kemajuan jatuhnya kartu "TARIF" ke lantai di Beat 4
  const tarifFall =
    mode === 'pilihan_pengalaman'
      ? interpolate(f, [28, 86], [0, 1], {...CLAMP})
      : 0;

  const boardX = 336;
  const boardY = 204;
  const boardW = 636;
  const boardH = 338;

  const tileW = 74;
  const tileH = 92;
  const tileGap = 10;
  // Untuk HARGA (5 huruf di tengah), saat menjadi PILIHAN (7 huruf penuh)
  const row1StartX = boardX + (boardW - (7 * tileW + 6 * tileGap)) / 2;
  const row1Y = boardY + 62;

  return (
    <Boil seed="tile-board" amp={0.4} rot={0.05}>
      <div style={{position: 'absolute', inset: 0}}>
        {/* Kaki penyangga papan ke lantai panggung */}
        <Paper lift={4}>
          <Slab x={boardX + 90} y={boardY + boardH - 12} w={22} h={FLOOR_Y - (boardY + boardH) + 12} color={C.woodLo} r={4} />
          <Slab x={boardX + boardW - 112} y={boardY + boardH - 12} w={22} h={FLOOR_Y - (boardY + boardH) + 12} color={C.woodLo} r={4} />
        </Paper>

        {/* Bingkai kayu papan pengumuman halte */}
        <Paper lift={6}>
          <Slab x={boardX} y={boardY} w={boardW} h={boardH} color={C.wood} shade={C.woodLo} shadeH={0.14} hi={C.woodHi} hiH={0.08} r={14} />
          <Slab x={boardX + 18} y={boardY + 18} w={boardW - 36} h={boardH - 36} color={C.board} shade={C.boardLo} shadeH={0.2} r={10} grain={0.7} />
          {/* Rel horizontal tempat ubin huruf menggantung */}
          <Slab x={boardX + 32} y={row1Y + tileH / 2 - 5} w={boardW - 64} h={10} color={C.metalLo} r={4} />
        </Paper>

        {/* Deretan 7 slot ubin: HARGA (5 ubin pertama/tengah) -> membalik satu per satu menjadi PILIHAN */}
        {PILIHAN_LETTERS.map((backCh, idx) => {
          // Geser HARGA agar tampak rapi dari kolom indeks 1..5 sebelum membalik, atau 0..4
          const frontCh = HARGA_LETTERS[idx];
          const startFrame = 16 + idx * 11;
          const flipP =
            mode === 'harga'
              ? 0
              : mode === 'flipping'
              ? interpolate(f, [startFrame, startFrame + 24], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)})
              : 1;

          // Saat masih HARGA (5 huruf), posisikan 5 huruf di tengah papan; saat berbalik ke PILIHAN, bergeser mulus ke 7 kolom
          const centeredShift = (1 - flipP) * ((tileW + tileGap) * 1.0);
          const tx = row1StartX + idx * (tileW + tileGap) + centeredShift;

          return (
            <FlipLetterTile
              key={idx}
              x={tx}
              y={row1Y}
              w={tileW}
              h={tileH}
              frontChar={frontCh}
              backChar={backCh}
              flipProgress={flipP}
              frontBg={C.cream}
              backBg={C.amber}
            />
          );
        })}

        {/* Baris ubin penopang "PENGALAMAN" di bawah "PILIHAN" pada Beat 4 */}
        {supportSlide > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: interpolate(supportSlide, [0, 1], [48, 0], {...CLAMP}),
              opacity: interpolate(supportSlide, [0, 0.25, 1], [0, 1, 1], {...CLAMP}),
            }}
          >
            {/* Balok penopang kertas di bawah ubin PENGALAMAN */}
            <Paper lift={5}>
              <Slab
                x={boardX + 26}
                y={row1Y + tileH + 22}
                w={boardW - 52}
                h={96}
                color={ROOM.teal}
                shade="#1E3F3F"
                shadeH={0.22}
                hi="#498383"
                hiH={0.14}
                r={10}
              />
              {/* Dua siku penyangga dari PENGALAMAN ke PILIHAN */}
              <Slab x={boardX + 130} y={row1Y + tileH - 2} w={28} h={28} color={C.brass} r={4} />
              <Slab x={boardX + boardW - 158} y={row1Y + tileH - 2} w={28} h={28} color={C.brass} r={4} />
            </Paper>

            {/* 10 ubin huruf membentuk kata PENGALAMAN */}
            {PENGALAMAN_LETTERS.map((ch, idx) => {
              const pTileW = 50;
              const pGap = 6;
              const totalPW = 10 * pTileW + 9 * pGap;
              const pStartX = boardX + (boardW - totalPW) / 2;
              const px = pStartX + idx * (pTileW + pGap);
              const py = row1Y + tileH + 34;

              return (
                <Paper key={idx} lift={4}>
                  <Slab
                    x={px}
                    y={py}
                    w={pTileW}
                    h={72}
                    color={C.creamHi}
                    shade={C.creamLo}
                    shadeH={0.2}
                    r={6}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: px,
                      top: py,
                      width: pTileW,
                      height: 72,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONT.banner,
                      fontSize: 32,
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {ch}
                  </div>
                </Paper>
              );
            })}
          </div>
        ) : null}

        {/* Label sudut "Dulu" -> "Sekarang" */}
        <CornerTimeBadge x={boardX - 24} y={boardY - 18} flipProgress={badgeFlip} />

        {/* Kartu samping "Tarif" yang menempel lalu terlepas jatuh ke lantai di Beat 4 */}
        <TarifSideCard fallProgress={tarifFall} />
      </div>
    </Boil>
  );
};

// BEAT 1 (scene 152-153): Deretan ubin huruf membentuk "HARGA" di tengah panggung, label "Dulu" di sudutnya.
const Beat1: React.FC = () => (
  <PopUpOpen dur={18}>
    <Stage dur={B1_DUR} banner="" bannerSize={40}>
      <OrbitCamera dur={B1_DUR} yaw={14} push={1.07} origin={[640, 480]} drift={[20, -8]}>
        <Depth z={0.15} cover>
          <HalteBackdrop />
        </Depth>
        <Depth z={0.5}>
          <TicketGateGroup mode="idle" />
          <PopIn at={4}>
            <CenterTileBoard mode="harga" />
          </PopIn>
        </Depth>
        <Depth z={0.85}>
          <SlideIn at={0} dy={28} dur={14}>
            <FootRoadTrack calmFlow={0} />
          </SlideIn>
        </Depth>
      </OrbitCamera>
    </Stage>
  </PopUpOpen>
);

// BEAT 2 (scene 154): Di gerbang karcis, satu siluet merogoh dompet dan lewat, satu siluet lain mundur tenang.
const Beat2: React.FC = () => (
  <Stage dur={B2_DUR} banner="" bannerSize={40}>
    <OrbitCamera dur={B2_DUR} yaw={-14} push={1.08} origin={[420, 480]} drift={[-24, -6]}>
      <Depth z={0.15} cover>
        <HalteBackdrop />
      </Depth>
      <Depth z={0.5}>
        <TicketGateGroup mode="active" />
        <CenterTileBoard mode="harga" />
      </Depth>
      <Depth z={0.85}>
        <FootRoadTrack calmFlow={0.2} />
      </Depth>
    </OrbitCamera>
  </Stage>
);

// BEAT 3 (scene 155-156): Ubin "HARGA" membalik satu per satu menjadi "PILIHAN"; label "Dulu" membalik menjadi "Sekarang".
const Beat3: React.FC = () => (
  <Stage dur={B3_DUR} banner="" bannerSize={40}>
    <OrbitCamera dur={B3_DUR} yaw={16} push={1.08} origin={[660, 440]} drift={[24, -10]}>
      <Depth z={0.15} cover>
        <HalteBackdrop />
      </Depth>
      <Depth z={0.5}>
        <TicketGateGroup mode="settled" />
        <CenterTileBoard mode="flipping" />
      </Depth>
      <Depth z={0.85}>
        <FootRoadTrack calmFlow={0.6} />
      </Depth>
    </OrbitCamera>
  </Stage>
);

// BEAT 4 (scene 157): Deretan ubin "PENGALAMAN" tiba di bawah "PILIHAN" sebagai penopang; kartu "TARIF" jatuh ke lantai panggung.
const Beat4: React.FC = () => (
  <Stage dur={B4_DUR} banner="" bannerSize={40}>
    <SnapZoom at={16} x={654} y={390} to={1.08} settle={1.05} shake={4} roll={0.4} blur={false}>
      <OrbitCamera dur={B4_DUR} yaw={-12} push={1.07} origin={[660, 460]} drift={[-18, -6]}>
        <Depth z={0.15} cover>
          <HalteBackdrop />
        </Depth>
        <Depth z={0.5}>
          <TicketGateGroup mode="settled" />
          <CenterTileBoard mode="pilihan_pengalaman" />
        </Depth>
        <Depth z={0.85}>
          <FootRoadTrack calmFlow={1} />
        </Depth>
      </OrbitCamera>
    </SnapZoom>
  </Stage>
);

const SCENES: CutScene[] = [
  {id: 'B1', component: Beat1, durationInFrames: B1_DUR},
  {id: 'B2', component: Beat2, durationInFrames: B2_DUR},
  {id: 'B3', component: Beat3, durationInFrames: B3_DUR},
  {id: 'B4', component: Beat4, durationInFrames: B4_DUR},
];

export const T11: React.FC = () => (
  <AbsoluteFill>
    <CutSeries
      scenes={SCENES}
      cuts={{
        B2: {kind: 'pageTurn', style: 'curl', angle: -14, from: 'bottom', align: 'mid'},
        B3: {kind: 'tapePull', y: 180, align: 'mid'},
        B4: {kind: 'pageTurn', style: 'fold', angle: 12, from: 'top', align: 'mid'},
      }}
    />
  </AbsoluteFill>
);
