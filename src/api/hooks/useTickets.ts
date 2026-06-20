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
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ['tickets'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao renovar QR Code')
		},
	})
}

export function useVerifyQrUnified() {
	return useMutation({
		mutationFn: (qrCode: string) => ticketsApi.verifyQrUnified(qrCode),
	})
}

export function useValidateAddon() {
	return useMutation({
		mutationFn: (addonId: string) => ticketsApi.validateAddon(addonId),
	})
}

export function useRotateAddonQrCode() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (addonId: string) => ticketsApi.rotateAddonQr(addonId),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ['addon'] })
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Erro ao renovar QR Code do add-on')
		},
	})
}

export function useMyAddons() {
	return useQuery({
		queryKey: ['my-addons'],
		queryFn: ticketsApi.myAddons,
	})
}

export function useAddonInstance(addonId: string) {
	return useQuery({
		queryKey: ['addon', addonId],
		queryFn: () => ticketsApi.getAddon(addonId),
		enabled: !!addonId,
	})
}
