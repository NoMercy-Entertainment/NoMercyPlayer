// / <reference types="vite/client" />

declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';
declare module '*.png';

interface Window {
	octopusInstance: any;
	player: import('video.js/dist/video');
	playlist: import('video.js/dist/video').playlist;
	textTracks: any;
	audioTracks: any;
	qualityTracks: any;
	videojs: import('video.js/dist/video');
	jwplayer: import('jwplayer');
	socket: import('socket.io-client').Socket;
}

(window as any).orientation = window.orientation || window.mozOrientation || window.msOrientation;

window.matchMedia
	= window.matchMedia
	|| function() {
		return {
			matches: false,
			addListener: function() {
				//
			},
			removeListener: function() {
				//
			},
		};
	};

interface Navigator {
	deviceMemory: number;
}

interface Date {
	format: any;
}

interface String {
	capitalize: () => string;
	toTitleCase: () => string;
	toPascalCase: (string) => string;
	titleCase: (lang: string, withLowers: boolean) => string;
}

declare let window: Window;
declare let navigator: Navigator;
