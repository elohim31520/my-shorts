export interface LotteryBall {
	value: string
	pet: string
	ws: string
	color: string
}

export interface LotteryHistory {
	year: number
	issue: string
	openCode: LotteryBall[]
	totalParity: '单' | '双'
	totalSize: '大' | '小'
	recordTime: string
	shortIssue: string
	completeIssue: string
}
