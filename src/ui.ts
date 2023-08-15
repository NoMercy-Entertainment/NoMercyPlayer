
/* eslint-disable indent */
import { buttons, fluentIcons, Icon } from './buttons';
import Functions from './functions';
import {
	bottomBarStyles, bottomRowStyles, buttonBaseStyle, buttonStyles, centerStyles, chapterBarStyles,
	chapterMarkerBGStyles, chapterMarkerBufferStyles, chapterMarkerHoverStyles, chapterMarkerProgressStyles,
	chapterMarkersStyles, chapterTextStyles, dividerStyles, episodeMenuButtonImageStyles, episodeMenuButtonLeftStyles,
	episodeMenuButtonShadowStyles, iconStyles, languageButtonSpanStyles,
	mainMenuStyles, menuButtonStyles, menuButtonTextStyles, menuContentStyles, menuFrameStyles,
	menuHeaderButtonTextStyles, menuHeaderStyles, overlayStyles, playerMessageStyles,
	playlistMenuButtonStyles, playlistMenuStyles, scrollContainerStyles, sliderBarStyles,
	sliderBufferStyles, sliderHoverStyles, sliderNippleStyles, sliderPopImageStyles, sliderPopStyles,
	sliderProgressStyles, sliderTextStyles, speedButtonTextStyles, subMenuContentStyles,
	subMenuStyles, svgSizeStyles, timeStyles, tooltipStyles, topBarStyles, topRowStyles, touchPlaybackButtonStyles,
	touchPlaybackStyles, volumeContainerStyles, volumeSliderStyles
} from './styles';

import type { VideoPlayerOptions, VideoPlayer as Types, Chapter, VolumeState, PlaylistItem } from './nomercyplayer.d';

export interface Position {
	x: {
		start:number;
		end: number;
	};
	y: {
		start:number;
		end: number;
	};
}

export default class UI extends Functions {

	timer: NodeJS.Timeout = <NodeJS.Timeout>{};
	isMouseDown = false;
	progressBar: HTMLDivElement = <HTMLDivElement>{}; // sliderBar

	isScrubbing = false;
	menuOpen = false;
	mainMenuOpen = false;
	languageMenuOpen = false;
	subtitlesMenuOpen = false;
	qualityMenuOpen = false;
	speedMenuOpen = false;
	playlistMenuOpen = false;

	previewTime: {
		start: number;
		end: number;
		x: number;
		y: number;
		w: number;
		h: number;
	}[] = [];

	sliderPopImage: any;
	chapterBar: HTMLDivElement = <HTMLDivElement>{};
	bottomBar: HTMLDivElement = <HTMLDivElement>{};
	topRow: HTMLDivElement = <HTMLDivElement>{};
	currentTimeFile = '';
	fluentIcons: Icon = <Icon>{};
	buttons: Icon = <Icon>{};

	bottomBarStyles: string[] = [];
	bottomRowStyles: string[] = [];
	buttonBaseStyles: string[] = [];
	buttonStyles: string[] = [];
	centerStyles: string[] = [];
	chapterBarStyles: string[] = [];
	chapterMarkerBGStyles: string[] = [];
	chapterMarkerBufferStyles: string[] = [];
	chapterMarkerHoverStyles: string[] = [];
	chapterMarkerProgressStyles: string[] = [];
	chapterMarkersStyles: string[] = [];
	chapterTextStyles: string[] = [];
	dividerStyles: string[] = [];
	iconStyles: string[] = [];
	languageButtonSpanStyles: string[] = [];
	languageButtonStyles: string[] = [];
	mainMenuStyles: string[] = [];
	menuButtonStyles: string[] = [];
	menuButtonTextStyles: string[] = [];
	menuContentStyles: string[] = [];
	menuFrameStyles: string[] = [];
	menuHeaderButtonTextStyles: string[] = [];
	menuHeaderStyles: string[] = [];
	overlayStyles: string[] = [];
	scrollContainerStyles: string[] = [];
	sliderBarStyles: string[] = [];
	sliderNippleStyles: string[] = [];
	sliderPopImageStyles: string[] = [];
	sliderPopStyles: string[] = [];
	sliderTextStyles: string[] = [];
	speedButtonTextStyles: string[] = [];
	subMenuStyles: string[] = [];
	svgSizeStyles: string[] = [];
	timeStyles: string[] = [];
	topBarStyles: string[] = [];
	topRowStyles: string[] = [];
	touchPlaybackStyles: string[] = [];
	touchPlaybackButtonStyles: string[] = [];
	subMenuContentStyles: string[] = [];
	volumeSliderStyles: string[] = [];
	volumeContainerStyles: string[] = [];
	sliderBufferStyles: string[] = [];
	sliderHoverStyles: string[] = [];
	sliderProgressStyles: string[] = [];
	playerMessageStyles: string[] = [];
	playlistMenuStyles: string[] = [];
	playlistMenuButtonStyles: string[] = [];
	tooltip: any;
	hasNextTip = false;
	sliderBar: any;

