import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import { get as _get } from 'lodash-es'

export class CommonAdapter implements ApiResponseAdapter<any> {
	async adapt(response: any): Promise<StandardApiResponse<any>> {
		const taskId = _get(response, 'taskId', 0)
		const data = parseData(response)

		return {
			success: true,
			errCode: '',
			errMessage: '',
			taskId,
			data,
		}
	}
}

function parseData(response: any) {
	if (!response) return undefined
	if (response.hasOwnProperty('data')) {
		return _get(response, 'data', undefined)
	}
	//if 回傳沒有data字段，就把所有字段放到data (除了 taskId)
	delete response.taskId
	return response
}
