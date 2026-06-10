import { useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import {
	useAdminCategories,
	useCreateCategory,
	useUpdateCategory,
	useDeleteCategory,
} from '../../api/hooks/useAdmin'
import { useCloudinaryUpload } from '../../api/hooks/useCloudinaryUpload'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'

export function AdminCategories() {
	const [page, setPage] = useState(1)
	const { data, isLoading } = useAdminCategories({ page, limit: 20 })
	const createCategory = useCreateCategory()
	const updateCategory = useUpdateCategory()
	const deleteCategory = useDeleteCategory()

	const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
	const [editId, setEditId] = useState<string | null>(null)
	const [formName, setFormName] = useState('')
	const [formSlug, setFormSlug] = useState('')
	const [formImage, setFormImage] = useState('')
	const [formCloudinaryId, setFormCloudinaryId] = useState('')
	const [imagePreview, setImagePreview] = useState<string | null>(null)

	const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

	const cloudinary = useCloudinaryUpload()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const openCreate = () => {
		setModalMode('create')
		setEditId(null)
		setFormName('')
		setFormSlug('')
		setFormImage('')
		setFormCloudinaryId('')
		setImagePreview(null)
	}

	const openEdit = (cat: {
		id: string
		name: string
		slug: string
		image: string | null
		cloudinaryId: string | null
	}) => {
		setModalMode('edit')
		setEditId(cat.id)
		setFormName(cat.name)
		setFormSlug(cat.slug)
		setFormImage(cat.image ?? '')
		setFormCloudinaryId(cat.cloudinaryId ?? '')
		setImagePreview(cat.image)
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Seleciona uma imagem válida')
			return
		}

		try {
			const result = await cloudinary.upload(file, 'categorias')
			setFormImage(result.url)
			setFormCloudinaryId(result.idcloudinary)
			setImagePreview(result.url)
		} catch {
			toast.error('Erro ao fazer upload da imagem')
		}
	}

	const handleSave = () => {
		if (!formName.trim() || !formSlug.trim()) return
		const data = {
			name: formName.trim(),
			slug: formSlug.trim(),
			image: formImage.trim() || undefined,
			cloudinaryId: formCloudinaryId || undefined,
		}
		if (modalMode === 'create') {
			createCategory.mutate(data, { onSuccess: () => setModalMode(null) })
		} else if (editId) {
			updateCategory.mutate({ id: editId, ...data }, { onSuccess: () => setModalMode(null) })
		}
	}

	const handleDelete = () => {
		if (!deleteTarget) return
		deleteCategory.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
	}

	const categories = data?.categories ?? []

	return (
		<div className="space-y-6">
			<div className="admin-stagger-1 flex items-center justify-between">
				<div>
					<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
						Categorias
					</h1>
					<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
						Gestão de categorias de eventos
					</p>
				</div>
				<button
					onClick={openCreate}
					className="px-4 py-2 bg-brand text-white text-sm font-heading font-600 hover:bg-brand-dark transition-colors"
				>
					+ Nova Categoria
				</button>
			</div>

			<div className="grid sm:grid-cols-3 gap-4 admin-stagger-2">
				<div className="card-admin p-5">
					<p className="text-xs text-[#8a7a6e] font-heading font-500 mb-1">Total</p>
					<p className="font-display text-2xl tracking-wider text-white">
						{data?.total ?? 0}
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="card-admin overflow-hidden p-5 admin-stagger-3">
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
				<div className="card-admin overflow-hidden admin-stagger-3">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b-2 border-[#3d3028]">
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Nome
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden sm:table-cell">
										Slug
									</th>
									<th className="text-left px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em] hidden md:table-cell">
										Imagem
									</th>
									<th className="text-right px-4 py-3 text-[10px] font-heading font-600 text-[#6a5a4e] uppercase tracking-[0.12em]">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{categories.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-10 text-center text-sm text-[#6a5a4e] font-heading"
										>
											Nenhuma categoria encontrada
										</td>
									</tr>
								) : (
									categories.map((cat) => (
										<tr
											key={cat.id}
											className="border-b border-[#3d3028] last:border-0 hover:bg-white/[0.02] transition-colors"
										>
											<td className="px-4 py-3">
												<p className="text-sm font-heading font-500 text-[#d4c5b8]">
													{cat.name}
												</p>
											</td>
											<td className="px-4 py-3 text-sm text-[#8a7a6e] hidden sm:table-cell font-heading">
												{cat.slug}
											</td>
											<td className="px-4 py-3 hidden md:table-cell">
												{cat.image ? (
													<img
														src={cat.image}
														alt={cat.name}
														className="w-10 h-10 rounded object-cover"
													/>
												) : (
													<span className="text-xs text-[#6a5a4e] font-heading">
														—
													</span>
												)}
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => openEdit(cat)}
														className="text-xs font-heading font-600 text-[#8a7a6e] hover:text-brand transition-colors"
													>
														Editar
													</button>
													<button
														onClick={() =>
															setDeleteTarget({
																id: cat.id,
																name: cat.name,
															})
														}
														className="text-xs font-heading font-600 text-[#8a7a6e] hover:text-red-400 transition-colors"
													>
														Eliminar
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{(data?.totalPages ?? 1) > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t-2 border-[#3d3028]">
							<p className="text-xs text-[#6a5a4e] font-heading">
								Página {data?.page} de {data?.totalPages}
							</p>
							<div className="flex gap-2">
								<button
									disabled={!data || data.page <= 1}
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									className="px-3 py-1.5 text-xs font-heading font-600 text-[#8a7a6e] border-2 border-[#3d3028] hover:text-[#d4c5b8] hover:border-[#5a4a3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
								>
									Anterior
								</button>
								<button
									disabled={!data || data.page >= data.totalPages}
									onClick={() => setPage((p) => p + 1)}
									className="px-3 py-1.5 text-xs font-heading font-600 text-[#8a7a6e] border-2 border-[#3d3028] hover:text-[#d4c5b8] hover:border-[#5a4a3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
								>
									Seguinte
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Create / Edit Modal */}
			<Modal
				open={modalMode !== null}
				onClose={() => setModalMode(null)}
				title={modalMode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}
			>
				<div className="space-y-4">
					<Input
						label="Nome"
						placeholder="Ex: Concertos"
						value={formName}
						onChange={(e) => {
							setFormName(e.target.value)
							if (modalMode === 'create') {
								setFormSlug(
									e.target.value
										.toLowerCase()
										.replace(/\s+/g, '-')
										.replace(/[^a-z0-9-]/g, ''),
								)
							}
						}}
					/>
					<Input
						label="Slug"
						placeholder="Ex: concertos"
						value={formSlug}
						onChange={(e) =>
							setFormSlug(
								e.target.value
									.toLowerCase()
									.replace(/\s+/g, '-')
									.replace(/[^a-z0-9-]/g, ''),
							)
						}
					/>
					<div>
						<label className="text-sm font-heading font-600 text-[#8a7a6e] block mb-1.5">
							Imagem
						</label>
						<input
							ref={fileInputRef}
							type="file"
							accept=".png,.jpg,.jpeg,.webp"
							className="hidden"
							onChange={handleImageUpload}
						/>
						{imagePreview ? (
							<div className="relative mb-3">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-36 object-cover rounded border border-[#3d3028]"
								/>
								<button
									type="button"
									onClick={() => {
										setImagePreview(null)
										setFormImage('')
										setFormCloudinaryId('')
									}}
									disabled={cloudinary.uploading}
									className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
									>
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
								{cloudinary.uploading && (
									<div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
										<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
									</div>
								)}
							</div>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={cloudinary.uploading}
								className="w-full h-32 rounded border-2 border-dashed border-[#3d3028] flex flex-col items-center justify-center gap-2 text-[#6a5a4e] hover:border-brand hover:text-brand transition-all"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
								</svg>
								<span className="text-sm">
									{cloudinary.uploading ? 'A enviar...' : 'Carregar Imagem'}
								</span>
							</button>
						)}
					</div>
					<div className="flex gap-3 pt-2">
						<button
							onClick={handleSave}
							disabled={!formName.trim() || !formSlug.trim()}
							className="px-4 py-2 bg-brand text-white text-sm font-heading font-600 hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{modalMode === 'create' ? 'Criar' : 'Guardar'}
						</button>
						<button
							onClick={() => setModalMode(null)}
							className="px-4 py-2 text-sm font-heading font-600 text-[#8a7a6e] border-2 border-[#3d3028] hover:text-[#d4c5b8] transition-colors"
						>
							Cancelar
						</button>
					</div>
				</div>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				open={deleteTarget !== null}
				onClose={() => setDeleteTarget(null)}
				title="Eliminar Categoria"
			>
				<p className="text-sm text-[#8a7a6e] font-heading mb-4">
					Tens a certeza que queres eliminar a categoria{' '}
					<span className="font-600 text-[#d4c5b8]">{deleteTarget?.name}</span>?
				</p>
				<div className="flex gap-3">
					<button
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white text-sm font-heading font-600 hover:bg-red-700 transition-colors"
					>
						Eliminar
					</button>
					<button
						onClick={() => setDeleteTarget(null)}
						className="px-4 py-2 text-sm font-heading font-600 text-[#8a7a6e] border-2 border-[#3d3028] hover:text-[#d4c5b8] transition-colors"
					>
						Cancelar
					</button>
				</div>
			</Modal>
		</div>
	)
}
