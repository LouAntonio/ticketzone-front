import { PROVINCES, PERIODS } from '../../lib/constants'
import type { EventFilters, CategoryInfo } from '../../types/event'

interface FilterBarProps {
	filters: EventFilters
	onChange: (filters: EventFilters) => void
	categories: CategoryInfo[]
}

export function FilterBar({ filters, onChange, categories }: FilterBarProps) {
	const update = (key: keyof EventFilters, value: string) => {
		onChange({ ...filters, [key]: value || undefined })
	}

	return (
		<div className="flex flex-wrap gap-3">
			<select
				value={filters.category ?? ''}
				onChange={(e) => update('category', e.target.value)}
				className="input-field w-auto min-w-[160px] text-sm"
			>
				<option value="">Todas as Categorias</option>
				{categories.map((cat) => (
					<option key={cat.slug} value={cat.slug}>
						{cat.name}
					</option>
				))}
			</select>

			<select
				value={filters.province ?? ''}
				onChange={(e) => update('province', e.target.value)}
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
				onChange={(e) => update('period', e.target.value)}
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
	)
}
