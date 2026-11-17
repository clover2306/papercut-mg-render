// MG-11 — Tiga jepitan saling mengunci. Scenes 169-174, 749f. Three
// interlocked rings, each highlighted as its squeeze is named; the cushion
// fades, one shock shakes the cluster, and it drops one level.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Pill, PopIn, Stage, Tag} from './mgkit';

export const MG11_DUR = 749;

const Ring: React.FC<{cx: number; cy: number; color: string; hot: readonly [number, number]; at: number}> = ({cx, cy, color, hot, at}) => {
  const f = useCurrentFrame();
  const heat = interpolate(f, [hot[0], hot[0] + 10, hot[1] - 10, hot[1]], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = 1 + 0.05 * heat;
  const border = 12 + Math.round(6 * heat);
  return (
    <PopIn at={at}>
      <div
        style={{
          position: 'absolute', left: cx, top: cy, width: 210, height: 210, translate: '-50% -50%',
          borderRadius: '50%', border: `${border}px solid ${heat > 0.5 ? C.tag : color}`,
          transform: `scale(${scale})`, background: 'transparent',
        }}
      />
    </PopIn>
  );
};

const Cluster: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f >= 671 && f < 685 ? Math.sin((f - 671) * 2.2) * 4 : 0;
  const drop = interpolate(f, [685, 713], [0, 26], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cushion = interpolate(f, [326, 431], [1, 0.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{transform: `translate(${shake}px, ${drop}px)`}}>
      <Ring cx={500} cy={320} color={ROOM.teal} hot={[69, 172]} at={0} />
      <Ring cx={780} cy={320} color={ROOM.mustard} hot={[205, 288]} at={14} />
      <Ring cx={640} cy={430} color={C.hero} hot={[458, 639]} at={28} />
      <PopIn at={0}>
        <Pill x={500} y={188} text="PAJAK MEMBEKU" bg={C.ink} color="#F3EEE6" size={24} />
      </PopIn>
      <PopIn at={14}>
        <Pill x={780} y={188} text="BIAYA HIDUP NAIK" bg={C.ink} color="#F3EEE6" size={24} />
      </PopIn>
      <PopIn at={28}>
        <Pill x={640} y={472} text="UTANG" bg={C.ink} color="#F3EEE6" size={24} />
      </PopIn>
      <div style={{opacity: cushion}}>
        <PopIn at={326}>
          <Pill x={1050} y={430} text="BANTALAN" bg={C.creamLo} color={C.ink} size={22} />
        </PopIn>
      </div>
    </div>
  );
};

export const MG11: React.FC = () => (
  <Stage dur={MG11_DUR} banner="Tiga Jepitan Saling Mengunci" bannerSize={38}>
    <Cluster />
    <Tag x={640} y={382} text="SALING MENGUNCI" at={56} bg={C.ink} color="#F3EEE6" size={30} seed="tag1" />
    <Tag x={1010} y={210} text="1 GUNCANGAN" at={671} size={28} seed="tag2" />
    <Tag x={640} y={596} text="TURUN SATU KELAS" at={713} size={30} seed="tag3" />
  </Stage>
);
