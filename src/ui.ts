import { buttons, fluentIcons, Icon } from './buttons.js';
import Functions from './functions.js';
import {
    bottomBarStyles, bottomRowStyles, buttonBaseStyle, buttonStyles, chapterBarStyles,
    chapterMarkersStyles, dividerStyles, iconStyles, overlayStyles, sliderBarStyles,
    sliderBufferStyles, sliderNippleStyles, sliderPopImageStyles, sliderPopStyles,
    sliderProgressStyles, sliderTextStyles, timeStyles, topBarStyles, topRowStyles
} from './styles.js';

import type { VideoPlayerOptions, VideoPlayer as Types, Chapter } from './nomercyplayer.d';

export default class UI extends Functions {

	overlayStyles: string[] = [];
	topBarStyles: string[] = [];
	bottomBarStyles: string[] = [];

	buttonBaseStyle: string[] = [];
	fluentIcons: Icon = <Icon>{};
	buttonStyles: string[] = [];
	buttons: Icon = <Icon>{};
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
	sliderPopImage: any;
	chapterBar: HTMLDivElement = <HTMLDivElement>{};
	chapterBarStyles: string[] = [];

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		this.on('ready', () => {

			this.overlayStyles = overlayStyles;
			this.topBarStyles = topBarStyles;
			this.bottomBarStyles = bottomBarStyles;
			this.topRowStyles = topRowStyles;
			this.bottomRowStyles = bottomRowStyles;

			this.sliderBarStyles = sliderBarStyles;
			this.chapterBarStyles = chapterBarStyles;
			this.sliderBufferStyles = sliderBufferStyles;
			this.sliderProgressStyles = sliderProgressStyles;
			this.sliderNippleStyles = sliderNippleStyles;
			this.sliderPopStyles = sliderPopStyles;
			this.sliderPopImageStyles = sliderPopImageStyles;
			this.timeStyles = timeStyles;
			this.dividerStyles = dividerStyles;
			this.sliderTextStyles = sliderTextStyles;
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

		this.createSeekForwardButton(bottomRow);

		this.createNextButton(bottomRow);

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

	createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden?: boolean) {

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.addClasses(svg, [
			...icon.classes,
			id,
			'w-5',
			'h-5',
			hidden ? 'hidden' : 'flex',
		]);

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', icon.normal);
		this.addClasses(path, ['group-hover/button:hidden']);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', icon.hover);
		this.addClasses(path2, ['hidden', 'group-hover/button:flex']);
		svg.appendChild(path2);

		parent.appendChild(svg);

		return svg;

	}

	createButton(parent: HTMLElement, icon: string) {
		const button = document.createElement('button');

		button.id = icon;
		button.type = 'button';
		button.title = this.buttons[icon]?.title;

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
		playbackButton.title = this.buttons.play?.title;

		const pausedButton = this.createSVGElement(playbackButton, 'paused', this.buttons.play);
		const playButton = this.createSVGElement(playbackButton, 'playing', this.buttons.pause, true);

		playbackButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.togglePlayback();
		});
		this.on('pause', () => {
			playButton.style.display = 'none';
			pausedButton.style.display = 'flex';
		});
		this.on('play', () => {
			pausedButton.style.display = 'none';
			playButton.style.display = 'flex';
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
			this.rewindVideo();
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
			this.forwardVideo();
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
			} else if (this.duration() == 0) {
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
		volumeButton.title = this.buttons.volumeHigh?.title;

		const mutedButton = this.createSVGElement(volumeButton, 'volumeMuted', this.buttons.volumeMuted, true);
		const lowButton = this.createSVGElement(volumeButton, 'volumeLow', this.buttons.volumeLow, true);
		const mediumButton = this.createSVGElement(volumeButton, 'volumeMedium', this.buttons.volumeMedium, true);
		const highButton = this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh);

		volumeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleMute();
		});

		this.on('volume', (data) => {
			console.log(data);
			if (this.isMuted()) {
				lowButton.style.display = 'none';
				mediumButton.style.display = 'none';
				highButton.style.display = 'none';

				mutedButton.style.display = 'flex';
			} else if (data.volume <= 0.3) {
				mediumButton.style.display = 'none';
				highButton.style.display = 'none';
				mutedButton.style.display = 'none';

				lowButton.style.display = 'flex';
			} else if (data.volume <= 0.6) {
				lowButton.style.display = 'none';
				highButton.style.display = 'none';
				mutedButton.style.display = 'none';

				mediumButton.style.display = 'flex';
			} else {
				lowButton.style.display = 'none';
				mediumButton.style.display = 'none';
				mutedButton.style.display = 'none';

				highButton.style.display = 'flex';
			}
		});
		this.on('mute', () => {
			if (this.isMuted()) {
				highButton.style.display = 'none';
				mutedButton.style.display = 'flex';
			} else {
				mutedButton.style.display = 'none';
				highButton.style.display = 'flex';
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
			} else if (this.getCurrentPlaylistIndex() == 0) {
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
			} else if (this.isLastPlaylistItem()) {
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
			'subtitles'
		);
		captionButton.style.display = 'none';
		captionButton.title = this.buttons.subtitles?.title;

		const offButton = this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitlesOff);
		const onButton = this.createSVGElement(captionButton, 'subtitled', this.buttons.subtitles, true);

		captionButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getTextTracks());

			if (this.subsEnabled) {
				this.subsEnabled = false;
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
				this.setTextTrack(-1);
			} else {
				this.subsEnabled = true;
				offButton.style.display = 'none';
				onButton.style.display = 'flex';
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
			} else if (this.hasTextTracks()) {
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
		audioButton.title = this.buttons.language?.title;

		const offButton = this.createSVGElement(audioButton, 'audio', this.buttons.languageOff);
		const onButton = this.createSVGElement(audioButton, 'audio-enable', this.buttons.language, true);

		audioButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getAudioTracks());

			if (this.audiosEnabled) {
				this.audiosEnabled = false;
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
				this.setAudioTrack(0);
			} else {
				this.audiosEnabled = true;
				offButton.style.display = 'none';
				onButton.style.display = 'flex';
				this.setAudioTrack(1);
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
			} else if (this.hasAudioTracks()) {
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

		const offButton = this.createSVGElement(qualityButton, 'low', this.buttons.quality);
		const onButton = this.createSVGElement(qualityButton, 'high', this.buttons.quality, true);

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getQualities());

			if (this.highQuality) {
				this.highQuality = false;
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
			} else {
				this.highQuality = true;
				offButton.style.display = 'none';
				onButton.style.display = 'flex';
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
			} else if (this.hasQualities()) {
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

		this.on('fullscreen', () => {
			if (this.isFullscreen()) {
				theaterButton.style.display = 'none';
			} else {
				theaterButton.style.display = 'flex';
			}
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
			} else if (this.hasPlaylists()) {
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
			} else if (this.hasSpeeds()) {
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
		pipButton.title = this.buttons.pipEnter?.title;

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true);

		pipButton.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.pipEnabled) {
				this.pipEnabled = false;
				pipButton.querySelector<any>('.pip-exit').style.display = 'none';
				pipButton.querySelector<any>('.pip-enter').style.display = 'flex';
				pipButton.title = this.buttons.pipEnter?.title;
				this.dispatchEvent('pip', false);
			} else {
				this.pipEnabled = true;
				pipButton.querySelector<any>('.pip-enter').style.display = 'none';
				pipButton.querySelector<any>('.pip-exit').style.display = 'flex';
				pipButton.title = this.buttons.pipExit?.title;
				this.dispatchEvent('pip', true);
			}
		});

		this.on('fullscreen', () => {
			if (this.isFullscreen()) {
				pipButton.style.display = 'none';
			} else {
				pipButton.style.display = 'flex';
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

		this.chapterBar = document.createElement('div');
		this.chapterBar.id = 'chapter-progress';
		this.addClasses(this.chapterBar, this.chapterBarStyles);
		sliderBar.append(this.chapterBar);

		sliderBar.append(sliderBuffer);

		const sliderNipple = document.createElement('div');
		this.addClasses(sliderNipple, this.sliderNippleStyles);
		sliderNipple.id = 'slider-nipple';
		sliderBar.append(sliderNipple);

		const sliderPop = document.createElement('div');
		sliderPop.id = 'slider-pop';
		sliderPop.style.setProperty('--visibility', '0');
		sliderPop.style.opacity = 'var(--visibility)';
		this.addClasses(sliderPop, this.sliderPopStyles);

		this.sliderPopImage = document.createElement('div');
		this.addClasses(this.sliderPopImage, this.sliderPopImageStyles);
		this.sliderPopImage.id = 'slider-pop-image';
		sliderPop.append(this.sliderPopImage);

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
			sliderPop.style.setProperty('--visibility', '0');

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
					this.#getSliderPopImage(scrubTime);
					sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);
					chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
					if (this.previewTime.length > 0) {
						sliderPop.style.setProperty('--visibility', '1');
						const sliderPopOffsetX = this.#getSliderPopOffsetX(e, sliderBar, sliderPop, scrubTime);
						sliderPop.style.left = `${sliderPopOffsetX}%`;
					}
				});
				break;
			case 'mouseleave':
				sliderBar.addEventListener(event, () => {
					sliderPop.style.setProperty('--visibility', '0');
					// hide sliderPop
				});
				break;
			case 'mousemove':
			case 'touchmove':
				document.addEventListener(event, (e: any) => {
					// move sliderPop
					const scrubTime = this.#getScrubTime(e, sliderBar);
					this.#getSliderPopImage(scrubTime);
					const sliderPopOffsetX = this.#getSliderPopOffsetX(e, sliderBar, sliderPop, scrubTime);
					sliderPop.style.left = `${sliderPopOffsetX}%`;
					sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);
					chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
					if ((e?.button ?? 0) !== 0 || !this.isMouseDown) return;
					sliderProgress.style.width = `${scrubTime.scrubTime}%`;
					sliderNipple.style.left = `${scrubTime.scrubTime}%`;
					if (this.previewTime.length > 0) {
						sliderPop.style.setProperty('--visibility', '1');
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
				sliderPop.style.setProperty('--visibility', '0');
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
				sliderPop.style.setProperty('--visibility', '0');
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

		this.chapterBar.append(chapterMarker);
		return chapterMarker;
	}

	createChapterMarkers() {
		this.chapterBar.querySelectorAll('.chapter-marker').forEach((element) => {
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

	#fetchSliderPopImage(scrubTime: any) {
		if (this.previewTime.length === 0) {
			const image = this.getCurrentSpriteFile();
			if (image) {
				this.sliderPopImage.style.backgroundImage = `url('${image}')`;
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

	#getSliderPopImage(scrubTime: any) {

		const img = this.#fetchSliderPopImage(scrubTime);

		if (img) {
			this.sliderPopImage.style.width = `${img.w}px`;
			this.sliderPopImage.style.height = `${img.h}px`;
			this.sliderPopImage.style.backgroundPosition = `${img.x}px ${img.y}px`;
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
