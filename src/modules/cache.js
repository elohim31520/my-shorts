import redis from './redis.js'

const { PUBLIC_REDIS_ENABLE, PUBLIC_REDIS_EXPIRE } = import.meta.env
const isRedisActive = Boolean(PUBLIC_REDIS_ENABLE)

const cache = {
	isActive: isRedisActive,
	defaultExpire: _defaultTo(Number(PUBLIC_REDIS_EXPIRE), 0),
	async get(key) {
		return await redis.get(key)
	},

	//expire 單位秒
	async set(key, value, expire = 0) {
		const args = [key, value]
		if (expire > 0) args.push(...['EX', expire])
		return await redis.set.call(redis, args)
	},

	async delete(key) {
		const keys = _isArray(key) ? key : [key]
		await redis.del(...keys)
	},
}

export default cache
