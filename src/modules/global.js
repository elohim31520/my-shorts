import { getDevice } from './util.js'

export default {
	install: () => {
		const { isH5, result } = getDevice()
		const clientType = isH5 ? 'C_H5' : 'C_WEB'
		const clientFlag = isH5 ? 'h' : 'w'
		window._global = {
			isH5,
			clientType,
			clientFlag,
			ua: result,
			isLogin: false,
		}
	},
}
