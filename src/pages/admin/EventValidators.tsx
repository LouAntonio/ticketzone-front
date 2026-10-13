import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	useAddEventValidator,
	useAdminUsers,
	useEventValidators,
	useRemoveEventValidator,
	useStartPrivateEvent,
} from '../../api/hooks/useAdmin'

/**
 * Validadores de um evento privado.
 *
 *Um evento `INVITE_ONLY` não tem promotor real — o `promoterId` aponta para
 * uma conta técnica —, por isso quem gere isto é o admin. O resto é igual ao
 * que um organizador faz num evento normal.
 *
 * O botão de iniciar o evento está aqui porque sem `startedAt` o
 * `validateTicket` recusa o consumo com "O evento ainda não foi iniciado".
 */
export function AdminEventValidators() {
	const { id: eventId } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState<string | null>(null)

	const { data: validators, isLoading } = useEventValidators(eventId)
	const { data: candidates } = useAdminUsers(
		search.trim() ? { search: search.trim(), limit: 10 } : undefined,
	)
	const addValidator = useAddEventValidator(eventId)
	const removeValidator = useRemoveEventValidator(eventId)
	const startEvent = useStartPrivateEvent(eventId)

	function submit() {
		if (!selected) return
		addValidator.mutate(selected, { onSuccess: () => setSelected(null) })
	}

	return (
		<div className="space-y-6">
			<div>
				<button
					type="button"
					onClick={() => navigate('/admin/events')}
					className="mb-3 inline-flex items-center gap-1.5 text-xs font-heading text-[#8a7a6e] hover:text-[#d4c5b8] transition-colors"
				>
					← Eventos
				</button>
				<h1 className="font-display text-2xl text-stone-100">Validadores</h1>
				<p className="mt-1 text-sm text-stone-400">
					Quem valida as entradas à porta. Precisam de conta, e leem o QR do convite no
					próprio telemóvel.
				</p>
			</div>

			<section className="card-admin p-5">
				<h2 className="text-sm font-heading font-500 text-[#d4c5b8]">Iniciar o evento</h2>
				<p className="mt-1 text-xs text-[#6a5a4e]">
					Enquanto o evento não estiver iniciado, nenhum bilhete pode consumir entradas.
					Faz isto no dia do evento.
				</p>
				<button
					type="button"
					onClick={() => startEvent.mutate()}
					disabled={startEvent.isPending}
					className="btn-admin-success mt-3"
				>
					{startEvent.isPending ? 'A iniciar…' : 'Iniciar evento'}
				</button>
			</section>

			<section className="card-admin p-5">
				<label
					htmlFor="validator-search"
					className="block text-sm font-medium text-stone-300"
				>
					Adicionar validador
				</label>
				<p className="mt-1 text-xs text-stone-500">
					Procura por nome ou email. A pessoa tem de já ter conta.
				</p>
				<input
					id="validator-search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="nome ou email"
					className="input-admin mt-3 w-full"
				/>

				{candidates && candidates.users && candidates.users.length > 0 && (
					<ul className="mt-3 max-h-56 overflow-auto border border-[#3d3028]">
						{candidates.users.map((u) => (
							<li key={u.id}>
								<button
									type="button"
									onClick={() => setSelected(u.id)}
									className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
										selected === u.id
											? 'bg-white/[0.06] text-[#d4c5b8]'
											: 'text-[#8a7a6e] hover:bg-white/[0.03]'
									}`}
								>
									<span className="truncate">{u.name ?? u.email}</span>
									<span className="truncate text-xs text-[#6a5a4e]">
										{u.email}
									</span>
								</button>
							</li>
						))}
					</ul>
				)}

				{search.trim() &&
					candidates &&
					(!candidates.users || candidates.users.length === 0) && (
						<p className="mt-3 text-xs text-[#6a5a4e]">
							Ninguém encontrado com esse nome. A pessoa precisa de ter conta.
						</p>
					)}

				<button
					type="button"
					onClick={submit}
					disabled={!selected || addValidator.isPending}
					className="btn-admin-brand mt-3"
				>
					{addValidator.isPending ? 'A adicionar…' : 'Adicionar'}
				</button>
			</section>

			{isLoading ? (
				<p className="py-10 text-center text-stone-400">A carregar validadores…</p>
			) : !validators || validators.length === 0 ? (
				<div className="card-admin p-10 text-center">
					<p className="text-stone-300">Ainda não há validadores neste evento.</p>
					<p className="mt-1 text-sm text-stone-500">
						Sem validadores, ninguém consegue consumir entradas à porta.
					</p>
				</div>
			) : (
				<ul className="space-y-2">
					{validators.map((v) => (
						<li
							key={v.id}
							className="card-admin flex flex-wrap items-center justify-between gap-3 p-4"
						>
							<div className="min-w-0">
								<p className="truncate font-medium text-stone-100">
									{v.user.name ?? v.user.email}
								</p>
								<p className="mt-0.5 truncate text-xs text-stone-500">
									{v.user.email}
									{v.addedBy?.name ? ` · adicionado por ${v.addedBy.name}` : ''}
								</p>
							</div>
							<button
								type="button"
								onClick={() => {
									if (
										window.confirm(
											`Remover ${v.user.name ?? v.user.email} como validador?`,
										)
									) {
										removeValidator.mutate(v.user.id)
									}
								}}
								className="btn-admin-danger"
							>
								Remover
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
