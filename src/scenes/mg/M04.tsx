// M04 (Scene 028-033, 93,79-117,91 dtk, 723 frame): jalur dapur kertas dan perpindahan biaya ke bangunan negara.
// Struk berpindah dari dompet anak ke gedung negara hingga mencetak 268 triliun rupiah dan label harga pertama.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerUnderline} from '../../lib/paper/proof';

export const M04_DUR = 723;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const CanteenBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-80} w={1520} h={880} color="#D8D2C7" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 36% 32%, rgba(255,248,232,0.28) 0%, rgba(255,255,255,0) 56%, rgba(0,0,0,0.24) 100%)',
      }}
    />
    <Slab x={-120} y={316} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={332} w={1520} h={240} color="#C4BEB2" r={0} grain={0.55} />
    <Window x={36} y={48} w={192} h={236} night={false} />
    <Corkboard x={472} y={56} w={216} h={138} />
    <Sticky x={498} y={84} s={34} color="#E6D7A8" rot={-3} />
    <Sticky x={550} y={90} s={32} color="#D8DFD5" rot={2} />
    <Sticky x={604} y={82} s={34} color="#E6D7A8" rot={-1} />
    <Shelf x={470} y={272} w={220} books={3} />
    <Plant x={256} y={274} s={0.52} />
  </AbsoluteFill>
);

