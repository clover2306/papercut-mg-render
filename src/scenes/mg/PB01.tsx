// Adegan MG-01 Dipotong Sebelum Sampai: gaji dipotong gunting kertas dan sebagian harga belanja masuk ke slot pajak.
// Gaya papercut Dunia Bocor dengan gerak stop-motion tenang, tokoh tanpa wajah, dan satu slot gelap bersama.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Figure, Paper, Pill, PopIn, Slab, Stage} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {Disc, SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {CutScene, CutSeries, CutSpec} from '../../lib/paper/transitions';
import {Plant, Shelf, Window} from '../../lib/paper/sets';
import {MarkerArrow} from '../../lib/paper/proof';
import {TapeCorners} from '../../lib/paper/tape';

export const PB01_DUR = 334;
export const DUR = PB01_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

const SlotGelap: React.FC<{litAt?: number; pulseAt?: number}> = ({litAt, pulseAt}) => {
  const f = useCurrentFrame();
  const lit =
    litAt !== undefined
      ? interpolate(f, [litAt, litAt + 12], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : 0;
  const pulse =
    pulseAt !== undefined
      ? interpolate(f, [pulseAt, pulseAt + 6, pulseAt + 18], [0, 1, 0], {
          ...CLAMP,
          easing: Easing.inOut(Easing.sin),
        })
      : 0;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 435, top: 28, width: 410, height: 96}}>
        <TapeCorners x={0} y={0} w={410} h={96} rot={-0.6} len={32} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: C.woodLo,
            borderRadius: 6,
            filter: 'url(#torn) drop-shadow(0px 6px 10px rgba(0,0,0,0.45))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 16,
            width: 374,
            height: 64,
            backgroundColor: '#1B1511',
            borderRadius: 4,
            boxShadow: 'inset 0px 8px 14px rgba(0,0,0,0.85)',
            border: `2px solid ${lit > 0.1 ? '#B8893A' : '#3A2C22'}`,
          }}
        />
        {(lit > 0 || pulse > 0) && (
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 20,
              width: 362,
              height: 56,
              borderRadius: 4,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(217,104,59,0.52) 0%, rgba(184,137,58,0.18) 70%, rgba(0,0,0,0) 100%)',
              opacity: Math.max(lit, pulse * 0.8),
            }}
          />
        )}
        {litAt !== undefined && (
          <AbsoluteFill>
            <PopIn at={litAt}>
              <Boil seed="slot-pajak" amp={0.4} rot={0.05}>
                <div
                  style={{
                    position: 'absolute',
                    left: 205,
                    top: 18,
                    translate: '-50% 0',
                    backgroundColor: C.tag,
                    padding: '10px 30px 12px',
                    fontFamily: FONT.banner,
                    fontSize: 34,
                    lineHeight: 1,
                    color: C.tagText,
                    letterSpacing: '0.02em',
                    filter: 'url(#torn) drop-shadow(0px 4px 8px rgba(0,0,0,0.45))',
                  }}
                >
                  pajak
                </div>
              </Boil>
            </PopIn>
          </AbsoluteFill>
        )}
      </div>
    </AbsoluteFill>
  );
};

const SlotBibirDepan: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 453,
        top: 82,
        width: 374,
        height: 24,
        backgroundColor: C.woodLo,
        borderTop: '2px solid #4A3020',
        borderRadius: '0 0 4px 4px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.4)',
      }}
    />
  </AbsoluteFill>
);

const GuntingKertas: React.FC<{x: number; y: number; openDeg: number; opacity: number}> = ({
  x,
  y,
  openDeg,
  opacity,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 160,
      height: 210,
      translate: '-50% -50%',
      opacity,
      filter: 'drop-shadow(3px 7px 8px rgba(0,0,0,0.38))',
    }}
  >
    {/* Bilah kiri */}
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 22,
        width: 18,
        height: 155,
        transformOrigin: '50% 42%',
        transform: `rotate(${-openDeg}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: -8,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: `8px solid ${C.tag}`,
          backgroundColor: 'transparent',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 2,
          top: 34,
          width: 14,
          height: 120,
          backgroundColor: C.metalLo,
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 82%, 50% 100%, 0% 82%)',
        }}
      />
    </div>
    {/* Bilah kanan */}
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 22,
        width: 18,
        height: 155,
        transformOrigin: '50% 42%',
        transform: `rotate(${openDeg}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: -8,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: `8px solid ${C.wood}`,
          backgroundColor: 'transparent',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 2,
          top: 34,
          width: 14,
          height: 120,
          backgroundColor: C.metal,
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 82%, 50% 100%, 0% 82%)',
        }}
      />
    </div>
    <Disc x={81} y={88} d={14} color={C.brass} />
  </div>
);

