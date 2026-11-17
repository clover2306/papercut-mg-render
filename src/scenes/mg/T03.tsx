// Adegan T03 "Dua Kota, Jalan Tetap Penuh" (scene 049-054, 686 frame @ 30fps): dua kartu pos pop-up Tallinn (2013) dan Luksemburg (2020) bercap Gratis.
// Penumpang di halte dan bus kertas bertambah ramai serta tumpukan karcis menjulang di kiri, namun panel jalan di kanan dan rel bawah tetap padat mobil.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const T03_DUR = 686;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const STAGE_FLOOR_Y = 568;
const ROAD_RAIL_Y = 636;

// Helper langkah stop-motion kertas tenang (tahan 3 frame per langkah, tanpa getar)
const stepFrame = (f: number, hold = 3) => Math.floor(f / hold) * hold;

// Siluet tokoh kertas TANPA WAJAH (kepala polos tanpa mata, hidung, mulut, atau telinga).
// Peran dibedakan dari postur, topi, tas punggung pelajar, atau tas kerja.
const FacelessCommuter: React.FC<{
  x: number;
  y: number;
  s?: number;
  coat?: string;
  role?: 'worker' | 'student' | 'walker' | 'driver';
  facing?: 1 | -1;
}> = ({x, y, s = 1, coat = ROOM.slate, role = 'walker', facing = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 64 * s,
      height: 136 * s,
      translate: '-50% -100%',
      transform: `scaleX(${facing})`,
    }}
  >
    {/* Tas punggung pelajar (bila role === 'student') */}
    {role === 'student' ? (
      <div
        style={{
          position: 'absolute',
          left: 8 * s,
          top: 44 * s,
          width: 18 * s,
          height: 34 * s,
          borderRadius: 5 * s,
          backgroundColor: C.brass,
          border: `${1.5 * s}px solid ${C.inkSoft}`,
        }}
      />
    ) : null}

    {/* Kaki kertas */}
    <div
      style={{
        position: 'absolute',
        left: 19 * s,
        top: 96 * s,
        width: 11 * s,
        height: 40 * s,
        borderRadius: 4 * s,
        backgroundColor: C.inkSoft,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 34 * s,
        top: 96 * s,
        width: 11 * s,
        height: 40 * s,
        borderRadius: 4 * s,
        backgroundColor: C.ink,
      }}
    />

    {/* Badan / pakaian sederhana dan rapi */}
    <div
      style={{
        position: 'absolute',
        left: 14 * s,
        top: 40 * s,
        width: 36 * s,
        height: 60 * s,
        borderRadius: `${10 * s}px ${10 * s}px ${5 * s}px ${5 * s}px`,
        backgroundColor: coat,
        border: `${1.5 * s}px solid ${C.inkSoft}`,
        boxShadow: 'inset 2px 0 0 rgba(255,255,255,0.18)',
      }}
    />

    {/* Kerah rapi */}
    <div
      style={{
        position: 'absolute',
        left: 24 * s,
        top: 40 * s,
        width: 16 * s,
        height: 8 * s,
        borderRadius: 2 * s,
        backgroundColor: C.creamHi,
      }}
    />

    {/* Kepala bulat polos TANPA WAJAH & TANPA TELINGA */}
    <div
      style={{
        position: 'absolute',
        left: 17 * s,
        top: 4 * s,
        width: 30 * s,
        height: 30 * s,
        borderRadius: '50%',
        backgroundColor: C.creamLo,
        border: `${2 * s}px solid ${C.inkSoft}`,
      }}
    />

    {/* Topi pengemudi bus (bila role === 'driver') */}
    {role === 'driver' ? (
      <>
        <div
          style={{
            position: 'absolute',
            left: 15 * s,
            top: 0,
            width: 34 * s,
            height: 11 * s,
            borderRadius: `${6 * s}px ${6 * s}px 2px 2px`,
            backgroundColor: C.cap,
            border: `${1.5 * s}px solid ${C.ink}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 28 * s,
            top: 8 * s,
            width: 26 * s,
            height: 4 * s,
            borderRadius: 2 * s,
            backgroundColor: C.ink,
          }}
        />
      </>
    ) : null}

    {/* Tas kerja (bila role === 'worker') */}
    {role === 'worker' ? (
      <div
        style={{
          position: 'absolute',
          left: 42 * s,
          top: 82 * s,
          width: 22 * s,
          height: 17 * s,
          borderRadius: 3 * s,
          backgroundColor: C.wood,
          border: `${1.5 * s}px solid ${C.woodLo}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 6 * s,
            top: -5 * s,
            width: 8 * s,
            height: 4 * s,
            border: `${1.5 * s}px solid ${C.woodLo}`,
            borderBottom: 'none',
            borderRadius: '3px 3px 0 0',
          }}
        />
      </div>
    ) : null}
  </div>
);

