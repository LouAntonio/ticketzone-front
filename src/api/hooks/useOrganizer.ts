import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { organizerApi } from '../endpoints/organizer'
import type { EventFormData } from '../../types/event'
import { toast } from 'react-hot-toast'

export function useOrganizerSales() {
	return useQuery({
		queryKey: ['organizer', 'sales'],
		queryFn: organizerApi.sales,
	})
}

export function useOrganizerAttendees(eventId?: string) {
	return useQuery({
		queryKey: ['organizer', 'attendees', eventId],
		queryFn: () => organizerApi.attendees(eventId),
	})
}

export function useOrganizerSettings() {
	return useQuery({
		queryKey: ['organizer', 'settings'],
		queryFn: organizerApi.settings,
	})
}

export function useUpdateOrganizerSettings() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: Parameters<typeof organizerApi.updateSettings>[0]) =>
			organizerApi.updateSettings(data),
		onSuccess: () => {
			toast.success('Definições guardadas com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'settings'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao guardar definições')
		},
	})
}

export function useOrganizerEvents() {
	return useQuery({
		queryKey: ['organizer', 'events'],
		queryFn: organizerApi.events,
	})
}

export function useOrganizerEvent(id: string) {
	return useQuery({
		queryKey: ['organizer', 'events', id],
		queryFn: () => organizerApi.getEvent(id),
		enabled: !!id,
	})
}

export function useCreateOrganizerEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: EventFormData) => organizerApi.createEvent(data),
		onSuccess: () => {
			toast.success('Evento criado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao criar evento')
		},
	})
}

export function useUpdateOrganizerEvent(id: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: Partial<EventFormData>) => organizerApi.updateEvent(id, data),
		onSuccess: () => {
			toast.success('Evento atualizado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events', id] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao atualizar evento')
		},
	})
}

export function useDeleteOrganizerEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => organizerApi.deleteEvent(id),
		onSuccess: () => {
			toast.success('Evento eliminado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao eliminar evento')
		},
	})
}

export function useOrganizerEventSales(id: string) {
	return useQuery({
		queryKey: ['organizer', 'events', id, 'sales'],
		queryFn: () => organizerApi.eventSales(id),
		enabled: !!id,
	})
}

export function useOrganizerEventStaff(eventId: string) {
	return useQuery({
		queryKey: ['organizer', 'events', eventId, 'staff'],
		queryFn: () => organizerApi.listStaff(eventId),
		enabled: !!eventId,
	})
}

export function useAddOrganizerStaff(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (userId: string) => organizerApi.addStaff(eventId, userId),
		onSuccess: () => {
			toast.success('Validador adicionado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId, 'staff'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao adicionar validador')
		},
	})
}

export function useRemoveOrganizerStaff(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (userId: string) => organizerApi.removeStaff(eventId, userId),
		onSuccess: () => {
			toast.success('Validador removido com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId, 'staff'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao remover validador')
		},
	})
}

export function useLookupUser(userId: string) {
	return useQuery({
		queryKey: ['organizer', 'user-lookup', userId],
		queryFn: () => organizerApi.lookupUser(userId),
		enabled: !!userId && userId.length >= 8,
		retry: false,
		staleTime: 1000 * 60 * 5,
	})
}

export function usePauseSales() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (eventId: string) => organizerApi.pauseSales(eventId),
		onSuccess: () => {
			toast.success('Vendas pausadas/retomadas com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao pausar vendas')
		},
	})
}

export function useOrganizerEventBatches(eventId: string) {
	return useQuery({
		queryKey: ['organizer', 'events', eventId, 'batches'],
		queryFn: () => organizerApi.listBatches(eventId),
		enabled: !!eventId,
	})
}

export function useCreateBatch(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: {
			name: string
			price: number
			capacity: number
			isGroupTicket?: boolean
			groupSize?: number
		}) => organizerApi.createBatch(eventId, data),
		onSuccess: () => {
			toast.success('Lote adicionado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId, 'batches'] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao adicionar lote')
		},
	})
}

export function useUpdateBatch(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			batchId,
			...data
		}: {
			batchId: string
			name?: string
			price?: number
			capacity?: number
			isGroupTicket?: boolean
			groupSize?: number
		}) => organizerApi.updateBatch(eventId, batchId, data),
		onSuccess: () => {
			toast.success('Lote atualizado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId, 'batches'] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao atualizar lote')
		},
	})
}

export function useStartEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (eventId: string) => organizerApi.startEvent(eventId),
		onSuccess: () => {
			toast.success('Evento iniciado com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao iniciar evento')
		},
	})
}

export function useRemoveBatch(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (batchId: string) => organizerApi.removeBatch(eventId, batchId),
		onSuccess: () => {
			toast.success('Lote removido com sucesso')
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId, 'batches'] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events', eventId] })
			qc.invalidateQueries({ queryKey: ['organizer', 'events'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao remover lote')
		},
	})
}
