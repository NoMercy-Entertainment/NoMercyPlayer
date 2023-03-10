import type {
	Chapter,
	PlaybackState, PlaylistItem, VideoPlayer as Types, VideoPlayerOptions, VolumeState
} from './nomercyplayer.d';

export default class Base {

	player: Types['player'] = <Types['player']>{};

	isJwplayer = false;
	isVideojs = false;
	playerType: Types['playerType'] = undefined;
	playerId = '';
	options: VideoPlayerOptions = <VideoPlayerOptions>{};

	setupTime = 0;
	events: string[] = [];

	jwplayerVersion = '8.26.7';
	videojsVersion = '8.0.4';
	videojsPlaylistVersion = '5.0.0';

	message: NodeJS.Timeout = <NodeJS.Timeout>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {

		this.setupTime = Date.now();

		if (playerId) {
			this.playerId = playerId;
		} else if (playerType === 'jwplayer') {
			this.playerId = 'jwplayer';
		} else if (playerType === 'videojs') {
			this.playerId = 'videojs';
		}

		this.playerType = playerType;
		this.options = options;

		this.#overrides();

		this.createStyles();

		if (playerType === 'videojs') {
			this.isVideojs = true;
			this.isJwplayer = false;
			this.#loadVideoJS();
		} else if (playerType === 'jwplayer') {
			this.isJwplayer = true;
			this.isVideojs = false;

			if (typeof this.options.playlist === 'string') {
				this.#fetchPlaylist(this.options.playlist)
					.then((playlist) => {
						this.options = { ...this.options, playlist };
					})
					.then(() => {
						this.#loadJWPlayer();
					});
			}
		} else {
			throw new Error(`Invalid player type: ${this.playerId}`);
		}
	}

