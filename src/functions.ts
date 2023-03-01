import Base from './base.js';

import type { VideoPlayerOptions, VideoPlayer as Types } from "./buckyplayer.d";

export default class Functions extends Base {

    constructor(playerType: Types['playerType'], options: VideoPlayerOptions, playerId: Types['playerId'] = '') {
        super(playerType, options, playerId);

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
    togglePlayback() {
        if (this.isPlaying()) {
            this.pause();
        } else {
            this.play();
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
    toggleMute() {
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



    previous() {
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

    isFullscreen() {
        if (this.isJwplayer) {
            return this.player.getFullscreen();
        } else {
            return this.player.isFullscreen();
        }
    }
    enterFullscreen() {
        if (this.isJwplayer) {
            this.player.setFullscreen(true);
        } else {
            this.player.requestFullscreen();
        }
    }
    exitFullscreen() {
        if (this.isJwplayer) {
            this.player.setFullscreen(false);
        } else {
            this.player.exitFullscreen();
        }
    }
    toggleFullscreen() {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    

    getCurrentPlaylistIndex(){
        if(this.isJwplayer){
            return this.player.getPlaylistIndex();
        } else {
            return this.player.playlist.currentIndex();
        }
    }
    getCurrentPlaylistItem(){
        if(this.isJwplayer){
            return this.player.getPlaylistItem();
        } else {
            return this.player.playlist()[this.getCurrentPlaylistIndex()]
        }
    }
    setCurrentPlaylistItem(index: number){
        if(this.isJwplayer){
            this.player.playlistItem(index);
        } else {
            this.player.playlist.currentItem(index);
        }
    }
    getPlaylist(){
        if(this.isJwplayer){
            return this.player.getPlaylist();
        } else {
            return this.player.playlist();
        }
    }
    setPlaylist(playlist: any){
        if(this.isJwplayer){
            this.player.load(playlist);
        } else {
            this.player.playlist(playlist);
        }
    }
    isFirstPlaylistItem(){
        return this.getCurrentPlaylistIndex() === 0;
    }
    isLastPlaylistItem(){
        return this.getCurrentPlaylistIndex() === this.getPlaylist().length - 1;
    }


    
    

    // pause() {
    //     if(this.isJwplayer){
    //         this.player.pause();
    //     } else {
    //         this.player.pause();
    //     }
    // }

}