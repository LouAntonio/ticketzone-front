import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	useOrganizerEventStaff,
	useAddOrganizerStaff,
	useRemoveOrganizerStaff,
	useOrganizerEvent,
} from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton'
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

	const staff = staffData?.staff ?? []

	const handleAdd = async () => {
		if (!userId.trim()) {
			toast.error('Insere o ID do utilizador')
			return
		}
		await addStaff.mutateAsync(userId.trim())
		setShowAddModal(false)
		setUserId('')
	}

	const handleRemove = (targetUserId: string, name: string | null) => {
		if (!window.confirm(`Tens a certeza que desejas remover "${name ?? 'este validador'}"?`))
			return
		removeStaff.mutate(targetUserId)
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
												loading={removeStaff.isPending}
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
				}}
				title="Adicionar Validador"
			>
				<div className="space-y-4">
					<p className="text-sm text-text-secondary">
						Insere o ID do utilizador que desejas adicionar como validador de bilhetes.
					</p>
					<Input
						label="ID do Utilizador"
						placeholder="Ex: 01ARZ3NDEKTSV4RRFFQ69G5FAV"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					/>
					<div className="flex gap-3">
						<Button onClick={handleAdd} loading={addStaff.isPending}>
							Adicionar
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								setShowAddModal(false)
								setUserId('')
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
