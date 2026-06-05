import { useAdminStats } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatKwanza, formatDate } from '../../lib/format'

export function AdminDashboard() {
	const { data, isLoading } = useAdminStats()

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const stats = [
		{
			label: 'Utilizadores',
			value: data?.totalUsers ?? 0,
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
			color: 'text-blue-400',
			bg: 'bg-blue-500/10',
		},
		{
			label: 'Organizadores',
			value: data?.totalOrganizers ?? 0,
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
			color: 'text-purple-400',
			bg: 'bg-purple-500/10',
		},
		{
			label: 'Eventos',
			value: data?.totalEvents ?? 0,
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
			color: 'text-emerald-400',
			bg: 'bg-emerald-500/10',
		},
		{
			label: 'Encomendas',
			value: data?.totalOrders ?? 0,
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			color: 'text-cyan-400',
			bg: 'bg-cyan-500/10',
		},
		{
			label: 'Receita Total',
			value: formatKwanza(data?.totalRevenue ?? 0),
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'text-brand',
			bg: 'bg-brand/10',
		},
		{
			label: 'Comissões',
			value: formatKwanza(data?.totalCommissions ?? 0),
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'text-amber-400',
			bg: 'bg-amber-500/10',
		},
		{
			label: 'Bilhetes Vendidos',
			value: data?.totalTicketsSold ?? 0,
			icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
			color: 'text-rose-400',
			bg: 'bg-rose-500/10',
		},
		{
			label: 'Viaturas',
			value: data?.totalCars ?? 0,
			icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 0l2 1m-2-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4M6 16m-2 0h2M6 16H4m2 0l2-1m-2 1l-2 1m8-1l-2-1m2 1l2 1',
			color: 'text-indigo-400',
			bg: 'bg-indigo-500/10',
		},
	]

	const statusBadge = (status: string) => {
		const styles: Record<string, string> = {
			confirmed: 'bg-emerald-500/20 text-emerald-400',
			pending: 'bg-amber-500/20 text-amber-400',
			cancelled: 'bg-red-500/20 text-red-400',
		}
		const labels: Record<string, string> = {
			confirmed: 'Confirmado',
			pending: 'Pendente',
			cancelled: 'Cancelado',
		}
		return (
			<span
				className={`px-2 py-0.5 rounded-md text-xs font-heading font-600 ${styles[status] ?? 'bg-gray-500/20 text-gray-400'}`}
			>
				{labels[status] ?? status}
			</span>
		)
	}

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">DASHBOARD</h1>
				<p className="text-gray-500 text-sm mt-1">Visão geral da plataforma Ticketzone</p>
			</div>

			{/* Stats Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5 hover:border-[#3a3a3a] transition-colors"
					>
						<div className="flex items-start justify-between mb-3">
							<div
								className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
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
									className={stat.color}
								>
									<path d={stat.icon} />
								</svg>
							</div>
						</div>
						<p className="font-display text-2xl tracking-wider text-white">
							{stat.value}
						</p>
						<p className="text-xs text-gray-500 font-heading font-500 mt-1">
							{stat.label}
						</p>
					</div>
				))}
			</div>

			{/* Revenue Chart & Recent Orders */}
			<div className="grid lg:grid-cols-2 gap-6">
				{/* Revenue Chart */}
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6">
					<h2 className="font-heading font-600 text-base text-white mb-6">
						Receita Mensal
					</h2>
					<div className="flex items-end justify-between gap-2 h-40">
						{data?.revenueByMonth?.map((item) => {
							const maxRevenue = Math.max(
								...data.revenueByMonth.map((r) => r.revenue),
								1,
							)
							const height = (item.revenue / maxRevenue) * 100
							return (
								<div
									key={item.month}
									className="flex-1 flex flex-col items-center gap-2"
								>
									<span className="text-[10px] text-gray-500 font-heading">
										{formatKwanza(item.revenue)}
									</span>
									<div
										className="w-full rounded-md bg-brand/80 hover:bg-brand transition-colors relative group cursor-pointer"
										style={{ height: `${Math.max(height, 4)}%` }}
									>
										<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#2a2a2a] text-white text-xs px-2 py-1 rounded font-heading">
											{formatKwanza(item.revenue)}
										</div>
									</div>
									<span className="text-xs text-gray-500 font-heading">
										{item.month}
									</span>
								</div>
							)
						})}
					</div>
				</div>

				{/* Recent Orders */}
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6">
					<h2 className="font-heading font-600 text-base text-white mb-4">
						Encomendas Recentes
					</h2>
					<div className="space-y-3">
						{data?.recentOrders?.map((order) => (
							<div
								key={order.id}
								className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0"
							>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-heading font-500 text-white truncate">
										{order.eventTitle}
									</p>
									<p className="text-xs text-gray-500 mt-0.5">
										{order.buyerName} · {formatDate(order.createdAt)}
									</p>
								</div>
								<div className="text-right ml-4 shrink-0">
									<p className="text-sm font-heading font-600 text-white">
										{formatKwanza(order.total)}
									</p>
									{statusBadge(order.status)}
								</div>
							</div>
						))}
						{(!data?.recentOrders || data.recentOrders.length === 0) && (
							<p className="text-gray-500 text-sm text-center py-4">
								Nenhuma encomenda recente
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
