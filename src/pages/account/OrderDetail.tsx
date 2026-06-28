import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrder, useCancelOrder } from '../../api/hooks/useAccount'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { formatDate, formatKwanza } from '../../lib/format'
import { ReactQRCode } from '@lglab/react-qr-code'
import { toast } from 'react-hot-toast'

const statusVariant: Record<string, 'emerald' | 'amber' | 'red' | 'gray'> = {
	paid: 'emerald',
	pending: 'amber',
	cancelled: 'red',
	refunded: 'red',
}

const statusLabel: Record<string, string> = {
	paid: 'Pago',
	pending: 'Pendente',
	cancelled: 'Cancelado',
	refunded: 'Reembolsado',
}

const paymentMethodLabel: Record<string, string> = {
	multicaixa_express: 'Multicaixa Express',
	multicaixa_reference: 'Referência Multicaixa',
	paypay: 'PayPay',
	reference: 'Referência Multicaixa',
}

export function OrderDetailPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data: order, isLoading, error } = useOrder(id ?? '')
	const cancelOrder = useCancelOrder()

	const handleCancel = async () => {
		if (!id) return
		if (!confirm('Tens a certeza que queres cancelar esta encomenda?')) return
		try {
			await cancelOrder.mutateAsync(id)
			toast.success('Encomenda cancelada')
		} catch {
			toast.error('Erro ao cancelar encomenda')
		}
	}

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-48 w-full rounded-xl" />
				<Skeleton className="h-32 w-full rounded-xl" />
			</div>
		)
	}

	if (error || !order) {
		return (
			<div className="max-w-4xl mx-auto text-center py-16">
				<p className="font-heading font-600 text-warm-text mb-4">
					Encomenda não encontrada
				</p>
				<Button onClick={() => navigate('/account/orders')}>Voltar</Button>
			</div>
		)
	}

	const orderStatus = order.status ?? ''
	const isPending = orderStatus === 'pending'

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Back + Title */}
			<div className="flex items-center gap-4 stagger-1">
				<button
					onClick={() => navigate('/account/orders')}
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
						Detalhes da Encomenda
					</h1>
					<p className="text-text-secondary text-sm">
						{order.eventTitle
							? `${order.eventTitle} · ${formatDate(order.eventDate ?? '')}`
							: 'Aluguer de viatura'}
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

			{/* Event Info */}
			<div className="card-account stagger-2">
				<div className="p-6 sm:p-8">
					<div className="flex items-start gap-4">
						{order.eventImage && (
							<img
								src={order.eventImage}
								alt={order.eventTitle}
								className="w-20 h-20 rounded-xl object-cover shrink-0"
							/>
						)}
						<div className="flex-1">
							<h2 className="font-heading font-700 text-lg text-warm-text">
								{order.eventTitle}
							</h2>
							{(order.eventVenue || order.eventProvince) && (
								<p className="text-text-secondary text-sm mt-1">
									{order.eventVenue && `${order.eventVenue}, `}
									{order.eventProvince}
								</p>
							)}
							{order.eventStartDate && (
								<p className="text-text-secondary text-sm">
									{formatDate(order.eventStartDate)}
									{order.eventEndDate && ` — ${formatDate(order.eventEndDate)}`}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Order Info Grid */}
			<div className="grid sm:grid-cols-2 gap-4 stagger-3">
				<div className="card-account">
					<div className="p-6">
						<h4 className="font-heading font-600 text-xs text-text-secondary uppercase tracking-wider mb-3">
							Informação da Encomenda
						</h4>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-text-secondary">ID</span>
								<span className="font-heading font-600 text-warm-text font-mono text-xs">
									{order.id}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Data</span>
								<span className="font-heading font-600 text-warm-text">
									{formatDate(order.createdAt ?? '')}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-text-secondary">Estado</span>
								<Badge variant={statusVariant[orderStatus] ?? 'gray'}>
									{statusLabel[orderStatus] ?? orderStatus}
								</Badge>
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
									{paymentMethodLabel[
										(order.paymentMethod ?? '').toLowerCase()
									] ?? order.paymentMethod}
								</span>
							</div>
							{order.paymentRef && (
								<div className="flex justify-between">
									<span className="text-text-secondary">Referência</span>
									<span className="font-heading font-600 text-warm-text font-mono text-xs">
										{order.paymentRef}
									</span>
								</div>
							)}
							<div className="flex justify-between pt-2 border-t border-warm-border">
								<span className="font-heading font-600 text-warm-text">Total</span>
								<span className="font-heading font-700 text-lg text-brand">
									{formatKwanza(order.totalAmount ?? 0)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Items + Addons */}
			<div className="card-account stagger-4">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">Itens</h3>
					<div className="space-y-3">
						{order.items?.map((item, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-4 rounded-xl bg-warm-bg border border-warm-border"
							>
								<div>
									<p className="text-sm font-heading font-600 text-warm-text">
										{item.ticketTypeName}
									</p>
									<p className="text-xs text-text-secondary">
										{item.quantity}x ·{' '}
										{item.unitPrice && formatKwanza(item.unitPrice)} cada
									</p>
								</div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{item.unitPrice != null && item.quantity != null
										? formatKwanza(item.unitPrice * item.quantity)
										: '—'}
								</p>
							</div>
						))}
						{order.addons?.map((addon, i) => (
							<div
								key={`a-${i}`}
								className="flex items-center justify-between p-4 rounded-xl bg-warm-bg/50 border border-dashed border-warm-border"
							>
								<div>
									<p className="text-sm font-heading font-600 text-warm-text">
										{addon.name}
									</p>
									<p className="text-xs text-text-secondary">
										{addon.quantity}x · {formatKwanza(addon.unitPrice)} cada
									</p>
								</div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{formatKwanza(addon.unitPrice * addon.quantity)}
								</p>
							</div>
						))}
					</div>
					<div className="mt-4 pt-4 border-t border-warm-border flex items-center justify-between">
						<span className="font-heading font-700 text-warm-text">Total</span>
						<span className="font-display-alt font-700 text-2xl text-brand">
							{formatKwanza(order.totalAmount ?? 0)}
						</span>
					</div>
				</div>
			</div>

			{/* Tickets (if any) */}
			{order.tickets && order.tickets.length > 0 && (
				<div className="card-account stagger-5">
					<div className="p-6 sm:p-8">
						<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
							Bilhetes
						</h3>
						<div className="grid sm:grid-cols-2 gap-3">
							{order.tickets.map((ticket) => (
								<div
									key={ticket.id}
									className="flex items-center gap-4 p-4 rounded-xl border border-warm-border bg-white"
								>
									<div className="w-14 h-14 shrink-0 bg-white rounded-lg border-2 border-warm-border flex items-center justify-center overflow-hidden">
										<ReactQRCode
													value={ticket.qrCode}
													size={50}
													level="M"
													dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
													finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
													finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
												/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-heading font-600 text-warm-text">
											{ticket.ticketTypeName}
										</p>
										{ticket.entriesAllowed > 1 && (
											<p className="text-xs text-text-secondary">
												{ticket.entriesUsed}/{ticket.entriesAllowed}{' '}
												entradas usadas
											</p>
										)}
									</div>
									<Link
										to={`/account/tickets/${ticket.id}`}
										className="text-xs font-heading font-600 text-brand hover:text-brand-dark link-underline shrink-0"
									>
										Ver QR
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Addon Instances (if any) */}
			{order.addonInstances && order.addonInstances.length > 0 && (
				<div className="card-account stagger-5">
					<div className="p-6 sm:p-8">
						<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
							Add-ons (QR Codes)
						</h3>
						<div className="grid sm:grid-cols-2 gap-3">
							{order.addonInstances.map((ai) => (
								<div
									key={ai.id}
									className="flex items-center gap-4 p-4 rounded-xl border border-warm-border bg-white"
								>
									<div className="w-14 h-14 shrink-0 bg-white rounded-lg border-2 border-warm-border flex items-center justify-center overflow-hidden">
										<ReactQRCode
													value={ai.qrSecret}
													size={50}
													level="M"
													dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
													finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
													finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
												/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-heading font-600 text-warm-text">
											{ai.addon.name}
										</p>
										<p className="text-xs text-text-secondary">
											{ai.entriesUsed}/{ai.entriesAllowed} usados ·{' '}
											{ai.status}
										</p>
									</div>
									<Link
										to="/account/addons"
										className="text-xs font-heading font-600 text-brand hover:text-brand-dark link-underline shrink-0"
									>
										Ver QR
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Rentals (if any) */}
			{order.rentals && order.rentals.length > 0 && (
				<div className="card-account stagger-5">
					<div className="p-6 sm:p-8">
						<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
							Alugueres
						</h3>
						<div className="space-y-3">
							{order.rentals.map((rental) => (
								<Link
									key={rental.id}
									to={`/account/rentals/${rental.id}`}
									className="flex items-center gap-4 p-4 rounded-xl border border-warm-border bg-white hover:shadow-md hover:border-brand/20 transition-all group"
								>
									<div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
										{rental.vehicle?.photos?.[0] ? (
											<img
												src={rental.vehicle.photos[0]}
												alt={`${rental.vehicle.make} ${rental.vehicle.model}`}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-text-secondary">
												<svg
													width="20"
													height="20"
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
										<p className="font-heading font-600 text-sm text-warm-text group-hover:text-brand transition-colors">
											{rental.vehicle?.make} {rental.vehicle?.model}
										</p>
										<p className="text-xs text-text-secondary">
											{rental.vehicle?.plate} · {rental.vehicle?.make}{' '}
											{rental.vehicle?.model}
										</p>
										<p className="text-xs text-text-secondary">
											{rental.startDate ? formatDate(rental.startDate) : '—'}{' '}
											— {rental.endDate ? formatDate(rental.endDate) : '—'} ·{' '}
											{rental.totalDays ?? '—'} dia
											{rental.totalDays != null && rental.totalDays > 1
												? 's'
												: ''}
										</p>
									</div>
									<div className="text-right shrink-0">
										<p className="font-heading font-700 text-sm text-warm-text">
											{rental.totalPrice != null
												? formatKwanza(rental.totalPrice)
												: '—'}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Actions */}
			{isPending && (
				<div className="flex items-center gap-3 stagger-5">
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={cancelOrder.isPending}
					>
						Cancelar Encomenda
					</Button>
				</div>
			)}
		</div>
	)
}
