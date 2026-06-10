import { api } from '../client'
import type {
	LoginCredentials,
	RegisterData,
	AuthData,
	User,
	RefreshTokenData,
	ForgotPasswordData,
	ResetPasswordData,
	VerifyEmailData,
	ResendVerificationData,
	LinkGoogleData,
	LinkPasswordData,
	BecomePromoterData,
	ChangePasswordData,
	ChangeEmailData,
} from '../../types/auth'

export const authApi = {
	login: (data: LoginCredentials) => api.post<AuthData>('/auth/login', data).then((r) => r.data),

	register: (data: RegisterData) => api.post<never>('/auth/register', data).then((r) => r.data),

	googleLogin: (accessToken: string) =>
		api.post<AuthData>('/auth/google', { accessToken }).then((r) => r.data),

	me: () => api.get<User>('/auth/me').then((r) => r.data),

	refresh: (data: RefreshTokenData) =>
		api.post<AuthData>('/auth/refresh', data).then((r) => r.data),

	logout: (data: RefreshTokenData) => api.post<never>('/auth/logout', data).then((r) => r.data),

	forgotPassword: (data: ForgotPasswordData) =>
		api.post<never>('/auth/forgot-password', data).then((r) => r.data),

	resetPassword: (data: ResetPasswordData) =>
		api.post<never>('/auth/reset-password', data).then((r) => r.data),

	verifyEmail: (data: VerifyEmailData) =>
		api.post<never>('/auth/verify-email', data).then((r) => r.data),

	resendVerification: (data: ResendVerificationData) =>
		api.post<never>('/auth/resend-verification', data).then((r) => r.data),

	linkGoogle: (data: LinkGoogleData) =>
		api.post<never>('/auth/link/google', data).then((r) => r.data),

	linkPassword: (data: LinkPasswordData) =>
		api.post<never>('/auth/link/password', data).then((r) => r.data),

	becomePromoter: (data: BecomePromoterData) =>
		api.post<never>('/auth/become-promoter', data).then((r) => r.data),

	changePassword: (data: ChangePasswordData) =>
		api.post<never>('/auth/change-password', data).then((r) => r.data),

	changeEmail: (data: ChangeEmailData) =>
		api.post<never>('/auth/change-email', data).then((r) => r.data),

	updateProfile: (data: { name?: string; phoneNumber?: string; image?: string }) =>
		api.patch<never>('/auth/profile', data).then((r) => r.data),

	unlinkGoogle: () => api.post<never>('/auth/unlink/google').then((r) => r.data),
}
