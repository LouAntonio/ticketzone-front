import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	useAddEventGuests,
	useEventGuests,
	useRemoveEventGuest,
	useUpdateEventGuest,
} from '../../api/hooks/useAdmin'
import { toast } from 'react-hot-toast'

/**
 * Gestão da lista de convidados de um evento privado.
 *
 * A forma principal de entrada é colar a lista tal como chega de quem está a
 * organizar: um nome por linha, quantas pessoas vem em cada linha. É o que se
 * recebe por WhatsApp, e pedir ao admin que preencha um formulário por
 * familia seria trabalho a mais sem ganho nenhum.
 */
export function AdminEventGuests() {
	const { id: eventId } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [raw, setRaw] = useState('')
	const [filter, setFilter] = useState('')

	const { data, isLoading } = useEventGuests(eventId)
	const addGuests = useAddEventGuests(eventId)
	const updateGuest = useUpdateEventGuest(eventId)
	const removeGuest = useRemoveEventGuest(eventId)

	/** "Ana Pereira (3)" → nome + 3 pessoas. Sem parênteses, 1 pessoa. */
	const parsed = useMemo(() => {
		return raw
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => {
				const match = line.match(/^(.*?)\s*[×x]?\s*\((\d+)\)\s*$/)
				if (match) {
					return { name: match[1].trim(), partySize: Number(match[2]) }
				}
				return { name: line, partySize: 1 }
			})
			.filter((entry) => entry.name.length > 0)
	}, [raw])

	const guests = useMemo(() => data?.guests ?? [], [data?.guests])
	const visible = useMemo(() => {
		const term = filter.trim().toLocaleLowerCase('pt-PT')
		if (!term) return guests
		return guests.filter((g) => g.name.toLocaleLowerCase('pt-PT').includes(term))
	}, [guests, filter])

	function inviteLink(token: string): string {
		return `${window.location.origin}/convite/${token}`
	}

	async function handleCopy(token: string) {
		try {
			await navigator.clipboard.writeText(inviteLink(token))
			toast.success('Link copiado')
		} catch {
			toast.error('Não foi possível copiar. Abre o link e copia à mão.')
		}
	}

	function handleShare(token: string, name: string) {
		const url = inviteLink(token)
		const text = encodeURIComponent(
			`Olá ${name}! Estás convidado(a) para ${data ? 'o nosso evento' : 'o evento'}. O teu convite:`,
		)
		window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, '_blank')
	}

	function submit() {
		const batchId = data?.batches[0]?.id
		if (!eventId || !batchId || parsed.length === 0) return

		addGuests.mutate({ batchId, guests: parsed }, { onSuccess: () => setRaw('') })
	}

	if (isLoading) {
		return <p className="py-16 text-center text-stone-400">A carregar convidados…</p>
	}

	return (
		<div className="space-y-6">
			<header>
				<button
					type="button"
					onClick={() => navigate('/admin/events')}
					className="mb-3 inline-flex items-center gap-1.5 text-xs font-heading text-[#8a7a6e] hover:text-[#d4c5b8] transition-colors"
				>
					← Eventos
				</button>
				<h1 className="font-display text-2xl text-stone-100">Convidados</h1>
				<p className="mt-1 text-sm text-stone-400">
					{data
						? `${data.totals.people} pessoas em ${data.totals.parties} agregado(s).`
						: 'Lista de convidados deste evento.'}
				</p>
			</header>

			<section className="card-admin p-5">
				<label htmlFor="guests-input" className="block text-sm font-medium text-stone-300">
					Adicionar convidados
				</label>
				<p className="mt-1 text-xs text-stone-500">
					Um nome por linha. Para um grupo, acrescenta o número entre parênteses — por
					exemplo <code className="text-stone-400">Ana e Mbala (2)</code>.
				</p>
				<textarea
					id="guests-input"
					value={raw}
					onChange={(e) => setRaw(e.target.value)}
					rows={6}
					placeholder={'Ana e Mbala (2)\nJoão Silva\nFamília Costa (4)'}
					className="input-admin mt-3 w-full font-mono text-sm"
				/>
				<div className="mt-3 flex items-center justify-between gap-4">
					<p className="text-xs text-stone-500">
						{!data?.batches[0]
							? 'Este evento não tem lote de bilhetes.'
							: parsed.length > 0
								? `${parsed.length} linha(s), ${parsed.reduce((s, p) => s + p.partySize, 0)} pessoas`
								: 'Nada para registar ainda.'}
					</p>
					<button
						type="button"
						onClick={submit}
						disabled={parsed.length === 0 || !data?.batches[0] || addGuests.isPending}
						className="btn-admin-brand"
					>
						{addGuests.isPending ? 'A registar…' : 'Registar convidados'}
					</button>
				</div>
			</section>

			{guests.length > 0 && (
				<label className="block">
					<span className="sr-only">Procurar convidado</span>
					<input
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						placeholder="Procurar convidado…"
						className="input-admin w-full"
					/>
				</label>
			)}

			{visible.length === 0 ? (
				<div className="card-admin p-10 text-center">
					<p className="text-stone-300">
						{guests.length === 0
							? 'Ainda não há convidados registados.'
							: 'Nenhum convidado corresponde à procura.'}
					</p>
					<p className="mt-1 text-sm text-stone-500">
						{guests.length === 0
							? 'Cola a lista em cima e cada pessoa fica com o seu próprio link de convite.'
							: 'Tenta outro nome.'}
					</p>
				</div>
			) : (
				<ul className="space-y-2">
					{visible.map((guest) => (
						<li key={guest.id} className="card-admin p-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="truncate font-medium text-stone-100">
										{guest.name}
									</p>
									<p className="mt-0.5 text-xs text-stone-500">
										{guest.partySize} pessoa{guest.partySize === 1 ? '' : 's'}
										{guest.ticket
											? ` · bilhete ${guest.ticket.entriesUsed}/${guest.ticket.entriesAllowed} entradas usadas`
											: ' · sem bilhete'}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<label className="sr-only" htmlFor={`size-${guest.id}`}>
										Número de pessoas para {guest.name}
									</label>
									<input
										id={`size-${guest.id}`}
										type="number"
										min={1}
										max={50}
										defaultValue={guest.partySize}
										onBlur={(e) => {
											const next = Number(e.target.value)
											if (next >= 1 && next !== guest.partySize) {
												updateGuest.mutate({
													guestId: guest.id,
													partySize: next,
												})
											}
										}}
										className="input-admin w-16 text-center"
									/>
									<button
										type="button"
										onClick={() => handleCopy(guest.token)}
										className="btn-admin-ghost"
									>
										Copiar link
									</button>
									<button
										type="button"
										onClick={() => handleShare(guest.token, guest.name)}
										className="btn-admin-success"
									>
										WhatsApp
									</button>
									<button
										type="button"
										onClick={() => {
											if (
												window.confirm(
													`Remover ${guest.name}? O bilhete é apagado e o lugar volta ao lote.`,
												)
											) {
												removeGuest.mutate(guest.id)
											}
										}}
										className="btn-admin-danger"
									>
										Remover
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
