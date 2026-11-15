// MG-05 — PTKP Rp54 juta beku 10 tahun. Scenes 092-096, 442f.
// The Rp54 jt slab stays frozen while the year marker travels 2016->2026
// and price steps climb above the timeline.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {CountLabel, Pill, PopIn, Slab, Stage, Tag} from './mgkit';

export const MG05_DUR = 442;
const TRACK_Y = 470;

const Marker: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 340], [200, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute', left: x, top: TRACK_Y, width: 30, height: 30, translate: '-50% -50%',
        borderRadius: '50%', background: C.hero, border: `3px solid ${C.inkSoft}`,
      }}
    />
  );
};

export const MG05: React.FC = () => (
  <Stage dur={MG05_DUR} banner="PTKP Membeku, Harga Naik">
    <CountLabel x={420} y={238} value={54} decimals={0} prefix="Rp" suffix=" JUTA" cue={[78, 122]} size={80} />
    <PopIn at={78}>
      <Pill x={420} y={366} text="PER TAHUN, TIDAK BERUBAH" bg={C.ink} color="#F3EEE6" size={26} />
    </PopIn>
    <div style={{position: 'absolute', left: 140, right: 140, top: TRACK_Y, height: 4, background: C.creamLo}} />
    <Marker />
    <PopIn at={0}>
      <Pill x={200} y={526} text="2016" bg={C.ink} color="#F3EEE6" size={30} />
    </PopIn>
    <PopIn at={218}>
      <Pill x={1080} y={526} text="2026" bg={C.ink} color="#F3EEE6" size={30} />
    </PopIn>
    {[40, 80, 120, 160].map((h, i) => (
      <PopIn key={i} at={369 + i * 16}>
        <Slab x={790 + i * 80} y={TRACK_Y - h} w={60} h={h} color={ROOM.teal} shade="#234343" shadeH={0.2} hi="#3E6E6E" hiH={0.1} r={5} />
      </PopIn>
    ))}
    <PopIn at={369}>
      <div
        style={{
          position: 'absolute', left: 920, top: 238, translate: '-50% 0',
          fontFamily: FONT.label, fontWeight: 800, fontSize: 26, letterSpacing: '0.18em', color: C.inkSoft,
        }}
      >
        HARGA
      </div>
    </PopIn>
    <Tag x={640} y={168} text="10 TAHUN TIDAK BERUBAH" at={263} size={32} seed="tag1" />
  </Stage>
);
