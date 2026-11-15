// Adegan D13: Ukuran Orang Tua Kita (scene 148-153) — teater kertas warung kopi senja hangat.
// Tiga diorama nyata (sawah, rumah, tabungan) bersama sepasang orang tua tanpa wajah, sementara papan kurs kosong berputar membelakangi.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D13_DUR = 365;

const FLOOR_Y = 600;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const SpotlightRing: React.FC<{cx: number; cy: number; r: number; active: number}> = ({cx, cy, r, active}) => {
  if (active <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,66,0.26) 0%, rgba(245,197,66,0.10) 62%, rgba(245,197,66,0) 74%)',
        border: '2.5px dashed rgba(245,197,66,0.45)',
        opacity: active,
        transform: `scale(${0.92 + active * 0.08})`,
        pointerEvents: 'none',
      }}
    />
  );
};

const DioramaPlinth: React.FC<{x: number; y: number; w: number; highlight: number; children: React.ReactNode}> = ({
  x,
  y,
  w,
  highlight,
  children,
}) => (
  <div style={{position: 'absolute', left: x, top: y - 210, width: w, height: 226}}>
    {children}
    {/* Alas diorama berbingkai garis tegas sebagai penanda hal yang nyata */}
    <Paper lift={5}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: w,
          height: 24,
          backgroundColor: C.woodHi,
          border: `3px solid ${highlight > 0.2 ? C.amber : C.inkSoft}`,
          borderRadius: 5,
          boxShadow: '0 6px 12px rgba(28,27,23,0.28)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 6,
            height: 6,
            backgroundColor: highlight > 0.2 ? C.sparkYellow : C.brass,
            borderRadius: 2,
          }}
        />
      </div>
    </Paper>
  </div>
);

