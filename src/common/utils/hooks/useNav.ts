import { cloneDeep } from '@/common/utils'
import { useBaseStore } from '@/stores/shorts'

export function useNav() {
	const store = useBaseStore()

	return (path, query = {}, data?: any) => {
		if (data) {
			store.routeData = cloneDeep(data)
		}
		console.log('跳轉')
	}
}
