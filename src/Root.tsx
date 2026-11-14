import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {MG01, MG01_DUR} from './scenes/mg/MG01';
import {MG02, MG02_DUR} from './scenes/mg/MG02';
import {MG03, MG03_DUR} from './scenes/mg/MG03';
import {MG04, MG04_DUR} from './scenes/mg/MG04';
import {MG05, MG05_DUR} from './scenes/mg/MG05';
import {MG06, MG06_DUR} from './scenes/mg/MG06';
import {MG07, MG07_DUR} from './scenes/mg/MG07';
import {MG08, MG08_DUR} from './scenes/mg/MG08';
import {MG09, MG09_DUR} from './scenes/mg/MG09';
import {MG10, MG10_DUR} from './scenes/mg/MG10';
import {MG11, MG11_DUR} from './scenes/mg/MG11';
import {MG12, MG12_DUR} from './scenes/mg/MG12';
import {MG13, MG13_DUR} from './scenes/mg/MG13';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="MG01" component={MG01} durationInFrames={MG01_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG02" component={MG02} durationInFrames={MG02_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG03" component={MG03} durationInFrames={MG03_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG04" component={MG04} durationInFrames={MG04_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG05" component={MG05} durationInFrames={MG05_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG06" component={MG06} durationInFrames={MG06_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG07" component={MG07} durationInFrames={MG07_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG08" component={MG08} durationInFrames={MG08_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG09" component={MG09} durationInFrames={MG09_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG10" component={MG10} durationInFrames={MG10_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG11" component={MG11} durationInFrames={MG11_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG12" component={MG12} durationInFrames={MG12_DUR} fps={30} width={1280} height={720} />
    <Composition id="MG13" component={MG13} durationInFrames={MG13_DUR} fps={30} width={1280} height={720} />
  </>
);
