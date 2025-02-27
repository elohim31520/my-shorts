import type { ApiResponseAdapter } from './type'

export class AdapterFactory {
	private static adapterMap: Map<RegExp, ApiResponseAdapter> = new Map()

	static registerAdapter(pattern: string, adapter: ApiResponseAdapter): void {
		const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
		this.adapterMap.set(regex, adapter)
	}

	static getAdapter(pathname: string): ApiResponseAdapter | undefined {
		for (let [regex, adapter] of this.adapterMap.entries()) {
			if (regex.test(pathname)) return adapter
		}
	}
}
