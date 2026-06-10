import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addonsApi, type CreateAddonData, type UpdateAddonData } from '../endpoints/addons'

export function useAddons(eventId: string) {
	return useQuery({
		queryKey: ['addons', eventId],
		queryFn: () => addonsApi.list(eventId),
		enabled: !!eventId,
	})
}

export function useCreateAddon(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (data: CreateAddonData) => addonsApi.create(eventId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['addons', eventId] })
			qc.invalidateQueries({ queryKey: ['events', eventId] })
		},
	})
}

export function useUpdateAddon(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ addonId, data }: { addonId: string; data: UpdateAddonData }) =>
			addonsApi.update(eventId, addonId, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['addons', eventId] })
			qc.invalidateQueries({ queryKey: ['events', eventId] })
		},
	})
}

export function useRemoveAddon(eventId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (addonId: string) => addonsApi.remove(eventId, addonId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['addons', eventId] })
			qc.invalidateQueries({ queryKey: ['events', eventId] })
		},
	})
}
