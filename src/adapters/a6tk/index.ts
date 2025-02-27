import type { StandardApiResponse, ApiResponseAdapter } from '../type'
import { get as _get, split as _split } from 'lodash-es'

export class A6tkAdapter implements ApiResponseAdapter<any> {
	async adapt(response: any): Promise<StandardApiResponse<any>> {
		const data = _get(response, 'data')
		const success = _get(response, 'success', false)
		// const errCode = success ? '' : '-1'
		// const errMessage = _get(response, 'error', '')

		return {
			success,
			errCode: '',
			errMessage: '',
			data,
		}
	}
}
