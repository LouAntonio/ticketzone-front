import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useOrganizerEvent, useCreateOrganizerEvent, useUpdateOrganizerEvent } from '../../api/hooks/useOrganizer'
import { useCloudinaryUpload } from '../../api/hooks/useCloudinaryUpload'
import { api } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { PROVINCES } from '../../lib/constants'
import type { EventFormData } from '../../types/event'

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

	const [categories, setCategories] = useState<Category[]>([])
	const [form, setForm] = useState<EventFormData>({
		title: '',
		description: '',
		province: 'Luanda',
		location: '',
		bannerUrl: '',
		cloudinaryId: '',
		categoryId: '',
		startDate: '',
		endDate: '',
		batches: [{ ...emptyBatch }],
	})

	const [bannerPreview, setBannerPreview] = useState<string | null>(null)

	useEffect(() => {
		api.get('/categories').then((r) => {
			const data = r.data as { categories: Category[] }
			setCategories(data.categories ?? [])
		}).catch(() => {})
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
				categoryId: ev.categoryId,
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
		}
	}, [isEdit, eventData, form.title])

	const updateField = (key: keyof EventFormData, value: string | number | boolean) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const updateBatch = (index: number, key: string, value: string | number | boolean) => {
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

	const removeBatch = (index: number) => {
		setForm((prev) => ({
			...prev,
			batches: prev.batches.filter((_, i) => i !== index),
		}))
	}

	const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Seleciona uma imagem válida')
			return
		}

		try {
			const result = await cloudinary.upload(file, 'eventos/banners')
			setForm((prev) => ({
				...prev,
				bannerUrl: result.url,
				cloudinaryId: result.idcloudinary,
			}))
			setBannerPreview(result.url)
		} catch {
			toast.error('Erro ao fazer upload do banner')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!form.title.trim()) {
			toast.error('O título do evento é obrigatório')
			return
		}

		if (!form.categoryId) {
			toast.error('Seleciona uma categoria')
			return
		}

		if (!form.startDate || !form.endDate) {
			toast.error('Define a data de início e fim do evento')
			return
		}

		const payload = {
			...form,
			startDate: new Date(form.startDate).toISOString(),
			endDate: new Date(form.endDate).toISOString(),
			batches: form.batches.filter((b) => b.name.trim()),
		}

		try {
			if (isEdit) {
				await updateEvent.mutateAsync(payload)
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

	const isPending = createEvent.isPending || updateEvent.isPending

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
						onChange={handleBannerUpload}
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
								onClick={() => {
									setBannerPreview(null)
									setForm((prev) => ({ ...prev, bannerUrl: '', cloudinaryId: '' }))
								}}
								disabled={cloudinary.uploading}
								className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
							</svg>
							<span className="text-sm">{cloudinary.uploading ? 'A enviar...' : 'Carregar Banner'}</span>
						</button>
					)}
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
						<select
							value={form.categoryId}
							onChange={(e) => updateField('categoryId', e.target.value)}
							className="input-field"
							required
						>
							<option value="">Selecionar Categoria</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
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
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
										onClick={() => removeBatch(i)}
										className="absolute top-3 right-3 text-red-500 hover:text-red-700"
									>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M18 6L6 18M6 6l12 12" />
										</svg>
									</button>
								)}
								<div className="grid sm:grid-cols-3 gap-3">
									<Input
										label="Nome"
										placeholder="Ex: VIP"
										value={batch.name}
										onChange={(e) => updateBatch(i, 'name', e.target.value)}
										required
									/>
									<Input
										label="Preço (Kz)"
										type="number"
										min="0"
										value={batch.price || ''}
										onChange={(e) => updateBatch(i, 'price', Number(e.target.value))}
										required
									/>
									<Input
										label="Capacidade"
										type="number"
										min="1"
										value={batch.capacity || ''}
										onChange={(e) => updateBatch(i, 'capacity', Number(e.target.value))}
										required
									/>
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											checked={batch.isGroupTicket}
											onChange={(e) => updateBatch(i, 'isGroupTicket', e.target.checked)}
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
											onChange={(e) => updateBatch(i, 'groupSize', Number(e.target.value))}
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</Card>

				<div className="flex items-center gap-3">
					<Button type="submit" loading={isPending || cloudinary.uploading}>
						{isEdit ? 'Guardar Alterações' : 'Criar Evento'}
					</Button>
					<Button type="button" variant="ghost" onClick={() => navigate('/organizer/events')}>
						Cancelar
					</Button>
				</div>
			</form>
		</div>
	)
}
