import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export function LoginPage() {
	const setSession = useAuthStore((s) => s.setSession)
	const navigate = useNavigate()

	return (
		<main className="grid min-h-screen place-items-center bg-gray-50 px-4 dark:bg-gray-950">
			<div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
				<h1 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Ticketzone
				</h1>
				<div className="flex justify-center">
					<GoogleLogin
						onSuccess={async (cred) => {
							const credential = cred.credential
							if (!credential) {
								toast.error('Credencial inválida do Google')
								return
							}
							try {
								const res = await fetch(
									'https://www.googleapis.com/oauth2/v3/userinfo',
									{ headers: { Authorization: `Bearer ${credential}` } },
								)
								if (!res.ok) throw new Error('userinfo failed')
								const profile = (await res.json()) as {
									name: string
									email: string
									picture?: string
								}
								setSession(credential, {
									name: profile.name,
									email: profile.email,
									picture: profile.picture,
								})
								navigate('/', { replace: true })
							} catch {
								toast.error('Falha ao autenticar com o Google')
							}
						}}
						onError={() => toast.error('Login com Google falhou')}
					/>
				</div>
			</div>
		</main>
	)
}
