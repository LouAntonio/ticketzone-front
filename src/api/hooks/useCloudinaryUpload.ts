import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { mediaApi, type MediaOwnerType, type UploadOptions } from '../endpoints/media'
import type { DocFile } from '../../types/auth'

interface UploadState {
	uploading: boolean
	progress: number
	error: string | null
}

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024

/**
 * Erros legíveis da Cloudinary.
 *
 * O corpo do erro é onde está a informação útil ("File size too large",
 * "Unsupported file type") — descartar tudo e mostrar "Upload falhou" deixa
 * o utilizador sem saber o que fazer.
 */
function describeCloudinaryError(status: number, body: string): string {
	if (status === 401) return 'Credenciais de upload inválidas. Tenta novamente.'
	if (status === 413 || /too large/i.test(body)) {
		return 'O ficheiro é demasiado grande. Escolhe um ficheiro menor.'
	}
	if (status === 415 || /unsupported|format/i.test(body)) {
		return 'Formato de ficheiro não suportado.'
	}

	try {
		const parsed = JSON.parse(body) as { error?: { message?: string } }
		if (parsed?.error?.message) return parsed.error.message
	} catch {
		// corpo não-JSON — cai para a mensagem genérica
	}

	return 'Não foi possível carregar o ficheiro. Tenta novamente.'
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function useCloudinaryUpload() {
	const [state, setState] = useState<UploadState>({ uploading: false, progress: 0, error: null })

	/**
	 * Upload directo para a Cloudinary em três passos:
	 *   1. `POST /media/signature` — o backend cria o registo PENDING e assina
	 *   2. `POST` do ficheiro para a Cloudinary (os bytes não passam pela API)
	 *   3. `POST /media/confirm` — o backend interroga a Cloudinary e persiste
	 *
	 * A transformação e os formatos permitidos entram na assinatura, por isso o
	 * cliente não os pode substituir.
	 */
	const upload = async (file: File, options: UploadOptions = {}): Promise<DocFile> => {
		const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES

		// Validação de tamanho que não existia em lado nenhum — o "Máx 5MB"
		// que aparecia na UI era só texto, sem código por trás.
		if (file.size > maxBytes) {
			const message = `O ficheiro tem ${formatBytes(file.size)} e o limite é ${formatBytes(maxBytes)}.`
			setState({ uploading: false, progress: 0, error: message })
			toast.error(message)
			throw new Error(message)
		}

		setState({ uploading: true, progress: 0, error: null })

		try {
			const signature = await mediaApi.signature(options)

			// A transformação e o eager são assinados: o Cloudinary rejeita o
			// pedido se não vierem exactamente como na assinatura.
			const formData = new FormData()
			formData.append('file', file)
			formData.append('api_key', signature.apiKey)
			formData.append('timestamp', String(signature.timestamp))
			formData.append('signature', signature.signature)
			formData.append('public_id', signature.publicId)
			formData.append('transformation', signature.transformation)
			formData.append('eager', signature.eager)

			const result = await new Promise<{ secure_url: string; public_id: string }>(
				(resolve, reject) => {
					const xhr = new XMLHttpRequest()

					xhr.upload.onprogress = (e) => {
						if (e.lengthComputable) {
							setState((s) => ({
								...s,
								progress: Math.round((e.loaded / e.total) * 100),
							}))
						}
					}
					xhr.onload = () => {
						if (xhr.status >= 200 && xhr.status < 300) {
							resolve(JSON.parse(xhr.responseText))
						} else {
							reject(new Error(describeCloudinaryError(xhr.status, xhr.responseText)))
						}
					}
					xhr.onerror = () => reject(new Error('Erro de rede no upload'))
					// `signature.uploadUrl` já traz o resourceType correcto
					// (image vs raw para documentos).
					xhr.open('POST', signature.uploadUrl)
					xhr.send(formData)
				},
			)

			// Passo 3 — persiste os metadados reais do ficheiro.
			await mediaApi.confirm(result.public_id, {
				ownerType: options.ownerType,
				ownerId: options.ownerId,
			})

			setState({ uploading: false, progress: 100, error: null })
			return { url: result.secure_url, idcloudinary: result.public_id }
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Erro ao fazer upload'
			setState({ uploading: false, progress: 0, error: message })
			toast.error(message)
			throw err
		}
	}

	const reset = () => setState({ uploading: false, progress: 0, error: null })

	return { upload, ...state, reset }
}

/** Reexportado para os call sites importarem o tipo sem ir ao endpoint. */
export type { MediaOwnerType }
