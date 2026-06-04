import { useTickets } from '../../api/hooks/useTickets'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { formatDate } from '../../lib/format'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const statusVariant: Record<string, 'emerald' | 'gray' | 'red'> = {
	active: 'emerald',
	used: 'gray',
	cancelled: 'red',
}

export function MyTickets() {
	const { data, isLoading } = useTickets()
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Spinner size="lg" />
			</div>
		)
	}

	const tickets = data?.tickets ?? []

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
					{tickets.map((ticket) => (
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

							{/* QR Code */}
							<div className="mt-4 pt-4 border-t border-border">
								<button
									onClick={() =>
										setSelectedTicket(
											selectedTicket === ticket.id ? null : ticket.id,
										)
									}
									className="flex items-center gap-3 w-full text-left"
								>
									<div className="w-12 h-12 bg-white rounded-lg border-2 border-border flex items-center justify-center overflow-hidden shrink-0">
										<QRCodeSVG value={ticket.qrCode} size={44} level="M" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs font-heading font-600">
											{selectedTicket === ticket.id
												? 'Clique para fechar'
												: 'Ver QR Code completo'}
										</p>
										<p className="text-xs text-text-secondary">
											Código: {ticket.qrCode}
										</p>
									</div>
								</button>

								{selectedTicket === ticket.id && (
									<div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-xl slide-up">
										<QRCodeSVG
											value={ticket.qrCode}
											size={180}
											level="H"
											includeMargin
										/>
										<p className="mt-3 text-xs text-text-secondary font-heading font-600">
											{ticket.qrCode}
										</p>
										<p className="text-xs text-text-secondary text-center mt-1">
											Apresenta este código na entrada do evento
										</p>
										<div className="flex gap-2 mt-3">
											<button className="btn-outline h-9 px-4 text-xs rounded-lg">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
													<polyline points="16 6 12 2 8 6" />
													<line x1="12" y1="2" x2="12" y2="15" />
												</svg>
												Download
											</button>
											<button className="btn-ghost h-9 px-4 text-xs rounded-lg">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M22 2L11 13" />
													<path d="M22 2l-7 20-4-9-9-4 20-7z" />
												</svg>
												WhatsApp
											</button>
										</div>
									</div>
								)}
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
