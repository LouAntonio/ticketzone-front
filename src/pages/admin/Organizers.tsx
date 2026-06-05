import { useAdminOrganizers } from '../../api/hooks/useAdmin'
import { Spinner } from '../../components/ui/Spinner'
import { formatKwanza } from '../../lib/format'

export function AdminOrganizers() {
	const { data, isLoading } = useAdminOrganizers()

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const organizers = data?.organizers ?? []

	const totalRevenue = organizers.reduce((s, o) => s + o.totalRevenue, 0)
	const totalBalance = organizers.reduce((s, o) => s + o.balance, 0)

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="font-display text-3xl tracking-wider text-white">ORGANIZADORES</h1>
				<p className="text-gray-500 text-sm mt-1">
					Gestão de organizadores e promotores de eventos
				</p>
			</div>

			{/* Summary Cards */}
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">
						Total Organizadores
					</p>
					<p className="font-display text-2xl tracking-wider text-white">
						{organizers.length}
					</p>
				</div>
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">
						Receita Total Gerada
					</p>
					<p className="font-display text-2xl tracking-wider text-brand">
						{formatKwanza(totalRevenue)}
					</p>
				</div>
				<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-5">
					<p className="text-xs text-gray-500 font-heading font-500 mb-1">
						Saldo por Payout
					</p>
					<p className="font-display text-2xl tracking-wider text-emerald-400">
						{formatKwanza(totalBalance)}
					</p>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#2a2a2a]">
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Empresa
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Proprietário
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Documento
								</th>
								<th className="text-left px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden lg:table-cell">
									Banco
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Eventos
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider hidden sm:table-cell">
									Receita
								</th>
								<th className="text-right px-4 py-3 text-xs font-heading font-600 text-gray-500 uppercase tracking-wider">
									Saldo
								</th>
							</tr>
						</thead>
						<tbody>
							{organizers.map((org) => (
								<tr
									key={org.id}
									className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors"
								>
									<td className="px-4 py-3">
										<p className="text-sm font-heading font-500 text-white">
											{org.companyName}
										</p>
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
										{org.ownerName}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
										{org.document}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">
										{org.bankName}
									</td>
									<td className="px-4 py-3 text-sm text-white font-heading font-600 text-right">
										{org.eventsCount}
									</td>
									<td className="px-4 py-3 text-sm text-gray-400 text-right hidden sm:table-cell">
										{formatKwanza(org.totalRevenue)}
									</td>
									<td className="px-4 py-3 text-sm text-right">
										<span className="font-heading font-600 text-emerald-400">
											{formatKwanza(org.balance)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{organizers.length === 0 && (
					<p className="text-gray-500 text-sm text-center py-8">
						Nenhum organizador encontrado
					</p>
				)}
			</div>
		</div>
	)
}
