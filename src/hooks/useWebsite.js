export function useWebsite() {
	//siteUrl1 ~ siteUrl5 其中一個有值
	function getSiteUrl(vo) {
		const result = _range(1, 5).map((i) => vo[`siteUrl${i}`])
		return _compact(result)[0]
	}

	return { getSiteUrl }
}
