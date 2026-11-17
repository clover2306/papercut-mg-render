// Adegan T01: Teater kertas halte pagi yang mempertanyakan janji transportasi gratis dan menahan rantai domino logika yang terlalu mulus.
// Sinkronisasi narasi scene 015-024 (982 frame @30fps) dengan karcis "Gratis", kartu pertanyaan, siluet tanpa wajah, dan jalur jalan pengukur macet.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, Paper, PopIn, Slab, SlideIn} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {CutScene, CutSeries, CutSpec} from '../../lib/paper/transitions';

export const T01_DUR = 982;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BEAT1_DUR = 234;
const BEAT2_DUR = 159;
const BEAT3_DUR = 222;
const BEAT4_DUR = 199;
const BEAT5_DUR = 168;

const PLATFORM_Y = 562;
const ROAD_TOP_Y = 588;

// Panggung bersama "Teater Kertas Halte Pagi": langit hangat pagi, bangunan halte, tiang rute polos, dan tirai kertas tepi.
const PanggungHaltePagi: React.FC<{
  curtainOpen?: number;
  curtainClose?: number;
  children: React.ReactNode;
}> = ({curtainOpen = 1, curtainClose = 0, children}) => {
  const leftCurtainX = interpolate(curtainOpen, [0, 1], [0, -540], CLAMP) + interpolate(curtainClose, [0, 1], [0, 60], CLAMP);
  const rightCurtainX = interpolate(curtainOpen, [0, 1], [0, 540], CLAMP) - interpolate(curtainClose, [0, 1], [0, 60], CLAMP);

  return (
    <AbsoluteFill>
      <Depth z={0} cover>
        {/* Dinding langit pagi kertas berlapis */}
        <Slab x={-180} y={-100} w={1640} h={920} color="#EFE3CE" r={0} grain={0.55} />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 26% 24%, rgba(255, 232, 178, 0.72) 0%, rgba(243, 214, 166, 0.25) 42%, rgba(58, 42, 28, 0.22) 100%)',
          }}
        />
        {/* Siluet blok kota jauh dari kertas krem-sage lembut */}
        {[
          {x: -40, y: 270, w: 150, h: 300, c: '#DDD0BC'},
          {x: 130, y: 225, w: 130, h: 345, c: '#D4C5AF'},
          {x: 280, y: 295, w: 165, h: 275, c: '#DFD2BE'},
          {x: 840, y: 260, w: 155, h: 310, c: '#D6C7B2'},
          {x: 1015, y: 215, w: 145, h: 355, c: '#CFC0A9'},
          {x: 1175, y: 285, w: 160, h: 285, c: '#DDD0BC'},
        ].map((b, i) => (
          <Slab key={i} x={b.x} y={b.y} w={b.w} h={b.h} color={b.c} shade="rgba(0,0,0,0.06)" shadeH={0.08} r={4} grain={0.45} />
        ))}
      </Depth>

      <Depth z={0.48}>
        {/* Struktur halte bus kertas di sisi kiri panggung (polos tanpa tulisan) */}
        <Paper lift={4}>
          <Slab x={64} y={185} w={250} h={18} color={ROOM.teal} shade="#204040" shadeH={0.35} r={4} />
          <Slab x={74} y={201} w={230} h={10} color={C.wood} r={2} />
          <Slab x={92} y={211} w={14} h={351} color={C.metalLo} r={2} />
          <Slab x={282} y={211} w={14} h={351} color={C.metalLo} r={2} />
          <Slab x={106} y={224} w={176} h={210} color="rgba(255,255,255,0.28)" r={3} />
          {/* Bangku tunggu halte */}
          <Slab x={116} y={474} w={156} h={14} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={3} />
          <Slab x={130} y={488} w={12} h={74} color={C.inkSoft} r={2} />
          <Slab x={246} y={488} w={12} h={74} color={C.inkSoft} r={2} />
        </Paper>

        {/* Tiang dan papan rute halte di kanan jauh (polos tanpa teks/angka) */}
        <Paper lift={4}>
          <Slab x={1172} y={220} w={12} h={342} color={C.metalLo} r={2} />
          <Slab x={1142} y={232} w={72} h={104} color={C.cream} shade={C.creamLo} shadeH={0.12} r={6} />
          <Slab x={1154} y={252} w={48} h={10} color={ROOM.teal} r={2} />
          <Slab x={1154} y={272} w={48} h={10} color={C.amber} r={2} />
          <Slab x={1154} y={292} w={48} h={10} color={C.tag} r={2} />
        </Paper>

        {/* Trotoar kaki panggung & jalur jalan pengukur macet */}
        <Slab x={-80} y={PLATFORM_Y} w={1440} h={26} color={C.creamLo} shade="#A39584" shadeH={0.35} r={0} grain={0.5} />
        <Slab x={-80} y={ROAD_TOP_Y} w={1440} h={160} color={C.board} shade={C.boardLo} shadeH={0.25} r={0} grain={0.55} />
        {/* Garis markah jalan kertas putus-putus */}
        {Array.from({length: 14}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -30 + i * 104,
              top: ROAD_TOP_Y + 62,
              width: 56,
              height: 5,
              borderRadius: 2,
              backgroundColor: C.cream,
              opacity: 0.45,
            }}
          />
        ))}

        {children}
      </Depth>

      {/* Bingkai panggung teater kertas & gorden tepi */}
      <Depth z={0.96}>
        {/* Pelmet atas panggung */}
        <Slab x={-80} y={-24} w={1440} h={42} color="#8D3F2D" shade="#6B2D1F" shadeH={0.35} r={0} />
        {/* Tirai samping kiri & kanan */}
        <div
          style={{
            position: 'absolute',
            left: -40 + leftCurtainX,
            top: 0,
            width: 620,
            height: 740,
            pointerEvents: 'none',
          }}
        >
          <Paper lift={8}>
            <Slab x={0} y={0} w={620} h={740} color="#9E4733" shade="#783222" shadeH={0.14} r={0} grain={0.6} />
            {[110, 230, 350, 470, 565].map((lx, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: lx,
                  top: 0,
                  width: 14,
                  height: 740,
                  background: 'rgba(42, 16, 10, 0.22)',
                }}
              />
            ))}
          </Paper>
        </div>
        <div
          style={{
            position: 'absolute',
            right: -40 - rightCurtainX,
            top: 0,
            width: 620,
            height: 740,
            pointerEvents: 'none',
          }}
        >
          <Paper lift={8}>
            <Slab x={0} y={0} w={620} h={740} color="#9E4733" shade="#783222" shadeH={0.14} r={0} grain={0.6} />
            {[45, 140, 260, 380, 500].map((lx, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: lx,
                  top: 0,
                  width: 14,
                  height: 740,
                  background: 'rgba(42, 16, 10, 0.22)',
                }}
              />
            ))}
          </Paper>
        </div>
      </Depth>
    </AbsoluteFill>
  );
};

