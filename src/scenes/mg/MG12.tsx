// MG-12 — Lebih dari 81% konsumsi dari mereka. Scenes 182-184, 436f.
// One wide bar fills past 81% of all consumption.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {CountLabel, Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG12_DUR = 436;

const WideBar: React.FC = () => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, 161], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const fillW = Math.round(1000 * 0.81 * u);
  return (
    <>
      <Slab x={140} y={380} w={1000} h={80} color={C.creamLo} r={10} grain={0.4} />
      <Slab x={140} y={380} w={fillW} h={80} color={C.hero} shade={C.heroLo} shadeH={0.2} hi="#E08A6F" hiH={0.1} r={10} />
      <div style={{position: 'absolute', left: 140 + 810, top: 366, width: 4, height: 108, background: C.ink, opacity: 0.75}} />
    </>
  );
};

export const MG12: React.FC = () => (
  <Stage dur={MG12_DUR} banner="Lebih dari 81% Konsumsi" bannerSize={40}>
    <CountLabel x={640} y={238} value={81} decimals={0} prefix=">" suffix="%" cue={[0, 161]} size={110} />
    <WideBar />
    <PopIn at={0}>
      <Pill x={640} y={510} text="KONSUMSI MASYARAKAT" bg={C.ink} color="#F3EEE6" size={28} />
    </PopIn>
    <Tag x={640} y={570} text="LEBIH DARI 4/5 BELANJA NEGERI INI" at={196} size={28} seed="tag1" />
  </Stage>
);
