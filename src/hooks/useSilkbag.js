import { getListYear, getSinkBagLists } from '@/api/silkbag'

export function useSilkbag() {
	const getListYears = async () => {
		let years = []
		const res = await getListYear()
		const lists = _get(res, 'data.list', [])
		years = lists.map((year) => ({ text: year, value: year }))
		return years
	}

	const getSilkBagLists = async (year) => {
		const res = await getSinkBagLists({ year })
		return _get(res, 'data.list', [])
	}

	return {
		getListYears,
		getSilkBagLists,
	}
}
