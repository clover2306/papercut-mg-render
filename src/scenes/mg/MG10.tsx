// MG-10 — 30 hari, 0 hari menabung. Scenes 154-157, 352f. A 30-box
// calendar fills day by day; the last week turns coral (paylater); not one
// box is for saving. ILLUSTRATION.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {PopIn, Slab, Stage, Tag} from './mgkit';

export const MG10_DUR = 352;

const Calendar: React.FC = () => {
  const f = useCurrentFrame();
  const boxes = [];
  for (let i = 0; i < 30; i++) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = 250 + col * 132;
    const y = 168 + row * 84;
    const visible = f >= Math.round(i * 6.6);
    const paylater = i >= 21 && f >= 88;
    boxes.push(
      <div key={i} style={{opacity: visible ? 1 : 0.14}}>
        <Slab x={x} y={y} w={120} h={72} color={paylater ? C.hero : C.cream} shade={C.creamLo} shadeH={0.25} r={6} grain={0.3} />
        <div
          style={{
            position: 'absolute', left: x + 60, top: y + 22, translate: '-50% 0',
            fontFamily: FONT.label, fontWeight: 800, fontSize: 26, color: paylater ? '#F3EEE6' : C.inkSoft,
          }}
        >
          {i + 1}
        </div>
      </div>,
    );
  }
  return <>{boxes}</>;
};

export const MG10: React.FC = () => (
  <Stage dur={MG10_DUR} banner="30 Hari, 0 Hari Menabung" bannerSize={40} corner="ILUSTRASI">
    <Calendar />
    <PopIn at={88}>
      <div
        style={{
          position: 'absolute', left: 640, top: 592, translate: '-50% 0', whiteSpace: 'nowrap',
          fontFamily: FONT.label, fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: '#F3EEE6',
        }}
      >
        MINGGU KE-4: PAYLATER
      </div>
    </PopIn>
    <Tag x={640} y={352} text="0 HARI UNTUK MENABUNG" at={294} size={38} seed="tag1" />
  </Stage>
);
