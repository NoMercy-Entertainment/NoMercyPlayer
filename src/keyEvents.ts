// import type { VideoPlayer } from './index.d';

export const keyBindings = (player: any) => [
	{
		name: 'Play',
		key: 'MediaPlay',
		code: '',
		control: false,
		function: () => player.play(),
	},
	{
		name: 'Pause',
		key: 'MediaPause',
		code: '',
		control: false,
		function: () => player.pause(),
	},
	{
		name: 'Toggle playback',
		key: ' ',
		code: '',
		control: false,
		function: () => player.togglePlayback(),
	},
	{
		name: 'Toggle playback',
		key: 'MediaPlayPause',
		code: '',
		control: false,
		function: () => player.togglePlayback(),
	},
	{
		name: 'Stop',
		key: 'MediaStop',
		code: '',
		control: false,
		function: () => player.stop(),
	},
	{
		name: 'Rewind',
		key: 'ArrowLeft',
		code: '',
		control: false,
		function: () => player.rewindVideo(),
	},
	{
		name: 'Rewind',
		key: 'MediaRewind',
		code: '',
		control: false,
		function: () => player.rewindVideo(),
	},
	{
		name: 'Fast forward',
		key: 'ArrowRight',
		code: '',
		control: false,
		function: () => player.forwardVideo(),
	},
	{
		name: 'Fast forward',
		key: 'MediaFastForward',
		code: '',
		control: false,
		function: () => player.forwardVideo(),
	},
	{
		name: 'Previous item',
		key: 'MediaTrackPrevious',
		code: '',
		control: false,
		function: () => player.previous(),
	},
	{
		name: 'Previous item',
		key: 'p',
		code: '',
		control: false,
		function: () => player.previous(),
	},
	{
		name: 'Next item',
		key: 'MediaTrackNext',
		code: '',
		control: false,
		function: () => player.next(),
	},
	{
		name: 'Next item',
		key: 'n',
		code: '',
		control: false,
		function: () => player.next(),
	},
	{
		name: 'Cycle subtitle tracks',
		key: 'Subtitle',
		code: '',
		control: false,
		function: () => player.cycleSubtitles(),
	},
	{
		name: 'Cycle subtitle tracks',
		key: 'v',
		code: '',
		control: false,
		function: () => player.cycleSubtitles(),
	},
	{
		name: 'Cycle audio tracks',
		key: 'Audio',
		code: '',
		control: false,
		function: () => player.cycleAudioTracks(),
	},
	{
		name: 'Cycle audio',
		key: 'b',
		code: '',
		control: false,
		function: () => player.cycleAudioTracks(),
	},
	{
		name: 'Forward 30 seconds',
		key: 'ColorF0Red',
		code: '',
		control: false,
		function: () => player.forwardVideo(30),
	},
	{
		name: 'Forward 60 seconds',
		key: 'ColorF1Green',
		code: '',
		control: false,
		function: () => player.forwardVideo(60),
	},
	{
		name: 'Forward 90 seconds',
		key: 'ColorF2Yellow',
		code: '',
		control: false,
		function: () => player.forwardVideo(90),
	},
	{
		name: 'Forward 120 seconds',
		key: 'ColorF3Blue',
		code: '',
		control: false,
		function: () => player.forwardVideo(120),
	},
	{
		name: 'Forward 30 seconds',
		key: '3',
		code: '',
		control: false,
		function: () => player.forwardVideo(30),
	},
	{
		name: 'Forward 60 seconds',
		key: '6',
		code: '',
		control: false,
		function: () => player.forwardVideo(60),
	},
	{
		name: 'Forward 90 seconds',
		key: '9',
		code: '',
		control: false,
		function: () => player.forwardVideo(90),
	},
	{
		name: 'Forward 120 seconds',
		key: '1',
		code: '',
		control: false,
		function: () => player.forwardVideo(120),
	},
	{
		name: 'Fullscreen',
		key: 'f',
		code: '',
		control: false,
		function: () => player.toggleFullscreen(),
	},
	{
		name: 'Volume up',
		key: 'ArrowUp',
		code: '',
		control: false,
		function: () => player.volumeUp(),
	},
	{
		name: 'Volume down',
		key: 'ArrowDown',
		code: '',
		control: false,
		function: () => player.volumeDown(),
	},
	{
		name: 'Mute',
		key: 'm',
		code: '',
		control: false,
		function: () => player.toggleMute(),
	},
].map((control, i) => ({
	...control,
	id: i,
}));
