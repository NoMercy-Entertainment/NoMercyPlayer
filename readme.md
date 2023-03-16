# NoMercyPlayer Facade

## For JWPlayer and VideoJS

### Features

* Unified UI, API and events.
* Cross-compatible playlist, text tracks.
* Easy customizable buttons, button placement, icons and styles.
* Built-in ass subtitles support provided by [subtitle octopus](https://github.com/libass/JavascriptSubtitlesOctopus) .

### Why use this facade?

JWPlayer costs a lot of money and VideoJS is not as good as JWPlayer. </br>
This facade makes it easy to switch between the two players. </br>
If you require the stability and speed of JWPlayer on one site, and the free use of VideoJS on another, you can use this facade to switch between the two players but keep the same ui and event triggers. </br>
This is a good solution if you have multiple sites with different requirements. </br>
You can also use this facade to use the JWPlayer playlist with VideoJS and vice versa. </br>

### Setup

```html
<body class="flex flex-col items-center justify-center w-screen h-screen gap-4 text-white bg-zinc-900">

    <div id="container" class="flex flex-col justify-center w-full gap-8 sm:flex-row">

        <div id="wrapper2" class="flex flex-col items-center w-full max-w-4xl gap-2 text-center">
            <span>JWPlayer</span>
            <video id="player2"></video>
        </div>

        <div id="wrapper1" class="flex flex-col items-center w-full max-w-4xl gap-2 text-center">
            <span>VideoJS</span>
            <video id="player1" class="video-js"></video>
        </div>
    </div>

    <script type="module">
        import VideoPlayer from './js/nomercyplayer.js?v=kw4n5l2n45';

        const config = {
            muted: false,
            controls: false,
            preload: 'auto',
            playlist: 'playlist url or array of playlist items',
            controlsTimeout: 5000, //default 3000
            doubleClickDelay: 200, //default 500
            playbackRates: [] // off,  default [0.25,0.5,0.75,1,1.25,1.5,1.75,2]
        };
        
        const videojs = new VideoPlayer('videojs', config, 'player1');
        videojs.on('ready', (data) => {
            console.log('ready', data); // ready { setupTime: 227, viewable: true, type:"ready"}

        });
        
        // config.key = 'your key';
        const jwplayer = new VideoPlayer('jwplayer', config, 'player2');
        jwplayer.on('ready', (data) => {
            console.log('ready', data); // ready { setupTime: 208, viewable: true, type: "ready"}
        });
    </script>
</body>
```

### Definition

#### `constructor(player, config, id)`

| Parameter | Type              | Description                                                                                                                                                                                    |
| :---      | :---              | :---                                                                                                                                                                                           |
| player    | `string`          | `jwplayer` or `videojs`                                                                                                                                                                        |
| config    | `object <Config>` | [JWPlayer](https://developer.jwplayer.com/jwplayer/docs/jw8-player-configuration-reference) or [VideoJS](https://docs.videojs.com/tutorial-options.html) configuration with our custom options |
| id        | `string`          | ID of the element to attach the player to                                                                                                                                                      |

### `<Config>`

*Only showing what is different from the original config.*
| Parameter        | Type                         | Required | Description                                                                  |
| :---             | :---                         | :---     | :---                                                                         |
| playlist         | `string` or `PlaylistItem[]` | true     | playlist url or playlist items                                               |
|                  |                              |          |                                                                              |
| buttons          | `Buttons[]`                  |          | Override the button placement                                                |
| buttonStyles     | `ButtonStyles[]`             |          |                                                                              |
| controls         | `boolean`                    |          | Show the default player overlay                                              |
| controlsTimeout  | `number`                     |          | controls timeout in ms                                                       |
| debug            | `boolean`                    |          | Verbose logging                                                              |
| doubleClickDelay | `number`                     |          | Double click/tap delay in ms                                                 |
| playbackRates    | `number[]`                   |          | Playback speeds                                                              |
| playerVersion    | `string`                     |          | Version number override for JWPlayer or videoJS                              |
| playlistVersion  | `string`                     |          | Version number override for the videoJS playlist plugin                      |
| scriptFiles      | `string[]`                   |          | Use your own / local script files to initialize the player                   |
| seekInterval     | `number`                     |          | Set the seek interval for button and api to x amount of seconds. default: 10 |
| token            | `string`                     |          | Auth token for XHR requests                                                  |

#### `<PlaylistItem>`

| Parameter            | Type              | Description           |
| :---                 | :---              | :---                  |
| title                | `string`          | Title                 |
| description          | `string`          | Description           |
| image                | `string`          | Placeholder image url |
| sources              | `Source[]`        | Video source(s)       |
| tracks (JWPlayer)    | `Track[]`         | Text tracks           |
| textTracks (videoJS) | `TextTrack[]`     | Text tracks           |
| metadata (both)      | `TextTrack<sprite | fonts                 | chapters | spritesheet>[]` | Text tracks |

#### `<Source>`

| Parameter | Type      | Description    |
| :---      | :---      | :---           |
| file      | `string`  | URL            |
| label     | `string`  | Label          |
| default   | `boolean` | Default source |
| type      | `string`  | Mime type      |

#### `<Track>` | `<TextTrack>`

| Parameter | Type      | Description                                                           |
| :---      | :---      | :---                                                                  |
| file      | `string`  | URL                                                                   |
| label     | `string`  | Label                                                                 |
| default   | `boolean` | Default track                                                         |
| kind      | `string`  | `captions`, `subtitles`, `sprite`, `spritesheet`, `chapters`, `fonts` |

## API

### Triggers

* Playback
  * `play()`
  * `pause()`
  * `togglePlayback()`
* Volume
  * `mute()`
  * `unMute()`
  * `toggleMute()`
  * `volumeUp()`
  * `volumeDown()`
* Playlist item
  * `next()`
  * `previous()`
* Seek
  * `forwardVideo()`
  * `rewindVideo()`
* Fullscreen
  * `enterFullscreen()`
  * `exitFullscreen()`
  * `toggleFullscreen()`

### Getters

* Playback
  * `isMuted()`
  * `isPlaying()`
  * `isFullscreen()`
  * `getVolume()`
  * `getCurrentTime()`
  * `getDuration()`
  * `getPlaybackRate()`
* Playlist
  * `getPlaylist()`
  * `getPlaylistItem()`
  * `getPlaylistIndex()`
  * `isFirstPlaylistItem()`
  * `isLastPlaylistItem()`
* Audio tracks
  * `getAudioTracks()`
  * `getAudioTrack()`
  * `getAudioTrackKind()`
  * `getAudioTrackLabel()`
  * `getAudioTrackLanguage()`
  * `getAudioTrackIndex()`
  * `hasAudioTracks()`
* Subtitle tracks
  * `getTextTracks()`
  * `getTextTrack()`
  * `getTextTrackKind()`
  * `getTextTrackLabel()`
  * `getTextTrackLanguage()`
  * `getTextTrackIndex()`
  * `hasTextTracks()`
* Quality levels
  * `getQualities()`
  * `getQuality()`
  * `getQualityIndex()
* Chapters
  * `getChapters()`
  * `getChapter()`

### setters

`seek(value)`
| Parameter | Type     | Description        |
| :---      | :---     | :---               |
| value     | `number` | seconds to seek to |

`setVolume(value)`
| Parameter | Type     | Description              |
| :---      | :---     | :---                     |
| value     | `number` | volume between 0 and 100 |

`setMuted(value)`
| Parameter | Type      | Description                       |
| :---      | :---      | :---                              |
| value     | `boolean` | `true` to mute, `false` to unmute |

`setPlaybackRate(value)`
| Parameter | Type     | Description   |
| :---      | :---     | :---          |
| value     | `number` | playback rate |

`setPlaylist(playlist)`
| Parameter | Type             | Description   |
| :---      | :---             | :---          |
| playlist  | `PlaylistItem[]` | playback rate |

`setAudioTrack(index)`
| Parameter | Type     | Description |
| :---      | :---     | :---        |
| index     | `number` |             |

`setTextTrack(index)`
| Parameter | Type     | Description |
| :---      | :---     | :---        |
| index     | `number` |             |

`setQualityLevel(index)`
| Parameter | Type     | Description |
| :---      | :---     | :---        |
| index     | `number` |             |

`getAudioTrackIndexByLanguage(language)`
| Parameter | Type     | Description               |
| :---      | :---     | :---                      |
| language  | `string` | ISO 639-2/B language code |

`getTextTrackIndexBy(language, type, ext)`

*Only works with correct file urls with this end: `.(language).(type).(ext)`* eg: `eng.full.vtt`
| Parameter | Type     | Description                         |
| :---      | :---     | :---                                |
| language  | `string` | ISO 639-2/B language code           |
| type      | `string` | Language type `full`, `sign`, `sdh` |
| ext       | `string` | Extension `vtt`, `ass`              |

`setToken(value)`

| Parameter | Type     | Description |
| :---      | :---     | :---        |
| value     | `string` | new token   |

### Event listeners

`on(event, callback)`

`once(event, callback)`

`off(event, callback)`

| Parameter | Type       | Description       |
| :---      | :---       | :---              |
| event     | `string`   | `audio-change`, `audio`, `caption-change`, `captions`, `chapters`, `controls`, `duration`, `forward`, `fullscreen`, `item`, `mute`, `pause`, `pip`, `play`, `playing`, `quality`, `ready`, `removeForward`, `removeRewind`, `resize`, `rewind`, `seeked`, `theaterMode`, `time`, `volume` |
| callback  | `function` | callback function |
