import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import type { LotteryType } from './type'
import { getA6LotteryCode } from '@/modules/util.js'

export class LotteryTypeAdapter
	implements ApiResponseAdapter<LotteryType[] | undefined>
{
	async adapt(
		response: any
	): Promise<StandardApiResponse<LotteryType[] | undefined>> {
		const data = _get(response, 'data', [])
		const lotteryTypes: LotteryType[] = _map(data, (vo) => {
			return {
				key: vo.gameTypeCode, //a6
				name: vo.gameTypeShortName, //澳六
				code: vo.gameType, //2032
				codeA6: getA6LotteryCode(vo.gameTypeCode)!,
				fullName: vo.gameTypeLongName,
			}
		})
		return {
			success: true,
			errCode: '',
			errMessage: '',
			taskId: _get(response, 'taskId', 0),
			data: lotteryTypes,
		}
	}
}
