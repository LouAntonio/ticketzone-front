import { Link } from 'react-router-dom'
import { useOrganizerEvents, usePauseSales } from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatKwanza, formatDate } from '../../lib/format'

const statusConfig: Record<
	string,
	{ label: string; variant: 'emerald' | 'gray' | 'red' | 'amber' }
> = {
	PUBLISHED: { label: 'Publicado', variant: 'emerald' },
	HIDDEN: { label: 'Por Aprovar', variant: 'amber' },
	CANCELLED: { label: 'Cancelado', variant: 'red' },
}

export function EventList() {
	const { data, isLoading } = useOrganizerEvents()
	const pauseSales = usePauseSales()

	const events = data?.events ?? []

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading font-700 text-2xl">Os Meus Eventos</h1>
					<p className="text-text-secondary text-sm">
						{events.length} evento{events.length !== 1 ? 's' : ''}
					</p>
				</div>
				<Link to="/organizer/events/new">
					<Button>
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
						Novo Evento
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="rounded-xl border border-border p-4 flex gap-4">
							<Skeleton className="w-24 h-24 rounded-xl shrink-0" />
							<div className="flex-1 space-y-3">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<Skeleton className="h-5 w-48" />
										<Skeleton className="h-3 w-36" />
										<div className="flex gap-2">
											<Skeleton className="h-5 w-20 rounded-full" />
											<Skeleton className="h-5 w-16 rounded-full" />
										</div>
									</div>
									<div className="space-y-1 text-right">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-3 w-16" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : events.length === 0 ? (
				<Card className="text-center py-12">
					<p className="text-text-secondary mb-4">Nenhum evento criado ainda</p>
					<Link to="/organizer/events/new">
						<Button>Criar Primeiro Evento</Button>
					</Link>
				</Card>
			) : (
				<div className="space-y-4">
					{events.map((event) => {
						const statusInfo = statusConfig[event.status] ?? {
							label: event.status,
							variant: 'gray' as const,
						}
						const minPrice =
							event.batches?.length > 0
								? Math.min(...event.batches.map((b) => b.price))
								: 0
						return (
							<Card key={event.id}>
								<div className="flex gap-4">
									<img
										src={event.bannerUrl || '/event-placeholder.jpg'}
										alt={event.title}
										className="w-24 h-24 rounded-xl object-cover shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4">
											<div>
												<h3 className="font-heading font-600 text-base">
													{event.title}
												</h3>
												<p className="text-xs text-text-secondary mt-0.5">
													{formatDate(event.startDate)} · {event.location}
												</p>
												<div className="flex items-center gap-2 mt-2">
													<Badge variant={statusInfo.variant}>
														{statusInfo.label}
													</Badge>
													{event.salesPaused && (
														<Badge variant="red">Vendas Pausadas</Badge>
													)}
													{event.eventCategories?.map((ec) => (
														<Badge key={ec.category.id}>
															{ec.category.name}
														</Badge>
													))}
												</div>
											</div>
											<div className="text-right shrink-0">
												<p className="text-sm font-heading font-600 text-brand">
													{minPrice > 0 ? formatKwanza(minPrice) : '—'}
												</p>
												<p className="text-xs text-text-secondary">
													{event.batches?.length ?? 0} lote
													{event.batches?.length !== 1 ? 's' : ''}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 mt-3">
											<Link
												to={`/organizer/events/${event.id}`}
												className="btn-ghost h-8 px-3 text-xs rounded-lg"
											>
												Editar
											</Link>
											<Link
												to={`/organizer/events/${event.id}/sales`}
												className="btn-ghost h-8 px-3 text-xs rounded-lg"
											>
												Vendas
											</Link>
											<Link
												to={`/organizer/events/${event.id}/staff`}
												className="btn-ghost h-8 px-3 text-xs rounded-lg"
											>
												Validadores
											</Link>
											{event.status === 'PUBLISHED' && (
												<button
													type="button"
													onClick={() => pauseSales.mutate(event.id)}
													disabled={pauseSales.isPending}
													className={`btn-ghost h-8 px-3 text-xs rounded-lg ${
														event.salesPaused
															? 'text-emerald-500 hover:text-emerald-600'
															: 'text-amber-500 hover:text-amber-600'
													}`}
												>
													{event.salesPaused
														? 'Retomar Vendas'
														: 'Pausar Vendas'}
												</button>
											)}
										</div>
									</div>
								</div>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
