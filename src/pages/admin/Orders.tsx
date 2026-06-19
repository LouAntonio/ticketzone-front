import { useState } from 'react'
import { useAdminOrders, useAdminOrderDetail, useRefundOrder } from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatKwanza } from '../../lib/format'

const statusColors: Record<string, string> = {
	paid: 'border-emerald-500/40 text-emerald-400',
	pending: 'border-amber-500/40 text-amber-400',
	refunded: 'border-blue-500/40 text-blue-400',
	cancelled: 'border-red-500/40 text-red-400',
}

const statusLabels: Record<string, string> = {
	paid: 'Pago',
	pending: 'Pendente',
	refunded: 'Reembolsado',
	cancelled: 'Cancelado',
}

export function AdminOrders() {
	const [page, setPage] = useState(1)
	const [filterStatus, setFilterStatus] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const { data, isLoading } = useAdminOrders({
		page,
		limit: 20,
		search: searchQuery || undefined,
		status: filterStatus !== 'all' ? filterStatus : undefined,
	})
	const refundOrder = useRefundOrder()

	const [detailTarget, setDetailTarget] = useState<string | null>(null)
	const { data: orderDetail, isLoading: detailLoading } = useAdminOrderDetail(detailTarget)

	const [refundTarget, setRefundTarget] = useState<{
		id: string
		buyerName: string
		totalAmount: number
	} | null>(null)

	const orders = data?.orders ?? []

	const counts = orders.reduce(
		(acc, o) => {
			acc[o.status] = (acc[o.status] ?? 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const tabs = [
		{ key: 'all', label: 'Todas', count: data?.total ?? 0 },
		{ key: 'paid', label: 'Pagas', count: counts.paid ?? 0 },
		{ key: 'pending', label: 'Pendentes', count: counts.pending ?? 0 },
		{ key: 'refunded', label: 'Reembolsadas', count: counts.refunded ?? 0 },
		{ key: 'cancelled', label: 'Canceladas', count: counts.cancelled ?? 0 },
	]

	const handleRefund = () => {
		if (!refundTarget) return
		refundOrder.mutate({ id: refundTarget.id }, { onSuccess: () => setRefundTarget(null) })
	}

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Encomendas
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Todas as transações da plataforma
				</p>
			</div>

			{/* Tabs */}
			<div className="admin-stagger-2 flex gap-2 flex-wrap">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => {
							setFilterStatus(tab.key)
							setPage(1)
						}}
						className={`px-4 py-2 text-sm font-heading font-500 transition-all duration-150 border-2 ${
							filterStatus === tab.key
								? 'bg-brand text-white border-brand'
								: 'bg-transparent text-[#8a7a6e] border-[#3d3028] hover:text-[#d4c5b8] hover:border-[#5a4a3e]'
						}`}
					>
						{tab.label}
						<span className="ml-2 text-xs opacity-60">{tab.count}</span>
					</button>
				))}
			</div>

			{/* Search */}
			<div className="admin-stagger-3 relative">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a4a3e]"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
				<input
					type="text"
					placeholder="Pesquisar por comprador..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value)
						setPage(1)
					}}
					className="input-admin pl-10"
				/>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="card-admin overflow-hidden p-5 admin-stagger-4">
					<div className="space-y-4">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton variant="dark" className="h-4 flex-1" />
								<Skeleton variant="dark" className="h-4 w-20" />
								<Skeleton variant="dark" className="h-4 w-24 shrink-0" />
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="card-admin overflow-hidden admin-stagger-4">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b-2 border-[#3d3028]">
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Evento
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Comprador
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Total
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden md:table-cell">
										Comissão
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Estado
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden lg:table-cell">
										Data
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr
										key={order.id}
										className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-4 py-3">
											<p className="text-sm font-heading font-500 text-[#d4c5b8]">
												{order.eventTitle}
											</p>
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading">
											{order.buyerName}
										</td>
										<td className="px-4 py-3 text-sm font-heading font-600 text-white text-right">
											{formatKwanza(order.totalAmount ?? 0)}
										</td>
										<td className="px-4 py-3 text-sm text-[#6a5a4e] text-right hidden md:table-cell font-heading">
											{formatKwanza(order.commission)}
										</td>
										<td className="px-4 py-3">
											<span
												className={`badge-admin ${statusColors[order.status] ?? 'border-gray-500/40 text-gray-400'}`}
											>
												{statusLabels[order.status] ?? order.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-[#6a5a4e] hidden lg:table-cell font-heading">
											{formatDate(order.createdAt)}
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-1.5">
												<button
													onClick={() => setDetailTarget(order.id)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Detalhes
												</button>
												{order.status === 'paid' ? (
													<button
														onClick={() =>
															setRefundTarget({
																id: order.id,
																buyerName: order.buyerName,
																totalAmount: order.totalAmount,
															})
														}
														className="btn-admin-danger text-[11px] px-2 py-1"
													>
														Reembolsar
													</button>
												) : (
													<span className="text-xs text-[#5a4a3e] font-heading italic">
														—
													</span>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{orders.length === 0 && (
						<p className="text-[#6a5a4e] text-sm text-center py-8 font-heading">
							Nenhuma encomenda encontrada
						</p>
					)}
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 1 && (
				<div className="flex items-center justify-between admin-stagger-5">
					<p className="text-sm text-[#6a5a4e] font-heading">
						Página {page} de {data.totalPages} ({data.total} total)
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page <= 1}
							className="btn-admin-ghost text-sm"
						>
							Anterior
						</button>
						<button
							onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
							disabled={page >= data.totalPages}
							className="btn-admin-ghost text-sm"
						>
							Seguinte
						</button>
					</div>
				</div>
			)}

			{/* Detail Modal */}
			<Modal
				open={!!detailTarget}
				onClose={() => setDetailTarget(null)}
				title="Detalhes da Encomenda"
			>
				{detailLoading ? (
					<div className="space-y-3">
						<Skeleton variant="dark" className="h-5 w-40" />
						<Skeleton variant="dark" className="h-4 w-60" />
						<Skeleton variant="dark" className="h-4 w-full" />
						<Skeleton variant="dark" className="h-4 w-3/4" />
					</div>
				) : orderDetail ? (
					<div className="space-y-5">
						<div className="pb-4 border-b border-[#3d3028]">
							<p className="text-xs text-[#6a5a4e] font-heading font-mono mb-1">
								#{orderDetail.id.slice(0, 8)}...
							</p>
							<div className="flex items-center gap-2 mt-1">
								<span
									className={`badge-admin text-[11px] ${orderDetail.status === 'PAID' ? 'border-emerald-500/40 text-emerald-400' : orderDetail.status === 'PENDING' ? 'border-amber-500/40 text-amber-400' : orderDetail.status === 'REFUNDED' ? 'border-blue-500/40 text-blue-400' : 'border-red-500/40 text-red-400'}`}
								>
									{orderDetail.status === 'PAID'
										? 'Pago'
										: orderDetail.status === 'PENDING'
											? 'Pendente'
											: orderDetail.status === 'REFUNDED'
												? 'Reembolsado'
												: 'Cancelado'}
								</span>
								<span className="text-xs text-[#6a5a4e] font-heading">
									{orderDetail.paymentMethod === 'MULTICAIXA_EXPRESS'
										? 'Multicaixa Express'
										: orderDetail.paymentMethod === 'MULTICAIXA_REFERENCE'
											? 'Multicaixa Referência'
											: orderDetail.paymentMethod === 'PAYPAY'
												? 'PayPay'
												: orderDetail.paymentMethod || '—'}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Comprador
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{orderDetail.user.name || '—'}
								</p>
								<p className="text-xs text-[#8a7a6e]">{orderDetail.user.email}</p>
								{orderDetail.user.phoneNumber && (
									<p className="text-xs text-[#8a7a6e]">
										{orderDetail.user.phoneNumber}
									</p>
								)}
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Total
								</p>
								<p className="text-white font-heading font-600 text-lg">
									{formatKwanza(Number(orderDetail.totalAmount))}
								</p>
								<p className="text-xs text-[#6a5a4e] font-heading">
									Comissão:{' '}
									{formatKwanza(
										Math.round(Number(orderDetail.totalAmount) * 0.1 * 100) /
											100,
									)}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Estado Pagamento
								</p>
								<span
									className={`badge-admin text-[11px] ${orderDetail.paymentStatus === 'PAID' ? 'border-emerald-500/40 text-emerald-400' : orderDetail.paymentStatus === 'PENDING' ? 'border-amber-500/40 text-amber-400' : orderDetail.paymentStatus === 'REFUNDED' ? 'border-blue-500/40 text-blue-400' : 'border-red-500/40 text-red-400'}`}
								>
									{orderDetail.paymentStatus === 'PAID'
										? 'Pago'
										: orderDetail.paymentStatus === 'PENDING'
											? 'Pendente'
											: orderDetail.paymentStatus === 'REFUNDED'
												? 'Reembolsado'
												: 'Cancelado'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Data
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{formatDate(orderDetail.createdAt)}
								</p>
							</div>
						</div>

						{orderDetail.tickets.length > 0 && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Bilhetes ({orderDetail.tickets.length})
								</p>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-[#3d3028]">
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Evento
												</th>
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Lote
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Preço
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Estado
												</th>
											</tr>
										</thead>
										<tbody>
											{orderDetail.tickets.map((t) => (
												<tr
													key={t.id}
													className="border-b border-[#3d3028] last:border-0"
												>
													<td className="py-2 text-[#d4c5b8] font-heading text-xs">
														{t.event.title}
													</td>
													<td className="py-2 text-[#8a7a6e] font-heading">
														{t.batch.name}
													</td>
													<td className="py-2 text-right text-white font-heading font-600">
														{formatKwanza(Number(t.batch.price))}
													</td>
													<td className="py-2 text-right">
														<span
															className={`badge-admin text-[10px] ${t.status === 'ACTIVE' ? 'border-emerald-500/40 text-emerald-400' : t.status === 'USED' ? 'border-blue-500/40 text-blue-400' : t.status === 'CANCELLED' ? 'border-red-500/40 text-red-400' : 'border-gray-500/40 text-gray-400'}`}
														>
															{t.status === 'ACTIVE'
																? 'Ativo'
																: t.status === 'USED'
																	? 'Usado'
																	: t.status === 'CANCELLED'
																		? 'Cancelado'
																		: 'Anulado'}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{orderDetail.rentals.length > 0 && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Alugueres ({orderDetail.rentals.length})
								</p>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-[#3d3028]">
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Viatura
												</th>
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Matrícula
												</th>
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Evento
												</th>
											</tr>
										</thead>
										<tbody>
											{orderDetail.rentals.map((r) => (
												<tr
													key={r.id}
													className="border-b border-[#3d3028] last:border-0"
												>
													<td className="py-2 text-[#d4c5b8] font-heading text-xs">
														{r.vehicle.make} {r.vehicle.model}
													</td>
													<td className="py-2 text-[#8a7a6e] font-heading font-mono">
														{r.vehicle.plate}
													</td>
													<td className="py-2 text-[#8a7a6e] font-heading text-xs">
														{r.event?.title || '—'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				) : null}
			</Modal>

			{/* Refund Modal */}
			<Modal open={!!refundTarget} onClose={() => setRefundTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">
						Reembolsar Encomenda
					</h3>
					<div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-heading">
						<strong>Atenção:</strong> Isto irá cancelar os bilhetes, repor a capacidade
						dos lotes e libertar viaturas alugadas.
					</div>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Tens a certeza que queres reembolsar{' '}
						<strong className="text-[#d4c5b8]">
							{formatKwanza(refundTarget?.totalAmount ?? 0)}
						</strong>{' '}
						a <strong className="text-[#d4c5b8]">{refundTarget?.buyerName}</strong>?
					</p>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => setRefundTarget(null)}
							className="btn-admin-ghost flex-1"
						>
							Cancelar
						</button>
						<button
							onClick={handleRefund}
							disabled={refundOrder.isPending}
							className="btn-admin-danger flex-1"
						>
							{refundOrder.isPending ? 'A reembolsar...' : 'Sim, Reembolsar'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
