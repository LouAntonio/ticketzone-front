export type PaymentMethod = 'multicaixa' | 'paypay' | 'reference'

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled'

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
	status: OrderStatus
	paymentMethod: PaymentMethod
	paymentRef?: string
	paymentQrCode?: string
	ticketIds: string[]
	createdAt: string
}

export interface CreateOrderData {
	eventId: string
	items: OrderItem[]
	addons?: AddonItem[]
	paymentMethod: PaymentMethod
}