// Karcis kertas bercap "Gratis" (motif pengikat utama)
const KarcisGratis: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
}> = ({x, y, scale = 1, rot = -3}) => {
  const w = 320 * scale;
  const h = 168 * scale;
  const notch = 16 * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
      }}
    >
      <Boil seed="karcis-gratis" amp={0.4} rot={0.05}>
        <Paper lift={7}>
          <Slab
            x={0}
            y={0}
            w={w}
            h={h}
            color="#F5EAD6"
            shade="#DFD0B5"
            shadeH={0.12}
            r={12 * scale}
            grain={0.55}
          />
          {/* Garis sobek perforasi karcis */}
          <div
            style={{
              position: 'absolute',
              left: 56 * scale,
              top: 14 * scale,
              bottom: 14 * scale,
              borderLeft: `${Math.max(1.5, 2.5 * scale)}px dashed rgba(110, 88, 62, 0.45)`,
            }}
          />
          {/* Takik setengah lingkaran kiri dan kanan karcis */}
          <div
            style={{
              position: 'absolute',
              left: -notch / 2,
              top: h / 2 - notch / 2,
              width: notch,
              height: notch,
              borderRadius: '50%',
              backgroundColor: '#E5D7C1',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -notch / 2,
              top: h / 2 - notch / 2,
              width: notch,
              height: notch,
              borderRadius: '50%',
              backgroundColor: '#E5D7C1',
            }}
          />
          {/* Bingkai cap stempel di dalam karcis */}
          <div
            style={{
              position: 'absolute',
              left: 74 * scale,
              top: 26 * scale,
              right: 26 * scale,
              bottom: 26 * scale,
              border: `${Math.max(2, 4 * scale)}px solid ${C.tag}`,
              borderRadius: 8 * scale,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: FONT.banner,
                fontSize: 48 * scale,
                color: C.tag,
                letterSpacing: '0.03em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              Gratis
            </span>
          </div>
        </Paper>
      </Boil>
    </div>
  );
};

