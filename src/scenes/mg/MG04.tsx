// MG-04 — Batas bawah Rp2,1 juta, satu langkah mundur. Scenes 063-065, 428f.
// A faceless figure stands just above the threshold line, then steps back
// across it as the narration says "satu langkah mundur".
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {CountLabel, Figure, Pill, PopIn, Stage, Tag} from './mgkit';

export const MG04_DUR = 428;
const LINE_Y = 470;

const StepFigure: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [112, 122], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(f, [332, 380], [560, 710], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(f, [332, 380], [LINE_Y, LINE_Y + 74], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity}}>
      <Figure x={x} y={y} s={1.15} />
    </div>
  );
};

export const MG04: React.FC = () => (
  <Stage dur={MG04_DUR} banner="Sedekat Itu dengan Batas">
    <CountLabel x={640} y={238} value={2.1} decimals={1} prefix="Rp" suffix=" JUTA" cue={[34, 87]} size={84} />
    <PopIn at={56}>
      <Pill x={340} y={366} text="PER ORANG PER BULAN" bg={C.ink} color="#F3EEE6" size={28} />
    </PopIn>
    <div style={{position: 'absolute', left: 140, right: 140, top: LINE_Y, borderTop: '5px dashed #C9573C'}} />
    <div
      style={{
        position: 'absolute', right: 140, top: LINE_Y - 40, fontFamily: FONT.label,
        fontWeight: 800, fontSize: 24, letterSpacing: '0.08em', color: C.tag,
      }}
    >
      BATAS BAWAH
    </div>
    <StepFigure />
    <Tag x={640} y={168} text="BUKAN KELAS MENENGAH LAGI" at={380} size={30} seed="tag1" />
  </Stage>
);
