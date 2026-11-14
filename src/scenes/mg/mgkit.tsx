// Shared papercut stage + helpers for the 13 kelas-menengah MG scenes.
// Landscape 1280x720. Built only from dimension-agnostic kit primitives
// (Slab/Paper/Pill/PopIn/Boil) + plain divs. Never Room/TapeBanner:
// both hardcode vertical 1080x1920 coordinates.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {Boil, CameraPush, GrainOverlay, Paper, PaperDefs, Pill, PopIn, Slab, SlideIn} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';

export {Boil, Paper, Pill, PopIn, Slab, SlideIn};

export const FLOOR_Y = 600;

export const fmtID = (v: number, dec = 2) => v.toFixed(dec).replace('.', ',');

const Banner: React.FC<{text: string; size?: number}> = ({text, size = 46}) => (
  <PopIn at={0}>
    <Boil seed="banner">
      <div style={{position: 'absolute', top: 44, left: '50%', translate: '-50% 0', rotate: '-1deg'}}>
        <div
          style={{
            backgroundColor: C.cream, padding: '20px 36px 22px', textAlign: 'center',
            fontFamily: FONT.banner, fontSize: size, lineHeight: 1.05, color: C.ink,
            letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            filter: 'url(#torn) drop-shadow(2px 6px 8px rgba(0,0,0,0.38))',
          }}
        >
          {text}
        </div>
        {[{left: -28, rotate: '-35deg'}, {right: -28, rotate: '35deg'}].map((p, i) => (
          <div key={i} style={{position: 'absolute', top: -14, width: 100, height: 36, background: C.tape, opacity: 0.8, filter: 'url(#torn)', ...p}} />
        ))}
      </div>
    </Boil>
  </PopIn>
);

export const Stage: React.FC<{dur: number; banner: string; bannerSize?: number; corner?: string; children: React.ReactNode}> = ({dur, banner, bannerSize, corner, children}) => (
  <AbsoluteFill style={{backgroundColor: C.creamHi}}>
    <PaperDefs />
    <FilmWeave>
      <CameraPush dur={dur} to={1.05} origin="50% 45%">
        <Slab x={0} y={0} w={1280} h={720} color={C.creamHi} r={0} grain={0.55} />
        <AbsoluteFill
          style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.30) 100%)'}}
        />
        <Slab x={0} y={FLOOR_Y} w={1280} h={720 - FLOOR_Y} color={C.floor} r={0} grain={0.6} />
        <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 38, height: 3, background: C.floorLo, opacity: 0.8}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR_Y + 78, height: 3, background: C.floorLo, opacity: 0.8}} />
        <Slab x={0} y={FLOOR_Y - 24} w={1280} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
        <AbsoluteFill style={{top: FLOOR_Y, height: 60, background: 'linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0) 60px)'}} />
        <Banner text={banner} size={bannerSize} />
        {corner ? (
          <div
            style={{
              position: 'absolute', top: 24, right: 28, rotate: '2deg', background: C.tape,
              padding: '8px 16px', fontFamily: FONT.label, fontWeight: 800, fontSize: 22,
              letterSpacing: '0.08em', color: C.ink,
              filter: 'url(#torn) drop-shadow(1px 3px 5px rgba(0,0,0,0.3))',
            }}
          >
            {corner}
          </div>
        ) : null}
        {children}
      </CameraPush>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

export const Tag: React.FC<{x: number; y: number; text: string; at: number; bg?: string; color?: string; size?: number; rot?: number; seed?: string}> = ({x, y, text, at, bg = C.tag, color = C.tagText, size = 34, rot = -2, seed = 'tag'}) => (
  <PopIn at={at}>
    <Boil seed={seed}>
      <div
        style={{
          position: 'absolute', left: x, top: y, translate: '-50% 0', rotate: `${rot}deg`, whiteSpace: 'nowrap',
          backgroundColor: bg, padding: '12px 22px 14px',
          fontFamily: FONT.caption, fontWeight: 900, fontSize: size, color, lineHeight: 1,
          filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.38))',
        }}
      >
        {text}
      </div>
    </Boil>
  </PopIn>
);

