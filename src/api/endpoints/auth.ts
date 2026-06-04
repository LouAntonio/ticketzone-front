import { api } from '../client'
import type { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth'

export const authApi = {
	login: (data: LoginCredentials) =>
		api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

	register: (data: RegisterData) =>
		api.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),

	googleLogin: (credential: string) =>
		api.post<AuthResponse>('/api/auth/google', { credential }).then((r) => r.data),

	me: () =>
		api
			.get<{
				user: AuthResponse['user']
				organizerProfile?: AuthResponse['organizerProfile']
			}>('/api/auth/me')
			.then((r) => r.data),
}
