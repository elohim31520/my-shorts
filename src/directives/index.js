import safeHtml from './safeHtml'
import redirect from './redirect'
import user from './user'

// 掛載自定義指令
export function loadDirectives(app) {
	app.directive('safe-html', safeHtml)
	app.directive('redirect', redirect)
	app.directive('user', user)
}
