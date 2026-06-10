import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../endpoints/categories'
import type { Category } from '../endpoints/categories'

export function useCategories() {
	return useQuery({
		queryKey: ['categories'],
		queryFn: () => categoriesApi.list({ limit: 50 }),
	})
}

export function useCategoryIdBySlug(slug: string | undefined): string | undefined {
	const { data } = useCategories()
	if (!slug || !data?.categories) return undefined
	const cat = data.categories.find((c: Category) => c.slug === slug)
	return cat?.id
}
