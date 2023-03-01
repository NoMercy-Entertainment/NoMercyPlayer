import {
    bottomBarStyles, bottomRowStyles, buttonBaseStyle, Buttons, buttons, buttonStyles, fluentIcons,
    Icons, iconStyles, overlayStyles, topBarStyles, topRowStyles
} from './buttons.js';
import Functions from './functions.js';

import type { VideoPlayerOptions, VideoPlayer as Types } from "./buckyplayer.d";
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


    constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
        super(playerType, options, playerId);
        
        this.on('ready', () => {

            this.overlayStyles = overlayStyles;
            this.topBarStyles = topBarStyles;
            this.bottomBarStyles = bottomBarStyles;
            this.topRowStyles = topRowStyles;
            this.bottomRowStyles = bottomRowStyles;

            this.buttonBaseStyle = buttonBaseStyle;
            this.fluentIcons = fluentIcons;
            this.buttonStyles = buttonStyles;
            this.iconStyles = iconStyles;
            this.buttons = buttons(this.options);

            this.buildUI();
        });
    }

    addClasses(el: HTMLElement, names: string[]) {
        for (const name of names.filter(Boolean)) {
            el.classList.add(name);
        }
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
        
        this.overlay = overlay;
        
        if (!this.getElement().querySelector('#overlay')){
            this.getElement().prepend(overlay);
        }
        
        overlay.addEventListener('mousemove', () => {
            this.dynamicControls();
        });

        const topBar = this.createTopBar(overlay);

        const bottomBar = this.createBottomBar(overlay);

        const topRow = this.createTopRow(bottomBar);

        const bottomRow = this.createBottomRow(bottomBar);

        
        this.createButton(
            topBar, 
            'back', 
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

        const seekBack = this.createButton(
            bottomRow, 
            'seekBack', 
        );
        seekBack.addEventListener('click', () => {
            this.rewindVideo();
        });

        this.createNextButton(bottomRow);

        const seekForward = this.createButton(
            bottomRow, 
            'seekForward', 
        ); 
        seekForward.addEventListener('click', () => {
            this.forwardVideo();
        });


        this.createDivider(
            bottomRow, 
        );

        this.createPlaylistsButton(bottomRow);
        this.createLanguageButton(bottomRow);
        this.createQualityButton(bottomRow);
        this.createTheaterButton(bottomRow);

        // this.createButton(
        //     bottomRow, 
        //     this.buttonStyles,
        //     'pip', 
        // );
        // this.createButton(
        //     bottomRow, 
        //     this.buttonStyles,
        //     'speed', 
        // );
        
        this.createButton(
            bottomRow, 
            'settings', 
        );
        
        this.createFullscreenButton(
            bottomRow, 
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

        this.addClasses(divider, [
            'divider',
            'flex',
        ]);
        
        if (content) {
            divider.innerHTML = content;
        } else { 
            this.addClasses(divider, [
                'flex-1',
            ]);
        }

        parent.appendChild(divider);

        return divider;
    }

    createSVGElement(parent: HTMLElement, id: string, icon: {path: string, classes: string[]}, hidden?: boolean) {
        parent.innerHTML += `
            <svg class="${id} ${icon!.classes.join(' ')}" viewBox="0 0 24 24" style="display: ${hidden ? 'none' : ''};">
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



    createProgressBar(parent: HTMLDivElement) {
        const sliderBar = document.createElement('div');
        this.addClasses(sliderBar, [
            'slider',
            'flex',
            'bg-white',
            'relative',
            'h-2',
            'w-full',
            'rounded-full',
            'overflow-clip',
            'outline-l-red-400'
        ]);

        const sliderBuffer = document.createElement('div');
        sliderBuffer.id = 'slider-buffer';
        this.addClasses(sliderBuffer, [
            'slider-buffer',
            'flex',
            'bg-red-300',
            'absolute',
            'h-2',
            'z-0',
            'rounded-r-full',
        ]);

        const sliderProgress = document.createElement('div');
        sliderProgress.id = 'slider-progress';
        this.addClasses(sliderProgress, [
            'slider-progress',
            'flex',
            'bg-red-600',
            'absolute',
            'h-2',
            'z-10',
            'rounded',
            'rounded-r-full',
        ]);
        sliderBar.append(sliderProgress);

        sliderBar.append(sliderBuffer);

        this.on('seeked', () => {
            // sliderPop.style.setProperty('--visibility', 'hidden');
            // sliderNipple.style.display = 'none';

            // this.player.nomercy.hideControls();
        });

        this.on('time', (data) => {
            sliderBuffer.style.width = `${data.buffered}%`;
            sliderProgress.style.width = `${data.percentage}%`;
        });

        sliderBar.addEventListener('mouseover', (e) => {
            // console.log('mouse over', e);
            // sliderPop.style.setProperty('--visibility', 'hidden');
            // player.currentTime(scrubTimePlayer);
        });
        sliderBar.addEventListener('mouseleave', (e) => {
            // console.log('mouse leave', e);
            // sliderPop.style.setProperty('--visibility', 'hidden');
            // sliderNipple.style.display = 'none';
        });

        sliderBar.addEventListener('mousemove', (e) => {
            // console.log('mouse move', e);

        });
    
        
        parent.append(sliderBar);
        return sliderBar;
    }

    createTime(parent: HTMLDivElement, type: string, classes: string[]) {
        const div = document.createElement('div');
        div.textContent = '00:00';

        this.addClasses(div, [
            ...classes,
            ...this.buttonStyles,
            'flex',
            'font-mono',
            'text-sm',
            'items-center',
            'select-none',
            'time',
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
            'volume'
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
            'playback'
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
            'previous'
        ]);
        
        this.createSVGElement(button, 'previous', this.buttons.previous);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            this.previous();
        });
		this.on('playlistitem', () => {
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
            'next'
        ]);
        
        this.createSVGElement(button, 'next', this.buttons.next);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            this.next();
        });
		this.on('playlistitem', () => {
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
            'language'
        ]);

        this.createSVGElement(button, 'subtitle', this.buttons.subtitlesHover);
        this.createSVGElement(button, 'subtitled', this.buttons.subtitles, true);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            
            if(this.subsEnabled) {
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
		this.on('playlistitem', () => {
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
            'quality'
        ]);

        this.createSVGElement(button, 'low', this.buttons.quality);
        this.createSVGElement(button, 'high', this.buttons.qualityHover, true);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            
            if(this.highQuality) {
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

		this.on('playlistitem', () => {
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
            'theater'
        ]);

        this.createSVGElement(button, 'theater', this.buttons.theater);
        this.createSVGElement(button, 'theater-enable', this.buttons.theaterHover, true);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            
            if(this.theaterModeEnabled) {
                this.theaterModeEnabled = false;
                button.querySelector<any>('.theater-enable').style.display = 'none';
                button.querySelector<any>('.theater').style.display = 'flex';
            } else {
                this.theaterModeEnabled = true;
                button.querySelector<any>('.theater').style.display = 'none';
                button.querySelector<any>('.theater-enable').style.display = 'flex';
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
            'fullscreen'
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
            'playlist'
        ]);

        this.createSVGElement(button, 'playlist', this.buttons.playlist);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            // this.togglePlaylists();
        });

        this.on('playlistitem', () => {
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