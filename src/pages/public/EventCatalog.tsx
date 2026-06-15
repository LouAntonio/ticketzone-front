import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvents } from '../../api/hooks/useEvents'
import { useCategories } from '../../api/hooks/useCategories'
import { EventCard } from '../../components/shared/EventCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { EventsSidebar } from '../../components/events/EventsSidebar'
import type { EventFilters, CategoryInfo } from '../../types/event'

function parseFiltersFromParams(params: URLSearchParams): Partial<EventFilters> {
	const filters: Partial<EventFilters> = {}
	const search = params.get('search')
	const province = params.get('province')
	const period = params.get('period')
	const featured = params.get('featured')
	const page = params.get('page')
	const categoryIds = params.getAll('categoryIds')

	if (search) filters.search = search
	if (province) filters.province = province
	if (period) filters.period = period as EventFilters['period']
	if (featured === 'true') filters.featured = true
	if (page) filters.page = Number(page)
	if (categoryIds.length > 0) filters.categoryIds = categoryIds
	return filters
}

function resolveLegacyCategoryParam(
	params: URLSearchParams,
	categories: CategoryInfo[],
): string[] | undefined {
	const categoryIds = params.getAll('categoryIds')
	if (categoryIds.length > 0) return undefined
	const legacyCategory = params.get('category')
	if (!legacyCategory || categories.length === 0) return undefined
	const found = categories.find((c) => c.slug === legacyCategory)
	return found ? [found.id] : undefined
}

function filtersToParams(filters: Partial<EventFilters>): URLSearchParams {
	const params = new URLSearchParams()
	if (filters.search) params.set('search', filters.search)
	if (filters.province) params.set('province', filters.province)
	if (filters.period) params.set('period', filters.period)
	if (filters.featured) params.set('featured', 'true')
	if (filters.page && filters.page > 1) params.set('page', String(filters.page))
	if (filters.categoryIds?.length) {
		for (const id of filters.categoryIds) {
			params.append('categoryIds', id)
		}
	}
	return params
}

