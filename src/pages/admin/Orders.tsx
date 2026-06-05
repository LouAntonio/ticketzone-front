import { useState } from 'react'
import { useAdminOrders } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate, formatKwanza } from '../../lib/format'

const statusColors: Record<string, string> = {
	confirmed: 'bg-emerald-500/20 text-emerald-400',
	pending: 'bg-amber-500/20 text-amber-400',
	cancelled: 'bg-red-500/20 text-red-400',
}

const statusLabels: Record<string, string> = {
	confirmed: 'Confirmado',
	pending: 'Pendente',
	cancelled: 'Cancelado',
}

const paymentLabels: Record<string, string> = {
	multicaixa: 'Multicaixa Express',
	paypay: 'PayPay',
	reference: 'Referência',
}

export function AdminOrders() {
	const { data, isLoading } = useAdminOrders()
	const [filterStatus, setFilterStatus] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const orders = data?.orders ?? []

	const filtered = orders.filter((o) => {
		if (filterStatus !== 'all' && o.status !== filterStatus) return false
		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			return o.eventTitle.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q)
		}
		return true
	})

	const counts = orders.reduce(
		(acc, o) => {
			acc[o.status] = (acc[o.status] ?? 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const tabs = [
		{ key: 'all', label: 'Todas', count: orders.length },
		{ key: 'confirmed', label: 'Confirmadas', count: counts.confirmed ?? 0 },
		{ key: 'pending', label: 'Pendentes', count: counts.pending ?? 0 },
		{ key: 'cancelled', label: 'Canceladas', count: counts.cancelled ?? 0 },
	]

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">ENCOMENDAS</h1>
				<p className="text-gray-500 text-sm mt-1">Todas as transações da plataforma</p>
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
					placeholder="Pesquisar encomendas..."
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
									Comprador
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Total
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Comissão
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Pagamento
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Estado
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden lg:table-cell">
									Data
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((order) => (
								<tr
									key={order.id}
									className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors"
								>
									<td className="px-4 py-3">
										<p className="text-sm font-heading font-500 text-white">
											{order.eventTitle}
										</p>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{order.buyerName}
									</td>
									<td className="px-4 py-3 text-sm font-heading font-600 text-white text-right">
										{formatKwanza(order.total)}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 text-right hidden md:table-cell">
										{formatKwanza(order.commission)}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{paymentLabels[order.paymentMethod] ?? order.paymentMethod}
									</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-0.5 rounded-md text-xs font-heading font-600 ${statusColors[order.status] ?? 'bg-gray-500/20 text-gray-400'}`}
										>
											{statusLabels[order.status] ?? order.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">
										{formatDate(order.createdAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 && (
					<p className="text-gray-500 text-sm text-center py-8">
						Nenhuma encomenda encontrada
					</p>
				)}
			</div>
		</div>
	)
}
