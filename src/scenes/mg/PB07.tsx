// Adegan MG-07 Timbangan yang Salah Arah: dacin kertas menimbang empat pasangan nilai secara stop-motion hingga terkunci miring berat ke sisi curang sebagai pemicu MG-08.
// Gaya papercut Dunia Bocor dengan bunyi jatuh bertenaga pada tiap pasangan, tanpa wajah, dan hanya memakai enam teks layar dari naskah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, Pill, PopIn, Slab, Stage} from './mgkit';
import {C} from '../../lib/tokens';
import {Disc} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {Plant, Shelf, Window} from '../../lib/paper/sets';

export const PB07_DUR = 525;
export const DUR = PB07_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

const FULCRUM_X = 640;
const FULCRUM_Y = 232;
const ARM_LEN = 316;
const CORD_H = 132;

// Pita penghargaan kertas (pasangan 1: anggaran yang harus habis)
const PitaPenghargaan: React.FC<{yOffset: number; opacity: number}> = ({yOffset, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -124 + yOffset,
        width: 112,
        height: 124,
        translate: '-50% 0',
        opacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.42))',
      }}
    >
      {/* Dua ekor pita di bagian bawah */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 66,
          width: 24,
          height: 56,
          backgroundColor: '#9A5A42',
          transform: 'rotate(12deg)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 66,
          width: 24,
          height: 56,
          backgroundColor: '#7D4531',
          transform: 'rotate(-12deg)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
        }}
      />
      {/* Kelopak medali kertas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 6,
          width: 82,
          height: 82,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: '#D99B38',
          border: '4px solid #8A5E1A',
          filter: 'url(#torn)',
        }}
      />
      {/* Cincin dalam polos (tanpa wajah atau angka) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 22,
          width: 50,
          height: 50,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: '#E8B84B',
          border: '3px solid #9C6B19',
        }}
      />
    </div>
  );
};

// Map rapi bertali kertas (pasangan 2: laporan yang rapi)
const MapRapiBertali: React.FC<{yOffset: number; opacity: number}> = ({yOffset, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -86 + yOffset,
        width: 152,
        height: 86,
        translate: '-50% 0',
        opacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 6px 9px rgba(0,0,0,0.42))',
      }}
    >
      {/* Tumpukan tiga map rapi */}
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: idx * 3,
            top: 14 + idx * 22,
            width: 146,
            height: 24,
            borderRadius: 4,
            backgroundColor: idx === 1 ? '#C9B58E' : '#D9C7A3',
            border: `2px solid ${C.inkSoft}`,
          }}
        />
      ))}
      {/* Tali pengikat vertikal + simpul pita rapi di tengah */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 12,
          width: 14,
          height: 72,
          translate: '-50% 0',
          backgroundColor: C.tag,
          borderLeft: `1px solid ${C.inkSoft}`,
          borderRight: `1px solid ${C.inkSoft}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          width: 44,
          height: 16,
          translate: '-50% 0',
          borderRadius: 8,
          border: `4px solid ${C.tag}`,
          backgroundColor: '#E8DFD3',
        }}
      />
    </div>
  );
};

// Menara kecil kertas di piring kanan (pasangan 2: hasil yang nyata)
const MenaraKecilKertas: React.FC<{scaleY: number; opacity: number}> = ({scaleY, opacity}) => {
  if (opacity <= 0.01 || scaleY <= 0.02) return null;
  const h = 114;
  const baseW = 46;
  const topW = 14;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -h,
        width: baseW,
        height: h,
        translate: '-50% 0',
        transformOrigin: '50% 100%',
        transform: `scaleY(${scaleY})`,
        opacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.38))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#5D564E',
          clipPath: `polygon(${(baseW - topW) / 2}px 0%, ${(baseW + topW) / 2}px 0%, 100% 100%, 0% 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#8A7F72',
          clipPath: `polygon(${(baseW - topW) / 2}px 0%, 50% 0%, 50% 100%, 0% 100%)`,
        }}
      />
      {[0.3, 0.62].map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '16%',
            right: '16%',
            top: `${r * 100}%`,
            height: 3,
            backgroundColor: '#2E221A',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -6,
          width: 12,
          height: 12,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: '#8A7A60',
          border: '2px solid #2E221A',
        }}
      />
    </div>
  );
};

