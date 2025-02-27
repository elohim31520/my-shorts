import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClientStore = defineStore(
	'client',
	() => {
		const cid = ref('')
		return { cid }
	},
	{
		persistedState: {
			persist: true,
		},
	}
)
