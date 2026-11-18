// Adegan MG-04 Vonis dan Janji yang Belum Berdiri: palu dan cap menghantam dokumen putusan tanpa tokoh pejabat, lalu kamera mundur memperlihatkan petak menara yang sebagian hanya fondasi dan garis putus-putus.
// Gaya papercut Dunia Bocor dengan lampu redup, gerak stop-motion tenang, dan tanpa angka atau label jumlah di luar naskah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {Disc} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {Shelf, Window} from '../../lib/paper/sets';
import {TapeCorners} from '../../lib/paper/tape';

export const PB04_DUR = 283;
export const DUR = PB04_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

// Dokumen putusan pengadilan polos (tanpa nama, lambang, atau angka tambahan) + meja sidang kayu
const DokumenPutusan: React.FC = () => {
  const f = useCurrentFrame();

  // Getaran kecil saat palu (f=34) dan stempel berat (f=104) menghantam dokumen
  const gavelImpactY = interpolate(f, [34, 37, 43], [0, 5, 0], CLAMP);
  const stampImpactY = interpolate(f, [104, 108, 116], [0, 8, 0], CLAMP);
  const totalBumpY = gavelImpactY + stampImpactY;

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 170 + totalBumpY,
        width: 392,
        height: FLOOR_Y - 170,
      }}
    >
      {/* Meja sidang kayu di bawah dokumen */}
      <AbsoluteFill style={{inset: 0}}>
        <Paper lift={5}>
          {/* Kaki meja kiri & kanan */}
          <Slab x={18} y={368} w={24} h={FLOOR_Y - 538} color={C.woodLo} r={3} />
          <Slab x={346} y={368} w={24} h={FLOOR_Y - 538} color={C.woodLo} r={3} />
          {/* Daun meja kayu */}
          <Slab
            x={0}
            y={344}
            w={392}
            h={26}
            color={C.woodHi}
            shade={C.wood}
            shadeH={0.35}
            r={4}
          />
          {/* Tatakan kayu kecil untuk palu sidang di sisi kanan meja */}
          <Slab
            x={304}
            y={324}
            w={72}
            h={20}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.3}
            r={4}
          />
        </Paper>
      </AbsoluteFill>

      {/* Lembar dokumen putusan kertas */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 8,
          width: 288,
          height: 336,
          backgroundColor: '#E3D4B7',
          borderRadius: 5,
          border: `2px solid ${C.inkSoft}`,
          filter: 'url(#torn) drop-shadow(3px 8px 12px rgba(0,0,0,0.44))',
        }}
      >
        <TapeCorners x={0} y={0} w={288} h={336} rot={-0.4} len={26} />

        {/* Pita kepala dokumen kusam tanpa lambang atau tulisan */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: 22,
            height: 16,
            borderRadius: 3,
            backgroundColor: '#8A7A60',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 56,
            top: 46,
            height: 8,
            borderRadius: 3,
            backgroundColor: '#A69578',
          }}
        />

        {/* Baris-baris tinta abstrak (bukan kata/angka) */}
        {[72, 90, 108, 206, 224].map((ly, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 24,
              width: idx % 2 === 0 ? 236 : 198,
              top: ly,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#9E8D70',
              opacity: 0.85,
            }}
          />
        ))}

        {/* Beat 1 (f=34): Teks "15 tahun penjara" muncul di dokumen saat palu menghantam */}
        <AbsoluteFill style={{inset: 0}}>
          <PopIn at={34}>
            <Boil seed="vonis-15-tahun" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 144,
                  top: 132,
                  translate: '-50% 0',
                  rotate: '-1.5deg',
                  backgroundColor: C.ink,
                  padding: '11px 20px 13px',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 27,
                  lineHeight: 1,
                  color: '#F3E6D3',
                  whiteSpace: 'nowrap',
                  filter: 'url(#torn) drop-shadow(2px 4px 6px rgba(0,0,0,0.35))',
                }}
              >
                15 tahun penjara
              </div>
            </Boil>
          </PopIn>
        </AbsoluteFill>

        {/* Beat 2 (f=104): Cap tinta "berkekuatan hukum tetap" muncul saat cap berat menghantam */}
        <AbsoluteFill style={{inset: 0}}>
          <PopIn at={104}>
            <Boil seed="cap-inkracht" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: 144,
                  top: 248,
                  translate: '-50% 0',
                  rotate: '1.8deg',
                  padding: '9px 14px 11px',
                  backgroundColor: 'rgba(217, 199, 163, 0.94)',
                  border: `3px solid ${C.tag}`,
                  borderRadius: 4,
                  fontFamily: FONT.label,
                  fontWeight: 800,
                  fontSize: 17,
                  lineHeight: 1.1,
                  color: C.tag,
                  whiteSpace: 'nowrap',
                  filter: 'url(#torn)',
                }}
              >
                berkekuatan hukum tetap
              </div>
            </Boil>
          </PopIn>
        </AbsoluteFill>
      </div>
    </div>
  );
};

