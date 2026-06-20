import { api } from '../client'
import type {
	Event,
	EventFormData,
	SalesData,
	EventSalesData,
	AttendeesData,
	StaffMember,
	TicketBatch,
} from '../../types/event'

export const organizerApi = {
	sales: () => api.get<SalesData>('/organizer/sales').then((r) => r.data),

	attendees: (eventId?: string) =>
		api
			.get<AttendeesData>(`/organizer/attendees${eventId ? `?eventId=${eventId}` : ''}`)
			.then((r) => r.data),

	settings: () =>
		api
			.get<{
				id: string
				userId: string
				companyName: string | null
				nif: string | null
				iban: string | null
				promoterType: string
				logo: unknown
				banner: unknown
				isVerified: boolean
				verificationStatus: string
				status: string
				balance: number
				createdAt: string
			}>('/organizer/settings')
			.then((r) => r.data),

	updateSettings: (data: { companyName?: string; iban?: string }) =>
		api.patch('/organizer/settings', data).then((r) => r.data),

	events: () => api.get<{ events: Event[] }>('/organizer/events').then((r) => r.data),

	createEvent: (data: EventFormData) =>
		api.post<{ event: Event }>('/organizer/events', data).then((r) => r.data),

	getEvent: (id: string) =>
		api.get<{ event: Event }>(`/organizer/events/${id}`).then((r) => r.data),

	updateEvent: (id: string, data: Partial<EventFormData>) =>
		api.patch<{ event: Event }>(`/organizer/events/${id}`, data).then((r) => r.data),

	deleteEvent: (id: string) => api.delete(`/organizer/events/${id}`).then((r) => r.data),

	eventSales: (id: string) =>
		api.get<EventSalesData>(`/organizer/events/${id}/sales`).then((r) => r.data),

	listStaff: (eventId: string) =>
		api.get<{ staff: StaffMember[] }>(`/organizer/events/${eventId}/staff`).then((r) => r.data),

	addStaff: (eventId: string, userId: string) =>
		api.post(`/organizer/events/${eventId}/staff`, { userId }).then((r) => r.data),

	removeStaff: (eventId: string, userId: string) =>
		api.delete(`/organizer/events/${eventId}/staff/${userId}`).then((r) => r.data),

	lookupUser: (userId: string) =>
		api
			.get<{
				id: string
				name: string | null
				email: string
				image: string | null
			}>(`/organizer/user-lookup/${userId}`)
			.then((r) => r.data),

	pauseSales: (eventId: string) =>
		api.post(`/organizer/events/${eventId}/pause-sales`).then((r) => r.data),

	listBatches: (eventId: string) =>
		api
			.get<{ batches: TicketBatch[] }>(`/organizer/events/${eventId}/batches`)
			.then((r) => r.data),

	createBatch: (
		eventId: string,
		data: {
			name: string
			price: number
			capacity: number
			isGroupTicket?: boolean
			groupSize?: number
		},
	) => api.post(`/organizer/events/${eventId}/batches`, data).then((r) => r.data),

	updateBatch: (
		eventId: string,
		batchId: string,
		data: {
			name?: string
			price?: number
			capacity?: number
			isGroupTicket?: boolean
			groupSize?: number
		},
	) => api.patch(`/organizer/events/${eventId}/batches/${batchId}`, data).then((r) => r.data),

	removeBatch: (eventId: string, batchId: string) =>
		api.delete(`/organizer/events/${eventId}/batches/${batchId}`).then((r) => r.data),

	startEvent: (eventId: string) =>
		api
			.post<{ msg: string; startedAt: string }>(`/organizer/events/${eventId}/start`)
			.then((r) => r.data),
}