// Mobil kertas kecil untuk jalur jalan di kaki panggung (tanpa plat nomor/angka)
const MobilKertas: React.FC<{
  x: number;
  y: number;
  color: string;
  shade: string;
  opacity?: number;
}> = ({x, y, color, shade, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 112,
      height: 46,
      translate: '-50% -100%',
      opacity,
    }}
  >
    <Paper lift={3}>
      {/* Kabin atas mobil */}
      <Slab x={22} y={2} w={62} h={22} color={color} r="10px 12px 2px 2px" />
      {/* Kaca jendela */}
      <Slab x={29} y={6} w={21} h={13} color="#D8E5EA" r={3} />
      <Slab x={54} y={6} w={23} h={13} color="#D8E5EA" r={3} />
      {/* Badan mobil */}
      <Slab x={4} y={20} w={104} h={20} color={color} shade={shade} shadeH={0.28} r={7} />
      {/* Roda */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 31,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: C.ink,
          border: `3px solid ${C.creamLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: 31,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: C.ink,
          border: `3px solid ${C.creamLo}`,
        }}
      />
    </Paper>
  </div>
);

// Bayangan putus-putus jalur lengang (khayalan di Beat 4)
const BayanganMobilPutus: React.FC<{x: number; y: number; opacity: number}> = ({x, y, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 112,
      height: 44,
      translate: '-50% -100%',
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 22,
        top: 2,
        width: 62,
        height: 20,
        borderRadius: '10px 12px 0 0',
        border: `2.5px dashed ${C.creamHi}`,
        borderBottom: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 4,
        top: 20,
        width: 104,
        height: 18,
        borderRadius: 7,
        border: `2.5px dashed ${C.creamHi}`,
      }}
    />
  </div>
);

// Jalur jalan di kaki panggung: rapat = macet; bayangan putus-putus = khayalan lengang
const JalurJalanMacet: React.FC<{
  density: number; // 0 = sepi/khayalan, 1 = rapat penuh
  ghostOpacity?: number;
  shiftX?: number;
}> = ({density, ghostOpacity = 0, shiftX = 0}) => {
  const atasCars = [
    {baseX: 120, color: '#C9684B', shade: '#9E4B33'},
    {baseX: 258, color: '#5D7FA3', shade: '#425E7C'},
    {baseX: 396, color: '#D4A24C', shade: '#A67B32'},
    {baseX: 534, color: '#7E8C78', shade: '#5C6957'},
    {baseX: 672, color: '#B85A4A', shade: '#8E3F32'},
    {baseX: 810, color: '#4E6378', shade: '#364757'},
    {baseX: 948, color: '#C98A4B', shade: '#9A6632'},
    {baseX: 1086, color: '#6E7F8D', shade: '#4E5D69'},
    {baseX: 1220, color: '#B66A52', shade: '#8C4B37'},
  ];

  const bawahCars = [
    {baseX: 185, color: '#4F6D7A', shade: '#384F59'},
    {baseX: 325, color: '#C87D55', shade: '#9B5C3B'},
    {baseX: 465, color: '#8A7A60', shade: '#665944'},
    {baseX: 605, color: '#5B7065', shade: '#415249'},
    {baseX: 745, color: '#C9573C', shade: '#993D27'},
    {baseX: 885, color: '#6C7A89', shade: '#4D5864'},
    {baseX: 1025, color: '#B8934A', shade: '#8C6E32'},
    {baseX: 1165, color: '#7D6B7D', shade: '#5B4D5B'},
  ];

  return (
    <>
      {/* Bayangan lengang putus-putus (hanya saat khayalan Beat 4) */}
      {ghostOpacity > 0.01 ? (
        <>
          <BayanganMobilPutus x={310} y={ROAD_TOP_Y + 52} opacity={ghostOpacity} />
          <BayanganMobilPutus x={960} y={ROAD_TOP_Y + 106} opacity={ghostOpacity} />
        </>
      ) : null}

      {/* Mobil-mobil kertas padat di lajur atas */}
      {atasCars.map((car, idx) => {
        const threshold = idx / atasCars.length;
        const localVis = interpolate(density, [threshold * 0.72, threshold * 0.72 + 0.28], [0, 1], CLAMP);
        const dropY = interpolate(localVis, [0, 1], [-18, 0], CLAMP);
        return (
          <MobilKertas
            key={`a-${idx}`}
            x={car.baseX + shiftX}
            y={ROAD_TOP_Y + 52 + dropY}
            color={car.color}
            shade={car.shade}
            opacity={localVis}
          />
        );
      })}

      {/* Mobil-mobil kertas padat di lajur bawah */}
      {bawahCars.map((car, idx) => {
        const threshold = idx / bawahCars.length;
        const localVis = interpolate(density, [threshold * 0.72, threshold * 0.72 + 0.28], [0, 1], CLAMP);
        const dropY = interpolate(localVis, [0, 1], [-18, 0], CLAMP);
        return (
          <MobilKertas
            key={`b-${idx}`}
            x={car.baseX - shiftX * 0.8}
            y={ROAD_TOP_Y + 106 + dropY}
            color={car.color}
            shade={car.shade}
            opacity={localVis}
          />
        );
      })}
    </>
  );
};

// Siluet tokoh kertas TANPA WAJAH dengan lengan yang bisa mengangkat karcis "Gratis" kecil
const TokohTanpaWajah: React.FC<{
  x: number;
  y: number;
  shirt: string;
  bagColor?: string;
  raiseAt?: number;
  held?: boolean;
  scale?: number;
}> = ({x, y, shirt, bagColor, raiseAt = 0, held = false, scale = 1}) => {
  const f = useCurrentFrame();
  const lift = held
    ? 1
    : interpolate(f, [raiseAt, raiseAt + 14], [0, 1], {
        ...CLAMP,
        easing: Easing.out(Easing.cubic),
      });
  const armRot = interpolate(lift, [0, 1], [12, -138], CLAMP);
  const ticketScale = interpolate(lift, [0.45, 1], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 96 * scale,
        height: 196 * scale,
        translate: '-50% -100%',
      }}
    >
      <Paper lift={5}>
        {/* Kepala kertas polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 4 * scale,
            width: 48 * scale,
            height: 50 * scale,
            translate: '-50% 0',
            borderRadius: '50%',
            backgroundColor: C.cream,
            border: `${2.5 * scale}px solid ${C.inkSoft}`,
          }}
        />
        {/* Badan / kemeja rapi */}
        <Slab
          x={20 * scale}
          y={60 * scale}
          w={56 * scale}
          h={82 * scale}
          color={shirt}
          shade="rgba(0,0,0,0.16)"
          shadeH={0.18}
          r={10 * scale}
        />
        {/* Tas kerja / tas ransel rapi */}
        {bagColor ? (
          <Slab
            x={8 * scale}
            y={96 * scale}
            w={26 * scale}
            h={32 * scale}
            color={bagColor}
            shade="rgba(0,0,0,0.22)"
            shadeH={0.25}
            r={5 * scale}
          />
        ) : null}
        {/* Kaki */}
        <Slab x={26 * scale} y={142 * scale} w={18 * scale} h={52 * scale} color={C.inkSoft} r={5 * scale} />
        <Slab x={52 * scale} y={142 * scale} w={18 * scale} h={52 * scale} color={C.inkSoft} r={5 * scale} />
        {/* Lengan pengangkat karcis */}
        <div
          style={{
            position: 'absolute',
            left: 66 * scale,
            top: 68 * scale,
            width: 14 * scale,
            height: 58 * scale,
            transformOrigin: '50% 6px',
            rotate: `${armRot}deg`,
          }}
        >
          <Slab x={0} y={0} w={14 * scale} h={58 * scale} color={shirt} r={6 * scale} />
          {/* Karcis "Gratis" kecil di ujung tangan */}
          {ticketScale > 0.02 ? (
            <div
              style={{
                position: 'absolute',
                left: 7 * scale,
                top: 56 * scale,
                transform: `translate(-50%, 0) rotate(${-armRot}deg) scale(${ticketScale})`,
                backgroundColor: '#F5EAD6',
                border: `2px solid ${C.tag}`,
                borderRadius: 5 * scale,
                padding: `${4 * scale}px ${10 * scale}px`,
                whiteSpace: 'nowrap',
                boxShadow: '1px 3px 5px rgba(0,0,0,0.25)',
              }}
            >
              <span
                style={{
                  fontFamily: FONT.banner,
                  fontSize: 15 * scale,
                  color: C.tag,
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                Gratis
              </span>
            </div>
          ) : null}
        </div>
      </Paper>
    </div>
  );
};

// Kartu Pertanyaan Inti (Beat 2) dengan kata "turun?" yang merosot pelan di akhir ucapan
const KartuPertanyaan: React.FC<{
  x: number;
  y: number;
  flipProgress: number;
  wordProgressFrame: number;
}> = ({x, y, flipProgress, wordProgressFrame}) => {
  const scaleX = interpolate(flipProgress, [0, 1], [0.08, 1], CLAMP);
  const rotY = interpolate(flipProgress, [0, 1], [78, 0], CLAMP);

  const words = [
    {text: 'Apakah', at: 26},
    {text: 'gratis', at: 38},
    {text: 'otomatis', at: 54},
    {text: 'membuat', at: 72},
    {text: 'macet', at: 90},
  ];

  // Pada kata "turun?", huruf-hurufnya sedikit merosot lalu berhenti
  const turunAppear = interpolate(wordProgressFrame, [106, 114], [0, 1], CLAMP);
  const turunSink = interpolate(wordProgressFrame, [112, 128], [0, 13], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const turunTilt = interpolate(wordProgressFrame, [112, 128], [0, 2.5], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 680,
        height: 268,
        translate: '-50% -50%',
        transform: `perspective(1200px) rotateY(${rotY}deg) scaleX(${scaleX})`,
      }}
    >
      <Boil seed="kartu-pertanyaan" amp={0.4} rot={0.05}>
        <Paper lift={8}>
          <Slab
            x={0}
            y={0}
            w={680}
            h={268}
            color="#FAF4E8"
            shade="#E3D7C2"
            shadeH={0.08}
            r={16}
            grain={0.5}
          />
          {/* Strip lakban kertas di atas kartu */}
          <Slab x={265} y={-14} w={150} h={30} color={C.tape} rot={-1.5} r={3} />
          {/* Garis bingkai tipis dalam kartu */}
          <div
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: 10,
              border: `2px solid rgba(58, 56, 50, 0.18)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 36px',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'baseline',
                columnGap: 16,
                rowGap: 10,
              }}
            >
              {words.map((w, i) => {
                const op = interpolate(wordProgressFrame, [w.at, w.at + 8], [0, 1], CLAMP);
                const dy = interpolate(wordProgressFrame, [w.at, w.at + 8], [10, 0], CLAMP);
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 44,
                      color: w.text === 'gratis' ? C.tag : C.ink,
                      lineHeight: 1.15,
                      opacity: op,
                      transform: `translateY(${dy}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {w.text}
                  </span>
                );
              })}
              <span
                style={{
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 46,
                  color: ROOM.teal,
                  lineHeight: 1.15,
                  opacity: turunAppear,
                  transform: `translateY(${turunSink}px) rotate(${turunTilt}deg)`,
                  display: 'inline-block',
                }}
              >
                turun?
              </span>
            </div>
          </div>
        </Paper>
      </Boil>
    </div>
  );
};

// Kartu ringkas pertanyaan di pita atas pada Beat 3-5 (keadaan kumulatif tanpa menghalangi tengah panggung)
const KartuPertanyaanRingkas: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 690,
      top: 74,
      width: 680,
      height: 54,
      translate: '-50% -50%',
    }}
  >
    <Paper lift={4}>
      <Slab x={0} y={0} w={680} h={54} color="#FAF4E8" shade="#E3D7C2" shadeH={0.14} r={10} grain={0.45} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: 22,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        Apakah gratis otomatis membuat macet turun?
      </div>
    </Paper>
  </div>
);

// Papan domino kertas tanpa angka (hanya label teks yang diizinkan brief)
const PapanDomino: React.FC<{
  x: number;
  yBase: number;
  label: string;
  angle: number;
  accent: string;
  highlight?: number;
}> = ({x, yBase, label, angle, accent, highlight = 0}) => {
  const w = 186;
  const h = 282;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: yBase - h,
        width: w,
        height: h,
        transformOrigin: `${w}px ${h}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <Paper lift={7}>
        <Slab
          x={0}
          y={0}
          w={w}
          h={h}
          color="#F7F1E5"
          shade="#DFD3BE"
          shadeH={0.09}
          r={14}
          grain={0.55}
        />
        {/* Pita warna atas domino */}
        <Slab x={14} y={14} w={w - 28} h={16} color={accent} r={6} />
        {/* Garis pembagi tengah khas keping domino (polos tanpa titik angka) */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: h / 2,
            height: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(58, 56, 50, 0.25)',
          }}
        />
        {/* Bingkai aksen halus saat aktif */}
        {highlight > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              inset: 8,
              borderRadius: 10,
              border: `3px solid ${accent}`,
              opacity: highlight,
            }}
          />
        ) : null}
        {/* Label teks utama domino */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: 38,
            bottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: FONT.caption,
            fontWeight: 900,
            fontSize: 27,
            lineHeight: 1.2,
            color: C.ink,
          }}
        >
          {label}
        </div>
      </Paper>
    </div>
  );
};

