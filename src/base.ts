import type { VideoPlayerOptions, VideoPlayer as Types, VolumeState } from "./buckyplayer.d";

export default class Base {

    player: Types['player'] = <Types['player']>{};

    isJwplayer: boolean = false;
    isVideojs: boolean = false;
    playerType: Types['playerType'] = undefined;
    playerId: string = '';
    options: VideoPlayerOptions = <VideoPlayerOptions>{};

    setupTime: number = 0;
    events: string[] = [];

    jwplayerVersion = '8.26.7';
    videojsVersion = '8.0.4';
    videojsPlaylistVersion = '5.0.0';

    message: NodeJS.Timeout = <NodeJS.Timeout>{};
    overlay: HTMLDivElement = <HTMLDivElement>{};

    constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {

        this.setupTime = Date.now();

        if (!playerId) {
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
                // `https://vjs.zencdn.net/${this.videojsVersion}/video-js.css`,
            ])
                .then(() => {
                    this.player = window.videojs(this.playerId, this.options);
                    this.#loadPlaylist();

                    window.videojs.log.level('off');

                    const groupCollapsed = window.console.groupCollapsed;
                    window.console.groupCollapsed = (e) => {
                        if (e.includes('Text Track parsing errors')) {
                            return;
                        }
                        groupCollapsed(e);
                    };
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
                        'cast',
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
                this.options.displaydescription = false;
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
            if (this.isJwplayer) {
                this.player.once(event, (data: any) => {
                    console.log(this.playerType, event, data);
                    switch (event) {
                        case 'ready':
                            this.#dispatchEvent('ready', this.#getReadyState(data));
                            break;
                    }
                });
            } else {
                this.player.one(event, (data: any) => {
                    console.log(this.playerType, event, data);
                    switch (event) {
                            case 'duringplaylistchange':
                                this.#dispatchEvent('ready', this.#getReadyState(data));
                                break;
                    }
                });
            }
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
                    case 'beforeplaylistItem':
                        break;
                    case 'buffer':
                        break;
                    case 'canplay':
                        break;
                    case 'canplaythrough':
                        this.#dispatchEvent('playlistitem', data);
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
                    case 'fullscreen': //jwplayer
                    case 'fullscreenchange': //videojs
                        this.#dispatchEvent('fullscreen', data);
                        break;
                    case 'idle': //jwplayer
                        break;
                    case 'loadeddata': //videojs
                        break;
                    case 'loadedmetadata': //videojs
                        this.#dispatchEvent('duration', this.#getTimeState(data));
                        break;
                    case 'loadstart': //videojs
                        break;
                    case 'mute':
                        this.#dispatchEvent('mute', data);
                        break;
                    case 'pause':
                        this.#dispatchEvent('pause', { data: 'pause' });
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
                    case 'durationchanged':
                    case 'playlistItem':
                    case 'playlistitem':
                        this.#dispatchEvent('duration', this.#getTimeState(data));
                        this.#dispatchEvent('playlistitem', data);
                        break;
                    case 'playlistchange':
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
    }
    #getReadyState(data: { setupTime: number; viewable: number; }) {
        if (this.isJwplayer) {
            data.setupTime = Date.now() - this.setupTime;
            return {
                ...data,
                viewable: data.viewable == 1,
            };
        } else {
            return {
                setupTime: Date.now() - this.setupTime,
                viewable: this.isInViewport(),
                type: "ready"
            };
        }
    }

    #getTimeState(data: { position: number; duration: number; type: any; viewable: any; }): VolumeState {
        if (this.isJwplayer) {
            return {
                position: this.player.getPosition(),
                duration: this.player.getDuration(),
                remaining: this.player.getDuration() - this.player.getPosition(),
                buffered: (((this.player.getPosition() + this.player.getBuffer()) / this.player.getDuration()) * 100),
                percentage: (this.player.getPosition() / this.player.getDuration()) * 100,
                type: data.type,
                viewable: data.viewable == 1,
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
            };
        }
    }
    #getVolumeState(data: any) {
        if (this.isJwplayer) {
            return data;
        } else {
            return {
                volume: this.player.volume() * 100,
                type: 'volume'
            };
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
    #dispatchEvent(eventType: string, data: any) {
        if (!data || typeof data === 'string') {
            data = data ?? '';
        } else if (typeof data === 'object') {
            data = { ...(data ?? {}) };
        }

        this.getElement().parentElement?.dispatchEvent(new CustomEvent(eventType, {
            detail: data
        }));
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
    displayMessage(data: any, time = 2000) {
        clearTimeout(this.message);
        this.#dispatchEvent('displayMessage', data);
        this.message = setTimeout(() => {
            this.#dispatchEvent('removeMessage', data);
        }, time);
    }

    getElement(): HTMLDivElement {
        return document.getElementById(this.playerId) as HTMLDivElement;
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
}