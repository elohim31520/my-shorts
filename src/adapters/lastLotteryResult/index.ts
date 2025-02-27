import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import type { LastLotteryResult } from './type'
import {
	get as _get,
	split as _split,
	defaultTo as _defaultTo,
} from 'lodash-es'
import { getBallNumberData } from '../util'
import { parseDate } from '@/modules/date'

export class LastLotteryResultAdapterA6
	implements ApiResponseAdapter<LastLotteryResult>
{
	async adapt(response: any): Promise<StandardApiResponse<LastLotteryResult>> {
		const code = _get(response, 'code', 0)
		const issue = _get(response, 'data.lastIssue', '')
		const nextIssue = _get(response, 'data.issue', '')
		const nextTime = parseDate(_get(response, 'data.endTime', 0)).getTime()
		const openDate = parseDate(_get(response, 'data.beginTime', ''))
		const { openCode, totalParity, totalSize } = getBallNumberData(
			_split(_get(response, 'lastOpenCode', ''), ','),
			openDate
		)
		const success = code === 0

		return {
			success,
			errCode: '',
			errMessage: '',
			data: {
				year: openDate.getFullYear(),
				issue,
				openCode,
				totalParity,
				totalSize,
				nextIssue,
				nextTime,
			},
		}
	}
}

export class LastLotteryResultAdapterHK6
	implements ApiResponseAdapter<LastLotteryResult>
{
	async adapt(response: any): Promise<StandardApiResponse<LastLotteryResult>> {
		const code = _get(response, 'code', 10000)
		const issue = _get(response, 'data.period', '')
		const nextIssue = _get(response, 'data.nextLotteryNumber', '')
		const nextTime = _get(response, 'data.nextLotteryTimestamp', 0)
		const openDate = parseDate(_get(response, 'data.lotteryTime', ''))
		const { openCode, totalParity, totalSize } = getBallNumberData(
			_get(response, 'data.originalDataList', []),
			openDate
		)

		const success = code === 10000

		return {
			success,
			errCode: '',
			errMessage: '',
			data: {
				year: openDate.getFullYear(),
				issue,
				openCode,
				totalParity,
				totalSize,
				nextIssue,
				nextTime,
			},
		}
	}
}

export class LastLotteryResultAdapterTW6
	implements ApiResponseAdapter<LastLotteryResult>
{
	async adapt(response: any): Promise<StandardApiResponse<LastLotteryResult>> {
		const code = _get(response, 'code', 0)
		const issue = String(_get(response, 'body.Newest.Period', ''))
		const nextIssue = String(_get(response, 'body.Drawing.Period', ''))
		const nextTime = parseDate(
			_get(response, 'body.Drawing.DrawingTime', 0)
		).getTime()
		const openDate = parseDate(_get(response, 'body.Newest.Date', ''))
		const { openCode, totalParity, totalSize } = getBallNumberData(
			_split(_get(response, 'body.Newest.Numbers', ''), ','),
			openDate
		)

		const success = code === 0

		return {
			success,
			errCode: '',
			errMessage: '',
			data: {
				year: openDate.getFullYear(),
				issue,
				openCode,
				totalParity,
				totalSize,
				nextIssue,
				nextTime,
			},
		}
	}
}

export class LastLotteryResultAdapterSG6
	implements ApiResponseAdapter<LastLotteryResult>
{
	async adapt(response: any): Promise<StandardApiResponse<LastLotteryResult>> {
		const data = _get(response, 'data.[0]', {})
		const issue = _get(data, 'games', '')
		const { nextIssue, nextTime } = (() => {
			const date = parseDate(_get(data, 'stopbet', ''))
			date.setDate(date.getDate() + 1)
			const nextIssue =
				date.getFullYear().toString() +
				('0' + (date.getMonth() + 1)).slice(-2) +
				('0' + date.getDate()).slice(-2)
			const nextTime = date.getTime()

			return {
				nextIssue,
				nextTime,
			}
		})()
		const openDate = parseDate(_get(response, 'data.[0].stopbet', ''))
		const { openCode, totalParity, totalSize } = getBallNumberData(
			(() => {
				const { num1, num2, num3, num4, num5, num6, sp } = data

				return [num1, num2, num3, num4, num5, num6, sp]
			})(),
			openDate
		)
		const success = true

		return {
			success,
			errCode: '',
			errMessage: '',
			data: {
				year: openDate.getFullYear(),
				issue,
				openCode,
				totalParity,
				totalSize,
				nextIssue,
				nextTime,
			},
		}
	}
}

export class LastLotteryResultAdapterXA6
	implements ApiResponseAdapter<LastLotteryResult>
{
	async adapt(response: any): Promise<StandardApiResponse<LastLotteryResult>> {
		const code = _get(response, 'd', 0)
		const data = _get(response, 'k', '')
		const [
			issue,
			num1,
			num2,
			num3,
			num4,
			num5,
			num6,
			num7,
			nextIssue = '',
			...nextDate
		] = _split(data, ',')
		const nextTime = (() => {
			const year = nextIssue.slice(0, 4)
			const timeString = _get(nextDate, '[3]', '')
				.replace('点', ':')
				.replace('分', '')
			const date = parseDate(
				`${year}-${nextDate[0]}-${nextDate[1]} ${timeString}:00`
			)

			return date.getTime()
		})()
		const year = +(issue?.slice(0, 4) || parseDate(new Date()).getFullYear())
		const { openCode, totalParity, totalSize } = getBallNumberData([
			num1,
			num2,
			num3,
			num4,
			num5,
			num6,
			num7,
		])
		const success = true

		return {
			success,
			errCode: '',
			errMessage: '',
			data: {
				year,
				issue,
				openCode,
				totalParity,
				totalSize,
				nextIssue,
				nextTime: _defaultTo(nextTime, 0),
			},
		}
	}
}
