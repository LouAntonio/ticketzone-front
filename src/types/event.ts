export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'CANCELLED' | 'COMPLETED'

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

export interface TicketBatch {
	id: string
	name: string
	price: number
	capacity: number
	sold: number
	isGroupTicket: boolean
	groupSize: number
	deletedAt?: string | null
}

export interface DocFile {
	url: string
	idcloudinary: string
}

export interface CategoryInfo {
	id: string
	name: string
	slug: string
	image?: string | null
}

export interface EventCategoryRelation {
	eventId: string
	categoryId: string
	category: CategoryInfo
}

export interface Addon {
	id: string
	name: string
	description?: string | null
	price: number
	capacity: number
	sold: number
	createdAt?: string
	updatedAt?: string
	deletedAt?: string | null
}

export interface Event {
	id: string
	title: string
	description: string
	province: string
	location: string
	bannerUrl: string | null
	cloudinaryId: string | null
	gallery?: DocFile[]
	startDate: string
	endDate: string
	isApproved: boolean
	denialReason?: string | null
	status: EventStatus
	salesPaused: boolean
	promoterId: string
	featured: boolean
	startedAt?: string | null
	shortDescription?: string
	eventCategories: EventCategoryRelation[]
	batches: TicketBatch[]
	addons: Addon[]
	createdAt: string
	promoter?: {
		companyName: string
		user: { name: string; image?: string }
	}
	_count?: { tickets: number }

	// Legacy fields (for backward compatibility with public pages)
	slug?: string
	coverImage?: string
	category?: EventCategory
	date?: string
	time?: string
	period?: EventPeriod
	venue?: string
	address?: string
	organizerId?: string
	organizerName?: string
	ticketTypes?: TicketType[]
}

export interface EventFormData {
	title: string
	description: string
	province: string
	location: string
	bannerUrl: string
	cloudinaryId: string
	gallery?: DocFile[]
	categoryIds: string[]
	startDate: string
	endDate: string
	batches: Array<{
		name: string
		price: number
		capacity: number
		isGroupTicket: boolean
		groupSize: number
	}>
	addons: Addon[]
}

export interface EventFilters {
	categoryId?: string
	category?: EventCategory
	categoryIds?: string[]
	province?: string
	period?: EventPeriod
	search?: string
	featured?: boolean
	page?: number
	limit?: number
}

export interface SalesOrderItem {
	ticketTypeName: string
	quantity: number
	unitPrice: number
}

export interface SalesOrder {
	id: string
	eventTitle?: string
	eventId?: string
	buyerName?: string
	buyerId?: string
	items?: SalesOrderItem[]
	addons?: Array<{
		name: string
		quantity: number
		unitPrice: number
	}>
	total: number
	status: string
	createdAt: string
}

export interface SalesData {
	totalRevenue: number
	totalOrders: number
	totalTickets: number
	balance: number
	orders: SalesOrder[]
}

export interface EventSalesData {
	totalSold: number
	totalTickets: number
	ordersCount: number
	orders: SalesOrder[]
}

export interface AttendeesData {
	attendees: SalesOrder[]
}

export interface StaffMember {
	id: string
	userId: string
	name: string | null
	email: string
	image?: string | null
	addedByName: string | null
	addedAt: string
}
