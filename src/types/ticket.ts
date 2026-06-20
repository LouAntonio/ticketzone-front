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
	qrExpiresAt: string
	groupSize?: number
	used: number
	entriesAllowed: number
	status: 'active' | 'used' | 'cancelled'
	validateUntil: string
}

export interface AddonInfo {
	name: string
	quantity: number
	unitPrice: number
}

export interface VerificationTicketData {
	id: string
	status: string
	eventTitle: string
	eventStarted: boolean
	ticketType: string
	ownerName: string
	ownerEmail: string
	entriesUsed: number
	entriesAllowed: number
	isGroupTicket: boolean
	groupSize: number | null
	addons: AddonInfo[]
}

export interface VerifyQrResponse {
	type: 'verification'
	status: 'valid' | 'invalid' | 'expired'
	msg: string
	note?: string
	ticket: VerificationTicketData | null
}

export interface ValidationResult {
	type: 'verification' | 'validation'
	msg: string
	note?: string
	entry?: number
	total?: number
	event?: string
	ticket?: {
		status: string
		event: string
		ownerName: string
		entriesUsed: number
		entriesAllowed: number
	}
}

export interface RotateQrResponse {
	qrCode: string
	qrExpiresAt: string
}
