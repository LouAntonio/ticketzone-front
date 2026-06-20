import { useQuery, useMutation } from '@tanstack/react-query'
import { rentalsApi } from '../endpoints/rentals'
import type { CreateBookingData } from '../../types/rental'

export function useCars(params?: {
	search?: string
	status?: string
	page?: number
	limit?: number
	location?: string
	fuelType?: string
	transmission?: string
}) {
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

export function useCarBySlug(slug: string) {
	return useQuery({
		queryKey: ['cars', 'slug', slug],
		queryFn: () => rentalsApi.getCarBySlug(slug),
		enabled: !!slug,
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
