import { api } from '../client'
import { mapVehicle } from '../../lib/mappers'
import type { RawVehicle } from '../../lib/mappers'
import type { CarBooking, CreateBookingData } from '../../types/rental'

interface RentalResponse {
	order: {
		id: string
		userId: string
		totalAmount: number
		status: string
		paymentStatus: string
	}
	rental: {
		id: string
		vehicleId: string
		orderId: string
		startDate: string
		endDate: string
		totalDays: number
		totalPrice: number
		vehicle: { make: string; model: string; plate: string; price: number }
	}
}

export const rentalsApi = {
	listCars: () =>
		api
			.get<{ vehicles: RawVehicle[] }>('/vehicles')
			.then((r) => ({ cars: (r.data.vehicles ?? []).map(mapVehicle) })),

	getCar: (id: string) =>
		api.get<RawVehicle>(`/vehicles/${id}`).then((r) => ({ car: mapVehicle(r.data) })),

	createBooking: (data: CreateBookingData) =>
		api
			.post<RentalResponse>(`/vehicles/${data.carId}/rent`, {
				startDate: data.startDate,
				endDate: data.endDate,
			})
			.then((r) => {
				const { order, rental } = r.data
				const booking: CarBooking = {
					id: rental.id,
					carId: rental.vehicleId,
					userId: order.userId,
					startDate: rental.startDate,
					endDate: rental.endDate,
					totalDays: rental.totalDays,
					totalPrice: rental.totalPrice,
					status: 'pending',
					orderId: order.id,
				}
				return { booking }
			}),
}
