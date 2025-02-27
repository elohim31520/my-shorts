export interface StandardApiResponse<T = any> {
	success: boolean
	errCode: string
	errMessage: string
	taskId?: string
	data: T
}

export interface ApiResponseAdapter<T = any> {
	adapt(response: any): Promise<StandardApiResponse<T>>
}
