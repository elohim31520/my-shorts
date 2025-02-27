import log4js from 'log4js'

let logger = {
	debug() {},
}
if (Boolean(import.meta.env.LOG_ENABLE) && import.meta.env.SSR) {
	let options = {
		filename: './log/debug.log',
		maxLogSize: 1 * 1024 * 1024,
		backups: 1,
	}
	if (import.meta.env.MODE !== 'development') {
		options = {
			filename: `../templates${import.meta.env.PUBLIC_ASSETS_PREFIX}/log/debug.log`,
			maxLogSize: 5 * 1024 * 1024,
			backups: 10,
		}
	}
	log4js.configure({
		appenders: {
			app: {
				type: 'file',
				layout: {
					type: 'pattern',
					pattern: '[%d{yyyy-MM-dd hh:mm:ss SSS}] %m',
				},
				...options,
			},
		},
		categories: {
			default: { appenders: ['app'], level: 'debug' },
		},
	})
	logger = log4js.getLogger()
}

export default logger
