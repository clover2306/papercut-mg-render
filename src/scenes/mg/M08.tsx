// M08 (Scene 063-068, 232,46-256,85 dtk, 732 frame): stempel dugaan dan belum vonis, timbangan biaya pengawasan, serta hamparan skala program.
// Tujuh figur berjajar di depan gedung penegak hukum berstempel, timbangan membayar dan mengawasi turun sejajar, lalu ribuan dapur dan gelombang penerima memenuhi layar.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../lib/tokens';
import {Boil, GrainOverlay, Paper, PaperDefs, PopIn, Slab} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera} from '../../lib/paper/camera';
import {Corkboard, Plant, Shelf, Sticky, Window} from '../../lib/paper/sets';
import {MarkerUnderline} from '../../lib/paper/proof';
import {CutScene, CutSeries, CutSpec} from '../../lib/paper/transitions';

export const M08_DUR = 732;

const BEAT1_DUR = 236;
const BEAT2_DUR = 196;
const BEAT3_DUR = 300;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const SharedCoolBackdrop: React.FC = () => (
  <AbsoluteFill>
    <Slab x={-120} y={-80} w={1520} h={880} color="#CDD2D4" r={0} grain={0.5} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 50% 34%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 56%, rgba(20,26,34,0.28) 100%)',
      }}
    />
    <Slab x={-120} y={316} w={1520} h={16} color={C.woodHi} shade={C.woodLo} shadeH={0.4} r={0} />
    <Slab x={-120} y={332} w={1520} h={240} color="#B8BEC2" r={0} grain={0.55} />
    <Window x={36} y={48} w={180} h={220} night={false} />
    <Corkboard x={1012} y={54} w={210} h={134} />
    <Sticky x={1036} y={80} s={30} color="#E6D7A8" rot={-3} />
    <Sticky x={1084} y={86} s={28} color="#D8DFD5" rot={2} />
    <Sticky x={1132} y={78} s={30} color="#E6D7A8" rot={-1} />
    <Shelf x={1010} y={268} w={214} books={3} />
    <Plant x={1158} y={254} s={0.48} />
  </AbsoluteFill>
);

const ProsecutorBuilding: React.FC = () => (
  <PopIn at={4} origin="50% 100%">
    <Boil seed="m08-courthouse" amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 556,
          width: 472,
          height: 286,
          translate: '-50% -100%',
        }}
      >
        <Paper lift={8}>
          {/* Pedimen atap gedung penegak hukum */}
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 0,
              width: 444,
              height: 58,
              backgroundColor: C.creamHi,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.22))',
            }}
          />
          {/* Ornamen neraca kertas polos di tengah pedimen */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 22,
              width: 26,
              height: 26,
              translate: '-50% 0',
              borderRadius: '50%',
              backgroundColor: C.brass,
              border: `2px solid ${C.brassLo}`,
            }}
          />
          {/* Balok atap */}
          <Slab x={24} y={56} w={424} h={20} color={C.cream} shade={C.creamLo} shadeH={0.35} r={2} />
          {/* Dinding fasad batu kertas */}
          <Slab
            x={36}
            y={76}
            w={400}
            h={182}
            color="#9BA3A8"
            shade="#7D868C"
            shadeH={0.14}
            r={2}
            grain={0.5}
          />
          {/* 6 pilar klasik gedung */}
          {[50, 114, 178, 274, 338, 402].map((px, idx) => (
            <Slab
              key={idx}
              x={px}
              y={76}
              w={20}
              h={182}
              color={C.creamHi}
              shade={C.creamLo}
              shadeH={0.22}
              r={3}
            />
          ))}
          {/* Gerbang kayu besar di tengah */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 132,
              width: 64,
              height: 126,
              translate: '-50% 0',
              backgroundColor: C.woodLo,
              border: `3px solid ${C.inkSoft}`,
              borderRadius: '32px 32px 0 0',
            }}
          />
          {/* Tangga gedung penegak hukum */}
          <Slab x={26} y={258} w={420} h={10} color={C.cream} shade={C.creamLo} shadeH={0.4} r={2} />
          <Slab x={16} y={268} w={440} h={10} color={C.creamHi} shade={C.creamLo} shadeH={0.4} r={2} />
          <Slab x={6} y={278} w={460} h={10} color={C.cream} shade={C.creamLo} shadeH={0.4} r={2} />
        </Paper>
      </div>
    </Boil>
  </PopIn>
);

