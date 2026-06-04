export type EventCategory = 'conference' | 'workshop' | 'theatre' | 'festival' | 'family' | 'party'

export type EventPeriod = 'morning' | 'afternoon' | 'night'

export interface TicketType {
	id: string
	name: string
	price: number
	capacity: number
	peoplePerTicket: number
	quantity: number
	available: number
	description?: string
}

export interface Addon {
	id: string
	name: string
	description: string
	price: number
}

export interface Event {
	id: string
	title: string
	slug: string
	description: string
	shortDescription: string
	coverImage: string
	category: EventCategory
	province: string
	date: string
	endDate?: string
	time: string
	period: EventPeriod
	venue: string
	address: string
	organizerId: string
	organizerName: string
	ticketTypes: TicketType[]
	addons?: Addon[]
	featured?: boolean
	status: 'draft' | 'published' | 'cancelled' | 'completed'
	createdAt: string
}

export interface EventFormData {
	title: string
	description: string
	shortDescription: string
	coverImage: string
	category: EventCategory
	province: string
	date: string
	time: string
	period: EventPeriod
	venue: string
	address: string
	ticketTypes: Omit<TicketType, 'id' | 'available'>[]
}

export interface EventFilters {
	category?: EventCategory
	province?: string
	period?: EventPeriod
	search?: string
}
