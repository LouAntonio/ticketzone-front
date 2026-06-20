import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../endpoints/tickets'
import { toast } from 'react-hot-toast'

export function useTickets() {
	return useQuery({
		queryKey: ['tickets'],
		queryFn: ticketsApi.list,
	})
}

export function useVerifyQrCode() {
	return useMutation({
		mutationFn: (qrCode: string) => ticketsApi.verifyQr(qrCode),
	})
}

export function useValidateTicket() {
	return useMutation({
		mutationFn: (ticketId: string) => ticketsApi.validate(ticketId),
	})
}

export function useRotateQrCode() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (ticketId: string) => ticketsApi.rotateQr(ticketId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['tickets'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao renovar QR Code')
		},
	})
}
