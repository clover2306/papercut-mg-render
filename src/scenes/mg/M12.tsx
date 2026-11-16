// Adegan M12 (Scene 104-106, 379,05-385,51 dtk): Layar terbelah membandingkan dua kantin
// berpapan "gratis" identik, lalu lampu meja menyala dan tangan penjaga hadir hanya di sisi kiri.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {MarkerUnderline} from '../../lib/paper/proof';

export const M12_DUR = 194;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ROOM_FLOOR = FLOOR_Y - 8;

/* Satu unit kantin kertas lengkap (dipakai identik untuk sisi kiri dan kanan) */
const CanteenHalf: React.FC<{
  cx: number;
  boardSeed: string;
  warmGlow: number;
  coolDim: number;
  withDeskLamp: boolean;
  lampOn: number;
}> = ({cx, boardSeed, warmGlow, coolDim, withDeskLamp, lampOn}) => {
  const wallW = 470;
  const wallX = cx - wallW / 2;
  const wallTop = 258;
  const roofTop = 210;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Atap kanopi kantin dari potongan kertas berlapis */}
      <svg
        width={wallW + 44}
        height={wallTop - roofTop + 10}
        viewBox={`0 0 ${wallW + 44} ${wallTop - roofTop + 10}`}
        style={{
          position: 'absolute',
          left: wallX - 22,
          top: roofTop,
          filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.3))',
        }}
      >
        <polygon
          points={`26,4 ${wallW + 18},4 ${wallW + 40},${wallTop - roofTop + 4} 4,${wallTop - roofTop + 4}`}
          fill={ROOM.terracotta}
        />
        <polygon
          points={`26,4 ${wallW + 18},4 ${wallW + 26},18 18,18`}
          fill={C.tag}
        />
      </svg>

      {/* Lis kayu di bawah atap */}
      <Paper lift={6}>
        <Slab
          x={wallX - 10}
          y={wallTop - 4}
          w={wallW + 20}
          h={14}
          color={C.wood}
          shade={C.woodLo}
          shadeH={0.35}
          r={3}
        />
      </Paper>

      {/* Dinding belakang dapur & area saji kantin */}
      <Paper lift={5}>
        <Slab
          x={wallX}
          y={wallTop + 10}
          w={wallW}
          h={ROOM_FLOOR - (wallTop + 10)}
          color={warmGlow > 0.05 ? '#F5EFE3' : '#EAE1D2'}
          shade={C.cream}
          shadeH={0.1}
          r={0}
        />
      </Paper>

      {/* Garis nat keramik dapur (tanpa tulisan/angka) */}
      {[322, 372, 422].map((ty) => (
        <div
          key={ty}
          style={{
            position: 'absolute',
            left: wallX + 12,
            top: ty,
            width: wallW - 24,
            height: 2,
            backgroundColor: C.creamLo,
            opacity: 0.45,
          }}
        />
      ))}

      {/* Rak dinding dapur dengan stoples bahan polos */}
      <Paper lift={5}>
        <Slab
          x={wallX + 28}
          y={392}
          w={124}
          h={10}
          color={C.woodHi}
          shade={C.woodLo}
          shadeH={0.35}
          r={2}
        />
        <Slab x={wallX + 40} y={362} w={24} h={30} color={C.sage} r={4} />
        <Slab x={wallX + 74} y={366} w={22} h={26} color={C.amber} r={4} />
        <Slab x={wallX + 106} y={360} w={26} h={32} color={C.metal} r={4} />
      </Paper>

      {/* Meja dapur & panci masak */}
      <Paper lift={6}>
        <Slab
          x={wallX + 24}
          y={492}
          w={184}
          h={ROOM_FLOOR - 492}
          color={C.metal}
          shade={C.metalLo}
          shadeH={0.22}
          r={4}
        />
        <Slab
          x={wallX + 104}
          y={452}
          w={82}
          h={40}
          color={C.metalLo}
          hi={C.metal}
          hiH={0.28}
          r="4px 4px 12px 12px"
        />
        <Slab
          x={wallX + 100}
          y={444}
          w={90}
          h={9}
          color={C.brass}
          r={3}
        />
      </Paper>

      {/* Meja saji & dua baki makan siang rapi */}
      <Paper lift={6}>
        <Slab
          x={wallX + 228}
          y={502}
          w={216}
          h={ROOM_FLOOR - 502}
          color={C.woodHi}
          shade={C.woodLo}
          shadeH={0.25}
          r={4}
        />
        <Slab
          x={wallX + 222}
          y={494}
          w={228}
          h={12}
          color={C.cream}
          shade={C.creamLo}
          shadeH={0.3}
          r={3}
        />
        {/* Dua baki makan siang identik */}
        {[246, 344].map((dx, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: wallX + dx,
              top: 476,
              width: 74,
              height: 18,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: 74,
                height: 7,
                borderRadius: 3,
                backgroundColor: C.metalLo,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 8,
                bottom: 6,
                width: 26,
                height: 11,
                borderRadius: 3,
                backgroundColor: C.creamHi,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 40,
                bottom: 6,
                width: 24,
                height: 11,
                borderRadius: 3,
                backgroundColor: C.sage,
              }}
            />
          </div>
        ))}
      </Paper>

      {/* Lampu meja di atas dapur (hanya hadir dan menyala di sisi kiri saat Scene 106) */}
      {withDeskLamp && lampOn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: wallX + 34,
            top: 374,
            opacity: lampOn,
            transform: `translateY(${(1 - lampOn) * -18}px)`,
          }}
        >
          {/* Kerucut cahaya hangat menyinari dapur dan meja saji */}
          <div
            style={{
              position: 'absolute',
              left: 44,
              top: 26,
              width: 310,
              height: 192,
              background:
                'linear-gradient(135deg, rgba(255,226,130,0.52) 0%, rgba(255,226,130,0.18) 65%, rgba(255,226,130,0) 100%)',
              clipPath: 'polygon(0% 10%, 24% 0%, 100% 100%, 12% 100%)',
            }}
          />
          {/* Dudukan, tangkai, dan kap lampu meja kertas */}
          <Paper lift={7}>
            <Slab x={6} y={106} w={46} h={12} color={C.board} r={4} />
            <Slab x={24} y={44} w={10} h={64} color={C.boardHi} r={3} />
            <Slab
              x={22}
              y={22}
              w={42}
              h={10}
              color={C.boardHi}
              rot={-18}
              r={3}
            />
            <Slab
              x={44}
              y={16}
              w={46}
              h={28}
              color={C.amber}
              shade={C.brassLo}
              shadeH={0.25}
              rot={26}
              r="22px 22px 4px 4px"
            />
          </Paper>
          {/* Bohlam hangat di mulut kap lampu */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 36,
              width: 18,
              height: 12,
              borderRadius: '0 0 10px 10px',
              backgroundColor: '#FFF7D6',
            }}
          />
        </div>
      ) : null}

      {/* Papan harga identik bertuliskan "gratis" */}
      <PopIn at={8}>
        <Boil seed={boardSeed} amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: cx - 98,
              top: 278,
              width: 196,
              height: 74,
              filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.34))',
            }}
          >
            {/* Tali gantungan papan */}
            <div
              style={{
                position: 'absolute',
                left: 44,
                top: -12,
                width: 4,
                height: 16,
                backgroundColor: C.inkSoft,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 44,
                top: -12,
                width: 4,
                height: 16,
                backgroundColor: C.inkSoft,
              }}
            />
            {/* Bingkai papan kayu & bidang kertas krem */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                backgroundColor: C.woodLo,
                padding: 6,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 5,
                  backgroundColor: C.creamHi,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 38,
                  color: C.ink,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                }}
              >
                gratis
              </div>
            </div>
          </div>
        </Boil>
      </PopIn>

      {/* Tiang bingkai luar kiri & kanan kantin */}
      <Paper lift={7}>
        <Slab
          x={wallX - 4}
          y={wallTop + 6}
          w={12}
          h={ROOM_FLOOR - wallTop - 6}
          color={C.woodLo}
          r={2}
        />
        <Slab
          x={wallX + wallW - 8}
          y={wallTop + 6}
          w={12}
          h={ROOM_FLOOR - wallTop - 6}
          color={C.woodLo}
          r={2}
        />
      </Paper>

      {/* Lapisan redup dingin pada sisi kanan setelah lampu kiri menyala */}
      {coolDim > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: wallX - 24,
            top: roofTop - 6,
            width: wallW + 48,
            height: ROOM_FLOOR - roofTop + 14,
            backgroundColor: '#1E2738',
            opacity: coolDim,
            borderRadius: 6,
          }}
        />
      ) : null}
    </div>
  );
};

