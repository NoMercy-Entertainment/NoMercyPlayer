import {
	bottomBarStyles, bottomRowStyles, buttonBaseStyle, Buttons, buttons, buttonStyles,
	chapterMarkersStyles, dividerStyles, fluentIcons, Icons, iconStyles, overlayStyles,
	sliderBarStyles, sliderBufferStyles, sliderNippleStyles, sliderPopImageStyles, sliderPopStyles,
	sliderProgressStyles, timeStyles, topBarStyles, topRowStyles
} from './buttons.js';
import Functions from './functions.js';

import type { VideoPlayerOptions, VideoPlayer as Types, Chapter } from './buckyplayer.d';
export default class UI extends Functions {

	overlayStyles: string[] = [];
	topBarStyles: string[] = [];
	bottomBarStyles: string[] = [];

	buttonBaseStyle: string[] = [];
	fluentIcons: Icons = <Icons>{};
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


		this.createButton(
			topBar,
			'back'
		);


		this.createTime(
			topRow,
			'current',
			[]
		);
		this.createDivider(
			topRow,
			'/'
		);
		this.createTime(
			topRow,
			'duration',
			['mr-2']
		);

		this.createProgressBar(topRow);

		this.createPlaybackButton(bottomRow);

		this.createVolumeButton(bottomRow);

		this.createPreviousButton(bottomRow);

		this.createSeekBackButton(bottomRow);

		this.createNextButton(bottomRow);

		this.createSeekForwardButton(bottomRow);

		this.createDivider(
			bottomRow
		);

		this.createPlaylistsButton(bottomRow);
		this.createLanguageButton(bottomRow);
		this.createQualityButton(bottomRow);
		this.createTheaterButton(bottomRow);

		// this.createButton(
		//     bottomRow,
		//     'pip'
		// );
		// this.createButton(
		//     bottomRow,
		//     'speed'
		// );

		this.createButton(
			bottomRow,
			'settings'
		);

		this.createFullscreenButton(
			bottomRow
		);
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

	createSVGElement(parent: HTMLElement, id: string, icon: {path: string, classes: string[]}, hidden?: boolean) {
		parent.innerHTML += `
            <svg class="${id} ${icon!.classes.join(' ')}" viewBox="0 0 24 24" style="display: ${hidden ? 'none'	: ''};">
                <path d="${icon!.path}"></path>
            </svg>
        `;
		return parent;
	}

	createButton(parent: HTMLElement, id?: string, icon?: {path: string, classes: string[]}) {
		const button = document.createElement('button');
		id = id ?? 'button';

		button.id = id;

		if (!icon) {
			icon = this.buttons[id];
		}

		const classes = this.buttonStyles;
		classes.push(id);
		this.addClasses(button, classes);

		this.createSVGElement(button, id, icon);

		parent.appendChild(button);
		return button;
	}

	createSeekBackButton(bottomRow: HTMLDivElement) {
		const seekBack = this.createButton(
			bottomRow,
			'seekBack'
		);
		seekBack.addEventListener('click', () => {
			this.rewindVideo(this.options.seekInterval);
		});
	}

