import { useQuery, useMutation } from '@tanstack/react-query'
import { ticketsApi } from '../endpoints/tickets'

export function useTickets() {
	return useQuery({
		queryKey: ['tickets'],
		queryFn: ticketsApi.list,
	})
}

export function useValidateTicket() {
	return useMutation({
		mutationFn: (qrCode: string) => ticketsApi.validate(qrCode),
	})
}
