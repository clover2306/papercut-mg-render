// Adegan MG T10: Penggaris untuk Penonton — papan penunjuk bercabang "Tujuan", tiga papan tanya layanan,
// dan penggaris kertas tanpa angka yang mengukur pengendara mobil yang benar-benar pindah ke bus.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, ROOM} from '../../lib/tokens';
import {GrainOverlay, PaperDefs} from '../../lib/paper/kit';
import {FilmWeave} from '../../lib/paper/look';
import {Depth, OrbitCamera, SnapZoom} from '../../lib/paper/camera';
import {CutScene, CutSeries, PopUpOpen} from '../../lib/paper/transitions';
import {Plant} from '../../lib/paper/sets';
import {TapeCorners} from '../../lib/paper/tape';
import {Boil, Figure, FLOOR_Y, Paper, Pill, PopIn, Slab, SlideIn, Tag} from './mgkit';

export const T10_DUR = 810;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Karcis kertas bercap "Gratis" (motif pengikat antar-adegan)
const GratisTicket: React.FC<{
  x: number;
  y: number;
  rot?: number;
  s?: number;
  warm?: boolean;
  dim?: boolean;
}> = ({x, y, rot = -4, s = 1, warm = false, dim = false}) => {
  const w = Math.round(138 * s);
  const h = Math.round(64 * s);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        opacity: dim ? 0.78 : 1,
      }}
    >
      <Paper lift={4}>
        <Slab
          x={0}
          y={0}
          w={w}
          h={h}
          color={warm ? '#F6E3B4' : C.cream}
          shade={warm ? C.brass : C.creamLo}
          shadeH={0.18}
          r={6}
        >
          <div
            style={{
              position: 'absolute',
              left: 10 * s,
              top: 8 * s,
              right: 10 * s,
              bottom: 8 * s,
              border: `${Math.max(1.5, 2 * s)}px dashed ${warm ? C.brassLo : C.inkSoft}`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.banner,
              fontSize: Math.round(22 * s),
              letterSpacing: '0.03em',
              color: warm ? C.goDim : C.tag,
              textTransform: 'uppercase',
            }}
          >
            Gratis
          </div>
        </Slab>
      </Paper>
    </div>
  );
};

// Cap centang hijau dari potongan kertas (tanpa teks tambahan)
const CheckStamp: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <PopIn at={at} seed="check-stamp" origin={`${x}px ${y}px`}>
    <Boil seed="check-boil" amp={0.4} rot={0.05}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 68,
          height: 68,
          translate: '-50% -50%',
          rotate: '-8deg',
        }}
      >
        <Paper lift={5} torn>
          <Slab x={0} y={0} w={68} h={68} color={C.go} shade={C.goDim} shadeH={0.22} r="50%">
            <svg width={68} height={68} viewBox="0 0 68 68" style={{position: 'absolute', inset: 0}}>
              <circle cx={34} cy={34} r={27} fill="none" stroke="#F3EEE6" strokeWidth={3} strokeDasharray="5 3" />
              <path
                d="M 20 35 L 30 45 L 49 24"
                fill="none"
                stroke="#F3EEE6"
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Slab>
        </Paper>
      </div>
    </Boil>
  </PopIn>
);

// Mobil kertas di jalur bawah: kosong (ditinggal pindah) atau masih berisi pengemudi siluet
const PaperCar: React.FC<{
  x: number;
  y: number;
  color: string;
  empty?: boolean;
  highlight?: boolean;
}> = ({x, y, color, empty = false, highlight = false}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 108, height: 54, translate: '-50% -100%'}}>
    {highlight ? (
      <div
        style={{
          position: 'absolute',
          left: -8,
          top: -8,
          width: 124,
          height: 66,
          borderRadius: 12,
          border: `3px dashed ${C.sparkYellow}`,
          background: 'rgba(245,197,66,0.18)',
        }}
      />
    ) : null}
    <Paper lift={3}>
      {/* Kabin atas */}
      <Slab
        x={18}
        y={2}
        w={64}
        h={24}
        color={empty ? C.creamLo : color}
        shade="rgba(0,0,0,0.15)"
        shadeH={0.2}
        r="10px 14px 2px 2px"
      >
        {/* Jendela kabin */}
        <Slab x={8} y={4} w={22} h={16} color={empty ? C.creamHi : '#2B394A'} r={3} />
        <Slab x={34} y={4} w={22} h={16} color={empty ? C.creamHi : '#2B394A'} r={3} />
        {/* Siluet kepala pengemudi tanpa wajah bila mobil TIDAK kosong */}
        {!empty ? (
          <div
            style={{
              position: 'absolute',
              left: 39,
              top: 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: C.creamLo,
            }}
          />
        ) : null}
      </Slab>
      {/* Badan bawah mobil */}
      <Slab
        x={0}
        y={22}
        w={108}
        h={24}
        color={empty ? C.cream : color}
        shade="rgba(0,0,0,0.22)"
        shadeH={0.25}
        r={7}
      />
      {/* Pintu terbuka sedikit bila ditinggal kosong */}
      {empty ? (
        <Slab x={44} y={18} w={24} h={24} color={C.creamLo} shade={C.woodLo} shadeH={0.2} rot={-14} r={3} />
      ) : null}
      {/* Roda */}
      <Slab x={16} y={38} w={20} h={16} color={C.ink} r="50%" />
      <Slab x={72} y={38} w={20} h={16} color={C.ink} r="50%" />
    </Paper>
  </div>
);

