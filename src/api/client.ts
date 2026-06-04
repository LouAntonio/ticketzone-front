import axios from 'axios'
import { API_BASE_URL } from '../lib/env'
import { useAuthStore } from '../stores/useAuthStore'

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
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().clear()
			window.location.href = '/login'
		}
		return Promise.reject(error)
	},
)
