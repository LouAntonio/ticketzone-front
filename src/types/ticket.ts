export interface Ticket {
	id: string
	orderId: string
	eventId: string
	eventTitle: string
	eventDate: string
	eventImage: string
	ticketTypeName: string
	buyerName: string
	qrCode: string
	groupSize?: number
	used: number
	status: 'active' | 'used' | 'cancelled'
	validateUntil: string
}

export interface ValidationResult {
	ticketId: string
	eventTitle: string
	ticketType: string
	buyerName: string
	status: 'valid' | 'already_used' | 'invalid' | 'expired'
	groupSize?: number
	usedCount?: number
	remaining?: number
}
