import { EVENT_CATEGORIES, PROVINCES, PERIODS } from '../../lib/constants'
import type { EventFilters } from '../../types/event'

interface FilterBarProps {
	filters: EventFilters
	onChange: (filters: EventFilters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
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
				{EVENT_CATEGORIES.map((cat) => (
					<option key={cat.value} value={cat.value}>
						{cat.label}
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