// Kaca pembesar bertangkai tipis rapuh di piring kanan (pasangan 3: risikonya kecil)
const KacaPembesarRapuh: React.FC<{yOffset: number; opacity: number}> = ({yOffset, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -102 + yOffset,
        width: 96,
        height: 102,
        translate: '-50% 0',
        opacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.36))',
      }}
    >
      {/* Tangkai tipis rapuh */}
      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 52,
          width: 4,
          height: 48,
          backgroundColor: '#8A7A60',
          borderRadius: 2,
        }}
      />
      {/* Retak kecil pada tangkai tipis */}
      <div
        style={{
          position: 'absolute',
          left: 41,
          top: 72,
          width: 14,
          height: 2,
          backgroundColor: '#2E221A',
          transform: 'rotate(-24deg)',
        }}
      />
      {/* Lingkaran kaca pembesar */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 4,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '5px solid #8A7A60',
          backgroundColor: 'rgba(232, 223, 211, 0.35)',
        }}
      />
      {/* Kilau tipis pada kaca */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 14,
          width: 16,
          height: 8,
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.45)',
          transform: 'rotate(-30deg)',
        }}
      />
    </div>
  );
};

// Tumpukan koin emas-ocher besar di piring kiri (pasangan 3: untungnya besar & pasangan 4: curang)
const TumpukanKoinBesar: React.FC<{
  rows: number;
  yOffset: number;
  opacity: number;
  massive?: boolean;
}> = ({rows, yOffset, opacity, massive = false}) => {
  if (opacity <= 0.01) return null;
  const cols = massive ? [-48, 0, 48] : [-32, 32];
  const coinW = massive ? 54 : 62;
  const coinH = 13;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: yOffset,
        width: 180,
        height: 10,
        translate: '-50% 0',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {cols.map((cxOffset, cIdx) => {
        const colRows = massive
          ? cIdx === 1
            ? rows + 2
            : rows
          : cIdx === 0
            ? rows
            : Math.max(1, rows - 1);
        return Array.from({length: colRows}).map((_, rIdx) => {
          const jitter = ((rIdx * 5 + cIdx * 3) % 5 - 2) * 1.5;
          return (
            <div
              key={`${cIdx}-${rIdx}`}
              style={{
                position: 'absolute',
                left: 90 + cxOffset + jitter,
                top: -(rIdx + 1) * coinH,
                width: coinW,
                height: coinH,
                translate: '-50% 0',
                borderRadius: 4,
                backgroundColor: rIdx % 2 === 0 ? '#E8A838' : '#D9962B',
                border: '1.5px solid #8A5E1A',
                boxShadow: '1px 2px 4px rgba(0,0,0,0.38)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 3,
                  backgroundColor: '#FFE082',
                }}
              />
            </div>
          );
        });
      })}
    </div>
  );
};

// Label piring timbangan yang menempel di bawah masing-masing piring tanpa menutupi objek atau balok
const LabelPiring: React.FC<{
  text: string;
  at: number;
  endAt?: number;
  bg?: string;
  color?: string;
  seed: string;
}> = ({text, at, endAt, bg = C.ink, color = '#F3E6D3', seed}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  if (endAt !== undefined && f > endAt + 10) return null;

  const outOpacity =
    endAt !== undefined ? interpolate(f, [endAt, endAt + 8], [1, 0], CLAMP) : 1;

  return (
    <div style={{position: 'absolute', left: 0, top: 24, opacity: outOpacity}}>
      <AbsoluteFill style={{inset: 0, pointerEvents: 'none'}}>
        <PopIn at={at}>
          <Boil seed={seed} amp={0.4} rot={0.05}>
            <Pill x={0} y={0} text={text} bg={bg} color={color} size={25} />
          </Boil>
        </PopIn>
      </AbsoluteFill>
    </div>
  );
};