// Palu sidang kertas di sisi kanan meja: terangkat lalu menghantam tatakan pada frame 34
const PaluSidang: React.FC = () => {
  const f = useCurrentFrame();

  const swingDeg =
    f < 26
      ? interpolate(f, [4, 24], [-18, -48], {...CLAMP, easing: Easing.out(Easing.sin)})
      : f < 34
        ? interpolate(f, [26, 34], [-48, 0], {...CLAMP, easing: Easing.in(Easing.cubic)})
        : interpolate(f, [34, 38, 44], [0, -7, 0], {...CLAMP, easing: Easing.out(Easing.sin)});

  return (
    <div
      style={{
        position: 'absolute',
        left: 416,
        top: 494,
        width: 150,
        height: 90,
        transformOrigin: '132px 14px',
        transform: `rotate(${swingDeg}deg)`,
        pointerEvents: 'none',
        filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.42))',
      }}
    >
      {/* Gagang palu kayu */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 8,
          width: 118,
          height: 14,
          borderRadius: 7,
          backgroundColor: C.woodHi,
          border: `2px solid ${C.woodLo}`,
        }}
      />
      {/* Kepala palu sidang */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: -12,
          width: 34,
          height: 54,
          borderRadius: 6,
          backgroundColor: C.wood,
          border: `2px solid ${C.inkSoft}`,
        }}
      />
      {/* Ring kuningan di tengah kepala palu */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 9,
          width: 38,
          height: 12,
          borderRadius: 3,
          backgroundColor: C.brass,
          border: `1px solid ${C.brassLo}`,
        }}
      />
    </div>
  );
};

// Stempel berat Beat 2: turun pelan dan berat menghantam dokumen pada frame 104
const StempelPutusanBerat: React.FC = () => {
  const f = useCurrentFrame();

  const opacity = interpolate(f, [74, 82, 128, 138], [0, 1, 1, 0], CLAMP);
  const stampBottomY =
    f < 104
      ? interpolate(f, [76, 104], [190, 468], {...CLAMP, easing: Easing.in(Easing.cubic)})
      : f < 116
        ? interpolate(f, [104, 108, 116], [468, 474, 468], CLAMP)
        : interpolate(f, [116, 138], [468, 160], {...CLAMP, easing: Easing.in(Easing.cubic)});

  const squashX = interpolate(f, [103, 106, 113], [1, 1.07, 1], CLAMP);
  const squashY = interpolate(f, [103, 106, 113], [1, 0.88, 1], CLAMP);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 232,
        top: stampBottomY,
        width: 248,
        height: 146,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scale(${squashX}, ${squashY})`,
        opacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(4px 10px 14px rgba(0,0,0,0.48))',
      }}
    >
      {/* Pegangan kayu atas */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 50,
          height: 52,
          translate: '-50% 0',
          borderRadius: '25px 25px 14px 14px',
          backgroundColor: C.woodHi,
          border: `2px solid ${C.woodLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 46,
          width: 28,
          height: 36,
          translate: '-50% 0',
          backgroundColor: C.wood,
        }}
      />
      {/* Badan balok kayu stempel */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 80,
          width: 232,
          height: 44,
          borderRadius: 6,
          backgroundColor: C.woodLo,
          border: `2px solid ${C.ink}`,
        }}
      />
      {/* Bantalan tinta terakota */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 124,
          width: 216,
          height: 16,
          borderRadius: '0 0 4px 4px',
          backgroundColor: C.tag,
        }}
      />
    </div>
  );
};

