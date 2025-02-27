import DOMPurify from 'isomorphic-dompurify'

export default {
	beforeMount(el, binding) {
		el.innerHTML = DOMPurify.sanitize(binding.value)
	},
	updated(el, binding) {
		if (binding.value !== binding.oldValue) {
			el.innerHTML = DOMPurify.sanitize(binding.value)
		}
	},
}
