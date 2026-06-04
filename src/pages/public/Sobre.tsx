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
	},
	{
		icon: 'M13 10V3L4 14h7v7l9-11h-7z',
		title: 'Inovação',
		desc: 'Trazemos tecnologia de ponta para o mercado angolano, com pagamentos móveis e bilhetes digitais.',
	},
	{
		icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
		title: 'Acessibilidade',
		desc: 'Acreditamos que todos devem ter acesso fácil à cultura e entretenimento em Angola.',
	},
	{
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		title: 'Comunidade',
		desc: 'Somos uma empresa angolana focada em fortalecer o ecossistema cultural e de eventos do país.',
	},
]

export function Sobre() {
	usePageTitle('Sobre Nós | TicketZone')

	return (
		<div>
			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div className="absolute inset-0 pattern-diamonds opacity-[0.15]" />
				<div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
					<div className="relative">
						<span className="font-display text-[16rem] sm:text-[20rem] text-white/5 leading-none select-none absolute -top-24 -left-8 sm:-top-32 sm:-left-12 pointer-events-none">
							TZ
						</span>
						<div className="relative max-w-3xl">
							<h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-white mb-5 leading-none slide-up">
								Sobre a
								<br />
								TicketZone
							</h1>
							<div className="w-20 h-1 bg-white/40 rounded-full mb-5 slide-up" />
							<p
								className="text-white/70 text-lg sm:text-xl max-w-2xl slide-up"
								style={{ animationDelay: '100ms' }}
							>
								A plataforma que está a transformar a forma como os angolanos
								compram e vendem bilhetes.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-12 gap-10 items-start">
					<div className="lg:col-span-7 slide-up">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
							Quem Somos
						</span>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text mt-3 mb-8 leading-[1.1]">
							A tua ponte
							<br />
							para o melhor
							<br />
							de Angola.
						</h2>
						<p className="text-text-secondary leading-relaxed mb-5 max-w-xl">
							A TicketZone nasceu em Angola com a missão de democratizar o acesso a
							eventos em todo o país. Somos uma plataforma 100% angolana que conecta
							organizadores de eventos ao público, oferecendo uma experiência segura,
							prática e moderna na compra e venda de bilhetes.
						</p>
						<p className="text-text-secondary leading-relaxed max-w-xl">
							Acreditamos que cada evento — seja um festival, uma conferência, uma
							peça de teatro ou um concerto — merece ter os seus bilhetes vendidos de
							forma profissional, com transparência e sem complicações.
						</p>
					</div>
					<div
						className="lg:col-span-5 lg:mt-16 slide-up"
						style={{ animationDelay: '120ms' }}
					>
						<div className="bg-surface-card rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-border/50 relative">
							<div className="absolute -top-3 -right-3 w-6 h-6 bg-brand rounded-full" />
							<div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mb-6">
								<svg
									width="26"
									height="26"
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

			<section className="bg-surface-card border-y border-border py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						<div className="grid grid-cols-2 gap-8 sm:gap-12">
							{stats.map((stat, i) => (
								<div
									key={stat.label}
									className="text-left slide-up"
									style={{ animationDelay: `${i * 80}ms` }}
								>
									<div className="font-display text-5xl sm:text-6xl lg:text-7xl text-brand leading-none mb-1">
										{stat.value}
									</div>
									<div className="w-8 h-0.5 bg-brand/40 rounded-full mb-2" />
									<div className="text-sm text-text-secondary font-heading font-500">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-4xl mx-auto">
					<div className="mb-14">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
							Princípios
						</span>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text mt-3 leading-none">
							Os Nossos
							<br />
							Valores
						</h2>
						<div className="w-16 h-1 bg-brand rounded-full mt-5" />
					</div>
					<div className="grid sm:grid-cols-2 gap-5">
						{values.map((v, i) => (
							<div
								key={v.title}
								className="bg-surface-card rounded-2xl p-7 border-l-4 border-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 slide-up"
								style={{ animationDelay: `${i * 80}ms` }}
							>
								<div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-brand"
									>
										<path d={v.icon} />
									</svg>
								</div>
								<h3 className="font-heading font-700 text-base sm:text-lg mb-2">
									{v.title}
								</h3>
								<p className="text-text-secondary text-sm leading-relaxed">
									{v.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div className="absolute inset-0 pattern-diamonds opacity-[0.12]" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
					<span className="font-display text-[10rem] sm:text-[14rem] text-white/5 leading-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
						+
					</span>
					<div className="relative">
						<h2 className="font-display text-3xl sm:text-5xl text-white mb-4">
							Vamos crescer juntos?
						</h2>
						<p className="text-white/70 max-w-lg mx-auto mb-10">
							Se és organizador de eventos, junta-te à TicketZone e começa a vender os
							teus bilhetes online.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<Link
								to="/register"
								className="btn bg-white text-text hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700"
							>
								Criar Conta de Promotor
							</Link>
							<Link
								to="/events"
								className="btn border-2 border-white/25 text-white hover:bg-white/10 h-12 px-8 text-sm font-heading font-700"
							>
								Explorar Eventos
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
