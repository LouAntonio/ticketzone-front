import { api } from '../client'
import type { Event, EventFilters } from '../../types/event'

export const eventsApi = {
	list: (filters?: EventFilters) =>
		api
			.get<{ events: Event[]; total: number }>('/events', {
				params: filters,
			})
			.then((r) => r.data),

	featured: () => api.get<{ events: Event[] }>('/events/featured').then((r) => r.data),

	get: (slug: string) => api.get<{ event?: Event }>(`/events/${slug}`).then((r) => r.data),
}
