import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../stores/useAuthStore'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../api/client'

export function OrgSettings() {
	const { organizerProfile, user } = useAuthStore()

	const [form, setForm] = useState({
		companyName: organizerProfile?.companyName ?? '',
		bankName: organizerProfile?.bankName ?? '',
		bankAccount: organizerProfile?.bankAccount ?? '',
		bankHolder: organizerProfile?.bankHolder ?? user?.name ?? '',
	})
	const [saving, setSaving] = useState(false)

	const updateField = (key: string, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		try {
			await api.put('/api/organizer/settings', form)
			toast.success('Definições guardadas com sucesso')
		} catch (err) {
			toast.error('Erro ao guardar definições')
			console.error(err)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="font-heading font-700 text-2xl">Definições</h1>
				<p className="text-text-secondary text-sm">Configurações da conta de promotor</p>
			</div>

			<Card>
				<h3 className="font-heading font-600 text-base mb-4">Perfil</h3>
				<div className="flex flex-col gap-4">
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

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Informação da Empresa</h3>
					<div className="flex flex-col gap-4">
						<Input
							label="Nome da Empresa"
							placeholder="A tua empresa"
							value={form.companyName}
							onChange={(e) => updateField('companyName', e.target.value)}
						/>
					</div>
				</Card>

				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Dados Bancários</h3>
					<p className="text-xs text-text-secondary mb-4">
						Os pagamentos das vendas serão transferidos para esta conta.
					</p>
					<div className="flex flex-col gap-4">
						<Input
							label="Nome do Banco"
							placeholder="Ex: Banco Angolano de Investimentos"
							value={form.bankName}
							onChange={(e) => updateField('bankName', e.target.value)}
							required
						/>
						<Input
							label="Número da Conta"
							placeholder="Ex: 123456789"
							value={form.bankAccount}
							onChange={(e) => updateField('bankAccount', e.target.value)}
							required
						/>
						<Input
							label="Titular da Conta"
							placeholder="Nome do titular"
							value={form.bankHolder}
							onChange={(e) => updateField('bankHolder', e.target.value)}
							required
						/>
					</div>
				</Card>

				<Button type="submit" loading={saving}>
					Guardar Definições
				</Button>
			</form>

			{/* Current balance */}
			<Card>
				<h3 className="font-heading font-600 text-base mb-2">Saldo Atual</h3>
				<p className="font-heading font-700 text-3xl text-emerald-600">
					{new Intl.NumberFormat('pt-AO', {
						style: 'currency',
						currency: 'AOA',
						minimumFractionDigits: 0,
					}).format(organizerProfile?.balance ?? 0)}
				</p>
				<p className="text-xs text-text-secondary mt-1">Valor disponível para saque</p>
			</Card>
		</div>
	)
}
