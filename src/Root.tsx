import './index.css';
import {Composition} from 'remotion';
import {MGA, MGA_DUR} from './scenes/mg/MGA';
import {MGB, MGB_DUR} from './scenes/mg/MGB';
import {MGC, MGC_DUR} from './scenes/mg/MGC';
import {MGD, MGD_DUR} from './scenes/mg/MGD';
import {MGE, MGE_DUR} from './scenes/mg/MGE';
import {MGF, MGF_DUR} from './scenes/mg/MGF';
import {MGG, MGG_DUR} from './scenes/mg/MGG';
import {MGH, MGH_DUR} from './scenes/mg/MGH';
import {MGI, MGI_DUR} from './scenes/mg/MGI';
import {MGJ, MGJ_DUR} from './scenes/mg/MGJ';
import {MGK, MGK_DUR} from './scenes/mg/MGK';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MGA" component={MGA} durationInFrames={MGA_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGB" component={MGB} durationInFrames={MGB_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGC" component={MGC} durationInFrames={MGC_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGD" component={MGD} durationInFrames={MGD_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGE" component={MGE} durationInFrames={MGE_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGF" component={MGF} durationInFrames={MGF_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGG" component={MGG} durationInFrames={MGG_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGH" component={MGH} durationInFrames={MGH_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGI" component={MGI} durationInFrames={MGI_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGJ" component={MGJ} durationInFrames={MGJ_DUR} fps={30} width={1280} height={720} />
    <Composition id="MGK" component={MGK} durationInFrames={MGK_DUR} fps={30} width={1280} height={720} />
  </>
);
