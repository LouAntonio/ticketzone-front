import { api } from '../client'
import type { Ticket, VerifyQrResponse, ValidationResult, RotateQrResponse } from '../../types/ticket'

interface RawTicket {
	id: string
	orderId: string
	eventId: string
	status: string
	qrSecret: string
	qrExpiresAt: string
	entriesUsed: number
	entriesAllowed: number
	createdAt: string
	event: {
		id: string
		title: string
		startDate: string
		endDate: string
		location: string
		bannerUrl: string | null
	}
	batch: {
		name: string
		price: number
		isGroupTicket: boolean
		groupSize: number
	}
	order: { id: string }
}

function mapTicket(t: RawTicket): Ticket {
	return {
		id: t.id,
		orderId: t.orderId,
		eventId: t.eventId,
		eventTitle: t.event.title,
		eventDate: t.event.startDate,
		eventImage: t.event.bannerUrl ?? '',
		ticketTypeName: t.batch.name,
		buyerName: '',
		qrCode: t.qrSecret,
		qrExpiresAt: t.qrExpiresAt,
		groupSize: t.batch.isGroupTicket ? t.batch.groupSize : undefined,
		used: t.entriesUsed,
		entriesAllowed: t.entriesAllowed,
		status: t.status.toLowerCase() as Ticket['status'],
		validateUntil: t.qrExpiresAt,
	}
}

export const ticketsApi = {
	list: () =>
		api.get<{ data: RawTicket[]; total: number }>('/tickets')
			.then((r) => ({
				data: (r.data.data ?? []).map(mapTicket),
				total: r.data.total ?? 0,
			})),

	verifyQr: (qrCode: string) =>
		api.post<VerifyQrResponse>('/tickets/verify-qr', { qrCode }).then((r) => r.data),

	validate: (ticketId: string) =>
		api.post<ValidationResult>(`/tickets/${ticketId}/validate`).then((r) => r.data),

	rotateQr: (ticketId: string) =>
		api.post<RotateQrResponse>(`/tickets/${ticketId}/rotate-qr`).then((r) => r.data),
}
