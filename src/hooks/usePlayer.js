import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

export function usePlayer() {
	function getPlayer({ id, url }) {
		return new Player({
			id,
			url,
			fluid: true,
			controls: true,
			autoplay: true,
			ignores: [
				'cssFullscreen',
				// 'fullscreen',
				// 'start',
				// 'definition',
				// 'makeBullet',
				// 'textTrack',
				// 'loading',
				// 'pc',
				// 'mobile',
				'playbackRate',
				// 'replay',
				// 'error',
				// 'poster',
			],
		})
	}

	const { Events } = Player

	return { getPlayer, Events }
}