export const PB07: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Beat 1 awal (f: 0..24): Dacin kertas masuk dari bawah panggung
  const scaleEnterY = interpolate(sf, [0, 22], [360, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Sudut kemiringan balok dacin (negatif = sisi kiri turun berat, sisi kanan terangkat)
  // Pasangan 1 thunk di f=48, Pasangan 2 thunk di f=150, Pasangan 3 thunk di f=288, Pasangan 4 thunk di f=406, Terkunci di f=468
  const beamDeg = interpolate(
    sf,
    [
      0, 44, 48, 54, 60, 102, 114,
      146, 150, 156, 162, 194, 206,
      284, 288, 294, 300, 346, 358,
      402, 406, 412, 418, 468, 525,
    ],
    [
      0, 0, -17.5, -13.5, -15, -15, -3,
      -3, -18, -14, -15.5, -15.5, -3,
      -3, -19, -15, -16.5, -16.5, -2,
      -2, -20.5, -16.8, -18, -18, -18,
    ],
    CLAMP,
  );

  const rad = (beamDeg * Math.PI) / 180;
  const curFulcrumY = FULCRUM_Y + scaleEnterY;

  // Koordinat ujung balok kiri dan kanan (terhitung presisi agar tali & piring tetap vertikal)
  const leftTipX = FULCRUM_X - ARM_LEN * Math.cos(rad);
  const leftTipY = curFulcrumY - ARM_LEN * Math.sin(rad);
  const rightTipX = FULCRUM_X + ARM_LEN * Math.cos(rad);
  const rightTipY = curFulcrumY + ARM_LEN * Math.sin(rad);

  const leftPanX = leftTipX;
  const leftPanY = leftTipY + CORD_H;
  const rightPanX = rightTipX;
  const rightPanY = rightTipY + CORD_H;

  // Pasangan 1 (f: 28..112): Pita penghargaan jatuh di kiri (thunk f=48), "tepat guna" terangkat di kanan
  const p1DropY = interpolate(sf, [34, 48], [-190, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const p1Opacity = interpolate(f, [32, 38, 102, 112], [0, 1, 1, 0], CLAMP);

  // Pasangan 2 (f: 120..204): Map rapi jatuh di kiri (thunk f=150), menara "hasil yang nyata" di kanan
  const p2TowerScaleY = interpolate(sf, [120, 136], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const p2FolderDropY = interpolate(sf, [136, 150], [-190, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const p2Opacity = interpolate(f, [118, 124, 194, 204], [0, 1, 1, 0], CLAMP);

  // Pasangan 3 (f: 214..356): Kaca pembesar rapuh di kanan ("risikonya kecil"), tumpukan koin besar di kiri ("untungnya besar")
  const p3GlassDropY = interpolate(sf, [216, 232], [-150, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const p3CoinsDropY = interpolate(sf, [270, 288], [-190, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const p3Opacity = interpolate(f, [214, 220, 346, 356], [0, 1, 1, 0], CLAMP);

  // Pasangan 4 (f: 372..525): Piring "curang" penuh koin menekan ke bawah, piring "benar" kosong terangkat, lalu terkunci (f=468)
  const p4CoinsDropY = interpolate(sf, [388, 406], [-210, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const p4Opacity = interpolate(f, [386, 392], [0, 1], CLAMP);

  // Pengunci mekanis pada poros dacin di Beat 5 (f=468): mengunci kemiringan curang dan ditahan
  const lockSlideX = interpolate(sf, [456, 468], [54, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const lockOpacity = interpolate(f, [454, 460], [0, 1], CLAMP);

  return (
    <Stage dur={DUR} banner="">
      <SnapZoom at={468} x={640} y={240} to={1.07} settle={1.02} shake={5} roll={0.4}>
        <OrbitCamera dur={DUR} yaw={12} push={1.08} origin={[640, 380]}>
          {/* Latar jauh Dunia Bocor */}
          <Depth z={0.12}>
            <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.16)'}} />
            <Window x={52} y={138} w={176} h={235} night={false} />
            <Shelf x={1018} y={196} w={215} books={3} />
            <Plant x={1145} y={376} s={0.7} />
          </Depth>

          {/* Panggung tengah: dacin kertas besar, empat pasangan beban, dan mekanisme pengunci */}
          <Depth z={0.5}>
            {/* Tiang berdiri dan alas dacin kayu kertas */}
            <div
              style={{
                position: 'absolute',
                left: FULCRUM_X,
                top: curFulcrumY,
                width: 240,
                height: FLOOR_Y - FULCRUM_Y,
                translate: '-50% 0',
                pointerEvents: 'none',
              }}
            >
              <AbsoluteFill style={{inset: 0}}>
                <Paper lift={6}>
                  {/* Tiang utama dacin */}
                  <Slab
                    x={106}
                    y={-18}
                    w={28}
                    h={FLOOR_Y - FULCRUM_Y - 12}
                    color={C.wood}
                    shade={C.woodLo}
                    shadeH={0.22}
                    r={6}
                    grain={0.7}
                  />
                  {/* Tumpuan bawah bertingkat */}
                  <Slab
                    x={36}
                    y={FLOOR_Y - FULCRUM_Y - 42}
                    w={168}
                    h={22}
                    color={C.woodHi}
                    shade={C.wood}
                    shadeH={0.35}
                    r={5}
                  />
                  <Slab
                    x={8}
                    y={FLOOR_Y - FULCRUM_Y - 22}
                    w={224}
                    h={22}
                    color={C.woodLo}
                    shade={C.ink}
                    shadeH={0.35}
                    r={6}
                  />
                </Paper>
              </AbsoluteFill>
            </div>

            {/* Balok melintang dacin yang berputar miring */}
            <div
              style={{
                position: 'absolute',
                left: FULCRUM_X,
                top: curFulcrumY,
                width: ARM_LEN * 2 + 44,
                height: 24,
                translate: '-50% -50%',
                transform: `rotate(${beamDeg}deg)`,
                backgroundColor: C.brass,
                border: `3px solid ${C.brassLo}`,
                borderRadius: 12,
                boxShadow: '2px 6px 10px rgba(0,0,0,0.42)',
                pointerEvents: 'none',
              }}
            >
              {/* Strip sorotan logam di bagian atas balok */}
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  right: 14,
                  top: 3,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#FFE082',
                  opacity: 0.75,
                }}
              />
              {/* Cincin kait di ujung kiri dan kanan balok */}
              <Disc x={22} y={12} d={16} color={C.woodLo} />
              <Disc x={ARM_LEN * 2 + 22} y={12} d={16} color={C.woodLo} />
            </div>

            {/* Poros tengah dacin + palang pengunci yang membekukan kemiringan curang di f=468 */}
            <div
              style={{
                position: 'absolute',
                left: FULCRUM_X,
                top: curFulcrumY,
                width: 64,
                height: 64,
                translate: '-50% -50%',
                pointerEvents: 'none',
              }}
            >
              <Disc x={32} y={32} d={48} color={C.woodLo} />
              <Disc x={32} y={32} d={28} color={C.brass} />

              {/* Pasak pengunci mekanis Beat 5 */}
              {lockOpacity > 0.01 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 32 + lockSlideX,
                    top: 10,
                    width: 44,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: C.tag,
                    border: `2px solid ${C.ink}`,
                    transform: 'rotate(-18deg)',
                    opacity: lockOpacity,
                    boxShadow: '2px 4px 6px rgba(0,0,0,0.45)',
                  }}
                />
              )}
            </div>

            {/* Tali penggantung vertikal untuk piring kiri dan kanan */}
            <svg
              width={1280}
              height={720}
              viewBox="0 0 1280 720"
              style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
            >
              {/* Tali kiri */}
              <line
                x1={leftTipX}
                y1={leftTipY}
                x2={leftPanX - 86}
                y2={leftPanY}
                stroke={C.inkSoft}
                strokeWidth={3.5}
              />
              <line
                x1={leftTipX}
                y1={leftTipY}
                x2={leftPanX + 86}
                y2={leftPanY}
                stroke={C.inkSoft}
                strokeWidth={3.5}
              />
              {/* Tali kanan */}
              <line
                x1={rightTipX}
                y1={rightTipY}
                x2={rightPanX - 86}
                y2={rightPanY}
                stroke={C.inkSoft}
                strokeWidth={3.5}
              />
              <line
                x1={rightTipX}
                y1={rightTipY}
                x2={rightPanX + 86}
                y2={rightPanY}
                stroke={C.inkSoft}
                strokeWidth={3.5}
              />
            </svg>

            {/* PIRING KIRI (sisi yang terus menekan turun ke bawah) */}
            <div
              style={{
                position: 'absolute',
                left: leftPanX,
                top: leftPanY,
              }}
            >
              {/* Objek beban di atas piring kiri per pasangan */}
              <PitaPenghargaan yOffset={p1DropY} opacity={p1Opacity} />
              <MapRapiBertali yOffset={p2FolderDropY} opacity={p2Opacity} />
              <TumpukanKoinBesar
                rows={7}
                yOffset={p3CoinsDropY}
                opacity={p3Opacity}
                massive={false}
              />
              <TumpukanKoinBesar
                rows={9}
                yOffset={p4CoinsDropY}
                opacity={p4Opacity}
                massive={true}
              />

              {/* Baki piring timbangan kiri */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 224,
                  height: 20,
                  translate: '-50% 0',
                  backgroundColor: '#C9B58E',
                  border: `3px solid ${C.inkSoft}`,
                  borderRadius: '4px 4px 16px 16px',
                  boxShadow: '2px 6px 10px rgba(0,0,0,0.42)',
                }}
              />

              {/* Label piring kiri sesuai brief */}
              <LabelPiring
                text="untungnya besar"
                at={288}
                endAt={346}
                bg={C.ink}
                color="#F5C542"
                seed="lbl-untung"
              />
              <LabelPiring
                text="curang"
                at={382}
                bg={C.tag}
                color={C.tagText}
                seed="lbl-curang"
              />
            </div>

            {/* PIRING KANAN (sisi nilai baik yang terus terangkat ke atas) */}
            <div
              style={{
                position: 'absolute',
                left: rightPanX,
                top: rightPanY,
              }}
            >
              {/* Objek di atas piring kanan per pasangan (Pasangan 1 & 4 ringan/kosong) */}
              <MenaraKecilKertas scaleY={p2TowerScaleY} opacity={p2Opacity} />
              <KacaPembesarRapuh yOffset={p3GlassDropY} opacity={p3Opacity} />

              {/* Baki piring timbangan kanan */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 224,
                  height: 20,
                  translate: '-50% 0',
                  backgroundColor: '#C9B58E',
                  border: `3px solid ${C.inkSoft}`,
                  borderRadius: '4px 4px 16px 16px',
                  boxShadow: '2px 6px 10px rgba(0,0,0,0.42)',
                }}
              />

              {/* Label piring kanan sesuai brief */}
              <LabelPiring
                text="tepat guna"
                at={28}
                endAt={102}
                bg={C.sageLo}
                color="#F3E6D3"
                seed="lbl-tepat-guna"
              />
              <LabelPiring
                text="hasil yang nyata"
                at={126}
                endAt={194}
                bg={C.sageLo}
                color="#F3E6D3"
                seed="lbl-hasil-nyata"
              />
              <LabelPiring
                text="risikonya kecil"
                at={224}
                endAt={346}
                bg="#6B4A33"
                color="#F3E6D3"
                seed="lbl-risiko-kecil"
              />
              <LabelPiring
                text="benar"
                at={376}
                bg={C.sageLo}
                color="#F3E6D3"
                seed="lbl-benar"
              />
            </div>
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

export default PB07;
