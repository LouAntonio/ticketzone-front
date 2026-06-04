import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authApi } from '../../api/endpoints/auth'
import type { RegisterData } from '../../types/auth'

export function RegisterPage() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState<'buyer' | 'organizer'>('buyer')
	const [companyName, setCompanyName] = useState('')
	const [document, setDocument] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const setSession = useAuthStore((s) => s.setSession)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const regData: RegisterData = { name, email, password, phone, role }
			if (role === 'organizer') {
				regData.companyName = companyName
				regData.document = document
			}
			const res = await authApi.register(regData)
			setSession(res.token, res.user, res.organizerProfile)
			navigate('/')
		} catch (err) {
			const axiosErr = err as { response?: { data?: { error?: string } } }
			setError(axiosErr?.response?.data?.error ?? 'Erro ao registar')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center p-4"
			style={{
				background: 'linear-gradient(135deg, #FFF0E8 0%, #FFFFFF 50%, #FFF0E8 100%)',
			}}
		>
			<div className="w-full max-w-md">
				<Link to="/" className="flex items-center gap-2 mb-8 justify-center">
					<div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
						<span className="text-white font-display text-lg leading-none">T</span>
					</div>
					<span className="font-display text-2xl tracking-wide text-text">
						TicketZone
					</span>
				</Link>

				<div className="card p-8">
					<h2 className="font-heading font-700 text-2xl mb-1">Criar Conta</h2>
					<p className="text-text-secondary text-sm mb-6">Junta-te à TicketZone</p>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
							{error}
						</div>
					)}

					{/* Role selector */}
					<div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
						<button
							type="button"
							onClick={() => setRole('buyer')}
							className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-heading font-600 transition-all ${
								role === 'buyer'
									? 'bg-white text-text shadow-sm'
									: 'text-text-secondary hover:text-text'
							}`}
						>
							Comprador
						</button>
						<button
							type="button"
							onClick={() => setRole('organizer')}
							className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-heading font-600 transition-all ${
								role === 'organizer'
									? 'bg-white text-text shadow-sm'
									: 'text-text-secondary hover:text-text'
							}`}
						>
							Promotor
						</button>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Input
							label="Nome completo"
							placeholder="O teu nome"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<Input
							label="Email"
							type="email"
							placeholder="teu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<Input
							label="Telefone (opcional)"
							type="tel"
							placeholder="+244 900 000 000"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						<Input
							label="Senha"
							type="password"
							placeholder="Mínimo 6 caracteres"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
						/>

						{role === 'organizer' && (
							<>
								<Input
									label="Nome da Empresa (opcional)"
									placeholder="A tua empresa"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
								/>
								<Input
									label="NIF/Bi"
									placeholder="Número de identificação"
									value={document}
									onChange={(e) => setDocument(e.target.value)}
									required
								/>
							</>
						)}

						<Button type="submit" loading={loading} className="w-full mt-2">
							Criar Conta
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-text-secondary">
						Já tens conta?{' '}
						<Link
							to="/login"
							className="text-brand font-heading font-600 hover:underline"
						>
							Entrar
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