// Mobil kertas dengan pengemudi siluet tanpa wajah di balik setir (atau kosong saat ditinggal)
const PaperCar: React.FC<{
  x: number;
  y: number;
  s?: number;
  bodyColor: string;
  shadeColor: string;
  empty?: boolean;
}> = ({x, y, s = 1, bodyColor, shadeColor, empty = false}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 98 * s,
      height: 48 * s,
      translate: '-50% -100%',
    }}
  >
    {/* Bayangan bawah mobil */}
    <div
      style={{
        position: 'absolute',
        left: 6 * s,
        bottom: -3 * s,
        width: 86 * s,
        height: 6 * s,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.28)',
      }}
    />
    {/* Atap & kabin kaca */}
    <div
      style={{
        position: 'absolute',
        left: 16 * s,
        top: 2 * s,
        width: 56 * s,
        height: 22 * s,
        borderRadius: `${10 * s}px ${12 * s}px 0 0`,
        backgroundColor: bodyColor,
        border: `${2 * s}px solid ${C.ink}`,
        borderBottom: 'none',
      }}
    />
    {/* Jendela kabin */}
    <div
      style={{
        position: 'absolute',
        left: 22 * s,
        top: 6 * s,
        width: 44 * s,
        height: 16 * s,
        borderRadius: `${6 * s}px ${8 * s}px 0 0`,
        backgroundColor: empty ? '#D7CFC2' : '#DFD7C8',
        overflow: 'hidden',
      }}
    >
      {/* Tiang B pintu */}
      <div
        style={{
          position: 'absolute',
          left: 20 * s,
          top: 0,
          bottom: 0,
          width: 2.5 * s,
          backgroundColor: bodyColor,
        }}
      />
      {/* Pengemudi tanpa wajah di balik setir (hanya bila mobil tidak kosong) */}
      {!empty ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 25 * s,
              top: 2 * s,
              width: 9 * s,
              height: 9 * s,
              borderRadius: '50%',
              backgroundColor: C.inkSoft,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 23 * s,
              top: 11 * s,
              width: 13 * s,
              height: 7 * s,
              borderRadius: 3 * s,
              backgroundColor: C.ink,
            }}
          />
          {/* Lingkar setir kertas */}
          <div
            style={{
              position: 'absolute',
              left: 36 * s,
              top: 8 * s,
              width: 3 * s,
              height: 9 * s,
              transform: 'rotate(-24deg)',
              backgroundColor: C.ink,
            }}
          />
        </>
      ) : null}
    </div>

    {/* Bodi utama mobil kertas (tanpa plat nomor) */}
    <div
      style={{
        position: 'absolute',
        left: 4 * s,
        top: 21 * s,
        width: 90 * s,
        height: 19 * s,
        borderRadius: `${6 * s}px ${9 * s}px ${5 * s}px ${5 * s}`,
        backgroundColor: bodyColor,
        border: `${2 * s}px solid ${C.ink}`,
        boxShadow: `inset 0 -${5 * s}px 0 ${shadeColor}`,
      }}
    />

    {/* Pintu sedikit terbuka untuk menandai mobil kosong yang ditinggal */}
    {empty ? (
      <div
        style={{
          position: 'absolute',
          left: 38 * s,
          top: 18 * s,
          width: 24 * s,
          height: 19 * s,
          backgroundColor: shadeColor,
          border: `${1.5 * s}px solid ${C.ink}`,
          borderRadius: 3 * s,
          transform: 'rotate(-10deg)',
          transformOrigin: 'right top',
        }}
      />
    ) : null}

    {/* Lampu depan kuning hangat */}
    <div
      style={{
        position: 'absolute',
        right: 3 * s,
        top: 25 * s,
        width: 5 * s,
        height: 7 * s,
        borderRadius: 2 * s,
        backgroundColor: C.sparkYellow,
      }}
    />

    {/* Roda depan dan belakang */}
    {[22, 74].map((wx) => (
      <div
        key={wx}
        style={{
          position: 'absolute',
          left: (wx - 9) * s,
          top: 30 * s,
          width: 18 * s,
          height: 18 * s,
          borderRadius: '50%',
          backgroundColor: C.ink,
          border: `${2 * s}px solid ${C.creamLo}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 4 * s,
            borderRadius: '50%',
            backgroundColor: C.creamLo,
          }}
        />
      </div>
    ))}
  </div>
);

// Karcis kertas bercap "Gratis" (motif pengikat utama)
const GratisTicket: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number;
  showText?: boolean;
  tone?: 'cream' | 'warm' | 'sage';
}> = ({x, y, w = 132, h = 54, rot = -6, showText = true, tone = 'cream'}) => {
  const bg = tone === 'warm' ? '#F5E6CE' : tone === 'sage' ? '#E4E9DF' : '#FAF3E6';
  const borderCol = tone === 'warm' ? C.heroLo : C.inkSoft;
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
        backgroundColor: bg,
        border: `2.5px solid ${borderCol}`,
        borderRadius: 7,
        boxShadow: '2px 4px 7px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Lekuk sobekan karcis di kiri dan kanan */}
      <div
        style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          width: 14,
          height: 14,
          translate: '0 -50%',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2px solid ${borderCol}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          width: 14,
          height: 14,
          translate: '0 -50%',
          borderRadius: '50%',
          backgroundColor: C.creamLo,
          border: `2px solid ${borderCol}`,
        }}
      />
      {/* Garis perforasi karcis polos */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 5,
          bottom: 5,
          borderLeft: `1.5px dashed ${C.creamLo}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 5,
          bottom: 5,
          borderLeft: `1.5px dashed ${C.creamLo}`,
        }}
      />
      {showText ? (
        <div
          style={{
            border: `2.5px solid ${C.nogo}`,
            borderRadius: 5,
            padding: '2px 10px 3px',
            fontFamily: FONT.banner,
            fontSize: Math.round(h * 0.42),
            color: C.nogo,
            letterSpacing: '0.03em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Gratis
        </div>
      ) : (
        <div
          style={{
            width: w * 0.48,
            height: h * 0.34,
            borderRadius: 3,
            border: `2px solid ${C.heroLo}`,
            opacity: 0.45,
          }}
        />
      )}
    </div>
  );
};

// Cap tahun kecil ("2013" atau "2020") — ditempel utuh sekaligus tanpa hitung-naik
const YearStampBadge: React.FC<{
  text: '2013' | '2020';
  x: number;
  y: number;
  at: number;
  rot?: number;
  color?: string;
}> = ({text, x, y, at, rot = 6, color = C.cap}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f, [at, at + 6], [1.42, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(2)),
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        scale: String(s),
        backgroundColor: '#FBF6EC',
        border: `3px solid ${color}`,
        borderRadius: 8,
        padding: '4px 12px 5px',
        boxShadow: '2px 4px 6px rgba(0,0,0,0.28)',
      }}
    >
      <div
        style={{
          border: `1.5px dashed ${color}`,
          borderRadius: 4,
          padding: '2px 8px',
          fontFamily: FONT.banner,
          fontSize: 23,
          color,
          lineHeight: 1,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Kartu Pos Pop-Up Kiri (Tallinn, ibu kota Estonia, Gratis, 2013)
// dan Kartu Pos Pop-Up Kanan (Luksemburg, seluruh negeri, Gratis, 2020)
const CityPostcardPopUp: React.FC<{
  city: 'tallinn' | 'luxembourg';
  popProgress: number;
  crowdProgress: number;
}> = ({city, popProgress, crowdProgress}) => {
  const f = useCurrentFrame();
  const isTallinn = city === 'tallinn';

  // Waktu kemunculan teks tempel dan cap sesuai urutan beat
  const titleAt = isTallinn ? 40 : 194;
  const subAt = isTallinn ? 58 : 210;
  const gratisAt = isTallinn ? 84 : 230;
  const yearAt = isTallinn ? 108 : 252;

  const titleOp = f >= titleAt ? 1 : 0;
  const titleScale = interpolate(f, [titleAt, titleAt + 6], [1.28, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.8)),
  });

  const subOp = f >= subAt ? 1 : 0;
  const subScale = interpolate(f, [subAt, subAt + 6], [1.24, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.8)),
  });

  const gratisOp = f >= gratisAt ? 1 : 0;
  const gratisScale = interpolate(f, [gratisAt, gratisAt + 6], [1.4, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(2)),
  });

  // Garis lingkar kertas untuk Luksemburg ("seluruh negeri")
  const borderLoopP = isTallinn
    ? 0
    : interpolate(f, [182, 212], [0, 1], {...CLAMP, easing: Easing.out(Easing.quad)});

  // Penumpang siluet yang bertambah banyak di halte dalam kartu pos saat Beat 3
  const passengerSpecs = [
    {x: 118, coat: ROOM.slate, role: 'worker' as const, delay: 0.05},
    {x: 146, coat: C.hero, role: 'student' as const, delay: 0.14},
    {x: 174, coat: ROOM.teal, role: 'walker' as const, delay: 0.24},
    {x: 202, coat: ROOM.mustard, role: 'worker' as const, delay: 0.34},
    {x: 230, coat: ROOM.purple, role: 'student' as const, delay: 0.44},
    {x: 258, coat: C.cap, role: 'walker' as const, delay: 0.54},
    {x: 286, coat: ROOM.terracotta, role: 'worker' as const, delay: 0.64},
    {x: 314, coat: ROOM.sage, role: 'student' as const, delay: 0.74},
    {x: 342, coat: C.wood, role: 'walker' as const, delay: 0.84},
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: 472,
        height: 304,
      }}
    >
      {/* Alas kartu pos kertas bergerigi perangko polos */}
      <Paper lift={7}>
        <Slab
          x={0}
          y={0}
          w={472}
          h={304}
          color="#F8F1E3"
          shade={C.creamLo}
          shadeH={0.08}
          r={10}
        />
        {/* Bingkai dalam kartu pos */}
        <div
          style={{
            position: 'absolute',
            inset: 10,
            border: `2.5px solid ${C.creamLo}`,
            borderRadius: 7,
            pointerEvents: 'none',
          }}
        />
      </Paper>

      {/* Latar langit pagi dan siluet kota / negeri di bagian tengah kartu pos */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 84,
          width: 436,
          height: 198,
          borderRadius: 6,
          backgroundColor: isTallinn ? '#DCE5EA' : '#E3E9DC',
          border: `2px solid ${C.creamLo}`,
          overflow: 'hidden',
        }}
      >
        {/* Matahari pagi kertas polos */}
        <div
          style={{
            position: 'absolute',
            left: isTallinn ? 64 : 348,
            top: 22,
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: '#F6D786',
            opacity: 0.85,
          }}
        />

        {isTallinn ? (
          /* Siluet kota generik Tallinn: deretan menara dan atap sederhana (bukan landmark nyata, tanpa bendera) */
          <svg
            width={436}
            height={170}
            viewBox="0 0 436 170"
            style={{position: 'absolute', left: 0, top: 14}}
          >
            {/* Lapisan siluet belakang */}
            <polygon
              points="0,170 0,108 32,82 64,108 64,92 104,92 104,114 142,66 168,114 212,86 248,112 288,74 316,112 362,88 398,110 436,92 436,170"
              fill="#9AAAB6"
            />
            {/* Lapisan siluet menara & atap sederhana depan */}
            <polygon
              points="18,170 18,116 46,90 74,116 86,116 106,58 126,116 146,102 184,102 184,122 216,74 238,122 254,104 298,104 318,64 338,104 378,96 414,118 414,170"
              fill="#5C6F82"
            />
            {/* Atap-atap terakota sederhana */}
            <polygon points="18,116 46,90 74,116" fill={ROOM.terracotta} />
            <polygon points="106,58 122,102 90,102" fill={C.heroLo} />
            <polygon points="216,74 236,112 196,112" fill={ROOM.terracotta} />
            <polygon points="318,64 336,104 300,104" fill={C.heroLo} />
          </svg>
        ) : (
          /* Siluet negeri kecil Luksemburg: perbukitan, desa kecil, seluruh tepinya dilingkari garis kertas */
          <>
            <svg
              width={436}
              height={176}
              viewBox="0 0 436 176"
              style={{position: 'absolute', left: 0, top: 10}}
            >
              {/* Pulau / wilayah negeri kecil di tengah */}
              <path
                d="M 48 132 C 42 96, 86 62, 146 66 C 188 52, 256 48, 304 68 C 358 64, 396 92, 388 132 C 378 154, 312 160, 218 160 C 122 160, 56 152, 48 132 Z"
                fill="#8EA487"
              />
              <path
                d="M 74 130 C 92 98, 152 84, 218 92 C 282 82, 338 96, 362 128 Z"
                fill="#698164"
              />
              {/* Deretan atap rumah & menara desa sederhana di dalam negeri */}
              <rect x={128} y={96} width={28} height={24} fill={C.creamHi} />
              <polygon points="124,96 142,78 160,96" fill={ROOM.terracotta} />
              <rect x={172} y={88} width={22} height={32} fill={C.cream} />
              <polygon points="170,88 183,64 196,88" fill={C.capLo} />
              <rect x={212} y={98} width={34} height={22} fill={C.creamHi} />
              <polygon points="208,98 229,82 250,98" fill={C.heroLo} />
              <rect x={266} y={92} width={26} height={28} fill={C.cream} />
              <polygon points="262,92 279,72 296,92" fill={ROOM.terracotta} />

              {/* Garis kertas melingkari seluruh tepi negeri ("seluruh negeri") */}
              {borderLoopP > 0 ? (
                <path
                  d="M 38 130 C 30 86, 80 48, 148 52 C 194 36, 264 34, 314 54 C 372 52, 408 86, 398 132 C 388 162, 314 168, 218 168 C 116 168, 46 158, 38 130 Z"
                  fill="none"
                  stroke={C.nogo}
                  strokeWidth={4.5}
                  strokeDasharray="12 7"
                  strokeLinecap="round"
                  opacity={borderLoopP}
                />
              ) : null}
            </svg>
          </>
        )}

        {/* BEAT 3: Lipatan buku pop-up yang berdiri di dalam kartu pos (halte + jalan tiap kota) */}
        {popProgress > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 158,
              transformOrigin: 'bottom center',
              transform: `scaleY(${popProgress})`,
              backgroundColor: 'rgba(246, 239, 226, 0.94)',
              borderTop: `3px solid ${C.wood}`,
              boxShadow: '0 -6px 14px rgba(0,0,0,0.22)',
            }}
          >
            {/* Lipatan tengah vertikal ala buku pop-up */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: 'rgba(0,0,0,0.16)',
              }}
            />
            {/* Trotoar dan bangunan halte kertas polos (tanpa tulisan tambahan) */}
            <div
              style={{
                position: 'absolute',
                left: 56,
                top: 18,
                width: 324,
                height: 86,
              }}
            >
              {/* Tiang halte kiri & kanan */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 14,
                  width: 7,
                  height: 72,
                  backgroundColor: C.board,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 14,
                  width: 7,
                  height: 72,
                  backgroundColor: C.board,
                }}
              />
              {/* Panel belakang halte */}
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 20,
                  width: 280,
                  height: 54,
                  backgroundColor: 'rgba(218, 206, 192, 0.65)',
                  border: `2px solid ${C.boardHi}`,
                  borderRadius: 4,
                }}
              />
              {/* Atap kanopi halte kertas */}
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 4,
                  width: 316,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: isTallinn ? C.cap : ROOM.teal,
                  border: `2px solid ${C.ink}`,
                }}
              />
            </div>

            {/* Barisan siluet penumpang tanpa wajah yang bertambah banyak di halte */}
            {passengerSpecs.map((p, idx) => {
              const pU = interpolate(
                crowdProgress,
                [p.delay, Math.min(1, p.delay + 0.16)],
                [0, 1],
                {...CLAMP, easing: Easing.out(Easing.back(1.6))},
              );
              if (pU <= 0.01) return null;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: p.x,
                    top: 104,
                    transform: `scale(${pU})`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  <FacelessCommuter
                    x={0}
                    y={0}
                    s={0.46}
                    coat={p.coat}
                    role={p.role}
                    facing={idx % 2 === 0 ? 1 : -1}
                  />
                </div>
              );
            })}

            {/* Jalur jalan di depan halte tiap kota (tetap dipenuhi mobil kertas) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 46,
                backgroundColor: C.board,
                borderTop: `2.5px solid ${C.ink}`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  top: 22,
                  borderTop: `2px dashed ${C.creamLo}`,
                  opacity: 0.55,
                }}
              />
              {[58, 146, 234, 322, 398].map((cx, ci) => (
                <PaperCar
                  key={ci}
                  x={cx}
                  y={42}
                  s={0.62}
                  bodyColor={
                    [C.hero, C.cap, ROOM.mustard, ROOM.sage, ROOM.terracotta][ci % 5]
                  }
                  shadeColor={C.inkSoft}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Pita atas kartu pos: Label Kota + Keterangan + Cap Gratis + Cap Tahun */}
      {/* Label Kota Utama: "Tallinn" atau "Luksemburg" */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 16,
          opacity: titleOp,
          transform: `scale(${titleScale})`,
          transformOrigin: 'left center',
          backgroundColor: isTallinn ? C.ink : ROOM.navy,
          color: '#FAF3E6',
          padding: '6px 16px 8px',
          borderRadius: 6,
          fontFamily: FONT.caption,
          fontWeight: 900,
          fontSize: 28,
          lineHeight: 1.05,
          boxShadow: '2px 4px 6px rgba(0,0,0,0.26)',
          whiteSpace: 'nowrap',
        }}
      >
        {isTallinn ? 'Tallinn' : 'Luksemburg'}
      </div>

      {/* Sub-label yang ditempel: "ibu kota Estonia" atau "seluruh negeri" */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 56,
          opacity: subOp,
          transform: `scale(${subScale})`,
          transformOrigin: 'left center',
          backgroundColor: C.tape,
          color: C.ink,
          padding: '3px 12px 4px',
          borderRadius: 4,
          border: `1.5px solid ${C.inkSoft}`,
          fontFamily: FONT.label,
          fontWeight: 800,
          fontSize: 16,
          lineHeight: 1.1,
          boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}
      >
        {isTallinn ? 'ibu kota Estonia' : 'seluruh negeri'}
      </div>

      {/* Karcis "Gratis" dicap di sudut kanan-atas kartu pos */}
      {gratisOp > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 318,
            top: 44,
            opacity: gratisOp,
            transform: `scale(${gratisScale})`,
          }}
        >
          <GratisTicket x={0} y={0} w={118} h={46} rot={-5} showText />
        </div>
      ) : null}

      {/* Cap kecil tahun: "2013" (Tallinn) atau "2020" (Luksemburg) */}
      <YearStampBadge
        text={isTallinn ? '2013' : '2020'}
        x={418}
        y={52}
        at={yearAt}
        rot={7}
        color={isTallinn ? C.cap : ROOM.purple}
      />
    </div>
  );
};

