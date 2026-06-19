import { useAdminStats } from '../../api/hooks/useAdmin'
import type { AdminStats } from '../../api/endpoints/admin'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatKwanza, formatDate } from '../../lib/format'

const statCards = [
	{
		key: 'totalUsers',
		label: 'Utilizadores',
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
		color: 'text-blue-400',
		bg: 'bg-blue-500/10',
	},
	{
		key: 'totalOrganizers',
		label: 'Organizadores',
		icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
		color: 'text-purple-400',
		bg: 'bg-purple-500/10',
	},
	{
		key: 'totalEvents',
		label: 'Eventos',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
		color: 'text-emerald-400',
		bg: 'bg-emerald-500/10',
	},
	{
		key: 'totalOrders',
		label: 'Encomendas',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
		color: 'text-cyan-400',
		bg: 'bg-cyan-500/10',
	},
	{
		key: 'totalRevenue',
		label: 'Receita Total',
		format: (v: number) => formatKwanza(v),
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		color: 'text-brand',
		bg: 'bg-brand/10',
	},
	{
		key: 'totalTicketsSold',
		label: 'Bilhetes Vendidos',
		icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
		color: 'text-rose-400',
		bg: 'bg-rose-500/10',
	},
	{
		key: 'totalVehicles',
		label: 'Viaturas',
		icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 0l2 1m-2-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4M6 16m-2 0h2M6 16H4m2 0l2-1m-2 1l-2 1m8-1l-2-1m2 1l2 1',
		color: 'text-indigo-400',
		bg: 'bg-indigo-500/10',
	},
	{
		key: 'pendingPromoters',
		label: 'Verif. Pendentes',
		icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
		color: 'text-amber-400',
		bg: 'bg-amber-500/10',
	},
]

const statusBadge = (status: string) => {
	const styles: Record<string, string> = {
		paid: 'border-emerald-500/40 text-emerald-400',
		pending: 'border-amber-500/40 text-amber-400',
		refunded: 'border-blue-500/40 text-blue-400',
		cancelled: 'border-red-500/40 text-red-400',
	}
	const labels: Record<string, string> = {
		paid: 'Pago',
		pending: 'Pendente',
		refunded: 'Reembolsado',
		cancelled: 'Cancelado',
	}
	return (
		<span className={`badge-admin ${styles[status] ?? 'border-gray-500/40 text-gray-400'}`}>
			{labels[status] ?? status}
		</span>
	)
}

