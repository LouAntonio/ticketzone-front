import { Link } from 'react-router-dom'
import { useMyRentals } from '../../api/hooks/useRentals'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza } from '../../lib/format'

const statusVariant: Record<string, 'emerald' | 'amber' | 'red' | 'gray'> = {
	PAID: 'emerald',
	paid: 'emerald',
	PENDING: 'amber',
	pending: 'amber',
	CANCELLED: 'red',
	cancelled: 'red',
	REFUNDED: 'red',
	refunded: 'red',
}

const statusLabel: Record<string, string> = {
	PAID: 'Pago',
	paid: 'Pago',
	PENDING: 'Pendente',
	pending: 'Pendente',
	CANCELLED: 'Cancelado',
	cancelled: 'Cancelado',
	REFUNDED: 'Reembolsado',
	refunded: 'Reembolsado',
}

export function MyRentalsPage() {
	const { data, isLoading } = useMyRentals()

	const rentals = data?.rentals ?? []

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="stagger-1">
				<h1 className="font-display-alt font-700 text-3xl text-warm-text">
					Os Meus Alugueres
				</h1>
				<p className="text-text-secondary text-sm">
					{isLoading
						? '...'
						: `${rentals.length} aluguer${rentals.length !== 1 ? 'es' : ''}`}
				</p>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-warm-border bg-white p-5 flex items-center gap-4"
						>
							<Skeleton className="w-20 h-20 rounded-xl shrink-0" />
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
			) : rentals.length === 0 ? (
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
							<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
							<circle cx="6.5" cy="16.5" r="2.5" />
							<circle cx="16.5" cy="16.5" r="2.5" />
						</svg>
					</div>
					<p className="font-heading font-600 text-warm-text mb-1">
						Nenhum aluguer encontrado
					</p>
					<p className="text-text-secondary text-sm mb-6">
						Ainda não alugaste nenhuma viatura
					</p>
					<Link
						to="/rentals"
						className="inline-flex items-center gap-2 h-11 px-6 bg-brand text-white font-heading font-600 text-sm rounded-xl hover:bg-brand-dark transition-all"
					>
						Explorar Viaturas
					</Link>
				</div>
			) : (
				<div className="space-y-3">
					{rentals.map((rental, i) => (
						<Link
							key={rental.id}
							to={`/account/rentals/${rental.id}`}
							className={`block rounded-xl border border-warm-border bg-white p-5 hover:shadow-md hover:border-brand/20 transition-all group stagger-${Math.min(i + 1, 5)}`}
						>
							<div className="flex items-start gap-4">
								<div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
									{rental.vehicle?.photos?.[0] ? (
										<img
											src={rental.vehicle.photos[0]}
											alt={`${rental.vehicle.make} ${rental.vehicle.model}`}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-text-secondary">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
											>
												<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
												<circle cx="6.5" cy="16.5" r="2.5" />
												<circle cx="16.5" cy="16.5" r="2.5" />
											</svg>
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-heading font-600 text-sm text-warm-text group-hover:text-brand transition-colors">
												{rental.vehicle?.make} {rental.vehicle?.model}
											</p>
											<p className="text-xs text-text-secondary mt-0.5 font-mono tracking-wider">
												{rental.vehicle?.plate}
											</p>
											<p className="text-xs text-text-secondary mt-1">
												{rental.startDate
													? formatDate(rental.startDate)
													: '—'}{' '}
												—{' '}
												{rental.endDate ? formatDate(rental.endDate) : '—'}
												{rental.totalDays > 0 &&
													` · ${rental.totalDays} dia${rental.totalDays > 1 ? 's' : ''}`}
											</p>
											{rental.event && (
												<p className="text-xs text-text-secondary mt-0.5">
													Evento: {rental.event.title}
												</p>
											)}
										</div>
										<div className="text-right shrink-0">
											<p className="font-heading font-700 text-sm text-warm-text">
												{formatKwanza(rental.totalPrice)}
											</p>
											<Badge
												variant={
													statusVariant[rental.order?.status ?? ''] ??
													'gray'
												}
												className="mt-1"
											>
												{statusLabel[rental.order?.status ?? ''] ??
													rental.order?.status ??
													'—'}
											</Badge>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
