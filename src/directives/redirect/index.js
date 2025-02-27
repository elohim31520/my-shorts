import { redirect } from '@/modules/util.js'

export default {
	created(el, binding) {
		el.addEventListener('click', function (event) {
			if (el.tagName == 'A') event.preventDefault()
			const { auth, skip, ignoreSelf } = binding.modifiers

			let href = el.getAttribute('href')
			let query = {}

			if (binding.value) {
				if (_isString(binding.value)) {
					href = binding.value
				} else if (_isObject(binding.value)) {
					href = binding.value.to || href
					query = binding.value.query || {}
				}
			}

			redirect(href, { auth, skip, ignoreSelf }, query)
		})
	},
}