// Bus kertas dengan siluet penumpang tanpa wajah di jendela
const PaperBus: React.FC<{
  x: number;
  y: number;
  s?: number;
  passengers?: number;
  highlight?: boolean;
}> = ({x, y, s = 1, passengers = 3, highlight = false}) => {
  const w = Math.round(210 * s);
  const h = Math.round(82 * s);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, translate: '-50% -100%'}}>
      {highlight ? (
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: w + 20,
            height: h + 18,
            borderRadius: 14,
            border: `3px dashed ${C.go}`,
            background: 'rgba(45,163,77,0.14)',
          }}
        />
      ) : null}
      <Paper lift={5}>
        <Slab
          x={0}
          y={0}
          w={w}
          h={Math.round(68 * s)}
          color={C.cap}
          shade={C.capLo}
          shadeH={0.22}
          hi="#5B88C9"
          hiH={0.1}
          r={Math.round(10 * s)}
        >
          {/* Strip sabuk krem */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: Math.round(40 * s),
              height: Math.round(8 * s),
              background: C.cream,
            }}
          />
          {/* Deretan jendela dengan siluet kepala polos tanpa wajah */}
          {[0, 1, 2, 3].map((idx) => {
            const wx = Math.round((16 + idx * 46) * s);
            const wy = Math.round(10 * s);
            const ww = Math.round(36 * s);
            const wh = Math.round(24 * s);
            const occupied = idx < passengers;
            return (
              <Slab key={idx} x={wx} y={wy} w={ww} h={wh} color="#223042" r={Math.round(4 * s)}>
                {occupied ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: Math.round(3 * s),
                        width: Math.round(11 * s),
                        height: Math.round(11 * s),
                        translate: '-50% 0',
                        borderRadius: '50%',
                        background: C.creamHi,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: Math.round(15 * s),
                        width: Math.round(18 * s),
                        height: Math.round(10 * s),
                        translate: '-50% 0',
                        borderRadius: Math.round(4 * s),
                        background: idx === 0 ? C.brass : C.hero,
                      }}
                    />
                  </>
                ) : null}
              </Slab>
            );
          })}
        </Slab>
        {/* Roda bus */}
        <Slab
          x={Math.round(32 * s)}
          y={Math.round(56 * s)}
          w={Math.round(26 * s)}
          h={Math.round(26 * s)}
          color={C.ink}
          r="50%"
        />
        <Slab
          x={Math.round(152 * s)}
          y={Math.round(56 * s)}
          w={Math.round(26 * s)}
          h={Math.round(26 * s)}
          color={C.ink}
          r="50%"
        />
      </Paper>
    </div>
  );
};

