import { useState } from 'react'
import {
	useAdminPromoters,
	useVerificationRequests,
	useApprovePromoter,
	useRejectPromoter,
	useBanPromoter,
	useUnbanPromoter,
} from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatKwanza } from '../../lib/format'

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
