import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreateEvent, useUpdateEvent } from '../../api/hooks/useEvents'
import { useEvent } from '../../api/hooks/useEvents'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { EVENT_CATEGORIES, PROVINCES, PERIODS } from '../../lib/constants'
import type { EventFormData, TicketType } from '../../types/event'

const emptyTicket = {
	name: '',
	price: 0,
	capacity: 0,
	peoplePerTicket: 1,
	quantity: 0,
	description: '',
}

interface InitEventData {
	title?: string
	description?: string
	shortDescription?: string
	coverImage?: string
	category?: string
	province?: string
	date?: string
	time?: string
	period?: string
	venue?: string
	address?: string
	ticketTypes?: Array<{
		name: string
		price: number
		capacity: number
		peoplePerTicket: number
		quantity: number
		description?: string
	}>
}

function initForm(ev: { event?: InitEventData } | undefined): EventFormData {
	if (!ev?.event) {
		return {
			title: '',
			description: '',
			shortDescription: '',
			coverImage: '',
			category: 'conference',
			province: 'Luanda',
			date: '',
			time: '',
			period: 'night',
			venue: '',
			address: '',
			ticketTypes: [{ ...emptyTicket }],
		}
	}
	const e = ev.event
	return {
		title: e.title ?? '',
		description: e.description ?? '',
		shortDescription: e.shortDescription ?? '',
		coverImage: e.coverImage ?? '',
		category: (e.category as EventFormData['category']) ?? 'conference',
		province: e.province ?? 'Luanda',
		date: e.date ? e.date.split('T')[0] : '',
		time: e.time ?? '',
		period: (e.period as EventFormData['period']) ?? 'night',
		venue: e.venue ?? '',
		address: e.address ?? '',
		ticketTypes: e.ticketTypes?.map((t) => ({
			name: t.name,
			price: t.price,
			capacity: t.capacity,
			peoplePerTicket: t.peoplePerTicket,
			quantity: t.quantity,
			description: t.description ?? '',
		})) ?? [{ ...emptyTicket }],
	}
}