// Bus kertas pagi yang membengkak penuh dan ramai dengan siluet penumpang tanpa wajah + pengemudi bertopi
const CrowdedPaperBus: React.FC<{
  x: number;
  y: number;
  enterU: number;
  swellU: number;
}> = ({x, y, enterU, swellU}) => {
  if (enterU <= 0.01) return null;
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);
  // Efek "membengkak penuh dan ramai" ala kertas (tenang, tanpa getar liar)
  const bulgeX = 1 + 0.06 * swellU + Math.sin(sf * 0.08) * 0.008 * swellU;
  const bulgeY = 1 + 0.08 * swellU - Math.sin(sf * 0.08) * 0.008 * swellU;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 344,
        height: 214,
        opacity: enterU,
        transform: `translateX(${(1 - enterU) * -120}px) scale(${bulgeX}, ${bulgeY})`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Bayangan bus di lantai panggung */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 4,
          width: 314,
          height: 14,
          borderRadius: 999,
          backgroundColor: 'rgba(0,0,0,0.32)',
        }}
      />

      {/* Siluet penumpang yang meluap padat di atap/jendela saat bus membengkak */}
      <Paper lift={6}>
        {/* Badan utama bus kertas (tanpa nomor rute atau tulisan) */}
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 28,
            width: 328,
            height: 158,
            borderRadius: '22px 28px 10px 10px',
            backgroundColor: C.amber,
            border: `3.5px solid ${C.ink}`,
            boxShadow: `inset 0 -18px 0 ${C.brassLo}, inset 0 8px 0 #F9D27A`,
          }}
        />

        {/* Pita dekoratif kertas di lambung bus (polos tanpa huruf/angka) */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 124,
            width: 320,
            height: 16,
            backgroundColor: C.hero,
            borderTop: `2px solid ${C.ink}`,
            borderBottom: `2px solid ${C.ink}`,
          }}
        />

        {/* Papan rute depan di dahi bus — POLOS tanpa nomor/teks sesuai aturan brief */}
        <div
          style={{
            position: 'absolute',
            right: 26,
            top: 36,
            width: 68,
            height: 14,
            borderRadius: 4,
            backgroundColor: C.board,
            border: `2px solid ${C.ink}`,
          }}
        />

        {/* Tiga jendela besar penumpang yang penuh sesak oleh siluet tanpa wajah */}
        {[24, 108, 192].map((wx, wi) => (
          <div
            key={wx}
            style={{
              position: 'absolute',
              left: wx,
              top: 52,
              width: 74,
              height: 62,
              borderRadius: 7,
              backgroundColor: '#EAE2D3',
              border: `2.5px solid ${C.ink}`,
              overflow: 'hidden',
            }}
          >
            {/* Baris belakang siluet kepala + bahu tanpa wajah */}
            {[10, 28, 46].map((px, pi) => (
              <div key={`b-${pi}`} style={{position: 'absolute', left: px, top: 6}}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: C.inkSoft,
                  }}
                />
                <div
                  style={{
                    marginLeft: -3,
                    marginTop: 1,
                    width: 22,
                    height: 24,
                    borderRadius: 5,
                    backgroundColor: ROOM.slate,
                  }}
                />
              </div>
            ))}
            {/* Baris depan siluet penumpang tanpa wajah berdesakan */}
            {[2, 20, 38, 54].map((px, pi) => (
              <div
                key={`f-${pi}`}
                style={{
                  position: 'absolute',
                  left: px,
                  top: 18,
                  opacity: pi === 3 ? swellU : 1,
                }}
              >
                <div
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    backgroundColor: C.creamLo,
                    border: `2px solid ${C.ink}`,
                  }}
                />
                <div
                  style={{
                    marginLeft: -3,
                    marginTop: 1,
                    width: 23,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor:
                      [C.cap, C.hero, ROOM.teal, ROOM.purple][(wi + pi) % 4],
                    border: `1.5px solid ${C.ink}`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Jendela depan pengemudi bus bertopi di balik kemudi (tanpa wajah) */}
        <div
          style={{
            position: 'absolute',
            left: 274,
            top: 52,
            width: 52,
            height: 62,
            borderRadius: '6px 16px 6px 6px',
            backgroundColor: '#EAE2D3',
            border: `2.5px solid ${C.ink}`,
            overflow: 'hidden',
          }}
        >
          {/* Kepala pengemudi tanpa wajah + topi pengemudi */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 14,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: C.creamLo,
              border: `2px solid ${C.ink}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 9,
              width: 24,
              height: 8,
              borderRadius: '4px 4px 1px 1px',
              backgroundColor: C.cap,
              border: `1.5px solid ${C.ink}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 14,
              width: 14,
              height: 3.5,
              borderRadius: 2,
              backgroundColor: C.ink,
            }}
          />
          {/* Badan pengemudi & setir bus */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 35,
              width: 28,
              height: 26,
              borderRadius: 6,
              backgroundColor: C.capLo,
              border: `1.5px solid ${C.ink}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 34,
              width: 4,
              height: 24,
              transform: 'rotate(-22deg)',
              backgroundColor: C.ink,
            }}
          />
        </div>

        {/* Lampu depan bus */}
        <div
          style={{
            position: 'absolute',
            right: 4,
            top: 148,
            width: 10,
            height: 16,
            borderRadius: 3,
            backgroundColor: C.sparkYellow,
            border: `2px solid ${C.ink}`,
          }}
        />

        {/* Roda bus kiri & kanan */}
        {[72, 266].map((wx) => (
          <div
            key={wx}
            style={{
              position: 'absolute',
              left: wx - 24,
              top: 160,
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: C.ink,
              border: `3px solid ${C.creamLo}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 11,
                borderRadius: '50%',
                backgroundColor: C.creamLo,
              }}
            />
          </div>
        ))}
      </Paper>
    </div>
  );
};

