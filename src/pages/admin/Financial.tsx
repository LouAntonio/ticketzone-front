import { useAdminFinancial } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatKwanza } from '../../lib/format'

export function AdminFinancial() {
	const { data, isLoading } = useAdminFinancial()

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const metrics = [
		{
			label: 'Receita Total Bruta',
			value: formatKwanza(data?.totalRevenue ?? 0),
			color: 'text-white',
			bg: 'bg-brand/10',
			border: 'border-brand/20',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			label: 'Comissões da Plataforma',
			value: formatKwanza(data?.totalCommissions ?? 0),
			color: 'text-amber-400',
			bg: 'bg-amber-500/10',
			border: 'border-amber-500/20',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			label: 'Total Pago a Organizadores',
			value: formatKwanza(data?.totalPayouts ?? 0),
			color: 'text-emerald-400',
			bg: 'bg-emerald-500/10',
			border: 'border-emerald-500/20',
			icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
		},
		{
			label: 'Payouts Pendentes',
			value: formatKwanza(data?.pendingPayouts ?? 0),
			color: 'text-rose-400',
			bg: 'bg-rose-500/10',
			border: 'border-rose-500/20',
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			label: 'Organizadores Ativos',
			value: String(data?.organizersCount ?? 0),
			color: 'text-purple-400',
			bg: 'bg-purple-500/10',
			border: 'border-purple-500/20',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
		},
		{
			label: 'Comissão Média por Ordem',
			value: formatKwanza(data?.averageCommission ?? 0),
			color: 'text-cyan-400',
			bg: 'bg-cyan-500/10',
			border: 'border-cyan-500/20',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		},
	]

	return (
		<div className="space-y-8 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">
					FINANCEIRO
				</h1>
				<p className="text-gray-500 text-sm mt-1">
					Visão geral das finanças da plataforma
				</p>
			</div>

			{/* Metrics Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{metrics.map((m) => (
					<div
						key={m.label}
						className={`rounded-xl bg-[#1a1a1a] border ${m.border} p-5`}
					>
						<div className="flex items-start justify-between mb-3">
							<div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
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
							{m.value}
						</p>
						<p className="text-xs text-gray-500 font-heading font-500 mt-1">
							{m.label}
						</p>
					</div>
				))}
			</div>

			{/* Revenue breakdown */}
			<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6">
				<h2 className="font-heading font-600 text-base text-white mb-6">
					Repartição de Receita
				</h2>
				<div className="space-y-4">
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
								? Math.round(((data?.totalCommissions ?? 0) / data.totalRevenue) * 100)
								: 0,
						},
						{
							label: 'Pago a Organizadores (85%)',
							value: data?.totalPayouts ?? 0,
							color: 'bg-emerald-500',
							pct: data?.totalRevenue
								? Math.round(((data?.totalPayouts ?? 0) / data.totalRevenue) * 100)
								: 0,
						},
					].map((item) => (
						<div key={item.label}>
							<div className="flex justify-between mb-1.5">
								<span className="text-sm text-gray-400 font-heading">
									{item.label}
								</span>
								<span className="text-sm font-heading font-600 text-white">
									{formatKwanza(item.value)}
								</span>
							</div>
							<div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full ${item.color} transition-all duration-700`}
									style={{ width: `${item.pct}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
