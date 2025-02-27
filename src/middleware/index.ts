import { sequence } from 'astro:middleware'
import updateStore from './update-store.ts'
import setCid from './set-cid.ts'
import injectPiniaState from './inject-pinia-state.ts'
import auth from './auth.ts'
import getLotteryTypes from './get-lottery-types.ts'
import setDefaultLotteryType from './set-default-lottery-type.ts'
import getWebConfig from './get-web-config.ts'

export const onRequest = sequence(
	setCid,
	updateStore,
	getLotteryTypes,
	setDefaultLotteryType,
	auth,
	getWebConfig
)
