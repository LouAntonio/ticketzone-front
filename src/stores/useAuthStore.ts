import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole, OrganizerProfile } from '../types/auth'

export interface LastGoogleAccount {
	email: string
	name: string
	picture: string
}

interface AuthState {
	user: User | null
	token: string | null
	refreshToken: string | null
	organizerProfile: OrganizerProfile | null
	lastGoogleAccount: LastGoogleAccount | null

	setSession: (
		accessToken: string,
		refreshToken: string,
		user: User,
		organizerProfile?: OrganizerProfile,
	) => void
	setAccessToken: (accessToken: string) => void
	setUser: (user: User | null) => void
	setLastGoogleAccount: (account: LastGoogleAccount | null) => void
	clear: () => void
	isAuthenticated: () => boolean
	hasRole: (role: UserRole) => boolean
	isOrganizer: () => boolean
	isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			refreshToken: null,
			organizerProfile: null,
			lastGoogleAccount: null,

			setSession: (accessToken, refreshToken, user, organizerProfile) =>
				set({
					token: accessToken,
					refreshToken,
					user,
					organizerProfile: organizerProfile ?? null,
				}),

			setAccessToken: (accessToken) => set({ token: accessToken }),

			setUser: (user) =>
		set((state) => ({
			user,
			organizerProfile: user?.promoter
				? {
						id: user.promoter.id ?? state.organizerProfile?.id ?? '',
						userId: user.id,
						companyName: user.promoter.companyName,
						nif: user.promoter.nif,
						iban: user.promoter.iban,
						promoterType: user.promoter.promoterType,
						logo: user.promoter.logo,
						banner: user.promoter.banner,
						isVerified: user.promoter.verificationStatus === 'VERIFIED',
						verificationStatus: user.promoter.verificationStatus,
						status: (user.promoter.status as 'ACTIVE' | 'BANNED') ?? 'ACTIVE',
						balance: user.promoter.balance ?? 0,
						createdAt: user.promoter.createdAt,
					}
				: state.organizerProfile,
		})),

			setLastGoogleAccount: (account) => set({ lastGoogleAccount: account }),

			clear: () =>
				set({
					user: null,
					token: null,
					refreshToken: null,
					organizerProfile: null,
					lastGoogleAccount: null,
				}),

			isAuthenticated: () => !!get().token && !!get().user,

			hasRole: (role) => get().user?.role === role,

			isOrganizer: () => get().user?.role === 'PROMOTER',

			isAdmin: () => get().user?.role === 'ADMIN',
		}),
		{
			name: '@ticketzone:auth',
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				refreshToken: state.refreshToken,
				organizerProfile: state.organizerProfile,
				lastGoogleAccount: state.lastGoogleAccount,
			}),
		},
	),
)
