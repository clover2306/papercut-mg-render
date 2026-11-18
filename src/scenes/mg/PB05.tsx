// Adegan MG-05 Dua Kali: warga membayar pajak pertama lewat gaji dan belanjaan, lalu membayar sekali lagi dari kantong sendiri ketika layanan di loket tidak datang.
// Gaya papercut Dunia Bocor dengan stop-motion tenang, tokoh tanpa wajah, dompet kertas, dua slot koin atas, dan loket layanan yang menutup rolling door.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Figure, Paper, Pill, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Disc, SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {Plant, Shelf, Window} from '../../lib/paper/sets';
import {MarkerArrow} from '../../lib/paper/proof';
import {TapeCorners} from '../../lib/paper/tape';

export const PB05_DUR = 450;
export const DUR = PB05_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

// Koin kertas bulat polos dengan cincin timbul (tanpa wajah, angka, atau lambang)
const KoinKertas: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  rot?: number;
  opacity?: number;
  warm?: boolean;
}> = ({cx, cy, r = 24, rot = 0, opacity = 1, warm = true}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        translate: '-50% -50%',
        transform: `rotate(${rot}deg)`,
        borderRadius: '50%',
        backgroundColor: warm ? '#E8A838' : '#B8893A',
        border: `3px solid ${warm ? '#9C6B19' : '#6B4A33'}`,
        boxShadow: warm
          ? '0 0 14px rgba(242, 169, 59, 0.45), 2px 4px 7px rgba(0,0,0,0.42)'
          : '2px 4px 7px rgba(0,0,0,0.42)',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* Sorotan lengkung kertas di tepi atas */}
      <div
        style={{
          position: 'absolute',
          inset: 3,
          borderRadius: '50%',
          borderTop: `3px solid ${warm ? '#FFE082' : '#D9C7A3'}`,
          borderLeft: `2px solid ${warm ? '#FFE082' : '#D9C7A3'}`,
          opacity: 0.85,
        }}
      />
      {/* Cincin timbul di bagian dalam koin */}
      <div
        style={{
          position: 'absolute',
          inset: Math.round(r * 0.28),
          borderRadius: '50%',
          border: `2.5px solid ${warm ? '#9C6B19' : '#6B4A33'}`,
          backgroundColor: warm ? '#F2BE4B' : '#C99B4A',
        }}
      />
    </div>
  );
};

// Slot koin kertas di bagian atas panggung yang menyala saat koin masuk
const SlotKoin: React.FC<{
  cx: number;
  y: number;
  appearAt: number;
  litAt: number;
  label: 'Sekali' | 'Sekali lagi';
  seed: string;
}> = ({cx, y, appearAt, litAt, label, seed}) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [litAt, litAt + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const bumpY = interpolate(f, [litAt, litAt + 4, litAt + 10], [0, 5, 0], CLAMP);

  const w = 236;
  const h = 92;

  return (
    <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
      <PopIn at={appearAt}>
        <Boil seed={seed} amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: cx - w / 2,
              top: y + bumpY,
              width: w,
              height: h,
            }}
          >
            <TapeCorners x={0} y={0} w={w} h={h} rot={0.4} len={24} />
            {/* Bingkai kayu slot */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: C.woodLo,
                borderRadius: 7,
                border: `2px solid ${lit > 0.2 ? '#C88A28' : C.ink}`,
                filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.44))',
              }}
            />
            {/* Rongga gelap di dalam slot */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 14,
                width: w - 28,
                height: h - 28,
                backgroundColor: '#1A130F',
                borderRadius: 4,
                boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.88)',
                border: `2px solid ${lit > 0.2 ? '#B8893A' : '#3A2C22'}`,
              }}
            />
            {/* Celah tipis tempat masuk koin di sisi bawah slot */}
            <div
              style={{
                position: 'absolute',
                left: 44,
                right: 44,
                bottom: 8,
                height: 7,
                borderRadius: 4,
                backgroundColor: '#0E0A08',
                borderTop: '1px solid #5E3B22',
              }}
            />
            {/* Pendaran hangat saat slot terisi */}
            {lit > 0.01 && (
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 16,
                  width: w - 36,
                  height: h - 32,
                  borderRadius: 4,
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(242, 169, 59, 0.48) 0%, rgba(201, 87, 60, 0.2) 70%, rgba(0,0,0,0) 100%)',
                  opacity: lit,
                }}
              />
            )}
            {/* Strip teks menyala di dalam slot */}
            <AbsoluteFill style={{inset: 0}}>
              <PopIn at={litAt}>
                <div
                  style={{
                    position: 'absolute',
                    left: w / 2,
                    top: 20,
                    translate: '-50% 0',
                    backgroundColor: C.tag,
                    padding: '9px 22px 11px',
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: label === 'Sekali lagi' ? 27 : 31,
                    lineHeight: 1,
                    color: C.tagText,
                    whiteSpace: 'nowrap',
                    filter: 'url(#torn) drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
                  }}
                >
                  {label}
                </div>
              </PopIn>
            </AbsoluteFill>
          </div>
        </Boil>
      </PopIn>
    </AbsoluteFill>
  );
};

