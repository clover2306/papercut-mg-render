// MG-09 — Keluarga 4 orang, Rp12 jt -> Rp3 jt per orang. Scenes 140-144,
// 433f. One Rp12 jt stack splits into four Rp3 jt shares. ILLUSTRATION.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {CountLabel, Figure, Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG09_DUR = 433;

const SplitSlabs: React.FC = () => {
  const f = useCurrentFrame();
  const targets = [250, 510, 770, 1030];
  return (
    <>
      {targets.map((tx, i) => {
        const cue0 = 250 + i * 10;
        const x = interpolate(f, [cue0, cue0 + 50], [640, tx], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const opacity = interpolate(f, [250, 262], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{opacity}}>
            <Figure x={x} y={330} s={0.5} shirt={i % 2 === 0 ? ROOM.dusk : C.sage} />
            <Slab x={x - 100} y={330} w={200} h={110} color={ROOM.teal} shade="#234343" shadeH={0.2} hi="#3E6E6E" hiH={0.1} r={8} />
            <div
              style={{
                position: 'absolute', left: x, top: 366, translate: '-50% 0', whiteSpace: 'nowrap',
                fontFamily: FONT.caption, fontWeight: 900, fontSize: 34, color: '#F3EEE6',
              }}
            >
              Rp3 JUTA
            </div>
          </div>
        );
      })}
    </>
  );
};

const BigTotal: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [250, 272], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity}}>
      <CountLabel x={640} y={238} value={12} decimals={0} prefix="Rp" suffix=" JUTA" cue={[190, 218]} size={88} />
      <PopIn at={200}>
        <Pill x={640} y={366} text="SEBULAN" bg={C.creamLo} color={C.ink} size={26} />
      </PopIn>
    </div>
  );
};

export const MG09: React.FC = () => (
  <Stage dur={MG09_DUR} banner="Hitungan Sederhana" corner="ILUSTRASI">
    <PopIn at={42}>
      <Pill x={640} y={168} text="KELUARGA 4 ORANG" bg={C.ink} color="#F3EEE6" size={28} />
    </PopIn>
    <BigTotal />
    <SplitSlabs />
    <Tag x={640} y={500} text="DI ATAS BATAS BAWAH" at={347} size={30} seed="tag1" />
  </Stage>
);