const KitchenConveyorTrack: React.FC = () => {
  const f = useCurrentFrame();

  // Sorotan aktif tiap stasiun saat kotak makan melintas
  const s1Pulse = interpolate(f, [18, 32, 48], [0, 1, 0], CLAMP);
  const s2Pulse = interpolate(f, [54, 68, 84], [0, 1, 0], CLAMP);
  const s3Pulse = interpolate(f, [90, 104, 120], [0, 1, 0], CLAMP);

  // Gerak kotak makan di rel kertas melewati 3 stasiun (beli -> masak -> antar)
  const boxX = interpolate(
    f,
    [8, 26, 44, 62, 80, 98, 116, 134],
    [106, 176, 176, 362, 362, 548, 548, 656],
    {
      ...CLAMP,
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const boxBounce =
    Math.sin(s1Pulse * Math.PI) * -6 +
    Math.sin(s2Pulse * Math.PI) * -6 +
    Math.sin(s3Pulse * Math.PI) * -6;

  // Roda rel berputar saat kotak makan melaju
  const wheelAngle = interpolate(f, [8, 134], [0, 540], CLAMP);

  const railX = 84;
  const railY = 486;
  const railW = 594;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Stasiun 1: Bahan dibeli (peti sayuran & bahan pokok kertas) */}
      <PopIn at={4} origin="50% 100%">
        <div
          style={{
            position: 'absolute',
            left: 176,
            top: 468,
            width: 126,
            height: 112,
            translate: '-50% -100%',
            transform: `scale(${1 + s1Pulse * 0.06})`,
          }}
        >
          <Paper lift={6}>
            {/* Daun sayuran & wortel kertas di dalam peti */}
            <Slab x={24} y={14} w={30} h={42} color="#5F8A56" r="50% 50% 20% 20%" rot={-14} />
            <Slab x={48} y={10} w={32} h={46} color="#769E6B" r="50% 50% 20% 20%" rot={8} />
            <Slab x={74} y={20} w={26} h={38} color="#D97338" shade="#B35724" shadeH={0.3} r="40% 40% 50% 50%" rot={16} />
            {/* Peti bahan kayu kertas */}
            <Slab x={12} y={44} w={102} h={58} color={C.woodHi} shade={C.woodLo} shadeH={0.28} r={6} grain={0.5} />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 64,
                width: 90,
                height: 4,
                backgroundColor: C.woodLo,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 82,
                width: 90,
                height: 4,
                backgroundColor: C.woodLo,
                opacity: 0.7,
              }}
            />
          </Paper>
        </div>
      </PopIn>

      {/* Stasiun 2: Dimasak (kompor kertas & panci mengepul) */}
      <PopIn at={10} origin="50% 100%">
        <div
          style={{
            position: 'absolute',
            left: 362,
            top: 468,
            width: 132,
            height: 128,
            translate: '-50% -100%',
            transform: `scale(${1 + s2Pulse * 0.06})`,
          }}
        >
          <Paper lift={6}>
            {/* Uap potongan kertas di atas panci */}
            <Slab
              x={44}
              y={4 - s2Pulse * 6}
              w={12}
              h={24}
              color={C.creamHi}
              r={8}
              rot={-8}
            />
            <Slab
              x={72}
              y={0 - s2Pulse * 8}
              w={12}
              h={26}
              color={C.creamHi}
              r={8}
              rot={9}
            />
            {/* Tutup & badan panci */}
            <Slab x={30} y={32} w={72} h={10} color={C.metal} shade={C.metalLo} shadeH={0.35} r={5} />
            <Slab x={56} y={24} w={20} h={10} color={C.inkSoft} r={4} />
            <Slab x={26} y={40} w={80} h={34} color={C.metalLo} shade="#6C7578" shadeH={0.3} r="4px 4px 12px 12px" />
            {/* Tungku kompor kertas */}
            <Slab x={14} y={74} w={104} h={46} color="#4A4E52" shade="#34373A" shadeH={0.28} r={6} />
            <div
              style={{
                position: 'absolute',
                left: 28,
                top: 88,
                width: 76,
                height: 18,
                borderRadius: 4,
                backgroundColor: s2Pulse > 0.1 ? C.amber : '#2C2F33',
              }}
            />
          </Paper>
        </div>
      </PopIn>

      {/* Stasiun 3: Diantar (meja pass-through dapur & bingkisan antar) */}
      <PopIn at={16} origin="50% 100%">
        <div
          style={{
            position: 'absolute',
            left: 548,
            top: 468,
            width: 128,
            height: 118,
            translate: '-50% -100%',
            transform: `scale(${1 + s3Pulse * 0.06})`,
          }}
        >
          <Paper lift={6}>
            {/* Bingkai loket pass-through dapur */}
            <Slab x={16} y={14} w={96} h={84} color={C.creamLo} shade="#A39584" shadeH={0.14} r={8} />
            <Slab x={26} y={24} w={76} h={64} color="#5D7896" r={4} />
            {/* Tudung kanopi kecil bergaris kertas */}
            <Slab x={10} y={8} w={108} h={22} color={C.tag} shade="#9E3F29" shadeH={0.32} r="8px 8px 3px 3px" />
            {/* Meja langkan antar */}
            <Slab x={8} y={96} w={112} h={16} color={C.wood} shade={C.woodLo} shadeH={0.4} r={4} />
          </Paper>
        </div>
      </PopIn>

      {/* Rel konveyor kertas dari kiri ke kanan */}
      <Paper lift={8}>
        {/* Kaki penyangga rel */}
        {[120, 362, 626].map((legX, idx) => (
          <Slab
            key={idx}
            x={legX - 10}
            y={railY + 26}
            w={20}
            h={54}
            color={C.inkSoft}
            shade={C.ink}
            shadeH={0.3}
            r={4}
          />
        ))}
        {/* Batang rel utama */}
        <Slab
          x={railX}
          y={railY}
          w={railW}
          h={28}
          color={C.metalLo}
          shade="#6B7477"
          shadeH={0.28}
          hi="#CFD6D8"
          hiH={0.14}
          r={14}
        />
      </Paper>

      {/* Roda-roda kecil di sepanjang rel */}
      {Array.from({length: 10}, (_, i) => {
        const wx = railX + 26 + i * 60;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: wx,
              top: railY + 14,
              width: 16,
              height: 16,
              translate: '-50% -50%',
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              border: `2px solid ${C.inkSoft}`,
              transform: `rotate(${wheelAngle}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 1,
                width: 2,
                height: 12,
                backgroundColor: C.inkSoft,
              }}
            />
          </div>
        );
      })}

      {/* Kotak makan kertas meluncur di atas rel */}
      <div
        style={{
          position: 'absolute',
          left: boxX,
          top: railY - 2 + boxBounce,
          width: 78,
          height: 44,
          translate: '-50% -100%',
          filter: 'drop-shadow(2px 4px 5px rgba(0,0,0,0.3))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: C.creamHi,
            borderRadius: 8,
            borderBottom: `6px solid ${C.creamLo}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6,
            right: 6,
            top: 14,
            height: 3,
            backgroundColor: C.inkSoft,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 0,
            width: 18,
            height: 44,
            backgroundColor: C.sage,
          }}
        />
      </div>
    </div>
  );
};

