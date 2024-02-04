import type { VideoPlayerOptions, VideoPlayer as Types } from './index.d';
import UI from './ui';

export default class VideoPlayer extends UI {

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		const origOpen = XMLHttpRequest.prototype.open;
		if (options.accessToken) {
			XMLHttpRequest.prototype.open = function () {
				// @ts-ignore
				origOpen.apply(this, arguments);

				if (arguments[1].includes(options.basePath) || arguments[1].includes(location.hostname)) {
					this.setRequestHeader('Authorization', `Bearer ${options.accessToken?.split('Bearer')[0]}`);
				}
			};
		}
	}
}

// @ts-ignore
window.VideoPlayer = VideoPlayer;