export function EventForm() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const isEdit = !!id
	const { data, isLoading: loadingEvent } = useEvent(id ?? '')
	const createEvent = useCreateEvent()
	const updateEvent = useUpdateEvent(id ?? '')

	const [form, setForm] = useState<EventFormData>(() => initForm(isEdit ? data : undefined))
	// Sync form with loaded data when it arrives
	if (isEdit && data?.event && form.title === '') {
		setForm(initForm(data))
	}

	type FormValue =
		| string
		| string[]
		| {
				name: string
				price: number
				capacity: number
				peoplePerTicket: number
				quantity: number
				description?: string
		  }[]
	const updateField = (key: keyof EventFormData, value: FormValue) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const updateTicket = (index: number, key: keyof TicketType, value: string | number) => {
		setForm((prev) => {
			const tickets = [...prev.ticketTypes]
			tickets[index] = { ...tickets[index], [key]: value }
			return { ...prev, ticketTypes: tickets }
		})
	}

	const addTicket = () => {
		setForm((prev) => ({
			...prev,
			ticketTypes: [...prev.ticketTypes, { ...emptyTicket }],
		}))
	}

	const removeTicket = (index: number) => {
		setForm((prev) => ({
			...prev,
			ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (isEdit) {
				await updateEvent.mutateAsync(form as unknown as Record<string, unknown>)
			} else {
				await createEvent.mutateAsync(form)
			}
			navigate('/organizer/events')
		} catch (err) {
			console.error(err)
		}
	}

	if (isEdit && loadingEvent) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
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
				{/* Basic info */}
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
								Descrição Curta
							</label>
							<input
								className="input-field"
								placeholder="Breve descrição para o card"
								value={form.shortDescription}
								onChange={(e) => updateField('shortDescription', e.target.value)}
							/>
						</div>
						<div>
							<label className="text-sm font-heading font-600 text-text-secondary block mb-1.5">
								Descrição Completa
							</label>
							<textarea
								className="input-field min-h-[100px] resize-y"
								placeholder="Descrição detalhada do evento"
								value={form.description}
								onChange={(e) => updateField('description', e.target.value)}
							/>
						</div>
						<Input
							label="URL da Imagem de Capa"
							placeholder="https://..."
							value={form.coverImage}
							onChange={(e) => updateField('coverImage', e.target.value)}
						/>
					</div>
				</Card>

				{/* Date & Location */}
				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Data e Local</h3>
					<div className="grid sm:grid-cols-2 gap-4">
						<Input
							label="Data"
							type="date"
							value={form.date}
							onChange={(e) => updateField('date', e.target.value)}
							required
						/>
						<Input
							label="Hora"
							type="time"
							value={form.time}
							onChange={(e) => updateField('time', e.target.value)}
							required
						/>
						<select
							value={form.period}
							onChange={(e) => updateField('period', e.target.value)}
							className="input-field"
						>
							{PERIODS.map((p) => (
								<option key={p.value} value={p.value}>
									{p.label}
								</option>
							))}
						</select>
						<select
							value={form.category}
							onChange={(e) => updateField('category', e.target.value)}
							className="input-field"
						>
							{EVENT_CATEGORIES.map((c) => (
								<option key={c.value} value={c.value}>
									{c.label}
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
							label="Local/Venue"
							placeholder="Ex: Estádio 11 de Novembro"
							value={form.venue}
							onChange={(e) => updateField('venue', e.target.value)}
							required
						/>
						<Input
							label="Endereço"
							placeholder="Ex: Via Expressa, Luanda"
							value={form.address}
							onChange={(e) => updateField('address', e.target.value)}
							className="sm:col-span-2"
						/>
					</div>
				</Card>

				{/* Ticket Types */}
				<Card>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading font-600 text-base">
							Tipos de Ingresso (Lotes)
						</h3>
						<Button type="button" variant="outline" size="sm" onClick={addTicket}>
							<svg
								width="14"
								height="14"
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
						</Button>
					</div>

					<div className="space-y-4">
						{form.ticketTypes.map((ticket, i) => (
							<div key={i} className="p-4 border border-border rounded-xl relative">
								{form.ticketTypes.length > 1 && (
									<button
										type="button"
										onClick={() => removeTicket(i)}
										className="absolute top-3 right-3 text-red-500 hover:text-red-700"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										>
											<path d="M18 6L6 18M6 6l12 12" />
										</svg>
									</button>
								)}
								<div className="grid sm:grid-cols-3 gap-3">
									<Input
										label="Nome"
										placeholder="Ex: VIP"
										value={ticket.name}
										onChange={(e) => updateTicket(i, 'name', e.target.value)}
										required
									/>
									<Input
										label="Preço (Kz)"
										type="number"
										min="0"
										value={ticket.price || ''}
										onChange={(e) =>
											updateTicket(i, 'price', Number(e.target.value))
										}
										required
									/>
									<Input
										label="Pessoas por Bilhete"
										type="number"
										min="1"
										value={ticket.peoplePerTicket}
										onChange={(e) =>
											updateTicket(
												i,
												'peoplePerTicket',
												Number(e.target.value),
											)
										}
									/>
									<Input
										label="Quantidade Total"
										type="number"
										min="0"
										value={ticket.quantity || ''}
										onChange={(e) =>
											updateTicket(i, 'quantity', Number(e.target.value))
										}
										required
									/>
									<Input
										label="Lotação Máxima"
										type="number"
										min="0"
										value={ticket.capacity || ''}
										onChange={(e) =>
											updateTicket(i, 'capacity', Number(e.target.value))
										}
									/>
									<div>
										<label className="text-sm font-heading font-600 text-text-secondary block mb-1.5">
											Descrição
										</label>
										<input
											className="input-field"
											placeholder="Opcional"
											value={ticket.description ?? ''}
											onChange={(e) =>
												updateTicket(i, 'description', e.target.value)
											}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Submit */}
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
