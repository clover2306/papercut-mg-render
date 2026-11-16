// MG-13 — Dulu vs sekarang, satu penghasilan. Scenes 202-207, 561f.
// Split screen: full bars on the "dulu" side, shorter bars with tags on the
// "sekarang" side. No numbers, a comparison of conditions.
import React from 'react';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG13_DUR = 561;

const ROWS = [
  {label: 'RUMAH', y: 300, leftAt: 86, rightAt: 372, rightW: 120, tag: 'LEBIH JAUH', tagAt: 427},
  {label: 'SEKOLAH ANAK', y: 400, leftAt: 139, rightAt: 465, rightW: 160, tag: 'LEBIH MAHAL', tagAt: 482},
  {label: 'TABUNGAN', y: 500, leftAt: 182, rightAt: 523, rightW: 50, tag: 'LEBIH TIPIS', tagAt: 541},
] as const;

const RowLabel: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, translate: '-50% 0',
      fontFamily: FONT.label, fontWeight: 800, fontSize: 24, letterSpacing: '0.14em', color: C.inkSoft,
    }}
  >
    {text}
  </div>
);

export const MG13: React.FC = () => (
  <Stage dur={MG13_DUR} banner="Dulu vs Sekarang">
    <div style={{position: 'absolute', left: 640, top: 180, width: 3, height: 400, background: C.creamLo}} />
    <PopIn at={0}>
      <Pill x={320} y={200} text="DULU • SATU PENGHASILAN" bg={ROOM.teal} color="#F3EEE6" size={24} />
    </PopIn>
    <PopIn at={301}>
      <Pill x={960} y={200} text="SEKARANG • SUAMI-ISTRI BEKERJA" bg={C.hero} color="#F3EEE6" size={24} />
    </PopIn>
    {ROWS.map((row) => (
      <React.Fragment key={row.label}>
        <RowLabel x={320} y={row.y - 42} text={row.label} />
        <RowLabel x={960} y={row.y - 42} text={row.label} />
        <PopIn at={row.leftAt}>
          <Slab x={210} y={row.y - 10} w={220} h={40} color={ROOM.teal} shade="#234343" shadeH={0.2} hi="#3E6E6E" hiH={0.1} r={6} />
        </PopIn>
        <PopIn at={row.rightAt}>
          <Slab x={850} y={row.y - 10} w={row.rightW} h={40} color={C.hero} shade={C.heroLo} shadeH={0.2} hi="#E08A6F" hiH={0.1} r={6} />
        </PopIn>
        <Tag x={1100} y={row.y - 16} text={row.tag} at={row.tagAt} size={22} seed={`tag-${row.label}`} />
      </React.Fragment>
    ))}
  </Stage>
);