// Panggung bersama "Teater Kertas Halte Pagi" — dipakai di semua beat supaya latar konsisten
const HalteBackdrop: React.FC = () => (
  <>
    {/* Langit pagi hangat berlapis kertas */}
    <Slab x={-60} y={-40} w={1400} h={780} color={C.creamHi} r={0} grain={0.55} />
    <Slab x={-60} y={-40} w={1400} h={280} color="#E2D4C0" shade={C.creamHi} shadeH={0.35} r={0} />
    {/* Matahari pagi kertas polos di sudut kiri atas */}
    <Paper lift={3}>
      <Slab x={92} y={46} w={88} h={88} color="#F3D27A" shade="#E2B857" shadeH={0.2} r="50%" />
    </Paper>
    {/* Awan kertas tipis */}
    <Paper lift={2}>
      <Slab x={210} y={64} w={150} h={34} color="#F5EFE6" r={20} />
      <Slab x={980} y={54} w={180} h={38} color="#F5EFE6" r={20} />
    </Paper>
    {/* Siluet bangunan kota pagi yang teduh di kejauhan */}
    <Paper lift={2}>
      <Slab x={40} y={320} w={120} h={260} color="#C9BDAD" r={4} />
      <Slab x={170} y={370} w={95} h={210} color="#D1C6B7" r={4} />
      <Slab x={1010} y={340} w={110} h={240} color="#C9BDAD" r={4} />
      <Slab x={1130} y={295} w={115} h={285} color="#BFB2A2" r={4} />
    </Paper>
    {/* Kanopi halte bus pagi di sisi kiri panggung (polos tanpa tulisan) */}
    <Paper lift={5}>
      {/* Tiang penyangga halte */}
      <Slab x={86} y={250} w={14} h={330} color={C.metalLo} r={3} />
      <Slab x={256} y={250} w={14} h={330} color={C.metalLo} r={3} />
      {/* Panel kaca belakang halte */}
      <Slab x={96} y={285} w={164} h={215} color="#D7E0E2" shade="#BAC7CA" shadeH={0.18} r={4} />
      {/* Bangku tunggu halte */}
      <Slab x={110} y={472} w={136} h={16} color={C.wood} shade={C.woodLo} shadeH={0.35} r={4} />
      {/* Atap halte */}
      <Slab x={62} y={232} w={230} h={28} color={ROOM.terracotta} shade={C.woodLo} shadeH={0.3} r={6} />
    </Paper>
    {/* Tanaman pot kertas di tepi kanan panggung */}
    <Plant x={1145} y={405} s={0.58} />
    {/* Lantai kayu/trotoar halte dan jalur rel jalan di kaki panggung */}
    <Slab x={-60} y={FLOOR_Y - 24} w={1400} h={26} color={C.woodLo} shade={C.floorLo} shadeH={0.35} r={0} />
    <Slab x={-60} y={FLOOR_Y} w={1400} h={150} color={C.floor} r={0} grain={0.65} />
    {/* Jalur aspal kertas di kaki panggung tempat mobil dan bus berbaris */}
    <Slab x={-60} y={FLOOR_Y + 18} w={1400} h={94} color={C.board} shade={C.boardLo} shadeH={0.28} r={0}>
      {/* Garis putus-putus jalan (polos tanpa angka) */}
      {Array.from({length: 14}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 40 + i * 96,
            top: 44,
            width: 48,
            height: 5,
            borderRadius: 2,
            background: C.creamLo,
            opacity: 0.55,
          }}
        />
      ))}
    </Slab>
  </>
);

// Penonton tanpa wajah berdiri di persimpangan halte (komposisi siluet bermartabat)
const CrossroadsAudience: React.FC<{f: number}> = ({f}) => {
  const sway = Math.sin(f / 22) * 2;
  return (
    <div style={{position: 'absolute', inset: 0, translate: `0px ${sway.toFixed(1)}px`}}>
      {/* Penonton 1: pekerja bertas kerja rapi */}
      <Figure x={142} y={580} s={0.82} shirt={ROOM.navy} />
      <Paper lift={3}>
        <Slab x={166} y={505} w={28} h={22} color={C.wood} shade={C.woodLo} shadeH={0.25} r={3} />
      </Paper>
      {/* Penonton 2: penumpang utama di persimpangan */}
      <Figure x={218} y={586} s={0.9} shirt={C.hero} />
      {/* Penonton 3: pelajar bertas punggung sederhana */}
      <Figure x={84} y={584} s={0.76} shirt={ROOM.teal} />
      <Paper lift={2}>
        <Slab x={56} y={482} w={18} h={34} color={C.brass} shade={C.brassLo} shadeH={0.25} r={5} />
      </Paper>
    </div>
  );
};

