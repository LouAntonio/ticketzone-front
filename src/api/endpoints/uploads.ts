import { api } from '../client'

export interface UploadSignature {
	signature: string
	timestamp: number
	cloudName: string
	apiKey: string
	folder: string
}

export const uploadsApi = {
	signature: (folder?: string) =>
		api.post<UploadSignature>('/uploads/signature', { folder }).then((r) => r.data),
}