// Satu petak menara di lantai panggung: bisa berdiri kusam ATAU hanya fondasi + garis putus-putus
const PetakMenara: React.FC<{
  cx: number;
  built: boolean;
  towerH: number;
  tiltDeg?: number;
  appearAt: number;
}> = ({cx, built, towerH, tiltDeg = 0, appearAt}) => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  const baseU = interpolate(sf, [appearAt, appearAt + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const towerU = interpolate(sf, [appearAt + 14, appearAt + 38], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  if (baseU <= 0.02) return null;

  const plotW = 148;
  const baseW = 58;
  const topW = 16;
  const curH = Math.round(towerH * towerU);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: FLOOR_Y,
        width: plotW,
        height: 340,
        translate: '-50% -100%',
        opacity: baseU,
      }}
    >
      {/* Lahan petak tanah kertas di lantai panggung + dua patok kayu tepi */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: plotW,
          height: 14,
          borderRadius: 4,
          backgroundColor: '#6B4A33',
          border: `2px solid ${C.inkSoft}`,
          boxShadow: '0 3px 6px rgba(0,0,0,0.38)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 6,
          bottom: 10,
          width: 8,
          height: 24,
          borderRadius: 2,
          backgroundColor: C.woodLo,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 6,
          bottom: 10,
          width: 8,
          height: 24,
          borderRadius: 2,
          backgroundColor: C.woodLo,
        }}
      />

      {built ? (
        /* Menara kertas yang berdiri (kusam, redup, tanpa sinyal menyala) */
        curH > 4 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 12,
              width: baseW,
              height: curH,
              translate: '-50% 0',
              transformOrigin: '50% 100%',
              transform: `rotate(${tiltDeg}deg)`,
              filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.4))',
            }}
          >
            {/* Rangka badan menara trapesium */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#5D564E',
                clipPath: `polygon(${(baseW - topW) / 2}px 0%, ${(baseW + topW) / 2}px 0%, 100% 100%, 0% 100%)`,
              }}
            />
            {/* Sisi kertas lebih terang di sebelah kiri */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#8A7F72',
                clipPath: `polygon(${(baseW - topW) / 2}px 0%, 50% 0%, 50% 100%, 0% 100%)`,
              }}
            />
            {/* Palang melintang struktur menara */}
            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '14%',
                  right: '14%',
                  top: `${ratio * 100}%`,
                  height: 4,
                  backgroundColor: '#2E221A',
                  opacity: 0.8,
                }}
              />
            ))}
            {/* Puncak menara bulat polos (mati/tidak memancar) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -8,
                width: 16,
                height: 16,
                translate: '-50% 0',
                borderRadius: '50%',
                backgroundColor: '#7A6E5D',
                border: '2px solid #2E221A',
              }}
            />
          </div>
        )
      ) : (
        /* Petak kosong: hanya fondasi rendah berdebu + garis putus-putus siluet menara yang tidak pernah berdiri */
        <>
          {/* Fondasi beton kertas rendah di atas petak */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 12,
              width: 74,
              height: 20,
              translate: '-50% 0',
              backgroundColor: '#8A7F72',
              borderRadius: '3px 3px 0 0',
              border: `2px solid ${C.inkSoft}`,
              filter: 'url(#torn)',
            }}
          />
          {/* Tumpukan batu/kertas kecil di samping fondasi */}
          <Disc x={42} y={322} d={14} color="#6E6A64" />
          <Disc x={108} y={324} d={12} color="#7A7368" />

          {/* Garis putus-putus kerangka menara hantu di atas fondasi */}
          {towerU > 0.05 && (
            <svg
              width={plotW}
              height={320}
              viewBox={`0 0 ${plotW} 320`}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 30,
                opacity: interpolate(towerU, [0.05, 1], [0, 0.72], CLAMP),
                pointerEvents: 'none',
              }}
            >
              <polygon
                points={`${plotW / 2 - topW / 2},${320 - towerH} ${plotW / 2 + topW / 2},${320 - towerH} ${plotW / 2 + baseW / 2},318 ${plotW / 2 - baseW / 2},318`}
                fill="none"
                stroke="#3A3832"
                strokeWidth={3}
                strokeDasharray="9 8"
                strokeLinejoin="round"
              />
              <line
                x1={plotW / 2 - 18}
                y1={320 - towerH * 0.5}
                x2={plotW / 2 + 18}
                y2={320 - towerH * 0.5}
                stroke="#3A3832"
                strokeWidth={2.5}
                strokeDasharray="7 7"
              />
              <circle
                cx={plotW / 2}
                cy={320 - towerH - 8}
                r={7}
                fill="none"
                stroke="#3A3832"
                strokeWidth={2.5}
                strokeDasharray="4 4"
              />
            </svg>
          )}
        </>
      )}
    </div>
  );
};

