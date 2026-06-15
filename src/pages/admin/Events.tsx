import { useState } from 'react'
import {
	useAdminEvents,
	useAdminPendingEvents,
	useAdminEventDetail,
	useApproveEvent,
	useRejectEvent,
	useCancelEvent,
	useToggleFeatured,
} from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatKwanza } from '../../lib/format'

const statusColors: Record<string, string> = {
	draft: 'border-gray-500/40 text-gray-400',
	published: 'border-emerald-500/40 text-emerald-400',
	cancelled: 'border-red-500/40 text-red-400',
	completed: 'border-blue-500/40 text-blue-400',
	hidden: 'border-gray-500/40 text-gray-400',
	pending_approval: 'border-amber-500/40 text-amber-400',
}

const statusLabels: Record<string, string> = {
	draft: 'Rascunho',
	published: 'Publicado',
	cancelled: 'Cancelado',
	completed: 'Concluído',
	hidden: 'Oculto',
	pending_approval: 'Pendente',
}

export function AdminEvents() {
	const [activeTab, setActiveTab] = useState<
		'all' | 'pending' | 'published' | 'draft' | 'cancelled'
	>('all')
	const [page, setPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')

	const { data, isLoading } = useAdminEvents({
		page,
		limit: 20,
		search: searchQuery || undefined,
	})
	const { data: pendingData, isLoading: pendingLoading } = useAdminPendingEvents({
		page: activeTab === 'pending' ? page : 1,
		limit: 20,
	})

	const approveEvent = useApproveEvent()
	const rejectEvent = useRejectEvent()
	const cancelEvent = useCancelEvent()
	const toggleFeatured = useToggleFeatured()

	const [detailTarget, setDetailTarget] = useState<string | null>(null)
	const { data: eventDetail, isLoading: detailLoading } = useAdminEventDetail(detailTarget)

	const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null)
	const [rejectMotive, setRejectMotive] = useState('')
	const [cancelTarget, setCancelTarget] = useState<{ id: string; title: string } | null>(null)

	const events = activeTab === 'pending' ? (pendingData?.events ?? []) : (data?.events ?? [])
	const isLoadingEvents = activeTab === 'pending' ? pendingLoading : isLoading

	const allCounts = data?.total ?? 0
	const pendingCount = pendingData?.total ?? 0

	const tabs = [
		{ key: 'all' as const, label: 'Todos', count: allCounts },
		{ key: 'pending' as const, label: 'Pendentes', count: pendingCount },
		{ key: 'published' as const, label: 'Publicados' },
		{ key: 'draft' as const, label: 'Rascunhos' },
		{ key: 'cancelled' as const, label: 'Cancelados' },
	]

	const handleApprove = (id: string) => {
		approveEvent.mutate({ id })
	}

	const handleReject = () => {
		if (!rejectTarget || !rejectMotive.trim()) return
		rejectEvent.mutate(
			{ id: rejectTarget.id, motive: rejectMotive },
			{
				onSuccess: () => {
					setRejectTarget(null)
					setRejectMotive('')
				},
			},
		)
	}

	const handleCancel = () => {
		if (!cancelTarget) return
		cancelEvent.mutate({ id: cancelTarget.id }, { onSuccess: () => setCancelTarget(null) })
	}

	const filtered =
		activeTab === 'all' || activeTab === 'pending'
			? events
			: events.filter((e) => e.status === activeTab)

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Eventos
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Gestão de todos os eventos da plataforma
				</p>
			</div>

			{/* Tabs */}
			<div className="admin-stagger-2 flex gap-2 flex-wrap">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => {
							setActiveTab(tab.key)
							setPage(1)
						}}
						className={`px-4 py-2 text-sm font-heading font-500 transition-all duration-150 border-2 ${
							activeTab === tab.key
								? 'bg-brand text-white border-brand'
								: 'bg-transparent text-[#8a7a6e] border-[#3d3028] hover:text-[#d4c5b8] hover:border-[#5a4a3e]'
						}`}
					>
						{tab.label}
						{tab.count !== undefined && (
							<span className="ml-2 text-xs opacity-60">{tab.count}</span>
						)}
					</button>
				))}
			</div>

			{/* Search */}
			{activeTab !== 'pending' && (
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
						placeholder="Pesquisar eventos..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setPage(1)
						}}
						className="input-admin pl-10"
					/>
				</div>
			)}

			{/* Table */}
			{isLoadingEvents ? (
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
										Organizador
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Estado
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden md:table-cell">
										Data
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((event) => (
									<tr
										key={event.id}
										className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-4 py-3">
											<div>
												<p className="text-sm font-heading font-500 text-[#d4c5b8]">
													{event.title}
												</p>
												<p className="text-xs text-[#6a5a4e] mt-0.5 font-heading">
													{event.province} ·{' '}
													{event.categoryName ?? event.category ?? '—'}
												</p>
												{event.denialReason && (
													<p className="text-[10px] text-red-400 mt-0.5 font-heading">
														Motivo: {event.denialReason}
													</p>
												)}
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading">
											{event.organizerName}
										</td>
										<td className="px-4 py-3">
											<span
												className={`badge-admin ${statusColors[event.status] ?? statusColors.pending_approval}`}
											>
												{statusLabels[event.status] ?? event.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-[#6a5a4e] hidden md:table-cell font-heading">
											{formatDate(event.date)}
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-1.5 flex-wrap">
												<button
													onClick={() =>
														toggleFeatured.mutate({ id: event.id })
													}
													disabled={toggleFeatured.isPending}
													className={`text-[11px] px-2 py-1 border-2 font-heading font-500 transition-colors ${
														event.featured
															? 'border-amber-500/60 text-amber-400 hover:bg-amber-500/10'
															: 'border-[#3d3028] text-[#6a5a4e] hover:border-amber-500/40 hover:text-amber-400'
													}`}
													title={
														event.featured
															? 'Remover destaque'
															: 'Destacar evento'
													}
												>
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill={event.featured ? 'currentColor' : 'none'}
														stroke="currentColor"
														strokeWidth="1.5"
													>
														<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
													</svg>
												</button>
												<button
													onClick={() => setDetailTarget(event.id)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Detalhes
												</button>
												{!event.isApproved &&
													event.status !== 'cancelled' && (
														<>
															<button
																onClick={() =>
																	handleApprove(event.id)
																}
																disabled={approveEvent.isPending}
																className="btn-admin-success text-[11px] px-2 py-1"
															>
																Aprovar
															</button>
															<button
																onClick={() =>
																	setRejectTarget({
																		id: event.id,
																		title: event.title,
																	})
																}
																className="btn-admin-danger text-[11px] px-2 py-1"
															>
																Rejeitar
															</button>
														</>
													)}
												{event.status !== 'cancelled' &&
													event.isApproved && (
														<button
															onClick={() =>
																setCancelTarget({
																	id: event.id,
																	title: event.title,
																})
															}
															className="btn-admin-danger text-[11px] px-2 py-1"
														>
															Cancelar
														</button>
													)}
												{event.status === 'cancelled' && (
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
					{filtered.length === 0 && (
						<p className="text-[#6a5a4e] text-sm text-center py-8 font-heading">
							Nenhum evento encontrado
						</p>
					)}
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 1 && activeTab !== 'pending' && (
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
				title="Detalhes do Evento"
			>
				{detailLoading ? (
					<div className="space-y-3">
						<Skeleton variant="dark" className="h-5 w-40" />
						<Skeleton variant="dark" className="h-4 w-60" />
						<Skeleton variant="dark" className="h-4 w-full" />
						<Skeleton variant="dark" className="h-4 w-3/4" />
					</div>
				) : eventDetail ? (
					<div className="space-y-5">
						{eventDetail.bannerUrl && (
							<img
								src={eventDetail.bannerUrl}
								alt={eventDetail.title}
								className="w-full h-32 object-cover rounded"
							/>
						)}
						<div>
							<p className="font-heading font-600 text-lg text-[#d4c5b8]">
								{eventDetail.title}
							</p>
							<p className="text-xs text-[#8a7a6e] mt-1">
								{eventDetail.province}
								{eventDetail.location ? ` · ${eventDetail.location}` : ''}
								{eventDetail.categories ? ` · ${eventDetail.categories.name}` : ''}
							</p>
						</div>

						{eventDetail.description && (
							<p className="text-sm text-[#8a7a6e] font-heading leading-relaxed">
								{eventDetail.description}
							</p>
						)}

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Estado
								</p>
								<span
									className={`badge-admin text-[11px] ${eventDetail.status === 'PUBLISHED' ? 'border-emerald-500/40 text-emerald-400' : eventDetail.status === 'CANCELLED' ? 'border-red-500/40 text-red-400' : eventDetail.status === 'DRAFT' ? 'border-gray-500/40 text-gray-400' : 'border-amber-500/40 text-amber-400'}`}
								>
									{eventDetail.status === 'PUBLISHED'
										? 'Publicado'
										: eventDetail.status === 'CANCELLED'
											? 'Cancelado'
											: eventDetail.status === 'DRAFT'
												? 'Rascunho'
												: eventDetail.status === 'HIDDEN'
													? 'Oculto'
													: eventDetail.status}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Aprovado
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{eventDetail.isApproved ? 'Sim' : 'Não'}
								</p>
							</div>
							{eventDetail.denialReason && (
								<div className="col-span-2">
									<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
										Motivo de Rejeição
									</p>
									<p className="text-red-400 font-heading">
										{eventDetail.denialReason}
									</p>
								</div>
							)}
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Início
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{formatDate(eventDetail.startDate)}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Fim
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{formatDate(eventDetail.endDate)}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Vendas Pausadas
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{eventDetail.salesPaused ? 'Sim' : 'Não'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Total Bilhetes
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{eventDetail._count.tickets}
								</p>
							</div>
						</div>

						<div className="pt-4 border-t border-[#3d3028]">
							<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
								Organizador
							</p>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
										Empresa
									</p>
									<p className="text-[#d4c5b8] font-heading">
										{eventDetail.promoter.companyName}
									</p>
								</div>
								<div>
									<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
										Contacto
									</p>
									<p className="text-[#d4c5b8] font-heading">
										{eventDetail.promoter.user.name} (
										{eventDetail.promoter.user.email})
									</p>
								</div>
								<div>
									<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
										NIF
									</p>
									<p className="text-[#d4c5b8] font-heading">
										{eventDetail.promoter.nif || '—'}
									</p>
								</div>
								<div>
									<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
										IBAN
									</p>
									<p className="text-[#d4c5b8] font-heading font-mono text-xs">
										{eventDetail.promoter.iban || '—'}
									</p>
								</div>
							</div>
						</div>

						{eventDetail.batches.length > 0 && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Lotes de Bilhetes
								</p>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-[#3d3028]">
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Nome
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Preço
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Capacidade
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Vendidos
												</th>
											</tr>
										</thead>
										<tbody>
											{eventDetail.batches.map((b) => (
												<tr
													key={b.id}
													className="border-b border-[#3d3028] last:border-0"
												>
													<td className="py-2 text-[#d4c5b8] font-heading">
														{b.name}
														{b.isGroupTicket && (
															<span className="text-[10px] text-[#6a5a4e] ml-1">
																(grupo de {b.groupSize})
															</span>
														)}
													</td>
													<td className="py-2 text-right text-white font-heading font-600">
														{formatKwanza(Number(b.price))}
													</td>
													<td className="py-2 text-right text-[#8a7a6e] font-heading">
														{b.capacity}
													</td>
													<td className="py-2 text-right text-[#d4c5b8] font-heading">
														{b.sold}
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

			{/* Reject Modal */}
			<Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">Rejeitar Evento</h3>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Indica o motivo da rejeição de{' '}
						<strong className="text-[#d4c5b8]">{rejectTarget?.title}</strong>
					</p>
					<div>
						<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Motivo *
						</label>
						<textarea
							value={rejectMotive}
							onChange={(e) => setRejectMotive(e.target.value)}
							placeholder="Informações insuficientes..."
							className="input-admin min-h-[80px] resize-none"
						/>
					</div>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => setRejectTarget(null)}
							className="btn-admin-ghost flex-1"
						>
							Cancelar
						</button>
						<button
							onClick={handleReject}
							disabled={!rejectMotive.trim() || rejectEvent.isPending}
							className="btn-admin-danger flex-1"
						>
							{rejectEvent.isPending ? 'A rejeitar...' : 'Rejeitar'}
						</button>
					</div>
				</div>
			</Modal>

			{/* Cancel Modal */}
			<Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">Cancelar Evento</h3>
					<div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-heading">
						<strong>Atenção:</strong> Isto irá cancelar todos os bilhetes, reembolsar
						encomendas pagas e libertar viaturas alugadas.
					</div>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Tens a certeza que queres cancelar{' '}
						<strong className="text-[#d4c5b8]">{cancelTarget?.title}</strong>?
					</p>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => setCancelTarget(null)}
							className="btn-admin-ghost flex-1"
						>
							Voltar
						</button>
						<button
							onClick={handleCancel}
							disabled={cancelEvent.isPending}
							className="btn-admin-danger flex-1"
						>
							{cancelEvent.isPending ? 'A cancelar...' : 'Sim, Cancelar Evento'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
