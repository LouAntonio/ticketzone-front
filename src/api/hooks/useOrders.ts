import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../endpoints/orders'
import type { CreateOrderData, Order } from '../../types/order'

export function useOrders() {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => ordersApi.list(),
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