// Papan penunjuk besar "Tujuan" yang menancap di tanah dan bercabang menjadi dua panah
const SignpostFork: React.FC<{
  leftGlow: number;
  rightActive: number;
  leftTicketU: number;
  showCheck: boolean;
  checkAt: number;
  rightTicketU: number;
}> = ({leftGlow, rightActive, leftTicketU, showCheck, checkAt, rightTicketU}) => {
  const leftTicketX = interpolate(leftTicketU, [0, 1], [540, 310], CLAMP);
  const leftTicketY = interpolate(leftTicketU, [0, 1], [198, 224], CLAMP);
  const rightTicketX = interpolate(rightTicketU, [0, 1], [740, 885], CLAMP);
  const rightTicketY = interpolate(rightTicketU, [0, 1], [198, 214], CLAMP);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Tiang kayu utama menancap di tanah persimpangan */}
      <Paper lift={6}>
        <Slab x={614} y={556} w={52} h={28} color={C.woodLo} shade={C.floorLo} shadeH={0.4} r={4} />
        <Slab x={626} y={96} w={28} h={472} color={C.wood} shade={C.woodLo} shadeH={0.22} hi={C.woodHi} hiH={0.1} r={5} />
      </Paper>

      {/* Papan puncak "Tujuan" */}
      <Boil seed="tujuan-head" amp={0.4} rot={0.05}>
        <Paper lift={7} torn>
          <Slab
            x={510}
            y={34}
            w={260}
            h={68}
            color={C.ink}
            shade={C.boardLo}
            shadeH={0.25}
            r={8}
            rot={-1}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.banner,
                fontSize: 38,
                letterSpacing: '0.04em',
                color: C.creamHi,
                textTransform: 'uppercase',
              }}
            >
              Tujuan
            </div>
          </Slab>
        </Paper>
      </Boil>

      {/* CABANG KIRI: "Menolong penumpang yang sudah ada" */}
      <div style={{position: 'absolute', inset: 0}}>
        {/* Pendar hangat saat cabang kiri menyala */}
        {leftGlow > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 165,
              top: 108,
              width: 470,
              height: 150,
              borderRadius: 32,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(245,197,66,0.42) 0%, rgba(243,165,59,0.16) 55%, rgba(0,0,0,0) 100%)',
              opacity: leftGlow,
            }}
          />
        ) : null}

        <Paper lift={6}>
          {/* Badan papan panah kiri */}
          <Slab
            x={198}
            y={122}
            w={432}
            h={74}
            color={leftGlow > 0.4 ? '#F5D376' : C.cream}
            shade={leftGlow > 0.4 ? C.brass : C.creamLo}
            shadeH={0.2}
            r="36px 8px 8px 36px"
            rot={-1.5}
          >
            {/* Segitiga ujung panah kiri */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 15,
                width: 28,
                height: 44,
                background: leftGlow > 0.4 ? C.goDim : C.inkSoft,
                clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 46,
                right: 16,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 22,
                color: C.ink,
                lineHeight: 1.15,
                textAlign: 'center',
              }}
            >
              Menolong penumpang yang sudah ada
            </div>
          </Slab>

          {/* Rel jalur kertas di bawah panah kiri tempat karcis "Gratis" berjalan */}
          <Slab
            x={236}
            y={214}
            w={370}
            h={14}
            color={leftGlow > 0.4 ? C.go : C.woodLo}
            shade={leftGlow > 0.4 ? C.goDim : C.floorLo}
            shadeH={0.35}
            r={6}
            rot={-1.5}
          />
        </Paper>

        {/* Karcis "Gratis" berjalan sampai ke ujung jalur kiri */}
        {leftTicketU > 0.01 ? (
          <GratisTicket x={leftTicketX} y={leftTicketY} rot={-5} s={0.92} warm />
        ) : null}

        {/* Cap centang di ujung jalur kiri */}
        {showCheck ? <CheckStamp x={218} y={222} at={checkAt} /> : null}
      </div>

      {/* CABANG KANAN: "Mengurai macet" */}
      <div style={{position: 'absolute', inset: 0}}>
        <Paper lift={6}>
          <Slab
            x={650}
            y={122}
            w={410}
            h={74}
            color={rightActive > 0.4 ? '#EED2C4' : C.cream}
            shade={rightActive > 0.4 ? C.tag : C.creamLo}
            shadeH={0.2}
            r="8px 36px 36px 8px"
            rot={1.5}
          >
            {/* Segitiga ujung panah kanan */}
            <div
              style={{
                position: 'absolute',
                right: 10,
                top: 15,
                width: 28,
                height: 44,
                background: rightActive > 0.4 ? C.tag : C.inkSoft,
                clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 48,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.caption,
                fontWeight: 900,
                fontSize: 28,
                color: C.ink,
                lineHeight: 1.1,
              }}
            >
              Mengurai macet
            </div>
          </Slab>

          {/* Rel jalur kanan tempat karcis "Gratis" berhenti di tengah */}
          <Slab
            x={674}
            y={214}
            w={366}
            h={14}
            color={rightActive > 0.4 ? C.tag : C.woodLo}
            shade={C.floorLo}
            shadeH={0.35}
            r={6}
            rot={1.5}
          />
          {/* Palang penghalang kecil di tengah jalur kanan tempat karcis tertahan */}
          {rightActive > 0.4 ? (
            <Slab x={946} y={196} w={10} h={38} color={C.nogo} shade={C.nogoDim} shadeH={0.3} r={3} />
          ) : null}
        </Paper>

        {/* Karcis "Gratis" berhenti di tengah jalur kanan */}
        {rightTicketU > 0.01 ? (
          <GratisTicket x={rightTicketX} y={rightTicketY} rot={6} s={0.92} />
        ) : null}
      </div>
    </div>
  );
};

