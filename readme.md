


```js
    const config = {
        controls: true,
        width: 640,
        height: 360,
        playlist: 'https://api.nomercy.tv/playlist',
    };
```

```js
    import {VideoPlayer} from './js/nomercy.js';

    export const js = new VideoPlayer('videojs', {
        ...config,
        scriptFiles: [
            './js/videojs/video.min.js',
            './js/videojs/videojs-playlist.min.js',
            './js/videojs/video-js.min.css',
        ]
    });
```

```js
    import {VideoPlayer} from './js/nomercy.js';

    export const jw = new VideoPlayer('jwplayer', {
        ...config,
        scriptFiles: [
            './js/jwplayer/jwplayer.js',
            './js/jwplayer/key.js'
        ],
    });
```