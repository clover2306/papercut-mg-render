// MG-03 — Kelas menengah menyusut 57,33 -> 47,85 juta. Scenes 048-050, 489f.
// Same approved visuals as the ContohMG example, re-timed to the exact
// narration span (153.30-169.60): bars grow over their whole sentences.
import React from 'react';
import {C} from '../../lib/tokens';
import {BarV, Boil, Stage, Tag} from './mgkit';

export const MG03_DUR = 489;

export const MG03: React.FC = () => (
  <Stage dur={MG03_DUR} banner="Kelas Menengah Menyusut">
    <Boil seed="bars" amp={1.2}>
      <BarV cx={450} w={240} h={330} color="#2F5A5A" shade="#234343" hi="#3E6E6E" value={57.33} unit="JUTA" cue={[0, 152]} pill="2019" />
      <BarV cx={830} w={240} h={275} color={C.hero} shade={C.heroLo} hi="#E08A6F" value={47.85} unit="JUTA" cue={[177, 364]} pill="2024" />
    </Boil>
    <Tag x={900} y={158} text="-9,48 JUTA KELUAR" at={406} size={38} seed="tag1" />
  </Stage>
);