// Tumpukan karcis kertas yang menjulang tinggi di sisi kiri (Beat 4, tanpa angka)
const ToweringTicketStack: React.FC<{
  x: number;
  bottomY: number;
  growU: number;
}> = ({x, bottomY, growU}) => {
  if (growU <= 0.01) return null;
  const totalLayers = 18;
  const visibleLayers = Math.max(1, Math.round(totalLayers * growU));

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: bottomY - 310,
        width: 176,
        height: 310,
      }}
    >
      {/* Alas baki kayu tumpukan karcis */}
      <Paper lift={5}>
        <Slab
          x={8}
          y={294}
          w={160}
          h={16}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.35}
          r={4}
        />
      </Paper>

      {/* Lapisan-lapisan karcis kertas yang menumpuk tinggi */}
      {Array.from({length: visibleLayers}).map((_, idx) => {
        const ly = 282 - idx * 14;
        const offset = ((idx * 7) % 5) - 2;
        const rot = ((idx * 11) % 7) - 3;
        const tone = idx % 3 === 0 ? '#FAF3E6' : idx % 3 === 1 ? '#F2E5CF' : '#E7DEC9';
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 20 + offset * 2.5,
              top: ly,
              width: 136,
              height: 22,
              rotate: `${rot}deg`,
              backgroundColor: tone,
              border: `2px solid ${C.inkSoft}`,
              borderRadius: 4,
              boxShadow: '1px 3px 4px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 6,
                height: 8,
                borderRadius: 2,
                border: `1.5px solid ${C.nogo}`,
                opacity: 0.65,
              }}
            />
          </div>
        );
      })}

      {/* Karcis bercap "Gratis" menghadap penonton di puncak dan badan menara karcis */}
      {growU > 0.35 ? (
        <GratisTicket
          x={88}
          y={290 - visibleLayers * 7}
          w={136}
          h={50}
          rot={-4}
          showText
          tone="warm"
        />
      ) : null}
      <GratisTicket
        x={88}
        y={282 - visibleLayers * 14 - 16}
        w={144}
        h={54}
        rot={3}
        showText
        tone="cream"
      />
    </div>
  );
};

