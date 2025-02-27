import gulp from 'gulp'
import { exec } from 'child_process'
import replace from 'gulp-replace'
import { format } from 'date-fns'
import fs from 'fs'
import zip from 'gulp-zip'
import FormData from 'form-data'
import axios from 'axios'
// import 'dotenv/config'
import dotenv from 'dotenv'
import cac from 'cac'
import { trim } from 'lodash-es'

const cli = cac()
cli.option('--p <prod>', '生產環境')

const { options } = cli.parse()
const VERSION = getVersion()

dotenv.config({ path: options.p ? '.env.prod' : '.env.uat' })
dotenv.populate(
	process.env,
	{
		PUBLIC_VERSION: VERSION,
		IS_BUILD: true,
	},
	{ override: true }
)

const {
	DEPLOY_HOST_IP: HOST_IP,
	PUBLIC_ASSETS_PREFIX: ASSETS_PREFIX,
	CDN_HOST,
} = process.env

log('==================')
log(`環境:${options.p ? 'PRD' : 'UAT'}`)
log(`版本號: ${VERSION}`)
log(`服務器位置: ${HOST_IP}`)
log(`資源前綴: ${ASSETS_PREFIX}`)
log('==================')

function build() {
	return new Promise((resolve, reject) => {
		const child = exec(
			`npm run build -- --v=${VERSION}`,
			(err, stdout, stderr) => {
				if (err) {
					return reject(err)
				}
				resolve()
			}
		)
		child.stdout.on('data', function (data) {
			console.log(data.toString())
		})
	})
}

//處理client的 public-assets
function publicAssetsClientJs() {
	return gulp
		.src(`./dist/client/_astro/**/*.js`)
		.pipe(
			replace(
				/(:?)("|`|')\/public-assets\//g,
				`$1window.CDN_HOST+$2${ASSETS_PREFIX}/public-assets/`
			)
		)
		.pipe(
			replace(
				/img src=(")\/public-assets\//g,
				`img src=$1'+window.CDN_HOST+'${ASSETS_PREFIX}/public-assets/`
			)
		)
		.pipe(
			replace(
				/(=|\?|\+|\|)"\/public-assets\//g,
				`$1window.CDN_HOST+"${ASSETS_PREFIX}/public-assets/`
			)
		)
		.pipe(replace(/"%PLACEHOLDER_CDN%/g, `window.CDN_HOST+"`))
		.pipe(gulp.dest(`./dist/client/_astro`))
}

function publicAssetsClientCss() {
	return gulp
		.src(`./dist/client/_astro/**/*.css`)
		.pipe(replace(/\/public-assets\//g, `${ASSETS_PREFIX}/public-assets/`))
		.pipe(gulp.dest(`./dist/client/_astro`))
}

//處理server的 public-assets
function publicAssetsServer() {
	return gulp
		.src(`./dist/server/**`)
		.pipe(
			replace(
				/("|'|url\(|`)\/public-assets\//g,
				`$1%PLACEHOLDER_CDN%${ASSETS_PREFIX}/public-assets/`
			)
		)
		.pipe(
			replace(new RegExp(String.raw`/${VERSION}(?=/public-assets/)`, 'g'), '')
		)
		.pipe(gulp.dest(`./dist/server/`))
}

function move(done) {
	const destClient = `./dist/client${ASSETS_PREFIX}/${VERSION}/_astro`
	const srcClient = `./dist/client/_astro`
	fs.mkdirSync(destClient, { recursive: true })
	fs.renameSync(srcClient, destClient)

	const destPublicAssets = `./dist/client${ASSETS_PREFIX}/public-assets`
	const srcPublicAssets = `./dist/client/public-assets`
	fs.mkdirSync(destPublicAssets, { recursive: true })
	fs.renameSync(srcPublicAssets, destPublicAssets)

	const destServer = `./dist/_server${ASSETS_PREFIX}/${VERSION}/_base`
	const srcServer = `./dist/server`
	fs.mkdirSync(destServer, { recursive: true })
	fs.renameSync(srcServer, destServer)

	const newDest = destServer.replace('_', '')
	fs.mkdirSync(newDest, { recursive: true })
	fs.renameSync(destServer, newDest)
	fs.rmSync('./dist/_server', { recursive: true, force: true })

	const files = ['package.json', 'package-lock.json']
	files.forEach((file) => {
		const dest = `./dist/server/${ASSETS_PREFIX}/${file}`
		fs.copyFileSync(`./${file}`, dest)
	})

	done()
}

function zipClient() {
	return gulp
		.src('./dist/client/**', { encoding: false })
		.pipe(zip('client.zip'))
		.pipe(gulp.dest('dist'))
}

function zipServer() {
	return gulp
		.src('./dist/server/**', { encoding: false })
		.pipe(zip('server.zip'))
		.pipe(gulp.dest('dist'))
}

async function upload(done) {
	const hostIps = HOST_IP.split(',').map(trim)
	console.log(`開始上傳檔案...`)
	for (let index = 0; index < hostIps.length; index++) {
		const form = new FormData()
		form.append('client', fs.createReadStream(`./dist/client.zip`))
		form.append('server', fs.createReadStream(`./dist/server.zip`))
		form.append('path', ASSETS_PREFIX)
		const ip = hostIps[index]
		const res = await axios
			.post(`http://${ip}/deploy/upload`, form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res) => res.data)
		if (res.code != 1) {
			return done(new Error(`[${ip}] ${res.code}:${res.message}`))
		}
		console.log(`上傳 ${ip} 完成.`)
	}
	console.log(`上傳檔案結束...`)
	done()
}

async function refresh(done) {
	const params = {
		path: `${ASSETS_PREFIX}/${VERSION}`,
		cdn: CDN_HOST,
		version: VERSION,
	}
	const hostIps = HOST_IP.split(',').map(trim)
	for (let index = 0; index < hostIps.length; index++) {
		const ip = hostIps[index]
		const res = await axios
			.post(`http://${ip}/deploy/refresh`, JSON.stringify(params), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res) => res.data)
		if (res.code != 1) {
			return done(new Error(`[${ip}] ${res.code}:${res.message}`))
		}
		console.log(`更新設定 ${ip} 完成.`)
	}
	done()
}

function getVersion() {
	return format(new Date(), 'yyMMddHHmm')
}

function log(text) {
	console.log('\x1b[33m%s\x1b[0m', text)
}

export default gulp.series(
	build,
	publicAssetsClientCss,
	publicAssetsClientJs,
	publicAssetsServer,
	move,
	zipClient,
	zipServer,
	upload,
	refresh
)
