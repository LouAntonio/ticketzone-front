import { api } from '../client'
import { mapVehicle } from '../../lib/mappers'
import type { RawVehicle } from '../../lib/mappers'
import type { CarBooking, CreateBookingData, Rental } from '../../types/rental'

interface RentalResponse {
	order: {
		id: string
		userId: string
		totalAmount: number
		status: string
		paymentStatus: string
		paymentMethod?: string
	}
	rental: {
		id: string
		vehicleId: string
		orderId: string
		startDate: string
		endDate: string
		totalDays: number
		totalPrice: number
		paymentRef?: string | null
		vehicle: { make: string; model: string; plate: string; price: number }
	}
}

interface RawRental {
	id: string
	vehicleId: string
	orderId: string
	eventId: string | null
	startDate?: string
	endDate?: string
	createdAt: string
	vehicle: {
		id: string
		make: string
		model: string
		plate: string
		price: number
		photos: string[]
		transmission?: string
		seats?: number
		fuelType?: string
		location?: string
	} | null
	event?: {
		id: string
		title: string
		startDate: string
		endDate: string
		location?: string
	} | null
	order?: {
		id: string
		status: string
		paymentStatus: string
		totalAmount: number
		paymentMethod?: string
		multicaixaReference?: string | null
		paypayReference?: string | null
		createdAt?: string
	} | null
}

function mapRental(raw: RawRental): Rental {
	const startDate = raw.startDate ?? ''
	const endDate = raw.endDate ?? ''
	const totalMs = new Date(endDate).getTime() - new Date(startDate).getTime()
	const totalDays = Math.max(1, Math.ceil(totalMs / 86400000))

	return {
		id: raw.id,
		vehicleId: raw.vehicleId,
		orderId: raw.orderId,
		eventId: raw.eventId,
		startDate,
		endDate,
		totalDays,
		totalPrice: raw.order ? Number(raw.order.totalAmount) : 0,
		createdAt: raw.createdAt,
		vehicle: raw.vehicle
			? { ...raw.vehicle, price: Number(raw.vehicle.price) }
			: ({} as Rental['vehicle']),
		event: raw.event ?? null,
		order: raw.order
			? {
					...raw.order,
					totalAmount: Number(raw.order.totalAmount),
				}
			: undefined,
	}
}

export const rentalsApi = {
	listCars: (params?: { search?: string; status?: string; page?: number; limit?: number; location?: string; fuelType?: string; transmission?: string }) =>
		api
			.get<{ vehicles: RawVehicle[]; total: number; page: number; limit: number; totalPages: number }>('/vehicles', { params })
			.then((r) => ({
				cars: (r.data.vehicles ?? []).map(mapVehicle),
				total: r.data.total,
				page: r.data.page,
				limit: r.data.limit,
				totalPages: r.data.totalPages,
			})),

	getCar: (id: string) =>
		api.get<{ data: RawVehicle }>(`/vehicles/${id}`).then((r) => ({ car: mapVehicle(r.data.data ?? r.data) })),

	createBooking: (data: CreateBookingData) =>
		api
			.post<{ data: RentalResponse }>(`/vehicles/${data.carId}/rent`, {
				startDate: data.startDate,
				endDate: data.endDate,
				paymentMethod: data.paymentMethod,
			})
			.then((r) => {
				const { order, rental } = r.data.data ?? r.data
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
					paymentRef: rental.paymentRef ?? null,
				}
				return { booking, order }
			}),

	getMyRentals: () =>
		api
			.get<{ rentals: RawRental[] }>('/vehicles/rentals/my')
			.then((r) => ({ rentals: (r.data.rentals ?? []).map(mapRental) })),

	getRental: (id: string) =>
		api
			.get<{ data: RawRental }>(`/vehicles/rentals/${id}`)
			.then((r) => ({ rental: mapRental(r.data.data ?? r.data) })),
}
