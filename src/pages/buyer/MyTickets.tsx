import { useEffect, useRef, useCallback } from 'react'
import { useTickets, useRotateQrCode } from '../../api/hooks/useTickets'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../lib/format'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const statusVariant: Record<string, 'emerald' | 'gray' | 'red'> = {
	active: 'emerald',
	used: 'gray',
	cancelled: 'red',
}

interface QrState {
	qrCode: string
	qrExpiresAt: string
}

export function MyTickets() {
	const { data, isLoading } = useTickets()
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
	const [qrStates, setQrStates] = useState<Record<string, QrState>>({})
	const [now, setNow] = useState(Date.now())
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const rotateMutation = useRotateQrCode()
	const rotatingRef = useRef<Set<string>>(new Set())

	const tickets = data?.data ?? []

	const updateQrFromTicket = useCallback(
		(ticket: { id: string; qrCode: string; qrExpiresAt: string }) => {
			setQrStates((prev) => {
				if (prev[ticket.id]) return prev
				return {
					...prev,
					[ticket.id]: { qrCode: ticket.qrCode, qrExpiresAt: ticket.qrExpiresAt },
				}
			})
		},
		[],
	)

	useEffect(() => {
		for (const t of tickets) {
			updateQrFromTicket(t)
		}
	}, [tickets, updateQrFromTicket])

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setNow(Date.now())
		}, 1000)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	useEffect(() => {
		if (!selectedTicket || !qrStates[selectedTicket]) return

		const qs = qrStates[selectedTicket]
		const expiresAt = new Date(qs.qrExpiresAt).getTime()

		if (now >= expiresAt && !rotatingRef.current.has(selectedTicket)) {
			rotatingRef.current.add(selectedTicket)
			rotateMutation
				.mutateAsync(selectedTicket)
				.then((res) => {
					setQrStates((prev) => ({
						...prev,
						[selectedTicket]: { qrCode: res.qrCode, qrExpiresAt: res.qrExpiresAt },
					}))
				})
				.finally(() => {
					rotatingRef.current.delete(selectedTicket)
				})
		}
	}, [now, selectedTicket, qrStates, rotateMutation])

	const handleToggle = (ticketId: string) => {
		setSelectedTicket((prev) => (prev === ticketId ? null : ticketId))
	}

	const getCountdown = (ticketId: string): number | null => {
		const qs = qrStates[ticketId]
		if (!qs) return null
		const diff = new Date(qs.qrExpiresAt).getTime() - now
		return diff > 0 ? Math.ceil(diff / 1000) : 0
	}

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="grid sm:grid-cols-2 gap-4">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-border overflow-hidden p-4"
						>
							<div className="flex gap-4">
								<Skeleton className="w-20 h-20 rounded-xl shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-3 w-24" />
									<div className="flex gap-2 mt-2">
										<Skeleton className="h-5 w-14 rounded-full" />
									</div>
								</div>
							</div>
							<div className="mt-4 pt-4 border-t border-border">
								<div className="flex items-center gap-3">
									<Skeleton className="w-12 h-12 rounded-lg" />
									<div className="space-y-1.5 flex-1">
										<Skeleton className="h-3 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-heading font-700 text-2xl">Os Meus Bilhetes</h1>
				<p className="text-text-secondary text-sm">
					{tickets.length} bilhete{tickets.length !== 1 ? 's' : ''}
				</p>
			</div>

			{tickets.length === 0 ? (
				<Card className="text-center py-12">
					<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-gray-400"
						>
							<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
					</div>
					<p className="text-text-secondary text-sm">Nenhum bilhete encontrado</p>
				</Card>
			) : (
				<div className="grid sm:grid-cols-2 gap-4">
					{tickets.map((ticket) => {
						const qs = qrStates[ticket.id]
						const countdown = getCountdown(ticket.id)

						return (
							<Card key={ticket.id} className="overflow-hidden">
								<div className="flex gap-4">
									<img
										src={ticket.eventImage}
										alt={ticket.eventTitle}
										className="w-20 h-20 rounded-xl object-cover shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-heading font-600 text-sm">
											{ticket.eventTitle}
										</p>
										<p className="text-xs text-text-secondary mt-0.5">
											{formatDate(ticket.eventDate)}
										</p>
										<p className="text-xs text-text-secondary">
											{ticket.ticketTypeName}
											{ticket.groupSize && ` · ${ticket.groupSize} pessoas`}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<Badge variant={statusVariant[ticket.status] ?? 'gray'}>
												{ticket.status === 'active'
													? 'Ativo'
													: ticket.status === 'used'
														? 'Usado'
														: 'Cancelado'}
											</Badge>
											{ticket.groupSize && ticket.groupSize > 1 && (
												<span className="text-xs text-text-secondary">
													{ticket.used}/{ticket.groupSize} usados
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="mt-4 pt-4 border-t border-border">
									<button
										onClick={() => handleToggle(ticket.id)}
										className="flex items-center gap-3 w-full text-left"
									>
										<div className="w-12 h-12 bg-white rounded-lg border-2 border-border flex items-center justify-center overflow-hidden shrink-0">
											{qs && (
												<QRCodeSVG value={qs.qrCode} size={44} level="M" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-heading font-600">
												{selectedTicket === ticket.id
													? 'Clique para fechar'
													: 'Ver QR Code completo'}
											</p>
										</div>
									</button>

									{selectedTicket === ticket.id && qs && (
										<div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-xl slide-up">
											{countdown !== null && countdown > 0 && (
												<div className="mb-3 flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
													<span className="text-xs text-emerald-600 font-heading font-600">
														QR expira em {countdown}s
													</span>
												</div>
											)}
											{countdown !== null && countdown <= 0 && (
												<div className="mb-3 flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-amber-500" />
													<span className="text-xs text-amber-600 font-heading font-600">
														A renovar QR Code...
													</span>
												</div>
											)}
											<QRCodeSVG
												value={qs.qrCode}
												size={180}
												level="H"
												includeMargin
											/>
											<p className="text-xs text-text-secondary text-center mt-3">
												Apresenta este código na entrada do evento
											</p>
										</div>
									)}
								</div>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
