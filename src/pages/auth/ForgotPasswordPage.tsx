import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authApi } from '../../api/endpoints/auth'
import type { AxiosError } from 'axios'

export function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			await authApi.forgotPassword({ email })
			setSent(true)
			toast.success('Se o email existir, receberás um link de recuperação.', {
				duration: 6000,
			})
		} catch (err) {
			const axiosErr = err as AxiosError<{ msg?: string }>
			const msg =
				axiosErr?.response?.data?.msg ??
				axiosErr?.message ??
				'Erro ao enviar email de recuperação'
			toast.error(msg)
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
				</div>
				<div className="relative z-10 flex items-center gap-6 text-white/50 text-sm" />
			</div>

			<div className="flex items-center justify-center p-8">
				<div className="w-full max-w-sm">
					<Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
						<div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
							<span className="text-white font-display text-lg leading-none">T</span>
						</div>
						<span className="font-display text-2xl tracking-wide text-text">
							TicketZone
						</span>
					</Link>

					<h2 className="font-heading font-700 text-2xl mb-1">Recuperar Senha</h2>
					<p className="text-text-secondary text-sm mb-8">
						{sent
							? 'Verifica a tua caixa de email. Se a conta existir, receberás um link para redefinir a senha.'
							: 'Insere o teu email e enviaremos um link para redefinir a senha.'}
					</p>

					{!sent ? (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<Input
								label="Email"
								type="email"
								placeholder="teu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Button type="submit" loading={loading} className="w-full mt-2">
								Enviar link
							</Button>
						</form>
					) : (
						<div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">
							Link de recuperação enviado para <strong>{email}</strong>
						</div>
					)}

					<p className="mt-8 text-center text-sm text-text-secondary">
						<Link to="/login" className="text-brand font-heading font-600 hover:underline">
							Voltar ao login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