// Tiga papan tanya layanan di cabang kanan (tanpa angka/simbol di luar teks resmi)
const QuestionBoards: React.FC<{
  q1At: number;
  q2At: number;
  q3At: number;
}> = ({q1At, q2At, q3At}) => {
  const f = useCurrentFrame();

  // Animasi kecil di dalam masing-masing papan: bus berulang, peta melebar, garasi penuh
  const busLoop = ((f % 45) / 45) * 18;
  const mapSpread = interpolate(f, [q2At, q2At + 28], [0.55, 1], CLAMP);
  const garageFill = interpolate(f, [q3At, q3At + 28], [0, 1], CLAMP);

  const cards: Array<{
    at: number;
    y: number;
    rot: number;
    text: string;
    seed: string;
    illust: React.ReactNode;
  }> = [
    {
      at: q1At,
      y: 252,
      rot: -1.2,
      text: 'Seberapa sering busnya datang',
      seed: 'q-board-1',
      illust: (
        <div style={{position: 'absolute', left: 14, top: 12, width: 124, height: 52, overflow: 'hidden'}}>
          <Slab x={0} y={40} w={124} h={5} color={C.board} r={2} />
          {[0, 1, 2].map((b) => (
            <Slab
              key={b}
              x={8 + b * 38 + Math.round(busLoop * 0.4)}
              y={16}
              w={30}
              h={22}
              color={C.cap}
              shade={C.capLo}
              shadeH={0.25}
              r={4}
            >
              <Slab x={4} y={4} w={9} h={8} color={C.creamHi} r={1} />
              <Slab x={16} y={4} w={9} h={8} color={C.creamHi} r={1} />
            </Slab>
          ))}
        </div>
      ),
    },
    {
      at: q2At,
      y: 344,
      rot: 1.1,
      text: 'Seberapa jauh jangkauannya',
      seed: 'q-board-2',
      illust: (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 10,
            width: 124,
            height: 54,
            transformOrigin: '50% 50%',
            scale: `${mapSpread.toFixed(2)} 1`,
          }}
        >
          {/* Piktogram bus dengan panah rentang jarak & dua pin lokasi (bukan grafik garis) */}
          <Slab x={4} y={6} w={116} h={42} color="#F3EBD9" shade={C.creamLo} shadeH={0.15} r={4} />
          {/* Bus kecil di tengah rentang */}
          <Slab x={46} y={10} w={32} h={18} color={C.cap} shade={C.capLo} shadeH={0.25} r={3}>
            <Slab x={4} y={3} w={10} h={6} color={C.creamHi} r={1} />
            <Slab x={18} y={3} w={10} h={6} color={C.creamHi} r={1} />
          </Slab>
          <svg width={124} height={54} viewBox="0 0 124 54" style={{position: 'absolute', inset: 0}}>
            {/* Panah rentang dua arah horizontal */}
            <line x1={24} y1={37} x2={100} y2={37} stroke={C.ink} strokeWidth={3} strokeDasharray="4 3" />
            <polygon points="18,37 26,32 26,42" fill={C.ink} />
            <polygon points="106,37 98,32 98,42" fill={C.ink} />
            {/* Pin lokasi kiri (asal) */}
            <path d="M 16 32 C 16 32 10 23 10 18 A 6 6 0 1 1 22 18 C 22 23 16 32 16 32 Z" fill={C.tag} />
            <circle cx={16} cy={18} r={2.2} fill={C.creamHi} />
            {/* Pin lokasi kanan (ujung jangkauan) */}
            <path d="M 108 32 C 108 32 102 23 102 18 A 6 6 0 1 1 114 18 C 114 23 108 32 108 32 Z" fill={C.go} />
            <circle cx={108} cy={18} r={2.2} fill={C.creamHi} />
          </svg>
        </div>
      ),
    },
    {
      at: q3At,
      y: 436,
      rot: -0.9,
      text: 'Apakah armadanya cukup',
      seed: 'q-board-3',
      illust: (
        <div style={{position: 'absolute', left: 14, top: 10, width: 124, height: 54}}>
          {/* Deretan 4 garasi bus yang hampir penuh */}
          {[0, 1, 2, 3].map((g) => {
            const gx = g * 30;
            const hasBus = g < 3 && garageFill > g * 0.25;
            return (
              <React.Fragment key={g}>
                <Slab x={gx} y={8} w={27} h={40} color={C.boardHi} shade={C.boardLo} shadeH={0.2} r="6px 6px 2px 2px">
                  <Slab x={3} y={10} w={21} h={28} color={C.boardLo} r={2} />
                  {hasBus ? (
                    <Slab x={5} y={16} w={17} h={20} color={C.amber} shade={C.amberDim} shadeH={0.25} r={3}>
                      <Slab x={3} y={3} w={11} h={6} color={C.creamHi} r={1} />
                    </Slab>
                  ) : null}
                </Slab>
              </React.Fragment>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <>
      {cards.map((c) => (
        <SlideIn key={c.seed} at={c.at} dx={120} dy={12} dur={14}>
          <Boil seed={c.seed} amp={0.4} rot={0.05}>
            <div style={{position: 'absolute', left: 668, top: c.y, width: 556, height: 76}}>
              <Paper lift={6}>
                <Slab
                  x={0}
                  y={0}
                  w={556}
                  h={76}
                  color={C.cream}
                  shade={C.creamLo}
                  shadeH={0.16}
                  r={8}
                  rot={c.rot}
                >
                  {/* Kotak ilustrasi visual di sisi kiri papan tanya */}
                  <Slab x={10} y={8} w={132} h={60} color="#E5D9C7" r={6} />
                  {c.illust}
                  {/* Teks papan tanya */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 156,
                      right: 18,
                      top: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: FONT.caption,
                      fontWeight: 900,
                      fontSize: 23,
                      color: C.ink,
                      lineHeight: 1.15,
                    }}
                  >
                    {c.text}
                  </div>
                </Slab>
              </Paper>
              <TapeCorners x={0} y={0} w={556} h={76} rot={c.rot} len={52} />
            </div>
          </Boil>
        </SlideIn>
      ))}
    </>
  );
};

// Tumpukan karcis berlabel "Jumlah penumpang" yang digeser rapi ke samping di Beat 4
const PassengerTicketStack: React.FC<{shiftU: number; appearAt?: number}> = ({shiftU, appearAt = 0}) => {
  const x = interpolate(shiftU, [0, 1], [410, 178], CLAMP);
  const y = interpolate(shiftU, [0, 1], [428, 438], CLAMP);
  const scale = interpolate(shiftU, [0, 1], [1, 0.9], CLAMP);

  return (
    <PopIn at={appearAt} seed="ticket-stack" origin={`${x}px ${y}px`}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 280,
          height: 112,
          translate: '-50% -50%',
          scale: String(scale),
        }}
      >
        <Paper lift={5}>
          {/* Lembaran karcis bertumpuk (polos tanpa tulisan/angka) */}
          {[-10, -5, 0, 4, 8].map((deg, idx) => (
            <Slab
              key={idx}
              x={54 + idx * 8}
              y={4 + (idx % 2) * 4}
              w={140}
              h={54}
              color={idx % 2 === 0 ? '#EBD8B7' : C.cream}
              shade={C.creamLo}
              shadeH={0.2}
              r={5}
              rot={deg}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
                  border: `2px dashed ${C.brassLo}`,
                  borderRadius: 3,
                }}
              />
            </Slab>
          ))}
        </Paper>
        {/* Label resmi "Jumlah penumpang" */}
        <Pill
          x={140}
          y={84}
          text="Jumlah penumpang"
          bg={C.board}
          color={C.creamHi}
          size={21}
          rot={-1.5}
        />
      </div>
    </PopIn>
  );
};

