import { useRef, useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import {
	useUserProfile,
	useLinkGoogle,
	useResendVerification,
	useUnlinkGoogle,
} from '../../api/hooks/useAccount'
import { useCloudinaryUpload } from '../../api/hooks/useCloudinaryUpload'
import { useGoogleLogin } from '@react-oauth/google'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { Badge } from '../../components/ui/Badge'
import { toast } from 'react-hot-toast'

export function ProfilePage() {
	const user = useAuthStore((s) => s.user)
	const updateProfile = useUserProfile()
	const linkGoogle = useLinkGoogle()
	const unlinkGoogle = useUnlinkGoogle()
	const resendVerification = useResendVerification()
	const cloudinary = useCloudinaryUpload()

	const fileInputRef = useRef<HTMLInputElement>(null)

	const [editing, setEditing] = useState(false)
	const [name, setName] = useState(user?.name ?? '')
	const [phone, setPhone] = useState(user?.phoneNumber ?? '')

	const hasPassword = user?.hasPassword ?? false
	const hasGoogle = user?.accounts?.some((a) => a.providerId === 'google') ?? false

	const handleSaveProfile = async () => {
		await updateProfile.mutateAsync({ name, phoneNumber: phone })
		setEditing(false)
	}

	const handleGoogleLink = useGoogleLogin({
		flow: 'implicit',
		onSuccess: (tokenResponse) => {
			if (tokenResponse.access_token) {
				linkGoogle.mutate({ idToken: tokenResponse.access_token })
			}
		},
		onError: () => toast.error('Erro ao vincular conta Google'),
	})

	const handleUnlinkGoogle = () => {
		if (!hasPassword) {
			toast.error('Defina uma palavra-passe antes de desvincular a conta Google.')
			return
		}
		if (!window.confirm('Tens a certeza que desejas desvincular a conta Google?')) return
		unlinkGoogle.mutate()
	}

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Seleciona uma imagem válida')
			return
		}

		try {
			const result = await cloudinary.upload(file, 'avatars')
			await updateProfile.mutateAsync({ image: result.url })
		} catch {
			toast.error('Erro ao atualizar avatar')
		}
	}

	if (!user) return null

	return (
		<div className="max-w-3xl mx-auto space-y-8">
			<div className="stagger-1">
				<h1 className="font-display-alt font-700 text-3xl text-warm-text">Perfil</h1>
				<p className="text-text-secondary text-sm">As tuas informações pessoais</p>
			</div>

			{/* Profile Info */}
			<div className="card-account stagger-2">
				<div className="p-6 sm:p-8">
					<div className="flex items-start gap-5 mb-6">
						<div className="relative shrink-0">
							<img
								src={user.image || '/user.png'}
								alt={user.name ?? 'Avatar'}
								className="w-16 h-16 rounded-full object-cover shadow-lg"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={cloudinary.uploading}
								className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-md hover:bg-brand-dark transition-colors disabled:opacity-50"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
									<circle cx="12" cy="13" r="4" />
								</svg>
							</button>
							{cloudinary.uploading && (
								<div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAvatarChange}
							/>
						</div>
						<div className="flex-1">
							{editing ? (
								<div className="space-y-4">
									<Input
										label="Nome"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
									<Input
										label="Telefone"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder="+244 XXX XXX XXX"
									/>
									<div className="flex gap-3">
										<Button
											onClick={handleSaveProfile}
											loading={updateProfile.isPending}
										>
											Guardar
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												setEditing(false)
												setName(user.name ?? '')
												setPhone(user.phoneNumber ?? '')
											}}
										>
											Cancelar
										</Button>
									</div>
								</div>
							) : (
								<>
									<div className="flex items-start justify-between">
										<div>
											<h2 className="font-heading font-700 text-xl text-warm-text">
												{user.name || 'Sem nome'}
											</h2>
											<p className="text-text-secondary text-sm">
												{user.email}
											</p>
											{user.phoneNumber && (
												<p className="text-text-secondary text-sm mt-1">
													{user.phoneNumber}
												</p>
											)}
										</div>
										<button
											onClick={() => setEditing(true)}
											className="text-sm font-heading font-600 text-brand hover:text-brand-dark transition-colors shrink-0"
										>
											Editar
										</button>
									</div>
									<div className="mt-4 pt-4 border-t border-warm-border">
										<div className="grid sm:grid-cols-3 gap-4 text-sm">
											<div>
												<span className="text-text-secondary">
													Membro desde
												</span>
												<p className="font-heading font-600 text-warm-text">
													{user.createdAt
														? formatDate(user.createdAt)
														: '—'}
												</p>
											</div>
											<div>
												<span className="text-text-secondary">
													Tipo de conta
												</span>
												<p className="font-heading font-600 text-warm-text">
													{user.role === 'USER'
														? 'Comprador'
														: user.role === 'PROMOTER'
															? 'Promotor'
															: user.role === 'ADMIN'
																? 'Administrador'
																: user.role === 'STAFF'
																	? 'Staff'
																	: '—'}
												</p>
											</div>
											<div>
												<span className="text-text-secondary">
													ID de Utilizador
												</span>
												<div className="flex items-center gap-2 mt-1">
													<p className="font-heading font-600 text-warm-text text-xs font-mono break-all">
														{user.id}
													</p>
													<button
														type="button"
														onClick={() => {
															navigator.clipboard.writeText(user.id)
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
															<rect
																x="9"
																y="9"
																width="13"
																height="13"
																rx="2"
																ry="2"
															/>
															<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
														</svg>
													</button>
												</div>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Email Verification */}
			<div className="card-account stagger-3">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">Email</h3>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-warm-text">{user.email}</p>
							<div className="flex items-center gap-2 mt-1">
								<span
									className={`status-dot ${user.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}
								/>
								<span className="text-xs text-text-secondary">
									{user.emailVerified
										? 'Email verificado'
										: 'Email não verificado'}
								</span>
							</div>
						</div>
						{!user.emailVerified && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => resendVerification.mutate(user.email)}
								loading={resendVerification.isPending}
							>
								Reenviar Verificação
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Linked Accounts */}
			<div className="card-account stagger-3">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Contas Vinculadas
					</h3>
					<div className="space-y-4">
						{/* Email / Password */}
						<div className="flex items-center justify-between p-4 rounded-xl bg-warm-bg border border-warm-border">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
									<svg
										width="20"
										height="20"
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
										Email e Palavra-passe
									</p>
									<p className="text-xs text-text-secondary">
										{hasPassword
											? 'Conta com palavra-passe'
											: 'Sem palavra-passe definida'}
									</p>
								</div>
							</div>
							{hasPassword && <Badge variant="emerald">Vinculada</Badge>}
						</div>

						{/* Google */}
						<div className="flex items-center justify-between p-4 rounded-xl bg-warm-bg border border-warm-border">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								</div>
								<div>
									<p className="text-sm font-heading font-600 text-warm-text">
										Google
									</p>
									<p className="text-xs text-text-secondary">
										{hasGoogle ? 'Conta vinculada' : 'Não vinculada'}
									</p>
								</div>
							</div>
							{!hasGoogle && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleGoogleLink()}
									loading={linkGoogle.isPending}
								>
									Vincular
								</Button>
							)}
							{hasGoogle && (
								<div className="flex items-center gap-2">
									<Badge variant="emerald">Vinculada</Badge>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleUnlinkGoogle}
										loading={unlinkGoogle.isPending}
										className="text-red-500 hover:text-red-700"
									>
										Desvincular
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
