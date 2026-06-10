import { api } from '../client'
import type { Addon } from '../../types/event'

export interface CreateAddonData {
	name: string
	description?: string
	price: number
	capacity: number
}

export interface UpdateAddonData {
	name?: string
	description?: string
	price?: number
	capacity?: number
}

export const addonsApi = {
	list: (eventId: string) =>
		api.get<{ addons: Addon[] }>(`/events/${eventId}/addons`).then((r) => r.data),

	create: (eventId: string, data: CreateAddonData) =>
		api
			.post<{ msg: string; data: Addon }>(`/events/${eventId}/addons`, data)
			.then((r) => r.data),

	update: (eventId: string, addonId: string, data: UpdateAddonData) =>
		api
			.patch<{ msg: string; data: Addon }>(`/events/${eventId}/addons/${addonId}`, data)
			.then((r) => r.data),

	remove: (eventId: string, addonId: string) =>
		api.delete<{ msg: string }>(`/events/${eventId}/addons/${addonId}`).then((r) => r.data),
}
