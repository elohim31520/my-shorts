/**
 * 將 unocss 中的 rem 單位轉換成基於 baseRem 的新單位
 */

import { definePreset } from '@unocss/core'

const remRegExp = /(-?[.\d]+)rem/g

export interface options {
	/**
	 * 1 = 0.0625 rem
	 * @default 0.0625
	 */
	baseRem?: number
}

export const presetPxToRem = definePreset((options: options = {}) => {
	const { baseRem = 0.0625 } = options

	return {
		name: 'preset-px-to-rem',
		// 定義預設的後處理函式
		postprocess: (util) => {
			// 遍歷所有 CSS 規則的鍵值對
			util.entries.forEach((i) => {
				// 獲取 CSS 規則的值
				const value = i[1]
				// 如果值是字串型別並且包含 rem 單位
				if (typeof value === 'string' && remRegExp.test(value))
					// 替換 rem 單位的值
					i[1] = value.replace(remRegExp, (_, p1) => `${p1 * baseRem * 4}rem`)
			})
		},
	}
})

export default presetPxToRem
