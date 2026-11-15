// Adegan P01 "Satu Hari yang Sama": gulungan diorama perjalanan sehari penuh dari fajar hingga malam.
// Mengikuti rutinitas pekerja kelas menengah tanpa angka atau teks visual, berakhir pada pose hening di cahaya ponsel.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, Slab, bob} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {FLOOR_Y} from './mgkit';

export const P01_DUR = 556;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const lerp = (f: number, a: number, b: number, v0: number, v1: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [v0, v1], {...CLAMP, easing});

// Tokoh utama "kamu": siluet kertas tanpa wajah, kemeja biru sabak, dan syal kertas hangat terakota.
const Protagonist: React.FC<{
  x: number;
  y?: number;
  pose: 'sitBed' | 'stand' | 'breakfast' | 'walk' | 'desk' | 'shop' | 'sofaBack';
  phase?: number;
  hasBag?: boolean;
  armLift?: number;
  phoneGlow?: number;
}> = ({x, y = FLOOR_Y, pose, phase = 0, hasBag = false, armLift = 0, phoneGlow = 0}) => {
  const shirt = '#4B749F';
  const shirtShade = '#37587B';
  const scarf = '#D96B43';
  const scarfShade = '#B3512E';
  const pants = '#2A2C34';
  const hair = '#26231F';

  if (pose === 'sofaBack') {
    // Tampak samping-belakang duduk di sofa malam memegang ponsel bercahaya kebiruan polos
    return (
      <div style={{position: 'absolute', left: x, top: y, width: 140, height: 175, translate: '-50% -100%'}}>
        <Paper lift={7}>
          {/* Kaki duduk ke arah kanan-depan */}
          <div style={{position: 'absolute', left: 58, top: 112, width: 54, height: 22, borderRadius: 10, background: pants}} />
          <div style={{position: 'absolute', left: 94, top: 116, width: 22, height: 56, borderRadius: 8, background: pants}} />
          {/* Badan sedikit menunduk tenang */}
          <div
            style={{
              position: 'absolute',
              left: 34,
              top: 46,
              width: 62,
              height: 78,
              borderRadius: '18px 18px 10px 10px',
              background: shirt,
              transform: 'rotate(11deg)',
              boxShadow: `inset -10px 0 0 ${shirtShade}`,
            }}
          />
          {/* Syal kertas hangat di bahu */}
          <div
            style={{
              position: 'absolute',
              left: 44,
              top: 44,
              width: 48,
              height: 18,
              borderRadius: 9,
              background: scarf,
              transform: 'rotate(8deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 56,
              width: 14,
              height: 36,
              borderRadius: 6,
              background: scarfShade,
              transform: 'rotate(-6deg)',
            }}
          />
          {/* Lengan memegang ponsel ke depan */}
          <div
            style={{
              position: 'absolute',
              left: 72,
              top: 72,
              width: 42,
              height: 15,
              borderRadius: 8,
              background: shirtShade,
              transform: 'rotate(14deg)',
            }}
          />
          {/* Kepala polos tanpa wajah, sedikit menunduk */}
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 4,
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#D5C7B6',
              border: `2.5px solid ${C.inkSoft}`,
            }}
          />
          {/* Rambut belakang */}
          <div
            style={{
              position: 'absolute',
              left: 43,
              top: 2,
              width: 36,
              height: 40,
              borderRadius: '24px 12px 18px 22px',
              background: hair,
            }}
          />
          {/* Ponsel kertas dengan cahaya polos kebiruan (tanpa isi layar) */}
          <div
            style={{
              position: 'absolute',
              left: 108,
              top: 60,
              width: 10,
              height: 24,
              borderRadius: 3,
              background: '#1E2430',
              transform: 'rotate(-22deg)',
            }}
          />
          {phoneGlow > 0.01 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 105,
                  top: 61,
                  width: 5,
                  height: 20,
                  borderRadius: 2,
                  background: '#CFE7FF',
                  opacity: phoneGlow,
                  transform: 'rotate(-22deg)',
                  boxShadow: `0 0 18px 8px rgba(145, 200, 255, ${0.75 * phoneGlow})`,
                }}
              />
              {/* Kerucut cahaya kebiruan lembut menerangi tangan dan bahu */}
              <div
                style={{
                  position: 'absolute',
                  left: 45,
                  top: 12,
                  width: 72,
                  height: 92,
                  background: `radial-gradient(circle at 88% 58%, rgba(162, 212, 255, ${0.42 * phoneGlow}) 0%, rgba(120, 175, 235, ${0.14 * phoneGlow}) 52%, rgba(0,0,0,0) 78%)`,
                  pointerEvents: 'none',
                }}
              />
            </>
          ) : null}
        </Paper>
      </div>
    );
  }

  const isSeated = pose === 'sitBed' || pose === 'breakfast' || pose === 'desk';
  const bodyTilt = pose === 'desk' ? 12 : pose === 'sitBed' ? -4 * armLift : pose === 'walk' ? 3 : 0;
  const legSwing = pose === 'walk' ? Math.sin(phase) * 9 : 0;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 110, height: 196, translate: '-50% -100%'}}>
      <Paper lift={6}>
        {/* Kaki */}
        {isSeated ? (
          <>
            <div style={{position: 'absolute', left: 46, top: 132, width: 42, height: 20, borderRadius: 8, background: pants}} />
            <div style={{position: 'absolute', left: 72, top: 136, width: 20, height: 58, borderRadius: 7, background: pants}} />
          </>
        ) : (
          <>
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 140,
                width: 20,
                height: 54,
                borderRadius: 7,
                background: pants,
                transformOrigin: 'top center',
                transform: `rotate(${legSwing}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 56,
                top: 140,
                width: 20,
                height: 54,
                borderRadius: 7,
                background: pants,
                transformOrigin: 'top center',
                transform: `rotate(${-legSwing}deg)`,
              }}
            />
          </>
        )}

        {/* Badan berkemeja */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: isSeated ? 64 : 62,
            width: 58,
            height: 82,
            borderRadius: '14px 14px 8px 8px',
            background: shirt,
            transformOrigin: 'bottom center',
            transform: `rotate(${bodyTilt}deg)`,
            boxShadow: `inset -8px 0 0 ${shirtShade}`,
          }}
        />

        {/* Syal kertas hangat penanda tokoh utama */}
        <div
          style={{
            position: 'absolute',
            left: 31 + bodyTilt * 0.4,
            top: isSeated ? 62 : 60,
            width: 48,
            height: 15,
            borderRadius: 8,
            background: scarf,
            transform: `rotate(${bodyTilt * 0.6}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 58 + bodyTilt * 0.5,
            top: isSeated ? 72 : 70,
            width: 13,
            height: 34,
            borderRadius: 5,
            background: scarfShade,
            transform: `rotate(${bodyTilt * 0.6 - 5}deg)`,
          }}
        />

        {/* Lengan sesuai pose */}
        {pose === 'sitBed' ? (
          <div
            style={{
              position: 'absolute',
              left: 44,
              top: 72 - armLift * 26,
              width: 15,
              height: 44,
              borderRadius: 8,
              background: shirtShade,
              transformOrigin: 'top center',
              transform: `rotate(${-24 - armLift * 115}deg)`,
            }}
          />
        ) : pose === 'breakfast' || pose === 'desk' || pose === 'shop' ? (
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 78,
              width: 38,
              height: 14,
              borderRadius: 7,
              background: shirtShade,
              transformOrigin: 'left center',
              transform: `rotate(${pose === 'shop' ? -18 - armLift * 22 : pose === 'breakfast' ? -24 * armLift : 18}deg)`,
            }}
          />
        ) : null}

        {/* Tas kantor kertas */}
        {hasBag ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 66,
                width: 40,
                height: 54,
                border: `4px solid ${C.woodLo}`,
                borderRadius: 10,
                transform: 'rotate(-16deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 20,
                top: 112,
                width: 44,
                height: 32,
                borderRadius: 6,
                background: C.wood,
                boxShadow: `inset 0 9px 0 ${C.woodHi}, 0 4px 8px rgba(0,0,0,0.28)`,
              }}
            />
          </>
        ) : null}

        {/* Kepala bulat polos TANPA WAJAH */}
        <div
          style={{
            position: 'absolute',
            left: 30 + bodyTilt * 0.65,
            top: isSeated ? 8 : 6,
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: '#DFD2C2',
            border: `2.5px solid ${C.inkSoft}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: -2,
              width: 46,
              height: 22,
              borderRadius: '26px 26px 8px 8px',
              background: hair,
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

// Rekan kerja siluet tanpa wajah di meja kantor
const CoworkerSilhouette: React.FC<{x: number; y: number; shirt: string; breathe: number}> = ({x, y, shirt, breathe}) => (
  <div style={{position: 'absolute', left: x, top: y + breathe, width: 96, height: 175, translate: '-50% -100%'}}>
    <Paper lift={4}>
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 56,
          width: 48,
          height: 74,
          borderRadius: '14px 14px 8px 8px',
          background: shirt,
          transform: 'rotate(10deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 8,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#CFC2B2',
          border: `2px solid ${C.inkSoft}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -2,
            width: 40,
            height: 19,
            borderRadius: '22px 22px 6px 6px',
            background: '#322F2B',
          }}
        />
      </div>
    </Paper>
  </div>
);

