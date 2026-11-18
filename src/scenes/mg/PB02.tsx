// Adegan MG-02 Uangnya Ada: satu koin emas menerangi panggung gelap, kalender sepuluh bulan membalik, dan angka pajak 1.796,8 triliun rupiah mengunci.
// Gaya papercut Dunia Bocor dengan pendaran emas hangat pada koin dan roda angka kertas yang berhenti tepat di akhir kalimat.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, Pill, PopIn, Slab, Stage} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {Disc, SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {Plant, Shelf, Window} from '../../lib/paper/sets';

export const PB02_DUR = 372;
export const DUR = PB02_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

// Koin kertas bulat polos dengan cincin timbul (tanpa wajah, angka, atau lambang)
const KoinDepan: React.FC<{cx: number; cy: number; r?: number; glow?: number}> = ({
  cx,
  cy,
  r = 38,
  glow = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx,
      top: cy,
      width: r * 2,
      height: r * 2,
      translate: '-50% -50%',
      borderRadius: '50%',
      backgroundColor: '#F2A93B',
      border: `4px solid #C88A28`,
      boxShadow:
        glow > 0
          ? `0 0 ${Math.round(28 * glow)}px rgba(245, 197, 66, ${0.75 * glow}), 2px 6px 10px rgba(0,0,0,0.45)`
          : '2px 6px 10px rgba(0,0,0,0.45)',
    }}
  >
    {/* Sorotan bulan sabit kertas di kiri atas */}
    <div
      style={{
        position: 'absolute',
        inset: 4,
        borderRadius: '50%',
        borderTop: '4px solid #FFE082',
        borderLeft: '3px solid #FFE082',
        opacity: 0.85,
      }}
    />
    {/* Cincin timbul di bagian dalam koin */}
    <div
      style={{
        position: 'absolute',
        inset: Math.round(r * 0.28),
        borderRadius: '50%',
        border: '3px solid #B8791E',
        backgroundColor: '#F5C542',
        boxShadow: 'inset 1px 2px 3px rgba(255,255,255,0.45)',
      }}
    />
  </div>
);

// Keping koin tampak samping untuk menyusun menara koin tinggi
const KepingKoin: React.FC<{
  cx: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  lit?: boolean;
}> = ({cx, y, w, h, offsetX, lit = false}) => (
  <div
    style={{
      position: 'absolute',
      left: cx + offsetX,
      top: y,
      width: w,
      height: h,
      translate: '-50% 0',
      borderRadius: 6,
      backgroundColor: lit ? '#F5C542' : '#E8A838',
      border: '2px solid #9C6B19',
      boxShadow: lit
        ? '0 0 18px rgba(245, 197, 66, 0.7), 1px 3px 5px rgba(0,0,0,0.42)'
        : '1px 3px 5px rgba(0,0,0,0.42)',
      overflow: 'hidden',
    }}
  >
    {/* Garis kilau kertas bagian atas */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Math.max(3, Math.round(h * 0.26)),
        backgroundColor: '#FFE28A',
      }}
    />
    {/* Bayangan tepi bawah */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Math.max(3, Math.round(h * 0.24)),
        backgroundColor: '#B87A1E',
      }}
    />
    {/* Garis alur cincin timbul di sisi koin */}
    <div
      style={{
        position: 'absolute',
        left: '16%',
        right: '16%',
        top: '46%',
        height: 2,
        backgroundColor: '#9C6B19',
        opacity: 0.65,
      }}
    />
  </div>
);

