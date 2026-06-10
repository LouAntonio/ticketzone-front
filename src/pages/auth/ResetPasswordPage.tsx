import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { authApi } from '../../api/endpoints/auth'
import type { AxiosError } from 'axios'

const DIAMOND_BG =
	"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

export function ResetPasswordPage() {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')
	const navigate = useNavigate()

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!token) {
			toast.error('Token de recuperação inválido')
			return
		}

		if (password !== confirmPassword) {
			toast.error('As senhas não coincidem')
			return
		}

		if (password.length < 8) {
			toast.error('A senha deve ter no mínimo 8 caracteres')
			return
		}

		setLoading(true)
		try {
			await authApi.resetPassword({ token, password })
			toast.success('Senha redefinida com sucesso!', { duration: 5000 })
			navigate('/login')
		} catch (err) {
			const axiosErr = err as AxiosError<{ msg?: string }>
			const msg =
				axiosErr?.response?.data?.msg ?? axiosErr?.message ?? 'Erro ao redefinir senha'
			toast.error(msg)
		} finally {
			setLoading(false)
		}
	}

	const brandPanel = (
		<div className="hidden lg:flex flex-col justify-between p-12 bg-brand relative overflow-hidden">
			<div className="absolute inset-0 opacity-10" style={{ backgroundImage: DIAMOND_BG }} />
			<div className="relative z-10">
				<Link to="/" className="flex items-center gap-3">
					<img src="/logoWhite.png" alt="TicketZone" className="h-9 w-auto" />
				</Link>
			</div>
			<div className="relative z-10">
				<h1 className="font-display text-5xl leading-tight text-white mb-4">
					O teu bilhete
					<br />
					para o melhor
					<br />
					de Angola.
				</h1>
			</div>
			<div className="relative z-10 flex items-center gap-6 text-white/50 text-sm" />
		</div>
	)

	const mobileLogo = (
		<Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
			<img src="/logoWhite.png" alt="TicketZone" className="h-9 w-auto" />
		</Link>
	)

	if (!token) {
		return (
			<div
				className="min-h-screen grid lg:grid-cols-2"
				style={{
					background: 'linear-gradient(135deg, #FFF0E8 0%, #FFFFFF 50%, #FFF0E8 100%)',
				}}
			>
				{brandPanel}
				<div className="flex items-center justify-center p-8">
					<div className="w-full max-w-sm text-center">
						{mobileLogo}
						<h2 className="font-heading font-700 text-2xl mb-2">Link Inválido</h2>
						<p className="text-text-secondary text-sm mb-6">
							O link de recuperação é inválido ou expirou.
						</p>
						<Link
							to="/forgot-password"
							className="text-brand font-heading font-600 hover:underline text-sm"
						>
							Solicitar novo link
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className="min-h-screen grid lg:grid-cols-2"
			style={{ background: 'linear-gradient(135deg, #FFF0E8 0%, #FFFFFF 50%, #FFF0E8 100%)' }}
		>
			{brandPanel}
			<div className="flex items-center justify-center p-8">
				<div className="w-full max-w-sm">
					{mobileLogo}
					<h2 className="font-heading font-700 text-2xl mb-1">Redefinir Senha</h2>
					<p className="text-text-secondary text-sm mb-8">
						Escolhe uma nova senha para a tua conta.
					</p>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<PasswordInput
							label="Nova senha"
							placeholder="Mínimo 8 caracteres"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
						/>
						<PasswordInput
							label="Confirmar nova senha"
							placeholder="Repete a senha"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<Button type="submit" loading={loading} className="w-full mt-2">
							Redefinir senha
						</Button>
					</form>
					<p className="mt-8 text-center text-sm text-text-secondary">
						<Link
							to="/login"
							className="text-brand font-heading font-600 hover:underline"
						>
							Voltar ao login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
