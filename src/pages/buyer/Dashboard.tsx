import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useOrders } from '../../api/hooks/useOrders'
import type { OrderDisplay } from '../../api/hooks/useOrders'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza } from '../../lib/format'

const statusVariant: Record<string, 'emerald' | 'amber' | 'red'> = {
	confirmed: 'emerald',
	pending: 'amber',
	cancelled: 'red',
}

export function BuyerDashboard() {
	const user = useAuthStore((s) => s.user)
	const { data, isLoading } = useOrders()

	const confirmedOrders =
		data?.orders?.filter((o: OrderDisplay) => o.status === 'confirmed') ?? []
	const totalSpent = confirmedOrders.reduce(
		(s: number, o: OrderDisplay) => s + ((o as any).totalAmount ?? 0),
		0,
	)

	return (
		<div className="space-y-8">
			{/* Welcome */}
			<div>
				<h1 className="font-heading font-700 text-2xl">Olá, {user?.name?.split(' ')[0]}</h1>
				<p className="text-text-secondary text-sm">A tua conta de comprador</p>
			</div>

			{/* Stats */}
			<div className="grid sm:grid-cols-3 gap-4">
				<Card>
					<p className="text-xs text-text-secondary mb-1">Total Gasto</p>
					<p className="font-heading font-700 text-2xl text-brand">
						{formatKwanza(totalSpent)}
					</p>
				</Card>
				<Card>
					<p className="text-xs text-text-secondary mb-1">Bilhetes Comprados</p>
					<p className="font-heading font-700 text-2xl">
						{confirmedOrders.reduce(
							(s: number, o: OrderDisplay) =>
								s + (o.items?.reduce((s2, i) => s2 + (i.quantity ?? 0), 0) ?? 0),
							0,
						)}
					</p>
				</Card>
				<Card>
					<p className="text-xs text-text-secondary mb-1">Eventos</p>
					<p className="font-heading font-700 text-2xl">
						{new Set(confirmedOrders.map((o) => o.eventId)).size}
					</p>
				</Card>
			</div>

			{/* Quick actions */}
			<div className="flex flex-wrap gap-3">
				<Link to="/events" className="btn-brand h-11 px-6 text-sm rounded-xl">
					Explorar Eventos
				</Link>
				<Link to="/account/tickets" className="btn-outline h-11 px-6 text-sm rounded-xl">
					Os Meus Bilhetes
				</Link>
			</div>

			{/* Recent orders */}
			<div>
				<h2 className="font-heading font-700 text-lg mb-4">Compras Recentes</h2>
				{isLoading ? (
					<div className="space-y-3">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="rounded-xl border border-border p-4 flex items-center gap-4"
							>
								<Skeleton className="w-16 h-16 rounded-xl shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-3 w-32" />
								</div>
								<div className="space-y-2 text-right">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</div>
						))}
					</div>
				) : data?.orders && data.orders.length > 0 ? (
					<div className="space-y-3">
						{data.orders.slice(0, 5).map((order: OrderDisplay) => (
							<Card key={order.id} className="flex items-center gap-4">
								<img
									src={order.eventImage}
									alt={order.eventTitle}
									className="w-16 h-16 rounded-xl object-cover shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<Link
										to={`/events/${order.eventSlug}`}
										className="font-heading font-600 text-sm hover:text-brand transition-colors"
									>
										{order.eventTitle}
									</Link>
									<p className="text-xs text-text-secondary">
										{formatDate(order.eventDate ?? '')}
									</p>
									<p className="text-xs text-text-secondary">
										{order.items
											?.map((i) => `${i.quantity}x ${i.ticketTypeName}`)
											.join(', ')}
									</p>
								</div>
								<div className="text-right shrink-0">
									<p className="font-heading font-700 text-sm">
										{formatKwanza((order as any).totalAmount ?? 0)}
									</p>
									<Badge variant={statusVariant[order.status ?? ''] ?? 'gray'}>
										{order.status === 'confirmed'
											? 'Confirmado'
											: order.status === 'pending'
												? 'Pendente'
												: 'Cancelado'}
									</Badge>
								</div>
							</Card>
						))}
					</div>
				) : (
					<Card className="text-center py-8">
						<p className="text-text-secondary mb-2">Ainda não fizeste nenhuma compra</p>
						<Link to="/events" className="btn-brand text-sm h-10 px-5">
							Explorar Eventos
						</Link>
					</Card>
				)}
			</div>
		</div>
	)
}