// Tirai / pilar kertas pemisah antar-set pada lapisan latar depan
const SetDivider: React.FC<{x: number; color?: string; shade?: string}> = ({x, color = C.creamLo, shade = '#9E907F'}) => (
  <div style={{position: 'absolute', left: x - 34, top: -10, width: 68, height: 740, pointerEvents: 'none'}}>
    <Paper lift={10}>
      <Slab x={0} y={0} w={68} h={740} color={color} shade={shade} shadeH={0.22} r={0} grain={0.7} />
      <div style={{position: 'absolute', left: 16, top: 0, bottom: 0, width: 3, background: 'rgba(0,0,0,0.14)'}} />
      <div style={{position: 'absolute', left: 48, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.16)'}} />
    </Paper>
  </div>
);

export const P01: React.FC = () => {
  const f = useCurrentFrame();

  // Peredam gerak tenang saat akhir Beat 5 ("dan kamu diam" di frame 495-556)
  const stillness = lerp(f, 492, 512, 1, 0, Easing.out(Easing.cubic));
  const calmAmp = 0.4 * stillness;
  const calmRot = 0.05 * stillness;

  // Koreografi kamera: track horizontal panjang melintasi 5 set + dolly-in yang jelas per beat
  let camX = 630;
  let camY = 355;
  let camZoom = 1.0;

  if (f < 54) {
    // Beat 1: dolly-in pelan di kamar fajar
    camX = lerp(f, 0, 54, 630, 685);
    camY = lerp(f, 0, 54, 355, 370);
    camZoom = lerp(f, 0, 54, 1.0, 1.13);
  } else if (f < 67) {
    // Jeda napas 1 -> 2: geser masuk ke koridor pagi
    camX = lerp(f, 54, 67, 685, 1490);
    camY = lerp(f, 54, 67, 370, 366);
    camZoom = lerp(f, 54, 67, 1.13, 1.07);
  } else if (f < 188) {
    // Beat 2: track kanan menyusuri kamar mandi -> meja sarapan -> pintu depan
    camX = lerp(f, 67, 188, 1490, 2610, Easing.inOut(Easing.sin));
    camY = 366;
    camZoom = lerp(f, 67, 188, 1.07, 1.06);
  } else if (f < 215) {
    // Jeda napas 2 -> 3: geser ke ujung deretan meja kantor
    camX = lerp(f, 188, 215, 2610, 3230);
    camY = lerp(f, 188, 215, 366, 355);
    camZoom = lerp(f, 188, 215, 1.06, 1.0);
  } else if (f < 290) {
    // Beat 3: dolly-in lurus menyusuri deretan meja kantor mendekati tokoh
    camX = lerp(f, 215, 290, 3230, 3545);
    camY = lerp(f, 215, 290, 355, 376);
    camZoom = lerp(f, 215, 290, 1.0, 1.17);
  } else if (f < 309) {
    // Jeda napas 3 -> 4: keluar kantor menuju jalan senja
    camX = lerp(f, 290, 309, 3545, 4310);
    camY = lerp(f, 290, 309, 376, 358);
    camZoom = lerp(f, 290, 309, 1.17, 1.02);
  } else if (f < 381) {
    // Beat 4: track mengikuti jalan pulang lalu mendorong lembut ke arah warung
    if (f < 352) {
      camX = lerp(f, 309, 352, 4310, 4800, Easing.out(Easing.quad));
      camY = 358;
      camZoom = lerp(f, 309, 352, 1.02, 1.04);
    } else {
      camX = lerp(f, 352, 381, 4800, 4855, Easing.out(Easing.cubic));
      camY = lerp(f, 352, 381, 358, 372, Easing.out(Easing.cubic));
      camZoom = lerp(f, 352, 381, 1.04, 1.11, Easing.out(Easing.cubic));
    }
  } else if (f < 407) {
    // Jeda napas 4 -> 5: geser ke ruang tamu malam redup
    camX = lerp(f, 381, 407, 4855, 5840);
    camY = lerp(f, 381, 407, 372, 356);
    camZoom = lerp(f, 381, 407, 1.11, 1.0);
  } else {
    // Beat 5: dolly-in perlahan ke cahaya ponsel lalu berhenti penuh pada frame 500
    camX = lerp(f, 407, 500, 5840, 5855, Easing.out(Easing.cubic));
    camY = lerp(f, 407, 500, 356, 382, Easing.out(Easing.cubic));
    camZoom = lerp(f, 407, 500, 1.0, 1.18, Easing.out(Easing.cubic));
  }

  // Transformasi 4 lapisan kedalaman untuk paralaks teater kertas
  const layerStyle = (parallax: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: 6400,
    height: 720,
    transformOrigin: '0 0',
    transform: `translate(${640 - camX * parallax * camZoom}px, ${360 - camY * camZoom}px) scale(${camZoom})`,
  });

  // --- Cue objek per beat ---
  // Beat 1: bangun & berdiri
  const stretchAmt =
    f < 26
      ? lerp(f, 4, 24, 0, 1, Easing.inOut(Easing.sin))
      : lerp(f, 26, 40, 1, 0, Easing.out(Easing.cubic));
  const standProgress = lerp(f, 28, 52, 0, 1, Easing.out(Easing.cubic));
  const roosterTilt = f < 34 ? lerp(f, 6, 20, 0, -14) : lerp(f, 34, 48, -14, 0);

  // Beat 2: mandi, sarapan, berangkat
  const steamRise = (f * 0.65) % 48;
  const teaSip =
    f < 130
      ? lerp(f, 108, 126, 0, 1, Easing.inOut(Easing.sin))
      : lerp(f, 130, 146, 1, 0, Easing.out(Easing.cubic));
  const walkFrontDoorX = lerp(f, 148, 192, 2445, 2690, Easing.inOut(Easing.sin));
  const frontDoorStepBob = f >= 148 && f <= 192 ? Math.abs(Math.sin((f - 148) * 0.28)) * -4 : 0;

  // Beat 3: matahari kantor melintasi busur & tumpukan map menebal
  const sunU = lerp(f, 215, 290, 0, 1, Easing.inOut(Easing.sin));
  const officeSunX = 3130 + sunU * 780;
  const officeSunY = 270 - Math.sin(sunU * Math.PI) * 125;
  const sunShadowShift = lerp(f, 215, 290, -110, 140, Easing.inOut(Easing.sin));
  const sunShadowLen = lerp(f, 215, 290, 0.72, 1.35, Easing.inOut(Easing.sin));
  const folderCount = Math.round(lerp(f, 218, 288, 2, 11, Easing.out(Easing.quad)));

  // Beat 4: jalan pulang senja & belanja di warung
  const streetWalkX = lerp(f, 306, 352, 4215, 4710, Easing.out(Easing.quad));
  const streetStepBob = f >= 306 && f <= 352 ? Math.abs(Math.sin((f - 306) * 0.3)) * -5 : 0;
  const shopReach =
    f < 368
      ? lerp(f, 352, 366, 0, 1, Easing.inOut(Easing.sin))
      : lerp(f, 368, 380, 1, 0, Easing.out(Easing.cubic));
  const item1InBasket = lerp(f, 355, 368, 0, 1, Easing.out(Easing.cubic));
  const item2InBasket = lerp(f, 366, 379, 0, 1, Easing.out(Easing.cubic));

  // Beat 5: cahaya ponsel & lampu gantung berhenti pada "dan kamu diam"
  const phoneGlowBase = lerp(f, 430, 456, 0, 1, Easing.out(Easing.cubic));
  const phonePulse = f > 456 ? 0.94 + Math.sin((f - 456) * 0.08) * 0.06 : 1;
  const phoneGlow = phoneGlowBase * phonePulse;
  const lampSway = bob(f, 95, 2.2, 0.4) * stillness;
  const spotlightAlpha = lerp(f, 445, 502, 0, 0.22, Easing.out(Easing.cubic));

  const folderColors = [
    '#C9573C',
    '#E8DFD3',
    '#8A9A86',
    '#C89B4A',
    '#D67354',
    '#BFB2A2',
    '#5D7896',
    '#A88A45',
    '#C9573C',
    '#8A9A86',
    '#E8DFD3',
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#1C2230', overflow: 'hidden'}}>
      <PaperDefs />
      <FilmWeave amp={0.25} flicker={0.25}>
        {/* ==============================================================
            LAPISAN 0: LANGIT & CAKRAWALA JAUH (PARALAKS 0.88)
           ============================================================== */}
        <div style={layerStyle(0.88)}>
          {/* Langit fajar di luar jendela kamar tidur */}
          <div
            style={{
              position: 'absolute',
              left: 160,
              top: 80,
              width: 480,
              height: 360,
              background: 'linear-gradient(180deg, #131C33 0%, #24375A 62%, #DF8D58 88%, #F4C488 100%)',
            }}
          />
          {/* Bintang fajar tipis */}
          {[
            [240, 145],
            [330, 125],
            [435, 155],
            [285, 195],
          ].map(([sx, sy], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sx,
                top: sy,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#F3E6D3',
                opacity: 0.65,
              }}
            />
          ))}
          {/* Siluet atap tetangga + ayam jantan kertas penanda subuh */}
          <div
            style={{
              position: 'absolute',
              left: 190,
              top: 295,
              width: 360,
              height: 120,
              background: '#3B2824',
              clipPath: 'polygon(12% 35%, 52% 0%, 92% 35%, 92% 100%, 12% 100%)',
            }}
          />
          {/* Ayam jantan kertas bertengger di puncak atap */}
          <div
            style={{
              position: 'absolute',
              left: 364,
              top: 254,
              width: 42,
              height: 44,
              transformOrigin: '50% 90%',
              transform: `rotate(${roosterTilt}deg)`,
            }}
          >
            <div style={{position: 'absolute', left: 10, top: 18, width: 22, height: 18, borderRadius: '50%', background: '#261C1A'}} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 10,
                width: 14,
                height: 16,
                borderRadius: '12px 0 12px 0',
                background: '#261C1A',
                transform: 'rotate(-24deg)',
              }}
            />
            <div style={{position: 'absolute', left: 24, top: 6, width: 12, height: 16, borderRadius: '50%', background: '#261C1A'}} />
            <div style={{position: 'absolute', left: 26, top: 2, width: 8, height: 6, borderRadius: '50%', background: '#C9573C'}} />
            <div
              style={{
                position: 'absolute',
                left: 34,
                top: 10,
                width: 8,
                height: 6,
                background: '#E8A848',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              }}
            />
          </div>

          {/* Langit pagi cerah di luar jendela dapur & pintu depan */}
          <div
            style={{
              position: 'absolute',
              left: 1580,
              top: 70,
              width: 980,
              height: 440,
              background: 'linear-gradient(180deg, #87B9D4 0%, #B8D8E6 65%, #F4E4C3 100%)',
            }}
          />

          {/* Langit jendela kantor: bergeser dari pagi cerah -> siang terik -> sore hangat */}
          <div
            style={{
              position: 'absolute',
              left: 2680,
              top: 60,
              width: 1180,
              height: 400,
              background:
                f < 252
                  ? 'linear-gradient(180deg, #84B7D4 0%, #C6DFEC 75%, #F2E5CE 100%)'
                  : 'linear-gradient(180deg, #98B6C9 0%, #E7BE7C 68%, #E48C54 100%)',
            }}
          />
          {/* Matahari kertas bergerak dalam satu busur sepanjang Beat 3 */}
          <div
            style={{
              position: 'absolute',
              left: officeSunX - 48,
              top: officeSunY - 48,
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'rgba(245, 197, 66, 0.26)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: '#F5C542',
                boxShadow: '0 3px 10px rgba(180, 110, 30, 0.25)',
              }}
            />
          </div>

          {/* Langit senja jingga di sepanjang jalan pulang & warung (Set 4) */}
          <div
            style={{
              position: 'absolute',
              left: 3640,
              top: 0,
              width: 1220,
              height: 600,
              background: 'linear-gradient(180deg, #4B3B5C 0%, #A95A48 38%, #DF7E44 72%, #F1B365 100%)',
            }}
          />
          {/* Awan kertas senja tipis */}
          <Slab x={3820} y={115} w={210} h={28} color="#F3C38B" r={14} />
          <Slab x={4280} y={92} w={250} h={32} color="#E9A36B" r={16} />

          {/* Langit malam di luar jendela ruang tamu (Set 5) */}
          <div
            style={{
              position: 'absolute',
              left: 4860,
              top: 70,
              width: 780,
              height: 400,
              background: 'linear-gradient(180deg, #0F1629 0%, #1B2744 100%)',
            }}
          />
          {/* Bulan sabit & bintang kertas malam */}
          <div
            style={{
              position: 'absolute',
              left: 5115,
              top: 145,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#F3E6D3',
              boxShadow: '0 0 16px rgba(243, 230, 211, 0.35)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 5126,
              top: 140,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#141D34',
            }}
          />
          {[
            [5040, 165],
            [5210, 135],
            [5245, 210],
            [5065, 240],
          ].map(([sx, sy], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sx,
                top: sy,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#F3E6D3',
                opacity: 0.75,
              }}
            />
          ))}
        </div>

        {/* ==============================================================
            LAPISAN 1: DINDING RUANGAN, JENDELA, LANTAI & ARSITEKTUR (PARALAKS 0.96)
           ============================================================== */}
        <div style={layerStyle(0.96)}>
          {/* --- SET 1: DINDING KAMAR TIDUR FAJAR (x: 0..1280) --- */}
          <Slab x={0} y={0} w={1280} h={FLOOR_Y} color="#28354D" grain={0.6} />
          {/* Bingkai jendela kamar tidur dengan lubang tembus ke langit fajar */}
          <Paper lift={5}>
            <Slab x={210} y={115} w={310} h={18} color={C.creamLo} r={3} />
            <Slab x={210} y={372} w={310} h={20} color={C.creamLo} r={3} />
            <Slab x={210} y={115} w={18} h={277} color={C.creamLo} r={3} />
            <Slab x={502} y={115} w={18} h={277} color={C.creamLo} r={3} />
            <Slab x={360} y={125} w={10} h={255} color={C.creamLo} r={0} />
            <Slab x={220} y={248} w={290} h={10} color={C.creamLo} r={0} />
            {/* Tirai samping jendela kamar */}
            <Slab x={178} y={108} w={48} h={295} color="#5D7896" shade="#435870" shadeH={0.12} r="4px 4px 20px 20px" />
            <Slab x={504} y={108} w={48} h={295} color="#5D7896" shade="#435870" shadeH={0.12} r="4px 4px 20px 20px" />
          </Paper>
          {/* Pigura siluet bukit abstrak tanpa teks di dinding kamar */}
          <Paper lift={4}>
            <Slab x={675} y={165} w={175} h={118} color={C.wood} r={5} />
            <Slab x={689} y={179} w={147} h={90} color="#4A617A" r={2}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 46,
                  background: '#7E8C78',
                  clipPath: 'polygon(0 100%, 0 42%, 38% 12%, 74% 55%, 100% 24%, 100% 100%)',
                }}
              />
            </Slab>
          </Paper>

          {/* --- SET 2: TIGA MINI-SET KORIDOR PAGI (x: 1280..2880) --- */}
          {/* 2a. Dinding kamar mandi biru sabak lembut */}
          <Slab x={1280} y={0} w={490} h={FLOOR_Y} color="#5E7785" grain={0.55} />
          {/* Tekstur garis keramik kertas tipis tanpa angka */}
          {[140, 220, 300, 380, 460].map((ty) => (
            <div
              key={ty}
              style={{position: 'absolute', left: 1280, top: ty, width: 490, height: 2, background: 'rgba(255,255,255,0.12)'}}
            />
          ))}
          <Slab x={1764} y={0} w={16} h={FLOOR_Y} color={C.woodLo} r={0} />

          {/* 2b. Dinding ruang sarapan pagi cerah hangat */}
          <Slab x={1780} y={0} w={560} h={FLOOR_Y} color="#E6D6BC" grain={0.55} />
          {/* Jendela pagi ruang sarapan */}
          <Paper lift={5}>
            <Slab x={1880} y={115} w={250} h={16} color={C.creamHi} r={3} />
            <Slab x={1880} y={345} w={250} h={18} color={C.creamHi} r={3} />
            <Slab x={1880} y={115} w={16} h={248} color={C.creamHi} r={3} />
            <Slab x={2114} y={115} w={16} h={248} color={C.creamHi} r={3} />
            <Slab x={2000} y={125} w={9} h={225} color={C.creamHi} r={0} />
          </Paper>
          <Slab x={2334} y={0} w={16} h={FLOOR_Y} color={C.woodLo} r={0} />

          {/* 2c. Dinding pintu depan pagi */}
          <Slab x={2350} y={0} w={530} h={FLOOR_Y} color="#DFCEB2" grain={0.55} />
          {/* Pintu depan kayu */}
          <Paper lift={5}>
            <Slab x={2565} y={185} w={185} h={415} color={C.wood} shade={C.woodLo} shadeH={0.08} r="6px 6px 0 0" />
            <Slab x={2590} y={212} w={135} h={115} color="#CBE1EC" r={3} />
            <Slab x={2590} y={352} w={135} h={210} color={C.woodHi} r={3} />
            {/* Gagang pintu kuningan */}
            <div style={{position: 'absolute', left: 2716, top: 410, width: 14, height: 14, borderRadius: '50%', background: C.brass}} />
          </Paper>

          {/* --- SET 3: DINDING & JENDELA BESAR KANTOR (x: 2880..4160) --- */}
          <Slab x={2880} y={0} w={1280} h={FLOOR_Y} color="#DED3C3" grain={0.55} />
          {/* Bingkai jendela panoramik kantor */}
          <Paper lift={5}>
            <Slab x={2990} y={92} w={1020} h={18} color={C.boardHi} r={3} />
            <Slab x={2990} y={402} w={1020} h={20} color={C.boardHi} r={3} />
            <Slab x={2990} y={92} w={18} h={330} color={C.boardHi} r={3} />
            <Slab x={3992} y={92} w={18} h={330} color={C.boardHi} r={3} />
            {[3245, 3500, 3755].map((mx) => (
              <Slab key={mx} x={mx} y={106} w={14} h={302} color={C.boardHi} r={0} />
            ))}
          </Paper>

          {/* --- SET 4: DERETAN RUMAH & WARUNG SENJA (x: 4160..5280) --- */}
          {/* Deretan rumah kertas di jalan pulang */}
          <Paper lift={5}>
            {/* Rumah 1 */}
            <Slab x={4185} y={310} w={165} h={290} color="#D8C2A6" r={2} />
            <div
              style={{
                position: 'absolute',
                left: 4170,
                top: 245,
                width: 195,
                height: 70,
                background: '#9A5A42',
                clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <Slab x={4225} y={365} w={56} h={64} color="#F3C572" r={3} />
            <Slab x={4295} y={435} w={42} h={165} color={C.wood} r={2} />

            {/* Rumah 2 */}
            <Slab x={4375} y={285} w={185} h={315} color="#C9B69C" r={2} />
            <div
              style={{
                position: 'absolute',
                left: 4360,
                top: 215,
                width: 215,
                height: 75,
                background: '#7A4735',
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <Slab x={4415} y={345} w={62} h={68} color="#F5CC7F" r={3} />
            <Slab x={4495} y={345} w={44} h={68} color="#F5CC7F" r={3} />
          </Paper>

          {/* Warung kecil berlampu hangat (tanpa papan nama bertulisan) */}
          <Paper lift={6}>
            <Slab x={4680} y={295} w={395} h={305} color="#B87449" shade="#935935" shadeH={0.1} r={4} />
            {/* Bagian dalam warung */}
            <Slab x={4704} y={325} w={347} h={145} color="#4A3222" r={3} />
            {/* Cahaya lampu hangat di dalam warung */}
            <div
              style={{
                position: 'absolute',
                left: 4710,
                top: 325,
                width: 335,
                height: 230,
                background: 'radial-gradient(ellipse at 50% 12%, rgba(255, 218, 132, 0.42) 0%, rgba(255, 195, 100, 0) 75%)',
              }}
            />
            {/* Kanopi bergaris krem & terakota */}
            <div style={{position: 'absolute', left: 4664, top: 268, width: 428, height: 42, display: 'flex'}}>
              {Array.from({length: 10}).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: 42,
                    background: idx % 2 === 0 ? '#C9573C' : C.creamHi,
                    borderRadius: '0 0 10px 10px',
                    boxShadow: '0 5px 8px rgba(0,0,0,0.28)',
                  }}
                />
              ))}
            </div>
            {/* Papan nama warung kayu POLOS tanpa teks/angka */}
            <Slab x={4785} y={228} w={185} h={36} color={C.woodHi} shade={C.woodLo} shadeH={0.22} r={4} />
            {/* Rak barang polos berwarna (kotak, botol, tanpa label apa pun) */}
            <Slab x={4720} y={388} w={315} h={10} color={C.woodLo} r={2} />
            <Slab x={4736} y={352} w={34} h={36} color="#8A9A86" r={3} />
            <Slab x={4782} y={356} w={30} h={32} color="#E8C95A" r={3} />
            <Slab x={4832} y={346} w={22} h={42} color="#5D7896" r="8px 8px 2px 2px" />
            <Slab x={4864} y={350} w={22} h={38} color="#D67354" r="8px 8px 2px 2px" />
            <Slab x={4915} y={352} w={38} h={36} color={C.cream} r={3} />
            <Slab x={4965} y={348} w={42} h={40} color="#C89B4A" r={3} />
            {/* Meja konter warung */}
            <Slab x={4690} y={466} w={375} h={134} color={C.wood} shade={C.woodLo} shadeH={0.16} r={3} />
            {/* Karung polos di depan warung */}
            <Slab x={4968} y={515} w={52} h={85} color={C.creamLo} shade="#A89A89" shadeH={0.25} r="18px 18px 8px 8px" />
            <Slab x={5026} y={525} w={48} h={75} color={C.tape} shade="#A49368" shadeH={0.25} r="16px 16px 8px 8px" />
          </Paper>

          {/* --- SET 5: RUANG TAMU MALAM REDUP (x: 5280..6400) --- */}
          <Slab x={5280} y={0} w={1120} h={FLOOR_Y} color="#262836" grain={0.6} />
          {/* Cahaya hangat lembut dari lampu sudut ruang tamu supaya malam tidak dingin */}
          <div
            style={{
              position: 'absolute',
              left: 5340,
              top: 120,
              width: 980,
              height: 480,
              background: 'radial-gradient(ellipse at 54% 48%, rgba(235, 175, 110, 0.14) 0%, rgba(28, 27, 23, 0.45) 75%)',
            }}
          />
          {/* Jendela malam ruang tamu */}
          <Paper lift={5}>
            <Slab x={5385} y={115} w={230} h={16} color="#4A453E" r={3} />
            <Slab x={5385} y={355} w={230} h={18} color="#4A453E" r={3} />
            <Slab x={5385} y={115} w={16} h={258} color="#4A453E" r={3} />
            <Slab x={5599} y={115} w={16} h={258} color="#4A453E" r={3} />
            <Slab x={5496} y={125} w={8} h={235} color="#4A453E" r={0} />
          </Paper>
          {/* Rak buku malam dengan punggung buku polos tanpa teks */}
          <Paper lift={4}>
            <Slab x={6045} y={240} w={215} h={16} color={C.woodLo} r={2} />
            {[
              [6060, 176, 22, 64, '#8A4E3B'],
              [6086, 184, 20, 56, '#4B637A'],
              [6110, 172, 24, 68, '#9A8246'],
              [6142, 182, 22, 58, '#5E6E5B'],
              [6170, 178, 26, 62, '#7D6E5D'],
            ].map(([bx, by, bw, bh, bc], i) => (
              <Slab key={i} x={bx as number} y={by as number} w={bw as number} h={bh as number} color={bc as string} r={2} />
            ))}
          </Paper>

          {/* --- LANTAI KAYU & TROTOAR BERSAMBUNG DI SELURUH PANGGUNG --- */}
          {/* Lantai dalam ruangan (Set 1, 2, 3) */}
          <Slab x={0} y={FLOOR_Y} w={4160} h={120} color={C.floor} r={0} grain={0.6} />
          <Slab x={0} y={FLOOR_Y - 22} w={4160} h={22} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
          {/* Bayangan jendela kantor di lantai yang memanjang sepanjang 8 jam */}
          <div
            style={{
              position: 'absolute',
              left: 3120 + sunShadowShift,
              top: FLOOR_Y,
              width: 780 * sunShadowLen,
              height: 120,
              background: 'linear-gradient(180deg, rgba(255, 226, 155, 0.24) 0%, rgba(255, 210, 135, 0.04) 100%)',
              clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Jalanan senja (Set 4) */}
          <Slab x={4160} y={FLOOR_Y} w={1120} h={120} color="#3B3638" r={0} grain={0.6} />
          <Slab x={4160} y={FLOOR_Y - 10} w={1120} h={10} color="#5B5350" r={0} />
          {/* Lantai ruang tamu malam (Set 5) */}
          <Slab x={5280} y={FLOOR_Y} w={1120} h={120} color="#33231A" r={0} grain={0.6} />
          <Slab x={5280} y={FLOOR_Y - 22} w={1120} h={22} color="#463022" r={0} />
          {/* Garis papan lantai horizontal halus */}
          <div style={{position: 'absolute', left: 0, top: FLOOR_Y + 38, width: 6400, height: 3, background: C.floorLo, opacity: 0.7}} />
          <div style={{position: 'absolute', left: 0, top: FLOOR_Y + 78, width: 6400, height: 3, background: C.floorLo, opacity: 0.7}} />
        </div>

        {/* ==============================================================
            LAPISAN 2: PANGGUNG UTAMA, PERABOT & TOKOH (PARALAKS 1.00)
           ============================================================== */}
        <div style={layerStyle(1.0)}>
          {/* --- SET 1: PERABOT KAMAR & TOKOH BANGUN --- */}
          {/* Tempat tidur kertas */}
          <Paper lift={6}>
            {/* Kepala ranjang */}
            <Slab x={905} y={385} w={24} h={215} color={C.woodLo} r={4} />
            {/* Kasur & selimut */}
            <Slab x={580} y={482} w={330} h={64} color={C.creamHi} r={8} />
            <Slab x={695} y={476} w={212} h={72} color="#B8643E" shade="#8F4A2C" shadeH={0.22} r={8} />
            {/* Bantal */}
            <Slab x={832} y={454} w={68} h={30} color={C.cream} r={12} />
            {/* Rangka kayu ranjang */}
            <Slab x={572} y={542} w={356} h={26} color={C.wood} shade={C.woodLo} shadeH={0.3} r={3} />
            <Slab x={584} y={568} w={20} h={32} color={C.woodLo} r={2} />
            <Slab x={896} y={568} w={20} h={32} color={C.woodLo} r={2} />
          </Paper>

          {/* Meja nakas & lampu tidur kertas hangat (tanpa jam alarm) */}
          <Paper lift={6}>
            <Slab x={968} y={492} w={106} h={108} color={C.wood} shade={C.woodLo} shadeH={0.14} r={4} />
            <Slab x={962} y={484} w={118} h={14} color={C.woodHi} r={3} />
            {/* Cahaya lampu tidur */}
            <div
              style={{
                position: 'absolute',
                left: 935,
                top: 415,
                width: 170,
                height: 165,
                background: 'radial-gradient(circle at 50% 22%, rgba(255, 218, 130, 0.35) 0%, rgba(255, 200, 100, 0) 72%)',
              }}
            />
            <Slab x={990} y={414} w={62} h={42} color={C.amber} shade={C.amberDim} shadeH={0.2} r="26px 26px 4px 4px" />
            <Slab x={1017} y={456} w={8} h={28} color={C.inkSoft} r={2} />
          </Paper>

          {/* Tokoh "kamu" duduk di tepi kasur -> meregang pelan -> berdiri */}
          <Boil seed="p01-beat1" amp={calmAmp} rot={calmRot}>
            <Protagonist
              x={648}
              y={FLOOR_Y + (1 - standProgress) * 18}
              pose={standProgress < 0.55 ? 'sitBed' : 'stand'}
              armLift={stretchAmt}
            />
          </Boil>

          {/* --- SET 2: TIGA MINI-SET BERJAJAR --- */}
          {/* (a) Kamar mandi: siluet di balik tirai & uap kertas naik */}
          <Paper lift={6}>
            {/* Pipa & kepala pancuran */}
            <Slab x={1358} y={182} w={14} h={418} color={C.metalLo} r={3} />
            <Slab x={1358} y={182} w={74} h={12} color={C.metal} r={4} />
            <Slab x={1416} y={192} w={36} h={16} color={C.brass} r="4px 4px 12px 12px" />
            {/* Siluet tokoh di balik tirai mandi */}
            <div style={{opacity: 0.48}}>
              <Protagonist x={1465} y={FLOOR_Y} pose="stand" />
            </div>
            {/* Tirai kamar mandi kertas berlapis */}
            <Slab
              x={1376}
              y={224}
              w={188}
              h={368}
              color="rgba(232, 223, 211, 0.86)"
              shade="rgba(191, 178, 162, 0.55)"
              shadeH={0.1}
              r={4}
            />
            {/* Batang tirai */}
            <Slab x={1366} y={218} w={212} h={10} color={C.brassLo} r={4} />
            {/* Awan uap kertas kecil yang naik lembut */}
            {[0, 1, 2].map((idx) => {
              const offset = (steamRise + idx * 16) % 48;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: 1418 + idx * 36,
                    top: 205 - offset,
                    width: 34 - idx * 4,
                    height: 20 - idx * 2,
                    borderRadius: 12,
                    background: C.creamHi,
                    opacity: interpolate(offset, [0, 10, 38, 48], [0, 0.85, 0.75, 0], CLAMP),
                    boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
                  }}
                />
              );
            })}
          </Paper>

          {/* (b) Meja sarapan seadanya: sepotong roti & segelas teh */}
          <Boil seed="p01-breakfast" amp={calmAmp} rot={calmRot}>
            <Protagonist x={1930} y={FLOOR_Y} pose="breakfast" armLift={teaSip} />
          </Boil>
          <Paper lift={6}>
            {/* Kursi makan */}
            <Slab x={1882} y={415} w={16} h={185} color={C.woodLo} r={3} />
            <Slab x={1882} y={505} w={74} h={14} color={C.wood} r={3} />
            {/* Meja makan */}
            <Slab x={1985} y={466} w={195} h={16} color={C.woodHi} r={4} />
            <Slab x={2004} y={482} w={18} h={118} color={C.woodLo} r={2} />
            <Slab x={2144} y={482} w={18} h={118} color={C.woodLo} r={2} />
            {/* Piring besar yang terasa lengang dengan sepotong roti */}
            <Slab x={2022} y={456} w={82} h={10} color={C.creamHi} r={5} />
            <Slab x={2046} y={445} w={34} h={12} color="#D8A25E" shade="#B37D3E" shadeH={0.3} r="8px 8px 2px 2px" />
            {/* Segelas teh hangat */}
            <Slab x={2122} y={434} w={24} h={32} color="rgba(220, 238, 244, 0.85)" r="2px 2px 5px 5px" />
            <Slab x={2125} y={444} w={18} h={20} color="#C87A38" r="0 0 4px 4px" />
          </Paper>

          {/* (c) Pintu depan: menyampirkan tas & berangkat kerja */}
          <Boil seed="p01-door" amp={calmAmp} rot={calmRot}>
            <Protagonist
              x={walkFrontDoorX}
              y={FLOOR_Y + frontDoorStepBob}
              pose="walk"
              phase={(f - 148) * 0.28}
              hasBag={f >= 145}
            />
          </Boil>

          {/* --- SET 3: DERETAN MEJA KANTOR MEMANJANG (x: 2880..4160) --- */}
          {/* 4 meja kerja berulang memberi kesan ruang kantor panjang */}
          {[3030, 3260, 3490, 3720].map((dx, idx) => {
            const isHeroDesk = idx === 2;
            return (
              <React.Fragment key={dx}>
                {/* Tokoh di tiap meja */}
                {isHeroDesk ? (
                  <Boil seed="p01-office-hero" amp={calmAmp} rot={calmRot}>
                    <Protagonist x={dx + 48} y={FLOOR_Y + bob(f, 80, 1.2, 0)} pose="desk" />
                  </Boil>
                ) : (
                  <CoworkerSilhouette
                    x={dx + 48}
                    y={FLOOR_Y}
                    shirt={['#6E6A64', '#5D7896', '#7E8C78'][idx % 3]}
                    breathe={bob(f, 76, 1.5, idx * 1.4)}
                  />
                )}

                {/* Meja kantor, monitor gelap kosong & tumpukan map */}
                <Paper lift={6}>
                  {/* Kaki & daun meja */}
                  <Slab x={dx} y={468} w={196} h={16} color={C.woodHi} r={3} />
                  <Slab x={dx + 14} y={484} w={16} h={116} color={C.woodLo} r={2} />
                  <Slab x={dx + 166} y={484} w={16} h={116} color={C.woodLo} r={2} />
                  {/* Monitor kertas dengan layar gelap & KOSONG */}
                  <Slab x={dx + 114} y={454} w={34} h={14} color={C.metalLo} r={2} />
                  <Slab x={dx + 126} y={434} w={10} h={22} color={C.metal} r={1} />
                  <Slab x={dx + 96} y={386} w={68} h={50} color={C.board} r={4}>
                    <Slab x={6} y={6} w={56} h={38} color={C.screen} r={2} />
                  </Slab>
                  {/* Tumpukan map: di meja tokoh utama menebal pelan sepanjang 8 jam */}
                  {/* QA Clover: tumpukan map dipindah ke ujung kanan meja (dari dx+22) — posisi lama
                      menutupi kepala tokoh utama yang duduk di meja (kepala di dx+31..dx+81, map di
                      dx+22..dx+78 tumbuh ke atas sampai y~391). Monitor berakhir di dx+164, map di
                      dx+156..dx+200 hanya menyenggol bingkainya. */}
                  {isHeroDesk ? (
                    <div style={{position: 'absolute', left: dx + 156, top: 468}}>
                      {Array.from({length: folderCount}).map((_, fi) => (
                        <Slab
                          key={fi}
                          x={(fi % 2) * 3}
                          y={-(fi + 1) * 7}
                          w={44}
                          h={6}
                          color={folderColors[fi % folderColors.length]}
                          r={2}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Slab x={dx + 24} y={460} w={50} h={8} color={C.creamLo} r={2} />
                      <Slab x={dx + 26} y={452} w={48} h={8} color="#8A9A86" r={2} />
                    </>
                  )}
                </Paper>
              </React.Fragment>
            );
          })}

          {/* --- SET 4: JALAN PULANG & BELANJA DI WARUNG --- */}
          {/* Keranjang belanja kertas di atas konter warung */}
          <Paper lift={7}>
            <Slab x={4768} y={436} w={54} h={30} color={C.brassLo} shade="#7A5924" shadeH={0.25} r="2px 2px 10px 10px" />
            {/* Barang polos berwarna masuk ke keranjang saat dibeli */}
            <Slab
              x={4774 - (1 - item1InBasket) * 32}
              y={422 - (1 - item1InBasket) * 58}
              w={20}
              h={22}
              color="#8A9A86"
              r={3}
            />
            <Slab
              x={4798 + (1 - item2InBasket) * 44}
              y={420 - (1 - item2InBasket) * 62}
              w={18}
              h={24}
              color="#D67354"
              r={4}
            />
          </Paper>

          {/* Tokoh berjalan pulang membawa tas lalu berhenti membeli keperluan di warung */}
          <Boil seed="p01-street" amp={calmAmp} rot={calmRot}>
            <Protagonist
              x={streetWalkX}
              y={FLOOR_Y + streetStepBob}
              pose={f < 352 ? 'walk' : 'shop'}
              phase={(f - 306) * 0.3}
              hasBag
              armLift={shopReach}
            />
          </Boil>

          {/* --- SET 5: RUANG TAMU MALAM, SOFA & CAHAYA PONSEL --- */}
          {/* Lingkaran sorot lembut gaya guntingan tangan di Beat 5 */}
          {spotlightAlpha > 0.005 ? (
            <div
              style={{
                position: 'absolute',
                left: 5675,
                top: 235,
                width: 340,
                height: 340,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(243, 230, 211, ${spotlightAlpha}) 0%, rgba(243, 230, 211, ${spotlightAlpha * 0.45}) 62%, rgba(0,0,0,0) 76%)`,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* Lampu gantung kertas ruang tamu yang berayun pelan lalu berhenti total pada "dan kamu diam" */}
          <div
            style={{
              position: 'absolute',
              left: 5835,
              top: 0,
              width: 110,
              height: 215,
              transformOrigin: '50% 0%',
              transform: `rotate(${lampSway}deg)`,
            }}
          >
            <Paper lift={6}>
              <Slab x={53} y={0} w={4} h={132} color={C.inkSoft} r={0} />
              <Slab x={15} y={130} w={80} h={46} color={C.amber} shade={C.amberDim} shadeH={0.22} r="40px 40px 6px 6px" />
              <div
                style={{
                  position: 'absolute',
                  left: 38,
                  top: 174,
                  width: 34,
                  height: 16,
                  borderRadius: '0 0 18px 18px',
                  background: '#F5C542',
                }}
              />
            </Paper>
          </div>

          {/* Sofa ruang tamu malam */}
          <Paper lift={6}>
            {/* Sandaran & dudukan sofa */}
            <Slab x={5715} y={425} w={255} h={115} color="#5D483E" shade="#44342C" shadeH={0.18} r={14} />
            <Slab x={5700} y={482} w={34} h={92} color="#6E564A" r={10} />
            <Slab x={5950} y={482} w={34} h={92} color="#6E564A" r={10} />
            <Slab x={5726} y={515} w={232} h={58} color="#785E50" r={8} />
            <Slab x={5732} y={573} w={18} h={27} color={C.woodLo} r={2} />
            <Slab x={5934} y={573} w={18} h={27} color={C.woodLo} r={2} />
            {/* Tas kantor diletakkan di lantai samping sofa */}
            <Slab x={5652} y={562} w={46} h={38} color={C.wood} shade={C.woodLo} shadeH={0.22} r={6} />
          </Paper>

          {/* Tokoh duduk diam di sofa malam diterangi cahaya ponsel kebiruan */}
          <Boil seed="p01-night-hero" amp={calmAmp} rot={calmRot}>
            <Protagonist x={5845} y={FLOOR_Y - 12} pose="sofaBack" phoneGlow={phoneGlow} />
          </Boil>

          {/* Debu kertas halus yang melayang sangat pelan lalu menggantung diam pada frame 500 */}
          {[
            [5620, 290, 0.0],
            [5745, 250, 1.3],
            [5965, 275, 2.5],
            [6030, 360, 3.8],
            [5680, 410, 4.9],
          ].map(([dx, dy, ph], idx) => {
            const frozenFrame = Math.min(f, 502);
            const driftX = Math.sin(frozenFrame * 0.025 + ph) * 8;
            const driftY = Math.cos(frozenFrame * 0.02 + ph) * 6;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: dx + driftX,
                  top: dy + driftY,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#F3E6D3',
                  opacity: 0.38,
                }}
              />
            );
          })}
        </div>

        {/* ==============================================================
            LAPISAN 3: TIRAI PEMISAH & TANAMAN LATAR DEPAN (PARALAKS 1.26)
           ============================================================== */}
        <div style={layerStyle(1.26)}>
          {/* Tirai / pilar kertas penyambung antar-set (tidak pernah menutupi tokoh utama) */}
          <SetDivider x={1280} color="#4A5A70" shade="#344052" />
          <SetDivider x={2880} color={C.creamLo} shade="#A39583" />
          <SetDivider x={4160} color="#B87449" shade="#8C5432" />
          <SetDivider x={5280} color="#242738" shade="#171926" />

          {/* Tanaman hias kertas di tepi bawah depan untuk memperkuat paralaks 3D */}
          {[1225, 2390, 4635, 5345].map((px, i) => (
            <div key={px} style={{position: 'absolute', left: px, top: 530, width: 90, height: 190}}>
              <Paper lift={11}>
                <Slab
                  x={26}
                  y={10}
                  w={26}
                  h={76}
                  color={i % 2 === 0 ? '#3F6A3E' : '#4E7A4A'}
                  r="50% 50% 50% 50% / 70% 70% 30% 30%"
                  rot={-16}
                />
                <Slab
                  x={44}
                  y={4}
                  w={26}
                  h={82}
                  color={i % 2 === 0 ? '#4E7A4A' : '#3F6A3E'}
                  r="50% 50% 50% 50% / 70% 70% 30% 30%"
                  rot={14}
                />
                <Slab x={18} y={76} w={58} h={114} color="#9A5A42" shade="#78422E" shadeH={0.22} r="6px 6px 14px 14px" />
              </Paper>
            </div>
          ))}
        </div>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};