// Panel jalan yang penuh sesak mobil kertas di sisi kanan panggung (tersingkap pada "jebakan yang tidak terlihat")
const RevealedCongestedRoadPanel: React.FC<{
  x: number;
  y: number;
  panelOpenU: number;
  curtainPeelU: number;
}> = ({x, y, panelOpenU, curtainPeelU}) => {
  if (panelOpenU <= 0.01) return null;

  const laneY = [66, 132, 198, 262];
  const carCols = [86, 184, 282, 380, 476];
  const palette = [
    [C.hero, C.heroLo],
    [C.cap, C.capLo],
    [ROOM.mustard, C.brassLo],
    [ROOM.teal, '#1D3B3B'],
    [ROOM.terracotta, '#6D3927'],
    [ROOM.slate, '#334354'],
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 556,
        height: 296,
        opacity: panelOpenU,
        transform: `translateY(${(1 - panelOpenU) * 28}px)`,
      }}
    >
      {/* Bingkai panggung panel jalan penuh di kanan */}
      <Paper lift={7}>
        <Slab
          x={0}
          y={0}
          w={556}
          h={296}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.08}
          r={10}
        />
        {/* Permukaan jalan raya multi-lajur yang padat merayap */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: 7,
            backgroundColor: C.board,
            border: `2.5px solid ${C.ink}`,
            overflow: 'hidden',
          }}
        >
          {/* Garis marka putus-putus antar lajur */}
          {[76, 142, 208].map((ly) => (
            <div
              key={ly}
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: ly,
                borderTop: `2.5px dashed ${C.creamLo}`,
                opacity: 0.55,
              }}
            />
          ))}

          {/* Barisan mobil kertas rapat memenuhi keempat lajur */}
          {laneY.map((ly, rIdx) =>
            carCols.map((cx, cIdx) => {
              const [col, shade] = palette[(rIdx * 2 + cIdx) % palette.length];
              const shift = (rIdx % 2 === 0 ? 1 : -1) * 6;
              return (
                <PaperCar
                  key={`${rIdx}-${cIdx}`}
                  x={cx + shift}
                  y={ly}
                  s={0.86}
                  bodyColor={col}
                  shadeColor={shade}
                />
              );
            }),
          )}
        </div>
      </Paper>

      {/* Penutup kertas kraft ("jebakan yang tidak terlihat") yang melipat terbuka ke kanan */}
      {curtainPeelU < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'right center',
            transform: `scaleX(${1 - curtainPeelU})`,
            backgroundColor: C.cream,
            border: `3px solid ${C.woodLo}`,
            borderRadius: 10,
            boxShadow: '-8px 4px 16px rgba(0,0,0,0.28)',
            overflow: 'hidden',
          }}
        >
          {/* Pola lipatan akordeon kertas tanpa teks */}
          {[90, 180, 270, 360, 450].map((fx) => (
            <div
              key={fx}
              style={{
                position: 'absolute',
                left: fx,
                top: 0,
                bottom: 0,
                width: 14,
                backgroundColor: 'rgba(0,0,0,0.06)',
                borderLeft: `1.5px dashed ${C.creamLo}`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const T03: React.FC = () => {
  const f = useCurrentFrame();
  const sf = stepFrame(f, 3);

  // Gorden pembuka panggung Teater Kertas Halte Pagi di awal adegan
  const curtainOpen = interpolate(f, [0, 22], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Gerak kamera tenang melintasi 4 beat (terlihat jelas namun lembut tanpa guncangan):
  // Beat 1 (0-150): fokus sedikit ke kartu pos kiri (Tallinn)
  // Beat 2 (150-300): geser ke kanan saat kartu pos Luksemburg masuk, lalu ke tengah
  // Beat 3 (300-475): dorong masuk sedikit saat kedua kartu pos membuka pop-up halte & jalan
  // Beat 4 (475-686): mundur ke komposisi panggung utuh (tumpukan karcis & bus di kiri, jalan penuh di kanan)
  const camScale = interpolate(
    f,
    [0, 50, 145, 210, 295, 360, 465, 535, 686],
    [1.0, 1.07, 1.07, 1.07, 1.04, 1.08, 1.08, 1.02, 1.02],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camX = interpolate(
    f,
    [0, 50, 145, 210, 295, 360, 465, 535, 686],
    [0, 52, 46, -48, 0, 0, 0, 0, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const camY = interpolate(
    f,
    [0, 145, 300, 465, 535, 686],
    [0, 10, 6, -8, 0, 0],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );

  // Beat 1 & 2: Luncuran masuk kartu pos kiri (Tallinn) dan kanan (Luksemburg)
  const leftCardSlideX = interpolate(f, [10, 38], [-560, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightCardSlideX = interpolate(f, [154, 182], [580, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightCardOp = f < 154 ? 0 : 1;

  // Beat 3: Kedua kartu pos membuka sebagai buku pop-up (306-342) dan penumpang bertambah (338-420)
  const popUpOpenU = interpolate(f, [306, 342], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const passengerCrowdU = interpolate(f, [338, 422], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Beat 3: Hanya segelintir mobil (2 mobil) di rel bawah yang ditinggal kosong ke tepi parkir,
  // sementara barisan mobil sisanya merapat kembali sehingga jalur jalan tetap penuh.
  const fewCarsLeaveU = interpolate(f, [388, 428], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Beat 4 (475-686): Kedua kartu pos bergeser naik dengan anggun ke galeri atas supaya
  // seluruh label ("Tallinn", "ibu kota Estonia", "2013", "Luksemburg", "seluruh negeri", "2020", "Gratis")
  // tetap terbaca 100% utuh, sementara panggung bawah menampilkan bus ramai + tumpukan karcis di kiri
  // dan panel jalan penuh yang tersingkap di kanan.
  const beat4LayoutU = interpolate(f, [474, 512], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cardTopY = interpolate(beat4LayoutU, [0, 1], [134, 24], CLAMP);
  const cardScale = interpolate(beat4LayoutU, [0, 1], [1.0, 0.72], CLAMP);
  const leftCardBaseX = interpolate(beat4LayoutU, [0, 1], [136, 200], CLAMP);
  const rightCardBaseX = interpolate(beat4LayoutU, [0, 1], [672, 740], CLAMP);

  // Beat 4: Bus kertas masuk & membengkak penuh, tumpukan karcis menjulang tinggi di kiri,
  // lalu panel jalan penuh tersingkap di kanan ("jebakan yang tidak terlihat").
  const busEnterU = interpolate(f, [480, 514], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const busSwellU = interpolate(f, [510, 552], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });
  const stackGrowU = interpolate(f, [504, 560], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const roadPanelAppearU = interpolate(f, [516, 546], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const trapPeelU = interpolate(f, [566, 612], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Barisan mobil di jalur jalan kaki panggung (11 mobil rapat)
  const bottomCars = [
    {baseX: 96, color: C.hero, shade: C.heroLo, leaves: false},
    {baseX: 204, color: C.cap, shade: C.capLo, leaves: false},
    {baseX: 312, color: ROOM.mustard, shade: C.brassLo, leaves: true},
    {baseX: 420, color: ROOM.teal, shade: '#1D3B3B', leaves: false},
    {baseX: 528, color: ROOM.terracotta, shade: '#6D3927', leaves: false},
    {baseX: 636, color: ROOM.slate, shade: '#334354', leaves: false},
    {baseX: 744, color: C.sage, shade: C.sageLo, leaves: true},
    {baseX: 852, color: C.hero, shade: C.heroLo, leaves: false},
    {baseX: 960, color: C.cap, shade: C.capLo, leaves: false},
    {baseX: 1068, color: ROOM.mustard, shade: C.brassLo, leaves: false},
    {baseX: 1176, color: ROOM.terracotta, shade: '#6D3927', leaves: false},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 1: Latar Panggung Teater Kertas Halte Pagi (paralaks 0.65x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 0.65}px, ${camY * 0.65}px) scale(${1 + (camScale - 1) * 0.65})`,
            transformOrigin: '640px 360px',
          }}
        >
          <Slab x={-120} y={-80} w={1520} h={880} color={C.creamHi} r={0} grain={0.55} />
          {/* Langit pagi hangat berlapis kertas */}
          <div
            style={{
              position: 'absolute',
              left: -80,
              right: -80,
              top: -40,
              height: 360,
              background:
                'linear-gradient(180deg, rgba(245, 214, 150, 0.36) 0%, rgba(232, 223, 211, 0.08) 100%)',
            }}
          />
          {/* Siluet pepohonan & atap halte pagi samar di kejauhan */}
          <Paper lift={3}>
            <Slab x={64} y={392} w={1152} h={176} color={C.cream} r={6} grain={0.5} />
            {/* Kanopi bangunan halte pagi di latar panggung (polos tanpa tulisan) */}
            <Slab x={108} y={366} w={260} h={18} color={ROOM.teal} shade="#1E3E3E" shadeH={0.3} r={4} />
            <Slab x={132} y={384} w={10} h={184} color={C.board} r={2} />
            <Slab x={334} y={384} w={10} h={184} color={C.board} r={2} />
            {/* Bangku kayu halte polos */}
            <Slab x={164} y={518} w={140} h={12} color={C.wood} shade={C.woodLo} shadeH={0.35} r={3} />
            <Slab x={180} y={530} w={10} h={38} color={C.woodLo} r={2} />
            <Slab x={278} y={530} w={10} h={38} color={C.woodLo} r={2} />
          </Paper>
        </AbsoluteFill>

        {/* LAPISAN 2: Panggung Utama — Kartu Pos Pop-Up, Tumpukan Karcis, Bus Ramai, Panel Jalan, & Rel Mobil (paralaks 1.0x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
            transformOrigin: '640px 360px',
          }}
        >
          {/* Lantai panggung kayu & trotoar halte */}
          <Slab
            x={-100}
            y={STAGE_FLOOR_Y - 14}
            w={1480}
            h={18}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.38}
            r={0}
          />
          <Slab
            x={-100}
            y={STAGE_FLOOR_Y}
            w={1480}
            h={170}
            color={C.floor}
            r={0}
            grain={0.6}
          />

          {/* BEAT 4: Tumpukan karcis tinggi di sisi kiri + Bus kertas ramai di sampingnya */}
          <ToweringTicketStack x={68} bottomY={STAGE_FLOOR_Y - 8} growU={stackGrowU} />
          <CrowdedPaperBus
            x={252}
            y={STAGE_FLOOR_Y - 212}
            enterU={busEnterU}
            swellU={busSwellU}
          />

          {/* BEAT 4: Panel jalan yang penuh mobil di sisi kanan (tersingkap di belakang/samping tumpukan) */}
          <RevealedCongestedRoadPanel
            x={648}
            y={254}
            panelOpenU={roadPanelAppearU}
            curtainPeelU={trapPeelU}
          />

          {/* BEAT 1-4: Kartu Pos 1 (Kiri) — Tallinn, ibu kota Estonia, Gratis, 2013 */}
          <PopIn at={8} seed="tallinn-card">
            <Boil seed="tallinn-boil" amp={0.4} rot={0.05}>
              <div
                style={{
                  position: 'absolute',
                  left: leftCardBaseX + leftCardSlideX,
                  top: cardTopY,
                  transform: `scale(${cardScale}) rotate(-1.2deg)`,
                  transformOrigin: 'top left',
                }}
              >
                <CityPostcardPopUp
                  city="tallinn"
                  popProgress={popUpOpenU}
                  crowdProgress={passengerCrowdU}
                />
              </div>
            </Boil>
          </PopIn>

          {/* BEAT 2-4: Kartu Pos 2 (Kanan) — Luksemburg, seluruh negeri, Gratis, 2020 */}
          <div
            style={{
              position: 'absolute',
              left: rightCardBaseX + rightCardSlideX,
              top: cardTopY,
              opacity: rightCardOp,
              transform: `scale(${cardScale}) rotate(1.2deg)`,
              transformOrigin: 'top left',
            }}
          >
            <Boil seed="lux-boil" amp={0.4} rot={0.05}>
              <CityPostcardPopUp
                city="luxembourg"
                popProgress={popUpOpenU}
                crowdProgress={passengerCrowdU}
              />
            </Boil>
          </div>

          {/* MOTIF PENGIKAT: Jalur jalan di kaki panggung (pengukur macet tanpa angka) */}
          {/* Saku parkir kecil tempat 2 mobil kosong ditinggal di Beat 3 */}
          <div
            style={{
              position: 'absolute',
              left: 248,
              top: STAGE_FLOOR_Y + 6,
              width: 620,
              height: 36,
              borderRadius: 6,
              backgroundColor: 'rgba(32, 35, 38, 0.55)',
              border: `1.5px dashed ${C.creamLo}`,
              opacity: fewCarsLeaveU,
            }}
          />

          {/* Rel aspal memanjang di kaki panggung */}
          <Slab
            x={-80}
            y={ROAD_RAIL_Y - 38}
            w={1440}
            h={68}
            color={C.board}
            shade={C.boardLo}
            shadeH={0.28}
            r={0}
          />
          <div
            style={{
              position: 'absolute',
              left: -80,
              right: -80,
              top: ROAD_RAIL_Y - 38,
              height: 4,
              backgroundColor: C.creamLo,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -80,
              right: -80,
              top: ROAD_RAIL_Y + 26,
              height: 4,
              backgroundColor: C.woodLo,
            }}
          />
          {/* Marka tengah jalan putus-putus */}
          <div
            style={{
              position: 'absolute',
              left: -40,
              right: -40,
              top: ROAD_RAIL_Y - 4,
              borderTop: `3px dashed ${C.creamLo}`,
              opacity: 0.6,
            }}
          />

          {/* Barisan mobil kertas di jalur bawah: hanya 2 yang ditinggal kosong, sisanya merapat & tetap penuh */}
          {bottomCars.map((car, idx) => {
            // Gerak rayap stop-motion sangat pelan pada barisan macet
            const creep = Math.sin(sf * 0.04 + idx * 0.7) * 2.5;
            if (car.leaves) {
              // Segelintir mobil (2 unit) menepi ke saku atas dan ditinggal kosong tanpa pengemudi
              const parkY = interpolate(fewCarsLeaveU, [0, 1], [ROAD_RAIL_Y + 14, STAGE_FLOOR_Y + 38], CLAMP);
              const parkX = car.baseX + interpolate(fewCarsLeaveU, [0, 1], [0, -14], CLAMP);
              return (
                <PaperCar
                  key={idx}
                  x={parkX}
                  y={parkY}
                  s={0.78}
                  bodyColor={car.color}
                  shadeColor={car.shade}
                  empty={fewCarsLeaveU > 0.45}
                />
              );
            }

            // Mobil-mobil lain langsung merapat menutup celah sehingga jalur jalan tetap padat
            const closeGapShift =
              idx > 2 && idx < 6
                ? -46 * fewCarsLeaveU
                : idx >= 6
                  ? -88 * fewCarsLeaveU
                  : 22 * fewCarsLeaveU;

            return (
              <PaperCar
                key={idx}
                x={car.baseX + closeGapShift + creep}
                y={ROAD_RAIL_Y + 14}
                s={0.92}
                bodyColor={car.color}
                shadeColor={car.shade}
              />
            );
          })}

          {/* Dua mobil tambahan yang masuk dari kanan saat celah merapat agar barisan tetap penuh sampai tepi */}
          {fewCarsLeaveU > 0.05 ? (
            <>
              <PaperCar
                x={1268 - 96 * fewCarsLeaveU}
                y={ROAD_RAIL_Y + 14}
                s={0.92}
                bodyColor={ROOM.teal}
                shadeColor="#1D3B3B"
              />
              <PaperCar
                x={1366 - 96 * fewCarsLeaveU}
                y={ROAD_RAIL_Y + 14}
                s={0.92}
                bodyColor={C.hero}
                shadeColor={C.heroLo}
              />
            </>
          ) : null}
        </AbsoluteFill>

        {/* LAPISAN 3: Bingkai Proscenium & Gorden Kertas Teater Halte Pagi (paralaks 1.15x) */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX * 1.15}px, ${camY * 1.15}px) scale(${1 + (camScale - 1) * 1.12})`,
            transformOrigin: '640px 360px',
            pointerEvents: 'none',
          }}
        >
          {/* Pelmet atas panggung kertas */}
          <Paper lift={8}>
            <Slab x={-40} y={-18} w={1360} h={34} color={C.woodLo} shade="#24150B" shadeH={0.4} r={0} />
          </Paper>

          {/* Gorden kertas kiri & kanan (tersibak lembut di awal adegan) */}
          <Paper lift={8}>
            <Slab
              x={-50 - curtainOpen * 42}
              y={-20}
              w={112}
              h={760}
              color={ROOM.terracotta}
              shade="#6D3927"
              shadeH={0.14}
              r={0}
              grain={0.6}
            />
            <Slab
              x={38 - curtainOpen * 42}
              y={-20}
              w={28}
              h={760}
              color={C.tag}
              r={0}
            />
          </Paper>

          <Paper lift={8}>
            <Slab
              x={1218 + curtainOpen * 42}
              y={-20}
              w={112}
              h={760}
              color={ROOM.terracotta}
              shade="#6D3927"
              shadeH={0.14}
              r={0}
              grain={0.6}
            />
            <Slab
              x={1214 + curtainOpen * 42}
              y={-20}
              w={28}
              h={760}
              color={C.tag}
              r={0}
            />
          </Paper>
        </AbsoluteFill>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};
