import { useQuery, useMutation } from '@tanstack/react-query'
import { rentalsApi } from '../endpoints/rentals'
import type { CreateBookingData } from '../../types/rental'

export function useCars() {
	return useQuery({
		queryKey: ['cars'],
		queryFn: rentalsApi.listCars,
	})
}

export function useCar(id: string) {
	return useQuery({
		queryKey: ['cars', id],
		queryFn: () => rentalsApi.getCar(id),
		enabled: !!id,
	})
}

export function useCreateBooking() {
	return useMutation({
		mutationFn: (data: CreateBookingData) => rentalsApi.createBooking(data),
	})
}
