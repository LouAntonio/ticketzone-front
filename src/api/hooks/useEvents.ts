import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../endpoints/events'
import type { EventFilters } from '../../types/event'

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
