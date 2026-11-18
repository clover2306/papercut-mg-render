import React from 'react';
import {Composition} from 'remotion';
import './index.css';
import {PB01, PB01_DUR} from './scenes/mg/PB01';
import {PB02, PB02_DUR} from './scenes/mg/PB02';
import {PB03, PB03_DUR} from './scenes/mg/PB03';
import {PB04, PB04_DUR} from './scenes/mg/PB04';
import {PB05, PB05_DUR} from './scenes/mg/PB05';
import {PB07, PB07_DUR} from './scenes/mg/PB07';
import {PB08, PB08_DUR} from './scenes/mg/PB08';
import {PB09, PB09_DUR} from './scenes/mg/PB09';
import {PB10, PB10_DUR} from './scenes/mg/PB10';
import {PB12, PB12_DUR} from './scenes/mg/PB12';
import {PB11, PB11_DUR} from './scenes/mg/PB11';
import {PB13, PB13_DUR} from './scenes/mg/PB13';

// Pajak Bijak MG compositions (PB01..PB13, tanpa PB06 yang dipotong jadi gambar)
// — registered by the agent that writes each scene file. Keep this file
// minimal: no PapercutVideo import.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PB01" component={PB01} durationInFrames={PB01_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB02" component={PB02} durationInFrames={PB02_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB03" component={PB03} durationInFrames={PB03_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB04" component={PB04} durationInFrames={PB04_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB05" component={PB05} durationInFrames={PB05_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB07" component={PB07} durationInFrames={PB07_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB08" component={PB08} durationInFrames={PB08_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB09" component={PB09} durationInFrames={PB09_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB10" component={PB10} durationInFrames={PB10_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB12" component={PB12} durationInFrames={PB12_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB11" component={PB11} durationInFrames={PB11_DUR} fps={30} width={1280} height={720} />
    <Composition id="PB13" component={PB13} durationInFrames={PB13_DUR} fps={30} width={1280} height={720} />
  </>
);
