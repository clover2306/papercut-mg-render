// Adegan MG-03 Berkas Menara: map putusan pengadilan terbuka memperlihatkan menara sinyal dan desa gelap, dihantam cap audit, lalu koin mengalir keluar menuju angka kerugian 8,03 triliun rupiah.
// Gaya papercut Dunia Bocor dengan stop-motion tenang, tanpa wajah, tanpa lambang instansi, dan angka kerugian berwarna cokelat terakota.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, Pill, PopIn, Slab, Stage} from './mgkit';
import {C, FONT} from '../../lib/tokens';
import {Disc} from '../../lib/paper/kit';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {Plant, Shelf, Window} from '../../lib/paper/sets';

export const PB03_DUR = 389;
export const DUR = PB03_DUR;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const stepFrame = (f: number, step = 3) => Math.floor(f / step) * step;

// Menara sinyal kertas kecil berstruktur rangka (tanpa ikon sinyal atau angka)
const MenaraKertas: React.FC<{
  x: number;
  baseY: number;
  h: number;
  growAt: number;
}> = ({x, baseY, h, growAt}) => {
  const f = useCurrentFrame();
  const u = interpolate(stepFrame(f, 2), [growAt, growAt + 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const curH = Math.round(h * u);
  if (curH <= 2) return null;

  const baseW = 44;
  const topW = 12;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY - curH,
        width: baseW,
        height: curH,
        translate: '-50% 0',
        filter: 'drop-shadow(2px 4px 5px rgba(0,0,0,0.34))',
      }}
    >
      {/* Badan menara trapesium kertas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#5D564E',
          clipPath: `polygon(${(baseW - topW) / 2}px 0%, ${(baseW + topW) / 2}px 0%, 100% 100%, 0% 100%)`,
        }}
      />
      {/* Sisi terang kiri menara */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#8A7F72',
          clipPath: `polygon(${(baseW - topW) / 2}px 0%, 50% 0%, 50% 100%, 0% 100%)`,
        }}
      />
      {/* Palang melintang rangka menara */}
      {[0.28, 0.56, 0.82].map((ratio, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            top: `${ratio * 100}%`,
            height: 4,
            backgroundColor: '#2E221A',
            opacity: 0.78,
          }}
        />
      ))}
      {/* Ujung pemancar bulat polos di puncak */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -7,
          width: 14,
          height: 14,
          translate: '-50% 0',
          borderRadius: '50%',
          backgroundColor: '#B8893A',
          border: '2px solid #2E221A',
        }}
      />
    </div>
  );
};

