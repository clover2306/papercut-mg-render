// Adegan D14 (scene 158-163): teater kertas warung kopi penutup tentang kekayaan nyata yang dibangun bersama di balik angka kurs.
// Menampilkan spanduk andai-andaian berbingkai putus-putus "US$1 = Rp1.000" di awal lalu keluar rapi sebelum tirai membuka perancah pembangunan.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Figure, Paper, Slab} from './mgkit';
import {C, FONT, H, ROOM, W} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FeltFibre, FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';

export const D14_DUR = 555;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const easeInOut = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

const easeOut = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {...CLAMP, easing: Easing.out(Easing.cubic)});

const DashedBanner: React.FC<{y: number; opacity: number}> = ({y, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 640,
        top: y,
        width: 660,
        translate: '-50% 0',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Boil seed="d14-banner" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: -210,
            width: 4,
            height: 214,
            backgroundColor: C.tape,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 110,
            top: -210,
            width: 4,
            height: 214,
            backgroundColor: C.tape,
          }}
        />
        <div
          style={{
            position: 'relative',
            backgroundColor: C.creamHi,
            border: `4px dashed ${C.tag}`,
            borderRadius: 10,
            padding: '22px 44px 24px',
            boxShadow: '0 10px 22px rgba(28, 27, 23, 0.28)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 6,
              border: `2px dashed ${C.heroLo}`,
              borderRadius: 6,
              opacity: 0.45,
            }}
          />
          <div
            style={{
              fontFamily: FONT.banner,
              fontSize: 48,
              lineHeight: 1.05,
              color: C.ink,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            US$1 = Rp1.000
          </div>
        </div>
      </Boil>
    </div>
  );
};

const PaperHand: React.FC<{
  x: number;
  y: number;
  flip?: boolean;
  rot?: number;
  scale?: number;
}> = ({x, y, flip = false, rot = 0, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: '-50% -100%',
      transform: `scale(${flip ? -scale : scale}, ${scale}) rotate(${rot}deg)`,
      transformOrigin: '50% 100%',
      pointerEvents: 'none',
    }}
  >
    <Paper lift={6}>
      <Slab x={-22} y={-280} w={44} h={195} color={C.cream} shade={C.creamLo} shadeH={0.22} r={8} />
      <Slab x={-26} y={-105} w={52} h={22} color={C.tag} shade={C.heroLo} shadeH={0.3} r={5} />
      <Slab x={-24} y={-84} w={48} h={52} color={C.creamHi} shade={C.creamLo} shadeH={0.25} r={14} />
      <Slab x={-22} y={-40} w={13} h={38} color={C.creamHi} shade={C.creamLo} shadeH={0.3} r={6} rot={8} />
      <Slab x={-7} y={-36} w={13} h={42} color={C.cream} shade={C.creamLo} shadeH={0.3} r={6} rot={2} />
      <Slab x={8} y={-38} w={13} h={38} color={C.creamHi} shade={C.creamLo} shadeH={0.3} r={6} rot={-5} />
      <Slab x={18} y={-62} w={24} h={13} color={C.cream} shade={C.creamLo} shadeH={0.3} r={6} rot={28} />
    </Paper>
  </div>
);

const HoneyCoin: React.FC<{cx: number; cy: number; r?: number}> = ({cx, cy, r = 24}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      backgroundColor: C.brass,
      border: `3px solid ${C.sparkYellow}`,
      boxShadow: `0 4px 0 ${C.brassLo}, 0 6px 12px rgba(28, 27, 23, 0.25)`,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 5,
        borderRadius: '50%',
        border: `2px solid ${C.brassLo}`,
        opacity: 0.55,
      }}
    />
  </div>
);

