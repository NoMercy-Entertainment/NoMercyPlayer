import type { VideoPlayerOptions, VideoPlayer as Types } from "buckyplayer.d";

export class VideoPlayer {
    playerType: Types['playerType'] = undefined;
    playerId: string = '';
    options: VideoPlayerOptions = <VideoPlayerOptions>{};

    isJwplayer: boolean = false;
    isVideojs: boolean = false;
    setupTime: number = 0;
    player: Types['player'] = <Types['player']>{};
    events: string[] = [];

    jwplayerVersion = '8.26.7';
    videojsVersion = '8.0.4';
    videojsPlaylistVersion = '5.0.0';
    
	message: NodeJS.Timeout = <NodeJS.Timeout>{};

    constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
        this.setupTime = Date.now();
        
        if(!playerId) {
            if (playerType === 'jwplayer') {
                this.playerId = 'jwplayer';
            } else if (playerType === 'videojs') {
                this.playerId = 'videojs';
            }
        } else {
            this.playerId = playerId;
        }
        
        this.playerType = playerType;
        this.options = options;

        this.#overrides();

        if (playerType === 'videojs') {
            this.isVideojs = true;
            this.isJwplayer = false;

            this.#appendScriptFilesToDocument(options.scriptFiles ?? [
                `https://vjs.zencdn.net/${this.videojsVersion}/video.min.js`,
                `https://cdn.jsdelivr.net/npm/videojs-playlist@${this.videojsPlaylistVersion}/dist/videojs-playlist.min.js`,
                `https://vjs.zencdn.net/${this.videojsVersion}/video-js.css`,
            ])
                .then(() => {
                    this.player = window.videojs(this.playerId, this.options);
                    this.#loadPlaylist();

                    window.videojs.log.level('off'); 

                    const groupCollapsed = window.console.groupCollapsed;
                    window.console.groupCollapsed = (e) => {
                        if(e.includes('Text Track parsing errors')){
                            return;
                        }
                        groupCollapsed(e);
                    } 
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
        } else if (playerType === 'jwplayer') {
            this.isJwplayer = true;
            this.isVideojs = false;

            this.#appendScriptFilesToDocument(options.scriptFiles ?? [
                `https://ssl.p.jwpcdn.com/player/v/${this.jwplayerVersion}/jwplayer.js`
            ])
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
        } else {
            throw new Error(`Invalid player type: ${this.playerId}`);
        }
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
            //@ts-expect-error
            this.options.autostart = this.options.autoplay;

            //@ts-expect-error
            if (this.options.displaytitle === undefined) {
                //@ts-expect-error
                this.options.displaytitle = false;
            }
            //@ts-expect-error
            if (this.options.displaydescription === undefined) {
                //@ts-expect-error
                this.options.displaydescription  = false;
            }
        } else { 
            // Videojs
            if (this.options.playerVersion !== undefined) {
                this.jwplayerVersion = this.options.playerVersion;
            }
            if (this.options.playerVersion !== undefined) {
                this.videojsVersion = this.options.playerVersion;
            }
        }
    }

    #init() {
        this.events.forEach(event => {
            this.player.on(event, (data: any) => {
                switch (event) {                    
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
                    case 'beforeplaylistitem':
                        break;
                    case 'buffer':
                        break;
                    case 'ready':
                    case 'canplay':
                        this.#dispatchEvent('ready', this.#getReadyState(data));
                        break;
                    case 'canplaythrough':
                        break;
                    case 'complete': //jwplayer
                        break;
                    case 'controls':
                        break;
                    case 'displayClick':
                        break;
                    case 'duringplaylistchange':
                        break;
                    case 'ended': //videojs
                        break;
                    case 'error':
                        this.#dispatchEvent('error', data);
                        break;
                    case 'fullscreen':
                        break;
                    case 'fullscreenchange': //videojs
                        break;
                    case 'idle': //jwplayer
                        break;
                    case 'loadeddata': //videojs
                        break;
                    case 'loadedmetadata': //videojs
                        break;
                    case 'loadstart': //videojs
                        break;
                    case 'mute':
                        this.#dispatchEvent('mute', data);
                        break;
                    case 'pause':
                        this.#dispatchEvent('pause', {data: 'pause'});
                        break;
                    case 'play':
                        this.#dispatchEvent('play', data);
                        break;
                    case 'firstFrame': //jwplayer aka playing
                        break;
                    case 'playing': //videojs
                        break;
                    case 'playlist':
                        break;
                    case 'playlistItem':
                        break;
                    case 'playlistchange':
                        break;
                    case 'playlistitem':
                        break;
                    case 'playlistsorted':
                        break;
                    case 'ratechange':
                        break;
                    case 'resize':
                        break;
                    case 'seek':
                        break;
                    case 'seeked': //both
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
                        this.#dispatchEvent('time', this.#getTimeState(data));
                        break;
                    case 'volume':
                    case 'volumechange':
                        this.#dispatchEvent('volume', this.#getVolumeState(data));
                        break;
                    case 'waiting':
                        break;
                }
            });
        });
        this.eventListeners()
    }
    
    eventListeners() {
        
    }
    
    #getReadyState(data: { setupTime: number; }) {
        if (this.isJwplayer) {
            data.setupTime = Date.now() - this.setupTime;
            return data;
        } else {
            return {
                setupTime: Date.now() - this.setupTime,
                viewable: this.isInViewport(),
                type: "ready"
            };
        }
    }
    #getTimeState(data: { position: number; duration: number; type: any; viewable: any; }) {
        if (this.isJwplayer) {
            return {
                position: data.position,
                duration: data.duration,
                remaining: data.duration - data.position,
                buffered: (((data.position + this.player.getBuffer()) / data.duration) * 100),
                percentage: (data.position / data.duration) * 100,
                type: data.type,
                viewable: data.viewable,
            };
        } else {
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
                type: "time",
                viewable: this.isInViewport(),
            }
        }
    }
    #getVolumeState(data: any) {
        if (this.isJwplayer) {
            return data;
        } else {
            return {
                volume: this.getVolume(), 
                type: 'volume'
            }
        }
    }

    #loadPlaylist() { 
        if (typeof this.options.playlist === 'string') {
            fetch(this.options.playlist)
                .then((response) => {
                    return response.json();
                })
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

                if(!file) return reject(new Error('File could not be loaded'));

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
    
    #dispatchEvent(eventType: string, data: any) {
        if(!data || typeof data === 'string'){
            data = data ?? ''
        } else if (typeof data === 'object') {
            data = {...(data ?? {})};
        }
        
        this.getElement().parentElement?.dispatchEvent(new CustomEvent(eventType, { 
            detail: data 
        }));
    }

    displayMessage(data: any, time = 2000) {
        clearTimeout(this.message);
        this.#dispatchEvent('displayMessage', data);
		this.message = setTimeout(() => {
            this.#dispatchEvent('removeMessage', data);
		}, time);
	}

    getElement(): HTMLElement {
        return document.getElementById(this.playerId) as HTMLElement;
    }

    on(event: any, callback: (arg0: any) => any) {
        this.getElement().parentElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail));
    }
    off(event: any, callback: (arg0: any) => any) {
        this.getElement().parentElement?.removeEventListener(event, (e: { detail: any; }) => callback(e.detail));
    }
    once(event: any, callback: (arg0: any) => any) {
        this.getElement().parentElement?.addEventListener(event, (e: { detail: any; }) => callback(e.detail), { once: true });
    }

    isInViewport() {
        if (this.isJwplayer) {
            return this.player.getViewable();
        } else {
            const rect = this.player.el_.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        
            const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
            const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

            return (vertInView && horInView);
        }
    }

    isPlaying() {
        if (this.isJwplayer) {
            return this.player.getState() === 'playing';
        } else {
            return !this.player.paused();
        }
    }
    play() {
        this.player.play();
    }
    pause() {
        this.player.pause();
    }
    togglePlayback = () => {
        if (this.isPlaying()) {
            this.play();
        } else {
            this.pause();
        }
    }

    isMuted() {
        if (this.isJwplayer) {
            return this.player.getMute();
        } else {
            return this.player.muted();
        }
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
    toggleMute = () => {
        if (this.isMuted()) {
            this.unMute();
        } else {
            this.mute();
        }
    }
    
    setVolume(volume: number) {
        if(volume > 100){
            volume = 100;
        } else if (volume < 0){
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
        } else {
            return this.player.volume() * 100;
        }
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



    prev() {
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

    seek(time: any) {
        if (this.isJwplayer) {
            this.player.seek(time);
        } else {
            this.player.currentTime(time);
        }
    }

    humanTime (time: any) {
        time = parseInt(time, 10);
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
    
    pad(number: string | number, places = 2) {
        if (typeof number !== 'undefined') {
            const zero = places - number.toString().length + 1;
    
            return Array(+(zero > 0 && zero)).join('0') + number;
        }
        return '';
    };
    

    // pause() {
    //     if(this.isJwplayer){
    //         this.player.pause();
    //     } else {
    //         this.player.pause();
    //     }
    // }

}
