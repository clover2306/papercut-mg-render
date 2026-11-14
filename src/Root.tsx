import './index.css';
import {Composition} from 'remotion';
import {PapercutVideo} from './PapercutVideo';
import {MgContoh, MG_DUR} from './scenes/MgContoh';
import {PLAN} from './scene';
import EP from '../episode.json';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={EP.comp} component={PapercutVideo} durationInFrames={PLAN.durationInFrames} fps={30} width={1280} height={720} />
    <Composition id="ContohMG" component={MgContoh} durationInFrames={MG_DUR} fps={30} width={1280} height={720} />
  </>
);
