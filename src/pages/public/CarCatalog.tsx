import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCars } from '../../api/hooks/useRentals'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useAuthStore } from '../../stores/useAuthStore'
import { formatKwanza } from '../../lib/format'

export function CarCatalog() {
	const { data, isLoading } = useCars()
	const user = useAuthStore((s) => s.user)
	const navigate = useNavigate()
	const [selectedCar, setSelectedCar] = useState<string | null>(null)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')

	const cars = data?.cars ?? []

	const handleRent = (carId: string) => {
		if (!user) {
			navigate('/login')
			return
		}
		setSelectedCar(carId)
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="font-display text-4xl sm:text-5xl mb-2">Rent-a-Car</h1>
				<p className="text-text-secondary">
					Aluga uma viatura para o teu evento ou próxima viagem
				</p>
			</div>

			{isLoading ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="fade-in" style={{ animationDelay: `${i * 80}ms` }}>
							<SkeletonCard />
						</div>
					))}
				</div>
			) : cars.length === 0 ? (
				<Card className="text-center py-12">
					<p className="text-text-secondary">Nenhuma viatura disponível de momento</p>
				</Card>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{cars.map((car, i) => (
						<div
							key={car.id}
							className="card overflow-hidden hover:shadow-lg transition-all duration-300 fade-in"
							style={{ animationDelay: `${i * 80}ms` }}
						>
							<div className="aspect-[16/10] overflow-hidden">
								<img
									src={car.photos[0]}
									alt={`${car.make} ${car.model}`}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
									loading="lazy"
								/>
							</div>
							<div className="p-5">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h3 className="font-heading font-700 text-lg">
											{car.make} {car.model}
										</h3>
										<p className="text-xs text-text-secondary">
											{car.year} ·{' '}
											{car.transmission === 'auto' ? 'Automática' : 'Manual'}
										</p>
									</div>
									<Badge variant={car.available ? 'emerald' : 'gray'}>
										{car.available ? 'Disponível' : 'Indisponível'}
									</Badge>
								</div>

								<div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
									<span className="flex items-center gap-1">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
											<circle cx="9" cy="7" r="4" />
											<path d="M23 21v-2a4 4 0 00-3-3.87" />
											<path d="M16 3.13a4 4 0 010 7.75" />
										</svg>
										{car.seats} lugares
									</span>
									<span className="flex items-center gap-1">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
											<circle cx="12" cy="10" r="3" />
										</svg>
										{car.location}
									</span>
									<span>{car.fuelType}</span>
								</div>

								<p className="text-sm text-text-secondary mb-4 line-clamp-2">
									{car.description}
								</p>

								<div className="flex items-center justify-between pt-4 border-t border-border">
									<div>
										<span className="text-xs text-text-secondary">Por dia</span>
										<p className="font-heading font-700 text-xl text-brand">
											{formatKwanza(car.pricePerDay)}
										</p>
									</div>
									<Button
										size="sm"
										disabled={!car.available}
										onClick={() => handleRent(car.id)}
									>
										{user ? 'Alugar' : 'Entrar para Alugar'}
									</Button>
								</div>

								{/* Rental form */}
								{selectedCar === car.id && (
									<div className="mt-4 pt-4 border-t border-border slide-up">
										<p className="text-sm font-heading font-600 mb-3">
											Selecionar Datas
										</p>
										<div className="grid grid-cols-2 gap-3 mb-3">
											<div>
												<label className="text-xs text-text-secondary block mb-1">
													Início
												</label>
												<input
													type="date"
													className="input-field text-sm"
													value={startDate}
													onChange={(e) => setStartDate(e.target.value)}
												/>
											</div>
											<div>
												<label className="text-xs text-text-secondary block mb-1">
													Fim
												</label>
												<input
													type="date"
													className="input-field text-sm"
													value={endDate}
													onChange={(e) => setEndDate(e.target.value)}
												/>
											</div>
										</div>
										<div className="flex gap-2">
											<Button size="sm" className="flex-1">
												Reservar Agora
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setSelectedCar(null)}
											>
												Cancelar
											</Button>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
