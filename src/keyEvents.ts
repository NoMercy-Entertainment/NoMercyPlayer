import type { Player } from './index.d';

/**
 * Returns an array of key bindings for a player instance.
 * @template T - The type of the player instance.
 * @param {T} player - The player instance to bind keys to.
 * @returns {Array<{name: string, key: string, control: boolean, function: () => void, id: number}>} - An array of key bindings.
 */
export const keyBindings = <T extends Player>(player: T): Array<{ name: string; key: string; control: boolean; function: () => void; id: number; }> => [
	{
		name: 'Play',
		key: 'MediaPlay',
		control: false,
		function: () => player.play(),
	},
	{
		name: 'Pause',
		key: 'MediaPause',
		control: false,
		function: () => player.pause(),
	},
	{
		name: 'Toggle playback',
		key: ' ',
		control: false,
		function: () => player.togglePlayback(),
	},
	{
		name: 'Toggle playback',
		key: 'MediaPlayPause',
		control: false,
		function: () => player.togglePlayback(),
	},
	{
		name: 'Stop',
		key: 'MediaStop',
		control: false,
		function: () => player.stop(),
	},
	{
		name: 'Rewind',
		key: 'ArrowLeft',
		control: false,
		function: () => !player.isTv() ?? player.rewindVideo(),
	},
	{
		name: 'Rewind',
		key: 'MediaRewind',
		control: false,
		function: () => player.rewindVideo(),
	},
	{
		name: 'Fast forward',
		key: 'ArrowRight',
		control: false,
		function: () => !player.isTv() ?? player.forwardVideo(),
	},
	{
		name: 'Fast forward',
		key: 'MediaFastForward',
		control: false,
		function: () => player.forwardVideo(),
	},
	{
		name: 'Previous item',
		key: 'MediaTrackPrevious',
		control: false,
		function: () => player.previous(),
	},
	{
		name: 'Previous item',
		key: 'p',
		control: false,
		function: () => player.previous(),
	},
	{
		name: 'Next item',
		key: 'MediaTrackNext',
		control: false,
		function: () => player.next(),
	},
	{
		name: 'Next item',
		key: 'n',
		control: false,
		function: () => player.next(),
	},
	{
		name: 'Cycle subtitle tracks',
		key: 'Subtitle',
		control: false,
		function: () => player.cycleSubtitles(),
	},
	{
		name: 'Cycle subtitle tracks',
		key: 'v',
		control: false,
		function: () => player.cycleSubtitles(),
	},
	{
		name: 'Cycle audio tracks',
		key: 'Audio',
		control: false,
		function: () => player.cycleAudioTracks(),
	},
	{
		name: 'Cycle audio',
		key: 'b',
		control: false,
		function: () => player.cycleAudioTracks(),
	},
	{
		name: 'Forward 30 seconds',
		key: 'ColorF0Red',
		control: false,
		function: () => player.forwardVideo(30),
	},
	{
		name: 'Forward 60 seconds',
		key: 'ColorF1Green',
		control: false,
		function: () => player.forwardVideo(60),
	},
	{
		name: 'Forward 90 seconds',
		key: 'ColorF2Yellow',
		control: false,
		function: () => player.forwardVideo(90),
	},
	{
		name: 'Forward 120 seconds',
		key: 'ColorF3Blue',
		control: false,
		function: () => player.forwardVideo(120),
	},
	{
		name: 'Forward 30 seconds',
		key: '3',
		control: false,
		function: () => player.forwardVideo(30),
	},
	{
		name: 'Forward 60 seconds',
		key: '6',
		control: false,
		function: () => player.forwardVideo(60),
	},
	{
		name: 'Forward 90 seconds',
		key: '9',
		control: false,
		function: () => player.forwardVideo(90),
	},
	{
		name: 'Forward 120 seconds',
		key: '1',
		control: false,
		function: () => player.forwardVideo(120),
	},
	{
		name: 'Fullscreen',
		key: 'f',
		control: false,
		function: () => player.toggleFullscreen(),
	},
	{
		name: 'Volume up',
		key: 'ArrowUp',
		control: false,
		function: () => !player.isTv() && player.volumeUp(),
	},
	{
		name: 'Volume down',
		key: 'ArrowDown',
		control: false,
		function: () => !player.isTv() && player.volumeDown(),
	},
	{
		name: 'Mute',
		key: 'm',
		control: false,
		function: () => player.toggleMute(),
	},
	{
		name: 'Cycle aspect ratio',
		key: 'BrowserFavorites',
		control: false,
		function: () => player.cycleAspectRatio(),
	},	
	{
		name: 'Show info',
		key: 'Info',
		control: false,
		function: () => {
			// player.showInfo();
		},
	},
].map((control, i) => ({
	...control,
	id: i,
}));