const SevenSuspectFigures: React.FC = () => {
  const shirts = ['#27324A', '#4E6378', '#3A3832', '#5B4A6E', '#4E6378', '#27324A', '#6E6A64'];
  const startX = 436;
  const pitch = 68;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Kartu penghitung angka 7 tersangka di sisi kiri */}
      <PopIn at={14} origin="50% 50%">
        <Boil seed="m08-seven-badge" amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 236,
              top: 332,
              width: 146,
              translate: '-50% 0',
              rotate: '-2deg',
            }}
          >
            <div
              style={{
                backgroundColor: C.creamHi,
                borderTop: `6px solid ${C.cap}`,
                padding: '14px 16px 16px',
                textAlign: 'center',
                filter: 'url(#torn) drop-shadow(2px 6px 9px rgba(0,0,0,0.34))',
              }}
            >
              <div
                style={{
                  fontFamily: FONT.banner,
                  fontSize: 64,
                  lineHeight: 1,
                  color: C.cap,
                }}
              >
                7
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FONT.caption,
                  fontWeight: 900,
                  fontSize: 21,
                  lineHeight: 1.1,
                  color: C.ink,
                }}
              >
                tersangka
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -9,
                translate: '-50% 0',
                width: 58,
                height: 16,
                backgroundColor: C.tape,
                opacity: 0.85,
                filter: 'url(#torn)',
              }}
            />
          </div>
        </Boil>
      </PopIn>

      {/* 7 figur kertas tanpa wajah berjajar rapi di depan bangunan penegak hukum */}
      {shirts.map((shirt, idx) => {
        const fx = startX + idx * pitch;
        const popAt = 16 + idx * 7;

        return (
          <PopIn key={idx} at={popAt} origin="50% 100%">
            <div
              style={{
                position: 'absolute',
                left: fx,
                top: 560,
                width: 68,
                height: 152,
                translate: '-50% -100%',
                filter: 'drop-shadow(1px 4px 5px rgba(0,0,0,0.32))',
              }}
            >
              {/* Kepala kertas polos tanpa wajah */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 38,
                  height: 38,
                  translate: '-50% 0',
                  borderRadius: '50%',
                  backgroundColor: C.creamHi,
                  border: `3px solid ${C.inkSoft}`,
                }}
              />
              {/* Badan figur tegak */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 43,
                  width: 46,
                  height: 68,
                  translate: '-50% 0',
                  backgroundColor: shirt,
                  borderRadius: '9px 9px 4px 4px',
                }}
              />
              {/* Kaki */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 111,
                  width: 15,
                  height: 41,
                  backgroundColor: C.inkSoft,
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 37,
                  top: 111,
                  width: 15,
                  height: 41,
                  backgroundColor: C.inkSoft,
                  borderRadius: 4,
                }}
              />
            </div>
          </PopIn>
        );
      })}
    </div>
  );
};

