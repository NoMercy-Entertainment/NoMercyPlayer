
export interface VideoPlayer {
    playerType: 'jwplayer'|'videojs'|undefined;
    playerId: string;
    player: any;
    events: string[];
    options: VideoPlayerOptions;
}

export interface VideoPlayerOptions {
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

export interface VolumeState {
    position: any;
    duration: any;
    remaining: number;
    buffered: number;
    percentage: number;
    type: any;
    viewable: boolean;
};