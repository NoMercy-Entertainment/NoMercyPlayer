
export enum MIMEType {
    ApplicationXFontOpentype = 'application/x-font-opentype',
    ApplicationXFontTruetype = 'application/x-font-truetype',
}

export enum TextTrackKind {
    Subtitle = 'subtitle',
    Subtitles = 'subtitles',
}

export enum TrackKind {
    Captions = 'captions',
    Chapters = 'chapters',
    Fonts = 'fonts',
    Sprite = 'sprite',
    Subtitles = 'subtitles',
    Timestamps = 'timestamps',
}

export interface AudioEvent {
    currentTrack: number;
    tracks: AudioEventTrack[];
    type: string;
}
export interface AudioEventTrack {
    autoselect: boolean;
    defaulttrack: boolean;
    enabled: boolean;
    groupid: string;
    hlsjsIndex: number;
    id: string;
    kind: string;
    label: string;
    language: string;
    name: string;
}
export interface AudioTrack {
    [key: string]: any;
    tracks_: AudioEventTrack[];
};
export interface CaptionsEvent {
    track: number;
    tracks: CaptionsEventTrack[];
    type: string;
}

export interface CaptionsEventTrack {
    id: string;
    label: string;
    language: string;
    src: string;
}

export interface Chapter {
    endTitle: number;
    id: string;
    left: number;
    startTime: number;
    time: number;
    title: string;
    width: number;
}

export interface Font {
    file: string;
    mimeType: MIMEType;
}

export interface PlaybackState {
    buffered: number;
    duration: any;
    percentage: number;
    position: any;
    remaining: number;
    type: any;
    viewable: boolean;
};

export interface OriginalPlayer extends Player {
	dispose(): void;
	remove(): void;
	setConfig(arg0: { stretching: string; }): void;
	aspectRatio(arg: string): void;
	aspectRatio(): string;
	getStretching(): void;
	getCurrentTime(): any;
	localize(arg0: string): string | null;
    audioTracks: () => AudioTrack[] & {
        addEventListener: (event: 'change', callback: (event: AudioEvent) => void) => void;
        tracks_: AudioEventTrack[];
    };
    buffered: () => TimeRanges;
    bufferedEnd: () => number;
    el_: HTMLElement;
    ended: () => boolean;
    exitFullscreen: () => void;
    getAudioTrack: () => AudioTrack;
    getAudioTrackIndex: () => number;
    getAudioTracks: () => AudioTrack[];
    getBuffer: () => number;
    getCaptionsList: () => CaptionsEventTrack[];
    getCurrentAudioTrack: () => number;
    getCurrentCaptions: () => number;
    getCurrentQuality: () => number;
    getDuration: () => number;
    getFullscreen: () => boolean;
    getMute: () => boolean;
    getPlaybackRate: () => number;
    getPlaylist: () => PlaylistItem[];
    getPlaylistIndex: () => number;
    getPlaylistItem: (index?: number) => PlaylistItem;
    getPosition: () => number;
    getQualityLevels: () => QualityTrack[];
    getState: () => 'playing' | 'paused' | 'buffering' | 'idle';
    getViewable: () => boolean;
    getVisualQuality: () => QualityTrack;
    getVolume: () => number;
    isFullscreen: () => boolean;
    landscapeFullscreen: (arg: {
        fullscreen: {
            alwaysInLandscapeMode: boolean,
            enterOnRotate: boolean,
            exitOnRotate: boolean,
            iOS: boolean,
        },
    }) => void;
    load: (playlist: PlaylistItem[]) => void;
    loadItem: (index: number) => void;
    playbackRate: ((speed: number) => void) & (() => number);
    playbackRates: () => number[];
    played: () => TimeRanges;
    playlist: ((playlist: PlaylistItem[], autoloadIndex?: number) => void)
        & (() => PlaylistItem[])
        & {
            autoadvance: (delay?: number) => void;
            currentItem: ((index?: number) => void) | (() => number);
            previous: () => void;
            next: () => void;
            lastIndex: () => number;
            currentIndex: () => number;
        };
    playlistNext: () => void;
    playlistPrev: () => void;
    qualityLevels: () => QualityTrack[] & {
        addEventListener: (event: 'change', callback: (event: QualityEvent) => void) => void;
        tracks_: QualityTrack[];
        selectedIndex: number;
    };
    readyState: () => number;
    seekable: () => TimeRanges;
    setCurrentAudioTrack: (index: number) => void;
    setCurrentCaptions: (index: number) => void;
    setCurrentQuality: (index: number) => void;
    setFullscreen: (state: boolean) => void;
    setMute: (state: boolean) => void;
    setPlaybackRate: (rate: number) => void;
    setPlaylist: (playlist: PlaylistItem[]) => void;
    setPlaylistItem: (index: number) => void;
    setup: (options: VideoPlayerOptions) => void;
    textTracks: () => TextTrack[] & {
        addEventListener: (event: 'change', callback: (event: TextTrack) => void) => void;
        tracks_: TextTrackTrack[];
    };
    trigger: (event: string, callback: (event: any) => void) => void;
}