const ChildWithClosedWallet: React.FC = () => {
  const f = useCurrentFrame();
  // Anggukan tipis figur anak saat menerima kotak makan di ujung jalur
  const nod = interpolate(f, [132, 146, 162], [0, 3.5, 0], CLAMP);

  return (
    <PopIn at={14} origin="50% 100%">
      <Boil seed="m04-child" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 734,
            top: 562,
            width: 96,
            height: 184,
            translate: '-50% -100%',
            filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.3))',
          }}
        >
          {/* Tas sekolah di punggung */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 66,
              width: 28,
              height: 62,
              backgroundColor: C.wood,
              borderRadius: 8,
            }}
          />
          {/* Kepala kertas polos tanpa wajah */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 48,
              height: 48,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.creamHi,
              border: `3px solid ${C.inkSoft}`,
              rotate: `${-nod}deg`,
            }}
          />
          {/* Badan kemeja siswa */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 54,
              width: 56,
              height: 82,
              translate: '-50% 0',
              backgroundColor: '#5D7896',
              borderRadius: '11px 11px 5px 5px',
            }}
          />
          {/* Kaki berdiri tegak */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 136,
              width: 20,
              height: 48,
              backgroundColor: C.inkSoft,
              borderRadius: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 136,
              width: 20,
              height: 48,
              backgroundColor: C.inkSoft,
              borderRadius: 5,
            }}
          />
          {/* Lengan memegang dompet tertutup */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 72,
              width: 34,
              height: 14,
              backgroundColor: '#4A627D',
              borderRadius: 7,
              rotate: '-14deg',
            }}
          />
          {/* Dompet kertas yang tidak pernah dibuka */}
          <div
            style={{
              position: 'absolute',
              left: -6,
              top: 68,
              width: 38,
              height: 28,
              backgroundColor: C.woodLo,
              border: `2px solid ${C.ink}`,
              borderRadius: 5,
              boxShadow: '1px 3px 5px rgba(0,0,0,0.32)',
            }}
          >
            {/* Sabuk pengunci dompet tetap tertutup rapat */}
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: -2,
                width: 12,
                height: 18,
                backgroundColor: C.brass,
                borderRadius: '0 0 5px 5px',
              }}
            />
          </div>
        </div>
      </Boil>
    </PopIn>
  );
};

