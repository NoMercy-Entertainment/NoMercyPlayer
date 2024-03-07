import Base from './base';
import { keyBindings } from './keyEvents';
import SubtitlesOctopus from './subtitles-octopus.js';
import translations from './translations';

import type { VideoPlayerOptions, VideoPlayer as Types, TextTrack, PlaylistItem, Player, StretchOptions } from './index.d';
import Sabre, { SABREOptions } from './sabre';

export default class Functions extends Base {
	tapCount = 0;
	leftTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	rightTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	leeway = 300;
	chapters: any;
	skippers: any;

	subsEnabled = false;
	audiosEnabled = false;
	highQuality = false;
	theaterModeEnabled = false;
	pipEnabled = false;
	octopusInstance: any | null = null;
	currentChapterFile = '';
	currentSkipFile = '';
	currentFontFile = '';
	fonts: any;

	frameCallbackHandle: number | null = null;

	lastTime = 0;
	translations: { [key: string]: string } = {};

	/**
	 * The available options for stretching the video to fit the player dimensions.
	 * - `uniform`: Fits JW Player dimensions while maintaining aspect ratio.
	 * - `fill`: Zooms and crops video to fill dimensions, maintaining aspect ratio.
	 * - `exactfit`: Fits JW Player dimensions without maintaining aspect ratio.
	 * - `none`: Displays the actual size of the video file (Black borders).
	 */
	stretchOptions: Array<StretchOptions> = [
		'uniform',
		'fill',
		'exactfit',
		'none',
	];

	currentAspectRatio: typeof this.stretchOptions[number] = this.options.stretching ?? 'uniform';