const FoundationStack: React.FC<{f: number}> = ({f}) => {
  const coin1Y = easeOut(f, 128, 154, 180, FLOOR_Y - 22);
  const coin1Op = easeOut(f, 124, 134, 0, 1);
  const coin2Y = easeOut(f, 136, 162, 180, FLOOR_Y - 22);
  const coin2Op = easeOut(f, 132, 142, 0, 1);
  const coin3Y = easeOut(f, 144, 170, 180, FLOOR_Y - 22);
  const coin3Op = easeOut(f, 140, 150, 0, 1);

  const blocks = [
    {x: 545, w: 92, h: 36, targetY: FLOOR_Y - 82, color: C.cream, shade: C.creamLo, a: 168, b: 196},
    {x: 643, w: 92, h: 36, targetY: FLOOR_Y - 82, color: C.tag, shade: C.heroLo, a: 182, b: 210},
    {x: 568, w: 72, h: 34, targetY: FLOOR_Y - 118, color: C.woodHi, shade: C.wood, a: 198, b: 224},
    {x: 644, w: 72, h: 34, targetY: FLOOR_Y - 118, color: C.sage, shade: C.sageLo, a: 210, b: 238},
  ];

  return (
    <>
      <div style={{opacity: coin1Op}}>
        <HoneyCoin cx={588} cy={coin1Y} r={22} />
      </div>
      <div style={{opacity: coin2Op}}>
        <HoneyCoin cx={640} cy={coin2Y} r={22} />
      </div>
      <div style={{opacity: coin3Op}}>
        <HoneyCoin cx={692} cy={coin3Y} r={22} />
      </div>
      {blocks.map((blk, idx) => {
        const by = easeOut(f, blk.a, blk.b, 200, blk.targetY);
        const bop = easeOut(f, blk.a - 4, blk.a + 8, 0, 1);
        return (
          <div key={idx} style={{opacity: bop}}>
            <Paper lift={4}>
              <Slab
                x={blk.x}
                y={by}
                w={blk.w}
                h={blk.h}
                color={blk.color}
                shade={blk.shade}
                shadeH={0.22}
                r={5}
              />
            </Paper>
          </div>
        );
      })}
    </>
  );
};

const BlankExchangeBoard: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <Paper lift={5}>
      <Slab x={-42} y={-158} w={10} h={158} color={C.woodLo} r={3} rot={-6} />
      <Slab x={32} y={-158} w={10} h={158} color={C.woodLo} r={3} rot={6} />
      <Slab x={-56} y={-172} w={112} h={94} color={C.woodHi} shade={C.wood} shadeH={0.14} r={6} />
      <Slab x={-46} y={-162} w={92} h={74} color={C.cream} shade={C.creamLo} shadeH={0.1} r={3} />
    </Paper>
  </div>
);

const MegaphoneStand: React.FC<{x: number; y: number; tilt: number; clothDrop: number}> = ({
  x,
  y,
  tilt,
  clothDrop,
}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <Paper lift={5}>
      <Slab x={-26} y={-12} w={52} h={12} color={C.woodLo} r={4} />
      <Slab x={-5} y={-112} w={10} h={104} color={C.wood} r={3} />
    </Paper>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -108,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: '0px 0px',
      }}
    >
      <Paper lift={6}>
        <div
          style={{
            position: 'absolute',
            left: -34,
            top: -22,
            width: 68,
            height: 44,
            backgroundColor: C.metal,
            clipPath: 'polygon(0% 10%, 100% 34%, 100% 66%, 0% 90%)',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.28))',
          }}
        />
        <Slab x={-38} y={-24} w={8} h={48} color={C.metalLo} r={4} />
        <Slab x={18} y={-10} w={16} h={20} color={C.inkSoft} r={4} />
      </Paper>
      {clothDrop > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: -44,
            top: -30 + (1 - clothDrop) * -28,
            width: 84,
            height: 58 * clothDrop,
            backgroundColor: C.creamHi,
            borderRadius: '14px 14px 20px 20px',
            borderBottom: `4px solid ${C.creamLo}`,
            boxShadow: '0 6px 12px rgba(28, 27, 23, 0.25)',
            opacity: clothDrop,
          }}
        />
      ) : null}
    </div>
  </div>
);

