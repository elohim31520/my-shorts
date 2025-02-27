import { Redis } from 'ioredis'
const { REDIS_URL, PUBLIC_REDIS_ENABLE } = import.meta.env
const redisClient = Boolean(PUBLIC_REDIS_ENABLE) ? new Redis(REDIS_URL) : null
export default redisClient

export const subscriber = Boolean(PUBLIC_REDIS_ENABLE)
	? new Redis(REDIS_URL)
	: null
