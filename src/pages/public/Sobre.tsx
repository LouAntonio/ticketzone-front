import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

const stats = [
	{ value: '500+', label: 'Eventos Realizados' },
	{ value: '50K+', label: 'Bilhetes Vendidos' },
	{ value: '15K+', label: 'Utilizadores Registados' },
	{ value: '50+', label: 'Parceiros' },
]

const values = [
	{
		icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		title: 'Confiança',
		desc: 'Garantimos transações seguras e transparentes em cada bilhete vendido na nossa plataforma.',
		color: 'bg-emerald-50 text-emerald-600',
	},
	{
		icon: 'M13 10V3L4 14h7v7l9-11h-7z',
		title: 'Inovação',
		desc: 'Trazemos tecnologia de ponta para o mercado angolano, com pagamentos móveis e bilhetes digitais.',
		color: 'bg-brand-soft text-brand',
	},
	{
		icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
		title: 'Acessibilidade',
		desc: 'Acreditamos que todos devem ter acesso fácil à cultura e entretenimento em Angola.',
		color: 'bg-blue-50 text-blue-600',
	},
	{
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		title: 'Comunidade',
		desc: 'Somos uma empresa angolana focada em fortalecer o ecossistema cultural e de eventos do país.',
		color: 'bg-pink-50 text-pink-600',
	},
]

export function Sobre() {
	usePageTitle('Sobre Nós | TicketZone')

	return (
		<div>
			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div
					className="absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
					}}
				/>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
					<div className="max-w-3xl">
						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-4 slide-up">
							Sobre a TicketZone
						</h1>
						<p
							className="text-white/70 text-lg sm:text-xl font-body max-w-2xl slide-up"
							style={{ animationDelay: '100ms' }}
						>
							A plataforma que está a transformar a forma como os angolanos compram e
							vendem bilhetes.
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="slide-up">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-wider">
							Quem Somos
						</span>
						<h2 className="font-display text-4xl sm:text-5xl mt-2 mb-6">
							A tua ponte
							<br />
							para o melhor
							<br />
							de Angola.
						</h2>
						<p className="text-text-secondary leading-relaxed mb-4">
							A TicketZone nasceu em Angola com a missão de democratizar o acesso a
							eventos em todo o país. Somos uma plataforma 100% angolana que conecta
							organizadores de eventos ao público, oferecendo uma experiência segura,
							prática e moderna na compra e venda de bilhetes.
						</p>
						<p className="text-text-secondary leading-relaxed">
							Acreditamos que cada evento — seja um festival, uma conferência, uma
							peça de teatro ou um concerto — merece ter os seus bilhetes vendidos de
							forma profissional, com transparência e sem complicações.
						</p>
					</div>
					<div className="slide-up" style={{ animationDelay: '150ms' }}>
						<div className="card p-8 sm:p-10">
							<div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-6">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-brand"
								>
									<path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
									<path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
								</svg>
							</div>
							<h3 className="font-heading font-700 text-lg mb-3">
								Presença Nacional
							</h3>
							<p className="text-text-secondary leading-relaxed text-sm">
								Estamos presentes nas 18 províncias de Angola, com uma rede de
								parceiros que nos permite levar os melhores eventos a cada canto do
								país. De Luanda ao Cunene, passando pelo Huambo e Benguela — a
								TicketZone é a tua plataforma de bilhetes onde quer que estejas.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-surface-card border-y border-border py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						{stats.map((stat, i) => (
							<div
								key={stat.label}
								className="text-center slide-up"
								style={{ animationDelay: `${i * 80}ms` }}
							>
								<div className="font-display text-4xl sm:text-5xl text-brand mb-1">
									{stat.value}
								</div>
								<div className="text-sm text-text-secondary font-heading font-500">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<span className="text-sm font-heading font-700 text-brand uppercase tracking-wider">
						Princípios
					</span>
					<h2 className="font-display text-4xl sm:text-5xl mt-2 mb-3">
						Os Nossos Valores
					</h2>
					<p className="text-text-secondary max-w-xl mx-auto">
						Princípios que guiam cada decisão na TicketZone
					</p>
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{values.map((v, i) => (
						<div
							key={v.title}
							className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 slide-up"
							style={{ animationDelay: `${i * 100}ms` }}
						>
							<div
								className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mb-4`}
							>
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d={v.icon} />
								</svg>
							</div>
							<h3 className="font-heading font-700 text-base mb-2">{v.title}</h3>
							<p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-gradient-to-br from-brand via-brand-dark to-brand-dark relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
					}}
				/>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
					<h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
						Vamos crescer juntos?
					</h2>
					<p className="text-white/70 max-w-lg mx-auto mb-8">
						Se és organizador de eventos, junta-te à TicketZone e começa a vender os
						teus bilhetes online.
					</p>
					<div className="flex flex-wrap gap-3 justify-center">
						<Link
							to="/register"
							className="btn bg-white text-brand hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700 rounded-xl"
						>
							Criar Conta de Promotor
						</Link>
						<Link
							to="/events"
							className="btn border-2 border-white/30 text-white hover:bg-white/10 h-12 px-8 text-sm font-heading font-700 rounded-xl"
						>
							Explorar Eventos
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}