// Penggaris kertas besar POLOS TANPA ANGKA (hanya takik garis kertas) yang menyorot pengendara pindah
const PaperRulerAndRoad: React.FC<{
  rulerU: number;
  labelAt: number;
  showLabel: boolean;
}> = ({rulerU, labelAt, showLabel}) => {
  const rulerY = interpolate(rulerU, [0, 1], [740, 526], CLAMP);
  const highlightOn = rulerU > 0.75;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* Barisan kendaraan di jalur jalan bawah */}
      {/* Sisi kiri: mobil yang masih berisi pengemudi (belum pindah) */}
      <PaperCar x={120} y={668} color={ROOM.terracotta} empty={false} />
      <PaperCar x={260} y={668} color={C.purple} empty={false} />

      {/* Tengah-kanan (di bawah sorotan penggaris): mobil yang benar-benar ditinggal kosong */}
      <PaperCar x={465} y={668} color={C.creamLo} empty highlight={highlightOn} />
      <PaperCar x={605} y={668} color={C.creamLo} empty highlight={highlightOn} />

      {/* Jejak panah kertas dari mobil kosong menuju bus (tanpa teks/angka) */}
      {highlightOn ? (
        <svg width={1280} height={720} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <path
            d="M 650 642 C 700 622, 740 622, 782 640"
            fill="none"
            stroke={C.sparkYellow}
            strokeWidth={5}
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>
      ) : null}

      {/* Bus kertas tempat siluet pengendara yang pindah kini duduk */}
      <PaperBus x={900} y={672} s={1.04} passengers={4} highlight={highlightOn} />

      {/* Mobil lain di ujung kanan */}
      <PaperCar x={1145} y={668} color={ROOM.slate} empty={false} />

      {/* Penggaris kertas besar POLOS TANPA ANGKA diletakkan di atas bagian yang pindah */}
      {rulerU > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 392,
            top: rulerY,
            width: 636,
            height: 54,
            rotate: '-0.6deg',
          }}
        >
          <Paper lift={7}>
            <Slab
              x={0}
              y={0}
              w={636}
              h={54}
              color={C.sparkYellow}
              shade={C.brass}
              shadeH={0.24}
              hi="#FCE28B"
              hiH={0.16}
              r={6}
            >
              {/* Takik-takik garis penggaris polos TANPA ANGKA sama sekali */}
              {Array.from({length: 25}).map((_, i) => {
                const major = i % 4 === 0;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 18 + i * 25,
                      top: 0,
                      width: major ? 3.5 : 2,
                      height: major ? 22 : 13,
                      background: C.ink,
                      opacity: 0.78,
                    }}
                  />
                );
              })}
              {/* Lubang gantung bundar khas penggaris kayu/kertas di ujung kiri */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 28,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: C.board,
                  border: `2px solid ${C.brassLo}`,
                }}
              />
            </Slab>
          </Paper>

          {/* Sorotan braket kertas dari penggaris ke mobil kosong + bus */}
          {highlightOn ? (
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 54,
                width: 620,
                height: 92,
                borderLeft: `4px solid ${C.sparkYellow}`,
                borderRight: `4px solid ${C.sparkYellow}`,
                borderBottom: `4px solid ${C.sparkYellow}`,
                borderRadius: '0 0 10px 10px',
                background: 'linear-gradient(rgba(245,197,66,0.16), rgba(45,163,77,0.08))',
                pointerEvents: 'none',
              }}
            />
          ) : null}
        </div>
      ) : null}

      {/* Label utama ditempel: "Pengendara mobil yang benar-benar pindah" */}
      {showLabel ? (
        <Tag
          x={710}
          y={462}
          text="Pengendara mobil yang benar-benar pindah"
          at={labelAt}
          bg={C.go}
          color="#F3EEE6"
          size={26}
          rot={-1}
          seed="tag-pindah"
        />
      ) : null}
    </div>
  );
};