// Tangan kertas berlapis yang menahan papan domino terakhir di udara (Beat 5)
const TanganKertasPenahan: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 240,
      height: 150,
      translate: '0 -50%',
    }}
  >
    <Boil seed="tangan-penahan" amp={0.4} rot={0.05}>
      <Paper lift={9}>
        {/* Lengan baju masuk dari sisi kanan panggung */}
        <Slab x={118} y={36} w={155} h={74} color={ROOM.teal} shade="#204040" shadeH={0.22} r={10} rot={-6} />
        {/* Manset kemeja kertas putih-krem */}
        <Slab x={98} y={40} w={28} h={68} color="#FAF4E8" shade="#DFD4BE" shadeH={0.2} r={5} rot={-6} />
        {/* Telapak tangan kertas */}
        <Slab x={34} y={44} w={74} h={62} color={C.cream} shade={C.creamLo} shadeH={0.2} r={18} rot={-8} />
        {/* Ibu jari menahan tepi atas */}
        <Slab x={16} y={24} w={48} h={22} color={C.cream} shade={C.creamLo} shadeH={0.25} r={11} rot={-28} />
        {/* Jari-jari menahan papan domino */}
        <Slab x={4} y={48} w={46} h={16} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} rot={-10} />
        <Slab x={2} y={66} w={48} h={16} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} rot={-6} />
        <Slab x={8} y={84} w={44} h={15} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} rot={-2} />
      </Paper>
    </Boil>
  </div>
);

