import {
    bottomBarStyles, bottomRowStyles, buttonBaseStyle, Buttons, buttons, buttonStyles,
    chapterMarkersStyles, dividerStyles, fluentIcons, Icon, iconStyles, overlayStyles,
    sliderBarStyles, sliderBufferStyles, sliderNippleStyles, sliderPopImageStyles, sliderPopStyles,
    sliderProgressStyles, timeStyles, topBarStyles, topRowStyles
} from './buttons.js';
import Functions from './functions.js';

import type { VideoPlayerOptions, VideoPlayer as Types, Chapter } from './nomercyplayer.d';
export default class UI extends Functions {

	overlayStyles: string[] = [];
	topBarStyles: string[] = [];
	bottomBarStyles: string[] = [];

	buttonBaseStyle: string[] = [];
	fluentIcons: Icon = <Icon>{};
	buttonStyles: string[] = [];
	buttons: Buttons = <Buttons>{};
	iconStyles: string[] = [];
	topRowStyles: string[] = [];
	bottomRowStyles: string[] = [];
	timer: NodeJS.Timeout = <NodeJS.Timeout>{};
	isMouseDown = false;
	progressBar: HTMLDivElement = <HTMLDivElement>{}; // sliderBar

	previewTime: {
		start: number;
		end: number;
		x: number;
		y: number;
		w: number;
		h: number;
	}[] = [];

