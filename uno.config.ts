import {
	defineConfig,
	presetIcons,
	presetUno,
	transformerDirectives,
} from 'unocss'
import presetPxToRem from './plugin/preset-px-to-rem.ts'

const DIRECTION = { t: 'top', r: 'right', b: 'bottom', l: 'left' }
const BASE_FONT_SIZE = 16

export default defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno(), presetPxToRem()],
	rules: [
		[
			/**
			 * 設定截斷行數的 CSS 屬性，`d` 是從類名中提取的行數
			 * 範例：truncate-3-lines
			 */
			/^truncate-(\d+)-lines$/,
			([, d]) => ({
				display: '-webkit-box',
				'-webkit-line-clamp': `${d}`,
				'-webkit-box-orient': 'vertical',
				overflow: 'hidden',
				'text-overflow': 'ellipsis',
				'white-space': 'normal',
			}),
		],
		[
			/**
			 * border 快捷規則, bd 是四個方向，bt 是top以此類推，後面邊框樣式，寬度，顏色可以寫在任一位置沒限制順序
			 * 範例：bt-red-dashed-1，bb-5px-red，bl-blue，bd-1px
			 */
			/^b(t|r|b|l|d)-(.*)/,
			([, d, c]) => {
				const direction = DIRECTION[d] || ''
				// 構建 CSS 屬性名稱，如 border-top, border-right 等
				const p = direction ? `border-${direction}` : 'border'
				const attrs = c.split('-')
				// 檢查 attrs 陣列是否包含標準的邊框樣式，如果沒有，則新增 'solid'
				if (
					!attrs.some((item) =>
						/^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/.test(
							item
						)
					)
				) {
					attrs.push('solid')
				}

				// 檢查是否包含純數字的寬度，並檢查是否已經包含單位
				const widthWithNoUnitIndex = attrs.findIndex((item) =>
					/^\d+(\.\d+)?$/.test(item)
				)
				if (widthWithNoUnitIndex !== -1) {
					// 如果有數字且沒有單位，將該數字後面加上 'rem'
					attrs[widthWithNoUnitIndex] =
						`${+attrs[widthWithNoUnitIndex] * 0.25}rem`
				} else if (!attrs.some((item) => /^\d/.test(item))) {
					// 如果沒有任何數字，則預設新增 '0.25rem' 等同 '1px'
					attrs.push('0.25rem')
				}
				return {
					[p]: attrs.join(' '),
				}
			},
		],
		[
			/**
			 * 透過 CSS zoom 屬性縮放文字，達到小於瀏覽器預設最小字型大小的視覺效果
			 * 範例：text-mini-10 會使文字透過縮放視覺上等於10px大小
			 */
			/^text-mini-(\d+)$/,
			([, size]) => {
				const scale = +size / BASE_FONT_SIZE
				return {
					'font-size': '4rem',
					zoom: scale,
				}
			},
		],
	],
	shortcuts: {
		'color-primary': 'color-#34c759',
		'bg-primary': 'bg-#34c759',
		'shadow-primary': 'shadow-[0_0_1rem_0_#0000001A]',
		'flex-center': 'flex justify-center items-center',
		'flex-x-center': 'flex justify-center',
		'flex-y-center': 'flex items-center',
		'w-full-limited': 'w-full max-w-480px',
		'bg-skeleton': 'animate-gray',
	},
	theme: {
		breakpoints: {
			pc: '480px',
		},
		animation: {
			keyframes: {
				gray: '{ 0% { background-color: #e5e7eb} 100% { background-color : #f3f4f6}}',
			},
			counts: {
				gray: 'infinite alternate forwards',
			},
			durations: {
				gray: '1s',
			},
			timingFns: {
				gray: 'ease-in-out',
			},
		},
	},
})
