import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useCars, useCreateBooking } from '../../api/hooks/useRentals'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useAuthStore } from '../../stores/useAuthStore'
import { formatKwanza } from '../../lib/format'
import { PROVINCES } from '../../lib/constants'

const FUEL_TYPES = ['Gasolina', 'Diesel', 'Elétrico'] as const
const TRANSMISSIONS = [
	{ value: '', label: 'Todas' },
	{ value: 'auto', label: 'Automática' },
	{ value: 'manual', label: 'Manual' },
] as const

export function CarCatalog() {
	const navigate = useNavigate()
	const user = useAuthStore((s) => s.user)

	const [search, setSearch] = useState('')
	const [location, setLocation] = useState('')
	const [fuelType, setFuelType] = useState('')
	const [transmission, setTransmission] = useState('')
	const [page, setPage] = useState(1)

	const params: Record<string, string | number | undefined> = {
		page,
		limit: 12,
	}
	if (search) params.search = search
	if (location) params.location = location
	if (fuelType) params.fuelType = fuelType
	if (transmission) params.transmission = transmission

	const { data, isLoading } = useCars(params as { search?: string; status?: string; page?: number; limit?: number })
	const createBooking = useCreateBooking()

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
		setStartDate('')
		setEndDate('')
	}

	const handleReserve = async () => {
		if (!selectedCar || !startDate || !endDate) {
			toast.error('Seleciona as datas de início e fim')
			return
		}
		if (new Date(endDate) <= new Date(startDate)) {
			toast.error('A data de fim deve ser posterior à data de início')
			return
		}
		try {
			const result = await createBooking.mutateAsync({
				carId: selectedCar,
				startDate,
				endDate,
			})
			toast.success('Viatura reservada com sucesso!')
			setSelectedCar(null)
			setStartDate('')
			setEndDate('')
			if (result.order?.id) {
				navigate(`/account/orders/${result.order.id}`)
			}
		} catch {
			toast.error('Erro ao reservar. Tenta novamente.')
		}
	}

	const clearFilters = () => {
		setSearch('')
		setLocation('')
		setFuelType('')
		setTransmission('')
		setPage(1)
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8 fade-in">
				<h1 className="font-display text-4xl sm:text-5xl mb-2">Rent-a-Car</h1>
				<p className="text-text-secondary">
					Aluga uma viatura para o teu evento ou próxima viagem
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 mb-8 fade-in">
				<input
					type="text"
					placeholder="Pesquisar por marca, modelo..."
					value={search}
					onChange={(e) => { setSearch(e.target.value); setPage(1) }}
					className="input-field max-w-xs text-sm"
				/>
				<select
					value={location}
					onChange={(e) => { setLocation(e.target.value); setPage(1) }}
					className="input-field max-w-[140px] text-sm"
				>
					<option value="">Todas Localizações</option>
					{PROVINCES.map((p) => (
						<option key={p} value={p}>{p}</option>
					))}
				</select>
				<select
					value={fuelType}
					onChange={(e) => { setFuelType(e.target.value); setPage(1) }}
					className="input-field max-w-[140px] text-sm"
				>
					<option value="">Todos Combustíveis</option>
					{FUEL_TYPES.map((f) => (
						<option key={f} value={f}>{f}</option>
					))}
				</select>
				<select
					value={transmission}
					onChange={(e) => { setTransmission(e.target.value); setPage(1) }}
					className="input-field max-w-[150px] text-sm"
				>
					{TRANSMISSIONS.map((t) => (
						<option key={t.value} value={t.value}>{t.label}</option>
					))}
				</select>
				{(search || location || fuelType || transmission) && (
					<button onClick={clearFilters} className="btn-ghost text-sm h-11 px-4">
						Limpar Filtros
					</button>
				)}
			</div>

			{/* Results count */}
			{!isLoading && (
				<p className="text-xs text-text-secondary mb-4 font-heading">
					{data?.total ?? cars.length} viatura{(data?.total ?? cars.length) !== 1 ? 's' : ''} encontrada{(data?.total ?? cars.length) !== 1 ? 's' : ''}
				</p>
			)}

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
					{(search || location || fuelType || transmission) && (
						<button onClick={clearFilters} className="btn-outline mt-4 h-10 px-5 text-sm">
							Limpar Filtros
						</button>
					)}
				</Card>
			) : (
				<>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{cars.map((car, i) => (
							<div
								key={car.id}
								className="card overflow-hidden hover:shadow-lg transition-all duration-300 fade-in"
								style={{ animationDelay: `${i * 80}ms` }}
							>
								<Link to={`/rentals/${car.id}`}>
									<div className="aspect-[16/10] overflow-hidden">
										<img
											src={car.photos[0] ?? ''}
											alt={`${car.make} ${car.model}`}
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
											loading="lazy"
										/>
									</div>
								</Link>
								<div className="p-5">
									<div className="flex items-start justify-between mb-2">
										<div>
											<Link to={`/rentals/${car.id}`} className="hover:text-brand transition-colors">
												<h3 className="font-heading font-700 text-lg">
													{car.make} {car.model}
												</h3>
											</Link>
											<p className="text-xs text-text-secondary">
												{car.year} ·{' '}
												{car.transmission === 'auto' ? 'Automática' : 'Manual'}
											</p>
										</div>
										<Badge variant={car.available ? 'emerald' : 'gray'}>
											{car.available ? 'Disponível' : 'Indisponível'}
										</Badge>
									</div>

									<div className="flex items-center gap-3 text-xs text-text-secondary mb-4 flex-wrap">
										<span>{car.seats} lugares</span>
										<span>{car.location}</span>
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
												<Button
													size="sm"
													className="flex-1"
													onClick={handleReserve}
													loading={createBooking.isPending}
												>
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

					{/* Pagination */}
					{data && data.totalPages > 1 && (
						<div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
							<p className="text-sm text-text-secondary">
								Página {page} de {data.totalPages}
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page <= 1}
									className="btn-ghost h-10 px-4 text-sm disabled:opacity-40"
								>
									Anterior
								</button>
								<button
									onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
									disabled={page >= data.totalPages}
									className="btn-ghost h-10 px-4 text-sm disabled:opacity-40"
								>
									Seguinte
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
