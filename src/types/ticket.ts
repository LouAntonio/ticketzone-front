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
}

export interface VerificationAddonData {
	id: string
	status: string
	addonName: string
	addonDescription: string | null
	eventTitle: string
	eventStarted: boolean
	ownerName: string
	ownerEmail: string
	entriesUsed: number
	entriesAllowed: number
}

export interface VerifyQrResponse {
	type: 'ticket' | 'addon'
	status: 'valid' | 'invalid' | 'expired'
	msg: string
	note?: string
	ticket?: VerificationTicketData | null
	addon?: VerificationAddonData | null
}

export interface ValidationResult {
	type: 'verification' | 'validation' | 'addon-verification' | 'addon-validation'
	msg: string
	note?: string
	entry?: number
	total?: number
	event?: string
	addonName?: string
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

export interface AddonInstance {
	id: string
	orderId: string
	eventId: string
	addonId: string
	ticketId?: string | null
	ownerId: string
	status: string
	qrSecret: string
	qrExpiresAt: string
	entriesUsed: number
	entriesAllowed: number
	addonName: string
	addonDescription: string | null
	unitPrice: number
	createdAt: string
	event?: {
		id: string
		title: string
		startDate: string
		bannerUrl: string | null
	}
}

export interface AddonInstanceDetail extends AddonInstance {
	validations: Array<{
		id: string
		result: string
		validatedAt: string
	}>
	event: {
		id: string
		title: string
		startDate: string
		endDate: string
		location: string
		bannerUrl: string | null
	}
	owner: {
		id: string
		name: string | null
	}
}
