import { OriginalPlayer } from './index.d';

export const createMenuButton = (
	player: OriginalPlayer,
	parent: HTMLDivElement,
	action: string,
	text: string,
	hidden = false,
	showEvent = 'playing',
	focus: boolean | undefined = false
) => {
	const button = document.createElement('button');
	button.classList.add('menu-button');
	button.classList.add('ripple');
	button.type = 'button';

	const span = document.createElement('span');
	button.append(span);

	const spanChild = document.createElement('span');
	span.append(spanChild);

	const spanChildText = document.createElement('span');
	span.append(spanChildText);

	if (!hidden && text.includes(',')) {
		const newText = text.split(',');

		spanChildText.textContent = player.localize(`${newText[0]}`);
		player.once(showEvent, () => {
			spanChildText.textContent = player.localize(`${newText[1]}`);
		});
	} else {
		spanChildText.textContent = player.localize(text);
	}

	if (hidden && showEvent) {
		player.once(showEvent, () => {
			button.style.display = 'flex';
		});
	}

	switch (action) {
		// pauseScreen buttons
		case 'resumePlayback':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;">
				<path d="M8 5v14l11-7z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('resume-playback-button');

			const progressContainer = document.createElement('div');
			progressContainer.id = 'resume-playback-button-progress-container';
			progressContainer.classList.add('progress-container');
			button.append(progressContainer);

			const sliderContainer = document.createElement('div');
			sliderContainer.id = 'resume-playback-button-slider-container';
			sliderContainer.classList.add('slider-container');
			progressContainer.append(sliderContainer);

			const progressBar = document.createElement('div');
			progressBar.id = 'resume-playback-button-progress-bar';
			progressBar.classList.add('progress-bar');
			sliderContainer.append(progressBar);

			player.on('timeTrigger', (data) => {
					progressBar.style.width = `${data.percentage > 99
						? 100
						: data.percentage}%`;
				}
			);

			player.on('showPauseMenu', () => {
				if (parent.querySelector<HTMLDivElement>('[id*=-button-box]')) {
					parent.querySelector<HTMLDivElement>('[id*=-button-box]')!.innerHTML = '';
				}
				parent.append(button);

				button.focus();

				button.setAttribute('data-nav-u', 'menu-button-0');
				button.setAttribute('data-nav-d', 'menu-button-1');
				button.id = 'menu-button-0';
			});

			button.addEventListener('click', () => {
				// player.hidePauseMenu();
				player.play();
			});
			break;
		case 'restart':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit;height: inherit;transform: scale(.7);">
				<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('restart-button');

			player.on('showPauseMenu', () => {
				parent.append(button);

				button.setAttribute('data-nav-u', 'menu-button-0');
				button.setAttribute('data-nav-d', 'menu-button-2');
				button.id = 'menu-button-1';
			});

			button.addEventListener('click', () => {
				// player.playFromBeginning();
			});
			break;

		case 'showEpisodeMenu':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit;height: inherit;transform: scale(.9);">
				<path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-episode-menu-button');

			player.on('showPauseMenu', () => {
				let number = 1;
				if (player.playlist().length > 1) {
					parent.append(button);
					number += 1;
				}

				button.setAttribute('data-nav-u', `menu-button-${number - 1}`);
				button.setAttribute('data-nav-d', `menu-button-${number + 1}`);
				button.id = `menu-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.showEpisodeMenu();
			});

			player.on('playing', () => {
				if (player.playlist().length > 1) {
					button.style.display = 'flex';
				} else {
					button.style.display = 'none';
				}
			});

			break;
		case 'showLanguageMenu':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit;height: inherit;transform: scale(.6);">
				<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-language-menu-button');

			player.on('showPauseMenu', () => {
				let number = 1;
				if (player.playlist().length > 1) {
					number += 1;
				}
				// if (player.audio().length > 0 || player.text().length > 0) {
				// 	parent.append(button);
				// 	number += 1;
				// }

				button.setAttribute('data-nav-u', `menu-button-${number - 1}`);
				button.setAttribute('data-nav-d', `menu-button-${number + 1}`);
				button.id = `menu-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.showLanguageMenu();
			});
			break;
		case 'showQualityMenu':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit;height: inherit;transform: scale(.6);">
				<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm7-1c0 .55-.45 1-1 1h-.75v1.5h-1.5V15H14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v4zm-3.5-.5h2v-3h-2v3z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-quality-button');
			player.on('showPauseMenu', () => {
				let number = 1;
				if (player.playlist().length > 1) {
					number += 1;
				}
				// if (player.audio().length > 0 || player.text().length > 0) {
				// 	number += 1;
				// }
				// if (player.quality().length > 0) {
				// 	parent.append(button);
				// 	number += 1;
				// }

				button.setAttribute('data-nav-u', `menu-button-${number - 1}`);
				button.setAttribute('data-nav-d', `menu-button-${number + 1}`);
				button.id = `menu-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.showQualityMenu();
			});

			break;

		case 'back':
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('back-button');

			player.on('showPauseMenu', () => {
				parent.append(button);

				let number = 2;
				if (player.playlist().length > 1) {
					number += 1;
				}
				// if (player.audio().length > 0 || player.text().length > 0) {
				// 	number += 1;
				// }
				// if (player.quality()?.length > 0) {
				// 	number += 1;
				// }

				button.setAttribute('data-nav-u', `menu-button-${number - 1}`);
				button.setAttribute('data-nav-d', `menu-button-${number + 1}`);
				button.id = `menu-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.hidePauseMenu();
				// player.goBack();
			});
			break;

		// episodeScreen buttons
		case 'episodeResumePlayback':
			parent.append(button);
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;">
				<path d="M8 5v14l11-7z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('resume-playback-button');

			player.on('showEpisodeMenu', () => {
				button.focus();
				// const number = player.seasons.length;
				// button.setAttribute('data-nav-u', `season-button-${player.current().item.season - 1}`);
				// button.setAttribute('data-nav-d', `season-button-${number + 1}`);
				// button.setAttribute(
				// 	'data-nav-r',
				// 	`episode-button-${player.current().item.season}-${player.current().item.episode - 1}`
				// );
				// button.id = `season-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.hideEpisodeMenu();
				player.play();
			});
			break;
		case 'episodeShowPauseMenu':
			parent.append(button);
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-pause-menu-button');

			player.on('showEpisodeMenu', () => {
				// const number = player.seasons.length + 1;
				// button.setAttribute('data-nav-u', `season-button-${number - 1}`);
				// button.setAttribute('data-nav-d', `season-button-${number + 1}`);
				// button.setAttribute(
				// 	'data-nav-r',
				// 	`episode-button-${player.current().item.season}-${player.current().item.episode - 1}`
				// );
				// button.id = `season-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.showPauseMenu();
			});
			break;

		// languageMenu buttons
		case 'languageResumePlayback':
			parent.append(button);
			button.style.marginTop = '12px';
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('hide-menu-button');

			player.on('audioTracks', () => {
				// const number = player.audio().length > 0
				// 	? player.audio().length
				// 	: 1;
				// button.setAttribute('data-nav-u', `audio-button-${number - 1}`);
				// button.setAttribute('data-nav-d', `audio-button-${number + 1}`);
				// button.id = `audio-button-${number}`;
			});

			player.on('showLanguageMenu', () => {
				// button.setAttribute('data-nav-r', `text-button-${player.current().textTrack.index}`);
			});

			player.on('showLanguageMenu', () => {
				button.focus();
			});

			button.addEventListener('click', () => {
				// player.hideLanguageMenu();
				// player.play();
			});
			break;
		case 'languageShowPauseMenu':
			parent.append(button);
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-pause-menu-button');

			player.on('audioTracks', () => {
				// const number = player.audio().length > 0
				// 	? player.audio().length + 1
				// 	: 2;
				// button.setAttribute('data-nav-u', `audio-button-${number - 1}`);
				// button.setAttribute('data-nav-d', `audio-button-${number + 1}`);
				// button.id = `audio-button-${number}`;
			});

			player.on('showLanguageMenu', () => {
				// button.setAttribute('data-nav-r', `text-button-${player.current().textTrack.index}`);
			});

			button.addEventListener('click', () => {
				// player.showPauseMenu();
			});
			break;

		// qualityMenu buttons
		case 'qualityResumePlayback':
			parent.append(button);
			button.style.marginTop = '12px';
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('hide-quality-menu-button');

			player.on('showQualityMenu', () => {
				button.focus();
			});

			player.on('qualityTracks', () => {
				// const number = player.quality().length;
				// button.setAttribute('data-nav-u', `quality-button-${number - 1}`);
				// button.setAttribute('data-nav-d', `quality-button-${number + 1}`);
				// button.id = `quality-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.hideQualityMenu();
				// player.play();
			});
			break;
		case 'qualityShowPauseMenu':
			parent.append(button);
			spanChild.innerHTML = `
			<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: inherit; height: inherit;transform: scale(.8);">
				<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" style="fill: currentColor;"></path>
			</svg>
		`;
			button.classList.add('show-quality-menu-button');

			player.on('qualityTracks', () => {
				// const number = player.quality().length + 1;
				// button.setAttribute('data-nav-u', `quality-button-${number - 1}`);
				// button.setAttribute('data-nav-d', `quality-button-${number + 1}`);
				// button.id = `quality-button-${number}`;
			});

			button.addEventListener('click', () => {
				// player.showPauseMenu();
			});
			break;

		default:
			break;
	}

	if (focus) {
		button.focus();
	}

	return button;
};
