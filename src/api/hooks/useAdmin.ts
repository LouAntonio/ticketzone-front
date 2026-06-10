import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { adminApi } from '../endpoints/admin'

// ==================== Stats ====================

export function useAdminStats() {
	return useQuery({
		queryKey: ['admin', 'stats'],
		queryFn: () => adminApi.stats(),
		refetchInterval: 30_000,
	})
}

// ==================== Users ====================

export function useAdminUsers(params?: {
	page?: number
	limit?: number
	search?: string
	role?: string
	status?: string
}) {
	return useQuery({
		queryKey: ['admin', 'users', params],
		queryFn: () => adminApi.listUsers(params),
	})
}

export function useUpdateUserRole() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, role }: { id: string; role: string }) =>
			adminApi.updateUserRole(id, role),
		onSuccess: () => {
			toast.success('Função do utilizador atualizada')
			qc.invalidateQueries({ queryKey: ['admin', 'users'] })
		},
		onError: () => toast.error('Erro ao atualizar função'),
	})
}

export function useBanUser() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			motive,
			bannedUntil,
		}: {
			id: string
			motive: string
			bannedUntil?: string
		}) => adminApi.banUser(id, motive, bannedUntil),
		onSuccess: () => {
			toast.success('Utilizador banido com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'users'] })
		},
		onError: () => toast.error('Erro ao banir utilizador'),
	})
}

export function useAdminUserDetail(id: string | null) {
	return useQuery({
		queryKey: ['admin', 'users', 'detail', id],
		queryFn: () => adminApi.getUser(id!),
		enabled: !!id,
	})
}

export function useUnbanUser() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.unbanUser(id),
		onSuccess: () => {
			toast.success('Utilizador desbanido com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'users'] })
		},
		onError: () => toast.error('Erro ao desbanir utilizador'),
	})
}

// ==================== Events ====================

export function useAdminEvents(params?: {
	page?: number
	limit?: number
	search?: string
	categoryId?: string
	province?: string
}) {
	return useQuery({
		queryKey: ['admin', 'events', params],
		queryFn: () => adminApi.listEvents(params),
	})
}

export function useAdminPendingEvents(params?: { page?: number; limit?: number }) {
	return useQuery({
		queryKey: ['admin', 'events', 'pending', params],
		queryFn: () => adminApi.listPendingEvents(params),
		refetchInterval: 15_000,
	})
}

export function useApproveEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.approveEvent(id),
		onSuccess: () => {
			toast.success('Evento aprovado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'events'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao aprovar evento'),
	})
}

export function useRejectEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, motive }: { id: string; motive: string }) =>
			adminApi.rejectEvent(id, motive),
		onSuccess: () => {
			toast.success('Evento rejeitado')
			qc.invalidateQueries({ queryKey: ['admin', 'events'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao rejeitar evento'),
	})
}

export function useCancelEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.cancelEvent(id),
		onSuccess: () => {
			toast.success('Evento cancelado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'events'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao cancelar evento'),
	})
}

export function useAdminEventDetail(id: string | null) {
	return useQuery({
		queryKey: ['admin', 'events', 'detail', id],
		queryFn: () => adminApi.getEvent(id!),
		enabled: !!id,
	})
}

// ==================== Promoters ====================

export function useAdminPromoters(params?: {
	page?: number
	limit?: number
	search?: string
	status?: string
	verificationStatus?: string
}) {
	return useQuery({
		queryKey: ['admin', 'promoters', params],
		queryFn: () => adminApi.listPromoters(params),
	})
}

export function useVerificationRequests(params?: { page?: number; limit?: number }) {
	return useQuery({
		queryKey: ['admin', 'promoters', 'verification-requests', params],
		queryFn: () => adminApi.verificationRequests(params),
		refetchInterval: 15_000,
	})
}

export function useApprovePromoter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.approvePromoter(id),
		onSuccess: () => {
			toast.success('Promotor verificado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'promoters'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao verificar promotor'),
	})
}