// Menara koin emas yang tumbuh dari lantai panggung hingga menjadi benda tertinggi di layar
const MenaraKoin: React.FC<{cx: number}> = ({cx}) => {
  const f = useCurrentFrame();
  const totalCoins = 28;
  const coinW = 144;
  const coinH = 16;

  // Tinggi pertumbuhan menara mengikuti jalannya kalender dan angka
  const stackProgress = interpolate(f, [36, 100, 220, 326], [1, 7, 21, totalCoins], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const settledCount = Math.floor(stackProgress);
  const currentHeight = Math.min(totalCoins, stackProgress) * coinH;

  const towerGlow = interpolate(f, [22, 90, 320, 350], [0.45, 0.75, 0.9, 1], CLAMP);

  // Koin tunggal Beat 1 jatuh dan berpendar emas di tengah panggung gelap (f: 2..24)
  const firstDropY = interpolate(stepFrame(f, 2), [2, 22], [-70, FLOOR_Y - 38], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const firstSquash = interpolate(f, [22, 26, 32], [1, 0.84, 1], CLAMP);
  const firstOpacity = interpolate(f, [34, 42], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Pendaran cahaya emas hangat di belakang menara koin */}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: FLOOR_Y - currentHeight / 2 - 20,
          width: 440,
          height: Math.max(260, currentHeight + 220),
          translate: '-50% -50%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(245, 197, 66, 0.44) 0%, rgba(242, 169, 59, 0.16) 52%, rgba(0, 0, 0, 0) 76%)',
          opacity: towerGlow,
        }}
      />

      {/* Koin Beat 1 tampak depan yang jatuh dan menyala di awal adegan */}
      {firstOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: firstDropY,
            transform: `scale(${2 - firstSquash}, ${firstSquash})`,
            opacity: firstOpacity,
          }}
        >
          <KoinDepan cx={0} cy={0} r={40} glow={1} />
        </div>
      )}

      {/* Tumpukan keping koin emas yang sudah mendarat */}
      {Array.from({length: totalCoins}).map((_, idx) => {
        if (idx >= settledCount) return null;
        const targetY = FLOOR_Y - (idx + 1) * coinH;
        // Sedikit variasi geser horizontal khas tumpukan kertas buatan tangan
        const jitter = ((idx * 7) % 5 - 2) * 2.2;
        const isTop = idx === settledCount - 1;
        return (
          <KepingKoin
            key={idx}
            cx={cx}
            y={targetY}
            w={coinW}
            h={coinH}
            offsetX={jitter}
            lit={isTop || idx % 4 === 0}
          />
        );
      })}

      {/* Keping koin yang sedang jatuh menuju puncak tumpukan */}
      {settledCount < totalCoins && f >= 34 && (
        <KepingKoin
          cx={cx}
          y={interpolate(
            stackProgress - settledCount,
            [0, 1],
            [Math.max(-40, FLOOR_Y - (settledCount + 1) * coinH - 135), FLOOR_Y - (settledCount + 1) * coinH],
            CLAMP,
          )}
          w={coinW}
          h={coinH}
          offsetX={((settledCount * 7) % 5 - 2) * 2.2}
          lit
        />
      )}
    </AbsoluteFill>
  );
};

