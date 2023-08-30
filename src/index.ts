import type { VideoPlayerOptions, VideoPlayer as Types } from './index.d';
import UI from './ui';

export default class VideoPlayer extends UI {
	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		const origOpen = XMLHttpRequest.prototype.open;
		if(options.token) {
			XMLHttpRequest.prototype.open = function () {
				// @ts-ignore
				origOpen.apply(this, arguments);
				this.setRequestHeader('Authorization', `Bearer ${options.token}`);
			};
		}
	}
}

// @ts-ignore
window.VideoPlayer = VideoPlayer;