const SawahDiorama: React.FC<{x: number; y: number; highlight: number}> = ({x, y, highlight}) => {
  const f = useCurrentFrame();
  const w = 220;
  const stalks = [28, 46, 64, 84, 104, 124, 144, 164, 184];

  return (
    <DioramaPlinth x={x} y={y} w={w} highlight={highlight}>
      <SpotlightRing cx={w / 2} cy={125} r={116} active={highlight} />
      <Boil seed="sawah-d13" amp={0.4} rot={0.05}>
        <Paper lift={4}>
          {/* Bukit latar sawah */}
          <Slab x={12} y={136} w={120} h={66} color={C.sageLo} r="60px 60px 4px 4px" />
          <Slab x={86} y={128} w={122} h={74} color={C.sage} r="64px 64px 4px 4px" />
          {/* Petak tanah sawah */}
          <Slab x={8} y={168} w={204} h={36} color="#8D7B48" shade="#6E5F35" shadeH={0.35} r="14px 14px 4px 4px" />
          {/* Batang dan bulir padi kuning menunduk berisi */}
          {stalks.map((sx, i) => {
            const sway = Math.sin(f * 0.045 + i * 0.7) * 2.4;
            const h = 64 + (i % 3) * 10;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: sx,
                  bottom: 34,
                  width: 14,
                  height: h,
                  transformOrigin: '50% 100%',
                  transform: `rotate(${sway}deg)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 3,
                    bottom: 0,
                    width: 3.5,
                    height: h - 10,
                    backgroundColor: '#7C9456',
                    borderRadius: 2,
                  }}
                />
                {/* Bulir padi menunduk */}
                <div
                  style={{
                    position: 'absolute',
                    left: 3,
                    top: 4,
                    width: 16,
                    height: 24,
                    backgroundColor: C.sparkYellow,
                    border: `1.5px solid ${C.brassLo}`,
                    borderRadius: '40% 70% 60% 40%',
                    transform: 'rotate(28deg)',
                  }}
                />
              </div>
            );
          })}
        </Paper>
      </Boil>
    </DioramaPlinth>
  );
};

const RumahDiorama: React.FC<{x: number; y: number; highlight: number}> = ({x, y, highlight}) => {
  const f = useCurrentFrame();
  const w = 224;

  // Tumbuh lapis demi lapis di tempat pada scene 151 (rel 210-235)
  const wallProg = interpolate(f, [205, 217], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const roofProg = interpolate(f, [213, 225], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const doorProg = interpolate(f, [221, 233], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const smokeDrift = ((f - 230) * 0.35) % 26;

  return (
    <DioramaPlinth x={x} y={y} w={w} highlight={highlight}>
      <SpotlightRing cx={w / 2} cy={120} r={118} active={highlight} />
      <Boil seed="rumah-d13" amp={0.4} rot={0.05}>
        <Paper lift={4}>
          {/* Halaman & pohon kampung di sisi kiri */}
          <Slab x={10} y={184} w={204} h={20} color={C.sageLo} r="8px 8px 3px 3px" />
          <Slab x={26} y={134} w={10} h={52} color={C.woodLo} r={3} />
          <Slab x={10} y={96} w={42} h={46} color={C.sage} r="50%" />
          <Slab x={22} y={84} w={34} h={36} color="#9BB095" r="50%" />

          {/* Lapis 1: Dinding rumah kampung */}
          <div
            style={{
              position: 'absolute',
              left: 62,
              bottom: 22,
              width: 126,
              height: 76,
              transformOrigin: '50% 100%',
              transform: `scaleY(${0.15 + wallProg * 0.85})`,
              opacity: interpolate(wallProg, [0, 0.2], [0, 1], CLAMP),
            }}
          >
            <Slab x={0} y={0} w={126} h={76} color={C.creamHi} shade={C.creamLo} shadeH={0.22} r={4} />
            <Slab x={0} y={58} w={126} h={18} color={C.wood} r="0 0 4px 4px" />
          </div>

          {/* Lapis 2: Atap kampung + cerobong */}
          <div
            style={{
              position: 'absolute',
              left: 48,
              top: 56,
              width: 154,
              height: 58,
              transform: `translateY(${(1 - roofProg) * -28}px) scale(${0.85 + roofProg * 0.15})`,
              opacity: interpolate(roofProg, [0, 0.25], [0, 1], CLAMP),
            }}
          >
            {/* Cerobong kecil */}
            <Slab x={108} y={4} w={16} h={24} color={C.woodLo} r={2} />
            {/* Atap limas kertas */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 12,
                width: 154,
                height: 44,
                backgroundColor: '#B8643E',
                clipPath: 'polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.22)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 48,
                width: 142,
                height: 8,
                backgroundColor: '#8E472A',
                borderRadius: 3,
              }}
            />
          </div>

          {/* Lapis 3: Pintu kayu & jendela hangat bercahaya */}
          <div
            style={{
              position: 'absolute',
              left: 62,
              bottom: 22,
              width: 126,
              height: 76,
              transform: `scale(${0.6 + doorProg * 0.4})`,
              opacity: interpolate(doorProg, [0, 0.3], [0, 1], CLAMP),
            }}
          >
            {/* Pintu */}
            <Slab x={20} y={24} w={28} h={52} color={C.woodLo} hi={C.woodHi} hiH={0.12} r="4px 4px 0 0" />
            <div
              style={{
                position: 'absolute',
                left: 41,
                top: 48,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: C.sparkYellow,
              }}
            />
            {/* Jendela hangat */}
            <div
              style={{
                position: 'absolute',
                left: 66,
                top: 26,
                width: 38,
                height: 28,
                backgroundColor: C.sparkYellow,
                border: `3px solid ${C.woodLo}`,
                borderRadius: 3,
                boxShadow: '0 0 12px rgba(245,197,66,0.55)',
              }}
            >
              <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2.5, backgroundColor: C.woodLo}} />
              <div style={{position: 'absolute', top: '50%', left: 0, right: 0, height: 2.5, backgroundColor: C.woodLo}} />
            </div>
          </div>

          {/* Asap tipis tenang setelah rumah berdiri */}
          {f > 232 ? (
            <div
              style={{
                position: 'absolute',
                left: 160,
                top: 38 - smokeDrift,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: C.creamHi,
                opacity: interpolate(smokeDrift, [0, 13, 26], [0, 0.45, 0], CLAMP),
              }}
            />
          ) : null}
        </Paper>
      </Boil>
    </DioramaPlinth>
  );
};

const TabunganDiorama: React.FC<{x: number; y: number; highlight: number}> = ({x, y, highlight}) => {
  const f = useCurrentFrame();
  const w = 220;

  // 5 koin kuning madu jatuh satu demi satu pada scene 152 (rel 260-286)
  const coinCues = [258, 264, 270, 276, 282];
  const landedCount = coinCues.reduce((acc, cue) => {
    const p = interpolate(f, [cue, cue + 7], [0, 1], CLAMP);
    return acc + p;
  }, 0);

  const baseFill = 26;
  const fillHeight = baseFill + landedCount * 9.5;

  return (
    <DioramaPlinth x={x} y={y} w={w} highlight={highlight}>
      <SpotlightRing cx={w / 2} cy={120} r={116} active={highlight} />
      <Boil seed="tabungan-d13" amp={0.4} rot={0.05}>
        <Paper lift={4}>
          {/* Meja kayu pedesaan */}
          <Slab x={24} y={146} w={172} h={14} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
          <Slab x={40} y={160} w={14} h={44} color={C.woodLo} r={2} />
          <Slab x={166} y={160} w={14} h={44} color={C.woodLo} r={2} />

          {/* Badan toples kertas kalkir tembus pandang */}
          <div
            style={{
              position: 'absolute',
              left: 72,
              top: 56,
              width: 76,
              height: 90,
              backgroundColor: 'rgba(243, 238, 230, 0.56)',
              border: `3px solid ${C.creamLo}`,
              borderRadius: '14px 14px 10px 10px',
              overflow: 'hidden',
              boxShadow: 'inset 6px 0 0 rgba(255,255,255,0.35)',
            }}
          >
            {/* Tumpukan koin kuning madu yang naik */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                right: 4,
                bottom: 3,
                height: fillHeight,
                backgroundColor: C.sparkYellow,
                borderTop: `4px solid ${C.brass}`,
                borderRadius: '4px 4px 6px 6px',
              }}
            >
              {[10, 20, 30, 40, 50, 60, 70].map((ly) => (
                <div
                  key={ly}
                  style={{
                    position: 'absolute',
                    left: 4,
                    right: 4,
                    bottom: ly,
                    height: 2,
                    backgroundColor: C.brassLo,
                    opacity: 0.45,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Leher toples */}
          <Slab x={80} y={46} w={60} h={12} color={C.creamHi} shade={C.creamLo} shadeH={0.3} r={4} />

          {/* Koin kuning madu polos jatuh satu per satu ke dalam toples */}
          {coinCues.map((cue, idx) => {
            const p = interpolate(f, [cue, cue + 7], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)});
            if (p <= 0 || p >= 1) return null;
            const cy = interpolate(p, [0, 1], [14, 112 - idx * 7]);
            const cx = 101 + ((idx % 3) - 1) * 8;
            return (
              <div
                key={cue}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: C.sparkYellow,
                  border: `2.5px solid ${C.brassLo}`,
                }}
              />
            );
          })}
        </Paper>
      </Boil>
    </DioramaPlinth>
  );
};

const ElderlyCouple: React.FC<{cx: number; y: number}> = ({cx, y}) => {
  const f = useCurrentFrame();

  // Ayunan napas sangat halus & anggukan tenang mengikuti tiap diorama (tanpa menoleh ke kanan)
  const breath = Math.sin(f * 0.055) * 1.4;
  const nodSawah = interpolate(f, [164, 174, 192, 202], [0, -3.5, -3.5, 0], CLAMP);
  const nodRumah = interpolate(f, [208, 218, 234, 244], [0, -2.5, -2.5, 0], CLAMP);
  const nodTabungan = interpolate(f, [258, 268, 286, 296], [0, 3.0, 3.0, 0], CLAMP);
  const gazeTilt = nodSawah + nodRumah + nodTabungan;

  return (
    <div style={{position: 'absolute', left: cx - 75, top: y - 196, width: 150, height: 196}}>
      <Boil seed="orang-tua-d13" amp={0.4} rot={0.05}>
        <Paper lift={6}>
          {/* Ibu (lebih tua, sedikit membungkuk ke kiri) */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              bottom: 0,
              width: 58,
              height: 174,
              transformOrigin: '50% 100%',
              transform: `translateY(${breath * 0.6}px)`,
            }}
          >
            {/* Kaki & sandal kertas */}
            <Slab x={18} y={142} w={10} h={32} color={C.inkSoft} r={3} />
            <Slab x={32} y={142} w={10} h={32} color={C.inkSoft} r={3} />
            {/* Kain panjang bawah */}
            <Slab x={12} y={96} w={36} h={52} color="#8E4E37" shade="#6E3B29" shadeH={0.25} r="6px 6px 4px 4px" />
            {/* Badan atas sedikit membungkuk */}
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 44,
                width: 42,
                height: 58,
                transformOrigin: '50% 100%',
                transform: 'rotate(-8deg)',
              }}
            >
              <Slab x={2} y={0} w={38} h={56} color={C.sage} shade={C.sageLo} shadeH={0.22} r="14px 12px 6px 6px" />
              {/* Selendang bahu hangat */}
              <Slab x={6} y={4} w={12} h={48} color={C.tape} r={4} />
            </div>
            {/* Kepala bulat TANPA WAJAH + sanggul perak */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 6,
                width: 44,
                height: 38,
                transformOrigin: '50% 90%',
                transform: `rotate(${-6 + gazeTilt}deg)`,
              }}
            >
              {/* Sanggul rambut putih-perak di belakang (kanan) */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 8,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#A8A29A',
                  border: `2px solid ${C.inkSoft}`,
                }}
              />
              {/* Kepala bulat polos tanpa mata/hidung/mulut */}
              <div
                style={{
                  position: 'absolute',
                  left: 2,
                  top: 2,
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: C.creamLo,
                  border: `2.5px solid ${C.inkSoft}`,
                }}
              />
            </div>
          </div>

          {/* Bapak (lebih tua, sedikit membungkuk ke kiri dengan tongkat kayu) */}
          <div
            style={{
              position: 'absolute',
              left: 74,
              bottom: 0,
              width: 66,
              height: 188,
              transformOrigin: '50% 100%',
              transform: `translateY(${-breath * 0.5}px)`,
            }}
          >
            {/* Tongkat kayu sederhana */}
            <Slab x={4} y={78} w={6} h={110} color={C.woodLo} rot={5} r={3} />
            <Slab x={2} y={74} w={14} h={7} color={C.woodHi} r={4} />

            {/* Kaki */}
            <Slab x={20} y={146} w={12} h={42} color={C.inkSoft} r={4} />
            <Slab x={36} y={146} w={12} h={42} color={C.inkSoft} r={4} />

            {/* Badan atas sedikit membungkuk */}
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: 48,
                width: 46,
                height: 102,
                transformOrigin: '50% 100%',
                transform: 'rotate(-9deg)',
              }}
            >
              <Slab x={2} y={0} w={42} h={100} color={C.cream} shade={C.creamLo} shadeH={0.22} r="16px 14px 8px 8px" />
              {/* Rompi hangat */}
              <Slab x={6} y={6} w={34} h={64} color={C.woodHi} shade={C.wood} shadeH={0.2} r="12px 10px 4px 4px" />
            </div>

            {/* Kepala bulat TANPA WAJAH + rambut/peci perak */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 6,
                width: 40,
                height: 40,
                transformOrigin: '50% 90%',
                transform: `rotate(${-7 + gazeTilt}deg)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 2,
                  top: 2,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: C.creamLo,
                  border: `2.5px solid ${C.inkSoft}`,
                }}
              />
              {/* Rambut perak di bagian atas-belakang kepala */}
              <div
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 1,
                  width: 32,
                  height: 16,
                  borderRadius: '18px 18px 4px 4px',
                  backgroundColor: '#9E9890',
                }}
              />
            </div>
          </div>
        </Paper>
      </Boil>
    </div>
  );
};

