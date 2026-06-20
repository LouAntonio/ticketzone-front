import { useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import {
	useLinkPassword,
	useResendVerification,
	useChangePassword,
	useChangeEmail,
	useUserProfile,
} from '../../api/hooks/useAccount'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { toast } from 'react-hot-toast'

export function SecurityPage() {
	const user = useAuthStore((s) => s.user)
	const setUser = useAuthStore((s) => s.setUser)
	const linkPassword = useLinkPassword()
	const resendVerification = useResendVerification()
	const changePassword = useChangePassword()
	const changeEmail = useChangeEmail()

	const [showPasswordForm, setShowPasswordForm] = useState(false)
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')
	const [changeNewPassword, setChangeNewPassword] = useState('')
	const [changeConfirmPassword, setChangeConfirmPassword] = useState('')

	const [showEmailForm, setShowEmailForm] = useState(false)
	const [newEmail, setNewEmail] = useState('')
	const [emailPassword, setEmailPassword] = useState('')

	const [showPhoneForm, setShowPhoneForm] = useState(false)
	const [phoneInput, setPhoneInput] = useState('')

	const updateProfile = useUserProfile()

	const hasPassword = user?.hasPassword ?? false

	const handleSavePhone = async () => {
		const num = phoneInput.trim()
		if (!num) {
			toast.error('Insere um número de telefone')
			return
		}
		try {
			await updateProfile.mutateAsync({ phoneNumber: num })
			setShowPhoneForm(false)
			setPhoneInput('')
			toast.success('Número de telefone atualizado')
		} catch {
			toast.error('Erro ao atualizar número')
		}
	}

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
		if (user) setUser({ ...user, hasPassword: true })
		toast.success('Palavra-passe definida com sucesso')
	}

	const handleChangePassword = async () => {
		if (changeNewPassword !== changeConfirmPassword) {
			toast.error('As palavras-passe não coincidem')
			return
		}
		if (changeNewPassword.length < 8) {
			toast.error('A nova palavra-passe deve ter no mínimo 8 caracteres')
			return
		}
		if (currentPassword === changeNewPassword) {
			toast.error('A nova palavra-passe deve ser diferente da atual')
			return
		}
		await changePassword.mutateAsync({
			currentPassword,
			newPassword: changeNewPassword,
		})
		setShowChangePasswordForm(false)
		setCurrentPassword('')
		setChangeNewPassword('')
		setChangeConfirmPassword('')
	}

	const handleChangeEmail = async () => {
		if (!newEmail.includes('@')) {
			toast.error('Insere um email válido')
			return
		}
		if (!emailPassword) {
			toast.error('Insere a tua palavra-passe para confirmar')
			return
		}
		await changeEmail.mutateAsync({ newEmail, password: emailPassword })
		setShowEmailForm(false)
		setNewEmail('')
		setEmailPassword('')
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
				<p className="text-text-secondary text-sm">
					Gerir palavra-passe, email e verificação
				</p>
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
									<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
									<polyline points="22 4 12 14.01 9 11.01" />
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
						{!user?.emailVerified ? (
							<Button
								variant="outline"
								size="sm"
								onClick={handleResendVerification}
								loading={resendVerification.isPending}
							>
								Reenviar
							</Button>
						) : (
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
						<div className="flex items-center gap-2">
							{hasPassword && (
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setShowChangePasswordForm(!showChangePasswordForm)
									}
								>
									Alterar
								</Button>
							)}
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
					</div>

					{/* Set password (for Google-only users) */}
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

					{/* Change password (for users with existing password) */}
					{showChangePasswordForm && (
						<div className="mt-4 p-4 rounded-xl bg-brand-soft border border-brand/20 slide-up">
							<h4 className="font-heading font-600 text-sm text-warm-text mb-3">
								Alterar Palavra-passe
							</h4>
							<div className="space-y-3 max-w-sm">
								<Input
									type="password"
									placeholder="Palavra-passe atual"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="Nova palavra-passe (min. 8 caracteres)"
									value={changeNewPassword}
									onChange={(e) => setChangeNewPassword(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="Confirmar nova palavra-passe"
									value={changeConfirmPassword}
									onChange={(e) => setChangeConfirmPassword(e.target.value)}
								/>
								<div className="flex gap-3">
									<Button
										onClick={handleChangePassword}
										loading={changePassword.isPending}
										size="sm"
									>
										Guardar
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setShowChangePasswordForm(false)
											setCurrentPassword('')
											setChangeNewPassword('')
											setChangeConfirmPassword('')
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

			{/* Change Email */}
			<div className="card-account stagger-4">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">Email</h3>
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
									<rect x="2" y="4" width="20" height="16" rx="2" />
									<path d="M22 7l-10 7L2 7" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{user?.email}
								</p>
								<p className="text-xs text-text-secondary">
									{user?.emailVerified
										? 'Email verificado'
										: 'Email não verificado'}
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowEmailForm(!showEmailForm)}
						>
							Alterar
						</Button>
					</div>

					{showEmailForm && (
						<div className="mt-4 p-4 rounded-xl bg-brand-soft border border-brand/20 slide-up">
							<h4 className="font-heading font-600 text-sm text-warm-text mb-3">
								Alterar Email
							</h4>
							<p className="text-xs text-text-secondary mb-3">
								Após alterar, receberás um link de verificação no novo email.
							</p>
							<div className="space-y-3 max-w-sm">
								<Input
									type="email"
									placeholder="Novo email"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
								/>
								{hasPassword && (
									<Input
										type="password"
										placeholder="Confirma com a tua palavra-passe"
										value={emailPassword}
										onChange={(e) => setEmailPassword(e.target.value)}
									/>
								)}
								<div className="flex gap-3">
									<Button
										onClick={handleChangeEmail}
										loading={changeEmail.isPending}
										size="sm"
									>
										Guardar
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setShowEmailForm(false)
											setNewEmail('')
											setEmailPassword('')
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

			{/* Phone Number */}
			<div className="card-account stagger-4">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Número de Telefone
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
									<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{user?.phoneNumber || '—'}
								</p>
								<p className="text-xs text-text-secondary">
									{user?.phoneNumber
										? 'Número registado'
										: 'Nenhum número registado'}
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setShowPhoneForm(!showPhoneForm)
								if (!showPhoneForm) setPhoneInput(user?.phoneNumber ?? '')
							}}
						>
							{user?.phoneNumber ? 'Alterar' : 'Adicionar'}
						</Button>
					</div>

					{showPhoneForm && (
						<div className="mt-4 p-4 rounded-xl bg-brand-soft border border-brand/20 slide-up">
							<h4 className="font-heading font-600 text-sm text-warm-text mb-3">
								{user?.phoneNumber ? 'Alterar' : 'Adicionar'} Número
							</h4>
							<div className="space-y-3 max-w-sm">
								<Input
									type="tel"
									placeholder="+244 923 456 789"
									value={phoneInput}
									onChange={(e) => setPhoneInput(e.target.value)}
								/>
								<div className="flex gap-3">
									<Button
										onClick={handleSavePhone}
										loading={updateProfile.isPending}
										size="sm"
									>
										Guardar
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setShowPhoneForm(false)
											setPhoneInput('')
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
						<div className="sm:col-span-2 p-4 rounded-xl bg-warm-bg border border-warm-border">
							<span className="text-text-secondary">ID de Utilizador</span>
							<div className="flex items-center gap-2 mt-1">
								<p className="font-heading font-600 text-warm-text text-xs font-mono break-all flex-1 min-w-0">
									{user?.id}
								</p>
								<button
									type="button"
									onClick={() => {
										navigator.clipboard.writeText(user!.id)
										toast.success('ID copiado')
									}}
									className="shrink-0 text-text-secondary hover:text-brand transition-colors"
									title="Copiar ID"
								>
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
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
