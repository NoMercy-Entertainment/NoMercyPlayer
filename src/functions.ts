import Base from './base.js';
import SubtitlesOctopus from './octopus/subtitles-octopus.js';

import type { VideoPlayerOptions, VideoPlayer as Types, TextTrack, AudioTrack } from './nomercyplayer.d';

export default class Functions extends Base {
	tapCount = 0;
	leftTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	rightTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	leeway = 300;
	chapters: any;

	subsEnabled = false;
	audiosEnabled = false;
	highQuality = false;
	theaterModeEnabled = false;
	pipEnabled = false;
	octopusInstance: any | null = null;
	currentChapterFile = '';

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);
		this.#eventHandlers();
	}

	#eventHandlers() {
		this.on('item', () => {
			this.fetchChapterFile();
			this.setMediaAPI();
			this.once('play', () => {
				this.setMediaAPI();
				if (localStorage.getItem('subtitle-language') && localStorage.getItem('subtitle-type') && localStorage.getItem('subtitle-ext')) {
					this.setTextTrack(this.getTextTrackIndexBy(
						localStorage.getItem('subtitle-language') as string,
						localStorage.getItem('subtitle-type') as string,
						localStorage.getItem('subtitle-ext') as string
					));
				} else {
					this.setTextTrack(-1);
					try {
						this.octopusInstance.dispose();
					} catch (error) {
						//
					}
				}
			});
		});
	}

	isPlaying() {
		if (this.isJwplayer) {
			return this.player.getState() === 'playing';
		}
		return !this.player.paused();

	}

	play() {
		this.player.play();
	}

	pause() {
		this.player.pause();
	}

	togglePlayback() {
		if (this.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	}

	isMuted() {
		if (this.isJwplayer) {
			return this.player.getMute();
		}
		return this.player.muted();

	}

	mute() {
		if (this.isJwplayer) {
			this.player.setMute(true);
		} else {
			this.player.muted(true);
		}
	}

	unMute() {
		if (this.isJwplayer) {
			this.player.setMute(false);
		} else {
			this.player.muted(false);
		}
	}

	toggleMute() {
		if (this.isMuted()) {
			this.unMute();
		} else {
			this.mute();
		}
	}

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

	getVolume() {
		if (this.isJwplayer) {
			return this.player.getVolume();
		}
		return this.player.volume() * 100;

	}

	volumeUp() {
		if (this.getVolume() === 100) {
			this.setVolume(100);
		} else {
			this.setVolume(this.getVolume() + 10);
		}
	}

	volumeDown() {
		if (this.getVolume() === 0) {
			this.mute();
		} else {
			this.unMute();
			this.setVolume(this.getVolume() - 10);
		}
	}

	previous() {
		if (this.isJwplayer) {
			if (this.player.getPlaylistIndex() === 0) {
				this.player.playlistItem(this.player.getPlaylist() - 1);
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

	currentTime() {
		if (this.isJwplayer) {
			return this.player.getPosition();
		}
		return this.player.currentTime();

	}

	duration() {
		if (this.isJwplayer) {
			return this.player.getDuration();
		}
		return this.player.duration();

	}

	seek(time: number) {
		if (this.isJwplayer) {
			this.player.seek(time);
		} else {
			this.player.currentTime(time);
		}
	}

	rewindVideo() {
		this.dispatchEvent('removeForward');
		clearTimeout(this.leftTap);

		this.tapCount += this.options.seekInterval ?? 10;
		this.dispatchEvent('rewind', this.tapCount);

		this.leftTap = setTimeout(() => {
			this.dispatchEvent('removeRewind');
			this.seek(this.currentTime() - this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

	forwardVideo() {
		this.dispatchEvent('removeRewind');
		clearTimeout(this.rightTap);

		this.tapCount += this.options.seekInterval ?? 10;
		this.dispatchEvent('forward', this.tapCount);

		this.rightTap = setTimeout(() => {
			this.dispatchEvent('removeForward');
			this.seek(this.currentTime() + this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

	setEpisode(season: number, episode: number) {
		const item = this.getPlaylist().findIndex((l: any) => l.season == season && l.episode == episode);
		if (item == -1) {
			this.setCurrentPlaylistItem(0);
		} else {
			this.setCurrentPlaylistItem(item);
		}
		this.play();
	};

	isFullscreen() {
		if (this.isJwplayer) {
			return this.player.getFullscreen();
		}
		return this.player.isFullscreen();

	}

	enterFullscreen() {
		if (this.isJwplayer) {
			this.player.setFullscreen(true);
		} else {
			this.player.requestFullscreen();
		}
	}

	exitFullscreen() {
		if (this.isJwplayer) {
			this.player.setFullscreen(false);
		} else {
			this.player.exitFullscreen();
		}
	}

	toggleFullscreen() {
		if (this.isFullscreen()) {
			this.exitFullscreen();
		} else {
			this.enterFullscreen();
		}
	}

	getCurrentPlaylistIndex() {
		if (this.isJwplayer) {
			return this.player.getPlaylistIndex();
		}
		return this.player.playlist.currentIndex();

	}

	getCurrentPlaylistItem() {
		if (this.isJwplayer) {
			return this.player.getPlaylistItem();
		}
		return this.player.playlist()[this.getCurrentPlaylistIndex()];

	}

	setCurrentPlaylistItem(index: number) {
		if (this.isJwplayer) {
			this.player.playlistItem(index);
		} else {
			this.player.playlist.currentItem(index);
		}
	}

	getPlaylist() {
		if (this.isJwplayer) {
			return this.player.getPlaylist();
		}
		return this.player.playlist();

	}

	setPlaylist(playlist: any) {
		if (this.isJwplayer) {
			this.player.load(playlist);
		} else {
			this.player.playlist(playlist);
		}
	}

	isFirstPlaylistItem() {
		return this.getCurrentPlaylistIndex() === 0;
	}

	isLastPlaylistItem() {
		return this.getCurrentPlaylistIndex() === this.getPlaylist().length - 1;
	}

	hasPlaylists() {
		return this.getPlaylist().length > 1;
	}

	getAudioTracks() {
		if (this.isJwplayer) {
			return this.player.getAudioTracks();
		}
		return this.player.audioTracks().tracks_;

	}

	getCurrentAudioTrack() {
		return this.getAudioTracks()[this.getCurrentAudioTrackIndex()];
	}

	getCurrentAudioTrackIndex() {
		if (this.isJwplayer) {
			return this.player.getCurrentAudioTrack();
		}
		let index = -1;
		for (const track of this.player.audioTracks().tracks_) {
			if (track.enabled) {
				index = this.player.audioTracks().tracks_.findIndex((t: AudioTrack) => t.id == track.id);
			}
		}
		return index;

	}

	getAudioTrackLabel() {
		return this.getCurrentAudioTrack().label;
	}

	getAudioTrackKind() {
		return this.getCurrentAudioTrack().kind;
	}

	getAudioTrackLanguage() {
		return this.getCurrentAudioTrack().language;
	}

	setAudioTrack(index: number) {
		if (this.isJwplayer) {
			this.player.setCurrentAudioTrack(index);
		} else {
			this.player.audioTracks().tracks_[index].enabled = true;
		}
	}

	hasAudioTracks() {
		return this.getAudioTracks().length > 1;
	}

	getTextTracks() {
		if (this.isJwplayer) {
			return this.player.getCaptionsList().filter((t: any) => t.id.endsWith('vtt') || t.id.endsWith('ass'));
		}
		return this.player.textTracks().tracks_.filter((t: any) => t.kind == 'captions' || t.kind == 'subtitles');

	}

	getCurrentTextTrack() {
		if (this.isJwplayer) {
			return this.player.getCaptionsList()[this.player.getCurrentCaptions()];
		}
		return this.getTextTracks()[this.getCurrentTextTrackIndex() - 1];
	}

	getTextTrackIndexBy(language: string, type: string, ext: string) {
		const index = this.getTextTracks().findIndex((t: any) => (t.src ?? t.id).endsWith(`${language}.${type}.${ext}`));
		return index;
	}

	getCurrentTextTrackIndex() {
		if (this.isJwplayer) {
			return this.player.getCurrentCaptions();
		}
		let index = -1;
		for (const track of this.player.textTracks().tracks_) {
			if (track.mode == 'showing') {
				index = this.player.textTracks().tracks_.findIndex((t: TextTrack) => t.id == track.id);
			}
		}
		return index;

	}

	getTextTrackSrc() {
		if (this.isJwplayer) {
			return this.getCurrentTextTrack().id;
		}
		return this.getCurrentTextTrack().src;
	}

	getTextTrackLabel() {
		return this.getCurrentTextTrack().label;
	}

	getTextTrackKind() {
		return this.getCurrentTextTrack().kind;
	}

	getTextTrackMode() {
		return this.getCurrentTextTrack().mode;
	}

	getTextTrackLanguage() {
		return this.getCurrentTextTrack().language;
	}

	setTextTrack(index: number) {
		if (this.isJwplayer) {
			const number = this.player.getCaptionsList().findIndex((t: any) => t.id == this.getTextTracks()[index]?.id);
			this.player.setCurrentCaptions(number);

			if (index >= 0) {
				const file = this.player.getCaptionsList()[this.player.getCurrentCaptions(number)]?.id;
				if (file) {
					const [language, type, ext] = file.match(/\w+\.\w+\.\w+$/u)[0].split('.');
					localStorage.setItem('subtitle-language', language);
					localStorage.setItem('subtitle-type', type);
					localStorage.setItem('subtitle-ext', ext);
					this.opus();
				}
			} else {
				localStorage.removeItem('subtitle-language');
				localStorage.removeItem('subtitle-type');
				localStorage.removeItem('subtitle-ext');
				try {
					this.octopusInstance.dispose();
				} catch (error) {
					//
				}
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
				if (file) {
					const [language, type, ext] = file.match(/\w+\.\w+\.\w+$/u)[0].split('.');
					localStorage.setItem('subtitle-language', language);
					localStorage.setItem('subtitle-type', type);
					localStorage.setItem('subtitle-ext', ext);
					this.opus();
				}
			} else {
				localStorage.removeItem('subtitle-language');
				localStorage.removeItem('subtitle-type');
				localStorage.removeItem('subtitle-ext');
				try {
					this.octopusInstance.dispose();
				} catch (error) {
					//
				}
			}
		}
	}

	opus() {
		try {
			this.octopusInstance.dispose();
		} catch (error) {
			//
		}

		const subtitleURL = this.getTextTrackSrc() ?? null;

		if (subtitleURL) {
			const options = {
				video: this.getElement().querySelector('video'),
				lossyRender: true,
				subUrl: subtitleURL,
				debug: this.options.debugEnabled_,
				blendRender: true,
				lazyFileLoading: true,
				targetFps: 120,
				fonts: this.getCurrentPlaylistItem().fonts.map((f: any) => f.file),
				workerUrl: `${this.currentScriptPath()}octopus/subtitles-octopus-worker.js`,
				legacyWorkerUrl: `${this.currentScriptPath()}octopus/subtitles-octopus-worker-legacy.js`,
				onReady: async () => {
					// player.nomercy.play();
				},
				onError: (event: any) => {
					console.log('opus error', event);
				},
			};

			if (subtitleURL && subtitleURL.endsWith('ass')) {
				this.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	};

	hasTextTracks() {
		return this.getTextTracks().length > 0;
	}

	getQualities() {
		if (this.isJwplayer) {
			return this.player.getQualityLevels();
		}
		return this.player.qualityLevels();

	}

	getQuality(index: number) {
		if (this.isJwplayer) {
			return this.player.getQualityLevel(index);
		}
		return this.player.qualityLevels()[index];

	}

	getQualityLabel(index: number) {
		return this.getQuality(index).label;
	}

	getQualityHeight(index: number) {
		return this.getQuality(index).height;
	}

	getQualityWidth(index: number) {
		return this.getQuality(index).width;
	}

	getQualityBandwidth(index: number) {
		return this.getQuality(index).bandwidth;
	}

	getQualityIndex() {
		if (this.isJwplayer) {
			return this.player.getCurrentQuality();
		}
		return this.player.qualityLevels().selectedIndex;

	}

	setQuality(index: number) {
		if (this.isJwplayer) {
			this.player.setCurrentQuality(index);
		} else {
			this.player.qualityLevels().selectedIndex = index;
		}
	}

	hasQualities() {
		return this.getQualities().length > 1;
	}

	getCurrentTimeFile() {
		let file = this.getCurrentPlaylistItem().metadata.find((t: { kind: string }) => t.kind === 'thumbnails')?.file;
		if (this.isJwplayer && !file) {
			file = this.getCurrentPlaylistItem().tracks.find((t: { kind: string }) => t.kind === 'thumbnails')?.file;
		}
		return file;
	}

	getCurrentSpriteFile() {
		return this.getCurrentPlaylistItem().metadata?.find((t: { kind: string }) => t.kind === 'sprite')?.file;
	}

	getCurrentChapterFile(): string {
		return this.getCurrentPlaylistItem().metadata.find((t: { kind: string }) => t.kind === 'chapters')?.file;
	}

	fetchChapterFile() {
		const file = this.getCurrentChapterFile();
		if (file && this.currentChapterFile !== file) {
			this.currentChapterFile = file;
			this.getFileContents({
				url: file,
				options: {},
				callback: (data: string) => {
					// @ts-ignore
					const parser = new window.WebVTTParser();
					const tree = parser.parse(data, 'metadata');

					this.chapters = tree;

					this.dispatchEvent('chapters', this.getChapters());
				},
			});
		}
	}

	getChapters() {
		return this.chapters?.cues?.map((c: { id: any; text: any; startTime: any; }) =>
		 	({ id: c.id, title: c.text, time: c.startTime })) ?? [];
	}

	hasSpeeds() {
		return true;
	}

	hasPIP() {
		return true;
	}

	setMediaAPI() {

		if ('mediaSession' in navigator) {
			const playlistItem = this.getCurrentPlaylistItem();

			const image = playlistItem.image ?? playlistItem.poster;

			const parsedTitle = playlistItem.title
				.replace('%S', this.localize('S'))
				.replace('%E', this.localize('E'));

			this.setTitle(`${playlistItem.season ? `${playlistItem.show} -` : ''} ${parsedTitle}`);

			navigator.mediaSession.metadata = new window.MediaMetadata({
				title: parsedTitle,
				artist: playlistItem.show,
				album: playlistItem.season ? `S${this.pad(playlistItem.season, 2)}E${this.pad(playlistItem.episode, 2)}` : '',
				artwork: [
					{
						src: image,
						type: 'image/jpg',
					},
				],
			});

			navigator.mediaSession.setActionHandler('previoustrack', this.previous.bind(this));
			navigator.mediaSession.setActionHandler('nexttrack', this.next.bind(this));
			navigator.mediaSession.setActionHandler('seekbackward', this.rewindVideo.bind(this));
			navigator.mediaSession.setActionHandler('seekforward', this.forwardVideo.bind(this));
			navigator.mediaSession.setActionHandler('seekto', time => this.seek(time.seekTime as number));
			navigator.mediaSession.setActionHandler('play', this.play.bind(this));
			navigator.mediaSession.setActionHandler('pause', this.pause.bind(this));
		}
	}

	localize(value: string): string {
		return value;
	}

	setTitle(value: string): void {
		document.title = value;
	}
}
