import { ref } from 'vue'

const selectedPicture = ref({})
const selectedLottery = ref('')
const selectedSeriesCode = ref('')
const pictureSeries = ref([])

export function useSelector() {
	return {
		selectedPicture,
		selectedLottery,
		selectedSeriesCode,
		pictureSeries,
	}
}
