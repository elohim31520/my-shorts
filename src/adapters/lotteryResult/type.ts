export interface LotteryBall {
	value: string
	pet: string
	ws: string
	color: string
}

export interface LotteryResult {
	year: number
	issue: string
	openCode: LotteryBall[]
	totalParity: '单' | '双'
	totalSize: '大' | '小'
	openTime: number
}
