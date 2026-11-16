// MG-08 — INDEF: kelas menengah paling terganggu harga pokok. Scenes
// 134-136, 651f. Two "room to spend" bars under price pressure: the middle
// class bar compresses far more than the upper-middle bar.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, ROOM} from '../../lib/tokens';
import {ArrowV, Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG08_DUR = 651;

const RoomBar: React.FC<{cx: number; label: string; toH: number; color: string; shade: string; hi: string}> = ({cx, label, toH, color, shade, hi}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [356, 389], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const h = Math.round(220 - (220 - toH) * u);
  return (
    <>
      <PopIn at={150}>
        <Pill x={cx} y={212} text={label} bg={C.ink} color="#F3EEE6" size={28} />
      </PopIn>
      <Slab x={cx - 70} y={320} w={140} h={220} color={C.creamLo} r={8} grain={0.3} />
      <Slab x={cx - 70} y={540 - h} w={140} h={h} color={color} shade={shade} shadeH={0.2} hi={hi} hiH={0.1} r={8} />
    </>
  );
};

export const MG08: React.FC = () => (
  <Stage dur={MG08_DUR} banner="Paling Terganggu Harga Pokok" bannerSize={40}>
    <PopIn at={0}>
      <Pill x={640} y={168} text="INDEF • NOV 2026" bg={C.creamLo} color={C.ink} size={24} />
    </PopIn>
    <RoomBar cx={360} label="KELAS MENENGAH" toH={88} color={C.hero} shade={C.heroLo} hi="#E08A6F" />
    <RoomBar cx={920} label="MENENGAH ATAS" toH={168} color={ROOM.teal} shade="#234343" hi="#3E6E6E" />
    <ArrowV x={360} yBase={258} h={52} color={C.tag} dir={-1} cue={[248, 300]} />
    <ArrowV x={920} yBase={258} h={52} color={C.tag} dir={-1} cue={[248, 300]} />
    <Tag x={360} y={568} text="PALING TERGANGGU" at={222} size={30} seed="tag1" />
  </Stage>
);
