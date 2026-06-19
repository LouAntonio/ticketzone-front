import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../endpoints/orders'
import type { CreateOrderData } from '../../types/order'

interface OrderItemDisplay {
	ticketTypeId?: string
	ticketTypeName?: string
	quantity?: number
	unitPrice?: number
	peoplePerTicket?: number
}

interface OrderDisplay {
	id?: string
	eventId?: string
	eventTitle?: string
	eventSlug?: string
	eventDate?: string
	eventImage?: string
	buyerId?: string
	buyerName?: string
	items?: OrderItemDisplay[]
	totalAmount?: number
	status?: string
	paymentMethod?: string
	createdAt?: string
}

export function useOrders() {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () =>
			ordersApi.list().then((res) => ({
				orders: res.orders as OrderDisplay[],
			})),
	})
}

export function useCreateOrder() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: CreateOrderData) => ordersApi.create(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['orders'] })
			qc.invalidateQueries({ queryKey: ['tickets'] })
		},
	})
}

export type { OrderDisplay, OrderItemDisplay }
