import type {
	Chapter,
	PlaybackState, PlaylistItem, VideoPlayer as Types, VideoPlayerOptions
} from './buckyplayer.d';

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
		this.#appendScriptFilesToDocument(this.options.scriptFiles ?? [`https://ssl.p.jwpcdn.com/player/v/${this.jwplayerVersion}/jwplayer.js`])
			.then(() => {
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
					'beforePlay',
					'buffer',
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
			'https://cdnjs.cloudflare.com/ajax/libs/webvtt-parser/2.2.0/parser.js',
			// `https://vjs.zencdn.net/${this.videojsVersion}/video-js.css`,
		])
			.then(() => {
				this.player = window.videojs(this.playerId, this.options);
				this.#loadPlaylist();

				window.videojs.log.level('off');

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

		this.addClasses(this.getElement(), ['buckyplayer']);
		// reset jwplayer styles
		this.getElement().style.width = '';
		this.getElement().style.height = '';

		if (document.getElementById('buckyplayer-styles')) return;

		const styleSheet = document.createElement('style');
		styleSheet.id = 'buckyplayer-styles';

		const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500&display=swap');
            
            * {
                font-feature-settings: 'tnum' on, 'lnum' on;
            }
            .font-mono {
                font-family: 'Source Code Pro', monospace;
            }
            .buckyplayer {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
				aspect-ratio: 16/9;
            }
			.buckyplayer * {
				user-select: none;
			}
            .vjs-poster, 
            .vjs-loading-spinner,
            .vjs-big-play-button,
            .vjs-control-bar,
            .vjs-hidden {
                display: none !important;
            }
        `;
		styleSheet.innerText = styles;
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
				case 'beforePlay':
					break;
				case 'beforeplaylistItem':
					break;
				case 'buffer':
					break;
				case 'canplay':
					break;
				case 'canplaythrough':
					this.dispatchEvent('item', data);
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
					break;
				case 'loadstart': // videojs
					break;
				case 'mute':
					this.dispatchEvent('mute', data);
					break;
				case 'pause':
					this.dispatchEvent('pause', { data: 'pause' });
					break;
				case 'play':
					this.dispatchEvent('play', data);
					break;
				case 'firstFrame': // jwplayer aka playing
					break;
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

	on(event: 'ready', callback: () => void): void;
	on(event: 'play', callback: () => void): void;
	on(event: 'pause', callback: () => void): void;
	on(event: 'seeked', callback: () => void): void;
	on(event: 'volume', callback: () => void): void;
	on(event: 'mute', callback: () => void): void;
	on(event: 'item', callback: () => void): void;
	on(event: 'fullscreen', callback: () => void): void;
	on(event: 'time', callback: (data: PlaybackState) => void): void;
	on(event: 'duration', callback: (data: PlaybackState) => void): void;
	on(event: 'controls', callback: (value: boolean) => void): void;
	on(event: 'theaterMode', callback: (value: boolean) => void): void;
	on(event: 'chapters', callback: (value: Chapter[]) => void): void;
	on(event: 'pop-image', callback: (value: string) => void): void;
	on(event: any, callback: (arg0: any) => any) {
		this.getElement().parentElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail));
	}

	off(event: any, callback: (arg0: any) => any) {
		this.getElement().parentElement?.removeEventListener(event, (e: { detail: any; }) => callback(e.detail));
	}

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

	addClasses(el: HTMLElement, names: string[]) {
		for (const name of names.filter(Boolean)) {
			el.classList.add(name);
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
					...item.textTracks?.map(t => ({ ...t, file: t.src })) ?? [],
					...item.metadata?.filter(t => t.kind !== 'captions') ?? [],
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
}
