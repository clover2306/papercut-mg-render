import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {M01, M01_DUR} from './scenes/mg/M01';
import {M02, M02_DUR} from './scenes/mg/M02';
import {M03, M03_DUR} from './scenes/mg/M03';
import {M04, M04_DUR} from './scenes/mg/M04';
import {M05, M05_DUR} from './scenes/mg/M05';
import {M06, M06_DUR} from './scenes/mg/M06';
import {M07, M07_DUR} from './scenes/mg/M07';
import {M08, M08_DUR} from './scenes/mg/M08';
import {M09, M09_DUR} from './scenes/mg/M09';
import {M10, M10_DUR} from './scenes/mg/M10';
import {M11, M11_DUR} from './scenes/mg/M11';
import {M12, M12_DUR} from './scenes/mg/M12';
import {M13, M13_DUR} from './scenes/mg/M13';
import {M14, M14_DUR} from './scenes/mg/M14';
import {M15, M15_DUR} from './scenes/mg/M15';
import {M16, M16_DUR} from './scenes/mg/M16';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="M01" component={M01} durationInFrames={M01_DUR} fps={30} width={1280} height={720} />
    <Composition id="M02" component={M02} durationInFrames={M02_DUR} fps={30} width={1280} height={720} />
    <Composition id="M03" component={M03} durationInFrames={M03_DUR} fps={30} width={1280} height={720} />
    <Composition id="M04" component={M04} durationInFrames={M04_DUR} fps={30} width={1280} height={720} />
    <Composition id="M05" component={M05} durationInFrames={M05_DUR} fps={30} width={1280} height={720} />
    <Composition id="M06" component={M06} durationInFrames={M06_DUR} fps={30} width={1280} height={720} />
    <Composition id="M07" component={M07} durationInFrames={M07_DUR} fps={30} width={1280} height={720} />
    <Composition id="M08" component={M08} durationInFrames={M08_DUR} fps={30} width={1280} height={720} />
    <Composition id="M09" component={M09} durationInFrames={M09_DUR} fps={30} width={1280} height={720} />
    <Composition id="M10" component={M10} durationInFrames={M10_DUR} fps={30} width={1280} height={720} />
    <Composition id="M11" component={M11} durationInFrames={M11_DUR} fps={30} width={1280} height={720} />
    <Composition id="M12" component={M12} durationInFrames={M12_DUR} fps={30} width={1280} height={720} />
    <Composition id="M13" component={M13} durationInFrames={M13_DUR} fps={30} width={1280} height={720} />
    <Composition id="M14" component={M14} durationInFrames={M14_DUR} fps={30} width={1280} height={720} />
    <Composition id="M15" component={M15} durationInFrames={M15_DUR} fps={30} width={1280} height={720} />
    <Composition id="M16" component={M16} durationInFrames={M16_DUR} fps={30} width={1280} height={720} />
  </>
);
