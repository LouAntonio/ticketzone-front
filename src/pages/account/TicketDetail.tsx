import { useParams, useNavigate } from 'react-router-dom'
import { useTickets } from '../../api/hooks/useTickets'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { QRCodeSVG } from 'qrcode.react'

const statusVariant: Record<string, 'emerald' | 'gray' | 'red'> = {
	active: 'emerald',
	used: 'gray',
	cancelled: 'red',
}

const statusLabel: Record<string, string> = {
	active: 'Ativo',
	used: 'Usado',
	cancelled: 'Cancelado',
}

export function TicketDetailPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data, isLoading } = useTickets()

	const ticket = data?.tickets?.find((t) => t.id === id)

	const handleDownload = () => {
		const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null
		if (!canvas) return
		const url = canvas.toDataURL('image/png')
		const a = document.createElement('a')
		a.href = url
		a.download = `bilhete-${ticket!.id}.png`
		a.click()
	}

	const handleShare = () => {
		if (!ticket) return
		const text = `Bilhete para ${ticket.eventTitle}\nCódigo: ${ticket.qrCode}\nData: ${formatDate(ticket.eventDate)}`
		if (navigator.share) {
			navigator.share({ title: 'Meu Bilhete Ticketzone', text })
		} else {
			navigator.clipboard.writeText(text)
		}
	}

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-[400px] w-full rounded-xl" />
			</div>
		)
	}

	if (!ticket) {
		return (
			<div className="max-w-2xl mx-auto text-center py-16">
				<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						className="text-brand"
					>
						<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
					</svg>
				</div>
				<p className="font-heading font-600 text-warm-text mb-2">Bilhete não encontrado</p>
				<Button onClick={() => navigate('/account/tickets')}>Voltar</Button>
			</div>
		)
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Back */}
			<div className="flex items-center gap-4 stagger-1">
				<button
					onClick={() => navigate('/account/tickets')}
					className="w-9 h-9 rounded-xl border border-warm-border flex items-center justify-center hover:bg-gray-50 transition-colors"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</button>
				<div>
					<h1 className="font-display-alt font-700 text-2xl text-warm-text">
						Meu Bilhete
					</h1>
					<p className="text-text-secondary text-sm">{ticket.eventTitle}</p>
				</div>
				<div className="ml-auto">
					<Badge variant={statusVariant[ticket.status] ?? 'gray'}>
						{statusLabel[ticket.status] ?? ticket.status}
					</Badge>
				</div>
			</div>

			{/* Ticket Card */}
			<div className="card-account stagger-2 overflow-hidden">
				<div className="p-8 sm:p-10 flex flex-col items-center">
					{/* QR Code */}
					<div className="relative mb-6">
						<div className="w-64 h-64 bg-white rounded-2xl border-2 border-warm-border p-4 shadow-sm">
							<QRCodeSVG
								id="qr-canvas"
								value={ticket.qrCode}
								size={224}
								level="H"
								includeMargin
							/>
						</div>
						<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-warm-border flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="text-brand"
							>
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
						</div>
					</div>

					<p className="font-mono text-sm text-text-secondary tracking-wider mb-6">
						{ticket.qrCode}
					</p>

					<p className="text-xs text-text-secondary text-center max-w-xs">
						Apresenta este código na entrada do evento.
						{ticket.groupSize &&
							ticket.groupSize > 1 &&
							` Este bilhete é válido para ${ticket.groupSize} pessoas.`}
					</p>

					{/* Actions */}
					{ticket.status === 'active' && (
						<div className="flex gap-3 mt-6">
							<button
								onClick={handleDownload}
								className="inline-flex items-center gap-2 h-10 px-5 bg-brand text-white font-heading font-600 text-sm rounded-xl hover:bg-brand-dark transition-all"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
								</svg>
								Download QR
							</button>
							<button
								onClick={handleShare}
								className="inline-flex items-center gap-2 h-10 px-5 border-2 border-brand text-brand font-heading font-600 text-sm rounded-xl hover:bg-brand-soft transition-all"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
								</svg>
								Partilhar
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Event Info */}
			<div className="card-account stagger-3">
				<div className="p-6 sm:p-8">
					<h3 className="font-heading font-700 text-lg text-warm-text mb-4">
						Informação do Evento
					</h3>
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-brand"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{ticket.eventTitle}
								</p>
								<p className="text-xs text-text-secondary">
									{formatDate(ticket.eventDate)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-brand"
								>
									<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{ticket.buyerName}
								</p>
								<p className="text-xs text-text-secondary">Comprador</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-brand"
								>
									<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-heading font-600 text-warm-text">
									{ticket.ticketTypeName}
								</p>
								<p className="text-xs text-text-secondary">Tipo de bilhete</p>
							</div>
						</div>
						{ticket.groupSize && ticket.groupSize > 1 && (
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										className="text-brand"
									>
										<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
									</svg>
								</div>
								<div>
									<p className="text-sm font-heading font-600 text-warm-text">
										{ticket.used}/{ticket.groupSize} entradas usadas
									</p>
									<p className="text-xs text-text-secondary">Bilhete de grupo</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Valid Until */}
			{ticket.validateUntil && (
				<div className="card-account stagger-4">
					<div className="p-6">
						<div className="flex items-center justify-between text-sm">
							<span className="text-text-secondary">Válido até</span>
							<span className="font-heading font-600 text-warm-text">
								{formatDate(ticket.validateUntil)}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
