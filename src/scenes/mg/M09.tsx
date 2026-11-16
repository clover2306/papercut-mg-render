// Adegan M09 (Scene 072-073, 263,49-273,93 dtk): Mesin dapur raksasa kertas melaju di lintasan
// sementara tiga pasang lengan tanpa wajah bergantian memutar kemudi dan penghitung "3" terisi.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Boil, FLOOR_Y, Paper, PopIn, Slab, Stage} from './mgkit';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Disc, SparkleBurst} from '../../lib/paper/kit';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Shelf, Window} from '../../lib/paper/sets';

export const M09_DUR = 313;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type ArmTurn = {
  inAt: number;
  grabAt: number;
  outAt: number;
  sleeve: string;
  cuff: string;
  targetDeg: number;
};

const TURNS: readonly ArmTurn[] = [
  {inAt: 10, grabAt: 22, outAt: 52, sleeve: ROOM.navy, cuff: C.creamHi, targetDeg: -38},
  {inAt: 48, grabAt: 60, outAt: 90, sleeve: ROOM.terracotta, cuff: C.cream, targetDeg: 42},
  {inAt: 86, grabAt: 98, outAt: 313, sleeve: ROOM.teal, cuff: C.tape, targetDeg: -34},
];

const BackDecor: React.FC = () => (
  <AbsoluteFill>
    <div style={{opacity: 0.55}}>
      <Shelf x={58} y={285} w={230} books={4} />
    </div>
    <div style={{opacity: 0.5}}>
      <Window x={1015} y={245} w={195} h={240} night={false} />
    </div>
  </AbsoluteFill>
);

const TrackRail: React.FC<{scrollPx: number}> = ({scrollPx}) => {
  const step = 64;
  const offset = ((scrollPx % step) + step) % step;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y - 18, height: 22}}>
      <Paper lift={3}>
        <Slab x={-20} y={8} w={1320} h={12} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={2} />
        <Slab x={-20} y={0} w={1320} h={9} color={C.metalLo} hi={C.metal} hiH={0.35} r={2} />
      </Paper>
      {Array.from({length: 23}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i * step - offset - 32,
            top: 11,
            width: 26,
            height: 9,
            borderRadius: 2,
            backgroundColor: C.boardLo,
          }}
        />
      ))}
    </div>
  );
};

const PaperWheel: React.FC<{cx: number; cy: number; r: number; rotDeg: number}> = ({cx, cy, r, rotDeg}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      transform: `rotate(${rotDeg}deg)`,
    }}
  >
    <Disc x={r} y={r} d={r * 2} color={C.board} shade={C.boardLo} />
    <Disc x={r} y={r} d={r * 1.44} color={C.metalLo} shade={C.boardLo} />
    {[0, 60, 120].map((deg) => (
      <div
        key={deg}
        style={{
          position: 'absolute',
          left: r - 4,
          top: r * 0.28,
          width: 8,
          height: r * 1.44,
          backgroundColor: C.boardHi,
          borderRadius: 3,
          transform: `rotate(${deg}deg)`,
        }}
      />
    ))}
    <Disc x={r} y={r} d={r * 0.48} color={C.brass} shade={C.brassLo} />
  </div>
);