const AmplopUtama: React.FC<{x: number; y: number; cutDone: boolean; tilt: number}> = ({
  x,
  y,
  cutDone,
  tilt,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 196,
      height: 146,
      translate: '0 -50%',
      transform: `rotate(${tilt}deg)`,
      filter: 'drop-shadow(3px 7px 9px rgba(0,0,0,0.36))',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#D9C7A3',
        borderRadius: cutDone ? '6px 0 0 6px' : '6px',
        border: `2px solid ${C.inkSoft}`,
        borderRight: cutDone ? `3px dashed ${C.tag}` : 'none',
        filter: cutDone ? 'url(#torn)' : undefined,
      }}
    />
    {/* Lipatan tutup amplop */}
    <div
      style={{
        position: 'absolute',
        left: 2,
        top: 2,
        width: 192,
        height: 76,
        backgroundColor: '#C5B089',
        clipPath: 'polygon(0% 0%, 100% 0%, 66% 100%, 0% 24%)',
        opacity: 0.9,
      }}
    />
    {/* Strip kata gaji */}
    <div
      style={{
        position: 'absolute',
        left: 24,
        top: 66,
        backgroundColor: C.ink,
        padding: '8px 22px 10px',
        borderRadius: 4,
        fontFamily: FONT.caption,
        fontWeight: 900,
        fontSize: 36,
        lineHeight: 1,
        color: '#D9C7A3',
      }}
    >
      gaji
    </div>
  </div>
);

const IrisanAmplop: React.FC<{x: number; y: number; scale: number; rot: number; opacity: number}> = ({
  x,
  y,
  scale,
  rot,
  opacity,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 74,
      height: 146,
      translate: '0 -50%',
      transform: `scale(${scale}) rotate(${rot}deg)`,
      opacity,
      filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.34))',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#CEBA94',
        borderRadius: '0 6px 6px 0',
        borderTop: `2px solid ${C.inkSoft}`,
        borderRight: `2px solid ${C.inkSoft}`,
        borderBottom: `2px solid ${C.inkSoft}`,
        borderLeft: `3px dashed ${C.tag}`,
        filter: 'url(#torn)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 2,
        width: 72,
        height: 54,
        backgroundColor: '#B8893A',
        clipPath: 'polygon(0% 42%, 100% 0%, 100% 24%, 0% 76%)',
        opacity: 0.85,
      }}
    />
  </div>
);