	createSeekForwardButton(bottomRow: HTMLDivElement) {
		const seekForward = this.createButton(
			bottomRow,
			'seekForward'
		);
		seekForward.addEventListener('click', () => {
			this.forwardVideo(this.options.seekInterval);
		});

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
			console.log('seeked');
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
					sliderNipple.style.display = 'flex';
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
					sliderNipple.style.display = 'none';
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
				// console.log(scrubTime);
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
			this.getFileContents({
				url: this.getCurrentTimeFile(),
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

	createTime(parent: HTMLDivElement, type: string, classes: string[]) {
		const div = document.createElement('div');
		div.textContent = '00:00';

		this.addClasses(div, [
			...classes,
			...this.buttonStyles,
			...this.timeStyles,
			`${type}-time`,
		]);

		switch (type) {
		case 'current':

			this.on('time', (data) => {
				div.textContent = this.humanTime(data.position);
			});
			break;

		case 'remaining':

			this.on('duration', (data) => {
				if (data.remaining === Infinity) {
					div.textContent = 'Live';
				} else {
					div.textContent = this.humanTime(data.remaining);
				}
			});

			this.on('time', (data) => {
				if (data.remaining === Infinity) {
					div.textContent = 'Live';
				} else {
					div.textContent = this.humanTime(data.remaining);
				}
			});
			break;

		case 'duration':
			this.on('duration', (data) => {
				if (data.duration === Infinity) {
					div.textContent = 'Live';
				} else {
					div.textContent = this.humanTime(data.duration);
				}
			});
			break;

		default:
			break;
		}

		parent.append(div);
		return div;
	}

	createVolumeButton(parent: HTMLDivElement) {
		const button = document.createElement('button');
		button.id = 'volume';

		this.addClasses(button, [
			...this.buttonStyles,
			'volume',
		]);

		this.createSVGElement(button, 'volumeMuted', this.buttons.volumeMuted, true);
		this.createSVGElement(button, 'volumeLow', this.buttons.volumeLow, true);
		this.createSVGElement(button, 'volumeMedium', this.buttons.volumeMedium, true);
		this.createSVGElement(button, 'volumeHigh', this.buttons.volumeHigh);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleMute();
		});

		this.on('volume', () => {
			if (this.isMuted()) {
				button.querySelector<any>('.volumeHigh').style.display = 'none';
				button.querySelector<any>('.volumeMuted').style.display = 'flex';
			} else {
				button.querySelector<any>('.volumeMuted').style.display = 'none';
				button.querySelector<any>('.volumeHigh').style.display = 'flex';
			}
		});
		this.on('mute', () => {
			if (this.isMuted()) {
				button.querySelector<any>('.volumeHigh').style.display = 'none';
				button.querySelector<any>('.volumeMuted').style.display = 'flex';
			} else {
				button.querySelector<any>('.volumeMuted').style.display = 'none';
				button.querySelector<any>('.volumeHigh').style.display = 'flex';
			}
		});

		parent.append(button);
		return button;
	}

	createPlaybackButton(parent: HTMLElement) {
		const button = document.createElement('button');

		button.id = 'playback';

		this.addClasses(button, [
			...this.buttonStyles,
			'playback',
		]);

		this.createSVGElement(button, 'paused', this.buttons.play);
		this.createSVGElement(button, 'playing', this.buttons.pause, true);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			this.togglePlayback();
		});
		this.player.on('pause', () => {
			button.querySelector<any>('.playing').style.display = 'none';
			button.querySelector<any>('.paused').style.display = 'flex';
		});
		this.player.on('play', () => {
			button.querySelector<any>('.paused').style.display = 'none';
			button.querySelector<any>('.playing').style.display = 'flex';
		});

