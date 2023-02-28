
export interface VideoPlayer {
    playerType: 'jwplayer'|'videojs'|undefined;
    playerId: string;
    player: any;
    events: string[];
    options: VideoPlayerOptions;
}

export interface VideoPlayerOptions {
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