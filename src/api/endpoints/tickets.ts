import { api } from '../client'
import type { Ticket, ValidationResult } from '../../types/ticket'

export const ticketsApi = {
	list: () => api.get<{ tickets: Ticket[] }>('/api/tickets').then((r) => r.data),

	validate: (qrCode: string) =>
		api.post<ValidationResult>('/api/tickets/validate', { qrCode }).then((r) => r.data),
}
