// Adegan D08: "Angka yang Tidak Ikut Berubah" — tiga kartu data nyata tetap tegak saat pita label kurs melintas.
// Menampilkan pertumbuhan ekonomi, inflasi, dan suku bunga tertahan serta pabrik dan sawah yang tidak bertambah.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export const D08_DUR = 794;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const lerpColor = (t: number, from: readonly [number, number, number], to: readonly [number, number, number]) => {
  const u = Math.max(0, Math.min(1, t));
  const r = Math.round(from[0] + (to[0] - from[0]) * u);
  const g = Math.round(from[1] + (to[1] - from[1]) * u);
  const b = Math.round(from[2] + (to[2] - from[2]) * u);
  return `rgb(${r}, ${g}, ${b})`;
};

const SpotlightCircle: React.FC<{cx: number; cy: number; r: number; opacity: number}> = ({cx, cy, r, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `3px dashed rgba(200, 155, 74, ${0.55 * opacity})`,
        background: `radial-gradient(circle, rgba(243, 165, 59, ${0.24 * opacity}) 0%, rgba(243, 165, 59, ${0.07 * opacity}) 68%, rgba(243, 165, 59, 0) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

const TreeIcon: React.FC<{cx: number; baseY: number; growT: number}> = ({cx, baseY, growT}) => {
  const tierScale = interpolate(growT, [0, 1], [0.76, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const topCrownScale = interpolate(growT, [0.25, 1], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.2))});
  return (
    <div style={{position: 'absolute', left: cx - 75, top: baseY - 175, width: 150, height: 175}}>
      <Paper lift={4}>
        {/* Pot kertas terakota */}
        <Slab x={47} y={132} w={56} h={42} color={C.hero} shade={C.heroLo} shadeH={0.22} r="4px 4px 12px 12px" />
        <Slab x={42} y={124} w={66} h={12} color="#E08163" shade={C.heroLo} shadeH={0.3} r={4} />
        {/* Batang pohon */}
        <div
          style={{
            position: 'absolute',
            left: 69,
            top: 66,
            width: 12,
            height: 62,
            background: C.wood,
            borderRadius: 4,
            transformOrigin: '50% 100%',
            transform: `scaleY(${tierScale})`,
          }}
        />
        {/* Tajuk daun lapis bawah & tengah */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 150,
            height: 130,
            transformOrigin: '75px 124px',
            transform: `scale(${tierScale})`,
          }}
        >
          <Slab x={24} y={54} w={102} h={52} color={C.sageLo} shade="#4D5B4A" shadeH={0.22} r={26} />
          <Slab x={34} y={32} w={82} h={46} color={C.sage} shade={C.sageLo} shadeH={0.2} r={24} />
        </div>
        {/* Tajuk tumbuh satu tingkat di puncak */}
        <div
          style={{
            position: 'absolute',
            left: 44,
            top: 8,
            width: 62,
            height: 42,
            transformOrigin: '31px 38px',
            transform: `scale(${topCrownScale})`,
            opacity: topCrownScale,
          }}
        >
          <Slab x={0} y={0} w={62} h={40} color="#9FB19A" shade={C.sage} shadeH={0.22} r={20} />
        </div>
      </Paper>
    </div>
  );
};

const BasketIcon: React.FC<{cx: number; baseY: number; tagLiftT: number}> = ({cx, baseY, tagLiftT}) => {
  const tagDy = interpolate(tagLiftT, [0, 1], [0, -18], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const tagRot = interpolate(tagLiftT, [0, 1], [-4, 5], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: cx - 85, top: baseY - 170, width: 170, height: 170}}>
      <Paper lift={4}>
        {/* Isi belanjaan polos tanpa tulisan */}
        <Slab x={42} y={62} w={24} h={56} color={C.brass} shade={C.brassLo} shadeH={0.2} r={12} rot={-12} />
        <Slab x={68} y={54} w={30} h={60} color={C.sage} shade={C.sageLo} shadeH={0.2} r={14} rot={4} />
        <Slab x={100} y={66} w={22} h={52} color={C.hero} shade={C.heroLo} shadeH={0.2} r={8} rot={10} />
        {/* Badan keranjang anyaman kertas */}
        <Slab x={30} y={98} w={110} h={66} color={C.woodHi} shade={C.wood} shadeH={0.22} r="6px 6px 20px 20px" />
        <Slab x={24} y={90} w={122} h={14} color={C.brass} shade={C.brassLo} shadeH={0.3} r={6} />
        {[114, 132, 150].map((ly) => (
          <div
            key={ly}
            style={{
              position: 'absolute',
              left: 36,
              top: ly,
              width: 98,
              height: 3,
              background: C.woodLo,
              opacity: 0.45,
              borderRadius: 2,
            }}
          />
        ))}
        {/* Tali dan tag harga polos yang naik sedikit */}
        <div
          style={{
            position: 'absolute',
            left: 126,
            top: 52 + tagDy,
            transformOrigin: '0% 100%',
            transform: `rotate(${tagRot}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: -8, top: 24, width: 16, height: 2, background: C.inkSoft, rotate: '28deg'}} />
          <div
            style={{
              width: 38,
              height: 24,
              background: C.creamHi,
              border: `2px solid ${C.inkSoft}`,
              borderRadius: 4,
              boxShadow: '1px 3px 5px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{position: 'absolute', left: 5, top: 9, width: 5, height: 5, borderRadius: '50%', background: C.inkSoft}} />
          </div>
        </div>
      </Paper>
    </div>
  );
};

const RatePedestalIcon: React.FC<{cx: number; baseY: number; lampT: number}> = ({cx, baseY, lampT}) => {
  const glow = interpolate(lampT, [0, 1], [0, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left: cx - 85, top: baseY - 165, width: 170, height: 165}}>
      <Paper lift={4}>
        {/* Tiga balok penyeimbang datar */}
        <Slab x={34} y={132} w={102} h={28} color={C.wood} shade={C.woodLo} shadeH={0.25} r={5} />
        <Slab x={48} y={102} w={74} h={28} color={C.creamLo} shade="#A79988" shadeH={0.22} r={5} />
        <Slab x={64} y={74} w={42} h={26} color={C.sage} shade={C.sageLo} shadeH={0.25} r={6} />
        {/* Indikator kecil di atas tumpukan */}
        <div
          style={{
            position: 'absolute',
            left: 77,
            top: 50,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: glow > 0.2 ? '#7C9A6E' : C.creamLo,
            border: `2px solid ${C.inkSoft}`,
            boxShadow: glow > 0.2 ? `0 0 ${14 * glow}px rgba(124, 154, 110, 0.85)` : 'none',
          }}
        />
      </Paper>
    </div>
  );
};