		parent.appendChild(button);
		return button;
	}

	createPreviousButton(bottomBar: HTMLDivElement) {
		const button = document.createElement('button');

		button.id = 'previous';
		button.style.display = 'none';

		this.addClasses(button, [
			...this.buttonStyles,
			'previous',
		]);

		this.createSVGElement(button, 'previous', this.buttons.previous);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			this.previous();
		});
		this.on('item', () => {
			if (this.getCurrentPlaylistIndex() > 0) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		bottomBar.appendChild(button);
		return button;
	}

	createNextButton(bottomBar: HTMLDivElement) {
		const button = document.createElement('button');

		button.id = 'next';
		button.style.display = 'none';

		this.addClasses(button, [
			...this.buttonStyles,
			'next',
		]);

		this.createSVGElement(button, 'next', this.buttons.next);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			this.next();
		});
		this.on('item', () => {
			if (this.isLastPlaylistItem()) {
				button.style.display = 'none';
			} else {
				button.style.display = 'flex';
			}
		});

		bottomBar.appendChild(button);
		return button;
	}

	subsEnabled = false;
	createLanguageButton(parent: HTMLElement) {
		const button = document.createElement('button');

		button.id = 'language';
		button.style.display = 'none';

		this.addClasses(button, [
			...this.buttonStyles,
			'language',
		]);

		this.createSVGElement(button, 'subtitle', this.buttons.subtitlesHover);
		this.createSVGElement(button, 'subtitled', this.buttons.subtitles, true);

		button.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.subsEnabled) {
				this.subsEnabled = false;
				button.querySelector<any>('.subtitled').style.display = 'none';
				button.querySelector<any>('.subtitle').style.display = 'flex';
				this.setTextTrack(-1);
			} else {
				this.subsEnabled = true;
				button.querySelector<any>('.subtitle').style.display = 'none';
				button.querySelector<any>('.subtitled').style.display = 'flex';
				this.setTextTrack(1);
			}

			// this.toggleLanguage();
		});
		this.on('item', () => {
			if (this.hasTextTracks() || this.hasAudioTracks()) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		parent.appendChild(button);
		return button;
	}

	highQuality = false;
	createQualityButton(parent: HTMLElement) {
		const button = document.createElement('button');

		button.id = 'quality';
		button.style.display = 'none';

		this.addClasses(button, [
			...this.buttonStyles,
			'quality',
		]);

		this.createSVGElement(button, 'low', this.buttons.quality);
		this.createSVGElement(button, 'high', this.buttons.qualityHover, true);

		button.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.highQuality) {
				this.highQuality = false;
				button.querySelector<any>('.high').style.display = 'none';
				button.querySelector<any>('.low').style.display = 'flex';
			} else {
				this.highQuality = true;
				button.querySelector<any>('.low').style.display = 'none';
				button.querySelector<any>('.high').style.display = 'flex';
			}

			// this.toggleLanguage();
		});

		this.on('item', () => {
			if (this.hasQualities()) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		parent.appendChild(button);
		return button;
	}

	theaterModeEnabled = false;
	createTheaterButton(bottomBar: HTMLDivElement) {
		const button = document.createElement('button');

		button.id = 'theater';

		this.addClasses(button, [
			...this.buttonStyles,
			'theater',
		]);

		this.createSVGElement(button, 'theater', this.buttons.theater);
		this.createSVGElement(button, 'theater-enable', this.buttons.theaterHover, true);

		button.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.theaterModeEnabled) {
				this.theaterModeEnabled = false;
				button.querySelector<any>('.theater-enable').style.display = 'none';
				button.querySelector<any>('.theater').style.display = 'flex';
				this.dispatchEvent('theaterMode', false);
			} else {
				this.theaterModeEnabled = true;
				button.querySelector<any>('.theater').style.display = 'none';
				button.querySelector<any>('.theater-enable').style.display = 'flex';
				this.dispatchEvent('theaterMode', true);
			}

			// this.toggleLanguage();
		});

		bottomBar.appendChild(button);
		return button;
	}

	createFullscreenButton(parent: HTMLElement) {

		const button = document.createElement('button');

		button.id = 'fullscreen';

		this.addClasses(button, [
			...this.buttonStyles,
			'fullscreen',
		]);

		this.createSVGElement(button, 'fullscreen-enable', this.buttons.exitFullscreen, true);
		this.createSVGElement(button, 'fullscreen', this.buttons.fullscreen);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			this.toggleFullscreen();
		});
		this.on('fullscreen', () => {
			if (this.isFullscreen()) {
				button.querySelector<any>('.fullscreen').style.display = 'none';
				button.querySelector<any>('.fullscreen-enable').style.display = 'flex';
			} else {
				button.querySelector<any>('.fullscreen-enable').style.display = 'none';
				button.querySelector<any>('.fullscreen').style.display = 'flex';
			}
		});

		parent.appendChild(button);
		return button;

	}

	createPlaylistsButton(parent: HTMLDivElement) {
		const button = document.createElement('button');

		button.id = 'playlist';
		button.style.display = 'none';

		this.addClasses(button, [
			...this.buttonStyles,
			'playlist',
		]);

		this.createSVGElement(button, 'playlist', this.buttons.playlist);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			console.log(this.getPlaylist());
			// this.togglePlaylists();
		});

		this.on('item', () => {
			if (this.hasPlaylists()) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		parent.appendChild(button);
		return button;
	}

}