// Stempel kayu yang menghantam di antara dua slot dan mencetak cap "dua kali"
const StempelDuaKali: React.FC = () => {
  const f = useCurrentFrame();
  const impactAt = 62;

  const stampOpacity = interpolate(f, [44, 50, 84, 94], [0, 1, 1, 0], CLAMP);
  const stampBottomY =
    f < impactAt
      ? interpolate(f, [46, impactAt], [-30, 84], {...CLAMP, easing: Easing.in(Easing.cubic)})
      : f < 72
        ? interpolate(f, [impactAt, impactAt + 4, 72], [84, 90, 84], CLAMP)
        : interpolate(f, [72, 94], [84, -140], {...CLAMP, easing: Easing.in(Easing.cubic)});

  const squashX = interpolate(f, [impactAt - 1, impactAt + 2, impactAt + 8], [1, 1.08, 1], CLAMP);
  const squashY = interpolate(f, [impactAt - 1, impactAt + 2, impactAt + 8], [1, 0.86, 1], CLAMP);

  return (
    <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
      {/* Cap cetak "dua kali" di antara kedua slot */}
      <PopIn at={impactAt}>
        <Boil seed="cap-dua-kali" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 52,
              translate: '-50% 0',
              rotate: '-1.5deg',
              backgroundColor: C.ink,
              border: `3px solid ${C.tag}`,
              padding: '12px 22px 14px',
              fontFamily: FONT.banner,
              fontSize: 28,
              lineHeight: 1,
              color: '#F3E6D3',
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.45))',
            }}
          >
            dua kali
          </div>
        </Boil>
      </PopIn>

      {/* Kayu stempel yang turun menghantam */}
      {stampOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: stampBottomY,
            width: 176,
            height: 118,
            translate: '-50% -100%',
            transformOrigin: '50% 100%',
            transform: `scale(${squashX}, ${squashY})`,
            opacity: stampOpacity,
            filter: 'drop-shadow(3px 8px 12px rgba(0,0,0,0.48))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 38,
              height: 40,
              translate: '-50% 0',
              borderRadius: '20px 20px 10px 10px',
              backgroundColor: C.woodHi,
              border: `2px solid ${C.woodLo}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 36,
              width: 22,
              height: 28,
              translate: '-50% 0',
              backgroundColor: C.wood,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 62,
              width: 160,
              height: 36,
              borderRadius: 5,
              backgroundColor: C.woodLo,
              border: `2px solid ${C.ink}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 98,
              width: 148,
              height: 14,
              borderRadius: '0 0 4px 4px',
              backgroundColor: C.tag,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Dompet kertas di tangan tokoh tanpa wajah (terbuka saat koin pertama keluar)
const DompetKertas: React.FC<{x: number; y: number; openDeg: number}> = ({x, y, openDeg}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 96,
      height: 68,
      translate: '-50% -50%',
      filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.42))',
    }}
  >
    {/* Bagian dalam dompet */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#4A3020',
        borderRadius: 8,
        border: `2px solid ${C.ink}`,
      }}
    />
    {/* Badan kulit kertas dompet */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 52,
        backgroundColor: '#7F5231',
        borderRadius: '4px 4px 8px 8px',
        border: `2px solid ${C.inkSoft}`,
      }}
    />
    {/* Jahitan putus-putus tepi dompet */}
    <div
      style={{
        position: 'absolute',
        left: 7,
        right: 7,
        bottom: 6,
        height: 40,
        borderRadius: 5,
        border: '2px dashed #C3B284',
        opacity: 0.75,
      }}
    />
    {/* Tutup lipat atas dompet */}
    <div
      style={{
        position: 'absolute',
        left: -2,
        right: -2,
        top: 0,
        height: 30,
        backgroundColor: '#95653F',
        borderRadius: '8px 8px 12px 12px',
        border: `2px solid ${C.inkSoft}`,
        transformOrigin: '50% 0%',
        transform: `perspective(300px) rotateX(${openDeg}deg)`,
      }}
    />
    {/* Kancing pengunci kuningan */}
    <Disc x={48} y={24} d={12} color={C.brass} />
  </div>
);

