import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authApi } from '../../api/endpoints/auth'
import type { AxiosError } from 'axios'

export function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const setSession = useAuthStore((s) => s.setSession)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const res = await authApi.login({ email, password })
			setSession(res.token, res.user, res.organizerProfile)
			navigate('/')
		} catch (err) {
			const axiosErr = err as AxiosError<{ error: string }>
			setError(axiosErr?.response?.data?.error ?? 'Erro ao fazer login')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="min-h-screen grid lg:grid-cols-2"
			style={{
				background: 'linear-gradient(135deg, #FFF0E8 0%, #FFFFFF 50%, #FFF0E8 100%)',
			}}
		>
			{/* Left panel — branding */}
			<div className="hidden lg:flex flex-col justify-between p-12 bg-brand relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
					}}
				/>
				<div className="relative z-10">
					<Link to="/" className="flex items-center gap-3">
						<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
							<span className="font-display text-3xl text-brand leading-none">T</span>
						</div>
						<span className="font-display text-3xl tracking-wide text-white">
							TicketZone
						</span>
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
					<p className="text-white/70 text-lg max-w-md">
						Compra e vende bilhetes com segurança. Multicaixa Express, PayPay e
						referências multicaixa.
					</p>
				</div>
				<div className="relative z-10 flex items-center gap-6 text-white/50 text-sm">
					<span>Multicaixa Express</span>
					<span>PayPay</span>
					<span>Referências</span>
				</div>
			</div>

			{/* Right panel — form */}
			<div className="flex items-center justify-center p-8">
				<div className="w-full max-w-sm">
					{/* Mobile logo */}
					<Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
						<div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
							<span className="text-white font-display text-lg leading-none">T</span>
						</div>
						<span className="font-display text-2xl tracking-wide text-text">
							TicketZone
						</span>
					</Link>

					<h2 className="font-heading font-700 text-2xl mb-1">Entrar</h2>
					<p className="text-text-secondary text-sm mb-8">
						Acede à tua conta para comprar bilhetes
					</p>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Input
							label="Email"
							type="email"
							placeholder="teu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<Input
							label="Senha"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<Button type="submit" loading={loading} className="w-full mt-2">
							Entrar
						</Button>
					</form>

					{/* Google OAuth */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-white px-3 text-text-secondary">ou</span>
						</div>
					</div>

					<button className="w-full flex items-center justify-center gap-3 h-11 border-2 border-border rounded-xl text-sm font-heading font-600 hover:bg-gray-50 transition-colors">
						<svg width="20" height="20" viewBox="0 0 24 24">
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
						Continuar com Google
					</button>

					<p className="mt-8 text-center text-sm text-text-secondary">
						Ainda não tens conta?{' '}
						<Link
							to="/register"
							className="text-brand font-heading font-600 hover:underline"
						>
							Criar conta
						</Link>
					</p>

					{/* Demo hint */}
					<div className="mt-6 p-3 bg-brand-soft/50 border border-brand/20 rounded-xl text-xs text-text-secondary">
						<p className="font-heading font-600 text-brand mb-1">Demo:</p>
						<p>Email: ana@email.com — Senha: qualquer</p>
						<p>Email: carlos@email.com — Organizador</p>
					</div>
				</div>
			</div>
		</div>
	)
}
