import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import type { LotteryHistory } from './type'
import {
	get as _get,
	split as _split,
	forEach as _forEach,
	map as _map,
} from 'lodash-es'
import { getBallNumberData } from '../util'

export class LotteryHistoryAdapter
	implements ApiResponseAdapter<LotteryHistory[]>
{
	async adapt(response: any): Promise<StandardApiResponse<LotteryHistory[]>> {
		const data = _get(response, 'data', [])
		const taskId = _get(response, 'taskId', 0)
		const histories: LotteryHistory[] = _map(
			data,
			({
				year,
				issue,
				numInfo,
				openTime,
				recordTime,
				completeIssue,
				shortIssue,
			}): LotteryHistory => {
				const numbers = _map(numInfo, ({ num }) => num)
				const { openCode, totalParity, totalSize } = getBallNumberData(
					numbers,
					openTime
				)

				return {
					year,
					issue,
					openCode,
					totalParity,
					totalSize,
					recordTime,
					completeIssue,
					shortIssue,
				}
			}
		)

		const success = true

		return {
			success,
			errCode: '',
			errMessage: '',
			taskId,
			data: histories,
		}
	}
}

export class LotteryHistoryAdapter2023
	implements ApiResponseAdapter<LotteryHistory[]>
{
	async adapt(response: any): Promise<StandardApiResponse<LotteryHistory[]>> {
		const data = _get(response, 'dataList', [])
		const histories: LotteryHistory[] = _map(
			data,
			({ year, issue, result, openTime, recordTime }) => {
				const numbers = _split(result, ',')
				const { openCode, totalParity, totalSize } = getBallNumberData(
					numbers,
					openTime
				)

				return {
					year,
					issue,
					openCode,
					totalParity,
					totalSize,
					recordTime,
				}
			}
		)

		const success = true

		return {
			success,
			errCode: '',
			errMessage: '',
			data: histories,
		}
	}
}
