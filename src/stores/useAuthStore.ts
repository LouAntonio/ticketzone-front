import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
	name: string
	email: string
	picture?: string
}

type AuthState = {
	user: User | null
	token: string | null
	setSession: (token: string, user: User) => void
	clear: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			setSession: (token, user) => set({ token, user }),
			clear: () => set({ token: null, user: null }),
		}),
		{ name: '@ticketzone:auth' },
	),
)