/* Tangan kertas penjaga yang masuk menyangga dan menjaga dapur sisi kiri */
const GuardingPaperHand: React.FC<{enterAt: number}> = ({enterAt}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [enterAt, enterAt + 20], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const steadyBreath = f > enterAt + 20 ? Math.sin((f - enterAt) * 0.12) * 2.2 : 0;

  if (p <= 0.01) return null;

  const slideX = interpolate(p, [0, 1], [-190, 0], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        left: 44 + slideX,
        top: 462 + steadyBreath,
        width: 245,
        height: 118,
        opacity: p,
        filter: 'drop-shadow(3px 6px 9px rgba(0,0,0,0.38))',
        pointerEvents: 'none',
      }}
    >
      {/* Lengan baju pengawas berwarna biru tua */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 38,
          width: 96,
          height: 52,
          borderRadius: '10px 4px 4px 10px',
          backgroundColor: ROOM.navy,
          borderBottom: '7px solid #1B2334',
        }}
      />
      {/* Manset krem */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 34,
          width: 20,
          height: 60,
          borderRadius: 4,
          backgroundColor: C.creamHi,
          border: `2px solid ${C.creamLo}`,
        }}
      />
      {/* Telapak tangan kertas berlapis yang terbuka menyangga dapur */}
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 36,
          width: 78,
          height: 56,
          borderRadius: '12px 20px 24px 14px',
          backgroundColor: C.creamHi,
          border: `2.5px solid ${C.inkSoft}`,
          boxSizing: 'border-box',
        }}
      />
      {/* Ibu jari penjaga di sisi atas */}
      <div
        style={{
          position: 'absolute',
          left: 126,
          top: 14,
          width: 48,
          height: 24,
          borderRadius: 12,
          backgroundColor: C.cream,
          border: `2.5px solid ${C.inkSoft}`,
          transform: 'rotate(-24deg)',
          boxSizing: 'border-box',
        }}
      />
      {/* Jari-jari penyangga yang terulur lembut di bawah meja dapur */}
      {[
        {top: 42, w: 62, rot: -4},
        {top: 56, w: 68, rot: 0},
        {top: 70, w: 62, rot: 4},
      ].map((finger, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 168,
            top: finger.top,
            width: finger.w,
            height: 15,
            borderRadius: 8,
            backgroundColor: C.creamHi,
            border: `2px solid ${C.inkSoft}`,
            transform: `rotate(${finger.rot}deg)`,
            boxSizing: 'border-box',
          }}
        />
      ))}
    </div>
  );
};

