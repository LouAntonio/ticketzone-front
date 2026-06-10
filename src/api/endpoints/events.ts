import { api } from '../client'
import type { Event, EventFilters, EventFormData } from '../../types/event'

export const eventsApi = {
	list: (filters?: EventFilters) =>
		api
			.get<{ events: Event[]; total: number }>('/events', {
				params: filters,
			})
			.then((r) => r.data),

	featured: () => api.get<{ events: Event[] }>('/events/featured').then((r) => r.data),

	get: (slug: string) => api.get<{ event: Event }>(`/events/${slug}`).then((r) => r.data),

	// Organizer endpoints
	myEvents: () => api.get<{ events: Event[] }>('/organizer/events').then((r) => r.data),

	create: (data: EventFormData) =>
		api.post<{ event: Event }>('/organizer/events', data).then((r) => r.data),

	update: (id: string, data: Partial<Event>) =>
		api.put<{ event: Event }>(`/organizer/events/${id}`, data).then((r) => r.data),

	sales: (id: string) =>
		api
			.get<{
				totalSold: number
				totalTickets: number
				ordersCount: number
				orders: Record<string, unknown>[]
			}>(`/organizer/events/${id}/sales`)
			.then((r) => r.data),
}
