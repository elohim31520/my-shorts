import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import vue from '@astrojs/vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import UnoCSS from '@unocss/astro'
import svgLoader from 'vite-svg-loader'
import { lodashImports } from './config/lodash-imports'
import cac from 'cac'
import 'dotenv/config'
import cookie from 'cookie'
import './plugin/vant-style-resolver.ts'

const { PUBLIC_ASSETS_PREFIX, PUBLIC_BASE_KV_API_URL, PUBLIC_DOMAIN_SPECIFY } =
	process.env
const cli = cac()
cli
	.command('build', 'Build the project')
	.option('--v <version>', '請輸入版本號')
const { options } = cli.parse()

let assetsPrefix = ''
if (options.v)
	assetsPrefix = `%PLACEHOLDER_CDN%${PUBLIC_ASSETS_PREFIX}/${options.v}`

// https://astro.build/config
export default defineConfig({
	output: 'server', // "static" "server" or "hybrid"
	adapter: node({
		mode: 'middleware',
		// mode: 'standalone',
	}),
	server: {
		host: '0.0.0.0',
	},
	build: {
		assetsPrefix,
	},
	integrations: [
		vue({
			appEntrypoint: '/src/modules/app.js',
		}),
		UnoCSS({
			injectReset: true,
		}),
		getInfo(),
	],
	vite: {
		plugins: [
			AutoImport({
				imports: [
					{
						from: 'lodash-es',
						imports: lodashImports,
					},
				],
				resolvers: [
					VantResolver({
						importStyle: false,
					}),
				],
				dts: 'types/auto-imports.d.ts',
			}),
			Components({
				resolvers: [
					VantResolver({
						importStyle: false,
					}),
				],
				dts: 'types/components.d.ts',
				dirs: [],
			}),
			svgLoader(),
		],
		ssr: {
			noExternal: ['vant'],
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@import 'src/styles/variable.scss';
						@import 'src/styles/mixins.scss';
					`,
				},
			},
		},
		// server: {
		// 	https: {
		// 		key: fs.readFileSync('cert/server.key'),
		// 		cert: fs.readFileSync('cert/server.pem'),
		// 	},
		// },
	},
	devToolbar: {
		enabled: false,
	},
})

function getInfo() {
	const key = 'webInfo'
	return {
		name: 'getInfo',
		hooks: {
			'astro:server:setup': ({ server }) => {
				server.middlewares.use(async function middleware(req, res, next) {
					let cookies = cookie.parse(req.headers.cookie || '')
					if (cookies[key]) return next()
					const url = `${PUBLIC_BASE_KV_API_URL}wm/domain/simple/${PUBLIC_DOMAIN_SPECIFY}`
					const data = await fetch(url).then((res) => res.json())
					const serializedCookie = `${key}="${JSON.stringify(JSON.stringify(data))}"; Path=/;`

					res.setHeader('Set-Cookie', [serializedCookie])
					if (req.headers.cookie) {
						req.headers.cookie += `; ${serializedCookie}`
					} else {
						req.headers.cookie = serializedCookie
					}

					next()
				})
			},
		},
	}
}
