import { useState } from 'react'
import { useAdminEvents, useUpdateEventStatus } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate, formatKwanza, getCategoryLabel } from '../../lib/format'

const statusColors: Record<string, string> = {
	draft: 'bg-gray-500/20 text-gray-400',
	published: 'bg-emerald-500/20 text-emerald-400',
	cancelled: 'bg-red-500/20 text-red-400',
	completed: 'bg-blue-500/20 text-blue-400',
}

const statusLabels: Record<string, string> = {
	draft: 'Rascunho',
	published: 'Publicado',
	cancelled: 'Cancelado',
	completed: 'Concluído',
}

export function AdminEvents() {
	const { data, isLoading } = useAdminEvents()
	const updateStatus = useUpdateEventStatus()
	const [filterStatus, setFilterStatus] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const events = data?.events ?? []

	const filtered = events.filter((e) => {
		if (filterStatus !== 'all' && e.status !== filterStatus) return false
		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			return e.title.toLowerCase().includes(q) || e.organizerName.toLowerCase().includes(q)
		}
		return true
	})

	const counts = events.reduce(
		(acc, e) => {
			acc[e.status] = (acc[e.status] ?? 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const tabs = [
		{ key: 'all', label: 'Todos', count: events.length },
		{ key: 'published', label: 'Publicados', count: counts.published ?? 0 },
		{ key: 'draft', label: 'Rascunhos', count: counts.draft ?? 0 },
		{ key: 'completed', label: 'Concluídos', count: counts.completed ?? 0 },
		{ key: 'cancelled', label: 'Cancelados', count: counts.cancelled ?? 0 },
	]

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">EVENTOS</h1>
				<p className="text-gray-500 text-sm mt-1">
					Gestão de todos os eventos da plataforma
				</p>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 flex-wrap">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setFilterStatus(tab.key)}
						className={`px-4 py-2 rounded-lg text-sm font-heading font-500 transition-all ${
							filterStatus === tab.key
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
					placeholder="Pesquisar eventos..."
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
									Evento
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Categoria
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Estado
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Data
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden lg:table-cell">
									Bilhetes
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden lg:table-cell">
									Receita
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Ações
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((event) => (
								<tr
									key={event.id}
									className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors"
								>
									<td className="px-4 py-3">
										<div>
											<p className="text-sm font-heading font-500 text-white">
												{event.title}
											</p>
											<p className="text-xs text-gray-500 mt-0.5">
												{event.organizerName} · {event.province}
											</p>
										</div>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{getCategoryLabel(event.category)}
									</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-0.5 rounded-md text-xs font-heading font-600 ${statusColors[event.status] ?? 'bg-gray-500/20 text-gray-400'}`}
										>
											{statusLabels[event.status] ?? event.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
										{formatDate(event.date)}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 text-right hidden lg:table-cell">
										{event.ticketsSold}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 text-right hidden lg:table-cell">
										{formatKwanza(event.revenue)}
									</td>
									<td className="px-4 py-3 text-right">
										<select
											value={event.status}
											onChange={(e) =>
												updateStatus.mutate({
													id: event.id,
													status: e.target.value,
												})
											}
											className="bg-[#252525] border border-[#3a3a3a] rounded-lg text-xs text-gray-300 px-2 py-1.5 focus:border-brand focus:outline-none cursor-pointer"
										>
											<option value="draft">Rascunho</option>
											<option value="published">Publicado</option>
											<option value="completed">Concluído</option>
											<option value="cancelled">Cancelado</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 && (
					<p className="text-gray-500 text-sm text-center py-8">
						Nenhum evento encontrado
					</p>
				)}
			</div>
		</div>
	)
}