const BeatGaji: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Beat 1 (0..64): Amplop gaji masuk dari kiri ke tengah-kiri
  const envInX = interpolate(sf, [6, 52], [-220, 390], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 2 (64..171): Gunting memotong, irisan naik ke slot gelap, amplop tipis sampai ke tangan
  const snipDone = f >= 84;
  const scissorY =
    f < 88
      ? interpolate(sf, [54, 74], [150, 330], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : interpolate(sf, [88, 106], [330, 140], {...CLAMP, easing: Easing.in(Easing.cubic)});
  const scissorOpacity =
    f < 88
      ? interpolate(f, [54, 62], [0, 1], CLAMP)
      : interpolate(f, [92, 106], [1, 0], CLAMP);
  const scissorOpen =
    f < 74
      ? interpolate(sf, [62, 74], [6, 26], {...CLAMP, easing: Easing.out(Easing.sin)})
      : interpolate(sf, [74, 84], [26, 2], {...CLAMP, easing: Easing.in(Easing.cubic)});

  // Irisan terlepas dan masuk ke slot gelap di atas panggung
  const sliceSepX = interpolate(sf, [84, 96], [0, 22], {...CLAMP, easing: Easing.out(Easing.sin)});
  const sliceFlyU = interpolate(sf, [92, 138], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const sliceX = interpolate(sliceFlyU, [0, 1], [envInX + 196 + sliceSepX, 603], CLAMP);
  const sliceY = interpolate(sliceFlyU, [0, 1], [365, 86], CLAMP);
  const sliceScale = interpolate(sliceFlyU, [0, 1], [1, 0.56], CLAMP);
  const sliceRot = interpolate(sliceFlyU, [0, 1], [0, -14], CLAMP);
  const sliceOpacity = interpolate(f, [132, 140], [1, 0], CLAMP);

  // Sisa amplop yang lebih tipis meluncur ke tangan tokoh di kanan
  const envToHandU = interpolate(sf, [104, 150], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const envX = envInX + interpolate(envToHandU, [0, 1], [0, 365], CLAMP);
  const envY = interpolate(envToHandU, [0, 1], [365, 384], CLAMP);
  const envTilt = interpolate(envToHandU, [0, 0.6, 1], [0, -2, 3], CLAMP);

  // Reaksi tokoh tanpa wajah menerima amplop tipis
  const reachAngle = interpolate(sf, [24, 52, 146, 162], [-8, 0, 0, 8], CLAMP);
  const bodyLean = interpolate(sf, [144, 164], [0, 3.5], {...CLAMP, easing: Easing.out(Easing.sin)});

  return (
    <Stage dur={171} banner="">
      <SnapZoom at={84} x={586} y={365} to={1.07} settle={1.02} shake={4} roll={0.4}>
        <OrbitCamera dur={171} yaw={11} push={1.07} origin={[640, 420]}>
          {/* Latar jauh */}
          <Depth z={0.12}>
            <AbsoluteFill style={{backgroundColor: 'rgba(184, 137, 58, 0.14)'}} />
            <Window x={86} y={142} w={195} h={255} night={false} />
            <Shelf x={860} y={248} w={270} books={3} />
            <Plant x={1115} y={375} s={0.74} />
          </Depth>

          {/* Panggung tengah */}
          <Depth z={0.5}>
            <SlotGelap pulseAt={132} />

            {/* Irisan amplop yang terbang masuk slot */}
            <IrisanAmplop
              x={sliceX}
              y={sliceY}
              scale={sliceScale}
              rot={sliceRot}
              opacity={sliceOpacity}
            />

            {/* Bibir depan slot agar irisan masuk ke dalam */}
            <SlotBibirDepan />

            {/* Amplop gaji utama (menjadi lebih tipis setelah dipotong) */}
            <AmplopUtama x={envX} y={envY} cutDone={snipDone} tilt={envTilt} />

            {/* Gunting kertas pemotong */}
            <GuntingKertas
              x={envInX + 196}
              y={scissorY}
              openDeg={scissorOpen}
              opacity={scissorOpacity}
            />

            {/* Strip kata dipotong + panah spidol */}
            <MarkerArrow
              x={555}
              y={462}
              tx={584}
              ty={424}
              at={86}
              dur={10}
              color={C.tag}
              bend={-12}
              seed="cut-arrow"
              width={5}
            />
            <AbsoluteFill>
              <PopIn at={84}>
                <Boil seed="pill-dipotong" amp={0.4} rot={0.05}>
                  <Pill x={520} y={472} text="dipotong" bg={C.tag} color={C.tagText} size={32} />
                </Boil>
              </PopIn>
            </AbsoluteFill>

            {/* Tokoh tanpa wajah di kanan menerima amplop */}
            <div
              style={{
                position: 'absolute',
                left: 1035,
                top: FLOOR_Y,
                transformOrigin: '50% 100%',
                transform: `rotate(${bodyLean}deg)`,
              }}
            >
              {/* Lengan kertas menjulur ke kiri */}
              <div
                style={{
                  position: 'absolute',
                  left: -102,
                  top: -124,
                  width: 96,
                  height: 22,
                  borderRadius: 10,
                  backgroundColor: C.sageLo,
                  transformOrigin: '100% 50%',
                  transform: `rotate(${reachAngle}deg)`,
                  filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.3))',
                }}
              />
              <Figure x={0} y={0} s={1.06} shirt={C.sageLo} />
            </div>
          </Depth>

          {/* Lapisan depan: bingkai bayangan kertas */}
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

const LapakToko: React.FC = () => (
  <div style={{position: 'absolute', left: 95, top: 215, width: 410, height: FLOOR_Y - 215}}>
    <AbsoluteFill>
      <Paper lift={5}>
        {/* Tiang penyangga tenda */}
        <Slab x={24} y={56} w={16} h={FLOOR_Y - 271} color={C.woodLo} r={3} />
        <Slab x={368} y={56} w={16} h={FLOOR_Y - 271} color={C.woodLo} r={3} />

        {/* Barang dagangan polos di atas meja (tanpa angka atau tulisan) */}
        <Slab x={56} y={168} w={74} h={68} color="#B8893A" shade="#8E6728" shadeH={0.2} r={5} />
        <Slab x={64} y={122} w={58} h={48} color="#C9A04A" shade="#9C7433" shadeH={0.2} r={4} />
        <Slab x={152} y={154} w={64} h={82} color="#8A7F72" shade="#685F55" shadeH={0.22} r="28px 28px 6px 6px" />
        <Slab x={236} y={176} w={106} h={60} color="#9A5A42" shade="#73412F" shadeH={0.22} r={6} />

        {/* Meja lapak kayu */}
        <Slab x={8} y={234} w={394} h={24} color={C.woodHi} shade={C.wood} shadeH={0.35} r={4} />
        <Slab x={18} y={258} w={374} h={FLOOR_Y - 473} color={C.wood} shade={C.woodLo} shadeH={0.16} r={2} grain={0.7} />

        {/* Atap tenda lapak bergaris kusam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 410,
            height: 68,
            backgroundColor: '#D9C7A3',
            borderRadius: '8px 8px 4px 4px',
            overflow: 'hidden',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.38))',
          }}
        >
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: idx * 82,
                top: 0,
                width: 42,
                height: 68,
                backgroundColor: '#9A5A42',
              }}
            />
          ))}
        </div>
      </Paper>
    </AbsoluteFill>
  </div>
);

const BeatBelanja: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Beat 3 (0..66 lokal): Label harga menggantung di lapak toko
  const tagSwing =
    f < 66
      ? Math.sin(sf * 0.24) * interpolate(sf, [0, 56], [7, 1.2], CLAMP)
      : Math.sin((sf - 66) * 0.3) * interpolate(sf, [66, 110], [-4.5, 0], CLAMP);

  // Beat 4 (66..163 lokal): Irisan pajak lepas dari label harga dan masuk slot gelap yang SAMA
  const snipAt = 68;
  const scissorY =
    f < 74
      ? interpolate(sf, [50, 66], [230, 382], {...CLAMP, easing: Easing.out(Easing.cubic)})
      : interpolate(sf, [74, 90], [382, 220], {...CLAMP, easing: Easing.in(Easing.cubic)});
  const scissorOpacity =
    f < 74
      ? interpolate(f, [50, 58], [0, 1], CLAMP)
      : interpolate(f, [76, 90], [1, 0], CLAMP);
  const scissorOpen =
    f < 66
      ? interpolate(sf, [56, 66], [6, 24], {...CLAMP, easing: Easing.out(Easing.sin)})
      : interpolate(sf, [66, 74], [24, 2], {...CLAMP, easing: Easing.in(Easing.cubic)});

  const sliceFlyU = interpolate(sf, [76, 120], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const sliceX = interpolate(sliceFlyU, [0, 1], [655, 640], CLAMP);
  const sliceY = interpolate(sliceFlyU, [0, 1], [412, 84], CLAMP);
  const sliceScale = interpolate(sliceFlyU, [0, 1], [1, 0.62], CLAMP);
  const sliceRot = interpolate(sliceFlyU, [0, 1], [0, -6], CLAMP);
  const sliceOpacity = interpolate(f, [114, 122], [1, 0], CLAMP);

  return (
    <Stage dur={163} banner="">
      <OrbitCamera dur={163} yaw={-11} push={1.08} origin={[640, 420]}>
        {/* Latar jauh */}
        <Depth z={0.12}>
          <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.14)'}} />
          <Shelf x={115} y={168} w={250} books={4} />
          <Window x={960} y={148} w={190} h={245} night={false} />
        </Depth>

        {/* Panggung tengah */}
        <Depth z={0.5}>
          {/* Slot gelap yang SAMA dengan adegan gaji, menyala "pajak" saat irisan masuk */}
          <SlotGelap litAt={116} pulseAt={114} />

          {/* Lapak toko kertas di kiri */}
          <LapakToko />

          {/* Tali gantungan label harga */}
          <div
            style={{
              position: 'absolute',
              left: 653,
              top: 122,
              width: 4,
              height: 82,
              backgroundColor: C.inkSoft,
            }}
          />

          {/* Bagian atas label harga yang tetap tergantung */}
          <div
            style={{
              position: 'absolute',
              left: 655,
              top: 196,
              width: 204,
              height: 184,
              translate: '-50% 0',
              transformOrigin: '50% 0%',
              transform: `rotate(${tagSwing}deg)`,
              filter: 'drop-shadow(3px 8px 10px rgba(0,0,0,0.4))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#D9C7A3',
                clipPath: 'polygon(18% 0%, 82% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)',
                borderBottom: f >= snipAt ? `3px dashed ${C.tag}` : 'none',
                filter: f >= snipAt ? 'url(#torn)' : undefined,
              }}
            />
            <Disc x={102} y={24} d={20} color={C.woodLo} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 56,
                translate: '-50% 0',
                fontFamily: FONT.banner,
                fontSize: 40,
                lineHeight: 1,
                color: C.ink,
                letterSpacing: '-0.01em',
              }}
            >
              harga
            </div>
            {/* Garis abstrak tanpa angka */}
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 118,
                width: 136,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#9E8D70',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 52,
                top: 138,
                width: 100,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#9E8D70',
              }}
            />
          </div>

          {/* Irisan bawah label harga yang lepas dan terbang ke slot pajak */}
          <div
            style={{
              position: 'absolute',
              left: sliceX,
              top: sliceY,
              width: 204,
              height: 68,
              translate: '-50% -50%',
              transformOrigin: '50% 50%',
              transform: `scale(${sliceScale}) rotate(${f < snipAt ? tagSwing : sliceRot}deg)`,
              opacity: sliceOpacity,
              filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.38))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#C5B089',
                borderRadius: '0 0 8px 8px',
                borderTop: `3px dashed ${C.tag}`,
                filter: 'url(#torn)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 14,
                translate: '-50% 0',
                backgroundColor: C.tag,
                padding: '7px 22px 9px',
                borderRadius: 4,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 28,
                lineHeight: 1,
                color: C.tagText,
              }}
            >
              pajak
            </div>
          </div>

          {/* Bibir depan slot pajak */}
          <SlotBibirDepan />

          {/* Gunting kertas mengiris bagian pajak dari label harga */}
          <GuntingKertas
            x={548}
            y={scissorY}
            openDeg={scissorOpen}
            opacity={scissorOpacity}
          />

          <SparkleBurst at={118} x={640} y={76} seed="pajak-spark" spread={68} />

          {/* Tokoh pembeli tanpa wajah di kanan */}
          <div style={{position: 'absolute', left: 1030, top: FLOOR_Y}}>
            <div
              style={{
                position: 'absolute',
                left: -94,
                top: -118,
                width: 88,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#9A5A42',
                transform: 'rotate(-10deg)',
              }}
            />
            {/* Tas belanja kertas */}
            <div
              style={{
                position: 'absolute',
                left: -116,
                top: -102,
                width: 44,
                height: 52,
                borderRadius: 4,
                backgroundColor: C.woodHi,
                border: `2px solid ${C.woodLo}`,
              }}
            />
            <Figure x={0} y={0} s={1.06} shirt="#9A5A42" />
          </div>
        </Depth>

        {/* Lapisan depan */}
        <Depth z={0.88}>
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            <Slab x={-16} y={0} w={36} h={720} color="#2E221A" r={0} />
            <Slab x={1260} y={0} w={36} h={720} color="#2E221A" r={0} />
          </AbsoluteFill>
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};

const SCENES: CutScene[] = [
  {id: 'gaji', component: BeatGaji, durationInFrames: 171},
  {id: 'belanja', component: BeatBelanja, durationInFrames: 163},
];

const CUTS: Record<string, CutSpec> = {
  belanja: {kind: 'tapePull', y: 165, frames: 10, align: 'mid'},
};

export const PB01: React.FC = () => <CutSeries scenes={SCENES} cuts={CUTS} />;

export default PB01;
