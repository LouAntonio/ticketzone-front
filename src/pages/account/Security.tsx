import { useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useLinkPassword, useResendVerification } from '../../api/hooks/useAccount'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { toast } from 'react-hot-toast'

export function SecurityPage() {
	const user = useAuthStore((s) => s.user)
	const linkPassword = useLinkPassword()
	const resendVerification = useResendVerification()

	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const hasPassword = user?.accounts?.some((a) => a.providerId === 'password') ?? true

	const handleSetPassword = async () => {
		if (newPassword !== confirmPassword) {
			toast.error('As palavras-passe não coincidem')
			return
		}
		if (newPassword.length < 8) {
			toast.error('A palavra-passe deve ter no mínimo 8 caracteres')
			return
		}
		await linkPassword.mutateAsync({ password: newPassword })
		setShowPasswordForm(false)
		setNewPassword('')
		setConfirmPassword('')
		toast.success('Palavra-passe definida com sucesso')
	}

	const handleResendVerification = async () => {
		if (user?.email) {
			resendVerification.mutate(user.email)
		}
	}

	return (
		<div className="max-w-3xl mx-auto space-y-8">
			<div className="stagger-1">
				<h1 className="font-display-alt font-700 text-3xl text-warm-text">Segurança</h1>
				<p className="text-text-secondary text-sm">Gerir palavra-passe e verificação</p>
			</div>

			{/* Email Verification */}
			<div className="card-account stagger-2">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Verificação de Email
					</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`w-12 h-12 rounded-xl flex items-center justify-center ${
									user?.emailVerified
										? 'bg-emerald-50 text-emerald-600'
										: 'bg-amber-50 text-amber-600'
								}`}
							>
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									{user?.emailVerified ? (
										<>
											<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
											<polyline points="22 4 12 14.01 9 11.01" />
										</>
									) : (
										<>
											<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
											<polyline points="22 4 12 14.01 9 11.01" />
										</>
									)}
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{user?.email}
								</p>
								<p className="text-xs text-text-secondary">
									{user?.emailVerified
										? 'Email verificado'
										: 'Email não verificado — verifica a tua caixa de entrada'}
								</p>
							</div>
						</div>
						{!user?.emailVerified && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleResendVerification}
								loading={resendVerification.isPending}
							>
								Reenviar
							</Button>
						)}
						{user?.emailVerified && (
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#065f46"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						)}
					</div>
				</div>
			</div>

			{/* Password */}
			<div className="card-account stagger-3">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Palavra-passe
					</h3>
					<div className="flex items-center justify-between p-4 rounded-xl bg-warm-bg border border-warm-border">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-brand"
								>
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0110 0v4" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{hasPassword ? 'Palavra-passe definida' : 'Sem palavra-passe'}
								</p>
								<p className="text-xs text-text-secondary">
									{hasPassword
										? 'Usada para iniciar sessão com email'
										: 'Define uma palavra-passe para a tua conta'}
								</p>
							</div>
						</div>
						{!hasPassword && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowPasswordForm(!showPasswordForm)}
							>
								Definir
							</Button>
						)}
						{hasPassword && <Badge variant="emerald">Ativa</Badge>}
					</div>
					{showPasswordForm && (
						<div className="mt-4 p-4 rounded-xl bg-brand-soft border border-brand/20 slide-up">
							<h4 className="font-heading font-600 text-sm text-warm-text mb-3">
								Nova Palavra-passe
							</h4>
							<div className="space-y-3 max-w-sm">
								<Input
									type="password"
									placeholder="Nova palavra-passe (min. 8 caracteres)"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="Confirmar palavra-passe"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<div className="flex gap-3">
									<Button
										onClick={handleSetPassword}
										loading={linkPassword.isPending}
										size="sm"
									>
										Guardar
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setShowPasswordForm(false)
											setNewPassword('')
											setConfirmPassword('')
										}}
									>
										Cancelar
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Account Info */}
			<div className="card-account stagger-4">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Informação da Conta
					</h3>
					<div className="grid sm:grid-cols-2 gap-4 text-sm">
						<div className="p-4 rounded-xl bg-warm-bg border border-warm-border">
							<span className="text-text-secondary">Membro desde</span>
							<p className="font-heading font-600 text-warm-text mt-1">
								{user?.createdAt ? formatDate(user.createdAt) : '—'}
							</p>
						</div>
						<div className="p-4 rounded-xl bg-warm-bg border border-warm-border">
							<span className="text-text-secondary">Tipo de conta</span>
							<p className="font-heading font-600 text-warm-text mt-1 capitalize">
								{user?.role?.toLowerCase() === 'user'
									? 'Comprador'
									: user?.role?.toLowerCase() === 'promoter'
										? 'Promotor'
										: user?.role?.toLowerCase() === 'admin'
											? 'Administrador'
											: user?.role?.toLowerCase() === 'staff'
												? 'Staff'
												: '—'}
							</p>
						</div>
						<div className="p-4 rounded-xl bg-warm-bg border border-warm-border">
							<span className="text-text-secondary">Email verificado</span>
							<p className="font-heading font-600 text-warm-text mt-1">
								{user?.emailVerified ? 'Sim' : 'Não'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
