/* eslint-disable max-len */
import './index.css';

import { buttons, fluentIcons, Icon } from './buttons';
import Functions from './functions';

import type { Chapter, PlaybackState, PlaylistItem, Position, PreviewTime, VideoPlayer as Types, VideoPlayerOptions, VolumeState } from './index.d';

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
	theaterModeEnabled = false;
	pipEnabled = false;

	previewTime: PreviewTime[] = [];

	sliderPopImage: HTMLDivElement = <HTMLDivElement>{};
	chapterBar: HTMLDivElement = <HTMLDivElement>{};
	bottomBar: HTMLDivElement = <HTMLDivElement>{};
	topRow: HTMLDivElement = <HTMLDivElement>{};
	nextUp: HTMLDivElement & {
		firstChild: HTMLButtonElement,
		lastChild: HTMLButtonElement
	} = <HTMLDivElement & {
		firstChild: HTMLButtonElement,
		lastChild: HTMLButtonElement
	}>{};

	currentTimeFile = '';
	fluentIcons: Icon = <Icon>{};
	buttons: Icon = <Icon>{};
	tooltip: HTMLDivElement = <HTMLDivElement>{};
	hasNextTip = false;
	sliderBar: HTMLDivElement = <HTMLDivElement>{};

	currentScrubTime = 0;

	imageBaseUrl = this.options.basePath ? '' : 'https://image.tmdb.org/t/p/w185';

	timeout: NodeJS.Timeout = <NodeJS.Timeout>{};
	episodeScrollContainer: HTMLDivElement = <HTMLDivElement>{};
	selectedSeason: number | undefined;

	currentMenu: 'language'|'episode'|'pause'|'quality'|'seek'|null = null;
	thumbs: {
		time: PreviewTime,
		el: HTMLDivElement
	}[] = [];

	image = '';
	disablePauseScreen = false;
	disableOverlay = false;
	seekContainer: HTMLDivElement = <HTMLDivElement>{};
	shouldSlide = false;
	thumbnail: HTMLDivElement = <HTMLDivElement>{};
	thumbnailWidth = 256;
	thumbnailHeight = 144;

	constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
		super(playerType, options, playerId);

		this.on('ready', () => {
			this.fluentIcons = fluentIcons;
			this.buttons = buttons(this.options);

			if (this.isTv()) {
				this.#buildTvUI();
			} else {
				this.#buildUI();
			}
			this.#eventHandlers();
		});
	}

	#eventHandlers() {
		this.on('play', () => {
			this.#hideControls();
		});
		this.on('pause', () => {
			this.#showControls();
			// this.cancelNextUp();
		});
		this.on('volume', (data) => {
			this.displayMessage(`${this.localize('Volume')}: ${Math.floor(data.volume)}%`);
		});
		this.on('mute', (data) => {
			if (data.mute) {
				this.displayMessage(this.localize('Muted'));
			} else {
				this.displayMessage(`${this.localize('Volume')}: ${data.volume}%`);
			}
		});

		this.on('controls', (showing) => {
			if (this.getElement()) {
				if (showing) {
					this.getElement().style.cursor = 'default';
					this.getElement()?.setAttribute('active', 'true');
				} else {
					this.getElement().style.cursor = 'none';
					this.getElement()?.setAttribute('active', 'false');
				}
			}
		});

		this.on('chapters', () => {
			this.#createChapterMarkers();
		});

		this.on('back-button-hyjack', () => {
			switch (this.currentMenu) {
			case 'episode':
			case 'language':
			case 'quality':
				this.emit('showPauseScreen');
				break;
			case 'seek':
			case 'pause':
				this.seekContainer.style.transform = '';
				this.play();
				break;
			default:
				if (this.hasBackEventHandler) {
					this.emit('back');
				} else {
					history.back();
				}
				break;
			}
		});

		// let inactivityTimeout: NodeJS.Timeout = <NodeJS.Timeout>{};
		// ['touchstart', 'mousemove', 'touchmove', 'mousein'].forEach((event) => {
		// 	this.getElement()?.addEventListener(event, (e) => {
		// 		clearTimeout(inactivityTimeout);
		// 		inactivityTimeout = setTimeout(() => {
		// 			this.getElement().focus();
		// 		}, 50);
		// 	});
		// });
	}

	#unlockControls() {
		this.lock = false;
		this.getElement().querySelectorAll<HTMLDivElement>('*')
			.forEach(el => el.blur());
	}

	#lockControls() {
		this.lock = true;
	}

	#hideControls() {
		if (!this.lock && this.isPlaying()) {
			this.emit('controls', false);
			this.emit('show-menu', false);
			setTimeout(() => {
				this.controlsVisible = false;
			}, 100);
		}
	};

	#showControls() {
		this.emit('controls', true);
		setTimeout(() => {
			this.controlsVisible = true;
		}, 300);
	}

	#dynamicControls() {
		this.#showControls();
		clearTimeout(this.timer);
		if (!this.lock) {
			this.timer = setTimeout(this.#hideControls.bind(this), this.options.controlsTimeout ?? 3500);
		}
	};

	#buildUI() {
		if (this.options.disableControls) return;

		const overlay = this.createElement('div', 'overlay')
			.addClasses(this.makeStyles('overlayStyles'))
			.get();

		this.emit('overlay', overlay);

		this.overlay = overlay;

		if (!this.getElement().querySelector('#overlay')) {
			this.getElement().prepend(overlay);
		}

		overlay.onmousemove = () => {
			this.#dynamicControls();
		};

		overlay.onmouseleave = (e) => {
			const playerRect = this.getVideoElement().getBoundingClientRect();
			if (e.x > playerRect.left && e.x < playerRect.right && e.y > playerRect.top && e.y < playerRect.bottom) return;

			this.#hideControls();
		};

		overlay.ondragstart = () => {
			return false;
		};
		overlay.ondrop = () => {
			return false;
		};

		const topBar = this.#createTopBar(overlay);
		// this.addClasses(topBar, [
		// 	'nm-px-2',
		// 	'nm-pt-4',
		// 	'nm-pl-6',
		// 	'nm-pr-8',
		// ]);

		this.#createBackButton(topBar);
		this.#createCloseButton(topBar);
		this.#createDivider(topBar);
		const currentItem = this.#createTvCurrentItem(topBar);
		this.addClasses(currentItem, [
			'nm-px-2',
			'nm-pt-2',
			'nm-z-0',
		]);

		if (!this.options.disableTouchControls) {
			this.#createCenter(overlay);
		}

		this.bottomBar = this.#createBottomBar(overlay);

		this.bottomBar.onmouseleave = (e) => {
			const playerRect = this.getVideoElement()?.getBoundingClientRect();
			if (!playerRect || (e.x > playerRect.left && e.x < playerRect.right && e.y > playerRect.top && e.y < playerRect.bottom)) return;

			this.#hideControls();
		};

		this.topRow = this.#createTopRow(this.bottomBar);

		this.addClasses(this.topRow, ['nm-mt-4']);

		const bottomRow = this.#createBottomRow(this.bottomBar);

		['mouseover', 'touchstart'].forEach((event) => {
			bottomRow.addEventListener(event, () => {
				this.#lockControls();
			}, {
				passive: true,
			});
		});
		['mouseleave', 'touchend'].forEach((event) => {
			bottomRow.addEventListener(event, () => {
				this.#unlockControls();
			});
		});

		this.#createProgressBar(this.topRow);

		this.#createPlaybackButton(bottomRow);

		const join = this.getParameterByName('join');

		if (!join) {
			this.#createPreviousButton(bottomRow);

			this.#createSeekBackButton(bottomRow);

			this.#createSeekForwardButton(bottomRow);

			this.#createNextButton(bottomRow);

		}

		this.#createVolumeButton(bottomRow);

		this.#createTime(bottomRow, 'current', ['nm-ml-2']);
		this.#createDivider(bottomRow);
		this.#createTime(bottomRow, 'remaining', ['nm-mr-2']);

		this.#createTheaterButton(bottomRow);
		this.#createPIPButton(bottomRow);

		if (!join) {
			this.#createPlaylistsButton(bottomRow);
		}
		this.#createSpeedButton(bottomRow);
		this.#createCaptionsButton(bottomRow);
		this.#createAudioButton(bottomRow);
		this.#createQualityButton(bottomRow);
		this.#createSettingsButton(bottomRow);

		this.#createFullscreenButton(bottomRow);

		const frame = this.#createMenuFrame(bottomRow);

		this.#createMainMenu(frame);

		this.#createToolTip(overlay);

		this.#createEpisodeTip(overlay);

		this.#createNextUp(overlay);

		this.#modifySpinner(overlay);
	}

	#buildTvUI() {
		if (this.options.disableControls) return;

		const overlay = this.createElement('div', 'overlay')
			.addClasses(this.makeStyles('overlayStyles'))
			.get();

		this.emit('overlay', overlay);

		this.#createSpinnerContainer(overlay);

		this.overlay = overlay;

		(document.activeElement as HTMLElement).addEventListener('keydown', (e) => {
			if (this.isPlaying() && e.key == 'Enter') {
				this.pause();
			} else {
				this.#dynamicControls();
			}
		});

		overlay.addEventListener('keydown', (e) => {
			if (!this.options.disableTouchControls) {
				//
			}
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				e.preventDefault();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				e.preventDefault();
			}
		});

		if (!this.getElement().querySelector('#overlay')) {
			this.getElement().prepend(overlay);
		}

		this.#createPauseScreen(overlay);
		this.#createEpisodeScreen(overlay);
		this.#createLanguageScreen(overlay);

		this.#createTvOverlay(overlay);

		this.on('pause', () => {
			if (this.disablePauseScreen) return;

			this.emit('showPauseScreen');
		});
		this.on('play', () => {
			this.emit('hidePauseScreen');
			this.emit('hideEpisodeScreen');
			this.emit('hideLanguageScreen');
			this.emit('hideQualityScreen');
			// this.emit('showEpisodeScreen');
		});
		this.on('item', () => {
			this.emit('hidePauseScreen');
			this.emit('hideEpisodeScreen');
			this.emit('hideLanguageScreen');
			this.emit('hideQualityScreen');
			// this.emit('showEpisodeScreen');
		});
	}

	isLastSibbling(element: HTMLElement) {
		return !element.nextElementSibling;
	}

	#createTvOverlay(parent: HTMLElement) {

		const tvOverlay = this.createElement('div', 'tv-overlay')
			.addClasses(this.makeStyles('tvOverlayStyles'))
			.appendTo(parent);

		const background = this.createElement('div', 'background')
			.addClasses(this.makeStyles('backgroundStyles'))
			.appendTo(tvOverlay);


		const topBar = this.#createTopBar(tvOverlay);
		this.addClasses(topBar, [
			'nm-px-10',
			'nm-pt-10',
			'nm-z-0',
		]);

		const backButton = this.#createBackButton(topBar, true);
		if (backButton) {
			this.addClasses(backButton, ['children:nm-stroke-2']);
		}
		const restartButton = this.#createRestartButton(topBar, true);
		this.addClasses(restartButton, ['children:nm-stroke-2']);
		const nextButton = this.#createNextButton(topBar, true);
		this.addClasses(nextButton, ['children:nm-stroke-2']);
		this.#createDivider(topBar);
		this.#createTvCurrentItem(topBar);

		this.#createOverlayCenterMessage(tvOverlay);

		this.seekContainer = this.#createSeekContainer(tvOverlay);

		const bottomBar = this.#createBottomBar(tvOverlay);
		const bottomRow = this.createElement('div', 'seek-container')
			.addClasses(this.makeStyles('tvBottomRowStyles'))
			.appendTo(bottomBar);

		const playbackButton = this.#createPlaybackButton(bottomRow, true);

		this.#createTime(bottomRow, 'current', []);
		this.#createTvProgressBar(bottomRow);
		this.#createTime(bottomRow, 'remaining', ['nm-mr-14']);

		this.#createNextUp(tvOverlay);

		this.on('show-seek-container', (value) => {
			if (value) {
				background.style.opacity = '1';
			} else {
				background.style.opacity = '0';
			}
		});

		this.on('controls', (value) => {
			if (value && this.currentMenu !== 'seek' && !this.controlsVisible) {
				playbackButton.focus();
			}
		});

		this.on('pause', () => {
			background.style.opacity = '1';
		});

		this.on('play', () => {

			background.style.opacity = '0';

			this.hideSeekMenu();
		});


		let activeButton = backButton ?? restartButton ?? nextButton;

		[backButton, restartButton, nextButton].forEach((button) => {
			button?.addEventListener('keydown', (e) => {
				if (e.key == 'ArrowDown') {
					if (this.nextUp.style.display == 'none') {
						playbackButton?.focus();
					} else {
						this.nextUp.lastChild?.focus();
					}
				} else if (e.key == 'ArrowLeft') {
					activeButton = ((e.target as HTMLButtonElement).previousElementSibling as HTMLButtonElement);
					activeButton?.focus();
				} else if (e.key == 'ArrowRight') {
					e.preventDefault();
					activeButton = ((e.target as HTMLButtonElement).nextElementSibling as HTMLButtonElement);
					activeButton?.focus();
				}
			});
		});

		[this.nextUp.firstChild, this.nextUp.lastChild].forEach((button) => {
			button?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowUp') {
					(activeButton || restartButton)?.focus();
				} else if (e.key == 'ArrowDown') {
					playbackButton.focus();
				} else if (e.key == 'ArrowLeft') {
					this.nextUp.firstChild?.focus();
				} else if (e.key == 'ArrowRight') {
					this.nextUp.lastChild?.focus();
				}
			});
		});

		[playbackButton].forEach((button) => {
			button?.addEventListener('keydown', (e) => {
				if (e.key == 'ArrowUp') {
					e.preventDefault();
					if (this.nextUp.style.display == 'none') {
						activeButton?.focus();
					} else {
						this.nextUp.lastChild?.focus();
					}
				}
			});
		});

		[this.getVideoElement(), tvOverlay].forEach((button) => {
			(button as unknown as HTMLButtonElement)?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowLeft') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.showSeekMenu();

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubbTime = this.currentScrubTime - 10;

						this.emit('currentScrubTime', {
							...this.getTimeState(),
							position: newScrubbTime,
						});
					};

				} else if (e.key == 'ArrowRight') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.showSeekMenu();

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubbTime = this.currentScrubTime + 10;
						this.emit('currentScrubTime', {
							...this.getTimeState(),
							position: newScrubbTime,
						});
					};
				}
			});
		});


		[this.getVideoElement(), playbackButton, backButton, restartButton, nextButton].forEach((button) => {
			(button as unknown as HTMLButtonElement)?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowUp') {
					this.disablePauseScreen = false;
					this.hideSeekMenu();
				} else if (e.key == 'ArrowDown') {
					this.disablePauseScreen = false;
					this.hideSeekMenu();
				} else if (e.key == 'Enter') {
					this.seek(this.currentScrubTime);
					this.play();
				}
			});
		});

		playbackButton.focus();

		return bottomBar;
	}

	getClosestSeekableInterval() {
		const scrubTime = this.currentTime();
		const intervals = this.previewTime;
		const interval = intervals.find((interval) => {
			return scrubTime >= interval.start && scrubTime < interval.end;
		})!;
		return interval?.start;
	}

	showSeekMenu() {
		this.currentMenu = 'seek';
		this.disablePauseScreen = true;

		this.emit('show-seek-container', true);
	}

	hideSeekMenu() {
		this.currentMenu = null;
		this.disablePauseScreen = false;

		this.disableOverlay = false;
		this.currentMenu = null;
		this.disablePauseScreen = false;
		this.shouldSlide = true;

		this.emit('show-seek-container', false);
	}

	#createSeekContainer(parent: HTMLElement) {

		const seekContainer = this.createElement('div', 'seek-container')
			.addClasses(this.makeStyles('seekContainerStyles'))
			.appendTo(parent);

		const seekScrollCloneContainer = this.createElement('div', 'seek-scroll-clone-container')
			.addClasses(this.makeStyles('seekScrollCloneStyles'))
			.appendTo(seekContainer);

		// for (let index = 0; index <= 4; index += 1) {
		this.createElement('div', `thumbnail-clone-${1}`)
			.addClasses(this.makeStyles('thumbnailCloneStyles'))
			.appendTo(seekScrollCloneContainer);
		// }

		const seekScrollContainer = this.createElement('div', 'seek-scroll-container')
			.addClasses(this.makeStyles('seekScrollContainerStyles'))
			.appendTo(seekContainer);

		this.once('item', () => {
			this.on('preview-time', () => {
				this.thumbs = [];
				for (const time of this.previewTime) {
					this.thumbs.push({
						time,
						el: this.#createThumbnail(time),
					});
				}

				seekScrollContainer.innerHTML = '';
				this.unique(this.thumbs.map(t => t.el), 'id').forEach((thumb) => {
					seekScrollContainer.appendChild(thumb);
				});

				this.once('time', () => {
					this.currentScrubTime = this.getClosestSeekableInterval();
					this.emit('currentScrubTime', {
						...this.getTimeState(),
						position: this.getClosestSeekableInterval(),
					});
				});
			});
		});

		this.on('lastTimeTrigger', () => {
			this.currentScrubTime = this.getClosestSeekableInterval();
			this.emit('currentScrubTime', {
				...this.getTimeState(),
				position: this.getClosestSeekableInterval(),
			});
		});

		this.on('currentScrubTime', (data) => {
			if (data.position <= 0) {
				data.position = 0;
			} else if (data.position >= this.duration()) {
				data.position = this.duration() - 10;
			};

			const thumb = this.thumbs.find((thumb) => {
				return data.position >= thumb.time.start && data.position <= thumb.time.end;
			});

			this.currentScrubTime = data.position;

			if (!thumb) return;


			this.#scrollIntoView(thumb.el);

			const thumbIndex = this.thumbs.findIndex(e => e.el == thumb.el);

			if (!thumbIndex) return;

			const max = 3;

			const minThumbIndex = thumbIndex - max;
			const maxThumbIndex = thumbIndex + max;

			for (const [index, key] of this.thumbs.entries()) {
				if (index > minThumbIndex && index < maxThumbIndex) {
					key.el.style.opacity = '1';
				} else {
					key.el.style.opacity = '0';
				}
			}

		});

		this.on('show-seek-container', (value) => {
			if (value) {
				seekContainer.style.transform = 'none';

				this.player.pause();
			} else {
				this.seekContainer.style.transform = '';
			}
		});

		return seekContainer;
	}

	#scrollIntoView(element: HTMLElement) {

		const scrollDuration = 200;
		const parentElement = element.parentElement as HTMLElement;
		const elementLeft = element.getBoundingClientRect().left + (element.offsetWidth / 2) - (parentElement.offsetWidth / 2);
		const startingX = parentElement.scrollLeft;
		const startTime = performance.now();

		function scrollStep(timestamp: number) {
			const currentTime = timestamp - startTime;
			const progress = Math.min(currentTime / scrollDuration, 1);

			parentElement.scrollTo(startingX + elementLeft * progress, 0);

			if (currentTime < scrollDuration) {
				requestAnimationFrame(scrollStep);
			}
		}
		requestAnimationFrame(scrollStep);
	}

	#createTvCurrentItem(parent: HTMLElement) {

		const currentItemContainer = this.createElement('div', 'current-item-container')
			.addClasses(this.makeStyles('tvCurrentItemContainerStyles'))
			.appendTo(parent);

		const currentItemShow = this.createElement('div', 'current-item-show')
			.addClasses(this.makeStyles('tvCurrentItemShowStyles'))
			.appendTo(currentItemContainer);

		const currentItemTitleContainer = this.createElement('div', 'current-item-title-container')
			.addClasses(this.makeStyles('tvCurrentItemTitleContainerStyles'))
			.appendTo(currentItemContainer);

		const currentItemEpisode = this.createElement('div', 'current-item-episode')
			.addClasses(this.makeStyles('tvCurrentItemEpisodeStyles'))
			.appendTo(currentItemTitleContainer);

		const currentItemTitle = this.createElement('div', 'current-item-title')
			.addClasses(this.makeStyles('tvCurrentItemTitleStyles'))
			.appendTo(currentItemTitleContainer);

		this.on('item', () => {
			const item = this.getPlaylistItem();
			currentItemShow.innerHTML = this.breakLogoTitle(item.show);
			currentItemEpisode.innerHTML = '';
			if (item.season) {
				currentItemEpisode.innerHTML += `${this.localize('S')}${item.season}`;
			}
			if (item.season && item.episode) {
				currentItemEpisode.innerHTML += `: ${this.localize('E')}${item.episode}`;
			}
			currentItemTitle.innerHTML = item.title.replace(item.show, '').length > 0 ? `"${item.title.replace(item.show, '').replace('%S', this.localize('S'))
				.replace('%E', this.localize('E'))}"` : '';
		});

		return currentItemContainer;

	}

	#createImageContainer(parent: HTMLElement) {

		const leftSideTop = this.createElement('div', 'left-side-top')
			.addClasses(this.makeStyles('leftSideTopStyles'))
			.appendTo(parent);

		const logoContainer = this.createElement('div', 'logo-container')
			.addClasses(this.makeStyles('logoContainerStyles'))
			.appendTo(leftSideTop);

		const fallbackText = this.createElement('span', 'fallbackText')
			.addClasses(this.makeStyles('fallbackTextStyles'))
			.appendTo(logoContainer);

		const logo = this.createElement('img', 'logo')
			.addClasses(this.makeStyles('logoStyles'))
			.appendTo(logoContainer);


		const logoFooterContainer = this.createElement('div', 'left-side-top-overview')
			.addClasses(this.makeStyles('logoFooterStyles'))
			.appendTo(leftSideTop);

		const ratingContainer = this.createElement('div', 'rating-container')
			.addClasses(this.makeStyles('ratingContainerStyles'))
			.appendTo(logoFooterContainer);

		const year = this.createElement('span', 'year-text')
			.addClasses(this.makeStyles('yearStyles'))
			.appendTo(ratingContainer);

		const ratingImage = this.createElement('img', 'rating-image')
			.addClasses(this.makeStyles('ratingImageStyles'))
			.appendTo(ratingContainer);


		const episodesCount = this.createElement('span', 'episodes-count-text')
			.addClasses(this.makeStyles('episodesCountStyles'))
			.appendTo(ratingContainer);

		this.on('item', () => {
			const image = this.getPlaylistItem().logo;

			if (!image || image == '' || image.includes('null') || image.includes('undefined')) {
				fallbackText.textContent = this.breakLogoTitle(this.getPlaylistItem().show);
				fallbackText.style.fontSize = `calc(110px / ${fallbackText.textContent.length} + 3ch)`;

				fallbackText.style.display = 'flex';
				logo.style.display = 'none';

			} else {

				logo.style.display = 'block';
				fallbackText.style.display = 'none';

				if (image?.startsWith('http')) {
					logo.src = image;
				} else {
					logo.src = image && image != '' ? `${this.imageBaseUrl}${image}` : '';
				}
			}

			year.innerHTML = this.getPlaylistItem().year.toString();

			ratingImage.removeAttribute('src');
			ratingImage.removeAttribute('alt');
			ratingImage.style.opacity = '0';

			if (this.getPlaylist().length > 1) {
				episodesCount.innerHTML = `${this.getPlaylist().length} ${this.localize('episodes')}`;
			}

			const rating = this.getPlaylistItem().rating;
			if (!rating) return;

			ratingImage.src = `https://storage.nomercy.tv/laravel/kijkwijzer/${rating.image}`;
			ratingImage.alt = rating.rating;
			ratingImage.style.opacity = '1';
		});

		return leftSideTop;

	}

	#createPauseScreen(parent: HTMLElement) {
		const pauseScreen = this.createElement('div', 'pause-screen')
			.addClasses(this.makeStyles('pauseScreenStyles'))
			.appendTo(parent);

		const leftSide = this.createElement('div', 'left-side')
			.addClasses(this.makeStyles('leftSideStyles'))
			.appendTo(pauseScreen);

		const leftSideTop = this.#createImageContainer(leftSide);

		const overviewContainer = this.createElement('div', 'title-container')
			.addClasses(this.makeStyles('overviewContainerStyles'))
			.appendTo(leftSideTop);

		const title = this.createElement('div', 'title')
			.addClasses(this.makeStyles('titleStyles'))
			.appendTo(overviewContainer);

		const description = this.createElement('div', 'description')
			.addClasses(this.makeStyles('descriptionStyles'))
			.appendTo(overviewContainer);

		this.on('item', () => {
			title.innerHTML = this.getPlaylistItem().title.replace(this.getPlaylistItem().show, '').replace('%S', this.localize('S'))
				.replace('%E', this.localize('E'));
			description.innerHTML = this.getPlaylistItem().description;
		});

		const buttonContainer = this.createElement('div', 'button-container')
			.addClasses(this.makeStyles('buttonContainerStyles'))
			.appendTo(leftSide);

		const resumeButton = this.#createTvButton(buttonContainer, 'play', 'Resume playback', this.play, this.buttons.play);

		this.#createTvButton(buttonContainer, 'restart', 'Play from beginning', this.restart, this.buttons.restart);

		const episodeMenuButton = this.#createTvButton(buttonContainer, 'showEpisodeMenu', 'Episodes', () => this.emit('showEpisodeScreen'), this.buttons.playlist);

		episodeMenuButton.style.display = 'none';

		episodeMenuButton.addEventListener('click', () => {
			this.emit('switch-season', this.getPlaylistItem().season);
		});

		const languageMenuButton = this.#createTvButton(buttonContainer, 'showLanguageMenu', 'Audio and subtitles', () => this.emit('showLanguageScreen'), this.buttons.language);

		languageMenuButton.style.display = 'none';

		// this.#createTvButton(buttonContainer, 'showQualityMenu', 'Qualities', () => this.emit('showQualityScreen'),
		// 	this.buttons.quality);

		const backButton = this.#createTvButton(leftSide, 'back', 'Stop', () => this.emit('back'), this.buttons.back);

		backButton.addEventListener('click', () => {
			this.currentMenu = null;
		});

		backButton.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				const el = (backButton.previousElementSibling as HTMLButtonElement);
				if (el?.nodeName == 'BUTTON') {
					el?.focus();
				} else {

					[...(backButton.previousElementSibling as HTMLButtonElement).querySelectorAll<HTMLButtonElement>('button')]
						.filter(el => el.style.display !== 'none')
						.at(-1)
						?.focus();
				}
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				(backButton.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		this.addClasses(backButton, [
			'nm-mt-auto',
			'nm-ml-2',
			'nm-px-2',
			'nm-w-[65%]',
			'nm-mr-auto',
		]);

		this.createElement('div', 'pause-screen-right-side')
			.addClasses(this.makeStyles('rightSideStyles'))
			.appendTo(pauseScreen);

		this.on('showPauseScreen', () => {
			this.disableOverlay = true;
			this.currentMenu = 'pause';
			pauseScreen.style.display = 'flex';
			this.emit('hideEpisodeScreen');
			this.emit('hideLanguageScreen');
			setTimeout(() => {
				resumeButton.focus();
			}, 50);
		});

		this.on('hidePauseScreen', () => {
			pauseScreen.style.display = 'none';
		});

		this.on('audio', () => {
			if (this.hasAudioTracks() || this.hasTextTracks()) {
				languageMenuButton.style.display = 'flex';
			} else {
				languageMenuButton.style.display = 'none';
			}
		});

		this.on('item', () => {
			if (this.getPlaylist().length > 1) {
				episodeMenuButton.style.display = 'flex';
			} else {
				episodeMenuButton.style.display = 'none';
			}
		});

		return pauseScreen;
	}

	#createEpisodeScreen(parent: HTMLElement) {
		const episodeScreen = this.createElement('div', 'episode-screen')
			.addClasses(this.makeStyles('episodeScreenStyles'))
			.appendTo(parent);

		const leftSide = this.createElement('div', 'episode-screen-left-side')
			.addClasses(this.makeStyles('episodeLeftSideStyles'))
			.appendTo(episodeScreen);

		this.#createImageContainer(leftSide);

		const seasonButtonContainer = this.createElement('div', 'season-button-container')
			.addClasses(this.makeStyles('buttonContainerStyles'))
			.appendTo(leftSide);

		let lastSeasonButton: HTMLButtonElement = <HTMLButtonElement>{};
		for (const season of this.getSeasons()) {
			lastSeasonButton = this.#createTvSeasonButton(
				seasonButtonContainer,
				`season-${season.season}`,
				season,
				() => this.emit('switch-season', season.season)
			);
		}

		lastSeasonButton.addEventListener?.('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				//
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				(lastSeasonButton.nextElementSibling as HTMLButtonElement)?.focus();
				const el = (lastSeasonButton.nextElementSibling as HTMLButtonElement);
				if (el?.nodeName == 'BUTTON') {
					el?.focus();
				} else {
					((lastSeasonButton.parentElement as HTMLButtonElement).nextElementSibling as HTMLButtonElement)?.focus();
				}
			}
		});

		const backButton = this.#createTvButton(leftSide, 'episode-back', 'Back', () => this.emit('showPauseScreen'), this.buttons.back);

		this.addClasses(backButton, [
			'nm-mt-auto',
			'nm-ml-2',
			'nm-px-2',
			'nm-mr-2',
			'!nm-w-[95%]',
		]);

		backButton.addEventListener('click', () => {
			this.currentMenu = null;
		});

		backButton.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				[...document.querySelectorAll<HTMLButtonElement>('[id^=playlist-]')]
					.filter(el => getComputedStyle(el).display == 'flex')
					.at(this.getPlaylistItem().episode - 1)
					?.focus();
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				[
					...(backButton.previousElementSibling as HTMLButtonElement)
						.querySelectorAll<HTMLButtonElement>('button'),
				]
					.at(-1)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				//
			}
		});

		const rightSide = this.createElement('div', 'episode-screen-right-side')
			.addClasses(this.makeStyles('episodeRightSideStyles'))
			.appendTo(episodeScreen);


		this.episodeScrollContainer = this.createElement('div', 'episode-scroll-container')
			.addClasses(this.makeStyles('episodeScrollContainerStyles'))
			.appendTo(rightSide);


		for (const [index, item] of this.getPlaylist().entries() ?? []) {
			this.#createTvEpisodeMenuButton(this.episodeScrollContainer, item, index);
		}

		this.on('showEpisodeScreen', () => {
			this.disableOverlay = true;
			this.currentMenu = 'episode';
			this.emit('switch-season', this.getPlaylistItem().season);
			episodeScreen.style.display = 'flex';
			this.emit('hidePauseScreen');
			this.emit('hideLanguageScreen');

			setTimeout(() => {
				backButton.focus();
			}, 50);
		});

		this.on('hideEpisodeScreen', () => {
			episodeScreen.style.display = 'none';
		});

		return episodeScreen;
	}

	#createTvEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number) {

		const button = this.createElement('button', `playlist-${item.id}`)
			.addClasses(this.makeStyles('playlistMenuButtonStyles'))
			.appendTo(parent);

		if (this.getPlaylistItem().season !== 1) {
			button.style.display = 'none';
		}

		const leftSide = this.createElement('div', `playlist-${item.id}-left`)
			.addClasses(this.makeStyles('tvEpisodeMenuButtonLeftStyles'))
			.appendTo(button);

		const shadow = this.createElement('div', `episode-${item.id}-shadow`)
			.addClasses(this.makeStyles('episodeMenuButtonShadowStyles'))
			.appendTo(leftSide);

		shadow.style.margin = item.video_type == 'movie' ? '0px 30%' : '0';
		shadow.style.width = item.video_type == 'movie' ? 'calc(120px / 3 * 2)' : '100%';


		const image = this.createElement('img', `episode-${item.id}-image`)
			.addClasses(this.makeStyles('episodeMenuButtonImageStyles'))
			.appendTo(leftSide);
		image.setAttribute('loading', 'lazy');

		if (item.image?.startsWith('http')) {
			image.src = item.image ?? '';
		} else {
			image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';
		}

		const progressContainer = this.createElement('div', `episode-${item.id}-progress-container`)
			.addClasses(this.makeStyles('episodeMenuProgressContainerStyles'))
			.appendTo(leftSide);

		const progressContainerItemBox = this.createElement('div', `episode-${item.id}-progress-box`)
			.addClasses(this.makeStyles('episodeMenuProgressBoxStyles'))
			.appendTo(progressContainer);


		const progressContainerItemText = this.createElement('div', `episode-${item.id}-progress-item`)
			.addClasses(this.makeStyles('progressContainerItemTextStyles'))
			.appendTo(progressContainerItemBox);
		progressContainerItemText.innerText = `${this.localize('E')}${item.episode}`;

		const progressContainerDurationText = this.createElement('div', `episode-${item.id}-progress-duration`)
			.addClasses(this.makeStyles('progressContainerDurationTextStyles'))
			.appendTo(progressContainerItemBox);
		progressContainerDurationText.innerText = item.duration?.replace(/^00:/u, '');

		const sliderContainer = this.createElement('div', `episode-${item.id}-slider-container`)
			.addClasses(this.makeStyles('sliderContainerStyles'))
			.appendTo(progressContainer);
		sliderContainer.style.display = item.progress ? 'flex' : 'none';

		const progressBar = this.createElement('div', `episode-${item.id}-progress-bar`)
			.addClasses(this.makeStyles('progressBarStyles'))
			.appendTo(sliderContainer);

		if (item.progress?.percentage) {
			progressBar.style.width = `${item.progress.percentage > 98 ? 100 : item.progress}%`;
		}

		const episodeMenuButtonRightSide = this.createElement('div', `episode-${item.id}-right-side`)
			.addClasses(this.makeStyles('tvEpisodeMenuButtonRightSideStyles'))
			.appendTo(button);


		const episodeMenuButtonTitle = this.createElement('span', `episode-${item.id}-title`)
			.addClasses(this.makeStyles('tvEpisodeMenuButtonTitleStyles'))
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonTitle.textContent = this.lineBreakShowTitle(item.title.replace(item.show, '').replace('%S', this.localize('S'))
			.replace('%E', this.localize('E')));

		const episodeMenuButtonOverview = this.createElement('span', `episode-${item.id}-overview`)
			.addClasses(this.makeStyles('tvEpisodeMenuButtonOverviewStyles'))
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonOverview.textContent = this.limitSentenceByCharacters(item.description, 600);


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
			this.selectedSeason = season;

			if (this.getPlaylistItem().id == item.id) {
				setTimeout(() => {
					button.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
				}, 50);
			} else if (this.getPlaylistItem().season !== season) {
				this.episodeScrollContainer.scrollTo(0, 0);
			}

			if (season == item.season) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		this.on('time', (data) => {
			if (this.getPlaylistItem()?.uuid == item.uuid) {
				progressBar.style.width = `${data.percentage}%`;
				sliderContainer.style.display = 'flex';
			}
		});

		progressContainerItemText.innerText
			= item.season == undefined ? `${item.episode}` : `${this.localize('S')}${item.season}: ${this.localize('E')}${item.episode}`;

		button.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				document.querySelector<HTMLButtonElement>(`#season-${this.getPlaylistItem().season}`)?.focus();
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				(button.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				(button.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		button.addEventListener('focus', () => {
			button.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		});

		button.addEventListener('click', () => {
			this.emit('show-menu', false);

			if (item.episode && item.season) {
				this.setEpisode(item.season, item.episode);
			} else {
				this.setPlaylistItem(index);
			}
			this.emit('playlist-menu-button-clicked', item);
		});

		return button;
	}

	#nearestValue(arr: any[], val: number) {
		return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
	}

	#getClosestElement(element: HTMLButtonElement, selector: string) {

		const arr = [...document.querySelectorAll<HTMLButtonElement>(selector)].filter(el => getComputedStyle(el).display == 'flex');
		const originEl = element!.getBoundingClientRect();

		const el = arr.find(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2)) == this.#nearestValue(arr.map(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))), originEl.top + (originEl.height / 2)));

		// if(arr.findIndex(e => e.id == el.id) == 1) {
		// return el?.previousSibling ?? el;
		// }
		return el;
	}

	#createTvSeasonButton(
		parent: HTMLElement,
		id: string,
		data: {
			season: any;
			seasonName: any;
			episodes: number;
		},
		action: () => void,
		icon?: Icon['path']
	) {

		const button = this.createElement('button', id)
			.addClasses(this.makeStyles('tvSeasonButtonStyles').concat(`${id}-button`))
			.appendTo(parent);
		button.type = 'button';

		button.addEventListener('focus', () => {
			button.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		});

		button.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				if (this.selectedSeason == this.getPlaylistItem().season) {
					[...document.querySelectorAll<HTMLButtonElement>('[id^=playlist-]')]
						.filter(el => getComputedStyle(el).display == 'flex')
						.at(this.getPlaylistItem().episode - 1)
						?.focus();
				} else {
					this.#getClosestElement(button, '[id^=playlist-]')?.focus();
				}
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				(button.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				(button.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		button.addEventListener('click', () => {
			action?.bind(this)();
		});

		this.on('switch-season', (season) => {
			if (season === data.season) {
				button.classList.add('nm-outline-white');
			} else {
				button.classList.remove('nm-outline-white');
			}
		});

		if (icon) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');

			svg.id = id;
			this.addClasses(svg, [
				`${id}-icon`,
				...icon.classes,
				...this.makeStyles('svgSizeStyles'),
			]);

			const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path2.setAttribute('d', icon.hover);
			svg.appendChild(path2);
			button.appendChild(svg);
		}

		const buttonText = this.createElement('span', `${id}-buttonText`)
			.addClasses(this.makeStyles('tvSeasonButtonTextStyles'))
			.appendTo(button);

		buttonText.innerHTML = data.seasonName ? `
				<span>
					${data.seasonName}  
				</span>
				<span>
					${data.episodes} ${this.localize('episodes')}
				</span>
			` : `<span>
					${this.localize('Season')} ${data.season}
				</span>
				<span>
					${data.episodes} ${this.localize('episodes')}
				</span>
			`;

		return button;

	}

	#getVisibleButtons(element: HTMLButtonElement) {
		const container = element.parentElement;
		const buttons = container?.querySelectorAll<HTMLButtonElement>('button');
		if (!buttons || buttons?.length == 0) return;

		const visibleButtons = [...buttons].filter(el => el.style.display != 'none');

		const currentButtonIndex = visibleButtons.findIndex(el => el == element);

		return {
			visibleButtons,
			currentButtonIndex,
		};
	}

	#findPreviousVisibleButton(element: HTMLButtonElement) {
		const buttons = this.#getVisibleButtons(element);
		if (!buttons) return;

		const { visibleButtons, currentButtonIndex } = buttons;

		// eslint-disable-next-line no-unreachable-loop
		for (let i = currentButtonIndex; i >= 0; i--) {
			return visibleButtons[i - 1];
		}
	}

	#findNextVisibleButton(element: HTMLButtonElement) {
		const buttons = this.#getVisibleButtons(element);
		if (!buttons) return;

		const { visibleButtons, currentButtonIndex } = buttons;

		// eslint-disable-next-line no-unreachable-loop
		for (let i = currentButtonIndex; i < visibleButtons.length; i++) {
			return visibleButtons[i + 1];
		}
	}

	#createTvButton(parent: HTMLElement, id: string, text: string, action: () => void, icon?: Icon['path']) {

		const button = this.createElement('button', id)
			.addClasses(this.makeStyles('tvButtonStyles').concat(`${id}-button`))
			.appendTo(parent);
		button.type = 'button';

		button.addEventListener('focus', () => {
			button.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		});

		button.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				this.#findPreviousVisibleButton(button)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				const el = this.#findNextVisibleButton(button);
				if (el) {
					el?.focus();
				} else {
					(button.parentElement?.nextElementSibling as HTMLButtonElement)?.focus();
				}
			}
		});

		button.addEventListener('click', () => action?.bind(this)());

		if (icon) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');

			svg.id = id;
			this.addClasses(svg, [
				`${id}-icon`,
				...icon.classes,
				...this.makeStyles('svgSizeStyles'),
			]);

			const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path2.setAttribute('d', icon.hover);
			svg.appendChild(path2);
			button.appendChild(svg);
		}

		const buttonText = this.createElement('span', `${id}-buttonText`)
			.addClasses(this.makeStyles('tvButtonTextStyles'))
			.appendTo(button);
		buttonText.innerHTML = this.localize(text);

		return button;

	}

	#createLanguageScreen(parent: HTMLElement) {
		const languageScreen = this.createElement('div', 'language-screen')
			.addClasses(this.makeStyles('languageScreenStyles'))
			.appendTo(parent);

		const leftSide = this.createElement('div', 'language-screen-left-side')
			.addClasses(this.makeStyles('episodeLeftSideStyles'))
			.appendTo(languageScreen);

		this.#createImageContainer(leftSide);

		const languageButtonContainer = this.createElement('div', 'language-button-container')
			.addClasses(this.makeStyles('buttonContainerStyles'))
			.appendTo(leftSide);

		languageButtonContainer.style.paddingRight = '5rem';

		let lastSeasonButton: HTMLButtonElement = <HTMLButtonElement>{};

		const eventHandler = (e: KeyboardEvent) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				((e.target as HTMLButtonElement).previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				const el = ((e.target as HTMLButtonElement).nextElementSibling as HTMLButtonElement);
				if (el?.nodeName == 'BUTTON') {
					el?.focus();
				} else {
					((lastSeasonButton.parentElement as HTMLButtonElement).nextElementSibling as HTMLButtonElement)?.focus();
				}
			}
		};

		this.on('audio', (event) => {
			lastSeasonButton.removeEventListener?.('keyup', eventHandler);

			languageButtonContainer.innerHTML = '';
			for (const [index, track] of event.tracks?.entries() ?? []) {
				lastSeasonButton = this.#createLanguageMenuButton(languageButtonContainer, {
					language: track.language,
					label: track.name ?? track.label,
					type: 'audio',
					index: track.hlsjsIndex ?? index,
				});
			}
			lastSeasonButton.addEventListener?.('keyup', eventHandler);
		});

		const backButton = this.#createTvButton(leftSide, 'episode-back', 'Back', () => this.emit('showPauseScreen'), this.buttons.back);

		this.addClasses(backButton, [
			'nm-mt-auto',
			'nm-ml-2',
			'nm-px-2',
			'nm-mr-2',
			'!nm-w-[95%]',
		]);

		backButton.addEventListener('click', () => {
			this.currentMenu = null;
		});

		backButton.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				[...document.querySelectorAll<HTMLButtonElement>('[id^="subtitle-button-"]')]
					.filter(el => getComputedStyle(el).display == 'flex')
					.at(1)
					?.focus();
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {

				[...(backButton.previousElementSibling as HTMLButtonElement).querySelectorAll<HTMLButtonElement>('button')].at(-1)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				//
			}
		});

		const rightSide = this.createElement('div', 'language-screen-right-side')
			.addClasses(this.makeStyles('languageRightSideStyles'))
			.appendTo(languageScreen);

		const subtitleButtonContainer = this.createElement('div', 'subtitle-button-container')
			.addClasses(this.makeStyles('subtitleButtonContainerStyles'))
			.appendTo(rightSide);

		subtitleButtonContainer.style.paddingRight = '5rem';
		subtitleButtonContainer.style.marginTop = '0';

		this.on('captions', (event) => {

			subtitleButtonContainer.innerHTML = '';
			for (const [index, track] of event.tracks.entries() ?? []) {
				this.#createLanguageMenuButton(subtitleButtonContainer, {
					language: track.language,
					label: track.label,
					type: 'subtitle',
					index: index - 1,
					styled: (track.src ?? track.id).endsWith('.ass'),
				});
			}
		});

		this.on('showLanguageScreen', () => {
			this.disableOverlay = true;
			this.currentMenu = 'language';
			languageScreen.style.display = 'flex';
			this.emit('hidePauseScreen');
			this.emit('hideEpisodeScreen');
			setTimeout(() => {
				backButton.focus();
			}, 50);
		});

		this.on('hideLanguageScreen', () => {
			languageScreen.style.display = 'none';
		});

		return languageScreen;
	}

	#createTopBar(parent: HTMLElement) {

		const topBar = this.createElement('div', 'top-bar')
			.addClasses(this.makeStyles('topBarStyles'))
			.appendTo(parent);

		topBar.style.transform = 'translateY(0)';

		this.on('controls', (showing) => {
			if (showing && !this.disableOverlay) {
				topBar.style.transform = 'translateY(0)';
			} else {
				topBar.style.transform = '';
			}
		});

		return topBar;
	}

	#createCenter(parent: HTMLElement) {

		const center = this.createElement('div', 'center')
			.addClasses(this.makeStyles('centerStyles'))
			.appendTo(parent);

		['click', 'touchstart', 'touchend', 'mousemove'].forEach((event) => {
			center.addEventListener(event, (e) => {
				if (!this.isMobile()) return;

				e.stopPropagation();
				if (this.controlsVisible && this.isPlaying()) {
					this.#unlockControls();
					this.#hideControls();
				} else {
					this.#dynamicControls();
				}
			});
		});

		this.#createOverlayCenterMessage(center);

		this.#createSpinnerContainer(center);

		if (this.isMobile()) {
			this.#createTouchSeekBack(center, { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } });
			this.#createTouchPlayback(center, { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } });
			this.#createTouchSeekForward(center, { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } });
			this.#createTouchVolUp(center, { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } });
			this.#createTouchVolDown(center, { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } });
		} else {
			this.#createTouchSeekBack(center, { x: { start: 1, end: 2 }, y: { start: 2, end: 6 } });
			this.#createTouchPlayback(center, { x: { start: 2, end: 3 }, y: { start: 2, end: 6 } });
			this.#createTouchSeekForward(center, { x: { start: 3, end: 4 }, y: { start: 2, end: 6 } });
		}

		return center;

	}

	#createTouchSeekBack(parent: HTMLElement, position: Position) {
		// if (!this.isMobile()) return;
		const touchSeekBack = this.#createTouchBox(parent, 'touchSeekBack', position);
		['click'].forEach((event) => {
			touchSeekBack.addEventListener(event, this.doubleTap(() => {
				this.rewindVideo();
			}));
		});

		this.#createSeekRipple(touchSeekBack, 'left');

		return touchSeekBack;

	}

	#createTouchSeekForward(parent: HTMLElement, position: Position) {
		// if (!this.isMobile()) return;
		const touchSeekForward = this.#createTouchBox(parent, 'touchSeekForward', position);
		['mouseup', 'touchend'].forEach((event) => {
			touchSeekForward.addEventListener(event, this.doubleTap(() => {
				this.forwardVideo();
			}));
		});

		this.#createSeekRipple(touchSeekForward, 'right');

		return touchSeekForward;
	}

	#createTouchPlayback(parent: HTMLElement, position: Position, hovered = false) {
		const touchPlayback = this.#createTouchBox(parent, 'touchPlayback', position);
		this.addClasses(touchPlayback, this.makeStyles('touchPlaybackStyles'));

		['click'].forEach((event) => {
			touchPlayback.addEventListener(event, this.doubleTap(
				() => this.toggleFullscreen(),
				() => {
					(this.controlsVisible || !this.options.disableTouchControls) && this.togglePlayback();
				}
			));
		});

		if (this.isMobile()) {
			const playButton = this.createSVGElement(touchPlayback, 'bigPlay', this.buttons.bigPlay, hovered);
			this.addClasses(playButton, this.makeStyles('touchPlaybackButtonStyles'));

			this.on('pause', () => {
				playButton.style.display = 'flex';
			});
			this.on('play', () => {
				playButton.style.display = 'none';
			});
		}

		return touchPlayback;
	}

	#createTouchVolUp(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchVolUp = this.#createTouchBox(parent, 'touchVolUp', position);
		['click'].forEach((event) => {
			touchVolUp.addEventListener(event, this.doubleTap(() => {
				this.volumeUp();
			}));
		});

		return touchVolUp;
	}

	#createTouchVolDown(parent: HTMLElement, position: Position) {
		if (!this.isMobile()) return;
		const touchVolDown = this.#createTouchBox(parent, 'touchVolDown', position);
		['click'].forEach((event) => {
			touchVolDown.addEventListener(event, this.doubleTap(() => {
				this.volumeDown();
			}));
		});

		return touchVolDown;
	}

	#createTouchBox(parent: HTMLElement, id: string, position: Position) {
		const touch = this.createElement('div', `touch-box-${id}`)
			.addClasses([`touch-box-${id}`, 'nm-z-40'])
			.appendTo(parent);

		touch.style.gridColumnStart = position.x.start.toString();
		touch.style.gridColumnEnd = position.x.end.toString();
		touch.style.gridRowStart = position.y.start.toString();
		touch.style.gridRowEnd = position.y.end.toString();

		parent.appendChild(touch);

		return touch;

	}

	#createBottomBar(parent: HTMLElement) {
		const bottomBar = this.createElement('div', 'bottom-bar')
			.addClasses(this.makeStyles('bottomBarStyles'))
			.appendTo(parent);
		bottomBar.style.transform = 'translateY(0)';

		this.createElement('div', 'bottom-bar-shadow')
			.addClasses(this.makeStyles('bottomBarShadowStyles'))
			.appendTo(bottomBar);

		this.on('controls', (showing) => {
			if (showing && !this.disableOverlay) {
				bottomBar.style.transform = 'translateY(0)';
			} else {
				bottomBar.style.transform = '';
			}
		});

		return bottomBar;
	}

	#createTopRow(parent: HTMLDivElement) {
		const topRow = this.createElement('div', 'top-row')
			.addClasses(this.makeStyles('topRowStyles'))
			.appendTo(parent);

		return topRow;
	}

	#createBottomRow(parent: HTMLDivElement) {
		const bottomRow = this.createElement('div', 'bottom-row')
			.addClasses(this.makeStyles('bottomRowStyles'))
			.appendTo(parent);

		return bottomRow;
	}

	#createDivider(parent: HTMLElement, content?: any) {
		const divider = this.createElement('div', 'divider')
			.addClasses(this.makeStyles('dividerStyles'))
			.appendTo(parent);

		if (content) {
			divider.innerHTML = content;
		} else {
			this.addClasses(divider, this.makeStyles('dividerStyles'));
		}

		return divider;
	}

	createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden = false, hovered = false) {

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.addClasses(svg, [
			`${id}-icon`,
			...icon.classes,
			...this.makeStyles('svgSizeStyles'),
			hidden ? 'nm-hidden' : 'nm-flex',
		]);

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', hovered ? icon.hover : icon.normal);
		this.addClasses(path, [
			'group-hover/button:nm-hidden',
			'group-hover/volume:nm-hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', hovered ? icon.normal : icon.hover);
		this.addClasses(path2, [
			'nm-hidden',
			'group-hover/button:nm-flex',
			'group-hover/volume:nm-flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button')) {
			parent.addEventListener('mouseenter', () => {
				if (icon.title.length == 0 || (['Next', 'Previous'].includes(icon.title) && this.hasNextTip)) return;

				if (icon.title == 'Fullscreen' && this.isFullscreen()) {
					return;
				} if (icon.title == 'Exit fullscreen' && !this.isFullscreen()) {
					return;
				} if (icon.title == 'Play' && this.isPlaying()) {
					return;
				} if (icon.title == 'Pause' && !this.isPlaying()) {
					return;
				} if (icon.title == 'Mute' && this.isMuted()) {
					return;
				} if (icon.title == 'Unmute' && !this.isMuted()) {
					return;
				}

				const text = `${this.localize(icon.title)} ${this.getButtonKeyCode(id)}`;

				const playerRect = this.getElement().getBoundingClientRect();
				const tipRect = parent.getBoundingClientRect();

				let x = Math.abs(playerRect.left - (tipRect.left + (tipRect.width * 0.5)) - (text.length * 0.5));
				const y = Math.abs(playerRect.bottom - (tipRect.bottom + (tipRect.height * 1.2)));

				if (x < 35) {
					x = 35;
				}

				if (x > (playerRect.right - playerRect.left) - 75) {
					x = (playerRect.right - playerRect.left) - 75;
				}

				this.emit('show-tooltip', {
					text: text,
					position: 'bottom',
					x: `${x}px`,
					y: `-${y}px`,
				});

			});

			parent.addEventListener('mouseleave', () => {
				this.emit('hide-tooltip');
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
		case 'volumeLow':
		case 'volumeMedium':
		case 'volumeHigh':
			return '(m)';
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
			return '(v)';
		case 'audio':
			return '(b)';
		case 'settings':
			return '';
		case 'fullscreen-enable':
		case 'fullscreen':
			return '(f)';
		default:
			return '';
		}

	};

	createUiButton(parent: HTMLElement, icon: string) {

		const button = this.createElement('button', icon)
			.addClasses(this.makeStyles('buttonStyles'))
			.appendTo(parent);

		button.ariaLabel = this.buttons[icon]?.title;

		return button;
	}

	#createSettingsButton(parent: HTMLDivElement, hovered = false) {
		if (!this.hasSpeeds() && !this.hasAudioTracks() && !this.hasTextTracks()) return;

		const settingsButton = this.createUiButton(
			parent,
			'settings'
		);

		this.createSVGElement(settingsButton, 'settings', this.buttons.settings, hovered);

		settingsButton.addEventListener('click', () => {
			this.emit('hide-tooltip');
			if (this.menuOpen && this.mainMenuOpen) {
				this.emit('show-menu', false);
			} else if (!this.menuOpen && this.mainMenuOpen) {
				this.emit('show-menu', true);
			} else if (this.menuOpen && !this.mainMenuOpen) {
				this.emit('show-main-menu', true);
				this.emit('show-menu', true);
			} else {
				this.emit('show-main-menu', true);
				this.emit('show-menu', true);
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				settingsButton.style.display = 'none';
			} else {
				settingsButton.style.display = 'flex';
			}
		});

		parent.append(settingsButton);
		return settingsButton;
	}

	#createBackButton(parent: HTMLDivElement, hovered = false) {
		if (!this.hasBackEventHandler) return;

		const backButton = this.createUiButton(
			parent,
			'back'
		);
		parent.appendChild(backButton);

		this.createSVGElement(backButton, 'back', this.buttons.back, false, hovered);

		backButton.addEventListener('click', () => {
			this.emit('hide-tooltip');
			this.emit('back');
		});

		this.on('pip-internal', (data) => {
			if (data) {
				backButton.style.display = 'none';
			} else {
				backButton.style.display = 'flex';
			}
		});

		return backButton;
	}

	#createCloseButton(parent: HTMLDivElement, hovered = false) {
		if (!this.hasCloseEventHandler) return;

		const closeButton = this.createUiButton(
			parent,
			'close'
		);
		parent.appendChild(closeButton);

		this.createSVGElement(closeButton, 'close', this.buttons.close, false, hovered);

		closeButton.addEventListener('click', () => {
			this.emit('hide-tooltip');
			this.emit('close');
		});

		this.on('pip-internal', (data) => {
			if (data) {
				closeButton.style.display = 'none';
			} else {
				closeButton.style.display = 'flex';
			}
		});

		return closeButton;
	}

	#createPlaybackButton(parent: HTMLElement, hovered = false) {
		const playbackButton = this.createUiButton(
			parent,
			'playback'
		);
		parent.appendChild(playbackButton);

		playbackButton.ariaLabel = this.buttons.play?.title;

		const pausedButton = this.createSVGElement(playbackButton, 'paused', this.buttons.play, false, hovered);
		const playButton = this.createSVGElement(playbackButton, 'playing', this.buttons.pause, true, hovered);

		playbackButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.togglePlayback();
			this.emit('hide-tooltip');
		});
		this.on('pause', () => {
			playButton.style.display = 'none';
			pausedButton.style.display = 'flex';
		});
		this.on('play', () => {
			pausedButton.style.display = 'none';
			playButton.style.display = 'flex';
		});
		this.on('item', () => {
			playButton.focus();
		});

		return playbackButton;
	}

	#createSeekBackButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile()) return;
		const seekBack = this.createUiButton(
			parent,
			'seekBack'
		);

		this.createSVGElement(seekBack, 'seekBack', this.buttons.seekBack, hovered);

		seekBack.addEventListener('click', () => {
			this.emit('hide-tooltip');
			this.rewindVideo();
		});

		this.on('pip-internal', (data) => {
			if (data) {
				seekBack.style.display = 'none';
			} else {
				seekBack.style.display = 'flex';
			}
		});

		parent.append(seekBack);
		return seekBack;
	}

	#createSeekForwardButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile()) return;
		const seekForward = this.createUiButton(
			parent,
			'seekForward'
		);

		this.createSVGElement(seekForward, 'seekForward', this.buttons.seekForward, hovered);

		seekForward.addEventListener('click', () => {
			this.emit('hide-tooltip');
			this.forwardVideo();
		});

		this.on('pip-internal', (data) => {
			if (data) {
				seekForward.style.display = 'none';
			} else {
				seekForward.style.display = 'flex';
			}
		});

		parent.append(seekForward);
		return seekForward;
	}

	#createTime(parent: HTMLDivElement, type: 'current' | 'remaining' | 'duration', classes: string[]) {
		const time = this.createElement('button', `${type}-time`)
			.addClasses([
				...classes,
				...this.makeStyles('timeStyles'),
				`${type}-time`,
			])
			.appendTo(parent);

		time.textContent = '00:00';

		switch (type) {
		case 'current':

			this.on('time', (data) => {
				time.textContent = this.humanTime(data.position);
			});

			this.on('currentScrubTime', (data: PlaybackState) => {
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

		this.on('pip-internal', (data) => {
			if (data) {
				time.style.display = 'none';
			} else {
				time.style.display = '';
			}
		});

		return time;
	}

	#createVolumeButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile()) return;

		const volumeContainer = this.createElement('div', 'volume-container')
			.addClasses(this.makeStyles('volumeContainerStyles'))
			.appendTo(parent);

		const volumeButton = this.createUiButton(
			volumeContainer,
			'volume'
		);
		volumeButton.ariaLabel = this.buttons.volumeHigh?.title;

		const volumeSlider = this.createElement('input', 'volume-slider')
			.addClasses(this.makeStyles('volumeSliderStyles'))
			.appendTo(volumeContainer);

		volumeSlider.type = 'range';
		volumeSlider.min = '0';
		volumeSlider.max = '100';
		volumeSlider.step = '1';
		volumeSlider.value = this.getVolume().toString();
		volumeSlider.style.backgroundSize = `${this.getVolume()}% 100%`;

		const mutedButton = this.createSVGElement(volumeButton, 'volumeMuted', this.buttons.volumeMuted, true, hovered);
		const lowButton = this.createSVGElement(volumeButton, 'volumeLow', this.buttons.volumeLow, true, hovered);
		const mediumButton = this.createSVGElement(volumeButton, 'volumeMedium', this.buttons.volumeMedium, true, hovered);
		const highButton = this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh, hovered);

		volumeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleMute();
			this.emit('hide-tooltip');
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
		}, {
			passive: true,
		});

		this.on('volume', (data) => {
			this.#volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			volumeSlider.style.backgroundSize = `${data.volume}% 100%`;
		});

		this.on('mute', (data) => {
			this.#volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			if (data.mute) {
				volumeSlider.style.backgroundSize = `${0}% 100%`;
			} else {
				volumeSlider.style.backgroundSize = `${this.getVolume()}% 100%`;
			}
		});

		return volumeContainer;
	}

	#volumeHandle(
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

	#createPreviousButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile()) return;

		const previousButton = this.createUiButton(
			parent,
			'previous'
		);
		previousButton.style.display = 'none';

		this.createSVGElement(previousButton, 'previous', this.buttons.previous, hovered);

		previousButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.previous();
			this.emit('hide-tooltip');
		});
		this.on('item', () => {
			if (this.getPlaylistItem().episode - 1 > 0) {
				previousButton.style.display = 'flex';
			} else {
				previousButton.style.display = 'none';
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				previousButton.style.display = 'none';
			} else if (this.getPlaylistItem().episode - 1 == 0) {
				previousButton.style.display = 'flex';
			}
		});

		previousButton.addEventListener('mouseenter', () => {

			const playerRect = previousButton.getBoundingClientRect();
			const tipRect = parent.getBoundingClientRect();

			let x = Math.abs((tipRect.left - playerRect.left) + 50);
			const y = Math.abs((tipRect.bottom - playerRect.bottom) - 60);

			if (x < 30) {
				x = 30;
			}

			if (x > (playerRect.right - playerRect.left) - 10) {
				x = (playerRect.right - playerRect.left) - 10;
			}

			this.emit('show-episode-tip', {
				direction: 'previous',
				position: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		previousButton.addEventListener('mouseleave', () => {
			this.emit('hide-episode-tip');
		});

		parent.appendChild(previousButton);
		return previousButton;
	}

	#createNextButton(parent: HTMLDivElement, hovered = false) {
		const nextButton = this.createUiButton(
			parent,
			'next'
		);
		nextButton.style.display = 'none';
		this.hasNextTip = true;

		this.createSVGElement(nextButton, 'next', this.buttons.next, false, hovered);

		nextButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.next();
			this.emit('hide-tooltip');
		});
		this.on('item', () => {
			if (this.isLastPlaylistItem()) {
				nextButton.style.display = 'none';
			} else {
				nextButton.style.display = 'flex';
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				nextButton.style.display = 'none';
			} else if (this.isLastPlaylistItem()) {
				nextButton.style.display = 'flex';
			}
		});

		nextButton.addEventListener('mouseenter', () => {

			const playerRect = nextButton.getBoundingClientRect();
			const tipRect = parent.getBoundingClientRect();

			let x = Math.abs((tipRect.left - playerRect.left) + 50);
			const y = Math.abs((tipRect.bottom - playerRect.bottom) - 60);

			if (x < 30) {
				x = 30;
			}

			if (x > (playerRect.right - playerRect.left) - 10) {
				x = (playerRect.right - playerRect.left) - 10;
			}

			this.emit('show-episode-tip', {
				direction: 'next',
				position: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		nextButton.addEventListener('mouseleave', () => {
			this.emit('hide-episode-tip');
		});

		parent.appendChild(nextButton);
		return nextButton;
	}

	#createRestartButton(parent: HTMLDivElement, hovered = false) {

		const restartButton = this.createUiButton(
			parent,
			'restart'
		);
		parent.appendChild(restartButton);

		this.createSVGElement(restartButton, 'restart', this.buttons.restart, false, hovered);

		restartButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.restart();
		});

		return restartButton;
	}

	#createCaptionsButton(parent: HTMLElement, hovered = false) {
		const captionButton = this.createUiButton(
			parent,
			'subtitles'
		);
		captionButton.style.display = 'none';
		captionButton.ariaLabel = this.buttons.subtitles?.title;

		const offButton = this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitlesOff, hovered);
		const onButton = this.createSVGElement(captionButton, 'subtitled', this.buttons.subtitles, true, hovered);

		captionButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.subtitlesMenuOpen) {
				this.emit('show-menu', false);
			} else {
				this.emit('show-subtitles-menu', true);
			}
		});

		this.on('captions', () => {
			if (this.getTextTracks().length > 0) {
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

		this.on('pip-internal', (data) => {
			if (data) {
				captionButton.style.display = 'none';
			} else if (this.hasTextTracks()) {
				captionButton.style.display = 'flex';
			}
		});

		parent.appendChild(captionButton);
		return captionButton;
	}

	#createAudioButton(parent: HTMLElement, hovered = false) {
		const audioButton = this.createUiButton(
			parent,
			'audio'
		);
		audioButton.style.display = 'none';
		audioButton.ariaLabel = this.buttons.language?.title;

		this.createSVGElement(audioButton, 'audio', this.buttons.languageOff, hovered);

		audioButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.languageMenuOpen) {
				this.emit('show-menu', false);
			} else {
				this.emit('show-language-menu', true);
			}
		});
		this.on('audio', (data) => {
			if (data.tracks.length > 1) {
				audioButton.style.display = 'flex';
			} else {
				audioButton.style.display = 'none';
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				audioButton.style.display = 'none';
			} else if (this.hasAudioTracks()) {
				audioButton.style.display = 'flex';
			}
		});

		parent.appendChild(audioButton);
		return audioButton;
	}

	#createQualityButton(parent: HTMLElement, hovered = false) {
		const qualityButton = this.createUiButton(
			parent,
			'quality'
		);
		qualityButton.style.display = 'none';

		const offButton = this.createSVGElement(qualityButton, 'low', this.buttons.quality, hovered);
		const onButton = this.createSVGElement(qualityButton, 'high', this.buttons.quality, true, hovered);

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.qualityMenuOpen) {
				this.emit('show-menu', false);
			} else {
				this.emit('show-quality-menu', true);
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

		this.on('pip-internal', (data) => {
			if (data) {
				qualityButton.style.display = 'none';
			} else if (this.hasQualities()) {
				qualityButton.style.display = 'flex';
			}
		});

		parent.appendChild(qualityButton);
		return qualityButton;
	}

	#createTheaterButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile() || !this.hasTheaterEventHandler) return;

		const theaterButton = this.createUiButton(
			parent,
			'theater'
		);

		this.createSVGElement(theaterButton, 'theater', this.buttons.theater, hovered);
		this.createSVGElement(theaterButton, 'theater-enabled', this.buttons.theaterExit, true, hovered);

		theaterButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.theaterModeEnabled) {
				this.theaterModeEnabled = false;
				theaterButton.querySelector<any>('.theater-enabled-icon').style.display = 'none';
				theaterButton.querySelector<any>('.theater-icon').style.display = 'flex';
				this.emit('theaterMode', false);
				this.emit('resize');
			} else {
				this.theaterModeEnabled = true;
				theaterButton.querySelector<any>('.theater-icon').style.display = 'none';
				theaterButton.querySelector<any>('.theater-enabled-icon').style.display = 'flex';
				this.emit('theaterMode', true);
				this.emit('resize');
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
		this.on('pip-internal', (data) => {
			if (data) {
				theaterButton.style.display = 'none';
			} else {
				theaterButton.style.display = 'flex';
			}
		});

		parent.appendChild(theaterButton);
		return theaterButton;
	}

	#createFullscreenButton(parent: HTMLElement, hovered = false) {
		const fullscreenButton = this.createUiButton(
			parent,
			'fullscreen'
		);

		this.createSVGElement(fullscreenButton, 'fullscreen-enabled', this.buttons.exitFullscreen, true, hovered);
		this.createSVGElement(fullscreenButton, 'fullscreen', this.buttons.fullscreen, hovered);

		fullscreenButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleFullscreen();
			this.emit('hide-tooltip');
		});
		this.on('fullscreen', (enabled) => {
			if (enabled) {
				fullscreenButton.querySelector<any>('.fullscreen-icon').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen-enabled-icon').style.display = 'flex';
			} else {
				fullscreenButton.querySelector<any>('.fullscreen-enabled-icon').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen-icon').style.display = 'flex';
			}
		});

		this.on('pip-internal', (enabled) => {
			if (enabled) {
				fullscreenButton.style.display = 'none';
			} else {
				fullscreenButton.style.display = 'flex';
			}
		});

		parent.appendChild(fullscreenButton);
		return fullscreenButton;

	}

	#createPlaylistsButton(parent: HTMLDivElement, hovered = false) {
		const playlistButton = this.createUiButton(
			parent,
			'playlist'
		);

		playlistButton.style.display = 'none';

		this.createSVGElement(playlistButton, 'playlist', this.buttons.playlist, hovered);

		playlistButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.playlistMenuOpen) {
				this.emit('show-menu', false);
			} else {
				this.emit('show-playlist-menu', true);
				this.emit('switch-season', this.getPlaylistItem().season);
			}
		});

		this.on('item', () => {
			if (this.hasPlaylists()) {
				playlistButton.style.display = 'flex';
			} else {
				playlistButton.style.display = 'none';
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				playlistButton.style.display = 'none';
			} else if (this.hasPlaylists()) {
				playlistButton.style.display = 'flex';
			}
		});

		parent.appendChild(playlistButton);
		return playlistButton;
	}

	#createSpeedButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile()) return;
		const speedButton = this.createUiButton(
			parent,
			'speed'
		);

		if (this.hasSpeeds()) {
			speedButton.style.display = 'flex';
		} else {
			speedButton.style.display = 'none';
		}

		this.createSVGElement(speedButton, 'speed', this.buttons.speed, hovered);

		speedButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			if (this.speedMenuOpen) {
				this.emit('show-menu', false);
			} else {
				this.emit('show-speed-menu', true);
			}
		});

		this.on('pip-internal', (data) => {
			if (data) {
				speedButton.style.display = 'none';
			} else if (this.hasSpeeds()) {
				speedButton.style.display = 'flex';
			}
		});

		parent.appendChild(speedButton);
		return speedButton;
	}

	#createPIPButton(parent: HTMLDivElement, hovered = false) {
		if (this.isMobile() || !this.hasPipEventHandler) return;
		const pipButton = this.createUiButton(
			parent,
			'pip'
		);

		if (this.hasPIP()) {
			pipButton.style.display = 'flex';
		} else {
			pipButton.style.display = 'none';
		}

		pipButton.ariaLabel = this.buttons.pipEnter?.title;

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter, hovered);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true, hovered);

		document.addEventListener('visibilitychange', () => {
			if (this.pipEnabled) {
				if (document.hidden) {
					if (document.pictureInPictureEnabled) {
						this.getVideoElement().requestPictureInPicture();
					}
				} else if (document.pictureInPictureElement) {
					document.exitPictureInPicture();
				}
			}
		});

		pipButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit('hide-tooltip');

			this.emit('controls', false);

			if (this.pipEnabled) {
				this.pipEnabled = false;
				pipButton.querySelector<any>('.pip-exit-icon').style.display = 'none';
				pipButton.querySelector<any>('.pip-enter-icon').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipEnter?.title;
				this.emit('pip-internal', false);
				this.emit('pip', false);
			} else {
				this.pipEnabled = true;
				pipButton.querySelector<any>('.pip-enter-icon').style.display = 'none';
				pipButton.querySelector<any>('.pip-exit-icon').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipExit?.title;
				this.emit('pip-internal', true);
				this.emit('pip', true);
				this.emit('show-menu', false);
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

	#createMenuFrame(parent: HTMLDivElement) {

		const menuFrame = this.createElement('div', 'menu-frame')
			.addClasses(this.makeStyles('menuFrameStyles'))
			.appendTo(parent);

		const menuContent = this.createElement('div', 'menu-content')
			.addClasses(this.makeStyles('menuContentStyles'))
			.appendTo(menuFrame);

		menuContent.style.maxHeight = `${this.getElement().getBoundingClientRect().height - 80}px`;

		this.on('resize', () => {
			this.#createCalcMenu(menuContent);
		});
		this.on('fullscreen', () => {
			this.#createCalcMenu(menuContent);
		});

		this.on('show-menu', (showing) => {
			this.menuOpen = showing;
			if (showing) {
				menuFrame.style.display = 'flex';
			} else {
				menuFrame.style.display = 'none';
			}
			menuContent.classList.add('nm-translate-x-0');
			menuContent.classList.remove('-nm-translate-x-[50%]');

			this.emit('show-language-menu', false);
			this.emit('show-subtitles-menu', false);
			this.emit('show-quality-menu', false);
			this.emit('show-speed-menu', false);
			this.emit('show-playlist-menu', false);
		});
		this.on('show-main-menu', (showing) => {
			this.mainMenuOpen = showing;
			if (showing) {
				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
				menuContent.classList.add('nm-translate-x-0');
				menuContent.classList.remove('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-language-menu', (showing) => {
			this.languageMenuOpen = showing;
			if (showing) {
				this.emit('show-main-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-subtitles-menu', (showing) => {
			this.subtitlesMenuOpen = showing;
			if (showing) {
				this.emit('show-main-menu', false);
				this.emit('show-language-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-quality-menu', (showing) => {
			this.qualityMenuOpen = showing;
			if (showing) {
				this.emit('show-main-menu', false);
				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-speed-menu', (showing) => {
			this.speedMenuOpen = showing;
			if (showing) {
				this.emit('show-main-menu', false);
				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuFrame.style.display = 'flex';
			}
		});
		this.on('show-playlist-menu', (showing) => {
			this.#createCalcMenu(menuContent);
			this.playlistMenuOpen = showing;
			if (showing) {
				this.emit('show-main-menu', false);
				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
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
				this.emit('show-menu', false);
				this.emit('show-main-menu', false);
				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
			}
		});

		return menuContent;
	}

	#createCalcMenu(menuContent: HTMLElement) {
		if (!this.getElement()) return;
		// setTimeout(() => {
		menuContent.style.maxHeight = `${this.getElement()?.getBoundingClientRect().height - 80}px`;
		this.emit('hide-tooltip');
		// }, 0);
	}

	#createMainMenu(parent: HTMLDivElement) {

		const main = this.createElement('div', 'main-menu')
			.addClasses(this.makeStyles('mainMenuStyles'))
			.appendTo(parent);

		main.style.transform = 'translateX(0)';

		this.addClasses(main, this.makeStyles('mainMenuStyles'));

		this.#createMenuButton(main, 'language');
		this.#createMenuButton(main, 'subtitles');
		this.#createMenuButton(main, 'quality');
		this.#createMenuButton(main, 'speed');
		this.#createMenuButton(main, 'playlist');

		this.#createSubMenu(parent);

		return main;
	}

	#createSubMenu(parent: HTMLDivElement) {

		const submenu = this.createElement('div', 'sub-menu')
			.addClasses(this.makeStyles('subMenuStyles'))
			.appendTo(parent);

		submenu.style.transform = 'translateX(0)';

		this.#createLanguageMenu(submenu);
		this.#createSubtitleMenu(submenu);
		this.#createQualityMenu(submenu);
		this.#createSpeedMenu(submenu);

		this.once('item', () => {
			this.#createEpisodeMenu(submenu);
		});

		return submenu;
	}

	#createMenuHeader(parent: HTMLDivElement, title: string, hovered = false) {
		const menuHeader = this.createElement('div', 'menu-header')
			.addClasses(this.makeStyles('menuHeaderStyles'))
			.appendTo(parent);

		if (title !== 'Episodes') {
			const back = this.createUiButton(
				menuHeader,
				'back'
			);
			this.createSVGElement(back, 'menu', this.buttons.chevronL, hovered);
			this.addClasses(back, ['nm-w-8']);
			back.classList.remove('nm-w-5');

			back.addEventListener('click', (event) => {
				event.stopPropagation();
				this.emit('show-main-menu', true);

				this.emit('show-language-menu', false);
				this.emit('show-subtitles-menu', false);
				this.emit('show-quality-menu', false);
				this.emit('show-speed-menu', false);
				this.emit('show-playlist-menu', false);
			});
		}

		const menuButtonText = this.createElement('span', 'menu-button-text')
			.addClasses(this.makeStyles('menuHeaderButtonTextStyles'))
			.appendTo(menuHeader);

		menuButtonText.textContent = this.localize(title).toTitleCase();

		// if (title == 'playlist') {
		// 	this.#createDropdown(menuHeader, title, `${this.localize('Season')} ${this.getPlaylistItem().season}`);
		// }

		if (title !== 'Seasons') {
			const close = this.createUiButton(
				menuHeader,
				'close'
			);

			this.createSVGElement(close, 'menu', this.buttons.close, hovered);
			this.addClasses(close, ['nm-ml-auto', 'nm-w-8']);
			close.classList.remove('nm-w-5');

			close.addEventListener('click', (event) => {
				event.stopPropagation();
				this.emit('show-menu', false);
				this.lock = false;
				this.emit('controls', false);
			});
		}

		return menuHeader;
	}

	#createMenuButton(parent: HTMLDivElement, item: string, hovered = false) {
		const menuButton = this.createElement('button', `menu-button-${item}`)
			.addClasses(this.makeStyles('menuButtonStyles'))
			.appendTo(parent);

		if (item !== 'speed') {
			menuButton.style.display = 'none';
		} else if (this.hasSpeeds()) {
			menuButton.style.display = 'flex';
		} else {
			menuButton.style.display = 'none';
		}

		this.createSVGElement(menuButton, 'menu', this.buttons[item], hovered);

		const menuButtonText = this.createElement('span', `menu-button-${item}`)
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(menuButton);

		menuButtonText.textContent = this.localize(item).toTitleCase();

		const chevron = this.createSVGElement(menuButton, 'menu', this.buttons.chevronR, hovered);
		this.addClasses(chevron, ['nm-ml-auto']);

		menuButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.emit(`show-${item}-menu`, true);
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
	};

	#createLanguageMenu(parent: HTMLDivElement) {
		const languageMenu = this.createElement('div', 'language-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.addClasses(languageMenu, ['nm-max-h-96']);

		this.#createMenuHeader(languageMenu, 'Language');

		const scrollContainer = this.createElement('div', 'language-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(languageMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.on('audio', (event) => {
			scrollContainer.innerHTML = '';
			for (const [index, track] of event.tracks?.entries() ?? []) {
				this.#createLanguageMenuButton(scrollContainer, {
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

		return languageMenu;
	}

	#createSubtitleMenu(parent: HTMLDivElement) {
		const subtitleMenu = this.createElement('div', 'subtitle-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);
		this.addClasses(subtitleMenu, ['nm-max-h-96']);

		this.#createMenuHeader(subtitleMenu, 'subtitles');

		const scrollContainer = this.createElement('div', 'subtitle-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(subtitleMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.on('captions', (event) => {
			scrollContainer.innerHTML = '';

			for (const [index, track] of event.tracks.entries() ?? []) {

				this.#createLanguageMenuButton(scrollContainer, {
					language: track.language,
					label: track.label,
					type: 'subtitle',
					index: index - 1,
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

		return subtitleMenu;
	}

	#createSpeedMenu(parent: HTMLDivElement, hovered = false) {
		const speedMenu = this.createElement('div', 'speed-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.addClasses(speedMenu, ['nm-max-h-96']);

		this.#createMenuHeader(speedMenu, 'speed');

		const scrollContainer = this.createElement('div', 'speed-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(speedMenu);

		scrollContainer.style.transform = 'translateX(0)';

		for (const speed of this.getSpeeds() ?? []) {
			const speedButton = document.createElement('div');
			speedButton.id = `speed-button-${speed}`;

			this.addClasses(speedButton, this.makeStyles('menuButtonStyles'));

			const spanChild = document.createElement('div');
			speedButton.append(spanChild);

			const speedButtonText = document.createElement('span');
			speedButtonText.classList.add('menu-button-text');
			this.addClasses(speedButtonText, this.makeStyles('speedButtonTextStyles'));

			speedButtonText.textContent = speed == 1 ? this.localize('Normal') : speed.toString();
			speedButton.append(speedButtonText);

			const chevron = this.createSVGElement(speedButton, 'menu', this.buttons.checkmark, hovered);
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
				this.emit('show-menu', false);
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

		return speedMenu;
	}

	#createQualityMenu(parent: HTMLDivElement) {
		const qualityMenu = this.createElement('div', 'quality-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);
		this.addClasses(qualityMenu, ['nm-max-h-96']);

		this.#createMenuHeader(qualityMenu, 'quality');

		const scrollContainer = this.createElement('div', 'quality-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(qualityMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.on('show-quality-menu', (showing) => {
			if (showing) {
				qualityMenu.style.display = 'flex';
			} else {
				qualityMenu.style.display = 'none';
			}
		});

		return qualityMenu;
	}

	#createLanguageMenuButton(parent: HTMLDivElement, data: { language: string, label: string, type: string, index: number, styled?: boolean; }, hovered = false) {

		const languageButton = this.createElement('button', `${data.type}-button-${data.language}`)
			.addClasses(this.makeStyles('languageButtonStyles'))
			.appendTo(parent);

		const languageButtonText = this.createElement('span', 'menu-button-text')
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(languageButton);

		if (data.type == 'subtitle') {
			if (data.label == 'segment-metadata') {
				languageButtonText.textContent = `${this.localize('Off')}`;
			} else if (data.styled) {
				languageButtonText.textContent = `${this.localize(data.language ?? '')} ${this.localize(data.label)} ${this.localize('styled')}`;
			} else {
				languageButtonText.textContent = `${data.language == 'off' ? '' : this.localize(data.language ?? '')} ${this.localize(data.label)}`;
			}
		} else if (data.type == 'audio') {
			languageButtonText.textContent = `${this.localize((data.language ?? data.label)
				?.replace('segment-metadata', 'Off'))}`;
		}

		// if (data.styled) {
		// 	const languageButtonIcon = this.createElement('span', 'menu-button-icon')
		// 		.addClasses(this.makeStyles('menuButtonTextStyles'))
		// 		.appendTo(languageButton);
		// 	const svg = this.createSVGElement(languageButtonIcon, 'styled', this.buttons.styled, hovered);
		// 	svg.setAttribute('tabindex', '-1');
		// }

		const chevron = this.createSVGElement(languageButton, 'checkmark', this.buttons.checkmark, hovered);
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

				let index = data.index;
				let currentTrack = track.track;

				if (this.isJwplayer) {
					index += 1;
					if (track.track == -1) {
						currentTrack = 0;
					}
				} else if (this.isVideojs) {
					if (track.track >= 0) {
						currentTrack -= 1;
					}
				}

				if (currentTrack == index) {
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

				if (this.getCurrentSrc()?.endsWith('.mp4')) {
					this.setTextTrack(data.index - 1);
				} else {
					this.setTextTrack(data.index);
				}
			}

			this.emit('show-menu', false);
		});

		languageButton.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				this.#getClosestElement(languageButton, '[id^="audio-button-"]')?.focus();
			} else if (e.key == 'ArrowRight') {
				this.#getClosestElement(languageButton, '[id^="subtitle-button-"]')?.focus();
			} else if (e.key == 'ArrowUp' && !this.options.disableTouchControls) {
				(languageButton.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.options.disableTouchControls) {
				(languageButton.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		return languageButton;
	}

	#createSeekRipple(parent: HTMLDivElement, side: string) {

		const seekRipple = this.createElement('div', 'seek-ripple')
			.addClasses(['seek-ripple', side])
			.appendTo(parent);

		const arrowHolder = this.createElement('div', 'seek-ripple-arrow')
			.addClasses(['seek-ripple-arrow'])
			.appendTo(seekRipple);

		const text = this.createElement('p', 'seek-ripple-text')
			.addClasses(['seek-ripple-text'])
			.appendTo(seekRipple);

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

		return seekRipple;
	};

	#createProgressBar(parent: HTMLDivElement) {

		this.sliderBar = this.createElement('div', 'slider-bar')
			.addClasses(this.makeStyles('sliderBarStyles'))
			.appendTo(parent);

		const sliderBuffer = this.createElement('div', 'slider-buffer')
			.addClasses(this.makeStyles('sliderBufferStyles'))
			.appendTo(this.sliderBar);

		const sliderHover = this.createElement('div', 'slider-hover')
			.addClasses(this.makeStyles('sliderHoverStyles'))
			.appendTo(this.sliderBar);

		const sliderProgress = this.createElement('div', 'slider-progress')
			.addClasses(this.makeStyles('sliderProgressStyles'))
			.appendTo(this.sliderBar);

		this.chapterBar = this.createElement('div', 'chapter-progress')
			.addClasses(this.makeStyles('chapterBarStyles'))
			.appendTo(this.sliderBar);

		const sliderNipple = document.createElement('div');
		this.addClasses(sliderNipple, this.makeStyles('sliderNippleStyles'));
		sliderNipple.id = 'slider-nipple';

		if (this.options.nipple != false) {
			this.sliderBar.append(sliderNipple);
		}

		const sliderPop = this.createElement('div', 'slider-pop')
			.addClasses(this.makeStyles('sliderPopStyles'))
			.appendTo(this.sliderBar);

		sliderPop.style.setProperty('--visibility', '0');
		sliderPop.style.opacity = 'var(--visibility)';

		this.sliderPopImage = this.createElement('div', 'slider-pop-image')
			.addClasses(this.makeStyles('sliderPopImageStyles'))
			.appendTo(sliderPop);

		const sliderText = this.createElement('div', 'slider-text')
			.addClasses(this.makeStyles('sliderTextStyles'))
			.appendTo(sliderPop);

		const chapterText = this.createElement('div', 'chapter-text')
			.addClasses(this.makeStyles('chapterTextStyles'))
			.appendTo(sliderPop);

		if (this.options.chapters != false && !this.isTv() && this.getChapters()?.length > 0) {
			this.sliderBar.style.background = 'transparent';
		}

		const join = this.getParameterByName('join');

		if (!join) {
			['mousedown', 'touchstart'].forEach((event) => {
				this.sliderBar.addEventListener(event, () => {
					if (this.isMouseDown) return;

					this.isMouseDown = true;
					this.isScrubbing = true;
				}, {
					passive: true,
				});
			});


			this.bottomBar.addEventListener('click', (e: any) => {
				this.emit('hide-tooltip');
				if (!this.isMouseDown) return;

				this.isMouseDown = false;
				this.isScrubbing = false;
				sliderPop.style.setProperty('--visibility', '0');
				const scrubTime = this.#getScrubTime(e);
				sliderNipple.style.left = `${scrubTime.scrubTime}%`;
				this.seek(scrubTime.scrubTimePlayer);
			}, {
				passive: true,
			});
		}

		['mousemove', 'touchmove'].forEach((event) => {
			this.sliderBar.addEventListener(event, (e: any) => {
				const scrubTime = this.#getScrubTime(e);
				this.#getSliderPopImage(scrubTime);
				sliderText.textContent = this.humanTime(scrubTime.scrubTimePlayer);

				const sliderPopOffsetX = this.#getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;

				if (this.options.chapters == false || this.getChapters()?.length == 0) {
					sliderHover.style.width = `${scrubTime.scrubTime}%`;
				}

				if (!this.isMouseDown) return;

				chapterText.textContent = this.#getChapterText(scrubTime.scrubTimePlayer);
				sliderNipple.style.left = `${scrubTime.scrubTime}%`;
				if (this.previewTime.length > 0) {
					sliderPop.style.setProperty('--visibility', '1');
				}
			}, {
				passive: true,
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
		}, {
			passive: true,
		});

		this.sliderBar.addEventListener('mouseleave', () => {
			sliderPop.style.setProperty('--visibility', '0');
			sliderHover.style.width = '0';
		}, {
			passive: true,
		});

		this.on('seeked', () => {
			sliderPop.style.setProperty('--visibility', '0');
		});

		this.on('item', () => {
			this.sliderBar.classList.add('nm-bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.width = '0';
			sliderProgress.style.width = '0';
			this.#fetchPreviewTime();
		});

		this.on('chapters', () => {
			if (this.getChapters()?.length > 0 && !this.isTv()) {
				this.sliderBar.classList.remove('nm-bg-white/20');
			} else {
				this.sliderBar.classList.add('nm-bg-white/20');
			}
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

		this.on('pip-internal', (data) => {
			if (data) {
				this.sliderBar.style.display = 'none';
			} else {
				this.sliderBar.style.display = 'flex';
			}
		});

		return this.sliderBar;
	}

	#createTvProgressBar(parent: HTMLDivElement) {

		this.sliderBar = this.createElement('div', 'slider-bar')
			.addClasses(this.makeStyles('sliderBarStyles'))
			.appendTo(parent);

		const sliderBuffer = this.createElement('div', 'slider-buffer')
			.addClasses(this.makeStyles('sliderBufferStyles'))
			.appendTo(this.sliderBar);

		const sliderProgress = this.createElement('div', 'slider-progress')
			.addClasses(this.makeStyles('sliderProgressStyles'))
			.appendTo(this.sliderBar);

		this.chapterBar = this.createElement('div', 'chapter-progress')
			.addClasses(this.makeStyles('chapterBarStyles'))
			.appendTo(this.sliderBar);

		this.on('item', () => {
			this.sliderBar.classList.add('nm-bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.width = '0';
			sliderProgress.style.width = '0';
			this.#fetchPreviewTime();
		});

		this.on('chapters', () => {
			if (this.getChapters()?.length > 0 && !this.isTv()) {
				this.sliderBar.classList.remove('nm-bg-white/20');
			} else {
				this.sliderBar.classList.add('nm-bg-white/20');
			}
		});

		this.on('time', (data) => {
			sliderBuffer.style.width = `${data.buffered}%`;
			sliderProgress.style.width = `${data.percentage}%`;
		});

		this.on('currentScrubTime', (data) => {
			sliderProgress.style.width = `${(data.position / data.duration) * 100}%`;
		});

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

	#createChapterMarker(chapter: Chapter) {
		const chapterMarker = this.createElement('div', `chapter-marker-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkersStyles'))
			.appendTo(this.chapterBar);
		chapterMarker.style.left = `${chapter.left}%`;
		chapterMarker.style.width = `calc(${chapter.width}% - 2px)`;

		this.createElement('div', `chapter-marker-bg-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerBGStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerBuffer = this.createElement('div', `chapter-marker-buffer-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerBufferStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerHover = this.createElement('div', `chapter-marker-hover-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerHoverStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerProgress = this.createElement('div', `chapter-marker-progress-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerProgressStyles'))
			.appendTo(chapterMarker);

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

		return chapterMarker;
	}

	#createChapterMarkers() {
		if (this.isTv()) return;

		this.chapterBar.style.background = 'transparent';

		this.on('item', () => {
			this.chapterBar.style.background = '';
		});

		this.chapterBar.querySelectorAll('.chapter-marker').forEach((element) => {
			this.chapterBar.classList.add('nm-bg-white/20');
			element.remove();
		});
		this.getChapters()?.forEach((chapter: Chapter) => {
			this.#createChapterMarker(chapter);
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

	#createThumbnail(time: PreviewTime) {
		this.thumbnail = this.createElement('div', `thumbnail-${time.start}`)
			.addClasses(this.makeStyles('thumbnailStyles'))
			.get();
		// .appendTo(parent);

		this.thumbnail.style.backgroundImage = this.image;
		this.thumbnail.style.backgroundPosition = `-${time.x}px -${time.y}px`;
		this.thumbnail.style.width = `${time.w}px`;
		this.thumbnail.style.height = `${time.h}px`;

		return this.thumbnail;
	}

	#getSliderPopImage(scrubTime: any) {

		const img = this.#loadSliderPopImage(scrubTime);

		if (img) {
			this.sliderPopImage.style.backgroundPosition = `-${img.x}px -${img.y}px`;
			this.sliderPopImage.style.width = `${img.w}px`;
			this.sliderPopImage.style.height = `${img.h}px`;
		}
	}

	#fetchPreviewTime() {
		if (this.previewTime.length === 0) {
			const imageFile = this.getSpriteFile();

			const img = new Image();
			this.once('item', () => {
				img.remove();
			});

			if (imageFile) {
				if (this.options.accessToken) {
					this.getFileContents({
						url: imageFile,
						options: {
							type: 'blob',
						},
						callback: (data) => {
							const dataURL = URL.createObjectURL(data as Blob);

							img.src = dataURL;

							if (this.isTv()) {
								this.image = `url('${dataURL}')`;
							} else {
								this.sliderPopImage.style.backgroundImage = `url('${dataURL}')`;
							}
							// release memory
							this.once('item', () => {
								URL.revokeObjectURL(dataURL);
							});
							setTimeout(() => {
								this.emit('preview-time', this.previewTime);
							}, 500);
						},
					}).then();
				} else {
					if (this.isTv()) {
						this.image = `url('${imageFile}')`;
					} else {
						this.sliderPopImage.style.backgroundImage = `url('${imageFile}')`;
					}

					img.src = imageFile;
					setTimeout(() => {
						this.emit('preview-time', this.previewTime);
					}, 500);
				}
			}

			const timeFile = this.getTimeFile();
			if (timeFile && this.currentTimeFile !== timeFile) {
				this.currentTimeFile = timeFile;

				img.onload = () => {

					this.getFileContents({
						url: timeFile,
						options: {
							type: 'text',
						},
						callback: (data) => {
							// eslint-disable-next-line max-len
							const regex
								= /(\d{2}:\d{2}:\d{2})\.\d{3}\s-->\s(\d{2}:\d{2}:\d{2})\.\d{3}\n([\w\d\.]+)\.(webp|jpg|png)#(xywh=\d+,\d+,\d+,\d+)/gmu;

							this.previewTime = [];

							let m: any;
							while ((m = regex.exec(data as string)) !== null) {
								if (m.index === regex.lastIndex) {
									regex.lastIndex += 1;
								}

								const data = m[5].split('=')[1].split(',');

								const scalingX = data[2] % this.thumbnailWidth;
								if (scalingX % 1 !== 0) {
									data[0] /= (scalingX / Math.round(scalingX));
									data[2] /= (scalingX / Math.round(scalingX));
								}
								if (scalingX > 1) {
									data[0] *= scalingX;
								}

								const scalingY = data[3] % this.thumbnailHeight;
								if (scalingY % 1 !== 0) {
									data[1] /= (scalingY / Math.round(scalingY));
									data[3] /= (scalingY / Math.round(scalingY));
								}
								if (scalingY > 1) {
									data[1] *= scalingY;
								}

								this.previewTime.push({
									start: this.convertToSeconds(m[1]) - 5,
									end: this.convertToSeconds(m[2]) - 5,
									x: data[0],
									y: data[1],
									w: data[2],
									h: data[3],
								});
							}

							setTimeout(() => {
								this.emit('preview-time', this.previewTime);
							}, 500);
						},
					}).then(() => {
						// this.#loadSliderPopImage(scrubTime);
					});
				};
			}
		}
	}

	#loadSliderPopImage(scrubTime?: any) {
		this.#fetchPreviewTime();

		let img = this.previewTime.find(
			(p: { start: number; end: number; }) => scrubTime.scrubTimePlayer >= p.start && scrubTime.scrubTimePlayer < p.end
		);
		if (!img) {
			img = this.previewTime.at(-1);
		}
		return img;
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

	#createOverlayCenterMessage(parent: HTMLDivElement) {
		const playerMessage = this.createElement('button', 'player-message')
			.addClasses(this.makeStyles('playerMessageStyles'))
			.appendTo(parent);

		this.on('display-message', (val: string | null) => {
			playerMessage.style.display = 'flex';
			playerMessage.textContent = val;
		});
		this.on('remove-message', () => {
			playerMessage.style.display = 'none';
			playerMessage.textContent = '';
		});

		return playerMessage;
	};


	#createEpisodeMenu(parent: HTMLDivElement) {

		const playlistMenu = this.createElement('div', 'playlist-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex-row',
				'!nm-gap-0',
			])
			.appendTo(parent);

		playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;

		this.getVideoElement().addEventListener('resize', () => {
			playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;
		});

		const subMenu = this.createElement('div', 'sub-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex',
				'!nm-w-1/3',
				'nm-border-r-2',
				'nm-border-gray-500/20',
			])
			.appendTo(playlistMenu);

		this.#createMenuHeader(subMenu, 'Seasons');

		const seasonScrollContainer = this.createElement('div', 'playlist-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(subMenu);
		seasonScrollContainer.style.transform = 'translateX(0)';

		seasonScrollContainer.innerHTML = '';
		for (const [, item] of this.unique(this.getPlaylist(), 'season').entries() ?? []) {
			this.#createSeasonMenuButton(seasonScrollContainer, item);
		}

		const episodeMenu = this.createElement('div', 'episode-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex',
				'!nm-w/2/3',
			])
			.appendTo(playlistMenu);

		this.#createMenuHeader(episodeMenu, 'Episodes');

		const scrollContainer = this.createElement('div', 'playlist-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(episodeMenu);

		scrollContainer.innerHTML = '';

		for (const [index, item] of this.getPlaylist().entries() ?? []) {
			this.#createEpisodeMenuButton(scrollContainer, item, index);
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

	#createSeasonMenuButton(parent: HTMLDivElement, item: PlaylistItem, hovered = false) {

		const seasonButton = this.createElement('button', `season-${item.id}`)
			.addClasses(this.makeStyles('menuButtonStyles'))
			.appendTo(parent);

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
				seasonButton.style.outline = '2px solid #fff';
			} else {
				seasonButton.classList.remove('active');
				seasonButton.style.backgroundColor = '';
				seasonButton.style.outline = '';
			}
		});

		const buttonSpan = this.createElement('span', `season-${item.id}-span`)
			.addClasses(this.makeStyles('menuButtonStyles'))
			.appendTo(seasonButton);

		buttonSpan.innerText = `Season ${item.season}`;

		const chevron = this.createSVGElement(seasonButton, 'menu', this.buttons.chevronR, hovered);
		this.addClasses(chevron, ['nm-ml-auto']);

		seasonButton.addEventListener('click', () => {
			this.emit('switch-season', item.season);
		});

		return seasonButton;
	}

	#createEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number) {

		const button = this.createElement('button', `playlist-${item.id}`)
			.addClasses(this.makeStyles('playlistMenuButtonStyles'))
			.appendTo(parent);

		if (this.getPlaylistItem().season !== 1) {
			button.style.display = 'none';
		}

		const leftSide = this.createElement('div', `playlist-${item.id}-left`)
			.addClasses(this.makeStyles('episodeMenuButtonLeftStyles'))
			.appendTo(button);

		this.createElement('div', `episode-${item.id}-shadow`)
			.addClasses(this.makeStyles('episodeMenuButtonShadowStyles'))
			.appendTo(leftSide);

		const image = this.createElement('img', `episode-${item.id}-image`)
			.addClasses(this.makeStyles('episodeMenuButtonImageStyles'))
			.appendTo(leftSide);
		image.setAttribute('loading', 'lazy');
		image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';


		const progressContainer = this.createElement('div', `episode-${item.id}-progress-container`)
			.addClasses(this.makeStyles('episodeMenuProgressContainerStyles'))
			.appendTo(leftSide);

		const progressContainerItemBox = this.createElement('div', `episode-${item.id}-progress-box`)
			.addClasses(this.makeStyles('episodeMenuProgressBoxStyles'))
			.appendTo(progressContainer);


		const progressContainerItemText = this.createElement('div', `episode-${item.id}-progress-item`)
			.addClasses(this.makeStyles('progressContainerItemTextStyles'))
			.appendTo(progressContainerItemBox);

		if (item.episode) {
			progressContainerItemText.innerText = `${this.localize('E')}${item.episode}`;
		}

		const progressContainerDurationText = this.createElement('div', `episode-${item.id}-progress-duration`)
			.addClasses(this.makeStyles('progressContainerDurationTextStyles'))
			.appendTo(progressContainerItemBox);
		progressContainerDurationText.innerText = item.duration?.replace(/^00:/u, '');

		const sliderContainer = this.createElement('div', `episode-${item.id}-slider-container`)
			.addClasses(this.makeStyles('sliderContainerStyles'))
			.appendTo(progressContainer);
		sliderContainer.style.display = item.progress ? 'flex' : 'none';

		const progressBar = this.createElement('div', `episode-${item.id}-progress-bar`)
			.addClasses(this.makeStyles('progressBarStyles'))
			.appendTo(sliderContainer);

		if (item.progress?.percentage) {
			progressBar.style.width = `${item.progress.percentage > 98 ? 100 : item.progress}%`;
		}

		const episodeMenuButtonRightSide = this.createElement('div', `episode-${item.id}-right-side`)
			.addClasses(this.makeStyles('episodeMenuButtonRightSideStyles'))
			.appendTo(button);


		const episodeMenuButtonTitle = this.createElement('span', `episode-${item.id}-title`)
			.addClasses(this.makeStyles('episodeMenuButtonTitleStyles'))
			.appendTo(episodeMenuButtonRightSide);

		if (item.episode) {
			episodeMenuButtonTitle.textContent = this.lineBreakShowTitle(item.title.replace(item.show, '').replace('%S', this.localize('S'))
				.replace('%E', this.localize('E')));
		}

		const episodeMenuButtonOverview = this.createElement('span', `episode-${item.id}-overview`)
			.addClasses(this.makeStyles('episodeMenuButtonOverviewStyles'))
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonOverview.textContent = this.limitSentenceByCharacters(item.description, 600);

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

		this.on('time', (data) => {
			if (this.getPlaylistItem()?.uuid == item.uuid) {
				progressBar.style.width = `${data.percentage}%`;
				sliderContainer.style.display = 'flex';
			}
		});

		if (item.episode) {
			progressContainerItemText.innerText
				= item.season == undefined ? `${item.episode}` : `${this.localize('S')}${item.season}: ${this.localize('E')}${item.episode}`;
		}

		button.addEventListener('click', () => {
			this.emit('show-menu', false);

			if (item.episode && item.season) {
				this.setEpisode(item.season, item.episode);
			} else {
				this.setPlaylistItem(index);
			}
			this.emit('playlist-menu-button-clicked', item);
		});

		return button;
	}

	#createToolTip(parent: HTMLDivElement) {
		this.tooltip = this.createElement('div', 'tooltip')
			.addClasses(this.makeStyles('tooltipStyles'))
			.appendTo(parent);

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

		return this.tooltip;
	}

	#createEpisodeTip(parent: HTMLDivElement) {

		const nextTip = this.createElement('div', 'episode-tip')
			.addClasses(this.makeStyles('nextTipStyles'))
			.appendTo(parent);

		// this.addClasses(nextTip, this.makeStyles('playlistMenuButtonStyles'));

		const leftSide = this.createElement('div', 'next-tip-left')
			.addClasses(this.makeStyles('nextTipLeftSideStyles'))
			.appendTo(nextTip);

		const image = this.createElement('img', 'next-tip-image')
			.addClasses(this.makeStyles('nextTipImageStyles'))
			.appendTo(leftSide);
		image.setAttribute('loading', 'eager');

		const rightSide = this.createElement('div', 'next-tip-right-side')
			.addClasses(this.makeStyles('nextTipRightSideStyles'))
			.appendTo(nextTip);

		const header = this.createElement('span', 'next-tip-header')
			.addClasses(this.makeStyles('nextTipHeaderStyles'))
			.appendTo(rightSide);

		const title = this.createElement('span', 'next-tip-title')
			.addClasses(this.makeStyles('nextTipTitleStyles'))
			.appendTo(rightSide);

		this.on('show-episode-tip', (data) => {
			this.#getTipData({ direction: data.direction, header, title, image });
			nextTip.style.display = 'flex';
			nextTip.style.transform = `translate(${data.x}, calc(${data.y} - 50%))`;
		});

		this.on('hide-episode-tip', () => {
			nextTip.style.display = 'none';
		});

		return nextTip;
	}

	#getTipDataIndex(direction: string) {
		let index: number;
		if (direction == 'previous') {
			index = this.getPlaylistItem().episode - 1 - 1;
		} else {
			index = this.getPlaylistIndex() + 1;
		}

		return this.getPlaylist().at(index);
	}

	#getTipData({ direction, header, title, image }:
		{ direction: string; header: HTMLSpanElement; title: HTMLSpanElement; image: HTMLImageElement; }) {

		const item = this.#getTipDataIndex(direction);
		if (!item) return;

		image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';
		if (item.episode) {
			header.textContent = `${this.localize(`${direction.toTitleCase()} Episode`)} ${this.getButtonKeyCode(direction)}`;
			title.textContent = `${this.localize('S')}${item.season} ${this.localize('E')}${item.episode}: ${this.lineBreakShowTitle(item.title.replace(item.show, '').replace('%S', this.localize('S'))
				.replace('%E', this.localize('E')))}`;
		}
		this.once('item', () => {
			this.#getTipData({ direction, header, title, image });
		});
	}

	cancelNextUp() {
		clearTimeout(this.timeout);
		this.nextUp.style.display = 'none';
	}

	#createNextUp(parent: HTMLDivElement) {

		this.nextUp = this.createElement('div', 'episode-tip')
			.addClasses(this.makeStyles('nextUpStyles'))
			.appendTo(parent) as HTMLDivElement & { firstChild: HTMLButtonElement; lastChild: HTMLButtonElement; };

		this.nextUp.style.display = 'none';

		const creditsButton = this.createElement('button', 'next-up-credits')
			.addClasses(this.makeStyles('nextUpCreditsButtonStyles'))
			.appendTo(this.nextUp);

		creditsButton.innerText = this.localize('Watch credits');

		const nextButton = this.createElement('button', 'next-up-next')
			.addClasses(this.makeStyles('nextUpNextButtonStyles'))
			.appendTo(this.nextUp);

		nextButton.setAttribute('data-label', this.localize('Next'));
		nextButton.setAttribute('data-icon', '▶︎');

		this.on('show-next-up', () => {
			this.nextUp.style.display = 'flex';
			this.timeout = setTimeout(() => {
				this.nextUp.style.display = 'none';
				if (this.isPlaying()) {
					this.next();
				}
			}, 4200);

			setTimeout(() => {
				nextButton.focus();
			}, 100);

		});

		creditsButton.addEventListener('click', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
		});

		nextButton.addEventListener('click', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
			this.next();
		});

		let enabled = false;
		this.on('item', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
			enabled = false;
		});

		this.once('playing', () => {
			this.on('time', (data) => {
				if (this.duration() > 0 && data.position > (this.duration() - 5) && !enabled && !this.isLastPlaylistItem()) {
					this.emit('show-next-up');
					enabled = true;
				}
			});
		});

		return this.nextUp;
	}

	#modifySpinner(parent: HTMLDivElement) {
		// console.log(parent);

		this.createElement('h2', 'loader')
			.addClasses(['loader'])
			.appendTo(parent);
		// h2.textContent = `${this.localize('Loading playlist')}...`;

		// const loader = document.createElement('div');
		// loader.id = 'loading';
		// loader.classList.add('loading');
		// loader.innerHTML = `
		// 	<div style="display:flex">
		// 		<span></span>
		// 		<span></span>
		// 		<span></span>
		// 		<span></span>
		// 		<span></span>
		// 		<span></span>
		// 		<span></span>
		// 	</div>
		// `;
		// loader.prepend(h2);

		// const loadingSpinner = document.createElement('div');

		// loadingSpinner.id = 'spinner';
		// loadingSpinner.innerHTML = '';
		// loadingSpinner.classList.add('spinner');
		// this.addClasses(loadingSpinner, [
		// 	'nm-flex',
		// 	'nm-justify-center',
		// 	'nm-items-center',
		// 	'nm-absolute',
		// 	'nm-left-0',
		// 	'nm-right-0',
		// 	'nm-top-0',
		// 	'nm-bottom-0',

		// ]);

		// loadingSpinner.append(loader);

		// this.on('duringplaylistchange', () => {
		// 	h2.textContent = `${this.localize('Loading playlist')}...`;
		// 	loadingSpinner.style.display = 'flex';
		// 	loadingSpinner.style.visibility = 'visible';
		// });
		// this.on('beforeplaylistitem', () => {
		// 	h2.textContent = `${this.localize('Loading playlist item')}...`;
		// 	loadingSpinner.style.display = 'flex';
		// 	loadingSpinner.style.visibility = 'visible';
		// });

		// this.on('item', () => {
		// 	loadingSpinner.style.display = 'none';
		// 	loadingSpinner.style.visibility = 'nm-hidden';
		// });

		// this.on('time', () => {
		// 	loadingSpinner.style.display = 'none';
		// 	loadingSpinner.style.visibility = 'nm-hidden';
		// });

		// this.on('bufferedEnd', () => {
		// 	loadingSpinner.style.display = 'none';
		// 	loadingSpinner.style.visibility = 'nm-hidden';
		// });

		// this.on('waiting', () => {
		// 	h2.textContent = `${this.localize('Buffering')}...`;
		// 	loadingSpinner.style.display = 'flex';
		// 	loadingSpinner.style.visibility = 'visible';
		// });

		// this.on('error', () => {
		// 	h2.style.display = 'flex';
		// 	h2.textContent = this.localize('Something went wrong trying to play this item');
		// 	loadingSpinner.style.display = 'flex';
		// 	loadingSpinner.style.visibility = 'visible';
		// 	// setTimeout(() => {
		// 	//     window.location.reload();
		// 	// }, 2500);
		// });

		// parent.appendChild(loadingSpinner);
		// return loadingSpinner;
	};

	#createSpinnerContainer(parent: HTMLDivElement) {

		const spinnerContainer = this.createElement('div', 'spinner-container')
			.addClasses(this.makeStyles('spinnerContainerStyles'))
			.appendTo(parent);

		const role = this.createElement('div', 'spinner-container')
			.addClasses(this.makeStyles('roleStyles'))
			.appendTo(spinnerContainer);

		role.setAttribute('role', 'status');

		this.#createSpinner(role);

		const status = this.createElement('span', 'status-text')
			.addClasses(this.makeStyles('statusTextStyles'))
			.appendTo(role);

		status.innerText = this.localize('Loading...');

		this.on('playing', () => {
			spinnerContainer.style.display = 'none';
		});

		this.on('waiting', () => {
			spinnerContainer.style.display = 'grid';
			status.innerText = `${this.localize('Buffering')}...`;
		});

		this.on('error', () => {
			spinnerContainer.style.display = 'none';
			status.innerText = this.localize('Something went wrong trying to play this item');
		});

		this.on('ended', () => {
			spinnerContainer.style.display = 'none';
		});

		this.on('time', () => {
			spinnerContainer.style.display = 'none';
		});

		this.on('bufferedEnd', () => {
			spinnerContainer.style.display = 'none';
		});

		this.on('stalled', () => {
			spinnerContainer.style.display = 'grid';
			status.innerText = `${this.localize('Buffering')}...`;
		});

		this.on('item', () => {
			spinnerContainer.style.display = 'grid';
		});

		return spinnerContainer;
	}

	#createSpinner(parent: HTMLDivElement) {

		const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		spinner.setAttribute('viewBox', '0 0 100 101');
		spinner.id = 'spinner';
		spinner.setAttribute('fill', 'none');

		this.addClasses(spinner, [
			'spinner-icon',
			...this.makeStyles('spinnerStyles'),
		]);

		parent.appendChild(spinner);

		const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path1.setAttribute('d', 'M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z');
		path1.setAttribute('fill', 'currentColor');
		spinner.appendChild(path1);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', 'M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z');
		path2.setAttribute('fill', 'currentFill');
		spinner.appendChild(path2);

	}

	createButton(match: string, id: string, insert: 'before'| 'after' = 'after', icon: Icon['path'], click?: () => void, rightClick?: () => void) {

		const element = document.querySelector<HTMLButtonElement>(`#${match}`);
		if (!element) {
			throw new Error('Element not found');
		}

		const button = this.createUiButton(element, id.replace(/\s/gu, '_'));
		button.ariaLabel = id;

		if (insert === 'before') {
			element?.before(button);
		} else {
			element?.after(button);
		}

		this.createSVGElement(button, `${id.replace(/\s/gu, '_')}-enabled`, icon, true, false);
		this.createSVGElement(button, id.replace(/\s/gu, '_'), icon, false);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			click?.();
			this.emit('hide-tooltip');
		});
		button.addEventListener('contextmenu', (event) => {
			event.stopPropagation();
			rightClick?.();
			this.emit('hide-tooltip');
		});

		return button;
	}
}