const TransferringReceiptStrip: React.FC = () => {
  const f = useCurrentFrame();

  // Struk muncul tergantung di dompet anak (f=95..145), lalu ditarik perlahan ke bangunan negara (f=145..248)
  const hangU = interpolate(f, [95, 118], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const moveU = interpolate(f, [145, 248], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const enterDoorU = interpolate(f, [238, 265], [1, 0], CLAMP);

  if (hangU <= 0.001 || enterDoorU <= 0.001) return null;

  const stripX = interpolate(moveU, [0, 1], [708, 1020], CLAMP);
  const stripY =
    interpolate(moveU, [0, 0.5, 1], [472, 392, 412], CLAMP) + (1 - hangU) * -14;
  const stripRot = interpolate(moveU, [0, 0.45, 1], [-4, 18, 4], CLAMP);
  const stripScale = interpolate(moveU, [0, 0.5, 1], [0.85, 1.05, 0.72], CLAMP) * enterDoorU;

  return (
    <div
      style={{
        position: 'absolute',
        left: stripX,
        top: stripY,
        width: 46,
        height: 108 * hangU,
        translate: '-50% 0',
        transformOrigin: '50% 0%',
        transform: `rotate(${stripRot}deg) scale(${stripScale})`,
        opacity: hangU * enterDoorU,
        filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#F6F1E7',
          borderTop: `4px solid ${C.creamLo}`,
          borderBottom: `4px dashed ${C.inkSoft}`,
        }}
      >
        {/* Coretan garis struk abstrak tanpa angka */}
        {[18, 34, 50, 66, 82].map((ly, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 8,
              top: ly,
              width: idx % 2 === 0 ? 28 : 20,
              height: 3,
              backgroundColor: C.inkSoft,
              opacity: 0.32,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const OpportunityCostBlocks: React.FC = () => {
  const f = useCurrentFrame();

  // Balok kosong tanpa label bergeser tipis di belakang bangunan negara pada:
  // 1) "dari uang yang bisa dipakai untuk hal lain" (f=280..338)
  // 2) "kalau tidak dipakai di sini, bisa dipakai untuk hal lain" (f=545..635)
  const shift1 = interpolate(f, [280, 310, 338], [0, 1, 0.35], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const shift2 = interpolate(f, [545, 588, 635], [0, 1, 0.45], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pulse = shift1 * 14 + shift2 * 16;

  const blocks = [
    {x: 842 - pulse * 0.9, y: 176 - pulse * 0.4, w: 86, h: 128, color: '#C6BEB0', shade: '#A79E8F', rot: -2},
    {x: 1152 + pulse * 0.9, y: 164 - pulse * 0.5, w: 92, h: 142, color: '#BCB4A6', shade: '#9D9485', rot: 2},
    {x: 826 - pulse * 1.1, y: 314 + pulse * 0.3, w: 78, h: 112, color: '#CFC8BA', shade: '#AFA798', rot: -1},
    {x: 1172 + pulse * 1.0, y: 316 + pulse * 0.3, w: 82, h: 118, color: '#C8C0B2', shade: '#A89F90', rot: 1.5},
  ];

  return (
    <PopIn at={195} origin="50% 100%">
      <div style={{position: 'absolute', inset: 0}}>
        {blocks.map((b, i) => (
          <Paper key={i} lift={4}>
            <Slab
              x={b.x}
              y={b.y}
              w={b.w}
              h={b.h}
              color={b.color}
              shade={b.shade}
              shadeH={0.14}
              r={8}
              rot={b.rot}
              grain={0.5}
            />
          </Paper>
        ))}
      </div>
    </PopIn>
  );
};

const StateBuildingAndBudgetScroll: React.FC = () => {
  const f = useCurrentFrame();

  // Pintu bangunan negara terbuka lebar saat struk berpindah (f=196..228)
  const doorOpenU = interpolate(f, [196, 228], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gulungan struk dicetak dari bangunan negara sampai "268 triliun rupiah" terbentuk (f=365..475)
  const scrollUnrollU = interpolate(f, [365, 445], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const textPopU = interpolate(f, [405, 458], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.3)),
  });

  // Label kecil "harga pertama" ditarik keluar dari balik struk pada kalimat penutup (f=665..690)
  const firstPricePullU = interpolate(f, [665, 690], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  const bx = 1030;
  const by = 562;
  const bw = 286;
  const bh = 310;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Bangunan negara dari kertas */}
      <PopIn at={184} origin="50% 100%">
        <Boil seed="m04-state-bldg" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: bx,
              top: by,
              width: bw,
              height: bh,
              translate: '-50% -100%',
            }}
          >
            <Paper lift={10}>
              {/* Atap pedimen segitiga klasik */}
              <div
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 0,
                  width: bw - 12,
                  height: 68,
                  backgroundColor: C.creamHi,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.22))',
                }}
              />
              {/* Lingkaran lambang kertas polos di pedimen */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 26,
                  width: 28,
                  height: 28,
                  translate: '-50% 0',
                  borderRadius: '50%',
                  backgroundColor: C.brass,
                  border: `2px solid ${C.brassLo}`,
                }}
              />

              {/* Balok entablature di bawah pedimen */}
              <Slab
                x={14}
                y={66}
                w={bw - 28}
                h={24}
                color={C.cream}
                shade={C.creamLo}
                shadeH={0.35}
                r={3}
              />

              {/* Dinding utama gedung */}
              <Slab
                x={24}
                y={90}
                w={bw - 48}
                h={186}
                color={C.creamLo}
                shade="#A39584"
                shadeH={0.12}
                r={2}
                grain={0.5}
              />

              {/* 4 pilar kertas di fasad */}
              {[34, 82, 184, 232].map((px, i) => (
                <Slab
                  key={i}
                  x={px}
                  y={90}
                  w={20}
                  h={186}
                  color={C.creamHi}
                  shade={C.creamLo}
                  shadeH={0.22}
                  r={3}
                />
              ))}

              {/* Ruang dalam pintu terbuka (hangat terang) */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 138,
                  width: 82,
                  height: 138,
                  translate: '-50% 0',
                  backgroundColor: '#F2DC9B',
                  boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.28)',
                }}
              />

              {/* Daun pintu kiri membuka lebar */}
              <div
                style={{
                  position: 'absolute',
                  left: bw / 2 - 41,
                  top: 138,
                  width: 41,
                  height: 138,
                  backgroundColor: C.wood,
                  borderRight: `2px solid ${C.woodLo}`,
                  transformOrigin: '0% 50%',
                  transform: `scaleX(${1 - doorOpenU * 0.82}) skewY(${-doorOpenU * 8}deg)`,
                }}
              />

              {/* Daun pintu kanan membuka lebar */}
              <div
                style={{
                  position: 'absolute',
                  left: bw / 2,
                  top: 138,
                  width: 41,
                  height: 138,
                  backgroundColor: C.wood,
                  borderLeft: `2px solid ${C.woodLo}`,
                  transformOrigin: '100% 50%',
                  transform: `scaleX(${1 - doorOpenU * 0.82}) skewY(${doorOpenU * 8}deg)`,
                }}
              />

              {/* Tiga anak tangga bawah bangunan */}
              <Slab x={18} y={276} w={bw - 36} h={12} color={C.cream} shade={C.creamLo} shadeH={0.4} r={2} />
              <Slab x={10} y={288} w={bw - 20} h={12} color={C.creamHi} shade={C.creamLo} shadeH={0.4} r={2} />
              <Slab x={2} y={300} w={bw - 4} h={12} color={C.cream} shade={C.creamLo} shadeH={0.4} r={2} />
            </Paper>
          </div>
        </Boil>
      </PopIn>

      {/* Gulungan struk anggaran + angka potongan huruf besar "268 triliun rupiah" */}
      {scrollUnrollU > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 1024,
            top: 344,
            width: 346,
            height: 204 * scrollUnrollU,
            translate: '-50% 0',
          }}
        >
          {/* Label kecil "harga pertama" tersembunyi di balik struk, ditarik keluar di akhir */}
          {firstPricePullU > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 164 + firstPricePullU * 52,
                translate: '-50% 0',
                rotate: '-2deg',
                opacity: interpolate(firstPricePullU, [0, 0.25], [0, 1], CLAMP),
                backgroundColor: C.ink,
                color: '#F3EEE6',
                borderLeft: `6px solid ${C.amber}`,
                padding: '10px 22px 12px',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 25,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.38))',
              }}
            >
              harga pertama
            </div>
          ) : null}

          {/* Lembar struk kertas berlapis di depan */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#F7F2E8',
              borderTop: `6px solid ${C.inkSoft}`,
              borderBottom: `4px dashed ${C.inkSoft}`,
              boxShadow: '0 10px 22px rgba(0,0,0,0.32)',
              overflow: 'hidden',
            }}
          >
            {/* Coretan baris struk dekoratif di bagian atas tanpa angka */}
            <div
              style={{
                position: 'absolute',
                left: 22,
                top: 16,
                width: 148,
                height: 4,
                backgroundColor: C.inkSoft,
                opacity: 0.22,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 22,
                top: 16,
                width: 72,
                height: 4,
                backgroundColor: C.inkSoft,
                opacity: 0.22,
                borderRadius: 2,
              }}
            />

            {/* Angka & satuan potongan kertas besar: 268 triliun rupiah */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 32,
                translate: '-50% 0',
                transform: `scale(${0.75 + textPopU * 0.25})`,
                opacity: textPopU,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Boil seed="m04-budget-num" amp={0.4} rot={0.05}>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: C.creamHi,
                    padding: '6px 22px 8px',
                    rotate: '-1deg',
                    fontFamily: FONT.banner,
                    fontSize: 64,
                    lineHeight: 1,
                    color: C.tag,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    filter: 'url(#torn) drop-shadow(2px 4px 6px rgba(0,0,0,0.24))',
                  }}
                >
                  268
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: FONT.caption,
                    fontWeight: 900,
                    fontSize: 31,
                    lineHeight: 1.05,
                    color: C.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  triliun rupiah
                </div>
              </Boil>
            </div>
          </div>

          <MarkerUnderline
            x={46}
            y={184}
            w={254}
            at={465}
            dur={14}
            color={C.tag}
            width={5}
            seed="m04-budget-line"
          />
        </div>
      ) : null}
    </div>
  );
};

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M04_DUR - 10, M04_DUR], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const fold = Math.max(openU, closeU);

  if (fold <= 0.001) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.cream,
          transformOrigin: '0% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.creamLo,
          transformOrigin: '100% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '-10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
    </AbsoluteFill>
  );
};

