import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../../api/hooks/useOrders'
import { usePayOrder, useCancelOrder } from '../../api/hooks/useAccount'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza } from '../../lib/format'
import { toast } from 'react-hot-toast'

const statusVariant: Record<string, 'emerald' | 'amber' | 'red' | 'gray'> = {
	confirmed: 'emerald',
	paid: 'emerald',
	pending: 'amber',
	cancelled: 'red',
	refunded: 'red',
}

const statusLabel: Record<string, string> = {
	confirmed: 'Confirmado',
	paid: 'Pago',
	pending: 'Pendente',
	cancelled: 'Cancelado',
	refunded: 'Reembolsado',
}

export function OrdersPage() {
	const { data, isLoading } = useOrders()
	const payOrder = usePayOrder()
	const cancelOrder = useCancelOrder()
	const [filter, setFilter] = useState<string>('all')

	const orders = data?.orders ?? []
	const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

	const handlePay = async (id: string) => {
		try {
			await payOrder.mutateAsync(id)
			toast.success('Pagamento confirmado!')
		} catch {
			toast.error('Erro ao processar pagamento')
		}
	}

	const handleCancel = async (id: string) => {
		if (!confirm('Tens a certeza que queres cancelar esta encomenda?')) return
		try {
			await cancelOrder.mutateAsync(id)
			toast.success('Encomenda cancelada')
		} catch {
			toast.error('Erro ao cancelar encomenda')
		}
	}

	const filters = [
		{ value: 'all', label: 'Todas' },
		{ value: 'confirmed', label: 'Confirmadas' },
		{ value: 'pending', label: 'Pendentes' },
		{ value: 'cancelled', label: 'Canceladas' },
	]

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="stagger-1">
				<h1 className="font-display-alt font-700 text-3xl text-warm-text">
					As Minhas Compras
				</h1>
				<p className="text-text-secondary text-sm">
					{isLoading
						? '...'
						: `${orders.length} encomenda${orders.length !== 1 ? 's' : ''}`}
				</p>
			</div>

			{/* Filters */}
			<div className="flex gap-2 flex-wrap stagger-2">
				{filters.map((f) => (
					<button
						key={f.value}
						onClick={() => setFilter(f.value)}
						className={`px-4 py-2 rounded-xl text-sm font-heading font-600 transition-all ${
							filter === f.value
								? 'bg-brand text-white shadow-sm'
								: 'bg-white border border-warm-border text-text-secondary hover:border-brand/30 hover:text-text'
						}`}
					>
						{f.label}
					</button>
				))}
			</div>

			{/* Orders List */}
			{isLoading ? (
				<div className="space-y-3">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-warm-border bg-white p-5 flex items-center gap-4"
						>
							<Skeleton className="w-16 h-16 rounded-xl shrink-0" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-3 w-32" />
								<Skeleton className="h-3 w-40" />
							</div>
							<div className="space-y-2 text-right">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-5 w-20 rounded-full" />
							</div>
						</div>
					))}
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="rounded-xl border-2 border-dashed border-warm-border bg-white/50 p-16 text-center">
					<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-brand"
						>
							<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<p className="font-heading font-600 text-warm-text">
						{filter === 'all'
							? 'Nenhuma compra encontrada'
							: `Nenhuma compra com estado "${statusLabel[filter] ?? filter}"`}
					</p>
					<Link
						to="/events"
						className="inline-flex items-center gap-2 mt-4 h-10 px-5 bg-brand text-white font-heading font-600 text-sm rounded-xl hover:bg-brand-dark transition-all"
					>
						Explorar Eventos
					</Link>
				</div>
			) : (
				<div className="space-y-3 stagger-3">
					{filteredOrders.map((order) => (
						<div
							key={order.id}
							className="rounded-xl border border-warm-border bg-white p-5 hover:shadow-md transition-shadow group"
						>
							<div className="flex items-start gap-4">
								{order.eventImage ? (
									<img
										src={order.eventImage}
										alt={order.eventTitle}
										className="w-16 h-16 rounded-xl object-cover shrink-0"
									/>
								) : (
									<div className="w-16 h-16 rounded-xl bg-warm-bg flex items-center justify-center shrink-0">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											className="text-text-secondary"
										>
											<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
											<circle cx="6.5" cy="16.5" r="2.5" />
											<circle cx="16.5" cy="16.5" r="2.5" />
										</svg>
									</div>
								)}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4">
										<div>
											<Link
												to={`/account/orders/${order.id}`}
												className="font-heading font-600 text-sm text-warm-text hover:text-brand transition-colors"
											>
												{order.eventTitle ?? 'Aluguer de viatura'}
											</Link>
											<p className="text-xs text-text-secondary mt-0.5">
												{order.eventDate
													? formatDate(order.eventDate)
													: (order as any).rentals?.[0]?.startDate
														? `${formatDate((order as any).rentals[0].startDate)} — ${formatDate((order as any).rentals[0].endDate)}`
														: '—'}
											</p>
											<p className="text-xs text-text-secondary mt-0.5">
												{order.items?.length
													? order.items
															.map(
																(i) =>
																	`${i.quantity}x ${i.ticketTypeName}`,
															)
															.join(', ')
													: (order as any).rentals?.length
														? `${(order as any).rentals.length} aluguer${(order as any).rentals.length > 1 ? 'es' : ''}`
														: ''}
											</p>
										</div>
										<div className="text-right shrink-0">
											<p className="font-heading font-700 text-sm text-warm-text">
												{formatKwanza((order as any).totalAmount ?? 0)}
											</p>
											<Badge
												variant={
													statusVariant[order.status ?? ''] ?? 'gray'
												}
												className="mt-1"
											>
												{statusLabel[order.status ?? ''] ?? order.status}
											</Badge>
										</div>
									</div>
									<div className="flex items-center gap-2 mt-3 pt-3 border-t border-warm-border">
										<Link
											to={`/account/orders/${order.id}`}
											className="text-xs font-heading font-600 text-brand hover:text-brand-dark link-underline"
										>
											Ver Detalhes
										</Link>
										{order.status === 'pending' && (
											<>
												<span className="text-warm-border">|</span>
												<button
													onClick={() => handlePay(order.id ?? '')}
													disabled={payOrder.isPending}
													className="text-xs font-heading font-600 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
												>
													Pagar Agora
												</button>
												<span className="text-warm-border">|</span>
												<button
													onClick={() => handleCancel(order.id ?? '')}
													disabled={cancelOrder.isPending}
													className="text-xs font-heading font-600 text-red-500 hover:text-red-600 disabled:opacity-50"
												>
													Cancelar
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
