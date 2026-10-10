/**
 * Métodos de pagamento suportados.
 *
 * - `multicaixa` → Multicaixa Express (GPO) via AppyPay
 * - `reference`  → Referência Multicaixa (REF) via AppyPay
 *
 * PayPay foi removido: não é suportado pela AppyPay.
 */
export type PaymentMethod = 'multicaixa' | 'reference'

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
	totalAmount: number
	status: string
	paymentMethod: PaymentMethod
	paymentStatus?: PaymentStatus
	paymentRef?: string
	ticketIds: string[]
	createdAt: string
}

/** Referência bancária devolvida pela AppyPay para o método Referência. */
export interface PaymentReference {
	referenceNumber: string
	entity?: string | null
	dueDate?: string | null
}

/** Instruções de pagamento devolvidas pelo backend (AppyPay). */
export interface PaymentInstructions {
	orderId: string
	method: 'MULTICAIXA_EXPRESS' | 'MULTICAIXA_REFERENCE' | null
	chargeId: string | null
	status: OrderStatus
	paymentStatus: PaymentStatus
	reference: PaymentReference | null
	phoneNumber: string | null
	expiresAt: string | null
}

export interface CreateOrderResult {
	order: Order
	payment: PaymentInstructions
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
	addonInstances?: Array<{
		id: string
		addonId: string
		status: string
		qrSecret: string
		qrExpiresAt: string
		entriesUsed: number
		entriesAllowed: number
		addon: { name: string }
	}>
	rentals?: Array<{
		id: string
		vehicleId: string
		startDate?: string
		endDate?: string
		totalDays: number
		totalPrice: number
		vehicle: {
			make: string
			model: string
			plate: string
			photos: string[]
		}
	}>
	eventProvince?: string
	eventVenue?: string
	eventAddress?: string
	eventStartDate?: string
	eventEndDate?: string
	userPhoneNumber?: string
	userEmail?: string
	/** Dados bancários para pagamento por referência. */
	paymentReference?: PaymentReference
	multicaixaEntity?: string | null
	paymentDueDate?: string | null
}

export interface CreateOrderData {
	eventId: string
	items: OrderItem[]
	addons?: AddonItem[]
	paymentMethod: PaymentMethod
	/** Obrigatório para Multicaixa Express. Nunca é guardado no perfil. */
	phoneNumber?: string
}
