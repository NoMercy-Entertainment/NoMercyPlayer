
export interface VideoPlayer {
    playerType: 'jwplayer'|'videojs'|undefined;
    playerId: string;
    player: any;
    events: string[];
    options: VideoPlayerOptions;
}

export interface VideoPlayerOptions {
    seekInterval: number | undefined;
    token?: string;
    controlsTimeout: number;
    iconStyles: never[];
    buttonStyles: any;
    buttons: any;
    playerVersion: string;
    playlistVersion: string;
    scriptFiles: string[];
    autoplay: boolean;
    controls: boolean;
    playlist: string| PlaylistItem[];
    anonymous: boolean;
}

export interface PlaybackState {
    position: any;
    duration: any;
    remaining: number;
    buffered: number;
    percentage: number;
    type: any;
    viewable: boolean;
};

export interface AudioTrack {
    [key: string]: any;
};
export interface TextTrack {
    [key: string]: any;
};
export interface QualityTrack {
    [key: string]: any;
};

export interface PlaylistItem {
    id: number;
    title: string;
    description: string;
    duration: string;
    image?: string;
    poster?: string;
    file?: string;
    sources?: Source[];
    progress?: number;

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

export interface Font {
    file: string;
    mimeType: MIMEType;
}

export enum MIMEType {
    ApplicationXFontOpentype = 'application/x-font-opentype',
    ApplicationXFontTruetype = 'application/x-font-truetype',
}

export interface RatingClass {
    country: string;
    rating: string;
    meaning: string;
    image: string;
}

export interface Source {
    src: string;
    type: string;
}

export interface TextTrack {
    label: string;
    src: string;
    srclang: string;
    language: string;
    kind: TrackKind;
}

export enum TextTrackKind {
    Subtitle = 'subtitle',
    Subtitles = 'subtitles',
}

export interface Track {
    file: string;
    kind: TrackKind;
    label?: string;
}

export enum TrackKind {
    Captions = 'captions',
    Chapters = 'chapters',
    Subtitles = 'subtitles',
    Fonts = 'fonts',
    Sprite = 'sprite',
    Thumbnails = 'thumbnails',
}

export interface Chapter {
    id: string;
    title: string;
    time: number;
}
