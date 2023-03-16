
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
    groupid: string;
    hlsjsIndex: number;
    label: string;
    language: string;
    name: string;
    defaulttrack: boolean;
}
export interface AudioTrack {
    [key: string]: any;
};
export interface CaptionsEvent {
    track: number;
    tracks: CaptionsEventTrack[];
    type: string;
}

export interface CaptionsEventTrack {
	src: string;
    id: string;
    label: string;
    language: string;
}

export interface Chapter {
	left: number;
    endTitle: number;
    id: string;
    time: number;
	startTime: number;
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

export interface PlaylistItem {
    description: string;
    duration: string;
    file?: string;
    id: number;
    image?: string;
    poster?: string;
    progress?: number;
    sources?: Source[];
    title: string;

    textTracks?: TextTrack[];
    tracks?: Track[];
	metadata: Track[];

    show?: string;
    season?: number;
    episode?: number;
    year?: string;
    logo?: string;
    rating?: RatingClass;
    fonts?: Font[];
    fontsFile?: string;
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

export interface VideoPlayer {
    events: string[];
    options: VideoPlayerOptions;
    player: any;
    playerId: string;
    playerType: 'jwplayer'|'videojs'|undefined;
}

export interface VideoPlayerOptions {
	debug?: boolean;
	doubleClickDelay?: number;
    autoplay?: boolean;
    buttonStyles?: any;
    buttons?: any;
    controls?: boolean;
    controlsTimeout?: number;
    playerVersion?: string;
    playlist: string| PlaylistItem[];
    playlistVersion?: string;
    scriptFiles?: string[];
    seekInterval?: number;
    token?: string;
	playbackRates?: number[];
	plugins?: any;
	styles?: Style;
}

export interface VolumeState {
    muted: boolean;
    volume: number;
}
