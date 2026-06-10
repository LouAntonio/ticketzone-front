import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
	useOrganizerEvent,
	useCreateOrganizerEvent,
	useUpdateOrganizerEvent,
	useCreateBatch,
	useUpdateBatch,
	useRemoveBatch,
} from '../../api/hooks/useOrganizer'
import {
	useAddons,
	useCreateAddon,
	useUpdateAddon,
	useRemoveAddon,
} from '../../api/hooks/useAddons'
import { useCloudinaryUpload } from '../../api/hooks/useCloudinaryUpload'
import { api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { PROVINCES } from '../../lib/constants'
import type { EventFormData, DocFile, Addon } from '../../types/event'

interface Category {
	id: string
	name: string
	slug: string
}

const emptyBatch = {
	name: '',
	price: 0,
	capacity: 0,
	isGroupTicket: false,
	groupSize: 1,
}

export function EventForm() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const isEdit = !!id

	const { data: eventData, isLoading: loadingEvent } = useOrganizerEvent(id ?? '')
	const createEvent = useCreateOrganizerEvent()
	const updateEvent = useUpdateOrganizerEvent(id ?? '')

	const cloudinary = useCloudinaryUpload()
	const bannerInputRef = useRef<HTMLInputElement>(null)
	const galleryInputRef = useRef<HTMLInputElement>(null)

	const originalBatchesRef = useRef<
		Array<{
			id: string
			name: string
			price: number
			capacity: number
			sold: number
			isGroupTicket: boolean
			groupSize: number
		}>
	>([])

	const [categories, setCategories] = useState<Category[]>([])
	const [form, setForm] = useState<EventFormData>({
		title: '',
		description: '',
		province: 'Luanda',
		location: '',
		bannerUrl: '',
		cloudinaryId: '',
		gallery: [],
		categoryIds: [],
		startDate: '',
		endDate: '',
		batches: [{ ...emptyBatch }],
	})

	const [bannerFile, setBannerFile] = useState<File | null>(null)
	const [bannerPreview, setBannerPreview] = useState<string | null>(null)
	const [galleryItems, setGalleryItems] = useState<
		Array<{ url: string; idcloudinary?: string; file?: File }>
	>([])

	const createBatch = useCreateBatch(id ?? '')
	const updateBatch = useUpdateBatch(id ?? '')
	const removeBatch = useRemoveBatch(id ?? '')

	const { data: addonsData } = useAddons(id ?? '')
	const createAddon = useCreateAddon(id ?? '')
	const updateAddon = useUpdateAddon(id ?? '')
	const removeAddon = useRemoveAddon(id ?? '')

	const [addonForm, setAddonForm] = useState({ name: '', description: '', price: 0, capacity: 0 })
	const [editingAddon, setEditingAddon] = useState<string | null>(null)

	useEffect(() => {
		api.get('/categories')
			.then((r) => {
				const data = r.data as { categories: Category[] }
				setCategories(data.categories ?? [])
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		if (isEdit && eventData?.event && !form.title) {
			const ev = eventData.event
			setForm({
				title: ev.title,
				description: ev.description,
				province: ev.province,
				location: ev.location,
				bannerUrl: ev.bannerUrl ?? '',
				cloudinaryId: ev.cloudinaryId ?? '',
				gallery: ev.gallery ?? [],
				categoryIds: ev.eventCategories?.map((ec) => ec.categoryId) ?? [],
				startDate: ev.startDate ? ev.startDate.slice(0, 16) : '',
				endDate: ev.endDate ? ev.endDate.slice(0, 16) : '',
				batches: ev.batches?.length
					? ev.batches.map((b) => ({
							name: b.name,
							price: b.price,
							capacity: b.capacity,
							isGroupTicket: b.isGroupTicket,
							groupSize: b.groupSize,
						}))
					: [{ ...emptyBatch }],
			})
			if (ev.bannerUrl) setBannerPreview(ev.bannerUrl)
			if (ev.gallery?.length) {
				setGalleryItems(
					ev.gallery.map((g) => ({ url: g.url, idcloudinary: g.idcloudinary })),
				)
			}
			originalBatchesRef.current = ev.batches?.length
				? ev.batches.map((b) => ({
						id: b.id,
						name: b.name,
						price: b.price,
						capacity: b.capacity,
						sold: b.sold,
						isGroupTicket: b.isGroupTicket,
						groupSize: b.groupSize,
					}))
				: []
		}
	}, [isEdit, eventData, form.title])

	const updateField = (key: keyof EventFormData, value: string | number | boolean | string[]) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const toggleCategory = (catId: string) => {
		setForm((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(catId)
				? prev.categoryIds.filter((id) => id !== catId)
				: [...prev.categoryIds, catId],
		}))
	}

	const updateFormBatch = (index: number, key: string, value: string | number | boolean) => {
		setForm((prev) => {
			const batches = [...prev.batches]
			batches[index] = { ...batches[index], [key]: value }
			return { ...prev, batches }
		})
	}

	const addBatch = () => {
		setForm((prev) => ({
			...prev,
			batches: [...prev.batches, { ...emptyBatch }],
		}))
	}

	const removeFormBatch = (index: number) => {
		setForm((prev) => ({
			...prev,
			batches: prev.batches.filter((_, i) => i !== index),
		}))
	}

	const resetAddonForm = () => {
		setAddonForm({ name: '', description: '', price: 0, capacity: 0 })
		setEditingAddon(null)
	}

	const handleCreateOrUpdateAddon = async () => {
		if (!addonForm.name.trim()) {
			toast.error('O nome do add-on é obrigatório')
			return
		}
		if (addonForm.price <= 0) {
			toast.error('O preço deve ser maior que zero')
			return
		}
		if (addonForm.capacity < 1) {
			toast.error('A capacidade deve ser pelo menos 1')
			return
		}

		try {
			if (editingAddon) {
				await updateAddon.mutateAsync({
					addonId: editingAddon,
					data: {
						name: addonForm.name,
						description: addonForm.description || undefined,
						price: addonForm.price,
						capacity: addonForm.capacity,
					},
				})
			} else {
				await createAddon.mutateAsync({
					name: addonForm.name,
					description: addonForm.description || undefined,
					price: addonForm.price,
					capacity: addonForm.capacity,
				})
			}
			resetAddonForm()
		} catch {
			// error handled by hook
		}
	}

	const handleEditAddon = (addon: Addon) => {
		setAddonForm({
			name: addon.name,
			description: addon.description ?? '',
			price: addon.price,
			capacity: addon.capacity,
		})
		setEditingAddon(addon.id)
	}

	const handleRemoveAddon = async (addonId: string) => {
		try {
			await removeAddon.mutateAsync(addonId)
		} catch {
			// error handled by hook
		}
	}

	const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Seleciona uma imagem válida')
			return
		}

		setGalleryItems((prev) => [...prev, { url: URL.createObjectURL(file), file }])
	}

	const removeGalleryItem = (index: number) => {
		setGalleryItems((prev) => {
			const item = prev[index]
			if (item.file) URL.revokeObjectURL(item.url)
			return prev.filter((_, i) => i !== index)
		})
	}

	const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Seleciona uma imagem válida')
			return
		}

		setBannerFile(file)
		setBannerPreview(URL.createObjectURL(file))
	}

	const clearBanner = () => {
		if (bannerPreview) URL.revokeObjectURL(bannerPreview)
		setBannerFile(null)
		setBannerPreview(null)
		setForm((prev) => ({
			...prev,
			bannerUrl: '',
			cloudinaryId: '',
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!form.title.trim()) {
			toast.error('O título do evento é obrigatório')
			return
		}

		if (form.categoryIds.length === 0) {
			toast.error('Seleciona pelo menos uma categoria')
			return
		}

		if (!form.startDate || !form.endDate) {
			toast.error('Define a data de início e fim do evento')
			return
		}

		let bannerUrl = form.bannerUrl
		let cloudinaryId = form.cloudinaryId
		let gallery: DocFile[] = []

		try {
			if (bannerFile) {
				const result = await cloudinary.upload(bannerFile, 'eventos/banners')
				bannerUrl = result.url
				cloudinaryId = result.idcloudinary
			}

			const newItems = galleryItems.filter((g) => g.file)
			const existingItems = galleryItems.filter((g) => !g.file)

			if (newItems.length > 0) {
				const uploaded = await Promise.all(
					newItems.map((g) => cloudinary.upload(g.file!, 'eventos/galeria')),
				)
				gallery = [
					...existingItems.map((g) => ({ url: g.url, idcloudinary: g.idcloudinary! })),
					...uploaded,
				]
			} else {
				gallery = existingItems.map((g) => ({ url: g.url, idcloudinary: g.idcloudinary! }))
			}

			const validBatches = form.batches.filter((b) => b.name.trim())
			const payload = {
				...form,
				bannerUrl,
				cloudinaryId,
				gallery,
				startDate: new Date(form.startDate).toISOString(),
				endDate: new Date(form.endDate).toISOString(),
				batches: validBatches,
			}

			if (isEdit) {
				const { batches: _, addons: _a, ...eventPayload } = payload
				await updateEvent.mutateAsync(eventPayload)

				const originals = originalBatchesRef.current
				const originalsByName = new Map(originals.map((b) => [b.name, b]))

				const toDelete: string[] = []
				const toUpdate: Array<{
					batchId: string
					name: string
					price: number
					capacity: number
					isGroupTicket: boolean
					groupSize: number
				}> = []
				const toCreate: typeof validBatches = []

				for (const batch of validBatches) {
					const orig = originalsByName.get(batch.name)
					if (orig) {
						if (
							orig.price !== batch.price ||
							orig.capacity !== batch.capacity ||
							orig.isGroupTicket !== batch.isGroupTicket ||
							orig.groupSize !== batch.groupSize
						) {
							toUpdate.push({ batchId: orig.id, ...batch })
						}
						originalsByName.delete(batch.name)
					} else {
						toCreate.push(batch)
					}
				}

				for (const [, orig] of originalsByName) {
					if (orig.sold === 0) toDelete.push(orig.id)
				}

				await Promise.all([
					...toDelete.map((batchId) => removeBatch.mutateAsync(batchId)),
					...toUpdate.map((data) => updateBatch.mutateAsync(data)),
					...toCreate.map((data) => createBatch.mutateAsync(data)),
				])
			} else {
				await createEvent.mutateAsync(payload)
			}
			navigate('/organizer/events')
		} catch {
			// error handled by hook
		}
	}

	if (isEdit && loadingEvent) {
		return (
			<div className="max-w-3xl space-y-6">
				<Skeleton className="h-8 w-48" />
				<div className="rounded-xl border border-border p-6 space-y-4">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
				<div className="rounded-xl border border-border p-6 space-y-4">
					<Skeleton className="h-5 w-32" />
					<div className="grid sm:grid-cols-2 gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		)
	}

	const isPending =
		createEvent.isPending ||
		updateEvent.isPending ||
		createBatch.isPending ||
		updateBatch.isPending ||
		removeBatch.isPending ||
		createAddon.isPending ||
		updateAddon.isPending ||
		removeAddon.isPending ||
		cloudinary.uploading

	return (
		<div className="max-w-3xl">
			<h1 className="font-heading font-700 text-2xl mb-6">
				{isEdit ? 'Editar Evento' : 'Criar Evento'}
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Informação Básica</h3>
					<div className="flex flex-col gap-4">
						<Input
							label="Título do Evento"
							placeholder="Ex: Festival da Música Angolana"
							value={form.title}
							onChange={(e) => updateField('title', e.target.value)}
							required
						/>
						<div>
							<label className="text-sm font-heading font-600 text-text-secondary block mb-1.5">
								Descrição
							</label>
							<textarea
								className="input-field min-h-[120px] resize-y"
								placeholder="Descrição detalhada do evento"
								value={form.description}
								onChange={(e) => updateField('description', e.target.value)}
								required
							/>
						</div>
					</div>
				</Card>

				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Banner do Evento</h3>
					<input
						ref={bannerInputRef}
						type="file"
						accept=".png,.jpg,.jpeg,.webp"
						className="hidden"
						onChange={handleBannerSelect}
					/>
					{bannerPreview ? (
						<div className="relative mb-3">
							<img
								src={bannerPreview}
								alt="Banner preview"
								className="w-full h-40 object-cover rounded-xl border border-border"
							/>
							<button
								type="button"
								onClick={clearBanner}
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
								<div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
									<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>
					) : (
						<button
							type="button"
							onClick={() => bannerInputRef.current?.click()}
							disabled={cloudinary.uploading}
							className="w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-text-secondary hover:border-brand hover:text-brand transition-all"
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
								{cloudinary.uploading ? 'A enviar...' : 'Carregar Banner'}
							</span>
						</button>
					)}
				</Card>

				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Galeria de Imagens</h3>
					<input
						ref={galleryInputRef}
						type="file"
						accept=".png,.jpg,.jpeg,.webp"
						className="hidden"
						onChange={handleGallerySelect}
					/>
					{galleryItems.length > 0 && (
						<div className="grid grid-cols-3 gap-2 mb-3">
							{galleryItems.map((item, i) => (
								<div key={i} className="relative group">
									<img
										src={item.url}
										alt={`Galeria ${i + 1}`}
										className="w-full h-24 object-cover rounded-lg border border-border"
									/>
									<button
										type="button"
										onClick={() => removeGalleryItem(i)}
										className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
									>
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
										>
											<line x1="18" y1="6" x2="6" y2="18" />
											<line x1="6" y1="6" x2="18" y2="18" />
										</svg>
									</button>
								</div>
							))}
						</div>
					)}
					<button
						type="button"
						onClick={() => galleryInputRef.current?.click()}
						className="w-full h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-text-secondary hover:border-brand hover:text-brand transition-all"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
						</svg>
						<span className="text-sm">Adicionar Imagem</span>
					</button>
				</Card>

				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Data e Local</h3>
					<div className="grid sm:grid-cols-2 gap-4">
						<Input
							label="Início"
							type="datetime-local"
							value={form.startDate}
							onChange={(e) => updateField('startDate', e.target.value)}
							required
						/>
						<Input
							label="Fim"
							type="datetime-local"
							value={form.endDate}
							onChange={(e) => updateField('endDate', e.target.value)}
							required
						/>
						<div className="sm:col-span-2">
							<label className="text-sm font-heading font-600 text-text-secondary block mb-2">
								Categorias
							</label>
							<div className="flex flex-wrap gap-2">
								{categories.map((c) => {
									const selected = form.categoryIds.includes(c.id)
									return (
										<button
											key={c.id}
											type="button"
											onClick={() => toggleCategory(c.id)}
											className={`px-3 py-1.5 text-sm font-heading font-600 rounded-lg border transition-all ${
												selected
													? 'bg-brand text-white border-brand'
													: 'bg-transparent text-text-secondary border-border hover:border-brand hover:text-brand'
											}`}
										>
											{c.name}
										</button>
									)
								})}
								{categories.length === 0 && (
									<p className="text-xs text-text-secondary">
										A carregar categorias...
									</p>
								)}
							</div>
						</div>
						<select
							value={form.province}
							onChange={(e) => updateField('province', e.target.value)}
							className="input-field"
						>
							{PROVINCES.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>
						<Input
							label="Local"
							placeholder="Ex: Estádio 11 de Novembro, Luanda"
							value={form.location}
							onChange={(e) => updateField('location', e.target.value)}
							className="sm:col-span-2"
							required
						/>
					</div>
				</Card>

				<Card>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading font-600 text-base">Lotes de Bilhetes</h3>
						<Button type="button" variant="outline" size="sm" onClick={addBatch}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
							Adicionar
						</Button>
					</div>

					<div className="space-y-4">
						{form.batches.map((batch, i) => (
							<div key={i} className="p-4 border border-border rounded-xl relative">
								{form.batches.length > 1 && (
									<button
										type="button"
										onClick={() => removeFormBatch(i)}
										className="absolute top-3 right-3 text-red-500 hover:text-red-700"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M18 6L6 18M6 6l12 12" />
										</svg>
									</button>
								)}
								<div className="grid sm:grid-cols-3 gap-3">
									<Input
										label="Nome"
										placeholder="Ex: VIP"
										value={batch.name}
										onChange={(e) => updateFormBatch(i, 'name', e.target.value)}
										required
									/>
									<Input
										label="Preço (Kz)"
										type="number"
										min="0"
										value={batch.price || ''}
										onChange={(e) =>
											updateFormBatch(i, 'price', Number(e.target.value))
										}
										required
									/>
									<Input
										label="Capacidade"
										type="number"
										min="1"
										value={batch.capacity || ''}
										onChange={(e) =>
											updateFormBatch(i, 'capacity', Number(e.target.value))
										}
										required
									/>
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											checked={batch.isGroupTicket}
											onChange={(e) =>
												updateFormBatch(
													i,
													'isGroupTicket',
													e.target.checked,
												)
											}
											className="rounded border-border"
										/>
										<span className="font-heading font-600 text-text-secondary">
											Bilhete de Grupo
										</span>
									</label>
									{batch.isGroupTicket && (
										<Input
											label="Pessoas por Grupo"
											type="number"
											min="2"
											value={batch.groupSize}
											onChange={(e) =>
												updateFormBatch(
													i,
													'groupSize',
													Number(e.target.value),
												)
											}
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Add-ons */}
				{isEdit && (
					<Card>
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-heading font-600 text-base">Add-ons</h3>
						</div>

						{/* Existing addons */}
						{(addonsData?.addons ?? []).length > 0 && (
							<div className="space-y-2 mb-4">
								{addonsData?.addons.map((addon) => (
									<div
										key={addon.id}
										className="flex items-center justify-between p-3 border border-border rounded-xl"
									>
										<div className="flex-1 min-w-0 mr-3">
											<p className="text-sm font-heading font-600 truncate">
												{addon.name}
											</p>
											<p className="text-xs text-text-secondary truncate">
												{addon.description ?? 'Sem descrição'}
											</p>
											<p className="text-xs text-text-secondary mt-0.5">
												{addon.price.toLocaleString()} Kz · {addon.capacity}{' '}
												stock · {addon.sold} vendidos
											</p>
										</div>
										<div className="flex items-center gap-1 shrink-0">
											<button
												type="button"
												onClick={() => handleEditAddon(addon)}
												className="p-2 text-text-secondary hover:text-brand transition-colors"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
													<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
												</svg>
											</button>
											<button
												type="button"
												onClick={() => handleRemoveAddon(addon.id)}
												className="p-2 text-text-secondary hover:text-red-500 transition-colors"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
												</svg>
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Addon form */}
						<div className="grid sm:grid-cols-4 gap-3 items-end">
							<Input
								label="Nome"
								placeholder="Ex: Cartão Consumo"
								value={addonForm.name}
								onChange={(e) =>
									setAddonForm((p) => ({ ...p, name: e.target.value }))
								}
							/>
							<Input
								label="Descrição (opcional)"
								placeholder="Ex: 5.000 Kz em créditos"
								value={addonForm.description}
								onChange={(e) =>
									setAddonForm((p) => ({ ...p, description: e.target.value }))
								}
							/>
							<Input
								label="Preço (Kz)"
								type="number"
								min="0"
								value={addonForm.price || ''}
								onChange={(e) =>
									setAddonForm((p) => ({ ...p, price: Number(e.target.value) }))
								}
							/>
							<Input
								label="Stock"
								type="number"
								min="1"
								value={addonForm.capacity || ''}
								onChange={(e) =>
									setAddonForm((p) => ({
										...p,
										capacity: Number(e.target.value),
									}))
								}
							/>
						</div>
						<div className="flex items-center gap-2 mt-3">
							<Button
								type="button"
								size="sm"
								onClick={handleCreateOrUpdateAddon}
								loading={createAddon.isPending || updateAddon.isPending}
							>
								{editingAddon ? 'Atualizar' : 'Adicionar'}
							</Button>
							{editingAddon && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={resetAddonForm}
								>
									Cancelar
								</Button>
							)}
						</div>
					</Card>
				)}

				<div className="flex items-center gap-3">
					<Button type="submit" loading={isPending}>
						{isEdit ? 'Guardar Alterações' : 'Criar Evento'}
					</Button>
					<Button
						type="button"
						variant="ghost"
						onClick={() => navigate('/organizer/events')}
					>
						Cancelar
					</Button>
				</div>
			</form>
		</div>
	)
}
