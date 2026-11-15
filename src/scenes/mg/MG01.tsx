// MG-01 — Saldo tinggal seperempat (hook). Scenes 005-008, 368f.
// Balance bar drains 100% -> 25% as the narration says "tinggal seperempat".
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG01_DUR = 368;
const DRAIN: readonly [number, number] = [247, 300];

const Gauge: React.FC = () => {
  const f = useCurrentFrame();
  const u = interpolate(f, [DRAIN[0], DRAIN[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const pct = 100 - 75 * u;
  const fillW = Math.round(900 * (pct / 100));
  return (
    <>
      <div
        style={{
          position: 'absolute', left: 640, top: 196, translate: '-50% 0',
          fontFamily: FONT.label, fontWeight: 800, fontSize: 26, letterSpacing: '0.22em', color: C.inkSoft,
        }}
      >
        SALDO
      </div>
      <div
        style={{
          position: 'absolute', left: 640, top: 228, translate: '-50% 0',
          fontFamily: FONT.caption, fontWeight: 900, fontSize: 96, color: C.ink, lineHeight: 1,
          textShadow: '2px 3px 0 rgba(0,0,0,0.12)',
        }}
      >
        {Math.round(pct)}%
      </div>
      <Slab x={190} y={350} w={900} h={64} color={C.creamLo} r={10} grain={0.4} />
      <Slab x={190} y={350} w={fillW} h={64} color={ROOM.teal} shade="#234343" shadeH={0.2} hi="#3E6E6E" hiH={0.1} r={10} />
      <div style={{position: 'absolute', left: 190 + 225, top: 336, width: 4, height: 92, background: C.tag, opacity: 0.9}} />
      <div
        style={{
          position: 'absolute', left: 190 + 225, top: 436, translate: '-50% 0',
          fontFamily: FONT.label, fontWeight: 800, fontSize: 24, color: C.tag,
        }}
      >
        ¼
      </div>
    </>
  );
};

export const MG01: React.FC = () => (
  <Stage dur={MG01_DUR} banner="Saldo Tinggal Seperempat">
    <PopIn at={46}>
      <Boil seed="gauge" amp={0.4} rot={0.05}>
        <Gauge />
      </Boil>
    </PopIn>
    <Tag x={640} y={492} text="SEPEREMPAT" at={284} seed="tag1" />
    <Tag x={640} y={566} text="BUKAN KARENA KAMU BOROS" at={328} bg={C.ink} color="#F3EEE6" size={28} seed="tag2" />
  </Stage>
);