	/**
	 * Creates a new instance of the VideoPlayer class.
	 * @param playerType - The type of player to use.
	 * @param options - The options to use for the player.
	 * @param playerId - The ID of the player to use.
	 */
	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);
		this.#fetchTranslationsFile().then(() => {
			this.#eventHandlers();
		});
	}

	enabled = false;

	/**
	 * Handles the event listeners for the player instance.
	 */
	#eventHandlers() {
		this.on('item', () => {
			try {
				this.octopusInstance.dispose();
			} catch (error) {
				//
			}

			const image = this.getPlaylistItem()?.image?.replace?.(/w300|w500/u, 'original') ?? '';

			fetch(image, {
				method: 'HEAD',
			})
				.then((response) => {
					if (response.ok) {
						this.getVideoElement().setAttribute('poster', image);
					}
				})
				.catch(() => {
					//
				});

			this.enabled = false;
			this.lastTime = 0;

			this.emit('speed', 1);
			if (this.options.chapters != false) {
				this.#fetchChapterFile();
			}
			if (this.options.skippers != false) {
				this.#fetchSkipFile();
			}
			this.setMediaAPI();
			this.once('play', () => {
				this.setMediaAPI();
			});

			this.once('playing', () => {
				if (localStorage.getItem('subtitle-language') && localStorage.getItem('subtitle-type') && localStorage.getItem('subtitle-ext')) {
					this.setTextTrack(this.getTextTrackIndexBy(
						localStorage.getItem('subtitle-language') as string,
						localStorage.getItem('subtitle-type') as string,
						localStorage.getItem('subtitle-ext') as string
					));
				} else {
					this.setTextTrack(-1);
				}
			});

			this.once('audio', () => {
				if (localStorage.getItem('audio-language')) {
					this.setAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('audio-language') as string));
				} else {
					this.setAudioTrack(0);
				}
				this.once('play', () => {
					if (localStorage.getItem('audio-language')) {
						this.setAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('audio-language') as string));
					} else {
						this.setAudioTrack(0);
					}
				});
			});
		});

		this.on('dispose', () => {
			document.removeEventListener('keyup', this.keyHandler.bind(this), false);

			if (this.isJwplayer) {
				this.player.remove();
			} else {
				this.player.dispose();
			}
			document.querySelector<HTMLDivElement>(`#${this.playerType}-events`)?.remove();
		});

		this.on('time', (data) => {
			if (data.position > this.lastTime + 5) {
				this.emit('lastTimeTrigger', data);
				this.lastTime = data.position;
			}

			if (this.skippers && !this.enabled) {
				this.getSkippers().forEach((skip: any) => {
					if (data.position >= skip.startTime) {

						if (Math.abs(skip.endTime - data.duration) < 5 && this.isLastPlaylistItem()) {
							return;
						}

						this.enabled = true;

						if (Math.abs(skip.endTime - data.duration) < 5) {
							this.emit('show-next-up');
						} else {
							this.seek(skip.endTime);
						}
					}
				});
			}
		});

		this.on('seeked', () => {
			this.enabled = false;
			this.lastTime = 0;
		});

		// Choose what to play
		this.once('item', () => {

			this.getVideoElement().focus();

			const join = this.getParameterByName('join');
			const item = this.getParameterByName('item');
			const itemNumber = item ? parseInt(item, 10) : null;
			const season = this.getParameterByName('season');
			const seasonNumber = season ? parseInt(season, 10) : null;
			const episode = this.getParameterByName('episode');
			const episodeNumber = episode ? parseInt(episode, 10) : null;

			if (join) {
				// Join a session
			} else if (itemNumber) {
				setTimeout(() => {
					this.setEpisode(0, itemNumber);
				}, 0);
			} else if (seasonNumber && episodeNumber) {
				setTimeout(() => {
					this.setEpisode(seasonNumber, episodeNumber);
				}, 0);
			} else {
				// Get item with the latest progress timer

				const progressItem = this.getPlaylist()
					.filter(i => i.progress);

				if (progressItem.length == 0) {
					this.play();
					return;
				}

				const playlistItem = progressItem
					.sort((a, b) => b.progress!.date?.localeCompare(a.progress!.date)).at(0);

				if (!playlistItem?.progress) {
					this.play();
					return;
				}

				setTimeout(() => {
					if (playlistItem.progress && playlistItem.progress.percentage > 95) {
						this.setPlaylistItem(this.getPlaylist().indexOf(playlistItem) + 1);
					} else {
						this.setPlaylistItem(this.getPlaylist().indexOf(playlistItem));
					}
				}, 0);

				this.once('play', () => {
					if (!playlistItem.progress) return;

					setTimeout(() => {
						if (!playlistItem.progress) return;
						this.seek(this.convertToSeconds(playlistItem.duration) / 100 * playlistItem.progress.percentage);
					}, 350);
				});
			}
		});

		this.on('ended', () => {
			if (this.hasPlaylists() && this.isLastPlaylistItem()) {
				this.emit('finished');
			}
		});

		window.addEventListener('orientationchange', this.rotationHandler.bind(this));

		this.keyEvents();
	}

	/**
	 * Returns the current orientation angle of the device.
	 * @returns {number} The orientation angle in degrees.
	 */
	angle(): number {
		// iOS
		if (typeof window.orientation === 'number') {
			return window.orientation;
		}
		// Android
		if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
			return window.screen.orientation.angle;
		}
		return 0;
	}

	/**
	 * Handles the rotation of the player and enters/exits fullscreen mode accordingly.
	 */
	rotationHandler() {
		const currentAngle = this.angle();

		if (currentAngle === 90 || currentAngle === 270 || currentAngle === -90) {
			this.enterFullscreen();
		}
		if (currentAngle === 0 || currentAngle === 180) {
			this.exitFullscreen();
		}

	}

	/**
	 * Attaches event listeners for keyup events to the document, which are handled by the keyHandler method.
	 * If the disableControls option is set to true, no event listeners are attached.
	 */
	keyEvents() {
		if (this.options.disableControls) return;

		document.removeEventListener('keyup', this.keyHandler.bind(this), false);
		document.addEventListener('keyup', this.keyHandler.bind(this), false);
	};

	/**
	 * Handles keyboard events and executes the corresponding function based on the key binding.
	 * @param {KeyboardEvent} event - The keyboard event to handle.
	 */
	keyHandler(event: KeyboardEvent) {
		const keys = keyBindings(this as unknown as Player);
		let keyTimeout = false;

		if (!keyTimeout && this.player) {
			keyTimeout = true;

			if (keys.some(k => k.key === event.key && k.control === event.ctrlKey)) {
				event.preventDefault();
				keys.find(k => k.key === event.key && k.control === event.ctrlKey)?.function();
			} else {
				// alert(event.key);
			}
		}
		setTimeout(() => {
			keyTimeout = false;
		}, 300);
	}

	/**
	 * Returns a boolean indicating whether the player is currently playing.
	 * If the player is a JWPlayer, it checks the player's state.
	 * Otherwise, it checks whether the player is not paused.
	 * @returns {boolean} Whether the player is currently playing.
	 */
	isPlaying(): boolean {
		if (this.isJwplayer) {
			return this.player.getState() === 'playing';
		}
		return !this.player.paused();

	}

	/**
	 * Plays the media if the user activation has been active or is currently active.
	 */
	play() {
		if (navigator.userActivation.hasBeenActive || navigator.userActivation.isActive) {
			try {
				this.player.play();
			} catch (error) {
				//
			}
		}
	}

	/**
	 * Pauses the player.
	 */
	pause() {
		this.player.pause();
	}

	/**
	 * Stops the player.
	 */
	stop() {
		this.player.stop();
	}

	/**
	 * Toggles the playback state of the player.
	 * If the player is currently playing, it will pause it.
	 * If the player is currently paused, it will play it.
	 */
	togglePlayback() {
		if (this.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	}

	/**
	 * Returns a boolean indicating whether the player is currently muted.
	 * If the player is a JWPlayer, it will return the value of `player.getMute()`.
	 * Otherwise, it will return the value of `player.muted()`.
	 * @returns {boolean} A boolean indicating whether the player is currently muted.
	 */
	isMuted(): boolean {
		if (this.isJwplayer) {
			return this.player.getMute();
		}
		return this.player.muted();

	}

	/**
	 * Mutes the player.
	 */
	mute() {
		if (this.isJwplayer) {
			this.player.setMute(true);
		} else {
			this.player.muted(true);
		}
	}

	/**
	 * Unmutes the player.
	 */
	unMute() {
		if (this.isJwplayer) {
			this.player.setMute(false);
		} else {
			this.player.muted(false);
		}
	}

	/**
	 * Toggles the mute state of the player.
	 * If the player is currently muted, it will be unmuted.
	 * If the player is currently unmuted, it will be muted.
	 */
	toggleMute() {
		if (this.isMuted()) {
			this.unMute();
		} else {
			this.mute();
		}
	}

	/**
	 * Sets the volume of the player.
	 * @param volume - The volume level to set, between 0 and 100.
	 */
	setVolume(volume: number) {
		if (volume > 100) {
			volume = 100;
		} else if (volume < 0) {
			volume = 0;
		}
		if (this.isJwplayer) {
			this.player.setVolume(volume);
		} else {
			this.player.volume(volume / 100);
		}
	}

	/**
	 * Returns the current volume level of the player.
	 * If the player is a JWPlayer instance, it will return the volume level using the `getVolume` method.
	 * Otherwise, it will return the volume level multiplied by 100 using the `volume` method.
	 * @returns The current volume level of the player.
	 */
	getVolume() {
		if (this.isJwplayer) {
			return this.player.getVolume();
		}
		return this.player.volume() * 100;

	}

	/**
	 * Increases the volume of the player by 10 units, up to a maximum of 100.
	 */
	volumeUp() {
		if (this.getVolume() === 100) {
			this.setVolume(100);
			this.displayMessage(`${this.localize('Volume')}: 100%`);
		} else {
			this.setVolume(this.getVolume() + 10);
		}
	}

	/**
	 * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
	 */
	volumeDown() {
		if (this.getVolume() === 0) {
			this.mute();
		} else {
			this.unMute();
			this.setVolume(this.getVolume() - 10);
		}
	}

	/**
	 * Restarts the video.
	 */
	restart() {
		this.seek(0);
		this.play();
	}

	/**
	 * Plays to the previous item in the playlist.
	 */
	previous() {
		if (this.isJwplayer) {
			if (this.player.getPlaylistIndex() === 0) {
				this.player.playlistItem(this.player.getPlaylistIndex() - 1);
			} else {
				this.player.playlistPrev();
			}
		} else {
			if (this.player.playlist.currentItem() === 0) {
				this.player.playlist.currentItem(this.player.playlist().length - 1);
			} else {
				this.player.playlist.previous();
			}
			this.player.play();
		}
	};

	/**
	 * Plays the next item in the playlist.
	 */
	next() {
		if (this.isJwplayer) {
			if (this.player.getPlaylistIndex() === this.player.getPlaylist().length) {
				this.player.playlistItem(0);
			} else {
				this.player.playlistNext();
			}
		} else {
			if (this.player.playlist.currentItem() === this.player.playlist.lastIndex()) {
				this.player.playlist.currentItem(0);
			} else {
				this.player.playlist.next();
			}
			this.player.play();
		}
	};

	/**
	 * Returns the current playback time of the media player.
	 * If the player is a JW Player, the absolute value of the current time is returned.
	 * Otherwise, the current time is returned.
	 * @returns The current playback time of the media player.
	 */
	currentTime() {
		if (this.isJwplayer) {
			return Math.abs(this.player.getCurrentTime());
		}
		return this.player.currentTime();

	}

	/**
	 * Returns the duration of the currently playing media.
	 * If the player is a JWPlayer, the duration is obtained using the player.getDuration() method.
	 * Otherwise, the duration is obtained using the player.duration() method.
	 * @returns The duration of the currently playing media.
	 */
	duration() {
		if (this.isJwplayer) {
			return Math.abs(this.player.getDuration());
		}
		return this.player.duration();

	}

	/**
	 * Seeks to a specified time in the video.
	 * @param time - The time to seek to, in seconds.
	 */
	seek(time: number) {
		if (this.isJwplayer) {
			this.player.seek(time);
		} else {
			this.player.currentTime(time);
		}
	}

	/**
	 * Rewinds the video by a specified time interval.
	 * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
	 */
	rewindVideo(time = this.options.seekInterval ?? 10) {
		this.emit('remove-forward');
		clearTimeout(this.leftTap);

		this.tapCount += time;
		this.emit('rewind', this.tapCount);

		this.leftTap = setTimeout(() => {
			this.emit('remove-rewind');
			this.seek(this.currentTime() - this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

	/**
	 * Forwards the video by the specified time interval.
	 * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
	 */
	forwardVideo(time = this.options.seekInterval ?? 10) {
		this.emit('remove-rewind');
		clearTimeout(this.rightTap);

		this.tapCount += time;
		this.emit('forward', this.tapCount);

		this.rightTap = setTimeout(() => {
			this.emit('remove-forward');
			this.seek(this.currentTime() + this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

	/**
	 * Sets the current episode to play based on the given season and episode numbers.
	 * If the episode is not found in the playlist, the first item in the playlist is played.
	 * @param season - The season number of the episode to play.
	 * @param episode - The episode number to play.
	 */
	setEpisode(season: number, episode: number) {
		const item = this.getPlaylist().findIndex((l: any) => l.season == season && l.episode == episode);
		if (item == -1) {
			this.setPlaylistItem(0);
		} else {
			this.setPlaylistItem(item);
		}
		this.play();
	};

	/**
	 * Returns a boolean indicating whether the player is currently in fullscreen mode.
	 * If the player is a JWPlayer, it will return the value of `player.getFullscreen()`.
	 * Otherwise, it will return the value of `player.isFullscreen()`.
	 * @returns {boolean} A boolean indicating whether the player is currently in fullscreen mode.
	 */
	isFullscreen(): boolean {
		if (this.isJwplayer) {
			return this.player.getFullscreen();
		}
		return this.player.isFullscreen();

	}

	/**
	 * Enters fullscreen mode for the player.
	 */
	enterFullscreen() {
		if (navigator.userActivation.isActive) {
			if (this.isJwplayer) {
				this.player.setFullscreen(true);
			} else {
				this.player.requestFullscreen();
			}
		}
	}

	/**
	 * Exits fullscreen mode for the player.
	 */
	exitFullscreen() {
		if (this.isJwplayer) {
			this.player.setFullscreen(false);
		} else {
			this.player.exitFullscreen();
		}
	}

	/**
	 * Returns the current aspect ratio of the player.
	 * If the player is a JWPlayer, it returns the current stretching mode.
	 * Otherwise, it returns the current aspect ratio.
	 * @returns The current aspect ratio of the player.
	 */
	getCurrentAspect() {
		if (this.isJwplayer) {
			return this.player.getStretching();
		}
		return this.player.aspectRatio();

	}

	/**
	 * Sets the aspect ratio of the player.
	 * @param aspect - The aspect ratio to set.
	 */
	setAspect(aspect: string) {
		if (this.isJwplayer) {
			this.player.setConfig({
				'stretching': aspect,
			});
		} else {
			this.player.aspectRatio(aspect);
		}

		this.displayMessage(`${this.localize('Aspect ratio')}: ${this.localize(aspect)}`);
	}

	/**
	 * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
	 */
	cycleAspectRatio() {
		const index = this.stretchOptions.findIndex((s: string) => s == this.getCurrentAspect());
		if (index == this.stretchOptions.length - 1) {
			this.setAspect(this.stretchOptions[0]);
		} else {
			this.setAspect(this.stretchOptions[index + 1]);
		}
	}

	/**
	 * Toggles the fullscreen mode of the player.
	 * If the player is currently in fullscreen mode, it exits fullscreen mode.
	 * If the player is not in fullscreen mode, it enters fullscreen mode.
	 */
	toggleFullscreen() {
		if (this.isFullscreen()) {
			this.exitFullscreen();
		} else {
			this.enterFullscreen();
		}
	}

	/**
	 * Returns the index of the current playlist item.
	 * @returns {number} The index of the current playlist item.
	 */
	getPlaylistIndex(): number {
		if (this.isJwplayer) {
			return this.player.getPlaylistIndex();
		}
		return this.player.playlist.currentIndex();

	}

	/**
	 * Returns the current playlist item for the player.
	 * If the player is a JWPlayer, it returns the playlist item using the `getPlaylistItem` method.
	 * Otherwise, it returns the playlist item at the current index using the `playlist` method.
	 * @returns The current playlist item for the player.
	 */
	getPlaylistItem() {
		if (this.isJwplayer) {
			return this.player.getPlaylistItem();
		}
		return this.player.playlist()[this.getPlaylistIndex()];

	}

	/**
	 * Sets the current playlist item to the one at the specified index.
	 *
	 * @param index - The index of the playlist item to set as the current item.
	 */
	setPlaylistItem(index: number) {
		if (this.isJwplayer) {
			this.player.playlistItem(index);
		} else {
			this.player.playlist.currentItem(index);
		}
	}

	/**
	 * Returns the current source URL of the player.
	 * If the player is a JWPlayer, it returns the file URL of the current playlist item.
	 * Otherwise, it returns the URL of the first source in the current playlist item.
	 * @returns The current source URL of the player, or undefined if there is no current source.
	 */
	getCurrentSrc() {
		if (this.isJwplayer) {
			return this.player.getPlaylistItem()?.file;
		}
		return this.getPlaylistItem()?.sources?.[0]?.src;
	}

	/**
	 * Returns the playlist of the player.
	 * If the player is a Jwplayer, it returns the playlist using the `getPlaylist` method.
	 * Otherwise, it returns the playlist using the `playlist` method.
	 * @returns The playlist of the player.
	 */
	getPlaylist() {
		try {
			if (this.isJwplayer) {
				return this.player.getPlaylist();
			}
			return this.player.playlist();
		} catch (error) {
			return [];
		}
	}

	/**
	 * Returns an array of objects representing each season in the playlist, along with the number of episodes in each season.
	 * @returns {Array<{ season: number, seasonName: string, episodes: number }>} An array of objects representing each season in the playlist, along with the number of episodes in each season.
	 */
	getSeasons(): Array<{ season: number; seasonName: string; episodes: number; }> {
		return this.unique(this.getPlaylist(), 'season').map((s: any) => {
			return {
				season: s.season,
				seasonName: s.seasonName,
				episodes: this.getPlaylist().filter((e: any) => e.season == s.season).length,
			};
		});
	}

	/**
	 * Sets the playlist for the player.
	 * @param playlist An array of PlaylistItem objects representing the playlist to be set.
	 */
	setPlaylist(playlist: PlaylistItem[]) {
		if (this.isJwplayer) {
			this.player.load(playlist);
		} else {
			this.player.playlist(playlist);
			this.play();
		}
	}

	/**
	 * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
	 * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
	 */
	isFirstPlaylistItem(): boolean {
		return this.getPlaylistIndex() === 0;
	}

	/**
	 * Checks if the current playlist item is the last item in the playlist.
	 * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
	 */
	isLastPlaylistItem(): boolean {
		return this.getPlaylistIndex() === this.getPlaylist().length - 1;
	}

	/**
	 * Checks if the player has more than one playlist.
	 * @returns {boolean} True if the player has more than one playlist, false otherwise.
	 */
	hasPlaylists(): boolean {
		return this.getPlaylist().length > 1;
	}

	/**
	 * Returns an array of available audio tracks.
	 * @returns {Array} An array of available audio tracks.
	 */
	getAudioTracks(): Array<any> {
		if (this.isJwplayer) {
			return this.player.getAudioTracks();
		}
		return this.player.audioTracks().tracks_;

	}

	/**
	 * Returns a boolean indicating whether there are multiple audio tracks available.
	 * @returns {boolean} True if there are multiple audio tracks, false otherwise.
	 */
	hasAudioTracks(): boolean {
		return this.getAudioTracks().length > 1;
	}

	/**
	 * Returns the current audio track.
	 * @returns The current audio track.
	 */
	getAudioTrack() {
		return this.getAudioTracks()[this.getAudioTrackIndex()];
	}

	/**
	 * Returns the index of the currently selected audio track.
	 * If the player is using JWPlayer, it returns the current audio track index.
	 * Otherwise, it returns the index of the enabled audio track.
	 * @returns The index of the currently selected audio track, or -1 if no audio track is enabled.
	 */
	getAudioTrackIndex() {
		if (this.isJwplayer) {
			return this.player.getCurrentAudioTrack();
		}
		let index = -1;
		for (const track of this.player.audioTracks().tracks_) {
			if (track.enabled) {
				index = this.player.audioTracks().tracks_.findIndex(t => t.id == track.id);
			}
		}
		return index;

	}

	/**
	 * Returns the label of the audio track if it exists, otherwise returns the language of the audio track.
	 * @returns The label of the audio track if it exists, otherwise the language of the audio track.
	 */
	getAudioTrackLabel() {
		return this.getAudioTrack()?.label ?? this.getAudioTrack()?.language;
	}

	/**
	 * Returns the kind of the audio track.
	 * @returns {string} The kind of the audio track.
	 */
	getAudioTrackKind(): string {
		return this.getAudioTrack().kind;
	}

	/**
	 * Returns the language of the audio track.
	 * @returns {string} The language of the audio track.
	 */
	getAudioTrackLanguage(): string {
		return this.getAudioTrack().language;
	}

	/**
	 * Sets the audio track to the given index.
	 * @param index - The index of the audio track to set.
	 */
	setAudioTrack(index: number) {
		if (this.isJwplayer) {
			this.player.setCurrentAudioTrack(index);
			localStorage.setItem('audio-language', this.player.getAudioTracks()[index].language);
		} else if (this.player.audioTracks().tracks_[index]) {
			this.player.audioTracks().tracks_[index].enabled = true;
			localStorage.setItem('audio-language', this.player.audioTracks().tracks_[index].language);
		}
	}

	/**
	 * Cycles to the next audio track in the playlist.
	 * If there are no audio tracks, this method does nothing.
	 * If the current track is the last track in the playlist, this method will cycle back to the first track.
	 * Otherwise, this method will cycle to the next track in the playlist.
	 * After cycling to the next track, this method will display a message indicating the new audio track.
	 */
	cycleAudioTracks() {

		if (!this.hasAudioTracks()) {
			return;
		}

		if (this.getAudioTrackIndex() === this.getAudioTracks().length - 1) {
			this.setAudioTrack(0);
		} else {
			this.setAudioTrack(this.getAudioTrackIndex() + 1);
		}

		this.displayMessage(`${this.localize('Audio')}: ${this.localize(this.getAudioTrackLabel()) || this.localize('Unknown')}`);
	};

	/**
	 * Returns the index of the audio track with the specified language.
	 * @param language The language of the audio track to search for.
	 * @returns The index of the audio track with the specified language, or -1 if no such track exists.
	 */
	getAudioTrackIndexByLanguage(language: string) {
		return this.getAudioTracks().findIndex((t: any) => t.language == language);
	}

	/**
	 * Returns an array of text tracks for the player.
	 * If the player is a JWPlayer, it returns an array of captions that end with 'vtt' or 'ass'.
	 * Otherwise, it returns an array of captions or subtitles that are not labeled as 'segment-metadata'.
	 * @returns An array of text tracks for the player.
	 */
	getTextTracks() {
		if (this.isJwplayer) {
			return this.player.getCaptionsList().filter((t: any) => t.id.endsWith('vtt') || t.id.endsWith('ass'));
		}

		return this.player.textTracks().tracks_.filter((t: any) => (t.kind == 'captions' || t.kind == 'subtitles') && t.label !== 'segment-metadata');
	}

	/**
	 * Returns the current text track of the player.
	 * If the player is a JWPlayer, it returns the current captions list.
	 * Otherwise, it returns the text track at the current text track index.
	 * @returns The current text track of the player.
	 */
	getTextTrack() {
		if (this.isJwplayer) {
			return this.player.getCaptionsList()[this.player.getCurrentCaptions()];
		}
		return this.getTextTracks()[this.getTextTrackIndex() - 1];
	}

	/**
	 * Returns the index of the text track that matches the specified language, type, and extension.
	 * @param language The language of the text track.
	 * @param type The type of the text track.
	 * @param ext The extension of the text track.
	 * @returns The index of the matching text track, or -1 if no match is found.
	 */
	getTextTrackIndexBy(language: string, type: string, ext: string) {
		return this.getTextTracks().findIndex((t: any) => (t.src ?? t.id).endsWith(`${language}.${type}.${ext}`));
	}

	/**
	 * Returns the index of the currently active text track.
	 * If no text track is active, returns -1.
	 * @returns {number} The index of the currently active text track, or -1 if no text track is active.
	 */
	getTextTrackIndex(): number {
		if (this.isJwplayer) {
			if (this.player.getCurrentCaptions() == -1) {
				return -1;
			}
			return this.player.getCurrentCaptions() - 1;
		}
		let index = -1;
		for (const track of this.player.textTracks().tracks_) {
			if (track.mode == 'showing') {
				index = this.player.textTracks().tracks_.findIndex((t: TextTrack) => t.id == track.id);
			}
		}
		return index;

	}

	/**
	 * Returns the source URL for the text track associated with the current player instance.
	 * If an access token is provided in the options, it will be appended to the URL as a query parameter.
	 * @returns The source URL for the text track, with an optional access token query parameter.
	 */
	getTextTrackSrc() {

		if (this.isJwplayer) {
			return this.getTextTrack()?.id;
		}
		return this.getTextTrack()?.src;
	}

	getTextTrackLabel() {
		return this.getTextTrack()?.label ?? this.getTextTrack()?.language;
	}

	getTextTrackKind() {
		return this.getTextTrack().kind;
	}

	/**
	 * Returns the mode of the current text track.
	 * @returns {string} The mode of the current text track.
	 */
	getTextTrackMode(): string {
		return this.getTextTrack().mode;
	}

	/**
	 * Returns the language of the current text track, if available.
	 * @returns The language of the current text track, or null if no text track is available.
	 */
	getTextTrackLanguage() {
		return this.getTextTrack()?.language ? `${this.localize(this.getTextTrack().language)} ` : null;
	}

	/**
	 * Sets the text track for the player.
	 * @param index - The index of the text track to set.
	 */
	setTextTrack(index: number) {

		try {
			this.octopusInstance.dispose();
		} catch (error) {
			//
		}

		if (this.isJwplayer) {
			const number = this.player.getCaptionsList()
				.findIndex((t: any) => t.id == this.getTextTracks()[index]?.id);
			this.player.setCurrentCaptions(number);

			if (index >= 0) {
				const file = this.player.getCaptionsList()[this.player.getCurrentCaptions()]?.id;
				this.#triggerStyledSubs(file);
			} else {
				localStorage.removeItem('subtitle-language');
				localStorage.removeItem('subtitle-type');
				localStorage.removeItem('subtitle-ext');
			}
		} else {
			this.player.textTracks().tracks_.forEach((t: TextTrack, i: number) => {
				if (this.player.textTracks()[i]) {
					this.player.textTracks()[i].mode = 'hidden';
				}
			});
			if (index >= 0) {
				const number = this.player.textTracks().tracks_.findIndex((t: any) => t.id == this.getTextTracks()[index]?.id);
				this.player.textTracks()[number].mode = 'showing';

				const file = this.player.textTracks()[number]?.src;
				this.#triggerStyledSubs(file);
			} else {
				localStorage.removeItem('subtitle-language');
				localStorage.removeItem('subtitle-type');
				localStorage.removeItem('subtitle-ext');
			}
			this.emit('caption-change', this.getCaptionState(true));
		}
	}

	/**
	 * Triggers the styled subtitles based on the provided file.
	 * @param file - The file to extract language, type, and extension from.
	 */
	#triggerStyledSubs(file?: string) {
		if (file) {
			const [language, type, ext] = file.match(/\w+\.\w+\.\w+$/u)?.[0]?.split('.') ?? [];
			localStorage.setItem('subtitle-language', language);
			localStorage.setItem('subtitle-type', type);
			localStorage.setItem('subtitle-ext', ext);

			if (ext !== 'ass') return;

			if (this.subtitleRenderer == 'octopus') {
				this.opus().then();
			} else if (this.subtitleRenderer == 'sabre') {
				this.sabre().then();
			}
		}
	}

	/**
	 * Cycles through the available subtitle tracks and sets the active track to the next one.
	 * If there are no subtitle tracks, this method does nothing.
	 * If the current track is the last one, this method sets the active track to the first one.
	 * Otherwise, it sets the active track to the next one.
	 * Finally, it displays a message indicating the current subtitle track.
	 */
	cycleSubtitles() {

		if (!this.hasTextTracks()) {
			return;
		}

		if (this.getTextTrackIndex() === this.getTextTracks().length - 1) {
			this.setTextTrack(-1);
		} else {
			this.setTextTrack(this.getTextTrackIndex() + 1);
		}

		this.displayMessage(`${this.localize('Subtitle')}: ${(this.getTextTrackLanguage() + this.getTextTrackLabel()) || this.localize('Off')}`);
	};

	/**
	 * Initializes the SubtitlesOctopus instance with the video element and subtitle URL.
	 * @returns {Promise<void>} A Promise that resolves when the SubtitlesOctopus instance is ready.
	 */
	async opus(): Promise<void> {

		const subtitleURL = this.getTextTrackSrc() ?? null;

		if (subtitleURL) {
			await this.fetchFontFile();

			const fontFiles: string[] = this.fonts
				?.map((f: any) => `${this.options.basePath ?? ''}${f.file}`) ?? [];


			this.getElement()
				.querySelectorAll<HTMLDivElement>('.libassjs-canvas-parent')
				.forEach(el => el.remove());

			try {
				this.octopusInstance.dispose();
			} catch (error) {
				//
			}

			const options = {
				video: this.getVideoElement(),
				lossyRender: true,
				subUrl: subtitleURL,
				debug: this.options.debug,
				blendRender: true,
				lazyFileLoading: true,
				targetFps: 120,
				fonts: fontFiles,
				workerUrl: '/js/octopus/subtitles-octopus-worker.js',
				legacyWorkerUrl: '/js/octopus/subtitles-octopus-worker-legacy.js',
				onReady: async () => {
					// this.play();
				},
				onError: (event: any) => {
					console.error('opus error', event);
				},
			};

			if (subtitleURL && subtitleURL.includes('.ass')) {
				this.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	};

	/**
	 * Initializes SABRE.js instance
	 * @returns {Promise<void>} A Promise that resolves when the SubtitlesOctopus instance is ready.
	 */
	async sabre(): Promise<void> {

		if (this.frameCallbackHandle) {
			this.getVideoElement().cancelVideoFrameCallback(this.frameCallbackHandle);
			this.frameCallbackHandle = null;
		}

		await this.fetchFontFile();

		await new Promise<void>((resolve) => {
			function waitForLoad(): void {
				if (window.sabre && window.sabre.SABRERenderer) {
					resolve();
					return;
				}
				setTimeout(waitForLoad, 30);
			}
			waitForLoad();
		});

		const sabreContainer = this.createElement('div', 'sabre-canvas-container', true)
			.addClasses([
				'nm-relative',
				'nm-inset-0',
				'nm-pointer-events-none',
				'nm-w-full',
				'nm-h-full',
			    'nm-z-10',
			])
			.appendTo(this.getVideoElement().parentElement as HTMLElement);

		const video = this.getVideoElement();

		const sabreCanvas = this.createElement('canvas', 'sabre-canvas', true)
			.addClasses([
				'nm-w-full',
				'nm-h-full',
			])
			.get();

		let sabreRenderer: Sabre.SABRERenderer;

		function updateCanvas(first: boolean) {
			let videoWidth: number = video.videoWidth;
			let videoHeight: number = video.videoHeight;
			const elementWidth: number = video.offsetWidth;
			const elementHeight: number = video.offsetHeight;
			const pixelRatio: number = window.devicePixelRatio || 1;

			if (!first && videoWidth === elementWidth / pixelRatio && videoHeight == elementHeight / pixelRatio) {
				sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
				sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
				return;
			}

			const elementRatio: number = elementWidth / elementHeight;
			const ratioWidthHeight: number = videoWidth / videoHeight;
			const ratioHeightWidth: number = videoHeight / videoWidth;

			if (isNaN(elementRatio) || isNaN(ratioWidthHeight) || isNaN(ratioHeightWidth)) return;

			if (elementRatio <= ratioWidthHeight) {
				videoWidth = elementWidth;
				videoHeight = elementWidth * ratioHeightWidth;
			} else if (elementRatio > ratioWidthHeight) {
				videoHeight = elementHeight;
				videoWidth = elementHeight * ratioWidthHeight;
			}

			sabreCanvas.width = videoWidth * pixelRatio;
			sabreCanvas.height = videoHeight * pixelRatio;
			sabreCanvas.style.width = `${videoWidth}px`;
			sabreCanvas.style.height = `${videoHeight}px`;
			sabreRenderer.setViewport(videoWidth * pixelRatio, videoHeight * pixelRatio);
			sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
			sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
		}

		const renderFrame: VideoFrameRequestCallback = (now, metaData) => {
			updateCanvas(false);
			if (sabreRenderer.checkReadyToRender()) {
				sabreRenderer.drawFrame(metaData.mediaTime, sabreCanvas, 'bitmap');
			}
			this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame);
		};

		sabreContainer.appendChild(sabreCanvas);

		const sabre = window.sabre;

		const fonts: Array<object> = [];

		const fontFiles: string[] = this.fonts
			?.map((f: any) => `${this.options.basePath ?? ''}${f.file}`) ?? [];

		fontFiles.push('https://storage.nomercy.tv/laravel/player/fonts/Arial.ttf');

		for (const font of fontFiles) {

			await this.getFileContents<ArrayBuffer>({
				url: font,
				options: {
					type: 'arrayBuffer',
				},
				callback: (data) => {
					fonts.push(window.opentype.parse(data));
				},
			});

		}

		const textTrackUrl: string = this.getTextTrackSrc();

		if (textTrackUrl) {
			await this.getFileContents<ArrayBuffer>({
				url: textTrackUrl,
				options: {
					type: 'arrayBuffer',
				},
				callback: (data) => {
					const options: SABREOptions = {
						fonts: fonts,
						subtitles: data,
					};
					sabreRenderer = new sabre.SABRERenderer(options);
					updateCanvas(true);
					sabreRenderer.setColorSpace(sabre.VideoColorSpaces.AUTOMATIC, video.videoWidth, video.videoHeight);
					this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame.bind(this));
				},
			});
		}
	}

	/**
	 * Checks if there are any text tracks available.
	 * @returns {boolean} True if there are text tracks available, false otherwise.
	 */
	hasTextTracks(): boolean {
		return this.getTextTracks().length > 0;
	}

	/**
	 * Returns an array of available quality levels for the player.
	 * If the player is a JWPlayer, it returns the quality levels using the `getQualityLevels` method.
	 * Otherwise, it returns the quality levels using the `qualityLevels` method.
	 * @returns An array of available quality levels for the player.
	 */
	getQualities() {
		if (this.isJwplayer) {
			return this.player.getQualityLevels();
		}
		return this.player.qualityLevels();

	}

	/**
	 * Returns the visual quality of the player or the quality level at the specified index.
	 * @param index - The index of the quality level to retrieve. Only applicable if the player is not a JWPlayer.
	 * @returns The visual quality of the player or the quality level at the specified index.
	 */
	getQuality(index: number) {
		if (this.isJwplayer) {
			return this.player.getVisualQuality();
		}
		return this.player.qualityLevels()[index];

	}

	/**
	 * Returns the label of the quality at the specified index.
	 * @param index - The index of the quality to retrieve the label for.
	 * @returns The label of the quality at the specified index.
	 */
	getQualityLabel(index: number) {
		return this.getQuality(index).label;
	}

	/**
	 * Returns the height of the video quality at the specified index.
	 * @param index The index of the video quality.
	 * @returns The height of the video quality.
	 */
	getQualityHeight(index: number) {
		return this.getQuality(index).height;
	}

	/**
	 * Returns the width of the quality at the specified index.
	 * @param index - The index of the quality to retrieve the width for.
	 * @returns The width of the quality at the specified index.
	 */
	getQualityWidth(index: number) {
		return this.getQuality(index).width;
	}

	/**
	 * Returns the bandwidth of the quality at the specified index.
	 * @param index - The index of the quality to retrieve the bandwidth for.
	 * @returns The bandwidth of the quality at the specified index.
	 */
	getQualityBandwidth(index: number) {
		return this.getQuality(index).bandwidth;
	}

	/**
	 * Returns the current quality index of the player.
	 * If the player is a JWPlayer, it returns the current quality index.
	 * Otherwise, it returns the selected quality index from the player's quality levels.
	 * @returns The current quality index of the player.
	 */
	getQualityIndex() {
		if (this.isJwplayer) {
			return this.player.getCurrentQuality();
		}
		return this.player.qualityLevels().selectedIndex;

	}

	/**
	 * Sets the quality level of the player to the specified index.
	 * @param index The index of the quality level to set.
	 */
	setQualityLevel(index: number) {
		if (this.isJwplayer) {
			this.player.setCurrentQuality(index);
		} else {
			this.player.qualityLevels().selectedIndex = index;
		}
	}

	/**
	 * Returns a boolean indicating whether the player has more than one quality.
	 * @returns {boolean} True if the player has more than one quality, false otherwise.
	 */
	hasQualities(): boolean {
		return this.getQualities().length > 1;
	}

	/**
	 * Returns the file associated with the thumbnail of the current playlist item.
	 * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
	 */
	getTimeFile() {
		return this.getPlaylistItem()?.metadata?.find((t: { kind: string }) => t.kind === 'thumbnails')?.file;
	}

	/**
	 * Returns the file associated with the sprite metadata of the current playlist item.
	 * @returns The sprite file, or undefined if no sprite metadata is found.
	 */
	getSpriteFile() {
		return this.getPlaylistItem()?.metadata?.find((t: { kind: string }) => t.kind === 'sprite')?.file;
	}

	/**
	 * Returns the file associated with the chapter metadata of the current playlist item, if any.
	 * @returns The chapter file, or undefined if no chapter metadata is found.
	 */
	#getChapterFile() {
		return this.getPlaylistItem()?.metadata?.find((t: { kind: string }) => t.kind === 'chapters')?.file;
	}

	/**
	 * Returns the file associated with the chapter metadata of the current playlist item, if any.
	 * @returns The chapter file, or undefined if no chapter metadata is found.
	 */
	#getSkipFile() {
		return this.getPlaylistItem()?.metadata?.find((t: { kind: string }) => t.kind === 'skippers')?.file;
	}

	/**
	 * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
	 * @returns {string | undefined} The file associated with the 'fonts' metadata item
	 * of the current playlist item, or undefined if it does not exist.
	 */
	getFontsFile(): string | undefined {
		return this.getPlaylistItem()?.metadata?.find((t: { kind: string }) => t.kind === 'fonts')?.file;
	}

	/**
	 * Fetches the font file and updates the fonts array if the file has changed.
	 * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
	 */
	async fetchFontFile(): Promise<void> {
		const file = this.getFontsFile();
		if (file && this.currentFontFile !== file) {
			this.currentFontFile = file;

			await this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					this.fonts = JSON.parse(data as string).map((f: { file: string; mimeType: string }) => {
						const baseFolder = file.replace(/\/[^/]*$/u, '');
						return {
							...f,
							file: `${baseFolder}/fonts/${f.file}`,
						};
					});

					this.emit('fonts', this.fonts);
				},
			});
		}
	}

	/**
	 * Fetches the translations file for the specified language or the user's browser language.
	 * @returns A Promise that resolves when the translations file has been fetched and parsed.
	 */
	async #fetchTranslationsFile() {
		const language = this.options.language ?? navigator.language;

		const file = `https://storage.nomercy.tv/laravel/player/translations/${language}.json`;

		await this.getFileContents({
			url: file,
			options: {},
			callback: (data) => {
				this.translations = JSON.parse(data as string);

				this.emit('translations', this.translations);
			},
		});

	}

	/**
	 * Fetches the chapter file and parses it to get the chapters.
	 * Emits the 'chapters' event with the parsed chapters.
	 * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'chapters' event.
	 */
	#fetchChapterFile() {
		this.chapters = [];
		const file = this.#getChapterFile();
		if (file && this.currentChapterFile !== file) {
			this.currentChapterFile = file;
			this.getFileContents({
				url: file,
				options: {},
				callback: (data) => {
					// @ts-ignore
					const parser = new window.WebVTTParser();
					this.chapters = parser.parse(data, 'metadata');

					if (this.duration()) { // VideoJs doesn't have duration yet
						this.emit('chapters', this.getChapters());
					} else {
						this.once('duration', () => {
							this.emit('chapters', this.getChapters());
						});
					}
				},
			}).then();
		}
	}

	/**
	 * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
	 * @returns {Array} An array of chapter objects.
	 */
	getChapters(): Array<any> {
		return this.chapters?.cues?.map((chapter: { id: any; text: any; startTime: any; }, index: number) => {
			const endTime = this.chapters?.cues[index + 1]?.startTime ?? this.duration();
			return {
				id: `Chapter ${index}`,
				title: chapter.text,
				left: chapter.startTime / this.duration() * 100,
				width: (endTime - chapter.startTime) / this.duration() * 100,
				startTime: chapter.startTime,
				endTime: endTime,
			};
		}) ?? [];
	}

	/**
	 * Returns the current chapter based on the current time.
	 * @returns The current chapter object or undefined if no chapter is found.
	 */
	getChapter() {
		return this.getChapters()?.find((chapter: { startTime: number; endTime: number; }) => {
			return this.currentTime() >= chapter.startTime && this.currentTime() <= chapter.endTime;
		});
	}

	/**
	 * Fetches the skip file and parses it to get the skippers.
	 * Emits the 'skippers' event with the parsed skippers.
	 * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'skippers' event.
	 */
	#fetchSkipFile() {
		this.skippers = [];
		const file = this.#getSkipFile();
		if (file && this.currentSkipFile !== file) {
			this.currentSkipFile = file;
			this.getFileContents({
				url: file,
				options: {},
				callback: (data) => {
					// @ts-ignore
					const parser = new window.WebVTTParser();
					this.skippers = parser.parse(data, 'metadata');

					if (this.duration()) { // VideoJs doesn't have duration yet
						this.emit('skippers', this.getSkippers());
					} else {
						this.once('duration', () => {
							this.emit('skippers', this.getSkippers());
						});
					}
				},
			}).then();
		}
	}

	/**
	 * Returns an array of skip objects, each containing information about the skip's ID, title, start and end times, and position within the video.
	 * @returns {Array} An array of skip objects.
	 */
	getSkippers(): Array<any> {
		return this.skippers?.cues?.map((skip: { id: any; text: any; startTime: any; endTime: any }, index: number) => {
			return {
				id: `Skip ${index}`,
				title: skip.text,
				startTime: skip.startTime,
				endTime: skip.endTime,
				type: skip.text.trim(),
			};
		}) ?? [];
	}

	/**
	 * Returns the current skip based on the current time.
	 * @returns The current skip object or undefined if no skip is found.
	 */
	getSkip() {
		return this.getSkippers()?.find((chapter: { startTime: number; endTime: number; }) => {
			return this.currentTime() >= chapter.startTime && this.currentTime() <= chapter.endTime;
		});
	}

	/**
	 * Returns an array of available playback speeds for the player.
	 * If the player is a JWPlayer, it returns the playbackRates from the options object.
	 * Otherwise, it returns the playbackRates from the player object.
	 * @returns An array of available playback speeds.
	 */
	getSpeeds() {
		if (this.isJwplayer) {
			return this.options.playbackRates ?? [];
		}
		return this.player.playbackRates();
	}

	/**
	 * Returns the current playback speed of the player.
	 * @returns The current playback speed of the player.
	 */
	getSpeed() {
		if (this.isJwplayer) {
			return this.player.getPlaybackRate();
		}
		return this.player.playbackRate();
	}

	/**
	 * Checks if the player has multiple speeds.
	 * @returns {boolean} True if the player has multiple speeds, false otherwise.
	 */
	hasSpeeds(): boolean {
		const speeds = this.getSpeeds();
		return speeds !== undefined && speeds.length > 1;
	}

	setSpeed(speed: number) {
		if (this.isJwplayer) {
			this.player.setPlaybackRate(speed);
		} else {
			this.player.playbackRate(speed);
		}
		this.emit('speed', speed);
	}

	/**
	 * Returns a boolean indicating whether the player has a Picture-in-Picture (PIP) event handler.
	 * @returns {boolean} Whether the player has a PIP event handler.
	 */
	hasPIP(): boolean {
		return this.hasPipEventHandler;
	}

	/**
	 * Sets up the media session API for the player.
	 *
	 * @remarks
	 * This method sets up the media session API for the player, which allows the user to control media playback
	 * using the media session controls on their device. It sets the metadata for the current media item, as well
	 * as the action handlers for the media session controls.
	 */
	setMediaAPI() {

		if ('mediaSession' in navigator) {
			const playlistItem = this.getPlaylistItem();
			if (!playlistItem?.title) return;

			const image = playlistItem.image ?? playlistItem.poster;

			const parsedTitle = playlistItem.title
				.replace('%S', this.localize('S'))
				.replace('%E', this.localize('E'));

			this.setTitle(`${playlistItem.season ? `${playlistItem.show} -` : ''} ${parsedTitle}`);

			navigator.mediaSession.metadata = new window.MediaMetadata({
				title: parsedTitle,
				artist: playlistItem.show,
				album: playlistItem.season ? `S${this.pad(playlistItem.season, 2)}E${this.pad(playlistItem.episode, 2)}` : '',
				artwork: image ? [
					{
						src: image,
						type: `image/${image.split('.').at(-1)}`,
					},
				] : [],
			});

			if (typeof navigator.mediaSession.setActionHandler == 'function') {
				navigator.mediaSession.setActionHandler('previoustrack', this.previous.bind(this));
				navigator.mediaSession.setActionHandler('nexttrack', this.next.bind(this));
				navigator.mediaSession.setActionHandler('seekbackward', time => this.rewindVideo.bind(this)(time.seekTime));
				navigator.mediaSession.setActionHandler('seekforward', time => this.forwardVideo.bind(this)(time.seekTime));
				navigator.mediaSession.setActionHandler('seekto', time => this.seek(time.seekTime as number));
				navigator.mediaSession.setActionHandler('play', this.play.bind(this));
				navigator.mediaSession.setActionHandler('pause', this.pause.bind(this));
			}
		}
	}

	/**
	 * Returns the localized string for the given value, if available.
	 * If the value is not found in the translations, it returns the original value.
	 * @param value - The string value to be localized.
	 * @returns The localized string, if available. Otherwise, the original value.
	 */
	localize(value: string): string {
		if (this.translations && this.translations[value as unknown as number]) {
			return this.translations[value as unknown as number];
		}

		if ((translations as any) && (translations as any)[value]) {
			return (translations as any)[value];
		}

		return value;
	}

	/**
	 * Sets the title of the document.
	 * @param value - The new title to set.
	 */
	setTitle(value: string): void {
		document.title = value;
	}

	/**
	 * Sets the access token for the player.
	 * @param {string} token - The access token to set.
	 */
	setAccessToken(token: string) {
		this.options.accessToken = token;
	}

	/**
	 * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
	 * @param str The logo title string to break.
	 * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
	 * @returns The broken logo title string.
	 */
	breakLogoTitle(str: string, characters = [':', '!', '?']) {
		if (!str) {
			return '';
		}

		if (str.split('').some((l: string) => characters.includes(l))) {
			const reg = new RegExp(characters.map(l => (l == '?' ? `\\${l}` : l)).join('|'), 'u');
			const reg2 = new RegExp(characters.map(l => (l == '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'), 'u');
			if (reg && reg2 && str.match(reg2)) {
				return str.replace((str.match(reg2) as any)[0], `${(str.match(reg) as any)[0]}\n`);
			}
		}

		return str;
	}

	/**
	 * Sets the access token to be used for API requests.
	 * @param token - The access token to set.
	 */
	setToken(token: string): void {
		this.options.accessToken = token;
	}

	videoEnding(): boolean {
		return this.duration() - this.currentTime() < 10;
	}

	lastPlaylistItem(): boolean {
		return this.getPlaylist().length - 1 == this.getPlaylistIndex();
	}

	clearProgress(): boolean {
		return this.duration() - this.currentTime() <= 60 * (this.getPlaylistItem().video_type === 'tv' ? 5 : 15);
	}

	showInProduction(): boolean {
		return this.getPlaylistItem().production!;
	}

	getParameterByName(name: string, url = window.location.href) {
		name = name.replace(/[[\]]/gu, '\\$&');
		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
		const results = regex.exec(url);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}
		return decodeURIComponent(results[2].replace(/\+/gu, ' '));
	};

}
