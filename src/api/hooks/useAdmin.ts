import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../endpoints/admin'

export function useAdminStats() {
	return useQuery({
		queryKey: ['admin', 'stats'],
		queryFn: () => adminApi.stats(),
	})
}

export function useAdminUsers() {
	return useQuery({
		queryKey: ['admin', 'users'],
		queryFn: () => adminApi.users(),
	})
}

export function useAdminEvents() {
	return useQuery({
		queryKey: ['admin', 'events'],
		queryFn: () => adminApi.events(),
	})
}

export function useAdminOrders() {
	return useQuery({
		queryKey: ['admin', 'orders'],
		queryFn: () => adminApi.orders(),
	})
}

export function useAdminOrganizers() {
	return useQuery({
		queryKey: ['admin', 'organizers'],
		queryFn: () => adminApi.organizers(),
	})
}

export function useAdminFinancial() {
	return useQuery({
		queryKey: ['admin', 'financial'],
		queryFn: () => adminApi.financial(),
	})
}

export function useAdminFleet() {
	return useQuery({
		queryKey: ['admin', 'fleet'],
		queryFn: () => adminApi.fleet(),
	})
}

export function useUpdateEventStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			adminApi.updateEventStatus(id, status),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'events'] })
			qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
		},
	})
}

export function useUpdateUserRole() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, role }: { id: string; role: string }) =>
			adminApi.updateUserRole(id, role),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'users'] })
		},
	})
}
