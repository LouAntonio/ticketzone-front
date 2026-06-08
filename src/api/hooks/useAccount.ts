import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../client'
import { authApi } from '../endpoints/auth'
import { ordersApi } from '../endpoints/orders'

import { useAuthStore } from '../../stores/useAuthStore'
import type { LinkGoogleData, LinkPasswordData, BecomePromoterData } from '../../types/auth'
import { toast } from 'react-hot-toast'

export function useLinkGoogle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: LinkGoogleData) => authApi.linkGoogle(data),
		onSuccess: () => {
			toast.success('Conta Google vinculada com sucesso')
			qc.invalidateQueries({ queryKey: ['auth', 'me'] })
		},
	})
}

export function useLinkPassword() {
	return useMutation({
		mutationFn: (data: LinkPasswordData) => authApi.linkPassword(data),
		onSuccess: () => {
			toast.success('Palavra-passe definida com sucesso')
		},
	})
}

export function useBecomePromoter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: BecomePromoterData) => authApi.becomePromoter(data),
		onSuccess: () => {
			toast.success('Pedido de promotor enviado com sucesso')
			qc.invalidateQueries({ queryKey: ['auth', 'me'] })
		},
	})
}

export function useVerifyEmail() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (token: string) => authApi.verifyEmail({ token }),
		onSuccess: () => {
			toast.success('Email verificado com sucesso')
			qc.invalidateQueries({ queryKey: ['auth', 'me'] })
			const user = useAuthStore.getState().user
			if (user) {
				useAuthStore.getState().setUser({ ...user, emailVerified: true })
			}
		},
	})
}

export function useResendVerification() {
	return useMutation({
		mutationFn: (email: string) => authApi.resendVerification({ email }),
		onSuccess: () => {
			toast.success('Email de verificação reenviado')
		},
	})
}

export function useUserProfile() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: { name?: string; phoneNumber?: string }) =>
			api.patch('/users/profile', data).then((r) => r.data),
		onSuccess: () => {
			toast.success('Perfil atualizado com sucesso')
			qc.invalidateQueries({ queryKey: ['auth', 'me'] })
		},
	})
}

export function useOrder(id: string) {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => ordersApi.get(id),
		enabled: !!id,
	})
}

export function usePayOrder() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => ordersApi.pay(id),
		onSuccess: () => {
			toast.success('Pagamento confirmado com sucesso')
			qc.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}

export function useCancelOrder() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => ordersApi.cancel(id),
		onSuccess: () => {
			toast.success('Encomenda cancelada com sucesso')
			qc.invalidateQueries({ queryKey: ['orders'] })
		},
	})
}