// Kalender 10 lembar kertas yang membalik satu per satu tanpa angka/nama bulan, lalu terbuka "akhir Oktober 2026"
const KalenderSepuluhBulan: React.FC = () => {
  const f = useCurrentFrame();

  const enterU = interpolate(f, [76, 92], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const enterY = interpolate(enterU, [0, 1], [60, 0], CLAMP);

  // 10 lembar membalik dari frame 88 sampai frame 204
  const totalFlips = 10;
  const flipStart = 88;
  const flipEnd = 204;
  const flipProgress = interpolate(f, [flipStart, flipEnd], [0, totalFlips], CLAMP);
  const activeSheet = Math.min(totalFlips - 1, Math.floor(flipProgress));
  const sheetLocal = flipProgress - Math.floor(flipProgress);
  const isFinalRevealed = f >= flipEnd - 4;

  const sheetTints = ['#D9C7A3', '#CFC09E', '#D5C4A1', '#C8B894', '#D9C7A3'];

  return (
    <div
      style={{
        position: 'absolute',
        left: 82,
        top: 242 + enterY,
        width: 292,
        height: 256,
        opacity: enterU,
      }}
    >
      <AbsoluteFill>
        <Paper lift={6}>
          {/* Dudukan papan kayu kalender */}
          <Slab
            x={0}
            y={18}
            w={292}
            h={232}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.14}
            r={8}
            grain={0.7}
          />
          {/* Tumpukan dasar kertas kalender */}
          <Slab
            x={14}
            y={32}
            w={264}
            h={204}
            color="#B8A682"
            shade="#998867"
            shadeH={0.12}
            r={4}
          />

          {/* Lembar akhir yang terbuka: "akhir Oktober 2026" */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 28,
              width: 264,
              height: 202,
              backgroundColor: '#E8DFD3',
              borderRadius: 4,
              border: `2px solid ${C.inkSoft}`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.28)',
              overflow: 'hidden',
            }}
          >
            {/* Pita atas lembar kalender */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 36,
                backgroundColor: C.tag,
              }}
            />
            {/* Garis kisi kalender abstrak (tanpa angka) */}
            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                top: 52,
                height: 4,
                backgroundColor: '#C5B496',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                bottom: 24,
                height: 4,
                backgroundColor: '#C5B496',
              }}
            />

            {/* Teks tanggal dari naskah muncul saat lembar ke-10 terbuka */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 72,
                textAlign: 'center',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 30,
                lineHeight: 1.15,
                color: C.ink,
                opacity: interpolate(f, [198, 208], [0, 1], CLAMP),
              }}
            >
              akhir Oktober 2026
            </div>
          </div>

          {/* Lembar-lembar kosong yang membalik ke atas satu per satu */}
          {!isFinalRevealed && (
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 28,
                width: 264,
                height: 202,
                backgroundColor: sheetTints[activeSheet % sheetTints.length],
                borderRadius: 4,
                border: `2px solid ${C.inkSoft}`,
                transformOrigin: '50% 0%',
                transform: `perspective(700px) rotateX(${interpolate(
                  sheetLocal,
                  [0, 0.25, 1],
                  [0, 12, 115],
                  CLAMP,
                )}deg)`,
                opacity: interpolate(sheetLocal, [0, 0.72, 1], [1, 0.95, 0], CLAMP),
                boxShadow: '0 6px 10px rgba(0,0,0,0.34)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 36,
                  backgroundColor: '#7D6A52',
                }}
              />
              {/* Kisi kotak kosong abstrak tanpa angka dan tanpa nama bulan */}
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  style={{
                    position: 'absolute',
                    left: 22,
                    right: 22,
                    top: 56 + row * 42,
                    height: 26,
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  {[0, 1, 2, 3].map((col) => (
                    <div
                      key={col}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(46, 34, 26, 0.14)',
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Tiga ring pengikat kuningan di bagian atas kalender */}
          {[58, 146, 234].map((rx, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: rx - 8,
                top: 6,
                width: 16,
                height: 32,
                borderRadius: 8,
                backgroundColor: C.brass,
                border: `2px solid ${C.brassLo}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </Paper>
      </AbsoluteFill>

      {/* Label kecil "10 bulan" menempel di bagian bawah kalender saat lembar ke-10 terbuka */}
      <AbsoluteFill>
        <PopIn at={202}>
          <Boil seed="pill-10-bulan" amp={0.4} rot={0.05}>
            <Pill x={146} y={248} text="10 bulan" bg={C.ink} color="#F3E6D3" size={28} />
          </Boil>
        </PopIn>
      </AbsoluteFill>
    </div>
  );
};

// Satu roda digit kertas yang berputar vertikal lalu mengunci tepat di digit target
const RodaDigit: React.FC<{
  target: number;
  startFrame: number;
  stopFrame: number;
  spins: number;
}> = ({target, startFrame, stopFrame, spins}) => {
  const f = useCurrentFrame();
  const cellH = 82;
  const totalSteps = spins * 10 + target;

  const u = interpolate(f, [startFrame, stopFrame], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Pantulan mekanis halus 3px saat roda terkunci
  const settle = interpolate(f, [stopFrame, stopFrame + 4, stopFrame + 9], [0, 4, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  const stepPos = totalSteps * u;
  const wrappedStep = stepPos % 10;
  const translateY = -wrappedStep * cellH + settle;

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div
      style={{
        position: 'relative',
        width: 44,
        height: cellH,
        overflow: 'hidden',
        backgroundColor: '#241D18',
        borderRadius: 5,
        border: '1px solid #4A3B2E',
        boxShadow: 'inset 0 6px 8px rgba(0,0,0,0.75), inset 0 -6px 8px rgba(0,0,0,0.75)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {digits.map((d, idx) => (
          <div
            key={idx}
            style={{
              width: 44,
              height: cellH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 56,
              lineHeight: 1,
              color: f >= stopFrame ? '#F5C542' : '#E8DFD3',
              textShadow: f >= stopFrame ? '0 0 12px rgba(245,197,66,0.45)' : 'none',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

// Papan angka kertas besar: "1.796,8 triliun rupiah" mengunci tepat di frame 348
const PapanAngkaPajak: React.FC = () => {
  const f = useCurrentFrame();
  const locked = f >= 348;
  const lockGlow = interpolate(f, [346, 356], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <PopIn at={218}>
        <Boil seed="papan-angka" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 592,
              top: 326,
              width: 636,
              height: 184,
              backgroundColor: '#D9C7A3',
              borderRadius: 10,
              border: `3px solid ${locked ? '#C88A28' : C.inkSoft}`,
              filter: 'url(#torn) drop-shadow(3px 8px 12px rgba(0,0,0,0.48))',
            }}
          >
            {/* Pita atas papan angka */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 12,
                height: 16,
                borderRadius: 4,
                backgroundColor: locked ? '#B8893A' : C.woodLo,
              }}
            />

            {/* Bingkai jendela mekanis roda angka */}
            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                top: 38,
                height: 126,
                backgroundColor: '#19130F',
                borderRadius: 8,
                border: `2px solid ${locked ? '#F2A93B' : '#3E3127'}`,
                boxShadow:
                  lockGlow > 0
                    ? `0 0 24px rgba(245, 197, 66, ${0.42 * lockGlow}), inset 0 6px 12px rgba(0,0,0,0.85)`
                    : 'inset 0 6px 12px rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '0 14px',
              }}
            >
              {/* 1 */}
              <RodaDigit target={1} startFrame={226} stopFrame={300} spins={2} />
              {/* . */}
              <div
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 54,
                  color: locked ? '#F5C542' : '#E8DFD3',
                  lineHeight: 1,
                  marginTop: 22,
                }}
              >
                .
              </div>
              {/* 7 9 6 */}
              <RodaDigit target={7} startFrame={228} stopFrame={312} spins={3} />
              <RodaDigit target={9} startFrame={230} stopFrame={324} spins={3} />
              <RodaDigit target={6} startFrame={232} stopFrame={336} spins={4} />
              {/* , */}
              <div
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 54,
                  color: locked ? '#F5C542' : '#E8DFD3',
                  lineHeight: 1,
                  marginTop: 22,
                }}
              >
                ,
              </div>
              {/* 8 */}
              <RodaDigit target={8} startFrame={234} stopFrame={348} spins={4} />

              {/* Satuan tetap: triliun rupiah */}
              <div
                style={{
                  marginLeft: 10,
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 34,
                  lineHeight: 1.05,
                  color: locked ? '#F6E8CC' : '#D9C7A3',
                  whiteSpace: 'nowrap',
                }}
              >
                triliun rupiah
              </div>
            </div>

            {/* Paku keling kuningan di sudut papan */}
            <Disc x={22} y={20} d={10} color={C.brass} />
            <Disc x={614} y={20} d={10} color={C.brass} />
          </div>
        </Boil>
      </PopIn>
    </AbsoluteFill>
  );
};

// Label sumber polos di kiri atas: "Menurut Kementerian Keuangan"
const LabelSumber: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <PopIn at={34}>
      <Boil seed="sumber-kemenkeu" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 146,
            padding: '11px 22px 13px',
            backgroundColor: '#D9C7A3',
            borderLeft: `6px solid ${C.brass}`,
            fontFamily: FONT.label,
            fontWeight: 800,
            fontSize: 20,
            lineHeight: 1.15,
            color: C.ink,
            whiteSpace: 'nowrap',
            filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.42))',
          }}
        >
          Menurut Kementerian Keuangan
        </div>
      </Boil>
    </PopIn>
  </AbsoluteFill>
);

export const PB02: React.FC = () => {
  const f = useCurrentFrame();

  // Panggung hampir gelap saat "Uangnya ada.", lalu perlahan diterangi tumpukan koin emas
  const darkVeilOpacity = interpolate(f, [0, 32, 74, 340], [0.84, 0.78, 0.24, 0.16], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <Stage dur={DUR} banner="Uangnya ada.">
      <SnapZoom at={348} x={860} y={418} to={1.05} settle={1.02} shake={4} roll={0.3}>
        <OrbitCamera dur={DUR} yaw={13} push={1.08} origin={[640, 410]}>
          {/* Latar jauh */}
          <Depth z={0.12}>
            <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.16)'}} />
            <Window x={58} y={138} w={180} h={240} night={false} />
            <Shelf x={985} y={210} w={230} books={3} />
            <Plant x={1135} y={376} s={0.72} />
          </Depth>

          {/* Tirai gelap atmosfer panggung (membuat koin emas Beat 1 menjadi satu-satunya titik hangat) */}
          <Depth z={0.3}>
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(circle at 490px 440px, rgba(23, 17, 13, 0.35) 0%, rgba(18, 13, 10, 0.96) 55%)',
                opacity: darkVeilOpacity,
                pointerEvents: 'none',
              }}
            />
          </Depth>

          {/* Panggung tengah: sumber, kalender 10 bulan, menara koin emas, dan papan angka */}
          <Depth z={0.52}>
            <LabelSumber />
            <KalenderSepuluhBulan />
            <MenaraKoin cx={490} />
            <PapanAngkaPajak />

            <SparkleBurst at={22} x={490} y={FLOOR_Y - 40} seed="koin-pertama" spread={76} />
            <SparkleBurst at={348} x={820} y={418} seed="angka-kunci" spread={88} />
          </Depth>

          {/* Bingkai panggung kertas di tepi kiri dan kanan */}
          <Depth z={0.88}>
            <AbsoluteFill style={{pointerEvents: 'none'}}>
              <Slab x={-16} y={0} w={36} h={720} color="#2E221A" r={0} />
              <Slab x={1260} y={0} w={36} h={720} color="#2E221A" r={0} />
            </AbsoluteFill>
          </Depth>
        </OrbitCamera>
      </SnapZoom>
    </Stage>
  );
};

export default PB02;
