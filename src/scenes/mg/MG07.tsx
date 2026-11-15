// MG-07 — 86% pinjol untuk konsumsi. Scenes 113-115, 293f.
// 100-dot pictogram: 86 dots light up as the counter climbs to 86%.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {CountLabel, Pill, PopIn, Stage, Tag} from './mgkit';

export const MG07_DUR = 293;

const Dots: React.FC = () => {
  const f = useCurrentFrame();
  const lit = Math.floor(interpolate(f, [137, 230], [0, 86], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const dots = [];
  for (let i = 0; i < 100; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    dots.push(
      <div
        key={i}
        style={{
          position: 'absolute', left: 180 + col * 38, top: 190 + row * 38, width: 28, height: 28,
          borderRadius: '50%', background: i < lit ? C.hero : C.creamLo,
          border: `2px solid ${i < lit ? C.heroLo : C.creamLo}`,
        }}
      />,
    );
  }
  return <>{dots}</>;
};

export const MG07: React.FC = () => (
  <Stage dur={MG07_DUR} banner="Utang untuk Konsumsi">
    <Dots />
    <PopIn at={137}>
      <Pill x={920} y={220} text="PINJAMAN DARING" bg={C.ink} color="#F3EEE6" size={28} />
    </PopIn>
    <CountLabel x={920} y={276} value={86} decimals={0} suffix="%" cue={[137, 230]} size={110} />
    <Tag x={920} y={436} text="UNTUK KONSUMSI" at={220} size={30} seed="tag1" />
    <Tag x={920} y={506} text="BUKAN UNTUK MODAL" at={267} bg={C.ink} color="#F3EEE6" size={28} seed="tag2" />
  </Stage>
);
