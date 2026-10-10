import { api } from '../client'
import type { CreateOrderData, Order, OrderDetail, PaymentInstructions } from '../../types/order'

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

/** Reserva de bilhetes guardada no backend (ainda sem bilhetes emitidos). */
interface RawOrderItem {
	id: string
	batchId: string
	eventId: string
	name: string
	quantity: number
	unitPrice: number | string
	isGroupTicket?: boolean
	groupSize?: number
}

interface RawAddon {
	addon: { id: string; name: string; description?: string | null }
	quantity: number
	unitPrice: number | string
}

interface RawOrder {
	id: string
	userId: string
	eventId?: string | null
	totalAmount: string | number
	status: string
	paymentMethod?: string | null
	paymentStatus?: string | null
	multicaixaReference?: string | null
	multicaixaEntity?: string | null
	paymentDueDate?: string | null
	createdAt: string
	items?: RawOrderItem[]
	tickets: RawTicket[]
	addons: RawAddon[]
	rentals?: unknown[]
	user?: { id: string; name: string | null; email: string; phoneNumber?: string | null }
}

interface RawAddonInstance {
	id: string
	addonId: string
	status: string
	qrSecret: string
	qrExpiresAt: string
	entriesUsed: number
	entriesAllowed: number
	addon: { name: string }
}

interface RawOrderDetail extends RawOrder {
	addonInstances: RawAddonInstance[]
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

function mapPaymentMethod(raw: string | null | undefined): Order['paymentMethod'] {
	const value = raw?.toUpperCase()
	if (value === 'MULTICAIXA_REFERENCE') return 'reference'
	return 'multicaixa'
}

/**
 * Itens da encomenda.
 *
 * Enquanto o pagamento não está confirmado ainda não existem `Ticket` — a
 * reserva vive em `items`. Por isso derivamos sempre de `items` com fallback
 * para `tickets`.
 */
function buildItems(raw: RawOrder): Order['items'] {
	const reserved = (raw.items ?? [])
		.filter((item) => item.quantity > 0)
		.map((item) => ({
			ticketTypeId: item.batchId,
			ticketTypeName: item.name,
			quantity: item.quantity,
			unitPrice: Number(item.unitPrice),
			peoplePerTicket: item.isGroupTicket ? (item.groupSize ?? 1) : 1,
		}))

	if (reserved.length > 0) return reserved

	return raw.tickets.map((t) => ({
		ticketTypeId: t.batch.name,
		ticketTypeName: t.batch.name,
		quantity: 1,
		unitPrice: Number(t.batch.price),
		peoplePerTicket: t.entriesAllowed,
	}))
}

function firstEvent(raw: RawOrder) {
	return raw.tickets[0]?.event ?? raw.items?.[0]
}

interface RawPayment {
	orderId: string
	method: string | null
	chargeId: string | null
	status: string
	paymentStatus: string
	reference: {
		referenceNumber: string
		entity?: string | null
		dueDate?: string | null
	} | null
	phoneNumber: string | null
	expiresAt: string | null
}

function mapOrder(raw: RawOrder): Order {
	const event = firstEvent(raw)
	return {
		id: raw.id,
		eventId: raw.eventId ?? event?.id ?? '',
		eventTitle: event?.title ?? '',
		eventSlug: '',
		eventDate: event?.startDate ?? '',
		eventImage: '',
		buyerId: '',
		buyerName: '',
		items: buildItems(raw),
		addons: raw.addons?.map((a) => ({
			addonId: a.addon.id,
			name: a.addon.name,
			quantity: a.quantity,
			unitPrice: Number(a.unitPrice),
		})),
		totalAmount: Number(raw.totalAmount),
		status: raw.status.toLowerCase(),
		paymentMethod: mapPaymentMethod(raw.paymentMethod),
		paymentStatus: raw.paymentStatus?.toUpperCase() as Order['paymentStatus'],
		paymentRef: raw.multicaixaReference ?? undefined,
		createdAt: raw.createdAt,
		ticketIds: raw.tickets.map((t) => t.id),
	}
}

function mapOrderDetail(raw: RawOrderDetail): OrderDetail {
	const event = firstEvent(raw)
	const base = mapOrder(raw)

	return {
		...base,
		eventImage: event?.bannerUrl ?? '',
		buyerId: raw.userId,
		buyerName: raw.user?.name ?? '',
		paymentRef: raw.multicaixaReference ?? undefined,
		multicaixaEntity: raw.multicaixaEntity ?? null,
		paymentDueDate: raw.paymentDueDate ?? null,
		paymentReference: raw.multicaixaReference
			? {
					referenceNumber: raw.multicaixaReference,
					entity: raw.multicaixaEntity ?? null,
					dueDate: raw.paymentDueDate ?? null,
				}
			: undefined,
		ticketIds: raw.tickets.map((t) => t.id),
		addonInstances: raw.addonInstances?.map((ai) => ({
			id: ai.id,
			addonId: ai.addonId,
			status: ai.status.toLowerCase(),
			qrSecret: ai.qrSecret,
			qrExpiresAt: ai.qrExpiresAt,
			entriesUsed: ai.entriesUsed,
			entriesAllowed: ai.entriesAllowed,
			addon: ai.addon,
		})),
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
		eventProvince: event?.province ?? undefined,
		eventVenue: event?.location ?? undefined,
		eventStartDate: event?.startDate ?? undefined,
		eventEndDate: event?.endDate ?? undefined,
		userPhoneNumber: raw.user?.phoneNumber ?? undefined,
		userEmail: raw.user?.email ?? undefined,
	}
}

function mapPayment(raw: RawPayment): PaymentInstructions {
	return {
		orderId: raw.orderId,
		method: (raw.method as PaymentInstructions['method']) ?? null,
		chargeId: raw.chargeId,
		status: raw.status as PaymentInstructions['status'],
		paymentStatus: raw.paymentStatus as PaymentInstructions['paymentStatus'],
		reference: raw.reference,
		phoneNumber: raw.phoneNumber,
		expiresAt: raw.expiresAt,
	}
}

interface RawCreateOrderResponse {
	order: RawOrder
	payment: RawPayment
}

export const ordersApi = {
	create: (data: CreateOrderData) =>
		api.post<RawCreateOrderResponse>('/orders', data).then((r) => ({
			order: mapOrder(r.data.order),
			payment: mapPayment(r.data.payment),
		})),

	list: () =>
		api.get<{ orders: RawOrder[] }>('/orders').then((r) => ({
			orders: (r.data.orders ?? []).map(mapOrder),
		})),

	get: (id: string) =>
		api.get<RawOrderDetail>(`/orders/${id}`).then((r) => mapOrderDetail(r.data)),

	getPayment: (id: string) =>
		api.get<RawPayment>(`/orders/${id}/payment`).then((r) => mapPayment(r.data)),

	syncPayment: (id: string) =>
		api.post<RawPayment>(`/orders/${id}/payment/sync`).then((r) => mapPayment(r.data)),

	pay: (id: string) => api.post<never>(`/orders/${id}/pay`).then((r) => r.data),

	cancel: (id: string) => api.post<never>(`/orders/${id}/cancel`).then((r) => r.data),
}
