import Functions from './functions';
import Base from './base';
import videojs from 'video.js';
import UI from './ui';

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
}

export interface OriginalPlayer extends Player {
	dispose(): void;
	remove(): void;
	setConfig(arg0: { stretching: string; }): void;
	aspectRatio(arg: string): void;
	aspectRatio(): string;
	getStretching(): void;
	getCurrentTime(): any;
    requestFullscreen(): void;
    paused: (() => boolean) & ((arg: boolean) => void);
    muted: (() => boolean) & ((arg: boolean) => void);
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
    volume: ((level: number) => void) & (() => number);
}


export interface QualityTrack {
    [key: string]: any;
}

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
}

export interface TextTrack {
    [key: string]: any;
}

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
    muted: false;
    preload: 'auto'|'metadata'|'none';
    key?: string;
	disableMediaControls?: boolean;
	skippers?: boolean;
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
}

export interface EpisodeTooltip {
    direction: 'previous' | 'next';
    position: 'bottom' | 'top';
    x: string;
    y: string;
}


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


export interface Player {
    cycleAspectRatio: ReturnType<typeof Functions.cycleAspectRatio>;
    isPlaying: ReturnType<typeof Functions.isPlaying>;
    isTv: ReturnType<typeof Functions.isTv>;
    options: ReturnType<VideoPlayerOptions>;
    clearProgress: ReturnType<typeof Functions.clearProgress>;
    currentTime: ReturnType<typeof Functions.currentTime>;
    cycleAudioTracks: ReturnType<typeof Functions.cycleAudioTracks>;
    cycleSubtitles: ReturnType<typeof Functions.cycleSubtitles>;
    createButton: ReturnType<typeof UI.createButton>;
    dispose: ReturnType<typeof Functions.dispose>;
    duration: ReturnType<typeof Functions.duration>;
    enterFullscreen: ReturnType<typeof Functions.enterFullscreen>;
    forwardVideo: ReturnType<typeof Functions.forwardVideo>;
    getPlaylistItem: ReturnType<typeof Functions.getPlaylistItem>;
    getPlaylist: ReturnType<typeof Functions.getPlaylist>;
    setPlaylistItem: ReturnType<typeof Functions.setPlaylistItem>;
    setEpisode: ReturnType<typeof Functions.setEpisode>;
    lastPlaylistItem: ReturnType<typeof Functions.lastPlaylistItem>;
    isMuted: ReturnType<typeof Functions.isMuted>;
    next: ReturnType<typeof Functions.next>;
    emit: ReturnType<typeof Base.emit>;
    off: ReturnType<typeof Base.off>;
    on: ReturnType<typeof Base.on>;
    once: ReturnType<typeof Base.once>;
    one: ReturnType<typeof Base.one>;
    pause: ReturnType<typeof Functions.pause>;
    play: ReturnType<typeof Functions.play>;
    getSpeed: ReturnType<typeof Functions.getSpeed>;
    previous: ReturnType<typeof Functions.previous>;
    rewindVideo: ReturnType<typeof Functions.rewindVideo>;
    seek: ReturnType<typeof Functions.seek>;
    setVolume: ReturnType<typeof Functions.setVolume>;
    showInProduction: ReturnType<typeof Functions.showInProduction>;
    stop: ReturnType<typeof Functions.stop>;
    toggleFullscreen: ReturnType<typeof Functions.toggleFullscreen>;
    toggleMute: ReturnType<typeof Functions.toggleMute>;
    togglePlayback: ReturnType<typeof Functions.togglePlayback>;
    volumeDown: ReturnType<typeof Functions.volumeDown>;
    volumeUp: ReturnType<typeof Functions.volumeUp>;
    playlistItem: (index?: number) => PlaylistItem;
    getCaptionsList: () => CaptionsEventTrack[];
}

export interface PlaylistItem {
    description: string;
    duration: string;
    episode: number;
    episode_id: number;
    file?: string;
    fonts: any[];
    fontsFile: string;
    id: number;
    image: string;
    logo: string;
    metadata: Track[];
    origin: string;
    playlist_type: string;
    poster?: string;
    production: boolean;
    progress: Progress | null;
    rating: RatingClass;
    season: number;
    seasonName: string;
    show: string;
    sources?: Source[];
    special_id?: string;
    textTracks?: TextTrack[];
    title: string;
    tmdbid: number;
    tracks?: Track[];
    uuid: number;
    video_id: string;
    video_type: string;
    year: number;
}

export interface Progress {
    percentage: number;
    date: string;
}
