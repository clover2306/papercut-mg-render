// MG-06 — Tiga jepitan bersamaan: belanja naik, tabungan turun, utang
// melonjak. Scenes 108-112, 317f. Directions only, no invented numbers.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG06_DUR = 317;

const Gauge: React.FC<{cx: number; label: string; mode: 'rise' | 'fall' | 'rocket'; cue: readonly [number, number]; color: string; shade: string; hi: string}> = ({cx, label, mode, cue, color, shade, hi}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [cue[0], cue[1]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const full = mode === 'rocket' ? 220 : 180;
  const h = mode === 'fall' ? Math.round(180 - 130 * u) : Math.round(full * u);
  return (
    <>
      <PopIn at={73}>
        <Pill x={cx} y={212} text={label} bg={C.ink} color="#F3EEE6" size={28} />
      </PopIn>
      <Slab x={cx - 40} y={280} w={80} h={260} color={C.creamLo} r={8} grain={0.3} />
      <Slab x={cx - 40} y={540 - h} w={80} h={h} color={color} shade={shade} shadeH={0.2} hi={hi} hiH={0.1} r={8} />
    </>
  );
};

export const MG06: React.FC = () => (
  <Stage dur={MG06_DUR} banner="Ketiganya Bersamaan">
    <PopIn at={0}>
      <Pill x={640} y={168} text="INDEKS BANK MANDIRI • JUNI 2026" bg={C.creamLo} color={C.ink} size={24} />
    </PopIn>
    <Gauge cx={300} label="BELANJA NAIK" mode="rise" cue={[155, 175]} color={ROOM.teal} shade="#234343" hi="#3E6E6E" />
    <Gauge cx={640} label="TABUNGAN TURUN" mode="fall" cue={[195, 215]} color={ROOM.mustard} shade="#8A6E33" hi="#C2A558" />
    <Gauge cx={980} label="UTANG MELONJAK" mode="rocket" cue={[239, 260]} color={C.hero} shade={C.heroLo} hi="#E08A6F" />
    <Tag x={640} y={576} text="DALAM WAKTU YANG SAMA" at={286} size={28} seed="tag1" />
  </Stage>
);
