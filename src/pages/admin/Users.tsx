import { useState } from 'react'
import {
	useAdminUsers,
	useAdminUserDetail,
	useUpdateUserRole,
	useBanUser,
	useUnbanUser,
} from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatKwanza } from '../../lib/format'

const roleLabels: Record<string, string> = {
	USER: 'Comprador',
	PROMOTER: 'Organizador',
	STAFF: 'Staff',
	ADMIN: 'Admin',
}

const roleColors: Record<string, string> = {
	USER: 'border-blue-500/40 text-blue-400',
	PROMOTER: 'border-purple-500/40 text-purple-400',
	STAFF: 'border-cyan-500/40 text-cyan-400',
	ADMIN: 'border-brand/40 text-brand',
}

const statusColors: Record<string, string> = {
	ACTIVE: 'text-emerald-400',
	BANNED: 'text-red-400',
}

export function AdminUsers() {
	const [page, setPage] = useState(1)
	const [filterRole, setFilterRole] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const { data, isLoading } = useAdminUsers({
		page,
		limit: 20,
		search: searchQuery || undefined,
		role: filterRole !== 'all' ? filterRole : undefined,
	})
	const updateRole = useUpdateUserRole()
	const banUser = useBanUser()
	const unbanUser = useUnbanUser()

	const [detailTarget, setDetailTarget] = useState<string | null>(null)
	const { data: userDetail, isLoading: detailLoading } = useAdminUserDetail(detailTarget)

	const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null)
	const [banMotive, setBanMotive] = useState('')
	const [banDuration, setBanDuration] = useState('')

	const handleRoleChange = (userId: string, newRole: string) => {
		updateRole.mutate({ id: userId, role: newRole })
	}

	const handleBan = () => {
		if (!banTarget || !banMotive.trim()) return
		banUser.mutate(
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

	const handleUnban = (userId: string) => {
		unbanUser.mutate({ id: userId })
	}

	const users = data?.users ?? []

	const counts = (data?.users ?? []).reduce(
		(acc, u) => {
			acc[u.role] = (acc[u.role] ?? 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const tabs = [
		{ key: 'all', label: 'Todos', count: data?.total ?? 0 },
		{ key: 'USER', label: 'Compradores', count: counts.USER ?? 0 },
		{ key: 'PROMOTER', label: 'Organizadores', count: counts.PROMOTER ?? 0 },
		{ key: 'STAFF', label: 'Staff', count: counts.STAFF ?? 0 },
		{ key: 'ADMIN', label: 'Admins', count: counts.ADMIN ?? 0 },
	]

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1">
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Utilizadores
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Gestão de todos os utilizadores da plataforma
				</p>
			</div>

			{/* Tabs */}
			<div className="admin-stagger-2 flex gap-2 flex-wrap">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => {
							setFilterRole(tab.key)
							setPage(1)
						}}
						className={`px-4 py-2 text-sm font-heading font-500 transition-all duration-150 border-2 ${
							filterRole === tab.key
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
					placeholder="Pesquisar por nome ou email..."
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
								<Skeleton
									variant="dark"
									className="w-8 h-8 rounded-full shrink-0"
								/>
								<Skeleton variant="dark" className="h-4 flex-1" />
								<Skeleton variant="dark" className="h-4 w-24" />
								<Skeleton variant="dark" className="h-4 w-20" />
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
										Utilizador
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Email
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Função
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden md:table-cell">
										Estado
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden lg:table-cell">
										Registo
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr
										key={user.id}
										className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<img
													src={user.image || '/user.png'}
													alt={user.name}
													className="w-8 h-8 rounded-full object-cover shrink-0"
												/>
												<div>
													<p className="text-sm font-heading font-500 text-[#d4c5b8]">
														{user.name}
													</p>
													<p className="text-xs text-[#6a5a4e] sm:hidden font-heading">
														{user.email}
													</p>
													{user.status === 'BANNED' && (
														<p className="text-[10px] text-red-400 font-heading mt-0.5">
															Banido
															{user.banMotive
																? `: ${user.banMotive}`
																: ''}
														</p>
													)}
												</div>
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading">
											{user.email}
										</td>
										<td className="px-4 py-3">
											<span
												className={`badge-admin ${roleColors[user.role] ?? 'border-gray-500/40 text-gray-400'}`}
											>
												{roleLabels[user.role] ?? user.role}
											</span>
										</td>
										<td className="px-4 py-3 hidden md:table-cell">
											<span
												className={`text-xs font-heading font-600 flex items-center gap-1.5 ${statusColors[user.status] ?? ''}`}
											>
												<span
													className={`inline-block w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
												/>
												{user.status === 'ACTIVE' ? 'Ativo' : 'Banido'}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-[#6a5a4e] hidden lg:table-cell font-heading">
											{formatDate(user.createdAt)}
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => setDetailTarget(user.id)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Detalhes
												</button>
												{user.role !== 'ADMIN' && (
													<select
														value={user.role}
														onChange={(e) =>
															handleRoleChange(
																user.id,
																e.target.value,
															)
														}
														className="select-admin w-auto text-[11px]"
													>
														<option value="USER">Comprador</option>
														<option value="PROMOTER">
															Organizador
														</option>
														<option value="STAFF">Staff</option>
														<option value="ADMIN">Admin</option>
													</select>
												)}
												{user.status === 'BANNED' ? (
													<button
														onClick={() => handleUnban(user.id)}
														className="btn-admin-success text-[11px] px-2 py-1"
														disabled={unbanUser.isPending}
													>
														Desbanir
													</button>
												) : (
													<button
														onClick={() =>
															setBanTarget({
																id: user.id,
																name: user.name,
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
					{users.length === 0 && (
						<p className="text-[#6a5a4e] text-sm text-center py-8 font-heading">
							Nenhum utilizador encontrado
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
				title="Detalhes do Utilizador"
			>
				{detailLoading ? (
					<div className="space-y-3">
						<Skeleton variant="dark" className="h-5 w-40" />
						<Skeleton variant="dark" className="h-4 w-60" />
						<Skeleton variant="dark" className="h-4 w-full" />
						<Skeleton variant="dark" className="h-4 w-3/4" />
					</div>
				) : userDetail ? (
					<div className="space-y-5">
						<div className="flex items-center gap-4 pb-4 border-b border-[#3d3028]">
							<img
								src={userDetail.image || '/user.png'}
								alt={userDetail.name}
								className="w-14 h-14 rounded-full object-cover shrink-0"
							/>
							<div>
								<p className="font-heading font-600 text-lg text-[#d4c5b8]">
									{userDetail.name}
								</p>
								<p className="text-sm text-[#8a7a6e]">{userDetail.email}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Telefone
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{userDetail.phoneNumber || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Função
								</p>
								<span
									className={`badge-admin text-[11px] ${userDetail.role === 'ADMIN' ? 'border-brand/40 text-brand' : userDetail.role === 'PROMOTER' ? 'border-purple-500/40 text-purple-400' : userDetail.role === 'STAFF' ? 'border-cyan-500/40 text-cyan-400' : 'border-blue-500/40 text-blue-400'}`}
								>
									{userDetail.role === 'USER'
										? 'Comprador'
										: userDetail.role === 'PROMOTER'
											? 'Organizador'
											: userDetail.role === 'STAFF'
												? 'Staff'
												: 'Admin'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Estado
								</p>
								<span
									className={`text-xs font-heading font-600 flex items-center gap-1.5 ${userDetail.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}
								>
									<span
										className={`inline-block w-1.5 h-1.5 rounded-full ${userDetail.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
									/>
									{userDetail.status === 'ACTIVE' ? 'Ativo' : 'Banido'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Email Verificado
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{userDetail.emailVerified ? 'Sim' : 'Não'}
								</p>
							</div>
							{userDetail.status === 'BANNED' && (
								<>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Motivo de Ban
										</p>
										<p className="text-red-400 font-heading">
											{userDetail.banMotive || '—'}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Ban Até
										</p>
										<p className="text-[#d4c5b8] font-heading">
											{userDetail.bannedUntil
												? formatDate(userDetail.bannedUntil)
												: 'Permanente'}
										</p>
									</div>
								</>
							)}
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Registo
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{formatDate(userDetail.createdAt)}
								</p>
							</div>
						</div>

						{userDetail.promoter && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Dados de Organizador
								</p>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Empresa
										</p>
										<p className="text-[#d4c5b8] font-heading">
											{userDetail.promoter.companyName}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											NIF
										</p>
										<p className="text-[#d4c5b8] font-heading">
											{userDetail.promoter.nif || '—'}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											IBAN
										</p>
										<p className="text-[#d4c5b8] font-heading font-mono text-xs">
											{userDetail.promoter.iban || '—'}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Eventos
										</p>
										<p className="text-[#d4c5b8] font-heading">
											{userDetail.promoter._count.events}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Verificação
										</p>
										<span
											className={`badge-admin text-[11px] ${userDetail.promoter.verificationStatus === 'VERIFIED' ? 'border-emerald-500/40 text-emerald-400' : userDetail.promoter.verificationStatus === 'PENDING' ? 'border-amber-500/40 text-amber-400' : 'border-red-500/40 text-red-400'}`}
										>
											{userDetail.promoter.verificationStatus === 'VERIFIED'
												? 'Verificado'
												: userDetail.promoter.verificationStatus ===
													  'PENDING'
													? 'Pendente'
													: 'Rejeitado'}
										</span>
									</div>
									<div>
										<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
											Saldo
										</p>
										<p className="text-emerald-400 font-heading font-600">
											{formatKwanza(userDetail.promoter.balance)}
										</p>
									</div>
								</div>
							</div>
						)}

						<div className="pt-4 border-t border-[#3d3028]">
							<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
								Atividade
							</p>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="card-admin p-3 text-center">
									<p className="font-display text-xl text-white">
										{userDetail._count.orders}
									</p>
									<p className="text-[10px] text-[#8a7a6e] font-heading mt-1">
										Encomendas
									</p>
								</div>
								<div className="card-admin p-3 text-center">
									<p className="font-display text-xl text-white">
										{userDetail._count.tickets}
									</p>
									<p className="text-[10px] text-[#8a7a6e] font-heading mt-1">
										Bilhetes
									</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</Modal>

			{/* Ban Modal */}
			<Modal open={!!banTarget} onClose={() => setBanTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">Banir Utilizador</h3>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Tens a certeza que queres banir{' '}
						<strong className="text-[#d4c5b8]">{banTarget?.name}</strong>?
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
							disabled={!banMotive.trim() || banUser.isPending}
							className="btn-admin-danger flex-1"
						>
							{banUser.isPending ? 'A banir...' : 'Banir'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
