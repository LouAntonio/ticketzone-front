import { api } from '../client'

// ==================== Types ====================

export interface AdminStats {
	totalUsers: number
	totalOrganizers: number
	totalPromoters: number
	pendingPromoters: number
	totalEvents: number
	pendingEvents: number
	totalOrders: number
	pendingOrders: number
	totalRevenue: number
	totalVehicles: number
	rentedVehicles: number
	vehiclesInMaintenance: number
	totalRentals: number
	totalTicketsSold: number
	revenueByMonth: { month: string; revenue: number }[]
	recentOrders: {
		id: string
		eventTitle: string
		buyerName: string
		total: number
		status: string
		createdAt: string
		paymentMethod: string | null
	}[]
}

export interface AdminUser {
	id: string
	name: string
	email: string
	phone: string | null
	role: string
	status: string
	bannedUntil: string | null
	banMotive: string | null
	emailVerified: boolean
	image: string | null
	organizerCompany: string | null
	promoterId: string | null
	createdAt: string
}

export interface PaginatedUsers {
	users: AdminUser[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface AdminEvent {
	id: string
	title: string
	status: string
	isApproved: boolean
	denialReason: string | null
	province: string
	location: string
	category: string | null
	categoryName: string | null
	organizerName: string
	organizerEmail: string | null
	date: string
	startDate: string
	endDate: string
	ticketsSold: number
	capacity: number
	totalTickets: number
	revenue: number
	salesPaused: boolean
	bannerUrl: string | null
	createdAt: string
	featured: boolean
}

export interface PaginatedEvents {
	events: AdminEvent[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface AdminOrder {
	id: string
	eventTitle: string
	buyerName: string
	buyerEmail: string
	total: number
	commission: number
	status: string
	paymentMethod: string | null
	paymentStatus: string
	ticketCount: number
	createdAt: string
}

export interface PaginatedOrders {
	orders: AdminOrder[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface AdminPromoter {
	id: string
	userId: string
	companyName: string
	nif: string | null
	iban: string | null
	isVerified: boolean
	ownerName: string
	ownerEmail: string
	document: string
	bankName: string
	balance: number
	verificationStatus: string
	status: string
	bannedUntil: string | null
	banMotive: string | null
	eventsCount: number
	totalRevenue: number
	payoutsCount: number
	createdAt: string
}

export interface PaginatedPromoters {
	promoters: AdminPromoter[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface AdminFinancial {
	totalRevenue: number
	totalCommissions: number
	totalPayouts: number
	pendingPayouts: number
	organizersCount: number
	totalOrders: number
	paidOrders: number
	averageCommission: number
	netRevenue: number
}

export interface AdminVehicle {
	id: string
	make: string
	model: string
	plate: string
	year: number | null
	pricePerDay: number
	status: string
	available: boolean
	ownerName: string
	rentalsCount: number
	createdAt: string
}

export interface PaginatedVehicles {
	vehicles: AdminVehicle[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface AuditLog {
	id: string
	action: string
	entity: string
	entityId: string
	adminName: string
	adminEmail: string
	payload: unknown
	ipAddress: string | null
	createdAt: string
}

export interface PaginatedAuditLogs {
	logs: AuditLog[]
	total: number
	page: number
	limit: number
	totalPages: number
}

// ==================== Detail Types ====================

export interface AdminUserDetail {
	id: string
	name: string
	email: string
	role: string
	status: string
	bannedUntil: string | null
	banMotive: string | null
	emailVerified: boolean
	phoneNumber: string | null
	image: string | null
	createdAt: string
	promoter: {
		id: string
		companyName: string
		nif: string | null
		iban: string | null
		promoterType: string
		isVerified: boolean
		verificationStatus: string
		status: string
		bannedUntil: string | null
		banMotive: string | null
		balance: number
		_count: { events: number }
	} | null
	_count: { orders: number; tickets: number }
}

export interface AdminEventDetail {
	id: string
	title: string
	description: string
	province: string
	location: string
	bannerUrl: string | null
	startDate: string
	endDate: string
	isApproved: boolean
	denialReason: string | null
	status: string
	salesPaused: boolean
	createdAt: string
	categories: { id: string; name: string; slug: string } | null
	batches: {
		id: string
		name: string
		price: number
		capacity: number
		sold: number
		isGroupTicket: boolean
		groupSize: number | null
	}[]
	promoter: {
		companyName: string
		nif: string | null
		iban: string | null
		user: { id: string; name: string; email: string; phoneNumber: string | null }
	}
	_count: { tickets: number }
}

export interface AdminPromoterDetail {
	id: string
	userId: string
	companyName: string
	nif: string | null
	iban: string | null
	promoterType: string
	logo: unknown
	banner: unknown
	isVerified: boolean
	verificationStatus: string
	status: string
	bannedUntil: string | null
	banMotive: string | null
	balance: number
	createdAt: string
	user: {
		id: string
		name: string
		email: string
		image: string | null
		role: string
		phoneNumber: string | null
		emailVerified: boolean
		status: string
		bannedUntil: string | null
		banMotive: string | null
		createdAt: string
	}
	_count: { events: number }
	docs: {
		id: string
		personal: { url: string; idcloudinary: string }[]
		enterprise: { url: string; idcloudinary: string }[]
		uploadedAt: string
	}[]
	payouts: {
		id: string
		amount: number
		status: string
		createdAt: string
	}[]
}

export interface AdminOrderDetail {
	id: string
	totalAmount: number
	status: string
	paymentMethod: string | null
	paymentStatus: string
	multicaixaReference: string | null
	paypayReference: string | null
	createdAt: string
	user: { id: string; name: string; email: string; phoneNumber: string | null }
	tickets: {
		id: string
		status: string
		entriesUsed: number
		entriesAllowed: number
		batch: { id: string; name: string; price: number }
		event: { id: string; title: string }
		owner: { id: string; name: string; email: string }
	}[]
	rentals: {
		id: string
		vehicle: { id: string; make: string; model: string; plate: string }
		event: { id: string; title: string }
	}[]
}

export interface AdminVehicleDetail {
	id: string
	make: string
	model: string
	plate: string
	year: number | null
	price: number
	status: string
	createdAt: string
	owner: { id: string; name: string; email: string }
	_count: { rentals: number }
	rentals: {
		id: string
		event: { id: string; title: string } | null
		order: { id: string; status: string; totalAmount: number } | null
		createdAt: string
	}[]
}

// ==================== API Calls ====================

export const adminApi = {
	// Stats
	stats: () => api.get<{ stats: AdminStats }>('/admin/stats').then((r) => r.data.stats),

	// Users
	listUsers: (params?: {
		page?: number
		limit?: number
		search?: string
		role?: string
		status?: string
	}) => api.get<PaginatedUsers>('/admin/users', { params }).then((r) => r.data),

	getUser: (id: string) => api.get<AdminUserDetail>(`/admin/users/${id}`).then((r) => r.data),

	updateUserRole: (id: string, role: string) =>
		api.patch<{ msg: string }>(`/admin/users/${id}/role`, { role }).then((r) => r.data),

	banUser: (id: string, motive: string, bannedUntil?: string) =>
		api
			.post<{ msg: string }>(`/admin/users/${id}/ban`, { motive, bannedUntil })
			.then((r) => r.data),

	unbanUser: (id: string) =>
		api.post<{ msg: string }>(`/admin/users/${id}/unban`).then((r) => r.data),

	// Events
	listEvents: (params?: {
		page?: number
		limit?: number
		search?: string
		categoryId?: string
		province?: string
	}) => api.get<PaginatedEvents>('/admin/events', { params }).then((r) => r.data),

	listPendingEvents: (params?: { page?: number; limit?: number }) =>
		api.get<PaginatedEvents>('/admin/events/pending', { params }).then((r) => r.data),

	getEvent: (id: string) => api.get<AdminEventDetail>(`/admin/events/${id}`).then((r) => r.data),

	updateEvent: (id: string, data: Record<string, unknown>) =>
		api.patch<{ msg: string }>(`/admin/events/${id}`, data).then((r) => r.data),

	approveEvent: (id: string) =>
		api.post<{ msg: string }>(`/admin/events/${id}/approve`).then((r) => r.data),

	rejectEvent: (id: string, motive: string) =>
		api.post<{ msg: string }>(`/admin/events/${id}/reject`, { motive }).then((r) => r.data),

	cancelEvent: (id: string) =>
		api.post<{ msg: string }>(`/admin/events/${id}/cancel`).then((r) => r.data),

	toggleFeatured: (id: string) =>
		api
			.post<{ msg: string; featured: boolean }>(`/admin/events/${id}/featured`)
			.then((r) => r.data),

	// Promoters
	listPromoters: (params?: {
		page?: number
		limit?: number
		search?: string
		status?: string
		verificationStatus?: string
	}) => api.get<PaginatedPromoters>('/admin/promoters', { params }).then((r) => r.data),

	verificationRequests: (params?: { page?: number; limit?: number }) =>
		api
			.get<PaginatedPromoters>('/admin/promoters/verification-requests', { params })
			.then((r) => r.data),

	getPromoter: (id: string) =>
		api.get<AdminPromoterDetail>(`/admin/promoters/${id}`).then((r) => r.data),

	approvePromoter: (id: string) =>
		api.post<{ msg: string }>(`/admin/promoters/${id}/approve`).then((r) => r.data),

	rejectPromoter: (id: string, motive: string) =>
		api.post<{ msg: string }>(`/admin/promoters/${id}/reject`, { motive }).then((r) => r.data),

	banPromoter: (id: string, motive: string, bannedUntil?: string) =>
		api
			.post<{ msg: string }>(`/admin/promoters/${id}/ban`, { motive, bannedUntil })
			.then((r) => r.data),

	unbanPromoter: (id: string) =>
		api.post<{ msg: string }>(`/admin/promoters/${id}/unban`).then((r) => r.data),

	// Orders
	listOrders: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
		api.get<PaginatedOrders>('/admin/orders', { params }).then((r) => r.data),

	getOrder: (id: string) => api.get<AdminOrderDetail>(`/admin/orders/${id}`).then((r) => r.data),

	refundOrder: (id: string) =>
		api.post<{ msg: string }>(`/admin/orders/${id}/refund`).then((r) => r.data),

	// Financial
	getFinancial: () => api.get<AdminFinancial>('/admin/financial').then((r) => r.data),

	// Fleet
	listFleet: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
		api.get<PaginatedVehicles>('/admin/fleet', { params }).then((r) => r.data),

	getVehicle: (id: string) =>
		api.get<AdminVehicleDetail>(`/admin/fleet/${id}`).then((r) => r.data),

	createVehicle: (data: {
		make: string
		model: string
		plate: string
		year?: number
		price: number
	}) => api.post<{ msg: string }>('/admin/fleet', data).then((r) => r.data),

	updateVehicle: (id: string, data: Record<string, unknown>) =>
		api.patch<{ msg: string }>(`/admin/fleet/${id}`, data).then((r) => r.data),

	deleteVehicle: (id: string) =>
		api.delete<{ msg: string }>(`/admin/fleet/${id}`).then((r) => r.data),

	updateVehicleStatus: (id: string, status: string) =>
		api.patch<{ msg: string }>(`/admin/fleet/${id}/status`, { status }).then((r) => r.data),

	// Audit Logs
	getAuditLogs: (params?: { page?: number; limit?: number; action?: string; entity?: string }) =>
		api.get<PaginatedAuditLogs>('/admin/audit-logs', { params }).then((r) => r.data),
}
