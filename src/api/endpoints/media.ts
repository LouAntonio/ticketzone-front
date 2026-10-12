import { api } from '../client'

/** Entidade dona de um ficheiro. Espelha o enum `MediaOwnerType` do backend. */
export type MediaOwnerType =
	| 'USER'
	| 'EVENT'
	| 'VEHICLE'
	| 'PROMOTER'
	| 'CATEGORY'
	| 'PROMOTER_DOCS'

export type MediaResourceType = 'image' | 'video' | 'raw' | 'document'

export interface MediaSignatureData {
	uploadUrl: string
	cloudName: string
	apiKey: string
	timestamp: number
	signature: string
	publicId: string
	mediaId: string
	folder: string
	resourceType: string
	transformation: string
	eager: string
	allowedFormats: string
	/** Limite sugerido pelo backend. O limite real é configurado na Cloudinary. */
	maxBytes: number
}

export interface MediaRecord {
	id: string
	publicId: string
	resourceType: string
	deliveryType: string
	format: string | null
	bytes: number | null
	width: number | null
	height: number | null
	secureUrl: string | null
	folder: string | null
	status: 'PENDING' | 'CONFIRMED' | 'DELETED'
	ownerType: MediaOwnerType | null
	ownerId: string | null
	createdAt: string
	confirmedAt: string | null
	/** URL de entrega derivada (com transformação). */
	url: string | null
	/** Thumbnail 320px, gerado no upload. */
	thumbnailUrl: string | null
}

export interface UploadOptions {
	ownerType?: MediaOwnerType
	ownerId?: string
	resourceType?: MediaResourceType
	/** Validação local de tamanho, em bytes. */
	maxBytes?: number
}

export const mediaApi = {
	/** Passo 1: cria o registo PENDING e devolve a assinatura. */
	signature: (options: UploadOptions = {}) =>
		api
			.post<MediaSignatureData>('/media/signature', {
				ownerType: options.ownerType,
				ownerId: options.ownerId,
				resourceType: options.resourceType,
			})
			.then((r) => r.data),

	/** Passo 3: confirma o upload junto da Cloudinary. Idempotente. */
	confirm: (publicId: string, owner?: { ownerType?: MediaOwnerType; ownerId?: string }) =>
		api.post<MediaRecord>('/media/confirm', { publicId, ...owner }).then((r) => r.data),

	list: (params: { ownerType?: MediaOwnerType; ownerId?: string }) =>
		api.get<MediaRecord[]>('/media', { params }).then((r) => (r.data ?? []).slice()),

	remove: (publicIds: string[]) =>
		api.delete<{ msg: string }>('/media', { data: { publicIds } }).then((r) => r.data),
}
