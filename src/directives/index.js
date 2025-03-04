import safeHtml from './safeHtml'
import redirect from './redirect'
import user from './user'
import love from './love'

// 掛載自定義指令
export function loadDirectives(app) {
	app.directive('safe-html', safeHtml)
	app.directive('redirect', redirect)
	app.directive('user', user)
	app.directive('love', love)
}
