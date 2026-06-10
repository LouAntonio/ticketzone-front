import { create } from 'zustand'

interface CartItem {
	ticketTypeId: string
	ticketTypeName: string
	quantity: number
	unitPrice: number
	peoplePerTicket: number
}

interface CartAddon {
	addonId: string
	name: string
	quantity: number
	unitPrice: number
}

interface CartState {
	items: CartItem[]
	addons: CartAddon[]
	eventId: string | null
	eventTitle: string
	addItem: (item: CartItem) => void
	removeItem: (ticketTypeId: string) => void
	updateQuantity: (ticketTypeId: string, quantity: number) => void
	addAddon: (addon: CartAddon) => void
	removeAddon: (addonId: string) => void
	updateAddonQuantity: (addonId: string, quantity: number) => void
	clear: () => void
	setEvent: (eventId: string, eventTitle: string) => void
	total: () => number
	totalPeople: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
	items: [],
	addons: [],
	eventId: null,
	eventTitle: '',

	setEvent: (eventId, eventTitle) => set({ eventId, eventTitle, items: [], addons: [] }),

	addItem: (item) =>
		set((state) => {
			const existing = state.items.find((i) => i.ticketTypeId === item.ticketTypeId)
			if (existing) {
				return {
					items: state.items.map((i) =>
						i.ticketTypeId === item.ticketTypeId
							? { ...i, quantity: i.quantity + item.quantity }
							: i,
					),
				}
			}
			return { items: [...state.items, item] }
		}),

	removeItem: (ticketTypeId) =>
		set((state) => ({
			items: state.items.filter((i) => i.ticketTypeId !== ticketTypeId),
		})),

	updateQuantity: (ticketTypeId, quantity) =>
		set((state) => {
			if (quantity <= 0) {
				return {
					items: state.items.filter((i) => i.ticketTypeId !== ticketTypeId),
				}
			}
			return {
				items: state.items.map((i) =>
					i.ticketTypeId === ticketTypeId ? { ...i, quantity } : i,
				),
			}
		}),

	addAddon: (addon) =>
		set((state) => {
			const existing = state.addons.find((a) => a.addonId === addon.addonId)
			if (existing) {
				return {
					addons: state.addons.map((a) =>
						a.addonId === addon.addonId
							? { ...a, quantity: a.quantity + addon.quantity }
							: a,
					),
				}
			}
			return { addons: [...state.addons, addon] }
		}),

	removeAddon: (addonId) =>
		set((state) => ({
			addons: state.addons.filter((a) => a.addonId !== addonId),
		})),

	updateAddonQuantity: (addonId, quantity) =>
		set((state) => {
			if (quantity <= 0) {
				return {
					addons: state.addons.filter((a) => a.addonId !== addonId),
				}
			}
			return {
				addons: state.addons.map((a) => (a.addonId === addonId ? { ...a, quantity } : a)),
			}
		}),

	clear: () => set({ items: [], addons: [], eventId: null, eventTitle: '' }),

	total: () => {
		const state = get()
		const itemsTotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
		const addonsTotal = state.addons.reduce((sum, a) => sum + a.unitPrice * a.quantity, 0)
		return itemsTotal + addonsTotal
	},

	totalPeople: () => get().items.reduce((sum, i) => sum + i.peoplePerTicket * i.quantity, 0),
}))