// Loket layanan kertas di sisi kanan panggung: tali bingkisan putus, bingkisan jatuh, lalu rolling door menutup
const LoketLayanan: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Beat 4: tali terputus di f=374, bingkisan jatuh f=376..396, rolling door turun f=392..418
  const cordSnapped = f >= 374;
  const parcelDropY = interpolate(sf, [376, 396], [0, 148], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const parcelRot = interpolate(sf, [376, 396], [0, 16], CLAMP);

  const shutterH = interpolate(sf, [392, 418], [16, 174], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const boothW = 286;
  const boothH = 396;
  const boothLeft = 846;
  const boothTop = FLOOR_Y - boothH;

  return (
    <div
      style={{
        position: 'absolute',
        left: boothLeft,
        top: boothTop,
        width: boothW,
        height: boothH,
      }}
    >
      <AbsoluteFill style={{inset: 0}}>
        <Paper lift={6}>
          {/* Badan utama bilik loket kertas kusam */}
          <Slab
            x={16}
            y={42}
            w={boothW - 32}
            h={boothH - 42}
            color="#C9B58E"
            shade="#A6936E"
            shadeH={0.12}
            r={6}
            grain={0.75}
          />

          {/* Atap bilik loket */}
          <Slab
            x={0}
            y={12}
            w={boothW}
            h={38}
            color="#6B4A33"
            shade="#4A3020"
            shadeH={0.32}
            r={6}
          />
          {/* Papan nama polos di atas loket (tanpa teks atau angka) */}
          <Slab x={48} y={20} w={boothW - 96} h={20} color="#D9C7A3" r={3} />

          {/* Meja konter loket */}
          <Slab
            x={6}
            y={246}
            w={boothW - 12}
            h={22}
            color={C.woodHi}
            shade={C.wood}
            shadeH={0.35}
            r={4}
          />
          {/* Panel bawah loket */}
          <Slab
            x={26}
            y={268}
            w={boothW - 52}
            h={boothH - 268}
            color="#8A7A60"
            shade="#6E614B"
            shadeH={0.18}
            r={3}
            grain={0.6}
          />
        </Paper>
      </AbsoluteFill>

      {/* Celah penerima koin di sisi kiri bawah meja konter (tempat koin ke-2 masuk) */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 356,
          width: 14,
          height: 54,
          borderRadius: 4,
          backgroundColor: '#19130F',
          border: `2px solid ${C.woodLo}`,
          boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.9)',
        }}
      />

      {/* Lubang jendela loket tempat bingkisan layanan seharusnya diserahkan */}
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 72,
          width: boothW - 84,
          height: 174,
          backgroundColor: '#231B15',
          border: `3px solid ${C.woodLo}`,
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden',
          boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.85)',
        }}
      >
        {/* Tali gantungan bingkisan di bagian atas jendela */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 4,
            height: cordSnapped ? 20 : 42,
            translate: '-50% 0',
            backgroundColor: '#D9C7A3',
          }}
        />
        {cordSnapped && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 22,
              width: 14,
              height: 8,
              translate: '-50% 0',
              borderTop: `3px dashed ${C.tag}`,
            }}
          />
        )}

        {/* Bingkisan layanan kertas yang jatuh ke bawah saat tali terputus */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 42 + parcelDropY,
            width: 78,
            height: 66,
            translate: '-50% 0',
            transform: `rotate(${parcelRot}deg)`,
            backgroundColor: '#D9C7A3',
            borderRadius: 5,
            border: `2px solid ${C.inkSoft}`,
            boxShadow: '2px 5px 8px rgba(0,0,0,0.55)',
          }}
        >
          {/* Pita pengikat bingkisan (polos tanpa tulisan) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 12,
              translate: '-50% 0',
              backgroundColor: C.sage,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 12,
              translate: '0 -50%',
              backgroundColor: C.sage,
            }}
          />
        </div>

        {/* Rolling door kertas bergelombang yang turun menutup loket */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: shutterH,
            backgroundColor: '#7A7267',
            borderBottom: `6px solid ${C.woodLo}`,
            boxShadow: '0 6px 12px rgba(0,0,0,0.65)',
            overflow: 'hidden',
          }}
        >
          {Array.from({length: 11}).map((_, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: idx * 16,
                height: 3,
                backgroundColor: '#4A443D',
                opacity: 0.75,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cap besar "tidak datang" menghantam rolling door yang tertutup */}
      <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
        <PopIn at={406}>
          <Boil seed="tag-tidak-datang" amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: boothW / 2,
                top: 138,
                translate: '-50% 0',
                rotate: '-3deg',
                backgroundColor: C.tag,
                border: `2px solid ${C.ink}`,
                padding: '11px 22px 13px',
                fontFamily: FONT.banner,
                fontSize: 26,
                lineHeight: 1,
                color: C.tagText,
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 6px 10px rgba(0,0,0,0.5))',
              }}
            >
              tidak datang
            </div>
          </Boil>
        </PopIn>
      </AbsoluteFill>
    </div>
  );
};

