// Adegan D03 (scene 35-38): perbandingan kurs nyata JISDOR 13 November 2026 dengan andaian Rp1.000 per dolar.
// Panggung teater kertas warung kopi dengan dua batang kertas (pekat rendah vs kalkir putus-putus 18,2x) dan amplop gaji yang sama.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D03_DUR = 783;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TABLE_Y = 544;
const STAGE_FLOOR_Y = 614;
const LEFT_BAR_CX = 365;
const RIGHT_BAR_CX = 935;
const BAR_W = 112;
const LEFT_BAR_H = 20;
const RIGHT_BAR_H = 364; // proporsional 1 : 18,2 terhadap batang kiri

const DollarCoin: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 48, h = 13}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y,
      width: w,
      height: h,
      borderRadius: 999,
      backgroundColor: C.sage,
      border: `2.5px solid ${C.sageLo}`,
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.28), 0 2px 3px rgba(0,0,0,0.28)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 6,
        right: 6,
        top: 2.5,
        bottom: 2.5,
        borderRadius: 999,
        border: `1.5px solid ${C.creamHi}`,
        opacity: 0.72,
      }}
    />
  </div>
);

const CoffeeAndScarfAnchor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {/* Kait kayu & syal kertas terakota di tepi kiri panggung */}
      <Paper lift={5}>
        <Slab x={112} y={248} w={16} h={24} color={C.woodLo} r={4} />
        <Slab x={122} y={254} w={18} h={10} color={C.brass} r={5} />
        <Boil seed="scarf-d03" amp={0.4} rot={0.05}>
          <div style={{position: 'absolute', left: 118, top: 260}}>
            <Slab x={0} y={0} w={22} h={148} color={C.tag} shade={C.heroLo} shadeH={0.18} r={6} rot={2} />
            <Slab x={10} y={6} w={20} h={168} color={ROOM.terracotta} shade="#733E2B" shadeH={0.2} r={6} rot={-3} />
            {/* Rumbai kertas polos di ujung syal */}
            {[2, 9, 16].map((dx, i) => (
              <div
                key={`f1-${i}`}
                style={{
                  position: 'absolute',
                  left: dx - 2,
                  top: 146,
                  width: 3,
                  height: 14,
                  backgroundColor: C.tag,
                  borderRadius: 2,
                }}
              />
            ))}
            {[12, 19, 26].map((dx, i) => (
              <div
                key={`f2-${i}`}
                style={{
                  position: 'absolute',
                  left: dx,
                  top: 170,
                  width: 3,
                  height: 15,
                  backgroundColor: ROOM.terracotta,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </Boil>
      </Paper>

      {/* Meja samping kecil & gelas kopi kertas bertuap tipis di tepi kiri */}
      <Paper lift={6}>
        <Slab x={96} y={556} w={98} h={14} color={C.wood} hi={C.woodHi} hiH={0.25} r={4} />
        <Slab x={112} y={570} w={14} h={46} color={C.woodLo} r={2} />
        <Slab x={164} y={570} w={14} h={46} color={C.woodLo} r={2} />

        {/* Gelas kopi kertas polos */}
        <div
          style={{
            position: 'absolute',
            left: 126,
            top: 506,
            width: 38,
            height: 50,
            backgroundColor: '#F5EFE6',
            clipPath: 'polygon(6% 0%, 94% 0%, 84% 100%, 16% 100%)',
            boxShadow: 'inset -6px 0 0 rgba(0,0,0,0.08)',
          }}
        />
        {/* Selongsong kertas kraft polos tanpa tulisan */}
        <div
          style={{
            position: 'absolute',
            left: 128,
            top: 520,
            width: 34,
            height: 20,
            backgroundColor: C.tape,
            clipPath: 'polygon(3% 0%, 97% 0%, 92% 100%, 8% 100%)',
          }}
        />
        <Slab x={123} y={500} w={44} h={7} color={C.cream} shade={C.creamLo} shadeH={0.35} r={3} />
      </Paper>

      {/* Uap kopi tipis naik perlahan */}
      {[0, 1, 2].map((idx) => {
        const cycle = ((f + idx * 42) % 126) / 126;
        const wy = 492 - cycle * 44;
        const wx = 138 + idx * 7 + Math.sin((f + idx * 20) * 0.045) * 3.5;
        const op = interpolate(cycle, [0, 0.25, 0.8, 1], [0, 0.45, 0.35, 0], CLAMP);
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: wx,
              top: wy,
              width: 5,
              height: 18,
              borderRadius: 999,
              backgroundColor: '#FFFDF9',
              opacity: op,
              transform: `rotate(${Math.sin((f + idx * 15) * 0.04) * 8}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

const TvAnchor: React.FC = () => (
  <Paper lift={6}>
    {/* Meja samping kanan */}
    <Slab x={1084} y={556} w={104} h={14} color={C.wood} hi={C.woodHi} hiH={0.25} r={4} />
    <Slab x={1100} y={570} w={14} h={46} color={C.woodLo} r={2} />
    <Slab x={1158} y={570} w={14} h={46} color={C.woodLo} r={2} />

    {/* Antena kertas */}
    <Slab x={1122} y={466} w={4} h={28} color={C.inkSoft} r={2} rot={-24} />
    <Slab x={1146} y={466} w={4} h={28} color={C.inkSoft} r={2} rot={24} />

    {/* Badan televisi kertas */}
    <Slab x={1094} y={490} w={84} h={66} color={C.woodHi} shade={C.woodLo} shadeH={0.18} r={8} />
    {/* Layar polos bercahaya tanpa teks/angka */}
    <div
      style={{
        position: 'absolute',
        left: 1102,
        top: 498,
        width: 52,
        height: 50,
        borderRadius: 6,
        background: 'radial-gradient(circle at 40% 35%, #FFF8E3 0%, #EAD296 100%)',
        border: `2px solid ${C.woodLo}`,
        boxShadow: '0 0 18px rgba(245, 197, 66, 0.35)',
      }}
    />
    {/* Dua tombol putar cakram polos */}
    <div
      style={{
        position: 'absolute',
        left: 1160,
        top: 506,
        width: 11,
        height: 11,
        borderRadius: '50%',
        backgroundColor: C.cream,
        border: `1.5px solid ${C.inkSoft}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 1160,
        top: 524,
        width: 11,
        height: 11,
        borderRadius: '50%',
        backgroundColor: C.cream,
        border: `1.5px solid ${C.inkSoft}`,
      }}
    />
  </Paper>
);

export const D03: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak kamera tenang bertahap:
  // 1) Scene 35 (0-336): dolly-in pelan ke kartu data JISDOR di kiri
  // 2) Scene 36 (359-513): agak melebar sedikit untuk batang kiri & amplop
  // 3) Scene 37 (537-656): pan ke kanan ke sisi andaian
  // 4) Scene 38 (672-760): mundur ke bidikan lebar dua batang, lalu ditahan (760-783)
  const camScale = interpolate(
    f,
    [0, 320, 370, 520, 645, 760],
    [1.0, 1.15, 1.09, 1.09, 1.08, 1.0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camX = interpolate(
    f,
    [0, 320, 370, 520, 645, 760],
    [0, 115, 85, 85, -115, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camY = interpolate(
    f,
    [0, 320, 370, 520, 645, 760],
    [0, 42, -10, -10, 6, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Beat 1 (Scene 35, rel 0-336): Kartu TEGAS JISDOR turun dari rel atas, lalu menyusut rapi ke pojok kiri di Beat 2
  const cardDropY = interpolate(f, [6, 36], [-260, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const cardCornerU = interpolate(f, [348, 386], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const cardX = interpolate(cardCornerU, [0, 1], [310, 182], CLAMP);
  const cardY = interpolate(cardCornerU, [0, 1], [156, 74], CLAMP) + cardDropY;
  const cardScale = interpolate(cardCornerU, [0, 1], [1.14, 1.0], CLAMP);

  // Beat 2 (Scene 36, rel 359-513): Amplop gaji masuk ke dasar batang kiri, batang kiri naik
  const envEnterU = interpolate(f, [378, 412], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const envMoveU = interpolate(f, [668, 718], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const envCx = interpolate(envEnterU, [0, 1], [210, 520], CLAMP) + interpolate(envMoveU, [0, 1], [0, 115], CLAMP);
  const envOpacity = interpolate(f, [378, 390], [0, 1], CLAMP);
  const calcirTwinOpacity = interpolate(f, [676, 702], [0, 0.85], CLAMP);

  const leftBarU = interpolate(f, [436, 478], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const leftBarH = Math.max(0, Math.round(LEFT_BAR_H * leftBarU));

  // Beat 3 (Scene 37, rel 537-656): Lingkaran sorot putus-putus & kartu putus-putus kanan masuk
  const rightSpotU = interpolate(f, [538, 576], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const rightRateCardY = interpolate(f, [540, 576], [-140, 74], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Beat 4 (Scene 38, rel 672-783): Batang kanan dari kertas kalkir menjulang 18,2x lebih tinggi
  const rightBarU = interpolate(f, [704, 756], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const rightBarH = Math.max(0, Math.round(RIGHT_BAR_H * rightBarU));

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 1: Latar dinding kertas hangat (paralaks lambat 0.6x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 0.6}px, ${camY * 0.6}px) scale(${1 + (camScale - 1) * 0.7})`,
            transformOrigin: '640px 360px',
          }}
        >
          <Slab x={-140} y={-90} w={1560} h={900} color={C.creamHi} r={0} grain={0.55} />
          {/* Panel garis kertas lembut pada latar */}
          {[-40, 220, 480, 740, 1000, 1260].map((px, i) => (
            <div
              key={px}
              style={{
                position: 'absolute',
                left: px,
                top: -90,
                width: 256,
                height: 900,
                backgroundColor: i % 2 === 0 ? 'rgba(218, 206, 192, 0.35)' : 'rgba(255, 250, 242, 0.25)',
                borderRight: '1px solid rgba(191, 178, 162, 0.45)',
              }}
            />
          ))}
          {/* Cahaya sorot hangat dari atas */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 34%, rgba(255, 241, 196, 0.45) 0%, rgba(255,255,255,0) 58%, rgba(46, 30, 18, 0.24) 100%)',
            }}
          />
        </AbsoluteFill>

        {/* LAPISAN 2: Rel gantung atas & lampu sorot kuning madu (paralaks 0.8x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 0.8}px, ${camY * 0.8}px) scale(${1 + (camScale - 1) * 0.85})`,
            transformOrigin: '640px 360px',
          }}
        >
          <Slab x={-80} y={18} w={1440} h={16} color={C.woodLo} shade="#2A190E" shadeH={0.35} r={0} />
          {[390, 890].map((lx, idx) => (
            <div key={lx} style={{position: 'absolute', left: lx - 90, top: 34, width: 180, height: 340}}>
              {/* Kerucut cahaya sorot hangat */}
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 56,
                  width: 160,
                  height: 310,
                  background: 'linear-gradient(180deg, rgba(245, 197, 66, 0.20) 0%, rgba(245, 197, 66, 0) 100%)',
                  clipPath: 'polygon(32% 0%, 68% 0%, 100% 100%, 0% 100%)',
                }}
              />
              <Paper lift={4}>
                <Slab x={87} y={0} w={6} h={24} color={C.inkSoft} r={2} />
                <Slab
                  x={48}
                  y={22}
                  w={84}
                  h={40}
                  color={idx === 0 ? C.sparkYellow : C.amber}
                  shade={C.brassLo}
                  shadeH={0.22}
                  r="42px 42px 6px 6px"
                />
              </Paper>
            </div>
          ))}
        </AbsoluteFill>

        {/* LAPISAN 3: Panggung lantai papan krem, meja pantau, dua batang kurs, kartu data, & amplop gaji (paralaks 1.0x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
            transformOrigin: '640px 360px',
          }}
        >
          {/* Lantai papan kertas krem */}
          <Slab x={-120} y={STAGE_FLOOR_Y} w={1520} h={720 - STAGE_FLOOR_Y + 80} color="#CBB699" r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -120, right: -120, top: STAGE_FLOOR_Y + 34, height: 2.5, background: '#B39B7B'}} />
          <div style={{position: 'absolute', left: -120, right: -120, top: STAGE_FLOOR_Y + 70, height: 2.5, background: '#B39B7B'}} />
          <Slab x={-120} y={STAGE_FLOOR_Y - 14} w={1520} h={16} color={C.woodLo} shade="#2B1A0F" shadeH={0.35} r={0} />

          {/* Meja pantau di atas panggung */}
          <Paper lift={6}>
            <Slab x={256} y={TABLE_Y + 20} w={20} h={STAGE_FLOOR_Y - TABLE_Y - 20} color={C.woodLo} r={2} />
            <Slab x={1004} y={TABLE_Y + 20} w={20} h={STAGE_FLOOR_Y - TABLE_Y - 20} color={C.woodLo} r={2} />
            <Slab x={232} y={TABLE_Y + 16} w={816} h={14} color={C.woodLo} r={3} />
            <Slab x={220} y={TABLE_Y} w={840} h={20} color={C.wood} hi={C.woodHi} hiH={0.28} r={5} />
          </Paper>

          {/* Lingkaran sorot gaya guntingan tangan putus-putus di sisi kanan meja */}
          <div
            style={{
              position: 'absolute',
              left: RIGHT_BAR_CX - 126,
              top: TABLE_Y - 18,
              width: 252,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 197, 66, 0.16)',
              border: `3px dashed ${ROOM.terracotta}`,
              opacity: rightSpotU,
              transform: `scale(${0.86 + 0.14 * rightSpotU})`,
            }}
          />

          {/* BATANG KIRI: Kertas pekat hijau-krem (dunia nyata bertanggal) */}
          {leftBarH > 0 ? (
            <>
              <Paper lift={5}>
                <Slab
                  x={LEFT_BAR_CX - BAR_W / 2}
                  y={TABLE_Y - leftBarH}
                  w={BAR_W}
                  h={leftBarH}
                  color={C.sage}
                  shade={C.sageLo}
                  shadeH={0.25}
                  hi={C.creamHi}
                  hiH={0.18}
                  r={4}
                />
                {/* Garis tegas bingkai data nyata */}
                <div
                  style={{
                    position: 'absolute',
                    left: LEFT_BAR_CX - BAR_W / 2,
                    top: TABLE_Y - leftBarH,
                    width: BAR_W,
                    height: leftBarH,
                    border: `2.5px solid ${C.ink}`,
                    borderRadius: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </Paper>
              {/* Koin hijau zaitun bercincin di puncak batang kiri */}
              <DollarCoin x={LEFT_BAR_CX} y={TABLE_Y - leftBarH - 12} />
              <DollarCoin x={LEFT_BAR_CX} y={TABLE_Y - leftBarH - 22} />
            </>
          ) : null}

          {/* Kartu puncak batang kiri: "SEKITAR US$274" (bingkai tegas data nyata) */}
          <PopIn at={452}>
            <Boil seed="peak-left-d03" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: LEFT_BAR_CX - 122, top: 392, width: 244}}>
                <div
                  style={{
                    backgroundColor: '#FBF7F0',
                    border: `3.5px solid ${C.ink}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    textAlign: 'center',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 22,
                    color: C.ink,
                    lineHeight: 1.1,
                    boxShadow: '2px 5px 8px rgba(0,0,0,0.28)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SEKITAR US$274
                </div>
                {/* Tangkai kertas penghubung ke koin puncak batang kiri */}
                <div
                  style={{
                    width: 4,
                    height: 54,
                    margin: '0 auto',
                    backgroundColor: C.ink,
                  }}
                />
              </div>
            </Boil>
          </PopIn>

          {/* BATANG KANAN: Kertas kalkir tembus pandang berbingkai PUTUS-PUTUS (tinggi 18,2x) */}
          {rightBarH > 0 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: RIGHT_BAR_CX - BAR_W / 2,
                  top: TABLE_Y - rightBarH,
                  width: BAR_W,
                  height: rightBarH,
                  backgroundColor: 'rgba(250, 246, 238, 0.56)',
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(154,90,66,0.08) 0px, rgba(154,90,66,0.08) 1px, transparent 1px, transparent 16px)',
                  border: `3px dashed ${ROOM.terracotta}`,
                  borderRadius: 6,
                  boxSizing: 'border-box',
                  boxShadow: 'inset 8px 0 14px rgba(255,255,255,0.45), 4px 8px 14px rgba(0,0,0,0.16)',
                }}
              />
              {/* Tumpukan koin hijau zaitun bercincin di puncak batang kanan */}
              {[0, 1, 2, 3, 4].map((ci) => (
                <DollarCoin key={ci} x={RIGHT_BAR_CX} y={TABLE_Y - rightBarH - 12 - ci * 9} />
              ))}
            </>
          ) : null}

          {/* Kartu hasil berbingkai PUTUS-PUTUS menempel di puncak batang kanan: "US$5.000" */}
          <PopIn at={724}>
            <Boil seed="peak-right-d03" amp={0.4} rot={0.05}>
              <div style={{position: 'absolute', left: 662, top: 184, width: 218, height: 68}}>
                {/* Lidah kertas penghubung putus-putus ke puncak batang kanan */}
                <div
                  style={{
                    position: 'absolute',
                    left: 196,
                    top: 30,
                    width: 24,
                    height: 8,
                    backgroundColor: 'rgba(250, 246, 238, 0.85)',
                    borderTop: `2.5px dashed ${ROOM.terracotta}`,
                    borderBottom: `2.5px dashed ${ROOM.terracotta}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 198,
                    height: 68,
                    backgroundColor: 'rgba(252, 248, 240, 0.94)',
                    border: `3.5px dashed ${ROOM.terracotta}`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 29,
                    color: ROOM.terracotta,
                    boxShadow: '2px 5px 10px rgba(0,0,0,0.22)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  US$5.000
                </div>
              </div>
            </Boil>
          </PopIn>

          {/* AMPLOP GAJI POLOS YANG SAMA (berpindah dari kiri ke tengah, tag tanpa bingkai khusus) */}
          <div
            style={{
              position: 'absolute',
              left: envCx - 98,
              top: TABLE_Y - 82,
              width: 196,
              height: 82,
              opacity: envOpacity,
            }}
          >
            <Paper lift={7}>
              {/* Badan amplop kertas krem-kraft polos */}
              <Slab x={0} y={0} w={196} h={82} color={C.cream} shade={C.creamLo} shadeH={0.2} r={6} />
              {/* Lipatan segitiga amplop */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 196,
                  height: 44,
                  backgroundColor: C.tape,
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
              />
              {/* Tag gaji polos menempel di amplop (muncul utuh sekaligus) */}
              <PopIn at={396}>
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 26,
                    width: 172,
                    height: 44,
                    backgroundColor: '#FFFDF8',
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 23,
                    color: C.ink,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.22)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Rp5.000.000
                </div>
              </PopIn>
            </Paper>

            {/* Kembaran kalkir tembus pandang menumpuk persis di atas amplop saat berpindah (tanda tetap sama) */}
            {calcirTwinOpacity > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 253, 248, 0.34)',
                  border: `2px dashed ${C.inkSoft}`,
                  opacity: calcirTwinOpacity,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
          </div>

          {/* KARTU DATA BERBINGKAI TEGAS (KIRI): JISDOR + TANGGAL WAJIB BERSAMA */}
          <div
            style={{
              position: 'absolute',
              left: cardX,
              top: cardY,
              width: 364,
              height: 204,
              transform: `scale(${cardScale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Tali kertas penggantung ke rel atas */}
            <div style={{position: 'absolute', left: 48, top: -90, width: 3, height: 90, backgroundColor: C.inkSoft}} />
            <div style={{position: 'absolute', right: 48, top: -90, width: 3, height: 90, backgroundColor: C.inkSoft}} />

            <Boil seed="jisdor-card-d03" amp={0.4} rot={0.05}>
              <div
                style={{
                  width: 364,
                  height: 204,
                  backgroundColor: '#FBF7F0',
                  border: `4px solid ${C.ink}`,
                  borderRadius: 10,
                  boxShadow: '3px 8px 14px rgba(0,0,0,0.30)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Pita tanggal wajib: "JUMAT 13 NOVEMBER 2026" */}
                {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                  <div
                    style={{
                    opacity: interpolate(f, [16, 26], [0, 1], CLAMP),
                      backgroundColor: ROOM.terracotta,
                      padding: '9px 14px',
                      textAlign: 'center',
                      fontFamily: FONT.label,
                      fontWeight: 900,
                      fontSize: 17,
                      letterSpacing: '0.06em',
                      color: '#FFFDF9',
                      borderBottom: `3px solid ${C.ink}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    JUMAT 13 NOVEMBER 2026
                  </div>

                <div
                  style={{
                    flex: 1,
                    padding: '12px 16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Keterangan kurs acuan: "KURS ACUAN BANK INDONESIA" */}
                  {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                    <div
                      style={{
                      opacity: interpolate(f, [108, 118], [0, 1], CLAMP),
                        fontFamily: FONT.label,
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: '0.04em',
                        color: C.inkSoft,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      KURS ACUAN BANK INDONESIA
                    </div>

                  {/* Cap "JISDOR" */}
                  {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                    <div
                      style={{
                      opacity: interpolate(f, [152, 162], [0, 1], CLAMP),
                        backgroundColor: ROOM.teal,
                        color: '#FFFDF9',
                        padding: '4px 16px',
                        borderRadius: 999,
                        fontFamily: FONT.label,
                        fontWeight: 900,
                        fontSize: 16,
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      JISDOR
                    </div>

                  {/* Nilai kurs nyata: "US$1 = Rp18.218" */}
                  {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                    <div
                      style={{
                      opacity: interpolate(f, [205, 215], [0, 1], CLAMP),
                        fontFamily: FONT.caption,
                        fontWeight: 900,
                        fontSize: 33,
                        color: C.ink,
                        lineHeight: 1.05,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      US$1 = Rp18.218
                    </div>
                </div>
              </div>
            </Boil>
          </div>

          {/* KARTU ANDAIAN BERBINGKAI PUTUS-PUTUS (KANAN): "US$1 = Rp1.000" */}
          <div
            style={{
              position: 'absolute',
              left: 580,
              top: rightRateCardY,
              width: 256,
              height: 86,
            }}
          >
            {/* Tali kertas penggantung ke rel atas */}
            <div style={{position: 'absolute', left: 38, top: -90, width: 2.5, height: 90, backgroundColor: ROOM.terracotta}} />
            <div style={{position: 'absolute', right: 38, top: -90, width: 2.5, height: 90, backgroundColor: ROOM.terracotta}} />

            <Boil seed="hypo-rate-d03" amp={0.4} rot={0.05}>
              <div
                style={{
                  width: 256,
                  height: 86,
                  backgroundColor: 'rgba(252, 248, 240, 0.94)',
                  border: `3.5px dashed ${ROOM.terracotta}`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 6px 12px rgba(0,0,0,0.22)',
                }}
              >
                {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                  <div
                    style={{
                    opacity: interpolate(f, [578, 588], [0, 1], CLAMP),
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 27,
                      color: ROOM.terracotta,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    US$1 = Rp1.000
                  </div>
              </div>
            </Boil>
          </div>
        </AbsoluteFill>

        {/* LAPISAN 4: Tirai teater terakota & penanda warung kopi di kedua tepi panggung (paralaks 1.2x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 1.2}px, ${camY * 1.2}px) scale(${1 + (camScale - 1) * 1.15})`,
            transformOrigin: '640px 360px',
            pointerEvents: 'none',
          }}
        >
          <CoffeeAndScarfAnchor />
          <TvAnchor />

          {/* Tirai teater kertas terakota kiri */}
          <Paper lift={8}>
            <Slab x={-44} y={-20} w={138} h={760} color={ROOM.terracotta} shade="#6D3927" shadeH={0.12} r={0} grain={0.6} />
            <Slab x={42} y={-20} w={42} h={760} color={C.tag} shade={C.heroLo} shadeH={0.15} r={0} />
            <Slab x={80} y={-20} w={26} h={760} color="#824834" r={0} />
          </Paper>

          {/* Tirai teater kertas terakota kanan */}
          <Paper lift={8}>
            <Slab x={1186} y={-20} w={138} h={760} color={ROOM.terracotta} shade="#6D3927" shadeH={0.12} r={0} grain={0.6} />
            <Slab x={1196} y={-20} w={42} h={760} color={C.tag} shade={C.heroLo} shadeH={0.15} r={0} />
            <Slab x={1174} y={-20} w={26} h={760} color="#824834" r={0} />
          </Paper>
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};