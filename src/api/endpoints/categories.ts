import { api } from '../client'

export interface Category {
	id: string
	name: string
	slug: string
	image: string | null
	cloudinaryId: string | null
	createdAt: string
}

export interface PaginatedCategories {
	categories: Category[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export const categoriesApi = {
	list: (params?: { page?: number; limit?: number }) =>
		api.get<PaginatedCategories>('/categories', { params }).then((r) => r.data),

	create: (data: { name: string; slug: string; image?: string; cloudinaryId?: string }) =>
		api.post<{ msg: string; data: Category }>('/categories', data).then((r) => r.data),

	update: (
		id: string,
		data: { name?: string; slug?: string; image?: string; cloudinaryId?: string },
	) => api.patch<{ msg: string; data: Category }>(`/categories/${id}`, data).then((r) => r.data),

	remove: (id: string) => api.delete<{ msg: string }>(`/categories/${id}`).then((r) => r.data),
}