	sliderBarStyles: string[] = [];
	sliderBufferStyles: string[] = [];
	sliderProgressStyles: string[] = [];
	sliderNippleStyles: string[] = [];
	sliderPopStyles: string[] = [];
	sliderPopImageStyles: string[] = [];
	timeStyles: string[] = [];
	dividerStyles: string[] = [];
	chapterMarkersStyles: string[] = [];
	sliderTextStyles: string[] = [];
	chapterTextStyles: string[] = [];

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		this.on('ready', () => {

			this.overlayStyles = overlayStyles;
			this.topBarStyles = topBarStyles;
			this.bottomBarStyles = bottomBarStyles;
			this.topRowStyles = topRowStyles;
			this.bottomRowStyles = bottomRowStyles;

			this.sliderBarStyles = sliderBarStyles;
			this.sliderBufferStyles = sliderBufferStyles;
			this.sliderProgressStyles = sliderProgressStyles;
			this.sliderNippleStyles = sliderNippleStyles;
			this.sliderPopStyles = sliderPopStyles;
			this.sliderPopImageStyles = sliderPopImageStyles;
			this.timeStyles = timeStyles;
			this.dividerStyles = dividerStyles;
			this.chapterMarkersStyles = chapterMarkersStyles;

			this.buttonBaseStyle = buttonBaseStyle;
			this.fluentIcons = fluentIcons;
			this.buttonStyles = buttonStyles;
			this.iconStyles = iconStyles;
			this.buttons = buttons(this.options);

			this.buildUI();
			this.#eventHandlers();
		});
	}

	#eventHandlers() {
		this.on('chapters', () => {
			this.createChapterMarkers();
		});
	}

	lock = false;

	hideControls() {
		if (!this.lock && this.isPlaying()) {
			this.dispatchEvent('controls', false);
		}
	};

	showControls() {
		this.dispatchEvent('controls', true);
	}

	dynamicControls() {
		this.showControls();
		clearTimeout(this.timer);
		this.timer = setTimeout(this.hideControls.bind(this), this.options.controlsTimeout ?? 3500);
	};

	buildUI() {
		const overlay = document.createElement('div');
		overlay.id = 'overlay';

		this.addClasses(overlay, this.overlayStyles);

		this.createStyles();

		this.overlay = overlay;

		if (!this.getElement().querySelector('#overlay')) {
			this.getElement().prepend(overlay);
		}

		overlay.addEventListener('mousemove', () => {
			this.dynamicControls();
		});

		overlay.ondragstart = () => {
			return false;
		};
		overlay.ondrop = () => {
			return false;
		};

		const topBar = this.createTopBar(overlay);

		const bottomBar = this.createBottomBar(overlay);

		const topRow = this.createTopRow(bottomBar);

		const bottomRow = this.createBottomRow(bottomBar);

		this.createBackButton(topBar);

		this.createProgressBar(topRow);

		this.createPlaybackButton(bottomRow);

		this.createVolumeButton(bottomRow);

		this.createPreviousButton(bottomRow);

		this.createSeekBackButton(bottomRow);

		this.createNextButton(bottomRow);

		this.createSeekForwardButton(bottomRow);

		this.createTime(bottomRow, 'current', ['ml-2']);
		this.createDivider(bottomRow);
		this.createTime(bottomRow, 'duration', ['mr-2']);

		this.createPlaylistsButton(bottomRow);
		this.createCaptionsButton(bottomRow);
		this.createAudioButton(bottomRow);
		this.createQualityButton(bottomRow);
		this.createTheaterButton(bottomRow);

		this.createPIPButton(bottomRow);

		this.createSpeedButton(bottomRow);

		this.createSettingsButton(bottomRow);

		this.createFullscreenButton(bottomRow);
	}

	createContainer(parent: HTMLElement, classes: string[], id?: string) {
		const container = document.createElement('div');
		container.id = id ?? 'container';

		classes.push(id ?? 'container');
		this.addClasses(container, classes);

		parent.appendChild(container);

		return container;
	}

	createTopBar(parent: HTMLElement) {
		const topBar = document.createElement('div');
		topBar.id = 'top-bar';
		topBar.style.transform = 'translateY(0)';

		this.topBarStyles.push('top-bar');
		this.addClasses(topBar, this.topBarStyles);

		this.on('controls', (value) => {
			if (value) {
				topBar.style.transform = 'translateY(0)';
			} else {
				topBar.style.transform = '';
			}
		});

		parent.appendChild(topBar);

		return topBar;
	}

	createBottomBar(parent: HTMLElement) {
		const bottomBar = document.createElement('div');
		bottomBar.id = 'bottom-bar';
		bottomBar.style.transform = 'translateY(0)';

		this.bottomBarStyles.push('bottom-bar');
		this.addClasses(bottomBar, this.bottomBarStyles);

		parent.appendChild(bottomBar);

		this.on('controls', (value) => {
			if (value) {
				bottomBar.style.transform = 'translateY(0)';
			} else {
				bottomBar.style.transform = '';
			}
		});

		return bottomBar;
	}

	createTopRow(parent: HTMLDivElement) {
		const topRow = document.createElement('div');


		this.bottomBarStyles.push('top-row');
		this.addClasses(topRow, this.topRowStyles);

		parent.appendChild(topRow);

		return topRow;
	}

	createBottomRow(parent: HTMLDivElement) {
		const bottomRow = document.createElement('div');

		this.bottomBarStyles.push('bottom-row');
		this.addClasses(bottomRow, this.bottomRowStyles);

		parent.appendChild(bottomRow);

		return bottomRow;
	}

	createDivider(parent: HTMLElement, content?: any) {
		const divider = document.createElement('div');
		divider.id = 'divider';

		this.addClasses(divider, this.dividerStyles);

		if (content) {
			divider.innerHTML = content;
		} else {
			this.addClasses(divider, ['flex-1']);
		}

		parent.appendChild(divider);

		return divider;
	}

	createSVGElement(parent: HTMLElement, id: string, icon: Buttons['key'], hidden?: boolean) {
		if (!icon) {
			console.log(id);
			return parent;
		}
		parent.innerHTML += `
			<svg class="${id} ${icon.classes?.join(' ')} ${hidden ? 'hidden' : 'flex'} w-5 h-5" viewBox="0 0 24 24">
				<path d="${icon.path.normal}" class="group-hover/button:hidden"></path>
				<path d="${icon.path.hover}" class="hidden group-hover/button:flex"></path>
			</svg>
		`;
		return parent;
	}

	createButton(parent: HTMLElement, icon: string) {
		const button = document.createElement('button');

		button.id = icon;

		const classes = this.buttonStyles;
		classes.push(icon);

		this.addClasses(button, classes);

		parent.appendChild(button);
		return button;
	}


	createSettingsButton(parent: HTMLDivElement) {
		const settingsButton = this.createButton(
			parent,
			'settings'
		);

		this.createSVGElement(settingsButton, 'settings', this.buttons.settings);

		settingsButton.addEventListener('click', () => {
			this.dispatchEvent('settings');
		});

		this.on('pip', (data) => {
			if (data) {
				settingsButton.style.display = 'none';
			} else {
				settingsButton.style.display = 'flex';
			}
		});

		parent.append(settingsButton);
		return settingsButton;
	}

	createBackButton(topBar: HTMLDivElement) {
		const backButton = this.createButton(
			topBar,
			'back'
		);

		this.createSVGElement(backButton, 'back', this.buttons.back);

		backButton.addEventListener('click', () => {
			this.dispatchEvent('back');
		});

		this.on('pip', (data) => {
			if (data) {
				backButton.style.display = 'none';
			} else {
				backButton.style.display = 'flex';
			}
		});
	}

	createPlaybackButton(parent: HTMLElement) {
		const playbackButton = this.createButton(
			parent,
			'playback'
		);

		this.createSVGElement(playbackButton, 'paused', this.buttons.play);
		this.createSVGElement(playbackButton, 'playing', this.buttons.pause, true);

		playbackButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.togglePlayback();
		});
		this.player.on('pause', () => {
			playbackButton.querySelector<any>('.playing').style.display = 'none';
			playbackButton.querySelector<any>('.paused').style.display = 'flex';
		});
		this.player.on('play', () => {
			playbackButton.querySelector<any>('.paused').style.display = 'none';
			playbackButton.querySelector<any>('.playing').style.display = 'flex';
		});

		parent.appendChild(playbackButton);
		return playbackButton;
	}

	createSeekBackButton(parent: HTMLDivElement) {
		const seekBack = this.createButton(
			parent,
			'seekBack'
		);

		this.createSVGElement(seekBack, 'seekBack', this.buttons.seekBack);

		seekBack.addEventListener('click', () => {
			this.rewindVideo(this.options.seekInterval);
		});

		this.on('pip', (data) => {
			if (data) {
				seekBack.style.display = 'none';
			} else {
				seekBack.style.display = 'flex';
			}
		});

		parent.append(seekBack);
		return seekBack;
	}

	createSeekForwardButton(parent: HTMLDivElement) {
		const seekForward = this.createButton(
			parent,
			'seekForward'
		);

		this.createSVGElement(seekForward, 'seekForward', this.buttons.seekForward);

		seekForward.addEventListener('click', () => {
			this.forwardVideo(this.options.seekInterval);
		});

		this.on('pip', (data) => {
			if (data) {
				seekForward.style.display = 'none';
			} else {
				seekForward.style.display = 'flex';
			}
		});

		parent.append(seekForward);
		return seekForward;
	}

	createTime(parent: HTMLDivElement, type: string, classes: string[]) {
		const time = document.createElement('div');
		time.textContent = '00:00';

		this.addClasses(time, [
			...classes,
			...this.buttonStyles,
			...this.timeStyles,
			`${type}-time`,
		]);

		switch (type) {
		case 'current':

			this.on('time', (data) => {
				time.textContent = this.humanTime(data.position);
			});
			break;

		case 'remaining':

			this.on('duration', (data) => {
				if (data.remaining === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = this.humanTime(data.remaining);
				}
			});

			this.on('time', (data) => {
				if (data.remaining === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = this.humanTime(data.remaining);
				}
			});
			break;

		case 'duration':
			this.on('duration', (data) => {
				if (data.duration === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = this.humanTime(data.duration);
				}
			});
			break;

		default:
			break;
		}

		this.on('pip', (data) => {
			if (data) {
				time.style.display = 'none';
			} else {
				time.style.display = 'flex';
			}
		});

		parent.append(time);
		return time;
	}

	createVolumeButton(parent: HTMLDivElement) {
		const volumeButton = this.createButton(
			parent,
			'volume'
		);

		this.createSVGElement(volumeButton, 'volumeMuted', this.buttons.volumeMuted, true);
		this.createSVGElement(volumeButton, 'volumeLow', this.buttons.volumeLow, true);
		this.createSVGElement(volumeButton, 'volumeMedium', this.buttons.volumeMedium, true);
		this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh);

		volumeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleMute();
		});

		this.on('volume', () => {
			if (this.isMuted()) {
				volumeButton.querySelector<any>('.volumeHigh').style.display = 'none';
				volumeButton.querySelector<any>('.volumeMuted').style.display = 'flex';
			} else {
				volumeButton.querySelector<any>('.volumeMuted').style.display = 'none';
				volumeButton.querySelector<any>('.volumeHigh').style.display = 'flex';
			}
		});
		this.on('mute', () => {
			if (this.isMuted()) {
				volumeButton.querySelector<any>('.volumeHigh').style.display = 'none';
				volumeButton.querySelector<any>('.volumeMuted').style.display = 'flex';
			} else {
				volumeButton.querySelector<any>('.volumeMuted').style.display = 'none';
				volumeButton.querySelector<any>('.volumeHigh').style.display = 'flex';
			}
		});

		parent.append(volumeButton);
		return volumeButton;
	}

	createPreviousButton(parent: HTMLDivElement) {
		const previousButton = this.createButton(
			parent,
			'previous'
		);
		previousButton.style.display = 'none';

		this.createSVGElement(previousButton, 'previous', this.buttons.previous);

		previousButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.previous();
		});
		this.on('item', () => {
			if (this.getCurrentPlaylistIndex() > 0) {
				previousButton.style.display = 'flex';
			} else {
				previousButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				previousButton.style.display = 'none';
			} else {
				previousButton.style.display = 'flex';
			}
		});

		parent.appendChild(previousButton);
		return previousButton;
	}

	createNextButton(parent: HTMLDivElement) {
		const nextButton = this.createButton(
			parent,
			'next'
		);
		nextButton.style.display = 'none';

		this.createSVGElement(nextButton, 'next', this.buttons.next);

		nextButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.next();
		});
		this.on('item', () => {
			if (this.isLastPlaylistItem()) {
				nextButton.style.display = 'none';
			} else {
				nextButton.style.display = 'flex';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				nextButton.style.display = 'none';
			} else {
				nextButton.style.display = 'flex';
			}
		});

		parent.appendChild(nextButton);
		return nextButton;
	}

	subsEnabled = false;
	createCaptionsButton(parent: HTMLElement) {
		const captionButton = this.createButton(
			parent,
			'language'
		);
		captionButton.style.display = 'none';

		this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitles);
		this.createSVGElement(captionButton, 'subtitled', this.buttons.subtitles, true);

		captionButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getTextTracks());

			if (this.subsEnabled) {
				this.subsEnabled = false;
				captionButton.querySelector<any>('.subtitled').style.display = 'none';
				captionButton.querySelector<any>('.subtitle').style.display = 'flex';
				this.setTextTrack(-1);
			} else {
				this.subsEnabled = true;
				captionButton.querySelector<any>('.subtitle').style.display = 'none';
				captionButton.querySelector<any>('.subtitled').style.display = 'flex';
				this.setTextTrack(1);
			}

			// this.toggleLanguage();
		});
		this.on('captions', () => {
			if (this.hasTextTracks()) {
				captionButton.style.display = 'flex';
			} else {
				captionButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				captionButton.style.display = 'none';
			} else {
				captionButton.style.display = 'flex';
			}
		});

		parent.appendChild(captionButton);
		return captionButton;
	}

	audiosEnabled = false;
	createAudioButton(parent: HTMLElement) {
		const audioButton = this.createButton(
			parent,
			'audio'
		);
		audioButton.style.display = 'none';

		this.createSVGElement(audioButton, 'audio', this.buttons.language);
		this.createSVGElement(audioButton, 'audio-enable', this.buttons.language, true);

		audioButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getAudioTracks());

			if (this.audiosEnabled) {
				this.audiosEnabled = false;
				audioButton.querySelector<any>('.audio-enable').style.display = 'none';
				audioButton.querySelector<any>('.audio').style.display = 'flex';
				this.setTextTrack(-1);
			} else {
				this.audiosEnabled = true;
				audioButton.querySelector<any>('.audio').style.display = 'none';
				audioButton.querySelector<any>('.audio-enable').style.display = 'flex';
				this.setTextTrack(1);
			}

			// this.toggleLanguage();
		});
		this.on('audio', () => {
			if (this.hasAudioTracks()) {
				audioButton.style.display = 'flex';
			} else {
				audioButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				audioButton.style.display = 'none';
			} else {
				audioButton.style.display = 'flex';
			}
		});

		parent.appendChild(audioButton);
		return audioButton;
	}

	highQuality = false;
	createQualityButton(parent: HTMLElement) {
		const qualityButton = this.createButton(
			parent,
			'quality'
		);
		qualityButton.style.display = 'none';

		this.createSVGElement(qualityButton, 'low', this.buttons.quality);
		this.createSVGElement(qualityButton, 'high', this.buttons.quality, true);

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getQualities());

			if (this.highQuality) {
				this.highQuality = false;
				qualityButton.querySelector<any>('.high').style.display = 'none';
				qualityButton.querySelector<any>('.low').style.display = 'flex';
			} else {
				this.highQuality = true;
				qualityButton.querySelector<any>('.low').style.display = 'none';
				qualityButton.querySelector<any>('.high').style.display = 'flex';
			}

			// this.toggleLanguage();
		});

		this.on('item', () => {
			if (this.hasQualities()) {
				qualityButton.style.display = 'flex';
			} else {
				qualityButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				qualityButton.style.display = 'none';
			} else {
				qualityButton.style.display = 'flex';
			}
		});

		parent.appendChild(qualityButton);
		return qualityButton;
	}

	theaterModeEnabled = false;
	createTheaterButton(parent: HTMLDivElement) {
		const theaterButton = this.createButton(
			parent,
			'theater'
		);

		this.createSVGElement(theaterButton, 'theater', this.buttons.theater);
		this.createSVGElement(theaterButton, 'theater-enabled', this.buttons.theaterExit, true);

		theaterButton.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.theaterModeEnabled) {
				this.theaterModeEnabled = false;
				theaterButton.querySelector<any>('.theater-enabled').style.display = 'none';
				theaterButton.querySelector<any>('.theater').style.display = 'flex';
				this.dispatchEvent('theaterMode', false);
			} else {
				this.theaterModeEnabled = true;
				theaterButton.querySelector<any>('.theater').style.display = 'none';
				theaterButton.querySelector<any>('.theater-enabled').style.display = 'flex';
				this.dispatchEvent('theaterMode', true);
			}

			// this.toggleLanguage();
		});

		this.on('pip', (data) => {
			if (data) {
				theaterButton.style.display = 'none';
			} else {
				theaterButton.style.display = 'flex';
			}
		});

		parent.appendChild(theaterButton);
		return theaterButton;
	}

	createFullscreenButton(parent: HTMLElement) {
		const fullscreenButton = this.createButton(
			parent,
			'fullscreen'
		);

		this.createSVGElement(fullscreenButton, 'fullscreen-enable', this.buttons.exitFullscreen, true);
		this.createSVGElement(fullscreenButton, 'fullscreen', this.buttons.fullscreen);

		fullscreenButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleFullscreen();
		});
		this.on('fullscreen', () => {
			if (this.isFullscreen()) {
				fullscreenButton.querySelector<any>('.fullscreen').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen-enable').style.display = 'flex';
			} else {
				fullscreenButton.querySelector<any>('.fullscreen-enable').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen').style.display = 'flex';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				fullscreenButton.style.display = 'none';
			} else {
				fullscreenButton.style.display = 'flex';
			}
		});

		parent.appendChild(fullscreenButton);
		return fullscreenButton;

	}

	createPlaylistsButton(parent: HTMLDivElement) {
		const playlistButton = this.createButton(
			parent,
			'playlist'
		);

		playlistButton.style.display = 'none';

		this.createSVGElement(playlistButton, 'playlist', this.buttons.playlist);

		playlistButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getPlaylist());
			// this.togglePlaylists();
		});

		this.on('item', () => {
			if (this.hasPlaylists()) {
				playlistButton.style.display = 'flex';
			} else {
				playlistButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				playlistButton.style.display = 'none';
			} else {
				playlistButton.style.display = 'flex';
			}
		});

		parent.appendChild(playlistButton);
		return playlistButton;
	}

	createSpeedButton(parent: HTMLDivElement) {
		const speedButton = this.createButton(
			parent,
			'speed'
		);

		speedButton.style.display = 'none';

		this.createSVGElement(speedButton, 'speed', this.buttons.speed);

		speedButton.addEventListener('click', (event) => {
			event.stopPropagation();
			// console.log(this.getPlaylist());
			// this.togglePlaylists();
		});

		this.on('item', () => {
			if (this.hasSpeeds()) {
				speedButton.style.display = 'flex';
			} else {
				speedButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				speedButton.style.display = 'none';
			} else {
				speedButton.style.display = 'flex';
			}
		});

		parent.appendChild(speedButton);
		return speedButton;
	}

	pipEnabled = false;
	createPIPButton(parent: HTMLDivElement) {
		const pipButton = this.createButton(
			parent,
			'pip'
		);

		pipButton.style.display = 'none';

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true);

		pipButton.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.pipEnabled) {
				this.pipEnabled = false;
				pipButton.querySelector<any>('.pip-exit').style.display = 'none';
				pipButton.querySelector<any>('.pip-enter').style.display = 'flex';
				this.dispatchEvent('pip', false);
			} else {
				this.pipEnabled = true;
				pipButton.querySelector<any>('.pip-enter').style.display = 'none';
				pipButton.querySelector<any>('.pip-exit').style.display = 'flex';
				this.dispatchEvent('pip', true);
			}
		});

		this.on('item', () => {
			if (this.hasPIP()) {
				pipButton.style.display = 'flex';
			} else {
				pipButton.style.display = 'none';
			}
		});

		parent.appendChild(pipButton);
		return pipButton;
	}

	createProgressBar(parent: HTMLDivElement) {

		const sliderBar = document.createElement('div');
		this.addClasses(sliderBar, this.sliderBarStyles);
		this.progressBar = sliderBar;

		const sliderBuffer = document.createElement('div');
		sliderBuffer.id = 'slider-buffer';
		this.addClasses(sliderBuffer, this.sliderBufferStyles);

		const sliderProgress = document.createElement('div');
		sliderProgress.id = 'slider-progress';
		this.addClasses(sliderProgress, this.sliderProgressStyles);
		sliderBar.append(sliderProgress);

		sliderBar.append(sliderBuffer);

		const sliderNipple = document.createElement('div');
		this.addClasses(sliderNipple, this.sliderNippleStyles);
		sliderNipple.id = 'slider-nipple';
		sliderBar.append(sliderNipple);

		const sliderPop = document.createElement('div');
		sliderPop.id = 'slider-pop';
		sliderPop.style.setProperty('--visibility', 'hidden');
		sliderPop.style.visibility = 'var(--visibility)';
		this.addClasses(sliderPop, this.sliderPopStyles);

		const sliderPopImage = document.createElement('div');
		this.addClasses(sliderPopImage, this.sliderPopImageStyles);
		sliderPopImage.id = 'slider-pop-image';
		sliderPop.append(sliderPopImage);

		const sliderText = document.createElement('div');
		sliderText.id = 'slider-text';
		sliderText.classList.add('slider-text');
		this.addClasses(sliderText, this.sliderTextStyles);
		sliderPop.append(sliderText);

		const chapterText = document.createElement('div');
		chapterText.id = 'chapter-text';
		chapterText.classList.add('chapter-text');
		this.addClasses(chapterText, this.chapterTextStyles);
		sliderPop.append(chapterText);

		sliderBar.append(sliderPop);

		this.on('seeked', () => {
			sliderPop.style.setProperty('--visibility', 'hidden');

			this.hideControls();
		});

		this.on('item', () => {
			this.previewTime = [];
			this.chapters = [];
		});

		this.on('time', (data) => {
			sliderBuffer.style.width = `${data.buffered}%`;
			sliderProgress.style.width = `${data.percentage}%`;
		});

		['mouseover', 'mouseleave', 'mousemove', 'touchmove'].forEach((event) => {
			switch (event) {
			case 'mouseover':
				sliderBar.addEventListener(event, (e) => {
					const scrubTime = this.#getScrubTime(e, sliderBar);
					this.#getSliderPopImage(scrubTime, sliderPopImage);
					sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);
					chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
					if (this.previewTime.length > 0) {
						sliderPop.style.setProperty('--visibility', 'visible');
						const sliderPopOffsetX = this.#getSliderPopOffsetX(e, sliderBar, sliderPop, scrubTime);
						sliderPop.style.left = `${sliderPopOffsetX}%`;
					}
				});
				break;
			case 'mouseleave':
				sliderBar.addEventListener(event, () => {
					sliderPop.style.setProperty('--visibility', 'hidden');
					// hide sliderPop
				});
				break;
			case 'mousemove':
			case 'touchmove':
				document.addEventListener(event, (e: any) => {
					// move sliderPop
					const scrubTime = this.#getScrubTime(e, sliderBar);
					this.#getSliderPopImage(scrubTime, sliderPopImage);
					const sliderPopOffsetX = this.#getSliderPopOffsetX(e, sliderBar, sliderPop, scrubTime);
					sliderPop.style.left = `${sliderPopOffsetX}%`;
					sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);
					chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
					if ((e?.button ?? 0) !== 0 || !this.isMouseDown) return;
					sliderProgress.style.width = `${scrubTime.scrubTime}%`;
					sliderNipple.style.left = `${scrubTime.scrubTime}%`;
					if (this.previewTime.length > 0) {
						sliderPop.style.setProperty('--visibility', 'visible');
					}
				});
				break;
			}
		});
		['mousedown', 'touchstart'].forEach((event) => {
			sliderBar.addEventListener(event, (e: any) => {
				if ((e?.button ?? 0) !== 0 || this.isMouseDown) return;
				this.isMouseDown = true;
			});
		});
		['mouseup', 'touchend'].forEach((event) => {
			document.addEventListener(event, (e: any) => {
				if ((e?.button ?? 0) !== 0 || !this.isMouseDown) return;
				sliderPop.style.setProperty('--visibility', 'hidden');
				this.isMouseDown = false;
				const scrubTime = this.#getScrubTime(e, sliderBar);
				sliderProgress.style.width = `${scrubTime.scrubTime}%`;
				sliderNipple.style.left = `${scrubTime.scrubTime}%`;
				this.seek(scrubTime.scrubTimePlayer);
			});
		});

		this.on('time', (data) => {
			sliderNipple.style.left = `${data.percentage}%`;
		});

		this.on('controls', (value) => {
			if (!value) {
				sliderPop.style.setProperty('--visibility', 'hidden');
			}
		});

		this.on('pip', (data) => {
			if (data) {
				this.progressBar.style.display = 'none';
			} else {
				this.progressBar.style.display = 'flex';
			}
		});

		parent.append(sliderBar);
		return sliderBar;
	}

	#getChapterText(scrubTimePlayer: number): string | null {
		const index = this.getChapters().findIndex((chapter: Chapter) => {
			return chapter.time > scrubTimePlayer;
		});
		return this.getChapters()[index - 1]?.title ?? null;
	}

	createChapterMarker(chapter: Chapter) {
		const chapterMarker = document.createElement('div');
		chapterMarker.id = `chapter-marker-${chapter.id.replace(/\s/gu, '-')}`;

		chapterMarker.style.left = `${chapter.time / this.duration() * 100}%`;

		this.addClasses(chapterMarker, this.chapterMarkersStyles);

		this.progressBar.append(chapterMarker);
		return chapterMarker;
	}

	createChapterMarkers() {
		this.progressBar.querySelectorAll('.chapter-marker').forEach((element) => {
			element.remove();
		});
		this.getChapters().forEach((chapter: Chapter) => {
			this.createChapterMarker(chapter);
		});
	}

	#getSliderPopOffsetX(e: any, sliderBar: HTMLDivElement, sliderPop: HTMLDivElement, scrubTime: any) {
		const sliderBarRect = sliderBar.getBoundingClientRect();
		const sliderPopRect = sliderPop.getBoundingClientRect();
		const sliderPopPercentageWidth = ((sliderPopRect.width / 2) / sliderBarRect.width) * 100;
		let offsetX = scrubTime.scrubTime;
		if (offsetX <= sliderPopPercentageWidth) {
			offsetX = sliderPopPercentageWidth;
		}
		if (offsetX >= 100 - sliderPopPercentageWidth) {
			offsetX = 100 - sliderPopPercentageWidth;
		}

		return offsetX;
	}

	#fetchSliderPopImage(scrubTime: any, sliderPopImage: HTMLDivElement) {
		if (this.previewTime.length === 0) {
			const image = this.getCurrentSpriteFile();
			if (image) {
				sliderPopImage.style.backgroundImage = `url('${image}')`;
			}
			const file = this.getCurrentTimeFile();
			if (file) {
				this.getFileContents({
					url: file,
					options: {},
					callback: (data: string) => {
						// eslint-disable-next-line max-len
						const regex
							= /(\d{2}:\d{2}:\d{2})\.\d{3}\s-->\s(\d{2}:\d{2}:\d{2})\.\d{3}\nsprite\.webp#(xywh=\d{1,},\d{1,},\d{1,},\d{1,})/gmu;

						let m: any;
						while ((m = regex.exec(data)) !== null) {
							if (m.index === regex.lastIndex) {
								regex.lastIndex += 1;
							}

							const data = m[3].split('=')[1].split(',');

							this.previewTime.push({
								start: this.convertToSeconds(m[1]),
								end: this.convertToSeconds(m[2]),
								x: data[0],
								y: data[1],
								w: data[2],
								h: data[3],
							});
						}
					},
				});
			}
		}

		let img = this.previewTime.find(
			(p: { start: number; end: number }) => scrubTime.scrubTimePlayer >= p.start && scrubTime.scrubTimePlayer < p.end
		);
		if (!img) {
			img = this.previewTime.at(-1);
		}
		return img;
	}

	#getSliderPopImage(scrubTime: any, sliderPopImage: any) {

		const img = this.#fetchSliderPopImage(scrubTime, sliderPopImage);

		if (img) {
			sliderPopImage.style.backgroundPosition = `-${img.x}px -${img.y}px`;
			sliderPopImage.style.width = `${img.w}px`;
			sliderPopImage.style.height = `${img.h}px`;
		}
	}

	#getScrubTime(e: any, sliderBar: HTMLDivElement) {
		const elementRect = sliderBar.getBoundingClientRect();
		let offsetX = e.clientX - elementRect.left;
		if (offsetX <= 0) offsetX = 0;
		if (offsetX >= elementRect.width) offsetX = elementRect.width;
		return {
			scrubTime: (offsetX / sliderBar.offsetWidth) * 100,
			scrubTimePlayer: (offsetX / sliderBar.offsetWidth) * this.duration(),
		};
	}
}
