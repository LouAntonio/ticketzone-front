import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, OrganizerProfile, UserRole } from '../types/auth'

interface AuthState {
	user: User | null
	token: string | null
	organizerProfile: OrganizerProfile | null
	setSession: (token: string, user: User, organizerProfile?: OrganizerProfile) => void
	clear: () => void
	isAuthenticated: () => boolean
	hasRole: (role: UserRole) => boolean
	isOrganizer: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			organizerProfile: null,

			setSession: (token, user, organizerProfile) =>
				set({ token, user, organizerProfile: organizerProfile ?? null }),

			clear: () => set({ user: null, token: null, organizerProfile: null }),

			isAuthenticated: () => !!get().token && !!get().user,

			hasRole: (role) => get().user?.role === role,

			isOrganizer: () => get().user?.role === 'organizer',
		}),
		{
			name: '@ticketzone:auth',
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				organizerProfile: state.organizerProfile,
			}),
		},
	),
)
