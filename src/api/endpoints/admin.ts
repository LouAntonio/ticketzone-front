import { api } from '../client'

export interface AdminStats {
	totalUsers: number
	totalOrganizers: number
	totalEvents: number
	totalOrders: number
	totalRevenue: number
	totalCommissions: number
	totalTicketsSold: number
	totalCars: number
	pendingOrders: number
	recentOrders: AdminOrder[]
	revenueByMonth: { month: string; revenue: number }[]
}

export interface AdminUser {
	id: string
	name: string
	email: string
	phone?: string
	role: string
	createdAt: string
	organizerCompany?: string
}

export interface AdminEvent {
	id: string
	title: string
	category: string
	province: string
	date: string
	status: string
	organizerName: string
	ticketsSold: number
	revenue: number
}

export interface AdminOrder {
	id: string
	eventTitle: string
	buyerName: string
	total: number
	status: string
	paymentMethod: string
	createdAt: string
	commission: number
}

export interface AdminOrganizer {
	id: string
	userId: string
	companyName: string
	ownerName: string
	document: string
	bankName: string
	balance: number
	eventsCount: number
	totalRevenue: number
}

export interface AdminFinancial {
	totalRevenue: number
	totalCommissions: number
	totalPayouts: number
	pendingPayouts: number
	organizersCount: number
	averageCommission: number
}

export interface AdminCar {
	id: string
	make: string
	model: string
	year: number
	pricePerDay: number
	transmission: string
	seats: number
	fuelType: string
	available: boolean
	location: string
}

export const adminApi = {
	stats: () =>
		api.get<AdminStats>('/api/admin/stats').then((r) => r.data),

	users: () =>
		api.get<{ users: AdminUser[] }>('/api/admin/users').then((r) => r.data),

	events: () =>
		api.get<{ events: AdminEvent[] }>('/api/admin/events').then((r) => r.data),

	orders: () =>
		api.get<{ orders: AdminOrder[] }>('/api/admin/orders').then((r) => r.data),

	organizers: () =>
		api.get<{ organizers: AdminOrganizer[] }>('/api/admin/organizers').then((r) => r.data),

	financial: () =>
		api.get<AdminFinancial>('/api/admin/financial').then((r) => r.data),

	fleet: () =>
		api.get<{ cars: AdminCar[] }>('/api/admin/fleet').then((r) => r.data),

	updateEventStatus: (id: string, status: string) =>
		api.put(`/api/admin/events/${id}/status`, { status }).then((r) => r.data),

	updateUserRole: (id: string, role: string) =>
		api.put(`/api/admin/users/${id}/role`, { role }).then((r) => r.data),
}