export const PB05: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Gerakan halus tokoh tanpa wajah: membungkuk sedikit saat layanan tidak datang (f=404..426)
  const citizenLean = interpolate(sf, [14, 34, 404, 426], [0, -1.5, -1.5, 4.5], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // Tutup dompet membuka saat koin pertama keluar (f=126..250)
  const walletOpenDeg =
    f < 126
      ? 0
      : f < 248
        ? interpolate(sf, [126, 140], [0, 58], {...CLAMP, easing: Easing.out(Easing.cubic)})
        : interpolate(sf, [248, 264], [58, 0], {...CLAMP, easing: Easing.in(Easing.cubic)});

  // Koin 1 (Beat 2): keluar dari dompet (415, 412), naik melewati "gajimu" dan "belanjaanmu", masuk ke Slot 1 (415, 86)
  const coin1U = interpolate(sf, [132, 264], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const coin1X = interpolate(coin1U, [0, 0.35, 0.72, 1], [415, 392, 404, 415], CLAMP);
  const coin1Y = interpolate(coin1U, [0, 0.35, 0.72, 1], [412, 315, 205, 86], CLAMP);
  const coin1Opacity = interpolate(f, [130, 136, 260, 268], [0, 1, 1, 0], CLAMP);

  // Koin 2 (Beat 3): keluar dari kantong tokoh (328, 492), memicu Slot 2 "Sekali lagi", lalu bergulir ke loket (862, 578)
  const pocketFlapRot = interpolate(sf, [296, 310, 355, 370], [0, -48, -48, 0], CLAMP);
  const coin2PopU = interpolate(sf, [300, 316], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const coin2RollU = interpolate(sf, [316, 366], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const coin2X =
    f < 316
      ? interpolate(coin2PopU, [0, 1], [328, 368], CLAMP)
      : interpolate(coin2RollU, [0, 1], [368, 862], CLAMP);
  const coin2Y =
    f < 316
      ? interpolate(coin2PopU, [0, 0.5, 1], [492, 474, FLOOR_Y - 22], CLAMP)
      : FLOOR_Y - 22;
  const coin2Rot = interpolate(coin2RollU, [0, 1], [0, 540], CLAMP);
  const coin2Opacity = interpolate(f, [298, 304, 362, 370], [0, 1, 1, 0], CLAMP);

  // Garis penghubung kertas dari koin kedua ke slot "Sekali lagi" di atas kanan
  const slot2BeamU = interpolate(f, [314, 332], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage dur={DUR} banner="">
      <SnapZoom at={62} x={640} y={96} to={1.06} settle={1.01} shake={5} roll={0.4}>
        <OrbitCamera dur={DUR} yaw={12} push={1.08} origin={[640, 380]}>
          {/* Latar jauh Dunia Bocor */}
          <Depth z={0.12}>
            <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.16)'}} />
            <Window x={48} y={142} w={174} h={235} night={false} />
            <Shelf x={555} y={248} w={215} books={3} />
            <Plant x={1152} y={376} s={0.7} />
          </Depth>

          {/* Panggung tengah: dua slot atas, tokoh berdompet, jalur koin, dan loket layanan */}
          <Depth z={0.5}>
            {/* Dua slot koin di bagian atas panggung + stempel "dua kali" */}
            <SlotKoin
              cx={415}
              y={36}
              appearAt={22}
              litAt={264}
              label="Sekali"
              seed="slot-sekali"
            />
            <SlotKoin
              cx={865}
              y={36}
              appearAt={32}
              litAt={326}
              label="Sekali lagi"
              seed="slot-sekali-lagi"
            />
            <StempelDuaKali />

            {/* Tag "pajak" di samping Slot 1 + panah spidol */}
            <MarkerArrow
              x={548}
              y={144}
              tx={495}
              ty={116}
              at={146}
              dur={10}
              color={C.tag}
              bend={-10}
              seed="arrow-pajak"
              width={4}
            />
            <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
              <PopIn at={142}>
                <Boil seed="tag-pajak" amp={0.4} rot={0.05}>
                  <Pill x={582} y={148} text="pajak" bg={C.tag} color={C.tagText} size={27} />
                </Boil>
              </PopIn>
            </AbsoluteFill>

            {/* Checkpoint Beat 2.1: strip "gajimu" + panah ke koin pertama */}
            <MarkerArrow
              x={276}
              y={316}
              tx={362}
              ty={316}
              at={174}
              dur={10}
              color={C.woodLo}
              bend={-8}
              seed="arrow-gajimu"
              width={4}
            />
            <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
              <PopIn at={168}>
                <Boil seed="strip-gajimu" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 112,
                      top: 294,
                      backgroundColor: '#D9C7A3',
                      borderLeft: `6px solid ${C.woodLo}`,
                      borderRight: `3px dashed ${C.tag}`,
                      padding: '9px 20px 11px',
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 28,
                      lineHeight: 1,
                      color: C.ink,
                      whiteSpace: 'nowrap',
                      filter: 'url(#torn) drop-shadow(2px 4px 7px rgba(0,0,0,0.36))',
                    }}
                  >
                    gajimu
                  </div>
                </Boil>
              </PopIn>
            </AbsoluteFill>

            {/* Checkpoint Beat 2.2: label "belanjaanmu" + panah ke koin pertama */}
            <MarkerArrow
              x={298}
              y={206}
              tx={374}
              ty={206}
              at={218}
              dur={10}
              color={C.tag}
              bend={-8}
              seed="arrow-belanjaanmu"
              width={4}
            />
            <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
              <PopIn at={212}>
                <Boil seed="label-belanjaanmu" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 72,
                      top: 184,
                      backgroundColor: '#D9C7A3',
                      borderLeft: `6px solid ${C.tag}`,
                      padding: '9px 18px 11px',
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 27,
                      lineHeight: 1,
                      color: C.ink,
                      whiteSpace: 'nowrap',
                      filter: 'url(#torn) drop-shadow(2px 4px 7px rgba(0,0,0,0.36))',
                    }}
                  >
                    belanjaanmu
                  </div>
                </Boil>
              </PopIn>
            </AbsoluteFill>

            {/* Garis putus-putus penghubung dari koin kedua ke slot "Sekali lagi" */}
            {slot2BeamU > 0.02 && (
              <svg
                width={1280}
                height={720}
                viewBox="0 0 1280 720"
                style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
              >
                <line
                  x1={420}
                  y1={560}
                  x2={interpolate(slot2BeamU, [0, 1], [420, 845], CLAMP)}
                  y2={interpolate(slot2BeamU, [0, 1], [560, 134], CLAMP)}
                  stroke={C.tag}
                  strokeWidth={3.5}
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                  opacity={interpolate(f, [314, 324, 368, 382], [0, 0.85, 0.85, 0], CLAMP)}
                />
              </svg>
            )}

            {/* Tokoh tanpa wajah di kiri-tengah memegang dompet kertas */}
            <div
              style={{
                position: 'absolute',
                left: 332,
                top: FLOOR_Y,
                transformOrigin: '50% 100%',
                transform: `rotate(${citizenLean}deg)`,
              }}
            >
              <Figure x={0} y={0} s={1.08} shirt={ROOM.dusk} />

              {/* Kantong celana/baju kertas di pinggul tokoh (sumber koin kedua) */}
              <div
                style={{
                  position: 'absolute',
                  left: -26,
                  top: -116,
                  width: 34,
                  height: 36,
                  backgroundColor: '#48607A',
                  borderRadius: '3px 3px 10px 10px',
                  border: `2px solid ${C.inkSoft}`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -2,
                    right: -2,
                    top: -2,
                    height: 12,
                    backgroundColor: '#3B4F66',
                    borderRadius: 3,
                    transformOrigin: '50% 0%',
                    transform: `rotate(${pocketFlapRot}deg)`,
                  }}
                />
              </div>

              {/* Lengan kertas tanpa wajah memegang dompet */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: -146,
                  width: 66,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: ROOM.dusk,
                  transform: 'rotate(14deg)',
                  filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.32))',
                }}
              />
            </div>

            {/* Dompet kertas di depan tokoh */}
            <DompetKertas x={415} y={456} openDeg={walletOpenDeg} />

            {/* Label Beat 3: "kantongmu sendiri" + panah ke kantong tokoh */}
            <MarkerArrow
              x={252}
              y={516}
              tx={302}
              ty={494}
              at={306}
              dur={10}
              color={C.ink}
              bend={10}
              seed="arrow-kantong"
              width={4}
            />
            <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
              <PopIn at={302}>
                <Boil seed="strip-kantong" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 38,
                      top: 500,
                      backgroundColor: '#D9C7A3',
                      borderLeft: `6px solid ${C.ink}`,
                      padding: '8px 14px 10px',
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 22,
                      lineHeight: 1,
                      color: C.ink,
                      whiteSpace: 'nowrap',
                      filter: 'url(#torn) drop-shadow(2px 4px 7px rgba(0,0,0,0.36))',
                    }}
                  >
                    kantongmu sendiri
                  </div>
                </Boil>
              </PopIn>
            </AbsoluteFill>

            {/* Loket layanan kertas di sisi kanan */}
            <LoketLayanan />

            {/* Koin pertama (pajak dari gaji & belanjaan -> slot "Sekali") */}
            <KoinKertas cx={coin1X} cy={coin1Y} r={23} opacity={coin1Opacity} warm />

            {/* Koin kedua (dari kantongmu sendiri -> loket layanan) */}
            <KoinKertas
              cx={coin2X}
              cy={coin2Y}
              r={22}
              rot={coin2Rot}
              opacity={coin2Opacity}
              warm={false}
            />

            {/* Percikan kertas saat slot pertama dan kedua menyala */}
            <SparkleBurst at={264} x={415} y={82} seed="spark-sekali" spread={62} />
            <SparkleBurst at={326} x={865} y={82} seed="spark-sekali-lagi" spread={62} />
          </Depth>

          {/* Bingkai panggung kertas tepi kiri dan kanan */}
          <Depth z={0.88}>
            <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
              <Slab x={-16} y={0} w={36} h={720} color="#2E221A" r={0} />
              <Slab x={1260} y={0} w={36} h={720} color="#2E221A" r={0} />
            </AbsoluteFill>
          </Depth>
        </OrbitCamera>
      </SnapZoom>
    </Stage>
  );
};

export default PB05;