export interface Player {
	isPlaying(): boolean;
	cycleAspectRatio(): void;
	isTv(): boolean;
    captionsList: () => CaptionsEventTrack[];
    currentTime: (() => number) & ((position: number) => void);
    cycleAudioTracks: () => void;
    cycleSubtitles: () => void;
    duration: () => number;
    forwardVideo: (arg?: number) => void,
    muted: (value?: boolean) => boolean;
    off: (event: string, callback: (event: any) => void) => void;
    on: (event: string, callback: (event: any) => void) => void;
    once: (event: string, callback: (event: any) => void) => void;
    one: (event: string, callback: (event: any) => void) => void;
    next: () => void;
    off: (event: string, callback: (event: any) => void) => void;
    on: (event: string, callback: (event: any) => void) => void;
    once: (event: string, callback: (event: any) => void) => void;
    one: (event: string, callback: (event: any) => void) => void;
    pause: () => void;
    paused: () => boolean;
    play: () => void;
    playbackRate: ((speed: number) => void) & (() => number);
    playbackRates: () => number[];
    played: () => TimeRanges;
    playlistItem: (index?: number) => PlaylistItem;
    previous: () => void;
    requestFullscreen: () => void;
    rewindVideo: () => void;
    seek: (position: number) => void;
    setVolume: (volume: number) => void;
    stop: () => void;
    toggleFullscreen: () => void;
    toggleMute: () => void;
    togglePlayback: () => void;
    volume: (value?: number) => number;
    volumeDown: () => void;
    volumeUp: () => void;
}

export interface PlaylistItem {
    description: string;
    duration: string;
    episode: number;
    file?: string;
    fonts: Font[];
    fonts: Font[];
    fontsFile?: string;
    id: number;
    image?: string;
    logo: string;
    metadata: Track[];
    poster?: string;
    progress?: {
        percentage: number;
        date: string;
    };
    rating: RatingClass;
    season: number;
    show: string;
    sources?: Source[];
    textTracks?: TextTrack[];
    title: string;
    tracks?: Track[];
    year: string;
    video_type?: string;
    uuid?: string;
}

export interface QualityTrack {
    [key: string]: any;
};

export interface RatingClass {
    country: string;
    image: string;
    meaning: string;
    rating: string;
}

export interface Source {
    src: string;
    type: string;
}

export interface Style {
    [key: string]: string[];
};

export interface TextTrack {
    [key: string]: any;
};

export interface TextTrack {
    kind: TrackKind;
    label: string;
    language: string;
    src: string;
    srclang: string;
}

export interface Track {
    file: string;
    kind: TrackKind;
    label?: string;
}

export interface VideoPlayer extends OriginalPlayer {
    events: string[];
    options: VideoPlayerOptions;
    player: OriginalPlayer;
    playerId: string;
    playerType: 'jwplayer' | 'videojs' | undefined;
}

type StretchOptions = 'uniform'|'exactfit'|'fill'|'none';

export interface VideoPlayerOptions {
	skippers: boolean;
	stretching?: StretchOptions;
	disableControls?: boolean;
	language?: string;
	forceTvMode?: boolean;
	disableTouchControls?: boolean;
	fullscreen?: boolean;
	basePath?: string;
    autoplay?: boolean;
    buttons?: any;
    buttonStyles?: any;
    controls?: boolean;
    controlsTimeout?: number;
    debug?: boolean;
    doubleClickDelay?: number;
    playbackRates?: number[];
    playerVersion?: string;
    playlist: string | PlaylistItem[];
    playlistVersion?: string;
    plugins?: any;
    scriptFiles?: string[];
    seekInterval?: number;
    styles?: Style;
    accessToken?: string;
    chapters?: boolean;
    nipple?: boolean;
    icons?: any;
}

export interface VolumeState {
    mute: boolean;
    volume: number;
}

export interface toolTooltip {
    text: string;
    position: 'bottom' | 'top';
    x: string;
    y: string;
};

export interface EpisodeTooltip {
    direction: 'previous' | 'next';
    position: 'bottom' | 'top';
    x: string;
    y: string;
};


interface AudioTracks extends videojs.AudioTrack {
    tracks_: AudioTrack[];
}
interface AudioTrack extends videojs.AudioTrack {
    enabled: boolean;
}

interface TextTracks extends videojs.TextTrack {
    tracks_: TextTrack[];
}
interface TextTrack extends videojs.TextTrack {
    enabled: boolean;
}

interface QualityLevels {
    levels_: QualityLevel[];
    selectedIndex: number;
}
interface QualityLevel {
    enabled: boolean;
    id: string;
    width: number;
    label: string;
    height: number;
    bitrate: number;
    selectedIndex: number;
}

export interface Position {
	x: {
		start: number;
		end: number;
	};
	y: {
		start: number;
		end: number;
	};
}

export interface PreviewTime {
    start: number;
    end: number;
    x: number;
    y: number;
    w: number;
    h: number;
}