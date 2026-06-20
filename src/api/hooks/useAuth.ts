import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../endpoints/auth'
import { useAuthStore } from '../../stores/useAuthStore'
import { api } from '../client'
import type { LoginCredentials, RegisterData } from '../../types/auth'

export function useLogin() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (data: LoginCredentials) => authApi.login(data),
		onSuccess: (data) => {
			setSession(data.accessToken, data.refreshToken, data.user)
			navigate(data.user.role === 'ADMIN' ? '/admin' : '/')
		},
	})
}

export function useRegister() {
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (data: RegisterData) => authApi.register(data),
		onSuccess: () => {
			navigate('/login', {
				state: { registered: true },
			})
		},
	})
}

export function useGoogleLogin() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (idToken: string) => authApi.googleLogin(idToken),
		onSuccess: (data) => {
			setSession(data.accessToken, data.refreshToken, data.user)
			navigate(data.user.role === 'ADMIN' ? '/admin' : '/')
		},
	})
}

export function useLogout() {
	const clear = useAuthStore((s) => s.clear)
	const refreshToken = useAuthStore((s) => s.refreshToken)

	return useMutation({
		mutationFn: () => authApi.logout({ refreshToken: refreshToken ?? '' }),
		onSettled: () => {
			clear()
		},
	})
}

export function useValidatorEvents() {
	return useQuery({
		queryKey: ['auth', 'validator-events'],
		queryFn: () => api.get('/auth/me/validator-events').then((r) => r.data),
		staleTime: 5 * 60 * 1000,
	})
}

export function useRefreshToken() {
	const setAccessToken = useAuthStore((s) => s.setAccessToken)
	const currentRefreshToken = useAuthStore((s) => s.refreshToken)

	return useMutation({
		mutationFn: () => authApi.refresh({ refreshToken: currentRefreshToken ?? '' }),
		onSuccess: (data) => {
			setAccessToken(data.accessToken)
			if (data.refreshToken) {
				useAuthStore.getState().setSession(data.accessToken, data.refreshToken, data.user)
			}
		},
	})
}
