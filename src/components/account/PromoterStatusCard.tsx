import { Link } from 'react-router-dom'

interface PromoterStatusCardProps {
	status: 'PENDING' | 'VERIFIED' | 'REJECTED' | null
}

export function PromoterStatusCard({ status }: PromoterStatusCardProps) {
	if (!status) return null

	if (status === 'VERIFIED') {
		return (
			<div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
				<div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#065f46"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<div className="flex-1">
					<p className="text-sm font-heading font-600 text-emerald-800">
						Promotor Verificado
					</p>
					<p className="text-xs text-emerald-700 mt-0.5">
						A tua conta de promotor está ativa.
					</p>
				</div>
				<Link
					to="/organizer"
					className="text-xs font-heading font-600 text-emerald-700 hover:text-emerald-800 underline decoration-emerald-300 underline-offset-2 shrink-0"
				>
					Painel
				</Link>
			</div>
		)
	}

	if (status === 'PENDING') {
		return (
			<div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
				<div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
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
						<path d="M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z" />
					</svg>
				</div>
				<div className="flex-1">
					<p className="text-sm font-heading font-600 text-amber-800">
						Pedido em Análise
					</p>
					<p className="text-xs text-amber-700 mt-0.5">
						O teu pedido de promotor está a ser analisado.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
			<div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
				<svg
					width="18"
					height="18"
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
			<div className="flex-1">
				<p className="text-sm font-heading font-600 text-red-800">Pedido Não Aprovado</p>
				<p className="text-xs text-red-700 mt-0.5">
					O teu pedido de promotor foi rejeitado.
				</p>
			</div>
			<Link
				to="/account/become-promoter"
				className="text-xs font-heading font-600 text-red-700 hover:text-red-800 underline decoration-red-300 underline-offset-2 shrink-0"
			>
				Reaplicar
			</Link>
		</div>
	)
}
