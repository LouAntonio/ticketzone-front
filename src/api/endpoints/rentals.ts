import { api } from '../client'
import type { Car, CarBooking, CreateBookingData } from '../../types/rental'

export const rentalsApi = {
	listCars: () => api.get<{ cars: Car[] }>('/rentals/cars').then((r) => r.data),

	getCar: (id: string) => api.get<{ car: Car }>(`/rentals/cars/${id}`).then((r) => r.data),

	createBooking: (data: CreateBookingData) =>
		api.post<{ booking: CarBooking }>('/rentals/bookings', data).then((r) => r.data),
}