export const PB04: React.FC = () => {
  const f = useCurrentFrame();

  // Beat 3 (f=140..192): Kamera mundur mulus dari close-up dokumen putusan ke panggung luas dengan petak menara
  const pullBackU = interpolate(f, [140, 192], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const camScale = interpolate(pullBackU, [0, 1], [1.5, 1], CLAMP);
  const focusX = interpolate(pullBackU, [0, 1], [278, 640], CLAMP);
  const focusY = interpolate(pullBackU, [0, 1], [368, 360], CLAMP);

  const tx = 640 - focusX * camScale;
  const ty = 360 - focusY * camScale;

  // Cahaya lampu sore redup yang menyorot petak-petak menara setelah kamera mundur
  const stageLampOpacity = interpolate(f, [175, 210], [0, 0.24], CLAMP);

  return (
    <Stage dur={DUR} banner="">
      <SnapZoom at={34} x={560} y={350} to={1.06} settle={1.01} shake={5} roll={0.4}>
        <OrbitCamera dur={DUR} yaw={12} push={1.07} origin={[640, 380]}>
          {/* Transformasi kamera mundur dari dokumen putusan ke panggung penuh */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1280,
              height: 720,
              transformOrigin: '0px 0px',
              transform: `translate(${tx}px, ${ty}px) scale(${camScale})`,
            }}
          >
            {/* Latar jauh Dunia Bocor */}
            <Depth z={0.12}>
              <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.16)'}} />
              <Window x={46} y={136} w={175} h={235} night={false} />
              <Shelf x={1015} y={198} w={215} books={3} />
            </Depth>

            {/* Sorotan lampu redup Dunia Bocor di atas petak menara */}
            <Depth z={0.32}>
              <div
                style={{
                  position: 'absolute',
                  left: 515,
                  top: 0,
                  width: 650,
                  height: FLOOR_Y,
                  background:
                    'linear-gradient(180deg, rgba(217, 199, 163, 0.42) 0%, rgba(184, 137, 58, 0.14) 68%, rgba(0, 0, 0, 0) 100%)',
                  clipPath: 'polygon(24% 0%, 76% 0%, 100% 100%, 0% 100%)',
                  opacity: stageLampOpacity,
                  pointerEvents: 'none',
                }}
              />
            </Depth>

            {/* Panggung tengah: dokumen putusan, palu, stempel berat, dan deretan petak menara */}
            <Depth z={0.5}>
              <DokumenPutusan />
              <PaluSidang />
              <StempelPutusanBerat />

              {/* Beat 3–4: Empat petak menara di lantai panggung (sebagian berdiri, sebagian hanya fondasi + garis putus-putus) */}
              <PetakMenara cx={568} built={true} towerH={244} tiltDeg={0} appearAt={168} />
              <PetakMenara cx={746} built={false} towerH={244} appearAt={174} />
              <PetakMenara cx={924} built={true} towerH={228} tiltDeg={1.8} appearAt={180} />
              <PetakMenara cx={1102} built={false} towerH={244} appearAt={186} />

              {/* Tag kesimpulan Beat 4: "tidak semuanya pernah berdiri" */}
              <AbsoluteFill style={{inset: 0}}>
                <PopIn at={206}>
                  <Boil seed="tag-belum-berdiri" amp={0.4} rot={0.05}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 835,
                        top: 132,
                        translate: '-50% 0',
                        rotate: '-1deg',
                        backgroundColor: C.tag,
                        padding: '12px 26px 14px',
                        fontFamily: FONT.caption,
                        fontWeight: 900,
                        fontSize: 31,
                        lineHeight: 1,
                        color: C.tagText,
                        whiteSpace: 'nowrap',
                        filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.42))',
                      }}
                    >
                      tidak semuanya pernah berdiri
                    </div>
                  </Boil>
                </PopIn>
              </AbsoluteFill>
            </Depth>

            {/* Bingkai tepi panggung kertas */}
            <Depth z={0.88}>
              <AbsoluteFill style={{pointerEvents: 'none'}}>
                <Slab x={-16} y={0} w={36} h={720} color="#2E221A" r={0} />
                <Slab x={1260} y={0} w={36} h={720} color="#2E221A" r={0} />
              </AbsoluteFill>
            </Depth>
          </div>
        </OrbitCamera>
      </SnapZoom>
    </Stage>
  );
};

export default PB04;