const CentralBankMechanism: React.FC<{lampT: number}> = ({lampT}) => {
  const glow = interpolate(lampT, [0, 1], [0, 1], CLAMP);
  return (
    <div style={{position: 'relative', width: 276, height: 196}}>
      {/* Siluet gedung bank sentral kecil tanpa teks */}
      <div style={{position: 'absolute', left: 12, top: 34, width: 124, height: 136}}>
        {/* Atap segitiga (pediment) */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 0,
            width: 116,
            height: 34,
            background: C.creamLo,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <Slab x={8} y={34} w={108} h={10} color={C.woodHi} r={2} />
        {/* Empat pilar kertas */}
        {[18, 42, 68, 92].map((px) => (
          <Slab key={px} x={px} y={46} w={12} h={68} color={C.cream} shade={C.creamLo} shadeH={0.15} r={2} />
        ))}
        {/* Tangga dasar */}
        <Slab x={10} y={114} w={104} h={10} color={C.woodHi} r={2} />
        <Slab x={4} y={124} w={116} h={12} color={C.wood} r={2} />
      </div>

      {/* Kotak tuas + lampu indikator hijau zaitun */}
      <div style={{position: 'absolute', left: 152, top: 24, width: 112, height: 148}}>
        <Slab x={0} y={0} w={112} h={148} color={C.cream} shade={C.creamLo} shadeH={0.12} r={10} />
        {/* Lampu hijau zaitun menyala */}
        <div
          style={{
            position: 'absolute',
            left: 42,
            top: 14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: lerpColor(glow, [160, 155, 145], [118, 148, 102]),
            border: `3px solid ${C.inkSoft}`,
            boxShadow: `0 0 ${18 * glow}px rgba(126, 156, 108, ${0.85 * glow})`,
          }}
        />
        {/* Celah vertikal tuas */}
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 54,
            width: 14,
            height: 76,
            borderRadius: 7,
            background: C.board,
          }}
        />
        {/* Tanda takik tengah (posisi ditahan) */}
        <div style={{position: 'absolute', left: 22, top: 90, width: 8, height: 4, background: C.inkSoft, borderRadius: 2}} />
        <div style={{position: 'absolute', left: 52, top: 90, width: 8, height: 4, background: C.inkSoft, borderRadius: 2}} />
        {/* Lengan tuas horizontal tepat di tengah */}
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 86,
            width: 46,
            height: 12,
            borderRadius: 6,
            background: C.brass,
            border: `2px solid ${C.inkSoft}`,
          }}
        />
        {/* Tangan kertas menahan tuas di posisi tengah */}
        <div
          style={{
            position: 'absolute',
            left: 68,
            top: 78,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: C.creamHi,
            border: `3px solid ${C.inkSoft}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 83,
            width: 34,
            height: 18,
            borderRadius: 6,
            background: C.hero,
            border: `2px solid ${C.inkSoft}`,
          }}
        />
      </div>
    </div>
  );
};

const FactorySet: React.FC<{tracingT: number}> = ({tracingT}) => {
  const f = useCurrentFrame();
  const smoke1Y = ((f * 0.45) % 42);
  const smoke2Y = (((f + 21) * 0.45) % 42);
  const overlayOpacity = interpolate(tracingT, [0, 1], [0, 1], CLAMP);
  const overlayLift = interpolate(tracingT, [0, 1], [-14, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const crates = [
    {x: 248, y: 742, w: 66, h: 66},
    {x: 324, y: 742, w: 66, h: 66},
    {x: 286, y: 678, w: 66, h: 64},
  ];

  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      <Paper lift={6}>
        {/* Cerobong asap pabrik */}
        <Slab x={196} y={435} w={34} h={145} color={C.heroLo} shade="#7B3A26" shadeH={0.25} r="4px 4px 0 0" />
        <Slab x={190} y={428} w={46} h={12} color={C.woodLo} r={3} />
        {/* Kepulan asap kertas tipis & tenang */}
        <div
          style={{
            position: 'absolute',
            left: 202,
            top: 396 - smoke1Y,
            width: 22,
            height: 16,
            borderRadius: '50%',
            background: C.cream,
            opacity: interpolate(smoke1Y, [0, 20, 42], [0.7, 0.5, 0], CLAMP),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 212,
            top: 392 - smoke2Y,
            width: 28,
            height: 18,
            borderRadius: '50%',
            background: C.creamHi,
            opacity: interpolate(smoke2Y, [0, 20, 42], [0.65, 0.45, 0], CLAMP),
          }}
        />

        {/* Atap gigi gergaji (sawtooth roof) */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 176 + i * 102,
              top: 522,
              width: 106,
              height: 48,
              background: C.hero,
              clipPath: 'polygon(0% 100%, 0% 14%, 100% 100%)',
            }}
          />
        ))}

        {/* Badan gedung pabrik */}
        <Slab x={176} y={568} w={312} h={240} color={C.cream} shade={C.creamLo} shadeH={0.14} r="4px 4px 0 0" />
        <Slab x={170} y={562} w={324} h={14} color={C.wood} shade={C.woodLo} shadeH={0.3} r={3} />

        {/* Jendela pabrik hangat */}
        {[202, 268, 334, 400].map((wx) => (
          <div
            key={wx}
            style={{
              position: 'absolute',
              left: wx,
              top: 596,
              width: 44,
              height: 54,
              borderRadius: '18px 18px 3px 3px',
              background: '#E8B858',
              border: `3px solid ${C.wood}`,
            }}
          />
        ))}

        {/* Pintu gudang pabrik */}
        <Slab x={392} y={692} w={74} h={116} color={C.wood} shade={C.woodLo} shadeH={0.2} r="6px 6px 0 0" />

        {/* Tiga peti hasil polos di depan pabrik */}
        {crates.map((c, idx) => (
          <div key={idx}>
            <Slab x={c.x} y={c.y} w={c.w} h={c.h} color={C.brass} shade={C.brassLo} shadeH={0.2} r={5} />
            <div
              style={{
                position: 'absolute',
                left: c.x + 8,
                top: c.y + 8,
                width: c.w - 16,
                height: c.h - 16,
                border: `2px solid ${C.woodLo}`,
                borderRadius: 3,
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: c.x + 8,
                top: c.y + c.h / 2 - 1,
                width: c.w - 16,
                height: 3,
                background: C.woodLo,
                opacity: 0.5,
              }}
            />
          </div>
        ))}

        {/* Kembaran kalkir: salinan tembus pandang menumpuk persis di atas 3 peti */}
        {overlayOpacity > 0.01 &&
          crates.map((c, idx) => (
            <div
              key={`kalkir-crate-${idx}`}
              style={{
                position: 'absolute',
                left: c.x,
                top: c.y + overlayLift,
                width: c.w,
                height: c.h,
                borderRadius: 5,
                background: 'rgba(255, 252, 245, 0.52)',
                border: '2px solid rgba(255, 255, 255, 0.88)',
                boxShadow: '2px 4px 10px rgba(28, 27, 23, 0.16)',
                opacity: overlayOpacity,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: 14,
                  height: 14,
                  background: 'rgba(232, 223, 211, 0.85)',
                  clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                }}
              />
            </div>
          ))}
      </Paper>
    </div>
  );
};

const RiceFieldSet: React.FC<{tracingT: number}> = ({tracingT}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 26) * 2.2;
  const overlayOpacity = interpolate(tracingT, [0, 1], [0, 1], CLAMP);
  const overlayLift = interpolate(tracingT, [0, 1], [-14, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const stalkPositions = [
    {x: 695, y: 692, h: 46},
    {x: 735, y: 690, h: 48},
    {x: 775, y: 694, h: 44},
    {x: 815, y: 688, h: 50},
    {x: 855, y: 692, h: 46},
    {x: 895, y: 690, h: 48},
    {x: 935, y: 693, h: 45},
    {x: 975, y: 689, h: 49},
    {x: 1015, y: 692, h: 46},
    {x: 715, y: 742, h: 52},
    {x: 760, y: 740, h: 54},
    {x: 805, y: 744, h: 50},
    {x: 850, y: 739, h: 55},
    {x: 895, y: 742, h: 52},
    {x: 940, y: 740, h: 54},
    {x: 985, y: 743, h: 51},
    {x: 1030, y: 741, h: 53},
  ];

  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      <Paper lift={5}>
        {/* Bukit kertas lembut di kejauhan sawah */}
        <div
          style={{
            position: 'absolute',
            left: 650,
            top: 575,
            width: 260,
            height: 110,
            borderRadius: '140px 140px 0 0',
            background: C.sage,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 830,
            top: 590,
            width: 265,
            height: 100,
            borderRadius: '140px 140px 0 0',
            background: C.sageLo,
          }}
        />

        {/* Petak teras sawah berundak */}
        <Slab x={655} y={662} w={425} h={52} color="#8A9A86" shade="#6F806B" shadeH={0.25} r="28px 28px 0 0" />
        <Slab x={645} y={708} w={445} h={52} color="#768872" shade="#5D6E59" shadeH={0.25} r="24px 24px 0 0" />
        <Slab x={635} y={754} w={465} h={54} color="#647660" shade="#4E5E4A" shadeH={0.25} r="20px 20px 0 0" />

        {/* Rumpun padi kuning keemasan (jumlah tetap, tidak bertambah) */}
        {stalkPositions.map((st, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: st.x,
              top: st.y,
              width: 26,
              height: st.h,
              transformOrigin: '13px 100%',
              transform: `rotate(${sway + (idx % 3 - 1) * 1.4}deg)`,
            }}
          >
            {/* Batang hijau */}
            <div style={{position: 'absolute', left: 11, top: 10, width: 4, height: st.h - 10, background: '#586B4E', borderRadius: 2}} />
            <div style={{position: 'absolute', left: 5, top: 18, width: 3, height: st.h - 20, background: '#687C5C', borderRadius: 2, rotate: '-14deg'}} />
            <div style={{position: 'absolute', left: 18, top: 18, width: 3, height: st.h - 20, background: '#687C5C', borderRadius: 2, rotate: '14deg'}} />
            {/* Bulir padi kuning madu menunduk */}
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 2,
                width: 14,
                height: 16,
                borderRadius: '50% 50% 40% 40%',
                background: '#DFB14B',
                rotate: '18deg',
              }}
            />
          </div>
        ))}

        {/* Kembaran kalkir di atas petak padi: panen tetap sama */}
        {overlayOpacity > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: 668,
              top: 676 + overlayLift,
              width: 396,
              height: 118,
              borderRadius: 14,
              background: 'rgba(255, 252, 245, 0.44)',
              border: '2px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '2px 5px 12px rgba(28, 27, 23, 0.14)',
              opacity: overlayOpacity,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 20,
                height: 20,
                background: 'rgba(232, 223, 211, 0.85)',
                clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
              }}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

const WarungForeground: React.FC = () => {
  const f = useCurrentFrame();
  const steam1 = (f * 0.55) % 44;
  const steam2 = ((f + 22) * 0.55) % 44;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Kait kayu di tiang kiri + syal kertas terakota (penanda tokoh "kamu" di dunia warung) */}
      <Paper lift={8}>
        <Slab x={56} y={335} w={22} h={16} color={C.woodLo} r={4} />
        <Boil seed="scarf-hang" amp={0.4} rot={0.05}>
          <div style={{position: 'absolute', left: 54, top: 344, width: 34, height: 158}}>
            <Slab x={4} y={0} w={24} h={134} color={C.hero} shade={C.heroLo} shadeH={0.18} r="10px 10px 4px 4px" rot={-2} />
            <Slab x={10} y={14} w={22} h={128} color="#E07E60" shade={C.hero} shadeH={0.2} r="8px 8px 4px 4px" rot={3} />
            {/* Rumbai kertas di ujung syal */}
            {[6, 14, 22].map((fx) => (
              <div key={fx} style={{position: 'absolute', left: fx, top: 136, width: 3, height: 16, background: C.heroLo, borderRadius: 2}} />
            ))}
          </div>
        </Boil>
      </Paper>

      {/* Meja sudut warung & gelas kopi kertas dengan uap tipis */}
      <Paper lift={10}>
        <Slab x={-16} y={646} w={156} h={90} color={C.wood} shade={C.woodLo} shadeH={0.22} r="0 14px 0 0" />
        <Slab x={-16} y={638} w={164} h={14} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r="0 8px 4px 0" />

        {/* Gelas kopi kertas */}
        <div style={{position: 'absolute', left: 46, top: 576, width: 54, height: 64}}>
          {/* Uap kopi tipis melayang tenang */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -8 - steam1,
              width: 10,
              height: 18,
              borderRadius: '50%',
              borderLeft: '3px solid rgba(255, 250, 240, 0.72)',
              opacity: interpolate(steam1, [0, 18, 44], [0, 0.75, 0], CLAMP),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: -6 - steam2,
              width: 10,
              height: 18,
              borderRadius: '50%',
              borderRight: '3px solid rgba(255, 250, 240, 0.68)',
              opacity: interpolate(steam2, [0, 18, 44], [0, 0.7, 0], CLAMP),
            }}
          />
          <Slab x={6} y={8} w={42} h={54} color={C.creamHi} shade={C.creamLo} shadeH={0.2} r="4px 4px 10px 10px" />
          <Slab x={8} y={24} w={38} h={20} color={C.hero} shade={C.heroLo} shadeH={0.2} r={2} />
          <Slab x={2} y={2} w={50} h={9} color={C.cream} shade={C.creamLo} shadeH={0.35} r={4} />
        </div>
      </Paper>
    </div>
  );
};

export const D08: React.FC = () => {
  const f = useCurrentFrame();

  // --- KAMERA TEATER KERTAS (tanpa potongan: dolly-in, pull-out, pan halus, tilt turun) ---
  // Beat 1 (rel 0-193): dolly-in pelan ke Kartu 1
  const dollyBeat1 = interpolate(f, [12, 178], [1.0, 1.14], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const panXBeat1 = interpolate(f, [12, 178], [0, 34], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  // Beat 2 (rel 193-358): pull-out ke papan skor & pan ringan
  const dollyBeat2 = interpolate(f, [193, 234], [1.14, 1.0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const panXBeat2 = interpolate(f, [193, 234], [34, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});

  // Beat 3-4 (rel 399-620): drift halus menyusur papan skor
  const panXBeat3 = interpolate(f, [399, 460, 541, 615], [0, -14, -14, 0], {...CLAMP, easing: Easing.inOut(Easing.sin)});

  // Beat 5 (rel 622-794): tilt turun ke pabrik & sawah, geser sedikit ke pabrik lalu ke pose akhir lebar
  const tiltYBeat5 = interpolate(f, [622, 656], [0, -212], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const panXBeat5 = interpolate(f, [656, 704, 726, 770], [0, 32, 32, 0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const zoomBeat5 = interpolate(f, [656, 704, 726, 770], [1.0, 1.04, 1.04, 1.0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

  const camScale = f < 193 ? dollyBeat1 : f < 622 ? dollyBeat2 : zoomBeat5;
  const camX = f < 193 ? panXBeat1 : f < 399 ? panXBeat2 : f < 622 ? panXBeat3 : panXBeat5;
  const camY = tiltYBeat5;

  // --- POSISI & KEMUNCULAN KARTU DATA (scene 090-093, keluar rapi sebelum tilt di frame 641) ---
  const card1EnterX = interpolate(f, [4, 30], [-420, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const card1SlotX = interpolate(f, [193, 228], [580, 290], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const card1Cx = card1SlotX + card1EnterX;

  const card2EnterX = interpolate(f, [198, 228], [680, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const card2Cx = 640 + card2EnterX;

  const card3EnterX = interpolate(f, [399, 430], [520, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const card3Cx = 990 + card3EnterX;

  // Kartu menggulung keluar rapi ke atas setelah pita label selesai melintas (f = 620..639, selesai sebelum tilt)
  const cardsRetractY = interpolate(f, [620, 639], [0, -640], {...CLAMP, easing: Easing.in(Easing.cubic)});
  const cardsVisible = f <= 640;

  // --- IKON BAWAH KARTU ---
  const treeGrowT = interpolate(f, [72, 132], [0, 1], CLAMP);
  const basketTagLiftT = interpolate(f, [262, 314], [0, 1], CLAMP);
  const bankLampT = interpolate(f, [424, 456], [0, 1], CLAMP);

  // Lingkaran sorot lembut untuk tiap beat
  const spot1Opacity =
    interpolate(f, [66, 82], [0, 1], CLAMP) * interpolate(f, [182, 198], [1, 0], CLAMP);
  const spot2Opacity =
    interpolate(f, [256, 272], [0, 1], CLAMP) * interpolate(f, [352, 372], [1, 0], CLAMP);
  const spot3Opacity =
    interpolate(f, [420, 436], [0, 1], CLAMP) * interpolate(f, [495, 515], [1, 0], CLAMP);
  const spotFactoryOpacity =
    interpolate(f, [660, 678], [0, 1], CLAMP) * interpolate(f, [718, 735], [1, 0], CLAMP);
  const spotRiceOpacity =
    interpolate(f, [732, 750], [0, 1], CLAMP) * interpolate(f, [766, 782], [1, 0.35], CLAMP);

  // --- PITA LABEL KOSONG (melintas di atas kartu pada scene 093, lalu berganti warna di atas pabrik/sawah pada scene 094-095) ---
  const ribbonSlideUpper = interpolate(f, [541, 588], [-980, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const ribbonDropForLower = interpolate(f, [622, 656], [46, 272], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const ribbonVisible = f >= 541;

  // Pergantian warna pita: terakota -> biru senja (Beat 4), lalu terakota -> biru senja lagi (Beat 5)
  const terracottaRGB: readonly [number, number, number] = [201, 87, 60];
  const duskBlueRGB: readonly [number, number, number] = [93, 120, 150];
  const ribbonColorT =
    f < 645
      ? interpolate(f, [574, 602], [0, 1], CLAMP)
      : f < 664
      ? interpolate(f, [645, 662], [1, 0], CLAMP)
      : interpolate(f, [664, 692], [0, 1], CLAMP);
  const ribbonBg = lerpColor(ribbonColorT, terracottaRGB, duskBlueRGB);
  const ribbonShade = lerpColor(ribbonColorT, [160, 64, 42], [68, 92, 118]);

  // --- KEMBARAN KALKIR PADA PABRIK (scene 094) DAN SAWAH (scene 095) ---
  const factoryTracingT = interpolate(f, [664, 696], [0, 1], CLAMP);
  const riceTracingT = interpolate(f, [738, 770], [0, 1], CLAMP);

  // Shift biru senja halus pada latar saat pita berubah warna
  const duskAmbience =
    f < 645
      ? interpolate(f, [574, 605], [0, 0.16], CLAMP)
      : interpolate(f, [664, 695], [0.05, 0.16], CLAMP);

  const CARD_W = 318;
  const CARD_H = 248;
  const CARD_Y = 134;

  return (
    <AbsoluteFill style={{backgroundColor: C.creamHi, overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* LAPISAN 1: LATAR BELAKANG TEATER (paralaks pelan 0.35x) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '640px 360px',
            transform: `translate(${camX * 0.35}px, ${camY * 0.35}px) scale(${1 + (camScale - 1) * 0.45})`,
          }}
        >
          <Slab x={-180} y={-140} w={1640} h={1080} color={C.creamHi} r={0} grain={0.55} />
          {/* Nuansa biru senja lembut saat pita label berganti warna */}
          <div
            style={{
              position: 'absolute',
              inset: -140,
              backgroundColor: ROOM.dusk,
              opacity: duskAmbience,
              pointerEvents: 'none',
            }}
          />
          {/* Cahaya lampu sorot kuning madu dari atas */}
          <div
            style={{
              position: 'absolute',
              inset: -140,
              background:
                'radial-gradient(ellipse at 50% 24%, rgba(255, 224, 150, 0.34) 0%, rgba(243, 165, 59, 0.12) 48%, rgba(28, 27, 23, 0.24) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Garis panel dinding panggung kertas */}
          {[220, 440, 640, 840, 1060].map((lx) => (
            <div
              key={lx}
              style={{
                position: 'absolute',
                left: lx,
                top: -100,
                width: 2,
                height: 1000,
                background: C.creamLo,
                opacity: 0.45,
              }}
            />
          ))}
        </div>

        {/* LAPISAN 2: PANGGUNG TENGAH (paralaks 1.0x — lantai, kartu, pabrik, sawah, pita label) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '640px 360px',
            transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          }}
        >
          {/* Lantai panggung atas (untuk ikon kartu Beat 1-3) */}
          <Slab x={-160} y={592} w={1600} h={34} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          <Slab x={-160} y={624} w={1600} h={184} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -160, right: -160, top: 664, height: 3, background: C.floorLo, opacity: 0.8}} />

          {/* Lantai panggung bawah (untuk pabrik & sawah Beat 5) */}
          <Slab x={-160} y={806} w={1600} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          <Slab x={-160} y={834} w={1600} h={220} color={C.floor} r={0} grain={0.6} />
          <div style={{position: 'absolute', left: -160, right: -160, top: 874, height: 3, background: C.floorLo, opacity: 0.8}} />

          {/* Lingkaran sorot lembut */}
          <SpotlightCircle cx={card1Cx} cy={494} r={108} opacity={spot1Opacity} />
          <SpotlightCircle cx={card2Cx} cy={494} r={108} opacity={spot2Opacity} />
          <SpotlightCircle cx={card3Cx} cy={494} r={108} opacity={spot3Opacity} />
          <SpotlightCircle cx={326} cy={742} r={134} opacity={spotFactoryOpacity} />
          <SpotlightCircle cx={865} cy={732} r={168} opacity={spotRiceOpacity} />

          {/* SET BAWAH: PABRIK KERTAS (kiri) & SAWAH KERTAS (kanan) */}
          <FactorySet tracingT={factoryTracingT} />
          <RiceFieldSet tracingT={riceTracingT} />

          {/* SET ATAS: TIGA KARTU DATA BERBINGKAI TEGAS + IKON BAWAHNYA */}
          {cardsVisible && (
            <div style={{position: 'absolute', inset: 0, transform: `translateY(${cardsRetractY}px)`}}>
              {/* Ikon bawah kartu */}
              {f >= 4 && <TreeIcon cx={card1Cx} baseY={592} growT={treeGrowT} />}
              {f >= 198 && <BasketIcon cx={card2Cx} baseY={592} tagLiftT={basketTagLiftT} />}
              {f >= 399 && <RatePedestalIcon cx={card3Cx} baseY={592} lampT={bankLampT} />}

              {/* KARTU 1 (Scene 090) — bingkai garis TEGAS */}
              <div
                style={{
                  position: 'absolute',
                  left: card1Cx - CARD_W / 2,
                  top: CARD_Y,
                  width: CARD_W,
                  height: CARD_H,
                }}
              >
                <Boil seed="card-1" amp={0.4} rot={0.05}>
                  <div
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      backgroundColor: '#F5EFE6',
                      border: `4px solid ${C.ink}`,
                      borderRadius: 10,
                      boxSizing: 'border-box',
                      boxShadow: '3px 8px 14px rgba(28, 27, 23, 0.28)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px 18px',
                    }}
                  >
                    {/* String 1: TRIWULAN III 2026 */}
                    {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                      <div
                        style={{
                        opacity: interpolate(f, [10, 20], [0, 1], CLAMP),
                          backgroundColor: C.board,
                          color: '#F5EFE6',
                          fontFamily: FONT.label,
                          fontWeight: 800,
                          fontSize: 19,
                          letterSpacing: '0.06em',
                          padding: '7px 16px',
                          borderRadius: 5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        TRIWULAN III 2026
                      </div>

                    {/* String 2: EKONOMI TUMBUH 5,47% (utuh sekaligus) */}
                    {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                      <div
                        style={{
                        opacity: interpolate(f, [66, 76], [0, 1], CLAMP),
                          fontFamily: FONT.caption,
                          fontWeight: 900,
                          fontSize: 30,
                          lineHeight: 1.15,
                          color: C.ink,
                          textAlign: 'center',
                        }}
                      >
                        EKONOMI TUMBUH 5,47%
                      </div>

                    {/* String 3: DIBANDING TAHUN SEBELUMNYA (huruf kecil di bawah) */}
                    {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                      <div
                        style={{
                        opacity: interpolate(f, [132, 142], [0, 1], CLAMP),
                          borderTop: `2px solid ${C.creamLo}`,
                          paddingTop: 8,
                          fontFamily: FONT.label,
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: '0.04em',
                          color: C.inkSoft,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        DIBANDING TAHUN SEBELUMNYA
                      </div>
                  </div>
                </Boil>
              </div>

              {/* KARTU 2 (Scene 091) — bingkai garis TEGAS */}
              {f >= 198 && (
                <div
                  style={{
                    position: 'absolute',
                    left: card2Cx - CARD_W / 2,
                    top: CARD_Y,
                    width: CARD_W,
                    height: CARD_H,
                  }}
                >
                  <Boil seed="card-2" amp={0.4} rot={0.05}>
                    <div
                      style={{
                        width: CARD_W,
                        height: CARD_H,
                        backgroundColor: '#F5EFE6',
                        border: `4px solid ${C.ink}`,
                        borderRadius: 10,
                        boxSizing: 'border-box',
                        boxShadow: '3px 8px 14px rgba(28, 27, 23, 0.28)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 18px 20px',
                      }}
                    >
                      {/* String 1: OKTOBER 2026 */}
                      {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                        <div
                          style={{
                          opacity: interpolate(f, [206, 216], [0, 1], CLAMP),
                            backgroundColor: C.board,
                            color: '#F5EFE6',
                            fontFamily: FONT.label,
                            fontWeight: 800,
                            fontSize: 19,
                            letterSpacing: '0.06em',
                            padding: '7px 18px',
                            borderRadius: 5,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          OKTOBER 2026
                        </div>

                      {/* String 2: INFLASI 3,23% SETAHUN (utuh sekaligus) */}
                      {/* QA Clover: fade, bukan PopIn — PopIn absolute inset:0 menumpuk semua teks di atas kartu flex. */}
                        <div
                          style={{
                          opacity: interpolate(f, [256, 266], [0, 1], CLAMP),
                            fontFamily: FONT.caption,
                            fontWeight: 900,
                            fontSize: 31,
                            lineHeight: 1.16,
                            color: C.ink,
                            textAlign: 'center',
                          }}
                        >
                          INFLASI 3,23% SETAHUN
                        </div>

                      {/* Aksen garis dekorasi bawah tanpa teks */}
                      <div style={{width: '72%', height: 4, borderRadius: 2, backgroundColor: C.creamLo}} />
                    </div>
                  </Boil>
                </div>
              )}

              {/* KARTU 3 (Scene 092) — bingkai garis TEGAS, TANPA TEKS & TANPA ANGKA */}
              {f >= 399 && (
                <div
                  style={{
                    position: 'absolute',
                    left: card3Cx - CARD_W / 2,
                    top: CARD_Y,
                    width: CARD_W,
                    height: CARD_H,
                  }}
                >
                  <Boil seed="card-3" amp={0.4} rot={0.05}>
                    <div
                      style={{
                        width: CARD_W,
                        height: CARD_H,
                        backgroundColor: '#F5EFE6',
                        border: `4px solid ${C.ink}`,
                        borderRadius: 10,
                        boxSizing: 'border-box',
                        boxShadow: '3px 8px 14px rgba(28, 27, 23, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                      }}
                    >
                      <CentralBankMechanism lampT={bankLampT} />
                    </div>
                  </Boil>
                </div>
              )}
            </div>
          )}

          {/* PITA LABEL KOSONG BESAR DI ATAS KARTU / DI ATAS PABRIK & SAWAH */}
          {ribbonVisible && (
            <div
              style={{
                position: 'absolute',
                left: 170 + ribbonSlideUpper,
                top: ribbonDropForLower,
                width: 940,
                height: 54,
                pointerEvents: 'none',
              }}
            >
              {/* Tali penggantung kertas */}
              <div style={{position: 'absolute', left: 90, top: -90, width: 3, height: 94, background: C.tape}} />
              <div style={{position: 'absolute', right: 90, top: -90, width: 3, height: 94, background: C.tape}} />
              <Boil seed="ribbon-label" amp={0.4} rot={0.05}>
                <div style={{position: 'relative', width: 940, height: 54}}>
                  {/* Ujung pita kiri & kanan */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -26,
                      top: 8,
                      width: 44,
                      height: 46,
                      background: ribbonShade,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 28% 50%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: -26,
                      top: 8,
                      width: 44,
                      height: 46,
                      background: ribbonShade,
                      clipPath: 'polygon(0 0, 100% 0, 72% 50%, 100% 100%, 0 100%)',
                    }}
                  />
                  {/* Badan utama pita label kosong */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: ribbonBg,
                      borderRadius: 6,
                      boxShadow: '0 6px 14px rgba(28, 27, 23, 0.28)',
                      border: '2px solid rgba(255, 248, 236, 0.35)',
                    }}
                  >
                    {/* Lubang keling kuningan polos di kedua ujung pita */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 18,
                        top: 20,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: C.brass,
                        border: `2px solid ${C.inkSoft}`,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: 18,
                        top: 20,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: C.brass,
                        border: `2px solid ${C.inkSoft}`,
                      }}
                    />
                  </div>
                </div>
              </Boil>
            </div>
          )}
        </div>

        {/* LAPISAN 3: TIRAI TEATER TERAKOTA & LENGKUNG PANGGUNG ATAS */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            transformOrigin: '640px 360px',
            transform: `translate(${camX * 0.2}px, 0px) scale(${1 + (camScale - 1) * 0.2})`,
          }}
        >
          <Paper lift={12}>
            {/* Tirai kiri terakota berlapis */}
            <Slab x={-28} y={-10} w={92} h={740} color="#964630" shade="#733322" shadeH={0.25} r={0} />
            <Slab x={-16} y={-10} w={62} h={740} color={C.hero} shade={C.heroLo} shadeH={0.2} r="0 0 28px 0" />
            <Slab x={34} y={-10} w={36} h={420} color="#DF7C5E" shade={C.hero} shadeH={0.25} r="0 0 24px 0" />

            {/* Tirai kanan terakota berlapis */}
            <Slab x={1216} y={-10} w={92} h={740} color="#964630" shade="#733322" shadeH={0.25} r={0} />
            <Slab x={1234} y={-10} w={62} h={740} color={C.hero} shade={C.heroLo} shadeH={0.2} r="0 0 0 28px" />
            <Slab x={1210} y={-10} w={36} h={420} color="#DF7C5E" shade={C.hero} shadeH={0.25} r="0 0 0 24px" />

            {/* Pelipit atas panggung & lampu sorot */}
            <Slab x={-40} y={-12} w={1360} h={34} color={C.woodLo} shade={C.floorLo} shadeH={0.4} r={0} />
            {[320, 640, 960].map((lx) => (
              <div key={lx} style={{position: 'absolute', left: lx - 18, top: 14, width: 36, height: 22}}>
                <Slab x={4} y={0} w={28} h={18} color={C.brass} shade={C.brassLo} shadeH={0.3} r="4px 4px 10px 10px" />
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 15,
                    width: 16,
                    height: 8,
                    borderRadius: '50%',
                    background: '#FFE49E',
                    boxShadow: '0 4px 14px rgba(255, 224, 140, 0.9)',
                  }}
                />
              </div>
            ))}
          </Paper>
        </div>

        {/* LAPISAN 4: JANGKAR SUDUT WARUNG KOPI (gelas kopi beruap + syal terakota) */}
        <WarungForeground />

        {/* Vinyet lembut tepi layar */}
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 62%, rgba(28, 27, 23, 0.28) 100%)',
            pointerEvents: 'none',
          }}
        />
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};