const CoffeeCupAnchor: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  const wisps = [0, 1, 2];
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <Paper lift={6}>
        <Slab x={-48} y={0} w={96} h={18} color={C.woodHi} shade={C.woodLo} shadeH={0.35} r={4} />
        <Slab x={-36} y={18} w={12} h={58} color={C.woodLo} r={3} />
        <Slab x={24} y={18} w={12} h={58} color={C.woodLo} r={3} />
        <Slab x={-26} y={-6} w={52} h={6} color={C.creamLo} r={3} />
        <div
          style={{
            position: 'absolute',
            left: -18,
            top: -48,
            width: 36,
            height: 42,
            backgroundColor: C.creamHi,
            clipPath: 'polygon(6% 0%, 94% 0%, 84% 100%, 16% 100%)',
            borderTop: `4px solid ${C.cream}`,
          }}
        />
        <Slab x={-20} y={-50} w={40} h={6} color={C.cream} r={3} />
      </Paper>
      {wisps.map((i) => {
        const cycle = ((f * 0.7 + i * 32) % 96) / 96;
        const wy = -58 - cycle * 56;
        const wx = Math.sin(cycle * Math.PI * 2 + i) * 7 + (i - 1) * 8;
        const wop = Math.sin(cycle * Math.PI) * 0.52;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: wx - 4,
              top: wy,
              width: 8,
              height: 22,
              borderRadius: 8,
              backgroundColor: '#FFFDF8',
              opacity: wop,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </div>
  );
};

const ScaffoldingWorld: React.FC<{
  f: number;
  finalBlockLift: number;
  warmGlow: number;
}> = ({f, finalBlockLift, warmGlow}) => {
  const sway = Math.sin(f * 0.045) * 2.5;
  const gearRot = (f * 0.35) % 360;
  const blockY = interpolate(finalBlockLift, [0, 1], [420, 328], CLAMP);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H}}>
      {warmGlow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 340,
            width: 720,
            height: 440,
            translate: '-50% -50%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,222,135,0.42) 0%, rgba(243,165,59,0.16) 52%, rgba(243,165,59,0) 76%)',
            opacity: warmGlow,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {/* Sawah berundak (kiri) */}
      <Paper lift={3}>
        <div
          style={{
            position: 'absolute',
            left: 345,
            top: FLOOR_Y - 125,
            width: 175,
            height: 125,
            backgroundColor: C.sageLo,
            borderRadius: '90px 70px 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 332,
            top: FLOOR_Y - 84,
            width: 195,
            height: 84,
            backgroundColor: C.sage,
            borderRadius: '70px 95px 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 348,
            top: FLOOR_Y - 46,
            width: 182,
            height: 46,
            backgroundColor: C.brass,
            borderRadius: '50px 60px 0 0',
          }}
        />
        {[372, 396, 420, 444, 468].map((rx, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: rx,
              top: FLOOR_Y - 72 - (idx % 2) * 14,
              width: 5,
              height: 28,
              backgroundColor: C.sparkYellow,
              borderRadius: 4,
              transform: `rotate(${sway + (idx % 2 === 0 ? 5 : -4)}deg)`,
              transformOrigin: '50% 100%',
            }}
          />
        ))}
      </Paper>

      {/* Pabrik (tengah-kiri) */}
      <Paper lift={4}>
        <Slab x={515} y={FLOOR_Y - 265} w={26} h={115} color={C.heroLo} r={3} />
        <Slab x={511} y={FLOOR_Y - 273} w={34} h={10} color={C.inkSoft} r={3} />
        <div
          style={{
            position: 'absolute',
            left: 522,
            top: FLOOR_Y - 304 - Math.sin(f * 0.04) * 5,
            width: 24,
            height: 20,
            borderRadius: '50%',
            backgroundColor: C.creamHi,
            opacity: 0.65,
          }}
        />
        <Slab x={498} y={FLOOR_Y - 175} w={132} h={175} color={C.hero} shade={C.heroLo} shadeH={0.14} r={4} />
        <div
          style={{
            position: 'absolute',
            left: 498,
            top: FLOOR_Y - 203,
            width: 66,
            height: 28,
            backgroundColor: C.tag,
            clipPath: 'polygon(0% 100%, 0% 0%, 100% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 564,
            top: FLOOR_Y - 203,
            width: 66,
            height: 28,
            backgroundColor: C.tag,
            clipPath: 'polygon(0% 100%, 0% 0%, 100% 100%)',
          }}
        />
        {[514, 550, 586].map((wx, idx) => (
          <Slab key={idx} x={wx} y={FLOOR_Y - 142} w={24} h={34} color={C.sparkYellow} r={3} />
        ))}
        {/* Gerigi pabrik berputar tenang */}
        <div
          style={{
            position: 'absolute',
            left: 564,
            top: FLOOR_Y - 72,
            width: 44,
            height: 44,
            translate: '-50% -50%',
            borderRadius: '50%',
            border: `6px dashed ${C.creamHi}`,
            backgroundColor: C.woodHi,
            transform: `rotate(${gearRot}deg)`,
          }}
        />
      </Paper>

      {/* Sekolah (tengah-kanan) */}
      <Paper lift={4}>
        <Slab x={642} y={FLOOR_Y - 190} w={138} h={190} color={C.creamHi} shade={C.cream} shadeH={0.14} r={4} />
        <div
          style={{
            position: 'absolute',
            left: 632,
            top: FLOOR_Y - 236,
            width: 158,
            height: 48,
            backgroundColor: ROOM.dusk,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <Slab x={698} y={FLOOR_Y - 82} w={26} h={82} color={C.wood} r={4} />
        {[658, 738].map((wx, idx) => (
          <Slab key={idx} x={wx} y={FLOOR_Y - 148} w={24} h={36} color={C.amber} r={3} />
        ))}
        {/* Tiang bendera polos tanpa tulisan */}
        <Slab x={774} y={FLOOR_Y - 252} w={5} h={252} color={C.creamLo} r={2} />
        <Slab x={779} y={FLOOR_Y - 246} w={34} h={11} color={C.tag} r={1} />
        <Slab x={779} y={FLOOR_Y - 235} w={34} h={11} color={C.creamHi} r={1} />
      </Paper>

      {/* Rumah (kanan) */}
      <Paper lift={3}>
        <Slab x={792} y={FLOOR_Y - 138} w={118} h={138} color={C.cream} shade={C.creamLo} shadeH={0.16} r={4} />
        <div
          style={{
            position: 'absolute',
            left: 782,
            top: FLOOR_Y - 182,
            width: 138,
            height: 46,
            backgroundColor: C.tag,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <Slab x={814} y={FLOOR_Y - 68} w={24} h={68} color={C.woodHi} r={3} />
        <Slab x={856} y={FLOOR_Y - 98} w={28} h={28} color={C.sparkYellow} r={3} />
      </Paper>

      {/* Rangka Perancah (Scaffolding) */}
      <div style={{opacity: interpolate(warmGlow, [0, 1], [0.92, 0.42], CLAMP)}}>
        {[488, 634, 784].map((px, idx) => (
          <Slab key={idx} x={px} y={FLOOR_Y - 266} w={7} h={266} color={C.woodHi} r={2} />
        ))}
        {[FLOOR_Y - 242, FLOOR_Y - 166, FLOOR_Y - 92].map((py, idx) => (
          <Slab key={idx} x={482} y={py} w={314} h={6} color={C.tape} r={2} />
        ))}
      </div>

      {/* Balok Puncak Terakhir yang Diangkat Bersama di Beat 5 */}
      <Paper lift={6}>
        <Slab
          x={576}
          y={blockY}
          w={128}
          h={30}
          color={C.sparkYellow}
          shade={C.brass}
          shadeH={0.28}
          hi={C.creamHi}
          hiH={0.16}
          r={6}
        />
      </Paper>
    </div>
  );
};

type Role = 'kamu' | 'worker' | 'elder' | 'child';

const PaperCharacter: React.FC<{
  x: number;
  y: number;
  role: Role;
  armRaise: number;
  f: number;
  brightScarf?: boolean;
}> = ({x, y, role, armRaise, f, brightScarf = false}) => {
  const s = role === 'child' ? 0.82 : 1;
  const shirt =
    role === 'kamu'
      ? C.creamHi
      : role === 'worker'
        ? ROOM.slate
        : role === 'elder'
          ? C.tape
          : C.creamHi;
  const lean = role === 'elder' ? 4 : 0;
  const breathe = Math.sin(f * 0.05 + x * 0.01) * 1.4;
  const armAngle = interpolate(armRaise, [0, 1], [14, -138], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + breathe,
        transform: `rotate(${lean}deg)`,
        transformOrigin: '0px 0px',
      }}
    >
      <Figure x={0} y={0} s={s} shirt={shirt} />

      {/* Lengan kertas artikulasi (mengangkat balok bersama di Beat 5) */}
      <div
        style={{
          position: 'absolute',
          left: -26 * s,
          top: -122 * s,
          width: 14 * s,
          height: 54 * s,
          borderRadius: 7 * s,
          backgroundColor: shirt,
          border: `2px solid ${C.inkSoft}`,
          transform: `rotate(${armAngle}deg)`,
          transformOrigin: '50% 6px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 12 * s,
          top: -122 * s,
          width: 14 * s,
          height: 54 * s,
          borderRadius: 7 * s,
          backgroundColor: shirt,
          border: `2px solid ${C.inkSoft}`,
          transform: `rotate(${-armAngle}deg)`,
          transformOrigin: '50% 6px',
        }}
      />

      {/* Penanda khusus tiap tokoh tanpa wajah */}
      {role === 'kamu' ? (
        <>
          {/* Tali & tas selempang kecil */}
          <div
            style={{
              position: 'absolute',
              left: -24,
              top: -124,
              width: 52,
              height: 7,
              backgroundColor: C.wood,
              transform: 'rotate(38deg)',
              borderRadius: 3,
            }}
          />
          <Slab x={14} y={-76} w={22} h={24} color={C.woodHi} shade={C.woodLo} shadeH={0.25} r={5} />
          {/* Syal kertas terakota panjang */}
          <Slab
            x={-26}
            y={-132}
            w={52}
            h={16}
            color={brightScarf ? C.hero : C.tag}
            shade={C.heroLo}
            shadeH={0.25}
            r={7}
          />
          <Slab
            x={-24}
            y={-120}
            w={15}
            h={68}
            color={brightScarf ? C.hero : C.tag}
            shade={C.heroLo}
            shadeH={0.2}
            r={5}
            rot={Math.sin(f * 0.05) * 2.5 + 4}
          />
        </>
      ) : null}

      {role === 'worker' ? (
        <Slab x={-22} y={-106} w={44} h={58} color={C.sageLo} shade={C.sage} shadeH={0.2} r={5} />
      ) : null}

      {role === 'elder' ? (
        <Slab x={34} y={-72} w={6} h={72} color={C.woodLo} r={3} rot={-6} />
      ) : null}

      {role === 'child' ? (
        <Slab x={-22 * s} y={-124 * s} w={44 * s} h={42 * s} color={ROOM.dusk} r={6 * s} />
      ) : null}
    </div>
  );
};

