import { http, HttpResponse, delay } from 'msw'
import { db } from './db'
import type { Event } from '../../types/event'

const API = 'http://localhost:3000/api'

let tokenCounter = 1000
let orderCounter = 100
let ticketCounter = 100

function generateToken(): string {
	return `tkn_mock_${++tokenCounter}`
}

function findUserByEmail(email: string) {
	return db.users.find((u) => u.email === email) ?? null
}

function authHeader(request: Request) {
	const auth = request.headers.get('Authorization')
	if (!auth?.startsWith('Bearer ')) return null
	const token = auth.slice(7)
	for (const [userId, t] of db.tokens) {
		if (t === token) return userId
	}
	return null
}

function filterEvents(params: URLSearchParams): Event[] {
	let list = db.events.filter((e) => e.status === 'published')
	const category = params.get('category')
	const province = params.get('province')
	const period = params.get('period')
	const search = params.get('search')
	if (category) list = list.filter((e) => e.category === category)
	if (province) list = list.filter((e) => e.province === province)
	if (period) list = list.filter((e) => e.period === period)
	if (search) {
		const q = search.toLowerCase()
		list = list.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				e.description.toLowerCase().includes(q) ||
				e.venue.toLowerCase().includes(q),
		)
	}
	return list
}

export const handlers = [
	// --- Auth ---
	http.post(`${API}/auth/login`, async ({ request }) => {
		await delay(600)
		const body = (await request.json()) as { email: string; password: string }
		const user = findUserByEmail(body.email)
		if (!user) {
			return HttpResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
		}
		const token = generateToken()
		db.tokens.set(user.id, token)
		const organizerProfile = db.organizers.find((o) => o.userId === user.id)
		return HttpResponse.json({ token, user, organizerProfile })
	}),

	http.post(`${API}/auth/register`, async ({ request }) => {
		await delay(800)
		const body = (await request.json()) as {
			name: string
			email: string
			password: string
			phone?: string
			role: string
			companyName?: string
			document?: string
		}
		if (findUserByEmail(body.email)) {
			return HttpResponse.json({ error: 'Email já registado' }, { status: 409 })
		}
		const user = {
			id: `user-${Date.now()}`,
			name: body.name,
			email: body.email,
			phone: body.phone,
			role: body.role as 'buyer' | 'organizer',
			createdAt: new Date().toISOString(),
		}
		db.users.push(user)
		const token = generateToken()
		db.tokens.set(user.id, token)

		let organizerProfile = undefined
		if (body.role === 'organizer') {
			organizerProfile = {
				id: `org-${Date.now()}`,
				userId: user.id,
				companyName: body.companyName,
				document: body.document ?? '',
				bankName: '',
				bankAccount: '',
				bankHolder: body.name,
				balance: 0,
			}
			db.organizers.push(organizerProfile)
		}

		return HttpResponse.json({ token, user, organizerProfile })
	}),

	http.post(`${API}/auth/google`, async ({ request }) => {
		await delay(600)
		const body = (await request.json()) as { credential: string }
		if (!body.credential) {
			return HttpResponse.json({ error: 'Credencial inválida' }, { status: 401 })
		}
		const mockGoogleUser = {
			id: `user-google-${Date.now()}`,
			name: 'Utilizador Google',
			email: `user${Date.now()}@gmail.com`,
			picture: '',
			role: 'buyer' as const,
			createdAt: new Date().toISOString(),
		}
		db.users.push(mockGoogleUser)
		const token = generateToken()
		db.tokens.set(mockGoogleUser.id, token)
		return HttpResponse.json({ token, user: mockGoogleUser })
	}),

	http.get(`${API}/auth/me`, async ({ request }) => {
		await delay(300)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const user = db.users.find((u) => u.id === userId)
		if (!user) {
			return HttpResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
		}
		const organizerProfile = db.organizers.find((o) => o.userId === userId)
		return HttpResponse.json({ user, organizerProfile })
	}),

	// --- Events ---
	http.get(`${API}/events`, async ({ request }) => {
		await delay(400)
		const url = new URL(request.url)
		const filtered = filterEvents(url.searchParams)
		return HttpResponse.json({ events: filtered, total: filtered.length })
	}),

	http.get(`${API}/events/featured`, async () => {
		await delay(300)
		return HttpResponse.json({
			events: db.events.filter((e) => e.featured && e.status === 'published'),
		})
	}),

	http.get(`${API}/events/:slug`, async ({ params }) => {
		await delay(300)
		const event = db.events.find((e) => e.slug === params.slug)
		if (!event) {
			return HttpResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
		}
		return HttpResponse.json({ event })
	}),

	http.get(`${API}/organizer/events`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const organizer = db.organizers.find((o) => o.userId === userId)
		if (!organizer) {
			return HttpResponse.json({ error: 'Não é organizador' }, { status: 403 })
		}
		const events = db.events.filter((e) => e.organizerId === organizer.id)
		return HttpResponse.json({ events })
	}),

	http.post(`${API}/organizer/events`, async ({ request }) => {
		await delay(700)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const body = (await request.json()) as Partial<Event>
		const event: Event = {
			id: `evt-${Date.now()}`,
			title: body.title ?? '',
			slug: (body.title ?? '')
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)+/g, ''),
			description: body.description ?? '',
			shortDescription: body.shortDescription ?? '',
			coverImage: body.coverImage ?? '',
			category: body.category ?? 'conference',
			province: body.province ?? '',
			date: body.date ?? '',
			time: body.time ?? '',
			period: body.period ?? 'night',
			venue: body.venue ?? '',
			address: body.address ?? '',
			organizerId: userId,
			organizerName: '',
			ticketTypes: body.ticketTypes ?? [],
			status: 'draft',
			createdAt: new Date().toISOString(),
		}
		const user = db.users.find((u) => u.id === userId)
		if (user) event.organizerName = user.name
		db.events.push(event)
		return HttpResponse.json({ event })
	}),

	http.put(`${API}/organizer/events/:id`, async ({ params, request }) => {
		await delay(500)
		const body = (await request.json()) as Partial<Event>
		const idx = db.events.findIndex((e) => e.id === params.id)
		if (idx === -1) {
			return HttpResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
		}
		db.events[idx] = { ...db.events[idx], ...body }
		return HttpResponse.json({ event: db.events[idx] })
	}),

	http.get(`${API}/organizer/events/:id/sales`, async ({ params }) => {
		await delay(500)
		const eventOrders = db.orders.filter((o) => o.eventId === params.id)
		const totalSold = eventOrders
			.filter((o) => o.status === 'confirmed')
			.reduce((sum, o) => sum + o.total, 0)
		const totalTickets = eventOrders
			.filter((o) => o.status === 'confirmed')
			.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
		return HttpResponse.json({
			totalSold,
			totalTickets,
			ordersCount: eventOrders.length,
			orders: eventOrders,
		})
	}),

	http.get(`${API}/organizer/sales`, async ({ request }) => {
		await delay(500)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const organizer = db.organizers.find((o) => o.userId === userId)
		if (!organizer) {
			return HttpResponse.json({ error: 'Não é organizador' }, { status: 403 })
		}
		const events = db.events.filter((e) => e.organizerId === organizer.id)
		const eventIds = events.map((e) => e.id)
		const allOrders = db.orders.filter((o) => eventIds.includes(o.eventId))
		const confirmedOrders = allOrders.filter((o) => o.status === 'confirmed')
		const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0)
		return HttpResponse.json({
			totalRevenue,
			totalOrders: confirmedOrders.length,
			totalTickets: confirmedOrders.reduce(
				(sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
				0,
			),
			balance: organizer.balance,
			orders: allOrders,
		})
	}),

	http.get(`${API}/organizer/attendees`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const organizer = db.organizers.find((o) => o.userId === userId)
		if (!organizer) {
			return HttpResponse.json({ error: 'Não é organizador' }, { status: 403 })
		}
		const events = db.events.filter((e) => e.organizerId === organizer.id)
		const eventIds = events.map((e) => e.id)
		const confirmedOrders = db.orders.filter(
			(o) => eventIds.includes(o.eventId) && o.status === 'confirmed',
		)
		return HttpResponse.json({ attendees: confirmedOrders })
	}),

	// --- Orders ---
	http.post(`${API}/orders`, async ({ request }) => {
		await delay(1200)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const body = (await request.json()) as {
			eventId: string
			items: Array<{
				ticketTypeId: string
				ticketTypeName: string
				quantity: number
				unitPrice: number
				peoplePerTicket: number
			}>
			paymentMethod: string
		}
		const event = db.events.find((e) => e.id === body.eventId)
		if (!event) {
			return HttpResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
		}
		const user = db.users.find((u) => u.id === userId)

		const ticketIds: string[] = []
		for (const item of body.items) {
			for (let i = 0; i < item.quantity; i++) {
				ticketIds.push(`ticket-${++ticketCounter}`)
				db.tickets.push({
					id: `ticket-${ticketCounter}`,
					orderId: `ord-${++orderCounter}`,
					eventId: event.id,
					eventTitle: event.title,
					eventDate: event.date,
					eventImage: event.coverImage,
					ticketTypeName: item.ticketTypeName,
					buyerName: user?.name ?? '',
					qrCode: `TICKET-${event.id.toUpperCase()}-${String(ticketCounter).padStart(3, '0')}`,
					groupSize: item.peoplePerTicket > 1 ? item.peoplePerTicket : undefined,
					status: 'active',
					used: 0,
					validateUntil: new Date(
						new Date(event.date).getTime() + 86400000,
					).toISOString(),
				})
			}
		}

		const total = body.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

		const order = {
			id: `ord-${orderCounter}`,
			eventId: event.id,
			eventTitle: event.title,
			eventSlug: event.slug,
			eventDate: event.date,
			eventImage: event.coverImage,
			buyerId: userId,
			buyerName: user?.name ?? '',
			items: body.items,
			total,
			status: 'pending' as const,
			paymentMethod: body.paymentMethod as 'multicaixa' | 'paypay' | 'reference',
			paymentRef:
				body.paymentMethod === 'multicaixa'
					? `MCX-2025-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
					: body.paymentMethod === 'reference'
						? `REF-${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}`
						: undefined,
			paymentQrCode: body.paymentMethod === 'paypay' ? `paypay-qr-${Date.now()}` : undefined,
			ticketIds,
			createdAt: new Date().toISOString(),
		}
		db.orders.push(order)

		// Simulate payment confirmation after a bit
		setTimeout(() => {
			const ord = db.orders.find((o) => o.id === order.id)
			if (ord) ord.status = 'confirmed'
		}, 3000)

		return HttpResponse.json({ order })
	}),

	http.get(`${API}/orders`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const userOrders = db.orders
			.filter((o) => o.buyerId === userId)
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		return HttpResponse.json({ orders: userOrders })
	}),

	// --- Tickets ---
	http.get(`${API}/tickets`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const userOrders = db.orders.filter((o) => o.buyerId === userId)
		const userTicketIds = userOrders.flatMap((o) => o.ticketIds)
		const userTickets = db.tickets.filter((t) => userTicketIds.includes(t.id))
		return HttpResponse.json({ tickets: userTickets })
	}),

	http.post(`${API}/tickets/validate`, async ({ request }) => {
		await delay(500)
		const body = (await request.json()) as { qrCode: string }
		const ticket = db.tickets.find((t) => t.qrCode === body.qrCode)
		if (!ticket) {
			return HttpResponse.json({ status: 'invalid', error: 'Bilhete não encontrado' })
		}
		const event = db.events.find((e) => e.id === ticket.eventId)
		if (new Date(event?.date ?? 0) > new Date()) {
			return HttpResponse.json({
				ticketId: ticket.id,
				eventTitle: ticket.eventTitle,
				ticketType: ticket.ticketTypeName,
				buyerName: ticket.buyerName,
				status: 'invalid',
				error: 'Evento ainda não começou',
			})
		}
		if (ticket.status !== 'active') {
			return HttpResponse.json({
				ticketId: ticket.id,
				eventTitle: ticket.eventTitle,
				ticketType: ticket.ticketTypeName,
				buyerName: ticket.buyerName,
				status: 'already_used',
			})
		}
		if (new Date(ticket.validateUntil) < new Date()) {
			return HttpResponse.json({
				ticketId: ticket.id,
				eventTitle: ticket.eventTitle,
				ticketType: ticket.ticketTypeName,
				buyerName: ticket.buyerName,
				status: 'expired',
			})
		}

		if (ticket.groupSize && ticket.groupSize > 1) {
			if (ticket.used < ticket.groupSize) {
				ticket.used++
				const remaining = ticket.groupSize - ticket.used
				if (ticket.used >= ticket.groupSize) {
					ticket.status = 'used'
				}
				return HttpResponse.json({
					ticketId: ticket.id,
					eventTitle: ticket.eventTitle,
					ticketType: ticket.ticketTypeName,
					buyerName: ticket.buyerName,
					status: 'valid',
					groupSize: ticket.groupSize,
					usedCount: ticket.used,
					remaining,
				})
			}
			return HttpResponse.json({
				ticketId: ticket.id,
				eventTitle: ticket.eventTitle,
				ticketType: ticket.ticketTypeName,
				buyerName: ticket.buyerName,
				status: 'already_used',
			})
		}

		ticket.status = 'used'
		ticket.used = 1
		return HttpResponse.json({
			ticketId: ticket.id,
			eventTitle: ticket.eventTitle,
			ticketType: ticket.ticketTypeName,
			buyerName: ticket.buyerName,
			status: 'valid',
		})
	}),

	// --- Admin ---
	http.get(`${API}/admin/stats`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		const totalOrders = db.orders.length
		const confirmedOrders = db.orders.filter((o) => o.status === 'confirmed')
		const totalRevenue = confirmedOrders.reduce((s, o) => s + o.total, 0)
		const totalCommissions = Math.round(totalRevenue * 0.1)
		const totalTicketsSold = confirmedOrders.reduce(
			(s, o) => s + o.items.reduce((s2, i) => s2 + i.quantity, 0),
			0,
		)
		const pendingOrders = db.orders.filter((o) => o.status === 'pending').length

		const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
		const revenueByMonth = months.map((month, idx) => {
			const base = totalRevenue / 6
			const variation = Math.sin((idx + 1) * 1.2) * base * 0.3
			return { month, revenue: Math.round(base + variation) }
		})

		return HttpResponse.json({
			totalUsers: db.users.length,
			totalOrganizers: db.organizers.length,
			totalEvents: db.events.length,
			totalOrders,
			totalRevenue,
			totalCommissions,
			totalTicketsSold,
			totalCars: db.cars.length,
			pendingOrders,
			recentOrders: db.orders
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
				.slice(0, 5)
				.map((o) => ({
					id: o.id,
					eventTitle: o.eventTitle,
					buyerName: o.buyerName,
					total: o.total,
					status: o.status,
					paymentMethod: o.paymentMethod,
					createdAt: o.createdAt,
					commission: Math.round(o.total * 0.1),
				})),
			revenueByMonth,
		})
	}),

	http.get(`${API}/admin/users`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		return HttpResponse.json({
			users: db.users.map((u) => {
				const org = db.organizers.find((o) => o.userId === u.id)
				return {
					id: u.id,
					name: u.name,
					email: u.email,
					phone: u.phone,
					role: u.role,
					createdAt: u.createdAt,
					organizerCompany: org?.companyName,
				}
			}),
		})
	}),

	http.get(`${API}/admin/events`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		return HttpResponse.json({
			events: db.events.map((e) => {
				const eventOrders = db.orders.filter(
					(o) => o.eventId === e.id && o.status === 'confirmed',
				)
				const ticketsSold = eventOrders.reduce(
					(s, o) => s + o.items.reduce((s2, i) => s2 + i.quantity, 0),
					0,
				)
				const revenue = eventOrders.reduce((s, o) => s + o.total, 0)
				return {
					id: e.id,
					title: e.title,
					category: e.category,
					province: e.province,
					date: e.date,
					status: e.status,
					organizerName: e.organizerName,
					ticketsSold,
					revenue,
				}
			}),
		})
	}),

	http.get(`${API}/admin/orders`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		return HttpResponse.json({
			orders: db.orders.map((o) => ({
				id: o.id,
				eventTitle: o.eventTitle,
				buyerName: o.buyerName,
				total: o.total,
				status: o.status,
				paymentMethod: o.paymentMethod,
				createdAt: o.createdAt,
				commission: Math.round(o.total * 0.1),
			})),
		})
	}),

	http.get(`${API}/admin/organizers`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		return HttpResponse.json({
			organizers: db.organizers.map((org) => {
				const owner = db.users.find((u) => u.id === org.userId)
				const orgEvents = db.events.filter((e) => e.organizerId === org.id)
				const totalRevenue = db.orders
					.filter(
						(o) =>
							orgEvents.some((e) => e.id === o.eventId) && o.status === 'confirmed',
					)
					.reduce((s, o) => s + o.total, 0)
				return {
					id: org.id,
					userId: org.userId,
					companyName: org.companyName ?? '',
					ownerName: owner?.name ?? '',
					document: org.document,
					bankName: org.bankName,
					balance: org.balance,
					eventsCount: orgEvents.length,
					totalRevenue,
				}
			}),
		})
	}),

	http.get(`${API}/admin/financial`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		const confirmedOrders = db.orders.filter((o) => o.status === 'confirmed')
		const totalRevenue = confirmedOrders.reduce((s, o) => s + o.total, 0)
		const totalCommissions = Math.round(totalRevenue * 0.1)
		const totalPayouts = Math.round(totalRevenue * 0.85)
		const pendingOrders = db.orders.filter((o) => o.status === 'pending')
		const pendingRevenue = pendingOrders.reduce((s, o) => s + o.total, 0)
		const pendingPayouts = Math.round(pendingRevenue * 0.9)
		const averageCommission =
			db.orders.length > 0 ? Math.round(totalCommissions / db.orders.length) : 0

		return HttpResponse.json({
			totalRevenue,
			totalCommissions,
			totalPayouts,
			pendingPayouts,
			organizersCount: db.organizers.length,
			averageCommission,
		})
	}),

	http.get(`${API}/admin/fleet`, async ({ request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		return HttpResponse.json({
			cars: db.cars.map((c) => ({
				id: c.id,
				make: c.make,
				model: c.model,
				year: c.year,
				pricePerDay: c.pricePerDay,
				transmission: c.transmission,
				seats: c.seats,
				fuelType: c.fuelType,
				available: c.available,
				location: c.location,
			})),
		})
	}),

	http.put(`${API}/admin/events/:id/status`, async ({ params, request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		const body = (await request.json()) as { status: string }
		const idx = db.events.findIndex((e) => e.id === params.id)
		if (idx === -1)
			return HttpResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
		db.events[idx].status = body.status as 'draft' | 'published' | 'cancelled' | 'completed'
		return HttpResponse.json({ event: db.events[idx] })
	}),

	http.put(`${API}/admin/users/:id/role`, async ({ params, request }) => {
		await delay(400)
		const userId = authHeader(request)
		if (!userId) return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		const user = db.users.find((u) => u.id === userId)
		if (user?.role !== 'admin')
			return HttpResponse.json({ error: 'Não autorizado' }, { status: 403 })

		const body = (await request.json()) as { role: string }
		const idx = db.users.findIndex((u) => u.id === params.id)
		if (idx === -1)
			return HttpResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
		db.users[idx].role = body.role as 'buyer' | 'organizer' | 'admin'
		return HttpResponse.json({ user: db.users[idx] })
	}),

	// --- Rentals ---
	http.get(`${API}/rentals/cars`, async () => {
		await delay(400)
		return HttpResponse.json({ cars: db.cars })
	}),

	http.get(`${API}/rentals/cars/:id`, async ({ params }) => {
		await delay(300)
		const car = db.cars.find((c) => c.id === params.id)
		if (!car) {
			return HttpResponse.json({ error: 'Viatura não encontrada' }, { status: 404 })
		}
		return HttpResponse.json({ car })
	}),

	// --- Organizer Settings ---
	http.put(`${API}/organizer/settings`, async ({ request }) => {
		await delay(500)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const body = (await request.json()) as {
			companyName?: string
			bankName?: string
			bankAccount?: string
			bankHolder?: string
		}
		const organizer = db.organizers.find((o) => o.userId === userId)
		if (!organizer) {
			return HttpResponse.json({ error: 'Não é organizador' }, { status: 403 })
		}
		Object.assign(organizer, body)
		return HttpResponse.json({ organizer })
	}),

	// --- Rental bookings ---
	http.post(`${API}/rentals/bookings`, async ({ request }) => {
		await delay(800)
		const userId = authHeader(request)
		if (!userId) {
			return HttpResponse.json({ error: 'Não autenticado' }, { status: 401 })
		}
		const body = (await request.json()) as {
			carId: string
			startDate: string
			endDate: string
		}
		const car = db.cars.find((c) => c.id === body.carId)
		if (!car) {
			return HttpResponse.json({ error: 'Viatura não encontrada' }, { status: 404 })
		}
		const days = Math.ceil(
			(new Date(body.endDate).getTime() - new Date(body.startDate).getTime()) / 86400000,
		)
		return HttpResponse.json({
			booking: {
				id: `bk-${Date.now()}`,
				carId: body.carId,
				userId,
				startDate: body.startDate,
				endDate: body.endDate,
				totalDays: days,
				totalPrice: days * car.pricePerDay,
				status: 'confirmed',
			},
		})
	}),
]
