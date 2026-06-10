import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvent } from '../../api/hooks/useEvents'
import { useAuthStore } from '../../stores/useAuthStore'
import { useCartStore } from '../../stores/useCartStore'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton, SkeletonText } from '../../components/ui/Skeleton'
import { formatDate, formatKwanza, getCategoryLabel, getPeriodLabel } from '../../lib/format'

export function EventDetail() {
	const { slug } = useParams<{ slug: string }>()
	const { data, isLoading } = useEvent(slug!)
	const navigate = useNavigate()
	const user = useAuthStore((s) => s.user)
	const { addItem, addAddon, setEvent } = useCartStore()
	const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
	const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({})

	if (isLoading) {
		return (
			<div>
				<Skeleton className="h-64 sm:h-80 lg:h-96 w-full rounded-none" />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-8">
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="rounded-xl border border-border p-4 space-y-2"
									>
										<Skeleton className="w-5 h-5" />
										<Skeleton className="h-3 w-16" />
										<Skeleton className="h-4 w-24" />
									</div>
								))}
							</div>
							<div className="space-y-3">
								<Skeleton className="h-6 w-40" />
								<SkeletonText lines={4} />
							</div>
						</div>
						<div className="rounded-xl border border-border p-6 space-y-5">
							<Skeleton className="h-6 w-20" />
							{[...Array(3)].map((_, i) => (
								<div key={i} className="space-y-2 pb-4 border-b border-border">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-9 w-full rounded-lg" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!data?.event) {
		return (
			<div className="text-center py-32">
				<h2 className="font-heading font-700 text-xl mb-2">Evento não encontrado</h2>
				<p className="text-text-secondary">Este evento não existe ou foi removido</p>
			</div>
		)
	}

	const event = data.event
	const tickets = event.ticketTypes ?? []
	const addons = event.addons ?? []

	const totalSelected = Object.values(selectedTickets).reduce((sum, q) => sum + q, 0)

	const totalPrice =
		tickets.reduce((sum, tt) => sum + (selectedTickets[tt.id] ?? 0) * tt.price, 0) +
		addons.reduce((sum, a) => sum + (selectedAddons[a.id] ?? 0) * a.price, 0)

	const handleAddToCart = () => {
		if (!user) {
			navigate('/login')
			return
		}

		setEvent(event.id, event.title)

		for (const tt of tickets) {
			const qty = selectedTickets[tt.id] ?? 0
			if (qty > 0) {
				addItem({
					ticketTypeId: tt.id,
					ticketTypeName: tt.name,
					quantity: qty,
					unitPrice: tt.price,
					peoplePerTicket: tt.peoplePerTicket,
				})
			}
		}

		for (const a of addons) {
			const qty = selectedAddons[a.id] ?? 0
			if (qty > 0) {
				addAddon({
					addonId: a.id,
					name: a.name,
					quantity: qty,
					unitPrice: a.price,
				})
			}
		}

		navigate(`/checkout/${event.id}`)
	}

	const handleQuantityChange = (ticketTypeId: string, value: number) => {
		setSelectedTickets((prev) => {
			const next = { ...prev }
			if (value <= 0) {
				delete next[ticketTypeId]
			} else {
				next[ticketTypeId] = value
			}
			return next
		})
	}

	const handleAddonQuantityChange = (addonId: string, value: number) => {
		setSelectedAddons((prev) => {
			const next = { ...prev }
			if (value <= 0) {
				delete next[addonId]
			} else {
				next[addonId] = value
			}
			return next
		})
	}

	return (
		<div>
			{/* Cover image */}
			<div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
				<img
					src={event.coverImage}
					alt={event.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
					<Badge
						variant={
							event.category === 'festival'
								? 'brand'
								: event.category === 'theatre'
									? 'pink'
									: event.category === 'family'
										? 'emerald'
										: event.category === 'party'
											? 'amber'
											: 'blue'
						}
					>
						{getCategoryLabel(event.category)}
					</Badge>
					<h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-2">
						{event.title}
					</h1>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Info grid */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							{[
								{
									icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
									label: 'Data',
									value: formatDate(event.date),
								},
								{
									icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
									label: 'Horário',
									value: `${event.time} · ${getPeriodLabel(event.period)}`,
								},
								{
									icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
									label: 'Local',
									value: event.venue,
								},
								{
									icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
									label: 'Província',
									value: event.province,
								},
							].map((item) => (
								<div key={item.label} className="card p-4">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-brand mb-2"
									>
										<path d={item.icon} />
									</svg>
									<p className="text-xs text-text-secondary">{item.label}</p>
									<p className="text-sm font-heading font-600 mt-0.5">
										{item.value}
									</p>
								</div>
							))}
						</div>

						{/* Description */}
						<div>
							<h2 className="font-heading font-700 text-xl mb-3">Sobre o Evento</h2>
							<p className="text-text-secondary leading-relaxed">
								{event.description}
							</p>
						</div>

						{/* Add-ons */}
						{addons.length > 0 && (
							<div>
								<h2 className="font-heading font-700 text-xl mb-3">Add-ons</h2>
								<div className="grid sm:grid-cols-2 gap-3">
									{addons.map((addon) => {
										const qty = selectedAddons[addon.id] ?? 0
										const maxQty = addon.capacity - addon.sold
										return (
											<div
												key={addon.id}
												className="card p-4 flex items-center justify-between"
											>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-heading font-600 truncate">
														{addon.name}
													</p>
													<p className="text-xs text-text-secondary truncate">
														{addon.description}
													</p>
													{maxQty > 0 ? (
														<p className="text-xs text-text-secondary mt-1">
															{maxQty} restantes
														</p>
													) : (
														<p className="text-xs text-red-500 mt-1">
															Esgotado
														</p>
													)}
												</div>
												<div className="flex items-center gap-2 ml-3 shrink-0">
													<span className="text-sm font-heading font-700 text-brand mr-1">
														{formatKwanza(addon.price)}
													</span>
													<button
														onClick={() =>
															handleAddonQuantityChange(
																addon.id,
																qty - 1,
															)
														}
														disabled={qty === 0}
														className="w-8 h-8 rounded-lg border-2 border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
													>
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path d="M5 12h14" />
														</svg>
													</button>
													<span className="w-6 text-center font-heading font-600 text-sm">
														{qty}
													</span>
													<button
														onClick={() =>
															handleAddonQuantityChange(
																addon.id,
																qty + 1,
															)
														}
														disabled={qty >= maxQty}
														className="w-8 h-8 rounded-lg border-2 border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
													>
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path d="M12 5v14M5 12h14" />
														</svg>
													</button>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar — Ticket selection */}
					<div className="lg:sticky lg:top-24 lg:self-start">
						<div className="card p-6 space-y-5">
							<h3 className="font-heading font-700 text-lg">Bilhetes</h3>

							{tickets.length > 0 ? (
								tickets.map((tt) => (
									<div
										key={tt.id}
										className="pb-4 border-b border-border last:border-0"
									>
										<div className="flex items-start justify-between mb-2">
											<div>
												<p className="font-heading font-600 text-sm">
													{tt.name}
												</p>
												{tt.description && (
													<p className="text-xs text-text-secondary">
														{tt.description}
													</p>
												)}
												{tt.peoplePerTicket > 1 && (
													<span className="inline-block mt-1 text-xs bg-brand-soft text-brand px-2 py-0.5 rounded-full font-heading font-600">
														{tt.peoplePerTicket} pessoas por bilhete
													</span>
												)}
											</div>
											<p className="font-heading font-700 text-brand whitespace-nowrap">
												{formatKwanza(tt.price)}
											</p>
										</div>

										<div className="flex items-center gap-3 mt-3">
											<button
												onClick={() =>
													handleQuantityChange(
														tt.id,
														(selectedTickets[tt.id] ?? 0) - 1,
													)
												}
												disabled={!selectedTickets[tt.id]}
												className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
											>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M5 12h14" />
												</svg>
											</button>
											<span className="w-8 text-center font-heading font-600">
												{selectedTickets[tt.id] ?? 0}
											</span>
											<button
												onClick={() =>
													handleQuantityChange(
														tt.id,
														(selectedTickets[tt.id] ?? 0) + 1,
													)
												}
												disabled={
													(selectedTickets[tt.id] ?? 0) >= tt.available
												}
												className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
											>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M12 5v14M5 12h14" />
												</svg>
											</button>
											<span className="text-xs text-text-secondary ml-auto">
												{tt.available} restantes
											</span>
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-text-secondary text-center py-8">
									Nenhum bilhete disponível neste momento.
								</p>
							)}

							{/* Summary */}
							<div className="pt-2">
								<div className="flex items-center justify-between mb-1">
									<span className="text-sm text-text-secondary">
										Bilhetes selecionados
									</span>
									<span className="text-sm font-heading font-600">
										{totalSelected}
									</span>
								</div>
								<div className="flex items-center justify-between mb-4">
									<span className="text-sm text-text-secondary">Total</span>
									<span className="font-heading font-700 text-xl text-brand">
										{formatKwanza(totalPrice)}
									</span>
								</div>
								<Button
									className="w-full"
									size="lg"
									disabled={totalSelected === 0}
									onClick={handleAddToCart}
								>
									{user ? 'Comprar Bilhetes' : 'Entrar para Comprar'}
								</Button>
							</div>
						</div>

						{/* Organizer info */}
						<div className="mt-4 card p-4">
							<p className="text-xs text-text-secondary mb-1">Organizado por</p>
							<p className="text-sm font-heading font-600">{event.organizerName}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