export function EventCatalog() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { data: categoriesData } = useCategories()
	const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData])
	const legacyResolved = useRef(false)

	const appliedFilters = useMemo(() => {
		const raw = parseFiltersFromParams(searchParams)
		const resolved = resolveLegacyCategoryParam(searchParams, categories)
		if (resolved) {
			return { ...raw, categoryIds: resolved, page: 1 }
		}
		return raw
	}, [searchParams, categories])

	// Sync URL when legacy ?category=slug param is resolved
	useEffect(() => {
		if (legacyResolved.current) return
		if (categories.length === 0) return
		const resolved = resolveLegacyCategoryParam(searchParams, categories)
		if (resolved) {
			legacyResolved.current = true
			setSearchParams(
				filtersToParams({ ...appliedFilters, categoryIds: resolved, page: 1 }),
				{ replace: true },
			)
		} else {
			legacyResolved.current = true
		}
	}, [categories, searchParams, appliedFilters, setSearchParams])

	const { data, isLoading } = useEvents(appliedFilters)

	const page = appliedFilters.page ?? 1
	const totalPages = data?.totalPages ?? 1

	const handleSearch = useCallback(
		(filters: Partial<EventFilters>) => {
			const merged = { ...filters, page: 1 }
			setSearchParams(filtersToParams(merged), { replace: true })
			setSidebarOpen(false)
		},
		[setSearchParams],
	)

	const goToPage = useCallback(
		(newPage: number) => {
			if (newPage < 1 || newPage > totalPages) return
			const merged = { ...appliedFilters, page: newPage }
			setSearchParams(filtersToParams(merged), { replace: true })
		},
		[appliedFilters, totalPages, setSearchParams],
	)

	const hasActiveFilters =
		!!appliedFilters.search ||
		!!appliedFilters.province ||
		!!appliedFilters.period ||
		!!appliedFilters.featured ||
		(appliedFilters.categoryIds?.length ?? 0) > 0

	const resultsCount = data?.total ?? 0

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex items-end justify-between mb-8">
				<div>
					<h1 className="font-display text-4xl sm:text-5xl mb-1">Eventos</h1>
					<p className="text-text-secondary">Descobre os melhores eventos em Angola</p>
				</div>
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-600 rounded-lg border border-border hover:bg-warm-bg transition-colors"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<line x1="4" y1="6" x2="20" y2="6" />
						<line x1="8" y1="12" x2="20" y2="12" />
						<line x1="12" y1="18" x2="20" y2="18" />
					</svg>
					Filtros
					{hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand" />}
				</button>
			</div>

			<div className="flex gap-8">
				{/* Desktop sidebar */}
				<aside className="hidden lg:block w-72 shrink-0">
					<div className="sticky top-24">
						<div className="bg-warm-bg rounded-2xl p-5 border border-warm-border">
							<EventsSidebar
								categories={categories}
								onSearch={handleSearch}
								initialFilters={appliedFilters}
							/>
						</div>
					</div>
				</aside>

				{/* Mobile drawer overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Mobile drawer */}
				<div
					className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-surface-card shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
						sidebarOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className="h-full overflow-y-auto p-6">
						<EventsSidebar
							categories={categories}
							onSearch={handleSearch}
							initialFilters={appliedFilters}
							onClose={() => setSidebarOpen(false)}
						/>
					</div>
				</div>

				{/* Main content */}
				<main className="flex-1 min-w-0">
					{/* Results info */}
					{!isLoading && (
						<div className="flex items-center justify-between mb-4">
							<p className="text-sm text-text-secondary">
								{resultsCount} evento{resultsCount !== 1 ? 's' : ''} encontrado
								{resultsCount !== 1 ? 's' : ''}
							</p>
						</div>
					)}

					{/* Loading state */}
					{isLoading ? (
						<div className="grid sm:grid-cols-2 gap-6">
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="fade-in"
									style={{ animationDelay: `${i * 80}ms` }}
								>
									<SkeletonCard />
								</div>
							))}
						</div>
					) : data?.events && data.events.length > 0 ? (
						<>
							{/* Event grid */}
							<div className="grid sm:grid-cols-2 gap-6">
								{data.events.map((event, i) => (
									<div
										key={event.id}
										className="fade-in"
										style={{ animationDelay: `${i * 80}ms` }}
									>
										<EventCard event={event} />
									</div>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<nav className="flex items-center justify-center gap-1.5 mt-12">
									<button
										type="button"
										onClick={() => goToPage(page - 1)}
										disabled={page <= 1}
										className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-warm-bg disabled:opacity-40 disabled:pointer-events-none transition-colors"
										aria-label="Página anterior"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="15 18 9 12 15 6" />
										</svg>
									</button>

									{Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
										let pageNum: number
										if (totalPages <= 7) {
											pageNum = i + 1
										} else if (page <= 4) {
											pageNum = i + 1
										} else if (page >= totalPages - 3) {
											pageNum = totalPages - 6 + i
										} else {
											pageNum = page - 3 + i
										}

										return (
											<button
												key={pageNum}
												type="button"
												onClick={() => goToPage(pageNum)}
												className={`w-9 h-9 text-sm font-600 rounded-lg transition-colors ${
													pageNum === page
														? 'bg-brand text-white'
														: 'text-text-secondary hover:bg-warm-bg hover:text-text'
												}`}
											>
												{pageNum}
											</button>
										)
									})}

									<button
										type="button"
										onClick={() => goToPage(page + 1)}
										disabled={page >= totalPages}
										className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-warm-bg disabled:opacity-40 disabled:pointer-events-none transition-colors"
										aria-label="Próxima página"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline points="9 18 15 12 9 6" />
										</svg>
									</button>
								</nav>
							)}
						</>
					) : (
						/* Empty state */
						<div className="text-center py-20">
							<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warm-bg flex items-center justify-center">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-text-secondary"
								>
									<circle cx="11" cy="11" r="8" />
									<path d="M21 21l-4.35-4.35" />
								</svg>
							</div>
							<h3 className="font-heading font-700 text-lg mb-1">
								Nenhum evento encontrado
							</h3>
							<p className="text-text-secondary text-sm">
								Tenta ajustar os filtros ou pesquisar por outros termos
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
