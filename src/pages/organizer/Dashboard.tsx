import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useOrganizerSales } from '../../api/hooks/useSales'
import type { SalesOrder } from '../../api/hooks/useSales'
import { Card } from '../../components/ui/Card'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'
import { formatKwanza, formatDate } from '../../lib/format'

export function OrganizerDashboard() {
	const user = useAuthStore((s) => s.user)
	const { data, isLoading } = useOrganizerSales()

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="rounded-xl border border-border p-5 space-y-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-8 w-32" />
						</div>
					))}
				</div>
				<div className="rounded-xl border border-border p-5">
					<Skeleton className="h-5 w-28 mb-4" />
					<SkeletonTable rows={5} cols={2} />
				</div>
			</div>
		)
	}

	const stats = [
		{
			label: 'Receita Total',
			value: formatKwanza(data?.totalRevenue ?? 0),
			color: 'text-brand',
		},
		{
			label: 'Bilhetes Vendidos',
			value: String(data?.totalTickets ?? 0),
			color: 'text-text',
		},
		{
			label: 'Pedidos',
			value: String(data?.totalOrders ?? 0),
			color: 'text-text',
		},
		{
			label: 'Saldo a Receber',
			value: formatKwanza(data?.balance ?? 0),
			color: 'text-emerald-600',
		},
	]

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-heading font-700 text-2xl">Painel do Organizador</h1>
				<p className="text-text-secondary text-sm">
					{user?.name} · {data?.totalOrders ?? 0} venda
					{data?.totalOrders !== 1 ? 's' : ''}
				</p>
			</div>

			{/* Stats grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<p className="text-xs text-text-secondary mb-1">{stat.label}</p>
						<p className={`font-heading font-700 text-2xl ${stat.color}`}>
							{stat.value}
						</p>
					</Card>
				))}
			</div>

			{/* Quick actions */}
			<div className="flex flex-wrap gap-3">
				<Link to="/organizer/events/new" className="btn-brand h-11 px-6 text-sm">
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
						<path d="M12 5v14M5 12h14" />
					</svg>
					Criar Evento
				</Link>
				<Link to="/organizer/events" className="btn-outline h-11 px-6 text-sm">
					Gerir Eventos
				</Link>
				<Link to="/validate" className="btn-outline h-11 px-6 text-sm">
					Validar Bilhetes
				</Link>
			</div>

			{/* Recent orders */}
			<Card>
				<h3 className="font-heading font-600 text-base mb-4">Últimas Vendas</h3>
				{data?.orders && data.orders.length > 0 ? (
					<div className="space-y-2">
						{data.orders.slice(0, 10).map((order: SalesOrder) => (
							<div
								key={order.id}
								className="flex items-center justify-between py-2 border-b border-border last:border-0"
							>
								<div>
									<p className="text-sm font-heading font-600">
										{order.eventTitle}
									</p>
									<p className="text-xs text-text-secondary">
										{order.buyerName} · {formatDate(order.createdAt ?? '')}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-heading font-600">
										{formatKwanza(order.total ?? 0)}
									</p>
									<span
										className={`text-xs ${
											order.status === 'confirmed'
												? 'text-emerald-600'
												: order.status === 'pending'
													? 'text-amber-600'
													: 'text-red-600'
										}`}
									>
										{order.status === 'confirmed'
											? 'Confirmado'
											: order.status === 'pending'
												? 'Pendente'
												: 'Cancelado'}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-text-secondary text-sm text-center py-6">
						Nenhuma venda ainda. Cria o teu primeiro evento!
					</p>
				)}
			</Card>
		</div>
	)
}
