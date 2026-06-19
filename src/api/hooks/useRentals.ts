import { useQuery, useMutation } from '@tanstack/react-query'
import { rentalsApi } from '../endpoints/rentals'
import type { CreateBookingData } from '../../types/rental'

export function useCars(params?: { search?: string; status?: string; page?: number; limit?: number }) {
	return useQuery({
		queryKey: ['cars', params],
		queryFn: () => rentalsApi.listCars(params),
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

export function useMyRentals() {
	return useQuery({
		queryKey: ['my-rentals'],
		queryFn: rentalsApi.getMyRentals,
	})
}

export function useRental(id: string) {
	return useQuery({
		queryKey: ['my-rentals', id],
		queryFn: () => rentalsApi.getRental(id),
		enabled: !!id,
	})
}
