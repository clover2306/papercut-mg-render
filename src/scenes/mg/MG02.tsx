// MG-02 — Kabar baik dan kabar buruk, keduanya benar. Scenes 042-047, 695f.
// Left: economy grows past 5% (up arrow). Right: poverty falls to 8,07%
// (level counts up, arrow points down for the direction of change).
import React from 'react';
import {C, ROOM} from '../../lib/tokens';
import {ArrowV, CountLabel, Pill, PopIn, Stage, Tag} from './mgkit';

export const MG02_DUR = 695;

export const MG02: React.FC = () => (
  <Stage dur={MG02_DUR} banner="Kabar Baik dan Kabar Buruk" bannerSize={42}>
    <div style={{position: 'absolute', left: 640, top: 190, width: 3, height: 380, background: C.creamLo, opacity: 0.9}} />
    <PopIn at={0}>
      <Pill x={340} y={212} text="EKONOMI TUMBUH" bg={C.ink} color="#F3EEE6" size={30} />
    </PopIn>
    <PopIn at={12}>
      <Pill x={940} y={212} text="KEMISKINAN" bg={C.ink} color="#F3EEE6" size={30} />
    </PopIn>
    <CountLabel x={340} y={268} value={5} decimals={0} prefix="> " suffix="%" cue={[176, 240]} size={96} />
    <CountLabel x={940} y={268} value={8.07} decimals={2} suffix="%" cue={[243, 365]} size={96} />
    <ArrowV x={340} yBase={540} h={120} color={ROOM.teal} dir={1} cue={[176, 240]} />
    <ArrowV x={940} yBase={420} h={120} color={C.hero} dir={-1} cue={[243, 365]} />
    <PopIn at={342}>
      <Pill x={940} y={576} text="MARET 2026" bg={C.creamLo} color={C.ink} size={26} />
    </PopIn>
    <Tag x={640} y={548} text="KEDUANYA BENAR" at={403} seed="tag1" />
  </Stage>
);
