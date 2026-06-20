import { useState } from 'react'
import { useOrganizerAttendees, useOrganizerEvents } from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza } from '../../lib/format'
import type { SalesOrder } from '../../types/event'

export function AttendeeList() {
	const [selectedEventId, setSelectedEventId] = useState<string>('')
	const { data: eventsData } = useOrganizerEvents()
	const { data, isLoading } = useOrganizerAttendees(selectedEventId || undefined)

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-36" />
				</div>
				<div className="rounded-xl border border-border overflow-hidden p-5">
					<SkeletonTable rows={6} cols={7} />
				</div>
			</div>
		)
	}

	const attendees = data?.attendees ?? []

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading font-700 text-2xl">Participantes</h1>
					<p className="text-text-secondary text-sm">
						{attendees.length} participante{attendees.length !== 1 ? 's' : ''}
					</p>
				</div>
				<select
					value={selectedEventId}
					onChange={(e) => setSelectedEventId(e.target.value)}
					className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				>
					<option value="">Todos os eventos</option>
					{eventsData?.events?.map((event) => (
						<option key={event.id} value={event.id}>
							{event.title}
						</option>
					))}
				</select>
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
										Add-ons
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
											<div className="space-y-0.5">
												{order.items?.map((i, idx) => (
													<div key={idx} className="text-sm whitespace-nowrap">
														{i.quantity}x {i.ticketTypeName}
													</div>
												))}
											</div>
										</td>
										<td className="px-4 py-3">
											{order.addons?.length ? (
												<div className="space-y-0.5">
													{order.addons.map((a, idx) => (
														<div key={idx} className="text-xs text-text-secondary whitespace-nowrap">
															{a.quantity}x {a.name}
														</div>
													))}
												</div>
											) : (
												<span className="text-xs text-text-secondary">—</span>
											)}
										</td>
										<td className="px-4 py-3 font-heading font-600 whitespace-nowrap">
											{formatKwanza(order.total)}
										</td>
										<td className="px-4 py-3">
											<Badge
												variant={
													order.status === 'confirmed' ||
													order.status === 'paid'
														? 'emerald'
														: order.status === 'pending'
															? 'amber'
															: 'red'
												}
											>
												{order.status === 'confirmed' ||
												order.status === 'paid'
													? 'Confirmado'
													: order.status === 'pending'
														? 'Pendente'
														: 'Cancelado'}
											</Badge>
										</td>
										<td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
											{formatDate(order.createdAt)}
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