export const M12: React.FC = () => {
  const f = useCurrentFrame();

  // Scene 104 (0-55) & Scene 105 (60-108): kiri dan kanan 100% identik.
  // Scene 106 (108-194): lampu meja menyala dan tangan penjaga masuk di sisi kiri saja.
  const leftLampOn = interpolate(f, [108, 124], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rightCoolDim = interpolate(f, [112, 134], [0, 0.24], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage dur={M12_DUR} banner="DUA KANTIN GRATIS" bannerSize={44}>
      <OrbitCamera
        dur={M12_DUR}
        yaw={14}
        push={1.07}
        focus={0.5}
        depth={620}
        origin={[640, 440]}
      >
        <Depth z={0.5}>
          {/* Kantin Kiri */}
          <CanteenHalf
            cx={330}
            boardSeed="m12-board-l"
            warmGlow={leftLampOn}
            coolDim={0}
            withDeskLamp={true}
            lampOn={leftLampOn}
          />

          {/* Kantin Kanan (identik tanpa lampu menyala dan tanpa tangan penjaga) */}
          <CanteenHalf
            cx={950}
            boardSeed="m12-board-r"
            warmGlow={0}
            coolDim={rightCoolDim}
            withDeskLamp={false}
            lampOn={0}
          />

          {/* Scene 105 (f=60..108): garis bawah spidol serentak di kedua papan "gratis" */}
          <MarkerUnderline
            x={252}
            y={337}
            w={156}
            at={64}
            dur={14}
            color={C.amber}
            seed="m12-u-left"
            width={5}
          />
          <MarkerUnderline
            x={872}
            y={337}
            w={156}
            at={64}
            dur={14}
            color={C.amber}
            seed="m12-u-right"
            width={5}
          />

          {/* Scene 106 (f=108+): tangan kertas penjaga & kilau lampu menyala hanya di kiri */}
          <GuardingPaperHand enterAt={112} />
          <SparkleBurst at={110} x={198} y={398} seed="m12-lamp" spread={52} />

          {/* Garis pembelah layar kertas vertikal di tengah (x = 640) */}
          <div
            style={{
              position: 'absolute',
              left: 632,
              top: 152,
              width: 16,
              height: 542,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 5,
                top: 0,
                width: 6,
                height: '100%',
                backgroundColor: C.cream,
                boxShadow: '-3px 0 6px rgba(0,0,0,0.24), 3px 0 6px rgba(0,0,0,0.24)',
                filter: 'url(#torn)',
              }}
            />
          </div>
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};