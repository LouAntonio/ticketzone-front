import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useOrders } from '../../api/hooks/useOrders'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza } from '../../lib/format'
import { EmailVerificationBanner } from '../../components/account/EmailVerificationBanner'

const statusVariant: Record<string, 'emerald' | 'amber' | 'red'> = {
	confirmed: 'emerald',
	pending: 'amber',
	paid: 'emerald',
	cancelled: 'red',
	refunded: 'red',
}

export function AccountDashboard() {
	const user = useAuthStore((s) => s.user)
	const { data, isLoading } = useOrders()

	const confirmedOrders =
		data?.orders?.filter((o: OrderDisplay) => o.status === 'confirmed') ?? []
	const pendingOrders = data?.orders?.filter((o: OrderDisplay) => o.status === 'pending') ?? []
	const totalSpent = confirmedOrders.reduce((s: number, o: OrderDisplay) => s + (o.total ?? 0), 0)
	const totalTickets = confirmedOrders.reduce(
		(s: number, o: OrderDisplay) =>
			s + (o.items?.reduce((s2, i) => s2 + (i.quantity ?? 0), 0) ?? 0),
		0,
	)

	const isPromoter = user?.role === 'PROMOTER'
	const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN'
	const initials =
		user?.name
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? '??'

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Email Verification Banner */}
			{user && !user.emailVerified && <EmailVerificationBanner email={user.email} />}

			{/* Welcome Section */}
			<div className="flex items-start justify-between stagger-1">
				<div>
					<div className="flex items-center gap-4 mb-2">
						<div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-terracotta flex items-center justify-center shadow-lg shadow-brand/20">
							<span className="font-heading font-700 text-xl text-white">
								{initials}
							</span>
						</div>
						<div>
							<h1 className="font-display-alt text-3xl font-700 text-warm-text leading-tight">
								Olá, {user?.name?.split(' ')[0]}
							</h1>
							<p className="text-text-secondary text-sm">Bem-vindo de volta</p>
						</div>
					</div>
				</div>
				{isStaff && (
					<Link to="/admin" className="btn-outline h-10 px-4 text-xs rounded-lg shrink-0">
						Painel Admin
					</Link>
				)}
				{isPromoter && (
					<Link
						to="/organizer"
						className="btn-brand h-10 px-4 text-xs rounded-lg shrink-0"
					>
						Painel Organizador
					</Link>
				)}
			</div>

			{/* Stats Grid */}
			<div className="grid sm:grid-cols-3 gap-4 stagger-2">
				<Card className="!p-5">
					<p className="text-xs text-text-secondary mb-1 font-heading font-600 uppercase tracking-wider">
						Total Gasto
					</p>
					<p className="font-display-alt font-700 text-2xl text-brand">
						{isLoading ? <Skeleton className="h-7 w-28" /> : formatKwanza(totalSpent)}
					</p>
					<p className="text-xs text-text-secondary mt-1">
						{confirmedOrders.length} compra{confirmedOrders.length !== 1 ? 's' : ''}{' '}
						confirmada{confirmedOrders.length !== 1 ? 's' : ''}
					</p>
				</Card>
				<Card className="!p-5">
					<p className="text-xs text-text-secondary mb-1 font-heading font-600 uppercase tracking-wider">
						Bilhetes Adquiridos
					</p>
					<p className="font-display-alt font-700 text-2xl">
						{isLoading ? <Skeleton className="h-7 w-20" /> : totalTickets}
					</p>
					<p className="text-xs text-text-secondary mt-1">
						em {new Set(confirmedOrders.map((o: OrderDisplay) => o.eventId)).size}{' '}
						evento
						{new Set(confirmedOrders.map((o: OrderDisplay) => o.eventId)).size !== 1
							? 's'
							: ''}
					</p>
				</Card>
				<Card className="!p-5">
					<p className="text-xs text-text-secondary mb-1 font-heading font-600 uppercase tracking-wider">
						Compras Pendentes
					</p>
					<p className="font-display-alt font-700 text-2xl text-amber-600">
						{isLoading ? <Skeleton className="h-7 w-12" /> : pendingOrders.length}
					</p>
					<p className="text-xs text-text-secondary mt-1">
						{pendingOrders.length > 0 ? 'Aguardando pagamento' : 'Nenhuma pendente'}
					</p>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="stagger-3">
				<h2 className="font-heading font-600 text-sm text-text-secondary uppercase tracking-wider mb-3">
					Ações Rápidas
				</h2>
				<div className="flex flex-wrap gap-3">
					<Link
						to="/events"
						className="inline-flex items-center gap-2 h-11 px-5 bg-brand text-white font-heading font-600 text-sm rounded-xl hover:bg-brand-dark transition-all active:scale-[0.97] shadow-sm"
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
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
						Explorar Eventos
					</Link>
					<Link
						to="/account/tickets"
						className="inline-flex items-center gap-2 h-11 px-5 border-2 border-brand text-brand font-heading font-600 text-sm rounded-xl hover:bg-brand-soft transition-all active:scale-[0.97]"
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
							<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
						Os Meus Bilhetes
					</Link>
					<Link
						to="/account/orders"
						className="inline-flex items-center gap-2 h-11 px-5 border-2 border-warm-border text-text-secondary font-heading font-600 text-sm rounded-xl hover:bg-gray-50 hover:text-text transition-all active:scale-[0.97]"
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
						Histórico de Compras
					</Link>
					{!isPromoter && !isStaff && (
						<Link
							to="/account/become-promoter"
							className="inline-flex items-center gap-2 h-11 px-5 border-2 border-warm-border text-text-secondary font-heading font-600 text-sm rounded-xl hover:bg-gray-50 hover:text-text transition-all active:scale-[0.97]"
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
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
							Tornar-me Promotor
						</Link>
					)}
				</div>
			</div>

			{/* Recent Orders */}
			<div className="stagger-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="font-heading font-600 text-sm text-text-secondary uppercase tracking-wider">
						Compras Recentes
					</h2>
					{data?.orders && data.orders.length > 5 && (
						<Link
							to="/account/orders"
							className="text-xs font-heading font-600 text-brand link-underline"
						>
							Ver todas
						</Link>
					)}
				</div>

				{isLoading ? (
					<div className="space-y-3">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="rounded-xl border border-warm-border bg-white p-4 flex items-center gap-4"
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
							<Link
								key={order.id}
								to={`/account/orders/${order.id}`}
								className="block rounded-xl border border-warm-border bg-white p-4 hover:shadow-md hover:border-brand/20 transition-all group"
							>
								<div className="flex items-center gap-4">
									<img
										src={order.eventImage}
										alt={order.eventTitle}
										className="w-16 h-16 rounded-xl object-cover shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-heading font-600 text-sm text-warm-text group-hover:text-brand transition-colors">
											{order.eventTitle}
										</p>
										<p className="text-xs text-text-secondary mt-0.5">
											{formatDate(order.eventDate ?? '')}
										</p>
										<p className="text-xs text-text-secondary">
											{order.items
												?.map(
													(i: OrderItemDisplay) =>
														`${i.quantity}x ${i.ticketTypeName}`,
												)
												.join(', ')}
										</p>
									</div>
									<div className="text-right shrink-0">
										<p className="font-heading font-700 text-sm text-warm-text">
											{formatKwanza(order.total ?? 0)}
										</p>
										<Badge
											variant={statusVariant[order.status ?? ''] ?? 'gray'}
											className="mt-1"
										>
											{order.status === 'confirmed' || order.status === 'paid'
												? 'Confirmado'
												: order.status === 'pending'
													? 'Pendente'
													: order.status === 'refunded'
														? 'Reembolsado'
														: 'Cancelado'}
										</Badge>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="rounded-xl border-2 border-dashed border-warm-border bg-white/50 p-12 text-center">
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
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
						</div>
						<p className="font-heading font-600 text-warm-text mb-1">
							Ainda não fizeste nenhuma compra
						</p>
						<p className="text-text-secondary text-sm mb-6">
							Explora os eventos disponíveis e adquire os teus bilhetes
						</p>
						<Link
							to="/events"
							className="inline-flex items-center gap-2 h-11 px-6 bg-brand text-white font-heading font-600 text-sm rounded-xl hover:bg-brand-dark transition-all"
						>
							Explorar Eventos
						</Link>
					</div>
				)}
			</div>

			{/* Promoter CTA */}
			{!isPromoter && !isStaff && (
				<div className="stagger-5 rounded-xl bg-gradient-to-r from-brand to-terracotta p-6 sm:p-8 text-white">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h3 className="font-display-alt text-xl font-700 mb-1">
								Queres organizar eventos?
							</h3>
							<p className="text-white/80 text-sm max-w-md">
								Torna-te promotor e começa a vender bilhetes para os teus eventos na
								Ticketzone
							</p>
						</div>
						<Link
							to="/account/become-promoter"
							className="inline-flex items-center gap-2 h-11 px-6 bg-white text-brand font-heading font-700 text-sm rounded-xl hover:bg-gray-100 transition-all shrink-0 shadow-lg"
						>
							Saber Mais
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

// Need to import the types used locally
import type { OrderDisplay as _OD, OrderItemDisplay as _OID } from '../../api/hooks/useOrders'
type OrderDisplay = _OD
type OrderItemDisplay = _OID
