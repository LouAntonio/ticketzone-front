import { api } from '../client'
import type { Order, OrderDetail, CreateOrderData, OrderItem, AddonItem } from '../../types/order'

interface RawTicket {
	batch: { name: string; price: number }
	event: { id: string; title: string; startDate: string; location: string }
}

interface RawAddon {
	addon: { id: string; name: string; description?: string | null }
	quantity: number
	unitPrice: number
}

interface RawOrder {
	id: string
	userId: string
	totalAmount: string | number
	status: string
	paymentMethod?: string
	paymentStatus?: string
	createdAt: string
	tickets: RawTicket[]
	addons: RawAddon[]
	rentals?: unknown[]
}

function mapOrder(raw: RawOrder): Order {
	const firstEvent = raw.tickets[0]?.event
	return {
		id: raw.id,
		eventId: firstEvent?.id ?? '',
		eventTitle: firstEvent?.title ?? '',
		eventSlug: '',
		eventDate: firstEvent?.startDate ?? '',
		eventImage: '',
		buyerId: '',
		buyerName: '',
		items: raw.tickets.map((t) => ({
			ticketTypeId: '',
			ticketTypeName: t.batch.name,
			quantity: 1,
			unitPrice: Number(t.batch.price),
			peoplePerTicket: 1,
		})),
		addons: raw.addons?.map((a) => ({
			addonId: a.addon.id,
			name: a.addon.name,
			quantity: a.quantity,
			unitPrice: Number(a.unitPrice),
		})),
		totalAmount: Number(raw.totalAmount),
		status: raw.status.toLowerCase(),
		paymentMethod: (raw.paymentMethod?.toLowerCase() ?? '') as Order['paymentMethod'],
		paymentStatus: raw.paymentStatus?.toLowerCase() as Order['paymentStatus'],
		createdAt: raw.createdAt,
		ticketIds: [],
	}
}

export const ordersApi = {
	create: (data: CreateOrderData) =>
		api.post<{ order: Order }>('/orders', data).then((r) => r.data),

	list: () =>
		api.get<{ orders: RawOrder[] }>('/orders').then((r) => ({
			orders: (r.data.orders ?? []).map(mapOrder),
		})),

	get: (id: string) => api.get<OrderDetail>(`/orders/${id}`).then((r) => r.data),

	pay: (id: string) => api.post<never>(`/orders/${id}/pay`).then((r) => r.data),

	cancel: (id: string) => api.post<never>(`/orders/${id}/cancel`).then((r) => r.data),
}

export type { RawOrder, mapOrder }
