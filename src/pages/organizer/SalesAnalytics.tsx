import { useParams } from 'react-router-dom'
import {
	useOrganizerEvent,
	useOrganizerEventSales,
	usePauseSales,
} from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'
import { formatKwanza, formatDate } from '../../lib/format'
import type { SalesOrder } from '../../types/event'

export function SalesAnalytics() {
	const { id } = useParams<{ id: string }>()
	const { data: eventData } = useOrganizerEvent(id ?? '')
	const { data: salesData, isLoading } = useOrganizerEventSales(id ?? '')
	const pauseSales = usePauseSales()

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="grid sm:grid-cols-3 gap-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="rounded-xl border border-border p-5 space-y-2">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-8 w-32" />
						</div>
					))}
				</div>
				<div className="rounded-xl border border-border p-5">
					<Skeleton className="h-5 w-20 mb-4" />
					<SkeletonTable rows={5} cols={2} />
				</div>
			</div>
		)
	}

	const event = eventData?.event
	const sales = salesData

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="font-heading font-700 text-2xl">Vendas</h1>
					<p className="text-text-secondary text-sm">{event?.title}</p>
				</div>
				{event?.status === 'PUBLISHED' && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => pauseSales.mutate(id!)}
						loading={pauseSales.isPending}
						className={event.salesPaused ? 'text-emerald-500' : 'text-amber-500'}
					>
						{event.salesPaused ? 'Retomar Vendas' : 'Pausar Vendas'}
					</Button>
				)}
			</div>

			<div className="grid sm:grid-cols-3 gap-4">
				<Card>
					<p className="text-xs text-text-secondary mb-1">Total Vendido</p>
					<p className="font-heading font-700 text-2xl text-brand">
						{formatKwanza(sales?.totalSold ?? 0)}
					</p>
				</Card>
				<Card>
					<p className="text-xs text-text-secondary mb-1">Bilhetes Vendidos</p>
					<p className="font-heading font-700 text-2xl">{sales?.totalTickets ?? 0}</p>
				</Card>
				<Card>
					<p className="text-xs text-text-secondary mb-1">Pedidos</p>
					<p className="font-heading font-700 text-2xl">{sales?.ordersCount ?? 0}</p>
				</Card>
			</div>

			<Card>
				<h3 className="font-heading font-600 text-base mb-4">Pedidos</h3>
				{sales?.orders && sales.orders.length > 0 ? (
					<div className="space-y-2">
						{sales.orders.map((order: SalesOrder) => (
							<div
								key={order.id}
								className="flex items-center justify-between py-2 border-b border-border last:border-0"
							>
								<div>
									<p className="text-sm font-heading font-600">
										{order.buyerName}
									</p>
									<p className="text-xs text-text-secondary">
										{order.items
											?.map((i) => `${i.quantity}x ${i.ticketTypeName}`)
											.join(', ')}{' '}
										· {formatDate(order.createdAt)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-heading font-600">
										{formatKwanza(order.total ?? 0)}
									</p>
									<Badge
										variant={
											order.status === 'confirmed' || order.status === 'paid'
												? 'emerald'
												: order.status === 'pending'
													? 'amber'
													: 'red'
										}
									>
										{order.status === 'confirmed' || order.status === 'paid'
											? 'Confirmado'
											: order.status === 'pending'
												? 'Pendente'
												: 'Cancelado'}
									</Badge>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-text-secondary text-sm text-center py-6">
						Nenhuma venda ainda
					</p>
				)}
			</Card>
		</div>
	)
}
