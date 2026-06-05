import { Link } from 'react-router-dom'
import { useFeaturedEvents } from '../../api/hooks/useEvents'
import { EventCard } from '../../components/shared/EventCard'
import { Button } from '../../components/ui/Button'
import { SkeletonCard } from '../../components/ui/Skeleton'

const categories = [
	{
		icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
		label: 'Conferências',
		color: 'bg-blue-50 text-blue-600',
		link: '/events?category=conference',
	},
	{
		icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
		label: 'Artes & Teatro',
		color: 'bg-pink-50 text-pink-600',
		link: '/events?category=theatre',
	},
	{
		icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
		label: 'Festivais',
		color: 'bg-brand-soft text-brand',
		link: '/events?category=festival',
	},
	{
		icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
		label: 'Família',
		color: 'bg-emerald-50 text-emerald-600',
		link: '/events?category=family',
	},
	{
		icon: 'M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z',
		label: 'Festas',
		color: 'bg-amber-50 text-amber-600',
		link: '/events?category=party',
	},
]

export function LandingPage() {
	const { data, isLoading } = useFeaturedEvents()

	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div
					className="absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
					}}
				/>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="fade-in">
							<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight text-white mb-6">
								O teu bilhete
								<br />
								para o melhor
								<br />
								de Angola.
							</h1>
							<p className="text-white/70 text-lg sm:text-xl max-w-lg mb-8 font-body">
								Descobre eventos incríveis, compra bilhetes com segurança e recebe
								tudo por email e WhatsApp.
							</p>
							<div className="flex flex-wrap gap-3">
								<Link
									to="/events"
									className="btn bg-white text-brand hover:bg-gray-100 h-13 px-8 text-base font-heading font-700 rounded-xl"
								>
									Explorar Eventos
								</Link>
								<Link
									to="/register"
									className="btn border-2 border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base font-heading font-700 rounded-xl"
								>
									Criar Evento
								</Link>
							</div>
						</div>

						<div className="hidden lg:flex justify-center">
							<div className="relative">
								<div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
									<div className="text-center">
										<div className="font-display text-8xl text-white mb-2">
											TZ
										</div>
										<div className="text-white/50 text-sm tracking-widest uppercase">
											Bilhetes Online
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-10">
					<h2 className="font-display text-4xl mb-3">Categorias</h2>
					<p className="text-text-secondary max-w-md mx-auto">
						Encontra o evento perfeito para cada ocasião
					</p>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
					{categories.map((cat) => (
						<Link
							key={cat.label}
							to={cat.link}
							className="card p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
						>
							<div
								className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center`}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d={cat.icon} />
								</svg>
							</div>
							<span className="text-sm font-heading font-600">{cat.label}</span>
						</Link>
					))}
				</div>
			</section>

			{/* Featured Events */}
			<section className="bg-surface-card py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-10">
						<div>
							<h2 className="font-display text-4xl mb-2">Eventos em Destaque</h2>
							<p className="text-text-secondary">
								Os eventos mais populares da TicketZone
							</p>
						</div>
						<Link to="/events" className="hidden sm:flex btn-ghost h-10 px-4 text-sm">
							Ver Todos
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
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</Link>
					</div>

					{isLoading ? (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className="fade-in"
									style={{ animationDelay: `${i * 100}ms` }}
								>
									<SkeletonCard />
								</div>
							))}
						</div>
					) : (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{data?.events?.slice(0, 3).map((event, i) => (
								<div
									key={event.id}
									className="fade-in"
									style={{ animationDelay: `${i * 100}ms` }}
								>
									<EventCard event={event} />
								</div>
							))}
						</div>
					)}

					<div className="mt-8 text-center sm:hidden">
						<Link to="/events" className="btn-outline h-11 px-6 text-sm">
							Ver Todos os Eventos
						</Link>
					</div>
				</div>
			</section>

			{/* Rent-a-Car teaser */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="card overflow-hidden bg-gradient-to-r from-brand to-brand-dark p-8 sm:p-12">
					<div className="grid sm:grid-cols-2 gap-8 items-center">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
										<circle cx="6.5" cy="16.5" r="2.5" />
										<circle cx="16.5" cy="16.5" r="2.5" />
									</svg>
								</div>
								<span className="text-white/70 text-sm font-heading font-600 uppercase tracking-wider">
									Rent-a-Car
								</span>
							</div>
							<h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
								Precisas de
								<br />
								uma viatura?
							</h2>
							<p className="text-white/70 mb-6">
								Aluga um carro para o teu evento ou simplesmente para a tua próxima
								viagem. Pacotes especiais disponíveis.
							</p>
							<Link
								to="/rentals"
								className="btn bg-white text-brand hover:bg-gray-100 h-11 px-6 text-sm rounded-xl font-heading font-700"
							>
								Ver Viaturas
							</Link>
						</div>
						<div className="hidden sm:flex justify-center">
							<svg
								width="200"
								height="120"
								viewBox="0 0 200 120"
								fill="none"
								className="text-white/20"
							>
								<rect
									x="10"
									y="30"
									width="180"
									height="60"
									rx="10"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<circle
									cx="50"
									cy="90"
									r="15"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<circle
									cx="150"
									cy="90"
									r="15"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<path d="M30 40h140v20H30z" fill="currentColor" fillOpacity="0.2" />
								<path
									d="M40 45l10-10h30l10 10"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
							</svg>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="bg-surface-card py-16 border-t border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="font-display text-3xl sm:text-4xl mb-3">
						Queres organizar eventos?
					</h2>
					<p className="text-text-secondary max-w-md mx-auto mb-8">
						Cria a tua conta de promotor e começa a vender bilhetes com a plataforma
						mais confiável de Angola.
					</p>
					<Link to="/register">
						<Button size="lg">Criar Conta de Promotor</Button>
					</Link>
				</div>
			</section>
		</div>
	)
}
