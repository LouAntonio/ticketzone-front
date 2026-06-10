import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authApi } from '../../api/endpoints/auth'
import type { AxiosError } from 'axios'

const DIAMOND_BG =
	"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

export function VerifyEmailPage() {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')
	const navigate = useNavigate()

	const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>(
		token ? 'loading' : 'idle',
	)
	const [resendEmail, setResendEmail] = useState('')
	const [resending, setResending] = useState(false)

	useEffect(() => {
		if (token) {
			authApi
				.verifyEmail({ token })
				.then(() => {
					setStatus('success')
				})
				.catch(() => {
					setStatus('error')
				})
		}
	}, [token])

	const handleResend = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!resendEmail) return
		setResending(true)
		try {
			await authApi.resendVerification({ email: resendEmail })
			toast.success('Se o email existir, um novo link de verificação foi enviado.', {
				duration: 6000,
			})
		} catch (err) {
			const axiosErr = err as AxiosError<{ msg?: string }>
			const msg =
				axiosErr?.response?.data?.msg ?? axiosErr?.message ?? 'Erro ao reenviar verificação'
			toast.error(msg)
		} finally {
			setResending(false)
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

	const renderContent = () => {
		if (!token) {
			return (
				<div className="w-full max-w-sm text-center">
					{mobileLogo}
					<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#dc2626"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="15" y1="9" x2="9" y2="15" />
							<line x1="9" y1="9" x2="15" y2="15" />
						</svg>
					</div>
					<h2 className="font-heading font-700 text-2xl mb-2">Link Inválido</h2>
					<p className="text-text-secondary text-sm mb-6">
						O link de verificação é inválido ou expirou.
					</p>
					<Link
						to="/login"
						className="text-brand font-heading font-600 hover:underline text-sm"
					>
						Ir para o login
					</Link>
				</div>
			)
		}

		if (status === 'loading') {
			return (
				<div className="w-full max-w-sm text-center">
					{mobileLogo}
					<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-soft border border-brand/20 flex items-center justify-center">
						<svg
							className="animate-spin h-7 w-7 text-brand"
							viewBox="0 0 24 24"
							fill="none"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
					</div>
					<h2 className="font-heading font-700 text-2xl mb-2">A verificar...</h2>
					<p className="text-text-secondary text-sm">
						A confirmar o teu endereço de email.
					</p>
				</div>
			)
		}

		if (status === 'success') {
			return (
				<div className="w-full max-w-sm text-center">
					{mobileLogo}
					<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#16a34a"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</div>
					<h2 className="font-heading font-700 text-2xl mb-2">Email Verificado!</h2>
					<p className="text-text-secondary text-sm mb-8">
						O teu email foi verificado com sucesso. Já podes aceder à tua conta.
					</p>
					<Button onClick={() => navigate('/login')} className="w-full">
						Ir para o login
					</Button>
				</div>
			)
		}

		if (status === 'error') {
			return (
				<div className="w-full max-w-sm text-center">
					{mobileLogo}
					<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#dc2626"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="15" y1="9" x2="9" y2="15" />
							<line x1="9" y1="9" x2="15" y2="15" />
						</svg>
					</div>
					<h2 className="font-heading font-700 text-2xl mb-2">
						Link Inválido ou Expirado
					</h2>
					<p className="text-text-secondary text-sm mb-6">
						O link de verificação que usaste é inválido ou já expirou.
					</p>
					<form onSubmit={handleResend} className="flex flex-col gap-4 text-left">
						<p className="text-text-secondary text-sm text-center">
							Insere o teu email para reenviar o link de verificação:
						</p>
						<Input
							label="Email"
							type="email"
							placeholder="teu@email.com"
							value={resendEmail}
							onChange={(e) => setResendEmail(e.target.value)}
							required
						/>
						<Button type="submit" loading={resending} className="w-full">
							Reenviar verificação
						</Button>
					</form>
					<p className="mt-6 text-center text-sm text-text-secondary">
						<Link
							to="/login"
							className="text-brand font-heading font-600 hover:underline"
						>
							Voltar ao login
						</Link>
					</p>
				</div>
			)
		}

		return null
	}

	return (
		<div
			className="min-h-screen grid lg:grid-cols-2"
			style={{ background: 'linear-gradient(135deg, #FFF0E8 0%, #FFFFFF 50%, #FFF0E8 100%)' }}
		>
			{brandPanel}
			<div className="flex items-center justify-center p-8">{renderContent()}</div>
		</div>
	)
}
