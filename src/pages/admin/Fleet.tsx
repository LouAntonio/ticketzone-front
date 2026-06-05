import { useState } from 'react'
import { useAdminFleet } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatKwanza } from '../../lib/format'

const transmissionLabels: Record<string, string> = {
	auto: 'Automático',
	manual: 'Manual',
}

export function AdminFleet() {
	const { data, isLoading } = useAdminFleet()
	const [filterAvailable, setFilterAvailable] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const cars = data?.cars ?? []

	const filtered = cars.filter((c) => {
		if (filterAvailable === 'available' && !c.available) return false
		if (filterAvailable === 'unavailable' && c.available) return false
		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			return (
				c.make.toLowerCase().includes(q) ||
				c.model.toLowerCase().includes(q) ||
				c.location.toLowerCase().includes(q)
			)
		}
		return true
	})

	const availableCount = cars.filter((c) => c.available).length
	const unavailableCount = cars.filter((c) => !c.available).length

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">FROTA</h1>
				<p className="text-gray-500 text-sm mt-1">
					Todas as viaturas disponíveis na plataforma
				</p>
			</div>

			{/* Summary */}
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">
						Total Viaturas
					</p>
					<p className="font-display text-2xl tracking-wider text-white">{cars.length}</p>
				</div>
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">Disponíveis</p>
					<p className="font-display text-2xl tracking-wider text-emerald-400">
						{availableCount}
					</p>
				</div>
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">
						Indisponíveis
					</p>
					<p className="font-display text-2xl tracking-wider text-rose-400">
						{unavailableCount}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-2 flex-wrap">
				{[
					{ key: 'all', label: 'Todas', count: cars.length },
					{ key: 'available', label: 'Disponíveis', count: availableCount },
					{ key: 'unavailable', label: 'Indisponíveis', count: unavailableCount },
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => setFilterAvailable(tab.key)}
						className={`px-4 py-2 rounded-lg text-sm font-heading font-500 transition-all ${
							filterAvailable === tab.key
								? 'bg-brand text-white shadow-lg shadow-brand/20'
								: 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white'
						}`}
					>
						{tab.label}
						<span className="ml-2 text-xs opacity-60">{tab.count}</span>
					</button>
				))}
			</div>

			{/* Search */}
			<div className="relative">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
				<input
					type="text"
					placeholder="Pesquisar por marca, modelo ou localização..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand focus:outline-none transition-colors"
				/>
			</div>

			{/* Table */}
			<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#2a2a2a]">
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Viatura
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Ano
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Transmissão
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Combustível
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Localização
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Preço/Dia
								</th>
								<th className="text-center px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Disponível
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((car) => (
								<tr
									key={car.id}
									className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors"
								>
									<td className="px-4 py-3">
										<p className="text-sm font-heading font-500 text-white">
											{car.make} {car.model}
										</p>
										<p className="text-xs text-gray-500 mt-0.5">
											{car.seats} lugares
										</p>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{car.year}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{transmissionLabels[car.transmission] ?? car.transmission}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
										{car.fuelType}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400">
										{car.location}
									</td>
									<td className="px-4 py-3 text-sm font-heading font-600 text-white text-right">
										{formatKwanza(car.pricePerDay)}
										<span className="text-xs text-gray-500 font-normal">
											/dia
										</span>
									</td>
									<td className="px-4 py-3 text-center">
										{car.available ? (
											<span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
										) : (
											<span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30" />
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 && (
					<p className="text-gray-500 text-sm text-center py-8">
						Nenhuma viatura encontrada
					</p>
				)}
			</div>
		</div>
	)
}
