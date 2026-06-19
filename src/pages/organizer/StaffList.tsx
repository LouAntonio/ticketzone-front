import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
	useOrganizerEventStaff,
	useAddOrganizerStaff,
	useRemoveOrganizerStaff,
	useOrganizerEvent,
	useLookupUser,
} from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { formatDate } from '../../lib/format'
import { toast } from 'react-hot-toast'

export function StaffList() {
	const { id } = useParams<{ id: string }>()
	const { data: eventData } = useOrganizerEvent(id ?? '')
	const { data: staffData, isLoading } = useOrganizerEventStaff(id ?? '')
	const addStaff = useAddOrganizerStaff(id ?? '')
	const removeStaff = useRemoveOrganizerStaff(id ?? '')

	const [showAddModal, setShowAddModal] = useState(false)
	const [userId, setUserId] = useState('')
	const [debouncedUserId, setDebouncedUserId] = useState('')
	const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null)

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedUserId(userId), 600)
		return () => clearTimeout(timer)
	}, [userId])

	const {
		data: lookedUpUser,
		isFetching: lookingUp,
		error: lookupError,
	} = useLookupUser(debouncedUserId)

	const staff = staffData?.staff ?? []

	const handleAdd = async () => {
		if (!userId.trim()) {
			toast.error('Insere o ID do utilizador')
			return
		}
		if (!lookedUpUser) {
			toast.error('Verifica o ID do utilizador antes de adicionar')
			return
		}
		await addStaff.mutateAsync(userId.trim())
		setShowAddModal(false)
		setUserId('')
		setDebouncedUserId('')
	}

	const handleRemove = (targetUserId: string, name: string | null) => {
		setRemoveTarget({ id: targetUserId, name: name ?? 'este validador' })
	}

	const handleConfirmRemove = () => {
		if (!removeTarget) return
		removeStaff.mutate(removeTarget.id, {
			onSuccess: () => setRemoveTarget(null),
		})
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading font-700 text-2xl">Validadores</h1>
					<p className="text-text-secondary text-sm">
						{eventData?.event?.title ?? 'Carregando...'}
					</p>
				</div>
				<Button onClick={() => setShowAddModal(true)}>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<path d="M12 5v14M5 12h14" />
					</svg>
					Adicionar Validador
				</Button>
			</div>

			{isLoading ? (
				<Card className="overflow-hidden !p-0">
					<div className="p-5">
						<SkeletonTable rows={4} cols={4} />
					</div>
				</Card>
			) : staff.length === 0 ? (
				<Card className="text-center py-12">
					<p className="text-text-secondary mb-2">Nenhum validador adicionado</p>
					<p className="text-xs text-text-secondary">
						Adiciona utilizadores para validar bilhetes neste evento
					</p>
				</Card>
			) : (
				<Card className="overflow-hidden !p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-gray-50">
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Nome
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Email
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Adicionado por
									</th>
									<th className="text-left px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Data
									</th>
									<th className="text-right px-4 py-3 font-heading font-600 text-xs uppercase tracking-wider text-text-secondary">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{staff.map((member) => (
									<tr
										key={member.id}
										className="border-b border-border last:border-0 hover:bg-gray-50/50"
									>
										<td className="px-4 py-3 font-heading font-600">
											<div className="flex items-center gap-2">
												{member.image && (
													<img
														src={member.image}
														alt=""
														className="w-7 h-7 rounded-full object-cover"
													/>
												)}
												<span>{member.name ?? '—'}</span>
											</div>
										</td>
										<td className="px-4 py-3 text-text-secondary">
											{member.email}
										</td>
										<td className="px-4 py-3 text-text-secondary">
											{member.addedByName ?? '—'}
										</td>
										<td className="px-4 py-3 text-text-secondary text-xs">
											{formatDate(member.addedAt)}
										</td>
										<td className="px-4 py-3 text-right">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleRemove(member.userId, member.name)
												}
												className="text-red-500 hover:text-red-700"
											>
												Remover
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			)}

			<Modal
				open={showAddModal}
				onClose={() => {
					setShowAddModal(false)
					setUserId('')
					setDebouncedUserId('')
				}}
				title="Adicionar Validador"
			>
				<div className="space-y-4">
					<p className="text-sm text-text-secondary">
						Insere o ID do utilizador que desejas adicionar como validador de bilhetes.
					</p>
					<div className="text-xs text-text-secondary bg-amber-50 border border-amber-200 rounded-lg p-3">
						O ID do utilizador pode ser encontrado na página de{' '}
						<strong>Perfil</strong> ou <strong>Segurança</strong> da conta do
						utilizador.
					</div>
					<Input
						label="ID do Utilizador"
						placeholder="Ex: 01ARZ3NDEKTSV4RRFFQ69G5FAV"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					/>

					{/* Lookup result */}
					{lookingUp && (
						<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
							<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
							<div className="space-y-1.5 flex-1">
								<div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
								<div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
							</div>
						</div>
					)}
					{lookedUpUser && !lookingUp && (
						<div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
							<img
								src={lookedUpUser.image || '/user.png'}
								alt=""
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-heading font-600 text-sm text-warm-text">
									{lookedUpUser.name || 'Sem nome'}
								</p>
								<p className="text-xs text-text-secondary truncate">
									{lookedUpUser.email}
								</p>
							</div>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#065f46"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="shrink-0"
							>
								<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
					)}
					{lookupError && !lookingUp && debouncedUserId.length >= 8 && (
						<p className="text-xs text-red-500">
							Utilizador não encontrado. Verifica o ID e tenta novamente.
						</p>
					)}

					<div className="flex gap-3">
						<Button
							onClick={handleAdd}
							loading={addStaff.isPending}
							disabled={!lookedUpUser}
						>
							Adicionar
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								setShowAddModal(false)
								setUserId('')
								setDebouncedUserId('')
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				open={!!removeTarget}
				onClose={() => setRemoveTarget(null)}
				title="Remover Validador"
			>
				<div className="space-y-4">
					<p className="text-sm text-text-secondary">
						Tens a certeza que desejas remover{' '}
						<strong>{removeTarget?.name}</strong> como validador?
					</p>
					<div className="flex gap-3">
						<Button variant="ghost" onClick={() => setRemoveTarget(null)}>
							Cancelar
						</Button>
						<Button
							onClick={handleConfirmRemove}
							loading={removeStaff.isPending}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							Remover
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
