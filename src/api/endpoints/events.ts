import { api } from '../client'
import { mapEvent } from '../../lib/mappers'
import type { RawEvent } from '../../lib/mappers'
import type { EventFilters } from '../../types/event'

export const eventsApi = {
	list: (filters?: EventFilters) =>
		api
			.get<{ events: RawEvent[]; total: number; totalPages: number }>('/events', {
				params: filters,
			})
			.then((r) => ({
				events: (r.data.events ?? []).map(mapEvent),
				total: r.data.total ?? 0,
				totalPages: r.data.totalPages ?? 1,
			})),

	featured: () =>
		api
			.get<{ events: RawEvent[] }>('/events/featured')
			.then((r) => ({ events: (r.data.events ?? []).map(mapEvent) })),

	get: (slug: string) => api.get<RawEvent>(`/events/slug/${slug}`).then((r) => mapEvent(r.data)),
}
