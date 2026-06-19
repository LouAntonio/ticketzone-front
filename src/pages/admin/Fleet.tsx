import { useState } from 'react'
import {
	useAdminFleet,
	useAdminVehicleDetail,
	useCreateVehicle,
	useUpdateVehicle,
	useDeleteVehicle,
	useUpdateVehicleStatus,
} from '../../api/hooks/useAdmin'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { formatDate, formatKwanza } from '../../lib/format'

const statusColors: Record<string, string> = {
	AVAILABLE: 'text-emerald-400',
	RENTED: 'text-blue-400',
	MAINTENANCE: 'text-amber-400',
}

const statusLabels: Record<string, string> = {
	AVAILABLE: 'Disponível',
	RENTED: 'Alugado',
	MAINTENANCE: 'Manutenção',
}

interface VehicleForm {
	make: string
	model: string
	plate: string
	year: string
	price: string
	transmission: string
	seats: string
	fuelType: string
	location: string
	description: string
}

const emptyForm: VehicleForm = { make: '', model: '', plate: '', year: '', price: '', transmission: '', seats: '', fuelType: '', location: '', description: '' }

export function AdminFleet() {
	const [page, setPage] = useState(1)
	const [filterStatus, setFilterStatus] = useState('')
	const [searchQuery, setSearchQuery] = useState('')

	const { data, isLoading } = useAdminFleet({
		page,
		limit: 20,
		search: searchQuery || undefined,
		status: filterStatus || undefined,
	})

	const createVehicle = useCreateVehicle()
	const updateVehicle = useUpdateVehicle()
	const deleteVehicle = useDeleteVehicle()
	const updateStatus = useUpdateVehicleStatus()

	const [detailTarget, setDetailTarget] = useState<string | null>(null)
	const { data: vehicleDetail, isLoading: detailLoading } = useAdminVehicleDetail(detailTarget)

	const [showForm, setShowForm] = useState(false)
	const [editTarget, setEditTarget] = useState<({ id: string } & VehicleForm) | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
	const [form, setForm] = useState<VehicleForm>(emptyForm)

	const vehicles = data?.vehicles ?? []
	const availableCount = vehicles.filter((v) => v.available).length
	const maintenanceCount = vehicles.filter((v) => v.status === 'MAINTENANCE').length
	const rentedCount = vehicles.filter((v) => v.status === 'RENTED').length

	const resetForm = () => {
		setForm(emptyForm)
		setEditTarget(null)
	}

	const handleSubmit = () => {
		const payload = {
			make: form.make,
			model: form.model,
			plate: form.plate,
			year: form.year ? Number(form.year) : undefined,
			price: Number(form.price),
			transmission: form.transmission || undefined,
			seats: form.seats ? Number(form.seats) : undefined,
			fuelType: form.fuelType || undefined,
			location: form.location || undefined,
			description: form.description || undefined,
		}

		if (editTarget) {
			updateVehicle.mutate(
				{ id: editTarget.id, ...payload },
				{
					onSuccess: () => {
						setShowForm(false)
						resetForm()
					},
				},
			)
		} else {
			createVehicle.mutate(payload, {
				onSuccess: () => {
					setShowForm(false)
					resetForm()
				},
			})
		}
	}

	const handleEdit = (v: (typeof vehicles)[0]) => {
		setEditTarget({
			id: v.id,
			make: v.make,
			model: v.model,
			plate: v.plate,
			year: String(v.year ?? ''),
			price: String(Math.round(v.pricePerDay)),
			transmission: v.transmission ?? '',
			seats: String(v.seats ?? ''),
			fuelType: v.fuelType ?? '',
			location: v.location ?? '',
			description: v.description ?? '',
		})
		setForm({
			make: v.make,
			model: v.model,
			plate: v.plate,
			year: String(v.year ?? ''),
			price: String(Math.round(v.pricePerDay)),
			transmission: v.transmission ?? '',
			seats: String(v.seats ?? ''),
			fuelType: v.fuelType ?? '',
			location: v.location ?? '',
			description: v.description ?? '',
		})
		setShowForm(true)
	}

	const handleDelete = () => {
		if (!deleteTarget) return
		deleteVehicle.mutate({ id: deleteTarget.id }, { onSuccess: () => setDeleteTarget(null) })
	}

	const handleStatusToggle = (id: string, currentStatus: string) => {
		const newStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE'
		updateStatus.mutate({ id, status: newStatus })
	}

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
							Frota
						</h1>
						<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
							Gestão de viaturas da plataforma
						</p>
					</div>
					<button
						onClick={() => {
							resetForm()
							setShowForm(true)
						}}
						className="btn-admin-brand"
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
							<path d="M12 5v14M5 12h14" />
						</svg>
						Adicionar
					</button>
				</div>
			</div>

			{/* Summary */}
			<div className="grid sm:grid-cols-4 gap-4 admin-stagger-2">
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Total</p>
					<p className="font-display text-2xl tracking-wider text-white">
						{vehicles.length}
					</p>
				</div>
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Disponíveis</p>
					<p className="font-display text-2xl tracking-wider text-emerald-400">
						{availableCount}
					</p>
				</div>
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Alugados</p>
					<p className="font-display text-2xl tracking-wider text-blue-400">
						{rentedCount}
					</p>
				</div>
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Manutenção</p>
					<p className="font-display text-2xl tracking-wider text-amber-400">
						{maintenanceCount}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="admin-stagger-3 flex gap-2 flex-wrap">
				{[
					{ key: '', label: 'Todas', count: data?.total ?? 0 },
					{ key: 'AVAILABLE', label: 'Disponíveis', count: availableCount },
					{ key: 'RENTED', label: 'Alugados', count: rentedCount },
					{ key: 'MAINTENANCE', label: 'Manutenção', count: maintenanceCount },
				].map((tab) => (
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
			<div className="admin-stagger-4 relative">
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
					placeholder="Pesquisar por marca, modelo ou matrícula..."
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
				<div className="card-admin overflow-hidden p-5 admin-stagger-5">
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton variant="dark" className="h-4 flex-1" />
								<Skeleton variant="dark" className="h-4 w-20" />
								<Skeleton variant="dark" className="h-4 w-16" />
								<Skeleton variant="dark" className="h-4 w-16 shrink-0" />
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="card-admin overflow-hidden admin-stagger-5">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b-2 border-[#3d3028]">
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Viatura
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Matrícula
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Estado
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Preço
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{vehicles.map((v) => (
									<tr
										key={v.id}
										className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-4 py-3">
											<p className="text-sm font-heading font-500 text-[#d4c5b8]">
												{v.make} {v.model}
											</p>
											<p className="text-xs text-[#6a5a4e] mt-0.5 font-heading">
												{v.year ?? '—'}
											</p>
										</td>
										<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading font-mono tracking-wider">
											{v.plate}
										</td>
										<td className="px-4 py-3">
											<span
												className={`text-xs font-heading font-600 flex items-center gap-1.5 ${statusColors[v.status] ?? ''}`}
											>
												<span
													className={`inline-block w-1.5 h-1.5 rounded-full ${v.status === 'AVAILABLE' ? 'bg-emerald-400' : v.status === 'RENTED' ? 'bg-blue-400' : 'bg-amber-400'}`}
												/>
												{statusLabels[v.status] ?? v.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm font-heading font-600 text-white text-right">
											{formatKwanza(v.pricePerDay)}
											<span className="text-xs text-[#6a5a4e] font-normal">
												/evento
											</span>
										</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-1.5">
												{(v.status === 'AVAILABLE' ||
													v.status === 'MAINTENANCE') && (
													<button
														onClick={() =>
															handleStatusToggle(v.id, v.status)
														}
														disabled={updateStatus.isPending}
														className={`text-[11px] px-2 py-1 border-2 font-heading font-500 transition-colors ${
															v.status === 'AVAILABLE'
																? 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
																: 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
														}`}
													>
														{v.status === 'AVAILABLE'
															? 'Manutenção'
															: 'Disponível'}
													</button>
												)}
												<button
													onClick={() => setDetailTarget(v.id)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Detalhes
												</button>
												<button
													onClick={() => handleEdit(v)}
													className="border-brand/40 text-brand text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-brand/10 transition-colors"
												>
													Editar
												</button>
												{v.status !== 'RENTED' && (
													<button
														onClick={() =>
															setDeleteTarget({
																id: v.id,
																name: `${v.make} ${v.model}`,
															})
														}
														className="border-red-500/40 text-red-400 text-[11px] px-2 py-1 border-2 font-heading font-500 hover:bg-red-500/10 transition-colors"
													>
														Remover
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{vehicles.length === 0 && (
						<p className="text-[#6a5a4e] text-sm text-center py-8 font-heading">
							Nenhuma viatura encontrada
						</p>
					)}
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 1 && (
				<div className="flex items-center justify-between admin-stagger-6">
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
				title="Detalhes da Viatura"
			>
				{detailLoading ? (
					<div className="space-y-3">
						<Skeleton variant="dark" className="h-5 w-40" />
						<Skeleton variant="dark" className="h-4 w-60" />
						<Skeleton variant="dark" className="h-4 w-full" />
						<Skeleton variant="dark" className="h-4 w-3/4" />
					</div>
				) : vehicleDetail ? (
					<div className="space-y-5">
						<div className="pb-4 border-b border-[#3d3028]">
							<p className="font-heading font-600 text-lg text-[#d4c5b8]">
								{vehicleDetail.make} {vehicleDetail.model}
							</p>
							<p className="text-sm text-[#8a7a6e] font-mono tracking-wider">
								{vehicleDetail.plate}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Ano
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.year || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Preço (dia)
								</p>
								<p className="text-white font-heading font-600">
									{formatKwanza(Number(vehicleDetail.price))}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Estado
								</p>
								<span
									className={`text-xs font-heading font-600 flex items-center gap-1.5 ${vehicleDetail.status === 'AVAILABLE' ? 'text-emerald-400' : vehicleDetail.status === 'RENTED' ? 'text-blue-400' : 'text-amber-400'}`}
								>
									<span
										className={`inline-block w-1.5 h-1.5 rounded-full ${vehicleDetail.status === 'AVAILABLE' ? 'bg-emerald-400' : vehicleDetail.status === 'RENTED' ? 'bg-blue-400' : 'bg-amber-400'}`}
									/>
									{vehicleDetail.status === 'AVAILABLE'
										? 'Disponível'
										: vehicleDetail.status === 'RENTED'
											? 'Alugado'
											: 'Manutenção'}
								</span>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Transmissão
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.transmission === 'auto'
										? 'Automática'
										: vehicleDetail.transmission === 'manual'
											? 'Manual'
											: '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Lugares
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.seats ? `${vehicleDetail.seats} lugares` : '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Combustível
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.fuelType || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Localização
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.location || '—'}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Proprietário
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail.owner.name || vehicleDetail.owner.email}
								</p>
								<p className="text-xs text-[#8a7a6e]">
									{vehicleDetail.owner.email}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Total Alugueres
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{vehicleDetail._count.rentals}
								</p>
							</div>
							<div>
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-1">
									Criado em
								</p>
								<p className="text-[#d4c5b8] font-heading">
									{formatDate(vehicleDetail.createdAt)}
								</p>
							</div>
						</div>

						{vehicleDetail.description && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-2">
									Descrição
								</p>
								<p className="text-sm text-[#8a7a6e] font-heading leading-relaxed">
									{vehicleDetail.description}
								</p>
							</div>
						)}

						{vehicleDetail.rentals.length > 0 && (
							<div className="pt-4 border-t border-[#3d3028]">
								<p className="text-xs font-heading font-600 text-[#6a5a4e] uppercase tracking-wider mb-3">
									Últimos Alugueres
								</p>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-[#3d3028]">
												<th className="text-left py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Evento
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Valor
												</th>
												<th className="text-right py-2 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-wider">
													Estado
												</th>
											</tr>
										</thead>
										<tbody>
											{vehicleDetail.rentals.map((r) => (
												<tr
													key={r.id}
													className="border-b border-[#3d3028] last:border-0"
												>
													<td className="py-2 text-[#d4c5b8] font-heading text-xs">
														{r.event?.title || '—'}
													</td>
													<td className="py-2 text-right text-white font-heading font-600">
														{r.order
															? formatKwanza(
																	Number(r.order.totalAmount),
																)
															: '—'}
													</td>
													<td className="py-2 text-right">
														<span
															className={`badge-admin text-[10px] ${r.order?.status === 'PAID' ? 'border-emerald-500/40 text-emerald-400' : r.order?.status === 'PENDING' ? 'border-amber-500/40 text-amber-400' : r.order?.status === 'REFUNDED' ? 'border-blue-500/40 text-blue-400' : 'border-gray-500/40 text-gray-400'}`}
														>
															{r.order?.status === 'PAID'
																? 'Pago'
																: r.order?.status === 'PENDING'
																	? 'Pendente'
																	: r.order?.status === 'REFUNDED'
																		? 'Reembolsado'
																		: '—'}
														</span>
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

			{/* Create/Edit Modal */}
			<Modal
				open={showForm}
				onClose={() => {
					setShowForm(false)
					resetForm()
				}}
			>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">
						{editTarget ? 'Editar Viatura' : 'Adicionar Viatura'}
					</h3>
					<div className="grid grid-cols-2 gap-3">
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Marca *
							</label>
							<input
								value={form.make}
								onChange={(e) => setForm({ ...form, make: e.target.value })}
								placeholder="Toyota"
								className="input-admin"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Modelo *
							</label>
							<input
								value={form.model}
								onChange={(e) => setForm({ ...form, model: e.target.value })}
								placeholder="Hiace"
								className="input-admin"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Matrícula *
							</label>
							<input
								value={form.plate}
								onChange={(e) => setForm({ ...form, plate: e.target.value })}
								placeholder="LD-45-13-AA"
								className="input-admin font-mono tracking-wider uppercase"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Ano
							</label>
							<input
								value={form.year}
								onChange={(e) => setForm({ ...form, year: e.target.value })}
								placeholder="2024"
								type="number"
								className="input-admin"
							/>
						</div>
						<div className="col-span-2">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Preço por Dia (Kz) *
							</label>
							<input
								value={form.price}
								onChange={(e) => setForm({ ...form, price: e.target.value })}
								placeholder="50000"
								type="number"
								className="input-admin"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Transmissão
							</label>
							<select
								value={form.transmission}
								onChange={(e) => setForm({ ...form, transmission: e.target.value })}
								className="input-admin"
							>
								<option value="">Selecionar</option>
								<option value="auto">Automática</option>
								<option value="manual">Manual</option>
							</select>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Lugares
							</label>
							<input
								value={form.seats}
								onChange={(e) => setForm({ ...form, seats: e.target.value })}
								placeholder="4"
								type="number"
								min="1"
								max="50"
								className="input-admin"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Combustível
							</label>
							<select
								value={form.fuelType}
								onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
								className="input-admin"
							>
								<option value="">Selecionar</option>
								<option value="Gasolina">Gasolina</option>
								<option value="Diesel">Diesel</option>
								<option value="Elétrico">Elétrico</option>
							</select>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Localização
							</label>
							<select
								value={form.location}
								onChange={(e) => setForm({ ...form, location: e.target.value })}
								className="input-admin"
							>
								<option value="">Selecionar</option>
								<option value="Bengo">Bengo</option>
								<option value="Benguela">Benguela</option>
								<option value="Bié">Bié</option>
								<option value="Cabinda">Cabinda</option>
								<option value="Cuando Cubango">Cuando Cubango</option>
								<option value="Cuanza Norte">Cuanza Norte</option>
								<option value="Cuanza Sul">Cuanza Sul</option>
								<option value="Cunene">Cunene</option>
								<option value="Huambo">Huambo</option>
								<option value="Huíla">Huíla</option>
								<option value="Luanda">Luanda</option>
								<option value="Lunda Norte">Lunda Norte</option>
								<option value="Lunda Sul">Lunda Sul</option>
								<option value="Malanje">Malanje</option>
								<option value="Moxico">Moxico</option>
								<option value="Namibe">Namibe</option>
								<option value="Uíge">Uíge</option>
								<option value="Zaire">Zaire</option>
							</select>
						</div>
						<div className="col-span-2">
							<label className="block text-xs text-[#8a7a6e] font-heading font-500 mb-1">
								Descrição
							</label>
							<textarea
								value={form.description}
								onChange={(e) => setForm({ ...form, description: e.target.value })}
								placeholder="Descrição da viatura..."
								rows={3}
								className="input-admin resize-none"
							/>
						</div>
					</div>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => {
								setShowForm(false)
								resetForm()
							}}
							className="btn-admin-ghost flex-1"
						>
							Cancelar
						</button>
						<button
							onClick={handleSubmit}
							disabled={
								!form.make ||
								!form.model ||
								!form.plate ||
								!form.price ||
								createVehicle.isPending ||
								updateVehicle.isPending
							}
							className="btn-admin-brand flex-1"
						>
							{editTarget ? 'Atualizar' : 'Criar'}
						</button>
					</div>
				</div>
			</Modal>

			{/* Delete Modal */}
			<Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
				<div className="space-y-4">
					<h3 className="font-heading font-700 text-lg text-white">Remover Viatura</h3>
					<p className="text-sm text-[#8a7a6e] font-heading">
						Tens a certeza que queres remover{' '}
						<strong className="text-[#d4c5b8]">{deleteTarget?.name}</strong>?
					</p>
					<div className="flex gap-2 pt-2">
						<button
							onClick={() => setDeleteTarget(null)}
							className="btn-admin-ghost flex-1"
						>
							Cancelar
						</button>
						<button
							onClick={handleDelete}
							disabled={deleteVehicle.isPending}
							className="btn-admin-danger flex-1"
						>
							{deleteVehicle.isPending ? 'A remover...' : 'Remover'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