// Rumah desa kecil dengan jendela gelap (belum menyala)
const RumahDesaGelap: React.FC<{
  x: number;
  baseY: number;
  w: number;
  h: number;
  roofColor: string;
  growAt: number;
}> = ({x, baseY, w, h, roofColor, growAt}) => {
  const f = useCurrentFrame();
  const u = interpolate(stepFrame(f, 2), [growAt, growAt + 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  if (u <= 0.02) return null;

  const roofH = Math.round(h * 0.46);
  const bodyH = h - roofH;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: baseY,
        width: w,
        height: h,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scaleY(${u})`,
        filter: 'drop-shadow(2px 4px 5px rgba(0,0,0,0.34))',
      }}
    >
      {/* Atap pelana kertas */}
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: 0,
          width: w + 10,
          height: roofH,
          backgroundColor: roofColor,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
      {/* Dinding rumah kusam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: roofH - 1,
          width: w,
          height: bodyH + 1,
          backgroundColor: '#CBB894',
          border: `2px solid ${C.inkSoft}`,
          borderRadius: '0 0 3px 3px',
        }}
      />
      {/* Jendela gelap (sinyal belum sampai) */}
      <div
        style={{
          position: 'absolute',
          left: Math.round(w * 0.2),
          top: roofH + Math.round(bodyH * 0.24),
          width: Math.round(w * 0.24),
          height: Math.round(bodyH * 0.34),
          backgroundColor: '#1E1813',
          border: '1px solid #3A3832',
        }}
      />
      {/* Pintu gelap */}
      <div
        style={{
          position: 'absolute',
          right: Math.round(w * 0.18),
          bottom: 0,
          width: Math.round(w * 0.24),
          height: Math.round(bodyH * 0.56),
          backgroundColor: '#2E221A',
          borderRadius: '2px 2px 0 0',
        }}
      />
    </div>
  );
};

// Stempel kertas kayu yang menghantam map saat "audit Badan Pengawasan Keuangan dan Pembangunan"
const StempelAudit: React.FC = () => {
  const f = useCurrentFrame();

  // Turun menghantam di frame 204, lalu terangkat keluar frame 222..242
  const enterOpacity = interpolate(f, [190, 196, 232, 242], [0, 1, 1, 0], CLAMP);
  const stampY =
    f < 204
      ? interpolate(f, [192, 204], [-170, 152], {...CLAMP, easing: Easing.in(Easing.cubic)})
      : f < 214
        ? interpolate(f, [204, 208, 214], [152, 158, 152], CLAMP)
        : interpolate(f, [216, 242], [152, -190], {...CLAMP, easing: Easing.in(Easing.cubic)});

  const squashX = interpolate(f, [203, 206, 212], [1, 1.08, 1], CLAMP);
  const squashY = interpolate(f, [203, 206, 212], [1, 0.88, 1], CLAMP);

  if (enterOpacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: stampY,
        width: 240,
        height: 150,
        translate: '-50% -100%',
        transformOrigin: '50% 100%',
        transform: `scale(${squashX}, ${squashY})`,
        opacity: enterOpacity,
        pointerEvents: 'none',
        filter: 'drop-shadow(3px 8px 12px rgba(0,0,0,0.45))',
      }}
    >
      {/* Pegangan kayu bundar stempel */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 48,
          height: 54,
          translate: '-50% 0',
          borderRadius: '24px 24px 14px 14px',
          backgroundColor: C.woodHi,
          border: `2px solid ${C.woodLo}`,
        }}
      />
      {/* Leher pegangan */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 48,
          width: 26,
          height: 36,
          translate: '-50% 0',
          backgroundColor: C.wood,
        }}
      />
      {/* Balok kayu stempel */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 82,
          width: 220,
          height: 44,
          borderRadius: 6,
          backgroundColor: C.woodLo,
          border: `2px solid ${C.ink}`,
        }}
      />
      {/* Bantalan karet stempel di bagian bawah */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 126,
          width: 204,
          height: 16,
          borderRadius: '0 0 4px 4px',
          backgroundColor: '#5C3024',
        }}
      />
    </div>
  );
};

// Koin kusam kertas yang mengalir keluar lewat lubang di dasar map menuju papan kerugian
const AliranKoinBocor: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 284) return null;

  const holeProgress = interpolate(f, [284, 294], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // 14 koin mengalir berurutan dari lubang map (x=482, y=462) ke tumpukan bocor di lantai (x=482, y=584)
  const coinCount = 14;
  const streamStart = 288;
  const interval = 5;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Lubang sobek di dasar map */}
      <div
        style={{
          position: 'absolute',
          left: 482,
          top: 462,
          width: Math.round(126 * holeProgress),
          height: 22,
          translate: '-50% -50%',
          backgroundColor: '#1B140F',
          borderRadius: '50%',
          border: '3px solid #9E8B6B',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.9)',
          filter: 'url(#torn)',
        }}
      />

      {/* Koin-koin kusam yang jatuh dan menumpuk di bawah lubang map */}
      {Array.from({length: coinCount}).map((_, idx) => {
        const startF = streamStart + idx * interval;
        const dropDur = 20;
        const u = interpolate(f, [startF, startF + dropDur], [0, 1], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        });
        if (f < startF) return null;

        // Posisi mendarat membentuk tumpukan kecil di lantai panggung
        const col = (idx % 3) - 1;
        const row = Math.floor(idx / 3);
        const landX = 482 + col * 34 + ((idx % 2) * 6 - 3);
        const landY = FLOOR_Y - 12 - row * 12;

        const curX = interpolate(u, [0, 1], [482 + ((idx % 3) - 1) * 14, landX], CLAMP);
        const curY = interpolate(u, [0, 1], [464, landY], CLAMP);
        const rot = interpolate(u, [0, 1], [(idx % 2 === 0 ? -1 : 1) * 24, ((idx * 17) % 14) - 7], CLAMP);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: curX,
              top: curY,
              width: 30,
              height: 30,
              translate: '-50% -50%',
              transform: `rotate(${rot}deg)`,
              borderRadius: '50%',
              backgroundColor: '#B8893A',
              border: '3px solid #7A5821',
              boxShadow: '1px 3px 5px rgba(0,0,0,0.42)',
            }}
          >
            {/* Cincin timbul di tengah koin */}
            <div
              style={{
                position: 'absolute',
                inset: 6,
                borderRadius: '50%',
                border: '2px solid #7A5821',
                backgroundColor: '#C99B4A',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Satu roda angka kertas dengan teks warna cokelat terakota (bukan merah alarm)
const RodaDigitTerakota: React.FC<{
  target: number;
  startFrame: number;
  stopFrame: number;
  spins: number;
}> = ({target, startFrame, stopFrame, spins}) => {
  const f = useCurrentFrame();
  const cellH = 68;
  const totalSteps = spins * 10 + target;

  const u = interpolate(f, [startFrame, stopFrame], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const settle = interpolate(f, [stopFrame, stopFrame + 4, stopFrame + 8], [0, 3, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  const wrappedStep = (totalSteps * u) % 10;
  const translateY = -wrappedStep * cellH + settle;
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div
      style={{
        position: 'relative',
        width: 38,
        height: cellH,
        overflow: 'hidden',
        backgroundColor: '#E8DFD3',
        borderRadius: 5,
        border: '2px solid #8A7A60',
        boxShadow: 'inset 0 4px 6px rgba(46,34,26,0.22), inset 0 -4px 6px rgba(46,34,26,0.22)',
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
              width: 38,
              height: cellH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 48,
              lineHeight: 1,
              color: '#9A5A42',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

// Papan angka kerugian kertas: berhenti di "8,03 triliun rupiah" tepat saat kata selesai (frame 368)
const PapanAngkaKerugian: React.FC = () => {
  const f = useCurrentFrame();
  const locked = f >= 368;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Tag "kerugiannya" di atas kiri papan angka */}
      <PopIn at={286}>
        <Boil seed="tag-kerugiannya" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 616,
              top: 466,
              rotate: '-1.5deg',
              backgroundColor: '#6B4A33',
              padding: '7px 18px 9px',
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 25,
              lineHeight: 1,
              color: '#F3E6D3',
              filter: 'url(#torn) drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
            }}
          >
            kerugiannya
          </div>
        </Boil>
      </PopIn>

      {/* Papan roda angka "8,03 triliun rupiah" */}
      <PopIn at={290}>
        <Boil seed="papan-kerugian" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 604,
              top: 500,
              width: 536,
              height: 94,
              backgroundColor: '#D9C7A3',
              borderRadius: 8,
              border: `3px solid ${locked ? '#9A5A42' : C.inkSoft}`,
              filter: 'url(#torn) drop-shadow(3px 7px 11px rgba(0,0,0,0.46))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0 16px',
            }}
          >
            <RodaDigitTerakota target={8} startFrame={296} stopFrame={344} spins={2} />
            <div
              style={{
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1,
                color: '#9A5A42',
                marginTop: 18,
              }}
            >
              ,
            </div>
            <RodaDigitTerakota target={0} startFrame={298} stopFrame={356} spins={3} />
            <RodaDigitTerakota target={3} startFrame={300} stopFrame={368} spins={3} />

            {/* Satuan tetap: triliun rupiah (warna cokelat terakota) */}
            <div
              style={{
                marginLeft: 10,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 34,
                lineHeight: 1.05,
                color: '#9A5A42',
                whiteSpace: 'nowrap',
              }}
            >
              triliun rupiah
            </div>

            <Disc x={14} y={14} d={8} color={C.woodLo} />
            <Disc x={522} y={14} d={8} color={C.woodLo} />
          </div>
        </Boil>
      </PopIn>
    </AbsoluteFill>
  );
};

// Map berkas putusan pengadilan di tengah panggung yang membuka dan menampilkan menara + desa
const MapBerkasMenara: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Beat 1 (0..46): Map meluncur masuk ke tengah panggung
  const slideInX = interpolate(sf, [2, 42], [-920, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 2 (44..78): Sampul depan map terlipat membuka dari engsel tengah
  const openU = interpolate(sf, [44, 76], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const coverScaleX = interpolate(openU, [0, 1], [1, 0], CLAMP);

  // Beat 3 (110..176): Garis putus-putus ditarik dari menara ke rumah-rumah (tetap gelap/belum menyala)
  const lineU = interpolate(f, [110, 174], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });

  // Beat 4 (204..220): Getaran kecil pada map saat stempel audit menghantam
  const stampBumpY = interpolate(f, [204, 207, 213], [0, 7, 0], CLAMP);

  const towerPositions = [312, 384, 456];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${slideInX}px, ${stampBumpY}px)`,
      }}
    >
      {/* Tab atas kiri map: "diputus pengadilan" */}
      <div
        style={{
          position: 'absolute',
          left: 244,
          top: 108,
          padding: '10px 26px 12px',
          backgroundColor: '#C9B58E',
          borderRadius: '10px 10px 0 0',
          borderTop: `2px solid ${C.inkSoft}`,
          borderLeft: `2px solid ${C.inkSoft}`,
          borderRight: `2px solid ${C.inkSoft}`,
          fontFamily: FONT.label,
          fontWeight: 800,
          fontSize: 22,
          lineHeight: 1,
          color: C.ink,
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.34))',
        }}
      >
        diputus pengadilan
      </div>

      {/* Badan utama map kertas terbuka */}
      <AbsoluteFill>
        <Paper lift={7}>
          <Slab
            x={236}
            y={146}
            w={808}
            h={316}
            color="#D9C7A3"
            shade="#B8A47E"
            shadeH={0.08}
            r={8}
            grain={0.75}
          />
          {/* Lembar dalam kiri dan kanan */}
          <Slab x={252} y={160} w={384} h={288} color="#E3D4B7" r={4} grain={0.5} />
          <Slab x={644} y={160} w={384} h={288} color="#E3D4B7" r={4} grain={0.5} />
        </Paper>
      </AbsoluteFill>

      {/* Lipatan tengah map */}
      <div
        style={{
          position: 'absolute',
          left: 638,
          top: 152,
          width: 4,
          height: 304,
          backgroundColor: '#8A7A60',
          boxShadow: '0 0 10px rgba(46,34,26,0.35)',
        }}
      />

      {/* Bukaan klip klipping saat sampul depan terlipat terbuka */}
      {openU > 0.02 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: interpolate(openU, [0.02, 0.25], [0, 1], CLAMP),
          }}
        >
          {/* Tanah dasar sisi kiri (menara sinyal) */}
          <div
            style={{
              position: 'absolute',
              left: 268,
              top: 382,
              width: 348,
              height: 14,
              borderRadius: 4,
              backgroundColor: '#8A7F72',
            }}
          />
          {/* Deretan menara sinyal kertas di sisi kiri */}
          {towerPositions.map((tx, i) => (
            <MenaraKertas
              key={i}
              x={tx}
              baseY={384}
              h={124 + (i % 2) * 18}
              growAt={50 + i * 8}
            />
          ))}

          {/* Label "menara sinyal" di sisi kiri map */}
          <AbsoluteFill>
            <PopIn at={56}>
              <Boil seed="pill-menara" amp={0.4} rot={0.05}>
                <Pill
                  x={436}
                  y={404}
                  text="menara sinyal"
                  bg={C.ink}
                  color="#F3E6D3"
                  size={25}
                />
              </Boil>
            </PopIn>
          </AbsoluteFill>

          {/* Tanah bukit desa di sisi kanan */}
          <div
            style={{
              position: 'absolute',
              left: 664,
              top: 382,
              width: 348,
              height: 14,
              borderRadius: 4,
              backgroundColor: '#6B4A33',
            }}
          />
          {/* Rumah-rumah desa kecil dengan jendela gelap di sisi kanan */}
          <RumahDesaGelap x={816} baseY={384} w={60} h={68} roofColor="#6B4A33" growAt={62} />
          <RumahDesaGelap x={896} baseY={384} w={66} h={76} roofColor="#9A5A42" growAt={70} />
          <RumahDesaGelap x={974} baseY={384} w={58} h={64} roofColor="#5E3B22" growAt={78} />

          {/* Label "desa-desa terpencil" di sisi kanan map */}
          <AbsoluteFill>
            <PopIn at={68}>
              <Boil seed="pill-desa" amp={0.4} rot={0.05}>
                <Pill
                  x={838}
                  y={404}
                  text="desa-desa terpencil"
                  bg="#6B4A33"
                  color="#F3E6D3"
                  size={24}
                />
              </Boil>
            </PopIn>
          </AbsoluteFill>

          {/* Beat 3: Garis putus-putus dari menara ke rumah-rumah (belum menyala) */}
          <svg
            width={1280}
            height={720}
            viewBox="0 0 1280 720"
            style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
          >
            {[
              {x1: 312, y1: 256, x2: 786, y2: 334, delay: 0},
              {x1: 384, y1: 242, x2: 866, y2: 328, delay: 0.12},
              {x1: 456, y1: 258, x2: 944, y2: 338, delay: 0.24},
            ].map((seg, idx) => {
              const segU = interpolate(lineU, [seg.delay, Math.min(1, seg.delay + 0.76)], [0, 1], CLAMP);
              const curX2 = interpolate(segU, [0, 1], [seg.x1, seg.x2], CLAMP);
              const curY2 = interpolate(segU, [0, 1], [seg.y1, seg.y2], CLAMP);
              return (
                <g key={idx} opacity={segU > 0 ? 0.85 : 0}>
                  <line
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={curX2}
                    y2={curY2}
                    stroke="#3A3832"
                    strokeWidth={3.5}
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />
                  {/* Titik ujung terputus sebelum mencapai jendela gelap */}
                  {segU >= 0.98 && (
                    <circle
                      cx={seg.x2}
                      cy={seg.y2}
                      r={4.5}
                      fill="#2E221A"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Beat 4: Cap stempel kertas "audit Badan Pengawasan Keuangan dan Pembangunan" */}
          <AbsoluteFill>
            <PopIn at={204}>
              <Boil seed="cap-audit" amp={0.4} rot={0.05}>
                <div
                  style={{
                    position: 'absolute',
                    left: 640,
                    top: 170,
                    translate: '-50% 0',
                    rotate: '-1.2deg',
                    padding: '9px 22px 11px',
                    backgroundColor: 'rgba(232, 223, 211, 0.92)',
                    border: '3px solid #6B4A33',
                    borderRadius: 5,
                    fontFamily: FONT.label,
                    fontWeight: 800,
                    fontSize: 21,
                    lineHeight: 1.1,
                    color: '#5E3B22',
                    whiteSpace: 'nowrap',
                    filter: 'url(#torn) drop-shadow(1px 3px 5px rgba(0,0,0,0.28))',
                  }}
                >
                  audit Badan Pengawasan Keuangan dan Pembangunan
                </div>
              </Boil>
            </PopIn>
          </AbsoluteFill>
        </div>
      )}

      {/* Sampul depan map yang menutup sebelum dibuka di Beat 2 */}
      {coverScaleX > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 236,
            top: 146,
            width: 808,
            height: 316,
            backgroundColor: '#CFB991',
            borderRadius: 8,
            border: `2px solid ${C.inkSoft}`,
            transformOrigin: '100% 50%',
            transform: `scaleX(${coverScaleX})`,
            boxShadow: '4px 8px 14px rgba(0,0,0,0.36)',
          }}
        >
          {/* Garis lipatan sampul abstrak tanpa teks terlarang */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 84,
              width: 260,
              height: 10,
              borderRadius: 4,
              backgroundColor: '#9E8B6B',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 112,
              width: 190,
              height: 10,
              borderRadius: 4,
              backgroundColor: '#9E8B6B',
            }}
          />
        </div>
      )}
    </div>
  );
};

export const PB03: React.FC = () => {
  return (
    <Stage dur={DUR} banner="">
      <SnapZoom at={204} x={640} y={240} to={1.06} settle={1.01} shake={5} roll={0.4}>
        <OrbitCamera dur={DUR} yaw={12} push={1.08} origin={[640, 380]}>
          {/* Latar jauh Dunia Bocor */}
          <Depth z={0.12}>
            <AbsoluteFill style={{backgroundColor: 'rgba(107, 74, 51, 0.16)'}} />
            <Window x={38} y={138} w={168} h={230} night={false} />
            <Shelf x={1055} y={196} w={195} books={3} />
            <Plant x={1145} y={376} s={0.7} />
          </Depth>

          {/* Panggung tengah: map putusan pengadilan, menara, desa, stempel audit, koin bocor, dan papan angka */}
          <Depth z={0.5}>
            <MapBerkasMenara />
            <StempelAudit />
            <AliranKoinBocor />
            <PapanAngkaKerugian />
          </Depth>

          {/* Bingkai panggung kertas tepi kiri dan kanan */}
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

export default PB03;
