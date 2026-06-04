import { useOrganizerAttendees } from '../../api/hooks/useSales'
import type { SalesOrder } from '../../api/hooks/useSales'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate, formatKwanza } from '../../lib/format'

export function AttendeeList() {
	const { data, isLoading } = useOrganizerAttendees()

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const attendees = data?.attendees ?? []

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-heading font-700 text-2xl">Participantes</h1>
				<p className="text-text-secondary text-sm">
					{attendees.length} participante{attendees.length !== 1 ? 's' : ''}
				</p>
			</div>

			{attendees.length === 0 ? (
				<Card className="text-center py-12">
					<p className="text-text-secondary">Nenhum participante registado ainda</p>
				</Card>
			) : (
				<Card className="overflow-hidden !p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-gray-50">
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Comprador
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Evento
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Ingressos
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Total
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Estado
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Data
									</th>
								</tr>
							</thead>
							<tbody>
								{attendees.map((order: SalesOrder) => (
									<tr
										key={order.id}
										className="border-b border-border last:border-0 hover:bg-gray-50/50"
									>
										<td className="px-4 py-3 font-heading font-600">
											{order.buyerName}
										</td>
										<td className="px-4 py-3 text-text-secondary">
											{order.eventTitle}
										</td>
										<td className="px-4 py-3">
											{order.items
												?.map((i) => `${i.quantity}x ${i.ticketTypeName}`)
												.join(', ')}
										</td>
										<td className="px-4 py-3 font-heading font-600">
											{formatKwanza(order.total ?? 0)}
										</td>
										<td className="px-4 py-3">
											<Badge
												variant={
													order.status === 'confirmed'
														? 'emerald'
														: order.status === 'pending'
															? 'amber'
															: 'red'
												}
											>
												{order.status === 'confirmed'
													? 'Confirmado'
													: order.status === 'pending'
														? 'Pendente'
														: 'Cancelado'}
											</Badge>
										</td>
										<td className="px-4 py-3 text-text-secondary text-xs">
											{formatDate(order.createdAt ?? '')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			)}
		</div>
	)
}
