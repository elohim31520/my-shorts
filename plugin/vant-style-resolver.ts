import fs from 'fs'
import path from 'path'
import {
	debounce as _debounce,
	kebabCase as _kebabCase,
	includes as _includes,
	entries as _entries,
} from 'lodash-es'

// 固定要引入的匯入語句，有些組件並非自動引入所以不會寫入 components.d.ts
const fixedImports = [
	"import 'vant/es/notify/style/index.mjs'",
	"import 'vant/es/toast/style/index.mjs'",
]

const createApiMap = (): Map<string, string> => {
	const apiMap = new Map<string, string>()
	const api = {
		dialog: [
			'showDialog',
			'closeDialog',
			'showConfirmDialog',
			'setDialogDefaultOptions',
			'resetDialogDefaultOptions',
		],
		imagePreview: ['showImagePreview'],
		notify: [
			'showNotify',
			'closeNotify',
			'setNotifyDefaultOptions',
			'resetNotifyDefaultOptions',
		],
		toast: [
			'showToast',
			'closeToast',
			'showFailToast',
			'showLoadingToast',
			'showSuccessToast',
			'allowMultipleToast',
			'setToastDefaultOptions',
			'resetToastDefaultOptions',
		],
	}

	_entries(api).forEach(([module, functions]) => {
		functions.forEach((func) => apiMap.set(func, module))
	})

	return apiMap
}

/**
 * 解析 components.d.ts 文件並提取 Vant 組件名稱
 * @returns {string[]} Vant 組件名稱陣列
 */
const parseDTSFile = (): string[] => {
	const dtsContent = fs.readFileSync('./types/components.d.ts', 'utf-8')
	const vantComponents: string[] = []

	// 使用正則表達式匹配 Vant 組件名稱，從 "import('vant/es')['ComponentName']" 中提取 ComponentName
	const vantRegex = /import\('vant\/es'\)\['(.+?)'\]/g
	let match: RegExpExecArray | null

	while ((match = vantRegex.exec(dtsContent)) !== null) {
		vantComponents.push(match[1])
	}

	return vantComponents
}

/**
 * 生成唯一的匯入語句集合，包括固定匯入和動態匯入
 * @param {Set<string>} importSet - 用於儲存唯一匯入語句的集合
 * @param {string} filePath - 要匯入的檔案路徑
 */
const addUniqueImport = (importSet: Set<string>, filePath: string): void => {
	const fullPath = path.join('node_modules', filePath)
	// 檢查引入路徑是否對應實際存在的文件
	if (fs.existsSync(fullPath)) {
		importSet.add(`import '${filePath}'`)
	}
}

/**
 * 將匯入語句寫入指定的檔案
 * @param {Set<string>} importSet - 用於儲存唯一匯入語句的集合
 */
const writeImportFile = _debounce((importSet: Set<string>) => {
	const content = Array.from(importSet).join('\n') + '\n'
	fs.writeFileSync('./src/modules/vantStyleImport.js', content)
}, 300)

// 根據提取出的組件名稱生成匯入文件
const generateImportFile = (): void => {
	const importSet = new Set<string>()

	// 添加固定的匯入語句
	fixedImports.forEach((importStatement) => importSet.add(importStatement))

	const vantComponents = parseDTSFile()
	const apiMap = createApiMap()

	vantComponents.forEach((component) => {
		const componentPath = `vant/es/${_kebabCase(component)}/style/index.mjs`
		addUniqueImport(importSet, componentPath)

		if (apiMap.has(component)) {
			const module = apiMap.get(component)
			const modulePath = `vant/es/${_kebabCase(module)}/style/index.mjs`
			addUniqueImport(importSet, modulePath)
		}
	})

	writeImportFile(importSet)
}

const isDevelopment = process.env.NODE_ENV === 'development'

const debouncedGenerateImportFile = _debounce(generateImportFile, 300)

// 監控 components.d.ts 文件變動，並在變動時重新生成匯入文件，僅在開發模式監控
if (isDevelopment) {
	fs.watch('./types/components.d.ts', (eventType) => {
		if (eventType === 'change') {
			debouncedGenerateImportFile()
		}
	})
}

// 初始執行一次生成匯入文件
generateImportFile()