// BEAT 1 (scene 015-016, 234 frame): Karcis "Gratis" + serpihan perayaan membeku pada "berhenti sebentar", lalu karcis bergeser ke samping
const Beat1: React.FC = () => {
  const f = useCurrentFrame();

  const curtainOpen = interpolate(f, [0, 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Pada "berhenti sebentar" (sekitar frame 58), serpihan kertas perayaan menggantung diam di udara
  const confettiTime = Math.min(f, 58);

  // Pada scene 016 (frame 132..204), karcis bergeser ke sisi kiri memberi ruang pertanyaan
  const ticketX = interpolate(f, [132, 204], [640, 255], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const ticketY = interpolate(f, [132, 204], [300, 286], CLAMP);
  const ticketScale = interpolate(f, [132, 204], [1.05, 0.84], CLAMP);
  const ticketRot = interpolate(f, [132, 204], [-2.5, -5.5], CLAMP);

  const confettiPieces = [
    {x: 420, y0: 250, vx: -1.1, vy: -1.6, r0: 14, vr: 1.8, w: 22, h: 12, c: C.amber},
    {x: 470, y0: 195, vx: -0.8, vy: -1.2, r0: -22, vr: -1.4, w: 18, h: 18, c: C.tag},
    {x: 530, y0: 170, vx: -0.4, vy: -1.4, r0: 32, vr: 1.2, w: 24, h: 11, c: C.sparkYellow},
    {x: 755, y0: 175, vx: 0.5, vy: -1.5, r0: -18, vr: -1.6, w: 22, h: 12, c: ROOM.teal},
    {x: 815, y0: 210, vx: 0.9, vy: -1.1, r0: 25, vr: 1.5, w: 18, h: 18, c: C.amber},
    {x: 865, y0: 265, vx: 1.2, vy: -1.3, r0: -30, vr: -1.3, w: 24, h: 12, c: C.tag},
    {x: 455, y0: 365, vx: -0.9, vy: -0.7, r0: 18, vr: 1.1, w: 20, h: 11, c: ROOM.sage},
    {x: 835, y0: 360, vx: 0.95, vy: -0.8, r0: -15, vr: -1.2, w: 20, h: 11, c: C.sparkYellow},
  ];

  const confettiFadeOnSlide = interpolate(f, [132, 185], [1, 0.25], CLAMP);

  return (
    <OrbitCamera dur={BEAT1_DUR} yaw={12} drift={[-18, 0]} push={1.08} focus={0.5} depth={650} origin={[640, 420]}>
      <PanggungHaltePagi curtainOpen={curtainOpen}>
        <JalurJalanMacet density={0.95} shiftX={interpolate(f, [0, BEAT1_DUR], [0, 14], CLAMP)} />

        {/* Serpihan kertas perayaan yang menggantung diam di udara setelah frame 58 */}
        {confettiPieces.map((p, i) => {
          const appear = interpolate(f, [6 + i * 2, 16 + i * 2], [0, 1], CLAMP);
          const px = p.x + p.vx * confettiTime;
          const py = p.y0 + p.vy * confettiTime + 0.014 * confettiTime * confettiTime;
          const pr = p.r0 + p.vr * confettiTime;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: p.w,
                height: p.h,
                backgroundColor: p.c,
                borderRadius: 2,
                rotate: `${pr}deg`,
                opacity: appear * confettiFadeOnSlide,
                boxShadow: '1px 3px 4px rgba(0,0,0,0.2)',
              }}
            />
          );
        })}

        <PopIn at={8}>
          <KarcisGratis x={ticketX} y={ticketY} scale={ticketScale} rot={ticketRot} />
        </PopIn>
      </PanggungHaltePagi>
    </OrbitCamera>
  );
};

