
export interface VideoPlayer {
    playerType: 'jwplayer'|'videojs'|undefined;
    playerId: string;
    player: any;
    events: string[];
    options: VideoPlayerOptions;
}

export interface VideoPlayerOptions {
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
}

export interface PlaylistItem {
    file: string;
    image: string;
    title: string;
    description: string;
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