export const D14: React.FC = () => {
  const f = useCurrentFrame();

  // Beat 1 -> Beat 2: Spanduk "US$1 = Rp1.000" masuk di scene 158, keluar rapi ke atas sebelum scene 160 (rel 279)
  const bannerY =
    f < 84
      ? easeOut(f, 0, 26, -150, 122)
      : easeInOut(f, 84, 136, 122, -210);
  const bannerOp = f < 118 ? 1 : interpolate(f, [118, 138], [1, 0], CLAMP);

  // Beat 2 (scene 159 | rel 103-258): Tangan kertas besar dari atas meletakkan koin madu & blok fondasi
  const topHandsY =
    f < 165
      ? easeOut(f, 104, 152, -40, 315)
      : f < 234
        ? easeInOut(f, 165, 224, 315, 275)
        : easeInOut(f, 234, 268, 275, -40);
  const topHandsOp =
    f < 102 ? 0 : f < 258 ? 1 : interpolate(f, [258, 270], [1, 0], CLAMP);

  // Beat 3 (scene 160 | rel 279-329): Tangan menjangkau papan kurs kosong lalu menarik diri
  const reachHandX =
    f < 303
      ? easeOut(f, 279, 303, 1260, 1038)
      : easeInOut(f, 305, 329, 1038, 1260);
  const reachHandOp =
    f < 278 ? 0 : f < 326 ? 1 : interpolate(f, [326, 332], [1, 0], CLAMP);

  // Beat 4 (scene 161 | rel 342-411): Tirai belakang bergeser terbuka memperlihatkan perancah
  const rearCurtainOpen = easeInOut(f, 342, 398, 0, 285);

  // Beat 5 (scene 162 | rel 428-504): Tokoh berkumpul, mengangkat balok terakhir bersama, sorot hangat jatuh
  const teamEnter = easeOut(f, 408, 438, 0, 1);
  const kamuX =
    f < 130
      ? 510
      : f < 410
        ? easeInOut(f, 130, 175, 510, 465)
        : easeInOut(f, 410, 438, 465, 496);
  const workerX = interpolate(teamEnter, [0, 1], [360, 586], CLAMP);
  const elderX = interpolate(teamEnter, [0, 1], [930, 686], CLAMP);
  const childX = interpolate(teamEnter, [0, 1], [990, 774], CLAMP);
  const teamOp = easeOut(f, 408, 424, 0, 1);

  const armRaise =
    f < 484
      ? easeInOut(f, 432, 480, 0, 1)
      : easeInOut(f, 486, 512, 1, 0);
  const finalBlockLift = easeInOut(f, 432, 482, 0, 1);
  const warmGlow = easeOut(f, 482, 506, 0, 1);

  // Beat 6 (scene 163 | rel 522-555): Corong tertunduk berselimut kain, tirai teater menutup setengah
  const megaphoneTilt = easeInOut(f, 518, 538, -14, 44);
  const clothDrop = easeOut(f, 524, 542, 0, 1);
  const sideCurtainClose = easeInOut(f, 516, 545, 0, 185);

  // Gerak kamera tenang: dolly-in bertahap hingga Beat 5, lalu pull-out lembut di Beat 6 & ditahan
  const camZoom =
    f < 100
      ? easeInOut(f, 0, 90, 1.0, 1.05)
      : f < 425
        ? easeInOut(f, 100, 420, 1.05, 1.11)
        : f < 514
          ? easeInOut(f, 425, 502, 1.11, 1.17)
          : easeInOut(f, 514, 545, 1.17, 1.03);

  const camPanY =
    f < 514
      ? easeInOut(f, 342, 502, 0, 18)
      : easeInOut(f, 514, 545, 18, 0);

  return (
    <AbsoluteFill style={{backgroundColor: C.ink}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        <OrbitCamera dur={D14_DUR} yaw={8} push={1.03} origin={[640, 420]} depth={680}>
          <AbsoluteFill
            style={{
              transform: `scale(${camZoom}) translateY(${camPanY}px)`,
              transformOrigin: '640px 410px',
            }}
          >
            {/* Lapisan 0: Dinding Teater & Perancah di Balik Tirai Belakang */}
            <Depth z={0.05} cover>
              <Slab x={-260} y={-160} w={1800} h={1040} color="#2B394A" r={0} grain={0.5} />
              <AbsoluteFill
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 42%, rgba(255,216,138,0.22) 0%, rgba(43,57,74,0.1) 52%, rgba(18,22,28,0.55) 100%)',
                }}
              />
              <ScaffoldingWorld f={f} finalBlockLift={finalBlockLift} warmGlow={warmGlow} />

              {/* Tirai belakang polos tebal yang bergeser terbuka di Beat 4 */}
              <Paper lift={5}>
                <Slab
                  x={220 - rearCurtainOpen}
                  y={48}
                  w={422}
                  h={FLOOR_Y - 48}
                  color="#4B5D73"
                  shade="#384759"
                  shadeH={0.18}
                  r={0}
                  grain={0.55}
                />
                <Slab
                  x={638 + rearCurtainOpen}
                  y={48}
                  w={422}
                  h={FLOOR_Y - 48}
                  color="#4B5D73"
                  shade="#384759"
                  shadeH={0.18}
                  r={0}
                  grain={0.55}
                />
              </Paper>
            </Depth>

            {/* Lapisan 1: Lantai Panggung Papan, Cahaya Sorot & Properti */}
            <Depth z={0.45}>
              {/* Kerucut lampu sorot kuning madu dari atas */}
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: 32,
                  width: 820,
                  height: FLOOR_Y - 12,
                  translate: '-50% 0',
                  background: `linear-gradient(180deg, rgba(255, 226, 148, ${0.26 + warmGlow * 0.14}) 0%, rgba(255, 226, 148, ${0.08 + warmGlow * 0.1}) 100%)`,
                  clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Lantai papan kayu panggung */}
              <Slab x={-260} y={FLOOR_Y} w={1800} h={280} color={C.floor} r={0} grain={0.6} />
              <div
                style={{
                  position: 'absolute',
                  left: -260,
                  right: -260,
                  top: FLOOR_Y + 34,
                  height: 3,
                  backgroundColor: C.floorLo,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -260,
                  right: -260,
                  top: FLOOR_Y + 72,
                  height: 3,
                  backgroundColor: C.floorLo,
                  opacity: 0.85,
                }}
              />
              <Slab
                x={-260}
                y={FLOOR_Y - 16}
                w={1800}
                h={20}
                color={C.woodLo}
                shade={C.floorLo}
                shadeH={0.35}
                r={0}
              />

              {/* Fondasi koin kuning madu & blok (Beat 2) */}
              <FoundationStack f={f} />

              {/* Papan kurs kosong di sisi kanan panggung (Beat 3) */}
              <BlankExchangeBoard x={990} y={FLOOR_Y} />

              {/* Corong pengeras suara kertas di tepi kanan panggung (Beat 6) */}
              <MegaphoneStand
                x={905}
                y={FLOOR_Y}
                tilt={megaphoneTilt}
                clothDrop={clothDrop}
              />

              {/* Tangan-tangan kertas dari atas (Beat 2) */}
              {topHandsOp > 0.01 ? (
                <div style={{opacity: topHandsOp}}>
                  <PaperHand x={578} y={topHandsY} rot={8} scale={0.95} />
                  <PaperHand x={702} y={topHandsY + 12} flip rot={8} scale={0.95} />
                </div>
              ) : null}

              {/* Tangan menjangkau papan kurs kosong lalu menarik diri (Beat 3) */}
              {reachHandOp > 0.01 ? (
                <div style={{opacity: reachHandOp}}>
                  <PaperHand x={reachHandX} y={FLOOR_Y - 92} rot={-68} scale={0.86} />
                </div>
              ) : null}

              {/* Spanduk berbingkai PUTUS-PUTUS (Beat 1, keluar rapi sebelum scene 160) */}
              <DashedBanner y={bannerY} opacity={bannerOp} />
            </Depth>

            {/* Lapisan 2: Tokoh Tanpa Wajah & Jangkar Warung Kopi */}
            <Depth z={0.7}>
              <PaperCharacter
                x={kamuX}
                y={FLOOR_Y}
                role="kamu"
                armRaise={armRaise}
                f={f}
                brightScarf={warmGlow > 0.3}
              />
              {teamOp > 0.01 ? (
                <div style={{opacity: teamOp}}>
                  <PaperCharacter x={workerX} y={FLOOR_Y} role="worker" armRaise={armRaise} f={f} />
                  <PaperCharacter x={elderX} y={FLOOR_Y} role="elder" armRaise={armRaise} f={f} />
                  <PaperCharacter x={childX} y={FLOOR_Y} role="child" armRaise={armRaise} f={f} />
                </div>
              ) : null}

              {/* Jangkar warung: gelas kopi kertas dengan uap tipis di tepi panggung */}
              <CoffeeCupAnchor x={415} y={FLOOR_Y + 18} f={f} />
            </Depth>

            {/* Lapisan 3: Tirai Teater Terakota & Rel Lampu Sorot */}
            <Depth z={0.92}>
              {/* Tirai kiri */}
              <Paper lift={8}>
                <Slab
                  x={-180 + sideCurtainClose}
                  y={-40}
                  w={360}
                  h={820}
                  color={C.tag}
                  shade={C.heroLo}
                  shadeH={0.12}
                  r={0}
                  grain={0.55}
                />
                {[40, 110, 175, 240, 305].map((px, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: -180 + sideCurtainClose + px,
                      top: -40,
                      width: 14,
                      height: 820,
                      backgroundColor: idx % 2 === 0 ? C.heroLo : C.hero,
                      opacity: 0.45,
                    }}
                  />
                ))}
              </Paper>

              {/* Tirai kanan */}
              <Paper lift={8}>
                <Slab
                  x={1100 - sideCurtainClose}
                  y={-40}
                  w={360}
                  h={820}
                  color={C.tag}
                  shade={C.heroLo}
                  shadeH={0.12}
                  r={0}
                  grain={0.55}
                />
                {[40, 110, 175, 240, 305].map((px, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: 1100 - sideCurtainClose + px,
                      top: -40,
                      width: 14,
                      height: 820,
                      backgroundColor: idx % 2 === 0 ? C.heroLo : C.hero,
                      opacity: 0.45,
                    }}
                  />
                ))}
              </Paper>

              {/* Pelipit atas panggung & lampu sorot */}
              <Paper lift={9}>
                <Slab x={-220} y={-40} w={1720} h={84} color={C.heroLo} shade={C.ink} shadeH={0.25} r={0} />
                <Slab x={-220} y={36} w={1720} h={14} color={C.brass} shade={C.brassLo} shadeH={0.4} r={0} />
                <Slab x={560} y={24} w={36} h={24} color={C.inkSoft} r={6} rot={16} />
                <Slab x={684} y={24} w={36} h={24} color={C.inkSoft} r={6} rot={-16} />
              </Paper>
            </Depth>
          </AbsoluteFill>
        </OrbitCamera>
      </FilmWeave>

      <FeltFibre opacity={0.22} blend="screen" />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 56%, rgba(20,16,12,0.34) 100%)',
          pointerEvents: 'none',
        }}
      />
      <GrainOverlay />
    </AbsoluteFill>
  );
};