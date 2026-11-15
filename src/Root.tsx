import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {D01, D01_DUR} from './scenes/mg/D01';
import {D02, D02_DUR} from './scenes/mg/D02';
import {D03, D03_DUR} from './scenes/mg/D03';
import {D04, D04_DUR} from './scenes/mg/D04';
import {D05, D05_DUR} from './scenes/mg/D05';
import {D06, D06_DUR} from './scenes/mg/D06';
import {D07, D07_DUR} from './scenes/mg/D07';
import {D08, D08_DUR} from './scenes/mg/D08';
import {D09, D09_DUR} from './scenes/mg/D09';
import {D10, D10_DUR} from './scenes/mg/D10';
import {D11, D11_DUR} from './scenes/mg/D11';
import {D12, D12_DUR} from './scenes/mg/D12';
import {D13, D13_DUR} from './scenes/mg/D13';
import {D14, D14_DUR} from './scenes/mg/D14';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="D01" component={D01} durationInFrames={D01_DUR} fps={30} width={1280} height={720} />
    <Composition id="D02" component={D02} durationInFrames={D02_DUR} fps={30} width={1280} height={720} />
    <Composition id="D03" component={D03} durationInFrames={D03_DUR} fps={30} width={1280} height={720} />
    <Composition id="D04" component={D04} durationInFrames={D04_DUR} fps={30} width={1280} height={720} />
    <Composition id="D05" component={D05} durationInFrames={D05_DUR} fps={30} width={1280} height={720} />
    <Composition id="D06" component={D06} durationInFrames={D06_DUR} fps={30} width={1280} height={720} />
    <Composition id="D07" component={D07} durationInFrames={D07_DUR} fps={30} width={1280} height={720} />
    <Composition id="D08" component={D08} durationInFrames={D08_DUR} fps={30} width={1280} height={720} />
    <Composition id="D09" component={D09} durationInFrames={D09_DUR} fps={30} width={1280} height={720} />
    <Composition id="D10" component={D10} durationInFrames={D10_DUR} fps={30} width={1280} height={720} />
    <Composition id="D11" component={D11} durationInFrames={D11_DUR} fps={30} width={1280} height={720} />
    <Composition id="D12" component={D12} durationInFrames={D12_DUR} fps={30} width={1280} height={720} />
    <Composition id="D13" component={D13} durationInFrames={D13_DUR} fps={30} width={1280} height={720} />
    <Composition id="D14" component={D14} durationInFrames={D14_DUR} fps={30} width={1280} height={720} />
  </>
);