// Vertical bar that grows + counts up over its cue, like the approved MG-03 bars.
// The number label stays hidden until the cue starts (never shows 0,00).
export const BarV: React.FC<{
  cx: number; w: number; h: number; color: string; shade: string; hi: string;
  value: number; decimals?: number; unit?: string; prefix?: string;
  cue: readonly [number, number]; labelSize?: number; pill?: string;
}> = ({cx, w, h, color, shade, hi, value, decimals = 2, unit, prefix = '', cue, labelSize = 58, pill}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [cue[0], cue[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const bh = Math.max(0, Math.round(h * u));
  const val = value * u;
  const labelOpacity = interpolate(f, [cue[0], cue[0] + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Paper>
        <Slab x={cx - w / 2} y={FLOOR_Y - bh} w={w} h={bh} color={color} shade={shade} shadeH={0.14} hi={hi} hiH={0.08} r={6} />
      </Paper>
      <div
        style={{
          position: 'absolute', left: cx, top: FLOOR_Y - bh - 82, translate: '-50% 0', whiteSpace: 'nowrap',
          fontFamily: FONT.caption, fontWeight: 900, fontSize: labelSize, color: C.ink, lineHeight: 1, opacity: labelOpacity,
          textShadow: '2px 3px 0 rgba(0,0,0,0.12)',
        }}
      >
        {prefix}{fmtID(val, decimals)}{unit ? ` ${unit}` : ''}
      </div>
      {pill ? (
        <PopIn at={cue[0]}>
          <Pill x={cx} y={FLOOR_Y + 46} text={pill} bg={C.ink} color="#F3EEE6" size={34} />
        </PopIn>
      ) : null}
    </>
  );
};

// Big counting number with no bar. Counts over its cue, hidden before it.
export const CountLabel: React.FC<{
  x: number; y: number; value: number; decimals?: number; prefix?: string; suffix?: string;
  cue: readonly [number, number]; size?: number; color?: string;
}> = ({x, y, value, decimals = 2, prefix = '', suffix = '', cue, size = 84, color = C.ink}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [cue[0], cue[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(f, [cue[0], cue[0] + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, translate: '-50% 0', whiteSpace: 'nowrap',
        fontFamily: FONT.caption, fontWeight: 900, fontSize: size, color, lineHeight: 1, opacity,
        textShadow: '2px 3px 0 rgba(0,0,0,0.12)',
      }}
    >
      {prefix}{fmtID(value * u, decimals)}{suffix}
    </div>
  );
};

// Faceless paper person. (x, y) is the feet position, bottom-center.
export const Figure: React.FC<{x: number; y: number; s?: number; shirt?: string}> = ({x, y, s = 1, shirt = ROOM.dusk}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 90 * s, height: 190 * s, translate: '-50% -100%'}}>
    <div style={{position: 'absolute', left: '50%', top: 0, width: 54 * s, height: 54 * s, translate: '-50% 0', borderRadius: '50%', background: C.creamLo, border: `${3 * s}px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', left: '50%', top: 62 * s, width: 64 * s, height: 84 * s, translate: '-50% 0', background: shirt, borderRadius: 10 * s}} />
    <div style={{position: 'absolute', left: '50%', top: 146 * s, width: 24 * s, height: 44 * s, translate: '-110% 0', background: C.inkSoft, borderRadius: 6 * s}} />
    <div style={{position: 'absolute', left: '50%', top: 146 * s, width: 24 * s, height: 44 * s, translate: '10% 0', background: C.inkSoft, borderRadius: 6 * s}} />
  </div>
);

// Vertical arrow that grows over its cue. dir=1 points up (grows upward from
// yBase), dir=-1 points down (grows downward from yBase).
export const ArrowV: React.FC<{x: number; yBase: number; h: number; color: string; dir: 1 | -1; cue: readonly [number, number]}> = ({x, yBase, h, color, dir, cue}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [cue[0], cue[1]], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const ah = Math.max(0, h * u);
  const head = 34;
  const stemH = Math.max(0, ah - head);
  const top = dir === 1 ? yBase - ah : yBase;
  return (
    <div style={{position: 'absolute', left: x, top, width: 54, height: ah, translate: '-50% 0', opacity: u > 0 ? 1 : 0}}>
      {dir === 1 ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, width: 54, height: head, background: color, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}} />
          <div style={{position: 'absolute', left: 18, top: head - 2, width: 18, height: stemH, background: color}} />
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 18, top: 0, width: 18, height: stemH, background: color}} />
          <div style={{position: 'absolute', left: 0, top: Math.max(0, stemH - 2), width: 54, height: head, background: color, clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'}} />
        </>
      )}
    </div>
  );
};
