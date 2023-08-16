import type { VideoPlayerOptions, VideoPlayer as Types } from './index.d';
import UI from './ui';

export default class VideoPlayer extends UI {

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);
	}
}

// @ts-ignore
window.VideoPlayer = VideoPlayer;