// ============================================================================
// BEAT 1 (scene 138, 150 frame):
// Siluet penonton tanpa wajah berdiri di persimpangan halte.
// Papan penunjuk besar "Tujuan" menancap di tanah dan bercabang menjadi dua panah.
// ============================================================================
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const signRise = interpolate(f, [8, 30], [90, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.4)),
  });
  const signOpacity = interpolate(f, [6, 16], [0, 1], CLAMP);

  return (
    <PopUpOpen dur={20} from={0.18}>
      <OrbitCamera dur={150} yaw={14} push={1.07} drift={[12, -6]} origin={[640, 560]}>
        <Depth z={0} cover>
          <HalteBackdrop />
        </Depth>
        <Depth z={0.45}>
          <div style={{position: 'absolute', inset: 0, translate: `0px ${signRise}px`, opacity: signOpacity}}>
            <SignpostFork
              leftGlow={0}
              rightActive={0}
              leftTicketU={0}
              showCheck={false}
              checkAt={999}
              rightTicketU={0}
            />
          </div>
          <CrossroadsAudience f={f} />
        </Depth>
        <Depth z={0.75}>
          <PaperRulerAndRoad rulerU={0} labelAt={999} showLabel={false} />
        </Depth>
      </OrbitCamera>
    </PopUpOpen>
  );
};

