import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole, OrganizerProfile } from '../types/auth'

interface AuthState {
	user: User | null
	token: string | null
	refreshToken: string | null
	organizerProfile: OrganizerProfile | null

	setSession: (
		accessToken: string,
		refreshToken: string,
		user: User,
		organizerProfile?: OrganizerProfile,
	) => void
	setAccessToken: (accessToken: string) => void
	setUser: (user: User | null) => void
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

			setSession: (accessToken, refreshToken, user, organizerProfile) =>
				set({
					token: accessToken,
					refreshToken,
					user,
					organizerProfile: organizerProfile ?? null,
				}),

			setAccessToken: (accessToken) => set({ token: accessToken }),

			setUser: (user) => set({ user }),

			clear: () =>
				set({ user: null, token: null, refreshToken: null, organizerProfile: null }),

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
			}),
		},
	),
)
