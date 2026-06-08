import axios from 'axios'
import { API_BASE_URL } from '../lib/env'
import { useAuthStore } from '../stores/useAuthStore'
import { navigate } from '../lib/navigate'
import type { User } from '../types/auth'

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	timeout: 15000,
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(response) => {
		const body = response.data as { success?: boolean; data?: unknown }
		if (body && typeof body === 'object' && body.success === true && 'data' in body) {
			response.data = body.data
		}
		return response
	},
	async (error) => {
		const originalRequest = error.config
		const status = error.response?.status

		if (status === 401 && originalRequest?.url?.includes('/auth/login')) {
			// Login failures — pass through for form to handle
			const body = error.response?.data as { success?: boolean; msg?: string } | undefined
			if (body?.msg) error.message = body.msg
			return Promise.reject(error)
		}

		if (status === 401) {
			const refreshToken = useAuthStore.getState().refreshToken

			if (
				refreshToken &&
				!originalRequest?.url?.includes('/auth/refresh')
			) {
				try {
					const response = await api.post<{
						accessToken: string
						refreshToken?: string
						user?: User
					}>('/auth/refresh', { refreshToken })
					const data = response.data
					useAuthStore.getState().setAccessToken(data.accessToken)
					if (data.refreshToken && data.user) {
						useAuthStore
							.getState()
							.setSession(data.accessToken, data.refreshToken, data.user)
					}
					originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
					return api(originalRequest)
				} catch {
					// Refresh failed — clear session and redirect
				}
			}

			useAuthStore.getState().clear()
			navigate('/login', { replace: true })
		}

		const body = error.response?.data as { success?: boolean; msg?: string } | undefined
		if (body?.msg) {
			error.message = body.msg
		}

		return Promise.reject(error)
	},
)
