import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../endpoints/orders'
import type { CreateOrderData } from '../../types/order'

/** Intervalo de polling enquanto o pagamento está pendente. */
const PAYMENT_POLL_INTERVAL_MS = 4000

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
			// Os bilhetes só são emitidos depois do pagamento — invalidamos para
			// que a lista se actualize assim que o webhook for processado.
			qc.invalidateQueries({ queryKey: ['tickets'] })
		},
	})
}

/**
 * Estado do pagamento de uma encomenda.
 *
 * Enquanto `paymentStatus` for PENDING faz polling automático — é o mecanismo
 * que substitui a resposta síncrona da AppyPay (que pode demorar 90 s).
 */
export function useOrderPayment(orderId: string | undefined, enabled = true) {
	return useQuery({
		queryKey: ['order', orderId, 'payment'],
		queryFn: () => ordersApi.getPayment(orderId as string),
		enabled: Boolean(orderId) && enabled,
		refetchInterval: (query) => {
			const status = query.state.data?.paymentStatus
			return status === 'PENDING' ? PAYMENT_POLL_INTERVAL_MS : false
		},
	})
}

/** Força uma reconciliação com a AppyPay (botão "já paguei"). */
export function useSyncOrderPayment() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (orderId: string) => ordersApi.syncPayment(orderId),
		onSuccess: (_data, orderId) => {
			qc.invalidateQueries({ queryKey: ['order', orderId, 'payment'] })
			qc.invalidateQueries({ queryKey: ['order', orderId] })
			qc.invalidateQueries({ queryKey: ['orders'] })
			qc.invalidateQueries({ queryKey: ['tickets'] })
		},
	})
}