export function useRejectPromoter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, motive }: { id: string; motive: string }) =>
			adminApi.rejectPromoter(id, motive),
		onSuccess: () => {
			toast.success('Pedido de promotor rejeitado')
			qc.invalidateQueries({ queryKey: ['admin', 'promoters'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao rejeitar promotor'),
	})
}

export function useBanPromoter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			motive,
			bannedUntil,
		}: {
			id: string
			motive: string
			bannedUntil?: string
		}) => adminApi.banPromoter(id, motive, bannedUntil),
		onSuccess: () => {
			toast.success('Promotor banido com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'promoters'] })
		},
		onError: () => toast.error('Erro ao banir promotor'),
	})
}

export function useUnbanPromoter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.unbanPromoter(id),
		onSuccess: () => {
			toast.success('Promotor desbanido com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'promoters'] })
		},
		onError: () => toast.error('Erro ao desbanir promotor'),
	})
}

export function useAdminPromoterDetail(id: string | null) {
	return useQuery({
		queryKey: ['admin', 'promoters', 'detail', id],
		queryFn: () => adminApi.getPromoter(id!),
		enabled: !!id,
	})
}

// ==================== Orders ====================

export function useAdminOrders(params?: {
	page?: number
	limit?: number
	search?: string
	status?: string
}) {
	return useQuery({
		queryKey: ['admin', 'orders', params],
		queryFn: () => adminApi.listOrders(params),
	})
}

export function useRefundOrder() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.refundOrder(id),
		onSuccess: () => {
			toast.success('Pedido reembolsado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
		onError: () => toast.error('Erro ao reembolsar pedido'),
	})
}

export function useAdminOrderDetail(id: string | null) {
	return useQuery({
		queryKey: ['admin', 'orders', 'detail', id],
		queryFn: () => adminApi.getOrder(id!),
		enabled: !!id,
	})
}

// ==================== Financial ====================

export function useAdminFinancial() {
	return useQuery({
		queryKey: ['admin', 'financial'],
		queryFn: () => adminApi.getFinancial(),
	})
}

// ==================== Fleet ====================

export function useAdminFleet(params?: {
	page?: number
	limit?: number
	search?: string
	status?: string
}) {
	return useQuery({
		queryKey: ['admin', 'fleet', params],
		queryFn: () => adminApi.listFleet(params),
	})
}

export function useCreateVehicle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: {
			make: string
			model: string
			plate: string
			year?: number
			price: number
		}) => adminApi.createVehicle(data),
		onSuccess: () => {
			toast.success('Veículo criado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'fleet'] })
		},
		onError: () => toast.error('Erro ao criar veículo'),
	})
}

export function useUpdateVehicle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
			adminApi.updateVehicle(id, data),
		onSuccess: () => {
			toast.success('Veículo atualizado com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'fleet'] })
		},
		onError: () => toast.error('Erro ao atualizar veículo'),
	})
}

export function useDeleteVehicle() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApi.deleteVehicle(id),
		onSuccess: () => {
			toast.success('Veículo removido com sucesso')
			qc.invalidateQueries({ queryKey: ['admin', 'fleet'] })
		},
		onError: () => toast.error('Erro ao remover veículo'),
	})
}

export function useUpdateVehicleStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			adminApi.updateVehicleStatus(id, status),
		onSuccess: () => {
			toast.success('Estado do veículo atualizado')
			qc.invalidateQueries({ queryKey: ['admin', 'fleet'] })
		},
		onError: () => toast.error('Erro ao atualizar estado'),
	})
}

export function useAdminVehicleDetail(id: string | null) {
	return useQuery({
		queryKey: ['admin', 'fleet', 'detail', id],
		queryFn: () => adminApi.getVehicle(id!),
		enabled: !!id,
	})
}

// ==================== Audit Logs ====================

export function useAdminAuditLogs(params?: {
	page?: number
	limit?: number
	action?: string
	entity?: string
}) {
	return useQuery({
		queryKey: ['admin', 'audit-logs', params],
		queryFn: () => adminApi.getAuditLogs(params),
	})
}