export function AdminDashboard() {
	const { data, isLoading } = useAdminStats()

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="space-y-2">
					<Skeleton variant="dark" className="h-10 w-64" />
					<Skeleton variant="dark" className="h-4 w-72" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="card-admin p-5 space-y-3">
							<Skeleton variant="dark" className="w-10 h-10" />
							<Skeleton variant="dark" className="h-8 w-28" />
							<Skeleton variant="dark" className="h-3 w-20" />
						</div>
					))}
				</div>
				<div className="grid lg:grid-cols-2 gap-6">
					<div className="card-admin p-6">
						<Skeleton variant="dark" className="h-5 w-28 mb-6" />
						<div className="flex items-end justify-between gap-2 h-40">
							{[...Array(12)].map((_, i) => (
								<Skeleton key={i} variant="dark" className="flex-1 h-24" />
							))}
						</div>
					</div>
					<div className="card-admin p-6">
						<Skeleton variant="dark" className="h-5 w-36 mb-4" />
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between py-2 border-b border-[#3d3028] last:border-0"
								>
									<div className="space-y-1">
										<Skeleton variant="dark" className="h-4 w-40" />
										<Skeleton variant="dark" className="h-3 w-24" />
									</div>
									<Skeleton variant="dark" className="h-4 w-16" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}

	const cards = statCards.map((card: (typeof statCards)[0]) => {
		const rawValue = data?.[card.key as keyof AdminStats]
		const value = card.format ? card.format(rawValue as number) : String(rawValue ?? 0)
		return { ...card, value }
	})

	return (
		<div className="space-y-8">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Dashboard
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Visão geral da plataforma Ticketzone
				</p>
			</div>

			{(data?.pendingEvents ?? 0) > 0 || (data?.pendingPromoters ?? 0) > 0 ? (
				<div className="admin-stagger-2 flex flex-wrap gap-3">
					{(data?.pendingEvents ?? 0) > 0 && (
						<div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-heading font-500">
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
								<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
							<span>
								{data?.pendingEvents} evento{data?.pendingEvents !== 1 ? 's' : ''}{' '}
								pendente{data?.pendingEvents !== 1 ? 's' : ''} de aprovação
							</span>
						</div>
					)}
					{(data?.pendingPromoters ?? 0) > 0 && (
						<div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-heading font-500">
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
								<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
							<span>
								{data?.pendingPromoters} verificaç
								{data?.pendingPromoters !== 1 ? 'ões' : 'ão'} pendente
								{data?.pendingPromoters !== 1 ? 's' : ''}
							</span>
						</div>
					)}
				</div>
			) : null}

			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{cards.map(
					(
						card: ReturnType<
							() => {
								key: string
								label: string
								icon: string
								color: string
								bg: string
								value: string
							}
						>,
						i: number,
					) => (
						<div
							key={card.key}
							className={`card-admin p-5 hover:border-[#5a4a3e] transition-colors duration-200 admin-stagger-${Math.min(i + 2, 8)}`}
						>
							<div className="flex items-start justify-between mb-3">
								<div
									className={`w-10 h-10 ${card.bg} flex items-center justify-center`}
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={card.color}
									>
										<path d={card.icon} />
									</svg>
								</div>
							</div>
							<p className="font-display text-2xl tracking-wider text-white">
								{card.value}
							</p>
							<p className="text-xs text-[#8a7a6e] font-heading font-500 mt-1">
								{card.label}
							</p>
						</div>
					),
				)}
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<div className="card-admin p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="font-heading font-600 text-base text-white">
							Receita Mensal
						</h2>
						<span className="text-[#8a7a6e] text-xs font-heading font-500">
							Total: {formatKwanza(data?.totalRevenue ?? 0)}
						</span>
					</div>
					<div className="flex items-end justify-between gap-2 h-40">
						{data?.revenueByMonth?.map(
							(item: { month: string; revenue: number }, idx: number) => {
								const maxRevenue = Math.max(
									...data.revenueByMonth.map(
										(r: { revenue: number }) => r.revenue,
									),
									1,
								)
								const height = (item.revenue / maxRevenue) * 100
								return (
									<div
										key={idx}
										className="flex-1 flex flex-col items-center gap-2"
									>
										<span className="text-[10px] text-[#6a5a4e] font-heading font-500">
											{formatKwanza(item.revenue)}
										</span>
										<div
											className="w-full bg-brand/60 hover:bg-brand transition-colors relative group cursor-pointer"
											style={{ height: `${Math.max(height, 4)}%` }}
										>
											<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1c1613] border border-[#3d3028] text-[#d4c5b8] text-[10px] px-2 py-1 font-heading">
												{formatKwanza(item.revenue)}
											</div>
										</div>
										<span className="text-[10px] text-[#6a5a4e] font-heading">
											{item.month}
										</span>
									</div>
								)
							},
						)}
						{(!data?.revenueByMonth || data.revenueByMonth.length === 0) && (
							<div className="flex-1 flex items-center justify-center">
								<p className="text-[#6a5a4e] text-sm font-heading">
									Sem dados de receita
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Recent Orders */}
				<div className={`card-admin p-6 admin-stagger-${Math.min(cards.length + 3, 8)}`}>
					<h2 className="font-heading font-600 text-base text-white mb-4">
						Encomendas Recentes
					</h2>
					<div className="space-y-1">
						{data?.recentOrders?.map((order: AdminStats['recentOrders'][0]) => (
							<div
								key={order.id}
								className="flex items-center justify-between py-2.5 border-b border-[#3d3028] last:border-0"
							>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-heading font-500 text-[#d4c5b8] truncate">
										{order.eventTitle}
									</p>
									<p className="text-[11px] text-[#6a5a4e] mt-0.5 font-heading">
										{order.buyerName} · {formatDate(order.createdAt)}
									</p>
								</div>
								<div className="text-right ml-4 shrink-0">
									<p className="text-sm font-heading font-600 text-white">
										{formatKwanza((order as any).totalAmount ?? 0)}
									</p>
									{statusBadge(order.status)}
								</div>
							</div>
						))}
						{(!data?.recentOrders || data.recentOrders.length === 0) && (
							<p className="text-[#6a5a4e] text-sm text-center py-4 font-heading">
								Nenhuma encomenda recente
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
