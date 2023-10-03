import type {
	AudioEvent,
	CaptionsEvent,
	Chapter,
	EpisodeTooltip,
	Font,
	PreviewTime,
	PlaybackState,
	PlaylistItem,
	toolTooltip,
	VideoPlayerOptions,
	VolumeState,
	VideoPlayer as Types,
} from './index.d';

import * as styles from './styles';

// noinspection JSUnusedGlobalSymbols
export default class Base {

	player: Types['player'] = <Types['player']>{};

	isJwplayer = false;
	isVideojs = false;
	playerType: Types['playerType'] = undefined;
	playerId = '';
	options: VideoPlayerOptions = <VideoPlayerOptions>{};

	setupTime = 0;
	events: string[] = [];

	jwplayerVersion = '8.28.1';
	videojsVersion = '8.6.0';
	videojsPlaylistVersion = '5.1.0';

	message: NodeJS.Timeout = <NodeJS.Timeout>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};

	lock = false;
	controlsVisible = true;
	eventElement: HTMLDivElement = <HTMLDivElement>{};

	hasPipEventHandler = false;
	hasTheaterEventHandler = false;
	hasBackEventHandler = false;

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {

		if (document.querySelector<HTMLDivElement>(`#${playerId}-events`)) {
			this.emit('dispose');
		}
		if(document.querySelector<HTMLDivElement>(`#${playerId}-events`)) {
			document.querySelector<HTMLDivElement>(`#${playerId}-events`)?.remove();
		}

		this.setupTime = Date.now();

		this.eventElement = document.createElement('div');
		this.eventElement.id = `${playerId}-events`;
		this.eventElement.style.display = 'none';
		document.body.appendChild(this.eventElement);

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

		this.#createStyles();

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
			} else {
				this.#loadJWPlayer();
			}
		} else {
			throw new Error(`Invalid player type: ${this.playerId}`);
		}

		this.createSplashScreen();

		String.prototype.toTitleCase = function (): string {
			let i: number;
			let j: number;
			let str: string;

			str = this.replace(/([^\W_]+[^\s-]*) */gu, (txt) => {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});

			// Certain minor words should be left lowercase unless
			// they are the first or last words in the string

			['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
			const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
			for (i = 0, j = lowers.length; i < j; i++) {
				str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
					return txt.toLowerCase();
				});
			}

			// cSpell:disable
			// Certain words such as initialisms or acronyms should be left uppercase
			const uppers = ['Id', 'Tv'];
			for (i = 0, j = uppers.length; i < j; i++) { str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase()); }

			return str;
		};

		/**
		 * @param  {string} lang EN|NL|FR
		 * @param  {boolean} withLowers true|false
		 */
		// cSpell:disable
		String.prototype.titleCase = function (lang: string = navigator.language.split('-')[0], withLowers: boolean = true): string {
			let string = '';
			let lowers: string[] = [];

			string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt) => {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}).replace(/Mc(.)/gu, (_match, next) => {
				return `Mc${next.toUpperCase()}`;
			});

			if (withLowers) {
				lowers = ['A', 'An', 'The', 'At', 'By', 'For', 'In', 'Of', 'On', 'To', 'Up', 'And', 'As', 'But', 'Or', 'Nor', 'Not'];
				if (lang == 'FR') {
					lowers = ['Un', 'Une', 'Le', 'La', 'Les', 'Du', 'De', 'Des', 'À', 'Au', 'Aux', 'Par', 'Pour', 'Dans', 'Sur', 'Et', 'Comme', 'Mais', 'Ou', 'Où', 'Ne', 'Ni', 'Pas'];
				} else if (lang == 'NL') {
					lowers = ['De', 'Het', 'Een', 'En', 'Van', 'Naar', 'Op', 'Door', 'Voor', 'In', 'Als', 'Maar', 'Waar', 'Niet', 'Bij', 'Aan'];
				}
				for (let i = 0; i < lowers.length; i++) {
					string = string.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
						return txt.toLowerCase();
					});
				}
			}

			const uppers = ['Id', 'R&d'];
			for (let i = 0; i < uppers.length; i++) {
				string = string.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase());
			}

			return string;
		};

		// @ts-ignore
		window[`${this.playerId}player`] = this;
	}

	/**
	 * Creates a splash screen element and adds it to the parent element of the player element.
	 * If options.disableControls is true, the function returns without creating the splash screen.
	 * The splash screen is removed once the 'item' event is triggered.
	 */
	createSplashScreen() {
		if (this.options.disableControls) return;

		const splashscreen = document.createElement('div');
		splashscreen.id = 'splashscreen';
		splashscreen.classList.add('nm-absolute', 'nm-inset-0', 'nm-bg-black', 'nm-w-screen', 'nm-h-screen', 'nm-z-50', 'nm-grid', 'nm-place-content-center');

		splashscreen.innerHTML = `
			<div role="status"
				class="nm-flex nm-flex-col nm-items-center nm-gap-4">
				<svg aria-hidden="true"
					class="nm-inline nm-w-12 nm-h-12 nm-mr-2 nm-text- nm-animate-spin nm-text-gray-700 nm-fill-purple-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor" />
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill" />
				</svg>
				<span class="">Setting up player...</span>
			</div>
		`;

		this.getElement()?.parentElement?.prepend(splashscreen);
		
		this.once('item', () => {
			splashscreen.remove();
		});
	}

	/**
	 * Loads the JWPlayer script files and initializes the player with the provided options.
	 * @returns A promise that resolves with the initialized player instance.
	 */
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
					'audioTrackChanged',
					'beforePlay',
					'buffer',
					'bufferChange',
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

	/**
	 * Loads the necessary script files for the video player and initializes it.
	 * @returns A Promise that resolves with the initialized video player.
	 */
	#loadVideoJS() {
		this.#appendScriptFilesToDocument(this.options.scriptFiles ?? [
			`https://vjs.zencdn.net/${this.videojsVersion}/video.min.js`,
			// 'https://vjs.zencdn.net/8.0.4/video-js.css',
			`https://cdn.jsdelivr.net/npm/videojs-playlist@${this.videojsPlaylistVersion}/dist/videojs-playlist.min.js`,
			'https://cdn.jsdelivr.net/npm/videojs-landscape-fullscreen@11.1111.0/dist/videojs-landscape-fullscreen.min.js',
			'https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js',
		])
			.then(() => {

				this.player = window.videojs(this.playerId, this.options);

				this.#loadPlaylist();

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
					'bufferedEnd',
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

	/**
	 * Overrides default options with user-defined options.
	 * If controls or playbackRates are not defined in user options, they will be set to false and an array of playback rates respectively.
	 * If the playerType is 'jwplayer', it will set jwplayerVersion and autostart options.
	 * If displaytitle or displaydescription are not defined in user options, they will be set to false.
	 * If the playerType is not 'jwplayer', it will set videojsVersion and videojsPlaylistVersion options.
	 * It will also set html5, plugins, and vhs options for videojs player.
	 */
	#overrides() {
		// Both
		if (this.options.controls === undefined) {
			this.options.controls = false;
		}
		if (this.options.playbackRates === undefined) {
			this.options.playbackRates = [
				0.25,
				0.5,
				0.75,
				1,
				1.25,
				1.5,
				1.75,
				2,
			];
		}

		if (this.playerType === 'jwplayer') {
			if (this.options.playerVersion !== undefined) {
				this.jwplayerVersion = this.options.playerVersion;
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
				this.videojsVersion = this.options.playerVersion;
			}
			if (this.options.playlistVersion !== undefined) {
				this.videojsPlaylistVersion = this.options.playlistVersion;
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

	/**
	 * Adds the necessary styles to the player element.
	 * @returns void
	 */
	#createStyles() {

		this.addClasses(this.getElement(), ['nomercyplayer']);
		// reset jwplayer styles
		this.getElement().style.width = '';
		this.getElement().style.height = '';
	}

	/**
	 * Initializes the player events and sets up event listeners for each event.
	 * @private
	 */
	#init() {
		this.events.forEach((event) => {
			if (this.isJwplayer) {
				this.player.once(event, (data: any) => {
					// console.log(this.playerType, event, data);
					switch (event) {
					case 'ready':
						this.emit('ready', this.#getReadyState(data));
						break;
					}
				});
			} else {
				this.player.one(event, (data: any) => {
					// console.log(this.playerType, event, data);
					switch (event) {
					case 'duringplaylistchange':
						this.emit('ready', this.#getReadyState(data));
						break;
					}
				});
			}
			this.player.on(event, (data: any) => {
				switch (event) {
				case 'chapter':
					this.emit('chapters', data);
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
					this.emit('audio', data);
					break;
				case 'audioTrackChanged':
					this.emit('audio-change', data);
					break;
				case 'beforePlay':
					this.emit('beforeplay');
					break;
				case 'beforeplaylistItem':
					this.emit('beforeplaylistitem');
					break;
				case 'buffer':
					this.emit('waiting', data);
					break;
				case 'bufferedEnd':
					this.emit('bufferedEnd', data);
					break;
				case 'canplay':
					break;
				case 'canplaythrough':
					// this.emit('item', data);
					break;
				case 'controls':
					break;
				case 'displayClick':
					break;
				case 'duringplaylistchange':
					this.emit('duringplaylistchange');
					break;
				case 'complete': // jwplayer
				case 'ended': // videojs
					this.emit('ended');
					break;
				case 'error':
					console.log('error', data);
					this.emit('error', data);
					break;
				case 'fullscreen': // jwplayer
				case 'fullscreenchange': // videojs
					this.emit('fullscreen', this.isFullscreen());
					break;
				case 'idle': // jwplayer
					break;
				case 'loadeddata': // videojs
					break;
				case 'loadedmetadata': // videojs
					this.emit('duration', this.getTimeState(data));
					this.emit('audio', this.#getAudioState());
					this.emit('captions', this.getCaptionState());
					break;
				case 'loadstart': // videojs
					break;
				case 'mute':
					this.emit('mute', this.#getPlaybackState(data));
					break;
				case 'pause':
					this.emit('pause', data);
					break;
				case 'play':
					this.emit('play', data);
					break;
				case 'firstFrame': // jwplayer aka playing
				case 'playing': // videojs
					this.emit('playing');
					break;
				case 'playlist':
					this.emit('playlist', data);
					break;
				case 'durationchanged':
				case 'playlistItem':
				case 'playlistitem':
					this.emit('item', data);
					this.emit('duration', this.getTimeState(data));
					break;
				case 'playlistchange':
					this.emit('playlistchange');
					break;
				case 'playlistsorted':
					break;
				case 'ratechange':
					this.emit('speed', data);
					break;
				case 'resize':
					break;
				case 'seek':
					break;
				case 'seeked': // both
					this.emit('seeked', data);
					break;
				case 'seeking':
					break;
				case 'setupError':
					break;
				case 'stalled':
					this.emit('stalled', data);
					break;
				case 'suspend':
					break;
				case 'captionsList':
					this.emit('captions', data);
					break;
				case 'captionsChanged':
					this.emit('caption-change', data);
					break;
				case 'time': // JWPlayer
				case 'timeupdate': // VideoJS
					this.emit('time', this.getTimeState(data));
					break;
				case 'volume':
				case 'volumechange':
					this.emit('volume', this.#getPlaybackState(data));
					break;
				case 'waiting':
					this.emit('waiting', data);
					break;
				}
			});
		});
		if (this.isVideojs) {
			const audioTrackList = this.player.audioTracks();
			audioTrackList.addEventListener('change', () => {
				this.emit('audio-change', this.#getAudioState());
			});
		}
		this.once('overlay', () => this.#createStyles());
	}

	/**
	 * Returns the current state of the audio player, including the current track, available tracks, and type of tracks.
	 * @returns {AudioEvent} The current state of the audio player.
	 */
	#getAudioState(): AudioEvent {
		return {
			// eslint-disable-next-line max-len
			currentTrack: this.player.audioTracks().tracks_?.findIndex((track: any) =>
				track.language == this.player.audioTracks().tracks_.find((t: any) => t.enabled)?.language) ?? 0,
			tracks: this.player.audioTracks().tracks_,
			type: 'audioTracks',
		};
	}

	/**
	 * Returns the current state of the captions, including the active track, available tracks, and the type of event that triggered the state change.
	 * @param manual - Whether the state change was triggered manually by the user.
	 * @returns An object containing the current state of the captions.
	 */
	getCaptionState(manual = false): CaptionsEvent {

		const tracks = this.player.textTracks().tracks_
			.filter((t: any) => (t.kind == 'captions' || t.kind == 'subtitles') && t.label !== 'segment-metadata');

		tracks.unshift({
			id: 'off', 
			label: 'Off',
			language: 'off',
			type: 'subtitle',
			index: -1,
			styled: false,
		});
		
		let index = -1;

		for (const track of tracks) {
			if (track.mode == 'showing') {
				index = tracks.findIndex((t: TextTrack) => t.id == track.id);
			}
		}
		return {
			track: index,
			tracks: tracks,
			type: manual ? 'captionsChanged' : 'captionsList',
		};
	}

	/**
	 * Returns an object containing the player's readiness state.
	 * @param data - An object containing setup time and viewability information.
	 * @returns An object containing the player's readiness state, including setup time, viewability, and type.
	 */
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

	/**
	 * Returns the current playback state of the player.
	 * @param data Optional data object containing position, duration, type, and viewable properties.
	 * @returns The current playback state of the player.
	 */
	getTimeState(data?: { position: number; duration: number; type: any; viewable: any; }): PlaybackState {
		if (this.isJwplayer) {
			return {
				position: Math.abs(this.player.getCurrentTime()),
				duration: Math.abs(this.player.getDuration()),
				remaining: this.player.getDuration() < 0 ? Infinity : Math.abs(this.player.getDuration()) - Math.abs(this.player.getCurrentTime()),
				buffered: this.player.getBuffer(),
				percentage: (Math.abs(this.player.getCurrentTime()) / Math.abs(this.player.getDuration())) * 100,
				type: data?.type ?? 'time',
				viewable: data?.viewable == 1 ?? this.isInViewport(),
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

	/**
	 * Returns the current playback state of the player.
	 * If the player is a JWPlayer, it returns the volume and the data object.
	 * If the player is not a JWPlayer, it returns the volume and the type object.
	 * @param data - The data object to be returned if the player is a JWPlayer.
	 * @returns The current playback state of the player.
	 */
	#getPlaybackState(data: any) {
		if (this.isJwplayer) {
			data.volume = this.player.getVolume();
			return data;
		}
		return {
			volume: this.player.volume() * 100,
			type: 'volume',
		};

	}

	/**
	 * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
	 * @param url The URL to fetch the playlist from.
	 * @returns The converted playlist for the current player.
	 */
	async #fetchPlaylist(url: string) {

		const headers: { [arg: string]: string; } = {
			'Accept-Language': localStorage.getItem('NoMercy-displayLanguage') ?? navigator.language,
			'Content-Type': 'application/json',
		};

		if (this.options.accessToken) {
			headers.Authorization = `Bearer ${this.options.accessToken}`;
		}
		const response = await fetch(url, {
			headers,
			method: 'GET',
		});
		const json = await response.json();
		return this.convertPlaylistToCurrentPlayer(json);
	}

	/**
	 * Loads the playlist for the player based on the options provided.
	 * If the playlist is a string, it will be fetched and parsed as JSON.
	 * If the playlist is an array, it will be used directly.
	 */
	#loadPlaylist() {
		if (typeof this.options.playlist === 'string') {
			this.#fetchPlaylist(this.options.playlist)
				.then((json) => {
					this.player.playlist(json, 0);
					this.player.playlist.autoadvance(0);
				});
		} else if (Array.isArray(this.options.playlist)) {
			this.player.playlist(this.options.playlist, 0);
			this.player.playlist.autoadvance(0);
		}
	}

	/**
	 * Appends script and stylesheet files to the document head.
	 * @param {string | any[]} filePaths - The file paths to append to the document head.
	 * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
	 * @throws {Error} If an unsupported file type is provided.
	 */
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

	/**
	 * Displays a message for a specified amount of time.
	 * @param data The message to display.
	 * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
	 */
	displayMessage(data: string, time = 2000) {
		clearTimeout(this.message);
		this.emit('display-message', data);
		this.message = setTimeout(() => {
			this.emit('remove-message', data);
		}, time);
	}

	/**
	 * Returns the HTMLDivElement element with the specified player ID.
	 * @returns The HTMLDivElement element with the specified player ID.
	 */
	getElement(): HTMLDivElement {
		return document.getElementById(this.playerId) as HTMLDivElement;
	}

	/**
	 * Returns the HTMLVideoElement contained within the base element.
	 * @returns The HTMLVideoElement contained within the base element.
	 */
	getVideoElement(): HTMLVideoElement {
		return this.getElement().querySelector<HTMLVideoElement>('video')!;
	}

	/**
	 * Checks if the player element is currently in the viewport.
	 * @returns {boolean} True if the player is in the viewport, false otherwise.
	 */
	isInViewport(): boolean {
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

	/**
	 * Converts a given time in seconds or string format to a human-readable time format.
	 * @param time - The time to convert, in seconds or string format.
	 * @returns A string representing the time in the format "DD:HH:MM:SS".
	 */
	humanTime(time: string | number) {
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

	/**
	 * Converts a time string in the format "hh:mm:ss" to seconds.
	 * @param hms The time string to convert.
	 * @returns The number of seconds represented by the time string.
	 */
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

	/**
	 * Pads a number with leading zeros until it reaches the specified number of places.
	 * @param number - The number to pad.
	 * @param places - The number of places to pad the number to. Defaults to 2.
	 * @returns The padded number as a string.
	 */
	pad(number: string | number, places = 2) {
		if (typeof number !== 'undefined') {
			const zero = places - number.toString().length + 1;

			return Array(+(zero > 0 && zero)).join('0') + number;
		}
		return '';
	};

	/**
	 * Fetches the contents of a file from the specified URL using the provided options and callback function.
	 * @param url - The URL of the file to fetch.
	 * @param options - The options to use when fetching the file.
	 * @param callback - The callback function to invoke with the fetched file contents.
	 * @returns A Promise that resolves with the fetched file contents.
	 */
	getFileContents = async ({ url, options, callback }: { url: string, options: any, callback: (arg: string|Blob) => void; }) => {

		const headers: { [arg: string]: string; } = {
			'Accept-Language': localStorage.getItem('NoMercy-displayLanguage') ?? 'en',
		};
		if (this.options.accessToken && !options.anonymous) {
			headers.Authorization = `Bearer ${this.options.accessToken}`;
		}

		let basePath = '';
		if (this.options.basePath && !url.startsWith('http')) {
			basePath = this.options.basePath;
		}

		return await fetch(basePath + url, {
			...options,
			headers,
		})
			.then(async (body) => {
				options.type === 'blob' ? callback(await body.blob()) : callback(await body.text());
			})
			.catch((error) => {
				// console.error(error);
			});
	};

	/**
	 * Merges the default styles with the styles for a specific style name.
	 * @param styleName - The name of the style to merge.
	 * @param defaultStyles - The default styles to merge.
	 * @returns An array containing the merged styles.
	 */
	mergeStyles(styleName: string, defaultStyles: string[]) {
		const styles = this.options.styles?.[styleName] || [];
		return [...defaultStyles, ...styles];
	}

	/**
	 * Returns a merged style object for the given style name.
	 * @param name - The name of the style to merge.
	 * @returns The merged style object.
	 */
	makeStyles = (name: string) => {
		return this.mergeStyles(`${name}`, (styles as any)[name]);
	};

	/**
	 * Creates a new HTML element of the specified type and assigns the given ID to it.
	 * @param type - The type of the HTML element to create.
	 * @param id - The ID to assign to the new element.
	 * @returns An object with methods to add classes, append to a parent element, and get the created element.
	 */
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string) {
		const el = document.createElement(type);
		el.id = id;

		return {
			addClasses: (names: string[]) => this.addClasses(el, names),
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return el;
			},
			get: () => el,
		}
	}

	/**
	 * Adds the specified CSS class names to the given element's class list.
	 * 
	 * @param el - The element to add the classes to.
	 * @param names - An array of CSS class names to add.
	 * @returns An object with two methods:
	 *   - `appendTo`: A function that appends the element to a parent element and returns the element.
	 *   - `get`: A function that returns the element.
	 * @template T - The type of the element to add the classes to.
	 */
	addClasses<T extends Element>(el: T, names: string[]) {
		for (const name of names.filter(Boolean)) {
			el.classList?.add(name.trim());
		}
		return {
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return el;
			},
			get: () => el,
		};
	}

	/**
	 * Converts a playlist to the format required by the current player.
	 * @param playlist The playlist to convert.
	 * @returns The converted playlist.
	 */
	convertPlaylistToCurrentPlayer(playlist: PlaylistItem[]) {

		const newPlaylist: PlaylistItem[] = [];

		for (const item of playlist) {

			let basePath = '';
			if (this.options.basePath) {
				basePath = this.options.basePath;
			}

			const file = basePath + (item.sources?.[0]?.src || item.file);

			const token = this.options.accessToken 
				? `?token=${this.options.accessToken}` 
				: '';
				
			const image = item.image?.includes('http') 
				? item.image 
				: basePath + (item.poster ?? item.image);

			const poster = item.poster?.includes('http') 
				? item.poster 
				: basePath + (item.image ?? item.poster);

			const logo = item.logo?.includes('http') 
				? item.logo 
				: basePath + (item.logo ?? item.logo);

			const newItem: PlaylistItem = {
				...item,
				image,
				poster,
				logo,

				sources: item.file 
					? [
						{
							src: item.file?.endsWith('.m3u8') 
								? basePath + item.file 
								: `${basePath + item.file}${token}`,

							type: item.file?.endsWith('.m3u8') 
								? 'application/x-mpegURL' 
								: 'video/mp4',
						}] 
					: item.sources?.map((i) => {
						return {
							src: i.src?.endsWith('.m3u8') 
								? basePath + i.src 
								: `${basePath + i.src}${token}`,
							type: i.src?.endsWith('.m3u8') 
								? 'application/x-mpegURL' 
								: 'video/mp4',
						};
					}) ?? [],
				file: file.endsWith('.m3u8') 
					? file 
					: `${file}${token}`,
			};

			if (this.playerType === 'jwplayer') {
				delete newItem.poster;
				delete newItem.sources;
				delete newItem.textTracks;
				delete newItem.sources;

				newItem.tracks = [
					...item.tracks?.filter(t => t.kind == 'captions')?.map(t => ({
						...t,
						file: basePath + t.file,
					})) ?? [],
					...item.textTracks?.map(t => ({
						...t,
						file: basePath + t.src,
					})) ?? [],
				];

				newItem.metadata = [
					...item.tracks?.filter(t => t.kind !== 'captions').map((m) => {
						return {
							...m,
							src: basePath + m.file,
						};
					}) ?? [],
				];
			} else {
				delete newItem.file;
				delete newItem.tracks;

				newItem.textTracks = [
					...item.textTracks?.map((m) => {
						return {
							...m,
							src: basePath + m.src,
						};
					}) ?? [],
					...item.tracks?.filter(t => t.kind === 'captions')
						.map(t => ({
							kind: 'subtitles',
							src: basePath + t.file,
							label: t.label,
						})) ?? [],
				 ] as unknown as PlaylistItem['textTracks'];

				newItem.metadata = [
					...item.tracks?.filter(t => t.kind !== 'captions').map((m) => {
						return {
							...m,
							file: basePath + m.file,
						};
					}) ?? [],
					...item.metadata?.filter(t => t.kind !== 'captions').map((m) => {
						return {
							...m,
							file: basePath + m.file,
						};
					}) ?? [],
				];
			}

			newPlaylist.push(newItem);
		}

		return newPlaylist;
	}

	/**
	 * Determines if the current device is a mobile device.
	 * @returns {boolean} True if the device is a mobile device, false otherwise.
	 */
	isMobile(): boolean {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(navigator.userAgent) && !this.options.disableTouchControls;
	}

	/**
	 * Determines if the current device is a TV based on the user agent string or the window dimensions.
	 * @returns {boolean} True if the current device is a TV, false otherwise.
	 */
	isTv(): boolean {
		return /Playstation|webOS|AppleTV|AndroidTV|SmartTV|NetCast|NetTV|SmartTV|SmartTV|Tizen|TV/iu.test(navigator.userAgent) 
			|| window.innerHeight == 540 && window.innerWidth == 960 || this.options.forceTvMode == true;
	}

	/**
	 * Attaches a double tap event listener to the element.
	 * @param callback - The function to execute when a double tap event occurs.
	 * @param callback2 - An optional function to execute when a second double tap event occurs.
	 * @returns A function that detects double tap events.
	 */
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

	/**
	 * Returns the path of the currently executing script.
	 * @returns {string} The path of the currently executing script.
	 */
	currentScriptPath = function (): string {
		const scripts = document.querySelectorAll('link');
		const currentScript = scripts[1].href;
		const currentScriptChunks = currentScript.split('/');
		const currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
		return currentScript.replace(currentScriptFile, '');
	};

	/**
	 * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
	 * @param str - The sentence to limit.
	 * @param characters - The maximum number of characters to allow in the sentence.
	 * @returns The truncated sentence.
	 */
	limitSentenceByCharacters(str: string, characters = 360) {
		if (!str) {
			return '';
		}
		const arr: any = str.substring(0, characters).split('.');
		arr.pop(arr.length);
		return `${arr.join('.')}.`;
	};

	/**
	 * Adds a line break before the episode title in a TV show string.
	 * @param str - The TV show string to modify.
	 * @param removeShow - Whether to remove the TV show name from the modified string.
	 * @returns The modified TV show string.
	 */
	lineBreakShowTitle(str: string, removeShow = false) {
		if (!str) {
			return '';
		}
		const ep = str.match(/S\d{2}E\d{2}/u);

		if (ep) {
			const arr = str.split(/\sS\d{2}E\d{2}\s/u);
			if (removeShow) {
				return `${ep[0]} ${arr[1]}`;
			}
			return `${arr[0]} \n${ep[0]} ${arr[1]}`;
		}

		return str;
	};

	/**
	 * Returns an array of unique objects based on a specified key.
	 * @param array The array to filter.
	 * @param key The key to use for uniqueness comparison.
	 * @returns An array of unique objects.
	 */
	unique<T>(array: T[], key: string): T[] {
		if (!array || !Array.isArray(array)) {
			return [];
		}

		return array.filter((obj: any, pos, arr) => arr
			.map((mapObj: any) => mapObj[key]).indexOf(obj[key]) === pos);
	};

	/**
	 * Returns a boolean indicating whether the player is currently in fullscreen mode.
	 * @returns {boolean} True if the player is in fullscreen mode, false otherwise.
	 */
	isFullscreen(): boolean {
		if (this.isJwplayer) {
			return this.player.getFullscreen();
		}
		return this.player.isFullscreen();
	}

	/**
	 * Disposes the player instance and removes it from the DOM.
	 */
	dispose() {
		if (this.isJwplayer) {
			this.player.remove();
		} else {
			this.player.dispose();
		}
	}
	
	/**
	 * Trigger an event on the player.
	 * @param eventType type of event to trigger
	 * @param data  data to pass with the event
	 */
	emit(eventType: `show-${string}-menu`, data: boolean): void;
	emit(eventType: 'audio-change', data: AudioEvent): void;
	emit(eventType: 'audio', data: AudioEvent): void;
	emit(eventType: 'back'): void;
	emit(eventType: 'caption-change', data: CaptionsEvent): void;
	emit(eventType: 'captions', data: CaptionsEvent): void;
	emit(eventType: 'fonts', data: Font[]): void;
	emit(eventType: 'chapters', data: Chapter[]): void;
	emit(eventType: 'skippers', data: Chapter[]): void;
	emit(eventType: 'controls', showing: boolean): void;
	emit(eventType: 'display-message', value: string): void;
	emit(eventType: 'duration', data: PlaybackState): void;
	emit(eventType: 'error', data: any): void;
	emit(eventType: 'error', data: any): void;
	emit(eventType: 'forward', amount: number): void;
	emit(eventType: 'fullscreen', enabled?: boolean): void;
	emit(eventType: 'hide-tooltip', data?: any): void;
	emit(eventType: 'hide-episode-tip', data?: any): void;
	emit(eventType: 'item', data?: any): void;
	emit(eventType: 'mute', data: VolumeState): void;
	emit(eventType: 'overlay', data?: any): void;
	emit(eventType: 'pause', data?: any): void;
	emit(eventType: 'pip', enabled: boolean): void;
	emit(eventType: 'pip-internal', enabled: boolean): void;
	emit(eventType: 'play', data?: any): void;
	emit(eventType: 'playing', data?: any): void;
	emit(eventType: 'playlist-menu-button-clicked', data?: any): void;
	emit(eventType: 'pop-image', url: string): void;
	emit(eventType: 'quality', data: number[]): void;
	emit(eventType: 'ready', data?: any): void;
	emit(eventType: 'remove-forward', data?: any): void;
	emit(eventType: 'remove-message', value: string): void;
	emit(eventType: 'remove-rewind', data?: any): void;
	emit(eventType: 'resize', data?: any): void;
	emit(eventType: 'rewind', amount: number): void;
	emit(eventType: 'seeked', data?: any): void;
	emit(eventType: 'show-language-menu', open: boolean): void;
	emit(eventType: 'show-main-menu', open: boolean): void;
	emit(eventType: 'show-menu', open: boolean): void;
	emit(eventType: 'show-next-up'): void;
	emit(eventType: 'show-playlist-menu', open: boolean): void;
	emit(eventType: 'show-seek-container', open: boolean): void;
	emit(eventType: 'show-quality-menu', open: boolean): void;
	emit(eventType: 'show-speed-menu', open: boolean): void;
	emit(eventType: 'show-subtitles-menu', open: boolean): void;
	emit(eventType: 'show-tooltip', data: toolTooltip): void;
	emit(eventType: 'show-episode-tip', data: EpisodeTooltip): void;
	emit(eventType: 'speed', enabled: number): void;
	emit(eventType: 'switch-season', season: number): void;
	emit(eventType: 'theaterMode', enabled: boolean): void;
	emit(eventType: 'time', data: PlaybackState): void;
	emit(eventType: 'currentScrubTime', data: PlaybackState): void;
	emit(eventType: 'lastTimeTrigger', data: PlaybackState): void;
	emit(eventType: 'waiting', data?: any): void;
	emit(eventType: 'stalled', data?: any): void;
	emit(eventType: 'playlist', data?: any): void;
	emit(eventType: 'playlistchange', data?: any): void;
	emit(eventType: 'beforeplay', data?: any): void;
	emit(eventType: 'beforeplaylistitem', data?: any): void;
	emit(eventType: 'beforeplay', data?: any): void;
	emit(eventType: 'bufferedEnd', data?: any): void;
	emit(eventType: 'duringplaylistchange', data?: any): void;
	emit(eventType: 'preview-time', data: PreviewTime[]): void;
	emit(eventType: 'ended', data?: any): void;
	emit(eventType: 'finished'): void;
	emit(eventType: 'volume', data: VolumeState): void;
	emit(eventType: 'dispose'): void;
	emit(eventType: 'showPauseScreen'): void;
	emit(eventType: 'hidePauseScreen'): void;
	emit(eventType: 'showEpisodeScreen'): void;
	emit(eventType: 'hideEpisodeScreen'): void;
	emit(eventType: 'showLanguageScreen'): void;
	emit(eventType: 'hideLanguageScreen'): void;
	emit(eventType: 'showQualityScreen'): void;
	emit(eventType: 'hideQualityScreen'): void;
	emit(eventType: 'back-button-hyjack'): void;
	emit(eventType: 'translations', data: { [key: string]: string }): void;
	emit(eventType: any, data?: any): void {
		if (!data || typeof data === 'string') {
			data = data ?? '';
		} else if (typeof data === 'object') {
			data = { ...(data ?? {}) };
		}

		this.eventElement?.dispatchEvent?.(new CustomEvent(eventType, {
			detail: data,
		}));
	}

	/**
	 * Adds an event listener to the player.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	on(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	on(event: 'audio-change', callback: (data: AudioEvent) => void): void;
	on(event: 'audio', callback: (data: AudioEvent) => void): void;
	on(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	on(event: 'caption-change', callback: (data: CaptionsEvent) => void): void;
	on(event: 'captions', callback: (data: CaptionsEvent) => void): void;
	on(event: 'fonts', callback: (data: Font[]) => void): void;
	on(event: 'chapters', callback: (data: Chapter[]) => void): void;
	on(event: 'skippers', callback: (data: Chapter[]) => void): void;
	on(event: 'controls', callback: (showing: boolean) => void): void;
	on(event: 'display-message', callback: (value: string) => void): void;
	on(event: 'duration', callback: (data: PlaybackState) => void): void;
	on(event: 'duringplaylistchange', callback: (data: PlaybackState) => void): void;
	on(event: 'preview-time', callback: (data: PreviewTime[]) => void): void;
	on(event: 'error', callback: (data: any) => void): void;
	on(event: 'forward', callback: (amount: number) => void): void;
	on(event: 'fullscreen', callback: (enabled: boolean) => void): void;
	on(event: 'hide-tooltip', callback: () => void): void;
	on(event: 'hide-episode-tip', callback: () => void): void;
	on(event: 'item', callback: () => void): void;
	on(event: 'mute', callback: (data: VolumeState) => void): void;
	on(event: 'overlay', callback: () => void): void;
	on(event: 'pause', callback: () => void): void;
	on(event: 'pip', callback: (enabled: boolean) => void): void;
	on(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	on(event: 'play', callback: () => void): void;
	on(event: 'playing', callback: () => void): void;
	on(event: 'playlist-menu-button-clicked', callback: () => void): void;
	on(event: 'pop-image', callback: (url: string) => void): void;
	on(event: 'quality', callback: (data: number[]) => void): void;
	on(event: 'ready', callback: () => void): void;
	on(event: 'remove-forward', callback: () => void): void;
	on(event: 'remove-message', callback: (value: string) => void): void;
	on(event: 'remove-rewind', callback: () => void): void;
	on(event: 'resize', callback: (data: any) => void): void;
	on(event: 'rewind', callback: (amount: number) => void): void;
	on(event: 'seeked', callback: () => void): void;
	on(event: 'show-language-menu', callback: (open: boolean) => void): void;
	on(event: 'show-main-menu', callback: (open: boolean) => void): void;
	on(event: 'show-menu', callback: (open: boolean) => void): void;
	on(event: 'show-next-up', callback: (data?: any) => void): void;
	on(event: 'show-playlist-menu', callback: (open: boolean) => void): void;
	on(event: 'show-seek-container', callback: (open: boolean) => void): void;
	on(event: 'show-quality-menu', callback: (open: boolean) => void): void;
	on(event: 'show-speed-menu', callback: (open: boolean) => void): void;
	on(event: 'show-subtitles-menu', callback: (open: boolean) => void): void;
	on(event: 'show-tooltip', callback: (data: toolTooltip) => void): void;
	on(event: 'show-episode-tip', callback: (data: EpisodeTooltip) => void): void;
	on(event: 'speed', callback: (enabled: number) => void): void;
	on(event: 'switch-season', callback: (season: number) => void): void;
	on(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	on(event: 'time', callback: (data: PlaybackState) => void): void;
	on(event: 'currentScrubTime', callback: (data: PlaybackState) => void): void;
	on(event: 'lastTimeTrigger', callback: (data: PlaybackState) => void): void;
	on(event: 'waiting', callback: (data: any) => void): void;
	on(event: 'stalled', callback: (data: any) => void): void;
	on(event: 'playlist', callback: (data: any) => void): void;
	on(event: 'playlistchange', callback: (data: any) => void): void;
	on(event: 'beforeplay', callback: (data: any) => void): void;
	on(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	on(event: 'bufferedEnd', callback: (data: any) => void): void;
	on(event: 'ended', callback: (data: any) => void): void;
	on(event: 'finished', callback: () => void): void;
	on(event: 'volume', callback: (data: VolumeState) => void): void;
	on(event: 'dispose', callback: (data: any) => void): void;
	on(event: 'showPauseScreen', callback: () => void): void;
	on(event: 'hidePauseScreen', callback: () => void): void;
	on(event: 'showEpisodeScreen', callback: () => void): void;
	on(event: 'hideEpisodeScreen', callback: () => void): void;
	on(event: 'showLanguageScreen', callback: () => void): void;
	on(event: 'hideLanguageScreen', callback: () => void): void;
	on(event: 'showQualityScreen', callback: () => void): void;
	on(event: 'hideQualityScreen', callback: () => void): void;
	on(event: 'back-button-hyjack', callback: () => void): void;
	on(event: 'translations', callback: (data: { [key: string]: string }) => void): void;
	on(event: any, callback: (arg0: any) => any) {
		this.eventHooks(event, true);
		// this.eventElement?.addEventListener(event, e => callback((e as any).detail));
		this.eventElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail));
	}

	/**
	 * Removes an event listener from the player.
	 * @param event - The event to remove.
	 * @param callback - The function to remove.
	 */
	off(event: `show-${string}-menu`, callback: () => void): void;
	off(event: 'audio-change', callback: () => void): void;
	off(event: 'audio', callback: () => void): void;
	off(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	off(event: 'caption-change', callback: () => void): void;
	off(event: 'captions', callback: () => void): void;
	off(event: 'fonts', callback: () => void): void;
	off(event: 'chapters', callback: () => void): void;
	off(event: 'skippers', callback: () => void): void;
	off(event: 'controls', callback: () => void): void;
	off(event: 'display-message', callback: () => void): void;
	off(event: 'duration', callback: () => void): void;
	off(event: 'duringplaylistchange', callback: () => void): void;
	off(event: 'preview-time', callback: () => PreviewTime): void;
	off(event: 'error', callback: () => void): void;
	off(event: 'forward', callback: () => void): void;
	off(event: 'fullscreen', callback: () => void): void;
	off(event: 'hide-tooltip', callback: () => void): void;
	off(event: 'hide-episode-tip', callback: () => void): void;
	off(event: 'item', callback: () => void): void;
	off(event: 'mute', callback: () => void): void;
	off(event: 'overlay', callback: () => void): void;
	off(event: 'pause', callback: () => void): void;
	off(event: 'pip', callback: () => void): void;
	off(event: 'pip-internal', callback: () => void): void;
	off(event: 'play', callback: () => void): void;
	off(event: 'playing', callback: () => void): void;
	off(event: 'playlist-menu-button-clicked', callback: () => void): void;
	off(event: 'pop-image', callback: () => void): void;
	off(event: 'quality', callback: () => void): void;
	off(event: 'ready', callback: () => void): void;
	off(event: 'remove-forward', callback: () => void): void;
	off(event: 'remove-message', callback: () => void): void;
	off(event: 'remove-rewind', callback: () => void): void;
	off(event: 'resize', callback: () => void): void;
	off(event: 'rewind', callback: () => void): void;
	off(event: 'seeked', callback: () => void): void;
	off(event: 'show-language-menu', callback: () => void): void;
	off(event: 'show-main-menu', callback: () => void): void;
	off(event: 'show-menu', callback: () => void): void;
	off(event: 'show-next-up', callback: () => void): void;
	off(event: 'show-playlist-menu', callback: () => void): void;
	off(event: 'show-seek-container', callback: () => void): void;
	off(event: 'show-quality-menu', callback: () => void): void;
	off(event: 'show-speed-menu', callback: () => void): void;
	off(event: 'show-subtitles-menu', callback: () => void): void;
	off(event: 'show-tooltip', callback: () => void): void;
	off(event: 'show-episode-tip', callback: () => void): void;
	off(event: 'speed', callback: () => void): void;
	off(event: 'switch-season', callback: () => void): void;
	off(event: 'theaterMode', callback: () => void): void;
	off(event: 'time', callback: () => void): void;
	off(event: 'currentScrubTime', callback: () => void): void;
	off(event: 'lastTimeTrigger', callback: () => void): void;
	off(event: 'waiting', callback: () => any): void;
	off(event: 'stalled', callback: () => any): void;
	off(event: 'playlist', callback: () => any): void;
	off(event: 'playlistchange', callback: () => any): void;
	off(event: 'beforeplay', callback: () => any): void;
	off(event: 'beforeplaylistitem', callback: () => any): void;
	off(event: 'bufferedEnd', callback: () => any): void;
	off(event: 'ended', callback: () => any): void;
	off(event: 'finished', callback: () => any): void;
	off(event: 'volume', callback: () => void): void;
	off(event: 'dispose', callback: () => void): void;
	off(event: 'showPauseScreen', callback: () => void): void;
	off(event: 'hidePauseScreen', callback: () => void): void;
	off(event: 'showEpisodeScreen', callback: () => void): void;
	off(event: 'hideEpisodeScreen', callback: () => void): void;
	off(event: 'showLanguageScreen', callback: () => void): void;
	off(event: 'hideLanguageScreen', callback: () => void): void;
	off(event: 'showQualityScreen', callback: () => void): void;
	off(event: 'hideQualityScreen', callback: () => void): void;
	off(event: 'back-button-hyjack', callback: () => void): void;
	off(event: 'translations', callback: () => void): void;
	off(event: any, callback: () => void) {
		this.eventHooks(event, false);
		this.eventElement?.removeEventListener(event, () => callback());
	}

	/**
	 * Adds an event listener to the player that will only be called once.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	once(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	once(event: 'audio-change', callback: (data: AudioEvent) => void): void;
	once(event: 'audio', callback: (data: AudioEvent) => void): void;
	once(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	once(event: 'caption-change', callback: (data: CaptionsEvent) => void): void;
	once(event: 'captions', callback: (data: CaptionsEvent) => void): void;
	once(event: 'fonts', callback: (data: Font[]) => void): void;
	once(event: 'chapters', callback: (data: Chapter[]) => void): void;
	once(event: 'skippers', callback: (data: Chapter[]) => void): void;
	once(event: 'controls', callback: (showing: boolean) => void): void;
	once(event: 'display-message', callback: (value: string) => void): void;
	once(event: 'duration', callback: (data: PlaybackState) => void): void;
	once(event: 'duringplaylistchange', callback: (data: PlaybackState) => void): void;
	once(event: 'preview-time', callback: (data: PreviewTime[]) => void): void;
	once(event: 'error', callback: (data: any) => void): void;
	once(event: 'forward', callback: (amount: number) => void): void;
	once(event: 'fullscreen', callback: (enabled: boolean) => void): void;
	once(event: 'hide-tooltip', callback: () => void): void;
	once(event: 'hide-episode-tip', callback: () => void): void;
	once(event: 'item', callback: () => void): void;
	once(event: 'mute', callback: (data: VolumeState) => void): void;
	once(event: 'overlay', callback: () => void): void;
	once(event: 'pause', callback: () => void): void;
	once(event: 'pip', callback: (enabled: boolean) => void): void;
	once(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	once(event: 'play', callback: () => void): void;
	once(event: 'playing', callback: () => void): void;
	once(event: 'playlist-menu-button-clicked', callback: () => void): void;
	once(event: 'pop-image', callback: (url: string) => void): void;
	once(event: 'quality', callback: (data: number[]) => void): void;
	once(event: 'ready', callback: () => void): void;
	once(event: 'remove-forward', callback: () => void): void;
	once(event: 'remove-message', callback: (value: string) => void): void;
	once(event: 'remove-rewind', callback: () => void): void;
	once(event: 'resize', callback: (data: any) => void): void;
	once(event: 'rewind', callback: (amount: number) => void): void;
	once(event: 'seeked', callback: () => void): void;
	once(event: 'show-language-menu', callback: (open: boolean) => void): void;
	once(event: 'show-main-menu', callback: (open: boolean) => void): void;
	once(event: 'show-menu', callback: (open: boolean) => void): void;
	once(event: 'show-next-up', callback: () => void): void;
	once(event: 'show-playlist-menu', callback: (open: boolean) => void): void;
	once(event: 'show-seek-container', callback: (open: boolean) => void): void;
	once(event: 'show-quality-menu', callback: (open: boolean) => void): void;
	once(event: 'show-speed-menu', callback: (open: boolean) => void): void;
	once(event: 'show-subtitles-menu', callback: (open: boolean) => void): void;
	once(event: 'show-tooltip', callback: (data: toolTooltip) => void): void;
	once(event: 'show-episode-tip', callback: (data: EpisodeTooltip) => void): void;
	once(event: 'speed', callback: (enabled: number) => void): void;
	once(event: 'switch-season', callback: (season: number) => void): void;
	once(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	once(event: 'time', callback: (data: PlaybackState) => void): void;
	once(event: 'currentScrubTime', callback: (data: PlaybackState) => void): void;
	once(event: 'lastTimeTrigger', callback: (data: PlaybackState) => void): void;
	once(event: 'waiting', callback: (data: any) => void): void;
	once(event: 'stalled', callback: (data: any) => void): void;
	once(event: 'playlist', callback: (data: any) => void): void;
	once(event: 'playlistchange', callback: (data: any) => void): void;
	once(event: 'beforeplay', callback: (data: any) => void): void;
	once(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	once(event: 'bufferedEnd', callback: (data: any) => void): void;
	once(event: 'ended', callback: (data: any) => void): void;
	once(event: 'finished', callback: () => void): void;
	once(event: 'volume', callback: (data: VolumeState) => void): void;
	once(event: 'dispose', callback: (data: any) => void): void;
	once(event: 'showPauseScreen', callback: () => void): void;
	once(event: 'hidePauseScreen', callback: () => void): void;
	once(event: 'showEpisodeScreen', callback: () => void): void;
	once(event: 'hideEpisodeScreen', callback: () => void): void;
	once(event: 'showLanguageScreen', callback: () => void): void;
	once(event: 'hideLanguageScreen', callback: () => void): void;
	once(event: 'showQualityScreen', callback: () => void): void;
	once(event: 'hideQualityScreen', callback: () => void): void;
	once(event: 'back-button-hyjack', callback: () => void): void;
	once(event: 'translations', callback: (data: { [key: string]: string }) => void): void;
	once(event: any, callback: (arg0: any) => any) {
		this.eventHooks(event, true);
		this.eventElement?.addEventListener(event, e => callback((e as any).detail), { once: true });
	}

	/**
	 * Sets the enabled state of various event hooks.
	 * @param event - The event to enable/disable.
	 * @param enabled - Whether the event should be enabled or disabled.
	 */
	eventHooks(event: any, enabled: boolean) {
		if (event == 'pip') {
			this.hasPipEventHandler = enabled;
		} else if (event == 'theaterMode') {
			this.hasTheaterEventHandler = enabled;
		} else if (event == 'back') {
			this.hasBackEventHandler = enabled;
		}
	}

}
