import { Link } from 'react-router-dom'

export function Footer() {
	return (
		<footer className="bg-text text-white mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="md:col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
								<span className="text-white font-display text-lg leading-none">
									T
								</span>
							</div>
							<span className="font-display text-2xl tracking-wide">TicketZone</span>
						</div>
						<p className="text-gray-400 text-sm max-w-md">
							A plataforma de bilhetes mais confiável de Angola. Compre e venda
							bilhetes para os melhores eventos com segurança e praticidade.
						</p>
					</div>

					<div>
						<h3 className="font-heading font-700 text-sm mb-4 text-white/80 uppercase tracking-wider">
							Navegar
						</h3>
						<div className="flex flex-col gap-2">
							<Link
								to="/sobre"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Sobre
							</Link>
							<Link
								to="/como-funciona"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Como Funciona
							</Link>
							<Link
								to="/events"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Eventos
							</Link>
							<Link
								to="/rentals"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Rent-a-Car
							</Link>
						</div>
					</div>

					<div>
						<h3 className="font-heading font-700 text-sm mb-4 text-white/80 uppercase tracking-wider">
							Suporte
						</h3>
						<div className="flex flex-col gap-2">
							<Link
								to="/ajuda"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Ajuda
							</Link>
							<Link
								to="/termos"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Termos de Uso
							</Link>
							<Link
								to="/privacidade"
								className="text-sm text-gray-400 hover:text-white transition-colors"
							>
								Privacidade
							</Link>
						</div>
					</div>
				</div>

				<div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-gray-500">
						&copy; {new Date().getFullYear()} TicketZone. Todos os direitos reservados.
					</p>
					<div className="flex items-center gap-4">
						<span className="text-xs text-gray-500">Multicaixa Express</span>
						<span className="text-xs text-gray-500">PayPay</span>
						<span className="text-xs text-gray-500">Referências</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
