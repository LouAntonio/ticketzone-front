import { api } from '../client'
import type { Order, CreateOrderData } from '../../types/order'

export const ordersApi = {
	create: (data: CreateOrderData) =>
		api.post<{ order: Order }>('/api/orders', data).then((r) => r.data),

	list: () => api.get<{ orders: Order[] }>('/api/orders').then((r) => r.data),
}
