import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebInfoStore = defineStore(
	'webInfo',
	() => {
		const templateId = ref('')
		const sketchCode = ref('')
		const websiteId = ref('')
		const domain = ref('')
		const userId = ref('')
		const manageSiteId = ref('')
		return { templateId, sketchCode, websiteId, domain, userId, manageSiteId }
	},
	{
		persistedState: {
			persist: true,
		},
	}
)
