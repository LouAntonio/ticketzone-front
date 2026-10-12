import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreatePrivateEvent } from '../../api/hooks/useAdmin'
import { PROVINCES } from '../../lib/constants'

/**
 * Criação de um evento privado.
 *
 * Não passa pelo ciclo de aprovação: o evento nasce publicado e acessível
 * apenas por link de convite. Por isso o formulário é mais curto do que o do
 * promotor — o que faz sentido, porque aqui quem decide é a própria
 * plataforma.
 */
export function PrivateEventForm() {
	const navigate = useNavigate()
	const createEvent = useCreatePrivateEvent()

	const [form, setForm] = useState({
		title: '',
		organizerName: '',
		description: '',
		province: 'Luanda',
		location: '',
		venue: '',
		address: '',
		startDate: '',
		endDate: '',
		capacity: '200',
	})

	const set = (key: keyof typeof form) => (value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }))

	const valid =
		form.title.trim().length >= 2 &&
		form.organizerName.trim().length > 0 &&
		form.location.trim().length > 0 &&
		form.startDate !== '' &&
		form.endDate !== '' &&
		new Date(form.startDate) < new Date(form.endDate)

	function submit() {
		if (!valid) return
		createEvent.mutate(
			{
				title: form.title.trim(),
				organizerName: form.organizerName.trim(),
				description: form.description.trim() || 'Convite',
				province: form.province,
				location: form.location.trim(),
				venue: form.venue.trim() || undefined,
				address: form.address.trim() || undefined,
				startDate: new Date(form.startDate).toISOString(),
				endDate: new Date(form.endDate).toISOString(),
				batches: [{ name: 'Convites', capacity: Number(form.capacity) || 200 }],
			},
			{
				onSuccess: (event) => {
					navigate(`/admin/events/${event.id}/guests`)
				},
			},
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-4xl tracking-[0.08em] text-white uppercase">
					Evento privado
				</h1>
				<p className="text-[#8a7a6e] text-sm mt-1 font-heading">
					Não aparece no catálogo. Só quem recebe um link vê o evento e o seu bilhete.
				</p>
			</div>

			<section className="card-admin p-6 space-y-4">
				<label className="block">
					<span className="text-sm font-heading text-[#d4c5b8]">Nome do evento</span>
					<input
						value={form.title}
						onChange={(e) => set('title')(e.target.value)}
						placeholder="Casamento de Ana e Mbala"
						className="input-admin mt-1 w-full"
					/>
				</label>

				<label className="block">
					<span className="text-sm font-heading text-[#d4c5b8]">Quem organiza</span>
					<input
						value={form.organizerName}
						onChange={(e) => set('organizerName')(e.target.value)}
						placeholder="Ana e Mbala"
						className="input-admin mt-1 w-full"
					/>
					<span className="mt-1 block text-xs text-[#6a5a4e]">
						Aparece no convite como organizador.
					</span>
				</label>

				<label className="block">
					<span className="text-sm font-heading text-[#d4c5b8]">Descrição</span>
					<textarea
						value={form.description}
						onChange={(e) => set('description')(e.target.value)}
						rows={2}
						className="input-admin mt-1 w-full"
					/>
				</label>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Começa</span>
						<input
							type="datetime-local"
							value={form.startDate}
							onChange={(e) => set('startDate')(e.target.value)}
							className="input-admin mt-1 w-full"
						/>
					</label>
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Termina</span>
						<input
							type="datetime-local"
							value={form.endDate}
							onChange={(e) => set('endDate')(e.target.value)}
							className="input-admin mt-1 w-full"
						/>
					</label>
				</div>

				{form.startDate && form.endDate && form.startDate >= form.endDate && (
					<p className="text-sm text-red-400">
						A data de fim tem de ser depois da data de início.
					</p>
				)}

				<label className="block">
					<span className="text-sm font-heading text-[#d4c5b8]">Local</span>
					<input
						value={form.location}
						onChange={(e) => set('location')(e.target.value)}
						placeholder="Luanda"
						className="input-admin mt-1 w-full"
					/>
				</label>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Estabelecimento</span>
						<input
							value={form.venue}
							onChange={(e) => set('venue')(e.target.value)}
							placeholder="Igreja de São José"
							className="input-admin mt-1 w-full"
						/>
					</label>
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Morada</span>
						<input
							value={form.address}
							onChange={(e) => set('address')(e.target.value)}
							className="input-admin mt-1 w-full"
						/>
					</label>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Província</span>
						<select
							value={form.province}
							onChange={(e) => set('province')(e.target.value)}
							className="select-admin mt-1 w-full"
						>
							{PROVINCES.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>
					</label>
					<label className="block">
						<span className="text-sm font-heading text-[#d4c5b8]">Lugares</span>
						<input
							type="number"
							min={1}
							value={form.capacity}
							onChange={(e) => set('capacity')(e.target.value)}
							className="input-admin mt-1 w-full"
						/>
						<span className="mt-1 block text-xs text-[#6a5a4e]">
							Conta pessoas, não bilhetes.
						</span>
					</label>
				</div>
			</section>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => navigate('/admin/events')}
					className="btn-admin-ghost"
				>
					Cancelar
				</button>
				<button
					type="button"
					onClick={submit}
					disabled={!valid || createEvent.isPending}
					className="btn-admin-brand"
				>
					{createEvent.isPending ? 'A criar…' : 'Criar e registar convidados'}
				</button>
			</div>
		</div>
	)
}