const PaperGear: React.FC<{cx: number; cy: number; r: number; teeth: number; rotDeg: number; color: string}> = ({
  cx,
  cy,
  r,
  teeth,
  rotDeg,
  color,
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      transform: `rotate(${rotDeg}deg)`,
      filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.28))',
    }}
  >
    {Array.from({length: teeth}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: r - 5,
          top: -6,
          width: 10,
          height: r * 2 + 12,
          backgroundColor: color,
          borderRadius: 2,
          transform: `rotate(${(i * 180) / teeth}deg)`,
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        inset: 4,
        borderRadius: '50%',
        backgroundColor: color,
        border: `4px solid ${C.inkSoft}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: r - r * 0.26,
        top: r - r * 0.26,
        width: r * 0.52,
        height: r * 0.52,
        borderRadius: '50%',
        backgroundColor: C.boardLo,
      }}
    />
  </div>
);

const SteeringHelm: React.FC<{cx: number; cy: number; rotDeg: number}> = ({cx, cy, rotDeg}) => {
  const r = 82;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r - 18,
        top: cy - r - 18,
        width: (r + 18) * 2,
        height: (r + 18) * 2,
        transform: `rotate(${rotDeg}deg)`,
        filter: 'drop-shadow(3px 6px 8px rgba(0,0,0,0.36))',
      }}
    >
      {[0, 45, 90, 135].map((deg) => (
        <div
          key={deg}
          style={{
            position: 'absolute',
            left: r + 18 - 6,
            top: 2,
            width: 12,
            height: (r + 16) * 2,
            backgroundColor: C.wood,
            borderRadius: 5,
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 18,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          border: `18px solid ${C.woodHi}`,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 24,
          width: (r - 6) * 2,
          height: (r - 6) * 2,
          borderRadius: '50%',
          border: `4px solid ${C.brass}`,
          boxSizing: 'border-box',
        }}
      />
      {/* Penanda arah kemudi dari kertas merah agar perubahan arah langsung terbaca */}
      <div
        style={{
          position: 'absolute',
          left: r + 18 - 11,
          top: 4,
          width: 22,
          height: 28,
          backgroundColor: C.tag,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: r + 18 - 22,
          top: r + 18 - 22,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: C.brass,
          border: `4px solid ${C.brassLo}`,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

const ArmPair: React.FC<{turn: ArmTurn; wheelCx: number; wheelCy: number; wheelDeg: number}> = ({
  turn,
  wheelCx,
  wheelCy,
  wheelDeg,
}) => {
  const f = useCurrentFrame();
  const enterP = interpolate(f, [turn.inAt, turn.grabAt], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exitP =
    turn.outAt < M09_DUR
      ? interpolate(f, [turn.outAt - 8, turn.outAt + 4], [0, 1], {
          ...CLAMP,
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  const visible = enterP > 0.01 && exitP < 0.99;
  if (!visible) return null;

  const slideX = (1 - enterP) * 240 + exitP * 250;
  const opacity = Math.min(enterP * 2.2, 1 - exitP);
  const gripShiftY = interpolate(wheelDeg, [-42, 42], [-22, 22], CLAMP);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `translateX(${slideX}px)`,
        pointerEvents: 'none',
      }}
    >
      {/* Lengan atas tanpa wajah memegang tepi atas roda kemudi */}
      <div
        style={{
          position: 'absolute',
          left: wheelCx + 14,
          top: wheelCy - 92 + gripShiftY * 0.7,
          width: 270,
          height: 44,
          transformOrigin: '0% 50%',
          transform: `rotate(${-14 + gripShiftY * 0.35}deg)`,
          filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.35))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 0,
            width: 240,
            height: 44,
            borderRadius: '10px 22px 22px 10px',
            backgroundColor: turn.sleeve,
            borderBottom: `6px solid rgba(0,0,0,0.18)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 3,
            width: 22,
            height: 38,
            borderRadius: 4,
            backgroundColor: turn.cuff,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 5,
            width: 34,
            height: 34,
            borderRadius: '14px 8px 8px 14px',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
          }}
        />
      </div>

      {/* Lengan bawah tanpa wajah memegang tepi bawah roda kemudi */}
      <div
        style={{
          position: 'absolute',
          left: wheelCx + 10,
          top: wheelCy + 48 + gripShiftY * 0.7,
          width: 275,
          height: 44,
          transformOrigin: '0% 50%',
          transform: `rotate(${15 + gripShiftY * 0.35}deg)`,
          filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.35))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 0,
            width: 245,
            height: 44,
            borderRadius: '10px 22px 22px 10px',
            backgroundColor: turn.sleeve,
            borderBottom: `6px solid rgba(0,0,0,0.18)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 3,
            width: 22,
            height: 38,
            borderRadius: 4,
            backgroundColor: turn.cuff,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 5,
            width: 34,
            height: 34,
            borderRadius: '14px 8px 8px 14px',
            backgroundColor: C.creamLo,
            border: `3px solid ${C.inkSoft}`,
          }}
        />
      </div>
    </div>
  );
};

const TurnCounterBadge: React.FC = () => {
  const f = useCurrentFrame();
  const activeCount = f < 22 ? 0 : f < 60 ? 1 : f < 98 ? 2 : 3;
  const isFinal = activeCount === 3;

  const popScale =
    f < 22
      ? 1
      : f < 30
        ? interpolate(f, [22, 26, 30], [1, 1.14, 1], CLAMP)
        : f < 60
          ? 1
          : f < 68
            ? interpolate(f, [60, 64, 68], [1, 1.14, 1], CLAMP)
            : f < 98
              ? 1
              : interpolate(f, [98, 103, 110], [1, 1.22, 1], CLAMP);

  return (
    <PopIn at={14}>
      <Boil seed="m09-counter" amp={0.4} rot={0.05}>
        <div
          style={{
            position: 'absolute',
            left: 1065,
            top: 152,
            width: 152,
            height: 118,
            rotate: '2deg',
            transform: `scale(${popScale})`,
            backgroundColor: C.cream,
            padding: '12px 16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.36))',
          }}
        >
          {/* Tiga titik penanda giliran pimpinan */}
          <div style={{display: 'flex', gap: 10, marginTop: 2}}>
            {[1, 2, 3].map((step) => {
              const lit = activeCount >= step;
              const dotColor =
                step === 1 ? ROOM.navy : step === 2 ? ROOM.terracotta : ROOM.teal;
              return (
                <div
                  key={step}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: lit ? dotColor : C.creamLo,
                    border: `2px solid ${C.inkSoft}`,
                  }}
                />
              );
            })}
          </div>
          {/* Angka penghitung kecil "3" mengikuti setiap giliran */}
          <div
            style={{
              fontFamily: FONT.caption,
              fontWeight: 900,
              fontSize: 58,
              lineHeight: 1,
              color: isFinal ? C.tag : C.ink,
              opacity: activeCount > 0 ? 1 : 0.25,
            }}
          >
            {Math.max(1, activeCount)}
          </div>
        </div>
        <SparkleBurst at={98} x={1140} y={208} seed="m09-three" spread={55} />
      </Boil>
    </PopIn>
  );
};

export const M09: React.FC = () => {
  const f = useCurrentFrame();

  // Gerak maju konstan mesin dapur di atas lintasan (mesin tetap melaju mulus)
  const drivePx = f * 2.1;
  const wheelRot = drivePx * 1.45;
  const machineEnterX = interpolate(f, [0, 20], [-140, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Sudut putar roda kemudi mengikuti 3 pergantian pimpinan (Scene 072) lalu terus berganti arah (Scene 073)
  const wheelDeg = interpolate(
    f,
    [0, 20, 28, 52, 60, 68, 90, 98, 108, 152, 166, 204, 218, 256, 270, 313],
    [0, 0, -38, -32, -10, 42, 36, 12, -34, -30, 34, 30, -28, -24, 22, 18],
    CLAMP,
  );

  // Setiap pergantian kemudi, bodi mesin sempat terhuyung sedikit tanpa menghentikan mesin
  const lurchPulse = (at: number, amp: number) =>
    interpolate(f, [at, at + 5, at + 13, at + 24], [0, amp, -amp * 0.35, 0], CLAMP);

  const hullTiltDeg =
    lurchPulse(22, -2.7) +
    lurchPulse(60, 3.0) +
    lurchPulse(98, -2.6) +
    lurchPulse(156, 2.2) +
    lurchPulse(208, -2.0) +
    lurchPulse(260, 1.8);

  const hullBobY = Math.sin(f * 0.42) * 1.8;
  const gaugeNeedleDeg = -45 + Math.sin(f * 0.25) * 12;

  const baseX = 210 + machineEnterX;
  const wheelCx = baseX + 615;
  const wheelCy = 418;

  return (
    <Stage dur={M09_DUR} banner="PERGANTIAN PIMPINAN BADAN" bannerSize={44}>
      <OrbitCamera
        dur={M09_DUR}
        yaw={14}
        push={1.06}
        focus={0.5}
        depth={620}
        origin={[640, 490]}
      >
        <Depth z={0.2}>
          <BackDecor />
        </Depth>

        <Depth z={0.5}>
          <TrackRail scrollPx={drivePx} />

          {/* Mesin dapur raksasa dari potongan kertas */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {/* Sasis bawah & 4 roda baja yang terus berputar stabil */}
            <Paper lift={6}>
              <Slab
                x={baseX + 24}
                y={526}
                w={575}
                h={34}
                color={C.board}
                shade={C.boardLo}
                shadeH={0.35}
                r={6}
              />
              <Slab
                x={baseX + 52}
                y={516}
                w={520}
                h={14}
                color={C.brassLo}
                hi={C.brass}
                hiH={0.35}
                r={3}
              />
            </Paper>

            {[92, 232, 392, 532].map((dx, i) => (
              <PaperWheel key={i} cx={baseX + dx} cy={556} r={32} rotDeg={wheelRot} />
            ))}

            {/* Bodi utama mesin dapur yang sedikit terhuyung setiap kali kemudi diputar */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: `${baseX + 315}px 526px`,
                transform: `translateY(${hullBobY}px) rotate(${hullTiltDeg}deg)`,
              }}
            >
              {/* Cerobong asap & uap kertas yang mengepul ritmis */}
              <Paper lift={5}>
                <Slab
                  x={baseX + 104}
                  y={184}
                  w={44}
                  h={96}
                  color={C.boardHi}
                  shade={C.boardLo}
                  shadeH={0.2}
                  r={4}
                />
                <Slab
                  x={baseX + 94}
                  y={176}
                  w={64}
                  h={16}
                  color={C.brass}
                  shade={C.brassLo}
                  shadeH={0.35}
                  r={4}
                />
              </Paper>

              {[0, 1, 2].map((p) => {
                const cycle = ((f + p * 22) % 66) / 66;
                const puffY = 160 - cycle * 68;
                const puffX = baseX + 126 - cycle * 34;
                const puffR = 12 + cycle * 14;
                const puffOp = interpolate(cycle, [0, 0.25, 0.85, 1], [0, 0.78, 0.45, 0], CLAMP);
                return (
                  <div
                    key={p}
                    style={{
                      position: 'absolute',
                      left: puffX - puffR,
                      top: puffY - puffR,
                      width: puffR * 2,
                      height: puffR * 2,
                      borderRadius: '50%',
                      backgroundColor: C.cream,
                      opacity: puffOp,
                    }}
                  />
                );
              })}

              {/* Kuali besar di atas dapur yang terus memasak */}
              <Paper lift={6}>
                <Slab
                  x={baseX + 225}
                  y={202}
                  w={210}
                  h={78}
                  color={C.metalLo}
                  hi={C.metal}
                  hiH={0.22}
                  shade={C.boardHi}
                  shadeH={0.18}
                  r="8px 8px 34px 34px"
                />
                <Slab
                  x={baseX + 213}
                  y={192}
                  w={234}
                  h={18}
                  color={C.brass}
                  shade={C.brassLo}
                  shadeH={0.35}
                  r={5}
                />
              </Paper>

              {/* Badan kabin utama mesin dapur */}
              <Paper lift={8}>
                <Slab
                  x={baseX + 44}
                  y={272}
                  w={535}
                  h={246}
                  color={C.sage}
                  hi="#9FB09B"
                  hiH={0.1}
                  shade={C.sageLo}
                  shadeH={0.14}
                  r={14}
                />
                {/* Kabin kemudi depan */}
                <Slab
                  x={baseX + 438}
                  y={296}
                  w={158}
                  h={222}
                  color={C.cream}
                  shade={C.creamLo}
                  shadeH={0.14}
                  r="10px 18px 10px 10px"
                />
                {/* Jendela kaca ruang kemudi */}
                <Slab
                  x={baseX + 462}
                  y={316}
                  w={112}
                  h={76}
                  color="#9DB7C9"
                  shade="#7B99AE"
                  shadeH={0.2}
                  r={8}
                />
                {/* Sabuk kuningan pengikat bodi mesin */}
                <Slab
                  x={baseX + 40}
                  y={386}
                  w={404}
                  h={16}
                  color={C.brass}
                  shade={C.brassLo}
                  shadeH={0.35}
                  r={3}
                />
              </Paper>

              {/* Roda gigi kertas yang terus berputar sinkron */}
              <PaperGear
                cx={baseX + 135}
                cy={332}
                r={36}
                teeth={8}
                rotDeg={wheelRot * 0.9}
                color={C.brass}
              />
              <PaperGear
                cx={baseX + 202}
                cy={346}
                r={26}
                teeth={6}
                rotDeg={-wheelRot * 1.2 + 15}
                color={C.metal}
              />

              {/* Manometer tekanan (jarum bergerak stabil, tanpa angka) */}
              <div
                style={{
                  position: 'absolute',
                  left: baseX + 266,
                  top: 300,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: C.creamHi,
                  border: `5px solid ${C.brassLo}`,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 25,
                    top: 6,
                    width: 4,
                    height: 22,
                    backgroundColor: C.go,
                    borderRadius: 2,
                    transformOrigin: '50% 21px',
                    transform: `rotate(${gaugeNeedleDeg}deg)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 22,
                    top: 22,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: C.ink,
                  }}
                />
              </div>

              {/* Jalur keluaran kotak makan di bagian bawah mesin (bekerja lancar) */}
              <Paper lift={5}>
                <Slab
                  x={baseX + 74}
                  y={422}
                  w={336}
                  h={72}
                  color={C.boardLo}
                  r={8}
                />
                <Slab
                  x={baseX + 82}
                  y={476}
                  w={320}
                  h={12}
                  color={C.metalLo}
                  r={4}
                />
              </Paper>
              {[0, 1, 2].map((b) => {
                const boxOffset = ((drivePx * 0.9 + b * 105) % 275);
                return (
                  <div
                    key={b}
                    style={{
                      position: 'absolute',
                      left: baseX + 94 + boxOffset,
                      top: 444,
                      width: 48,
                      height: 30,
                      borderRadius: 4,
                      backgroundColor: C.creamHi,
                      borderBottom: `6px solid ${C.tape}`,
                      boxShadow: '1px 2px 4px rgba(0,0,0,0.28)',
                    }}
                  />
                );
              })}

              {/* Poros dan roda kemudi besar di bagian depan mesin */}
              <Paper lift={5}>
                <Slab
                  x={baseX + 586}
                  y={408}
                  w={36}
                  h={20}
                  color={C.boardHi}
                  r={4}
                />
              </Paper>
              <SteeringHelm cx={wheelCx} cy={wheelCy} rotDeg={wheelDeg} />
            </div>

            {/* Tiga pasang lengan kertas dengan baju berbeda bergantian memegang kemudi */}
            {TURNS.map((turn, idx) => (
              <ArmPair
                key={idx}
                turn={turn}
                wheelCx={wheelCx}
                wheelCy={wheelCy}
                wheelDeg={wheelDeg}
              />
            ))}
          </div>
        </Depth>

        <Depth z={0.75}>
          <TurnCounterBadge />
        </Depth>
      </OrbitCamera>
    </Stage>
  );
};