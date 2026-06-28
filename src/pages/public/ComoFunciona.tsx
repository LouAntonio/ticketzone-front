import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

interface StepProps {
	number: number
	icon: string
	title: string
	desc: string
	delay: number
}

function StepCard({ number, icon, title, desc, delay }: StepProps) {
	return (
		<div className="flex gap-6 slide-up" style={{ animationDelay: `${delay}ms` }}>
			<div className="flex flex-col items-center">
				<span className="font-display text-4xl sm:text-5xl text-brand leading-none -mt-1 select-none">
					{String(number).padStart(2, '0')}
				</span>
				{number < 4 && <div className="w-0.5 flex-1 bg-border mt-2 min-h-[2rem]" />}
			</div>
			<div className="pb-10 flex-1">
				<div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
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
						<path d={icon} />
					</svg>
				</div>
				<h3 className="font-heading font-700 text-base sm:text-lg mb-1.5">{title}</h3>
				<p className="text-text-secondary text-sm leading-relaxed max-w-lg">{desc}</p>
			</div>
		</div>
	)
}

const buyerSteps = [
	{
		icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		title: 'Explora os Eventos',
		desc: 'Navega pelos eventos disponíveis, filtra por categoria, província ou data. Encontra o evento perfeito para ti.',
	},
	{
		icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
		title: 'Seleciona os Bilhetes',
		desc: 'Escolhe o tipo e quantidade de bilhetes que precisas. Vê o mapa do recinto (se disponível) e seleciona os melhores lugares.',
	},
	{
		icon: 'M12 4v16m-8-8h16',
		title: 'Pagamento Seguro',
		desc: 'Escolhe o teu método de pagamento preferido: Multicaixa Express, PayPay ou Referências. A transação é 100% segura.',
	},
	{
		icon: 'M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm10-2h7v7h-7V3zm1 1v5h5V4h-5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm10-2h2v2h-2v-2zm2 0h2v2h-2v-2zm-2 3h2v2h-2v-2zm2 0h5v2h-5v-2zm-3-12h2v2h-2V5zm3 0h2v2h-2V5zm-3 6h2v2h-2v-2zm3 0h5v2h-5v-2zm-15 6h5v2H3v-2z',
		title: 'Entrada com QR Code',
		desc: 'Os teus bilhetes ficam armazenados na tua conta TicketZone. No dia do evento, apresenta o QR Code diretamente da plataforma na entrada.',
	},
]

const organizerSteps = [
	{
		icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
		title: 'Cria a tua Conta',
		desc: 'Regista-te como promotor e cria o teu perfil de organizador. O processo de verificação é rápido e simples.',
	},
	{
		icon: 'M12 6v6l4 2',
		title: 'Cria o Teu Evento',
		desc: 'Adiciona todos os detalhes do teu evento: data, local, preços, categorias de bilhetes, imagens e muito mais.',
	},
	{
		icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		title: 'Vende e Gere Vendas',
		desc: 'Acompanha as vendas em tempo real, gere a lotação e comunica com os compradores através do painel.',
	},
	{
		icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		title: 'Valida os Bilhetes',
		desc: 'No dia do evento, usa o nosso validador para escanear os QR codes dos bilhetes na entrada.',
	},
]

export function ComoFunciona() {
	usePageTitle('Como Funciona | TicketZone')

	return (
		<div>
			<section className="bg-surface border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 bg-brand-soft text-brand text-xs font-heading font-700 uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4 slide-up">
							Guia Rápido
						</div>
						<h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-text leading-none slide-up">
							Como
							<br />
							Funciona
						</h1>
						<div
							className="w-20 h-1 bg-brand rounded-full mt-6 mb-4 slide-up"
							style={{ animationDelay: '80ms' }}
						/>
						<p
							className="text-text-secondary text-lg max-w-xl slide-up"
							style={{ animationDelay: '120ms' }}
						>
							Simples, rápido e seguro — descobre como usar a TicketZone em poucos
							passos.
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-4xl mx-auto">
					<div className="mb-14">
						<span className="font-display text-4xl text-brand/20 leading-none select-none block -mb-3">
							01
						</span>
						<div className="flex items-center gap-4 mb-3">
							<h2 className="font-heading font-700 text-2xl sm:text-3xl text-text">
								Comprar Bilhetes e Addons
							</h2>
							<div className="flex-1 h-px bg-border hidden sm:block" />
						</div>
						<p className="text-text-secondary max-w-lg">
							Em apenas 4 passos garantes o teu lugar
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-x-12">
						{buyerSteps.map((step, i) => (
							<StepCard key={step.title} number={i + 1} {...step} delay={i * 80} />
						))}
					</div>
				</div>
			</section>

			<section className="bg-surface-card border-y border-border py-20 sm:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						<div className="mb-14">
							<span className="font-display text-4xl text-brand/20 leading-none select-none block -mb-3">
								02
							</span>
							<div className="flex items-center gap-4 mb-3">
								<h2 className="font-heading font-700 text-2xl sm:text-3xl text-text">
									Vender Bilhetes
								</h2>
								<div className="flex-1 h-px bg-border hidden sm:block" />
							</div>
							<p className="text-text-secondary max-w-lg">
								Tudo o que precisas para gerir os teus eventos
							</p>
						</div>
						<div className="grid md:grid-cols-2 gap-x-12">
							{organizerSteps.map((step, i) => (
								<StepCard
									key={step.title}
									number={i + 1}
									{...step}
									delay={i * 80}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
					<div className="absolute inset-0 pattern-diamonds" />
					<div className="relative px-8 sm:px-16 py-14 sm:py-20 text-center">
						<h2 className="font-display text-3xl sm:text-5xl text-white mb-4">
							Pronto para começar?
						</h2>
						<p className="text-white/70 max-w-lg mx-auto mb-10">
							Regista-te grátis e começa a explorar eventos ou a vender os teus
							bilhetes em menos de 5 minutos.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<Link
								to="/register"
								className="btn bg-white text-text hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700"
							>
								Criar Conta Grátis
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
