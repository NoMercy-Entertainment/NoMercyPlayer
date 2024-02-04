// import VideoPlayer from './index';
//
// describe('VideoPlayer', () => {
// 	it('should create a new instance of VideoPlayer', () => {
// 		const player = new VideoPlayer('jwplayer', {
// 			playlist: 'https://cdn.jwplayer.com/v2/media/8VdGQhOf',
// 		});
// 		expect(player).toBeInstanceOf(VideoPlayer);
// 	});
//
// 	it('should set the Authorization header when a token is provided', () => {
// 		const xhrOpenSpy = jest.spyOn(XMLHttpRequest.prototype, 'open');
// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 		const player = new VideoPlayer('jwplayer', {
// 			playlist: 'https://cdn.jwplayer.com/v2/media/8VdGQhOf',
// 			accessToken: 'my-token',
// 		});
// 		expect(xhrOpenSpy).toHaveBeenCalled();
// 		expect(xhrOpenSpy.mock.calls[0][1]).toContain('Bearer my-token');
// 	});
// });
