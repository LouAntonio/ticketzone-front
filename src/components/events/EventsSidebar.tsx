import { useState, type FormEvent } from 'react'
import type { EventFilters, CategoryInfo } from '../../types/event'
import { PROVINCES, PERIODS } from '../../lib/constants'

interface EventsSidebarProps {
	categories: CategoryInfo[]
	onSearch: (filters: Partial<EventFilters>) => void
	initialFilters?: Partial<EventFilters>
	onClose?: () => void
}

export function EventsSidebar({ categories, onSearch, initialFilters, onClose }: EventsSidebarProps) {
	const [search, setSearch] = useState(initialFilters?.search ?? '')
	const [categoryIds, setCategoryIds] = useState<string[]>(initialFilters?.categoryIds ?? [])
	const [province, setProvince] = useState(initialFilters?.province ?? '')
	const [period, setPeriod] = useState(initialFilters?.period ?? '')
	const [featured, setFeatured] = useState(initialFilters?.featured ?? false)

	const toggleCategory = (id: string) => {
		setCategoryIds((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
		)
	}

	const handleSearch = (e: FormEvent) => {
		e.preventDefault()
		onSearch(buildFilters())
	}

	const handleClear = () => {
		setSearch('')
		setCategoryIds([])
		setProvince('')
		setPeriod('')
		setFeatured(false)
		onSearch({})
	}

	const buildFilters = (): Partial<EventFilters> => {
		const filters: Partial<EventFilters> = {}
		if (search.trim()) filters.search = search.trim()
		if (categoryIds.length > 0) filters.categoryIds = categoryIds
		if (province) filters.province = province
		if (period) filters.period = period as EventFilters['period']
		if (featured) filters.featured = true
		return filters
	}

	return (
		<form onSubmit={handleSearch} className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="font-heading font-700 text-sm uppercase tracking-wider text-text-secondary">
					Filtros
				</h2>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						className="lg:hidden p-1 text-text-secondary hover:text-text transition-colors"
						aria-label="Fechar filtros"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				)}
			</div>

			{/* Search */}
			<div>
				<label className="block text-xs font-600 text-text-secondary uppercase tracking-wider mb-1.5">
					Pesquisar
				</label>
				<div className="relative">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="M21 21l-4.35-4.35" />
					</svg>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Nome do evento..."
						className="input-field w-full pl-9 text-sm"
					/>
				</div>
			</div>

			{/* Categories */}
			<div>
				<label className="block text-xs font-600 text-text-secondary uppercase tracking-wider mb-2">
					Categorias
				</label>
				<div className="flex flex-wrap gap-1.5">
					{categories.map((cat) => {
						const isSelected = categoryIds.includes(cat.id)
						return (
							<button
								key={cat.id}
								type="button"
								onClick={() => toggleCategory(cat.id)}
								className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 cursor-pointer ${
									isSelected
										? 'bg-brand text-white border-brand font-600'
										: 'border-border text-text-secondary hover:text-text hover:border-text-secondary'
								}`}
							>
								{cat.name}
							</button>
						)
					})}
				</div>
			</div>

			{/* Province */}
			<div>
				<label className="block text-xs font-600 text-text-secondary uppercase tracking-wider mb-1.5">
					Província
				</label>
				<select
					value={province}
					onChange={(e) => setProvince(e.target.value)}
					className="input-field w-full text-sm"
				>
					<option value="">Todas Províncias</option>
					{PROVINCES.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>
			</div>

			{/* Period */}
			<div>
				<label className="block text-xs font-600 text-text-secondary uppercase tracking-wider mb-1.5">
					Período
				</label>
				<select
					value={period}
					onChange={(e) => setPeriod(e.target.value)}
					className="input-field w-full text-sm"
				>
					<option value="">Qualquer Período</option>
					{PERIODS.map((p) => (
						<option key={p.value} value={p.value}>
							{p.label}
						</option>
					))}
				</select>
			</div>

			{/* Featured toggle */}
			<div>
				<label className="flex items-center gap-3 cursor-pointer group">
					<button
						type="button"
						role="switch"
						aria-checked={featured}
						onClick={() => setFeatured((prev) => !prev)}
						className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
							featured ? 'bg-amber-500' : 'bg-border'
						}`}
					>
						<span
							className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
								featured ? 'translate-x-4' : 'translate-x-0'
							}`}
						/>
					</button>
					<div className="flex items-center gap-1.5 text-sm text-text-secondary group-hover:text-text transition-colors">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill={featured ? 'currentColor' : 'none'}
							stroke="currentColor"
							strokeWidth="1.5"
							className={featured ? 'text-amber-500' : ''}
						>
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
						</svg>
						<span>Apenas em Destaque</span>
					</div>
				</label>
			</div>

			{/* Action buttons */}
			<div className="space-y-2 pt-2">
				<button
					type="submit"
					className="w-full py-2.5 px-4 bg-brand text-white text-sm font-600 rounded-lg hover:bg-brand-dark transition-colors"
				>
					Pesquisar
				</button>
				<button
					type="button"
					onClick={handleClear}
					className="w-full py-2.5 px-4 text-text-secondary text-sm font-500 rounded-lg border border-border hover:bg-warm-bg hover:text-text transition-colors"
				>
					Limpar Filtros
				</button>
			</div>
		</form>
	)
}
