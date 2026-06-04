import { create } from 'zustand'

interface CartItem {
	ticketTypeId: string
	ticketTypeName: string
	quantity: number
	unitPrice: number
	peoplePerTicket: number
}

interface CartState {
	items: CartItem[]
	eventId: string | null
	eventTitle: string
	addItem: (item: CartItem) => void
	removeItem: (ticketTypeId: string) => void
	updateQuantity: (ticketTypeId: string, quantity: number) => void
	clear: () => void
	setEvent: (eventId: string, eventTitle: string) => void
	total: () => number
	totalPeople: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
	items: [],
	eventId: null,
	eventTitle: '',

	setEvent: (eventId, eventTitle) => set({ eventId, eventTitle }),

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

	clear: () => set({ items: [], eventId: null, eventTitle: '' }),

	total: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

	totalPeople: () => get().items.reduce((sum, i) => sum + i.peoplePerTicket * i.quantity, 0),
}))
