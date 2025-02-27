import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import type { LotteryResult } from './type'
import { get as _get, split as _split } from 'lodash-es'
import { getBallNumberData } from '../util'

export class LotteryResultAdapter
	implements ApiResponseAdapter<LotteryResult | undefined>
{
	async adapt(
		response: any
	): Promise<StandardApiResponse<LotteryResult | undefined>> {
		const taskId = _get(response, 'taskId', 0)
		const data = (() => {
			const issue = _get(response, 'issue', '')
			if (!issue) return

			const year = _get(response, 'year', 0)
			const openTime = _get(response, 'openTimeStamp', 0)
			const { openCode, totalParity, totalSize } = getBallNumberData(
				_split(_get(response, 'openCode', ''), ','),
				openTime
			)

			return { year, issue, openCode, totalParity, totalSize, openTime }
		})()
		const success = true

		return {
			success,
			errCode: '',
			errMessage: '',
			taskId,
			data,
		}
	}
}
