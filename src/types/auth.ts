export type UserRole = 'USER' | 'PROMOTER' | 'STAFF' | 'ADMIN'

export interface LinkedAccount {
	providerId: string
	accountId: string
	createdAt: string
}

export interface User {
	id: string
	name: string
	email: string
	emailVerified: boolean
	image?: string
	role: UserRole
	phoneNumber?: string
	createdAt: string
	updatedAt?: string
	hasPassword: boolean
	accounts?: LinkedAccount[]
}

export interface PromoterRequest {
	id?: string
	companyName: string
	nif?: string
	iban?: string
	verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
	status?: 'ACTIVE' | 'BANNED'
	personalDocs?: DocFile[]
	enterpriseDocs?: DocFile[]
	createdAt?: string
}

export interface DocFile {
	url: string
	idcloudinary: string
}

export interface AuthTokens {
	accessToken: string
	refreshToken: string
}

export interface AuthData {
	accessToken: string
	refreshToken: string
	user: User
}

export interface ApiResponse<T = unknown> {
	success: boolean
	msg: string
	data?: T
}

// --- DTOs ---

export interface LoginCredentials {
	email: string
	password: string
}

export interface RegisterData {
	name?: string
	email: string
	password: string
	phone?: string
}

export interface GoogleLoginData {
	idToken: string
}

export interface RefreshTokenData {
	refreshToken: string
}

export interface ForgotPasswordData {
	email: string
}

export interface ResetPasswordData {
	token: string
	password: string
}

export interface VerifyEmailData {
	token: string
}

export interface ResendVerificationData {
	email: string
}

export interface LinkGoogleData {
	idToken: string
}

export interface LinkPasswordData {
	password: string
}

export interface ChangePasswordData {
	currentPassword: string
	newPassword: string
}

export interface ChangeEmailData {
	newEmail: string
	password: string
}

export interface BecomePromoterData {
	companyName: string
	nif?: string
	iban?: string
	personalDocs?: DocFile[]
	enterpriseDocs?: DocFile[]
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

export interface OrganizerRegisterData extends RegisterData {
	companyName?: string
	document: string
	role: 'organizer'
}
