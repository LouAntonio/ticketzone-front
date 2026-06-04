import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../endpoints/auth'
import { useAuthStore } from '../../stores/useAuthStore'
import type { LoginCredentials, RegisterData } from '../../types/auth'

export function useLogin() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (data: LoginCredentials) => authApi.login(data),
		onSuccess: (res) => {
			setSession(res.token, res.user, res.organizerProfile)
			navigate('/')
		},
	})
}

export function useRegister() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (data: RegisterData) => authApi.register(data),
		onSuccess: (res) => {
			setSession(res.token, res.user, res.organizerProfile)
			navigate('/')
		},
	})
}

export function useGoogleLogin() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (credential: string) => authApi.googleLogin(credential),
		onSuccess: (res) => {
			setSession(res.token, res.user, res.organizerProfile)
			navigate('/')
		},
	})
}
