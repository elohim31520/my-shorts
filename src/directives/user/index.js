import { redirect, isBlank } from '@/modules/util.js'
export default {
	created(el, binding) {
		el.addEventListener('click', function (event) {
			if (el.tagName == 'A') event.preventDefault()
			const userId = binding.value
			if (isBlank(userId)) return
			if (binding.modifiers.expert) {
				redirect(`/expert/user/${userId}`)
			} else {
				redirect(`/user/${userId}`)
			}
		})
	},
}
