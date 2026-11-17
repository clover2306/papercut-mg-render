import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {T01, T01_DUR} from './scenes/mg/T01';
import {T02, T02_DUR} from './scenes/mg/T02';
import {T03, T03_DUR} from './scenes/mg/T03';
import {T04, T04_DUR} from './scenes/mg/T04';
import {T05, T05_DUR} from './scenes/mg/T05';
import {T06, T06_DUR} from './scenes/mg/T06';
import {T07, T07_DUR} from './scenes/mg/T07';
import {T08, T08_DUR} from './scenes/mg/T08';
import {T09, T09_DUR} from './scenes/mg/T09';
import {T10, T10_DUR} from './scenes/mg/T10';
import {T11, T11_DUR} from './scenes/mg/T11';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="T01" component={T01} durationInFrames={T01_DUR} fps={30} width={1280} height={720} />
    <Composition id="T02" component={T02} durationInFrames={T02_DUR} fps={30} width={1280} height={720} />
    <Composition id="T03" component={T03} durationInFrames={T03_DUR} fps={30} width={1280} height={720} />
    <Composition id="T04" component={T04} durationInFrames={T04_DUR} fps={30} width={1280} height={720} />
    <Composition id="T05" component={T05} durationInFrames={T05_DUR} fps={30} width={1280} height={720} />
    <Composition id="T06" component={T06} durationInFrames={T06_DUR} fps={30} width={1280} height={720} />
    <Composition id="T07" component={T07} durationInFrames={T07_DUR} fps={30} width={1280} height={720} />
    <Composition id="T08" component={T08} durationInFrames={T08_DUR} fps={30} width={1280} height={720} />
    <Composition id="T09" component={T09} durationInFrames={T09_DUR} fps={30} width={1280} height={720} />
    <Composition id="T10" component={T10} durationInFrames={T10_DUR} fps={30} width={1280} height={720} />
    <Composition id="T11" component={T11} durationInFrames={T11_DUR} fps={30} width={1280} height={720} />
  </>
);
