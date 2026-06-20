import { api } from '../client'
import type { Order, OrderDetail, CreateOrderData } from '../../types/order'

interface RawTicket {
	id: string
	qrSecret: string
	entriesUsed: number
	entriesAllowed: number
	status: string
	batch: { name: string; price: number }
	event: {
		id: string
		title: string
		startDate: string
		endDate: string
		location: string
		province: string
		bannerUrl: string | null
	}
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
	multicaixaReference?: string | null
	paypayReference?: string | null
	createdAt: string
	tickets: RawTicket[]
	addons: RawAddon[]
	rentals?: unknown[]
	user?: { id: string; name: string | null; email: string; phoneNumber?: string | null }
}

interface RawOrderDetail extends RawOrder {
	rentals: Array<{
		id: string
		startDate: string | null
		endDate: string | null
		totalDays: number
		totalPrice: number
		vehicle: {
			id: string
			make: string
			model: string
			plate: string
			photos: string[]
			price: number
		} | null
		event?: { id: string; title: string }
	}>
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

function mapOrderDetail(raw: RawOrderDetail): OrderDetail {
	const firstTicket = raw.tickets[0]
	const ev = firstTicket?.event
	return {
		id: raw.id,
		eventId: ev?.id ?? '',
		eventTitle: ev?.title ?? '',
		eventSlug: '',
		eventDate: ev?.startDate ?? '',
		eventImage: ev?.bannerUrl ?? '',
		buyerId: raw.userId,
		buyerName: raw.user?.name ?? '',
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
		paymentRef: raw.multicaixaReference ?? raw.paypayReference ?? undefined,
		createdAt: raw.createdAt,
		ticketIds: raw.tickets.map((t) => t.id),
		tickets: raw.tickets.map((t) => ({
			id: t.id,
			qrCode: t.qrSecret,
			status: t.status.toLowerCase(),
			ticketTypeName: t.batch.name,
			entriesUsed: t.entriesUsed,
			entriesAllowed: t.entriesAllowed,
		})),
		rentals: raw.rentals?.map((r) => ({
			id: r.id,
			vehicleId: r.vehicle?.id ?? '',
			startDate: r.startDate ?? undefined,
			endDate: r.endDate ?? undefined,
			totalDays: r.totalDays,
			totalPrice: r.totalPrice,
			vehicle: r.vehicle
				? {
						make: r.vehicle.make,
						model: r.vehicle.model,
						plate: r.vehicle.plate,
						photos: r.vehicle.photos,
					}
				: { make: '', model: '', plate: '', photos: [] },
		})),
		eventProvince: ev?.province ?? undefined,
		eventVenue: ev?.location ?? undefined,
		eventStartDate: ev?.startDate ?? undefined,
		eventEndDate: ev?.endDate ?? undefined,
		userPhoneNumber: raw.user?.phoneNumber ?? undefined,
		userEmail: raw.user?.email ?? undefined,
	}
}

export const ordersApi = {
	create: (data: CreateOrderData) =>
		api.post<{ order: Order }>('/orders', data).then((r) => r.data),

	list: () =>
		api.get<{ orders: RawOrder[] }>('/orders').then((r) => ({
			orders: (r.data.orders ?? []).map(mapOrder),
		})),

	get: (id: string) =>
		api.get<RawOrderDetail>(`/orders/${id}`).then((r) => mapOrderDetail(r.data)),

	pay: (id: string) => api.post<never>(`/orders/${id}/pay`).then((r) => r.data),

	cancel: (id: string) => api.post<never>(`/orders/${id}/cancel`).then((r) => r.data),
}
