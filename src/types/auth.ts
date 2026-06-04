export type UserRole = 'buyer' | 'organizer' | 'admin'

export interface User {
	id: string
	name: string
	email: string
	phone?: string
	picture?: string
	role: UserRole
	createdAt: string
}

export interface OrganizerProfile {
	id: string
	userId: string
	companyName?: string
	document: string
	bankName: string
	bankAccount: string
	bankHolder: string
	balance: number
}

export interface LoginCredentials {
	email: string
	password: string
}

export interface RegisterData {
	name: string
	email: string
	password: string
	phone?: string
	role: UserRole
	companyName?: string
	document?: string
}

export interface AuthResponse {
	token: string
	user: User
	organizerProfile?: OrganizerProfile
}

export interface OrganizerRegisterData extends RegisterData {
	companyName?: string
	document: string
	role: 'organizer'
}
