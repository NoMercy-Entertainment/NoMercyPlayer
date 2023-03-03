import type { VideoPlayerOptions, VideoPlayer as Types } from './nomercyplayer.d';
import UI from './ui.js';

export default class VideoPlayer extends UI {

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);
	}
}
