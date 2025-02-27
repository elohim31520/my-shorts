import { watch, onMounted } from 'vue'

const loadedSymbols = []

export function useSvgIconLoader(props, symbolId) {
	const loadSvg = async () => {
		if (loadedSymbols.includes(symbolId.value)) return
		loadedSymbols.push(symbolId.value)

		let svgContent = ''
		try {
			// 動態導入 SVG 文件
			const svgModule = await import(`../../icons/svg/${props.name}.svg?raw`)
			svgContent = svgModule.default
		} catch (error) {
			console.error(`加載 SVG 文件出錯：${props.name}`)
			return
		}

		// 解析 SVG 內容
		const parser = new DOMParser()
		const doc = parser.parseFromString(svgContent, 'image/svg+xml')
		const svgElement = doc.documentElement

		// 創建 symbol
		const symbolDom = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'symbol'
		)
		symbolDom.setAttribute('id', symbolId.value)
		symbolDom.setAttribute('fill', 'none')
		symbolDom.setAttribute('viewBox', svgElement.getAttribute('viewBox'))
		while (svgElement.firstChild) {
			symbolDom.appendChild(svgElement.firstChild)
		}

		// 創建 svg 容器
		let svgContainerDom = document.getElementById('__svg__icons__dom__')
		if (!svgContainerDom) {
			svgContainerDom = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			)
			svgContainerDom.setAttribute('id', '__svg__icons__dom__')
			svgContainerDom.setAttribute(
				'style',
				'position:absolute; width:0; height:0'
			)
			svgContainerDom.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
			svgContainerDom.setAttribute(
				'xmlns:xlink',
				'http://www.w3.org/1999/xlink'
			)
			document.body.insertBefore(svgContainerDom, document.body.firstChild)
		}
		svgContainerDom.appendChild(symbolDom)
	}

	onMounted(() => {
		loadSvg()
	})

	watch(() => props.name, loadSvg)
}