// BEAT 2 (scene 017, 159 frame): Kartu besar membalik dari belakang karcis menampilkan pertanyaan inti
const Beat2: React.FC = () => {
  const f = useCurrentFrame();

  const flipProgress = interpolate(f, [6, 26], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <OrbitCamera dur={BEAT2_DUR} yaw={-10} drift={[16, -6]} push={1.07} focus={0.5} depth={650} origin={[640, 420]}>
      <PanggungHaltePagi>
        <JalurJalanMacet density={0.95} shiftX={14 + interpolate(f, [0, BEAT2_DUR], [0, 10], CLAMP)} />
        <KarcisGratis x={255} y={286} scale={0.84} rot={-5.5} />
        <KartuPertanyaan x={745} y={292} flipProgress={flipProgress} wordProgressFrame={f} />
      </PanggungHaltePagi>
    </OrbitCamera>
  );
};

// BEAT 3 (scene 018-019, 222 frame): Barisan siluet tanpa wajah mengangkat karcis "Gratis" yang sama, jalur jalan makin rapat
const Beat3: React.FC = () => {
  const f = useCurrentFrame();

  const density = interpolate(f, [15, 165], [0.68, 1], CLAMP);

  const crowd = [
    {x: 340, shirt: ROOM.slate, bag: C.wood, appearAt: 10, raiseAt: 26},
    {x: 490, shirt: ROOM.terracotta, bag: undefined, appearAt: 34, raiseAt: 50},
    {x: 640, shirt: ROOM.teal, bag: C.brassLo, appearAt: 58, raiseAt: 74},
    {x: 790, shirt: ROOM.mustard, bag: undefined, appearAt: 82, raiseAt: 98},
    {x: 940, shirt: ROOM.purple, bag: C.woodLo, appearAt: 106, raiseAt: 122},
  ];

  return (
    <OrbitCamera dur={BEAT3_DUR} yaw={14} drift={[-20, 0]} push={1.08} focus={0.5} depth={650} origin={[640, 420]}>
      <PanggungHaltePagi>
        <JalurJalanMacet density={density} shiftX={24 + interpolate(f, [0, BEAT3_DUR], [0, 16], CLAMP)} />

        {/* Karcis & kartu pertanyaan tetap hadir rapi di pita atas (keadaan kumulatif) */}
        <KarcisGratis x={185} y={76} scale={0.44} rot={-4} />
        <KartuPertanyaanRingkas />

        {/* Barisan siluet tanpa wajah di kaki panggung */}
        {crowd.map((person, i) => (
          <SlideIn key={i} at={person.appearAt} dy={28} dur={12}>
            <TokohTanpaWajah
              x={person.x}
              y={PLATFORM_Y}
              shirt={person.shirt}
              bagColor={person.bag}
              raiseAt={person.raiseAt}
              scale={0.96}
            />
          </SlideIn>
        ))}
      </PanggungHaltePagi>
    </OrbitCamera>
  );
};

