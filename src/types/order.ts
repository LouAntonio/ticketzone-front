export type PaymentMethod = 'multicaixa' | 'paypay' | 'reference'

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'

export interface OrderItem {
	ticketTypeId: string
	ticketTypeName: string
	quantity: number
	unitPrice: number
	peoplePerTicket: number
}

export interface AddonItem {
	addonId: string
	name: string
	quantity: number
	unitPrice: number
}

export interface Order {
	id: string
	eventId: string
	eventTitle: string
	eventSlug: string
	eventDate: string
	eventImage: string
	buyerId: string
	buyerName: string
	items: OrderItem[]
	addons?: AddonItem[]
	total: number
	status: string
	paymentMethod: PaymentMethod
	paymentStatus?: PaymentStatus
	paymentRef?: string
	paymentQrCode?: string
	ticketIds: string[]
	createdAt: string
}

export interface OrderDetail extends Order {
	tickets?: Array<{
		id: string
		qrCode: string
		status: string
		ticketTypeName: string
		entriesUsed: number
		entriesAllowed: number
	}>
	eventProvince?: string
	eventVenue?: string
	eventAddress?: string
	eventStartDate?: string
	eventEndDate?: string
	userPhoneNumber?: string
	userEmail?: string
}

export interface CreateOrderData {
	eventId: string
	items: OrderItem[]
	addons?: AddonItem[]
	paymentMethod: PaymentMethod
}