export const M04: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#D8D2C7'}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25} seed="m04-weave">
      <OrbitCamera
        dur={M04_DUR}
        yaw={15}
        drift={[-34, -6]}
        push={1.08}
        focus={0.5}
        depth={760}
        origin={[640, 420]}
      >
        <Depth z={0} cover>
          <CanteenBackdrop />
        </Depth>

        <Depth z={0.3}>
          <OpportunityCostBlocks />
        </Depth>

        <Depth z={0.5}>
          {/* Lantai meja diorama kertas */}
          <Slab x={-140} y={554} w={1560} h={220} color="#EAE3D7" r={0} grain={0.5} />
          <Slab
            x={-140}
            y={548}
            w={1560}
            h={16}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.4}
            r={0}
          />
          <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

          {/* Jalur kerja dapur kertas dari kiri ke kanan */}
          <KitchenConveyorTrack />

          {/* Figur anak tanpa wajah dengan dompet tertutup */}
          <ChildWithClosedWallet />

          {/* Struk panjang yang berpindah dari dompet anak ke bangunan negara */}
          <TransferringReceiptStrip />

          {/* Bangunan negara kertas, gulungan struk 268 triliun rupiah, & label harga pertama */}
          <StateBuildingAndBudgetScroll />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>

    <PaperFoldEdge />
    <GrainOverlay />
  </AbsoluteFill>
);