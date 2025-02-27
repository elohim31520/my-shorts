import { ref } from 'vue'

export function useCounter() {
	const count = ref(0)

	const incrementCount = () => {
		count.value++
	}

	const decrementCount = () => {
		count.value--
	}

	return {
		count,
		incrementCount,
		decrementCount,
	}
}
