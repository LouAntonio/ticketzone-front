import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvents } from '../../api/hooks/useEvents'
import { EventCard } from '../../components/shared/EventCard'
import { CategoryNav } from '../../components/shared/CategoryNav'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { PROVINCES, PERIODS } from '../../lib/constants'
import type { EventFilters, EventCategory, EventPeriod } from '../../types/event'

export function EventCatalog() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [filters, setFilters] = useState<EventFilters>({
		category: (searchParams.get('category') as EventCategory) ?? undefined,
		province: searchParams.get('province') ?? undefined,
		period: (searchParams.get('period') as EventPeriod) ?? undefined,
		search: searchParams.get('search') ?? undefined,
	})

	const { data, isLoading } = useEvents(filters)

	const updateFilter = (key: keyof EventFilters, value: string) => {
		const next = { ...filters, [key]: value || undefined }
		setFilters(next)
		const params = new URLSearchParams()
		Object.entries(next).forEach(([k, v]) => v && params.set(k, v))
		setSearchParams(params, { replace: true })
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-display text-4xl sm:text-5xl mb-3">Eventos</h1>
				<p className="text-text-secondary">Descobre os melhores eventos em Angola</p>
			</div>

			{/* Category nav */}
			<div className="mb-6">
				<CategoryNav
					active={filters.category ?? ''}
					onChange={(cat) => updateFilter('category', cat)}
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Pesquisar eventos..."
						value={filters.search ?? ''}
						onChange={(e) => updateFilter('search', e.target.value)}
						className="input-field"
					/>
				</div>
				<div className="flex flex-wrap gap-3">
					<select
						value={filters.province ?? ''}
						onChange={(e) => updateFilter('province', e.target.value)}
						className="input-field w-auto min-w-[140px] text-sm"
					>
						<option value="">Todas Províncias</option>
						{PROVINCES.map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
					<select
						value={filters.period ?? ''}
						onChange={(e) => updateFilter('period', e.target.value)}
						className="input-field w-auto min-w-[120px] text-sm"
					>
						<option value="">Qualquer Período</option>
						{PERIODS.map((p) => (
							<option key={p.value} value={p.value}>
								{p.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Results */}
			{isLoading ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="fade-in" style={{ animationDelay: `${i * 80}ms` }}>
							<SkeletonCard />
						</div>
					))}
				</div>
			) : data?.events && data.events.length > 0 ? (
				<>
					<p className="text-sm text-text-secondary mb-4">
						{data.total} evento{data.total !== 1 ? 's' : ''} encontrado
						{data.total !== 1 ? 's' : ''}
					</p>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
				</>
			) : (
				<div className="text-center py-20">
					<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-gray-400"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
					</div>
					<h3 className="font-heading font-700 text-lg mb-1">Nenhum evento encontrado</h3>
					<p className="text-text-secondary text-sm">
						Tenta ajustar os filtros ou pesquisar por outros termos
					</p>
				</div>
			)}
		</div>
	)
}
