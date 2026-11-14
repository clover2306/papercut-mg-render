import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {P01, P01_DUR} from './scenes/mg/P01';
import {P02, P02_DUR} from './scenes/mg/P02';
import {P03, P03_DUR} from './scenes/mg/P03';
import {P04, P04_DUR} from './scenes/mg/P04';
import {P05, P05_DUR} from './scenes/mg/P05';
import {P06, P06_DUR} from './scenes/mg/P06';
import {P07, P07_DUR} from './scenes/mg/P07';
import {P08, P08_DUR} from './scenes/mg/P08';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="P01" component={P01} durationInFrames={P01_DUR} fps={30} width={1280} height={720} />
    <Composition id="P02" component={P02} durationInFrames={P02_DUR} fps={30} width={1280} height={720} />
    <Composition id="P03" component={P03} durationInFrames={P03_DUR} fps={30} width={1280} height={720} />
    <Composition id="P04" component={P04} durationInFrames={P04_DUR} fps={30} width={1280} height={720} />
    <Composition id="P05" component={P05} durationInFrames={P05_DUR} fps={30} width={1280} height={720} />
    <Composition id="P06" component={P06} durationInFrames={P06_DUR} fps={30} width={1280} height={720} />
    <Composition id="P07" component={P07} durationInFrames={P07_DUR} fps={30} width={1280} height={720} />
    <Composition id="P08" component={P08} durationInFrames={P08_DUR} fps={30} width={1280} height={720} />
  </>
);
