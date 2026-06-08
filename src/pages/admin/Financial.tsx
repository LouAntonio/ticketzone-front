import { useAdminFinancial } from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatKwanza } from '../../lib/format'

const metrics = [
	{
		key: 'totalRevenue',
		label: 'Receita Total Bruta',
		color: 'text-white',
		bg: 'bg-brand/10',
		border: 'border-brand/20',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
	},
	{
		key: 'totalCommissions',
		label: 'Comissões (10%)',
		color: 'text-amber-400',
		bg: 'bg-amber-500/10',
		border: 'border-amber-500/20',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
	},
	{
		key: 'totalPayouts',
		label: 'Total Pago a Organizadores',
		color: 'text-emerald-400',
		bg: 'bg-emerald-500/10',
		border: 'border-emerald-500/20',
		icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
	},
	{
		key: 'pendingPayouts',
		label: 'Payouts Pendentes',
		color: 'text-rose-400',
		bg: 'bg-rose-500/10',
		border: 'border-rose-500/20',
		icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
	},
	{
		key: 'netRevenue',
		label: 'Receita Líquida',
		color: 'text-cyan-400',
		bg: 'bg-cyan-500/10',
		border: 'border-cyan-500/20',
		icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
	},
	{
		key: 'organizersCount',
		label: 'Organizadores Ativos',
		color: 'text-purple-400',
		bg: 'bg-purple-500/10',
		border: 'border-purple-500/20',
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
	},
]

export function AdminFinancial() {
	const { data, isLoading } = useAdminFinancial()

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="space-y-2">
					<Skeleton variant="dark" className="h-10 w-56" />
					<Skeleton variant="dark" className="h-4 w-64" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="card-admin p-5 space-y-3">
							<Skeleton variant="dark" className="w-10 h-10" />
							<Skeleton variant="dark" className="h-8 w-28" />
							<Skeleton variant="dark" className="h-3 w-32" />
						</div>
					))}
				</div>
				<div className="card-admin p-6 space-y-4">
					<Skeleton variant="dark" className="h-5 w-40" />
					{[...Array(3)].map((_, i) => (
						<div key={i} className="space-y-2">
							<div className="flex justify-between">
								<Skeleton variant="dark" className="h-4 w-44" />
								<Skeleton variant="dark" className="h-4 w-24" />
							</div>
							<Skeleton variant="dark" className="h-2 w-full rounded-full" />
						</div>
					))}
				</div>
			</div>
		)
	}

	const formatValue = (key: string) => {
		const val = data?.[key as keyof typeof data]
		if (key === 'organizersCount' || key === 'totalOrders' || key === 'paidOrders')
			return String(val ?? 0)
		if (typeof val === 'number') return formatKwanza(val)
		return String(val ?? 0)
	}

	return (
		<div className="space-y-8">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Financeiro
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Visão geral das finanças da plataforma
				</p>
			</div>

			{/* Metrics Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{metrics.map((m, i) => (
					<div
						key={m.key}
						className={`card-admin p-5 border-l-[3px] ${m.border} admin-stagger-${Math.min(i + 2, 8)}`}
					>
						<div className="flex items-start justify-between mb-3">
							<div className={`w-10 h-10 ${m.bg} flex items-center justify-center`}>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={m.color}
								>
									<path d={m.icon} />
								</svg>
							</div>
						</div>
						<p className={`font-display text-2xl tracking-wider ${m.color}`}>
							{formatValue(m.key)}
						</p>
						<p className="text-xs text-[#8a7a6e] font-heading font-500 mt-1">
							{m.label}
						</p>
					</div>
				))}
			</div>

			{/* Revenue breakdown */}
			<div className="card-admin p-6 admin-stagger-6">
				<h2 className="font-heading font-600 text-base text-white mb-6">
					Repartição de Receita
				</h2>
				<div className="space-y-5">
					{[
						{
							label: 'Receita Bruta',
							value: data?.totalRevenue ?? 0,
							color: 'bg-brand',
							pct: 100,
						},
						{
							label: 'Comissão Plataforma (10%)',
							value: data?.totalCommissions ?? 0,
							color: 'bg-amber-500',
							pct: data?.totalRevenue
								? Math.round(
										((data.totalCommissions ?? 0) / data.totalRevenue) * 100,
									)
								: 0,
						},
						{
							label: 'Pago a Organizadores',
							value: data?.totalPayouts ?? 0,
							color: 'bg-emerald-500',
							pct: data?.totalRevenue
								? Math.round(((data.totalPayouts ?? 0) / data.totalRevenue) * 100)
								: 0,
						},
						{
							label: 'Receita Líquida',
							value: data?.netRevenue ?? 0,
							color: 'bg-cyan-500',
							pct: data?.totalRevenue
								? Math.round(((data.netRevenue ?? 0) / data.totalRevenue) * 100)
								: 0,
						},
					].map((item) => (
						<div key={item.label}>
							<div className="flex justify-between mb-1.5">
								<span className="text-sm text-[#8a7a6e] font-heading">
									{item.label}
								</span>
								<span className="text-sm font-heading font-600 text-white">
									{formatKwanza(item.value)}
								</span>
							</div>
							<div className="h-2.5 bg-[#1c1613] border border-[#3d3028] overflow-hidden">
								<div
									className={`h-full ${item.color} transition-all duration-700`}
									style={{ width: `${item.pct}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Order Stats */}
			<div className="card-admin p-6 admin-stagger-7">
				<h2 className="font-heading font-600 text-base text-white mb-4">
					Estatísticas de Encomendas
				</h2>
				<div className="grid sm:grid-cols-3 gap-4">
					<div>
						<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Total de Encomendas
						</p>
						<p className="font-display text-xl tracking-wider text-white">
							{data?.totalOrders ?? 0}
						</p>
					</div>
					<div>
						<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Pagas</p>
						<p className="font-display text-xl tracking-wider text-emerald-400">
							{data?.paidOrders ?? 0}
						</p>
					</div>
					<div>
						<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Comissão Média/Ordem
						</p>
						<p className="font-display text-xl tracking-wider text-amber-400">
							{formatKwanza(data?.averageCommission ?? 0)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
