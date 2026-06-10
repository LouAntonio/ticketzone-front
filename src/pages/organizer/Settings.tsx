import { useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useOrganizerSettings, useUpdateOrganizerSettings } from '../../api/hooks/useOrganizer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Skeleton, SkeletonText } from '../../components/ui/Skeleton'
import { formatKwanza } from '../../lib/format'

export function OrgSettings() {
	const user = useAuthStore((s) => s.user)
	const { data: settings, isLoading } = useOrganizerSettings()
	const updateSettings = useUpdateOrganizerSettings()

	const [editing, setEditing] = useState(false)
	const [initialized, setInitialized] = useState(false)
	const [companyName, setCompanyName] = useState('')
	const [iban, setIban] = useState('')

	if (settings && !initialized) {
		setInitialized(true)
		setCompanyName(settings.companyName ?? '')
		setIban(settings.iban ?? '')
	}

	const handleSave = async () => {
		await updateSettings.mutateAsync({
			companyName: companyName || undefined,
			iban: iban || undefined,
		})
		setEditing(false)
	}

	if (isLoading) {
		return (
			<div className="max-w-2xl space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Card>
					<div className="p-5 space-y-4">
						<Skeleton className="h-5 w-32" />
						<div className="flex items-center gap-3">
							<Skeleton className="w-10 h-10 rounded-full" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-40" />
							</div>
						</div>
					</div>
				</Card>
				<Card>
					<div className="p-5 space-y-4">
						<Skeleton className="h-5 w-40" />
						<SkeletonText lines={3} />
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="font-heading font-700 text-2xl">Definições</h1>
				<p className="text-text-secondary text-sm">Configurações da conta de promotor</p>
			</div>

			<Card>
				<div className="p-5">
					<h3 className="font-heading font-600 text-base mb-4">Perfil</h3>
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
						<img
							src={user?.image || '/user.png'}
							alt={user?.name ?? 'Avatar'}
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div>
							<p className="text-sm font-heading font-600">{user?.name}</p>
							<p className="text-xs text-text-secondary">{user?.email}</p>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<div className="p-5">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading font-600 text-base">Informação da Empresa</h3>
						{!editing && (
							<button
								onClick={() => setEditing(true)}
								className="text-sm font-heading font-600 text-brand hover:text-brand-dark transition-colors"
							>
								Editar
							</button>
						)}
					</div>

					{editing ? (
						<div className="space-y-4">
							<Input
								label="Nome da Empresa"
								placeholder="A tua empresa"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
							/>
							<Input
								label="IBAN"
								placeholder="AO06012345678901234567890"
								value={iban}
								onChange={(e) => setIban(e.target.value)}
							/>
							<div className="flex gap-3">
								<Button onClick={handleSave} loading={updateSettings.isPending}>
									Guardar
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										setEditing(false)
										if (settings) {
											setCompanyName(settings.companyName ?? '')
											setIban(settings.iban ?? '')
										}
									}}
								>
									Cancelar
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<div>
								<span className="text-xs text-text-secondary">Empresa</span>
								<p className="text-sm font-heading font-600">
									{settings?.companyName || '—'}
								</p>
							</div>
							<div>
								<span className="text-xs text-text-secondary">IBAN</span>
								<p className="text-sm font-heading font-600">
									{settings?.iban || '—'}
								</p>
							</div>
						</div>
					)}
				</div>
			</Card>

			<Card>
				<div className="p-5">
					<h3 className="font-heading font-600 text-base mb-2">Saldo Atual</h3>
					<p className="font-heading font-700 text-3xl text-emerald-600">
						{formatKwanza(settings?.balance ?? 0)}
					</p>
					<p className="text-xs text-text-secondary mt-1">Valor disponível para saque</p>
				</div>
			</Card>
		</div>
	)
}
