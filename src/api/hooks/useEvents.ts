import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../endpoints/events'
import type { EventFilters, EventFormData } from '../../types/event'

export function useFeaturedEvents() {
	return useQuery({
		queryKey: ['events', 'featured'],
		queryFn: eventsApi.featured,
	})
}

export function useEvents(filters?: EventFilters) {
	return useQuery({
		queryKey: ['events', filters],
		queryFn: () => eventsApi.list(filters),
	})
}

export function useEvent(slug: string) {
	return useQuery({
		queryKey: ['events', slug],
		queryFn: () => eventsApi.get(slug),
		enabled: !!slug,
	})
}

export function useMyEvents() {
	return useQuery({
		queryKey: ['events', 'my'],
		queryFn: eventsApi.myEvents,
	})
}

export function useCreateEvent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: EventFormData) => eventsApi.create(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['events', 'my'] })
		},
	})
}

export function useUpdateEvent(id: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: Record<string, unknown>) =>
			eventsApi.update(id, data as Parameters<typeof eventsApi.update>[1]),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['events'] })
		},
	})
}

export function useEventSales(id: string) {
	return useQuery({
		queryKey: ['events', id, 'sales'],
		queryFn: () => eventsApi.sales(id),
		enabled: !!id,
	})
}