// BEAT 4 (scene 020-022, 199 frame): Tiga papan domino berderet tumbang beruntun; pada "Macet pun selesai", jalur jalan tampil lengang sebagai bayangan putus-putus
const Beat4: React.FC = () => {
  const f = useCurrentFrame();

  // Domino 1 ("Gratiskan saja"): scene 020 (local 9..60)
  const d1Angle = interpolate(f, [18, 52], [0, 56], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const d1Hi = interpolate(f, [10, 22, 48, 60], [0, 1, 1, 0.25], CLAMP);

  // Domino 2 ("Semua orang pasti pindah"): scene 021 (local 75..140)
  const d2Angle = interpolate(f, [76, 114], [0, 56], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const d2Hi = interpolate(f, [72, 84, 110, 122], [0, 1, 1, 0.25], CLAMP);

  // Domino 3 ("Macet pun selesai"): scene 022 (local 157..187)
  const d3Angle = interpolate(f, [156, 184], [0, 24], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const d3Hi = interpolate(f, [152, 164], [0, 1], CLAMP);

  // Pada "Macet pun selesai" (local 157..188), mobil padat memudar dan digantikan bayangan putus-putus khayalan
  const roadDensity = interpolate(f, [156, 178], [1, 0], CLAMP);
  const ghostOpacity = interpolate(f, [160, 180], [0, 0.45], CLAMP);

  return (
    <OrbitCamera dur={BEAT4_DUR} yaw={-14} drift={[22, 0]} push={1.09} focus={0.5} depth={650} origin={[640, 420]}>
      <PanggungHaltePagi>
        <JalurJalanMacet density={roadDensity} ghostOpacity={ghostOpacity} shiftX={40} />

        {/* Elemen kumulatif di pita atas & siluet penonton di sisi kiri */}
        <KarcisGratis x={185} y={76} scale={0.44} rot={-4} />
        <KartuPertanyaanRingkas />

        <TokohTanpaWajah x={165} y={PLATFORM_Y} shirt={ROOM.slate} bagColor={C.wood} held scale={0.9} />
        <TokohTanpaWajah x={245} y={PLATFORM_Y} shirt={ROOM.terracotta} held scale={0.9} />

        {/* Tiga papan domino kertas berderet */}
        <PopIn at={4}>
          <PapanDomino
            x={450}
            yBase={PLATFORM_Y}
            label="Gratiskan saja"
            angle={d1Angle}
            accent={C.tag}
            highlight={d1Hi}
          />
        </PopIn>
        <PopIn at={10}>
          <PapanDomino
            x={690}
            yBase={PLATFORM_Y}
            label="Semua orang pasti pindah"
            angle={d2Angle}
            accent={ROOM.teal}
            highlight={d2Hi}
          />
        </PopIn>
        <PopIn at={16}>
          <PapanDomino
            x={930}
            yBase={PLATFORM_Y}
            label="Macet pun selesai"
            angle={d3Angle}
            accent={C.amber}
            highlight={d3Hi}
          />
        </PopIn>
      </PanggungHaltePagi>
    </OrbitCamera>
  );
};

// BEAT 5 (scene 023-024, 168 frame): Tangan kertas menahan papan domino terakhir di udara; bayangan lengang memudar dan mobil kembali memenuhi jalur
const Beat5: React.FC = () => {
  const f = useCurrentFrame();

  // Scene 023 (local 12..45): "Kedengarannya masuk akal" -> domino 3 miring sedikit lebih jauh lalu direm
  // Scene 024 (local 66..168): "Terlalu masuk akal, justru di situlah kita harus berhenti dan berpikir"
  const d3Angle = interpolate(f, [0, 62, 92, 108], [24, 31, 31, 27], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Tangan kertas masuk menahan papan domino terakhir (local 72..104), lalu tenang diam
  const handX = interpolate(f, [72, 104], [1320, 1098], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Bayangan jalur lengang memudar dan mobil-mobil kertas kembali memenuhi jalur (local 82..120)
  const ghostOpacity = interpolate(f, [80, 108], [0.45, 0], CLAMP);
  const roadDensity = interpolate(f, [84, 122], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gorden tepi menutup halus sedikit di bingkai luar saat pose akhir tenang
  const curtainClose = interpolate(f, [122, 152], [0, 0.35], CLAMP);

  return (
    <OrbitCamera dur={BEAT5_DUR} yaw={10} drift={[-14, 0]} push={1.06} focus={0.5} depth={650} origin={[640, 420]}>
      <PanggungHaltePagi curtainClose={curtainClose}>
        <JalurJalanMacet density={roadDensity} ghostOpacity={ghostOpacity} shiftX={40} />

        {/* Elemen kumulatif */}
        <KarcisGratis x={185} y={76} scale={0.44} rot={-4} />
        <KartuPertanyaanRingkas />

        <TokohTanpaWajah x={165} y={PLATFORM_Y} shirt={ROOM.slate} bagColor={C.wood} held scale={0.9} />
        <TokohTanpaWajah x={245} y={PLATFORM_Y} shirt={ROOM.terracotta} held scale={0.9} />

        {/* Rantai domino: dua papan pertama sudah rebah, papan ketiga tertahan miring di udara */}
        <PapanDomino x={450} yBase={PLATFORM_Y} label="Gratiskan saja" angle={56} accent={C.tag} highlight={0.2} />
        <PapanDomino
          x={690}
          yBase={PLATFORM_Y}
          label="Semua orang pasti pindah"
          angle={56}
          accent={ROOM.teal}
          highlight={0.2}
        />
        <PapanDomino
          x={930}
          yBase={PLATFORM_Y}
          label="Macet pun selesai"
          angle={d3Angle}
          accent={C.amber}
          highlight={1}
        />

        {/* Tangan kertas penahan papan domino terakhir */}
        <TanganKertasPenahan x={handX} y={358} />
      </PanggungHaltePagi>
    </OrbitCamera>
  );
};

const SCENES: CutScene[] = [
  {id: 'beat1', component: Beat1, durationInFrames: BEAT1_DUR},
  {id: 'beat2', component: Beat2, durationInFrames: BEAT2_DUR},
  {id: 'beat3', component: Beat3, durationInFrames: BEAT3_DUR},
  {id: 'beat4', component: Beat4, durationInFrames: BEAT4_DUR},
  {id: 'beat5', component: Beat5, durationInFrames: BEAT5_DUR},
];

const CUTS: Record<string, CutSpec> = {
  beat2: {kind: 'pageTurn', style: 'curl', align: 'mid', frames: 12},
  beat3: {kind: 'tapePull', y: 120, align: 'mid', frames: 10},
  beat4: {kind: 'whip', blur: 24, align: 'mid', frames: 7},
  beat5: {kind: 'zoomThrough', x: 930, y: 410, scale: 1.07, align: 'mid', frames: 8},
};

export const T01: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.creamHi}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25}>
      <CutSeries scenes={SCENES} cuts={CUTS} />
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);