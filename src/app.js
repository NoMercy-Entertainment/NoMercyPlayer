/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

function play() {
	if (jw) {
		jw.play();
	}
	if (js) {
		js.play();
	}
}

function pause() {
	if (jw) {
		jw.pause();
	}
	if (js) {
		js.pause();
	}
}

function sync() {
	jw.player.seek(js.player.currentTime());
}

function prev() {
	if (jw) {
		jw.previous();
	}

	if (js) {
		js.previous();
	}
};

function next() {

	if (jw) {
		jw.next();
	}

	if (js) {
		js.next();
	}
};