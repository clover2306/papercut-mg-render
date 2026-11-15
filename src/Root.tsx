import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {PLAN} from './scene';
import EP from '../episode.json';
import {D01, D01_DUR} from './scenes/mg/D01';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="D01" component={D01} durationInFrames={D01_DUR} fps={30} width={1280} height={720} />
  </>
);