	tooltipStyles: string[] = [];
	episodeMenuButtonLeftStyles: string[] = [];
	episodeMenuButtonShadowStyles: string[] = [];
	episodeMenuButtonImageStyles: string[] = [];

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		this.on('ready', () => {

			this.bottomBarStyles = this.mergeStyles('bottomBarStyles', bottomBarStyles);
			this.bottomRowStyles = this.mergeStyles('bottomRowStyles', bottomRowStyles);
			this.buttonBaseStyles = this.mergeStyles('buttonBaseStyle', buttonBaseStyle);
			this.buttonStyles = this.mergeStyles('buttonStyles', buttonStyles);
			this.centerStyles = this.mergeStyles('centerStyles', centerStyles);
			this.chapterBarStyles = this.mergeStyles('chapterBarStyles', chapterBarStyles);
			this.chapterMarkerBGStyles = this.mergeStyles('chapterMarkerBGStyles', chapterMarkerBGStyles);
			this.chapterMarkerBufferStyles = this.mergeStyles('chapterMarkerBufferStyles', chapterMarkerBufferStyles);
			this.chapterMarkerHoverStyles = this.mergeStyles('chapterMarkerHoverStyles', chapterMarkerHoverStyles);
			this.chapterMarkerProgressStyles = this.mergeStyles('chapterMarkerProgressStyles', chapterMarkerProgressStyles);
			this.chapterMarkersStyles = this.mergeStyles('chapterMarkersStyles', chapterMarkersStyles);
			this.chapterTextStyles = this.mergeStyles('chapterTextStyles', chapterTextStyles);
			this.dividerStyles = this.mergeStyles('dividerStyles', dividerStyles);
			this.iconStyles = this.mergeStyles('iconStyles', iconStyles);
			this.languageButtonSpanStyles = this.mergeStyles('languageButtonSpanStyles', languageButtonSpanStyles);
			this.menuButtonTextStyles = this.mergeStyles('menuButtonTextStyles', menuButtonTextStyles);
			this.mainMenuStyles = this.mergeStyles('mainMenuStyles', mainMenuStyles);
			this.menuButtonStyles = this.mergeStyles('menuButtonStyles', menuButtonStyles);
			this.menuContentStyles = this.mergeStyles('menuContentStyles', menuContentStyles);
			this.menuFrameStyles = this.mergeStyles('menuFrameStyles', menuFrameStyles);
			this.menuHeaderButtonTextStyles = this.mergeStyles('menuHeaderButtonTextStyles', menuHeaderButtonTextStyles);
			this.menuHeaderStyles = this.mergeStyles('menuHeaderStyles', menuHeaderStyles);
			this.overlayStyles = this.mergeStyles('overlayStyles', overlayStyles);
			this.scrollContainerStyles = this.mergeStyles('scrollContainerStyles', scrollContainerStyles);
			this.sliderBarStyles = this.mergeStyles('sliderBarStyles', sliderBarStyles);
			this.sliderNippleStyles = this.mergeStyles('sliderNippleStyles', sliderNippleStyles);
			this.sliderPopImageStyles = this.mergeStyles('sliderPopImageStyles', sliderPopImageStyles);
			this.sliderPopStyles = this.mergeStyles('sliderPopStyles', sliderPopStyles);
			this.sliderTextStyles = this.mergeStyles('sliderTextStyles', sliderTextStyles);
			this.speedButtonTextStyles = this.mergeStyles('speedButtonTextStyles', speedButtonTextStyles);
			this.subMenuStyles = this.mergeStyles('subMenuStyles', subMenuStyles);
			this.subMenuContentStyles = this.mergeStyles('subMenuContentStyles', subMenuContentStyles);
			this.svgSizeStyles = this.mergeStyles('svgSizeStyles', svgSizeStyles);
			this.timeStyles = this.mergeStyles('timeStyles', timeStyles);
			this.topBarStyles = this.mergeStyles('topBarStyles', topBarStyles);
			this.topRowStyles = this.mergeStyles('topRowStyles', topRowStyles);
			this.touchPlaybackStyles = this.mergeStyles('touchPlaybackStyles', touchPlaybackStyles);
			this.touchPlaybackButtonStyles = this.mergeStyles('touchPlaybackButtonStyles', touchPlaybackButtonStyles);
			this.buttonStyles = this.mergeStyles('buttonStyles', buttonStyles);
			this.volumeContainerStyles = this.mergeStyles('volumeContainerStyles', volumeContainerStyles);
			this.volumeSliderStyles = this.mergeStyles('volumeSliderStyles', volumeSliderStyles);
			this.sliderBufferStyles = this.mergeStyles('sliderBufferStyles', sliderBufferStyles);
			this.sliderHoverStyles = this.mergeStyles('sliderHoverStyles', sliderHoverStyles);
			this.sliderProgressStyles = this.mergeStyles('sliderProgressStyles', sliderProgressStyles);
			this.playerMessageStyles = this.mergeStyles('playerMessageStyles', playerMessageStyles);
			this.playlistMenuStyles = this.mergeStyles('playlistMenuStyles', playlistMenuStyles);
			this.playlistMenuButtonStyles = this.mergeStyles('playlistMenuButtonStyles', playlistMenuButtonStyles);
			this.episodeMenuButtonLeftStyles = this.mergeStyles('episodeMenuButtonLeftStyles', episodeMenuButtonLeftStyles);
			this.episodeMenuButtonShadowStyles = this.mergeStyles('episodeMenuButtonShadowStyles', episodeMenuButtonShadowStyles);
			this.episodeMenuButtonImageStyles = this.mergeStyles('episodeMenuButtonImageStyles', episodeMenuButtonImageStyles);

			this.tooltipStyles = this.mergeStyles('tooltipStyles', tooltipStyles);


			this.fluentIcons = fluentIcons;
			this.buttons = buttons(this.options);

			this.buildUI();
			this.#eventHandlers();
		});
	}

	mergeStyles(styleName: string, defaultStyles: string[]) {
		const styles = this.options.styles?.[styleName] || [];
		return [...defaultStyles, ...styles];
	}

	#eventHandlers() {
		this.on('item', () => {
			this.createChapterMarkers();
		});
		this.on('chapters', () => {
			if (this.duration() == 0) {
				return setTimeout(() => {
					this.createChapterMarkers();
				}, 500);
			}
			this.createChapterMarkers();
		});

		this.on('play', () => {
			this.hideControls();
		});
		this.on('pause', () => {
			this.showControls();
		});
		this.on('volume', (data) => {
			this.displayMessage(`Volume: ${Math.floor(data.volume)}%`);
		});
		this.on('mute', (data) => {
			if (data.mute) {
				this.displayMessage('Muted');
			} else {
				this.displayMessage(`Volume: ${data.volume}%`);
			}
		});
	}

	unlockControls() {
		this.lock = false;
		this.getElement().querySelectorAll<HTMLDivElement>('*')
			.forEach(el => el.blur());
	}

	lockControls() {
		this.lock = true;
	}

	hideControls() {
		if (!this.lock && this.isPlaying()) {
			this.dispatchEvent('controls', false);
			this.dispatchEvent('show-menu', false);
			setTimeout(() => {
				this.controlsVisible = false;
			}, 100);
		}
	};

	showControls() {
		this.dispatchEvent('controls', true);
		setTimeout(() => {
			this.controlsVisible = true;
		}, 600);
	}

	dynamicControls() {
		this.showControls();
		clearTimeout(this.timer);
		if (!this.lock) {
			this.timer = setTimeout(this.hideControls.bind(this), this.options.controlsTimeout ?? 3500);
		}
	};

	buildUI() {
		const overlay = document.createElement('div');
		overlay.id = 'overlay';

		this.addClasses(overlay, this.overlayStyles);

		this.dispatchEvent('overlay', overlay);

		this.overlay = overlay;

		if (!this.getElement().querySelector('#overlay')) {
			this.getElement().prepend(overlay);
		}

		overlay.onmousemove = () => {
			this.dynamicControls();
		};

		overlay.onmouseout = (e) => {
			const playerRect = this.getElement().getBoundingClientRect();

			if (e.x > playerRect.left && e.x < playerRect.right && e.y > playerRect.top && e.y < playerRect.bottom) return;

			this.hideControls();
		};

		overlay.ondragstart = () => {
			return false;
		};
		overlay.ondrop = () => {
			return false;
		};

		const topBar = this.createTopBar(overlay);

		this.createCenter(overlay);

		this.bottomBar = this.createBottomBar(overlay);

		this.topRow = this.createTopRow(this.bottomBar);

		const bottomRow = this.createBottomRow(this.bottomBar);

		['mouseover', 'touchstart'].forEach((event) => {
			bottomRow.addEventListener(event, () => {
				this.lockControls();
			});
		});
		['mouseleave', 'touchend'].forEach((event) => {
			bottomRow.addEventListener(event, () => {
				this.unlockControls();
			});
		});

		this.createBackButton(topBar);

		this.createProgressBar(this.topRow);

		this.createPlaybackButton(bottomRow);

		this.createVolumeButton(bottomRow);

		this.createPreviousButton(bottomRow);

		this.createSeekBackButton(bottomRow);

		this.createSeekForwardButton(bottomRow);

		this.createNextButton(bottomRow);

		this.createTime(bottomRow, 'current', ['nm-ml-2']);
		this.createDivider(bottomRow);
		this.createTime(bottomRow, 'remaining', ['mr-2']);

		this.createTheaterButton(bottomRow);
		this.createPIPButton(bottomRow);

		this.createPlaylistsButton(bottomRow);
		// this.createSpeedButton(bottomRow);
		this.createCaptionsButton(bottomRow);
		this.createAudioButton(bottomRow);
		this.createQualityButton(bottomRow);
		this.createSettingsButton(bottomRow);

		this.createFullscreenButton(bottomRow);

		const frame = this.createMenuFrame(bottomRow);

		this.createMainMenu(frame);

		this.createToolTip(overlay);

		this.createEpisodeTip(overlay);

		this.createNextUp(overlay);

		this.modifySpinner(overlay);
	}

	createTopBar(parent: HTMLElement) {
		const topBar = document.createElement('div');
		topBar.id = 'top-bar';
		topBar.style.transform = 'translateY(0)';

		this.topBarStyles.push('top-bar');
		this.addClasses(topBar, this.topBarStyles);

		this.on('controls', (showing) => {
			if (showing) {
				topBar.style.transform = 'translateY(0)';
			} else {
				topBar.style.transform = '';
			}
		});

		parent.appendChild(topBar);

		return topBar;
	}

	createCenter(parent: HTMLElement) {
		const center = document.createElement('div');
		center.id = 'center';

		this.addClasses(center, this.centerStyles);

		['click', 'touchstart', 'touchend', 'mousemove'].forEach((event) => {
			center.addEventListener(event, (e) => {
				if (!this.isMobile()) return;

				e.stopPropagation();
				this.dynamicControls();
			});
		});

		this.createOverlayCenterMessage(center);
		this.createTouchSeekBack(center, { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } });
		this.createTouchPlayback(center, { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } });
		this.createTouchSeekForward(center, { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } });
		this.createTouchVolUp(center, { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } });
		this.createTouchVolDown(center, { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } });

		parent.appendChild(center);

		return center;

	}

	createTouchSeekBack(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchSeekBack = this.createTouchBox(parent, 'touchSeekBack', position);
		['click'].forEach((event) => {
			touchSeekBack.addEventListener(event, this.doubleTap(() => {
				this.rewindVideo();
			}));
		});

		this.createSeekRipple(touchSeekBack, 'left');

		return touchSeekBack;

	}

	createTouchSeekForward(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchSeekForward = this.createTouchBox(parent, 'touchSeekForward', position);
		['mouseup', 'touchend'].forEach((event) => {
			touchSeekForward.addEventListener(event, this.doubleTap(() => {
				this.forwardVideo();
			}));
		});

		this.createSeekRipple(touchSeekForward, 'right');

		return touchSeekForward;
	}

	createTouchPlayback(parent: HTMLElement, position: Position) {
		const touchPlayback = this.createTouchBox(parent, 'touchPlayback', position);
		this.addClasses(touchPlayback, this.touchPlaybackStyles);

		// touchPlayback.addEventListener('click', () => {
		// 	this.togglePlayback();
		// });
		['click'].forEach((event) => {
			touchPlayback.addEventListener(event, this.doubleTap(
				() => this.toggleFullscreen(),
				() => {
					this.controlsVisible && this.togglePlayback();
				}
			));
		});

		// if (this.isMobile()) {
			const playButton = this.createSVGElement(touchPlayback, 'bigPlay', this.buttons.bigPlay);
			this.addClasses(playButton, this.touchPlaybackButtonStyles);

			this.on('pause', () => {
				playButton.style.display = 'flex';
			});
			this.on('play', () => {
				playButton.style.display = 'none';
			});
		// }

		return touchPlayback;
	}

	createTouchVolUp(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchVolUp = this.createTouchBox(parent, 'touchVolUp', position);
		['click'].forEach((event) => {
			touchVolUp.addEventListener(event, this.doubleTap(() => {
				this.volumeUp();
			}));
		});

		return touchVolUp;
	}

	createTouchVolDown(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchVolDown = this.createTouchBox(parent, 'touchVolDown', position);
		['click'].forEach((event) => {
			touchVolDown.addEventListener(event, this.doubleTap(() => {
				this.volumeDown();
			}));
		});

		return touchVolDown;
	}

	createTouchBox(parent: HTMLElement, id: string, position: Position) {
		const touch = document.createElement('div');
		touch.id = `touch-box-${id}`;

		this.addClasses(touch, [`touch-box-${id}`]);

		touch.style.gridColumnStart = position.x.start.toString();
		touch.style.gridColumnEnd = position.x.end.toString();
		touch.style.gridRowStart = position.y.start.toString();
		touch.style.gridRowEnd = position.y.end.toString();

		parent.appendChild(touch);

		return touch;

	}

	createBottomBar(parent: HTMLElement) {
		const bottomBar = document.createElement('div');
		bottomBar.id = 'bottom-bar';
		bottomBar.style.transform = 'translateY(0)';

		this.bottomBarStyles.push('bottom-bar');
		this.addClasses(bottomBar, this.bottomBarStyles);

		parent.appendChild(bottomBar);

		this.on('controls', (showing) => {
			if (showing) {
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
			this.addClasses(divider, this.dividerStyles);
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
			...this.svgSizeStyles,
			hidden ? 'nm-hidden' : 'nm-flex',
		]);

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', icon.normal);
		this.addClasses(path, [
			'group-hover/button:nm-hidden',
			'group-hover/volume:nm-hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', icon.hover);
		this.addClasses(path2, [
			'nm-hidden',
			'group-hover/button:nm-flex',
			'group-hover/volume:nm-flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button')) {
			parent.addEventListener('mouseenter', () => {
				if (icon.title.length == 0 || (['Next', 'Previous'].includes(icon.title) && this.hasNextTip)) return;

				const text = `${icon.title} ${this.getButtonKeyCode(id)}`;

				const playerRect = this.getElement().getBoundingClientRect();
				const tipRect = parent.getBoundingClientRect();

				let x = Math.abs(playerRect.left - (tipRect.left + (tipRect.width * 0.5)) - (text.length * 0.5));
				const y = Math.abs(playerRect.bottom - (tipRect.bottom + (tipRect.height * 1.2)));

				if (x < 35) {
					x = 35;
				}

				if (x > playerRect.right - 160) {
					x = playerRect.right - 160;
				}

				this.dispatchEvent('show-tooltip', {
					text: text,
					position: 'bottom',
					x: `${x}px`,
					y: `-${y}px`,
				});

			});

			parent.addEventListener('mouseleave', () => {
				this.dispatchEvent('hide-tooltip');
			});
		}

		parent.appendChild(svg);
		return svg;

	}

	getButtonKeyCode(id: string) {

		switch (id) {
			case 'play':
			case 'pause':
				return `(${this.localize('SPACE')})`;
			case 'volumeMuted':
				return '(m)';
			case 'volumeLow':
			case 'volumeMedium':
			case 'volumeHigh':
				return '(^v)';
			case 'seekBack':
				return '(<)';
			case 'seekForward':
				return '(>)';
			case 'next':
				return '(n)';
			case 'theater':
				return '(t)';
			case 'theater-enabled':
				return '(t)';
			case 'pip-enter':
			case 'pip-exit':
				return '(i)';
			case 'playlist':
				return '';
			case 'previous':
				return '(p)';
			case 'speed':
				return '';
			case 'subtitle':
			case 'subtitled':
				return '(c)';
			case 'settings':
				return '';
			case 'fullscreen-enable':
			case 'fullscreen':
				return '(f)';
			default:
				return '';
		}

	};

	createButton(parent: HTMLElement, icon: string) {
		const button = document.createElement('button');

		button.id = icon;
		button.type = 'button';
		button.ariaLabel = this.buttons[icon]?.title;

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
			this.dispatchEvent('hide-tooltip');
			if (this.menuOpen && this.mainMenuOpen) {
				this.dispatchEvent('show-menu', false);
			} else if (!this.menuOpen && this.mainMenuOpen) {
				this.dispatchEvent('show-menu', true);
			} else if (this.menuOpen && !this.mainMenuOpen) {
				this.dispatchEvent('show-main-menu', true);
				this.dispatchEvent('show-menu', true);
			} else {
				this.dispatchEvent('show-main-menu', true);
				this.dispatchEvent('show-menu', true);
			}
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
			this.dispatchEvent('hide-tooltip');
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
		playbackButton.ariaLabel = this.buttons.play?.title;

		const pausedButton = this.createSVGElement(playbackButton, 'paused', this.buttons.play);
		const playButton = this.createSVGElement(playbackButton, 'playing', this.buttons.pause, true);

		playbackButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.togglePlayback();
			this.dispatchEvent('hide-tooltip');
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
		if (this.isMobile()) return;
		const seekBack = this.createButton(
			parent,
			'seekBack'
		);

		this.createSVGElement(seekBack, 'seekBack', this.buttons.seekBack);

		seekBack.addEventListener('click', () => {
			this.dispatchEvent('hide-tooltip');
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
		if (this.isMobile()) return;
		const seekForward = this.createButton(
			parent,
			'seekForward'
		);

		this.createSVGElement(seekForward, 'seekForward', this.buttons.seekForward);

		seekForward.addEventListener('click', () => {
			this.dispatchEvent('hide-tooltip');
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

	createTime(parent: HTMLDivElement, type: 'current' | 'remaining' | 'duration', classes: string[]) {
		const time = document.createElement('div');
		time.textContent = '00:00';

		this.addClasses(time, [
			...classes,
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
				time.style.display = '';
			}
		});

		parent.append(time);
		return time;
	}

	createVolumeButton(parent: HTMLDivElement) {
		if (this.isMobile()) return;

		const volumeContainer = document.createElement('div');

		this.addClasses(volumeContainer, this.volumeContainerStyles);

		const volumeButton = this.createButton(
			volumeContainer,
			'volume'
		);
		volumeButton.ariaLabel = this.buttons.volumeHigh?.title;

		const volumeSlider = document.createElement('input');
		volumeSlider.type = 'range';
		volumeSlider.min = '0';
		volumeSlider.max = '100';
		volumeSlider.step = '1';
		volumeSlider.value = this.getVolume().toString();
		volumeSlider.style.backgroundSize = `${this.getVolume()}% 100%`;

		this.addClasses(volumeSlider, this.volumeSliderStyles);

		volumeContainer.append(volumeSlider);

		const mutedButton = this.createSVGElement(volumeButton, 'volumeMuted', this.buttons.volumeMuted, true);
		const lowButton = this.createSVGElement(volumeButton, 'volumeLow', this.buttons.volumeLow, true);
		const mediumButton = this.createSVGElement(volumeButton, 'volumeMedium', this.buttons.volumeMedium, true);
		const highButton = this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh);

		volumeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleMute();
			this.dispatchEvent('hide-tooltip');
		});

		volumeSlider.addEventListener('input', (event) => {
			event.stopPropagation();
			const newVolume = Math.floor(parseInt(volumeSlider.value, 10));
			volumeSlider.style.backgroundSize = `${newVolume}% 100%`;
			this.setVolume(newVolume);
		});

		volumeContainer.addEventListener('wheel', (event) => {
			event.preventDefault();
			const delta = (event.deltaY === 0) ? -event.deltaX : -event.deltaY;
			if (delta === 0) {
				return;
			}

			volumeSlider.style.backgroundSize = `${volumeSlider.value}% 100%`;
			volumeSlider.value = (parseFloat(volumeSlider.value) + (delta * 0.50)).toString();
			this.setVolume(parseFloat(volumeSlider.value));
		});

		this.on('volume', (data) => {
			this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			volumeSlider.style.backgroundSize = `${data.volume}% 100%`;
		});

		this.on('mute', (data) => {
			this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			if (data.mute) {
				volumeSlider.style.backgroundSize = `${0}% 100%`;
			} else {
				volumeSlider.style.backgroundSize = `${this.getVolume()}% 100%`;
			}
		});

		parent.append(volumeContainer);
		return volumeContainer;
	}

	volumeHandle(
		data: VolumeState,
		mutedButton: SVGSVGElement,
		lowButton: SVGSVGElement,
		mediumButton: SVGSVGElement,
		highButton: SVGSVGElement
	) {
		if (this.isMuted() || data.volume == 0) {
			lowButton.style.display = 'none';
			mediumButton.style.display = 'none';
			highButton.style.display = 'none';
			mutedButton.style.display = 'flex';
		} else if (data.volume <= 30) {
			mediumButton.style.display = 'none';
			highButton.style.display = 'none';
			mutedButton.style.display = 'none';
			lowButton.style.display = 'flex';
		} else if (data.volume <= 60) {
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
	}

	createPreviousButton(parent: HTMLDivElement) {
		if (this.isMobile()) return;
		const previousButton = this.createButton(
			parent,
			'previous'
		);
		previousButton.style.display = 'none';

		this.createSVGElement(previousButton, 'previous', this.buttons.previous);

		previousButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.previous();
			this.dispatchEvent('hide-tooltip');
		});
		this.on('item', () => {
			if (this.getPlaylistIndex() > 0) {
				previousButton.style.display = 'flex';
			} else {
				previousButton.style.display = 'none';
			}
		});

		this.on('pip', (data) => {
			if (data) {
				previousButton.style.display = 'none';
			} else if (this.getPlaylistIndex() == 0) {
				previousButton.style.display = 'flex';
			}
		});

		previousButton.addEventListener('mouseenter', () => {
			const { x, y } = this.mousePosition(previousButton, parent);

			this.dispatchEvent('show-episode-tip', {
				direction: 'previous',
				position: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		previousButton.addEventListener('mouseleave', () => {
			this.dispatchEvent('hide-episode-tip');
		});

		parent.appendChild(previousButton);
		return previousButton;
	}

	mousePosition(element: HTMLElement, parent: HTMLElement, offset = 60) {
		const playerRect = element.getBoundingClientRect();
		const tipRect = parent.getBoundingClientRect();

		let x = Math.abs((tipRect.left - playerRect.left) + 100);
		const y = Math.abs((tipRect.bottom - playerRect.bottom) - 60);

		if (x < 30) {
			x = 30;
		}

		if (x > playerRect.right - offset) {
			x = playerRect.right - offset;
		}

		return {
			x,
			y,
		};
	}

	createNextButton(parent: HTMLDivElement) {
		const nextButton = this.createButton(
			parent,
			'next'
		);
		nextButton.style.display = 'none';
		this.hasNextTip = true;

		this.createSVGElement(nextButton, 'next', this.buttons.next);

		nextButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.next();
			this.dispatchEvent('hide-tooltip');
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

		nextButton.addEventListener('mouseenter', () => {

			const { x, y } = this.mousePosition(nextButton, parent);

			this.dispatchEvent('show-episode-tip', {
				direction: 'next',
				position: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		nextButton.addEventListener('mouseleave', () => {
			this.dispatchEvent('hide-episode-tip');
		});

		parent.appendChild(nextButton);
		return nextButton;
	}

	createCaptionsButton(parent: HTMLElement) {
		const captionButton = this.createButton(
			parent,
			'subtitles'
		);
		captionButton.style.display = 'none';
		captionButton.ariaLabel = this.buttons.subtitles?.title;

		const offButton = this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitlesOff);
		const onButton = this.createSVGElement(captionButton, 'subtitled', this.buttons.subtitles, true);

		captionButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.dispatchEvent('hide-tooltip');

			if (this.subtitlesMenuOpen) {
				this.dispatchEvent('show-menu', false);
			} else {
				this.dispatchEvent('show-subtitles-menu', true);
			}

			// if (this.subsEnabled) {
			// 	this.subsEnabled = false;
			// 	onButton.style.display = 'none';
			// 	offButton.style.display = 'flex';
			// 	this.setTextTrack(-1);
			// } else {
			// 	this.subsEnabled = true;
			// 	offButton.style.display = 'none';
			// 	onButton.style.display = 'flex';
			// 	this.setTextTrack(this.getTextTrackIndexBy('eng', 'full', 'ass'));
			// }

			// this.toggleLanguage();
		});

		this.on('captions', (data) => {
			if (data.tracks.length > 0) {
				captionButton.style.display = 'flex';
			} else {
				captionButton.style.display = 'none';
			}
		});
		this.on('caption-change', (data) => {
			if (data.track == -1) {
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
			} else {
				onButton.style.display = 'flex';
				offButton.style.display = 'none';
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

	createAudioButton(parent: HTMLElement) {
		const audioButton = this.createButton(
			parent,
			'audio'
		);
		audioButton.style.display = 'none';
		audioButton.ariaLabel = this.buttons.language?.title;

		this.createSVGElement(audioButton, 'audio', this.buttons.languageOff);

		audioButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.dispatchEvent('hide-tooltip');

			if (this.languageMenuOpen) {
				this.dispatchEvent('show-menu', false);
			} else {
				this.dispatchEvent('show-language-menu', true);
			}
		});
		this.on('audio', (data) => {
			if (data.tracks.length > 1) {
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
			this.dispatchEvent('hide-tooltip');

			if (this.qualityMenuOpen) {
				this.dispatchEvent('show-menu', false);
			} else {
				this.dispatchEvent('show-quality-menu', true);
			}

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

	createTheaterButton(parent: HTMLDivElement) {
		if (this.isMobile()) return;
		const theaterButton = this.createButton(
			parent,
			'theater'
		);

		this.createSVGElement(theaterButton, 'theater', this.buttons.theater);
		this.createSVGElement(theaterButton, 'theater-enabled', this.buttons.theaterExit, true);

		theaterButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.dispatchEvent('hide-tooltip');

			if (this.theaterModeEnabled) {
				this.theaterModeEnabled = false;
				theaterButton.querySelector<any>('.theater-enabled').style.display = 'none';
				theaterButton.querySelector<any>('.theater').style.display = 'flex';
				this.dispatchEvent('theaterMode', false);
				this.dispatchEvent('resize');
			} else {
				this.theaterModeEnabled = true;
				theaterButton.querySelector<any>('.theater').style.display = 'none';
				theaterButton.querySelector<any>('.theater-enabled').style.display = 'flex';
				this.dispatchEvent('theaterMode', true);
				this.dispatchEvent('resize');
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
			this.dispatchEvent('hide-tooltip');
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
			this.dispatchEvent('hide-tooltip');

			if (this.playlistMenuOpen) {
				this.dispatchEvent('show-menu', false);
			} else {
				this.dispatchEvent('show-playlist-menu', true);
			}
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

	// createSpeedButton(parent: HTMLDivElement) {
	// 	if (this.isMobile()) return;
	// 	const speedButton = this.createButton(
	// 		parent,
	// 		'speed'
	// 	);
	//
	// 	if (this.hasSpeeds()) {
	// 		speedButton.style.display = 'flex';
	// 	} else {
	// 		speedButton.style.display = 'none';
	// 	}
	//
	// 	this.createSVGElement(speedButton, 'speed', this.buttons.speed);
	//
	// 	speedButton.addEventListener('click', (event) => {
	// 		event.stopPropagation();
	// 		this.dispatchEvent('hide-tooltip');
	//
	// 		if (this.speedMenuOpen) {
	// 			this.dispatchEvent('show-menu', false);
	// 		} else {
	// 			this.dispatchEvent('show-speed-menu', true);
	// 		}
	// 	});
	//
	// 	this.on('pip', (data) => {
	// 		if (data) {
	// 			speedButton.style.display = 'none';
	// 		} else if (this.hasSpeeds()) {
	// 			speedButton.style.display = 'flex';
	// 		}
	// 	});
	//
	// 	parent.appendChild(speedButton);
	// 	return speedButton;
	// }

	createPIPButton(parent: HTMLDivElement) {
		if (this.isMobile()) return;
		const pipButton = this.createButton(
			parent,
			'pip'
		);

		if (this.hasPIP()) {
			pipButton.style.display = 'flex';
		} else {
			pipButton.style.display = 'none';
		}

		pipButton.ariaLabel = this.buttons.pipEnter?.title;

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true);

		pipButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.dispatchEvent('hide-tooltip');

			if (this.pipEnabled) {
				this.pipEnabled = false;
				pipButton.querySelector<any>('.pip-exit').style.display = 'none';
				pipButton.querySelector<any>('.pip-enter').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipEnter?.title;
				this.dispatchEvent('pip', false);
			} else {
				this.pipEnabled = true;
				pipButton.querySelector<any>('.pip-enter').style.display = 'none';
				pipButton.querySelector<any>('.pip-exit').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipExit?.title;
				this.dispatchEvent('pip', true);
				this.dispatchEvent('show-menu', false);
			}
		});

		this.on('fullscreen', () => {
			if (this.isFullscreen()) {
				pipButton.style.display = 'none';
			} else {
				pipButton.style.display = 'flex';
			}
		});

		parent.appendChild(pipButton);
		return pipButton;
	}

	createMenuFrame(parent: HTMLDivElement) {

		const menuFrame = document.createElement('div');
		menuFrame.id = 'menu-frame';
		this.addClasses(menuFrame, this.menuFrameStyles);

		const menuContent = document.createElement('div');
		menuContent.id = 'menu-content';
		this.addClasses(menuContent, this.menuContentStyles);

		menuContent.style.maxHeight = `${this.getElement().getBoundingClientRect().height - 80}px`;
		this.on('resize', () => {
			this.calcMenu(menuContent);
		});
		this.on('fullscreen', () => {
			this.calcMenu(menuContent);
		});

		menuFrame.appendChild(menuContent);

		this.on('show-menu', (showing) => {
			this.menuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(0);
				menuFrame.style.display = 'flex';
			} else {
				menuFrame.style.display = 'none';
			}
			menuContent.classList.add('nm-translate-x-0');
			menuContent.classList.remove('-nm-translate-x-[50%]');

			this.dispatchEvent('show-language-menu', false);
			this.dispatchEvent('show-subtitles-menu', false);
			this.dispatchEvent('show-quality-menu', false);
			this.dispatchEvent('show-speed-menu', false);
			this.dispatchEvent('show-playlist-menu', false);
		});
		this.on('show-main-menu', (showing) => {
			this.mainMenuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(0);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
				menuContent.classList.add('nm-translate-x-0');
				menuContent.classList.remove('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-language-menu', (showing) => {
			this.languageMenuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(this.getAudioTracks().length);
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-subtitles-menu', (showing) => {
			this.subtitlesMenuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(this.getTextTracks().length + 1);
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-quality-menu', (showing) => {
			this.qualityMenuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(this.getQualities().length);
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-speed-menu', (showing) => {
			this.speedMenuOpen = showing;
			if (showing) {
				// menuContent.style.height = this.growMenu(this.getSpeeds().length);
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-playlist-menu', (showing) => {
			this.calcMenu(menuContent);
			this.playlistMenuOpen = showing;
			if (showing) {
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
				menuFrame.style.width = '96%';
			} else {
				menuFrame.style.width = '';
			}
		});
		this.on('controls', (showing) => {
			if (!showing && !this.lock) {
				this.dispatchEvent('show-menu', false);
				this.dispatchEvent('show-main-menu', false);
				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
			}
		});

		parent.appendChild(menuFrame);
		return menuContent;
	}

	calcMenu(menuContent: HTMLElement) {
		setTimeout(() => {
			menuContent.style.maxHeight = `${this.getElement().getBoundingClientRect().height - 80}px`;
			// menuContent.style.height = `${this.getElement().getBoundingClientRect().height - 80}px`;
			this.dispatchEvent('hide-tooltip');
		}, 0);
	}

	createMainMenu(parent: HTMLDivElement) {

		const main = document.createElement('div');
		main.id = 'main-menu';
		main.style.transform = 'translateX(0)';

		this.addClasses(main, this.mainMenuStyles);

		this.createMenuButton(main, 'language');
		this.createMenuButton(main, 'subtitles');
		this.createMenuButton(main, 'quality');
		this.createMenuButton(main, 'speed');
		this.createMenuButton(main, 'playlist');

		parent.appendChild(main);

		this.createSubMenu(parent);

		return main;
	}

	createSubMenu(parent: HTMLDivElement) {

		const submenu = document.createElement('div');
		submenu.id = 'sub-menu';
		submenu.style.transform = 'translateX(0)';

		this.addClasses(submenu, this.subMenuStyles);

		this.createLanguageMenu(submenu);
		this.createSubtitleMenu(submenu);
		this.createQualityMenu(submenu);
		this.createSpeedMenu(submenu);

		this.once('item', () => {
			this.createEpisodeMenu(submenu);
		});

		parent.appendChild(submenu);

		return submenu;
	}

	createMenuHeader(parent: HTMLDivElement, title: string) {
		const menuHeader = document.createElement('div');
		menuHeader.id = 'menu-header';

		this.addClasses(menuHeader, this.menuHeaderStyles);

		if (title !== 'Episodes') {
			const back = this.createButton(
				menuHeader,
				'back'
			);
			this.createSVGElement(back, 'menu', this.buttons.chevronL);
			this.addClasses(back, ['nm-w-8']);
			back.classList.remove('nm-w-5');

			back.addEventListener('click', (event) => {
				event.stopPropagation();
				this.dispatchEvent('show-main-menu', true);

				this.dispatchEvent('show-language-menu', false);
				this.dispatchEvent('show-subtitles-menu', false);
				this.dispatchEvent('show-quality-menu', false);
				this.dispatchEvent('show-speed-menu', false);
				this.dispatchEvent('show-playlist-menu', false);
			});
		}

		const menuButtonText = document.createElement('span');
		menuButtonText.classList.add('menu-button-text');
		this.addClasses(menuButtonText, this.menuHeaderButtonTextStyles);
		menuHeader.append(menuButtonText);
		menuButtonText.textContent = this.localize(title).toTitleCase();

		// if (title == 'playlist') {
		// 	this.createDropdown(menuHeader, title, `${this.localize('Season')} ${this.getPlaylistItem().season}`);
		// }

		if (title !== 'Seasons') {
			const close = this.createButton(
				menuHeader,
				'close'
			);

			this.createSVGElement(close, 'menu', this.buttons.close);
			this.addClasses(close, ['nm-ml-auto', 'nm-w-8']);
			close.classList.remove('nm-w-5');

			close.addEventListener('click', (event) => {
				event.stopPropagation();
				this.dispatchEvent('show-menu', false);
			});
		}

		parent.append(menuHeader);
		return menuHeader;
	}

	createMenuButton(parent: HTMLDivElement, item: string) {
		const menuButton = document.createElement('div');
		menuButton.id = `menu-button-${item}`;

		this.addClasses(menuButton, this.menuButtonStyles);

		if (item !== 'speed') {
			menuButton.style.display = 'none';
		} else if (this.hasSpeeds()) {
			menuButton.style.display = 'flex';
		} else {
			menuButton.style.display = 'none';
		}

		this.createSVGElement(menuButton, 'menu', this.buttons[item]);

		const menuButtonText = document.createElement('span');
		menuButtonText.classList.add('menu-button-text');
		this.addClasses(menuButtonText, this.menuButtonTextStyles);
		menuButton.append(menuButtonText);
		menuButtonText.textContent = this.localize(item).toTitleCase();

		const chevron = this.createSVGElement(menuButton, 'menu', this.buttons.chevronR);
		this.addClasses(chevron, ['nm-ml-auto']);

		menuButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.dispatchEvent(`show-${item}-menu`, true);
		});

		if (item === 'language') {
			this.on('audio', () => {
				if (this.getAudioTracks().length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} else if (item === 'subtitles') {
			this.on('captions', () => {
				if (this.getTextTracks().length > 0) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});

		} else if (item === 'quality') {
			this.on('quality', () => {
				if (this.getQualities().length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} else if (item === 'playlist') {
            this.once('item', () => {
				if (this.getPlaylist().length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		}

		parent.append(menuButton);
	};

	createLanguageMenu(parent: HTMLDivElement) {
		const languageMenu = document.createElement('div');
		languageMenu.id = 'language-menu';
		this.addClasses(languageMenu, this.subMenuContentStyles);

		this.createMenuHeader(languageMenu, 'Language');

		const scrollContainer = document.createElement('div');
		scrollContainer.id = 'language-scroll-container';
		scrollContainer.style.transform = 'translateX(0)';

		this.addClasses(scrollContainer, this.scrollContainerStyles);
		languageMenu.appendChild(scrollContainer);

		this.on('audio', (event) => {
			scrollContainer.innerHTML = '';
			for (const [index, track] of event.tracks?.entries() ?? []) {
				this.createLanguageMenuButton(scrollContainer, {
					language: track.language,
					label: track.name ?? track.label,
					type: 'audio',
					index: track.hlsjsIndex ?? index,
				});
			}
		});

		this.on('show-language-menu', (showing) => {
			if (showing) {
				languageMenu.style.display = 'flex';
			} else {
				languageMenu.style.display = 'none';
			}
		});

		parent.appendChild(languageMenu);
		return languageMenu;
	}

	createSubtitleMenu(parent: HTMLDivElement) {
		const subtitleMenu = document.createElement('div');
		subtitleMenu.id = 'subtitle-menu';
		this.addClasses(subtitleMenu, this.subMenuContentStyles);

		this.createMenuHeader(subtitleMenu, 'subtitles');

		const scrollContainer = document.createElement('div');
		scrollContainer.id = 'language-scroll-container';
		scrollContainer.style.transform = 'translateX(0)';

		this.addClasses(scrollContainer, this.scrollContainerStyles);
		subtitleMenu.appendChild(scrollContainer);

		this.on('captions', (event) => {
			scrollContainer.innerHTML = '';
			for (const track of event.tracks ?? []) {
				this.createLanguageMenuButton(scrollContainer, {
					language: track.language,
					label: track.label,
					type: 'subtitle',
					index: event.tracks.indexOf(track),
					styled: (track.src ?? track.id).endsWith('.ass'),
				});
			}
		});

		this.on('show-subtitles-menu', (showing) => {
			if (showing) {
				subtitleMenu.style.display = 'flex';
			} else {
				subtitleMenu.style.display = 'none';
			}
		});

		parent.appendChild(subtitleMenu);
		return subtitleMenu;
	}

	createSpeedMenu(parent: HTMLDivElement) {
		const speedMenu = document.createElement('div');
		speedMenu.id = 'speed-menu';
		this.addClasses(speedMenu, this.subMenuContentStyles);

		this.createMenuHeader(speedMenu, 'speed');

		const scrollContainer = document.createElement('div');
		scrollContainer.id = 'speed-scroll-container';
		scrollContainer.style.transform = 'translateX(0)';

		this.addClasses(scrollContainer, this.scrollContainerStyles);
		speedMenu.appendChild(scrollContainer);

		for (const speed of this.getSpeeds() ?? []) {
			const speedButton = document.createElement('div');
			speedButton.id = `speed-button-${speed}`;

			this.addClasses(speedButton, this.menuButtonStyles);

			const spanChild = document.createElement('div');
			speedButton.append(spanChild);

			const speedButtonText = document.createElement('span');
			speedButtonText.classList.add('menu-button-text');
			this.addClasses(speedButtonText, this.speedButtonTextStyles);

			speedButtonText.textContent = speed == 1 ? this.localize('Normal') : speed.toString();
			speedButton.append(speedButtonText);

			const chevron = this.createSVGElement(speedButton, 'menu', this.buttons.checkmark);
			this.addClasses(chevron, [
				'nm-ml-auto',
				'nm-hidden',
			]);

			this.on('speed', (event) => {
				if (event === speed) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});

			speedButton.addEventListener('click', () => {
				this.dispatchEvent('show-menu', false);
				this.setSpeed(speed);
			});

			scrollContainer.append(speedButton);
		}

		this.on('show-speed-menu', (showing) => {
			if (showing) {
				speedMenu.style.display = 'flex';
			} else {
				speedMenu.style.display = 'none';
			}
		});

		parent.appendChild(speedMenu);
		return speedMenu;
	}

	createQualityMenu(parent: HTMLDivElement) {
		const qualityMenu = document.createElement('div');
		qualityMenu.id = 'quality-menu';
		this.addClasses(qualityMenu, this.subMenuContentStyles);

		this.createMenuHeader(qualityMenu, 'quality');

		const scrollContainer = document.createElement('div');
		scrollContainer.id = 'quality-scroll-container';
		scrollContainer.style.transform = 'translateX(0)';

		this.addClasses(scrollContainer, this.scrollContainerStyles);
		qualityMenu.appendChild(scrollContainer);

		this.on('show-quality-menu', (showing) => {
			if (showing) {
				qualityMenu.style.display = 'flex';
			} else {
				qualityMenu.style.display = 'none';
			}
		});

		parent.appendChild(qualityMenu);
		return qualityMenu;
	}

	createLanguageMenuButton(parent: HTMLDivElement, data: {language: string, label: string, type: string, index: number, styled?: boolean}) {
		const languageButton = document.createElement('div');
		languageButton.id = `language-button-${data.language}`;

		this.addClasses(languageButton, this.menuButtonStyles);

		const spanChild = document.createElement(data.language == 'off' || data.label.slice(0, 3) == 'Off' || data.label.slice(0, 3) == 'seg' ? 'span' : 'img');
		this.addClasses(spanChild, [
			`${data.type}-active`,
			...this.languageButtonSpanStyles,
		]);

		if (data.language == 'off' || data.label.slice(0, 3) == 'Off' || data.label.slice(0, 3) == 'seg') {
			spanChild.innerHTML = `
				<svg id="${data.type}-${data.index}" class="MuiSvgIcon-root ${data.type}-active" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;">
					<path d="M18.3 5.71a.9959.9959 0 0 0-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" style="fill: currentColor;"></path>
				</svg>
			`;
		} else {
			(spanChild as HTMLImageElement).src = `https://vscode.nomercy.tv/img/flags/${data.language || data.label.slice(0, 3).toLocaleLowerCase()}.svg`;
		}

		languageButton.append(spanChild);

		const languageButtonText = document.createElement('span');
		languageButtonText.classList.add('menu-button-text');
		this.addClasses(languageButtonText, this.menuButtonTextStyles);

		languageButtonText.textContent = `${this.localize(data.label)
			?.replace('segment-metadata', 'Off')}`;
			// ?.replace('segment-metadata', 'Off')} ${data.styled ? '🎨' : ''}`;
		languageButton.append(languageButtonText);

		if (data.styled) {
			this.createSVGElement(languageButtonText, 'styled', this.buttons.styled);
		}

		const chevron = this.createSVGElement(languageButton, 'checkmark', this.buttons.checkmark);
		this.addClasses(chevron, ['nm-ml-auto']);

		if (data.index > 0) {
			chevron.classList.add('nm-hidden');
		}

		if (data.type == 'audio') {
			this.on('audio-change', (audio) => {
				if (audio.currentTrack == data.index) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});
		} else if (data.type == 'subtitle') {
			this.on('caption-change', (track) => {
				if (track.track == data.index || (track.track === -1 && data.index === 0)) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});
		}

		languageButton.addEventListener('click', (event) => {
			event.stopPropagation();

			if (data.type == 'audio') {
				this.setAudioTrack(data.index);
			} else if (data.type == 'subtitle') {
				this.setTextTrack(data.index - 1);
			}

			this.dispatchEvent('show-menu', false);
		});

		parent.append(languageButton);
	}

	createSeekRipple(parent: HTMLDivElement, side: string) {
		const seekRipple = document.createElement('div');
		this.addClasses(seekRipple, ['seek-ripple', side]);

		const arrowHolder = document.createElement('div');
		arrowHolder.classList.add('seek-ripple-arrow');
		seekRipple.append(arrowHolder);

		const text = document.createElement('p');
		text.classList.add('seek-ripple-text');
		seekRipple.append(text);

		if (side == 'left') {
			seekRipple.style.borderRadius = '0 50% 50% 0';
			seekRipple.style.left = '0px';
			arrowHolder.innerHTML = `
				<div class="arrow arrow2 arrow-left"></div>
				<div class="arrow arrow1 arrow-left"></div>
				<div class="arrow arrow3 arrow-left"></div>
			`;
			this.on('rewind', (val: number) => {
				text.textContent = `${Math.abs(val)} ${this.localize('seconds')}`;
				seekRipple.style.display = 'flex';
			});
			this.on('remove-rewind', () => {
				seekRipple.style.display = 'none';
			});
		} else if (side == 'right') {
			seekRipple.style.borderRadius = '50% 0 0 50%';
			seekRipple.style.right = '0px';
			arrowHolder.innerHTML = `
				<div class="arrow arrow3 arrow-right"></div>
				<div class="arrow arrow1 arrow-right"></div>
				<div class="arrow arrow2 arrow-right"></div>
			`;
			this.on('forward', (val: number) => {
				text.textContent = `${Math.abs(val)} ${this.localize('seconds')}`;
				seekRipple.style.display = 'flex';
			});
			this.on('remove-forward', () => {
				seekRipple.style.display = 'none';
			});
		}

		parent.append(seekRipple);
	};

	createProgressBar(parent: HTMLDivElement) {

		this.sliderBar = document.createElement('div');
		this.addClasses(this.sliderBar, this.sliderBarStyles);
		this.progressBar = this.sliderBar;

		const sliderBuffer = document.createElement('div');
		sliderBuffer.id = 'slider-buffer';
		this.addClasses(sliderBuffer, this.sliderBufferStyles);
		this.sliderBar.append(sliderBuffer);

		const sliderHover = document.createElement('div');
		sliderHover.id = 'slider-hover';
		this.addClasses(sliderHover, this.sliderHoverStyles);
		this.sliderBar.append(sliderHover);

		const sliderProgress = document.createElement('div');
		sliderProgress.id = 'slider-progress';
		this.addClasses(sliderProgress, this.sliderProgressStyles);
		this.sliderBar.append(sliderProgress);

		this.on('chapters', () => {
			if (this.getChapters()?.length > 0) {
				sliderProgress.classList.remove('nm-bg-purple-600');
				sliderBuffer.classList.remove('nm-bg-purple-900/50');
			} else {
				sliderProgress.classList.add('nm-bg-purple-600');
				sliderBuffer.classList.add('nm-bg-purple-900/50');
			}
		});

		this.chapterBar = document.createElement('div');
		this.chapterBar.id = 'chapter-progress';
		this.addClasses(this.chapterBar, this.chapterBarStyles);
		this.sliderBar.append(this.chapterBar);

		const sliderNipple = document.createElement('div');
		this.addClasses(sliderNipple, this.sliderNippleStyles);
		sliderNipple.id = 'slider-nipple';

		if (this.options.nipple) {
			this.sliderBar.append(sliderNipple);
		}

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

		this.sliderBar.append(sliderPop);

		if (this.options.chapters != false) {
			this.sliderBar.style.background = 'transparent';
		}

		['mousemove', 'touchmove'].forEach((event) => {
			this.sliderBar.addEventListener(event, (e: any) => {
				const scrubTime = this.#getScrubTime(e);
				this.#getSliderPopImage(scrubTime);
				sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);

				const sliderPopOffsetX = this.#getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;

				if (this.options.chapters == false) {
					sliderHover.style.width = `${scrubTime.scrubTime}%`;
				}

				if (!this.isMouseDown) return;

				chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
				sliderNipple.style.left = `${scrubTime.scrubTime}%`;
				if (this.previewTime.length > 0) {
					sliderPop.style.setProperty('--visibility', '1');
				}
			});
		});
		['mousedown', 'touchstart'].forEach((event) => {
			this.sliderBar.addEventListener(event, () => {
				if (this.isMouseDown) return;

				this.isMouseDown = true;
				this.isScrubbing = true;
			});
		});

		this.sliderBar.addEventListener('mouseover', (e: MouseEvent) => {
			const scrubTime = this.#getScrubTime(e);
			this.#getSliderPopImage(scrubTime);
			sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);
			chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
			if (this.previewTime.length > 0) {
				sliderPop.style.setProperty('--visibility', '1');
				const sliderPopOffsetX = this.#getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;
			}
		});

		this.sliderBar.addEventListener('mouseleave', () => {
			sliderPop.style.setProperty('--visibility', '0');
			sliderHover.style.width = '0';
		});

		this.bottomBar.addEventListener('click', (e: any) => {
			this.dispatchEvent('hide-tooltip');
			if (!this.isMouseDown) return;

			this.isMouseDown = false;
			this.isScrubbing = false;
			sliderPop.style.setProperty('--visibility', '0');
			const scrubTime = this.#getScrubTime(e);
			sliderNipple.style.left = `${scrubTime.scrubTime}%`;
			this.seek(scrubTime.scrubTimePlayer);
		});

		this.on('seeked', () => {
			sliderPop.style.setProperty('--visibility', '0');
		});

		this.on('item', () => {
			this.sliderBar.classList.add('nm-bg-white/40');
			this.previewTime = [];
			this.chapters = [];
		});

		this.on('chapters', () => {
			setTimeout(() => {
				if (this.getChapters()?.length > 0) {
					this.sliderBar.classList.remove('nm-bg-white/40');
				} else {
					this.sliderBar.classList.add('nm-bg-white/40');
				}
			}, 0);
		});

		this.on('time', (data) => {
			if (this.getChapters()?.length == 0) {
				sliderBuffer.style.width = `${data.buffered}%`;
				sliderProgress.style.width = `${data.percentage}%`;
			}
			if (!this.isScrubbing) {
				sliderNipple.style.left = `${data.percentage}%`;
			}
		});

		this.on('controls', (showing) => {
			if (!showing) {
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

		parent.append(this.sliderBar);
		return this.sliderBar;
	}

	#getChapterText(scrubTimePlayer: number): string | null {
		if (this.getChapters().length == 0) return null;

		const index = this.getChapters()?.findIndex((chapter: Chapter) => {
			return chapter.startTime > scrubTimePlayer;
		});

		return this.getChapters()[index - 1]?.title
			?? this.getChapters()[this.getChapters()?.length - 1]?.title
			?? null;
	}

	createChapterMarker(chapter: Chapter) {
		const chapterMarker = document.createElement('div');
		chapterMarker.id = `chapter-marker-${chapter.id.replace(/\s/gu, '-')}`;
		chapterMarker.style.left = `${chapter.left}%`;
		chapterMarker.style.width = `calc(${chapter.width}% - 2px)`;

		this.addClasses(chapterMarker, this.chapterMarkersStyles);

		const chapterMarkerBG = document.createElement('div');
		chapterMarkerBG.id = `chapter-marker-bg-${chapter.id.replace(/\s/gu, '-')}`;
		this.addClasses(chapterMarkerBG, this.chapterMarkerBGStyles);
		chapterMarker.append(chapterMarkerBG);

		const chapterMarkerBuffer = document.createElement('div');
		chapterMarkerBuffer.id = `chapter-marker-hover-${chapter.id.replace(/\s/gu, '-')}`;
		this.addClasses(chapterMarkerBuffer, this.chapterMarkerBufferStyles);
		chapterMarker.append(chapterMarkerBuffer);

		const chapterMarkerHover = document.createElement('div');
		chapterMarkerHover.id = 'chapterMarker-hover';
		this.addClasses(chapterMarkerHover, this.chapterMarkerHoverStyles);
		chapterMarker.append(chapterMarkerHover);

		const chapterMarkerProgress = document.createElement('div');
		chapterMarkerProgress.id = `chapter-marker-progress-${chapter.id.replace(/\s/gu, '-')}`;
		this.addClasses(chapterMarkerProgress, this.chapterMarkerProgressStyles);
		chapterMarker.append(chapterMarkerProgress);

		const left = chapter.left;
		const right = chapter.left + chapter.width;

		this.on('time', (data) => {
			if (data.percentage < left) {
				chapterMarkerProgress.style.transform = 'scaleX(0)';
			} else if (data.percentage > right) {
				chapterMarkerProgress.style.transform = 'scaleX(1)';
			} else {
				chapterMarkerProgress.style.transform = `scaleX(${(data.percentage - left) / (right - left)})`;
			}

			if (data.buffered < left) {
				chapterMarkerBuffer.style.transform = 'scaleX(0)';
			} else if (data.buffered > right) {
				chapterMarkerBuffer.style.transform = 'scaleX(1)';
			} else {
				chapterMarkerBuffer.style.transform = `scaleX(${(data.buffered - left) / (right - left)})`;
			}
		});

		['mousemove', 'touchmove'].forEach((event) => {
			this.chapterBar.addEventListener(event, (e: any) => {
				const { scrubTime } = this.#getScrubTime(e);

				if (scrubTime < left) {
					chapterMarkerHover.style.transform = 'scaleX(0)';
				} else if (scrubTime > right) {
					chapterMarkerHover.style.transform = 'scaleX(1)';
				} else {
					chapterMarkerHover.style.transform = `scaleX(${(scrubTime - left) / (right - left)})`;
				}

			});
		});

		this.chapterBar.addEventListener('mouseleave', () => {
			chapterMarkerHover.style.transform = 'scaleX(0)';
		});

		this.chapterBar.append(chapterMarker);
		return chapterMarker;
	}

	createChapterMarkers() {
		this.chapterBar.querySelectorAll('.chapter-marker').forEach((element) => {
			this.sliderBar.classList.add('nm-bg-white/40');
			element.remove();
		});
		this.getChapters()?.forEach((chapter: Chapter) => {
			this.createChapterMarker(chapter);
		});
	}

	#getSliderPopOffsetX(sliderPop: HTMLDivElement, scrubTime: any) {
		const sliderBarRect = this.sliderBar.getBoundingClientRect();
		const sliderPopRect = sliderPop.getBoundingClientRect();
		const sliderPopPercentageWidth = ((sliderPopRect.width * 0.5) / sliderBarRect.width) * 100;
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
			const image = this.getSpriteFile();
			if (image) {
				this.sliderPopImage.style.backgroundImage = `url('${image}')`;
			}
			const file = this.getTimeFile();
			if (file && this.currentTimeFile !== file) {
				this.currentTimeFile = file;
				this.getFileContents({
					url: file,
					options: {},
					callback: (data: string) => {
						// eslint-disable-next-line max-len
						const regex
							= /(\d{2}:\d{2}:\d{2})\.\d{3}\s-->\s(\d{2}:\d{2}:\d{2})\.\d{3}\nsprite\.webp#(xywh=\d+,\d+,\d+,\d+)/gmu;

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
				}).then(() => {
					// this.#fetchSliderPopImage(scrubTime);
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
			this.sliderPopImage.style.backgroundPosition = `-${img.x}px -${img.y}px`;
			this.sliderPopImage.style.width = `${img.w}px`;
			this.sliderPopImage.style.height = `${img.h}px`;
		}
	}

	#getScrubTime(e: any, parent = this.sliderBar) {
		const elementRect = parent.getBoundingClientRect();

		const x = e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;

		let offsetX = x - elementRect.left;
		if (offsetX <= 0) offsetX = 0;
		if (offsetX >= elementRect.width) offsetX = elementRect.width;
		return {
			scrubTime: (offsetX / parent.offsetWidth) * 100,
			scrubTimePlayer: (offsetX / parent.offsetWidth) * this.duration(),
		};
	}

	createOverlayCenterMessage (parent: HTMLDivElement) {
		const playerMessage = document.createElement('div');

		playerMessage.id = 'player-message';
		this.addClasses(playerMessage, this.playerMessageStyles);
		playerMessage.classList.add('player-message');

		this.on('display-message', (val: string | null) => {
			playerMessage.style.display = 'flex';
			playerMessage.textContent = val;
		});
		this.on('remove-message', () => {
			playerMessage.style.display = 'none';
			playerMessage.textContent = '';
		});

		parent.append(playerMessage);

		return playerMessage;
	};


	createEpisodeMenu(parent: HTMLDivElement) {

		const playlistMenu = document.createElement('div');
		playlistMenu.id = 'playlist-menu';
		this.addClasses(playlistMenu, [
			...this.subMenuContentStyles,
			'!nm-flex-row',
			'!nm-gap-0',
		]);
		parent.appendChild(playlistMenu);

		const seasonsMenu = document.createElement('div');
		seasonsMenu.id = 'season-menu';
		this.addClasses(seasonsMenu, [
			...this.subMenuContentStyles,
			'!nm-flex',
			'!nm-w-1/3',
			'nm-border-r-2',
			'nm-border-gray-500/20',
		]);
		playlistMenu.appendChild(seasonsMenu);

		this.createMenuHeader(seasonsMenu, 'Seasons');

		const seasonScrollContainer = document.createElement('div');
		seasonScrollContainer.id = 'playlist-scroll-container';
		seasonScrollContainer.style.transform = 'translateX(0)';

		this.addClasses(seasonScrollContainer, this.scrollContainerStyles);
		seasonsMenu.appendChild(seasonScrollContainer);

		seasonScrollContainer.innerHTML = '';
		for (const [, item] of this.unique(this.getPlaylist(), 'season').entries() ?? []) {
			this.createSeasonMenuButton(seasonScrollContainer, item);
		}

		const episodeMenu = document.createElement('div');
		episodeMenu.id = 'episode-menu';
		this.addClasses(episodeMenu, [
			...this.subMenuContentStyles,
			'!nm-flex',
			'!nm-w/2/3',
		]);
		playlistMenu.appendChild(episodeMenu);

		this.createMenuHeader(episodeMenu, 'Episodes');

		const scrollContainer = document.createElement('div');
		scrollContainer.id = 'playlist-scroll-container';
		scrollContainer.style.transform = 'translateX(0)';

		this.addClasses(scrollContainer, this.scrollContainerStyles);
		episodeMenu.appendChild(scrollContainer);

		scrollContainer.innerHTML = '';
		for (const [index, item] of this.getPlaylist().entries() ?? []) {
			this.createEpisodeMenuButton(scrollContainer, item, index);
		}

		this.on('show-playlist-menu', (showing) => {
			if (showing) {
				playlistMenu.style.display = 'flex';
			} else {
				playlistMenu.style.display = 'none';
			}
		});

		return playlistMenu;
	}

	createSeasonMenuButton(parent: HTMLDivElement, item: PlaylistItem) {
		const seasonButton = document.createElement('button');
		seasonButton.id = `season-${item.id}`;
		this.addClasses(seasonButton, this.languageButtonStyles);

		if (this.getPlaylistItem().season === item.season) {
			seasonButton.classList.add('active');
			seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
		} else {
			seasonButton.classList.remove('active');
			seasonButton.style.backgroundColor = '';
		}

		this.on('item', () => {
			if (this.getPlaylistItem().season === item.season) {
				seasonButton.classList.add('active');
				seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
			} else {
				seasonButton.classList.remove('active');
				seasonButton.style.backgroundColor = '';
			}
		});
		this.on('switch-season', (season) => {
			if (season === item.season) {
				seasonButton.classList.add('active');
				seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
			} else {
				seasonButton.classList.remove('active');
				seasonButton.style.backgroundColor = '';
			}
		});

		const buttonSpan = document.createElement('span');
		buttonSpan.id = `season-${item.id}-span`;
		this.addClasses(seasonButton, this.menuButtonStyles);
		seasonButton.appendChild(buttonSpan);

		buttonSpan.innerText = `Season ${item.season}`;

		const chevron = this.createSVGElement(seasonButton, 'menu', this.buttons.chevronR);
		this.addClasses(chevron, ['nm-ml-auto']);

		seasonButton.addEventListener('click', () => {
			this.dispatchEvent('switch-season', item.season);
		});

		parent.appendChild(seasonButton);
		return seasonButton;
	}

	createEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number) {
		const button = document.createElement('button');
		button.id = `playlist-${item.id}`;
		if (this.getPlaylistItem().season !== 1) {
			button.style.display = 'none';
		}

		this.addClasses(button, this.playlistMenuButtonStyles);

		const imageBaseUrl = 'https://image.tmdb.org/t/p/w185';

		const leftSide = document.createElement('div');
		leftSide.id = `playlist-${item.id}-left`;
		this.addClasses(leftSide, this.episodeMenuButtonLeftStyles);
		button.append(leftSide);

		const shadow = document.createElement('div');
		shadow.id = `episode-${item.id}-shadow`;
		this.addClasses(shadow, this.episodeMenuButtonShadowStyles);
		shadow.style.margin = item.video_type == 'movie' ? '0px 30%' : '0';
		shadow.style.width = item.video_type == 'movie' ? 'calc(120px / 3 * 2)' : '100%';
		leftSide.append(shadow);

		const image = document.createElement('img');
		image.id = `playlist-${item.id}-image`;
		this.addClasses(image, episodeMenuButtonImageStyles);
		image.setAttribute('loading', 'lazy');
		image.src = item.image && item.image != '' ? `${imageBaseUrl}${item.image}` : '';

		leftSide.append(image);

		const progressContainer = document.createElement('div');
		progressContainer.id = `episode-${item.id}-progress-container`;
		this.addClasses(progressContainer, [
			'progress-container',
			'nm-absolute',
			'nm-bottom-0',
			'nm-w-full',
			'nm-flex',
			'nm-flex-col',
		]);
		leftSide.append(progressContainer);

		const progressContainerItemBox = document.createElement('div');
		progressContainerItemBox.id = `episode-${item.id}-progress-box`;
		this.addClasses(progressContainerItemBox, [
			'progress-box',
			'nm-flex',
			'nm-justify-between',
			'nm-h-full',
			'nm-mx-1',
			'nm-sm:mx-2',
			'nm-mb-1',
		]);

		const progressContainerItemText = document.createElement('div');
		progressContainerItemText.id = `episode-${item.id}-progress-item`;
		this.addClasses(progressContainerItemText, [
			'progress-item',
			'nm-text-[0.7rem]',
			'',
		]);


		progressContainer.append(progressContainerItemBox);
		progressContainerItemText.innerText = `${this.localize('E')}${item.episode}`;
		progressContainerItemBox.append(progressContainerItemText);

		const progressContainerDurationText = document.createElement('div');
		progressContainerDurationText.id = `episode-${item.id}-progress-duration`;
		this.addClasses(progressContainerDurationText, [
			'progress-duration',
			'nm-text-[0.7rem]',
		]);
		progressContainerDurationText.innerText = item.duration?.replace(/^00:/u, '');
		progressContainerItemBox.append(progressContainerDurationText);

		const sliderContainer = document.createElement('div');
		sliderContainer.id = `episode-${item.id}-slider-container`;
		this.addClasses(sliderContainer, [
			'slider-container',
			'nm-rounded-md',
			'nm-overflow-clip',
			'nm-bg-white',
			'nm-h-1',
			'nm-mb-2',
			'nm-mx-1',
			'nm-sm:mx-2',
		]);
		sliderContainer.style.display = item.progress ? 'flex' : 'none';
		progressContainer.append(sliderContainer);

		const progressBar = document.createElement('div');
		progressBar.id = `episode-${item.id}-progress-bar`;
		this.addClasses(progressBar, [
			'progress-bar',
			'nm-bg-purple-400',
			'nm-w-1/2',
		]);
		if (item.progress) {
			progressBar.style.width = `${item.progress > 99 ? 100 : item.progress}%`;
		}
		sliderContainer.append(progressBar);

		const rightSide = document.createElement('div');
		rightSide.id = `playlist-${item.id}-right-side`;
		this.addClasses(rightSide, [
			'playlist-card-right',
			'nm-w-3/4',
			'nm-flex',
			'nm-flex-col',
			'nm-text-left',
			'nm-gap-1',
		]);
		button.append(rightSide);

		const title = document.createElement('span');
		title.id = `playlist-${item.id}-title`;
		this.addClasses(title, [
			'playlist-card-title',
			'nm-font-bold',
			'',
		]);
		title.textContent = this.lineBreakShowTitle(item.title.replace('%S', this.localize('S')).replace('%E', this.localize('E')));
		rightSide.append(title);

		const overview = document.createElement('span');
		overview.id = `playlist-${item.id}-overview`;
		this.addClasses(overview, [
			'playlist-card-overview',
			'nm-text-[0.7rem]',
			'nm-leading-[1rem]',
			'nm-line-clamp-4',
			'',
		]);
		overview.textContent = this.limitSentenceByCharacters(item.description, 600);
		rightSide.append(overview);

		this.on('item', () => {
			if (this.getPlaylistItem().season == item.season) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}

			if (this.getPlaylistItem().season == item.season && this.getPlaylistItem().episode == item.episode) {
				button.style.background = 'rgba(255,255,255,.1)';
			} else {
				button.style.background = 'transparent';
			}
		});

		this.on('switch-season', (season) => {
			if (season == item.season) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		progressContainerItemText.innerText
			= item.season == undefined ? `${item.episode}` : `${this.localize('S')}${item.season}: ${this.localize('E')}${item.episode}`;


		button.addEventListener('click', () => {
			this.dispatchEvent('show-menu', false);

			if (item.episode && item.season) {
				this.setEpisode(item.season, item.episode);
			} else {
				this.setPlaylistItem(index);
			}
			this.dispatchEvent('playlist-menu-button-clicked', item);
		});

		parent.appendChild(button);
		return button;
	}

	createToolTip(parent: HTMLDivElement) {
		this.tooltip = document.createElement('div');
		this.tooltip.id = 'tooltip';
		this.addClasses(this.tooltip, this.tooltipStyles);

		this.tooltip.style.transform = 'translateX(10px)';
		this.tooltip.innerText = 'Play (space)';

		this.on('show-tooltip', (data) => {
			this.tooltip.innerText = data.text;
			this.tooltip.style.display = 'block';
			this.tooltip.style.transform = `translate(calc(${data.x} - 50%), calc(${data.y} - 50%))`;
			if (data.position == 'top') {
				this.tooltip.classList.add('nm-top-0');
				this.tooltip.classList.remove('nm-bottom-0');
			} else {
				this.tooltip.classList.remove('nm-top-0');
				this.tooltip.classList.add('nm-bottom-0');
			}
		});

		this.on('hide-tooltip', () => {
			this.tooltip.style.display = 'none';
		});

		parent.appendChild(this.tooltip);
		return this.tooltip;
	}

	createEpisodeTip(parent: HTMLDivElement) {

		const nextTip = document.createElement('div');
		nextTip.id = 'episode-tip';
		this.addClasses(nextTip, [
			'nm-episode-tip',
			'nm-hidden',
			'nm-absolute',
			'nm-left-0',
			'nm-bottom-10',
			'nm-z-50',
			'!nm-w-96',
			'nm-h-24',
			'nm-px-2',
			'nm-py-2',
			'nm-text-xs',
			'nm-text-white',
			'nm-rounded-lg',
			'nm-font-medium',
			'nm-bg-neutral-900/95',
		]);

		this.addClasses(nextTip, this.playlistMenuButtonStyles);

		const leftSide = document.createElement('div');
		leftSide.id = 'next-tip-left';
		this.addClasses(leftSide, [
			'nm-playlist-card-left',
			'nm-relative',
			'nm-rounded-sm',
			'nm-w-[40%]',
			'nm-overflow-clip',
			'nm-self-center',
			'',
		]);
		nextTip.append(leftSide);

		const image = document.createElement('img');
		image.id = 'next-tip-image';
		this.addClasses(image, [
			'nm-playlist-card-image',
			'nm-w-full',
			'nm-h-auto',
			'nm-aspect-video',
			'nm-object-cover',
			'nm-rounded-md',
			'',
		]);
		image.setAttribute('loading', 'eager');

		leftSide.append(image);

		const rightSide = document.createElement('div');
		rightSide.id = 'next-tip-right-side';
		this.addClasses(rightSide, [
			'nm-playlist-card-right',
			'nm-w-[60%]',
			'nm-flex',
			'nm-flex-col',
			'nm-text-left',
			'nm-gap-1',
		]);
		nextTip.append(rightSide);

		const header = document.createElement('span');
		header.id = 'next-tip-header';
		this.addClasses(header, [
			'nm-playlist-card-header',
			'nm-font-bold',
			'',
		]);

		rightSide.append(header);

		const title = document.createElement('span');
		title.id = 'next-tip-title';
		this.addClasses(title, [
			'nm-playlist-card-title',
			'nm-font-bold',
			'',
		]);

		rightSide.append(title);

		this.on('show-episode-tip', (data) => {
			this.getTipData({ direction: data.direction, header, title, image });
			nextTip.style.display = 'flex';
			nextTip.style.transform = `translate(${data.x}, calc(${data.y} - 50%))`;
		});

		this.on('hide-episode-tip', () => {
			nextTip.style.display = 'none';
		});

		parent.appendChild(nextTip);
		return nextTip;
	}

	getTipDataIndex(direction: string) {
		let index: number;
		if (direction == 'previous') {
			index = this.getPlaylistIndex() - 1;
		} else {
			index = this.getPlaylistIndex() + 1;
		}

		return this.getPlaylist().at(index);
	}

	getTipData({ direction, header, title, image }:
		{ direction: string; header: HTMLSpanElement; title: HTMLSpanElement; image: HTMLImageElement; }) {

		const imageBaseUrl = 'https://image.tmdb.org/t/p/w185';

		const item = this.getTipDataIndex(direction);
		if (!item) return;

		image.src = item.image && item.image != '' ? `${imageBaseUrl}${item.image}` : '';
		header.textContent = `${this.localize(`${direction.toTitleCase()} Episode`)}: ${this.getButtonKeyCode(direction)}`;
		title.textContent = `${this.localize('S')}${item.season} ${this.localize('E')}${item.episode}: ${this.lineBreakShowTitle(item.title.replace('%S', this.localize('S')).replace('%E', this.localize('E')))}`;

		this.once('item', () => {
			this.getTipData({ direction, header, title, image });
		});
	}

	createNextUp(parent: HTMLDivElement) {

		const nextUp = document.createElement('div');
		nextUp.id = 'episode-tip';
		this.addClasses(nextUp, [
			'nm-episode-tip',
			'nm-flex',
			'nm-gap-2',
			'nm-absolute',
			'nm-right-4',
			'nm-bottom-8',
			'!nm-w-80',
			'nm-h-24',
			'nm-px-2',
			'nm-py-2',
		]);
		parent.appendChild(nextUp);
		nextUp.style.display = 'none';

		const creditsButton = document.createElement('button');
		creditsButton.id = 'next-up';
		this.addClasses(creditsButton, [
			'nm-next-up',
			'nm-next-button',
			'nm-bg-neutral-900/95',
			'nm-block',
			'!nm-text-[0.9rem]',
			'nm-font-bold',
			'!nm-color-neutral-100',
			'!nm-py-1.5',
			'nm-w-[45%]',
			'',
		]);

		creditsButton.innerText = this.localize('Watch credits');

		nextUp.appendChild(creditsButton);

		const nextButton = document.createElement('button');
		nextButton.id = 'next-up';
		this.addClasses(nextButton, [
			'nm-next-up',
			'nm-next-button',
			'nm-animated',
			'nm-bg-neutral-100',
			'nm-w-[55%]',
			'',
		]);

		nextButton.setAttribute('data-label', this.localize('Next'));
		nextButton.setAttribute('data-icon', '▶︎');

		nextUp.appendChild(nextButton);

		let timeout: NodeJS.Timeout;
		this.on('show-next-up', () => {
			nextUp.style.display = 'flex';
			timeout = setTimeout(() => {
				nextUp.style.display = 'none';
				this.next();
			}, 4500);
		});

		creditsButton.addEventListener('click', () => {
			clearTimeout(timeout);
			nextUp.style.display = 'none';
		});

		nextButton.addEventListener('click', () => {
			clearTimeout(timeout);
			nextUp.style.display = 'none';
			this.next();
		});

		let enabled = false;
		this.on('item', () => {
			enabled = false;
		});
		this.on('time', (data) => {
			if (data.position > (this.duration() - 5) && !enabled) {
				this.dispatchEvent('show-next-up');
				enabled = true;
			}
		});

		return nextUp;
	}

	modifySpinner(parent: HTMLDivElement) {

	const h2 = document.createElement('h2');
	h2.id = 'loader';
	h2.classList.add('loader');
	h2.textContent = `${this.localize('Loading playlist')}...`;

	const loader = document.createElement('div');
	loader.id = 'loading';
	loader.classList.add('loading');
	loader.innerHTML = `
		<div style="display:flex">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	`;
	loader.prepend(h2);

	const loadingSpinner = document.createElement('div');

	loadingSpinner.id = 'spinner';
	loadingSpinner.innerHTML = '';
	loadingSpinner.classList.add('spinner');
	this.addClasses(loadingSpinner, [
		'nm-flex',
		'nm-justify-center',
		'nm-items-center',
		'nm-absolute',
		'nm-left-0',
		'nm-right-0',
		'nm-top-0',
		'nm-bottom-0',

	]);

	loadingSpinner.append(loader);

	this.on('duringplaylistchange', () => {
		h2.textContent = `${this.localize('Loading playlist')}...`;
		loadingSpinner.style.display = 'flex';
		loadingSpinner.style.visibility = 'visible';
	});
	this.on('beforeplaylistitem', () => {
		h2.textContent = `${this.localize('Loading playlist item')}...`;
		loadingSpinner.style.display = 'flex';
		loadingSpinner.style.visibility = 'visible';
	});

	this.on('item', () => {
		loadingSpinner.style.display = 'none';
		loadingSpinner.style.visibility = 'nm-hidden';
	});

	this.on('time', () => {
		loadingSpinner.style.display = 'none';
		loadingSpinner.style.visibility = 'nm-hidden';
	});

	this.on('bufferedEnd', () => {
		loadingSpinner.style.display = 'none';
		loadingSpinner.style.visibility = 'nm-hidden';
	});

	this.on('waiting', () => {
		h2.textContent = `${this.localize('Buffering')}...`;
		loadingSpinner.style.display = 'flex';
		loadingSpinner.style.visibility = 'visible';
	});

	this.on('error', () => {
		h2.style.display = 'flex';
		h2.textContent = this.localize('Something went wrong trying to play this item');
		loadingSpinner.style.display = 'flex';
		loadingSpinner.style.visibility = 'visible';
		// setTimeout(() => {
		//     window.location.reload();
		// }, 2500);
	});

	parent.appendChild(loadingSpinner);
	return loadingSpinner;
};

}
