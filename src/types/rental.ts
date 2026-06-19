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
	plate: string
}

export interface Rental {
	id: string
	vehicleId: string
	orderId: string
	eventId: string | null
	startDate: string
	endDate: string
	totalDays: number
	totalPrice: number
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
	}
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
	}
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
	paymentRef?: string | null
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
	paymentMethod?: string
}
