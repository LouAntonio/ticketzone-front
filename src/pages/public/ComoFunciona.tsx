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
		<div className="flex gap-5 slide-up" style={{ animationDelay: `${delay}ms` }}>
			<div className="flex flex-col items-center">
				<div className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center font-heading font-700 text-sm shrink-0">
					{String(number).padStart(2, '0')}
				</div>
				{number < 4 && <div className="w-0.5 flex-1 bg-border mt-2" />}
			</div>
			<div className="pb-8">
				<div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
					<svg
						width="22"
						height="22"
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
				<h3 className="font-heading font-700 text-base mb-1">{title}</h3>
				<p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
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
		icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		title: 'Recebe e Entra',
		desc: 'Os teus bilhetes chegam por email e WhatsApp. No dia do evento, apresenta o QR Code na entrada e pronto — é só aproveitar!',
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
		desc: 'Acompanha as vendas em tempo real, gere a lotação e comunica com os teus compradores através do painel.',
	},
	{
		icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		title: 'Valida os Bilhetes',
		desc: 'No dia do evento, usa o nosso validador para escanear os QR codes dos bilhetes na entrada, garantindo que só entram pessoas com bilhetes válidos.',
	},
]

export function ComoFunciona() {
	usePageTitle('Como Funciona | TicketZone')

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
							Como Funciona
						</h1>
						<p
							className="text-white/70 text-lg sm:text-xl font-body max-w-2xl slide-up"
							style={{ animationDelay: '100ms' }}
						>
							Simples, rápido e seguro — descobre como usar a TicketZone em poucos
							passos.
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="max-w-2xl mx-auto">
					<div className="text-center mb-12">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-wider">
							Para Compradores
						</span>
						<h2 className="font-display text-4xl sm:text-5xl mt-2 mb-3">
							Comprar Bilhetes
						</h2>
						<p className="text-text-secondary">
							Em apenas 4 passos tens os teus bilhetes na mão
						</p>
					</div>
					{buyerSteps.map((step, i) => (
						<StepCard key={step.title} number={i + 1} {...step} delay={i * 100} />
					))}
				</div>
			</section>

			<section className="bg-surface-card border-y border-border py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-2xl mx-auto">
						<div className="text-center mb-12">
							<span className="text-sm font-heading font-700 text-brand uppercase tracking-wider">
								Para Organizadores
							</span>
							<h2 className="font-display text-4xl sm:text-5xl mt-2 mb-3">
								Vender Bilhetes
							</h2>
							<p className="text-text-secondary">
								Tudo o que precisas para gerir os teus eventos
							</p>
						</div>
						{organizerSteps.map((step, i) => (
							<StepCard key={step.title} number={i + 1} {...step} delay={i * 100} />
						))}
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="card p-8 sm:p-12 bg-gradient-to-r from-brand to-brand-dark text-center">
					<h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
						Pronto para começar?
					</h2>
					<p className="text-white/70 max-w-lg mx-auto mb-8">
						Regista-te grátis e começa a explorar eventos ou a vender os teus bilhetes
						em menos de 5 minutos.
					</p>
					<div className="flex flex-wrap gap-3 justify-center">
						<Link
							to="/register"
							className="btn bg-white text-brand hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700 rounded-xl"
						>
							Criar Conta Grátis
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
