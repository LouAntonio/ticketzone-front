import { useState } from 'react'
import {
	useAdminPromoters,
	useVerificationRequests,
	useAdminPromoterDetail,
	useApprovePromoter,
	useRejectPromoter,
	useBanPromoter,
	useUnbanPromoter,
} from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatKwanza } from '../../lib/format'

const verifColors: Record<string, string> = {
	VERIFIED: 'border-emerald-500/40 text-emerald-400',
	PENDING: 'border-amber-500/40 text-amber-400',
	REJECTED: 'border-red-500/40 text-red-400',
}

const verifLabels: Record<string, string> = {
	VERIFIED: 'Verificado',
	PENDING: 'Pendente',
	REJECTED: 'Rejeitado',
}

const statusColors: Record<string, string> = {
	ACTIVE: 'text-emerald-400',
	BANNED: 'text-red-400',
}

export function AdminOrganizers() {
	const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')
	const [page, setPage] = useState(1)

	const { data, isLoading } = useAdminPromoters({ page, limit: 20 })
	const { data: pendingData, isLoading: pendingLoading } = useVerificationRequests({
		page: activeTab === 'pending' ? page : 1,
		limit: 20,
	})

	const approvePromoter = useApprovePromoter()
	const rejectPromoter = useRejectPromoter()
	const banPromoter = useBanPromoter()
	const unbanPromoter = useUnbanPromoter()

	const [detailTarget, setDetailTarget] = useState<string | null>(null)
	const { data: promoterDetail, isLoading: detailLoading } = useAdminPromoterDetail(detailTarget)

	const [rejectTarget, setRejectTarget] = useState<{ id: string; companyName: string } | null>(
		null,
	)
	const [rejectMotive, setRejectMotive] = useState('')
	const [banTarget, setBanTarget] = useState<{ id: string; companyName: string } | null>(null)
	const [banMotive, setBanMotive] = useState('')
	const [banDuration, setBanDuration] = useState('')

	const promoters =
		activeTab === 'pending' ? (pendingData?.promoters ?? []) : (data?.promoters ?? [])
	const isLoadingPromoters = activeTab === 'pending' ? pendingLoading : isLoading

	const totalRevenue = promoters.reduce((s, p) => s + p.totalRevenue, 0)
	const totalBalance = promoters.reduce((s, p) => s + p.balance, 0)

	const handleApprove = (id: string) => {
		approvePromoter.mutate({ id })
	}
	const handleReject = () => {
		if (!rejectTarget || !rejectMotive.trim()) return
		rejectPromoter.mutate(
			{ id: rejectTarget.id, motive: rejectMotive },
			{
				onSuccess: () => {
					setRejectTarget(null)
					setRejectMotive('')
				},
			},
		)
	}
	const handleBan = () => {
		if (!banTarget || !banMotive.trim()) return
		banPromoter.mutate(
			{ id: banTarget.id, motive: banMotive, bannedUntil: banDuration || undefined },
			{
				onSuccess: () => {
					setBanTarget(null)
					setBanMotive('')
					setBanDuration('')
				},
			},
		)
	}
	const handleUnban = (id: string) => {
		unbanPromoter.mutate({ id })
	}

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Organizadores
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Gestão de organizadores e promotores de eventos
				</p>
			</div>

			{/* Summary Cards */}
			<div className="grid sm:grid-cols-3 gap-4 admin-stagger-2">
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">
						Total Organizadores
					</p>
					<p className="font-display text-2xl tracking-wider text-white">
						{data?.total ?? 0}
					</p>
				</div>
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">
						Receita Total Gerada
					</p>
					<p className="font-display text-2xl tracking-wider text-brand">
						{formatKwanza(totalRevenue)}
					</p>
				</div>
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">
						Saldo por Payout
					</p>
					<p className="font-display text-2xl tracking-wider text-emerald-400">
						{formatKwanza(totalBalance)}
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="admin-stagger-3 flex gap-2 flex-wrap">
				{[
					{ key: 'all' as const, label: 'Todos', count: data?.total ?? 0 },
					{
						key: 'pending' as const,
						label: 'Verif. Pendentes',
						count: pendingData?.total ?? 0,
					},
				].map((tab) => (
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
						<span className="ml-2 text-xs opacity-60">{tab.count}</span>
					</button>
				))}
			</div>

			{/* Table */}
			{isLoadingPromoters ? (
				<div className="card-admin overflow-hidden p-5 admin-stagger-4">
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
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
										Empresa
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Proprietário
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Verificação
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden md:table-cell">
										Estado
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Eventos
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Receita
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{promoters.map((p) => (
									<tr
										key={p.id}
										className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-4 py-3">
											<p className="text-sm font-heading font-500 text-[#d4c5b8]">
												{p.companyName}
											</p>
											{p.status === 'BANNED' && (
												<p className="text-[10px] text-red-400 font-heading mt-0.5">
													Banido{p.banMotive ? `: ${p.banMotive}` : ''}
												</p>
											)}
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading">
											{p.ownerName}
										</td>
										<td className="px-4 py-3">
											<span
												className={`badge-admin ${verifColors[p.verificationStatus] ?? ''}`}
											>
												{verifLabels[p.verificationStatus] ??
													p.verificationStatus}
											</span>
										</td>
										<td className="px-4 py-3 hidden md:table-cell">
											<span
												className={`text-xs font-heading font-600 flex items-center gap-1.5 ${statusColors[p.status] ?? ''}`}
											>
												<span
													className={`inline-block w-1.5 h-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
												/>
												{p.status === 'ACTIVE' ? 'Ativo' : 'Banido'}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-white font-heading font-600 text-right">
											{p.eventsCount}
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] text-right hidden sm:table-cell font-heading">
											{formatKwanza(p.totalRevenue)}
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-1.5 flex-wrap">
												<button
													onClick={() => setDetailTarget(p.id)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Detalhes
												</button>
												{activeTab === 'pending' &&
													p.verificationStatus === 'PENDING' && (
														<>
															<button
																onClick={() => handleApprove(p.id)}
																disabled={approvePromoter.isPending}
																className="btn-admin-success text-[11px] px-2 py-1"
															>
																Aprovar
															</button>
															<button
																onClick={() =>
																	setRejectTarget({
																		id: p.id,
																		companyName: p.companyName,
																	})
																}
																className="btn-admin-danger text-[11px] px-2 py-1"
															>
																Rejeitar
															</button>
														</>
													)}
												{p.status === 'BANNED' ? (
													<button
														onClick={() => handleUnban(p.id)}
														disabled={unbanPromoter.isPending}
														className="btn-admin-success text-[11px] px-2 py-1"
													>
														Desbanir
													</button>
												) : (
													<button
														onClick={() =>
															setBanTarget({
																id: p.id,
																companyName: p.companyName,
															})
														}
														className="btn-admin-danger text-[11px] px-2 py-1"
													>
														Banir
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{promoters.length === 0 && (
						<p className="text-[#6a5a4e] text-sm text-center py-8 font-heading">
							Nenhum organizador encontrado
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
				title="Detalhes do Organizador"
			>
				{detailLoading ? (
					<div className="space-y-3">
						<Skeleton variant="dark" className="h-5 w-40" />
						<Skeleton variant="dark" className="h-4 w-60" />
						<Skeleton variant="dark" className="h-4 w-full" />
						<Skeleton variant="dark" className="h-4 w-3/4" />
					</div>
				) : promoterDetail ? (
					<div className="space-y-5">
						<div className="pb-4 border-b border-[#3d3028]">
							<div className="flex items-center gap-4">
								<img
									src={promoterDetail.user.image || '/user.png'}
									alt={promoterDetail.user.name}
									className="w-12 h-12 rounded-full object-cover shrink-0"
								/>
								<div className="min-w-0 flex-1">
									<p className="font-heading font-600 text-lg text-[#d4c5b8]">
										{promoterDetail.companyName}
									</p>
									<p className="text-sm text-[#8a7a6e]">
										{promoterDetail.user.name} · {promoterDetail.user.email}
									</p>
								</div>
								{(promoterDetail.logo as { url?: string } | null)?.url && (
									<img
										src={(promoterDetail.logo as { url: string }).url}
										alt="Logo"
										className="w-12 h-12 rounded object-contain border border-[#3d3028] bg-[#1a1410] shrink-0"
									/>
								)}
							</div>
							{(promoterDetail.banner as { url?: string } | null)?.url && (
								<img
									src={(promoterDetail.banner as { url: string }).url}
									alt="Banner"
									className="w-full h-20 object-cover rounded mt-3 border border-[#3d3028]"
								/>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									NIF
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{promoterDetail.nif || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									IBAN
								</p>
								<p className="text-[#d4c5b8] font-heading font-mono text-xs">
									{promoterDetail.iban || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Tipo
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{promoterDetail.promoterType === 'PESSOAL'
										? 'Pessoal'
										: 'Empresarial'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Verificação
								</p>
								<span
									className={`badge-admin text-[11px] ${promoterDetail.verificationStatus === 'VERIFIED' ? 'border-emerald-500/40 text-emerald-400' : promoterDetail.verificationStatus === 'PENDING' ? 'border-amber-500/40 text-amber-400' : 'border-red-500/40 text-red-400'}`}
								>
									{promoterDetail.verificationStatus === 'VERIFIED'
										? 'Verificado'
										: promoterDetail.verificationStatus === 'PENDING'
											? 'Pendente'
											: 'Rejeitado'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Estado
								</p>
								<span
									className={`text-xs font-heading font-600 flex items-center gap-1.5 ${promoterDetail.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}
								>
									<span
										className={`inline-block w-1.5 h-1.5 rounded-full ${promoterDetail.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
									/>
									{promoterDetail.status === 'ACTIVE' ? 'Ativo' : 'Banido'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Eventos
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{promoterDetail._count.events}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Saldo
								</p>
								<p className="text-emerald-400 font-heading font-600">
									{formatKwanza(promoterDetail.balance)}
								</p>
							</div>
							{promoterDetail.status === 'BANNED' && (
								<>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Motivo de Ban
										</p>
										<p className="text-red-400 font-heading">
											{promoterDetail.banMotive || '—'}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Ban Até
										</p>
										<p className="text-[#d4c5b8] font-heading">
											{promoterDetail.bannedUntil
												? formatDate(promoterDetail.bannedUntil)
												: 'Permanente'}
										</p>
									</div>
								</>
							)}
						</div>

						{promoterDetail.payouts.length > 0 && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Últimos Pagamentos
								</p>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-[#3d3028]">
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Valor
												</th>
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Estado
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Data
												</th>
											</tr>
										</thead>
										<tbody>
											{promoterDetail.payouts.map((p) => (
												<tr
													key={p.id}
													className="border-b border-[#3d3028] last:border-0"
												>
													<td className="py-2 text-white font-heading font-600">
														{formatKwanza(Number(p.amount))}
													</td>
													<td className="py-2">
														<span
															className={`badge-admin text-[10px] ${p.status === 'PROCESSED' ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'}`}
														>
															{p.status === 'PROCESSED'
																? 'Processado'
																: 'Pendente'}
														</span>
													</td>
													<td className="py-2 text-right text-[#8a7a6e] font-heading">
														{formatDate(p.createdAt)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{promoterDetail.docs?.[0] && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Documentos
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{promoterDetail.docs[0].personal.length > 0 && (
										<div>
											<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-2">
												Pessoais
											</p>
											<div className="space-y-2">
												{promoterDetail.docs[0].personal.map((doc, i) => (
													<a
														key={doc.idcloudinary}
														href={doc.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 p-2 rounded border border-[#3d3028] hover:border-brand/40 hover:bg-brand/5 transition-colors group"
													>
														<svg
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="text-brand shrink-0"
														>
															<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
															<polyline points="14 2 14 8 20 8" />
														</svg>
														<span className="text-xs text-[#8a7a6e] group-hover:text-[#d4c5b8] transition-colors truncate font-heading">
															Documento {i + 1}
														</span>
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="text-[#5a4a3e] ml-auto shrink-0"
														>
															<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
															<polyline points="15 3 21 3 21 9" />
															<line x1="10" y1="14" x2="21" y2="3" />
														</svg>
													</a>
												))}
											</div>
										</div>
									)}
									{promoterDetail.docs[0].enterprise.length > 0 && (
										<div>
											<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-2">
												Empresariais
											</p>
											<div className="space-y-2">
												{promoterDetail.docs[0].enterprise.map((doc, i) => (
													<a
														key={doc.idcloudinary}
														href={doc.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 p-2 rounded border border-[#3d3028] hover:border-brand/40 hover:bg-brand/5 transition-colors group"
													>
														<svg
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="text-brand shrink-0"
														>
															<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
															<polyline points="14 2 14 8 20 8" />
														</svg>
														<span className="text-xs text-[#8a7a6e] group-hover:text-[#d4c5b8] transition-colors truncate font-heading">
															Documento {i + 1}
														</span>
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="text-[#5a4a3e] ml-auto shrink-0"
														>
															<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
															<polyline points="15 3 21 3 21 9" />
															<line x1="10" y1="14" x2="21" y2="3" />
														</svg>
													</a>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : null}
			</Modal>

			{/* Reject Modal */}
			<Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">
						Rejeitar Verificação
					</h3>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Motivo da rejeição de{' '}
						<strong className="text-[#d4c5b8]">{rejectTarget?.companyName}</strong>
					</p>
					<div>
						<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Motivo *
						</label>
						<textarea
							value={rejectMotive}
							onChange={(e) => setRejectMotive(e.target.value)}
							placeholder="Documentação incompleta..."
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
							disabled={!rejectMotive.trim() || rejectPromoter.isPending}
							className="btn-admin-danger flex-1"
						>
							{rejectPromoter.isPending ? 'A rejeitar...' : 'Rejeitar'}
						</button>
					</div>
				</div>
			</Modal>

			{/* Ban Modal */}
			<Modal open={!!banTarget} onClose={() => setBanTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">Banir Organizador</h3>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Tens a certeza que queres banir{' '}
						<strong className="text-[#d4c5b8]">{banTarget?.companyName}</strong>?
					</p>
					<div>
						<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Motivo *
						</label>
						<textarea
							value={banMotive}
							onChange={(e) => setBanMotive(e.target.value)}
							placeholder="Violação dos termos de serviço..."
							className="input-admin min-h-[80px] resize-none"
						/>
					</div>
					<div>
						<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
							Duração (opcional)
						</label>
						<input
							type="datetime-local"
							value={banDuration}
							onChange={(e) => setBanDuration(e.target.value)}
							className="input-admin"
						/>
						<p className="text-[10px] text-[#5a4a3e] mt-1 font-heading">
							Deixa vazio para banimento permanente
						</p>
					</div>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => setBanTarget(null)}
							className="btn-admin-ghost flex-1"
						>
							Cancelar
						</button>
						<button
							onClick={handleBan}
							disabled={!banMotive.trim() || banPromoter.isPending}
							className="btn-admin-danger flex-1"
						>
							{banPromoter.isPending ? 'A banir...' : 'Banir'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