const RubberStampPress: React.FC<{
  text: string;
  y: number;
  pressAt: number;
  color: string;
  rot: number;
  seed: string;
}> = ({text, y, pressAt, color, rot, seed}) => {
  const f = useCurrentFrame();

  // Blok stempel kayu kertas turun menekan, meninggalkan cap tinta, lalu mengangkat pergi
  const stampVisible = f >= pressAt - 12 && f <= pressAt + 22;
  const stampY = interpolate(
    f,
    [pressAt - 12, pressAt, pressAt + 4, pressAt + 22],
    [-190, 0, -6, -240],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    },
  );
  const stampScale = interpolate(
    f,
    [pressAt - 2, pressAt, pressAt + 4],
    [1.06, 0.94, 1],
    CLAMP,
  );
  const inkOpacity = interpolate(f, [pressAt - 1, pressAt + 2], [0, 1], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Cap tinta stempel yang tertinggal jelas di atas barisan figur */}
      {inkOpacity > 0.01 ? (
        <Boil seed={seed} amp={0.4} rot={0.05}>
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: y,
              translate: '-50% -50%',
              rotate: `${rot}deg`,
              opacity: inkOpacity,
              backgroundColor: 'rgba(246, 241, 231, 0.92)',
              border: `5px solid ${color}`,
              borderRadius: 8,
              padding: '9px 28px 11px',
              fontFamily: FONT.banner,
              fontSize: 38,
              lineHeight: 1,
              color,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              filter: 'url(#torn) drop-shadow(2px 5px 7px rgba(0,0,0,0.28))',
            }}
          >
            {text}
          </div>
        </Boil>
      ) : null}

      {/* Alat stempel kayu kertas yang menekan turun */}
      {stampVisible ? (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: y + stampY - 46,
            width: 240,
            height: 112,
            translate: '-50% -50%',
            transform: `scale(${stampScale})`,
            filter: 'drop-shadow(3px 8px 12px rgba(0,0,0,0.34))',
          }}
        >
          {/* Gagang kayu stempel */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 44,
              height: 36,
              translate: '-50% 0',
              borderRadius: '22px 22px 10px 10px',
              backgroundColor: C.woodHi,
              borderBottom: `4px solid ${C.woodLo}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 32,
              width: 24,
              height: 30,
              translate: '-50% 0',
              backgroundColor: C.wood,
            }}
          />
          {/* Bantalan dudukan stempel */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 60,
              width: 216,
              height: 26,
              backgroundColor: C.woodHi,
              borderBottom: `5px solid ${C.woodLo}`,
              borderRadius: 6,
            }}
          />
          {/* Karet stempel di bagian bawah */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 86,
              width: 200,
              height: 14,
              backgroundColor: color,
              borderRadius: '0 0 5px 5px',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

const BeatOne: React.FC = () => {
  const f = useCurrentFrame();
  // Getaran kertas sangat halus (<= 3px) tepat saat kedua stempel menghantam
  const thump1 = interpolate(f, [76, 78, 82], [0, 3, 0], CLAMP);
  const thump2 = interpolate(f, [172, 174, 178], [0, 3, 0], CLAMP);
  const bumpY = thump1 + thump2;

  return (
    <AbsoluteFill style={{backgroundColor: '#CDD2D4'}}>
      <FilmWeave amp={0.25} flicker={0.25} seed="m08-b1-weave">
        <OrbitCamera
          dur={BEAT1_DUR + 6}
          yaw={14}
          drift={[-22, -4]}
          push={1.08}
          focus={0.5}
          depth={760}
          origin={[640, 410]}
        >
          <Depth z={0} cover>
            <SharedCoolBackdrop />
          </Depth>

          <Depth z={0.5}>
            <div style={{position: 'absolute', inset: 0, translate: `0px ${bumpY}px`}}>
              {/* Lantai diorama */}
              <Slab x={-140} y={562} w={1560} h={210} color="#E3E0D8" r={0} grain={0.5} />
              <Slab
                x={-140}
                y={556}
                w={1560}
                h={16}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.4}
                r={0}
              />
              <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

              {/* Bangunan penegak hukum dari kertas */}
              <ProsecutorBuilding />

              {/* Tujuh figur kertas tanpa wajah berjajar di depan gedung */}
              <SevenSuspectFigures />

              {/* Stempel besar "dugaan" di atas mereka, diikuti "belum vonis" di baris bawahnya */}
              <RubberStampPress
                text="dugaan"
                y={114}
                pressAt={76}
                color={C.amberDim}
                rot={-2}
                seed="m08-stamp-1"
              />
              <RubberStampPress
                text="belum vonis"
                y={202}
                pressAt={172}
                color={C.cap}
                rot={1.5}
                seed="m08-stamp-2"
              />
            </div>
          </Depth>

          <Depth z={0.95}>
            <div style={{filter: 'blur(3px)'}}>
              <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
              <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            </div>
          </Depth>
        </OrbitCamera>
      </FilmWeave>
      <GrainOverlay />
    </AbsoluteFill>
  );
};

const KitchenBalanceScale: React.FC = () => {
  const f = useCurrentFrame();

  // Timbangan dapur kertas muncul (f=8..36), lalu kedua piring turun sama rendah (f=78..146)
  // tepat pada kalimat "mengawasi yang gratis sama mahalnya dengan membayarnya"
  const sinkU = interpolate(f, [78, 142], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Ayunan kecil yang mereda menjadi sejajar sempurna (0 deg) di akhir
  const settleWobble =
    Math.sin(Math.max(0, f - 78) * 0.22) *
    interpolate(f, [78, 152], [4.5, 0], CLAMP);

  const leftDropY = sinkU * 68 + settleWobble * 2.2;
  const rightDropY = sinkU * 68 - settleWobble * 2.2;

  const basePanY = 304;
  const leftPanY = basePanY + leftDropY;
  const rightPanY = basePanY + rightDropY;

  const pivotX = 640;
  const pivotY = 238;
  const leftHookX = 414;
  const rightHookX = 866;

  // Beban masuk ke masing-masing piring saat keduanya turun sama rendah
  const loadPopU = interpolate(f, [74, 96], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  return (
    <PopIn at={8} origin="50% 100%">
      <div style={{position: 'absolute', inset: 0}}>
        {/* Alas dudukan dan tiang tengah timbangan dapur kertas */}
        <Boil seed="m08-scale-stand" amp={0.4} rot={0.05}>
          <div style={{position: 'absolute', inset: 0}}>
            <Paper lift={10}>
              {/* Alas kayu berat timbangan */}
              <Slab
                x={494}
                y={524}
                w={292}
                h={34}
                color={C.wood}
                shade={C.woodLo}
                shadeH={0.35}
                r="12px 12px 6px 6px"
              />
              <Slab
                x={524}
                y={504}
                w={232}
                h={22}
                color={C.woodHi}
                shade={C.woodLo}
                shadeH={0.35}
                r="10px 10px 3px 3px"
              />
              {/* Tiang utama timbangan kuningan kertas */}
              <Slab
                x={626}
                y={224}
                w={28}
                h={282}
                color={C.brass}
                shade={C.brassLo}
                shadeH={0.22}
                r={8}
              />
              {/* Puncak hiasan tiang */}
              <div
                style={{
                  position: 'absolute',
                  left: 640,
                  top: 204,
                  width: 34,
                  height: 34,
                  translate: '-50% -50%',
                  borderRadius: '50%',
                  backgroundColor: C.brass,
                  border: `3px solid ${C.brassLo}`,
                }}
              />
            </Paper>
          </div>
        </Boil>

        {/* Palang lengan timbangan + tali penggantung kedua piring */}
        <svg
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'visible',
            filter: 'drop-shadow(2px 5px 7px rgba(0,0,0,0.28))',
          }}
        >
          {/* Lengan palang timbangan yang ikut miring tipis lalu rata sejajar */}
          <line
            x1={leftHookX}
            y1={pivotY + settleWobble * 1.4}
            x2={rightHookX}
            y2={pivotY - settleWobble * 1.4}
            stroke={C.brassLo}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <line
            x1={leftHookX}
            y1={pivotY + settleWobble * 1.4}
            x2={rightHookX}
            y2={pivotY - settleWobble * 1.4}
            stroke={C.brass}
            strokeWidth={9}
            strokeLinecap="round"
          />

          {/* Tali gantungan piring kiri ("membayar") */}
          <line
            x1={leftHookX}
            y1={pivotY + settleWobble * 1.4}
            x2={leftHookX - 72}
            y2={leftPanY}
            stroke={C.inkSoft}
            strokeWidth={3.5}
          />
          <line
            x1={leftHookX}
            y1={pivotY + settleWobble * 1.4}
            x2={leftHookX + 72}
            y2={leftPanY}
            stroke={C.inkSoft}
            strokeWidth={3.5}
          />

          {/* Tali gantungan piring kanan ("mengawasi") */}
          <line
            x1={rightHookX}
            y1={pivotY - settleWobble * 1.4}
            x2={rightHookX - 72}
            y2={rightPanY}
            stroke={C.inkSoft}
            strokeWidth={3.5}
          />
          <line
            x1={rightHookX}
            y1={pivotY - settleWobble * 1.4}
            x2={rightHookX + 72}
            y2={rightPanY}
            stroke={C.inkSoft}
            strokeWidth={3.5}
          />

          {/* Poros tengah timbangan */}
          <circle
            cx={pivotX}
            cy={pivotY}
            r={16}
            fill={C.creamHi}
            stroke={C.inkSoft}
            strokeWidth={4}
          />
          <circle cx={pivotX} cy={pivotY} r={6} fill={C.brassLo} />
        </svg>

        {/* PIRING KIRI: "membayar" + tumpukan beban anggaran kertas */}
        <div
          style={{
            position: 'absolute',
            left: leftHookX,
            top: leftPanY,
            width: 196,
            height: 118,
            translate: '-50% 0',
          }}
        >
          {/* Tumpukan balok & struk biaya di atas piring "membayar" */}
          {loadPopU > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -46,
                width: 112,
                height: 48,
                translate: '-50% 0',
                transformOrigin: '50% 100%',
                transform: `scale(${loadPopU})`,
              }}
            >
              <Paper lift={6}>
                <Slab x={6} y={24} w={100} h={22} color="#79A874" shade="#4F7C4B" shadeH={0.3} r={5} />
                <Slab x={14} y={6} w={84} h={20} color="#8AB885" shade="#5B8A56" shadeH={0.3} r={5} />
              </Paper>
            </div>
          ) : null}

          {/* Mangkuk piring timbangan kiri */}
          <Paper lift={9}>
            <Slab
              x={0}
              y={0}
              w={196}
              h={28}
              color={C.metal}
              shade={C.metalLo}
              shadeH={0.42}
              r="6px 6px 28px 28px"
            />
          </Paper>

          {/* Label potongan kertas bertuliskan "membayar" */}
          <Boil seed="m08-pay-lbl" amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 40,
                translate: '-50% 0',
                rotate: '-1.5deg',
                backgroundColor: C.creamHi,
                borderTop: `5px solid ${C.go}`,
                padding: '11px 24px 13px',
                fontFamily: FONT.banner,
                fontSize: 28,
                lineHeight: 1,
                color: C.ink,
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
              }}
            >
              membayar
            </div>
          </Boil>
        </div>

        {/* PIRING KANAN: "mengawasi" + tumpukan papan periksa & lampu pengawasan kertas */}
        <div
          style={{
            position: 'absolute',
            left: rightHookX,
            top: rightPanY,
            width: 196,
            height: 118,
            translate: '-50% 0',
          }}
        >
          {/* Tumpukan papan periksa pengawasan di atas piring "mengawasi" */}
          {loadPopU > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -46,
                width: 112,
                height: 48,
                translate: '-50% 0',
                transformOrigin: '50% 100%',
                transform: `scale(${loadPopU})`,
              }}
            >
              <Paper lift={6}>
                <Slab x={6} y={24} w={100} h={22} color={C.cap} shade={C.capLo} shadeH={0.3} r={5} />
                <Slab x={14} y={6} w={84} h={20} color="#5D7896" shade="#3E5670" shadeH={0.3} r={5} />
              </Paper>
            </div>
          ) : null}

          {/* Mangkuk piring timbangan kanan */}
          <Paper lift={9}>
            <Slab
              x={0}
              y={0}
              w={196}
              h={28}
              color={C.metal}
              shade={C.metalLo}
              shadeH={0.42}
              r="6px 6px 28px 28px"
            />
          </Paper>

          {/* Label potongan kertas bertuliskan "mengawasi" */}
          <Boil seed="m08-watch-lbl" amp={0.4} rot={0.05}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 40,
                translate: '-50% 0',
                rotate: '1.5deg',
                backgroundColor: C.creamHi,
                borderTop: `5px solid ${C.cap}`,
                padding: '11px 24px 13px',
                fontFamily: FONT.banner,
                fontSize: 28,
                lineHeight: 1,
                color: C.ink,
                whiteSpace: 'nowrap',
                filter: 'url(#torn) drop-shadow(2px 5px 8px rgba(0,0,0,0.34))',
              }}
            >
              mengawasi
            </div>
          </Boil>
        </div>

        {/* Garis penanda keseimbangan rata saat kedua piring turun sama rendah */}
        <MarkerUnderline
          x={468}
          y={468}
          w={344}
          at={142}
          dur={14}
          color={C.tag}
          width={5}
          seed="m08-equal-cost-line"
        />
      </div>
    </PopIn>
  );
};

const BeatTwo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#CDD2D4'}}>
    <FilmWeave amp={0.25} flicker={0.25} seed="m08-b2-weave">
      <OrbitCamera
        dur={BEAT2_DUR + 6}
        yaw={-14}
        drift={[20, -4]}
        push={1.08}
        focus={0.5}
        depth={760}
        origin={[640, 400]}
      >
        <Depth z={0} cover>
          <SharedCoolBackdrop />
        </Depth>

        <Depth z={0.5}>
          {/* Lantai meja timbangan kertas */}
          <Slab x={-140} y={562} w={1560} h={210} color="#E3E0D8" r={0} grain={0.5} />
          <Slab
            x={-140}
            y={556}
            w={1560}
            h={16}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.4}
            r={0}
          />
          <Slab x={-140} y={668} w={1560} h={90} color={C.woodLo} r={0} grain={0.55} />

          {/* Timbangan dapur kertas dengan piring "membayar" dan "mengawasi" turun sama rendah */}
          <KitchenBalanceScale />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

const MiniPaperKitchen: React.FC<{
  x: number;
  y: number;
  s: number;
  roofColor: string;
}> = ({x, y, s, roofColor}) => {
  const w = Math.round(54 * s);
  const h = Math.round(52 * s);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -100%',
        filter: 'drop-shadow(1px 3px 3px rgba(0,0,0,0.26))',
      }}
    >
      {/* Cerobong kecil dapur */}
      <div
        style={{
          position: 'absolute',
          left: Math.round(34 * s),
          top: 0,
          width: Math.max(4, Math.round(8 * s)),
          height: Math.round(12 * s),
          backgroundColor: C.metalLo,
          borderRadius: 2,
        }}
      />
      {/* Atap miring dapur */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: Math.round(8 * s),
          width: w,
          height: Math.round(14 * s),
          backgroundColor: roofColor,
          clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
        }}
      />
      {/* Badan dapur kertas */}
      <div
        style={{
          position: 'absolute',
          left: Math.round(4 * s),
          top: Math.round(21 * s),
          width: Math.round(46 * s),
          height: Math.round(31 * s),
          backgroundColor: C.creamHi,
          borderBottom: `${Math.max(2, Math.round(3 * s))}px solid ${C.creamLo}`,
          borderRadius: 2,
        }}
      />
      {/* Jendela/loket dapur */}
      <div
        style={{
          position: 'absolute',
          left: Math.round(12 * s),
          top: Math.round(27 * s),
          width: Math.round(30 * s),
          height: Math.round(13 * s),
          backgroundColor: '#5D7896',
          borderRadius: 2,
        }}
      />
    </div>
  );
};

const KitchenExpanseAnd27k: React.FC = () => {
  const f = useCurrentFrame();

  // Tahap 1: 1 dapur kecil muncul di tengah (f=6..32)
  // Tahap 2: membelah menjadi 2 dapur (f=32..58)
  // Tahap 3: meluas menjadi hamparan ribuan dapur memenuhi seluruh bidang (f=58..162)
  const splitTwoU = interpolate(f, [32, 48], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.5)),
  });
  const gridGrowU = interpolate(f, [58, 152], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Hamparan dapur bertingkat perspektif: 5 baris x 17 kolom = 85 dapur berlapis rapat
  const rows = 5;
  const cols = 17;
  const roofPalette = [C.wood, C.tag, '#5D7896', C.woodHi, '#7E8C78'];

  const gridItems: Array<{x: number; y: number; s: number; dist: number; roof: string}> = [];
  for (let r = 0; r < rows; r++) {
    const rowY = 176 + r * 52;
    const rowScale = 0.56 + r * 0.085;
    const xMargin = 74 - r * 6;
    const spanW = 1280 - xMargin * 2;
    for (let c = 0; c < cols; c++) {
      const stagger = (r % 2) * 16;
      const colX = xMargin + (c / (cols - 1)) * spanW + stagger - 8;
      const dist = Math.hypot((colX - 640) / 620, (rowY - 280) / 160);
      gridItems.push({
        x: colX,
        y: rowY,
        s: rowScale,
        dist,
        roof: roofPalette[(r * 7 + c * 3) % roofPalette.length],
      });
    }
  }

  // Kartu angka "lebih dari 27 ribu" terbentuk dari potongan huruf besar (f=138..166)
  const badgePopU = interpolate(f, [138, 158], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Tahap awal: 1 dapur menjadi 2 dapur sebelum meledak menjadi hamparan ribuan */}
      {gridGrowU < 0.25 ? (
        <div style={{opacity: 1 - gridGrowU * 4}}>
          <PopIn at={6} origin="50% 100%">
            <MiniPaperKitchen
              x={640 - splitTwoU * 92}
              y={308}
              s={1.45 - splitTwoU * 0.25}
              roofColor={C.wood}
            />
          </PopIn>
          {splitTwoU > 0.01 ? (
            <div
              style={{
                opacity: splitTwoU,
                transform: `scale(${0.6 + splitTwoU * 0.4})`,
                transformOrigin: '732px 308px',
              }}
            >
              <MiniPaperKitchen
                x={640 + splitTwoU * 92}
                y={308}
                s={1.2}
                roofColor={C.tag}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Hamparan ribuan dapur kertas memenuhi seluruh bidang atas-tengah */}
      {gridItems.map((item, idx) => {
        const threshold = item.dist * 0.78;
        const localU = interpolate(gridGrowU, [threshold, threshold + 0.22], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.4)),
        });
        if (localU <= 0.01) return null;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              transform: `scale(${localU})`,
              transformOrigin: '0% 0%',
              opacity: localU,
            }}
          >
            <MiniPaperKitchen x={0} y={0} s={item.s} roofColor={item.roof} />
          </div>
        );
      })}

      {/* Angka potongan huruf besar pola Tag: "lebih dari 27 ribu" (dapur) */}
      {badgePopU > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 56,
              translate: '-50% 0',
              rotate: '-1deg',
              transform: `scale(${0.72 + badgePopU * 0.28})`,
              transformOrigin: '50% 0%',
              opacity: badgePopU,
              backgroundColor: C.creamHi,
              borderTop: `6px solid ${C.tag}`,
              padding: '14px 32px 16px',
              textAlign: 'center',
              filter: 'url(#torn) drop-shadow(3px 8px 12px rgba(0,0,0,0.4))',
            }}
          >
            <div
              style={{
                fontFamily: FONT.banner,
                fontSize: 44,
                lineHeight: 1.04,
                color: C.tag,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              lebih dari 27 ribu
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1.1,
                color: C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              dapur
            </div>
          </div>
          <MarkerUnderline
            x={440}
            y={175}
            w={400}
            at={162}
            dur={14}
            color={C.tag}
            width={5}
            seed="m08-27k-line"
          />
        </>
      ) : null}
    </div>
  );
};

const RecipientWaveAnd57m: React.FC = () => {
  const f = useCurrentFrame();

  // Gelombang panjang kerumunan siluet kecil tanpa wajah muncul di hadapan hamparan dapur (f=172..246)
  // menuju angka "sekitar 57 juta" di sisi kanan
  const waveGrowU = interpolate(f, [172, 238], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const num57PopU = interpolate(f, [202, 226], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });

  // 3 lapisan gelombang kerumunan siluet kecil tanpa wajah (x = 68 .. 768)
  const waveCols = 22;
  const layerShirts = ['#27324A', '#3A3832', '#4E6378', '#5D7896', '#5B4A6E'];
  const people: Array<{x: number; y: number; s: number; shirt: string; progress: number}> = [];

  for (let layer = 0; layer < 3; layer++) {
    const baseY = 508 + layer * 24;
    const scale = 0.34 + layer * 0.04;
    for (let i = 0; i < waveCols; i++) {
      const t = i / (waveCols - 1);
      const px = 68 + t * 686 + (layer % 2) * 14;
      const waveOffsetY = Math.sin(t * Math.PI * 2.6 + layer * 1.1) * 14;
      people.push({
        x: px,
        y: baseY + waveOffsetY,
        s: scale,
        shirt: layerShirts[(i + layer * 2) % layerShirts.length],
        progress: t * 0.78 + layer * 0.06,
      });
    }
  }

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Kerumunan siluet kecil tanpa wajah membentuk gelombang panjang menuju angka "sekitar 57 juta" */}
      {people.map((p, idx) => {
        const localU = interpolate(waveGrowU, [p.progress, p.progress + 0.18], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.back(1.5)),
        });
        if (localU <= 0.01) return null;

        const w = Math.round(64 * p.s);
        const h = Math.round(138 * p.s);
        const head = Math.round(42 * p.s);
        const torsoW = Math.round(48 * p.s);
        const torsoH = Math.round(74 * p.s);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: w,
              height: h,
              translate: '-50% -100%',
              transformOrigin: '50% 100%',
              transform: `scale(${localU})`,
              opacity: localU,
              filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.28))',
            }}
          >
            {/* Kepala kertas polos tanpa wajah */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: head,
                height: head,
                translate: '-50% 0',
                borderRadius: '50%',
                backgroundColor: C.creamHi,
                border: `${Math.max(2, Math.round(3 * p.s))}px solid ${C.inkSoft}`,
              }}
            />
            {/* Badan siluet */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: Math.round(46 * p.s),
                width: torsoW,
                height: torsoH,
                translate: '-50% 0',
                backgroundColor: p.shirt,
                borderRadius: `${Math.round(9 * p.s)}px ${Math.round(9 * p.s)}px ${Math.round(4 * p.s)}px ${Math.round(4 * p.s)}px`,
              }}
            />
          </div>
        );
      })}

      {/* Kartu angka potongan huruf besar pola Tag: "sekitar 57 juta" (penerima) */}
      {num57PopU > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 985,
              top: 416,
              translate: '-50% 0',
              rotate: '1.2deg',
              transform: `scale(${0.72 + num57PopU * 0.28})`,
              transformOrigin: '50% 0%',
              opacity: num57PopU,
              backgroundColor: C.creamHi,
              borderTop: `6px solid ${C.cap}`,
              padding: '13px 24px 15px',
              textAlign: 'center',
              filter: 'url(#torn) drop-shadow(3px 8px 12px rgba(0,0,0,0.4))',
            }}
          >
            <div
              style={{
                fontFamily: FONT.banner,
                fontSize: 36,
                lineHeight: 1.06,
                color: C.cap,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              sekitar 57 juta
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1.1,
                color: C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              penerima
            </div>
          </div>
          <MarkerUnderline
            x={837}
            y={525}
            w={296}
            at={226}
            dur={14}
            color={C.cap}
            width={5}
            seed="m08-57m-line"
          />
        </>
      ) : null}
    </div>
  );
};

const BeatThree: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#CDD2D4'}}>
    <FilmWeave amp={0.25} flicker={0.25} seed="m08-b3-weave">
      <OrbitCamera
        dur={BEAT3_DUR + 6}
        yaw={14}
        drift={[-24, -4]}
        push={1.07}
        focus={0.5}
        depth={760}
        origin={[640, 400]}
      >
        <Depth z={0} cover>
          <SharedCoolBackdrop />
        </Depth>

        <Depth z={0.5}>
          {/* Lantai hamparan luas untuk skala program */}
          <Slab x={-160} y={406} w={1600} h={360} color="#E3E0D8" r={0} grain={0.5} />
          <Slab
            x={-160}
            y={400}
            w={1600}
            h={14}
            color={C.wood}
            shade={C.woodLo}
            shadeH={0.4}
            r={0}
          />
          <Slab x={-160} y={668} w={1600} h={90} color={C.woodLo} r={0} grain={0.55} />

          {/* Hamparan ribuan dapur kertas & angka "lebih dari 27 ribu" */}
          <KitchenExpanseAnd27k />

          {/* Gelombang panjang siluet penerima tanpa wajah menuju angka "sekitar 57 juta" */}
          <RecipientWaveAnd57m />
        </Depth>

        <Depth z={0.95}>
          <div style={{filter: 'blur(3px)'}}>
            <Slab x={-100} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
            <Slab x={1140} y={678} w={240} h={74} color={C.wood} shade={C.woodLo} shadeH={0.35} r={12} />
          </div>
        </Depth>
      </OrbitCamera>
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);

const PaperFoldEdge: React.FC = () => {
  const f = useCurrentFrame();
  const openU = interpolate(f, [0, 11], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [M08_DUR - 10, M08_DUR], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const fold = Math.max(openU, closeU);

  if (fold <= 0.001) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.cream,
          transformOrigin: '0% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 642,
          height: 720,
          backgroundColor: C.creamLo,
          transformOrigin: '100% 50%',
          transform: `scaleX(${fold})`,
          boxShadow: '-10px 0 24px rgba(0,0,0,0.28)',
        }}
      />
    </AbsoluteFill>
  );
};

const M08_SCENES: CutScene[] = [
  {id: 'm08-b1', component: BeatOne, durationInFrames: BEAT1_DUR},
  {id: 'm08-b2', component: BeatTwo, durationInFrames: BEAT2_DUR},
  {id: 'm08-b3', component: BeatThree, durationInFrames: BEAT3_DUR},
];

const M08_CUTS: Record<string, CutSpec> = {
  'm08-b2': {kind: 'pageTurn', align: 'mid', frames: 12},
  'm08-b3': {kind: 'tapePull', align: 'mid', frames: 10},
};

export const M08: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#CDD2D4'}}>
    <PaperDefs />
    <CutSeries scenes={M08_SCENES} cuts={M08_CUTS} />
    <PaperFoldEdge />
  </AbsoluteFill>
);