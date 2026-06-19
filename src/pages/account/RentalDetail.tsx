import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRental } from '../../api/hooks/useRentals'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
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

export function RentalDetailPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data, isLoading, error } = useRental(id ?? '')

	const rental = data?.rental

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
			</div>
		)
	}

	if (error || !rental) {
		return (
			<div className="max-w-4xl mx-auto text-center py-16">
				<p className="font-heading font-600 text-warm-text mb-4">Aluguer não encontrado</p>
				<Button onClick={() => navigate('/account/rentals')}>Voltar</Button>
			</div>
		)
	}

	const orderStatus = rental.order?.status ?? ''

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Back + Title */}
			<div className="flex items-center gap-4 stagger-1">
				<button
					onClick={() => navigate('/account/rentals')}
					className="w-9 h-9 rounded-xl border border-warm-border flex items-center justify-center hover:bg-gray-50 transition-colors"
				>
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
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</button>
				<div>
					<h1 className="font-display-alt font-700 text-2xl text-warm-text">
						Detalhes do Aluguer
					</h1>
					<p className="text-text-secondary text-sm">
						{rental.vehicle?.make} {rental.vehicle?.model}
					</p>
				</div>
				<div className="ml-auto">
					<Badge
						variant={statusVariant[orderStatus] ?? 'gray'}
						className="text-sm px-4 py-1.5"
					>
						{statusLabel[orderStatus] ?? orderStatus}
					</Badge>
				</div>
			</div>

			{/* Vehicle Card */}
			<div className="card-account stagger-2">
				<div className="p-6 sm:p-8">
					<div className="flex items-start gap-4">
						{rental.vehicle?.photos?.[0] ? (
							<img
								src={rental.vehicle.photos[0]}
								alt={`${rental.vehicle.make} ${rental.vehicle.model}`}
								className="w-24 h-24 rounded-xl object-cover shrink-0"
							/>
						) : (
							<div className="w-24 h-24 rounded-xl bg-warm-bg flex items-center justify-center shrink-0">
								<svg
									width="32"
									height="32"
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
						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="font-heading font-700 text-lg text-warm-text">
										{rental.vehicle?.make} {rental.vehicle?.model}
									</h2>
									<p className="text-text-secondary text-xs font-mono tracking-wider">
										{rental.vehicle?.plate}
									</p>
								</div>
								{rental.vehicle?.id && (
									<Link
										to={`/rentals/${rental.vehicle.id}`}
										className="text-xs font-heading font-600 text-brand link-underline shrink-0 ml-4"
									>
										Ver Viatura
									</Link>
								)}
							</div>
							{(rental.vehicle?.transmission ||
								rental.vehicle?.seats ||
								rental.vehicle?.fuelType) && (
								<div className="flex items-center gap-3 text-xs text-text-secondary mt-2 flex-wrap">
									{rental.vehicle.transmission && (
										<span>
											{rental.vehicle.transmission === 'auto'
												? 'Automática'
												: 'Manual'}
										</span>
									)}
									{rental.vehicle.seats && (
										<span>{rental.vehicle.seats} lugares</span>
									)}
									{rental.vehicle.fuelType && (
										<span>{rental.vehicle.fuelType}</span>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Info Grid */}
			<div className="grid sm:grid-cols-2 gap-4 stagger-3">
				<div className="card-account">
					<div className="p-6">
						<h4 className="font-heading font-600 text-xs text-text-secondary uppercase tracking-wider mb-3">
							Período
						</h4>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-text-secondary">Início</span>
								<span className="font-heading font-600 text-warm-text">
									{rental.startDate ? formatDate(rental.startDate) : '—'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Fim</span>
								<span className="font-heading font-600 text-warm-text">
									{rental.endDate ? formatDate(rental.endDate) : '—'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Dias</span>
								<span className="font-heading font-600 text-warm-text">
									{rental.totalDays}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="card-account">
					<div className="p-6">
						<h4 className="font-heading font-600 text-xs text-text-secondary uppercase tracking-wider mb-3">
							Pagamento
						</h4>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-text-secondary">Método</span>
								<span className="font-heading font-600 text-warm-text">
									{rental.order?.paymentMethod ?? '—'}
								</span>
							</div>
							{rental.order?.multicaixaReference && (
								<div className="flex justify-between">
									<span className="text-text-secondary">Referência</span>
									<span className="font-heading font-600 text-warm-text font-mono text-xs">
										{rental.order.multicaixaReference}
									</span>
								</div>
							)}
							{rental.order?.paypayReference && (
								<div className="flex justify-between">
									<span className="text-text-secondary">Referência</span>
									<span className="font-heading font-600 text-warm-text font-mono text-xs">
										{rental.order.paypayReference}
									</span>
								</div>
							)}
							{rental.order && (
								<div className="flex justify-between pt-2 border-t border-warm-border">
									<span className="font-heading font-600 text-warm-text">
										Total
									</span>
									<span className="font-heading font-700 text-lg text-brand">
										{formatKwanza(rental.order.totalAmount)}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Event (if associated) */}
			{rental.event && (
				<div className="card-account stagger-4">
					<div className="p-6">
						<h4 className="font-heading font-600 text-xs text-text-secondary uppercase tracking-wider mb-3">
							Evento Associado
						</h4>
						<div className="flex items-center gap-4">
							<div className="flex-1">
								<p className="font-heading font-600 text-sm text-warm-text">
									{rental.event.title}
								</p>
								<p className="text-xs text-text-secondary">
									{rental.event.startDate && formatDate(rental.event.startDate)}
									{rental.event.endDate &&
										` — ${formatDate(rental.event.endDate)}`}
								</p>
								{rental.event.location && (
									<p className="text-xs text-text-secondary">
										{rental.event.location}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Order Link */}
			{rental.orderId && (
				<div className="stagger-5">
					<Link
						to={`/account/orders/${rental.orderId}`}
						className="inline-flex items-center gap-2 h-11 px-5 border-2 border-warm-border text-text-secondary font-heading font-600 text-sm rounded-xl hover:bg-gray-50 hover:text-text transition-all"
					>
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
							<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
						</svg>
						Ver Encomenda
					</Link>
				</div>
			)}
		</div>
	)
}
