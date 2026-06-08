import { useResendVerification } from '../../api/hooks/useAccount'

interface EmailVerificationBannerProps {
	email: string
}

export function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
	const resendVerification = useResendVerification()

	const handleResend = () => {
		resendVerification.mutate(email)
	}

	return (
		<div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 stagger-1">
			<div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#d97706"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</div>
			<div className="flex-1">
				<p className="text-sm font-heading font-600 text-amber-800">Email não verificado</p>
				<p className="text-xs text-amber-700 mt-0.5">
					Verifica a tua caixa de entrada ({email}) para confirmar o teu email.
				</p>
			</div>
			<button
				onClick={handleResend}
				disabled={resendVerification.isPending}
				className="text-xs font-heading font-600 text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-2 hover:decoration-amber-500 transition-all shrink-0 mt-1 disabled:opacity-50"
			>
				{resendVerification.isPending ? 'A enviar...' : 'Reenviar'}
			</button>
		</div>
	)
}
