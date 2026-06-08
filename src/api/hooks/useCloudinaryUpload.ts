import { useState } from 'react'
import { uploadsApi } from '../endpoints/uploads'
import type { DocFile } from '../../types/auth'

interface UploadState {
	uploading: boolean
	progress: number
	error: string | null
}

function simulateUpload(file: File, folder: string): Promise<DocFile> {
	return new Promise((resolve) => {
		let progress = 0
		const interval = setInterval(() => {
			progress += Math.random() * 30
			if (progress >= 100) {
				progress = 100
				clearInterval(interval)
				const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
				const publicId = `${folder}/${Date.now()}_${safeName}`
				resolve({
					url: `https://res.cloudinary.com/df9svkaon/image/upload/${publicId}`,
					idcloudinary: publicId,
				})
			}
		}, 200)
	})
}

export function useCloudinaryUpload() {
	const [state, setState] = useState<UploadState>({ uploading: false, progress: 0, error: null })

	const upload = async (file: File, folder?: string): Promise<DocFile> => {
		setState({ uploading: true, progress: 0, error: null })

		try {
			const sig = await uploadsApi.signature(folder)
			const upFolder = sig.folder

			if (sig.signature.startsWith('mock-')) {
				setState((s) => ({ ...s, uploading: true }))
				const result = await simulateUpload(file, upFolder)
				setState({ uploading: false, progress: 100, error: null })
				return result
			}

			const formData = new FormData()
			formData.append('file', file)
			formData.append('timestamp', String(sig.timestamp))
			formData.append('signature', sig.signature)
			formData.append('api_key', sig.apiKey)
			formData.append('folder', upFolder)

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
							reject(new Error('Upload falhou'))
						}
					}
					xhr.onerror = () => reject(new Error('Erro de rede no upload'))
					xhr.open(
						'POST',
						`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
					)
					xhr.send(formData)
				},
			)

			setState({ uploading: false, progress: 100, error: null })
			return { url: result.secure_url, idcloudinary: result.public_id }
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Erro ao fazer upload'
			setState({ uploading: false, progress: 0, error: message })
			throw err
		}
	}

	const reset = () => setState({ uploading: false, progress: 0, error: null })

	return { upload, ...state, reset }
}
