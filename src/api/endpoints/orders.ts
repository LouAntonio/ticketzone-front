import { api } from '../client'
import type { Order, OrderDetail, CreateOrderData } from '../../types/order'

export const ordersApi = {
	create: (data: CreateOrderData) =>
		api.post<{ order: Order }>('/api/orders', data).then((r) => r.data),

	list: () => api.get<{ orders: Order[] }>('/api/orders').then((r) => r.data),

	get: (id: string) => api.get<OrderDetail>(`/api/orders/${id}`).then((r) => r.data),

	pay: (id: string) => api.post<never>(`/orders/${id}/pay`).then((r) => r.data),

	cancel: (id: string) => api.post<never>(`/orders/${id}/cancel`).then((r) => r.data),
}
