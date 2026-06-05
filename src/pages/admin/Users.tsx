import { useState } from 'react'
import { useAdminUsers, useUpdateUserRole } from '../../api/hooks/useAdmin'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'
import { formatDate } from '../../lib/format'

const roleLabels: Record<string, string> = {
	buyer: 'Comprador',
	organizer: 'Organizador',
	admin: 'Admin',
}

const roleColors: Record<string, string> = {
	buyer: 'bg-blue-500/20 text-blue-400',
	organizer: 'bg-purple-500/20 text-purple-400',
	admin: 'bg-brand/20 text-brand',
}

export function AdminUsers() {
	const { data, isLoading } = useAdminUsers()
	const updateRole = useUpdateUserRole()
	const [filterRole, setFilterRole] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')

	if (isLoading) {
		return (
			<div className="space-y-6 animate-fade-in">
				<div className="space-y-2">
					<Skeleton variant="dark" className="h-9 w-56" />
					<Skeleton variant="dark" className="h-4 w-72" />
				</div>
				<div className="flex gap-2 flex-wrap">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} variant="dark" className="h-9 w-28 rounded-lg" />
					))}
				</div>
				<Skeleton variant="dark" className="h-10 w-full rounded-lg" />
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden p-5">
					<SkeletonTable rows={8} cols={6} variant="dark" />
				</div>
			</div>
		)
	}

	const users = data?.users ?? []

	const filtered = users.filter((u) => {
		if (filterRole !== 'all' && u.role !== filterRole) return false
		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			return (
				u.name.toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q) ||
				(u.organizerCompany?.toLowerCase().includes(q) ?? false)
			)
		}
		return true
	})

	const counts = users.reduce(
		(acc, u) => {
			acc[u.role] = (acc[u.role] ?? 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const tabs = [
		{ key: 'all', label: 'Todos', count: users.length },
		{ key: 'buyer', label: 'Compradores', count: counts.buyer ?? 0 },
		{ key: 'organizer', label: 'Organizadores', count: counts.organizer ?? 0 },
		{ key: 'admin', label: 'Admins', count: counts.admin ?? 0 },
	]

	const handleRoleChange = (userId: string, newRole: string) => {
		updateRole.mutate({ id: userId, role: newRole })
	}

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">UTILIZADORES</h1>
				<p className="text-gray-500 text-sm mt-1">
					Gestão de todos os utilizadores da plataforma
				</p>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 flex-wrap">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setFilterRole(tab.key)}
						className={`px-4 py-2 rounded-lg text-sm font-heading font-500 transition-all ${
							filterRole === tab.key
								? 'bg-brand text-white shadow-lg shadow-brand/20'
								: 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white'
						}`}
					>
						{tab.label}
						<span className="ml-2 text-xs opacity-60">{tab.count}</span>
					</button>
				))}
			</div>

			{/* Search */}
			<div className="relative">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
				<input
					type="text"
					placeholder="Pesquisar utilizadores..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand focus:outline-none transition-colors"
				/>
			</div>

			{/* Table */}
			<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#2a2a2a]">
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Utilizador
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Email
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Função
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Empresa
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden lg:table-cell">
									Registo
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Ações
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((user) => (
								<tr
									key={user.id}
									className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors"
								>
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-heading font-700 text-xs shrink-0">
												{user.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="text-sm font-heading font-500 text-white">
													{user.name}
												</p>
												<p className="text-xs text-gray-500 sm:hidden">
													{user.email}
												</p>
											</div>
										</div>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{user.email}
									</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-0.5 rounded-md text-xs font-heading font-600 ${roleColors[user.role] ?? 'bg-gray-500/20 text-gray-400'}`}
										>
											{roleLabels[user.role] ?? user.role}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
										{user.organizerCompany ?? '-'}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">
										{formatDate(user.createdAt)}
									</td>
									<td className="px-4 py-3 text-right">
										{user.role !== 'admin' && (
											<select
												value={user.role}
												onChange={(e) =>
													handleRoleChange(user.id, e.target.value)
												}
												className="bg-[#252525] border border-[#3a3a3a] rounded-lg text-xs text-gray-300 px-2 py-1.5 focus:border-brand focus:outline-none cursor-pointer"
											>
												<option value="buyer">Comprador</option>
												<option value="organizer">Organizador</option>
												<option value="admin">Admin</option>
											</select>
										)}
										{user.role === 'admin' && (
											<span className="text-xs text-gray-600 italic">—</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 && (
					<p className="text-gray-500 text-sm text-center py-8">
						Nenhum utilizador encontrado
					</p>
				)}
			</div>
		</div>
	)
}
