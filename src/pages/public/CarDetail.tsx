import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useCar, useCreateBooking } from '../../api/hooks/useRentals'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAuthStore } from '../../stores/useAuthStore'
import { formatKwanza } from '../../lib/format'

export function CarDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const user = useAuthStore((s) => s.user)
	const { data, isLoading } = useCar(id ?? '')
	const createBooking = useCreateBooking()

	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	const car = data?.car
	const photos = car?.photos ?? []

	const today = new Date().toISOString().split('T')[0]

	const handleLightboxClose = useCallback(() => setLightboxIndex(null), [])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (lightboxIndex === null) return
			if (e.key === 'Escape') handleLightboxClose()
			if (e.key === 'ArrowLeft') {
				setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null))
			}
			if (e.key === 'ArrowRight') {
				setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null))
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [lightboxIndex, photos.length, handleLightboxClose])

	const handleReserve = async () => {
		if (!user) {
			navigate('/login')
			return
		}
		if (!startDate || !endDate) {
			toast.error('Seleciona as datas de início e fim')
			return
		}
		if (new Date(endDate) <= new Date(startDate)) {
			toast.error('A data de fim deve ser posterior à data de início')
			return
		}
		try {
			const result = await createBooking.mutateAsync({
				carId: id!,
				startDate,
				endDate,
			})
			toast.success('Viatura reservada com sucesso!')
			if (result.order?.id) {
				navigate(`/account/orders/${result.order.id}`)
			} else {
				navigate('/account/rentals')
			}
		} catch {
			toast.error('Erro ao reservar. Tenta novamente.')
		}
	}

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				<Skeleton className="h-8 w-48" />
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-4">
						<Skeleton className="h-[400px] w-full rounded-xl" />
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{[...Array(3)].map((_, i) => (
								<Skeleton key={i} className="aspect-[4/3] rounded-xl" />
							))}
						</div>
					</div>
					<div className="space-y-6">
						<Skeleton className="h-64 rounded-xl" />
						<Skeleton className="h-48 rounded-xl" />
					</div>
				</div>
			</div>
		)
	}

	if (!car) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
				<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand">
						<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
						<circle cx="6.5" cy="16.5" r="2.5" />
						<circle cx="16.5" cy="16.5" r="2.5" />
					</svg>
				</div>
				<p className="font-heading font-600 text-warm-text mb-2">Viatura não encontrada</p>
				<Button onClick={() => navigate('/rentals')}>Ver Viaturas</Button>
			</div>
		)
	}

	const pricePerDay = car.pricePerDay
	const totalDays =
		startDate && endDate
			? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
			: 0
	const totalPrice = pricePerDay * totalDays

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-text-secondary mb-8 fade-in">
				<Link to="/rentals" className="hover:text-brand transition-colors">Rent-a-Car</Link>
				<span>/</span>
				<span className="text-text">{car.make} {car.model}</span>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Gallery + Specs column */}
				<div className="lg:col-span-2 space-y-8">
					{/* Gallery */}
					{photos.length > 0 && (
						<div className="fade-in">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								{photos.map((photo, i) => (
									<button
										key={i}
										onClick={() => setLightboxIndex(i)}
										className="group cursor-pointer overflow-hidden rounded-xl bg-surface-card border border-border"
									>
										<div className="aspect-[4/3] overflow-hidden">
											<img
												src={photo}
												alt={`${car.make} ${car.model} - Foto ${i + 1}`}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading={i === 0 ? undefined : 'lazy'}
											/>
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Specs card */}
					<div className="bg-surface-card border border-border rounded-xl p-6 sm:p-8 fade-in">
						<h2 className="font-heading font-700 text-xl mb-6">Especificações</h2>
						<div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Ano</span>
								<span className="font-heading font-600">{car.year}</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Transmissão</span>
								<span className="font-heading font-600">
									{car.transmission === 'auto' ? 'Automática' : 'Manual'}
								</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Lugares</span>
								<span className="font-heading font-600">{car.seats}</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Combustível</span>
								<span className="font-heading font-600">{car.fuelType}</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Localização</span>
								<span className="font-heading font-600">{car.location}</span>
							</div>
							<div className="flex items-center justify-between sm:justify-start sm:gap-4 py-2 border-b border-border">
								<span className="text-text-secondary w-28 shrink-0">Matrícula</span>
								<span className="font-heading font-600 font-mono tracking-wider text-xs">{car.plate}</span>
							</div>
						</div>

						{car.description && (
							<div className="mt-6 pt-6 border-t border-border">
								<p className="text-sm text-text-secondary leading-relaxed">
									{car.description}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Sidebar: Info + Booking */}
				<div className="space-y-6 fade-in">
					{/* Price card */}
					<div className="bg-surface-card border border-border rounded-xl p-6">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h1 className="font-display text-2xl mb-0.5">
									{car.make} {car.model}
								</h1>
								<p className="text-xs text-text-secondary font-mono tracking-wider">
									{car.plate}
								</p>
							</div>
							<Badge variant={car.available ? 'emerald' : 'gray'}>
								{car.available ? 'Disponível' : 'Indisponível'}
							</Badge>
						</div>

						<div className="flex items-baseline gap-1 mb-1">
							<span className="font-display text-3xl text-brand">
								{formatKwanza(pricePerDay)}
							</span>
							<span className="text-text-secondary text-sm">/dia</span>
						</div>
					</div>

					{/* Booking Form */}
					{car.available && (
						<div className="bg-surface-card border border-border rounded-xl p-6">
							<h3 className="font-heading font-700 text-base mb-4">Reservar</h3>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-text-secondary block mb-1.5 font-heading font-600">
											Início
										</label>
										<input
											type="date"
											className="input-field text-sm"
											value={startDate}
											min={today}
											onChange={(e) => setStartDate(e.target.value)}
										/>
									</div>
									<div>
										<label className="text-xs text-text-secondary block mb-1.5 font-heading font-600">
											Fim
										</label>
										<input
											type="date"
											className="input-field text-sm"
											value={endDate}
											min={startDate || today}
											onChange={(e) => setEndDate(e.target.value)}
										/>
									</div>
								</div>

								{totalDays > 0 && (
									<div className="p-4 bg-brand-soft rounded-xl space-y-2 slide-up">
										<div className="flex justify-between text-sm">
											<span className="text-text-secondary">{totalDays} dia{totalDays > 1 ? 's' : ''}</span>
											<span className="font-heading font-600">{formatKwanza(pricePerDay)}/dia</span>
										</div>
										<div className="flex justify-between pt-2 border-t border-brand/20">
											<span className="font-heading font-700">Total</span>
											<span className="font-heading font-700 text-lg text-brand">
												{formatKwanza(totalPrice)}
											</span>
										</div>
									</div>
								)}

								<Button
									className="w-full"
									size="lg"
									disabled={!startDate || !endDate || totalDays < 1}
									onClick={handleReserve}
									loading={createBooking.isPending}
								>
									{user ? 'Reservar Agora' : 'Entrar para Reservar'}
								</Button>

								{!user && (
									<p className="text-xs text-text-secondary text-center">
										Precisas de uma conta para reservar.{' '}
										<Link to="/login" className="text-brand font-heading font-600">Entrar</Link>
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Lightbox */}
			{lightboxIndex !== null && (
				<div
					className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
					onClick={handleLightboxClose}
				>
					<button
						onClick={(e) => {
							e.stopPropagation()
							setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null))
						}}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation()
							setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null))
						}}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation()
							handleLightboxClose()
						}}
						className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>

					<img
						src={photos[lightboxIndex]}
						alt={`${car.make} ${car.model} - Foto ${lightboxIndex + 1}`}
						className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
						onClick={(e) => e.stopPropagation()}
					/>

					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-heading font-600">
						{lightboxIndex + 1} / {photos.length}
					</div>
				</div>
			)}
		</div>
	)
}
