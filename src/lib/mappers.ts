import type { Event, EventCategory, EventPeriod, EventStatus } from '../types/event'
import type { Car, Transmission } from '../types/rental'

export interface RawEvent {
	id: string
	slug?: string | null
	title: string
	description: string
	province: string
	location: string
	bannerUrl: string | null
	cloudinaryId: string | null
	gallery?: Array<{ url: string; idcloudinary: string }> | null
	startDate: string
	endDate: string
	isApproved: boolean
	denialReason?: string | null
	status: string
	salesPaused: boolean
	promoterId: string
	createdAt: string
	eventCategories?: Array<{
		eventId?: string
		categoryId?: string
		category: { id: string; name: string; slug: string }
	}>
	batches?: Array<{
		id: string
		name: string
		price: number
		capacity: number
		sold: number
		isGroupTicket: boolean
		groupSize: number
	}>
	addons?: Array<{
		id: string
		name: string
		description?: string | null
		price: number
		capacity: number
		sold: number
	}>
	promoter?: {
		companyName: string
		user: { name: string; image?: string }
	} | null
}

function inferPeriod(date: Date): EventPeriod {
	const h = date.getHours()
	if (h < 12) return 'morning'
	if (h < 18) return 'afternoon'
	return 'night'
}

function formatTime(date: Date): string {
	return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function mapEvent(raw: RawEvent): Event {
	const startDate = new Date(raw.startDate)
	const categorySlug = raw.eventCategories?.[0]?.category?.slug ?? ''
	const tts = (raw.batches ?? []).map((b) => ({
		id: b.id,
		name: b.name,
		price: Number(b.price),
		capacity: b.capacity,
		peoplePerTicket: b.isGroupTicket ? b.groupSize : 1,
		quantity: b.capacity - b.sold,
		available: b.capacity - b.sold,
		description: b.isGroupTicket
			? `${b.groupSize} ${b.groupSize === 1 ? 'pessoa' : 'pessoas'} por bilhete`
			: undefined,
	}))
	const aas = (raw.addons ?? []).map((a) => ({
		id: a.id,
		name: a.name,
		description: a.description ?? null,
		price: Number(a.price),
		capacity: a.capacity,
		sold: a.sold,
	}))

	return {
		...raw,
		slug: raw.slug ?? raw.id,
		coverImage: raw.bannerUrl ?? '',
		category: categorySlug as EventCategory,
		date: raw.startDate,
		time: formatTime(startDate),
		period: inferPeriod(startDate),
		venue: raw.location,
		address: raw.location,
		organizerId: raw.promoterId,
		organizerName: raw.promoter?.companyName ?? raw.promoter?.user?.name ?? '',
		ticketTypes: tts,
		addons: aas,
		status: raw.status as EventStatus,
		bannerUrl: raw.bannerUrl,
		startDate: raw.startDate,
		endDate: raw.endDate,
		eventCategories: (raw.eventCategories ?? []).map((ec) => ({
			eventId: ec.eventId ?? '',
			categoryId: ec.categoryId ?? '',
			category: ec.category,
		})),
		batches: raw.batches ?? [],
		promoter: raw.promoter ?? undefined,
		gallery: raw.gallery ?? undefined,
	}
}

export interface RawVehicle {
	id: string
	ownerId: string
	make: string
	model: string
	plate: string
	year: number | null
	price: number
	status: string
	photos: string[]
	transmission: string | null
	seats: number | null
	fuelType: string | null
	location: string | null
	description: string | null
	createdAt: string
}

export function mapVehicle(raw: RawVehicle): Car {
	return {
		id: raw.id,
		make: raw.make,
		model: raw.model,
		year: raw.year ?? new Date().getFullYear(),
		photos: raw.photos?.length ? raw.photos : [],
		pricePerDay: Number(raw.price),
		transmission: (raw.transmission ?? 'auto') as Transmission,
		seats: raw.seats ?? 5,
		fuelType: raw.fuelType ?? 'Gasolina',
		available: raw.status === 'AVAILABLE',
		location: raw.location ?? 'Luanda',
		description: raw.description ?? `${raw.make} ${raw.model} (${raw.plate})`,
	}
}
