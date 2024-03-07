
import VideoPlayer from './src/index.ts';

/**
 * @param {import("./src/index.d").VideoPlayerOptions}
 */
const config = {
    muted: false,
    controls: false,
    // chapters: false,
    preload: 'auto',
    playlist: 'https://api-dev.nomercy.tv/playlist-js?v=2',
    controlsTimeout: 3000,
    doubleClickDelay: 500,
    basePath: '',
    playbackRates: [
        0.25,
        0.5,
        0.75,
        1,
        1.25,
        1.5,
        1.75,
        2,
    ],
    fullscreen: {
        iOS: true,
        alwaysInLandscapeMode: true,
        enable: true,
        enterOnRotate: true,
        exitOnRotate: true,
    },
    styles: {
        // sliderProgressStyles: ['nm-bg-theme-500'],
        // chapterMarkerProgressStyles: ['nm-bg-theme-500'],
        // sliderNippleStyles: ['nm-bg-theme-500'],
        // sliderBarStyles: ['!nm-bg-transparent'],
    },
    // layout: {
    //     top: [
    //         {
    //             backButton: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //         },
    //     ],
    //     middle: [],
    //     bottom: [
    //         {
    //             currentTime: {},
    //             divider: {
    //                 // classNames: 'mx-1',
    //                 text: '/'
    //             },
    //             duration: {},
    //             progress: {},
    //         },
    //         {
    //             play: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             volume: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     lowVolume: {
    //                 //         normal: '',
    //                 //         hover: ''
    //                 //     },
    //                 //     midVolume: {
    //                 //         normal: '',
    //                 //         hover: ''
    //                 //     },
    //                 //     highVolume: {
    //                 //         normal: '',
    //                 //         hover: ''
    //                 //     },
    //                 //     muted: {
    //                 //         normal: '',
    //                 //         hover: ''
    //                 //     },
    //                 // }
    //             },
    //             previous: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             skipMinus: {
    //                 seconds: 10,
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             skipPlus: {
    //                 seconds: 10,
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             next: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             autoPlay: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             divider: {
    //                 // classNames: 'mx-auto',
    //                 // text: ''
    //             },
    //             settings: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             pip: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             theaterMode: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             playlist: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             subtitles: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             settings: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //             fullscreen: {
    //                 // action: () => {},
    //                 // classNames: 'flex',
    //                 // icons: {
    //                 //     normal: '',
    //                 //     hover: ''
    //                 // }
    //             },
    //         }
    //     ],
    // },

    // NoMercy test account
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJkNWE1YTAwNS05ZWE2LTRlODMtYmZmNy05ZTQ0MjY5OTg4OWMiLCJqdGkiOiJiNDAyZWU0YThjNGYxYzJjN2RhNmE0ODZjNjY2NDI4YWYyMzMwNGI2MzIyNzRmZjZjNThkODI2YTdjYTEzYTFhYmM2NTA2YjIyOWVmNWE3YiIsImlhdCI6MTY5MzI0NTIwNi42Mjk3NTUsIm5iZiI6MTY5MzI0NTIwNi42Mjk3NTYsImV4cCI6MTcyNDc4MTIwNi42MjM2NjcsInN1YiI6ImQ5OWE1NzQxLTM2ZTgtNGU1ZC1iYzUzLTg1MzAyNmIzZjRhYSIsInNjb3BlcyI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiXSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBub21lcmN5LnR2In0.GV7HlmRAVDL3Bb1MdWltS1AX8dR1LHRMF_vtvM01abLu2983djSKSUvtB26KV5MCpOSuOX-ZwlBlqbMJ5JUX55fSonUE0oiz0ujn8QIk0-G0ptB1-hqn6qIRtxncwZaT0TGNpF7TFejjMC_VcqwjtzmRA58JC940u7QL7k5304cbHJXv-_Op1FpAR3dRA0g3BVR8uJ5ckp1hO-KAj83NOetnviglQf6130WQKtx2AWC1qT55NW3Xx1YFAZZUptjgRZ5mhvDd0_OmTNnFvsQZYaHr5H2WFAzKfW7GEvlu7xFIiMxfhpfowyvV3u4VqoDU-wIfkod-U0lL9JlwnsufFAvE_dfXjMhDXZG80oFPifYLanj7DsL4lIfbaVJO92W1K4bYW0t8Jfi8U3ZdqXtvPSpjPmx5dyz9Z2Na16GtH0_sZu5oMPgbGRMk0pZLi0uGWb_Wxyg3MFMEE4f0zA3gRSc1yt3gCI-AIaiCeMKAbC_uPauV3QcNzbCV2JVxOzW-tKlexALBPYe53DKkODPVcQHhv_d1sqXZxqwS8OfkZzqNCg2MpN2DodgSAVM8b1xZMG_6Ym-hEtDYw0ZCghda7v0pZSAo67jFDv5kEk9MF4j7OGfvk3sFT-mi7gFogKLByrMfQMfs4-qnHrsoKOVZRU6S1JHkRJFSxkwcamv_AYI',
};

config.subtitleRenderer = 'sabre';
const js = new VideoPlayer('videojs', config, 'player1');
window.js = js;

js.on('lastTimeTrigger', (data) => {
    // console.log('lastTimeTrigger', data);
});

js.on('theaterMode', (data) => {
    // handle resize container
    console.log('theaterMode', data);
    if (data) {
        document.querySelector('body').classList.remove('nm-justify-center');
        document.querySelector('#container').classList.remove('sm:nm-flex-row');
        document.querySelector('#wrapper1').classList.remove('nm-w-full');
        document.querySelector('#wrapper1').classList.add('nm-w-2/3');
        document.querySelector('#wrapper1').classList.remove('nm-max-w-4xl');
    } else {
        document.querySelector('body').classList.add('nm-justify-center');
        document.querySelector('#container').classList.add('sm:nm-flex-row');
        document.querySelector('#wrapper1').classList.remove('nm-w-2/3');
        document.querySelector('#wrapper1').classList.add('nm-w-full');
        document.querySelector('#wrapper1').classList.add('nm-max-w-4xl');
    }
});
js.on('pip', (data) => {
    console.log('pip', data);
    if (data) {
        document.querySelector('#wrapper1').classList.add('nm-absolute');
        document.querySelector('#wrapper1').classList.add('nm-bottom-4');
        document.querySelector('#wrapper1').classList.add('nm-right-4');
        document.querySelector('#wrapper1').classList.add('nm-max-w-sm');
        document.querySelector('#wrapper1').classList.remove('nm-max-w-4xl');
    } else {
        document.querySelector('#wrapper1').classList.remove('nm-absolute');
        document.querySelector('#wrapper1').classList.remove('nm-bottom-4');
        document.querySelector('#wrapper1').classList.remove('nm-right-4');
        document.querySelector('#wrapper1').classList.remove('nm-max-w-sm');
        document.querySelector('#wrapper1').classList.add('nm-max-w-4xl');
    }
});


config.subtitleRenderer = 'octopus';
config.key = 'W7zSm81+mmIsg7F+fyHRKhF3ggLkTqtGMhvI92kbqf/ysE99';
const jw = new VideoPlayer('jwplayer', config, 'player2');

window.jw = jw;

jw.on('lastTimeTrigger', (data) => {
    // console.log('lastTimeTrigger', data);
});

jw.on('theaterMode', (data) => {
    // handle resize container
    console.log('theaterMode', data);
    if (data) {
        document.querySelector('body').classList.remove('nm-justify-center');
        document.querySelector('#container').classList.remove('sm:nm-flex-row');
        document.querySelector('#wrapper2').classList.remove('nm-max-w-4xl');
        document.querySelector('#wrapper2').classList.remove('nm-w-full');
        document.querySelector('#wrapper2').classList.add('nm-w-2/3');
    } else {
        document.querySelector('body').classList.add('nm-justify-center');
        document.querySelector('#container').classList.add('sm:nm-flex-row');
        document.querySelector('#wrapper2').classList.add('nm-max-w-4xl');
        document.querySelector('#wrapper2').classList.add('nm-w-full');
        document.querySelector('#wrapper2').classList.remove('nm-w-2/3');
    }
});
jw.on('pip', (data) => {
    console.log('pip', data);
    if (data) {
        document.querySelector('#wrapper2').classList.add('nm-absolute');
        document.querySelector('#wrapper2').classList.add('nm-bottom-4');
        document.querySelector('#wrapper2').classList.add('nm-right-4');
        document.querySelector('#wrapper2').classList.add('nm-max-w-sm');
    } else {
        document.querySelector('#wrapper2').classList.remove('nm-absolute');
        document.querySelector('#wrapper2').classList.remove('nm-bottom-4');
        document.querySelector('#wrapper2').classList.remove('nm-right-4');
        document.querySelector('#wrapper2').classList.remove('nm-max-w-sm');
    }
});