const BlankExchangeBoard: React.FC<{cx: number; y: number}> = ({cx, y}) => {
  const f = useCurrentFrame();

  // Papan kurs kosong perlahan berputar membelakangi pada scene 153 (rel 312-352)
  const rotY = interpolate(f, [312, 352], [-14, 166], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const isBack = rotY > 90;

  return (
    <div style={{position: 'absolute', left: cx - 58, top: y - 190, width: 116, height: 190}}>
      <Boil seed="papan-kurs-d13" amp={0.4} rot={0.05}>
        <Paper lift={5}>
          {/* Tiang penyangga papan di lantai panggung */}
          <Slab x={53} y={118} w={10} h={72} color={C.woodLo} r={3} />
          <Slab x={30} y={180} w={56} h={10} color={C.wood} r={4} />

          {/* Badan papan berbingkai garis PUTUS-PUTUS (andaian) yang berputar membelakangi */}
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 6,
              width: 104,
              height: 124,
              transform: `perspective(700px) rotateY(${rotY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {!isBack ? (
              /* Sisi depan papan kurs: KOSONG total tanpa isi maupun angka */
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: C.board,
                  border: `3px dashed ${C.tape}`,
                  borderRadius: 6,
                  padding: 10,
                  boxShadow: '0 6px 14px rgba(0,0,0,0.32)',
                }}
              >
                <div style={{width: '100%', height: 18, backgroundColor: C.boardHi, borderRadius: 3, marginBottom: 10}} />
                <div style={{width: '100%', height: 22, backgroundColor: C.boardLo, borderRadius: 3, marginBottom: 8}} />
                <div style={{width: '100%', height: 22, backgroundColor: C.boardLo, borderRadius: 3, marginBottom: 8}} />
                <div style={{width: '100%', height: 16, backgroundColor: C.boardHi, borderRadius: 3}} />
              </div>
            ) : (
              /* Sisi belakang papan kurs saat berputar membelakangi */
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#A88256',
                  border: `3px dashed ${C.woodLo}`,
                  borderRadius: 6,
                  transform: 'scaleX(-1)',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.32)',
                }}
              >
                {/* Tulang kayu belakang & selotip kertas polos */}
                <Slab x={46} y={6} w={12} h={112} color={C.woodLo} r={2} />
                <Slab x={14} y={24} w={76} h={10} color={C.wood} r={2} />
                <Slab x={14} y={88} w={76} h={10} color={C.wood} r={2} />
                <Slab x={22} y={48} w={28} h={12} color={C.tape} rot={-6} r={1} />
              </div>
            )}
          </div>
        </Paper>
      </Boil>
    </div>
  );
};

const WarungEdgeAnchor: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const steam1 = (f * 0.45) % 28;
  const steam2 = ((f + 14) * 0.45) % 28;

  return (
    <div style={{position: 'absolute', left: x, top: y - 180, width: 96, height: 180}}>
      <Boil seed="warung-anchor-d13" amp={0.4} rot={0.05}>
        <Paper lift={5}>
          {/* Kait kayu dengan syal terakota penanda dunia yang sama */}
          <Slab x={10} y={16} w={8} h={164} color={C.woodLo} r={3} />
          <Slab x={4} y={172} w={24} h={8} color={C.wood} r={3} />
          <Slab x={14} y={32} w={14} h={6} color={C.brass} r={2} />
          <Slab x={16} y={36} w={14} h={68} color={C.tag} shade={C.heroLo} shadeH={0.2} rot={3} r="4px 4px 2px 2px" />
          <Slab x={22} y={40} w={11} h={56} color={C.hero} rot={-4} r="3px 3px 2px 2px" />

          {/* Meja kecil warung & gelas kopi kertas bertuap */}
          <Slab x={34} y={128} w={54} h={10} color={C.woodHi} shade={C.wood} shadeH={0.35} r={3} />
          <Slab x={42} y={138} w={8} h={42} color={C.woodLo} r={2} />
          <Slab x={72} y={138} w={8} h={42} color={C.woodLo} r={2} />

          {/* Gelas kopi kertas polos */}
          <div
            style={{
              position: 'absolute',
              left: 49,
              top: 100,
              width: 24,
              height: 28,
              backgroundColor: C.creamHi,
              clipPath: 'polygon(6% 0%, 94% 0%, 84% 100%, 16% 100%)',
            }}
          />
          <Slab x={47} y={96} w={28} h={5} color={C.creamLo} r={2} />
          <Slab x={51} y={109} w={20} h={9} color={C.tape} r={1} />

          {/* Uap kopi tipis */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 86 - steam1,
              width: 6,
              height: 12,
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              opacity: interpolate(steam1, [0, 12, 28], [0, 0.55, 0], CLAMP),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 63,
              top: 84 - steam2,
              width: 5,
              height: 11,
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              opacity: interpolate(steam2, [0, 12, 28], [0, 0.45, 0], CLAMP),
            }}
          />
        </Paper>
      </Boil>
    </div>
  );
};

export const D13: React.FC = () => {
  const f = useCurrentFrame();

  // Tirai teater terakota terbuka di awal (scene 148, rel 0-36) lalu bingkai tepi panggung
  const curtainOpen = interpolate(f, [0, 36], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const leftCurtainX = interpolate(curtainOpen, [0, 1], [0, -560]);
  const rightCurtainX = interpolate(curtainOpen, [0, 1], [640, 1200]);

  // Gerak kamera berkesinambungan tanpa potongan (berhenti rapi di frame 350, ditahan sampai 365):
  // 1) Dolly-in pelan (30-145) -> 2) Pan kiri ke sawah (145-195) -> 3) Geser ke rumah (195-242)
  // -> 4) Geser ke toples tabungan (242-292) -> 5) Pull-out ke bidikan lebar akhir (292-350)
  const camScale = interpolate(
    f,
    [0, 32, 145, 195, 242, 292, 350],
    [1.0, 1.0, 1.15, 1.24, 1.24, 1.25, 1.0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camX = interpolate(
    f,
    [0, 32, 145, 195, 242, 292, 350],
    [0, 0, 24, 275, 120, -185, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camY = interpolate(
    f,
    [0, 32, 145, 195, 242, 292, 350],
    [0, 0, 16, 26, 24, 26, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Sorotan hangat tiap diorama sesuai jendela narasi
  const sawahHighlight = interpolate(f, [162, 170, 192, 202], [0, 1, 1, 0], CLAMP);
  const rumahHighlight = interpolate(f, [206, 214, 234, 244], [0, 1, 1, 0], CLAMP);
  const tabunganHighlight = interpolate(f, [256, 264, 286, 296], [0, 1, 1, 0], CLAMP);

  // Debu kertas melayang sangat pelan
  const dustParticles = [
    {x: 210, y: 240, r: 4, phase: 0.2},
    {x: 420, y: 190, r: 3.5, phase: 1.4},
    {x: 640, y: 220, r: 4.5, phase: 2.6},
    {x: 860, y: 175, r: 3.5, phase: 3.8},
    {x: 1030, y: 250, r: 4, phase: 5.0},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#5B4B49'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPIS 1 (LATAR): Langit senja hangat, matahari kertas, bukit jauh & sorot lampu */}
        <AbsoluteFill
          style={{
            transformOrigin: '50% 55%',
            transform: `translate(${camX * 0.45}px, ${camY * 0.45}px) scale(${1 + (camScale - 1) * 0.65})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -80,
              background: 'linear-gradient(180deg, #5A4B4E 0%, #8E6852 42%, #D49B63 78%, #E5BC84 100%)',
            }}
          />
          {/* Matahari senja potongan kertas */}
          <PopIn at={4}>
            <div
              style={{
                position: 'absolute',
                left: 515,
                top: 235,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #F9D876 0%, #F3B34C 72%, rgba(243,179,76,0) 74%)',
                opacity: 0.85,
              }}
            />
          </PopIn>

          {/* Pegunungan kertas berlapis di kejauhan */}
          <Paper lift={2}>
            <Slab x={-80} y={435} w={560} h={190} color="#7D6250" r="260px 240px 0 0" />
            <Slab x={340} y={420} w={620} h={205} color="#6D584B" r="280px 280px 0 0" />
            <Slab x={820} y={440} w={560} h={185} color="#78604E" r="240px 240px 0 0" />
          </Paper>

          {/* Tiga berkas lampu sorot kuning madu lembut dari atas panggung */}
          {[250, 560, 895].map((bx, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: bx - 145,
                top: -40,
                width: 290,
                height: 660,
                background: 'linear-gradient(180deg, rgba(245,197,66,0.22) 0%, rgba(245,197,66,0.03) 100%)',
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Debu kertas melayang sangat lambat */}
          {dustParticles.map((d, idx) => {
            const dy = Math.sin(f * 0.025 + d.phase) * 10;
            const dx = Math.cos(f * 0.02 + d.phase) * 8;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: d.x + dx,
                  top: d.y + dy,
                  width: d.r,
                  height: d.r,
                  borderRadius: '50%',
                  backgroundColor: '#F9E4B0',
                  opacity: 0.45,
                }}
              />
            );
          })}
        </AbsoluteFill>

        {/* LAPIS 2 (TENGAH): Lantai panggung, 3 diorama hangat, sepasang orang tua, papan kurs & jangkar warung */}
        <AbsoluteFill
          style={{
            transformOrigin: '50% 62%',
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          }}
        >
          {/* Lantai papan kertas krem hangat */}
          <Slab x={-140} y={FLOOR_Y} w={1560} h={180} color={C.cream} shade={C.creamLo} shadeH={0.28} r={0} grain={0.5} />
          <div style={{position: 'absolute', left: -140, right: -140, top: FLOOR_Y + 34, height: 2.5, backgroundColor: C.creamLo}} />
          <div style={{position: 'absolute', left: -140, right: -140, top: FLOOR_Y + 72, height: 2.5, backgroundColor: C.creamLo}} />
          <Slab x={-140} y={FLOOR_Y - 14} w={1560} h={16} color={C.wood} shade={C.woodLo} shadeH={0.4} r={0} />

          {/* Penanda warung kopi & syal terakota di tepi kiri panggung */}
          <WarungEdgeAnchor x={74} y={FLOOR_Y} />

          {/* Diorama 1: Sawah yang panen (kiri) */}
          <SawahDiorama x={174} y={FLOOR_Y - 6} highlight={sawahHighlight} />

          {/* Diorama 2: Rumah kampung berdiri lapis demi lapis (tengah-kiri) */}
          <RumahDiorama x={410} y={FLOOR_Y - 6} highlight={rumahHighlight} />

          {/* Sepasang siluet orang tua tanpa wajah di tengah */}
          <ElderlyCouple cx={712} y={FLOOR_Y} />

          {/* Diorama 3: Toples koin kuning madu di meja kayu (tengah-kanan) */}
          <TabunganDiorama x={808} y={FLOOR_Y - 6} highlight={tabunganHighlight} />

          {/* Papan kurs kosong di pojok kanan yang perlahan berputar membelakangi */}
          <BlankExchangeBoard cx={1112} y={FLOOR_Y} />
        </AbsoluteFill>

        {/* LAPIS 3 (DEPAN): Tirai teater terakota di kedua sisi & vinyet senja hangat */}
        <AbsoluteFill
          style={{
            transformOrigin: '50% 50%',
            transform: `translate(${camX * 1.12}px, ${camY * 1.06}px) scale(${1 + (camScale - 1) * 1.1})`,
            pointerEvents: 'none',
          }}
        >
          {/* Tirai terakota kiri */}
          <div style={{position: 'absolute', left: leftCurtainX, top: -20, width: 640, height: 760}}>
            <Paper lift={10}>
              <Slab x={0} y={0} w={640} h={760} color="#9A5A42" shade="#733F2C" shadeH={0.18} r={0} grain={0.5} />
              {[120, 260, 400, 540].map((px) => (
                <div
                  key={px}
                  style={{
                    position: 'absolute',
                    left: px,
                    top: 0,
                    bottom: 0,
                    width: 24,
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.22), rgba(255,255,255,0.06))',
                  }}
                />
              ))}
              {/* Tali pengikat tirai emas hangat */}
              <Slab x={560} y={390} w={84} h={16} color={C.brass} r={8} />
            </Paper>
          </div>

          {/* Tirai terakota kanan */}
          <div style={{position: 'absolute', left: rightCurtainX, top: -20, width: 640, height: 760}}>
            <Paper lift={10}>
              <Slab x={0} y={0} w={640} h={760} color="#9A5A42" shade="#733F2C" shadeH={0.18} r={0} grain={0.5} />
              {[80, 220, 360, 500].map((px) => (
                <div
                  key={px}
                  style={{
                    position: 'absolute',
                    left: px,
                    top: 0,
                    bottom: 0,
                    width: 24,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(0,0,0,0.22))',
                  }}
                />
              ))}
              <Slab x={-4} y={390} w={84} h={16} color={C.brass} r={8} />
            </Paper>
          </div>

          {/* Pelmet lengkung tirai teater bagian atas */}
          <Paper lift={12}>
            <Slab x={-40} y={-24} w={1360} h={58} color="#824934" shade="#5E3323" shadeH={0.35} r="0 0 24px 24px" />
          </Paper>

          {/* Vinyet senja hangat lembut */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 48%, rgba(255,224,160,0.06) 0%, rgba(0,0,0,0) 54%, rgba(36,22,14,0.34) 100%)',
            }}
          />
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};