import { useQuery } from '@tanstack/react-query'
import { api } from '../client'

interface OrderItemDisplay {
	ticketTypeName?: string
	quantity?: number
	unitPrice?: number
}

interface SalesOrder {
	id?: string
	eventTitle?: string
	eventId?: string
	buyerName?: string
	buyerId?: string
	items?: OrderItemDisplay[]
	total?: number
	status?: string
	createdAt?: string
}

interface SalesData {
	totalRevenue: number
	totalOrders: number
	totalTickets: number
	balance: number
	orders: SalesOrder[]
}

interface AttendeesData {
	attendees: SalesOrder[]
}

export function useOrganizerSales() {
	return useQuery({
		queryKey: ['organizer', 'sales'],
		queryFn: () => api.get<SalesData>('/api/organizer/sales').then((r) => r.data),
	})
}

export function useOrganizerAttendees() {
	return useQuery({
		queryKey: ['organizer', 'attendees'],
		queryFn: () => api.get<AttendeesData>('/api/organizer/attendees').then((r) => r.data),
	})
}

export type { SalesOrder, OrderItemDisplay }
