import './index.css';
import {Composition} from 'remotion';
import {CaptionOverlay, CAPTION_OVERLAY_DUR} from './scenes/mg/CaptionOverlay';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CaptionOverlay" component={CaptionOverlay} durationInFrames={CAPTION_OVERLAY_DUR} fps={30} width={1280} height={720} />
  </>
);
