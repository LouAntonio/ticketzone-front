import { useState } from 'react'
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

	const car = data?.car

	const today = new Date().toISOString().split('T')[0]

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
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-[400px] w-full rounded-xl" />
				<div className="grid sm:grid-cols-2 gap-6">
					<Skeleton className="h-48 rounded-xl" />
					<Skeleton className="h-48 rounded-xl" />
				</div>
			</div>
		)
	}

	if (!car) {
		return (
			<div className="max-w-5xl mx-auto px-4 py-16 text-center">
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
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-text-secondary mb-6 fade-in">
				<Link to="/rentals" className="hover:text-brand transition-colors">Rent-a-Car</Link>
				<span>/</span>
				<span className="text-text">{car.make} {car.model}</span>
			</div>

			<div className="grid lg:grid-cols-5 gap-8">
				{/* Gallery */}
				<div className="lg:col-span-3 space-y-4 fade-in">
					<div className="aspect-[16/9] rounded-xl overflow-hidden card">
						<img
							src={car.photos[0] ?? ''}
							alt={`${car.make} ${car.model}`}
							className="w-full h-full object-cover"
						/>
					</div>
					{car.photos.length > 1 && (
						<div className="grid grid-cols-4 gap-3">
							{car.photos.slice(1).map((photo, i) => (
								<div key={i} className="aspect-[4/3] rounded-lg overflow-hidden card">
									<img
										src={photo}
										alt={`${car.make} ${car.model} ${i + 2}`}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Info + Booking */}
				<div className="lg:col-span-2 space-y-6">
					<div className="card p-6 fade-in">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h1 className="font-display text-3xl mb-1">
									{car.make} {car.model}
								</h1>
								<p className="text-sm text-text-secondary font-mono tracking-wider">
									{car.plate}
								</p>
							</div>
							<Badge variant={car.available ? 'emerald' : 'gray'}>
								{car.available ? 'Disponível' : 'Indisponível'}
							</Badge>
						</div>

						<div className="space-y-3 text-sm">
							<div className="flex items-center gap-3 py-2 border-b border-border">
								<span className="text-text-secondary w-28">Ano</span>
								<span className="font-heading font-600">{car.year}</span>
							</div>
							<div className="flex items-center gap-3 py-2 border-b border-border">
								<span className="text-text-secondary w-28">Transmissão</span>
								<span className="font-heading font-600">
									{car.transmission === 'auto' ? 'Automática' : 'Manual'}
								</span>
							</div>
							<div className="flex items-center gap-3 py-2 border-b border-border">
								<span className="text-text-secondary w-28">Lugares</span>
								<span className="font-heading font-600">{car.seats}</span>
							</div>
							<div className="flex items-center gap-3 py-2 border-b border-border">
								<span className="text-text-secondary w-28">Combustível</span>
								<span className="font-heading font-600">{car.fuelType}</span>
							</div>
							<div className="flex items-center gap-3 py-2 border-b border-border">
								<span className="text-text-secondary w-28">Localização</span>
								<span className="font-heading font-600">{car.location}</span>
							</div>
						</div>

						{car.description && (
							<p className="text-sm text-text-secondary mt-4 pt-4 border-t border-border">
								{car.description}
							</p>
						)}

						<div className="mt-6 pt-4 border-t border-border">
							<div className="flex items-baseline gap-1 mb-1">
								<span className="font-display text-3xl text-brand">
									{formatKwanza(pricePerDay)}
								</span>
								<span className="text-text-secondary text-sm">/dia</span>
							</div>
						</div>
					</div>

					{/* Booking Form */}
					{car.available && (
						<div className="card p-6 fade-in">
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
		</div>
	)
}