	#loadJWPlayer() {
		this.#appendScriptFilesToDocument(this.options.scriptFiles ?? [
			`https://ssl.p.jwpcdn.com/player/v/${this.jwplayerVersion}/jwplayer.js`,
			'https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js',
		])
			.then(() => {
				// @ts-ignore
				this.player = window.jwplayer(this.playerId);
				this.player.setup(this.options);
				this.events = [
					'adBlock',
					'adClick',
					'adCompanions',
					'adComplete',
					'adError',
					'adSkipped',
					'adStarted',
					'adTime',
					'audioTracks',
					'audioTracksChanged',
					'beforePlay',
					'buffer',
					'captionsList',
					'captionsChanged',
					'cast',
					'chapter',
					'complete',
					'controls',
					'displayClick',
					'error',
					'firstFrame',
					'fullscreen',
					'idle',
					'mute',
					'pause',
					'play',
					'playlist',
					'playlistItem',
					'playlistComplete',
					'ready',
					'resize',
					'seek',
					'seeked',
					'setupError',
					'time',
					'volume',
				];
			})
			.then(() => {
				this.#init();
				return this.player;
			})
			.catch((err) => {
				console.error('Error loading script file', err);
			});
	}

	#loadVideoJS() {
		this.#appendScriptFilesToDocument(this.options.scriptFiles ?? [
			`https://vjs.zencdn.net/${this.videojsVersion}/video.min.js`,
			`https://cdn.jsdelivr.net/npm/videojs-playlist@${this.videojsPlaylistVersion}/dist/videojs-playlist.min.js`,
			'https://cdn.jsdelivr.net/npm/videojs-landscape-fullscreen@11.1111.0/dist/videojs-landscape-fullscreen.min.js',
			'https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js',
		])
			.then(() => {
				// @ts-ignore
				this.player = window.videojs(this.playerId, this.options);
				this.#loadPlaylist();

				// @ts-ignore
				window.videojs.log.level('off');

				this.player.landscapeFullscreen({
					fullscreen: {
						enterOnRotate: true,
						exitOnRotate: true,
						alwaysInLandscapeMode: true,
						iOS: false,
					},
				});

				const groupCollapsed = window.console.groupCollapsed;
				window.console.groupCollapsed = (e) => {
					if (e.includes('Text Track parsing errors')) {
						return;
					}
					groupCollapsed(e);
				};
				this.events = [
					'beforeplaylistitem',
					'canplay',
					'canplaythrough',
					'duringplaylistchange',
					'ended',
					'error',
					'fullscreenchange',
					'loadeddata',
					'loadedmetadata',
					'loadstart',
					'pause',
					'play',
					'playing',
					'playlistchange',
					'playlistitem',
					'playlistsorted',
					'progress',
					'ratechange',
					'seeked',
					'seeking',
					'stalled',
					'suspend',
					'timeupdate',
					'volumechange',
					'waiting',
				];
			})
			.then(() => {
				this.#init();
				return this.player;
			})
			.catch((err) => {
				console.error('Error loading script file', err);
			});
	}

	#overrides() {
		// Both
		if (this.options.controls === undefined) {
			this.options.controls = false;
		}

		if (this.playerType === 'jwplayer') {
			if (this.options.playlistVersion !== undefined) {
				this.videojsPlaylistVersion = this.options.playlistVersion;
			}
			// @ts-ignore
			this.options.autostart = this.options.autoplay;

			// @ts-ignore
			if (this.options.displaytitle === undefined) {
				// @ts-ignore
				this.options.displaytitle = false;
			}
			// @ts-ignore
			if (this.options.displaydescription === undefined) {
				// @ts-expect-error
				this.options.displaydescription = false;
			}
		} else {
			if (this.options.playerVersion !== undefined) {
				this.jwplayerVersion = this.options.playerVersion;
			}
			if (this.options.playerVersion !== undefined) {
				this.videojsVersion = this.options.playerVersion;
			}

			// @ts-ignore
			this.options.html5 = {
				// @ts-ignore
				...this.options.html5,
				nativeTextTrack: !/ios|Android; vm/iu.test(navigator.userAgent),
				vhs: {
					enableLowInitialPlaylist: true,
					overrideNative: !/Playstation|ios|Android; vm/iu.test(navigator.userAgent),
				},
			};
			// @ts-ignore
			this.options.plugins = {
				// @ts-ignore
				...this.options.plugins,
				// chromecast: {},
			};
			// @ts-ignore
			this.options.vhs = {
				// @ts-ignore
				...this.options.vhs,
				GOAL_BUFFER_LENGTH: 120,
				MAX_GOAL_BUFFER_LENGTH: 240,
			};
		}
	}


	createStyles() {

		this.addClasses(this.getElement(), ['nomercyplayer']);
		// reset jwplayer styles
		this.getElement().style.width = '';
		this.getElement().style.height = '';

		if (document.getElementById('nomercyplayer-styles')) return;

		const styleSheet = document.createElement('style');
		styleSheet.id = 'nomercyplayer-styles';

		const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500&display=swap');
            
            * {
                font-feature-settings: 'tnum' on, 'lnum' on;
            }
            .font-mono {
                font-family: 'Source Code Pro', monospace;
            }
            .nomercyplayer {
				display: flex;
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
				aspect-ratio: 16/9;
            }
			.nomercyplayer * {
				user-select: none;
			}
			.slider-pop-image {
				min-height: 80px;
				min-width: 144px;
			}
            .vjs-poster, 
            .vjs-loading-spinner,
            .vjs-big-play-button,
            .vjs-control-bar,
            .vjs-hidden {
                display: none !important;
            }
			
            .seek-ripple {
				--deg: 90deg;
                align-items: center;
                background: linear-gradient(var(--deg), #ffffff10 10%, #ffffff10 45%, #ffffff05 100%);
                display: none;
                flex-direction: column;
                height: 100%;
                justify-content: center;
                pointer-events: none;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 28%;
			}
			.seek-ripple.left {
				--deg: 90deg;
			}
			.seek-ripple.right {
				--deg: 270deg;
			}
			.seek-ripple-arrow {
				align-items: center;
				display: flex;
				flex-direction: row;
				justify-content: center;
				pointer-events: none;
				position: relative;
				width: 600px;
			}

			.seek-ripple-text {
				font-size: 0.8rem;
				font-weight: 700;
				pointer-events: none;
				position: relative;
				text-align: center;
				width: 600px;
			}
    
            .arrow {
                --size: 0.7;
                border-bottom: calc(var(--size) * 1rem) solid transparent;
                border-top: calc(var(--size) * 1rem) solid transparent;
                float: left;
                height: calc((var(--size) * 1rem) * 2);
				margin-bottom: .5rem;
                width: calc((var(--size) * 1rem) * 2);
            }
    
            .arrow-right {
                border-left: calc((var(--size) * 1rem) + 5px) solid white;
            }
    
            .arrow-left {
                border-right: calc((var(--size) * 1rem) + 5px) solid white;
            }
    
            .arrow1 {
                animation: flash 0.75s infinite;
            }
    
            .arrow2 {
                animation: flash 0.75s infinite 0.25s;
            }
    
            .arrow3 {
                animation: flash 0.75s infinite 0.5s;
            }
			
			@keyframes flash {
				0% {
					opacity: 1;
				}
			
				100% {
					opacity: 0;
				}
			}

			.libassjs-canvas-parent {
				position: absolute !important;
			}
        `;
		styleSheet.innerHTML = styles
			.replace(/[\t]{2,}/gu, '\t')
			.replace(/[\s]{2,}/gu, ' ');

		document.head.appendChild(styleSheet);
	}

	#init() {
		this.events.forEach((event) => {
			if (this.isJwplayer) {
				this.player.once(event, (data: any) => {
					// console.log(this.playerType, event, data);
					switch (event) {
					case 'ready':
						this.dispatchEvent('ready', this.#getReadyState(data));
						break;
					}
				});
			} else {
				this.player.one(event, (data: any) => {
					// console.log(this.playerType, event, data);
					switch (event) {
					case 'duringplaylistchange':
						this.dispatchEvent('ready', this.#getReadyState(data));
						break;
					}
				});
			}
			this.player.on(event, (data: any) => {
				switch (event) {
				case 'chapter':
					this.dispatchEvent('chapters', data);
					break;
				case 'adBlock':
					break;
				case 'adClick':
					break;
				case 'adCompanions':
					break;
				case 'adComplete':
					break;
				case 'adError':
					break;
				case 'adSkipped':
					break;
				case 'adStarted':
					break;
				case 'adTime':
					break;
				case 'audioTracks':
					this.dispatchEvent('audio', data);
					break;
				case 'audioTracksChanged':
					break;
				case 'beforePlay':
					break;
				case 'beforeplaylistItem':
					break;
				case 'buffer':
					break;
				case 'canplay':
					break;
				case 'canplaythrough':
					// this.dispatchEvent('item', data);
					break;
				case 'complete': // jwplayer
					break;
				case 'controls':
					break;
				case 'displayClick':
					break;
				case 'duringplaylistchange':
					break;
				case 'ended': // videojs
					break;
				case 'error':
					this.dispatchEvent('error', data);
					break;
				case 'fullscreen': // jwplayer
				case 'fullscreenchange': // videojs
					this.dispatchEvent('fullscreen', data);
					break;
				case 'idle': // jwplayer
					break;
				case 'loadeddata': // videojs
					break;
				case 'loadedmetadata': // videojs
					this.dispatchEvent('duration', this.#getTimeState(data));
					this.dispatchEvent('audio', data);
					this.dispatchEvent('captions', data);
					break;
				case 'loadstart': // videojs
					break;
				case 'mute':
					this.dispatchEvent('mute', data);
					break;
				case 'pause':
					this.dispatchEvent('pause', data);
					break;
				case 'play':
					this.dispatchEvent('play', data);
					break;
				case 'firstFrame': // jwplayer aka playing
				case 'playing': // videojs
					break;
				case 'playlist':
					break;
				case 'durationchanged':
				case 'playlistItem':
				case 'playlistitem':
					this.dispatchEvent('duration', this.#getTimeState(data));
					this.dispatchEvent('item', data);
					break;
				case 'playlistchange':
					break;
				case 'playlistsorted':
					break;
				case 'ratechange':
					break;
				case 'resize':
					break;
				case 'seek':
					break;
				case 'seeked': // both
					this.dispatchEvent('seeked', data);
					break;
				case 'seeking':
					break;
				case 'setupError':
					break;
				case 'stalled':
					break;
				case 'suspend':
					break;
				case 'captionsList':
					this.dispatchEvent('captions', data);
					break;
				case 'captionsChanged':
					break;
				case 'time': // JWPlayer
				case 'timeupdate': // VideoJS
					this.dispatchEvent('time', this.#getTimeState(data));
					break;
				case 'volume':
				case 'volumechange':
					this.dispatchEvent('volume', this.#getPlaybackState(data));
					break;
				case 'waiting':
					break;
				}
			});
		});
	}

	#getReadyState(data: { setupTime: number; viewable: number; }) {
		if (this.isJwplayer) {
			data.setupTime = Date.now() - this.setupTime;
			return {
				...data,
				viewable: data.viewable == 1,
			};
		}
		return {
			setupTime: Date.now() - this.setupTime,
			viewable: this.isInViewport(),
			type: 'ready',
		};

	}

	#getTimeState(data: { position: number; duration: number; type: any; viewable: any; }): PlaybackState {
		if (this.isJwplayer) {
			return {
				position: this.player.getPosition(),
				duration: this.player.getDuration(),
				remaining: this.player.getDuration() - this.player.getPosition(),
				buffered: (((this.player.getPosition() + this.player.getBuffer()) / this.player.getDuration()) * 100),
				percentage: (this.player.getPosition() / this.player.getDuration()) * 100,
				type: data.type,
				viewable: data.viewable == 1,
			};
		}
		const position = this.player.currentTime();
		const duration = this.player.duration();
		const percentage = (position / duration) * 100;
		const buffered = (this.player.bufferedEnd() / duration) * 100;

		return {
			position,
			duration,
			remaining: duration - position,
			buffered,
			percentage,
			type: 'time',
			viewable: this.isInViewport(),
		};

	}

	#getPlaybackState(data: any) {
		if (this.isJwplayer) {
			return data;
		}
		return {
			volume: this.player.volume() * 100,
			type: 'volume',
		};

	}

	#fetchPlaylist(url: string) {
		return fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				return this.convertPlaylistToCurrentPlayer(json);
			});
	}

	#loadPlaylist() {
		if (typeof this.options.playlist === 'string') {
			this.#fetchPlaylist(this.options.playlist)
				.then((json) => {
					this.player.playlist(json, 0);
					this.player.playlist.autoadvance(1);
				});
		} else if (Array.isArray(this.options.playlist)) {
			this.player.playlist(this.options.playlist, 0);
			this.player.playlist.autoadvance(1);
		}
	}

	#appendScriptFilesToDocument(filePaths: string | any[]): Promise<void> {
		return new Promise((resolve, reject): void => {
			let count = 0;
			const total = filePaths.length;

			if (total === 0) {
				resolve();
			}

			function appendFile(filePath: string) {
				let file;

				if (filePath.endsWith('.js')) {
					file = document.createElement('script');
					file.src = filePath;
				} else if (filePath.endsWith('.css')) {
					file = document.createElement('link');
					file.rel = 'stylesheet';
					file.href = filePath;
				} else {
					reject(new Error('Unsupported file type'));
				}

				if (!file) return reject(new Error('File could not be loaded'));

				file.addEventListener('load', () => {
					count++;
					if (count === total) {
						resolve();
					} else {
						appendFile(filePaths[count]);
					}
				});

				file.addEventListener('error', (err) => {
					reject(err);
				});

				document.head.appendChild(file);
			}

			appendFile(filePaths[0]);
		});
	}

	dispatchEvent(eventType: string, data?: unknown) {
		if (!data || typeof data === 'string') {
			data = data ?? '';
		} else if (typeof data === 'object') {
			data = { ...(data ?? {}) };
		}

		this.getElement().parentElement?.dispatchEvent(new CustomEvent(eventType, {
			detail: data,
		}));
	}

	on(event: 'resize', callback: (data: any) => void): void;
	on(event: 'audio', callback: (data: any) => void): void;
	on(event: 'captions', callback: () => void): void;
	on(event: 'chapters', callback: (data: Chapter[]) => void): void;
	on(event: 'controls', callback: (showing: boolean) => void): void;
	on(event: 'duration', callback: (data: PlaybackState) => void): void;
	on(event: 'forward', callback: (amount: number) => void): void;
	on(event: 'fullscreen', callback: () => void): void;
	on(event: 'item', callback: () => void): void;
	on(event: 'mute', callback: () => void): void;
	on(event: 'pause', callback: () => void): void;
	on(event: 'pip', callback: (enabled: boolean) => void): void;
	on(event: 'play', callback: () => void): void;
	on(event: 'playing', callback: () => void): void;
	on(event: 'pop-image', callback: (url: string) => void): void;
	on(event: 'ready', callback: () => void): void;
	on(event: 'removeForward', callback: () => void): void;
	on(event: 'removeRewind', callback: () => void): void;
	on(event: 'rewind', callback: (amount: number) => void): void;
	on(event: 'seeked', callback: () => void): void;
	on(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	on(event: 'time', callback: (data: PlaybackState) => void): void;
	on(event: 'volume', callback: (data: VolumeState) => void): void;
	on(event: any, callback: (arg0: any) => any) {
		this.getElement().parentElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail));
	}

	off(event: 'resize', callback: () => void): void;
	off(event: 'audio', callback: () => void): void;
	off(event: 'captions', callback: () => void): void;
	off(event: 'chapters', callback: () => void): void;
	off(event: 'controls', callback: () => void): void;
	off(event: 'duration', callback: () => void): void;
	off(event: 'forward', callback: () => void): void;
	off(event: 'fullscreen', callback: () => void): void;
	off(event: 'item', callback: () => void): void;
	off(event: 'mute', callback: () => void): void;
	off(event: 'pause', callback: () => void): void;
	off(event: 'pip', callback: () => void): void;
	off(event: 'play', callback: () => void): void;
	off(event: 'playing', callback: () => void): void;
	off(event: 'pop-image', callback: () => void): void;
	off(event: 'ready', callback: () => void): void;
	off(event: 'removeForward', callback: () => void): void;
	off(event: 'removeRewind', callback: () => void): void;
	off(event: 'rewind', callback: () => void): void;
	off(event: 'seeked', callback: () => void): void;
	off(event: 'theaterMode', callback: () => void): void;
	off(event: 'time', callback: () => void): void;
	off(event: 'volume', callback: () => void): void;
	off(event: any, callback: () => any) {
		this.getElement().parentElement?.removeEventListener(event, (e: { detail: any; }) => callback(e.detail));
	}

	once(event: 'resize', callback: (data: any) => void): void;
	once(event: 'audio', callback: (data: any) => void): void;
	once(event: 'captions', callback: () => void): void;
	once(event: 'chapters', callback: (data: Chapter[]) => void): void;
	once(event: 'controls', callback: (showing: boolean) => void): void;
	once(event: 'duration', callback: (data: PlaybackState) => void): void;
	once(event: 'forward', callback: (amount: number) => void): void;
	once(event: 'fullscreen', callback: () => void): void;
	once(event: 'item', callback: () => void): void;
	once(event: 'mute', callback: () => void): void;
	once(event: 'pause', callback: () => void): void;
	once(event: 'pip', callback: (enabled: boolean) => void): void;
	once(event: 'play', callback: () => void): void;
	once(event: 'playing', callback: () => void): void;
	once(event: 'pop-image', callback: (url: string) => void): void;
	once(event: 'ready', callback: () => void): void;
	once(event: 'removeForward', callback: () => void): void;
	once(event: 'removeRewind', callback: () => void): void;
	once(event: 'rewind', callback: (amount: number) => void): void;
	once(event: 'seeked', callback: () => void): void;
	once(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	once(event: 'time', callback: (data: PlaybackState) => void): void;
	once(event: 'volume', callback: (data: VolumeState) => void): void;
	once(event: any, callback: (arg0: any) => any) {
		this.getElement().parentElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail), { once: true });
	}

	displayMessage(data: string, time = 2000) {
		clearTimeout(this.message);
		this.dispatchEvent('displayMessage', data);
		this.message = setTimeout(() => {
			this.dispatchEvent('removeMessage', data);
		}, time);
	}

	getElement(): HTMLDivElement {
		return document.getElementById(this.playerId) as HTMLDivElement;
	}

	isInViewport() {
		if (this.isJwplayer) {
			return this.player.getViewable();
		}
		const rect = this.player.el_.getBoundingClientRect();
		const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

		const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
		const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

		return (vertInView && horInView);

	}

	humanTime (time: string | number) {
		time = parseInt(time as string, 10);
		let days: any = parseInt(`${(time / (3600 * 24))}`, 10);

		let hours: any = this.pad(parseInt(`${(time % 86400) / 3600}`, 10), 2);

		let minutes: any = parseInt(`${(time % 3600) / 60}`, 10);
		let seconds: any = parseInt(`${time % 60}`, 10);
		if (`${minutes}`.length === 1) {
			minutes = `0${minutes}`;
		}
		if (`${seconds}`.length === 1) {
			seconds = `0${seconds}`;
		}
		if (days === 0) {
			days = '';
		} else {
			days = `${days}:`;
		}
		if (hours === 0) {
			hours = '00:';
		} else {
			hours = `${hours}:`;
		}
		if (minutes === 0) {
			minutes = '00:';
		} else {
			minutes = `${minutes}:`;
		}
		if (hours == '00:' && days == '') {
			hours = '';
		}
		const current = days + hours + minutes + seconds;
		return current.replace('NaN:NaN:NaN:NaN', '00:00');
	}

	convertToSeconds = (hms: string | null) => {
		if (!hms) {
			return 0;
		}
		const a: number[] = hms.split(':').map(n => parseInt(n, 10));
		if (a.length < 3) {
			a.unshift(0);
		}

		return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
	};

	pad(number: string | number, places = 2) {
		if (typeof number !== 'undefined') {
			const zero = places - number.toString().length + 1;

			return Array(+(zero > 0 && zero)).join('0') + number;
		}
		return '';
	};

	getFileContents = async ({ url, options, callback }: {url: string, options: any, callback: (arg: string) => void}) => {

		const headers: {[arg: string]: string} = {
			'Accept-Language': localStorage.getItem('NoMercy-displayLanguage') ?? 'en',
		};
		if (this.options.token && !options.anonymous) {
			headers.Authorization = this.options.token;
		}

		return await fetch(url, {
			...options,
			headers,
		})
			.then(async (body) => {
				callback(await body.text());
			})
			.catch(() => {
				// console.error(error);
			});
	};

	addClasses(el: Element, names: string[]) {
		for (const name of names.filter(Boolean)) {
			el.classList.add(name.trim());
		}
	}

	convertPlaylistToCurrentPlayer(playlist: PlaylistItem[]) {

		const newPlaylist: PlaylistItem[] = [];

		for (const item of playlist) {

			const newItem: PlaylistItem = {
				...item,
				image: item.poster ?? item.image,
				poster: item.image ?? item.poster,
				sources: [
					{
						src: item.file as string,
						type: item.file?.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
					},
					...item.sources ?? [],
				],
				file: item.sources?.[0]?.src || item.file,
			};

			if (this.playerType === 'jwplayer') {
				delete newItem.poster;
				delete newItem.sources;
				delete newItem.textTracks;

				newItem.tracks = [
					...item.tracks?.filter(t => t.kind == 'captions')?.map(t => ({ ...t, file: t.file })) ?? [],
					...item.textTracks?.map(t => ({ ...t, file: t.src })) ?? [],
					...item.metadata?.filter(t => t.kind == 'captions') ?? [],
				];

				newItem.metadata = [
					...item.metadata ?? [],
					...item.tracks?.filter(t => t.kind !== 'captions') ?? [],
				];
			} else {
				delete newItem.image;
				delete newItem.file;
				delete newItem.tracks;

				newItem.textTracks = item.tracks?.filter(t => t.kind === 'captions').map(t => ({
					kind: 'subtitles',
					src: t.file,
					label: t.label,
				})) as unknown as PlaylistItem['textTracks'];

				newItem.metadata = [
					...item.metadata ?? [],
					...item.tracks?.filter(t => t.kind !== 'captions') ?? [],
				];
			}

			newPlaylist.push(newItem);
		};

		return newPlaylist;
	}

	isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(navigator.userAgent);
	}

	doubleTap(callback: (event: Event) => void, callback2?: (event2: Event) => void) {
		const delay = this.options.doubleClickDelay ?? 500;
		let lastTap = 0;
		let timeout: NodeJS.Timeout;
		let timeout2: NodeJS.Timeout;
		return function detectDoubleTap(event: Event, event2?: Event) {
		  const curTime = new Date().getTime();
		  const tapLen = curTime - lastTap;
		  if (tapLen > 0 && tapLen < delay) {
				event.preventDefault();
				callback(event);
				clearTimeout(timeout2);
			} else {
				timeout = setTimeout(() => {
					clearTimeout(timeout);
				}, delay);
				timeout2 = setTimeout(() => {
					callback2?.(event2!);
				}, delay);
		  }
		  lastTap = curTime;
		};
	}

	currentScriptPath = function () {
		const scripts = document.querySelectorAll('link');
		const currentScript = scripts[scripts.length - 1].href;
		const currentScriptChunks = currentScript.split('/');
		const currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
		return currentScript.replace(currentScriptFile, '');
	};
}
