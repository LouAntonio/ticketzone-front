import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTickets, useRotateQrCode } from '../../api/hooks/useTickets'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/format'
import { ReactQRCode } from '@lglab/react-qr-code'

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
	const rotateMutation = useRotateQrCode()
	const rotatingRef = useRef(false)

	const ticket = (data?.data ?? []).find((t: { id: string }) => t.id === id)

	const qrState = useMemo(() => {
		if (!ticket) return null
		return { qrCode: ticket.qrCode, qrExpiresAt: ticket.qrExpiresAt }
	}, [ticket])

	const [now, setNow] = useState(() => Date.now())
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setNow(Date.now())
		}, 1000)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	useEffect(() => {
		if (!qrState || !id || rotatingRef.current) return

		const expiresAt = new Date(qrState.qrExpiresAt).getTime()
		if (now >= expiresAt) {
			rotatingRef.current = true
			rotateMutation.mutateAsync(id).finally(() => {
				rotatingRef.current = false
			})
		}
	}, [now, qrState, id, rotateMutation])

	const countdown = (() => {
		if (!qrState) return null
		const diff = new Date(qrState.qrExpiresAt).getTime() - now
		return diff > 0 ? Math.ceil(diff / 1000) : 0
	})()

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
					{qrState && (
						<div className="relative mb-4">
							<div className="w-64 h-64 bg-white rounded-2xl border-2 border-warm-border p-4 shadow-sm">
								<ReactQRCode
									value={qrState.qrCode}
									size={224}
									level="H"
									marginSize={4}
									dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
									finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
									finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
								/>
							</div>
						</div>
					)}

					{countdown !== null && countdown > 0 && (
						<div className="mb-4 flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
							<span className="text-xs text-emerald-600 font-heading font-600">
								QR expira em {countdown}s
							</span>
						</div>
					)}
					{countdown !== null && countdown <= 0 && (
						<div className="mb-4 flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-amber-500" />
							<span className="text-xs text-amber-600 font-heading font-600">
								A renovar QR Code...
							</span>
						</div>
					)}

					<p className="text-xs text-text-secondary text-center max-w-xs">
						Apresenta este código na entrada do evento.
						{ticket.groupSize &&
							ticket.groupSize > 1 &&
							` Este bilhete é válido para ${ticket.groupSize} pessoas.`}
					</p>
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
		</div>
	)
}