// ============================================================================
// BEAT 2 (scene 139, 165 frame):
// Panah kiri "Menolong penumpang yang sudah ada" menyala hangat.
// Karcis "Gratis" berjalan di jalur itu dan sampai ke ujung dengan sebuah cap centang.
// ============================================================================
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const leftGlow = interpolate(f, [6, 26], [0, 1], CLAMP);
  const leftTicketU = interpolate(f, [20, 74], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <OrbitCamera dur={165} yaw={-14} push={1.08} drift={[-18, -4]} origin={[460, 320]}>
      <Depth z={0} cover>
        <HalteBackdrop />
      </Depth>
      <Depth z={0.45}>
        <SignpostFork
          leftGlow={leftGlow}
          rightActive={0}
          leftTicketU={leftTicketU}
          showCheck
          checkAt={78}
          rightTicketU={0}
        />
        <CrossroadsAudience f={f + 150} />
      </Depth>
      <Depth z={0.75}>
        <PaperRulerAndRoad rulerU={0} labelAt={999} showLabel={false} />
      </Depth>
    </OrbitCamera>
  );
};

// ============================================================================
// BEAT 3 (scene 140-143, 275 frame):
// Panah kanan "Mengurai macet": karcis "Gratis" berhenti di tengah jalur.
// Tiga papan tanya tiba berurutan tepat pada kalimatnya.
// ============================================================================
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const rightActive = interpolate(f, [4, 22], [0, 1], CLAMP);
  const rightTicketU = interpolate(f, [14, 52], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <OrbitCamera dur={275} yaw={15} push={1.08} drift={[22, 6]} origin={[780, 360]}>
      <Depth z={0} cover>
        <HalteBackdrop />
      </Depth>
      <Depth z={0.45}>
        <SignpostFork
          leftGlow={1}
          rightActive={rightActive}
          leftTicketU={1}
          showCheck
          checkAt={0}
          rightTicketU={rightTicketU}
        />
        <QuestionBoards q1At={56} q2At={124} q3At={192} />
        <CrossroadsAudience f={f + 315} />
      </Depth>
      <Depth z={0.75}>
        <PaperRulerAndRoad rulerU={0} labelAt={999} showLabel={false} />
      </Depth>
    </OrbitCamera>
  );
};

// ============================================================================
// BEAT 4 (scene 144-145, 220 frame):
// Tumpukan karcis berlabel "Jumlah penumpang" digeser rapi ke samping.
// Penggaris kertas besar tanpa angka diletakkan di jalur jalan di kaki panggung,
// menyorot mobil kosong & siluet di bus; label "Pengendara mobil yang benar-benar pindah" ditempel.
// ============================================================================
const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const shiftU = interpolate(f, [24, 62], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const rulerU = interpolate(f, [64, 98], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.2)),
  });

  return (
    <SnapZoom at={106} x={700} y={540} to={1.08} settle={1.04} shake={4} roll={0.4} blur={false}>
      <OrbitCamera dur={220} yaw={-12} push={1.06} drift={[0, 10]} origin={[680, 540]}>
        <Depth z={0} cover>
          <HalteBackdrop />
        </Depth>
        <Depth z={0.45}>
          <SignpostFork
            leftGlow={1}
            rightActive={1}
            leftTicketU={1}
            showCheck
            checkAt={0}
            rightTicketU={1}
          />
          <QuestionBoards q1At={0} q2At={0} q3At={0} />
          <CrossroadsAudience f={f + 590} />
        </Depth>
        <Depth z={0.7}>
          <PassengerTicketStack shiftU={shiftU} appearAt={4} />
        </Depth>
        <Depth z={0.85}>
          <PaperRulerAndRoad rulerU={rulerU} labelAt={104} showLabel />
        </Depth>
      </OrbitCamera>
    </SnapZoom>
  );
};

const SCENES: CutScene[] = [
  {id: 'B1', component: Beat1, durationInFrames: 150},
  {id: 'B2', component: Beat2, durationInFrames: 165},
  {id: 'B3', component: Beat3, durationInFrames: 275},
  {id: 'B4', component: Beat4, durationInFrames: 220},
];

export const T10: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.creamHi}}>
    <PaperDefs />
    <FilmWeave amp={0.25} flicker={0.25} seed="t10-weave">
      <CutSeries
        scenes={SCENES}
        cuts={{
          B2: {kind: 'pageTurn', style: 'curl', from: 'bottom', align: 'mid'},
          B3: {kind: 'tapePull', y: 180, align: 'mid'},
          B4: {kind: 'whip', blur: 32, align: 'mid'},
        }}
      />
    </FilmWeave>
    <GrainOverlay />
  </AbsoluteFill>
);
