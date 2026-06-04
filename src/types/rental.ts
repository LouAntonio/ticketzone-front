export type Transmission = 'manual' | 'auto'

export interface Car {
	id: string
	make: string
	model: string
	year: number
	photos: string[]
	pricePerDay: number
	transmission: Transmission
	seats: number
	fuelType: string
	available: boolean
	location: string
	description: string
}

export interface CarBooking {
	id: string
	carId: string
	userId: string
	startDate: string
	endDate: string
	totalDays: number
	totalPrice: number
	status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
	orderId?: string
}

export interface CarPackage {
	id: string
	eventId: string
	carId: string
	priceAdjustment: number
}

export interface CreateBookingData {
	carId: string
	startDate: string
	endDate: string
}
